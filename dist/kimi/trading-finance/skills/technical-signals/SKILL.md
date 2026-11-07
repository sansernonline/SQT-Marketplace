---
name: technical-signals
description: Use when the user asks what a chart says, if now is a good entry, or what RSI, MACD or volume mean.
---

# Technical Signals (อ่านสัญญาณกราฟ)

Read charts for retail traders — plain language, honest confidence, no magic. General information, not investment advice — the decision stays with the user (ask a licensed investment consultant ผู้แนะนำการลงทุน for advice).

## Rules

- Never say "the chart says buy". Say "this signal suggests X, it fails if Y".
- Combine **at most 3 indicators** — more is astrology. Trend + momentum + volume is enough.
- Always name the **timeframe** (daily / weekly / 60-minute) and warn that other timeframes may disagree.
- Say which **default parameters** you used; if the user's app shows different numbers, the settings probably differ.
- A signal on a thin stock (daily value traded under a few million baht) is weak — one order can paint the chart.

## Default parameters

| Indicator | Default setting | Read it as |
|---|---|---|
| SMA (Simple Moving Average) — trend | 50-day and 200-day on daily close; 10/20 EMA (Exponential Moving Average) for swing trades | Price above a rising 200-day = long-term uptrend. 50 crossing above 200 = "golden cross"; below = "death cross" |
| RSI (Relative Strength Index) — momentum | 14 periods, Wilder smoothing; levels 70 / 30 (50 = midline) | Above 70 = ซื้อมากเกินไป (overbought, stretched); below 30 = ขายมากเกินไป (oversold). Stretched is not a reversal |
| MACD (Moving Average Convergence Divergence) | 12-EMA − 26-EMA, signal line 9-EMA of MACD, histogram = MACD − signal | MACD crossing above signal = momentum turning up; crossing zero line = trend change confirmed later |
| Volume | 20-day average volume | Breakout day volume ≥ 1.5× the 20-day average = participation; below average = suspicious |
| Support / resistance | Last 2 swing highs and lows, prior consolidation zones, round numbers | Mark the nearest 2 of each; the line is a zone (± 1–2%), not a single price |

These are the common platform defaults (Streaming, TradingView, Settrade charts all ship RSI 14 and MACD 12-26-9 by default).

## Plain-Thai meaning and false-signal warnings

8 signals (MA, golden cross, RSI 70/30, divergence, MACD cross, breakout on high or low volume) with ภาษาง่าย, the common false signal and what would prove it wrong: [references/signal-meanings.md](references/signal-meanings.md) section 1. Read it for the plain-Thai line of the answer.

## Choosing RSI or MACD (by the stock's own hit rate)

**Hit rate = signals after which price moved the way the signal said ÷ all signals.** Count it by backtest on the same symbol and timeframe, with the parameters in Default parameters. "Moved the way it said" = the close N bars after the signal bar is beyond the signal bar's close in that direction (N = 10 bars, starting value, not yet measured).

| Condition | Do |
|---|---|
| An indicator has fewer than 30 signals (starting value, not yet measured) | Say **"not enough data"** for it; do not use it for the choice |
| Both have fewer than 30 | Answer "not enough data". Read RSI 14 (platform default) and say it is not measured which is more accurate for this stock |
| Both have 30 or more and the 95% Wilson intervals of the two hit rates overlap | Too close; read both, do not choose (at 30 signals each a 5-point gap is noise: the standard error of the difference is about 13 points) |
| Both have 30 or more and the intervals do not overlap | Use the one with the higher hit rate. If even the higher one is not above 50%, do not use that signal as a reason to enter |

No price history to count on → answer "not enough data (not measured)"; never guess a hit rate. Hit rate does not give profit per trade; see `post-trade-review`. This is information; the user decides. This skill does not use `decide.mjs`.

## Script

`indicators.mjs` computes the indicators and the hit-rate choice above, so no number is worked out in the model's head. Input: a CSV with header `date,close,volume` (volume optional), oldest row first, from the user or a market-data plugin; the script downloads nothing. Output: last SMA 50/200, EMA 10/20, RSI 14 (Wilder), MACD 12-26-9, last volume ÷ 20-day average, and the hit rate of RSI (crossing up through 30 / down through 70) and MACD (crossing its signal line) with signal count and 95% Wilson interval, then the choice by the table above.

```
node indicators.mjs <file.csv> [--bars 10] [--json]     # example: scripts/example.csv (made-up prices, format only)
node indicators.mjs --self-test
```

EMA and Wilder averages start from the simple average of the first n bars, so early values can differ from a charting app; give 250+ bars. Not yet compared with TradingView on real symbols.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/technical-signals/scripts/indicators.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/technical-signals/scripts/indicators.mjs` · Node only, no dependencies.

## Workflow

1. Ask: symbol, timeframe, the user's holding period, and what they are deciding (enter / add / exit).
2. Read **trend** (MAs) → **momentum** (RSI or MACD, chosen by hit rate, see "Choosing RSI or MACD") → **volume** on the last big move. With price history, run `indicators.mjs` (section "Script") instead of reading numbers off a chart by eye.
3. Mark the nearest 2 supports and 2 resistances.
4. State the read in one line each, then **the invalidation** — the price that makes the read wrong.
5. Hand the invalidation price to `position-sizing` as the stop (same plugin).
6. End with: technicals describe odds, not certainty.

## Worked example

Daily chart, illustrative numbers (ABC 48.50 breakout: trend, momentum, volume, support reads and the invalidation line): [references/signal-meanings.md](references/signal-meanings.md) section 2.

## Output shape

Per symbol: timeframe and parameters used · one-line trend · one-line momentum · volume note · nearest support/resistance · the single thing to watch next · the invalidation price. Close with "technicals describe odds, not certainty".

Related: put levels on the watchlist with `watchlist-setup`; practise the setup first with `paper-trading`.
