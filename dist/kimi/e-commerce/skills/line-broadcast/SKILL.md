---
name: line-broadcast
description: Use when sending a broadcast or targeted message to LINE OA friends. Quota, segments, frequency.
---

# LINE Broadcast

Every broadcast uses message quota and customers' patience. Check both before you send.

## 1. Quota math

A message is counted **per recipient**: 1 broadcast to 4,000 friends = 4,000 messages, whatever its length (1 send can hold up to 5 message objects). "Target reach" (friends who have not blocked the OA) is the number that counts, not total friends.

| Package (ex VAT 7%) | Free/month | Extra | Sends to 4,000 reach that fit free | Cost of 8 sends to 4,000 reach |
|---|---|---|---|---|
| Free | 300 | not available | 0 (sending stops at quota) | — |
| Basic 1,280 baht | 15,000 | 0.10 baht | 3 | 32,000 msgs → 17,000 extra × 0.10 = 1,700 + 1,280 = **2,980 baht** |
| Pro 1,780 baht | 35,000 | 0.06 baht | 8 | 32,000 ≤ 35,000 → **1,780 baht** |

ตรวจล่าสุด 2026-10-22 (หน้าทางการ LINE for Business ยืนยันตาราง Free 300 · Basic 15,000 · Pro 35,000 ข้อความ) · แหล่ง: https://lineforbusiness.com/th/service/line-oa-features/broadcast-message

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

### Choose segments under the quota (ตัดสินด้วยตัวเลข)

When the quota cannot cover every segment, use `decision-scoring` command `knapsack` (`node decide.mjs knapsack <file.json>`).

| Part | Rule |
|---|---|
| Hard rules first | segment under the 50-recipient minimum is out · blocked friends are out · a segment already sent this week is out (frequency cap, section 3) |
| Budget | messages left this month = quota - messages already used (section 1) |
| Cost of a segment | messages = people x sends |
| Value of a segment | people x click rate x value per click (baht). Click rate from this OA's last broadcast to that segment; none yet → `(รอยืนยัน)` and use the lowest rate seen. Value per click = margin per order x orders per click |

Example: 15,000 messages left. Segment A 4,600 people, 3% click, ฿12 per click = ฿1,656 for 4,600 messages. Segment B 1,850 people, 8% click, ฿12 per click = ฿1,776 for 1,850 messages. B is worth more and costs less, so it goes first. The script finds the best set that fits the budget. Drop a segment when its extra message cost (section 1, extra rate) is above its value. The inputs are estimates: read the line "ชุดรองลงมา" in the result (shown only when there are 20 segments or fewer): if its gap from the best set is under 10% (starting value, not yet measured), the owner picks.

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

## Worked example

Café, Basic package, 5,200 friends, 4,600 target reach. Plan: 2 promos to everyone + 2 to "bought in 90 days" (1,850) this month.
Messages = 2 × 4,600 + 2 × 1,850 = 12,900 ≤ 15,000 → no extra cost; 2,100 left for order pushes.

Promo text for the first send (one `!` on the hook only, period and conditions stated, no "รีบ…เลย!"):
> กาแฟเย็นทุกแก้วลด 20%!
> 25–31 ต.ค. 2569 เฉพาะสั่งหน้าร้าน แสดงข้อความนี้ก่อนชำระเงิน
> ไม่ร่วมกับโปรโมชันอื่น · สาขา <ชื่อสาขา> เปิด 07:00–18:00

ข้อความภาษาไทย → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ แชตร้าน

## Rules

- No false urgency ("วันสุดท้าย!" every week trains people to ignore you, and misleading ads are a consumer-protection risk).
- Every promotion states its period and conditions (ระยะเวลา, เงื่อนไข) in the message or the linked page.
- Alcohol, supplements, cosmetics, medicine: check the advertising rules (อย., alcohol-advertising law) before sending.
- Personal details (name, order) only by push/multicast to that person — never in a broadcast.

## Related

`line-oa-setup` (packages) · `line-chatbot` (reply keywords) · `thai-holidays` · `pdpa-workflow` · `live-selling-script` · if installed: `line-richmenu` (graphic-design).
