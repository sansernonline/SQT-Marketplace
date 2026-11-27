# Worked examples · mutual-fund-picker

Open when showing the user fee drag over 25 years.

## Worked example — fee drag

100,000 baht, 25 years, market return 7%/year before fees.

| Fund | TER | Value after 25 years |
|---|---|---|
| Index fund | 0.3% | 100,000 × 1.067^25 ≈ **506,000** |
| Active fund (matches market before fees) | 1.8% | 100,000 × 1.052^25 ≈ **355,000** |

Difference ≈ 151,000, about 30% of the index outcome, from fees alone.

For the user's own funds run `node money-calc.mjs fee <file.json>` (script in `portfolio`, see its Script path); this table is `../portfolio/scripts/examples/fee.json` (run 2026-10-28: 505,953 / 355,135, gap 150,818). The 7% is an assumed market return, not a forecast.

## Worked example — DCA (ลงทุนสม่ำเสมอ)

Moved to `portfolio` (`references/dca-example.md`).
