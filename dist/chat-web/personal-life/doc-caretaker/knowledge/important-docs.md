# skill: important-docs

Use when tracking ID card, passport, house, vehicle, insurance, contract or education papers, where each is kept and when it expires. Not product warranties.

# Important Docs Registry (ทะเบียนเอกสารสำคัญ)

Every critical document in one list, with where it is kept and when it expires.

Renewal rules for Thai documents and the fill-in CSV: [references/registry-template.md](references/registry-template.md).

## Scope

| Keeps here | Lives elsewhere |
|---|---|
| Identity — บัตรประชาชน, passport, ทะเบียนบ้าน, สูติบัตร, ทะเบียนสมรส/หย่า, ใบเปลี่ยนชื่อ | **Product warranties and receipts** → `warranty-tracker` (consumer-rights) if installed; otherwise rows with `section = warranty` in this same file |
| Property — โฉนด / น.ส.3, lease (สัญญาเช่า), condo juristic papers | Passwords, OTPs, recovery codes → password manager (`digital-hygiene`) |
| Vehicle — เล่มทะเบียนรถ, ใบขับขี่, พ.ร.บ., tax sticker | Medicine lists → `medication-schedule` (health-wellness) if installed |
| Insurance — life, health, home, car policies and schedules | |
| Contract — employment, loan, purchase, service contracts | |
| Education — ปริญญาบัตร, transcript, certificates, licences (ใบประกอบวิชาชีพ) | |
| Health — vaccine book, hospital cards (HN), blood group, living will (หนังสือแสดงเจตนา) | |

**One registry.** Warranty rows use the same columns (below), so the warranty table and this registry are one CSV — never two lists that drift apart.

## Shared columns (same as `warranty-tracker`)

```
section,item,holder,ref_no,issuer,start_date,end_date,extended_until,renew_lead_days,location,file,contact,amount,notes
```

| Column | Document use | Warranty use |
|---|---|---|
| section | identity / property / vehicle / insurance / contract / education / health | warranty |
| item | "Passport", "Car policy ชั้น 1" | "Refrigerator Brand Model" |
| holder | whose document | who uses the item |
| ref_no | **last 4 digits only** of ID, passport, policy, account numbers | serial number (not secret — full) |
| issuer | agency or insurer | shop / platform + order no. |
| start_date / end_date | issue / expiry (YYYY-MM-DD, ค.ศ.) | bought / warranty ends |
| extended_until | — | extended plan end |
| renew_lead_days | days of lead time needed (table in references) | 30 (test before it ends) |
| location | `physical: ตู้เอกสาร ลิ้นชัก 2` or `digital: Drive/Docs/ID/` | where the receipt and card are |
| file | scan file name | receipt photo file name |
| contact | agency phone / office | service centre phone |
| amount | renewal fee or premium | price paid |
| notes | renewal steps, who has the original | paid by, registered online, claims |

Dates on Thai papers are often พ.ศ. — subtract 543 before entering (2572 → 2029).

## Workflow

1. **Inventory sweep** — walk the seven sections above with the user, one household member at a time. Unknown dates → `unknown` and a question list.
2. **Scan and name** — `YYYY-MM-DD_holder_item.pdf` (date = issue date), one folder per section. Originals stay physical; the registry says where.
3. **Fill the CSV** — one row per document; ID and policy numbers last 4 only.
4. **Set lead time** — from the renewal table in references (passport 120 days before travel, ID card at expiry, vehicle tax 90 days).
5. **Renewal watch** — each monthly check lists rows where `end_date − today ≤ renew_lead_days`, plus fixed 60 / 30 / 7-day warnings, each with location and the renewal step.
6. **Gap check** — flag what this household should have but lacks (see list below).
7. **Emergency page** — print one page: who to call, where originals are, which insurer and policy last-4. Tell one trusted person where it is.

## Gap check (common misses)

- Renting with no move-in photos or no signed copy of the lease
- Car with พ.ร.บ. but no copy of the voluntary policy schedule
- Parents' documents nobody can find — ทะเบียนบ้าน, hospital card, land deed, any will (พินัยกรรม)
- Passport expiring within 6 months of a planned trip (see `travel-prep`)
- No scan of anything — fire, flood or theft takes the only copy

## Worked example

Household of two adults. Sweep finds 23 documents. Monthly check on 2026-10-06 shows:

| item | holder | end_date | lead | Warning |
|---|---|---|---|---|
| Passport | Nok | 2027-03-14 | 120 | Inside 6-month rule for the January Japan trip → book qpassport now; old book at `physical: ตู้เอกสาร ลิ้นชัก 2` |
| Car tax + พ.ร.บ. | Tom | 2026-11-30 | 90 | Can pay now (inside 90 days) — DLT app / ห้างที่รับชำระ |
| Health policy | Tom | 2026-12-01 | 30 | Premium notice due; compare before auto-renew |
| Air purifier (warranty) | Nok | 2026-11-20 | 30 | Test the unit this week while still covered |

## Rules

- Never store full ID, passport, account or policy numbers, passwords or OTPs — last 4 digits at most
- Expiry warnings always include location and the renewal step, not just a date
- The registry is updated in place; a second list is a bug
- Cadence: 5-minute monthly check, full sweep each January and after any move, marriage, birth or death

Related: `travel-prep` (passport timing) · `digital-hygiene` (where secrets go) · `warranty-tracker` in consumer-rights and `vehicle-care` in home-family, if installed.


## reference: registry-template.md

# Registry template and Thai renewal rules

## Contents

- Renewal rules for Thai documents
- CSV template (copy into `important-docs.csv`)
- Monthly check prompt

## Renewal rules for Thai documents

| Document | Validity | When to act | Where / how |
|---|---|---|---|
| บัตรประจำตัวประชาชน | 8 years, ends on the holder's birthday | Apply within 60 days after expiry; age 70+ not required to hold a new card | สำนักทะเบียนอำเภอ / เขต — bring the old card |
| Passport (หนังสือเดินทาง) | 5 years (1,000 บาท) or 10 years for age 20+ (1,500 บาท); express same-day 3,000 / 3,500 บาท | 120 days before a trip; many countries need 6 months left at entry | Book at qpassport.in.th; a new book is issued (no "renewal"); adults bring ID card + old passport; delivery by post 2–5 working days |
| ใบขับขี่ | First licence 2 years, then 5 years | Renew up to 6 months before expiry | กรมการขนส่งทางบก office or DLT Smart Queue app |
| ภาษีรถประจำปี + พ.ร.บ. | 1 year | Tax can be paid up to 90 days early (รอยืนยัน); พ.ร.บ. must be valid to pay tax | DLT e-service / app, ห้าง, ไปรษณีย์ — `vehicle-care` (home-family) if installed |
| Insurance policies | Usually 1 year (life: term of policy) | 30 days before — compare, do not auto-renew blind | Insurer app; premium certificate needed for tax |
| Lease (สัญญาเช่า) | Usually 1 year | 60 days — notice period is in the contract | Landlord |
| ทะเบียนบ้าน, สูติบัตร, ทะเบียนสมรส, โฉนด, เล่มทะเบียนรถ | No expiry | — | Record location; know the replacement office (อำเภอ/เขต, สำนักงานที่ดิน, ขนส่ง) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thaipbs.or.th/news/content/302339 · https://www.thairath.co.th/lifestyle/life/2859846 · https://www.sanook.com/campus/1432579/ · https://www.autospinn.com/2021/04/driver-s-license-82416

## CSV template

```csv
section,item,holder,ref_no,issuer,start_date,end_date,extended_until,renew_lead_days,location,file,contact,amount,notes
identity,บัตรประชาชน,Nok,…1234,อำเภอเมือง,2020-05-02,2028-05-01,,0,physical: wallet,2020-05-02_nok_idcard.pdf,[office phone],,
identity,Passport,Nok,…5678,กรมการกงสุล,2022-03-15,2027-03-14,,120,physical: ตู้เอกสาร ลิ้นชัก 2,2022-03-15_nok_passport.pdf,02-572-8442,1500,10-year book next time
vehicle,ภาษีรถ + พ.ร.บ.,Tom,กข 1234,กรมการขนส่งทางบก,2025-12-01,2026-11-30,,90,physical: car glovebox,2025-12-01_tom_car-tax.pdf,[office phone],,
insurance,Health policy,Tom,…9012,[insurer],2025-12-01,2026-12-01,,30,digital: Drive/Docs/Insurance/,2025-12-01_tom_health-policy.pdf,[insurer hotline],18500,premium cert for tax
warranty,Air purifier [brand model],Nok,SN-AB123456,[shop] order 123,2025-11-20,2026-11-20,,30,digital: Drive/Docs/Warranty/,2025-11-20_air-purifier_receipt.jpg,[service centre],5990,paid by credit card; registered online
```

Open in any spreadsheet; sort by `end_date`. Do not add columns per section — use `notes`.

## Monthly check prompt

> Read `important-docs.csv`. List rows where end_date minus today is within renew_lead_days, or within 60 / 30 / 7 days. For each give item, holder, days left, location, and the renewal step from the table. Then list rows with `unknown` dates.
