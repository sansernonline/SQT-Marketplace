---
name: post-trade-review
description: Use weekly or monthly when the user asks how their trading is going (สรุปผลเทรด, ทบทวนพอร์ต). Computes win rate, expectancy and drawdown from the journal, finds the one repeating mistake, and turns it into one testable rule.
---

# Post-Trade Review (ทบทวนผลการเทรด)

Coach tape review, not an accountant's report. Input: the journal from `trade-journal` (columns `r_multiple`, `pnl_baht`, `setup`, `emotion`, `violation`). General information, not investment advice.

## Formulas

Let N = closed trades, W = winners (R > 0), L = losers (R ≤ 0).

| Statistic | Formula | Read it as |
|---|---|---|
| Win rate | W ÷ N | Means little alone — 30% can be very profitable with big winners |
| Average win (R) | sum of winning R ÷ W | |
| Average loss (R) | sum of losing R ÷ L (as a positive number) | Should be close to 1.0; above 1.2 = stops slipping or moved |
| Payoff ratio | avg win ÷ avg loss | |
| **Expectancy (R per trade)** | win rate × avg win − loss rate × avg loss | Average R earned per trade; > 0 = edge, in baht = expectancy × typical 1R |
| Profit factor | gross profit ÷ gross loss (baht) | > 1.5 decent, < 1 losing |
| Breakeven win rate | 1 ÷ (1 + payoff ratio) | Win rate needed at the current payoff to make zero |
| **Max drawdown** | largest fall from a running peak of the equity curve to a later low, ÷ that peak | Size of the worst losing stretch you must be able to sit through |
| Max consecutive losses | longest run of R ≤ 0 | Check: 2% risk × this run = pain you can stand? |
| Violation rate | trades with a `violation` ÷ N | Target 0; above 10% the stats describe the rule-breaking, not the strategy |

Fewer than 20 trades: report the numbers but say the sample is too small to judge the strategy — judge only rule-following.

## Workflow

1. Load closed trades since the last review; separate `live` and `paper`.
2. Compute the table above (show the arithmetic once, so the user can check it).
3. **Group losing trades** by setup, by emotion tag, by day of week / time of day, and by violation; find the cluster with the largest total −R, not the most memorable trade.
4. **Name one pattern** that cost the most this period, quoting 2–3 actual journal lines as evidence.
5. **Write one rule** as a countable gate: "No entry within 15 minutes after a stop-out" or "No `breakout-volume` entry when volume < 1.5× average".
6. Verdict on last period's rule: followed how often, did it help → keep / adjust / drop.

## Worked example — 10 trades (R): +2.0, −1.0, −1.0, +3.0, −1.2, +0.5, −1.0, +1.5, −1.0, −2.0

- W = 4 (2.0, 3.0, 0.5, 1.5 → sum 7.0); L = 6 (sum 7.2)
- Win rate = 4/10 = **40%**; avg win = 7.0/4 = **1.75R**; avg loss = 7.2/6 = **1.20R**
- Payoff = 1.75/1.20 = 1.46 → breakeven win rate = 1/(1+1.46) = 41%
- Expectancy = 0.40 × 1.75 − 0.60 × 1.20 = 0.70 − 0.72 = **−0.02R** per trade — about breakeven
- Equity in R, starting 0: 2, 1, 0, 3, 1.8, 2.3, 1.3, 2.8, 1.8, −0.2. Peak 3.0 → low −0.2 = drawdown **3.2R**. With 1R = 1,000 baht on 100,000 capital, from the peak of 103,000 to 99,800 = 3,200 ÷ 103,000 = **3.1%**
- Pattern found: the −2.0R trade had violation `moved-stop`, and the −1.2R trade was tagged FOMO. Without the moved stop (−1.0 instead of −2.0), expectancy = (7.0 − 6.2) ÷ 10 = **+0.08R**. The one rule: "Stops only move toward profit — never away." Count violations next month.

## Output

One page: stats table (live, paper separately) · sample-size warning if N < 20 · the one pattern with quoted evidence · the one new rule · last rule's verdict. No pep talks, no list of ten lessons.

Related: data format in `trade-journal`; strategy practice in `paper-trading`; sizing fixes in `position-sizing`.
