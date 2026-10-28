# skill: promptpay-qr

Use when a Thai business needs a PromptPay QR on an invoice or counter, or builds the QR payload.

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


---

# skill: seller-tax-basics

Use when a Thai individual selling online asks about tax (40(8), deemed expenses, PND 90 and 94, VAT).

# Seller Tax Basics (Thai individual online seller)

General information, not tax advice — confirm figures at rd.go.th or with a tax accountant (นักบัญชี / ผู้สอบบัญชีภาษีอากร) before filing. Figures are for tax year 2569 (2026) as checked below.

The Revenue Department already sees most online sales: banks and e-wallets report high-volume accounts, and large platforms report seller income. Not filing is no longer invisible.

## Workflow

1. **Classify income** — selling goods online as an individual = เงินได้ตามมาตรา 40(8) ประมวลรัษฎากร
2. **Total gross sales** for the year from every channel (platform payout reports + bank statements for LINE/Facebook), before fees
3. **Choose the expense method** — 60% deemed or actual (table below); compute both
4. **Run the 0.5% minimum-tax check** (below) — it often decides the bill for low-margin shops
5. **File half-year** ภ.ง.ด.94 for January–June sales (by 30 September; e-filing usually extends — รอยืนยัน the year's date)
6. **File full-year** ภ.ง.ด.90 by 31 March of the following year (e-filing usually extends ~8 days — รอยืนยัน), crediting tax paid with ภ.ง.ด.94
7. **Watch the value added tax (VAT) line** monthly — when sales for the year pass ฿1.8 million, register for VAT within 30 days (below)
8. **Keep records** (list below) for at least 5 years (รอยืนยัน the retention period that applies)

## Thresholds and key figures

| Item | Figure |
|---|---|
| Must file when 40(8) and other non-salary income exceeds | ฿60,000 a year single / ฿120,000 married (for filing purposes) |
| Deemed expense for buying-and-reselling goods | 60% of gross |
| Personal allowance | ฿60,000 |
| Minimum-tax check | Applies when non-salary income (40(2)–40(8)) is ฿120,000 or more: tax = 0.5% of that income; if over ฿5,000, pay the higher of normal tax and 0.5% tax |
| Personal income tax brackets (net income) | 0–150,000: exempt · 150,001–300,000: 5% · 300,001–500,000: 10% · 500,001–750,000: 15% · 750,001–1,000,000: 20% · 1,000,001–2,000,000: 25% · 2,000,001–5,000,000: 30% · above 5,000,000: 35% |
| VAT registration | Compulsory once annual sales exceed ฿1.8 million; register (ภ.พ.01) within 30 days of exceeding; then file ภ.พ.30 every month, even with zero sales: paper by the 15th, e-filing by the 23rd |
| VAT rate | 7% (reduced from the statutory 10%), extended by พ.ร.ฎ. (ฉบับที่ 807) พ.ศ. 2569 to 30 Sep 2570 |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.rd.go.th · https://flowaccount.com/blog/shopee-income-tax-threshold/ · https://www.thairath.co.th/money/personal_finance/finance_banking/2778210 · https://www.prd.go.th/th/content/category/detail/id/33/iid/526275 (VAT 7% to 30 Sep 2570, same source as `tax-vat-th`) · ตรวจซ้ำ 2026-10-22: พ.ร.ฎ. ฉบับที่ 807 พ.ศ. 2569 ลงราชกิจจานุเบกษา 23 ส.ค. 2569 มีผล 1 ต.ค. 2569 (ไฟล์กรมสรรพากร https://rd.go.th/fileadmin/user_upload/kormor/newlaw/dc807.pdf มีจริง แต่อ่านข้อความไม่ออก · วัน/เลขฉบับจาก lookuptax.com และข่าว — ตรวจกับราชกิจจาฯ อีกครั้ง) · 40(8) หักเหมา 60% อัตราเดียว: ข่าวกรมสรรพากร ต.ค. 2560 https://media.thaigov.go.th (ยังไม่ได้เทียบประกาศฉบับปัจจุบัน)

## 60% deemed vs actual expenses

| Use | When |
|---|---|
| **60% deemed (หักเหมา)** | Real costs are below 60% of sales (high-margin products, handmade, digital) or the seller has no receipts |
| **Actual (หักตามจริง)** | Real costs are above 60% (most resellers on thin margins) **and** every cost has a proper receipt or tax invoice: goods bought, packaging, platform fees, shipping, ads, rent |

You choose per tax year; switching to actual means you must be able to prove every baht.

## Worked example — single reseller, tax year 2569

Gross sales ฿1,200,000 (all channels). Actual costs with receipts ฿900,000. No other income, only the personal allowance.

| | 60% deemed | Actual |
|---|---|---|
| Expense | 720,000 | 900,000 |
| Net after expense | 480,000 | 300,000 |
| Less personal allowance | 60,000 | 60,000 |
| Net income | 420,000 | 240,000 |
| Tax by brackets | 7,500 + 12,000 = **19,500** | 4,500 |
| 0.5% minimum check (0.5% × 1,200,000) | 6,000 | 6,000 → higher than 4,500 and over ฿5,000 |
| **Tax payable** | **19,500** | **6,000** |

Actual expenses win, but only with receipts — and the 0.5% minimum lifts the bill from ฿4,500 to ฿6,000. Sales are under ฿1.8 million, so no VAT registration yet; as sales grow, check monthly.

## Who reports your sales to the Revenue Department

| Reporter | Rule |
|---|---|
| Banks, e-wallets, payment providers — กฎหมาย e-Payment (พ.ร.บ.แก้ไขเพิ่มเติมประมวลรัษฎากร ฉบับที่ 48 พ.ศ. 2562) | Report accounts that **receive more than 3,000 deposits/transfers a year**, or **more than 400 transactions with a total above ฿2 million a year**, counted per institution |
| E-commerce platforms (ประกาศอธิบดีกรมสรรพากร, from accounting periods starting 1 Jan 2567) | Platforms registered in Thailand with revenue above ฿1,000 million a year keep a special account and send seller income data within 150 days after year-end |

Being reported is not a tax bill; it means the Revenue Department can compare your filing with the data.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.kasikornbank.com/th/kwealth/Pages/e-payment-tax.aspx · https://brandinside.asia/?p=160771 · thresholds as reported; regulation text (รอยืนยัน) at rd.go.th

## Registration

- **ทะเบียนพาณิชย์ (commercial registration)** — online sellers are required to register with the local registrar or กรมพัฒนาธุรกิจการค้า (DBD) within 30 days of starting (รอยืนยัน current exemptions); then the DBD Registered trust mark is possible
- **VAT** — see thresholds; voluntary registration earlier is allowed but adds monthly filing
- **Company** — consider when net profit regularly pushes the owner into the 25%+ bracket; ask an accountant

## Records to keep

- Platform monthly income/payout reports and fee invoices (Shopee, Lazada, TikTok Shop each provide downloadable statements)
- Bank and e-wallet statements for LINE/Facebook sales
- Purchase receipts and tax invoices for stock, packaging, shipping, ads
- Stock records (`multi-shop-stock`) — they back up the cost of goods sold
- Copies of ภ.ง.ด.94, ภ.ง.ด.90, ภ.พ.30 and payment receipts

## Related

- `marketplace-fees-pricing` — VAT `v` in the price formula after registering
- `doc-quotation` — invoices and receipts; `tax-vat-th` — VAT filing calendar
- `trading-finance` `tax-basics-th` (if installed) — other personal income (investments) in the same ภ.ง.ด.90
