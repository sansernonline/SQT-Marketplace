---
name: marketplace-product-images
description: Use when product photos go on Shopee, Lazada or TikTok Shop
---

# marketplace-product-images — product images for Shopee · Lazada · TikTok Shop

> **Gate before starting (every time):** read the owner's theme → search live references → 3 genuinely different directions → check `no-ai-look` before sending · follow the "ด่านก่อนลงมือ" (pre-start gate) section of `design-references` (plugin `superuser`), even when a brand exists (the brand sets colours and fonts, and the search is for the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

The owner is agent `social-creator` · text on the product page (name · description · banned ad claims) lives in `e-commerce:product-listing`

> **One rule:** the cover image must show one real product, fully visible, on a plain background, with no contact channel and no other platform's logo (the individual bans are still `รอยืนยัน` (awaiting confirmation), see the table). Make 1 set at 1:1, 1000 × 1000 or larger (a value we chose to sit above the minimum once seen), then compare it with each platform's live minimum. Before uploading a big batch, open the official pages again.

## Use when

- Shooting or editing product photos to list in a shop on Shopee · Lazada · TikTok Shop
- An image was rejected, a product was suspended, or penalty points were given because of an image
- Making a cover image, a product option image (colour · size), a size chart or an image in the description

## Do not use when (use another skill instead or alongside)

| Task | Use |
|---|---|
| Product name, description, words banned in ads | `e-commerce:product-listing` (if installed) |
| Shop banner, ad post, video clip | `social-formats` · `campaign-set` · `video-script-to-clip` |
| Generating a product image with AI or changing the background | `brief-to-image` · `image-editing-brief` · it must still be the real product the customer will receive |
| Several images that must look like one set | `style-consistency` |
| Labels, boxes, stickers sent to a printer | `print-ready-files` |

## Steps

1. **Shoot once, use on every platform:** the full product, straight-on angle, even light, white or plain-colour background · export 1:1 at 1000 × 1000 up to 1600 × 1600 · JPG, with a file size under the ceiling read live from the official page.
2. **Cover image (the first image):** a single product fills most of the frame (TikTok Shop has a minimum share for the product, check live) · do not zoom so far that the product edge is cut · no frame around the 4 sides · as little text and as few stickers as possible, and never covering the product.
3. **Images after the cover (no more than the platform allows):** other angles · material detail · size against a hand or a familiar object · size chart (clothing) · in-use image · each colour option image must match the colour actually shipped.
4. **Check the banned items** (the ban table) on every image, not only the cover.
5. **Name the files** per `asset-organize`, for example `mug-white-shopee-cover-v01.jpg` · keep 1 set of original files with no text added.

## Image size and count per platform

Marketplace image rules change often, so no figures are kept here. What stays fixed is the main 1:1 ratio and a single set of images shot once and usable on every platform.

What to look up for each of Shopee, TikTok Shop and Lazada: minimum and maximum image size · ratio rules (including Shopee 3:4 and what the promotion slot shows) · number of images per listing · file size and format · cover background and how much of the frame the product must fill · video limits (file size, length, dimensions). Official sources: `references/sources.md`. Lazada has no openable official page, so mark every Lazada value (รอยืนยัน) unless you find one.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน).

## What is banned on images

| Ban | Platforms whose official page states it | Result if broken |
|---|---|---|
| Contact channels: phone number · LINE · page · email · QR code · link to another sales channel | Shopee · TikTok Shop | Shopee gives penalty points |
| A badge or symbol that imitates the platform's (for example Shopee's own badge) · a generic badge such as "free shipping" is fine | Shopee | Shopee suspends the product every Friday until it is fixed |
| An image that is not the real product, or edited until it differs from what is shipped | Shopee · TikTok Shop · Lazada (product quality policy) | The product is removed · customers return the goods |
| Using another shop's image, or removing someone else's watermark | Shopee | The product is removed |
| A sticker or watermark covering the product | TikTok Shop | Fails review |
| Nudity, obscene, violent or frightening images | Shopee (no appeal) · TikTok Shop | The product is removed |
| Using someone else's brand or logo without permission | TikTok Shop | The product is removed |
| Another platform's logo on the image | Seen only in search results, official page not yet read | (รอยืนยัน) |

Every row in this table comes from the platform's official page, but there are not yet 2 independent sources besides, so it still counts as (รอยืนยัน) under the 3-source rule. No rule about "text over X%", "no price on the image" or "no collage of several images" was found on the official pages of all 3 platforms. Do not tell the user these rules exist.

## Check before handing over

- [ ] Every image is 1:1, at least 1000 × 1000, and the file is under the platform's live ceiling
- [ ] The cover is one real product, fully visible, on a plain background, with no frame and with text that does not cover the product
- [ ] No phone number, LINE, QR, link or other platform's logo in any image
- [ ] Colours in the option images match what is really shipped · an image made or edited with AI still shows the same single product that is sold
- [ ] Tell the user which values are still (รอยืนยัน), and to look at the platform's upload page before listing a big batch

## References

- [`references/sources.md`](references/sources.md) — open when looking up live marketplace image rules (official pages, Lazada gap)
- [`references/worked-example.md`](references/worked-example.md) — open to see a full 3-platform ceramic-mug run
