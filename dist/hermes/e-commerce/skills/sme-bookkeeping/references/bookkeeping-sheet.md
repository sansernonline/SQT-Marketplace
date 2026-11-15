# Bookkeeping sheet template

Copy into Google Sheets or Excel. One tab per year, one row per money movement. Amounts in baht, 2 decimals. Dates as YYYY-MM-DD (Gregorian) in the sheet; write the Buddhist year only on documents that ask for it.

## Tab `journal`

| Column | Header | Example | Rule |
|---|---|---|---|
| A | date | 2026-10-03 | Date money moved (payout date, transfer date) |
| B | channel | shopee | shopee · lazada · tiktok · line · facebook · web · cod-courier · bank · cash |
| C | doc_no | SP-2610-001 | Platform report ID, receipt or tax invoice number; `none` → put it on the to-fix list |
| D | description | Shopee settlement wk 40 | Plain words |
| E | category | sales | See category list below |
| F | money_in | 18,500.00 | Gross income only |
| G | money_out | | Expenses and owner draws |
| H | vat | | VAT on this row (VAT-registered only) |
| I | wht | | Withholding tax deducted from or by you on this row |
| J | balance | `=J2+F3-G3` (from row 3 down) | Running balance; row 2 is the opening balance (ยอดยกมา) typed by hand; must equal bank at month end |
| K | filed | Y | Y = document scanned into `YYYY-MM` folder |
| L | note | | Why a document is missing, who to chase |

## Category list (column E)

| Category | In or out | Counts as business expense |
|---|---|---|
| sales | in | — |
| other-income | in | — |
| stock | out | yes (cost of goods) |
| packaging | out | yes |
| platform-fee | out | yes (commission, transaction, service fees, each a row) |
| shipping | out | yes (incl. COD fee) |
| ads | out | yes |
| rent-utilities | out | yes |
| software | out | yes |
| wages | out | yes (with payroll records, `payroll-th`) |
| tax-paid | out | no — tax payments, kept for reconciliation |
| owner-draw | out | **no** |
| owner-in | in | **no** (owner putting money in is not sales) |
| transfer | in/out | no — moves between own accounts |

## Tab `month` (one row per month)

| month | sales | expenses | profit | owner_draw | bank_end | journal_end | match | ytd_sales |
|---|---|---|---|---|---|---|---|---|
| 2026-10 | `=SUMIFS(journal!F:F,journal!E:E,"sales",…)` | `=SUMIFS(…expense categories…)` | `=B2-C2` | `=SUMIFS(journal!G:G,journal!E:E,"owner-draw",…)` | from bank statement | last `balance` | `=F2=G2` | running total → watch 1.8 M VAT line |

## Tab `to-fix`

| date | journal row | problem | action | done |
|---|---|---|---|---|
| 2026-10-07 | 14 | ad receipt missing | download from Meta billing | |
