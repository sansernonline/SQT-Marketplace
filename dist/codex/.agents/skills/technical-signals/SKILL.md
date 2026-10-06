---
name: technical-signals
description: Use when the user asks what the chart says, whether now is a good time to enter, or what RSI, MACD, moving averages or volume mean (อ่านกราฟ, สัญญาณเทคนิค, ไขว้ขึ้น, ซื้อมากเกินไป).
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

| Signal | ภาษาง่าย | Common false signal | What would prove it wrong |
|---|---|---|---|
| Price above rising 200-day | แนวโน้มใหญ่ยังเป็นขาขึ้น | In a sideways market price crosses the MA every few weeks | Close below the 200-day for several days while it turns flat/down |
| Golden cross 50/200 | เส้นเร็วตัดขึ้นเส้นช้า แนวโน้มเปลี่ยนเป็นขึ้น | Lags badly — often fires after most of the move | Price falls back below the 50-day within weeks |
| RSI > 70 | ราคาวิ่งเร็ว ตึงตัว | In strong uptrends RSI stays above 70 for weeks; shorting it is costly | — (it only says "stretched") |
| RSI < 30 | ราคาลงแรง ตึงตัวขาลง | In crashes RSI stays below 30 while price keeps falling | New low with RSI still falling |
| RSI divergence (price new high, RSI lower high) | แรงส่งเริ่มอ่อน | Can persist for months | Price and RSI both make new highs |
| MACD cross up | แรงส่งเริ่มกลับขึ้น | Many whipsaws in sideways markets, especially below zero line | Crosses back down within a few bars |
| Breakout on high volume | มีคนซื้อจริงหนุน | One-day spike on news, then gives back | Close back inside the old range within 3 days |
| Breakout on low volume | ทะลุแต่ไม่มีแรงหนุน | Usually fails (false breakout) | — treat as unconfirmed |

## Workflow

1. Ask: symbol, timeframe, the user's holding period, and what they are deciding (enter / add / exit).
2. Read **trend** (MAs) → **momentum** (RSI or MACD, pick one) → **volume** on the last big move.
3. Mark the nearest 2 supports and 2 resistances.
4. State the read in one line each, then **the invalidation** — the price that makes the read wrong.
5. Hand the invalidation price to `position-sizing` as the stop (same plugin).
6. End with: technicals describe odds, not certainty.

## Worked example (daily chart, illustrative numbers)

Stock ABC, close 48.50. 50-day SMA 46.20 (rising), 200-day SMA 44.00 (rising). RSI(14) 66. MACD 0.42 above signal 0.31, both above zero. Today broke above the 3-month high of 48.00 on volume 2.1× the 20-day average. Swing lows at 45.75 and 44.50.

| Check | Read |
|---|---|
| Trend | Price > 50 > 200, both rising → uptrend |
| Momentum | RSI 66: strong but not yet stretched; MACD positive |
| Volume | 2.1× average on breakout → real participation |
| Support | 48.00 (old high, now support), 45.75 |
| Resistance | None nearby on this chart — use round number 50.00 |
| **Invalidation** | Close back below 48.00 within 3 days = failed breakout; below 45.75 = trend read wrong |

Plain answer: "แนวโน้มขาขึ้น ทะลุกรอบพร้อมวอลุ่มหนุน ถ้าปิดกลับใต้ 48.00 ภายใน 3 วัน ถือว่าทะลุหลอก" — then size from a stop under 48.00 or 45.75 with `position-sizing`.

## Output shape

Per symbol: timeframe and parameters used · one-line trend · one-line momentum · volume note · nearest support/resistance · the single thing to watch next · the invalidation price. Close with "technicals describe odds, not certainty".

Related: put levels on the watchlist with `watchlist-setup`; practise the setup first with `paper-trading`.
