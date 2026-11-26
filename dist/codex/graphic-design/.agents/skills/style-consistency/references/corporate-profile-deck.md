# Page system · Thai corporate profile deck (red · white · charcoal)

Open when a company profile, capability deck, sales deck or one-page set must look like one set, and the owner wants this look (owner said "สวย ชอบๆ" on 2026-11-17, a Thai IT-services company profile made in Canva, 16:9, 13 pages). Borrow the system, never the brand: swap in the client's own colours and logo.

## Why it works

- One fixed page frame repeats on every content page, so 11 dense pages still read as one set.
- Red is spent only on things that point: bars, icon tiles, bullets, one keyword in a title. Body text stays charcoal on near-white, so the page stays calm.
- Every content page has the same 3 bands: header · one body pattern · bottom strip. The eye learns where to look after page 2.
- Thai and English sit together without fighting: English is the small italic kicker, Thai is the big title; English terms go in parentheses after the Thai.

## Measured values

Measured 2026-11-17 with PyMuPDF on pages 1, 2, 4 and 7 (colours binned to steps of 8, so treat them as ± 8) and `pdffonts` on page 1.

| Role | Value |
|---|---|
| Accent red (bright) | about `#e81018` |
| Accent red (shade, for the gradient end) | about `#c00808` |
| Title and body text | charcoal about `#202830` |
| Page background | about `#f8f8f8`, cards pure white |
| Icon tile behind red line icons | pale red tint (not measured) |
| Latin fonts | Gotham Bold · Book · Bold Italic · Book Italic, DM Sans Bold (paid Gotham → free stand-in Montserrat, not side-by-side checked) |
| Thai font | Prompt Regular (free, Google Fonts); titles look like a bold Prompt-style loopless face |
| Canvas | 1440 × 810 pt (16:9) |

## The page frame (every content page)

1. **Header, top left:** a short red slanted bar (parallelogram leaning like `/`) · English kicker in grey italic, medium size · Thai title below it in bold charcoal, the largest text on the page · a short red rule under the title (about 1/20 of the page width).
2. **Header, right of the title:** a thin red slash, then a 2-line Thai subtitle in regular weight.
3. **Logo** small at the top right, the same spot on every page.
4. **Bottom strip:** a full-width white pill with a soft shadow. At its left, a red gradient parallelogram label with a 2-line white bold italic heading; then 4–5 items, each a red line icon over 2 short lines of text, split by thin vertical rules.
5. **Edges:** a red ribbon curve in the bottom-right corner, faint diagonal light streaks in the background, and where there is a photo, it bleeds off the left edge and fades into the white.

## Body patterns (pick one per page)

| Pattern | Used for | How it is built |
|---|---|---|
| Card row | services, products | 4 equal white cards, large radius, soft shadow · photo on top fading into white · red rounded-square icon tile overlapping the photo's lower edge · bold italic English name · 1–2 Thai lines · short red rule · 4 red square bullets |
| Hub | capabilities, product family | logo in a centre circle with a red ring · 4–6 capsule cards around it, each a red icon tile + name + small photo · dotted connectors ending in small red ring nodes |
| Process | how we work | 5 cards with photos · red parallelogram tab "01 Analysis" across each card · red chevrons between cards |
| Two columns of labelled boxes | features and benefits | red parallelogram section labels · 2×2 white feature boxes with red line icons · benefit list with red check boxes |
| Logo wall | clients | 4×2 white rounded tiles, one logo each, nothing else |
| Contact | last page | white card: red icon tiles for phone, mail, web, address · QR code in red corner brackets · red pill button with the LINE ID |

The cover is the only page without the frame: logo top left, the company name very large in 2 lines, a short red rule, the Thai legal name, then a 2-line tagline with one phrase in red bold italic; the right half is a photo cut by a diagonal, with a red ribbon across the bottom.

## When building one

- Write the style lock sheet ([style-lock-sheet.md](style-lock-sheet.md)) from the table above, with the client's colours in place of the red.
- Build pages with **live text layers** (Canva, PowerPoint, HTML, Figma). The source deck's pages 2–12 are each one flat image: no text can be searched, copied, edited or read aloud, and the file is 24 MB. Use images only for photos and icons.
- One icon set, one stroke weight, red only. Photos share light and colour temperature (checklist rows 1–5 in `SKILL.md`).
- Check every AI-made photo for fake text on screens and signs (the source's kiosk screen shows garbled Thai) and fix or replace it.
- A client logo wall needs each client's permission.
- Drop empty trailing pages (the source ends with a blank page 13).

## Clash with `design-gate/no-ai-look`

This look uses several signals that `design-gate/no-ai-look` section 2 says are never the default: grids of identical cards, icon tiles above headings, every page title + bullets, swoosh ribbons, and words like "ยกระดับ" and "ในยุคดิจิทัล". The owner chose the look, so the layout signals may stay: note the owner's pick under **ตัดสินใจเอง** and add a `slop-ok` comment in HTML/CSS output. The words do not get a pass: still run the copy through `human-writing`.
