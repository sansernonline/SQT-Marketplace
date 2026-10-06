# skill: social-formats

Use before designing anything for Facebook, Instagram, TikTok, YouTube, LINE OA, X or LinkedIn. Picks the right sizes, ratios and safe zones for each placement and re-checks them against the platform's own help pages.

# Social Formats

Right size first, design second. A beautiful post in the wrong ratio gets cropped by the platform, and the crop always takes the headline.

All pixel sizes and safe zones are in [platform-sizes.md](references/platform-sizes.md), each with its source and check date. Platforms change specs without notice — re-open the source link before a paid campaign.

## Workflow

1. **List placements** the campaign really needs (from the `campaign-set` matrix) — not every platform, the ones the audience uses
2. **Group by ratio** — most needs collapse to four canvases: **9:16** (stories, reels, TikTok, Shorts), **4:5** (feed), **1.91:1 / 16:9** (link, X, YouTube), **special** (LINE rich menu, covers)
3. **Design the master** at the largest canvas of the main ratio (e.g. 1440 × 2560 for 9:16 if ads, 1080 × 1920 for organic)
4. **Overlay the safe zone** before placing text — template from the platform where available (Meta Ads Manager safe-zone guardrail, TikTok safe-zone template)
5. **Derive** other ratios by re-composing, not stretching: move the subject, re-flow the text
6. **Name** each export with the platform and format code (`asset-organize`)
7. **Preview on a phone** — upload privately or use the platform's preview; check what the UI covers

## The four canvases

| Canvas | Size to design | Used by |
|---|---|---|
| 9:16 vertical | 1080 × 1920 (organic) · 1440 × 2560 (Meta ads recommendation) | IG/FB Stories and Reels, TikTok, YouTube Shorts |
| 4:5 portrait feed | 1080 × 1350 (organic) · 1440 × 1800 (Meta ads recommendation) | IG and FB feed |
| 1:1 square | 1080 × 1080 | FB/IG feed fallback, LINE rich message (1040 × 1040) |
| Wide | 1200 × 630 (link, 1.91:1) · 1600 × 900 or 1920 × 1080 (16:9) | FB/LinkedIn link preview, X, YouTube |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.facebook.com/business/ads-guide/update/image · details per platform in [platform-sizes.md](references/platform-sizes.md)

## Safe zones that matter most

| Placement | Keep text and logos out of |
|---|---|
| Meta Stories and Reels (9:16) | Top **14%**, bottom **35%**, **6%** each side |
| TikTok | Right column (like/share buttons), bottom caption area, top account bar — use TikTok's official template; sizes vary with caption length |
| YouTube channel banner | Everything outside the centre 1235 × 338 of a 2048 × 1152 canvas (รอยืนยัน) |
| Facebook page cover | Outer edges — mobile and desktop crop differently; keep text in the centre |
| LinkedIn profile cover | Bottom-left, where the profile photo overlaps |
| LINE OA profile | Corners — the image is shown in a circle |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.facebook.com/business/ads-guide/update/image/instagram-story · https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads

## Rules

- Quote numbers only from the reference file or the platform's own page — third-party "size guides" lag
- Design at the recommended size; never upscale a small export
- Text on 9:16 sits in the middle band; the 35% bottom rule is the one most often broken
- Thai text needs more vertical room than Latin (tone marks above, vowels below) — leave extra top margin in tight headline boxes
- Keep file sizes under the limit in the reference (LINE rich menu 1 MB is the one that bites)
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

## Related

- `campaign-set` — which placements, in what order
- `asset-organize` — format codes in file names
- `video-script-to-clip` — captions and safe zones in video
- `software-company` `graphic-design` (if installed) — print sizes and LINE rich menu layout for product work


## reference: platform-sizes.md

# Platform sizes and safe zones

Contents: 1 Meta (Facebook + Instagram) · 2 TikTok · 3 YouTube · 4 LINE Official Account · 5 X · 6 LinkedIn · 7 Export settings

Numbers marked (รอยืนยัน) came from secondary sources or were not visible on the official page at check time — confirm on the platform before a paid campaign.

## 1 · Meta (Facebook and Instagram)

| Placement | Ratio | Size | Notes |
|---|---|---|---|
| Feed image ad (FB/IG) | 4:5 | 1440 × 1800 recommended · min width 600 | JPG/PNG, max 30 MB |
| Stories / Reels image ad | 9:16 | 1440 × 2560 recommended · min width 500 | Safe zone: top 14%, bottom 35%, sides 6% |
| Organic IG feed | 4:5 · 1:1 · 1.91:1 | 1080 × 1350 · 1080 × 1080 · 1080 × 566 | IG accepts 1.91:1 to 3:4; profile grid previews at 3:4 (รอยืนยัน) |
| Organic IG story / reel | 9:16 | 1080 × 1920 | Same safe zone as ads |
| FB page cover | — | Upload 851 × 315; min 400 × 150 | sRGB JPG under 100 KB loads fastest; desktop and mobile crop differently — centre the text (display sizes 820 × 312 desktop, 640 × 360 mobile (รอยืนยัน)) |
| FB link preview | 1.91:1 | 1200 × 630 | Same for LinkedIn link posts |
| Primary text / headline (ads) | — | 50–150 characters; headline about 27 characters | Stories primary text 125 characters |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.facebook.com/business/ads-guide/update/image · https://www.facebook.com/business/ads-guide/update/image/instagram-story · https://www.facebook.com/help/125379114252045

## 2 · TikTok

| Placement | Ratio | Size | Notes |
|---|---|---|---|
| Video (organic and in-feed ad) | 9:16 recommended | 1080 × 1920 to design; ads accept ≥ 540 × 960 | Also 1:1 (≥ 640 × 640) and 16:9 (≥ 960 × 540) for ads |
| Ad file | — | ≤ 500 MB; .mp4 .mov .mpeg .3gp .avi; bitrate ≥ 516 kbps | Duration up to 10 minutes for non-Spark ads |
| Ad captions | — | Shown in white, fixed font | No links or hashtags in ad caption |
| Safe zone | — | Download the official template (LTR) | Area varies with caption length; approx. keep clear right ~22%, bottom ~35%, top ~13% (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads

## 3 · YouTube

| Placement | Ratio | Size | Notes |
|---|---|---|---|
| Video thumbnail | 16:9 | 3840 × 2160 max · min width 640 (1280 × 720 is the common working size) | JPG/PNG; 2 MB limit on mobile upload, 50 MB on desktop |
| Shorts thumbnail | 9:16 | 2160 × 3840 max · min height 640 | — |
| Shorts video | 9:16 | 1080 × 1920 | Bottom and right covered by UI (รอยืนยัน exact zone) |
| Channel banner | 16:9 | 2560 × 1440 recommended · min 2048 × 1152 | Text and logo in centre 1235 × 338 (at 2048 × 1152) · max 6 MB (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://support.google.com/youtube/answer/72431 · banner: https://support.google.com/youtube/answer/2972003 (numbers not shown on page at check time)

Vertical videos with a 16:9 custom thumbnail get an auto-generated 4:5 thumbnail on home, explore and subscription pages — design a vertical-safe thumbnail for vertical videos.

## 4 · LINE Official Account (LINE OA)

| Item | Size | Notes |
|---|---|---|
| Rich menu large | 2500 × 1686 (also 1200 × 810, 800 × 540) | Up to 6 tap areas in the OA Manager templates |
| Rich menu compact | 2500 × 843 (also 1200 × 405, 800 × 270) | Up to 3 tap areas |
| Rich menu rules (Messaging API) | Width 800–2500, height ≥ 250, width/height ≥ 1.45 | JPEG or PNG, **max 1 MB** |
| Rich message | 1040 × 1040 | Square |
| Profile image | 640 × 640 (รอยืนยัน) | Cropped to a circle |
| Cover image | 1080 × 878 (รอยืนยัน) | Top part covered by the account name |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://developers.line.biz/en/docs/messaging-api/using-rich-menus/ · https://developers.line.biz/en/reference/messaging-api/ (rich menu image requirements) · profile/cover sizes from LINE OA Manager upload screen (รอยืนยัน)

Rich menu text: each tap area is about one-third of the phone width on screen; Thai label at least ~80 px tall on the 2500 px canvas so it reads after scaling (house rule — test on a phone).

## 5 · X

| Item | Size | Notes |
|---|---|---|
| In-stream image | 16:9, 1600 × 900 or 1200 × 675 | Max 5 MB (รอยืนยัน) |
| Header | 1500 × 500 (3:1) | Top and bottom may be cropped about 60 px on some devices (รอยืนยัน) |
| Profile | 400 × 400 | Circle crop · max 2 MB (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo (page returned 403 at check time — all X numbers รอยืนยัน)

## 6 · LinkedIn

| Item | Size | Notes |
|---|---|---|
| Company page logo | 400 × 400 recommended · min 268 × 268 | PNG or JPEG, max 3 MB |
| Company page cover | 1512 × 256 | Keep content central |
| Link post image | 1.91:1, 1200 × 627 | Min width 200 px |
| Life tab main image | 1128 × 376 | — |
| Personal profile background | 1584 × 396 (4:1) (รอยืนยัน) | Profile photo covers bottom-left |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.linkedin.com/help/linkedin/answer/a563309

## 7 · Export settings that work everywhere

- Colour: sRGB; never CMYK for screens
- Photos: JPG quality 80–90; graphics with flat colour and text: PNG
- Video: H.264 MP4, 30 fps (or 25), AAC audio, captions burned in for sound-off viewing
- Name with platform and format codes (`asset-organize`)
