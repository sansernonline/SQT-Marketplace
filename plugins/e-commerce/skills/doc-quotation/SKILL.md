---
name: doc-quotation
description: Use when issuing a Thai quotation, invoice, billing note or receipt (VAT, withholding, total in words).
argument-hint: <customer> <items and prices> [terms]
---

# Thai Sales Documents — quotation to receipt

The right documents at the right time prevent arguments about payment. This is general information, not tax advice. The company's accountant (นักบัญชี) has the final word on tax documents.

## 0 · หาแบบที่มีอยู่ก่อน (ทุกครั้ง)

ก่อนใช้โครงหรือแม่แบบในไฟล์นี้ ดูก่อนว่าผู้ใช้ ลูกค้า หรือโปรเจกต์มีแบบของตัวเองหรือยัง:

- **ที่ดู:** ใบเสนอราคา ใบแจ้งหนี้ หรือใบเสร็จฉบับก่อนของบริษัท (ไฟล์ที่ผู้ใช้ให้ หรือใน `docs/` · `ref/`) → ดูหัวกระดาษ เลขรัน เงื่อนไขชำระเงิน และหมายเหตุท้ายเอกสาร
- **ผล:** เจอ → ใช้แบบนั้น (หัวข้อ ลำดับ ชื่อฟิลด์ เลขรัน) แล้วบอกในคำตอบว่าใช้แบบจากไฟล์ไหน · ไม่เจอ → ใช้แม่แบบในไฟล์นี้เป็นค่าสำรอง และบอกว่าไม่พบแบบเดิม
- **ยังต้องมีทุกแบบ:** เลขรันต่อจากฉบับล่าสุด · ช่องที่กฎหมายบังคับในข้อ 2 ต้องครบไม่ว่าใช้แบบไหน

## 1. Which document, when

| Document | Purpose | When issued | Legal weight |
|---|---|---|---|
| **ใบเสนอราคา** (quotation, QT) | offer of price and terms | before the sale | becomes a contract when the customer signs/accepts (often with a purchase order, PO) |
| **ใบแจ้งหนี้** (invoice) | asks for payment | on delivery or milestone | commercial only — not a tax document |
| **ใบวางบิล** (billing note) | lists several invoices to be paid on the customer's pay run | to the customer's accounts payable (AP) team on their billing day | commercial only; customer signs receipt of the bill |
| **ใบเสร็จรับเงิน** (receipt) | proves money received | when paid | evidence of payment (keep a copy) |
| **ใบกำกับภาษี** (tax invoice) | evidence of output VAT; lets the buyer claim input VAT | at the **tax point** — goods: on delivery; services: when payment is received | only a VAT-registered business may issue it; required fields under ม.86/4 |

Combined forms are normal: "ใบแจ้งหนี้/ใบกำกับภาษี" (goods) and "ใบเสร็จรับเงิน/ใบกำกับภาษี" (services, issued on payment). Not VAT-registered → never show VAT or the word ใบกำกับภาษี.

## 2. Required fields

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

Full tax-invoice field list, abbreviated invoices and e-Tax: `e-tax-invoice`. VAT 7% is the rate until 30 Sep 2570; VAT registration is compulsory above 1.8 million baht revenue a year (`tax-vat-th`).

## 3. Numbering

- 1 running series per document type: `QT2610-0001`, `IV2610-0001`, `BN…`, `RC…`, tax invoices `TX2610-0001` (prefix + YYMM + running).
- Tax invoices: 1 series **per branch**, no gaps, no reuse. To fix a wrong one, cancel it (stamp "ยกเลิก", keep all copies) and reissue with a new number that refers to the old one. Or correct it with a credit/debit note (ใบลดหนี้/ใบเพิ่มหนี้).
- Keep copies 5 years minimum, 7 recommended (`sme-bookkeeping` section 2 — per a Revenue Department ruling, not yet checked against the current statute).

## 4. VAT and withholding tax lines — worked example

Service fee 50,000 to a company client that withholds 3% (service, see `tax-vat-th` for rates).

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

Thai amount-in-words rules: 1 = หนึ่ง alone, but a trailing 1 after tens/hundreds is "เอ็ด" (21 ยี่สิบเอ็ด, 101 หนึ่งร้อยเอ็ด); 20 = ยี่สิบ; whole baht end with "ถ้วน"; satang: 1,234.50 = หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์.

In code, use a tested library rather than writing the rules again: npm `thai-baht-text` (antronic/thai-baht-text-js, MIT, has unit tests) — `ThaiBahtText(10050)` → หนึ่งหมื่นห้าสิบบาทถ้วน. Still spot-check เอ็ด, ยี่สิบ and satang cases against the rules above. ตรวจล่าสุด 2026-10-23 · แหล่ง: https://github.com/antronic/thai-baht-text-js

## 5. Workflow

1. Confirm: seller VAT-registered? buyer company (WHT) or person? goods or service (tax point)?
2. Quotation with validity (usually 15–30 days) and terms (เครดิต 30 วัน, deposit %, delivery).
3. Customer accepts → PO or signed QT.
4. Deliver → invoice (goods: invoice/tax invoice).
5. Customer's billing day → billing note listing open invoices.
6. Paid → receipt (services: receipt/tax invoice); collect 50 ทวิ if withheld.
7. File: output VAT in รายงานภาษีขาย for ภ.พ.30 (`tax-vat-th`).

Templates for all 5 documents: [references/templates.md](references/templates.md).

## Script

Run `thai-doc-total.mjs` for every document with money on it: do not add up, take VAT or write the amount in Thai words by hand. It follows section 4: line = quantity × price − discount; VAT is rounded once on the whole document, not per line; withholding tax is taken on the amount before VAT; net payment = total − withholding. It prints the total and the net as Thai words (`…บาทถ้วน` or `…บาท…สตางค์`). Its self-test reproduces the 50,000 example in section 4 (53,500 · 1,500 · 52,000) and checks เอ็ด, ยี่สิบ, satang and million cases.

```
node thai-doc-total.mjs <file.json> [--json]     # example file: scripts/example.json
node thai-doc-total.mjs --self-test
```

Input file: `{ "items": [ { "name": "...", "qty": 1, "price": 50000, "discount": 0 } ], "vatMode": "exclusive", "vatRate": 7, "whtRate": 3, "sellerTaxId": "...", "buyerTaxId": "..." }` · `vatMode` is `exclusive` (prices exclude VAT, the default) · `inclusive` (prices already include VAT) · `none` (seller not VAT-registered). `discount` is baht off that line. `vatRate` defaults to `vat_pct` in `scripts/rates.json` (7%, checked 2026-10-25, reduced rate ends 30 Sep 2570); the script warns when that file is older than 90 days or the end date has passed — then check rd.go.th and update `rates.json` or pass `vatRate`. A document total above 9,999,999,999.99 baht stops the script (satang and Thai words stay exact only below that); split it into several documents. `whtRate` defaults to 0. A tax ID that fails the check digit gives a warning, not a stop. A bad field stops the script with a message naming it.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/doc-quotation/scripts/thai-doc-total.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/doc-quotation/scripts/thai-doc-total.mjs` · Node only, no dependencies.

## 6. Chasing overdue invoices (ตามหนี้ลูกค้าเครดิต)

For a batch of B2B buyers, resellers and agents on credit terms, at month end or billing day. One awkward message to one customer → `polite-message-th-en` (plugin `superuser`), whose tone ladder the levels below follow. Process from Anthropic's invoice-chase skill (`anthropics/knowledge-work-plugins` small-business, Apache-2.0, read 2026-11-10), rewritten for Thai sellers; no text copied.

1. **Check the bank first, every time.** Match each overdue invoice against deposits and PromptPay slips. A customer who paid anything in the last 14 days is not chased; mark "อาจจ่ายแล้ว ตรวจก่อน".
2. **Grade each customer by history**: pays on time · sometimes late · late again and again. The grade sets the tone of the message, not the amount.
3. **One message per customer**, listing all their overdue invoices with number, date, amount and days overdue, and the total.
4. **Show the owner a summary table first** (customer · invoices · total · days overdue · grade · level), then draft all messages. Nothing is sent until the owner approves each one.
5. **Pick the level**:

| Level | When | Message (LINE, the channel sellers actually use) |
|---|---|---|
| 1 Reminder | just past due, or a good payer | invoices, total, due dates, "หากชำระแล้วขออภัยและรบกวนส่งสลิปให้ด้วยนะคะ" + PromptPay QR for the total (`promptpay-qr`) |
| 2 Second request | about 2 weeks later, or a sometimes-late payer | same facts + ask for the date they will pay; offer to split a large amount |
| 3 Before stopping supply | still unpaid after level 2 | same facts + the date after which credit sales pause, only if the owner will really do it; a formal demand letter if the owner decides (`doc-thai-official`) |

Rules for every level:

- State facts and the next step. Never threaten, insult, shame, or tell anyone else about the debt (family, staff, a group chat, a public post). Never write the debt on the outside of an envelope.
- A business whose normal trade is giving credit may fall under the Debt Collection Act B.E. 2558 (พ.ร.บ.การทวงถามหนี้), which limits contact times, how often you contact, and what you may say (รอยืนยัน whether your shop is covered and the current rules, with a lawyer).
- Late-payment interest: if the contract sets no rate, default interest under the Civil and Commercial Code ม.224 is **5% a year** since 11 Apr 2564 (ม.7 rate 3% a year), per the Bank of Thailand, checked 2026-11-10: [bot.or.th article 3 Jul 2564](https://www.bot.or.th/th/research-and-publications/articles-and-publications/articles/Article_3Jul2021.html). Mention it only after level 2, and only if the owner wants to claim it.
- How long the shop can still sue for an unpaid sale (prescription) is limited by law (รอยืนยัน the period with a lawyer); do not let an invoice sit for years.


## Rules

- Words must match digits to the satang; check rounding of VAT per document, not per line.
- Add a PromptPay QR for the amount due (`promptpay-qr`).
- Output .docx or PDF. Never change an issued copy; any edit needs a new number.

## Related

`e-tax-invoice` · `tax-vat-th` · `promptpay-qr` · `doc-contract-th` · `seller-tax-basics`.

## เรียกเป็นคำสั่ง

`/e-commerce:doc-quotation <customer> <items and prices> [terms]`

Run `doc-quotation` with the `thai-doc-writer` agent for: **$ARGUMENTS**

Confirm VAT rate and payment terms before producing the final document; amounts in digits and Thai words must match exactly.
