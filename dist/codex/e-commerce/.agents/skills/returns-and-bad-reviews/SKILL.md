---
name: returns-and-bad-reviews
description: Use when a Thai online seller gets a return, refund request, dispute or 1-3 star review.
---

# Returns and Bad Reviews

A return handled fast costs one order. A return fought badly costs the shop rating, and a rude public reply costs every future buyer who reads it. Decide by rule, not by mood.

## Return windows (buyer side)

| Platform | Standard window | Notes |
|---|---|---|
| Shopee | 15 days from receipt ("คืนสินค้าได้ใน 15 วัน" / 15 Days Free Return on eligible items) (รอยืนยัน) | Some categories excluded; the seller agrees or disputes in Seller Centre within the response deadline (รอยืนยัน) |
| Lazada | 15 days from delivery for most sellers (รอยืนยัน); LazMall may differ | Change-of-mind returns depend on category and programme (รอยืนยัน) |
| TikTok Shop | 7 days after delivery (ทั่วไป); 15 days with free return for Mall (รอยืนยัน — no official Thai page found; check Seller Center) | "No longer needed" return reasons exist on some items (รอยืนยัน) |
| LINE / Facebook | Whatever the shop states | State it in the description and the chat auto-reply; consumer law still protects against defective goods |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.bigseller.com/blog/articleDetails/tiktok-shop-launches-no-longer-needed-return-policy.2213.htm · the windows above are from one third-party source, not an official page — confirm each window and response deadline in the platform's own Seller Centre help page before relying on it (รอยืนยัน)

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

Dispute only when both are true. (1) Hard rule: you hold proof (packing video, or tracking with photo or signature); no proof → refund fast. (2) The expected value is above ฿100 (starting value, not yet measured; raise it if disputes take your time or hurt your rating):

```
expected value = chance of winning x value at stake - cost of your time
value at stake = refund amount + shipping lost (+ rating points at risk, only if you can put a baht figure on them)
cost of time   = minutes spent x your hourly rate / 60
```

Start from a chance of winning of 0.7 for a clear video and 0.5 for tracking proof only (starting value, not yet measured; replace with the shop's own win rate once 10 disputes are logged). Example: ฿400 item, video proof, 20 minutes at ฿150 an hour → 0.7 x 400 - 50 = ฿230 → dispute. ฿120 item, tracking only, 20 minutes → 0.5 x 120 - 50 = ฿10, below ฿100 → refund fast and keep the rating. When the outcome hangs on a platform ruling you cannot estimate, `decision-scoring` command `payoff` compares dispute vs refund across scenarios. The numbers are information; the seller decides.

## Review replies

Bad reviews stay public; your reply is read by the next 1,000 buyers, not by the reviewer. Templates in [review replies](references/review-replies.md).

Do:

- Reply within 24–48 hours, short, calm, in the same language as the review
- Thank, acknowledge the specific problem, state what was done or offered, invite to chat
- State facts that help future buyers ("สินค้าไซซ์เล็กกว่าปกติ แนะนำเพิ่มหนึ่งไซซ์ ร้านเพิ่มตารางไซซ์แล้วค่ะ")
- Write for the next buyer, not the reviewer: answer the doubt a stranger has after reading the review, then stop. The reviewer gets the personal part in chat
- Sizing or fit complaint → name the measurement that caused it, the fix in the listing (size chart added, "สั่งเพิ่ม 1 ไซซ์"), and that exchange is open — a fit reply that removes the next buyer's doubt is the one that sells
- ข้อความภาษาไทย → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ แชตร้าน · ใช้กริยาตรง ("ร้านส่งของใหม่ให้แล้ว" ไม่ใช่ "ร้านได้ส่ง…แล้ว") · สัญญาสิ่งที่เปลี่ยนจริง 1 อย่าง ไม่ใช่ "กำลังปรับปรุง"

Don't:

- Argue, blame the buyer or the courier by name, or use sarcasm
- Post the order number, order details, the buyer's name, phone or address — one order number lets anyone look up the buyer
- Offer money, a coupon or a gift **in exchange for changing or deleting a review** — platforms treat it as review manipulation
- Buy fake reviews or ask friends to post them — penalties and possible removal
- Report a review only because it is negative; report it only if it breaks rules (abuse, personal data, spam, wrong product)

## Related

- `chat-reply-templates` (T4, T5), `shipping-compare` (claims), `multi-shop-stock` (damaged stock), `product-listing` (fix the cause in the listing)
