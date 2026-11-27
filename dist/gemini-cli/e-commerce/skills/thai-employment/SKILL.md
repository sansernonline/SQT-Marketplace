---
name: thai-employment
description: Use for Thai hiring, payroll, leave, SSO, labour law or holidays
---

# thai-employment — hiring, payroll, social security and leave

> **One rule:** the Labour Protection Act sets the floor; the company may give more, never less, and every payroll figure comes from the source rows, not from a guess.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| An employer hires staff, writes a job ad or offer | [references/hiring-th.md](references/hiring-th.md) |
| Running monthly payroll, salary withholding, ภ.ง.ด.1 | [references/payroll-th.md](references/payroll-th.md) |
| Social security questions (contributions, benefits, filings) | [references/social-security-th.md](references/social-security-th.md) |
| Labour Protection Act questions (wages, overtime, severance, leave) | [references/labour-law-basics.md](references/labour-law-basics.md) |
| An employee or HR needs a leave form or ledger entry | [references/doc-leave.md](references/doc-leave.md) |
| Planning around Thai public holidays | [references/thai-holidays.md](references/thai-holidays.md) |

Other files in this folder include `leave-and-severance.md`, `leave-forms.md`, `50-tawi.md`, `offer-letter-first-week.md`, `job-ad-thai.md`, `job-ad-english.md` and `interview-reference-check-pdpa.md`. Scripts: `scripts/payroll.mjs`.

## Steps every part shares

1. Take the names, wages and dates from the company's own records, and write `(รอยืนยัน)` for anything missing.
2. Ask the owner about one person and one issue at a time; never fix a row quietly.
3. Run `scripts/payroll.mjs` for any payroll number.

## Check before done

- General information, not legal advice. Disputes go to a labour inspector (hotline 1546) or a labour lawyer.
- Never refuse sick leave to a genuinely sick employee, and never reject a maternity or paternity request on business grounds.
- Leave the company gives beyond the law is written apart from what the law guarantees.
- A check summary lists names and issues only, never ID card numbers or bank account numbers.
- Holiday dates come from the official announcement, never from a formula.

Whole job with several steps → playbook [monthly-close](../superuser/references/playbook-monthly-close.md) (payroll, tax and social security at month end).
