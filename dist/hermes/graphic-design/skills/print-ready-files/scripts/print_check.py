"""print_check.py — ตรวจไฟล์ส่งโรงพิมพ์ด้วยตัวเลข (ระยะตัดตก · ฟอนต์ฝัง · ความละเอียดรูป · หมึกรวม) แทนการอ่านด้วยตา

    python print_check.py pdf work.pdf                  # ต้องมี poppler (pdfinfo · pdffonts) ใน PATH
    python print_check.py pdf work.pdf --bleed-mm 5     # ร้านขอตัดตก 5 มม.
    python print_check.py ppi --px 1200 --mm 100        # รูปกว้าง 1200 px วางกว้าง 100 มม. → ppi
    python print_check.py ppi --px 3000 --mm 2000 --kind vinyl --min-ppi 150
    python print_check.py ink 80 70 60 90               # C M Y K เป็นเปอร์เซ็นต์ → หมึกรวม
    python print_check.py --self-test

เกณฑ์อ่านจาก references/print-specs.json (มีวันตรวจ) · ร้านบอกค่าอื่นให้ใช้ค่าของร้านผ่าน flag
ผ่านที่นี่ไม่ได้แปลว่าโรงพิมพ์รับ · ยังต้องถามร้านและขอปรู๊ฟ · ใช้แค่ Python มาตรฐาน + poppler
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

SPECS = Path(__file__).resolve().parent.parent / "references" / "print-specs.json"
MM_PER_INCH = 25.4
PT_PER_INCH = 72


def mm_to_pt(mm: float) -> float:
    return mm * PT_PER_INCH / MM_PER_INCH


def ppi(px: float, mm: float) -> float:
    return px / (mm / MM_PER_INCH)


def total_ink(c: float, m: float, y: float, k: float) -> float:
    return c + m + y + k


def input_errors(px: float | None = None, mm: float | None = None, cmyk: list[float] | None = None) -> list[str]:
    """ค่าที่ผู้ใช้ใส่ต้องมีเหตุผลก่อนคำนวณ (กันหารศูนย์และเลขติดลบ)"""
    bad = []
    if mm is not None and mm <= 0:
        bad.append(f"--mm ต้องมากกว่า 0 (ได้ {mm:g}) · ใส่ขนาดพิมพ์จริงเป็นมิลลิเมตร")
    if px is not None and px <= 0:
        bad.append(f"--px ต้องมากกว่า 0 (ได้ {px:g}) · ใส่จำนวนพิกเซลของด้านที่วัด")
    if cmyk is not None and any(not 0 <= v <= 100 for v in cmyk):
        bad.append(f"ค่าหมึกต้องอยู่ระหว่าง 0–100 (ได้ {' '.join(f'{v:g}' for v in cmyk)}) · ใส่ C M Y K เป็นเปอร์เซ็นต์")
    return bad


def parse_boxes(text: str) -> dict[str, list[tuple[float, float, float, float]]]:
    """อ่านผล `pdfinfo -box -f 1 -l N` → {ชื่อกล่อง: [กล่องของแต่ละหน้า]}"""
    boxes: dict[str, list] = {}
    for m in re.finditer(r"^(?:Page\s+\d+\s+)?(MediaBox|BleedBox|TrimBox):\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)",
                         text, re.M):
        boxes.setdefault(m[1], []).append(tuple(float(m[i]) for i in range(2, 6)))
    return boxes


def check_bleed(boxes: dict, bleed_mm: float, tol_pt: float) -> list[str]:
    bad = []
    need = mm_to_pt(bleed_mm)
    trims, bleeds = boxes.get("TrimBox", []), boxes.get("BleedBox", [])
    if not trims or len(trims) != len(bleeds):
        return ["อ่าน TrimBox/BleedBox ไม่ได้ · export ใหม่โดยติ๊กเครื่องหมายตัดและระยะตัดตก"]
    for n, (t, b) in enumerate(zip(trims, bleeds), 1):
        sides = {"ซ้าย": t[0] - b[0], "ล่าง": t[1] - b[1], "ขวา": b[2] - t[2], "บน": b[3] - t[3]}
        short = {k: v for k, v in sides.items() if v < need - tol_pt}
        if short:
            got = ", ".join(f"{k} {v / PT_PER_INCH * MM_PER_INCH:.1f} มม." for k, v in short.items())
            bad.append(f"หน้า {n} ระยะตัดตกไม่ถึง {bleed_mm:g} มม.: {got} · ขยายภาพพื้นออกไปนอกเส้นตัดแล้ว export ใหม่")
    return bad


def parse_fonts(text: str) -> list[tuple[str, bool]]:
    """อ่านผล `pdffonts` → [(ชื่อฟอนต์, ฝังแล้วหรือไม่)] · ท้ายแถวคือ emb sub uni objectID(2 ตัว)"""
    rows = []
    for line in text.splitlines()[2:]:
        parts = line.split()
        if len(parts) >= 7 and parts[-5] in ("yes", "no"):
            rows.append((parts[0], parts[-5] == "yes"))
    return rows


def check_fonts(rows: list[tuple[str, bool]]) -> list[str]:
    return [f"ฟอนต์ {name} ไม่ได้ฝังใน PDF · ฝังฟอนต์หรือแปลงเป็นเส้น (ดูใบอนุญาตก่อน)" for name, emb in rows if not emb]


def run(cmd: list[str]) -> str:
    if not shutil.which(cmd[0]):
        sys.exit(f"ไม่พบ {cmd[0]} ใน PATH · ติดตั้ง poppler (Windows: winget install oschwartz10612.Poppler)")
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        sys.exit(f"{cmd[0]} ล้ม: {r.stderr.strip()[:300]}")
    return r.stdout


def check_pdf(path: Path, bleed_mm: float, tol_pt: float) -> list[str]:
    boxes = parse_boxes(run(["pdfinfo", "-box", "-f", "1", "-l", "9999", str(path)]))
    return check_bleed(boxes, bleed_mm, tol_pt) + check_fonts(parse_fonts(run(["pdffonts", str(path)])))


def self_test() -> int:
    specs = json.loads(SPECS.read_text(encoding="utf-8"))
    ok = True

    def expect(name, got, want, tol=0.01):
        nonlocal ok
        hit = abs(got - want) <= tol
        ok &= hit
        print(f"{name}: {got:.2f} (ต้อง {want})", "ผ่าน" if hit else "ไม่ผ่าน")

    expect("3 มม. เป็น pt", mm_to_pt(3), 8.50)
    expect("1200 px ที่ 100 มม.", ppi(1200, 100), 304.8)
    expect("หมึกรวม 80+70+60+90", total_ink(80, 70, 60, 90), 300)
    b = mm_to_pt(3)
    good = parse_boxes(f"MediaBox: 0.00 0.00 100.00 100.00\nBleedBox: 0.00 0.00 100.00 100.00\nTrimBox: {b:.2f} {b:.2f} {100 - b:.2f} {100 - b:.2f}\n")
    bare = parse_boxes("MediaBox: 0 0 100 100\nBleedBox: 0 0 100 100\nTrimBox: 0 0 100 100\n")
    tol = specs["bleed_tolerance_pt"]
    cases = [("ตัดตก 3 มม. ครบ", check_bleed(good, 3, tol), 0), ("ไม่มีตัดตก", check_bleed(bare, 3, tol), 1),
             ("ตัดตก 3 มม. แต่ร้านขอ 5", check_bleed(good, 5, tol), 1)]
    fonts = ("name type encoding emb sub uni object ID\n" + "-" * 40 + "\n"
             "ABCDEF+Sarabun-Regular CID TrueType Identity-H yes yes yes 10 0\n"
             "Tahoma TrueType WinAnsi no no no 11 0\n")
    cases.append(("ฟอนต์ไม่ฝัง 1 จาก 2", check_fonts(parse_fonts(fonts)), 1))
    cases += [("--mm 0", input_errors(px=100, mm=0), 1), ("--px ติดลบ", input_errors(px=-5, mm=50), 1),
              ("หมึก 120 และ -5", input_errors(cmyk=[120, 0, 0, -5]), 1), ("ค่าปกติ", input_errors(1200, 100, [80, 70, 60, 90]), 0)]
    for name, bad, want in cases:
        ok &= len(bad) == want
        print(f"{name}: จับได้ {len(bad)} ข้อ (ต้อง {want})", "ผ่าน" if len(bad) == want else "ไม่ผ่าน")
    if shutil.which("pdfinfo") and shutil.which("pdffonts"):  # มี poppler → ลองกับ PDF จริงที่เขียนเอง
        with tempfile.TemporaryDirectory() as d:
            pdf = Path(d) / "t.pdf"
            pdf.write_text(f"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
                           f"3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 100 100]/BleedBox[0 0 100 100]"
                           f"/TrimBox[{b:.3f} {b:.3f} {100 - b:.3f} {100 - b:.3f}]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n", encoding="latin-1")
            got = check_pdf(pdf, 3, tol)
            ok &= not got
            print("PDF จริง (poppler) ตัดตก 3 มม.:", "ผ่าน" if not got else f"ไม่ผ่าน {got}")
    else:
        print("ข้ามการตรวจ PDF จริง: ไม่พบ poppler ใน PATH")
    if date.today() > date.fromisoformat(specs["recheck_by"]):
        print(f"เตือน: เกณฑ์ตรวจล่าสุด {specs['checked']} เลยกำหนด {specs['recheck_by']} · ตรวจกับร้านและแหล่งใน SKILL.md ก่อนเชื่อ")
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):  # เครื่องที่ code page ไม่ใช่ UTF-8 พิมพ์ภาษาไทยผ่าน pipe แล้วล้ม
        sys.stdout.reconfigure(encoding="utf-8")
    if "--self-test" in sys.argv[1:]:
        sys.exit(self_test())
    specs = json.loads(SPECS.read_text(encoding="utf-8"))
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("pdf")
    p.add_argument("file", type=Path)
    p.add_argument("--bleed-mm", type=float, default=specs["bleed_mm"], help="ระยะตัดตกที่ต้องมี มม. (ค่าตั้งต้นจาก print-specs.json)")
    q = sub.add_parser("ppi")
    q.add_argument("--px", type=float, required=True, help="จำนวนพิกเซลด้านที่วัด")
    q.add_argument("--mm", type=float, required=True, help="ขนาดพิมพ์จริงของด้านเดียวกัน มม.")
    q.add_argument("--kind", choices=list(specs["min_ppi"]), default="flyer")
    q.add_argument("--min-ppi", type=float, help="ร้านระบุค่าอื่น (ค่าตั้งต้นจาก print-specs.json)")
    r = sub.add_parser("ink")
    r.add_argument("cmyk", type=float, nargs=4, metavar=("C", "M", "Y", "K"))
    a = ap.parse_args()

    problems = input_errors(getattr(a, "px", None), getattr(a, "mm", None), getattr(a, "cmyk", None))
    if problems:
        sys.exit(chr(10).join(problems))
    if a.cmd == "pdf":
        bad = check_pdf(a.file, a.bleed_mm, specs["bleed_tolerance_pt"])
    elif a.cmd == "ppi":
        value, need = ppi(a.px, a.mm), a.min_ppi or specs["min_ppi"][a.kind]
        print(f"{value:.1f} ppi ที่ขนาดจริง (เกณฑ์ {need:g})")
        bad = [] if value >= need else [f"ต่ำกว่า {need:g} ppi · ใช้รูปใหญ่ขึ้นหรือย่อขนาดพิมพ์ (ห้ามขยายรูปเล็ก)"]
    else:
        total = total_ink(*a.cmyk)
        print(f"หมึกรวม {total:g}% (เพดาน {specs['max_total_ink_percent']}%)")
        bad = [] if total <= specs["max_total_ink_percent"] else ["หมึกรวมเกินเพดาน · ลดค่าสีหรือใช้ดำ 100K สำหรับตัวหนังสือเล็ก"]
    for line in bad:
        print("ไม่ผ่าน:", line)
    print("ผ่านทุกข้อ · ยังต้องถามร้านและขอปรู๊ฟ" if not bad else f"ไม่ผ่าน {len(bad)} ข้อ")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
