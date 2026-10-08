# skill: multi-shop-stock

Use when one seller lists the same stock on several marketplaces and oversells or loses count. Master stock sheet, SKU naming, sync rules, reorder point.

# Multi-shop Stock

One shelf, five shop windows. Every platform thinks it owns the whole shelf, so the seller must keep one master count and tell each window how much it may show. An oversold order on Shopee or Lazada is a cancellation that hurts the shop's rating; on TikTok Shop it can cost a penalty (รอยืนยัน the current penalty rules in each Seller Centre).

## Workflow

1. **Name SKUs** with the scheme below, the same code on every platform's "seller SKU" field
2. **Build the master sheet** — one row per SKU (template below); Google Sheets so the phone can update it
3. **Count once** — physical count, write it in `on_hand`, date it
4. **Set each channel's shown stock** from the sync rules
5. **Daily routine** (the same time each day, before the courier cut-off):
   - export or read new orders from each platform → subtract in the master
   - add any goods received → add in the master
   - update each platform's stock from the master
6. **Weekly** — compare master with a physical count of the 10 fastest SKUs; fix differences and write the reason
7. **Reorder** when `available` falls to the reorder point

## SKU naming

`<CATEGORY 2–3 letters>-<PRODUCT 3–4>-<VARIANT>-<SIZE>`

| Example | Meaning |
|---|---|
| `BAG-TOTE-BLK-L` | bag, tote model, black, large |
| `SKN-SERM-30ML` | skincare, serum, 30 ml |
| `SET-TOTE2-BLK` | bundle of 2 black totes — a bundle has its own SKU and its components listed in the sheet |

Rules: capitals, hyphens, no Thai letters or spaces (some exports break on them), never reuse a retired code, colour codes fixed once (BLK, WHT, NVY, BEI…).

## Master sheet template

| SKU | Name (TH) | on_hand | reserved | available | buffer | Shopee | Lazada | TikTok | LINE/FB | avg/day | lead days | reorder point | reorder qty | supplier | last count |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BAG-TOTE-BLK-L | กระเป๋าผ้า ดำ L | 140 | 6 | =on_hand−reserved | 10 | | | | | 4.0 | 10 | | | | 2026-10-06 |

- `reserved` = paid orders not yet shipped
- `available` = `on_hand − reserved`
- `buffer` = units never shown anywhere, to absorb sync delay

## Sync rules (manual or with a tool)

| Situation | Shown stock per channel |
|---|---|
| Plenty (available > 50) | every channel shows `available − buffer` |
| Low (available 10–50) | show full `available − buffer` on the busiest channel only; others show a fixed small number (e.g. 3–5) |
| Very low (< 10) | sell on one channel only; set the others to 0 |
| During a live or flash sale | allocate a fixed quantity to that channel in advance; others get `available − buffer − allocation` |
| Bundle SKU | shown stock = min(component available ÷ units per bundle) |

**Buffer** = average orders that arrive between two syncs + 2. With syncs twice a day and 8 orders/day across channels: buffer = 4 + 2 = 6.

Multi-channel tools (BigSeller, Zort, Duoke and similar) sync stock automatically by seller SKU — they only work if step 1 is done. Prices and features change; compare before paying (รอยืนยัน current plans).

## Reorder point

```
Reorder point = average daily sales × supplier lead time (days) + safety stock
Safety stock  = (max daily sales × max lead time) − (average daily sales × average lead time)
Reorder qty   = average daily sales × days of cover wanted − (available − reorder point)
```

Worked example — `BAG-TOTE-BLK-L`, all channels together:

| Item | Value |
|---|---|
| Average daily sales (last 30 days) | 4.0 |
| Max daily sales (normal days, excl. 11.11) | 9 |
| Lead time average / max | 10 / 14 days |
| Safety stock | 9 × 14 − 4 × 10 = 126 − 40 = **86** |
| Reorder point | 4 × 10 + 86 = **126** |
| Days of cover wanted | 45 |
| Reorder qty when available = 126 | 4 × 45 = **180** |

Before a big campaign (9.9, 10.10, 11.11, 12.12, payday sales) raise average daily sales for the campaign window from last year's numbers, not this month's.

## Rules

- The master sheet is the only truth; never change a platform's stock without changing the master
- Cancel or returned-to-stock items go back only after inspection (`returns-and-bad-reviews`)
- Defective returns go to a separate `damaged` column, never to `on_hand`
- Write a reason for every manual adjustment; unexplained shrinkage above 2% of on-hand a month means a process problem
- Keep 12 months of sheets — the tax records in `seller-tax-basics` need purchase and stock history

## Related

- `product-listing` (variant names = SKU names), `marketplace-fees-pricing` (same SKU codes), `live-selling-script` (live allocation)
