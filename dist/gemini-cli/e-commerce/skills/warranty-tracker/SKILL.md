---
name: warranty-tracker
description: Use when filing receipts and warranty cards, checking if an item is covered, or preparing a claim.
---

# Warranty Tracker

A warranty is worth nothing if you cannot find the receipt on the day the item breaks.

General information, not legal advice.

## The registry

One CSV (opens in any spreadsheet) for everything over about 1,000 baht or with a warranty. It uses **the same columns as `important-docs` in `personal-life`**, so if that skill is installed the rows go into the same `important-docs.csv` with `section = warranty` — one file, not two. Without it, keep `warranties.csv` with these columns; it can be merged later by copy-paste.

```
section,item,holder,ref_no,issuer,start_date,end_date,extended_until,renew_lead_days,location,file,contact,amount,notes
warranty,Refrigerator [brand] [model],Home,[serial no.],[store] order 123,2026-08-12,2027-08-12,,30,digital: Drive/Docs/Warranty/,2026-08-12_fridge_receipt.pdf,[call centre],18990,compressor to 2031; paid by credit card; registered online
```

| Column | What goes in it |
|---|---|
| item | item + brand + model |
| ref_no | serial number (full — it is not a secret) |
| issuer | shop or platform + order number |
| start_date / end_date | bought on / manufacturer warranty ends (YYYY-MM-DD) |
| extended_until | extended plan end, if any |
| renew_lead_days | 30 — test the item before the warranty ends |
| location / file | where the paper receipt and warranty card are / receipt photo file |
| contact | authorised service centre phone |
| amount | price paid |
| notes | paid by (card, cash), registered online?, longer part warranties, claim history |

File name pattern: `YYYY-MM-DD_item_type.ext` (receipt, warranty-card, serial-photo).

For the monthly check, filter or grep the rows with `end_date` in the next 60 days instead of reading the whole file.

## Receipt-photo habit (do it at the counter or on unboxing day)

1. Photo the **receipt / tax invoice** flat, all corners visible — thermal paper fades within months.
2. Photo the **serial number label** and the **warranty card**.
3. Screenshot the **online order page** (price, seller name, date) — sellers sometimes edit listings later.
4. Register the product online if the brand offers it; screenshot the confirmation.
5. Add one row to the registry; store the files in one folder.
6. Calendar reminder 30 days before the warranty ends — check for faults while still covered.

## What the law gives you anyway

Even without a warranty card, the seller is liable for defects that existed at delivery and make the item unfit for normal use (ป.พ.พ. มาตรา 472, ความชำรุดบกพร่อง). A lawsuit over the defect is barred once **1 year has passed from discovering the defect** (มาตรา 474) — so a complaint that drags on must not run past that date without filing. Unsafe products causing injury or damage are covered by the พ.ร.บ.ความรับผิดต่อความเสียหายที่เกิดขึ้นจากสินค้าที่ไม่ปลอดภัย พ.ศ. 2551.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://legardy.com/thai-law/civil-commercial/civil-and-commercial-section474 · https://www.thailawonline.com/th/thai-civil-code/section-474/
ข้อความมาตราจากเว็บรอง 2 แหล่ง — ตรวจกฎหมายฉบับทางการ: krisdika.go.th (สำนักงานคณะกรรมการกฤษฎีกา) · ocpb.go.th — ยังไม่ได้เปิดตรวจข้อความทางการ (รอยืนยัน)

The manufacturer's warranty is a contract on top of this — read what it excludes (water damage, "misuse", installation by non-authorised technicians, consumables).

## Making a claim

1. Check the registry: date, warranty end, receipt.
2. Record the fault: video showing the problem, date first noticed.
3. Contact the authorised service centre (not only the shop) — get a **job/ticket number**.
4. When handing over: get a **receipt for the item** listing condition, accessories, and serial number. Photo the item before handover.
5. Ask the expected repair time in writing. Note every call (date, name, what was said).
6. Repeated failure of the same fault (e.g. 3 repairs) → ask in writing for replacement or refund; if refused → `complaint-letter-th`.

## Extended warranty — decision rule

Buy only when a repair would hurt the budget **and** chance of failure x covered repair cost > plan price (no chance figure → plan under about 10–15% of item price, or `decision-scoring` `payoff` minimax regret) **and** it covers what actually fails. Full rule, skip conditions and the laptop example → [references/extended-warranty.md](references/extended-warranty.md).

## Monthly check (5 minutes)

- Anything bought this month not in the registry?
- Any warranty ending in the next 60 days → test the item now.

Related: `buy-compare` · `complaint-letter-th` · `refund-request` · `important-docs` in `personal-life`.
