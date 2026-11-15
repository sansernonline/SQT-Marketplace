---
name: html-slide-deck
description: Use when the deck must be HTML or animated, or pptx as HTML
---

# HTML Slide Deck

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live references → 3 genuinely different directions → run `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand fixes colors and fonts; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **Language:** write every line of wording per `human-writing`; story structure and slide titles per `presentation-design` — this skill covers how to build it and how it looks

> **The one rule of this skill:** the deck is **one** .html file that opens in a browser and can be presented at once.
> Images embedded in the file · slide titles are conclusions · every page passes `check_deck.py` before sending

The look of the **house defaults** comes from the X Fitness pitch deck (45 slides, 10 minutes). It is an example of the house direction only, not a mold for every deck (a real deck's direction is chosen per step 2): dark background with a single brand color · big-number section openers · number cards · system diagram · click to see the real file · chat in a phone frame · test result chart

## When to use

- Presenting a project · system demo · executive summary, where the presenter opens it from their own machine
- You want viewers to click and see details themselves (files, code, test results), which PowerPoint cannot do
- The deck must be sent by email or chat and open on any machine without installing anything
- **A .pptx already exists**, or both .pptx and .html with the same look must come from one source (click-by-click animation · notes · table of contents · interactive pages) → for the entry from .pptx read [`references/from-pptx.md`](references/from-pptx.md) instead of step 1 · fix the .pptx and convert again; do not edit the converted .html

## When **not** to use

| Task | Use |
|---|---|
| Just told "make a slide deck" without saying html · the customer needs a .pptx to edit further | `branded-document-design` · `StageDeck` (same look, no animation) — the rules for choosing a file type are in `presentation-design` |
| No story structure yet | `presentation-design` steps 1–3 first, then come back |
| A companion report as .docx | `markdown-report-docx` (same colors) |

---

## 1 · Steps

1. Write the story structure per `presentation-design`: every slide title is a conclusion · sections · time per page
2. **The project already has `docs/deck/` or an .html deck → add `<section>` to the existing `slides.html` and use the same shell · css · `--brand`; do not start a new file** (same principle as `ui-craft` (plugin `software-development`) step 0) · none yet → copy `assets/slides-example.html` to the project's `docs/deck/slides.html` · keep only the `<section>` of the layouts you use (step 3) and fill in the content
3. Build the file:
   ```bash
   python scripts/build_deck.py docs/deck/slides.html -o docs/<PRJ>-DECK-v1.0-DRAFT.html \
          --title "<ชื่อเด็ค>" --theme bright --brand <สีหลัก>,<สีสว่าง>,<สีรอง>
   ```
   Pick the `--theme` and `--brand` values from the output of `presentation-design/scripts/source_palette.py <source file>` · `--css` / `--js` for things specific to this deck · `--data` passes JSON for extra JS to read · images referenced by a local path are embedded automatically
4. Check: `python scripts/check_deck.py docs/<ไฟล์>.html --out _to_delete/deck-check` → fix until **0 problems**, then **open every `sheet-*.png` and look**
5. Rehearse once with the clock (press T · press S to open the speaker window) · a page that runs over 30 seconds turns the clock a different color → cut that page's content

The deck must be buildable from script every time: for data that changes often (test results, numbers), the project's script reads it from the real result file and writes it into `slides.html` or `--data`; never type the numbers by hand.

## 2 · Theme — choose the direction before opening any file

**The visual direction of the deck always comes from `presentation-design` step 1, stage 0**, and the rules on color and mood are in [deck-theme](../presentation-design/references/deck-theme.md) · if you jumped to this skill without a direction, go back and do that first · selection order: the source work the deck is made from → the design the project already has → a reference the user attached → a reference searched live per `design-references` (plugin `superuser`) type `slide` → house defaults · **house defaults are a fallback for when there is no information at all, not a rule.** Two decks for different jobs should look different.

`build_deck.py` has 2 themes, chosen with `--theme`

| `--theme` | Look | Use when |
|---|---|---|
| `bright` | White background, cards tinted faintly with the main color · cover, section openers and closing page are full-bleed solid main color · accent colors are adjusted to read at 4.5:1 · text on solid backgrounds is white when white gives ≥ 4.5:1; if not, near-black; if still short, pure black | Every new deck, unless the source work has a dark background |
| `dark` (the default when omitted) | Dark background, dark gradient cover | Source work or app that has a dark background · old decks already built (without `--theme` the look stays the same) |

- `--brand main,accent,secondary` · the accent color is used for big numbers and the kicker (theme `bright` darkens this color automatically until it reads on a card) · give a secondary color only when the source work really has one · a page that needs a full-bleed secondary color gets `data-tone="2"` on its `<section>` (works with theme `bright`)
- Fonts can be changed in the `--css` file by choosing a family that has both Thai and English and has a real bold (rule in `presentation-design` step 8) · then open `sheet-*.png` and check contrast on every sheet

**Deck colors = colors of the source work.** Extract colors from the source file with `presentation-design/scripts/source_palette.py <source file>` · if the source has no colors, use the order in `diagram-figures` step 5 (color system) · if still nothing, use colors extracted from references of type `slide` · if live search is not possible, use `--theme bright` without `--brand` (gives `2A78D6,1F5FAF`, the house default), write `(รอยืนยัน)` (pending confirmation) in the report, and carry on · never copy colors from the example table below.

| token | Example value (the reference deck — not a default) | Used for |
|---|---|---|
| `--accent` | `#e10613` | Bar under the cover title · user chat bubble |
| `--accent2` | `#ff2536` | kicker · big numbers · section-opener page number · the selected item |
| `--accent-deep` · `--accent-tint` | `#2a0a0d` · `#1d0d10` | Gradient background of cover/section opener · background of the selected item |
| `--bg` · `--panel` · `--line` | `#09090a` · `#16161a` · `#2a2a30` | Background · card · line — do not change with `--brand` · a dark background is the shell's default (dark presentation room, screenshots and diagrams stand out), not a requirement (a deck converted from .pptx uses the .pptx background, see `references/from-pptx.md`) |

- The table above holds the values of theme `dark` · `--brand` computes deep/tint for you · in theme `dark` the bright color must read clearly on the dark background by itself (contrast ≥ 4.5:1), while for `bright` the script adjusts it
- **Where the house contrast numbers come from:** the house bright color `5B9BE6` reads on a dark background (6.9:1) but only 2.89:1 on white, so it must change to `--brand 2A78D6,1F5FAF` (the second color on white is 6.34:1 · the main color `2A78D6` gets 4.42:1, so use it for bars, lines or large text, not small text · computed with the WCAG formula 2026-10-26)
- House fonts (use when step 2 gives no other direction): headings **Chakra Petch** · body **IBM Plex Sans Thai** · code **JetBrains Mono** (Google Fonts · offline → Tahoma) · if the deck's direction sets other fonts → use those of that direction (Thai + English in one family, real bold)
- **One main color plus at most 2 secondary colors from the source work** · green `ok`, blue `blue`, orange `warn` are used only for their meaning (pass · info · warning)

## 3 · Layouts (all are in `slides-example.html`)

The look of the first 4 pages built with `build_deck.py` is in `assets/slides-example-preview.webp`

| # | Layout | class / attribute | Use when |
|---|---|---|---|
| 1 | Cover | `.slide.hero` · `h1` · `.rule` · `.lead` | First page: title + the one sentence to remember |
| 2 | Person/option cards | `.row` > `.card.grow` | Team · compare 2–3 things |
| 3 | Clickable table of contents | `.toc` > `a[data-goto]` · `.p` page numbers filled in by hand | Decks over 12 pages |
| 4 | Section opener | `.slide.divider` · `.num` · `data-part` | Start of every section (the menu groups by `data-part`) |
| 5 | Big numbers | `.card` > `.big[data-count]` | 1–4 numbers to remember (count up on entering the page) |
| 6 | Table | `table.tbl` · `td.m` = code font | Technology · comparison ≤ 8 rows |
| 7 | System diagram + step-by-step tour | `.map` > `svg` arrows (`id`) + `.box` · `.layer` (`data-key`) · `ol.tour-steps` > `li[data-on][data-path]` + `div.tourbar` | Who connects to what, then press ▶ to walk the path of 1 request (place positions in px in a 1664-wide frame) |
| 8 | Click for details | `[data-pick="g"]` + `<template>` · panel `#d-g` | Files · rules · cases with long details |
| 9 | Code | `pre.code` · `<em>` key word · `<i>` comment | Core code ≤ 12 lines |
| 10 | Chat demo | `.phone` > `.chatlog[data-chat]` > `p[data-u]` / `p[data-a]` | A replayed chat typed one character at a time on entering the page |
| 11 | Step-by-step looping highlight | `[data-loop]` | 3–6 steps you want the eye to follow |
| 12 | Bar chart | `.bars` > `div[data-v][data-l][data-c]` | Per-item results · response time |
| 13 | Closing | `.slide.close` | 1-sentence summary + thanks · Q&A |

Every page has `<p class="foot">ชื่องาน · หัวข้อ · ที่มาของข้อมูล</p><p class="pg"></p>` · page numbers fill in by themselves

## 4 · What the shell does for you (no need to write it yourself)

| Key | What it does |
|---|---|
| ← → · PageUp PageDown · click left/right edge · swipe | Change page only, never touches the player on the page |
| Space | Play / pause the player on that page (diagram tour) · does nothing on pages with no player |
| ↓ · ↑ | Next step · previous step of the player |
| M | Menu of all pages, grouped by `data-part` |
| N | Speaker notes from the page's `<aside>` |
| T | Clock start/stop · shows "time used / `data-at`" |
| S | Speaker window (open on the laptop screen, the projector opens the same file): this page + next page · speaker notes · time used / `data-at` · clock — press a button in that window and the projector follows (idea from lewislulu/html-ppt-skill (MIT)) |
| F | Full screen |
| Bottom bar | 1 cell per page · hover to see the page name · click to jump |
| `#12` at the end of the URL | Opens at page 12 · `[data-goto="id"]` jumps to the page with that id |
| Click `img.shot` | Enlarge to full screen |

### Animation (switch on per page — the default is still)

Content sliding up piece by piece on every page, numbers counting up, and glow that loops forever are AI signals in `no-ai-look` (fade-up on every piece · glow · giant numbers), so the shell does not add them to every page: put `data-anim` on the `<section>` only for pages where motion helps the eye follow the story (a system map where arrows must be drawn in order · section openers) · `data-count` · `data-loop` · `.bars` · `data-chat` work only on the pieces where they are set

| What happens | Where |
|---|---|
| Content slides up piece by piece, 70 ms per piece (pages with `data-anim`) | Children of the page · `.row` `.list` `.toc` `.pills` · `.tbl` rows |
| Section-opener page number flies in from the left (pages with `data-anim`) | `.divider .num` |
| Boxes pop up · arrows draw line by line (pages with `data-anim`) | `.box` `.layer` · `.map svg>path` |
| Number counts up from 0 — use on only 1 number to remember, not on every card | `[data-count="10"]` or `"9/10"` |
| Chart bars grow | `.bars` |
| Looping step highlight (the glow around blinks once per step, does not loop forever) | `[data-loop]` |
| Diagram tour (player): box lights up, arrow changes color, a dot runs along the line · press Space and it advances by itself every 3.2 seconds | `ol.tour-steps` + `.tourbar` |
| Chat typed one character at a time with a "typing" dot | `[data-chat]` |

Everything replays every time the page is entered · the player returns to the starting step and stops on every page change · turns itself off when the machine is set to reduced motion · add no animation that does not help the eye follow the story

## 5 · Look rules

- Slide margin 128 px left and right · content does not go into the bottom 120 px band (where the foot lives)
- Text on a slide is no smaller than 16 px on a 1920 stage · main body 24–32 px · slide title 56 px, at most 2 lines
- 1 page, 1 conclusion · long details go in a `<template>` for click-to-view, not crammed onto the page
- Speaker notes in `<aside>` are written the way people actually speak: use ครับ/ค่ะ and ก็, not document language
- A real screenshot beats a drawing · width ≥ 1600 px before shrinking · no stock images
- Every number in the content states its source in the foot (`qa/results/…` · test date)

## 6 · Check before sending

- [ ] `check_deck.py` shows 0 problems (page taller than 1080 · overflow past the edge · overlap with the bottom bar · box overflow · small text · broken image) — measured in a real browser, not by counting lines
- [ ] Open every `sheet-*.png` and look: one brand color · no page half empty · the slide titles read in sequence make a story
- [ ] Open the file with the network off: all images show, fallback fonts are readable
- [ ] Every page has an `<aside>` of speaker notes, and `data-at` times add up to no more than the time given
- [ ] No personal data or real customer data in the file (use mock data and say so in the foot)

## 7 · Anti-patterns

- **Editing the built .html file** — lost on the next build · edit `slides.html` and build again
- **Inventing a secondary color that is not in the source work** — looks like it does not belong · secondary colors must come from `source_palette.py`
- **A new deck without `--theme bright` when the source work has a light background** — gets a dark background that does not fit the work
- **A slide title that is a topic name** ("สถาปัตยกรรม", meaning "architecture") — it must be a conclusion ("แอปเดียวรับทั้งเว็บและ LINE", meaning "One app serves both the web and LINE")
- **Linking images from the web** — they disappear in a room with no network · use local files and let the build embed them
- **Live demo only** — always keep a replayed chat (`data-chat`) from real test results as the backup plan

## 8 · Connecting to other skills

| Need | Use |
|---|---|
| Story structure, slide titles, text budget | `presentation-design` |
| A .docx report in the same set | `markdown-report-docx` |
| A system diagram too complex for `.map` | `diagram-figures`, then embed as an image |
| File names and versions | `document-naming` |

## Not looking AI-made (`ไม่ให้ดูเหมือน AI ทำ`)

Before sending, go through item 3 of `no-ai-look` — HTML work runs its script · every job must also pass the eye gate 3.2 (web pages also answer items 10–14), because a script result of 0 items is not yet a pass · the prohibitions in this file are specific to this job; the full list for every medium is there
