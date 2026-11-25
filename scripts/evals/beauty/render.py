"""Render an HTML file to PNG at an exact size.

usage: python render.py <file.html> <width> <height> [out.png]
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

html, w, h = Path(sys.argv[1]).resolve(), int(sys.argv[2]), int(sys.argv[3])
out = Path(sys.argv[4]) if len(sys.argv) > 4 else html.with_suffix(".png")

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")
    page = browser.new_page(viewport={"width": w, "height": h})
    page.goto(html.as_uri(), wait_until="networkidle")
    page.wait_for_timeout(800)  # let web fonts settle
    page.screenshot(path=str(out), full_page=False)
    browser.close()
print(out)
