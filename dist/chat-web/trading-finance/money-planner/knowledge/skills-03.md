# skill: insurance-review

Use when checking if life, health, critical illness or accident cover is enough, or an OIC complaint.

# Insurance Review (ทบทวนประกันภัย)

General information, not insurance advice — a licensed agent or broker sells; check their licence at oic.or.th. This skill organises and asks the right questions; it does not pick a product.

## Workflow

1. **List every policy**: insurer, type, sum insured, rider, yearly premium, renewal date, who is covered, group (employer) or personal. Employer group cover ends when the job ends — mark it.
2. **List what is at risk**: dependants, debts, monthly spending, existing savings, which hospital the user would actually use.
3. **Size each need** with the table below.
4. **Gap and overlap**: show have / need / gap per type; flag duplicate riders and savings-type policies with low cover per baht.
5. **Premium check**: total protection premium about 10% of income or less (rule of thumb, adjust to dependants).
6. **Prepare questions** for the agent (end of file).
7. **Tax**: premiums deductible — life + health max 100,000, own health 25,000, parents' health 15,000 (`tax-deduction-planner`). Never buy cover for the deduction alone.

## Sizing rules of thumb

| Type | What it pays | Rule of thumb |
|---|---|---|
| Life (term) | lump sum on death | debts + (yearly spending of dependants × years until they are independent) + education fund − liquid assets. Shortcut 5–10 × annual income. With no dependants and no debt, little or none is needed |
| Health — in-patient department (IPD) | hospital bills | room rate per day = the room at the hospital you would use; yearly or per-illness cap able to cover a major surgery there (private hospital major case often 1–3 million (รอยืนยัน)) |
| Health — out-patient department (OPD) | outpatient visits | usually poor value; pay from budget |
| Critical illness (โรคร้ายแรง) | lump sum on diagnosis | 1–3 years of spending to cover lost income during treatment |
| Personal accident (PA) | death / disability / treatment from accident | cheap top-up for riders, drivers, manual work; not a substitute for health |
| Disability income | monthly if unable to work | consider for self-employed with no sick-pay |

Social security ม.33 already covers medical care at the registered hospital — count it as the base layer.

## Rules that changed recently

**New Health Standard (มาตรฐานใหม่สัญญาประกันสุขภาพ)** — new policies from 8 Nov 2564, existing policies from 1 Jul 2565: standard coverage categories, renewal guaranteed except for fraud, claims for unnecessary treatment, or non-disclosure; premium increases only by age band or medical cost trend for the whole portfolio, not one person.

**Co-payment (ส่วนร่วมจ่าย)** — health policies with cover starting **from 20 March 2568**. Assessed at each renewal on last year's IPD claims:

| Case | Trigger | Next year co-pay |
|---|---|---|
| 1 | simple illness claims (โรคทั่วไปไม่รุนแรง) 3+ times and claim amount ≥ 200% of premium | 30% |
| 2 | general illness claims (excluding major surgery / serious illness) 3+ times and ≥ 400% of premium | 30% |
| 3 | both 1 and 2 | 50% |

Co-pay is lifted when the following year's claims fall below the trigger. Policies held before 20 March 2568 and renewed continuously are not affected. Exact exclusions per policy (รอยืนยัน in the policy wording).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thairath.co.th/money/personal_finance/insurance/2840568 , https://www.thaipost.net/public-relations-news/182924/

## Before signing

- **Free-look period**: return a new life or health policy within 15 days of receiving it for a refund (30 days when sold by phone) (รอยืนยัน per policy)
- Disclose all health history truthfully — non-disclosure lets the insurer void the policy
- Savings / investment-linked (unit-linked) policies: ask the cover-only cost; compare with term + fund
- Waiting periods: usually 30 days for illness, 120 days for specified conditions (รอยืนยัน per policy)

## Complaints

Office of Insurance Commission (สำนักงาน คปภ.) hotline **1186**, oic.or.th, or any provincial OIC office. Bring policy, claim letters, receipts, and the timeline.

## Questions to ask the agent

1. Is this policy under the New Health Standard? Does co-payment apply?
2. Room rate, per-illness cap, yearly cap, and what is excluded?
3. Premium at age 50, 60, 70 — show the table.
4. Guaranteed renewable to what age?
5. For life: how much of the premium is pure protection?

## Output format

Table of policies → have / need / gap per type → overlap and overspend → questions for the agent → one-line priority ("fix IPD cap first").


---

# skill: mutual-fund-picker

Use when choosing Thai mutual funds, reading a factsheet, picking RMF or ThaiESG, or setting up DCA.

# Mutual Fund Picker (เลือกกองทุนรวม)

General information, not investment advice — a licensed investment consultant (IC) at the bank or broker can give personal advice. Never recommend a specific fund as "the best"; shortlist and explain trade-offs.

## Fund types (Thai market)

| Type | Holds | SEC risk level (1–8) | Typical role |
|---|---|---|---|
| Money market (ตลาดเงิน) | deposits, short bills < 1 yr | 1–2 | parking emergency money (`emergency-fund`) |
| Government / short-term fixed income | bonds, bills | 2–4 | low-volatility savings |
| Fixed income general | corporate bonds | 4 | income |
| Mixed / balanced (ผสม) | stocks + bonds | 5 | one-fund simple portfolio |
| Thai equity (หุ้นไทย) / SET50 index | Thai shares | 6 | growth, home-market |
| Foreign equity, feeder funds (Foreign Investment Fund, FIF) | foreign funds, often one master fund | 6–7 | global diversification; check currency hedge |
| Sector / single-country / commodity | narrow theme | 7–8 | small satellite only |
| Retirement Mutual Fund (RMF) / ThaiESG | any of the above under tax wrappers | varies | tax deduction — rules in `tax-deduction-planner` |

## Fees — what each one costs you

| Fee | Thai term | Charged | Typical range (check factsheet) |
|---|---|---|---|
| Front-end | ค่าธรรมเนียมการขาย | on buy | 0 – 1.5% |
| Back-end | ค่าธรรมเนียมการรับซื้อคืน | on sell | 0 – 1% (often 0) |
| Switching | ค่าธรรมเนียมการสับเปลี่ยน | on switch | often waived in-house |
| Management fee | ค่าธรรมเนียมการจัดการ | daily inside net asset value (NAV) | index 0.1–0.6%, active equity 1–2% |
| Total expense ratio (TER) | ค่าใช้จ่ายรวมทั้งหมด | daily inside NAV | the number to compare |

Feeder funds have a second layer: the master fund's own expense ratio — add it.

Ranges are rules of thumb, not regulated caps (รอยืนยัน per fund).

## Reading a factsheet — in this order

1. **Policy and benchmark** — what it actually buys; is it a feeder (which master fund)?
2. **Risk level 1–8** and currency hedging policy (hedged / partly / unhedged)
3. **Fees** — front, back, TER; feeder adds master TER
4. **Performance vs benchmark** for 3, 5, 10 years, and percentile in its peer group (Association of Investment Management Companies (AIMC) category)
5. **Maximum drawdown** and standard deviation — "could I hold through this?"
6. **Fund size and age** — very small or new funds may close or merge
7. **Top holdings and concentration**
8. **Dividend policy** — dividend-paying funds trigger 10% tax with no credit; accumulation is more tax-efficient for most individuals (`tax-basics-th`)

Where to compare: SEC fund search (https://market.sec.or.th/public/mfeds/), Morningstar Thailand (morningstarthailand.com) for star rating and peer rank, AIMC category returns (aimc.or.th), the AMC's own factsheet PDF.

## Passive vs active

- Compare a low-TER index fund with active funds side by side; a 1.5% fee gap compounds to roughly 30% less money over 25 years (see example).
- An active fund earns its fee only when its 5- and 10-year returns after fees beat the benchmark and the peer median consistently, and the manager team is stable.
- Never pick on 1-year return alone — last year's top theme fund is a common trap.

## Workflow

1. Set the goal, the time horizon (under 3 years means no equity) and the fund's role in the portfolio.
2. Pick the type from the table.
3. Shortlist 3 funds in that AIMC category; build the comparison table: TER, front/back fee, 5-yr return vs benchmark, max drawdown, size, hedging, dividend policy.
4. Lay out the shapes side by side ("low-cost SET50 index" vs "global index feeder" vs active) with fees and risk; the user picks.
5. Set the DCA plan and a yearly review date.

## Worked example — fee drag

100,000 baht, 25 years, market return 7%/year before fees.

| Fund | TER | Value after 25 years |
|---|---|---|
| Index fund | 0.3% | 100,000 × 1.067^25 ≈ **506,000** |
| Active fund (matches market before fees) | 1.8% | 100,000 × 1.052^25 ≈ **355,000** |

Difference ≈ 151,000, about 30% of the index outcome, from fees alone.

## Worked example — DCA (ลงทุนสม่ำเสมอ)

5,000 baht a month for 3 months; NAV 10.00, 8.00, 12.50.

| Month | NAV | Units |
|---|---|---|
| 1 | 10.00 | 500 |
| 2 | 8.00 | 625 |
| 3 | 12.50 | 400 |
| Total | — | 1,525 units for 15,000 |

Average cost 9.84 per unit, below the simple average NAV 10.17 — DCA buys more units when prices fall. It does not prevent losses; it removes timing decisions. Set it as a bank auto-debit right after payday (`personal-budget`).

## Rules

- Match horizon to risk: money needed within 3 years stays in levels 1–4.
- Check fund-level tax: RMF/ThaiESG holding rules before buying for tax.
- If the user names a fund promising fixed high returns, run `scam-check`.
