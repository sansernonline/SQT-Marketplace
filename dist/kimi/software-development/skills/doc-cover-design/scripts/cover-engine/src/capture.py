"""Shoot real Telex mockup screens at 2x (2880x1800) for the crop staging (method B). Reads the mockup, never writes.

    python src/capture.py [screen ...]   -> build/shots/telex-<screen>.png  (default: the screens in web/projects.js)
"""
import os
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

CHROME = os.environ.get("COVER_CHROME") or None  # None = Playwright's own Chromium
ROOT = Path(__file__).resolve().parents[1]
SHOTS = ROOT / "build" / "shots"
MOCKUP = Path(os.environ.get("COVER_MOCKUP", ROOT / "mockup.html"))  # the project's clickable mockup
# Mockup-only chrome (team notes, state switchers, toasts) is not product UI: hide it.
HIDE = """.mbar,.mock-switcher,.mock-fr,.mock-bar,.mk-note,.mockup-note,.toast,#toast
{display:none!important} *{animation:none!important;transition:none!important;caret-color:transparent!important}"""


def screens_from_projects():
    js = (ROOT / "src" / "web" / "projects.js").read_text(encoding="utf-8")
    return sorted(set(re.findall(r'screen:\s*"([^"]+)"', js)))


def main(screens):
    SHOTS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        for screen in screens:
            out = SHOTS / f"telex-{screen}.png"
            if out.exists():
                continue
            page = ctx.new_page()
            page.goto(MOCKUP.as_uri() + "#" + screen)
            page.wait_for_load_state("networkidle")
            page.add_style_tag(content=HIDE)
            page.evaluate("document.fonts.ready")
            page.evaluate("window.scrollTo(0,0)")
            page.wait_for_timeout(600)
            page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": 1440, "height": 900})
            page.close()
            print("shot", out.name)
        browser.close()


if __name__ == "__main__":
    main(sys.argv[1:] or screens_from_projects())
