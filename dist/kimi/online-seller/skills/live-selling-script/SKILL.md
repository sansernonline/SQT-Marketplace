---
name: live-selling-script
description: Use when preparing a live selling session on TikTok Shop, Shopee, Lazada or Facebook. Run sheet, 3-second hook, flash-deal timing, Thai call-to-action lines.
---

# Live Selling Script

Viewers arrive and leave every few seconds. A live that works repeats a short loop — hook, show, prove, price, call to action — so a viewer who joins at minute 23 can still buy within a minute. Unscripted lives drift into greetings and dead air.

## Workflow

1. **Collect**: platform, length, host, backstage person, product list (normal price, live price, stock allocated to the live), shipping offer, vouchers already set
2. **Allocate stock** for the live in `multi-shop-stock` and set the live prices and vouchers in Seller Centre **before** going live
3. **Pick the hero product** (best seller or best deal) and 1–2 add-ons that pair with it
4. **Build the run sheet** (template below): 10–15 minute loops
5. **Write host lines** from [host lines](references/host-lines.md) — hook, proof, price, call to action per product
6. **Compliance pass** — every claim against `product-listing` prohibited claims; every price on air = price in the system
7. **Rehearse 5 minutes** with the backstage person: who pins products, who answers comments, who watches stock
8. **After the live**: record viewers, peak viewers, orders, sales, top question; 3 lessons for next time

## Run sheet — 60 minutes, two products + one flash deal

| Time | Segment | Host does | Backstage does |
|---|---|---|---|
| 0:00–0:03 | Hook | Hero product in hand, the deal in one line, no greetings first | Pin hero product |
| 0:03–0:10 | Hero rundown | Show, demo, size/texture close-up, price, CTA | Answer size/stock comments by name |
| 0:10–0:12 | Social proof | Read 2 real reviews, show sales count | Post voucher code in comments |
| 0:12–0:20 | Add-on product | Pair with hero ("ใช้คู่กับ..."), bundle price, CTA | Switch pinned product |
| 0:20–0:25 | **Flash deal #1** | Countdown 5 min, fixed units ("20 ชิ้นเท่านั้น") | Activate flash price, call out units left honestly |
| 0:25–0:27 | Re-hook | Restate the deal for new viewers | Re-pin hero |
| 0:27–0:45 | Loop 2 | Repeat hero + add-on with new angles (another colour, Q&A) | Note top questions |
| 0:45–0:50 | **Flash deal #2** (smaller, different SKU) | Same pattern | Same |
| 0:50–0:57 | Q&A + recap | Answer saved questions, recap all prices | Pin best seller |
| 0:57–1:00 | Close | Last call, next live date and time | Screenshot results |

Flash-deal rules of thumb: first deal after viewers have built up (around minute 15–25), not at minute 0; 3–10 minute window; quantity small enough to sell out (10–20% of the live allocation) so "หมดแล้ว" is true; never a fake countdown.

## Backstage checklist

- [ ] Live prices, vouchers and flash deal set and tested in a test order view
- [ ] Stock allocation entered; other channels reduced (`multi-shop-stock`)
- [ ] Phone on charger, stable Wi-Fi or 5G, ring light, clean background with the shop name
- [ ] Products in run-sheet order on the table, price cards written large
- [ ] Comment moderator ready; banned-word list set (competitor names, abuse)
- [ ] Thumbnail and teaser posted 1–3 hours before (`graphic-design` `social-formats`)

## Compliance

General information, not legal advice.

- Claims: the same อย./สคบ. rules as listings — no treat/cure, no "เห็นผลใน 7 วัน", no before/after body shots (`product-listing` [prohibited claims](../product-listing/references/prohibited-claims.md))
- Price: "ลดจาก X" only if X was a real recent selling price; spoken price must equal the system price
- Scarcity: units left and time left must be true — false urgency is misleading advertising
- Giveaways by draw (จับรางวัล/ชิงโชค) may need a permit under the gambling law; a giveaway to everyone who buys (ของแถมทุกออเดอร์) usually does not — check with the local district office before a draw (รอยืนยัน)
- Alcohol: selling alcoholic drinks through electronic channels has been banned since Dec 2020 (รอยืนยัน current status); tobacco and e-cigarettes cannot be sold
- Never show a buyer's full name, phone or address on screen when reading orders aloud — first name or username only

## Related

- `live-seller` agent, `marketplace-fees-pricing` (live price still above the campaign floor), `chat-reply-templates` (after-live questions)
