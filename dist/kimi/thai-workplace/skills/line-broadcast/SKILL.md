---
name: line-broadcast
description: Use when sending a broadcast or targeted message to LINE OA friends. Quota math per package, narrowcast segments, send frequency, template, send log.
---

# LINE Broadcast

Every broadcast uses message quota and customers' patience. Check both before you send.

## 1. Quota math

A message is counted **per recipient**: 1 broadcast to 4,000 friends = 4,000 messages, whatever its length (1 send can hold up to 5 bubbles). "Target reach" (friends who have not blocked the OA) is the number that counts, not total friends.

| Package (ex VAT 7%) | Free/month | Extra | Sends to 4,000 reach that fit free | Cost of 8 sends to 4,000 reach |
|---|---|---|---|---|
| Free | 300 | not available | 0 (sending stops at quota) | — |
| Basic 1,280 baht | 15,000 | 0.10 baht | 3 | 32,000 msgs → 17,000 extra × 0.10 = 1,700 + 1,280 = **2,980 baht** |
| Pro 1,780 baht | 35,000 | 0.06 baht | 8 | 32,000 ≤ 35,000 → **1,780 baht** |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://lineforbusiness.com/th/service/line-oa-features/broadcast-message

Formulas: `messages = reach × sends` · `extra cost = max(0, messages − free) × rate`. Basic becomes dearer than Pro above about **20,000 messages/month** (extra Basic spend passes the 500-baht price gap).

Quota left: OA Manager → Insight, or the API `GET /v2/bot/message/quota` and `GET /v2/bot/message/quota/consumption`.

## 2. Segment instead of blasting

| Method | Where | Note |
|---|---|---|
| Audience by attribute (age, gender, region, OS) | OA Manager → target audience | LINE estimates attributes; the final audience must be **50+ recipients** |
| Retarget (clicked, chatted, joined via a QR) | OA Manager → audiences | best for promotions |
| Narrowcast with `recipient` / `filter.demographic` | Messaging API | same 50-recipient minimum |
| Multicast to a known `userId` list | Messaging API | up to 500 IDs per call; own CRM segment (e.g. bought in the last 90 days) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://developers.line.biz/en/reference/messaging-api/ (narrowcast: "the final number of recipients must be 50 or more")

## 3. Frequency and timing

| Content | Max frequency | Good time for a Thai audience |
|---|---|---|
| Promotion | 1 a week, ≤ 4 a month | Tue–Thu 12:00–13:00 or 19:00–21:00 |
| Service notice / news | when it matters | working hours |
| Payday campaign | 25th to 1st | evening |

If blocks pass about 1% of reach after 1 send, you are sending too often or to the wrong people. Halve the frequency or narrow the segment. Avoid Buddhist holy days and mourning periods for promotions (`thai-holidays`).

## 4. Workflow

1. Set the goal and 1 action (click, coupon, reply keyword).
2. Pick the segment and note the estimated reach.
3. Quota check — reach × sends against quota left; tell the user the numbers before scheduling.
4. Write from the template: [references/broadcast-template.md](references/broadcast-template.md).
5. Test send to staff (OA Manager → Test message).
6. Schedule and write the log line.
7. Next working day: opens, clicks, blocks into the log.

## Worked example

Café, Basic package, 5,200 friends, 4,600 target reach. Plan: 2 promos to everyone + 2 to "bought in 90 days" (1,850) this month.
Messages = 2 × 4,600 + 2 × 1,850 = 12,900 ≤ 15,000 → no extra cost; 2,100 left for order pushes.

## Rules

- No false urgency ("วันสุดท้าย!" every week trains people to ignore you, and misleading ads are a consumer-protection risk).
- Every promotion states its period and conditions (ระยะเวลา, เงื่อนไข) in the message or the linked page.
- Alcohol, supplements, cosmetics, medicine: check the advertising rules (อย., alcohol-advertising law) before sending.
- Personal details (name, order) only by push/multicast to that person — never in a broadcast.

## Related

`line-oa-setup` (packages) · `line-chatbot` (reply keywords) · `line-richmenu` · `thai-holidays` · `pdpa-workflow` · if installed: `live-selling-script` (online-seller).
