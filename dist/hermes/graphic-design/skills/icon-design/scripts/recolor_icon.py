"""เปลี่ยนสีไอคอน SVG ที่นักออกแบบทำ (เช่น Fluent แบบสี) ให้เป็นเฉดของแบรนด์ โดยคงแสงเงาเดิมไว้

  python recolor_icon.py <ไฟล์.svg ...> --hue 35 --out <โฟลเดอร์> [--squeeze 0.5]
  python recolor_icon.py --hex "#C2461A" ...      (ใช้เฉดของสีนี้แทน --hue)
  python recolor_icon.py --self-test

วิธีคิด: แปลงทุกสีในไฟล์เป็น OKLCH แล้วคงความสว่าง (L) และความอิ่ม (C) ไว้ หมุนแค่เฉด (h)
ให้ค่าเฉลี่ยของไอคอนตรงเฉดแบรนด์ · สีเทา (C ต่ำ) ไม่แตะ · --squeeze บีบเฉดย่อยเข้าหากัน
(0 = คงความต่างของเฉดเดิมทั้งหมด · 1 = ทุกจุดเป็นเฉดเดียว) · ใช้กับไฟล์ที่ใบอนุญาตให้ดัดแปลงเท่านั้น
"""
import argparse
import math
import re
import sys
import tempfile
from pathlib import Path

HEX = re.compile(r"#[0-9a-fA-F]{6}\b")
# รูปแบบสีที่สคริปต์ไม่แปลง: hex 3 · 4 · 8 หลัก · rgb() hsl() · ชื่อสี
OTHER = re.compile(r'#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{3,4}\b|\b(?:rgb|hsl)a?\(|(?:fill|stroke|stop-color)[=:]\s*"?(?!none|url|#|currentColor)[a-zA-Z]+')
GREY = 0.04  # ความอิ่มต่ำกว่านี้ถือเป็นสีเทา


def to_oklch(hex_):
    r, g, b = ((c / 12.92) if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
               for c in (int(hex_[i:i + 2], 16) / 255 for i in (1, 3, 5)))
    l = (0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) ** (1 / 3)
    m = (0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b) ** (1 / 3)
    s = (0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b) ** (1 / 3)
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    return L, math.hypot(A, B), math.degrees(math.atan2(B, A)) % 360


def to_hex(L, C, h):
    a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
    l, m, s = ((L + 0.3963377774 * a + 0.2158037573 * b) ** 3, (L - 0.1055613458 * a - 0.0638541728 * b) ** 3,
               (L - 0.0894841775 * a - 1.2914855480 * b) ** 3)
    rgb = (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
           -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
           -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
    out = []
    for c in rgb:
        c = min(1, max(0, c))
        out.append(round((12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055) * 255))
    return "#" + "".join(f"{v:02x}" for v in out)


def mean_hue(colors):
    """เฉดเฉลี่ยแบบวงกลม ถ่วงด้วยความอิ่ม · ไม่มีสีสดคืน None"""
    vivid = [to_oklch(c) for c in colors if to_oklch(c)[1] > GREY]
    if not vivid:
        return None
    x = sum(c * math.cos(math.radians(h)) for _, c, h in vivid)
    y = sum(c * math.sin(math.radians(h)) for _, c, h in vivid)
    return math.degrees(math.atan2(y, x)) % 360


def recolor(svg, hue, squeeze=0.5):
    center = mean_hue(set(HEX.findall(svg)))
    if center is None:
        return svg

    def swap(m):
        L, C, h = to_oklch(m[0])
        if C <= GREY:
            return m[0]
        dh = ((h - center + 180) % 360) - 180
        return to_hex(L, C, hue + dh * (1 - squeeze))
    return HEX.sub(swap, svg)


def self_test():
    ok = []
    svg = '<svg><stop stop-color="#ff921f"/><stop stop-color="#eb4824"/><path fill="#808080"/></svg>'
    out = recolor(svg, 250)
    hues = [to_oklch(c)[2] for c in HEX.findall(out)[:2]]
    ok.append(("เฉดใหม่อยู่ใกล้ 250", all(abs(((h - 250 + 180) % 360) - 180) < 20 for h in hues)))
    ok.append(("สีเทาไม่ถูกแตะ", "#808080" in out))
    L0 = [round(to_oklch(c)[0], 2) for c in HEX.findall(svg)[:2]]
    L1 = [round(to_oklch(c)[0], 2) for c in HEX.findall(out)[:2]]
    ok.append(("ความสว่างคงเดิม (คลาดไม่เกิน 0.05)", all(abs(a - b) <= 0.05 for a, b in zip(L0, L1))))
    ok.append(("ไฟล์ไม่มีสีสดคืนเดิม", recolor('<svg fill="#777777"/>', 30) == '<svg fill="#777777"/>'))
    ok.append(("แปลงไปกลับได้สีเดิม", to_hex(*to_oklch("#3a7bd5")) == "#3a7bd5"))
    for name, passed in ok:
        print(f"  {'ผ่าน' if passed else 'ล้ม'} {name}")
    n = sum(p for _, p in ok)
    print(f"\nself-test {n}/{len(ok)} ผ่าน")
    return n == len(ok)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("files", nargs="*", type=Path)
    ap.add_argument("--hue", type=float)
    ap.add_argument("--hex")
    ap.add_argument("--squeeze", type=float, default=0.5)
    ap.add_argument("--out", type=Path, default=Path("recolored"))
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(0 if self_test() else 1)
    if a.hex:
        if not HEX.fullmatch(a.hex):
            ap.error("--hex ต้องเป็นสี hex 6 หลัก เช่น #C2461A")
        a.hue = to_oklch(a.hex)[2]
    if a.hue is None or not a.files or not math.isfinite(a.hue):
        ap.error("ต้องมีไฟล์ SVG และ --hue (ตัวเลข) หรือ --hex")
    missing = [str(f) for f in a.files if not f.is_file()]
    if missing:
        ap.error(f"ไม่พบไฟล์: {', '.join(missing)}")
    if not 0 <= a.squeeze <= 1:
        ap.error("--squeeze ต้องอยู่ระหว่าง 0 ถึง 1")
    a.out.mkdir(parents=True, exist_ok=True)
    for f in a.files:
        svg = f.read_text(encoding="utf-8")
        if OTHER.search(svg):
            print(f"เตือน {f.name}: มีสีแบบอื่นนอกจาก #rrggbb ส่วนนั้นไม่ถูกเปลี่ยน")
        if mean_hue(set(HEX.findall(svg))) is None:
            print(f"เตือน {f.name}: ไม่มีสีสดให้เปลี่ยน")
        (a.out / f.name).write_text(recolor(svg, a.hue, a.squeeze), encoding="utf-8")
    print(f"เปลี่ยนสี {len(a.files)} ไฟล์เป็นเฉด {a.hue:.0f} ลง {a.out} · เปิดภาพดูเองทุกครั้ง แล้วรัน icon_check.py")


if __name__ == "__main__":
    main()
