# skill: document-design

Use when Word, Excel or PDF must look designed, or to read a .docx

# document-design — make a Word, PowerPoint or PDF file look designed, on purpose

> **One rule:** run the pre-work gate before any design work, every time. Read the owner's theme, search live for reference designs, make 3 genuinely different directions, and check the result against `design-gate/no-ai-look` before sending.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Make this .docx or .pptx look professional", "design the cover", "use our brand in the report", "PDF with a designed look" | [`references/branded-document-design.md`](references/branded-document-design.md) (cover work: [`references/cover-design.md`](references/cover-design.md); tokens and fonts: [`references/tokens-and-type.md`](references/tokens-and-type.md); Thai fonts: [`references/thai-fonts.md`](references/thai-fonts.md)) |
| "Read this BRD.docx", "extract the table from the .xlsx", "answer from the attached PDF", "deliver it as Word or Excel" | [`references/office-input-output.md`](references/office-input-output.md) (which built-in `anthropic-skills` file skill to call, by role and format) |
| "Turn this Markdown file into a Word report", "convert the .md to .docx" | [`references/markdown-report-docx.md`](references/markdown-report-docx.md) (layout in Word: [`references/word-layout.md`](references/word-layout.md)) |

Other references: the code API is in [`references/api.md`](references/api.md), the list of mistakes to avoid is in [`references/anti-patterns.md`](references/anti-patterns.md), and the visual check is in [`references/visual-check.md`](references/visual-check.md). Scripts are in `scripts/` (`md_to_docx.py`, `brandkit.py`, `cover-engine/`).

## Steps every part shares

These steps apply to design work. Only reading or extracting an Office file (`office-input-output`) skips them.

1. Write the `เนื้อหา:` brief (what the content says, who reads it, what they do next). Use the brief to choose the design.
2. Read the owner's theme. Follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` in the `superuser` plugin, even when a brand exists. The brand sets colour and fonts; the search sets the structure.
3. Pick 1 direction out of the 3, then build the file from its tokens.
4. Render the file, look at it, and fix what the visual check finds.
5. Close the work with a line that starts with `ด่านก่อนลงมือ:`.

## Check before done

- The file passes `design-gate/no-ai-look`: no emoji, no decorative filler, and no claims a competitor could also make.
- The file passed the visual check in `references/visual-check.md` before it was sent.
- Every figure in the document comes from the `diagrams` skill and uses the same theme as the rest of the file.
- Every font in the file has its licence checked (see `references/thai-fonts.md`).


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


## reference: branded-document-design.md

<!-- merged from skill `branded-document-design` on 2026-11-27 · description was: Use when a Word, PowerPoint or PDF or its cover must look designed -->
# Branded Document Design — .docx / .pptx / .pdf that looks intentionally designed

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live for reference designs → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls color and fonts; the search is for this piece's structure) · close the job with the line `ด่านก่อนลงมือ:`

> **One rule:** an exported document has one color set, and one set of type sizes and spacing that is the same on every page. It must not look like someone opened Word and just typed.

## Use when
- The output is a .docx / .pptx / .pdf (quotation · business plan · report · contract · SRS) that a customer, executive, or another team will open, or that must be signed off or attached to a contract
- A document set needs its own cover from the logo shape or a real mockup, or covers look alike across projects → step 3 and `cover-design.md`
- Mixed Thai–English documents (they break easily if fonts are not fully set)
- The same kind of document is issued repeatedly and every copy should look the same
- Not for: markdown output → `design-gate/polished-document-style` · reading or extracting a received Office file → `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf` · diagrams in markdown → `diagrams` · a whole-book report from one Markdown file → `markdown-report-docx.md`

Order: write the content as markdown first (`design-gate/polished-document-style`), then render it with this skill. Always fix content in the markdown (the source).

Install before use: `pip install python-docx python-pptx` · LibreOffice (`soffice`) to convert to PDF · `pdftoppm` (poppler) to convert to images.

## Steps
1. **Colors.** If the source markdown has a `doc-theme`, use it: do not ask, do not set a new one (`design-gate/polished-document-style`, "ธีมของเอกสาร"). Otherwise look in the order in `diagrams` → `references/diagram-figures.md` item 5 (`doc-theme` → brand colors in code, logo, brand kit → nothing). If there is nothing, search live for reference designs per `design-gate/design-references` (plugin `superuser`), type `document`, then extract colors from the chosen work (stored palette library when live search is impossible). If live search is impossible, use the house color `#2A78D6`, write `(รอยืนยัน)` in the report, and carry on without asking; put a tone suggested by the content in the report for the user to choose later ([`palette-examples.md`](palette-examples.md)). A customer's brand colors always win. Write the colors back into `doc-theme` in the markdown so document, figures, and slides match.
   - **One main color.** All light and dark shades are computed from it. Only the status colors (success · warning · error) are independent and keep their meaning.
2. **Continue the look of the brand or app, before the first render.** The skill's defaults (Tahoma · solid color band cover · lines in every table cell) are the floor, not the deliverable look.
   - Is there an identity already? Check the brand kit (`graphic-design:brand-kit`), `assets/logo/`, `docs/design/`, a mockup that passed the beauty gate (score in `docs/BUILD-PLAN.md`), field `doc-theme` in `docs/README.md`. If yes, use the same logo (cover + page header), colors, and patterns as the app. If no, follow step 1.
   - Do 1 direction first. Only if the user is not wowed or asks for several, do 3 directions, have 2 outside reviewers score them, and run the document beauty gate (`ด่านสวย`, ceiling 3 rounds, record every score in `docs/BUILD-PLAN.md`): [`identity-and-gate.md`](identity-and-gate.md).
   - Work on the render script, not on .docx files one by one; render every copy.
   - **Fonts:** the brand's Thai font installed and embedded (`embed_fonts`) · Tahoma when embedding is impossible · never set Thai text in a mono font (no Thai letters in Cascadia/Consolas); mono is for code, keys, and numbers.
   - Figures in documents, beauty-gate rules, cover: [`word-layout.md`](word-layout.md), section at the end.
3. **Cover for this document set.** For a software document set (BRD · SRS · FSD · ARCH) whose cover must come from the logo shape or a real mockup, follow [`cover-design.md`](cover-design.md) (page system · registry · checks · cover engine `scripts/cover-engine/`). If the default cover looks like another job's, do 1 direction first; only if the user is not wowed or asks for several, run the 3-direction, 2-of-3 vote in [`cover-vote.md`](cover-vote.md).
4. **Tokens, never hardcode colors outside them.** `brand` · `brand_2` · `brand_deep` · `brand_tint` · `brand_tint_2` · `text` · `text_body` · `text_muted` · `line` + 6 status colors (success · info · warning · error · accent · neutral) that do not change with the brand. Set the values once with `use_brand(...)`.
   - Choose colors by meaning (red = danger/real error only); same meaning set as diagrams.
   - Contrast: body text and `text_muted` on the background ≥ 4.5:1 · H2 and table headers (`brand_deep`) ≥ 7:1 · H1 and KPI numbers (`brand`, large) ≥ 3:1 · `use_brand()` stops if it fails · in black and white the hierarchy must still read · if it fails, adjust darkness, not the color.
   - Text is never pure black (use `text_body`) · no type size outside the scale (Word body 11pt · slides 17pt).
   - Full token table, color meanings, type scale, elements: [`tokens-and-type.md`](tokens-and-type.md).
5. **Fonts and Thai.** Word treats Thai as a complex script: never set font/size/bold by hand; use `style_run()` in `brandkit.py` (sets `w:szCs` `w:bCs` `w:iCs` and all 4 slots of `w:rFonts`). If Latin and Thai fonts differ, set `bk.FONT` and `bk.LATIN_FONT`, then call `bk.thai_runs(doc.element.body)` and on every header/footer before `save()`. Line spacing 1.3–1.35 (Tahoma) · never justify Thai paragraphs · to send a PDF, export from real Word or check by eye (LibreOffice breaks Thai differently) · Linux has no Tahoma, use Loma/Sarabun · ReportLab places tone marks wrongly. Traps and embedding: [`thai-fonts.md`](thai-fonts.md).
6. **Word page structure.** Cover (project logo and mockup exist → project-specific cover per step 3; else the default) → table of contents → body (H1 numbered, keep-with-next on headings) → sign-off table · footer "หน้า N" centered, gray 9pt · A4, content width 17 cm = 9638 twips (`BODY_TWIPS`) so column widths add up. Full structure and dark cover (`doc.cover(..., style="night")`): [`word-layout.md`](word-layout.md).
   - Cover background image and logo never go in the first-page header (Word shows them faded); anchor them to the cover's first paragraph. Inner-page table headers never use a full-width solid dark fill.
7. **Use the elements** `cover()` · `table()` · `pill_table()` · `kpi_row()` · `callout()` · `figure()` · `code()` · `signoff()` (methods in `tokens-and-type.md`). At most 3–5 callouts per 10 pages · KPI strip of 3–5 cells · a table over 6 columns goes on a landscape page (`landscape_section()`).
8. **Use brandkit.** `from brandkit import BrandDoc, use_brand, to_pdf` (put `scripts/` on the path) · slides → `brandkit_pptx.BrandDeck` · speaking deck → `brandkit_stage.StageDeck` (default: `accent`/`bg` from the source work per `slide-deck` `deck-theme.md`, `source_palette.py` prints the `StageDeck(...)` line; light `FFFFFF` with `block=True`, dark only if the source is dark; no color at all → `#2A78D6` on `FFFFFF` + `(รอยืนยัน)`). Sample code and methods: [`brandkit-usage.md`](brandkit-usage.md), `api.md`.
9. **Look at every page before delivery.** Render to PDF, convert to images, open each page (Read tool): the code cannot show tables overflowing the margin, stranded headings, floating tone marks. Commands and the 7-point checklist: [`visual-check.md`](visual-check.md).
10. Before sending, go through item 3 of `design-gate/no-ai-look` (HTML work: run its script; the eye gate 3.2 must also pass, web pages answer items 10–14).

**Hard rules (covers):**
- A project cover shows its project by logo shape or a real screen at a glance, not by colour alone.
- Never draw a fake UI on a cover. Use a real mockup screenshot. No logo or mockup yet: stop and make the logo first.
- Ask before creating or editing files outside the project (e.g. `cover-registry.md`).
- Install fonts only after asking, and only with `COVER_INSTALL_FONTS=1`.

## Check before done
- Avoid: Word's built-in Heading styles (use `h1()/h2()/h3()`) · thick black default table lines (use 0.5pt `line`) · pure black text · bold table headers with no fill · letting Word choose column widths (`fixed_widths()`) · too many emoji · a file never rendered for a look · the skill's default look when the app already has an identity · a 2000px-wide figure on a 17 cm page (text ends near 5pt) · a decorative cover image nobody said wows · a .docx without the source markdown. Reasons: [`anti-patterns.md`](anti-patterns.md)
- Every page was opened and looked at · colors written back to `doc-theme` · the line `ด่านก่อนลงมือ:` closes the job

## References
- [`tokens-and-type.md`](tokens-and-type.md) — open when setting the theme or choosing sizes, colors, elements · [`palette-examples.md`](palette-examples.md) — fallback tones by kind of work
- [`thai-fonts.md`](thai-fonts.md) — open when setting fonts or a PDF looks off
- [`word-layout.md`](word-layout.md) — open for page structure, dark cover, figure rules
- [`cover-design.md`](cover-design.md) — open for a software document set's own cover (logo shapes or real screen) · with [`cover-real-examples.md`](cover-real-examples.md) · [`cover-structural-ideas.md`](cover-structural-ideas.md) · [`cover-word-build.md`](cover-word-build.md) · [`cover-bakeoff.md`](cover-bakeoff.md)
- [`identity-and-gate.md`](identity-and-gate.md) — open when running several directions or the beauty gate · [`cover-vote.md`](cover-vote.md) — the 3-direction cover vote
- [`brandkit-usage.md`](brandkit-usage.md) · [`api.md`](api.md) — open when writing the build script
- [`visual-check.md`](visual-check.md) — open when rendering for the eye check · [`anti-patterns.md`](anti-patterns.md) — open when reviewing
- Linked skills: slide story → `slide-deck` · SRS → `requirements-writing` · diagrams → `diagrams` / `diagrams` · brand → `graphic-design:design-by-type` · .html deck → `slide-deck`


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

- **2 colors come from the project's design:** `accent` (main color) and `bg` (background color). Look in the order given in `diagrams` → `references/diagram-figures.md` item 5 (`doc-theme` → design in code, such as `--primary` · `--background` · the Tailwind theme · the app's dark/light mode → logo and brand kit → nothing at all: use the house color `#2A78D6` with background `FFFFFF` and write `(รอยืนยัน)` (awaiting confirmation)). Never use the model deck's colors · if the work being made into a deck has its own colors, extract them first with `slide-deck/scripts/source_palette.py` · for a light-background deck, set `block=True` so the cover and chapter dividers are a solid main-color full sheet (`slide-deck` `references/deck-theme.md`)
- Every gray level is computed from `bg` (dark background mixed with white, light background mixed with black), so it carries the same tone as the project's background · `accent_hi` is the main color with lightness adjusted until readable on that background; use it for big numbers, sequence numbers and emphasis words · a project that already fixed a text color can override it, e.g. `text="1B2430"`
- Fonts of the project can be used (`head_font=` · `body_font=`); if the project has none, use Chakra Petch + IBM Plex Sans Thai
- **Diagram images must use the same background color as the deck** — render `diagrams` with `#accent=<main color>&bg=<background color>` (now available in `figure-flow.html`)
- **The fonts Chakra Petch and IBM Plex Sans Thai must be installed** (Google Fonts · free to use) on the machine that opens the file. If the destination machine lacks them, send a PDF along, or rebuild with `head_font="Tahoma", body_font="Tahoma"`
- For printing, build another set with `bg="FFFFFF"` instead of using a dark background that wastes ink · `BrandDeck` (color bar on top) is still usable for reports sent to be read on their own


## reference: cover-bakeoff.md

# Make 3 styles, then vote 2 of 3

Used with `cover-design.md` step 7. It is a variant of `handoff/parallel-attempts-pick-best` that swaps "1 middleman agent" for "3 reviewers who vote".
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

This file covers the **cover page** only. The whole document body (color set, Thai fonts, tables, headers and footers) lives in [`../SKILL.md`](branded-document-design.md). The cover uses the same `anchor_picture()` from `brandkit.py`.

## When to use (software document sets: logo shape or real mockup cover)

- A project's document set (BRD, the business requirements document · SRS, the software requirements specification · FSD, the functional specification · ARCH, architecture · PLAN, the project plan · TESTPLAN, the test plan) will go to a client or executives, and the current cover looks like another project's.
- The user says "ปกไม่ว้าว" · "อยากได้ปกที่ไม่ซ้ำ" · "ปกทุกโปรเจกต์หน้าตาเหมือนกัน" (the cover is not wow · I want a cover that is not repeated · every project's cover looks the same).
- Do not use when: the project has no logo or mockup yet → make the logo first (`graphic-design:design-by-type`), then come back. A single report from markdown that needs no identity → `markdown-report-docx.md`.

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
- **The sample cover engine** `scripts/cover-engine/` (in `document-design`) builds the covers of all 3 prototype projects in one command (sample image · 300 dpi background image · `checks.json` · SRS cover .docx · check image from Word). **Using it for a new project needs more edits than `projects.js`:** the logo lines and drawing functions in `cover.js` · the project list in `render.py`, `calibrate.py`, `docx_build.py` · the fonts in `fonts.py`. The full list is in cover-word-build.md.
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
2. **3 designers (use `handoff/parallel-attempts-pick-best`).** Same brief, different directions: A drawn from the job's real data · B a real image of the work is the hero (screen, photo, sample of the output) · C the logo shape or lettering is the structure, no drawn image · each agent needs Bash to render and open the image itself.
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
4. Set `BRANDKIT_DIR` = the folder `document-design/scripts` in plugin `software-development` (if not set, the script finds the neighboring skill folder itself) · for the real-screen style set `COVER_MOCKUP` = path of the mockup file (1 project per run) · to use a Chrome installed on the machine → `COVER_CHROME` (not set = Playwright's Chromium)
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

Open this when the user is not wowed by the first direction, asks for several directions, or the job needs the document beauty gate (`ด่านสวย`). Moved from `branded-document-design.md` item 0.1, steps 2–4.

2. **Do 1 direction first.** Only if the user is not wowed, or asks for several directions, do **3 directions in parallel** (3–5 times the labor · `handoff/parallel-attempts-pick-best` · a new agent with Bash per direction · for the cover use the 3-direction vote method in [`cover-vote.md`](cover-vote.md)). Each direction makes an HTML mock of A4 pages: cover · a content page with a real 4-row requirements table + callout · a table-of-contents page or a figure page · **1 figure redone for the direction** (use `diagrams`) · the file header says how to build each piece in real Word. When doing several directions they must really differ, for example a dark cover continuing from the app / a light editorial report / an engineering spec.
3. **2 reviewers who did not do the work** (if there is only one direction, score that one only; no mixing) score 1–5 (pass = 4): first impression · continuity with the app · craftsmanship (a long Thai table of 60 rows without breaking mid-word · type scale · contrast) · figures readable when placed for real · really buildable in Word → **mixing is allowed** (cover from one direction, body from another) if the reviewers name the pieces clearly.
4. Work on the render script (do not edit .docx files one by one) → render every copy → **document beauty gate (`ด่านสวย`)**: 2 new reviewers look at images of the real pages (cover · table of contents · chapter opener · long table page · figure page) using the 5 axes above, and take the lower score · ceiling **3 rounds** (more detail in `ui-craft/references/states-and-checks.md` in plugin `software-development` if installed) · record every round's score in `docs/BUILD-PLAN.md`


## reference: markdown-report-docx.md

<!-- merged from skill `markdown-report-docx` on 2026-11-27 · description was: Use when one Markdown file must become a Word report -->
# Markdown Report → .docx

## Contents

- [When to use](#when-to-use)
- [When **not** to use](#when-not-to-use)
- [1 · Steps](#1--steps)
- [2 · Front matter](#2--front-matter)
- [3 · What each Markdown form becomes](#3--what-each-markdown-form-becomes)
- [4 · Rules for writing so it looks good](#4--rules-for-writing-so-it-looks-good)
- [5 · Check by eye. Never skip.](#5--check-by-eye-never-skip)
- [6 · Anti-patterns](#6--anti-patterns)
- [7 · Links to other skills](#7--links-to-other-skills)


> **Pre-work gate "ด่านก่อนลงมือ" (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search is for finding the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **The one rule of this skill:** Markdown is the source. The .docx is the result built from the source.
> Edit the .md and rerun the script every time. Never open Word and edit by hand, because the next run wipes it all out.

Page style: logo cover centred on the page · table of contents · tables with a light brand-colour header · note boxes · dark-background figures with captions · short tables that do not split across pages.

## When to use

- Business reports, research summaries, project reports, reports for a teacher, test result reports, handover documents whose content is already written in Markdown
- You must build the report many times (numbers or test results change → rerun → same-looking file)

## When **not** to use

| Work | Use |
|---|---|
| A formal document with a colour-banded cover, a metadata box, a signature table (Software Requirements Specification (SRS) · Business Requirements Document (BRD) · proposal) | `document-design`, calling `BrandDoc` directly |
| Presentation slides | `slide-deck` (its top table chooses .pptx · .html · convert) |
| A document that lives in the repo as Markdown only | `design-gate/polished-document-style` |
| Thesis · independent study · research article | `personal-life:thesis-writing` first (if installed): the faculty guide controls the book structure and layout. This script can still build the .docx afterwards |

---

## 1 · Steps

1. Write the content in `docs/src/<name>.md` (the permanent source, per `workspace-rules/document-naming` item 1) following `design-gate/polished-document-style` (plugin `superuser`). Add front matter (section 2). If there is no `doc-theme` yet, **search for references first:** take the project's keywords and search live as in `design-gate/design-references` (plugin `superuser`), type `document`, then pull colours from the chosen work. Use the stored colour library when live search is not possible.
2. Run `python scripts/md_to_docx.py docs/src/<name>.md -o docs/<deliverable-file-name>.docx --pdf`
   - The script uses `brandkit.py` from `document-design/scripts/` next to it, and needs `python-docx`.
   - `--pdf` uses Word on Windows (it also updates the table of contents). Without Word, it uses LibreOffice. This PDF is for the checks in section 5. Deliver it only for a user manual or when the client asks. Otherwise move it to `_to_delete/` (`workspace-rules/document-naming` item 1).
3. Convert the PDF to images and **open every page** as in section 5. If you find a problem, fix it in the .md and rerun.
4. Name the deliverable file per `workspace-rules/document-naming` (plugin `superuser`), for example `CLINIC-RPT-project-v1.0-DRAFT.docx`

To see an example with every element: `python scripts/md_to_docx.py assets/example-report.md --pdf`

## 2 · Front matter

```yaml
---
title: Clinic Booking Assistant              # large title in brand colour on the cover
subtitle: เอกสารการพัฒนาโครงงานและผลการทดสอบ   # secondary line in bold
meta: วิชา 01234567 · ฉบับ 1.2 · 10 ตุลาคม 2569 # small line under the subtitle
note: ผู้พัฒนา 6500001 ชื่อ นามสกุล             # grey italic (optional)
logo: ../assets/logo-on-light.png             # path relative to the .md file (optional)
logo_width_cm: 6.5
brand: 2A78D6          # the project's main colour (order in diagram-figures item 5) · this value is the house default · used for H1 headings, the cover title, item numbers
brand_deep: 1B4E8B     # H2 headings, table header text, inline code
brand_tint: EAF2FB     # table header background
brand_tint_2: F4F8FD   # alternate row background (tables over 6 rows)
---
```

Optional values: `brand_2` (secondary accent colour) · `toc: no` (no table of contents) · `footer: Page` (the word before the page number, default "หน้า") · `figure_width_cm` (default 17) · `cover_top_pt` (distance from the top edge to the logo, default 150)

**Colours come from the work's owner.** Find them in the order in `diagrams` → `references/diagram-figures.md` item 5 (colour system). If you find none at all, put `brand: 2A78D6` (the house default), write `(รอยืนยัน)` (awaiting confirmation) in the report, and keep going without stopping to ask. Never copy colours from the example or the reference report. `brand_tint` must be light enough for `brand_deep` text to read clearly (contrast ≥ 7:1 on both white and `brand_tint`; the script checks this and stops with the value if it fails).

## 3 · What each Markdown form becomes

| Written in .md | Result in .docx |
|---|---|
| `# 1. Heading` · `##` · `###` | 3 heading levels in brand colour, in the table of contents, never stranded at the page bottom · **write the item numbers yourself** |
| Paragraph with `**bold**` · `` `code` `` | Body text in dark grey · bold in a dark colour · code in a monospace font in `brand_deep` |
| Table `\| … \|` | Header with `brand_tint` background · first column bold · width by text length · alternate row colours over 6 rows · a table of up to 8 rows stays on one page · header row repeats across pages |
| `> text` | A grey "หมายเหตุ" (note) box |
| `> [!TIP]` · `[!WARNING]` · `[!IMPORTANT]` · `[!CAUTION]` · `[!NOTE]` | Boxes for tip · caution · important · danger · note |
| `![caption](path.png)` | Centred image + italic "รูปที่ N — caption" (Figure N), on the same page as the image |
| `1. …` | Item numbers in brand colour, restarted for every list |
| `- …` | bullet |
| ```` ``` ```` | Code box with grey background |
| `<!-- pagebreak -->` | New page |
| `---` · `<!-- other -->` | Skipped |

A line before a table (a lead-in paragraph or a note box) is tied to stay on the same page as the table.

## 4 · Rules for writing so it looks good

- **Tables are the main tool.** Data with a heading + details is better as a 2-column table than a long paragraph.
- **A table cell is at most ~170 characters.** Longer than that, move it below the table.
- **Pick dark-background or white-background figures and use one for the whole book** · 1600–2000 px wide · draw with [`diagrams`](../../diagrams/SKILL.md) and export PNG
- **Test results come from the real result files.** Build the results table with a script and insert it between `<!-- RESULTS:START -->` and `<!-- RESULTS:END -->` in the .md before running. Do not type numbers by hand.
- **Say when data is simulated.** A 1-line note box from the first page of the content.

## 5 · Check by eye. Never skip.

```bash
python -c "import pymupdf; d=pymupdf.open('report.pdf'); [p.get_pixmap(dpi=70).save(f'_to_delete/p{i+1:02}.png') for i,p in enumerate(d)]"
```

Open the image of every page (Read tool) and go through the checks:

- [ ] Cover: logo is not distorted, the title does not wrap in the middle of a word
- [ ] The table of contents has all page numbers (if empty, open in Word and press F9, or use `--pdf` on Windows)
- [ ] No nearly empty pages · no heading stranded at the page bottom · no figure caption pushed to the next page
- [ ] Table columns do not cut a name or code in the middle. If they do, shorten the text in the longest column
- [ ] Brand colour matches the logo (no brand → house default + `(รอยืนยัน)`) · no leftover Word default blue
- [ ] No leftover `[...]` placeholder · `(รอยืนยัน)` is not a placeholder, so keep it, and every instance appears in the report's awaiting-confirmation list

## 6 · Anti-patterns

- **Editing the .docx in Word and sending it.** It vanishes on the next run. Edit the .md.
- **Using Word's List Number.** It continues counting across lists, which is why the script writes the numbers itself.
- **A small screenshot enlarged to full page.** It breaks up. Retake it at width ≥ 1600 px.
- **A table 7 columns wide or more on a portrait page.** Split it into 2 tables.

## 7 · Links to other skills

| Need | Use |
|---|---|
| Add elements the script lacks (KPI · pill · signature · landscape page) | Call `BrandDoc` in [`document-design`](../../document-design/SKILL.md) after `build()` |
| Slides paired with the same report, same colours | [`slide-deck`](../../slide-deck/SKILL.md) (its top table chooses .pptx · .html · convert) |
| File names and versions | `workspace-rules/document-naming` (plugin `superuser`) |
| Figures in the report | [`diagrams`](../../diagrams/SKILL.md) |
| A project-specific cover (logo and mockup already exist) | `document-design` `cover-design.md` |


## reference: office-input-output.md

# Office files in and out — which built-in skill to call, by role

Moved from the user-level skill `office-document-handling` on 2026-11-28 (merged into `document-design`; the look of the finished file stays in the other `document-design` references). A `.md` file that must become a designed `.docx` → [`markdown-report-docx.md`](markdown-report-docx.md) (`scripts/md_to_docx.py` + `brandkit.py`), not `anthropic-skills:docx`.


## Contents

- [When to use this file](#when-to-use-this-file)
- [The Skills You'll Use](#the-skills-youll-use)
- [Decision Tree: Which Skill?](#decision-tree-which-skill)
- [Common Patterns by Role](#common-patterns-by-role)
- [Workflow Patterns](#workflow-patterns)
- [Format Selection Guidance](#format-selection-guidance)
- [Quality Checklist](#quality-checklist)
- [Habits that keep content intact](#habits-that-keep-content-intact)
- [When to Hand Off](#when-to-hand-off)
- [Quick Reference](#quick-reference)

## When to use this file

- User attaches a **.docx, .xlsx, .pptx, or .pdf** file
- User asks to "read", "extract", "analyze" a document
- User asks for output as Word/Excel/PowerPoint
- User mentions a file by name (e.g., "the BRD.docx", "the spec.xlsx")
- Migrating content between formats

## The Skills You'll Use

Anthropic's file skills (`anthropic-skills:*`, installed with Claude, not part of this plugin) handle Office formats. **Don't try to parse these yourself** — invoke the appropriate skill:

| File type | Skill | Use for |
|-----------|-------|---------|
| `.docx` (Word) | `anthropic-skills:docx` | BRDs, FSDs, contracts, reports |
| `.xlsx`, `.csv`, `.tsv` | `anthropic-skills:xlsx` | Requirements matrices, data, plans |
| `.pptx` (PowerPoint) | `anthropic-skills:pptx` | Roadmaps, pitches, training decks |
| `.pdf` | `anthropic-skills:pdf` | Scanned contracts, RFPs, reports |

## Decision Tree: Which Skill?

```
User input has a file?
│
├─ .docx → anthropic-skills:docx
│   - Read content + structure (headings, tables, lists)
│   - Edit existing doc (find/replace, tracked changes)
│   - Produce final Word output
│
├─ .xlsx / .csv → anthropic-skills:xlsx
│   - Read tabular data
│   - Compute (formulas, pivots)
│   - Produce Excel output
│
├─ .pptx → anthropic-skills:pptx
│   - Read slides + speaker notes
│   - Produce slide decks
│   - Modify templates
│
└─ .pdf → anthropic-skills:pdf
    - Extract text + tables
    - OCR scanned PDFs
    - Produce PDF output (cert of completion, formal reports)
```

## Common Patterns by Role

### Business Analyst — Reading BRD/PRD

```
1. User attaches "requirements.docx"
2. Use anthropic-skills:docx to extract structure + content
3. Map to internal BRD format
4. Identify gaps + ambiguities
5. Produce polished BRD (markdown by default, .docx if requested)
```

### System Analyst — Reading API Spec

```
1. User attaches "api-spec.xlsx" with endpoint matrix
2. Use anthropic-skills:xlsx to extract rows
3. Convert to FSD endpoint definitions
4. Verify completeness vs source
```

### Product Manager — Reading Pitch / Roadmap

```
1. User attaches "Q1-roadmap.pptx"
2. Use anthropic-skills:pptx to extract slides + speaker notes
3. Update with current state
4. Produce updated deck OR convert to markdown for review
```

### Technical Writer — Producing Deliverables

```
1. Write content in markdown (always source of truth)
2. If user wants .docx: render per [`markdown-report-docx.md`](markdown-report-docx.md); use anthropic-skills:docx only to read or edit a .docx the user sent
3. If user wants .pptx: use anthropic-skills:pptx to slidify
4. Keep markdown source for version control + future edits
```

### QA Tester — Test Plans + Matrices

```
1. Read test plan template (.xlsx) with anthropic-skills:xlsx
2. Populate test cases per matrix structure
3. Output back to .xlsx for upload to test management tool
```

### Legal/Compliance — Contracts + Filings

```
1. Receive contract.docx or contract.pdf
2. Use appropriate skill to extract clauses
3. Apply `domain-systems/references/contract-parsing-patterns.md`
4. Produce review notes + redlined version
```

## Workflow Patterns

### Pattern 1: Read → Process → Output Same Format

```
Input: .docx → Extract content → Process → Output: .docx
```

Use when: round-tripping documents (e.g., redline editing)

### Pattern 2: Read → Transform → Markdown

```
Input: .docx/.xlsx/.pptx → Extract → Output: markdown
```

Use when: importing into your workflow, version control needed

### Pattern 3: Markdown → Render to Office

```
Source: markdown → Process → Output: .docx/.pptx/.pdf
```

.md → .docx goes through [`markdown-report-docx.md`](markdown-report-docx.md) so the brand kit applies.

Use when: user wants formal deliverable, keep markdown for editing

### Pattern 4: Cross-Format

```
.pptx → markdown (for review) → .docx (final deliverable)
```

Use when: pitching → contract, roadmap → spec, etc.

## Format Selection Guidance

### Default: Always start with markdown

```
Markdown advantages:
- Version control friendly (git diffs)
- Searchable
- Editable in any tool
- Renders everywhere
- Easy to convert to Office formats

Office formats as source of truth (avoid):
- Lost in version control
- Hard to diff
- Tool lock-in
- Heavy file size
```

### When to render to Office

| User says | Render to |
|-----------|-----------|
| "Send to legal" | `.docx` (tracked changes and comments work in Word) |
| "Present to board" | `.pptx` |
| "Track in our system" | `.xlsx` |
| "Sign with DocuSign" | `.pdf` |
| "Email the report" | `.pdf` (universal) |
| "Edit collaboratively" | Markdown (link to repo) |

## Quality Checklist

When producing Office output:

- [ ] Markdown source preserved + version controlled
- [ ] Output matches requested format
- [ ] Tables render correctly (esp. in Word)
- [ ] Images embedded properly
- [ ] Page breaks at logical points (Word)
- [ ] Headers/footers per template (Word)
- [ ] Slide notes included (PowerPoint)
- [ ] Formulas computed correctly (Excel)
- [ ] PDF accessibility tags (if needed)
- [ ] Spell check passed
- [ ] Brand styling applied

## Habits that keep content intact

- Read Office files with `anthropic-skills:*`, because hand-written parsers drop tables, comments and notes.
- Deliver the format the user asked for, since a Markdown file where Word was asked means they redo the work.
- Keep Markdown as the editable source, because Office files diff badly in version control.
- Pull Excel tables as tables, so the structure and formulas survive.
- Compare formatting after a round trip (Office → Markdown → Office), because styles get lost silently.
- Read speaker notes in .pptx, since the real argument is often there.
- Expect scanned PDFs to need OCR (`anthropic-skills:pdf` does it), because a PDF may hold only images.

## When to Hand Off

- Need bulk conversion (1000s of files) → DevOps engineer + Pandoc pipeline
- Custom branded templates → designer creates template, we populate
- Heavy data analysis → Data engineer + pandas
- Document automation system → Document automation engineer (legaltech)

## Quick Reference

```
File ends in    → Use skill              → Common use case
─────────────────────────────────────────────────────────────
.docx, .doc     → anthropic-skills:docx  → BRD, FSD, contracts
.xlsx, .xlsm    → anthropic-skills:xlsx  → Requirements, data, plans
.csv, .tsv      → anthropic-skills:xlsx  → Tabular data export
.pptx           → anthropic-skills:pptx  → Decks, roadmaps
.pdf            → anthropic-skills:pdf   → Reports, contracts, RFPs
.md, .txt       → (no skill needed)      → Native handling
```


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

The one rule: **choose a color by meaning, not by looks.** Do not use red just to stand out. Use red only when something is truly dangerous or wrong. Diagrams use this same set of meanings too (see `diagrams`, which has the orange `EXCEPT_HUE` for paths that leave the main line).

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

## Figures in documents · beauty-gate rules · cover (moved from `branded-document-design.md` §0.1 items 6–8)

6. **Figures in documents:** the smallest text after real placement ≥ 7pt → minimum pixels on the canvas = `0.247 × canvas width(px) ÷ placed width(cm)` (a 2000px canvas placed 17 cm wide = 29px · placed on a 25.7 cm landscape page = 20px · use 26px to get 9pt) · a wide figure should go on a landscape page at the full column width (≥ 95%) · use the **version placed in the document without a figure title**, because the Word caption already gives the number and the figure's name · figure caption ≥ 9pt in body text color · after a figure, start a new section; the next paragraph must not flow onto the figure's page.
7. **What the beauty gate (`ด่านสวย`) often catches (put them as rules in the render script's `check`):** stray markdown marks (`**` · backtick) · Thai text in a mono font · a table overflowing a text column · a table of contents with a single entry stranded on the next page · a code list cut in the middle of a code (one code per line, one font for the whole column) · the "(รอยืนยัน)" tag uses the warning color, not the brand color · identity lost after the cover (chapter opener pages use the app's brand color bar) · a light cover available to print alongside the dark cover.
8. **Cover — plain lettering first, images later** (a project-specific cover that uses the logo shape or a real screen instead of decorative images → [`cover-design.md`](cover-design.md))**:** an illustration on the cover is optional, and an open cover with well-set lettering always beats an image that does not wow · a design that passed the gate: the document type (SRS · FSD · ARCH) large at 150–200px in the brand color as the only highlight (width at most ~85% of the column · a name over 5 letters such as TESTPLAN splits into 2 lines, never shrunk smaller than other copies, since the whole set must look the same size) → a short brand-colored line → Thai title → English title → a 1-sentence summary line (≥ 12pt, narrow column) → an info row at the page foot (labels ≥ 10pt) · leave the rest empty · parts with fixed positions (logo · document type · line · status tag) are drawn into the cover background image, while the title and info are Word text that can be searched and edited · the `(รอยืนยัน)` (awaiting confirmation) tag on a dark background uses a bright warning color, with no highlight fill · **if the user says the cover is not beautiful → cut the decorative images first** (curves, glowing dots, gradients), then make 3 plain-lettering covers to choose from (project has a logo or mockup → use `cover-design.md` item 7 instead)


---

# skill: requirements-writing

Use when writing an SRS, FSD or user stories before code

# requirements-writing — write requirements a developer can build and a tester can check

> **One rule:** every requirement must let you write a test case from it right away. If a developer must guess, the document is not finished.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Write the SRS", "software requirements spec", "review this SRS before sign-off", "tender or SOW requirements" | [`references/srs-writing.md`](references/srs-writing.md) |
| "Write the FSD", "functional spec", "developers keep asking questions" | [`references/fsd-writing.md`](references/fsd-writing.md) |
| "Write user stories", "acceptance criteria", "split this requirement into stories" | [`references/user-story-writer.md`](references/user-story-writer.md) |
| "Start this feature", "feature kickoff", "from idea to BRD, FSD and plan" | [`references/feature-kickoff.md`](references/feature-kickoff.md) (playbook: `superuser/references/playbook-feature.md`) |

Shared material: the difference between FSD and SRS is in [`references/fsd-vs-srs.md`](references/fsd-vs-srs.md). Templates are in `assets/` (`srs-outline.md`, `fsd-outline.md`, `user-stories.md`). Reader checks are in [`references/reader-test.md`](references/reader-test.md) and [`references/review-checklist.md`](references/review-checklist.md).

## Steps every part shares

1. Find the client's existing format first (TOR, template, past documents). Use it before inventing a new one.
2. Write each requirement with one fixed word for the strength: **ต้อง** (must), **ควร** (should), **อาจ** (may).
3. Give every item an ID. Never reuse an issued ID. A dropped item is marked, not deleted.
4. Mark each unknown `(รอยืนยัน)` (awaiting confirmation) and put it on the open-questions list. Do not fill it with a guess.
5. Test the result with a fresh reader: a new agent that sees only the file answers 8 to 10 questions a developer or tester would ask. Fix the document at each gap, then ask again.

## Check before done

- Every numeric value (price, time, limit) came from the customer or the SRS. Nothing is invented, and no silent guess is written as fact.
- An FSD adds no new requirement. A missing point goes to the SRS first, or to the open-questions list.
- Every status has a table of From · To · Who · Condition · Side effects, and every error case has its own test case.
- A story whose acceptance criteria change after work starts is logged in the change history, and related test cases are updated.
- A Thai document and its English version are checked by a fresh reader, and the answers match.


## reference: brd-template.md

# BRD template — stakeholder version (Mode B)

Business Requirements Document (BRD) template, the version sent to stakeholders, for the agent `business-analyst` · format it following `design-gate/polished-document-style`

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
(draw it as a house-style figure with `diagrams`, not inline Mermaid)

## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| Product Owner | @alice | Pending | — |
| Tech Lead | @bob | Pending | — |
| Compliance | @charlie | Pending | — |
```


## reference: edge-cases.md

# Errors and edge cases to answer in full

The test team uses this table, and most FSDs lack it. Go through every row that touches the feature, then write the answers into section 9 of the document.

| Case | Question to answer |
|---|---|
| No data | What does the empty screen show? Is there a button that points to the next step? |
| Very large data | How many items per page? How are they sorted? Can the user search? |
| Rapid repeated clicks | How do you prevent duplicate work? (See idempotency key in `api-design`) |
| Two people edit at once | Who wins? What does the other person see? (See ETag in `api-design`) |
| Connection drops midway | Is the entered data lost? Does a retry create a duplicate? |
| Session timeout | Does the user get kicked out at once, or is their input kept? |
| Boundary values | 0 · negative values · today · last day of the month · leap year |
| Unusually long text | Does a 200-character name break the layout? |
| Thai text and special characters | Does sorting work? Does search find it? Do emoji break anything? |
| External system does not respond | How many seconds to wait? How many retries? What does the user see meanwhile? |
| Insufficient permission | Visible but not clickable, or not visible at all? **Choose one clearly.** |


## reference: feature-kickoff.md

<!-- merged from skill `feature-kickoff` on 2026-11-27 · description was: Start a feature — business analyst → solution architect → system analyst → planning. Requirements, FSD, architecture. -->
> **Shortcut into SuperUser:** open the `superuser` skill with the `feature` playbook, then copy the playbook's steps into the todo first. The steps below give the work format and the output of this command; use them together with the playbook, not in place of it.

You will run a complete feature kickoff workflow. The feature is:

**the user's request**

Execute these steps **in order**, using sub-agents:

1. **Business Analyst** — Use the `business-analyst` agent to:
   - Ask the user once at the start, only what would change the whole BRD (other unknowns → `(รอยืนยัน)`, keep going)
   - Produce a Business Requirements Document (BRD) with objective, scope, stakeholders, business rules
   - Write user stories with acceptance criteria into `docs/USER-STORIES.md` (`user-story-writer.md` — read the file first, continue its IDs, update the index table)

2. **Solution Architect** — Use the `solution-architect` agent to:
   - Propose high-level architecture
   - Recommend tech stack with trade-offs (use the `architecture` skill)
   - Identify non-functional requirements (NFRs)

3. **System Analyst** — Use the `system-analyst` agent to:
   - Write a Functional Specification Document (FSD) with use cases
   - Define API endpoints
   - Create data model

4. **Project Manager** — Use the `project-manager` agent to:
   - Estimate phases / milestones
   - Identify dependencies and risks
   - Produce a project plan where every task starts with a 3-line header a developer can act on without re-reading the FSD: **Files** to create or touch · **Interfaces** it adds or changes (signature, endpoint, table) · **Failing test** that proves it, written before the code

Run all 4 roles in one go without stopping to ask. Report once at the end and list your own judgment calls under **ตัดสินใจเอง**.

## References

- [`sources.md`](feature-kickoff/sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: figures.md

# Figures in an FSD document

This table says which figure type belongs in which FSD section. The drawing tool and the color theme are in `SKILL.md` item 10.

| Section | Figure to include |
|---|---|
| 3 Process overview | Flowchart of the work from start to finish |
| 4 Use cases with several parties | Sequence diagram |
| 5 Screens | Screen sketch with numbers pointing to the field table |
| 6 States | State diagram — **a companion to the table, not a replacement** |
| 8 Data | ER diagram of only the tables this module touches |


## reference: fsd-vs-srs.md

# How an FSD differs from an SRS

This table compares the two documents one dimension at a time. Use it when you must decide whether a piece of content belongs in the SRS or the FSD.

| | SRS | FSD |
|---|---|---|
| Question answered | What the system **must be able to do** | **How** the system does it |
| Main readers | Customer · executives · the person who signs off | developer · tester · ux |
| Level of detail | "The system must let users cancel an order" | Where the button sits · which statuses allow cancelling · who has permission · what confirms it · what message appears when cancelling is impossible · what the system does next |
| Changes | Need approval and affect the contract | Can change inside the team, as long as they still meet the same SRS item |
| Content unit | Requirement (`FR-…`) | Use case (`UC-…`) + screen requirement (`SC-…`) |
| Numbers | Come from the customer | Come from the SRS; never invent new ones |


## reference: fsd-writing.md

<!-- merged from skill `fsd-writing` on 2026-11-27 · description was: Use when writing or reviewing a Functional Specification Document -->
# Writing a Functional Specification Document (FSD)

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [Read more when](#read-more-when)
- [0 · Look for an existing template first (every time)](#0--look-for-an-existing-template-first-every-time)
- [1 · How an FSD differs from an SRS — the boundary must be clear](#1--how-an-fsd-differs-from-an-srs--the-boundary-must-be-clear)
- [2 · Working order](#2--working-order)
- [3 · Document outline](#3--document-outline)
- [4 · Use cases — one format across the document](#4--use-cases--one-format-across-the-document)
- [5 · Screen requirements](#5--screen-requirements)
- [6 · State diagram — the point FSDs forget most often](#6--state-diagram--the-point-fsds-forget-most-often)
- [7 · Business rules separate from the steps](#7--business-rules-separate-from-the-steps)
- [8 · Errors and edge cases to answer in full](#8--errors-and-edge-cases-to-answer-in-full)
- [9 · Codes and traceability](#9--codes-and-traceability)
- [10 · Figures in the document](#10--figures-in-the-document)
- [11 · Completeness review before sending](#11--completeness-review-before-sending)

> For Thai text, use the business register (`human-writing` `thai-grammar.md` section 4).

> **The one rule:** An FSD is done when a developer can read it and **write code without guessing or asking**.
> Every point that forces a guess becomes rework after delivery.

## When to use this skill

- Writing an FSD or Functional Spec for a feature, a module, or a whole system
- Expanding a Software Requirements Specification (SRS) or Business Requirements Document (BRD) to a level detailed enough to build from
- Reviewing someone else's FSD, where you must say what is missing
- A developer keeps asking the same questions while building. That means the FSD is incomplete.

Not for: requirements a customer signs off → `srs-writing.md` · user stories for a sprint → `user-story-writer.md` · endpoints of one feature → command `/api-design` (system-wide agreements → `api-design`) · tables and columns → `database-design`

## Read more when

| File | Open when |
|---|---|
| [references/worked-examples.md](worked-examples.md) | You are writing the first use case, screen, state table, or business rule of the document. Open the full examples and copy the format. |
| [references/edge-cases.md](edge-cases.md) | You are writing the errors and edge cases section, and when you review before sending, to cover every case. |
| [references/fsd-vs-srs.md](fsd-vs-srs.md) | You are unsure whether a piece of content belongs in the SRS or the FSD. Open this comparison table. |
| [references/stakeholder-doc-templates.md](stakeholder-doc-templates.md) | You are writing an easy-to-read FSD for stakeholders (Mode B, the same 11 sections as item 3), or you need a reviewer-friendly template for a use case, API endpoint, or data model. |
| [references/figures.md](figures.md) | You are planning which section needs which figure type. |
| [references/outline-sections.md](outline-sections.md) | You must decide which section can be skipped. Open this table. The full copy-and-fill outline is in [assets/fsd-outline.md](../assets/fsd-outline.md). |
| [references/related-skills.md](related-skills.md) | The task needs another skill alongside this one, such as figures, API agreements, or test cases. Open it to see which one. |

## 0 · Look for an existing template first (every time)

Before you use the outline or templates in this file, check whether the user, customer, or project already has its own:

- **Where to look:** the FSD (Functional Specification Document) template from the client or the TOR (terms of reference) · an earlier FSD of the same system · the screen spec template the dev team uses (look in `docs/`, or ask the user one question)
- **Result:** Found → use it (sections, order, field names, numbering) and say in the reply which file it came from. Not found → use the template in this file as a fallback and say that no earlier template was found.
- **Still required in every template:** the FSD/SRS boundary in item 1 and linking codes to use cases.

## 1 · How an FSD differs from an SRS — the boundary must be clear

These two documents get mixed up most often. The result is an SRS so long the customer does not read it, and an FSD so shallow that developers must ask.
The SRS says what the system **must be able to do**. The FSD says **how** the system does it. A dimension-by-dimension comparison is in [references/fsd-vs-srs.md](fsd-vs-srs.md).

> **An FSD must not create new requirements.** When you find something the SRS does not cover, **add it to the open-questions list**, mark it `(รอยืนยัน)` (awaiting confirmation), and keep working on the rest.
> The item must be added to the SRS first. Do not write it quietly into the FSD.
> An item that shows up in the FSD with no source is one the customer will refuse to pay for at acceptance.

## 2 · Working order

1. Read the whole SRS or BRD first, then **list the items that are still unclear**. Ask once, at the start, as multiple choice. Every option has evidence (skill `superuser` item 6). Ask only about items where different readings would change the whole deliverable (options = the possible readings, citing the item in the SRS/BRD). Mark the rest `(รอยืนยัน)` and keep going.
2. Confirm who the document is for: developers only (**Mode A**, the default), or also a customer who reads it to sign off (**Mode B**: the same 11 sections in the same order, only laid out so a reviewer can read them easily; see [references/stakeholder-doc-templates.md](stakeholder-doc-templates.md)).
3. Go use case by use case, not screen by screen. Screens come from use cases, not the other way around.
4. Write the business rules separately first, then refer to them from the steps (item 7).
5. Build the traceability matrix as you go, not at the end.
6. **Draw, then collect questions.** While drawing the sequence diagram, cancellation flow, and ERD, you will find matters the stories and SRS do not answer (for example, whether a course deducts a session at booking or at attendance). Note them at the end of the document as questions with a proposed answer marked `(รอยืนยัน)`. Do not choose for the customer.
7. Review by item 11 before sending.

## 3 · Document outline

There are 11 sections, in this order: Introduction · Users and permissions · Process overview · Use cases · Screen requirements · State diagram · Business rules · Data and integrations · Errors and edge cases · Traceability matrix · Revision history.
You may skip only the screen requirements if there is no screen, and the state diagram if there are no states. The full outline is in **[`assets/fsd-outline.md`](../assets/fsd-outline.md)**. The table of the question each section answers is in [references/outline-sections.md](outline-sections.md).

## 4 · Use cases — one format across the document

Every use case has a header table (comes from · actor · preconditions · result on success · frequency), followed by tables for the main steps, alternatives, and error cases. The full example UC-ORD-010 is in [references/worked-examples.md](worked-examples.md).

**Rules for a use case:**

- **One use case = one user goal**, not one screen.
- Every use case needs at least one **alternative** and one **error case**.
  A use case with only the smooth path is a use case that is not finished.
- The "what the system does next" column must not be empty. An empty cell means nobody has worked out how the system responds.
- **Always re-check preconditions on the server.** Hiding a button is not access control.
- Write it as alternating "user does → system responds", not as a paragraph of narrative.

## 5 · Screen requirements

The full example SC-ORD-020 with its field table is in [references/worked-examples.md](worked-examples.md).

**Every screen must specify all 6 things:**

| Required | Detail |
|---|---|
| Field table | Type · required or not · validation rule · **the actual error message** · default value |
| Permission per role | Which role can see · edit · only read · not see at all |
| The five screen states | Empty · loading · error · partial · success (see `ui-craft`) |
| Actions and results | Which button goes where · which button opens a confirmation box |
| Display rules | Date format · decimals for money · rounding · time zone |
| Data source | Which endpoint or table this field comes from |

> **"The actual error message" means the words the user will really see**, not "show a warning message".
> If you leave it out, the developer will invent one, and the system will end up with ten different phrasings.
>
> **Display rules must be written down.** A "total" that does not say how it rounds
> is a bug you will find at month-end reconciliation.

## 6 · State diagram — the point FSDs forget most often

Anything with a "status" (an order, a leave request, a work ticket, a document) needs a table with the columns From · To · Who can do it · Condition · Side effects, and **must not have only a picture**. A sample table is in [references/worked-examples.md](worked-examples.md).

**Rules:**

- **A transition not in the table is a transition that must be rejected.** Write a clear "not allowed" row.
  What is forbidden is the hardest thing to test if nobody wrote it down.
- Every state needs an exit, except a final state that is meant to end.
- Side effects on other systems (email, stock, accounting) belong in this table, not hidden in the steps.

## 7 · Business rules separate from the steps

Each rule has a code, a name, the rule text, and a source. A sample BR-030 is in [references/worked-examples.md](worked-examples.md).

- **Write each rule in one place**, then cite it by code from everywhere it applies. If you copy it into three places, someday you will miss one when you change it.
- Every rule needs a **source**. A rule with no source is a rule the team made up.
- A rule that changes over time (tax rate, fee) must say **where it is stored**:
  in code, in a settings table, or editable by the system administrator.

## 8 · Errors and edge cases to answer in full

The edge-case table is what the test team will use, and it is what most FSDs lack. It runs from no data, rapid repeated clicks, and two people editing at once, to insufficient permission. Go through every row in [references/edge-cases.md](edge-cases.md) and answer every row that touches the feature.

## 9 · Codes and traceability

```
UC-<module>-<3-digit number>      use case              UC-ORD-010
SC-<module>-<3-digit number>      screen requirement    SC-ORD-020
BR-<3-digit number>               business rule         BR-030
```

Use the same system as `srs-writing.md`: **number in steps of 10**, and **never reuse a code that has been issued**.

| SRS | FSD | Screen | test case | Status |
|---|---|---|---|---|
| FR-ORD-040 | UC-ORD-010 | SC-ORD-020 | TC-ORD-010..014 | Done |
| FR-ORD-040 | UC-ORD-010 · 010-E1 | SC-ORD-020 | TC-ORD-015 | Done |

- **Every use case must trace back to a requirement in the SRS.** If it cannot, someone added a bonus nobody ordered.
- **Every requirement in the SRS must have at least one use case.** If it has none, it was forgotten.
- Alternatives and error cases need their own test cases. Do not count them with the main path.

## 10 · Figures in the document

The table of which section needs which figure type is in [references/figures.md](figures.md). The point to remember: a state diagram goes **with the table, not instead of it**.

Every figure in an FSD document (Mode A and Mode B, in markdown and in the file the customer signs off) uses `diagrams` in one house style. Screen sketches use `diagrams`.
Mermaid through `diagrams` is only for drafts discussed in chat. Do not put it in a delivered document.
**Every figure in one version uses the same color theme**, per `doc-theme` (see `design-gate/polished-document-style`).

## 11 · Completeness review before sending

**Completeness**

- [ ] Every requirement in the SRS has at least one use case
- [ ] Every use case has at least one alternative and one error case
- [ ] Every screen has a field table with all 5 columns, and the five states
- [ ] Everything that has a status has a state transition table, including the "not allowed" rows
- [ ] Every relevant row of the edge-case table in item 8 is answered

**Clarity**

- [ ] No phrase such as "as appropriate", "automatically", or "as needed" without saying what it means
- [ ] Every error message is written as real words, not "show a warning message"
- [ ] Every number has a unit and a source
- [ ] Field names, status names, and endpoint names are in English, matching what the real code will use

**Consistency**

- [ ] The same word means the same thing throughout (there is a glossary)
- [ ] State names match across the diagram, the table, and the use cases
- [ ] No new requirement that is missing from the SRS

> **Final test:** Have one developer who was not in the meeting read it.
> Every question they ask is one gap to fill before sending.

If nobody is free to read it, use a fresh agent that gets only the FSD file. Have it answer 8–10 questions that a developer and QA would ask (for example, "what happens on a duplicate booking?" and "which states can be reversed?"). Fix every answer that is wrong or says "I don't know" before sending. For the method and the Thai-specific questions (B.E. years · document number format), see [`../requirements-writing/references/reader-test.md`](../../requirements-writing/references/reader-test.md).

**Once code exists, compare the FSD with the real code.** Do this when you review the FSD after a build or before taking over a fix.

- Go code by code through item 9. Search the code and tests for use case codes and screen names (`rg -n "UC-0[0-9]+" --glob '!**/node_modules/**' | head -50`). A code that appears nowhere in the code or tests is a gap. Answer whether it is not built yet or built under another name.
- Compare the 3 places that differ most often: field table (item 5) ↔ validation code · state transition table (item 6) ↔ the code that changes state (including "not allowed" rows) · error messages (item 8) ↔ strings in the code.
- Record each difference as a table `| spec:line | file:line | who is right |` and let a person decide. During the review, do not change the FSD to match the code, and do not change the code to match the FSD.


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


## reference: outline-sections.md

# FSD sections and when you may skip them

This table sums up the question each FSD section answers. The full outline with fill-in hints is in [`../assets/fsd-outline.md`](../assets/fsd-outline.md).

| # | Section | Question it answers | Skippable? |
|---|---|---|---|
| 1 | Introduction · scope · references | What does this version cover? Which SRS items does it cite? | No |
| 2 | Users and permissions | Who can do what? | No |
| 3 | Process overview | How does the work flow from start to finish? | No |
| 4 | Individual use cases | How is each task done, step by step? | No |
| 5 | Screen requirements | What is on the screen? What does each field validate? | Skippable if there is no screen |
| 6 | State diagram | Which states can this item move between? | Skippable if there are no states |
| 7 | Business rules | Which rules are enforced? | No |
| 8 | Data and integrations | What data is used? Which systems connect? | No |
| 9 | Errors and edge cases | How can it fail, and what does the user see? | No |
| 10 | Traceability matrix | Which SRS item does this come from, and what tests it? | No |
| 11 | Revision history | Who changed what, and when? | No |


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


## reference: related-skills.md

# Links to other skills

If the task needs knowledge beyond the FSD, open the skill in the right-hand column alongside this one.

| Need | Use with |
|---|---|
| Requirement level the customer signs off | `srs-writing.md` |
| Markdown format and color theme of the document | `design-gate/polished-document-style` |
| Look of the exported .docx file | `document-design` |
| Figures in the document | `diagrams` (every figure in a delivered document) · `diagrams` (screen sketches) · `diagrams` (Mermaid drafts for chat only) |
| API agreements the FSD refers to | `api-design` |
| Data model the FSD refers to | `database-design` |
| The five screen states and design rules | `ui-craft` + the platform skill |
| Turning use cases into test cases | `qa-docs` |
| Splitting into user stories at sprint start | `user-story-writer.md` |
| Cutting unneeded content from the document | `superuser:ground-rules` |

**Document outline you can copy and fill in right away** → [`../assets/fsd-outline.md`](../assets/fsd-outline.md)


## reference: review-checklist.md

# SRS completeness review

Use with `requirements-writing` → `references/srs-writing.md` section 8. Go through all of it before every send. "Section 5" means the chapter of non-functional requirements in `SKILL.md`.

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


## reference: sources.md

# Sources · user-story-writer

- The "Blocked by" rule is adapted from mattpocock `to-tickets` (MIT).
- Interview-notes rules come from a real shop job: 36 stories · 19 open questions · 6 items the system had that the shop did not ask for.


## reference: srs-writing.md

<!-- merged from skill `srs-writing` on 2026-11-27 · description was: Use when writing a Software Requirements Specification -->
# SRS Writing — a Software Requirements Specification where every requirement can be tested

> **One rule:** every requirement must let you write a **test case** from it right away. If you cannot, it is not a requirement, just a hope.

## Use when
- Writing a Software Requirements Specification (SRS)
- Reviewing an SRS someone else wrote, before sign-off
- Turning meeting notes into usable requirements
- Preparing documents for a tender or statement of work (SOW)

Not for: user stories → `user-story-writer.md` · why a technology was chosen → `architecture` · screen-level spec → `fsd-writing.md` · look of the Word file → `document-design`

## Steps
1. **Find an existing format first.** Look for the client's TOR (Terms of Reference), the scope in the contract, the agency's forms, and the earlier SRS of the same system in `docs/`. If none is in files, ask the user one question: does the client require a document format? If found, use its headings, order, field names and running numbers, and say which file it came from. If not found, use this skill's template and say no earlier format was found. In every format: a small internal system drops sections with nothing in them; a system with legal rules or an inspector uses everything the TOR orders; testable requirement IDs are always needed.
2. Collect before writing: who uses it · how work is done now · the problem · how success is measured · systems to connect · legal obligations.
3. Draft the outline from `assets/srs-outline.md` (headings only). Declare one line at the top saying which section is `เขียน` · `ข้าม (เหตุผล)` · `ตัดออก`. Do not fill a slot just because the template has it.
4. Write scope and stakeholders before requirements. Section 1.2 Scope must have both "in scope" and "out of scope".
5. Write each requirement by "Requirement rules" below and assign its ID at once.
6. Write non-functional requirements (NFRs) by "NFR rules" below.
7. Build the traceability tables. This is the step people skip most, and it is what gives value when a change request arrives.
8. Add figures. Figures in the SRS itself use `diagrams`; quick figures outside the SRS (README · PR) use `diagrams`. One colour theme per document, declared at the top per `design-gate/polished-document-style`.
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
- Ask every category in [`nfr-categories.md`](nfr-categories.md); forgotten maintenance and backup hurt most.
- Every number comes from the customer, not the writer. If the customer does not know, propose a number and record it as an assumption in section 2.
- Never guess silently a fact the interviewee did not state (service time or price · whether discounts stack · travel cost per vehicle or per person). Flag the item "(รอยืนยัน)", write the assumption used with the source question number, and summarise at the end of the document in a table: question → assumption → business rule that uses it.
- Every NFR has a "how to measure" column (for example `scrollWidth ≤ 375` · requests sending images off the device = 0).

## Check before done
- Go through [`review-checklist.md`](review-checklist.md) in full before every send.
- Fresh-reader test: a new agent that gets only the SRS file answers 8–10 questions a developer and QA would ask. A wrong or "don't know" answer is a point to fix. If it has not passed, do not send to the customer (see `reader-test.md`).
- No "out of scope" list missing · not every item "Must" · no vague word left · IDs unique · version number and revision history present.

## References
- [`structure-options.md`](structure-options.md) — open when choosing sections by project type, writing 2.6 or 3.6 (AI/ML), adding figures, or writing a Thai/English document
- [`nfr-categories.md`](nfr-categories.md) — open when writing section 5 or converting a vague customer word into a number
- [`brd-template.md`](brd-template.md) — open when writing the Business Requirements Document before the SRS
- [`reader-test.md`](reader-test.md) — open when running the fresh-reader test


## reference: stakeholder-doc-templates.md

# Stakeholder document (Mode B) — style, diagrams, templates

**สารบัญ:** Document Structure · Formatting Rules (hierarchy · markers · callouts · tables · badges) · Diagrams · Templates: Use Case · API Endpoint · Data Model

Moved from the system-analyst agent. Read when writing a Mode B document. A Mode A use case follows `SKILL.md` §4 and [`worked-examples.md`](worked-examples.md); the templates below are the same content in reviewer-friendly form, never a different format.

Mode B is **the same FSD** as Mode A — the same 11 sections in the same order as `SKILL.md` §3 — styled for reviewers who sign off: a short summary up front, plain words, more tables, less code. It never adds or drops a section; only the style changes. Diagrams follow `SKILL.md` §10. IDs follow `SKILL.md` §9 (`UC-<module>-<3 digits>`, steps of 10).

## Document Structure

Every stakeholder doc MUST follow the 11 FSD sections (`SKILL.md` §3, full outline in [`assets/fsd-outline.md`](../assets/fsd-outline.md)):

````markdown
# <Document Title>

> **Version:** 1.0 · **Date:** YYYY-MM-DD · **Status:** Draft | Review | Approved
> **Authors:** ... · **Reviewers:** ...

---

## Table of Contents

1. [Introduction](#1-introduction) — starts with a one-paragraph summary for non-technical readers
2. [Users & Permissions](#2-users--permissions)
3. [Process Overview](#3-process-overview)
4. [Use Cases](#4-use-cases)
5. [Screen Specifications](#5-screen-specifications)
6. [State Machines](#6-state-machines)
7. [Business Rules](#7-business-rules)
8. [Data & Integrations](#8-data--integrations) — API endpoints and data model go here
9. [Errors & Edge Cases](#9-errors--edge-cases)
10. [Traceability](#10-traceability)
11. [Revision History](#11-revision-history)

---

## 1. Introduction

> **For non-technical readers** — 1 paragraph explaining what this feature does and why.

### Scope

**In scope**
- ...

**Out of scope**
- ...

### Glossary
- ...

[... continue all 11 sections; skip 5 only if there are no screens and 6 only if nothing has a status ...]
````

## Formatting Rules

### Hierarchy & Numbering
- H1 = document title (only ONE)
- H2 = numbered sections (1., 2., 3.)
- H3 = sub-sections (1.1, 1.2)
- Always add TOC for docs with 5+ sections
- Use anchor links in TOC

### Visual Markers

No emoji or icons in headings, body, tables, labels or callouts (`human-writing` · `design-gate/polished-document-style`). Use words:

| Need | Write |
|--------|---------|
| Yes / no in a table | ✓ / ✗ |
| Status | Draft · Approved · Pending · In Progress |
| Severity or priority | Critical · High · Medium · Low |
| Tip, warning, critical, note | Bold callout label (below) |

### Callout Boxes (Blockquotes)

```markdown
> **Tip:** Brief insight here.

> **Warning:** Important caveat.

> **Critical:** Must read before proceeding.

> **Note:** Additional context.
```

### Tables

Prefer tables over bullet lists when data has 2+ attributes:

```markdown
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✓ | User's email |
| age | number | ✗ | Optional |
```

Align headers to data when helpful:
```markdown
| Field | Type | Required |
|:------|:-----|:--------:|
```

### Status Badges (in tables/inline)

```markdown
**Status:** Approved
**Priority:** High
**Risk:** Medium
```

---

# Diagrams

Follow `SKILL.md` §10. A Mode B document is delivered to people who sign it, so every figure is a house-style figure made with `diagrams` (same theme for every figure in one document, per `doc-theme`). Mermaid through `diagrams` is only for a quick sketch in chat, never for the delivered file. Screen sketches use `diagrams`.

## When to use which diagram

| Diagram | Use for | FSD section |
|---------|---------|---|
| Flowchart | Business processes, decision trees | 3 Process Overview |
| Sequence diagram | Interactions between systems/actors over time | 4 Use Cases (multi-party) |
| State diagram | Object lifecycle, status transitions — **next to the table, not instead of it** | 6 State Machines |
| ER diagram | Tables of this module only | 8 Data & Integrations |
| Timeline (Gantt) | Schedule, if the document has one | appendix |

Embed each figure as an image with a numbered caption, for example `![Figure 4-1 Place order — sequence](figures/uc-ord-010-sequence.svg)`.

---

# Templates

## Use Case Template (Mode B)

````markdown
### UC-ORD-010: <Use Case Name>

| Field | Value |
|-------|-------|
| **ID** | UC-ORD-010 (next use case in this module: UC-ORD-020) |
| **From (SRS)** | FR-ORD-040 |
| **Actor** | Customer |
| **Priority** | High |
| **Status** | Approved |
| **Trigger** | User clicks "Place Order" |
| **Frequency** | ~200 per day `(รอยืนยัน)` |

#### Preconditions
- User is authenticated
- Cart contains at least 1 item

#### Postconditions
- Order created with status `pending`
- Inventory reserved
- Confirmation email sent

#### Main Flow

| Step | Actor | Action | System Response |
|:----:|:------|:-------|:----------------|
| 1 | User | Reviews cart and clicks "Place Order" | Shows order summary |
| 2 | User | Confirms payment method | Validates payment info |
| 3 | System | Submits payment to gateway | Receives auth code |
| 4 | System | Creates order record | Returns order #ORD-XXXX |
| 5 | System | Sends confirmation email | — |
| 6 | User | Sees confirmation page | — |

#### Alternative Flows

> **010-A1: Payment declined at step 3**
> 3a. Gateway returns decline
> 3b. System shows error, suggests alternate payment
> 3c. Returns to step 2

#### Exception Flows

> **010-E1: Gateway timeout at step 3**
> 3a. System waits 30s
> 3b. Logs incident, marks order as `payment_pending`
> 3c. Sends "We'll retry" email to user

#### Sequence Diagram

![Figure 4-1 UC-ORD-010 Place order — Customer, UI, API, Payment Gateway, Database](figures/uc-ord-010-sequence.svg)

> Drawn with `diagrams` (house style). Steps: Customer clicks "Place Order" → UI sends POST /orders → API charges the gateway → gateway returns auth code → API inserts the order → UI shows the confirmation page.
````

## API Endpoint Template (Mode B)

````markdown
### POST `/api/v1/orders`

> Create a new order from cart contents.

| Attribute | Value |
|-----------|-------|
| **Auth Required** | Yes (Bearer token) |
| **Rate Limit** | 10 req/min per user |
| **Idempotent** | Yes (use `Idempotency-Key` header) |

#### Request Headers

| Header | Required | Example |
|--------|:--------:|---------|
| `Authorization` | ✓ | `Bearer eyJ...` |
| `Idempotency-Key` | Recommended | `unique-request-id` |
| `Content-Type` | ✓ | `application/json` |

#### Request Body

```json
{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "shipping_address_id": "uuid",
  "payment_method_id": "uuid"
}
```

#### Response: 201 Created

```json
{
  "data": {
    "id": "ORD-12345",
    "status": "pending",
    "total": 1250.00,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### Error Responses

Every error body is `application/problem+json` (RFC 9457): `type` · `title` · `status` · `detail` · `requestId`, plus `errors[]` for validation. Shape and status rules: `web-service-essentials` §2.

| Code | When | `type` (suffix) |
|:----:|:-----|:-----|
| 401 | Missing/invalid token | `unauthorized` |
| 402 | Payment declined | `payment-declined` |
| 409 | Inventory unavailable | `out-of-stock` |
| 422 | Validation failed | `validation` + `errors[]` (`field` · `code` · `message`) |
| 429 | Rate limit exceeded | `rate-limited` + `Retry-After` header |
````

## Data Model Template (Mode B)

````markdown
## 8. Data & Integrations

### Entity Relationship Diagram

![Figure 8-1 Order module — USER places ORDER, ORDER contains ORDER_ITEM](figures/order-er.svg)

> Drawn with `diagrams` (house style), tables of this module only.

### Tables

#### `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation |

> **Security:** `email` is encrypted at rest using AES-256.
````

---


## reference: structure-options.md

# SRS structure options, figures, bilingual rules

Open this when choosing which sections to write, adding figures, or writing a Thai/English document.

Structure is based on ISO/IEC/IEEE 29148. The full outline with hints per section is in `assets/srs-outline.md`. For the Business Requirements Document (BRD), written before the SRS, use [`brd-template.md`](brd-template.md).

## Two subsections ISO 29148 has that people forget

(Idea from jam01/SRS-Template, which states no licence, so this is rewritten in our own words.)

| Subsection | What to put in | When it is needed |
|---|---|---|
| 2.6 Apportioning of requirements | A table of which release · milestone or subsystem each group of requirements goes to, and which items are **deferred to a later round**. For an item whose destination is not yet known, write "not yet apportioned" and track it as a pending task | More than 1 release or 1 team · matches the `milestone` column of `spec-to-code-loop` |
| 3.6 Systems with AI/ML | 6 items: what the model does and which number measures a pass · where training data comes from, who consented, how it is stored · guardrails (check input · filter output · limit the actions it can take · fallback) · fairness and explainability · points where a person must check before it takes effect · release, monitoring, retraining, and retiring the model | Every system that calls an LLM or has a model; write it together with `ai-engineering` and `pdpa-compliance` |

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
| Every figure in the SRS itself (overview · flowchart · sequence · ER · state), whether delivered as markdown, .docx or PDF | `diagrams` (sharp image files, placement under your own control, source files kept in the repo so git can track them) |
| Quick figures in a README · PR · code note, outside the SRS | `diagrams` (Mermaid) |

Every figure in one document uses the same colour theme. Declare the theme at the top per `design-gate/polished-document-style` section "ธีมของเอกสาร" (Document theme); every tool reads values from that one place.

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
- First time a technical term appears, write Thai (full English name: abbreviation), for example ปัญญาประดิษฐ์ (Artificial Intelligence: AI), per the rule "เอกสารภาษาไทย" in `human-writing/spell-out-abbreviations`. Afterwards use the Thai or the abbreviation, one way through the document.
- Thai text: `human-writing` `references/thai-grammar.md` section 4, the business register.
- Field names, API names, and status names in the database are always English even if the document is Thai; otherwise people translate them differently when writing code.
- Complete the glossary in section 1.3: Thai term · English term · meaning · name in the system.
- Fonts and page layout of the Word file: `document-design`.

## Anti-patterns

- Pasting meeting notes in as requirements (different form, different level of detail).
- Putting already-designed screens into the SRS (screen sketches belong in the FSD).
- Non-functional requirements written together as one paragraph; split into items with IDs.
- No version number and revision history.
- Sending a Word file with the default look (see `document-design`).
- Every item "Must", no "out of scope" section, vague items, invented numbers, reused IDs: covered by the rules in `SKILL.md`.

## Other skills to use together

`design-gate/polished-document-style` (markdown while drafting) · `fsd-writing.md` (detail a developer can start from) · `user-story-writer.md` (break into stories) · `qa-docs` (turn requirements into test cases) · `superuser:ground-rules` (cut unneeded content) · `slide-deck` (present to executives).


## reference: user-story-writer.md

<!-- merged from skill `user-story-writer` on 2026-11-27 · description was: Use when writing user stories with acceptance criteria -->
# User Story Writer

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [Workflow](#workflow)
- [Which file to write to](#which-file-to-write-to)
- [When starting from interview notes](#when-starting-from-interview-notes)
- [INVEST Checklist (check before sending)](#invest-checklist-check-before-sending)
- [Output Template](#output-template)
- [Example](#example)
- [Prohibitions](#prohibitions)
- [How the document looks](#how-the-document-looks)
- [References](#references)

## When to use this skill

- The user asks for a new user story
- A requirement arrives as long text and must be split into stories
- You must write acceptance criteria
- You must review or refine an existing user story that is unclear

Do not use when: you need a full requirements document → `srs-writing.md` · a screen spec → `fsd-writing.md` · writing test cases → `qa-docs`

## Workflow

1. **Collect complete information** before writing. Ask if anything is missing:
   - Who is the user (persona/role)
   - What do they want to do
   - Why (business value)
   - Are there any constraints or business rules

2. **Write the user story in this format**:
   ```
   As a <type of user>
   I want <some goal>
   So that <some reason / business value>
   ```

3. **Write the acceptance criteria (AC)** in Given-When-Then form:
   ```
   Given <precondition>
   When <action>
   Then <expected result>
   ```
   - At least 1 happy path
   - At least 1 edge case / error case

4. **Add extra metadata**:
   - Priority (High/Medium/Low)
   - Story Points — use Fibonacci: 1, 2, 3, 5, 8, 13 · **the developers or the team estimate** · the story author (for example `business-analyst`) leaves it blank, or enters a proposed value with `(เสนอ · รอทีมประเมิน)` (proposed · awaiting team estimate)
   - Dependencies (if any)

5. **Save to a file** — see the next section. A story that exists only in chat counts as not yet written.

## Which file to write to

Every story lives in the single file **`docs/USER-STORIES.md`**, starting from the template [assets/user-stories.md](../assets/user-stories.md)

- **Always read the file before writing.** If it exists, continue the ID numbering from the last one, and edit an existing story in place instead of creating a duplicate.
- **Never reuse an ID.** For a story that is dropped, change its status to Dropped and do not delete it.
- **The index table at the top must always match the content.** When you add or change a story, update its table row in the same round. `/sprint-plan` reads from this table.
- **The reference column** holds the story's source, such as a requirement in the Software Requirements Specification (SRS) (`REQ-xxx`), a business rule (`BR-xxx`) or a change request (`CR-xxx`), so it can be traced back.
- **When you change the AC of a story that has started or finished (In sprint or Done)**, record it in the change history section at the end of the file. Then search `qa/` for test cases that cite that `US-xxx, ACn`, and put their names in the "test cases to fix" cell. Do not edit the Quality Assurance (QA) team's files yourself.
- **Over 30 stories, or several epics worked by separate teams:** move the content to `docs/stories/<epic>.md`. The index table stays in `docs/USER-STORIES.md` only.

## When starting from interview notes

- **Cover everyone who spoke.** Go person by person. Every person needs at least 1 story, or a reason why there is none.
- **Never drop statements that contradict each other.** Write the story that respects the shop's rule first, then raise the conflict as a question. (Example from that job: the shop forbids storing customers' face photos, but customers want to upload selfies → the story analyzes on the device without storing, then asks the shop whether it accepts.)
- **Close the file with a section "คำถามที่ยังไม่ชัด" (open questions).** Every item has a number, the proposed options and the story it blocks.
- **Users nobody mentioned.** The shop owner always needs their own story (for example, mark a service as finished). Anything the builders added on their own that nobody asked for (an admin page · an owner account) goes in a list "ระบบมีแต่ร้านไม่ได้ขอ" (things the system has that the shop did not ask for), and you ask back whether the shop accepts it. Never leave it to be treated as agreed.

## INVEST Checklist (check before sending)

Every story must meet these criteria:

- [ ] **I**ndependent — does not depend on another story
- [ ] **N**egotiable — open to discussion of details
- [ ] **V**aluable — has clear business value
- [ ] **E**stimable — effort can be estimated
- [ ] **S**mall — small enough to finish within 1 sprint
- [ ] **T**estable — can be tested

## Output Template

```markdown
## US-XXX: <short title>

**Story**
As a <role>
I want <goal>
So that <value>

**Acceptance Criteria**

AC1: <scenario name>
- Given <context>
- When <action>
- Then <result>

AC2: <scenario name>
- Given ...
- When ...
- Then ...

**Priority:** High | Medium | Low
**Story Points:** X
**Blocked by:** US-YYY (a story that must finish before this one can start) · none → write `None (เริ่มได้ทันที)`
**Notes:** extra information / business rules
```

**List in Blocked by only real blockers**. Story A blocks B when B cannot start until A is done (it needs A's table, API or screen), not merely when A "should come first". Order `USER-STORIES.md` so a blocker comes before the story it blocks. The team or agent picks work from the set "every story whose blockers are all done", which is the set that can run in parallel. If you use a real tracker (GitHub · Linear), use its blocking relationship, not only text in the description.

## Example

See the full example at [`examples/login-story.md`](examples/login-story.md)

## Prohibitions

- Do not write a technical solution in a story (for example "use JWT")
- Do not write UI detail (for example "blue button") — the designer decides
- Do not use plain "user". Name a specific role (admin, customer, guest).
- Do not write a story bigger than 13 points — split it

---

## How the document looks

This skill decides **what content the document needs**, not **how it looks**.
Load the skill that matches the destination before you start writing, not after you finish:

| Delivered as | Load |
|---|---|
| Markdown that people read (repo · wiki · tracker) | `design-gate/polished-document-style` |
| A `.docx` / `.pptx` / PDF that stakeholders sign off | `document-design` |
| Needs a picture to be understood | `diagrams` (the house style of project documents) |

## References

- [`sources.md`](sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: worked-examples.md

# Full examples of a use case, screen, state diagram, and business rule

Every example in this file follows one story: cancelling an order. Copy the format and use it right away. The rules for each format are in `SKILL.md`. The Thai text inside the code blocks is sample output for a Thai FSD, so it stays in Thai.

## Use case (item 4)

```markdown
### UC-ORD-010 · ยกเลิกคำสั่งซื้อ

| | |
|---|---|
| **มาจาก** | FR-ORD-040 |
| **ผู้ทำ** | ลูกค้า · เจ้าหน้าที่ฝ่ายขาย |
| **เงื่อนไขก่อนเริ่ม** | เข้าสู่ระบบแล้ว · คำสั่งซื้ออยู่ในสถานะ `confirmed` |
| **ผลเมื่อสำเร็จ** | คำสั่งซื้อเป็น `cancelled` · คืนจำนวนสินค้าเข้าคลัง · ส่งอีเมลแจ้ง |
| **ความถี่** | ประมาณ 30 ครั้งต่อวัน |

**ขั้นตอนหลัก**

| # | ผู้ทำ | การกระทำ | ระบบทำอะไรต่อ |
|:--:|---|---|---|
| 1 | ลูกค้า | เปิดหน้ารายละเอียดคำสั่งซื้อ | แสดงปุ่ม "ยกเลิก" เฉพาะเมื่อ BR-030 ผ่าน |
| 2 | ลูกค้า | กด "ยกเลิก" | เปิดกล่องยืนยัน พร้อมช่องเหตุผล (บังคับ) |
| 3 | ลูกค้า | เลือกเหตุผล แล้วกดยืนยัน | ตรวจ BR-030 อีกครั้งที่ฝั่งเซิร์ฟเวอร์ |
| 4 | ระบบ | — | เปลี่ยนสถานะ · คืนสต็อก · บันทึกผู้ทำและเวลา · ส่งอีเมล |
| 5 | ระบบ | — | แสดงข้อความสำเร็จ และปุ่มยกเลิกหายไป |

**ทางเลือกอื่น**

| รหัส | แยกที่ขั้น | เงื่อนไข | ผลลัพธ์ |
|---|:--:|---|---|
| 010-A1 | 3 | ผู้ทำเป็นเจ้าหน้าที่ | ข้ามช่องเหตุผล แต่บังคับกรอกหมายเหตุภายใน |

**กรณีผิดพลาด**

| รหัส | เกิดที่ขั้น | สาเหตุ | ผู้ใช้เห็นอะไร | ระบบทำอะไร |
|---|:--:|---|---|---|
| 010-E1 | 3 | มีคนเปลี่ยนสถานะไปก่อนแล้ว | "คำสั่งซื้อนี้ถูกจัดส่งแล้ว ยกเลิกไม่ได้" | ไม่เปลี่ยนอะไร · โหลดหน้าใหม่ |
| 010-E2 | 4 | คืนสต็อกไม่สำเร็จ | "ระบบขัดข้อง กรุณาลองใหม่" + รหัสอ้างอิง | ย้อนกลับทั้งรายการ · บันทึก log ระดับ error |
```

## Screen requirement (item 5)

```markdown
### SC-ORD-020 · หน้ารายละเอียดคำสั่งซื้อ

**เส้นทาง:** `/orders/{id}` · **ใช้ใน:** UC-ORD-010, UC-ORD-020

| ฟิลด์ | ชนิด | บังคับ | กฎตรวจ | ข้อความเมื่อไม่ผ่าน | ค่าเริ่มต้น |
|---|---|:--:|---|---|---|
| เหตุผลที่ยกเลิก | เลือกจากรายการ | ลูกค้า ✓ · เจ้าหน้าที่ ✗ (010-A1) | ต้องเป็นค่าในรายการ BR-031 | "กรุณาเลือกเหตุผล" | — |
| หมายเหตุภายใน | ข้อความยาว | เจ้าหน้าที่ ✓ · ลูกค้าไม่เห็นช่องนี้ | ไม่เกิน 500 ตัวอักษร | "กรุณากรอกหมายเหตุ" · "หมายเหตุยาวเกิน 500 ตัวอักษร" | ว่าง |
```

## State transition table (item 6)

| From | To | Who can do it | Condition | Side effects |
|---|---|---|---|---|
| `draft` | `confirmed` | Customer | At least 1 item · complete address | Deduct stock · send email |
| `confirmed` | `cancelled` | Customer · staff | BR-030 | Return stock · send email |
| `confirmed` | `shipped` | Warehouse staff | Has a tracking number | Send SMS |
| `shipped` | `cancelled` | — | **Not allowed** | — |

## Business rules (item 7)

```markdown
**BR-030 · ยกเลิกคำสั่งซื้อได้เมื่อไหร่**
ยกเลิกได้เมื่อสถานะเป็น `confirmed` และยังไม่เกิน 24 ชั่วโมงนับจากเวลายืนยัน
เจ้าหน้าที่ระดับหัวหน้าขึ้นไปยกเลิกได้โดยไม่จำกัดเวลา แต่ต้องกรอกหมายเหตุ
**ที่มา:** นโยบายคืนเงิน ฉบับ 2026-03 ข้อ 4.2

**BR-031 · เหตุผลที่ลูกค้าเลือกได้ตอนยกเลิก**
สั่งผิดรายการ · ได้ราคาที่ถูกกว่า · รอนานเกินไป · ไม่ต้องการแล้ว · อื่น ๆ
ผู้ดูแลระบบแก้รายการนี้ได้ในหน้าตั้งค่า โดยไม่ต้องแก้โค้ด
**ที่มา:** นโยบายคืนเงิน ฉบับ 2026-03 ข้อ 4.3 `(รอยืนยัน)`
```
