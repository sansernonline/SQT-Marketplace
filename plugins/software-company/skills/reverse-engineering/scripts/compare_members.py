#!/usr/bin/env python3
"""Compare method names between two source trees — typically decompiled output
and the source you were handed — to find what the deployed binary has that the
source does not (or the reverse). C# and Java. Pure stdlib.

Usage:
  python compare_members.py <decompiled_dir> <source_dir>
  python compare_members.py <decompiled_dir> <source_dir> --ext .java
  python compare_members.py --self-test
"""

import argparse
import re
from collections import Counter
from pathlib import Path

SKIP_DIRS = {"bin", "obj", "node_modules", "packages", ".svn", ".git"}
# access modifier ... Name(   — good enough for a drift signal, not a parser
METHOD = re.compile(
    r"^\s*(?:public|private|protected|internal)\b[^=;(]*?\b([A-Za-z_]\w*)\s*\(",
    re.MULTILINE,
)
CLASS = re.compile(r"^\s*(?:[a-z]+\s+)*(?:class|struct|interface|enum)\s+([A-Za-z_]\w*)", re.MULTILINE)
KEYWORDS ={"if", "for", "foreach", "while", "switch", "catch", "using", "lock", "return", "new"}


def members(root, ext):
    found = Counter()
    for path in Path(root).rglob(f"*{ext}"):
        if SKIP_DIRS & set(p.lower() for p in path.parts):
            continue
        # key by enclosing class, tracked by brace depth — source often holds several
        # classes per file, decompilers write one file per class and hoist nested ones
        stack, depth = [], 0
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            if line.lstrip().startswith("//"):
                continue
            cls = CLASS.match(line)
            if cls:
                stack.append((cls.group(1), depth))
            else:
                m = METHOD.match(line)
                if m and m.group(1) not in KEYWORDS and stack and m.group(1) != stack[-1][0]:
                    found[f"{stack[-1][0]}.{m.group(1)}"] += 1
            depth += line.count("{") - line.count("}")
            while stack and depth <= stack[-1][1] and "}" in line:
                stack.pop()
    return found


def self_test():
    """Two tiny trees: the decompiled one has an extra method and one more overload."""
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        a, b = Path(tmp, "bin_side"), Path(tmp, "src_side")
        a.mkdir(), b.mkdir()
        (b / "A.cs").write_text("class A {\n  public int Run(int x) {\n    if (x > 0) { return 1; }\n    return 0;\n  }\n"
                                "  private void Old() { }\n}\n", encoding="utf-8")
        (a / "A.cs").write_text("class A {\n  public int Run(int x) { return 1; }\n  public int Run(string s) { return 2; }\n"
                                "  public void Hidden() { }\n}\n", encoding="utf-8")
        got_bin, got_src = members(a, ".cs"), members(b, ".cs")
        assert got_bin == Counter({"A.Run": 2, "A.Hidden": 1}), got_bin
        assert got_src == Counter({"A.Run": 1, "A.Old": 1}), got_src  # `if` is not a method
    print("self-test ok")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("decompiled", nargs="?")
    ap.add_argument("source", nargs="?")
    ap.add_argument("--ext", default=".cs")
    ap.add_argument("--self-test", action="store_true", help="run built-in checks and exit")
    args = ap.parse_args()
    if args.self_test:
        return self_test()
    if not (args.decompiled and args.source):
        ap.error("give <decompiled_dir> <source_dir>, or --self-test")

    binary, source = members(args.decompiled, args.ext), members(args.source, args.ext)
    if not binary or not source:
        raise SystemExit(f"no methods found (binary={len(binary)}, source={len(source)}) — check paths")

    only_bin = sorted(set(binary) - set(source))
    only_src = sorted(set(source) - set(binary))
    overloads = sorted(k for k in set(binary) & set(source) if binary[k] != source[k])

    print(f"methods: binary={len(binary)} source={len(source)} shared={len(set(binary) & set(source))}")
    for title, rows in (("only in binary (deployed but not in source?)", only_bin),
                        ("only in source (not deployed yet, or compiler-removed)", only_src),
                        ("overload count differs", overloads)):
        print(f"\n--- {title}: {len(rows)} ---")
        for r in rows:
            print(r)


if __name__ == "__main__":
    main()
