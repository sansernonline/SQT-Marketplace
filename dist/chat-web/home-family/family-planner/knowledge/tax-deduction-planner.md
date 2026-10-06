# skill: tax-deduction-planner

Use from October to December when the user wants to cut Thai personal income tax, asks what ลดหย่อน is still available, how much RMF or ThaiESG to buy, or how much tax a deduction saves.

# Tax Deduction Planner (วางแผนลดหย่อนภาษีปลายปี)

General information, not tax advice — for a real return or an unusual case ask a นักบัญชี / tax agent, or call RD 1161.

Current caps and the rate table: [references/deductions-2569.md](references/deductions-2569.md). Investment income rules (dividends, interest, crypto, foreign income): `tax-basics-th`.

## Workflow

1. **Fix the tax year.** Planning in October 2026 = tax year 2569, filed Jan–Mar 2570. Money must be paid by **31 December**.
2. **Collect income.** Salary + bonus (from the employer's ทวิ 50 estimate or payslips × 12), freelance 40(2), other income. Note the PVD rate and social security deducted.
3. **Compute tax now** — income − expense deduction (50%, max 100,000 for salary) − allowances already locked in (personal, family, social security, PVD, insurance already paid) = net income → apply the rate table.
4. **Find the marginal rate.** This is the value of every extra baht deducted. At 0% net-income band, stop — further deductions save nothing.
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


## reference: deductions-2569.md

# Thai personal income tax — deductions and rates, tax year 2569 (income Jan–Dec 2026, filed early 2027)

Contents
1. Progressive rate table
2. Expense deduction
3. Family allowances
4. Insurance and social security
5. Retirement and investment funds (and the 500,000 combined cap)
6. Home, donations, stimulus
7. What changed versus tax year 2568

## 1. Progressive rate table (อัตราภาษีเงินได้บุคคลธรรมดาแบบขั้นบันได)

| Net income (เงินได้สุทธิ), baht | Rate | Tax on the full band | Cumulative tax at top of band |
|---|---|---|---|
| 0 – 150,000 | exempt | 0 | 0 |
| 150,001 – 300,000 | 5% | 7,500 | 7,500 |
| 300,001 – 500,000 | 10% | 20,000 | 27,500 |
| 500,001 – 750,000 | 15% | 37,500 | 65,000 |
| 750,001 – 1,000,000 | 20% | 50,000 | 115,000 |
| 1,000,001 – 2,000,000 | 25% | 250,000 | 365,000 |
| 2,000,001 – 5,000,000 | 30% | 900,000 | 1,265,000 |
| over 5,000,000 | 35% | — | — |

Tax saved by a deduction = deduction × your marginal rate (the band your last baht of net income falls in), until the deduction pushes you into a lower band. A 10,000-baht deduction saves 0 / 500 / 1,000 / 1,500 / 2,000 / 2,500 / 3,000 / 3,500 baht in each band above.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.rd.go.th/59670.html , https://www.kalberry.com/en/thailand/blog/tax-deductions-2026-complete-list/

## 2. Expense deduction (ค่าใช้จ่าย)

| Income type | Deduction |
|---|---|
| 40(1) salary + 40(2) fees/commission combined | 50%, max 100,000 |
| 40(8) business, online sellers | 60% flat for most trades, or actual expenses with records |

## 3. Family allowances (ค่าลดหย่อนส่วนตัวและครอบครัว)

| Item | Cap, baht | Condition |
|---|---|---|
| Personal (ส่วนตัว) | 60,000 | automatic |
| Spouse (คู่สมรส) | 60,000 | legally married, spouse has no income |
| Child (บุตร) | 30,000 each | under 20, or under 25 and studying |
| 2nd child onward born 2561 (2018) or later | 60,000 each | same |
| Parents (บิดามารดา) | 30,000 each | age 60+, own income not over 30,000/yr; one child claims per parent; ล.ย.03 form |
| Disabled dependant (ผู้พิการ/ทุพพลภาพ) | 60,000 each | disability card |
| Pregnancy and childbirth (ฝากครรภ์และคลอดบุตร) | 60,000 per pregnancy | actual cost |

## 4. Insurance and social security

| Item | Cap, baht | Condition |
|---|---|---|
| Social security (เงินสมทบประกันสังคม) | 10,500 | 2569 wage ceiling 17,500 × 5% = 875/month; was 9,000 in 2568 |
| Life insurance (เบี้ยประกันชีวิต) | 100,000 | term 10 years or more, Thai insurer |
| Own health insurance (เบี้ยประกันสุขภาพตนเอง) | 25,000 | life + health together max 100,000 |
| Parents' health insurance (เบี้ยประกันสุขภาพบิดามารดา) | 15,000 | parents' income not over 30,000 |
| Pension life insurance (ประกันชีวิตแบบบำนาญ) | 15% of income, max 200,000 | inside the 500,000 cap; unused normal life cap (100,000) can be used first |

## 5. Retirement and investment funds

| Item | Cap, baht | Holding rule |
|---|---|---|
| PVD (กองทุนสำรองเลี้ยงชีพ) employee contribution | 15% of wage, max 500,000 | first 10,000 is an exemption, the rest a deduction |
| GPF (กบข.) / private teachers' fund | 15% of wage | — |
| RMF | 30% of income, max 500,000 | hold 5 years and redeem at age 55+ |
| National Savings Fund (กอช.) | 30,000 | — |
| **Combined retirement cap** | **500,000** | PVD + GPF + teachers' fund + RMF + กอช. + pension insurance together |
| ThaiESG | 30% of income, max 300,000 | **outside** the 500,000 cap; for buys in 2567–2569 hold 5 full years; ThaiESGX new money merges into this 300,000 in 2569 |
| SSF | 0 for new buys | no deduction for purchases from 2568; units bought 2563–2567 must still be held 10 years or the tax saved is repaid |

ThaiESG after 2569: max 100,000 and 8-year hold for 2570–2575 per SEC Q&A (รอยืนยัน — check before advising for 2570).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.sec.or.th/TH/Documents/Thai%20ESGX/QA-LTF-to-Thai%20ESGX-010468.pdf , https://www.thairath.co.th/money/economics/thai_economics/2899435

## 6. Home, donations, stimulus

| Item | Cap, baht | Condition |
|---|---|---|
| Home loan interest (ดอกเบี้ยกู้ซื้อที่อยู่อาศัย) | 100,000 | lender's interest certificate; co-borrowers split |
| Donations to schools/universities, state hospitals, listed sport bodies | 2 × amount | together with general donations, max 10% of income after other deductions; e-Donation receipt needed |
| General donations (temples, charities) | 1 × amount | max 10% of income after other deductions |
| Political party donation | 10,000 | — |
| Easy e-Receipt / ช้อปดีมีคืน | 2568: 50,000 (30,000 general VAT shops + 20,000 OTOP/community enterprise, e-Tax Invoice or e-Receipt only, 16 Jan–28 Feb 2568) | **2569 programme not confirmed** as of check date (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thairath.co.th/money/economics/thai_economics/2832789 , https://www.bangkokbiznews.com/economics/1214725

## 7. What changed versus tax year 2568

- Social security cap up from 9,000 to 10,500
- ThaiESGX separate 300,000 (May–Jun 2568 window) and LTF switch up to 500,000 were 2568-only
- Easy e-Receipt not announced for 2569 at check date
- Proposed TISA savings account not law at check date — do not plan on it
