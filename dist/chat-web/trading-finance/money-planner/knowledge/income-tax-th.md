# skill: income-tax-th

Use when asking about Thai tax on gains or cutting tax with deductions

# income-tax-th — personal income tax, dividends and deductions

> **One rule:** the tax is computed by the script from the year's rates and caps file, never by hand and never from memory.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| How Thai tax applies to gains or dividends | [references/tax-basics-th.md](references/tax-basics-th.md) |
| Cutting income tax with deductions, and what is worth buying | [references/tax-deduction-planner.md](references/tax-deduction-planner.md) |

Other files in this folder: `deductions-2569.md` (caps and rates for the year), `investment-income-rules.md`, `documents-to-keep.md`, `checklist-and-example.md` and `worked-example.md`. Scripts: `scripts/tax.mjs` (with `scripts/example.json`) and the rates file `scripts/rates-2569.json`.

## Steps every part shares

1. Collect the year's income, expenses and the allowances already locked in from the user's own documents.
2. Run `node scripts/tax.mjs <file.json>` for every tax figure.
3. Take every cap and rate from `deductions-2569.md`, and write the year checked next to it.

## Check before done

- General information, not tax advice. For a real return or an unusual case, the user asks a นักบัญชี or a tax agent, or calls the Revenue Department (RD) call centre on 1161.
- Never buy insurance only for the deduction; the cover is decided by the risks the user has.
- Keep the documents for each deduction (receipts, certificates, statements) in the list from `documents-to-keep.md`.
- Dividend and gain treatment is checked against the current year's rules before it is stated as fact.

Whole job with several steps → playbook [tax-season](../superuser/references/playbook-tax-season.md).


## reference: checklist-and-example.md

# Year-end checklist and worked example · tax-deduction-planner

Open when walking the deduction checklist with the user (workflow step 5), or when a worked example of before / after tax helps.

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
| 20 | Easy e-Receipt / ช้อปดีมีคืน | no 2569 round as of 2026-10-25 (news: Finance Ministry not continuing it) — plan without it (รอยืนยัน) | e-Tax Invoice in own name and ID |

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
| Provident fund (PVD, กองทุนสำรองเลี้ยงชีพ) employee contribution | 15% of wage, max 500,000 | first 10,000 is an exemption, the rest a deduction |
| Government Pension Fund (GPF, กบข.) / private teachers' fund | 15% of wage | — |
| Retirement Mutual Fund (RMF) | 30% of income, max 500,000 | hold 5 years and redeem at age 55+ |
| National Savings Fund (กอช.) | 30,000 | — |
| **Combined retirement cap** | **500,000** | PVD + GPF + teachers' fund + RMF + กอช. + pension insurance together |
| ThaiESG | 30% of income, max 300,000 | **outside** the 500,000 cap; for buys in 2567–2569 hold 5 full years; ThaiESGX new money merges into this 300,000 in 2569 |
| Super Savings Fund (SSF) | 0 for new buys | no deduction for purchases from 2568; units bought 2563–2567 must still be held 10 years or the tax saved is repaid |

ThaiESG after 2569: max 100,000 and 8-year hold for 2570–2575 per SEC Q&A (รอยืนยัน — check before advising for 2570).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.sec.or.th/TH/Documents/Thai%20ESGX/QA-LTF-to-Thai%20ESGX-010468.pdf , https://www.thairath.co.th/money/economics/thai_economics/2899435

## 6. Home, donations, stimulus

| Item | Cap, baht | Condition |
|---|---|---|
| Home loan interest (ดอกเบี้ยกู้ซื้อที่อยู่อาศัย) | 100,000 | lender's interest certificate; co-borrowers split |
| Donations to schools/universities, state hospitals, listed sport bodies | 2 × amount | together with general donations, max 10% of income after other deductions; e-Donation receipt needed |
| General donations (temples, charities) | 1 × amount | max 10% of income after other deductions |
| Political party donation | 10,000 | — |
| Easy e-Receipt / ช้อปดีมีคืน | 2568: 50,000 (30,000 general VAT shops + 20,000 OTOP/community enterprise, e-Tax Invoice or e-Receipt only, 16 Jan–28 Feb 2568) | **no 2569 round** — news (Dec 2568, Feb 2569) reports the Finance Ministry will not continue it; no Cabinet approval or RD notice seen as of 2026-10-25; plan without it (รอยืนยัน: no official statement found) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thairath.co.th/money/economics/thai_economics/2832789 , https://www.bangkokbiznews.com/economics/1214725 · Easy e-Receipt 2569 ตรวจล่าสุด 2026-10-25 ไม่พบประกาศ (https://www.rd.go.th) · ข่าวว่าคลังไม่ต่อ: https://thethaiger.com/th/news/1509461/ , https://www.sanook.com/money/946276/ , https://www.bangkokbiznews.com/economics/1221930

## 7. What changed versus tax year 2568

- Social security cap up from 9,000 to 10,500
- ThaiESGX separate 300,000 (May–Jun 2568 window) and LTF switch up to 500,000 were 2568-only
- Easy e-Receipt: no 2569 round as of 2026-10-25; news reports the Finance Ministry will not continue it (last round 16 Jan–28 Feb 2568, cap 50,000)
- Proposed TISA savings account not law at check date — do not plan on it


## reference: documents-to-keep.md

# Documents to keep

Open at step 5 to list documents for the user.

- 50 ทวิ from the employer
- dividend withholding certificates (หนังสือรับรองการหักภาษี ณ ที่จ่าย, from the registrar TSD or the broker's annual tax report)
- bank interest certificates
- broker annual statements (even for exempt gains)
- crypto exchange annual statement and transaction CSV (for foreign venues, the transfers into Thailand)
- foreign broker statements, foreign tax withheld, dated remittance records
- deduction certificates listed in `tax-deduction-planner.md`.


## reference: investment-income-rules.md

# Thai tax treatment of investment income — individual resident

| Income | Withholding at source | Exempt? | Option to include in annual return | Notes |
|---|---|---|---|---|
| Gain selling shares on SET / mai through a Thai broker | none | **exempt** (gain on listed shares sold on the exchange); a loss is not deductible | — | Selling unlisted shares off-exchange is taxable under 40(4)(ช) |
| Dividends from Thai companies | 10% | no | yes — include and claim dividend tax credit (เครดิตภาษีเงินปันผล) | Credit only for dividends paid from profit taxed at corporate level; BOI-exempt profit gives no credit · choosing to include means including **all** such dividends that year · include when marginal rate is 25% or less |
| Dividends from Thai mutual funds | 10% | no | yes, but **no** dividend tax credit | Redemption gain on Thai funds is exempt for individuals |
| Savings account interest | 0 if total ≤ 20,000/yr across all banks and consent to share data | ≤ 20,000 exempt | — | If you refuse consent or exceed 20,000, 15% is withheld on all savings interest |
| Fixed deposit, bonds, debentures interest | 15% | no | yes — include if marginal rate < 15% | Must include all interest of that kind if you choose to |
| Crypto / digital token gains on SEC-licensed Thai exchange, broker or dealer | none | **exempt 1 Jan 2568 – 31 Dec 2572** (กฎกระทรวง ฉบับที่ 399, ราชกิจจานุเบกษา 5 Sep 2568) | — | Keep statements anyway |
| Crypto gains elsewhere (foreign exchange, P2P, DeFi) | 15% legally applies but rarely withheld | no | taxable at progressive rates as 40(4)(ฌ) | Foreign-held: also falls under the remittance rule below |
| Staking rewards, airdrops | 15% may apply to 40(4)(ซ) | no — the exemption above is for transfer gains (40(4)(ฌ)) only (รอยืนยัน) | taxable: staking / yield farming on a **digital token** = 40(4)(ซ); on a **cryptocurrency** = 40(8); airdrop, gift or prize = 40(8) (RD guide, รอยืนยัน) | Value at market price on the day received; that value becomes the cost when sold later |
| Foreign income earned from 1 Jan 2567 (dividends, gains, interest abroad) | foreign tax | no | taxable in the Thai year it is **brought into Thailand**, if you were in Thailand 180+ days that year (ป.161/2566, ป.162/2566) | Foreign income earned before 2567 is exempt when remitted; claim double-tax-treaty credit for foreign tax paid |

ตรวจล่าสุด 2026-10-06 · แหล่ง:
- https://www.rd.go.th/fileadmin/user_upload/lorkhor/newsbanner/2024/1/QnA161-162-1.pdf (foreign income)
- https://www.thairath.co.th/money/investment/digital_assets/2881566 (crypto exemption, กฎกระทรวง 399)
- https://www.krungsri.com/th/about-krungsri/about-us/overview/announce/exemption-tax-interest-savings-deposit (savings interest 20,000)
- ตรวจล่าสุด 2026-10-25 (staking, airdrop): https://www.rd.go.th/fileadmin/user_upload/lorkhor/newsbanner/2022/03/Instructions_for_paying_personal_income_tax.pdf (คู่มือกรมสรรพากร มี.ค. 2565 หน้า 18–21) , https://www.finnomena.com/z-admin/cryptocurrency-tax/ (token = 40(4)(ซ)) , https://thestandard.co/cryptocurrency-tax-summary/ (airdrop = 40(8)) · แหล่งอิสระยังไม่ครบ 3 ต่อข้อ และคู่มือเป็นฉบับปี 2565

## Dividend tax credit formula

credit = dividend × t ÷ (100 − t), where t = corporate tax rate the payer paid.

| Corporate rate t | Credit as share of dividend |
|---|---|
| 20% (most listed companies) | 1/4 = 25% |
| 0% (BOI-exempt profit) | 0 |

Break-even: with t = 20% and 10% withheld, including dividends wins when your marginal rate is **25% or lower**; at 30% and 35% keep the 10% as final tax. Including can push net income into a higher band — compute both ways.


## reference: knapsack.md

# Knapsack — picking deduction items under one budget

Moved from `SKILL.md` (tax-deduction-planner) section "Choosing several items under a budget" · open only when several items compete for one budget

Use `decision-desk/decision-scoring`, command `knapsack`. Its `templates/knapsack.json` is an example. Script path: see `decision-desk/decision-scoring` (superuser plugin).

| Field | What to enter |
|---|---|
| `budget` | Cash the user sets aside for deductions this year (baht) |
| `groups` | Top level: `{"<name>": <cap on total cost>}`. One group per shared cap, for example the room left under the 500,000 combined cap (500,000 minus what PVD already took) |
| Each `item` | Split into blocks, for example RMF 50,000, ThaiESG 50,000; a block must not exceed the item's cap in the Year-end checklist · `cost` = cash paid · `value` = tax saved by that block (`tax.mjs` prints it per block in order: block 1, 2, …) minus the cost of locking the money (if the user states one, else 0) · `group` = the group it counts against |
| `must` | Items the user needs anyway (for example an insurance premium already due) |

Example (made-up numbers): salary 1,500,000 a year. After the expense deduction 100,000, personal 60,000, social security 10,500, PVD 150,000 (10% of wage, under the 15% cap), pension insurance 150,000 (its cap is 15% of income = 225,000, limited to 200,000, so 50,000 is left), an earlier RMF purchase 80,000, two parents 60,000 and life insurance 89,500, net income is 800,000 before these blocks. PVD, pension insurance and RMF already took 380,000 of the 500,000 combined cap (so 120,000 is left). At 800,000 the first 50,000 block saves 20% (10,000) and the next ones 15% (7,500):

```json
{ "budget": 150000, "groups": { "cap-500k": 120000, "thaiesg": 300000 },
  "items": [
    { "name": "RMF block 1", "cost": 50000, "value": 10000, "group": "cap-500k" },
    { "name": "RMF block 2", "cost": 50000, "value": 7500, "group": "cap-500k" },
    { "name": "Pension insurance", "cost": 50000, "value": 7500, "group": "cap-500k" },
    { "name": "ThaiESG block", "cost": 50000, "value": 7500, "group": "thaiesg" } ] }
```

`node <decide.mjs> knapsack file.json` picks RMF block 1 + RMF block 2 + ThaiESG (value 25,000). Pension insurance ties with RMF block 2, and the script lists that set as the runner-up, so the user chooses. Each `value` is an estimate from the marginal rate of the band that block lands in (block 1: 50,000 × 20% = 10,000; later blocks fall into the 15% band). Because one block changes the saving of the next, **after the script gives a set, put that set under `buy` and rerun `tax.mjs`** and show that figure, not the sum of the estimates. Lists over 20 blocks are ranked by value per cost and not fully searched. Limits that depend on income (RMF and ThaiESG at 30% of income) are checked outside the knapsack: `tax.mjs` cuts each item to its cap and prints the room left. Tax output is information; the user decides.


## reference: script.md

# Tax script input and output · tax-deduction-planner

Open when writing the input file for `scripts/tax.mjs` or reading its output.

Input: `{ "salary": 720000, "deductions": { "socialSecurity": 10500, "pvd": 36000, "lifeInsurance": 20000, "ownHealth": 15000 }, "buy": { "rmf": 50000, "thaiesg": 50000 }, "dividends": { "amount": 40000 } }`. `salary` = 40(1) + 40(2) for the year; other income goes in `otherIncome` with its own expense in `otherExpense` (reference section 2 of `deductions-2569.md`). The personal 60,000 and the expense deduction are added by the script. Keys with a cap check: `socialSecurity` `lifeInsurance` `ownHealth` `parentsHealth` `pensionInsurance` `pvd` `gpf` `rmf` `nsf` `thaiesg` `homeLoanInterest` `politicalParty` `donation` `donationDouble`; any other key (spouse, child, parents) is counted as entered and listed as not checked.

Output: net income, tax before / after / saved, marginal rate, room left (RMF, ThaiESG, pension insurance, 500,000 combined cap), knapsack `value` per 50,000 block, and with `dividends` the cost of keeping the 10% as final versus including with the credit (formula from `tax-basics-th.md`). The 30% caps use income without dividends.

Rates and caps live in `scripts/rates-2569.json` (`checked` date, `source` line in the reference file); a new tax year needs a new file from a checked reference, never edited from memory.


## reference: sources.md

# Sources · tax-basics-th

Form deadlines and extension dates, checked 2026-10-06:
- https://www.infoquest.co.th/?p=576625
- https://www.thaipbs.or.th/news/content/501063

Per-income-type sources and check dates are at the end of `investment-income-rules.md`.


## reference: tax-basics-th.md

<!-- merged from skill `tax-basics-th` on 2026-11-27 · description was: Use when asking how Thai tax applies to gains or dividends -->
# Thai Tax Basics for Investors — which form, by when, and how each investment income is taxed

General information, not tax advice. For a real filing ask a นักบัญชี / tax agent or the Revenue Department (RD) call centre 1161.

## Use when
- A Thai resident asks how tax applies to share gains, dividends, fund income, deposit interest, crypto, or foreign income.
- Choosing between leaving withheld tax as final or including the income in the annual return.
- Picking the return form and deadline.

Not for: year-end deductions → `tax-deduction-planner.md` · dividend dates and income tracking → `portfolio` · income from selling online (40(8)) → `e-commerce:thai-tax` (if installed).

## Steps
1. **Confirm the tax year and residence** (180-day rule). State the tax year in every answer; numbers change yearly.
2. **List every income source** with gross amount and tax withheld, and sort each into the table in [`investment-income-rules.md`](investment-income-rules.md). A number not in that table is `(รอยืนยัน)` until checked on rd.go.th. Before relying on the crypto exemption, check the platform on the SEC licence list (sec.or.th). For foreign income, track the earn date and remit date of every transfer.
3. **For each optional item, compute both ways and pick the cheaper.** Dividends: final 10% withheld, or include in ภ.ง.ด.90 and claim the credit (worth it at a marginal rate of 25% or less; including means including **all** such dividends that year). Re-check the band after adding the income; if it crosses into 30%, final tax wins. `tax-deduction-planner.md` script `tax.mjs` with a `dividends` field prints both ways. Fixed deposit or bond interest (15% withheld): include only if the marginal rate is below 15%. Savings interest: exempt up to 20,000 a year across all banks if the banks may send data to RD.
4. **Run `tax-deduction-planner.md` for deductions** and combine into one net-income calculation.
5. **Pick the form and deadline** from the table below, and list the documents to keep.
6. **Hand complex cases** (foreign income, business income, large crypto) to a licensed tax agent. This skill prepares and explains.

| Form | Who | Paper deadline | Online (e-filing / D-MyTax) |
|---|---|---|---|
| ภ.ง.ด.91 | salary 40(1) only | 31 March of next year | usually extended to about 8 April (2568 year: 8 April 2569) |
| ภ.ง.ด.90 | any other income: freelance, rent, business, dividends or interest you choose to include, foreign remitted income | 31 March | same extension |
| ภ.ง.ด.94 | half-year return for rent, business, 40(5)–(8) income Jan–Jun | 30 September | about 8 October |

Tax year 2569 (income 2026): paper by 31 March 2570; the online extension date is announced each year (รอยืนยัน, expect about 8 April 2570). Refunds go to PromptPay linked to the national ID, so register before filing. Late filing: surcharge 1.5% per month on tax due plus a fine. Form dates checked 2026-10-06 (sources in [`sources.md`](sources.md)).

Documents to keep (50 ทวิ · dividend and interest certificates · broker and crypto statements · foreign remittance records): [`documents-to-keep.md`](documents-to-keep.md).

## Check before done
- [ ] The tax year is stated.
- [ ] Every income source is sorted, and each optional item was computed both ways.
- [ ] The form is ภ.ง.ด.90 if any dividend or interest is included, not 91.
- [ ] Unverified numbers are marked `(รอยืนยัน)`.

## References
- [`investment-income-rules.md`](investment-income-rules.md) — open at step 2: per-income-type table, staking and airdrops, dividend credit formula.
- [`worked-example.md`](worked-example.md) — open to see a full comparison of final tax versus including income.
- [`documents-to-keep.md`](documents-to-keep.md) — open at step 5 for the full document list.
- [`sources.md`](sources.md) — sources and check dates for form deadlines.


## reference: tax-deduction-planner.md

<!-- merged from skill `tax-deduction-planner` on 2026-11-27 · description was: Use when cutting Thai income tax with deductions -->
# tax-deduction-planner — a year-end plan that cuts Thai income tax, with before / after / saved

General information, not tax advice: for a real return or an unusual case ask a นักบัญชี / tax agent, or call RD 1161.

## Use when

- Planning year-end deductions (insurance, PVD, RMF, ThaiESG, donations, home loan interest) for Thai personal income tax
- Asking how much tax a purchase would save, or which items fit a budget

Not for: filing itself (ภ.ง.ด.90/91, deadlines) and dividends, interest, crypto, foreign income → `tax-basics-th.md` · choosing the fund → `fund-and-bond-picker` · long-term fit → `retirement-and-insurance` · how much cover is needed → `retirement-and-insurance`

## Steps

1. **Fix the tax year.** Planning in October 2026 means tax year 2569, filed Jan–Mar 2570. Money must be paid by **31 December**. Do not use 2568-only items (ThaiESGX May–June window, LTF switch, 9,000 SSO) for 2569.
2. **Collect income** in one question if missing: yearly salary + bonus (employer's ทวิ 50 estimate or payslips × 12), freelance 40(2), other income, PVD rate, social security deducted, premiums already paid.
3. **Compute tax now** with `node scripts/tax.mjs <file.json>` (never by hand): income − expense deduction (50%, max 100,000 for salary) − allowances already locked in = net income → rate table. Caps and rates → [`deductions-2569.md`](deductions-2569.md), never from memory.
4. **Find the marginal rate.** A 1-baht deduction saves the marginal rate of the band the net income falls in. A deduction that crosses into a lower band saves the lower rate on the crossing part (`tax.mjs` prints the rate before and after). If net income is already in the 0% band, stop: more deductions save nothing.
5. **Walk the checklist** (20 items with caps and the question to ask) in [`checklist-and-example.md`](checklist-and-example.md); for each line ask "already have it / can still add / not applicable".
6. **Size the funds last.** Room left: RMF ≤ 30% of income, ThaiESG ≤ 30% and 300,000, and PVD + RMF + pension insurance + กอช. ≤ 500,000 combined. When items compete for one budget, use `decision-desk/decision-scoring` command `knapsack` (script path in `decision-desk/decision-scoring`, superuser plugin; fields, example, `value` per block → [`knapsack.md`](knapsack.md)). One block changes the saving of the next, so **after the script gives a set, put it under `buy` and rerun `tax.mjs`** and show that figure, not the sum of the estimates.
7. **Recompute** and show before / after / saved, and the cash the plan locks up (RMF to age 55, ThaiESG 5 years).
8. **List the paperwork** for January: 50 ทวิ, insurance premium certificates (ask the insurer to send data to RD), fund tax certificates (ask the AMC to send data), home loan interest certificate, e-Donation, ล.ย.03 for parents.

Rules:
- Never buy insurance only for the deduction; `retirement-and-insurance` decides cover.
- Do not buy RMF/ThaiESG past the point where net income drops into a lower band unless the user wants the saving anyway.
- RMF and ThaiESG can lose money.
- Do not count an amount not yet paid; plan "buy by 20 December" to leave settlement days (AMC cut-off before New Year varies).
- Breaking an RMF / ThaiESG / old SSF condition means repaying all tax saved plus surcharge 1.5% per month: say so.
- Tax output is information; the user decides.

## Tax script

```
node scripts/tax.mjs <file.json> [--json]     # example file: scripts/example.json
node scripts/tax.mjs --self-test
```

Input file shape, keys with a cap check, output fields and where rates live → [`script.md`](script.md). Put other income in `otherIncome`, a purchase plan under `buy`, dividends under `dividends`. A new tax year needs a new `scripts/rates-2569.json`-style file from a checked reference, never edited from memory.

**Script path:** installed: `ls -d ~/.claude/plugins/cache/*/trading-finance/*/skills/income-tax-th/scripts/tax.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/trading-finance/skills/income-tax-th/scripts/tax.mjs` · Node only, no dependencies.

## Output format

- Tax before / after / saved, marginal rate, the purchase list with amounts and deadlines
- "Room left" line: RMF, ThaiESG, 500,000 combined cap
- Documents to collect by January (step 8)
- Any line marked (รอยืนยัน) stays marked

## Check before done

- Every tax figure comes from a `tax.mjs` run in this session (not added up by hand), and the final plan was rerun as one `buy` set.
- `rates-2569.json` `checked` date is stated; the tax year in the answer matches `tax_year` in that file.
- Each `คำเตือน` line from the script is either fixed in the input or repeated to the user.
- Room left and the cash locked up are in the answer.

## References

- [`deductions-2569.md`](deductions-2569.md) — open for current caps and the rate table
- [`checklist-and-example.md`](checklist-and-example.md) — open to walk the 20-item checklist or show a worked before / after example
- [`script.md`](script.md) — open when writing the script's input file or reading its output
- [`knapsack.md`](knapsack.md) — open when several items compete for one budget

## เรียกเป็นคำสั่ง

`/trading-finance:income-tax-th [yearly income and what you already have, e.g. "salary 60k/month, PVD 5%, life 20k"]`

Run the `income-tax-th` skill: **the user's request**

- No income given → ask for yearly salary/bonus, other income, PVD rate, and premiums already paid, in one question
- Show tax before / after / saved, the marginal rate, and the purchase list with deadlines
- For dividends, interest or crypto in the same return, use `tax-basics-th.md`; for choosing the RMF or ThaiESG fund, use `fund-and-bond-picker`


## reference: worked-example.md

# Worked example — tax year 2568 (filed 2569)

Open when you want a worked comparison of final tax versus including dividends and interest.

Salary net income after all deductions 350,000 (marginal rate 10%). Investment income: SET share trading gain 120,000; dividends from listed companies 40,000 (4,000 withheld); savings interest 8,000; 12-month fixed deposit interest 10,000 (1,500 withheld); BTC gain 30,000 on a Thai licensed exchange.

| Item | Treatment | Tax effect |
|---|---|---|
| Share trading gain 120,000 | exempt | 0 |
| Savings interest 8,000 | exempt (≤ 20,000) | 0 |
| BTC gain 30,000 (licensed exchange, 2568) | exempt | 0 |
| Dividends — option A: final | 10% withheld | cost 4,000 |
| Dividends — option B: include | add 40,000 + credit 10,000 = 50,000 at 10% = 5,000; minus credit 10,000; minus withheld 4,000 | net **refund 9,000** versus option A's cost 4,000 → B better by 9,000 |
| Deposit interest — include | 10,000 at 10% = 1,000 minus withheld 1,500 | refund 500 |

Result: file ภ.ง.ด.90 (not 91, because dividends and interest are included). Net income becomes 350,000 + 50,000 + 10,000 = 410,000, still inside the 10% band — check this every time; if the added income crossed into 30%, option A would win.
