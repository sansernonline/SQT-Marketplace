---
name: position-sizing
description: Use when about to enter a trade and asking how many shares or lots, where the stop goes or if it is too big (shares, forex, crypto).
---

# Position Sizing (คำนวณขนาดไม้)

Size every trade from risk, not from conviction. General information, not investment advice.

## The formula — fixed-fractional

```
risk budget (บาท)   = capital × risk%            (default 1%, max 2%; higher only if the user writes it in CONTEXT.md)
risk per share      = |entry − stop|              (+ round-trip cost per share)
raw size (shares)   = risk budget ÷ risk per share
size                = round DOWN to the board lot (100 shares on SET)
position value      = size × entry
```

If there is no stop, stop and ask for one — no sizing without a stop. Get the stop from the invalidation price in `technical-signals`.

Forex, CFDs (gold, indices), crypto or a prop-firm account → lots, pip value, margin, swap and daily loss limits are in [references/forex-cfd-crypto.md](references/forex-cfd-crypto.md). The rest of this file is SET shares.

## SET trading rules that change the answer

| Rule | Value |
|---|---|
| Board lot (ล็อต) | **100 shares**; 50 shares for a stock priced ≥ 500 baht for 6 consecutive months. Fewer shares trade on the odd-lot board (worse liquidity) |
| Daily price limit (ceiling/floor) | ±30% of previous close |
| Settlement | T+2 |
| ETFs / unit trusts tick | 0.01 baht at every price |

Tick size (ช่วงราคา) for SET/mai shares — SET changes the 5–<50 baht bands on **16 Nov 2569 (2026)**:

| Price (baht) | Tick now (until 13 Nov 2569) | Tick from 16 Nov 2569 |
|---|---|---|
| < 2 | 0.01 | 0.01 |
| 2 – < 5 | 0.02 | 0.02 |
| 5 – < 10 | 0.05 | **0.02** |
| 10 – < 25 | 0.10 | **0.05** |
| 25 – < 50 | 0.25 | **0.10** |
| 50 – < 100 | 0.25 | 0.25 |
| 100 – < 200 | 0.50 | 0.50 |
| 200 – < 400 | 1.00 | 1.00 |
| ≥ 400 | 2.00 | 2.00 |

ตรวจ 22 ต.ค. 2569 (2026-10-22) · แหล่ง: SET, "8 มาตรการซื้อขาย" https://www.set.or.th/th/about/mediacenter/insights/article/795-eight-trading-measures (confirms the tick cut for 5–50 baht and the date 16 พ.ย. 2569; same date in Thansettakij, Infoquest, Mondo Visione) · SET hearing result No21 (Jun 2026) https://media.set.or.th/set/Documents/2026/Jun/No21-HearingResult-Proposed-Revision-Measures-Enhance-Confidence.pdf (new values 5–<10 0.02, 10–<25 0.05, 25–<50 0.10; 82% agreed) · old table https://www.set.or.th/en/trading-units-tick-sizes-price-limits. The new values come from the hearing result; the final SET circular was not read (รอยืนยัน) — check it before quoting.

Examples in this plugin use prices valid under **both** tables (multiples of 0.50 between 25 and 50 baht), so they stay correct before and after 16 Nov 2569.

Why ticks matter: stop and entry must sit on a valid tick, and on a 9.90-baht stock one tick (0.05 now, 0.02 from 16 Nov 2569) is 0.5% now — a "1-tick" stop is not a real stop.

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

Capital 100,000 baht, risk 1% = **1,000 baht**. Entry 48.50, invalidation 48.00 → stop 0.50 below at **47.50** (valid under both tick tables: 0.25 now, 0.10 from 16 Nov 2569). Risk per share = 1.00. Round-trip cost ≈ 0.2% × 2 × 48.50 ≈ 0.19 → use **1.19**.

- Raw size = 1,000 ÷ 1.19 = 840 → round down to board lot = **800 shares**
- Position value = 800 × 48.50 = **38,800 baht = 38.8% of capital** → fails the 10% concentration check
- Cap at 10% → 10,000 ÷ 48.50 = 206 → **200 shares** (9,700 baht); real risk = 200 × 1.19 = **238 baht (0.24%)**

Size if the user takes the trade: 200 shares, stop 47.50; the concentration limit, not the stop, is the binding rule here. A wider stop at 45.50 (below the 46.00 swing low) would give risk 3.19/share → 313 → 300 shares, but still capped at 200 by concentration.

## Output

Risk budget · risk per share (with cost) · size in shares and baht · % of capital · which rule bound the size (risk, concentration, liquidity) · the one assumption that would change the answer. No sizing without a stop-loss.

Related: `risk-manager` agent applies these limits; log the planned size in `trade-journal`.
