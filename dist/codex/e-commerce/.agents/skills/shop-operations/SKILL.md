---
name: shop-operations
description: Use when stock oversells on marketplaces or a seller starts the day
---

# shop-operations — one stock count, shown fairly on every channel

> **One rule:** the master stock sheet is the only truth; a platform's stock number changes only after the master changes.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| One stock sells on several marketplaces and orders get oversold | [references/multi-shop-stock.md](references/multi-shop-stock.md) |
| Name SKUs and set up the master sheet | [references/sku-and-sheet.md](references/sku-and-sheet.md) |
| When to reorder, and how much to order | [references/reorder-point.md](references/reorder-point.md) |
| Stock that has stopped selling | [references/stuck-stock.md](references/stuck-stock.md) |
| "What must I do today?" at the start of the shop day | [references/shop-daily-briefing.md](references/shop-daily-briefing.md) |

Worked numbers for the parts: [references/worked-example.md](references/worked-example.md).

## Steps every part shares

1. Take the numbers from today's exports or the master sheet, never from memory.
2. Run `scripts/stock-calc.mjs` at each stock count, and use its output for the reorder point and the channel stock.
3. Write the date of the count next to every number.

## Check before done

- Each channel shows at most `available − buffer`; a bundle shows the smallest component count.
- Oversold SKUs (negative available) are flagged, and sales on extra channels stop.
- Returned goods go back to stock only after inspection; defective returns go to a `damaged` column, never `on_hand`.
- The daily briefing lists decisions and stops there: it sends no replies, cancels no order and places no reorder.
- A source that could not be exported today is named as missing in the report, never filled from yesterday.

Whole job with several steps → playbook [stock-sync](../superuser/references/playbook-stock-sync.md).
