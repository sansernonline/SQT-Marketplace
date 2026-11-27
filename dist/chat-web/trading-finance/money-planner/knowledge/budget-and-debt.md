# skill: budget-and-debt

Use for a budget, emergency fund, debts, credit report or refinance

# budget-and-debt — monthly budget, emergency fund, debt and home loan

> **One rule:** work from 2 to 3 months of the user's real statements, and compare every option in baht over the same months with every fee counted.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Salary runs out early, or making a monthly budget | [references/personal-budget.md](references/personal-budget.md) |
| Sizing an emergency fund or where to keep it | [references/emergency-fund.md](references/emergency-fund.md) |
| Several debts, snowball or avalanche order | [references/debt-payoff.md](references/debt-payoff.md) |
| A loan was refused, or checking an NCB credit report | [references/credit-bureau.md](references/credit-bureau.md) |
| A Thai home loan rate ends, or weighing a refinance | [references/home-refinance.md](references/home-refinance.md) |

Worksheet and worked numbers: [references/budget-worksheet.md](references/budget-worksheet.md), [references/worked-example.md](references/worked-example.md). Scripts: `scripts/payoff.mjs` (debt order) and `scripts/refinance.mjs` (home loan).

## Steps every part shares

1. Collect the real numbers from bank statements, e-wallet history and card statements; never use the user's guess of their own spending.
2. Run the script in `scripts/` for any payoff or refinance total instead of working it out by hand.
3. Show the options side by side in a table, and let the user choose.

## Check before done

- General information, not financial advice. For a lawsuit or wage garnishment, the user asks a lawyer or the bank's debt team.
- Never suggest a new loan to pay the minimum on existing debts.
- The emergency fund is never kept in stocks, crypto, long-term funds, RMF, ThaiESG or lent to friends.
- Every fee and rate in a refinance is confirmed with the bank in writing before the user signs.
- Read the user's own credit report before guessing why a loan was refused; a lender needs the user's consent to view it.

Whole job with several steps → playbook [money-plan](../superuser/references/playbook-money-plan.md).


## reference: budget-worksheet.md

# Monthly budget worksheet

## 1. Take-home pay

```
Gross salary                         ______
− Social security (5%, max 875)      ______
− PVD contribution                   ______
− Withholding tax (payslip)          ______
+ Regular side income                ______
= Take-home                          ______
```

## 2. Last 3 months actual (from statements)

| Category | Envelope | Month 1 | Month 2 | Month 3 | Average |
|---|---|---|---|---|---|
| Rent / home loan | Needs | | | | |
| Utilities (electricity, water, internet) | Needs | | | | |
| Food at home | Needs | | | | |
| Transport | Needs | | | | |
| Phone | Needs | | | | |
| Insurance premiums (monthly equivalent) | Needs | | | | |
| Minimum debt payments | Needs | | | | |
| Family support | Needs | | | | |
| Eating out / delivery | Wants | | | | |
| Subscriptions | Wants | | | | |
| Shopping | Wants | | | | |
| Social obligations (ซอง) | Wants | | | | |
| Instalments / BNPL | Wants (or Needs if contracted) | | | | |
| Emergency fund | Savings | | | | |
| Extra debt payment | Savings | | | | |
| Investment | Investment | | | | |

## 3. Plan

| Envelope | Plan baht | % | Account it lives in |
|---|---|---|---|
| Needs | | | |
| Wants | | | |
| Savings | | | |
| Investment | | | |

Payday standing order: ______ baht on day ___ → account ______

## 4. Annual bills (sinking fund ÷ 12)

| Bill | Annual | Monthly set-aside | Due month |
|---|---|---|---|
| Car insurance + tax (พ.ร.บ.) | | | |
| Life / health insurance (annual premium) | | | |
| School fees | | | |
| Festivals (สงกรานต์, ปีใหม่, ตรุษจีน) | | | |

## 5. Monthly review (10 minutes)

```
Month ____   Over plan: ______ by ______   Under plan: ______
Leak found: ______ (baht/month) → action ______
Payday transfer done? Y/N    One fix for next month: ______
```


## reference: credit-bureau.md

<!-- merged from skill `credit-bureau` on 2026-11-27 · description was: Use when a loan is refused or checking an NCB report -->
# Credit Bureau (เครดิตบูโร · reading your own credit report)

Paying debts down is `debt-payoff.md`; a "credit repair" agent asking for a fee is `scam-check`.

> **One rule:** read the user's own report before guessing why a loan was refused — the report, not a rumour, shows what lenders see.

## Use when / not when

| Situation | Use |
|---|---|
| Loan refused · "am I blacklisted?" · "how do I check my credit?" · a wrong entry on the report | this skill |
| Several debts to pay off, which first | `debt-payoff.md` |
| Someone offers to "clean" a credit record for money | `scam-check` |
| Home loan rate after 3 years | `home-refinance.md` |

## 1 · Facts that clear up the myths

| Myth | What the National Credit Bureau (NCB) says |
|---|---|
| "I am on the blacklist" | NCB has no blacklist. It stores and reports payment history; it does not approve or refuse loans. The lender decides. |
| "Bad history stays for life" | Data is kept for **3 years**; the report shows **36 months** of monthly payment history. Old late payments drop off over time. |
| "Checking my own report hurts my score" | Checking your own report any number of times does not affect lending (2 non-official sources, รอยืนยัน). |
| "The bank can look whenever it likes" | Member lenders send data every month without asking you, but a lender needs **your consent** to view your report. |

## 2 · How to get your own report

| Channel | Result | Fee |
|---|---|---|
| NCB counters (The Nine Rama 9, BTS Sala Daeng, J-Venue Navanakorn) | Printed, about 15 minutes | **100 baht** |
| Bank counters (Krungthai, Krungsri, GHB, BAAC), Krungthai ATM, Krungsri app, any post office | Registered mail within 7 working days | **150 baht** |
| Bank and wallet apps on NCB's list (e.g. Bangkok Bank mobile, KKP Mobile, Krungthai NEXT, MyMo, BAAC Mobile, ttb touch, เป๋าตัง) | Report by email, instant to 24 hours | 150 baht; with credit score 200 baht (รอยืนยัน — 2 non-official sources) |
| ทางรัฐ app and NCB kiosks | Free summary report | Free |
| Refused a loan | Full report free within 30 days of the refusal letter | Free |

The list of apps changes; check NCB's "where to check" page before naming one. The free summary at post offices is listed as "temporarily suspended" on one NCB page and available on another (รอยืนยัน).

## 3 · Reading the report

- **Account section** — lender, type, limit, balance, open and close dates.
- **Status of account** — the lines to read first. Commonly printed codes (2 non-official sources; NCB publishes the list only as an image, รอยืนยัน):

| Code | Meaning |
|---|---|
| 10 (010) | Normal, nothing over 90 days overdue |
| 11 | Closed |
| 12–14 | Payment holiday (lender, government or farm policy) |
| 20 | Over 90 days overdue |
| 30–33 | Legal process · court settlement · dismissed or time-barred · written off |
| 40–44 | Paying to close · under dispute or review · debt sold or transferred · transferred debt paid off |

- **Payment history (36 months)** — each month shows days overdue. Lenders look hardest at the last 6–12 months.

## 4 · Disputing wrong data

1. Mark the wrong line on your report and gather proof (receipt, closing letter, settlement).
2. File the dispute **either** at an NCB centre or by post (form from ncb.co.th, ID copy, the report) **or** directly with the lender that owns the account.
3. You get an answer **within 30 days**. Only the lender can correct the data; NCB cannot, except on a court or committee order.
4. If not resolved, ask for a dispute note on the report and appeal to the Credit Information Protection Committee (คณะกรรมการคุ้มครองข้อมูลเครดิต) under the Credit Information Business Act B.E. 2545.

## 5 · Improving what lenders see

- Pay every account by the due date from now on; the next 12 months matter most.
- An account overdue 90+ days: talk to the lender about restructuring (`debt-payoff.md`) — "paying to close" (code 40) then closed reads better than an open default.
- Keep card usage well below the limit; do not open several new accounts just before a big loan.
- Anyone selling a "clean record" or deleting history for a fee is a scam — only the lender can correct real errors, and true history cannot be erased.

## Check before sending

- No "blacklist" wording in the advice
- Fees and channels have the date checked
- Dispute steps name the 30-day answer and that only the lender corrects data
- No fee-based "credit repair" suggested

## References

- [`worked-example.md`](credit-bureau/worked-example.md) — open for a model case from refusal letter to plan
- [`sources.md`](credit-bureau/sources.md) — NCB and Bank of Thailand pages with check dates; open before quoting a fee, channel or time limit


## reference: debt-payoff.md

<!-- merged from skill `debt-payoff` on 2026-11-27 · description was: Use when several debts or snowball vs avalanche -->
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
| Credit card minimum payment | A % of the balance set by BOT for a stated period; look it up live (below) |

Credit card minimum payment: look up the current BOT minimum % and the date it applies until live (WebSearch/WebFetch) before quoting, at https://www.bot.or.th/th/news-and-media/news/news-20251204-2.html or a newer BOT notice; if the page will not open, mark the value (รอยืนยัน).

A lender charging above these, or an unlicensed lender (เงินกู้นอกระบบ), is outside the rules — informal loans above 15% per year are illegal under the Civil and Commercial Code (ป.พ.พ. ม.654) and the 2560 loan-interest act; report to police or **1359**, the ศูนย์รับแจ้งการเงินนอกระบบ สำนักงานเศรษฐกิจการคลัง (office hours; 1359.go.th, ตรวจ 2026-10-26 · https://www.1359.go.th/contact/ , https://www.thansettakij.com/finance/489385).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.bot.or.th/th/news-and-media/news/news-20251204-2.html , https://www.prachachat.net/finance/news-1368667 · เพดาน 16/25/24/33% ตรวจล่าสุด 2026-10-25 · แหล่ง: https://www.bot.or.th/content/dam/bot/documents/th/our-services/bot-license-check/interest.pdf (ประกาศ ธปท. สนส. 11-13/2563 · เช่าซื้อ 10/15/23% อยู่ในเอกสารเดียวกัน ตรวจ 2026-10-25 แหล่งเดียว) , https://www.thairath.co.th/money/personal_finance/finance_banking/2843164 , https://www.sawad.co.th/article/legal-interest-rates-and-calculation (25/24/33%) , https://www.tcc.or.th/credit-card-interest/ (16%)

## Workflow

1. **List every debt**: lender, balance, rate, minimum payment, overdue status. Use statements, not memory.
2. **Stop the bleeding**: no new borrowing; cards out of the phone wallet. Keep a 1-month mini buffer so a surprise bill does not go back on the card.
3. **Budget the fixed monthly debt payment** from `personal-budget.md` — minimums on all + everything extra on one target.
4. **Pick order by the numbers** — run `payoff.mjs` (section "Simulation script" below) on the real debt list and budget:
   - **Avalanche** — highest rate first; least total interest.
   - **Snowball** — smallest balance first; fastest first win, keeps people going.
   - Gap = snowball total interest − avalanche total interest (baht). Avalanche is the default. If the gap is at most 1 month of the budget (starting value, not yet measured) **and** the user says they have quit plans before or need early wins, snowball is fine — tell the user it costs that many baht extra. If the gap is larger, show both and say how many baht the user pays for the earlier first win; the user decides.
5. **When a debt is cleared**, roll its whole payment onto the next target.
6. **Check refinance / consolidation** (below).
7. **If minimum payments are impossible**, use the restructuring channels before the debt turns a non-performing loan (NPL, 90+ days overdue).

## Simulation script

`payoff.mjs` simulates avalanche and snowball month by month: each month it adds interest (balance × yearly rate ÷ 12), pays every minimum, and puts the rest of the budget on the target debt; when a debt clears, its payment rolls to the next. Output: the month each debt clears, the month all clear, total interest, and the gap in baht.

```
node payoff.mjs <file.json> [--json]     # example file: scripts/example.json
node payoff.mjs --self-test
```

Input file: `{ "budget": 8000, "debts": [ { "name": "...", "balance": 15000, "rate": 16, "min": 1000 } ] }` · rate is % a year (24, not 0.24; the script warns below 1). For a credit card whose minimum is a share of the balance, put the current BOT minimum looked up live as `"minPct"` (e.g. `"minPct": 8`, ตัวอย่าง only; optional `"minFloor"` in baht) instead of `"min"`, so the minimum falls as the balance falls. Debt names must differ (two cards: `"บัตร KTC"`, `"บัตร KTC (2)"`); a repeated name stops the script. Every field must be a finite number; a bad field stops the script with a message naming it. If the budget is below the sum of minimums the script stops and says so. If the monthly interest is more than the payment, the debt never clears: the script reports that the budget cannot clear these debts and does not compare the two methods. If snowball finishes sooner than avalanche, it says so as it is.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/budget-and-debt/scripts/payoff.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/budget-and-debt/scripts/payoff.mjs` · Node only, no dependencies.

Debt output is information; the user decides.

Worked example (snowball vs avalanche, 3 debts, with numbers): [references/worked-example.md](debt-payoff/worked-example.md)

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
- Paying only the minimum on a 16% card still takes years; always show the time to payoff.
- Emergency fund goes to a mini buffer (1 month) during payoff, then grows to full size (`emergency-fund.md`).
- A "debt clearing" agent asking for an upfront fee is a red flag — run `scam-check`.


## reference: emergency-fund.md

<!-- merged from skill `emergency-fund` on 2026-11-27 · description was: Use when sizing an emergency fund or where to keep it -->
# Emergency Fund (เงินสำรองฉุกเฉิน)

General information, not financial advice.

## How many months

Months × **essential** monthly spending (rent or mortgage, food, transport, utilities, insurance premiums, minimum debt payments, support for parents) — not total spending, not income.

| Situation | Months |
|---|---|
| Government officer / state enterprise, stable | 3 |
| Salaried private sector, one earner of two in the household | 3–6 |
| Salaried, sole earner with dependants | 6–9 |
| Commission, contract, gig, freelance (ม.40), seasonal income | 9–12 |
| Business owner (keep separate from business cash) | 12 |
| Paying off high-interest debt | 1-month mini buffer first, full fund after (`debt-payoff.md`) |

Adjust up for: health conditions, older parents depending on you, older car, single-industry town. Adjust down slightly if the employer offers strong severance and the user is ม.33 (social security unemployment benefit when laid off: 60% of the capped wage for up to 180 days per government news from 28 Jun 2568, but SSO's own page dated 3 Oct 2567 still says 50% (รอยืนยัน which rate SSO pays now); wage cap 15,000 on SSO's page, and whether the 17,500 cap from 1 Jan 2569 applies to this benefit is (รอยืนยัน); resigned or contract ended: 30% for up to 90 days. Sources and dates → `e-commerce:thai-employment` (section 2, Unemployment row, checked 2026-11-10), or ask sso.go.th or 1506. Plan the fund without counting on the higher figure).

## Where to park — the ladder

| Layer | Share | Product | Access | Protected by the Deposit Protection Agency (DPA)? |
|---|---|---|---|---|
| 1 | 1 month | normal savings account at main bank | instant | yes |
| 2 | 2–5 months | high-interest digital savings (e-savings) at a different bank | same day | yes |
| 3 | rest | money market fund (กองทุนรวมตลาดเงิน, risk level 1) or 3–6 month fixed deposit | money market: usually T+1; fixed deposit: early withdrawal loses interest | money market fund **no** (it is an investment, but holds very short deposits and bills) |

Never in stocks, crypto, long-term funds, Retirement Mutual Fund (RMF) / ThaiESG, or lent to friends.

## Deposit protection (สถาบันคุ้มครองเงินฝาก)

- Covers **up to 1,000,000 baht per depositor per bank** — all accounts and branches at that bank combined, principal plus interest. In force since 11 Aug 2564.
- Covers Thai-baht savings, current, fixed deposits, certificates of deposit and deposit receipts at member banks. Does **not** cover foreign-currency deposits, mutual funds (including money market funds), bonds and corporate bonds, bills of exchange (ตั๋วแลกเงิน), insurance, or co-operatives (สหกรณ์ออมทรัพย์).
- This is the one copy of the protection rules; `personal-budget.md` and `fund-and-bond-picker` link here.
- Above 1 million: split across banks. Money beyond the emergency tier (deposits vs bonds vs money market funds) → `fund-and-bond-picker`.

## Workflow

1. Compute essential monthly spending from real statements (`personal-budget.md`).
2. Pick months from the table; target = months × essential spending.
3. Count what already qualifies (cash at bank, money market fund). Do not count RMF, stocks, or "I could borrow".
4. Close the gap with a monthly top-up from the budget, and set the date it will be full.
5. Set the ladder; name the accounts by purpose ("ฉุกเฉิน").
6. After using it, refill before resuming extra investing.

## Worked example

Freelance designer, essential spending 22,000/month, has 60,000 in savings, high-interest debt none.

| Step | Number |
|---|---|
| Target | 9 months × 22,000 = **198,000** |
| Already have | 60,000 |
| Gap | 138,000 |
| Top-up | 11,500/month → full in 12 months |
| Ladder | 22,000 savings at main bank · 88,000 e-savings at a second bank · 88,000 money market fund |

## Rules

- Interest rate is the last criterion; access and safety come first. E-savings promo rates change often — check the bank page (รอยืนยัน on any quoted rate).
- "Emergency" = job loss, medical not covered by insurance, urgent home/car repair, family crisis. A sale is not an emergency.
- The emergency fund is built before RMF/ThaiESG top-ups, except the employer PVD match, which comes first.

## References

- [`sources.md`](sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: home-refinance.md

<!-- merged from skill `home-refinance` on 2026-11-27 · description was: Use when a Thai home loan rate ends or weighing refinance -->
# Home Refinance (รีไฟแนนซ์บ้าน · ขอลดดอกเบี้ยธนาคารเดิม) — compare refinance, retention, and staying put in baht

General information, not financial advice; every fee and rate is confirmed with the bank in writing before the user signs.

> **One rule:** compare both paths in baht over the same months, with every fee counted — never compare headline rates alone.

## Use when
- Promo or fixed rate ending · "the rate jumped" · another bank's offer · "refinance or retention?"
- Not for: card, cash card, or personal loan debt, or several debts and which to pay first → `debt-payoff.md` · credit report problems blocking a new loan → `credit-bureau.md` · choosing a house or a first mortgage → not covered, ask the bank's loan officer

## Steps
1. **Collect from the contract and latest statement:** balance, current rate, monthly payment, months since signing, penalty clause.
2. **Get written offers:** the current bank's retention rate and fee; 1–2 other banks' rates for each year and the rate after the promo (usually MRR − x). MRR (Minimum Retail Rate) is each bank's own floating rate for prime retail customers, and most home loans after the promo are "MRR − x%". Banks usually move MRR after a Bank of Thailand (BOT) policy-rate decision, but not by the same amount or on the same day.
3. **Look up live (WebSearch/WebFetch) before quoting,** and mark the value (รอยืนยัน) if the page will not open: BOT policy rate https://www.bot.or.th/th/our-roles/monetary-policy/mpc-meeting.html · the user's bank's MRR from its lending-rate table, e.g. https://www.bangkokbank.com , https://www.kasikornbank.com , https://www.ttbbank.com/th/rates/loan-interest-rates · whether a government mortgage-registration fee cut is in force (rate, price cap, end date, whether it covers refinance): sources are news only, so confirm with the Land Office. A cut has applied only when purchase and mortgage are registered together; reports say a refinance pays the normal 1% (รอยืนยัน).
4. **Use these path facts** (checked 2026-10-26, sources and conflicts: [`sources.md`](home-refinance/sources.md)):

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
node refinance.mjs compare <file.json> [--json]     # example file: scripts/home-refinance/example.json
node refinance.mjs scenarios <file.json>            # example: scripts/scenarios-example.json -> JSON for decide.mjs payoff
node refinance.mjs --self-test
```
Path: installed from the marketplace `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/budget-and-debt/scripts/refinance.mjs | sort -V | tail -1` · in the repo `plugins/trading-finance/skills/budget-and-debt/scripts/refinance.mjs`.

Input fields `balance`, `payment`, `months`, `stay.rate` and each option's `rate` and `cost` must be finite numbers, with `months` above 0; a bad field stops the script with a message naming it. A rate below 1 gets a warning (it may have been typed as a decimal instead of %). A stepped rate (promo then MRR − x) goes in `rates` instead of `rate`: `[{ "months": 36, "rate": 3.2 }, { "rate": 5.5, "floating": true }]`; the last step runs to month N. `baseline` (optional) names the option to compare against; the default is staying put.

**If the rate after the promo is uncertain,** use `decision-desk/decision-scoring`, command `payoff` (script path: see `decision-desk/decision-scoring`). Options = refinance · retention · stay put; scenarios = MRR up · flat · down. `refinance.mjs scenarios <file.json>` writes the whole table with `better` = `low`: each scenario adds its `shift` to the steps marked `floating` (run 2026-10-28 on `scripts/scenarios-example.json`: refinance regret 0 · retention 59,409 · stay 380,279). If scenario probabilities are unknown, read the "smallest maximum regret" (minimax regret) column; do not guess probabilities. If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), or for any home-loan decision, the output is information and the user decides.

## Check before done
- Both paths over the same months and the same payment
- Every fee listed, with (รอยืนยัน) where the bank has not confirmed it in writing
- Rate after the promo shown, not only the first 3 years
- The user picks; no bank named as "the best"

## References
- [`worked-example.md`](home-refinance/worked-example.md) — open when you need a model of the comparison table
- [`sources.md`](home-refinance/sources.md) — sources, check dates, and conflicting figures for fees


## reference: personal-budget.md

<!-- merged from skill `personal-budget` on 2026-11-27 · description was: Use when salary runs out early or making a monthly budget -->
# Personal Budget (งบรายเดือน)

A budget that survives contact with real life. Worksheet: [references/budget-worksheet.md](budget-worksheet.md). General information, not financial advice.

## Workflow

1. **Real numbers, 2–3 months** — bank statement exports, e-wallet / PromptPay history (TrueMoney, ShopeePay, LINE Pay), credit card statements. Never use the user's guess of their own spending.
2. **Start from take-home pay**, not gross: salary − social security (5% of wage, capped at a 17,500 baht wage base = **875 baht/month** in 2569) − provident fund (PVD) contribution − withholding tax (ภาษีหัก ณ ที่จ่าย) per payslip. Add regular side income; treat bonus as a separate annual plan, not monthly money.
3. **Categorise** into four envelopes:
   - **Needs** — rent/home loan, utilities, food at home, transport to work, phone, insurance premiums, minimum debt payments, parents' support (ส่งเงินให้พ่อแม่ is a fixed need for many Thai households)
   - **Wants** — eating out, delivery, shopping, travel, subscriptions, gifts and social obligations (ซองงานแต่ง งานบวช งานศพ)
   - **Savings** — emergency fund until full (`emergency-fund.md`), extra debt payment above minimum (`debt-payoff.md`), annual bills sinking fund
   - **Investment** — DCA into funds/stocks, Retirement Mutual Fund (RMF) / ThaiESG (`income-tax-th`, `fund-and-bond-picker`)
4. **Flag leaks**: forgotten subscriptions, BNPL / ผ่อน 0% instalments stacking up, cash-advance fees, delivery frequency. List each with its monthly baht.
5. **Propose the split** — 50/30/20 (needs/wants/savings+investment) as a starting point; adjust to reality (high Bangkok rent may push needs to 60%). Never treat the split as sacred.
6. **The one number that matters** — the investment/saving transfer, set as a standing order on payday (บัญชีแยก, auto-transfer), before spending starts.
7. **Monthly 10-minute review** — actual vs plan per envelope, one category to fix next month. Explain only the lines that are off by **more than 10% and more than 500 baht** (both at once); the rest is noise and gets no comment. For a large line such as rent or a loan, a lower % is fine because 10% of it is already a lot of money. The 10% and 500 baht are starting values, not measured; the user may change them. (Idea: materiality thresholds in `variance-analysis`, anthropics/knowledge-work-plugins, Apache-2.0, viewed 2026-11-10.)

## Decision table

| Situation | Do first |
|---|---|
| Expenses > income | Cut wants, then renegotiate needs (phone plan, insurance overlap via `retirement-and-insurance`); never borrow to cover monthly spend |
| Credit-card or cash-card debt revolving | Savings envelope goes to `debt-payoff.md` before investment beyond the employer-matched PVD |
| No emergency fund | Fill `emergency-fund.md` first (at least 3 months of needs) before discretionary investing |
| Irregular income (freelance, commission) | Budget on the lowest month of the last 6; park the surplus in a buffer account |
| Year-end bonus | Pre-split: debt / emergency fund / tax-saving funds / one want |

## Where to park each envelope

- Spending: main account linked to the debit card / PromptPay.
- Emergency and sinking funds: separate high-interest savings account; deposit protection limit and rules: `emergency-fund.md` "Deposit protection".
- Investment: broker / fund account, auto-debited.

ตรวจล่าสุด 2026-10-26 · ประกันสังคม 5% ค่าจ้าง 1,650–17,500 สูงสุด 875 บาทต่อเดือนตั้งแต่ 1 ม.ค. 2569 (2572 เพดาน 20,000) แหล่ง: https://www.sso.go.th (ข่าวนนทบุรี 35688 · 27 ธ.ค. 2568 และหน้าบริการ 605_605) , https://www.krungsri.com/th/krungsri-the-coach/life/good-life/sso-section-33-rate-increase · คุ้มครองเงินฝาก 1 ล้านบาทต่อคนต่อสถาบัน แหล่ง: https://www.dpa.or.th/News/kar-prab-wngngein-khumkhrxng-thi-1-lan-bath , https://www.bangkokbank.com/th-TH/Personal/Grow-Club/DPA , https://www.bangkokbiznews.com/news/952780

Worked example (monthly, single, Bangkok, 2569, salary 35,000): [references/worked-example.md](worked-example.md)

## Rules

- If data is missing, estimate it with the user and mark it as an estimate.
- The goal is not a perfect spreadsheet; it is protecting the payday transfer.
- If expenses exceed income, say so plainly and cut wants first, never the investment line to zero without saying what it costs long term.

Related (same plugin): `emergency-fund.md`, `debt-payoff.md`, `income-tax-th`, `scam-check` before sending money to any "guaranteed" scheme. If installed: `household-money` (personal-life) to clear forgotten subscriptions.


## reference: sources.md

# Sources · emergency-fund

Last checked 2026-11-10 · source (Deposit Protection Agency): https://www.dpa.or.th/News/kar-prab-wngngein-khumkhrxng-thi-1-lan-bath (1 million baht from 11 Aug 2021 (B.E. 2564)) · https://www.dpa.or.th/Protected-Financial-Products (not protected: foreign currency, instruments, SSF/RMF funds, cooperative deposits, bills of exchange, savings insurance, crypto)

Last checked 2026-10-06 · source: https://www.thaipbs.or.th/news/content/353742 (Ministerial Regulation No. 2 B.E. 2568 · 60% · 180 days · effective 28 Jun 2025 (B.E. 2568) · re-checked 2026-10-22; resignation 30% · 90 days was not changed) · wage ceiling 17,500 from 1 Jan 2026 (B.E. 2569), re-checked 2026-10-22 (infoquest.co.th/2025/550753)


## reference: worked-example.md

# Worked example · personal-budget

## Worked example (monthly, single, Bangkok, 2569)

Salary 35,000. Social security 875 (capped), PVD 3% = 1,050, withholding tax per payslip ≈ 300 (รอยืนยัน — use the user's payslip). Take-home ≈ **32,775**.

| Envelope | Items | Plan | % of take-home |
|---|---|---|---|
| Needs | rent 8,500 · utilities 1,200 · food at home 4,000 · BTS/MRT 1,800 · phone 500 · parents 3,000 · health insurance 1,000 | 20,000 | 61% |
| Wants | eating out/delivery 4,500 · subscriptions 600 · shopping/social 1,700 | 6,800 | 21% |
| Savings | emergency fund (until 3 months of needs = 60,000) | 3,000 | 9% |
| Investment | index fund DCA on payday | 2,975 | 9% |
| **Total** | | **32,775** | 100% |

Leaks found: two streaming services overlap (−300), delivery 18 times a month (target 10, −2,000). Moving that 2,300 to investment lifts it to **5,275 (16%)**. The standing order: 5,275 on the 25th, before anything else.
