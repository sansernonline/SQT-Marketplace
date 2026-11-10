---
name: product-listing
description: Use when writing or fixing a product listing on Shopee, Lazada, TikTok Shop, LINE or Facebook (title, banned claims).
argument-hint: <product> <platform(s)> [key features, price, category]
---

# Product Listing (Thai marketplaces)

A listing is found by its title, chosen by its first photo, and bought because of its description. Each platform searches differently, so one copy pasted everywhere loses on all of them.

## Workflow

1. **Collect facts** — product name, brand, model, size/volume/weight, colour/variants, material, who it is for, price, stock, เลข อย. (สำนักงานคณะกรรมการอาหารและยา) or เลขจดแจ้ง if food or cosmetic
2. **Keyword research** (10 minutes, free) — buyer-app search suggestions, steps in [references/keyword-and-photos.md](references/keyword-and-photos.md); pick 1 main keyword (in suggestions **and** most top-seller titles) + 3–5 supporting; never a competitor brand name
3. **Title** — apply the platform formula in the table; stay inside the length limit
4. **Photos** — run the photo checklist in the same reference file (photo 1 on a plain background, 1:1 at least 800 x 800 px, same main photo on every platform)
5. **Description** — fill [the template](references/description-template.md)
6. **Claims check** — food, supplement, cosmetic, "health" items: run [prohibited claims](references/prohibited-claims.md) and delete every hit
7. **Variants and Stock Keeping Unit (SKU)** — name SKUs per `multi-shop-stock` before publishing, so stock syncs later
8. **Price** — set after `marketplace-fees-pricing`, never before

## Title formulas

| Platform | Formula | Notes |
|---|---|---|
| Shopee | `[แบรนด์] + [คำค้นหลัก] + [รุ่น/สเปก] + [ขนาด/จำนวน] + [จุดเด่น 1–2] + [เหมาะกับ]` | Main keyword in the first ~40 characters (what shows in the grid); limit about 120 characters (รอยืนยัน) |
| Lazada | `[แบรนด์] + [ชื่อสินค้า/คำค้นหลัก] + [รุ่น] + [สเปกสำคัญ] + [ขนาด/สี]` | Brand field must match the brand in the title; no promo words in title; limit (รอยืนยัน) |
| TikTok Shop | `[คำค้นหลัก] + [จุดเด่นที่เห็นในคลิป] + [ขนาด/จำนวน] + [แบรนด์]` | Buyers arrive from video, so match the words said in the clip; limit (รอยืนยัน) |
| LINE shop / MyShop | `[ชื่อสินค้าสั้น] + [ขนาด] + [ราคาโปร]` | Customers already know the shop; clarity beats keywords |
| Facebook post | Line 1 = benefit + price; line 2 = how to order | Search matters little; the first 2 lines decide the click |

Never in a title: `ถูกที่สุด`, `อันดับ 1`, `ของแท้ 100%` without proof, emoji runs, ALL CAPS, `ส่งฟรี` (use the shipping setting instead), words from another category to catch traffic.

Worked example — cotton tote bag, Shopee:
`[ผ้าดี] กระเป๋าผ้า ใบใหญ่ ผ้าแคนวาส 12 ออนซ์ 38x42 ซม. มีซิป ช่องใส่โน้ตบุ๊ก 14 นิ้ว สำหรับนักศึกษา ทำงาน`

Same product, TikTok Shop:
`กระเป๋าผ้าใบใหญ่ ใส่โน้ตบุ๊กได้ มีซิป ผ้าหนา 12 ออนซ์ ผ้าดี`

Description bullets — one benefit with a number per line, not a lifestyle list:

| Weak | Strong |
|---|---|
| ไม่ว่าจะเป็นสายออกกำลังกาย สายแฟชั่น หรือสายชิล ตอบโจทย์ทุกไลฟ์สไตล์ | ซักเครื่องได้ 50 ครั้งสีไม่ตก · เนื้อผ้า 180 แกรม ใส่หน้าร้อนไม่ร้อน |

ข้อความภาษาไทย → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ การตลาด

## Diagnose a listing that does not sell

Read the listing's own numbers in Seller Centre (views or impressions, click rate, orders) before touching the copy. The ratio tells which half is broken:

| Numbers | Problem | Fix in this order |
|---|---|---|
| Few views | Visibility — buyers never see it | Main keyword in the first 40 characters · true category · price inside the range of the top 5 results · stock not 0 · ads or voucher only after these |
| Views fine, few orders | Conversion — seen, not chosen | First photo on plain background · price and shipping cost shown · size chart or dimensions · rating and review count · description answers the top 3 chat questions |
| Orders fine, rating falls | Product or packing, not the listing | `returns-and-bad-reviews`, then fix the claim that over-promised |

Rank the actions: do first the one that touches every buyer for the least work (title and first photo beat a rewritten description), 1 change per 3–7 days so the numbers show what worked.

## Audit the whole shop

When the owner asks to "check all listings" or a batch of listings needs fixing, score every listing on the same 4 checks, so the result is a list, not a pile of opinions:

| Check | Fails when |
|---|---|
| Attributes missing | the platform's attribute fields (brand, material, size, model, warranty, เลข อย.) are blank or "อื่น ๆ" |
| Description too thin to be found | under about 3 lines, or the main keyword appears nowhere outside the title |
| Category conflicts with the product | the chosen category does not match the title or attributes (also changes the commission rate) |
| Photos missing for this product type | no size or label photo where buyers expect one (`graphic-design:marketplace-product-images`, if installed) |

1. Sort by impact: listings that sell well but fail checks come first, then the rest by views.
2. Group the fixes by the kind of fix (for example "38 listings lack material"), so the owner approves 1 pattern, not 38 edits.
3. Fix 1–2 listings as samples and get the owner's yes before doing the rest of the group.
4. Anything else found on the way (a wrong price, a banned claim) is reported as a separate item. Do not fix it quietly inside the batch.

## Rules

- **Never guess an attribute.** Material, size, model, ingredients and warranty come only from the supplier's spec sheet, the label, or what the owner said this session. "Probably cotton" stays blank and becomes a question to the owner, one field at a time. Praise from reviews ("ผ้านุ่มมาก") never turns into a claim in the description; it also keeps you clear of the prohibited claims above
- One listing = one product; variants for colour/size only, never different products under one listing
- Stock number comes from the master sheet (`multi-shop-stock`), never typed from memory
- Category must be the true category — a wrong category changes the commission rate and risks takedown
- Food, supplements, cosmetics: show เลขสารบบอาหาร or เลขที่ใบรับจดแจ้ง in the description and a photo of the label; check the number at oryor.com before reselling someone else's product
- Keep a copy of every final title and description in a sheet; platform edits sometimes get lost

## Not an AI look

Use real product photos — no AI-generated people and no text baked into images. The full list of AI tells lives in `no-ai-look`.

## Related

- `marketplace-fees-pricing`, `multi-shop-stock`, `live-selling-script` (the same claims rules apply on air)
- `graphic-design` `marketplace-product-images` (if installed) — product photo sizes, white background, rejected images · banner and post sizes → `social-formats`
- `line-oa-setup` — when the LINE shop is the channel

## เรียกเป็นคำสั่ง

`/e-commerce:product-listing <product> <platform(s)> [key features, price, category]`

Run `product-listing` with the `shop-manager` agent for: **$ARGUMENTS**

Produce one title per platform inside its length limit, the description from the template, and the photo checklist. For food, supplements or cosmetics, run the prohibited-claims check and list every phrase removed.
