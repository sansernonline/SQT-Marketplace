# from diagram-figures/assets/mermaid-engine
"""SVG -> PNG at scale 2 with Playwright, many figures in one browser session."""
from playwright.sync_api import sync_playwright


def render_all(jobs, scale=2):
    """jobs = [(svg_text, width, height, png_path)]"""
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page(viewport={"width": 1300, "height": 800}, device_scale_factor=scale)
        for svg, w, h, png in jobs:
            pg.set_viewport_size({"width": int(w) + 20, "height": min(int(h) + 20, 16000)})
            pg.set_content('<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff">'
                           + svg + "</body>")
            pg.evaluate("document.fonts.ready")
            pg.locator("svg").first.screenshot(path=png)
        b.close()
