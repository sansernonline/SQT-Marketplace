# skill: product-listing

Use when writing or fixing a product listing on Shopee, Lazada, TikTok Shop, LINE or Facebook (title, banned claims).

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


## reference: description-template.md

# Description template (Thai)

Fill every line; delete a line only if it truly does not apply.

```
【ชื่อสินค้า】 <ชื่อเต็มเหมือนในหัวข้อ>

✔ จุดเด่น
• <ประโยชน์ที่ลูกค้าได้ ข้อ 1 — เป็นผลลัพธ์ ไม่ใช่สเปก>
• <ข้อ 2>
• <ข้อ 3>

📐 รายละเอียดสินค้า
• ขนาด: <กว้าง x ยาว x สูง ซม.> / ปริมาณ: <มล. หรือ กรัม>
• น้ำหนัก: <กรัม>
• วัสดุ/ส่วนประกอบ: <...>
• สี/ตัวเลือก: <ตรงกับชื่อตัวเลือกในระบบ>
• ผลิตที่: <ประเทศ> · เลข อย./เลขจดแจ้ง: <ถ้ามี>
• วันผลิต/วันหมดอายุ: <ถ้าเป็นอาหารหรือเครื่องสำอาง>

📦 ในกล่องมี
• <รายการ>

👤 เหมาะกับ
• <ใคร ใช้ทำอะไร>

ระวัง: วิธีใช้ / ข้อควรระวัง
• <คัดจากฉลาก ห้ามแต่งเพิ่ม>

🚚 การจัดส่ง
• ส่งภายใน <1–2> วันทำการหลังชำระเงิน (ตัดรอบ <เวลา>)

🔁 การคืนสินค้า
• กรุณาถ่ายวิดีโอขณะแกะกล่อง หากสินค้าเสียหายหรือไม่ตรงปก ทักแชทได้เลย
• รับคืนตามนโยบายของ <แพลตฟอร์ม>

💬 สอบถามเพิ่มเติม ทักแชทได้ <เวลาตอบแชท>
```

## Rules

- Benefits first, specs second — buyers scan the first 3 lines on a phone
- เลือกรูปเดียวทั้งหน้า: หน้าสินค้าไม่ใส่ ค่ะ/ครับ (ระดับ การตลาด) · ถ้าร้านจะใส่ ต้องใส่ทุกบรรทัดที่พูดกับลูกค้า ไม่ใส่บรรทัดเดียว → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ การตลาด
- Metric units; sizes in ซม., never "ประมาณฝ่ามือ"
- Copy usage and warnings from the actual label; do not add effects the label does not state
- No LINE ID, phone number or outside link in Shopee/Lazada/TikTok descriptions — against platform rules
- Return line must not promise less than the platform's own policy (see `returns-and-bad-reviews`)


## reference: keyword-and-photos.md

# Keyword research and photo checklist

Moved from `SKILL.md`. Open at workflow step 2 (keywords) and step 4 (photos).

## Keyword research via search suggestions

1. Open the buyer app (not Seller Centre), logged out or in incognito
2. Type the product's plain Thai word, e.g. `กระเป๋าผ้า` — write down every suggestion in the drop-down
3. Add one word at a time: `กระเป๋าผ้า ใบใหญ่`, `กระเป๋าผ้า มินิมอล` — the suggestions are what buyers actually type
4. Repeat in English and in the transliteration buyers use (`tote bag`, `โท้ทแบค`)
5. Search the top 3 suggestions; open the first 5 best-selling listings and note the words in their titles
6. Keep a sheet: keyword · platform · in suggestions (Y/N) · in top-seller titles (count)
7. TikTok Shop: also check the TikTok app search suggestions and the hashtags on the top videos

Main keyword = appears in suggestions **and** in most top-seller titles. Do not use competitor brand names — it breaks every platform's listing rules.

## Photo checklist

- [ ] Photo 1: product only, white or plain background, product fills 70–85% of frame, no text over the product
- [ ] Square 1:1, at least 800 x 800 px; 1024 x 1024 or larger preferred — check each platform's current minimum (รอยืนยัน)
- [ ] Photo 2: in use / on a person / in a room — shows scale
- [ ] Photo 3: size with ruler or hand; dimensions written on the image
- [ ] Photo 4: close-up of material, stitching, or the label with เลข อย.
- [ ] Photo 5: every colour/variant side by side, labelled exactly as the variant names
- [ ] Photo 6: what is in the box
- [ ] Photo 7–9: one benefit per Thai text card, or a size chart
- [ ] Video 10–60 s — expected in practice on TikTok Shop
- [ ] No other shop's watermark, no stock photo without rights, no before/after body photos for cosmetics or slimming
- [ ] Same main photo on every platform so returning buyers recognise it

Image sizes per platform and banner formats → `graphic-design` `social-formats` (if installed).


## reference: prohibited-claims.md

# Prohibited and risky claims — food, supplements, cosmetics

General information, not legal advice. Advertising rules come from สำนักงานคณะกรรมการอาหารและยา (อย., Thai Food and Drug Administration) under พ.ร.บ.อาหาร พ.ศ. 2522 and พ.ร.บ.เครื่องสำอาง พ.ศ. 2558, and from สำนักงานคณะกรรมการคุ้มครองผู้บริโภค (สคบ., Office of the Consumer Protection Board) under พ.ร.บ.คุ้มครองผู้บริโภค พ.ศ. 2522 for false or exaggerated advertising generally. When unsure, ask อย. (สายด่วน 1556) before posting.

## Never write (any product)

| Phrase type | Examples | Why |
|---|---|---|
| Treats / cures / prevents disease | รักษา, หายขาด, ป้องกันโรค, ลดเบาหวาน, ลดความดัน, ต้านมะเร็ง | Medical claim — only registered medicines may claim this |
| Instant or time-bound results | เห็นผลทันที, เห็นผลใน 7 วัน, การันตีผล 100% | อย. treats time-bound and guaranteed results as misleading |
| Superlatives without proof | ดีที่สุด, อันดับ 1, ปลอดภัย 100%, ไม่มีผลข้างเคียง | Unprovable; สคบ. treats as exaggeration |
| Borrowed authority | แพทย์แนะนำ, อย. รับรองสรรพคุณ, ผ่านการทดลองทางคลินิก (without a real study) | The อย. number registers the product, not the advertising claim |
| Before/after body photos | ภาพก่อน-หลัง ผอม/ขาว | Treated as an exaggerated effect |

## Food and dietary supplements (ผลิตภัณฑ์เสริมอาหาร)

- Never: ลดน้ำหนัก, เผาผลาญไขมัน, ลดพุง, กระชับสัดส่วน, เพิ่มสมรรถภาพทางเพศ, เพิ่มความสูง, ผิวขาว, ล้างสารพิษ, บำรุงตับ/ไต as a treatment
- Advertising food benefits generally needs a separate advertising permit (ใบอนุญาตโฆษณา, ฆอ.) — the food number alone does not cover advertising; exact scope (รอยืนยัน) at fda.moph.go.th
- Show เลขสารบบอาหาร exactly as on the label; check it at oryor.com or the อย. app

## Cosmetics (เครื่องสำอาง)

- A cosmetic may claim to clean, beautify, perfume or protect skin and hair — not to change the body's structure or function
- Never: ขาวถาวร, ลบฝ้า กระ หายขาด, รักษาสิว, ปลูกผม, ยกกระชับแทนการผ่าตัด, ลดริ้วรอยถาวร, ฆ่าเชื้อโรค, สลายไขมัน
- Show เลขที่ใบรับจดแจ้ง and check it in the อย. database before reselling
- A quoted customer review may not state an effect the seller itself could not legally claim

## Safe rewrites

| Risky | Safer |
|---|---|
| ขาวใน 7 วัน | ช่วยให้ผิวดูกระจ่างใส ชุ่มชื้น |
| รักษาสิว | ทำความสะอาดผิวหน้าอย่างอ่อนโยน เหมาะกับผิวที่เป็นสิวง่าย |
| ลดน้ำหนัก 5 โล | ใยอาหารสูง ช่วยให้อิ่มนาน (only if the label states it) |
| ปลอดภัย 100% | จดแจ้งกับ อย. เลขที่ ... |
| ดีที่สุดในไทย | ขายแล้วกว่า <ตัวเลขจริง> ชิ้น (keep the proof) |

## Check before posting

- [ ] Every effect in the copy appears on the approved label
- [ ] No disease, body-shape, permanent-whitening or time-bound promise
- [ ] เลข อย./เลขจดแจ้ง shown and checked
- [ ] No before/after body photo
- [ ] Live script and video captions use the same safe wording (`live-selling-script`)

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.fda.moph.go.th · https://www.thansettakij.com/health-wellness/health/665172 · ฆอ. permit scope (รอยืนยัน)


---

# skill: marketplace-fees-pricing

Use when a Thai seller asks what to charge, why a product loses money, or how marketplace fees compare.

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
