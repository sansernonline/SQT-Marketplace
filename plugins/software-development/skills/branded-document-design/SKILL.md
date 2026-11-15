---
name: branded-document-design
description: Use when a Word, PowerPoint or PDF must look designed
---

# Branded Document Design

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live for reference designs → 3 genuinely different directions → check `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand controls color and fonts; the search is for finding this piece's structure) · close the job with the line `ด่านก่อนลงมือ:`

> **Language:** write all wording per `human-writing`. This skill gives format and structure; human-writing gives how to write so people can understand.

> **The one rule of this skill:** an exported document must look intentionally designed: one color set, one set of type sizes
> and spacing that is the same on every page. It must not look like someone opened Word and just typed.

## When to use this skill

- The output is a **.docx / .pptx / .pdf** (quotation · business plan · report · contract · software document such as an SRS) that a customer, executive or another team will open
- The document must be **signed off** or attached to a contract/proposal
- Mixed Thai–English documents (they break very easily if fonts are not fully set)
- The same kind of document is issued repeatedly and every copy should look the same

## When **not** to use

- The output is markdown (in the repo or work folder): use `polished-document-style`
- You only need to **read/extract** a received Office file: use `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf`
- Diagrams in a markdown document: use `markdown-visuals`
- A whole-book report from a single Markdown file (shared logo cover · table of contents · tables · figures): use `markdown-report-docx`, which has a ready md → docx script

**The correct order:** write the content as markdown first (polished-document-style)
→ then use this skill to render it into the deliverable file, and always fix content in the markdown (markdown is the source).

---

**Install before use:** `pip install python-docx python-pptx` · LibreOffice (`soffice`) to convert to PDF · `pdftoppm` (poppler) to convert to images

## 0 · Colors come from the project — look in order, do not stop and wait

**If the source markdown already has a `doc-theme`, use that value. Do not ask again, do not set a new one.**
(See `polished-document-style`, section "ธีมของเอกสาร" (document theme).)

If there is none yet, look in the order given in `diagram-figures` item 5, in that one place (`doc-theme` → brand colors in code, logo, brand kit → nothing at all).
Nothing at all → **search for reference designs first:** take the project's keywords to a live search per `design-references` (plugin `superuser`), type `document`, then extract colors from the chosen work. The stored palette library is used when a live search is impossible. Live search impossible → use the house color `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation) in the report, and carry on without stopping to ask. Put a tone suggested by the content of the work (see the next line) in the report for the user to choose later.
Once you have the colors, **write them back into `doc-theme`** in the markdown file so the document, figures and slides use the same colors.

Tones suggested by the content of the work (medical · finance · government etc. · fallback library, used when live search is impossible) → [`references/palette-examples.md`](references/palette-examples.md) · if the customer already has a brand, always use the brand colors.

**There is only one main color.** All light and dark shades are computed from it; do not pick more one by one.
The only colors not tied to the main color are the status colors (success · warning · error), and they must always keep their meaning.


## 0.1 · The document's look continues from the brand's or app's look — do this before the first render

> This skill's defaults (Tahoma · solid color band cover · table with lines in every cell) are the **floor**, not the deliverable look.
> Using the defaults as is = a document that looks printed from Word at every company, even though the brand or app of that job already passed a beauty gate.

1. **Is there an identity already?** Look at the existing brand kit (`graphic-design:brand-kit` if installed; use the colors and fonts from that kit) · `assets/logo/` · `docs/design/` · software work: a mockup that passed the beauty gate (score in `docs/BUILD-PLAN.md`) · field `doc-theme` in `docs/README.md` → if there is: the document must use the same logo (cover + page header), brand colors and patterns as the app · if not: follow item 0
2. **Do 1 direction first.** Only if the user is not wowed, or asks for several directions, do **3 directions in parallel** (3–5 times the labor · `parallel-attempts-pick-best` · a new agent with Bash per direction · for the cover use the 3-direction vote method in section 0.2). Each direction makes an HTML mock of A4 pages: cover · a content page with a real 4-row requirements table + callout · a table-of-contents page or a figure page · **1 figure redone for the direction** (use `diagram-figures`) · the file header says how to build each piece in real Word. When doing several directions they must really differ, for example a dark cover continuing from the app / a light editorial report / an engineering spec.
3. **2 reviewers who did not do the work** (if there is only one direction, score that one only; no mixing) score 1–5 (pass = 4): first impression · continuity with the app · craftsmanship (a long Thai table of 60 rows without breaking mid-word · type scale · contrast) · figures readable when placed for real · really buildable in Word → **mixing is allowed** (cover from one direction, body from another) if the reviewers name the pieces clearly.
4. Work on the render script (do not edit .docx files one by one) → render every copy → **document beauty gate (`ด่านสวย`)**: 2 new reviewers look at images of the real pages (cover · table of contents · chapter opener · long table page · figure page) using the 5 axes above, and take the lower score · ceiling **3 rounds** (more detail in `ui-craft/references/states-and-checks.md` in plugin `software-development` if installed) · record every round's score in `docs/BUILD-PLAN.md`
5. **Fonts:** use the brand's Thai font installed on the machine and embedded in the file (`embed_fonts`) · Tahoma is the fallback when embedding is impossible · **never set Thai text in a mono font** (Cascadia/Consolas have no Thai letters). Mono is for code, keys and numbers only.
6. **Figures in documents · rules the beauty gate often catches · cover** (minimum pixel sizes, rules in the render script's `check`, cover recipe) → [`references/word-layout.md`](references/word-layout.md), section at the end of the file

## 0.2 · A cover that belongs to this document set — make 3 directions, then vote 2 of 3

Use when a document set (proposal · report · business plan) needs its own cover and the default cover looks like another job's. Do one direction first; only if the user is not wowed, or asks for several directions, use this (3–5 times the labor). The full steps (find real examples to hold up · 3 designers · 3 reviewers · voting criteria · cover text) are in [`cover-vote`](references/cover-vote.md).

---

## 1 · Design tokens — never hardcode colors outside this table

This table defines each token's **role**, not the color value. The real values come from item 0, then are set once with `use_brand(...)`.

- tokens: `brand` · `brand_2` · `brand_deep` · `brand_tint` · `brand_tint_2` · `text` · `text_body` · `text_muted` · `line` + 6 status colors (success · info · warning · error · accent · neutral) that **do not change with the brand**
- Choose colors by meaning, not by looks (red = danger/real error only) · use the same meaning set as diagrams
- Thresholds every color set must pass: body text and `text_muted` on the background ≥ 4.5:1 · H2 and table headers (`brand_deep`) ≥ 7:1 · H1 and KPI numbers (`brand`, large) ≥ 3:1 · `use_brand()` checks and stops if it fails · printed in black and white, the hierarchy must still be distinguishable · if it fails, adjust the darkness, do not change the color
- Text is never pure black (use `text_body`) · **do not add type sizes outside the scale** (Word body 11pt · slides 17pt)

Full token table · color meaning table · type scale (pt) · reusable elements + methods → [`references/tokens-and-type.md`](references/tokens-and-type.md). Open it when setting the theme or choosing sizes/colors · examples of color sets used before → [`references/palette-examples.md`](references/palette-examples.md)

---

## 2 · Fonts and Thai — where it breaks most often

Use the brand's Thai font per item 0.1 step 5 first · if absent or not embeddable, use **Tahoma** as the fallback · rules that must not be missed:

- Word treats Thai as a *complex script*: **never set font/size/bold by hand.** Use `style_run()` in `brandkit.py` (it sets `w:szCs` `w:bCs` `w:iCs` and all 4 slots of `w:rFonts`)
- When the Latin and Thai fonts differ → set `bk.FONT` and `bk.LATIN_FONT`, then call `bk.thai_runs(doc.element.body)` and on every header/footer before `save()`
- Line spacing 1.3–1.35 (Tahoma) (the middle value is in `human-writing` `references/thai-line-breaking.md`) · **never justify** Thai paragraphs · to send a PDF, export it from real Word or check by eye first (LibreOffice breaks Thai words differently from Word)
- Linux has no Tahoma → Loma/Sarabun · ReportLab places tone marks wrongly

Details on dual-font traps · embedding fonts · variable fonts · Thai looking small on Linux → [`references/thai-fonts.md`](references/thai-fonts.md). Open it when setting fonts or when a PDF looks off.

---

## 3 · Word page structure

Document structure: cover page (project has a logo and mockup already → a project-specific cover per section 0.2 · no identity → use the default) → table of contents (TOC field) → body (H1 with section numbers · keep-with-next on every heading) → sign-off table · footer "หน้า N" (page N) centered, gray 9pt · full structure line by line → [`references/word-layout.md`](references/word-layout.md), section "Page structure"

**Dark cover** (the app or brand uses a dark screen) → `doc.cover(..., style="night")` · example `scripts/example_srs.py` · image `examples/example_srs-preview.png` · details and lessons from the work's owner → [`references/word-layout.md`](references/word-layout.md). Rule to remember every time:
- The cover background image and logo must not be in the first-page header (Word shows them faded while editing the file). Anchor them to the cover's first paragraph.

**Inner-page table headers must not use a full-width solid dark fill.** Dark cover background · logo size · small text · glow line under the title → [`references/word-layout.md`](references/word-layout.md)

Paper A4 · margins top/bottom 2.2 cm · left/right 2.0 cm give a content width of **17 cm = 9638 twips** (`BODY_TWIPS`)
(use this number to set table column widths so they add up exactly)

---

## 4 · Reusable elements

Elements (`cover()` · `table()` · `pill_table()` · `kpi_row()` · `callout()` · `figure()` · `code()` · `signoff()`): full look and methods → [`references/tokens-and-type.md`](references/tokens-and-type.md)

**Right proportions:** at most 3–5 callout boxes per 10 pages · KPI strip of 3–5 cells · a table over 6 columns should become a landscape page (`landscape_section()`)

---

## 5 · How to use brandkit

Import: `from brandkit import BrandDoc, use_brand, to_pdf` (put `scripts/` on the path or copy `brandkit.py` next to the work) · slides → `brandkit_pptx.BrandDeck` · speaking deck → `brandkit_stage.StageDeck`

Full sample code (Word · slides · Stage deck) → [`references/brandkit-usage.md`](references/brandkit-usage.md) · all methods → `references/api.md` · runnable scripts `scripts/example_srs.py` · `scripts/example_deck.py`

**Stage deck** (the default for a deck used for speaking): the colors `accent`/`bg` are extracted from the source work per `presentation-design` `references/deck-theme.md` (`source_palette.py` prints the `StageDeck(...)` line for you) · if the source has no color, look per `diagram-figures` item 5 · a light background `FFFFFF` with `block=True` (cover and chapter dividers in solid main color) is the default; use a dark background when the source work is dark · no color at all → use `#2A78D6` with background `FFFFFF` + `(รอยืนยัน)` (awaiting confirmation) · details → `references/brandkit-usage.md`

---

## 6 · Check the work by eye — a step that must not be skipped

A document that nobody has opened to look at the real pages is not finished, because there may be tables overflowing the margin, headings stranded at the page bottom,
floating tone marks. These problems cannot be seen from the code.
Render to PDF, convert to images, then **open and look at every page** (Read tool) before delivery · `soffice` and `pdftoppm` commands and the 7-point checklist → [`references/visual-check.md`](references/visual-check.md)

---

## 7 · Anti-patterns

- **Using Word's built-in Heading styles** → use `h1()/h2()/h3()`
- **Thick black default table lines** → `line` 0.5pt lines
- **Pure black text** → use `text_body`
- **Bold table headers with no fill color**
- **Letting Word decide column widths** → always `fixed_widths()`
- **Too many emoji**
- **Sending a file never rendered for a look**
- **Using the skill's default look as the deliverable when the app already has an identity** → do item 0.1
- **A 2000px-wide figure placed on a 17 cm portrait page without thinking about type size** → the text ends up around 5pt (item 0.1 step 6)
- **A decorative image on the cover that nobody said wows** → cut it, let the type be the highlight (references/word-layout.md item 8)
- **Creating a .docx without keeping the source markdown**

Reasons and replacements for each item → [`references/anti-patterns.md`](references/anti-patterns.md)

---

## 8 · Linking with other skills

| Need | Use together with |
|---------|-----------|
| Content structure/wording of formal documents · **the document's color theme** | `polished-document-style` |
| Diagrams to paste in as figures | `diagram-figures` (designed figures) · `software-diagrams` (plugin `software-development`) (Mermaid) → export PNG → `figure()` |
| Read Office files a customer sent | `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf` |
| Spreadsheet deliverable | `anthropic-skills:xlsx` (the same color tokens can be used) |
| Content and completeness of an SRS document | `srs-writing` (plugin `software-development`) |
| Slide storyline and layout | `presentation-design` |
| A presentation deck as a single .html file | `html-slide-deck` (when a .pptx exists, use the entry from .pptx in the same skill) |
| Diagrams drawn in Mermaid with the same theme | `software-diagrams` (plugin `software-development`) |
| Origin of the color and type system · logo | `graphic-design` (plugin `software-development`) |

---

## Do not look AI-made

Before sending, go through item 3 of `no-ai-look`. For HTML work, run its script. Every job must also pass the eye gate 3.2 (web pages answer items 10–14 in addition), because 0 script findings is not yet a pass. The prohibitions in this file are the parts specific to this work; the full list for all media is there.

## Abbreviations

Always spell out an abbreviation in full the first time, then put the abbreviation in brackets, for example Model Context Protocol (MCP).
After that the abbreviation may be used. See the skill `spell-out-abbreviations` for details.
