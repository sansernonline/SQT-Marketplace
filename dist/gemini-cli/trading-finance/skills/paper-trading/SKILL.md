---
name: paper-trading
description: Use when testing a strategy or learning order types without real money. Virtual ledger with real SET rules and costs, and a gate before real size.
---

# Paper Trading (พอร์ตจำลอง)

A practice account that only works if it is treated as real. General information, not investment advice.

## Setup

1. **Virtual capital** — the amount the user would really trade (default 100,000 baht). Practising with 10 million when the real account is 50,000 teaches the wrong sizing.
2. **Written rule set** before trade #1 — setups allowed (from the `trade-journal` fixed list), risk per trade (1%), max open positions, entry/exit rules. Changing rules mid-test restarts the count.
3. **Ledger** — use the `trade-journal` CSV with `account = paper`, plus a cash column. Template: [references/paper-ledger.md](references/paper-ledger.md).

## Realism rules — simulate the Thai market, not a fantasy

| Real-world friction | How to simulate |
|---|---|
| Board lot | Round to 100 shares (50 for stocks ≥ 500 baht for 6 months) |
| Tick size | Entry and stop on valid ticks — table in `position-sizing` (e.g. 0.25 for 25–<100 baht) |
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

Broker apps and trading platforms often have a built-in simulator; using one is fine, but still keep this ledger so the statistics match the live journal.

## Graduation gate — from paper to small real size

All must be true:

| Criterion | Threshold |
|---|---|
| Closed trades | ≥ 30 (≥ 20 minimum for a first look) |
| Expectancy | > +0.2R per trade (formula in `post-trade-review`) |
| Violation rate | ≤ 5% |
| Max drawdown | Within what the user says they can sit through in real money |
| Time span | ≥ 2 months, including at least one down week for the market |

Then start live at **one quarter** of the planned risk (0.25% instead of 1%) for the next 20 trades. That call stays the user's.

## Worked example

Capital 100,000. Rule: `pullback-50ma` only, risk 1%. Trade #12: XYZ limit buy 31.50, stop 30.25 (ticks 0.25 OK). Risk/share 1.25 + costs ≈ 0.13 = 1.38 → 1,000 ÷ 1.38 = 724 → **700 shares** (22,050 baht = 22% → cap at 10%: 300 shares, 9,450 baht). Low of the day was 31.50 exactly — touched, not traded through → **no fill**, logged `no-fill`. The next day it opened at 31.25, but the limit was a day order and had expired, so there is still no trade. Counting this as a fill at 31.50 is exactly the "almost trade" that makes paper results look better than live ones.

## Reporting

Monthly: trades, win rate, avg R, expectancy, max drawdown, violations, passed/no-fill count, one lesson — using `post-trade-review`. Command: `/paper-trade`.
