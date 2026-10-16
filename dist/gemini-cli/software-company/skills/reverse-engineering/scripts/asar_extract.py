#!/usr/bin/env python3
"""List or extract an Electron .asar archive without running anything. Pure stdlib.

Every path inside the archive is checked: '..', absolute paths, drive letters and
symlinks are refused, so nothing is written outside the output folder.

Usage:
  python -I asar_extract.py list <app.asar>             # paths, sizes, flags, hints
  python -I asar_extract.py extract <app.asar> <outdir> # outdir is created; rerun overwrites
  python -I asar_extract.py --self-test
"""

import argparse
import hashlib
import json
import struct
import sys
import tempfile
from pathlib import Path, PurePosixPath

MAX_HEADER = 64 * 1024 * 1024          # a real header is a few MB at most
HINTS = ("package.json", ".map", ".node", "preload")


def read_header(f):
    """Chromium pickle: u32 4 · u32 N · [u32 payload · u32 len · JSON] → (header, data_start)."""
    head = f.read(16)
    if len(head) < 16:
        raise ValueError("file too short for an ASAR header")
    four, size, _payload, json_len = struct.unpack("<4I", head)
    if four != 4 or not 8 <= size <= MAX_HEADER or json_len > size - 8:
        raise ValueError("not an ASAR archive (bad pickle header)")
    raw = f.read(json_len)
    if len(raw) != json_len:
        raise ValueError("ASAR header is truncated")
    return json.loads(raw.decode("utf-8")), 8 + size


def safe_part(name):
    bad = not name or name in (".", "..") or any(c in name for c in '/\\:\0')
    if bad:
        raise ValueError(f"unsafe path part {name!r}")
    return name


def walk(node, prefix=PurePosixPath()):
    """Yield (path, entry) for every file; directories recurse, symlinks are reported, not followed."""
    for name, entry in node.get("files", {}).items():
        path = prefix / safe_part(name)
        if "files" in entry:
            yield from walk(entry, path)
        else:
            yield path, entry


def entries(asar):
    with open(asar, "rb") as f:
        header, start = read_header(f)
    total = Path(asar).stat().st_size
    out = []
    for path, e in walk(header):
        kind = "link" if "link" in e else "unpacked" if e.get("unpacked") else "packed"
        size = int(e.get("size", 0))
        offset = int(e.get("offset", 0)) + start if kind == "packed" else None
        if offset is not None and (size < 0 or offset + size > total):
            raise ValueError(f"{path}: offset/size points outside the file")
        out.append({"path": str(path), "size": size, "kind": kind, "offset": offset,
                    "exec": bool(e.get("executable")), "integrity": e.get("integrity", {}).get("hash")})
    return out


def cmd_list(asar):
    items = entries(asar)
    for it in items:
        flags = it["kind"] + (" exec" if it["exec"] else "")
        print(f"{it['size']:>10}  {flags:<14} {it['path']}")
    hints = [it["path"] for it in items if any(h in it["path"] for h in HINTS)]
    print(f"\n{len(items)} files · {sum(i['size'] for i in items):,} bytes")
    for h in hints[:40]:
        print(f"look at: {h}")
    unpacked = sum(1 for i in items if i["kind"] == "unpacked")
    if unpacked:
        print(f"{unpacked} files live beside the archive in {Path(asar).name}.unpacked/ (not inside it)")


def cmd_extract(asar, outdir):
    out = Path(outdir).resolve()
    out.mkdir(parents=True, exist_ok=True)
    written = skipped = mismatched = 0
    with open(asar, "rb") as f:
        for it in entries(asar):
            target = (out / it["path"]).resolve()
            if out not in target.parents:
                raise ValueError(f"{it['path']}: would land outside {out}")
            if it["kind"] != "packed":
                skipped += 1
                continue
            f.seek(it["offset"])
            data = f.read(it["size"])
            if it["integrity"] and hashlib.sha256(data).hexdigest() != it["integrity"]:
                mismatched += 1
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            written += 1
    print(f"extracted {written} files to {out}")
    if skipped:
        print(f"skipped {skipped} links or .unpacked files (copy .unpacked/ yourself if needed)")
    if mismatched:
        print(f"WARNING: {mismatched} files do not match their integrity hash — archive was modified")


def build_asar(path, files):
    """Test helper: files = {posix path: bytes}. Writes a minimal valid archive."""
    tree, blob = {"files": {}}, b""
    for name, data in files.items():
        node = tree
        *dirs, leaf = name.split("/")
        for d in dirs:
            node = node["files"].setdefault(d, {"files": {}})
        node["files"][leaf] = {"size": len(data), "offset": str(len(blob)),
                               "integrity": {"algorithm": "SHA256", "hash": hashlib.sha256(data).hexdigest()}}
        blob += data
    js = json.dumps(tree).encode()
    pad = b"\0" * (-len(js) % 4)
    pickle = struct.pack("<II", 4 + len(js) + len(pad), len(js)) + js + pad
    Path(path).write_bytes(struct.pack("<II", 4, len(pickle)) + pickle + blob)


def self_test():
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        good = tmp / "good.asar"
        build_asar(good, {"package.json": b'{"main":"main.js"}', "src/main.js": b"console.log(1)"})
        cmd_list(good)
        cmd_extract(good, tmp / "out")
        assert (tmp / "out/src/main.js").read_bytes() == b"console.log(1)"
        cmd_extract(good, tmp / "out")                       # rerun is safe
        for evil in ("../evil.txt", "a/../../evil.txt", "C:/evil.txt", "/etc/evil"):
            bad = tmp / "bad.asar"
            build_asar(bad, {evil: b"x"})
            try:
                cmd_extract(bad, tmp / "out2")
                raise AssertionError(f"traversal not refused: {evil}")
            except ValueError:
                pass
        assert not (tmp / "evil.txt").exists()
        (tmp / "junk.asar").write_bytes(b"PK\3\4 not an asar at all")
        try:
            entries(tmp / "junk.asar")
            raise AssertionError("junk accepted")
        except ValueError:
            pass
    print("self-test OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", nargs="?", choices=["list", "extract"])
    ap.add_argument("asar", nargs="?")
    ap.add_argument("outdir", nargs="?")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        return self_test()
    if not a.command or not a.asar or (a.command == "extract" and not a.outdir):
        ap.error("need: list <asar> | extract <asar> <outdir>")
    if not Path(a.asar).is_file():
        ap.error(f"not a file: {a.asar}")
    try:
        cmd_list(a.asar) if a.command == "list" else cmd_extract(a.asar, a.outdir)
    except (ValueError, json.JSONDecodeError, UnicodeDecodeError) as e:
        sys.exit(f"error: {e}")


if __name__ == "__main__":
    main()
