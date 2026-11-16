---
name: win-back-customers
description: Use when a shop wants lapsed regular customers back
---

# Win Back Customers

Finds regular customers who stopped buying, ranks them by what they used to spend, and drafts one message per person that the owner approves before it goes out.

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
3. **A marketing message needs a consent record**: send only to people with a recorded marketing consent (`pdpa-workflow` section 2, Marketing row), and put a way to stop in every message as well. An opt-out line alone is not a basis. No record of consent → do not send; ask the owner first. Whether legitimate interest can cover past buyers of the shop is (รอยืนยัน with a lawyer); until then, treat it as no.
4. **LINE push messages use quota** per recipient (`line-broadcast` section 1). 15 people is cheap; still count it.

## Steps

1. **Load the order history** (date, customer, amount, items) for at least 12 months.
2. **Find each customer's own rhythm**: the median days between their orders. Only customers with 3 or more orders have a rhythm.
3. **Lapsed** = days since the last order is more than 2 × their own median gap. A customer who buys every 20 days and has been gone 45 days is lapsed; one who buys every 90 days and has been gone 45 days is not. Do not use one shop-wide cut-off.
4. **Rank** lapsed customers by what they spent in the last 12 months before they stopped. Put first anyone who left a low review or a complaint and then stopped buying; that is the clearest sign something went wrong.
5. **Take at most 15 per round.** More than that and the messages become a broadcast.
6. **Draft one message per person** that names their real history ("ครีมกันแดดสูตรเดิมที่สั่งประจำ") and, if they complained, what changed since. Any offer must be one the owner already runs or approves now; never invent a discount. Each message ends with how to stop receiving messages.
7. **The owner approves each message** before sending. Log who was contacted, the date, and whether they bought within 30 days, so the next round knows what worked.

The 2 × median-gap line and the 15-person cap are starting values, not measured on Thai shops.

## Check before handing over

1. Every person on the list came from the shop's own channels and has a recorded marketing consent.
2. Lapsed is based on each person's own gap, not a shop-wide number.
3. No more than 15 people; each message names real history and ends with a way to stop receiving messages.
4. No offer that the owner has not approved; nothing sent before approval.

## References

- [`references/worked-example.md`](references/worked-example.md) — open for a worked example with a draft message
- [`references/sources.md`](references/sources.md) — credits
