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
