---
name: returns-and-bad-reviews
description: Use when a Thai online seller gets a return, refund request, dispute or 1–3 star review on Shopee, Lazada, TikTok Shop, LINE or Facebook. Return windows, refund vs replace vs dispute, review replies.
---

# Returns and Bad Reviews

A return handled fast costs one order. A return fought badly costs the shop rating, and a rude public reply costs every future buyer who reads it. Decide by rule, not by mood.

## Return windows (buyer side)

| Platform | Standard window | Notes |
|---|---|---|
| Shopee | 15 days from receipt ("คืนสินค้าได้ใน 15 วัน" / 15 Days Free Return on eligible items) | Some categories excluded; the seller agrees or disputes in Seller Centre within the response deadline (รอยืนยัน) |
| Lazada | 15 days from delivery for most sellers; LazMall may differ | Change-of-mind returns depend on category and programme (รอยืนยัน) |
| TikTok Shop | 7 days after delivery (ทั่วไป); 15 days with free return for Mall | "No longer needed" return reasons exist on some items (รอยืนยัน) |
| LINE / Facebook | Whatever the shop states | State it in the description and the chat auto-reply; consumer law still protects against defective goods |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.bigseller.com/blog/articleDetails/tiktok-shop-launches-no-longer-needed-return-policy.2213.htm · Shopee and Lazada help centres — windows and response deadlines (รอยืนยัน) in each Seller Centre

## Workflow — return or refund request

1. **Read the request and evidence** — reason, photos, unboxing video, order history of this buyer
2. **Check your evidence** — packing video, weight at drop-off, tracking events
3. **Decide with the table** below; reply with `chat-reply-templates` T4 or T5
4. **Act inside the platform's deadline** — a missed deadline is usually an automatic refund to the buyer
5. **Inspect returned goods** before restocking; sellable → `on_hand`, defective → `damaged` (`multi-shop-stock`)
6. **Log the cause** — wrong item, size, damage, courier, misleading listing; fix the listing or packing if a cause repeats 3 times a month

## Decision table

| Situation | Action |
|---|---|
| Wrong item / missing item, and your packing video does not prove otherwise | Accept; send correct item or refund; apologise |
| Damaged in transit, buyer has photos | Accept; refund or resend; claim from courier (`shipping-compare`) |
| Defective product | Accept; refund or replace; check the batch |
| Item value under about ฿100–150 and return shipping costs more | Refund without return ("คืนเงินโดยไม่ต้องคืนสินค้า") if the platform allows |
| Change of mind, unopened, inside window | Accept per platform policy |
| Change of mind, used or opened hygiene item (cosmetics, underwear) outside policy | Decline politely with the policy; offer help |
| Buyer claims "not received", tracking shows delivered with photo/signature | Send the proof; ask buyer to check with household/guard; dispute only if buyer refuses |
| Your packing video clearly shows the correct, complete item | Dispute through the platform with the video |
| Same buyer, third suspicious claim | Dispute with evidence; report the account to the platform |

Rule of thumb: dispute only when you have video or tracking proof and the amount is worth the time; otherwise refund fast — the rating is worth more than one item.

## Review replies

Bad reviews stay public; your reply is read by the next 1,000 buyers, not by the reviewer. Templates in [review replies](references/review-replies.md).

Do:

- Reply within 24–48 hours, short, calm, in the same language as the review
- Thank, acknowledge the specific problem, state what was done or offered, invite to chat
- State facts that help future buyers ("สินค้าไซซ์เล็กกว่าปกติ แนะนำเพิ่มหนึ่งไซซ์ ร้านได้เพิ่มตารางไซซ์แล้วค่ะ")

Don't:

- Argue, blame the buyer or the courier by name, or use sarcasm
- Post order details, the buyer's name, phone or address
- Offer money, a coupon or a gift **in exchange for changing or deleting a review** — platforms treat it as review manipulation
- Buy fake reviews or ask friends to post them — penalties and possible removal
- Report a review only because it is negative; report it only if it breaks rules (abuse, personal data, spam, wrong product)

## Related

- `chat-reply-templates` (T4, T5), `shipping-compare` (claims), `multi-shop-stock` (damaged stock), `product-listing` (fix the cause in the listing)
