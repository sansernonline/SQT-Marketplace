# skill: household-bills

Use when reading an electricity or water bill (MEA, PEA, MWA, PWA, Ft), tracking bills, or a bill jumped.

# Household Bills (Thailand)

Know what each line on the bill means, log it every month, and catch a spike in the month it happens rather than 3 months later.

General information, not financial advice. Tariffs change — the utility's own page is the authority.

## Who bills you

| Service | Bangkok, Nonthaburi, Samut Prakan | Rest of the country | App to check and pay |
|---|---|---|---|
| Electricity | การไฟฟ้านครหลวง (กฟน. / MEA) | การไฟฟ้าส่วนภูมิภาค (กฟภ. / PEA) | MEA Smart Life · PEA Smart Plus |
| Water | การประปานครหลวง (กปน. / MWA) | การประปาส่วนภูมิภาค (กปภ. / PWA), or a local องค์การปกครองส่วนท้องถิ่น (อปท.) system | MWA onMobile · PWA 1662 |
| Internet / mobile | AIS, True/dtac, 3BB (now with AIS), NT | same | each operator's app |

## Reading an electricity bill

The bill (ใบแจ้งค่าไฟฟ้า) adds 4 parts:

1. **ค่าพลังงานไฟฟ้า** — units (หน่วย = kWh) × the tiered base tariff for your type (your tariff type is printed on the bill; the old residential split 1.1.1 / 1.1.2 may have changed with the new home tariff — รอยืนยัน)
2. **ค่าบริการ** — a fixed monthly service charge
3. **ค่า Ft** — units × the Ft rate for the current 4-month period (can be positive or negative)
4. **ภาษีมูลค่าเพิ่ม 7%** on the sum of 1–3

Units used = เลขอ่านครั้งนี้ − เลขอ่านครั้งก่อน. Check the two readings are printed and the reading date (วันที่จดเลขอ่าน) is roughly 30 days after the last one — a period of 33 days or more inflates the bill and can push units into a higher tier.

| Item | Current value | Applies |
|---|---|---|
| Ft rate | 16.23 สตางค์/หน่วย | งวด ก.ย.–ธ.ค. 2569 |
| Average all-in tariff, Ft period (base 3.78 + Ft, before VAT) | 3.95 บาท/หน่วย | งวด ก.ย.–ธ.ค. 2569 |
| Average all-in tariff, new tiered home tariff, all users | 3.86 บาท/หน่วย (≈ 4.13 incl. VAT 7%) | tiered tariff from Sep 2569 bills |
| Residential tier rates and service charge | (รอยืนยัน) — read your type's table on mea.or.th / pea.co.th | คณะกรรมการกำกับกิจการพลังงาน (กกพ.) announced a new progressive home tariff on 13 ส.ค. 2569 for bills from ก.ย. 2569; tier rates not checked (รอยืนยัน) |

ตรวจล่าสุด 2026-10-14 · แหล่ง: https://www.erc.or.th/th/news-release/3458 (ค่า Ft งวด ก.ย.–ธ.ค. 2569) · https://erc.or.th/th/news-release/3472 (อัตราแบบขั้นบันได 3.86) · https://www.naewna.com/business/979048

Ft is reset every 4 months (ม.ค.–เม.ย., พ.ค.–ส.ค., ก.ย.–ธ.ค.). When comparing months across a reset, compare **units**, not baht.

## Reading a water bill

ค่าน้ำประปา = units (ลูกบาศก์เมตร, ลบ.ม.) × progressive rate + ค่าบริการรายเดือน (by meter size, ½ inch for most homes) + VAT 7%. Rates differ between กปน. and กปภ. — use the rate table on the bill's back or mwa.co.th / pwa.co.th (รอยืนยัน for any figure you quote). A family of 4 in a house typically uses 15–30 ลบ.ม./month (รอยืนยัน — compare against your own last 6 months, which is the better baseline).

## Workflow

1. **Collect** the last 3–6 bills for each service (apps keep 12+ months of history)
2. **Log** each month in the tracker — [references/bill-tracker-template.md](references/bill-tracker-template.md)
3. **Set due dates** in the family calendar 3 days before each due date; note the disconnection date printed on the electricity bill (it is later than the due date — do not plan on it)
4. **Auto-debit** (หักบัญชีอัตโนมัติ) for fixed-ish bills: set it up in the bank app or the utility app; keep one account just for bills and check the debit on the statement each month
5. **Spike check** — if a bill is >20% above the 3-month average in units (20% is a default threshold, not measured), run the checklist below · do not compute the percentage by hand: `node power-bill.mjs --history scripts/example-history.json` (4 months of units, oldest first)
6. **Monthly review** — 5 minutes on the 5th of each month; totals feed `trading-finance` `personal-budget` (if installed)

## Spike investigation

| Step | Check | What it tells you |
|---|---|---|
| 1 | Units vs. last 3 months (not baht) | Rule out a Ft or tariff change |
| 2 | Billing period length | 33+ days inflates usage |
| 3 | Was it read or estimated? (จดเลขจริง vs. ประมาณการ) | An estimate is corrected next month |
| 4 | Season | April–May aircon load is often 30–60% higher than December |
| 5 | **Electricity leak test**: switch off every appliance, watch the meter for 10 minutes | Meter still turning = leakage or a hidden load — call a licensed electrician |
| 6 | **Water leak test**: close all taps at night, read the meter, read again in the morning | Any movement = leak (toilet cistern, buried pipe, tank float valve) |
| 7 | New appliance, guest, work-from-home, a pet heater, an old fridge | Load change |
| 8 | Aircon not cleaned for 6+ months | See `home-maintenance` |
| 9 | Still unexplained | Ask the utility to test the meter (ขอตรวจสอบมิเตอร์) — call 1130 (กฟน.), 1129 (กฟภ.), 1125 (กปน.), 1662 (กปภ.) |

## Script

`power-bill.mjs` computes the bill as (tiered energy + service charge + Ft × units) + VAT 7%. Given 2 months it says how much of the difference comes from more units, from units moving into a higher tier, and from a Ft change; the three add up to the difference (VAT included).

```
node power-bill.mjs <file.json> [--json]     # example file: scripts/example.json
node power-bill.mjs --history <file.json>    # latest month vs the 3 before it, units only; example: scripts/example-history.json
node power-bill.mjs --self-test
```

Input file: `{ "tiers": [ { "upTo": 150, "rate": 3.0 }, { "upTo": null, "rate": 5.0 } ], "service": 25, "months": [ { "label": "Apr", "units": 330, "ft": 39.72 } ] }` · `rate` is baht/unit, `upTo` is the cumulative unit limit (last tier `null`), `ft` is satang/unit. One month = a bill; two months = a comparison. A bad field stops the script with a message naming it.

`scripts/rates.json` holds only what this file lists with a source: the Ft rate (16.23 สตางค์, ก.ย.–ธ.ค. 2569, checked 2026-10-14) and VAT. The tier rates and service charge are still (รอยืนยัน) above, so **you must pass `tiers` and `service` from the back of the user's bill**; the script stops and says so if they are missing. When the Ft period changes, pass `ft` in the file or update `rates.json`. `scripts/example.json` uses made-up tier rates, not real tariffs.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/personal-life/*/skills/household-bills/scripts/power-bill.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/personal-life/skills/household-bills/scripts/power-bill.mjs` · Node only, no dependencies.

The output is information; check it against the printed bill before acting.

## Worked example

A Bangkok house used 412 units in May against 318 / 305 / 330 in Feb–Apr (average 318). 412 / 318 = +30% → spike. Billing period 30 days, read not estimated. Night leak test: meter still. May is peak heat and 2 aircons were last cleaned 9 months ago. Action: clean both aircons (see `home-maintenance`), set them to 26 °C, re-check June units. June came in at 352 — the residual over April is seasonal.

## Internet and mobile

- List every line with the contract end date (สัญญาขั้นต่ำ) — early cancellation fees apply before it
- After the contract ends, call the operator's retention line and ask for the current promotion; a 30–40% reduction is common for a re-signed plan (รอยืนยัน, varies)
- Remove unused add-ons (data packs, content subscriptions charged to the mobile bill — check \*137 style SMS services)

## Related

`home-maintenance` · `trading-finance` `personal-budget` (if installed) · `important-docs` (keep the meter number, electricity customer number CA/รหัสผู้ใช้ไฟ, and water account number there)


## reference: bill-tracker-template.md

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
