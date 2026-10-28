#!/usr/bin/env python3
"""ตัดคำภาษาไทยในไฟล์ .docx .md .txt ให้ Word และโปรแกรมอื่นขึ้นบรรทัดใหม่ตรงรอยต่อคำ

ปัญหา: ภาษาไทยไม่เว้นวรรคระหว่างคำ ถ้าโปรแกรมหาจุดตัดไม่เจอ ข้อความชิดสองข้างจะยืดช่องไฟทีละตัวอักษร
แก้: ใส่ zero-width space (U+200B ไม่เห็นบนจอ) ระหว่างคำไทย · ผูกตัวเลขกับคำข้าง ๆ ด้วย non-breaking space (U+00A0)
     · ติดป้ายภาษาไทยให้ run ใน .docx · แจ้งย่อหน้าที่ใช้จัดแบบกระจายตัวอักษร

ใช้:
  python thai_linebreak.py รายงาน.docx              แก้ในที่ · เก็บต้นฉบับไว้ใน _to_delete/ ข้างไฟล์
  python thai_linebreak.py รายงาน.docx --check      ตรวจอย่างเดียว ไม่เขียนไฟล์
  python thai_linebreak.py รายงาน.docx --align left เปลี่ยนการจัดย่อหน้าภาษาไทยเป็นชิดซ้าย (หรือ both = ชิดสองข้าง)
  python thai_linebreak.py บท1.md                    ไฟล์ข้อความ (ก่อนแปลงด้วย pandoc)
  python thai_linebreak.py --self-test              ตรวจตัวเอง ใช้ตัวตัดคำจำลอง ไม่ต้องมี pythainlp

ต้องมี: pip install pythainlp lxml
"""
import argparse, re, shutil, sys, zipfile
from pathlib import Path

try:
    from pythainlp.tokenize import word_tokenize
except ImportError:
    word_tokenize = None  # --self-test ใช้ตัวตัดคำจำลองได้ · งานจริงต้องมี (ตรวจใน main)

ZWSP, NBSP = "​", " "
THAI = re.compile(r"[฀-๿]")
# ตัวเลขกับคำที่ติดกัน ห้ามแยกบรรทัด: "4 ประเด็น" · "ตารางที่ 1" · "Week 12" · "พ.ศ. 2569"
GLUE = [
    re.compile(r"(?<=[0-9๐-๙]) (?=[฀-๿%])"),
    re.compile(r"(?<=[฀-๿A-Za-z.]) (?=[0-9๐-๙])"),
]
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
q = lambda tag: f"{{{W}}}{tag}"


def break_points(text: str) -> list[int]:
    """ตำแหน่งที่ใส่ ZWSP ได้: รอยต่อระหว่างคำไทย 2 คำที่ติดกัน"""
    if not THAI.search(text):
        return []
    points, pos, prev = [], 0, ""
    for tok in word_tokenize(text, engine="newmm", keep_whitespace=True):
        if pos and THAI.search(prev[-1:]) and THAI.search(tok[:1]) and text[pos - 1] != ZWSP:
            # ไม่ตัดหน้าไม้ยมก ฯ และสระ/วรรณยุกต์ที่ขึ้นต้นบรรทัดไม่ได้
            if tok[0] not in "ๆฯะ-ฺๅ็-๎":
                points.append(pos)
        pos += len(tok)
        prev = tok
    return points


def fix_text(text: str) -> str:
    text = text.replace(ZWSP, "")  # รันซ้ำได้ผลเดิม
    for p in reversed(break_points(text)):
        text = text[:p] + ZWSP + text[p:]
    for g in GLUE:
        text = g.sub(NBSP, text)
    return text


def fix_paragraph(p, stats, align):
    ts = list(p.iter(q("t")))
    full = "".join(t.text or "" for t in ts)
    if not THAI.search(full):
        return
    stats["paragraphs"] += 1
    clean = full.replace(ZWSP, "")
    points = set(break_points(clean))
    stats["breaks"] += len(points)
    # ใส่ ZWSP ตามตำแหน่งของทั้งย่อหน้า แล้วแบ่งคืนให้แต่ละ run (คำที่ข้าม run ก็ตัดถูก)
    offset = 0
    for t in ts:
        src = (t.text or "").replace(ZWSP, "")
        out = "".join((ZWSP if offset + i in points and i > 0 else "") + ch for i, ch in enumerate(src))
        if offset in points and offset > 0 and src:
            out = ZWSP + out
        for g in GLUE:
            out = g.sub(NBSP, out)
        offset += len(src)
        if out != t.text:
            t.text = out
            t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
        if THAI.search(src):
            r = t.getparent()
            rpr = r.find(q("rPr"))
            if rpr is None:
                rpr = r.makeelement(q("rPr"), {})
                r.insert(0, rpr)
            lang = rpr.find(q("lang"))
            if lang is None:
                lang = rpr.makeelement(q("lang"), {})
                rpr.append(lang)
            if lang.get(q("bidi")) != "th-TH":
                lang.set(q("bidi"), "th-TH")
                stats["lang_tagged"] += 1
    jc = p.find(f"{q('pPr')}/{q('jc')}")
    if jc is not None and jc.get(q("val")) in ("distribute", "thaiDistribute"):
        stats["distributed"] += 1
    if align:
        ppr = p.find(q("pPr"))
        if ppr is None:
            ppr = p.makeelement(q("pPr"), {})
            p.insert(0, ppr)
        if jc is None:
            jc = ppr.makeelement(q("jc"), {})
            ppr.append(jc)
        jc.set(q("val"), align)


def do_docx(path: Path, check: bool, align):
    from lxml import etree
    stats = dict(paragraphs=0, breaks=0, lang_tagged=0, distributed=0)
    parts = {}
    with zipfile.ZipFile(path) as z:
        items = [(i, z.read(i.filename)) for i in z.infolist()]
    for info, data in items:
        n = info.filename
        if n.startswith("word/") and n.endswith(".xml") and re.search(r"(document|header\d*|footer\d*|footnotes|endnotes)\.xml$", n):
            root = etree.fromstring(data)
            for p in root.iter(q("p")):
                fix_paragraph(p, stats, align)
            parts[n] = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
    report(path, stats)
    if check:
        return
    backup(path)
    tmp = path.with_suffix(".tmp.docx")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
        for info, data in items:
            z.writestr(info, parts.get(info.filename, data))
    tmp.replace(path)


def do_text(path: Path, check: bool):
    text = path.read_text(encoding="utf-8")
    # ข้ามโค้ดใน ``` และ ` ` ไม่ให้ ZWSP เข้าไปปนในโค้ด
    chunks = re.split(r"(```[\s\S]*?```|`[^`\n]*`)", text)
    out = "".join(c if c.startswith("`") else fix_text(c) for c in chunks)
    report(path, dict(breaks=out.count(ZWSP)))
    if not check and out != text:
        backup(path)
        path.write_text(out, encoding="utf-8")


def backup(path: Path):
    d = path.parent / "_to_delete"
    d.mkdir(exist_ok=True)
    shutil.copy2(path, d / f"{path.stem}.before-linebreak{path.suffix}")


def report(path, s):
    line = f"{path.name}: จุดตัดคำ {s.get('breaks', 0)}"
    if "paragraphs" in s:
        line += f" · ย่อหน้าไทย {s['paragraphs']} · ติดป้ายภาษาไทย {s['lang_tagged']} run"
        if s["distributed"]:
            line += f" · จัดแบบกระจายตัวอักษร {s['distributed']} ย่อหน้า (ใช้ --align both หรือ left)"
    print(line)


def self_test():
    """ใช้ตัวตัดคำจำลองจากรายการคำ ผลจึงคงที่ไม่ขึ้นกับรุ่นของ pythainlp · ไม่ทดสอบ .docx (ต้องมี lxml)"""
    import tempfile
    global word_tokenize
    words = ["สวัสดี", "ครับ", "เด็ก", "ๆ", "ตาราง", "ที่", "ประเด็น"]

    def fake_tokenize(text, engine=None, keep_whitespace=True):
        out, i = [], 0
        while i < len(text):
            w = next((w for w in words if text.startswith(w, i)), text[i])
            out.append(w)
            i += len(w)
        return out

    real, word_tokenize = word_tokenize, fake_tokenize
    cases = {
        "ใส่จุดตัดระหว่างคำไทย": lambda: break_points("สวัสดีครับ") == [6],
        "ไม่ตัดหน้าไม้ยมก": lambda: break_points("เด็กๆ") == [],
        "ข้อความไม่มีไทยไม่แตะ": lambda: break_points("hello world") == [] and fix_text("hello world") == "hello world",
        "รันซ้ำได้ผลเดิม": lambda: fix_text(fix_text("สวัสดีครับ")) == fix_text("สวัสดีครับ") == "สวัสดี" + ZWSP + "ครับ",
        "ผูกตัวเลขกับคำข้าง ๆ": lambda: fix_text("ตารางที่ 1") == "ตาราง" + ZWSP + "ที่" + NBSP + "1" and NBSP in fix_text("4 ประเด็น"),
    }

    def text_file_case():
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "a.md"
            f.write_text("`สวัสดีครับ` สวัสดีครับ\n", encoding="utf-8")
            do_text(f, check=False)
            out = f.read_text(encoding="utf-8")
            return out.startswith("`สวัสดีครับ`") and ZWSP in out and (Path(d) / "_to_delete" / "a.before-linebreak.md").exists()

    cases["ไฟล์ .md ข้ามโค้ดและสำรองต้นฉบับ"] = text_file_case
    failed = 0
    for name, fn in cases.items():
        try:
            ok = fn()
        except Exception as e:  # noqa: BLE001 — รายงานเป็นข้อไม่ผ่าน ไม่ล้มทั้งชุด
            ok = False
            name += f" ({e})"
        failed += not ok
        print(f"{'ผ่าน ' if ok else 'ไม่ผ่าน'} {name}")
    word_tokenize = real
    print(f"self-test {len(cases) - failed}/{len(cases)} ผ่าน")
    return 1 if failed else 0


if __name__ == "__main__":
    if "--self-test" in sys.argv:
        sys.exit(self_test())
    if word_tokenize is None:
        sys.exit("ต้องติดตั้ง pythainlp ก่อน: pip install pythainlp")
    ap = argparse.ArgumentParser(description="ตัดคำภาษาไทยให้ขึ้นบรรทัดสวย")
    ap.add_argument("files", nargs="+", type=Path)
    ap.add_argument("--check", action="store_true", help="ตรวจอย่างเดียว")
    ap.add_argument("--align", choices=["left", "both"], help="เปลี่ยนการจัดย่อหน้าภาษาไทย")
    a = ap.parse_args()
    for f in a.files:
        if f.suffix.lower() == ".docx":
            do_docx(f, a.check, a.align)
        elif f.suffix.lower() in (".md", ".txt"):
            do_text(f, a.check)
        else:
            print(f"{f.name}: ข้าม — รองรับ .docx .md .txt (HTML ใช้ CSS ตาม references/thai-line-breaking.md)")
