# Monthly bill tracker — template

Copy into a spreadsheet or a shared note. Use **one sheet (or one block of rows) per metered service**, one row per month, so the spike formula only ever compares the same service. Put the unit name in the column header and keep column D numbers only.

### Block 1 — ไฟฟ้า (header row = row 1)

| เดือน | ผู้ให้บริการ | จำนวนวันรอบบิล | หน่วยที่ใช้ (kWh) | ยอดเงิน (บาท) | ครบกำหนดชำระ | วิธีชำระ | ชำระแล้ว | หมายเหตุ |
|---|---|---|---|---|---|---|---|---|
| 2569-06 | กฟน. | 30 | 318 | | | หักบัญชี | ☐ | |
| 2569-07 | กฟน. | 31 | 305 | | | หักบัญชี | ☐ | |
| 2569-08 | กฟน. | 30 | 330 | | | หักบัญชี | ☐ | |
| 2569-09 | กฟน. | 30 | 352 | | | หักบัญชี | ☐ | |

### Block 2 — น้ำประปา (same layout; column D header = หน่วยที่ใช้ (ลบ.ม.), numbers only)

| เดือน | ผู้ให้บริการ | จำนวนวันรอบบิล | หน่วยที่ใช้ (ลบ.ม.) | ยอดเงิน (บาท) | ครบกำหนดชำระ | วิธีชำระ | ชำระแล้ว | หมายเหตุ |
|---|---|---|---|---|---|---|---|---|
| 2569-09 | กปน. | 31 | 22 | | | หักบัญชี | ☐ | |

### Block 3 — บิลที่ไม่มีหน่วยวัด (ยอดเงินอย่างเดียว ไม่ใช้สูตรเตือนข้างล่าง)

| เดือน | บริการ | ผู้ให้บริการ | ยอดเงิน (บาท) | ครบกำหนดชำระ | วิธีชำระ | ชำระแล้ว | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| 2569-09 | อินเทอร์เน็ตบ้าน | | | | บัตรเครดิต | ☐ | สัญญาหมด … |
| 2569-09 | มือถือ (พ่อ) | | | | | ☐ | |
| 2569-09 | มือถือ (แม่) | | | | | ☐ | |
| 2569-09 | ค่าส่วนกลาง | นิติบุคคล | | | | ☐ | |

## Spike flag formula (spreadsheet)

In Block 1 (units in column D, newest month in row 5, the three months before it in rows 2–4):

```
=IF(D5 > 1.2 * AVERAGE(D2:D4), "ตรวจ", "")
```

Compare units (column D), never baht — the Ft changes every four months. Copy the same formula down the block as rows are added (it then moves to the 3 rows above). Do not use it on Block 3.

## Account numbers to keep (once)

| บริการ | หมายเลขผู้ใช้ / CA | หมายเลขมิเตอร์ | ชื่อผู้ใช้ตามบิล | เบอร์แจ้งเหตุ |
|---|---|---|---|---|
| ไฟฟ้า | | | | 1130 (กฟน.) / 1129 (กฟภ.) |
| น้ำประปา | | | | 1125 (กปน.) / 1662 (กปภ.) |
| อินเทอร์เน็ต | | – | | |
