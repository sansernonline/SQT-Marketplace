---
name: payroll-th
description: Use when running Thai monthly payroll
argument-hint: '[month|year-end] [--employees <file>]'
---

# Thai Payroll

Gross pay minus social security (SSO), provident fund (PVD) and personal income tax (PIT) = net pay. Then file and remit. This is general information, not tax advice. Check unusual cases (bonus, stock, foreign staff) with an accountant.

## 1. Monthly payroll steps

| # | Step | Output | Deadline |
|---|---|---|---|
| 1 | Close attendance: OT, unpaid leave, new joiners, leavers (see `labour-law-basics` for OT rates), then run the 9 checks in section 1a | timesheet | before cut-off |
| 2 | Compute gross: salary + OT + allowances + commission + taxable benefits | payroll register | |
| 3 | SSO 5% on wage capped at 17,500 → max 875 (see `social-security-th`) | employee + employer share | |
| 4 | PVD employee % and employer % (if the company has a fund) | | |
| 5 | PIT withholding by annualisation (section 2) | withholding tax (WHT) per head | |
| 6 | Net pay = gross − SSO − PVD − PIT − other agreed deductions | payslip | pay day per contract (at least once a month, ม.70) |
| 7 | File **ภ.ง.ด.1** and remit WHT | RD receipt | 7th next month (paper); e-Filing = paper deadline + the current e-Filing extension (look it up live, see `tax-vat-th` section 2) |
| 8 | File **สปส.1-10** and remit SSO (both shares) | SSO receipt | 15th next month |
| 9 | Remit PVD to the fund manager | | per fund rules |
| 10 | Archive register, payslips, receipts — keep 5 years minimum, 7 recommended (`sme-bookkeeping` section 2 — per a Revenue Department ruling, not yet checked against the current statute) | | |

Year end: **ภ.ง.ด.1ก** (annual summary per employee) by end of February; give every employee **50 ทวิ** for the year (by February, รอยืนยัน exact day) and within 1 month after anyone leaves (รอยืนยัน).

## 1a. Check the inputs before computing tax

Most payroll errors are in the timesheet and the employee list, not in the tax maths. Before step 5, run these 9 checks against the attendance file and last month's register:

| # | Flag | Usual cause |
|---|---|---|
| 1 | Clock-in with no clock-out | forgot to scan; hours unknown |
| 2 | OT far above this person's normal month | real peak, or a typing error; OT also needs the employee's consent (`labour-law-basics` section 1) and pays 1.5× or 3× (section 2) |
| 3 | Zero hours for someone who normally works | unrecorded leave, left the job, or missing file |
| 4 | Wage rate differs from last month | a raise not yet approved in writing, or a wrong row |
| 5 | Duplicate or overlapping rows | same day entered twice |
| 6 | Leave beyond entitlement | paid sick or personal leave over the yearly days in `labour-law-basics` section 3 |
| 7 | Someone paid last month is missing | resigned (final pay, `labour-law-basics` section 4) or dropped by mistake |
| 8 | New joiner with no starting documents | no ล.ย.01, no social security registration (`social-security-th`) |
| 9 | Total payroll differs from last month by more than 10% | explain it in 1 line (new staff, OT, bonus) before paying |

- Never guess a missing time or fix a row quietly. Ask the owner one person and one issue at a time, and write the answer next to the row.
- Social security uses the wage floor and cap in `social-security-th`; a wage above the cap still pays the capped amount.
- The 10% line is a starting value from Anthropic's payroll-prep skill (`anthropics/knowledge-work-plugins` small-business, Apache-2.0, read 2026-11-10; ideas only, no text copied), not measured on Thai payrolls.
- The check summary lists names and issues only, never ID card numbers or bank account numbers (`pdpa-workflow`).

## 2. PIT withholding on salary (ม.40(1)) — annualisation

Method from ม.50(1) ประมวลรัษฎากร:

1. Annual income = monthly taxable pay × number of pay periods in the year (12, or remaining months for a mid-year joiner + income already paid).
2. Less expense deduction: 50% of income, max **100,000**.
3. Less allowances the employee declared on ล.ย.01: personal **60,000**; spouse with no income 60,000; child 30,000 each (60,000 for 2nd+ child born 2561 or later); parents 30,000 each (aged 60+, income under 30,000); **SSO contributions actually paid** (up to 875 × 12 = 10,500 in 2569, รอยืนยัน); PVD employee contributions (within 15% of wage, overall retirement cap 500,000); life/health insurance as declared.
4. Apply the progressive rates → annual tax.
5. Monthly WHT = annual tax ÷ 12. Recalculate when salary changes or a bonus is paid.

| Net income (baht/year) | Rate | Tax on band | Cumulative at top |
|---|---|---|---|
| 0 – 150,000 | exempt | 0 | 0 |
| 150,001 – 300,000 | 5% | 7,500 | 7,500 |
| 300,001 – 500,000 | 10% | 20,000 | 27,500 |
| 500,001 – 750,000 | 15% | 37,500 | 65,000 |
| 750,001 – 1,000,000 | 20% | 50,000 | 115,000 |
| 1,000,001 – 2,000,000 | 25% | 250,000 | 365,000 |
| 2,000,001 – 5,000,000 | 30% | 900,000 | 1,265,000 |
| over 5,000,000 | 35% | | |

Last checked 2026-10-06 · Sources: https://www.rd.go.th (personal income tax rates, section 48) · SSO cap: https://www.infoquest.co.th/2025/550753

### Script

`payroll.mjs` runs all the steps in section 2: annual income → deduct expenses → allowances → progressive tax → divide by 12 periods, together with social security (5% of wages, floor base 1,650 up to the cap, rounded to whole baht) and the employee's PVD (provident fund) contribution · it gives the monthly withholding tax and the net pay per person

```
node payroll.mjs <file.json> [--json]     # example file: scripts/example.json
node payroll.mjs --self-test
```

Input file: `{ "employees": [ { "name": "...", "gross": 50000, "pvd_employee_pct": 0, "pvd_employer_pct": 0, "spouse": false, "children": 0, "children_2nd_plus": 0, "parents": 0, "other_deductions": 0, "periods": 12 } ] }` · `name` and `gross` alone are enough to run, and the rest default to 0 / false / 12 · a wrong field makes the script stop with a message that names the field · social security is computed from the average monthly wage (`gross` × `periods` ÷ 12) and spread across periods, so the annual allowance always equals 12 months · if the employee PVD exceeds 15% of wages, the script warns and allows only 15% as a deduction

The tax brackets, the social security cap and the allowances live in `scripts/rates.json` (it carries the date checked and the source; the script prints them in the result and warns when they are older than 90 days) · the social security cap and the top rate are checked against `scripts/check/facts.json` at the root of the SQT-Marketplace repo (it does not ship with the plugin) · negative net pay, and a PVD value below 1 (for example 0.05 instead of 5), raise a warning · when the tax year changes, edit `rates.json` before running in January · bonuses, mid-year hires and income already paid are not included, so work them out yourself using the bonus section below

**Script path:** ติดตั้งจาก marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/payroll-th/scripts/payroll.mjs | sort -V | tail -1` · ใน repo SQT-Marketplace: `plugins/e-commerce/skills/payroll-th/scripts/payroll.mjs` · Node อย่างเดียว ไม่มี dependency

The result is supporting information, not tax advice.

### Worked example

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

### Bonus month

Compute tax on (annual salary + bonus) and on annual salary alone; the difference is withheld in the bonus month on top of the normal monthly WHT.

## 3. ภ.ง.ด.1 and ภ.ง.ด.1ก

- **ภ.ง.ด.1** monthly — 1 line per employee paid: tax ID, name, pay date, amount paid, tax withheld. Nil months: no return needed if nothing was paid.
- **ภ.ง.ด.1ก** yearly — totals per employee for the calendar year; must agree with the 12 ภ.ง.ด.1 returns and the 50 ทวิ issued. Differences are the usual audit question.

## 4. Withholding tax certificate (หนังสือรับรองการหักภาษี ณ ที่จ่าย, 50 ทวิ)

Field list and fill-in template: [references/50-tawi.md](references/50-tawi.md).

## Rules

- Collect ล.ย.01 (allowance declaration) from each employee at hiring and each January — no form, only personal allowance.
- Never pay salary in cash without a signed receipt; bank transfer is the record.
- Payroll data is personal data — access-limited, see `pdpa-workflow`.
- Rates and allowances change by law each tax year; check rd.go.th before the January run.

## Related

`social-security-th` · `labour-law-basics` · `tax-vat-th` (calendar, ภ.ง.ด.3/53) · `thai-holidays` (pay day on holidays).

## เรียกเป็นคำสั่ง

`/e-commerce:payroll-th [month|year-end] [--employees <file>]`

Run `payroll-th` with the `tax-helper` agent for: **$ARGUMENTS**

Uses `social-security-th` for the SSO cap and `labour-law-basics` for OT rates. Produces the payroll register, payslip figures, and the filing dates for ภ.ง.ด.1 (7th on paper; e-Filing = paper deadline + the current extension, looked up live per `tax-vat-th` section 2) and สปส.1-10 (15th), ending with the accountant handoff checklist.
