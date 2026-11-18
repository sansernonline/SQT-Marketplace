# skill: promptpay-qr

Use when a Thai business needs a PromptPay QR

# PromptPay QR (Thai QR Payment) — a correct payload string for a QR, placed on a quotation or invoice

> **One rule:** if even 1 field is wrong, banking apps reject the QR as "QR ไม่ถูกต้อง". Never type fields, lengths or CRC by hand; generate the payload with `promptpay.mjs`.

## Use when
- A Thai business needs a PromptPay QR for a person, shop or company (mobile number · 13-digit national/tax ID · 15-digit e-Wallet ID · biller ID).
- Putting a QR on a quotation or invoice, or debugging a QR a bank app rejects.
- Checking that a customer's payment really arrived before shipping.

Not for: quotation template → `doc-quotation` · tax invoice fields → `e-tax-invoice` · VAT and withholding → `tax-vat-th` · sending the QR in LINE → `line-chatbot` · web checkout with automatic confirmation → the bank's or payment gateway's API, not a home-made QR.

## Steps
1. **Choose the tag.** Tag 29 (credit transfer, `A000000677010111`) needs only a PromptPay ID; reconcile by amount and time. Tag 30 (bill payment, `A000000677010112`, Biller ID 15 digits + Ref1 up to 20 chars + optional Ref2) needs a bill-payment agreement with a bank, but the bank reports Ref1 for automatic reconciliation. Static (`01`=`11`) has no amount; dynamic (`01`=`12`) has a fixed amount in tag 54. Field tables, CRC and byte-by-byte examples: [`references/field-tables.md`](references/field-tables.md), code: [`references/payload.md`](references/payload.md).
2. **Run the script** for every real payload. It builds tag 29 (mobile, 13-digit ID, or 15-digit e-Wallet ID) or tag 30 (biller ID with Ref1/Ref2) and appends the CRC16 (CRC-16/CCITT-FALSE, poly `0x1021`, init `0xFFFF`, computed over the payload including the literal `6304`). A 13-digit ID must pass the check digit (mod 11) or the script stops: the number is probably mistyped. Leave `amount` out for a static QR.
   ```
   node promptpay.mjs <file.json> [--json]     # example file: scripts/example.json
   node promptpay.mjs --self-test
   ```
   Input: `{ "id": "081-234-5678", "amount": 1500 }` · tag 30: `{ "billerId": "<15 digits>", "ref1": "IV26100001", "ref2": "", "name": "SHOP", "amount": 1500 }`. Dashes and spaces in `id` are ignored. A bad field stops the script with a message naming it (wrong length, non-ASCII text in `name` or a reference, amount with more than 2 decimals, Ref1 missing). A Ref1 outside A–Z 0–9 only warns, because banks differ. The self-test checks the CRC of `123456789` (`29B1`) and both worked examples. The script does not draw the QR: render the payload with a QR library (error correction M is common).
   **Script path:** installed: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/promptpay-qr/scripts/promptpay.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/promptpay-qr/scripts/promptpay.mjs` · Node only, no dependencies.
3. **Put it on a quotation or invoice.**
   - Use a dynamic QR with the exact amount due, after withholding tax if the customer withholds (for example 21,400 − 600 = 20,800; see `tax-vat-th`).
   - Place it near the total, at least 2.5 × 2.5 cm printed, with a quiet zone of 4 modules; label "สแกนชำระผ่าน PromptPay" and the account name the payer will see.
   - Print the invoice number next to it and ask payers to send the slip (tag 29 carries no reference).
   - On a quotation the amount may change: use a static QR, or regenerate on the invoice.
   - Re-scan the printed PDF with 2 different bank apps before sending and read out the account name each shows; it must match the business name on the invoice. A QR that scans but shows another name goes to someone else: stop and recheck the ID.
4. **If a bank app rejects the QR,** the usual causes are a wrong CRC (computed without `6304`, or lowercase hex), mobile left as `081…` instead of `0066 81…`, or point of initiation `11` with tag 54 present. Table in [`references/payload.md`](references/payload.md).
5. **Before shipping, check the money arrived, not the slip** (a slip is a picture that can be edited or reused). Open the shop's bank app or statement and find the transfer: amount, time and payer name match the order. One transfer pays one order; the same slip on two orders means the second has not paid. Never ship on a slip alone, even for a regular customer, and do not accept "the bank is slow, I'll send proof later". Suggest turning on the bank's incoming-transfer notification. For many orders a day, use a payment gateway or the bank's API with a payment callback instead of reading slips.

## Check before done
- [ ] The payload came from `promptpay.mjs` (or matches the reference implementations in `references/sources.md` byte for byte), and `--self-test` passes.
- [ ] Amount format: dot decimal, no comma, max 13 chars; mobile converted to `0066…`, national ID stays 13 digits.
- [ ] The QR image was regenerated from the payload, never altered by hand.
- [ ] The printed PDF was scanned with 2 bank apps and the account name matches the invoice.

## References
- [`references/field-tables.md`](references/field-tables.md) — open to read or check a payload by hand (tags, sub-fields, CRC, worked examples)
- [`references/payload.md`](references/payload.md) — open for generator code, byte-by-byte breakdown, reject debugging
- [`references/sources.md`](references/sources.md) — open to compare against reference implementations and re-check standard sources (checked 2026-10-06 to 2026-10-23)


## reference: field-tables.md

# Field tables and worked examples · promptpay-qr

Open when you must read or check a payload by hand, or explain why a bank app rejects it. For code and a byte-by-byte breakdown see [payload.md](payload.md).

## Payload structure

A PromptPay QR is a text string in EMVCo QR Code Specification for Payment Systems — Merchant-Presented Mode, rendered as a QR image. Every field is **ID (2 digits) + length (2 digits) + value**. ID 00 first, 63 last; the rest in any order (the examples use 58 · 53 · 54).

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

## CRC16

- Algorithm **CRC-16/CCITT-FALSE**: polynomial `0x1021`, initial `0xFFFF`, no reflection, no final XOR.
- Computed over the whole payload **including the literal `6304`** (ID and length of the CRC field), then the 4 hex digits are appended.
- Self-test: CRC of `123456789` must be `29B1`.

## Worked example (ตรวจด้วย `promptpay.mjs --self-test`)

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


## reference: sources.md

# Sources · promptpay-qr

Reference implementations to compare output against (do not copy without reading): **dtinth/promptpay-qr** (MIT, tag 29 only, long established) · **uunw/thai-qr-payment** (MIT, TypeScript, tag 29 and tag 30, CLI and SVG renderer — new repo with 0 stars at check, so read the tests before trusting it). Your payload for the same number and amount must match theirs byte for byte.

ตรวจล่าสุด 2026-10-23 (uunw) · 2026-10-22 (dtinth) · แหล่ง: https://github.com/dtinth/promptpay-qr · https://github.com/uunw/thai-qr-payment

ตรวจล่าสุด 2026-10-06 · แหล่ง: Thai QR Code Payment Standard (Bank of Thailand / Thai Bankers' Association) https://www.bot.or.th · EMVCo QRCPS-MPM v1.1 https://www.emvco.com · CRC values computed locally.


---

# skill: seller-tax-basics

Use when a Thai individual online seller asks about tax

# Seller Tax Basics — what a Thai individual online seller files, owes and keeps

General information, not tax advice: confirm figures at rd.go.th or with a tax accountant (นักบัญชี / ผู้สอบบัญชีภาษีอากร) before filing. The Revenue Department already sees most online sales (banks, e-wallets and large platforms report sellers), so not filing is no longer invisible.

## Use when
- A Thai individual selling online (Shopee · Lazada · TikTok Shop · LINE · Facebook) asks whether to file, what is owed, 60% deemed vs actual expenses, or when to register VAT.

Not for: payroll or salary → `payroll-th` · VAT filing calendar → `tax-vat-th` · company vs sole trader → `thai-business-setup` section 2.

## Steps
1. **Classify income**: selling goods online as an individual is เงินได้ตามมาตรา 40(8) ประมวลรัษฎากร.
2. **Total gross sales** for the year from every channel (platform payout reports + bank statements for LINE/Facebook), before fees.
3. **Run the script** (below): it compares 60% deemed and actual expenses, applies the 0.5% minimum-tax check, and says which is cheaper. Do not add up by hand.
4. **File half-year ภ.ง.ด.94** for January–June sales by 30 September (e-filing extension for this form is not confirmed; `tax-vat-th` section 2 lists only VAT and withholding forms).
5. **File full-year ภ.ง.ด.90** by 31 March of the following year (31 March 2570 on paper; e-Filing = paper deadline + the current extension if its window covers this date, look it up live per `tax-vat-th` section 2), crediting tax paid with ภ.ง.ด.94.
6. **Watch VAT monthly**: when sales for the year pass the VAT line, register (ภ.พ.01) by the deadline in `tax-vat-th` section 1, then file ภ.พ.30 every month even with zero sales (paper by the 15th; e-Filing = paper deadline + the current extension, `tax-vat-th` section 2).
7. **Keep records** (list in the reference). Retention: `sme-bookkeeping` section 2, 5 years minimum, 7 recommended, per a Revenue Department ruling not yet checked against the current statute.

## Key figures (last checked 2026-10-06)

| Item | Figure |
|---|---|
| Must file when 40(8) and other non-salary income exceeds | ฿60,000 a year single / ฿120,000 married |
| Deemed expense for buying-and-reselling goods | 60% of gross |
| Personal allowance | ฿60,000 |
| Minimum-tax check | When non-salary income (40(2)–40(8)) is ฿120,000 or more: tax = 0.5% of that income; if over ฿5,000, pay the higher of normal tax and 0.5% tax |
| Income tax brackets (net income) | Table below |
| VAT registration | Threshold and deadline: `tax-vat-th` section 1 |
| VAT rate | 7% (reduced from the statutory 10%), extended by พ.ร.ฎ. (ฉบับที่ 807) พ.ศ. 2569 to 30 Sep 2570 |

### Income tax brackets (last checked 2026-10-06)

The one copy of this table; `payroll-th` and `thai-business-setup` link here.

| Net income (baht/year) | Rate | Tax on band | Cumulative at top |
|---|---|---|---|
| 0 – 150,000 | exempt | 0 | 0 |
| 150,001 – 300,000 | 5% | 7,500 | 7,500 |
| 300,001 – 500,000 | 10% | 20,000 | 27,500 |
| 500,001 – 750,000 | 15% | 37,500 | 65,000 |
| 750,001 – 1,000,000 | 20% | 50,000 | 115,000 |
| 1,000,001 – 2,000,000 | 25% | 250,000 | 365,000 |
| 2,000,001 – 5,000,000 | 30% | 900,000 | 1,265,000 |
| over 5,000,000 | 35% | | |

**60% deemed (หักเหมา)** fits when real costs are below 60% of sales (high margin, handmade, digital) or there are no receipts. **Actual (หักตามจริง)** fits when real costs are above 60% (most thin-margin resellers) **and** every cost has a proper receipt or tax invoice. Choose per tax year; actual means you must prove every baht.

## Script

```bash
node scripts/tax-compare.mjs scripts/example.json      # { "sales": 1200000, "actual_expenses": 900000 } → 19,500 vs 6,000
node scripts/tax-compare.mjs --self-test
```

**Script path:** installed: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/seller-tax-basics/scripts/tax-compare.mjs | sort -V | tail -1` · in the repo: `plugins/e-commerce/skills/seller-tax-basics/scripts/tax-compare.mjs` · Node only. Rates live in `scripts/rates.json` with their check date; the report prints it and warns when older than 90 days. `allowances` is the year's total (default: personal ฿60,000 only). Salary or other income types are out of scope. Sole trader vs company: `"mode": "company"`.

## Check before done
- Figures carry the check date and the not-tax-advice note.
- Both methods were compared; the 0.5% minimum was applied.
- Actual expenses are recommended only with receipts for every cost.
- Year's sales were checked against the VAT threshold in `tax-vat-th` section 1.

Related: `marketplace-fees-pricing` (VAT `v` in the price formula) · `doc-quotation` (invoices and receipts) · `tax-basics-th` of `trading-finance` (investment income in the same ภ.ง.ด.90).

## References
- [`references/reporting-and-records.md`](references/reporting-and-records.md) — open to explain who reports sales (banks, platforms), commercial registration, which records to keep, or to show a worked 60% vs actual example.
- [`references/sources.md`](references/sources.md) — sources and check dates behind the figures.


## reference: reporting-and-records.md

# Reporting, registration, records, worked example · seller-tax-basics

## Who reports your sales to the Revenue Department

| Reporter | Rule |
|---|---|
| Banks, e-wallets, payment providers — กฎหมาย e-Payment (พ.ร.บ.แก้ไขเพิ่มเติมประมวลรัษฎากร ฉบับที่ 48 พ.ศ. 2562) | Report accounts that **receive more than 3,000 deposits/transfers a year**, or **more than 400 transactions with a total above ฿2 million a year**, counted per institution |
| E-commerce platforms (ประกาศอธิบดีกรมสรรพากร, from accounting periods starting 1 Jan 2567) | Platforms registered in Thailand with revenue above ฿1,000 million a year keep a special account and send seller income data within 150 days after year-end |

Being reported is not a tax bill; it means the Revenue Department can compare your filing with the data.

## Registration

- **ทะเบียนพาณิชย์ (commercial registration)** — online sellers are required to register with the local registrar or กรมพัฒนาธุรกิจการค้า (DBD) within 30 days of starting (รอยืนยัน current exemptions); then the DBD Registered trust mark is possible
- **VAT** — voluntary registration earlier is allowed but adds monthly filing
- **Company** — consider when net profit regularly pushes the owner into the 25%+ bracket; ask an accountant

## Records to keep

- Platform monthly income/payout reports and fee invoices (Shopee, Lazada, TikTok Shop each provide downloadable statements)
- Bank and e-wallet statements for LINE/Facebook sales
- Purchase receipts and tax invoices for stock, packaging, shipping, ads
- Stock records (`multi-shop-stock`) — they back up the cost of goods sold
- Copies of ภ.ง.ด.94, ภ.ง.ด.90, ภ.พ.30 and payment receipts

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


## reference: sources.md

# Sources · seller-tax-basics

Thresholds and rates (income tax, 40(8), VAT) · last checked 2026-10-06
- https://www.rd.go.th
- https://flowaccount.com/blog/shopee-income-tax-threshold/
- https://www.thairath.co.th/money/personal_finance/finance_banking/2778210
- https://www.prd.go.th/th/content/category/detail/id/33/iid/526275 (VAT 7% to 30 Sep 2570, same source as `tax-vat-th`)
- Rechecked 2026-10-22: Royal Decree (พ.ร.ฎ.) No. 807 B.E. 2569, published in the Royal Gazette (ราชกิจจานุเบกษา) 23 Aug 2569, effective 1 Oct 2569. The Revenue Department file https://rd.go.th/fileadmin/user_upload/kormor/newlaw/dc807.pdf exists but its text cannot be read; date and number come from lookuptax.com and news; check again against the Royal Gazette.
- Section 40(8) flat 60% standard deduction: Revenue Department news, Oct 2560 https://media.thaigov.go.th (not yet compared with the current announcement).
- Brackets are from the tax year 2568 ภ.ง.ด.90 instructions, same as `thai-business-setup` section 2; no change announced for tax year 2569 as of the check date.

Who reports sales (ตรวจล่าสุด 2026-10-06) · แหล่ง: https://www.kasikornbank.com/th/kwealth/Pages/e-payment-tax.aspx · https://brandinside.asia/?p=160771 · thresholds as reported; regulation text (รอยืนยัน) at rd.go.th
