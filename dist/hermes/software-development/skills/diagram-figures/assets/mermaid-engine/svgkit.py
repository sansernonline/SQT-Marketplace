# from diagram-figures/assets/mermaid-engine
"""Visual language shared by all figure types: colours, text, boxes, orthogonal wires.
Every connector goes through wire(), which refuses diagonal segments. Lines stay horizontal or vertical;
elbows and boxes get rounded corners (radii in theme.py)."""
import os
from functools import lru_cache
from PIL import ImageFont
import theme as T


# -- colour ------------------------------------------------------------------
def _rgb(h): h = h.lstrip("#"); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def tint(hex_color, amount):
    """amount > 0 mixes toward white, < 0 toward black (range -1..1)."""
    r, g, b = _rgb(hex_color)
    f = amount if amount >= 0 else 1 + amount
    mix = [c + (255 - c) * f for c in (r, g, b)] if amount >= 0 else [c * f for c in (r, g, b)]
    return "#%02X%02X%02X" % tuple(max(0, min(255, round(c))) for c in mix)


LINE = tint(T.ACCENT, T.LINE_MIX)
ACCENT_FILL = tint(T.ACCENT, .94)
ACCENT_INK = tint(T.ACCENT, -.2)


# -- text --------------------------------------------------------------------
def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


@lru_cache(maxsize=None)
def _font(size, bold):
    for p in T.MEASURE_FONTS[bold]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return None


def text_w(s, size=T.FS, bold=False):
    f = _font(size, bold)
    if f is None:
        return len(s) * size * (0.58 if bold else 0.54)
    return f.getlength(s)


def wrap(text, max_w, size=T.FS, bold=False):
    """Split on explicit breaks, then wrap words so no line is wider than max_w."""
    out = []
    for para in str(text).replace("<br/>", "\n").replace("<br>", "\n").split("\n"):
        line = ""
        for word in para.split():
            cand = (line + " " + word).strip()
            if line and text_w(cand, size, bold) > max_w:
                out.append(line)
                line = word
            else:
                line = cand
        out.append(line)
    return out


def lh(size=T.FS):
    return round(size * T.LH, 1)


def text_block(x, y, lines, size=T.FS, bold=False, fill=T.INK, anchor="middle", italic=False):
    """Lines starting with their top edge at y. Returns svg string."""
    h = lh(size)
    o = []
    for i, ln in enumerate(lines):
        base = y + i * h + h / 2 + size * 0.36
        st = ' font-style="italic"' if italic else ""
        o.append(f'<text x="{x:.1f}" y="{base:.1f}" font-size="{size}" font-weight="{700 if bold else 400}"'
                 f' fill="{fill}" text-anchor="{anchor}"{st}>{esc(ln)}</text>')
    return "".join(o)


def block_size(lines, size=T.FS, bold=False):
    return max([text_w(l, size, bold) for l in lines] + [0]), len(lines) * lh(size)


# -- shapes ------------------------------------------------------------------
def rect(x, y, w, h, fill=T.PAPER, stroke=T.BORDER, sw=1, shadow=False, dash=None, glow=False, r=T.BOX_R):
    f = ' filter="url(#glow)"' if glow else (' filter="url(#sh)"' if shadow else "")
    d = f' stroke-dasharray="{dash}"' if dash else ""
    r = min(r, w / 2, h / 2)
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r:.1f}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="{sw}"{d}{f}/>')


def hline(x1, x2, y, stroke, sw=1, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line class="wire" x1="{x1:.1f}" y1="{y:.1f}" x2="{x2:.1f}" y2="{y:.1f}" stroke="{stroke}" stroke-width="{sw}"{d}/>'


def vline(x, y1, y2, stroke, sw=1, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line class="wire" x1="{x:.1f}" y1="{y1:.1f}" x2="{x:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{sw}"{d}/>'


def wire(pts, dashed=False, head="arrow", color=None):
    """Orthogonal connector with rounded elbows. head: arrow | cross | open | None."""
    pts = [(round(x, 1), round(y, 1)) for x, y in pts]
    for (ax, ay), (bx, by) in zip(pts, pts[1:]):
        if ax != bx and ay != by:
            raise ValueError(f"diagonal segment {pts}")
    col = color or "url(#wg)"
    d = _rounded(pts)
    dash = ' stroke-dasharray="7 5"' if dashed else ""
    mid = {"arrow": "ah", "cross": "ax", "open": "ao"}.get(head)
    if mid:
        mid += "r" if color else str(_bucket(pts[-1][0]))   # head takes the gradient colour at its own x
    mk = f' marker-end="url(#{mid})"' if mid else ""
    return (f'<path class="wire" d="{d}" fill="none" stroke="{col}" stroke-width="{T.LINE_W}" '
            f'stroke-linejoin="round" stroke-linecap="butt"{dash}{mk}/>')


def _rounded(pts, r=T.WIRE_R):
    """Path through orthogonal points: straight runs joined by quarter-circle arcs.
    The radius shrinks to half the shorter neighbouring run so arcs never overlap."""
    pts = [p for i, p in enumerate(pts) if i == 0 or p != pts[i - 1]]
    d = [f"M{pts[0][0]},{pts[0][1]}"]
    for i in range(1, len(pts) - 1):
        (ax, ay), (bx, by), (cx, cy) = pts[i - 1], pts[i], pts[i + 1]
        l1, l2 = abs(bx - ax) + abs(by - ay), abs(cx - bx) + abs(cy - by)
        k = min(r, l1 / 2, l2 / 2)
        u1 = ((bx - ax) / l1, (by - ay) / l1)
        u2 = ((cx - bx) / l2, (cy - by) / l2)
        cross = u1[0] * u2[1] - u1[1] * u2[0]
        if abs(cross) < .5 or k < .5:          # straight through or no room: plain corner
            d.append(f"L{bx},{by}")
            continue
        p1 = (round(bx - u1[0] * k, 1), round(by - u1[1] * k, 1))
        p2 = (round(bx + u2[0] * k, 1), round(by + u2[1] * k, 1))
        d.append(f"L{p1[0]},{p1[1]} A{k:.1f},{k:.1f} 0 0 {1 if cross > 0 else 0} {p2[0]},{p2[1]}")
    d.append(f"L{pts[-1][0]},{pts[-1][1]}")
    return " ".join(d)


def tag(x, y, text, size=11.5):
    """Small white tag (rounded corners) with top-left at x,y. Returns (svg, width, height)."""
    w = text_w(text, size, True) + 14
    h = lh(size) + 4
    return (rect(x, y, w, h, fill=T.PAPER, stroke=T.TAG_LINE, sw=1.2, r=T.TAG_R) +
            text_block(x + w / 2, y + 2, [text], size, True, fill=T.TAG_INK)), w, h


def plate(x, y, w, h, border=True):
    """White label tag behind text on a wire; border=False for tiny marks (cardinality)."""
    return rect(x, y, w, h, fill=T.PAPER, stroke=T.TAG_LINE if border else "none", sw=1, r=T.TAG_R)


def focus_card(x, y, w, h):
    """The one focus card: dark like the app, gradient 2px border, soft purple glow."""
    return rect(x, y, w, h, fill=T.FOCUS_BG, stroke="url(#bd)", sw=2, glow=True, r=T.FOCUS_R)


def badge(cx, cy, n, r=12):
    """Step number: gradient circle, white number, white ring (2-digit numbers get a smaller font)."""
    fs = 11 if n < 10 else 10
    return (f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="url(#bd)" stroke="{T.PAPER}" stroke-width="2.5"/>'
            + text_block(cx, cy - lh(fs) / 2, [str(n)], fs, True, fill=T.PAPER))


# -- gradient helpers ----------------------------------------------------------
BUCKETS = 24


def _bucket(x):
    t = (x - T.MARGIN) / (T.SHEET_W - 2 * T.MARGIN)
    return max(0, min(BUCKETS - 1, int(t * BUCKETS)))


def _mix(a, b, t):
    A, B = _rgb(a), _rgb(b)
    return "#%02X%02X%02X" % tuple(round(p + (q - p) * t) for p, q in zip(A, B))


# -- sheet -------------------------------------------------------------------
def _markers():
    o = []
    cols = [(str(i), _mix(T.WIRE_A, T.WIRE_B, (i + .5) / BUCKETS)) for i in range(BUCKETS)]
    for suffix, col in cols + [("", LINE), ("r", T.STATUS["error"][0])]:
        o.append(f'<marker id="ah{suffix}" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" '
                 f'markerUnits="strokeWidth" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{col}"/></marker>')
        o.append(f'<marker id="ao{suffix}" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" '
                 f'markerUnits="strokeWidth" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="{col}" stroke-width="1.6"/></marker>')
        o.append(f'<marker id="ax{suffix}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" '
                 f'markerUnits="strokeWidth" orient="auto"><path d="M1,1 L9,9 M9,1 L1,9" stroke="{col}" stroke-width="2"/></marker>')
    return "".join(o)


def sheet(w, h, body, dots=True):
    w, h = int(round(w)), int(round(h))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
            f'font-family="{T.FONT}">'
            f'<defs>{_markers()}'
            f'<linearGradient id="bar" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="{T.ACCENT}"/>'
            f'<stop offset="1" stop-color="{T.SECOND}"/></linearGradient>'
            f'<linearGradient id="wg" gradientUnits="userSpaceOnUse" x1="{T.MARGIN}" y1="0" x2="{T.SHEET_W - T.MARGIN}" y2="0">'
            f'<stop offset="0" stop-color="{T.WIRE_A}"/><stop offset="1" stop-color="{T.WIRE_B}"/></linearGradient>'
            f'<linearGradient id="bd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{T.ACCENT}"/>'
            f'<stop offset="1" stop-color="{T.SECOND}"/></linearGradient>'
            f'<pattern id="dots" width="{T.DOT_STEP}" height="{T.DOT_STEP}" patternUnits="userSpaceOnUse">'
            f'<circle cx="{T.DOT_STEP / 2}" cy="{T.DOT_STEP / 2}" r="1.1" fill="{T.DOT}"/></pattern>'
            f'<filter id="sh" x="-10%" y="-20%" width="120%" height="160%"><feDropShadow dx="0" dy="1" '
            f'stdDeviation="1" flood-color="#141828" flood-opacity="0.05"/><feDropShadow dx="0" dy="6" '
            f'stdDeviation="7" flood-color="#141828" flood-opacity="0.09"/></filter>'
            f'<filter id="glow" x="-30%" y="-40%" width="160%" height="220%"><feDropShadow dx="0" dy="10" '
            f'stdDeviation="12" flood-color="{T.ACCENT}" flood-opacity="0.35"/></filter></defs>'
            f'<rect width="{w}" height="{h}" fill="{T.PAPER}"/>'
            f'<rect x="8" y="12" width="{w - 16}" height="{h - 20}" rx="18" fill="{T.PANEL}" stroke="{T.PANEL_LINE}"/>'
            + (f'<rect x="8" y="12" width="{w - 16}" height="{h - 20}" rx="18" fill="url(#dots)" stroke="none"/>' if dots else "")
            + f'<rect width="{w}" height="4" fill="url(#bar)"/>{body}</svg>')
