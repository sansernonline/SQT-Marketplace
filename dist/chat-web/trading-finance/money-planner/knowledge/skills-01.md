# skill: personal-budget

Use when the month starts, salary runs out early, or the user wants a budget from real spending.

# Personal Budget (งบรายเดือน)

A budget that survives contact with real life. Worksheet: [references/budget-worksheet.md](references/budget-worksheet.md). General information, not financial advice.

## Workflow

1. **Real numbers, 2–3 months** — bank statement exports, e-wallet / PromptPay history (TrueMoney, ShopeePay, LINE Pay), credit card statements. Never use the user's guess of their own spending.
2. **Start from take-home pay**, not gross: salary − social security (5% of wage, capped at a 17,500 baht wage base = **875 baht/month** in 2569) − provident fund (PVD) contribution − withholding tax (ภาษีหัก ณ ที่จ่าย) per payslip. Add regular side income; treat bonus as a separate annual plan, not monthly money.
3. **Categorise** into four envelopes:
   - **Needs** — rent/home loan, utilities, food at home, transport to work, phone, insurance premiums, minimum debt payments, parents' support (ส่งเงินให้พ่อแม่ is a fixed need for many Thai households)
   - **Wants** — eating out, delivery, shopping, travel, subscriptions, gifts and social obligations (ซองงานแต่ง งานบวช งานศพ)
   - **Savings** — emergency fund until full (`emergency-fund`), extra debt payment above minimum (`debt-payoff`), annual bills sinking fund
   - **Investment** — DCA into funds/stocks, Retirement Mutual Fund (RMF) / ThaiESG (`tax-deduction-planner`, `mutual-fund-picker`)
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


## reference: budget-worksheet.md

# Monthly budget worksheet

## 1. Take-home pay

```
Gross salary                         ______
− Social security (5%, max 875)      ______
− PVD contribution                   ______
− Withholding tax (payslip)          ______
+ Regular side income                ______
= Take-home                          ______
```

## 2. Last 3 months actual (from statements)

| Category | Envelope | Month 1 | Month 2 | Month 3 | Average |
|---|---|---|---|---|---|
| Rent / home loan | Needs | | | | |
| Utilities (electricity, water, internet) | Needs | | | | |
| Food at home | Needs | | | | |
| Transport | Needs | | | | |
| Phone | Needs | | | | |
| Insurance premiums (monthly equivalent) | Needs | | | | |
| Minimum debt payments | Needs | | | | |
| Family support | Needs | | | | |
| Eating out / delivery | Wants | | | | |
| Subscriptions | Wants | | | | |
| Shopping | Wants | | | | |
| Social obligations (ซอง) | Wants | | | | |
| Instalments / BNPL | Wants (or Needs if contracted) | | | | |
| Emergency fund | Savings | | | | |
| Extra debt payment | Savings | | | | |
| Investment | Investment | | | | |

## 3. Plan

| Envelope | Plan baht | % | Account it lives in |
|---|---|---|---|
| Needs | | | |
| Wants | | | |
| Savings | | | |
| Investment | | | |

Payday standing order: ______ baht on day ___ → account ______

## 4. Annual bills (sinking fund ÷ 12)

| Bill | Annual | Monthly set-aside | Due month |
|---|---|---|---|
| Car insurance + tax (พ.ร.บ.) | | | |
| Life / health insurance (annual premium) | | | |
| School fees | | | |
| Festivals (สงกรานต์, ปีใหม่, ตรุษจีน) | | | |

## 5. Monthly review (10 minutes)

```
Month ____   Over plan: ______ by ______   Under plan: ______
Leak found: ______ (baht/month) → action ______
Payday transfer done? Y/N    One fix for next month: ______
```


---

# skill: emergency-fund

Use when the user asks how big an emergency fund should be, where to park it, or deposit protection.

# Emergency Fund (เงินสำรองฉุกเฉิน)

General information, not financial advice.

## How many months

Months × **essential** monthly spending (rent or mortgage, food, transport, utilities, insurance premiums, minimum debt payments, support for parents) — not total spending, not income.

| Situation | Months |
|---|---|
| Government officer / state enterprise, stable | 3 |
| Salaried private sector, one earner of two in the household | 3–6 |
| Salaried, sole earner with dependants | 6–9 |
| Commission, contract, gig, freelance (ม.40), seasonal income | 9–12 |
| Business owner (keep separate from business cash) | 12 |
| Paying off high-interest debt | 1-month mini buffer first, full fund after (`debt-payoff`) |

Adjust up for: health conditions, older parents depending on you, older car, single-industry town. Adjust down slightly if the employer offers strong severance and the user is ม.33 (social security unemployment benefit: laid off 60% of wage up to 180 days since 28 Jun 2568, resign 30% up to 90 days, wage ceiling 15,000 → 17,500 from 2569 — check sso.go.th or 1506).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thaipbs.or.th/news/content/353742 (กฎกระทรวงฉบับที่ 2 พ.ศ. 2568 · 60% · 180 วัน · มีผล 28 มิ.ย. 2568 · ตรวจซ้ำ 2026-10-22; ลาออก 30% · 90 วัน ไม่ได้แก้) · เพดานค่าจ้าง 17,500 ตั้งแต่ 1 ม.ค. 2569 ตรวจซ้ำ 2026-10-22 (infoquest.co.th/2025/550753)

## Where to park — the ladder

| Layer | Share | Product | Access | Protected by the Deposit Protection Agency (DPA)? |
|---|---|---|---|---|
| 1 | 1 month | normal savings account at main bank | instant | yes |
| 2 | 2–5 months | high-interest digital savings (e-savings) at a different bank | same day | yes |
| 3 | rest | money market fund (กองทุนรวมตลาดเงิน, risk level 1) or 3–6 month fixed deposit | money market: usually T+1; fixed deposit: early withdrawal loses interest | money market fund **no** (it is an investment, but holds very short deposits and bills) |

Never in stocks, crypto, long-term funds, Retirement Mutual Fund (RMF) / ThaiESG, or lent to friends.

## Deposit protection (สถาบันคุ้มครองเงินฝาก)

- Covers **up to 1,000,000 baht per depositor per bank** — all accounts and branches at that bank combined, principal plus interest. In force since 11 Aug 2564.
- Covers Thai-baht savings, current, fixed deposits and certificates of deposit at member banks. Does **not** cover mutual funds, bonds, bills of exchange (ตั๋วแลกเงิน), insurance, or co-operatives (สหกรณ์ออมทรัพย์).
- Above 1 million: split across banks.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.bangkokbank.com/th-TH/Personal/Grow-Club/DPA

## Workflow

1. Compute essential monthly spending from real statements (`personal-budget`).
2. Pick months from the table; target = months × essential spending.
3. Count what already qualifies (cash at bank, money market fund). Do not count RMF, stocks, or "I could borrow".
4. Close the gap with a monthly top-up from the budget, and set the date it will be full.
5. Set the ladder; name the accounts by purpose ("ฉุกเฉิน").
6. After using it, refill before resuming extra investing.

## Worked example

Freelance designer, essential spending 22,000/month, has 60,000 in savings, high-interest debt none.

| Step | Number |
|---|---|
| Target | 9 months × 22,000 = **198,000** |
| Already have | 60,000 |
| Gap | 138,000 |
| Top-up | 11,500/month → full in 12 months |
| Ladder | 22,000 savings at main bank · 88,000 e-savings at a second bank · 88,000 money market fund |

## Rules

- Interest rate is the last criterion; access and safety come first. E-savings promo rates change often — check the bank page (รอยืนยัน on any quoted rate).
- "Emergency" = job loss, medical not covered by insurance, urgent home/car repair, family crisis. A sale is not an emergency.
- The emergency fund is built before RMF/ThaiESG top-ups, except the employer PVD match, which comes first.
