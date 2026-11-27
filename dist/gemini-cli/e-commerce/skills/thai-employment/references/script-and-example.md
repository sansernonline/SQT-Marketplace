# payroll.mjs details and worked example

## Script

`payroll.mjs` runs all the steps of the annualisation method: annual income → deduct expenses → allowances → progressive tax → divide by 12 periods, together with social security (5% of wages, floor base 1,650 up to the cap, rounded to whole baht) and the employee's provident fund (PVD) contribution. It gives the monthly withholding tax and the net pay per person.

```
node payroll.mjs <file.json> [--json]     # example file: scripts/example.json
node payroll.mjs --self-test
```

Input file: `{ "employees": [ { "name": "...", "gross": 50000, "pvd_employee_pct": 0, "pvd_employer_pct": 0, "spouse": false, "children": 0, "children_2nd_plus": 0, "parents": 0, "other_deductions": 0, "periods": 12 } ] }`

- `name` and `gross` alone are enough to run; the rest default to 0 / false / 12.
- A wrong field makes the script stop with a message that names the field.
- Social security is computed from the average monthly wage (`gross` × `periods` ÷ 12) and spread across periods, so the annual allowance always equals 12 months.
- If the employee PVD exceeds 15% of wages, the script warns and allows only 15% as a deduction.
- The tax brackets, the social security cap and the allowances live in `scripts/rates.json` (it carries the date checked and the source; the script prints them in the result and warns when they are older than 90 days).
- The social security cap and the top rate are checked against `scripts/check/facts.json` at the root of the SQT-Marketplace repo (it does not ship with the plugin).
- Negative net pay, and a PVD value below 1 (for example 0.05 instead of 5), raise a warning.
- When the tax year changes, edit `rates.json` before running in January.
- Bonuses, mid-year hires and income already paid are not included; work them out yourself with the bonus rule in `payroll-th.md`.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/thai-employment/scripts/payroll.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/thai-employment/scripts/payroll.mjs` · Node only, no dependencies.

## Worked example

Single employee, salary 50,000/month, no PVD.

| Line | Baht |
|---|---|
| Annual income 50,000 × 12 | 600,000 |
| Expense 50% capped | −100,000 |
| Personal allowance | −60,000 |
| SSO 875 × 12 | −10,500 |
| **Net income** | **429,500** |
| Tax: 7,500 + (429,500 − 300,000) × 10% | 7,500 + 12,950 = **20,450** |
| **Monthly WHT** 20,450 ÷ 12 | **1,704.17** |

Payslip: gross 50,000 − SSO 875 − WHT 1,704.17 = **net 47,420.83**.
