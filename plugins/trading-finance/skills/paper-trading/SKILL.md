---
name: paper-trading
description: Use when testing a strategy or learning order types without real money, with real SET rules.
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
| Trading hours | Morning: pre-open 09:30 → random open (T1) → close 12:30 · Afternoon: pre-open **13:30** (since 25 Mar 2567; it used to be 14:00) → open 14:00 → pre-close 16:30 → random close 16:35–16:40 · off-hour until 17:00. Orders outside these windows queue for the next session; a paper fill cannot happen at 13:45 (set.or.th trading-hours, checked 2026-10-22) |
| Board lot | Round to 100 shares (50 for stocks ≥ 500 baht for 6 months) |
| Tick size | Entry and stop on valid ticks — current and from-16-Nov-2569 tables are in `position-sizing` (the tick changes on that date for 5–<50 baht) |
| Fill price | Market order = next tick against you (buy at ask + 0, assume 1 tick slippage); limit order fills only if price **trades through** the limit, not just touches it |
| Costs | Commission per the user's broker (often around 0.15–0.25% for internet orders, plus 7% VAT on commission (รอยืนยัน — use the real broker rate)); charge both buy and sell |
| Settlement | T+2 — cash from a sale is not available for a cash-account purchase the same day (credit-balance and cash-balance accounts differ; ask the broker) |
| Ceiling/floor | ±30% daily; a stop below the floor cannot fill that day |
| Gaps | If the open is beyond the stop, fill at the open, not at the stop |
| Liquidity | Do not paper-trade a size above 5% of the stock's average daily value |

ตรวจล่าสุด 2026-10-26 · ล็อต 100 หุ้น (50 หุ้นเมื่อราคา ≥ 500 บาทติดกัน 6 เดือน) · ราคาสูงต่ำสุด ±30% · ชำระราคา T+2 · แหล่ง: https://www.set.or.th/en/market/information/trading-procedure/trading-units , https://www.set.or.th/en/trading-units-tick-sizes-price-limits , https://www.set.or.th/annualreport/en/2017/41 (T+2) , https://www.clearstream.com (ข่าวลูกค้า 1280838 เรื่องล็อต) , https://www.mondovisione.com (SET คืนเพดาน ±30% 25 มิ.ย. 2568) · ค่าคอมมิชชันยังไม่ได้ตรวจ ใช้อัตราจากใบยืนยันของโบรกเกอร์ผู้ใช้

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

Capital 100,000 · rule `pullback-50ma` only · risk 1%. Trade #12: XYZ limit buy 31.50, stop 30.00 (both prices are valid ticks before and after 16 Nov 2569).
- Size: risk/share 1.50 + costs ≈ 0.13 = 1.63 → 1,000 ÷ 1.63 = 613 → **600 shares** (18,900 baht = 18.9% of capital)
- Cap: 10% concentration limit (from `position-sizing`) → 300 shares, 9,450 baht
- Fill: low of the day was 31.50 exactly — touched, not traded through → **no fill**, logged `no-fill`
- Next day: it opened at 31.00, but the limit was a day order and had expired, so there is still no trade
- Lesson: counting this as a fill at 31.50 is exactly the "almost trade" that makes paper results look better than live ones

## Reporting

Monthly: trades, win rate, avg R, expectancy, max drawdown, violations, passed/no-fill count, one lesson — using `post-trade-review`. Command: `/paper-trade`.
