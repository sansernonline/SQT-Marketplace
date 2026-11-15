#!/usr/bin/env python3
"""Inventory an Android APK without installing or running it. Pure stdlib.

Lists what is inside (dex, native libs per ABI, Xamarin/.NET assemblies, Flutter,
React Native bundles), which signature schemes are present, and decodes the
binary AndroidManifest.xml (package, versions, SDK levels, permissions,
components and exported flags). Certificate contents are not printed.

Usage:
  python -I apk_inventory.py <app.apk>
  python -I apk_inventory.py <app.apk> --manifest-xml   # also print the decoded manifest
  python -I apk_inventory.py --self-test
"""

import argparse
import hashlib
import struct
import sys
import tempfile
import zipfile
from collections import Counter
from pathlib import Path

MAX_MANIFEST = 8 * 1024 * 1024
ANDROID_NS = "http://schemas.android.com/apk/res/android"
# resource id → attribute name, for APKs whose string pool hides attribute names
ATTR_IDS = {0x01010003: "name", 0x01010010: "exported", 0x0101000F: "debuggable",
            0x0101021B: "versionCode", 0x0101021C: "versionName", 0x0101020C: "minSdkVersion",
            0x01010270: "targetSdkVersion", 0x01010280: "allowBackup",
            0x010104EC: "usesCleartextTraffic", 0x01010006: "permission"}
COMPONENTS = ("activity", "activity-alias", "service", "receiver", "provider")
FRAMEWORK_MARKERS = (("assets/flutter_assets/", "Flutter"), ("lib/arm64-v8a/libflutter.so", "Flutter engine"),
                     ("assets/index.android.bundle", "React Native"), ("assemblies/", "Xamarin / .NET MAUI"),
                     ("lib/arm64-v8a/libmonodroid.so", ".NET for Android"), ("assets/www/", "Cordova / Capacitor"),
                     ("kotlin/", "Kotlin"), ("lib/arm64-v8a/libunity.so", "Unity"))


# ---------- binary XML (AXML) ----------
def read_pool(d, off):
    count, _, flags, start, _ = struct.unpack_from("<5I", d, off + 8)
    utf8, base, out = bool(flags & 0x100), off + start, []
    for i in range(count):
        p = base + struct.unpack_from("<I", d, off + 28 + 4 * i)[0]
        if utf8:
            p += 2 if d[p] & 0x80 else 1                          # skip char count
            n = d[p]
            if n & 0x80:
                n, p = ((n & 0x7F) << 8) | d[p + 1], p + 2
            else:
                p += 1
            out.append(d[p:p + n].decode("utf-8", "replace"))
        else:
            n = struct.unpack_from("<H", d, p)[0]
            out.append(d[p + 2:p + 2 + 2 * n].decode("utf-16-le", "replace"))
    return out


def typed(dtype, data, strings, raw):
    if raw != 0xFFFFFFFF and raw < len(strings):
        return strings[raw]
    if dtype == 0x12:
        return "true" if data else "false"
    if dtype == 0x01:
        return f"@0x{data:08x}"
    if dtype == 0x11:
        return hex(data)
    return str(data if data < 0x80000000 else data - (1 << 32))


def decode_axml(d):
    """Return a list of (depth, tag, {attr: value}) for every element."""
    if len(d) < 8 or struct.unpack_from("<HH", d, 0) != (0x0003, 8):
        raise ValueError("not a binary XML file")
    strings, ids, elems, depth, off = [], [], [], 0, 8
    while off + 8 <= len(d):
        ctype, hsize, size = struct.unpack_from("<HHI", d, off)
        if size < 8 or off + size > len(d):
            raise ValueError(f"bad chunk at 0x{off:x}")
        if ctype == 0x0001:
            strings = read_pool(d, off)
        elif ctype == 0x0180:
            ids = list(struct.unpack_from(f"<{(size - 8) // 4}I", d, off + 8))
        elif ctype == 0x0102:
            _, name, astart, asize, count = struct.unpack_from("<IIHHH", d, off + 16)
            attrs = {}
            for i in range(count):
                a = off + 16 + astart + i * asize
                _, aname, raw, _, _, dtype, data = struct.unpack_from("<IIIHBBI", d, a)
                key = strings[aname] if aname < len(strings) and strings[aname] else ATTR_IDS.get(
                    ids[aname] if aname < len(ids) else 0, f"attr{aname}")
                attrs[key] = typed(dtype, data, strings, raw)
            elems.append((depth, strings[name], attrs))
            depth += 1
        elif ctype == 0x0103:
            depth -= 1
        off += size
    if not elems:
        raise ValueError("no elements found")
    return elems


def summarize_manifest(elems):
    m = {"permissions": [], "components": [], "flags": {}}
    for _, tag, a in elems:
        if tag == "manifest":
            m.update(package=a.get("package"), versionCode=a.get("versionCode"), versionName=a.get("versionName"))
        elif tag == "uses-sdk":
            m.update(minSdk=a.get("minSdkVersion"), targetSdk=a.get("targetSdkVersion"))
        elif tag in ("uses-permission", "uses-permission-sdk-23"):
            m["permissions"].append(a.get("name"))
        elif tag == "application":
            m["flags"] = {k: a[k] for k in ("debuggable", "allowBackup", "usesCleartextTraffic") if k in a}
        elif tag in COMPONENTS:
            m["components"].append((tag, a.get("name"), a.get("exported", "-")))
    return m


# ---------- archive ----------
def signing_block(path):
    """v2/v3 signatures live in a block just before the ZIP central directory."""
    with open(path, "rb") as f:
        f.seek(0, 2)
        size = f.tell()
        f.seek(max(0, size - 66000))
        tail = f.read()
        eocd = tail.rfind(b"PK\x05\x06")
        if eocd < 0 or eocd + 20 > len(tail):
            return False
        cd = struct.unpack_from("<I", tail, eocd + 16)[0]
        if cd < 16:
            return False
        f.seek(cd - 16)
        return f.read(16) == b"APK Sig Block 42"


def inventory(path):
    with zipfile.ZipFile(path) as z:
        infos = z.infolist()
        names = [i.filename for i in infos]
        man = next((i for i in infos if i.filename == "AndroidManifest.xml"), None)
        manifest, err, elems = None, None, []
        if man is None:
            err = "no AndroidManifest.xml — not an APK (an .aab keeps it under base/manifest/, protobuf)"
        elif man.file_size > MAX_MANIFEST:
            err = "manifest larger than 8 MB — refused"
        else:
            try:
                elems = decode_axml(z.read(man))
                manifest = summarize_manifest(elems)
            except (ValueError, struct.error, IndexError) as e:
                err = f"manifest decode failed ({e}) — use aapt2 dump xmltree or apktool"
        certs = {i.filename: hashlib.sha256(z.read(i)).hexdigest()[:16]
                 for i in infos if i.filename.startswith("META-INF/")
                 and i.filename.upper().endswith((".RSA", ".DSA", ".EC")) and i.file_size < 1_000_000}
    abis = Counter(n.split("/")[1] for n in names if n.startswith("lib/") and n.count("/") >= 2)
    return {"file": Path(path).name, "sha256": hashlib.sha256(Path(path).read_bytes()).hexdigest(),
            "entries": len(names), "dex": [n for n in names if n.endswith(".dex")],
            "native_abis": dict(abis), "native_libs": sorted({n.rsplit("/", 1)[1] for n in names if n.startswith("lib/")}),
            "assemblies": [n for n in names if n.startswith("assemblies/") and n.endswith(".dll")],
            "frameworks": sorted({label for mark, label in FRAMEWORK_MARKERS if any(n.startswith(mark) for n in names)}),
            "signature_v1_certs": certs, "signature_v2_v3_block": signing_block(path),
            "manifest": manifest, "manifest_error": err, "_elems": elems}


def show(r, full_xml):
    for k in ("file", "sha256", "entries", "frameworks", "dex", "native_abis", "signature_v2_v3_block"):
        print(f"{k}: {r[k]}")
    print(f"native_libs ({len(r['native_libs'])}): {', '.join(r['native_libs'][:40])}")
    if r["assemblies"]:
        print(f".NET assemblies ({len(r['assemblies'])}): {', '.join(r['assemblies'][:20])} — triage then ilspycmd")
    print("signature v1 certs (sha256 prefix only): " + (", ".join(f"{k} {v}" for k, v in r["signature_v1_certs"].items()) or "none"))
    m = r["manifest"]
    if r["manifest_error"]:
        print(f"manifest: {r['manifest_error']}")
    if m:
        print(f"package: {m.get('package')}  version: {m.get('versionName')} ({m.get('versionCode')})"
              f"  minSdk: {m.get('minSdk')}  targetSdk: {m.get('targetSdk')}")
        print(f"application flags: {m['flags'] or 'none set'}")
        print(f"permissions ({len(m['permissions'])}):")
        for p in m["permissions"]:
            print(f"  {p}")
        print(f"components ({len(m['components'])}) — tag · name · exported:")
        for c in m["components"]:
            print(f"  {' · '.join(str(x) for x in c)}")
    if full_xml:
        for depth, tag, attrs in r["_elems"]:
            print("  " * depth + f"<{tag} " + " ".join(f'{k}="{v}"' for k, v in attrs.items()) + ">")


# ---------- self-test fixture ----------
def build_axml(elements):
    """elements: list of (tag, {attr: (dtype, value)}, children_close_after). Flat with explicit depth."""
    pool = ["name", "package", "versionCode", "exported", "manifest", "uses-permission", "application",
            "activity", "android", ANDROID_NS]
    for _, attrs, _ in elements:
        for v in attrs.values():
            if v[0] == 0x03 and v[1] not in pool:
                pool.append(v[1])
    data = b"".join(struct.pack("<H", len(s)) + s.encode("utf-16-le") + b"\0\0" for s in pool)
    offs, o = [], 0
    for s in pool:
        offs.append(o)
        o += 4 + 2 * len(s)
    data += b"\0" * (-len(data) % 4)
    hdr = 28 + 4 * len(pool)
    sp = struct.pack("<HHI5I", 1, 28, hdr + len(data), len(pool), 0, 0, hdr, 0) + struct.pack(f"<{len(pool)}I", *offs) + data
    rmap = struct.pack("<HHI", 0x180, 8, 8 + 16) + struct.pack("<4I", 0x01010003, 0, 0x0101021B, 0x01010010)
    body, idx = b"", pool.index
    for tag, attrs, closes in elements:
        ab = b""
        for k, (dtype, v) in attrs.items():
            raw = idx(v) if dtype == 0x03 else 0xFFFFFFFF
            ab += struct.pack("<IIIHBBI", idx(ANDROID_NS), idx(k), raw, 8, 0, dtype, raw if dtype == 0x03 else v)
        body += struct.pack("<HHIII", 0x102, 16, 36 + len(ab), 1, 0xFFFFFFFF)
        body += struct.pack("<IIHHHHHH", 0xFFFFFFFF, idx(tag), 20, 20, len(attrs), 0, 0, 0) + ab
        for t in closes:
            body += struct.pack("<HHIIIII", 0x103, 16, 24, 1, 0xFFFFFFFF, 0xFFFFFFFF, idx(t))
    total = 8 + len(sp) + len(rmap) + len(body)
    return struct.pack("<HHI", 3, 8, total) + sp + rmap + body


def self_test():
    S = 0x03
    axml = build_axml([
        ("manifest", {"package": (S, "com.example.fixture"), "versionCode": (0x10, 7)}, []),
        ("uses-permission", {"name": (S, "android.permission.CAMERA")}, ["uses-permission"]),
        ("application", {}, []),
        ("activity", {"name": (S, ".Main"), "exported": (0x12, 0xFFFFFFFF)}, ["activity", "application", "manifest"]),
    ])
    with tempfile.TemporaryDirectory() as tmp:
        apk = Path(tmp, "t.apk")
        with zipfile.ZipFile(apk, "w") as z:
            z.writestr("AndroidManifest.xml", axml)
            z.writestr("classes.dex", b"dex\n035\0")
            z.writestr("lib/arm64-v8a/libfoo.so", b"\x7fELF")
            z.writestr("META-INF/CERT.RSA", b"0\x82fake")
        r = inventory(apk)
        show(r, True)
        m = r["manifest"]
        assert m["package"] == "com.example.fixture" and m["versionCode"] == "7", m
        assert m["permissions"] == ["android.permission.CAMERA"], m
        assert m["components"] == [("activity", ".Main", "true")], m
        assert r["native_abis"] == {"arm64-v8a": 1} and r["dex"] == ["classes.dex"] and not r["signature_v2_v3_block"]
        bad = Path(tmp, "bad.apk")
        with zipfile.ZipFile(bad, "w") as z:
            z.writestr("AndroidManifest.xml", b"\x03\x00\x08\x00\xff\xff\xff\xff")
        assert "decode failed" in inventory(bad)["manifest_error"]
    print("self-test OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("apk", nargs="?")
    ap.add_argument("--manifest-xml", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        return self_test()
    if not a.apk or not Path(a.apk).is_file():
        ap.error("give an existing .apk file")
    try:
        show(inventory(a.apk), a.manifest_xml)
    except zipfile.BadZipFile as e:
        sys.exit(f"error: not a ZIP/APK ({e})")


if __name__ == "__main__":
    main()
