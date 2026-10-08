"""
SVG → PNG ด้วย Playwright ที่ 2 เท่า
ติดตั้งครั้งเดียว:  pip install playwright && playwright install chromium
ใช้:  python render.py d01.svg ../01-system-context.png 1400 760
"""
import sys, pathlib
from playwright.sync_api import sync_playwright

def render(svg_path, png_path, w, h, scale=2):
    html = ('<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff">'
            + open(svg_path, encoding="utf-8").read() + '</body>')
    tmp = pathlib.Path(svg_path).with_suffix(".preview.html")
    tmp.write_text(html, encoding="utf-8")
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page(viewport={"width": int(w), "height": int(h)}, device_scale_factor=scale)
        pg.goto("file://" + tmp.resolve().as_posix())
        pg.wait_for_timeout(450)
        pg.screenshot(path=png_path)
        b.close()
    tmp.unlink(missing_ok=True)
    print("เขียนไฟล์แล้ว", png_path)

if __name__ == "__main__":
    render(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
