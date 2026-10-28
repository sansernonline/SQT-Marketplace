# skill: social-formats

Use when designing for Facebook, Instagram, TikTok, YouTube, LINE OA or X. Sizes, ratios, safe zones.

# Social Formats

Right size first, design second. A beautiful post in the wrong ratio gets cropped by the platform, and the crop always takes the headline.

All pixel sizes and safe zones are in [platform-sizes.md](references/platform-sizes.md), each with its source and check date. This is the owner of these numbers; `software-company:graphic-design` and `line-richmenu` point here and keep only a fallback copy. Platforms change specs without notice — re-open the source link before a paid campaign.

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

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.facebook.com/business/ads-guide/update/image · details per platform in [platform-sizes.md](references/platform-sizes.md)

## Safe zones that matter most

| Placement | Keep text and logos out of |
|---|---|
| Meta Stories and Reels (9:16) | Top **14%**, bottom **35%**, **6%** each side |
| TikTok (9:16) | On 1080 × 1920: top **240 px**, bottom **660 px**, **120 px** each side, plus a **180 px** strip on the right over the lower 1080 px (buttons) — TikTok's in-feed template, scaled from 720 × 1280; longer captions take more room |
| YouTube Shorts (9:16) | On 1080 × 1920: top **288 px**, bottom **672 px**, left **48 px**, right **192 px** (Google Ads figure for ads in Shorts · using it for ordinary Shorts is our inference, no official organic figure found) |
| YouTube channel banner | Everything outside the centre 1235 × 338 of a 2048 × 1152 canvas (official page only · รอยืนยัน) |
| Facebook page cover | Outer edges — mobile and desktop crop differently; keep text in the centre |
| LinkedIn profile cover | Bottom-left, where the profile photo overlaps |
| LINE OA profile | Corners — the image is shown in a circle |

ตรวจล่าสุด 2026-10-06 (Meta) · 2026-10-26 (TikTok · YouTube) · แหล่ง: https://www.facebook.com/business/ads-guide/update/image/instagram-story · https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads (ไฟล์แม่แบบ In-Feed) · https://support.google.com/google-ads/answer/9128498 · https://support.google.com/youtube/answer/10456525 · ตัวเลข TikTok และ Shorts ตรงกับคู่มือที่ไม่ใช่ทางการอีก 2 แหล่งต่อแพลตฟอร์ม (รายการใน platform-sizes.md)

## Rules

- Quote numbers only from the reference file or the platform's own page — third-party "size guides" fall behind
- Design at the recommended size; never upscale a small export
- Text on 9:16 sits in the middle band. The bottom-35% rule is the one most often broken
- Thai text needs more vertical room than Latin (tone marks above, vowels below) — leave extra top margin in tight headline boxes
- Keep file sizes under the limit in the reference (the LINE rich menu 1 MB limit is the one people hit most)
- Facebook link previews and LinkedIn link posts crop to 1.91:1 — a 1:1 image there loses top and bottom

## Worked example

Brief: a café promotes a new drink on IG feed, IG story, TikTok and LINE OA.

| Placement | Canvas | Export name |
|---|---|---|
| IG feed | 1080 × 1350 (4:5) | `matcha26-hero-ig-feed45-v01-th.jpg` |
| IG story | 1080 × 1920, text inside middle band (y 269–1248 px) | `matcha26-hero-ig-story-v01-th.jpg` |
| TikTok video | 1080 × 1920, captions above the bottom caption area | `matcha26-clip-tt-video-v01-th.mp4` |
| LINE OA rich message | 1040 × 1040 | `matcha26-hero-line-richmsg-v01-th.jpg` |

Story middle band: 1920 × 14% = 269 px from top; 1920 × 35% = 672 px from bottom → usable to y = 1248.

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the 8-point eye check on images and other files. The full list of AI tells for every medium lives there.

## Related

- `campaign-set` — which placements, in what order
- `asset-organize` — format codes in file names
- `video-script-to-clip` — captions and safe zones in video
- `software-company` `graphic-design` (if installed) — print sizes and LINE rich menu layout for product work


## reference: platform-sizes.md

# Platform sizes and safe zones

> ตัวเลขของแพลตฟอร์มเปลี่ยนได้ทุกเมื่อ ตรวจซ้ำทุก 6 เดือน (ครั้งหน้า 2027-04-26)

Contents: 1 Meta (Facebook + Instagram) · 2 TikTok · 3 YouTube · 4 LINE Official Account · 5 X · 6 LinkedIn · 7 Export settings

Numbers marked (รอยืนยัน) came from secondary sources or were not visible on the official page at check time — confirm on the platform before a paid campaign.

## 1 · Meta (Facebook and Instagram)

| Placement | Ratio | Size | Notes |
|---|---|---|---|
| Feed image ad (Facebook (FB)/Instagram (IG)) | 4:5 | 1440 × 1800 recommended · min width 600 | JPG/PNG, max 30 MB |
| Stories / Reels image ad | 9:16 | 1440 × 2560 recommended · min width 500 | Safe zone: top 14%, bottom 35%, sides 6% |
| Organic IG feed | 4:5 · 1:1 · 1.91:1 | 1080 × 1350 · 1080 × 1080 · 1080 × 566 | IG accepts 1.91:1 to 3:4; profile grid previews at 3:4 (รอยืนยัน) |
| Organic IG story / reel | 9:16 | 1080 × 1920 | Same safe zone as ads |
| FB page cover | — | Upload 851 × 315; min 400 × 150 | standard RGB (sRGB) JPG under 100 KB loads fastest; desktop and mobile crop differently — centre the text (display sizes 820 × 312 desktop, 640 × 360 mobile (รอยืนยัน)) |
| FB link preview | 1.91:1 | 1200 × 630 | LinkedIn link posts use 1200 × 627 (1200 × 630 also works at 1.91:1), see section 6 |
| Primary text / headline (ads) | — | 50–150 characters; headline about 27 characters | Stories primary text 125 characters |

ตรวจล่าสุด 2026-10-06 · ตรวจซ้ำทุก 6 เดือน ครั้งหน้า 2027-04-06 · แหล่ง: https://www.facebook.com/business/ads-guide/update/image · https://www.facebook.com/business/ads-guide/update/image/instagram-story · https://www.facebook.com/help/125379114252045

## 2 · TikTok

| Placement | Ratio | Size | Notes |
|---|---|---|---|
| Video (organic and in-feed ad) | 9:16 recommended | 1080 × 1920 to design; ads accept ≥ 540 × 960 | Also 1:1 (≥ 640 × 640) and 16:9 (≥ 960 × 540) for ads |
| Ad file | — | ≤ 500 MB; .mp4 .mov .mpeg .3gp .avi; bitrate ≥ 516 kbps | Duration up to 10 minutes for non-Spark ads |
| Ad captions | — | Shown in white, fixed font | No links or hashtags in ad caption |
| Safe zone | 9:16 | Official in-feed template (2025-04) on 720 × 1280: top 160 · bottom 440 · sides 80 each · right strip 120 wide over the lower 720 | On 1080 × 1920 that is top 240 · bottom 660 · sides 120 · right strip 180 over the lower 1080 · longer captions or add-ons take more room |

ตรวจล่าสุด 2026-10-26 · แหล่ง: https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads (ทางการ · ไฟล์แม่แบบ In-Feed/Feed.png) · https://emplifi.io · https://adnabu.com (คู่มือ safe zone ของ TikTok · 2 แหล่งนี้ไม่ได้พูดถึงแถบขวา 120 px จึงยึดแม่แบบทางการ)

## 3 · YouTube

| Placement | Ratio | Size | Notes |
|---|---|---|---|
| Video thumbnail | 16:9 | 3840 × 2160 max · min width 640 (1280 × 720 is the common working size) | JPG/PNG; 2 MB limit on mobile upload, 50 MB on desktop · account must be verified · design rules in `youtube-thumbnail` |
| Shorts thumbnail | 9:16 | 2160 × 3840 max · min height 640 | — |
| Shorts video | 9:16 | 1080 × 1920 | Keep clear: top 288 · bottom 672 · left 48 · right 192 px (Google Ads figure for ads in Shorts; no official organic figure found) |
| Channel banner | 16:9 | 2560 × 1440 recommended · min 2048 × 1152 | Text and logo in centre 1235 × 338 (at 2048 × 1152) · max 6 MB (official page only · รอยืนยัน) |

ตรวจล่าสุด 2026-10-26 · แหล่ง: https://support.google.com/youtube/answer/72431 (thumbnail · ทางการ) · https://support.google.com/youtube/answer/10456525 (banner · ทางการ · answer/2972003 เดิมไม่มีตัวเลข) · Shorts: https://support.google.com/google-ads/answer/9128498 (ทางการ · อ่านตัวเลขจากภาพ SVG ในหน้า) ตรงกับ https://socialync.io และ https://reap.video

Vertical videos with a 16:9 custom thumbnail get an auto-generated 4:5 thumbnail on home, explore and subscription pages — design a vertical-safe thumbnail for vertical videos.

## 4 · LINE Official Account (LINE OA)

| Item | Size | Notes |
|---|---|---|
| Rich menu large | 2500 × 1686 (also 1200 × 810, 800 × 540) | Up to 6 tap areas in the OA Manager templates |
| Rich menu compact | 2500 × 843 (also 1200 × 405, 800 × 270) | Up to 3 tap areas |
| Rich menu rules (Messaging API) | Width 800–2500, height ≥ 250, width/height ≥ 1.45 | JPEG or PNG, **max 1 MB** |
| Rich message | 1040 × 1040 | Square |
| Profile image | 640 × 640 · max 3 MB · JPG/PNG (รอยืนยัน) | Cropped to a circle |
| Cover image | 1080 × 878 · max 3 MB (รอยืนยัน) | Top part covered by the account name |

ตรวจล่าสุด 2026-10-26 · แหล่ง: rich menu: https://developers.line.biz/en/reference/messaging-api/ (ทางการ · เพดานที่ API กำหนดเอง) · profile: 3 แหล่งที่ไม่ใช่ทางการตรงกัน (https://www.marketingoops.com/?p=238782 · ligla.jp · aurant-technologies.com) ไม่พบหน้าทางการ · cover: เจอแหล่งเดียว (marketingoops) · ข่าว LINE ปี 2018 บอก 720 × 1280 ซึ่งเก่าแล้ว · ก่อนอัปโหลดดูขนาดที่หน้าจออัปโหลดของ LINE OA Manager บอก

Rich menu text: each tap area is about 1/3 of the phone width on screen. Make the Thai label at least ~80 px tall on the 2500 px canvas so it reads after scaling (house rule — test on a phone).

## 5 · X

| Item | Size | Notes |
|---|---|---|
| In-stream image | 16:9, 1600 × 900 or 1200 × 675 (รอยืนยัน) | Guides split between the 2 sizes; X's own ad spec says 800 × 418 (1.91:1) or 800 × 800 (1:1), max 5 MB for image ads (รอยืนยัน for ordinary posts) |
| Header | 1500 × 500 (3:1) | Up to 60 px may be cropped at top and bottom depending on screen and browser |
| Profile | 400 × 400 | Circle crop · max 2 MB · JPEG, GIF or PNG |

ตรวจล่าสุด 2026-10-26 · แหล่ง: https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo (ทางการ · header และ profile) ตรงกับ tweetarchivist.com และ postiz.com · https://help.x.com/en/business-and-advertising/creative-ad-specifications (ทางการ · ขนาดรูปโฆษณา) · help.x.com ตอบ 403 กับเครื่องมือ จึงอ่านข้อความหน้าทางการจากผลค้นหา · ภาพในโพสต์ทั่วไปไม่พบตัวเลขทางการ

## 6 · LinkedIn

| Item | Size | Notes |
|---|---|---|
| Company page logo | 400 × 400 recommended · min 268 × 268 | PNG or JPEG, max 3 MB |
| Company page cover | 1512 × 256 | Keep content central |
| Link post image | 1.91:1, 1200 × 627 | Min width 200 px |
| Life tab main image | 1128 × 376 | — |
| Personal profile background | 1584 × 396 (4:1) (รอยืนยัน) | Profile photo covers bottom-left |

ตรวจล่าสุด 2026-10-06 · ตรวจซ้ำทุก 6 เดือน ครั้งหน้า 2027-04-06 · แหล่ง: https://www.linkedin.com/help/linkedin/answer/a563309

## 7 · Export settings that work everywhere

- Colour: sRGB; never Cyan Magenta Yellow Key (CMYK) for screens
- Photos: JPG quality 80–90; graphics with flat colour and text: PNG
- Video: H.264 MP4, 30 frames per second (fps) (or 25), AAC audio, captions burned in for sound-off viewing
- Name with platform and format codes (`asset-organize`)


---

# skill: campaign-set

Use when one campaign (launch, sale, event, festival) needs assets for several platforms from one concept.

# Campaign Set

1 concept, every format it needs, in the right order. 5 one-off designs are not a campaign. 1 idea shown 5 ways is.

## Workflow

1. **Campaign card** — fill the card below. If you cannot write the 1-sentence summary, stop and get it from the owner
2. **Asset matrix** (the table of every asset needed) — 1 row per placement, using [asset-matrix-template.md](references/asset-matrix-template.md). Sizes come from `social-formats`
3. **Cut** — remove any row that does not serve the sentence or the audience's channels
4. **Style lock** — **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `social` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้ · then write or reuse a style lock sheet (`style-consistency`) before any generation or shoot
5. **Master first** — design the hero at the main placement's ratio (the one that carries most of the campaign), at its largest canvas. Get it approved before deriving anything. Then derive tallest to widest
6. **Derive in order** — stills by ratio (9:16 → 4:5 → 1:1 → wide) → covers and banners → motion and video last, built from the still's look
7. **Name** every file with the `asset-organize` pattern, putting the matrix ID in its optional `<id>` token
8. **Ship gate** (final check before posting) — each asset passes `design-review` and its matrix row is ticked. No tick, no post

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

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the 8-point eye check on images and other files. The full list of AI tells for every medium lives there.

## Related

- `social-formats` — sizes and safe zones per row
- `style-consistency` — the look shared by all rows
- `video-script-to-clip` — V rows
- `design-review` — the ship gate
- `asset-organize` — names and folders


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

| ID | Placement | Platform | Canvas (px) | Ratio | Still / video | Length | Copy on image (TH / EN) | Derived from | Owner | Due | Review | Status | File name |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 | Feed (master) | ig | 1080 × 1350 | 4:5 | Still | — | | — | | | ☐ | To do | |
| D1 | Story | ig/fb | 1080 × 1920 | 9:16 | Still | — | | M1 | | | ☐ | To do | |
| D2 | | | | | | | | M1 | | | ☐ | | |
| V1 | Reel / TikTok | tt/ig | 1080 × 1920 | 9:16 | Video | 15 s | | M1 | | | ☐ | | |

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
