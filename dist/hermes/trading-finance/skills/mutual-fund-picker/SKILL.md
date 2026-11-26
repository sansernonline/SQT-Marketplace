---
name: mutual-fund-picker
description: Use when picking Thai funds, RMF or ThaiESG, or a factsheet
---

# Mutual Fund Picker (เลือกกองทุนรวม) — a scored shortlist of 3 Thai funds with trade-offs, not "the best"

General information, not investment advice — a licensed investment consultant (IC) at the bank or broker can give personal advice. Never recommend a specific fund as "the best"; shortlist and explain trade-offs.

## Use when
- Picking a Thai mutual fund, RMF or ThaiESG fund, or reading a factsheet.
- Comparing an index fund with active funds, or checking what a fund really costs.

Not for: emergency money → `emergency-fund` · tax rules of RMF/ThaiESG → `tax-deduction-planner` · monthly schedule, rebalancing, pre-order checks → `rebalance-and-dca` · deposits and bonds → `bonds-and-deposits` · a fund promising a high fixed return → `scam-check`

## Steps
1. Set the goal, the time horizon (under 3 years means no equity; money needed within 3 years stays in risk levels 1–4) and the fund's role in the portfolio.
2. Pick the type from the table in `references/fund-types-and-fees.md` (money market, government/short-term, fixed income, mixed, Thai equity, foreign feeder, sector, RMF/ThaiESG, with the SEC risk level 1–8 of each).
3. Shortlist 3 funds in that Association of Investment Management Companies (AIMC) category. Read each factsheet in this order: (1) policy and benchmark, is it a feeder and of which master fund · (2) risk level 1–8 and currency hedging (hedged / partly / unhedged) · (3) fees: front, back, Total Expense Ratio (TER); a feeder adds the master fund's TER · (4) performance vs benchmark for 3, 5, 10 years and percentile in its peer group · (5) maximum drawdown and standard deviation: "could I hold through this?" · (6) fund size and age: very small or new funds may close or merge · (7) top holdings and concentration · (8) dividend policy: dividend-paying funds trigger 10% tax with no credit; accumulation is more tax-efficient for most individuals (`tax-basics-th`). Where to compare: SEC fund search (https://market.sec.or.th/public/mfeds/), Morningstar Thailand (morningstarthailand.com), AIMC category returns (aimc.or.th), the AMC's own factsheet PDF.
4. Build the comparison table: TER, front/back fee, 5-year return vs benchmark, max drawdown, size, hedging, dividend policy. Compare a low-cost index fund with active funds side by side (a 1.5% fee gap compounds to roughly 30% less money over 25 years; example in `references/worked-examples.md`). An active fund earns its fee only when its excess return over the benchmark (5-year and 10-year return after fees − benchmark return) is above 0 in both windows and above the peer median, and the manager team is stable. Never pick on 1-year return alone.
5. Score the shortlist with `decision-desk/decision-scoring`, command `score` (its `templates/score.json` is already a fund example; script path: see `decision-desk/decision-scoring`, superuser plugin).
6. Lay out the shapes side by side ("low-cost SET50 index" vs "global index feeder" vs active) with fees and risk; the user picks.
7. Check fund-level tax: RMF/ThaiESG holding rules before buying for tax.
8. Set the DCA plan and a yearly review date; monthly schedule, rebalancing and pre-order checks → `rebalance-and-dca`. For the user's own fees run `node money-calc.mjs fee <file.json>` (script in `portfolio-snapshot`, see its Script path).

## Scoring the shortlist

| Step | Value |
|---|---|
| Hard rules (`must`, filter out first, not scored) | Risk level not above what the user accepts · money needed within 3 years → level 4 or lower · minimum purchase not above what the user can invest · a fund promising a high fixed return → `scam-check`, not shortlisted |
| Criterion 1 | Total cost, TER % (feeder fund plus the master fund's TER) · `low` · proposed weight 0.35 |
| Criterion 2 | 5-year return after fees minus benchmark return, % · `high` · 0.35 |
| Criterion 3 | Maximum drawdown, % · `low` · 0.30 |

Weights are starting values the user can change (not yet measured). Every figure comes from the factsheet with its date. If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), show every ranked fund and let the user choose. The score is information; past returns do not guarantee the future. Fee ranges in the reference are rules of thumb, not regulated caps (รอยืนยัน per fund).

## Check before done
- 3 funds shortlisted from one AIMC category, every figure from the factsheet with its date
- Feeder funds show the master fund's TER added
- Horizon matches risk (within 3 years → levels 1–4)
- A fund promising fixed high returns went to `scam-check`
- No fund called "the best"

## References
- [`references/fund-types-and-fees.md`](references/fund-types-and-fees.md) — open to choose a fund type or explain fees (front-end, back-end, switching, management, TER)
- [`references/worked-examples.md`](references/worked-examples.md) — open to show fee drag over 25 years (DCA unit buying: `rebalance-and-dca`)
- [`references/sources.md`](references/sources.md) — sources and check dates (2026-10-26) for risk levels 1–8 and the 10% dividend tax
