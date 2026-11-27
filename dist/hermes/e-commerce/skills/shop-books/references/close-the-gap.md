# Close the gap and worked example

Moved from `SKILL.md` section 4. Open when a forecast week closes below the buffer.

## Close the gap in order of cost per baht

Work down the list and stop when the shortfall (buffer minus lowest closing cash) is covered. Cost is shown as a yearly rate so the options compare.

| Order | Option | Cost per baht (formula) |
|---|---|---|
| 1 | Later supplier payment that loses no discount | 0% |
| 2 | Later supplier payment that gives up an early-pay discount of d% for n extra days | d / (100 - d) x 365 / n (example: 2% for 20 days = 37% a year) |
| 3 | Collect customer invoices early (a call, or a discount of e% for paying n days sooner) | call: 0% · discount: e / (100 - e) x 365 / n |
| 4 | Order less stock, or split the order in two lots | no interest; the cost is sales you may miss, so check the sell-through of those SKUs first |
| 5 | Short loan or card advance | (total fees + interest) / amount x 365 / days = yearly rate; ask the lender for the full yearly cost (interest + fees), not the headline monthly rate (current rates: ask the lender, รอยืนยัน) |

Two options at the same cost → take the one that is easier to undo. Row 4 can move above row 2 when the missed sales are small. These are formulas on quoted numbers; the owner decides, the table only shows which source costs least.

## Worked example — stock order before 11.11

Opening cash 80,000. Weekly fixed costs 15,000, buffer 30,000. Shopee lag from the shop's own payout reports is 10 days. Plan: pay a supplier 120,000 in week 2 for 11.11 stock; extra sales of 200,000 on 11.11 (week 4). Figures are illustrative.

| Week | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Opening | 80,000 | 100,000 | 0 | 20,000 | 40,000 | 240,000 |
| Payouts in | 35,000 | 35,000 | 35,000 | 35,000 | 35,000 + 180,000 (11.11, net of fees, ~10 days later) | 35,000 |
| Stock out | 0 | 120,000 | 0 | 0 | 0 | 0 |
| Fixed out | 15,000 | 15,000 | 15,000 | 15,000 | 15,000 | 15,000 |
| Closing | 100,000 | **0** | **20,000** | 40,000 | 240,000 | 260,000 |

Weeks 2 and 3 break the 30,000 buffer; one late payout or refused COD batch and the shop cannot pay rent. Options: pay a 60,000 deposit in week 2 and the balance in week 5, after the 11.11 payout lands, or ship the order in two lots. With the split, week 2 closes at 60,000, week 3 at 80,000, week 5 at 240,000.
