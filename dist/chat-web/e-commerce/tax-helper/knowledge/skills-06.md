# skill: sme-bookkeeping

Use when a Thai shop or SME keeps its books (income-expense journal, receipts to keep, month-end close, รายงานเงินสดรับ-จ่าย, hire an accountant).

# SME Bookkeeping (Thai small business and online seller)

Record every baht that comes in or goes out, keep the paper that proves it, and close each month so tax filing is copying numbers, not detective work. General information, not accounting or tax advice. A bookkeeper (ผู้ทำบัญชี) or accountant (สำนักงานบัญชี) confirms what applies to you.

> **One rule:** one bank account for the business, one row per money movement, one document behind every row. Without the document the expense cannot be deducted at actual cost.

## Use when / not when

| Situation | Use |
|---|---|
| Starting books, messy records, "where did the money go", preparing for an accountant | this skill |
| Will cash run out in the coming weeks | `cash-flow` |
| Which tax form, which date, WHT rates | `tax-vat-th` |
| Individual seller's income tax (40(8), 60% deemed vs actual, ภ.ง.ด.90/94) | `seller-tax-basics` |
| Issuing quotation, invoice, receipt | `doc-quotation` · tax invoice rules → `e-tax-invoice` |
| Payroll, ภ.ง.ด.1, social security | `payroll-th` · `social-security-th` · playbook `monthly-close` |
| Company year end (audit, DBD e-Filing, ภ.ง.ด.50) | `dbd-annual-filing` |

## 1. Who must keep what

| You are | Records the law asks for |
|---|---|
| Individual (บุคคลธรรมดา) with business income 40(5)–40(8), **not** VAT-registered — most small online sellers | **รายงานเงินสดรับ-จ่าย** (cash receipts and payments report) in the Revenue Department's format. It is also the evidence that lets you deduct actual expenses instead of the 60% deemed rate |
| VAT-registered (individual or juristic) | Sales tax report, purchase tax report, and goods and raw materials report (รายงานภาษีขาย · ภาษีซื้อ · สินค้าและวัตถุดิบ), plus tax invoices and copies |
| Registered partnership, company limited (ห้างหุ้นส่วนจดทะเบียน · บริษัทจำกัด) | Full accounts under the Accounting Act B.E. 2543 (พ.ร.บ.การบัญชี พ.ศ. 2543), kept by a qualified bookkeeper, plus audited financial statements each year (`dbd-annual-filing`) |

ตรวจล่าสุด 2026-10-25 · แหล่ง: https://www.rd.go.th/38625.html (กรมสรรพากร "ผู้มีหน้าที่จัดทำรายงานเงินสดรับ-จ่าย" · ผู้ไม่ได้จด VAT ที่มีเงินได้ 40(5)–(8)) · https://www.krungsri.com/th/krungsri-the-coach/taxes/tax-knowledge/income-expense-accounting-manual · https://flowaccount.com/blog/income-expense-accounting-record/ · the exact announcement number and how many days after a transaction an entry must be made (รอยืนยัน)

The Department of Business Development (DBD) sets the time limits for posting entries in a company's books (cash, journals, ledger, stock). Figures often quoted online were not found in an official text (รอยืนยัน). Ask your bookkeeper; in practice, post weekly and never later than month end.

## 2. How long to keep documents

| Rule | Keep | From |
|---|---|---|
| Accounting Act B.E. 2543 section 14 — books and supporting documents | at least **5 years** | the date the accounts are closed (ปิดบัญชี) |
| Revenue Code section 87/3 — VAT reports, tax invoices and copies | at least **5 years** | the date the return was filed |
| Either authority may order longer | up to **7 years** | — |

Keep **7 years** for anything about money: it covers both rules and the extension. Paper or clean scans both work for your own file; the original tax invoice is what backs an input VAT claim, so keep originals until your accountant says otherwise.

ตรวจล่าสุด 2026-10-25 · แหล่ง: https://rd.go.th/25306.html (ข้อหารือกรมสรรพากร อ้าง พ.ร.บ.การบัญชี ม.14 · 5 ปีนับแต่วันปิดบัญชี · ขยายไม่เกิน 7 ปี) · https://rd.go.th/28312.html (กค 0706/4151 · 20 เม.ย. 2550 · ม.87/3 · 5 ปีนับแต่วันยื่นแบบ · ขยายไม่เกิน 7 ปี) · https://www.ofm.co.th/blog/organize-accounting-documents-2026/ · ข้อหารือทั้ง 2 ฉบับเก่า ยังไม่ได้เทียบตัวบทปัจจุบันในราชกิจจานุเบกษา

## 3. Separate personal and business money first

1. Open **one bank account used only for the business**. Every platform payout, courier COD remittance and customer transfer lands there; every supplier, ad and courier bill is paid from it.
2. The owner takes money out as a fixed **owner draw** (individual) or **salary or dividend** (company), on one date a month, recorded as such. Not as random top-ups and withdrawals.
3. A business bill paid from a personal card: record it the same day as "owner paid for business" and keep the receipt. A personal bill paid from the business account: record as owner draw. Never leave either unrecorded.
4. Company money is not the owner's money. A company paying personal bills creates a loan to a director that the accountant must explain at year end.

Why: mixed accounts make the bank statement useless as evidence, and the Revenue Department compares bank and platform data with your return (`seller-tax-basics`, "Who reports your sales").

## 4. The journal — one row per money movement

Template: [references/bookkeeping-sheet.md](references/bookkeeping-sheet.md). Columns: date · channel · document no. · description · category · money in · money out · VAT · WHT · balance · document filed (Y/N).

Sources to copy from, in this order each week:

| Source | What to record |
|---|---|
| Marketplace payout / settlement report (Shopee, Lazada, TikTok Shop seller centre) | **Gross sales** as income, and **commission, transaction, service and shipping fees** as separate expense rows. Do not record only the net payout: the gross figure is what tax is based on and what the platforms report |
| Courier COD remittance statement | Gross COD collected as income; COD fee as expense |
| Bank statement | Every line not already covered above: direct transfers, PromptPay, supplier payments, ads, rent, owner draws |
| Purchase receipts and tax invoices | Stock, packaging, ads, software, rent, utilities; tag stock purchases so the cost of goods sold can be worked out |

Then tick each bank line against a journal row. A bank line with no row, or a row with no document, goes on the "to fix" list.

## 5. Month-end close checklist

Do it in the first 5 days of the next month, before the WHT and VAT dates in `tax-vat-th`.

1. Download every platform's monthly payout or income report and the courier COD statements.
2. Download the business bank statement; check the closing balance matches the journal balance.
3. Every bank line has a journal row; every row has a document (or a note why not).
4. Gross sales per channel = platform report total. Fees per channel match the platform's fee invoice.
5. Stock count or stock-sheet total (`multi-shop-stock`) recorded; note large write-offs (damage, loss).
6. Unpaid supplier bills and unpaid customer invoices listed with due dates (feeds `cash-flow`).
7. VAT-registered: sales and purchase tax reports done; ภ.พ.30 figures ready. Paid suppliers or freelancers 1,000 baht or more: WHT and 50 ทวิ done (`tax-vat-th`).
8. Running total of the year's sales updated. Not VAT-registered and approaching **1.8 million baht**: register within 30 days of passing it (`tax-vat-th` section 1).
9. One-line summary: sales · costs · profit · cash in bank · owner draws. Scan and file the month's documents in one folder named `YYYY-MM`.

## 6. When to hire an accountant

| Sign | Why |
|---|---|
| You are a registered partnership or company | The Accounting Act requires a qualified bookkeeper and a licensed auditor; not optional |
| VAT-registered | Monthly ภ.พ.30 and three VAT reports; mistakes carry penalties |
| Sales near or over 1.8 million baht a year, or deducting actual expenses on large figures | The tax result depends on records an outsider can defend |
| Staff on payroll | ภ.ง.ด.1, social security, 50 ทวิ every month |
| Closing the month takes you more than a day, or you are already late | The fee is usually less than the surcharges (`tax-vat-th` section 4) |

Hand over: the journal, bank statements, platform and COD reports, folders of documents by month, stock sheet, and the "to fix" list. Ask for the monthly fee in writing, what is included (bookkeeping, filing, year-end), and who files.

## Worked example — one week, individual seller not VAT-registered

Shopee settlement: gross sales 18,500 · commission 1,110 · transaction fee 555 · payout 16,835. Courier COD remittance: COD 4,200 · fee 105 · paid 4,095. Business bank account: supplier transfer 9,000 (receipt in hand) · Facebook ads 1,200 (receipt emailed) · owner draw 5,000. Figures are illustrative.

Journal rows: income 18,500 and 4,200 · expenses 1,110, 555, 105, 9,000, 1,200 · owner draw 5,000 (not an expense). Week profit before tax = 22,700 − 11,970 = **10,730**. Bank moved by 16,835 + 4,095 − 9,000 − 1,200 − 5,000 = **+5,730** = profit 10,730 − owner draw 5,000. The two agree, so nothing is missing.

## Check before handing over

1. Journal balance = bank closing balance for the month.
2. Income is gross per channel, fees are separate rows.
3. Owner draws are not counted as expenses.
4. Every Thai legal fact you quote carries the date and source above; anything marked (รอยืนยัน) is said as unconfirmed.

## Related

`cash-flow` (forecast from the same journal) · `seller-tax-basics` · `tax-vat-th` · `e-tax-invoice` · `doc-quotation` · `multi-shop-stock` · `marketplace-fees-pricing` · `payroll-th` · `dbd-annual-filing` · `thai-business-setup`


## reference: bookkeeping-sheet.md

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


---

# skill: cash-flow

Use when a Thai seller or SME may run short of cash (13-week forecast, slow marketplace payouts, COD, stock buys, VAT and WHT due dates).

# Cash Flow for a Thai Small Business

A shop can be profitable and still unable to pay the supplier on Friday. Profit is counted when you sell; cash arrives when the platform pays out, the courier remits COD, or the customer transfers. This skill forecasts cash week by week for 13 weeks and says what to do before the balance goes negative. General information, not financial or tax advice.

> **One rule:** forecast cash on the day it actually moves, from your own history, not from sales figures or platform promises. Every week, replace the forecast with the actual and roll forward one week.

## Use when / not when

| Situation | Use |
|---|---|
| "Will I have enough to pay X", big stock order coming, sales up but bank down, peak season (11.11, 12.12) | this skill |
| Recording what already happened, month-end close | `sme-bookkeeping` (the forecast starts from its journal) |
| Is the product priced to make money at all | `marketplace-fees-pricing` |
| Which courier pays COD faster or cheaper | `shipping-compare` |
| Exact tax form dates and penalties | `tax-vat-th` · salary and social security dates → `payroll-th` · `social-security-th` |
| Personal household budget | `personal-budget` in `trading-finance` (if installed) |

## 1. Measure your real delays first

Do not guess payout timing. Take last month's orders and the payout reports and measure, per channel, the days from **order date** to **money in your bank**.

| Channel | What drives the delay | Measure |
|---|---|---|
| Shopee · Lazada · TikTok Shop | Delivery time + buyer confirmation or auto-confirm window + the platform's release and withdrawal cycle. Rules differ by platform and change; read the current terms in each seller centre (รอยืนยัน per platform) | median days, and the slowest 10% |
| Courier COD (LINE, Facebook, own web) | Delivery + the courier's COD remittance cycle + refused parcels that come back with no cash (`shipping-compare`) | days, and refusal rate % |
| Bank transfer, PromptPay | Usually same day | — |
| B2B invoice with credit terms | The terms you gave (30, 60 days) plus how late customers really pay | days after due date |

Write the result as a lag table, e.g. Shopee 9 days, TikTok 12 days, COD 6 days with 8% refused. Use these numbers in the forecast. Returns and refunds also come out of later payouts; take last month's return rate per channel.

## 2. Build the 13-week forecast

Template: [references/13-week-forecast.md](references/13-week-forecast.md). One column per week (Monday to Sunday), rows:

1. **Opening cash** = business bank balance (week 1 = today's real balance; later weeks = previous closing).
2. **Cash in** — platform payouts by channel (sales shifted by the lag from section 1, minus fees and returns) · COD remittances (minus refusals and COD fee) · direct transfers · customer invoices due · other (loans received, owner putting money in).
3. **Cash out** — stock purchases on the date you pay the supplier (deposit and balance separately) · packaging · ads (card bill date, not click date) · shipping you pay · rent, utilities, software · wages and owner draw · loan repayments · **tax and social security on their due dates** (section 3).
4. **Closing cash** = opening + in − out.
5. **Minimum buffer** — a floor you do not go below, e.g. 2 weeks of fixed costs (rent, wages, loans, owner draw).

Highlight every week where closing cash is below the buffer. That week is the problem to solve now, not then.

## 3. Tax and contribution dates that take cash

Put these in the forecast on the date the money leaves, for the forms that apply to you. Full calendar, e-Filing extensions and weekend shifts: `tax-vat-th` section 2.

| What | Paid | Amount to forecast |
|---|---|---|
| WHT you withheld (ภ.ง.ด.1, 3, 53) | by the 7th of next month on paper; e-Filing later (see `tax-vat-th`) | the WHT you deducted last month — it is not your money, keep it aside |
| VAT (ภ.พ.30), if registered | by the 15th of next month on paper; e-Filing later | output VAT − input VAT for last month; a big stock month can mean a refund or credit instead |
| Social security (สปส.1-10) | by the 15th of next month | employee share withheld + employer share |
| Half-year and annual income tax (ภ.ง.ด.94 / 90 individuals · ภ.ง.ด.51 / 50 companies) | see `seller-tax-basics` · `tax-vat-th` | estimate from year-to-date profit; this is the payment that most often surprises small shops |

ตรวจล่าสุด 2026-10-25 (วันครบกำหนดยกมาจาก `tax-vat-th` และ `social-security-th` ซึ่งตรวจกับเว็บทางการ 2026-10-22 · รอบนี้ไม่ได้เปิดตัวบทซ้ำ) · แหล่ง: https://www.rd.go.th · https://www.sso.go.th

## 4. Warning signs and what to do

| Sign | Likely cause | Action, cheapest first |
|---|---|---|
| Sales up, bank down | Cash tied in stock and payouts in transit | Slow the next stock order; buy in smaller lots more often |
| Stock on hand > 2 months of sales | Over-buying, slow lines | Bundle or discount slow SKUs (`multi-shop-stock`), stop reordering them |
| COD refusals or returns rising | Wrong buyers, slow delivery | Push prepaid (`promptpay-qr`), confirm COD orders by chat before shipping |
| Paying WHT or VAT from new sales | Tax money spent as working capital | Move withheld tax and VAT into a separate "tax" account on the day you collect it |
| Card bill paid late or only the minimum | Ads spending ahead of payouts | Cap daily ad spend to what last week's payouts can cover |
| Forecast below buffer within 4 weeks | Any of the above | Ask suppliers for later payment terms; chase customer invoices; delay non-essential spend; only then consider a short loan, compare the full cost in writing |
| Owner draws exceed profit for 3 months | Business funding the household | Fix the owner draw at a set amount (`sme-bookkeeping` section 3) |

Never pay supplier deposits or "release fees" to unlock platform money at the request of a chat, call or link — platforms pay out through the seller centre only. Treat such messages as possible scams (`scam-check` in `trading-finance`, if installed).

## Worked example — stock order before 11.11

Opening cash 80,000. Weekly fixed costs 15,000, buffer 30,000. Shopee lag from the shop's own payout reports is 10 days. Plan: pay a supplier 120,000 in week 2 for 11.11 stock; extra sales of 200,000 on 11.11 (week 4). Figures are illustrative.

| Week | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Opening | 80,000 | 100,000 | 0 | 20,000 | 40,000 | 240,000 |
| Payouts in | 35,000 | 35,000 | 35,000 | 35,000 | 35,000 + 180,000 (11.11, net of fees, ~10 days later) | 35,000 |
| Stock out | 0 | 120,000 | 0 | 0 | 0 | 0 |
| Fixed out | 15,000 | 15,000 | 15,000 | 15,000 | 15,000 | 15,000 |
| Closing | 100,000 | **0** | **20,000** | 40,000 | 240,000 | 260,000 |

Weeks 2 and 3 break the 30,000 buffer; one late payout or refused COD batch and the shop cannot pay rent. Options: pay a 60,000 deposit in week 2 and the balance in week 5, after the 11.11 payout lands, or ship the order in two lots. With the split, week 2 closes at 60,000, week 3 at 80,000, week 5 at 240,000.

## Check before handing over

1. Week 1 opening = today's real bank balance.
2. Payouts are shifted by measured lags, net of fees and returns.
3. Tax, social security and owner draw appear as cash out on their dates.
4. Every week below the buffer has a named action and an owner.

## Related

`sme-bookkeeping` (actuals that feed the forecast) · `marketplace-fees-pricing` · `shipping-compare` · `multi-shop-stock` · `promptpay-qr` · `tax-vat-th` · `payroll-th` · `social-security-th` · `seller-tax-basics`


## reference: 13-week-forecast.md

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
