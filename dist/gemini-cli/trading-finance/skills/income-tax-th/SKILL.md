---
name: income-tax-th
description: Use when asking about Thai tax on gains or cutting tax with deductions
---

# income-tax-th — personal income tax, dividends and deductions

> **One rule:** the tax is computed by the script from the year's rates and caps file, never by hand and never from memory.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| How Thai tax applies to gains or dividends | [references/tax-basics-th.md](references/tax-basics-th.md) |
| Cutting income tax with deductions, and what is worth buying | [references/tax-deduction-planner.md](references/tax-deduction-planner.md) |

Other files in this folder: `deductions-2569.md` (caps and rates for the year), `investment-income-rules.md`, `documents-to-keep.md`, `checklist-and-example.md` and `worked-example.md`. Scripts: `scripts/tax.mjs` (with `scripts/example.json`) and the rates file `scripts/rates-2569.json`.

## Steps every part shares

1. Collect the year's income, expenses and the allowances already locked in from the user's own documents.
2. Run `node scripts/tax.mjs <file.json>` for every tax figure.
3. Take every cap and rate from `deductions-2569.md`, and write the year checked next to it.

## Check before done

- General information, not tax advice. For a real return or an unusual case, the user asks a นักบัญชี or a tax agent, or calls the Revenue Department (RD) call centre on 1161.
- Never buy insurance only for the deduction; the cover is decided by the risks the user has.
- Keep the documents for each deduction (receipts, certificates, statements) in the list from `documents-to-keep.md`.
- Dividend and gain treatment is checked against the current year's rules before it is stated as fact.

Whole job with several steps → playbook [tax-season](../superuser/references/playbook-tax-season.md).
