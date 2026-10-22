"""ตรวจว่าเอกสาร Markdown เดินตามไฟล์แบบ (template) ของ skill

    python check_outline.py <template.md> <document.md>
    python check_outline.py --self-test

ตรวจ 4 อย่าง:
  1. หัวข้อ (#) ครบ และเรียงตามแบบ
  2. ช่องตัวหนา (**ชื่อ:**) ครบ
  3. หัวตาราง ตรงกับแบบ
  4. ไม่มีช่องที่ยังไม่เติม — <ข้อความในวงเล็บแหลม> · YYYY-MM-DD · XXXX · ... · ค่าที่ลอกมาจากแบบตรง ๆ

ในแบบ ใส่ <!-- optional --> ท้ายหัวข้อหรือช่อง = ไม่บังคับ (รวมของที่อยู่ใต้มันจนถึงหัวข้อหรือช่องถัดไป)
ถ้าหัวข้อแรกของแบบเจอในเอกสารหลายครั้ง (เช่น test case หลายข้อในไฟล์เดียว) จะตรวจทีละก้อน
ช่องที่ยังไม่รู้ค่าให้เขียน (รอยืนยัน) — ตัวตรวจนับให้ ไม่ถือเป็นข้อผิด

exit 0 = ผ่าน · 1 = มีข้อผิด · 2 = ใช้ผิดหรือแบบไม่มีอะไรให้ตรวจ
"""
import re
import sys
from pathlib import Path

OPTIONAL = "<!-- optional -->"
HTML_TAGS = {"a", "b", "i", "u", "p", "br", "hr", "img", "sub", "sup", "kbd", "div", "span",
             "details", "summary", "table", "tr", "td", "th", "svg", "code", "pre", "em", "strong"}
HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
FIELD = re.compile(r"^\*\*([^*]+?):?\*\*:?\s*(.*)$")
TOKEN = re.compile(r"\b(?:XXXX?|NNN|YYYY)\b")
PLACEHOLDER = re.compile(r"<([^<>\n]{1,80})>")


def strip_code(text):
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return re.sub(r"`[^`\n]*`", "", text)


def clean(s):
    return re.sub(r"<!--.*?-->", "", s).strip()


def parse(text):
    """คืนรายการ (ชนิด, ค่า, บรรทัด, ไม่บังคับ, ค่าในช่อง) ตามลำดับในไฟล์"""
    items, optional, lines = [], False, strip_code(text).splitlines()
    for n, line in enumerate(lines, 1):
        opt = OPTIONAL in line
        if m := HEADING.match(line):
            optional = opt
            items.append(("heading", (len(m[1]), clean(m[2])), n, opt, ""))
        elif m := FIELD.match(line.strip()):
            optional = opt
            items.append(("field", clean(m[1]), n, opt, clean(m[2])))
        elif line.lstrip().startswith("|") and n < len(lines) and re.match(r"^\s*\|[\s:|-]+\|\s*$", lines[n]):
            cells = tuple(c.strip().lower() for c in clean(line).strip().strip("|").split("|"))
            items.append(("table", cells, n, optional, ""))
    return items


def heading_pattern(text):
    parts = re.split(r"(<[^<>]+>|\b(?:XXXX?|NNN|YYYY)\b)", text)
    body = "".join(".+?" if p.startswith("<") else "[A-Za-z0-9]+" if TOKEN.fullmatch(p) else re.escape(p)
                   for p in parts if p)
    return re.compile(rf"^{body}$")


def matches(t, d):
    if t[0] != d[0]:
        return False
    if t[0] == "heading":
        return t[1][0] == d[1][0] and bool(heading_pattern(t[1][1]).match(d[1][1]))
    return t[1] == d[1]


def label(item):
    kind, value = item[0], item[1]
    if kind == "heading":
        return f"หัวข้อ '{'#' * value[0]} {value[1]}'"
    if kind == "field":
        return f"ช่อง '**{value}:**'"
    return f"ตาราง '| {' | '.join(value)} |'"


def check_structure(template, doc, offset=0):
    errors, pos = [], 0
    for t in template:
        found = next((i for i in range(pos, len(doc)) if matches(t, doc[i])), None)
        if found is not None:
            d = doc[found]
            if t[0] == "field" and t[4] and d[4] == t[4] and (PLACEHOLDER.search(t[4]) or "|" in t[4] or TOKEN.search(t[4])):
                errors.append(f"บรรทัด {d[2] + offset}: {label(t)} ยังเป็นค่าจากแบบ '{t[4]}' — เลือกค่าเดียวหรือใส่ (รอยืนยัน)")
            pos = found + 1
        elif not t[3]:
            earlier = any(matches(t, d) for d in doc[:pos])
            errors.append(f"{label(t)} {'ผิดลำดับ — ต้องอยู่หลังหัวข้อก่อนหน้าตามแบบ' if earlier else 'ขาด'}")
    return errors


def check_unfilled(text):
    errors = []
    for n, line in enumerate(strip_code(text).splitlines(), 1):
        for m in PLACEHOLDER.finditer(line):
            inner = m[1]
            word = re.match(r"/?([A-Za-z]+)", inner)
            if inner.startswith(("!--", "http")) or (word and word[1].lower() in HTML_TAGS):
                continue
            errors.append(f"บรรทัด {n}: ยังไม่เติม '<{inner}>'")
        if TOKEN.search(line):
            errors.append(f"บรรทัด {n}: ยังไม่เติม '{TOKEN.search(line)[0]}'")
        if re.search(r"(^\s*(?:[-*]|\d+\.)\s*\.\.\.\s*$)|(\|\s*\.\.\.\s*\|)|(:\s*\.\.\.\s*$)", line):
            errors.append(f"บรรทัด {n}: ยังไม่เติม '...'")
    return errors


def check(template_text, doc_text):
    template, doc = parse(template_text), parse(doc_text)
    if not template:
        raise ValueError("แบบไม่มีหัวข้อ ช่อง หรือตารางให้ตรวจ — path ผิดหรือแบบพัง")
    first = template[0]
    starts = [i for i, d in enumerate(doc) if matches(first, d)]
    if len(starts) > 1:
        errors = []
        for k, s in enumerate(starts):
            block = doc[s:starts[k + 1] if k + 1 < len(starts) else len(doc)]
            errors += [f"ก้อนที่ {k + 1} (บรรทัด {doc[s][2]}): {e}" for e in check_structure(template, block)]
    else:
        errors = check_structure(template, doc)
    return errors + check_unfilled(doc_text), len(starts) or 1


def self_test():
    tpl = "# ADR-XXXX: <title>\n\n**Status:** Proposed | Accepted\n\n## Context\n\n## Options <!-- optional -->\n\n| a | b |\n|---|---|\n\n## Decision\n"
    good = "# ADR-0007: Use Postgres\n\n**Status:** Accepted\n\n## Context\nเหตุผล\n\n## Decision\nใช้ Postgres (รอยืนยัน)\n"
    cases = [
        ("ไฟล์ที่ถูก", good, 0, None),
        ("ขาดหัวข้อ", good.replace("## Decision", "## Choice"), 1, "ขาด"),
        ("ผิดลำดับ", "# ADR-0007: X\n\n**Status:** Accepted\n\n## Decision\n\n## Context\n", 1, "ผิดลำดับ"),
        ("ช่องลอกจากแบบ", good.replace("**Status:** Accepted", "**Status:** Proposed | Accepted"), 1, "ค่าจากแบบ"),
        ("ยังไม่เติม", good.replace("เหตุผล", "<why>\n- ..."), 2, "ยังไม่เติม"),
        ("หลายก้อน", good + "\n" + good.replace("## Context", "## Background"), 1, "ก้อนที่ 2"),
    ]
    failed = 0
    for name, doc, want, needle in cases:
        errors, _ = check(tpl, doc)
        ok = len(errors) == want and (needle is None or any(needle in e for e in errors))
        failed += not ok
        print(f"{'ผ่าน' if ok else 'พัง'} · {name} · เจอ {len(errors)} ข้อ (ควร {want})" + ("" if ok else f" → {errors}"))
    try:
        check("ไม่มีหัวข้อ", good)
        print("พัง · แบบว่างต้องถูกปฏิเสธ"); failed += 1
    except ValueError:
        print("ผ่าน · แบบว่างถูกปฏิเสธ")
    return 1 if failed else 0


def main(argv):
    if argv == ["--self-test"]:
        return self_test()
    if len(argv) != 2:
        print(__doc__)
        return 2
    template_path, doc_path = map(Path, argv)
    try:
        doc_text = doc_path.read_text(encoding="utf-8")
        errors, blocks = check(template_path.read_text(encoding="utf-8"), doc_text)
    except (OSError, ValueError) as e:
        print(f"ตรวจไม่ได้: {e}")
        return 2
    pending = doc_text.count("(รอยืนยัน)")
    for e in errors:
        print(f"✗ {e}")
    print(f"{doc_path.name}: {'ผ่าน' if not errors else f'ไม่ผ่าน {len(errors)} ข้อ'} · ตรวจ {blocks} ก้อน · (รอยืนยัน) {pending} จุด")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main(sys.argv[1:]))
