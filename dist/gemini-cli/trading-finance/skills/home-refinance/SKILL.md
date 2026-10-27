---
name: home-refinance
description: Use when a Thai home loan's fixed or promo rate ends, the user asks refinance vs retention (รีไฟแนนซ์ · รีเทนชั่น), or what MRR means for their loan.
---

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
node refinance.mjs --self-test
```

Input fields `balance`, `payment`, `months`, `stay.rate` and each option's `rate` and `cost` must be finite numbers, with `months` above 0; a bad field stops the script with a message naming it. A rate below 1 gets a warning (it may have been typed as a decimal instead of %). `baseline` (optional) names the option to compare against; the default is staying put.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/home-refinance/scripts/refinance.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/home-refinance/scripts/refinance.mjs` · Node only, no dependencies.

**Rate after the promo is uncertain** (MRR can rise or fall): use `decision-scoring`, command `payoff`. Options = refinance · retention · stay put; scenarios = MRR up · flat · down (compute interest plus costs for each cell with `refinance.mjs`; `better` = `low`). If the probability of each scenario is unknown, read the "smallest maximum regret" (minimax regret) column; do not guess probabilities. Script path: see `decision-scoring` (superuser plugin). If the result reads `ยังไม่นิ่ง` (not stable) or `สูสี` (too close), or for any home-loan decision, the output is information and the user decides.

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
