---
name: household-bills
description: Use when reading an electricity or water bill (MEA, PEA, MWA, PWA) or Ft charge, tracking utility, internet and mobile bills, or finding why a bill jumped.
---

# Household Bills (Thailand)

Know what each line on the bill means, log it every month, and catch a spike in the month it happens rather than 3 months later.

General information, not financial advice. Tariffs change — the utility's own page is the authority.

## Who bills you

| Service | Bangkok, Nonthaburi, Samut Prakan | Rest of the country | App to check and pay |
|---|---|---|---|
| Electricity | การไฟฟ้านครหลวง (กฟน. / MEA) | การไฟฟ้าส่วนภูมิภาค (กฟภ. / PEA) | MEA Smart Life · PEA Smart Plus |
| Water | การประปานครหลวง (กปน. / MWA) | การประปาส่วนภูมิภาค (กปภ. / PWA), or a local อปท. system | MWA onMobile · PWA 1662 |
| Internet / mobile | AIS, True/dtac, 3BB (now with AIS), NT | same | each operator's app |

## Reading an electricity bill

The bill (ใบแจ้งค่าไฟฟ้า) adds 4 parts:

1. **ค่าพลังงานไฟฟ้า** — units (หน่วย = kWh) × the tiered base tariff for your type (residential ประเภท 1.1.1 ≤150 units/month on a ≤5 A meter, 1.1.2 above that)
2. **ค่าบริการ** — a fixed monthly service charge
3. **ค่า Ft** — units × the Ft rate for the current 4-month period (can be positive or negative)
4. **ภาษีมูลค่าเพิ่ม 7%** on the sum of 1–3

Units used = เลขอ่านครั้งนี้ − เลขอ่านครั้งก่อน. Check the two readings are printed and the reading date (วันที่จดเลขอ่าน) is roughly 30 days after the last one — a 35-day period inflates the bill and can push units into a higher tier.

| Item | Current value | Applies |
|---|---|---|
| Ft rate | 16.23 สตางค์/หน่วย | งวด ก.ย.–ธ.ค. 2569 |
| Average all-in tariff (base 3.78 + Ft, before VAT) | 3.95 บาท/หน่วย | งวด ก.ย.–ธ.ค. 2569 |
| Residential tier rates and service charge | (รอยืนยัน) — read your type's table on mea.or.th / pea.co.th | กกพ. was consulting in 2569 on a new progressive rate for the first 200 units (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.erc.or.th (ประกาศค่า Ft งวด ก.ย.–ธ.ค. 2569), https://www.naewna.com/business/979048

Ft is reset every 4 months (ม.ค.–เม.ย., พ.ค.–ส.ค., ก.ย.–ธ.ค.). When comparing months across a reset, compare **units**, not baht.

## Reading a water bill

ค่าน้ำประปา = units (ลูกบาศก์เมตร, ลบ.ม.) × progressive rate + ค่าบริการรายเดือน (by meter size, ½ inch for most homes) + VAT 7%. Rates differ between กปน. and กปภ. — use the rate table on the bill's back or mwa.co.th / pwa.co.th (รอยืนยัน for any figure you quote). A family of 4 in a house typically uses 15–30 ลบ.ม./month (รอยืนยัน — compare against your own last 6 months, which is the better baseline).

## Workflow

1. **Collect** the last 3–6 bills for each service (apps keep 12+ months of history)
2. **Log** each month in the tracker — [references/bill-tracker-template.md](references/bill-tracker-template.md)
3. **Set due dates** in the family calendar 3 days before each due date; note the disconnection date printed on the electricity bill (it is later than the due date — do not plan on it)
4. **Auto-debit** (หักบัญชีอัตโนมัติ) for fixed-ish bills: set it up in the bank app or the utility app; keep one account just for bills and check the debit on the statement each month
5. **Spike check** — if a bill is >20% above the 3-month average in units, run the checklist below
6. **Monthly review** — 5 minutes on the 5th of each month; totals feed `trading-finance` `personal-budget`

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

## Worked example

A Bangkok house used 412 units in May against 318 / 305 / 330 in Feb–Apr (average 318). 412 / 318 = +30% → spike. Billing period 30 days, read not estimated. Night leak test: meter still. May is peak heat and 2 aircons were last cleaned 9 months ago. Action: clean both aircons (see `home-maintenance`), set them to 26 °C, re-check June units. June came in at 352 — the residual over April is seasonal.

## Internet and mobile

- List every line with the contract end date (สัญญาขั้นต่ำ) — early cancellation fees apply before it
- After the contract ends, call the operator's retention line and ask for the current promotion; a 30–40% reduction is common for a re-signed plan (รอยืนยัน, varies)
- Remove unused add-ons (data packs, content subscriptions charged to the mobile bill — check \*137 style SMS services)

## Related

`home-maintenance` · `trading-finance` `personal-budget` · `personal-life` `important-docs` (keep the meter number, electricity customer number CA/รหัสผู้ใช้ไฟ, and water account number there)
