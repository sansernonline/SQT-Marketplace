"""Make the cover fonts usable by Word: static TTFs, one Windows family per weight, installed per user.

Why: Word picks fonts by GDI family name and only knows Regular/Bold. Variable fonts (Space Grotesk[wght],
Anuphan[wght], JetBrains Mono[wght]) fall back to Calibri in Word's PDF export, so each weight we use is cut
into its own static font: 400 -> "Family", 700 -> "Family" Bold, 500 -> "Family Medium", 600 -> "Family SemiBold".
Idempotent: skips files already installed. Per-user install (no admin): %LOCALAPPDATA%\\Microsoft\\Windows\\Fonts + HKCU.
"""
import ctypes
import sys
import urllib.request
from pathlib import Path

try:
    import winreg
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont
except ImportError:                      # Windows-only + fontTools; `--self-test` then skips instead of crashing
    if sys.argv[1:] != ["--self-test"]:
        raise
    winreg = TTFont = None

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "build" / "fonts"
USER_FONTS = Path.home() / "AppData" / "Local" / "Microsoft" / "Windows" / "Fonts"
GF = "https://github.com/google/fonts/raw/main/ofl/"
SOURCES = {   # family -> (url, variable?)
    "Space Grotesk": (GF + "spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf", True),
    "Anuphan": (GF + "anuphan/Anuphan%5Bwght%5D.ttf", True),
    "JetBrains Mono": (GF + "jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf", True),
    "IBM Plex Mono": (GF + "ibmplexmono/IBMPlexMono-Medium.ttf", False),
}
# (family, weight) pairs the covers and body pages use in Word (700 = Bold of the base family, for headings). IBM Plex Sans Thai 400/700 is already installed on this machine.
NEEDED = [("Space Grotesk", 400), ("Space Grotesk", 500), ("Space Grotesk", 600), ("Space Grotesk", 700),
          ("Anuphan", 400), ("Anuphan", 600), ("Anuphan", 700), ("JetBrains Mono", 500), ("IBM Plex Mono", 500)]
SUFFIX = {400: "", 500: " Medium", 600: " SemiBold", 700: ""}


def word_family(family, weight):
    """Font name to put in w:rFonts for this weight; bold flag for 700."""
    return family + SUFFIX[weight], weight >= 700


def _rename(font, family, weight):
    fam = family + SUFFIX[weight]
    sub = "Bold" if weight >= 700 else "Regular"
    full = fam if sub == "Regular" else f"{fam} {sub}"
    ps = full.replace(" ", "")
    name = font["name"]
    for nid in (16, 17, 21, 22, 25):
        name.removeNames(nameID=nid)
    for nid, val in ((1, fam), (2, sub), (3, f"{ps};cover-lab"), (4, full), (6, ps)):
        name.setName(val, nid, 3, 1, 0x409)
        name.setName(val, nid, 1, 0, 0)
    os2 = font["OS/2"]
    os2.usWeightClass = weight
    os2.fsSelection = (os2.fsSelection & ~0b1100001) | (0b100000 if sub == "Bold" else 0b1000000)
    font["head"].macStyle = 1 if sub == "Bold" else 0
    return full


def build_static(family, weight):
    CACHE.mkdir(parents=True, exist_ok=True)
    url, variable = SOURCES[family]
    src = CACHE / url.rsplit("/", 1)[1].replace("%5B", "[").replace("%5D", "]")
    if not src.exists():
        urllib.request.urlretrieve(url, src)
    out = CACHE / f"{(family + SUFFIX[weight]).replace(' ', '')}-{weight}.ttf"
    font = TTFont(src)
    if variable:
        font = instantiateVariableFont(font, {"wght": weight}, updateFontNames=False)
    full = _rename(font, family, weight)
    font.save(out)
    return out, full


def install(path, full):
    dest = USER_FONTS / path.name
    key = r"Software\Microsoft\Windows NT\CurrentVersion\Fonts"
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, key, 0, winreg.KEY_READ | winreg.KEY_SET_VALUE) as k:
        try:
            if winreg.QueryValueEx(k, f"{full} (TrueType)")[0] == str(dest) and dest.exists():
                return False
        except FileNotFoundError:
            pass
        USER_FONTS.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(path.read_bytes())
        winreg.SetValueEx(k, f"{full} (TrueType)", 0, winreg.REG_SZ, str(dest))
    ctypes.windll.gdi32.AddFontResourceW(str(dest))
    ctypes.windll.user32.SendMessageTimeoutW(0xFFFF, 0x001D, 0, 0, 0x0002, 1000, None)   # WM_FONTCHANGE
    return True


def self_test():
    """python fonts.py --self-test: name mapping and static-font renaming; nothing is downloaded or installed."""
    assert word_family("Space Grotesk", 400) == ("Space Grotesk", False)
    assert word_family("Space Grotesk", 600) == ("Space Grotesk SemiBold", False)
    assert word_family("Anuphan", 700) == ("Anuphan", True)
    assert all(w in SUFFIX for _, w in NEEDED) and all(f in SOURCES for f, _ in NEEDED)
    if TTFont is None:
        print("self-test: rename check skipped (needs fontTools + Windows)")
        return
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.ttGlyphPen import TTGlyphPen
    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder([".notdef"])
    fb.setupCharacterMap({})
    fb.setupGlyf({".notdef": TTGlyphPen(None).glyph()})
    fb.setupHorizontalMetrics({".notdef": (500, 0)})
    fb.setupHorizontalHeader(ascent=800, descent=-200)
    fb.setupNameTable({"familyName": "Tmp", "styleName": "Regular"})
    fb.setupOS2()
    fb.setupPost()
    font = fb.font
    assert _rename(font, "Space Grotesk", 600) == "Space Grotesk SemiBold"
    assert font["name"].getDebugName(1) == "Space Grotesk SemiBold" and font["name"].getDebugName(2) == "Regular"
    assert font["OS/2"].usWeightClass == 600
    assert _rename(font, "Anuphan", 700) == "Anuphan Bold" and font["head"].macStyle == 1
    assert font["name"].getDebugName(2) == "Bold" and font["name"].getDebugName(6) == "AnuphanBold"
    print("self-test ok")


def main():
    if sys.argv[1:] == ["--self-test"]:
        return self_test()
    for family, weight in NEEDED:
        out, full = build_static(family, weight)
        print(("installed " if install(out, full) else "ok        ") + full)


if __name__ == "__main__":
    main()
