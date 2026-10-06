---
name: subscription-audit
description: Use when the user wants to find and cut recurring charges — streaming, App Store or Google Play, gym, cloud storage, software — from Thai bank or credit-card statements, or set reminders before free trials end.
---

# Subscription Audit

Small monthly charges hide well. Once a quarter, put every one of them on a single page and decide on each.

## Inputs

- The last **3 months** of statements: bank account (e.g. a KBank, SCB, Bangkok Bank or Krungthai e-statement PDF or app export) and every credit card. Annual charges only show up in **12 months** of statements, so ask for 12 if the user has them
- Store lists: iPhone `Settings → [your name] → Subscriptions`. Android: `Play Store → profile icon → Payments & subscriptions → Subscriptions`
- PayPal, LINE Pay, TrueMoney and Rabbit LINE Pay auto-debits, if the user has them

## Steps

1. **Extract recurring lines.** A line counts as recurring when the same merchant appears at a similar amount and a similar day across 2 or more months, or once a year at the same date. Thai statement descriptors and patterns are listed in [references/statement-patterns.md](references/statement-patterns.md)
2. **Normalise to baht per month.** Foreign-currency charges show the converted baht amount plus a foreign transaction fee on the card. Use the baht figure that was actually charged. Divide annual plans by 12
3. **Count use.** Ask how many times it was used last month (opens, episodes, gym visits, GB stored). If the user does not know, the honest answer is usually "almost never"
4. **Cost-per-use table.** Compute baht ÷ uses and fill in the table below
5. **Decide each line** using the decision rules below: **Cancel**, **Downgrade**, **Rotate** or **Keep**
6. **Cancel the right way.** Each charge is billed through one channel: the App Store, Google Play, the merchant's website or a carrier bill. Cancel through that channel. Steps are in [references/cancel-steps.md](references/cancel-steps.md)
7. **Trial watch.** For every free trial, add a calendar reminder **2 days before** it ends. Apple's rule is to cancel at least 24 hours before the trial ends
8. **Log it.** Append the result to `subscriptions.md`: the date, the table, money saved per month and per year, and the date of the next audit (in 3 months)

## Cost-per-use table (template)

| Service | Billed via | ฿/month | Uses last month | ฿/use | Overlaps with | Decision | Done? |
|---|---|---:|---:|---:|---|---|---|
| | | | | | | | |

## Decision rules

| Situation | Decision |
|---|---|
| 0 uses in 30 days | **Cancel** now. Re-subscribing later costs nothing |
| ฿/use above what one use would cost bought singly (a cinema ticket, a day pass) | **Cancel** or switch to pay-per-use |
| Two services do the same job (2 video streamers, 2 cloud drives) | Keep the one used more. **Rotate** the other: one month on, then cancel |
| Used, but only the basic features | **Downgrade** to a cheaper tier or to an ad-supported tier |
| Used weekly or more, ฿/use is low | **Keep**. Then check whether the annual plan is cheaper (next section) |
| Family members pay separately for the same service | Move to a family plan if the plan rules allow it |
| Cannot find what the charge is | Search the descriptor. If it is still unknown, call the card issuer. This may be fraud. See `digital-hygiene` |

## Annual versus monthly — worked example

The numbers are illustrative. Use the user's real prices.

- Monthly plan ฿149 × 12 = **฿1,788 per year**
- Annual plan **฿1,490 per year** → saves ฿298, which is about 17%
- **Break-even:** ฿1,490 ÷ ฿149 = **10 months**. Buy the annual plan only if you are confident you will still use the service in month 10 or later
- Rule: a service the user has kept for **12 months or more** with steady use is a candidate for annual billing. Something new or seasonal stays monthly
- Remember the opportunity cost: the annual plan locks in the money up front. With no refund on cancellation, and Apple and Google generally do not refund partial periods, a cancellation in month 4 loses about 8 months of value

## Worked example — a quarterly audit

| Service | Billed via | ฿/month | Uses | ฿/use | Decision |
|---|---|---:|---:|---:|---|
| Video streamer A | Credit card | 419 | 12 episodes | 35 | Keep |
| Video streamer B | App Store | 299 | 1 | 299 | Rotate: cancel now, back in December for one series |
| Music | Google Play | 149 | daily | ~5 | Keep, move to the family plan with a spouse who pays 149 separately |
| Cloud storage 2 TB | App Store | 349 | uses 180 GB | — | Downgrade to the 200 GB tier |
| Fitness app | Credit card, annual ÷ 12 | 125 | 0 | — | Cancel, and set a reminder for the renewal date |

Saving: 299 + 149 + (349 − tier price) + 125 ≈ **฿600+/month**. Last line in `subscriptions.md`: "next audit 2027-01-06".

## Rules

- Uninstalling an app does **not** cancel its subscription. This is true on both Google Play and the App Store
- Cancel through the channel that bills the charge. Cancelling on the website does not stop an App Store charge
- Screenshot the cancellation confirmation, or keep the email, until the next statement shows no charge
- A bank auto-debit (หักบัญชีอัตโนมัติ) for a gym or an insurer needs the merchant's cancellation form **and** a check of the bank's direct-debit list in the bank app
- Do not judge anyone's spending. Show the numbers and let the user decide

Related: `weekly-review` (put the trial-end reminders there), `important-docs` (contract renewal dates), and `personal-budget` and `scam-check` in the `trading-finance` plugin.
