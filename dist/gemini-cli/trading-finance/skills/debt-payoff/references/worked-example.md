## Worked example — snowball vs avalanche

Budget 8,000 baht/month. Debts:

| Debt | Balance | Rate | Minimum used |
|---|---|---|---|
| A — cash card | 80,000 | 25% | 3,000 |
| B — credit card | 15,000 | 16% | 1,000 |
| C — car title loan | 50,000 | 24% | 2,000 |

Simulated monthly, interest added then payments:

| Strategy | Order | Paid off (month) | Total interest | Debt-free |
|---|---|---|---|---|
| Snowball | B → C → A | B 6, C 16, A 23 | 37,843 | month 23 |
| Avalanche | A → C → B | A 20, C 23, B 17 (by minimums) | 36,602 | month 23 |

Avalanche saves about 1,240 baht (1,241 by `payoff.mjs scripts/example.json`, run 2026-10-27). That is under 1 month of the 8,000 budget, so snowball is a fair choice for a user who needs early wins, and costs about 1,240 baht extra; snowball clears the first debt in month 6. The gap widens when rates differ more or balances are larger. The real win is the fixed 8,000 — paying only minimums would take years longer.
