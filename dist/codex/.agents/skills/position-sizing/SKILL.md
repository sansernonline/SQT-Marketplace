---
name: position-sizing
description: Use before every entry when the user asks how much to buy, how many shares (กี่หุ้น, ซื้อกี่ล็อต), where the stop goes, or whether a position is too big. Sizes from capital, risk per trade and stop distance.
---

# Position Sizing (คำนวณขนาดไม้)

Size every trade from risk, not from conviction. General information, not investment advice.

## The formula — fixed-fractional

```
risk budget (บาท)   = capital × risk%            (default 1%, hard max 2%)
risk per share      = |entry − stop|              (+ round-trip cost per share)
raw size (shares)   = risk budget ÷ risk per share
size                = round DOWN to the board lot (100 shares on SET)
position value      = size × entry
```

If there is no stop, stop and ask for one — no sizing without a stop. Get the stop from the invalidation price in `technical-signals`.

## SET trading rules that change the answer

| Rule | Value |
|---|---|
| Board lot (ล็อต) | **100 shares**; 50 shares for a stock priced ≥ 500 baht for 6 consecutive months. Fewer shares trade on the odd-lot board (worse liquidity) |
| Daily price limit (ceiling/floor) | ±30% of previous close |
| Settlement | T+2 |
| ETFs / unit trusts tick | 0.01 baht at every price |

Tick size (ช่วงราคา) for SET/mai shares:

| Price (baht) | Tick |
|---|---|
| < 2 | 0.01 |
| 2 – < 5 | 0.02 |
| 5 – < 10 | 0.05 |
| 10 – < 25 | 0.10 |
| 25 – < 100 | 0.25 |
| 100 – < 200 | 0.50 |
| 200 – < 400 | 1.00 |
| ≥ 400 | 2.00 |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.set.or.th/en/trading-units-tick-sizes-price-limits (table in force since 30 Mar 2009). SET consulted in May 2569 on smaller ticks for 5–<10 (0.02), 10–<25 (0.05) and 25–<50 (0.10); 82% agreed, effective date not yet announced (รอยืนยัน) — re-check before quoting.

Why ticks matter: stop and entry must sit on a valid tick, and on a 9.95-baht stock one tick (0.05) is 0.5% — a "1-tick" stop is not a real stop.

## Workflow

1. Collect: capital in the trading account (not net worth), risk % (default 1%), entry, stop, and the user's broker commission (typical internet rate around 0.15–0.25% + 7% VAT on commission (รอยืนยัน — use the user's own broker statement)).
2. Snap entry and stop to valid ticks; put the stop just beyond the invalidation level, not on it.
3. Compute risk budget, risk per share (add round-trip cost per share), raw size, round down to 100.
4. **Sanity checks**
   - Concentration: position ≤ 10% of capital by default (≤ 20% for an ETF). If larger, reduce size — never widen the risk %.
   - Liquidity: position ≤ 5% of the stock's average daily value traded, so it can be exited in a day.
   - Gap risk: if the stock can gap past the stop (earnings, XD, news), assume the loss could be 1.5–2× planned.
   - Total open risk across all positions ≤ 5–6% of capital.
5. If rounding to 100 shares makes the risk exceed the budget, round down again; if size becomes 0, the stop is too wide for this account — skip the trade.

## Worked example

Capital 100,000 baht, risk 1% = **1,000 baht**. Entry 48.50, invalidation 48.00 → stop one tick below at **47.75** (tick 0.25 in the 25–<100 band). Risk per share = 0.75. Round-trip cost ≈ 0.2% × 2 × 48.50 ≈ 0.19 → use **0.94**.

- Raw size = 1,000 ÷ 0.94 = 1,063 → round down to board lot = **1,000 shares**
- Position value = 1,000 × 48.50 = **48,500 baht = 48.5% of capital** → fails the 10% concentration check
- Cap at 10% → 10,000 ÷ 48.50 = 206 → **200 shares** (9,700 baht); real risk = 200 × 0.94 = **188 baht (0.19%)**

Answer: buy 200 shares, stop 47.75; the concentration limit, not the stop, is the binding rule here. A wider stop at 45.50 (below the 45.75 swing low) would give risk 3.19/share → 313 → 300 shares, but still capped at 200 by concentration.

## Output

Risk budget · risk per share (with cost) · size in shares and baht · % of capital · which rule bound the size (risk, concentration, liquidity) · the one assumption that would change the answer. No sizing without a stop-loss.

Related: `risk-manager` agent applies these limits; log the planned size in `trade-journal`.
