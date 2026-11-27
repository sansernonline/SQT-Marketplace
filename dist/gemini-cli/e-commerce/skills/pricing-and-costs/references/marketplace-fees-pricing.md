<!-- merged from skill `marketplace-fees-pricing` on 2026-11-27 · description was: Use when a Thai seller sets prices or checks marketplace fees -->
# Marketplace Fees and Pricing — selling price that covers every fee and keeps the margin

> **One rule:** every fee is charged on the selling price, so it goes in the denominator of the price formula, not added on top. General information, not accounting advice; for VAT treatment ask an accountant (นักบัญชี).

## Use when
- A Thai seller sets or checks a price on Shopee, Lazada or TikTok Shop
- Checking whether a promotion or campaign still leaves a profit
- Pricing for LINE or Facebook sales

Related: `shipping-compare.md` (`S` per parcel size) · `thai-tax` (when to register VAT, sets `v`) · `shop-operations` (same SKU codes) · `thai-business-docs` (B2B quotation with VAT)

## Steps
1. **Collect:** cost per unit (ต้นทุน incl. packaging), platform, shop type (ทั่วไป / Mall), exact category, shipping the seller pays per order, campaign programmes joined, VAT-registered or not, target margin %.
2. **Look up rates** in [`fee-structures.md`](fee-structures.md), then open Seller Centre (Shopee: ศูนย์ผู้ขาย → การเงิน/ค่าธรรมเนียม; Lazada: Seller Center → นโยบายค่าธรรมเนียม; TikTok Shop: Seller Center → Finance/ค่าธรรมเนียม) and replace every figure with the shop's own. Anything not confirmed stays `(รอยืนยัน)`. Never copy a rate from a blog without checking Seller Centre.
3. **Compute** with the formula below.
4. **Round** to a price ending in 9 or 0, then re-run the check at the rounded price.
5. **Check the floor:** the price during the biggest campaign (extra service fee, voucher, free-shipping fee) must still be above cost. If not, do not join that campaign with this SKU.
6. **Record** the rates used and the date in the price sheet; re-check every month and after any platform announcement.

## Formula
- `C` cost per unit incl. packaging · `S` shipping the seller pays per order · `F` fixed fees per order (e.g. ฿1.07)
- `r` sum of all percentage fees charged on the price (commission + transaction + service/programme + growth fee), each as the rate **including VAT** the platform deducts
- `v` = 7/107 ≈ 0.0654 if the shop is VAT-registered and the price includes VAT, else 0
- `m` target profit margin as a share of the price

```
Price P = (C + S + F) / (1 − r − v − m)
Profit  = P − C − S − F − r·P − v·P
```

## Script
`price-calc.mjs` applies the formula to one item at a time: formula price, price rounded to end in 9 or 0, the fee on each line, profit and its % at the rounded price, and profit during a campaign if one is given (negative = do not join).

```
node price-calc.mjs <file.json> [--json]     # example file: scripts/example.json
node price-calc.mjs --self-test
```

Input file format, warnings and script path: [`script-and-promotions.md`](script-and-promotions.md). The script holds no platform rates; enter them from the shop's Seller Centre. It warns when `rates_checked` is older than 30 days; then read the new rates in Seller Centre before using the prices.

## Rules
- Mall shops pay higher commission in most categories; never reuse a ทั่วไป price for a Mall shop.
- A free-shipping or cashback programme adds a percentage fee; put it in `r`. Affiliate commission (TikTok Shop, Shopee, Lazada) is another percentage; add it to `r` for SKUs sold through creators.
- A promotion is a new price: re-run the formula (a 20% discount on a 20% margin is a loss). Before pricing it, state which SKUs, how deep, and the end date; if any is missing, ask the owner and never fill it in. Show profit per unit before and after, and offer non-price-cut options first. Details, and LINE/Facebook channel pricing, in the reference.

## Check before done
- Every rate is from the seller's Seller Centre or marked `(รอยืนยัน)`
- The price was re-checked at the rounded price, and the campaign floor is above cost
- Rates and the date checked are in the price sheet: `SKU · platform · category · commission % · transaction % · other % · fixed ฿ · shipping ฿ · cost ฿ · VAT (Y/N) · price ฿ · profit ฿ · margin % · campaign floor ฿ · rates checked on (date)`
- The result says it is supporting information, not accounting or tax advice

## References
- [`fee-structures.md`](fee-structures.md) — open when looking up platform fee structures
- [`script-and-promotions.md`](script-and-promotions.md) — open when preparing the script input file, pricing a promotion or campaign, or pricing LINE/Facebook sales
- [`worked-example.md`](worked-example.md) — open to see the formula run on one product across 3 platforms, and the VAT-registered case

## เรียกเป็นคำสั่ง

`/e-commerce:pricing-and-costs <product> <cost> <platform> [current price, category, target margin]`

Run `pricing-and-costs` with the `shop-manager` agent for: **the user's request**

Show the full cost table in baht and the margin %. Mark every fee rate that was not confirmed in the seller's own Seller Centre as (รอยืนยัน).
