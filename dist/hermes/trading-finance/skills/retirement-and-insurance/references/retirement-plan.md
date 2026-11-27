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
