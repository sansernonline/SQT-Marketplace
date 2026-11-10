"""Render all 9 covers from web/cover.html (Chrome via Playwright).

Writes  covers/<p>-<doc>.png (150 dpi) · covers/<p>-set.png · covers/litenet-print.png
        bg/<p>-<doc>-bg.png (300 dpi, 2480x3508, editable text hidden, logo kept)
        build/layout/<p>-<doc>.json (live text boxes for the Word builder) · covers/checks.json
Returns False when a check fails.
"""
import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "src" / "web"
COVERS, BG, LAYOUT = ROOT / "covers", ROOT / "bg", ROOT / "build" / "layout"
CHROME = os.environ.get("COVER_CHROME") or None  # None = Playwright's own Chromium
PROJECTS = {"litenet": "logo tiles, field colour by doc family", "swipeos": "gesture pictogram grid, series number tile", "telex": "screen over violet band, tab"}
DOCS = ["BRD", "SRS", "ARCH"]


def shoot(page, url, path, w=1240, h=1754):
    page.goto(url)
    page.wait_for_function("window.__ready === true", timeout=60000)
    page.screenshot(path=str(path), clip={"x": 0, "y": 0, "width": w, "height": h})
    return page.evaluate("[window.__report || null, window.__layout || null]")


def bad(c):
    return c["minContrast"] < 4.5 or c["minFontPx"] < 18 or c["collisions"] or c["overflow"]


def main():
    for d in (COVERS, BG, LAYOUT):
        d.mkdir(parents=True, exist_ok=True)
    cover = (WEB / "cover.html").as_uri()
    checks = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=CHROME)
        p1 = browser.new_page(viewport={"width": 1240, "height": 1754}, device_scale_factor=1)
        p2 = browser.new_page(viewport={"width": 1240, "height": 1754}, device_scale_factor=2)   # 300 dpi bg
        sheet = browser.new_page(viewport={"width": 2160, "height": 1160}, device_scale_factor=1)
        for p, method in PROJECTS.items():
            for d in DOCS:
                rep, lay = shoot(p1, f"{cover}?p={p}&d={d}", COVERS / f"{p}-{d.lower()}.png")
                checks.append(rep)
                (LAYOUT / f"{p}-{d.lower()}.json").write_text(json.dumps(lay, ensure_ascii=False, indent=1), encoding="utf-8")
                shoot(p2, f"{cover}?p={p}&d={d}&layer=bg", BG / f"{p}-{d.lower()}-bg.png")
            if p == "litenet":
                checks.append(shoot(p1, f"{cover}?p={p}&d=SRS&t=print", COVERS / "litenet-print.png")[0])
            shoot(sheet, f"{(WEB / 'set.html').as_uri()}?p={p}&m={method}", COVERS / f"{p}-set.png", 2160, 1160)
        browser.close()
    (COVERS / "checks.json").write_text(json.dumps(checks, indent=1, ensure_ascii=False), encoding="utf-8")
    for c in checks:
        print(f"{'FAIL' if bad(c) else 'ok  '} {c['project']:8} {c['doc']:4} {c['theme']:5} contrast {c['minContrast']} "
              f"font {c['minFontPx']}px collisions {c['collisions']} overflow {c['overflow']}")
    return not any(bad(c) for c in checks)


if __name__ == "__main__":
    raise SystemExit(0 if main() else 1)
