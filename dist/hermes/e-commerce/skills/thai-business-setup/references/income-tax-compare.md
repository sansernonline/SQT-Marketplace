# Income tax: individual vs juristic person (moved from SKILL.md section 2)

Part of the skill `thai-business-setup`. `seller-tax-basics/scripts/tax-compare.mjs` uses this set of figures.

## 2 · Income tax: individual vs juristic person

**Individual** (tax year 2025 (B.E. 2568), per the ภ.ง.ด.90 (PND 90, individual income tax return) instructions)

| Net income (baht/year) | Rate | Cumulative tax up to the top of the band |
|---|---|---|
| Up to 150,000 | Exempt | 0 |
| 150,001–300,000 | 5% | 7,500 |
| 300,001–500,000 | 10% | 27,500 |
| 500,001–750,000 | 15% | 65,000 |
| 750,001–1,000,000 | 20% | 115,000 |
| 1,000,001–2,000,000 | 25% | 365,000 |
| 2,000,001–5,000,000 | 30% | 1,265,000 |
| Over 5,000,000 | 35% | |

Someone with income other than salary of 120,000 baht or more must also use a second method: assessable income (excluding salary) × 0.5%. They pay whichever method gives more tax. If the second method comes to 5,000 baht or less, they pay by the table above. The personal allowance is 60,000 baht. For how a seller deducts expenses, use `seller-tax-basics`.

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
2. Node is required. Put the data in a file shaped like `seller-tax-basics/scripts/example-company.json`, then run 2 commands.

```bash
node <path>/tax-compare.mjs company.json            # <path>: see Script path below · tax table for both forms per scenario
node tax-compare.mjs company.json --payoff > payoff.json
node decide.mjs payoff payoff.json                    # decision-scoring: expected value · worst case · maximum regret
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/seller-tax-basics/scripts/tax-compare.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/seller-tax-basics/scripts/tax-compare.mjs` · `decide.mjs` is in the `decision-scoring` skill of plugin `superuser` (if it is not installed, walk the user through the table for both forms and let them choose).

3. Read the result line. Expected value and minimum regret may point different ways. With probabilities 0.4 · 0.4 · 0.2 and a bookkeeping cost of 60,000, the output says "2 เกณฑ์ไม่ตรงกัน" (the 2 criteria disagree): expected value picks the individual, 172,400 vs 183,000. Minimum regret picks the company, 62,000 vs 182,000. This means the answer depends on the probabilities the user gave. Changing the form is hard to undo, so explain both criteria and let the user and the accountant decide. None of this includes the second layer of tax when money leaves the company.
