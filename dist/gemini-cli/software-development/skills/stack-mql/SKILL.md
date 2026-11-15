---
name: stack-mql
description: Use when writing MQL4 or MQL5 code for MetaTrader
---

# stack · MQL — an Expert Advisor (EA) that sends orders correctly, on every broker, every time

> **One rule:** every order goes through the pre-send checker and every returned result is read · an EA that "works in the tester" but does not check is not done.

For EAs · indicators · scripts on MetaTrader 4 (MT4) and MetaTrader 5 (MT5) · strategy, risk and backtest criteria live in the project's trading spec (if using the repo's prompt set: `prompt/software-development/prompt-trading-system.md` — someone who installed only the plugin will not have this file; ask the owner for the spec) · general principles are in `lazy-coding` · `readable-code` · `testing-standards` · `logging-standards` · `error-handling-patterns`

## 1 · Start: know which platform you are writing for

- `.mq4` file = MQL4 (MT4) · `.mq5` = MQL5 (MT5) · `.mqh` = an include that can be shared if the differing parts are separated behind `#ifdef __MQL5__`
- In MQL4 put `#property strict` in every file (without it the compiler lets data-type bugs through)
- Compiling and testing need a terminal (Windows, or the Wine build MetaQuotes distributes for macOS / Linux) · on a machine without one → write in the report "ยังไม่ได้ compile" (not yet compiled); never say it passed

| Step | MT5 | MT4 |
|---|---|---|
| compile | `metaeditor64.exe /compile:"MQL5\Experts\X.mq5" /log` | `metaeditor.exe /compile:"MQL4\Experts\X.mq4" /log` |
| compile result | a `.log` file next to the source file · 0 errors 0 warnings | same |
| backtest from the command line | `terminal64.exe /config:"tester.ini"` (section `[Tester]`: `Expert` · `Symbol` · `Period` · `FromDate` · `ToDate` · `Model` · `Report` · `ShutdownTerminal=1`) | `terminal.exe` + an MT4-style config file (fewer options) |

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/start_advanced/start · re-check this page before use

## 2 · Differences that break a port between MT4 and MT5

| Topic | MT4 | MT5 |
|---|---|---|
| order model | an order = a position (`OrderSend` · `OrderSelect` · `OrdersTotal`) | order · position · deal are separate · use `CTrade` (`Trade\Trade.mqh`) |
| account | always hedging | netting or hedging → read `ACCOUNT_MARGIN_MODE` · netting allows 1 position per symbol |
| order filling | no choice | FOK / IOC read from the flags in `SYMBOL_FILLING_MODE` (Market / Exchange Execution) · RETURN works in every mode except Market Execution · pending orders use RETURN |
| indicator | returns the value at once (`iMA(...)`) | create the handle once in `OnInit`, then `CopyBuffer` · release it in `OnDeinit` |
| order send result | `GetLastError()` (130 invalid stops · 134 not enough money · 138 requote · 146 trade context busy) | `MqlTradeResult.retcode` (10009 done · 10008 placed (pending order) · 10010 done partial = success · 10004 requote · 10014 invalid volume · 10015 invalid price · 10016 invalid stops · 10018 market closed · 10019 not enough money · 10030 invalid filling) |
| order events | none; you must poll | `OnTradeTransaction` |

## 3 · The pre-send order checker (every order, every time)

| Check | Do this | What you hit if you skip it |
|---|---|---|
| volume | round down to `SYMBOL_VOLUME_STEP` · between `SYMBOL_VOLUME_MIN` and `SYMBOL_VOLUME_MAX` | 10014 · error 131 |
| price | `NormalizeDouble(price, _Digits)` | 10015 |
| Stop Loss (SL) / Take Profit (TP) | at least `SYMBOL_TRADE_STOPS_LEVEL` × `_Point` away from the current price | 10016 · error 130 |
| modifying an order | do not modify when the price is within `SYMBOL_TRADE_FREEZE_LEVEL` · do not resend the same values | rejected · 10025 no changes |
| margin | `OrderCalcMargin` (MT5) · `AccountFreeMarginCheck` (MT4) before sending | 10019 · error 134 |
| order count | less than `ACCOUNT_LIMIT_ORDERS` (0 = unlimited) | rejected |
| symbol | `SYMBOL_TRADE_MODE` is not disabled · market is open | 10018 |
| MT5 whole set | `OrderCheck()` before `OrderSend()` | an error that cannot tell which item is wrong |

- Read every returned result · requote / off quotes → retry at most 3 times, with a new price each time · not enough money / invalid stops → do not retry; log and stop that trade.
- pip and point are not equal: a 5-digit price (or 3-digit for JPY pairs) → 1 pip = 10 points · if the user enters input in pips, convert at a single place.
- **Traps where the code looks right but really breaks** (adapted from ThomasPraun/mql-developer · MIT): `double` cannot be compared with `==`; `NormalizeDouble` both sides or compare against a tolerance · in MT4, closing several orders must loop from `OrdersTotal()-1` down to 0 because the index shifts after a close · some ECN brokers do not accept SL/TP in `OrderSend`, so send first and then `OrderModify` · `WebRequest` blocks until it gets a reply and cannot be used in indicators and the tester · one MT4 terminal can trade with only one EA at a time (error 146); wait and retry, do not resend at once · a series array has index 0 = the latest bar; always mark with `ArraySetAsSeries`, never guess the direction.

Sample code for each checker item → https://www.mql5.com/en/articles/23204 (read it and write your own; do not copy the whole file)

## 4 · An EA structure that is easy to read and recoverable

- `OnInit` validates every input (wrong value → `INIT_PARAMETERS_INCORRECT`) · create handles · `OnDeinit` releases the handles.
- Do heavy logic once per new bar (compare `iTime(_Symbol, _Period, 0)` with a remembered value), not on every tick.
- A magic number per EA + symbol + strategy · count and manage only orders whose magic matches; never touch manual orders or another EA's.
- **Never keep important state only in a variable:** a terminal restart → state is lost · `OnInit` rebuilds state from the positions/orders with a matching magic · values that cannot be rebuilt (such as today's loss total) are stored with `GlobalVariableSet` or a file in `MQL5\Files` / `MQL4\Files`.
- Time: use server time (`TimeCurrent`) to decide bars and sessions · each broker's server time is not Thai time and shifts with daylight saving · in the tester `TimeGMT()` always equals the simulated server time (source: https://www.mql5.com/en/docs/dateandtime/timegmt) → news and session filters based on Greenwich Mean Time (GMT) must take the offset as an input.
- 1 function, 1 job: signal · lot size · sending the order · managing open orders are kept separate · the signal is a pure function that takes bar data and returns a result (testable in a script).
- Log every decision to send or not send an order: server time · symbol · reason · price · spread · returned result · do not log every tick.

## 5 · test

- **script test:** test the signal and lot-size functions with a script that feeds fixed data and compares the result (MQL has no standard test framework).
- **backtest:** MT5 uses the "Every tick based on real ticks" mode for results used to decide · MT4 reports modelling quality every time · spread · commission · swap are set to the real account, not 0.
- **Test under several conditions:** at least 3 symbols with different digits (such as EURUSD · USDJPY · XAUUSD) · at least 2 timeframes · netting and hedging accounts (MT5) · a capital so small the minimum lot cannot be sent.
- **Do not judge from optimized results:** use MT5's forward period or split in-sample / out-of-sample yourself · the reported numbers are the results of the period not used for optimizing.
- `OnTester()` returns the criterion the spec defines (such as profit factor with drawdown under the limit) so the optimizer picks by the real criterion, not maximum profit.

## 6 · Selling on the MQL5 Market

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/market/market_sell · the rules can change; re-check before submitting

- Submit a single compiled file (`.ex5` / `.ex4`) · indicators · sounds · images embedded as resources · **no Dynamic Link Library (DLL)**
- **Do not restrict by account number or account type** · the Market locks machines and the number of activations itself · our license system (item 7) is for self-sale channels only.
- The automatic check runs the EA in the tester on several symbols and timeframes · the EA must really send orders in every one of those conditions (sending none = fail) · having every item of the item 3 checker is what makes it pass.
- Do not promise profit in the description · the product name in Latin letters is at most 50 characters with no version number · state it if it works only with hedging or netting.

## 7 · Security and self-sale

- Trading account passwords · API keys · license keys never go in the code or `.set` · for values that must be kept, use an input the user types on their own machine.
- `WebRequest` works only with URLs the user added to the terminal's own allow list · say in the manual which URLs must be added.
- Self-sale (not through the Market): lock the license with the account number (`ACCOUNT_LOGIN`) + an expiry date, checked in `OnInit` · do not give the customer the `.mq4` / `.mq5` · `.ex4` / `.ex5` files can be partly decompiled, so do not put secret rules only inside the EA.

## 8 · Pre-submit checklist

- [ ] compiles with 0 errors 0 warnings (or the report says it was not compiled because there is no terminal)
- [ ] every order passes the item 3 checker · every returned result is read and logged
- [ ] magic number · state can be rebuilt after a restart · orders with a non-matching magic are untouched
- [ ] every input has a default and a range checked in `OnInit`
- [ ] backtest uses real spread · commission · swap · the reported result comes from a period not used for optimizing
- [ ] tested on at least 3 symbols · 2 timeframes (· netting and hedging for MT5)
- [ ] selling on the Market: no DLL · no account or symbol lock · the description promises no profit

## 9 · Link to other skills

Only a `.ex5` and no `.mq5` (the source is lost, or you want one that trades the same way) → `reverse-engineering`, file `references/mql5-ex5.md`: extract the behavior in the Strategy Tester and rewrite it under the rules of this file · do not decompile.

Backtest formulas and statistics → agent `quant-analyst` · general tests → `testing-standards` · logs → `logging-standards` · secrets → `config-and-secrets` · small checkable steps → `principle-small-verifiable-steps` · selling and pricing → the repo's `prompt/software-development/prompt-sell-product.md` (if using the prompt set)
