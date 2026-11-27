# skill: pricing-and-costs

Use when pricing after fees, comparing couriers or import unit cost

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

No platform commission. Costs are the payment channel (card gateway ≈ a few % — รอยืนยัน with the provider; PromptPay transfer to a personal account usually free) and the seller's own shipping and COD fees (`shipping-compare.md`).

## Rate-check log (fill per shop)

| Date | Platform | Category | Commission | Transaction | Other | Fixed | Checked by |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://flowaccount.com/blog/commission-fees-ecommerce-shopee-lazada-tiktok/ · https://www.bigseller.com/blog/articleDetails/4883/shopee-thailand-sale-fee-2026-profit.htm · https://www.flashfulfillment.co.th/en/knowledge-center/tiktok-shop-fees-2026-thai-sellers-th-20260705 · https://www.mlex.com/mlex/amp/articles/2522138 — secondary sources; every rate (รอยืนยัน) in Seller Centre


## reference: import-landed-cost.md

<!-- merged from skill `import-landed-cost` on 2026-11-27 · description was: Use when importing goods from China and costing each unit -->
# Landed cost per unit for goods imported from China

## Contents

- [Use when](#use-when)
- [1 · Formula](#1--formula)
- [2 · Rules for 2026 (B.E. 2569): the 1,500 baht duty exemption is cancelled](#2--rules-for-2026-be-2569-the-1500-baht-duty-exemption-is-cancelled)
- [3 · Find the duty rate and prohibitions](#3--find-the-duty-rate-and-prohibitions)
- [4 · Truck or sea](#4--truck-or-sea)
- [5 · Example: 200 fabric bags from 1688 by truck](#5--example-200-fabric-bags-from-1688-by-truck)
- [6 · Let the script calculate, never by hand](#6--let-the-script-calculate-never-by-hand)
- [7 · When to ask an accountant or a lawyer](#7--when-to-ask-an-accountant-or-a-lawyer)
- [8 · รออนุมัติ (awaiting approval)](#8--รออนุมัติ-awaiting-approval)
- [9 · Links to other skills](#9--links-to-other-skills)
- [Check before sending](#check-before-sending)
- [References](#references)

This skill works out the true cost per unit of goods ordered from China. The content is general information, not tax or legal advice. An accountant should recompute the tax figures of a real business.

CBM = cubic metre (called "คิว" in Thai).

> **One rule:** there is no default duty rate. Look up the tariff code and enter the rate yourself for every lot, and let the script do the calculation, never by hand.

## Use when

- Ordering goods from China (1688 · Taobao · a factory) through a freight forwarder, and wanting the cost per unit delivered to the shop
- Comparing a forwarder's quote for truck versus sea, or an all-in tax package versus paying taxes separately

Do not use when: choosing a business form or registering → `thai-business-setup` · setting selling prices on a platform once the cost is known → `marketplace-fees-pricing.md` · filing monthly VAT and using input tax → `thai-tax`

## 1 · Formula

```
CIF                  = goods cost + freight to the Thai customs border + insurance
import duty          = CIF × duty rate of the tariff code
excise tax           = only for goods that have it (recommended retail price × rate)
VAT                  = (CIF + duty + excise + other taxes if any) × 7%
cost delivered to shop = CIF + duty + excise + VAT + forwarder and clearance fees + delivery within Thailand
```

A business that is VAT-registered and imports in its own name can claim the import VAT as input tax. The Customs Department receipt serves as a tax invoice for the VAT part only, so this VAT is not counted as cost.

## 2 · Rules for 2026 (B.E. 2569): the 1,500 baht duty exemption is cancelled

- From 1 Jan 2026 (B.E. 2569), the only goods exempt from duty are those whose customs value per consignee is no more than 1 baht, under Customs Department Notification No. 219/2568 (ประกาศกรมศุลกากร ที่ 219/2568, which cancels Notification No. 191/2561). In practice, duty is due from the first baht.
- VAT on imports valued at 1,500 baht or less has been collected since 5 Jul 2024 (B.E. 2567).
- VAT rate of 7%: Royal Decree (No. 807) B.E. 2569 (พระราชกฤษฎีกา ฉบับที่ 807) keeps the 6.3% rate for sales, services and imports until 30 Sep 2027 (B.E. 2570). With the local tax added, the total is 7%, as `thai-tax` summarises.
- No Ministry of Finance notification has been found that extends the 1,500 baht duty exemption into 2026 (B.E. 2569). If a new notification appears, fix this section.

## 3 · Find the duty rate and prohibitions

1. Find the 8-digit HS code, then read the rate in the menu "ค้นหาพิกัดอัตราอากรขาเข้า" (search import duty tariff rates) in the Customs Department tariff database http://itd.customs.go.th/igtf/viewerCont.do?param=main · if unsure of the code, ask the Customs Department Call Center on 1164
2. Goods from China can get a reduced or zero duty under the ASEAN-China Free Trade Agreement (ACFTA) if a Form E certificate of origin is presented to Thai Customs · ask the forwarder from the start whether they can arrange Form E
3. Check whether the goods are "ของต้องกำกัด" (restricted goods: need permission or must meet conditions before import), such as food, drugs and cosmetics (Food and Drug Administration, อย.) · radio communication equipment (NBTC office, สำนักงาน กสทช.) · goods under a compulsory standard (Thai Industrial Standards Institute, สมอ.) (รอยืนยัน, the product list of each agency)

## 4 · Truck or sea

| Topic | Truck | Sea |
|---|---|---|
| Suits | light, high-value goods needed fast | heavy or bulky goods, large lots, can wait |
| Time | shorter | longer |
| Price per CBM | higher | lower |
| Charged by | per kilogram or per CBM, whichever pays more | same |

This table describes the general shape of the forwarding market (อนุมาน, inferred; not official figures). Get real quotes from 2–3 forwarders, and ask these 5 questions:

1. Is the price per kilogram or per CBM, what is the minimum, and how is it rounded
2. Does the price already include duty and VAT ("เหมาภาษี", an all-in tax package, or paid separately)
3. In whose name is the import made, and will the customs declaration and the Customs Department receipt come in our business's name · if it is in the forwarder's name, that VAT cannot be used as our input tax (อนุมาน, inferred from the principle that the customs receipt is a tax invoice)
4. How much is paid if goods are damaged or lost
5. Is the price declared truthfully · declaring a price lower than the real one is a legal risk for the importer (รอยืนยัน, the sections and penalties in the Customs Act B.E. 2560 [2017], พ.ร.บ.ศุลกากร พ.ศ. 2560)

## 5 · Example: 200 fabric bags from 1688 by truck

Every figure in the example is only to show the method. The worked example (200 fabric bags from 1688 by truck: CIF 28,150.00 · duty 20% · VAT 7% · total paid 37,444.60 baht) gives 187.22 baht per bag when not VAT-registered and 175.40 when VAT-registered and imported in own name. It is in [`worked-example.md`](import-landed-cost/worked-example.md). The web price of 25 yuan is 125 baht, but the cost delivered to the shop is 40–50% higher: take the script's cost to set the resale price with `marketplace-fees-pricing.md`.

## 6 · Let the script calculate, never by hand

`scripts/landed-cost.mjs` works out every line of the table above in one run, and gives the cost per unit both ways (VAT-registered or not). The VAT rate is in `scripts/rates.json` with the date checked. The script warns when it is older than 90 days or past 30 Sep 2027 (B.E. 2570). There is no default duty rate. Look up the tariff code and enter the rate yourself for every lot.

```bash
node scripts/landed-cost.mjs scripts/import-landed-cost/example.json     # 200-bag example → 187.22 and 175.40 per bag
node scripts/landed-cost.mjs --self-test
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/pricing-and-costs/scripts/landed-cost.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/pricing-and-costs/scripts/landed-cost.mjs` · Node only, no dependencies

## 7 · When to ask an accountant or a lawyer

- Importing goods that may be restricted, or unsure of the HS code

## 8 · รออนุมัติ (awaiting approval)

These cannot be undone or affect outside people. The agent prepares the information and drafts, but does not do them itself.

- Transferring money to buy goods, paying the forwarder, or paying duty and taxes
- Signing a contract with the forwarder
- Entering the user's password, identity verification code or account number

## 9 · Links to other skills

- Selling price on Shopee Lazada TikTok Shop once the cost is known: `marketplace-fees-pricing.md`
- Choose a business form, register, and register for VAT: `thai-business-setup`
- File monthly VAT and input tax: `thai-tax` + agent `tax-helper`
- Compare domestic shipping: `shipping-compare.md`

## Check before sending

1. The duty rate comes from the real tariff code of the goods, not from the example, and say whether Form E entitlement was checked
2. Every figure comes from `landed-cost.mjs`, and the script's warnings (rates.json too old · duty rate in the wrong unit) are passed on to the user in full
3. State the cost per unit both ways (VAT-registered or not), and say that import VAT is input tax only when the import is in the business's own name
## References

- [`worked-example.md`](import-landed-cost/worked-example.md) — open for the full 200-bag cost table
- [`sources.md`](sources.md) — official sources and check date 2026-10-23 for sections 1 to 4


## reference: marketplace-fees-pricing.md

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


## reference: script-and-promotions.md

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


## reference: shipping-compare.md

<!-- merged from skill `shipping-compare` on 2026-11-27 · description was: Use when a Thai seller compares couriers -->
# Shipping Compare

Compare on your own last month of orders: real weights, real sizes, real destinations, real cash on delivery (COD) share.

## Where the choice actually exists

| Channel | Who picks the courier | What the seller controls |
|---|---|---|
| Shopee | Platform's supported list (SPX Express and partners) per shop settings | Which supported couriers to enable; parcel size and weight; drop-off vs pick-up |
| Lazada | Lazada Logistics / assigned partner | Parcel size; drop-off point |
| TikTok Shop | Platform-assigned partners | Parcel size; pick-up booking |
| LINE / Facebook / own website | **The seller** | Courier, COD, insurance, rate deal |

On marketplaces the platform's shipping rate and subsidies apply; the comparison below matters most for LINE and Facebook orders and for choosing among enabled couriers.

## Workflow

1. **Export last month's orders** — weight, box size, destination province, COD yes/no, COD amount
2. **Group** into 3–5 typical parcels (e.g. 0.5 kg envelope, 1 kg box 20x15x10, 3 kg box 30x25x20) with their share of orders
3. **Get quotes** for each typical parcel from each courier's app or website, **as a business account** (volume rates are lower than walk-in), Bangkok and upcountry
4. **Compute chargeable weight** for each (rule below)
5. **Add COD cost** = COD fee % × COD amount (+ VAT if charged) for the COD share
6. **Score** with the comparison table, then the weighted score below (`decision-desk/decision-scoring` command `score`): cost per average order, delivery days, damage rate, COD payout days
7. **Trial** the winner for two weeks on real orders before switching everything; keep a second courier for remote areas and outages

## Chargeable weight

```
Volumetric weight (kg) = width × length × height (cm) ÷ divisor
Chargeable weight      = the higher of actual weight and volumetric weight, rounded up to the courier's step
```

Divisor is usually 5,000 or 6,000 depending on the courier and service — confirm on each courier's rate page (รอยืนยัน per courier). Example: pillow box 40 x 30 x 20 cm, actual 1.2 kg → 24,000 ÷ 5,000 = 4.8 kg volumetric → charged as 5 kg. Repacking into 35 x 25 x 15 cm → 2.6 kg → charged as 3 kg. A smaller box is the cheapest shipping discount.

## Comparison table (fill with your quotes)

| | Flash Express | Kerry (KEX) | J&T Express | ไปรษณีย์ไทย (EMS/ลงทะเบียน) | SPX Express |
|---|---|---|---|---|---|
| Price 0.5 kg BKK / upcountry | | | | | |
| Price 1 kg box | | | | | |
| Price 3 kg box | | | | | |
| COD fee | ≈2.14%–2.5% via partner systems (รอยืนยัน) | (รอยืนยัน) | ≈2.5% (รอยืนยัน) | (รอยืนยัน) | (รอยืนยัน) |
| COD payout | (รอยืนยัน) days | | | Wallet@Post or bank transfer | |
| Max weight | 50 kg reported (รอยืนยัน) | (รอยืนยัน) | (รอยืนยัน) | (รอยืนยัน) | (รอยืนยัน) |
| Free pick-up minimum | | | | | |
| Remote-area surcharge | | | | | |
| Claim limit without insurance | | | | | |
| **Cost per average order** | | | | | |

Context: Flash, Kerry (KEX) and J&T reportedly raised base prices by ฿3 per parcel from 1 April 2026 (fuel costs) (รอยืนยัน — one news source). COD maximum per parcel at Flash reported ฿50,000 (รอยืนยัน).

Sources and check date (2026-10-06): [references/sources.md](shipping-compare/sources.md) · every rate stays (รอยืนยัน) until read in the courier's own app

## Worked example — LINE shop, 300 orders a month

Mix: 60% 0.5 kg envelopes, 40% 1 kg boxes; 30% COD, average COD ฿450.
Courier A: envelope ฿28, box ฿35, COD 2.5% → (0.6 × 28 + 0.4 × 35) + 0.3 × 450 × 2.5% = 16.8 + 14 + 3.38 = **฿34.18 per order**.
Courier B: envelope ฿25, box ฿38, COD 3% → 15 + 15.2 + 4.05 = **฿34.25 per order** (illustrative quotes).
Near tie — decide on pick-up reliability and COD payout speed, not the rate card.

## Score the couriers (ตัดสินด้วยตัวเลข)

Ranking by cost alone hides a courier that breaks 3% of parcels. Use `decision-desk/decision-scoring` command `score` (`node decide.mjs score <file.json>`): one option per courier, numbers from your own last month.

| Step | Rule |
|---|---|
| Hard rules first (`must`, the courier is dropped before scoring) | max weight below your heaviest parcel · does not serve your top provinces · no COD service when COD is over 20% of orders |
| Criteria (`better`) | cost per average order, from the formula in the worked example (`low`) · delivery days, median (`low`) · damage and loss rate, % of parcels from your own claims (`low`) · COD payout days (`low`) |
| Default weights (starting value, not yet measured · change to fit the shop) | cost 0.40 · damage rate 0.25 · delivery days 0.20 · COD payout days 0.15 |
| Read the result line | `ยังไม่นิ่ง` or `สูสี` (a near tie, like the worked example below) → show the top 2 and the criterion that flips them; you choose, the score does not |

Cost per order must already include chargeable weight, COD fee and remote-area surcharge. With only 2 couriers, min-max scoring gives 0 and 100 on every criterion, so read the raw numbers in brackets too. Input file: [references/score-example.json](score-example.json) (illustrative; copy it, replace the values with your own, run `decide.mjs score <file>`).

No damage data yet → use the claim count from the courier's app, or leave that criterion out and say so.

## Packaging

- Box or mailer just big enough; fill gaps (paper, air pillows) so nothing moves when shaken
- Liquids: tape the cap, bag it in a zip bag, upright arrow; glass: 5 cm cushioning on all sides + "ระวังแตก" sticker (stickers do not replace padding)
- Waterproof outer layer for paper goods — rainy season May–October
- Label flat on the largest face; old labels removed; phone number readable
- **Record a packing video** of every order with the order number visible — it decides "ได้ของไม่ครบ" disputes (`customer-care`)
- Packaging cost (box, tape, filler, label) goes into `C` in `marketplace-fees-pricing.md`

## Claims for lost or damaged parcels

1. Buyer reports → collect photos of box and item, tracking number, packing video
2. File with the courier (marketplace orders: through the platform's shipping dispute) within the courier's claim window (รอยืนยัน per courier)
3. Compensation is capped by declared value or insurance — insure parcels above the uninsured cap
4. Resend or refund the buyer first if the platform requires it; recover from the courier afterwards

## Related

- `marketplace-fees-pricing.md` (shipping `S`), `customer-care` T3 late parcel
- `shop-books` — prepaid transfer instead of COD for LINE/Facebook orders cuts COD fees and refused parcels


## reference: sources.md

# Sources · import-landed-cost

Last checked 2026-10-23. Sources: Customs Department Notification No. 219/2568 (signed 4 Dec 2025 [B.E. 2568], effective 1 Jan 2026 [B.E. 2569]) https://www.customs.go.th/cont_strc_download_with_docno_date.php?lang=th&top_menu=menu_homepage&current_id=14232a32414d505f4a464b47464b4a · VAT on low-value imports starting 5 Jul 2024 (B.E. 2567): Customs Department revenue collection measures document for fiscal year 2026 (B.E. 2569) https://www.customs.go.th/data_files/8342f73dce85665090d55bb44eb9a0e4.pdf · Royal Decree No. 807 (Royal Gazette volume 143, part 50 ก, 23 Aug 2026 [B.E. 2569]) https://rd.go.th/fileadmin/user_upload/kormor/newlaw/dc807.pdf · VAT base on imports, Revenue Code section 79/2 https://www.rd.go.th/5205.html · Customs Department duty and VAT formula http://ccc.customs.go.th/data_files/bdab2d48d4dd6ac677eeecd215c82ba2.pdf · customs receipt as a tax invoice for the VAT part only https://www.rd.go.th/7047.html · Form E https://www.dft.go.th/th-th/DFT-Service/ServiceData-Information/dft-service-data-privilege/Detail-dft-service-data-privilege/ArticleId/23580/Test · definition of restricted goods https://www.customs.go.th/cont_strc_simple.php?ini_content=business_160426_03_160930_01_160930_01&ini_menu=menu_goods_control_permit&lang=th&left_menu=menu_goods_control_permit

Origin of the idea: the landed cost calculation structure took its idea from https://github.com/Boom-Vitt/claude-thai-business-skills (MIT License · Copyright (c) 2026 Vittawat (boombignose) · LICENSE file checked 2026-10-23) · fully rewritten, no text copied, and every figure rechecked against official sources · the original still says parcels under 1,500 baht may pay no duty, which does not match the rules from 1 Jan 2026 (B.E. 2569)


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
