"""cover_art.py — cover art for the night cover (`BrandDoc.cover(style="night")`).

Both functions return PNG bytes, so nothing is written to disk. Needs numpy and pillow
(`pip install numpy pillow`); brandkit imports this file only when the night cover is used.
"""
import io
import sys

try:
    import numpy as np
    from PIL import Image
except ImportError:                       # --self-test below can then skip instead of crash
    if sys.argv[1:] != ["--self-test"]:
        raise
    np = Image = None

PAGE_PX = (1240, 1754)                 # A4 at 150 dpi
PX_CM = PAGE_PX[0] / 21.0
LINE_HEIGHT_CM = 3.0                   # picture height, glow included
BAR_THICK_PX, BAR_CORNER_PX = 4.0, 1.4  # at 150 dpi: about 0.68 mm thick, 0.24 mm corner radius
SCALE = 2                              # line is drawn at 300 dpi so Word's PDF keeps it smooth
GLOW_PAD_CM = 1.2                      # room for the glow beyond the bar ends


def _rgb(hex_color):
    return np.array([int(hex_color[i:i + 2], 16) for i in (0, 2, 4)], float)


def _png(rgb_or_rgba, mode):
    buf = io.BytesIO()
    Image.fromarray(np.clip(rgb_or_rgba, 0, 255).astype("uint8"), mode).save(buf, "PNG")
    buf.seek(0)
    return buf


def night_background(glow_a, glow_b, base="1C1C22"):
    """full-page neutral dark grey with two faint colour glows (top right, bottom left) and a faint dot grid"""
    w, h = PAGE_PX
    yy, xx = np.mgrid[0:h, 0:w]
    img = np.zeros((h, w, 3), float) + _rgb(base)
    for cx, cy, radius, colour, strength in ((1.0, 0.0, 0.9, glow_a, 0.16), (0.0, 1.0, 0.7, glow_b, 0.08)):
        d = np.sqrt(((xx - cx * w) / w) ** 2 + ((yy - cy * h) / w) ** 2) / radius
        a = (np.clip(1 - d, 0, 1) ** 2.2 * strength)[..., None]
        img = img * (1 - a) + _rgb(colour) * a
    dots = ((xx % 31) < 2) & ((yy % 31) < 2)
    img[dots] = img[dots] * 0.95 + 255 * 0.05
    return _png(img, "RGB")


def light_line(width_cm, colors):
    """one transparent picture: a bar `width_cm` wide with straight ends and slightly rounded corners,
    colour stepping through the 3 `colors`, soft glow that fades to zero before the picture edge.
    Returns (png_bytes, pad_cm): the picture is `pad_cm` wider than the bar on each side."""
    px = PX_CM * SCALE
    pad = GLOW_PAD_CM * px
    W, H = int(width_cm * px + 2 * pad), int(LINE_HEIGHT_CM * px)
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    cx, cy = (W - 1) / 2, (H - 1) / 2
    hx, hy, r = width_cm * px / 2, BAR_THICK_PX * SCALE / 2, BAR_CORNER_PX * SCALE
    qx, qy = np.abs(xx - cx) - (hx - r), np.abs(yy - cy) - (hy - r)
    dist = np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r
    core = np.clip(0.5 - dist, 0, 1)
    d = np.maximum(dist, 0) / SCALE
    glow = 0.32 * np.exp(-(d / 20) ** 2) + 0.38 * np.exp(-(d / 5) ** 2)
    glow = glow * np.clip(np.minimum(np.minimum(xx, W - 1 - xx), np.minimum(yy, H - 1 - yy)) / (0.4 * px), 0, 1)
    alpha = np.clip(core + glow * (1 - core), 0, 1)
    t = np.clip((xx - (cx - hx)) / (2 * hx), 0, 1)
    s = t * t * (3 - 2 * t)
    a, b, c = (_rgb(k) for k in colors)
    u = np.clip(2 * s, 0, 1)[..., None]
    v = np.clip(2 * s - 1, 0, 1)[..., None]
    col = np.where((s < 0.5)[..., None], a * (1 - u) + b * u, b * (1 - v) + c * v)
    hot = (np.exp(-((yy - cy) / (0.9 * SCALE)) ** 2) * core * 0.45)[..., None]
    rgba = np.dstack([col * (1 - hot) + 255 * hot, alpha * 255])
    return _png(rgba, "RGBA"), GLOW_PAD_CM


def self_test():
    """python cover_art.py --self-test — draws both pictures and checks size, mode and transparency"""
    if np is None:
        print("self-test skipped: numpy/pillow missing (pip install numpy pillow)")
        return
    bg = Image.open(night_background("2A78D6", "9B5DE5"))
    assert bg.size == PAGE_PX and bg.mode == "RGB", (bg.size, bg.mode)
    px = bg.load()
    assert px[PAGE_PX[0] // 2, PAGE_PX[1] // 2] != (0, 0, 0)           # base colour, not black
    assert px[PAGE_PX[0] - 3, 3][2] > px[PAGE_PX[0] // 2, PAGE_PX[1] // 2][2]  # glow A brightens the top-right corner
    buf, pad = light_line(10, ("2A78D6", "9B5DE5", "F15BB5"))
    line = Image.open(buf)
    assert pad == GLOW_PAD_CM and line.mode == "RGBA", (pad, line.mode)
    assert line.size == (int(10 * PX_CM * SCALE + 2 * pad * PX_CM * SCALE), int(LINE_HEIGHT_CM * PX_CM * SCALE)), line.size
    a = line.getchannel("A")
    assert a.getpixel((line.width // 2, line.height // 2)) == 255      # solid bar in the middle
    assert a.getpixel((0, 0)) == 0 and a.getpixel((line.width - 1, line.height - 1)) == 0  # glow fades out before the edge
    print("self-test ok")


if __name__ == "__main__":
    if sys.argv[1:] == ["--self-test"]:
        self_test()
    else:
        print("usage: python cover_art.py --self-test   (this file is imported by brandkit.py)")
