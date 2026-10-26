"""ตรวจไอคอน SVG ทั้งชุด แล้วทำหน้าเทียบที่ขนาดจริงกับภาพเบลอ

  python icon_check.py <ไฟล์.svg ...> [--out <โฟลเดอร์>] [--brand "#4338CA"] [--grid 24]
  python icon_check.py --self-test

ตรวจ (ไม่ต่อเน็ต):
  - viewBox เป็นจัตุรัส · ไม่มี <text> <image> <foreignObject> หรือฟอนต์ (ไอคอนต้องเป็นรูปทรงล้วน)
  - stroke-width ทั้งชุดเท่ากัน · ทุกไฟล์ใช้ viewBox ขนาดเดียวกัน
  - พิกัดชิดกริด: บนกริด 24 ค่าควรลงที่ .0 หรือ .5 (ไม่บังคับ แต่เตือนถ้าหลุดเกิน 20%)
หน้าเทียบ (ต้องมี Python Playwright · ไม่มีจะข้ามแล้วบอก):
  - ทุกไอคอนที่ 16 · 24 · 32 · 48 · 128 px บนพื้นขาว มืด และสีแบรนด์
  - แถวเบลอ: ถ้าตัวไหนเป็นก้อนเข้มแน่นกว่าตัวอื่น แปลว่ารายละเอียดมากไป (วิธี blur test ของ Lucide)
"""
import argparse
import re
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

SIZES = (16, 24, 32, 48, 128)
FORBIDDEN = {"text", "image", "foreignObject", "font", "font-face"}
NUM = re.compile(r"-?\d*\.?\d+(?:e-?\d+)?")


def local(tag):
    return tag.rsplit("}", 1)[-1]


def lint(path):
    """คืน (ปัญหา, ข้อมูลสรุป) ของไฟล์เดียว"""
    problems, info = [], {"viewbox": None, "strokes": set(), "coords": []}
    try:
        root = ET.parse(path).getroot()
    except ET.ParseError as e:
        return [f"อ่าน SVG ไม่ได้: {e}"], info
    vb = (root.get("viewBox") or "").split()
    if len(vb) == 4 and float(vb[2]) == float(vb[3]):
        info["viewbox"] = float(vb[2])
    else:
        problems.append(f"viewBox ต้องเป็นจัตุรัส (ได้ {root.get('viewBox')!r})")
    for el in root.iter():
        name = local(el.tag)
        if name in FORBIDDEN:
            problems.append(f"มี <{name}> · ไอคอนต้องเป็นรูปทรงล้วน แปลงตัวอักษรเป็น path ก่อน")
        style = el.get("style", "")
        sw = el.get("stroke-width") or (re.search(r"stroke-width:\s*([\d.]+)", style) or [None, None])[1]
        if sw and NUM.search(sw):
            info["strokes"].add(float(NUM.search(sw)[0]))  # รับ "2px" ด้วย
        for attr in ("d", "x", "y", "cx", "cy", "x1", "y1", "x2", "y2", "points", "width", "height", "r"):
            if el.get(attr):
                info["coords"] += [float(n) for n in NUM.findall(el.get(attr))]
    return problems, info


def check_set(paths, grid=24):
    """ตรวจทั้งชุด คืนรายการปัญหาเป็นข้อความ"""
    out, viewboxes, strokes = [], set(), set()
    for p in paths:
        problems, info = lint(p)
        out += [f"{p.name}: {m}" for m in problems]
        if info["viewbox"]:
            viewboxes.add(info["viewbox"])
        strokes |= info["strokes"]
        if info["viewbox"] == grid and info["coords"]:
            off = [c for c in info["coords"] if abs(c * 2 - round(c * 2)) > 0.01]
            if len(off) / len(info["coords"]) > 0.2:
                out.append(f"{p.name}: พิกัด {len(off)}/{len(info['coords'])} ไม่ลง .0 หรือ .5 บนกริด {grid} เส้นจะเบลอที่ขนาดจริง (เตือน)")
    if len(viewboxes) > 1:
        out.append(f"ทั้งชุดใช้ viewBox ไม่เท่ากัน: {sorted(viewboxes)}")
    if len(strokes) > 1:
        out.append(f"ทั้งชุดใช้ stroke-width ไม่เท่ากัน: {sorted(strokes)} · ชุดเดียวกันควรใช้ค่าเดียว")
    return out


def sheet_html(paths, brand):
    rows = []
    for p in paths:
        svg = p.read_text(encoding="utf-8")
        cells = []
        for bg, fg in (("#ffffff", "#1b1a22"), ("#16161a", "#f2f0ea"), (brand, "#ffffff")):
            icons = "".join(f'<span style="width:{s}px;height:{s}px">{svg}</span>' for s in SIZES)
            blur = f'<span class="blur" style="width:48px;height:48px">{svg}</span>'
            cells.append(f'<td style="background:{bg};color:{fg}">{icons}{blur}</td>')
        rows.append(f"<tr><th>{p.stem}</th>{''.join(cells)}</tr>")
    return f"""<!doctype html><meta charset="utf-8"><style>
body{{margin:16px;font:14px system-ui,sans-serif}}table{{border-collapse:collapse}}
th{{text-align:left;padding:8px 12px;white-space:nowrap}}td{{padding:12px}}
span{{display:inline-block;margin-right:14px;vertical-align:bottom}}span svg{{width:100%;height:100%}}
.blur{{filter:blur(3px);margin-left:18px}}</style>
<p>ขนาด {' · '.join(map(str, SIZES))} px แล้วตามด้วยภาพเบลอ · พื้นขาว · มืด · สีแบรนด์</p>
<table>{''.join(rows)}</table>"""


def render(paths, out, brand):
    page = out / "icon-sheet.html"
    page.write_text(sheet_html(paths, brand), encoding="utf-8")
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return f"เขียน {page} แล้ว · ไม่มี Python Playwright จึงไม่ได้ทำภาพ ให้เปิดหน้า HTML ดูเอง"
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        tab = browser.new_page(viewport={"width": 1500, "height": 400})
        tab.goto(page.resolve().as_uri())
        tab.screenshot(path=str(out / "icon-sheet.png"), full_page=True)
        browser.close()
    return f"เขียน {page} และ {out / 'icon-sheet.png'} · เปิดภาพดูเองทุกครั้ง ตัวเลขผ่านไม่ได้แปลว่าสวย"


def self_test():
    ok = []
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        good = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M12 4v16"/></svg>'
        (d / "a.svg").write_text(good, encoding="utf-8")
        (d / "b.svg").write_text(good.replace('stroke-width="2"', 'stroke-width="1.5"'), encoding="utf-8")
        (d / "c.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20"><text x="1" y="12">A</text></svg>', encoding="utf-8")
        (d / "d.svg").write_text(good.replace("M4 12h16M12 4v16", "M4.3 12.2h15.7M12.1 4.3v15.6"), encoding="utf-8")
        ok.append(("ชุดที่ดีไม่มีปัญหา", check_set([d / "a.svg"]) == []))
        ok.append(("stroke-width ไม่เท่ากันโดนจับ", any("stroke-width ไม่เท่ากัน" in m for m in check_set([d / "a.svg", d / "b.svg"]))))
        msgs = check_set([d / "c.svg"])
        ok.append(("viewBox ไม่จัตุรัสและ <text> โดนจับ", any("จัตุรัส" in m for m in msgs) and any("<text>" in m for m in msgs)))
        ok.append(("พิกัดหลุดกริดโดนเตือน", any("ไม่ลง .0 หรือ .5" in m for m in check_set([d / "d.svg"]))))
        ok.append(("หน้าเทียบมีทุกขนาดและแถวเบลอ", all(f"{s}px" in sheet_html([d / "a.svg"], "#4338CA") for s in SIZES) and 'class="blur"' in sheet_html([d / "a.svg"], "#4338CA")))
    for name, passed in ok:
        print(f"  {'ผ่าน' if passed else 'ล้ม'} {name}")
    n = sum(p for _, p in ok)
    print(f"\nself-test {n}/{len(ok)} ผ่าน")
    return n == len(ok)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("files", nargs="*", type=Path)
    ap.add_argument("--out", type=Path, default=Path("."))
    ap.add_argument("--brand", default="#4338CA")
    ap.add_argument("--grid", type=float, default=24)
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(0 if self_test() else 1)
    if not a.files:
        ap.error("ใส่ไฟล์ SVG อย่างน้อย 1 ไฟล์")
    if not re.fullmatch(r"#[0-9a-fA-F]{6}", a.brand):
        ap.error("--brand ต้องเป็นสี hex เช่น #4338CA")
    problems = check_set(a.files, a.grid)
    print("\n".join(problems) if problems else f"ตรวจ {len(a.files)} ไฟล์ ไม่พบปัญหา")
    a.out.mkdir(parents=True, exist_ok=True)
    print(render(a.files, a.out, a.brand))
    sys.exit(1 if any("(เตือน)" not in m for m in problems) else 0)


if __name__ == "__main__":
    main()
