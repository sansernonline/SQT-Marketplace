---
name: rebalance-and-dca
description: Use when setting up monthly DCA or rebalancing a portfolio
---

# Rebalance and DCA (ลงทุนรายเดือน · ปรับสัดส่วนพอร์ต) — a draft plan: target mix, monthly DCA, rebalancing rule

General information, not investment advice.

> **One rule:** decide the target mix and the rebalancing trigger in writing before the money goes in, then follow the rule, not the news.

## Use when
- "I want to invest X baht every month" · "my stock part grew too big" · "should I sell winners?"

Not for: which fund to buy, factsheets → `mutual-fund-picker` · RMF / ThaiESG amounts for tax → `tax-deduction-planner` · current mix of a stock account → `portfolio-snapshot` · short-term trade size → `position-sizing` · no emergency fund or high-interest debt yet → `emergency-fund` and `debt-payoff` first.

## Steps
1. **Target mix.** Per pot of money, set goal and horizon (retirement 20 years, house down payment 4 years); money needed within 3 years does not go into equity. One simple mix per pot (for example equity 60 / bonds 40; equity may split Thai / global; 2–4 lines in all). Write mix, trigger and review date in the user's notes (`CONTEXT.md` or the finance folder). Review the mix at least once a year and after a change in goal, income or horizon.
2. **DCA (ลงทุนสม่ำเสมอ).** Amount = the fixed investment line from `personal-budget`, moved on payday by standing order. Split it by the target mix, or send all of it to the line under target (this rebalances for free). Thai funds: most asset management companies and bank apps offer a monthly auto-buy (ตั้งซื้ออัตโนมัติ); check the fund's minimum and front-end fee in the factsheet. Thai stocks: many brokers offer a stock DCA service; check commission and minimums (รอยืนยัน per broker). RMF and ThaiESG count toward this year's deduction only if paid by 31 December and within the caps in `tax-deduction-planner`; prefer DCA over one lump in December if cash flow allows. DCA lowers average cost only when prices move both ways and does not prevent losses (worked numbers: `mutual-fund-picker`, DCA example).
3. **Pick one rebalance rule.** Calendar: once a year on a fixed date (for example the first week of December, before tax-fund cut-offs), good for most people. Band: deviation = actual share − target share (percentage points, may be negative); act when the absolute deviation is above the band, default 5 points (starting value, not yet measured), for larger portfolios checked monthly. Both: look once a year, act only if the band is broken, which keeps fees low. Never rebalance on news or after one bad month; 5 points is a rule of thumb, not a regulation.
4. **When the deviation is above the band, close it with new money first** (redirecting new money costs nothing, so it is always allowed). Months to close = gap in baht ÷ (monthly DCA × (1 − target share of the underweight asset)), where gap in baht = target share × total portfolio value − current value of the underweight asset (the `(1 − target share)` part is there because new money also grows the whole portfolio). At most N months (N = 12, starting value, not yet measured): close it with DCA, do not sell. More than N months: selling or switching is allowed, but tell the user the cost (selling, switching and buying fees + tax on what is sold + broker commission) and the months DCA alone would take; the user decides. If DCA and selling are close, show both in baht; if the months are near N, say so.
   - Compute deviation, gap and months with `node money-calc.mjs drift <file.json>` (script in `portfolio-snapshot`, see its Script path; worked example `../portfolio-snapshot/scripts/examples/drift.json` gives 10.9 points and 20 months). `bandPoints` and `maxMonths` default to 5 and 12.
   - To compare ways of rebalancing on cost and months to target (both `low`), use `decision-scoring`, command `score` (script path: see `decision-scoring`, superuser plugin); example options in `references/rebalance-score.json` (its switching fee is a placeholder, replace from the factsheet). Weights 0.5 cost / 0.5 months are starting values, not yet measured; the user's weights win. Selling RMF or ThaiESG early goes in `must`, not in the weights.
5. **How to rebalance, cheapest first.**
   1. Redirect new money to the line under target. No selling, no fees.
   2. Switch (สับเปลี่ยน) inside the same fund house; often free or cheap, check the factsheet.
   3. Sell and buy only if steps 1–2 would take more than about 12 months. Count front-end and back-end fees, broker commission, and tax on what is sold (rules in `tax-basics-th`).
   4. Never rebalance by selling RMF, ThaiESG or old SSF units early (the tax saved must be repaid). An RMF may be switched to another RMF without breaking the holding period; RMF DCA must not lapse (at most 1 year skipped in a row). Switching rules and details (รอยืนยัน with the fund house): [`references/before-order-and-tax-wrappers.md`](references/before-order-and-tax-wrappers.md).
6. **Before any order**, the output is a draft plan, not an order. Run the 5 checks in [`references/before-order-and-tax-wrappers.md`](references/before-order-and-tax-wrappers.md): money already on its way (rerun `drift` with it) · fund cut-off time and NAV date (read the factsheet, รอยืนยัน per fund, never quote a time from memory) · minimums and whole units (show the left-over cash) · ETF or DR price vs its NAV · hard-to-sell holdings (wider band, or only redirect new money). When DCA and selling are close, show both in baht; if the months are near N, say so.
7. Show the worked example when helpful (target 60/40, equity 10.9 points over, DCA 10,000 a month → 20 months by new money alone, so switching is offered next to it with its cost, options A/B/C), then the user picks. Record the date and the new mix.

## Check before done
- Target mix and trigger written down, with the date; percentages add up to 100 and the gap is in baht.
- Months for DCA to close the deviation worked out before any sale; fees and tax-wrapper rules named before any sale or switch.
- Step 6 checks were run and the plan is called a draft, not an order.
- No specific fund named as "the best".

## References
- [`references/rebalance-example.md`](references/rebalance-example.md) — open for the worked example (options A/B/C), band source and the `score` command run
- [`references/rebalance-score.json`](references/rebalance-score.json) — input for `decision-scoring score`
- [`references/before-order-and-tax-wrappers.md`](references/before-order-and-tax-wrappers.md) — open before any order, and for RMF / ThaiESG / SSF switching and DCA rules
- [`references/sources.md`](references/sources.md) — open to re-check RMF, band and source dates (RMF checked 2026-10-26)
