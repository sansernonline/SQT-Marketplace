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
