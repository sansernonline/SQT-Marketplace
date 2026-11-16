---
name: bonds-and-deposits
description: Use when choosing Thai deposits, bonds or money funds
---

# Bonds and Deposits — a side-by-side comparison of deposits, savings bonds and corporate bonds for the user's amount

General information, not investment advice.

> **One rule:** a higher rate on "safe" money always means more risk or less access — name which one before comparing rates.

## Use when
- "Fixed deposit or savings bond?" · "is this 6% หุ้นกู้ safe?" · "where do I park 1.5 million?"

Not for: how many months of emergency money → `emergency-fund` first · stocks, equity funds, rebalancing, bond mutual funds → `mutual-fund-picker` · `rebalance-and-dca` · tax on interest in the yearly return → `tax-basics-th` · a "bond" or "deposit" with a guaranteed high return through a LINE group or personal account → `scam-check`

## Steps
1. Split the money: emergency part (`emergency-fund`) · money needed within 1–3 years · money that can be locked longer. Emergency part: savings and money market fund only.
2. 1–3 year money: fixed deposits across banks (each ≤ 1 million), savings bonds of matching tenor, short government bond fund. Longer money: longer savings bonds; corporate bonds only investment grade, spread, and only what the user can hold to maturity.
3. For every product state who stands behind it and whether the Deposit Protection Agency (DPA, สคฝ.) covers it. DPA covers up to **1,000,000 baht per depositor per bank**, all Thai-baht savings, current, fixed deposits, certificates of deposit and deposit receipts at that bank combined. It does **not** cover foreign-currency deposits, bills of exchange (ตั๋วแลกเงิน), bonds, corporate bonds, money market funds or any fund units. Above 1 million, spread across banks. Interest is 15% withheld except tax-free savings and tax-free fixed deposits when their rules are kept. Full table and rules: `references/products.md`.
4. Savings bonds: each round sets its own rates, tenors, minimums, caps, dates and channels (เป๋าตัง wallet or agent banks), so look up the open round live before quoting (WebSearch/WebFetch): BOT sale page https://www.bot.or.th/th/our-services/bond-and-debt-securities-services/Saving-Bond-Sale.html and the round's PDMO "รู้ก่อนซื้อ" sheet (format example: https://backend.pdmo.go.th/uploads/documents/2026/Jul/20260723165731_8729.pdf). If a page will not open, mark the value (รอยืนยัน). The wallet issue can be transferred only from a date the round sets and only inside the wallet.
5. Corporate bonds, read before buying: (1) credit rating: investment grade is AAA down to BBB- (TRIS Rating, Fitch Thailand); below BBB- or unrated is high-yield; Thai high-risk bonds are reported to carry "เสี่ยงสูง" in their name (รอยืนยัน); check rating and trend on ThaiBMA (thaibma.or.th) · (2) why the rate is high: the gap over a government bond of the same tenor is the price of default risk · (3) liquidity: plan to hold to maturity; early sale may be slow and below par · (4) concentration: no single issuer above about 10% of the user's safe money (rule of thumb, not regulation) · (5) not deposits: the selling bank is only the seller, DPA does not cover it. Who may buy unrated or high-yield bonds is restricted by SEC rules; the exact current rule was not confirmed (รอยืนยัน — check sec.or.th before telling a user they can or cannot buy).
6. For a bond fund or a bond the user may sell early: price change ≈ − duration (years) × change in market rate (points). Take duration from the fund's factsheet; if none is given, say so and do not estimate. Money needed within the duration should not sit in a long-duration fund. Show both rows (rates −1 point and +1 point) in baht for their amount. For several holdings, show a maturity ladder (quarter · what matures · amount in baht · share of safe money) and flag a quarter where a large share matures at once or where cash is needed but nothing matures. Details and example: `references/rate-risk.md`.
7. Show a table with after-tax interest in baht for the user's real amount: amount × rate × (1 − 0.15) × years for products with 15% withheld; run `node money-calc.mjs afterTax <file.json>` (script in `portfolio-snapshot`, see its Script path; example `../portfolio-snapshot/scripts/examples/afterTax.json`; the rate is ตัวอย่าง, not a current offer: 500,000 at 1.80% for 3 years → 22,950 after tax, 1.53% a year).
8. Score the options with `decision-scoring`, command `score` (script path: see `decision-scoring`, superuser plugin), only for money that passed steps 1–2. The emergency part is not scored. The user picks.

| Scoring | Value |
|---|---|
| Hard rules (`must`) | Lock period (months) not longer than the time the user will not touch the money · deposit per bank at most 1,000,000 · corporate bond rated BBB- or better, one issuer at most about 10% of the safe money |
| Criterion 1 | Interest after tax, % a year · `high` · weight 0.5 |
| Criterion 2 | Covered by DPA: 1 = yes, 0 = no · `high` · 0.3 |
| Criterion 3 | Lock period, months · `low` · 0.2 |

Weights are starting values the user can change (not yet measured). Every rate needs a source and a date; if unknown, write (รอยืนยัน) and leave that option out until confirmed. If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), the user chooses. A high score driven by a high rate means more risk or harder access, so name the criterion that pulls the score every time.

## Check before done
- Every product says whether DPA protects it
- No deposit above 1 million at one bank without saying so
- Every rate has a source page and date, or is marked (รอยืนยัน)
- Corporate bonds show rating, issuer and liquidity, not just the rate
- A bond fund or a bond that may be sold early shows the ±1 point rate effect from its duration; several holdings show the maturity ladder

## References
- [`references/products.md`](references/products.md) — open to compare products side by side or answer tax-on-interest questions (savings 20,000 baht exemption, tax-free fixed deposit rules)
- [`references/rate-risk.md`](references/rate-risk.md) — open for the duration example and maturity ladder detail
- [`references/worked-example.md`](references/worked-example.md) — open for a model split of 1,500,000 baht
- [`references/sources.md`](references/sources.md) — sources and check dates (2026-10-26)
