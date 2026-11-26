---
name: home-refinance
description: Use when a Thai home loan rate ends or weighing refinance
---

# Home Refinance (รีไฟแนนซ์บ้าน · ขอลดดอกเบี้ยธนาคารเดิม) — compare refinance, retention, and staying put in baht

General information, not financial advice; every fee and rate is confirmed with the bank in writing before the user signs.

> **One rule:** compare both paths in baht over the same months, with every fee counted — never compare headline rates alone.

## Use when
- Promo or fixed rate ending · "the rate jumped" · another bank's offer · "refinance or retention?"
- Not for: card, cash card, or personal loan debt, or several debts and which to pay first → `debt-payoff` · credit report problems blocking a new loan → `credit-bureau` · choosing a house or a first mortgage → not covered, ask the bank's loan officer

## Steps
1. **Collect from the contract and latest statement:** balance, current rate, monthly payment, months since signing, penalty clause.
2. **Get written offers:** the current bank's retention rate and fee; 1–2 other banks' rates for each year and the rate after the promo (usually MRR − x). MRR (Minimum Retail Rate) is each bank's own floating rate for prime retail customers, and most home loans after the promo are "MRR − x%". Banks usually move MRR after a Bank of Thailand (BOT) policy-rate decision, but not by the same amount or on the same day.
3. **Look up live (WebSearch/WebFetch) before quoting,** and mark the value (รอยืนยัน) if the page will not open: BOT policy rate https://www.bot.or.th/th/our-roles/monetary-policy/mpc-meeting.html · the user's bank's MRR from its lending-rate table, e.g. https://www.bangkokbank.com , https://www.kasikornbank.com , https://www.ttbbank.com/th/rates/loan-interest-rates · whether a government mortgage-registration fee cut is in force (rate, price cap, end date, whether it covers refinance): sources are news only, so confirm with the Land Office. A cut has applied only when purchase and mortgage are registered together; reports say a refinance pays the normal 1% (รอยืนยัน).
4. **Use these path facts** (checked 2026-10-26, sources and conflicts: [`references/sources.md`](references/sources.md)):

   | | Refinance (ย้ายธนาคาร) | Retention (ขอลดกับธนาคารเดิม) |
   |---|---|---|
   | When | Usually after 3 years; earlier costs a prepayment penalty, often **about 3%** of remaining principal (some banks 1–3%, some lock 5 years: read the contract) | After 3 years or when the promo ends; start asking 1–2 months before |
   | Fees | Mortgage registration **1%** of the new mortgage · stamp duty **0.05%, max 10,000 baht** · appraisal (GSB 2,000–3,700 baht) · fire insurance if a new policy is required · new bank may waive some | Retention fee: no official figure; sources quote 0–2% of the balance (รอยืนยัน with your bank) |
   | Paperwork | New credit check, income documents, Land Office visit | A form at the current bank |
   | Lock after | New 3-year prepayment penalty | Often a new lock period: ask |

5. **Simulate the same months N (normally 36) with the same monthly payment** for each path: interest paid and balance left. Run `refinance.mjs compare` (below).
6. **Add each path's one-off costs.** Break-even (months) = total cost of moving (minus the baseline's own cost) ÷ interest saved per month, where interest saved per month = (interest over N months on the old path − on the new path) ÷ N. If saving ≤ 0, not worth it. Compare totals too: interest over N months + one-off costs, per path.
7. **Look past the promo:** compare the rate from year 4 (MRR − x) at each bank.
8. **Lay out the table; the user decides,** and no bank is named "the best". If cash is short, ask whether the new bank adds fees to the loan (it raises the balance).

**Formulas:** monthly payment PMT = P × r ÷ (1 − (1 + r)^−n), with P = loan, r = yearly rate ÷ 12, n = number of payments (if r = 0 → P ÷ n) · each month interest = balance × r, new balance = old balance + interest − payment.

**Script** (Node only, no dependencies):
```
node refinance.mjs pmt <loan> <yearly rate %> <payments>
node refinance.mjs compare <file.json> [--json]     # example file: scripts/example.json
node refinance.mjs scenarios <file.json>            # example: scripts/scenarios-example.json -> JSON for decide.mjs payoff
node refinance.mjs --self-test
```
Path: installed from the marketplace `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/home-refinance/scripts/refinance.mjs | sort -V | tail -1` · in the repo `plugins/trading-finance/skills/home-refinance/scripts/refinance.mjs`.

Input fields `balance`, `payment`, `months`, `stay.rate` and each option's `rate` and `cost` must be finite numbers, with `months` above 0; a bad field stops the script with a message naming it. A rate below 1 gets a warning (it may have been typed as a decimal instead of %). A stepped rate (promo then MRR − x) goes in `rates` instead of `rate`: `[{ "months": 36, "rate": 3.2 }, { "rate": 5.5, "floating": true }]`; the last step runs to month N. `baseline` (optional) names the option to compare against; the default is staying put.

**If the rate after the promo is uncertain,** use `decision-desk/decision-scoring`, command `payoff` (script path: see `decision-desk/decision-scoring`). Options = refinance · retention · stay put; scenarios = MRR up · flat · down. `refinance.mjs scenarios <file.json>` writes the whole table with `better` = `low`: each scenario adds its `shift` to the steps marked `floating` (run 2026-10-28 on `scripts/scenarios-example.json`: refinance regret 0 · retention 59,409 · stay 380,279). If scenario probabilities are unknown, read the "smallest maximum regret" (minimax regret) column; do not guess probabilities. If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), or for any home-loan decision, the output is information and the user decides.

## Check before done
- Both paths over the same months and the same payment
- Every fee listed, with (รอยืนยัน) where the bank has not confirmed it in writing
- Rate after the promo shown, not only the first 3 years
- The user picks; no bank named as "the best"

## References
- [`references/worked-example.md`](references/worked-example.md) — open when you need a model of the comparison table
- [`references/sources.md`](references/sources.md) — sources, check dates, and conflicting figures for fees
