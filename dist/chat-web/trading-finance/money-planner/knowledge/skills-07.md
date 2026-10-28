# skill: bonds-and-deposits

Use when choosing between Thai fixed deposits, government savings bonds, corporate bonds (หุ้นกู้) or money market funds for a lump sum or safe money.

# Bonds and Deposits (เงินฝาก · พันธบัตรออมทรัพย์ · หุ้นกู้)

General information, not investment advice. How big the emergency fund is and where its layers sit is `emergency-fund`; bond mutual funds are compared in `mutual-fund-picker`; tax on interest in the yearly return is `tax-basics-th`.

> **One rule:** a higher rate on "safe" money always means more risk or less access — name which one before comparing rates.

## Use when / not when

| Situation | Use |
|---|---|
| "Fixed deposit or savings bond?" · "is this 6% หุ้นกู้ safe?" · "where do I park 1.5 million?" | this skill |
| How many months of emergency money | `emergency-fund` first |
| Stocks, equity funds, rebalancing a mix | `mutual-fund-picker` · `rebalance-and-dca` |
| A "bond" or "deposit" paying a guaranteed high return through a LINE group or personal account | `scam-check` |

## 1 · The choices side by side

| Product | Who stands behind it | Protected by the Deposit Protection Agency (DPA, สคฝ.)? | Access | Tax on interest |
|---|---|---|---|---|
| Savings account | The bank | Yes | Instant | Tax-free if all savings interest across all banks is ≤ 20,000 baht a year **and** the user consents to the bank sending data to the Revenue Department; otherwise 15% withheld from the first baht |
| Fixed deposit (ฝากประจำ) | The bank | Yes | Early withdrawal loses some interest | 15% withheld |
| Tax-free fixed deposit (ฝากประจำปลอดภาษี) | The bank | Yes | Fixed monthly deposit, at least 24 months, ≤ 25,000 a month, ≤ 600,000 in total, one account per person across all banks, at most 2 missed months; early close pays savings rate and is taxed | Tax-free if the rules are kept |
| Government savings bond (พันธบัตรออมทรัพย์) | Ministry of Finance (Public Debt Management Office, PDMO) | No — but it is a direct government debt | Locked to maturity; the wallet issue can be transferred or sold only from a set date and only inside the wallet | 15% withheld |
| Corporate bond (หุ้นกู้) | The company only | **No** | Sell before maturity only if a buyer exists; often hard and at a loss | 15% withheld |
| Money market fund (กองทุนรวมตลาดเงิน) | The fund's assets (short deposits, bills) | **No** — no mutual fund unit is | Usually next business day (T+1), check the prospectus | Gains on fund units: see `tax-basics-th` |

DPA covers up to **1,000,000 baht per depositor per bank**, all Thai-baht savings, current, fixed deposits, certificates of deposit and deposit receipts at that bank combined. It does **not** cover foreign-currency deposits, bills of exchange (ตั๋วแลกเงิน), bonds, corporate bonds or fund units. Above 1 million, spread across banks.

ตรวจล่าสุด 2026-10-26 · คุ้มครองเงินฝาก แหล่ง: https://www.dpa.or.th/News/kar-prab-wngngein-khumkhrxng-thi-1-lan-bath , https://www.dpa.or.th/Protected-Financial-Products , https://www.bot.or.th/th/satang-story/rights-responsibility/savings-book.html , https://www.bangkokbiznews.com/news/952780 · ดอกเบี้ยออมทรัพย์ 20,000 แหล่ง: https://www.krungsri.com/th/about-krungsri/about-us/overview/announce/exemption-tax-interest-savings-deposit , https://www.finnomena.com/?p=138665 , https://www.bangkokbiznews.com/finance/investment/1040107 · ฝากประจำปลอดภาษี แหล่ง: https://www.rd.go.th/30666.html , https://www.scb.co.th/th/personal-banking/deposits/long-term-deposit-accounts/bonus-fixed-account-24-months , https://www.gsb.or.th/personals/fixed-deposit/ · ฝากประจำหัก 15% มี 2 แหล่ง (krungsri.com · bangkokbiznews) · กองทุนตลาดเงิน T+1 มีแหล่งเดียว (รอยืนยัน ต่อกอง)

## 2 · Government savings bonds

- Sold in rounds. Each round sets its own rates, tenors, minimums, caps and channels — **read the round's "รู้ก่อนซื้อ" sheet from PDMO before quoting any number.**
- Channels: the เป๋าตัง app (สบม. wallet) and agent banks / Bond Connect, depending on the round.
- Example round, for shape only: ออมพลัส fiscal year 2570 round 1 — 3 years 1.80%, 10 years 2.80% fixed; wallet sale 26 Oct–13 Nov 2569, bank channel 27–29 Oct 2569 (bot.or.th sale page; rates and 26 Oct start rechecked in news 2026-10-26: https://www.naewna.com/n/?p=109617 , https://infoquest.co.th/2026/662598 — the wallet quota was reported as 2,000 million of a 4,000 million total, so read the PDMO sheet). The wallet round of July 2569 sold from 100 baht in steps of 100, capped at 3 million baht a time and 50 million per person, and could be transferred only from 31 Jan 2570. Caps change every round (an earlier wallet round capped 20 million).
- Interest is 15% withheld each payment.

ตรวจล่าสุด 2026-10-26 · แหล่ง: https://www.bot.or.th/th/our-services/bond-and-debt-securities-services/Saving-Bond-Sale.html , https://backend.pdmo.go.th/uploads/documents/2026/Jul/20260723165731_8729.pdf (รู้ก่อนซื้อ รุ่นวอลเล็ต ก.ค. 2569) · รุ่นนี้มีแหล่งทางการเป็นหลัก สื่อยืนยัน 1 แหล่ง (infoquest.co.th/2026/662598) จึงถือเป็นตัวอย่าง ไม่ใช่ตัวเลขที่ใช้ซื้อ (รอยืนยัน ทุกรุ่น)

## 3 · Corporate bonds — read before buying

1. **Credit rating** — investment grade is AAA down to BBB- (TRIS Rating, Fitch Thailand). Below BBB- or unrated is high-yield; Thai high-risk bonds are reported to carry the words "เสี่ยงสูง" in their name (รอยืนยัน). Check the rating and its trend on ThaiBMA (thaibma.or.th).
2. **Why the rate is high** — compare with a government bond of the same tenor. The gap is the price of the company's default risk.
3. **Liquidity** — plan to hold to maturity; selling early may be slow and below par.
4. **Concentration** — no single issuer above about 10% of the user's safe money (rule of thumb, not regulation).
5. **Not deposits** — the bank selling a corporate bond is only the seller; DPA does not cover it.

Who may buy unrated or high-yield bonds is restricted by SEC rules; the exact current rule was not confirmed (รอยืนยัน — check sec.or.th before telling a user they can or cannot buy).

ตรวจล่าสุด 2026-10-26 · แหล่ง: https://www.sec.or.th/TH/Pages/Investors/education-debt-CR.aspx , https://www.thaibma.or.th/pdf/Article/Credit%20Rating%20Symbol.pdf , https://www.trisrating.com/ , https://www.thaibma.or.th/pdf/Article/thaibond/27.pdf

## Workflow

1. Split the money: emergency part (`emergency-fund`) · money needed within 1–3 years · money that can be locked longer.
2. Emergency part: savings and money market fund only.
3. 1–3 year money: fixed deposits across banks (each ≤ 1 million), savings bonds of matching tenor, short government bond fund.
4. Longer money: longer savings bonds; corporate bonds only investment grade, spread, and only what the user can hold to maturity.
5. Show the table with after-tax interest in baht for the user's real amount (formula: amount × rate × (1 − 0.15) × years, for products with 15% withheld; run `node money-calc.mjs afterTax <file.json>`, script in `portfolio-snapshot`, see its Script path; example `../portfolio-snapshot/scripts/examples/afterTax.json`: 500,000 at 1.80% for 3 years → 22,950 after tax, 1.53% a year). Score the options that survive the hard rules below. The user picks.

## Scoring the options

Use `decision-scoring`, command `score`. Script path: see `decision-scoring` (superuser plugin). Score only the money that passed the split in Workflow steps 1–4. The emergency part is not scored (savings and money market fund only).

| Step | Value |
|---|---|
| Hard rules (`must`) | Lock period (months) not longer than the time the user will not touch this money · deposit per bank at most 1,000,000 · corporate bond rated BBB- or better, with one issuer at most about 10% of the safe money (item 4, Concentration, in the bond checks above) |
| Criterion 1 | Interest after tax, % a year · `high` · proposed weight 0.5 |
| Criterion 2 | Covered by the Deposit Protection Agency (DPA, สคฝ.): 1 = yes, 0 = no · `high` · 0.3 |
| Criterion 3 | Lock period, months · `low` · 0.2 |

Weights are starting values the user can change (starting value, not yet measured). Every rate needs a source and a date; if unknown, write (รอยืนยัน) and leave that option out until confirmed. If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), the user chooses. A high score driven by a high rate means more risk or harder access, so name the criterion that pulls the score every time.

## Worked example

1,500,000 baht in one bank's savings account; essential spending 25,000 a month; may need part of it within 2 years.

| Part | Amount | Where | Why |
|---|---|---|---|
| Emergency (6 months) | 150,000 | Savings at main bank | Instant access, protected |
| Short-term | 850,000 | Fixed deposits split over 2 banks (e.g. 500,000 + 350,000) | Every bank under 1 million protected |
| Locked 3+ years | 500,000 | Savings bond 3-year round, or investment-grade corporate bonds split over at least 3 issuers | Higher rate; the bond part is not DPA-protected — the user decides |

Rates are filled in from each bank's and PDMO's page on the day, with the date (ตัวอย่าง: no rate here is a quote).

## Check before sending

- Every product says whether DPA protects it
- No deposit above 1 million at one bank without saying so
- Every rate has a source page and date, or is marked (รอยืนยัน)
- Corporate bonds show rating, issuer and liquidity, not just the rate


---

# skill: home-refinance

Use when a Thai home loan's fixed or promo rate ends, the user asks refinance vs retention (รีไฟแนนซ์ · รีเทนชั่น), or what MRR means for their loan.

# Home Refinance (รีไฟแนนซ์บ้าน · ขอลดดอกเบี้ยธนาคารเดิม)

General information, not financial advice; every fee and rate is confirmed with the bank in writing before the user signs. Several debts and which to pay first is `debt-payoff`; turning card debt into home debt is covered there as a warning.

> **One rule:** compare both paths in baht over the same months, with every fee counted — never compare headline rates alone.

## Use when / not when

| Situation | Use |
|---|---|
| Promo or fixed rate ending · "the rate jumped" · another bank's offer · "refinance or retention?" | this skill |
| Card, cash card or personal loan debt | `debt-payoff` |
| Credit report problems blocking a new loan | `credit-bureau` |
| Choosing a house or a first mortgage | not covered — ask the bank's own loan officer |

## 1 · Rate words

| Term | Meaning |
|---|---|
| MRR (Minimum Retail Rate) | Floating rate for prime retail customers; most home loans after the promo are "MRR − x%" |
| MLR (Minimum Loan Rate) | Term loans to prime large companies |
| MOR (Minimum Overdraft Rate) | Overdrafts to prime large companies |
| BOT policy rate | Bank of Thailand rate; banks move MRR with it but set their own levels |

Each bank sets its own MRR. Examples: Bangkok Bank 6.50% (from 26 Feb 2569), KBank 6.58% and ttb 7.105% (from 2 Mar 2569, rechecked on ttbbank.com 2026-10-26). BOT policy rate 1.00% since 25 Feb 2569 (held at 1.00% on 26 Aug 2569 per Naewna and Kaohoon news; BOT meeting page lists the next meeting on 28 Oct 2569 and then 23 Dec 2569), so read the bank's current rate table on the day.

ตรวจล่าสุด 2026-10-26 · แหล่ง: https://www.bangkokbank.com (ตารางอัตราดอกเบี้ยเงินให้สินเชื่อ 26 ก.พ. 2569) , https://www.kasikornbank.com/th/rate/LendingPDF/lending-02032026-th.pdf , https://www.ttbbank.com/th/rates/loan-interest-rates , https://www.infoquest.co.th/2026/572846 · ดอกเบี้ยนโยบาย https://www.bot.or.th/th/our-roles/monetary-policy/mpc-meeting.html , https://www.thaipbs.or.th/news/content/509928 · MRR ของแต่ละธนาคารมาจากตารางของธนาคารเองแหล่งเดียวต่อธนาคาร (เป็นแหล่งทางการ)

## 2 · The two paths

| | Refinance (ย้ายธนาคาร) | Retention (ขอลดกับธนาคารเดิม) |
|---|---|---|
| When | Usually after 3 years; leaving earlier costs a prepayment penalty, often **about 3%** of the remaining principal (some banks 1–3%, some lock 5 years — read your contract) | After 3 years or when the promo ends; start asking 1–2 months before |
| Fees | Mortgage registration **1%** of the new mortgage · stamp duty **0.05%, max 10,000 baht** · appraisal (GSB 2,000–3,700 baht) · fire insurance if a new policy is required · new bank may waive some | Retention fee: no official figure; banks and articles quote 0–2% of the balance (รอยืนยัน with your bank) |
| Paperwork | New credit check, income documents, Land Office visit | A form at the current bank |
| Lock after | New 3-year prepayment penalty | Often a new lock period — ask |

The government cut of the mortgage fee to 0.01% (homes ≤ 7 million baht, until 30 Jun 2570) applies when the purchase and mortgage are registered together; reports say a refinance pays the normal 1% (รอยืนยัน with the Land Office).

ตรวจล่าสุด 2026-10-26 · ค่าปรับและค่าจดจำนอง แหล่ง: https://www.gsb.or.th/media/2024/01/sale-sheet-สินเชื่อเคหะ.pdf , https://www.scb.co.th/th/personal-banking/stories/home-car/home-retention , https://www.krungsri.com/th/krungsri-the-coach/loan/mortgages/home-refinance-fees-guide , https://www.ktc.co.th/article/lifestyle/home-decoration/house-refinance-costs · อากร 0.05% สูงสุด 10,000 มีแต่แหล่งไม่ทางการ 3 แหล่ง (ktc · krungsri the coach · https://www.bangkokbiznews.com/finance/investment/1073962) รอยืนยันกับกรมสรรพากร · ค่ารีเทนชั่น https://www.krungsri.com/th/krungsri-the-coach/loan/mortgages/refinance-vs-retention-percent-interest , https://www.ktc.co.th/article/lifestyle/home-decoration/what-is-retention (ตัวเลขขัดกัน) · ค่าจดจำนอง 0.01% https://www.thaipbs.or.th/news/content/507690 , https://www.prachachat.net/politics/news-2030776

## Workflow

1. From the contract and latest statement: balance, current rate, monthly payment, months since signing, penalty clause.
2. Get written offers: the current bank's retention rate and fee; 1–2 other banks' rates for each year and the rate after the promo (usually MRR − x).
3. Simulate the same months N (normally 36) with the same monthly payment for each path: interest paid and balance left. Run `refinance.mjs compare` (section "Formulas and script" below).
4. Add each path's one-off costs. **Break-even (months) = total cost of moving ÷ interest saved per month**, where interest saved per month = (interest over N months on the old path − interest over N months on the new path) ÷ N. Compare the totals too: interest over N months + one-off costs, per path.
5. Look past the promo: compare the rate in year 4 onward (MRR − x) at each bank.
6. Lay out the table; the user decides. If cash is short, ask whether the new bank adds fees to the loan (it raises the balance).

## Formulas and script

| What | Formula |
|---|---|
| Monthly payment (reducing balance) | PMT = P × r ÷ (1 − (1 + r)^−n) · P = loan amount · r = yearly rate ÷ 12 · n = number of payments · if r = 0 → P ÷ n |
| Interest over N months | Each month: interest = balance × r · new balance = old balance + interest − payment · sum the interest over N months |
| Break-even (months) | total cost of moving (minus the baseline's own cost) ÷ interest saved per month (if saving ≤ 0 → not worth it) |
| Compare | Interest over the holding period + one-off costs, per path · the lowest total is best for that period |

```
node refinance.mjs pmt <loan> <yearly rate %> <payments>
node refinance.mjs compare <file.json> [--json]     # example file: scripts/example.json
node refinance.mjs scenarios <file.json>            # example: scripts/scenarios-example.json -> JSON for decide.mjs payoff
node refinance.mjs --self-test
```

Input fields `balance`, `payment`, `months`, `stay.rate` and each option's `rate` and `cost` must be finite numbers, with `months` above 0; a bad field stops the script with a message naming it. A rate below 1 gets a warning (it may have been typed as a decimal instead of %). A stepped rate (promo then MRR − x) goes in `rates` instead of `rate`: `[{ "months": 36, "rate": 3.2 }, { "rate": 5.5, "floating": true }]`; the last step runs to month N. `baseline` (optional) names the option to compare against; the default is staying put.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/home-refinance/scripts/refinance.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/home-refinance/scripts/refinance.mjs` · Node only, no dependencies.

**Rate after the promo is uncertain** (MRR can rise or fall): use `decision-scoring`, command `payoff`. Options = refinance · retention · stay put; scenarios = MRR up · flat · down (`refinance.mjs scenarios <file.json>` writes the whole table with `better` = `low`: each scenario adds its `shift` to the steps marked `floating`; run 2026-10-28 on `scripts/scenarios-example.json`: refinance regret 0 · retention 59,409 · stay 380,279). If the probability of each scenario is unknown, read the "smallest maximum regret" (minimax regret) column; do not guess probabilities. Script path: see `decision-scoring` (superuser plugin). If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), or for any home-loan decision, the output is information and the user decides.

## Worked example

Balance 2,400,000 after exactly 3 years (no penalty). Payment kept at 18,000 a month. Current floating rate about 6.5%. Offer A: other bank, 3-year average 3.2%. Offer B: current bank 4.0% for a 1% fee. Fees are ตัวอย่าง until confirmed.

| Over 36 months | Stay (6.5%) | B · Retention (4.0%) | A · Refinance (3.2%) |
|---|---|---|---|
| Interest paid | 449,842 | 266,184 | 210,310 |
| One-off cost | 0 | fee 1% = 24,000 | registration 24,000 + stamp duty 1,200 + appraisal about 3,000 = 28,200 |
| Interest + cost | 449,842 | 290,184 | 238,510 |
| Balance left | 2,201,842 | 2,018,184 | 1,962,310 |

Refinance costs 4,200 more up front than retention and saves about 1,550 interest a month against it, so it breaks even in about 3 months (4,200 ÷ 1,550) and is about 51,700 ahead after 3 years. Before choosing, compare each bank's rate from year 4 (MRR − x) and the new 3-year lock. (Monthly simulation, computed here 2026-10-26 and rerun with `refinance.mjs compare scripts/example.json` 2026-10-27: interest 449,842 · 266,184 · 210,310.)

## Check before sending

- Both paths over the same months and the same payment
- Every fee listed, with (รอยืนยัน) where the bank has not confirmed it in writing
- Rate after the promo shown, not only the first 3 years
- The user picks; no bank named as "the best"
