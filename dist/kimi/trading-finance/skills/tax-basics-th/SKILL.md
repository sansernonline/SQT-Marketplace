---
name: tax-basics-th
description: Use when the user asks about Thai tax on stock gains, dividends, interest, crypto or foreign income, the dividend tax credit, or filing PND 90 or 91.
---

# Thai Tax Basics for Investors

General information, not tax advice — for a real filing ask a นักบัญชี / tax agent or the Revenue Department (RD) call centre 1161.

Per-income-type table and the dividend credit formula: [references/investment-income-rules.md](references/investment-income-rules.md). Year-end deductions: `tax-deduction-planner`.

## Which form, by when

| Form | Who | Paper deadline | Online (e-filing / D-MyTax) |
|---|---|---|---|
| ภ.ง.ด.91 | salary 40(1) only | 31 March of next year | usually extended to about 8 April (2568 year: 8 April 2569) |
| ภ.ง.ด.90 | any other income: freelance, rent, business, dividends or interest you choose to include, foreign remitted income | 31 March | same extension |
| ภ.ง.ด.94 | half-year return for rent, business, 40(5)–(8) income Jan–Jun | 30 September | about 8 October |

Tax year 2569 (income 2026): paper by 31 March 2570; the online extension date is announced each year (รอยืนยัน, expect about 8 April 2570). Refunds go to PromptPay linked to the national ID — register before filing. Late filing: surcharge 1.5% per month on tax due plus a fine.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/?p=576625 , https://www.thaipbs.or.th/news/content/501063

## Rules per income type (short form)

- **Thai listed shares sold on SET/mai** — gain exempt, loss not deductible. Nothing to file for the gain.
- **Dividends** — 10% withheld. Either leave it as final tax, or include in ภ.ง.ด.90 and claim the dividend credit (1/4 of the dividend when the company paid 20% corporate tax). Worth it when your marginal rate is 25% or less. Choosing to include means including **all** such dividends that year.
- **Mutual funds** — redemption gain exempt; fund dividends 10% withheld with no credit.
- **Savings interest** — exempt if all savings-account interest across all banks is 20,000 or less in the year and you let banks send data to RD; otherwise 15% withheld.
- **Fixed deposit / bond interest** — 15% withheld; include only if marginal rate is below 15%.
- **Crypto and digital tokens** — gains on SEC-licensed Thai exchanges, brokers or dealers are exempt for 1 Jan 2568 – 31 Dec 2572. Gains on foreign or unlicensed venues remain taxable at progressive rates. Check the platform on the SEC licence list (sec.or.th) before relying on the exemption.
- **Foreign income** — from 2567, foreign income earned from 1 Jan 2567 is taxed in the year you bring it into Thailand, if you were in Thailand 180 days or more that year. Track the earn date and remit date of every transfer; claim treaty credit for foreign tax paid.

## Workflow

1. Confirm tax year and residence (180-day rule).
2. List every income source with gross amount and tax withheld; sort into the table in the reference file.
3. For each optional item (dividends, deposit interest) compute both ways and pick the cheaper.
4. Run `tax-deduction-planner` for deductions; combine into one net-income calculation.
5. Pick the form and deadline; list the documents below.

## Worked example — tax year 2568 (filed 2569)

Salary net income after all deductions 350,000 (marginal rate 10%). Investment income: SET share trading gain 120,000; dividends from listed companies 40,000 (4,000 withheld); savings interest 8,000; 12-month fixed deposit interest 10,000 (1,500 withheld); BTC gain 30,000 on a Thai licensed exchange.

| Item | Treatment | Tax effect |
|---|---|---|
| Share trading gain 120,000 | exempt | 0 |
| Savings interest 8,000 | exempt (≤ 20,000) | 0 |
| BTC gain 30,000 (licensed exchange, 2568) | exempt | 0 |
| Dividends — option A: final | 10% withheld | cost 4,000 |
| Dividends — option B: include | add 40,000 + credit 10,000 = 50,000 at 10% = 5,000; minus credit 10,000; minus withheld 4,000 | net **refund 9,000** versus option A's cost 4,000 → B better by 9,000 |
| Deposit interest — include | 10,000 at 10% = 1,000 minus withheld 1,500 | refund 500 |

Result: file ภ.ง.ด.90 (not 91, because dividends and interest are included). Net income becomes 350,000 + 50,000 + 10,000 = 410,000, still inside the 10% band — check this every time; if the added income crossed into 30%, option A would win.

## Documents to keep

- 50 ทวิ from employer
- Dividend withholding certificates (หนังสือรับรองการหักภาษี ณ ที่จ่าย) — issued by the registrar (TSD) or via the broker's annual tax report
- Bank interest certificates for deposit interest
- Broker annual statements (even for exempt gains)
- Crypto exchange annual statement and transaction history (CSV); for foreign venues, the transfers that moved money into Thailand
- Foreign broker statements, foreign tax withheld, remittance records with dates
- Deduction certificates listed in `tax-deduction-planner`

## Rules

- State the tax year in every answer; numbers change yearly.
- A number not on the reference table is (รอยืนยัน) until checked on rd.go.th.
- This skill prepares and explains; a licensed tax agent files complex cases (foreign income, business income, large crypto).
