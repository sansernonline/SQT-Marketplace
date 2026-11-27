# skill: thai-business-docs

Use when issuing a Thai quotation, invoice, letter, memo or contract

# thai-business-docs — quotations, formal letters and contracts

> **One rule:** every field comes from a real fact, and any risky clause is flagged for a Thai lawyer, never removed without saying so.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Issuing a Thai quotation, invoice or receipt | [references/doc-quotation.md](references/doc-quotation.md) |
| Drafting a formal Thai letter or memo | [references/doc-thai-official.md](references/doc-thai-official.md) |
| Drafting or checking a Thai contract | [references/doc-contract-th.md](references/doc-contract-th.md) |

Other files in this folder: `fields-and-example.md` (required fields for each document), `clause-checklists.md`, `chasing-overdue.md`, `script.md`, `templates.md` and `doc-thai-official/templates.md`. Scripts: `scripts/thai-doc-total.mjs`.

## Steps every part shares

1. Pick the document type and check the required fields in `references/fields-and-example.md`.
2. Fill each field from the seller's own data; write `(รอยืนยัน)` for anything missing.
3. Run `scripts/thai-doc-total.mjs` for any total with VAT, so the sums are not typed by hand.

## Check before done

- General information, not legal or tax advice. A Thai lawyer (ทนายความ) reviews every clause marked `[ให้ทนายตรวจ]` before anyone signs.
- A business that is not VAT-registered never shows VAT or the words ใบกำกับภาษี.
- No blank or guessed date on a document; every date is written in full.
- A red-flag clause stays in the draft with its `[ให้ทนายตรวจ]` mark, never removed quietly.
- The company's accountant (นักบัญชี) has the final word on tax documents.

Whole job with several steps → playbook [business-doc](../superuser/references/playbook-business-doc.md).


## reference: chasing-overdue.md

# Chasing overdue invoices (ตามหนี้ลูกค้าเครดิต) · doc-quotation

Open when the user asks to chase overdue invoices from several credit customers (B2B buyers, resellers, agents), at month end or billing day. One awkward message to one customer → `human-writing/polite-message-th-en` (plugin `superuser`), whose tone ladder the levels below follow. Process from Anthropic's invoice-chase skill (`anthropics/knowledge-work-plugins` small-business, Apache-2.0, read 2026-11-10), rewritten for Thai sellers; no text copied.

## Levels

| Level | When | Message (LINE, the channel sellers actually use) |
|---|---|---|
| 1 Reminder | just past due, or a good payer | invoices, total, due dates, "หากชำระแล้วขออภัยและรบกวนส่งสลิปให้ด้วยนะคะ" + PromptPay QR for the total (`shop-books`) |
| 2 Second request | about 2 weeks later, or a sometimes-late payer | same facts + ask for the date they will pay; offer to split a large amount |
| 3 Before stopping supply | still unpaid after level 2 | same facts + the date after which credit sales pause, only if the owner will really do it; a formal demand letter if the owner decides (`doc-thai-official.md`) |

## Rules for every level

- State facts and the next step. Never threaten, insult, shame, or tell anyone else about the debt (family, staff, a group chat, a public post). Never write the debt on the outside of an envelope.
- A business whose normal trade is giving credit may fall under the Debt Collection Act B.E. 2558 (พ.ร.บ.การทวงถามหนี้), which limits contact times, how often you contact, and what you may say (รอยืนยัน whether your shop is covered and the current rules, with a lawyer).
- Late-payment interest: if the contract sets no rate, default interest under the Civil and Commercial Code ม.224 is **5% a year** since 11 Apr 2564 (ม.7 rate 3% a year), per the Bank of Thailand, checked 2026-11-10: [bot.or.th article 3 Jul 2564](https://www.bot.or.th/th/research-and-publications/articles-and-publications/articles/Article_3Jul2021.html). Mention it only after level 2, and only if the owner wants to claim it.
- How long the shop can still sue for an unpaid sale (prescription) is limited by law (รอยืนยัน the period with a lawyer); do not let an invoice sit for years.


## reference: clause-checklists.md

# Clause checklists

Contents: 1. Employment (สัญญาจ้างแรงงาน) · 2. Lease (สัญญาเช่า) · 3. Hire of work / services (สัญญาจ้างทำของ)

Tick each item. `{…}` = must be filled. [ให้ทนายตรวจ] = a lawyer must review.

## 1. สัญญาจ้างแรงงาน

- [ ] Parties: employer (company name, tax ID, authorised signer), employee (name, ID card, address)
- [ ] Position, duties summary, workplace; right to transfer only within reason
- [ ] Start date; probation period (most companies use ≤ 119 days; severance counts from day one anyway)
- [ ] Wage, pay date(s) at least monthly; allowances; bonus is discretionary unless stated
- [ ] Working days and hours (normal ≤ 8 h/day, ≤ 48 h/week), breaks, OT by consent at legal rates
- [ ] Weekly rest day, traditional holidays (≥ 13 incl. วันแรงงาน), annual leave — numbers from `thai-employment`
- [ ] Leave types and procedure — refer to company work rules (ข้อบังคับเกี่ยวกับการทำงาน) and `thai-employment`
- [ ] Social security, provident fund (if any), withholding tax
- [ ] Confidentiality; IP created in the job belongs to employer
- [ ] [ให้ทนายตรวจ] Non-compete / non-solicit (limit field, area, 6–12 months)
- [ ] [ให้ทนายตรวจ] Deposit or guarantor
- [ ] Personal data notice for HR data (`pdpa-workflow`)
- [ ] Termination: notice of 1 pay period (ม.17), severance per law, grounds without severance (ม.119)
- [ ] Return of company property; final pay within 3 days of termination
- [ ] Signatures, date, 2 witnesses; 1 original for each party

## 2. สัญญาเช่า

- [ ] Lessor (owner or authorised — check title deed / condo title, power of attorney)
- [ ] Property: address, title deed number, area, furniture list with photos (annex)
- [ ] Term, start date, renewal option and notice; [ให้ทนายตรวจ] over 3 years → register at the land office
- [ ] Rent, due date, late fee (reasonable), payment channel
- [ ] Deposit amount, what it covers, refund timeline and inspection procedure
- [ ] Utilities: who pays; residential business landlords may not mark up state electricity/water rates
- [ ] Repairs: lessee minor, lessor structural; access with notice
- [ ] No sublease or assignment without written consent (ม.544)
- [ ] Use restrictions (business type, pets, signage) and licences
- [ ] Termination for breach with written notice and cure period
- [ ] Return condition, normal wear and tear excluded
- [ ] Who pays stamp duty; WHT 5% if lessee is a company paying an individual or company lessor
- [ ] Signatures, 2 witnesses, copies of ID / company certificate attached

## 3. สัญญาจ้างทำของ / บริการ

- [ ] Scope and deliverables specific enough to test (annex: spec, drawings, SOW)
- [ ] Timeline and milestones; what counts as delivered; acceptance test and days to accept
- [ ] Price, VAT stated, WHT 3%, milestone payments, retention (e.g. 5–10% until warranty ends)
- [ ] Change request procedure and pricing
- [ ] Materials: who supplies; risk until delivery
- [ ] Defects liability / warranty period (e.g. 1 year), response time
- [ ] [ให้ทนายตรวจ] Delay penalty — realistic daily rate and a cap
- [ ] IP ownership on full payment; licence for pre-existing tools
- [ ] Confidentiality; personal data processing terms if contractor touches customer data (`pdpa-workflow`)
- [ ] Subcontracting only with consent
- [ ] Termination for convenience (with payment for work done) and for breach
- [ ] Insurance if work is on site
- [ ] Stamp duty by contractor; signatures; 2 witnesses


## reference: doc-contract-th.md

<!-- merged from skill `doc-contract-th` on 2026-11-27 · description was: Use when drafting or checking a Thai contract -->
# Thai Basic Contract Draft

This skill gives a complete first draft and flags every risky clause. It is general information, not legal advice. A Thai lawyer (ทนายความ) reviews anything flagged [ให้ทนายตรวจ] before anyone signs.

## 1. Pick the contract type first

| Situation | Type (ป.พ.พ.) | Who pays stamp duty | Key law beyond the code |
|---|---|---|---|
| Staff on payroll, employer directs the work | จ้างแรงงาน (ม.575) | none — not in the stamp-duty schedule | พ.ร.บ.คุ้มครองแรงงาน (see `thai-employment`) |
| Deliver a result (website, renovation, design) | จ้างทำของ (ม.587) | ผู้รับจ้าง (contractor) | Withholding tax (WHT) 3% on payment (`thai-tax`) |
| Rent land, building, room | เช่าทรัพย์ (ม.537) | ผู้ให้เช่า (lessor) | residential landlords: สคบ. controlled-contract rules |
| Ongoing service (maintenance, retainer) | usually จ้างทำของ | ผู้รับจ้าง | |

A "freelancer" who works fixed hours under the company's orders is legally an employee — the label in the contract does not decide it.

## 2. Stamp duty (อากรแสตมป์)

| Instrument | Rate | Note |
|---|---|---|
| เช่าที่ดิน โรงเรือน สิ่งปลูกสร้าง | **1 baht per 1,000 baht** (or part) of the **total rent for the whole term** | lessor pays; ≥ 1 million baht → pay in cash/e-Stamp instead of stamps |
| จ้างทำของ | 1 baht per 1,000 baht (or part) of the fee | contractor pays; ≥ 1 million baht → cash/e-Stamp |
| กู้ยืมเงิน | 1 baht per 2,000 baht, max 10,000 | |
| ค้ำประกัน | 1 / 5 / 10 baht by amount (รอยืนยัน) | |
| สัญญาจ้างแรงงาน | none | |

Stamp at signing, or pay through **e-Stamp Duty** on rd.go.th within 15 days of signing. An unstamped contract **cannot be used as evidence in a civil case** until duty plus surcharge (เงินเพิ่มอากร, several times the duty — รอยืนยัน multiple) is paid.

Worked example: office lease 25,000/month × 36 months = 900,000 → 900 baht stamp duty, paid by the lessor (often passed on by agreement — write who bears it).

## 3. Clause checklists

Full checklists for employment, lease and hire-of-work contracts: [references/clause-checklists.md](clause-checklists.md). Every contract has: parties with ID/tax numbers and authorised signer, recitals, scope, price and payment, term, breach and cure, termination, notices, governing law, signatures and 2 witnesses.

## 4. Red flags (mark [ให้ทนายตรวจ], never remove silently)

| Clause | Why it is risky in Thailand |
|---|---|
| Penalty (เบี้ยปรับ) far above real loss | court may reduce it (ป.พ.พ. ม.383) — draft a realistic rate, e.g. 0.1% per day capped at 10% |
| Non-compete for employees | enforceable only as far as fair and reasonable (พ.ร.บ.ว่าด้วยข้อสัญญาที่ไม่เป็นธรรม 2540) — limit area, time, field |
| Employee deposit / guarantor (เงินประกันการทำงาน) | allowed only for certain jobs, with limits under the Labour Protection Act (รอยืนยัน the ministerial rule) |
| Wage deductions beyond tax, social security (SSO), provident fund (PVD), agreed debts | restricted by ม.76 |
| Lease over 3 years not registered at the land office | enforceable for only 3 years (ม.538) |
| Landlord business keeps deposit for wear and tear | residential controlled contract: deposit + advance rent ≤ 3 months, refund in 7 days (14 if damage) — scope by number of units (รอยืนยัน) |
| One-sided termination without notice, automatic renewal, IP assigned with no fee | unfair-terms risk |
| Personal guarantee (ผู้ค้ำประกัน) | guarantor protections in ม.681–685/1; drafting errors void clauses |

## 5. When a lawyer is required, not optional

- Any [ให้ทนายตรวจ] clause above; amount above ~1 million baht or term over 3 years.
- Land, condominium, share, franchise, loan with collateral (จำนอง/จำนำ).
- Foreign party, foreign-currency payment, or arbitration abroad.
- Dismissing an employee, settlement agreements, or anything already in dispute.

## 6. Reviewing a contract the other side sent

Sellers sign more contracts than they draft: distributor or reseller deals, ad agencies, creator and influencer networks, warehouse or space leases, bulk courier accounts. Review mode reads their paper and says where it hurts.

1. **Ask which side we are** (buyer or seller, lessee or lessor, brand or creator). The same clause is fine for one side and red for the other.
2. **Read every annex and schedule first** (ภาคผนวก · เอกสารแนบท้าย · price lists, SLAs, platform terms "incorporated by reference"). Fees, penalties and exclusivity often sit there, not in the main text.
3. **Walk 8 risk areas**, each marked แดง (red: do not sign as is), เหลือง (yellow: negotiate) or เขียว (green: fine):

| Area | Mark red or yellow when |
|---|---|
| Payment terms | we are paid more than 30 days after delivery or invoice (yellow); payment depends on the other side's "approval" with no deadline (red) |
| Liability | our liability has no cap, or we indemnify them for things we do not control (red) |
| Termination | they can end at once without cause and we cannot; no cure period; we pay for stock or work already done anyway |
| Intellectual property (IP) | our brand, photos or content pass to them, or a creator's content cannot be reused in our ads after the term |
| Scope and changes | scope is vague; they may change deliverables or prices by notice without our consent |
| Non-compete and exclusivity | we may not sell on other platforms or to other customers; area, time and field not limited (same unfair-terms risk as the non-compete row in section 4) |
| Confidentiality and data | customer personal data passes without a data processing agreement (`pdpa-workflow` E) |
| Auto-renewal | renews on its own with a short window to give notice; price rises on renewal |

4. **Quote the clause word for word** (clause number and the Thai text) next to a plain explanation of what it does to us. A finding without the quoted words cannot be checked.
5. **Offer replacement wording** for each red or yellow item, and say which ones to give up first if the other side pushes back (least harm to us first).
6. Every red item stays [ให้ทนายตรวจ]. Close with the same line as the workflow below.

## Workflow

1. Identify the type (section 1) and the parties' authority (company: หนังสือรับรอง and authorised director). The other side already sent a draft → review mode, section 6, instead of steps 2–4.
2. Fill the checklist for that type; leave unknowns as `{…}` not guesses.
3. Mark [ให้ทนายตรวจ] on red-flag clauses, with 1 line on why.
4. Compute stamp duty and say who pays.
5. Close with: "ร่างนี้เรียบเรียงจากที่คู่สัญญาตกลงกัน ก่อนลงนามควรให้ทนายความตรวจ".

## Related

`thai-employment` · `doc-quotation.md` · `thai-tax` · `pdpa-workflow` (personal data clauses).

## เรียกเป็นคำสั่ง

`/e-commerce:thai-business-docs <type> <parties> <key terms>`

Run `thai-business-docs` with the `thai-doc-writer` agent for: **the user's request**

## References

- [`sources.md`](sources.md) — stamp duty sources and check date 2026-10-22


## reference: doc-quotation.md

<!-- merged from skill `doc-quotation` on 2026-11-27 · description was: Use when issuing a Thai quotation, invoice or receipt -->
# doc-quotation — Thai sales documents from quotation to receipt

General information, not tax advice. The company's accountant (นักบัญชี) has the final word on tax documents.

## Use when

- Issuing a quotation (ใบเสนอราคา), invoice, billing note, receipt, or tax invoice
- Deciding which document to issue and when, or working out VAT and withholding tax lines
- Chasing overdue invoices from several credit customers

Not for: full tax-invoice fields, abbreviated invoices, e-Tax → `thai-tax` · one awkward message to one customer → `human-writing/polite-message-th-en` · contracts → `doc-contract-th.md`

## Steps

1. **Look for an existing format first.** Check whether the user, customer or project already has its own format (earlier quotations, invoices, receipts given by the user or in `docs/` · `ref/`): letterhead, running numbers, payment terms, footer notes. Found → use that format (headings, order, field names, numbering) and say in the reply which file's format you used. Not found → use the templates in [`templates.md`](templates.md) and say that no existing format was found. Either way the running number continues from the latest document, and the fields the law requires must be complete.
2. **Confirm:** is the seller VAT-registered? Is the buyer a company (withholding tax) or a person? Goods or service (tax point)? Confirm the VAT rate and payment terms before the final document.
3. **Pick the document:**
   - ใบเสนอราคา (QT): before the sale; becomes a contract when the customer signs.
   - ใบแจ้งหนี้ (invoice): on delivery or milestone; commercial only, not a tax document.
   - ใบวางบิล (billing note): lists open invoices on the customer's billing day.
   - ใบเสร็จรับเงิน (receipt): when paid.
   - ใบกำกับภาษี (tax invoice): at the **tax point** (goods: on delivery; services: when payment is received); only a VAT-registered business may issue it.
   - Combined forms are normal: "ใบแจ้งหนี้/ใบกำกับภาษี" (goods), "ใบเสร็จรับเงิน/ใบกำกับภาษี" (services, on payment). Not VAT-registered → never show VAT or the word ใบกำกับภาษี.
4. **Fill the required fields** (matrix per document → [`fields-and-example.md`](fields-and-example.md)): seller name, address and 13-digit tax ID (tax invoice adds "สำนักงานใหญ่" or "สาขาที่ ..."); customer name and address (tax invoice adds buyer tax ID and branch if the buyer is VAT-registered); number and date; items with quantity, unit, unit price, amount; subtotal, VAT 7% shown separately, total; total in Thai words; QT also has the validity date (ยืนราคาถึง, usually 15–30 days), payment terms, bank account or PromptPay QR, and signature. The quotation says "ราคายังไม่รวม VAT 7%" or "รวม VAT แล้ว", never ambiguous. VAT 7% is the rate until 30 Sep 2570; VAT registration is compulsory above 1.8 million baht revenue a year (`thai-tax`).
5. **Number:** 1 running series per document type (`QT2610-0001`, `IV…`, `BN…`, `RC…`, tax invoice `TX2610-0001`: prefix + YYMM + running). Tax invoices: 1 series **per branch**, no gaps, no reuse. To fix a wrong one, cancel it (stamp "ยกเลิก", keep all copies) and reissue with a new number that refers to the old one, or correct with a credit/debit note (ใบลดหนี้/ใบเพิ่มหนี้). Keep copies 5 years minimum, 7 recommended (`shop-books` → `references/sme-bookkeeping.md` section 2, per a Revenue Department ruling, not yet checked against the current statute).
6. **Compute money with the script** (below), never by hand. Withholding tax (WHT) base excludes VAT; the client gives you a 50 ทวิ, keep it. For a service, the tax invoice is issued when payment arrives (receipt/tax invoice for the full amount, noting WHT). Worked example (50,000 → 53,500 → net 52,000) → `fields-and-example.md`.
7. **Workflow:** quotation with validity and terms (เครดิต 30 วัน, deposit %, delivery) → customer accepts (PO or signed QT) → deliver and invoice → customer's billing day, billing note → paid, receipt (collect 50 ทวิ if withheld) → file output VAT in รายงานภาษีขาย for ภ.พ.30 (`thai-tax`).
8. **Chase overdue invoices** (batch of credit customers). Check the bank first: a customer who paid anything in the last 14 days is not chased (mark "อาจจ่ายแล้ว ตรวจก่อน"). Grade each customer by history (pays on time · sometimes late · late again and again); the grade sets the tone, not the amount. Send 1 message per customer listing all overdue invoices (number, date, amount, days overdue) and the total. Show the owner a summary table first (customer · invoices · total · days overdue · grade · level), then draft all messages. Nothing is sent until the owner approves each one. Levels, message wording, late-interest and Debt Collection Act rules → [`chasing-overdue.md`](chasing-overdue.md). Never threaten, shame, or tell anyone else about the debt.

## Script

Run `thai-doc-total.mjs` for every document with money on it: do not add up, take VAT or write the amount in Thai words by hand. Line = quantity × price − discount; VAT is rounded once on the whole document, not per line; withholding tax is taken on the amount before VAT; net payment = total − withholding. It prints the total and the net as Thai words (`…บาทถ้วน` or `…บาท…สตางค์`). Its self-test reproduces the 50,000 example (53,500 · 1,500 · 52,000).

```
node thai-doc-total.mjs <file.json> [--json]     # example file: scripts/example.json
node thai-doc-total.mjs --self-test
```

Input file fields (`items`, `vatMode` `exclusive` · `inclusive` · `none`, `vatRate`, `whtRate`, tax IDs), the `rates.json` age warning and the size limit → [`script.md`](script.md). A bad field stops the script with a message naming it; split a document total above 9,999,999,999.99 baht.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/thai-business-docs/scripts/thai-doc-total.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/thai-business-docs/scripts/thai-doc-total.mjs` · Node only, no dependencies.

## Check before done

- Words match digits to the satang; VAT rounded per document, not per line
- A PromptPay QR for the amount due is added (`shop-books`)
- Output is .docx or PDF; an issued copy is never changed, any edit gets a new number
- Not VAT-registered → no VAT and no word ใบกำกับภาษี

## References

- [`templates.md`](templates.md) — open when no existing format was found, for the 4 document templates
- [`fields-and-example.md`](fields-and-example.md) — open to check required fields per document, the document-type table, the VAT/WHT example, or Thai amount in words by hand
- [`script.md`](script.md) — open when writing the script's input file
- [`chasing-overdue.md`](chasing-overdue.md) — open when chasing overdue invoices

Related: `thai-tax` · `shop-books`

## เรียกเป็นคำสั่ง

`/e-commerce:thai-business-docs <customer> <items and prices> [terms]`

Run `thai-business-docs` with the `thai-doc-writer` agent for: **the user's request**

Confirm VAT rate and payment terms before producing the final document; amounts in digits and Thai words must match exactly.


## reference: doc-thai-official.md

<!-- merged from skill `doc-thai-official` on 2026-11-27 · description was: Use when drafting a formal Thai letter or memo -->
# Thai Official Letter (หนังสือราชการ / หนังสือแบบราชการ)

Steps: pick the letter type, pick the salutation for the recipient's rank, fill the template, and state the request with a date.

Authority: ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 and amendments up to (ฉบับที่ 4) พ.ศ. 2564. Companies writing to government copy the same layout on their own letterhead (no ครุฑ — the Garuda emblem is for government agencies only).

## 1. Which type

| Type | Use when | Signed by | Key look |
|---|---|---|---|
| **หนังสือภายนอก** | Formal letter between agencies, or to a company/person outside | Head of agency or delegate | Garuda/letterhead top-centre, ที่ top-left, address top-right, full signature block |
| **หนังสือภายใน (บันทึกข้อความ)** | Inside the same agency/company | Person in charge | Header "บันทึกข้อความ", lines ส่วนราชการ / ที่ / วันที่ / เรื่อง, less formal |
| **หนังสือประทับตรา** | Routine matter between agencies at กรม level or to a person — ask for documents, acknowledge receipt, send a copy, remind | Stamped with the agency seal, initialled by a ข้าราชการ ระดับหัวหน้ากอง or delegate | No salutation, no closing; ถึง instead of เรียน |
| หนังสือสั่งการ (คำสั่ง ระเบียบ ข้อบังคับ) | Orders and rules | Authorised head | Separate formats — out of scope here |
| หนังสือประชาสัมพันธ์ (ประกาศ แถลงการณ์ ข่าว) | Public notices | Authorised head | "ประกาศ ...", ประกาศ ณ วันที่ |

Templates for the first three: [references/templates.md](doc-thai-official/templates.md).

## 2. Salutation and closing by recipient

| Recipient | คำขึ้นต้น | คำลงท้าย |
|---|---|---|
| Ordinary person, director, manager, governor, minister (most letters) | **เรียน** | **ขอแสดงความนับถือ** |
| Top office holders — ประธานองคมนตรี, นายกรัฐมนตรี, ประธานรัฐสภา, ประธานสภาผู้แทนราษฎร, ประธานวุฒิสภา, ประธานศาลฎีกา, ประธานศาลรัฐธรรมนูญ, ประธานศาลปกครองสูงสุด, รัฐบุรุษ, heads of independent constitutional bodies | **กราบเรียน** | **ขอแสดงความนับถืออย่างยิ่ง** |
| Monk (พระภิกษุ) | นมัสการ | ขอนมัสการด้วยความเคารพ |
| Senior monk (สมเด็จพระราชาคณะ) | นมัสการ | ขอนมัสการด้วยความเคารพอย่างยิ่ง |
| Royalty and สมเด็จพระสังฆราช | Use the royal forms in ภาคผนวก 2 of the ระเบียบ — do not improvise | (same appendix) |

- Write the recipient by **position**, not name: เรียน อธิบดีกรมสรรพากร, not เรียน นายสมชาย.
- กราบเรียน always pairs with ขอแสดงความนับถืออย่างยิ่ง; mixing levels reads as an error.

## 3. Closing sentence (the ask)

| Purpose | Phrase |
|---|---|
| Inform only | จึงเรียนมาเพื่อโปรดทราบ |
| Ask for a decision | จึงเรียนมาเพื่อโปรดพิจารณา |
| Ask for a favour/support | จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์ |
| Ask to act | จึงเรียนมาเพื่อโปรดดำเนินการต่อไปด้วย |
| Inform and comply | จึงเรียนมาเพื่อโปรดทราบและถือปฏิบัติ |
| With กราบเรียน | จึงกราบเรียนมาเพื่อโปรดพิจารณา |

Add the deadline in the body: "ภายในวันที่ 20 ตุลาคม 2569" — without a date there is no deadline.

## 4. Layout rules

- Font TH Sarabun New / TH SarabunPSK 16 pt; A4; margins about 3 cm left, 2 cm right (house style may differ).
- **ที่** — agency code + file number / running number, e.g. ที่ กค 0702/1234; companies use their own, e.g. ที่ สท. 045/2569.
- Date in หนังสือภายนอก: "6 ตุลาคม 2569" (no word วันที่); in บันทึกข้อความ: "วันที่ 6 ตุลาคม 2569". Buddhist year.
- **อ้างถึง** only for a letter the recipient already has; **สิ่งที่ส่งมาด้วย** lists enclosures, numbered.
- Body pattern: ด้วย/ตามที่ (background) → paragraph of facts → ในการนี้/จึง (the request).
- Thai numerals (๑ ๒ ๓) are optional; government practice favours them, but be consistent through the whole letter. Arabic is fine for company letters.
- Contact block at bottom-left: ส่วนราชการเจ้าของเรื่อง, โทร., ไปรษณีย์อิเล็กทรอนิกส์.
- 1 matter per letter. Polite, precise, no slang, no English unless a proper noun.

Word choice — swap the everyday word for the letter word:

| ภาษาพูด / ร่าง AI | หนังสือราชการ |
|---|---|
| เซ็น | ลงนาม |
| ทำ | ดำเนินการ |
| เช็ค | ตรวจสอบ |
| ส่งให้ | ส่งมาเพื่อ… (ส่งมาเพื่อพิจารณา / ส่งมาเพื่อทราบ) |
| ภายในวันที่ X / ภายใน X วัน | ภายใน X วัน นับจากวันที่ได้รับหนังสือฉบับนี้ |
| เรา | บริษัทฯ (ไม่ใช้บุรุษที่ 1) |

## Workflow

1. Ask: sender, recipient position, purpose (inform / request / approve), deadline, enclosures, any letter being referred to.
2. Choose the type (section 1) and salutation/closing pair (section 2).
3. Fill the template from references; write the body ด้วย → facts → request with a date. For the Thai wording → `human-writing` `thai-grammar.md`, section 4, the official (ราชการ) register (and the word table in section 4 above).
4. Check: salutation and closing match; ที่ and date present; enclosures numbered and actually attached; signer's full name in brackets and position under it.
5. Output .docx on letterhead (styling → `document-design`, plugin `software-development`).

## Related

`doc-quotation.md` · `doc-contract-th.md` · `thai-employment` (dates).

## References

- [`templates.md`](doc-thai-official/templates.md) — open at workflow step 3: the 3 templates, final checklist, before/after body paragraph (section 5), worked example, sources


## reference: fields-and-example.md

# Required fields, VAT/WHT worked example, amount in Thai words · doc-quotation

Open when checking which fields a document type needs, when showing a VAT and withholding tax example, or when handling Thai amount-in-words by hand.

## Required fields by document

| Field | QT | Invoice | Billing note | Receipt | Tax invoice |
|---|---|---|---|---|---|
| Seller name, address, เลขประจำตัวผู้เสียภาษีอากร 13 digits | ✓ | ✓ | ✓ | ✓ | ✓ + "สำนักงานใหญ่" or "สาขาที่ ..." |
| Customer name and address | ✓ | ✓ | ✓ | ✓ | ✓; buyer tax ID + branch if the buyer is VAT-registered |
| Document number and date | ✓ | ✓ | ✓ | ✓ | ✓ (and book number if used) |
| Items: description, quantity, unit, unit price, amount | ✓ | ✓ | invoice list | ✓ | ✓ |
| Subtotal, VAT 7% shown separately, total | ✓ | ✓ | total due | ✓ | ✓ (VAT **must** be separate) |
| Total in Thai words | ✓ | ✓ | ✓ | ✓ | ✓ |
| Validity date (ยืนราคาถึง) | ✓ | | | | |
| Payment terms and bank account / PromptPay QR | ✓ | ✓ | ✓ | | |
| Signature of issuer / receiver | ✓ | | ✓ (customer signs receipt of bill) | ✓ (ผู้รับเงิน) | |

Full tax-invoice field list, abbreviated invoices and e-Tax: `thai-tax`.

## Document types

| Document | Purpose | When issued | Legal weight |
|---|---|---|---|
| **ใบเสนอราคา** (quotation, QT) | offer of price and terms | before the sale | becomes a contract when the customer signs/accepts (often with a purchase order, PO) |
| **ใบแจ้งหนี้** (invoice) | asks for payment | on delivery or milestone | commercial only — not a tax document |
| **ใบวางบิล** (billing note) | lists several invoices to be paid on the customer's pay run | to the customer's accounts payable (AP) team on their billing day | commercial only; customer signs receipt of the bill |
| **ใบเสร็จรับเงิน** (receipt) | proves money received | when paid | evidence of payment (keep a copy) |
| **ใบกำกับภาษี** (tax invoice) | evidence of output VAT; lets the buyer claim input VAT | at the **tax point** — goods: on delivery; services: when payment is received | only a VAT-registered business may issue it; required fields under ม.86/4 |

## VAT and withholding tax lines — worked example

Service fee 50,000 to a company client that withholds 3% (service, see `thai-tax` for rates).

| Line | Baht |
|---|---|
| ค่าบริการ (รวมเป็นเงิน) | 50,000.00 |
| ภาษีมูลค่าเพิ่ม 7% | 3,500.00 |
| **รวมทั้งสิ้น** | **53,500.00** |
| หัก ภาษี ณ ที่จ่าย 3% (on 50,000, before VAT) | −1,500.00 |
| **ยอดชำระสุทธิ** | **52,000.00** |

Total in words: **ห้าหมื่นสามพันห้าร้อยบาทถ้วน**; net payment: ห้าหมื่นสองพันบาทถ้วน.

- Withholding tax (WHT) base excludes VAT. The client gives you **50 ทวิ** for 1,500 — keep it; it is credited against your income tax.
- Because this is a service, the tax invoice is issued **when the 52,000 arrives** (receipt/tax invoice for the full 53,500, noting WHT 1,500).
- The quotation should say "ราคายังไม่รวม VAT 7%" or "รวม VAT แล้ว" — never leave it ambiguous.

## Thai amount in words

1 = หนึ่ง alone, but a trailing 1 after tens/hundreds is "เอ็ด" (21 ยี่สิบเอ็ด, 101 หนึ่งร้อยเอ็ด); 20 = ยี่สิบ; whole baht end with "ถ้วน"; satang: 1,234.50 = หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์.

In code, use a tested library rather than writing the rules again: npm `thai-baht-text` (antronic/thai-baht-text-js, MIT, has unit tests) — `ThaiBahtText(10050)` → หนึ่งหมื่นห้าสิบบาทถ้วน. Still spot-check เอ็ด, ยี่สิบ and satang cases against the rules above. Last checked 2026-10-23 · Source: https://github.com/antronic/thai-baht-text-js


## reference: script.md

# thai-doc-total.mjs input · doc-quotation

Open when writing the input file for `scripts/thai-doc-total.mjs`.

Input file: `{ "items": [ { "name": "...", "qty": 1, "price": 50000, "discount": 0 } ], "vatMode": "exclusive", "vatRate": 7, "whtRate": 3, "sellerTaxId": "...", "buyerTaxId": "..." }` · `vatMode` is `exclusive` (prices exclude VAT, the default) · `inclusive` (prices already include VAT) · `none` (seller not VAT-registered). `discount` is baht off that line. `vatRate` defaults to `vat_pct` in `scripts/rates.json` (7%, checked 2026-10-25, reduced rate ends 30 Sep 2570); the script warns when that file is older than 90 days or the end date has passed — then check rd.go.th and update `rates.json` or pass `vatRate`. A document total above 9,999,999,999.99 baht stops the script; split it into several documents. `whtRate` defaults to 0. A tax ID that fails the check digit gives a warning, not a stop. A bad field stops the script with a message naming it.


## reference: sources.md

# Sources · doc-contract-th

Last checked 2026-10-22 · sources: https://rd.go.th/67218.html (contract for work, paid by the contractor, ≥ 1 million baht paid in cash) · https://www.rd.go.th/23006.html and https://www.rd.go.th/6162.html (stamp duty rate schedule: contract for work 1 per 1,000 · loan 1 per 2,000, maximum 10,000 · lease 1 per 1,000 — confirmed)


## reference: templates.md

# Sales document templates

Contents: 1. Quotation · 2. Invoice / tax invoice (goods) · 3. Billing note · 4. Receipt / tax invoice (services)

Placeholders in `{}`. Header block is the same on every document:

```
{ชื่อบริษัท} ({สำนักงานใหญ่ | สาขาที่ 00001})
{ที่อยู่} โทร {โทรศัพท์}
เลขประจำตัวผู้เสียภาษีอากร {13 หลัก}
```

## 1. ใบเสนอราคา (Quotation)

```
ใบเสนอราคา / QUOTATION                เลขที่ {QT2610-0001}   วันที่ {6 ต.ค. 2569}
เรียน {ชื่อลูกค้า} ที่อยู่ {…} เลขประจำตัวผู้เสียภาษี {…}

| ลำดับ | รายการ | จำนวน | หน่วย | ราคาต่อหน่วย | จำนวนเงิน |
| 1 | {…} | {…} | {…} | {…} | {…} |
                                   รวมเป็นเงิน      {…}
                                   ภาษีมูลค่าเพิ่ม 7%  {…}
                                   รวมทั้งสิ้น        {…}
({จำนวนเงินตัวอักษร})

ยืนราคาถึง: {วันที่}   กำหนดส่งมอบ: {…}   เงื่อนไขชำระ: {มัดจำ 50% / เครดิต 30 วัน}
ชำระโดยโอน: {ธนาคาร} {เลขบัญชี} ชื่อบัญชี {…} หรือ PromptPay QR
ผู้เสนอราคา ............ (……)            ผู้อนุมัติสั่งซื้อ ............ วันที่ ……
```

## 2. ใบแจ้งหนี้/ใบกำกับภาษี (goods, issued on delivery)

```
ใบแจ้งหนี้/ใบกำกับภาษี   (ต้นฉบับ)       เลขที่ {TX2610-0001}   วันที่ {…}
ลูกค้า {ชื่อ} {ที่อยู่} เลขประจำตัวผู้เสียภาษี {…} {สำนักงานใหญ่ | สาขาที่ …}
อ้างอิงใบสั่งซื้อ {PO…}   ครบกำหนดชำระ {…}
[ตารางรายการ เหมือนใบเสนอราคา]
มูลค่าสินค้า {…}  ภาษีมูลค่าเพิ่ม 7% {…}  รวมทั้งสิ้น {…}  ({ตัวอักษร})
```

## 3. ใบวางบิล (Billing note)

```
ใบวางบิล  เลขที่ {BN2610-0001}  วันที่ {…}   ลูกค้า {…}
| ลำดับ | เลขที่ใบแจ้งหนี้ | วันที่ | ครบกำหนด | จำนวนเงิน |
                                     รวม {…} ({ตัวอักษร})
ผู้วางบิล ............   ผู้รับวางบิล ............  วันที่นัดชำระ {…}
```

## 4. ใบเสร็จรับเงิน/ใบกำกับภาษี (services, issued on payment)

```
ใบเสร็จรับเงิน/ใบกำกับภาษี  เลขที่ {RC2610-0001}  วันที่ {วันที่รับเงิน}
ได้รับเงินจาก {ชื่อลูกค้า} {ที่อยู่} เลขประจำตัวผู้เสียภาษี {…} {สาขา}
| รายการ | จำนวนเงิน |
ค่าบริการ {…} | ภาษีมูลค่าเพิ่ม 7% {…} | รวม {…}
หักภาษี ณ ที่จ่าย {3%} {…} (ตามหนังสือรับรอง 50 ทวิ เลขที่ {…})   รับชำระสุทธิ {…}
ชำระโดย [ ] เงินสด [ ] โอน {ธนาคาร/วันที่} [ ] เช็ค {เลขที่}
ผู้รับเงิน ............
```
