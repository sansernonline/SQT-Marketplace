# playbook · image-series — AI images that look like one set

Use when: several product images · a week of posts · a storyboard · a character that appears repeatedly · fixing an existing image · LINE stickers or a rich menu
Main principles: [`design-principles`](../../design-principles/SKILL.md) · product images [`product-images.md`](../../design-principles/references/product-images.md) · LINE [`line.md`](../../design-principles/references/line.md) · thumbnail [`thumbnail.md`](../../design-principles/references/thumbnail.md) · superuser `design-gate/parts/design-method/guide.md`
Main skills: `image-generation` · `brand-kit` · `marketplace-product-images` · `line-design` · `design-review` · agents `art-director` · `design-critic` · `brand-keeper`

## ขั้นตอน · Steps (copy into the todo as written)

1. Write the 7-field `เนื้อหา:` brief per `design-method` steps 1–4 (reuse `โปรเจกต์` from `DESIGN.md`). Open the principle file of the medium (product images · LINE · thumbnail) before writing the style lock sheet per `brand-kit` — color, light, composition, lens, what is forbidden — with each choice tracing back to the brief. When the set must match an existing logo or brand, pull its colours with `brand-kit` `scripts/extract-colors.cjs` first. Before any image, run the medium skill's pre-work gate (live references · 3 different directions · the owner picks one · close with `ด่านก่อนลงมือ:`) · ใคร: `art-director` ตัวใหม่
2. Write the brief and prompt for each image per `image-generation`, with every image citing the same lock sheet. For product images follow `marketplace-product-images`; for LINE stickers and rich menus follow `line-design` · ใคร: `art-director` ตัวใหม่
3. Generate the images through the tool the user has installed. If there is no tool, hand over a brief that is ready to paste · ใคร: `art-director` ตัวใหม่
4. Check (ตรวจ) every image against the lock sheet. For an image that drifts from the style, write an `image-generation` (what to keep · what to change) instead of regenerating the whole image · ใคร: `design-critic` ตัวใหม่ compares against the lock sheet · `art-director` ตัวใหม่ writes the fix brief
5. Regenerate the images that need fixing following the fix brief. If there is no tool, hand over a brief that is ready to paste · ใคร: `art-director` ตัวใหม่
6. Run the medium's checker scripts (LINE: `line-design` `scripts/richmenu_check.py` and `scripts/sticker_check.py` must report all pass), compare the set with the real logo or brand kit (`brand-keeper` ตัวใหม่), then check (ตรวจ) the whole set against the medium's principle file in [`design-principles`](../../design-principles/SKILL.md) (thumbnail · product images · LINE), then run `design-review` on it · ใคร: `design-critic` ตัวใหม่ (อ่านอย่างเดียว · ไม่แก้ไฟล์ — read-only)

## Done when

Every image passes the lock sheet and `design-review`, the medium's checker scripts pass, and the briefs are kept so the set can be regenerated
