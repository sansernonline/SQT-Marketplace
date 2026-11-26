# skill: bonds-and-deposits

Use when choosing Thai deposits, bonds or money funds

# Bonds and Deposits — a side-by-side comparison of deposits, savings bonds and corporate bonds for the user's amount

General information, not investment advice.

> **One rule:** a higher rate on "safe" money always means more risk or less access — name which one before comparing rates.

## Use when
- "Fixed deposit or savings bond?" · "is this 6% หุ้นกู้ safe?" · "where do I park 1.5 million?"

Not for: how many months of emergency money → `emergency-fund` first · stocks, equity funds, rebalancing, bond mutual funds → `mutual-fund-picker` · `rebalance-and-dca` · tax on interest in the yearly return → `tax-basics-th` · a "bond" or "deposit" with a guaranteed high return through a LINE group or personal account → `scam-check`

## Steps
1. Split the money: emergency part (`emergency-fund`) · money needed within 1–3 years · money that can be locked longer. Emergency part: savings and money market fund only.
2. 1–3 year money: fixed deposits across banks (each ≤ 1 million), savings bonds of matching tenor, short government bond fund. Longer money: longer savings bonds; corporate bonds only investment grade, spread, and only what the user can hold to maturity.
3. For every product state who stands behind it and whether the Deposit Protection Agency (DPA, สคฝ.) covers it. DPA limit and what it covers: `emergency-fund` "Deposit protection". Interest is 15% withheld except tax-free savings and tax-free fixed deposits when their rules are kept. Full table and rules: `references/products.md`.
4. Savings bonds: each round sets its own rates, tenors, minimums, caps, dates and channels (เป๋าตัง wallet or agent banks), so look up the open round live before quoting (WebSearch/WebFetch): BOT sale page https://www.bot.or.th/th/our-services/bond-and-debt-securities-services/Saving-Bond-Sale.html and the round's PDMO "รู้ก่อนซื้อ" sheet (format example: https://backend.pdmo.go.th/uploads/documents/2026/Jul/20260723165731_8729.pdf). If a page will not open, mark the value (รอยืนยัน). The wallet issue can be transferred only from a date the round sets and only inside the wallet.
5. Corporate bonds, read before buying: (1) credit rating: investment grade is AAA down to BBB- (TRIS Rating, Fitch Thailand); below BBB- or unrated is high-yield; Thai high-risk bonds are reported to carry "เสี่ยงสูง" in their name (รอยืนยัน); check rating and trend on ThaiBMA (thaibma.or.th) · (2) why the rate is high: the gap over a government bond of the same tenor is the price of default risk · (3) liquidity: plan to hold to maturity; early sale may be slow and below par · (4) concentration: no single issuer above about 10% of the user's safe money (rule of thumb, not regulation) · (5) not deposits: the selling bank is only the seller, DPA does not cover it. Who may buy unrated or high-yield bonds is restricted by SEC rules; the exact current rule was not confirmed (รอยืนยัน — check sec.or.th before telling a user they can or cannot buy).
6. For a bond fund or a bond the user may sell early: price change ≈ − duration (years) × change in market rate (points). Take duration from the fund's factsheet; if none is given, say so and do not estimate. Money needed within the duration should not sit in a long-duration fund. Show both rows (rates −1 point and +1 point) in baht for their amount. For several holdings, show a maturity ladder (quarter · what matures · amount in baht · share of safe money) and flag a quarter where a large share matures at once or where cash is needed but nothing matures. Details and example: `references/rate-risk.md`.
7. Show a table with after-tax interest in baht for the user's real amount: amount × rate × (1 − 0.15) × years for products with 15% withheld; run `node money-calc.mjs afterTax <file.json>` (script in `portfolio-snapshot`, see its Script path; example `../portfolio-snapshot/scripts/examples/afterTax.json`; the rate is ตัวอย่าง, not a current offer: 500,000 at 1.80% for 3 years → 22,950 after tax, 1.53% a year).
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
- [`references/products.md`](references/products.md) — open to compare products side by side or answer tax-on-interest questions (savings 20,000 baht exemption, tax-free fixed deposit rules)
- [`references/rate-risk.md`](references/rate-risk.md) — open for the duration example and maturity ladder detail
- [`references/worked-example.md`](references/worked-example.md) — open for a model split of 1,500,000 baht
- [`references/sources.md`](references/sources.md) — sources and check dates (2026-10-26)


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
| Money market fund (กองทุนรวมตลาดเงิน) | The fund's assets (short deposits, bills) | **No** — no mutual fund unit is | Usually next business day (T+1), check the prospectus | Gains on fund units: see `tax-basics-th` |

DPA limit and what it covers: `emergency-fund` "Deposit protection".


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

# Sources · bonds-and-deposits

## Products, DPA, tax

ตรวจล่าสุด 2026-10-26 · คุ้มครองเงินฝาก แหล่ง: https://www.dpa.or.th/News/kar-prab-wngngein-khumkhrxng-thi-1-lan-bath , https://www.dpa.or.th/Protected-Financial-Products , https://www.bot.or.th/th/satang-story/rights-responsibility/savings-book.html , https://www.bangkokbiznews.com/news/952780 · ดอกเบี้ยออมทรัพย์ 20,000 แหล่ง: https://www.krungsri.com/th/about-krungsri/about-us/overview/announce/exemption-tax-interest-savings-deposit , https://www.finnomena.com/?p=138665 , https://www.bangkokbiznews.com/finance/investment/1040107 · ฝากประจำปลอดภาษี แหล่ง: https://www.rd.go.th/30666.html , https://www.scb.co.th/th/personal-banking/deposits/long-term-deposit-accounts/bonus-fixed-account-24-months , https://www.gsb.or.th/personals/fixed-deposit/ · ฝากประจำหัก 15% มี 2 แหล่ง (krungsri.com · bangkokbiznews) · กองทุนตลาดเงิน T+1 มีแหล่งเดียว (รอยืนยัน ต่อกอง)

## Corporate bonds

ตรวจล่าสุด 2026-10-26 · แหล่ง: https://www.sec.or.th/TH/Pages/Investors/education-debt-CR.aspx , https://www.thaibma.or.th/pdf/Article/Credit%20Rating%20Symbol.pdf , https://www.trisrating.com/ , https://www.thaibma.or.th/pdf/Article/thaibond/27.pdf

## Rate risk

Idea: `fixed-income-portfolio` from LSEG, a third-party skill in anthropics/financial-services partner-built (Apache-2.0 repository, viewed 2026-11-10); only the textbook duration formula and the ladder table are used, no LSEG data or tools.


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


---

# skill: home-refinance

Use when a Thai home loan rate ends or weighing refinance

# Home Refinance (รีไฟแนนซ์บ้าน · ขอลดดอกเบี้ยธนาคารเดิม) — compare refinance, retention, and staying put in baht

General information, not financial advice; every fee and rate is confirmed with the bank in writing before the user signs.

> **One rule:** compare both paths in baht over the same months, with every fee counted — never compare headline rates alone.

## Use when
- Promo or fixed rate ending · "the rate jumped" · another bank's offer · "refinance or retention?"
- Not for: card, cash card, or personal loan debt, or several debts and which to pay first → `debt-payoff` · credit report problems blocking a new loan → `credit-bureau` · choosing a house or a first mortgage → not covered, ask the bank's loan officer

## Steps
1. **Collect from the contract and latest statement:** balance, current rate, monthly payment, months since signing, penalty clause.
2. **Get written offers:** the current bank's retention rate and fee; 1–2 other banks' rates for each year and the rate after the promo (usually MRR − x). MRR (Minimum Retail Rate) is each bank's own floating rate for prime retail customers, and most home loans after the promo are "MRR − x%". Banks usually move MRR after a Bank of Thailand (BOT) policy-rate decision, but not by the same amount or on the same day.
3. **Look up live (WebSearch/WebFetch) before quoting,** and mark the value (รอยืนยัน) if the page will not open: BOT policy rate https://www.bot.or.th/th/our-roles/monetary-policy/mpc-meeting.html · the user's bank's MRR from its lending-rate table, e.g. https://www.bangkokbank.com , https://www.kasikornbank.com , https://www.ttbbank.com/th/rates/loan-interest-rates · whether a government mortgage-registration fee cut is in force (rate, price cap, end date, whether it covers refinance): sources are news only, so confirm with the Land Office. A cut has applied only when purchase and mortgage are registered together; reports say a refinance pays the normal 1% (รอยืนยัน).
4. **Use these path facts** (checked 2026-10-26, sources and conflicts: [`references/sources.md`](references/sources.md)):

   | | Refinance (ย้ายธนาคาร) | Retention (ขอลดกับธนาคารเดิม) |
   |---|---|---|
   | When | Usually after 3 years; earlier costs a prepayment penalty, often **about 3%** of remaining principal (some banks 1–3%, some lock 5 years: read the contract) | After 3 years or when the promo ends; start asking 1–2 months before |
   | Fees | Mortgage registration **1%** of the new mortgage · stamp duty **0.05%, max 10,000 baht** · appraisal (GSB 2,000–3,700 baht) · fire insurance if a new policy is required · new bank may waive some | Retention fee: no official figure; sources quote 0–2% of the balance (รอยืนยัน with your bank) |
   | Paperwork | New credit check, income documents, Land Office visit | A form at the current bank |
   | Lock after | New 3-year prepayment penalty | Often a new lock period: ask |

5. **Simulate the same months N (normally 36) with the same monthly payment** for each path: interest paid and balance left. Run `refinance.mjs compare` (below).
6. **Add each path's one-off costs.** Break-even (months) = total cost of moving (minus the baseline's own cost) ÷ interest saved per month, where interest saved per month = (interest over N months on the old path − on the new path) ÷ N. If saving ≤ 0, not worth it. Compare totals too: interest over N months + one-off costs, per path.
7. **Look past the promo:** compare the rate from year 4 (MRR − x) at each bank.
8. **Lay out the table; the user decides,** and no bank is named "the best". If cash is short, ask whether the new bank adds fees to the loan (it raises the balance).

**Formulas:** monthly payment PMT = P × r ÷ (1 − (1 + r)^−n), with P = loan, r = yearly rate ÷ 12, n = number of payments (if r = 0 → P ÷ n) · each month interest = balance × r, new balance = old balance + interest − payment.

**Script** (Node only, no dependencies):
```
node refinance.mjs pmt <loan> <yearly rate %> <payments>
node refinance.mjs compare <file.json> [--json]     # example file: scripts/example.json
node refinance.mjs scenarios <file.json>            # example: scripts/scenarios-example.json -> JSON for decide.mjs payoff
node refinance.mjs --self-test
```
Path: installed from the marketplace `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/home-refinance/scripts/refinance.mjs | sort -V | tail -1` · in the repo `plugins/trading-finance/skills/home-refinance/scripts/refinance.mjs`.

Input fields `balance`, `payment`, `months`, `stay.rate` and each option's `rate` and `cost` must be finite numbers, with `months` above 0; a bad field stops the script with a message naming it. A rate below 1 gets a warning (it may have been typed as a decimal instead of %). A stepped rate (promo then MRR − x) goes in `rates` instead of `rate`: `[{ "months": 36, "rate": 3.2 }, { "rate": 5.5, "floating": true }]`; the last step runs to month N. `baseline` (optional) names the option to compare against; the default is staying put.

**If the rate after the promo is uncertain,** use `decision-desk/decision-scoring`, command `payoff` (script path: see `decision-desk/decision-scoring`). Options = refinance · retention · stay put; scenarios = MRR up · flat · down. `refinance.mjs scenarios <file.json>` writes the whole table with `better` = `low`: each scenario adds its `shift` to the steps marked `floating` (run 2026-10-28 on `scripts/scenarios-example.json`: refinance regret 0 · retention 59,409 · stay 380,279). If scenario probabilities are unknown, read the "smallest maximum regret" (minimax regret) column; do not guess probabilities. If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), or for any home-loan decision, the output is information and the user decides.

## Check before done
- Both paths over the same months and the same payment
- Every fee listed, with (รอยืนยัน) where the bank has not confirmed it in writing
- Rate after the promo shown, not only the first 3 years
- The user picks; no bank named as "the best"

## References
- [`references/worked-example.md`](references/worked-example.md) — open when you need a model of the comparison table
- [`references/sources.md`](references/sources.md) — sources, check dates, and conflicting figures for fees


## reference: sources.md

# Sources · home-refinance

ตรวจล่าสุด 2026-10-26 · ค่าปรับและค่าจดจำนอง แหล่ง: https://www.gsb.or.th/media/2024/01/sale-sheet-สินเชื่อเคหะ.pdf , https://www.scb.co.th/th/personal-banking/stories/home-car/home-retention , https://www.krungsri.com/th/krungsri-the-coach/loan/mortgages/home-refinance-fees-guide , https://www.ktc.co.th/article/lifestyle/home-decoration/house-refinance-costs · อากร 0.05% สูงสุด 10,000 มีแต่แหล่งไม่ทางการ 3 แหล่ง (ktc · krungsri the coach · https://www.bangkokbiznews.com/finance/investment/1073962) รอยืนยันกับกรมสรรพากร · ค่ารีเทนชั่น https://www.krungsri.com/th/krungsri-the-coach/loan/mortgages/refinance-vs-retention-percent-interest , https://www.ktc.co.th/article/lifestyle/home-decoration/what-is-retention (ตัวเลขขัดกัน)

Registration-fee cut (news only, confirm with the Land Office): https://www.thaipbs.or.th/news/content/507690 , https://www.prachachat.net/politics/news-2030776


## reference: worked-example.md

# Worked example · home-refinance

Open this when you need a model of the comparison table.

Balance 2,400,000 after exactly 3 years (no penalty). Payment kept at 18,000 a month. Floating rate 6.5% (ตัวอย่าง, not a current MRR). Offer A: other bank, 3-year average 3.2%. Offer B: current bank 4.0% for a 1% fee. Fees are ตัวอย่าง until confirmed.

| Over 36 months | Stay (6.5%) | B · Retention (4.0%) | A · Refinance (3.2%) |
|---|---|---|---|
| Interest paid | 449,842 | 266,184 | 210,310 |
| One-off cost | 0 | fee 1% = 24,000 | registration 24,000 + stamp duty 1,200 + appraisal about 3,000 = 28,200 |
| Interest + cost | 449,842 | 290,184 | 238,510 |
| Balance left | 2,201,842 | 2,018,184 | 1,962,310 |

Refinance costs 4,200 more up front than retention and saves about 1,550 interest a month against it, so it breaks even in about 3 months (4,200 ÷ 1,550) and is about 51,700 ahead after 3 years. Before choosing, compare each bank's rate from year 4 (MRR − x) and the new 3-year lock. (Monthly simulation, computed here 2026-10-26 and rerun with `refinance.mjs compare scripts/example.json` 2026-10-27: interest 449,842 · 266,184 · 210,310.)
