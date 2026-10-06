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
