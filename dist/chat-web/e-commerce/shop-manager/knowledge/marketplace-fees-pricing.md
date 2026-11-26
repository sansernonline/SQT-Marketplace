# skill: marketplace-fees-pricing

Use when a Thai seller sets prices or checks marketplace fees

# Marketplace Fees and Pricing — selling price that covers every fee and keeps the margin

> **One rule:** every fee is charged on the selling price, so it goes in the denominator of the price formula, not added on top. General information, not accounting advice; for VAT treatment ask an accountant (นักบัญชี).

## Use when
- A Thai seller sets or checks a price on Shopee, Lazada or TikTok Shop
- Checking whether a promotion or campaign still leaves a profit
- Pricing for LINE or Facebook sales

Related: `shipping-compare` (`S` per parcel size) · `seller-tax-basics` (when to register VAT, sets `v`) · `multi-shop-stock` (same SKU codes) · `doc-quotation` (B2B quotation with VAT)

## Steps
1. **Collect:** cost per unit (ต้นทุน incl. packaging), platform, shop type (ทั่วไป / Mall), exact category, shipping the seller pays per order, campaign programmes joined, VAT-registered or not, target margin %.
2. **Look up rates** in [`references/fee-structures.md`](references/fee-structures.md), then open Seller Centre (Shopee: ศูนย์ผู้ขาย → การเงิน/ค่าธรรมเนียม; Lazada: Seller Center → นโยบายค่าธรรมเนียม; TikTok Shop: Seller Center → Finance/ค่าธรรมเนียม) and replace every figure with the shop's own. Anything not confirmed stays `(รอยืนยัน)`. Never copy a rate from a blog without checking Seller Centre.
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

Input file format, warnings and script path: [`references/script-and-promotions.md`](references/script-and-promotions.md). The script holds no platform rates; enter them from the shop's Seller Centre. It warns when `rates_checked` is older than 30 days; then read the new rates in Seller Centre before using the prices.

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
- [`references/fee-structures.md`](references/fee-structures.md) — open when looking up platform fee structures
- [`references/script-and-promotions.md`](references/script-and-promotions.md) — open when preparing the script input file, pricing a promotion or campaign, or pricing LINE/Facebook sales
- [`references/worked-example.md`](references/worked-example.md) — open to see the formula run on one product across 3 platforms, and the VAT-registered case

## เรียกเป็นคำสั่ง

`/e-commerce:marketplace-fees-pricing <product> <cost> <platform> [current price, category, target margin]`

Run `marketplace-fees-pricing` with the `shop-manager` agent for: **$ARGUMENTS**

Show the full cost table in baht and the margin %. Mark every fee rate that was not confirmed in the seller's own Seller Centre as (รอยืนยัน).


## reference: fee-structures.md

# Fee structures — Shopee, Lazada, TikTok Shop (Thailand)

Rates below are the published structure as reported in August–September 2026. **They differ by category and shop, and change several times a year.** Treat every number as a starting point and confirm in the shop's own Seller Centre before pricing.

Note: in September 2026 the Trade Competition Commission of Thailand (สำนักงานคณะกรรมการการแข่งขันทางการค้า, กขค.) reportedly ordered Shopee, Lazada, TikTok Shop and other platforms to freeze merchant commission rates for six months while it reviews fee calculation. News on 2026-10-25 reports an order under ม.60 พ.ร.บ.การแข่งขันทางการค้า 2560 freezing GP, fee and commission rises for 6 large platforms (e-commerce and ride-hailing) from late Aug / 7 Sep 2569 until Feb 2570; it stops rises but sets no cap. The order itself was not found on otcc.or.th and the start date differs between sources (รอยืนยัน). ตรวจล่าสุด 2026-10-25 · แหล่ง: https://thaipbs.or.th/news/content/571385 · https://www.rainmaker.in.th/tcct-control-platform-gp-fees-sme/ · https://www.bigseller.com/blog/articleDetails/tcct-gp-freeze-6-months-thailand-sellers-2026.5035.htm

## Shopee (effective 4 Aug 2026 for the commission round — รอยืนยัน: a Thai news report on 2026-10-22 dates a commission rise to 1 Jun 2026 with non-Mall 7.49–14.98% and Mall 7.49–17.12%, which differs from the table; check Seller Centre)

| Fee | ทั่วไป (Non-Mall) | Mall | Basis |
|---|---|---|---|
| Commission (ค่าธรรมเนียมการขาย) | 7.49% – 17.12% by category | 7.49% – 19.26% by category | % of price, incl. VAT |
| Transaction fee (ค่าธรรมเนียมธุรกรรมการชำระเงิน) | 3% + VAT = 3.21% | same | % of order |
| Credit-card instalment / SPayLater | higher rate by term (≈5%–7% + VAT) | same | replaces transaction fee on those orders |
| Service / programme fee (e.g. free-shipping, cashback programmes) | ≈5.35% – 8.56% only if enrolled (รอยืนยัน) | varies | % of price |
| Platform infrastructure fee | ฿1 + VAT = ฿1.07 per completed order | same | per order, since 7 Apr 2026 |

Examples reported: fashion ≈17.12% (ทั่วไป), electronics ≈7.49%.

## Lazada (effective 1 Aug 2026)

| Fee | ทั่วไป | LazMall | Basis |
|---|---|---|---|
| Marketplace Service Fee (MSF, commission) | 6.96% – 17.12% by category | 6.96% – 18.73% by category | % of price, incl. VAT |
| Payment fee | 3.21% | 3.21% | % of order |
| Premium package / free-shipping programme | optional, extra % (รอยืนยัน) | varies | % of price |
| Fixed per-order fee | none reported | none reported | — |

Examples reported: fashion ≈17.12%, electronics ≈6.96%, gold ≈8.03%.

## TikTok Shop

| Fee | ทั่วไป | Mall | Basis |
|---|---|---|---|
| Commission (by category) | ≈5.35% – 6.42% | ≈5.35% – 7.49% | % of price, incl. VAT; category table changed 6 May 2026 |
| Transaction fee | 3.21% incl. VAT (orders from 21 Mar 2026) | same | % of order |
| Commerce Growth Fee | ≈5.35% – 6.42% (one source reports 5.89%), cap ฿199 per item (รอยืนยัน) | — | % of price |
| Infrastructure / platform fee | ฿1.07 per order (reported to apply above 100 items in 30 days — รอยืนยัน) | same | per order |
| Affiliate commission | set by the seller per product | same | % paid to creators |

## LINE / Facebook

No platform commission. Costs are the payment channel (card gateway ≈ a few % — รอยืนยัน with the provider; PromptPay transfer to a personal account usually free) and the seller's own shipping and COD fees (`shipping-compare`).

## Rate-check log (fill per shop)

| Date | Platform | Category | Commission | Transaction | Other | Fixed | Checked by |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://flowaccount.com/blog/commission-fees-ecommerce-shopee-lazada-tiktok/ · https://www.bigseller.com/blog/articleDetails/4883/shopee-thailand-sale-fee-2026-profit.htm · https://www.flashfulfillment.co.th/en/knowledge-center/tiktok-shop-fees-2026-thai-sellers-th-20260705 · https://www.mlex.com/mlex/amp/articles/2522138 — secondary sources; every rate (รอยืนยัน) in Seller Centre


## reference: script-and-promotions.md

# Script input and promotion rules · marketplace-fees-pricing

Open this when preparing the `price-calc.mjs` input file, or when the owner asks to price a promotion, campaign, or LINE/Facebook sale.

## Script input

`{ "rates_checked": "2026-10-06", "items": [ { "name": "...", "cost": 120, "shipping": 15, "fixed": 1.07, "margin_pct": 20, "vat_registered": false, "fees_pct": { "commission": 10.7, "transaction": 3.21 }, "campaign": { "extra_pct": 3, "voucher": 20 } } ] }`

- `fees_pct` is the % already including VAT; any number of fields. `campaign` is optional. The script holds no platform rates; enter them from the shop's Seller Centre.
- `rates_checked` is the date checked. The script prints it and warns when older than 30 days (a default, not measured). When it warns, read the new rates in Seller Centre before using the prices.
- It stops on a total cost of 0, on a wrong field (naming it), and when fees + VAT + margin reach 100% or more (no price can be found). It warns on `margin_pct` below 1 (0.2 instead of 20) and on a voucher at or above the selling price.
- Script path, installed: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/marketplace-fees-pricing/scripts/price-calc.mjs | sort -V | tail -1` · in the repo: `plugins/e-commerce/skills/marketplace-fees-pricing/scripts/price-calc.mjs`. Node only.

## Promotions and other channels

- State 3 things before pricing a promotion: which SKUs, how deep, the end date. If any is missing, ask the owner; never fill it in. A promotion with no end date becomes the new normal price.
- Show profit per unit before and after the promotion, and expected total profit with the sales assumption written next to it ("ขายเพิ่มจาก 40 เป็น 70 ชิ้นต่อเดือน, owner's guess"). Campaign fees (9.9, 11.11 and the like) go into `r` first, as in step 5.
- Offer non-price-cut options first, in this order: keep the price · shorter promotion · only the overstocked variants (`multi-shop-stock`, stuck stock). Then the smallest discount that reaches the owner's goal. If the owner set a maximum discount, say it is the owner's limit, not the platform's.
- Prices on LINE and Facebook carry no platform fee but do carry payment fees (card/QR gateway) and the seller's own shipping; price them separately. Payment by `promptpay-qr` has no gateway fee for a personal account (รอยืนยัน for business accounts).


## reference: worked-example.md

# Worked example · marketplace-fees-pricing

Open this when you want to see the formula applied across Shopee, Lazada and TikTok Shop, or the VAT-registered case.

Tote bag: `C` ฿120, seller pays `S` ฿15 shipping subsidy, target `m` 20%, not VAT-registered. Rates are illustrative for a mid-rate category; replace with the shop's own.

| | Shopee (ทั่วไป) | Lazada (ทั่วไป) | TikTok Shop (ทั่วไป) |
|---|---|---|---|
| Commission (incl. VAT) | 10.70% (รอยืนยัน category) | 10.70% (รอยืนยัน category) | 5.35% (รอยืนยัน category) |
| Transaction/payment fee | 3.21% | 3.21% | 3.21% |
| Other % fee | none (no service programme) | none | Commerce Growth Fee 6.42% (รอยืนยัน: sources disagree: 6.42% per flowaccount.com 2026-08-10 vs 5.89% per flashfulfillment 2026-07-05; 5.35% for electronics) |
| Fixed per order | ฿1.07 | ฿0 | ฿1.07 only for shops that sold more than 100 items in the last 30 days (flowaccount.com 2026-08-10); smaller shops ฿0 |
| Formula price | ฿205.89 | ฿204.27 | ฿209.27 |
| **Rounded price** | **฿209** | **฿209** | **฿210** |
| Fees at the rounded price | 22.36 + 6.71 + 1.07 | 22.36 + 6.71 | 11.24 + 6.74 + 13.48 + 1.07 (the 1.07 applies only to a shop above the 100-items threshold) |
| Profit at the rounded price | ฿43.86 (21.0%) | ฿44.93 (21.5%) | ฿42.47 (20.2%) |

Same bag, **VAT-registered** shop on Shopee: formula price ฿228.50 → ฿229. At ฿229: commission 24.50, transaction 7.35, fixed 1.07, shipping 15, cost 120, output VAT 229 × 7/107 = 14.98 → profit ฿46.10 (20.1%). A VAT-registered shop may claim input VAT on the platform's fee invoices; ask the accountant. The formula ignores that credit, which keeps it safe.

Why not `cost × 1.3`? A 30% mark-up on ฿120 = ฿156; after a 14% fee load and ฿15 shipping that sells at a loss.
