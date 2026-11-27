# Script input and promotion rules · marketplace-fees-pricing

Open this when preparing the `price-calc.mjs` input file, or when the owner asks to price a promotion, campaign, or LINE/Facebook sale.

## Script input

`{ "rates_checked": "2026-10-06", "items": [ { "name": "...", "cost": 120, "shipping": 15, "fixed": 1.07, "margin_pct": 20, "vat_registered": false, "fees_pct": { "commission": 10.7, "transaction": 3.21 }, "campaign": { "extra_pct": 3, "voucher": 20 } } ] }`

- `fees_pct` is the % already including VAT; any number of fields. `campaign` is optional. The script holds no platform rates; enter them from the shop's Seller Centre.
- `rates_checked` is the date checked. The script prints it and warns when older than 30 days (a default, not measured). When it warns, read the new rates in Seller Centre before using the prices.
- It stops on a total cost of 0, on a wrong field (naming it), and when fees + VAT + margin reach 100% or more (no price can be found). It warns on `margin_pct` below 1 (0.2 instead of 20) and on a voucher at or above the selling price.
- Script path, installed: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/pricing-and-costs/scripts/price-calc.mjs | sort -V | tail -1` · in the repo: `plugins/e-commerce/skills/pricing-and-costs/scripts/price-calc.mjs`. Node only.

## Promotions and other channels

- State 3 things before pricing a promotion: which SKUs, how deep, the end date. If any is missing, ask the owner; never fill it in. A promotion with no end date becomes the new normal price.
- Show profit per unit before and after the promotion, and expected total profit with the sales assumption written next to it ("ขายเพิ่มจาก 40 เป็น 70 ชิ้นต่อเดือน, owner's guess"). Campaign fees (9.9, 11.11 and the like) go into `r` first, as in step 5.
- Offer non-price-cut options first, in this order: keep the price · shorter promotion · only the overstocked variants (`shop-operations`, stuck stock). Then the smallest discount that reaches the owner's goal. If the owner set a maximum discount, say it is the owner's limit, not the platform's.
- Prices on LINE and Facebook carry no platform fee but do carry payment fees (card/QR gateway) and the seller's own shipping; price them separately. Payment by `shop-books` has no gateway fee for a personal account (รอยืนยัน for business accounts).
