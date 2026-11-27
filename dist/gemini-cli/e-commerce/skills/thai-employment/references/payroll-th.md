<!-- merged from skill `payroll-th` on 2026-11-27 · description was: Use when running Thai monthly payroll -->
# payroll-th — Thai monthly payroll: gross to net pay, filing and remittance

General information, not tax advice. Check unusual cases (bonus, stock, foreign staff) with an accountant.

## Use when
- Running monthly payroll: gross pay − social security (SSO) − provident fund (PVD) − personal income tax (PIT) = net pay, then file and remit.
- Year-end filing (ภ.ง.ด.1ก, 50 ทวิ).

Not for: SSO rules → `social-security-th.md` · OT rates and leave → `labour-law-basics.md` · VAT and other tax calendar → `thai-tax` · pay day falling on a holiday → `thai-holidays.md`.

## Steps

| # | Step | Output | Deadline |
|---|---|---|---|
| 1 | Close attendance: OT, unpaid leave, new joiners, leavers, then run the 9 checks below | timesheet | before cut-off |
| 2 | Gross = salary + OT + allowances + commission + taxable benefits | payroll register | |
| 3 | SSO employee and employer share at the rate, floor and cap in `social-security-th.md` section 1 | employee + employer share | |
| 4 | PVD employee % and employer % (if the company has a fund; rules in "Provident fund (PVD) basics" below) | | |
| 5 | PIT withholding by annualisation (below) | withholding tax (WHT) per head | |
| 6 | Net pay = gross − SSO − PVD − PIT − other agreed deductions | payslip | pay day per contract (at least once a month, ม.70) |
| 7 | File **ภ.ง.ด.1** and remit WHT | RD receipt | 7th next month (paper); e-Filing = paper deadline + the current e-Filing extension (look it up live, `thai-tax` → `references/tax-vat-th.md` section 2) |
| 8 | File **สปส.1-10** and remit SSO (both shares) | SSO receipt | deadline in `social-security-th.md` section 5 |
| 9 | Remit PVD to the fund manager | | per fund rules |
| 10 | Archive register, payslips, receipts: keep 5 years minimum, 7 recommended (`shop-books` → `references/sme-bookkeeping.md` section 2; per a Revenue Department ruling, not yet checked against the current statute) | | |

Year end: **ภ.ง.ด.1ก** (annual summary per employee) by end of February; give every employee **50 ทวิ** for the year (by February, รอยืนยัน exact day) and within 1 month after anyone leaves (รอยืนยัน).

### Check the inputs before step 5
Most errors are in the timesheet and employee list, not the tax maths. Run these 9 checks against the attendance file and last month's register:
1. Clock-in with no clock-out.
2. OT far above this person's normal month (real peak or typo; OT needs the employee's consent, `labour-law-basics.md` section 1, and pays 1.5× or 3×).
3. Zero hours for someone who normally works (unrecorded leave, left, or missing file).
4. Wage rate differs from last month (raise not approved in writing, or wrong row).
5. Duplicate or overlapping rows.
6. Leave beyond entitlement (`labour-law-basics.md` section 3).
7. Someone paid last month is missing (resigned, final pay per `labour-law-basics.md` section 4, or dropped by mistake).
8. New joiner with no starting documents (no ล.ย.01, no SSO registration).
9. Total payroll differs from last month by more than 10%: explain it in 1 line (new staff, OT, bonus) before paying.

- Never guess a missing time or fix a row quietly. Ask the owner one person and one issue at a time, and write the answer next to the row.
- SSO uses the wage floor and cap in `social-security-th.md`; a wage above the cap still pays the capped amount.
- The check summary lists names and issues only, never ID card numbers or bank account numbers (`pdpa-workflow`).

### PIT withholding on salary (ม.40(1)), annualisation per ม.50(1) ประมวลรัษฎากร
1. Annual income = monthly taxable pay × pay periods in the year (12, or remaining months for a mid-year joiner + income already paid).
2. Less expense deduction: 50% of income, max **100,000**.
3. Less allowances declared on ล.ย.01: personal **60,000**; spouse with no income 60,000; child 30,000 each (60,000 for 2nd+ child born 2561 or later); parents 30,000 each (aged 60+, income under 30,000); **SSO actually paid** (up to 12 × the monthly maximum in `social-security-th.md` section 1 = 10,500 in 2569, รอยืนยัน); PVD employee contributions (within 15% of wage, overall retirement cap 500,000); life/health insurance as declared.
4. Apply the progressive rates → annual tax. Bracket table: `thai-tax` "Income tax brackets"; the script reads the same rates from `scripts/rates.json`.
5. Monthly WHT = annual tax ÷ 12. Recalculate when salary changes or a bonus is paid.

Last checked 2026-10-06 (sources in [`sources.md`](payroll-th/sources.md)).

**Bonus month:** compute tax on (annual salary + bonus) and on annual salary alone; the difference is withheld in the bonus month on top of the normal monthly WHT.

**Script:** `node payroll.mjs <file.json> [--json]` runs steps 3–6 per person (input format, path and warnings: [`script-and-example.md`](script-and-example.md)). Rates live in `scripts/rates.json`; before the January run, check rd.go.th and edit it. The result is supporting information, not tax advice.

### Provident fund (PVD) basics
- Voluntary, set up by the employer with an asset manager under พ.ร.บ.กองทุนสำรองเลี้ยงชีพ 2530. Separate from SSO.
- Employee saves 2–15% of wage; employer contributes at least the employee's rate and not more than 15%.
- Employer's share can vest by years of service (e.g. 0% under 1 year → 100% at 5 years) — the fund's rules say.
- Tax: the employee contribution is an allowance; its limits are in PIT step 3 above.

### ภ.ง.ด.1 and ภ.ง.ด.1ก
- **ภ.ง.ด.1** monthly: 1 line per employee paid (tax ID, name, pay date, amount paid, tax withheld). No return needed in a month where nothing was paid.
- **ภ.ง.ด.1ก** yearly: totals per employee for the calendar year; must agree with the 12 ภ.ง.ด.1 returns and the 50 ทวิ issued (the usual audit question).
- 50 ทวิ certificate fields and template: [`50-tawi.md`](50-tawi.md).

### Rules
- Collect ล.ย.01 (allowance declaration) from each employee at hiring and each January; no form means personal allowance only.
- Never pay salary in cash without a signed receipt; bank transfer is the record.
- Payroll data is personal data: access-limited (`pdpa-workflow`).

## Check before done
- The 9 input checks were run and any flag was resolved with the owner.
- Net pay = gross − SSO − PVD − PIT − other deductions, and ภ.ง.ด.1 and สปส.1-10 dates are stated.
- Tax year rates in `rates.json` match rd.go.th for the current year.

## References
- [`script-and-example.md`](script-and-example.md) — open when running `payroll.mjs` or checking a worked example
- [`50-tawi.md`](50-tawi.md) — open when issuing a 50 ทวิ
- [`sources.md`](payroll-th/sources.md) — sources and check dates

## เรียกเป็นคำสั่ง

`/e-commerce:thai-employment [month|year-end] [--employees <file>]`

Run `thai-employment` with the `tax-helper` agent for: **the user's request**

Uses `social-security-th.md` for the SSO cap and `labour-law-basics.md` for OT rates. Produces the payroll register, payslip figures, and the filing dates for ภ.ง.ด.1 (7th on paper; e-Filing = paper deadline + the current extension, looked up live per `thai-tax` → `references/tax-vat-th.md` section 2) and สปส.1-10 (deadline in `social-security-th.md` section 5), ending with the accountant handoff checklist.
