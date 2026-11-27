---
name: stack-mql
description: Use when writing MQL4 or MQL5 code for MetaTrader
---

# stack-mql — an Expert Advisor (EA) that sends orders correctly on every broker

> **One rule:** every order goes through the pre-send checker and every returned result is read · an EA that "works in the tester" but does not check is not done.

## Use when

- Writing or reviewing an EA, indicator or script for MetaTrader 4 (MT4) or MetaTrader 5 (MT5)
- Porting between MT4 and MT5
- Preparing an EA for the MQL5 Market or for self-sale

Not for: strategy, risk and backtest criteria → the project's trading spec (repo prompt set: `prompt/software-development/prompt-trading-system.md`; someone with only the plugin does not have it, so ask the owner for the spec) · backtest formulas → agent `quant-analyst` · only a `.ex5` and no source → `reverse-engineering` (`references/mql5-ex5.md`; extract behaviour in the Strategy Tester and rewrite, do not decompile)

## Steps

1. **Know the platform:** `.mq4` = MQL4 (MT4) · `.mq5` = MQL5 (MT5) · `.mqh` = an include, shareable if the differing parts sit behind `#ifdef __MQL5__`. In MQL4 put `#property strict` in every file. Differences that break a port, return codes, compile and command-line backtest → [`references/platform.md`](references/platform.md).
2. **Compile when a terminal exists.** On a machine without one, write "ยังไม่ได้ compile" in the report; never say it passed.
3. **Pass every order through the pre-send checker:**

| Check | Do this |
|---|---|
| volume | round down to `SYMBOL_VOLUME_STEP` · between `SYMBOL_VOLUME_MIN` and `SYMBOL_VOLUME_MAX` |
| price | `NormalizeDouble(price, _Digits)` |
| Stop Loss (SL) / Take Profit (TP) | at least `SYMBOL_TRADE_STOPS_LEVEL` × `_Point` away from the current price |
| modifying | not when the price is within `SYMBOL_TRADE_FREEZE_LEVEL` · do not resend the same values |
| margin | `OrderCalcMargin` (MT5) · `AccountFreeMarginCheck` (MT4) before sending |
| order count | less than `ACCOUNT_LIMIT_ORDERS` (0 = unlimited) |
| symbol | `SYMBOL_TRADE_MODE` is not disabled · market is open |
| MT5 whole set | `OrderCheck()` before `OrderSend()` |

4. **Read every returned result.** Requote / off quotes → retry at most 3 times, with a new price each time. Not enough money / invalid stops → do not retry; log and stop that trade.
5. **Convert pips at one place only:** a 5-digit price (3-digit for JPY pairs) → 1 pip = 10 points.
6. **Structure the EA:**
   - `OnInit` validates every input (wrong value → `INIT_PARAMETERS_INCORRECT`), creates handles; `OnDeinit` releases them. MT5 indicators: handle once in `OnInit`, then `CopyBuffer`.
   - Do heavy logic once per new bar (compare `iTime(_Symbol, _Period, 0)` with a remembered value), not on every tick.
   - A magic number per EA + symbol + strategy; manage only orders whose magic matches, never manual orders or another EA's.
   - Never keep important state only in a variable: `OnInit` rebuilds state from positions/orders with a matching magic; values that cannot be rebuilt (such as today's loss total) go in `GlobalVariableSet` or a file in `MQL5\Files` / `MQL4\Files`.
   - Use server time (`TimeCurrent`) for bars and sessions; it is not Thai time and shifts with daylight saving. In the tester `TimeGMT()` equals the simulated server time (https://www.mql5.com/en/docs/dateandtime/timegmt), so news and session filters based on GMT take the offset as an input.
   - Keep signal · lot size · order sending · managing open orders separate; the signal is a pure function from bar data to a result.
   - Log every decision to send or not send: server time · symbol · reason · price · spread · returned result. Do not log every tick.
7. **Test:**
   - Script test: feed fixed data to the signal and lot-size functions and compare (MQL has no standard test framework).
   - Backtest: MT5 "Every tick based on real ticks" for results used to decide; MT4 reports modelling quality every time; spread · commission · swap set to the real account, not 0.
   - Cover at least 3 symbols with different digits (EURUSD · USDJPY · XAUUSD), at least 2 timeframes, netting and hedging (MT5), and a capital so small the minimum lot cannot be sent.
   - Never judge from optimized results: use MT5's forward period or split in-sample / out-of-sample yourself; report the period not used for optimizing.
   - `OnTester()` returns the criterion the spec defines.
8. **Security:** passwords, API keys and license keys never go in code or `.set`. `WebRequest` works only with URLs the user added to the terminal's allow list; say in the manual which URLs to add.
9. **If selling:** MQL5 Market rules (no DLL, no account lock, the check must see real orders, no profit promise) and self-sale license lock → [`references/market-and-license.md`](references/market-and-license.md).

## Check before done

- Compiles with 0 errors 0 warnings (or the report says it was not compiled because there is no terminal)
- Every order passes the checker · every returned result is read and logged
- Magic number · state can be rebuilt after a restart · orders with a non-matching magic are untouched
- Every input has a default and a range checked in `OnInit`
- Backtest uses real spread · commission · swap · the reported result comes from a period not used for optimizing
- Cases cover at least 3 symbols · 2 timeframes (· netting and hedging for MT5)
- Selling on the Market: no DLL · no account or symbol lock · the description promises no profit

## References

- [`references/platform.md`](references/platform.md) — open when compiling, backtesting from the command line, porting MT4 ↔ MT5, reading result codes, or hunting a trap (double compare, index shift, ECN SL/TP)
- [`references/market-and-license.md`](references/market-and-license.md) — open when the EA will be sold

General principles: `code-craft` · `test-automation` · `errors-and-logs` · `web-service-essentials`
