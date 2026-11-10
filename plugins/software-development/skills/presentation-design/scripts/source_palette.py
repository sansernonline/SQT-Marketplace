"""source_palette.py — ถอดสีจากงานที่จะนำมาทำเด็ค แล้วบอกค่าที่ใส่ใน build_deck.py / StageDeck / pptx_to_html.py

    python source_palette.py <ไฟล์หรือโฟลเดอร์> [อีกไฟล์ ...]
    python source_palette.py --self-test

อ่านได้: .pptx .docx .xlsx (สีที่ใช้จริงในเนื้อหา + สีของธีม) · .html .css .svg (สีที่เขียนไว้ · ตัวแปร --primary --brand --accent)
· .png .jpg .webp (สีเด่นในรูป · ต้องมี Pillow) · .pdf (ต้องมี pdftoppm ของ Poppler · เรนเดอร์ 3 หน้าแรกแล้วอ่านเป็นรูป)
สีเทา ขาว ดำ ไม่นับเป็นสีหลัก · ธีมตั้งต้นของ Office ไม่นับ (ไม่ใช่สีของงาน) · สีรองต้องห่างสีหลัก ≥ 40 องศา
"""
from __future__ import annotations

import colorsys
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from collections import Counter
from pathlib import Path

# accent1–6 ของธีม Office 2007–2010 (ธีมตั้งต้นของ python-pptx) · 2013–2022 · 2023 ขึ้นไป · เจอแปลว่าผู้ทำไม่ได้เลือกสีเอง
OFFICE_DEFAULTS = {"4F81BD", "C0504D", "9BBB59", "8064A2", "4BACC6", "F79646",
                   "4472C4", "ED7D31", "A5A5A5", "FFC000", "5B9BD5", "70AD47",
                   "156082", "E97132", "196B24", "0F9ED5", "A02B93", "4EA72E"}
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp"}
TEXT_EXT = {".html", ".htm", ".css", ".svg"}
OOXML_EXT = {".pptx", ".docx", ".xlsx"}
MIN_HUE_GAP = 40
SAME_HUE = 15          # สีที่เฉดห่างกันไม่เกินนี้คือสีเดียวกันคนละความสว่าง (เงา · ไล่สี · ขอบ) นับรวมกัน
MIN_SUPPORT_SHARE = .1  # สีรองต้องถูกใช้อย่างน้อย 10% ของสีหลัก · สีสถานะที่โผล่ครั้งเดียวไม่ใช่สีของงาน
BRAND_VAR_WEIGHT = 50  # ตัวแปรชื่อ primary/brand/accent คือสีที่คนตั้งใจเลือก นับหนักกว่าสีที่โผล่ในเนื้อ


def rgb(h): return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def hls(h): return colorsys.rgb_to_hls(*(c / 255 for c in rgb(h)))


def lum(h):
    f = lambda c: c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
    r, g, b = (f(c / 255) for c in rgb(h))
    return .2126 * r + .7152 * g + .0722 * b


def contrast(a, b):
    x, y = sorted((lum(a), lum(b)), reverse=True)
    return (x + .05) / (y + .05)


def fit(color, bg, target=4.5):
    """เลื่อนความสว่างของสีจนอ่านออกบนพื้น bg · ใช้เป็นสีตัวอักษรเน้น"""
    h, l, s = hls(color)
    step = -.02 if lum(bg) > .18 else .02
    out = color
    while contrast(out, bg) < target and .03 < l < .97:
        l += step
        out = "{:02X}{:02X}{:02X}".format(*(round(c * 255) for c in colorsys.hls_to_rgb(h, l, s)))
    return out


def is_colourful(h):
    _, l, s = hls(h)
    return s >= .25 and .12 <= l <= .9


def norm(h):
    h = h.lstrip("#").upper()
    return "".join(c * 2 for c in h) if len(h) == 3 else h


def from_ooxml(path, counts, bgs):
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        theme = {}
        for n in names:
            if re.match(r"(ppt|word|xl)/theme/theme\d+\.xml$", n):
                xml = z.read(n).decode("utf-8", "ignore")
                for slot, val in re.findall(r"<a:(accent\d|dk\d|lt\d)>\s*<a:(?:srgbClr val|sysClr [^>]*?lastClr)=\"([0-9A-Fa-f]{6})\"", xml):
                    theme.setdefault(slot, val.upper())
                break
        # ชื่อสีของธีมที่เนื้อหาอ้างถึง · bg/tx คือชื่อเล่นของ lt/dk · .xlsx อ้างด้วยเลขลำดับ (0 lt1 · 1 dk1 · 2 lt2 · 3 dk2 · 4–9 accent1–6)
        alias = {"bg1": "lt1", "tx1": "dk1", "bg2": "lt2", "tx2": "dk2", "light1": "lt1", "dark1": "dk1",
                 "light2": "lt2", "dark2": "dk2", "background1": "lt1", "text1": "dk1"}
        xl_order = ["lt1", "dk1", "lt2", "dk2"] + [f"accent{i}" for i in range(1, 7)]
        scheme = lambda name: theme.get(alias.get(name, name))
        for n in names:
            if not re.match(r"(ppt/(slides|slideLayouts|slideMasters)|word|xl/(worksheets|charts|drawings)|xl)/[^/]+\.xml$", n):
                continue
            xml = z.read(n).decode("utf-8", "ignore")
            if n in ("word/styles.xml", "word/stylesWithEffects.xml"):  # Word ฝังสไตล์ตารางสำเร็จรูปหลายสิบแบบ นับเฉพาะสไตล์ที่เนื้อหาเรียกใช้จริง
                body = "".join(z.read(x).decode("utf-8", "ignore") for x in names
                               if re.match(r"word/(document|header\d*|footer\d*)\.xml$", x))
                used = set(re.findall(r"w:(?:pStyle|rStyle|tblStyle) w:val=\"([^\"]+)\"", body))
                xml = "".join(b for b in re.findall(r"<w:style\b.*?</w:style>", xml, re.S)
                              if re.search(r"w:styleId=\"([^\"]+)\"", b) and re.search(r"w:styleId=\"([^\"]+)\"", b).group(1) in used)
            for val in re.findall(r"srgbClr val=\"([0-9A-Fa-f]{6})\"", xml):  # PowerPoint และรูปทรงในทุกไฟล์
                counts[val.upper()] += 1
            for val in re.findall(r"w:(?:color w:val|fill)=\"([0-9A-Fa-f]{6})\"", xml):  # สีตัวอักษรและพื้นช่องของ Word
                counts[val.upper()] += 1
            for val in re.findall(r"\brgb=\"[0-9A-Fa-f]{2}([0-9A-Fa-f]{6})\"", xml):  # Excel เก็บเป็น ARGB
                counts[val.upper()] += 1
            for name in re.findall(r"(?:schemeClr val|w:themeColor|w:themeFill)=\"(\w+)\"", xml):
                if (name.startswith("accent") or name in ("dk2", "tx2")) and scheme(name):
                    counts[scheme(name)] += 1
            for i in re.findall(r"<(?:color|fgColor|bgColor) theme=\"(\d)\"", xml):
                if int(i) >= 4 and theme.get(xl_order[int(i)]):
                    counts[theme[xl_order[int(i)]]] += 1
            m = re.search(r"<p:bg>(.*?)</p:bg>", xml, re.S)  # พื้นของ master หรือของแต่ละสไลด์ · หยุดที่ปิดแท็ก
            if m:
                c = re.search(r"srgbClr val=\"([0-9A-Fa-f]{6})\"", m.group(1))
                s = re.search(r"schemeClr val=\"(\w+)\"", m.group(1))
                value = c.group(1).upper() if c else (scheme(s.group(1)) or ("FFFFFF" if s.group(1) in ("bg1", "lt1") else None)) if s else None
                if value:
                    bgs[value] += 1
        office = [v for k, v in theme.items() if k.startswith("accent") and v in OFFICE_DEFAULTS]
        if len(office) >= 4:
            for v in office:
                counts.pop(v, None)
            print(f"  {path.name}: ธีมเป็นค่าตั้งต้นของ Office ไม่นับสีธีม")


def from_text(path, counts, bgs):
    text = path.read_text(encoding="utf-8", errors="ignore")
    for val in re.findall(r"(?<!&)#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b", text):  # (?<!&) ข้าม HTML entity เช่น &#160;
        counts[norm(val)] += 1
    for val in re.findall(r"--[\w-]*(?:primary|brand|accent)[\w-]*\s*:\s*#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b", text):
        counts[norm(val)] += BRAND_VAR_WEIGHT
    for val in re.findall(r"--(?:bg|background)\s*:\s*#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b", text):
        bgs[norm(val)] += BRAND_VAR_WEIGHT
    for val in re.findall(r"(?:body|:root|html)\s*\{[^}]*?background(?:-color)?\s*:\s*#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b", text):
        bgs[norm(val)] += 1


def from_image(path, counts, bgs):
    try:
        from PIL import Image
    except ImportError:
        raise SystemExit("อ่านรูปต้องมี Pillow: pip install pillow")
    im = Image.open(path).convert("RGBA")
    white = Image.new("RGBA", im.size, "white")
    im = Image.alpha_composite(white, im).convert("RGB")  # โลโก้พื้นโปร่งใส อ่านบนพื้นขาว
    im.thumbnail((240, 240))
    for n, c in im.quantize(colors=16).convert("RGB").getcolors(240 * 240):
        bgs["{:02X}{:02X}{:02X}".format(*c)] += n  # สีที่กินพื้นที่มากสุดในรูปคือพื้น
    # สีแบรนด์ในรูปมักกินที่น้อย (แถบ · ปุ่ม · ตัวเลข) จึงแยกพิกเซลที่มีสีออกมาจัดกลุ่มเอง ไม่ให้ถูกพื้นกลืน
    # เกณฑ์เข้มกว่าไฟล์เอกสาร เพราะเงาและพื้นไล่สีในรูปให้สีหม่นจำนวนมาก
    pixels = im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()
    vivid = [c for c in pixels if (lambda _h, l, s: s >= .5 and .3 <= l <= .8)(*colorsys.rgb_to_hls(*(v / 255 for v in c)))]
    if vivid:
        strip = Image.new("RGB", (len(vivid), 1))
        strip.putdata(vivid)
        for n, c in strip.quantize(colors=8).convert("RGB").getcolors(len(vivid)):
            counts["{:02X}{:02X}{:02X}".format(*c)] += n


def from_pdf(path, counts, bgs):
    exe = shutil.which("pdftoppm")
    if not exe:
        raise SystemExit("อ่าน .pdf ต้องมี pdftoppm (Poppler) · หรือแคปหน้าเป็น .png แล้วส่งรูปแทน")
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run([exe, "-png", "-r", "40", "-l", "3", str(path), str(Path(tmp) / "p")], check=True)
        for png in Path(tmp).glob("*.png"):
            from_image(png, counts, bgs)


def collect(paths):
    counts, bgs = Counter(), Counter()
    for p in paths:
        files = [f for f in p.rglob("*") if f.is_file()] if p.is_dir() else [p]
        for f in files:
            ext = f.suffix.lower()
            if ext in OOXML_EXT: from_ooxml(f, counts, bgs)
            elif ext in TEXT_EXT: from_text(f, counts, bgs)
            elif ext in IMAGE_EXT: from_image(f, counts, bgs)
            elif ext == ".pdf": from_pdf(f, counts, bgs)
    return counts, bgs


def hue_gap(a, b):
    x, y = hls(a)[0] * 360, hls(b)[0] * 360
    return min(abs(x - y), 360 - abs(x - y))


def vividness(h):
    _, l, s = hls(h)
    return s * (1 - abs(l - .5) * 2)


def groups(counts):
    """รวมสีเฉดเดียวกันเป็นกลุ่ม · ตัวแทนกลุ่มคือสีที่สดที่สุด (เงาและไล่สีหม่นกว่าสีจริงของแบรนด์)"""
    out = []  # [ผลรวม, สมาชิก]
    for c, n in counts.most_common():
        if not is_colourful(c):
            continue
        g = next((g for g in out if hue_gap(g[1][0], c) <= SAME_HUE), None)
        if g:
            g[0] += n
            g[1].append(c)
        else:
            out.append([n, [c]])
    out.sort(key=lambda g: -g[0])
    return [(n, max(members, key=vividness)) for n, members in out]


def pick(counts, bgs):
    ranked = groups(counts)
    if not ranked:
        return None
    (main_n, main), rest = ranked[0], []
    for n, c in ranked[1:]:
        if n < max(3, main_n * MIN_SUPPORT_SHARE):  # สีสถานะที่โผล่ 1–2 ครั้งไม่ใช่สีรองของงาน
            break
        if all(hue_gap(c, x) >= MIN_HUE_GAP for x in [main] + rest):
            rest.append(c)
        if len(rest) == 2:
            break
    bg = bgs.most_common(1)[0][0] if bgs else "FFFFFF"
    return {"main": main, "support": rest, "bg": bg, "dark": lum(bg) < .18}


def report(paths):
    counts, bgs = collect(paths)
    top = [f"#{c} {n}" for c, n in counts.most_common(12) if is_colourful(c)][:6]
    print("สีที่ใช้จริง (นับ):", " · ".join(top) or "ไม่พบสีที่ไม่ใช่เทา")
    p = pick(counts, bgs)
    if not p:
        print("ไม่พบสีของงาน → ใช้ลำดับถัดไปใน presentation-design ข้อ 1 ขั้น 0")
        return 1
    theme = "dark" if p["dark"] else "bright"
    hi = fit(p["main"], "09090A" if p["dark"] else "FFFFFF")
    brand = ",".join([p["main"], hi] + p["support"][:1])
    print(f"สีหลัก #{p['main']} · สีรอง {' '.join('#' + c for c in p['support']) or 'ไม่มี (ใช้สีหลักสีเดียว)'}"
          f" · พื้นต้นทาง #{p['bg']} ({'เข้ม' if p['dark'] else 'สว่าง'})")
    print(f"html-slide-deck : --theme {theme} --brand {brand}")
    stage_bg = 'bg="09090A"' if p["dark"] else 'bg="FFFFFF", block=True'
    print(f"StageDeck       : StageDeck(accent=\"{p['main']}\", {stage_bg})")
    print(f"pptx-to-html    : --accent {p['main']}")
    return 0


def self_test():
    ok = []
    with tempfile.TemporaryDirectory() as tmp:
        t = Path(tmp)
        deck = t / "src.pptx"
        with zipfile.ZipFile(deck, "w") as z:
            z.writestr("ppt/theme/theme1.xml", '<a:accent1><a:srgbClr val="0E8F86"/></a:accent1>'
                                               '<a:accent2><a:srgbClr val="F2A33A"/></a:accent2>')
            z.writestr("ppt/slides/slide1.xml", '<a:schemeClr val="accent1"/>' * 5 + '<a:srgbClr val="F2A33A"/>' * 3
                                                + '<a:srgbClr val="333333"/>' * 9 + '<a:srgbClr val="96660D"/>' * 2)
            z.writestr("ppt/slideMasters/slideMaster1.xml", '<p:bg><p:bgRef><a:schemeClr val="bg1"/></p:bgRef></p:bg>'
                                                            '<a:srgbClr val="1B2A4A"/>')
        p = pick(*collect([deck]))
        ok.append(("pptx: สีหลักคือ accent1 ที่ใช้บ่อยสุด ไม่ใช่เทา", p and p["main"] == "0E8F86"))
        ok.append(("pptx: สีรองห่างพอจึงถูกเลือก · สีที่โผล่ 2 ครั้งไม่นับ", p and p["support"] == ["F2A33A"]))
        ok.append(("pptx: พื้น bg1 ของ master เป็นพื้นสว่าง ไม่หยิบสีรูปทรงหลัง </p:bg>", p and not p["dark"]))
        word = t / "report.docx"
        with zipfile.ZipFile(word, "w") as z:
            z.writestr("word/document.xml", '<w:color w:val="2A4C86"/>' * 6 + '<w:shd w:fill="2A4C86"/>' * 2
                                            + '<w:color w:val="auto"/><w:color w:val="333333"/><w:pStyle w:val="Heading1"/>')
            z.writestr("word/styles.xml", '<w:style w:styleId="Heading1"><w:color w:val="E4572E"/></w:style>' * 1
                                          + '<w:style w:styleId="GridTable4-Accent2"><w:shd w:fill="A63A34"/></w:style>' * 9)
        p = pick(*collect([word]))
        ok.append(("docx: อ่านสีตัวอักษรและพื้นช่องของ Word", p and p["main"] == "2A4C86"))
        ok.append(("docx: สไตล์ตารางที่ไม่ได้ใช้ไม่นับ", "A63A34" not in collect([word])[0]))
        ok.append(("docx: สไตล์หัวข้อที่ใช้จริงถูกนับ", collect([word])[0]["E4572E"] == 1))
        book = t / "sheet.xlsx"
        with zipfile.ZipFile(book, "w") as z:
            z.writestr("xl/styles.xml", '<fgColor rgb="FF0E8F86"/>' * 4)
        p = pick(*collect([book]))
        ok.append(("xlsx: อ่านสี ARGB ใน styles.xml", p and p["main"] == "0E8F86"))
        page = t / "entity.html"
        page.write_text("<p>a&#160;b&#039;c</p>", "utf-8")
        ok.append(("html: HTML entity ไม่ถูกนับเป็นสี", pick(*collect([page])) is None))
        office = t / "office.pptx"
        with zipfile.ZipFile(office, "w") as z:
            z.writestr("ppt/theme/theme1.xml", "".join(f'<a:accent{i}><a:srgbClr val="{v}"/></a:accent{i}>'
                                                       for i, v in enumerate(["4472C4", "ED7D31", "A5A5A5", "FFC000"], 1)))
            z.writestr("ppt/slides/slide1.xml", '<a:schemeClr val="accent1"/>' * 9 + '<a:srgbClr val="C8102E"/>')
        p = pick(*collect([office]))
        ok.append(("pptx: ธีม Office ตั้งต้นไม่นับ เหลือสีที่ผู้ทำเลือกเอง", p and p["main"] == "C8102E"))
        css = t / "site.css"
        css.write_text("body{background:#101014}:root{--brand-primary:#E4572E}.x{color:#3B82F6}.y{color:#3B82F6}", "utf-8")
        p = pick(*collect([css]))
        ok.append(("css: ตัวแปร --brand ชนะสีที่โผล่บ่อย", p and p["main"] == "E4572E"))
        ok.append(("css: พื้น body เข้มถูกจับเป็นพื้นเข้ม", p and p["dark"]))
        try:
            from PIL import Image
            img = Image.new("RGB", (200, 100), (9, 9, 10))
            img.paste((110, 20, 26), (0, 0, 120, 40))   # พื้นไล่สีแดงหม่นกินที่มาก
            img.paste((225, 6, 19), (150, 60, 190, 90))  # สีแบรนด์จริงชิ้นเล็ก
            img.save(t / "shot.png")
            p = pick(*collect([t / "shot.png"]))
            ok.append(("รูป: พื้นเข้ม และตัวแทนกลุ่มแดงคือสีสดของแบรนด์", p and p["dark"] and p["main"] == "E10613"))
        except ImportError:
            print("skip รูป: ไม่มี Pillow")
        ok.append(("fit: สีอ่อนบนพื้นขาวถูกเข้มขึ้นจนถึง 4.5:1", contrast(fit("FFD166", "FFFFFF"), "FFFFFF") >= 4.5))
        ok.append(("เทาล้วนไม่ได้สีหลัก", pick(Counter({"888888": 9, "FFFFFF": 9}), Counter()) is None))
    for name, good in ok:
        print("ok  " if good else "FAIL", name)
    print(f"self-test {sum(g for _, g in ok)}/{len(ok)}")
    return 0 if all(g for _, g in ok) else 1


if __name__ == "__main__":
    if "--self-test" in sys.argv:
        sys.exit(self_test())
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    sys.exit(report([Path(a) for a in sys.argv[1:]]))
