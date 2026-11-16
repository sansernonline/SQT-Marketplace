---
name: line-sticker
description: Use when making LINE stickers that must pass file limits
---

# LINE Sticker and Emoji

> **Pre-work gate (every time):** read the owner's theme → search live references → 3 genuinely different directions → check `no-ai-look` before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists · close the work with the line `ด่านก่อนลงมือ:`

> **The one rule:** check the files with `scripts/sticker_check.py` before every upload, and re-open LINE's official pages to confirm the limits once the check date has passed · the limits below were checked on 2026-11-10

A sticker is read on a chat background, small, in half a second. One feeling per sticker, one short Thai phrase, a thick outline, no detail that vanishes at 100 px.

## When to use / when not

- Use when: making a set of static stickers, animated stickers, or LINE emoji to sell on Creators Market or to use for a shop
- Do not use when: a LINE OA button menu → `line-richmenu` · print stickers for products → `print-ready-files` · post images → `social-formats`

## 1 · Hard limits (checked 2026-11-10)

| Item | Static sticker | Animated sticker | Emoji |
|---|---|---|---|
| Sticker image size | each ≤ 370 × 320 px | each ≤ 320 × 270 px | 180 × 180 px |
| Count per set | 8, 16, 24, 32 or 40 | 8, 16 or 24 | regular 8–40 · letter sets have other counts, read the page |
| Main image | 1 image, 240 × 240 | 1 image, 240 × 240 | not listed on the emoji page |
| Chat thumbnail (tab) icon | 1 image, 96 × 74 | 1 image, 96 × 74 | page lists the same 96 × 74 icon |
| File | PNG, transparent background, RGB, ≥ 72 dpi, even width and height | APNG with the `.png` extension, RGB, transparent | PNG, transparent |
| Each file | ≤ 1 MB | ≤ 1 MB | ≤ 1 MB |
| Motion | none | 5–20 frames · 1–4 loops · whole play ≤ 4 s | none |
| ZIP of everything | ≤ 60 MB | ≤ 60 MB | < 20 MB |
| Margin | about 10 px between the drawing and the image edge | not stated | not stated |

Sources and read dates: [references/sources.md](references/sources.md) · re-check by 2027-05-10 · the same numbers live in [references/sticker-limits.json](references/sticker-limits.json) · the animated page also says the size is "within 320 × 270, with width or height at least 270 px" (read through a page summary, (รอยืนยัน) the exact wording)

Not read yet: LINE's content rules (what is rejected), the review time, the sales split and the copyright terms. Open the Creators Market guideline pages for those before promising an approval. (รอยืนยัน)

Asked "will it be approved" or "what share do I get": the script checks file numbers only, the review is LINE's. Mark the share `(รอยืนยัน)` and point to creator.line.me; give no percentage, not even "about 50% from memory" with a warning, because the user will plan income on it.

## 2 · Workflow

1. Write the set list first: 8, 16, 24, 32 or 40 situations (ทักทาย · ขอบคุณ · โอเค · งง · ขอโทษ · เหนื่อย ...) and one Thai phrase each · the count must be one of the allowed numbers, so pad or cut the list before drawing
2. Lock the character with `style-consistency` (face, outline weight, 4–6 colours) before drawing any image
3. Draw each image at its canvas size with a transparent background, the drawing about 10 px inside the edge · for an AI-drawn set use `brief-to-image` and cut the background out; check the edges at 100%
4. Thai text: thick, large, high contrast on both a white and a dark chat background (test both) · keep text out of the outer 10 px
5. Name files `main.png` · `tab.png` · `01.png` `02.png` ... (the checker treats `main.png` and `tab.png` by name; the naming is this skill's own habit, not a LINE rule)
6. Run `python scripts/sticker_check.py <folder> --kind static` (or `animated`, `emoji`) · it checks size, even dimensions, PNG, transparent pixels, 1 MB, count, and for animated files the frame, loop and seconds fields · `--self-test` runs it against files it builds itself
7. Zip, check the ZIP size against the table, then upload on the Creators Market · the review is LINE's decision

## 3 · Ask before

Uploading to a Creators Market account, accepting terms, or publishing a set for sale needs the owner's own yes · never use a login or token that was not handed over for this.

## Check before sending

1. The script shows `ผ่านทุกข้อ` on the real folder
2. View every image at 100% on a white and a dark background. The Thai text is readable and no tone mark is cut off
3. The whole set uses the same character in every image (`design-review` item 7)
4. The line `ด่านก่อนลงมือ:` is present and the work passes the eye check of `no-ai-look`

## References

- [`references/worked-example.md`](references/worked-example.md) — open for a worked example of a set of 8 static stickers
- [`references/sources.md`](references/sources.md) — LINE guideline pages and read dates

## Related

`style-consistency` · `brief-to-image` · `line-richmenu` · `campaign-set` · `design-review`
