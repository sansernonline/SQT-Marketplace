"""
brandkit.py — ตัวช่วยสร้างเอกสาร Word (.docx) ที่มีหน้าตาเป็นระบบเดียวกัน
สไตล์อ้างอิงจาก Apps Track SRS (ฟอนต์ Tahoma · accent น้ำเงิน-ม่วง · ตารางหัวฟ้าอ่อน)

ใช้กับ python-docx >= 1.1
    pip install python-docx

ตัวอย่างสั้นที่สุด
------------------
    from brandkit import BrandDoc, TOKENS

    doc = BrandDoc()                       # A4 · Tahoma · โทน Apps Track
    doc.cover("เอกสารข้อกำหนดซอฟต์แวร์ (Software Specification)",
              subtitle="ระบบ Apps Track — Project Control & Monitor",
              meta="เวอร์ชันเอกสาร 3.5  •  ปรับปรุง 19 กรกฎาคม 2026",
              logo="asset/AppsTrack_Logo_Badge.png")
    doc.h1("1. ภาพรวมระบบ")
    doc.para("eitprojects เป็นระบบบริหารและติดตามโครงการ ...")
    doc.table(["หัวข้อ", "รายละเอียด"],
              [["URL ระบบ", "https://project.eitaccount.cloud"],
               ["ประเภทระบบ", "Web Application (SPA) + PWA"]],
              widths=[2600, 7038])
    doc.callout("tip", "ข้อแนะนำ", "เขียน callout สั้น ๆ 1–3 บรรทัดเท่านั้น")
    doc.save("out.docx")

ทุกเมธอดคืนค่าอ็อบเจกต์ที่สร้าง จึงต่อยอด/ปรับแต่งเพิ่มเองได้เสมอ
"""

from __future__ import annotations

import copy
from dataclasses import dataclass, field

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from docx.shared import Cm, Pt, RGBColor

# ---------------------------------------------------------------------------
# 1 · Design tokens — แก้ที่เดียว เปลี่ยนทั้งเอกสาร
# ---------------------------------------------------------------------------

TOKENS = {
    # แบรนด์
    "brand": "2A78D6",        # น้ำเงินหลัก — หัวข้อ H1, ตัวเลข KPI, ลิงก์
    "brand_2": "6A5CD6",      # ม่วง — accent รอง, แถบ callout
    "brand_deep": "2A4C86",   # น้ำเงินเข้ม — H2, หัวตาราง
    "brand_tint": "EDF1FB",   # ฟ้าอ่อนมาก — พื้นหัวตาราง, พื้น KPI
    "brand_tint_2": "F6F8FD", # ฟ้าอ่อนกว่า — แถวสลับในตารางยาว
    # ตัวอักษร
    "text": "333B4A",         # หัวข้อย่อย/ข้อความเน้น
    "text_body": "414957",    # เนื้อความ
    "text_muted": "7D8492",   # คำบรรยายรูป, meta, footer
    "text_faint": "A9AEB9",
    # เส้น
    "line": "E4E7EE",
    # สถานะ (ใช้กับ pill / callout / ตารางสรุป)
    "green": "17794A", "green_bg": "E9F7EF",
    "blue": "2160AB",  "blue_bg": "EAF2FD",
    "amber": "96660D", "amber_bg": "FDF5E4",
    "red": "A63A34",   "red_bg": "FDEDEC",
    "violet": "52439F", "violet_bg": "F1EEFC",
    "grey": "626A7A",  "grey_bg": "F2F4F8",
}

# ฟอนต์: Tahoma ปลอดภัยที่สุดสำหรับเอกสารไทย+อังกฤษบน Windows/Word
# (มีทุกเครื่อง · วรรณยุกต์ไม่ลอย · น้ำหนัก bold อ่านง่าย)
FONT = "Tahoma"
# ฟอนต์ช่องละติน (ascii/hAnsi) แยกจากช่องไทย (cs/eastAsia) — ค่าเริ่มต้นเป็นตัวเดียวกัน
# ถ้าใช้คู่ฟอนต์ เช่น Noto Sans + Noto Sans Thai ให้ตั้ง 2 ค่านี้ แล้วเรียก thai_runs() ก่อน save (ข้อ 2 ของ SKILL.md)
LATIN_FONT = FONT
MONO = "Consolas"   # ห้ามใช้ฟอนต์ variable เช่น Cascadia Mono — Word export PDF แล้วตกเป็น Calibri

# ความกว้างเนื้อหา A4 ขอบซ้าย/ขวา 2 ซม. = 17 ซม. = 9638 twips (แนวนอน 25.7 ซม. = 14570)
BODY_TWIPS = 9638

# ขนาด (pt)
SIZE = {
    "cover_title": 20, "cover_subtitle": 14.5, "cover_meta": 9, "cover_note": 8,
    "h1": 16, "h2": 12.5, "h3": 11.5,
    "body": 11, "table": 11, "small": 9, "caption": 8.5, "footer": 9,
}

# ปกเข้ม (style="night")
NIGHT_BASE, NIGHT_RULE = "1C1C22", "3A3A48"
NIGHT_LABEL, NIGHT_VALUE = "CFCCDE", "F4F3F8"   # ตัวเล็กบนพื้นเข้ม: ≥ 8.5pt และสีนี้ขึ้นไป
NIGHT_TITLE_PT, NIGHT_SMALL_PT = 32, 8.5

CALLOUT_KINDS = {
    #  key   : (สี bg, สีขอบซ้าย, สีตัวอักษรหัวข้อ, สัญลักษณ์)
    "tip":     ("blue_bg",   "brand",    "blue",   "💡"),
    "note":    ("grey_bg",   "text_muted", "grey", "ℹ️"),
    "warning": ("amber_bg",  "amber",    "amber",  "⚠️"),
    "critical":("red_bg",    "red",      "red",    "🚨"),
    "success": ("green_bg",  "green",    "green",  "✅"),
    "question":("violet_bg", "brand_2",  "violet", "❓"),
}


# ---------------------------------------------------------------------------
# 2 · ตัวช่วยระดับ XML
# ---------------------------------------------------------------------------

def _el(tag, **attrs):
    e = OxmlElement(tag)
    for k, v in attrs.items():
        e.set(qn("w:" + k), str(v))
    return e


def style_run(run, *, size=None, color=None, bold=False, italic=False,
              font=None, mono=False):
    """ตั้งฟอนต์ให้ครบทั้ง latin / complex-script — จำเป็นสำหรับภาษาไทย
    ถ้าตั้งแต่ run.font.size อย่างเดียว ตัวอักษรไทยจะไม่เปลี่ยนขนาดตาม
    เพราะ Word ถือว่าไทยเป็น complex script (ต้องตั้ง szCs / bCs / iCs ด้วย)"""
    thai = font or FONT
    latin = MONO if mono else (font or LATIN_FONT)
    run.font.name = latin
    rpr = run._r.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = _el("w:rFonts")
        rpr.insert(0, rfonts)
    for a, name in (("ascii", latin), ("hAnsi", latin), ("cs", thai), ("eastAsia", thai)):
        rfonts.set(qn("w:" + a), name)
    if size is not None:
        half = str(int(round(size * 2)))
        for tag in ("w:sz", "w:szCs"):
            rpr.append(_el(tag, val=half))
    if bold:
        rpr.append(_el("w:b"))
        rpr.append(_el("w:bCs"))
    if italic:
        rpr.append(_el("w:i"))
        rpr.append(_el("w:iCs"))
    if color:
        run.font.color.rgb = RGBColor.from_string(TOKENS.get(color, color))
    order_rpr(rpr)
    return run


# ลำดับ element ภายใน <w:rPr> ตามสเปก ECMA-376 — Word จะเมินค่าที่วางผิดลำดับ
_RPR_ORDER = ["rStyle", "rFonts", "b", "bCs", "i", "iCs", "caps", "smallCaps",
              "strike", "dstrike", "outline", "shadow", "emboss", "imprint",
              "noProof", "snapToGrid", "vanish", "webHidden", "color", "spacing",
              "w", "kern", "position", "sz", "szCs", "highlight", "u", "effect",
              "bdr", "shd", "fitText", "vertAlign", "rtl", "cs", "em", "lang",
              "eastAsianLayout", "specVanish", "oMath"]


def order_rpr(rpr):
    """เรียง child ของ rPr ใหม่ให้ถูกลำดับ — จำเป็นเมื่อเราแทรก element เอง"""
    idx = {qn("w:" + t): i for i, t in enumerate(_RPR_ORDER)}
    children = list(rpr)
    for c in children:
        rpr.remove(c)
    for c in sorted(children, key=lambda e: idx.get(e.tag, 999)):
        rpr.append(c)


def shade(cell, hex_or_token):
    """ระบายพื้นหลังเซลล์ตาราง"""
    fill = TOKENS.get(hex_or_token, hex_or_token)
    cell._tc.get_or_add_tcPr().append(_el("w:shd", val="clear", color="auto", fill=fill))


def cell_margins(table, top=50, left=90, bottom=50, right=90):
    """ระยะขอบในเซลล์ (หน่วย twips · 20 twips = 1pt) — ค่าเริ่มต้นของ Word แน่นเกินไป"""
    tblpr = table._tbl.tblPr
    mar = _el("w:tblCellMar")
    for tag, val in (("top", top), ("left", left), ("bottom", bottom), ("right", right)):
        mar.append(_el("w:" + tag, w=val, type="dxa"))
    tblpr.append(mar)



def vcenter(cell):
    """จัดข้อความให้อยู่กึ่งกลางแนวตั้งของช่องตาราง"""
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

def set_borders(table, color="line", size=4, inside=True):
    """เส้นตาราง: บาง สีเทาอ่อน — ไม่ใช่เส้นดำหนาแบบ default"""
    col = TOKENS.get(color, color)
    tblpr = table._tbl.tblPr
    borders = _el("w:tblBorders")
    edges = ["top", "left", "bottom", "right"] + (["insideH", "insideV"] if inside else [])
    for edge in edges:
        borders.append(_el("w:" + edge, val="single", sz=size, space=0, color=col))
    tblpr.append(borders)


def fixed_widths(table, widths):
    """บังคับความกว้างคอลัมน์ให้ตรงตามที่กำหนด (หน่วย twips)
    python-docx อย่างเดียวไม่พอ — Word จะคำนวณใหม่ถ้าไม่ปิด autofit + ไม่ตั้ง tblGrid"""
    tbl = table._tbl
    tblpr = tbl.tblPr
    tblpr.append(_el("w:tblLayout", type="fixed"))
    tblpr.append(_el("w:tblW", w=str(sum(widths)), type="dxa"))
    grid = tbl.find(qn("w:tblGrid"))
    if grid is not None:
        tbl.remove(grid)
    grid = _el("w:tblGrid")
    for w in widths:
        grid.append(_el("w:gridCol", w=str(w)))
    tbl.insert(list(tbl).index(tblpr) + 1, grid)
    table.autofit = False
    for row in table.rows:
        for ci, w in enumerate(widths):
            if ci < len(row.cells):
                row.cells[ci].width = Pt(w / 20)


def row_borders(table, color="line", size=4):
    """เส้นแนวนอนบางระหว่างแถว ไม่มีเส้นตั้งและไม่มีเส้นกรอบบน"""
    borders = _el("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        if edge in ("bottom", "insideH"):
            borders.append(_el("w:" + edge, val="single", sz=size, space=0, color=TOKENS.get(color, color)))
        else:
            borders.append(_el("w:" + edge, val="none", sz=0, space=0, color="auto"))
    table._tbl.tblPr.append(borders)


def no_borders(table):
    tblpr = table._tbl.tblPr
    borders = _el("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        borders.append(_el("w:" + edge, val="none", sz=0, space=0, color="auto"))
    tblpr.append(borders)


def left_accent(cell, color="brand", size=24):
    """แถบสีหนาด้านซ้ายของเซลล์ — ใช้ทำ callout"""
    tcpr = cell._tc.get_or_add_tcPr()
    borders = _el("w:tcBorders")
    borders.append(_el("w:left", val="single", sz=size, space=0,
                       color=TOKENS.get(color, color)))
    tcpr.append(borders)


def repeat_header(row):
    """ให้แถวหัวตารางซ้ำทุกหน้าเวลาตารางยาวข้ามหน้า"""
    trpr = row._tr.get_or_add_trPr()
    trpr.append(_el("w:tblHeader", val="true"))


def keep_with_next(paragraph):
    """กันหัวข้อค้างท้ายหน้าโดยที่เนื้อหาไปอยู่หน้าถัดไป"""
    paragraph.paragraph_format.keep_with_next = True


def cell_border(cell, edge, color=None, size=4):
    """เส้นขอบ 1 ด้านของเซลล์ (หน่วย 1/8 pt) · color=None = ไม่มีเส้นด้านนั้น"""
    tcpr = cell._tc.get_or_add_tcPr()
    borders = tcpr.find(qn("w:tcBorders"))
    if borders is None:
        borders = _el("w:tcBorders")
        tcpr.append(borders)
    if color is None:
        borders.append(_el("w:" + edge, val="nil"))
    else:
        borders.append(_el("w:" + edge, val="single", sz=size, space=0, color=TOKENS.get(color, color)))


def mix(color, other="FFFFFF", amount=0.5):
    """ผสมสี `color` เข้ากับ `other` (amount = สัดส่วนของ other) — ใช้ทำสีอ่อน/เข้มจาก palette"""
    a, b = TOKENS.get(color, color), TOKENS.get(other, other)
    return "".join("%02X" % round(int(a[i:i + 2], 16) * (1 - amount) + int(b[i:i + 2], 16) * amount)
                   for i in (0, 2, 4))


# ลำดับซ้อนภาพบนปกเข้ม — เลขแบบที่ Word ใช้ (Word จัดเลขน้อย ๆ ใหม่ตอนบันทึก)
Z_BG, Z_LINE, Z_LOGO = 251658240, 251659264, 251660288


def anchor_picture(paragraph, image, x_cm, y_cm, w_cm, h_cm, z, rel_v="page"):
    """ภาพลอยหลังข้อความ ยึดกับย่อหน้า (ไม่ใช่ header — Word แสดงภาพใน header จางลง)
    x อิงขอบหน้ากระดาษ · y อิงขอบหน้า (rel_v="page") หรือบนของย่อหน้า (rel_v="paragraph")"""
    run = paragraph.add_run()
    run.add_picture(image, width=Cm(w_cm), height=Cm(h_cm))
    drawing = run._r.find(qn("w:drawing"))
    inline = drawing.find(qn("wp:inline"))
    inline.find(qn("wp:docPr")).set("descr", "decor")
    anchor = parse_xml(
        f'<wp:anchor {nsdecls("wp")} distT="0" distB="0" distL="0" distR="0" simplePos="0" '
        f'relativeHeight="{z}" behindDoc="1" locked="1" layoutInCell="1" allowOverlap="1">'
        f'<wp:simplePos x="0" y="0"/>'
        f'<wp:positionH relativeFrom="page"><wp:posOffset>{int(x_cm * 360000)}</wp:posOffset></wp:positionH>'
        f'<wp:positionV relativeFrom="{rel_v}"><wp:posOffset>{int(y_cm * 360000)}</wp:posOffset></wp:positionV>'
        f'</wp:anchor>')
    anchor.append(inline.find(qn("wp:extent")))
    anchor.append(parse_xml(f'<wp:effectExtent {nsdecls("wp")} l="0" t="0" r="0" b="0"/>'))
    anchor.append(parse_xml(f'<wp:wrapNone {nsdecls("wp")}/>'))
    anchor.append(inline.find(qn("wp:docPr")))
    for child in list(inline):
        if child.tag in (qn("wp:cNvGraphicFramePr"), qn("a:graphic")):
            anchor.append(child)
    drawing.remove(inline)
    drawing.append(anchor)
    paragraph._p.remove(run._r)          # ต้องอยู่ต้นย่อหน้า เพื่อให้ภาพตกหน้าปก
    ppr = paragraph._p.find(qn("w:pPr"))
    paragraph._p.insert(1 if ppr is not None else 0, run._r)


def add_field(paragraph, instr, **run_kwargs):
    """แทรก field code ของ Word (PAGE, NUMPAGES, TOC ...)"""
    run = paragraph.add_run()
    style_run(run, **run_kwargs)
    r = run._r
    fld_begin = _el("w:fldChar", fldCharType="begin")
    instr_el = OxmlElement("w:instrText")
    instr_el.set(qn("xml:space"), "preserve")
    instr_el.text = instr
    fld_end = _el("w:fldChar", fldCharType="end")
    r.append(fld_begin)
    r.append(instr_el)
    r.append(fld_end)
    return run


# ---------------------------------------------------------------------------
# 3 · ตัวสร้างเอกสาร
# ---------------------------------------------------------------------------

@dataclass
class BrandDoc:
    """เอกสาร Word ที่ตั้งค่าสไตล์ให้เรียบร้อยแล้ว"""

    path_template: str | None = None
    page: str = "A4"                  # "A4" | "Letter"
    margins_cm: tuple = (2.2, 2.0, 2.2, 2.0)   # บน ขวา ล่าง ซ้าย
    footer_text: str = "หน้า"          # ข้อความนำหน้าเลขหน้า ("" = ไม่ใส่คำนำหน้า)
    doc: Document = field(init=False)

    def __post_init__(self):
        self.doc = Document(self.path_template) if self.path_template else Document()
        self._setup_page()
        self._setup_normal_style()
        self._setup_footer()

    # -- ตั้งค่าเริ่มต้น ---------------------------------------------------
    def _setup_page(self):
        s = self.doc.sections[0]
        if self.page == "A4":
            s.page_width, s.page_height = Cm(21.0), Cm(29.7)
        else:
            s.page_width, s.page_height = Cm(21.59), Cm(27.94)
        top, right, bottom, left = self.margins_cm
        s.top_margin, s.right_margin = Cm(top), Cm(right)
        s.bottom_margin, s.left_margin = Cm(bottom), Cm(left)

    def _setup_normal_style(self):
        st = self.doc.styles["Normal"]
        st.font.name = LATIN_FONT
        st.font.size = Pt(SIZE["body"])
        st.font.color.rgb = RGBColor.from_string(TOKENS["text_body"])
        rpr = st.element.get_or_add_rPr()
        rfonts = rpr.get_or_add_rFonts()
        for a in ("ascii", "hAnsi", "cs", "eastAsia"):
            rfonts.set(qn("w:" + a), LATIN_FONT if a in ("ascii", "hAnsi") else FONT)
        rpr.append(_el("w:szCs", val=str(int(SIZE["body"] * 2))))
        pf = st.paragraph_format
        pf.space_after = Pt(6)
        pf.line_spacing = 1.32          # เอกสารไทยต้องการระยะบรรทัดมากกว่าอังกฤษ

    def _setup_footer(self):
        p = self.doc.sections[0].footer.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if self.footer_text:
            style_run(p.add_run(self.footer_text + " "),
                      size=SIZE["footer"], color="text_muted")
        add_field(p, "PAGE", size=SIZE["footer"], color="text_muted")

    def _spacer(self, pt=5):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.line_spacing = 1.0
        style_run(p.add_run(""), size=pt)
        return p

    # -- บล็อกระดับหน้า ----------------------------------------------------
    def cover(self, title, subtitle=None, meta=None, note=None, logo=None,
              logo_width_cm=None, eyebrow=None, meta_rows=None,
              top_space_pt=24, page_break=True, style="light", art_colors=None):
        """style="light" (ค่าเริ่มต้น) = ปกแถบสี · style="night" = ปกเข้มเต็มหน้า (ดู _cover_night)
        logo_width_cm: light 2.6 ซม. · night 4.6 ซม.

        ปกแบบ light — หน้าปกแบบมีแถบสี: eyebrow + ชื่อเอกสาร + ชื่อระบบ บนแถบสีแบรนด์ (ตัวอักษรขาว)
        แล้วกล่อง metadata (เวอร์ชัน/วันที่/ผู้จัดทำ/สถานะ) ช่วงล่างของหน้า
        meta_rows = [("เวอร์ชัน", "3.5"), ("ปรับปรุง", "19 ก.ค. 2026"), ...]
        ถ้าไม่ส่ง meta_rows จะ fallback ไปใช้บรรทัด meta เดิม"""
        if style == "night":
            return self._cover_night(title, subtitle, meta, note, logo, logo_width_cm or 4.6,
                                     eyebrow, meta_rows, page_break, art_colors)
        logo_width_cm = logo_width_cm or 2.6
        self._spacer(10)

        # --- แถบสีหัวปก ---
        band = self.doc.add_table(rows=1, cols=1)
        fixed_widths(band, [BODY_TWIPS]); no_borders(band)
        cell = band.rows[0].cells[0]
        shade(cell, "brand")
        cell_margins(band, top=260, left=340, bottom=300, right=340)
        cell.paragraphs[0].text = ""

        if logo:
            pl = cell.paragraphs[0]
            pl.add_run().add_picture(logo, width=Cm(logo_width_cm))
            pl.paragraph_format.space_after = Pt(10)
            pe = cell.add_paragraph()
        else:
            pe = cell.paragraphs[0]
        if eyebrow:
            style_run(pe.add_run(eyebrow.upper()), size=SIZE["cover_meta"],
                      color="FFFFFF", bold=True)
            pe.paragraph_format.space_after = Pt(6)
            pt_ = cell.add_paragraph()
        else:
            pt_ = pe
        style_run(pt_.add_run(title), size=SIZE["cover_title"], color="FFFFFF", bold=True)
        pt_.paragraph_format.space_after = Pt(4)
        if subtitle:
            ps = cell.add_paragraph()
            style_run(ps.add_run(subtitle), size=SIZE["cover_subtitle"],
                      color="D9E6F8", bold=True)

        self._spacer(top_space_pt)

        # --- กล่อง metadata ล่างหน้า ---
        rows = meta_rows
        if not rows and meta:
            rows = [("รายละเอียด", meta)]
        if rows:
            mt = self.doc.add_table(rows=len(rows), cols=2)
            fixed_widths(mt, [2400, 6960]); set_borders(mt, color="line", size=4)
            cell_margins(mt, top=70, left=360, bottom=70, right=360)  # ให้ตัวอักษรตรงแนวกับแถบหัวปก
            for i, (label, value) in enumerate(rows):
                lc, vc = mt.rows[i].cells
                shade(lc, "brand_tint"); vcenter(lc); vcenter(vc)
                lp = lc.paragraphs[0]
                style_run(lp.add_run(str(label)), size=SIZE["small"], color="brand_deep", bold=True)
                vp = vc.paragraphs[0]
                style_run(vp.add_run(str(value)), size=SIZE["small"], color="text_body")
        if note:
            pn = self.doc.add_paragraph()
            pn.paragraph_format.space_before = Pt(10)
            style_run(pn.add_run(note), size=SIZE["cover_note"],
                      color="text_muted", italic=True)
        if page_break:
            self._break_after_last()
        return self

    def _cover_night(self, title, subtitle, meta, note, logo, logo_width_cm, eyebrow, meta_rows,
                     page_break, art_colors):
        """ปกเข้มเต็มหน้า: พื้นเทาเข้ม #1C1C22 + แสงจางสีแบรนด์ · โลโก้ (ถ้ามี) เล็กมุมซ้ายบน
        ชื่อเอกสารชิดใต้โลโก้ · เส้นแสงใต้ชื่อ · ตารางข้อมูลค่อนไปท้ายหน้า
        art_colors = (สี 1, สี 2, สี 3) ของเส้นแสงและแสงพื้น · ค่าเริ่มต้นมาจาก brand_2 → brand → brand อ่อน
        ต้องมี numpy + pillow (cover_art.py อยู่โฟลเดอร์เดียวกับไฟล์นี้)"""
        import math
        import cover_art

        sec = self.doc.sections[0]
        sec.different_first_page_header_footer = True      # ปกไม่มี footer
        top, right, bottom, left = self.margins_cm
        text_w = sec.page_width.cm - left - right
        body_pt, col_pt = (sec.page_height.cm - top - bottom) * 28.35, text_w * 28.35
        total = int(text_w * 567)
        c1, c2, c3 = art_colors or (TOKENS["brand_2"], TOKENS["brand"], mix("brand", "FFFFFF", 0.45))

        logo_h = 0
        if logo:
            from PIL import Image
            with Image.open(logo) as im:
                logo_h = logo_width_cm * im.height / im.width
        lead = logo_h * 28.35 + 27 if logo else 0

        size = NIGHT_TITLE_PT
        if math.ceil(len(title) * 0.58 * size / col_pt) > 2:
            size = NIGHT_TITLE_PT - 6
        title_lines = math.ceil(len(title) * 0.58 * size / col_pt)

        first = None
        if eyebrow:
            first = self.para(None, space_after=6)
            r = style_run(first.add_run(eyebrow.upper()), size=SIZE["cover_meta"],
                          color=mix(c1, "FFFFFF", 0.45), bold=True)
            r._r.get_or_add_rPr().append(_el("w:spacing", val=40))
            order_rpr(r._r.rPr)
        pt_ = self.para(None, space_after=4)
        pt_.paragraph_format.line_spacing = 1.0
        style_run(pt_.add_run(title), size=size, color="FFFFFF", bold=True)
        first = first or pt_
        first.paragraph_format.space_before = Pt(lead)
        if subtitle:
            ps = self.para(None, space_after=12)
            style_run(ps.add_run(subtitle), size=SIZE["cover_subtitle"], color=mix(c2, "FFFFFF", 0.8))

        rule = self.para(None, space_after=0)
        rule.paragraph_format.space_before = Pt(0 if subtitle else 8)
        rule.paragraph_format.line_spacing = Pt(6)
        line, pad = cover_art.light_line(text_w, (c1, c2, c3))
        anchor_picture(rule, line, left - pad, 0.106 - cover_art.LINE_HEIGHT_CM / 2,
                       text_w + 2 * pad, cover_art.LINE_HEIGHT_CM, Z_LINE, rel_v="paragraph")
        anchor_picture(first, cover_art.night_background(c2, c3, NIGHT_BASE), 0, 0,
                       sec.page_width.cm, sec.page_height.cm, Z_BG)
        if logo:
            anchor_picture(first, logo, left, top, logo_width_cm, logo_h, Z_LOGO)

        rows = list(meta_rows or ([("รายละเอียด", meta)] if meta else []))
        key = [r for r in rows if len(str(r[1])) <= 18][:4]
        rest = [r for r in rows if r not in key]
        used = lead + (SIZE["cover_meta"] * 1.6 + 6 if eyebrow else 0) + title_lines * size * 1.4 + 4
        used += (SIZE["cover_subtitle"] * 1.6 + 12 if subtitle else 8) + 6
        used += (50 if key else 0) + 8 + len(rest) * 14 + (len(str(note or "")) * 4.7 / col_pt + 1) * 14
        gap = self._spacer(1)
        gap.paragraph_format.space_before = Pt(max(10, body_pt - used - 15))

        if key:
            grid = self.doc.add_table(rows=2, cols=len(key))
            self._top_rule(grid, NIGHT_RULE)
            cell_margins(grid, 110, 0, 20, 0)
            fixed_widths(grid, [total // len(key)] * len(key))
            for i, (k, v) in enumerate(key):
                lp = grid.cell(0, i).paragraphs[0]
                lp.paragraph_format.space_after = Pt(0)
                style_run(lp.add_run(str(k).upper()), size=NIGHT_SMALL_PT, color=NIGHT_LABEL, bold=True)
                vp = grid.cell(1, i).paragraphs[0]
                vp.paragraph_format.space_after = Pt(0)
                style_run(vp.add_run(str(v)), size=11, color=NIGHT_VALUE, bold=True)
        if rest:
            self._spacer(8)
            mt = self.doc.add_table(rows=len(rest), cols=2)
            no_borders(mt)
            cell_margins(mt, 18, 0, 18, 0)
            fixed_widths(mt, [2409, total - 2409])
            for row, (k, v) in zip(mt.rows, rest):
                for cell, text, color in ((row.cells[0], k, NIGHT_LABEL), (row.cells[1], v, NIGHT_VALUE)):
                    cell.paragraphs[0].paragraph_format.space_after = Pt(0)
                    style_run(cell.paragraphs[0].add_run(str(text)), size=9, color=color)
        if note:
            pn = self.doc.add_paragraph()
            pn.paragraph_format.space_before = Pt(10)
            style_run(pn.add_run(note), size=NIGHT_SMALL_PT, color=NIGHT_LABEL)
        else:
            self._spacer(1)
        if page_break:
            self._break_after_last()
        return self

    @staticmethod
    def _top_rule(table, color):
        no_borders(table)
        top = table._tbl.tblPr.find(qn("w:tblBorders")).find(qn("w:top"))
        for k, v in (("val", "single"), ("sz", 6), ("color", color)):
            top.set(qn("w:" + k), str(v))

    def _break_after_last(self):
        """ขึ้นหน้าใหม่ต่อท้ายย่อหน้าสุดท้ายของปก แทนการเพิ่มย่อหน้าตัวแบ่งหน้าใหม่
        เพราะถ้าปกเต็มหน้าพอดี ย่อหน้าตัวแบ่งจะตกไปหน้า 2 แล้วได้หน้าว่าง 1 หน้า"""
        body = self.doc.element.body
        kids = [k for k in body if k.tag != qn("w:sectPr")]
        if kids and kids[-1].tag == qn("w:p"):
            r = _el("w:r"); r.append(_el("w:br", **{"type": "page"})); kids[-1].append(r)
        else:
            self.doc.add_page_break()

    def toc(self, heading="สารบัญ", levels="1-3"):
        """แทรก field สารบัญ — ผู้ใช้กด F9 ใน Word เพื่ออัปเดต
        (LibreOffice/Word จะสร้างรายการให้อัตโนมัติเมื่อ refresh)"""
        self.h1(heading, numbered=False)
        p = self.doc.add_paragraph()
        add_field(p, f'TOC \\o "{levels}" \\h \\z \\u', size=SIZE["body"])
        self.doc.add_page_break()
        return p

    # -- หัวข้อและเนื้อความ -------------------------------------------------
    def h1(self, text, numbered=True, space_before=18):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(8)
        keep_with_next(p)
        style_run(p.add_run(text), size=SIZE["h1"], color="brand", bold=True)
        self._tag_outline(p, 1)
        return p

    def h2(self, text, space_before=14):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(6)
        keep_with_next(p)
        style_run(p.add_run(text), size=SIZE["h2"], color="brand_deep", bold=True)
        self._tag_outline(p, 2)
        return p

    def h3(self, text, space_before=10):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(4)
        keep_with_next(p)
        style_run(p.add_run(text), size=SIZE["h3"], color="text", bold=True)
        self._tag_outline(p, 3)
        return p

    def _tag_outline(self, paragraph, level):
        """ใส่ outline level เพื่อให้ TOC / Navigation pane เห็นหัวข้อ
        โดยไม่ต้องใช้ built-in Heading style (ซึ่งจะทับสีที่เราตั้งไว้)"""
        ppr = paragraph._p.get_or_add_pPr()
        ppr.append(_el("w:outlineLvl", val=str(level - 1)))

    def para(self, text=None, size=None, color="text_body", bold=False,
             italic=False, align=None, space_after=6):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        if align == "center":
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        elif align == "right":
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        elif align == "justify":
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        if text:
            style_run(p.add_run(text), size=size or SIZE["body"],
                      color=color, bold=bold, italic=italic)
        return p

    def rich(self, parts, align=None, space_after=6):
        """ย่อหน้าที่ผสมหลายรูปแบบในบรรทัดเดียว
        parts = [("ข้อความ", {"bold": True, "color": "brand"}), ("ต่อ", {})]"""
        p = self.para(None, align=align, space_after=space_after)
        for text, opts in parts:
            style_run(p.add_run(text), size=opts.pop("size", SIZE["body"]), **opts)
        return p

    def bullets(self, items, style="List Bullet", size=None):
        out = []
        for it in items:
            p = self.doc.add_paragraph(style=style)
            p.paragraph_format.space_after = Pt(2)
            style_run(p.add_run(it), size=size or SIZE["body"], color="text_body")
            out.append(p)
        return out

    def code(self, text, lang=None):
        """บล็อกโค้ด — พื้นเทาอ่อน ฟอนต์ monospace"""
        t = self.doc.add_table(rows=1, cols=1)
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        no_borders(t)
        cell_margins(t, 100, 140, 100, 140)
        c = t.cell(0, 0)
        shade(c, "grey_bg")
        left_accent(c, "line", 12)
        c.paragraphs[0].text = ""
        first = True
        for line in text.rstrip("\n").split("\n"):
            p = c.paragraphs[0] if first else c.add_paragraph()
            first = False
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.15
            style_run(p.add_run(line), size=SIZE["small"], color="text", mono=True)
        self._spacer(6)
        return t

    # -- ตาราง --------------------------------------------------------------
    def table(self, headers, rows, widths=None, zebra=False, align=None,
              first_col_bold=False, size=None, header_style="tint"):
        """ตารางมาตรฐาน: หัวพื้นอ่อนของสีแบรนด์ (brand ผสมขาว 80%) ตัวหนา brand_deep
        ไม่มีเส้นบน มีเส้น brand หนา 1.5pt ใต้แถวหัวเส้นเดียว เส้นแถวเทาบาง
        header_style="classic" = แบบเดิม (หัว brand_tint · กริดเทาบางครบทุกเส้น)
        widths — รายการความกว้างหน่วย twips (รวมกัน = BODY_TWIPS 9638 สำหรับ A4 ขอบ 2 ซม.)
        align  — รายการ 'left'|'center'|'right' ต่อคอลัมน์"""
        size = size or SIZE["table"]
        t = self.doc.add_table(rows=1, cols=len(headers))
        t.autofit = widths is None
        classic = header_style == "classic"
        set_borders(t) if classic else row_borders(t)
        cell_margins(t)

        hdr = t.rows[0]
        repeat_header(hdr)
        for i, text in enumerate(headers):
            c = hdr.cells[i]
            shade(c, "brand_tint" if classic else mix("brand", "FFFFFF", 0.8))
            if not classic:
                cell_border(c, "top")
                cell_border(c, "bottom", "brand", 12)
            vcenter(c)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            style_run(p.add_run(str(text)), size=size, color="brand_deep", bold=True)

        for ri, row in enumerate(rows):
            cells = t.add_row().cells
            for ci, val in enumerate(row):
                c = cells[ci]
                vcenter(c)
                if zebra and ri % 2 == 1:
                    shade(c, "brand_tint_2")
                p = c.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                if align and ci < len(align):
                    p.alignment = {"center": WD_ALIGN_PARAGRAPH.CENTER,
                                   "right": WD_ALIGN_PARAGRAPH.RIGHT,
                                   "left": WD_ALIGN_PARAGRAPH.LEFT}[align[ci]]
                style_run(p.add_run("" if val is None else str(val)), size=size,
                          color="text_body", bold=first_col_bold and ci == 0)

        if widths:
            fixed_widths(t, widths)
        self._spacer(5)
        return t

    def kpi_row(self, items, width_twips=BODY_TWIPS):
        """แถบตัวเลขสรุปแนวนอน — items = [("19", "โครงการทั้งหมด"), ...]"""
        t = self.doc.add_table(rows=1, cols=len(items))
        no_borders(t)
        cell_margins(t, 120, 120, 120, 120)
        for i, (value, label) in enumerate(items):
            c = t.cell(0, i)
            shade(c, "brand_tint"); vcenter(c)
            c.width = Pt(width_twips / 20 / len(items))
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_after = Pt(0)
            style_run(p.add_run(str(value)), size=18, color="brand", bold=True)
            p2 = c.add_paragraph()
            p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p2.paragraph_format.space_after = Pt(0)
            style_run(p2.add_run(label), size=SIZE["caption"], color="text_muted")
        fixed_widths(t, [width_twips // len(items)] * len(items))
        self._spacer(7)
        return t

    # -- องค์ประกอบเสริม ----------------------------------------------------
    def callout(self, kind, title, body):
        """กล่องข้อความ: tip | note | warning | critical | success | question"""
        bg, accent, fg, icon = CALLOUT_KINDS[kind]
        t = self.doc.add_table(rows=1, cols=1)
        no_borders(t)
        cell_margins(t, 110, 150, 110, 150)
        c = t.cell(0, 0)
        shade(c, bg)
        left_accent(c, accent, 24)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        style_run(p.add_run(f"{icon} {title}  "), size=SIZE["body"], color=fg, bold=True)
        style_run(p.add_run(body), size=SIZE["body"], color="text_body")
        fixed_widths(t, [BODY_TWIPS])
        self._spacer(6)
        return t

    def figure(self, image_path, caption=None, width_cm=15.5, number=None):
        """รูปกลางหน้า + คำบรรยายตัวเอียงสีเทาใต้รูป"""
        p = self.doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(4)
        p.add_run().add_picture(image_path, width=Cm(width_cm))
        if caption:
            cap = self.doc.add_paragraph()
            cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            cap.paragraph_format.space_after = Pt(12)
            label = f"รูปที่ {number} — " if number else ""
            style_run(cap.add_run(label + caption), size=SIZE["caption"],
                      color="text_muted", italic=True)
        return p

    def pill_table(self, headers, rows, status_col, palette=None, widths=None):
        """ตารางที่คอลัมน์สถานะถูกย้อมสีตามค่า
        palette = {"เสร็จ": "green", "กำลังทำ": "amber", "ค้าง": "red"}"""
        palette = palette or {}
        t = self.table(headers, rows, widths=widths)
        for r in t.rows[1:]:
            cell = r.cells[status_col]
            key = cell.text.strip()
            tone = palette.get(key)
            if not tone:
                continue
            shade(cell, TOKENS[tone + "_bg"])
            cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in cell.paragraphs[0].runs:
                style_run(run, size=SIZE["table"], color=tone, bold=True)
        return t

    def signoff(self, roles, title="การลงนามอนุมัติ"):
        """ตารางเซ็นอนุมัติท้ายเอกสาร — roles = [("Product Owner", "คุณ..."), ...]"""
        self.h2(title)
        return self.table(["บทบาท", "ชื่อ-นามสกุล", "ลายเซ็น", "วันที่"],
                          [[r, n, "", ""] for r, n in roles],
                          widths=[2400, 2900, 2400, 1660])

    def landscape_section(self):
        """เปิดส่วนแนวนอน สำหรับตารางกว้างหรือแผนภาพใหญ่"""
        s = self.doc.add_section(WD_SECTION.NEW_PAGE)
        s.page_width, s.page_height = s.page_height, s.page_width
        return s

    def page_break(self):
        self.doc.add_page_break()

    def save(self, path):
        self.doc.save(path)
        return path


# ---------------------------------------------------------------------------
# 4 · ยูทิลิตี
# ---------------------------------------------------------------------------

def to_pdf(docx_path, outdir="."):
    """แปลงเป็น PDF ด้วย LibreOffice (ต้องมี soffice ในเครื่อง)
    ใช้ตรวจงานด้วยสายตาก่อนส่งมอบเสมอ"""
    import subprocess
    subprocess.run(["soffice", "--headless", "--convert-to", "pdf",
                    "--outdir", outdir, docx_path], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return docx_path.rsplit("/", 1)[-1].replace(".docx", ".pdf")


def use_brand(**overrides):
    """เปลี่ยน palette ทั้งชุดสำหรับลูกค้า/โปรเจกต์อื่น
        use_brand(brand="C1121F", brand_deep="780000", brand_tint="FDECEC")"""
    TOKENS.update({k: v.lstrip("#").upper() for k, v in overrides.items()})
    return TOKENS


# ---------------------------------------------------------------------------
# ฟอนต์คู่ (ละติน + ไทยคนละตัว) — Word ไม่ใช้ช่อง cs กับตัวอักษรไทยเสมอ
# ---------------------------------------------------------------------------
import copy as _copy
import re as _re

_THAI = _re.compile(r"([฀-๿]+)")


def thai_runs(root):
    """แยกข้อความไทยในทุก run ออกเป็น run ของตัวเอง แล้วตั้งทั้ง 4 ช่องเป็น FONT (ฟอนต์ไทย)
    เหตุ: Word วาดไทยด้วยฟอนต์ช่องละตินถ้าฟอนต์นั้นมีตัวไทย ถ้าไม่มีจะตกไป Browallia New
    การตั้ง cs อย่างเดียวจึงไม่พอเมื่อ LATIN_FONT ไม่ใช่ฟอนต์ไทย
    ใช้: thai_runs(doc.element.body) และกับ header/footer ทุกส่วน ก่อน doc.save()"""
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    for r in list(root.iter(W + "r")):
        kids = [k for k in r if k.tag != W + "rPr"]
        if len(kids) != 1 or kids[0].tag != W + "t" or not _THAI.search(kids[0].text or ""):
            continue
        rpr = r.find(W + "rPr")
        parts = [x for x in _THAI.split(kids[0].text) if x]
        parent, idx = r.getparent(), r.getparent().index(r)
        for j, part in enumerate(parts):
            nr = _el("w:r")
            npr = _copy.deepcopy(rpr) if rpr is not None else _el("w:rPr")
            if _THAI.fullmatch(part):
                rf = npr.find(W + "rFonts")
                if rf is None:
                    rf = _el("w:rFonts")
                    npr.insert(0, rf)
                for a in ("ascii", "hAnsi", "cs", "eastAsia"):
                    rf.set(W + a, FONT)
                order_rpr(npr)
            nr.append(npr)
            t = _el("w:t")
            t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
            t.text = part
            nr.append(t)
            parent.insert(idx + j, nr)
        parent.remove(r)


def embed_fonts(doc):
    """ให้ Word ฝังฟอนต์ไว้ในไฟล์ตอนบันทึก — ใช้เมื่อฟอนต์ไม่ได้มีทุกเครื่อง (เช่น Noto)
    และสัญญาอนุญาตยอมให้ฝัง (OFL ยอม) · ไฟล์ใหญ่ขึ้นหลาย MB"""
    settings = doc.settings.element
    settings.insert(0, _el("w:saveSubsetFonts"))
    settings.insert(0, _el("w:embedTrueTypeFonts"))

