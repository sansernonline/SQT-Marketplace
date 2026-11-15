---
name: marketplace-fees-pricing
description: Use when a Thai seller sets prices or checks marketplace fees
argument-hint: <product> <cost> <platform> [current price, category, target margin]
---

# Marketplace Fees and Pricing

Most small shops lose money not on bad products but on fees they never added up. Every fee is charged on the selling price, so it must go in the denominator of the price formula, not be added on top.

General information, not accounting advice — rates change several times a year and differ by category and shop type. Confirm in your own Seller Centre; for VAT treatment ask an accountant (นักบัญชี).

## Workflow

1. **Collect**: cost per unit (ต้นทุน incl. packaging), platform, shop type (ทั่วไป / Mall), exact category, shipping the seller pays per order, campaign programmes joined, VAT-registered or not, target margin %
2. **Look up rates** in [fee structures](references/fee-structures.md), then **open Seller Centre** (Shopee: ศูนย์ผู้ขาย → การเงิน/ค่าธรรมเนียม; Lazada: Seller Center → นโยบายค่าธรรมเนียม; TikTok Shop: Seller Center → Finance/ค่าธรรมเนียม) and replace every figure with the shop's own; anything not confirmed stays `(รอยืนยัน)`
3. **Compute** the price with the formula below
4. **Round** to a price ending in 9 or 0, then re-run the check at the rounded price
5. **Check the floor**: price during the biggest campaign (extra service fee, voucher, free-shipping fee) must still be above cost — if not, do not join that campaign with this SKU
6. **Record** the rates used and the date in the price sheet; re-check every month and after any platform announcement

## Formula

Let

- `C` = cost per unit incl. packaging · `S` = shipping the seller pays per order · `F` = fixed fees per order (e.g. ฿1.07)
- `r` = sum of all percentage fees charged on the price (commission + transaction + service/programme + growth fee), each as the rate **including VAT** the platform deducts
- `v` = 7/107 ≈ 0.0654 if the shop is VAT-registered and the price includes VAT, else 0
- `m` = target profit margin as a share of the price

```
Price P = (C + S + F) / (1 − r − v − m)
Profit  = P − C − S − F − r·P − v·P
```

Why not `cost × 1.3`? A 30% mark-up on ฿120 = ฿156; after a 14% fee load and ฿15 shipping that sells at a loss.

## Worked example

Tote bag: `C` ฿120, seller pays `S` ฿15 shipping subsidy, target `m` 20%, not VAT-registered. Rates are illustrative for a mid-rate category — replace with the shop's own.

| | Shopee (ทั่วไป) | Lazada (ทั่วไป) | TikTok Shop (ทั่วไป) |
|---|---|---|---|
| Commission (incl. VAT) | 10.70% (รอยืนยัน category) | 10.70% (รอยืนยัน category) | 5.35% (รอยืนยัน category) |
| Transaction/payment fee | 3.21% | 3.21% | 3.21% |
| Other % fee | — (no service programme) | — | Commerce Growth Fee 6.42% (รอยืนยัน — sources disagree: 6.42% per flowaccount.com 2026-08-10 vs 5.89% per flashfulfillment 2026-07-05; 5.35% for electronics) |
| Fixed per order | ฿1.07 | ฿0 | ฿1.07 only for shops that sold more than 100 items in the last 30 days (flowaccount.com 2026-08-10); smaller shops ฿0 |
| Formula price | ฿205.89 | ฿204.27 | ฿209.27 |
| **Rounded price** | **฿209** | **฿209** | **฿210** |
| Fees at the rounded price | 22.36 + 6.71 + 1.07 | 22.36 + 6.71 | 11.24 + 6.74 + 13.48 + 1.07 (the 1.07 applies only to a shop above the 100-items threshold) |
| Profit at the rounded price | ฿43.86 (21.0%) | ฿44.93 (21.5%) | ฿42.47 (20.2%) |

Same bag, **VAT-registered** shop on Shopee: formula price ฿228.50 → ฿229. At ฿229: commission 24.50, transaction 7.35, fixed 1.07, shipping 15, cost 120, output VAT 229 × 7/107 = 14.98 → profit ฿46.10 (20.1%). A VAT-registered shop may claim input VAT on the platform's fee invoices — ask the accountant; the formula above ignores that credit, which keeps it safe.

## Script

`price-calc.mjs` applies the formula above to one item at a time: it gives the formula price, the price rounded to end in 9 or 0, the fee on each line, the profit and its % at the rounded price, and the profit during a campaign if one is given (negative = do not join)

```
node price-calc.mjs <file.json> [--json]     # example file: scripts/example.json
node price-calc.mjs --self-test
```

Input file: `{ "rates_checked": "2026-10-06", "items": [ { "name": "...", "cost": 120, "shipping": 15, "fixed": 1.07, "margin_pct": 20, "vat_registered": false, "fees_pct": { "commission": 10.7, "transaction": 3.21 }, "campaign": { "extra_pct": 3, "voucher": 20 } } ] }` · `fees_pct` is the % already including VAT, and you can give any number of fields · `campaign` is optional · the script holds no platform rates in code, so enter them from the shop's own Seller Centre · `rates_checked` is the date checked, which the script prints in the result and warns about when it is older than 30 days (a default, not yet measured) · when it warns, open Seller Centre and read the new rates before using the prices · a total cost of 0 stops the script · a `margin_pct` below 1 (for example 0.2 instead of 20) and a voucher at or above the selling price raise a warning · a wrong field makes the script stop with a message that names the field · if fees + VAT + the wanted margin add up to 100% or more, the script says no price can be found

**Script path:** Installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/marketplace-fees-pricing/scripts/price-calc.mjs | sort -V | tail -1` · In the SQT-Marketplace repo: `plugins/e-commerce/skills/marketplace-fees-pricing/scripts/price-calc.mjs` · Node only, no dependencies

The result is supporting information, not accounting or tax advice.

## Price sheet columns

`SKU · platform · category · commission % · transaction % · other % · fixed ฿ · shipping ฿ · cost ฿ · VAT (Y/N) · price ฿ · profit ฿ · margin % · campaign floor ฿ · rates checked on (date)`

## Rules

- Never copy a rate from a blog without checking Seller Centre; blogs lag behind announcements
- Mall shops pay higher commission in most categories — never reuse a ทั่วไป price for a Mall shop
- Joining a free-shipping or cashback programme adds a percentage fee; price it as part of `r`
- Affiliate commission (TikTok Shop, Shopee, Lazada affiliate) is another percentage — add it to `r` for SKUs sold through creators
- A promotion is a new price — re-run the formula; a 20% discount on a 20% margin is a loss
- Every promotion states 3 things before it is priced: which SKUs, how deep, and the end date. Missing any one → ask the owner; never fill it in yourself. A promotion with no end date becomes the new normal price
- Show profit per unit before and after the promotion, and the expected total profit with the sales assumption written next to it ("ขายเพิ่มจาก 40 เป็น 70 ชิ้นต่อเดือน, owner's guess"). Campaign fees (9.9, 11.11 and the like) go into `r` first, as in step 5
- Offer the options that are not a price cut first, in this order: keep the price · shorter promotion · only the overstocked variants (`multi-shop-stock`, stuck stock). Then the smallest discount that reaches the owner's goal. If the owner set a maximum discount, say it is the owner's limit, not the platform's
- Prices on LINE and Facebook carry no platform fee but do carry payment fees (card/QR gateway) and the seller's own shipping — price them separately; payment by `promptpay-qr` has no gateway fee for a personal account (รอยืนยัน for business accounts)

## Related

- `shipping-compare` — `S` per parcel size
- `seller-tax-basics` — when to register VAT (sets `v`)
- `multi-shop-stock` — same SKU codes in the price sheet
- `doc-quotation` — B2B buyers who need a quotation with VAT

## เรียกเป็นคำสั่ง

`/e-commerce:marketplace-fees-pricing <product> <cost> <platform> [current price, category, target margin]`

Run `marketplace-fees-pricing` with the `shop-manager` agent for: **$ARGUMENTS**

Show the full cost table in baht and the margin %. Mark every fee rate that was not confirmed in the seller's own Seller Centre as (รอยืนยัน).
