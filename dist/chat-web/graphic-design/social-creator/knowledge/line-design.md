# skill: line-design

Use when a LINE OA needs a rich menu or stickers that pass file limits

# LINE Design

Two jobs, one skill. Pick the body by the job, open it, and follow it in full. Both bodies start with a pre-work gate: read the theme, search live references, 3 different directions, check `design-gate/no-ai-look`, close with the line `ด่านก่อนลงมือ:`.

## Parts

| When | Open |
|---|---|
| LINE Official Account (OA) rich menu: image, JSON, upload, seasonal swap | [references/rich-menu.md](references/rich-menu.md) |
| LINE stickers (static, animated) or emoji for Creators Market or a shop | [references/sticker.md](references/sticker.md) |

Not for: OA setup, chatbot, broadcast → `line-oa` (plugin `e-commerce`, if installed) · print stickers → `print-ready-files` · post images → `campaign-set`.

## Hard rules: rich menu

- Image JPEG or PNG, full 2500×1686 or compact 2500×843, file ≤ 1 MB; ≤ 20 tap areas; `chatBarText` ≤ 14 characters
- 6 clear buttons beat 12 tiny ones; Thai text ≥ ~60 px tall; "ติดต่อเจ้าหน้าที่" always present
- Run `python scripts/richmenu_check.py menu.json menu.png` (`--self-test`) and the API `validate` call before creating
- Ask the user's approval before set-default and before any delete; test on one user first, then iOS and Android
- The channel token comes from an environment variable only; never in a file, a log or the reply

## Hard rules: sticker and emoji

- Static ≤ 370×320 px (counts 8, 16, 24, 32, 40) · animated APNG ≤ 320×270, ≤ 4 s, 5–20 frames, 1–4 loops · emoji 180×180 · each file ≤ 1 MB · transparent PNG, even width and height
- Run `python scripts/sticker_check.py <folder> --kind static|animated|emoji` before every upload; the limits were checked 2026-11-10, re-check by 2027-05-10
- 1 feeling and 1 short Thai phrase per sticker; test on white and dark backgrounds; same character across the set (`brand-kit`)
- Never promise approval or a revenue share: the review is LINE's, mark the share `(รอยืนยัน)` and point to creator.line.me
- Uploading to a Creators Market account or accepting terms needs the owner's own yes

## Related

`brand-kit` · `image-generation` · `campaign-set` · `design-review` · `design-gate/no-ai-look`


## reference: api-sequence.md

# API sequence · line-design

Open when building the menu through the Messaging API (create, upload, set default, link or unlink users).

```
POST   https://api.line.me/v2/bot/richmenu/validate                      check the JSON
POST   https://api.line.me/v2/bot/richmenu                               create → {richMenuId}
POST   https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content     upload (Content-Type image/png or image/jpeg)
POST   https://api.line.me/v2/bot/user/all/richmenu/{richMenuId}         set default for everyone
POST   https://api.line.me/v2/bot/user/{userId}/richmenu/{richMenuId}    link to one user (e.g. member)
DELETE https://api.line.me/v2/bot/user/{userId}/richmenu                 unlink → user falls back to default
```

Many users at once: `POST /v2/bot/richmenu/bulk/link` (up to 500 user IDs per call · ตรวจล่าสุด 2026-10-26 ในหน้าอ้างอิง API).

What a user sees, highest priority first: **per-user menu (API) > default menu (API) > default menu set in OA Manager**.


## reference: rich-menu-6-buttons.md

# Six-button full rich menu (2500×1686)

Grid: 3 columns × 2 rows. Column widths 833 / 834 / 833, row height 843.

| Cell | x | y | width | height | Label | Action |
|---|---|---|---|---|---|---|
| A | 0 | 0 | 833 | 843 | เช็คราคา | message "ราคา" |
| B | 833 | 0 | 834 | 843 | สั่งซื้อ | uri shop |
| C | 1667 | 0 | 833 | 843 | ติดตามพัสดุ | message "พัสดุ" |
| D | 0 | 843 | 833 | 843 | โปรโมชัน | message "โปร" |
| E | 833 | 843 | 834 | 843 | ที่ตั้ง | uri map |
| F | 1667 | 843 | 833 | 843 | ติดต่อเจ้าหน้าที่ | message "ติดต่อเจ้าหน้าที่" |

```json
{
  "size": { "width": 2500, "height": 1686 },
  "selected": true,
  "name": "main-menu-2026-10",
  "chatBarText": "เมนู",
  "areas": [
    { "bounds": { "x": 0,    "y": 0,   "width": 833, "height": 843 }, "action": { "type": "message", "text": "ราคา" } },
    { "bounds": { "x": 833,  "y": 0,   "width": 834, "height": 843 }, "action": { "type": "uri", "uri": "https://example.co.th/shop" } },
    { "bounds": { "x": 1667, "y": 0,   "width": 833, "height": 843 }, "action": { "type": "message", "text": "พัสดุ" } },
    { "bounds": { "x": 0,    "y": 843, "width": 833, "height": 843 }, "action": { "type": "message", "text": "โปร" } },
    { "bounds": { "x": 833,  "y": 843, "width": 834, "height": 843 }, "action": { "type": "uri", "uri": "https://maps.app.goo.gl/xxxx" } },
    { "bounds": { "x": 1667, "y": 843, "width": 833, "height": 843 }, "action": { "type": "message", "text": "ติดต่อเจ้าหน้าที่" } }
  ]
}
```

`selected: true` opens the menu automatically when the chat opens. Compact (2500×843): 1 row, 3 cells 833 / 834 / 833 wide × 843 high.


## reference: rich-menu-sources.md

# Sources · line-design

ตรวจล่าสุด 2026-10-26 (ตรวจซ้ำทุก 6 เดือน ครั้งหน้า 2027-04-26) · แหล่ง: https://developers.line.biz/en/reference/messaging-api/ (หัวข้อ Requirements for rich menu image · rich menu object · bulk link) · https://developers.line.biz/en/docs/messaging-api/using-rich-menus/ · ค่าในตารางนี้เป็นเพดานที่ API ของ LINE กำหนดเอง จึงใช้หน้าอ้างอิง API ทางการเป็นแหล่งหลัก (เกินเพดาน API ตอบ error ทันที)


## reference: rich-menu.md


# LINE Rich Menu — a 6-button menu image plus JSON that passes LINE's limits

> **Pre-work gate (every time):** read the owner's theme → search live for prototypes → 3 genuinely different directions → run `design-gate/no-ai-look` before sending · follow the "ด่านก่อนลงมือ" section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand sets colours and fonts, while the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **One rule:** the rich menu is the shop front; 6 clear buttons work better than 12 tiny ones.

## Use when
- A LINE Official Account (OA) needs a rich menu: design, JSON, upload, or a seasonal swap.

Not for: stickers and emoji → the sticker body (`sticker.md`) · OA setup, chatbot, broadcast → `line-oa` (plugin `e-commerce`, if installed)

## Hard limits
`campaign-set` points here for rich menu sizes, so this table is the one copy. `../scripts/richmenu_check.py` reads these numbers (stored in [`richmenu-limits.json`](richmenu-limits.json)); re-check against https://developers.line.biz/en/reference/messaging-api/ every 6 months (ตรวจล่าสุด 2026-10-26 · ครั้งหน้า 2027-04-26).

| Item | Limit |
|---|---|
| Image format | JPEG or PNG |
| Image size (px) | full **2500×1686**, compact **2500×843** (also 1200×810, 1200×405, 800×540, 800×270). The API accepts any size inside its limits: width 800–2500, height ≥ 250, width/height ≥ 1.45 · the sizes listed are the ones the OA Manager templates use |
| File size | max **1 MB** |
| Tap areas | max **20** per menu (bounds x, y, width, height in image pixels) |
| `chatBarText` | max **14** characters |
| Rich menus per channel | **1,000** |
| Bulk link or unlink | max **500** user IDs per call |

## Steps
1. Pick the 6 main customer tasks from chat history.
2. Choose the route: 1 menu for everyone, ≤ 6 buttons, from a template → OA Manager → Rich menus (no developer needed). Different menus for members and guests, tabs, A/B, or a silent postback the bot handles → Messaging API (per-user link or rich menu alias).
3. Write the designer brief: size, grid, safe margins, brand colours, text per cell. No brand yet → search for prototypes first: take the project's keywords and search live per `design-gate/design-references` type `app`, then pull colours from the chosen piece; use the stored palette library only when live search is not possible.
4. Design rules: max 6 buttons on full size, 3 on compact (เช็คราคา · สั่งซื้อ · ติดตามพัสดุ · โปรโมชัน · ที่ตั้ง/เวลาทำการ · ติดต่อเจ้าหน้าที่) · 1–2 words plus an icon per button; Thai text ≥ ~60 px tall on the 2500 px image · primary action biggest (e.g. double-width cell) and "ติดต่อเจ้าหน้าที่" always present · keep 30–50 px inside each cell edge free of text · each button is a `message` (a keyword the bot knows, see `e-commerce:line-oa` if installed), `postback`, `uri` (https:// or tel:), or `richmenuswitch` for tabs. A ready 6-button JSON with grid coordinates: [`rich-menu-6-buttons.md`](rich-menu-6-buttons.md).
5. Export ≤ 1 MB (PNG-8 or JPEG quality ~80). Check locally: `python ../scripts/richmenu_check.py menu.json menu.png` (size, 20 areas, 14 characters, areas inside the image, 1 MB; `--self-test` 8/8).
6. API route: `validate` → create → upload → test on one user (your own account) → **ask approval** → set default → test on iOS and Android. Endpoints: [`api-sequence.md`](api-sequence.md). Every call needs `Authorization: Bearer {channel access token}`; read the token from an environment variable (e.g. `LINE_CHANNEL_TOKEN`); never write it to a file, a log or the reply.
7. **Needs user approval first** (it changes what every follower sees and is hard to undo; `superuser` section 6, "รออนุมัติ"): `POST .../user/all/richmenu/...` (set default) and every delete of a rich menu or image. Before asking, show that `validate` passed and the menu works for one test user, then wait for a yes.
8. Text fallback: the greeting message lists the same 6 keywords. Seasonal menu: create the new one first, ask approval, switch default, then delete the old one only after approval too.
9. Before handing over, run the check in `design-gate/no-ai-look` section 3 (script on HTML/CSS, eye check 3.2 on images).

## Check before done
- Image, tap areas, `chatBarText` and file size pass `richmenu_check.py`
- Set-default and deletes were approved by the user; no token in any file, log or reply
- One test user first, then iOS and Android
- The `ด่านก่อนลงมือ:` line closes the work

## References
- [`rich-menu-6-buttons.md`](rich-menu-6-buttons.md) — open for the 6-button full menu JSON and grid
- [`api-sequence.md`](api-sequence.md) — open when using the Messaging API (also which menu a user sees first)
- [`richmenu-limits.json`](richmenu-limits.json) — limits read by the checker script
- [`rich-menu-sources.md`](rich-menu-sources.md) — source pages and check date


## reference: sticker-sources.md

# Sources · line-design

- The 3 LINE Creators Market guideline pages above · read 2026-11-10
- The checker script follows the pattern of `scripts/richmenu_check.py` · the idea of "report pass/fail per item" comes from anthropics/skills `slack-gif-creator` `core/validators.py` (checked 2026-11-10: it was rewritten entirely and no code was copied)

Sources, read 2026-11-10: https://creator.line.me/en/guideline/sticker/ · https://creator.line.me/en/guideline/animationsticker/ · https://creator.line.me/en/guideline/emoji/ · the animated page also says the size is "within 320 × 270, with width or height at least 270 px" (read through a page summary, (รอยืนยัน) the exact wording) · re-check by 2027-05-10 · the same numbers live in [sticker-limits.json](sticker-limits.json)


## reference: sticker-worked-example.md

## Worked example

Task: a dessert shop makes a set of 8 static stickers from an existing cartoon cat · Do: list 8 situations, draw all 8 images at 370 × 320 with a transparent background, make `main.png` 240 × 240 and `tab.png` 96 × 74, then run `python scripts/sticker_check.py sticker-set --kind static` · Result: if one image is 371 × 320, the script answers `ไม่ผ่าน: 03.png: 371×320 ...`. Fix it and rerun until it shows `ผ่านทุกข้อ`


## reference: sticker.md


# LINE Sticker and Emoji

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists · close the work with the line `ด่านก่อนลงมือ:`

> **The one rule:** check the files with `../scripts/sticker_check.py` before every upload, and re-open LINE's official pages to confirm the limits once the check date has passed · the limits below were checked on 2026-11-10

A sticker is read on a chat background, small, in half a second. One feeling per sticker, one short Thai phrase, a thick outline, no detail that vanishes at 100 px.

## When to use / when not

- Use when: making a set of static stickers, animated stickers, or LINE emoji to sell on Creators Market or to use for a shop
- Do not use when: a LINE OA button menu → the rich menu body (`rich-menu.md`) · print stickers for products → `print-ready-files` · post images → `campaign-set`

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

Sources and read dates: [sticker-sources.md](sticker-sources.md) · re-check by 2027-05-10 · the same numbers live in [sticker-limits.json](sticker-limits.json) · the animated page also says the size is "within 320 × 270, with width or height at least 270 px" (read through a page summary, (รอยืนยัน) the exact wording)

Not read yet: LINE's content rules (what is rejected), the review time, the sales split and the copyright terms. Open the Creators Market guideline pages for those before promising an approval. (รอยืนยัน)

Asked "will it be approved" or "what share do I get": the script checks file numbers only, the review is LINE's. Mark the share `(รอยืนยัน)` and point to creator.line.me; give no percentage, not even "about 50% from memory" with a warning, because the user will plan income on it.

## 2 · Workflow

1. Write the set list first: 8, 16, 24, 32 or 40 situations (ทักทาย · ขอบคุณ · โอเค · งง · ขอโทษ · เหนื่อย ...) and one Thai phrase each · the count must be one of the allowed numbers, so pad or cut the list before drawing
2. Lock the character with `brand-kit` (face, outline weight, 4–6 colours) before drawing any image
3. Draw each image at its canvas size with a transparent background, the drawing about 10 px inside the edge · for an AI-drawn set use `image-generation` and cut the background out; check the edges at 100%
4. Thai text: thick, large, high contrast on both a white and a dark chat background (test both) · keep text out of the outer 10 px
5. Name files `main.png` · `tab.png` · `01.png` `02.png` ... (the checker treats `main.png` and `tab.png` by name; the naming is this skill's own habit, not a LINE rule)
6. Run `python ../scripts/sticker_check.py <folder> --kind static` (or `animated`, `emoji`) · it checks size, even dimensions, PNG, transparent pixels, 1 MB, count, and for animated files the frame, loop and seconds fields · `--self-test` runs it against files it builds itself
7. Zip, check the ZIP size against the table, then upload on the Creators Market · the review is LINE's decision

## 3 · Ask before

Uploading to a Creators Market account, accepting terms, or publishing a set for sale needs the owner's own yes · never use a login or token that was not handed over for this.

## Check before sending

1. The script shows `ผ่านทุกข้อ` on the real folder
2. View every image at 100% on a white and a dark background. The Thai text is readable and no tone mark is cut off
3. The whole set uses the same character in every image (`design-review` item 7)
4. The line `ด่านก่อนลงมือ:` is present and the work passes the eye check of `design-gate/no-ai-look`

## References

- [`sticker-worked-example.md`](sticker-worked-example.md) — open for a worked example of a set of 8 static stickers
- [`sticker-sources.md`](sticker-sources.md) — LINE guideline pages and read dates

## Related

`brand-kit` · `image-generation` · `line-design` · `campaign-set` · `design-review`
