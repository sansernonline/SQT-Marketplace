# skill: position-sizing

Use when about to enter a trade and asking how many shares or lots, where the stop goes or if it is too big (shares, forex, crypto).

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

ตรวจ 26 ต.ค. 2569 (2026-10-26) ว่าวันมีผลยังเป็น 16 พ.ย. 2569 และยังไม่ถึงวันมีผล จึงคงทั้งสองตาราง (ลบตารางเดิมหลัง 16 พ.ย. 2569) · แหล่ง: SET, "8 มาตรการซื้อขาย" https://www.set.or.th/th/about/mediacenter/insights/article/795-eight-trading-measures (confirms the tick cut for 5–50 baht and the date 16 พ.ย. 2569; same date in Thansettakij, Infoquest, Mondo Visione; InnovestX https://www.innovestx.co.th/cafeinvest/th/articles/special-thai-20261012-1 gives 25–<50 baht 0.25 → 0.10, matching the hearing result) · SET hearing result No21 (Jun 2026) https://media.set.or.th/set/Documents/2026/Jun/No21-HearingResult-Proposed-Revision-Measures-Enhance-Confidence.pdf (new values 5–<10 0.02, 10–<25 0.05, 25–<50 0.10; 82% agreed) · old table https://www.set.or.th/en/trading-units-tick-sizes-price-limits. The new values come from the hearing result; the final SET circular was not read (รอยืนยัน) — check it before quoting.

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

## Why the risk % stays small — drawdown and the way back

A loss and the gain that undoes it are not the same number: gain needed = drawdown ÷ (1 − drawdown).

| Drawdown | Gain needed to get back to even |
|---|---|
| 5% | 5.3% |
| 10% | 11.1% |
| 20% | 25% |
| 30% | 42.9% |
| 40% | 66.7% |
| 50% | 100% |
| 60% | 150% |
| 75% | 300% |
| 90% | 900% |

At 1% risk, 10 losses in a row cost about 9.6% (compounded) and need 10.6% back; at 5% risk the same streak costs 40% and needs 66.7%. Show this table when a user asks to raise the risk %. (Arithmetic, computed here; no external source.)

## Worked example

Capital 100,000 baht, risk 1% = **1,000 baht**. Entry 48.50, invalidation 48.00 → stop 0.50 below at **47.50** (valid under both tick tables: 0.25 now, 0.10 from 16 Nov 2569). Risk per share = 1.00. Round-trip cost ≈ 0.2% × 2 × 48.50 ≈ 0.19 → use **1.19**.

- Raw size = 1,000 ÷ 1.19 = 840 → round down to board lot = **800 shares**
- Position value = 800 × 48.50 = **38,800 baht = 38.8% of capital** → fails the 10% concentration check
- Cap at 10% → 10,000 ÷ 48.50 = 206 → **200 shares** (9,700 baht); real risk = 200 × 1.19 = **238 baht (0.24%)**

Size if the user takes the trade: 200 shares, stop 47.50; the concentration limit, not the stop, is the binding rule here. A wider stop at 45.50 (below the 46.00 swing low) would give risk 3.19/share → 313 → 300 shares, but still capped at 200 by concentration.

## Output

Risk budget · risk per share (with cost) · size in shares and baht · % of capital · which rule bound the size (risk, concentration, liquidity) · the one assumption that would change the answer. No sizing without a stop-loss.

Related: `risk-manager` agent applies these limits; log the planned size in `trade-journal`.


## reference: forex-cfd-crypto.md

# Sizing forex, Contracts for Difference (CFDs — gold, indices) and crypto

Same rule as shares: size from risk, never without a stop. What changes is the unit (lots or coins), leverage, and costs that run while the trade is open. General information, not investment advice.

Contents: 1 Read the symbol spec · 2 Forex and CFD formula · 3 Margin is not risk · 4 Costs while holding · 5 Crypto spot and perpetuals · 6 Prop-firm limits · 7 Worked example

## 1 · Read the symbol spec first

Every number below differs by broker and account. Read it from the platform (MetaTrader: right-click symbol → Specification; MQL `SYMBOL_TRADE_CONTRACT_SIZE`, `SYMBOL_VOLUME_MIN/STEP`) or the exchange's contract page, and note the date. If unknown → `(รอยืนยัน)`, never assume.

| Item | Common value — confirm per broker |
|---|---|
| Contract size, FX | 1 standard lot = 100,000 units of the base currency (mini 10,000 · micro 1,000) |
| Contract size, gold (XAUUSD) | often 100 oz per lot, but 1, 10 or 100 all exist |
| Pip | 0.0001 for most pairs · 0.01 for JPY pairs · a 5- or 3-digit quote has 10 points per pip |
| Volume step / minimum | often 0.01 lot |
| Account currency | USD, THB or other — pip value must end in this currency |

## 2 · Forex and CFD formula

```
risk money          = capital × risk%                      (same 1% default, 2% max as shares)
pip value per lot   = pip size × contract size              (in the quote currency)
                      → account currency = quote currency: use as is
                      → account currency = base currency: ÷ the pair price
                      → otherwise: × the quote→account rate
risk per lot        = stop distance (pips) × pip value per lot  + round-trip spread and commission per lot
lots                = risk money ÷ risk per lot             → round DOWN to the volume step
```

- If lots round to below the minimum, the stop is too wide for this account — skip the trade.
- EURUSD, 1 standard lot: 0.0001 × 100,000 = **10 USD per pip**. USDJPY, 1 lot: 0.01 × 100,000 = 1,000 JPY per pip ≈ 1,000 ÷ USDJPY rate in USD (at 150 → 6.67 USD).
- Use the stop from `technical-signals`; put it beyond the level plus the typical spread, not on it.

## 3 · Margin is not risk

```
margin = lots × contract size × price ÷ leverage            (then convert to account currency)
```

- High leverage lowers margin, not risk. A 1:500 account can still lose the whole balance; risk is set by lots × stop distance.
- Keep free margin well above the broker's stop-out level after all open positions, so a drawdown does not close trades at the worst price.
- Total open risk across all positions ≤ 5–6% of capital, as for shares. Correlated pairs (EURUSD and GBPUSD long) count as one bigger position.

## 4 · Costs while holding

| Cost | What to check |
|---|---|
| Spread | widens at the daily rollover and around news; use the real spread at the planned entry time |
| Commission | per lot, per side, on Electronic Communication Network (ECN) / raw-spread accounts |
| Swap (overnight) | charged or paid per lot per night; many brokers charge 3 nights on one weekday — read the spec |
| Weekend gap | FX and CFDs close for the weekend; a Monday gap can skip the stop → assume 1.5–2× planned loss on trades held over the weekend or news |

## 5 · Crypto spot and perpetuals

- **Spot:** size (coins) = risk money ÷ (entry − stop + fees per coin) → round down to the exchange's step size; check the minimum order value. Fees differ for maker and taker orders.
- **Perpetual futures:** leverage works as in section 3. The liquidation price must sit beyond the stop with room to spare; if it does not, cut leverage, not the stop. Funding is paid or received at fixed intervals set by the exchange — it is a holding cost like swap.
- Crypto trades every day; gaps come from thin weekend liquidity and exchange outages, not market closes.
- Before funding an exchange or broker account, check its licence and the user's local rules → `scam-check`.

## 6 · Prop-firm limits

Prop-firm challenges add hard limits that override the usual 1–2%.

- Read the firm's own rules and note the date: daily loss limit, maximum total loss, profit target, minimum trading days, news and weekend rules, whether Expert Advisors are allowed.
- Check **how the daily limit is measured** — from the day's starting balance or equity, at which server time it resets, whether floating losses count.
- Risk per trade ≤ daily loss limit ÷ the number of losing trades in a row you will allow in one day (for example 3–4), counting the risk of trades already open.
- Stop trading for the day at a buffer before the limit (for example at 80% of it), not at the limit.

## 7 · Worked example

Account 10,000 USD, risk 1% = **100 USD**. EURUSD long, entry 1.08500, stop 1.08200 = **30 pips**. Pip value 10 USD per lot; spread + commission ≈ 1 pip = 10 USD per lot.

- Risk per lot = 30 × 10 + 10 = 310 USD → lots = 100 ÷ 310 = 0.322 → round down to step 0.01 → **0.32 lots**
- Real risk = 0.32 × 310 = **99.2 USD (0.99%)**
- Margin at 1:100 = 0.32 × 100,000 × 1.085 ÷ 100 = **347 USD** — about 3.5% of the account; risk is still 1%
- Held over a weekend → plan for a possible 150–200 USD loss on a gap
