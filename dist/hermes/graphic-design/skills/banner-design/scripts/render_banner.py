"""เรนเดอร์แบนเนอร์ HTML เป็น PNG ขนาดจริง แล้ววางเทียบกับต้นแบบได้

python render_banner.py banner.html --size 1240x652 --out banner.png
python render_banner.py banner.html --size 1240x652 --out banner.png --compare ref.png   # ได้ banner-compare.png บนต้นแบบ ล่างงานเรา
python render_banner.py --self-test

- จับเฉพาะ element `.stage` (ไม่จับทั้งหน้า) ที่ความละเอียด 2 เท่า แล้วตรวจขนาดภาพที่ได้
- `<span class="ic" style="--i:url(icons/x.svg)">` ถูกแทนด้วย SVG ในบรรทัด เพราะ Chromium ไม่โหลด CSS mask จาก file://
- บอกฟอนต์ที่โหลดได้จริง ฟอนต์ไทยไม่ขึ้น = ห้ามส่ง
"""
import argparse
import re
import sys
import tempfile
from pathlib import Path

ICON = re.compile(r'<span class="ic" style="--i:url\(([^)]+\.svg)\)"></span>')


def inline_icons(src, base):
    def svg(m):
        body = (base / m[1]).read_text(encoding="utf-8")
        return body.replace("<svg ", '<svg class="ic" ', 1)
    src = ICON.sub(svg, src)
    return src.replace("</style>", "svg.ic{background:none;-webkit-mask:none;mask:none}</style>", 1)


def render(html, size, out, scale=2):
    from playwright.sync_api import sync_playwright
    w, h = size
    built = html.with_name(html.stem + ".built.html")
    built.write_text(inline_icons(html.read_text(encoding="utf-8"), html.parent), encoding="utf-8")
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        page = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=scale)
        page.goto(built.resolve().as_uri())
        page.evaluate("document.fonts.ready")
        fonts = page.evaluate("[...document.fonts].filter(f => f.status == 'loaded').map(f => f.family + ' ' + f.weight)")
        box = page.locator(".stage").bounding_box()
        page.locator(".stage").screenshot(path=str(out))
        b.close()
    from PIL import Image
    got = Image.open(out).size
    ok = (round(box["width"]), round(box["height"])) == (w, h) and got == (w * scale, h * scale)
    return fonts, got, ok


def compare(ref, out):
    from PIL import Image
    a = Image.open(ref).convert("RGB")
    b = Image.open(out).convert("RGB").resize(a.size)
    s = Image.new("RGB", (a.width, a.height * 2 + 16), "#888")
    s.paste(a, (0, 0))
    s.paste(b, (0, a.height + 16))
    path = out.with_name(out.stem + "-compare.png")
    s.save(path)
    return path


def self_test():
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        (d / "icons").mkdir()
        (d / "icons" / "dot.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>')
        html = d / "b.html"
        html.write_text('<!doctype html><meta charset="utf-8"><style>body{margin:0}.stage{width:300px;height:100px;background:#123}</style>'
                        '<div class="stage"><span class="ic" style="--i:url(icons/dot.svg)"></span></div>', encoding="utf-8")
        built = inline_icons(html.read_text(), d)
        checks = [("แทนไอคอนด้วย SVG ในบรรทัด", '<svg class="ic"' in built and "--i:url" not in built)]
        _, got, ok = render(html, (300, 100), d / "b.png")
        checks.append(("ขนาดภาพ 2 เท่าตรง", ok and got == (600, 200)))
        _, _, bad = render(html, (320, 100), d / "c.png")
        checks.append(("ขนาดไม่ตรงถูกจับได้", not bad))
    for name, ok in checks:
        print(("ผ่าน     " if ok else "ไม่ผ่าน  ") + name)
    print(f"self-test {sum(ok for _, ok in checks)}/{len(checks)}")
    return all(ok for _, ok in checks)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("html", nargs="?")
    ap.add_argument("--size", help="กว้างxสูง เช่น 1200x628")
    ap.add_argument("--out")
    ap.add_argument("--compare", help="ภาพต้นแบบ วางบน งานเราอยู่ล่าง")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(0 if self_test() else 1)
    if not (a.html and a.size and a.out):
        ap.error("ต้องมี html --size --out")
    size = tuple(int(x) for x in a.size.lower().split("x"))
    fonts, got, ok = render(Path(a.html), size, Path(a.out))
    print("ฟอนต์ที่โหลด:", ", ".join(fonts) or "(ไม่มี · ฟอนต์ไม่ขึ้น ห้ามส่ง)")
    print(f"ภาพ {got[0]}x{got[1]} · " + ("ขนาดตรง" if ok else f"ขนาดไม่ตรง {a.size} · ตรวจ .stage"))
    if a.compare:
        print("เทียบ:", compare(Path(a.compare), Path(a.out)))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
