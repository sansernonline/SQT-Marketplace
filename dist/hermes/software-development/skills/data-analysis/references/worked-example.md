# Worked example · data-analysis section 9

**Data:** `assets/sales-sample.csv` is sample data made by `assets/make_sample.py`, not real sales. It has 72 rows (24 months × 3 channels) and all the usual Thai-file problems: "ม.ค. 2567" · "1,295,500" · Thai digits in the LINE rows for 2025 (B.E. 2568) · 3 blank rows · 1 `-` row. Years in the sample are B.E.: 2567 = 2024 and 2568 = 2025.

**Question:** should ad budget move from the shop to online? (section 1)

**Run:** download `Sarabun-Regular.ttf` from google/fonts into `fonts/` first, then run `python assets/analyse_sales.py assets/sales-sample.csv --out _to_delete/sales --font fonts/Sarabun-Regular.ttf > output.txt`

```text
[ไฟล์] sales-sample.csv · utf-8-sig · 72 แถว · 3 ช่องทาง · 24 เดือน (ม.ค. 2567 – ธ.ค. 2568)
[ว่าง] 3 แถว ไม่นับเป็น 0: LINE มี.ค. 2568, LINE เม.ย. 2568, LINE พ.ค. 2568
[ศูนย์] 1 แถว ยอด 0 จริง: หน้าร้าน ส.ค. 2568
[F1] สัดส่วนออนไลน์ (Shopee + LINE) ของยอดรวม: 2567 = 36.3% · 2568 = 48.0%
[F2] หน้าร้าน 11 เดือนที่เปิดทั้ง 2 ปี: 2567 = 13,177,600 บาท · 2568 = 11,951,900 บาท · เปลี่ยน -9.3%
[F3] Shopee ปี 2568: พ.ย. + ธ.ค. = 2,514,900 บาท = 27.0% ของทั้งปี
[กราฟ] chart-f1-online-share.png · เว้นช่อง 4 เดือนที่ข้อมูลไม่ครบหรือร้านปิด
```

**Findings in the report**

1. Online sales rose from 36.3% to 48.0% of the total `[F1]`. The figure for 2025 (B.E. 2568) is still lower than real, because LINE has no sales for 3 months `[ว่าง]`.
2. The shop fell 9.3%, from 13,177,600 to 11,951,900 baht, comparing only the 11 months it was open in both years `[F2]`. In August 2025 the shop was closed, so that month is not counted `[ศูนย์]`.
3. Shopee got 27.0% of the whole year's sales from November and December `[F3]`. So the online ad budget should follow the campaign rounds, not be spread evenly over every month (`อนุมาน`).

**Limits:** 24 months of data from one shop, and no customer ID, so it cannot say that people who used to buy at the shop moved to buying online.

**Check:** a recount with plain `csv` gave 36.3 · 48.0 · −9.3 · 27.0, matching on every one. The same file saved as cp874 and re-run gave the same F1–F3 results. The chart was opened and "เพิ่ม" has all its tone marks on matplotlib 3.11.2 (ตรวจจริง 2026-10-23 · pandas 3.0.3 and 3.1.0).
