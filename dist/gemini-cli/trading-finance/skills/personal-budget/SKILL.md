---
name: personal-budget
description: Use when the month starts, salary runs out early, or the user wants a monthly budget. Needs, wants, savings and investing plan from real spending.
---

# Personal Budget (งบรายเดือน)

A budget that survives contact with real life. Worksheet: [references/budget-worksheet.md](references/budget-worksheet.md). General information, not financial advice.

## Workflow

1. **Real numbers, 2–3 months** — bank statement exports, e-wallet / PromptPay history (TrueMoney, ShopeePay, LINE Pay), credit card statements. Never use the user's guess of their own spending.
2. **Start from take-home pay**, not gross: salary − social security (5% of wage, capped at a 17,500 baht wage base = **875 baht/month** in 2569) − PVD (provident fund) contribution − withholding tax (ภาษีหัก ณ ที่จ่าย) per payslip. Add regular side income; treat bonus as a separate annual plan, not monthly money.
3. **Categorise** into four envelopes:
   - **Needs** — rent/home loan, utilities, food at home, transport to work, phone, insurance premiums, minimum debt payments, parents' support (ส่งเงินให้พ่อแม่ is a fixed need for many Thai households)
   - **Wants** — eating out, delivery, shopping, travel, subscriptions, gifts and social obligations (ซองงานแต่ง งานบวช งานศพ)
   - **Savings** — emergency fund until full (`emergency-fund`), extra debt payment above minimum (`debt-payoff`), annual bills sinking fund
   - **Investment** — DCA into funds/stocks, RMF/ThaiESG (`tax-deduction-planner`, `mutual-fund-picker`)
4. **Flag leaks**: forgotten subscriptions, BNPL / ผ่อน 0% instalments stacking up, cash-advance fees, delivery frequency. List each with its monthly baht.
5. **Propose the split** — 50/30/20 (needs/wants/savings+investment) as a starting point; adjust to reality (high Bangkok rent may push needs to 60%). Never treat the split as sacred.
6. **The one number that matters** — the investment/saving transfer, set as a standing order on payday (บัญชีแยก, auto-transfer), before spending starts.
7. **Monthly 10-minute review** — actual vs plan per envelope, one category to fix next month.

## Decision table

| Situation | Do first |
|---|---|
| Expenses > income | Cut wants, then renegotiate needs (phone plan, insurance overlap via `insurance-review`); never borrow to cover monthly spend |
| Credit-card or cash-card debt revolving | Savings envelope goes to `debt-payoff` before investment beyond the employer-matched PVD |
| No emergency fund | Fill `emergency-fund` first (at least 3 months of needs) before discretionary investing |
| Irregular income (freelance, commission) | Budget on the lowest month of the last 6; park the surplus in a buffer account |
| Year-end bonus | Pre-split: debt / emergency fund / tax-saving funds / one want |

## Where to park each envelope

- Spending: main account linked to the debit card / PromptPay.
- Emergency and sinking funds: separate high-interest savings account; deposits are protected up to **1 million baht per depositor per bank** — above that, spread across banks (details in `emergency-fund`).
- Investment: broker / fund account, auto-debited.

## Worked example (monthly, single, Bangkok, 2569)

Salary 35,000. Social security 875 (capped), PVD 3% = 1,050, withholding tax per payslip ≈ 300 (รอยืนยัน — use the user's payslip). Take-home ≈ **32,775**.

| Envelope | Items | Plan | % of take-home |
|---|---|---|---|
| Needs | rent 8,500 · utilities 1,200 · food at home 4,000 · BTS/MRT 1,800 · phone 500 · parents 3,000 · health insurance 1,000 | 20,000 | 61% |
| Wants | eating out/delivery 4,500 · subscriptions 600 · shopping/social 1,700 | 6,800 | 21% |
| Savings | emergency fund (until 3 months of needs = 60,000) | 3,000 | 9% |
| Investment | index fund DCA on payday | 2,975 | 9% |
| **Total** | | **32,775** | 100% |

Leaks found: two streaming services overlap (−300), delivery 18 times a month (target 10, −2,000). Moving that 2,300 to investment lifts it to **5,275 (16%)**. The standing order: 5,275 on the 25th, before anything else.

## Rules

- If data is missing, estimate it with the user and mark it as an estimate.
- The goal is not a perfect spreadsheet; it is protecting the payday transfer.
- If expenses exceed income, say so plainly and cut wants first, never the investment line to zero without saying what it costs long term.

Related (same plugin): `emergency-fund`, `debt-payoff`, `tax-deduction-planner`, `scam-check` before sending money to any "guaranteed" scheme. If installed: `subscription-audit` (personal-life) to clear forgotten subscriptions.
