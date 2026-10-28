---
name: marketplace-fees-pricing
description: Use when a Thai seller asks what to charge, why a product loses money, or how marketplace fees compare.
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

`price-calc.mjs` ใช้สูตรด้านบนกับสินค้าทีละชิ้น: ได้ราคาตามสูตร ราคาที่ปัดให้ลงท้าย 9 หรือ 0 ค่าธรรมเนียมแต่ละบรรทัด กำไรและ % ที่ราคาที่ปัด และกำไรช่วงแคมเปญถ้าใส่มา (ติดลบ = ไม่ควรร่วม)

```
node price-calc.mjs <file.json> [--json]     # example file: scripts/example.json
node price-calc.mjs --self-test
```

ไฟล์ input: `{ "rates_checked": "2026-10-06", "items": [ { "name": "...", "cost": 120, "shipping": 15, "fixed": 1.07, "margin_pct": 20, "vat_registered": false, "fees_pct": { "commission": 10.7, "transaction": 3.21 }, "campaign": { "extra_pct": 3, "voucher": 20 } } ] }` · `fees_pct` เป็น % ที่รวม VAT แล้ว ใส่กี่ช่องก็ได้ · `campaign` ไม่บังคับ · สคริปต์ไม่มีอัตราของแพลตฟอร์มในโค้ด ต้องใส่จาก Seller Centre ของร้านเอง และ `rates_checked` คือวันที่ตรวจ สคริปต์พิมพ์ออกมาในผล และขึ้นคำเตือนเมื่อเก่ากว่า 30 วัน (ค่าตั้งต้น ยังไม่ได้วัด) ให้เปิด Seller Centre ดูอัตราใหม่ก่อนใช้ราคา · ต้นทุนรวม 0 ทำให้สคริปต์หยุด · `margin_pct` ที่น้อยกว่า 1 (เช่น 0.2 แทน 20) และ voucher ที่ตั้งแต่ราคาขายขึ้นไปได้คำเตือน · ช่องที่ผิดทำให้สคริปต์หยุดพร้อมข้อความที่ชื่อช่อง · ถ้าค่าธรรมเนียม + VAT + กำไรที่ต้องการรวมกันตั้งแต่ 100% สคริปต์บอกว่าหาราคาไม่ได้

**Script path:** ติดตั้งจาก marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/marketplace-fees-pricing/scripts/price-calc.mjs | sort -V | tail -1` · ใน repo SQT-Marketplace: `plugins/e-commerce/skills/marketplace-fees-pricing/scripts/price-calc.mjs` · Node อย่างเดียว ไม่มี dependency

ผลเป็นข้อมูลประกอบ ไม่ใช่คำแนะนำด้านบัญชีหรือภาษี

## Price sheet columns

`SKU · platform · category · commission % · transaction % · other % · fixed ฿ · shipping ฿ · cost ฿ · VAT (Y/N) · price ฿ · profit ฿ · margin % · campaign floor ฿ · rates checked on (date)`

## Rules

- Never copy a rate from a blog without checking Seller Centre; blogs lag behind announcements
- Mall shops pay higher commission in most categories — never reuse a ทั่วไป price for a Mall shop
- Joining a free-shipping or cashback programme adds a percentage fee; price it as part of `r`
- Affiliate commission (TikTok Shop, Shopee, Lazada affiliate) is another percentage — add it to `r` for SKUs sold through creators
- A promotion is a new price — re-run the formula; a 20% discount on a 20% margin is a loss
- Prices on LINE and Facebook carry no platform fee but do carry payment fees (card/QR gateway) and the seller's own shipping — price them separately; payment by `promptpay-qr` has no gateway fee for a personal account (รอยืนยัน for business accounts)

## Related

- `shipping-compare` — `S` per parcel size
- `seller-tax-basics` — when to register VAT (sets `v`)
- `multi-shop-stock` — same SKU codes in the price sheet
- `doc-quotation` — B2B buyers who need a quotation with VAT
