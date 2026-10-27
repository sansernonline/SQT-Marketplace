---
name: mutual-fund-picker
description: Use when choosing Thai mutual funds, reading a factsheet, picking RMF or ThaiESG, or setting up DCA.
---

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

ตรวจล่าสุด 2026-10-26 · ระดับความเสี่ยง 1–8 (เอกสารบางกองมีระดับ 8+ สำหรับกองซับซ้อน) แหล่ง: https://www.sec.or.th/TH/Template3/Articles/2567/310767.pdf , https://publish.sec.or.th/nrs/5777a2.doc , https://wealthythai.com/th/updates/where-to-put-your-money/19210 · ภาษีเงินปันผล 10% หัก ณ ที่จ่าย แหล่ง: https://www.rd.go.th/24745.html , https://www.finnomena.com/?p=124799 , https://www.thairath.co.th/money/personal_finance/finance_banking/2857794 · ส่วน "กองทุนเครดิตภาษีไม่ได้" มีแต่แหล่งไม่ทางการ (รอยืนยัน)

Where to compare: SEC fund search (https://market.sec.or.th/public/mfeds/), Morningstar Thailand (morningstarthailand.com) for star rating and peer rank, AIMC category returns (aimc.or.th), the AMC's own factsheet PDF.

## Passive vs active

- Compare a low-TER index fund with active funds side by side; a 1.5% fee gap compounds to roughly 30% less money over 25 years (see example).
- An active fund earns its fee only when its excess return over the benchmark (5-year and 10-year return after fees − benchmark return) is above 0 in both windows and above the peer median, and the manager team is stable. The 5-year excess return is a scoring criterion below.
- Never pick on 1-year return alone — last year's top theme fund is a common trap.

## Workflow

1. Set the goal, the time horizon (under 3 years means no equity) and the fund's role in the portfolio.
2. Pick the type from the table.
3. Shortlist 3 funds in that AIMC category; build the comparison table: TER, front/back fee, 5-yr return vs benchmark, max drawdown, size, hedging, dividend policy.
4. Score the shortlist (section "Scoring the shortlist" below), then lay out the shapes side by side ("low-cost SET50 index" vs "global index feeder" vs active) with fees and risk; the user picks.
5. Set the DCA plan and a yearly review date.

## Scoring the shortlist

Use `decision-scoring`, command `score`. Its `templates/score.json` is already a fund example. Script path: see `decision-scoring` (superuser plugin).

| Step | Value |
|---|---|
| Hard rules (`must`, filter out first, not scored) | Risk level not above what the user accepts · money needed within 3 years → level 4 or lower (Rules below) · minimum purchase not above what the user can invest · a fund promising a high fixed return → `scam-check`, not shortlisted |
| Criterion 1 | Total cost, TER % (feeder fund plus the master fund's TER) · `low` · proposed weight 0.35 |
| Criterion 2 | 5-year return after fees minus benchmark return, % · `high` · 0.35 |
| Criterion 3 | Maximum drawdown, % · `low` · 0.30 |

Weights are starting values the user can change (starting value, not yet measured). Every figure comes from the factsheet with its date. If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), show every ranked fund and let the user choose. The score is information; past returns do not guarantee the future.

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
