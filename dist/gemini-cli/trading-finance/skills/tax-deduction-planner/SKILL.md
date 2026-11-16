---
name: tax-deduction-planner
description: Use when cutting Thai income tax with deductions
argument-hint: '[yearly income and what you already have, e.g. "salary 60k/month, PVD 5%, life 20k"]'
---

# tax-deduction-planner — a year-end plan that cuts Thai income tax, with before / after / saved

General information, not tax advice: for a real return or an unusual case ask a นักบัญชี / tax agent, or call RD 1161.

## Use when

- Planning year-end deductions (insurance, PVD, RMF, ThaiESG, donations, home loan interest) for Thai personal income tax
- Asking how much tax a purchase would save, or which items fit a budget

Not for: filing itself (ภ.ง.ด.90/91, deadlines) and dividends, interest, crypto, foreign income → `tax-basics-th` · choosing the fund → `mutual-fund-picker` · long-term fit → `retirement-plan` · how much cover is needed → `insurance-review`

## Steps

1. **Fix the tax year.** Planning in October 2026 means tax year 2569, filed Jan–Mar 2570. Money must be paid by **31 December**. Do not use 2568-only items (ThaiESGX May–June window, LTF switch, 9,000 SSO) for 2569.
2. **Collect income** in one question if missing: yearly salary + bonus (employer's ทวิ 50 estimate or payslips × 12), freelance 40(2), other income, PVD rate, social security deducted, premiums already paid.
3. **Compute tax now** with `node scripts/tax.mjs <file.json>` (never by hand): income − expense deduction (50%, max 100,000 for salary) − allowances already locked in = net income → rate table. Caps and rates → [`references/deductions-2569.md`](references/deductions-2569.md), never from memory.
4. **Find the marginal rate.** A 1-baht deduction saves the marginal rate of the band the net income falls in. A deduction that crosses into a lower band saves the lower rate on the crossing part (`tax.mjs` prints the rate before and after). If net income is already in the 0% band, stop: more deductions save nothing.
5. **Walk the checklist** (20 items with caps and the question to ask) in [`references/checklist-and-example.md`](references/checklist-and-example.md); for each line ask "already have it / can still add / not applicable".
6. **Size the funds last.** Room left: RMF ≤ 30% of income, ThaiESG ≤ 30% and 300,000, and PVD + RMF + pension insurance + กอช. ≤ 500,000 combined. When items compete for one budget, use `decision-scoring` command `knapsack` (script path in `decision-scoring`, superuser plugin; fields, example, `value` per block → [`references/knapsack.md`](references/knapsack.md)). One block changes the saving of the next, so **after the script gives a set, put it under `buy` and rerun `tax.mjs`** and show that figure, not the sum of the estimates.
7. **Recompute** and show before / after / saved, and the cash the plan locks up (RMF to age 55, ThaiESG 5 years).
8. **List the paperwork** for January: 50 ทวิ, insurance premium certificates (ask the insurer to send data to RD), fund tax certificates (ask the AMC to send data), home loan interest certificate, e-Donation, ล.ย.03 for parents.

Rules:
- Never buy insurance only for the deduction; `insurance-review` decides cover.
- Do not buy RMF/ThaiESG past the point where net income drops into a lower band unless the user wants the saving anyway.
- RMF and ThaiESG can lose money.
- Do not count an amount not yet paid; plan "buy by 20 December" to leave settlement days (AMC cut-off before New Year varies).
- Breaking an RMF / ThaiESG / old SSF condition means repaying all tax saved plus surcharge 1.5% per month: say so.
- Tax output is information; the user decides.

## Tax script

```
node scripts/tax.mjs <file.json> [--json]     # example file: scripts/example.json
node scripts/tax.mjs --self-test
```

Input file shape, keys with a cap check, output fields and where rates live → [`references/script.md`](references/script.md). Put other income in `otherIncome`, a purchase plan under `buy`, dividends under `dividends`. A new tax year needs a new `scripts/rates-2569.json`-style file from a checked reference, never edited from memory.

**Script path:** installed: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/tax-deduction-planner/scripts/tax.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/tax-deduction-planner/scripts/tax.mjs` · Node only, no dependencies.

## Output format

- Tax before / after / saved, marginal rate, the purchase list with amounts and deadlines
- "Room left" line: RMF, ThaiESG, 500,000 combined cap
- Documents to collect by January (step 8)
- Any line marked (รอยืนยัน) stays marked

## Check before done

- Every tax figure comes from a `tax.mjs` run in this session (not added up by hand), and the final plan was rerun as one `buy` set.
- `rates-2569.json` `checked` date is stated; the tax year in the answer matches `tax_year` in that file.
- Each `คำเตือน` line from the script is either fixed in the input or repeated to the user.
- Room left and the cash locked up are in the answer.

## References

- [`references/deductions-2569.md`](references/deductions-2569.md) — open for current caps and the rate table
- [`references/checklist-and-example.md`](references/checklist-and-example.md) — open to walk the 20-item checklist or show a worked before / after example
- [`references/script.md`](references/script.md) — open when writing the script's input file or reading its output
- [`references/knapsack.md`](references/knapsack.md) — open when several items compete for one budget

## เรียกเป็นคำสั่ง

`/trading-finance:tax-deduction-planner [yearly income and what you already have, e.g. "salary 60k/month, PVD 5%, life 20k"]`

Run the `tax-deduction-planner` skill: **$ARGUMENTS**

- No income given → ask for yearly salary/bonus, other income, PVD rate, and premiums already paid, in one question
- Show tax before / after / saved, the marginal rate, and the purchase list with deadlines
- For dividends, interest or crypto in the same return, use `tax-basics-th`; for choosing the RMF or ThaiESG fund, use `mutual-fund-picker`
