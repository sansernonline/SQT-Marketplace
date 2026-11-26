# skill: branded-document-design

Use when a Word, PowerPoint or PDF or its cover must look designed

# Branded Document Design — .docx / .pptx / .pdf that looks intentionally designed

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live for reference designs → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls color and fonts; the search is for this piece's structure) · close the job with the line `ด่านก่อนลงมือ:`

> **One rule:** an exported document has one color set, and one set of type sizes and spacing that is the same on every page. It must not look like someone opened Word and just typed.

## Use when
- The output is a .docx / .pptx / .pdf (quotation · business plan · report · contract · SRS) that a customer, executive, or another team will open, or that must be signed off or attached to a contract
- A document set needs its own cover from the logo shape or a real mockup, or covers look alike across projects → step 3 and `references/cover-design.md`
- Mixed Thai–English documents (they break easily if fonts are not fully set)
- The same kind of document is issued repeatedly and every copy should look the same
- Not for: markdown output → `design-gate/polished-document-style` · reading or extracting a received Office file → `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf` · diagrams in markdown → `markdown-visuals` · a whole-book report from one Markdown file → `markdown-report-docx`

Order: write the content as markdown first (`design-gate/polished-document-style`), then render it with this skill. Always fix content in the markdown (the source).

Install before use: `pip install python-docx python-pptx` · LibreOffice (`soffice`) to convert to PDF · `pdftoppm` (poppler) to convert to images.

## Steps
1. **Colors.** If the source markdown has a `doc-theme`, use it: do not ask, do not set a new one (`design-gate/polished-document-style`, "ธีมของเอกสาร"). Otherwise look in the order in `diagram-figures` item 5 (`doc-theme` → brand colors in code, logo, brand kit → nothing). If there is nothing, search live for reference designs per `design-gate/design-references` (plugin `superuser`), type `document`, then extract colors from the chosen work (stored palette library when live search is impossible). If live search is impossible, use the house color `#2A78D6`, write `(รอยืนยัน)` in the report, and carry on without asking; put a tone suggested by the content in the report for the user to choose later ([`references/palette-examples.md`](references/palette-examples.md)). A customer's brand colors always win. Write the colors back into `doc-theme` in the markdown so document, figures, and slides match.
   - **One main color.** All light and dark shades are computed from it. Only the status colors (success · warning · error) are independent and keep their meaning.
2. **Continue the look of the brand or app, before the first render.** The skill's defaults (Tahoma · solid color band cover · lines in every table cell) are the floor, not the deliverable look.
   - Is there an identity already? Check the brand kit (`graphic-design:brand-kit`), `assets/logo/`, `docs/design/`, a mockup that passed the beauty gate (score in `docs/BUILD-PLAN.md`), field `doc-theme` in `docs/README.md`. If yes, use the same logo (cover + page header), colors, and patterns as the app. If no, follow step 1.
   - Do 1 direction first. Only if the user is not wowed or asks for several, do 3 directions, have 2 outside reviewers score them, and run the document beauty gate (`ด่านสวย`, ceiling 3 rounds, record every score in `docs/BUILD-PLAN.md`): [`references/identity-and-gate.md`](references/identity-and-gate.md).
   - Work on the render script, not on .docx files one by one; render every copy.
   - **Fonts:** the brand's Thai font installed and embedded (`embed_fonts`) · Tahoma when embedding is impossible · never set Thai text in a mono font (no Thai letters in Cascadia/Consolas); mono is for code, keys, and numbers.
   - Figures in documents, beauty-gate rules, cover: [`references/word-layout.md`](references/word-layout.md), section at the end.
3. **Cover for this document set.** For a software document set (BRD · SRS · FSD · ARCH) whose cover must come from the logo shape or a real mockup, follow [`references/cover-design.md`](references/cover-design.md) (page system · registry · checks · cover engine `scripts/cover-engine/`). If the default cover looks like another job's, do 1 direction first; only if the user is not wowed or asks for several, run the 3-direction, 2-of-3 vote in [`references/cover-vote.md`](references/cover-vote.md).
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
10. Before sending, go through item 3 of `design-gate/no-ai-look` (HTML work: run its script; the eye gate 3.2 must also pass, web pages answer items 10–14).

**Hard rules (covers):**
- A project cover shows its project by logo shape or a real screen at a glance, not by colour alone.
- Never draw a fake UI on a cover. Use a real mockup screenshot. No logo or mockup yet: stop and make the logo first.
- Ask before creating or editing files outside the project (e.g. `cover-registry.md`).
- Install fonts only after asking, and only with `COVER_INSTALL_FONTS=1`.

## Check before done
- Avoid: Word's built-in Heading styles (use `h1()/h2()/h3()`) · thick black default table lines (use 0.5pt `line`) · pure black text · bold table headers with no fill · letting Word choose column widths (`fixed_widths()`) · too many emoji · a file never rendered for a look · the skill's default look when the app already has an identity · a 2000px-wide figure on a 17 cm page (text ends near 5pt) · a decorative cover image nobody said wows · a .docx without the source markdown. Reasons: [`references/anti-patterns.md`](references/anti-patterns.md)
- Every page was opened and looked at · colors written back to `doc-theme` · the line `ด่านก่อนลงมือ:` closes the job

## References
- [`references/tokens-and-type.md`](references/tokens-and-type.md) — open when setting the theme or choosing sizes, colors, elements · [`references/palette-examples.md`](references/palette-examples.md) — fallback tones by kind of work
- [`references/thai-fonts.md`](references/thai-fonts.md) — open when setting fonts or a PDF looks off
- [`references/word-layout.md`](references/word-layout.md) — open for page structure, dark cover, figure rules
- [`references/cover-design.md`](references/cover-design.md) — open for a software document set's own cover (logo shapes or real screen) · with [`cover-real-examples.md`](references/cover-real-examples.md) · [`cover-structural-ideas.md`](references/cover-structural-ideas.md) · [`cover-word-build.md`](references/cover-word-build.md) · [`cover-bakeoff.md`](references/cover-bakeoff.md)
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


## reference: cover-bakeoff.md

# Make 3 styles, then vote 2 of 3

Used with `cover-design.md` step 7. It is a variant of `crew-patterns/parallel-attempts-pick-best` that swaps "1 middleman agent" for "3 reviewers who vote".
Cost: about 3–5 times the work of a single style. Use it when you set a project's look for the first time, not at every version bump.

## 1 · Prepare before launching

1. **Survey** (1 middleman agent, read-only) → `_to_delete/cover-lab/survey/SURVEY.md`: app description · main verbs · logo files · colors · fonts · main-screen images from the mockup · image of the current cover, page 1 (Word through COM, the Windows automation interface → PDF → `pdftoppm`) with critique.
2. **Research** (1 middleman agent, in parallel with step 1) → `research/RESEARCH.md`: good-looking tech-company covers · trends · cheap-looking things · image techniques done in code · Word limits · every claim has a URL.
3. **Same brief for every designer**, `BRIEF.md`. Every designer reads `EXAMPLES.md` and looks at the overview sheet of real covers first (`cover-real-examples.md`). Start from the cover builder that already builds in Word; do not rewrite it. The brief lists the deliverables (an SRS cover for every project · the image set for BRD/SRS/ARCH · at least 1 print cover · repeatable `src/` · `METHOD.md` ≤ 90 lines), the hard rules (items 3 and 9 of cover-design.md), and a ban on opening other designers' folders.
4. **The team lead keeps the voting criteria** and does not send them to designers (put them in the scratchpad, not in `cover-lab/`).

## 2 · 3 designers — they differ by style, not just by random draw

| Designer | Style (constraint sent) |
|---|---|
| A | The app's behavior drawn as art from real data · Swiss grid |
| B | The app as hero, magazine-cover style · real mockup screens placed with intent |
| C | Logo shapes as architecture · type as structure · no illustration, screenshot, or glow |

- Use a large-tier model · launch all 3 in one message · one folder each: `_to_delete/cover-lab/attempt-<A|B|C>/`.
- **Each agent needs Bash** so it can render and look at its own images (cap of 3 fix rounds). Before launching, check the tool list of the agent as **installed**. History: in the real bake-off (2026-10-15), the installed `graphic-designer` of plugin version 2.3.0 had no Bash (the current version in the repo has it). All 3 designers therefore sent code they had never seen rendered. The team lead had to render it and send a fresh `general-purpose` agent to do the fix round. If there is no Bash, use `general-purpose` and attach the designer role in the instruction.

## 3 · 3 reviewers — read-only, different angles, same criteria

| Reviewer | Angle |
|---|---|
| 1 | Art director: is it a real wow, does it look AI-made? |
| 2 | Brand strategist + Thai client who reads the BRD: can they remember the app, do they know what it does, does a set of 6–15 documents go together? |
| 3 | Production engineer + skill author: can an agent repeat it on a new project, how many numbers are project-specific, do the background images for Word hide all the text, is the version embedded in the image? |

The options voted on must always include the **current cover** (if there is one).

Score each of 7 criteria from 1 to 5: wow compared with the old cover · no repeats between projects · tells the truth about the app · document-set system · polish (Thai · contrast · smallest text · print cover · Word matches the sample image) · learned from real covers (borrow structure, do not copy) · buildable in Word and repeatable.
Then vote: `overall` 1 style · `per_project` the best style for each project · `steal` at most 2 pieces from losing styles.

## 4 · Count the votes

- The style with **2 of 3** wins, for both `overall` and per project (per-project winners may differ from overall).
- If the vote splits 3 ways, the team lead reads the total score per criterion. The "repeatable" criterion decides when scores are close. Then log it in `decision-desk/decision-log`.
- The team lead looks at all the images before reading the votes, then compares. If they disagree, read both sides' reasons before deciding.

## 5 · Merge the results

1 new agent (with Bash) works in `_to_delete/cover-lab/final/`: use the per-project winning style · bring in the voted `steal` pieces · fix what reviewers flagged · make 300 dpi background images for every document · build a sample .docx with `brandkit.py` and render it in real Word to look at it · write `NOTES.md`.
Do not overwrite the user's .docx. Build a new render from the source markdown. (Origin of this rule: SQT-Marketplace prompt set `prompt/software-development/prompt-new-project.md`, version 14, which lives outside this plugin.)

## First real result (2026-10-15 · the full reviewer report was in `_to_delete/cover-lab/votes.md` of the repo at the time, a temporary file)

| | A real data | B real screens | C logo shapes |
|---|---|---|---|
| Total score, reviewer 1 / 2 / 3 | 23.5 / 21 / 23 | 23 / 24 / 24 | 27 / 27 / 22 |
| overall | — | 1 vote | **2 votes** |
| LiteNet · Telex · SwipeOS | 1 · 0 · 0 | 0 · **2** · 0 | **2** · 1 · **3** |

### Round 2: learned from 35 real covers, then compared with the round 1 cover (R1)

| | R1 | X institutional set | Y editorial art | Z builds on R1 |
|---|---|---|---|---|
| Total score, reviewer 1 / 2 / 3 (7 criteria) | 26 / 24 / 24 | 24 / 24 / 24 | 26 / 26 / 30 | 31 / 29 / 28 |
| overall | — | — | 1 | **2** |
| LiteNet · Telex · SwipeOS | 0 · 0 · 0 | 0 · 0 · 0 | 0 · 1 · **2** | **3** · **2** · 1 |

Lesson: **put the old cover in the vote every time**, so you know whether the new one is really better. Add criterion 7, "learned from real covers". Pieces taken: the series-name line (X) · version as Word text in a badge (X) · one color per document type in the brand family (Y).

Pieces taken in round 1: the sentence under the title saying what the app does (from B) · the truth test for every image (from A) · `checks.json` (from C, put into B).

## The lesson behind this skill (3-style bake-off · 2026-10-15 · 3 projects · 3 reviewers)

The old covers of the 3 projects used one formula: black background, glow in the brand color, mono badge, data row at the bottom of the page. Only the color differed, which is the look AI produces for everything.
We tried 3 styles in parallel and had 3 reviewers vote. **The logo-shape style won 2 of 3.** The real-screen style won only for Telex (a plain T_ logo does not say it is a terminal). The art-from-real-data style had a few standout covers (LiteNet got 1 vote) but is the hardest to repeat on a new project.
Round 2 (the user said much more should change, and to learn from other people's real work): we collected 35 real covers, then made 3 new styles to compare with the round 1 cover. **The round 1 cover scored lowest on "learned from real work" from every reviewer.** The winner, 2 of 3, was the style that builds on round 1 with lessons from real covers (Thai title largest · version as a separate badge · logo-shape image bleeding off the edge like Stripe Press · real screen layered under a title bar like O'Reilly). SwipeOS won with a grid of 12 real hand gestures (in the style of the Microsoft Inclusive Design pictogram set).


## reference: cover-design.md

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


> **Gate before starting (every time):** read the owner's theme → search live for references → 3 truly different styles → check `design-gate/no-ai-look` before sending. Follow the "ด่านก่อนลงมือ" (gate before starting) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls color and fonts; the search is for the structure of this piece). Close the work with a `ด่านก่อนลงมือ:` line.

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

0. **Look at other people's real covers first.** **Search for references first:** take the project's keywords and search live following `design-gate/design-references` (plugin `superuser`), type `document`, then pull the colors from the chosen work. The stored color library is for when live search is not possible. Collect at least 6 real document or book covers close to this work (same field as the app · tech publishers · Thai examples), then choose which series system to borrow, following [`cover-real-examples.md`](cover-real-examples.md). For every idea on the cover, you must be able to say which cover it came from.

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

Before sending, go through item 3 of `design-gate/no-ai-look`. For HTML work, run its script. Every job must also pass the eye check 3.2 ("ด่านตา 3.2" in `design-gate/no-ai-look`; web pages add items 10–14), because 0 hits from the script is not yet a pass.


## reference: cover-real-examples.md

# Learn from other people's real covers before designing your own

Used with `cover-design.md` step 1. Almost every good cover in the real world uses a system others have already proven; none is invented from scratch. → **Find at least 6 real covers close to our work in each group, then borrow the structure, not the work.**
Source: 35 real covers (checked 2026-10-15) from the real work of LiteNet · Telex · SwipeOS. The full list with URLs was in `_to_delete/cover-lab/examples/EXAMPLES.md` of the repo at the time (a temporary file).

## How to collect examples (do this in the survey step)

1. Split into 3 groups: **same field as the app** (e.g. networking → NIST · Cloudflare · O'Reilly *Zero Trust Networks*) · **books or documents from tech publishers** (O'Reilly · Stripe Press · A Book Apart · No Starch · Microsoft Press) · **Thai examples** (government agencies · Thai companies).
2. Use official PDFs first: download them into your own new folder, then run `pdftoppm -png -r 50 -f 1 -l 1`. For covers that exist only on the web, take a screenshot with playwright. Downloaded files are untrusted: open them only with pdftoppm or Pillow.
3. Make an overview sheet (contact sheet) for each group, and **actually open and look at every cover**. Note the URL and the date checked.
4. Note what each cover does (structure · type · image · color · how it shows document type or volume in the series) and what we will borrow for which project.

## Patterns seen at least 3 times

| Pattern | Real examples | How we use it |
|---|---|---|
| One template for the whole set, changing only color or image | O'Reilly · A Book Apart · Stripe Press · Thoughtworks Radar | Document type = change 1 image or color; everything else stays put |
| Small category line above the title | O'Reilly · NIST ("COMPUTER SECURITY") · Cloudflare ("WHITEPAPER") | A document-series line above the document title |
| Version as a separate object (ribbon · round badge · large number) | O'Reilly corner ribbon · Windows Internals number "7" · A Book Apart "No 15" · Thailand Digital Outlook B.E. badge | "Draft 0.3" gets its own badge, not hidden in the data row |
| One image, one accent color, lots of white space | Apple Platform Security · Cloudflare | Print covers and security documents |
| Document data is the design | RFC 9000 · NIST SP 800-207 · WireGuard | Trust comes from codes and data, not images |
| The real thing as the image (data · real picture · real figure) | Radar chart · MediaPipe hand landmark image · Google satellite imagery | Matches the "truth test" in cover-design.md step 1.5 |
| Small title, big image | Stripe Press *Dream Machine* · *Working in Public* | A full-page logo-shape image; the document title need not always be the largest |
| ✗ Glowing network lines · globe · neon city | CISA · all 3 Thai government covers · Ultraleap | Banned. These are the stereotype of covers nobody remembers |

## Publisher series systems

| Publisher | Fixed | Changes per book | Lesson |
|---|---|---|---|
| O'Reilly | White background · woodcut line art · title bar · logo | Animal · bar color | One visual language, one bar; document type changes only the main image and bar color |
| Stripe Press | Small type at the corner · S mark · book size | Image and color are free | Images can vary if the mark and type stay put |
| A Book Apart | Frame · line around the title · number badge | One flat color | The most correct system: one color per document type + number |
| Thoughtworks Radar | Frame · radar image · volume position | A color set per issue | Same image, new colors every issue = "the image grows with the document type" |
| NIST · IETF | Plain type · series number · data | Nothing changes | The document code is the mark of the series |

## Thai examples

The 3 Thai government tech-report covers we could find all use glowing stock images (shield · globe · neon city). → Only 2 things are worth borrowing: **a colored badge for the year (B.E.) or edition**, and **the Thai title on top with a smaller, lighter English title below**.

## Rules for borrowing

- Borrow structure and ideas. Never copy images, trademarks, or layouts one-to-one.
- For every idea on the cover, write which real cover it was borrowed from and what changed (the `ADAPTED.md` file of each style).
- For examples you could not get (403 · dead link · file too large), say so plainly. Do not guess how they look.


## reference: cover-structural-ideas.md

# Cover structure styles: pick 1 per project

Read this when doing `cover-design.md` step 1.4. Every style uses the same page system (step 3). Projects on the same machine must not use the same style (step 2).

## Logo-shape style (the default path, won the 2-of-3 vote)

The cover image has only shapes from the real logo's SVG file, enlarged, repeated, cut, or arranged. No illustration, no screenshot, no glow.

| Structure | What it shows | Fits apps that | How to build it | Document type = |
|---|---|---|---|---|
| **Tiling** | Many pieces forming one system | Network · platform · multi-user system | The whole page is a grid of cells the size of the logo tile. A thin-line cell = not joined yet · a solid cell = joined · the giant document code takes 2–3 cells | Number of solid cells (2 → 5 → 11 · order from a seed) |
| **Giant crop** | One thing, its scale and focal point | Single tool · app with one clear symbol | Enlarge the shape until it overflows the page, with the shape's edge landing on a 96 px edge · construction lines and dimension lines from the logo's real units | Camera angle: close-up → whole shape → pulled back to show construction lines |
| **Sequence (chronophotograph, a multiple-exposure image of motion)** | Change over time | Apps with movement, gestures, steps | The logo 6+ times stacked on one line. Past frames are flat colors stepping down one level at a time (not a gradient), the current frame is solid, future frames are thin lines. A frame-number ruler sits under the line | Which frame is solid |
| **Slice / lift layers** | Layers of the system | Systems with many layers (keep for the next project) | Cut the logo into horizontal strips and shift each strip | Number of layers shifted |
| **Stack** | Accumulation | Data · logs · storage | Logos stacked, each offset slightly | Number of pieces in the stack |
| **Fan rotation** | Multiple options | Settings · routing | The logo rotated about one point at equal angles | Angle of the spread |

## Real-screen style (the fallback, wins only for projects where the logo does not say what the app does)

Use it when the logo alone does not say what the app does and the project has a clickable mockup. Take screenshots with playwright at 2x. Hide the mockup's toolbar before shooting.

| Layout | How to do it | Watch out for |
|---|---|---|
| **Oversize crop** (Telex won) | Enlarge the screen 2x so it overflows the top and right edges of the paper. The left column is a magazine masthead. End the document title with the logo's cursor | Crop offsets are in screen pixels (1440 × 900), then multiplied by the scale. No half-cut words at the edge |
| **Tilted plane** | The screen lies tilted as if on a desk, running off the bottom edge | It can easily look like a generic SaaS web page. It must fade out before the data row |
| **Specimen in a frame + magnifier** | The screen is mounted on white paper like a museum piece. The key part is enlarged in a separate frame, pointed to with a CSS selector, not coordinates | The big image must not make people misunderstand the app |

Document type = a different screen each (BRD welcome screen · SRS main screen · ARCH screen showing many parts at once) + a document code that stays readable in the thumbnail.

## Pictogram of what the app really does (won SwipeOS in round 2)

A pictogram grid of the app's whole set of commands or gestures, e.g. hand gestures G01–G12 from the data dictionary, drawn on MediaPipe's 21-point hand landmark skeleton. The cell for the gesture this document discusses is solid. Borrowed from the Microsoft Inclusive Design toolkit. It tells the client "a hand-gesture app" at a glance. Watch out: gestures with bent fingers need real hand proportions, or they look like claws or a broken hand.

## Institutional document-set style (lost round 2 but the easiest to repeat)

In the style of NIST SP · IETF RFC · Apple Platform Security: the document data is the design · thick lines · letter-spaced category bar · lots of white background. Reviewers said: trustworthy but so quiet that every project looks the same. → Use it for print covers or government/security documents, and borrow only the series-name line.

## Art-from-real-data style (a few standout covers, but hard to repeat)

Draw the app's behavior from real data, e.g. 11 real machines on an arc with a tick for each key rotation every 120 seconds · real protocol bytes · 21 hand points passing a real gesture threshold.
Use it when the user wants a single cover with a big "wow" and accepts project-specific code (~200 lines). Watch out for: rotated text labels too tight · numbers a BRD client cannot read · a data row floating in the middle of the page.

## Tried and cut

- Diagonal staircase sequence of thin-line frames → the page looks empty. Changed to one line of solid stacked frames.
- Extruding the square logo into an isometric block → it became a clip-art "tech" 3D image, and the diagonal lines fought the grid.
- A pink-purple-blue gradient cursor following the logo file → a gradient on a dark background is the fingerprint of AI work. Use one flat color.
- A laptop frame around the screenshot · pins pointing at parts of the screen → fake and cluttered.
- A random connection-dot graph on top with the document title at the bottom → the same structure as the old cover.


## reference: cover-vote.md

# A cover that belongs to this document set — make 3 directions, then vote 2 of 3

Open when a document set needs its own cover.

Use when a document set (proposal · report · business plan) needs its own cover and the default cover looks like another job's. Do one direction first; use this only if the user is not wowed or asks for several directions (3–5 times the labor).

1. **Find the real thing to hold on to:** logo, name, the main verb of the job (propose · analyze · sell), or real images of the work · look at at least 6 real covers by others · every image on the cover must point back to something real, otherwise cut it.
2. **3 designers (use `crew-patterns/parallel-attempts-pick-best`).** Same brief, different directions: A drawn from the job's real data · B a real image of the work is the hero (screen, photo, sample of the output) · C the logo shape or lettering is the structure, no drawn image · each agent needs Bash to render and open the image itself.
3. **3 new reviewers who have not seen the work, each from a different angle:** art director (is it truly wow, does it look AI-made) · brand and customer (is it memorable, does it show what the work is about, does it go with the whole set) · Word production (is it repeatable, can the text be edited) · include the old cover as an option too.
4. **Criteria scored 1–5, then vote:** wow compared with the old cover · not a repeat of other work · tells the truth of the work · fits the whole set · craftsmanship (Thai, contrast, smallest text) · buildable and repeatable in Word · the direction with **2 of 3 votes wins** · borrow at most 2 strong pieces from a losing direction · if the votes split 3 ways, "repeatable" decides.
5. **Text on the cover is editable Word text** (title, version, date) · the background image has no lettering baked in · anchor the image to the first paragraph, not in the header.
6. **Team members cannot launch agents themselves.** The designers save the 3 covers as files and send them back; the team lead launches the 3 reviewers to vote. Before launching, check that the installed designer agent has Bash; if not, use `general-purpose` with the designer role attached, or have the lead render and send the fix round to an agent that has Bash.
7. **Software document sets** (BRD · SRS · FSD whose cover must come from the logo shape or a real mockup, using the cover generator `scripts/cover-engine/`) → also read [`cover-design.md`](cover-design.md) (page system · registry · checks) and [`cover-bakeoff.md`](cover-bakeoff.md) (full bake-off steps).


## reference: cover-word-build.md

# Building a cover in real Word — the recipe that passed, and the reusable cover builder

Used with `cover-design.md` item 5 · proven 2026-10-15 (cover builder, round 2) only for Software Requirements Specification (SRS) covers: the text in the version badge is Word text on the badge shape in the background image · the vertical position of the Word text matches the preview image (median per style 0 px · horizontal not corrected) · the background image does not fade · comes out as exactly 2 pages (Word 365 on Windows 11 · Word via Component Object Model (COM) → PDF → `pdftoppm`)

## Cover builder `scripts/cover-engine/`

```
cover-engine/src/
├─ build_all.py    สั่งทั้งหมดในคำสั่งเดียว
├─ fonts.py        (รันเมื่อ COVER_INSTALL_FONTS=1) ตัดฟอนต์ variable เป็นไฟล์ static แล้วติดตั้งให้ผู้ใช้คนเดียว (ไม่ใช้ admin)
├─ capture.py      ถ่ายจอจาก mockup จริงที่ 2x (แนวหน้าจอจริง)
├─ render.py       HTML → ภาพตัวอย่าง 150 จุดต่อนิ้ว (dots per inch, dpi) · ภาพพื้น 300 dpi (ซ่อนข้อความ) · ตำแหน่งกล่องข้อความ → build/layout/*.json · checks.json
├─ docx_build.py   ภาพพื้น + ข้อความ Word ในกรอบยึดกับหน้า ด้วย brandkit.py
├─ word_pdf.py     Word COM → PDF → PNG
├─ calibrate.py    วัดระยะเหลื่อมระหว่าง Word กับภาพตัวอย่าง แก้รอบถัดไป
└─ web/            cover.html · cover.js (3 หน้า pageTile · pageShot · pageGrid + ป้ายเวอร์ชัน `pill` · บรรทัดชื่อชุด `seriesLine`) · projects.js (ข้อมูลโปรเจกต์ — แก้ที่นี่) · set.html
```

How to use it on a new project:
1. Copy the whole `cover-engine/` folder to the project's render folder (for example `docs/design/cover/`)
2. Put each project's logo SVG in `cover-engine/assets/<project>/` (screenshots that can be captured go to `build/shots/shot-<screen>.png`), then edit `src/web/projects.js`: logo SVG path · colors · fonts · Thai/English document title · the sentence that states the job · code, version, date · layout style (the 3 sample projects in the file are LiteNet tiled grid · Telex real screen · SwipeOS hand-pose table)
3. **Edit the parts still tied to the 3 prototype projects** (the builder does not yet read everything from `projects.js`):
   - `web/cover.js`: add the logo shape path to `GEO` and make the page function of the chosen style (`pageTile` tiled grid of logo shapes · `pageShot` real screen with a title bar overlaid · `pageGrid` grid of hand-pose symbol images) use the new project's data · number of cells and color per document type
   - `render.py`: the lists `PROJECTS` · `DOCS` · the print-cover condition (`if p == "litenet"`)
   - `calibrate.py`: the project list · `docx_build.py`: `PAGE2` (colors and page 2 content) · `fonts.py`: `SOURCES` and `NEEDED`
   - `web/set.html`: the document types in the set image (currently BRD · SRS · ARCH)
   - Remove the 3 sample projects from `projects.js` (their SVG files do not come along)
4. Set `BRANDKIT_DIR` = the folder `branded-document-design/scripts` in plugin `software-development` (if not set, the script finds the neighboring skill folder itself) · for the real-screen style set `COVER_MOCKUP` = path of the mockup file (1 project per run) · to use a Chrome installed on the machine → `COVER_CHROME` (not set = Playwright's Chromium)
5. Run `python src/build_all.py`, then open every image in `covers/*-set.png` and `build/qa/*-80-1.png`
- Requires: Python + `python-docx` `pillow` `numpy` `playwright` `fontTools` `pywin32` · Chrome · Word (for the PDF) · `pdftoppm` · internet (Google Fonts at render time · fonts from GitHub)
- **`fonts.py` installs fonts on the user's machine** (`%LOCALAPPDATA%\Microsoft\Windows\Fonts` + registry HKCU) and downloads files from the `main` branch of google/fonts without checking a hash — run it only when `COVER_INSTALL_FONTS=1` is set after the user allows it · say in the report what was installed · **to remove:** delete the installed `.ttf` files in `%LOCALAPPDATA%\Microsoft\Windows\Fonts` and the values `<font name> (TrueType)` in `HKCU\Software\Microsoft\Windows NT\CurrentVersion\Fonts`
- `docx_build.py` currently builds only the SRS cover (the BRD and ARCH covers have background images and positions, but are not yet tested in Word)

## Word recipe

1. **Background image** 2480 × 3508 (300 dpi) with the editable text hidden · **the logo is in the background image** (not a separate Word picture) · `anchor_picture(first paragraph, png, 0, 0, 21.0, 29.7, z=251658240)` → positioned relative to the page · `behindDoc=1` · that paragraph has 0 line spacing, exact 1pt · no header
2. **Text** 1 box in the HTML = 1 Word paragraph in a page-anchored frame (`w:framePr hAnchor=page vAnchor=page x y w`) · exact line spacing · break lines with `<br>` only · the frame is 80 px wider than the real box so Word does not wrap lines itself
3. **Unit conversion (150 dpi):** twips = px × 9.6 · pt = px × 0.48 · English Metric Unit (EMU) = px × 6096 · cm = px ÷ 1240 × 21 · `w:line` = line-height(px) × 9.6
4. **Fonts:** `style_run(font=...)` on every run, then `thai_runs(paragraph)` with `bk.FONT` set to that box's font (setting one value for the whole file → a SemiBold name becomes Regular) · body and footer call `thai_runs` too
5. **Page 2:** set `pageBreakBefore` on the first heading, do not add an empty page-break paragraph · hide the cover footer with `different_first_page_header_footer`
6. **Images not compressed:** put `<w:doNotAutoCompressPictures/>` in the position required by the `settings.xml` schema · the .docx keeps the full image, but the PDF from Word is still reduced to 200 ppi (no switch in COM)
7. **Word COM:** open its own instance with `DispatchEx` (do not touch a Word the user has open) · `EmbedTrueTypeFonts=True` `SaveSubsetFonts=False` → file about 5 MB · `ExportAsFixedFormat(..., 17, OptimizeFor=0)`
8. **Position adjustment:** `calibrate.py` shifts the ink of each box against the Word 150 dpi image (±14 px) and keeps the median per style (font | weight | size | line spacing) in `build/calib.json` · round 1 had a worst offset of 8 px, round 2 reduced it to 0

## Traps found

| Symptom | Cause | Fix |
|---|---|---|
| PDF shows font name "…SemiBold,Bold" (fake bold) | Weight 700 is not installed | Install the static file of every weight used |
| Thai text is BrowalliaNew | The Latin font (Space Grotesk) has no Thai glyphs, and `thai_runs` was not called | Split the footer by language · call `thai_runs` in every part · check with `pdffonts` |
| A variable font becomes Calibri in the PDF | Word only knows Regular/Bold per family | Cut it into static files with `fontTools.varLib.instancer` and give each its own family name |
| The cover background image looks faded when editing in Word | The image was placed in the header | Anchor it to the first paragraph (item 1) |
| The giant document code collides with the table cells | Fixed size, but the cell size changes | Compute the size from the width of 3 cells and the cap height |

## ยังไม่ได้ตรวจ (not yet checked)

Opening on a machine without the fonts (fonts are embedded, but not yet tried) · printing the print cover on a real printer · the reading order of the text frames with a screen reader


## reference: identity-and-gate.md

# Identity continuation and the document beauty gate · branded-document-design

Open this when the user is not wowed by the first direction, asks for several directions, or the job needs the document beauty gate (`ด่านสวย`). Moved from SKILL.md item 0.1, steps 2–4.

2. **Do 1 direction first.** Only if the user is not wowed, or asks for several directions, do **3 directions in parallel** (3–5 times the labor · `crew-patterns/parallel-attempts-pick-best` · a new agent with Bash per direction · for the cover use the 3-direction vote method in [`cover-vote.md`](cover-vote.md)). Each direction makes an HTML mock of A4 pages: cover · a content page with a real 4-row requirements table + callout · a table-of-contents page or a figure page · **1 figure redone for the direction** (use `diagram-figures`) · the file header says how to build each piece in real Word. When doing several directions they must really differ, for example a dark cover continuing from the app / a light editorial report / an engineering spec.
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
8. **Cover — plain lettering first, images later** (a project-specific cover that uses the logo shape or a real screen instead of decorative images → [`cover-design.md`](cover-design.md))**:** an illustration on the cover is optional, and an open cover with well-set lettering always beats an image that does not wow · a design that passed the gate: the document type (SRS · FSD · ARCH) large at 150–200px in the brand color as the only highlight (width at most ~85% of the column · a name over 5 letters such as TESTPLAN splits into 2 lines, never shrunk smaller than other copies, since the whole set must look the same size) → a short brand-colored line → Thai title → English title → a 1-sentence summary line (≥ 12pt, narrow column) → an info row at the page foot (labels ≥ 10pt) · leave the rest empty · parts with fixed positions (logo · document type · line · status tag) are drawn into the cover background image, while the title and info are Word text that can be searched and edited · the `(รอยืนยัน)` (awaiting confirmation) tag on a dark background uses a bright warning color, with no highlight fill · **if the user says the cover is not beautiful → cut the decorative images first** (curves, glowing dots, gradients), then make 3 plain-lettering covers to choose from (project has a logo or mockup → use `cover-design.md` item 7 instead)
