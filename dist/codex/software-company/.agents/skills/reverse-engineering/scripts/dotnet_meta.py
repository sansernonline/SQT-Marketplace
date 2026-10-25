#!/usr/bin/env python3
"""List .NET assembly metadata without ilspycmd. Pure stdlib, read-only.

Shows: assembly name/version, references, types, methods per type, P/Invoke
imports, embedded resource names, user-string count. Static reading only; the
assembly is never loaded or run.

Usage:
  python dotnet_meta.py <file.dll|exe>
  python dotnet_meta.py <file> --strings          # also print user strings, secrets masked
  python dotnet_meta.py <file> --no-methods       # types only (shorter output)
  python dotnet_meta.py <file> --json

Not supported: single-file bundles (extract first), tables behind #- pointer
tables (rare, unoptimised metadata keeps working but method grouping may shift).
"""

import argparse
import json
import re
import struct
import sys

BUNDLE_MARKER = bytes.fromhex("8b1202b96a612038727b930214d7a03213f5b9e6efae3318ee3b2dce24b36aae")
METADATA_MAGIC = 0x424A5342

# Table ids used by name below
MODULE, TYPEREF, TYPEDEF, FIELD, METHODDEF, PARAM, MEMBERREF = 0, 1, 2, 4, 6, 8, 10
MODULEREF, IMPLMAP, ASSEMBLY, ASSEMBLYREF, MANIFESTRES, NESTED = 26, 28, 32, 35, 40, 41

# coded index: (tag bits, tables by tag value; None = unused tag)
CODED = {
    "TypeDefOrRef": (2, [2, 1, 27]),
    "HasConstant": (2, [4, 8, 23]),
    "HasCustomAttribute": (5, [6, 4, 1, 2, 8, 9, 10, 0, 14, 23, 20, 17, 26, 27, 32, 35, 38, 39, 40, 42, 44, 43]),
    "HasFieldMarshal": (1, [4, 8]),
    "HasDeclSecurity": (2, [2, 6, 32]),
    "MemberRefParent": (3, [2, 1, 26, 6, 27]),
    "HasSemantics": (1, [20, 23]),
    "MethodDefOrRef": (1, [6, 10]),
    "MemberForwarded": (1, [4, 6]),
    "Implementation": (2, [38, 35, 39]),
    "CustomAttributeType": (3, [None, None, 6, 10, None]),
    "ResolutionScope": (2, [0, 26, 35, 1]),
    "TypeOrMethodDef": (1, [2, 6]),
}

# column kinds: u1 u2 u4 fixed · S #Strings · G #GUID · B #Blob · T:n table index · C:name coded index
TABLES = {
    0: "u2 S G G G", 1: "C:ResolutionScope S S", 2: "u4 S S C:TypeDefOrRef T:4 T:6",
    3: "T:4", 4: "u2 S B", 5: "T:6", 6: "u4 u2 u2 S B T:8", 7: "T:8", 8: "u2 u2 S",
    9: "T:2 C:TypeDefOrRef", 10: "C:MemberRefParent S B", 11: "u2 C:HasConstant B",
    12: "C:HasCustomAttribute C:CustomAttributeType B", 13: "C:HasFieldMarshal B",
    14: "u2 C:HasDeclSecurity B", 15: "u2 u4 T:2", 16: "u4 T:4", 17: "B", 18: "T:2 T:20",
    19: "T:20", 20: "u2 S C:TypeDefOrRef", 21: "T:2 T:23", 22: "T:23", 23: "u2 S B",
    24: "u2 T:6 C:HasSemantics", 25: "T:2 C:MethodDefOrRef C:MethodDefOrRef", 26: "S", 27: "B",
    28: "u2 C:MemberForwarded S T:26", 29: "u4 T:4", 30: "u4 u4", 31: "u4",
    32: "u4 u2 u2 u2 u2 u4 B S S", 33: "u4", 34: "u4 u4 u4", 35: "u2 u2 u2 u2 u4 B S S B",
    36: "u4 T:35", 37: "u4 u4 u4 T:35", 38: "u4 S B", 39: "u4 u4 S S C:Implementation",
    40: "u4 u4 S C:Implementation", 41: "T:2 T:2", 42: "u2 u2 C:TypeOrMethodDef S",
    43: "C:MethodDefOrRef B", 44: "T:42 C:TypeDefOrRef",
}

_KEYED = r"\w*(?:pass|pwd|secret|api[_-]?key|token)\w*"
_MASKS = (
    re.compile(r"(?i)(\b" + _KEYED + r"\s*[=:]\s*[\"']?)([^;\"'\s]+)"),
    re.compile(r"(?i)(\bBearer\s+)(\S+)"),
)
_WHOLE_SECRET = re.compile(r"eyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]*|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY")


def redact(s):
    """Mask password-like values, bearer tokens, JWTs, AWS keys, private keys."""
    if _WHOLE_SECRET.search(s):
        return "***"
    for rx in _MASKS:
        s = rx.sub(lambda m: m.group(1) + "***", s)
    return s


def fail(msg):
    print(msg, file=sys.stderr)
    sys.exit(1)


def read_cli_header(data):
    """Return (metadata file offset, metadata size, cli flags) or None if no CLI header."""
    if data[:2] != b"MZ":
        fail("not a PE file (no MZ header)")
    pe = struct.unpack_from("<I", data, 0x3C)[0]
    if data[pe:pe + 4] != b"PE\0\0":
        fail("not a PE file (no PE signature)")
    nsec, = struct.unpack_from("<H", data, pe + 6)
    opt_size, = struct.unpack_from("<H", data, pe + 20)
    opt = pe + 24
    magic, = struct.unpack_from("<H", data, opt)
    dirs = opt + (96 if magic == 0x10B else 112)
    cli_rva, cli_size = struct.unpack_from("<II", data, dirs + 14 * 8)
    if cli_rva == 0:
        return None
    sections = [struct.unpack_from("<IIII", data, opt + opt_size + 40 * i + 8) for i in range(nsec)]

    def to_offset(rva):
        for vsize, va, raw_size, raw in sections:
            if va <= rva < va + max(vsize, raw_size):
                return rva - va + raw
        fail(f"RVA 0x{rva:x} is outside every section (damaged file)")

    cb, major, minor, md_rva, md_size, flags = struct.unpack_from("<IHHIII", data, to_offset(cli_rva))
    return to_offset(md_rva), md_size, flags


def read_streams(data, root):
    if struct.unpack_from("<I", data, root)[0] != METADATA_MAGIC:
        fail("metadata root signature (BSJB) not found")
    version_len, = struct.unpack_from("<I", data, root + 12)
    pos = root + 16 + version_len
    runtime = data[root + 16:root + 16 + version_len].split(b"\0")[0].decode("ascii", "replace")
    count, = struct.unpack_from("<H", data, pos + 2)
    pos += 4
    streams = {}
    for _ in range(count):
        offset, size = struct.unpack_from("<II", data, pos)
        end = data.index(b"\0", pos + 8)
        streams[data[pos + 8:end].decode("ascii")] = (root + offset, size)
        pos = (end + 1 + 3) & ~3
    return runtime, streams


class Heaps:
    def __init__(self, data, streams):
        self.data = data
        self.streams = streams

    def string(self, index):
        start = self.streams["#Strings"][0] + index
        return self.data[start:self.data.index(b"\0", start)].decode("utf-8", "replace")

    def user_strings(self):
        if "#US" not in self.streams:
            return []
        start, size = self.streams["#US"]
        pos, end, found = start + 1, start + size, []
        while pos < end:
            length, pos = read_compressed(self.data, pos)
            if length > 1:
                found.append(self.data[pos:pos + length - 1].decode("utf-16-le", "replace"))
            pos += length
        return found


def read_compressed(data, pos):
    first = data[pos]
    if first < 0x80:
        return first, pos + 1
    if first < 0xC0:
        return ((first & 0x3F) << 8) | data[pos + 1], pos + 2
    return struct.unpack_from(">I", data, pos)[0] & 0x1FFFFFFF, pos + 4


class Tables:
    """Reads rows of the #~ stream; rows are tuples of ints, 1-based indexes like the spec."""

    def __init__(self, data, start):
        heap_sizes = data[start + 6]
        valid, = struct.unpack_from("<Q", data, start + 8)
        pos = start + 24
        self.data = data
        self.rows = {}
        for t in range(64):
            if valid >> t & 1:
                self.rows[t], = struct.unpack_from("<I", data, pos)
                pos += 4
        if heap_sizes & 0x40:
            pos += 4
        self.heap_wide = {"S": heap_sizes & 1, "G": heap_sizes & 2, "B": heap_sizes & 4}
        self.schema, self.offset = {}, {}
        for t in sorted(self.rows):
            if t not in TABLES:
                fail(f"unknown metadata table 0x{t:02x}")
            cols = [self.column_width(spec) for spec in TABLES[t].split()]
            self.schema[t] = cols
            self.offset[t] = pos
            pos += sum(w for _, w in cols) * self.rows[t]

    def column_width(self, spec):
        if spec[0] in "SGB":
            return spec, 4 if self.heap_wide[spec] else 2
        if spec[0] == "u":
            return spec, int(spec[1])
        kind, arg = spec.split(":")
        if kind == "T":
            return spec, 4 if self.rows.get(int(arg), 0) >= 1 << 16 else 2
        bits, targets = CODED[arg]
        biggest = max((self.rows.get(t, 0) for t in targets if t is not None), default=0)
        return spec, 4 if biggest >= 1 << (16 - bits) else 2

    def count(self, table):
        return self.rows.get(table, 0)

    def row(self, table, index):
        cols = self.schema[table]
        pos = self.offset[table] + (index - 1) * sum(w for _, w in cols)
        values = []
        for _, width in cols:
            values.append(int.from_bytes(self.data[pos:pos + width], "little"))
            pos += width
        return values


def type_flags(flags):
    visibility = {0: "internal", 1: "public", 2: "nested public", 3: "nested private",
                  4: "nested family", 5: "nested internal", 6: "nested private protected",
                  7: "nested protected internal"}[flags & 7]
    out = [visibility]
    if flags & 0x20:
        out.append("interface")
    if flags & 0x80:
        out.append("abstract")
    return out


def read_types(tables, heaps):
    """TypeDef list with full names and the MethodDef names each type owns."""
    n_types, n_methods = tables.count(TYPEDEF), tables.count(METHODDEF)
    rows = [tables.row(TYPEDEF, i) for i in range(1, n_types + 1)]
    outer_of = {}
    for i in range(1, tables.count(NESTED) + 1):
        nested, outer = tables.row(NESTED, i)
        outer_of[nested] = outer

    def full_name(i):
        flags, name, ns = rows[i - 1][:3]
        short = heaps.string(name)
        if i in outer_of:
            return full_name(outer_of[i]) + "+" + short
        return heaps.string(ns) + "." + short if heaps.string(ns) else short

    types = []
    for i, row in enumerate(rows, 1):
        first = row[5]
        last = rows[i][5] if i < n_types else n_methods + 1
        methods = [heaps.string(tables.row(METHODDEF, m)[3]) for m in range(first, last)]
        types.append({"name": full_name(i), "flags": type_flags(row[0]), "methods": methods,
                      "first_method": first, "end_method": last})
    return types


def read_pinvokes(tables, heaps, types):
    def owner(method):
        return next((t["name"] for t in types if t["first_method"] <= method < t["end_method"]), "?")

    result = []
    for i in range(1, tables.count(IMPLMAP) + 1):
        _, forwarded, import_name, scope = tables.row(IMPLMAP, i)
        if forwarded & 1 == 0:
            continue
        method = forwarded >> 1
        dll = heaps.string(tables.row(MODULEREF, scope)[0]) if scope else ""
        result.append({"method": owner(method) + "." + heaps.string(tables.row(METHODDEF, method)[3]),
                       "import": heaps.string(import_name), "dll": dll})
    return result


def read_references(tables, heaps):
    refs = []
    for i in range(1, tables.count(ASSEMBLYREF) + 1):
        r = tables.row(ASSEMBLYREF, i)
        refs.append({"name": heaps.string(r[6]), "version": "%d.%d.%d.%d" % tuple(r[:4])})
    return refs


def read_resources(tables, heaps):
    names = []
    for i in range(1, tables.count(MANIFESTRES) + 1):
        _, _, name, impl = tables.row(MANIFESTRES, i)
        names.append({"name": heaps.string(name), "embedded": impl == 0})
    return names


def analyse(data):
    header = read_cli_header(data)
    if header is None:
        if BUNDLE_MARKER in data:
            return {"error": "single-file bundle: not supported, extract first"}
        return {"error": "not a .NET assembly (no CLI header)"}
    md_offset, _, cli_flags = header
    runtime, streams = read_streams(data, md_offset)
    table_stream = streams.get("#~") or streams.get("#-")
    if table_stream is None or "#Strings" not in streams:
        fail("metadata has no #~/#- or #Strings stream")
    heaps, tables = Heaps(data, streams), Tables(data, table_stream[0])
    assembly = {}
    if tables.count(ASSEMBLY):
        a = tables.row(ASSEMBLY, 1)
        assembly = {"name": heaps.string(a[7]), "version": "%d.%d.%d.%d" % tuple(a[1:5])}
    types = read_types(tables, heaps)
    pinvoke = read_pinvokes(tables, heaps, types)
    for t in types:
        del t["first_method"], t["end_method"]
    return {
        "runtime": runtime,
        "streams": sorted(streams),
        "il_only": bool(cli_flags & 1),
        "strong_name_signed": bool(cli_flags & 8),
        "assembly": assembly,
        "assembly_refs": read_references(tables, heaps),
        "types": types,
        "pinvoke": pinvoke,
        "resources": read_resources(tables, heaps),
        "user_strings": heaps.user_strings(),
    }


def print_text(info, show_methods):
    asm = info["assembly"]
    print(f"Assembly: {asm.get('name', '?')} {asm.get('version', '')}  runtime metadata: {info['runtime']}")
    print(f"Streams: {', '.join(info['streams'])}  IL-only: {info['il_only']}  strong-named: {info['strong_name_signed']}")
    print(f"\nAssemblyRef ({len(info['assembly_refs'])})")
    for r in info["assembly_refs"]:
        print(f"  {r['name']} {r['version']}")
    print(f"\nTypeDef ({len(info['types'])})")
    for t in info["types"]:
        print(f"  {t['name']}  [{', '.join(t['flags'])}]  {len(t['methods'])} methods")
        if show_methods:
            for m in t["methods"]:
                print(f"      {m}")
    print(f"\nP/Invoke ({len(info['pinvoke'])})")
    for p in info["pinvoke"]:
        print(f"  {p['method']} -> {p['dll']}!{p['import']}")
    print(f"\nResources ({len(info['resources'])})")
    for r in info["resources"]:
        print(f"  {r['name']}{'' if r['embedded'] else '  (linked, not embedded)'}")
    print(f"\nUser strings: {info['user_string_count']}")
    for s in info["user_strings"]:
        print("  " + repr(s))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file")
    ap.add_argument("--strings", action="store_true", help="print user strings, secrets masked")
    ap.add_argument("--no-methods", action="store_true", help="do not list methods under each type")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    with open(args.file, "rb") as f:
        data = f.read()
    try:
        info = analyse(data)
    except (struct.error, ValueError, IndexError):
        fail("damaged or unexpected metadata layout")
    if "error" in info:
        print(info["error"])
        sys.exit(2)
    info["user_string_count"] = len(info["user_strings"])
    info["user_strings"] = [redact(s) for s in info["user_strings"]] if args.strings else []
    if args.json:
        if args.no_methods:
            for t in info["types"]:
                t["methods"] = len(t["methods"])
        print(json.dumps(info, indent=2, ensure_ascii=False))
    else:
        print_text(info, not args.no_methods)


if __name__ == "__main__":
    main()
