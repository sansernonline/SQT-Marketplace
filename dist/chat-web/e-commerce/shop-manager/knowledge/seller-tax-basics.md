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
