---
name: line-sticker
description: Use when making LINE stickers or emoji (สติกเกอร์ LINE, LINE Creators Market) and the image sizes, count and file limits must pass.
---

# LINE Sticker and Emoji

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

อยู่ใน plugin `graphic-design` · ถ้อยคำเขียนตาม `human-writing`

> **กฎข้อเดียว:** ตรวจไฟล์ด้วย `scripts/sticker_check.py` ก่อนอัปโหลดทุกครั้ง แล้วเปิดหน้าทางการของ LINE ดูเพดานซ้ำเมื่อเลยวันตรวจ · เพดานด้านล่างตรวจเมื่อ 2026-11-10

A sticker is read on a chat background, small, in half a second. One feeling per sticker, one short Thai phrase, a thick outline, no detail that vanishes at 100 px.

## ใช้เมื่อ / ไม่ใช้เมื่อ

- ใช้เมื่อ: ทำชุดสติกเกอร์นิ่ง สติกเกอร์เคลื่อนไหว หรืออีโมจิ LINE เพื่อขายใน Creators Market หรือใช้เป็นของร้าน
- ไม่ใช้เมื่อ: เมนูปุ่มของ LINE OA → `line-richmenu` · สติกเกอร์พิมพ์ติดสินค้า → `print-ready-files` · ภาพโพสต์ → `social-formats`

## 1 · Hard limits (checked 2026-11-10)

| Item | Static sticker | Animated sticker | Emoji |
|---|---|---|---|
| Sticker image size | each ≤ 370 × 320 px | each ≤ 320 × 270 px | 180 × 180 px |
| Count per set | 8, 16, 24, 32 or 40 | 8, 16 or 24 | regular 8–40 · letter sets have other counts, read the page |
| Main image | 1 image, 240 × 240 | 1 image, 240 × 240 | not listed on the emoji page |
| Chat thumbnail (tab) icon | 1 image, 96 × 74 | 1 image, 96 × 74 | page lists the same 96 × 74 icon |
| File | PNG, transparent background, RGB, ≥ 72 dpi, even width and height | APNG with the `.png` extension, RGB, transparent | PNG, transparent |
| Each file | ≤ 1 MB | ≤ 1 MB | ≤ 1 MB |
| Motion | none | 5–20 frames · 1–4 loops · whole play ≤ 4 s | none |
| ZIP of everything | ≤ 60 MB | ≤ 60 MB | < 20 MB |
| Margin | about 10 px between the drawing and the image edge | not stated | not stated |

Sources, read 2026-11-10: https://creator.line.me/en/guideline/sticker/ · https://creator.line.me/en/guideline/animationsticker/ · https://creator.line.me/en/guideline/emoji/ · the animated page also says the size is "within 320 × 270, with width or height at least 270 px" (read through a page summary, (รอยืนยัน) the exact wording) · re-check by 2027-05-10 · the same numbers live in [references/sticker-limits.json](references/sticker-limits.json)

Not read yet: LINE's content rules (what is rejected), the review time, the sales split and the copyright terms. Open the Creators Market guideline pages for those before promising an approval. (รอยืนยัน)

Asked "will it be approved" or "what share do I get": the script checks file numbers only, the review is LINE's. Mark the share `(รอยืนยัน)` and point to creator.line.me; give no percentage, not even "about 50% from memory" with a warning, because the user will plan income on it.

## 2 · Workflow

1. Write the set list first: 8, 16, 24, 32 or 40 situations (ทักทาย · ขอบคุณ · โอเค · งง · ขอโทษ · เหนื่อย ...) and one Thai phrase each · the count must be one of the allowed numbers, so pad or cut the list before drawing
2. Lock the character with `style-consistency` (face, outline weight, 4–6 colours) before drawing any image
3. Draw each image at its canvas size with a transparent background, the drawing about 10 px inside the edge · for an AI-drawn set use `brief-to-image` and cut the background out; check the edges at 100%
4. Thai text: thick, large, high contrast on both a white and a dark chat background (test both) · keep text out of the outer 10 px
5. Name files `main.png` · `tab.png` · `01.png` `02.png` ... (the checker treats `main.png` and `tab.png` by name; the naming is this skill's own habit, not a LINE rule)
6. Run `python scripts/sticker_check.py <folder> --kind static` (or `animated`, `emoji`) · it checks size, even dimensions, PNG, transparent pixels, 1 MB, count, and for animated files the frame, loop and seconds fields · `--self-test` runs it against files it builds itself
7. Zip, check the ZIP size against the table, then upload on the Creators Market · the review is LINE's decision

## 3 · Ask before

Uploading to a Creators Market account, accepting terms, or publishing a set for sale needs the owner's own yes · never use a login or token that was not handed over for this.

## ตัวอย่างจริง

โจทย์: ร้านขนมทำชุดสติกเกอร์นิ่ง 8 ภาพ จากรูปตัวการ์ตูนแมวที่มีอยู่ · ทำ: ตั้งรายการ 8 สถานการณ์ วาดทั้ง 8 ภาพขนาด 370 × 320 พื้นโปร่ง ทำ `main.png` 240 × 240 และ `tab.png` 96 × 74 แล้วรัน `python scripts/sticker_check.py sticker-set --kind static` · ผล: ถ้ามีภาพหนึ่งเป็น 371 × 320 สคริปต์ตอบ `ไม่ผ่าน: 03.png: 371×320 ...` ให้แก้แล้วรันซ้ำจนขึ้น `ผ่านทุกข้อ`

## ตรวจก่อนส่ง

1. สคริปต์ขึ้น `ผ่านทุกข้อ` บนโฟลเดอร์จริง
2. ดูทุกภาพที่ 100% บนพื้นขาวและพื้นเข้ม ตัวหนังสือไทยอ่านออก วรรณยุกต์ไม่ขาด
3. ชุดเป็นตัวละครเดียวกันทุกภาพ (`design-review` ข้อ 7)
4. มี `ด่านก่อนลงมือ:` และผ่านด่านตาของ `no-ai-look`

## ที่มา

- LINE Creators Market guideline 3 หน้าข้างบน · อ่าน 2026-11-10
- รูปแบบสคริปต์ตรวจตามแนว `line-richmenu/scripts/richmenu_check.py` · แนวคิด "รายงานผ่าน/ไม่ผ่านต่อข้อ" จาก anthropics/skills `slack-gif-creator` `core/validators.py` (ตรวจ 2026-11-10 ว่าเขียนใหม่เองทั้งหมด ไม่ได้คัดลอกโค้ด)

## Related

`style-consistency` · `brief-to-image` · `line-richmenu` · `campaign-set` · `design-review`
