# skill: brief-to-image

Use when writing a brief and prompt for AI images

# Brief to Image

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

Write the brief before making the first image.

This skill writes the brief and prompt. Generation happens in whatever image tool or plugin the user has. No generation tool → the fallback order (Scalable Vector Graphics (SVG) set, then Openverse photos) lives in `image-generation`; this skill owns the brief and the prompt.

## Workflow

0. **Find reference work before writing the brief** — every time; when a style lock sheet or brand kit already fixes the look, keep its palette and light and search only for composition and staging: research 3–5 pieces of strong real work in the same category (**ค้นต้นแบบก่อน:** run the project's keywords through a live search per `design-references` (plugin `superuser`), type `illustration` or `social`, then pull the colours from the chosen work · use the stored palette bank only when live search is unavailable · award archives · competitor campaigns) · write 1 line per piece on *why it works* (composition · light · palette · type) · save links beside the brief in `briefs/<asset-name>.md` under "References" · the style, palette and light lines of the brief then cite these benchmarks, and tools that accept reference images get 1–2 of them · **references are a bar to clear, not a piece to copy** — the concept must stand at their level without imitating any one of them
1. **Ask 5 things** if missing: image style (pick from the style list in `image-generation` → `references/styles.md` — one style per set; unattended → pick from the use and log why; references from step 0 outrank the default list) · what must the image show · where it will be used (placement → aspect ratio, from `social-formats`) · what text goes on it (usually none in the image — add text in layout) · brand kit or style lock sheet to follow
2. **Fill the brief** with the anatomy below; save it as `briefs/<asset-name>.md` using [prompt-anatomy.md](references/prompt-anatomy.md)
3. **Assemble the prompt** in anatomy order, most important first
4. **Generate 3–4 variations**, not 1. Pick with the score below, not by gut feeling
5. **Fix misses 1 element at a time** — wrong light? Change only the light line
6. **3 misses on 1 element** → the brief is wrong or the model cannot do it. Rewrite that element or change approach (edit, composite, photograph)
7. **Record the winning prompt, model name and version, seed and settings** next to the brief — that is the reusable asset

## Prompt anatomy (in this order)

| # | Element | Answers | Weak → strong |
|---|---|---|---|
| 1 | Subject | What, exactly, 1 focal point | "coffee" → "a glass of iced matcha latte with visible layers of green and milk" |
| 2 | Action / state | What is happening | → "condensation running down the glass" |
| 3 | Setting | Where | → "on a pale oak café counter, Bangkok shophouse interior blurred behind" |
| 4 | Composition | Framing, angle, negative space | → "eye-level, subject in left third, empty space top-right for headline" |
| 5 | Lens / camera | Focal length, depth of field | → "85mm, shallow depth of field, f/2" |
| 6 | Light | Direction, quality, time | → "soft window light from the right, late morning, gentle shadows" |
| 7 | Style | Medium and reference genre | → "editorial food photography, natural, not glossy" |
| 8 | Palette | 3–5 colours, dominant first | → "muted sage green, warm cream, pale wood, one amber accent" |
| 9 | Negatives | What must not appear | → "no text, no logo, no hands, no straw, no extra glasses" |
| 10 | Format | Aspect ratio, resolution | → "4:5 portrait" (set as a parameter if the tool has one) |

Lens and light vocabulary: see [prompt-anatomy.md](references/prompt-anatomy.md).
One tactile 3D object as the hero (paper cut, clay, felt): use the 8-line template (subject · material · light · shadow · lens · background · one colour · negatives) and its worked example in [prompt-anatomy.md](references/prompt-anatomy.md), section "Tactile 3D hero object".

## Pick the image (ตัดสินด้วยตัวเลข)

Use `decision-scoring` command `score` (`node decide.mjs score <file.json>`) on the 3–4 variations. The score picks among images that are already acceptable; taste is the user's final call.

| Part | Rule |
|---|---|
| Hard rules first (`must`, the variation is dropped) | physical-errors score below 3 (extra fingers, melted faces, floating objects) · garbled text when the brief asked for text · another brand's logo or an identifiable real person |
| Criteria, each scored 1–5 by a reviewer that did not generate the image (`better: high`) | matches the brief · text readable (leave out when the image has no text) · matches the style lock · crop-ready (room for the headline, survives the placements' ratios) · physical errors are **not** scored here: they are the hard rule above, counted once |
| Default weights (starting value, not yet measured · change per job) | brief 0.40 · style lock 0.30 · crop-ready 0.15 · text readable 0.15 |
| Hard to score directly | use `pairwise`: show each pair twice with positions swapped and record the winner; a pair whose winner flips with position counts as a tie |
| Result line | `ยังไม่นิ่ง` or a near tie → show the top 2 to the user and say which criterion splits them; they choose |

The script re-ranks with each weight moved ±20% and says whether rank 1 holds (`นิ่ง`); if it flips, treat the top 2 as a tie. These weights have not been compared with human rankings yet: before trusting them, have a person and the reviewer rank the same 5 real sets and count the matches.

Write the 1–5 scores and who gave them next to the brief (`briefs/<asset-name>.md`) with the winning prompt. A model that reviews its own output leans toward long or flashy images: use a different reviewer (scores with 1 reason each, at most 10 lines), and spot-check one score by eye.

## Model differences (general, check your tool's docs)

Model and tool differences (sentences vs phrases, negative field, aspect ratio, Thai text, version changes): [references/model-differences.md](references/model-differences.md).

## Failure modes — what to change when the image misses

| Miss | Change only this |
|---|---|
| Extra fingers, limbs, melted faces | Fewer people, hands out of frame or holding something; crop tighter |
| Garbled text or signage | Remove every word from the prompt; add copy in layout |
| 2 subjects where 1 was asked, or duplicated objects | "a single …", 1 focal point, remove plural nouns |
| Subject always centred | Composition line with an edge: "placed far left, touching the frame edge, empty wall right" |
| Negative word appears anyway ("no straw" gives a straw) | Describe what is there instead of what is not |
| Colour oversaturated, plastic look | Add "natural, muted, editorial, not advertising" and the hex palette |
| Set does not match across images | Style lock sheet (`style-consistency`) and the same seed or reference image |
| Wrong aspect ratio | Set the parameter, delete the ratio words from the prompt |

Gemini API users: Imagen models are being retired and the Gemini image model names change often, so no model list is stored here. Look up the current image model IDs and any shutdown dates at https://ai.google.dev/gemini-api/docs/image-generation and https://ai.google.dev/gemini-api/docs/deprecations; look it up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Record the exact model ID you used (workflow step 7).

## Worked example — brief to prompt

Request → brief → prompt → review for a matcha drink post: [references/worked-example.md](references/worked-example.md).

## Rules

- 1 brief per asset. A series shares a style lock sheet (`style-consistency`), not a copy-pasted prompt
- Never put the headline, price or Thai copy into the image prompt
- Generated people: no real, identifiable person without consent. No trademarked characters or logos of other brands
- Check the tool's terms for commercial use before using an output in an ad

## Not an AI look

Every prompt carries the items in `no-ai-look` section 4 (named style, hex, light, what to avoid); the eye check (3.2) covers images.

## Related

- `style-consistency` — locking a look across many images
- `image-editing-brief` — fixing an image instead of regenerating
- `design-review` — the check before it ships

## เรียกเป็นคำสั่ง

`/graphic-design:brief-to-image <what the image must show> [where it will be used]`

Run `brief-to-image` with the `art-director` agent for: **$ARGUMENTS**

Saves the brief to the project briefs folder. Generation and the consistency check both use this same brief.


## reference: model-differences.md

# Model differences (general, check your tool's docs) · brief-to-image

Open from SKILL.md when the tool or model behaves unlike the brief expects.

| Behaviour | What to do |
|---|---|
| Some models read full sentences best; others prefer comma-separated phrases | Write the brief as sentences; keep a phrase version if the tool responds better |
| Some tools have a separate negative-prompt field; others ignore "no X" or even add X | If no negative field, describe what *is* there instead ("plain cream wall" rather than "no clutter") |
| Aspect ratio is a parameter in most tools; typed ratios in the prompt are often ignored | Set the parameter; do not rely on the words |
| Text inside images is unreliable, worst for Thai script | Generate without text; add Thai copy in a layout tool with the brand font |
| Reference image, style reference or seed features exist in many tools | Use them for series work (`style-consistency`) |
| Models change between versions | Record the version; re-test a saved prompt after an update |


## reference: prompt-anatomy.md

# Image brief template and vocabulary

## Contents

1. [Brief file](#brief-file--briefsasset-namemd)
2. [Composition words](#composition-words)
3. [Lens and camera](#lens-and-camera)
4. [Light](#light)
5. [Style words that carry meaning](#style-words-that-carry-meaning)
6. [Negatives that save rounds](#negatives-that-save-rounds)
7. [Tactile 3D hero object](#tactile-3d-hero-object)

## Brief file — `briefs/<asset-name>.md`

```markdown
# Brief — <asset-name>

Used for: <platform + placement> · Aspect ratio: <4:5> · Due: <date>
Style source: <brand-kit v1 / style lock sheet name + version>
Text added later in layout: <headline / none>

| Element | Brief |
|---|---|
| Subject | |
| Action / state | |
| Setting | |
| Composition | (angle, framing, where the empty space for text is) |
| Lens / camera | |
| Light | |
| Style | |
| Palette | (hex from kit, dominant first) |
| Negatives | |
| Format | |

## Prompt (assembled)
<paste>

## Log
| Round | Tool + version | Seed / settings | What missed | What changed |
|---|---|---|---|---|
| 1 | | | | |

## Winner
File: <name> · Prompt: <final> · Seed: <n>
```

## Composition words

| Want | Say |
|---|---|
| Space for a headline | "empty space in the upper third", "subject in the left third" |
| Product hero | "centred, front three-quarter view, low angle" |
| Flat lay | "top-down overhead view, items arranged on a grid" |
| Story / mood | "wide shot, small figure in a large space" |
| Detail | "extreme close-up, macro" |

## Lens and camera

| Term | Effect |
|---|---|
| 24mm / wide angle | More background, some distortion, environment |
| 35mm | Natural documentary, street, lifestyle |
| 50mm | Close to human eye, neutral |
| 85mm | Portrait and product, flattering, background compressed |
| 100mm macro | Texture, food and jewellery detail |
| Shallow depth of field, f/1.8–f/2.8 | Blurred background, subject isolated |
| Deep focus, f/8–f/11 | Everything sharp, interiors and flat lays |
| Eye-level / low angle / high angle / top-down | Viewer's relation to the subject |

## Light

| Term | Look |
|---|---|
| Soft window light | Gentle, natural, lifestyle and food |
| Golden hour | Warm, low, long shadows |
| Overcast daylight | Even, no harsh shadows, true colour |
| Hard noon sun | Strong shadows, summer energy |
| Studio softbox, white seamless | Clean product, e-commerce |
| Rim / back light | Outline glow, separation from background |
| Neon night, practical lights | Urban, nightlife, street food |
| Low-key | Dark, dramatic, premium |
| High-key | Bright, airy, minimal shadow |

## Style words that carry meaning

editorial · documentary · product catalogue · flat vector illustration · isometric 3D · claymation-style 3D · risograph print · watercolour · line art · Thai traditional pattern (ลายไทย) as a border motif — name the medium, not "beautiful" or "high quality".

## Negatives that save rounds

text, watermark, logo, signature · extra fingers, distorted hands · duplicate objects · cluttered background · oversaturated · plastic skin · off-palette colours (name them)

## Tactile 3D hero object

One physical-looking object as the hero of a post or page (paper cut, clay, felt, wood). Generic "soft 3D render, clay, studio lighting" prompts give the glossy CGI look that `no-ai-look` flags; these 8 lines name what a real object has. One line each, in this order, then set the aspect ratio as a parameter.

| # | Line | Fill with | Weak → strong |
|---|---|---|---|
| 1 | Subject | 1 object, its exact form and how it is built | "3D question mark" → "a question mark built from 4 stacked layers of cut card stock" |
| 2 | Material | A surface you could touch, and how it was made | → "matte card with visible paper fibres, hand-cut edges slightly uneven, no gloss" |
| 3 | Light | 1 source, its direction and size | → "one large softbox from the upper left at 45 degrees, shadow edges soft over 2–3 cm" |
| 4 | Shadow | Contact shadow plus cast shadow, same direction as the light | → "dark contact shadow tight under the base, faint wide cast shadow to the lower right" |
| 5 | Lens | Focal length, aperture, camera height, framing | → "100mm macro, f/8, eye level, object fills 60% of the frame, empty space top right" |
| 6 | Background | Same material family, flat | → "seamless cream paper backdrop #F3EDE2, same paper as the object, no gradient, no vignette" |
| 7 | One colour | 1 hex; other tones come only from shadow and layers | → "single colour #E8742A, darker tones only from the shadows between layers" |
| 8 | Negatives | What models add by default | → "glossy plastic, smooth CGI surface, glow, text, teal-orange grade, floating particles" |

Other materials: swap line 2 for "polymer clay with faint fingerprints, soft matte sheen" or "wool felt with visible fibres and stitched seams". A harder look: swap line 3 for "one desk lamp, crisp shadow edge". Tool without a negative field: describe what is there instead (line 6 already does most of this work).

**Worked example (paper-cut question mark):**

> A question mark built from 4 stacked layers of cut card stock, standing upright. Matte card with visible paper fibres and slightly uneven hand-cut edges, no gloss. One large softbox from the upper left at 45 degrees, shadow edges soft over 2–3 cm. A dark contact shadow tight under the base and a faint wide cast shadow falling to the lower right. 100mm macro lens, f/8, eye level, the question mark fills 60% of the frame with empty space in the top right. Seamless cream paper backdrop #F3EDE2 in the same paper as the object, flat, no gradient, no vignette. Single colour #E8742A; darker tones come only from the shadows between the layers.

**Negative / settings:** glossy plastic, smooth CGI surface, glow, text, letters, teal-orange colour grade, floating particles, extra objects · aspect ratio 4:5.

The cream backdrop and orange come from this brief. Cream with a warm orange accent is also a palette models reach for when nobody chose one (`no-ai-look` catalog section 1), so use it only when the brand or the brief asks for it.


## reference: worked-example.md

# Worked example — brief to prompt · brief-to-image

**Request:** "Need a picture for our new matcha drink post, make it nice."

**Brief (after asking):** Instagram (IG) feed 4:5 · headline will be added in layout top-right · brand kit: sage, cream, amber accent, natural editorial style.

**Prompt:**

> Editorial food photograph of a tall glass of iced matcha latte with distinct green and milk layers, condensation on the glass, standing on a pale oak café counter. Eye-level view, glass in the left third of the frame, clean cream wall with empty space in the upper right. 85mm lens, shallow depth of field, soft window light from the right in late morning, gentle shadows. Muted sage green, warm cream and pale wood palette with one small amber accent from a ceramic coaster. Natural and calm, not glossy advertising.

**Negative / settings:** text, logo, watermark, hands, straw, extra glasses, oversaturated colour · aspect ratio 4:5.

**Review:** variation 2 had the best layers but the glass was centred → only the composition line changed ("glass placed far left, edge of frame") → round 2 accepted.


---

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
