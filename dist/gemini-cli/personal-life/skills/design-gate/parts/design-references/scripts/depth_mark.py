"""depth_mark.py — the owner's winning logo-mark recipe as reusable SVG layers.

Distilled from the marks the owner scored 7-10 (OnNing wallet 10 · TanJai parcel and pin 8 · FaoDee dome and
shield 7 · CodeRuen 2026-11-27): one object, two saturated hues, 3-stop gradient inside one hue, soft drop
shadow, thin extrusion, faint film grain, light from the top left. Also the matching flat-design version
(solid tones, crisp planes), so both styles share one silhouette (graphic-design `flat-design.md`).

Draw on a 200-unit box. Usage:
    from depth_mark import Mark
    m = Mark("v", main=("#8a6bff", "#5b3df5", "#3416b0"), accent=("#7dffd4", "#22d8a4", "#0b9d74"))
    svg = m.svg(m.solid(HOUSE_PATH) + m.stroke(SLASH_PATH, 18))       # depth version
    flat = m.svg(m.flat_solid(HOUSE_PATH) + m.flat_stroke(SLASH_PATH, 18))
Run this file to write an example to ./depth_mark_example.html.
"""


class Mark:
    def __init__(self, uid, main, accent, shadow="#1a0c66", extrude=None, accent_extrude=None):
        """uid keeps <defs> ids unique when several marks share a page. main/accent: (light, mid, dark)."""
        self.u, self.main, self.acc, self.shadow = uid, main, accent, shadow
        self.ext = extrude or main[2]
        self.acc_ext = accent_extrude or accent[2]

    # ---------- shared defs ----------
    def defs(self):
        u = self.u
        g = lambda i, c: (f'<linearGradient id="{u}{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c[0]}"/>'
                          f'<stop offset=".55" stop-color="{c[1]}"/><stop offset="1" stop-color="{c[2]}"/></linearGradient>')
        return (g("m", self.main) + g("a", self.acc)
                + f'<filter id="{u}s" filterUnits="userSpaceOnUse" x="-40" y="-40" width="280" height="280"><feGaussianBlur stdDeviation="8"/></filter>'
                f'<filter id="{u}gr"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="7"/>'
                '<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>'
                f'<radialGradient id="{u}rl" cx=".28" cy=".18" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".34"/>'
                '<stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>')

    def svg(self, body, size=None):
        s = f' width="{size}" height="{size}"' if size else ""
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="overflow:visible"{s}><defs>{self.defs()}</defs>{body}</svg>'

    # ---------- depth version ----------
    def solid(self, d, accent=False, light=True):
        """filled shape: soft shadow (down-right), thin extrusion, gradient face, top-left light, grain."""
        u, fill, ext = self.u, f"url(#{self.u}{'a' if accent else 'm'})", self.acc_ext if accent else self.ext
        out = (f'<path d="{d}" fill="{self.shadow}" opacity=".32" transform="translate(6 11)" filter="url(#{u}s)"/>'
               f'<path d="{d}" fill="{ext}" transform="translate(2.5 4)"/><path d="{d}" fill="{fill}"/>')
        if light:
            out += f'<path d="{d}" fill="url(#{u}rl)"/>'
        return out + f'<path d="{d}" fill="#fff" filter="url(#{u}gr)"/>'

    def stroke(self, d, width, accent=True, cap="round"):
        """stroked part (tick, slash, bracket) with the same shadow and extrusion."""
        u = self.u
        st = f'fill="none" stroke-width="{width}" stroke-linecap="{cap}" stroke-linejoin="round"'
        ext = self.acc_ext if accent else self.ext
        return (f'<path d="{d}" {st} stroke="{self.shadow}" stroke-opacity=".3" transform="translate(4 8)" filter="url(#{u}s)"/>'
                f'<path d="{d}" {st} stroke="{ext}" transform="translate(1.5 3)"/>'
                f'<path d="{d}" {st} stroke="url(#{u}{"a" if accent else "m"})"/>')

    # ---------- flat-design version (no gradient, blur or grain) ----------
    def flat_solid(self, d, accent=False, split_x=100):
        """solid face plus a crisp far-side plane at about 22 % dark, split at x = split_x."""
        c = self.acc if accent else self.main
        cid = f"{self.u}fs{split_x}"
        return (f'<clipPath id="{cid}"><rect x="{split_x}" y="-50" width="300" height="300"/></clipPath>'
                f'<path d="{d}" fill="{c[1]}"/><path d="{d}" fill="{c[2]}" opacity=".22" clip-path="url(#{cid})"/>')

    def flat_stroke(self, d, width, accent=True, offset=4):
        """solid stroke plus a hard offset copy in the dark tone."""
        c = self.acc if accent else self.main
        st = f'fill="none" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"'
        return f'<path d="{d}" {st} stroke="{c[2]}" transform="translate({offset} 0)"/><path d="{d}" {st} stroke="{c[1]}"/>'


if __name__ == "__main__":
    shield = "M100 10 C122 22 148 28 174 28 L174 92 C174 140 146 172 100 192 C54 172 26 140 26 92 L26 28 C52 28 78 22 100 10 Z"
    tick = "M62 104 L90 132 L172 50"
    m = Mark("ex", main=("#5a6bff", "#2f43e6", "#1a27a3"), accent=("#ffd166", "#f5a30f", "#c47800"))
    page = (f"<body style='background:#eef0fb;display:flex;gap:40px;padding:40px'>"
            f"{m.svg(m.solid(shield) + m.stroke(tick, 24), 240)}{m.svg(m.flat_solid(shield) + m.flat_stroke(tick, 24), 240)}</body>")
    open("depth_mark_example.html", "w", encoding="utf-8").write(page)
    print("wrote depth_mark_example.html")
