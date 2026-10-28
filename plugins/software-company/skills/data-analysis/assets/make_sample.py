"""สร้าง sales-sample.csv ยอดขายรายเดือน (ตัวอย่าง ไม่ใช่ข้อมูลจริง) ที่มีปัญหาแบบไฟล์ไทยจริง

ปัญหาที่ใส่ไว้ให้ตัววิเคราะห์ต้องจัดการ: ปี พ.ศ. · ชื่อเดือนย่อภาษาไทย · ตัวคั่นหลักพัน ·
เลขไทย ๐–๙ · ช่องว่าง (ข้อมูลหาย) ต่างจาก "-" (Excel แบบบัญชีแสดง 0 เป็น "-")

    python make_sample.py sales-sample.csv
    python make_sample.py --self-test
"""
import csv
import random
import sys
import tempfile
from pathlib import Path

MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
          "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
TO_THAI_DIGITS = str.maketrans("0123456789", "๐๑๒๓๔๕๖๗๘๙")
# ช่องทาง: (ยอดเดือนแรก, โตต่อเดือน, ความแกว่ง, ยอดต่อออร์เดอร์)
CHANNELS = {"หน้าร้าน": (1_250_000, -0.008, 0.04, 450),
            "Shopee": (420_000, 0.030, 0.06, 380),
            "LINE": (120_000, 0.025, 0.08, 520)}
CAMPAIGN = {11: 1.6, 12: 1.4}               # 11.11 และ 12.12 ของ Shopee
MISSING = {("LINE", 2568, m) for m in (3, 4, 5)}   # แอดมินไม่ได้จดยอด
CLOSED = {("หน้าร้าน", 2568, 8)}                   # ปิดปรับปรุงร้าน ยอด 0 จริง


def main(path):
    rng = random.Random(2568)               # seed คงที่ สร้างใหม่ได้ไฟล์เดิมทุกครั้ง
    rows = [["เดือน", "ช่องทาง", "ยอดขาย (บาท)", "ออร์เดอร์"]]
    for i in range(24):
        year, month = 2567 + i // 12, i % 12 + 1
        for name, (base, growth, noise, ticket) in CHANNELS.items():
            sales = base * (1 + growth) ** i * (1 + rng.uniform(-noise, noise))
            if name == "Shopee":
                sales *= CAMPAIGN.get(month, 1)
            key = (name, year, month)
            if key in MISSING:
                amount, orders = "", ""
            elif key in CLOSED:
                amount, orders = "-", "-"
            else:
                amount, orders = f"{round(sales, -2):,.0f}", f"{round(sales / ticket):,}"
            if name == "LINE" and year == 2568:          # พิมพ์ด้วยแป้นไทย
                amount, orders = amount.translate(TO_THAI_DIGITS), orders.translate(TO_THAI_DIGITS)
            rows.append([f"{MONTHS[month - 1]} {year}", name, amount, orders])
    with open(path, "w", encoding="utf-8-sig", newline="") as f:   # แบบ "CSV UTF-8" ของ Excel
        csv.writer(f).writerows(rows)


def self_test():
    """Build the file twice: same bytes both times, 72 data rows, and each planted problem is really in it."""
    with tempfile.TemporaryDirectory() as tmp:
        a, b = Path(tmp, "a.csv"), Path(tmp, "b.csv")
        main(a), main(b)
        assert a.read_bytes() == b.read_bytes(), "fixed seed must give the same file every time"
        assert a.read_bytes().startswith(b"\xef\xbb\xbf"), "needs the UTF-8 BOM Excel writes"
        rows = list(csv.reader(a.read_text(encoding="utf-8-sig").splitlines()))
        assert rows[0] == ["เดือน", "ช่องทาง", "ยอดขาย (บาท)", "ออร์เดอร์"] and len(rows) == 1 + 24 * 3, len(rows)
        by = {(r[0], r[1]): r for r in rows[1:]}
        assert by[("มี.ค. 2568", "LINE")][2:] == ["", ""]                       # missing, not zero
        assert by[("ส.ค. 2568", "หน้าร้าน")][2:] == ["-", "-"]                  # real zero shown as "-"
        assert any(ch in by[("ม.ค. 2568", "LINE")][2] for ch in "๐๑๒๓๔๕๖๗๘๙")   # Thai digits
        assert "," in by[("ม.ค. 2567", "หน้าร้าน")][2]                           # thousands separator
        assert int(by[("พ.ย. 2567", "Shopee")][2].replace(",", "")) > int(by[("ต.ค. 2567", "Shopee")][2].replace(",", ""))  # 11.11 campaign
    print("self-test ok")


if __name__ == "__main__":
    if sys.argv[1:] == ["--self-test"]:
        self_test()
    else:
        main(sys.argv[1] if len(sys.argv) > 1 else "sales-sample.csv")
