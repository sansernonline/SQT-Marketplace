# Worked example · home-refinance

Open this when you need a model of the comparison table.

Balance 2,400,000 after exactly 3 years (no penalty). Payment kept at 18,000 a month. Floating rate 6.5% (ตัวอย่าง, not a current MRR). Offer A: other bank, 3-year average 3.2%. Offer B: current bank 4.0% for a 1% fee. Fees are ตัวอย่าง until confirmed.

| Over 36 months | Stay (6.5%) | B · Retention (4.0%) | A · Refinance (3.2%) |
|---|---|---|---|
| Interest paid | 449,842 | 266,184 | 210,310 |
| One-off cost | 0 | fee 1% = 24,000 | registration 24,000 + stamp duty 1,200 + appraisal about 3,000 = 28,200 |
| Interest + cost | 449,842 | 290,184 | 238,510 |
| Balance left | 2,201,842 | 2,018,184 | 1,962,310 |

Refinance costs 4,200 more up front than retention and saves about 1,550 interest a month against it, so it breaks even in about 3 months (4,200 ÷ 1,550) and is about 51,700 ahead after 3 years. Before choosing, compare each bank's rate from year 4 (MRR − x) and the new 3-year lock. (Monthly simulation, computed here 2026-10-26 and rerun with `refinance.mjs compare scripts/example.json` 2026-10-27: interest 449,842 · 266,184 · 210,310.)
