---
name: social-formats
description: Use when designing for Facebook, Instagram, TikTok, YouTube, LINE OA or X. Sizes, ratios, safe zones.
argument-hint: <path to master asset> [platforms needed]
---

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
