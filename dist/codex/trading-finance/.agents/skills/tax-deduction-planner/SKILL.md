---
name: tax-deduction-planner
description: Use when cutting Thai personal income tax before year end, checking which deductions remain, how much RMF or ThaiESG to buy, or what a deduction saves.
---

# Tax Deduction Planner (วางแผนลดหย่อนภาษีปลายปี)

General information, not tax advice — for a real return or an unusual case ask a นักบัญชี / tax agent, or call RD 1161.

Current caps and the rate table: [references/deductions-2569.md](references/deductions-2569.md). Investment income rules (dividends, interest, crypto, foreign income): `tax-basics-th`.

## Workflow

1. **Fix the tax year.** Planning in October 2026 means tax year 2569, filed Jan–Mar 2570. Money must be paid by **31 December**.
2. **Collect income.** Salary + bonus (from the employer's ทวิ 50 estimate or payslips × 12), freelance 40(2), other income. Note the PVD rate and social security deducted.
3. **Compute tax now** — income − expense deduction (50%, max 100,000 for salary) − allowances already locked in (personal, family, social security, PVD, insurance already paid) = net income → apply the rate table.
4. **Find the marginal rate.** This is the value of every extra baht deducted. If net income is already in the 0% band, stop — further deductions save nothing.
5. **Walk the checklist** below; for each line, ask "already have it / can still add / not applicable".
6. **Size the funds last.** Check room left: RMF ≤ 30% of income, ThaiESG ≤ 30% and 300,000, and PVD + RMF + pension insurance + กอช. ≤ 500,000 combined.
7. **Recompute** and show before / after / saved, and the cash the plan locks up (RMF to age 55, ThaiESG 5 years).
8. **Paperwork list** for filing (see end).

## Year-end checklist

| # | Item | Cap (2569) | Question to ask |
|---|---|---|---|
| 1 | Personal | 60,000 | automatic |
| 2 | Spouse with no income | 60,000 | registered marriage? spouse earns nothing? |
| 3 | Children | 30,000 / 60,000 from 2nd child born 2018+ | ages, studying? |
| 4 | Parents 60+, income ≤ 30,000 | 30,000 each | sibling already claiming? |
| 5 | Disabled dependant | 60,000 | disability card |
| 6 | Pregnancy / birth | 60,000 | receipts this year |
| 7 | Social security | 10,500 | employee or ม.39? |
| 8 | PVD | 15% wage | can the rate be raised next January? |
| 9 | Life insurance | 100,000 (with health) | 10-year+ policy? |
| 10 | Own health insurance | 25,000 | — |
| 11 | Parents' health insurance | 15,000 | parents' income ≤ 30,000 |
| 12 | Pension insurance | 15% income, 200,000 | inside 500,000 cap |
| 13 | RMF | 30% income, 500,000 | inside 500,000 cap |
| 14 | ThaiESG | 30% income, 300,000 | outside 500,000 cap |
| 15 | SSF | none for new buys | old units still under 10-year hold? |
| 16 | Home loan interest | 100,000 | bank certificate |
| 17 | Donations ×2 (schools, state hospitals, sport) | within 10% of net | e-Donation recorded? |
| 18 | Donations ×1 | within 10% of net | e-Donation recorded? |
| 19 | Political party | 10,000 | — |
| 20 | Easy e-Receipt / ช้อปดีมีคืน | 2569 not announced (รอยืนยัน) | e-Tax Invoice in own name and ID |

## Rules

- **Insurance first only if needed for protection** — never buy insurance for the deduction alone; `insurance-review` decides cover.
- **Do not buy RMF/ThaiESG past the point where net income drops into a lower band** unless the user wants the saving anyway; each baht saves less there.
- **RMF and ThaiESG are investments that can lose money**; picking the fund is `mutual-fund-picker`, the long-term fit is `retirement-plan`.
- Do not count an amount the user has not paid yet; plan "buy by 20 December" to leave settlement days (fund cut-off before New Year holidays varies by AMC).
- Breaking an RMF / ThaiESG / old SSF condition means repaying all tax saved plus surcharge 1.5% per month — say so.
- Do not use 2568-only items (ThaiESGX May–June window, LTF switch, 9,000 SSO) for 2569.

## Worked example (tax year 2569)

Salary 60,000/month, no bonus = 720,000. PVD 5% = 36,000. Life premium 20,000, health premium 15,000. Single, no dependants.

| Line | Before | After plan |
|---|---|---|
| Income 40(1) | 720,000 | 720,000 |
| Expense deduction 50% (cap) | −100,000 | −100,000 |
| Personal | −60,000 | −60,000 |
| Social security | −10,500 | −10,500 |
| PVD | −36,000 | −36,000 |
| Life + health insurance | −35,000 | −35,000 |
| RMF | — | −50,000 |
| ThaiESG | — | −50,000 |
| **Net income** | **478,500** | **378,500** |
| Tax | 7,500 + 10% × 178,500 = **25,350** | 7,500 + 10% × 78,500 = **15,350** |
| **Saved** | | **10,000** |

Checks: RMF 50,000 ≤ 30% × 720,000 = 216,000; PVD 36,000 + RMF 50,000 = 86,000 ≤ 500,000; ThaiESG 50,000 ≤ 216,000 and ≤ 300,000. Net income stays in the 10% band, so every baht saved 10%. Cost: 50,000 locked to age 55, 50,000 locked 5 years.

## Output format

- Tax before / after / saved, marginal rate, the purchase list with amounts and deadlines
- "Room left" line: RMF, ThaiESG, 500,000 combined cap
- Documents to collect by January: 50 ทวิ, insurance premium certificates (ask the insurer to send data to RD), fund tax certificates (ask the AMC to send data), home loan interest certificate, e-Donation, ล.ย.03 for parents
- Any line marked (รอยืนยัน) stays marked

Filing itself (ภ.ง.ด.90/91, deadlines): `tax-basics-th`. Run from the command `/tax-plan`.
