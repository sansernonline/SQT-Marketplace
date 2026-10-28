---
name: tax-deduction-planner
description: Use when cutting Thai income tax before year end, checking deductions, or how much RMF or ThaiESG to buy.
---

# Tax Deduction Planner (วางแผนลดหย่อนภาษีปลายปี)

General information, not tax advice — for a real return or an unusual case ask a นักบัญชี / tax agent, or call RD 1161.

Current caps and the rate table: [references/deductions-2569.md](references/deductions-2569.md). Investment income rules (dividends, interest, crypto, foreign income): `tax-basics-th`.

## Workflow

1. **Fix the tax year.** Planning in October 2026 means tax year 2569, filed Jan–Mar 2570. Money must be paid by **31 December**.
2. **Collect income.** Salary + bonus (from the employer's ทวิ 50 estimate or payslips × 12), freelance 40(2), other income. Note the PVD rate and social security deducted.
3. **Compute tax now** — income − expense deduction (50%, max 100,000 for salary) − allowances already locked in (personal, family, social security, PVD, insurance already paid) = net income → apply the rate table. Run `node scripts/tax.mjs <file.json>` (example: `scripts/example.json`, section "Tax script") instead of computing by hand.
4. **Find the marginal rate.** A deduction of 1 baht saves tax equal to the marginal rate of the band the net income falls in (rate table in the reference file; never use rates from memory). A deduction large enough to cross into a lower band saves the lower rate on the part that crosses: saved = tax before − tax after, which `tax.mjs` prints with the marginal rate before and after. If net income is already in the 0% band, stop — further deductions save nothing.
5. **Walk the checklist** below; for each line, ask "already have it / can still add / not applicable".
6. **Size the funds last.** Check room left: RMF ≤ 30% of income, ThaiESG ≤ 30% and 300,000, and PVD + RMF + pension insurance + กอช. ≤ 500,000 combined. When several items compete for one budget, pick them with the knapsack below.
7. **Recompute** and show before / after / saved, and the cash the plan locks up (RMF to age 55, ThaiESG 5 years).
8. **Paperwork list** for filing (see end).

## Choosing several items under a budget

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

## Tax script

```
node scripts/tax.mjs <file.json> [--json]     # example file: scripts/example.json
node scripts/tax.mjs --self-test
```

Input: `{ "salary": 720000, "deductions": { "socialSecurity": 10500, "pvd": 36000, "lifeInsurance": 20000, "ownHealth": 15000 }, "buy": { "rmf": 50000, "thaiesg": 50000 }, "dividends": { "amount": 40000 } }`. `salary` = 40(1) + 40(2) for the year; other income goes in `otherIncome` with its own expense in `otherExpense` (reference section 2). The personal 60,000 and the expense deduction are added by the script. Keys with a cap check: `socialSecurity` `lifeInsurance` `ownHealth` `parentsHealth` `pensionInsurance` `pvd` `gpf` `rmf` `nsf` `thaiesg` `homeLoanInterest` `politicalParty` `donation` `donationDouble`; any other key (spouse, child, parents) is counted as entered and listed as not checked. Output: net income, tax before / after / saved, marginal rate, room left (RMF, ThaiESG, pension insurance, 500,000 combined cap), knapsack `value` per 50,000 block, and with `dividends` the cost of keeping the 10% as final versus including with the credit (formula from `tax-basics-th`). The 30% caps use income without dividends.

Rates and caps live in `scripts/rates-2569.json` (`checked` date, `source` line in the reference file); a new tax year needs a new file from a checked reference, never edited from memory. **Script path:** installed: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/tax-deduction-planner/scripts/tax.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/tax-deduction-planner/scripts/tax.mjs` · Node only, no dependencies.

## Year-end checklist

| # | Item | Cap (2569) | Question to ask |
|---|---|---|---|
| 1 | Personal | 60,000 | automatic |
| 2 | Spouse with no income | 60,000 | registered marriage? spouse earns nothing? |
| 3 | Children | 30,000 / 60,000 from 2nd child born 2018+ | ages, studying? |
| 4 | Parents 60+, income ≤ 30,000 | 30,000 each | sibling already claiming? |
| 5 | Disabled dependant | 60,000 | disability card |
| 6 | Pregnancy / birth | 60,000 | receipts this year |
| 7 | Social security | 10,500 | employee or ม.39? |
| 8 | PVD | 15% wage | can the rate be raised next January? |
| 9 | Life insurance | 100,000 (with health) | 10-year+ policy? |
| 10 | Own health insurance | 25,000 | — |
| 11 | Parents' health insurance | 15,000 | parents' income ≤ 30,000 |
| 12 | Pension insurance | 15% income, 200,000 | inside 500,000 cap |
| 13 | RMF | 30% income, 500,000 | inside 500,000 cap |
| 14 | ThaiESG | 30% income, 300,000 | outside 500,000 cap |
| 15 | SSF | none for new buys | old units still under 10-year hold? |
| 16 | Home loan interest | 100,000 | bank certificate |
| 17 | Donations ×2 (schools, state hospitals, sport) | within 10% of net | e-Donation recorded? |
| 18 | Donations ×1 | within 10% of net | e-Donation recorded? |
| 19 | Political party | 10,000 | — |
| 20 | Easy e-Receipt / ช้อปดีมีคืน | no 2569 round as of 2026-10-25 (news: Finance Ministry not continuing it) — plan without it (รอยืนยัน) | e-Tax Invoice in own name and ID |

## Rules

- **Insurance first only if needed for protection** — never buy insurance for the deduction alone; `insurance-review` decides cover.
- **Do not buy RMF/ThaiESG past the point where net income drops into a lower band** unless the user wants the saving anyway; each baht saves less there.
- **RMF and ThaiESG are investments that can lose money**; picking the fund is `mutual-fund-picker`, the long-term fit is `retirement-plan`.
- Do not count an amount the user has not paid yet; plan "buy by 20 December" to leave settlement days (fund cut-off before New Year holidays varies by AMC).
- Breaking an RMF / ThaiESG / old SSF condition means repaying all tax saved plus surcharge 1.5% per month — say so.
- Do not use 2568-only items (ThaiESGX May–June window, LTF switch, 9,000 SSO) for 2569.

## Worked example (tax year 2569)

Salary 60,000/month, no bonus = 720,000. PVD 5% = 36,000. Life premium 20,000, health premium 15,000. Single, no dependants.

| Line | Before | After plan |
|---|---|---|
| Income 40(1) | 720,000 | 720,000 |
| Expense deduction 50% (cap) | −100,000 | −100,000 |
| Personal | −60,000 | −60,000 |
| Social security | −10,500 | −10,500 |
| PVD | −36,000 | −36,000 |
| Life + health insurance | −35,000 | −35,000 |
| RMF | — | −50,000 |
| ThaiESG | — | −50,000 |
| **Net income** | **478,500** | **378,500** |
| Tax | 7,500 + 10% × 178,500 = **25,350** | 7,500 + 10% × 78,500 = **15,350** |
| **Saved** | | **10,000** |

Checks: RMF 50,000 ≤ 30% × 720,000 = 216,000; PVD 36,000 + RMF 50,000 = 86,000 ≤ 500,000; ThaiESG 50,000 ≤ 216,000 and ≤ 300,000. Net income stays in the 10% band, so every baht saved 10%. Cost: 50,000 locked to age 55, 50,000 locked 5 years.

## Output format

- Tax before / after / saved, marginal rate, the purchase list with amounts and deadlines
- "Room left" line: RMF, ThaiESG, 500,000 combined cap
- Documents to collect by January: 50 ทวิ, insurance premium certificates (ask the insurer to send data to RD), fund tax certificates (ask the AMC to send data), home loan interest certificate, e-Donation, ล.ย.03 for parents
- Any line marked (รอยืนยัน) stays marked

Filing itself (ภ.ง.ด.90/91, deadlines): `tax-basics-th`. Run from the command `/tax-plan`.

## Check before sending

- Every tax figure in the answer comes from a `tax.mjs` run in this session (not added up by hand), and the final plan was rerun as one `buy` set.
- `rates-2569.json` `checked` date is stated; the tax year in the answer matches `tax_year` in that file.
- Each `คำเตือน` line from the script is either fixed in the input or repeated to the user.
- Room left and the cash locked up (RMF to age 55, ThaiESG 5 years) are in the answer.
