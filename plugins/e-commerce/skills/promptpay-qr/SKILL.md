---
name: promptpay-qr
description: Use when a Thai business needs a PromptPay QR on an invoice or counter, or builds the QR payload.
---

# PromptPay QR (Thai QR Payment)

A PromptPay QR is a text string in EMVCo QR Code Specification for Payment Systems — Merchant-Presented Mode, rendered as a QR image. If even 1 field is wrong, banking apps reject it as "QR ไม่ถูกต้อง".

## 1. Payload structure

Every field is **ID (2 digits) + length (2 digits) + value**. ID 00 first, 63 last; the rest in any order (the examples use 58 · 53 · 54).

| ID | Name | Value |
|---|---|---|
| 00 | Payload format indicator | `01` |
| 01 | Point of initiation | `11` = **static** (reusable, payer types amount) · `12` = **dynamic** (one-time, amount fixed) |
| 29 | Merchant account — PromptPay **credit transfer** | sub-fields below |
| 30 | Merchant account — **bill payment** (Biller ID + references) | sub-fields below |
| 53 | Transaction currency | `764` (THB, ISO 4217) |
| 54 | Transaction amount | e.g. `1500.00` — omit for static |
| 58 | Country code | `TH` |
| 59 / 60 | Merchant name / city | optional for tag 29 |
| 62 | Additional data (bill number, terminal) | optional |
| 63 | CRC | 4 uppercase hex chars, always last |

### Tag 29 sub-fields (person-to-person / small shop)

| Sub-ID | Meaning | Format |
|---|---|---|
| 00 | Application ID | `A000000677010111` |
| 01 | Mobile number | 13 digits: `0066` + number without leading 0 → `0066812345678` |
| 02 | National ID / Tax ID | 13 digits |
| 03 | e-Wallet ID | 15 digits |

### Tag 30 sub-fields (company bill payment)

| Sub-ID | Meaning | Format |
|---|---|---|
| 00 | Application ID | `A000000677010112` |
| 01 | Biller ID | 15 digits — tax ID + 2-digit suffix, issued by the company's bank |
| 02 | Reference 1 | up to 20 chars, e.g. invoice number (bank may require uppercase A–Z, 0–9) |
| 03 | Reference 2 | optional, up to 20 chars |

Tag 30 needs a bill-payment agreement with a bank, but reconciliation is automatic (the bank reports Ref1). Tag 29 needs nothing but a PromptPay ID — reconcile by amount and time.

## 2. CRC16

- Algorithm **CRC-16/CCITT-FALSE**: polynomial `0x1021`, initial `0xFFFF`, no reflection, no final XOR.
- Computed over the whole payload **including the literal `6304`** (ID and length of the CRC field), then the 4 hex digits are appended.
- Self-test: CRC of `123456789` must be `29B1`.

Code and a full byte-by-byte breakdown: [references/payload.md](references/payload.md).

Reference implementations to compare output against (do not copy without reading): **dtinth/promptpay-qr** (MIT, tag 29 only, long established) · **uunw/thai-qr-payment** (MIT, TypeScript, tag 29 and tag 30, CLI and SVG renderer — new repo with 0 stars at check, so read the tests before trusting it). Your payload for the same number and amount must match theirs byte for byte.
ตรวจล่าสุด 2026-10-23 (uunw) · 2026-10-22 (dtinth) · แหล่ง: https://github.com/dtinth/promptpay-qr · https://github.com/uunw/thai-qr-payment

## 3. Worked example (ยังไม่ได้ตรวจกับโค้ดใน references)

Mobile 081-234-5678.

Static (payer enters amount):
```
00020101021129370016A000000677010111011300668123456785802TH530376463045D82
```

Dynamic, 1,500.00 baht:
```
00020101021229370016A000000677010111011300668123456785802TH530376454071500.0063046960
```

Breakdown of the dynamic one: `000201` · `010212` · `2937` [`0016A000000677010111` `01130066812345678`] · `5802TH` · `5303764` · `54071500.00` · `6304` + `6960`.

## 4. Putting it on a quotation or invoice

1. Dynamic QR with the **exact amount due** (after withholding tax if the customer withholds — e.g. 21,400 − 600 = 20,800; see `tax-vat-th`).
2. Place it near the total, at least **2.5 × 2.5 cm** printed, with a quiet zone of 4 modules; label "สแกนชำระผ่าน PromptPay" and the account name the payer will see.
3. Print the invoice number next to it and ask payers to send the slip — for tag 29 there is no reference in the transfer.
4. Quotations: amount may change — use a static QR or regenerate on the invoice. Template in `doc-quotation`; tax invoice fields in `e-tax-invoice`.
5. Re-scan the printed PDF with 2 different bank apps before sending.

## Script

Run `promptpay.mjs` whenever you need a real payload string: do not type the fields, lengths or CRC by hand. It builds the payload for a mobile number, a 13-digit national/tax ID or a 15-digit e-Wallet ID (tag 29), or for a biller ID with Ref1/Ref2 (tag 30), and appends the CRC16. A 13-digit ID must pass the check digit (mod 11), otherwise the script stops and says the number was probably mistyped. Leave `amount` out for a static QR; put it in for a dynamic QR. Its self-test checks the CRC of `123456789` (29B1) and both worked examples in section 3 character by character.

```
node promptpay.mjs <file.json> [--json]     # example file: scripts/example.json
node promptpay.mjs --self-test
```

Input file: `{ "id": "081-234-5678", "amount": 1500 }` · for tag 30: `{ "billerId": "<15 digits>", "ref1": "IV26100001", "ref2": "", "name": "SHOP", "amount": 1500 }`. Dashes and spaces in `id` are ignored. A bad field stops the script with a message naming it (wrong length, Thai or other non-ASCII text in `name` or a reference, amount with more than 2 decimals, Ref1 missing). A Ref1 that is not A–Z 0–9 only gives a warning, because banks differ. The script does not draw the QR: render the payload with a QR library, then scan the printed result with 2 bank apps (section 4).

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/promptpay-qr/scripts/promptpay.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/promptpay-qr/scripts/promptpay.mjs` · Node only, no dependencies.

## Rules

- Never alter a QR image by hand; regenerate from the payload.
- Amount format: dot decimal, no comma, max 13 chars.
- Mobile numbers are converted to `0066…`; a national ID stays 13 digits as is.
- PromptPay ID owner name shown in the app is the bank account name — make sure it matches the company name on the invoice to avoid "is this a scam?" calls.
- For web checkout with automatic confirmation use the bank's or payment gateway's API (callback on payment), not a home-made QR.

ตรวจล่าสุด 2026-10-06 · แหล่ง: Thai QR Code Payment Standard (Bank of Thailand / Thai Bankers' Association) https://www.bot.or.th · EMVCo QRCPS-MPM v1.1 https://www.emvco.com · CRC values computed locally.

## Related

`doc-quotation` · `e-tax-invoice` · `line-chatbot` (send the QR in LINE) · `tax-vat-th`.
