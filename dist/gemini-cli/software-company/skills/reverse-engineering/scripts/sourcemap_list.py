#!/usr/bin/env python3
"""Find JavaScript/CSS source maps in a file or folder and list the original
sources they name. Optionally write embedded sourcesContent to a folder.
Pure stdlib. Remote map URLs are reported, never fetched.

Usage:
  python -I sourcemap_list.py <file-or-folder>                  # maps found, sources per map
  python -I sourcemap_list.py <folder> --sources 0              # list every source name
  python -I sourcemap_list.py <folder> --extract <outdir>       # write embedded sources (safe paths)
  python -I sourcemap_list.py --self-test
"""

import argparse
import base64
import json
import re
import sys
import tempfile
from pathlib import Path, PurePosixPath
from urllib.parse import unquote

CODE_EXT = {".js", ".mjs", ".cjs", ".css", ".jsx"}
SKIP_DIRS = {".git", ".svn"}
MAX_MAP = 64 * 1024 * 1024
MAX_FILES = 200_000
URL_RE = re.compile(rb"[#@]\s*sourceMappingURL\s*=\s*(\S+?)\s*(?:\*/)?\s*$", re.MULTILINE)


def find_reference(code_file):
    """Return the last sourceMappingURL in the file tail, or None."""
    with open(code_file, "rb") as f:
        f.seek(0, 2)
        f.seek(max(0, f.tell() - 1_000_000))                       # inline data: maps can be big
        tail = f.read()
    hits = URL_RE.findall(tail)
    return hits[-1].decode("utf-8", "replace") if hits else None


def load_map(text):
    m = json.loads(text)
    if not isinstance(m, dict):
        raise ValueError("map is not a JSON object")
    if "sections" in m:                                           # index map: merge sections
        merged = {"sources": [], "sourcesContent": []}
        for s in m["sections"]:
            sub = s.get("map") or {}
            merged["sources"] += sub.get("sources", [])
            merged["sourcesContent"] += sub.get("sourcesContent") or [None] * len(sub.get("sources", []))
        return merged
    return m


def resolve(code_file, ref):
    """→ (kind, map dict or None, where)."""
    if ref.startswith("data:"):
        head, _, payload = ref.partition(",")
        raw = base64.b64decode(payload) if ";base64" in head else unquote(payload).encode()
        return "inline", load_map(raw), "inline in " + code_file.name
    if re.match(r"^[a-z][a-z0-9+.-]*://", ref, re.I):
        return "remote (not fetched)", None, ref
    target = (code_file.parent / unquote(ref.split("?")[0])).resolve()
    if not target.is_file():
        return "missing", None, str(target)
    return "file", read_map_file(target), str(target)


def read_map_file(path):
    if path.stat().st_size > MAX_MAP:
        raise ValueError(f"{path.name} is larger than 64 MB")
    return load_map(path.read_text("utf-8", "replace"))


def safe_rel(source):
    """webpack:///./src/a.ts → src/a.ts · drops scheme, drive, '..' and empty parts."""
    s = re.sub(r"^[a-z][a-z0-9+.-]*:/*", "", source.replace("\\", "/"), flags=re.I)
    parts = [p for p in PurePosixPath(s).parts if p not in ("", ".", "..", "/") and ":" not in p]
    return PurePosixPath(*parts) if parts else None


def scan(root):
    root = Path(root)
    files = [root] if root.is_file() else (p for p in root.rglob("*") if not SKIP_DIRS & set(p.parts))
    results, seen_maps = [], set()
    for n, p in enumerate(files):
        if n > MAX_FILES:
            print(f"stopped after {MAX_FILES} files")
            break
        if not p.is_file():
            continue
        try:
            if p.suffix == ".map":
                if p.resolve() not in seen_maps:
                    seen_maps.add(p.resolve())
                    results.append((p, "file", read_map_file(p), str(p)))
            elif p.suffix in CODE_EXT:
                ref = find_reference(p)
                if ref:
                    kind, m, where = resolve(p, ref)
                    if kind == "file":
                        if Path(where) in seen_maps:
                            continue
                        seen_maps.add(Path(where))
                    results.append((p, kind, m, where))
        except (ValueError, json.JSONDecodeError, OSError) as e:
            results.append((p, f"unreadable ({e.__class__.__name__}: {str(e)[:80]})", None, str(p)))
    return results


def report(results, show_sources):
    total = embedded = 0
    for code, kind, m, where in results:
        if m is None:
            print(f"[{kind}] {code} → {where}")
            continue
        srcs = m.get("sources", [])
        content = m.get("sourcesContent") or []
        has = sum(1 for c in content if c)
        total, embedded = total + len(srcs), embedded + has
        print(f"[{kind}] {where}: {len(srcs)} sources, {has} with embedded content")
        for s in srcs[:show_sources or None]:
            print(f"    {s}")
    print(f"\n{len(results)} maps · {total} sources named · {embedded} with original text embedded")


def extract(results, outdir):
    out = Path(outdir).resolve()
    written = 0
    for _, _, m, _ in results:
        if not m:
            continue
        for src, text in zip(m.get("sources", []), m.get("sourcesContent") or []):
            rel = safe_rel(str(src)) if text else None
            if rel is None:
                continue
            target = (out / rel).resolve()
            if out not in target.parents:
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(text, "utf-8")
            written += 1
    print(f"wrote {written} original sources to {out} (later maps overwrite same-named files)")


def self_test():
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        m = {"version": 3, "sources": ["webpack:///./src/app.ts", "webpack:///../../../../evil.ts", "C:\\x\\win.ts"],
             "sourcesContent": ["export const a = 1", "evil", "win"], "mappings": ""}
        (tmp / "app.js").write_text("console.log(1)\n//# sourceMappingURL=app.js.map\n")
        (tmp / "app.js.map").write_text(json.dumps(m))
        inline = base64.b64encode(json.dumps({"version": 3, "sources": ["b.ts"], "mappings": ""}).encode()).decode()
        (tmp / "b.js").write_text(f"x()\n//# sourceMappingURL=data:application/json;base64,{inline}\n")
        (tmp / "c.css").write_text("a{}\n/*# sourceMappingURL=https://cdn.example/c.css.map */\n")
        (tmp / "d.js").write_text("y()\n//# sourceMappingURL=gone.map\n")
        res = scan(tmp)
        report(res, 5)
        kinds = sorted(k for _, k, _, _ in res)
        assert kinds == ["file", "inline", "missing", "remote (not fetched)"], kinds
        extract(res, tmp / "out")
        extract(res, tmp / "out")                                     # rerun is safe
        assert (tmp / "out/src/app.ts").read_text() == "export const a = 1"
        assert (tmp / "out/evil.ts").exists() and (tmp / "out/x/win.ts").exists()
        assert not (tmp.parent / "evil.ts").exists()
    print("self-test OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("path", nargs="?")
    ap.add_argument("--sources", type=int, default=10, help="source names shown per map, 0 = all")
    ap.add_argument("--extract", metavar="OUTDIR")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        return self_test()
    if not a.path or not Path(a.path).exists():
        ap.error("give an existing file or folder")
    res = scan(a.path)
    report(res, a.sources)
    if a.extract:
        extract(res, a.extract)


if __name__ == "__main__":
    sys.exit(main())
