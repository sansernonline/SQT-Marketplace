---
name: win-back-customers
description: Use when a shop wants lapsed regulars back (ลูกค้าเก่าหายไป, ลูกค้าประจำไม่กลับมา, win-back) from its own LINE, Facebook or store customer list.
---

# Win Back Customers

Part of plugin `e-commerce`. Wording follows `human-writing`. Finds regular customers who stopped buying, ranks them by what they used to spend, and drafts one message per person that the owner approves before it goes out.

> **One rule:** only contact people on the shop's own list who agreed to hear from it. Marketplace buyers belong to the platform; never message them outside it.

## Use when / not when

| Situation | Use |
|---|---|
| "ลูกค้าประจำหายไปหลายคน", sales from repeat buyers dropping, a slow month | this skill |
| Message to all LINE OA friends or a segment of 50+ | `line-broadcast` |
| Answer a customer who wrote first | `chat-reply-templates` |
| Low reviews by theme | `returns-and-bad-reviews`, monthly review |
| Consent, privacy notice, opt-out records | `pdpa-workflow` |

## Who may be contacted

1. **Marketplace buyers (Shopee, Lazada, TikTok Shop) are out of scope.** Their contact data belongs to the platform, and moving them to LINE or paying outside the platform breaks platform rules (`chat-reply-templates`, Rules). Use the platform's own follower vouchers instead.
2. **The shop's own list only**: LINE OA friends who ordered through LINE, Facebook page buyers, walk-in members, website customers.
3. **A marketing message needs a basis**: consent for marketing, or a clear opt-out in every message (`pdpa-workflow` section 2). No record of consent → do not send; ask the owner first.
4. **LINE push messages use quota** per recipient (`line-broadcast` section 1). 15 people is cheap; still count it.

## Steps

1. **Load the order history** (date, customer, amount, items) for at least 12 months.
2. **Find each customer's own rhythm**: the median days between their orders. Only customers with 3 or more orders have a rhythm.
3. **Lapsed** = days since the last order is more than 2 × their own median gap. A customer who buys every 20 days and has been gone 45 days is lapsed; one who buys every 90 days and has been gone 45 days is not. Do not use one shop-wide cut-off.
4. **Rank** lapsed customers by what they spent in the last 12 months before they stopped. Put first anyone who left a low review or a complaint and then stopped buying; that is the clearest sign something went wrong.
5. **Take at most 15 per round.** More than that and the messages become a broadcast.
6. **Draft one message per person** that names their real history ("ครีมกันแดดสูตรเดิมที่สั่งประจำ") and, if they complained, what changed since. Any offer must be one the owner already runs or approves now; never invent a discount. Each message ends with how to stop receiving messages.
7. **The owner approves each message** before sending. Log who was contacted, the date, and whether they bought within 30 days, so the next round knows what worked.

## Worked example

Own LINE shop, 12 months of orders (illustrative). คุณเอ: 9 orders, median gap 21 days, last order 58 days ago, ฿6,300 in 12 months, left a 2-star chat complaint about a leaking bottle 60 days ago → lapsed (58 > 42), ranked first. คุณบี: 3 orders, gap 95 days, last order 70 days ago → not lapsed.

Draft for คุณเอ (owner approves first):
> สวัสดีค่ะคุณเอ ร้าน{ร้าน}ค่ะ ครั้งก่อนขวดเซรั่มที่ส่งไปรั่ว ต้องขออภัยอีกครั้งนะคะ ตอนนี้ร้านเปลี่ยนเป็นขวดฝาล็อกและห่อกันกระแทก 2 ชั้นแล้วค่ะ ถ้าจะสั่งสูตรเดิมอีก ทักมาได้เลยนะคะ (ไม่อยากรับข้อความจากร้าน พิมพ์ "หยุด" ได้เลยค่ะ)

## Check before handing over

1. Every person on the list came from the shop's own channels and has a consent or opt-out record.
2. Lapsed is based on each person's own gap, not a shop-wide number.
3. No more than 15 people; each message names real history and has an opt-out line.
4. No offer that the owner has not approved; nothing sent before approval.

## Sources

- Anthropic `knowledge-work-plugins` small-business `reactivate` and `review-reputation` (lapse = gap beyond the customer's own rhythm, rank by value, approve each message), read 2026-11-10 through the lead's research notes. Ideas only, rewritten for Thai sellers; no text copied.
- The 2 × median-gap line and the 15-person cap are starting values, not measured on Thai shops.
