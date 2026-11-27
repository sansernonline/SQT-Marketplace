# skill: family-legal

Use for inheritance, a will, a dispute or ID and document expiry

# family-legal — inheritance, legal visits and document registry

> **One rule:** Give the steps, the papers and the facts in order. Never say who will win a dispute, and never work out a legal deadline for the user.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Someone died and there is inheritance, or I want to write a will" | [`references/estate-and-will.md`](references/estate-and-will.md) |
| "I got a letter from a court or a lawyer, or a dispute with a landlord, debtor or neighbour" | [`references/legal-help-prep.md`](references/legal-help-prep.md) |
| "Keep a list of IDs, insurance, warranties and when each one expires" | [`references/important-docs.md`](references/important-docs.md) |

The estate checklist is in `references/estate-checklist.md`. The registry template is in `references/registry-template.md`.

## Check before done

- This is general information, not legal advice. Disputes, land, foreign heirs and an estate near 100 million baht go to a lawyer (ทนายความ) or the legal aid line of the Lawyers Council (สภาทนายความ).
- Never compute a legal deadline. A date that counts from an event (a summons, a letter, a death) is written `[ตรวจ]`, and the lawyer or agency fills it in.
- Court and police papers go to a lawyer or the legal aid line in the same week, even if the user thinks the claim is wrong.
- Never store a full ID number, passport number, account number, password or one-time password (OTP). Last 4 digits at most.
- Estate lists are kept private. Share a copy without numbers with the other heirs.
- A whole document or estate job with several steps → playbook `superuser/references/playbook-documents.md`.


## reference: estate-and-will.md

<!-- merged from skill `estate-and-will` on 2026-11-27 · description was: Use when a Thai family faces inheritance or a will -->
# Estate and Will (Thailand)

> **One rule:** give the order of steps and the legal frame, never a ruling on who wins a dispute. Disputes, land worth fighting over, foreign heirs or an estate near 100 million baht go to a lawyer (ทนายความ) or the สภาทนายความ legal aid line.

General information, not legal advice. Thai law here is the Civil and Commercial Code (ประมวลกฎหมายแพ่งและพาณิชย์, ป.พ.พ.) Book 6 and the Inheritance Tax Act (พ.ร.บ.ภาษีการรับมรดก พ.ศ. 2558). The authorities are the อำเภอ/เขต registrar (death, wills), the ศาลแพ่ง or provincial court (executor) and กรมสรรพากร (tax).

## Use when / not when

| Situation | Use |
|---|---|
| A family member just died: what to do and in what order | this skill |
| Who inherits when there is no will | this skill |
| Making or storing a will | this skill |
| Keeping the papers afterwards (title deeds, bank books, policies) | `important-docs.md` |
| Life insurance claim, insurer refuses | `retirement-and-insurance` (trading-finance, if installed) |
| Contract or lease left behind | `thai-business-docs` (e-commerce, if installed) |
| Heirs disagree, someone hides assets, land in dispute | a lawyer — this skill only lists the facts to bring |

## After a death — first 30 days

1. **Notify the death within 24 hours** to the กำนัน/ผู้ใหญ่บ้าน or the registrar (อำเภอ/เขต/เทศบาล) where it happened. At home: the house owner (เจ้าบ้าน) reports; elsewhere: whoever was with the person or found them. Bring the reporter's ID card, the house registration (ทะเบียนบ้าน), the doctor's certificate (ท.ร.4/1) if any, and a police report if the death was not natural. The registrar issues the death certificate (มรณบัตร); no fee. A hospital death: the hospital gives ท.ร.4/1 and most people notify the next working day.
2. **Remove the name from the house registration** — usually done in the same step; if not, take the เจ้าบ้าน copy of ทะเบียนบ้าน, ID card and มรณบัตร to the registrar for that house.
3. **Copy the มรณบัตร 10+ times** — banks, land office, insurers, social security and the court each keep one.
4. **Find a will** — at home, with the lawyer, and ask the อำเภอ/เขต if a will was deposited there.
5. **List the estate** in one table: land and buildings (title deed number), bank accounts, funds and shares, vehicles, gold, debts and loans, insurance policies (policies paid to a named beneficiary are not part of the estate (รอยืนยัน with the insurer)). Template: [references/estate-checklist.md](estate-checklist.md).
6. **Claim what is time-limited first** — social security death grant (ประกันสังคม 1506), employer and provident fund, life insurance, funeral support schemes (ฌาปนกิจสงเคราะห์) — ask each for its own deadline.
7. **Decide whether you need an executor** (below), then transfer assets.

## Who inherits without a will — statutory heirs (ทายาทโดยธรรม, มาตรา 1629)

| Class | Who |
|---|---|
| 1 | Descendants (children; a dead child's children step in) |
| 2 | Parents |
| 3 | Full siblings |
| 4 | Half siblings |
| 5 | Grandparents |
| 6 | Uncles and aunts |

- **A nearer class shuts out the later ones** (มาตรา 1630) — with one exception: when class 1 is alive, living parents share as if they were a child (รอยืนยัน — check มาตรา 1630 on krisdika.go.th).
- **The surviving spouse** is an heir outside the 6 classes (มาตรา 1635 · share rules รอยืนยัน). First the spouse takes back half of the marital property (สินสมรส); then the dead person's share is split. Spouse's share of that: equal to one child when there are descendants · one half with parents or full siblings · two thirds with half siblings, grandparents or uncles and aunts · everything when no other heir. Only a **registered** marriage counts (รอยืนยัน — secondary sources only).

## Making a will (พินัยกรรม)

Age 15 full years or more; a will made younger is void.

| Form | How | Note |
|---|---|---|
| Ordinary written (มาตรา 1656) | Typed or written, dated, signed in front of 2 witnesses present together, who sign too | Most common; keep the original safe |
| Holograph (มาตรา 1657) | Whole text, date and signature in the person's own hand | A fingerprint or seal does not count as a signature |
| Public document (มาตรา 1658) | Made at the อำเภอ/เขต office in front of officials and 2 witnesses | Fee 50 บาท at the office, 100 outside (กฎกระทรวง 2503 — รอยืนยัน current fee) |
| Secret (มาตรา 1660) | Signed, sealed and lodged with the นายอำเภอ | Fee 20 บาท (รอยืนยัน) |
| Oral (มาตรา 1663) | Only in danger of death, epidemic or war; 2 witnesses report to the นายอำเภอ at once | Lapses 1 month after the person can again make another form (มาตรา 1664, รอยืนยัน) |

- **Who cannot witness** (มาตรา 1670): minors, people of unsound mind or under a court incompetency order, people deaf, mute or blind in both eyes. A beneficiary or their spouse who witnesses loses the gift (มาตรา 1653).
- **Name an executor** in the will and a backup. A will can be deposited at the อำเภอ/เขต (fee 20 บาท, รอยืนยัน).
- The user drafts; a lawyer checks before signing if there is land, a business, children from more than one marriage, or heirs abroad.

## Executor (ผู้จัดการมรดก)

- Named in the will, or appointed by the court on petition of an heir, an interested person or the public prosecutor (อัยการ, when there is an obstacle and no dispute) (มาตรา 1711, 1713). Minors, people of unsound mind and bankrupts cannot serve (มาตรา 1718).
- Court fee 200 บาท (Phra Khanong Civil Court FAQ 2565 — รอยืนยัน current fee); a certificate that the order is final can be asked for about 1 month after the order.
- Whether you need one depends on the bank or land office. A land office can transfer to heirs **without** an executor after a 30-day public notice (news report 2569, รอยืนยัน with กรมที่ดิน); many banks ask for a court order above their own limit — ask the branch.
- The executor should finish and account within 1 year (มาตรา 1732, รอยืนยัน).
- **Deadlines that bar claims** (มาตรา 1754, รอยืนยัน): heirs and creditors generally have 1 year from knowing of the death; 10 years from death is the absolute cap. Do not sit on it.

## Inheritance tax (ภาษีการรับมรดก)

- Taxed only on the part **above 100 million บาท per heir per dead person** (net of inherited debts) — most families pay nothing (มาตรา 12).
- Rate 10%, or 5% for parents, grandparents, children and grandchildren (มาตรา 16). A spouse is outside the Act (มาตรา 3(2)).
- Over the threshold: file ภ.ม.60 and pay **within 150 days of receiving** (มาตรา 17); instalments up to 5 years can be asked for.
- The threshold is reviewed every 5 years and can change by royal decree.

## References

- [`estate-checklist.md`](estate-checklist.md) — estate list template (step 5)
- [`worked-example.md`](worked-example.md) — open for a no-will case with a wife, 3 children and a living mother
- [`sources.md`](sources.md) — sources and check date 2026-10-26 for the legal frame, fees and deadlines

## Check before sending

- [ ] Every step has who, where and what to bring
- [ ] Shares shown as a rule, with the "ask a lawyer" line when there is a dispute or land
- [ ] Every fee and deadline has its (รอยืนยัน) label kept — the user is told which ones are not yet confirmed
- [ ] No guess about what a disputed will "means"

Related: `important-docs.md` · `family-care` (talk about a will early) · `trading-finance` `income-tax-th` (if installed)


## reference: estate-checklist.md

# Estate checklist — one table for the family

Fill one row per item. Keep the file private (ID numbers and account numbers are in it); share a copy without numbers with the other heirs.

## Papers to gather

- [ ] มรณบัตร (death certificate) — original + 10 copies
- [ ] ทะเบียนบ้าน with the name removed
- [ ] ID card of the dead person (returned to the registrar or kept as told)
- [ ] ทะเบียนสมรส of the spouse, ทะเบียนหย่า if any
- [ ] สูติบัตร or ทะเบียนบ้าน of each heir (proves the relationship)
- [ ] The will, if any (original), and where it was found or deposited
- [ ] Title deeds (โฉนด), condo titles (หนังสือกรรมสิทธิ์ห้องชุด), vehicle books, bank books, fund and share statements
- [ ] Loan contracts, credit cards, guarantees (ค้ำประกัน) — debts pass with the estate up to its value
- [ ] Insurance policies, provident fund, social security number, employer contact

## Estate table

| Item | Number (deed, account, plate) | Where held | Approx. value | Marital property? | Named beneficiary? | Needs executor? | Status |
|---|---|---|---|---|---|---|---|
| | | | | yes / no / ask | yes / no | ask the bank/office | เสร็จ · ทำอยู่ · ติด · ค้างอยู่ |

## Deadlines to diary

| What | Deadline | Note |
|---|---|---|
| Death notification | 24 hours | Registrar where the death happened |
| Inheritance tax (only if one heir gets over 100 million บาท) | 150 days from receiving | ภ.ม.60 |
| Claims against the estate | 1 year from knowing of the death, 10 years cap (รอยืนยัน) | มาตรา 1754 |
| Insurance, social security, provident fund | ask each | Each has its own limit |


## reference: important-docs.md

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


## reference: legal-help-prep.md

<!-- merged from skill `legal-help-prep` on 2026-11-27 · description was: Use when facing a dispute or court summons -->
# Legal Help Prep (เตรียมเรื่องก่อนไปหาทนายหรือหน่วยงาน)

## Contents

- [Use when / not when](#use-when--not-when)
- [1 · Let the user tell it in their own words first](#1--let-the-user-tell-it-in-their-own-words-first)
- [2 · Facts table](#2--facts-table)
- [3 · How urgent](#3--how-urgent)
- [4 · Deadline block for `family-legal`](#4--deadline-block-for-family-legal)
- [5 · Contact log](#5--contact-log)
- [6 · Where to take it](#6--where-to-take-it)
- [7 · What this brief does not do](#7--what-this-brief-does-not-do)
- [Worked example](#worked-example)
- [Check before sending](#check-before-sending)
- [References](#references)

> **One rule:** put the facts, papers and dates in order; never say who will win. The output is a brief the user carries to a lawyer or an agency, not advice on what the law says about their case.

**When the user asks straight out** "นับวันให้หน่อย" or "จะชนะไหม": say in one line that you do not count legal deadlines or predict the result, and why (a wrong count can lose the case; the result depends on evidence a judge weighs). Then give what does help: the urgency from section 3 (court papers → a lawyer this week), the facts table from section 2, the deadline row with `[ตรวจ]`, and a free legal-aid line from section 6. No pros-and-cons list of the case either; that is a forecast by another name.

General information, not legal advice (ข้อมูลทั่วไป ไม่ใช่คำปรึกษากฎหมาย).

## Use when / not when

| Situation | Use |
|---|---|
| Landlord keeps the deposit · a debt collector calls · a neighbour dispute · unpaid wages · received a letter from a lawyer or the court · "จะไปปรึกษาทนาย ต้องเตรียมอะไร" | this skill |
| Faulty product, refund refused, unknown card charge | `buyer-help` (e-commerce, if installed) — it has its own complaint ladder |
| Reading or drafting a contract or lease | `thai-business-docs` (e-commerce, if installed) |
| Laid off or asked to resign | `career-growth` first, then this skill for the visit |
| A death in the family, inheritance, a will | `estate-and-will.md` |
| Debt plan, which debt to pay first | `budget-and-debt` (trading-finance, if installed) |
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

## 4 · Deadline block for `important-docs.md`

Every date that matters becomes one row in the `important-docs.md` registry (CSV, same columns as there):

```csv
section,item,holder,ref_no,issuer,start_date,end_date,extended_until,renew_lead_days,location,file,contact,amount,notes
contract,"ยื่นคำให้การ คดีเงินประกันห้อง",ตัวเอง,,ศาลแขวง…,2026-11-10,[ตรวจ],,14,digital: Drive/Legal/,summons.pdf,ทนายอาสา,,"วันครบกำหนดต้องให้ทนายนับจากหมาย · เตือน 14/7/3/1 วัน"
```

- **Never compute a legal deadline for the user.** A date that has to be counted from an event (served a summons, received a letter) is written `[ตรวจ]` with the event and its date, and the lawyer or agency fills it in. A wrong count here can lose the case.
- **Run the reminder script only after the real date is in.** `due-dates.mjs` reads JSON, not the CSV, and stops on a date like `[ตรวจ]`. Once the lawyer or agency gives the date, write it the way `important-docs.md` step 5 does and run `node skills/family-legal/scripts/due-dates.mjs <file.json>`:

  ```json
  { "items": [ { "name": "ยื่นคำให้การ คดีเงินประกันห้อง", "end_date": "2026-11-25", "lead_days": 14 } ] }
  ```
  (`end_date` above is an example; use the date the lawyer gives.)
- Warnings at 14, 7, 3 and 1 days before; who is responsible in `holder`. This differs on purpose from the 60 / 30 / 7-day warnings in `important-docs.md` step 5: those suit renewals known months ahead, while a legal deadline is usually set only weeks away, so a 60- or 30-day warning would already be past and the last few days matter most.

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
| กรมสวัสดิการและคุ้มครองแรงงาน | Unpaid wages, severance (form คร.7) | **1546** — details in `career-growth` → `references/job-exit.md` section 6 | ✓ 2026-11-10 |
| กองทุนยุติธรรม (Justice Fund, Ministry of Justice) | Said to help with lawyer fees, court fees and bail | official page did not open; the 1111 ext. 77 line seen only in news (รอยืนยัน) | ✗ |

Pick the place by the kind of dispute; when unsure, start with 1167 or 1157 and bring this brief.

## 7 · What this brief does not do

End every brief with these lines, so the user and the next reader know its limits:

- ไม่ได้ประเมินว่าใครถูกหรือจะชนะ
- ไม่ได้คำนวณอายุความหรือวันครบกำหนดทางกฎหมาย (ช่อง `[ตรวจ]` ให้ทนายหรือเจ้าหน้าที่กรอก)
- ไม่ใช่การรับเป็นคดี และไม่ใช่คำปรึกษากฎหมาย

## Worked example

`ตัวอย่าง` The landlord of a 6-room building keeps a 16,000 บาท deposit and claims wall damage. Story first, then the facts table (5 rows, 1 marked `ยังไม่แน่ใจ`: whether photos were taken on move-out day — found later in the phone gallery). Urgency: ทันเวลา (no court paper). Consumer-type rental rules and the demand-letter ladder → `buyer-help` and `home-upkeep` (deposit section); this skill adds the contact log and the deadline row with `[ตรวจ]` for any date counted from the demand letter. Brief ends with the "does not do" lines.

## Check before sending

- [ ] The story came from the user before any sorting
- [ ] Every fact has a source and a paper status
- [ ] No legal deadline computed; counted dates are `[ตรวจ]`
- [ ] Every hotline and agency has an official link and check date, or `(รอยืนยัน)`
- [ ] The "does not do" lines and "not legal advice" are present

## References

- [`sources.md`](legal-help-prep/sources.md) — open to re-check dated figures, prices and rules, and their sources


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
| ภาษีรถประจำปี + พ.ร.บ. | 1 year | Tax can be paid up to 90 days early (รอยืนยัน); พ.ร.บ. must be valid to pay tax | DLT e-service / app, ห้าง, ไปรษณีย์ — `home-upkeep` |
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


## reference: sources.md

# Sources · estate-and-will

ตรวจล่าสุด 2026-10-26 · แหล่ง: กรมการปกครอง ทะเบียนพินัยกรรม https://www.bora.dopa.go.th/wp-content/uploads/2024/01/4.pdf · คู่มือ 1548 https://callcenter1548.bora.dopa.go.th/wp-content/uploads/2025/09/250108.pdf · พ.ร.บ.ภาษีการรับมรดก 2558 https://www.rd.go.th/fileadmin/user_upload/kormor/newlaw/deathduty.pdf · https://www.rd.go.th/56657.html · ศาลแพ่งพระโขนง https://civilpkc.coj.go.th/th/content/category/detail/id/22/iid/294474 · ป.พ.พ. wording from legardy.com (krisdika.go.th did not open on the check date, so section shares and deadlines without an official page stay รอยืนยัน)


## reference: worked-example.md

# Worked example · estate-and-will

## Worked example

Father died at home in Nonthaburi, no will. Wife (registered), 3 children, his mother alive. Steps: the eldest notifies the เทศบาล the same day, gets the มรณบัตร, copies it 10 times. Estate list: house (bought during the marriage), 1.2 million บาท in savings. The wife first takes half of both as her marital share. The father's half splits between class 1 (3 children) and his mother (shares as a child under มาตรา 1630) and the wife (one child's share under มาตรา 1635): 5 equal shares. The bank asks for a court order, so the wife petitions to be executor (200 บาท fee). No inheritance tax — far below 100 million.
