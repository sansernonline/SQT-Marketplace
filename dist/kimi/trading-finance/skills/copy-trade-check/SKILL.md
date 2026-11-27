---
name: copy-trade-check
description: Use when picking or checking a copy-trade signal
---

# Copy Trade Check — evaluate a copy-trade signal from first look to weekly check

Cycle: check the provider with numbers before following (sections 1–4) → set up the copy and count costs (5) → follow with fake money first (6) → write exit rules before real money (7) → check weekly against them (8). This skill evaluates; it never places orders or moves money. General information, not investment or legal advice.

> **Legal box, say it in the first lines of every answer that ends in subscribing with real money.** In Thailand no forex broker is licensed (Bank of Thailand, ธปท., [FAQ 21](https://www.bot.or.th/th/faqs/faqs-21.html), read 2026-11-10): running a forex service or moving money to settle forex trades is an offence under the Exchange Control Act (fine up to 20,000 baht, prison up to 3 years, or both), so a Thai agent, personal account or e-wallet taking the deposit is outside the law. A Thai person may trade on a foreign broker's website within BOT limits, sending money **through a Thai commercial bank**; whether forex or CFDs count as "derivatives" there is not written (รอยืนยัน). The SEC (ก.ล.ต.) does not supervise forex. Check the broker on the SEC [Investor Alert list](https://market.sec.or.th/public/idisc/th/InvestorAlert) (not listed proves nothing) and run `scam-check`. **Before any real money leaves Thailand, the user asks BOT on 1213.** Never say a transfer is allowed; the user decides. Full text and sources: `references/legal-setup-tax.md`.

## Use when
- The user picks among MQL5 Signals providers, asks if a signal is safe, pastes a statistics page, or has a provider's trade history.
- The user asks how to set up copying (deposit load, equity stop, VPS, fees), or brings this week's numbers and asks whether to keep following.

Not for: learning to trade a technique yourself instead of copying → `trade-practice` · building or testing an own Expert Advisor (EA) → `stack-mql` · a bot that sends real orders (out of scope) · sizing one manual trade → `position-sizing`.

Look-alikes: guaranteed profit, LINE group or "teacher", "รับฝากเทรด", "AI เทรดให้", money to a personal account → `scam-check`, stop here · fake money → `trade-practice` · tax → `income-tax-th` · logging → `trade-journal`.

**Do not rank by highest Growth.** Past top return lost heavily on social-trading platforms (research in the reference); base rate 74–89% of retail CFD accounts lose (ESMA 2018). Say this when the user asks for the top-Growth signal.

## 1 · Get the numbers from the user — never fetch mql5.com

MQL5 terms forbid automated access and data harvesting, so the agent does **not** fetch or scrape signal pages. Ask the user for one of these:
- **Statistics page, copied by hand:** Growth · Weeks · Real or Demo · Drawdown (balance and equity) · Max deposit load · Trades · Profit trades % · Sharpe · Recovery factor · Profit factor · Expected payoff · Subscribers · price. Weeks count from the first trade. Max deposit load = margin ÷ equity × 100 on the provider's account.
- **Trade history table** (needs login): columns `time · symbol · type · direction · volume · price · swap · profit`. The user copies it into a text file (tab-separated works) for the script.

The statistics page alone cannot clear the martingale/grid rule (hints: equity drawdown far above balance drawdown, Profit trades above 90% with a large drawdown, very high Max deposit load). Ask for the history before scoring.

## 2 · Hard rules — drop before scoring

A provider failing any rule is out, whatever its Growth. Never turn these into weights.

| Rule | Drop when |
|---|---|
| Account mode | Demo (paid signals must be real; a real signal is followed only from a real account) |
| Account age | Weeks under 26 (starting value, not yet measured) |
| Enough trades | Under 30 trades, or the script says data is not enough (t under 2; under 3 when picking from many providers) (starting values, not yet measured) |
| Martingale or uncapped grid | Script flags R_lot ≥ 1.5 or ≥ 5 positions open at once on one symbol in one direction (starting values, not yet measured) |
| Max deposit load | Above 30% (starting value, not yet measured) |
| Promises or recruiting | Guaranteed profit, LINE group, pay to a person → `scam-check` |

## 3 · Check the history with the script

```
node signal-check.mjs <history.csv|history.json> [--balance 10000] [--json]   # example: scripts/example.csv
node signal-check.mjs --self-test
```

Prints a table and a **ผล** line (win rate with 95% Wilson interval, t-stat, profit factor, max drawdown from closed P/L, recovery factor, R_lot, most positions open at once per symbol, and more). Without a `direction` column each row is a closed trade and the grid and hold-time checks are skipped. A bad field stops the script with a Thai message naming the column and line.

**Script path:** installed: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/copy-trade-check/scripts/signal-check.mjs | sort -V | tail -1` · in the repo: `plugins/trading-finance/skills/copy-trade-check/scripts/signal-check.mjs` · Node only. It reads closed trades only (floating losses are invisible), so set it beside the equity drawdown on the statistics page.

## 4 · Compare the survivors — `decision-desk/decision-scoring` `score`

Only providers that passed section 2, several of them → `decision-desk/decision-scoring` command `score`. Weights (starting values, not yet measured; the user's win): Sharpe high 0.3 · Equity drawdown % low 0.3 · recovery factor high 0.2 · weeks high 0.2. Put the hard rules in `must` (full file `scripts/score-example.json`, run with `decide.mjs score`):

```json
"must": [
  { "criterion": "Real (1 = real)", "equals": 1 },
  { "criterion": "Weeks", "min": 26 },
  { "criterion": "Trades", "min": 30 },
  { "criterion": "Max deposit load %", "max": 30 },
  { "criterion": "Martingale or grid flag (1 = yes)", "equals": 0 }
]
```

Do not add Growth as a criterion. If the user insists, give it the smallest weight and quote the research.

## 5 · Set up the copy — settings and costs

Settings table, why results differ from the provider's, and the cost table (subscription, VPS, spread): `references/legal-setup-tax.md`. Essentials:
- **Stop if equity is less than** = starting equity × (1 − L); never 0. Copy SL and TP on. Keep deviation low; prefer the provider's broker and server.
- **How much behind one provider.** Lots scale by X% of deposit, so the follower loses about the provider's drawdown × X%. The user names the most they can lose, L (% of the account). With the provider's equity drawdown D (%) inflated by k (1.5, starting value, not yet measured): **X ≤ L ÷ (D × k)**, rounded down. Never Kelly. Do not change X while positions are open.
- **Costs before subscribing:** monthly subscription (no refund on cancel; MQL5 keeps 20%) + VPS (the terminal must stay online) + the follower broker's spread and commission. **Break-even** = monthly fixed costs ÷ account equity. If that exceeds the provider's typical month × X%, the account is too small for this signal; say so.

## 6 · Fake money first — `trade-practice`

A real signal cannot be copied on demo. Track the chosen provider's **new** trades in the `trade-practice` ledger for 8 weeks (starting value, not yet measured), scaled to the planned deposit load, then rerun `signal-check.mjs` on that period alone. Write the section 7 exit rules before this period starts. Go live only if the new period has no hard-rule flag, its drawdown stayed inside what the user named, and the BOT question in the legal box is answered.

## 7 · Exit rules — written before any real money

Write these in the `trade-journal` notes (or the monitor file) **before** subscribing; a rule set after a loss is bent by that loss. Any one reached means stop: unsubscribe, then close or decide on open positions (unsubscribing does not close them).

| Rule | Stop when | Starting value (not yet measured) |
|---|---|---|
| Our drawdown | Account falls L% from its peak, net of fees · the MT5 equity stop is the hard backstop | L = the user's own number |
| Provider breaks its record | Provider's current drawdown passes D × k | k = 1.5 |
| Copy gap | Our return trails provider return × X% by more than G points, summed over the last N weeks · then compare broker, spread, slippage and lot rounding before following any other signal | G = 3 · N = 4 |
| Time stop | After M weeks the result net of fees is still 0 or below | M = 12 |
| Hard rule appears | Rerun `signal-check.mjs` on new trades monthly: martingale or grid flag, or Max deposit load above 30% | Section 2 |
| Provider changes | Account switched, signal stopped, price raised, or recruiting talk starts | → `scam-check` if recruiting |

## 8 · Weekly check — `copy-monitor.mjs`

Each week the user copies 4 numbers into the monitor file: the provider's return that week (%, profit ÷ starting balance), our starting and ending equity, and fees paid. Optional: the provider's current drawdown. Deposits and withdrawals happen only between weeks.

```
node copy-monitor.mjs <monitor.json> [--json]      # example: scripts/monitor-example.json
node copy-monitor.mjs --self-test
```

Same folder as `signal-check.mjs` · Node only. It prints a table (provider % · expected = provider % × X% · ours · gap · net of fees · drawdown from peak) and a **ผล** line: "ยังไม่ชนกฎเลิกข้อใด" or "เลิกตาม" with each rule reached. It refuses a file without the drawdown limit and does not see open positions. The hard-rule and provider-change rows of section 7 stay manual.

Report weekly in 3 lines: the table · the ผล line · one thing to watch next week. Log the week in `trade-journal` with `account = copy-<signal>`. The decision stays with the user; if a rule is reached and the user wants to continue, say which rule was set before and that changing it now is the bending section 7 warns about.

## 9 · Tax

Foreign-source income of a Thai tax resident is taxed in the year it is **brought into Thailand** (from 1 Jan 2024); which section of section 40 forex/CFD profit falls under and whether losses offset is unconfirmed (รอยืนยัน — ask Revenue Department on 1161). Details and sources: `references/legal-setup-tax.md` and `income-tax-th`.

## Check before sending
- [ ] The legal box is in the answer before any step that moves real money
- [ ] No mql5.com signal page was fetched by the agent
- [ ] Hard rules applied before any score; Growth was not the ranking
- [ ] Every threshold without a source says "starting value, not yet measured"
- [ ] Both scripts' `--self-test` pass (2026-10-27: 42/42 · 2026-11-11: 23/23)
- [ ] Costs counted (fee + VPS ÷ equity) and the equity stop is not 0
- [ ] Exit rules written before real money; the weekly ผล line quotes them
- [ ] Paper tracking comes before real money; the user decides

## References
- [`references/legal-setup-tax.md`](references/legal-setup-tax.md) — open for the full legal box, the Growth research, the settings and cost tables, and tax.
- [`references/example-and-sources.md`](references/example-and-sources.md) — open for the worked examples (provider pick, weekly check) and every source with its read date.
