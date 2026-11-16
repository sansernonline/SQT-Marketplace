---
name: html-slide-deck
description: Use when the deck must be HTML or animated, or pptx as HTML
---

# HTML Slide Deck — one .html file that opens in a browser and presents at once

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live references → 3 genuinely different directions → run `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-references` (plugin `superuser`) even when a brand exists (the brand fixes colors and fonts; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **One rule:** the deck is **one** .html file. Images embedded in the file · slide titles are conclusions · every page passes `check_deck.py` before sending. Story structure and slide titles come from `presentation-design`; this skill covers how it is built and looks.

## Use when
- Presenting a project · system demo · executive summary from the presenter's own machine.
- Viewers should click and see details themselves (files, code, test results), which PowerPoint cannot do.
- The deck is sent by email or chat and must open anywhere with nothing installed.
- A .pptx already exists, or .pptx and .html with the same look must come from one source (click-by-click animation · notes · table of contents) → read [`references/from-pptx.md`](references/from-pptx.md) instead of step 2; fix the .pptx and convert again, never edit the converted .html.

Not for: "make a slide deck" with no mention of html, or the customer needs a .pptx to edit → `branded-document-design` · `StageDeck` (file-type rules in `presentation-design`) · no story structure yet → `presentation-design` steps 1–3 first · companion .docx report → `markdown-report-docx`.

## Steps
1. Write the story structure per `presentation-design`: every slide title is a conclusion · sections · time per page.
2. If the project already has `docs/deck/` or an .html deck, add `<section>` to the existing `slides.html` and use the same shell · css · `--brand`; do not start a new file (same principle as `ui-craft` step 0). Otherwise copy `assets/slides-example.html` to the project's `docs/deck/slides.html`, keep only the `<section>` of the layouts you use and fill in the content. Layout classes: [`references/layouts-and-shell.md`](references/layouts-and-shell.md).
3. Choose the direction before building. It comes from `presentation-design` step 1, stage 0 (order: source work → project's own design → attached reference → live search per `design-references` type `slide` → house defaults, only when there is no information at all). Extract colors from the source with `presentation-design/scripts/source_palette.py <source file>`; if the source has none, use the order in `diagram-figures` step 5; if live search is not possible, use `--theme bright` without `--brand` (gives `2A78D6,1F5FAF`), write `(รอยืนยัน)` in the report and carry on. Never copy colors from the example table in the theme reference. Use `--theme bright` for every new deck unless the source work has a dark background (then `dark`, the default when omitted). Use one main color plus at most 2 secondary colors from the source; green `ok`, blue `blue`, orange `warn` only for pass · info · warning. Theme, tokens, fonts and contrast numbers: [`references/theme.md`](references/theme.md).
4. Build the file:
   ```bash
   python scripts/build_deck.py docs/deck/slides.html -o docs/<PRJ>-DECK-v1.0-DRAFT.html \
          --title "<ชื่อเด็ค>" --theme bright --brand <สีหลัก>,<สีสว่าง>,<สีรอง>
   ```
   `--css` / `--js` for things specific to this deck · `--data` passes JSON for extra JS · images referenced by a local path are embedded automatically · give a secondary color only when the source really has one · a page needing a full-bleed secondary color gets `data-tone="2"` on its `<section>`. For data that changes often (test results, numbers), the project's script reads the real result file and writes it into `slides.html` or `--data`; never type numbers by hand.
5. Check: `python scripts/check_deck.py docs/<ไฟล์>.html --out _to_delete/deck-check` → fix until **0 problems**, then open every `sheet-*.png` and look.
6. Rehearse once with the clock (T for the clock · S for the speaker window). A page over 30 seconds turns the clock a different color → cut that page's content.
7. Animation is off by default. Put `data-anim` on a `<section>` only where motion helps the eye follow the story (a system map whose arrows must be drawn in order · section openers); `data-count` · `data-loop` · `.bars` · `data-chat` work only where set; `data-count` on 1 number to remember, not every card. Add no animation that does not help; shell keys and animation table: [`references/layouts-and-shell.md`](references/layouts-and-shell.md).

Look rules:
- Slide margin 128 px left and right · content stays out of the bottom 120 px band (the foot).
- Text no smaller than 16 px on a 1920 stage · body 24–32 px · slide title 56 px, at most 2 lines.
- 1 page, 1 conclusion · long details go in a `<template>` for click-to-view.
- Speaker notes in `<aside>` are spoken language: use ครับ/ค่ะ and ก็, not document language.
- A real screenshot beats a drawing · width ≥ 1600 px before shrinking · no stock images · never link images from the web.
- Every number states its source in the foot (`qa/results/…` · test date) · every page has `<p class="foot">ชื่องาน · หัวข้อ · ที่มาของข้อมูล</p><p class="pg"></p>`.
- Keep a replayed chat (`data-chat`) from real test results as the backup for any live demo.
- A system diagram too complex for `.map` → `diagram-figures`, embedded as an image.

## Check before done
- [ ] `check_deck.py` shows 0 problems (page taller than 1080 · overflow · overlap with the bottom bar · box overflow · small text · broken image), measured in a real browser.
- [ ] Every `sheet-*.png` opened: one brand color · no half-empty page · slide titles read in sequence make a story.
- [ ] File opens with the network off: all images show, fallback fonts readable.
- [ ] Every page has an `<aside>` of speaker notes, and `data-at` times add up to no more than the time given.
- [ ] No personal data or real customer data (use mock data and say so in the foot).
- [ ] Edited `slides.html` and rebuilt, never the built .html · `no-ai-look` item 3 passed (HTML work runs its script and the eye gate 3.2; 0 script findings is not yet a pass).

## References
- [`references/layouts-and-shell.md`](references/layouts-and-shell.md) — open when choosing layouts, or to see shell keys and animation
- [`references/theme.md`](references/theme.md) — open when picking `--theme` / `--brand`, fonts, or checking contrast
- [`references/from-pptx.md`](references/from-pptx.md) — open when a .pptx exists
