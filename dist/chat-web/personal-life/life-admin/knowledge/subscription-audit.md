# skill: subscription-audit

Use when finding and cutting recurring charges (streaming, app stores, gym, cloud storage, software) from Thai bank or card statements, or tracking free trials.

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


## reference: cancel-steps.md

# Cancellation steps by billing channel

Find out which channel bills the charge before cancelling. The statement descriptor tells you (see [statement-patterns.md](statement-patterns.md)).

## Apple (App Store, iCloud+)

1. Open Settings → tap your name → **Subscriptions** (การสมัครรับ / การสมัครสมาชิก)
2. Tap the subscription → **Cancel Subscription**. You may need to scroll down
3. If there is no Cancel button, or a red "expires" message is shown, it is already cancelled
4. Free trial: cancel **at least 24 hours before the trial ends** or it renews
5. Apple generally does not refund the unused part of a period. Access continues to the end of the paid period

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://support.apple.com/en-us/118428

## Google Play

1. Open the Play Store → profile icon → **Payments & subscriptions** → **Subscriptions**
2. Select the subscription → **Cancel subscription** → follow the prompts
3. Uninstalling the app does **not** cancel the subscription
4. You keep access for the time already paid

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://support.google.com/googleplay/answer/7018481

## Direct to the merchant (Netflix, Spotify and others)

1. Log in on the **website**, not the app. Some apps hide the billing settings
2. Account → Membership / Plan → Cancel
3. Save the confirmation email. Check the next statement

## Bank auto-debit (หักบัญชีอัตโนมัติ)

1. Submit the merchant's cancellation form in writing and keep a copy or the reference number
2. In the bank app, open the auto-debit or direct-debit list and confirm the mandate is removed. The menu name differs per bank (รอยืนยัน per bank)
3. Check the next statement

## Carrier-billed add-ons (บริการเสริม)

1. Check the operator's app for the list of active add-ons
2. Cancel in the app, or call the operator's call centre. Ask them to block premium content charges if the add-on was never wanted

## Template — trial reminder

```
Calendar event: "CANCEL <service> trial?"
Date: trial end date − 2 days, 09:00
Note: billed via <App Store / Google Play / card>, price after trial ฿<x>/month,
      cancel path: <one line from above>
```


## reference: statement-patterns.md

# Recurring-charge patterns on Thai statements

Merchant text varies by bank and by card network. Match on the **stable part** of the descriptor, such as `APPLE.COM/BILL`, and not on the reference number that follows it.

## Descriptor patterns

| Descriptor contains | Usually means | Where to cancel |
|---|---|---|
| `APPLE.COM/BILL`, `APPLE.COM/TH` | Any App Store, iCloud+, Apple Music or Apple TV+ subscription. Several apps are bundled under one descriptor | iPhone Settings → name → Subscriptions |
| `GOOGLE *` followed by a service name, e.g. `GOOGLE *YouTube`, `GOOGLE *Google One` | A Google Play app, YouTube Premium or Google One | Play Store → Payments & subscriptions |
| `NETFLIX.COM`, `SPOTIFY`, `DISNEY PLUS`, `VIU`, `WeTV`, `iQIYI`, `TrueID` | Streaming billed directly to the card | The merchant website → Account |
| `MICROSOFT*`, `ADOBE`, `CANVA`, `DROPBOX`, `OPENAI`, `ANTHROPIC` | Software or cloud services, often billed annually | The merchant website → Billing |
| `PAYPAL *` followed by a merchant | A merchant charging through PayPal | PayPal → Settings → Automatic payments, **and** the merchant |
| Telco names (AIS, TRUE, DTAC) with a content or VAS label | A carrier-billed add-on (บริการเสริม) | Dial the operator's cancel code or call the call centre (รอยืนยัน: codes vary by operator) |
| `หักบัญชีอัตโนมัติ`, `DIRECT DEBIT`, an insurer or gym name | A bank auto-debit | Merchant cancellation form + the bank app's direct-debit list |
| The same baht amount on the same day each month with no clear name | Could be anything, including fraud | Call the card issuer and ask for the merchant detail |

## Signals to look for

- **The same amount ±5%** on a similar day across months. Foreign-currency charges move with the exchange rate, so allow some variance
- **Annual renewals**: one larger charge once a year. Search 12 months of statements for the same merchant
- **Trial conversion**: a ฿0 or ฿1 authorisation followed about 7, 14 or 30 days later by the full price
- **Price creep**: the same merchant charging a higher amount than 6 months ago. Note it in the audit

## Foreign charges — what the baht number contains

| Item | Value | Note |
|---|---|---|
| VAT on foreign e-services (VAT for e-Service, VES) | 7%, collected since 1 September 2021 (1 ก.ย. 2564) | Usually already included in the listed price |
| Card foreign-transaction / currency-conversion fee | About 1–2.5% depending on issuer and card (รอยืนยัน with the user's card issuer) | Shown as a separate line or built into the exchange rate |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thaipost.net/economy-news/23941/ (VES collection) · https://marketeeronline.co/archives/344124 (card FX fee, not an issuer's own page, hence รอยืนยัน)
