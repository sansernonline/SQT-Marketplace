# Social media sizes and print work

> Caution: **platform numbers can change** — recorded Sep 2569 (Buddhist Era)
> Before sending real work, open the platform's documents and confirm again
> The print numbers (section 3) are industry standards and rarely change
>
> Sections 1–2 are a quick copy — the source is `campaign-set` (it searches the platform guides live for safe areas, links are in `campaign-set/references/platform-sizes.md`), and if the numbers differ, treat campaign-set's as correct

## Contents

| # | Heading |
|---|---|
| 1 | [LINE Official Account](#1--line-official-account-line-oa) |
| 2 | [Other social platforms](#2--other-social-platforms) |
| 3 | [Print work](#3--print-work) |
| 4 | [ไฟล์ที่ต้องส่งมอบ](#4--ไฟล์ที่ต้องส่งมอบ) (files to deliver) |

---

## 1 · LINE Official Account (LINE OA)

| Item | Size | Note |
|---|---|---|
| Large rich menu | 2500 × 1686 px | The template in LINE Official Account Manager splits into up to 6 cells · if set through the Messaging API, up to 20 tap areas can be defined |
| Small rich menu | 2500 × 843 px | The template splits into up to 3 cells · through the Messaging API also up to 20 tap areas |
| Rich message | 1040 × 1040 px | Square |
| Profile picture | 640 × 640 px | Cropped to a circle |
| Account page background image | 1080 × 878 px | The top part is covered by the account name |

> Checked 2026-10-14: the figure of 20 tap areas and the accepted image sizes (2500×1686, 2500×843, 1200×810, 1200×405, 800×540, 800×270 · file no more than 1 MB) come from secondary documents that cite the Messaging API reference (bottender.js.org, dev.classmethod.jp), because the page developers.line.biz/en/reference/messaging-api/#rich-menu-object loads its content with JavaScript and cannot be read automatically · (รอยืนยัน) (pending confirmation) against the official page before real use

**Cautions for rich menus** — users tap with a finger, so the smallest cell should be no narrower than
1/3 of the width, and the text in the cell must stay readable when scaled down to a real phone screen width
(about 1/3 of 2500 px)

---

## 2 · Other social platforms

| Platform | Item | Size |
|---|---|---|
| TikTok | Video · cover image | 1080 × 1920 px (9:16) |
| Facebook | Square post | 1080 × 1080 px |
| Facebook | Link image | 1200 × 630 px |
| Facebook | Page cover image | 1640 × 856 px |
| Instagram | Vertical feed | 1080 × 1350 px (4:5) |
| Instagram | Story · reel | 1080 × 1920 px |
| YouTube | Video thumbnail | 1280 × 720 px |

**Safe area of a vertical clip** — keep the top 15% and bottom 20% clear,
because the app's buttons and captions cover them

**Link image 1200 × 630** — text must be large enough to read when shown at a width of about 500 px

---

## 3 · Print work

| Topic | Value |
|---|---|
| Resolution | **300 dots per inch at actual size** |
| Bleed | **3 mm on all sides** |
| Safe distance from the trim edge | 3–5 mm |
| Color system | Use CMYK for offset and specify Pantone if the brand color matters |
| Rich black on large areas | C60 M40 Y40 K100 |
| Black for small text | **K100 only** |
| Thinnest line | 0.25 pt |
| Smallest text | 6 pt (Thai should be 7 pt and up, because the lower vowels fill in) |

**The 3 most common mistakes**

1. **Scaling up or down and still thinking it is 300 dots per inch** — an image at 300 dots per inch at 10 cm
   drops to 150 dots per inch when enlarged to 20 cm
2. **Forgetting bleed** — work made exactly to the edge shows a white edge when the cutter shifts by 1 mm
3. **Sending an RGB file to the printer** — many vivid colors on screen cannot be printed in CMYK,
   especially bright blue, neon green, vivid orange

**Standard Thai sizes**

| Item | Finished size | Size with bleed |
|---|---|---|
| Business card | 90 × 54 mm | 96 × 60 mm |
| A4 | 210 × 297 mm | 216 × 303 mm |
| A5 | 148 × 210 mm | 154 × 216 mm |
| A3 poster | 297 × 420 mm | 303 × 426 mm |

---

## 4 · ไฟล์ที่ต้องส่งมอบ

**Logo** — sending only a pixel-based image file is not enough

| File | What it is for |
|---|---|
| SVG | The original that scales without breaking, usable on the web |
| PDF | Sent to the printer |
| Transparent PNG | 64 · 256 · 512 · 1024 · 2048 px · the logo + name lockup also adds @2x |
| ICO | Made from raster images, with 16 · 32 · 48 · 256 px together in one file |

**This is the single export set** — `logo-design.md` step 6 links to this table; edit only here

**Each type must have 4 versions** — normal color · inverted (white) · solid black · solid white

**Accompanying document** — clear space around the logo · smallest size (px and mm) · what not to do

**Test for whether the delivery is complete** — if the recipient opens the folder and has to ask back
"Is there a white version?", it is not complete yet
