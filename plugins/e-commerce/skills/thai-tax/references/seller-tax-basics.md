<!-- merged from skill `seller-tax-basics` on 2026-11-27 · description was: Use when a Thai individual online seller asks about tax -->
# Seller Tax Basics — what a Thai individual online seller files, owes and keeps

General information, not tax advice: confirm figures at rd.go.th or with a tax accountant (นักบัญชี / ผู้สอบบัญชีภาษีอากร) before filing. The Revenue Department already sees most online sales (banks, e-wallets and large platforms report sellers), so not filing is no longer invisible.

## Use when
- A Thai individual selling online (Shopee · Lazada · TikTok Shop · LINE · Facebook) asks whether to file, what is owed, 60% deemed vs actual expenses, or when to register VAT.

Not for: payroll or salary → `thai-employment` · VAT filing calendar → `tax-vat-th.md` · company vs sole trader → `thai-business-setup` section 2.

## Steps
1. **Classify income**: selling goods online as an individual is เงินได้ตามมาตรา 40(8) ประมวลรัษฎากร.
2. **Total gross sales** for the year from every channel (platform payout reports + bank statements for LINE/Facebook), before fees.
3. **Run the script** (below): it compares 60% deemed and actual expenses, applies the 0.5% minimum-tax check, and says which is cheaper. Do not add up by hand.
4. **File half-year ภ.ง.ด.94** for January–June sales by 30 September (e-filing extension for this form is not confirmed; `tax-vat-th.md` section 2 lists only VAT and withholding forms).
5. **File full-year ภ.ง.ด.90** by 31 March of the following year (31 March 2570 on paper; e-Filing = paper deadline + the current extension if its window covers this date, look it up live per `tax-vat-th.md` section 2), crediting tax paid with ภ.ง.ด.94.
6. **Watch VAT monthly**: when sales for the year pass the VAT line, register (ภ.พ.01) by the deadline in `tax-vat-th.md` section 1, then file ภ.พ.30 every month even with zero sales (paper by the 15th; e-Filing = paper deadline + the current extension, `tax-vat-th.md` section 2).
7. **Keep records** (list in the reference). Retention: `shop-books` → `references/sme-bookkeeping.md` section 2, 5 years minimum, 7 recommended, per a Revenue Department ruling not yet checked against the current statute.

## Key figures (last checked 2026-10-06)

| Item | Figure |
|---|---|
| Must file when 40(8) and other non-salary income exceeds | ฿60,000 a year single / ฿120,000 married |
| Deemed expense for buying-and-reselling goods | 60% of gross |
| Personal allowance | ฿60,000 |
| Minimum-tax check | When non-salary income (40(2)–40(8)) is ฿120,000 or more: tax = 0.5% of that income; if over ฿5,000, pay the higher of normal tax and 0.5% tax |
| Income tax brackets (net income) | Table below |
| VAT registration | Threshold and deadline: `tax-vat-th.md` section 1 |
| VAT rate | 7% (reduced from the statutory 10%), extended by พ.ร.ฎ. (ฉบับที่ 807) พ.ศ. 2569 to 30 Sep 2570 |

### Income tax brackets (last checked 2026-10-06)

The one copy of this table; `thai-employment` and `thai-business-setup` link here.

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

**Script path:** installed: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/thai-tax/scripts/tax-compare.mjs | sort -V | tail -1` · in the repo: `plugins/e-commerce/skills/thai-tax/scripts/tax-compare.mjs` · Node only. Rates live in `scripts/rates.json` with their check date; the report prints it and warns when older than 90 days. `allowances` is the year's total (default: personal ฿60,000 only). Salary or other income types are out of scope. Sole trader vs company: `"mode": "company"`.

## Check before done
- Figures carry the check date and the not-tax-advice note.
- Both methods were compared; the 0.5% minimum was applied.
- Actual expenses are recommended only with receipts for every cost.
- Year's sales were checked against the VAT threshold in `tax-vat-th.md` section 1.

Related: `pricing-and-costs` (VAT `v` in the price formula) · `thai-business-docs` (invoices and receipts) · `income-tax-th` of `trading-finance` (investment income in the same ภ.ง.ด.90).

## References
- [`reporting-and-records.md`](reporting-and-records.md) — open to explain who reports sales (banks, platforms), commercial registration, which records to keep, or to show a worked 60% vs actual example.
- [`sources.md`](seller-tax-basics/sources.md) — sources and check dates behind the figures.
