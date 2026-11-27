---
name: budget-and-debt
description: Use for a budget, emergency fund, debts, credit report or refinance
---

# budget-and-debt — monthly budget, emergency fund, debt and home loan

> **One rule:** work from 2 to 3 months of the user's real statements, and compare every option in baht over the same months with every fee counted.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Salary runs out early, or making a monthly budget | [references/personal-budget.md](references/personal-budget.md) |
| Sizing an emergency fund or where to keep it | [references/emergency-fund.md](references/emergency-fund.md) |
| Several debts, snowball or avalanche order | [references/debt-payoff.md](references/debt-payoff.md) |
| A loan was refused, or checking an NCB credit report | [references/credit-bureau.md](references/credit-bureau.md) |
| A Thai home loan rate ends, or weighing a refinance | [references/home-refinance.md](references/home-refinance.md) |

Worksheet and worked numbers: [references/budget-worksheet.md](references/budget-worksheet.md), [references/worked-example.md](references/worked-example.md). Scripts: `scripts/payoff.mjs` (debt order) and `scripts/refinance.mjs` (home loan).

## Steps every part shares

1. Collect the real numbers from bank statements, e-wallet history and card statements; never use the user's guess of their own spending.
2. Run the script in `scripts/` for any payoff or refinance total instead of working it out by hand.
3. Show the options side by side in a table, and let the user choose.

## Check before done

- General information, not financial advice. For a lawsuit or wage garnishment, the user asks a lawyer or the bank's debt team.
- Never suggest a new loan to pay the minimum on existing debts.
- The emergency fund is never kept in stocks, crypto, long-term funds, RMF, ThaiESG or lent to friends.
- Every fee and rate in a refinance is confirmed with the bank in writing before the user signs.
- Read the user's own credit report before guessing why a loan was refused; a lender needs the user's consent to view it.

Whole job with several steps → playbook [money-plan](../superuser/references/playbook-money-plan.md).
