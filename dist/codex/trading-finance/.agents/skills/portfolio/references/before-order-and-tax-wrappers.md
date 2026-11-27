# Checks before any order, and tax-wrapper switching · rebalance-and-dca

Open when the plan is about to turn into a sell, switch or buy, or when RMF, ThaiESG or SSF units are involved.

## Before any order

What comes out of the skill is a draft plan for the user, not an order. Before the user sells, switches or buys:

| Check | Why | How |
|---|---|---|
| Money already on its way | A pending DCA, a salary transfer or a dividend may close part of the gap for free | List money arriving in the next month and run `drift` again with it |
| Fund cut-off time and NAV date | An order after the cut-off gets the next day's NAV; a switch out and in may sit uninvested for 1–2 days | Read the cut-off and settlement days in each fund's prospectus or factsheet (รอยืนยัน per fund; never quote a time from memory) |
| Minimums and whole units | A fund's minimum order, a stock's board lot (rules in `position-sizing`), or a DR's lot can leave part of the plan unbuyable | Round the plan to what can actually be ordered and show the left-over cash |
| ETF or DR price vs its NAV | An exchange-traded fund (ETF) or depositary receipt (DR) can trade above or below the value it holds, more in thin trading | Compare the price with the latest indicative NAV on the issuer's page; avoid the first and last minutes of the session |
| Hard-to-sell holdings | Corporate bonds and thinly traded names cost more to sell than the band saves | Use a wider band for them, or only redirect new money there |

When DCA and selling are close, show both in baht: the cost of selling or switching now (fees + tax + commission) against the months DCA alone needs (`drift` output). If the months are near N, say so; the user picks.

## Tax-wrapped units

- Never rebalance by selling RMF, ThaiESG or old SSF units early; the tax saved must be repaid (`income-tax-th`).
- An RMF can be switched to another RMF, at the same or a different fund house, without breaking the holding period; the transfer must finish within 5 business days and may carry a fee (2 sources only, รอยืนยัน with the fund house).
- ThaiESG to ThaiESG and SSF to SSF switches: ask the receiving fund house whether the holding period carries over (รอยืนยัน).
- RMF DCA must not lapse: the 3% / 5,000 baht minimum was dropped from 1 Jan 2563, but the user must keep buying every year until age 55 and may skip at most 1 year in a row (a year with no income does not count as a skip).

Sources and check dates: [sources.md](sources.md).
