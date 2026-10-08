# skill: promptpay-qr

Use when a Thai business needs a PromptPay QR on an invoice or counter, or a developer builds or debugs the Thai QR payload (tag 29 vs 30, CRC16).

# PromptPay QR (Thai QR Payment)

A PromptPay QR is a text string in EMVCo QR Code Specification for Payment Systems — Merchant-Presented Mode, rendered as a QR image. If even 1 field is wrong, banking apps reject it as "QR ไม่ถูกต้อง".

## 1. Payload structure

Every field is **ID (2 digits) + length (2 digits) + value**. Order as below.

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

## 3. Worked example (verified with the code in references)

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

## Rules

- Never alter a QR image by hand; regenerate from the payload.
- Amount format: dot decimal, no comma, max 13 chars.
- Mobile numbers are converted to `0066…`; a national ID stays 13 digits as is.
- PromptPay ID owner name shown in the app is the bank account name — make sure it matches the company name on the invoice to avoid "is this a scam?" calls.
- For web checkout with automatic confirmation use the bank's or payment gateway's API (callback on payment), not a home-made QR.

ตรวจล่าสุด 2026-10-06 · แหล่ง: Thai QR Code Payment Standard (Bank of Thailand / Thai Bankers' Association) https://www.bot.or.th · EMVCo QRCPS-MPM v1.1 https://www.emvco.com · CRC values computed locally.

## Related

`doc-quotation` · `e-tax-invoice` · `line-chatbot` (send the QR in LINE) · `tax-vat-th`.


## reference: payload.md

# PromptPay payload — code and breakdown

## Generator (Node.js, no dependencies)

```js
const field = (id, v) => id + String(v.length).padStart(2, '0') + v;

function crc16(s) {                       // CRC-16/CCITT-FALSE
  let c = 0xFFFF;
  for (const b of Buffer.from(s, 'ascii')) {
    c ^= b << 8;
    for (let i = 0; i < 8; i++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
  }
  return c.toString(16).toUpperCase().padStart(4, '0');
}

function promptpay(id, amount) {          // id: mobile (10 digits) or national/tax ID (13)
  const sub = id.length === 13 ? field('02', id) : field('01', '0066' + id.replace(/^0/, ''));
  const acct = field('00', 'A000000677010111') + sub;
  const body = field('00', '01') + field('01', amount ? '12' : '11') + field('29', acct)
    + field('58', 'TH') + field('53', '764') + (amount ? field('54', amount.toFixed(2)) : '') + '6304';
  return body + crc16(body);
}

console.log(promptpay('0812345678'));        // ...63045D82
console.log(promptpay('0812345678', 1500));  // ...63046960
console.log(crc16('123456789'));             // 29B1  (self-test)
```

Render the string with any QR library (error correction M is common). Python equivalent: `crcmod` predefined `crc-ccitt-false`, or port the loop.

## Byte-by-byte (dynamic, 1,500.00 to 081-234-5678)

| Segment | ID | Len | Value |
|---|---|---|---|
| `000201` | 00 | 02 | `01` |
| `010212` | 01 | 02 | `12` dynamic |
| `2937…` | 29 | 37 | sub-fields ↓ |
| `0016A000000677010111` | 29.00 | 16 | AID credit transfer |
| `01130066812345678` | 29.01 | 13 | mobile in 0066 form |
| `5802TH` | 58 | 02 | `TH` |
| `5303764` | 53 | 03 | `764` |
| `54071500.00` | 54 | 07 | `1500.00` |
| `6304` | 63 | 04 | CRC follows |
| `6960` | | | CRC-16 of everything before, including `6304` |

## Bill payment (tag 30) shape

```
000201 010212
30 LL [0016A000000677010112] [0115{BillerID15}] [02LL{Ref1}] [03LL{Ref2}]
5303764 54LL{amount} 5802TH 5913{MERCHANT NAME} 6304{CRC}
```

Biller ID and allowed reference formats come from the company's bank — ask for the bill-payment spec sheet.

## Debugging rejects

| Symptom | Likely cause |
|---|---|
| "QR ไม่ถูกต้อง" in every app | CRC wrong — computed without `6304`, or lowercase hex |
| Wrong recipient / not found | Mobile left as `081…` instead of `0066 81…` |
| Amount ignored | Point of initiation left `11` while tag 54 present (use `12`) |
| Works in one bank only | Length byte miscounted on a nested sub-field (tag 29/30 length must equal the total of its sub-fields) |
