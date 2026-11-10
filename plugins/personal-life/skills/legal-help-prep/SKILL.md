---
name: legal-help-prep
description: Use when the user has a dispute (rent, deposit, debt, neighbour, unpaid wages) and prepares to see a lawyer or agency (ปรึกษาทนาย, ร้องเรียน).
---

# Legal Help Prep (เตรียมเรื่องก่อนไปหาทนายหรือหน่วยงาน)

> **One rule:** put the facts, papers and dates in order; never say who will win. The output is a brief the user carries to a lawyer or an agency, not advice on what the law says about their case.

General information, not legal advice (ข้อมูลทั่วไป ไม่ใช่คำปรึกษากฎหมาย). A free first meeting with a lawyer or an agency goes much further when the user arrives with one page of facts, the documents in order and every date written down.

## Use when / not when

| Situation | Use |
|---|---|
| Landlord keeps the deposit · a debt collector calls · a neighbour dispute · unpaid wages · received a letter from a lawyer or the court · "จะไปปรึกษาทนาย ต้องเตรียมอะไร" | this skill |
| Faulty product, refund refused, unknown card charge | `refund-request` (e-commerce, if installed) — it has its own complaint ladder |
| Reading or drafting a contract or lease | `doc-contract-th` (e-commerce, if installed) |
| Laid off or asked to resign | `job-exit` first, then this skill for the visit |
| A death in the family, inheritance, a will | `estate-and-will` |
| Debt plan, which debt to pay first | `debt-payoff` (trading-finance, if installed) |
| Danger to someone's safety right now | call the police emergency line first; this skill can wait |

## 1 · Let the user tell it in their own words first

Ask for the story as it happened, in order, before sorting it into legal boxes. Then ask only what is missing: who, when, how much, what was signed, what was said in writing.

## 2 · Facts table

| # | Fact | Where it comes from | Paper | Status |
|---|---|---|---|---|
| 1 | Paid deposit 2 months, 16,000 บาท | lease clause 4 · transfer slip | have | ✓ |
| 2 | Returned the keys 2026-10-31 | LINE message to the owner | have (screenshot) | ✓ |
| 3 | Owner says the wall was damaged | owner's message 2026-11-02 | photos of the room on move-out day | need to find |

One fact per row. "Where it comes from" is a document, a message or a person, never "I think". Facts the user is unsure of stay in the table marked `ยังไม่แน่ใจ`.

## 3 · How urgent

- **ด่วน (today–3 days):** court papers or a summons received · a police letter · an eviction or seizure date · a deadline printed on a letter within 7 days.
- **ทันเวลา (this month):** a deadline exists but is weeks away · the other side has stopped answering.
- **ปกติ:** nothing dated yet.

Court and police papers always go to a lawyer or the legal-aid line the same week, even when the user thinks the claim is wrong.

## 4 · Deadline block for `important-docs`

Every date that matters becomes one row in the `important-docs` registry (CSV, same columns as there):

```csv
section,item,holder,ref_no,issuer,start_date,end_date,extended_until,renew_lead_days,location,file,contact,amount,notes
contract,"ยื่นคำให้การ คดีเงินประกันห้อง",ตัวเอง,,ศาลแขวง…,2026-11-10,[ตรวจ],,14,digital: Drive/Legal/,summons.pdf,ทนายอาสา,,"วันครบกำหนดต้องให้ทนายนับจากหมาย · เตือน 14/7/3/1 วัน"
```

- **Never compute a legal deadline for the user.** A date that has to be counted from an event (served a summons, received a letter) is written `[ตรวจ]` with the event and its date, and the lawyer or agency fills it in. A wrong count here can lose the case.
- **Run the reminder script only after the real date is in.** `due-dates.mjs` reads JSON, not the CSV, and stops on a date like `[ตรวจ]`. Once the lawyer or agency gives the date, write it the way `important-docs` step 5 does and run `node skills/important-docs/scripts/due-dates.mjs <file.json>`:

  ```json
  { "items": [ { "name": "ยื่นคำให้การ คดีเงินประกันห้อง", "end_date": "2026-11-25", "lead_days": 14 } ] }
  ```
  (`end_date` above is an example; use the date the lawyer gives.)
- Warnings at 14, 7, 3 and 1 days before; who is responsible in `holder`. This differs on purpose from the 60 / 30 / 7-day warnings in `important-docs` step 5: those suit renewals known months ahead, while a legal deadline is usually set only weeks away, so a 60- or 30-day warning would already be past and the last few days matter most.

## 5 · Contact log

Every call, visit and message, newest at the bottom:

| Date | Channel | With whom | Summary (2–4 sentences) | Who does what next | Follow up on |
|---|---|---|---|---|---|
| 2026-11-10 | phone | สคบ. officer (name) | Explained the deposit case; told to send a written demand first | user sends demand letter | 2026-11-17 |

Keep the reference number an agency gives. Never write ID or account numbers in full; the last 4 digits are enough.

## 6 · Where to take it

| Where | For | Contact | Checked |
|---|---|---|---|
| สภาทนายความ (Lawyers Council), legal aid | Free help for people who cannot afford a lawyer or who were treated unfairly; volunteer lawyers at police stations. Income and case rules not found on the page (รอยืนยัน) | hotline **1167** · 02-522-7124 to 27 · lawyerscouncil.or.th/services | ✓ 2026-11-10 |
| สำนักงานอัยการสูงสุด, legal aid by public prosecutors | Legal advice line; may take a request for further help after the advice | hotline **1157** · ago.go.th/oagservice · app อัยการช่วยได้ | ✓ 2026-11-10 |
| ศูนย์ดำรงธรรม (complaint centre, Ministry of Interior) | Complaints about local officials, public nuisance, cases no other agency takes | **1567** (free call) | ✓ 2026-11-10 |
| สคบ. (Office of the Consumer Protection Board) | Consumer disputes; register to complain online and keep the reference number | **1166** · complaint.ocpb.go.th · LINE @ocpbconnect | ✓ 2026-11-10 |
| กรมสวัสดิการและคุ้มครองแรงงาน | Unpaid wages, severance (form คร.7) | **1546** — details in `job-exit` section 6 | ✓ 2026-11-10 |
| กองทุนยุติธรรม (Justice Fund, Ministry of Justice) | Said to help with lawyer fees, court fees and bail | official page did not open; the 1111 ext. 77 line seen only in news (รอยืนยัน) | ✗ |

Sources, viewed 2026-11-10: https://www.lawyerscouncil.or.th/services · https://www.ago.go.th/oagservice/ · https://damrongdham.moi.go.th/news/7197a0f8-11b9-40f2-99bd-e820564ec9b1 · https://www.ocpb.go.th/faqs.php · https://complaint.ocpb.go.th/ · https://www.labour.go.th. Pick the place by the kind of dispute; when unsure, start with 1167 or 1157 and bring this brief.

## 7 · What this brief does not do

End every brief with these lines, so the user and the next reader know its limits:

- ไม่ได้ประเมินว่าใครถูกหรือจะชนะ
- ไม่ได้คำนวณอายุความหรือวันครบกำหนดทางกฎหมาย (ช่อง `[ตรวจ]` ให้ทนายหรือเจ้าหน้าที่กรอก)
- ไม่ใช่การรับเป็นคดี และไม่ใช่คำปรึกษากฎหมาย

## Worked example

`ตัวอย่าง` The landlord of a 6-room building keeps a 16,000 บาท deposit and claims wall damage. Story first, then the facts table (5 rows, 1 marked `ยังไม่แน่ใจ`: whether photos were taken on move-out day — found later in the phone gallery). Urgency: ทันเวลา (no court paper). Consumer-type rental rules and the demand-letter ladder → `refund-request` and `moving-house` (deposit section); this skill adds the contact log and the deadline row with `[ตรวจ]` for any date counted from the demand letter. Brief ends with the "does not do" lines.

## Check before sending

- [ ] The story came from the user before any sorting
- [ ] Every fact has a source and a paper status
- [ ] No legal deadline computed; counted dates are `[ตรวจ]`
- [ ] Every hotline and agency has an official link and check date, or `(รอยืนยัน)`
- [ ] The "does not do" lines and "not legal advice" are present

## Source

Ideas from anthropics/claude-for-legal `legal-clinic/skills/client-intake`, `legal-clinic/skills/deadlines` and `legal-clinic/skills/client-comms-log` (Apache-2.0, rewritten for a person preparing their own case in Thailand, viewed 2026-11-10).
