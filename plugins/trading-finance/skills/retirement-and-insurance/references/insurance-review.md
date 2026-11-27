<!-- merged from skill `insurance-review` on 2026-11-27 · description was: Use when checking if insurance cover is enough -->
# Insurance Review (ทบทวนประกันภัย) — have / need / gap per policy type, and the questions to ask the agent

General information, not insurance advice. A licensed agent or broker sells; check their licence at oic.or.th. This skill organises and asks the right questions; it does not pick a product.

## Use when
- The user asks whether their insurance is enough, has overlapping policies, compares quotes, or wants to check who is named as beneficiary.

Not for: wills and inheritance → `family-legal`.

## Steps
1. **List every policy**: insurer, type, sum insured, rider, yearly premium, renewal date, who is covered, group (employer) or personal. Employer group cover ends when the job ends; mark it.
2. **List what is at risk**: dependants, debts, monthly spending, savings, which hospital the user would actually use.
3. **Size each need** with the table below.
4. **Gap and overlap**: show have / need / gap per type; flag duplicate riders and savings-type policies with low cover per baht.
5. **Premium check**: total protection premium at most 10% of yearly income (starting value, not yet measured; the user may raise or lower it for dependants). This is the `must` filter when comparing quotes.
6. **Beneficiaries**: check who is named now against who the user wants, especially after marriage, divorce, a birth or a death. Table and flag order (high · medium · low) in the reference. Changing a beneficiary is the user's own step with the insurer or fund.
7. **Tax**: premiums deductible: life + health max 100,000, own health 25,000, parents' health 15,000 (`income-tax-th`). Never buy cover for the deduction alone.
8. **Prepare questions** for the agent (below).

## Sizing rules of thumb

| Type | What it pays | Rule of thumb |
|---|---|---|
| Life (term) | lump sum on death | debts + (yearly spending of dependants × years until they are independent) + education fund − liquid assets. Shortcut 5–10 × annual income. With no dependants and no debt, little or none is needed |
| Health — in-patient department (IPD) | hospital bills | room rate per day = the room at the hospital you would use; yearly or per-illness cap able to cover a major surgery there (private hospital major case often 1–3 million (รอยืนยัน)) |
| Health — out-patient department (OPD) | outpatient visits | usually poor value; pay from budget |
| Critical illness (โรคร้ายแรง) | lump sum on diagnosis | 1–3 years of spending to cover lost income during treatment |
| Personal accident (PA) | death / disability / treatment from accident | cheap top-up for riders, drivers, manual work; not a substitute for health |
| Disability income | monthly if unable to work | consider for self-employed with no sick-pay |

Social security ม.33 already covers medical care at the registered hospital; count it as the base layer.

## Comparing quotes

Use `decision-desk/decision-scoring`, command `score`, when 2 or more plans fill the same gap. Get every figure from the agent's benefit table in writing. Script path: see `decision-desk/decision-scoring` (superuser plugin).

| Step | Value |
|---|---|
| Hard rules (`must`) | Total premium of all policies after purchase at most 10% of yearly income · health cover must be the new standard form · no purchase for the tax deduction alone |
| Criterion 1 | Yearly premium, baht · `low` · proposed weight 0.30 |
| Criterion 2 | Gap this plan fills, baht · `high` · 0.30 |
| Criterion 3 | Room limit per night (IPD), baht · `high` · 0.12 |
| Criterion 4 | Limit per illness or per year (IPD), baht · `high` · 0.13 |
| Criterion 5 | Premium at age 60 per the insurer's table, baht · `low` · 0.15 |

Weights are starting values the user can change (starting value, not yet measured). Order the gaps to fix by gap size in baht, largest first. If the result reads `ยังไม่นิ่ง` or `สูสี`, the user decides.

## Rules that changed recently
- **New Health Standard** (มาตรฐานใหม่สัญญาประกันสุขภาพ; new policies from 8 Nov 2564, existing from 1 Jul 2565): renewal guaranteed except for fraud, claims for unnecessary treatment, or non-disclosure; premium rises only by age band or portfolio-wide cost trend.
- **Co-payment** (ส่วนร่วมจ่าย) for health policies with cover starting **from 20 March 2568**: next year 30% after 3+ claims for simple illness (โรคทั่วไปไม่รุนแรง) totalling ≥ 200% of premium, or 30% after 3+ claims for general illness (excluding major surgery and serious illness) totalling ≥ 400% of premium; 50% when both apply. Triggers, lifting rule and exclusions: reference.

## Questions to ask the agent
1. Is this policy under the New Health Standard? Does co-payment apply?
2. Room rate, per-illness cap, yearly cap, and what is excluded?
3. Premium at age 50, 60, 70 — show the table.
4. Guaranteed renewable to what age?
5. For life: how much of the premium is pure protection?

Before signing (free-look period, disclosure, waiting periods) and complaints (OIC hotline **1186**): reference.

## Output format
Table of policies → have / need / gap per type → overlap and overspend → questions for the agent → one-line priority (the gap with the largest baht amount first, for example "fix IPD cap first").

## References
- [`beneficiaries-and-rules.md`](beneficiaries-and-rules.md) — open for the beneficiary table, co-payment triggers, free-look and waiting periods, the complaints line, and savings or unit-linked policies (ask the cover-only cost, compare with term + fund).
- [`sources.md`](insurance-review/sources.md) — sources and check dates.
