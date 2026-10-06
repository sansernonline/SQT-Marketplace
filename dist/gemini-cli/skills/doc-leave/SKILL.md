---
name: doc-leave
description: Use when an employee or HR needs a Thai leave form (ใบลา) — sick, annual, personal, maternity, paternity — or a leave balance and approval flow. Entitlement numbers come from labour-law-basics.
---

# Thai Leave Forms and Balances

Right form, right balance, clean record. Leave disputes are won on records.

**Entitlement numbers (days, paid days, sections of law) live in `labour-law-basics` → `references/leave-and-severance.md`** — same plugin, always installed. Read them from there; do not restate them here or in a form. This skill covers the paperwork, the arithmetic and the approval path.

## 1. Leave types and what each form needs

| Leave | Thai name on the form | Extra document | Notice to give |
|---|---|---|---|
| Sick | ลาป่วย | medical certificate (ใบรับรองแพทย์) when the law/rules require it — see `labour-law-basics` | on the day, form on return |
| Personal business | ลากิจ | reason; proof if company rules ask | in advance per work rules (e.g. 3 working days) |
| Annual | ลาพักผ่อนประจำปี / ลาพักร้อน | none | in advance per work rules (e.g. 7 days) |
| Maternity | ลาคลอด | medical certificate with due date | as early as possible |
| Spouse after birth / paternity | ลาเพื่อช่วยภรรยาดูแลบุตร | birth certificate (สูติบัตร) | before or soon after the birth |
| Military | ลาเพื่อรับราชการทหาร | call-up letter | on receipt |
| Training | ลาเพื่อฝึกอบรม | course details | per work rules |
| Sterilisation | ลาเพื่อทำหมัน | medical certificate | |
| Ordination / wedding / unpaid | ลาอุปสมบท / ลาสมรส / ลาโดยไม่รับค่าจ้าง | company benefit, not law — state the company's rule | per work rules |

Distinguish "what the law guarantees" (from `labour-law-basics`) from "what the company grants extra". A company may give more, never less.

## 2. Balance calculation

Work in **working days**, half-day units. Exclude weekly rest days and the company's traditional holidays (`thai-holidays`).

```
balance_after = carried_forward + entitlement_this_year (pro-rata if partial year) − taken − this_request
pro-rata entitlement = annual entitlement × full months in service this year ÷ 12   (round per policy, e.g. down to 0.5)
paid days used     = min(days taken of this type, paid cap from labour-law-basics); excess = unpaid
```

### Worked example (company policy numbers, not the legal minimum)

Company policy: 10 days annual leave a year, carry forward up to 5 days, pro-rata in the year of joining, round down to 0.5.
Employee joined 1 Apr 2568. In 2569 she carried forward 3 days.

| Item | Days |
|---|---|
| Carried forward from 2568 | 3.0 |
| Entitlement 2569 (full year) | 10.0 |
| Taken Jan–Sep | 6.5 |
| This request: Wed 30 Sep – Fri 2 Oct (3 working days) | 3.0 |
| **Balance after** | **3.5** |

Check the legal floor separately: the company's 10 days must be at least the statutory annual leave in `labour-law-basics`, and unused leave is paid out on termination per that skill.

## 3. Approval flow

| Step | Who | Within | Record |
|---|---|---|---|
| 1 Submit form (paper or HR system) | employee | per notice rule | form no., dates, type, reason, handover |
| 2 Check balance and documents | HR / system | 1 working day | balance before/after on the form |
| 3 Approve / reject with reason | direct supervisor | 2 working days | signature + date; rejection reason in writing |
| 4 Second approval for > 5 days or during blackout | department head | 2 working days | |
| 5 Post to leave ledger and payroll (unpaid days → deduction) | HR | before payroll cut-off | ledger line; `payroll-th` |
| 6 File | HR | — | keep with personnel file (retention per company policy, e.g. 2 years after leaving — รอยืนยัน legal minimum) |

Sick leave and emergencies are approved after the fact; the flow is the same, the form is filed on return.

Rules for supervisors: annual leave dates may be set or agreed by the employer, but the employee must get the leave within the year (detail in `labour-law-basics`); never refuse sick leave for a genuinely sick employee; never reject a maternity or paternity request on business grounds.

## 4. Templates

Leave form, leave ledger and annual summary: [references/leave-forms.md](references/leave-forms.md).

## Rules

- One request = one form = one ledger line; corrections by a new line, not by overwriting.
- Medical certificates and reasons are sensitive personal data (health) — HR-only access (`pdpa-workflow`).
- Rules about notice periods and documents belong in the company work rules (ข้อบังคับเกี่ยวกับการทำงาน); a form cannot add new restrictions.

## Related

`labour-law-basics` (entitlements) · `payroll-th` (unpaid leave deduction) · `thai-holidays` · `doc-contract-th` · `pdpa-workflow`.
