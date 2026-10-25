---
name: sme-bookkeeping
description: Use when a Thai shop or SME keeps its books (income-expense journal, receipts to keep, month-end close, รายงานเงินสดรับ-จ่าย, hire an accountant).
---

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
