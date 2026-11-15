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
