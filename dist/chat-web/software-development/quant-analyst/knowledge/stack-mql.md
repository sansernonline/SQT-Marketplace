# skill: stack-mql

Use when writing MQL4 or MQL5 code for MetaTrader

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

General principles: `lazy-coding` · `readable-code` · `testing-standards` · `logging-standards` · `error-handling-patterns` · `config-and-secrets`


## reference: market-and-license.md

# Selling on the MQL5 Market and self-sale · stack-mql

Open when the EA will be sold, or when it needs a license lock.

## MQL5 Market

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/market/market_sell · the rules can change; re-check before submitting

- Submit a single compiled file (`.ex5` / `.ex4`) · indicators · sounds · images embedded as resources · **no Dynamic Link Library (DLL)**
- **Do not restrict by account number or account type** · the Market locks machines and the number of activations itself · our license system below is for self-sale channels only.
- The automatic check runs the EA in the tester on several symbols and timeframes · the EA must really send orders in every one of those conditions (sending none = fail) · having every item of the pre-send checker is what makes it pass.
- Do not promise profit in the description · the product name in Latin letters is at most 50 characters with no version number · state it if it works only with hedging or netting.

## Self-sale (not through the Market)

- Lock the license with the account number (`ACCOUNT_LOGIN`) + an expiry date, checked in `OnInit`.
- Do not give the customer the `.mq4` / `.mq5` · `.ex4` / `.ex5` files can be partly decompiled, so do not put secret rules only inside the EA.


## reference: platform.md

# MT4 and MT5: compile, backtest and port differences · stack-mql

Open when compiling or backtesting from the command line, porting between MT4 and MT5, or reading a returned result code.

| Step | MT5 | MT4 |
|---|---|---|
| compile | `metaeditor64.exe /compile:"MQL5\Experts\X.mq5" /log` | `metaeditor.exe /compile:"MQL4\Experts\X.mq4" /log` |
| compile result | a `.log` file next to the source file · 0 errors 0 warnings | same |
| backtest from the command line | `terminal64.exe /config:"tester.ini"` (section `[Tester]`: `Expert` · `Symbol` · `Period` · `FromDate` · `ToDate` · `Model` · `Report` · `ShutdownTerminal=1`) | `terminal.exe` + an MT4-style config file (fewer options) |

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/start_advanced/start · re-check this page before use

Compiling and testing need a terminal (Windows, or the Wine build MetaQuotes distributes for macOS / Linux).

## Differences that break a port

| Topic | MT4 | MT5 |
|---|---|---|
| order model | an order = a position (`OrderSend` · `OrderSelect` · `OrdersTotal`) | order · position · deal are separate · use `CTrade` (`Trade\Trade.mqh`) |
| account | always hedging | netting or hedging → read `ACCOUNT_MARGIN_MODE` · netting allows 1 position per symbol |
| order filling | no choice | FOK / IOC read from the flags in `SYMBOL_FILLING_MODE` (Market / Exchange Execution) · RETURN works in every mode except Market Execution · pending orders use RETURN |
| indicator | returns the value at once (`iMA(...)`) | create the handle once in `OnInit`, then `CopyBuffer` · release it in `OnDeinit` |
| order send result | `GetLastError()` (130 invalid stops · 134 not enough money · 138 requote · 146 trade context busy) | `MqlTradeResult.retcode` (10009 done · 10008 placed (pending order) · 10010 done partial = success · 10004 requote · 10014 invalid volume · 10015 invalid price · 10016 invalid stops · 10018 market closed · 10019 not enough money · 10030 invalid filling) |
| order events | none; you must poll | `OnTradeTransaction` |

## Traps where the code looks right but really breaks

Adapted from ThomasPraun/mql-developer · MIT.

- `double` cannot be compared with `==`; `NormalizeDouble` both sides or compare against a tolerance.
- In MT4, closing several orders must loop from `OrdersTotal()-1` down to 0 because the index shifts after a close.
- Some ECN brokers do not accept SL/TP in `OrderSend`, so send first and then `OrderModify`.
- `WebRequest` blocks until it gets a reply and cannot be used in indicators and the tester.
- One MT4 terminal can trade with only one EA at a time (error 146); wait and retry, do not resend at once.
- A series array has index 0 = the latest bar; always mark with `ArraySetAsSeries`, never guess the direction.

Sample code for each checker item → https://www.mql5.com/en/articles/23204 (read it and write your own; do not copy the whole file)
