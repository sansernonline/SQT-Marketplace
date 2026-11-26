# skill: multi-shop-stock

Use when one stock sells on several marketplaces and oversells

# Multi-shop Stock — one master count, each channel shown only what it may sell

> **One rule:** the master sheet is the only truth. Never change a platform's stock without changing the master.

An oversold order on Shopee or Lazada is a cancellation that hurts the shop's rating; on TikTok Shop it can cost a penalty (รอยืนยัน the current penalty rules in each Seller Centre).

## Use when
- One stock sells on 2 or more marketplaces (Shopee · Lazada · TikTok Shop · LINE/FB) and orders get oversold.
- Setting up SKU codes, the master sheet, or sync rules; or running the daily count, reorder, or stuck-stock check.

Not for: pricing and fees → `marketplace-fees-pricing` · listings and variant names → `product-listing` · live allocation script → `live-selling-script`.

## Steps
1. **Name SKUs** with one scheme, the same code in every platform's "seller SKU" field. Scheme and examples: [`references/sku-and-sheet.md`](references/sku-and-sheet.md).
2. **Build the master sheet** in Google Sheets (so the phone can update it), one row per SKU. Columns: `on_hand` · `reserved` (paid, not shipped) · `available = on_hand − reserved` · `buffer` · a column per channel · avg/day · lead days · reorder point · reorder qty · supplier · last count. Template in the same file.
3. **Count once:** physical count into `on_hand`, dated.
4. **Set each channel's shown stock** from the sync rules below.
5. **Daily, at the same time before the courier cut-off:** read new orders from each platform and subtract in the master · add goods received · update each platform's stock from the master.
6. **Weekly:** compare the master with a physical count of the 10 fastest SKUs; fix differences and write the reason.
7. **Reorder** when `available` falls to the reorder point (below).
8. **Run `scripts/stock-calc.mjs` at every stock count**; do not work these out by hand. It gives per SKU: available, buffer, days left, stock level and what each channel may show, safety stock, reorder point and quantity, with warnings for oversold (negative available) and no-sales SKUs. Optional fields `on_order`, `unit_cost`, `days_since_sale` add the stuck-stock check.
   ```bash
   node scripts/stock-calc.mjs scripts/example.json     # BAG-TOTE-BLK-L → safety 86 · reorder point 126 · order 180 · stuck stock ฿6,970 in 2 SKUs
   node scripts/stock-calc.mjs --self-test
   ```
   Script path: installed from the marketplace → `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/multi-shop-stock/scripts/stock-calc.mjs | sort -V | tail -1` · in the SQT-Marketplace repo → `plugins/e-commerce/skills/multi-shop-stock/scripts/stock-calc.mjs`. Node only.
9. **At each monthly count, check stuck stock** (below).

### Sync rules
Every channel draws on one shared pool, so each channel shows at most `available − buffer`. The shown numbers do not add up to the pool; the buffer and the sync schedule stop overselling. Sync at least twice a day (more during a live).

| Situation | Shown stock per channel |
|---|---|
| Plenty (more than 14 days of sales left) | every channel shows `available − buffer` |
| Low (3–14 days left) | full `available − buffer` on the busiest channel only; others show a fixed small number (3–5) |
| Very low (under 3 days left, or available ≤ buffer) | sell on one channel only; set the others to 0 |
| During a live or flash sale | allocate a fixed quantity to that channel in advance; others get `available − buffer − allocation` |
| Bundle SKU | shown stock = min(component available ÷ units per bundle) |

- Days of sales left = `available ÷ average daily sales` (all channels). A fixed unit count does not work (50 units = 12 days at 4 a day, 250 days at 0.2 a day). The 14-day and 3-day lines are starting values, not measured; tune them to the supplier lead time.
- **Buffer** = average orders arriving between two syncs + 2. Syncs twice a day and 8 orders/day → 4 + 2 = 6. The +2 covers bursts (starting value, not measured; raise it if you still oversell).
- Multi-channel tools (BigSeller · Zort · Duoke) sync by seller SKU, so they work only if step 1 is done. Prices and features change; compare before paying (รอยืนยัน current plans).

### Reorder point
Reorder point = average daily sales × lead time + safety stock. Reorder qty = daily sales × days of cover wanted − (available + ordered but not arrived − reorder point). Count goods already on the way, or the same gap gets ordered twice. Before a big campaign (9.9 · 10.10 · 11.11 · 12.12 · payday), raise average daily sales from last year's window, not this month's. Leave days the SKU was out of stock out of average daily sales. Formulas, season rules, and a worked example: [`references/reorder-point.md`](references/reorder-point.md).

### Stuck stock (สินค้าค้างสต็อก)
Check it at every monthly count. Slow mover (เคลื่อนไหวช้า): no sale for 28 days · dead stock (สต็อกตาย): 90 days · overstock (ล้นสต็อก): more than 120 days of sales on hand. The script flags them, never reorders them, and prints money tied in stuck stock first (`เงินจมในสต็อกค้าง`). Put that baht line at the top of the report, then give the owner 3 choices per stuck SKU (keep · discount or bundle · delist) with the deciding numbers. Never reorder a slow or dead SKU, even below the reorder point; the owner decides. Choices, tests, and sources: [`references/stuck-stock.md`](references/stuck-stock.md).

## Check before done
- [ ] Every SKU has one code, the same on every platform.
- [ ] No channel shows more than `available − buffer` (or its allocation).
- [ ] Cancelled or returned items go back to stock only after inspection (`returns-and-bad-reviews`); defective returns go to a `damaged` column, never `on_hand`.
- [ ] Every manual adjustment has a reason; unexplained shrinkage above 2% of on-hand a month means a process problem.
- [ ] Sheets are kept as long as the tax records, at least 5 years (`seller-tax-basics`).

## References
- [`references/sku-and-sheet.md`](references/sku-and-sheet.md) — open at steps 1–2: SKU naming and the master sheet template.
- [`references/reorder-point.md`](references/reorder-point.md) — open when computing reorder point and quantity by hand or checking the script.
- [`references/stuck-stock.md`](references/stuck-stock.md) — open when the script reports stuck SKUs: the 3 choices and their tests.
- [`references/sources.md`](references/sources.md) — where the stuck-stock thresholds come from.


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

## Campaigns, seasons, and stock-outs

- Before a big campaign (9.9 · 10.10 · 11.11 · 12.12 · payday), raise average daily sales for the window from last year's numbers, not this month's. Adjust for season only with a full year of history; with less, ask the owner what last year's peak looked like.
- Days the SKU was out of stock are not zero-demand days. Leave them out of average daily sales.


## reference: sku-and-sheet.md

# SKU naming and master sheet template

Open at step 1 and 2 when naming SKUs or building the master sheet.

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


## reference: sources.md

# Sources · multi-shop-stock

- The 28, 90 and 120-day lines for stuck stock are starting values taken from Anthropic's inventory-planner (`anthropics/knowledge-work-plugins` small-business, Apache-2.0, read 2026-11-10), not measured on Thai shops; tune them to your lead time.


## reference: stuck-stock.md

# Stuck stock (สินค้าค้างสต็อก)

Open at the monthly count when the script reports slow, dead, or overstock SKUs.

Reorder rules only see what runs out; the money lost quietly sits in what never sells.

| Status | Test | What the script does |
|---|---|---|
| Slow mover (เคลื่อนไหวช้า) | no sale for 28 days | no days-of-cover figure, never reorders |
| Dead stock (สต็อกตาย) | no sale for 90 days | same, flagged louder |
| Overstock (ล้นสต็อก) | more than 120 days of sales on hand | counts only the units beyond 120 days |

These lines are starting values, not measured on Thai shops (source in `references/sources.md`).
1. Put **one line in baht at the top of the report**: money tied in stuck stock = units × cost per unit. The script prints it first (`เงินจมในสต็อกค้าง`).
2. For each stuck SKU give the owner 3 choices with the numbers that decide them (units left · sales per day · gross profit per unit, `marketplace-fees-pricing`): **Keep** (stock is small, or a campaign sold it last year) · **Discount or bundle** (price still above cost after campaign fees; bundle with a fast seller) · **Delist** (no sale in 90 days and a discount would sell below cost; clear through a sale lot or return to the supplier if terms allow).
3. Never reorder a slow or dead SKU, even below the reorder point. The owner decides, the sheet does not.

