# 13-week cash-flow forecast template

Copy into Google Sheets or Excel. Columns B–N are weeks 1–13 (week starting Monday, write the date in row 1). Every Monday: overwrite last week's column with actuals from `sme-bookkeeping`, then add a new week 13 on the right.

## Tab `lags` — fill from your own history first

| channel | median days order → bank | slowest 10% days | fee % of gross | return / refusal % | note |
|---|---|---|---|---|---|
| shopee | | | | | measured from last month's payout report |
| lazada | | | | | |
| tiktok | | | | | |
| cod-courier | | | | | refused parcels = no cash |
| transfer / promptpay | 0 | 0 | 0 | | |
| b2b invoices | | | | | days after due date customers really pay |

## Tab `forecast`

| Row | Line | How to fill |
|---|---|---|
| 1 | week starting | 2026-10-26, 2026-11-02, … |
| 2 | **opening cash** | B2 = today's bank balance · C2 = `=B20` and so on |
| 3 | payout shopee | sales expected in the week that ends `lag` days earlier × (1 − fee % − return %) |
| 4 | payout lazada | same |
| 5 | payout tiktok | same |
| 6 | COD remittance | COD sales × (1 − refusal %) − COD fee, shifted by courier lag |
| 7 | transfers / PromptPay | expected direct sales |
| 8 | customer invoices due | from the unpaid invoices list, on the realistic date |
| 9 | other in | loan received, owner money in (mark it) |
| 10 | **total in** | `=SUM(B3:B9)` |
| 11 | stock and supplier payments | on the payment date; deposit and balance as separate entries |
| 12 | packaging and shipping paid by you | |
| 13 | ads | card bill or top-up date |
| 14 | rent, utilities, software | |
| 15 | wages and owner draw | pay date |
| 16 | WHT · VAT · social security | due dates from `tax-vat-th` and `social-security-th` |
| 17 | income tax instalment | ภ.ง.ด.94 / 51 / 90 / 50 in the week due |
| 18 | loan repayments, other out | |
| 19 | **total out** | `=SUM(B11:B18)` |
| 20 | **closing cash** | `=B2+B10-B19` |
| 21 | buffer | e.g. 2 weeks of rows 14 + 15 + 18 |
| 22 | below buffer? | `=IF(B20<B21,"ACT","")` · conditional format red |
| 23 | action and owner | what will be done, by whom, by which date |

## Tab `actual-vs-forecast`

| week | forecast closing | actual closing | gap | main reason |
|---|---|---|---|---|
| 2026-10-26 | | | `=C2-B2` | e.g. TikTok payout 4 days later than lag |

A gap that repeats in the same direction means a lag or fee % in tab `lags` is wrong. Fix the input, not each week.
