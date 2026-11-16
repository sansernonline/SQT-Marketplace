---
name: doc-quotation
description: Use when issuing a Thai quotation, invoice or receipt
argument-hint: <customer> <items and prices> [terms]
---

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
