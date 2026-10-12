---
name: social-formats
description: Use when designing for Facebook, Instagram, TikTok, YouTube, LINE OA, X or LinkedIn. Sizes, ratios and safe zones per placement, checked against help pages.
---

# Social Formats

Right size first, design second. A beautiful post in the wrong ratio gets cropped by the platform, and the crop always takes the headline.

All pixel sizes and safe zones are in [platform-sizes.md](references/platform-sizes.md), each with its source and check date. Platforms change specs without notice — re-open the source link before a paid campaign.

## Workflow

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

## Related

- `campaign-set` — which placements, in what order
- `asset-organize` — format codes in file names
- `video-script-to-clip` — captions and safe zones in video
- `software-company` `graphic-design` (if installed) — print sizes and LINE rich menu layout for product work
