---
name: line-broadcast
description: Use when sending broadcast messages to LINE OA friends
---

# LINE Broadcast

Every broadcast uses message quota and customers' patience. Check both before you send.

## 0 · Look for an existing format first (every time)

Before using the structure or templates in this file, check whether the user, customer or project already has its own format:

- **Where to look:** the shop's previous broadcast results in LINE Official Account Manager (open rate · click rate · number of blocks after sending) · the 2–3 best-performing messages · the shop's tone from real chats
- **Result:** found → use it (headings, order, field names, running numbers) and say in the reply which file the format came from · Not found → use the template in this file as a fallback and say that no earlier format was found
- **Always required in every format:** the template in section 4 is a fallback · judge whether a message is too long or sends so often that people block by the shop's own numbers

## 1. Quota math

A message is counted **per recipient**: 1 broadcast to 4,000 friends = 4,000 messages, whatever its length (1 send can hold up to 5 message objects). "Target reach" (friends who have not blocked the OA) is the number that counts, not total friends.

| Package (ex VAT 7%) | Free/month | Extra | Sends to 4,000 reach that fit free | Cost of 8 sends to 4,000 reach |
|---|---|---|---|---|
| Free | 300 | not available | 0 (sending stops at quota) | — |
| Basic 1,280 baht | 15,000 | 0.10 baht | 3 | 32,000 msgs → 17,000 extra × 0.10 = 1,700 + 1,280 = **2,980 baht** |
| Pro 1,780 baht | 35,000 | 0.06 baht | 8 | 32,000 ≤ 35,000 → **1,780 baht** |

Formulas: `messages = reach × sends` · `extra cost = max(0, messages − free) × rate`. Basic becomes dearer than Pro above about **20,000 messages/month** (extra Basic spend passes the 500-baht price gap).

Quota left: OA Manager → Insight, or the API `GET /v2/bot/message/quota` and `GET /v2/bot/message/quota/consumption`.

## 2. Segment instead of blasting

| Method | Where | Note |
|---|---|---|
| Audience by attribute (age, gender, region, OS) | OA Manager → target audience | LINE estimates attributes; the final audience must be **50+ recipients** |
| Retarget (clicked, chatted, joined via a QR) | OA Manager → audiences | best for promotions |
| Narrowcast with `recipient` / `filter.demographic` | Messaging API | same 50-recipient minimum |
| Multicast to a known `userId` list | Messaging API | up to 500 IDs per call; own CRM segment (e.g. bought in the last 90 days) |

Quota cannot cover every segment → pick the set by value (people x click rate x baht per click) against message cost with `decision-scoring` command `knapsack`; rules and a worked example in [references/segment-knapsack.md](references/segment-knapsack.md).

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
6. **Wait for the user's approval** of the final message, segment and quota numbers; schedule or send only after they say yes, then write the log line.
7. Next working day: opens, clicks, blocks into the log.

## Rules

- No false urgency ("วันสุดท้าย!" every week trains people to ignore you, and misleading ads are a consumer-protection risk).
- Every promotion states its period and conditions (ระยะเวลา, เงื่อนไข) in the message or the linked page.
- Alcohol, supplements, cosmetics, medicine: check the advertising rules (อย., alcohol-advertising law) before sending.
- Personal details (name, order) only by push/multicast to that person — never in a broadcast.

## Related

`line-oa-setup` (packages · optional MCP for sending) · `line-chatbot` (reply keywords) · `thai-holidays` · `pdpa-workflow` · `live-selling-script` · if installed: `line-richmenu` (graphic-design).

## References

- [`references/broadcast-template.md`](references/broadcast-template.md) — open at workflow step 4 to write the message
- [`references/segment-knapsack.md`](references/segment-knapsack.md) — open when quota cannot cover every segment
- [`references/worked-example.md`](references/worked-example.md) — open for a café plan with quota math and promo text
- [`references/sources.md`](references/sources.md) — sources and check dates for the quota table (2026-10-22) and segment rules (2026-10-06)
