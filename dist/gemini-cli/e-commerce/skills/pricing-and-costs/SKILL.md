---
name: pricing-and-costs
description: Use when pricing after fees, comparing couriers or import unit cost
---

# pricing-and-costs — prices after fees, shipping and import cost

> **One rule:** every fee and cost goes into the price formula with a rate the seller checked today, never a rate from memory or a blog.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Setting a selling price or checking marketplace fees and margin | [references/marketplace-fees-pricing.md](references/marketplace-fees-pricing.md) |
| Comparing couriers on last month's parcels | [references/shipping-compare.md](references/shipping-compare.md) |
| Goods from China, cost per unit after freight, duty and VAT | [references/import-landed-cost.md](references/import-landed-cost.md) |

Fee rates by platform: [references/fee-structures.md](references/fee-structures.md). Script notes: [references/script-and-promotions.md](references/script-and-promotions.md).

## Steps every part shares

1. Enter the shop's own rates from its Seller Centre or the courier's app, and write the date checked next to them.
2. Run the scripts in `scripts/` (`price-calc.mjs` for prices, `landed-cost.mjs` for imports) instead of working the numbers out by hand.
3. Show each result as a table: cost, each fee in baht, shipping, VAT, profit and margin %.

## Check before done

- Every rate has a source and a date; anything not confirmed stays `(รอยืนยัน)`.
- Price during the biggest campaign is still above cost; if not, do not join that campaign with that SKU.
- Mall shops use Mall rates, never the ทั่วไป price.
- Import duty: there is no default rate; the tariff code and rate are checked for each lot.
- General information only, not accounting, tax or legal advice; an accountant (นักบัญชี) signs off the VAT treatment.

Whole job with several steps → playbook [pricing-check](../superuser/references/playbook-pricing-check.md).
