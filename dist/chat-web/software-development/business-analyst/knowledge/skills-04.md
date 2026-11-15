# skill: branded-document-design

Use when a Word, PowerPoint or PDF must look designed

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


## reference: anti-patterns.md

# Anti-patterns — เหตุผลและสิ่งที่ใช้แทน

หัวข้อสั้นอยู่ใน `SKILL.md`

- **ใช้ Heading style ที่มากับ Word** — จะทับสีที่ตั้งไว้ ให้ใช้ `h1()/h2()/h3()`
  ซึ่งตั้ง `outlineLvl` เอง สารบัญ (TOC) จึงยังเห็นหัวข้อ
- **เส้นตารางดำหนาแบบค่าเริ่มต้น** — เอกสารดูเก่าทันที ใช้เส้นสี `line` หนา 0.5pt ระหว่างแถว (ใต้แถวหัวคือเส้นแบรนด์ 1.5pt)
- **ตัวอักษรสีดำสนิท** — ให้ใช้ `text_body` ซึ่งเป็นเทาเข้ม เนื้อความจะนุ่มขึ้นมาก
- **หัวตารางตัวหนาแต่ไม่มีพื้นสี** — ตารางข้ามหน้าแล้วคนอ่านไม่รู้ว่าเริ่มตรงไหน
- **ปล่อยความกว้างคอลัมน์ให้ Word คิดเอง** — ต้อง `fixed_widths()` เสมอ
  ไม่งั้นคอลัมน์รหัสจะกว้างเท่าคอลัมน์รายละเอียด
- **อีโมจิเยอะเกิน** — 1 ตัวต่อ callout พอ ไม่ใส่ในหัวข้อทุกอัน
- **ส่งไฟล์โดยไม่เคย render ดู** — ดูข้อ 6
- **สร้าง .docx โดยไม่เก็บ markdown ต้นฉบับ** — รอบหน้าแก้ไม่ได้


## reference: api.md

# brandkit API — method reference

Every method returns the object it created (paragraph / table / slide), so you can customize it further.

## Contents

1. [brandkit.py — Word (.docx)](#brandkitpy--word-docx)
2. [brandkit_pptx.py — slides (.pptx)](#brandkit_pptxpy--slides-pptx)
3. [brandkit_stage.py — Stage deck (.pptx)](#brandkit_stagepy--stage-deck-pptx)
4. [Column width formulas (Word)](#column-width-formulas-word)

---

## brandkit.py — Word (.docx)

### Create a document

```python
BrandDoc(path_template=None, page="A4", margins_cm=(2.2, 2.0, 2.2, 2.0),
         footer_text="หน้า")
```

| Parameter | Meaning |
|-------------|----------|
| `path_template` | A .docx/.dotx file used as the template (already holds the organization's header/logo) |
| `page` | `"A4"` or `"Letter"` |
| `margins_cm` | (top, right, bottom, left) |
| `footer_text` | Prefix before the page number · `""` = bare number |

### Page-level blocks

| Method | Note |
|-------|----------|
| `cover(title, subtitle, meta, note, logo, logo_width_cm=None, eyebrow=None, meta_rows=None, top_space_pt=24, page_break=True, style="light", art_colors=None)` | The logo accepts .png and .emf, but **.svg does not work in python-docx**; convert to PNG first (`rsvg-convert -w 600` or `cairosvg`) |
| `cover(..., style="night")` | **Full-page dark cover** (see the example `examples/example_srs-preview.png`): dark gray background `#1C1C22` + a faint brand-colored glow · `logo` (omitted = no logo) small at top left, 4.6 cm wide · `eyebrow` → document title (32pt · if longer than 2 lines, reduce to 26pt) → `subtitle` → a glow line the full width of the text · `meta_rows` short values (≤18 characters, at most 4 values) go in a 4-cell table, the rest as label/value rows · `note` last · the cover has no footer · `art_colors=(color1, color2, color3)` colors of the glow line from left to right and of the background glow (default `brand_2` → `brand` → light `brand`) · the background image/logo/line are anchored to a paragraph in the body, not the header · needs numpy + pillow (`cover_art.py`) · `logo_width_cm` default 2.6 (light) / 4.6 (night) |
| `toc(heading="สารบัญ", levels="1-3")` | Inserts a TOC field; then in Word press **Ctrl+A then F9** so the entries appear (it is empty when created) |
| `page_break()` | |
| `landscape_section()` | Opens a landscape section for wide tables |

### Headings and text

| Method | Result |
|-------|---------|
| `h1(text)` `h2(text)` `h3(text)` | 16 / 12.5 / 11.5 pt · bold · brand / brand_deep / text · sets `outlineLvl` so the TOC sees them |
| `para(text, size, color, bold, italic, align, space_after)` | `align` = `"center"｜"right"｜"justify"` (do not justify Thai) |
| `rich([(text, opts), ...])` | Several formats in one paragraph, e.g. `[("สถานะ: ", {"bold": True}), ("อนุมัติ", {"color": "green"})]` |
| `bullets([...], style="List Bullet")` | `style="List Number"` for numbered lists |
| `code(text)` | Gray-background code block |

### Tables and data

| Method | Note |
|-------|----------|
| `table(headers, rows, widths=None, zebra=False, align=None, first_col_bold=False, size=None, header_style="tint")` | `widths` in twips totaling **9638** (`BODY_TWIPS`) for A4 with 2 cm margins · `align` = a list per column · `header_style="tint"` (default) header filled with `brand` mixed 80% with white, bold `brand_deep` text, no top line, a single 1.5pt `brand` line under the header, thin row lines, no vertical lines · `"classic"` = the old style (`brand_tint` header, thin gray grid) |
| `pill_table(headers, rows, status_col, palette, widths)` | `palette = {"เสร็จ": "green", "ค้าง": "red"}` · available tones: green blue amber red violet grey |
| `kpi_row([(value, label), ...])` | Exactly 3–5 cells |
| `signoff([(role, name), ...])` | Sign-off table |

### Other

| Method | Note |
|-------|----------|
| `callout(kind, title, body)` | kind = `tip｜note｜warning｜critical｜success｜question` |
| `figure(image_path, caption, width_cm=15.5, number=None)` | `number=1` prefixes the caption with "รูปที่ 1 — " (Figure 1) |
| `save(path)` | |

### Module-level functions

| Function | Use when |
|----------|---------|
| `use_brand(**tokens)` | Change the whole color set; must be called **before** creating `BrandDoc` |
| `style_run(run, size, color, bold, italic, mono)` | Set the font yourself (complex-script is already covered) |
| `shade(cell, token)` · `left_accent(cell, token, size)` | Fill a cell / add a colored bar on its left |
| `fixed_widths(table, widths)` | Force column widths |
| `set_borders(table)` · `row_borders(table)` · `no_borders(table)` · `cell_border(cell, edge, color, size)` | `row_borders` = horizontal lines only · `cell_border(..., color=None)` = no line on that side |
| `mix(color, other="FFFFFF", amount=0.5)` | Mix colors to make lighter/darker shades from the palette |
| `repeat_header(row)` · `keep_with_next(paragraph)` | |
| `add_field(paragraph, "PAGE")` | Insert a Word field |
| `to_pdf(docx_path, outdir)` | Calls LibreOffice to convert to PDF |

---

## brandkit_pptx.py — slides (.pptx)

```python
BrandDeck(template=None)      # 16:9 (13.333 × 7.5 inches)
```

| Method | Resulting slide |
|-------|-------------|
| `title_slide(title, subtitle, meta)` | Light blue background + a brand divider line |
| `section(title, kicker=None)` | Vertical brand bar on the left + section name |
| `bullets_slide(title, items, subtitle=None)` | Title + purple dash under the title + 17pt bullets |
| `kpi_slide(title, items, subtitle=None)` | Number cards |
| `table_slide(title, headers, rows, col_widths, subtitle, status_col, palette)` | `col_widths` are proportions, e.g. `[1, 4, 2, 2]` |
| `image_slide(title, image_path, caption, subtitle)` | Image centered on the slide, fitted to the frame automatically |
| `quote_slide(text, source)` | Quote/conclusion slide |
| `save(path)` | |

**Limits to know**

- Every slide is built from the blank layout (`slide_layouts[6]`), so there are no placeholders to edit in PowerPoint
  as in a normal template. If the customer will edit a lot themselves, pass `template=` as the organization's .pptx file instead.
- Tables in python-pptx have no API to turn off borders directly. If you want a table without lines, arrange text boxes instead.
- Table row height is a minimum. Long text pushes the row taller by itself, so leave room.

---

## brandkit_stage.py — Stage deck (.pptx)

```python
StageDeck(accent="2A78D6", bg="09090A", project="", template=None,
          head_font="Chakra Petch", body_font="IBM Plex Sans Thai", block=False, **colors)
# accent / bg = main color and background color from the project's design · colors = colors the project already fixed, e.g. text="1B2430"
# block=True = cover() and section() are a solid main-color full sheet, text on it gets ≥ 4.5:1 (white, near black or black)
```

Every sheet except the cover and chapter divider has: a main-color square + category name (`kicker`) · 28 pt slide title · a line at the foot of the page · `PROJECT · category` · 2-digit page number

| Method | Resulting slide |
|-------|-------------|
| `cover(title, lines, meta, logo=None, mark=None)` | 60 pt title + a main-color dash · `lines[1]` is in the main color · `mark` = a large faint symbol on the right (omitted = a faint ring) |
| `section(number, title, note)` | Chapter divider: a large number in the main color |
| `figure(kicker, title, image, caption, subtitle)` | Full-sheet diagram image (rendered with the same `#bg=` as the deck) |
| `compare(kicker, title, headers, rows, widths=(1, 1.85, 1.95))` | Table with row separator lines · column 1 gray, 2 bold white, 3 body text · at most 5 rows |
| `stats(kicker, title, items, subtitle)` | 2–4 big numbers + a sample question/answer under each number |
| `steps(kicker, title, rows, example_head, note)` | Numbered steps · `rows = [(name, what it does, example)]` at most 6 steps |
| `points(kicker, title, points, image, caption, side, side_caption)` | Image on the left + gist with a main-color dash · `side` = a small image on the right, e.g. a QR code |
| `statement(kicker, text, sub)` | A single statement centered on the sheet |
| `save(path)` | |

Color helpers: `make_theme(accent, bg)` returns the whole color set · `fit(color, bg)` adjusts lightness while keeping vividness until readable on that background · `is_dark(bg)` · `contrast(a, b)`

---

## Column width formulas (Word)

| Columns | Example widths (total 9638) |
|:---:|---|
| 2 | `[2600, 7038]` — heading/detail |
| 3 | `[1400, 6238, 2000]` — code/item/owner |
| 4 | `[1100, 4478, 1900, 2160]` — code/item/owner/status |
| 5 | `[1000, 1800, 2838, 2000, 2000]` |
| 6 or more | Use `landscape_section()` (area 14570 twips) |


## reference: brandkit-usage.md

# How to use brandkit — sample code

Read when you start writing a script that builds real files · all methods are in `api.md`

## Word document (`brandkit.py`)

```python
import sys; sys.path.insert(0, "scripts")     # หรือ copy brandkit.py มาไว้ข้างงาน
from brandkit import BrandDoc, use_brand, to_pdf

doc = BrandDoc()                                # A4 · Tahoma · สีประจำบ้าน
doc.cover("เอกสารข้อกำหนดซอฟต์แวร์ (Software Specification)",
          subtitle="ระบบตัวอย่าง (Sample System) — Project Control & Monitor",
          meta="เวอร์ชันเอกสาร 3.5  •  ปรับปรุง 19 กรกฎาคม 2026",
          logo="asset/Sample_Logo_Badge.png")
doc.toc()

doc.h1("1. ภาพรวมระบบ")
doc.para("ระบบตัวอย่างเป็นระบบบริหารและติดตามโครงการ ...")
doc.kpi_row([("19", "โครงการ"), ("115", "Work items"), ("103", "Open tasks")])
doc.table(["หัวข้อ", "รายละเอียด"],
          [["URL ระบบ", "https://app.example.com"]],
          widths=[2600, 7038])                  # รวม = 9638
doc.callout("warning", "ข้อควรระวัง", "Token ต้องไม่ถูกแสดงกลับใน UI หลังบันทึก")
doc.figure("diagrams/context.png", "ภาพรวมระบบและขอบเขตการใช้งาน", number=1)
doc.pill_table(["รหัส", "งาน", "สถานะ"], rows, status_col=2,
               palette={"เสร็จ": "green", "กำลังทำ": "amber", "ค้าง": "red"})
doc.signoff([("Product Owner", "—"), ("Tech Lead", "—")])
doc.save("SRS.docx")
```

## Slides (`brandkit_pptx.py`)

Slides use `brandkit_pptx.py`, which takes the same token set:

```python
from brandkit_pptx import BrandDeck
d = BrandDeck()                                  # 16:9
d.title_slide("ระบบตัวอย่าง", "Project Control & Monitor", "19 กรกฎาคม 2026")
d.section("1 · ภาพรวมระบบ", kicker="ส่วนที่ 1")
d.bullets_slide("ขอบเขตงาน", ["...", "..."], subtitle="สรุปจาก SRS v3.5")
d.kpi_slide("ตัวเลขสำคัญ", [("19", "โครงการ"), ("115", "Work items")])
d.table_slide("สถานะ Milestone", headers, rows, col_widths=[1, 4, 2, 2],
              status_col=3, palette={"เสร็จ": "green", "กำลังทำ": "amber"})
d.image_slide("สถาปัตยกรรม", "diagrams/arch.png", caption="ภาพรวมองค์ประกอบ")
d.save("deck.pptx")
```

All methods are in `references/api.md`. The runnable example files are
`scripts/example_srs.py` (document) · `scripts/example_deck.py` (`BrandDeck` slides)

## "Stage" deck (`brandkit_stage.py`) — the default for a deck used for speaking

`brandkit_stage.py` makes a deck with the same structure as the model deck: headings in Chakra Petch, body in IBM Plex Sans Thai, while the **background and main colors come from the project's design**, dark or light.
(The model is for deck structure only: X Fitness Chatbot Summary v1.2 · an example already run: `examples/example_stage.pptx`)

```python
from brandkit_stage import StageDeck
d = StageDeck(accent="2A78D6", bg="09090A", project="Sample Chatbot")   # ตัวอย่าง: สีหลัก · สีพื้นต้องมาจากดีไซน์ของโปรเจกต์คุณเอง
d.cover("Sample Chatbot", ["สรุปการทำงานของแชตบอท", "ตอบจากข้อมูลจริง และไม่ถูกหลอก"],
        meta="ทีมพัฒนา · ตุลาคม 2569", logo="logo.png", mark="mark.png")
d.figure("องค์ประกอบของระบบ", "แอปเดียวรับทุกช่องทาง ความฉลาดเรียกจาก Typhoon",
         "fig-flow-dark.png", caption="หน้าเว็บ + LINE OA → FastAPI → LightRAG + Typhoon")
d.save("deck.pptx")
```

- **2 colors come from the project's design:** `accent` (main color) and `bg` (background color). Look in the order given in `diagram-figures` item 5 (`doc-theme` → design in code, such as `--primary` · `--background` · the Tailwind theme · the app's dark/light mode → logo and brand kit → nothing at all: use the house color `#2A78D6` with background `FFFFFF` and write `(รอยืนยัน)` (awaiting confirmation)). Never use the model deck's colors · if the work being made into a deck has its own colors, extract them first with `presentation-design/scripts/source_palette.py` · for a light-background deck, set `block=True` so the cover and chapter dividers are a solid main-color full sheet (`presentation-design` `references/deck-theme.md`)
- Every gray level is computed from `bg` (dark background mixed with white, light background mixed with black), so it carries the same tone as the project's background · `accent_hi` is the main color with lightness adjusted until readable on that background; use it for big numbers, sequence numbers and emphasis words · a project that already fixed a text color can override it, e.g. `text="1B2430"`
- Fonts of the project can be used (`head_font=` · `body_font=`); if the project has none, use Chakra Petch + IBM Plex Sans Thai
- **Diagram images must use the same background color as the deck** — render `diagram-figures` with `#accent=<main color>&bg=<background color>` (now available in `figure-flow.html`)
- **The fonts Chakra Petch and IBM Plex Sans Thai must be installed** (Google Fonts · free to use) on the machine that opens the file. If the destination machine lacks them, send a PDF along, or rebuild with `head_font="Tahoma", body_font="Tahoma"`
- For printing, build another set with `bg="FFFFFF"` instead of using a dark background that wastes ink · `BrandDeck` (color bar on top) is still usable for reports sent to be read on their own


## reference: cover-vote.md

# A cover that belongs to this document set — make 3 directions, then vote 2 of 3

Open when a document set needs its own cover.

Use when a document set (proposal · report · business plan) needs its own cover and the default cover looks like another job's. Do one direction first; use this only if the user is not wowed or asks for several directions (3–5 times the labor).

1. **Find the real thing to hold on to:** logo, name, the main verb of the job (propose · analyze · sell), or real images of the work · look at at least 6 real covers by others · every image on the cover must point back to something real, otherwise cut it.
2. **3 designers (use `parallel-attempts-pick-best`).** Same brief, different directions: A drawn from the job's real data · B a real image of the work is the hero (screen, photo, sample of the output) · C the logo shape or lettering is the structure, no drawn image · each agent needs Bash to render and open the image itself.
3. **3 new reviewers who have not seen the work, each from a different angle:** art director (is it truly wow, does it look AI-made) · brand and customer (is it memorable, does it show what the work is about, does it go with the whole set) · Word production (is it repeatable, can the text be edited) · include the old cover as an option too.
4. **Criteria scored 1–5, then vote:** wow compared with the old cover · not a repeat of other work · tells the truth of the work · fits the whole set · craftsmanship (Thai, contrast, smallest text) · buildable and repeatable in Word · the direction with **2 of 3 votes wins** · borrow at most 2 strong pieces from a losing direction · if the votes split 3 ways, "repeatable" decides.
5. **Text on the cover is editable Word text** (title, version, date) · the background image has no lettering baked in · anchor the image to the first paragraph, not in the header.
6. **Software document sets only** (BRD · SRS · FSD whose cover must come from the logo shape or a real mockup · uses the cover generator) → if plugin `software-development` is present, also see `doc-cover-design` · without it, items 1–5 are complete on their own.


## reference: palette-examples.md

# Color sets that were actually used (examples)

> Warning: **these are examples, not standard values.**
> Always choose colors from the content of the work first, per item 0 of `SKILL.md`.
> Use this file to see what a complete set that passes the contrast thresholds looks like (checked with the script on 22 Oct 2026 (2569 BE)), not to copy.

## Set A — blue–violet (general software · extracted from Apps Track)

Light tone, airy, soft, cool gray text

```python
use_brand(
    brand="2A78D6", brand_2="6A5CD6", brand_deep="2A4C86",
    brand_tint="EDF1FB", brand_tint_2="F6F8FD",
    text="333B4A", text_body="414957", text_muted="676D7A", line="E4E7EE",
)
```

## Set B — teal green (medical · health)

```python
use_brand(
    brand="0E8F86", brand_2="2F9E6E", brand_deep="0A5A56",
    brand_tint="E6F4F2", brand_tint_2="F3FAF9",
    text="2C3A38", text_body="3A4846", text_muted="636F6A", line="E1EAE8",
)
```

## Set C — navy (government · legal)

```python
use_brand(
    brand="1F3C88", brand_2="5B4B8A", brand_deep="14275C",
    brand_tint="E8ECF7", brand_tint_2="F5F7FC",
    text="2B3245", text_body="3A4156", text_muted="636A7D", line="E2E6F0",
)
```

## Set D — amber yellow + steel gray (industrial · factory)

A warm accent on a cool gray frame. Use the accent only at the spots that need attention, not across the whole page.

```python
use_brand(
    brand="B57509", brand_2="8C5A2B", brand_deep="704805",
    brand_tint="FBF2E1", brand_tint_2="FDF9F1",
    text="2F3439", text_body="3E444A", text_muted="676F76", line="E5E8EA",
)
```

## Status colors — the same set for every brand

Status colors **do not change with the brand**, because their meaning is fixed.

| Status | Background | Text |
|---|---|---|
| Success | `E9F7EF` | `17794A` |
| Info | `EAF2FD` | `2160AB` |
| Warning | `FDF5E4` | `96660D` |
| Error | `FDEDEC` | `A63A34` |
| Accent | `F1EEFC` | `52439F` |
| Neutral | `F2F4F8` | `626A7A` |

> If the brand color clashes with one of the status colors (for example the brand is green), change the **brand color in that context**.
> Do not change the status color. Readers interpret green as "passed" before reading the text.

## How to check before use

1. Body text and `text_muted` on a white background and on a `brand_tint` background ≥ 4.5:1 · `brand_deep` (H2 and table headers) on white and `brand_tint` ≥ 7:1 · `brand` (H1 16pt bold, and KPI numbers count as large text) ≥ 3:1
2. Printed in black and white, headings must still be distinguishable from body text
3. Open the rendered file and look by eye; do not trust the values in the table

## Tones suggested by the content of the work (use when there is no brand color to hold on to)

| Content of the work | Suggested tone | Reason |
|---|---|---|
| Medical · health | Teal green · green | Cleanliness, safety |
| Finance · banking | Dark blue · silver gray | Stability |
| Industrial · factory | Amber yellow · steel gray | Machinery, warning |
| Education | Purple · light orange | Enthusiasm |
| Retail · food | Orange · pinkish red | Warmth, appetite |
| Government · legal | Navy · oxblood | Formality |
| General software | Blue | A neutral default when there is no other context |

If the customer already has a brand, use the brand colors. This table is used only when there is nothing to hold on to.


## reference: thai-fonts.md

# Fonts and Thai — details

The rules that must not be missed are abbreviated in `SKILL.md`

Use **Tahoma** as the default: on every Windows/Office machine · tone marks do not collide with vowels ·
bold reads clearly · the x-height of Thai and English is close.

> **Complex script trap:** Word treats Thai as a *complex script*, a separate set from Latin.
> If you set only `run.font.size` / `run.font.bold`, Thai text will **not follow**.
> You must set `w:szCs`, `w:bCs`, `w:iCs` and `w:rFonts` in all of `ascii/hAnsi/cs/eastAsia`.
> The function `style_run()` in `brandkit.py` handles this. **Never set fonts by hand.**

> **Dual-font trap:** if the Latin font and the Thai font differ, such as Noto Sans + Noto Sans Thai,
> setting only the `cs` slot is not enough. Word draws Thai with the font in the Latin slot if that font has Thai glyphs; if not, it silently falls back to Browallia New.
> Set `bk.FONT` (Thai) and `bk.LATIN_FONT` (Latin), then call `bk.thai_runs(doc.element.body)` and on every header and footer before `save()`.
> This function splits Thai text into runs of its own and sets all 4 slots to the Thai font.
> For fonts that are not on every machine, call `bk.embed_fonts(doc)` to embed the fonts in the file. This works only for fonts whose license allows embedding, such as OFL, and the file grows by several MB.
> Variable fonts such as Cascadia Mono become Calibri when Word exports to PDF. Use Consolas for code.

Other rules for Thai documents:

- Line spacing **1.3–1.35** for Tahoma (English only can use 1.15, but Thai has tone marks and upper–lower vowels that need room) · Noto family fonts have a built-in line height of 1.36–1.51 em, so **1.1–1.15** gives the same spacing. Decide from the real PDF page, not from the numbers.
- **Never justify** Thai paragraphs, because Thai has no spaces between words and Word stretches words until holes appear.
- LibreOffice breaks Thai words differently from Word. To send a PDF, export it from real Word,
  or at least open the PDF and check by eye before sending.
- To create a PDF on Linux without Tahoma, use **Loma** or **Sarabun** instead
  (ReportLab places Thai tone marks wrongly; use python-docx→LibreOffice or WeasyPrint instead).
- When previewing on Linux, Thai text looks **smaller** than Latin because the substitute font has a lower x-height.
  It is not a bug in the font size. On Windows with real Tahoma the heights are equal, so do the final check from Word.


## reference: tokens-and-type.md

# Design tokens · สเกลตัวอักษร · องค์ประกอบที่ใช้ซ้ำ

สารบัญ: tokens → ความหมายของสี → สเกลตัวอักษร → องค์ประกอบที่ใช้ซ้ำ

ตารางนี้กำหนด**หน้าที่**ของแต่ละ token ไม่ได้กำหนดค่าสี
ค่าจริงมาจากข้อ 0 แล้วตั้งครั้งเดียวด้วย `use_brand(...)`

| Token | หน้าที่ | ได้มาจาก |
|-------|---------|----------|
| `brand` | หัวข้อ H1 · ตัวเลข KPI · แถบ accent · ลิงก์ (ถ้า `brand` ต่ำกว่า 4.5:1 บนพื้นขาว ใช้ `brand_deep` กับลิงก์) | สีแบรนด์ (ไม่มี → ค่าประจำบ้าน + `(รอยืนยัน)`) |
| `brand_2` | accent รอง · ขีดใต้หัวข้อสไลด์ · ปลายไล่สี | เพื่อนบ้านของสีหลักบนวงล้อสี |
| `brand_deep` | หัวข้อ H2 · ตัวอักษรหัวตาราง | สีหลักผสมดำ ให้ contrast ≥ 7:1 บนพื้นขาว |
| `brand_tint` | พื้นหัวตาราง · การ์ด KPI · พื้นหน้าปก | สีหลักผสมขาวประมาณ 90% |
| `brand_tint_2` | แถวสลับ (zebra) ในตารางยาว | สีหลักผสมขาวประมาณ 96% |
| `text` | หัวข้อ H3 · ข้อความเน้น | เทาเข้มอมโทนเดียวกับสีหลัก |
| `text_body` | เนื้อความทั้งหมด | เทาเข้มอ่อนกว่า `text` 1 ขั้น **ไม่ใช่ดำสนิท เพราะดำสนิทล้าตา** |
| `text_muted` | คำบรรยายรูป · meta · footer | เทากลาง contrast ≥ 4.5:1 บนพื้นขาวและ `brand_tint` |
| `line` | เส้นตาราง เส้นคั่น | เทาอ่อนมาก เห็นได้แต่ไม่แย่งสายตา |

**สีสถานะ 6 ตัว** (แต่ละตัวมีคู่สีพื้นกับสีตัวอักษร): สำเร็จ · ข้อมูล · เตือน · ผิดพลาด · เน้น · เป็นกลาง
สีสถานะ**ไม่เปลี่ยนตามแบรนด์** เพราะเขียวคือผ่าน แดงคือไม่ผ่าน ในทุกเอกสาร
พื้นคือเฉดอ่อนมาก ตัวอักษรคือเฉดเข้มของสีเดียวกัน ให้ contrast ≥ 4.5:1

**ความหมายของแต่ละสี — เลือกสีตามความหมายเสมอ** (เหมือนกันทั้งเอกสารและไดอะแกรม)

| สี | หมายความว่า | ใช้กับ (callout / pill / กล่อง / เส้นในรูป) |
|---|---|---|
| แดง | อันตราย · ห้าม · ลบทิ้ง · ผิดพลาด · เลยกำหนด | `critical` · สถานะ "ค้าง/ล้มเหลว" · ขั้นที่ทำลายข้อมูล · เส้นที่พัง |
| เหลือง/ส้ม | ระวัง · รอดำเนินการ · ข้อแม้ · ทางที่ไม่ใช่เส้นหลัก | `warning` · สถานะ "กำลังทำ" · โซน/เส้นข้อยกเว้น (`#C77A11`) |
| เขียว | สำเร็จ · ผ่าน · ปลอดภัย · เสร็จแล้ว | `success` · สถานะ "เสร็จ" · ผลลัพธ์ที่ยืนยันแล้ว |
| สีหลัก (สีแบรนด์ ไม่มีแบรนด์ใช้น้ำเงินประจำบ้าน) | ข้อมูล · การกระทำหลัก · เส้นทางปกติ | `tip` · ปุ่มหลัก · กล่อง/เส้นเส้นทางหลัก |
| ม่วง | คำถาม · ทางเลือก · หมายเหตุเสริม | `question` · ของเสริมที่ไม่บังคับ |
| เทา | เป็นกลาง · ปิดใช้งาน · ของภายนอก | `note` · ระบบภายนอก · ส่วนที่ปิดอยู่ |

กฎเดียว: **เลือกสีตามความหมาย ไม่ใช่ตามความสวย** อย่าใช้แดงเพราะอยากให้เด่น ใช้แดงเฉพาะเมื่ออันตรายหรือผิดจริง และไดอะแกรมก็ใช้ชุดความหมายเดียวกันนี้ (ดู `software-diagrams` · `diagram-figures` ที่มี `EXCEPT_HUE` ส้มสำหรับทางที่ไม่ผ่านเส้นหลัก)

> **เกณฑ์ที่ต้องผ่านทุกชุดสี:** เนื้อความและ `text_muted` บนพื้น ≥ 4.5:1 · H2 และหัวตาราง (`brand_deep`) ≥ 7:1 ·
> H1 และตัวเลข KPI (`brand` ตัวใหญ่ ตามนิยามตัวใหญ่ของ WCAG 2.2 ข้อ 1.4.3) ≥ 3:1 ·
> พิมพ์ขาวดำแล้วยังแยกลำดับชั้นออก ถ้าไม่ผ่านให้ปรับความเข้ม ไม่เปลี่ยนสี
>
> **ตัวอย่างชุดสีที่เคยใช้จริง** (ไม่ใช่ค่ามาตรฐาน อย่าคัดลอกไปใช้โดยไม่ดูเนื้องาน) → `references/palette-examples.md`

> **เปลี่ยนแบรนด์ทั้งชุดในบรรทัดเดียว:**
> `use_brand(brand="C1121F", brand_deep="780000", brand_tint="FDECEC")`

## สเกลตัวอักษร (pt)

| ระดับ | Word | Slide | น้ำหนัก · สี |
|-------|------|-------|--------------|
| ชื่อบนปก | 20 | 40 | bold · `brand` (Word) / `brand_deep` (สไลด์) |
| H1 | 16 | 26 | bold · `brand` |
| H2 | 12.5 | — | bold · `brand_deep` |
| H3 | 11.5 | — | bold · `text` |
| เนื้อความ | 11 | 17 | regular · `text_body` |
| ตาราง | 11 | 12.5 | regular · `text_body` |
| คำบรรยาย/footer | 8.5–9 | 10–12 | italic หรือ regular · `text_muted` |

**อย่าเพิ่มขนาดนอกสเกลนี้** เพราะทุกขนาดที่เพิ่มทำให้เอกสารดูไม่สม่ำเสมอ และคนอ่านสังเกตเห็น

## องค์ประกอบที่ใช้ซ้ำ (จากข้อ 4)

| องค์ประกอบ | หน้าตา | เมธอด |
|-----------|--------|-------|
| หน้าปก | โลโก้ + ชื่อสีแบรนด์ กลางหน้า | `cover()` |
| ตาราง | หัวพื้น `brand_tint` ตัวอักษร `brand_deep` · เส้นแบรนด์ 1.5pt ใต้แถวหัว · เส้นระหว่างแถว `line` 0.5pt · หัวซ้ำทุกหน้า | `table()` |
| ตารางสถานะ | คอลัมน์สถานะย้อมสีตามค่า | `pill_table()` |
| แถบตัวเลขสรุป | การ์ดพื้น `brand_tint` ตัวเลขใหญ่สีแบรนด์ + ป้ายเทาเล็ก | `kpi_row()` |
| กล่องข้อความ | พื้นสีอ่อน + แถบสีหนาด้านซ้าย + อีโมจิ 1 ตัว | `callout()` |
| รูปพร้อมคำบรรยาย | รูปกลางหน้า + "รูปที่ N — ..." เอียงเทาใต้รูป | `figure()` |
| บล็อกโค้ด | พื้นเทาอ่อน ฟอนต์ Consolas 9pt | `code()` |
| ตารางเซ็น | บทบาท / ชื่อ / ลายเซ็น / วันที่ | `signoff()` |

**สัดส่วนที่พอดี:** callout ไม่เกิน 3–5 กล่องต่อ 10 หน้า · แถบตัวเลขสรุป (KPI strip) 3–5 ช่อง (ตั้งแต่ 6 ช่อง ตัวเลขจะเล็กจนไม่เด่น) ·
ตารางเกิน 6 คอลัมน์ให้เปลี่ยนเป็นหน้าแนวนอน (`landscape_section()`)


## reference: visual-check.md

# Check a document by eye — commands and checklist

```bash
soffice --headless --convert-to pdf --outdir _to_delete/preview SRS.docx
pdftoppm -png -r 80 _to_delete/preview/SRS.pdf _to_delete/preview/page      # ได้ page-1.png หรือ page-01.png (เลขเติมศูนย์ตามจำนวนหน้าทั้งหมด)
```

Then **open and look at every page image** (Read tool) before delivery. Check these:

- [ ] No table overflows the paper edge; columns are wide enough; no word is squeezed onto a strange new line
- [ ] No heading stranded on the last line of a page
- [ ] Thai tone marks/vowels do not collide, and no character turns into a square box
- [ ] The cover has no overflowing or edge-cut text · **page 2 is not blank** (a full-page cover, then the page-break paragraph falls onto page 2; `cover()` puts the break at the end of the last paragraph already, and a hand-written cover must do the same)
- [ ] Spacing before/after tables and callouts is the same across the document
- [ ] Footer page numbers on every page
- [ ] No TBD / Lorem ipsum / leftover placeholder (except `(รอยืนยัน)` (awaiting confirmation) that is in the report's awaiting-confirmation list)


## reference: word-layout.md

# Dark cover and table headers — details from real jobs

Read when making a dark cover or adjusting table headers on inner pages · the short rules to use every time are in `SKILL.md` item 3.

## Dark cover style

**Dark cover style (when the app or brand uses a dark screen):** a full-page cover in a neutral near-black dark gray (for example `#1C1C22`) with a very faint brand-colored glow (at most 15%). A deep purple glow filling the corner made the cover look purple, and the work's owner asked to go back to dark gray ·
The document title, subtitle and the line under the title go **right under the logo**, not in the middle or at the bottom of the page. The document-info table sits toward the bottom ·
A light-on-dark lettering logo at top left · document title 28–32pt · a 4-cell document-info table
(document code · version · date · status) · inner pages have a white background and dark code blocks; the header has a small logo, the document title and the document code;
the footer has the system name and "หน้า / ทั้งหมด" (page / total). The dark color is on the cover page only, so it can still be printed. The title size on this kind of cover may exceed the scale in item 1.
The logo on the cover uses a **small size (about 4.5 cm wide) at top left, above the document title**. Enlarging the symbol into the main image in the middle of the cover was tried, and the work's owner asked to go back to small.
If you want a flourish, stretch the logo's color glow into a long line as wide as the text (leave left and right margins equal to the paper margins; a line touching the paper edge was asked to be set in from the edge) as a bar of even thickness **with straight-cut ends and slightly rounded corners** (about 0.7 mm thick, corners about 0.25 mm). Tapered pointed ends were criticized as too sharp · the glow must fade to zero before the image edge, otherwise the box edge of the image shows. Use it instead of an underline below the document title (anchor the line image to the paragraph under the title so it follows both 1-line and 2-line titles) · the line must be **one continuous image** with the same thickness and glow throughout, a smoothstep gradient with both ends fading softly, drawn at 300 dpi. Never lay short bars over a long line, because it shows as a thick lump with colors that do not join (the work's owner said "the colored line is not smooth").
> **The cover background image and the logo on the cover must not be placed in the first page's header.** Word shows everything in the header as faded while reading or editing the document, so a full-page dark cover looks washed out (it is not faded in the PDF, so checking from the PDF alone will not find it; the work's owner said "looks washed out"). Anchor the floating behind-text image to the cover's first paragraph instead, and set `relativeHeight` the way Word does (background image 251658240 · images above it increase by 1024 each), because Word re-orders small numbers like 1, 2, 3 on save, and then the background image covers the logo.

Small text on a dark cover (labels, author info, notes) uses a size **of at least 8.5pt** and a light gray from `#CFCCDE` up; the subtitle uses a near-white light color. 7.5pt mid-gray text on a dark background looks faint.

**Use in code:** `doc.cover(title, subtitle=..., eyebrow=..., meta_rows=[...], logo="logo.png", style="night")`. The logo is optional · the glow line colors can be adjusted with `art_colors=(color1, color2, color3)` · the resulting look: `examples/example_srs-preview.png` (cover + inner page) · the example call: `scripts/example_srs.py` · `table()` uses this table header style by default (`header_style="classic"` = the old style)

## Table headers on inner pages

**Table headers on inner pages must not use a full-width solid dark fill**, even when the cover is dark, because tables are on every page, so dark color is heavy on the eye and wastes ink (the work's owner really asked for this change in one job).
Use a light fill of the brand color that still clearly reads as the header row, such as `#E4DCFD` (a lighter fill like `#F5F3FF` was called too faint by the work's owner), with bold dark brand-colored text.
There is only one border: a 1.5pt brand-colored line under the header row. No line on top (a black top line looks heavy and was asked to be changed), and no white gaps between header cells, because that would break the line under the header into segments.
Word cannot draw gradient borders; if you add a gradient, the color changes in steps along the columns.

## Page structure (moved from `SKILL.md` item 3; wording not changed)

```
หน้าปก        โลโก้กลาง → ชื่อเอกสาร (brand, bold) → ชื่อระบบ (text, bold)
              → บรรทัดเวอร์ชัน/วันที่ (9pt) → หมายเหตุการแก้ไข (8pt เอียง เทา)
              → ขึ้นหน้าใหม่
สารบัญ        field TOC (ผู้ใช้กด F9 อัปเดต) → ขึ้นหน้าใหม่
เนื้อหา        H1 มีเลขข้อเสมอ ("1. ภาพรวมระบบ") · H2 เป็น "1.1"
              ทุก H1/H2/H3 ตั้ง keep-with-next กันหัวข้อค้างท้ายหน้า
ท้ายเอกสาร    ตารางลงนามอนุมัติ
footer        "หน้า N" กลางหน้า สีเทา 9pt
```

## Figures in documents · beauty-gate rules · cover (moved from SKILL.md §0.1 items 6–8)

6. **Figures in documents:** the smallest text after real placement ≥ 7pt → minimum pixels on the canvas = `0.247 × canvas width(px) ÷ placed width(cm)` (a 2000px canvas placed 17 cm wide = 29px · placed on a 25.7 cm landscape page = 20px · use 26px to get 9pt) · a wide figure should go on a landscape page at the full column width (≥ 95%) · use the **version placed in the document without a figure title**, because the Word caption already gives the number and the figure's name · figure caption ≥ 9pt in body text color · after a figure, start a new section; the next paragraph must not flow onto the figure's page.
7. **What the beauty gate (`ด่านสวย`) often catches (put them as rules in the render script's `check`):** stray markdown marks (`**` · backtick) · Thai text in a mono font · a table overflowing a text column · a table of contents with a single entry stranded on the next page · a code list cut in the middle of a code (one code per line, one font for the whole column) · the "(รอยืนยัน)" tag uses the warning color, not the brand color · identity lost after the cover (chapter opener pages use the app's brand color bar) · a light cover available to print alongside the dark cover.
8. **Cover — plain lettering first, images later** (a project-specific cover that uses the logo shape or a real screen instead of decorative images → `doc-cover-design` (plugin `software-development`))**:** an illustration on the cover is optional, and an open cover with well-set lettering always beats an image that does not wow · a design that passed the gate: the document type (SRS · FSD · ARCH) large at 150–200px in the brand color as the only highlight (width at most ~85% of the column · a name over 5 letters such as TESTPLAN splits into 2 lines, never shrunk smaller than other copies, since the whole set must look the same size) → a short brand-colored line → Thai title → English title → a 1-sentence summary line (≥ 12pt, narrow column) → an info row at the page foot (labels ≥ 10pt) · leave the rest empty · parts with fixed positions (logo · document type · line · status tag) are drawn into the cover background image, while the title and info are Word text that can be searched and edited · the `(รอยืนยัน)` (awaiting confirmation) tag on a dark background uses a bright warning color, with no highlight fill · **if the user says the cover is not beautiful → cut the decorative images first** (curves, glowing dots, gradients), then make 3 plain-lettering covers to choose from (project has a logo or mockup → use `doc-cover-design` item 7 instead)


---

# skill: srs-writing

Use when writing a Software Requirements Specification

# SRS Writing

> **Language:** write every line of wording by `human-writing` — this skill gives the format and structure, while human-writing says how to write so people can follow.

> **The one rule of this skill:** every requirement must let you write a **test case** from it right away.
> If you cannot, it is not a requirement, just a hope.

---

## When to use this skill

- Writing a Software Requirements Specification (SRS)
- Reviewing an SRS someone else wrote, before signing off
- Turning meeting notes into usable requirements
- Preparing documents for a tender or statement of work (SOW)

## When **not** to use

| Task | Use this instead |
|---|---|
| User stories for a sprint | `user-story-writer` |
| Record of why a technology was chosen | `adr-writer` |
| Screen-level Functional Specification Document (FSD) | `fsd-writing` |
| Look of the exported Word file | `branded-document-design` |
| Figures in the document | `software-diagrams` · `diagram-figures` |

---

## 0 · Find an existing format first (every time)

Before using the structure or template in this file, check whether the user, customer, or project already has its own format:

- **Where to look:** format requirements from the client: TOR (Terms of Reference) · scope of work in the contract · the agency's forms · the earlier SRS of the same system in `docs/` · if there is no file, ask the user one question: does the client require a document format?
- **Result:** found → use that format (headings, order, field names, running numbers) and say in the reply which file it came from · not found → use the template in this file as the fallback and say that no earlier format was found.
- **Every format still needs:** job size sets the depth: a small internal system drops sections that have nothing in them · a system with legal rules or an inspector uses everything the TOR orders · testable requirement IDs are needed in every format.

## 1 · Order of work

1. **Collect all the information before writing** — who uses it · how work is done now · what the problem is ·
   how success is measured · other systems to connect · legal obligations
2. **Draft the outline first** — use `assets/srs-outline.md` to lay out all the headings, no body text yet
3. **Write scope and stakeholders before requirements** — if you do not yet know who uses it, you will write requirements for the wrong person
4. **Write requirements by section 3**, one at a time, and assign the ID as soon as you write it
5. **Build the traceability matrix** — every requirement needs a source
6. **Review by section 8** and then send

> Step 5 is the one people skip most, but it is what gives the document real value when a change request arrives

---

## 2 · Document structure

Based on ISO/IEC/IEEE 29148 (the international standard for requirements processes).
The full version, with hints on what each section must contain, is in **`assets/srs-outline.md`**

For the Business Requirements Document (BRD), which is often written before the SRS, use the template in [`references/brd-template.md`](references/brd-template.md)

| # | Section | Answers the question | Can it be skipped |
|---|---|---|---|
| 1 | Introduction · purpose · scope · definitions | What this document covers and does not cover | No |
| 2 | System overview · users · constraints · assumptions | Where the system sits in the world | No |
| 3 | Functional requirements | What the system must be able to do | No |
| 4 | Interface requirements | How it connects to other systems | If it connects to nothing |
| 5 | Non-functional requirements | How fast, how secure | No |
| 6 | Data and business rules | What the data looks like, which rules apply | No |
| 7 | Acceptance criteria | When it counts as done | No |
| 8 | Traceability matrix | Where this requirement came from | No |
| 9 | Appendices · revision history | Who changed what, when | No |

**Section 1.2 Scope must have both "in scope" and "out of scope"** —
in the whole document, the "out of scope" list prevents the most disputes

**2 subsections that ISO 29148 has but we often forget** (idea from jam01/SRS-Template, which states no licence, so it is rewritten in our own words, no text copied)

| Subsection | What to put in | When it is needed |
|---|---|---|
| 2.6 Apportioning of requirements | A table of which release · milestone or subsystem each group of requirements goes to, and which items are **deferred to a later round** — for an item whose destination is not yet known, write "not yet apportioned" and track it as a pending task | More than 1 release or 1 team · matches the `milestone` column of `spec-to-code-loop` |
| 3.6 Systems with AI/ML | 6 items: what the model does and which number measures a pass · where training data comes from, who consented, how it is stored · guardrails (check input · filter output · limit the actions it can take · fallback) · fairness and explainability · points where a person must check before it takes effect · release, monitoring, retraining, and retiring the model | Every system that calls an LLM or has a model — write it together with `llm-engineering` and `pdpa-compliance` |

**Choose sections by project, do not fill every slot just because the template has it** — before writing, declare one line at the very top saying which section is `เขียน` (write) · `ข้าม (เหตุผล)` (skip (reason)) · `ตัดออก` (drop), following this set

| Project | Write in addition to core 1 2 3 5 6 7 8 9 | Can drop |
|---|---|---|
| Internal web or app, no other systems | — | 4 interface · 2.6 · 3.6 |
| Connects to an external API or device | 4 interface (both sides) | 3.6 |
| Multiple releases or teams | 2.6 | 3.6 if no AI |
| Has an LLM or model | 3.6 + the security and personal-data categories in 5 | — |
| Regulated work (finance · health · insurance) | The compliance category in 5 as its own section, citing the law with the date checked | — |

---

## 3 · How to write one requirement

### Mandatory words

| Word | Meaning | Contract effect |
|---|---|---|
| **ต้อง** (shall) | Mandatory | If missing, fails acceptance |
| **ควร** (should) | Recommended | May be absent if the reason is recorded |
| **อาจ** (may) | Optional | May be absent |

**Do not mix "ต้อง" and "จะ" (will)** — pick one word and use it through the whole document

### Sentence form

```
<รหัส> · <ผู้กระทำ> ต้อง <ทำอะไร> <เงื่อนไข/ขีดจำกัดที่วัดได้>
```

```
ผิด: ระบบต้องค้นหาได้เร็ว
ผิด: ระบบต้องใช้งานง่ายและรองรับผู้ใช้จำนวนมาก
ถูก: FR-SRCH-010 · ระบบต้องคืนผลการค้นหาคำสั่งซื้อภายใน 2 วินาที
   เมื่อฐานข้อมูลมีคำสั่งซื้อไม่เกิน 500,000 รายการ
```

### Seven rules

1. **1 requirement per item** — when you see the word "and" (และ), suspect it should be split into 2 items
2. **Always name the actor**, such as "the system" (ระบบ) · "the approver" (ผู้อนุมัติ) · "the scheduled job" (งานตามเวลา); never write a sentence with no subject
3. **Numbers instead of adjectives** — "fast" "many" "easy" "stable" must each be converted to a number
4. **Do not state the method** — a requirement says *what must be obtained*, not *how*
   (`ต้องเก็บใน Redis` is wrong · `ต้องคืนผลภายใน 200ms` is right)
5. **No "etc." (เป็นต้น, ฯลฯ) and no "and/or" (และ/หรือ)** — the contractor will always read it as narrowly as possible
6. **Testable** — on reading it you must be able to say at once *how to prove it passes*
7. **No conflict with other items** — after writing, go through and look for items that contradict each other

### How to convert vague words

| Customer says | Ask back | Write down |
|---|---|---|
| "ต้องเร็ว" (must be fast) | How fast, measured where, with how many users | Return results within 2 seconds at the 95th percentile with 200 concurrent users |
| "ใช้ง่าย" (easy to use) | What must a new user be able to do, in how long, without training | A new user creates their first order within 5 minutes without opening the manual |
| "ปลอดภัย" (secure) | Against whom, what must they be unable to do | A user with the "viewer" role must be unable to call an API that changes data, and gets code 403 |
| "รองรับคนเยอะ" (supports many people) | How many at once, which period is heaviest | Supports 500 concurrent users during month-end closing |
| "รายงานครบ" (complete reports) | Which reports, who views them, how often | List them item by item, one report per item |

---

## 4 · IDs and traceability

### ID scheme

```
FR-<โมดูล>-<เลข 3 หลัก>      ข้อกำหนดเชิงหน้าที่    FR-ORD-010
NFR-<หมวด>-<เลข 3 หลัก>      ข้อกำหนดที่ไม่ใช่หน้าที่  NFR-PERF-010
BR-<เลข 3 หลัก>              กฎทางธุรกิจ            BR-020
IF-<ระบบปลายทาง>-<เลข>       ส่วนต่อประสาน           IF-LINE-010
```

**Number in steps of 10** — you can insert items later without renumbering the whole document

**An ID that has been issued must never be reused.** Mark a cancelled item `(ยกเลิก v1.3)` (cancelled v1.3)
in place — do not delete it, or people holding the old document will read different things

### Traceability table

| รหัส | ที่มา | โมดูล | ความสำคัญ | ทดสอบด้วย | สถานะ |
|---|---|---|---|---|---|
| FR-ORD-010 | ประชุม 12 ส.ค. ข้อ 3 | คำสั่งซื้อ | ต้องมี | TC-ORD-001..004 | ตกลงแล้ว |
| NFR-PERF-010 | สัญญา ข้อ 7.2 | ทั้งระบบ | ต้องมี | TC-PERF-001 | ตกลงแล้ว |

- **Every requirement needs a source** — an item with no source is one the team made up, and you must go ask to get an answer
- **Every requirement needs at least 1 test case**
- Priority uses MoSCoW: ต้องมี (Must) · ควรมี (Should) · มีก็ดี (Could) · ไว้ทีหลัง (Won't)
  **If "ต้องมี" (Must) exceeds 60% of the total, the items have not really been prioritised**

**The business-rule (BR) table gets a column "boundary values to test"** — for a rule with a number, write 3 values: below the boundary · at the boundary · over the boundary · and put the boundary numbers in a story's acceptance criteria too (for example ฿9,999 and ฿10,000), because the 3 bugs planted for testing in the training exercise were all at the boundaries (an example from that exercise, not a criterion)

**Two-way traceability** — the table above traces one way, from requirement to source. At the end add a table story | functional requirement (FR) | business rule (BR) and set a pass rule of "nothing dropped": every story must be backed by an FR or BR, and for any that is not, mark it and fix it before sending (example from that exercise: 36 stories, 36/36 covered)

---

## 5 · Non-functional requirements — categories to ask about every time

The categories that hurt most when forgotten are **maintainability** and **backup** —
nobody asks at contract signing, but everyone asks when the system goes down

| Category | Must ask | Example that can be written |
|---|---|---|
| Performance | What is the slowest acceptable, at which percentile | หน้ารายการโหลดภายใน 1.5 วิ ที่ p95 |
| Capacity | How much data grows per year, how many years it will be used | รองรับ 2 ล้านรายการใน 3 ปี |
| Concurrent users | Which period is heaviest, how many people | 500 คน ช่วงปิดยอดสิ้นเดือน |
| Availability | Can it be shut down for maintenance, when | 99.5% ต่อเดือน · ปิดได้คืนวันอาทิตย์ 01:00–03:00 |
| Backup | How far back can it restore, how long does recovery take | สำรองทุกวัน · เก็บ 90 วัน · กู้คืนภายใน 4 ชม. |
| Security | How many permission levels, which data is sensitive · for web apps and APIs, put in NFR-SEC per `security-gate/references/owasp-contract-clause.md` | 4 บทบาท · เลขบัตรประชาชนเข้ารหัสตอนพัก |
| Audit trail | Must we know who changed what, when | บันทึกทุกการเปลี่ยนสถานะ เก็บ 2 ปี |
| Compatibility | Which browsers, mobile or not | Chrome/Edge 2 รุ่นล่าสุด · จอ ≥ 360px |
| Language | 2 languages, currency, time zone | ไทย/อังกฤษ · Asia/Bangkok · พ.ศ. ในรายงาน |
| Maintenance | Who takes over, what is handed over | ส่งมอบซอร์สโค้ด · คู่มือติดตั้ง · อบรม 2 วัน |
| Legal | Which regulations apply | พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) |

Every number must come from the **customer**, not from the document writer.
If the customer does not know, propose a number and **record it as an assumption** in section 2

**Facts the interviewee did not state must never be guessed silently** (for example the time or price of a service · whether discounts can stack · whether travel cost is charged per vehicle or per person). Flag that item "(รอยืนยัน)" (awaiting confirmation), write the assumption used, and give the number of the source question, then summarise in a table at the end of the document: question → assumption → business rule that uses that value (example from that exercise: 20 assumptions A1–A20)

**Every NFR has a "how to measure" column** (for example `scrollWidth ≤ 375` · requests sending images off the device = 0) and put NFRs on "testability" in from the requirements stage: the AI part uses fixed rules (asking the same thing gets the same answer) · a button to reset test data · the system's "today" date can be locked · every button has a label so tools can find it (this is reported from the training exercise, not measured against how much it helps)

---

## 6 · Figures in the document

An SRS with no figures at all makes readers imagine the picture, and each imagines it differently.
**Figures in the SRS itself use one house style:**

| Which figure | Draw with |
|---|---|
| Every figure in the SRS itself (overview · flowchart · sequence · ER · state), whether delivered as markdown, .docx or PDF | `diagram-figures` — sharp image files, placement under your own control, source files kept in the repo so git can track them |
| Quick figures in a README · PR · code note, outside the SRS itself | `software-diagrams` (Mermaid) |

**Every figure in one document must use the same colour theme** — declare the theme at the top of the document per
`polished-document-style` section "ธีมของเอกสาร" (Document theme), and every tool reads values from that one place

Minimum figures to have:

| Section | Figure |
|---|---|
| 2 System overview | C4 level 1 — who the system talks to |
| 2 Users | Table of roles and permissions |
| 3 Functional requirements | Work-flow chart of the main process |
| 3 Complex processes | sequence diagram |
| 6 Data | ER diagram + state diagram of the main document |

---

## 7 · Bilingual documents

- **Choose 1 main language** and put the other in brackets or in a 2nd column — never switch back and forth
- **First time a technical term appears, write Thai (full English name: abbreviation)**, for example ปัญญาประดิษฐ์ (Artificial Intelligence: AI), per the rule "เอกสารภาษาไทย" (Thai-language documents) in `spell-out-abbreviations` · afterwards use the Thai or the abbreviation, one way through the document
- Thai text → `human-writing` `references/thai-grammar.md` section 4, the business register
- **Field names, API names, and status names in the database are always English** even if the document is Thai —
  otherwise people will translate them differently when writing code
- Complete the **glossary** in section 1.3: Thai term · English term · meaning · name in the system
- For fonts and page layout of the Word file, see `branded-document-design`

---

## 8 · Completeness review

Go through the checklist in [`references/review-checklist.md`](references/review-checklist.md) in full before every send (scope · each requirement · category completeness · document)
because items that fail become disputes at acceptance

**Fresh-reader test** after the checklist: have a new agent that gets only the SRS file answer 8–10 questions a developer and QA would ask. An item answered wrong or answered "don't know" is a point to fix. If it has not passed, do not send to the customer → [`references/reader-test.md`](references/reader-test.md)

---

## 9 · Anti-patterns

- **Pasting meeting notes in as requirements** — different form, different level of detail
- **"The system must be easy to use"** — nobody can accept this item
- **Putting already-designed screens into the SRS** — locks the method before all requirements are known
  (screen sketches belong in the FSD)
- **No "out of scope" section** — the number 1 cause of unpaid extra work
- **Every item is "Must"** — means priorities have not been discussed with the customer
- **Non-functional requirements written together as one paragraph** — must be split into items with IDs
- **Numbers the writer made up** without asking the customer and without saying they are assumptions
- **No version number and revision history** — nobody knows whether they hold the latest version
- **Reusing an ID of a cancelled item**
- **Sending a Word file with the default look** — see `branded-document-design`

---

## 10 · Connecting to other skills

| Need | Use together with |
|---|---|
| Look of the exported .docx file | `branded-document-design` |
| Markdown format while drafting | `polished-document-style` |
| Figures in the document (see section 6 for which to choose) | `software-diagrams` · `diagram-figures` |
| Colour theme of the whole document | `polished-document-style` section "ธีมของเอกสาร" (Document theme) |
| Detail at a level a developer can start work from | `fsd-writing` |
| Break into user stories when real work starts | `user-story-writer` |
| Turn requirements into test cases | `test-case-template` |
| Cut unnecessary things out of the document | `simplicity-first` |
| Present the SRS to executives | `presentation-design` |

---

## Abbreviations

Always write the abbreviation in full the first time, then put the abbreviation in brackets — for example Model Context Protocol (MCP)
After that you may use the abbreviation. See the skill `spell-out-abbreviations` for details.


## reference: brd-template.md

# BRD template — stakeholder version (Mode B)

แม่แบบ Business Requirements Document (BRD) ฉบับส่งผู้เกี่ยวข้อง ของ agent `business-analyst` · จัดรูปแบบตาม `polished-document-style`

**สารบัญ:**

- [Standard Output: Polished BRD (Mode B)](#standard-output-polished-brd-mode-b) — template sections: Executive Summary · Business Objective · Stakeholders · Scope · Business Requirements · Business Rules · Assumptions & Constraints · Open Questions · Process Flow · Sign-off

## Standard Output: Polished BRD (Mode B)

```markdown
# BRD: <Feature Name>

| | |
|--|--|
| **Document Type** | Business Requirements Document |
| **Version** | 1.0 |
| **Status** | Draft |
| **Date** | YYYY-MM-DD |
| **Author** | @ba-name |
| **Reviewer(s)** | @stakeholder |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Objective](#2-business-objective)
3. [Stakeholders](#3-stakeholders)
4. [Scope](#4-scope)
5. [Business Requirements](#5-business-requirements)
6. [Business Rules](#6-business-rules)
7. [Assumptions & Constraints](#7-assumptions--constraints)
8. [Open Questions](#8-open-questions)
9. [Process Flow](#9-process-flow-if-applicable)
10. [Sign-off](#sign-off)

---

## 1. Executive Summary

> **For non-technical readers** — 1 paragraph capturing what, why, and impact.

## 2. Business Objective

| Aspect | Details |
|--------|---------|
| **Problem** | ... |
| **Goal** | ... |
| **Success Metrics** | • Metric 1: target<br>• Metric 2: target |
| **Business Impact** | Revenue / Efficiency / UX |

## 3. Stakeholders

| Role | Name | Interest | Influence | RACI |
|------|------|:--------:|:---------:|:----:|
| Product Owner | @alice | High | High | A |
| End User | @customer | High | Medium | C |
| Engineering | @bob | Medium | High | R |
| Legal | @charlie | Low | Medium | I |

> **RACI:** R=Responsible, A=Accountable, C=Consulted, I=Informed

## 4. Scope

### In Scope
- ...

### Out of Scope
- ...

> **Note:** Out-of-scope items may be addressed in future phases (list each one in Section 8, Open Questions, with its target phase).

## 5. Business Requirements

| ID | Requirement | Priority | Acceptance |
|:---|:------------|:--------:|:-----------|
| BREQ-001 | System shall... | Must | Verified by ... |
| BREQ-002 | System should... | Should | Verified by ... |
| BREQ-003 | System could... | Could | Verified by ... |

> **MoSCoW prioritization:** Must / Should / Could / Won't

## 6. Business Rules

| ID | Rule | Source |
|:---|:-----|:-------|
| BRL-001 | Returns accepted within 14 days of delivery | Return policy |
| BRL-002 | Max discount = 30% per order | Pricing policy |

## 7. Assumptions & Constraints

### Assumptions
- ...

### Constraints
| Type | Constraint |
|------|------------|
| Budget | ฿XX,XXX |
| Timeline | Launch by YYYY-MM-DD |
| Compliance | Personal Data Protection Act (PDPA), Payment Card Industry Data Security Standard (PCI-DSS) |
| Technical | Must integrate with existing Customer Relationship Management (CRM) system |

## 8. Open Questions

| ID | Question | Owner | Due |
|:---|:---------|:------|:---:|
| Q-001 | Which payment gateway? | @alice | MM/DD |
| Q-002 | Refund policy? | @legal | MM/DD |

## 9. Process Flow (if applicable)

[Flowchart: Customer requests → Validate → Process → Notify; invalid → Reject]
(draw it as a house-style figure with `diagram-figures`, not inline Mermaid)

## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| Product Owner | @alice | Pending | — |
| Tech Lead | @bob | Pending | — |
| Compliance | @charlie | Pending | — |
```


## reference: reader-test.md

# Fresh-reader test — for SRS · FSD · BRD before sending to the customer

A checklist says the sections are all there. It does not say the reader understood what we meant. In this method, an agent that never saw the meeting reads the document and answers questions. A wrong answer, or an answer of "don't know", marks a gap in the document. (Adapted from Stage 3 Reader Testing of `doc-coauthoring` in anthropics/skills · viewed 2026-11-10 · not a literal translation)

## Steps

1. **Write 8–10 questions before showing the document to anyone** — questions a developer and QA would really ask, such as "what happens on a double booking of the same time" · "which statuses can be reversed" · "how is the amount rounded" · "who may cancel". Write down the correct answer to each first (from us).
2. **Send to a new agent that gets only the document file** — no chat history, no code, no other files (`handoff` · empty folder). It answers one question at a time and cites the section it used.
3. **Compare with the correct answers** — wrong · answered "don't know" · right but had to guess = 1 gap.
4. **Fix the document at that point, then ask the same question again to another new agent** — do not change the answer to match.
5. **If it fails, do not send to the customer** — it passes when every question is answered right without guessing.

## Thai-specific questions (add at least 2)

- Are years on screens and reports in Buddhist Era (พ.ศ.) or Common Era (ค.ศ.)? Which field is stored as which in the database?
- What format do document numbers (quotations · tax invoices) use, and when does the count restart?

## Bilingual documents

Have a different new agent read the Thai version and the English version, answer the same set of questions, then compare the answers. A difference = the 2 versions do not match.


## reference: review-checklist.md

# รีวิวความครบถ้วนของ SRS

ใช้กับ `srs-writing` ข้อ 8 · ไล่ให้ครบก่อนส่งทุกครั้ง · "ข้อ 5" หมายถึงหมวดข้อกำหนดที่ไม่ใช่หน้าที่ใน `SKILL.md`

**ขอบเขต**

- [ ] มีรายการ "ไม่อยู่ในขอบเขต" ไหม
- [ ] มีข้อสมมติเขียนไว้ชัดไหม และใครต้องยืนยันข้อสมมตินั้น
- [ ] ระบุระบบอื่นที่ต้องต่อครบไหม ใครเป็นเจ้าของแต่ละระบบ

**ข้อกำหนดรายข้อ**

- [ ] ทุกข้อมีรหัสไหม
- [ ] ทุกข้อเขียน test case ได้ไหม
- [ ] มีคำว่า "เร็ว" "ง่าย" "เหมาะสม" "เสถียร" "ยืดหยุ่น" หลงเหลือไหม
- [ ] มี "เป็นต้น" "ฯลฯ" "และ/หรือ" หลงเหลือไหม
- [ ] มีข้อไหนบอกวิธีทำแทนที่จะบอกผลลัพธ์ไหม
- [ ] มี 2 ข้อที่ขัดกันไหม

**ความครบของหมวด**

- [ ] ครบทั้ง 11 หมวดในข้อ 5 ไหม (หรือเขียนไว้ว่าหมวดไหนไม่เกี่ยวเพราะอะไร)
- [ ] มีข้อกำหนดเรื่องสิทธิ์ผู้ใช้ไหม
- [ ] มีข้อกำหนดเรื่องการย้ายข้อมูลเดิมเข้าระบบใหม่ไหม
- [ ] มีข้อกำหนดเรื่องรายงานไหม (มักถูกลืม แล้วมาโผล่ตอนใกล้ส่ง)
- [ ] มีข้อกำหนดเรื่องการแจ้งเตือนไหม (อีเมล · LINE · ในระบบ)
- [ ] มีเกณฑ์การตรวจรับที่วัดได้ไหม

**เอกสาร**

- [ ] ทุกข้อมีที่มาในตารางสอบย้อนกลับไหม
- [ ] "ต้องมี" ไม่เกิน 60% ใช่ไหม
- [ ] มีประวัติการแก้ไขพร้อมเลขรุ่นไหม
- [ ] มีช่องเซ็นรับพร้อมชื่อและตำแหน่งจริงไหม
- [ ] อภิธานศัพท์ครอบคลุมทุกคำที่ใช้ในเล่มไหม


---

# skill: spell-out-abbreviations

Use when text is heavy with abbreviations or jargon

# Spell Out Abbreviations

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อ 1:** ตัวย่อทุกตัว เขียนเต็มครั้งแรก แล้ววงเล็บตัวย่อไว้ — หลังจากนั้นใช้ตัวย่อได้
> **กฎข้อ 2:** ศัพท์เฉพาะทุกคำ วงเล็บคำอธิบายสั้น ๆ ไว้ครั้งแรก — ผู้อ่านนอกสายจะได้ไม่ต้องเดา

## รูปแบบ

```
ถูก: Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
ผิด: MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **ครั้งแรกของแต่ละเอกสาร** เขียนเต็มแล้ววงเล็บตัวย่อ ครั้งต่อไปใช้ตัวย่อล้วน
- เอกสารยาวที่แบ่งบท ให้เขียนเต็มใหม่**ครั้งแรกของแต่ละบท** เพราะคนมักอ่านทีละบท
- ตารางหรือหัวข้อที่มีที่ไม่พอ ให้เขียนเต็มในบรรทัดแรกของส่วนนั้นแทน
- เอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป ต้องมี **อภิธานศัพท์ (glossary)** ท้ายเอกสาร

### เอกสารภาษาไทย

ครั้งแรกเขียน **ไทย (ชื่อเต็มอังกฤษ: ตัวย่อ)** เช่น ปัญญาประดิษฐ์ (Artificial Intelligence: AI) · ครั้งต่อไปใช้คำไทยหรือตัวย่อก็ได้ แต่ต้องเลือกแบบเดียวทั้งเอกสาร · กฎนี้เป็นที่เดียวที่กำหนดรูปแบบ `human-writing` `references/thai-grammar.md` หัวข้อ 5 แถว 4 ใช้ตามนี้

## ยกเว้น — ไม่ต้องขยาย

คำที่คนทั่วไปรู้จักมากกว่าชื่อเต็ม: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
และนามสกุลไฟล์ (`.docx`, `.pptx`) ถ้าไม่แน่ใจ **ให้ขยาย** เพราะขยายเกินไม่เสียหาย แต่คนอ่านไม่รู้เรื่องเสียหาย

## ศัพท์เฉพาะ — วงเล็บคำอธิบาย ไม่ใช่แค่ตัวย่อ

ขยายตัวย่อแล้วอาจยังไม่พอ ถ้าชื่อเต็มก็ยังไม่บอกอะไร **คำที่ผู้อ่านนอกสายไม่รู้จัก
ต้องมีคำอธิบายสั้นในวงเล็บครั้งแรก**

```
ผิด: ใช้ idempotency key กันงานซ้ำ
ถูก: ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

ผิด: ต้องดู cash flow ก่อนกู้
ถูก: ต้องดู cash flow (เงินเข้า-ออกจริงแต่ละเดือน) ก่อนกู้
```

**คำอธิบายต้องสั้นกว่า 1 บรรทัด** ถ้ายาวกว่านั้นให้แยกเป็นประโยคของตัวเอง

**วัดว่าคำไหนต้องอธิบาย** ด้วยคำถามเดียว — คนที่ทำงานคนละสายกับเรื่องนี้
อ่านแล้วเดาความหมายได้ไหม ถ้าเดาไม่ได้ก็ต้องอธิบาย

| ระดับผู้อ่าน | อธิบายแค่ไหน |
|---|---|
| ลูกค้า ผู้บริหาร คนนอกสาย | ศัพท์เทคนิคทุกคำ แม้แต่คำที่ช่างใช้กันทุกวัน |
| ทีมเดียวกันแต่คนละส่วนงาน | เฉพาะคำเฉพาะของส่วนนั้น เช่น ชื่อรูปแบบ ชื่อกระบวนการ |
| คนที่ทำเรื่องนี้อยู่แล้ว | เฉพาะคำที่เพิ่งตั้งขึ้นใหม่ในโปรเจกต์นี้ |

---

## ใช้กับอะไรบ้าง

เอกสารทุกชนิด · สไลด์ · ป้ายและข้อความบนหน้าจอ · ข้อความขายของ · คำอธิบายไดอะแกรม · คอมเมนต์ในโค้ด ·
คำตอบในแชต — **ทุกอย่างที่มีคนอ่าน**

## ตัวอย่างที่เจอบ่อย

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Key Performance Indicator (KPI) · Service Level Agreement (SLA) ·
Return on Investment (ROI) · Stock Keeping Unit (SKU) · Value Added Tax (VAT) ·
Cash on Delivery (COD) · Objectives and Key Results (OKR) ·
Personally Identifiable Information (PII) · Proof of Concept (POC)

ตัวย่อฝั่งโค้ด (RBAC · SSO · CI/CD · SRS · ADR ฯลฯ) → ส่วนเพิ่มใน plugin `software-development` → `superuser` → `references/code-extensions.md`

## Anti-patterns

- ขยายตัวย่อซ้ำทุกครั้งที่โผล่ — รกและกวนสายตา ครั้งแรกพอ
- วงเล็บกลับด้าน — `MCP (Model Context Protocol)` อ่านสะดุดกว่าเขียนเต็มขึ้นก่อน
- ขยายผิด — ถ้าไม่รู้ว่าย่อมาจากอะไร ให้ค้นก่อน อย่าเดา
- ขยายตัวย่อครบแต่ปล่อยศัพท์เฉพาะลอย — `Quadratic Weighted Kappa (QWK)` ยังไม่ช่วยใครถ้าไม่บอกว่าค่านี้วัดอะไร
- อธิบายยาวเป็นย่อหน้าในวงเล็บ — วงเล็บไว้ให้คำสั้น ๆ ถ้ายาวให้แยกประโยค
