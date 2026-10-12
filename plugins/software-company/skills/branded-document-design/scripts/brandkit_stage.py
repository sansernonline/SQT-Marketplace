"""
brandkit_stage.py — เด็ค "Stage" (ต้นแบบ: X Fitness Chatbot Summary v1.2)
16:9 · สีพื้นและสีหลักมาจากดีไซน์ของโปรเจกต์ · หัวเรื่อง Chakra Petch · เนื้อความ IBM Plex Sans Thai
Stage คือโครงหน้าและตัวอักษร ไม่ใช่สีพื้น — พื้นเข้มหรือสว่างตามที่โปรเจกต์ออกแบบไว้

    pip install python-pptx

    from brandkit_stage import StageDeck

    d = StageDeck(accent="E10613", bg="09090A", project="X Fitness Chatbot")
    #             ^สีหลักของโปรเจกต์  ^สีพื้นของโปรเจกต์ (สว่างหรือเข้มก็ได้)
    d.cover("X Fitness Chatbot", ["สรุปการทำงานของแชตบอท", "ตอบจากข้อมูลจริง และไม่ถูกหลอก"],
            meta="ทีมพัฒนา · ตุลาคม 2569", logo="logo.png", mark="mark.png")
    d.figure("องค์ประกอบของระบบ", "แอปเดียวรับทุกช่องทาง ความฉลาดเรียกจาก Typhoon",
             "fig-flow.png", caption="หน้าเว็บ + LINE OA → FastAPI → LightRAG + Typhoon")
    d.compare("องค์ประกอบของระบบ", "เลือกเทคโนโลยีจากข้อจำกัดจริง", ["ส่วน", "เลือก", "เพราะ"],
              [["ค้นความรู้", "LightRAG", "RAM ~250 MB · ค้นถูก 12/12"]])
    d.save("deck.pptx")

สีทั้งเด็คคำนวณจาก 2 ค่าของโปรเจกต์ คือ bg (สีพื้น) และ accent (สีหลัก):
    เทาทุกระดับ  = ผสม bg กับขาว (พื้นเข้ม) หรือกับดำ (พื้นสว่าง) ตามสัดส่วนคงที่ จึงอมโทนเดียวกับพื้น
    accent     = สีหลักตามที่ให้มา  → เส้นใต้ชื่อปก · สี่เหลี่ยมหน้าป้ายหมวด · ขีดหน้าบูลเล็ต
    accent_hi  = accent ที่ปรับความสว่างจนอ่านออกบนพื้นนั้น (contrast ≥ 4.5:1)
                 → ตัวเลขใหญ่ · เลขลำดับ · คำเน้น · บรรทัดที่ 2 ของปก
สีหลักใช้กับสิ่งที่ต้องการให้มองเท่านั้น ที่เหลือเป็นเทา
"""

from __future__ import annotations

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Cm, Emu, Pt

W, H = Cm(33.867), Cm(19.05)            # 16:9 = 13.333 × 7.5 นิ้ว
M = Cm(1.70)                            # ขอบซ้าย-ขวา
CW = W - 2 * M                          # ความกว้างเนื้อหา

HEAD_FONT = "Chakra Petch"              # หัวเรื่อง ตัวเลข ป้าย — มีไทย+อังกฤษในตระกูลเดียว
BODY_FONT = "IBM Plex Sans Thai"        # เนื้อความ — ทั้งสองตัวเป็น Google Fonts (OFL) ต้องติดตั้งในเครื่องที่เปิด

# ระดับเทา = สัดส่วนที่ผสมสีพื้นเข้าหาขาว (พื้นเข้ม) หรือดำ (พื้นสว่าง)
# ค่าพื้นเข้มเทียบจากต้นแบบ 09090A แล้วได้ 141417 · 26262B · 34343C · F5F5F4 · D4D4D8 · A3A3A8 · 6B6B72
SHADES_DARK = {"card": .045, "line": .12, "line_2": .18, "text": .96, "body": .82,
               "muted": .63, "faint": .40}
SHADES_LIGHT = {"card": -.6, "line": .11, "line_2": .17, "text": .86, "body": .76,
                "muted": .58, "faint": .44}       # card ติดลบ = ขาวกว่าพื้น (การ์ดลอยบนพื้นสีครีม/เทา)


# ---------------------------------------------------------------------------
# สี
# ---------------------------------------------------------------------------

def _rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _hex(c):
    return "".join(f"{max(0, min(255, round(v))):02X}" for v in c)


def _lum(h):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= .03928 else ((v + .055) / 1.055) ** 2.4
    r, g, b = (ch(v) for v in _rgb(h))
    return .2126 * r + .7152 * g + .0722 * b


def contrast(a, b):
    la, lb = sorted((_lum(a), _lum(b)), reverse=True)
    return (la + .05) / (lb + .05)


def mix(a, b, t):
    """t = สัดส่วนของ b (0..1)"""
    ca, cb = _rgb(a), _rgb(b)
    return _hex(tuple(x + (y - x) * t for x, y in zip(ca, cb)))


def is_dark(bg):
    return _lum(bg) < .18


def fit(color, bg, target=4.5):
    """ปรับความสว่าง (HSL) โดยคงความสด จน contrast กับพื้น ≥ target
    พื้นเข้ม → ยกให้สว่างขึ้น · พื้นสว่าง → กดให้เข้มลง
    (ผสมขาว/ดำตรง ๆ จะได้สีซีดหรือขุ่น เช่น แดงกลายเป็นชมพู)"""
    import colorsys
    r, g, b = (v / 255 for v in _rgb(color))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    step = .02 if is_dark(bg) else -.02
    out = color
    while contrast(out, bg) < target and .05 < l < .95:
        l = min(.95, max(.05, l + step))
        out = _hex(tuple(v * 255 for v in colorsys.hls_to_rgb(h, l, s)))
    return out


def make_theme(accent, bg="09090A", **override):
    """ชุดสีทั้งเด็คจากสีพื้นกับสีหลักของโปรเจกต์
    override = ค่าที่โปรเจกต์กำหนดไว้แล้ว เช่น text="1B2430" ใช้แทนค่าที่คำนวณ"""
    accent, bg = accent.lstrip("#").upper(), bg.lstrip("#").upper()
    dark = is_dark(bg)
    t = {"bg": bg, "dark": dark}
    for k, v in (SHADES_DARK if dark else SHADES_LIGHT).items():
        if dark:
            t[k] = mix(bg, "FFFFFF", v)
        else:
            t[k] = mix(bg, "FFFFFF", -v) if v < 0 else mix(bg, "0E1116", v)
    # กันพื้นสีจัด: ตัวหนังสือรองต้องยังอ่านออก
    t["muted"] = fit(t["muted"], bg, 4.5)
    t["faint"] = fit(t["faint"], bg, 3.0)
    t["accent"] = accent
    t["accent_hi"] = fit(accent, bg, 5.0 if dark else 4.5)
    t["accent_card"] = mix(t["card"], accent, .16)        # พื้นการ์ดที่ต้องเน้น
    t["accent_line"] = mix(t["card"], accent, .55)
    t["on_accent"] = "FFFFFF" if contrast("FFFFFF", accent) >= 3 else "111111"
    t.update({k: v.lstrip("#").upper() for k, v in override.items()})
    return t


# ---------------------------------------------------------------------------
# ตัวช่วยระดับ shape
# ---------------------------------------------------------------------------

def _set_fonts(run, face):
    """ตั้งฟอนต์ให้ครบ latin · ea · cs — ภาษาไทยใน PowerPoint อ่านจาก cs (complex script)
    ถ้าตั้งแค่ latin สระไทยจะไปใช้ฟอนต์อื่นแบบเงียบ ๆ"""
    rpr = run._r.get_or_add_rPr()
    for tag in ("a:latin", "a:ea", "a:cs"):
        el = rpr.find(qn(tag))
        if el is None:
            el = rpr.makeelement(qn(tag), {})
            rpr.append(el)
        el.set("typeface", face)


class StageDeck:
    def __init__(self, accent="2A78D6", bg="09090A", project="", template=None,
                 head_font=HEAD_FONT, body_font=BODY_FONT, **colors):
        """accent / bg = สีหลักกับสีพื้นจากดีไซน์ของโปรเจกต์ · head_font / body_font ใช้ของโปรเจกต์ได้
        colors = สีที่โปรเจกต์กำหนดไว้แล้ว เช่น text="1B2430" ทับค่าที่คำนวณ"""
        self.t = make_theme(accent, bg, **colors)
        self.project = project
        self.head_font, self.body_font = head_font, body_font
        self.prs = Presentation(template) if template else Presentation()
        self.prs.slide_width, self.prs.slide_height = W, H
        self.blank = self.prs.slide_layouts[6]

    # -- พื้นฐาน ------------------------------------------------------------
    def _c(self, key):
        return RGBColor.from_string(self.t.get(key, key))

    def _slide(self):
        s = self.prs.slides.add_slide(self.blank)
        s.background.fill.solid()
        s.background.fill.fore_color.rgb = self._c("bg")
        return s

    def _rect(self, s, x, y, w, h, fill=None, line=None, round_=False):
        shp = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,
                                 x, y, w, h)
        if round_:
            shp.adjustments[0] = 0.08
        if fill:
            shp.fill.solid()
            shp.fill.fore_color.rgb = self._c(fill)
        else:
            shp.fill.background()
        if line:
            shp.line.color.rgb = self._c(line)
            shp.line.width = Pt(0.75)
        else:
            shp.line.fill.background()
        shp.shadow.inherit = False
        return shp

    def _line(self, s, x1, y1, x2, y2, color="line", width=0.75):
        ln = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, x1, y1, x2, y2)
        ln.line.color.rgb = self._c(color)
        ln.line.width = Pt(width)
        return ln

    def _text(self, s, x, y, w, h, parts, size=18, color="body", bold=False, head=False,
              align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, spacing=1.25, space_after=0):
        """parts = ข้อความธรรมดา · หรือ list ของย่อหน้า ซึ่งแต่ละย่อหน้าเป็น str
        หรือ list ของ (ข้อความ, {"color","bold","size","head"})"""
        box = s.shapes.add_textbox(x, y, w, h)
        tf = box.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = anchor
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        paras = parts if isinstance(parts, list) else str(parts).split("\n")
        for i, para in enumerate(paras):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.alignment = align
            p.line_spacing = spacing
            p.space_after = Pt(space_after)
            runs = para if isinstance(para, list) else [(para, {})]
            for txt, o in runs:
                r = p.add_run()
                r.text = txt
                f = r.font
                f.size = Pt(o.get("size", size))
                f.bold = o.get("bold", bold)
                f.color.rgb = self._c(o.get("color", color))
                _set_fonts(r, self.head_font if o.get("head", head) else self.body_font)
        return box

    def _picture(self, s, path, x, y, max_w, max_h, center=True):
        pic = s.shapes.add_picture(path, x, y)
        k = min(max_w / pic.width, max_h / pic.height)
        pic.width, pic.height = int(pic.width * k), int(pic.height * k)
        if center:
            pic.left = int(x + (max_w - pic.width) / 2)
        return pic

    # -- ส่วนที่ทุกแผ่นมี -----------------------------------------------------
    def _frame(self, kicker, title, subtitle=None):
        """ป้ายหมวด (สี่เหลี่ยมสีหลัก + ชื่อหมวด) · หัวสไลด์ · ท้ายกระดาษ · เลขหน้า"""
        s = self._slide()
        self._rect(s, M, Cm(1.57), Cm(0.30), Cm(0.30), fill="accent")
        self._text(s, M + Cm(0.61), Cm(1.32), Cm(20), Cm(0.76), kicker, 12, "muted",
                   bold=True, head=True)
        self._text(s, M, Cm(2.34), CW, Cm(2.29), title, 28, "text", bold=True, head=True,
                   spacing=1.15)
        top = Cm(5.2)
        if subtitle:
            self._text(s, M, Cm(3.85), CW, Cm(1.0), subtitle, 14, "muted")
            top = Cm(5.6)
        self._line(s, M, Cm(17.48), W - M, Cm(17.48))
        n = len(self.prs.slides._sldIdLst)
        foot = f"{self.project.upper()}   ·   {kicker}" if self.project else kicker
        self._text(s, M, Cm(17.78), Cm(20), Cm(0.76), foot, 11, "faint", head=True)
        self._text(s, W - M - Cm(2.54), Cm(17.78), Cm(2.54), Cm(0.76), f"{n:02d}", 11, "muted",
                   head=True, align=PP_ALIGN.RIGHT)
        return s, top

    # -- ประเภทสไลด์ ----------------------------------------------------------
    def cover(self, title, lines=(), meta=None, logo=None, mark=None):
        """ปก — lines[0] สีขาว · lines[1] สีหลัก (ประโยคที่อยากให้จำ)
        logo = โลโก้แนวนอนมุมซ้ายบน · mark = สัญลักษณ์แบรนด์ ใหญ่ จางทางขวา
        ไม่มี mark → วงแหวนเรขาคณิตจาง ๆ แทน"""
        s = self._slide()
        if mark:
            pic = self._picture(s, mark, Cm(18.8), Cm(1.4), Cm(16.3), Cm(16.3), center=False)
            pic.left = W - pic.width + Cm(1.2)
        else:
            ring = s.shapes.add_shape(MSO_SHAPE.DONUT, W - Cm(14.5), Cm(2.2), Cm(17), Cm(17))
            ring.adjustments[0] = 0.14
            ring.fill.solid()
            ring.fill.fore_color.rgb = self._c(mix(self.t["bg"], self.t["accent"], .07 if self.t["dark"] else .06))
            ring.line.fill.background()
            ring.shadow.inherit = False
        if logo:
            self._picture(s, logo, M, Cm(1.9), Cm(6.7), Cm(1.4), center=False)
        self._text(s, M, Cm(5.97), Cm(25.4), Cm(3.05), title, 60, "text", bold=True,
                   head=True, anchor=MSO_ANCHOR.BOTTOM, spacing=1.0)
        self._line(s, M, Cm(9.02), M + Cm(3.05), Cm(9.02), color="accent", width=2.5)
        paras = [[(ln, {"color": "accent_hi" if i == 1 else "text"})] for i, ln in enumerate(lines)]
        if paras:
            self._text(s, M, Cm(9.65), Cm(22.9), Cm(3.05), paras, 26, bold=True, head=True,
                       spacing=1.2)
        if meta:
            self._text(s, M, Cm(14.86), Cm(25.4), Cm(2.03), meta, 14, "muted", spacing=1.5)
        return s

    def section(self, number, title, note=None):
        """คั่นบท — เลขใหญ่สีหลัก + ชื่อบท"""
        s = self._slide()
        self._text(s, M, Cm(5.2), Cm(8), Cm(3.4), f"{number:02d}" if isinstance(number, int)
                   else number, 72, "accent_hi", bold=True, head=True, spacing=1.0)
        self._line(s, M, Cm(9.1), M + Cm(3.05), Cm(9.1), color="accent", width=2.5)
        self._text(s, M, Cm(9.7), Cm(26), Cm(2.4), title, 36, "text", bold=True, head=True,
                   spacing=1.15)
        if note:
            self._text(s, M, Cm(12.4), Cm(24), Cm(1.2), note, 16, "muted")
        return s

    def figure(self, kicker, title, image, caption=None, subtitle=None):
        """รูปเต็มแผ่น — รูปจาก diagram-figures ที่เรนเดอร์ด้วยสีพื้นเดียวกับเด็ค (#accent=..&bg=..)"""
        s, top = self._frame(kicker, title, subtitle)
        bottom = Cm(16.0) if caption else Cm(17.0)
        y0 = top - Cm(0.4)
        self._picture(s, image, M, y0, CW, bottom - y0)
        if caption:
            self._text(s, M, Cm(16.21), CW, Cm(1.0), caption, 14, "muted", align=PP_ALIGN.CENTER)
        return s

    def compare(self, kicker, title, headers, rows, widths=(1, 1.85, 1.95), subtitle=None):
        """ตารางเปรียบเทียบแบบเส้นคั่นแถว — คอลัมน์ 1 เทา · 2 หนาขาว · 3 เนื้อความ
        ไม่เกิน 5 แถว 3–4 คอลัมน์"""
        s, top = self._frame(kicker, title, subtitle)
        unit = CW / sum(widths)
        xs, x = [], M
        for w in widths:
            xs.append((x, int(w * unit) - Cm(0.5)))
            x += int(w * unit)
        for (cx, cw), h in zip(xs, headers):
            self._text(s, cx, top, cw, Cm(0.76), h, 12, "faint", bold=True, head=True)
        y = top + Cm(1.06)
        self._line(s, M, y, W - M, y)
        rh = min(Cm(2.16), int((Cm(16.6) - y) / max(1, len(rows))))
        styles = [(20, "muted", False, False), (20, "text", True, True), (18, "body", False, False)]
        for row in rows:
            for i, ((cx, cw), val) in enumerate(zip(xs, row)):
                size, col, b, hd = styles[min(i, 2)]
                self._text(s, cx, y + Cm(0.25), cw, rh - Cm(0.3), str(val), size, col, bold=b,
                           head=hd, anchor=MSO_ANCHOR.MIDDLE)
            y += rh
            self._line(s, M, y, W - M, y)
        return s

    def stats(self, kicker, title, items, subtitle=None):
        """ตัวเลข 2–4 ช่อง คั่นด้วยเส้นตั้ง
        items = [{"value":"10/10","label":"คำถามทดสอบ","sub":"2.7 วินาที",
                  "example":"ตัวอย่าง Q10","qa":[("ถาม","..."),("ตอบ","...")],"note":"อ้างอิง KB-03"}]"""
        s, top = self._frame(kicker, title, subtitle)
        top = max(top, Cm(6.1))
        self._line(s, M, top, W - M, top)
        n = len(items)
        cw = int(CW / n)
        for i, it in enumerate(items):
            x = M + i * cw + Cm(0.76)
            w = cw - Cm(1.3)
            if i:
                self._line(s, M + i * cw, top + Cm(0.25), M + i * cw, Cm(16.9), color="line_2")
            self._text(s, x, top + Cm(0.25), w, Cm(2.54), it["value"], 60, "accent_hi",
                       bold=True, head=True, spacing=1.0)
            self._text(s, x, top + Cm(2.8), w, Cm(1.0), it.get("label", ""), 20, "text",
                       bold=True, head=True)
            if it.get("sub"):
                self._text(s, x, top + Cm(3.8), w, Cm(0.9), it["sub"], 16, "muted")
            paras = []
            if it.get("example"):
                paras.append([(it["example"], {"size": 11, "color": "muted", "bold": True})])
            for tag, txt in it.get("qa", []):
                paras.append([(tag + "  ", {"size": 12, "color": "accent_hi", "bold": True, "head": True}),
                              (txt, {"size": 12, "color": "body"})])
            if it.get("note"):
                paras.append([(it["note"], {"size": 10.5, "color": "faint"})])
            if paras:
                self._text(s, x, top + Cm(5.2), w - Cm(0.2), Cm(5.7), paras, 12, spacing=1.3,
                           space_after=4)
        return s

    def steps(self, kicker, title, rows, example_head=None, note=None, subtitle=None):
        """ขั้นตอนแบบมีเลขลำดับ — rows = [(ชื่อขั้น, ทำอะไร, ตัวอย่างหรือ None)] ไม่เกิน 6 ขั้น"""
        s, top = self._frame(kicker, title, subtitle)
        has_ex = any(len(r) > 2 and r[2] for r in rows)
        xn, xname, xdesc, xex = M, M + Cm(1.5), M + Cm(10.6), M + Cm(22.9)
        wdesc = (xex if has_ex else W - M) - xdesc - Cm(0.6)
        y = top + Cm(0.3)
        if example_head and has_ex:
            self._text(s, xex, y - Cm(0.2), W - M - xex, Cm(0.7), example_head, 12, "accent_hi",
                       bold=True, head=True)
            y += Cm(0.6)
        rh = min(Cm(2.16), int((Cm(15.7 if note else 16.6) - y) / max(1, len(rows))))
        for i, r in enumerate(rows, 1):
            self._text(s, xn, y, Cm(1.2), rh, str(i), 20, "accent_hi", bold=True, head=True,
                       anchor=MSO_ANCHOR.MIDDLE)
            self._text(s, xname, y, Cm(8.8), rh, r[0], 20, "text", bold=True, head=True,
                       anchor=MSO_ANCHOR.MIDDLE)
            self._text(s, xdesc, y, wdesc, rh, r[1], 14, "body", anchor=MSO_ANCHOR.MIDDLE)
            if has_ex and len(r) > 2 and r[2]:
                self._text(s, xex, y, W - M - xex, rh,
                           [[("ตัวอย่าง  ", {"size": 11, "color": "muted", "bold": True}),
                             (r[2], {"size": 13, "color": "body"})]], anchor=MSO_ANCHOR.MIDDLE)
            y += rh
            self._line(s, xname, y, W - M, y)
        if note:
            self._text(s, M, y + Cm(0.4), CW, Cm(0.9), note, 14, "muted")
        return s

    def points(self, kicker, title, points, image=None, caption=None, side=None, side_caption=None,
               subtitle=None):
        """ภาพซ้าย + ใจความ 3–5 ข้อ (ขีดสีหลักนำหน้า) · side = ภาพเล็กขวา เช่น QR
        points = [("ใจความหนา", "คำขยาย"), ...]"""
        s, top = self._frame(kicker, title, subtitle)
        x = M
        if image:
            pic = self._picture(s, image, M, top - Cm(0.8), Cm(9.2), Cm(16.9) - top + Cm(0.8),
                                center=False)
            x = M + pic.width + Cm(1.8)
        right = W - M - (Cm(4.2) if side else 0)
        paras = [[("—  ", {"color": "accent_hi", "bold": True, "head": True}),
                  (b, {"color": "text", "bold": True, "head": True}),
                  ("   " + rest if rest else "", {"color": "muted", "size": 18})]
                 for b, rest in points]
        self._text(s, x, top + Cm(0.6), right - x - Cm(0.6), Cm(8.5), paras, 20, spacing=1.35,
                   space_after=14)
        if caption:
            self._text(s, x, Cm(15.3), right - x, Cm(0.8), caption, 13, "faint")
        if side:
            self._picture(s, side, W - M - Cm(3.4), top + Cm(0.6), Cm(3.4), Cm(3.4), center=False)
            if side_caption:
                self._text(s, W - M - Cm(3.8), top + Cm(4.2), Cm(4.2), Cm(0.8), side_caption, 12,
                           "faint", align=PP_ALIGN.CENTER)
        return s

    def statement(self, kicker, text, sub=None):
        """ข้อความเดียวกลางแผ่น — สิ่งที่ขอ · ข้อสรุป · คำพูดลูกค้า"""
        s, _ = self._frame(kicker, "")
        self._text(s, M + Cm(2), Cm(6.0), CW - Cm(4), Cm(4.5), text, 36, "text", bold=True,
                   head=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=1.2)
        if sub:
            self._text(s, M + Cm(2), Cm(10.9), CW - Cm(4), Cm(1.2), sub, 18, "accent_hi",
                       align=PP_ALIGN.CENTER)
        return s

    def save(self, path):
        self.prs.save(path)
        return path
