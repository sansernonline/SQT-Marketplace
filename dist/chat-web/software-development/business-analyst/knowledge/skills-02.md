# skill: diagrams

Use when a doc, slide, README or PR needs a diagram or figure

# diagrams — pick the tool by where the picture ends up, then draw one question per figure

> **One rule:** a diagram answers one question. If it answers two, draw two pictures. Choose the tool by the destination first: a delivered document or slide gets a designed figure, and a README or PR gets a quick Mermaid diagram.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Figure for the SRS, BRD, slide or print", "designed diagram", "architecture picture with AWS or Kubernetes icons" | [`references/diagram-figures.md`](references/diagram-figures.md) (engines: [`references/engine-svg-python.md`](references/engine-svg-python.md), [`references/engine-mermaid.md`](references/engine-mermaid.md); layouts: [`references/layout-flow.md`](references/layout-flow.md), [`references/layout-cloud.md`](references/layout-cloud.md), [`references/layout-context.md`](references/layout-context.md), [`references/layout-deployment.md`](references/layout-deployment.md)) |
| "Quick diagram for the README", "sequence or ER in the PR", "a flow in a code note" | [`references/software-diagrams.md`](references/software-diagrams.md) |
| "Image or SVG in a Markdown doc", "ASCII art for a comment" | [`references/markdown-visuals.md`](references/markdown-visuals.md) (ASCII patterns: [`references/ascii-patterns.md`](references/ascii-patterns.md); SVG snippets: [`references/svg-snippets.md`](references/svg-snippets.md)) |

Icons: [`references/icons.md`](references/icons.md). Colour by domain: [`references/colour-by-domain.md`](references/colour-by-domain.md). Mistakes to avoid: [`references/pitfalls.md`](references/pitfalls.md). Mixing formats in one doc: [`references/combining-formats.md`](references/combining-formats.md).

## Steps every part shares

1. Write the one question the diagram answers. Put that question in the figure title as a conclusion, with one sentence under it saying what to look at.
2. Use the same words in the figure as in the document.
3. Use the colour of the source document's theme. Pick colours by meaning, not decoration.
4. Render the figure and look at it. A diagram that was never rendered is only text.
5. Run the checker for the tool used (`scripts/check-figure-source.py`, `scripts/check-figure-geometry.py` or `scripts/check-mermaid-theme.mjs`).

## Check before done

- Mermaid is not in a delivered document, slide or print file. It is only for drafts discussed in chat, or for a README or PR.
- Every Mermaid block has its theme line, and `fontFamily` sits outside `themeVariables`. Otherwise Mermaid silently falls back to its default font.
- Thai text in a figure has a line height of at least 1.5, and no text box has a fixed height. Upper vowels and tone marks get cut otherwise.
- Someone who has never seen the system can answer the question the figure was drawn for.


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](markdown-visuals.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

## Box-drawing characters

```
┌─────┐  ┏━━━━━┓  ╭─────╮  ┌╌╌╌╌╌┐
│     │  ┃     ┃  │     │  ╎     ╎
└─────┘  ┗━━━━━┛  ╰─────╯  └╌╌╌╌╌┘
 light    heavy   rounded   dashed
```

Corners: `┌ ┐ └ ┘` ‧ `┏ ┓ ┗ ┛` ‧ `╭ ╮ ╰ ╯`
Lines:   `─ │` ‧ `━ ┃` ‧ `═ ║`
Joins:   `├ ┤ ┬ ┴ ┼`
Arrows:  `→ ← ↑ ↓ ▲ ▼ ▶ ◀ ↔ ↕ ⇒ ⇐`
Dots:    `• · ◦ ● ○ ▪ ▫`

## Common patterns

**Layout sketch:**
```
┌─────────────────────────────────────┐
│ Header        [Search]      [👤]    │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main content             │
│  • Item  │                          │
│  • Item  │  ┌────────────────────┐  │
│          │  │  Primary CTA       │  │
│          │  └────────────────────┘  │
└──────────┴──────────────────────────┘
```

**State machine:**
```
┌─────────┐  hover  ┌──────────┐  click  ┌─────────┐
│  REST   │────────►│ MAGNIFIED│────────►│ LAUNCH  │
└─────────┘◄────────└──────────┘◄────────└─────────┘
            exit               done
```

**Curve / chart:**
```
scale
 ↑
1.7│         ╱╲
1.4│       ╱    ╲
1.2│     ╱        ╲
1.0│___╱            ╲___
   └──────────┬──────────→ cursor X
         tile.Center
```


## reference: colour-by-domain.md

# Work domain → colour tone

Use this when the document has no `doc-theme` and no brand colour. Use the house default `#2A78D6`, mark it `(รอยืนยัน)` (to be confirmed), and carry on without stopping to ask. Put a tone from this table in the report so the user can choose later (the full order is in `diagrams` → `references/diagram-figures.md` item 5). Read the work's content first and write the `เนื้อหา:` brief per `design-gate/design-references` `references/content-to-theme.md` (plugin `superuser`); its section 3 has the fuller mood-and-colour table for every kind of work, and section 4 says what each colour tends to carry. This table is shared by both engines of `diagrams` and by every skill that draws figures.

| Domain | Suggested tone | Reason |
|---|---|---|
| Medical · health | Teal · green | Cleanliness, safety |
| Finance · banking | Dark blue · silver grey | Stability |
| Industry · factory | Amber yellow · steel grey | Machinery, warning |
| Education | Purple · light orange | Enthusiasm |
| Retail · food | Orange · pinkish red | Warmth, appetite |
| Government · law | Navy · oxblood | Formality |
| General software | Blue | Neutral default when there is no other context |


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](markdown-visuals.md) · a full design spec usually mixes formats.

The 6-part pattern for a design spec:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't force everything into one format. Each format is best at something different.


## reference: design-system.md

# Figure design system — details

Contents: figure header → size system → colour system → hand-drawn line icons. The short rules are in `SKILL.md`.

## Figure header (from item 3)

The logo goes before the figure title. Every template already has an `<img class="logo">` slot pointing at the project's `assets/logo/`; change only the file name. If the project has no logo yet, the slot disappears by itself, but note in the report that the logo is missing, because a figure without a logo always gets asked "โลโก้อยู่ไหน".

The reason is not looks. Architecture figures get copied into emails, slides and contracts, and then live on for a year. **A figure with no date is one nobody dares edit and nobody dares trust.**

The sub-title says "what the real thing is", not an expansion of the title:

```
ผิด: ภาพรวมระบบ Dr Screening
ถูก: เครื่องเดียวในห้อง Server ของโรงพยาบาล รันทุกบริการด้วย Docker Compose
```

## Size system (from item 4)

| Item | Value |
|---|---|
| Text | Figure title 30 · box title 16 · description 13.5 · group label 12 uppercase |
| Icon | Frame 66px · corner 18px · icon 29px · stroke 1.6px |
| Box | Corner 20px · 1px light grey border · nested box corner 16px, very light grey fill |
| `.focus` box | 2px border in a dark shade of `--accent` · corner 22px |
| Connector | Vertical or horizontal only · right-angle bends with a rounded corner of radius 10px (SVG/Python engine uses 12–14) · no diagonal lines, no free curves, no sharp corners |
| Spacing | 12 · 20 · 26 · 34 · 48 · column gap 130 |

> **The icon frame must be big.** 66px is the point where a figure starts to look deliberate, not like a generated diagram.
> Below 56px the icon becomes a small dot inside a big box and the figure looks hollow.

## Colour system (from item 5)

In the HTML templates, change `--accent` in `:root` in one place; the light and dark shades are computed from it. (In the SVG/Python engine, change `ACCENT` in `theme.py`.)

**Figure background follows the project's design.** Append `#accent=<main colour>&bg=<background colour>` to the file name to match the deck or app. A dark or light background both work. Every grey is computed from the background (currently available in `figure-flow.html`). Without `bg` you get a white background.

Exceptions that do not change with the brand:

- **Provider logo colours.** AWS orange and Azure blue must be their real colours, not our brand colour.
- **Structural grey.** Borders and box fills must be faint enough not to compete with the content.

**Icon colour has 7 groups, and each group must mean something.**

| Class | Use for |
|---|---|
| `t-neutral` | People, devices, things outside the system, plain file storage |
| `t-edge` | Entry and exit points · gateway · API |
| `t-app` | Tools the user works with |
| `t-view` | Parts the user uses to view or read results |
| `t-data` | Database · backup |
| `t-alert` | Queues, work that can pile up, things that hurt when they break |
| `t-warn` | Things with conditions — licences, legal limits |

Every frame has a **light fill with a border in the same tone**, not a solid fill, because a solid colour pulls the eye away from the content.
If you want an 8th colour, you are using colour for looks, not for meaning.

## Hand-drawn line icons (from item 6)

Hand-drawn line icons: `viewBox 0 0 24 24` · `stroke-width 1.6` · no fill · round line caps.
The shape must be readable at 24px, because detail beyond 3 strokes turns into a black blob.

## Fonts in figures embedded in a deck (from item 8)

  For a figure that will be embedded in a deck (`StageDeck` · `slide-deck`), move `"IBM Plex Sans Thai"` to the first position so the figure gets the same font as the deck body. A Word document uses the brand's Thai font and falls back to Tahoma if it is missing, per `document-design` → `references/branded-document-design.md` item 2; a figure inside it may use a different font.
  If the machine has none of them, the figure silently falls back to a font that places vowels in the wrong position, so **always render and look**.


## reference: diagram-figures.md

<!-- merged from skill `diagram-figures` on 2026-11-27 · description was: Use when a document or slide needs a designed diagram -->
# Diagram Figures — designed figures (HTML template → PNG) for documents, slides and print

> **One rule:** the figure's main colour = the project's main colour. Look for it in the order in step 5. Only if nothing is found, use the house palette `#2A78D6` from `design-gate/parts/polished-document-style/references/theme-colors.md` ("ค่าตั้งต้นประจำบ้าน", the house default).

> **Pre-work gate (every time):** read the owner's theme → search live for a reference → 3 genuinely different directions → check `design-gate/no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search finds this piece's structure). Close the work with a line `ด่านก่อนลงมือ:`.

## Use when
- A figure in a work document (business plan · process chart · research summary · BRD · SRS · ER diagram) or any figure that must look designed: client proposals · slides · print · sign-off documents, including cloud diagrams with real logos.
- The same style generated from data or code (re-issued when data changes, coordinates on a grid) → SVG/Python engine, [`engine-svg-python.md`](engine-svg-python.md).
- Dozens of Mermaid blocks (sequence · state · ER · gantt) going into Word or PDF as hand-drawn-looking figures → Mermaid engine, [`engine-mermaid.md`](engine-mermaid.md).

Not for: a quick diagram in a README · Pull Request · code note → `software-diagrams.md` (plugin `software-development`; for logos in a repo use its `diagrams` library) · how to embed a figure in markdown → `markdown-visuals.md`. Anything read by people outside the team → this skill. This skill costs time (several rounds of fixes per figure), so skip it for in-team figures.

## Steps
1. **Answer 3 questions first.** Where does the figure go (slide 16:9 · A4 page · screen)? Set `.sheet{width:...}` to match: slide 1600px · A4 portrait 1240px · A4 landscape 1750px. Who reads it (non-technical client → box names in Thai; technical team → real service names)? What single question does it answer (1 figure, 1 question)?
2. **Copy one template from `assets/` and edit it; never write your own.** All share colours, sizes, fonts and the line-drawing script.

   | Question the figure answers | Template | Details |
   |---|---|---|
   | Who outside does this system, shop or organisation talk to? (top-level overview, C4 level 1) | [`figure-context.html`](../assets/figure-context.html) | [layout-context.md](layout-context.md) |
   | Where is the real thing, and what is inside? (departments · places · machines; deployment) | [`figure-template.html`](../assets/figure-template.html) | [layout-deployment.md](layout-deployment.md) |
   | Which cloud services are used? (real AWS · Azure · Google Cloud logos) | [`figure-cloud.html`](../assets/figure-cloud.html) | [layout-cloud.md](layout-cloud.md) |
   | What does 1 item (message · order · money) pass through, in what order? (numbered ①–⑥, user → channel → internal → external) | [`figure-flow.html`](../assets/figure-flow.html) · [example](../assets/figure-flow-example.png) | [layout-flow.md](layout-flow.md) |

3. **Header needs all 6 parts:** project logo (`<img class="logo">` → the project's `assets/logo/`; if there is none, say so in the report) · title · 1-line sub-title (what the real thing is, not an expansion of the title) · figure number · version and date · owner. Wrong/right sub-title example: [`design-system.md`](design-system.md), "Figure header".
4. **Sizes.** Sizes, spacing and corners are already in `:root` of `assets/figure-template.html`; do not set new values. Icon frame ≥ 66px (below 56px looks hollow). Connectors vertical or horizontal only, bent with rounded corners; no diagonals. Full table: [`design-system.md`](design-system.md), "Size system" (open when adjusting or writing a template). Text size follows the placed size: for a figure placed in an A4 document, smallest text after placing must be ≥ 7 pt → `minimum px = 0.247 × canvas width(px) ÷ placed width(cm)` (2000px canvas: 29px on a 17 cm page, 20px on 25.7 cm). Make boxes wide enough that Thai names are not cut mid-word. In-document version uses `?embed=1` (hides header); aspect ratio width ÷ height ≥ 1.46 for a landscape page; one `figure-theme.css` for the whole set.
5. **Colour.** Stop at the first hit:
   1. `doc-theme` in the project's documents (`design-gate/polished-document-style`, section "ธีมของเอกสาร").
   2. The project's brand colour: `--primary` · `--brand` · `--accent` in CSS · `primary` in Tailwind / UI theme · `colorPrimary` in a mobile app · brand kit · logo. Read the background colour from the same places (`--background` · `--bg` · dark or light mode), because figures follow the project's design.
   3. Nothing yet → search live per `design-gate/design-references` (plugin `superuser`), type `document`, then extract colours from the chosen work. Use the stored colour library only if live search is not possible.
   4. Live search not possible → use `#2A78D6`, write `(รอยืนยัน)` in the report, carry on without asking, and list a tone from [references/colour-by-domain.md](colour-by-domain.md) for later.

   Never use a colour from an example or reference image. In HTML templates change `--accent` in `:root` (SVG/Python: `ACCENT` in `theme.py`); background that follows the project → append `#accent=<main colour>&bg=<background colour>` to the file name. The 7 icon colour groups (`t-neutral` · `t-edge` · `t-app` · `t-view` · `t-data` · `t-alert` · `t-warn`) and provider/structural exceptions: [`design-system.md`](design-system.md), "Colour system". An 8th colour means colour is used for looks. The main colour must show across the whole figure, with 1 `.focus` card (brand border + glow), a 6px glowing main path and thin grey secondary lines. Full rules: [`focal-point-and-layout.md`](focal-point-and-layout.md).
6. **Icons.** If an official icon exists (AWS · Azure · Google Cloud · Kubernetes · most open-source tools), use it from `assets/icons/` (205 selected) or `python assets/find-icon.py <name>`; groups, commands, licences in [references/icons.md](icons.md). If not, or it is our own system, draw a line icon (`viewBox 0 0 24 24` · `stroke-width 1.6` · no fill · round caps · readable at 24px, max 3 strokes of detail) and footnote that it is not an official logo (the template has this line). Never mix official and hand-drawn icons in one figure. Never use a logo so that it looks like the provider endorses it.
7. **Wires.** Same column → down arrow `.down`. Across columns → the `WIRES` list at the end of the file (`{from, fs, to, ts, tp, label}`); the script draws after layout; never write fixed coordinates. Vertical or horizontal only, rounded bends via `elbow()` (use `mx` when lines share a channel). A label must be narrower than the column gap (longer → raise `gap` of `.stage`). At most 5 cross-column lines per figure, to the smallest correct box. A label says what flows (`HTTPS 443`), not `เชื่อมต่อ`; no label if nothing to say; a not-yet-real connection uses `planned:true` with a footnote. Code example: [`wires.md`](wires.md) (open when writing `WIRES`).
8. **Layout of process and team charts.** Read top to bottom, 1 level per tier (left to right only with a time axis). Middle element (`.focus`) in the centre, whole figure centred. Same-level things in one frame and one row, with a group name on the border; frame is a single line, no fill; equal card height. One line into a frame if all boxes receive the same thing. Line channels outside frames. Bends are curves (~12px radius), cards 14px corners, frames 20px. Every box has a name and a 1-line description. Details: [`focal-point-and-layout.md`](focal-point-and-layout.md).
9. **Thai.** `line-height` ≥ 1.5 and never a fixed height on a text box (upper vowels and tone marks get cut). Description text ≥ 12px. Thai has no word spaces, so put `<br>` yourself in long text, and never break inside words like ทีละ · สต็อก · ร้านค้า · เช็ก (`white-space:nowrap`). Font order `"Noto Sans Thai","IBM Plex Sans Thai",Tahoma,Loma` is set in the templates; if the machine has no Thai font vowels land wrong, so always render and look.
10. **Render and look. Never skip.**
    ```bash
    pip install playwright && playwright install chromium
    cp <skill>/assets/render-figure.py docs/figures/render.py     # first time in the project
    python docs/figures/render.py                  # every figure in docs/figures/src/ → docs/figures/*.png + docs/figures/doc/*.png
    python docs/figures/render.py arch-01 --min-px 20             # chosen figures · smallest text by placed size (step 4)
    python assets/render-figure.py figure.html figure.png 2       # single file (slide · trying a direction)
    python scripts/check-figure-geometry.py docs/figures/src     # exit 0 = pass: diagonals, square corners, overlapping labels, lines over text
    python scripts/check-figure-source.py docs/figures/src       # every figure starts from this skill's skeleton
    ```
    Always use multiplier 2 (1 is blurry when enlarged). Folder mode makes 2 versions per figure (full + `?embed=1`) and checks text smaller than `--min-px`, wrapped names or labels, overflow, overlapping labels: `problems: 0` and exit 0 = pass. Keep `render.py` at `docs/figures/render.py` next to `src/`, never in `_to_delete/` or a scratchpad; never delete `docs/figures/src/` (.png files are only output). Send the client a PNG; keep the HTML source in the repo.
11. If a figure comes out wrong (missing arrowhead, line to the wrong box, missing Thai vowels, label over a box), open the symptom → cause → fix table [references/pitfalls.md](pitfalls.md) before fixing it yourself.
12. Run `design-gate/no-ai-look` item 3 (for HTML, run its script; also eye gate 3.2; 0 findings from the script is not yet a pass). Hand-off by medium: slide → `slide-deck` · Word / PDF → `document-design` · SRS → `requirements-writing` · app screens → `ui-craft`.

## Check before done
- [ ] Every cross-column wire has an arrowhead; no line crosses a box or text; labels readable and not overlapping.
- [ ] Thai text complete (no missing vowels or tone marks, no word cut mid-word).
- [ ] Exactly one `.focus` box; header has all 6 parts; logo shows; figure has a date and owner.
- [ ] Shrunk to 25% width, you can still tell what is where.
- [ ] Smallest text converted to pt at the placed size is ≥ 7 pt.
- [ ] Someone who has never seen the system can answer the original question.
- [ ] Icons are all official or all hand-drawn; no diagonal lines or sharp corners.
- [ ] The line `ด่านก่อนลงมือ:` closes the work.

## References
- [`focal-point-and-layout.md`](focal-point-and-layout.md) — open when styling a figure, laying out a process chart, or sizing for a placed page
- [`design-system.md`](design-system.md) — open for header example, size table, colour groups
- [`colour-by-domain.md`](colour-by-domain.md) — open when the colour step falls to the house palette
- [`icons.md`](icons.md) · [`wires.md`](wires.md) · [`pitfalls.md`](pitfalls.md) — open for icons, `WIRES` code, a wrong-looking figure


## reference: engine-mermaid.md

# Mermaid → right-angle figures with rounded corners

Route 3 of `diagrams`. Use it when a document has dozens of Mermaid blocks (sequence · state · ER · gantt) and must be delivered as a Word or PDF file that looks designed.
An image drawn by Mermaid itself has free-curved, diagonal lines and colours that do not match hand-drawn figures. This engine reads the original blocks and redraws them with the same rules as the HTML templates.

## What you get

- Vertical or horizontal lines only, bent with rounded corners (radii are in `theme.py`: `WIRE_R` 12 · box `BOX_R` 10)
- Line labels are white with a light border, and a checker makes sure no label overlaps a box or a line
- The one main box is a dark card with a gradient border, matching the `.focus` box
- Layout is done by ELK (`elkjs`, layered + orthogonal), so you do not place coordinates yourself

## Use

1. Copy the folder `assets/mermaid-engine/` to `docs/figures/src/gen/`
2. Edit `figures.json`:
   - `prefix` is the project code (`workspace-rules/document-naming`)
   - `drafts` is the folder of `.md` files that hold Mermaid blocks
   - `skip` is the blocks that already have a hand-drawn figure
   - `captions` replaces captions generated from headings
3. Edit `theme.py`: make `ACCENT` and `SECOND` match the project's `doc-theme`, and `MEASURE_FONTS` must point at real font files on the machine
4. Run `python build.py`. You get `docs/figures/<prefix>-<file>-m<N>.png` and `map.md`, which says which block became which file
   - If `elkjs` is not installed yet, `elk.py` installs version 0.9.3 into the configured `node_modules` folder by itself
5. Always check the output:
   - A `PROBLEM` line means a diagonal line, an overlapping label, or an unreadable block. Do not deliver while any such line remains
   - Open and look at at least 1 figure of each type

## Limits

- Works for 4 types: `sequenceDiagram` · `stateDiagram-v2` · `erDiagram` · `gantt`. Draw a flowchart as an HTML template (item 2 of SKILL.md), because flowcharts are the figures people read most
- The figure is 1240px wide to fit a portrait A4 page. If a figure has more than 7 participants, the text gets small; split the figure or put it on a landscape page


## reference: engine-svg-python.md

# SVG/Python engine — figures generated from data or code

Route 2 of `diagrams`. Use it instead of the HTML skeleton when a figure must be generated from data or code. Examples: several figures that must be re-exported every time the data changes, or a figure where you control every position on a grid with right-angle lines and rounded corners.
Python writes the SVG onto the grid, then renders it to PNG. Icons and logos come from the same library as the HTML skeleton ([icons.md](icons.md)).

The cost is time, because 1 figure takes several rounds of fixes. So use it only for figures that people outside the team will see, and see repeatedly.

> **Main colour = the project's main colour.** Find it in the order given in `diagrams` → `references/diagram-figures.md` section 5 (colour system), then put it in `ACCENT` in `theme.py`. Use the house colour `#2A78D6` only when that order finds nothing at all.

---

**Contents**
- [0 · Colour comes from the work — do not stop to ask](#0--colour-comes-from-the-work--do-not-stop-to-ask)
- [1 · Order of work](#1--order-of-work)
- [2 · File layout](#2--file-layout)
- [3 · Rule 1 — grid first, lines after](#3--rule-1--grid-first-lines-after)
- [4 · Connector lines](#4--connector-lines)
- [5 · Labels on lines — only two roles](#5--labels-on-lines--only-two-roles)
- [6 · Zones](#6--zones)
- [7 · Icons and logos](#7--icons-and-logos)
- [8 · Rendering](#8--rendering)
- [9 · Check loop — do not skip](#9--check-loop--do-not-skip)
- [10 · Constants that work](#10--constants-that-work)
- [11 · Legend bar](#11--legend-bar)
- [Abbreviations](#abbreviations)

## 0 · Colour comes from the work — do not stop to ask

**If the source document already declares a `doc-theme`, use that value and do not ask again.**
(See `design-gate/polished-document-style`, section "Document theme".) If there is none yet, follow the steps below, then write the result back into `doc-theme`.

**No brand colour → follow the order in `diagrams` → `references/diagram-figures.md` section 5:** use the house value `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation) in the report, and carry on without stopping to ask.
Put a tone suggested from the content, using the table in [colour-by-domain.md](colour-by-domain.md), in the report so the user can choose later.

Put **one main colour** in `ACCENT` in `assets/svg-engine/theme.py`. All light and dark shades
are computed from it with `tint()`, so the drawing code has no other colour hard-coded.

The only colour not tied to `ACCENT` is `EXCEPT_HUE`, for the "exception" label. It must always differ from the main colour.
If the main colour is already orange, change `EXCEPT_HUE` to another contrasting colour.

---

## 1 · Order of work

1. Read all existing diagrams first, then ask **what question this figure answers**. 1 figure answers 1 question.
2. Pick the colour by section 0 (no colour → house value + `(รอยืนยัน)`).
3. **Place every box on the grid before drawing any line.** This is the most important step. See section 3.
4. Finish `theme.py` and `ref.py` first, then write the figure file.
5. **Render, then open the image file and look at it.** Checking that the script ran without errors is not enough.
6. Once the figure is clean, write it to the target folder. Move the old figure to `_to_delete/`.

---

## 2 · File layout

```
architecture/
  01-system-context.png      ← output; the number prefix follows reading order
  _src/
    theme.py                 ← all colours — edit here only
    ref.py                   ← visual language: zones, units, lines, labels, legend bar
    render.py                ← SVG → PNG with Playwright at 2x
    d01.py … dNN.py          ← one file per figure; layout only
    logos/                   ← product logos + colors.json
```

Copy the whole folder [`assets/svg-engine/`](../assets/svg-engine/) to `_src/` and start from there. [`d01.py`](../assets/svg-engine/d01.py) is a sample figure that really renders.

---

## 3 · Rule 1 — grid first, lines after

Diagonal lines are hard to read, and bending the lines afterwards does not help. **Fix the positions.**

```python
CA,CB,CC,CD,CE,CF = 178,452,678,896,1080,1312   # columns
R1,R2,R3          = 288,458,624                  # rows, spaced ~170 apart
```

Every box sits on an intersection of a column and a row, and none strays off the grid.
When all points sit on the same lines, the connectors are right-angled by themselves with no bending.

### Midpoint rule

A node that receives from several paths must sit **midway between those paths**, not stick to one row.
If it also sends on to several paths, it must sit midway between the outgoing paths too.

Use **one merge point and one split point** so the lines are symmetric.

```python
RM = (R1+R2)//2      # Nginx sits midway between the two incoming rows
J1, J2 = CB-74, CB+86

flow([(CA+34,R1),(J1,R1),(J1,RM),(CB-30,RM)])   # enters from above
flow([(CA+34,R2),(J1,R2),(J1,RM),(CB-30,RM)])   # enters from below
flow([(CB+30,RM),(J2,RM),(J2,R1),(CC-30,R1)])   # leaves going up
flow([(CB+30,RM),(J2,RM),(J2,R2),(CC-30,R2)])   # leaves going down
```

### Wiring channels

A line that must cross the grid **must not run over a row that holds boxes.** Reserve separate channels for it.

```python
TB = 238        # top channel — at least 36 from the zone edge
MB = R3-48      # middle channel — between rows
```

---

## 4 · Connector lines

All lines are right-angled, with corners rounded at radius 14. This makes the figure look much more refined without losing clarity.
`ref.flow(pts, dashed=False, arrow=True)` computes the rounded corners itself.

**The arrowhead must end at the icon edge, not at the name label.** For example `CD-30` when the icon is 46 wide.

---

## 5 · Labels on lines — only two roles

| Role | Colour | Use for |
|---|---|---|
| Normal | light shade of `ACCENT` | what normally flows along the line |
| Exception | `EXCEPT_HUE` | a path that does not pass the front gate · special cases |

**A figure may have only one exception label.** If there are 2 or more, no label really stands out.

A label says **what flows through**, such as `SQL` `/api/` `DICOM 11112`, not `เชื่อมต่อ` (connect).

---

## 6 · Zones

A zone is a frame with a very light fill. Its name label is a white capsule that straddles the border and has a coloured dot in front.

```python
zone(x, y, w, h, "ห้อง Server ของโรงพยาบาล", "physical")
```

| Type | Line | Meaning |
|---|---|---|
| `physical` | solid | A real physical boundary: room, building, machine |
| `logical` | dashed | A logical boundary: Docker Compose · namespace · VPC |
| `outside` | dashed | Outside the system we look after |

The reader sees at once which one physically exists. Nest zones no more than 3 levels deep.

---

## 7 · Icons and logos

Icons **float on the background with no frame and no tile.** The name and description sit below the image.

```python
unit(cx, cy, "Nginx", "ประตูเดียวที่เข้าระบบได้", slug="nginx")
#  logos/<slug>.svg exists → use the real logo, filled with the colour from colors.json
#  does not exist         → use a line symbol of our own design
```

Values that work: icon 46 · name 11.5 bold, placed `size/2+20` from the centre · description 10, placed `size/2+35` from the centre.

Take logos from this skill's icon library ([icons.md](icons.md)). Run `python assets/find-icon.py --group brands <name>` from the `diagrams/` folder, then `--copy` the result into `_src/logos/`.
Simple Icons gives single-colour SVG with `viewBox 0 0 24 24` and comes with `colors.json`, which holds each brand's official colour code.

### Trademarks — do not skip

- A logo belongs to its owner. You may use it to refer to the product itself in the diagram,
  but **do not alter its shape, do not stretch or squash it, and do not make it look as if the owner endorses the figure.**
- If a product has no logo file, use a symbol instead, and **name that product in the note under the figure.**
- Do not download new logos on your own. Use the set that exists, or have the user get them from that project's brand page.

---

## 8 · Rendering

```bash
pip install playwright && playwright install chromium
python render.py d01.svg ../01-architecture.png 1400 860
```

Always render at 2x, because 1x gives a blurry image when enlarged on a slide.

Thai text needs a Thai font on the machine that renders, declared in the `font-family` of `<svg>`.
**Do not use Python Imaging Library (PIL) to draw mixed Thai and English text**, because it produces square boxes in place of letters.

---

## 9 · Check loop — do not skip

Render → open the image and look → fix → render again, until it is clean.
**These 6 problems come up every time. Check them in every round:**

1. **A label on a line covers an icon or a name.** Move it to the midpoint of the longest segment, or onto the stub.
2. **A line leaving an icon cuts through its own description.** Start the line at `cy+58`, not `cy+32`.
3. **A zone edge cuts the description of the bottom row.** The zone's bottom edge must be ≥ `R_bottom + 58 + 24`.
4. **Zone caption text sits on the border.** Merge it with the name into one capsule.
5. **An arrowhead ends at the name label, not the icon.** Make it end at the icon edge.
6. **Text overflows its frame.** Thai 11.5px ≈ 6.0 px/char · heading 15px ≈ 7.5 px/char.
   If space is short, cut words. **Do not shrink the font.**

---

## 10 · Constants that work

```
width 1400 · margin 56
centred title 22 · subtitle under title 12.5
unit name 11.5 bold · description 10 · label on line 10.5
connector 1.6 · zone border 1.4 · corner radius 14 · label height 21
```

---

## 11 · Legend bar

Every figure ends with a single bar that says what each kind of frame means and where the 2 label colours differ.
After it come 2–4 lines of notes. These include the trademark line and references to other related figures.

---

## Abbreviations

- **SVG** — Scalable Vector Graphics
- **PNG** — Portable Network Graphics
- **PIL** — Python Imaging Library


## reference: focal-point-and-layout.md

# Focal point, layout of process charts, placed size · diagram-figures

Open when you build or restyle a figure and need the full rules behind the short lines in `diagram-figures.md`.

## Placed size, two versions, one theme file

- **Text size depends on where the figure will be placed, not on the canvas.** A figure placed in an A4 document must be worked back from the placed size: the smallest text after placing must be ≥ 7 pt → `minimum px = 0.247 × canvas width(px) ÷ placed width(cm)`. A 2000px canvas on a 17 cm portrait page = 29px; on a 25.7 cm landscape page = 20px. After enlarging the font, boxes must be wide enough that Thai names are not cut mid-word.
- **2 versions from one source file:** the full version (all 6 header parts, for standalone or slide use) and the in-document version (`?embed=1` hides the header because the document's caption already says it; a repeated header makes the figure smaller and cluttered). Make the aspect ratio wide enough to fill a landscape page (width ÷ height ≥ 1.46).
- **The whole set of figures uses one CSS file** (`figure-theme.css` next to the source files) that pulls colour, font and logo from the project's identity (`assets/logo/` · mockup tokens). Change it in one place and every figure follows.
- **The beauty gate for figures** runs together with the beauty gate for documents (`document-design` → `references/branded-document-design.md` step 2): main path is a solid line in the strong colour · secondary lines grey · a legend · flow order numbered when there are more than 3 steps.

## Colour weight

Limit the number of colours, not the weight of colour. The main colour must be visible across the whole figure, not only in the header bar. Labels that must be found fast (step number · owner · status) use a solid fill · card headers are a full-width solid colour band (a thick colour stripe beside a rounded card is an AI signal in `design-gate/no-ai-look`) · summary boxes use a dark fill · pastel colours only as a fill that has text or a dark border with it · check with the "colour power" axis in the beauty gate of `ui-craft` (`ui-craft/references/states-and-checks.md`, plugin `software-development`).

If you found a colour in step 5 item 2 but there is no `doc-theme` yet, declare a `doc-theme` with that value so the project's figures, documents and slides share it.

## A figure needs a focal point, not flatness

A readable but flat figure (white cards that all look alike, all lines the same thickness) draws the user's "ดีขึ้นแต่ไม่ว้าว" (better but not wow). Ways that pass the beauty gate:

| Part | What to do |
|---|---|
| Canvas | Use the same background as the app's identity. A dark app gets a figure that is dark all over (not a white frame around a dark image) · faint dot-grid pattern, at most 8% opaque, for depth |
| Main path | 6px thick in the brand colour + glow (`filter: drop-shadow(0 0 8px <brand colour 75%>)`) · secondary lines thin, grey, no glow. The difference is clear enough that the legend need not be read |
| Focal point | 1 `.focus` card per figure: 3px brand-colour border + surrounding glow + icon with brand-colour fill · other cards' fill blends into the canvas |
| Sequence badge | Brand-colour fill, text in the canvas colour + a light glow |
| Contrast | Secondary text on a dark fill ≥ 7:1 (light grey, not mid grey) |
| Theme | Every colour is a variable in a single css file · arrowheads read colour from the variable (`getComputedStyle`), no values hard-coded in JavaScript · meaning colours (`t-app` `t-alert` `t-warn`) have a dark-background pair · no colour in `style=""` of figure files |

**Dot grid + glowing lines = an approved house style** (the exception "an approved look always wins" in `design-gate/no-ai-look`). When scanning with `slop_scan.py`, add `slop-ok` at `grid-bg` and `neon-glow` of these figures, with a short reason.

**How to choose a direction:** write 3 directions as override css, inject them into 2 real figures at render time (`add_init_script` before the line-drawing script runs) → place them next to the original → have a reviewer who did not do the work score them → edit the one theme css file and render the whole set. A dark figure in a white-page document must be a recorded decision (for example, chapter-opening pages and the cover are dark too), not an accident.

## Layout: process charts and team charts

Rule set by the user after seeing a real figure (2026-10-28): a figure with wandering curved lines and boxes scattered out of rows is confusing to read.

- **Read top to bottom**, 1 level per tier: entry → middle → receiver → result · use left to right only when there is a time axis (Gantt)
- **The middle element sits in the centre of the figure** (team lead · main system · `.focus` box), and the whole figure is centred, not pushed left leaving the other side empty
- **Things at the same level go in the same frame, in the same row**, with a group name on the border line, such as "ทางเข้า" (entry) or "agent 8 ตัว" (8 agents)
  - The frame is a single line, no fill, no shadow
  - Cards in the same frame have equal height
  - If there are too many for one row, split into several rows in the same frame and centre the last row
- **If every box in a group receives the same thing, draw one line into the frame**, do not branch a line to every box · if each box is a different choice, draw a separate line per box and move the group name to the bottom border so the line does not cross the name
- **Line channels are outside the frame.** Lines leaving or entering a group bend in the gap between frames and do not cross a group name or a card
- **Keep it soft.** Straight runs of a line are still vertical or horizontal, but every bend is a curve of radius about 12 px (runs shorter than 24 px reduce the radius accordingly) · cards have 14 px corners · group frames have 20 px corners · labels are capsules · no sharp corners on boxes or lines
- **Thai words must not break mid-word.** The browser's word breaker splits some words wrongly (for example `เช็|กมิจฉา|ชีพ`). Keep a list of these words (ทีละ · สต็อก · ร้านค้า · เช็ก) and never break a line inside a word in the list (wrap with `white-space:nowrap`) · for a long text not in the list, put `<br>` yourself · open the figure and look at every card
- **Every box has a name and a 1-line description**, not only an icon · steps connected in a sequence (1 → 2 → 3) need no frame, because they are not the same level

## Thai fonts

Font order is `"Noto Sans Thai","IBM Plex Sans Thai",Tahoma,Loma`, already set in the templates. For a figure embedded in a deck (`StageDeck` · `slide-deck`), move `"IBM Plex Sans Thai"` to the first position. A Word document uses the brand's Thai font and falls back to Tahoma if it is missing (`document-design` → `references/branded-document-design.md` item 2); a figure inside it may use a different font. If the machine has no Thai font at all, vowels silently end up in the wrong position, so always render and look.


## reference: icons.md

# Icon library — shared by the HTML skeleton and the SVG/Python engine

**205 icons are already provided in `assets/icons/`.** Nothing more to install.
They are PNG files with a transparent background at 160×160, official icons of providers and tools, split into 9 groups.

| Folder | Contents |
|---|---|
| `icons/aws/` | 39 — EC2 · RDS · S3 · Lambda · ELB · Route 53 · CloudFront · SQS · SNS · IAM · CloudWatch … |
| `icons/azure/` | 24 — VM · App Service · AKS · Cosmos DB · Blob Storage · Key Vault … |
| `icons/gcp/` | 21 — Compute Engine · GKE · Cloud Run · BigQuery · Pub/Sub · Firestore … |
| `icons/k8s/` | 16 — Pod · Deployment · Service · Ingress · ConfigMap · Secret · Node … |
| `icons/data/` | 17 — PostgreSQL · MySQL · MongoDB · Redis · Elasticsearch · ClickHouse … |
| `icons/queue/` | 6 — RabbitMQ · Kafka · Celery · NATS · ActiveMQ · EMQX |
| `icons/infra/` | 26 — Nginx · Docker · HAProxy · Traefik · Istio · firewall · router · Windows · Linux … |
| `icons/ops/` | 19 — Prometheus · Grafana · Jenkins · GitLab CI · GitHub Actions · Terraform · Vault … |
| `icons/app/` | 37 — Angular · React · .NET · Spring · Python · LINE · Slack · Stripe · user … |

The full list is in [`assets/icons/INDEX.md`](../assets/icons/INDEX.md). Open [`assets/icons/contact-sheet.html`](../assets/icons/contact-sheet.html) to see every icon on one page.

**If you need an icon that is not among these 205**, search the full library `assets/tech-icons.zip` (8,602 icons · 5 groups) with [`find-icon.py`](../assets/find-icon.py). It needs no installation and does not need the archive unpacked.

| Group | Contents |
|---|---|
| `cloud/` | 1,986 PNG · AWS · Azure · Google Cloud · IBM · Oracle · Alibaba · DigitalOcean · Firebase … |
| `platform/` | 471 PNG · databases · queues · CI/CD · monitoring · Kubernetes · programming languages · GIS |
| `brands/` | 3,461 single-colour SVG · brand logos + official colour codes in `colors.json` |
| `devtools/` | 572 coloured SVG · developer tool logos |
| `ui/` | 2,112 SVG general line icons (Lucide), not logos |

```bash
python assets/find-icon.py kafka redis                       # search by name
python assets/find-icon.py --group ui user                    # search one group only
python assets/find-icon.py --copy cloud/aws/compute/ec2.png brands/docker.svg --to docs/figures/icons
python assets/find-icon.py --colors docker                    # official logo colours
```

Pull out only the icons you use and put them next to the figure file. Do not unpack the whole library into the project. The library's licences are MIT · CC0 · ISC (see `--groups`), but logos remain trademarks of their owners.

> **About licences** — The architecture icon sets of AWS · Azure · Google Cloud
> are published specifically for drawing architecture diagrams, so they may be used in proposal documents.
> What you cannot do is use a logo in a way that suggests the provider endorses or partners with you,
> or use it as part of your own brand. If a tool has no official icon, draw a line icon yourself following [SKILL.md](diagram-figures.md) section 6.


## reference: layout-cloud.md

# Skeleton `figure-cloud.html` — cloud diagram with provider logos

This skeleton answers "which cloud services do we use?" The skeleton file is at [`assets/figure-cloud.html`](../assets/figure-cloud.html).

Use it when the reader expects to see real Amazon Web Services (AWS) · Azure · Google Cloud ·
Kubernetes icons, like the reference diagrams the providers publish. Find the icons in the library, per [icons.md](icons.md).

```html
<div class="unit"><img src="icons/aws/ec2.png" alt="">
  <div class="name">Web Server</div><div class="desc">AZ-1</div></div>
```

**Rules specific to this skeleton:**

- **A line that crosses a boundary leaves from the edge of the boundary box** (`n-region`), not from a box inside it,
  because a line that starts from an inner box cuts diagonally across everything in the way.
- **Dashed line = a boundary the provider manages for you.** A solid orange line = a machine we look after ourselves.
  Always put these meanings in the legend.
- Show icons bare, with no frame, because a logo already has its own colour and shape.
- Use the official service name (`Amazon RDS`). The description under the name may be in Thai.


## reference: layout-context.md

# Skeleton `figure-context.html` — the system and the outside world

This skeleton answers "who and what outside does this system talk to?" (C4 level 1). The skeleton file is at [`assets/figure-context.html`](../assets/figure-context.html).

```
┌─ figure header ─────────────────────────────────────────────────┐
│  users (horizontal strip) → described system (large card) ← external systems │
│  ─ staff                    ─ name + subtitle              ─ external system │
│  ─ doctor                   ─ 3-6 functions                ─ name + status   │
│  ─ admin                    ─ limitation tag                                 │
├─ legend ────────────────────────────────────────────────────────┤
│  footnote — meaning of dashed line · all abbreviations · next figure │
└────────────────────────────────────────────────────────────────┘
```

- **Users go on the left and external systems on the right**, never mixed, because people and machines are different kinds of thing.
- **The central card lists 3 to 6 functions.** More than that means you are writing an SRS (Software Requirements Specification), not drawing a figure.
- **An external system not yet connected** gets a dashed line (`planned:true`), and the card says which version plans it,
  because a figure that shows only what exists gets the question "so is HIS connected yet?" every round.
- **Always include a legend** when a shape or line carries meaning.
- **Spell out abbreviations in the footnote**, because readers on the customer side do not know what SEG is.


## reference: layout-deployment.md

# Skeleton `figure-template.html` — deployment · inside the machine

This skeleton answers "what machine does the real thing run on, and what is inside?" The skeleton file is at [`assets/figure-template.html`](../assets/figure-template.html).

It has 3 columns, left to right in the direction the data flows:

```
┌─ figure header ────────────────────────────────────────┐
│  name + subtitle              figure number · version · owner │
├────────────┬──────────────────────────┬────────────────┤
│ outside    │  ⬅ .focus box             │ destination    │
│ people,    │  what this document       │ regulations    │
│ devices,   │  explains                 │ outgoing items │
│ other      │  can nest 1 more level    │                │
│ systems    │                           │                │
├────────────┴──────────────────────────┴────────────────┤
│ footnote — related figures · icon sources              │
└────────────────────────────────────────────────────────┘
```

**Nest boxes no more than 3 levels:** column → large box → small box.
A 4th level means the figure answers 2 questions, so split it into 2 figures.

**A figure may have only one `.focus` box.** With 2 boxes, you have not yet decided what the figure is about.


## reference: layout-flow.md

# Skeleton `figure-flow.html` — what the data flows through, in what order

This skeleton answers "what does 1 message (request · job · document) pass through, and in what order?" The skeleton file is at [`assets/figure-flow.html`](../assets/figure-flow.html) · a rendered example is at [`assets/figure-flow-example.png`](../assets/figure-flow-example.png)

```
┌─ figure header ─────────────────────── ①–⑥ meaning of sequence numbers ┐
│ ┌users┐   ┌channels┐    ┌ host machine (grey) ──────────┐   ┌ external services ┐ │
│ │ person │①→│ web    │②→ │ ┌ system .focus (main colour) ┐ │③→ │ AI · API     │ │
│ │ person │①→│ LINE   │②→ │ │ layer · function      │ │   └─────────────┘ │
│ │ person │ →│ back office│ → │ │ layer · function      │ │④→ ┌ data ────────┐ │
│ └────┘   └──────┘    │ └──────────────────────┘ │   │ files · DB   │ │
│                       └─────────────────────────┘   └─────────────┘ │
├─ footnote: meaning of light fill · dashed line · all abbreviations ────┤
```

## Colour — from the project's single main colour

- Change `--accent` in `:root` in one place. The dark shade, light fill and the text colour on the main-colour fill are computed for you. (For a light colour such as yellow, the script switches the text to a dark colour so it stays readable.)
- Find the main colour in the order in `diagram-figures.md` section 5 · to try another colour without editing the file, open `figure-flow.html#accent=0F8B8D`
- **The main colour is used for only 4 things:** the border of the `.focus` box · the system name label · the data path and its sequence numbers · the project name in the figure header
- The rest of the skeleton is neutral grey: dashed groups, host machine boxes, cards. Icons use the 7 existing meaning colours (section 5).

## Rules

- **One direction, left → right**: users → channels → system → things the system calls. If a line must go back, say so in the layer's description (for example "push the reply back to LINE") instead of drawing a return line.
- **Sequence number = the path of 1 message**, not a line number. Lines that happen together share the same number (two incoming channels are both ②) · a branch that does not happen every time (such as reading an image) needs no number.
- **5–9 layers in the system box**, in the order the message passes through them · short layer names, 1–2 lines for each function. If there are more than 9 layers, split into a separate figure of the inside of the system.
- **At most 2 emphasised `.guard` layers**, and explain what they mean in the footnote.
- **Connect a line to the layer that really does the work**, not the edge of the big box. The lines are drawn above the boxes, so the arrowhead reaches the inner layer.
- **Lines that share the same gap must not cross.** Shift the bend with `mx` (a line whose end sits higher gets a smaller `mx`), and render to check every time.
- A label on a line is 1–3 short words saying what flows through (`HTTPS` · `webhook` · `ถาม LLM`) · if the start of the line carries a sequence number, use `lp:"start"` when the final segment is too short


## reference: markdown-visuals.md

<!-- merged from skill `markdown-visuals` on 2026-11-27 · description was: Use when a Markdown doc needs an image, SVG or ASCII art -->
# Markdown Visuals

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When NOT to use](#when-not-to-use)
- [Decision tree: which format?](#decision-tree-which-format)
- [1 · Inline SVG (for viewers that render it — not GitHub)](#1--inline-svg-for-viewers-that-render-it--not-github)
- [2 · External image files](#2--external-image-files)
- [3 · ASCII art](#3--ascii-art)
- [4 · Mermaid](#4--mermaid)
- [Combining formats in one doc](#combining-formats-in-one-doc)
- [Accessibility checklist](#accessibility-checklist)
- [Anti-patterns](#anti-patterns)
- [Quick-start recipe](#quick-start-recipe)
- [ไม่ให้ดูเหมือน AI ทำ](#ไม่ให้ดูเหมือน-ai-ทำ)


> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `design-gate/no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `diagrams` (plugin `software-development`) (Mermaid in the house theme) and `diagrams` (designed figures). Document formatting around the picture lives in `design-gate/polished-document-style`.

> **Rule:** Every plan, process, design, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — sketch, flow or state in a business plan, report, process guide, spec or README
- Writing a plan, Functional Specification Document (FSD), Business Requirements Document (BRD), Architecture Decision Record (ADR) or architecture doc that describes layout, flow, or relationships (the diagrams themselves follow the routing rule below)
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`ui-craft` parts `web-app-design` · `windows-app-design` · `mobile-app-design`) (plugin `software-development`) |
| Chart colours and chart design in an app or dashboard | `ui-craft` part `web-app-design` (plugin `software-development`) → `tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagrams` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG (doc read on GitHub → same SVG as a `.svg` file, §2)
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / process / money flow / decision   →  repo note (README · Pull Request (PR) · code note) → Mermaid (`diagrams`, plugin `software-development`)
│                                              project document (BRD · Software Requirements Specification (SRS) · FSD · ADR) or read outside the team → `diagrams`
├─ Architecture / Entity-Relationship (ER) / class → same rule as the line above
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from ui-craft part web-app-design (plugin `software-development`) tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Routing rule (same in `diagrams`):** markdown in a repo read by the team (README · PR · code note) → Mermaid via `diagrams` · a project document (BRD · SRS · FSD · ADR · ER · flows) or anything people outside the team read → `diagrams`.

**Follow the tree above.** Where the doc will be read decides inline SVG vs image file:

- **Inline `<svg>` renders** in VS Code preview, Obsidian, many static-site generators and chat replies.
- **Inline `<svg>` does not render on GitHub** — GitHub's sanitizer drops the `<svg>` element, so the reader sees nothing. Other hosts (GitLab, Bitbucket): preview before relying on it.
- **Doc will be read on GitHub** → save the SVG as `docs/figures/x.svg` and reference it with `![alt](figures/x.svg)` or `<img>` (§2). It still versions cleanly in git and stays editable.

## 1 · Inline SVG (for viewers that render it — not GitHub)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background = bg-canvas of the project palette (see สี below) -->
  <rect width="640" height="280" rx="14" fill="<bg-canvas>"/>

  <!-- content goes here -->
</svg>
</p>
```

**Required attributes:**
- `xmlns="http://www.w3.org/2000/svg"` — required when the same markup is saved as a `.svg` file (GitHub shows `.svg` files only through `![]()` / `<img>`, and only with `xmlns`)
- `viewBox` — sets the coordinate space; lets the SVG scale responsively
- `role="img"` + `aria-label` — accessibility, screen readers
- `<p align="center">` wrapper — centers in the rendered page

**Sizing:** Use `viewBox` (not width/height) so it scales. Common sizes:
- Sketch of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี

If the document or project already has a colour palette, use it. If not, search for references per `design-gate/design-references` (plugin `superuser`), type `document`, and take the colours from the chosen work · if live search is not possible, use the house value `#2A78D6`, mark it `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask (order in `diagrams` → `references/diagram-figures.md` item 5 · colour-by-domain table [`colour-by-domain.md`](../../diagrams/references/colour-by-domain.md)) · for role-based tokens (`bg-canvas` · `accent-primary` · `state-*` …) see [references/svg-snippets.md](svg-snippets.md) · and **1 document uses 1 palette**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

## 2 · External image files

Use when:
- The doc will be read on GitHub (inline `<svg>` is dropped there) — save the SVG as a file
- Photo or screenshot
- Illustration too complex to author as SVG by hand (50+ shapes)
- Reusing the same image across many docs
- Generated by a design tool (Figma export, etc.)

### Folder convention

```
docs/
  figures/
    01-hover-state.svg
    02-empty-state.png
    architecture-overview.svg
    src/                      editable sources (.mmd · .drawio · .html)
```

- Put figures in `docs/figures/` (editable sources in `docs/figures/src/`) — relative to the doc · brand files (logo, icons) live in the project-root `assets/`, not here
- Name files `<doc-section-number>-<short-slug>.<ext>` so they sort with the doc
- Prefer `.svg` over `.png` when possible (scales, smaller, diff-friendly)

### Reference syntax

```markdown
![Hover state showing magnified Projects tile](figures/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="figures/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file in `docs/figures/`.

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**Choosing a diagram type, theme, readability rules and Thai labels is covered in `diagrams` (plugin `software-development`) items 1–5 and `assets/mermaid-theme.md`** · for Mermaid in project documents that must be converted to a picture for Word, use the converter in `diagrams` → `engine-mermaid.md`
This file only says *when to choose Mermaid over other formats*

| Choose Mermaid when | Choose something else when |
|---|---|
| It is boxes and arrows that the engine can lay out | If you must control placement yourself, use inline SVG; for a figure that must look designed, use `diagrams` (HTML layout or engine-svg-python) and embed it as an image file |
| It lives in a file that must be diffed in git | It is a real screenshot: use an image file |
| Readers open it in GitHub or Notion | Readers open it in a Word document or slides: use an image file |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](combining-formats.md). Don't force everything into one format.

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

## Anti-patterns

- **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- **PNG screenshots of text** — use the text, in a code block
- **Mermaid syntax newer than the viewer** — GitHub's Mermaid version changes; check it with a ```` ```mermaid ```` block containing `info` before using new diagram types
- **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export

## Quick-start recipe

When a markdown doc needs a design picture (clickable app screens go to the platform design skill, `mockup/<CODE>-mockup.html`):

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

## ไม่ให้ดูเหมือน AI ทำ

Before sending, go through item 3 of `design-gate/no-ai-look` — for HTML work, run its script · every piece must also pass eye check 3.2 (a web page adds items 10–14), because a script result of 0 items is not yet a pass · the bans in this file are specific to this work, and the full list for all media is there


## reference: pitfalls.md

# Pitfalls found in practice — HTML skeletons

Symptoms that come up again and again when making figures with the skeletons in `assets/`, with their causes and fixes. Pitfalls of the SVG/Python engine are in [engine-svg-python.md](engine-svg-python.md) section 9.

| Symptom | Cause · fix |
|---|---|
| Arrowheads vanish from the whole figure | The script deletes every `path` before redrawing, including the arrowhead triangle inside `<defs>`. Delete only `path.wire` (the skeletons already do this) |
| A line goes to the wrong box | The `id` is attached to another box that looks the same. Open the console, look for `wire: ไม่พบ id`, and check that the `id` is unique |
| A line aims at the middle of a tall box and cuts across what is inside | Set `tp` / `fp` so the line enters near the top edge |
| Thai vowels disappear | The machine has no Thai font in the list. Install Noto Sans Thai or add an installed font to the list |
| Image is blurry on a slide | Rendered at a 1x multiplier |
| Image has a lot of white margin | You captured the whole page instead of only `.sheet` |
| A line comes loose after editing text | You wrote fixed line coordinates instead of using `WIRES` |
| A label on a line covers a box, or hides the line so it cannot be seen | The label is wider than the gap between columns. Increase `gap` or shorten the label text |
| A Thai box name wraps to a second line | The column is too narrow. Widen that column. Do not shrink the font |
| Icons used as image files, and the lines go wrong everywhere | The script calculates before the images finish loading. Call `draw()` in `window.onload`, not when the script is read (`figure-cloud.html` already does this) |
| Elbow lines in `figure-flow.html` cross each other | Several lines use the same gap. Set `mx` so a line whose end is higher gets a smaller value, then render again |
| Arrows disappear under the system box | The `.wires` layer has no `z-index`. The flow skeleton sets it already. If you copy to another skeleton, set it there too |
| The figure comes out in the example figure's colour | You forgot to edit `--accent`. Find the project's main colour by `diagram-figures.md` section 5 before rendering |
| A line cuts diagonally across the whole figure | The line starts from a box inside the boundary box. Start it from the edge of the boundary box instead |


## reference: software-diagrams.md

<!-- merged from skill `software-diagrams` on 2026-11-27 · description was: Use when a README or PR needs a quick Mermaid diagram -->
# Software Diagrams

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [1 · Which question, which diagram](#1--which-question-which-diagram)
- [2 · Theme — one set for the whole project](#2--theme--one-set-for-the-whole-project)
- [3 · Diagrams that need real logos (infrastructure)](#3--diagrams-that-need-real-logos-infrastructure)
- [4 · Rules that make it readable](#4--rules-that-make-it-readable)
- [5 · Thai in diagrams](#5--thai-in-diagrams)
- [6 · Render and look — never skip](#6--render-and-look--never-skip)
- [Do not look AI-made](#do-not-look-ai-made)

> **The one rule of this skill:** a diagram answers **one question**.
> If it answers 2 questions, draw 2 pictures.

> **The destination decides the tool:** this skill draws quick diagrams with Mermaid in the house theme, only for a README · Pull Request · note in code.
> For figures in project documents (BRD · SRS · FSD · ADR · ER · process maps), client proposals, slides and print work, go to `diagram-figures.md`. The full table for choosing is at the top of that skill.
>
> **Colour in a figure must carry meaning, not decorate.** If the source document already declares a `doc-theme`, use that value and do not pick new colours per figure (the default is the house set in `design-gate/polished-document-style` · for the meaning of colours see `document-design/references/tokens-and-type.md`):
> A quick diagram uses **one main colour** = "the thing we are talking about" · grey = external/closed systems · white with a grey line (`store`) = data stores · other boxes use the defaults (3 classes `focus` · `ext` · `store` in `assets/mermaid-theme.md`). If you need several colours to separate failure points, exceptions and successes, the figure answers several questions. Split it into new figures or use `diagram-figures.md`.

## When to use this skill

In a README · Pull Request · note in code:

- Explain the system architecture
- Explain the order of work across several parts
- Explain the states of data
- Design a database
- Say what runs on which machine
- Review a diagram someone else drew


Not for: choosing SVG / ASCII / Mermaid → `markdown-visuals.md` · screenshots and wireframes → `ui-craft` + the platform skill · data charts → `ui-craft` part `web-app-design` `tokens.md` heading "สีข้อมูล (กราฟ)" · choosing an architecture → `architecture`

## 1 · Which question, which diagram

**Start from the question, not from the diagram type.**

| The question in the reader's head | Diagram |
|---|---|
| "Who outside does this system talk to?" | C4 level 1 — System Context |
| "What is inside the system? Do the parts run separately?" | C4 level 2 — Container |
| "How is this service divided inside?" | C4 level 3 — Component |
| "When I press this button, what happens, in order?" | Sequence |
| "How can this document change state?" | State |
| "Which table links to which table?" | Entity Relationship (ER) |
| "What machines does the real thing run on, and how many?" | Deployment |
| "Who approves after whom?" | Flowchart (work steps) |
| "A cloud diagram in the repo with real AWS / Azure logos" | Infrastructure — section 3 |
| "I want a nice picture for the client proposal" | Not the job of this skill — `diagram-figures.md` |

**Always draw C4 levels 1 and 2 in full first.** Draw level 3 only for the parts that are truly complex.

## 2 · Theme — one set for the whole project

Put the `%%{init: ...}%%` line on the **very first line** of every diagram, and use the one main colour with the 3 classes `focus` · `ext` · `store`. The main colour is reserved for "the thing we are talking about" only.
The theme line, colour stand-ins, classes and rendered examples are in [`assets/mermaid-theme.md`](../assets/mermaid-theme.md). The table that matches kinds of work to colour tones is in `diagrams/references/colour-by-domain.md`.

> Warning: **`fontFamily` must sit outside `themeVariables`.** If you put it inside, it is silently ignored and Mermaid falls back to its default font.

**Check with a tool before every send.** This rule is forgotten most often:

The scripts are in the `scripts/` folder of this skill. Run them with the script's full path and the `docs` folder of the project being checked (`<path ของ skill>` = the folder where this skill is installed):

```bash
node <path ของ skill>/scripts/check-mermaid-theme.mjs docs          # exit 1 with file:line of each block that lacks %%{init
node <path ของ skill>/scripts/check-mermaid-theme.mjs --self-test   # proves the checker still catches it
```

An agent with no shell cannot run it → the main agent runs it after taking the work back.

## 3 · Diagrams that need real logos (infrastructure)

If an infrastructure diagram that lives in the repo needs real Amazon Web Services (AWS) · Azure · Kubernetes icons, which Mermaid cannot draw, use the **`diagrams`** library (Python + Graphviz), starting from [`assets/infra-diagram.py`](../assets/infra-diagram.py).
Install steps, the commonly used node rules and the traps are in [`assets/diagrams-python.md`](../assets/diagrams-python.md). For cloud diagrams that a client or a slide will show, use `diagram-figures.md`.

## 4 · Rules that make it readable

**No more than 7 boxes.** Past that, readers stop reading (count real boxes, not subgraphs).

**Count boxes before drawing, not after.** If there are more than 7, **split the figure by the order of the story before drawing**. Note the split in `decision-desk/decision-log` and say so in the reply.
Never draw everything and then say so afterwards.

The sample reply to the Thai user (kept in Thai because it is the text the agent says):

```
เนื้อหาที่ให้มามี 20 กล่อง เกินเพดานสามเท่า ขอแยกเป็น 3 รูป:
  รูปที่ 1 — ตอนทดลอง: อะไรเข้า อะไรออก
  รูปที่ 2 — ตอนรันชุดการทดลอง
  รูปที่ 3 — ตอนออกรายงาน
อยากแบ่งแบบอื่น บอกได้ — แยกใหม่ได้
```

> **"Separate files are fine" means you must split.** If the request leaves room to split and the content passes the cap,
> treat it as an order to split, not an option.

**These 3 things do not belong in a diagram.** They are manual content, not a picture, and they swell the boxes until the diagram warps.

| Do not put in | Where it goes |
|---|---|
| Command-line options `--all` `--resume` `--limit N` | `README` or `docs/cli.md` |
| Lists of inputs/outputs for several parts | **A table beside the figure** — columns: component · takes what · gives what · stored where |
| Every file name or path | The same table. Put in the figure only the ones that carry the point |

**A request like "show the input/output too" does not mean draw everything as boxes.**
A box is something that *does work*. What *flows through* is a label on the line. *Detail* goes in the table.

**One level of detail across the whole figure.** If `PostgreSQL` and `OrderRepository.cs` sit in the same figure,
that signals a mix of 2 levels.

**Every line needs a label,** and the label must say **what flows through**, not that they are connected.

```
Wrong: api --> db
Wrong: api -->|ใช้| db
Right: api -->|SQL · อ่าน-เขียนคำสั่งซื้อ| db
```

**One direction.** Top to bottom (`TB`) or left to right (`LR`). Choose one and let no line run backwards.
A backward line means the boxes are in the wrong order. It does not mean you need a double-headed arrow.

**Box name = what it does, not the technology.** Put the technology on a second line in small type.

```
Wrong: [Redis]
Right: ["ที่พักข้อมูลชั่วคราว<br><small>Redis</small>"]
```

**Add a legend when colour or shape carries meaning.**
If you cannot explain why this box has a different colour, that colour should not be there.

## 5 · Thai in diagrams

- **A Thai line label longer than 3 words overlaps the line.** Shorten it, or add `<br>` yourself.
- **Do not use `()` `[]` `{}` in text.** They clash with Mermaid syntax. Always wrap the text in `"..."`.
- **Tone marks float above the box** when `fontSize` is below 12px. Do not go lower.
- Table and field names in an ER diagram use English (matching the real database).
  Descriptions can use Thai.

## 6 · Render and look — never skip

A diagram that was never rendered is still only text, not a picture. Some syntax mistakes give no error in Mermaid,
and the result often does not match what you thought.

```bash
# not installed on the machine · pin the version the theme was tested on (11.17.0 · the latest 12.0.0 as of 2026-10-14 has not been tested with the theme)
npx -y @mermaid-js/mermaid-cli@11.17.0 -i diagram.mmd -o diagram.png -b white -s 2
```

Then **open the image file and look at it with your eyes**. Go through this list:

- [ ] Are there at most 7 boxes?
- [ ] Does every line have a label, and does the label say what flows through?
- [ ] Does any line run in the opposite direction?
- [ ] Does a label overlap a line or a box?
- [ ] Is the Thai text complete, with no missing vowels?
- [ ] Is the level of detail the same across the figure?
- [ ] Does the diagram carry a date and an owner? (without them nobody dares to edit it after a year)
- [ ] Can someone who has never seen this system read it and answer the original question?

**Mermaid limits to know before you waste time:**

| Symptom | Cause |
|---|---|
| `direction LR` inside a subgraph does not work | It is ignored when the subgraph has a line linking out — order the boxes yourself |
| A box is abnormally wide | One long line of text — add `<br>` yourself, Mermaid does not wrap lines |
| Lines overlap in a mess | Too many boxes — Mermaid has no smart line routing, so cut boxes |
| The font does not change | `fontFamily` is in the wrong place (see section 2) |

If you truly cannot get the layout you want and the figure stays in a markdown document, draw an inline SVG per `markdown-visuals.md`. If the figure must look designed, go to `diagram-figures.md`.

To record why a design was chosen, use `architecture`. A figure that must look designed or needs sign-off → `diagram-figures.md`.

## Do not look AI-made

Before sending, walk through item 3 of `design-gate/no-ai-look`. For HTML work, run its script. Every job must also pass eye check 3.2 (web pages also answer items 10–14), because a script result of 0 items is not yet a pass.


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG pictures of a screen inside .md docs (the real mockup is HTML) · used by [SKILL.md](markdown-visuals.md) §1

## Colour: it comes from the subject, not from a ready-made table

If the document or project already has a colour set, use that set.
If not, use the house value `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask. Propose a tone drawn from the subject in the report: medical green · finance dark blue ·
industrial amber · government navy · general software blue (the full table is in [`diagrams/references/colour-by-domain.md`](../../diagrams/references/colour-by-domain.md))

Define **tokens by role** at the top of the document, then use the same values in every figure in that document:

| Token | Role | Comes from |
|---|---|---|
| `bg-canvas` | Background of the figure | The darkest shade (dark mode) or the lightest (light mode) |
| `bg-surface` | Sheets, panels, cards | Different enough from canvas to show the edge without drawing a line |
| `bg-elevated` | A tile raised one more layer | |
| `accent-primary` | Emphasis, the active state | **The brand colour** (none → `#2A78D6` + `(รอยืนยัน)`) |
| `text-primary` | Main text | Contrast ≥ 4.5:1 against the surface it sits on |
| `text-muted` | Secondary text, placeholder | `rgba(...,0.55)` of `text-primary` |
| `state-success` · `state-warning` · `state-danger` | Status | **Does not change with the brand.** Green always means pass and red always means fail |

**One document, one colour set.** 10 figures in one document with mismatched colours are harder to read than plain figures with matching colours.

## Snippets

> The examples below use one dark-mode colour set as a stand-in only.
> **Change the colour values to match the agreed set before use.** The structure is what you copy, not the colour values.

**Window chrome (desktop app mockup):**
```xml
<rect x="20" y="20" width="600" height="360" rx="10" fill="#2a3245"/>
<circle cx="42" cy="42" r="6" fill="#ff5f57"/>
<circle cx="62" cy="42" r="6" fill="#febc2e"/>
<circle cx="82" cy="42" r="6" fill="#28c940"/>
<text x="320" y="46" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Window title</text>
<line x1="20" y1="64" x2="620" y2="64" stroke="rgba(255,255,255,0.08)"/>
```

**Phone frame (mobile mockup):**
```xml
<rect x="100" y="20" width="200" height="400" rx="28" fill="#0a0d14" stroke="#2a3245" stroke-width="2"/>
<rect x="120" y="50" width="160" height="340" rx="6" fill="#1c2230"/>
<rect x="170" y="28" width="60" height="14" rx="7" fill="#0a0d14"/>
```

**Button:**
```xml
<rect x="40" y="100" width="120" height="40" rx="8" fill="#0078d4"/>
<text x="100" y="125" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="14" font-weight="500">Click me</text>
```

**Card with title and body:**
```xml
<rect x="40" y="40" width="240" height="120" rx="12" fill="#2a3245"/>
<text x="60" y="72" fill="#fff" font-family="system-ui" font-size="14" font-weight="600">Card title</text>
<text x="60" y="96" fill="rgba(255,255,255,0.7)" font-family="system-ui" font-size="12">Supporting body text goes here.</text>
<rect x="60" y="116" width="80" height="28" rx="6" fill="#0078d4"/>
<text x="100" y="134" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Action</text>
```

**Status badge (top-right of tile):**
```xml
<circle cx="<tile-right-x>" cy="<tile-top-y>" r="9" fill="#e24b4a"/>
<text x="<tile-right-x>" y="<tile-top-y + 4>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="13" font-weight="500">!</text>
```

**Running dot (indicator below tile):**
```xml
<circle cx="<tile-center-x>" cy="<tile-bottom-y + 12>" r="4" fill="#4cc2ff"/>
```

**Tooltip text (no balloon — plain floating text):**
```xml
<text x="<tile-center-x>" y="<tile-top-y - 12>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12" font-weight="500">Tooltip label</text>
```

## Worked example — UI state mockup

Use this pattern by default for showing UI feature states. On GitHub, save the SVG as a file in `docs/figures/` and reference it (inline `<svg>` is dropped there).


## reference: wires.md

# Connector wires — details

Open this when writing `WIRES` or fixing a line that goes the wrong way.

**Within the same column**, use the downward arrow `.down` between boxes. Nothing more to write.

**Across columns**, use the `WIRES` list at the end of the file. The script draws the lines after the layout is done:

```js
{from:"n-browser", fs:"r", to:"n-server", ts:"l", tp:0.10, label:"HTTPS 443"}
//    ^source id   ^exit side ^target id  ^entry side ^position on the edge 0=top 1=bottom
```

The calculation happens after layout because box positions depend on the length of the Thai text.
If you write fixed coordinates, one text edit knocks the lines off across the whole figure.

**Rules:**

- **Lines run only vertically or horizontally, and turn with rounded corners.** The `elbow()` function in the skeleton does this itself (horizontal → vertical → horizontal). Use `mx` to shift the bend when several lines share one gap. Do not write a `path` as a straight line from point to point, because when the boxes at the two ends have different heights, the line goes slanted.
- **A label must be narrower than the gap between columns.** Otherwise it covers a box or hides the line. If a label gets longer, raise the `gap` of `.stage` to match.
- Move a label along the line with `lp` (0 = source · 1 = target · omit = middle of the line).
- For a line not yet really connected, use `planned:true` to get a dashed line, and **explain the meaning in the footnote.**
- **No more than 5** cross-column lines per figure, because beyond that the figure turns into a spider web.
- Connect to the **smallest box that is correct**, not the large box around it. If a box is very tall, set `tp` so the line does not aim at the middle of the box.
- A label on a line says **what flows through**, such as `HTTPS 443`, not `เชื่อมต่อ` (connect). If there is nothing to say about a line, leave the label off rather than writing "use".


---

# skill: slide-deck

Use when planning a slide deck story or an HTML slide deck

# slide-deck — plan a deck whose titles tell the story, then deliver it as .pptx or HTML

> **One rule:** every slide title is the conclusion of its page. Read the titles alone in order, and they must tell the whole story. If they do not, reorder the slides or cut them before any design work.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Make a slide deck", "presentation", "plan the story and layouts" (no file type given) | [`references/presentation-design.md`](references/presentation-design.md) (builds a .pptx with `document-design`) |
| "Slide deck in HTML", "animated deck", "presents from a browser", "click-by-click reveal" | [`references/html-slide-deck.md`](references/html-slide-deck.md) |
| "Convert this .pptx to HTML", "make the HTML look like the pptx" | [`references/from-pptx.md`](references/from-pptx.md) |

Colour and mood for every deck: [`references/deck-theme.md`](references/deck-theme.md) (theme rules in [`references/theme.md`](references/theme.md)). Layouts and the shell for HTML: [`references/layouts-and-shell.md`](references/layouts-and-shell.md). Mistakes to avoid: [`references/anti-patterns.md`](references/anti-patterns.md). Extra detail: [`references/deck-details.md`](references/deck-details.md).

## Steps every part shares

1. Choose the file. If the type is not stated, make a .pptx, and say in one line that an animated HTML version is possible.
2. Collect sources for every fact, number or competitor the deck cites, before writing titles.
3. Take the colours from the source work (run `scripts/source_palette.py` on the logo, file or website the user gave).
4. Write each title as plain text, one per slide. Reorder until the story reads, then cut slides that do not move it.
5. Budget each slide: title at most 2 lines, at most 6 bullets, at most 2 lines per bullet. Cut bullets rather than shrink text.
6. Keep content text at 18 pt or larger in a .pptx. Put the footer (section name left, page number right) on every slide.
7. Render every slide, look at the whole deck as thumbnails, then run `scripts/check_deck.py` (or `scripts/check_html_deck.py` for HTML).

## Check before done

- Reading only the titles gives the whole story, and every title is a conclusion.
- Each chart makes one point, and the chart has its data source and period.
- Every slide has a page number, and no slide is visibly denser than the others.
- The deck was opened once on a real screen or projector.
- The 13 items in `references/anti-patterns.md` were checked, and the line `ด่านก่อนลงมือ:` closes the work.


## reference: anti-patterns.md

# Slide anti-patterns

Use when checking a deck before sending.

- **The slide title is a topic name.** "ภาพรวมระบบ" (system overview) says nothing
- **The slide title is shortened until it must be guessed.** 2 phrases placed side by side with no connector, or jargon the audience does not know ("Guard" · "โค้ด" (code)) for a general audience
- **The slide is a document.** A full page of paragraphs, 12 pt text
- **Reading the slide aloud to the audience.** If every word is already on screen, no one needs to speak
- **Shrinking the text to make the content fit.** Cut content instead
- **Bullets nested 3 levels.** The maximum is 2 levels; reaching 3 means you should split the slide
- **Animating in one bullet at a time on every slide.** Slow, and the audience is annoyed from slide 3
- **Stock images unrelated to the content.** People shaking hands, arrows shooting up
- **A 15-row data table on a slide.** Move it to an attachment
- **A chart copied whole from Excel,** with gridlines and a full legend
- **Brand colour on everything.** Use the brand colour only for what you want people to look at
- **No page numbers.** The audience cannot refer to a slide
- **Sending the deck without ever viewing the whole set as thumbnails**


## reference: deck-details.md

# Deck details · presentation-design

Open this when ordering a story, choosing layouts, setting text sizes, building data slides, or setting Thai type.

- [Story order by purpose](#story-order-by-purpose)
- [Slide title examples](#slide-title-examples)
- [Six layouts](#six-layouts)
- [Text size](#text-size)
- [Data slides](#data-slides)
- [Thai on slides](#thai-on-slides)
- [Off-the-shelf look: avoid](#off-the-shelf-look-avoid)
- [Related skills](#related-skills)

## Story order by purpose

First ask what the deck needs from the audience, then choose the order.

| Purpose | Order |
|---|---|
| **Ask for approval / a decision** | Conclusion and the ask → 3 reasons → alternatives considered → risks → the ask again |
| **Progress report** | Overall status (green/yellow/red) → what is done → what is blocked and what is needed from whom → next period's plan |
| **Review a plan or design** | Problem solved → constraints → chosen design → why others were not chosen → points where you want opinions |
| **Training** | What they can do after learning → concepts → demo → let them try → summary and what to study next |
| **Selling work** | Customer's problem (in their words) → results they will get → our method → evidence → price and next step |

For executives the conclusion goes on the first slide, not the last: they may have only the first 5 minutes.

## Slide title examples

```
ผิด: ผลการวิเคราะห์เวลาดำเนินการ
ถูก: ขั้นอนุมัติกินเวลาสองในสามของทั้งหมด

ผิด: สถานะโครงการ
ถูก: ส่งทันกำหนด ยกเว้นงานเชื่อมระบบบัญชีที่ช้า 1 สัปดาห์

ผิด: ทุกข้อความผ่าน 8 ขั้น: Artificial Intelligence (AI) ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ
ถูก: ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน
```

A title may run up to 2 lines. Do not shorten it into a topic name or until it reads badly: a title with 2 parts needs a connector, use phrases people say, choose words by who is listening (`human-writing` item 6).

Bullets are gist, not full sentences: people read faster than a speaker talks, so full sentences make the audience read instead of listen.

## Six layouts

Overview: `assets/slide-mockup-preview.webp` · `assets/slide-mockup.html` has all 6 rendered at 1280×720 and checked by eye (open in a browser, or use as the model for a `.pptx`).

| # | Layout | Use when |
|---|---|---|
| 1 | **Cover**: big title + divider line + description | First slide |
| 2 | **Title + bullets + side strip** | General content, with the side strip holding the source of the numbers |
| 3 | **3 number boxes** | Results · metrics · before-after |
| 4 | **Chart + explanation beside the chart** | Data slides |
| 5 | **Chapter divider**: solid main-colour fill, full slide (a dark deck may use a dark fill) | Starting a new section · giving the audience a break |
| 6 | **One statement in the middle of the slide** | The ask · conclusion · customer quote |

Side strip (layouts 2 and 4): put what the audience might ask: source of the numbers, how to read the chart, limits of the data. Not extra content.

Every slide has the same footer: section name on the left, page number on the right (so the audience can say "ขอย้อนกลับแผ่น 9").

## Text size

A 16:9 slide 13.333 inches wide = 960 pt = 1280 px in a browser. 1 px = 0.75 pt.

| Item | In the mockup | In the .pptx file |
|---|---|---|
| Cover title | 54 px | **40 pt** |
| Big number | 46 px | **34 pt** |
| Slide title | 34 px | **26 pt** |
| Bullet | 24 px | **18 pt** |
| Description | 22 px | **17 pt** |
| Side strip | 19 px | **14 pt** |
| Lead-in · label | 16 px | **12 pt** |
| Footer | 14 px | **11 pt** |
| Page margin | 64 px | **48 pt** (0.67 inch) |

Exception for the Stage deck: the "ตัวอย่าง" (example) line · the sub-text in a process table · Q/A under numbers may use 12–14 pt, because the audience reads them later. Slide titles, step names and the main gist stay at 18 pt or more.

18 pt is the smallest content size in a meeting room. If content does not fit at 18 pt, there is too much content: never reduce the size, cut content. 2 weights are enough (regular + bold): slide titles bold, body text not.

## Data slides

1 chart, 1 conclusion. If a chart says 2 things, split it into 2 slides.

- The slide title is the conclusion from the chart, not the chart's name
- Highlight the bar/line that is the point with the brand colour, and make the rest grey
- Put the numbers on the bars directly
- Remove gridlines, unnecessary axes and the legend if you can label the data directly
- Always state the data source: period, sample size, source (side strip or footer)
- A table over 5 rows by 4 columns should not be on a slide: make it a chart, or move it to an attachment

Chart colour palette: `diagrams` → `references/colour-by-domain.md` · for charts that must also be used with app screens, `ui-craft` part `web-app-design` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" (data colours, charts).

## Thai on slides

- Line height at least 1.4 for slide titles and 1.5 for body text, because below that the upper and lower vowels of 2 lines collide (middle value in `human-writing` `references/thai-line-breaking.md`)
- For a long Thai slide title, break the line yourself where the thought ends: the program breaks mid-word because Thai has no spaces between words
- A font with both a real regular and a real bold weight: fake bold blurs the vowels
- Thai mixed with English on the same line: one font family that has both languages, otherwise letter heights differ and the line looks tilted
- Font settings in a real `.pptx` file (including the complex script problem): `document-design`

## Off-the-shelf look: avoid

- Things that make a deck look off-the-shelf: a colour line under the title of every slide · cream/beige background as the default · the same 3-column icons on every slide · gradient text · long centred paragraphs
- Flat decks: dark or all-white background across the whole deck when the source work is vividly coloured · the main colour appearing only as thin lines · more than 3 text-only slides in a row · colours not in the source work (fix in [`deck-theme`](deck-theme.md) item 3)

## Related skills

| Need | Use with |
|---|---|
| A single .html deck presented from a browser (menu · notes · clock · click for detail) | `html-slide-deck.md` |
| Convert .pptx to .html with animation · click-by-click reveal | `html-slide-deck.md` (`references/from-pptx.md`) |
| Spacing rules and eye order (app screens) | `ui-craft` (plugin `software-development`) |
| Content comes from a Software Requirements Specification (SRS) | `requirements-writing` (plugin `software-development`) |
| Cut content down to what is necessary | `superuser:ground-rules` |
| Brand colour and type system · illustration | `graphic-design:design-by-type` (plugin `software-development`) |


## reference: deck-theme.md

# Deck theme: bright, and fitted to the source work

The central file for every slide skill (`slide-deck` · `html-slide-deck.md` (including the entry from .pptx) · `StageDeck` in `document-design`). Open it at item 1 step 0, before opening the program.

> **The one rule:** the deck must look like it came from the source work, in both colour and mood. Someone who sees the deck next to the source document must know it is the same work.

## 1 · Colour comes from the source work first

"Source work" is what the user gave you to turn into a deck, such as a report .docx · .pdf · an existing .pptx · a website or app · a poster · a logo · a product photo. Find the colour in this order and stop at the first hit:

1. **If the source work has its own colours, extract them with the script**, not by eye:
   ```bash
   python scripts/source_palette.py <ไฟล์ต้นทาง> [โลโก้] [ภาพหน้าจอ]
   ```
   The script reports the main colour, up to 2 secondary colours, and whether the source background is dark or light, then prints values ready to put into `build_deck.py` · `StageDeck` · `pptx_to_html.py`. It reads .pptx .docx .xlsx .html .css .svg images and .pdf (needs `pdftoppm`). Colours it ignores: grey, white, black · the default Office theme (colours the author did not choose) · Word styles the content does not use · colours that appear fewer than 3 times or under 10% of the main colour
2. If the source has no colour (plain text · black-and-white documents), use the project's colour in the order in `diagrams` → `references/diagram-figures.md` item 5 (`doc-theme`, then the brand colour in code or the logo)
3. If there is still none, search for a reference per `design-gate/design-references`, type `slide`, with the work's keywords, then extract colours from the chosen work (the same script works on a screenshot of the reference)
4. If live search is not possible, use the house colour `#2A78D6` and write `(รอยืนยัน)` (to be confirmed) in the report

You must still open and look at the script result once: the main colour it gives must be one that people remember the work by (logo colour · cover colour). If it picked the colour of an illustration or a screenshot that happens to cover a large area, feed it the logo or cover file instead.

**Never invent a secondary colour.** The secondary colour must come from the source work. If the source has one colour, use one colour, and make it vivid with item 3 instead.

## 2 · Mood comes from the content

Start from the `เนื้อหา:` brief (gate item 0 of `design-gate/design-references`, file `references/content-to-theme.md`): its **อารมณ์** and **ธีม** pick the row below. That file holds the same table for every kind of work, plus what colours tend to carry.

Look at what the source work is about and who is listening, then choose from the table. Material used for visuals must come from that work's own world (real product photos · real screens · materials · signs of the trade), not ready-made icons.

| Content | Mood | Background | Shapes and images | Density |
|---|---|---|---|---|
| Sport · fitness · events · product launches | High energy | Light, but the cover and section openers are solid main colour | People or product photos cut to the edge · big numbers | Low, 1 point per slide |
| Children · education · training · community | Friendly | Light | Very rounded corners · secondary colour separates lesson sections · real photos from the classroom or event | Medium |
| Food · travel · shops · lifestyle | Makes you want to try | Warm light, or full-slide photo | Real photos covering half a slide or more · text on a solid colour band | Low |
| Medical · health | Trustworthy | Clean light | Slightly rounded corners · emphasise with the main colour one spot at a time · no frightening images | Medium |
| Finance · law · government · executives | Stable | Light | Straight lines · tables and charts are the stars · full-slide main colour only on the cover and conclusion slides | Medium to high |
| Software · technical · system demos | Clear and systematic | Follows the app's design (a dark app may use a dark background) | Real screenshots · system diagrams · short code | Medium |
| Research · theses · project defences | Credible | Light | Real result charts · main colour used to highlight the result that matters | Medium to high |
| Memorials · disasters · bad news | Calm | Light or light grey | No full-slide saturated colour · few images | Low |

If the work matches several rows, go by the audience (fitness but asking executives for money → the finance row, then add fitness images) · if it matches no row, choose the closest row and write a 1-line reason at the head of the work.

## 3 · What "bright" means on a slide

When the user says "สดใส" (bright) "น่าดู" (good to look at) "ไม่จืด" (not flat), or says nothing at all, do the following by default (`design-gate/no-ai-look` forbids ordering by free-floating adjectives, so this is turned into rules that can be checked):

1. **Light background by default.** Use a dark background only when the source work or app is dark (the script says `พื้นต้นทาง … (เข้ม)`)
2. **Full-slide main colour** on the cover, section openers and closing page · `build_deck.py --theme bright` does all 3 types (`.hero` `.divider` `.close`) · `StageDeck(block=True)` does the cover and chapter dividers (no separate closing page) · content pages use a light background, with cards tinted faintly with the main colour
   - **Logos on solid-colour pages use a pure white or pure black version** to match that page's text colour, because a logo the same colour as the background, or close to it, disappears · if you only have a coloured logo, place it on a white rounded box, or move the logo to the first content page
3. **Secondary colour from the source** (if any) separates sections, for example section 2's opener is fully the secondary colour, or it emphasises numbers whose meaning differs from the main colour · the whole deck has at most 3 colours plus status colours
4. **Real images in at least 1 of every 3 slides.** Images from the source work, screenshots, product photos, or images made per `image-generation` · no more than 3 text-only slides in a row
5. **No layout repeated more than 2 slides in a row** (`design-gate/no-ai-look` item 3.2 item 5)
6. **Never use vividness in place of readability.** Text of every size on a solid colour must reach ≥ 4.5:1 · `build_deck.py --theme bright` and `StageDeck(block=True)` choose for you: white when white reaches 4.5:1; if not, near-black (for example on yellow); and if near-black still falls short, pure black (for example on orange, teal and the house blue) · you must still open every slide image and check per item 7 of `slide-deck`

Do not count as vividness, and still forbidden per `design-gate/no-ai-look`: purple-blue gradients · gradient text · neon or glow · several pastel colours not in the source work · decorative icons on every card · every animation

Work in the "stable" and "calm" rows of item 2 uses only items 1 2 4 5 6 · use item 3 when the source really has a secondary colour, and full-slide main colour is left only on the cover and closing page.

## 4 · Put it into the tools

| Tool | What to put in |
|---|---|
| `html-slide-deck.md` | `build_deck.py … --theme bright --brand <main colour>,<light colour>,<secondary colour>` · pages that use the secondary colour full-slide get `data-tone="2"` on `<section>` · a dark source background uses `--theme dark` |
| `StageDeck` (.pptx) | `StageDeck(accent="<main colour>", bg="FFFFFF", block=True)` when the background is light (`block=True` makes the cover and chapter dividers solid full-slide main colour) · the secondary colour is used for figures and charts passed in (`diagrams` `#accent=`) |
| `html-slide-deck.md` entry from .pptx | The look comes from the .pptx · make the .pptx per this file first, then `--accent <main colour>` |
| Diagram figures in the deck | `diagrams` with `#accent=<main colour>&bg=<deck background colour>` |

## 5 · Check before sending

- [ ] Place the deck thumbnails next to the source work: the main colours match and it is clearly the same work
- [ ] Every colour in the deck comes from the source work or the order in item 1 · the report says which file
- [ ] The mood matches a row in item 2 and the reason is written at the head of the work
- [ ] Item 3 is complete: background follows the source · full-slide main colour on section-change pages · real images ≥ 1 in 3 · no more than 3 text-only slides in a row
- [ ] `check_deck.py` or `check_html_deck.py` reports 0 problems, then open `sheet-*.png` and look at every slide


## reference: from-pptx.md

# Entry from .pptx → .html

An extension of [`SKILL.md`](html-slide-deck.md) · use it when a .pptx already exists, or when you must deliver both .pptx and .html from one source · the `scripts/` and `assets/` paths in this file count from the `slide-deck/` folder · this route uses the scripts `pptx_to_html.py` `check_html_deck.py` `click_steps.py` and does not use `build_deck.py`

> **One rule of this route:** the look comes entirely from the .pptx · fix the .pptx and convert again, never edit a converted .html.


The model is the Independent Study (IS) presentation deck "Few-shot Key Information Extraction (KIE) · Confidence-Gated Cascade" (41 slides + 15 interactive pages): finish the .pptx first, then convert it into one .html file where every piece slides in one row at a time, with a progress bar, table of contents, speaker notes and a clock, in the style of the X Fitness deck.

## When to use

- A .pptx already exists (made by hand in PowerPoint · `StageDeck` · `BrandDeck` · received from a customer) and you want to present it with browser animation
- You must deliver both .pptx (for people to keep editing) and .html (opens on any machine) from one source
- You want to add interactive pages (type a number and calculate · play step by step) between the PowerPoint pages

## 1 · Steps

1. **Finish the .pptx first** — colours and mood come from the source work, following `presentation-design.md` [`references/deck-theme.md`](../../slide-deck/references/deck-theme.md) (extract colours with `slide-deck/scripts/source_palette.py` · light background is the default · section-divider slides are a full sheet of the main colour, which `StageDeck(..., block=True)` does) · if the source work has no colours and no look yet → **search for a model first:** take the project's words and search live following `design-gate/design-references` (plugin `superuser`) type `slide`, then extract colours from the chosen work · the stored palette library is for when a live search is not possible · no .pptx → build one with `document-design` (`StageDeck`) · the slide title goes in the title placeholder (it becomes the name in the table of contents) · put speaker notes in notes · split into parts with PowerPoint Sections (they become groups in the table of contents)
2. **Steps you want to open one click at a time** — in PowerPoint add On Click animation · when building with python, use `scripts/click_steps.py`:
   ```python
   from click_steps import add_click_steps
   add_click_steps(slide, [[box1, label1], [arrow, box2], [box3]])   # 3 steps · PowerPoint plays it the same way
   ```
3. **Convert:**
   ```bash
   python scripts/pptx_to_html.py docs/<PRJ>-DECK-v1.0-DRAFT.pptx -o docs/<PRJ>-DECK-v1.0-DRAFT.html --title "<deck title>" --accent <project main colour, none → 2A78D6>
   ```
   `--accent` = colour of the progress bar and buttons (omitted = the theme's accent1) · images are embedded for you · a line `⚠ แปลงไม่ครบ` (conversion incomplete) must be fixed in the .pptx (step 4)
4. **Check:** `python scripts/check_html_deck.py docs/<file>.html --out _to_delete/deck-check --pptx docs/<file>.pptx` → fix until **0 problems**, then **open every `sheet-*.png` and look at each sheet**
5. Rehearse 1 round with the clock (press T) · press → to step through every step to the end

## 2 · What converts to what

| In .pptx | In .html | Entrance |
|---|---|---|
| Title (placeholder) | Text · name in the table of contents | Shoots in from the left (the cover floats up) |
| Text box · text in a shape | Position, size, colour, font, alignment, bullets, line spacing as in the source | Floats up |
| Rectangle · rounded · oval · donut · diamond · arrow · chevron · hexagon | Box / SVG | Bounce · an oval has a rippling ring |
| Line · connector (straight and elbow) · arrowhead · dashed line | SVG | Drawn along the direction of the line |
| Picture (including crops) | Embedded as base64 | Bounce |
| Table (including merged cells · table style derived from accent1) | `<table>` | Appears one row at a time |
| Column/bar · line · pie · donut charts | SVG redrawn from the data in the chart | Bars grow · values pop up after |
| Big number ≥ 22 pt such as `88.1%` `1,244` | — | Counts up from 0 |
| Group (any depth of nesting) | Broken into pieces, exact coordinates | Follows the pieces |
| On Click animation | `data-step` | A step of the page's player · ↓ opens one step at a time · Space plays by itself |
| notes · Section · slide/layout/master background | `<aside>` (press N) · group in the table of contents (press M) · background | — |

Entry order: upper rows before lower rows, pieces in the same row enter together, and text in a box enters 0.35 beat after the box · turns itself off when the machine is set to reduced motion

**Cannot convert** (lines marked `⚠` during conversion · fix in the .pptx):
- A hatched warning box appears in place of that piece: SmartArt → break into shapes (Convert to Shapes) · video, audio · area chart · scatter · a chart whose data cannot be read
- Converted in a simplified way: combo chart (shows only the first type) · unusual shapes (drawn as a rectangle) · vertical text (shown horizontally)
- Not converted and no warning: shadows · 3D · text outline · transitions between slides

## 3 · Keys of the .html (added for you)

| Key | What it does |
|---|---|
| ← → · PageUp PageDown · click the left or right edge · swipe the screen | Changes page only, does not touch the steps in the page |
| Space | Play / stop the player of that page (opens the next step by itself every 1.6 seconds, stops at the last step) · does nothing on a page with no steps |
| ↓ · ↑ | Next step · previous step |
| Change page | The player returns to step 0 and stops every time, both going forward and going back |
| M · N · T · F · R | Table of contents · notes · clock · full screen · replay animation |
| P | Plays the whole deck by itself every 2.6 seconds (every step, then the next page) |
| `#12` at the end of the URL · bottom bar | Opens at page 12 · point to see the page name, click to jump |

## 4 · Interactive pages (insert by hand)

Pages PowerPoint cannot do (type a value and calculate · try changing rules · walk through a document step by step) are written as HTML and inserted between pages:

```bash
python scripts/pptx_to_html.py deck.pptx -o deck.html --insert 9:demo/flow.html --insert 28:demo/try-rules.html
```

- Copy `assets/interactive-page.html` as a starting point · 1 file can hold several pages as `<section class="slide" data-menu="▶ ลองเอง · …">` plus its own `<style>` and `<script>`
- Coordinates are px on a 1920 stage · use the same `class="s"` + `data-a` + `--k` + `data-step` as the converted pages, so pieces enter and step back the same way
- Start ids and classes with the page name (`ip-`) to avoid clashing with other pages · typing in an input field does not change the page (the runtime handles it)
- Numbers on an interactive page come from the real results of the work, and the source is stated in the page's foot

## 5 · Check before sending

- [ ] `pptx_to_html.py` prints no `⚠ แปลงไม่ครบ` line, or you know what each line is and accept it
- [ ] `check_html_deck.py --pptx` shows 0 problems · page and step counts match the .pptx · pressing ↓ through every step and → through every page reaches the end of the deck · entering a new page puts the player at step 0
- [ ] Open `sheet-*.png` and compare every sheet with the .pptx: text does not overlap · Thai fonts are not distorted · chart values match
- [ ] The fonts in the .pptx exist on the machine that will present (if not → use Tahoma / Leelawadee UI instead, text may grow longer and overflow the box)
- [ ] Every page has notes · no real customer data in the file
- [ ] Speaker notes in `<aside>` are written the way they are really spoken: use ครับ/ค่ะ and ก็ freely, not document language

## 6 · Anti-patterns

- **Editing a converted .html** — it is lost on the next conversion · fix the .pptx or the `--insert` file and convert again
- **Making every piece On Click** — the audience must click hundreds of times · use steps only when telling a sequence (system steps · revealing an answer)
- **Text packed to fill the box exactly** — a font on another machine that is slightly wider will overflow · leave 10% free space in the box
- **A chart as a picture** — after conversion it has no animation and its values cannot be edited · use PowerPoint's own chart

Before sending, go through the section "Not looking AI-made" (`ไม่ให้ดูเหมือน AI ทำ`) at the end of [`SKILL.md`](html-slide-deck.md), the same as for a deck written directly.


## reference: html-slide-deck.md

<!-- merged from skill `html-slide-deck` on 2026-11-27 · description was: Use when the deck must be HTML or animated, or pptx as HTML -->
# HTML Slide Deck — one .html file that opens in a browser and presents at once

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand fixes colors and fonts; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **One rule:** the deck is **one** .html file. Images embedded in the file · slide titles are conclusions · every page passes `check_deck.py` before sending. Story structure and slide titles come from `presentation-design.md`; this skill covers how it is built and looks.

## Use when
- Presenting a project · system demo · executive summary from the presenter's own machine.
- Viewers should click and see details themselves (files, code, test results), which PowerPoint cannot do.
- The deck is sent by email or chat and must open anywhere with nothing installed.
- A .pptx already exists, or .pptx and .html with the same look must come from one source (click-by-click animation · notes · table of contents) → read [`from-pptx.md`](from-pptx.md) instead of step 2; fix the .pptx and convert again, never edit the converted .html.

Not for: "make a slide deck" with no mention of html, or the customer needs a .pptx to edit → `document-design` · `StageDeck` (file-type rules in `presentation-design.md`) · no story structure yet → `presentation-design.md` steps 1–3 first · companion .docx report → `document-design`.

## Steps
1. Write the story structure per `presentation-design.md`: every slide title is a conclusion · sections · time per page.
2. If the project already has `docs/deck/` or an .html deck, add `<section>` to the existing `slides.html` and use the same shell · css · `--brand`; do not start a new file (same principle as `ui-craft` step 0). Otherwise copy `assets/slides-example.html` to the project's `docs/deck/slides.html`, keep only the `<section>` of the layouts you use and fill in the content. Layout classes: [`layouts-and-shell.md`](layouts-and-shell.md).
3. Choose the direction before building. It comes from `presentation-design.md` step 1, stage 0 (order: source work → project's own design → attached reference → live search per `design-gate/design-references` type `slide` → house defaults, only when there is no information at all). Extract colors from the source with `slide-deck/scripts/source_palette.py <source file>`; if the source has none, use the order in `diagrams` → `references/diagram-figures.md` step 5; if live search is not possible, use `--theme bright` without `--brand` (gives `2A78D6,1F5FAF`), write `(รอยืนยัน)` in the report and carry on. Never copy colors from the example table in the theme reference. Use `--theme bright` for every new deck unless the source work has a dark background (then `dark`, the default when omitted). Use one main color plus at most 2 secondary colors from the source; green `ok`, blue `blue`, orange `warn` only for pass · info · warning. Theme, tokens, fonts and contrast numbers: [`theme.md`](theme.md).
4. Build the file:
   ```bash
   python scripts/build_deck.py docs/deck/slides.html -o docs/<PRJ>-DECK-v1.0-DRAFT.html \
          --title "<ชื่อเด็ค>" --theme bright --brand <สีหลัก>,<สีสว่าง>,<สีรอง>
   ```
   `--css` / `--js` for things specific to this deck · `--data` passes JSON for extra JS · images referenced by a local path are embedded automatically · give a secondary color only when the source really has one · a page needing a full-bleed secondary color gets `data-tone="2"` on its `<section>`. For data that changes often (test results, numbers), the project's script reads the real result file and writes it into `slides.html` or `--data`; never type numbers by hand.
5. Check: `python scripts/check_deck.py docs/<ไฟล์>.html --out _to_delete/deck-check` → fix until **0 problems**, then open every `sheet-*.png` and look.
6. Rehearse once with the clock (T for the clock · S for the speaker window). A page over 30 seconds turns the clock a different color → cut that page's content.
7. Animation is off by default. Put `data-anim` on a `<section>` only where motion helps the eye follow the story (a system map whose arrows must be drawn in order · section openers); `data-count` · `data-loop` · `.bars` · `data-chat` work only where set; `data-count` on 1 number to remember, not every card. Add no animation that does not help; shell keys and animation table: [`layouts-and-shell.md`](layouts-and-shell.md).

Look rules:
- Slide margin 128 px left and right · content stays out of the bottom 120 px band (the foot).
- Text no smaller than 16 px on a 1920 stage · body 24–32 px · slide title 56 px, at most 2 lines.
- 1 page, 1 conclusion · long details go in a `<template>` for click-to-view.
- Speaker notes in `<aside>` are spoken language: use ครับ/ค่ะ and ก็, not document language.
- A real screenshot beats a drawing · width ≥ 1600 px before shrinking · no stock images · never link images from the web.
- Every number states its source in the foot (`qa/results/…` · test date) · every page has `<p class="foot">ชื่องาน · หัวข้อ · ที่มาของข้อมูล</p><p class="pg"></p>`.
- Keep a replayed chat (`data-chat`) from real test results as the backup for any live demo.
- A system diagram too complex for `.map` → `diagrams`, embedded as an image.

## Check before done
- [ ] `check_deck.py` shows 0 problems (page taller than 1080 · overflow · overlap with the bottom bar · box overflow · small text · broken image), measured in a real browser.
- [ ] Every `sheet-*.png` opened: one brand color · no half-empty page · slide titles read in sequence make a story.
- [ ] File opens with the network off: all images show, fallback fonts readable.
- [ ] Every page has an `<aside>` of speaker notes, and `data-at` times add up to no more than the time given.
- [ ] No personal data or real customer data (use mock data and say so in the foot).
- [ ] Edited `slides.html` and rebuilt, never the built .html · `design-gate/no-ai-look` item 3 passed (HTML work runs its script and the eye gate 3.2; 0 script findings is not yet a pass).

## References
- [`layouts-and-shell.md`](layouts-and-shell.md) — open when choosing layouts, or to see shell keys and animation
- [`theme.md`](theme.md) — open when picking `--theme` / `--brand`, fonts, or checking contrast
- [`from-pptx.md`](from-pptx.md) — open when a .pptx exists


## reference: layouts-and-shell.md

# Layouts, shell keys and animation · html-slide-deck

Open when choosing layouts for `slides.html`, or when you need to know what the shell already does.

## Layouts (all are in `slides-example.html`)

The look of the first 4 pages built with `build_deck.py` is in `assets/slides-example-preview.webp`.

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

Every page has `<p class="foot">ชื่องาน · หัวข้อ · ที่มาของข้อมูล</p><p class="pg"></p>` · page numbers fill in by themselves.

## What the shell does for you (no need to write it yourself)

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

## Animation (switch on per page — the default is still)

Content sliding up piece by piece on every page, numbers counting up, and glow that loops forever are AI signals in `design-gate/no-ai-look`, so the shell does not add them to every page: put `data-anim` on the `<section>` only for pages where motion helps the eye follow the story (a system map where arrows must be drawn in order · section openers). `data-count` · `data-loop` · `.bars` · `data-chat` work only on the pieces where they are set.

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

Everything replays every time the page is entered · the player returns to the starting step and stops on every page change · turns itself off when the machine is set to reduced motion · add no animation that does not help the eye follow the story.


## reference: presentation-design.md

<!-- merged from skill `presentation-design` on 2026-11-27 · description was: Use when planning a slide deck story and layouts -->
# Presentation Design — slide deck story, layouts, and checks

> **Pre-work gate (every time):** read the owner's theme → search live for a reference → 3 genuinely different directions → check `design-gate/no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search is for this piece's structure). Close the work with a line `ด่านก่อนลงมือ:`.

> **One rule:** a slide title is a **conclusion**, not a **topic name**. If the audience reads only the titles and understands the whole story, the deck is usable.

## Use when
- Making a deck: client proposal · business plan · research summary · progress report · training · design review
- Reviewing a deck someone else made, or converting a long document into a deck
- Not for: a real `.pptx` file (python-pptx, fonts, cover) → `document-design` · chart palette → `diagrams` (`colour-by-domain.md`) · diagrams on a slide → `diagrams` · a document read alone → `design-gate/polished-document-style` + `document-design` (a deck sent to be read alone is a document: make a deck for speaking and attach a document)

## Steps
1. **Choose the delivered file.** Do not ask which type: not stated = .pptx · at the end say in 1 line that an .html version with animation is possible.

   | User asks | Gets | Use |
   |---|---|---|
   | "ทำ slide deck" · "ทำสไลด์" · "ทำ presentation" (type not stated) | **.pptx** | `document-design` · `StageDeck` |
   | "slide deck html" · "เด็ค html" · "มี animation" · "นำเสนอจากเบราว์เซอร์" | One .html file with animation | `html-slide-deck.md` |
   | Has a .pptx · "แปลง pptx เป็น html" · "animation แบบเด็ค IS" · wants interactive pages or click-by-click reveal | One .html that looks like the .pptx on every page | `html-slide-deck.md` (`from-pptx.md`) |
   | Both | .pptx + .html from one source | Build the .pptx with `StageDeck`, then convert with the .pptx entry of `html-slide-deck.md` |

2. **Research only what is missing.** If the deck cites facts, numbers, a market, or competitors, collect them with sources per `research-with-sources` (plugin `superuser`) before writing titles: a conclusion title must stand on real facts, not memory.
3. **Take the theme from the source work, for every deck.** Run `python scripts/source_palette.py <source file>` on the file, logo, or website the user gave, then choose the mood from the table in [`deck-theme`](deck-theme.md) item 2 · if the source has no colour, use the project's colour per `diagrams` → `references/diagram-figures.md` item 5 · light background by default, section-change pages full-slide main colour · only when live search is really impossible, use the house colour `#2A78D6` and write `(รอยืนยัน)` · if the work already has colours, do not pick new ones. Write a head-of-work line: which file the colour came from · which mood row · light or dark.
4. **Choose the visual direction, stopping at the first hit:** the source work → the design the project already has → a reference the user attached → research (search live per `design-gate/design-references`, type `slide`, then extract colours from the chosen work; pick 2–3 decks of the same kind and choose light or dark · font · density · image style; write a 1-line reason with sources) → the house default "Stage" (`document-design` · `brandkit_stage.py`). Stage is the fallback when there is no information at all, not the answer for every deck: two decks for different work look different. If the source, project, or user reference supplies colour and fonts, search only for page structure and storytelling. The direction belongs to this deck alone: do not reuse the last deck's without checking the work differs. Render diagram figures with the deck's background colour (`#bg=`).
5. **Write every slide title as plain text, one line per slide.** Read them in order; if they do not form one story, reorder now (much cheaper than later), then cut slides that do not move the story. This step takes under 20 minutes and decides good or bad. Order by purpose: [`deck-details.md`](deck-details.md). For executives, put the conclusion on slide 1.
6. **Choose a layout per slide** from the 6 in the reference, then put in content and trim to the budget. Every slide has the same footer: section name left, page number right.
7. **Budget per slide, counted in lines on the real slide** (Thai words cannot be counted): title at most 2 lines · at most 6 bullets · at most 2 lines per bullet · bullets are gist, not full sentences. If over, cut whole bullets or move them to the next slide. Never cut function words (จะ ให้ ก็ แล้ว, polite words) to fit; cut items.
8. **Text size.** Smallest content text 18 pt (40 cover · 26 title · 18 bullet in .pptx; table and the Stage-deck exception in the reference). If content does not fit at 18 pt, cut content; never shrink text. 2 weights only; titles bold, body not.
9. **Data slides:** 1 chart, 1 conclusion (a chart saying 2 things becomes 2 slides) · the title is the conclusion · highlight the point in the brand colour and grey the rest · numbers on bars, no gridlines or legend if data can be labelled · state period, sample size, and source · a table over 5 rows by 4 columns becomes a chart or an attachment.
10. **Thai type:** line height at least 1.4 for titles and 1.5 for body · break long Thai titles yourself where the thought ends · a font with real regular and bold · one family for Thai and English on a line (details in the reference).
11. **Render and view the whole deck as thumbnails**, then run the checks below. Before sending, go through item 3 of `design-gate/no-ai-look` (for HTML work run its script; the eye gate 3.2 must also pass, and web pages answer items 10–14).

## Check before done
- Reading only the titles gives the whole story · every title is a conclusion
- No slide visibly denser than the others · margins and title position match on every slide
- Three-metre test: at 25% size the title is still readable
- At most 6 bullets, each at most 2 lines · smallest content text at least 18 pt
- Every chart has a conclusion and a data source · every slide has a page number
- Opened once on the real projector or screen
- The list of 13 anti-patterns checked ([`anti-patterns.md`](anti-patterns.md))
- The line `ด่านก่อนลงมือ:` closes the work

## References
- [`deck-details.md`](deck-details.md) — open when ordering the story, choosing a layout, setting text sizes, building a data slide, or setting Thai type
- [`deck-theme.md`](deck-theme.md) — open for colours and mood (central file for every slide skill)
- [`anti-patterns.md`](anti-patterns.md) — open when checking the work


## reference: theme.md

# Theme, tokens and house defaults · html-slide-deck

Open when picking `--theme` and `--brand`, adjusting fonts, or checking contrast.

The look of the house defaults comes from the X Fitness pitch deck (45 slides, 10 minutes). It is an example of the house direction only, not a mold for every deck: dark background with a single brand color · big-number section openers · number cards · system diagram · click to see the real file · chat in a phone frame · test result chart.

## Direction

The visual direction always comes from `presentation-design.md` step 1, stage 0; rules on color and mood are in [deck-theme](../../slide-deck/references/deck-theme.md). Selection order: the source work the deck is made from → the design the project already has → a reference the user attached → a reference searched live per `design-gate/design-references` (plugin `superuser`) type `slide` → house defaults. House defaults are a fallback for when there is no information at all, not a rule. Two decks for different jobs should look different.

## `--theme`

| `--theme` | Look | Use when |
|---|---|---|
| `bright` | White background, cards tinted faintly with the main color · cover, section openers and closing page are full-bleed solid main color · accent colors are adjusted to read at 4.5:1 · text on solid backgrounds is white when white gives ≥ 4.5:1; if not, near-black; if still short, pure black | Every new deck, unless the source work has a dark background |
| `dark` (the default when omitted) | Dark background, dark gradient cover | Source work or app that has a dark background · old decks already built (without `--theme` the look stays the same) |

- `--brand main,accent,secondary` · the accent color is used for big numbers and the kicker (theme `bright` darkens it automatically until it reads on a card) · give a secondary color only when the source work really has one · a page that needs a full-bleed secondary color gets `data-tone="2"` on its `<section>` (works with theme `bright`).
- Fonts can be changed in the `--css` file by choosing a family that has both Thai and English and a real bold (rule in `presentation-design.md` step 8) · then open `sheet-*.png` and check contrast on every sheet.

## Deck colors = colors of the source work

Extract colors with `slide-deck/scripts/source_palette.py <source file>` · if the source has no colors, use the order in `diagrams` → `references/diagram-figures.md` step 5 · if still nothing, use colors extracted from references of type `slide` · if live search is not possible, use `--theme bright` without `--brand` (gives `2A78D6,1F5FAF`, the house default), write `(รอยืนยัน)` in the report, and carry on · never copy colors from the example table below.

| token | Example value (the reference deck — not a default) | Used for |
|---|---|---|
| `--accent` | `#e10613` | Bar under the cover title · user chat bubble |
| `--accent2` | `#ff2536` | kicker · big numbers · section-opener page number · the selected item |
| `--accent-deep` · `--accent-tint` | `#2a0a0d` · `#1d0d10` | Gradient background of cover/section opener · background of the selected item |
| `--bg` · `--panel` · `--line` | `#09090a` · `#16161a` · `#2a2a30` | Background · card · line — do not change with `--brand` · a dark background is the shell's default (dark presentation room, screenshots and diagrams stand out), not a requirement (a deck converted from .pptx uses the .pptx background, see [from-pptx.md](from-pptx.md)) |

- The table holds the values of theme `dark` · `--brand` computes deep/tint for you · in theme `dark` the bright color must read clearly on the dark background by itself (contrast ≥ 4.5:1), while for `bright` the script adjusts it.
- **Where the house contrast numbers come from:** the house bright color `5B9BE6` reads on a dark background (6.9:1) but only 2.89:1 on white, so it must change to `--brand 2A78D6,1F5FAF` (the second color on white is 6.34:1 · the main color `2A78D6` gets 4.42:1, so use it for bars, lines or large text, not small text · computed with the WCAG formula 2026-10-26).
- House fonts (when no other direction): headings **Chakra Petch** · body **IBM Plex Sans Thai** · code **JetBrains Mono** (Google Fonts · offline → Tahoma) · if the deck's direction sets other fonts → use those (Thai + English in one family, real bold).
- **One main color plus at most 2 secondary colors from the source work** · green `ok`, blue `blue`, orange `warn` are used only for their meaning (pass · info · warning).
