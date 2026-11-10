---
name: trading-technique-course
description: Use when learning trading techniques step by step (trend, breakout, mean reversion, support/resistance) with paper-trade gates (เรียนเทรด).
---

# Trading Technique Course (หลักสูตรเทคนิคเทรดแบบมีด่าน)

A course with levels. Each level teaches one technique as written rules, tests it on past charts, practises it on paper, and measures it in the journal. The next level opens only when the gate is met. General information, not investment advice. Wording follows `human-writing`.

> **One rule:** risk first, one technique at a time, and no level or real money before its gate is met in the user's own numbers. The course never names a stock or pair to trade and never says a technique will make money.

## Use when / not

Use when the user wants to learn to trade, asks which technique to start with, wants a study plan for trend, breakout, mean reversion or support and resistance, or asks if they are ready to move to the next technique or to real money.

Not when: one trade to size now → `position-sizing` · what this chart says today → `technical-signals` · following someone else's signal → `copy-trade-check` · building an Expert Advisor → `stack-mql` (software-development).

## Use another skill instead, or with this one

This skill holds the levels and the gates. The how-to lives in these skills; open them, do not copy them here.

| Need | Use | What it gives the course |
|---|---|---|
| Size and stop for every practice trade | `position-sizing` (`size.mjs`; forex, CFD and crypto in its forex reference) | Level 0 and every trade after it |
| Indicator settings and false signals | `technical-signals` (defaults table, `signal-meanings.md`, `indicators.mjs`) | The SMA, EMA, RSI, volume and zone definitions the rules use |
| Practice account with Thai market friction | `paper-trading` (realism rules, graduation gate) | The paper part of every level and the real-money gate |
| Logging and the numbers | `trade-journal` (R-multiple, fixed setup names, `trade-stats.mjs`) | Expectancy, win rate, drawdown, violation rate for each gate |
| Forex or CFD with real money | `copy-trade-check` legal box | The BOT rules before any money leaves Thailand |
| Guaranteed-profit course, LINE group "teacher", pay to join signals | `scam-check` — stop here | |

## 1 · Before level 0 — ask once

Ask in one message, with defaults the user can accept: market (default SET stocks) · timeframe (default daily) · paper capital, the amount they would really trade (`paper-trading` setup) · the drawdown they could sit through in R (default 10R, starting value, not yet measured) · 3 or more symbols **they** pick from their own watchlist for backtests. Do not suggest symbols. Create `course-progress.md` from the template in [references/levels.md](references/levels.md) section 7.

## 2 · The levels

| Level | Technique | Setup name in the journal |
|---|---|---|
| 0 | Position sizing and stop-loss — **must come first, cannot be skipped or dropped** | the user's own, or `no-setup` |
| 1 | Trend following (pullback in an uptrend) | `pullback-50ma` |
| 2 | Breakout with volume | `breakout-volume` |
| 3 | Mean reversion (RSI dip in an uptrend) | `rsi-reversion` (add it to the fixed list when the level starts) |
| 4 | Price action at support and resistance | `range-bounce` |

The entry, stop, exit and filter of every level are written as numbered rules in [references/levels.md](references/levels.md). Use them as written; a user who wants a change makes it before the backtest, and the change is written down.

## 3 · How each level runs (levels 1–4)

1. **Read the rules** in `levels.md` and the matching rows of `technical-signals`. The user restates the entry and stop in their own words; if they cannot, stay here.
2. **Backtest by hand** on past daily charts with future bars hidden (bar replay, or cover the right side). Log every signal, ugly ones too, as a row in the `trade-journal` CSV with `account = backtest`, costs included. Target 30 or more signals across 3 or more symbols. Steps and the bias traps: `levels.md` section 6.
3. **Run** `trade-stats.mjs` on the file (path in `trade-journal`). Never work the numbers out by hand.
4. **Paper** — trade only this setup in the `paper-trading` ledger with its realism rules, sized with `size.mjs`, logged before entry. Changing a rule restarts the count.
5. **Measure** with `trade-stats.mjs` (`account = paper`) and check the gate below. Write the result in `course-progress.md`.

Level 0 is different: no backtest. The user places 10 paper trades with any entry they like; the point is the process (stop first, size from `size.mjs`, R logged).

## 4 · Gates

Every number here is a starting value, not yet measured, except where a skill is named as its source.

| Gate | Pass when, all true |
|---|---|
| Level 0 → level 1 | 10 paper trades logged before entry, each with a stop and a size from `size.mjs` · zero `no-stop`, `oversize` or `moved-stop` violations · average loss 1.2R or less (the `trade-stats.mjs` flag) |
| Backtest → paper (each level) | 30 or more signals on 3 or more symbols · expectancy above 0R after costs. If not: change one rule and retest, at most 2 times, because each retest on the same charts makes a lucky fit more likely. Still not above 0 → mark the level **dropped**: record it and move on, but this technique never goes live |
| Level n → level n+1 | 20 or more closed paper trades with this setup (the `paper-trading` minimum for a first look) · expectancy above 0R · violation rate 5% or less (`paper-trading`) · average loss 1.2R or less · max drawdown within the user's limit · paper expectancy at least half the backtest expectancy; lower means the rules are not being followed as written, so find which |
| A technique → real money | The `paper-trading` graduation gate for that setup alone: 30 or more trades, expectancy above +0.2R, violations 5% or less, drawdown within the limit, 2 months or more including a down week. Then live at one quarter of the planned risk for 20 trades. One technique live at a time. Forex or CFD → the `copy-trade-check` legal box first. The user decides |

Fail a gate → stay on the level and run another 20 paper trades; do not skip ahead. The win rate is reported with its 95% interval but is never a gate on its own, because a 35% win rate with 2R winners beats a 70% win rate with 0.3R winners.

## 5 · Weekly rhythm

Once a week: run `trade-stats.mjs` on the current level, update `course-progress.md`, and hand the journal to `trade-journal` mode 2 (Review) for one pattern and one rule. Report in 4 lines: level · trades so far / needed · expectancy and violations · what is left before the gate.

## Worked example (ตัวอย่าง, numbers made up)

**Ask:** "I passed level 0. Level 1 trend: backtest gave 34 signals on 3 SET stocks, expectancy +0.18R. Paper: 20 trades, 8 wins averaging 2.1R, 12 losses averaging 1.05R, 1 moved stop. Can I go to breakout, and can I start with real money?"

**Did:** ran `trade-stats.mjs` on the 20 paper rows (2026-11-10): win rate 40% (95% interval 21.9%–61.3%) · expectancy 0.4 × 2.1 − 0.6 × 1.05 = **+0.21R** · average loss 1.05R · violations 5% · max drawdown 6.3R. Checked the level 1 → 2 gate: 20 trades ✓ · above 0R ✓ · violations 5% ✓ · average loss ✓ · drawdown 6.3R inside the user's 10R ✓ · paper +0.21R is above half of +0.18R ✓. Real-money gate: only 20 of 30 trades and 6 weeks of 8 → not yet.

**Result:** "Level 1 passed; level 2 (breakout) opens. Real money with the trend setup is not open yet: 10 more paper trades and 2 more weeks, still above +0.2R. Keep the trend setup on paper alongside level 2 so its count keeps growing. The moved stop on trade 14 is the one habit to watch."

## Check before sending

- [ ] Level 0 done before any technique; no level skipped
- [ ] Every gate number came from `trade-stats.mjs` output, not mental arithmetic
- [ ] No stock, pair or coin suggested; no promise that a technique makes money
- [ ] Rules used as written in `levels.md`, or the user's change is written down before the backtest
- [ ] Real money only after the `paper-trading` graduation gate, at one quarter risk, and the decision is the user's

## Sources

- Gates, minimum trade counts, quarter-risk start, violation limit: `paper-trading` graduation gate and `trade-journal` (this plugin) · indicator defaults and the breakout failure rule: `technical-signals` · the 2-retest limit borrows the multiple-testing idea of [Harvey, Liu and Zhu (NBER w20592)](https://www.nber.org/papers/w20592) already cited in `copy-trade-check`; the number 2 is ours (starting value, not yet measured)
- Level rules in `levels.md` are common textbook forms written as countable rules for this course; they are teaching material, not tested strategies (not yet measured on Thai data)
- Red/green test of this skill with a fresh agent: not yet run (ยังไม่ได้รัน); eval cases are in `plugins/trading-finance/evals/trading-technique-course-*`
