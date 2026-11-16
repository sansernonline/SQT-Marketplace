# skill: doc-quotation

Use when issuing a Thai quotation, invoice or receipt

# doc-quotation — Thai sales documents from quotation to receipt

General information, not tax advice. The company's accountant (นักบัญชี) has the final word on tax documents.

## Use when

- Issuing a quotation (ใบเสนอราคา), invoice, billing note, receipt, or tax invoice
- Deciding which document to issue and when, or working out VAT and withholding tax lines
- Chasing overdue invoices from several credit customers

Not for: full tax-invoice fields, abbreviated invoices, e-Tax → `e-tax-invoice` · one awkward message to one customer → `polite-message-th-en` · contracts → `doc-contract-th`

## Steps

1. **Look for an existing format first.** Check whether the user, customer or project already has its own format (earlier quotations, invoices, receipts given by the user or in `docs/` · `ref/`): letterhead, running numbers, payment terms, footer notes. Found → use that format (headings, order, field names, numbering) and say in the reply which file's format you used. Not found → use the templates in [`references/templates.md`](references/templates.md) and say that no existing format was found. Either way the running number continues from the latest document, and the fields the law requires must be complete.
2. **Confirm:** is the seller VAT-registered? Is the buyer a company (withholding tax) or a person? Goods or service (tax point)? Confirm the VAT rate and payment terms before the final document.
3. **Pick the document:**
   - ใบเสนอราคา (QT): before the sale; becomes a contract when the customer signs.
   - ใบแจ้งหนี้ (invoice): on delivery or milestone; commercial only, not a tax document.
   - ใบวางบิล (billing note): lists open invoices on the customer's billing day.
   - ใบเสร็จรับเงิน (receipt): when paid.
   - ใบกำกับภาษี (tax invoice): at the **tax point** (goods: on delivery; services: when payment is received); only a VAT-registered business may issue it.
   - Combined forms are normal: "ใบแจ้งหนี้/ใบกำกับภาษี" (goods), "ใบเสร็จรับเงิน/ใบกำกับภาษี" (services, on payment). Not VAT-registered → never show VAT or the word ใบกำกับภาษี.
4. **Fill the required fields** (matrix per document → [`references/fields-and-example.md`](references/fields-and-example.md)): seller name, address and 13-digit tax ID (tax invoice adds "สำนักงานใหญ่" or "สาขาที่ ..."); customer name and address (tax invoice adds buyer tax ID and branch if the buyer is VAT-registered); number and date; items with quantity, unit, unit price, amount; subtotal, VAT 7% shown separately, total; total in Thai words; QT also has the validity date (ยืนราคาถึง, usually 15–30 days), payment terms, bank account or PromptPay QR, and signature. The quotation says "ราคายังไม่รวม VAT 7%" or "รวม VAT แล้ว", never ambiguous. VAT 7% is the rate until 30 Sep 2570; VAT registration is compulsory above 1.8 million baht revenue a year (`tax-vat-th`).
5. **Number:** 1 running series per document type (`QT2610-0001`, `IV…`, `BN…`, `RC…`, tax invoice `TX2610-0001`: prefix + YYMM + running). Tax invoices: 1 series **per branch**, no gaps, no reuse. To fix a wrong one, cancel it (stamp "ยกเลิก", keep all copies) and reissue with a new number that refers to the old one, or correct with a credit/debit note (ใบลดหนี้/ใบเพิ่มหนี้). Keep copies 5 years minimum, 7 recommended (`sme-bookkeeping` section 2, per a Revenue Department ruling, not yet checked against the current statute).
6. **Compute money with the script** (below), never by hand. Withholding tax (WHT) base excludes VAT; the client gives you a 50 ทวิ, keep it. For a service, the tax invoice is issued when payment arrives (receipt/tax invoice for the full amount, noting WHT). Worked example (50,000 → 53,500 → net 52,000) → `references/fields-and-example.md`.
7. **Workflow:** quotation with validity and terms (เครดิต 30 วัน, deposit %, delivery) → customer accepts (PO or signed QT) → deliver and invoice → customer's billing day, billing note → paid, receipt (collect 50 ทวิ if withheld) → file output VAT in รายงานภาษีขาย for ภ.พ.30 (`tax-vat-th`).
8. **Chase overdue invoices** (batch of credit customers). Check the bank first: a customer who paid anything in the last 14 days is not chased (mark "อาจจ่ายแล้ว ตรวจก่อน"). Grade each customer by history (pays on time · sometimes late · late again and again); the grade sets the tone, not the amount. Send 1 message per customer listing all overdue invoices (number, date, amount, days overdue) and the total. Show the owner a summary table first (customer · invoices · total · days overdue · grade · level), then draft all messages. Nothing is sent until the owner approves each one. Levels, message wording, late-interest and Debt Collection Act rules → [`references/chasing-overdue.md`](references/chasing-overdue.md). Never threaten, shame, or tell anyone else about the debt.

## Script

Run `thai-doc-total.mjs` for every document with money on it: do not add up, take VAT or write the amount in Thai words by hand. Line = quantity × price − discount; VAT is rounded once on the whole document, not per line; withholding tax is taken on the amount before VAT; net payment = total − withholding. It prints the total and the net as Thai words (`…บาทถ้วน` or `…บาท…สตางค์`). Its self-test reproduces the 50,000 example (53,500 · 1,500 · 52,000).

```
node thai-doc-total.mjs <file.json> [--json]     # example file: scripts/example.json
node thai-doc-total.mjs --self-test
```

Input file fields (`items`, `vatMode` `exclusive` · `inclusive` · `none`, `vatRate`, `whtRate`, tax IDs), the `rates.json` age warning and the size limit → [`references/script.md`](references/script.md). A bad field stops the script with a message naming it; split a document total above 9,999,999,999.99 baht.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/doc-quotation/scripts/thai-doc-total.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/doc-quotation/scripts/thai-doc-total.mjs` · Node only, no dependencies.

## Check before done

- Words match digits to the satang; VAT rounded per document, not per line
- A PromptPay QR for the amount due is added (`promptpay-qr`)
- Output is .docx or PDF; an issued copy is never changed, any edit gets a new number
- Not VAT-registered → no VAT and no word ใบกำกับภาษี

## References

- [`references/templates.md`](references/templates.md) — open when no existing format was found, for the 4 document templates
- [`references/fields-and-example.md`](references/fields-and-example.md) — open to check required fields per document, the document-type table, the VAT/WHT example, or Thai amount in words by hand
- [`references/script.md`](references/script.md) — open when writing the script's input file
- [`references/chasing-overdue.md`](references/chasing-overdue.md) — open when chasing overdue invoices

Related: `e-tax-invoice` · `tax-vat-th` · `promptpay-qr` · `seller-tax-basics`

## เรียกเป็นคำสั่ง

`/e-commerce:doc-quotation <customer> <items and prices> [terms]`

Run `doc-quotation` with the `thai-doc-writer` agent for: **$ARGUMENTS**

Confirm VAT rate and payment terms before producing the final document; amounts in digits and Thai words must match exactly.


## reference: chasing-overdue.md

# Chasing overdue invoices (ตามหนี้ลูกค้าเครดิต) · doc-quotation

Open when the user asks to chase overdue invoices from several credit customers (B2B buyers, resellers, agents), at month end or billing day. One awkward message to one customer → `polite-message-th-en` (plugin `superuser`), whose tone ladder the levels below follow. Process from Anthropic's invoice-chase skill (`anthropics/knowledge-work-plugins` small-business, Apache-2.0, read 2026-11-10), rewritten for Thai sellers; no text copied.

## Levels

| Level | When | Message (LINE, the channel sellers actually use) |
|---|---|---|
| 1 Reminder | just past due, or a good payer | invoices, total, due dates, "หากชำระแล้วขออภัยและรบกวนส่งสลิปให้ด้วยนะคะ" + PromptPay QR for the total (`promptpay-qr`) |
| 2 Second request | about 2 weeks later, or a sometimes-late payer | same facts + ask for the date they will pay; offer to split a large amount |
| 3 Before stopping supply | still unpaid after level 2 | same facts + the date after which credit sales pause, only if the owner will really do it; a formal demand letter if the owner decides (`doc-thai-official`) |

## Rules for every level

- State facts and the next step. Never threaten, insult, shame, or tell anyone else about the debt (family, staff, a group chat, a public post). Never write the debt on the outside of an envelope.
- A business whose normal trade is giving credit may fall under the Debt Collection Act B.E. 2558 (พ.ร.บ.การทวงถามหนี้), which limits contact times, how often you contact, and what you may say (รอยืนยัน whether your shop is covered and the current rules, with a lawyer).
- Late-payment interest: if the contract sets no rate, default interest under the Civil and Commercial Code ม.224 is **5% a year** since 11 Apr 2564 (ม.7 rate 3% a year), per the Bank of Thailand, checked 2026-11-10: [bot.or.th article 3 Jul 2564](https://www.bot.or.th/th/research-and-publications/articles-and-publications/articles/Article_3Jul2021.html). Mention it only after level 2, and only if the owner wants to claim it.
- How long the shop can still sue for an unpaid sale (prescription) is limited by law (รอยืนยัน the period with a lawyer); do not let an invoice sit for years.


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

Full tax-invoice field list, abbreviated invoices and e-Tax: `e-tax-invoice`.

## Document types

| Document | Purpose | When issued | Legal weight |
|---|---|---|---|
| **ใบเสนอราคา** (quotation, QT) | offer of price and terms | before the sale | becomes a contract when the customer signs/accepts (often with a purchase order, PO) |
| **ใบแจ้งหนี้** (invoice) | asks for payment | on delivery or milestone | commercial only — not a tax document |
| **ใบวางบิล** (billing note) | lists several invoices to be paid on the customer's pay run | to the customer's accounts payable (AP) team on their billing day | commercial only; customer signs receipt of the bill |
| **ใบเสร็จรับเงิน** (receipt) | proves money received | when paid | evidence of payment (keep a copy) |
| **ใบกำกับภาษี** (tax invoice) | evidence of output VAT; lets the buyer claim input VAT | at the **tax point** — goods: on delivery; services: when payment is received | only a VAT-registered business may issue it; required fields under ม.86/4 |

## VAT and withholding tax lines — worked example

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

## Thai amount in words

1 = หนึ่ง alone, but a trailing 1 after tens/hundreds is "เอ็ด" (21 ยี่สิบเอ็ด, 101 หนึ่งร้อยเอ็ด); 20 = ยี่สิบ; whole baht end with "ถ้วน"; satang: 1,234.50 = หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์.

In code, use a tested library rather than writing the rules again: npm `thai-baht-text` (antronic/thai-baht-text-js, MIT, has unit tests) — `ThaiBahtText(10050)` → หนึ่งหมื่นห้าสิบบาทถ้วน. Still spot-check เอ็ด, ยี่สิบ and satang cases against the rules above. Last checked 2026-10-23 · Source: https://github.com/antronic/thai-baht-text-js


## reference: script.md

# thai-doc-total.mjs input · doc-quotation

Open when writing the input file for `scripts/thai-doc-total.mjs`.

Input file: `{ "items": [ { "name": "...", "qty": 1, "price": 50000, "discount": 0 } ], "vatMode": "exclusive", "vatRate": 7, "whtRate": 3, "sellerTaxId": "...", "buyerTaxId": "..." }` · `vatMode` is `exclusive` (prices exclude VAT, the default) · `inclusive` (prices already include VAT) · `none` (seller not VAT-registered). `discount` is baht off that line. `vatRate` defaults to `vat_pct` in `scripts/rates.json` (7%, checked 2026-10-25, reduced rate ends 30 Sep 2570); the script warns when that file is older than 90 days or the end date has passed — then check rd.go.th and update `rates.json` or pass `vatRate`. A document total above 9,999,999,999.99 baht stops the script; split it into several documents. `whtRate` defaults to 0. A tax ID that fails the check digit gives a warning, not a stop. A bad field stops the script with a message naming it.


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
