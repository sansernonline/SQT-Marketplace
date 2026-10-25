# skill: debt-payoff

Use when the user has several debts (cards, personal or title loans), or asks snowball vs avalanche.

# Debt Payoff (ปลดหนี้)

General information, not legal or financial advice — for lawsuits or garnishment ask a lawyer (สภาทนายความ legal aid) or the bank's debt team.

## Thai interest caps (Bank of Thailand, regulated lenders)

| Debt | Max interest incl. fees |
|---|---|
| Credit card (บัตรเครดิต) | 16% per year |
| Personal loan — revolving (บัตรกดเงินสด) | 25% per year |
| Personal loan — instalment | 25% per year |
| Car title loan (จำนำทะเบียนรถ) | 24% per year |
| Nano finance (สินเชื่อรายย่อยเพื่อการประกอบอาชีพ) | 33% per year |
| Car or motorbike hire purchase (เช่าซื้อ) for personal use | new car 10% · used car 15% · motorbike 23% per year, effective rate (ประกาศ ธปท. 55/2568 ลงวันที่ 2 ธ.ค. 2568 · รอยืนยัน) |
| Credit card minimum payment | 8% of balance, kept at 8% until 31 Dec 2569 |

A lender charging above these, or an unlicensed lender (เงินกู้นอกระบบ), is outside the rules — informal loans above 15% per year are illegal under the Civil and Commercial Code (ป.พ.พ. ม.654) and the 2560 loan-interest act; report to police or **1359**, the ศูนย์รับแจ้งการเงินนอกระบบ สำนักงานเศรษฐกิจการคลัง (office hours; 1359.go.th, ตรวจ 2026-10-26 · https://www.1359.go.th/contact/ , https://www.thansettakij.com/finance/489385).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.bot.or.th/th/news-and-media/news/news-20251204-2.html , https://www.prachachat.net/finance/news-1368667 · ตรวจซ้ำ 2026-10-22: หน้า BOT news-20251204-2 ยืนยันขั้นต่ำ 8% ถึงสิ้นปี 2569 · เพดาน 16/25/24/33% ตรวจล่าสุด 2026-10-25 · แหล่ง: https://www.bot.or.th/content/dam/bot/documents/th/our-services/bot-license-check/interest.pdf (ประกาศ ธปท. สนส. 11-13/2563 · เช่าซื้อ 10/15/23% อยู่ในเอกสารเดียวกัน ตรวจ 2026-10-25 แหล่งเดียว) , https://www.thairath.co.th/money/personal_finance/finance_banking/2843164 , https://www.sawad.co.th/article/legal-interest-rates-and-calculation (25/24/33%) , https://www.tcc.or.th/credit-card-interest/ (16%)

## Workflow

1. **List every debt**: lender, balance, rate, minimum payment, overdue status. Use statements, not memory.
2. **Stop the bleeding**: no new borrowing; cards out of the phone wallet. Keep a 1-month mini buffer so a surprise bill does not go back on the card.
3. **Budget the fixed monthly debt payment** from `personal-budget` — minimums on all + everything extra on one target.
4. **Pick order**:
   - **Avalanche** — highest rate first; least total interest.
   - **Snowball** — smallest balance first; fastest first win, keeps people going.
   - Choose snowball if the user has quit plans before; otherwise avalanche.
5. **When a debt is cleared**, roll its whole payment onto the next target.
6. **Check refinance / consolidation** (below).
7. **If minimum payments are impossible**, use the restructuring channels before the debt turns a non-performing loan (NPL, 90+ days overdue).

## Worked example — snowball vs avalanche

Budget 8,000 baht/month. Debts:

| Debt | Balance | Rate | Minimum used |
|---|---|---|---|
| A — cash card | 80,000 | 25% | 3,000 |
| B — credit card | 15,000 | 16% | 1,000 |
| C — car title loan | 50,000 | 24% | 2,000 |

Simulated monthly, interest added then payments:

| Strategy | Order | Paid off (month) | Total interest | Debt-free |
|---|---|---|---|---|
| Snowball | B → C → A | B 6, C 16, A 23 | 37,843 | month 23 |
| Avalanche | A → C → B | A 20, C 23, B 17 (by minimums) | 36,602 | month 23 |

Avalanche saves about 1,240 baht; snowball clears the first debt in month 6. The gap widens when rates differ more or balances are larger. The real win is the fixed 8,000 — paying only minimums would take years longer.

## Refinance and consolidation

- **Consolidation loan** from a bank at a lower rate is worth it only if: new rate clearly lower, fees counted, and the old cards are closed or the limit cut — otherwise debt doubles.
- **Balance transfer (โอนยอดบัตร)** promotional rate: check the end date and the rate after; pay off before it ends.
- **Home-equity refinance** turns unsecured debt into debt secured on the house — warn about that risk.

## When you cannot pay

| Situation | Channel |
|---|---|
| Still current or under 90 days overdue, income dropped | Ask own bank for debt restructuring (ปรับโครงสร้างหนี้) — BOT requires lenders to offer it before default; long-term loan conversion for card debt |
| NPL card / cash card / personal loan, unsecured, with participating banks | **คลินิกแก้หนี้ by SAM** (บสส.) — interest 3–5% per year, up to 10 years; apply at debtclinicbysam.com (eligibility cut-off dates (รอยืนยัน)) |
| Cannot reach the lender / unfair treatment | BOT Financial Consumer Protection Center (ศคง.) hotline 1213 |
| Already sued | Attend court mediation; ask court legal aid or Lawyers Council |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thairath.co.th/money/personal_finance/finance_banking/2748868

## Rules

- Never suggest a new loan to pay minimums.
- Minimum payment only on a 16% card at 8% minimum still takes years; always show the time to payoff.
- Emergency fund goes to a mini buffer (1 month) during payoff, then grows to full size (`emergency-fund`).
- A "debt clearing" agent asking for an upfront fee is a red flag — run `scam-check`.


---

# skill: retirement-plan

Use when the user asks how much they need to retire in Thailand or how PVD, RMF and ThaiESG fit.

# Retirement Plan (วางแผนเกษียณ)

General information, not financial advice — a Certified Financial Planner (CFP, นักวางแผนการเงิน) can do a full plan. Every figure is an estimate; recompute yearly.

## The five numbers to collect

1. Age now, planned retirement age, plan-to age (use 85–90; women and non-smokers lean 90)
2. Monthly spending today that will continue in retirement (exclude mortgage if paid off; add health costs)
3. Social security: section (ม.33 / ม.39 / ม.40), months contributed so far
4. Provident fund (PVD, กองทุนสำรองเลี้ยงชีพ) balance, own + employer rate, salary
5. Other assets set aside for retirement (Retirement Mutual Fund (RMF), ThaiESG, insurance annuity, property income)

## Formulas

- Spending at retirement = spending today × (1 + inflation)^years to retirement. Use 3% inflation unless the user chooses another.
- Needed sum (simple, real return = 0 in retirement) = yearly spending at retirement × years in retirement.
- Future value of monthly saving = PMT × ((1 + r)^n − 1) ÷ r, with r = annual return ÷ 12 and n = months.
- Required monthly saving = gap ÷ that same factor.

## Social security old age (กรณีชราภาพ, ม.33 / ม.39)

| Contributions | Benefit at age 55 and leaving insured work |
|---|---|
| Under 12 months | บำเหน็จ: own old-age contributions back |
| 12–179 months | บำเหน็จ: own + employer old-age contributions plus returns |
| 180 months or more | บำนาญ for life: 20% of average wage of last 60 months, + 1.5% for every 12 months beyond 180 |

Wage ceiling: 15,000 until 2568; **17,500 for 2569–2571**, 20,000 for 2572–2574, 23,000 from 2575. The pension average uses the last 60 months, so a higher ceiling raises it only gradually (exact transition rule (รอยืนยัน) with the Social Security Office (SSO) hotline 1506).

Example: 25 years (300 months) contributions → 20% + 1.5% × 10 = 35%. At average wage 23,000 → 8,050 baht/month. At 17,500 → 6,125. At 15,000 → 5,250.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.prd.go.th/th/content/category/detail/id/31/iid/303450 , https://www.thairath.co.th/money/economics/thai_economics/2899435

## Tax-advantaged tools

| Tool | Lock | Fit |
|---|---|---|
| PVD (กองทุนสำรองเลี้ยงชีพ) | until leaving employer; keep it in the fund on job change to keep tax benefits | first choice — employer match is free money; raise own rate to get full match |
| RMF | 5 years held and age 55 | top up after PVD; inside the 500,000 combined cap |
| ThaiESG | 5 years (buys 2567–2569) | medium-term, not age-locked; outside the cap |
| Pension insurance (ประกันบำนาญ) | to payout age | guaranteed income, low return; inside the cap |
| กอช. = National Savings Fund (กองทุนการออมแห่งชาติ), for ม.40 / informal workers | to age 60 | government matching contribution |

Caps and tax rules: `tax-deduction-planner`. Fund choice inside RMF/PVD: `mutual-fund-picker`.

## Workflow

1. Collect the five numbers; mark guesses as estimates.
2. Compute spending at retirement and the needed sum.
3. Subtract the pension value (monthly × 12 × years) and projected PVD/RMF.
4. Turn the gap into the required monthly saving at a stated return (5–6% for a balanced mix; 3% conservative).
5. Show three levers: retire later, spend less, save more — with numbers for each.
6. Check emergency fund and debts first (`emergency-fund`, `debt-payoff`); a plan with 25% card debt starts there.

## Worked example

Age 35, retire 60, plan to 85. Spends 30,000/month today. Salary 40,000, PVD 5% + employer 5% = 4,000/month. Social security ม.33, will reach 300 months.

| Step | Calculation | Result |
|---|---|---|
| Spending at 60 | 30,000 × 12 × 1.03^25 | 753,760 / year (62,813 / month) |
| Needed sum | 753,760 × 25 years | **18,844,000** |
| Social security pension | 8,050 × 12 × 25 (35% × the 23,000 ceiling, which applies from 2575; not inflation-linked) | −2,415,000 |
| PVD at 60 | 4,000/month, 5%, 300 months | −2,382,039 |
| Gap | | **14,047,000** |
| Monthly saving needed | at 6%, 300 months (factor 693.0) | **≈ 20,270 / month** |

Reading: on these assumptions the PVD alone covers about 13%. Levers: raising PVD to the employer's max match, retiring at 63, or cutting retirement spending to 25,000 today each move the number a lot — show the user the one they choose. Salary growth is ignored here, which understates PVD.

## Spending after retirement — guardrails, not a fixed %

A fixed "4% of the starting pot, raised with inflation every year" ignores what the market does. The guardrail idea (Guyton and Klinger, *Journal of Financial Planning*, 2006 — idea only, their exact bands are for US portfolios): set a starting withdrawal rate (4–5%), raise it with inflation each year, and each year recompute this year's withdrawal ÷ current portfolio. If that rate has drifted about 20% above the starting rate, cut spending by about 10%; if it has drifted 20% below, allow a 10% raise; skip the inflation raise in a year the portfolio fell. Small cuts early keep the money alive without the all-or-nothing of a fixed rule. Apply it to the invested part only — the ม.33 pension is fixed and is not withdrawn.

## Rules

- Always show inflation; "30,000 a month" today is about 63,000 in 25 years at 3%.
- State the return assumption beside every result.
- Do not count the pension as inflation-proof.
- Recompute every year or after a job change.
