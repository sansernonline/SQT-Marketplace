---
name: rebalance-and-dca
description: Use when setting up monthly investing (DCA) in Thai funds or stocks, or a portfolio has drifted from its target mix and needs rebalancing.
---

# Rebalance and DCA (ลงทุนรายเดือน · ปรับสัดส่วนพอร์ต)

General information, not investment advice. Picking the funds themselves is `mutual-fund-picker`; tax caps for RMF and ThaiESG are `tax-deduction-planner`; the current mix of a stock account is `portfolio-snapshot`.

> **One rule:** decide the target mix and the rebalancing trigger in writing before the money goes in, then follow the rule, not the news.

## Use when / not when

| Situation | Use |
|---|---|
| "I want to invest X baht every month" · "my stock part grew too big" · "should I sell winners?" | this skill |
| Which fund to buy, reading a factsheet | `mutual-fund-picker` |
| How much RMF or ThaiESG to buy this year for tax | `tax-deduction-planner` |
| Short-term trade, how many shares | `position-sizing` |
| No emergency fund yet, or high-interest debt | `emergency-fund` and `debt-payoff` first |

## 1 · Set the target mix

1. Goal and horizon for each pot of money (retirement 20 years, house down payment 4 years). Money needed within 3 years does not go into equity (same rule as `mutual-fund-picker`).
2. One simple mix per pot, for example equity 60 / bonds 40. Equity can be split further (Thai / global), but keep it to 2–4 lines so the user can follow it.
3. Write the mix, the trigger and the review date in the user's notes (`CONTEXT.md` or the finance folder).

## 2 · DCA (ลงทุนสม่ำเสมอ)

| Step | How |
|---|---|
| Amount | The fixed investment line from `personal-budget`, moved on payday by standing order |
| Where | Split the monthly amount by the target mix, or send all of it to the line that is under target (this rebalances for free) |
| Thai funds | Most asset management companies and bank apps offer a monthly auto-buy (ตั้งซื้ออัตโนมัติ) from a set day; check the fund's minimum and front-end fee in the factsheet |
| Thai stocks | Many brokers offer a stock DCA service (buy a fixed baht amount of a stock or ETF each month); check the broker's commission and minimums for that service (รอยืนยัน per broker) |
| Tax wrappers | RMF and ThaiESG count toward this year's deduction only if paid by 31 December and within the caps in `tax-deduction-planner`; keep buying them through DCA instead of one lump in December if cash flow allows |

DCA lowers the average cost only when prices move both ways; it does not prevent losses. The worked numbers are in `mutual-fund-picker` (DCA example).

## 3 · When to rebalance — pick one rule

| Rule | Trigger | Good for |
|---|---|---|
| Calendar | Once a year on a fixed date (for example the first week of December, before tax-fund cut-offs) | Most people; easy to remember |
| Band | Any line moves more than 5 percentage points from its target (60 becomes 65 or 55) | Larger portfolios that are checked monthly |
| Both | Look once a year, act only if the band is broken | Keeps trading and fees low |

Do not rebalance on news or after one bad month. A band of 5 points is a common rule of thumb, not a regulation.

## 4 · How to rebalance — cheapest way first

1. **Redirect new money** — send the monthly DCA to the line that is under target until the mix is back. No selling, no fees.
2. **Switch inside the same fund house** — a switch (สับเปลี่ยน) between funds of the same management company is often free or cheap; check the factsheet.
3. **Sell and buy** — only if steps 1–2 would take more than about 12 months. Count front-end and back-end fees, broker commission, and the tax on what is sold (rules for gains and dividends are in `tax-basics-th`).
4. **Tax-wrapped units** — never rebalance by selling RMF, ThaiESG or old SSF units early; the tax saved must be repaid (`tax-deduction-planner`). An RMF can be switched to another RMF, at the same or a different fund house, without breaking the holding period; the transfer must finish within 5 business days and may carry a fee (2 sources only, รอยืนยัน with the fund house). ThaiESG to ThaiESG and SSF to SSF switches: ask the receiving fund house whether the holding period carries over (รอยืนยัน).
5. **RMF DCA must not lapse** — the 3% / 5,000 baht minimum was dropped from 1 Jan 2563, but the user must keep buying every year until age 55 and may skip at most 1 year in a row (a year with no income does not count as a skip).

ตรวจล่าสุด 2026-10-26 · RMF แหล่ง: https://www.rd.go.th/39783.html , https://www.krungsri.com/th/krungsri-the-coach/life/retirement/rmf-retirement-condition , https://www.set.or.th/th/about/mediacenter/insights/article/265-rmf , https://www.innovestx.co.th/th/products/transfer-tax-funds (สับเปลี่ยน · 2 แหล่ง)

## Worked example

Target equity 60 / bonds 40. Today: equity funds 780,000 · bond fund 320,000 · total 1,100,000. DCA 10,000 a month.

| Line | Now | % now | Target % | Target baht | Gap |
|---|---|---|---|---|---|
| Equity | 780,000 | 70.9 | 60 | 660,000 | −120,000 |
| Bonds | 320,000 | 29.1 | 40 | 440,000 | +120,000 |

The band (5 points) is broken. Options shown to the user:

| Option | What happens | Cost |
|---|---|---|
| A · New money only | Put the whole 10,000 a month into bonds | About 12 months to close the gap at today's prices; no fees |
| B · Switch now | Switch 120,000 from the equity fund to a bond fund at the same fund house | Switching fee per factsheet; done in a few days |
| C · Half and half | Switch 60,000 now, redirect DCA for 6 months | Half the fee of B, back to target in about 6 months |

The user picks. Record the date and the new mix.

## Check before sending

- Target mix and trigger written down, with the date
- Percentages add up to 100 and the gap is in baht
- Fees and tax-wrapper rules named before any sale or switch
- No specific fund named as "the best"

## Sources

Rebalancing bands and the redirect-new-money method are common practice in personal-finance planning, not Thai regulation (ยังไม่ได้ตรวจ against a single official source). Fund fees and switching rules come from each fund's factsheet. RMF and ThaiESG rules are kept in `tax-deduction-planner/references/deductions-2569.md`.
