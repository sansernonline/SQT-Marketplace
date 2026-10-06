---
name: important-docs
description: Use at year start, when something expired unnoticed, or a document is needed fast — one registry of ID, passport, property, vehicle, insurance, contract, education and health papers with where each lives and when it expires.
---

# Important Docs Registry (ทะเบียนเอกสารสำคัญ)

Everything critical, indexed, with a death date and a place.

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
