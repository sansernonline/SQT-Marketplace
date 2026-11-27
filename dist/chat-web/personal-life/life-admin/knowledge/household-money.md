# skill: household-money

Use when tracking power and water bills or cutting subscriptions

# household-money — household bills and subscription cuts

> **One rule:** Nothing is paid to a new account number until the user has checked it with a number they already trust. An old auto-debit is never treated as approval.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Read my electricity or water bill, or track the bills each month" | [`references/household-bills.md`](references/household-bills.md) |
| "Cut the subscriptions I don't use, or find charges on my statement" | [`references/subscription-audit.md`](references/subscription-audit.md) |

The bill tracker template is in `references/bill-tracker-template.md`. Statement patterns are in `references/statement-patterns.md`. Cancel steps are in `references/cancel-steps.md`.

## Check before done

- A bill or message that asks to pay a new account number is checked by calling the number on an old bill or in the utility's own app, never the number in the message. Nothing is paid until then.
- An old auto-debit is not approval. A jump in the amount is still checked.
- Do not judge anyone's spending. Show the numbers and let the user decide.
- Units and percentages are calculated by the script, not by hand: `node power-bill.mjs --history scripts/example-history.json`.
- A charge nobody can name may be fraud. Call the card issuer, and see `digital-hygiene`.
- Say once that this is general information, not financial advice. For a large money decision, ask a licensed adviser.
- A whole bills or subscriptions job → playbooks `superuser/references/playbook-bills.md` or `playbook-subscriptions.md`.


## reference: bill-tracker-template.md

# Monthly bill tracker — template

Copy into a spreadsheet or a shared note. Use **one sheet (or one block of rows) per metered service**, one row per month, so the spike formula only ever compares the same service. Put the unit name in the column header and keep column D numbers only.

### Block 1 — ไฟฟ้า (header row = row 1)

| เดือน | ผู้ให้บริการ | จำนวนวันรอบบิล | หน่วยที่ใช้ (kWh) | ยอดเงิน (บาท) | ครบกำหนดชำระ | วิธีชำระ | ชำระแล้ว | หมายเหตุ |
|---|---|---|---|---|---|---|---|---|
| 2569-06 | กฟน. | 30 | 318 | | | หักบัญชี | ☐ | |
| 2569-07 | กฟน. | 31 | 305 | | | หักบัญชี | ☐ | |
| 2569-08 | กฟน. | 30 | 330 | | | หักบัญชี | ☐ | |
| 2569-09 | กฟน. | 30 | 352 | | | หักบัญชี | ☐ | |

### Block 2 — น้ำประปา (same layout; column D header = หน่วยที่ใช้ (ลบ.ม.), numbers only)

| เดือน | ผู้ให้บริการ | จำนวนวันรอบบิล | หน่วยที่ใช้ (ลบ.ม.) | ยอดเงิน (บาท) | ครบกำหนดชำระ | วิธีชำระ | ชำระแล้ว | หมายเหตุ |
|---|---|---|---|---|---|---|---|---|
| 2569-09 | กปน. | 31 | 22 | | | หักบัญชี | ☐ | |

### Block 3 — บิลที่ไม่มีหน่วยวัด (ยอดเงินอย่างเดียว ไม่ใช้สูตรเตือนข้างล่าง)

| เดือน | บริการ | ผู้ให้บริการ | ยอดเงิน (บาท) | ครบกำหนดชำระ | วิธีชำระ | ชำระแล้ว | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| 2569-09 | อินเทอร์เน็ตบ้าน | | | | บัตรเครดิต | ☐ | สัญญาหมด … |
| 2569-09 | มือถือ (พ่อ) | | | | | ☐ | |
| 2569-09 | มือถือ (แม่) | | | | | ☐ | |
| 2569-09 | ค่าส่วนกลาง | นิติบุคคล | | | | ☐ | |

## Spike flag formula (spreadsheet)

In Block 1 (units in column D, newest month in row 5, the three months before it in rows 2–4):

```
=IF(D5 > 1.2 * AVERAGE(D2:D4), "ตรวจ", "")
```

Compare units (column D), never baht — the Ft changes every four months. Copy the same formula down the block as rows are added (it then moves to the 3 rows above). Do not use it on Block 3.

## Account numbers to keep (once)

| บริการ | หมายเลขผู้ใช้ / CA | หมายเลขมิเตอร์ | ชื่อผู้ใช้ตามบิล | เบอร์แจ้งเหตุ |
|---|---|---|---|---|
| ไฟฟ้า | | | | 1130 (กฟน.) / 1129 (กฟภ.) |
| น้ำประปา | | | | 1125 (กปน.) / 1662 (กปภ.) |
| อินเทอร์เน็ต | | – | | |


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


## reference: household-bills.md

<!-- merged from skill `household-bills` on 2026-11-27 · description was: Use when reading or tracking electricity and water bills -->
# Household Bills (Thailand)

## Contents

- [Who bills you](#who-bills-you)
- [Reading an electricity bill](#reading-an-electricity-bill)
- [Reading a water bill](#reading-a-water-bill)
- [Workflow](#workflow)
- [Spike investigation](#spike-investigation)
- [Script](#script)
- [Worked example](#worked-example)
- [Internet and mobile](#internet-and-mobile)
- [Related](#related)
- [เรียกเป็นคำสั่ง](#เรียกเป็นคำสั่ง)
- [References](#references)

Know what each line on the bill means, log it every month, and catch a spike in the month it happens rather than 3 months later.

## Who bills you

| Service | Bangkok, Nonthaburi, Samut Prakan | Rest of the country | App to check and pay |
|---|---|---|---|
| Electricity | การไฟฟ้านครหลวง (กฟน. / MEA) | การไฟฟ้าส่วนภูมิภาค (กฟภ. / PEA) | MEA Smart Life · PEA Smart Plus |
| Water | การประปานครหลวง (กปน. / MWA) | การประปาส่วนภูมิภาค (กปภ. / PWA), or a local องค์การปกครองส่วนท้องถิ่น (อปท.) system | MWA onMobile · PWA 1662 |
| Internet / mobile | AIS, True/dtac, 3BB (now with AIS), NT | same | each operator's app |

## Reading an electricity bill

The bill (ใบแจ้งค่าไฟฟ้า) adds 4 parts:

1. **ค่าพลังงานไฟฟ้า** — units (หน่วย = kWh) × the tiered base tariff for your type (your tariff type is printed on the bill; the old residential split 1.1.1 / 1.1.2 may have changed with the new home tariff — รอยืนยัน)
2. **ค่าบริการ** — a fixed monthly service charge
3. **ค่า Ft** — units × the Ft rate for the current 4-month period (can be positive or negative)
4. **ภาษีมูลค่าเพิ่ม 7%** on the sum of 1–3

Units used = เลขอ่านครั้งนี้ − เลขอ่านครั้งก่อน. Check the two readings are printed and the reading date (วันที่จดเลขอ่าน) is roughly 30 days after the last one — a period of 33 days or more inflates the bill and can push units into a higher tier.

| Item | Current value | Applies |
|---|---|---|
| Ft rate | 16.23 สตางค์/หน่วย | งวด ก.ย.–ธ.ค. 2569 |
| Average all-in tariff, Ft period (base 3.78 + Ft, before VAT) | 3.95 บาท/หน่วย | งวด ก.ย.–ธ.ค. 2569 |
| Average all-in tariff, new tiered home tariff, all users | 3.86 บาท/หน่วย (≈ 4.13 incl. VAT 7%) | tiered tariff from Sep 2569 bills |
| Residential tier rates and service charge | (รอยืนยัน) — read your type's table on mea.or.th / pea.co.th | คณะกรรมการกำกับกิจการพลังงาน (กกพ.) announced a new progressive home tariff on 13 ส.ค. 2569 for bills from ก.ย. 2569; tier rates not checked (รอยืนยัน) |

Ft is reset every 4 months (ม.ค.–เม.ย., พ.ค.–ส.ค., ก.ย.–ธ.ค.). When comparing months across a reset, compare **units**, not baht.

## Reading a water bill

ค่าน้ำประปา = units (ลูกบาศก์เมตร, ลบ.ม.) × progressive rate + ค่าบริการรายเดือน (by meter size, ½ inch for most homes) + VAT 7%. Rates differ between กปน. and กปภ. — use the rate table on the bill's back or mwa.co.th / pwa.co.th (รอยืนยัน for any figure you quote). A family of 4 in a house typically uses 15–30 ลบ.ม./month (รอยืนยัน — compare against your own last 6 months, which is the better baseline).

## Workflow

1. **Collect** the last 3–6 bills for each service (apps keep 12+ months of history)
2. **Log** each month in the tracker — [references/bill-tracker-template.md](bill-tracker-template.md)
3. **Set due dates** in the family calendar 3 days before each due date; note the disconnection date printed on the electricity bill (it is later than the due date — do not plan on it)
4. **Auto-debit** (หักบัญชีอัตโนมัติ) for fixed-ish bills: set it up in the bank app or the utility app; keep one account just for bills and check the debit on the statement each month. Before paying a batch or switching on a new debit:
   - **Check the money first.** Add up every bill due before the next salary and compare with what will be left in the account ("จ่าย 6 บิลวันศุกร์รวม 7,840 บาท เหลือ 3,100 ก่อนเงินเดือนเข้าวันที่ 25 · พอ"). The user gives the balance or checks it in the bank app; if nobody checked, say so plainly ("ยังไม่ได้ดูยอดเงินในบัญชี") instead of calling the plan safe
   - **An old auto-debit is not a standing approval.** A bill debited for 3 years is still looked at when its amount jumps (step 5); the debit just pays, it does not check
   - **A bill or message asking to pay into a new account number** is verified by calling the number printed on an old bill or the utility's own app, never one in the message, and nothing is paid until then (same rule as **Verify** in `weekly-review`)
5. **Spike check** — if a bill is >20% above the 3-month average in units (20% is a default threshold, not measured), run the checklist below · do not compute the percentage by hand: `node power-bill.mjs --history scripts/example-history.json` (4 months of units, oldest first)
6. **Monthly review** — 5 minutes on the 5th of each month; totals feed `trading-finance` `budget-and-debt` (if installed)

## Spike investigation

| Step | Check | What it tells you |
|---|---|---|
| 1 | Units vs. last 3 months (not baht) | Rule out a Ft or tariff change |
| 2 | Billing period length | 33+ days inflates usage |
| 3 | Was it read or estimated? (จดเลขจริง vs. ประมาณการ) | An estimate is corrected next month |
| 4 | Season | April–May aircon load is often 30–60% higher than December |
| 5 | **Electricity leak test**: switch off every appliance, watch the meter for 10 minutes | Meter still turning = leakage or a hidden load — call a licensed electrician |
| 6 | **Water leak test**: close all taps at night, read the meter, read again in the morning | Any movement = leak (toilet cistern, buried pipe, tank float valve) |
| 7 | New appliance, guest, work-from-home, a pet heater, an old fridge | Load change |
| 8 | Aircon not cleaned for 6+ months | See `home-upkeep` |
| 9 | Still unexplained | Ask the utility to test the meter (ขอตรวจสอบมิเตอร์) — call 1130 (กฟน.), 1129 (กฟภ.), 1125 (กปน.), 1662 (กปภ.) |

## Script

`power-bill.mjs` computes the bill as (tiered energy + service charge + Ft × units) + VAT 7%. Given 2 months it says how much of the difference comes from more units, from units moving into a higher tier, and from a Ft change; the three add up to the difference (VAT included).

```
node power-bill.mjs <file.json> [--json]     # example file: scripts/example.json
node power-bill.mjs --history <file.json>    # latest month vs the 3 before it, units only; example: scripts/example-history.json
node power-bill.mjs --self-test
```

Input file: `{ "tiers": [ { "upTo": 150, "rate": 3.0 }, { "upTo": null, "rate": 5.0 } ], "service": 25, "months": [ { "label": "Apr", "units": 330, "ft": 39.72 } ] }` · `rate` is baht/unit, `upTo` is the cumulative unit limit (last tier `null`), `ft` is satang/unit. One month = a bill; two months = a comparison. A bad field stops the script with a message naming it.

`scripts/rates.json` holds only what this file lists with a source: the Ft rate (16.23 สตางค์, ก.ย.–ธ.ค. 2569, checked 2026-10-14) and VAT. The tier rates and service charge are still (รอยืนยัน) above, so **you must pass `tiers` and `service` from the back of the user's bill**; the script stops and says so if they are missing. When the Ft period changes, pass `ft` in the file or update `rates.json`. `scripts/example.json` uses made-up tier rates, not real tariffs.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/personal-life/*/skills/household-money/scripts/power-bill.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/personal-life/skills/household-money/scripts/power-bill.mjs` · Node only, no dependencies.

The output is information; check it against the printed bill before acting.

## Worked example

A May bill of 412 units against a 318-unit average (+30%) is a spike; the full investigation is in [references/worked-example.md](worked-example.md) — open it when you want a model for the write-up.

## Internet and mobile

- List every line with the contract end date (สัญญาขั้นต่ำ) — early cancellation fees apply before it
- After the contract ends, call the operator's retention line and ask for the current promotion; a 30–40% reduction is common for a re-signed plan (รอยืนยัน, varies)
- Remove unused add-ons (data packs, content subscriptions charged to the mobile bill — check \*137 style SMS services)

## Related

`home-upkeep` · `trading-finance` `budget-and-debt` (if installed) · `family-legal` (keep the meter number, electricity customer number CA/รหัสผู้ใช้ไฟ, and water account number there)

## เรียกเป็นคำสั่ง

`/personal-life:household-money <bill figures or "tracker"> [month]`

Run `household-money` with the `home-manager` agent for: **the user's request**

Use the units and amounts printed on the bill, not estimates. Check the current Ft and tariff with การไฟฟ้านครหลวง (กฟน.) / การไฟฟ้าส่วนภูมิภาค (กฟภ.) / คณะกรรมการกำกับกิจการพลังงาน (กกพ.) before splitting the bill into its parts; anything unconfirmed is written as the official value + `(รอยืนยัน)`. If this month's units are more than 20% above the 3-month average in units (20% is a default, not measured), run the spike checklist. Get the percentage from `power-bill.mjs --history` (see `household-money`), not by hand.

## References

- [`sources.md`](sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: sources.md

# Sources · household-bills

ตรวจล่าสุด 2026-10-14 · แหล่ง: https://www.erc.or.th/th/news-release/3458 (ค่า Ft งวด ก.ย.–ธ.ค. 2569) · https://erc.or.th/th/news-release/3472 (อัตราแบบขั้นบันได 3.86) · https://www.naewna.com/business/979048


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
| Telco names (AIS, TRUE, DTAC) with a content or value-added service (VAS) label | A carrier-billed add-on (บริการเสริม) | Dial the operator's cancel code or call the call centre (รอยืนยัน: codes vary by operator) |
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


## reference: subscription-audit.md

<!-- merged from skill `subscription-audit` on 2026-11-27 · description was: Use when cutting recurring subscriptions and charges -->
# Subscription Audit

Small monthly charges hide well. Once a quarter, put every one of them on a single page and decide on each.

## Inputs

- The last **3 months** of statements: bank account (e.g. a KBank, SCB, Bangkok Bank or Krungthai e-statement PDF or app export) and every credit card. Annual charges only show up in **12 months** of statements, so ask for 12 if the user has them
- Store lists: iPhone `Settings → [your name] → Subscriptions`. Android: `Play Store → profile icon → Payments & subscriptions → Subscriptions`
- PayPal, Rabbit LINE Pay and TrueMoney auto-debits, if the user has them

## Steps

1. **Extract recurring lines.** A line counts as recurring when the same merchant appears at a similar amount and a similar day across 2 or more months, or once a year at the same date. Thai statement descriptors and patterns are listed in [references/statement-patterns.md](statement-patterns.md)
2. **Normalise to baht per month.** Foreign-currency charges show the converted baht amount plus a foreign transaction fee on the card. Use the baht figure that was actually charged. Divide annual plans by 12
3. **Count use.** Ask how many times it was used last month (opens, episodes, gym visits, GB stored). If the user does not know, the honest answer is usually "almost never"
4. **Cost-per-use table.** `฿/use = ฿ per month ÷ uses per month` (a service used 0 times has no ฿/use: it is a cancel by rule 1). Also write the **alternative price per use**: what one use costs bought singly or on the cheaper alternative (a cinema ticket, a day pass, the ad-supported tier ÷ uses). Fill in the table below
5. **Decide each line** using the decision rules below: **Cancel**, **Downgrade**, **Rotate** or **Keep**
6. **Cancel the right way.** Each charge is billed through one channel: the App Store, Google Play, the merchant's website or a carrier bill. Cancel through that channel. Steps are in [references/cancel-steps.md](cancel-steps.md)
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
| ฿/use above the alternative price per use (one use bought singly, or the cheaper tier ÷ uses) | **Cancel** or switch to pay-per-use or the cheaper tier |
| Two services do the same job (2 video streamers, 2 cloud drives) | Keep the one used more. **Rotate** the other: one month on, then cancel |
| Used, but only the basic features | **Downgrade** to a cheaper tier or to an ad-supported tier |
| Used weekly or more, and ฿/use is at most half of the alternative price per use (starting value, not yet measured) | **Keep**. Then check whether the annual plan is cheaper (next section) |
| ฿/use between half and 100% of the alternative price per use | **Keep for now**, mark "review next audit"; the user decides. Use goes down for 2 audits in a row → **Cancel** |
| Family members pay separately for the same service | Move to a family plan if the plan rules allow it |
| Cannot find what the charge is | Search the descriptor. If it is still unknown, call the card issuer. This may be fraud. See `digital-hygiene` |

## Annual versus monthly — worked example

The numbers are illustrative. Use the user's real prices.

- Monthly plan ฿149 × 12 = **฿1,788 per year**
- Annual plan **฿1,490 per year** → saves ฿298, which is about 17%
- **Break-even:** ฿1,490 ÷ ฿149 = **10 months**. Buy the annual plan only if you are confident you will still use the service in month 10 or later
- Rule: a service the user has kept for **12 months or more** with steady use is a candidate for annual billing. Something new or seasonal stays monthly
- Remember the opportunity cost: the annual plan locks in the money up front. With no refund on cancellation, and Apple and Google generally do not refund partial periods, a cancellation in month 4 loses about 8 months of value

## Rules

- Uninstalling an app does **not** cancel its subscription. This is true on both Google Play and the App Store
- Cancel through the channel that bills the charge. Cancelling on the website does not stop an App Store charge
- Screenshot the cancellation confirmation, or keep the email, until the next statement shows no charge
- A bank auto-debit (หักบัญชีอัตโนมัติ) for a gym or an insurer needs the merchant's cancellation form **and** a check of the bank's direct-debit list in the bank app
- Do not judge anyone's spending. Show the numbers and let the user decide

Related: `weekly-review` (put the trial-end reminders there), `family-legal` (contract renewal dates), and `budget-and-debt` and `scam-check` in the `trading-finance` plugin.

## References

- [`worked-example.md`](subscription-audit/worked-example.md) — open for a filled-in quarterly audit table

## เรียกเป็นคำสั่ง

`/personal-life:household-money <statement files or folder> [--months 3|12]`

Run the `household-money` skill with the `life-admin` agent on: **the user's request**

Produces the cost-per-use table, a decision per line, cancellation steps by billing channel (App Store, Google Play, merchant, bank auto-debit), the annual-versus-monthly break-even for anything kept, and a calendar reminder 2 days before every free trial ends. The result is appended to `subscriptions.md` with the next audit date.


## reference: worked-example.md

# Worked example · household-bills

## Worked example

A Bangkok house used 412 units in May against 318 / 305 / 330 in Feb–Apr (average 318). 412 / 318 = +30% → spike. Billing period 30 days, read not estimated. Night leak test: meter still. May is peak heat and 2 aircons were last cleaned 9 months ago. Action: clean both aircons (see `home-upkeep`), set them to 26 °C, re-check June units. June came in at 352 — the residual over April is seasonal.
