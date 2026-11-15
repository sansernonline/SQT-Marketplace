# Review statistics (สถิติทบทวน)

Used by mode 2 of `trade-journal`. Let N = closed trades, W = winners (R > 0), L = losers (R ≤ 0).

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

## Script

`trade-stats.mjs` computes the table above from the journal: win rate, average win and loss in R, payoff ratio, expectancy, breakeven win rate, profit factor (needs `pnl_baht` on every row), max drawdown in R (and % of capital when `capital` is given), longest winning and losing streaks, violation rate (a `violation` of blank, `no`, `n`, `none`, `false`, `0`, `-`, `ไม่` or `ไม่มี` is not a violation). `live` and `paper` rows (column `account`) are reported separately. Rows with a blank `r_multiple` are open trades and are skipped. With fewer than 20 closed trades the output carries a small-sample label.

```
node trade-stats.mjs <file.json|file.csv> [--capital 100000] [--json]     # example file: scripts/example.json
node trade-stats.mjs --self-test
```

Input: the `trade-journal.csv` header as is, or JSON `[ {...} ]` / `{ "capital": 100000, "trades": [ {...} ] }`. Needed per row: `r_multiple`; used when present: `account`, `pnl_baht`, `violation`. Keep rows in exit order — drawdown and streaks follow file order. A non-numeric `r_multiple` or `pnl_baht` stops the script with a message naming the row and field. The script does the numbers only; finding the pattern and writing the one rule (steps 3–6) stays with you.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/trade-journal/scripts/trade-stats.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/trade-journal/scripts/trade-stats.mjs` · Node only, no dependencies. The worked example below is `scripts/example.json` and gives the same numbers.

## Worked example — 10 trades (R): +2.0, −1.0, −1.0, +3.0, −1.2, +0.5, −1.0, +1.5, −1.0, −2.0

- W = 4 (2.0, 3.0, 0.5, 1.5 → sum 7.0); L = 6 (sum 7.2)
- Win rate = 4/10 = **40%**; avg win = 7.0/4 = **1.75R**; avg loss = 7.2/6 = **1.20R**
- Payoff = 1.75/1.20 = 1.46 → breakeven win rate = 1/(1+1.46) = 41%
- Expectancy = 0.40 × 1.75 − 0.60 × 1.20 = 0.70 − 0.72 = **−0.02R** per trade — about breakeven
- Equity in R, starting 0: 2, 1, 0, 3, 1.8, 2.3, 1.3, 2.8, 1.8, −0.2. Peak 3.0 → low −0.2 = drawdown **3.2R**. With 1R = 1,000 baht on 100,000 capital, from the peak of 103,000 to 99,800 = 3,200 ÷ 103,000 = **3.1%**
- Pattern found: the −2.0R trade had violation `moved-stop`, and the −1.2R trade was tagged FOMO. Without the moved stop (−1.0 instead of −2.0), expectancy = (7.0 − 6.2) ÷ 10 = **+0.08R**. The one rule: "Stops only move toward profit — never away." Count violations next month.
