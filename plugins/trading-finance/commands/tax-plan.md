---
name: tax-plan
description: Plan year-end Thai tax deductions (ลดหย่อน) — tax before and after, room left in RMF, ThaiESG and the 500,000 retirement cap, and what to buy by 31 December.
argument-hint: [yearly income and what you already have, e.g. "salary 60k/month, PVD 5%, life 20k"]
---

Run the `tax-deduction-planner` skill: **$ARGUMENTS**

- No income given → ask for yearly salary/bonus, other income, PVD rate, and premiums already paid, in one question
- Show tax before / after / saved, the marginal rate, and the purchase list with deadlines
- For dividends, interest or crypto in the same return, use `tax-basics-th`; for choosing the RMF or ThaiESG fund, use `mutual-fund-picker`
