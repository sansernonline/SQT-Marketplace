
# Social Formats

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `design-gate/no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

Right size first, design second. A beautiful post in the wrong ratio gets cropped by the platform, and the crop always takes the headline.

Platforms change sizes, safe zones and file limits without notice, so this skill keeps only the canvas sizes we design at. Look up safe zones and limits live on the platform's own page each time (WebSearch/WebFetch, links in [platform-sizes.md](platform-sizes.md)); if the page will not open, mark the value (รอยืนยัน). `line-design` keeps its own numbers because its script checks them.

## Workflow

0. **Find reference work first:** search live for the project's terms per `design-gate/design-references` (plugin `superuser`), type `social`, and take the colours from the chosen work · the stored palette library is used when live search is not possible
1. **List placements** the campaign really needs (from the `campaign-set` matrix) — only the platforms the audience uses, not every platform
2. **Group by ratio** — most needs fit 4 canvases: **9:16** (stories, reels, TikTok, Shorts), **4:5** (feed), **1.91:1 / 16:9** (link, X, YouTube), **special** (LINE rich menu, covers)
3. **Design the master** at the largest canvas of the main ratio (e.g. 1440 × 2560 for 9:16 if ads, 1080 × 1920 for organic)
4. **Overlay the safe zone** before placing text — template from the platform where available (Meta Ads Manager safe-zone guardrail, TikTok safe-zone template)
5. **Derive** other ratios by re-composing, not stretching: move the subject, re-flow the text
6. **Name** each export with the platform and format code (`brand-kit`)
7. **Preview on a phone** — upload privately or use the platform's preview; check what the UI covers

## The four canvases

| Canvas | Size to design | Used by |
|---|---|---|
| 9:16 vertical | 1080 × 1920 (organic) · 1440 × 2560 (Meta ads recommendation) | Instagram (IG)/Facebook (FB) Stories and Reels, TikTok, YouTube Shorts |
| 4:5 portrait feed | 1080 × 1350 (organic) · 1440 × 1800 (Meta ads recommendation) | IG and FB feed |
| 1:1 square | 1080 × 1080 | FB/IG feed fallback, LINE rich message (1040 × 1040) |
| Wide | 1200 × 630 (link, 1.91:1) · 1600 × 900 or 1920 × 1080 (16:9) | FB link preview (1200 × 630), LinkedIn link preview (1200 × 627, same 1.91:1), X, YouTube |

These are our design defaults. Before a paid campaign, confirm the recommended size on the platform's ads guide (links in [platform-sizes.md](platform-sizes.md)).

## Safe zones

Keep text and logos out of the areas the platform UI covers. The areas differ per placement (Meta Stories and Reels · TikTok · YouTube Shorts · channel banner · page cover · profile photo), and are changed often, so open the platform's safe-zone guide or template live before placing text, and write the numbers you used with the link and today's date in the answer. On 9:16 the bottom band (caption and buttons) is the one most often broken.

## Rules

- Quote numbers only from the platform's own page — third-party "size guides" fall behind
- Design at the recommended size; never upscale a small export
- Text on 9:16 sits in the middle band
- Thai text needs more vertical room than Latin (tone marks above, vowels below) — leave extra top margin in tight headline boxes
- Keep file sizes under the platform's current limit (look it up; the LINE rich menu limit is in `line-design`)
- Facebook link previews and LinkedIn link posts crop to 1.91:1 — a 1:1 image there loses top and bottom

## Number posts (infographic in a post)

1 image = 1 conclusion: the title states the finding ("ยอดขายเดือนนี้เพิ่ม 20%"), the line under it gives the period, the source goes small at the bottom. Sort bars by value, label the bars directly when there are about 12 or fewer, mark only what the reader must see. Full chart rules (Thai font, colours): `software-development` `data-analysis` (if installed).

## Not an AI look

Before handing over, run the check in `design-gate/no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files.

## Related

`campaign-set` (which placements, in what order) · `brand-kit` (format codes in file names) · `video-script` (captions and safe zones in video) · `design-by-type` (banners, cover headers) · `marketplace-product-images` · `line-design` (image sizes, tap areas, JSON) · `print-ready-files` (CMYK, bleed)

## References

- [`platform-sizes.md`](platform-sizes.md) — links to each platform's own size and safe-zone pages
- [`platform-sizes-worked-example.md`](platform-sizes-worked-example.md) — a café campaign across 4 placements with export names
