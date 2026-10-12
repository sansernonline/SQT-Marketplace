---
name: retirement-plan
description: Use when the user asks how much they need to retire in Thailand, if they are on track, the social security old-age pension, or how PVD, RMF and ThaiESG fit.
---

# Retirement Plan (วางแผนเกษียณ)

General information, not financial advice — a CFP (นักวางแผนการเงิน) can do a full plan. Every figure is an estimate; recompute yearly.

## The five numbers to collect

1. Age now, planned retirement age, plan-to age (use 85–90; women and non-smokers lean 90)
2. Monthly spending today that will continue in retirement (exclude mortgage if paid off; add health costs)
3. Social security: section (ม.33 / ม.39 / ม.40), months contributed so far
4. PVD balance, own + employer rate, salary
5. Other assets set aside for retirement (RMF, ThaiESG, insurance annuity, property income)

## Formulas

- Spending at retirement = spending today × (1 + inflation)^years to retirement. Use 3% inflation unless the user chooses another.
- Needed sum (simple, real return = 0 in retirement) = yearly spending at retirement × years in retirement.
- Future value of monthly saving = PMT × ((1 + r)^n − 1) ÷ r, with r = annual return ÷ 12 and n = months.
- Required monthly saving = gap ÷ that same factor.

## Social security old age (กรณีชราภาพ, ม.33 / ม.39)

| Contributions | Benefit at age 55 and leaving insured work |
|---|---|
| Under 12 months | บำเหน็จ: own old-age contributions back |
| 12–179 months | บำเหน็จ: own + employer old-age contributions plus returns |
| 180 months or more | บำนาญ for life: 20% of average wage of last 60 months, + 1.5% for every 12 months beyond 180 |

Wage ceiling: 15,000 until 2568; **17,500 for 2569–2571**, 20,000 for 2572–2574, 23,000 from 2575. The pension average uses the last 60 months, so a higher ceiling raises it only gradually (exact transition rule (รอยืนยัน) with SSO 1506).

Example: 25 years (300 months) contributions → 20% + 1.5% × 10 = 35%. At average wage 17,500 → 6,125 baht/month. At 15,000 → 5,250.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.prd.go.th/th/content/category/detail/id/31/iid/303450 , https://www.thairath.co.th/money/economics/thai_economics/2899435

## Tax-advantaged tools

| Tool | Lock | Fit |
|---|---|---|
| PVD (กองทุนสำรองเลี้ยงชีพ) | until leaving employer; keep it in the fund on job change to keep tax benefits | first choice — employer match is free money; raise own rate to get full match |
| RMF | 5 years held and age 55 | top up after PVD; inside the 500,000 combined cap |
| ThaiESG | 5 years (buys 2567–2569) | medium-term, not age-locked; outside the cap |
| Pension insurance (ประกันบำนาญ) | to payout age | guaranteed income, low return; inside the cap |
| กอช. (for ม.40 / informal workers) | to age 60 | government matching contribution |

Caps and tax rules: `tax-deduction-planner`. Fund choice inside RMF/PVD: `mutual-fund-picker`.

## Workflow

1. Collect the five numbers; mark guesses as estimates.
2. Compute spending at retirement and the needed sum.
3. Subtract the pension value (monthly × 12 × years) and projected PVD/RMF.
4. Turn the gap into the required monthly saving at a stated return (5–6% for a balanced mix; 3% conservative).
5. Show three levers: retire later, spend less, save more — with numbers for each.
6. Check emergency fund and debts first (`emergency-fund`, `debt-payoff`); a plan with 25% card debt starts there.

## Worked example

Age 35, retire 60, plan to 85. Spends 30,000/month today. Salary 40,000, PVD 5% + employer 5% = 4,000/month. Social security ม.33, will reach 300 months.

| Step | Calculation | Result |
|---|---|---|
| Spending at 60 | 30,000 × 12 × 1.03^25 | 753,760 / year (62,813 / month) |
| Needed sum | 753,760 × 25 years | **18,844,000** |
| Social security pension | 6,125 × 12 × 25 (not inflation-linked) | −1,837,500 |
| PVD at 60 | 4,000/month, 5%, 300 months | −2,382,000 |
| Gap | | **14,624,000** |
| Monthly saving needed | at 6%, 300 months (factor 693.0) | **≈ 21,100 / month** |

Reading: on these assumptions the PVD alone covers about 13%. Levers: raising PVD to the employer's max match, retiring at 63, or cutting retirement spending to 25,000 today each move the number a lot — show the user the one they choose. Salary growth is ignored here, which understates PVD.

## Rules

- Always show inflation; "30,000 a month" today is about 63,000 in 25 years at 3%.
- State the return assumption beside every result.
- Do not count the pension as inflation-proof.
- Recompute every year or after a job change.
