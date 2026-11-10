---
name: copy-trade-check
description: Use when picking, setting up or weekly-checking an MQL5 (MT4/MT5) copy-trade signal, or deciding when to stop following it (ตามสัญญาณ).
---

# Copy Trade Check (ตามสัญญาณ copy trade ทั้งวงจร)

The whole cycle: check a signal provider with numbers **before** following (sections 1–4) → set up the copy and count its costs (5) → follow with fake money first (6) → write the exit rules before any real money (7) → check every week against those rules (8). This skill evaluates; it never places orders or moves money. General information, not investment or legal advice. Wording follows `human-writing`.

> **Read first — the legal route in Thailand is narrow and parts are unclear.** Bank of Thailand (ธปท., BOT) [FAQ 21](https://www.bot.or.th/th/faqs/faqs-21.html), read 2026-11-10: BOT has no policy to license forex businesses, and running a forex service or receiving or sending money to settle forex trades, inside or outside Thailand, is an offence under the Exchange Control Act (พ.ร.บ.ควบคุมการแลกเปลี่ยนเงิน พ.ศ. 2485) — fine up to 20,000 baht, prison up to 3 years, or both (items 2 and 5). So **no forex broker is licensed in Thailand**, and a Thai agent, a Thai personal account or an e-wallet that takes the deposit is outside the law. Item 4 answers the individual's own case: a Thai person may trade on a foreign broker's website "ภายใต้ขอบเขตที่ ธปท. กำหนด", sending money **through a Thai commercial bank**, up to USD 5 million a year, in stocks, bonds, fund units, deposits, derivatives or investment-linked insurance. Whether leveraged forex or CFDs count as "derivatives" in that list is not written (รอยืนยัน). The SEC (ก.ล.ต.) does not supervise forex, because forex is not a securities, derivatives or digital-asset business under its laws (SEC statement of 19 Sep 2022 as reported by [PPTV](https://www.pptvhd36.com/wealth/stock-investment/180854); the SEC's own file returned 403, so รอยืนยัน). Check the broker's name on the SEC [Investor Alert list](https://market.sec.or.th/public/idisc/th/InvestorAlert) (opened 2026-11-10; not being listed proves nothing) and run `scam-check`. **Before any real money leaves Thailand, the user asks BOT on 1213** (ศคง., office hours). This skill never says a transfer is allowed; the user decides. Say this in the first lines of every answer that ends in subscribing with real money.

## Use when / not

Use when the user wants to pick one of several MQL5 Signals providers, asks if a signal is safe to follow, pastes a signal's statistics page, has a provider's trade history to check, asks how to set up copying (deposit load, equity stop, VPS, fees), or brings this week's numbers and asks whether to keep following.

Not when: building or testing their own Expert Advisor (EA) → `stack-mql` (software-development) · an automated bot that sends real orders (out of scope) · sizing one manual trade → `position-sizing`.

## Use another skill instead, or with this one

| Situation | Use | Why |
|---|---|---|
| Guaranteed profit, a LINE group or "teacher", "รับฝากเทรด", "AI เทรดให้", money to a personal account | `scam-check` — stop here | BOT FAQ item 6 names these phrases; DSI warned of a copy-trade scheme in May 2023 |
| Several providers pass the hard rules | `decision-scoring` command `score` | Weighted criteria with a stability check; Growth alone is the worst ranking |
| How much money to put behind one provider | `position-sizing` (forex reference) | Size from the loss the user can take, never from Kelly |
| Following with fake money first | `paper-trading` | Same honesty rules as a live account |
| Tax on profits brought back to Thailand | `tax-basics-th` | Foreign income rules and filing |
| Logging what was followed and why | `trade-journal` | One line per subscription change |
| Learning to trade a technique yourself instead of copying | `trading-technique-course` | Staged levels with paper gates |

## Why not "highest Growth"

Following the providers with the highest past cumulative return lost heavily on social-trading platforms; ranking by Sharpe ratio did better, and after costs no selection rule earned a positive abnormal return (Dorfleitner et al. 2018, Quarterly Review of Economics and Finance 70 — **abstract only read**). AAII's summary of the same data: copying the top leader lost about 92% over 36 months on Ayondo and about 79% over 29 months on Wikifolio. Popularity did not predict later returns on eToro (Nasr et al. 2026, abstract only). Base rate: 74–89% of retail CFD accounts lose money (ESMA 2018). Say this when the user asks for the top-Growth signal.

## 1 · Get the numbers from the user — never fetch mql5.com

The MQL5 terms (item 3.7) forbid accessing the site "by automated means" outside channels MetaQuotes provides, and the Signals rules forbid software that harvests data from the service. So the agent does **not** fetch or scrape signal pages. Ask the user for one of these:

- **Statistics page, copied by hand:** Growth · Weeks · Real or Demo · Drawdown (balance and equity) · Max deposit load · Trades · Profit trades % · Sharpe · Recovery factor · Profit factor · Expected payoff · Subscribers · price. Weeks count from the account's first trade, not from when the signal was listed. Max deposit load = margin ÷ equity × 100 on the provider's account.
- **Trade history table** (needs login): columns `time · symbol · type · direction · volume · price · swap · profit`. No download button was found, so the user copies the table into a text file (tab-separated works) and runs the script below.

The statistics page alone cannot clear the martingale/grid rule. Hints only: equity drawdown far above balance drawdown, Profit trades above 90% together with a large drawdown, a very high Max deposit load. Ask for the history before scoring.

## 2 · Hard rules — drop before scoring

A provider that fails any rule is out, whatever its Growth. Never turn these into weights.

| Rule | Drop when | Basis |
|---|---|---|
| Account mode | Demo | MQL5 warns demo can take far more risk; paid signals must be real; a real signal can be followed only from a real account (MQL5 article 523) |
| Account age | Weeks under 26 (starting value, not yet measured) | Short records understate drawdown — expected max drawdown keeps growing with time (Magdon-Ismail et al. 2004, abstract) |
| Enough trades | Under 30 trades, or the script says the data is not enough (t under 2; under 3 when picking from many providers) (starting values, not yet measured) | Win-rate interval is wide at small n; Harvey, Liu and Zhu suggest t above 3 when many candidates are searched — applying it to providers is our analogy |
| Martingale or uncapped grid | Script flags R_lot ≥ 1.5 or ≥ 5 positions open at once on one symbol in one direction (starting values, not yet measured) | Closed-trade results look smooth while the loss sits in open positions; past drawdown is a floor, not a ceiling |
| Max deposit load | Above 30% (starting value, not yet measured) | High margin use leaves little room before a margin call |
| Promises or recruiting | Guaranteed profit, LINE group, pay to a person | → `scam-check` |

## 3 · Check the history with the script

```
node signal-check.mjs <history.csv|history.json> [--balance 10000] [--json]   # example: scripts/example.csv
node signal-check.mjs --self-test
```

It prints a table and a **ผล** line: trades · win rate with a 95% Wilson interval · mean profit per trade with t-stat · profit factor · payoff ratio · max drawdown from cumulative closed P/L (as % when `--balance` is given) · recovery factor · worst loss ÷ average loss · R_lot (mean lot after a loss ÷ after a win) · lot max ÷ median · most positions open at once per symbol · hold time of losers ÷ winners. Rows with `direction` in/out are matched first-in first-out per symbol; without `direction` each row is one closed trade and the grid and hold-time checks are skipped. Rows that are not buy/sell (balance, credit) are skipped and counted. A bad field stops the script with a Thai message naming the column and line. Every formula and its source is a one-line comment in the script.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/copy-trade-check/scripts/signal-check.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/copy-trade-check/scripts/signal-check.mjs` · Node only, no dependencies.

The script reads closed trades only; floating losses are invisible to it. Always set it beside the equity drawdown on the statistics page.

## 4 · Compare the survivors — `decision-scoring` `score`

Only providers that passed section 2. Suggested criteria and weights (starting values, not yet measured; the user's weights win): Sharpe high 0.3 · Equity drawdown % low 0.3 · recovery factor high 0.2 · weeks high 0.2. Put the hard rules in `must` so the script cuts them before scaling. The full file is `scripts/score-example.json` (run it with `decide.mjs score`):

```json
"must": [
  { "criterion": "Real (1 = real)", "equals": 1 },
  { "criterion": "Weeks", "min": 26 },
  { "criterion": "Trades", "min": 30 },
  { "criterion": "Max deposit load %", "max": 30 },
  { "criterion": "Martingale or grid flag (1 = yes)", "equals": 0 }
]
```

Do not add Growth as a criterion. If the user insists, give it the smallest weight and quote the research above.

## 5 · Set up the copy — settings and costs

Settings from the MetaTrader 5 help ([signal subscriber](https://www.metatrader5.com/en/terminal/help/signals/signal_subscriber), read 2026-11-10):

| Setting | What it does | Set it to |
|---|---|---|
| Use no more than X% of deposit | Lot = provider lot × (follower balance ÷ provider balance) × X%, adjusted for currency. Official example: follower 8,000 EUR at 50%, provider 10,000 USD, EURUSD 1.2 → provider 1 lot becomes 0.48 lot. Higher follower leverage does not raise lots; lower leverage shrinks them (provider 1:100, follower 1:10 → 1 lot becomes 0.1) | From the sizing rule below |
| Stop if equity is less than | Below this equity the copying stops and all positions close · 0 = no limit | Never 0 · starting equity × (1 − L) |
| Deviation / slippage | Set in spreads · a requote widens it by 0.5 spread · a second requote drops sync until re-sync | Keep low; prefer the provider's broker server |
| Copy Stop Loss and Take Profit | SL/TP sit at the follower's broker, so they work while the terminal is off | On |

**How much behind one provider.** Because lots scale by X%, the follower should earn about the provider's return × X%, and lose about the provider's drawdown × X%. The user names the most they can lose, L (% of the account). The provider's equity drawdown D (%) is a floor, so inflate it by k (1.5, starting value, not yet measured): **X ≤ L ÷ (D × k)**, rounded down. Never Kelly — a small error in the edge estimate oversizes the bet. Do not change X while positions are open.

**Why our result will differ from the provider's.** The MQL5 Signals rules (VI.1) say subscriber results can differ. Causes named in the help: a different broker (other prices, spread and execution, so stops can trigger earlier), slippage and requotes, volume limits or missing symbols at the follower's broker, and any manual or EA trade on the following account. Pending orders are not copied. One account follows one signal. Prefer the same broker and server as the provider; section 8 measures the gap.

**Costs, counted before subscribing:**

| Cost | Fact | Source, read 2026-11-10 |
|---|---|---|
| Subscription | Monthly fee in USD set by the provider, paid up front for the period · no refund when the subscriber cancels (V.7) · MQL5 keeps 20% (V.6) · unsubscribing passes the locked payment to the provider · auto-renew covers at most 3 months and is cancelled if the price rises · a current minimum price was not found on an official page (รอยืนยัน) | [Signals rules](https://www.mql5.com/en/signals/rules) · [signal subscriber help](https://www.metatrader5.com/en/terminal/help/signals/signal_subscriber) · [provider help](https://www.metatrader5.com/en/terminal/help/signals/signal_provider) |
| VPS | The terminal must stay online. MetaTrader VPS list price: 15 USD for 1 month · 39 for 3 · 65 for 6 · 120 for 12 (10 USD a month) · full refund within the first 24 hours | [VPS plans](https://www.mql5.com/en/vps/forex-plans) |
| Spread and commission | The follower's broker, not the provider's; read the symbol spec | `position-sizing` forex reference |

**Break-even.** Monthly fixed costs ÷ account equity = the return the copy must make just to stand still. A 20 USD signal plus a 15 USD VPS on a 1,500 USD account is 35 ÷ 1,500 = 2.3% a month (ตัวอย่าง). If that is more than the provider's typical month × X%, the account is too small for this signal; say so.

## 6 · Fake money first — `paper-trading`

A real signal can be followed only from a real account (MQL5 article 523, checked 2026-10-27), so it cannot be copied on demo. Instead, track the chosen provider's **new** trades in the `paper-trading` ledger for 8 weeks (starting value, not yet measured), scaled to the user's planned deposit load, then rerun `signal-check.mjs` on that period alone. Write the exit rules of section 7 before this period starts. Go live only if the new period has no hard-rule flag and its drawdown stayed inside what the user named — and only after the BOT question in the box above is answered.

## 7 · Exit rules — written before any real money

Write these in the `trade-journal` notes (or the monitor file below) **before** subscribing; a rule set after a loss is a rule bent by that loss. Any one reached means stop following: unsubscribe, then close or decide on the open positions, because unsubscribing does not close them.

| Rule | Stop when | Starting value (not yet measured) |
|---|---|---|
| Our drawdown | Account falls L% from its peak, net of fees · the MT5 equity stop is the hard backstop | L = the user's own number |
| Provider breaks its record | The provider's current drawdown passes D × k | k = 1.5 |
| Copy gap | Our return trails provider return × X% by more than G points, summed over the last N weeks · afterwards, compare broker, spread, slippage and lot rounding before following any other signal | G = 3 · N = 4 |
| Time stop | After M weeks the result net of fees is still 0 or below | M = 12 |
| Hard rule appears | Rerun `signal-check.mjs` on the new trades monthly: a martingale or grid flag, or Max deposit load above 30% | Section 2 |
| Provider changes | Account switched, signal stopped, price raised, or recruiting talk starts | → `scam-check` if recruiting |

## 8 · Weekly check — `copy-monitor.mjs`

Every week the user copies 4 numbers into the monitor file: the provider's return that week (%, from the growth chart or the history: profit ÷ starting balance), our starting and ending equity, and any fees paid. Deposits and withdrawals happen only between weeks. Optional: the provider's current drawdown.

```
node copy-monitor.mjs <monitor.json> [--json]      # example: scripts/monitor-example.json
node copy-monitor.mjs --self-test
```

Same folder as `signal-check.mjs` (script path in section 3) · Node only, no dependencies.

It prints a table (provider % · what we should get = provider % × X% · ours · the gap · net of fees · drawdown from peak) and a **ผล** line: "ยังไม่ชนกฎเลิกข้อใด" or "เลิกตาม" with each rule reached. The drawdown limit is required, so the script refuses a file without exit rules. It does not see open positions; set it beside the equity shown in the terminal. The hard-rule and provider-change rows of section 7 stay manual.

Report weekly in 3 lines: the table · the ผล line · one thing to watch next week. Log the week in `trade-journal` with `account = copy-<signal>`. The decision stays with the user; if a rule is reached and the user wants to keep going, say which rule was set before and that changing it now is the bending section 7 warns about.

## 9 · Tax

Revenue Department order ป.161/2566 (15 Sep 2023), amended by ป.162/2566 (20 Nov 2023): a Thai tax resident with foreign-source income must include it in the tax year it is **brought into Thailand**, for income brought in from 1 Jan 2024; income earned before 1 Jan 2024 is outside it. Tax withheld abroad under a double-tax treaty can be credited (RD news 34/2566). Not confirmed: which section of section 40 forex/CFD profit falls under and whether losses offset (รอยืนยัน — ask RD on 1161) · the 180-day residence test comes from search results only (รอยืนยัน). Details → `tax-basics-th`.

## Worked example and sources

A made-up 3-provider example (ask · did · result) and every source with its read date: [references/example-and-sources.md](references/example-and-sources.md).

## Check before sending

- [ ] The legal box is in the answer before any step that moves real money
- [ ] No mql5.com signal page was fetched by the agent
- [ ] Hard rules applied before any score; Growth was not the ranking
- [ ] Every threshold without a source says "starting value, not yet measured"
- [ ] `signal-check.mjs --self-test` passes (2026-10-27: 42/42; a fresh reviewer broke 18 formulas on purpose and the test caught 15) · `copy-monitor.mjs --self-test` passes (2026-11-11: 23/23, the 5-week example at X = 47% matches the hand calculation in the reference, and `monitor-example.json` matches the self-test set)
- [ ] Costs counted (fee + VPS ÷ equity) and the equity stop is not 0
- [ ] Exit rules written before real money; the weekly ผล line quotes them
- [ ] Paper tracking comes before real money; the user decides

