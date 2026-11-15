# Examples for this plugin — model tiers · autonomy · team patterns

Moved from `SKILL.md` sections 5 · 6 · 10. The rules are in `superuser:superuser` (the core). This file holds examples only.

## Model tiers — example jobs (section 5)

The rules, the model names and mid-task switching are in `superuser:superuser` section 5. This file holds only example jobs for each tier.

Tiers are checked from top to bottom by the core's 3 rules, and the first match wins (large → small → medium). **Large** `opus` — every piece that involves thinking or touches money, tax, contracts, consumer rights, or goes straight to a customer: analyse why a product loses money · plan promotion pricing strategy · analyse which right a case falls under · reply to a heavily conflicted customer · order the complaint ladder with its right-based time limits · review a draft letter before sending · plan the year-end close timeline · review a contract · handle a data breach · calculate payroll tax · **small** `haiku` — mechanical work with a pattern to follow: fill in product data from a template · search files and report · **medium** `sonnet` (everything else) — draft internal documents · format tables

## Autonomy — reversible work and sources (section 6)

| Situation | Action |
|---|---|
| Reversible work — draft a listing · draft a reply · draft a letter · build price tables, comparison tables and local stock files · register records · order a timeline · build local payroll tables and forms · set up in a test account | Just do it |
| A public fact is unknown (platform fees · return policy · shipping cost · time limit of a right · complaint channel · bank terms · tax threshold) | Search yourself. Go through sources in this order: Seller Centre and the platform's help pages → government and relevant law websites → courier and bank websites → news outlets · apply the 3-source rule in `superuser:superuser` section 6 |
| A back-office fact is unknown (tax rate · social security cap · filing date · holiday · LINE quota) | Go through sources in this order: Revenue Department, Social Security Office, Department of Business Development, Personal Data Protection Committee Office websites → Royal Gazette → LINE's official documents · apply the same 3-source rule |

## Team patterns — how to use them in this work (section 10)

How to run each pattern, its cost and its traps are in `agent-patterns`.

| Pattern | How it is used in this work |
|---|---|
| **Planning** | list a new product → price → listing → stock · timeline → complaint ladder → step by step · filing calendar → one form at a time |
| **ReAct** | work out the price → recalculate → fix · draft a letter → compare with the evidence → fix · calculate payroll → recalculate 1 person → fix |
| **Reflection** | a fresh `reviewer` (read-only, not the agent that did the piece) checks prohibited ad claims and numbers before listing · reads the letter as the officer who receives it would · checks totals in the tax form against the source table |
| **Multi-Agent** | `shop-manager` → `customer-chat` → `live-seller` hand off through the product file · evidence piece, letter piece and complaint-channel piece are built separately · `tax-helper` → `thai-doc-writer` → `compliance-helper` |
| **Mixture-of-Agents (MoA)** | product name and description → 3 versions → score → pick a base · buying a high-priced item → 3 angles: lifetime price · warranty · real reviews, then merge · draft a contract → 3 angles: employer · contractor · lawyer, then merge the risk points |
| **Reranker** | dozens of search terms → score by match to the product · popularity → put the top 5 in the product title · 20–30 product reviews → score credibility → read the top 3–5 in full · several tax-rate sources → score by officialness and recency → use the top 3 |
