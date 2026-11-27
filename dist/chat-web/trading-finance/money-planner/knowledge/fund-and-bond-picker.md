# skill: fund-and-bond-picker

Use when picking Thai funds, RMF, ThaiESG, bonds or deposits

# fund-and-bond-picker — shortlist funds and compare deposits and bonds

> **One rule:** a higher rate on money called "safe" always means more risk or less access, so name which one before comparing rates.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Picking Thai funds, RMF or ThaiESG, or reading a factsheet | [references/mutual-fund-picker.md](references/mutual-fund-picker.md) |
| Choosing deposits, savings bonds or money funds | [references/bonds-and-deposits.md](references/bonds-and-deposits.md) |

Other files in this folder: `fund-types-and-fees.md`, `products.md`, `rate-risk.md`, and the worked examples in `worked-example.md` and `worked-examples.md`.

## Steps every part shares

1. Build the comparison table from the factsheet or the bank's rate sheet: fees, return against a benchmark, risk, access and tax treatment.
2. Write the date of each source next to its figures.
3. Show the trade-offs of each shortlisted option; do not rank them as the best one.

## Check before done

- General information, not investment advice. A licensed investment consultant (IC) at the bank or broker gives personal advice.
- Never recommend one specific fund as "the best"; shortlist and explain the trade-offs.
- Name the risk or the lock-up before comparing any rate on "safe" money.
- A low-cost index fund and an active fund are compared side by side, with the fee gap shown in baht over the years.
- Rates and fees are confirmed with the bank or the fund house before the user signs anything.

When the fund or bond choice sits inside a full money plan, follow the playbook [money-plan](../superuser/references/playbook-money-plan.md).


## reference: bonds-and-deposits.md

<!-- merged from skill `bonds-and-deposits` on 2026-11-27 · description was: Use when choosing Thai deposits, bonds or money funds -->
# Bonds and Deposits — a side-by-side comparison of deposits, savings bonds and corporate bonds for the user's amount

General information, not investment advice.

> **One rule:** a higher rate on "safe" money always means more risk or less access — name which one before comparing rates.

## Use when
- "Fixed deposit or savings bond?" · "is this 6% หุ้นกู้ safe?" · "where do I park 1.5 million?"

Not for: how many months of emergency money → `budget-and-debt` first · stocks, equity funds, rebalancing, bond mutual funds → `mutual-fund-picker.md` · `portfolio` · tax on interest in the yearly return → `income-tax-th` · a "bond" or "deposit" with a guaranteed high return through a LINE group or personal account → `scam-check`

## Steps
1. Split the money: emergency part (`budget-and-debt`) · money needed within 1–3 years · money that can be locked longer. Emergency part: savings and money market fund only.
2. 1–3 year money: fixed deposits across banks (each ≤ 1 million), savings bonds of matching tenor, short government bond fund. Longer money: longer savings bonds; corporate bonds only investment grade, spread, and only what the user can hold to maturity.
3. For every product state who stands behind it and whether the Deposit Protection Agency (DPA, สคฝ.) covers it. DPA limit and what it covers: `budget-and-debt` "Deposit protection". Interest is 15% withheld except tax-free savings and tax-free fixed deposits when their rules are kept. Full table and rules: `products.md`.
4. Savings bonds: each round sets its own rates, tenors, minimums, caps, dates and channels (เป๋าตัง wallet or agent banks), so look up the open round live before quoting (WebSearch/WebFetch): BOT sale page https://www.bot.or.th/th/our-services/bond-and-debt-securities-services/Saving-Bond-Sale.html and the round's PDMO "รู้ก่อนซื้อ" sheet (format example: https://backend.pdmo.go.th/uploads/documents/2026/Jul/20260723165731_8729.pdf). If a page will not open, mark the value (รอยืนยัน). The wallet issue can be transferred only from a date the round sets and only inside the wallet.
5. Corporate bonds, read before buying: (1) credit rating: investment grade is AAA down to BBB- (TRIS Rating, Fitch Thailand); below BBB- or unrated is high-yield; Thai high-risk bonds are reported to carry "เสี่ยงสูง" in their name (รอยืนยัน); check rating and trend on ThaiBMA (thaibma.or.th) · (2) why the rate is high: the gap over a government bond of the same tenor is the price of default risk · (3) liquidity: plan to hold to maturity; early sale may be slow and below par · (4) concentration: no single issuer above about 10% of the user's safe money (rule of thumb, not regulation) · (5) not deposits: the selling bank is only the seller, DPA does not cover it. Who may buy unrated or high-yield bonds is restricted by SEC rules; the exact current rule was not confirmed (รอยืนยัน — check sec.or.th before telling a user they can or cannot buy).
6. For a bond fund or a bond the user may sell early: price change ≈ − duration (years) × change in market rate (points). Take duration from the fund's factsheet; if none is given, say so and do not estimate. Money needed within the duration should not sit in a long-duration fund. Show both rows (rates −1 point and +1 point) in baht for their amount. For several holdings, show a maturity ladder (quarter · what matures · amount in baht · share of safe money) and flag a quarter where a large share matures at once or where cash is needed but nothing matures. Details and example: `rate-risk.md`.
7. Show a table with after-tax interest in baht for the user's real amount: amount × rate × (1 − 0.15) × years for products with 15% withheld; run `node money-calc.mjs afterTax <file.json>` (script in `portfolio`, see its Script path; example `../portfolio/scripts/examples/afterTax.json`; the rate is ตัวอย่าง, not a current offer: 500,000 at 1.80% for 3 years → 22,950 after tax, 1.53% a year).
8. Score the options with `decision-desk/decision-scoring`, command `score` (script path: see `decision-desk/decision-scoring`, superuser plugin), only for money that passed steps 1–2. The emergency part is not scored. The user picks.

| Scoring | Value |
|---|---|
| Hard rules (`must`) | Lock period (months) not longer than the time the user will not touch the money · deposit per bank at most 1,000,000 · corporate bond rated BBB- or better, one issuer at most about 10% of the safe money |
| Criterion 1 | Interest after tax, % a year · `high` · weight 0.5 |
| Criterion 2 | Covered by DPA: 1 = yes, 0 = no · `high` · 0.3 |
| Criterion 3 | Lock period, months · `low` · 0.2 |

Weights are starting values the user can change (not yet measured). Every rate needs a source and a date; if unknown, write (รอยืนยัน) and leave that option out until confirmed. If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), the user chooses. A high score driven by a high rate means more risk or harder access, so name the criterion that pulls the score every time.

## Check before done
- Every product says whether DPA protects it
- No deposit above 1 million at one bank without saying so
- Every rate has a source page and date, or is marked (รอยืนยัน)
- Corporate bonds show rating, issuer and liquidity, not just the rate
- A bond fund or a bond that may be sold early shows the ±1 point rate effect from its duration; several holdings show the maturity ladder

## References
- [`products.md`](products.md) — open to compare products side by side or answer tax-on-interest questions (savings 20,000 baht exemption, tax-free fixed deposit rules)
- [`rate-risk.md`](rate-risk.md) — open for the duration example and maturity ladder detail
- [`worked-example.md`](worked-example.md) — open for a model split of 1,500,000 baht
- [`sources.md`](bonds-and-deposits/sources.md) — sources and check dates (2026-10-26)


## reference: fund-types-and-fees.md

# Fund types and fees · mutual-fund-picker

Open when picking the fund type for the user's goal, or explaining what each fee costs.

## Fund types (Thai market)

| Type | Holds | SEC risk level (1–8) | Typical role |
|---|---|---|---|
| Money market (ตลาดเงิน) | deposits, short bills < 1 yr | 1–2 | parking emergency money (`budget-and-debt`) |
| Government / short-term fixed income | bonds, bills | 2–4 | low-volatility savings |
| Fixed income general | corporate bonds | 4 | income |
| Mixed / balanced (ผสม) | stocks + bonds | 5 | one-fund simple portfolio |
| Thai equity (หุ้นไทย) / SET50 index | Thai shares | 6 | growth, home-market |
| Foreign equity, feeder funds (Foreign Investment Fund, FIF) | foreign funds, often one master fund | 6–7 | global diversification; check currency hedge |
| Sector / single-country / commodity | narrow theme | 7–8 | small satellite only |
| Retirement Mutual Fund (RMF) / ThaiESG | any of the above under tax wrappers | varies | tax deduction — rules in `income-tax-th` |

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


## reference: mutual-fund-picker.md

<!-- merged from skill `mutual-fund-picker` on 2026-11-27 · description was: Use when picking Thai funds, RMF or ThaiESG, or a factsheet -->
# Mutual Fund Picker (เลือกกองทุนรวม) — a scored shortlist of 3 Thai funds with trade-offs, not "the best"

General information, not investment advice — a licensed investment consultant (IC) at the bank or broker can give personal advice. Never recommend a specific fund as "the best"; shortlist and explain trade-offs.

## Use when
- Picking a Thai mutual fund, RMF or ThaiESG fund, or reading a factsheet.
- Comparing an index fund with active funds, or checking what a fund really costs.

Not for: emergency money → `budget-and-debt` · tax rules of RMF/ThaiESG → `income-tax-th` · monthly schedule, rebalancing, pre-order checks → `portfolio` · deposits and bonds → `bonds-and-deposits.md` · a fund promising a high fixed return → `scam-check`

## Steps
1. Set the goal, the time horizon (under 3 years means no equity; money needed within 3 years stays in risk levels 1–4) and the fund's role in the portfolio.
2. Pick the type from the table in `fund-types-and-fees.md` (money market, government/short-term, fixed income, mixed, Thai equity, foreign feeder, sector, RMF/ThaiESG, with the SEC risk level 1–8 of each).
3. Shortlist 3 funds in that Association of Investment Management Companies (AIMC) category. Read each factsheet in this order: (1) policy and benchmark, is it a feeder and of which master fund · (2) risk level 1–8 and currency hedging (hedged / partly / unhedged) · (3) fees: front, back, Total Expense Ratio (TER); a feeder adds the master fund's TER · (4) performance vs benchmark for 3, 5, 10 years and percentile in its peer group · (5) maximum drawdown and standard deviation: "could I hold through this?" · (6) fund size and age: very small or new funds may close or merge · (7) top holdings and concentration · (8) dividend policy: dividend-paying funds trigger 10% tax with no credit; accumulation is more tax-efficient for most individuals (`income-tax-th`). Where to compare: SEC fund search (https://market.sec.or.th/public/mfeds/), Morningstar Thailand (morningstarthailand.com), AIMC category returns (aimc.or.th), the AMC's own factsheet PDF.
4. Build the comparison table: TER, front/back fee, 5-year return vs benchmark, max drawdown, size, hedging, dividend policy. Compare a low-cost index fund with active funds side by side (a 1.5% fee gap compounds to roughly 30% less money over 25 years; example in `worked-examples.md`). An active fund earns its fee only when its excess return over the benchmark (5-year and 10-year return after fees − benchmark return) is above 0 in both windows and above the peer median, and the manager team is stable. Never pick on 1-year return alone.
5. Score the shortlist with `decision-desk/decision-scoring`, command `score` (its `templates/score.json` is already a fund example; script path: see `decision-desk/decision-scoring`, superuser plugin).
6. Lay out the shapes side by side ("low-cost SET50 index" vs "global index feeder" vs active) with fees and risk; the user picks.
7. Check fund-level tax: RMF/ThaiESG holding rules before buying for tax.
8. Set the DCA plan and a yearly review date; monthly schedule, rebalancing and pre-order checks → `portfolio`. For the user's own fees run `node money-calc.mjs fee <file.json>` (script in `portfolio`, see its Script path).

## Scoring the shortlist

| Step | Value |
|---|---|
| Hard rules (`must`, filter out first, not scored) | Risk level not above what the user accepts · money needed within 3 years → level 4 or lower · minimum purchase not above what the user can invest · a fund promising a high fixed return → `scam-check`, not shortlisted |
| Criterion 1 | Total cost, TER % (feeder fund plus the master fund's TER) · `low` · proposed weight 0.35 |
| Criterion 2 | 5-year return after fees minus benchmark return, % · `high` · 0.35 |
| Criterion 3 | Maximum drawdown, % · `low` · 0.30 |

Weights are starting values the user can change (not yet measured). Every figure comes from the factsheet with its date. If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), show every ranked fund and let the user choose. The score is information; past returns do not guarantee the future. Fee ranges in the reference are rules of thumb, not regulated caps (รอยืนยัน per fund).

## Check before done
- 3 funds shortlisted from one AIMC category, every figure from the factsheet with its date
- Feeder funds show the master fund's TER added
- Horizon matches risk (within 3 years → levels 1–4)
- A fund promising fixed high returns went to `scam-check`
- No fund called "the best"

## References
- [`fund-types-and-fees.md`](fund-types-and-fees.md) — open to choose a fund type or explain fees (front-end, back-end, switching, management, TER)
- [`worked-examples.md`](worked-examples.md) — open to show fee drag over 25 years (DCA unit buying: `portfolio`)
- [`sources.md`](sources.md) — sources and check dates (2026-10-26) for risk levels 1–8 and the 10% dividend tax


## reference: products.md

# Product comparison and tax rules · bonds-and-deposits

Open when comparing deposit products, savings bonds, corporate bonds or money market funds side by side, or when the user asks about tax on interest or tax-free fixed deposits.

## The choices side by side

| Product | Who stands behind it | Protected by the Deposit Protection Agency (DPA, สคฝ.)? | Access | Tax on interest |
|---|---|---|---|---|
| Savings account | The bank | Yes | Instant | Tax-free if all savings interest across all banks is ≤ 20,000 baht a year **and** the user consents to the bank sending data to the Revenue Department; otherwise 15% withheld from the first baht |
| Fixed deposit (ฝากประจำ) | The bank | Yes | Early withdrawal loses some interest | 15% withheld |
| Tax-free fixed deposit (ฝากประจำปลอดภาษี) | The bank | Yes | Fixed monthly deposit, at least 24 months, ≤ 25,000 a month, ≤ 600,000 in total, one account per person across all banks, at most 2 missed months; early close pays savings rate and is taxed | Tax-free if the rules are kept |
| Government savings bond (พันธบัตรออมทรัพย์) | Ministry of Finance (Public Debt Management Office, PDMO) | No — but it is a direct government debt | Locked to maturity; the wallet issue can be transferred or sold only from a set date and only inside the wallet | 15% withheld |
| Corporate bond (หุ้นกู้) | The company only | **No** | Sell before maturity only if a buyer exists; often hard and at a loss | 15% withheld |
| Money market fund (กองทุนรวมตลาดเงิน) | The fund's assets (short deposits, bills) | **No** — no mutual fund unit is | Usually next business day (T+1), check the prospectus | Gains on fund units: see `income-tax-th` |

DPA limit and what it covers: `budget-and-debt` "Deposit protection".


## reference: rate-risk.md

# Rate risk and maturity ladder · bonds-and-deposits

Open when the user holds a bond fund, may sell a bond before maturity, or holds several bonds, savings bonds or fixed deposits.

A deposit or a bond held to maturity pays back its face value. A **bond fund**, or a bond the user may sell early, changes price when market rates move:

```
price change ≈ − duration (years) × change in market rate (percentage points)
```

ตัวอย่างสมมติ: a bond fund with duration 3 years; market rates rise 1 point → the fund's price falls about 3%; rates fall 1 point → it rises about 3%. A fund with duration 0.5 year moves about 0.5% for the same 1 point. The formula is an approximation that is good for small moves.

- Take the duration from the fund's factsheet (often shown as portfolio duration; the exact label varies, รอยืนยัน per factsheet). No duration given → say so, do not estimate it.
- Money needed within the duration should not sit in a long-duration fund: a rate rise just before the user withdraws turns into a loss.
- Show the user both rows: rates −1 point and +1 point, in baht for their amount.

**Maturity ladder** — when the user holds several bonds, savings bonds or fixed deposits, list them by the quarter they mature: quarter · what matures · amount in baht · share of the safe money. Look for two things: a quarter where a large share matures at once (that money must be reinvested at whatever rate exists then), and a quarter where the user needs cash but nothing matures. Spreading maturities over several quarters or years (a ladder) evens both out. Also keep the issuer check in section 3 item 4: one issuer above about 10% shows up here as one large row.


## reference: sources.md

# Sources · mutual-fund-picker

ตรวจล่าสุด 2026-10-26 · ระดับความเสี่ยง 1–8 (เอกสารบางกองมีระดับ 8+ สำหรับกองซับซ้อน) แหล่ง: https://www.sec.or.th/TH/Template3/Articles/2567/310767.pdf , https://publish.sec.or.th/nrs/5777a2.doc , https://wealthythai.com/th/updates/where-to-put-your-money/19210 · ภาษีเงินปันผล 10% หัก ณ ที่จ่าย แหล่ง: https://www.rd.go.th/24745.html , https://www.finnomena.com/?p=124799 , https://www.thairath.co.th/money/personal_finance/finance_banking/2857794 · ส่วน "กองทุนเครดิตภาษีไม่ได้" มีแต่แหล่งไม่ทางการ (รอยืนยัน)

Where to compare: SEC fund search (https://market.sec.or.th/public/mfeds/), Morningstar Thailand (morningstarthailand.com) for star rating and peer rank, AIMC category returns (aimc.or.th), the AMC's own factsheet PDF.


## reference: worked-example.md

# Worked example · bonds-and-deposits

Open when you need a model of how to split money and present the result.

1,500,000 baht in one bank's savings account; essential spending 25,000 a month; may need part of it within 2 years.

| Part | Amount | Where | Why |
|---|---|---|---|
| Emergency (6 months) | 150,000 | Savings at main bank | Instant access, protected |
| Short-term | 850,000 | Fixed deposits split over 2 banks (e.g. 500,000 + 350,000) | Every bank under 1 million protected |
| Locked 3+ years | 500,000 | Savings bond 3-year round, or investment-grade corporate bonds split over at least 3 issuers | Higher rate; the bond part is not DPA-protected — the user decides |

Rates are filled in from each bank's and PDMO's page on the day, with the date (ตัวอย่าง: no rate here is a quote).


## reference: worked-examples.md

# Worked examples · mutual-fund-picker

Open when showing the user fee drag over 25 years.

## Worked example — fee drag

100,000 baht, 25 years, market return 7%/year before fees.

| Fund | TER | Value after 25 years |
|---|---|---|
| Index fund | 0.3% | 100,000 × 1.067^25 ≈ **506,000** |
| Active fund (matches market before fees) | 1.8% | 100,000 × 1.052^25 ≈ **355,000** |

Difference ≈ 151,000, about 30% of the index outcome, from fees alone.

For the user's own funds run `node money-calc.mjs fee <file.json>` (script in `portfolio`, see its Script path); this table is `../portfolio/scripts/examples/fee.json` (run 2026-10-28: 505,953 / 355,135, gap 150,818). The 7% is an assumed market return, not a forecast.

## Worked example — DCA (ลงทุนสม่ำเสมอ)

Moved to `portfolio` (`references/dca-example.md`).
