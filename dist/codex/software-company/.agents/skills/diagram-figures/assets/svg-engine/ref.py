"""
ภาษาภาพของไดอะแกรม — สี ไอคอน โซน เส้นเชื่อม ป้าย
แก้ไฟล์นี้ที่เดียว เปลี่ยนทุกรูป · สีทั้งหมดมาจาก theme.py ไม่มีสีฝังในไฟล์นี้
"""
import os, re, json
import theme as T

W = 1400                      # ความกว้างมาตรฐาน
PAD = 56                      # ขอบกระดาษ
LOGO_DIR = os.path.join(os.path.dirname(__file__), "logos")

# ── สี: คำนวณเฉดอ่อน/เข้มจากสีหลัก ไม่ต้องกรอกเอง ───────────────────
def _hex2rgb(h): h=h.lstrip("#"); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def _rgb2hex(r): return "#%02X%02X%02X" % tuple(max(0,min(255,round(c))) for c in r)

def tint(hex_color, amount):
    """amount > 0 = อ่อนลง (ผสมขาว) · < 0 = เข้มขึ้น (ผสมดำ) · ช่วง -1..1"""
    r,g,b = _hex2rgb(hex_color)
    if amount >= 0:
        f = amount; return _rgb2hex((r+(255-r)*f, g+(255-g)*f, b+(255-b)*f))
    f = 1+amount; return _rgb2hex((r*f, g*f, b*f))

# ── เส้นเชื่อม: ตั้งฉาก มุมโค้ง ────────────────────────────────────
def _rounded_path(pts, r=14):
    if len(pts) < 3:
        return "M" + " L".join(f"{a},{b}" for a,b in pts)
    d = f"M{pts[0][0]},{pts[0][1]}"
    for i in range(1, len(pts)-1):
        px,py = pts[i-1]; cx,cy = pts[i]; nx,ny = pts[i+1]
        li = max(abs(cx-px), abs(cy-py)) or 1
        lo = max(abs(nx-cx), abs(ny-cy)) or 1
        ri = min(r, li/2, lo/2)
        ix = cx-(cx-px)/li*ri; iy = cy-(cy-py)/li*ri
        ox = cx+(nx-cx)/lo*ri; oy = cy+(ny-cy)/lo*ri
        d += f" L{ix:.1f},{iy:.1f} Q{cx},{cy} {ox:.1f},{oy:.1f}"
    return d + f" L{pts[-1][0]},{pts[-1][1]}"

def flow(pts, dashed=False, arrow=True, r=14):
    dash = ' stroke-dasharray="7 6"' if dashed else ""
    head = ' marker-end="url(#ah)"' if arrow else ""
    return (f'<path d="{_rounded_path(pts, r)}" fill="none" stroke="{T.LINE}" '
            f'stroke-width="1.6" stroke-linecap="round"{dash}{head}/>')

# ── ป้ายบนเส้น: สองบทบาทเท่านั้น ───────────────────────────────────
def pill(cx, cy, text, kind="flow"):
    hue = T.FLOW_HUE if kind == "flow" else T.EXCEPT_HUE
    fill, stroke, ink = tint(hue,.92), tint(hue,.68), tint(hue,-.35)
    w = _text_w(text, 10.5) + 22; h = 21
    return (f'<g><rect x="{cx-w/2:.1f}" y="{cy-h/2}" width="{w:.1f}" height="{h}" rx="{h/2}" '
            f'fill="{fill}" stroke="{stroke}"/>'
            f'<text x="{cx}" y="{cy+3.6}" font-size="10.5" fill="{ink}" text-anchor="middle">{esc(text)}</text></g>')

# ── โซน ───────────────────────────────────────────────────────────
def zone(x, y, w, h, label, key="outside"):
    hue, style = T.ZONES[key]
    dash = ' stroke-dasharray="6 5"' if style == "dash" else ""
    cap_w = _text_w(label, 11.5) + 42
    return (f'<g><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="{tint(hue,.965)}" '
            f'stroke="{tint(hue,.55)}" stroke-width="1.4"{dash}/>'
            f'<rect x="{x+22}" y="{y-11}" width="{cap_w:.1f}" height="22" rx="11" fill="{T.PAPER}" '
            f'stroke="{tint(hue,.55)}" stroke-width="1.2"/>'
            f'<circle cx="{x+36}" cy="{y}" r="3.4" fill="{hue}"/>'
            f'<text x="{x+46}" y="{y+4}" font-size="11.5" font-weight="600" fill="{tint(hue,-.3)}">{esc(label)}</text></g>')

# ── หน่วย: ไอคอนลอย ไม่มีกรอบ ชื่อและคำอธิบายอยู่ใต้ภาพ ──────────────
def unit(cx, cy, name, desc="", slug=None, size=46):
    g = [_logo(cx, cy, slug, size) if slug else _mark(cx, cy, size)]
    g.append(f'<text x="{cx}" y="{cy+size/2+20}" font-size="11.5" font-weight="700" '
             f'fill="{T.INK}" text-anchor="middle">{esc(name)}</text>')
    if desc:
        g.append(f'<text x="{cx}" y="{cy+size/2+35}" font-size="10" fill="{T.MUTED}" '
                 f'text-anchor="middle">{esc(desc)}</text>')
    return "<g>" + "".join(g) + "</g>"

def _logo(cx, cy, slug, size):
    path = os.path.join(LOGO_DIR, slug + ".svg")
    if not os.path.exists(path):
        return _mark(cx, cy, size)
    svg = open(path, encoding="utf-8").read()
    d = re.search(r'\sd="([^"]+)"', svg)
    if not d: return _mark(cx, cy, size)
    colors = {}
    cj = os.path.join(LOGO_DIR, "colors.json")
    if os.path.exists(cj): colors = json.load(open(cj, encoding="utf-8"))
    col = (colors.get(slug) or {}).get("hex", T.BODY)
    s = size/24.0
    return (f'<g transform="translate({cx-size/2},{cy-size/2}) scale({s:.4f})">'
            f'<path d="{d.group(1)}" fill="{col}"/></g>')

def _mark(cx, cy, size):
    """สัญลักษณ์เส้นกลาง ใช้เมื่อไม่มีไฟล์โลโก้ — ต้องระบุไว้ในหมายเหตุท้ายรูป"""
    s = size/24.0
    return (f'<g transform="translate({cx-size/2},{cy-size/2}) scale({s:.4f})" '
            f'fill="none" stroke="{T.BODY}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
            f'<rect x="3" y="4" width="18" height="6" rx="1.8"/><rect x="3" y="14" width="18" height="6" rx="1.8"/>'
            f'<path d="M7 7h.01M7 17h.01"/></g>')

# ── หัวเรื่อง · แถบสัญลักษณ์ · หมายเหตุ ─────────────────────────────
def header(title, sub, left1="", left2="", right=""):
    o = [f'<text x="{W/2}" y="34" font-size="22" font-weight="700" fill="{tint(T.ACCENT,-.25)}" text-anchor="middle">{esc(title)}</text>',
         f'<text x="{W/2}" y="54" font-size="12.5" fill="{T.MUTED}" text-anchor="middle">{esc(sub)}</text>']
    if left1: o.append(f'<text x="{PAD}" y="26" font-size="11" fill="{T.MUTED}">{esc(left1)}</text>')
    if left2: o.append(f'<text x="{PAD}" y="42" font-size="10" fill="{T.FAINT}">{esc(left2)}</text>')
    if right: o.append(f'<text x="{W-PAD}" y="26" font-size="11" fill="{T.MUTED}" text-anchor="end">{esc(right)}</text>')
    return "<g>" + "".join(o) + "</g>"

def legend(y, items, notes=()):
    """items = [(ชนิด, ข้อความ)] ชนิด: zone key ใด ๆ · 'flow' · 'except'"""
    o = [f'<line x1="{PAD}" y1="{y-18}" x2="{W-PAD}" y2="{y-18}" stroke="{T.LINE}"/>']
    x = PAD
    for kind, text in items:
        if kind in T.ZONES:
            hue, style = T.ZONES[kind]
            dash = ' stroke-dasharray="5 4"' if style == "dash" else ""
            o.append(f'<rect x="{x}" y="{y-9}" width="34" height="18" rx="6" fill="{tint(hue,.965)}" '
                     f'stroke="{tint(hue,.55)}" stroke-width="1.3"{dash}/>')
        else:
            hue = T.FLOW_HUE if kind == "flow" else T.EXCEPT_HUE
            o.append(f'<rect x="{x}" y="{y-9}" width="34" height="18" rx="9" fill="{tint(hue,.92)}" '
                     f'stroke="{tint(hue,.68)}"/>')
        o.append(f'<text x="{x+42}" y="{y+4}" font-size="11" fill="{T.MUTED}">{esc(text)}</text>')
        x += 42 + _text_w(text, 11) + 34
    for i, n in enumerate(notes):
        o.append(f'<text x="{PAD}" y="{y+34+i*17}" font-size="10" fill="{T.FAINT}">{esc(n)}</text>')
    return "<g>" + "".join(o) + "</g>"

# ── ตัวช่วย ───────────────────────────────────────────────────────
def esc(s):
    return (str(s).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;"))

def _text_w(s, size):
    """ประมาณความกว้างข้อความ — ไทย ~0.52 เท่าของขนาด · ละติน ~0.5"""
    thai = sum(1 for c in str(s) if "฀" <= c <= "๿")
    return (thai*0.52 + (len(str(s))-thai)*0.50) * size

def svg(height, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{height}" '
            f'viewBox="0 0 {W} {height}" font-family="{T.FONT}">'
            f'<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
            f'orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="{T.LINE}"/></marker></defs>'
            f'<rect width="{W}" height="{height}" fill="{T.PAPER}"/>{body}</svg>')
