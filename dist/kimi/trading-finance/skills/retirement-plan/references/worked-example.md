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
