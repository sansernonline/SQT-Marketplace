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
