# Worked examples · mutual-fund-picker

Open when showing the user fee drag over 25 years or how dollar-cost averaging (DCA) buys units.

## Worked example — fee drag

100,000 baht, 25 years, market return 7%/year before fees.

| Fund | TER | Value after 25 years |
|---|---|---|
| Index fund | 0.3% | 100,000 × 1.067^25 ≈ **506,000** |
| Active fund (matches market before fees) | 1.8% | 100,000 × 1.052^25 ≈ **355,000** |

Difference ≈ 151,000, about 30% of the index outcome, from fees alone.

For the user's own funds run `node money-calc.mjs fee <file.json>` (script in `portfolio-snapshot`, see its Script path); this table is `../portfolio-snapshot/scripts/examples/fee.json` (run 2026-10-28: 505,953 / 355,135, gap 150,818). The 7% is an assumed market return, not a forecast.

## Worked example — DCA (ลงทุนสม่ำเสมอ)

5,000 baht a month for 3 months; NAV 10.00, 8.00, 12.50.

| Month | NAV | Units |
|---|---|---|
| 1 | 10.00 | 500 |
| 2 | 8.00 | 625 |
| 3 | 12.50 | 400 |
| Total | — | 1,525 units for 15,000 |

Average cost 9.84 per unit, below the simple average NAV 10.17 — DCA buys more units when prices fall. It does not prevent losses; it removes timing decisions. Set it as a bank auto-debit right after payday (`personal-budget`).
