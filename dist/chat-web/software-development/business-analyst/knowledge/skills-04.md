# skill: branded-document-design

Use when a Word, PowerPoint or PDF must look designed

# Branded Document Design — .docx / .pptx / .pdf that looks intentionally designed

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live for reference designs → 3 genuinely different directions → check `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-references` (plugin `superuser`) even when a brand exists (the brand controls color and fonts; the search is for this piece's structure) · close the job with the line `ด่านก่อนลงมือ:`

> **One rule:** an exported document has one color set, and one set of type sizes and spacing that is the same on every page. It must not look like someone opened Word and just typed.

## Use when
- The output is a .docx / .pptx / .pdf (quotation · business plan · report · contract · SRS) that a customer, executive, or another team will open, or that must be signed off or attached to a contract
- Mixed Thai–English documents (they break easily if fonts are not fully set)
- The same kind of document is issued repeatedly and every copy should look the same
- Not for: markdown output → `polished-document-style` · reading or extracting a received Office file → `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf` · diagrams in markdown → `markdown-visuals` · a whole-book report from one Markdown file → `markdown-report-docx`

Order: write the content as markdown first (`polished-document-style`), then render it with this skill. Always fix content in the markdown (the source).

Install before use: `pip install python-docx python-pptx` · LibreOffice (`soffice`) to convert to PDF · `pdftoppm` (poppler) to convert to images.

## Steps
1. **Colors.** If the source markdown has a `doc-theme`, use it: do not ask, do not set a new one (`polished-document-style`, "ธีมของเอกสาร"). Otherwise look in the order in `diagram-figures` item 5 (`doc-theme` → brand colors in code, logo, brand kit → nothing). If there is nothing, search live for reference designs per `design-references` (plugin `superuser`), type `document`, then extract colors from the chosen work (stored palette library when live search is impossible). If live search is impossible, use the house color `#2A78D6`, write `(รอยืนยัน)` in the report, and carry on without asking; put a tone suggested by the content in the report for the user to choose later ([`references/palette-examples.md`](references/palette-examples.md)). A customer's brand colors always win. Write the colors back into `doc-theme` in the markdown so document, figures, and slides match.
   - **One main color.** All light and dark shades are computed from it. Only the status colors (success · warning · error) are independent and keep their meaning.
2. **Continue the look of the brand or app, before the first render.** The skill's defaults (Tahoma · solid color band cover · lines in every table cell) are the floor, not the deliverable look.
   - Is there an identity already? Check the brand kit (`graphic-design:brand-kit`), `assets/logo/`, `docs/design/`, a mockup that passed the beauty gate (score in `docs/BUILD-PLAN.md`), field `doc-theme` in `docs/README.md`. If yes, use the same logo (cover + page header), colors, and patterns as the app. If no, follow step 1.
   - Do 1 direction first. Only if the user is not wowed or asks for several, do 3 directions, have 2 outside reviewers score them, and run the document beauty gate (`ด่านสวย`, ceiling 3 rounds, record every score in `docs/BUILD-PLAN.md`): [`references/identity-and-gate.md`](references/identity-and-gate.md).
   - Work on the render script, not on .docx files one by one; render every copy.
   - **Fonts:** the brand's Thai font installed and embedded (`embed_fonts`) · Tahoma when embedding is impossible · never set Thai text in a mono font (no Thai letters in Cascadia/Consolas); mono is for code, keys, and numbers.
   - Figures in documents, beauty-gate rules, cover: [`references/word-layout.md`](references/word-layout.md), section at the end.
3. **Cover for this document set.** If the default cover looks like another job's, do 1 direction first; only if the user is not wowed or asks for several, run the 3-direction, 2-of-3 vote in [`references/cover-vote.md`](references/cover-vote.md).
4. **Tokens, never hardcode colors outside them.** `brand` · `brand_2` · `brand_deep` · `brand_tint` · `brand_tint_2` · `text` · `text_body` · `text_muted` · `line` + 6 status colors (success · info · warning · error · accent · neutral) that do not change with the brand. Set the values once with `use_brand(...)`.
   - Choose colors by meaning (red = danger/real error only); same meaning set as diagrams.
   - Contrast: body text and `text_muted` on the background ≥ 4.5:1 · H2 and table headers (`brand_deep`) ≥ 7:1 · H1 and KPI numbers (`brand`, large) ≥ 3:1 · `use_brand()` stops if it fails · in black and white the hierarchy must still read · if it fails, adjust darkness, not the color.
   - Text is never pure black (use `text_body`) · no type size outside the scale (Word body 11pt · slides 17pt).
   - Full token table, color meanings, type scale, elements: [`references/tokens-and-type.md`](references/tokens-and-type.md).
5. **Fonts and Thai.** Word treats Thai as a complex script: never set font/size/bold by hand; use `style_run()` in `brandkit.py` (sets `w:szCs` `w:bCs` `w:iCs` and all 4 slots of `w:rFonts`). If Latin and Thai fonts differ, set `bk.FONT` and `bk.LATIN_FONT`, then call `bk.thai_runs(doc.element.body)` and on every header/footer before `save()`. Line spacing 1.3–1.35 (Tahoma) · never justify Thai paragraphs · to send a PDF, export from real Word or check by eye (LibreOffice breaks Thai differently) · Linux has no Tahoma, use Loma/Sarabun · ReportLab places tone marks wrongly. Traps and embedding: [`references/thai-fonts.md`](references/thai-fonts.md).
6. **Word page structure.** Cover (project logo and mockup exist → project-specific cover per step 3; else the default) → table of contents → body (H1 numbered, keep-with-next on headings) → sign-off table · footer "หน้า N" centered, gray 9pt · A4, content width 17 cm = 9638 twips (`BODY_TWIPS`) so column widths add up. Full structure and dark cover (`doc.cover(..., style="night")`): [`references/word-layout.md`](references/word-layout.md).
   - Cover background image and logo never go in the first-page header (Word shows them faded); anchor them to the cover's first paragraph. Inner-page table headers never use a full-width solid dark fill.
7. **Use the elements** `cover()` · `table()` · `pill_table()` · `kpi_row()` · `callout()` · `figure()` · `code()` · `signoff()` (methods in `references/tokens-and-type.md`). At most 3–5 callouts per 10 pages · KPI strip of 3–5 cells · a table over 6 columns goes on a landscape page (`landscape_section()`).
8. **Use brandkit.** `from brandkit import BrandDoc, use_brand, to_pdf` (put `scripts/` on the path) · slides → `brandkit_pptx.BrandDeck` · speaking deck → `brandkit_stage.StageDeck` (default: `accent`/`bg` from the source work per `presentation-design` `references/deck-theme.md`, `source_palette.py` prints the `StageDeck(...)` line; light `FFFFFF` with `block=True`, dark only if the source is dark; no color at all → `#2A78D6` on `FFFFFF` + `(รอยืนยัน)`). Sample code and methods: [`references/brandkit-usage.md`](references/brandkit-usage.md), `references/api.md`.
9. **Look at every page before delivery.** Render to PDF, convert to images, open each page (Read tool): the code cannot show tables overflowing the margin, stranded headings, floating tone marks. Commands and the 7-point checklist: [`references/visual-check.md`](references/visual-check.md).
10. Before sending, go through item 3 of `no-ai-look` (HTML work: run its script; the eye gate 3.2 must also pass, web pages answer items 10–14).

## Check before done
- Avoid: Word's built-in Heading styles (use `h1()/h2()/h3()`) · thick black default table lines (use 0.5pt `line`) · pure black text · bold table headers with no fill · letting Word choose column widths (`fixed_widths()`) · too many emoji · a file never rendered for a look · the skill's default look when the app already has an identity · a 2000px-wide figure on a 17 cm page (text ends near 5pt) · a decorative cover image nobody said wows · a .docx without the source markdown. Reasons: [`references/anti-patterns.md`](references/anti-patterns.md)
- Every page was opened and looked at · colors written back to `doc-theme` · the line `ด่านก่อนลงมือ:` closes the job

## References
- [`references/tokens-and-type.md`](references/tokens-and-type.md) — open when setting the theme or choosing sizes, colors, elements · [`references/palette-examples.md`](references/palette-examples.md) — fallback tones by kind of work
- [`references/thai-fonts.md`](references/thai-fonts.md) — open when setting fonts or a PDF looks off
- [`references/word-layout.md`](references/word-layout.md) — open for page structure, dark cover, figure rules
- [`references/identity-and-gate.md`](references/identity-and-gate.md) — open when running several directions or the beauty gate · [`references/cover-vote.md`](references/cover-vote.md) — the 3-direction cover vote
- [`references/brandkit-usage.md`](references/brandkit-usage.md) · [`references/api.md`](references/api.md) — open when writing the build script
- [`references/visual-check.md`](references/visual-check.md) — open when rendering for the eye check · [`references/anti-patterns.md`](references/anti-patterns.md) — open when reviewing
- Linked skills: slide story → `presentation-design` · SRS → `srs-writing` · diagrams → `diagram-figures` / `software-diagrams` · brand → `graphic-design` · .html deck → `html-slide-deck`


## reference: anti-patterns.md

# Anti-patterns — reasons and what to use instead

The short headings are in `SKILL.md`.

- **Using Word's built-in Heading styles** — they override the colors you set. Use `h1()/h2()/h3()`,
  which set `outlineLvl` themselves, so the table of contents (TOC) still shows the headings.
- **Thick black default table borders** — the document looks dated at once. Use lines in the `line` color at 0.5pt between rows (under the header row is the 1.5pt brand line).
- **Pure black text** — use `text_body`, a dark gray. The body text becomes much softer.
- **Bold table headers with no fill color** — when a table spans pages, readers cannot tell where it starts.
- **Letting Word work out column widths** — always call `fixed_widths()`.
  Otherwise the code column ends up as wide as the detail column.
- **Too many emoji** — 1 per callout is enough. Do not put one in every heading.
- **Sending the file without ever rendering it** — see item 6.
- **Creating the .docx without keeping the source markdown** — you cannot edit it next time.


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


## reference: identity-and-gate.md

# Identity continuation and the document beauty gate · branded-document-design

Open this when the user is not wowed by the first direction, asks for several directions, or the job needs the document beauty gate (`ด่านสวย`). Moved from SKILL.md item 0.1, steps 2–4.

2. **Do 1 direction first.** Only if the user is not wowed, or asks for several directions, do **3 directions in parallel** (3–5 times the labor · `parallel-attempts-pick-best` · a new agent with Bash per direction · for the cover use the 3-direction vote method in [`cover-vote.md`](cover-vote.md)). Each direction makes an HTML mock of A4 pages: cover · a content page with a real 4-row requirements table + callout · a table-of-contents page or a figure page · **1 figure redone for the direction** (use `diagram-figures`) · the file header says how to build each piece in real Word. When doing several directions they must really differ, for example a dark cover continuing from the app / a light editorial report / an engineering spec.
3. **2 reviewers who did not do the work** (if there is only one direction, score that one only; no mixing) score 1–5 (pass = 4): first impression · continuity with the app · craftsmanship (a long Thai table of 60 rows without breaking mid-word · type scale · contrast) · figures readable when placed for real · really buildable in Word → **mixing is allowed** (cover from one direction, body from another) if the reviewers name the pieces clearly.
4. Work on the render script (do not edit .docx files one by one) → render every copy → **document beauty gate (`ด่านสวย`)**: 2 new reviewers look at images of the real pages (cover · table of contents · chapter opener · long table page · figure page) using the 5 axes above, and take the lower score · ceiling **3 rounds** (more detail in `ui-craft/references/states-and-checks.md` in plugin `software-development` if installed) · record every round's score in `docs/BUILD-PLAN.md`


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

# Design tokens · type scale · reusable elements

Contents: tokens → color meanings → type scale → reusable elements

This table sets the **job** of each token, not the color value.
The real values come from item 0, then you set them once with `use_brand(...)`.

| Token | Job | Comes from |
|-------|---------|----------|
| `brand` | H1 headings · KPI numbers · accent bars · links (if `brand` is below 4.5:1 on a white background, use `brand_deep` for links) | The brand color (none → the house default + `(รอยืนยัน)` (awaiting confirmation)) |
| `brand_2` | Secondary accent · underline under slide headings · end of a gradient | A neighbor of the main color on the color wheel |
| `brand_deep` | H2 headings · table header text | The main color mixed with black, giving contrast ≥ 7:1 on white |
| `brand_tint` | Table header fill · KPI cards · cover background | The main color mixed with white, about 90% |
| `brand_tint_2` | Alternating (zebra) rows in long tables | The main color mixed with white, about 96% |
| `text` | H3 headings · emphasized text | A dark gray tinted toward the main color |
| `text_body` | All body text | A dark gray 1 step lighter than `text`. **Not pure black, because pure black tires the eyes** |
| `text_muted` | Figure captions · meta · footer | A mid gray with contrast ≥ 4.5:1 on white and on `brand_tint` |
| `line` | Table lines, dividers | A very light gray, visible but not competing for attention |

**6 status colors** (each has a fill color and a text color as a pair): success · info · warning · error · highlight · neutral
Status colors **do not change with the brand**, because green means pass and red means fail in every document.
The fill is a very light shade and the text is a dark shade of the same color, giving contrast ≥ 4.5:1.

**What each color means — always choose a color by its meaning** (the same for documents and diagrams)

| Color | Means | Used for (callout / pill / box / line in a figure) |
|---|---|---|
| Red | Danger · forbidden · delete · error · overdue | `critical` · status "stuck/failed" · a step that destroys data · a broken line |
| Yellow/orange | Caution · waiting for action · caveat · a path that is not the main line | `warning` · status "in progress" · exception zone/line (`#C77A11`) |
| Green | Success · pass · safe · done | `success` · status "done" · a confirmed result |
| Main color (the brand color; with no brand, the house blue) | Information · main action · normal path | `tip` · primary button · box/line of the main path |
| Purple | Question · option · side note | `question` · optional extras |
| Gray | Neutral · disabled · external | `note` · external system · a part that is switched off |

The one rule: **choose a color by meaning, not by looks.** Do not use red just to stand out. Use red only when something is truly dangerous or wrong. Diagrams use this same set of meanings too (see `software-diagrams` · `diagram-figures`, which has the orange `EXCEPT_HUE` for paths that leave the main line).

> **Thresholds every color set must pass:** body text and `text_muted` on the background ≥ 4.5:1 · H2 and table headers (`brand_deep`) ≥ 7:1 ·
> H1 and KPI numbers (`brand` in large size, per the WCAG 2.2 large-text definition, criterion 1.4.3) ≥ 3:1 ·
> printed in black and white, the hierarchy must still be distinguishable. If a set fails, adjust the intensity and do not change the color.
>
> **A color set that was really used** (not a standard value; do not copy it without looking at the content of the work) → `references/palette-examples.md`

> **Change the whole brand in one line:**
> `use_brand(brand="C1121F", brand_deep="780000", brand_tint="FDECEC")`

## Type scale (pt)

| Level | Word | Slide | Weight · color |
|-------|------|-------|--------------|
| Cover title | 20 | 40 | bold · `brand` (Word) / `brand_deep` (slides) |
| H1 | 16 | 26 | bold · `brand` |
| H2 | 12.5 | — | bold · `brand_deep` |
| H3 | 11.5 | — | bold · `text` |
| Body | 11 | 17 | regular · `text_body` |
| Table | 11 | 12.5 | regular · `text_body` |
| Caption/footer | 8.5–9 | 10–12 | italic or regular · `text_muted` |

**Do not add sizes outside this scale.** Every extra size makes the document look inconsistent, and readers notice.

## Reusable elements (from item 4)

| Element | Look | Method |
|-----------|--------|-------|
| Cover page | Logo + title in the brand color, centered on the page | `cover()` |
| Table | Header fill `brand_tint` with `brand_deep` text · 1.5pt brand line under the header row · `line` 0.5pt between rows · header repeats on every page | `table()` |
| Status table | The status column is tinted by value | `pill_table()` |
| Summary figure strip | Cards with `brand_tint` fill, a big number in the brand color + a small gray label | `kpi_row()` |
| Text box | Light fill + a thick colored bar on the left + 1 emoji | `callout()` |
| Figure with caption | Figure centered on the page + "รูปที่ N — ..." in gray italic under the figure | `figure()` |
| Code block | Light gray fill, Consolas 9pt font | `code()` |
| Sign-off table | Role / name / signature / date | `signoff()` |

**Good proportions:** no more than 3–5 callouts per 10 pages · a summary figure strip (KPI strip) of 3–5 cells (from 6 cells on, the numbers get too small to stand out) ·
a table with more than 6 columns should move to a landscape page (`landscape_section()`).


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

# SRS Writing — a Software Requirements Specification where every requirement can be tested

> **One rule:** every requirement must let you write a **test case** from it right away. If you cannot, it is not a requirement, just a hope.

## Use when
- Writing a Software Requirements Specification (SRS)
- Reviewing an SRS someone else wrote, before sign-off
- Turning meeting notes into usable requirements
- Preparing documents for a tender or statement of work (SOW)

Not for: user stories → `user-story-writer` · why a technology was chosen → `adr-writer` · screen-level spec → `fsd-writing` · look of the Word file → `branded-document-design`

## Steps
1. **Find an existing format first.** Look for the client's TOR (Terms of Reference), the scope in the contract, the agency's forms, and the earlier SRS of the same system in `docs/`. If none is in files, ask the user one question: does the client require a document format? If found, use its headings, order, field names and running numbers, and say which file it came from. If not found, use this skill's template and say no earlier format was found. In every format: a small internal system drops sections with nothing in them; a system with legal rules or an inspector uses everything the TOR orders; testable requirement IDs are always needed.
2. Collect before writing: who uses it · how work is done now · the problem · how success is measured · systems to connect · legal obligations.
3. Draft the outline from `assets/srs-outline.md` (headings only). Declare one line at the top saying which section is `เขียน` · `ข้าม (เหตุผล)` · `ตัดออก`. Do not fill a slot just because the template has it.
4. Write scope and stakeholders before requirements. Section 1.2 Scope must have both "in scope" and "out of scope".
5. Write each requirement by "Requirement rules" below and assign its ID at once.
6. Write non-functional requirements (NFRs) by "NFR rules" below.
7. Build the traceability tables. This is the step people skip most, and it is what gives value when a change request arrives.
8. Add figures. Figures in the SRS itself use `diagram-figures`; quick figures outside the SRS (README · PR) use `software-diagrams`. One colour theme per document, declared at the top per `polished-document-style`.
9. Run the review, then send.

## Structure
Based on ISO/IEC/IEEE 29148. Sections: 1 Introduction · purpose · scope · definitions · 2 System overview · users · constraints · assumptions · 3 Functional requirements · 4 Interface requirements (skip only if it connects to nothing) · 5 Non-functional requirements · 6 Data and business rules · 7 Acceptance criteria · 8 Traceability matrix · 9 Appendices · revision history. All others cannot be skipped. A glossary goes in 1.3: Thai term · English term · meaning · name in the system.

## Requirement rules
- Mandatory words: **ต้อง** (shall) = mandatory, fails acceptance if missing · **ควร** (should) = may be absent if the reason is recorded · **อาจ** (may) = optional. Do not mix "ต้อง" and "จะ"; pick one for the whole document.
- Sentence form: `<รหัส> · <ผู้กระทำ> ต้อง <ทำอะไร> <เงื่อนไข/ขีดจำกัดที่วัดได้>`
  - ผิด: ระบบต้องค้นหาได้เร็ว
  - ถูก: FR-SRCH-010 · ระบบต้องคืนผลการค้นหาคำสั่งซื้อภายใน 2 วินาที เมื่อฐานข้อมูลมีคำสั่งซื้อไม่เกิน 500,000 รายการ
- 1 requirement per item. If you see "และ" (and), suspect it should be split.
- Always name the actor (ระบบ · ผู้อนุมัติ · งานตามเวลา). No sentence without a subject.
- Numbers instead of adjectives ("fast" "many" "easy" "stable" each become a number).
- State what must be obtained, not how (`ต้องเก็บใน Redis` is wrong · `ต้องคืนผลภายใน 200ms` is right).
- No "เป็นต้น" · "ฯลฯ" · "และ/หรือ".
- Every item must show at once how to prove it passes. After writing, look for items that contradict each other.

## IDs and traceability
- ID scheme: `FR-<โมดูล>-<3 หลัก>` (FR-ORD-010) · `NFR-<หมวด>-<3 หลัก>` (NFR-PERF-010) · `BR-<3 หลัก>` business rule (BR-020) · `IF-<ระบบปลายทาง>-<เลข>` interface (IF-LINE-010). Number in steps of 10.
- Never reuse an issued ID. Mark a cancelled item in place, such as `(ยกเลิก v1.3)`; do not delete it.
- Traceability table columns: รหัส · ที่มา · โมดูล · ความสำคัญ · ทดสอบด้วย · สถานะ (for example `FR-ORD-010 | ประชุม 12 ส.ค. ข้อ 3 | คำสั่งซื้อ | ต้องมี | TC-ORD-001..004 | ตกลงแล้ว`).
- Every requirement has a source (an item with none was made up by the team; go ask) and at least 1 test case.
- Priority is MoSCoW: ต้องมี · ควรมี · มีก็ดี · ไว้ทีหลัง. If "ต้องมี" exceeds 60% of the total, the items are not really prioritised.
- The BR table gets a column "boundary values to test": for a rule with a number, write 3 values (below · at · over the boundary), and put the boundary numbers into a story's acceptance criteria too (for example ฿9,999 and ฿10,000).
- Two-way traceability: at the end add a table story | FR | BR. Pass rule "nothing dropped": every story is backed by an FR or BR; mark and fix any that is not before sending.

## NFR rules
- Ask every category in [`references/nfr-categories.md`](references/nfr-categories.md); forgotten maintenance and backup hurt most.
- Every number comes from the customer, not the writer. If the customer does not know, propose a number and record it as an assumption in section 2.
- Never guess silently a fact the interviewee did not state (service time or price · whether discounts stack · travel cost per vehicle or per person). Flag the item "(รอยืนยัน)", write the assumption used with the source question number, and summarise at the end of the document in a table: question → assumption → business rule that uses it.
- Every NFR has a "how to measure" column (for example `scrollWidth ≤ 375` · requests sending images off the device = 0).

## Check before done
- Go through [`references/review-checklist.md`](references/review-checklist.md) in full before every send.
- Fresh-reader test: a new agent that gets only the SRS file answers 8–10 questions a developer and QA would ask. A wrong or "don't know" answer is a point to fix. If it has not passed, do not send to the customer (see `references/reader-test.md`).
- No "out of scope" list missing · not every item "Must" · no vague word left · IDs unique · version number and revision history present.

## References
- [`references/structure-options.md`](references/structure-options.md) — open when choosing sections by project type, writing 2.6 or 3.6 (AI/ML), adding figures, or writing a Thai/English document
- [`references/nfr-categories.md`](references/nfr-categories.md) — open when writing section 5 or converting a vague customer word into a number
- [`references/brd-template.md`](references/brd-template.md) — open when writing the Business Requirements Document before the SRS
- [`references/reader-test.md`](references/reader-test.md) — open when running the fresh-reader test


## reference: brd-template.md

# BRD template — stakeholder version (Mode B)

Business Requirements Document (BRD) template, the version sent to stakeholders, for the agent `business-analyst` · format it following `polished-document-style`

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


## reference: nfr-categories.md

# NFR categories and vague-word conversion

Open this when writing section 5 (non-functional requirements) or when a customer's wording is vague.

## How to convert vague words

| Customer says | Ask back | Write down |
|---|---|---|
| "ต้องเร็ว" (must be fast) | How fast, measured where, with how many users | Return results within 2 seconds at the 95th percentile with 200 concurrent users |
| "ใช้ง่าย" (easy to use) | What must a new user be able to do, in how long, without training | A new user creates their first order within 5 minutes without opening the manual |
| "ปลอดภัย" (secure) | Against whom, what must they be unable to do | A user with the "viewer" role must be unable to call an API that changes data, and gets code 403 |
| "รองรับคนเยอะ" (supports many people) | How many at once, which period is heaviest | Supports 500 concurrent users during month-end closing |
| "รายงานครบ" (complete reports) | Which reports, who views them, how often | List them item by item, one report per item |

## NFR categories to ask about every time

The categories that hurt most when forgotten are **maintainability** and **backup**: nobody asks at contract signing, but everyone asks when the system goes down.

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

NFR testability from the requirements stage (reported from a training exercise, not measured for effect): the AI part uses fixed rules (same question, same answer) · a button to reset test data · the system's "today" date can be locked · every button has a label so tools can find it.


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

# SRS completeness review

Use with `srs-writing` section 8. Go through all of it before every send. "Section 5" means the chapter of non-functional requirements in `SKILL.md`.

**Scope**

- [ ] Is there an "ไม่อยู่ในขอบเขต" (out of scope) list?
- [ ] Are the assumptions written down clearly, and who must confirm each one?
- [ ] Are all the other systems to connect to listed, and who owns each one?

**Individual requirements**

- [ ] Does every requirement have an id?
- [ ] Can a test case be written for every requirement?
- [ ] Are any of the words "เร็ว" (fast) "ง่าย" (easy) "เหมาะสม" (suitable) "เสถียร" (stable) "ยืดหยุ่น" (flexible) left over?
- [ ] Are any of "เป็นต้น" (and so on) "ฯลฯ" (etc.) "และ/หรือ" (and/or) left over?
- [ ] Does any requirement state a way of doing it instead of the result?
- [ ] Do any 2 requirements conflict?

**Chapter coverage**

- [ ] Are all 11 chapters in section 5 present (or does the document say which chapter does not apply and why)?
- [ ] Is there a requirement on user permissions?
- [ ] Is there a requirement on migrating old data into the new system?
- [ ] Is there a requirement on reports? (Often forgotten, then it pops up near delivery.)
- [ ] Is there a requirement on notifications? (email · LINE · in-system)
- [ ] Are there acceptance criteria that can be measured?

**Document**

- [ ] Does every requirement have a source in the traceability table?
- [ ] Is "must have" no more than 60%?
- [ ] Is there a revision history with version numbers?
- [ ] Is there a sign-off box with real names and positions?
- [ ] Does the glossary cover every term used in the document?


## reference: structure-options.md

# SRS structure options, figures, bilingual rules

Open this when choosing which sections to write, adding figures, or writing a Thai/English document.

Structure is based on ISO/IEC/IEEE 29148. The full outline with hints per section is in `assets/srs-outline.md`. For the Business Requirements Document (BRD), written before the SRS, use [`brd-template.md`](brd-template.md).

## Two subsections ISO 29148 has that people forget

(Idea from jam01/SRS-Template, which states no licence, so this is rewritten in our own words.)

| Subsection | What to put in | When it is needed |
|---|---|---|
| 2.6 Apportioning of requirements | A table of which release · milestone or subsystem each group of requirements goes to, and which items are **deferred to a later round**. For an item whose destination is not yet known, write "not yet apportioned" and track it as a pending task | More than 1 release or 1 team · matches the `milestone` column of `spec-to-code-loop` |
| 3.6 Systems with AI/ML | 6 items: what the model does and which number measures a pass · where training data comes from, who consented, how it is stored · guardrails (check input · filter output · limit the actions it can take · fallback) · fairness and explainability · points where a person must check before it takes effect · release, monitoring, retraining, and retiring the model | Every system that calls an LLM or has a model; write it together with `llm-engineering` and `pdpa-compliance` |

## Choosing sections by project

| Project | Write in addition to core 1 2 3 5 6 7 8 9 | Can drop |
|---|---|---|
| Internal web or app, no other systems | none | 4 interface · 2.6 · 3.6 |
| Connects to an external API or device | 4 interface (both sides) | 3.6 |
| Multiple releases or teams | 2.6 | 3.6 if no AI |
| Has an LLM or model | 3.6 + the security and personal-data categories in 5 | none |
| Regulated work (finance · health · insurance) | The compliance category in 5 as its own section, citing the law with the date checked | none |

## Figures

An SRS with no figures makes each reader imagine a different picture.

| Which figure | Draw with |
|---|---|
| Every figure in the SRS itself (overview · flowchart · sequence · ER · state), whether delivered as markdown, .docx or PDF | `diagram-figures` (sharp image files, placement under your own control, source files kept in the repo so git can track them) |
| Quick figures in a README · PR · code note, outside the SRS | `software-diagrams` (Mermaid) |

Every figure in one document uses the same colour theme. Declare the theme at the top per `polished-document-style` section "ธีมของเอกสาร" (Document theme); every tool reads values from that one place.

Minimum figures:

| Section | Figure |
|---|---|
| 2 System overview | C4 level 1 (who the system talks to) |
| 2 Users | Table of roles and permissions |
| 3 Functional requirements | Work-flow chart of the main process |
| 3 Complex processes | Sequence diagram |
| 6 Data | ER diagram + state diagram of the main document |

## Bilingual documents

- Choose 1 main language and put the other in brackets or a 2nd column; never switch back and forth.
- First time a technical term appears, write Thai (full English name: abbreviation), for example ปัญญาประดิษฐ์ (Artificial Intelligence: AI), per the rule "เอกสารภาษาไทย" in `spell-out-abbreviations`. Afterwards use the Thai or the abbreviation, one way through the document.
- Thai text: `human-writing` `references/thai-grammar.md` section 4, the business register.
- Field names, API names, and status names in the database are always English even if the document is Thai; otherwise people translate them differently when writing code.
- Complete the glossary in section 1.3: Thai term · English term · meaning · name in the system.
- Fonts and page layout of the Word file: `branded-document-design`.

## Anti-patterns

- Pasting meeting notes in as requirements (different form, different level of detail).
- Putting already-designed screens into the SRS (screen sketches belong in the FSD).
- Non-functional requirements written together as one paragraph; split into items with IDs.
- No version number and revision history.
- Sending a Word file with the default look (see `branded-document-design`).
- Every item "Must", no "out of scope" section, vague items, invented numbers, reused IDs: covered by the rules in `SKILL.md`.

## Other skills to use together

`polished-document-style` (markdown while drafting) · `fsd-writing` (detail a developer can start from) · `user-story-writer` (break into stories) · `test-case-template` (turn requirements into test cases) · `simplicity-first` (cut unneeded content) · `presentation-design` (present to executives).


---

# skill: spell-out-abbreviations

Use when text is heavy with abbreviations or jargon

# Spell Out Abbreviations

> **Rule 1:** write every abbreviation in full the first time, with the abbreviation in brackets. After that you may use the abbreviation.
> **Rule 2:** put a short explanation in brackets the first time you use any technical term, so readers from outside the field do not have to guess.

## Format

```
ถูก: Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
ผิด: MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **The first time in each document**, write it in full with the abbreviation in brackets. After that, use the bare abbreviation.
- In a long document split into chapters, write it in full again **the first time in each chapter**, because people often read one chapter at a time.
- If a table or heading has no room, write it in full on the first line of that section instead.
- A document with 5 or more abbreviations must have a **glossary** at the end.

### Thai documents

The first time, write **Thai (English full name: abbreviation)**, for example ปัญญาประดิษฐ์ (Artificial Intelligence: AI). After that, use either the Thai word or the abbreviation, but pick one style for the whole document. This rule is the only place that sets the format. `human-writing` `references/thai-grammar.md` section 5 row 4 follows it.

## Exceptions — no need to expand

Terms the public knows better than the full name: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
and file extensions (`.docx`, `.pptx`). If you are not sure, **expand it**, because expanding too much does no harm, but a reader who does not understand does.

## Technical terms — explain in brackets, not just the abbreviation

Expanding the abbreviation may not be enough if the full name still says nothing. **A term that an outside reader does not know
needs a short explanation in brackets the first time.**

```
ผิด: ใช้ idempotency key กันงานซ้ำ
ถูก: ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

ผิด: ต้องดู cash flow ก่อนกู้
ถูก: ต้องดู cash flow (เงินเข้า-ออกจริงแต่ละเดือน) ก่อนกู้
```

**The explanation must be shorter than 1 line.** If it is longer, make it a sentence of its own.

**Decide which terms need explaining** with one question: could a person who works in a different field from this topic
read it and guess the meaning? If they cannot guess, explain it.

| Reader level | How much to explain |
|---|---|
| Customers, executives, people outside the field | Every technical term, even words engineers use every day |
| The same team but a different area of work | Only the terms specific to that area, such as names of formats and processes |
| People already working on this | Only terms newly coined in this project |

---

## What it applies to

Every kind of document · slides · labels and on-screen text · sales copy · diagram descriptions · code comments ·
chat answers — **anything a person reads**

Code-side abbreviations (RBAC · SSO · CI/CD · SRS · ADR and so on) → the extension in plugin `software-development` → `superuser` → `references/code-extensions.md`

## Anti-patterns

- Expanding the abbreviation every time it appears — cluttered and distracting. The first time is enough.
- Reversed brackets — `MCP (Model Context Protocol)` reads less smoothly than writing the full name first.
- Expanding wrongly — if you do not know what it stands for, look it up first. Do not guess.
- Expanding every abbreviation but leaving technical terms unexplained — `Quadratic Weighted Kappa (QWK)` still helps no one unless you say what the value measures.
- A paragraph-long explanation in brackets — brackets are for short words. If it is long, split it into sentences.
