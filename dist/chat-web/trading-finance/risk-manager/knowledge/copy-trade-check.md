# skill: copy-trade-check

Use when picking an MQL5 (MT4/MT5) copy-trade signal, or checking a signal provider's stats or trade history before subscribing (ตามสัญญาณ).

# Copy Trade Check (ประเมินผู้ให้สัญญาณก่อนตามเทรด)

Check a signal provider with numbers **before** following, then follow with fake money first. This skill evaluates; it never places orders or moves money. General information, not investment or legal advice. Wording follows `human-writing`.

> **Read first — the legal status in Thailand is unclear and may be illegal.** The Bank of Thailand (ธปท., BOT) FAQ says that providing forex trading services, including receiving or sending money to settle forex trades inside or outside Thailand, is an offence under the Exchange Control Act (พ.ร.บ.ควบคุมการแลกเปลี่ยนเงิน พ.ศ. 2485) ([FAQ 21](https://www.bot.or.th/th/faqs/faqs-21.html), item 2). Item 4 of the same FAQ and the BOT page on retail investment abroad let individuals invest through foreign brokers within limits, for 6 asset types (the list includes derivatives but does not mention forex or CFDs). No BOT text found says directly whether an individual sending their own money to a forex broker is legal or not ([retail portfolio investment abroad](https://www.bot.or.th/en/our-roles/financial-markets/foreign-exchange-regulations/foreign-exchange-laws/retail-portfolio-investment-abroad.html)). Both pages read 2026-10-27. **Before any real money leaves Thailand, the user asks BOT on 1213** (ศคง., office hours). This skill never says a transfer is allowed; the user decides. Say this in the first lines of every answer that ends in subscribing with real money.

## Use when / not

Use when the user wants to pick one of several MQL5 Signals providers, asks if a signal is safe to follow, pastes a signal's statistics page, or has a provider's trade history to check.

Not when: building or testing their own Expert Advisor (EA) → `stack-mql` (software-company) · an automated bot that sends real orders (out of scope) · sizing one manual trade → `position-sizing`.

## Use another skill instead, or with this one

| Situation | Use | Why |
|---|---|---|
| Guaranteed profit, a LINE group or "teacher", "รับฝากเทรด", "AI เทรดให้", money to a personal account | `scam-check` — stop here | BOT FAQ item 6 names these phrases; DSI warned of a copy-trade scheme in May 2023 |
| Several providers pass the hard rules | `decision-scoring` command `score` | Weighted criteria with a stability check; Growth alone is the worst ranking |
| How much money to put behind one provider | `position-sizing` (forex reference) | Size from the loss the user can take, never from Kelly |
| Following with fake money first | `paper-trading` | Same honesty rules as a live account |
| Tax on profits brought back to Thailand | `tax-basics-th` | Foreign income rules and filing |
| Logging what was followed and why | `trade-journal` | One line per subscription change |

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

## 5 · Follower settings (MetaTrader 5 help)

| Setting | What it does | Set it to |
|---|---|---|
| Use no more than X% of deposit | Lot = provider lot × (follower balance ÷ provider balance) × X%, adjusted for currency. Official example: follower 8,000 EUR at 50%, provider 10,000 USD, EURUSD 1.2 → provider 1 lot becomes 0.48 lot. Lower follower leverage shrinks lots further | From the sizing rule below |
| Stop if equity is less than | Below this equity the copying stops and all positions close · 0 = no limit | Never 0 · the equity the user can walk away at |
| Deviation / slippage | Set in spreads · a requote widens it by 0.5 spread · a second requote drops sync until re-sync | Keep low; prefer the provider's broker server |
| Copy Stop Loss and Take Profit | SL/TP sit at the follower's broker | On |

**How much behind one provider** — the user names the most they can lose, L (% of capital). The provider's equity drawdown D (%) is a floor, so inflate it by k (1.5, starting value, not yet measured): share of capital ≤ L ÷ (D × k). The account-level stop goes in `position-sizing`. Never Kelly — a small error in the edge estimate oversizes the bet.

Also from the help: keep the terminal online (a VPS is recommended) · one account follows one signal · do not trade by hand or run an EA on the following account · pending orders are not copied · unsubscribing does not close open positions · do not change the deposit load while positions are open · symbols the follower's broker lacks are not copied. Fees: monthly, paid up front, no refund on cancel except fraud or fake results; auto-renew is capped at 3 months.

## 6 · Fake money first — `paper-trading`

A real signal can be followed only from a real account (MQL5 article 523, checked 2026-10-27), so it cannot be copied on demo. Instead, track the chosen provider's **new** trades in the `paper-trading` ledger for 8 weeks (starting value, not yet measured), scaled to the user's planned deposit load, then rerun `signal-check.mjs` on that period alone. Go live only if the new period has no hard-rule flag and its drawdown stayed inside what the user named — and only after the BOT question in the box above is answered.

## 7 · Tax

Revenue Department order ป.161/2566 (15 Sep 2023), amended by ป.162/2566 (20 Nov 2023): a Thai tax resident with foreign-source income must include it in the tax year it is **brought into Thailand**, for income brought in from 1 Jan 2024; income earned before 1 Jan 2024 is outside it. Tax withheld abroad under a double-tax treaty can be credited (RD news 34/2566). Not confirmed: which section of section 40 forex/CFD profit falls under and whether losses offset (รอยืนยัน — ask RD on 1161) · the 180-day residence test comes from search results only (รอยืนยัน). Details → `tax-basics-th`.

## Worked example

**Ask (numbers made up — ตัวอย่าง):** "Pick the signal with the highest Growth from these 3, I'll follow with 50,000 baht." GoldRush Pro: Growth 1,240% · 14 weeks · real · drawdown 78% · max deposit load 92% · 410 trades · profit trades 97%. Steady EU: 85% · 104 weeks · real · 14% · 12% · 620 trades · Sharpe 0.21 · recovery factor 4.1. Swing FX: 210% · 40 weeks · **demo** · 33% · 25% · 95 trades. Plus Calm Yen for the scoring step: 60 weeks · real · 22% · 18% · 240 trades · Sharpe 0.28 · recovery 3.0.

**Did:** legal box first · GoldRush Pro out (14 weeks, load 92%, 97% wins with 78% drawdown points to martingale — history needed to confirm) · Swing FX out (demo) · `decide.mjs score` on the rest (run 2026-10-27): Steady EU 70, Calm Yen 30, stable under ±20% weight shifts · asked for Steady EU's history to run `signal-check.mjs` before going further · sizing: the user can lose 10% → 10 ÷ (14 × 1.5) ≈ 48% of capital, equity stop at 45,000 baht equivalent · 8 weeks of paper tracking first.

**Result:** "The highest Growth, GoldRush Pro, fails 2 hard rules (14 weeks · deposit load 92%) and looks like martingale; its history would confirm. Steady EU leads on the numbers, but send its trade history first, and ask BOT 1213 before moving any money. You decide."

## Check before sending

- [ ] The legal box is in the answer before any step that moves real money
- [ ] No mql5.com page was fetched by the agent
- [ ] Hard rules applied before any score; Growth was not the ranking
- [ ] Every threshold without a source says "starting value, not yet measured"
- [ ] `signal-check.mjs --self-test` passes (2026-10-27: 42/42; a fresh reviewer broke 18 formulas on purpose and the test caught 15)
- [ ] Paper tracking comes before real money; the user decides

## Sources

All read 2026-10-27 unless marked.

- BOT — [FAQ 21 forex](https://www.bot.or.th/th/faqs/faqs-21.html) (items 2, 3, 4, 6) · [retail portfolio investment abroad](https://www.bot.or.th/en/our-roles/financial-markets/foreign-exchange-regulations/foreign-exchange-laws/retail-portfolio-investment-abroad.html) · [news 74/2564](https://www.bot.or.th/th/news-and-media/news/news-20211015.html) · 1213 hours from `scam-check` (checked 2026-10-26) · penalty under the Exchange Control Act from search results only (รอยืนยัน)
- DSI — [copy-trade scheme warning, May 2023](https://dsi.go.th/en/Detail/2a62807b58c90766044ba12fe68b2b48)
- MetaTrader 5 help — [signal subscriber settings](https://www.metatrader5.com/en/terminal/help/signals/signal_subscriber) · [signal statistics](https://www.metatrader5.com/en/terminal/help/signals/signal_monitoring) · MQL5 [Signals rules](https://www.mql5.com/en/signals/rules) · [terms of use](https://www.mql5.com/en/about/terms) (3.7, 3.9) · [article 523](https://www.mql5.com/en/articles/523) (real signals on real accounts only) · [FAQ forum 10773](https://www.mql5.com/en/forum/10773) (Growth formula) · [MQL5 statistics docs](https://www.mql5.com/en/docs/constants/environment_state/statistics) (profit factor, recovery factor, drawdown)
- Research — [Dorfleitner et al. 2018](https://ideas.repec.org/a/eee/quaeco/v70y2018icp160-171.html) (abstract only) · [AAII summary](https://www.aaii.com/journal/article/returns-for-social-trading-platforms-are-negative) · [Nasr et al. 2026](https://ideas.repec.org/a/eee/finlet/v108y2026ics1544612326010093.html) (abstract only) · [ESMA 2018 CFD measures](https://www.esma.europa.eu/node/84933) · [Harvey, Liu, Zhu (NBER w20592)](https://www.nber.org/papers/w20592) · [Magdon-Ismail et al. 2004](https://www.cambridge.org/core/journals/journal-of-applied-probability/article/on-the-maximum-drawdown-of-a-brownian-motion/F9E3B8A454B020DDEBF0AC3390EF7807) (abstract only)
- Formulas — [Wilson interval](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval) · [Student's t-test](https://en.wikipedia.org/wiki/Student%27s_t-test) · [Sharpe 1994](https://web.stanford.edu/~wfsharpe/art/sr/sr.htm)
- Tax — [RD order ป.161/2566](https://www.rd.go.th/fileadmin/user_upload/kormor/newlaw/dn161A.pdf) · [RD news 34/2566](https://www.rd.go.th/fileadmin/user_upload/news/2566thai/news34_2566.pdf)
- Martingale, grid and payoff checks — [MQL5 blog 772831](https://www.mql5.com/en/blogs/post/772831) (checklist, no thresholds) · thresholds are ours
