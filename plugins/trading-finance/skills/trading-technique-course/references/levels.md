# Level rules, backtest steps and progress template — trading-technique-course

Read from `SKILL.md` section 2. Daily chart unless the user chose otherwise. Indicator settings are the `technical-signals` defaults (SMA 50/200, EMA 20, RSI 14 Wilder, 20-day average volume, zones ± 1–2%). Every number below is a teaching starting value, not yet measured on Thai data. "Next open" means the order is placed after the close and fills at the next session's open under the `paper-trading` realism rules (gaps, ceiling and floor, board lots).

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

**Exit, whichever comes first:** price reaches the resistance zone → sell there (a limit order fills only if price trades through it, per `paper-trading`) · a close below the support zone → sell at the next open.

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
