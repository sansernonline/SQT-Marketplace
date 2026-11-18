# Cover design for a software document set: cover pages that are memorable and unlike other projects

- [When to use (software document sets: logo shape or real mockup cover)](#when-to-use-software-document-sets-logo-shape-or-real-mockup-cover)
- [Default path](#default-path)
- [1 · Find the idea from real things: write it in `docs/design/cover-direction.md` before drawing anything](#1--find-the-idea-from-real-things-write-it-in-docsdesigncover-directionmd-before-drawing-anything)
- [2 · Stop 2 projects from looking alike](#2--stop-2-projects-from-looking-alike)
- [3 · Page system: the same for every project, so there is only one method](#3--page-system-the-same-for-every-project-so-there-is-only-one-method)
- [4 · Document type in the set = a frame of the same motion](#4--document-type-in-the-set--a-frame-of-the-same-motion)
- [5 · Background image vs Word text](#5--background-image-vs-word-text)
- [6 · Covers for print](#6--covers-for-print)
- [7 · Make 3 styles, then vote 2 of 3 (only when steps 1–6 did not pass step 8, or the user asks for several styles · 3–5 times the work)](#7--make-3-styles-then-vote-2-of-3-only-when-steps-16-did-not-pass-step-8-or-the-user-asks-for-several-styles--35-times-the-work)
- [8 · Check before sending: the render script must print `checks.json`, and you must open every image yourself](#8--check-before-sending-the-render-script-must-print-checksjson-and-you-must-open-every-image-yourself)
- [9 · Do not want (from research and the bake-off)](#9--do-not-want-from-research-and-the-bake-off)
- [Do not look AI-made](#do-not-look-ai-made)


> **Gate before starting (every time):** read the owner's theme → search live for references → 3 truly different styles → check `no-ai-look` before sending. Follow the "ด่านก่อนลงมือ" (gate before starting) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls color and fonts; the search is for the structure of this piece). Close the work with a `ด่านก่อนลงมือ:` line.

> **The one rule:** the cover must say which project it belongs to at a glance, without reading the name. Do it with the logo's shapes or the app's real screen, not with color alone.

This file covers the **cover page** only. The whole document body (color set, Thai fonts, tables, headers and footers) lives in [`../SKILL.md`](../SKILL.md). The cover uses the same `anchor_picture()` from `brandkit.py`.

## When to use (software document sets: logo shape or real mockup cover)

- A project's document set (BRD, the business requirements document · SRS, the software requirements specification · FSD, the functional specification · ARCH, architecture · PLAN, the project plan · TESTPLAN, the test plan) will go to a client or executives, and the current cover looks like another project's.
- The user says "ปกไม่ว้าว" · "อยากได้ปกที่ไม่ซ้ำ" · "ปกทุกโปรเจกต์หน้าตาเหมือนกัน" (the cover is not wow · I want a cover that is not repeated · every project's cover looks the same).
- Do not use when: the project has no logo or mockup yet → make the logo first (`graphic-design`), then come back. A single report from markdown that needs no identity → `markdown-report-docx`.

## Default path

The default path is logo shapes. The fallbacks are the real screen, or a pictogram of what the app really does. Every style uses the same page system (step 3). **Always look at other people's real covers first (step 1.0).** The bake-off history is at the end of [`cover-bakeoff.md`](cover-bakeoff.md).

---

## 1 · Find the idea from real things: write it in `docs/design/cover-direction.md` before drawing anything

0. **Look at other people's real covers first.** **Search for references first:** take the project's keywords and search live following `design-references` (plugin `superuser`), type `document`, then pull the colors from the chosen work. The stored color library is for when live search is not possible. Collect at least 6 real document or book covers close to this work (same field as the app · tech publishers · Thai examples), then choose which series system to borrow, following [`cover-real-examples.md`](cover-real-examples.md). For every idea on the cover, you must be able to say which cover it came from.

1. **Open the logo's SVG file (vector image) as text** and note the basic shapes with unit coordinates (e.g. 2 L shapes on a 64 grid · T bar + cursor · 2 dots + arrow). Do not count the glow and gradient background of the icon file.
2. **Find the app's main verb** from the first paragraph of the README (if none → the introduction of the BRD or SRS): connect · type · swipe.
3. **Ask what the shapes do when that verb happens**: L shapes join · cursor moves · dots run into an arrow. Write it as 1 sentence. This is the "motion" of the whole set.
4. **Pick 1 structure style** that shows that motion best, from [`cover-structural-ideas.md`](cover-structural-ideas.md) (tiling · giant crop · sequence · real screen · etc.).
5. **Truth test:** every line and every shape on the cover must point back to a shape in the logo file or to real app data. Anything that cannot is decoration → cut it.
6. **The logo alone does not say what the app does** (e.g. just an initial) → use the real-screen style: take a screenshot of a clickable mockup, choose the screen that says the most about the app's work, not the index page. Never draw a fake UI.

## 2 · Stop 2 projects from looking alike

Keep a registry of 1 row per project in each project's `cover-direction.md` and in the central registry `<parent folder of the projects>/cover-registry.md`. This file lives **outside the project**, so ask the user before creating or editing it every time. (No answer yet → write only `cover-direction.md` and put the open question in the report. Do not know where the other projects are → put the open question in the report.)

| Structure style | Background brightness (dark · mid · light) | Accent color | Font pair |
|---|---|---|---|

- A new project must **differ in structure style, and in at least 1 more column.** Two projects with a dark background + green accent collide → move one to the app's own light theme.
- **Thumbnail test:** put every project's cover side by side at 150 px wide. With the logo hidden, you can still tell which cover belongs to whom. If you cannot → redo.

## 3 · Page system: the same for every project, so there is only one method

- A4 at 150 dots per inch (dpi) = 1240 × 1754 pixels (px) (the sample image). The background image for Word is made at 300 dpi = 2480 × 3508 px. Margin 96 px (16 mm).
- **The image zone is on top, with a hard floor line** and nothing spills below it. **The text zone is at the bottom on a flat color**, so every text box has a known contrast.
- The shapes' unit grid must land on the 96 px margin. For giant type, make the **"ink" of the first letter** touch the margin. Measure it with canvas `actualBoundingBoxLeft`, not SVG `getBBox`, which measures the letter-spacing box and will be off by about 14 px.
- 2 type families + 1 monospace (mono) font. **Thai never goes in mono.** Thai line spacing 1.4 · no letter-spacing on Thai · smallest text 18 px at 150 dpi (≈ 8.6pt · pt = px × 0.48).
- **There is only one accent color, and it sits on a shape** (a joined L · the cursor · the active frame), not on a block of text.
- Text on the cover: logo · **series-name line** ("LiteNet Document Series · LITENET-SRS", NIST style) · Thai title (**the largest text on the cover**, larger than the document code) · English title, smaller and lighter · **one sentence saying what the app does**, in the document's language · data row (document code · date), with one date format across the whole set.
- **Version and status are one separate badge, in 1 place** (corner ribbon · round badge · rounded pill like "ฉบับร่าง 0.3"). The badge shape is in the background image, but **the badge's text is Word text**, so the version can change without rebuilding the image. Never show the version in a 2nd place.

## 4 · Document type in the set = a frame of the same motion

Each document type is 1 frame of the motion in step 1.3, not just a changed label. The text zone does not move between documents.

| | Tiling (LiteNet) | Giant crop / real screen (Telex) | Sequence (SwipeOS) |
|---|---|---|---|
| BRD | 2 cells joined | Welcome screen · close-up | Frames 1–2 solid |
| SRS | 5 cells | Main screen · logo must be readable | Frames 1–4 |
| ARCH | 11 cells | Screen split into many areas · pulled back to show everything | Frame 6 shoots off the page |

- **The SRS (the main document) must show the logo clearly.** Secondary documents may crop to abstraction, but must still read when placed beside the others.
- All randomness uses a random seed computed from the project code → a rerun gives the same page, and a later document contains the state of the earlier one.
- Document type must read at thumbnail size: clearly different frames + the document code (top right, or in a round badge). A color per document type may use only shades within the brand color family (off-brand colors such as pink or teal on a purple brand get rejected by reviewers). Do not rely on color alone, because colors run out before the 6th document.
- **Large set of 6–15 documents:** order the documents in the sequence they are really made (PLAN → BRD → SRS → FSD → ARCH → TESTPLAN …), then divide the motion into equal stages. A sequence of 6 frames stretches to the number of documents; do not fix it at 6.

## 5 · Background image vs Word text

| Drawn into the background image (`layer=bg`) | Editable Word text |
|---|---|
| Logo shapes · logo · thin lines · giant document code · screenshots · version badge shape (no lettering) | Thai title · English title · series-name line · sentence saying what the app does · data row · **lettering inside the version and status badge** |

- Anchor the background image to the cover's first paragraph with `anchor_picture()`. **Never put it in the header** (Word shows it faded). Compute text positions from px: `px ÷ 1240 × 21.0 = cm`.
- **The sample cover engine** `scripts/cover-engine/` (in `branded-document-design`) builds the covers of all 3 prototype projects in one command (sample image · 300 dpi background image · `checks.json` · SRS cover .docx · check image from Word). **Using it for a new project needs more edits than `projects.js`:** the logo lines and drawing functions in `cover.js` · the project list in `render.py`, `calibrate.py`, `docx_build.py` · the fonts in `fonts.py`. The full list is in cover-word-build.md.
- The Word build recipe (spacing · z-order · fonts · image compression), how to use the cover engine, and the traps → [`cover-word-build.md`](cover-word-build.md). Install fonts on the user's machine only when `COVER_INSTALL_FONTS=1` is set, and ask the user first every time.

## 6 · Covers for print

Same shapes and positions; only the theme swaps: light paper (about `#F7F7F5`) · white shapes become ink color · the accent uses the light-theme color the app already has · thin lines get darker so they survive the printer · **never invert the whole page with a filter** · the real-screen style uses the image from the mockup's light theme.

## 7 · Make 3 styles, then vote 2 of 3 (only when steps 1–6 did not pass step 8, or the user asks for several styles · 3–5 times the work)

The procedure (3 designers · 3 reviewers · 2 of 3 votes · at most 2 pieces borrowed · Bash for designers · the lead launches reviewers) is in [`cover-vote.md`](cover-vote.md); the full bake-off steps are in [`cover-bakeoff.md`](cover-bakeoff.md).

## 8 · Check before sending: the render script must print `checks.json`, and you must open every image yourself

1. Text contrast of every box against the flat background ≥ 4.5:1 (round down) · smallest text ≥ 18 px · text sits below the image's floor line · nothing crosses the 96 px margin.
2. All 3 Thai tone-mark levels (ที่ ปั๊ม ปุ่ม สื่อ) are complete · line breaks follow meaning · no half-cut words at the edge of a screenshot.
3. Squint test: you see the shape first and the document title second · print in black and white and the accent colors can still be told apart.
4. The set of images (BRD · SRS · ARCH side by side) reads as one motion · each project's set reads as a different idea (step 2).
5. Render in real Word → PDF → PNG: the background image is not faded · page 2 is not empty · text matches the position in the sample image.
6. The "do not want" list in step 9: if you find any, cut it; do not add.

## 9 · Do not want (from research and the bake-off)

- Glow, or a gradient with no light source · gradient type · fuzzy purple blobs · frosted glass: the default look of AI work.
- Everything centered · more than 2 font families + mono · stock icons · stock images · fake device frames · 3D isometric.
- The same cover for every document, differing only in the label · every project's cover on one structure, differing only in color.
- A main image that makes people misunderstand the app (e.g. SwipeOS laid over a sales-chart slide, so viewers think it is a reporting app).
- So much data that it becomes a chart (hex numbers · rotated machine names): a client who reads the BRD is not an engineer.

If the user says the cover is not beautiful → cut things before adding (matches `word-layout.md` item 8).

## Do not look AI-made

Before sending, go through item 3 of `no-ai-look`. For HTML work, run its script. Every job must also pass the eye check 3.2 ("ด่านตา 3.2" in `no-ai-look`; web pages add items 10–14), because 0 hits from the script is not yet a pass.
