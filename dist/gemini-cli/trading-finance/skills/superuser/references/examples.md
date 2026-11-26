# Examples for this plugin — model tiers · autonomy · team patterns

Moved from `SKILL.md` sections 5 · 6 · 9. The rules are in `SKILL.md`, and this file holds examples only.

## Model tiers — example jobs (section 5)

The rules, model names and mid-task switching are in `superuser:superuser` section 5 (the core). This file holds only example jobs for each tier.

Tiers run from top to bottom under the core's 3 rules, and the first match wins (large → small → medium). **Large** `opus` — almost every piece of this plugin touches money: find error patterns in the trade journal · plan tax with several kinds of income · check a suspected scam · calculate position size · **Small** `haiku` — mechanical work that has a pattern to follow: sort news into the given list of topics · search a file and report · **Medium** `sonnet` (everything else) — summarise news not yet used for a trading decision · arrange a watchlist table · draft notes

## Autonomy — reversible work and sources (section 6)

| Found | Do |
|---|---|
| Reversible work — draft a plan · calculate in a spreadsheet or script · record a paper portfolio · organise the trade journal files | Do it now |
| Public fact not known (tax rates and deduction ceilings · market rules · XD dates · a provider's licence) | Search it yourself, going through sources in this order: Revenue Department, Stock Exchange, SEC Office, Bank of Thailand → documents of listed companies and funds → financial news outlets. Usable under the 3-source rule in `SKILL.md` section 6 |

## Team patterns — how each is used in this work (section 9)

How to run each pattern, its cost and its traps are in `crew-patterns/agent-patterns`.

| Pattern | How it is used here |
|---|---|
| **Planning** | thesis → stop-loss point → position size → order |
| **ReAct** | fetch price → read the value → compare the time → calculate |
| **Reflection** | A new `reviewer` (read-only, not the `risk-manager` that did the piece) checks every order before it goes to the user |
| **Multi-Agent** | `market-analyst` → `risk-manager` → `trade-journal-coach` |
| **Mixture-of-Agents (MoA)** | Retirement or tax plan → 3 assumptions (cautious · middle · good), then show them side by side |
| **Reranker** | Dozens of news items → score the impact on the stocks held → keep 5 |
