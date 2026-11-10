#!/usr/bin/env python3
"""Describe a WebAssembly (.wasm) module: version, sections with sizes, imports,
exports, counts, custom sections and the producer toolchain. Pure stdlib; the
module is only parsed, never instantiated or run.

Usage:
  python -I wasm_info.py <file.wasm>              # summary, first 50 imports/exports
  python -I wasm_info.py <file.wasm> --limit 0    # everything
  python -I wasm_info.py <file.wasm> --json
  python -I wasm_info.py --self-test
"""

import argparse
import json
import sys
import tempfile
from pathlib import Path

MAX_MB = 256
MAX_ITEMS = 1_000_000                     # guard against bogus counts in damaged files
SECTIONS = {0: "custom", 1: "type", 2: "import", 3: "function", 4: "table", 5: "memory", 6: "global",
            7: "export", 8: "start", 9: "element", 10: "code", 11: "data", 12: "datacount", 13: "tag"}
KINDS = {0: "func", 1: "table", 2: "memory", 3: "global", 4: "tag"}


class Reader:
    def __init__(self, data, pos=0):
        self.d, self.pos = data, pos

    def byte(self):
        if self.pos >= len(self.d):
            raise ValueError("unexpected end of module")
        self.pos += 1
        return self.d[self.pos - 1]

    def leb(self):
        result = shift = 0
        while True:
            b = self.byte()
            result |= (b & 0x7F) << shift
            shift += 7
            if not b & 0x80:
                return result
            if shift > 70:
                raise ValueError("LEB128 number too long")

    def count(self):
        n = self.leb()
        if n > MAX_ITEMS:
            raise ValueError(f"implausible item count {n}")
        return n

    def name(self):
        n = self.leb()
        if self.pos + n > len(self.d):
            raise ValueError("name runs past end")
        self.pos += n
        return self.d[self.pos - n:self.pos].decode("utf-8", "replace")

    def limits(self):
        flag = self.byte()
        self.leb()
        if flag & 1:
            self.leb()


def read_import(r):
    module, field, kind = r.name(), r.name(), r.byte()
    if kind == 0:
        r.leb()
    elif kind == 1:
        r.byte()
        r.limits()
    elif kind == 2:
        r.limits()
    elif kind == 3:
        r.byte()
        r.byte()
    elif kind == 4:
        r.byte()
        r.leb()
    else:
        raise ValueError(f"unknown import kind {kind}")
    return {"module": module, "name": field, "kind": KINDS[kind]}


def read_producers(r):
    out = {}
    for _ in range(r.count()):
        field = r.name()
        out[field] = [f"{r.name()} {r.name()}".strip() for _ in range(r.count())]
    return out


def inspect(path):
    data = Path(path).read_bytes()
    if data[:4] != b"\0asm":
        raise ValueError("not a WebAssembly module (missing \\0asm magic)")
    if len(data) < 8:
        raise ValueError("truncated header")
    r = Reader(data, 8)
    info = {"version": int.from_bytes(data[4:8], "little"), "sections": [], "imports": [], "exports": [],
            "custom": [], "producers": {}, "counts": {}}
    defined = {"function": 0, "table": 0, "memory": 0, "global": 0, "data": 0}
    while r.pos < len(data):
        sid, size = r.byte(), r.leb()
        start, end = r.pos, r.pos + size
        if end > len(data):
            raise ValueError(f"section {sid} runs past end of file")
        label = SECTIONS.get(sid, f"unknown({sid})")
        s = Reader(data, start)
        if sid == 0:
            label = "custom:" + s.name()
            info["custom"].append(label[7:])
            if label == "custom:producers":
                info["producers"] = read_producers(s)
        elif sid == 2:
            info["imports"] = [read_import(s) for _ in range(s.count())]
        elif sid == 7:
            for _ in range(s.count()):
                name, kind = s.name(), s.byte()
                info["exports"].append({"name": name, "kind": KINDS.get(kind, str(kind)), "index": s.leb()})
        elif label in defined:
            defined[label] = s.count()
        info["sections"].append({"name": label, "size": size})
        r.pos = end
    imported = {k: sum(i["kind"] == k for i in info["imports"]) for k in ("func", "table", "memory", "global")}
    info["counts"] = {"imported_functions": imported["func"], "defined_functions": defined["function"],
                      "tables": imported["table"] + defined["table"], "memories": imported["memory"] + defined["memory"],
                      "globals": imported["global"] + defined["global"], "data_segments": defined["data"]}
    return info


def show(info, limit):
    print(f"WebAssembly version {info['version']}")
    print("\nsections:")
    for s in info["sections"]:
        print(f"  {s['size']:>10}  {s['name']}")
    print("\ncounts: " + ", ".join(f"{k}={v}" for k, v in info["counts"].items()))
    if info["producers"]:
        print("producers: " + "; ".join(f"{k}: {', '.join(v)}" for k, v in info["producers"].items()))
    if info["custom"]:
        print(f"custom sections: {', '.join(info['custom'])}")
    for title, rows, fmt in (("imports", info["imports"], lambda i: f"{i['module']}.{i['name']}  ({i['kind']})"),
                             ("exports", info["exports"], lambda e: f"{e['name']}  ({e['kind']} #{e['index']})")):
        print(f"\n{title} ({len(rows)}):")
        for row in rows[:limit or None]:
            print("  " + fmt(row))
        if limit and len(rows) > limit:
            print(f"  ... {len(rows) - limit} more (use --limit 0)")


def leb(n):
    out = bytearray()
    while True:
        b, n = n & 0x7F, n >> 7
        out.append(b | (0x80 if n else 0))
        if not n:
            return bytes(out)


def vec(items):
    return leb(len(items)) + b"".join(items)


def name(s):
    return leb(len(s)) + s.encode()


def section(sid, body):
    return bytes([sid]) + leb(len(body)) + body


def tiny_wasm():
    imports = vec([name("env") + name("log") + b"\x00" + leb(0), name("env") + name("mem") + b"\x02\x00" + leb(1)])
    exports = vec([name("run") + b"\x00" + leb(1), name("memory") + b"\x02" + leb(0)])
    producers = vec([name("language") + vec([name("Rust") + name("")]),
                     name("processed-by") + vec([name("rustc") + name("1.80.0")])])
    return (b"\0asm\x01\0\0\0" + section(1, vec([b"\x60\x00\x00"])) + section(2, imports) + section(3, vec([leb(0)]))
            + section(7, exports) + section(10, vec([b"\x02\x00\x0b"])) + section(11, vec([b"\x01\x00\x0b\x00"]))
            + section(0, name("name") + b"\x00") + section(0, name("producers") + producers))


def self_test():
    with tempfile.TemporaryDirectory() as tmp:
        good, junk, cut = Path(tmp, "t.wasm"), Path(tmp, "j.wasm"), Path(tmp, "c.wasm")
        good.write_bytes(tiny_wasm())
        junk.write_bytes(b"MZ not wasm")
        cut.write_bytes(tiny_wasm()[:30])
        i = inspect(good)
        assert i["version"] == 1 and [s["name"] for s in i["sections"]][:3] == ["type", "import", "function"], i
        assert i["imports"][0] == {"module": "env", "name": "log", "kind": "func"}, i["imports"]
        assert i["exports"] == [{"name": "run", "kind": "func", "index": 1}, {"name": "memory", "kind": "memory", "index": 0}]
        assert i["counts"] == {"imported_functions": 1, "defined_functions": 1, "tables": 0, "memories": 1,
                               "globals": 0, "data_segments": 1}, i["counts"]
        assert i["custom"] == ["name", "producers"] and i["producers"]["language"] == ["Rust"], i
        assert i["producers"]["processed-by"] == ["rustc 1.80.0"], i["producers"]
        for bad in (junk, cut):
            try:
                inspect(bad)
                raise AssertionError("bad module accepted")
            except ValueError:
                pass
        show(i, 5)
    print("self-test OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", nargs="?")
    ap.add_argument("--limit", type=int, default=50, help="items per list, 0 = all")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        return self_test()
    if not a.file or not Path(a.file).is_file():
        ap.error("give an existing .wasm file")
    if Path(a.file).stat().st_size > MAX_MB * 1024 * 1024:
        ap.error(f"larger than {MAX_MB} MB")
    try:
        info = inspect(a.file)
    except ValueError as e:
        print(f"error: {e}", file=sys.stderr)
        sys.exit(2)
    print(json.dumps(info, indent=1)) if a.json else show(info, a.limit)


if __name__ == "__main__":
    main()
