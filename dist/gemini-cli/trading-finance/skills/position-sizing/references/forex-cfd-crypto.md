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
