# Worked example — 12,000 BTU air conditioner, 7 years

Moved from `SKILL.md` (Total cost of ownership). The decision-matrix file for the same case is `templates/score-example.json`.

Assumptions: 8 hours a day, 365 days; electricity ≈ 4.13 baht per unit incl. VAT (กกพ. average 3.86 before VAT for bills from ก.ย. 2569; your home tier may differ — see `personal-life:household-bills` if installed, or mea.or.th / pea.co.th) · ตรวจล่าสุด 2026-10-22 · แหล่ง: https://erc.or.th/th/news-release/3472. Ft/tariff changes each period — a Thai PBS report of 23 Jul 2026 puts Sep–Dec 2569 at 3.95 baht before VAT (secondary source, erc.or.th not opened: รอยืนยัน), so recompute with the current rate. Power draws are illustrative averages — use the model's label figures.

| | A: fixed-speed | B: inverter |
|---|---|---|
| Price incl. installation | 11,900 | 16,900 |
| Average power | 1.1 kW | 0.7 kW |
| kWh per year (× 2,920 h) | 3,212 | 2,044 |
| Electricity per year | 13,266 | 8,442 |
| Electricity 7 years | 92,862 | 59,094 |
| **TCO 7 years** (cleaning equal, excluded) | **104,762** | **75,994** |

B costs 5,000 more upfront and saves about 28,800 over 7 years; payback ≈ 5,000 ÷ 4,824 per year ≈ 1 year.

Decision-matrix run on the same case (budget 18,000 baht): option C at 24,900 baht is dropped by the hard rule; B inverter 75, A fixed-speed 35; result line `B inverter อันดับ 1 นิ่ง (ขยับน้ำหนักทีละเกณฑ์ ±20% แล้วไม่เปลี่ยน · นำอันดับ 2 อยู่ 40 คะแนน)`. Run 2026-10-28.
