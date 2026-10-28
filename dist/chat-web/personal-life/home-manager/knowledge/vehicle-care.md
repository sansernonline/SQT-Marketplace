# skill: vehicle-care

Use when a Thai family owns a car or motorbike (compulsory insurance, annual tax, inspection, servicing).

# Vehicle Care (Thailand)

One date drives everything: the tax expiry date on the windscreen tax disc (ป้ายวงกลม). พ.ร.บ. must be valid before tax can be paid, and older vehicles need a สถานตรวจสภาพรถเอกชน (ตรอ.) pass first. พ.ร.บ. here means พระราชบัญญัติคุ้มครองผู้ประสบภัยจากรถ (พ.ร.บ.), the compulsory motor insurance.

General information, not legal or insurance advice — กรมการขนส่งทางบก (Department of Land Transport, DLT; dlt.go.th, call 1584) and สำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย (คปภ.; oic.or.th, call 1186) are the authorities.

## The yearly chain

```
ตรอ. inspection (if old enough) → พ.ร.บ. renewed → pay annual tax → new ป้ายวงกลม on windscreen
```

| Item | Rule | Number |
|---|---|---|
| Pay annual tax early | up to 90 days before expiry | 90 วัน |
| ตรอ. inspection required before tax | private car (and private pickup) aged 7 full years (ครบ 7 ปี) or more, motorbike 5 full years or more — counted from the first registration date to the tax expiry date; inspection can be done up to 90 days ahead (DLT page, confirmed 2026-10-26) | 7 ปี / 5 ปี |
| ตรอ. inspection also required | any vehicle whose tax is overdue more than 1 year (stated on the DLT page; no second source — รอยืนยัน) | ค้าง > 1 ปี |
| Inspection fee at a private ตรอ. | sources conflict: the DLT page (2559) says car ≤1,600 kg empty weight 150 บาท, >1,600 kg 250, motorbike 60; KTC (2569) says ≤2,000 kg 200, >2,000 kg 300, motorbike 60, and some stations charge motorbikes 100–150 (รอยืนยัน; tell the user the amount is not confirmed and to ask the station) | varies by ตรอ. |
| Late tax surcharge | 1% per month of the tax due | 1%/เดือน |
| Tax unpaid over 3 years | registration cancelled (ระงับทะเบียน); return plates and book, pay up to 3 years back + surcharge, re-register | 3 ปี |
| พ.ร.บ. premium | private car ≤7 seats 645.21 บาท/ปี; private motorbike ≤75 cc 161.57 · 75–125 cc 323.14 · 125–150 cc 430.14 · >150 cc 645.21 (sellers and banks agree; no OIC premium table found — รอยืนยัน) | |
| พ.ร.บ. cover | **Paid at once, no fault needed (ค่าเสียหายเบื้องต้น):** medical up to 30,000 บาท/คน; death or permanent disability 35,000. **After fault is settled:** medical up to 80,000; death or total permanent disability 500,000; loss of organs 200,000–500,000; inpatient 200 บาท/วัน up to 20 days; total up to 504,000/คน. A driver at fault gets the initial amount only (คปภ. order 51/2568, confirmed 2026-10-26) | |

ตรวจล่าสุด 2026-10-26 · แหล่ง: คปภ. คำสั่งนายทะเบียน 51/2568 https://www.oic.or.th/web-upload/1xff0d34e409a13ef56eea54c52a291126/202508/m_news/217/69225/file_download/cdc3a5e370cf49e506d383261f6d0eb7.pdf · DLT https://nma.dlt.go.th/th/m_page_1679 · https://www.ktc.co.th/article/knowledge/things-car-owner-over-7-years-should-know-atpb · https://www.thansettakij.com/news/general-news/579209

## Ways to pay annual tax

- **Online:** DLT Vehicle Tax app / eservice.dlt.go.th — tax disc arrives by post. Older cars: inspect at ตรอ. first; the result is sent electronically
- **ตรอ. that accept tax** (ชำระภาษีที่ ตรอ.) — inspection, พ.ร.บ. and tax in one stop
- **Shop Thai / counter service** (เลื่อนล้อเสียภาษี and convenience-store channels) — for vehicles that do not need inspection (รอยืนยัน which stores currently accept)
- **ขนส่ง office** or **drive-thru** (ช่องทางพิเศษ Drive Thru for Tax)

Bring: registration book copy (สำเนาเล่มทะเบียน), valid พ.ร.บ., ตรอ. result if required. If the book is with a finance company, a copy is enough.

## Voluntary insurance (ประกันภัยภาคสมัครใจ)

| Class | Own car damage, with another vehicle | Own car, single-vehicle crash (hits a pole) | Fire & theft | Third party | Fits |
|---|---|---|---|---|---|
| ชั้น 1 | ✔ | ✔ | ✔ | ✔ | New car, on finance (lender usually requires it), inexperienced driver |
| ชั้น 2+ | ✔ (with an identified other vehicle) | ✘ | ✔ | ✔ | 4–10-year-old car, experienced driver |
| ชั้น 3+ | ✔ (with an identified other vehicle) | ✘ | ✘ | ✔ | Older car, low theft risk |
| ชั้น 2 | ✘ | ✘ | ✔ | ✔ | |
| ชั้น 3 | ✘ | ✘ | ✘ | ✔ | Cheapest legal-liability top-up to พ.ร.บ. |

### Compare insurance quotes by numbers (`decision-scoring`, command `score`)

1. **Iron rules (กฎเหล็ก):** insurer not licensed on oic.or.th · sum insured above the car's market value (you pay for cover you cannot collect) · class below what the lender requires. Put them in `must`.
2. **Criteria (default weights, starting value, not yet measured, the user changes them):** premium per year, baht (low, 0.35) · excess per claim, baht (low, 0.20) · claim service 1–5 from the user's own reading of reviews and the garage list (high, 0.25) · garage type 1–5 (อู่ห้าง = 5, high, 0.20). Use quotes with the same sum insured and the same drivers.
3. **Run:** `node decide.mjs score insurance.json`. Unstable or close (`ยังไม่นิ่ง`, `สูสี`) → the user decides. Insurance money is the user's decision; the score is supporting data.
4. **Class step-up has a direct formula, no script:** ชั้น 1 is worth it over ชั้น 2+ when `extra premium per year < chance of a single-vehicle claim per year × average repair cost`. The chance comes from the user's own history (starting value, not yet measured; ask, do not guess).

Compare quotes on: sum insured (ทุนประกัน — not above market value), excess/deductible (ค่าเสียหายส่วนแรก), garage type (อู่ห้าง dealer vs. อู่ประกัน network), named drivers, roadside assistance. Check the insurer is licensed on oic.or.th.

## Before buying a car (compare 5-year cost)

Same method as the insurance quotes, with `decision-scoring` command `score`: copy [references/buy-car-score-example.json](references/buy-car-score-example.json) (made-up numbers) and put in the real quotes.

1. **Iron rule (กฎเหล็ก):** monthly instalment above the limit the user set before looking at cars → dropped, not scored (the example uses 12,000 baht). Also dropped: no licensed lender or dealer (check the dealer and any lender on official registers, not on the seller's word).
2. **Total cost over 5 years, in baht, per option:** instalments + interest + insurance + annual tax + servicing + fuel − resale value at year 5. The user fills each part from quotes and the maintenance table below; resale value is the user's estimate (default, not measured; ask a dealer in writing). Never invent a price or a loan rate: loan rates and car prices change, so every figure comes from the user's own quote.
3. **Criteria (default weights, starting value, not yet measured):** total cost 5 years (low, 0.50) · instalment per month (low, 0.20) · size and seats for the family 1–5, user's score (high, 0.20) · service centre near home 1–5, user's score (high, 0.10).
4. **Run:** `node decide.mjs score car.json`. Unstable or close (`ยังไม่นิ่ง`, `สูสี`) → the user decides. Buying a car is a one-way door (hard to undo): also log it in `decision-journal`.

## Maintenance by distance

Follow the owner's manual first; this is the common pattern for a petrol passenger car (รอยืนยัน against your manual):

| Every | Job |
|---|---|
| 1 month | Tyre pressure (on the door-pillar sticker), coolant level, wiper fluid |
| 10,000 km or 6 months (fully synthetic: up to 10,000–15,000) | Engine oil + filter |
| 20,000 km | Air filter, cabin (aircon) filter — sooner in Bangkok dust |
| 40,000 km / 2 years | Brake fluid, spark plugs (non-iridium), check brake pads |
| 40,000–60,000 km | Automatic transmission fluid / CVT fluid (per manual) |
| 2–3 years | 12 V battery — Thai heat shortens life; test before the long holiday trip |
| 4–5 years or tread < 1.6 mm | Tyres — check the DOT date code on the sidewall |
| 100,000 km | Timing belt (if belt, not chain) |

Motorbike: oil every 1,000–3,000 km by manual, chain slack and lube monthly, brake shoes, tyres.

## Driving licence (ใบอนุญาตขับรถ)

| Licence | Valid | Renew |
|---|---|---|
| ชั่วคราว (temporary) | 2 years | change to the 5-year licence; apply up to 6 months before expiry (รอยืนยัน with DLT) |
| 5 ปี | 5 years | renew up to 6 months before expiry, any licence type (รอยืนยัน with DLT); online training via DLT e-Learning, then visit to verify |

If the licence has already expired (the same bands apply to both types; รอยืนยัน with DLT):

| Expired for | What you need |
|---|---|
| Up to 1 year | Physical tests + 1-hour training (can be online); no written or driving test |
| 1–3 years | Physical tests + training + the written test again; no driving test |
| Over 3 years | Physical tests + 5-hour training + written test + driving test, almost like a new licence |

ตรวจล่าสุด 2026-10-22 · แหล่ง: https://www.ktc.co.th/article/knowledge/driving-license-expired-over-a-year-atpb · https://www.grab.com/th/blog/driver/ใบขับขี่หมดอายุ/ · https://www.autospinn.com/2021/04/driver-s-license-82416 (3 secondary sources agree on 6 months; the DLT site did not load on the check date, so the numbers stay รอยืนยัน) — confirm the current steps on dlt.go.th or the DLT Smart Queue app before going.

## Workflow

1. **Record each vehicle** in the table in [references/vehicle-record.md](references/vehicle-record.md) — plate, first registration date, tax expiry, พ.ร.บ. expiry, voluntary policy expiry, licence expiry for each driver
2. **Compute:** inspection needed this year? Take the full age on the tax expiry date, counted from the first registration date (not just year minus year): 7 full years or more for cars / 5 or more for motorbikes, or tax overdue more than 1 year → yes
3. **Calendar:** reminder 90 days before tax expiry and 30 days before every policy and licence expiry
4. **Quote** voluntary insurance 45 days before expiry — at least 3 quotes, same sum insured and excess
5. **Service** — log odometer at each service; next service = whichever comes first, km or months

## Worked example

Honda City first registered 15 Feb 2018, tax expires 14 Feb 2027. On the tax expiry date (14 Feb 2027) the car is 8 full years old → ตรอ. needed. Plan: book ตรอ. mid-Dec 2026 (inside the 90-day window from 16 Nov 2026), renew พ.ร.บ. 645.21 บาท at the same ตรอ., pay tax there or online. Voluntary policy: car is 8 years old, market value has fallen → compare ชั้น 2+ against ชั้น 1 with the step-up formula above: for example extra premium 4,000/year against a 10% yearly chance of a 30,000 repair = 3,000 expected, so ชั้น 2+ is cheaper on average (the 10% and 30,000 are assumed figures; use the user's).

## Related

`home-maintenance` (one calendar for house and cars) · `household-bills` · `important-docs` (registration book, policies, licences) · `trading-finance` `personal-budget` (if installed)


## reference: vehicle-record.md

# Vehicle and licence record

## Vehicles

| ทะเบียน | ยี่ห้อ/รุ่น | จดทะเบียนครั้งแรก | ภาษีหมดอายุ | ต้องตรวจ ตรอ.? | พ.ร.บ. หมดอายุ | ประกันภาคสมัครใจ (ชั้น/บริษัท/หมดอายุ) | เล่มทะเบียนอยู่ที่ |
|---|---|---|---|---|---|---|---|
| | | | | ☐ | | | ☐ บ้าน ☐ ไฟแนนซ์ |

## Service log

| วันที่ | เลขไมล์ (km) | งาน | อู่ | ค่าใช้จ่าย | นัดครั้งต่อไป (km / วันที่) |
|---|---|---|---|---|---|
| | | | | | |

## Drivers

| ชื่อ | ประเภทใบขับขี่ (รถยนต์/จักรยานยนต์) | ชนิด (ชั่วคราว/5 ปี) | หมดอายุ | เตือนล่วงหน้า |
|---|---|---|---|---|
| | | | | 30 วันก่อน |

## Accident card (keep in the glovebox)

- Insurer claim line: ______ · Policy no.: ______
- พ.ร.บ. policy no.: ______
- Emergency 191 (police) · 1669 (ambulance) · 1193 (ตำรวจทางหลวง)
- At the scene: photos of all cars, plates, road, damage; do not move vehicles before photos unless blocking traffic and safe; wait for the insurer's surveyor (เคลมสด)
