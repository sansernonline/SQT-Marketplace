<!-- merged from skill `important-docs` on 2026-11-27 · description was: Use when tracking ID and document expiry dates -->
# Important Docs Registry (ทะเบียนเอกสารสำคัญ)

Every critical document in one list, with where it is kept and when it expires.

Renewal rules for Thai documents and the fill-in CSV: [references/registry-template.md](registry-template.md).

## Scope

| Keeps here | Lives elsewhere |
|---|---|
| Identity — บัตรประชาชน, passport, ทะเบียนบ้าน, สูติบัตร, ทะเบียนสมรส/หย่า, ใบเปลี่ยนชื่อ | **Product warranties and receipts** → `buyer-help` (e-commerce) if installed; otherwise rows with `section = warranty` in this same file |
| Property — โฉนด / น.ส.3, lease (สัญญาเช่า), condo juristic papers | Passwords, one-time passwords (OTPs), recovery codes → password manager (`digital-hygiene`) |
| Vehicle — เล่มทะเบียนรถ, ใบขับขี่, พ.ร.บ., tax sticker | Medicine lists → `health-admin` |
| Insurance — life, health, home, car policies and schedules | |
| Contract — employment, loan, purchase, service contracts | |
| Education — ปริญญาบัตร, transcript, certificates, licences (ใบประกอบวิชาชีพ) | |
| Health — vaccine book, hospital cards (hospital number, HN), blood group, living will (หนังสือแสดงเจตนา) | |

**One registry.** Warranty rows use the same columns (below), so the warranty table and this registry are one CSV — never two lists that drift apart.

## Shared columns (same as `buyer-help`)

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
2. **Scan and name** — `YYYY-MM-DD_holder_item.ext` (e.g. `2020-05-02_nok_idcard.pdf`; date = issue date), one folder per section. Originals stay physical; the registry says where.
3. **Fill the CSV** — one row per document; ID and policy numbers last 4 only.
4. **Set lead time** — from the renewal table in references (passport 120 days before travel, ID card at expiry, vehicle tax 90 days).
5. **Renewal watch** — do not count days by hand. Write the rows as JSON (`end_date` in YYYY-MM-DD, พ.ศ. or ค.ศ.; `lead_days` from step 4) and run `node skills/family-legal/scripts/due-dates.mjs <file.json>` (example: `scripts/example-docs.json`). It sorts by days left and marks each row เลยกำหนด / ต้องทำตอนนี้ (`end_date − today ≤ lead_days`) / ยังไม่ถึง. Add the fixed 60 / 30 / 7-day warnings, each with location and the renewal step.
6. **Gap check** — flag what this household should have but lacks (see list below).
7. **Emergency page** — print one page: who to call, where originals are, which insurer and policy last-4. Tell one trusted person where it is.

## Gap check (common misses)

- Renting with no move-in photos or no signed copy of the lease
- Car with พ.ร.บ. but no copy of the voluntary policy schedule
- Parents' documents nobody can find — ทะเบียนบ้าน, hospital card, land deed, any will (พินัยกรรม)
- Passport expiring within 6 months of a planned trip (see `travel-prep`)
- No scan of anything — fire, flood or theft takes the only copy

## Rules

- Never store full ID, passport, account or policy numbers, passwords or OTPs — last 4 digits at most
- Expiry warnings always include location and the renewal step, not just a date
- Cadence: 5-minute monthly check, full sweep each January and after any move, marriage, birth or death

## References

- [`registry-template.md`](registry-template.md) — renewal rules for Thai documents and the fill-in CSV
- [`worked-example.md`](important-docs/worked-example.md) — open for a model monthly check
