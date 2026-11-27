# skill: retirement-and-insurance

Use when planning retirement savings or checking insurance cover

# retirement-and-insurance — retirement savings and insurance cover

> **One rule:** every retirement figure is an estimate that is recomputed each year, and cover is chosen for the risk it covers, never for the tax deduction.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| How much to save to retire in Thailand | [references/retirement-plan.md](references/retirement-plan.md) |
| Checking whether insurance cover is enough | [references/insurance-review.md](references/insurance-review.md) |

Other files in this folder: `beneficiaries-and-rules.md` (who receives the money and the rules that apply), `worked-example.md`. Scripts: `scripts/retire.mjs` (run with a JSON input file; see `scripts/example.json`).

## Steps every part shares

1. Collect the age, the planned retirement age, the monthly spending and the current savings from the user's own records.
2. Run `scripts/retire.mjs` for any retirement number instead of working it out by hand.
3. Mark every figure that depends on a rate, a ceiling or a fee with its source and the year checked.

## Check before done

- General information, not financial or insurance advice. A Certified Financial Planner (CFP) can make a full plan.
- Check an insurance agent's or broker's licence at oic.or.th before the user buys anything.
- This skill does not pick a product or a fund for the user; it lists the questions and the trade-offs.
- Never buy cover only for the tax deduction; cover is decided by the risks the user actually has.
- The Social Security wage ceiling and the pension rules are checked on the official page of the current year (รอยืนยัน with the Social Security Office, hotline 1506).

Whole job with several steps → playbook [money-plan](../superuser/references/playbook-money-plan.md).


## reference: beneficiaries-and-rules.md

# Beneficiaries, recent rules, before signing, complaints · insurance-review

## Beneficiaries — does the paper match the intent

Money with a named beneficiary is paid to that person, whatever the user meant later (whether it then counts as part of the estate: รอยืนยัน with the insurer or fund; `family-legal` in personal-life marks the same point). Check while the user is alive, not after:

| Account | Where the name is set | Ask |
|---|---|---|
| Life insurance policy | Policy schedule; change by the insurer's form | Who is named now · is it still who the user wants · share for each |
| Provident fund (PVD, กองทุนสำรองเลี้ยงชีพ) | Beneficiary form held by the fund or employer (รอยืนยัน with the fund) | Same; a form signed years ago at the first job is common |
| RMF, other funds, savings bond | Ask the fund house or bank whether a beneficiary can be named at all (รอยืนยัน per provider) | If not, it follows the will or the statutory heirs |
| Bank deposits | Usually no beneficiary, part of the estate (รอยืนยัน with the bank) | Covered by a will (`family-legal`) |

Put the result in one table: account · named now · intended · matches? Flag in this order: **high** — an ex-spouse or someone who has died is still named, or nobody is named; **medium** — a minor child is named directly with no plan for who manages the money until adulthood (the rules for minors receiving money: รอยืนยัน, ask the insurer and see `family-legal`); **low** — shares do not match the intent. Changing a beneficiary is the user's own step with the insurer or fund; wills and inheritance go to `family-legal` (personal-life, if installed).

Idea: `estate-and-tax-brief` steps 5–6, anthropics/claude-for-financial-advisors (Apache-2.0, viewed 2026-11-10); US account types and legal terms left out.

## Rules that changed recently

**New Health Standard (มาตรฐานใหม่สัญญาประกันสุขภาพ)** — new policies from 8 Nov 2564, existing policies from 1 Jul 2565: standard coverage categories, renewal guaranteed except for fraud, claims for unnecessary treatment, or non-disclosure; premium increases only by age band or medical cost trend for the whole portfolio, not one person.

**Co-payment (ส่วนร่วมจ่าย)** — health policies with cover starting **from 20 March 2568**. Assessed at each renewal on last year's IPD claims:

| Case | Trigger | Next year co-pay |
|---|---|---|
| 1 | simple illness claims (โรคทั่วไปไม่รุนแรง) 3+ times and claim amount ≥ 200% of premium | 30% |
| 2 | general illness claims (excluding major surgery / serious illness) 3+ times and ≥ 400% of premium | 30% |
| 3 | both 1 and 2 | 50% |

Co-pay is lifted when the following year's claims fall below the trigger. Policies held before 20 March 2568 and renewed continuously are not affected. Exact exclusions per policy (รอยืนยัน in the policy wording).

## Before signing

- **Free-look period**: return a new life or health policy within 15 days of receiving it for a refund (30 days when sold by phone) (รอยืนยัน per policy)
- Disclose all health history truthfully — non-disclosure lets the insurer void the policy
- Savings / investment-linked (unit-linked) policies: ask the cover-only cost; compare with term + fund
- Waiting periods: usually 30 days for illness, 120 days for specified conditions (รอยืนยัน per policy)

## Complaints

Office of Insurance Commission (สำนักงาน คปภ.) hotline **1186**, oic.or.th, or any provincial OIC office. Bring policy, claim letters, receipts, and the timeline.


## reference: insurance-review.md

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


## reference: retirement-plan.md

<!-- merged from skill `retirement-plan` on 2026-11-27 · description was: Use when asking how much to save to retire in Thailand -->
# Retirement Plan (วางแผนเกษียณ)

General information, not financial advice — a Certified Financial Planner (CFP, นักวางแผนการเงิน) can do a full plan. Every figure is an estimate; recompute yearly.

## The five numbers to collect

1. Age now, planned retirement age, plan-to age (use 85–90; women and non-smokers lean 90)
2. Monthly spending today that will continue in retirement (exclude mortgage if paid off; add health costs)
3. Social security: section (ม.33 / ม.39 / ม.40), months contributed so far
4. Provident fund (PVD, กองทุนสำรองเลี้ยงชีพ) balance, own + employer rate, salary
5. Other assets set aside for retirement (Retirement Mutual Fund (RMF), ThaiESG, insurance annuity, property income)

## Formulas

- Spending at retirement = spending today × (1 + inflation)^years to retirement. Use 3% inflation unless the user chooses another.
- Needed sum (simple, real return = 0 in retirement) = yearly spending at retirement × years in retirement.
- Future value of monthly saving = PMT × ((1 + r)^n − 1) ÷ r, with r = annual return ÷ 12 and n = months.
- Required monthly saving = gap ÷ that same factor.

Run the numbers with the script instead of by hand: `node scripts/retire.mjs <file.json>` (example: `scripts/example.json` = the worked example in [`worked-example.md`](worked-example.md); `--self-test` checks it). Input: `age` `retireAge` `planToAge` `spendMonthly` `returnPct`, optional `inflationPct` (3), `year` (Buddhist year now), `sso: { monthsNow, monthsPerYear, avgWage }`, `assets: [{ name, balance, monthly, returnPct }]` for PVD / RMF, `levers: { retireLaterYears, spendLessMonthly }` (default 3 years and 5,000, from the worked example). Output: spending at retirement, needed sum, pension, gap, monthly saving, the three levers, the saving at 3% / 5% / 6% and the two-way table of retire age × spending (`--mc` adds the chance check, section "Chance the money lasts"). Without `avgWage` the pension uses the wage ceiling of the retirement year (upper bound). Pension rule and ceilings: `scripts/sso-pension.json` (`checked` date). **Script path:** installed: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/retirement-and-insurance/scripts/retire.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/retirement-and-insurance/scripts/retire.mjs` · Node only.

## Social security old age (กรณีชราภาพ, ม.33 / ม.39)

| Contributions | Benefit at age 55 and leaving insured work |
|---|---|
| Under 12 months | บำเหน็จ: own old-age contributions back |
| 12–179 months | บำเหน็จ: own + employer old-age contributions plus returns |
| 180 months or more | บำนาญ for life: 20% of average wage of last 60 months, + 1.5% for every 12 months beyond 180 |

Wage ceiling: 15,000 until 2568; **17,500 for 2569–2571**, 20,000 for 2572–2574, 23,000 from 2575. The pension average uses the last 60 months, so a higher ceiling raises it only gradually (exact transition rule (รอยืนยัน) with the Social Security Office (SSO) hotline 1506).

Example: 25 years (300 months) contributions → 20% + 1.5% × 10 = 35%. At average wage 23,000 → 8,050 baht/month. At 17,500 → 6,125. At 15,000 → 5,250.

## Tax-advantaged tools

| Tool | Lock | Fit |
|---|---|---|
| PVD (กองทุนสำรองเลี้ยงชีพ) | until leaving employer; keep it in the fund on job change to keep tax benefits | first choice — employer match is free money; raise own rate to get full match |
| RMF | 5 years held and age 55 | top up after PVD; inside the 500,000 combined cap |
| ThaiESG | 5 years (buys 2567–2569) | medium-term, not age-locked; outside the cap |
| Pension insurance (ประกันบำนาญ) | to payout age | guaranteed income, low return; inside the cap |
| กอช. = National Savings Fund (กองทุนการออมแห่งชาติ), for ม.40 / informal workers | to age 60 | government matching contribution |

Caps and tax rules: `income-tax-th`. Fund choice inside RMF/PVD: `fund-and-bond-picker`.

## Workflow

1. Collect the five numbers; mark guesses as estimates.
2. Compute spending at retirement and the needed sum.
3. Subtract the pension value (monthly × 12 × years) and projected PVD/RMF.
4. Turn the gap into the required monthly saving at a stated return (5–6% for a balanced mix; 3% conservative).
5. Show three levers: retire later, spend less, save more — with numbers for each. The script also prints a two-way table (retire age × spending today, each moved 2 lever steps) so the user sees two levers pulled together.
6. If the user asks "how sure is this" or has most of the plan in equity funds, run the chance check below.
7. Check emergency fund and debts first (`budget-and-debt`, `budget-and-debt`); a plan with 25% card debt starts there.

## Chance the money lasts — `--mc`

The plan above uses one fixed return. Real returns jump around, and a bad run of years just before or after retiring hurts most. `node scripts/retire.mjs <file.json> --mc` replays the plan 5,000 times with random yearly returns (fixed seed 42, so the same file always gives the same answer) and reports:

- the chance the money lasts to `planToAge`
- the pot at retirement and what is left at `planToAge`, at the 10th, 50th and 90th percentile of the runs
- the middle age at which the money ran out, in the runs where it did

Input: the plan file plus `"mc": { "sdPct": … }`. **`sdPct` (yearly volatility of the user's mix, %) has no default** — no Thai source was checked, so the user supplies it, for example from the standard deviation on the factsheets of the funds they hold, and the script stops without it. Before retirement the simulation uses the plan's own basis: each asset at its own `returnPct` and the extra saving at the plan's `returnPct`, compounded monthly with deposits at each month end, then one random yearly shock moves all of them together. With `sdPct` 0 and `inflationSdPct` 0 the pot at retirement equals the plan's, and a plan that says "enough" lasts in 100% of runs (both in `--self-test`). Optional: `returnPct` (default = the plan's; a different figure shifts every asset's return by the same amount), `retiredReturnPct` (after retirement; lower it for a safer mix), `inflationSdPct` (default 0 = steady inflation, the script says so), `monthlySaving` (default = the plan's required saving, so the answer reads "if you save what the plan says, how likely is it enough"), `runs`, `seed`. Example: `scripts/example-mc.json` (its 10% volatility is made up for the example); its results are in [`worked-example.md`](worked-example.md).

Say every time: the volatility and returns are the user's assumptions; the result is a range under those assumptions, not a forecast; the ม.33 pension is fixed in baht and loses to inflation; the simulation lets money keep earning after retirement while the simple plan assumes a real return of 0. A chance well below the user's comfort (many planners aim near 80–90%, a rule of thumb, ยังไม่ได้ตรวจ) goes back to the levers, not to a riskier mix.

## Spending after retirement — guardrails, not a fixed %

A fixed "4% of the starting pot, raised with inflation every year" ignores what the market does. The guardrail idea (Guyton and Klinger, *Journal of Financial Planning*, 2006 — idea only, their exact bands are for US portfolios): set a starting withdrawal rate (4–5%), raise it with inflation each year, and each year recompute this year's withdrawal ÷ current portfolio. If that rate has drifted about 20% above the starting rate, cut spending by about 10%; if it has drifted 20% below, allow a 10% raise; skip the inflation raise in a year the portfolio fell. Small cuts early keep the money alive without the all-or-nothing of a fixed rule. Apply it to the invested part only — the ม.33 pension is fixed and is not withdrawn.

## Rules

- Always show inflation; "30,000 a month" today is about 63,000 in 25 years at 3%.
- State the return assumption beside every result.
- Do not count the pension as inflation-proof.
- Recompute every year or after a job change.

## Check before sending

- The needed sum, gap and monthly saving come from a `retire.mjs` run in this session; the return and inflation used are stated beside them.
- The three levers and the 3% / 5% / 6% line from the script are shown, with the one the user picked.
- Pension: say whether it used the user's average wage or the ceiling (upper bound), give the `sso-pension.json` `checked` date, and that it is not inflation-linked.
- Each `คำเตือน` line from the script is fixed in the input or repeated to the user.
- A `--mc` result names the volatility as the user's own figure and is called a range under assumptions, never a forecast; no volatility or return was filled in by the agent without saying so.

## References

- [`worked-example.md`](worked-example.md) — open when you want the full age-35 example or the `--mc` example results
- [`sources.md`](sources.md) — open when you must re-check the pension rule or the Monte Carlo idea


## reference: sources.md

# Sources · retirement-plan

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.prd.go.th/th/content/category/detail/id/31/iid/303450 , https://www.thairath.co.th/money/economics/thai_economics/2899435

ที่มา: idea of Monte Carlo ranges and two-way sensitivity tables from `creating-financial-models` in anthropics/claude-cookbooks (MIT, viewed 2026-11-10); its script needs numpy, so `retire.mjs` was written from scratch in Node.


## reference: worked-example.md

# Worked example · retirement-plan

Age 35, retire 60, plan to 85. Spends 30,000/month today. Salary 40,000, PVD 5% + employer 5% = 4,000/month. Social security ม.33, will reach 300 months.

| Step | Calculation | Result |
|---|---|---|
| Spending at 60 | 30,000 × 12 × 1.03^25 | 753,760 / year (62,813 / month) |
| Needed sum | 753,760 × 25 years | **18,844,000** |
| Social security pension | 8,050 × 12 × 25 (35% × the 23,000 ceiling, which applies from 2575; not inflation-linked) | −2,415,000 |
| PVD at 60 | 4,000/month, 5%, 300 months | −2,382,039 |
| Gap | | **14,047,000** |
| Monthly saving needed | at 6%, 300 months (factor 693.0) | **≈ 20,270 / month** |

Reading: on these assumptions the PVD alone covers about 13%. Levers: raising PVD to the employer's max match, retiring at 63, or cutting retirement spending to 25,000 today each move the number a lot — show the user the one they choose. Salary growth is ignored here, which understates PVD.

## Chance-check example (`--mc`)

In `example-mc.json` (the worked example, volatility 10% and inflation volatility 1% made up, 4% after retirement) saving the plan's 20,270 a month lasts to 85 in 46% of runs and the middle pot at 60 is 15.3 million, below the plan's 16.43 million, because volatile returns compound to less than their average. With volatility 0 the pot is the plan's 16,429,001. If `retiredReturnPct` is set equal to inflation (the plan's own real return of 0), the money runs out at 84 instead of lasting to 85: the plan counts the fixed-baht pension against spending that keeps rising, the simulation does not (run 2026-11-10).
