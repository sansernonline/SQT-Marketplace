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
