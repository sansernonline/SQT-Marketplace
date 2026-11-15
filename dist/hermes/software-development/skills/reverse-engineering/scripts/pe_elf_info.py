#!/usr/bin/env python3
"""Headers, sections, imports and exports of a PE (.exe/.dll) or ELF file, read
with struct only — nothing is loaded or run. Mach-O gets header + linked dylibs.

Usage:
  python -I pe_elf_info.py <file>                 # summary, first 50 imports/exports
  python -I pe_elf_info.py <file> --limit 0       # everything
  python -I pe_elf_info.py <file> --json
  python -I pe_elf_info.py --self-test
"""

import argparse
import json
import struct
import sys
import tempfile
from pathlib import Path

MAX_ITEMS = 100_000                       # guard against loops in damaged files
PE_MACHINES = {0x14C: "x86", 0x8664: "x64", 0xAA64: "arm64", 0x1C4: "arm"}
ELF_MACHINES = {3: "x86", 62: "x64", 40: "arm", 183: "arm64", 243: "riscv", 8: "mips"}
SUBSYSTEMS = {2: "GUI", 3: "console", 1: "native/driver", 10: "EFI"}


class Reader:
    def __init__(self, data):
        self.d = data

    def u(self, fmt, off):
        size = struct.calcsize(fmt)
        if off < 0 or off + size > len(self.d):
            raise ValueError(f"read past end at 0x{off:x}")
        return struct.unpack_from(fmt, self.d, off)

    def cstr(self, off, limit=512):
        if not 0 <= off < len(self.d):
            raise ValueError(f"string offset 0x{off:x} outside file")
        end = self.d.find(b"\0", off, off + limit)
        return self.d[off:end if end >= 0 else off + limit].decode("latin-1")


# ---------- PE ----------
def pe_info(r):
    pe = r.u("<I", 0x3C)[0]
    if r.d[pe:pe + 4] != b"PE\0\0":
        raise ValueError("MZ header but no PE signature")
    machine, nsect, stamp, _, _, opt_size, chars = r.u("<HHIIIHH", pe + 4)
    opt = pe + 24
    magic = r.u("<H", opt)[0]
    plus = magic == 0x20B
    entry = r.u("<I", opt + 16)[0]
    subsystem = r.u("<H", opt + 68)[0]
    ddir = opt + (112 if plus else 96)
    ndirs = min(r.u("<I", ddir - 4)[0], 16)
    dirs = [r.u("<II", ddir + 8 * i) for i in range(ndirs)]
    sections = []
    for i in range(min(nsect, 96)):
        s = opt + opt_size + 40 * i
        name = r.d[s:s + 8].rstrip(b"\0").decode("latin-1")
        vsize, va, rsize, raw = r.u("<IIII", s + 8)
        sections.append({"name": name, "va": va, "vsize": vsize, "raw": raw, "rsize": rsize,
                         "flags": hex(r.u("<I", s + 36)[0])})

    def off(rva):
        for s in sections:
            if s["va"] <= rva < s["va"] + max(s["vsize"], s["rsize"]):
                return rva - s["va"] + s["raw"]
        raise ValueError(f"RVA 0x{rva:x} not in any section")

    info = {"format": "PE32+" if plus else "PE32", "machine": PE_MACHINES.get(machine, hex(machine)),
            "dll": bool(chars & 0x2000), "subsystem": SUBSYSTEMS.get(subsystem, subsystem),
            "timestamp": stamp, "entry_rva": hex(entry),
            "dotnet": ndirs > 14 and dirs[14][0] != 0,
            "sections": [{k: (hex(v) if isinstance(v, int) else v) for k, v in s.items()} for s in sections],
            "imports": {}, "exports": [], "notes": []}
    if ndirs > 1 and dirs[1][0]:
        info["imports"] = pe_imports(r, off(dirs[1][0]), off, plus)
    if dirs and dirs[0][0]:
        info["exports"] = pe_exports(r, off(dirs[0][0]), off)
    if ndirs > 13 and dirs[13][0]:
        info["notes"].append("has delay-load imports (not listed)")
    if info["dotnet"]:
        info["notes"].append(".NET assembly — use ilspycmd for C#; native imports are just mscoree")
    return info


def pe_imports(r, desc, off, plus):
    result = {}
    for _ in range(MAX_ITEMS):
        oft, _, _, name_rva, ft = r.u("<IIIII", desc)
        if not (oft or name_rva or ft):
            break
        names, thunk = [], off(oft or ft)
        width, flag = (8, 1 << 63) if plus else (4, 1 << 31)
        for _ in range(MAX_ITEMS):
            val = r.u("<Q" if plus else "<I", thunk)[0]
            if not val:
                break
            names.append(f"#{val & 0xFFFF}" if val & flag else r.cstr(off(val & 0x7FFFFFFF) + 2))
            thunk += width
        result[r.cstr(off(name_rva))] = names
        desc += 20
    return result


def pe_exports(r, d, off):
    _, _, _, _, name_rva, base, nfunc, nnames, funcs, names, ords = r.u("<IIHHIIIIIII", d)
    out = []
    for i in range(min(nnames, MAX_ITEMS)):
        name = r.cstr(off(r.u("<I", off(names) + 4 * i)[0]))
        out.append(f"{name} (ordinal {base + r.u('<H', off(ords) + 2 * i)[0]})")
    return out


# ---------- ELF ----------
def elf_info(r):
    cls, data = r.d[4], r.d[5]
    if cls not in (1, 2) or data not in (1, 2):
        raise ValueError("bad ELF class or byte order")
    e = "<" if data == 1 else ">"
    w = "Q" if cls == 2 else "I"
    etype, machine = r.u(e + "HH", 16)
    if cls == 2:
        entry, _, shoff = r.u(e + "QQQ", 24)
        shentsize, shnum, shstrndx = r.u(e + "HHH", 58)
        shfmt, symfmt, dynfmt = e + "IIQQQQIIQQ", e + "IBBHQQ", e + "qQ"
    else:
        entry, _, shoff = r.u(e + "III", 24)
        shentsize, shnum, shstrndx = r.u(e + "HHH", 46)
        shfmt, symfmt, dynfmt = e + "IIIIIIIIII", e + "IIIBBH", e + "iI"
    secs = []
    for i in range(min(shnum, 4096)):
        name, typ, _, addr, offset, size, link, _, _, entsize = r.u(shfmt, shoff + i * shentsize)
        secs.append({"name_off": name, "type": typ, "addr": addr, "offset": offset, "size": size,
                     "link": link, "entsize": entsize})
    strtab = secs[shstrndx]["offset"] if shstrndx < len(secs) else None
    for s in secs:
        s["name"] = r.cstr(strtab + s["name_off"]) if strtab is not None else ""
    info = {"format": f"ELF{64 if cls == 2 else 32}", "machine": ELF_MACHINES.get(machine, machine),
            "type": {1: "relocatable", 2: "executable", 3: "shared object / PIE", 4: "core"}.get(etype, etype),
            "entry": hex(entry), "endian": "little" if data == 1 else "big",
            "sections": [{"name": s["name"], "addr": hex(s["addr"]), "size": s["size"]} for s in secs if s["name"]],
            "needed": [], "imports": [], "exports": [], "notes": []}
    for s in secs:
        if s["type"] == 6 and s["entsize"]:                              # SHT_DYNAMIC
            base = secs[s["link"]]["offset"]
            for i in range(min(s["size"] // s["entsize"], MAX_ITEMS)):
                tag, val = r.u(dynfmt, s["offset"] + i * s["entsize"])
                if tag == 0:
                    break
                if tag == 1:                                             # DT_NEEDED
                    info["needed"].append(r.cstr(base + val))
        if s["type"] == 11 and s["entsize"]:                             # SHT_DYNSYM
            base = secs[s["link"]]["offset"]
            for i in range(1, min(s["size"] // s["entsize"], MAX_ITEMS)):
                f = r.u(symfmt, s["offset"] + i * s["entsize"])
                name, st_info, shndx = (f[0], f[1], f[3]) if cls == 2 else (f[0], f[3], f[5])
                if not name or st_info >> 4 == 0:                        # skip local symbols
                    continue
                (info["imports"] if shndx == 0 else info["exports"]).append(r.cstr(base + name))
    if not any(s["type"] == 11 for s in secs):
        info["notes"].append("no dynamic symbols (static or stripped)")
    if any(s["name"] == ".gopclntab" for s in secs):
        info["notes"].append("Go binary (.gopclntab present)")
    return info


# ---------- Mach-O (header only) ----------
def macho_info(r):
    magic = r.u("<I", 0)[0]
    plus = magic == 0xFEEDFACF
    cpu, _, ftype, ncmds, _, _ = r.u("<iiIIII", 4)
    off, dylibs = 32 if plus else 28, []
    for _ in range(min(ncmds, 4096)):
        cmd, size = r.u("<II", off)
        if cmd in (0xC, 0x80000018, 0x1F):                               # LOAD_DYLIB / WEAK / REEXPORT
            dylibs.append(r.cstr(off + r.u("<I", off + 8)[0]))
        if size < 8:
            break
        off += size
    return {"format": "Mach-O 64" if plus else "Mach-O 32",
            "machine": {7: "x86", 0x1000007: "x64", 12: "arm", 0x100000C: "arm64"}.get(cpu, cpu),
            "type": {2: "executable", 6: "dylib", 8: "bundle"}.get(ftype, ftype), "dylibs": dylibs,
            "notes": ["imports/exports: use Ghidra or `nm -m` on macOS"]}


def inspect(path):
    data = Path(path).read_bytes()
    r = Reader(data)
    if data[:2] == b"MZ":
        return pe_info(r)
    if data[:4] == b"\x7fELF":
        return elf_info(r)
    if data[:4] in (b"\xcf\xfa\xed\xfe", b"\xce\xfa\xed\xfe"):
        return macho_info(r)
    if data[:4] == b"\xca\xfe\xba\xbe":
        raise ValueError("universal (fat) Mach-O or Java class — split with lipo first, or triage.py")
    raise ValueError("not PE, ELF or Mach-O — run triage.py first")


def show(info, limit):
    cut = (lambda xs: xs if not limit else xs[:limit])
    for k, v in info.items():
        if isinstance(v, dict):
            print(f"{k}: {len(v)} libraries")
            for lib, names in list(v.items())[:limit or None]:
                print(f"  {lib}: {len(names)} — {', '.join(cut(names))}")
        elif isinstance(v, list):
            print(f"{k}: {len(v)}")
            for x in cut(v):
                print(f"  {' '.join(f'{a}={b}' for a, b in x.items()) if isinstance(x, dict) else x}")
        else:
            print(f"{k}: {v}")


# ---------- self-test fixtures ----------
def tiny_pe():
    b = bytearray(0x400)
    b[0:2], b[0x3C:0x40] = b"MZ", struct.pack("<I", 0x40)
    b[0x40:0x44] = b"PE\0\0"
    struct.pack_into("<HHIIIHH", b, 0x44, 0x8664, 1, 0, 0, 0, 240, 0x2022)
    opt = 0x58
    struct.pack_into("<H", b, opt, 0x20B)
    struct.pack_into("<H", b, opt + 68, 3)
    struct.pack_into("<I", b, opt + 108, 16)
    struct.pack_into("<II", b, opt + 112, 0x1100, 40)                   # export dir
    struct.pack_into("<II", b, opt + 120, 0x1000, 40)                   # import dir
    sec = opt + 240
    b[sec:sec + 8] = b".idata\0\0"
    struct.pack_into("<IIII", b, sec + 8, 0x200, 0x1000, 0x200, 0x200)
    at = lambda rva: rva - 0x1000 + 0x200                               # noqa: E731
    struct.pack_into("<IIIII", b, at(0x1000), 0x1040, 0, 0, 0x1080, 0x1040)
    struct.pack_into("<QQQ", b, at(0x1040), 0x1060, (1 << 63) | 5, 0)
    b[at(0x1062):at(0x1062) + 12] = b"CreateFileW\0"
    b[at(0x1080):at(0x1080) + 13] = b"KERNEL32.dll\0"
    struct.pack_into("<IIHHIIIIIII", b, at(0x1100), 0, 0, 0, 0, 0x1140, 1, 1, 1, 0x1150, 0x1160, 0x1168)
    b[at(0x1140):at(0x1140) + 12] = b"fixture.dll\0"
    struct.pack_into("<I", b, at(0x1150), 0x1000)
    struct.pack_into("<I", b, at(0x1160), 0x1170)
    struct.pack_into("<H", b, at(0x1168), 0)
    b[at(0x1170):at(0x1170) + 8] = b"DoThing\0"
    return bytes(b)


def tiny_elf():
    dynstr = b"\0libc.so.6\0puts\0my_export\0"
    dynsym = bytes(24) + struct.pack("<IBBHQQ", 11, 0x12, 0, 0, 0, 0) + struct.pack("<IBBHQQ", 16, 0x12, 0, 1, 0x1000, 8)
    dynamic = struct.pack("<qQqQ", 1, 1, 0, 0)
    shstr = b"\0.dynstr\0.dynsym\0.dynamic\0.shstrtab\0"
    body, offs = b"", []
    for part in (dynstr, dynsym, dynamic, shstr):
        offs.append(64 + len(body))
        body += part + b"\0" * (-len(part) % 8)
    shoff = 64 + len(body)
    sh = bytes(64)
    for name, typ, i, link, ent, size in ((1, 3, 0, 0, 0, len(dynstr)), (9, 11, 1, 1, 24, len(dynsym)),
                                          (17, 6, 2, 1, 16, len(dynamic)), (26, 3, 3, 0, 0, len(shstr))):
        sh += struct.pack("<IIQQQQIIQQ", name, typ, 0, 0, offs[i], size, link, 0, 8, ent)
    head = b"\x7fELF\x02\x01\x01" + bytes(9) + struct.pack("<HHIQQQIHHHHHH", 3, 62, 1, 0x1000, 0, shoff, 0, 64, 56, 0, 64, 5, 4)
    return head + body + sh


def self_test():
    with tempfile.TemporaryDirectory() as tmp:
        pe, elf, junk = Path(tmp, "t.dll"), Path(tmp, "t.so"), Path(tmp, "t.bin")
        pe.write_bytes(tiny_pe())
        elf.write_bytes(tiny_elf())
        junk.write_bytes(b"MZ" + b"\xff" * 10)
        p = inspect(pe)
        assert p["machine"] == "x64" and p["dll"] and p["subsystem"] == "console", p
        assert p["imports"] == {"KERNEL32.dll": ["CreateFileW", "#5"]}, p["imports"]
        assert p["exports"] == ["DoThing (ordinal 1)"], p["exports"]
        e = inspect(elf)
        assert e["needed"] == ["libc.so.6"] and e["imports"] == ["puts"] and e["exports"] == ["my_export"], e
        try:
            inspect(junk)
            raise AssertionError("damaged PE accepted")
        except ValueError:
            pass
        show(p, 5)
        show(e, 5)
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
        ap.error("give an existing file")
    try:
        info = inspect(a.file)
    except (ValueError, struct.error, IndexError) as e:
        sys.exit(f"error: {e}")
    print(json.dumps(info, indent=1)) if a.json else show(info, a.limit)


if __name__ == "__main__":
    main()
