# SPEC · calc_receipt

`calc_receipt(items, *, vat_mode="exclusive", discount_pct=0, withholding_pct=0) -> dict`

- `items` = list ของ dict `{"name": str, "qty": int, "unit_price": Decimal | str | int}`
- เงินทุกค่าเป็น `Decimal` ปัด 2 ตำแหน่งแบบ ROUND_HALF_UP **ทุกครั้งที่คำนวณแต่ละค่า** (ไม่ปัดตอนท้ายครั้งเดียว)

| กฎ | รายละเอียด |
|---|---|
| R1 | ยอดต่อบรรทัด = qty × unit_price (ปัด) · `subtotal` = ผลรวมยอดต่อบรรทัด |
| R2 | `discount` = subtotal × discount_pct / 100 (ปัด) · `net` = subtotal − discount |
| R3 | `vat_mode="exclusive"` → `vat` = net × 7 / 100 (ปัด) · `total` = net + vat · ฐานภาษี `base` = net |
| R4 | `vat_mode="inclusive"` → `total` = net · `vat` = net × 7 / 107 (ปัด) · `base` = net − vat |
| R5 | `withholding` (หัก ณ ที่จ่าย) = base × withholding_pct / 100 (ปัด) · `pay` = total − withholding |
| R6 | ข้อมูลผิด → `ValueError`: items ว่าง · qty ไม่ใช่จำนวนเต็มบวก · unit_price ติดลบ · pct นอกช่วง 0–100 · vat_mode อื่น |

คืน dict ที่มีคีย์ `subtotal · discount · net · vat · total · base · withholding · pay` ครบทุกตัว
รัน test: `python -m pytest -q`
