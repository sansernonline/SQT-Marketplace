# skill: line-richmenu

Use when a LINE OA needs a rich menu built

# LINE Rich Menu

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

The rich menu is the shop front. 6 clear buttons work better than 12 tiny ones.

## 1. Hard limits

`social-formats` points here for rich menu sizes, so this table is the one copy. A script (`scripts/richmenu_check.py`) reads these numbers, so they stay stored; re-check them against the LINE page below.

| Item | Limit |
|---|---|
| Image format | JPEG or PNG |
| Image size (px) | full **2500×1686**, compact **2500×843** (also 1200×810, 1200×405, 800×540, 800×270). The API accepts any size inside its limits: width 800–2500, height ≥ 250, width/height ≥ 1.45 · the sizes listed are the ones the OA Manager templates use |
| File size | max **1 MB** |
| Tap areas | max **20** per menu (bounds x, y, width, height in image pixels) |
| `chatBarText` | max **14** characters |
| Rich menus per channel | **1,000** |
| Bulk link or unlink | max **500** user IDs per call |

ตรวจล่าสุด 2026-10-26 (ตรวจซ้ำทุก 6 เดือน ครั้งหน้า 2027-04-26) · แหล่ง: https://developers.line.biz/en/reference/messaging-api/ (หัวข้อ Requirements for rich menu image · rich menu object · bulk link) · https://developers.line.biz/en/docs/messaging-api/using-rich-menus/ · ค่าในตารางนี้เป็นเพดานที่ API ของ LINE กำหนดเอง จึงใช้หน้าอ้างอิง API ทางการเป็นแหล่งหลัก (เกินเพดาน API ตอบ error ทันที)

What a user sees, highest priority first: **per-user menu (API) > default menu (API) > default menu set in OA Manager**.

## 2. No-code or API?

| Need | Use |
|---|---|
| 1 menu for everyone, ≤ 6 buttons, from a template | OA Manager → Rich menus (no developer needed) |
| Different menus for members and guests, tabs, A/B | Messaging API, per-user link or rich menu alias |
| Button sends a silent postback the bot handles | API (OA Manager offers text, link, coupon and similar) |

## 3. Design rules

1. Max 6 buttons on full size, 3 on compact: เช็คราคา · สั่งซื้อ · ติดตามพัสดุ · โปรโมชัน · ที่ตั้ง/เวลาทำการ · ติดต่อเจ้าหน้าที่.
2. 1–2 words plus an icon per button; Thai text at least ~60 px tall on the 2500 px image so it reads on a phone.
3. Primary action biggest (e.g. a double-width cell); "ติดต่อเจ้าหน้าที่" always present.
4. Keep 30–50 px inside each cell edge free of text.
5. Each button → `message` (a keyword the bot knows, see `e-commerce:line-chatbot` if installed), `postback`, `uri` (https:// or tel:), or `richmenuswitch` for tabs.

## 4. API sequence

```
POST   https://api.line.me/v2/bot/richmenu/validate                      check the JSON
POST   https://api.line.me/v2/bot/richmenu                               create → {richMenuId}
POST   https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content     upload (Content-Type image/png or image/jpeg)
POST   https://api.line.me/v2/bot/user/all/richmenu/{richMenuId}         set default for everyone
POST   https://api.line.me/v2/bot/user/{userId}/richmenu/{richMenuId}    link to one user (e.g. member)
DELETE https://api.line.me/v2/bot/user/{userId}/richmenu                 unlink → user falls back to default
```

All calls need `Authorization: Bearer {channel access token}` · read the token from an environment variable (for example `LINE_CHANNEL_TOKEN`); never write it to a file, a log or the reply. Many users at once: `POST /v2/bot/richmenu/bulk/link` (up to 500 user IDs per call · ตรวจล่าสุด 2026-10-26 ในหน้าอ้างอิง API).

**Needs user approval first** (it changes what every follower sees and is hard to undo; listed in `superuser` section 6, "รออนุมัติ"): `POST .../user/all/richmenu/...` (set default) and every delete of a rich menu or image. Before asking, show the user that `validate` passed and that the menu works for one test user (`POST .../user/{userId}/richmenu/{richMenuId}` on your own account), then wait for a yes.

A ready JSON for a 6-button full menu with the grid coordinates: [references/richmenu-6.md](references/richmenu-6.md).

## 5. Workflow

1. Pick the 6 main customer tasks from chat history.
2. Designer brief — size, grid, safe margins, brand colours, text per cell · no brand yet → **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `app` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้.
3. Export ≤ 1 MB (PNG-8 or JPEG quality ~80).
4. Check locally first: `python scripts/richmenu_check.py menu.json menu.png` (size, 20 areas, 14 characters, areas inside the image, 1 MB; limits in [references/richmenu-limits.json](references/richmenu-limits.json), checked 2026-10-26 · `--self-test` 8/8). Then the API: validate → create → upload → test on one user → **ask approval** → set default → test on iOS and Android.
5. Text fallback: the greeting message lists the same 6 keywords.
6. Seasonal menu: create the new one first, ask approval, switch default, then delete the old one only after approval too.

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files.

## Related

`line-oa-setup` · `line-chatbot` · `line-broadcast` (plugin `e-commerce`, if installed). · `line-sticker` (stickers and emoji, same Creators-side limits style).


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


---

# skill: youtube-thumbnail

Use when a YouTube video needs a thumbnail

# youtube-thumbnail — YouTube video thumbnails that stay readable on a phone screen

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live references → 3 truly different directions → check `no-ai-look` before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colours and fonts; the search is for this piece's layout) · close the work with the line `ด่านก่อนลงมือ:`

Lives in plugin `graphic-design` · wording follows `human-writing` · owned by agent `social-creator` · sizes for every platform are in `social-formats`, file `references/platform-sizes.md`, YouTube section, which keeps links for live lookup and no numbers.

> **The one rule:** a thumbnail must be understood at stamp size · shrink the image to 168 px wide (about the size in the recommended list on mobile · our own value, not yet measured on every app version) and if you can still read the words on it and tell what the video is about, it can be sent.

## Use when

- Making a new YouTube thumbnail, or fixing a thumbnail people do not click
- Thai text on the thumbnail is too small, sinks into the background, or has tone marks colliding
- Wanting to test several thumbnails to see which is better

## Do not use when (use another, or pair them)

| Job | Use |
|---|---|
| TikTok · Reels · post covers or channel banners | `social-formats` |
| Script or the hook in the first 5 seconds of the video | `speaking-script` · `video-script-to-clip` |
| People or scenes that must be made with AI | `brief-to-image` · `image-generation` |
| A whole series of thumbnails that must look like a set | `style-consistency` · colours and fonts from `brand-kit` |
| Checking the look before sending | `design-review` |
| Starting a thumbnail design that has no direction yet | **Search references first:** take the project's words and search live per `design-references` (plugin `superuser`), type `social`, then pull colours from the chosen work · the stored palette library is for when live search is not possible |

## Steps

1. **Pick the one thing the thumbnail must say.** Let the thumbnail and the video title tell the story together without repeating words · the title gives detail, the thumbnail gives the feeling or the result.
2. **Set up a 16:9 page** at the working size from YouTube Help (see the section "YouTube requirements"), then export as JPG or PNG · the source image may be larger than the working size, up to the maximum that page gives.
3. **Text of at most 3–4 words**, bold, at least about 1/6 of the image height (our own value) · for Thai, leave space above and below the line for tone marks and vowels (line spacing at least 1.3 times the font size · our own value) · use a Thai font that really has a Bold or Black weight, not the regular weight made fake-bold.
4. **Contrast:** text and background differ by at least 4.5:1 (WCAG 2.2 threshold for normal text, the same number as `brand-kit`) · busy background → add a text outline, shadow, or a colour bar behind the text.
5. **Leave the bottom-right corner empty.** YouTube puts the video length badge over that corner (visible on every list page) · keep text and faces on the left or in the middle.
6. **Vertical video:** YouTube makes a 4:5 thumbnail automatically from the 16:9 one on the home and subscriptions pages · put the important part in the middle of the image so it survives the crop.
7. **Shrink to 168 px wide** (with a script or any program) and answer 2 questions: can you read the text · can you tell what it is about · fail → cut words, enlarge the letters, or remove elements.
8. **Filter before upload (for looks, compare in pairs, do not score).** Take the 2–3 thumbnails you made, shrink them to 168 px wide, and have 3–5 people choose pair by pair which thumbnail they would rather click, swapping left and right in every pair. Put the result in the same format as [`references/thumbnail-pairwise.example.json`](references/thumbnail-pairwise.example.json) and run `node <decision-scoring>/scripts/decide.mjs pairwise file.json` (`<decision-scoring>` is the folder of skill `superuser:decision-scoring`) · a close result (the script says below 60%) → send both thumbnails into Test & compare and let YouTube decide, no need to choose yourself · drop a thumbnail that loses clearly · the example in the file is made-up data, run and passed on 2026-10-28
9. **Test several thumbnails (Test & compare)** when the channel has it enabled (table below) · make 2–3 truly different versions of 1 topic (a face vs a product image · with text vs no text), not just different colours.

## YouTube requirements

| Topic | Value | Status |
|---|---|---|
| Size | Ratio 16:9 · Shorts thumbnail 9:16 · maximum size, minimum size and recommended working size: look them up live on the YouTube Help page | Look up live |
| File | Accepted file types, and the file size ceiling for uploading from mobile and from a computer: look them up live on the YouTube Help page | Look up live |
| Right to upload custom thumbnails | Account must be verified first · there is a daily upload limit | Official page |
| Test & compare: how many versions can be tested | Can test thumbnails, titles, or both · look up the maximum number of versions live on the Test & compare page | Look up live |
| Test & compare: who can use it | Channels with advanced features turned on · done in YouTube Studio on a computer · not usable with Shorts · videos made for kids · adult or 18+ videos · private videos · scheduled live streams · Premieres that have not ended | Official page + 1 source |
| Test & compare: how it decides | Uses **watch time share**, not click rate · no clear winner → shows the first version uploaded · the result shows as Winner or Preferred | Confirmed by 3 sources |
| Test & compare: how long it takes | Look up the test length live on the Test & compare page | Look up live |

The test result is decided by watch time, so a thumbnail that lures clicks but makes people leave quickly loses · never promise the user "clicks will go up".

Look up live: the thumbnail size, file limit and Test & compare limits (number of variants, test length, who can use it) at the two YouTube Help pages in the sources section. Look it up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน).

## Worked example

Brief: a cooking channel, video "ต้มยำกุ้งน้ำข้น 15 นาที" (creamy tom yum goong in 15 minutes)

| Step | Do | Result |
|---|---|---|
| One thing | The thumbnail says "fast", the title says the dish | Text on the thumbnail "15 นาที", 2 words |
| Layout | Bowl of tom yum on the left, the cook's face top right, bottom-right corner empty | The length badge covers nothing |
| Shrink to 168 px | "15 นาที" is readable · the orange bowl is visible | ผ่าน (pass) |
| Test | Version A has a face · version B the bowl only | Set up Test & compare, then wait for the result for the length of time the YouTube Help page gives |

## Check before sending

- [ ] 16:9 · size and file are within the ceilings looked up live from YouTube Help (both mobile upload and computer)
- [ ] Text ≤ 4 words, contrast ≥ 4.5:1 · Thai tone marks do not hit the edge or another line
- [ ] Bottom-right corner empty · vertical video has the important part in the middle of the image
- [ ] Shrunk to 168 px wide and still readable
- [ ] The thumbnail matches the real content of the video and does not trick people into clicking · the image, fonts and faces are licensed for use
- [ ] Passes `no-ai-look` item 3

## Sources

- YouTube Help: [Add video thumbnails](https://support.google.com/youtube/answer/72431) (size · file · account verification · 4:5 thumbnail for vertical video · look up live) · [Test & compare thumbnails and titles](https://support.google.com/youtube/answer/13861714) (official)
- Test & compare matches thumbnailtest.com · digit.in · streamlabs.com (thumbnailtest.com still says it is only for beta testers, which is out of date)
- Contrast: [WCAG 2.2 Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) (cited through `brand-kit`, checked 2026-10-06)
- Values marked "our own value" (168 px wide · letters 1/6 of the height · line spacing 1.3 · bottom-right corner) are internal guidelines, not yet measured on real apps
