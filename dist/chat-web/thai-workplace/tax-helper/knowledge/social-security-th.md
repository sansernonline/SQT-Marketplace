# skill: social-security-th

Use when someone asks about Thai social security (sections 33, 39, 40), the wage cap, benefits, compensation fund, provident fund, or employer SSO filings.

# Thai Social Security (ประกันสังคม)

Who pays how much, what the money buys, and what the employer must file by when. This is general information, not legal advice. The Social Security Office (สำนักงานประกันสังคม, SSO, hotline 1506) has the final say.

## 1. The three kinds of insured person

| Section | Who | Base and rate | Monthly amount |
|---|---|---|---|
| **มาตรา 33** | Employees aged 15–60 of an employer with 1+ staff | 5% employee + 5% employer + 2.75% government, on wages between **1,650** and the cap | max **875** each side (2569–2571) |
| **มาตรา 39** | Former ม.33 who paid 12+ months and left within 6 months, choosing to stay in | 9% of a fixed base of **4,800** | **432** |
| **มาตรา 40** | Self-employed / informal workers not in ม.33 | Choose a plan | **70 / 100 / 300** |

### The wage cap is rising (มาตรา 33)

| Period | Wage cap | Max contribution (each of employee and employer) |
|---|---|---|
| until 31 Dec 2568 | 15,000 | 750 |
| **1 Jan 2569 – 2571** | **17,500** | **875** |
| 2572 – 2574 | 20,000 | 1,000 |
| 2575 onwards | 23,000 | 1,150 |

The 5% employee share covers: sickness, maternity, disability, death 1.5% · child allowance and old age 3% · unemployment 0.5%.
Minimum base 1,650 baht (รอยืนยัน still unchanged under the 2569 regulation).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/2025/550753 · https://www.krungsri.com/th/krungsri-the-coach/life/good-life/sso-section-33-rate-increase · https://www.bangkokbiznews.com/health/labour/1136027

## 2. Benefits (มาตรา 33 — seven cases)

| Case | Main benefit | Qualifying contributions |
|---|---|---|
| Sickness (non-work) | Free treatment at the chosen hospital; sick-pay 50% of wage for days off beyond employer-paid sick leave, up to 90 days per time / 180 per year | 3 months within the last 15 |
| Maternity | Lump sum **15,000** per birth + maternity cash 50% of wage for 90 days (รอยืนยัน whether SSO days changed with the 120-day leave law) + antenatal care up to 1,500 | 5 months within the last 15 |
| Disability | Monthly cash for life depending on severity, plus treatment | 3 months within the last 15 |
| Death (non-work) | Funeral grant 50,000 + survivor's lump sum by contribution years (รอยืนยัน) | 1 month within the last 6 |
| Child allowance | 1,000 per month per child aged 0–6, up to 3 children | 12 months within the last 36 |
| Old age | Pension 20% of the average last-60-months wage, +1.5% per year beyond 15 years — if 180+ months paid; otherwise lump sum | 180 months for pension |
| Unemployment | Laid off: 50% of wage for up to 180 days · resigned or contract ended: 30% for up to 90 days (รอยืนยัน current ministerial rates) · register with กรมการจัดหางาน within 30 days | 6 months within the last 15 |

มาตรา 39 gets the same except unemployment. มาตรา 40 benefits depend on the plan (70 = sickness, disability, death · 100 = + old-age lump sum · 300 = + child allowance).

## 3. Workmen's Compensation Fund (กองทุนเงินทดแทน)

- **Employer pays alone** — employees never contribute. Covers injury, illness, disability or death **from work**.
- Rate **0.2–1.0%** of annual payroll by business-risk category, applied to wages up to **240,000 baht per employee per year** (รอยืนยัน the per-head cap).
- Pay the estimated contribution by **31 January** each year; file the actual wage report (กท.20ก) by **28 February**.
- Work injury: employer reports on **กท.16** within **15 days** of knowing; the employee gets treatment at a network hospital and 70% of wage for days off.

## 4. Provident fund (กองทุนสำรองเลี้ยงชีพ, PVD) basics

- Voluntary, set up by the employer with an asset manager under พ.ร.บ.กองทุนสำรองเลี้ยงชีพ 2530. Separate from SSO.
- Employee saves 2–15% of wage; employer contributes at least the employee's rate and not more than 15%.
- Employer's share can vest by years of service (e.g. 0% under 1 year → 100% at 5 years) — the fund's rules say.
- Tax: employee contribution deductible up to 15% of wage, combined cap 500,000 with other retirement savings (see `payroll-th`).

## 5. Employer deadlines

| What | Form | Deadline |
|---|---|---|
| Register as employer when hiring the first employee | สปส.1-01 | within 30 days |
| Register a new employee | สปส.1-03 | within 30 days of start |
| Employee leaves | สปส.6-09 | by the 15th of the month after leaving |
| Monthly contribution and wage report | **สปส.1-10** | by the **15th** of the following month (e-Service at sso.go.th, bank or counter) |
| Late monthly contribution | — | surcharge **2% per month** on the unpaid amount |

## Workflow

1. Identify the section (33 / 39 / 40) and, for employers, headcount and payroll.
2. Compute the contribution: min(max(wage, 1,650), cap) × 5% — round to the baht per SSO rules.
3. For a claim, list the qualifying condition from section 2, the documents (ID card, bank book, medical certificate or birth certificate) and where to file (e-Self Service / SSO branch).
4. For employers, add section 5 dates to the calendar from `tax-vat-th`.

## Worked example

Salary 30,000. Base capped at 17,500 → employee 875, employer 875. Salary 12,000 → 600 each. Employer with 10 staff at 20,000 pays 8,750 SSO by the 15th, plus Workmen's Compensation at, say, 0.2% × (20,000 × 12 × 10) = 4,800 for the year.

## Related

`payroll-th` (deduction in the payslip) · `labour-law-basics` (leave, maternity) · `tax-vat-th` · `thai-holidays`.
