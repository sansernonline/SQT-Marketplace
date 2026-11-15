# playbook · monthly-close — month-end close — payroll, tax, social security

Use when: running the monthly payroll · filing withholding tax, value added tax and social security
Main skills: `payroll-th` · `social-security-th` · `tax-vat-th` · agent `tax-helper`

## ขั้นตอน (Steps — copy into the todo exactly)

1. Collect the real data for the month — employee list, salary, overtime, attendance bonus, absence and leave deductions, provident fund. If the data is incomplete, put `(รอยืนยัน)` (to be confirmed) · ใคร: หัวหน้าทีม
2. Check this year's rates and caps on official websites — the social security wage base and tax rates · ใคร: `tax-helper` ตัวใหม่
3. Calculate gross → net per person with spreadsheet formulas following `payroll-th` (tax withheld by the annualised estimate) · ใคร: `tax-helper` ตัวใหม่
4. Make the list of forms due this month with their due dates, following `tax-vat-th` and `social-security-th` · ใคร: `tax-helper` ตัวใหม่
5. Prepare the filing files and click-by-click steps on the e-Filing system — the actual filing and payment must wait for approval · ใคร: `tax-helper` ตัวใหม่ prepares, then the user files and pays personally
6. Check (ตรวจ) — the totals in the forms and filing files must match the payroll table, and recalculate 1 person by hand · ใคร: `reviewer` ตัวใหม่

## Done when

A payroll table that has been recalculated, and the filing set for every form of the month ready to file before the due date.
