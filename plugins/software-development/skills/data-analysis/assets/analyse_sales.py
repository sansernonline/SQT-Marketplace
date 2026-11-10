"""วิเคราะห์ยอดขายรายเดือนจาก CSV ไทย · สคริปต์รันซ้ำได้ ไม่ต้องมี notebook

    python analyse_sales.py sales-sample.csv --out <โฟลเดอร์ผล> --font <ไฟล์ฟอนต์ไทย .ttf>

ทุกบรรทัดผลขึ้นต้นด้วยรหัส [..] ให้รายงานอ้างถึง · เก็บผลไว้ข้างรายงานด้วย `> output.txt`
ต้องใช้ pandas และ matplotlib 3.11 ขึ้นไป (รุ่นก่อนนั้นไม่จัดวรรณยุกต์ซ้อนสระบน "ที่" จะเหลือ "ที")
"""
import argparse
from pathlib import Path

import pandas as pd

MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
          "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
THAI_DIGITS = str.maketrans("๐๑๒๓๔๕๖๗๘๙", "0123456789")
ONLINE = ["Shopee", "LINE"]   # ชื่อช่องทางออนไลน์ของข้อมูลตัวอย่าง · ข้อมูลจริงที่ชื่อช่องต่างไป แก้บรรทัดนี้ก่อนรัน


def read_thai_csv(path):
    """ลอง utf-8-sig ก่อน (Excel "CSV UTF-8") แล้วค่อย cp874 (โปรแกรมไทยรุ่นเก่า) · อ่านทุกช่องเป็นข้อความ"""
    for encoding in ("utf-8-sig", "cp874"):
        try:
            return pd.read_csv(path, encoding=encoding, dtype=str, keep_default_na=False), encoding
        except UnicodeDecodeError:
            continue
    raise SystemExit(f"อ่าน {path} ไม่ได้ทั้ง utf-8-sig และ cp874 — ถามเจ้าของไฟล์ว่าบันทึกแบบไหน")


def to_number(text):
    """'๑,๒๓๔' → 1234.0 · '-' → 0.0 (Excel แบบบัญชีแสดง 0 เป็น -) · ว่าง → None (ข้อมูลหาย ไม่ใช่ 0)"""
    cleaned = text.translate(THAI_DIGITS).replace(",", "").strip()
    if cleaned == "":
        return None
    return 0.0 if cleaned == "-" else float(cleaned)


def to_month(text):
    """'ม.ค. 2567' → 2024-01-01 · ปี พ.ศ. ลบ 543"""
    name, year = text.split()
    return pd.Timestamp(year=int(year.translate(THAI_DIGITS)) - 543, month=MONTHS.index(name) + 1, day=1)


def thai_month(ts):
    return f"{MONTHS[ts.month - 1]} {ts.year + 543}"


def require_two_years(years):
    """F1 กับ F2 กับหัวกราฟเทียบ "ปีแรก vs ปีที่สอง" · ข้อมูลที่ไม่ใช่ 2 ปีพอดีต้องหยุดพร้อมบอกทางแก้ ไม่ใช่ล้มกลางทาง"""
    if len(years) != 2:
        raise SystemExit(f"สคริปต์นี้เทียบ 2 ปีพอดี แต่ข้อมูลมี {len(years)} ปี ({', '.join(map(str, years))}) — "
                         "กรองแถวให้เหลือ 2 ปีก่อน หรือแก้ F2 กับหัวกราฟให้เทียบปีที่ต้องการ")


def draw_share_chart(share, title, font, out):
    """กราฟเส้นสัดส่วนออนไลน์รายเดือน 1 รูป 1 ข้อความ · ฟอนต์ไทยมาจากไฟล์ ไม่พึ่งฟอนต์ในเครื่อง"""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib import font_manager

    font_manager.fontManager.addfont(font)
    thai = font_manager.FontProperties(fname=font).get_name()
    plt.rcParams["font.family"] = [thai, "DejaVu Sans"]     # Noto Sans Thai ไม่มีตัวเลขและละติน ให้ตัวที่ 2 รับแทน
    plt.rcParams["pdf.fonttype"] = 42                       # ฝังฟอนต์ TrueType เมื่อบันทึกเป็น PDF
    fig, ax = plt.subplots(figsize=(8, 4.5))
    ax.plot([thai_month(m) for m in share.index], share.values * 100, marker="o", color="#2f6db5")
    ax.set_title(title)                                      # หัวกราฟ = ข้อค้นพบ ไม่ใช่ชื่อตัวแปร
    ax.set_ylabel("สัดส่วนออนไลน์ (% ของยอดขายรวม)")      # หน่วยอยู่ที่แกน
    ax.tick_params(axis="x", labelrotation=90)
    ax.set_ylim(0, 100)
    fig.savefig(out, dpi=200, bbox_inches="tight")


def self_test():
    assert to_number("๑,๒๓๔") == 1234.0 and to_number("-") == 0.0 and to_number("") is None
    assert to_month("ม.ค. 2567") == pd.Timestamp(2024, 1, 1)
    require_two_years([2567, 2568])
    try:
        require_two_years([2566, 2567, 2568])
    except SystemExit as e:
        assert "3 ปี" in str(e)
    else:
        raise AssertionError("ข้อมูล 3 ปีต้องถูกปฏิเสธ")
    print("self-test ผ่าน 3/3")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("csv", nargs="?")
    parser.add_argument("--out", default=".")
    parser.add_argument("--font", help="ไฟล์ .ttf ฟอนต์ไทย เช่น Sarabun-Regular.ttf · ไม่ใส่ = ไม่วาดกราฟ")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    if not args.csv:
        parser.error("ต้องระบุไฟล์ CSV")

    raw, encoding = read_thai_csv(args.csv)
    df = pd.DataFrame({"month": raw["เดือน"].map(to_month),
                       "channel": raw["ช่องทาง"].str.strip(),
                       "sales": raw["ยอดขาย (บาท)"].map(to_number)})
    df["year"] = df["month"].dt.year + 543
    print(f"[ไฟล์] {Path(args.csv).name} · {encoding} · {len(df)} แถว · {df['channel'].nunique()} ช่องทาง · "
          f"{df['month'].nunique()} เดือน ({thai_month(df['month'].min())} – {thai_month(df['month'].max())})")

    missing, zero = df[df["sales"].isna()], df[df["sales"] == 0]
    print(f"[ว่าง] {len(missing)} แถว ไม่นับเป็น 0: " + ", ".join(f"{c} {thai_month(m)}" for c, m in zip(missing["channel"], missing["month"])))
    print(f"[ศูนย์] {len(zero)} แถว ยอด 0 จริง: " + ", ".join(f"{c} {thai_month(m)}" for c, m in zip(zero["channel"], zero["month"])))

    require_two_years(sorted(df["year"].unique()))

    # F1 · สัดส่วนออนไลน์ต่อปี (แถวว่างไม่ถูกนับ ยอดออนไลน์ปีที่มีช่องว่างจึงต่ำกว่าจริง)
    by_year = df.pivot_table(index="year", columns="channel", values="sales", aggfunc="sum")
    online_share = by_year[ONLINE].sum(axis=1) / by_year.sum(axis=1)
    print("[F1] สัดส่วนออนไลน์ (Shopee + LINE) ของยอดรวม: " + " · ".join(f"{y} = {s:.1%}" for y, s in online_share.items()))

    # F2 · หน้าร้าน เทียบเฉพาะเดือนที่เปิดทั้ง 2 ปี
    store = df[df["channel"] == "หน้าร้าน"].assign(m=lambda d: d["month"].dt.month).pivot_table(index="m", columns="year", values="sales")
    both = store[(store > 0).all(axis=1)]
    a, b = both.sum()
    print(f"[F2] หน้าร้าน {len(both)} เดือนที่เปิดทั้ง 2 ปี: {both.columns[0]} = {a:,.0f} บาท · {both.columns[1]} = {b:,.0f} บาท · เปลี่ยน {b / a - 1:+.1%}")

    # F3 · Shopee พึ่ง 2 เดือนแคมเปญแค่ไหน
    shopee = df[(df["channel"] == "Shopee") & (df["year"] == df["year"].max())]
    campaign = shopee[shopee["month"].dt.month.isin([11, 12])]["sales"].sum()
    print(f"[F3] Shopee ปี {df['year'].max()}: พ.ย. + ธ.ค. = {campaign:,.0f} บาท = {campaign / shopee['sales'].sum():.1%} ของทั้งปี")

    if args.font:
        monthly = df.pivot(index="month", columns="channel", values="sales")
        share = monthly[ONLINE].sum(axis=1) / monthly.sum(axis=1)
        share[monthly.isna().any(axis=1) | (monthly == 0).any(axis=1)] = None   # เดือนข้อมูลไม่ครบ = ช่องว่างในเส้น
        (y1, s1), (y2, s2) = online_share.items()
        out = Path(args.out) / "chart-f1-online-share.png"
        out.parent.mkdir(parents=True, exist_ok=True)
        draw_share_chart(share, f"สัดส่วนยอดขายออนไลน์เพิ่มจาก {s1:.0%} ({y1}) เป็น {s2:.0%} ({y2})", args.font, out)
        print(f"[กราฟ] {out.name} · เว้นช่อง {int(share.isna().sum())} เดือนที่ข้อมูลไม่ครบหรือร้านปิด")


if __name__ == "__main__":
    main()
