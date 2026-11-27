# skill: thai-business-setup

Use when starting a Thai business

# Starting a business in Thailand: choose a form and register

This skill helps the user choose between trading as an individual, a partnership or a company. It walks them through registration, then through the checklist after registration. The content is general information, not tax or legal advice. An accountant should recalculate the tax figures for a real business.

## 1 · Choosing a business form

Compare 4 forms (individual + commercial registration (ทะเบียนพาณิชย์) · registered ordinary partnership (ห้างหุ้นส่วนสามัญนิติบุคคล) · limited partnership (ห้างหุ้นส่วนจำกัด) · limited company (บริษัทจำกัด)) by liability for debts, capital, where to register, fees and tax (progressive 0–35% for an individual, the juristic person rate for the others). The full table, the order of questions for choosing a form and the sources checked 2026-10-23 are in [`references/business-forms.md`](references/business-forms.md). Open that file before answering which form to register.

## 2 · Income tax: individual vs juristic person

The individual tax brackets (tax year 2025 (B.E. 2568)), the SME juristic person rates, the 3 profit scenarios and how to run `decide.mjs` with `tax-compare.mjs` are in [`references/income-tax-compare.md`](references/income-tax-compare.md). These figures do not yet include the second layer of tax when money leaves the company. Open that file before comparing numbers.

## 3 · Registration

An individual registers commercial registration (anyone selling online must register). Partnerships and companies register through DBD Biz Regist (online only from 1 Nov 2026 (B.E. 2569)). The steps, fees and sources checked are in [`references/registration.md`](references/registration.md). Check the rate in the system before every payment.

## 4 · After registration: checklist

| Task | When | Use |
|---|---|---|
| Open a bank account in the business name, separate from personal money | Right away | Recommended practice |
| Juristic person: keep books from the registration date · appoint a qualified bookkeeper · close the first accounting period within 12 months · keep books and documents for at least 5 years from the closing date | Right away | `thai-tax` |
| Register for VAT when revenue from selling goods or services exceeds 1.8 million baht a year. File the request within 30 days of the date revenue passes it · below that, the owner can still register voluntarily · a juristic person can file the VAT request together with the incorporation request | By revenue | `thai-tax` |
| Issue electronic tax invoices (e-Tax Invoice) | After VAT registration | `thai-tax` |
| First hire: register the employee as an insured person within 30 days of the start date · an employer who is an individual must register as an employer themselves | When hiring | `thai-employment` |
| Withholding tax and monthly VAT | Every month | `thai-tax` |
| Payroll | Every month | `thai-employment` |
| Financial statements and yearly tax | After the accounting year closes | `thai-tax` |
| Privacy notice for customers and staff | Before collecting data | `pdpa-workflow` |
| Quotation, invoice, receipt · PromptPay QR | When sales open | `thai-business-docs` · `shop-books` |

Last checked 2026-10-23 · sources: [`references/sources.md`](references/sources.md)

## 5 · Import cost from China

Moved to the skill `pricing-and-costs` (CIF formula, duty and VAT · 2026 rules · by road or by sea · script `landed-cost.mjs`).

## 6 · When to ask an accountant or lawyer

- Before choosing a form, if profit is expected to exceed 1 million baht a year or partners put in unequal amounts (recommended practice)
- A shareholder, partner or director is a foreigner · DBD asks for extra documents under the orders of the Central Partnership and Company Registration Office (company: no. 2/2569 · partnership: no. 205/2555), and the law on foreign business operation needs a lawyer's review
- Registered capital over 5 million baht · DBD asks for extra documents under order no. 1/2567
- Revenue is near 1.8 million baht, or the business is about to register for VAT
- Financial statements or tax were filed late (penalties grow every day; see `thai-tax`)

## 7 · รออนุมัติ (awaiting approval)

These steps cannot be undone or they affect outsiders. The agent prepares the data and drafts, but does not do them.

- Filing a real registration, verifying identity or paying a fee in a government system
- Signing a partnership agreement or a lease
- Filing a VAT registration request
- Entering the user's password, identity verification code or account number

## 8 · Links to other skills

| Need | Use |
|---|---|
| Tax for an online seller who is an individual (deducting expenses · ภ.ง.ด.90 (PND 90) and 94 (PND 94)) | `thai-tax` |
| Monthly filing of VAT, withholding tax and penalties | `thai-tax` + agent `tax-helper` |
| Partnership, lease and work-for-hire contracts | `thai-business-docs` |
| Setting a selling price on Shopee, Lazada and TikTok Shop once the cost is known | `pricing-and-costs` |
| Comparing domestic carriers | `pricing-and-costs` |
| Naming the business before reserving the name | `product-naming` (plugin `software-development`) |


## reference: business-forms.md

# Choosing a business form (moved from SKILL.md section 1)

Part of the skill `thai-business-setup`. For the abbreviations, see the top of SKILL.md.

## 1 · Choosing a business form

| Topic | Individual + commercial registration (บุคคลธรรมดา + ทะเบียนพาณิชย์) | Registered ordinary partnership (ห้างหุ้นส่วนสามัญนิติบุคคล) | Limited partnership (ห้างหุ้นส่วนจำกัด) | Limited company (บริษัทจำกัด) |
|---|---|---|---|---|
| Founders | 1 person | 2 or more partners | 2 or more partners | 2 or more promoters (ผู้เริ่มก่อการ) |
| Liability for debts | The owner is fully liable. The business is not separate from the person. | Every partner is jointly liable without limit. | Limited-liability partners: up to the amount they invested, and they cannot manage the business. Unlimited-liability partners: no limit, and they act as managing partners. | Shareholders are liable only for unpaid share value. |
| Contribution | The owner's money | Money, property or labour | Money, property or labour (limited-liability partners cannot contribute labour) | Shares with a par value of at least 5 baht, with at least 25% called up |
| Register at | District office (Bangkok) · municipality · subdistrict administrative organization (อบต.) · Pattaya City | DBD Biz Regist (online) | DBD Biz Regist | DBD Biz Regist |
| Government fee | 50 baht | 1,000 baht | 1,000 baht | 5,500 baht (memorandum of association 500 + company registration 5,000) + stamp duty 200 (+200 if there are articles of association) |
| Accounting and auditor | No auditor. Keep income and expense records for tax filing (รอยืนยัน (awaiting confirmation): an individual's bookkeeping duty). | A qualified bookkeeper · a licensed auditor, except a partnership with capital up to 5 million, assets up to 30 million and revenue up to 30 million baht (but ภ.ง.ด.50 (PND 50, corporate income tax return) must attach the report of the person who audited and certified the accounts) | Same as the registered ordinary partnership | A qualified bookkeeper + a licensed auditor who audits the financial statements every year |
| Income tax | Progressive rate 0–35% (section 2) | Corporate income tax (section 2) | Corporate income tax | Corporate income tax |
| Yearly filings | ภ.ง.ด.90 and ภ.ง.ด.94 (PND 90 and PND 94, individual income tax returns; see `thai-tax`) | Financial statements + ภ.ง.ด.50 (see `thai-tax`) | Financial statements + ภ.ง.ด.50 | Shareholder meeting + financial statements + บอจ.5 (shareholder list) + ภ.ง.ด.50 |

**Decide with 5 questions**

1. Are you working alone or with partners? One person can start as an individual. A company needs 2 or more promoters.
2. Could the business take on a large debt or be sued (a loan · a high-value contract · a product that could injure someone)? If so, choose a form that limits liability.
3. About how much is the yearly profit? Then compare the tax as in section 2. At a profit of about 1 million baht, the tax is close for both forms. What differs is the yearly bookkeeping and audit burden.
4. Are your customers companies that want a tax invoice and withhold tax? Many business customers find it easier to buy from a juristic person (common practice, not law).
5. Can you carry the yearly bookkeeping and audit cost? Get quotes from 2–3 accounting firms before registering. The fees are market prices, with no official rate.

You can start small and move up later: a partnership can convert into a company for a 5,000 baht fee.

Last checked 2026-10-23 · Sources: the DBD manual for newly registered juristic persons (liability · bookkeeper · auditor · employer registration) https://www.dbd.go.th/storage/manual/644ffb30-f6bf-4e60-a3be-9db74a65509b.pdf · registering a partnership https://www.dbd.go.th/storage/manual/66c900f7-4df6-4344-b0c4-cd11a2ab7b20.pdf · registering a company in one day https://www.dbd.go.th/storage/manual/0097faba-992d-4e07-8f37-d029a4d6c133.pdf · commercial registration https://www.dbd.go.th/storage/manual/43eec450-c4b5-4fe5-9b9e-2814d961eeec.pdf · Ministerial Regulation on partnership and limited company fees, B.E. 2563 (2020) (กฎกระทรวงค่าธรรมเนียมห้างหุ้นส่วนและบริษัทจำกัด พ.ศ. 2563, Royal Gazette vol. 137, part 106 ก) https://www.dbd.go.th/data-storage/attachment/561b5f78c634931010a7d26420.PDF


## reference: income-tax-compare.md

# Income tax: individual vs juristic person (moved from SKILL.md section 2)

Part of the skill `thai-business-setup`. `thai-tax/scripts/tax-compare.mjs` uses this set of figures.

## 2 · Income tax: individual vs juristic person

**Individual** (tax year 2025 (B.E. 2568), per the ภ.ง.ด.90 (PND 90, individual income tax return) instructions)

Bracket table with the cumulative tax at the top of each band: `thai-tax` "Income tax brackets".

Someone with income other than salary of 120,000 baht or more must also use a second method: assessable income (excluding salary) × 0.5%. They pay whichever method gives more tax. If the second method comes to 5,000 baht or less, they pay by the bracket table in `thai-tax`. The personal allowance is 60,000 baht. For how a seller deducts expenses, use `thai-tax`.

**Juristic person**

| Type | Net profit | Rate |
|---|---|---|
| SME: paid-up capital at the last day of the accounting period of up to 5 million baht, and revenue from goods and services of up to 30 million baht | Up to 300,000 | Exempt |
| | 300,001–3,000,000 | 15% |
| | Over 3,000,000 | 20% |
| Does not meet the SME criteria | Every baht | 20% |

Last checked 2026-10-23 · Sources: the ภ.ง.ด.90 instructions for tax year 2025 (B.E. 2568) (rate table · method 2 × 0.005 · personal allowance) https://www.rd.go.th/fileadmin/tax_pdf/pit/2568/Ins90_241268.pdf · juristic person rates for accounting periods from 1 Jan 2017 onward https://www.rd.go.th/26218.html and the SME criteria https://www.rd.go.th/841.html (these 2 pages were last updated in 2017 and 2020 · no announcement of a rate change found)

**Example** Profit before tax of 1,000,000 baht a year (assumed figures)

| Form | Calculation | Tax (baht) |
|---|---|---|
| Individual (profit after actual expenses, then the 60,000 personal allowance) | Net income 940,000 → 65,000 + (940,000 − 750,000) × 20% | 103,000 |
| Individual, method 2 (assuming revenue of 4,000,000) | 4,000,000 × 0.5% = 20,000, which is below the first method, so pay by the first method | Not used |
| Company that meets the SME criteria | (1,000,000 − 300,000) × 15% | 105,000 |

The tax is close for both forms. But the remaining 895,000 baht in the company still belongs to the company. Paying it out as director salary or dividends adds a second layer of tax. Have an accountant work out both layers before deciding.

### Profit alone can mislead, so work out 3 scenarios

At a profit of 1,000,000 the individual pays slightly less. At a profit of 3,000,000 the company pays almost 200,000 less. Changing the business form is hard to undo, so look at several scenarios.

1. Ask the user for 3 things: yearly profit in a bad, middle and good case · the probability of each case (they add up to 1) · the extra bookkeeping and audit cost the company would pay, from real quotes · never fill in the probabilities or the bookkeeping cost for the user.
2. Node is required. Put the data in a file shaped like `thai-tax/scripts/example-company.json`, then run 2 commands.

```bash
node <path>/tax-compare.mjs company.json            # <path>: see Script path below · tax table for both forms per scenario
node tax-compare.mjs company.json --payoff > payoff.json
node decide.mjs payoff payoff.json                    # decision-scoring: expected value · worst case · maximum regret
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/thai-tax/scripts/tax-compare.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/thai-tax/scripts/tax-compare.mjs` · `decide.mjs` is in the `decision-desk/decision-scoring` skill of plugin `superuser` (if it is not installed, walk the user through the table for both forms and let them choose).

3. Read the result line. Expected value and minimum regret may point different ways. With probabilities 0.4 · 0.4 · 0.2 and a bookkeeping cost of 60,000, the output says "2 เกณฑ์ไม่ตรงกัน" (the 2 criteria disagree): expected value picks the individual, 172,400 vs 183,000. Minimum regret picks the company, 62,000 vs 182,000. This means the answer depends on the probabilities the user gave. Changing the form is hard to undo, so explain both criteria and let the user and the accountant decide. None of this includes the second layer of tax when money leaves the company.


## reference: registration.md

# Registration (moved from SKILL.md section 3)

Part of the skill `thai-business-setup`.

## 3 · Registration

### Individual: commercial registration (ทะเบียนพาณิชย์)

- You must register when you run a business covered by the Ministry of Commerce announcement of 2024 (B.E. 2567). Examples: selling goods at 300 baht a day or more, or holding 10,000 baht or more of stock for sale · buying and selling goods or services over the internet · acting as a broker or agent for goods worth 300 baht a day or more · making goods and selling them under the same criteria.
- Register within 30 days of starting the business. Register a change or closure within 30 days as well.
- In Bangkok, file at one of the 50 district offices (or the Standards, Finance and Property Office, Finance Bureau). Outside Bangkok, file at the municipality, the subdistrict administrative organization (อบต.) or Pattaya City, according to where the head office is.
- Fees: new registration 50 baht · each change 20 baht · closure 20 baht · replacement certificate 30 baht.
- Display the commercial registration certificate at the head office (or display it electronically). Put up a name sign at the head office and every branch.

### Partnership and company: DBD Biz Regist

From 1 Jul 2026 (B.E. 2569), new partnerships and companies register only through the digital juristic person registration system (DBD Biz Regist). Paper is no longer accepted. From 1 Nov 2026, every kind of partnership and company registration request is filed online only. For help with the system, call the Call Center on 1570.

1. Check and reserve the juristic person's name at reserve.dbd.go.th (if you still need to pick a name, use `product-naming`).
2. Prepare the data: head office address with the house code number · business objectives · capital and number of shares or invested amounts · promoters or partners · directors and signing authority (company) or the managing partner (partnership) · licensed auditor and fee (company) · 2 witnesses (company).
3. A company can register the memorandum of association and the company itself on the same day when all of these are done: every subscriber has signed for shares · the incorporation meeting is held and everyone agrees · the promoters hand the business over to the directors · at least 25% of the share value has been called up.
4. File the request in DBD Biz Regist and pay the fees in the table.
5. You receive a 13-digit juristic person registration number. This number serves as the taxpayer ID, and the social security employer registration is created automatically.
6. If the registered capital is over 5 million baht, or a shareholder or an authorized director is a foreigner, send extra documents as the registrar orders (see section 6).

| Item | Fee (baht) |
|---|---|
| Partnership registration | 1,000 |
| Memorandum of association registration | 500 |
| Limited company registration | 5,000 |
| Stamp duty on the memorandum of association · articles of association (if any) | 200 · 200 |
| Certificate | 40 per item |
| Registration certificate | 100 per copy |
| Certified copy of a document | 50 per page |
| Converting a partnership into a company | 5,000 |

The 50% discount for online filing under the 2020 (B.E. 2563) ministerial regulation was valid only until 31 Dec 2023. Today online filing costs the same as the rates in the table. DBD has a draft of a new fee regulation that was open for comment in Mar–Apr 2026 (รอยืนยัน (awaiting confirmation) whether it has been issued). So check the rate in the system before every payment.

Last checked 2026-10-23 · Sources: DBD news of 23 Oct 2026 (B.E. 2569) on online-only service from 1 Nov 2026 https://www.dbd.go.th/news/37630092569 · Lopburi Provincial Commerce Office announcement of 29 May 2026 on ending paper registration on 1 Jul 2026 https://lopburi.moc.go.th/th/content/category/detail/id/161/iid/166937 · fees and steps: the 3 DBD manuals and the ministerial regulation listed in section 1


## reference: sources.md

# Sources · thai-business-setup

Last checked 2026-10-23 · Sources: VAT registration threshold https://www.rd.go.th/7061.html · bookkeeping duty, VAT registration with incorporation and automatic employer registration: the DBD manual for newly registered juristic persons (link in section 1) · employee registration within 30 days: Social Security Office news of 30 Oct 2024 (B.E. 2567) (link in `thai-employment/references/offer-letter-first-week.md` section 8)

Origin of the idea: the order of questions for choosing a business form took its idea from https://github.com/Boom-Vitt/claude-thai-business-skills (MIT License · Copyright (c) 2026 Vittawat (boombignose) · LICENSE file checked 2026-10-23). It was rewritten from scratch with no copied text, and every figure was rechecked against official sources.
