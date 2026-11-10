# skill: multi-shop-stock

Use when one seller lists the same stock on several marketplaces and oversells. Master stock sheet, SKUs.

# Multi-shop Stock

One shelf, five shop windows. Every platform thinks it owns the whole shelf, so the seller must keep one master count and tell each window how much it may show. An oversold order on Shopee or Lazada is a cancellation that hurts the shop's rating; on TikTok Shop it can cost a penalty (รอยืนยัน the current penalty rules in each Seller Centre).

## Workflow

1. **Name Stock Keeping Units (SKUs)** with the scheme below, the same code on every platform's "seller SKU" field
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
| BAG-TOTE-BLK-L | กระเป๋าผ้า ดำ L | 140 | 6 | =on_hand−reserved | 4 | | | | | 4.0 | 10 | | | | 2026-10-06 |

- `reserved` = paid orders not yet shipped
- `available` = `on_hand − reserved`
- `buffer` = units never shown anywhere, to absorb sync delay

## Sync rules (manual or with a tool)

Model: every channel draws on one shared pool, so each channel shows at most `available − buffer`. The channels' shown numbers do not add up to the pool — the buffer and the sync schedule are what stop overselling, so sync at least twice a day (more during a live).

| Situation | Shown stock per channel |
|---|---|
| Plenty (more than 14 days of sales left) | every channel shows `available − buffer` |
| Low (3–14 days left) | show full `available − buffer` on the busiest channel only; others show a fixed small number (e.g. 3–5) |
| Very low (under 3 days left, or available ≤ buffer) | sell on one channel only; set the others to 0 |
| During a live or flash sale | allocate a fixed quantity to that channel in advance; others get `available − buffer − allocation` |
| Bundle SKU | shown stock = min(component available ÷ units per bundle) |

Days of sales left = `available ÷ average daily sales` (all channels). A fixed unit count does not work: 50 units is 12 days for a SKU selling 4 a day but 250 days for one selling 0.2 a day. The 14-day and 3-day lines are starting values, not measured — tune them to your supplier lead time.

**Buffer** = average orders that arrive between two syncs + 2. With syncs twice a day and 8 orders/day across channels: buffer = 4 + 2 = 6. The +2 covers orders that arrive in a burst rather than evenly (starting value, not measured; raise it if you still oversell).

Multi-channel tools (BigSeller, Zort, Duoke and similar) sync stock automatically by seller SKU — they only work if step 1 is done. Prices and features change; compare before paying (รอยืนยัน current plans).

## Reorder point

Reorder point = average daily sales × lead time + safety stock (max-demand × max-lead minus the averages); reorder qty = daily sales × days of cover wanted − (available + already ordered but not arrived − reorder point). Count goods already on the way before ordering more, or the same gap gets ordered twice. Formulas and the `BAG-TOTE-BLK-L` worked example → [references/reorder-point.md](references/reorder-point.md); the script below computes them.

Before a big campaign (9.9, 10.10, 11.11, 12.12, payday sales) raise average daily sales for the campaign window from last year's numbers, not this month's. Adjust for season only when you hold a full year of sales history; with less, ask the owner what last year's peak looked like.

Days the SKU was out of stock are not zero-demand days. Leave them out of average daily sales, or a SKU that sold out fast looks slow and gets under-ordered.

### Run the script at every stock count

`scripts/stock-calc.mjs` does all of the above per SKU in one call: available, buffer, days left, stock level and what each channel may show, safety stock, reorder point and reorder quantity, with warnings for oversold (negative available) and no-sales SKUs. Optional fields `on_order`, `unit_cost` and `days_since_sale` add the stuck-stock check below. Do not work these out by hand.

```bash
node scripts/stock-calc.mjs scripts/example.json     # BAG-TOTE-BLK-L → safety 86 · reorder point 126 · order 180 · stuck stock ฿6,970 in 2 SKUs
node scripts/stock-calc.mjs --self-test
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/multi-shop-stock/scripts/stock-calc.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/multi-shop-stock/scripts/stock-calc.mjs` · Node only, no dependencies.

## Stuck stock (สินค้าค้างสต็อก)

Reorder rules only look at what runs out. The money a small shop loses quietly sits in what never sells. Check it at every monthly count.

| Status | Test | What the script does |
|---|---|---|
| Slow mover (เคลื่อนไหวช้า) | no sale for 28 days | no days-of-cover figure, never reorders |
| Dead stock (สต็อกตาย) | no sale for 90 days | same, flagged louder |
| Overstock (ล้นสต็อก) | more than 120 days of sales on hand | counts only the units beyond 120 days |

The 28, 90 and 120-day lines are starting values taken from Anthropic's inventory-planner (`anthropics/knowledge-work-plugins` small-business, Apache-2.0, read 2026-11-10), not measured on Thai shops; tune them to your lead time.

1. Put **one line in baht at the top of the report**: money tied in stuck stock = units × cost per unit. The script prints it first (`เงินจมในสต็อกค้าง`). This is the number owners act on.
2. For each stuck SKU give the owner 3 choices with the numbers that decide them: units left, sales per day, gross profit per unit (`marketplace-fees-pricing`).
   - **Keep**: stock is small or a campaign is coming that sold it last year
   - **Discount or bundle**: price still above cost after campaign fees; bundle with a fast seller (bundle SKU rules above)
   - **Delist or stop selling**: no sale in 90 days and a discount would sell below cost; clear through a sale lot or return to the supplier if the terms allow
3. Never reorder a slow or dead SKU, even when its count drops below the reorder point. The owner decides, the sheet does not.

## Rules

- The master sheet is the only truth; never change a platform's stock without changing the master
- Cancel or returned-to-stock items go back only after inspection (`returns-and-bad-reviews`)
- Defective returns go to a separate `damaged` column, never to `on_hand`
- Write a reason for every manual adjustment; unexplained shrinkage above 2% of on-hand a month means a process problem
- Keep the sheets as long as the tax records — at least 5 years (`seller-tax-basics`, records to keep); they back up purchase and stock history

## Related

- `product-listing` (variant names = SKU names), `marketplace-fees-pricing` (same SKU codes), `live-selling-script` (live allocation)


## reference: reorder-point.md

# Reorder point — formulas and worked example

Moved from `SKILL.md`. `scripts/stock-calc.mjs` computes all of this; open this file only to understand or check a result by hand.

```
Reorder point = average daily sales × supplier lead time (days) + safety stock
Safety stock  = (max daily sales × max lead time) − (average daily sales × average lead time)
Position      = available + on order (ordered, not yet arrived)
Reorder qty   = average daily sales × days of cover wanted − (position − reorder point)
```

Reorder only when position ≤ reorder point. Goods already on the way count, or the same gap gets ordered twice.

Worked example — `BAG-TOTE-BLK-L`, all channels together:

| Item | Value |
|---|---|
| Average daily sales (last 30 days) | 4.0 |
| Max daily sales (normal days, excl. 11.11) | 9 |
| Lead time average / max | 10 / 14 days |
| Safety stock | 9 × 14 − 4 × 10 = 126 − 40 = **86** |
| Reorder point | 4 × 10 + 86 = **126** |
| Days of cover wanted | 45 |
| Reorder qty when available = 126, nothing on order | 4 × 45 − (126 − 126) = **180** |
| Reorder qty when available = 126, 30 on order | position 156 > 126, so no order yet |
