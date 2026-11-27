# skill: trade-practice

Use when practising trades on paper or learning trading step by step

# trade-practice — paper trading and staged technique course

> **One rule:** risk first, one technique at a time, and no real money until the gate of the current level is met in the user's own numbers.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Practising trades on paper, logging them, checking the stats | [references/paper-trading.md](references/paper-trading.md) |
| Learning trading techniques step by step through levels | [references/trading-technique-course.md](references/trading-technique-course.md) |

Other files in this folder: `paper-ledger.md` (the paper record), `levels.md` (the course levels and their gates), `sources.md` (lot, ceiling and settlement rules) and the worked examples.

## Steps every part shares

1. Log every paper trade in the journal with its date, size, stop and reason, before the outcome is known.
2. Run `trade-stats.mjs` (path in `trade-journal`) for the win rate and the results; never work the numbers out by hand.
3. Check the gate in `levels.md` before moving to the next level.

## Check before done

- General information, not investment advice. The course never names a stock or a currency pair to trade.
- Never say that a technique will make money.
- Paper results are treated as if the money were real, including the costs, the ceiling and the floor of the day's price.
- No level and no real money before its gate is met in the user's own journal numbers.
- A failed gate means the user stays on the same level, not skips ahead.

Whole job with several steps → playbook [trade-review](../superuser/references/playbook-trade-review.md) for the weekly or monthly review.


## reference: levels.md

# Level rules, backtest steps and progress template — trading-technique-course

Read from `SKILL.md` section 2. Daily chart unless the user chose otherwise. Indicator settings are the `technical-signals` defaults (SMA 50/200, EMA 20, RSI 14 Wilder, 20-day average volume, zones ± 1–2%). Every number below is a teaching starting value, not yet measured on Thai data. "Next open" means the order is placed after the close and fills at the next session's open under the `paper-trading.md` realism rules (gaps, ceiling and floor, board lots).

Contents:

1. [Level 0 — sizing and stop-loss](#1--level-0--sizing-and-stop-loss)
2. [Level 1 — trend following](#2--level-1--trend-following-pullback-50ma)
3. [Level 2 — breakout with volume](#3--level-2--breakout-with-volume-breakout-volume)
4. [Level 3 — mean reversion](#4--level-3--mean-reversion-rsi-reversion)
5. [Level 4 — support and resistance](#5--level-4--price-action-at-support-and-resistance-range-bounce)
6. [Backtest by hand](#6--backtest-by-hand)
7. [Progress template](#7--progress-template--course-progressmd)

## 1 · Level 0 — sizing and stop-loss

1. Before entry, write the stop: the price where the trade idea is wrong, not a round percentage.
2. Size with `size.mjs` from `position-sizing` at 1% risk (2% is the most, and only if the user wrote it down).
3. Log entry, stop, target, 1R in baht, setup, reason and emotion before the order (`trade-journal` mode 1).
4. Never move the stop further away. Moving it closer to lock in profit is allowed and logged.
5. At exit, log the R-multiple net of costs.

What the user should be able to say afterwards: "1R is what I lose if the stop is hit, and my size comes from 1R, not from how sure I feel."

## 2 · Level 1 — trend following (`pullback-50ma`)

**Filter, all true at the signal bar's close:**
1. Close above the 200-day SMA.
2. 50-day SMA above the 200-day SMA, and the 50-day is higher than it was 10 bars ago.

**Entry:**
3. In the last 5 bars, the low touched the 50-day SMA or came within 2% above it (the pullback).
4. Today closes above yesterday's high → buy at the next open.

**Stop:** 1 tick below the lowest low of the pullback (rule 3 bars).

**Exit:** the first close below the 50-day SMA → sell at the next open. No fixed target; the trend decides.

**Common mistakes:** buying the pullback before rule 4 confirms · taking signals when the 50-day is flat (rule 2 fails) · a stop so wide that the size becomes tiny; that is information, not a reason to tighten the stop.

## 3 · Level 2 — breakout with volume (`breakout-volume`)

**Filter:**
1. At least 20 bars where the high-low range stayed within 15% (a base).

**Entry:**
2. Close above the highest high of the previous 20 bars.
3. Volume that day at least 1.5× the 20-day average (`technical-signals` default) → buy at the next open. Volume below that → no trade, even if price broke out.

**Stop:** 1 tick below the lowest low of the last 10 bars.

**Exit:**
4. Failed breakout: a close back below the breakout level within 3 bars (`technical-signals` signal-meanings) → sell at the next open.
5. Otherwise the first close below the 20-day EMA → sell at the next open.

**Common mistakes:** counting an intraday poke above the high as a breakout (rule 2 needs the close) · skipping rule 3 because "it looks strong" · buying a gap so large that the stop distance breaks the 1% risk; take the smaller size or pass.

## 4 · Level 3 — mean reversion (`rsi-reversion`)

**Filter:**
1. Close above the 200-day SMA. Buy dips only in a long-term uptrend; RSI can stay below 30 for weeks in a downtrend.

**Entry:**
2. RSI(14) closed below 30 within the last 5 bars, and today it closes back above 30 → buy at the next open. This is the same RSI cross-up that `indicators.mjs` counts for its hit rate, so its signal count on the user's symbol is a first check.

**Stop:** 1 tick below the lowest low of the last 5 bars.

**Exit, whichever comes first:**
3. RSI(14) closes at 50 or above → sell at the next open.
4. 10 bars after entry without rule 3 → sell at the next open (time stop).

**Common mistakes:** buying while RSI is still falling below 30 (no cross-up yet) · ignoring rule 1 and catching a falling stock · holding past rule 4 hoping for 50.

## 5 · Level 4 — price action at support and resistance (`range-bounce`)

**Mark the zones first, before looking for an entry:**
1. Support zone: 2 or more swing lows within 2% of each other. Resistance zone: the nearest such cluster of swing highs above. A swing low is a bar whose low is lower than the 2 bars on each side.

**Entry:**
2. Price trades into the support zone.
3. The same day closes above its open and in the upper half of the day's range (a rejection bar).
4. Distance to the resistance zone is at least 2× the distance to the stop → buy at the next open. Less than 2× → no trade.

**Stop:** 1 tick below the bottom of the support zone.

**Exit, whichever comes first:** price reaches the resistance zone → sell there (a limit order fills only if price trades through it, per `paper-trading.md`) · a close below the support zone → sell at the next open.

**Common mistakes:** drawing the zone after seeing the bounce · treating a zone as one exact price · taking trades that fail rule 4 because the bar "looks perfect".

## 6 · Backtest by hand

1. Pick the symbols before looking at any chart (from the user's watchlist), so winners are not chosen after the fact. 3 or more symbols, about 2 years of daily bars each.
2. Hide future bars: TradingView bar replay, or scroll so the signal bar is the last one visible. Decide from what is visible only.
3. Walk forward bar by bar. Every time the rules are met, log a row: date, symbol, entry at the next open, stop, exit by the rules, costs (the user's broker rate, both sides), R-multiple. `account = backtest`, `setup = <level's name>`.
4. Log every signal, including those that look ugly. Skipping 3 bad-looking ones out of 30 changes the answer.
5. Run `trade-stats.mjs` on the backtest rows and fill the backtest line of the progress file.
6. A changed rule means a new backtest from step 1 on the same symbols, counted as 1 of the 2 allowed retests.

Hand backtests are slow and still optimistic (fills at the open are assumed; liquidity is ignored). That is why the paper part decides the gate, not the backtest.

## 7 · Progress template — `course-progress.md`

```markdown
# Course progress — <name>

Market: SET stocks · Timeframe: daily · Paper capital: 100,000 · Drawdown limit: 10R · Symbols: <the user's picks>

| Level | Status | Backtest (signals · expectancy) | Paper (trades · expectancy · violations · max DD) | Gate met on |
|---|---|---|---|---|
| 0 Sizing and stop | ทำอยู่ | — | 0/10 · — · — · — | |
| 1 Trend | ค้างอยู่ | | | |
| 2 Breakout | ค้างอยู่ | | | |
| 3 Mean reversion | ค้างอยู่ | | | |
| 4 Support and resistance | ค้างอยู่ | | | |

Real-money gate (per technique): 30 trades · above +0.2R · violations 5% or less · 2 months including a down week → then quarter risk for 20 trades.

## Rule changes (date · level · old → new · why)
```

Status words: `เสร็จ` (gate met) · `ทำอยู่` · `ค้างอยู่` (not started) · `ติด` (gate failed, repeating) · `dropped` (backtest stayed at or below 0R after 2 retests).


## reference: paper-ledger.md

# Paper ledger template

Same columns as the live `trade-journal` CSV, with `account = paper`, plus two columns for realism.

```csv
id,account,date_in,symbol,side,shares,entry,stop,target,one_r_baht,setup,reason,emotion,stop_changes,date_out,exit,costs_baht,pnl_baht,r_multiple,what_happened,plan_followed,violation,fill_status,cash_after,notes
```

| Extra column | Values |
|---|---|
| fill_status | `filled`, `no-fill` (limit touched but not traded through), `passed` (would have hesitated), `gap-fill` (opened past the stop) |
| cash_after | virtual cash after costs, so over-allocation shows up |

## Rule sheet (fill once, before trade #1)

```
Start date ______   Virtual capital ______ baht   Real account size ______
Setups allowed: ____________________________
Risk per trade ___%   Max open positions ___   Max position ___% of capital
Entry rule: ________________________________
Exit rule (stop / target / time): __________
Commission used ___% + VAT 7% on commission   Slippage assumed: 1 tick
Rule changes restart the count: Y
```

## Monthly summary box

```
Month ____  Trades ____  Passed/no-fill ____
Win rate ___%  Avg win ___R  Avg loss ___R  Expectancy ___R
Max drawdown ___%  Violations ___ (___%)
Graduation gate met? Y/N — which line fails: ______
One lesson: ______________________________
```


## reference: paper-trading.md

<!-- merged from skill `paper-trading` on 2026-11-27 · description was: Use when practicing trades with no real money -->
# Paper Trading (พอร์ตจำลอง)

A practice account that only works if it is treated as real. General information, not investment advice.

## Setup

1. **Virtual capital** — the amount the user would really trade (default 100,000 baht). Practising with 10 million when the real account is 50,000 teaches the wrong sizing.
2. **Written rule set** before trade #1 — setups allowed (from the `trade-journal` fixed list), risk per trade (1%), max open positions, entry/exit rules. Changing rules mid-test restarts the count.
3. **Ledger** — use the `trade-journal` CSV with `account = paper`, plus a cash column. Template: [references/paper-ledger.md](paper-ledger.md).

## Realism rules — simulate the Thai market, not a fantasy

| Real-world friction | How to simulate |
|---|---|
| Trading hours | Morning: pre-open 09:30 → random open (T1) → close 12:30 · Afternoon: pre-open **13:30** (since 25 Mar 2567; it used to be 14:00) → open 14:00 → pre-close 16:30 → random close 16:35–16:40 · off-hour until 17:00. Orders outside these windows queue for the next session; a paper fill cannot happen at 13:45 (set.or.th trading-hours, checked 2026-10-22) |
| Board lot | Round to 100 shares (50 for stocks ≥ 500 baht for 6 months) |
| Tick size | Entry and stop on valid ticks — the table is in `position-sizing` |
| Fill price | Market order = next tick against you (buy at ask + 0, assume 1 tick slippage); limit order fills only if price **trades through** the limit, not just touches it |
| Costs | Commission per the user's broker (often around 0.15–0.25% for internet orders, plus 7% VAT on commission (รอยืนยัน — use the real broker rate)); charge both buy and sell |
| Settlement | T+2 — cash from a sale is not available for a cash-account purchase the same day (credit-balance and cash-balance accounts differ; ask the broker) |
| Ceiling/floor | ±30% daily; a stop below the floor cannot fill that day |
| Gaps | If the open is beyond the stop, fill at the open, not at the stop |
| Liquidity | Do not paper-trade a size above 5% of the stock's average daily value |

## Honesty rules

- **Log before the trade, not after** — entry, stop, target, reason written first, with a timestamp.
- Same size rules as live (`position-sizing`).
- If you would have hesitated for real, record it as `passed` — that is data.
- Moving a stop away = violation, tracked separately from P/L.
- No restarting the account after a bad week; drawdown is part of the result.
- Use end-of-day prices only if the strategy is end-of-day; intraday strategies need intraday timestamps.

Paper-following an MQL5 copy-trade signal before subscribing (a demo account cannot copy a real signal) → `copy-trade-check` section 6, then log here.

Broker apps and trading platforms often have a built-in simulator; using one is fine, but still keep this ledger so the statistics match the live journal.

## Graduation gate — from paper to small real size

All must be true:

| Criterion | Threshold |
|---|---|
| Closed trades | ≥ 30 (≥ 20 minimum for a first look) |
| Expectancy | > +0.2R per trade (formula in `trade-journal`, Mode 2 · Review) |
| Violation rate | ≤ 5% |
| Max drawdown | Within what the user says they can sit through in real money |
| Time span | ≥ 2 months, including at least one down week for the market |

Then start live at **one quarter** of the planned risk (0.25% instead of 1%) for the next 20 trades. That call stays the user's.

## Reporting

Monthly: trades, win rate, avg R, expectancy, max drawdown, violations, passed/no-fill count, one lesson — using `trade-journal` Mode 2 (Review). Command: `/trading-finance:trade-practice`.

## เรียกเป็นคำสั่ง

`/trading-finance:trade-practice <log|stats|setup> [trade details]`

Run the virtual trading account with the `trade-practice` skill: **the user's request**

- `log` — record a planned trade (entry, stop, target, thesis) BEFORE it happens
- `stats` — monthly summary: trades, win rate, expectancy, rule violations
- `setup` — create or reset the ledger with virtual capital and rules

## References

- [`worked-example.md`](worked-example.md) — open for a sizing and no-fill example
- [`sources.md`](sources.md) — sources and check date (2026-10-26) for lot, ceiling and settlement rules


## reference: sources.md

# Sources · paper-trading

ตรวจล่าสุด 2026-10-26 · ล็อต 100 หุ้น (50 หุ้นเมื่อราคา ≥ 500 บาทติดกัน 6 เดือน) · ราคาสูงต่ำสุด ±30% · ชำระราคา T+2 · แหล่ง: https://www.set.or.th/en/market/information/trading-procedure/trading-units , https://www.set.or.th/en/trading-units-tick-sizes-price-limits , https://www.set.or.th/annualreport/en/2017/41 (T+2) , https://www.clearstream.com (ข่าวลูกค้า 1280838 เรื่องล็อต) , https://www.mondovisione.com (SET คืนเพดาน ±30% 25 มิ.ย. 2568) · ค่าคอมมิชชันยังไม่ได้ตรวจ ใช้อัตราจากใบยืนยันของโบรกเกอร์ผู้ใช้


## reference: trading-technique-course.md

<!-- merged from skill `trading-technique-course` on 2026-11-27 · description was: Use when learning trading techniques step by step -->
# Trading Technique Course (a trading technique course with gates)

A course with levels. Each level teaches one technique as written rules, tests it on past charts, practises it on paper, and measures it in the journal. The next level opens only when the gate is met. General information, not investment advice.

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
| Practice account with Thai market friction | `paper-trading.md` (realism rules, graduation gate) | The paper part of every level and the real-money gate |
| Logging and the numbers | `trade-journal` (R-multiple, fixed setup names, `trade-stats.mjs`) | Expectancy, win rate, drawdown, violation rate for each gate |
| Forex or CFD with real money | `copy-trade-check` legal box | The BOT rules before any money leaves Thailand |
| Guaranteed-profit course, LINE group "teacher", pay to join signals | `scam-check` — stop here | |

## 1 · Before level 0 — ask once

Ask in one message, with defaults the user can accept: market (default SET stocks) · timeframe (default daily) · paper capital, the amount they would really trade (`paper-trading.md` setup) · the drawdown they could sit through in R (default 10R, starting value, not yet measured) · 3 or more symbols **they** pick from their own watchlist for backtests. Do not suggest symbols. Create `course-progress.md` from the template in [references/levels.md](levels.md) section 7.

## 2 · The levels

| Level | Technique | Setup name in the journal |
|---|---|---|
| 0 | Position sizing and stop-loss — **must come first, cannot be skipped or dropped** | the user's own, or `no-setup` |
| 1 | Trend following (pullback in an uptrend) | `pullback-50ma` |
| 2 | Breakout with volume | `breakout-volume` |
| 3 | Mean reversion (RSI dip in an uptrend) | `rsi-reversion` (add it to the fixed list when the level starts) |
| 4 | Price action at support and resistance | `range-bounce` |

The entry, stop, exit and filter of every level are written as numbered rules in [references/levels.md](levels.md). Use them as written; a user who wants a change makes it before the backtest, and the change is written down.

## 3 · How each level runs (levels 1–4)

1. **Read the rules** in `levels.md` and the matching rows of `technical-signals`. The user restates the entry and stop in their own words; if they cannot, stay here.
2. **Backtest by hand** on past daily charts with future bars hidden (bar replay, or cover the right side). Log every signal, ugly ones too, as a row in the `trade-journal` CSV with `account = backtest`, costs included. Target 30 or more signals across 3 or more symbols. Steps and the bias traps: `levels.md` section 6.
3. **Run** `trade-stats.mjs` on the file (path in `trade-journal`). Never work the numbers out by hand.
4. **Paper** — trade only this setup in the `paper-trading.md` ledger with its realism rules, sized with `size.mjs`, logged before entry. Changing a rule restarts the count.
5. **Measure** with `trade-stats.mjs` (`account = paper`) and check the gate below. Write the result in `course-progress.md`.

Level 0 is different: no backtest. The user places 10 paper trades with any entry they like; the point is the process (stop first, size from `size.mjs`, R logged).

## 4 · Gates

Every number here is a starting value, not yet measured, except where a skill is named as its source.

| Gate | Pass when, all true |
|---|---|
| Level 0 → level 1 | 10 paper trades logged before entry, each with a stop and a size from `size.mjs` · zero `no-stop`, `oversize` or `moved-stop` violations · average loss 1.2R or less (the `trade-stats.mjs` flag) |
| Backtest → paper (each level) | 30 or more signals on 3 or more symbols · expectancy above 0R after costs. If not: change one rule and retest, at most 2 times, because each retest on the same charts makes a lucky fit more likely. Still not above 0 → mark the level **dropped**: record it and move on, but this technique never goes live |
| Level n → level n+1 | 20 or more closed paper trades with this setup (the `paper-trading.md` minimum for a first look) · expectancy above 0R · violation rate 5% or less (`paper-trading.md`) · average loss 1.2R or less · max drawdown within the user's limit · paper expectancy at least half the backtest expectancy; lower means the rules are not being followed as written, so find which |
| A technique → real money | The `paper-trading.md` graduation gate for that setup alone: 30 or more trades, expectancy above +0.2R, violations 5% or less, drawdown within the limit, 2 months or more including a down week. Then live at one quarter of the planned risk for 20 trades. One technique live at a time. Forex or CFD → the `copy-trade-check` legal box first. The user decides |

Fail a gate → stay on the level and run another 20 paper trades; do not skip ahead. A user who asks to go live before the gate: name the missing gate numbers, keep the whole amount on paper, and give the next paper step (stop-loss on every trade, position sizing). A smaller live amount before the gate still skips the gate. The win rate is reported with its 95% interval but is never a gate on its own, because a 35% win rate with 2R winners beats a 70% win rate with 0.3R winners.

## 5 · Weekly rhythm

Once a week: run `trade-stats.mjs` on the current level, update `course-progress.md`, and hand the journal to `trade-journal` mode 2 (Review) for one pattern and one rule. Report in 4 lines: level · trades so far / needed · expectancy and violations · what is left before the gate.

## Check before sending

- [ ] Level 0 done before any technique; no level skipped
- [ ] Every gate number came from `trade-stats.mjs` output, not mental arithmetic
- [ ] No stock, pair or coin suggested; no promise that a technique makes money
- [ ] Rules used as written in `levels.md`, or the user's change is written down before the backtest
- [ ] Real money only after the `paper-trading.md` graduation gate, at one quarter risk, and the decision is the user's

## References

- [`worked-example.md`](trading-technique-course/worked-example.md) — open for a gate check done on made-up numbers
- [`sources.md`](trading-technique-course/sources.md) — where the gate numbers come from


## reference: worked-example.md

# Worked example · paper-trading

Capital 100,000 · rule `pullback-50ma` only · risk 1%. Trade #12: XYZ limit buy 31.50, stop 30.00.
- Size: risk/share 1.50 + costs ≈ 0.13 = 1.63 → 1,000 ÷ 1.63 = 613 → **600 shares** (18,900 baht = 18.9% of capital)
- Cap: 10% concentration limit (from `position-sizing`) → 300 shares, 9,450 baht
- Fill: low of the day was 31.50 exactly — touched, not traded through → **no fill**, logged `no-fill`
- Next day: it opened at 31.00, but the limit was a day order and had expired, so there is still no trade
- Lesson: counting this as a fill at 31.50 is exactly the "almost trade" that makes paper results look better than live ones
