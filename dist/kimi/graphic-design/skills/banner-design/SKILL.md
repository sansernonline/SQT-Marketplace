---
name: banner-design
description: Use when making a banner, event cover or web hero
---

# banner-design — 3 banner directions at real size, checked before delivery

> **Pre-work gate (every time):** read the owner's theme → search live references → 3 genuinely different directions → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

Part of the `graphic-design` plugin. Follow `human-writing` for wording. The owner is the agent `social-creator`. The ideas and reference file come from the skill `banner-design` of nextlevelbuilder/ui-ux-pro-max-skill (MIT · see the Sources section).

> **One rule:** deliver 3 banner directions rendered as real-size PNGs and laid side by side. Each direction has a real reference opened in this round, not a direction you made up.

## Use when

- Seminar, webinar or event covers · page headers for Facebook, LinkedIn, YouTube · web hero images · web ad banners · large printed signs

Do not use when:

| Situation | Use |
|---|---|
| You only want platform sizes and safe areas | `social-formats` |
| A campaign of many pieces across platforms from one direction | `campaign-set` (it calls this skill for the banner piece) |
| A YouTube video cover | `youtube-thumbnail` |
| Sending files to a print shop | `print-ready-files`, after step 5 |

## Steps

1. **Collect the brief once** (use `AskUserQuestion` · do not ask what the conversation already answers): where it is used and the size · headline, sub-text, button or action · brand logo, colours, fonts · date, time, place · if you do not know the real data, put `(รอยืนยัน)` (awaiting confirmation) and do not invent it
2. **Find real references** following `design-references` (plugin `superuser`): first read the "สไตล์ออกแบบที่ชอบ" (favourite design styles) section in `~/.claude/superuser-style.md` · search at least 1 site in the `theme` category and 1 in the `social` category (Pinterest · Behance) with queries like `[purpose] banner design [style]` · `creative banner layout [industry]` (more example queries at the end of [`references/uipro-banner-sizes-and-styles.md`](references/uipro-banner-sizes-and-styles.md)) · open each page by hand, no fetch script · collect 3–5 images
3. **Pick 3 art directions** from the 22 in the reference file, and make them truly different (for example plain minimal · big type as the hero · 3D objects) · write 1 line per direction on why it fits this job, and cite the reference from step 2
4. **Build real-size HTML/CSS**, 1 file per direction · the outermost frame is `<div class="stage">` with width and height exactly the size · key items sit in the centre 70–80 %, at least 50 px from the edge · at most 2 font families, and both must fully support Thai (see `design-direction-lookup` domain `font`) · headline at least 32 px, body at least 16 px · one button, at least 44 px tall · text against background contrast at least 4.5:1 · one icon set (`icon-design`) inserted as `<span class="ic" style="--i:url(icons/x.svg)">`
   - Illustrations in this order: what the user supplied → images under an open licence (categories `3d` · `illustration` in `design-references`) → an image tool the session has (the prompt contains no text in the image) → build it with CSS and layered SVG (gradients, soft shadows, glowing edges) · never draw icons or logos yourself
   - All text lives in the HTML, not in the image, so it can be edited later
5. **Render and check the size**
   ```bash
   python scripts/render_banner.py <ไฟล์>.html --size 1200x628 --out <ไฟล์>.png --compare <ภาพต้นแบบ>.png
   ```
   You get a PNG at 2x resolution · it reports which fonts really loaded (Thai font not showing = do not send) · a size mismatch exits with 1 · `--compare` puts the reference on top and our work below · the script writes `<ไฟล์>.built.html` beside the source file (icons are inlined) and it can be deleted
6. **Check it does not look AI-made** following `no-ai-look`: run `slop_scan.py` on the HTML file · for things you deliberately copied from the reference (line pattern · light behind the object) write `slop-ok` with the reason · send the comparison image to a fresh `design-critic` to find 3 points where we lose to the reference, with scores of 1–10 for our work and the reference (answer in at most 10 lines) · fix, then render again
7. **Deliver the 3 directions together.** Each direction has a PNG · a comparison image · the cited reference · the reviewer's score · the points where it still loses to the reference · let the user pick 1 direction, then make the other sizes

## Rules

- **Sizes come from official sources.** The sizes in the reference file are from the source as of the copy date. Before real delivery, compare with `social-formats` and the platform's official page. If they conflict, use the official page.
- The reference file says Meta reduces delivery of ads with more than 20 % text. Check this `(รอยืนยัน)` against Meta's official page before using it as a reason with a client. Less text is still easier to read anyway.
- Do not use logos or images of other brands without permission. A partner logo must be a real file from its owner.
- Print work: 300 dpi · 3–5 mm bleed · CMYK → hand over to `print-ready-files`

## Check before sending

- [ ] Each of the 3 directions has a real reference from this round (with a link)
- [ ] `render_banner.py` on every direction: size matches · Thai font really loaded
- [ ] Open every PNG by eye · key items are in the safe area · shrunk to half, the headline is still readable
- [ ] `slop_scan.py` P0 0 · P1 0 · remaining P2 have a `slop-ok` reason
- [ ] The fresh reviewer has scored it, and you told the user plainly where it still loses to the reference
- [ ] Unknown data is marked `(รอยืนยัน)` and not invented

## Sources

- The idea of the steps (brief → reference → 3 directions → HTML → export → compare) and the file [`references/uipro-banner-sizes-and-styles.md`](references/uipro-banner-sizes-and-styles.md) (copied, unedited) come from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) commit `28b3b8d` · MIT · Copyright (c) 2024 Next Level Builder · the full licence text is in [`references/LICENSE-uipro`](references/LICENSE-uipro) · viewed 2026-10-29
- Added by us: references from theme shops and Pinterest on the owner's order of 2026-10-29 · Thai language and Thai fonts · the script `render_banner.py` · the `no-ai-look` check and the fresh reviewer (from the trial banner of 2026-10-28, where the reviewer gave ours 6/10 and the reference 8.5/10)
