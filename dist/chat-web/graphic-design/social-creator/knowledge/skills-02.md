# skill: social-formats

Use when designing for Facebook, Instagram, TikTok, YouTube, LINE OA or X. Sizes, ratios, safe zones.

# Social Formats

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

Right size first, design second. A beautiful post in the wrong ratio gets cropped by the platform, and the crop always takes the headline.

Platforms change sizes, safe zones and file limits without notice, so this skill keeps only the canvas sizes we design at. Look up safe zones and limits live on the platform's own page each time (WebSearch/WebFetch, links in [platform-sizes.md](references/platform-sizes.md)); if the page will not open, mark the value (รอยืนยัน). `line-richmenu` keeps its own numbers because its script checks them.

## Workflow

0. **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `social` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้
1. **List placements** the campaign really needs (from the `campaign-set` matrix) — only the platforms the audience uses, not every platform
2. **Group by ratio** — most needs fit 4 canvases: **9:16** (stories, reels, TikTok, Shorts), **4:5** (feed), **1.91:1 / 16:9** (link, X, YouTube), **special** (LINE rich menu, covers)
3. **Design the master** at the largest canvas of the main ratio (e.g. 1440 × 2560 for 9:16 if ads, 1080 × 1920 for organic)
4. **Overlay the safe zone** before placing text — template from the platform where available (Meta Ads Manager safe-zone guardrail, TikTok safe-zone template)
5. **Derive** other ratios by re-composing, not stretching: move the subject, re-flow the text
6. **Name** each export with the platform and format code (`asset-organize`)
7. **Preview on a phone** — upload privately or use the platform's preview; check what the UI covers

## The four canvases

| Canvas | Size to design | Used by |
|---|---|---|
| 9:16 vertical | 1080 × 1920 (organic) · 1440 × 2560 (Meta ads recommendation) | Instagram (IG)/Facebook (FB) Stories and Reels, TikTok, YouTube Shorts |
| 4:5 portrait feed | 1080 × 1350 (organic) · 1440 × 1800 (Meta ads recommendation) | IG and FB feed |
| 1:1 square | 1080 × 1080 | FB/IG feed fallback, LINE rich message (1040 × 1040) |
| Wide | 1200 × 630 (link, 1.91:1) · 1600 × 900 or 1920 × 1080 (16:9) | FB link preview (1200 × 630), LinkedIn link preview (1200 × 627, same 1.91:1), X, YouTube |

These are our design defaults. Before a paid campaign, confirm the recommended size on the platform's ads guide (links in [platform-sizes.md](references/platform-sizes.md)).

## Safe zones

Keep text and logos out of the areas the platform UI covers. The areas differ per placement (Meta Stories and Reels · TikTok · YouTube Shorts · channel banner · page cover · profile photo), and are changed often, so open the platform's safe-zone guide or template live before placing text, and write the numbers you used with the link and today's date in the answer. On 9:16 the bottom band (caption and buttons) is the one most often broken.

## Rules

- Quote numbers only from the platform's own page — third-party "size guides" fall behind
- Design at the recommended size; never upscale a small export
- Text on 9:16 sits in the middle band
- Thai text needs more vertical room than Latin (tone marks above, vowels below) — leave extra top margin in tight headline boxes
- Keep file sizes under the platform's current limit (look it up; the LINE rich menu limit is in `line-richmenu`)
- Facebook link previews and LinkedIn link posts crop to 1.91:1 — a 1:1 image there loses top and bottom

## Worked example

Brief: a café promotes a new drink on IG feed, IG story, TikTok and LINE OA.

| Placement | Canvas | Export name |
|---|---|---|
| IG feed | 1080 × 1350 (4:5) | `matcha26-hero-ig-feed45-v01-th.jpg` |
| IG story | 1080 × 1920, text inside the middle band from Meta's current safe-zone guide | `matcha26-hero-ig-story-v01-th.jpg` |
| TikTok video | 1080 × 1920, captions above the bottom caption area | `matcha26-clip-tt-video-v01-th.mp4` |
| LINE OA rich message | 1040 × 1040 | `matcha26-hero-line-richmsg-v01-th.jpg` |

Story middle band: turn Meta's current top and bottom percentages into pixels on the 1920 px height, for example 14% → 269 px (illustrative, look up the current figure).

## Number posts (infographic in a post)

1 image = 1 conclusion: the title states the finding ("ยอดขายเดือนนี้เพิ่ม 20%"), the line under it gives the period, the source goes small at the bottom. Sort bars by value, label the bars directly when there are about 12 or fewer, mark only what the reader must see. Full chart rules (Thai font, colours): `software-development` `data-analysis` (if installed). Idea from anthropics `claude-tag-data-viz` graphing (rewritten, no code copied · ตรวจ 2026-11-10).

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files.

## Related

- `campaign-set` — which placements, in what order
- `asset-organize` — format codes in file names
- `video-script-to-clip` — captions and safe zones in video
- `banner-design` — banners and cover headers (event, web hero, display ad)
- `youtube-thumbnail` — thumbnails for YouTube
- `marketplace-product-images` — product photos for Shopee, Lazada, TikTok Shop
- `line-richmenu` — LINE rich menu image sizes, tap areas and JSON
- `print-ready-files` — files that go to a print shop (CMYK, bleed)

## เรียกเป็นคำสั่ง

`/graphic-design:social-formats <path to master asset> [platforms needed]`

Run `social-formats` and `campaign-set` derivation steps on: **$ARGUMENTS**

Never stretches an image. Every derived file has the platform and format in its name.


## reference: platform-sizes.md

# Platform sizes and safe zones

> Platform numbers change at any time, so this file stores no pixel sizes, file limits or safe-zone figures. For each platform it says what to look up and where. Open the official page with WebSearch/WebFetch before using a number. If the page will not open, mark the value (รอยืนยัน) and tell the user to confirm on the platform before a paid campaign.

Contents: 1 Meta (Facebook + Instagram) · 2 TikTok · 3 YouTube · 4 LINE Official Account · 5 X · 6 LinkedIn · 7 Export settings

## 1 · Meta (Facebook and Instagram)

Placements to look up: feed image ad (4:5) · Stories / Reels image ad (9:16) · organic Instagram (IG) feed · organic IG story / reel · Facebook (FB) page cover · FB link preview · ad primary text and headline length.

Look up the recommended size, minimum width, file limit and the Stories/Reels safe zone (top, bottom, sides) for each placement. The desktop and mobile crops of the FB page cover differ, so centre the text. The IG profile grid previews feed posts in a different ratio from the feed itself. Look up that ratio too.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Sources: https://www.facebook.com/business/ads-guide/update/image · https://www.facebook.com/business/ads-guide/update/image/instagram-story · https://www.facebook.com/help/125379114252045

## 2 · TikTok

Placements to look up: organic and in-feed ad video (9:16 recommended; 1:1 and 16:9 also exist for ads) · ad file limits (size, format, bitrate, duration) · ad caption rules · in-feed safe zone.

For the safe zone, use the official in-feed template, which gives the top, bottom, side and right-strip margins on a 720 × 1280 frame. Scale the margins to the real canvas, and leave extra room for longer captions or add-ons. Third-party guides (emplifi.io · adnabu.com) leave out the right strip, so do not use them for it.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Source: https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads

## 3 · YouTube

Placements to look up: video thumbnail (16:9) · Shorts thumbnail (9:16) · Shorts video (9:16) and its keep-clear margins · channel banner (16:9) and its text-safe area.

For the video thumbnail, look up the maximum and minimum size, file formats, the file limit on mobile versus desktop upload, and the account-verification requirement. Design rules for the thumbnail itself are in `youtube-thumbnail`. For Shorts, Google publishes the keep-clear margins only for ads in Shorts. Say so if you quote them for organic Shorts.

Vertical videos with a 16:9 custom thumbnail get an auto-generated 4:5 thumbnail on home, explore and subscription pages. Design a vertical-safe thumbnail for vertical videos.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Sources: https://support.google.com/youtube/answer/72431 (thumbnail) · https://support.google.com/youtube/answer/10456525 (banner) · https://support.google.com/google-ads/answer/9128498 (Shorts margins)

## 4 · LINE Official Account (LINE OA)

Rich menu: sizes, tap-area limits, file limit and the Messaging API rules are in `line-richmenu`, which also holds the checker script. Use that skill, not this file.

Other items to look up: rich message size · profile image size and file limit · cover image size, file limit and the part covered by the account name. No official page was found for profile and cover at the last check, so mark them (รอยืนยัน) unless the LINE OA Manager upload screen states them. Old LINE news posts give outdated sizes, so ignore them.

Rich menu text: each tap area is about 1/3 of the phone width on screen. Make the Thai label at least ~80 px tall on the 2500 px canvas so it reads after scaling (house rule — test on a phone).

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Sources: https://developers.line.biz/en/reference/messaging-api/ (rich menu) · the upload screen of LINE OA Manager (profile, cover)

## 5 · X

Items to look up: in-stream image (16:9) · ad image sizes and file limit · header (3:1) and how much is cropped at top and bottom · profile image, crop shape and file limit.

Guides disagree on the in-stream image size, and X publishes no official figure for ordinary posts. Mark that value (รอยืนยัน) unless you find one. The ad spec is official but applies to ads only.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Sources: https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo (header, profile) · https://help.x.com/en/business-and-advertising/creative-ad-specifications (ad images). help.x.com may return 403 to tools, so read the official text through search results.

## 6 · LinkedIn

Items to look up: company page logo and cover · link post image (1.91:1) · Life tab main image · personal profile background (4:1) and what the profile photo covers.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Source: https://www.linkedin.com/help/linkedin/answer/a563309

## 7 · Export settings that work everywhere

- Colour: sRGB; never Cyan Magenta Yellow Key (CMYK) for screens
- Photos: JPG quality 80–90; graphics with flat colour and text: PNG
- Video: H.264 MP4, 30 frames per second (fps) (or 25), AAC audio, captions burned in for sound-off viewing
- Name with platform and format codes (`asset-organize`)


---

# skill: campaign-set

Use when one campaign (launch, sale, event, festival) needs assets for several platforms from one concept.

# Campaign Set

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

1 concept, every format it needs, in the right order. 5 one-off designs are not a campaign. 1 idea shown 5 ways is.

## Workflow

1. **Campaign card** — fill the card below. If you cannot write the 1-sentence summary, stop and get it from the owner
2. **Asset matrix** (the table of every asset needed) — 1 row per placement, using [asset-matrix-template.md](references/asset-matrix-template.md). Sizes come from `social-formats`
3. **Cut** — remove any row that does not serve the sentence or the audience's channels
4. **Style lock** — **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `social` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้ · then write or reuse a style lock sheet (`style-consistency`) before any generation or shoot
5. **Master first** — design the hero at the main placement's ratio (the one that carries most of the campaign), at its largest canvas. Get it approved before deriving anything. Then derive tallest to widest
6. **Derive in order** — stills by ratio (9:16 → 4:5 → 1:1 → wide) → covers and banners → motion and video last, built from the still's look
7. **Name** every file with the `asset-organize` pattern, putting the matrix ID in its optional `<id>` token
8. **Ship gate** (final check before posting) — each asset passes `design-review`, has its alt text (1 Thai line: what is seen plus the text on the image), its promo claims pass `copy-claims-check`, and its matrix row is ticked. No tick, no post

## Campaign card

| Field | Example |
|---|---|
| One sentence | "Our new matcha drink is the calm way to cool down this hot season." |
| Audience | Office workers 22–35 near Silom, follow us on Instagram (IG) and LINE |
| One action | Order at the counter or LINE OA with code `MATCHA26` |
| Offer and dates | Buy 1 get 1, 1–12 April |
| Mandatory items | Logo, price, LINE OA ID, promo terms line |
| Tone | Calm, fresh, not shouting |
| Approver | Owner (ชื่อ), 24 h turnaround |

## Derivation order — why

| Order | Asset | Reason |
|---|---|---|
| 1 | Master hero at the main placement's ratio (here 4:5; 9:16 if the story is the main placement) | Design where the text area is tightest. If it works here, it works on the others |
| 2 | Other still ratios | Rearrange the same elements. Never stretch |
| 3 | Covers, banners, rich menu | Wide or special shapes reuse the hero's parts |
| 4 | Carousel and secondary posts | Same style, new content |
| 5 | Motion and video | Animate approved stills. Changing the look in video breaks the set |

## Worked example — small matrix

| ID | Placement | Canvas | Type | Copy on image | Due | Status |
|---|---|---|---|---|---|---|
| M1 | IG feed (master) | 1080 × 1350 | Still | "มัทฉะเย็น ซื้อ 1 แถม 1" + dates | 25 Mar | Approved |
| D1 | IG/Facebook (FB) story | 1080 × 1920 | Still | Same + LINE ID | 26 Mar | In review |
| D2 | LINE OA rich message | 1040 × 1040 | Still | Same + "แตะเพื่อรับโค้ด" | 26 Mar | To do |
| D3 | LINE rich menu large | 2500 × 1686 | Still | Menu labels | 27 Mar | To do |
| D4 | FB cover | 851 × 315 | Still | Headline only | 27 Mar | To do |
| V1 | TikTok / Reels 12 s | 1080 × 1920 | Video | Hook + offer, captions | 29 Mar | To do |

File for D1: `matcha26-d1-hero-ig-story-v01-th.jpg` (campaign · matrix ID · asset · platform · format · version · language).

## Rules

- The campaign sentence is the filter for every row and every element
- Derive, do not redesign. Keep the same type, colours, subject and layout logic across rows
- Mandatory items (price, terms, ID) appear identically on every asset — copy them from the card, never retype them
- Thai promo text: check numbers and dates against the card on every row. A wrong date on 1 platform is the most common campaign error
- Deliver the matrix as a checklist file the team ticks through, saved in the campaign's `02-exports/` folder

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files.

## Related

- `social-formats` — sizes and safe zones per row
- `style-consistency` — the look shared by all rows
- `video-script-to-clip` — V rows
- `design-review` — the ship gate
- `copy-claims-check` — wording of offers and claims before posting
- `line-sticker` — when the campaign includes a LINE sticker set
- `asset-organize` — names and folders

## เรียกเป็นคำสั่ง

`/graphic-design:campaign-set <campaign idea in one sentence>`

Run `campaign-set` with the `social-creator` and `brand-keeper` agents for: **$ARGUMENTS**

Delivers the asset matrix as a checklist. An asset counts as done only after it passes design-review.


## reference: asset-matrix-template.md

# Asset matrix template

Save as `02-exports/<campaign>/asset-matrix.md`. One row per file that will be published.

```markdown
# Asset matrix — <campaign code>

Campaign sentence: <one sentence>
Audience: <who> · Action: <one action> · Dates: <from–to>
Style lock: <sheet name + version> · Brand kit: <version>
Mandatory on every asset: <logo · price · ID · terms line>
Approver: <name> · Turnaround: <hours>

| ID | Placement | Platform | Canvas (px) | Ratio | Still / video | Length | Copy on image (TH / EN) | Max text | If longer | Alt text (TH, 1 line) | Derived from | Owner | Due | Review | Status | File name |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 | Feed (master) | ig | 1080 × 1350 | 4:5 | Still | — | | headline 25 Thai chars · 2 lines | cut a line, or shrink ≤ 15%, or move to the caption | | — | | | ☐ | To do | |
| D1 | Story | ig/fb | 1080 × 1920 | 9:16 | Still | — | | | | | M1 | | | ☐ | To do | |
| D2 | | | | | | | | | | | M1 | | | ☐ | | |
| V1 | Reel / TikTok | tt/ig | 1080 × 1920 | 9:16 | Video | 15 s | | | | | M1 | | | ☐ | | |

**Max text** is counted without Thai tone marks and upper/lower vowels (the Netflix Thai count in `motion-basics`); 25 above is an example, set the real number from the master layout. Thai has no spaces, so break a longer line where `human-writing` `references/thai-line-breaking.md` allows. Sample row for a long product name: `M1 · "มัทฉะเย็นโอ๊ตมิลค์สูตรพิเศษ ขนาด 16 ออนซ์" · max 25 chars → 2 lines at 64 px · longer → drop the size to the caption`. Reference the brand kit's tokens by name (colour role, type style), not by hex or px, so a Canva template edit by the team follows a kit update. Idea from anthropics/knowledge-work-plugins `design/skills/design-handoff` (Apache-2.0 · rewritten · ตรวจ 2026-11-10).

Status values: To do · In progress · In review · Fix · Approved · Posted

## Sign-off
| Date | Rows approved | By |
|---|---|---|
```

## ID scheme

- `M` = master (one per ratio family at most)
- `D` = derived still
- `V` = video or motion
- `P` = print

IDs go into file names (`<campaign>-<id>-<asset>-<platform>-<format>-vNN`, the `asset-organize` pattern with its optional `<id>`; ID in lowercase) so a comment like "fix D3" finds one file.

## Before a row counts as done

1. Canvas and ratio match the row
2. Text inside the platform safe zone (`social-formats`)
3. Mandatory items present and identical to the card
4. Passes `design-review` (eight points)
5. Exported with the right name, standard RGB (sRGB), under the file-size limit
