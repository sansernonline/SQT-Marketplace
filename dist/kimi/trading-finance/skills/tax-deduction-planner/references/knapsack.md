# Knapsack — picking deduction items under one budget

Moved from `SKILL.md` (tax-deduction-planner) section "Choosing several items under a budget" · open only when several items compete for one budget

Use `decision-scoring`, command `knapsack`. Its `templates/knapsack.json` is an example. Script path: see `decision-scoring` (superuser plugin).

| Field | What to enter |
|---|---|
| `budget` | Cash the user sets aside for deductions this year (baht) |
| `groups` | Top level: `{"<name>": <cap on total cost>}`. One group per shared cap, for example the room left under the 500,000 combined cap (500,000 minus what PVD already took) |
| Each `item` | Split into blocks, for example RMF 50,000, ThaiESG 50,000; a block must not exceed the item's cap in the Year-end checklist · `cost` = cash paid · `value` = tax saved by that block (`tax.mjs` prints it per block in order: block 1, 2, …) minus the cost of locking the money (if the user states one, else 0) · `group` = the group it counts against |
| `must` | Items the user needs anyway (for example an insurance premium already due) |

Example (made-up numbers): salary 1,500,000 a year. After the expense deduction 100,000, personal 60,000, social security 10,500, PVD 150,000 (10% of wage, under the 15% cap), pension insurance 150,000 (its cap is 15% of income = 225,000, limited to 200,000, so 50,000 is left), an earlier RMF purchase 80,000, two parents 60,000 and life insurance 89,500, net income is 800,000 before these blocks. PVD, pension insurance and RMF already took 380,000 of the 500,000 combined cap (so 120,000 is left). At 800,000 the first 50,000 block saves 20% (10,000) and the next ones 15% (7,500):

```json
{ "budget": 150000, "groups": { "cap-500k": 120000, "thaiesg": 300000 },
  "items": [
    { "name": "RMF block 1", "cost": 50000, "value": 10000, "group": "cap-500k" },
    { "name": "RMF block 2", "cost": 50000, "value": 7500, "group": "cap-500k" },
    { "name": "Pension insurance", "cost": 50000, "value": 7500, "group": "cap-500k" },
    { "name": "ThaiESG block", "cost": 50000, "value": 7500, "group": "thaiesg" } ] }
```

`node <decide.mjs> knapsack file.json` picks RMF block 1 + RMF block 2 + ThaiESG (value 25,000). Pension insurance ties with RMF block 2, and the script lists that set as the runner-up, so the user chooses. Each `value` is an estimate from the marginal rate of the band that block lands in (block 1: 50,000 × 20% = 10,000; later blocks fall into the 15% band). Because one block changes the saving of the next, **after the script gives a set, put that set under `buy` and rerun `tax.mjs`** and show that figure, not the sum of the estimates. Lists over 20 blocks are ranked by value per cost and not fully searched. Limits that depend on income (RMF and ThaiESG at 30% of income) are checked outside the knapsack: `tax.mjs` cuts each item to its cap and prints the room left. Tax output is information; the user decides.
