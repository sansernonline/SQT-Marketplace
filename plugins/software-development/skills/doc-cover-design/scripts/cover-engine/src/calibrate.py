"""Measure how far Word puts each text block from where the HTML preview has it, and store corrections.

Compares covers/<p>-srs.png (Chrome) with build/qa/<p>-150-1.png (Word PDF, page 1, 150 dpi): for each live block,
the ink of the preview box is slid over the Word render (+-14 px) and the best match is the offset.
Offsets are grouped by text style (family|weight|size|line-height) and added to build/calib.json, which
docx_build.py subtracts from the frame y. Returns the largest remaining vertical offset in px.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CALIB = ROOT / "build" / "calib.json"
R = 14


def ink(img, bg):
    a = np.asarray(img.convert("RGB"), dtype=np.int16)
    return (np.abs(a - np.array(bg, dtype=np.int16)).sum(axis=2) > 90)


def offset(pre, word, b):
    x0, y0 = int(b["x"]), int(b["y"])
    x1, y1 = min(int(b["x"] + b["w"]) + 2, pre.shape[1] - R), min(int(b["y"] + b["h"]) + 2, pre.shape[0] - R)
    t = pre[y0:y1, x0:x1]
    if t.sum() < 20:
        return None
    best = None
    for dy in range(-R, R + 1):
        for dx in range(-R, R + 1):
            s = (t ^ word[y0 + dy:y1 + dy, x0 + dx:x1 + dx]).sum()
            if best is None or s < best[0]:
                best = (s, dx, dy)
    return best[1], best[2]


def main(projects=("litenet", "swipeos", "telex")):
    from docx_build import style_key
    calib = json.loads(CALIB.read_text(encoding="utf-8")) if CALIB.exists() else {}
    worst = 0
    for p in projects:
        lay = json.loads((ROOT / "build" / "layout" / f"{p}-srs.json").read_text(encoding="utf-8"))
        pre_img = Image.open(ROOT / "covers" / f"{p}-srs.png")
        word_img = Image.open(ROOT / "build" / "qa" / f"{p}-150-1.png").resize((1240, 1754))
        masks = {}
        found = {}
        for b in lay["blocks"]:   # ink = differs from the flat colour this block sits on (page, band or pill)
            key = b.get("bg", lay["bg"])
            if key not in masks:
                bg = tuple(int(key[i:i + 2], 16) for i in (1, 3, 5))
                masks[key] = (ink(pre_img, bg), ink(word_img, bg))
            o = offset(*masks[key], b)
            if o:
                found.setdefault(style_key(b), []).append(o)
        cp = calib.setdefault(p, {})
        for k, offs in found.items():
            dx, dy = (int(np.median([o[i] for o in offs])) for i in (0, 1))
            old = cp.get(k, [0, 0])
            cp[k] = [0, old[1] + dy]   # x is not corrected: both put the glyph origin on x; dx only shows width drift
            worst = max(worst, abs(dy))
            print(f"{p:8} {k:42} measured dx {dx:+d} dy {dy:+d} -> correction {cp[k]}")
    CALIB.write_text(json.dumps(calib, indent=1), encoding="utf-8")
    return worst


if __name__ == "__main__":
    print("largest offset px:", main())
