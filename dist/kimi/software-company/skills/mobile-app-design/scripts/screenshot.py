"""
screenshot.py — เรนเดอร์ mockup แล้วถ่ายภาพ เพื่อ "ดูจริง" ก่อนส่งให้ใคร
ขั้นตอนนี้ห้ามข้าม: เลย์เอาต์ที่พังจะไม่มีทางเห็นจากการอ่านโค้ด

    pip install playwright && playwright install chromium

    python screenshot.py mockup-template.html out/
    python screenshot.py mockup-template.html out/ --width 900     # ทดสอบหน้าต่างแคบ
    python screenshot.py mockup-template.html out/ --full          # เก็บทั้งหน้าที่เลื่อนได้

ได้ไฟล์ <ชื่อ>-dark.png และ <ชื่อ>-light.png — ต้องเปิดดูทั้งคู่
"""

import argparse
import os
import sys
from pathlib import Path


def shoot(html_path, out_dir, width=1440, height=900, full=False, scale=1):
    from playwright.sync_api import sync_playwright

    html = Path(html_path).resolve()
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    stem = html.stem
    made = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for theme in ("dark", "light"):
            page = browser.new_page(
                viewport={"width": width, "height": height},
                device_scale_factor=scale,
            )
            page.goto(html.as_uri())
            page.evaluate("t => document.documentElement.dataset.theme = t", theme)
            page.wait_for_timeout(300)          # ให้ transition จบก่อน
            target = out / f"{stem}-{theme}.png"
            page.screenshot(path=str(target), full_page=full)
            made.append(target)
            page.close()
        browser.close()
    return made


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("html", help="ไฟล์ mockup")
    ap.add_argument("outdir", nargs="?", default="out", help="โฟลเดอร์ปลายทาง")
    ap.add_argument("--width", type=int, default=1440,
                    help="ความกว้างหน้าต่าง (1440=Large, 900=Medium, 600=Small)")
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--full", action="store_true", help="เก็บทั้งหน้ารวมส่วนที่ต้องเลื่อน")
    ap.add_argument("--scale", type=int, default=1, help="device scale factor (2 = จอ HiDPI)")
    a = ap.parse_args()

    if not os.path.exists(a.html):
        sys.exit("ไม่พบไฟล์: " + a.html)
    for f in shoot(a.html, a.outdir, a.width, a.height, a.full, a.scale):
        print(f)


if __name__ == "__main__":
    main()
