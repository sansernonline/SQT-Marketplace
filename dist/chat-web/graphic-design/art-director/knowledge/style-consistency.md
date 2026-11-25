# skill: style-consistency

Use when a series of images must look like one set

# Style Consistency

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

Goal: 10 assets that look like one person made them.

## Workflow

1. **Pick 1–3 anchor images** — the approved hero, or reference photos that show the look · no anchor yet → **ค้นต้นแบบก่อน:** run the project's keywords through a live search per `design-references` (plugin `superuser`), type `illustration`, then pull the colours from the chosen work · use the stored palette bank only when live search is unavailable
2. **Write the style lock sheet** with [style-lock-sheet.md](references/style-lock-sheet.md) before generating anything else
3. **Build the style block** — the fixed part of every prompt (light, lens, palette, style, negatives); only the subject line changes per image
4. **Lock the tool settings** — same model and version, same aspect-ratio family, same style/reference image, seed where it helps
5. **Generate in batches** of 4–8 and lay them out side by side, never judge one alone
6. **Run the checklist** below on each; reject early
7. **Log** the accepted prompt, seed and settings in the sheet; a change to the look is a new sheet version

## Ways to hold a style (general tool features)

| Technique | Holds | Limits |
|---|---|---|
| Fixed style block in every prompt | Light, lens, palette, mood | Wording alone drifts across subjects |
| Style or reference image | Colour, texture, rendering style | Can copy the reference's content too — use a neutral one |
| Character or subject reference | A recurring person, mascot or product | Needs clear front and side references; check identity every image |
| Same seed | Composition family for similar prompts | Breaks when the subject changes a lot |
| Same model version | Everything | A model update changes the look — re-test the sheet |
| Post-processing preset (Look-up table (LUT), Lightroom preset, same grain) | Colour and finish across all images | Cannot fix wrong light direction |
| Shared layout template | Text position, logo, margins | — · a full page system for decks: [corporate-profile-deck.md](references/corporate-profile-deck.md) |

## Consistency checklist (per image)

| # | Check | Pass when |
|---|---|---|
| 1 | Palette | Dominant colour and accents from the sheet; no off-sheet colour larger than a small detail |
| 2 | Light | Same direction, quality and colour temperature as the sheet |
| 3 | Lens and angle | Same focal family and camera height |
| 4 | Composition | Subject and text area in the sheet's grid positions |
| 5 | Texture and finish | Same grain, sharpness, depth of field |
| 6 | Motif | The recurring element is present |
| 7 | Character / product identity | Same face, proportions, label, colours |
| 8 | Stranger test | Placed in a grid with the others, a stranger would not pick it as the odd one out |

Fail on any → reject or send to `image-editing-brief`; do not keep "because it is done".

## Rules

- Write the sheet before the first generation, not reverse-engineered after
- One sheet per campaign; a "slightly different" style is a new sheet
- Mid-campaign changes need a version bump and a reason in the log
- Keep the sheet in the campaign folder next to the asset matrix

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files. Lock the style against its section 4 so the whole series avoids the same AI defaults.

## References

- [`references/style-lock-sheet.md`](references/style-lock-sheet.md) — the sheet to fill in (step 2)
- [`references/worked-example.md`](references/worked-example.md) — open for a model style block with negatives and a grid check
- [`references/corporate-profile-deck.md`](references/corporate-profile-deck.md) — open for a company profile or capability deck: the owner's picked page system (red · white · charcoal, header + body pattern + bottom strip), measured colours and fonts


## reference: corporate-profile-deck.md

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

## Clash with `no-ai-look`

This look uses several signals that `no-ai-look` section 2 says are never the default: grids of identical cards, icon tiles above headings, every page title + bullets, swoosh ribbons, and words like "ยกระดับ" and "ในยุคดิจิทัล". The owner chose the look, so the layout signals may stay: note the owner's pick under **ตัดสินใจเอง** and add a `slop-ok` comment in HTML/CSS output. The words do not get a pass: still run the copy through `human-writing`.


## reference: style-lock-sheet.md

# Style lock sheet template

Save as `02-exports/<campaign>/style-lock-v<N>.md`. Fill every line; "TBD" means the look is not locked yet.

```markdown
# Style lock — <campaign> v<N>

Brand kit: <version> · Owner: <name> · Locked on: <yyyy-mm-dd>
Anchor images: <file names, 1–3>

## Look
| Element | Locked value |
|---|---|
| Medium / style | (e.g. editorial food photography / flat vector / 3D clay) |
| Light | (direction, quality, time, colour temperature) |
| Lens and angle | (focal length family, camera height) |
| Depth of field | |
| Palette | (hex, dominant first, share %) |
| Texture / finish | (grain, matte or gloss, sharpness) |
| Background | |
| Motif | (the recurring element) |
| Composition grid | (subject position, text area, logo position) |
| Characters / products | (reference image names, must-match details) |

## Style block (paste into every prompt)
<constant text>

## Constant negatives
<list>

## Tool lock
Tool: <name> · Model version: <...> · Aspect ratios used: <...>
Style / reference image: <file> · Strength: <value> · Seed policy: <fixed n / free>
Post-processing: <preset / Look-up table (LUT) name>

## Off-style examples (do not)
- <file> — why
- <file> — why

## Accepted log
| File | Subject line | Seed | Date | Checked by |
|---|---|---|---|---|

## Version history
| Version | Date | Change | Reason |
|---|---|---|---|
| v1 | | Initial | |
```

## Recurring character sheet (add when a mascot or model repeats)

| Item | Value |
|---|---|
| Name / code | |
| Reference images | front · side · three-quarter · full body |
| Fixed features | face shape, hair, eye colour, outfit colours (hex), accessories |
| Age range, build | |
| Expressions allowed | |
| Never | (e.g. no change of outfit colour, no glasses) |

For real people: written consent covering AI-generated variations and where they will be used.


## reference: worked-example.md

# Worked example · style-consistency

Sheet: "Matcha26 v1". Anchor: approved hero.

**Style block (constant):**
> Editorial food photography, soft window light from the right in late morning, 85mm lens, shallow depth of field, eye-level. Muted sage green, warm cream and pale oak palette with one small amber accent. Calm, natural, matte finish, fine film grain. Clean cream wall background with empty space in the upper right.

**Negatives (constant):** text, logo, hands, straws, oversaturated colour, busy background.

**Subject lines (variable):**
- "A ceramic cup of hot matcha with a leaf of foam art."
- "A matcha cheesecake slice on a small cream plate."
- "A paper takeaway cup with a plain cream sleeve."

Grid check of 6 images: #4 came out with blue-hour light → fails check 2 → regenerated with the same seed and "late morning" moved to the front of the block → accepted.
