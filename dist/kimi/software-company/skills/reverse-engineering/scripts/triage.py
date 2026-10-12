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


OLE_MAGIC = b"\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1"

# (marker found in first 4 KB, label) — checked in order
XML_KINDS = (
    (b"DTS:Executable", "SSIS package (.dtsx XML) — open as XML, search SqlCommand and ConnectionManager"),
    (b"<Project", "MSBuild project XML"),
    (b"<configuration", "config XML (.NET) — names only, never copy secret values"),
    (b"<!DOCTYPE plist", "Apple plist XML"),
)

# (entry name or prefix inside the zip, label, next step) — checked in order
ZIP_KINDS = (
    ("AndroidManifest.xml", "APK (Android app)", "jadx for Java/Kotlin; assemblies/ → .NET (Xamarin)"),
    ("Payload/", "IPA (iOS app)", "unzip, then triage the Mach-O inside Payload/*.app"),
    ("Report/Layout", "Power BI .pbix", "Report/Layout is UTF-16 JSON (visuals, filters); DataModel needs pbi-tools or Tabular Editor"),
    ("word/", "Word .docx", "read word/document.xml"),
    ("xl/", "Excel .xlsx", "read xl/sharedStrings.xml and worksheets"),
    ("META-INF/MANIFEST.MF", "Java .jar/.war", "decompile with jadx, CFR or Vineflower"),
    ("[Content_Types].xml", "OPC package (.nupkg/.vsix/Office)", "unzip and triage contents"),
)


def zip_kind(data):
    import io
    import zipfile
    try:
        names = zipfile.ZipFile(io.BytesIO(data)).namelist()
    except zipfile.BadZipFile:
        return "ZIP archive (damaged or split)", ""
    for entry, label, step in ZIP_KINDS:
        if any(n == entry or n.startswith(entry) for n in names):
            return label, f"{len(names)} entries; next: {step}"
    return "ZIP archive", f"{len(names)} entries"


# attribute names left behind by common .NET obfuscators
OBFUSCATORS = ("ConfusedByAttribute", "DotfuscatorAttribute", "SmartAssembly", "BabelAttribute",
               "ObfuscatedByGoliath", "Eazfuscator")

_SECRET_WORD = r"\w*(?:pass|pwd|secret|api[_-]?key|token)\w*"
SECRETS = None  # compiled lazily in redact()


def redact(s):
    """Mask values of password-like keys so triage output can be pasted safely.
    Covers Password=x; · PASSWD="x" · key="SMTPPass" value="x"."""
    global SECRETS
    if SECRETS is None:
        SECRETS = (
            _re.compile(r'(?i)(key\s*=\s*"' + _SECRET_WORD + r'"\s+value\s*=\s*")([^"]*)'),
            _re.compile(r"(?i)\b(" + _SECRET_WORD + r"\s*[=:]\s*[\"']?)([^;\"'\s]+)"),
        )
    for rx in SECRETS:
        s = rx.sub(lambda m: m.group(1) + "***", s)
    return s


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
            info["format"], info["detail"] = zip_kind(data)
        elif data[:8] == OLE_MAGIC:
            info["format"] = "OLE compound file"
            info["detail"] = ("Crystal Reports .rpt, legacy Office .doc/.xls or .msi — "
                              "for .rpt export via Crystal/RptToXml; strings still show SQL and field names")
        else:
            head = data[:4096].lstrip(b"\xef\xbb\xbf\r\n\t ")
            if head[:1] == b"{" or head[:5] == b"<?xml" or head[:1] == b"<":
                info["format"] = "plist/XML/JSON text"
                for marker, kind in XML_KINDS:
                    if marker in head:
                        info["format"] = kind
                        break
    # Electron ASAR is a Chromium pickle: uint32 4, uint32 header size,
    # uint32 pickle payload size, uint32 JSON length, then JSON with "files"
    if len(data) > 16 and info["format"] == "unknown":
        first, _, _, jlen = struct.unpack_from("<IIII", data, 0)
        if first == 4 and 0 < jlen < len(data) and data[16:17] == b"{":
            try:
                if "files" in json.loads(data[16:16 + jlen]):
                    info["format"] = "ASAR (Electron archive)"
                    info["detail"] = "use: npx @electron/asar extract <file> <outdir>"
            except ValueError:
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

    if info["format"].startswith(".NET"):
        import os
        base = os.path.splitext(args.file)[0]
        side = [ext for ext in (".pdb", ".dll.config", ".exe.config", ".xml") if os.path.exists(base + ext)]
        if side:
            print(f"beside: {', '.join(side)} (.pdb gives original file names and line numbers; "
                  f".config holds settings — names only)")
        obf = [n for n in OBFUSCATORS if n.encode() in data]
        print(f"obfuscation: {', '.join(obf) if obf else 'no known marker'}")
        print("next:   ilspycmd -p -o <outdir> <file>   (see SKILL.md for version pinning)")

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
            print(redact(s))


if __name__ == "__main__":
    main()
