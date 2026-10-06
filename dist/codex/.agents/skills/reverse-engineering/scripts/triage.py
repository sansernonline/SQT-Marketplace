#!/usr/bin/env python3
"""Triage an unknown file for reverse engineering: identify format/architecture
and extract useful strings. Pure stdlib, works on Windows/macOS/Linux.

Usage:
  python triage.py <file>              # identity + summary
  python triage.py <file> --strings    # identity + ASCII/UTF-16 strings (min 6 chars)
  python triage.py <file> --strings --limit 200
"""

import argparse
import json
import struct
import sys

MZ = b"MZ"
ELF_MAGIC = b"\x7fELF"
MACHO_MAGICS = {0xFEEDFACE: "Mach-O 32-bit", 0xFEEDFACF: "Mach-O 64-bit"}
FAT_MAGIC = 0xCafeBabe
PKZIP = b"PK\x03\x04"


import re as _re

_ASCII_RX = {n: _re.compile(rb"[\x20-\x7e]{%d,}" % n) for n in range(4, 33)}
_WIDE_RX = {n: _re.compile((rb"(?:[\x20-\x7e]\x00){%d,}" % n)) for n in range(4, 33)}


def ascii_strings(data, min_len=6):
    rx = _ASCII_RX.get(min_len) or _re.compile(rb"[\x20-\x7e]{%d,}" % min_len)
    return [m.group().decode("ascii", "replace") for m in rx.finditer(data)]


def utf16le_strings(data, min_len=6):
    rx = _WIDE_RX.get(min_len) or _re.compile(rb"(?:[\x20-\x7e]\x00){%d,}" % min_len)
    return [m.group()[::2].decode("ascii", "replace") for m in rx.finditer(data)]


def identify(data):
    info = {"format": "unknown", "detail": ""}
    if data[:2] == MZ:
        info["format"] = "PE (Windows)"
        if len(data) >= 0x40:
            pe_off = struct.unpack_from("<I", data, 0x3C)[0]
            if data[pe_off:pe_off + 4] == b"PE\x00\x00":
                machine, num_sections = struct.unpack_from("<HH", data, pe_off + 4)
                machines = {0x14C: "x86", 0x8664: "x86-64", 0x1C0: "ARM", 0xAA64: "ARM64"}
                opt_off = pe_off + 24
                opt_magic = struct.unpack_from("<H", data, opt_off)[0]
                bits = "PE32+" if opt_magic == 0x20B else ("PE32" if opt_magic == 0x10B else "?")
                # CLI header (data directory index 14) present => .NET assembly
                dd_off = opt_off + (112 if bits == "PE32+" else 96)
                cli_rva, cli_size = struct.unpack_from("<II", data, dd_off + 14 * 8)
                dotnet = cli_size > 0
                info["detail"] = (
                    f"machine={machines.get(machine, hex(machine))}, "
                    f"{bits}, sections={num_sections}, .NET={dotnet}"
                )
                if dotnet:
                    info["format"] = ".NET / managed PE"
            else:
                info["detail"] = "MZ without PE header (DOS stub?)"
    elif data[:4] == ELF_MAGIC:
        ei_class = {1: "32-bit", 2: "64-bit"}.get(data[4], "?")
        ei_data = {1: "LE", 2: "BE"}.get(data[5], "?")
        e_machine = struct.unpack_from("<H", data, 18)[0]
        machines = {0x28: "ARM", 0xB7: "ARM64", 0x03: "x86", 0x3E: "x86-64", 0xF3: "RISC-V"}
        etype = {1: "relocatable", 2: "executable", 3: "shared object"}.get(
            struct.unpack_from("<H", data, 16)[0], "?")
        info["format"] = "ELF (Linux/Unix)"
        info["detail"] = f"{ei_class} {ei_data}, machine={machines.get(e_machine, hex(e_machine))}, type={etype}"
    elif len(data) >= 4:
        magic = struct.unpack_from(">I", data, 0)[0]
        if magic in MACHO_MAGICS:
            cpu = struct.unpack_from("<I", data, 4)[0]
            cpus = {7: "x86", 0x01000007: "x86-64", 12: "ARM", 0x0100000C: "ARM64"}
            info["format"] = MACHO_MAGICS[magic] + " (macOS/iOS)"
            info["detail"] = f"cpu={cpus.get(cpu, hex(cpu))}"
        elif magic == FAT_MAGIC:
            n = struct.unpack_from(">I", data, 4)[0]
            info["format"] = "Mach-O fat/universal binary"
            info["detail"] = f"{n} architectures"
        elif data[:4] == PKZIP:
            info["format"] = "ZIP archive"
            if b"AndroidManifest.xml" in data[:200000]:
                info["format"] = "APK (Android app)"
                info["detail"] = "unpack, then triage classes.dex and resources"
        elif data.lstrip()[:1] in (b"{",) or data[:5] == b"<?xml":
            info["format"] = "plist/XML/JSON text"
    # Electron ASAR: 4-byte LE header size, then JSON containing "files"
    if len(data) > 16 and info["format"] == "unknown":
        hsize = struct.unpack_from("<I", data, 0)[0]
        if 4 < hsize < len(data) and data[4] == ord("{"):
            try:
                header = json.loads(data[4:4 + hsize])
                if "files" in header:
                    info["format"] = "ASAR (Electron archive)"
                    info["detail"] = "use: npx asar extract <file> <outdir>"
            except Exception:
                pass
    if info["format"] == "unknown":
        sample = data[:4096]
        printable = sum(1 for b in sample if b in (9, 10, 13) or 32 <= b < 127)
        if sample and printable / len(sample) > 0.95:
            info["format"] = "text"
            # hints are concatenated so this script's own source does not self-match
            js_hints = (b"requ" + b"ire(", b"con" + b"st ", b"le" + b"t ",
                        b"=>", b"mod" + b"ule.exports")
            hits = sum(1 for h in js_hints if h in sample)
            first_line = data.split(b"\n", 1)[0].lower()
            if b"node" in first_line or b"deno" in first_line or b"bun" in first_line:
                info["format"] = "text/JavaScript (heuristic)"
            elif hits >= 2:
                info["format"] = "text/JavaScript (heuristic)"
            elif first_line.startswith(b"#!") and b"python" in first_line:
                info["format"] = "text/Python script"
            elif first_line.startswith(b"#!"):
                info["format"] = "text/script (shebang)"
    if data[:2] == MZ and info["format"].startswith("PE") and "7-Zip" not in info["format"]:
        # 7-Zip SFX: small PE stub with an appended archive right after the
        # stub body; the archive magic sits near the overlay start, not EOF.
        # Strings from the file body are mostly compressed noise — extract first.
        overlay_probe = data[64 * 1024:16 * 1024 * 1024]
        if b"7z\xBC\xAF\x27\x1C" in overlay_probe:
            info["format"] = "PE (7-Zip self-extracting stub)"
            info["detail"] = (info.get("detail") or "") + "; extract with: 7z x <file> (strings here are compressed noise)"
        elif b"NullsoftInstall" in data[:2 * 1024 * 1024]:
            info["format"] = "PE (NSIS installer)"
            info["detail"] = (info.get("detail") or "") + "; extract with: 7z x <file>"
    if info["format"] == "unknown" and data[:6] == b"7z\xBC\xAF\x27\x1C":
        info["format"] = "7-Zip archive"
        info["detail"] = "extract with: 7z x <file>"
    if info["format"] == "unknown" and data[:2] == MZ and b"NullsoftInstall" in data[:2 * 1024 * 1024]:
        info["format"] = "PE (NSIS installer)"
        info["detail"] = "extract with: 7z x <file>"
    return info


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--strings", action="store_true", help="also dump strings")
    ap.add_argument("--pattern", help="regex filter for strings (e.g. 'autoconfig|oauth')")
    ap.add_argument("--limit", type=int, default=200)
    ap.add_argument("--min-len", type=int, default=6)
    args = ap.parse_args()

    with open(args.file, "rb") as f:
        data = f.read()

    info = identify(data)
    print(f"file:   {args.file}")
    print(f"size:   {len(data)} bytes")
    print(f"format: {info['format']}")
    if info["detail"]:
        print(f"detail: {info['detail']}")
    print(f"sha256: ", end="")
    import hashlib
    print(hashlib.sha256(data).hexdigest())

    if args.strings or args.pattern:
        import re
        found = ascii_strings(data, args.min_len)
        found_set = set(found)  # set for O(1) dedup; `s not in list` is quadratic here
        wide = [s for s in utf16le_strings(data, args.min_len) if s not in found_set]
        all_strings = found + wide
        if args.pattern:
            rx = re.compile(args.pattern, re.IGNORECASE)
            interesting = [s for s in all_strings if rx.search(s)]
        else:
            interesting = [
                s for s in all_strings
                if any(k in s.lower() for k in (
                    "http", "api", "key", "token", "secret", "crypt", "aes", "rsa",
                    "password", "auth", "login", "sqlite", "encrypt", "decrypt",
                    "license", "endpoint", "ws://", "error", "exception"))
            ]
        print(f"\n--- matching strings ({len(interesting)} of "
              f"{len(all_strings)} total) ---")
        for s in interesting[:args.limit]:
            print(s)


if __name__ == "__main__":
    main()
