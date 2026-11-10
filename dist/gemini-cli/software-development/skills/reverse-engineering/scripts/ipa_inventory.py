#!/usr/bin/env python3
"""Inventory an iOS app from a .ipa (zip), an unpacked .app folder or a bare
Info.plist: bundle id, version, minimum OS, URL schemes, App Transport Security
(ATS) exceptions, privacy usage strings, entitlements from embedded.mobileprovision,
frameworks and the main Mach-O. Pure stdlib (plistlib). Nothing is extracted to
disk or executed.

Usage:
  python -I ipa_inventory.py <app.ipa | Some.app | Info.plist>
  python -I ipa_inventory.py <target> --json
  python -I ipa_inventory.py --plist <any.plist>      # dump one plist (xml or binary) as JSON
  python -I ipa_inventory.py --self-test
"""

import argparse
import json
import plistlib
import re
import sys
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

MAX_MB = 4096
MAX_PLIST_MB = 32                          # per-entry read cap: a zip bomb cannot fill memory
USAGE_KEY = re.compile(r"^NS.*UsageDescription$")
MACHO_MAGIC = {bytes.fromhex(m) for m in ("feedface", "feedfacf", "cefaedfe", "cffaedfe", "cafebabe", "bebafeca")}


def load_plist(data):
    try:
        return plistlib.loads(data)
    except Exception as e:                  # plistlib raises several unrelated types on garbage
        raise ValueError(f"not a valid plist ({type(e).__name__})") from None


def jsonable(o):
    return o.hex() if isinstance(o, bytes) else str(o)


class Bundle:
    """Read-only view of an .app, whether it sits in a zip or a folder."""

    def __init__(self, path):
        self.zip = None
        if path.is_dir():
            self.root, self.names = path, sorted(p.relative_to(path).as_posix() for p in path.rglob("*"))
        elif zipfile.is_zipfile(path):
            self.zip = zipfile.ZipFile(path)
            apps = sorted({"/".join(n.split("/")[:2]) for n in self.zip.namelist() if re.match(r"Payload/[^/]+\.app/", n)})
            if not apps:
                raise ValueError("zip has no Payload/<name>.app — not an .ipa")
            self.prefix = apps[0] + "/"
            self.names = [n[len(self.prefix):] for n in self.zip.namelist() if n.startswith(self.prefix)]
        else:
            raise ValueError("not a zip, folder or plist")

    def read(self, rel, limit=MAX_PLIST_MB * 1024 * 1024):
        if self.zip:
            with self.zip.open(self.prefix + rel) as f:
                return f.read(limit)
        with open(self.root / rel, "rb") as f:
            return f.read(limit)


def entitlements(raw):
    start, end = raw.find(b"<?xml"), raw.rfind(b"</plist>")
    if start < 0 or end < 0:
        raise ValueError("no plist inside embedded.mobileprovision")
    prov = load_plist(raw[start:end + len(b"</plist>")])
    return {"name": prov.get("Name"), "team": prov.get("TeamName"), "expires": str(prov.get("ExpirationDate")),
            "devices": len(prov.get("ProvisionedDevices", [])), "entitlements": prov.get("Entitlements", {})}


def summarize(info, bundle=None):
    ats = info.get("NSAppTransportSecurity")
    out = {"name": info.get("CFBundleDisplayName") or info.get("CFBundleName"),
           "bundle_id": info.get("CFBundleIdentifier"), "version": info.get("CFBundleShortVersionString"),
           "build": info.get("CFBundleVersion"), "min_os": info.get("MinimumOSVersion"),
           "executable": info.get("CFBundleExecutable"),
           "url_schemes": sorted({s for t in info.get("CFBundleURLTypes", []) for s in t.get("CFBundleURLSchemes", [])}),
           "queried_schemes": info.get("LSApplicationQueriesSchemes", []),
           "ats": ats, "usage": {k: v for k, v in sorted(info.items()) if USAGE_KEY.match(k)},
           "frameworks": [], "provision": None, "macho": None}
    if bundle:
        out["frameworks"] = sorted({PurePosixPath(n).parts[1] for n in bundle.names
                                    if n.startswith("Frameworks/") and len(PurePosixPath(n).parts) > 1})
        if "embedded.mobileprovision" in bundle.names:
            out["provision"] = entitlements(bundle.read("embedded.mobileprovision"))
        exe = out["executable"]
        if exe and exe in bundle.names:
            out["macho"] = bundle.read(exe, 4)[:4] in MACHO_MAGIC
    return out


def inspect(target):
    path = Path(target)
    if path.is_file() and not zipfile.is_zipfile(path):
        return summarize(load_plist(path.read_bytes()))
    bundle = Bundle(path)
    if "Info.plist" not in bundle.names:
        raise ValueError("no Info.plist at the top of the .app")
    return summarize(load_plist(bundle.read("Info.plist")), bundle)


def show(s):
    print(f"{s['name']}  {s['bundle_id']}  version {s['version']} (build {s['build']})  min iOS {s['min_os']}")
    macho = {True: "Mach-O header ok", False: "NOT a Mach-O header", None: "not checked"}[s["macho"]]
    print(f"main executable: {s['executable']} ({macho})")
    print(f"URL schemes: {', '.join(s['url_schemes']) or '-'}")
    if s["queried_schemes"]:
        print(f"queried schemes: {', '.join(s['queried_schemes'])}")
    print(f"ATS: {json.dumps(s['ats'], default=jsonable) if s['ats'] else 'default (HTTPS only)'}")
    print("privacy usage strings:")
    for k, v in s["usage"].items():
        print(f"  {k}: {v}")
    if s["provision"]:
        p = s["provision"]
        print(f"provisioning profile: {p['name']} · team {p['team']} · expires {p['expires']} · {p['devices']} devices")
        for k, v in sorted(p["entitlements"].items()):
            print(f"  entitlement {k} = {json.dumps(v, default=jsonable)}")
    print(f"frameworks ({len(s['frameworks'])}): {', '.join(s['frameworks']) or '-'}")


def tiny_info():
    return {"CFBundleIdentifier": "com.example.demo", "CFBundleShortVersionString": "1.2.3", "CFBundleVersion": "45",
            "MinimumOSVersion": "15.0", "CFBundleExecutable": "Demo", "CFBundleName": "Demo",
            "CFBundleURLTypes": [{"CFBundleURLSchemes": ["demo", "demo-auth"]}],
            "NSAppTransportSecurity": {"NSAllowsArbitraryLoads": True},
            "NSCameraUsageDescription": "Scan codes", "NSLocationWhenInUseUsageDescription": "Find stores"}


def self_test():
    prov = plistlib.dumps({"Name": "Dev", "TeamName": "Acme", "ProvisionedDevices": ["a", "b"],
                           "Entitlements": {"get-task-allow": True, "aps-environment": "development"}})
    cms = b"\x30\x82\xff\x00junk" + prov + b"\x00signature-bytes"
    files = {"Info.plist": plistlib.dumps(tiny_info(), fmt=plistlib.FMT_BINARY), "Demo": b"\xcf\xfa\xed\xfe" + bytes(8),
             "embedded.mobileprovision": cms, "Frameworks/Alamofire.framework/Alamofire": b"x", "Frameworks/libswift.dylib": b"x"}
    with tempfile.TemporaryDirectory() as tmp:
        ipa, app, junk = Path(tmp, "d.ipa"), Path(tmp, "Demo.app"), Path(tmp, "j.ipa")
        with zipfile.ZipFile(ipa, "w") as z:
            for name, body in files.items():
                z.writestr(f"Payload/Demo.app/{name}", body)
        for name, body in files.items():
            Path(app, name).parent.mkdir(parents=True, exist_ok=True)
            Path(app, name).write_bytes(body)
        junk.write_bytes(b"PK\x03\x04 garbage")
        for target in (ipa, app):
            s = inspect(target)
            assert s["bundle_id"] == "com.example.demo" and s["min_os"] == "15.0" and s["macho"] is True, s
            assert s["url_schemes"] == ["demo", "demo-auth"] and list(s["usage"]) == ["NSCameraUsageDescription",
                                                                                       "NSLocationWhenInUseUsageDescription"], s
            assert s["ats"] == {"NSAllowsArbitraryLoads": True}, s["ats"]
            assert s["frameworks"] == ["Alamofire.framework", "libswift.dylib"], s["frameworks"]
            assert s["provision"]["entitlements"]["get-task-allow"] is True and s["provision"]["devices"] == 2, s["provision"]
        plain = Path(tmp, "Info.plist")
        plain.write_bytes(files["Info.plist"])
        assert inspect(plain)["version"] == "1.2.3" and inspect(plain)["macho"] is None
        try:
            inspect(junk)
            raise AssertionError("garbage zip accepted")
        except (ValueError, zipfile.BadZipFile):
            pass
        show(inspect(ipa))
    print("self-test OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("target", nargs="?")
    ap.add_argument("--plist", metavar="FILE", help="dump one plist as JSON and exit")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        return self_test()
    path = Path(a.plist or a.target or "")
    if not (a.plist or a.target) or not path.exists():
        ap.error("give an existing .ipa, .app folder or plist")
    if path.is_file() and path.stat().st_size > MAX_MB * 1024 * 1024:
        ap.error(f"larger than {MAX_MB} MB")
    try:
        if a.plist:
            print(json.dumps(load_plist(path.read_bytes()), indent=1, default=jsonable))
            return
        s = inspect(path)
    except (ValueError, zipfile.BadZipFile, OSError, KeyError) as e:
        print(f"error: {e}", file=sys.stderr)
        sys.exit(2)
    print(json.dumps(s, indent=1, default=jsonable)) if a.json else show(s)


if __name__ == "__main__":
    main()
