---
name: design-by-type
description: Use when a logo, poster, banner, cover or deck must blend popular refs
---

# design-by-type — sort the job by type, read the project, blend 2–3 popular references, let the owner pick

> **Pre-work gate (every time):** read the owner's theme → search live references → 3 genuinely different directions → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) · close the work with a `ด่านก่อนลงมือ:` line

> **One rule:** every direction is a blend of 2–3 real, popular works that fit this project, with a written recipe of what came from each. The owner asked for this flow on 2026-11-19: "แยกก่อนว่าเป็นงานประเภทไหน … หาตัวอย่างที่ดูสวยงาม เช็คดูว่ามียอด view เยอะ มา 2-3 งาน แล้ว รวมให้เป็นงานใหม่ให้กลมกลืนกัน".

This skill adds 3 things on top of `design-references`: the type's own rules, a popularity check on references, and the blend recipe. The search, board and owner pick stay in `design-references`; do not repeat them here.

## Use when
- A logo · poster · banner or social ad · Word/PDF cover · slide deck is about to be designed, from scratch or as a redesign.
- The owner says the work looks stiff, generic or AI-made, and the job is one of those types.

Not for: screens and web pages → `software-development:ui-craft` · icons → `icon-design` · a whole brand kit → `brand-kit` (it calls this skill for the logo) · YouTube thumbnails → `youtube-thumbnail` · a quick one-off logo or poster inside a software project, no reference blend → `software-development:graphic-design`.

## Steps

1. **Name the type**, then open its file. One job with several types (logo + cover) → open each.

   | Type | File | Also open |
   |---|---|---|
   | Logo · wordmark · brand mark | [`references/logo.md`](references/logo.md) | `brand-kit` · `icon-design` (licensed sets) |
   | Poster · flyer · event key visual | [`references/poster.md`](references/poster.md) | `print-ready-files` |
   | Banner · social post · ad | [`references/banner.md`](references/banner.md) | `banner-design` · `social-formats` · `copy-claims-check` |
   | Word/PDF cover and inner pages | [`references/document-cover.md`](references/document-cover.md) | `software-development:branded-document-design` |
   | Slide deck · company profile | [`references/slides.md`](references/slides.md) | `software-development:presentation-design` · `style-consistency` |

2. **Read the project before searching.** Write 2 lines: what the project is (industry · audience · what the piece must make people do) and which 1–2 style families fit. Look the industry up first, it gives looks and cautions:
   ```bash
   python <software-development>/skills/design-direction-lookup/scripts/design_search.py "<คำของโปรเจกต์>" --domain industry -n 1
   ```
   The project beats the owner's general taste: a coffee shop gets a coffee look even though the owner likes tech-modern. Keep the owner's taste in what transfers (depth, light, one strong focal element).

3. **Search references in that style family** per `design-references` steps 1–3, using the type file's site list. Add the type and style words to every query (`logistics company profile deck`, not `deck`).

4. **Check popularity and fit** on each work page you open, and write it down. See [`references/blend.md`](references/blend.md) section 1 for which number each site shows. Keep 5–8 works that are both popular for their site and close to the project; popularity alone does not qualify a work that misfits the project.

5. **Blend 2–3 works per direction** with the recipe sheet in [`references/blend.md`](references/blend.md) section 2: one work gives the structure, one gives the signature device or hero treatment, one gives the colour and light mood. Change what makes it ours (hue shift, our content, our type). 3 directions must differ in structure, not only colour.

6. **Build at real size, polish, and look at it.** Apply the polish pass in [`references/polish.md`](references/polish.md) (depth, overlap, light, shape) before the first critic. Render each direction to PNG, open it, then run the type file's check list and the stiffness check in `no-ai-look` (plugin `superuser`) `references/stiffness.md`. Fix and render again until it passes. Then have a fresh `design-critic` give the wow score in [`references/wow-score.md`](references/wow-score.md); send only at 7/10 or more with no 0, else fix the lowest criterion and score again (at most 2 rounds).

7. **Send the 3 directions for the owner to pick** (board page or artifact with the PNGs, the recipe line under each, and the reference links). The owner adjusts from there; record the pick and their words per `design-references` "Remember the owner's taste".

## Check before done
- The type file was opened and its check list passed on every PNG.
- Every direction lists 2–3 references with link, popularity number and date, and what came from each.
- The 2-line project read exists and the style fits the project, not only the owner's taste.
- Stiffness check passed; the `ด่านก่อนลงมือ:` line is complete.

## References
- [`references/polish.md`](references/polish.md) — open while building: the depth, overlap, light and shape pass that makes round 1 look finished
- [`references/wow-score.md`](references/wow-score.md) — open before sending: the 5-criterion wow score and the send rule
- [`references/blend.md`](references/blend.md) — popularity numbers per site and the blend recipe sheet
- [`references/logo.md`](references/logo.md) · [`references/poster.md`](references/poster.md) · [`references/banner.md`](references/banner.md) · [`references/document-cover.md`](references/document-cover.md) · [`references/slides.md`](references/slides.md) — rules, sites and checks per type
- [`references/sources.md`](references/sources.md) — sources and check dates
