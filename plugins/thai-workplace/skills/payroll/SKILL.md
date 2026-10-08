---
name: payroll
description: Run monthly Thai payroll — gross to net with SSO, provident fund and PIT withholding by annualisation, then the ภ.ง.ด.1 and สปส.1-10 filings, or the year-end ภ.ง.ด.1ก and 50 ทวิ.
argument-hint: '[month|year-end] [--employees <file>]'
disable-model-invocation: true
---

Run `payroll-th` with the `tax-helper` agent for: **$ARGUMENTS**

Uses `social-security-th` for the SSO cap and `labour-law-basics` for OT rates. Produces the payroll register, payslip figures, and the filing dates for ภ.ง.ด.1 (7th paper / 15th e-Filing) and สปส.1-10 (15th), ending with the accountant handoff checklist.
