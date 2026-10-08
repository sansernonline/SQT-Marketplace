---
name: payroll-th
description: Use when running Thai monthly payroll. Salary tax withholding by annualisation, social security, provident fund, PND 1, PND 1 Kor, 50 Tawi certificate.
---

# Thai Payroll

Gross pay minus SSO, PVD and PIT = net pay. Then file and remit. This is general information, not tax advice. Check unusual cases (bonus, stock, foreign staff) with an accountant.

## 1. Monthly payroll steps

| # | Step | Output | Deadline |
|---|---|---|---|
| 1 | Close attendance: OT, unpaid leave, new joiners, leavers (see `labour-law-basics` for OT rates) | timesheet | before cut-off |
| 2 | Compute gross: salary + OT + allowances + commission + taxable benefits | payroll register | |
| 3 | SSO 5% on wage capped at 17,500 → max 875 (see `social-security-th`) | employee + employer share | |
| 4 | PVD employee % and employer % (if the company has a fund) | | |
| 5 | PIT withholding by annualisation (section 2) | WHT per head | |
| 6 | Net pay = gross − SSO − PVD − PIT − other agreed deductions | payslip | pay day per contract (at least once a month, ม.70) |
| 7 | File **ภ.ง.ด.1** and remit WHT | RD receipt | 7th next month (paper) / 15th (e-Filing) |
| 8 | File **สปส.1-10** and remit SSO (both shares) | SSO receipt | 15th next month |
| 9 | Remit PVD to the fund manager | | per fund rules |
| 10 | Archive register, payslips, receipts — keep 5 years (accounting law) | | |

Year end: **ภ.ง.ด.1ก** (annual summary per employee) by end of February; give every employee **50 ทวิ** for the year (by February, รอยืนยัน exact day) and within 1 month after anyone leaves (รอยืนยัน).

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

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.rd.go.th (อัตราภาษีเงินได้บุคคลธรรมดา, ม.48) · SSO cap: https://www.infoquest.co.th/2025/550753

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

## 4. หนังสือรับรองการหักภาษี ณ ที่จ่าย (50 ทวิ)

Field list and fill-in template: [references/50-tawi.md](references/50-tawi.md).

## Rules

- Collect ล.ย.01 (allowance declaration) from each employee at hiring and each January — no form, only personal allowance.
- Never pay salary in cash without a signed receipt; bank transfer is the record.
- Payroll data is personal data — access-limited, see `pdpa-workflow`.
- Rates and allowances change by law each tax year; check rd.go.th before the January run.

## Related

`social-security-th` · `labour-law-basics` · `tax-vat-th` (calendar, ภ.ง.ด.3/53) · `thai-holidays` (pay day on holidays).
