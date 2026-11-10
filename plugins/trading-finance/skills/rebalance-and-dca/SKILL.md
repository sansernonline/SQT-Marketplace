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
| Band | Deviation = actual share − target share (percentage points, can be negative). Act when the absolute deviation is above the band; default band 5 points (starting value, not yet measured), so 60 becomes 65 or 55 | Larger portfolios that are checked monthly |
| Both | Look once a year, act only if the band is broken | Keeps trading and fees low |

Do not rebalance on news or after one bad month. A band of 5 points is a common rule of thumb, not a regulation.

**Close the deviation with new money first; sell only if that takes too long.** Redirecting new money costs nothing, so it is always allowed. When the deviation is above the band:

| Step | Rule |
|---|---|
| 1. Months to close | Gap in baht ÷ (monthly DCA × (1 − target share of the underweight asset)). Gap in baht = target share × total portfolio value − current value of the underweight asset. The `(1 − target share)` part is there because new money also grows the whole portfolio, so only part of each month closes the gap |
| 2. At most N months (N = 12, starting value, not yet measured) | Close it with DCA; do not sell |
| 3. More than N months | Selling or switching is allowed. Tell the user the cost (fees for selling, switching and buying + tax on what is sold + broker commission) and the months DCA alone would take; the user decides |

Deviation, gap and months come from `node money-calc.mjs drift <file.json>` (script in `portfolio-snapshot`, see its Script path; the worked example below is `../portfolio-snapshot/scripts/examples/drift.json` and gives 10.9 points and 20 months). `bandPoints` and `maxMonths` default to 5 and 12.

The 5-point band is a rule of thumb from Vanguard's 2010 US study (checked 2026-10-27), not a Thai rule. To compare ways of rebalancing on cost and months to target (both `low`), use `decision-scoring`, command `score` (script path: see `decision-scoring`, superuser plugin); the worked example's options A/B/C are in `references/rebalance-score.json` (its switching fee is a placeholder; replace it from the factsheet). Weights 0.5 cost / 0.5 months are starting values, not yet measured; the user's weights win. Selling RMF or ThaiESG early goes in `must`, not in the weights. Source link, command and the 2026-10-28 run: [references/rebalance-example.md](references/rebalance-example.md).

## 4 · How to rebalance — cheapest way first

1. **Redirect new money** — send the monthly DCA to the line that is under target until the mix is back. No selling, no fees.
2. **Switch inside the same fund house** — a switch (สับเปลี่ยน) between funds of the same management company is often free or cheap; check the factsheet.
3. **Sell and buy** — only if steps 1–2 would take more than about 12 months. Count front-end and back-end fees, broker commission, and the tax on what is sold (rules for gains and dividends are in `tax-basics-th`).
4. **Tax-wrapped units** — never rebalance by selling RMF, ThaiESG or old SSF units early; the tax saved must be repaid (`tax-deduction-planner`). An RMF can be switched to another RMF, at the same or a different fund house, without breaking the holding period; the transfer must finish within 5 business days and may carry a fee (2 sources only, รอยืนยัน with the fund house). ThaiESG to ThaiESG and SSF to SSF switches: ask the receiving fund house whether the holding period carries over (รอยืนยัน).
5. **RMF DCA must not lapse** — the 3% / 5,000 baht minimum was dropped from 1 Jan 2563, but the user must keep buying every year until age 55 and may skip at most 1 year in a row (a year with no income does not count as a skip).

ตรวจล่าสุด 2026-10-26 · RMF แหล่ง: https://www.rd.go.th/39783.html , https://www.krungsri.com/th/krungsri-the-coach/life/retirement/rmf-retirement-condition , https://www.set.or.th/th/about/mediacenter/insights/article/265-rmf , https://www.innovestx.co.th/th/products/transfer-tax-funds (สับเปลี่ยน · 2 แหล่ง)

## 5 · Before placing any order

What comes out of this skill is a draft plan for the user, not an order. Before the user sells, switches or buys:

| Check | Why | How |
|---|---|---|
| Money already on its way | A pending DCA, a salary transfer or a dividend may close part of the gap for free | List money arriving in the next month and run `drift` again with it |
| Fund cut-off time and NAV date | An order after the cut-off gets the next day's NAV; a switch out and in may sit uninvested for 1–2 days | Read the cut-off and settlement days in each fund's prospectus or factsheet (รอยืนยัน per fund; never quote a time from memory) |
| Minimums and whole units | A fund's minimum order, a stock's board lot (rules in `position-sizing`), or a DR's lot can leave part of the plan unbuyable | Round the plan to what can actually be ordered and show the left-over cash |
| ETF or DR price vs its NAV | An exchange-traded fund (ETF) or depositary receipt (DR) can trade above or below the value it holds, more in thin trading | Compare the price with the latest indicative NAV on the issuer's page; avoid the first and last minutes of the session |
| Hard-to-sell holdings | Corporate bonds and thinly traded names cost more to sell than the band saves | Use a wider band for them, or only redirect new money there |

**When DCA and selling are close**, show both in baht: the cost of selling or switching now (fees + tax + commission) against the months DCA alone needs (`drift` output). If the months are near N, say so; the user picks.

**Review the target mix itself at least once a year**, and after a change in goal, income or horizon; write the review date next to the mix.

Idea: `portfolio-rebalance-review` steps 2 and 4, anthropics/claude-for-financial-advisors (Apache-2.0, viewed 2026-11-10); US tax parts (wash sale, required distributions) left out.

## Worked example

Target 60/40, equity 10.9 points over, DCA 10,000 a month → 20 months by new money alone, so switching is offered next to it with its cost: options A/B/C in [references/rebalance-example.md](references/rebalance-example.md). The user picks. Record the date and the new mix.

## Check before sending

- Target mix and trigger written down, with the date
- Percentages add up to 100 and the gap is in baht
- The section 5 checks were run before any order, and the plan is called a draft, not an order
- Months for DCA to close the deviation worked out before any sale; fees and tax-wrapper rules named before any sale or switch
- No specific fund named as "the best"

## Sources

Rebalancing bands and the redirect-new-money method are common practice in personal-finance planning, not Thai regulation (ยังไม่ได้ตรวจ against a single official source). Fund fees and switching rules come from each fund's factsheet. RMF and ThaiESG rules are kept in `tax-deduction-planner/references/deductions-2569.md`.
