# skill: marketplace-fees-pricing

Use when a Thai seller asks what to charge, why a product loses money, or how Shopee, Lazada and TikTok Shop fees compare. Price formula with VAT and margin.

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
| Other % fee | — (no service programme) | — | Commerce Growth Fee 5.89% (รอยืนยัน) |
| Fixed per order | ฿1.07 | ฿0 | ฿1.07 |
| Formula price | ฿205.89 | ฿204.27 | ฿207.58 |
| **Rounded price** | **฿209** | **฿209** | **฿209** |
| Fees at ฿209 | 22.36 + 6.71 + 1.07 | 22.36 + 6.71 | 11.18 + 6.71 + 12.31 + 1.07 |
| Profit at ฿209 | ฿43.86 (21.0%) | ฿44.93 (21.5%) | ฿42.73 (20.4%) |

Same bag, **VAT-registered** shop on Shopee: formula price ฿228.50 → ฿229. At ฿229: commission 24.50, transaction 7.35, fixed 1.07, shipping 15, cost 120, output VAT 229 × 7/107 = 14.98 → profit ฿46.10 (20.1%). A VAT-registered shop may claim input VAT on the platform's fee invoices — ask the accountant; the formula above ignores that credit, which keeps it safe.

## Price sheet columns

`SKU · platform · category · commission % · transaction % · other % · fixed ฿ · shipping ฿ · cost ฿ · VAT (Y/N) · price ฿ · profit ฿ · margin % · campaign floor ฿ · rates checked on (date)`

## Rules

- Never copy a rate from a blog without checking Seller Centre; blogs lag behind announcements
- Mall shops pay higher commission in most categories — never reuse a ทั่วไป price for a Mall shop
- Joining a free-shipping or cashback programme adds a percentage fee; price it as part of `r`
- Affiliate commission (TikTok Shop, Shopee, Lazada affiliate) is another percentage — add it to `r` for SKUs sold through creators
- A promotion is a new price — re-run the formula; a 20% discount on a 20% margin is a loss
- Prices on LINE and Facebook carry no platform fee but do carry payment fees (card/QR gateway) and the seller's own shipping — price them separately; payment by `thai-workplace` `promptpay-qr` has no gateway fee for a personal account (รอยืนยัน for business accounts)

## Related

- `shipping-compare` — `S` per parcel size
- `seller-tax-basics` — when to register VAT (sets `v`)
- `multi-shop-stock` — same SKU codes in the price sheet
- `thai-workplace` `doc-quotation` — B2B buyers who need a quotation with VAT


## reference: fee-structures.md

# Fee structures — Shopee, Lazada, TikTok Shop (Thailand)

Rates below are the published structure as reported in August–September 2026. **They differ by category and shop, and change several times a year.** Treat every number as a starting point and confirm in the shop's own Seller Centre before pricing.

Note: in September 2026 the Trade Competition Commission of Thailand (สำนักงานคณะกรรมการการแข่งขันทางการค้า, กขค.) reportedly ordered Shopee, Lazada, TikTok Shop and other platforms to freeze merchant commission rates for six months while it reviews fee calculation. Scope and dates (รอยืนยัน) at otcc.or.th.

## Shopee (effective 4 Aug 2026 for the commission round)

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
