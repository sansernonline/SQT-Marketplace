---
name: doc-quotation
description: Use when issuing a Thai quotation, invoice, billing note or receipt. Which document when, required fields, numbering, VAT and withholding lines, total in words.
---

# Thai Sales Documents — quotation to receipt

The right documents at the right time prevent arguments about payment. This is general information, not tax advice. The company's accountant (นักบัญชี) has the final word on tax documents.

## 1. Which document, when

| Document | Purpose | When issued | Legal weight |
|---|---|---|---|
| **ใบเสนอราคา** (quotation) | offer of price and terms | before the sale | becomes a contract when the customer signs/accepts (often with a PO) |
| **ใบแจ้งหนี้** (invoice) | asks for payment | on delivery or milestone | commercial only — not a tax document |
| **ใบวางบิล** (billing note) | lists several invoices to be paid on the customer's pay run | to the customer's AP on their billing day | commercial only; customer signs receipt of the bill |
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
- Keep copies at least 5 years (accounting and VAT rules).

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

- WHT base excludes VAT. The client gives you **50 ทวิ** for 1,500 — keep it; it is credited against your income tax.
- Because this is a service, the tax invoice is issued **when the 52,000 arrives** (receipt/tax invoice for the full 53,500, noting WHT 1,500).
- The quotation should say "ราคายังไม่รวม VAT 7%" or "รวม VAT แล้ว" — never leave it ambiguous.

Thai amount-in-words rules: 1 = หนึ่ง alone, but a trailing 1 after tens/hundreds is "เอ็ด" (21 ยี่สิบเอ็ด, 101 หนึ่งร้อยเอ็ด); 20 = ยี่สิบ; whole baht end with "ถ้วน"; satang: 1,234.50 = หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์.

## 5. Workflow

1. Confirm: seller VAT-registered? buyer company (WHT) or person? goods or service (tax point)?
2. Quotation with validity (usually 15–30 days) and terms (เครดิต 30 วัน, deposit %, delivery).
3. Customer accepts → PO or signed QT.
4. Deliver → invoice (goods: invoice/tax invoice).
5. Customer's billing day → billing note listing open invoices.
6. Paid → receipt (services: receipt/tax invoice); collect 50 ทวิ if withheld.
7. File: output VAT in รายงานภาษีขาย for ภ.พ.30 (`tax-vat-th`).

Templates for all 5 documents: [references/templates.md](references/templates.md).

## Rules

- Words must match digits to the satang; check rounding of VAT per document, not per line.
- Add a PromptPay QR for the amount due (`promptpay-qr`).
- Output .docx or PDF. Never change an issued copy; any edit needs a new number.

## Related

`e-tax-invoice` · `tax-vat-th` · `promptpay-qr` · `doc-contract-th` · if installed: `seller-tax-basics` (online-seller).
