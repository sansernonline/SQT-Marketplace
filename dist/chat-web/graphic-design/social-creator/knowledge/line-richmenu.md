# skill: line-richmenu

Use when a LINE OA needs a rich menu built

# LINE Rich Menu — a 6-button menu image plus JSON that passes LINE's limits

> **Pre-work gate (every time):** read the owner's theme → search live for prototypes → 3 genuinely different directions → run `design-gate/no-ai-look` before sending · follow the "ด่านก่อนลงมือ" section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand sets colours and fonts, while the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **One rule:** the rich menu is the shop front; 6 clear buttons work better than 12 tiny ones.

## Use when
- A LINE Official Account (OA) needs a rich menu: design, JSON, upload, or a seasonal swap.

Not for: stickers and emoji → `line-sticker` · OA setup, chatbot, broadcast → `line-oa-setup` · `line-chatbot` · `line-broadcast` (plugin `e-commerce`, if installed)

## Hard limits
`social-formats` points here for rich menu sizes, so this table is the one copy. `scripts/richmenu_check.py` reads these numbers (stored in [`references/richmenu-limits.json`](references/richmenu-limits.json)); re-check against https://developers.line.biz/en/reference/messaging-api/ every 6 months (ตรวจล่าสุด 2026-10-26 · ครั้งหน้า 2027-04-26).

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
4. Design rules: max 6 buttons on full size, 3 on compact (เช็คราคา · สั่งซื้อ · ติดตามพัสดุ · โปรโมชัน · ที่ตั้ง/เวลาทำการ · ติดต่อเจ้าหน้าที่) · 1–2 words plus an icon per button; Thai text ≥ ~60 px tall on the 2500 px image · primary action biggest (e.g. double-width cell) and "ติดต่อเจ้าหน้าที่" always present · keep 30–50 px inside each cell edge free of text · each button is a `message` (a keyword the bot knows, see `e-commerce:line-chatbot` if installed), `postback`, `uri` (https:// or tel:), or `richmenuswitch` for tabs. A ready 6-button JSON with grid coordinates: [`references/richmenu-6.md`](references/richmenu-6.md).
5. Export ≤ 1 MB (PNG-8 or JPEG quality ~80). Check locally: `python scripts/richmenu_check.py menu.json menu.png` (size, 20 areas, 14 characters, areas inside the image, 1 MB; `--self-test` 8/8).
6. API route: `validate` → create → upload → test on one user (your own account) → **ask approval** → set default → test on iOS and Android. Endpoints: [`references/api-sequence.md`](references/api-sequence.md). Every call needs `Authorization: Bearer {channel access token}`; read the token from an environment variable (e.g. `LINE_CHANNEL_TOKEN`); never write it to a file, a log or the reply.
7. **Needs user approval first** (it changes what every follower sees and is hard to undo; `superuser` section 6, "รออนุมัติ"): `POST .../user/all/richmenu/...` (set default) and every delete of a rich menu or image. Before asking, show that `validate` passed and the menu works for one test user, then wait for a yes.
8. Text fallback: the greeting message lists the same 6 keywords. Seasonal menu: create the new one first, ask approval, switch default, then delete the old one only after approval too.
9. Before handing over, run the check in `design-gate/no-ai-look` section 3 (script on HTML/CSS, eye check 3.2 on images).

## Check before done
- Image, tap areas, `chatBarText` and file size pass `richmenu_check.py`
- Set-default and deletes were approved by the user; no token in any file, log or reply
- One test user first, then iOS and Android
- The `ด่านก่อนลงมือ:` line closes the work

## References
- [`references/richmenu-6.md`](references/richmenu-6.md) — open for the 6-button full menu JSON and grid
- [`references/api-sequence.md`](references/api-sequence.md) — open when using the Messaging API (also which menu a user sees first)
- [`references/richmenu-limits.json`](references/richmenu-limits.json) — limits read by the checker script
- [`references/sources.md`](references/sources.md) — source pages and check date


## reference: api-sequence.md

# API sequence · line-richmenu

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


## reference: richmenu-6.md

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


## reference: sources.md

# Sources · line-richmenu

ตรวจล่าสุด 2026-10-26 (ตรวจซ้ำทุก 6 เดือน ครั้งหน้า 2027-04-26) · แหล่ง: https://developers.line.biz/en/reference/messaging-api/ (หัวข้อ Requirements for rich menu image · rich menu object · bulk link) · https://developers.line.biz/en/docs/messaging-api/using-rich-menus/ · ค่าในตารางนี้เป็นเพดานที่ API ของ LINE กำหนดเอง จึงใช้หน้าอ้างอิง API ทางการเป็นแหล่งหลัก (เกินเพดาน API ตอบ error ทันที)
