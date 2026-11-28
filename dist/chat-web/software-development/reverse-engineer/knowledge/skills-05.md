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
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`ui-craft`) (plugin `software-development`) |
| Chart colours and chart design in an app or dashboard | `ui-craft` (plugin `software-development`) → `tokens.md` "สีข้อมูล (กราฟ)" |
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


Not for: choosing SVG / ASCII / Mermaid → `markdown-visuals.md` · screenshots and wireframes → `ui-craft` + the platform skill · data charts → `ui-craft` `tokens.md` heading "สีข้อมูล (กราฟ)" · choosing an architecture → `architecture`

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

# skill: human-writing

Use before writing anything people read, Thai or English

# human-writing — write like a person: smooth to read, easy to understand

## Use when
- Writing anything a person will read, from chat to labels in a diagram, in Thai or English.

Not for: the look of kept documents (headings, tables, text boxes, theme) → `design-gate/polished-document-style` · abbreviations and glossaries → `human-writing/spell-out-abbreviations`.

## Steps

### 1 · Core principles
- Write as if explaining to a skilled coworker who is not on the project. If it trips you up when read aloud, rewrite it.
- Answer or conclusion first, then the reason. No preamble, no repeating the question.
- 1 sentence, 1 idea. If you chain "ซึ่ง" "โดย" "จึง" several layers deep, split into several sentences.
- English follows the same rules: sentences under 25 words · who does what (active voice) · plain words.

### 2 · Symbols and numbers
- `→` means order of steps or a consequence · `·` separates short nouns on one line · `:` introduces detail · write every kind of count as a numeral.
- **Write conditions and instructions as full sentences with connectors** (ถ้า … ให้ … · แล้ว · ส่วน · เพราะ). Do not chain sentences into fragments with `→` or `·`. If an outsider must guess what an arrow means, add words. In tables short text is fine, but it must read as human language, not code.
- **No emoji or icons** (📌 ✅ 💡 🚀 👀) in headings, body, tables, labels, or text boxes. Use bold words instead, such as **หมายเหตุ**. Yes/no cells in a table may use `✓` `✗`. Show severity with the words `วิกฤต · สูง · กลาง · ต่ำ`, never coloured dots. Do not delete emoji the owner wrote, and do not copy them. The one exception is customer chat text that the task's own skill prescribes.
- Say what every number means. Compare so it is easy to picture (times, easier to read than %). If a result is uncertain, say plainly why.
- **Figures that change over time** (prices · tax rates · law · filing deadlines): give the source and the date checked. Cite only sources you actually opened, with a link or DOI. Mark hypothetical numbers or mock data with the label `ตัวอย่าง` from the first place they appear.
- **Dates** in Thai text use พ.ศ. or ค.ศ., one style across the whole set. File names, codes, and machine-read data use `YYYY-MM-DD` in Common Era.
- **Task status** uses these 5 words in every document: `เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่`. Check results use `ผ่าน · ไม่ผ่าน`.

### 3 · Words
- Use words people actually say. No bureaucratic words or literal-translation jargon. Keep terms the field uses in English (token · prompt · API · OCR). Explain a coined or confusing term the first time. Abbreviations → `human-writing/spell-out-abbreviations`.
- Call one thing by one word across the whole set: chat, slides, documents, diagrams.
- Two-language documents: pick 1 main language and put the other in brackets or a second column. Do not switch inside a sentence.
- Cut padding words ("ทำการ" · "มีการ" · "ในส่วนของ" · "ได้มีการ" · "เป็นการ").
- **Cut items, not function words.** Every length budget (words per bullet · characters per commit title · characters per subtitle) is met by dropping items, condensing, or moving content to the next piece. Never cut `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` or polite words (`ขอ` `รบกวน` `นะ` and ครับ/ค่ะ, per register). They do work in the sentence; without them Thai turns curt and reads like a translation.
- Avoid AI-looking moves: a quotable opener · the slogan "ไม่ใช่แค่… แต่ยัง…" for emphasis (a sentence that contrasts with something real or reframes the problem is fine, but it must close with "ด้วย") · grouping everything in threes · praising something as more important than it is · bold on every line · a closing recap · opening with "แน่นอน" · closing with "หวังว่าจะช่วยได้" · "หลาย" when you know the number · stacked hedges (hedge once, where you are truly unsure).
- For work people look at (screens · slides · ads) also avoid: broad ad words (ยกระดับ · ไร้รอยต่อ · ล้ำสมัย · supercharge) · em dashes in every sentence · canned openers ("ในยุคดิจิทัลที่…") · short fragments split by full stops ("เร็ว. ง่าย. ครบ.") · claims a competitor could also make (put in a real name or number). For the look of the work, use `design-gate/no-ai-look`.

### 4 · Answering in chat
- First sentence answers directly, then the reason. Short question → 2–3 sentences, no headings or tables.
- Table to compare 2 or more options or many numbers; list for several items to scan. No nested bullets (use a new bold heading). 2–3 short items go on one line with ` · `. Include only what the reader needs.
- Report finished work by its result, not by narrating the steps.
- If you told them something wrong, say what was wrong and what is right, with no long apology. If unsure, say where and how to check; do not guess in a confident voice.
- When the user must decide: offer options, name the recommended one and why, close with 1 easy question.
- Longer than 1 screen: answer the important part first and offer the detailed version in 1 line (do not stop to ask).
- If the user says "งง" or "พูดง่าย ๆ": rewrite the last answer at half the length, no unexplained jargon, no new content.
- End with 1 thing they can do next. No recap.
- **Answering from a document or the web**: retell in your own words, never sentence-by-sentence translation · cause and effect in one paragraph · small exceptions in brackets · 2–3 bold labels are enough · sources together at the end.

### 5 · Documents and reports
- The first paragraph is the conclusion; reading only it gives the point. Headings say what the content is, not the category name. At most 5 sentences per paragraph.
- Column headings say what is measured · 1 column, 1 meaning. Footnotes are for definitions and number sources; never hide an important conclusion there.
- Work summaries and status reports: bold headings only as needed, **ผล** → **ที่ทำ** → **ต่อไป** (add headings for real content, such as awaiting approval). Cut behind-the-scenes method, solved problems that do not affect the reader, and numbers not used for a decision. Tag every claim `ตรวจจริง` · `จากแหล่ง` · `อนุมาน` · `ยังไม่ได้ตรวจ` (meanings in `superuser` `references/evidence.md`).
- Formal documents (official letters · contracts · tax invoices) use the wording the form requires; this skill covers only the parts you write yourself. Choose the register for each job (official · business · shop chat · job application · complaint · screen) from the table in `thai-grammar` section 4 before writing, and keep it through the piece.

### 6 · Slides and headings of every kind
Applies to slide titles, figure titles, document headings, and box titles in a diagram.
- A slide title = the conclusion of the page, not the topic name · at most 2 lines (about 15 words) · detail goes in the body.
- **A title with 2 parts needs a connector that matches the real relationship** ("เพราะ" or "จึง" for reason · "ส่วน" for a split of roles · "แต่" for contrast) · 1 title, 1 connector. If it needs 2, you crammed too much in.
- Use phrases people actually say, not strings of nouns · choose words by reader · the verb matches what the page shows · do not use "คน" for things that are not people.
- The caption under a picture must say what the picture does not; if it repeats the picture, cut it · page structure: problem → fix → result · write a speaking script the way it is spoken.
- **Test:** read the title once to an outsider. If they cannot retell it, rewrite it.

### 7 · Diagrams
- Box labels are short nouns of 1–4 words · arrow labels are verbs · an unlabelled arrow must be impossible to misread.
- Words in the figure match the document · the figure title is a conclusion, with 1 sentence under it saying what to look at · follow the house style if there is one.

## Check before sending
1. Does it read smoothly aloud, and not like a translation?
2. Can an outsider understand it without asking? Can every symbol be read?
3. Does the first sentence already answer or give the conclusion?
4. Do terms and numbers match across every file in the set?
5. Any padding to cut without changing meaning? Cut it, but `จะ` `ให้` `ก็` `ด้วย` `แล้ว` and polite words are not padding; if cutting made a sentence curt, put them back.
6. Does every heading pass section 6?
7. Thai of 1 paragraph or more: run `python scripts/thai_tells.py <file>` (warns only), then walk the 7 sentence-structure rules in `thai-grammar`. Passing every rule is not the same as reading smoothly. The final verdict on language, taste and looks belongs to the user.

## References
- [`references/headings-and-examples.md`](references/headings-and-examples.md) — open for examples of every rule, the before → after heading table, and their sources
- [`references/thai-grammar.md`](references/thai-grammar.md) — open when writing Thai of 1 paragraph or more (sentence structure · register); example paragraphs in [`references/thai-examples.md`](references/thai-examples.md)
- [`references/strict-review.md`](references/strict-review.md) — open for research or work sent to outsiders
- [`references/thai-line-breaking.md`](references/thai-line-breaking.md) — open for Thai documents with justified alignment

## Parts
Hard rules of the parts (full steps in each guide):
- spell-out-abbreviations: write every abbreviation in full the first time, with the abbreviation in brackets; after that you may use the abbreviation.
- spell-out-abbreviations: put a short explanation in brackets the first time you use a technical term an outside reader may not know.
- translate-th-en: translate meaning one paragraph at a time, not word by word; 1 term = 1 translation across the whole project, recorded in `docs/glossary.md`.
- polite-message-th-en: say the hard thing clearly; politeness belongs in the wording, not in hiding the request. One ask per message, with a date. Move up one tone level per reminder, never two. Do not stack softeners.

| When | Open |
|---|---|
| First use of an abbreviation or technical term; glossary | [parts/spell-out-abbreviations/guide.md](parts/spell-out-abbreviations/guide.md) |
| Translating Thai-English, paired files, screen text | [parts/translate-th-en/guide.md](parts/translate-th-en/guide.md) |
| Awkward message to ask, decline, chase payment, apologise or complain | [parts/polite-message-th-en/guide.md](parts/polite-message-th-en/guide.md) |


## reference: headings-and-examples.md

# Headings, slides, diagrams and before → after examples (full version)

Read when writing a slide title, figure title or diagram label, or when you want examples of fixes. The short rules are in `SKILL.md` sections 6–7.

## Slides and headings of every kind

- A slide title = the conclusion of the page, not the topic name: "ยิ่ง Tier 1 เติมค่าเอง Gate ยิ่งมองไม่เห็นค่าผิด"

**Write titles that read smoothly and are not ambiguous.** This applies to slide titles, figure titles, document headings and box titles in a diagram.

- **A title with 2 parts needs a connector** (ส่วน · แต่ · เพราะ · จึง — as for · but · because · so). Do not just place 2 phrases side by side, because the reader has to guess how the 2 parts relate.
- **The connector must match the real relationship.** Use "เพราะ" or "จึง" only when one part really is the cause of the other. If the 2 parts just split roles, use "ส่วน". If they contrast, use "แต่". 1 title, 1 connector. If it needs 2, you crammed too much in: cut it down to one topic.
- **The title must still be short.** A slide title is at most 2 lines (about 15 words). If it is longer, move detail down into the page body. Do not add connectors until the title becomes a paragraph.
- **Use phrases people actually say.** If shortening leaves a string of nouns such as "AI ทำงานภาษา", find the verb people really use, such as "AI ช่วยเขียนคำตอบ".
- **Choose words by reader.** If the reader is not technical, use "ระบบ" (system) instead of "โค้ด" (code) and "ตรวจขาเข้า" (check incoming) instead of "Guard". Technical terms are fine when the reader is a technical team.
- **The verb must match what the page shows.** If a box in the figure is a checking step, use "ตรวจ" (check) or "ตัดสิน" (judge), not "ตัดสินใจ" (decide), which sounds like choosing a path.
- **Do not use "คน" (person) for things that are not people**: "ระบบเป็นคนตัดสิน" → "ให้ระบบตัดสิน"
- **The summary line under a figure must say what the figure does not.** If it is only an arrow chain of steps that repeats the figure, cut it, or replace it with 1 sentence saying why this figure matters.
- **Test**: read the title once to an outsider. If they cannot retell it in their own words, or have to ask "what does that mean", rewrite it.
- Page structure: problem → fix → result. Each part can be read in one glance.
- Write a speaking script the way it is actually spoken. It must read aloud without tripping.

## Diagram

- A box label is a short noun of 1–4 words that people understand: "รับข้อมูลเข้า" not "Ingress Layer Handler"
- An arrow label is a verb: "ส่งไฟล์" · "ตรวจสิทธิ์". An unlabelled arrow must be impossible to misread.
- Every word in the figure must match the word in the document.
- The figure title is a conclusion, like a slide title. Under the figure, 1 sentence says what to look at.
- If the project has a house style, follow it. For how to draw, see the figure skill of that plugin.

## Before → after examples

Write a condition as a full sentence with a connector (section 2):

  - Before: `ไม่แน่ใจว่าขนาดไหน → ถือเป็นขนาดที่ใหญ่กว่า 1 ขั้น`
  - After: `ถ้าไม่แน่ใจว่างานขนาดไหน ให้ถือว่าใหญ่ขึ้นอีก 1 ขั้น`
  - Before: `ย้อนได้ → ทำเลย · ไม่รู้ → ค้นเอง · ย้อนไม่ได้ → เตรียมไว้ใน "รออนุมัติ"`
  - After: `งานที่ย้อนได้ให้ทำเลย ไม่รู้ให้ค้นเอง ส่วนงานที่ย้อนไม่ได้ให้เตรียมไว้ใน "รออนุมัติ"`

| Before | After |
|---|---|
| ขอบระบบ (รับ input) → service (กฎธุรกิจ) → data | แยกโค้ด 3 ชั้น: รับข้อมูลเข้า → กฎธุรกิจ → เก็บข้อมูล |
| ตรวจ input ที่ขอบ · พังแบบปิด | ตรวจข้อมูลจากภายนอกทันทีที่เข้ามา ถ้าเกิดข้อผิดพลาดให้ปฏิเสธไว้ก่อน |
| เล็กพลาดหรือตรวจไม่ผ่าน → ขยับขึ้นหนึ่งระดับ | ถ้าโมเดลเล็กทำพลาด ให้ขยับขึ้น 1 ระดับ ไม่ลองซ้ำกับตัวเดิม |
| มีผลเหนือค่าเริ่มของ playbook แต่ไม่เหนือรายการ "รออนุมัติ" | ถ้าไฟล์นี้กับ playbook ขัดกัน ให้ทำตามไฟล์นี้ ยกเว้นเรื่องที่ต้องรออนุมัติ |
| เมื่อความต้องการมีการนำเข้าหรือส่งออกไฟล์ | เมื่องานต้องนำเข้าหรือส่งออกไฟล์ |
| ทุกข้อความผ่าน 8 ขั้น: AI ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ | ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน |
| Guard ขาเข้า (ในรูปที่ทำให้คนทั่วไปดู) | ตรวจขาเข้า |
| guard ขาเข้า → ค้นคลังความรู้ → แนบกฎร้าน → Typhoon → guard ขาออก (บรรทัดใต้รูปที่ซ้ำกับรูป) | AI มีหน้าที่เขียนให้อ่านง่าย ส่วนเรื่องเงิน เวลา และกฎร้าน ระบบตรวจทุกครั้ง |
| ทีมที่ดีไม่ได้เก่งเพราะแต่ละคนเก่ง แต่เพราะ… | วิธีทำงานของทีม: เลือกแผน → แจกงาน → ตรวจผล → จดบันทึก |
| คำค้น 12/12 จากประกาศงานอยู่ใน CV | คำค้นจากประกาศงานอยู่ใน CV ครบ 12 คำ · ตรวจแล้ว |
| margin 32–35% หลังทุกค่าธรรมเนียม | หักค่าธรรมเนียมแล้วเหลือกำไร 32–35% ของราคาขาย |
| hook จะทำงานเฉพาะโฟลเดอร์ที่มีการสร้างโฟลเดอร์ .claude/superuser ไว้แล้วเท่านั้น | hook (สคริปต์จด log) ทำงานเฉพาะโฟลเดอร์ที่มี `.claude/superuser/` |
| ตรวจด้วย validate ผ่าน ไม่มี error และ warning แต่ยังต้อง build ใหม่ | ตัวตรวจผ่านหมด · เหลือ build ใหม่บนเครื่องคุณ |
| `${CLAUDE_PLUGIN_ROOT}` คือ path ของ version ที่ติดตั้งอยู่ และจะเปลี่ยนเมื่อ plugin อัปเดต ส่วนโฟลเดอร์เก่าระบบจะลบทิ้งเองภายหลัง [ที่มา] | แต่ละ version ติดตั้งเป็นโฟลเดอร์ของตัวเอง พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่ แล้วลบโฟลเดอร์เก่าทิ้ง |
| ข้อยกเว้น: plugin จาก marketplace บน claude.ai … จะไม่ถูก pin ด้วยฟิลด์นี้ (แยกย่อหน้า) | … ไม่งั้นเครื่องที่ลงไว้จะใช้ชุดเก่าต่อ (ยกเว้น plugin จาก marketplace บน claude.ai ซึ่งเห็นการแก้ทันที) |

## Examples for the rules in SKILL.md (moved from SKILL.md)

| Section | Rule | Example |
|---|---|---|
| 1 | Plain words (English) | buy, not purchase |
| 2 | `→` order of steps | เข้าใจ → วางแผน → ลงมือ |
| 2 | `·` separates nouns | ทำอะไร · ได้อะไร · ใช้แรงแค่ไหน |
| 2 | `:` introduces detail | แยกโค้ด 3 ชั้น: รับข้อมูล → กฎธุรกิจ → เก็บข้อมูล |
| 2 | Write numbers as numerals | 3 ชั้น · 12 คำ · 1 ระดับ |
| 2 | Say what the number means | "กำไร 32% ของราคาขาย" not a bare "margin 32%" |
| 2 | Compare so it is easy to picture | "เร็วขึ้น 3.2 เท่า" reads easier than "ลดลง 69%" |
| 2 | Uncertain result | "รันรอบเดียว ยังสรุปไม่ได้" |
| 3 | Words people actually say | "ยกระดับ" → "ส่งต่อ" · "ผลสุดท้ายขัดกฎ" → "คำตอบไม่ผ่านกฎ" |
| 3 | Abbreviation at first use | Large Language Model (LLM) |
| 3 | Coined term | "hook (สคริปต์จด log อัตโนมัติ)" |
| 3 | Cut padding words | "ทำการตรวจสอบ" → "ตรวจ" · "มีการนำเข้า" → "นำเข้า" |
| 3 | No stacked hedges | อาจจะ · น่าจะ · ในบางกรณี in one sentence |
| 4 | First sentence answers directly | Asked "ใส่ในรายงานดีไหม" → "ควรใส่ครับ", then the reason |
| 4 | Report by result | "แก้แล้ว 8 จุด เปิดไฟล์ได้ปกติ" |
| 4 | Cause and effect in one paragraph | "แต่ละ version ติดตั้งแยกโฟลเดอร์ พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่แล้วลบของเก่า skill ที่ลบออกจึงหายไป" |
| 4 | Bold labels | **ระวัง:** · **สิ่งที่ยังอยู่:** not "**ระวัง (เจอบ่อย):**" |
| 5 | Heading says the content | "ระบบส่งต่อลดการเรียก LLM ได้ครึ่งหนึ่ง" is better than "ผลการทดลอง" |
| 5 | Column heading | "เรียก LLM" · "คำตอบไม่ผ่านกฎ" |
| 6 | Phrase people say | "AI ช่วยเขียนคำตอบ" not "AI ทำงานภาษา" |
| 6 | Words by reader | General reader: "ระบบ" "ตรวจขาเข้า" instead of "โค้ด" "Guard" |
| 6 | No "คน" for non-people | "ให้ระบบตัดสิน" |

Sources: ISO 24495-1 (plain language) · GOV.UK clear language · Microsoft Writing Style Guide · Wikipedia: Signs of AI writing · คู่มือการร่างเอกสารภาษาไทย (guide to drafting Thai documents)


## reference: strict-review.md

# Strict review — for research and work sent to outsiders

The default for `human-writing` is a **normal check**: go through the 7 points in section 8 of SKILL.md once, then send. Use this file only when the user asks for a **strict review** (ตรวจเข้ม).

**Passing the rules ≠ reading smoothly.** The review pass catches only what has a rule (sentence structure · words to avoid · register). Work that passes every rule but has no voice is called **flat** (`อ่านแบน`). Label it as flat. Do not report it as passing. Whether it reads like a person wrote it is for the user to decide by reading aloud, not for the model doing the check (the model that drafted and the model that checks share the same blind spots).

## When to turn it on

- The user says "ตรวจเข้ม" · "ตรวจแบบงานวิจัย" · "ขัดภาษาให้สุด" · "วนตรวจจนไม่เจอที่ผิด" · "strict"
- Or the work is a thesis · independent study (IS) · research article · report for a lecturer or committee · official letter, and the user did not ask for the quick version.
- For book structure, chapters and citations, use skill `thesis-writing` (plugin `personal-life`) alongside. This file covers language only.

## Steps

1. **Open [`thai-grammar`](thai-grammar.md) in full**, and [`thai-line-breaking`](thai-line-breaking.md) if the output is a file.
2. **Choose the register** from the table in section 4. Research uses the academic register. State the chosen register on the first line of the review result.
3. **Read the whole piece once first** without editing. For work over 3,000 words, review chapter by chapter. Tell the user how you split it, then carry on without stopping to ask.
4. **Review pass.** Run `python scripts/thai_tells.py <file>` first (the machine catches words to avoid · connectors over budget · mid-paragraph dots · ๆ with no space), then read it yourself for what the script cannot see. Record every spot in a table. Do not edit while recording.

   | # | Rule code | Original text | Fix |
   |---|---|---|---|
   | 1 | `t-chueung` | …ซึ่งพัฒนาโดย… ซึ่งเปิดเป็น… | … |

   **Sort by weight, not by the order found.** At the top are the spots that tell the reader at once a machine wrote it: canned opening sentences · recap at the end of a paragraph · groups of 3 everywhere · broad ad words · repeated sentence structures side by side. Then the small things (extra connectors · punctuation). Fixing the top 5 first often makes several of the lower ones vanish. A short piece with only small findings is fixed in one pass, with no loop.
   **Compare with the author's voice.** If there is text the user wrote themselves (`ก่อน → หลัง` pairs in `~/.claude/superuser-style.md` · earlier emails or chapters by the user), read against it: sentence length · pronouns · sentence-final particles · words the user never uses. Record each spot that differs from the user's voice with code `v-voice` in the table. If there are no samples, check against the rules only, and label the result `อ่านแบน` as usual (idea from humanizer by blader · MIT).
5. **Fix pass.** Fix according to the table, then reread the whole piece (do not look only at the fixed spots, because fixing one spot often makes the neighbouring joins stumble).
6. **Repeat steps 4–5** until the review pass finds nothing. **At most 5 rounds.** If spots remain after 5 rounds, report them with the reason they were not fixed.
7. If working under `superuser`, make each review round a new `reviewer` (small model · low effort), and let the lead do the fixing. The `reviewer` may report only the rule codes found, and does not judge whether it reads smoothly. For the fix pass, give the fixer the whole rule set, not just the points flagged (if you give only the flagged points, the fixer will keep going in circles).

## Extra checks for research

| Code | Check |
|---|---|
| `a-register` | Academic register throughout · no ครับ/ค่ะ · no ผม/ฉัน (use `ผู้วิจัย` or drop the pronoun) · every formal-side word in the pairs of the `r-drift` table · `สามารถ…ได้` complete |
| `a-term` | One word per technical term across the whole book · first use written as `ไทย (English)`, then Thai afterwards · abbreviations spelled out at first use in every chapter · matches the Royal Society of Thailand's coined terms where they exist |
| `a-claim` | Every statement of fact has a citation · no citing a source that was not opened · the researcher's opinion is clearly separated from fact |
| `a-hedge` | Hedge only as far as the data supports: a result from a small sample says `ในกลุ่มตัวอย่างนี้` · no stacked hedges · no claiming more than the result shows |
| `a-number` | Numbers have units · same decimals across a table · numbers in the text match the table · percentages state the base |
| `a-ref` | Tables, figures and equations are numbered and referred to in the text before they appear · figure and table titles are conclusions |
| `a-cite` | One citation style across the whole book (APA 7 or the faculty's) · the reference list at the end covers everything cited in the text |
| `a-tense` | The method chapter and results are told as things already done · do not switch between `จะ` and `ได้` in one chapter |
| `a-break` | After export, run `scripts/thai_linebreak.py --check` and open the PDF to look at every page |

## What to send the user

- First line: the register used · the number of rounds · `ผ่านกฎ` (passed the rules) or `เหลือ N จุด` (N spots left) · if flat, say `ผ่านกฎ · อ่านแบน` with the paragraphs worth reading aloud.
- A table of fixes across all rounds (rule code · old · new). It lets the user answer the committee about what was changed and why.
- Spots not fixed, and why (for example wording fixed by the faculty's template · quoted speech).
- The fixed file overwrites the original. Keep the original in `_to_delete/`.

Source of the review loop: skill `kode-thai` in [chakrit/kien-thai](https://github.com/chakrit/kien-thai) (MIT) · adapted with a cap on rounds, and used only on request, because the full version costs tens of thousands of tokens per round.


## reference: thai-examples.md

# Thai paragraph examples, before → after (one register at a time)

Open before writing a long Thai paragraph, and look at the pair for the register you will use. Example pairs teach better than rules, because you see sentence structure and tone together. Rule codes are in [`thai-grammar`](thai-grammar.md).

**Rules of this file.** 1 pair = 1 paragraph. The "after" must be text the owner wrote or edited. Text written by the team is labelled `(ชั่วคราว)` (temporary) until the owner reads it and accepts it. At most 10 pairs per register. When a new rule absorbs a pair, delete that pair. Every pair states its source and date.

## Register อธิบาย (explain): README and technical docs

**Before**

> ในยุคปัจจุบันที่ข้อมูลมีความสำคัญอย่างมาก ระบบนี้ถูกออกแบบมาเพื่อทำการประมวลผลข้อมูลจากหลายแหล่ง ซึ่งจะช่วยให้ผู้ใช้สามารถเข้าถึงข้อมูลได้อย่างมีประสิทธิภาพ โดยระบบจะทำการดึงข้อมูลทุก 5 นาที ดังนั้นผู้ใช้จึงไม่ต้องกังวลเรื่องข้อมูลไม่อัปเดต

**After**

> ระบบนี้รวมข้อมูลจาก 3 แหล่ง (ERP · ไฟล์ Excel ของฝ่ายขาย · API ของขนส่ง) ไว้ที่เดียว ข้อมูลพวกนี้ระบบจะดึงใหม่ทุก 5 นาที เปิดหน้า dashboard เมื่อไหร่ก็เห็นตัวเลขของ 5 นาทีก่อน ถ้าแหล่งไหนล่ม แถวของแหล่งนั้นจะขึ้นเวลาที่ดึงได้ครั้งสุดท้ายแทน

Rules applied: `t-block` (ในยุคปัจจุบัน) · `t-padding` (ทำการ ×2 · มีความสำคัญ) · `t-thuk` · `t-chueung` · `t-budget` (ซึ่ง โดย ดังนั้น in one paragraph) · `t-reassure` · `f1` put the data first · `f2` condition comes first · "หลายแหล่ง" → the 3 named sources · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register ธุรกิจ (business): proposal to a customer

**Before**

> เรามีความยินดีที่จะนำเสนอโซลูชันที่จะช่วยยกระดับการทำงานของท่าน ไม่ว่าจะเป็นการจัดการเอกสาร การอนุมัติ หรือการรายงาน ซึ่งทั้งหมดนี้จะถูกรวมไว้ในแพลตฟอร์มเดียว โดยทีมงานของเราจะทำการติดตั้งและฝึกอบรมให้อย่างครบถ้วน

**After**

> บริษัทฯ เสนอระบบจัดการเอกสาร (Document Management System: DMS) ที่รวมงาน 3 อย่างของฝ่ายจัดซื้อไว้ในหน้าเดียว คือยื่นเอกสาร อนุมัติ และออกรายงาน ติดตั้งและอบรมผู้ใช้ 20 คนให้เสร็จภายใน 15 วันทำการ นับจากวันลงนามในสัญญา ค่าใช้จ่ายและเงื่อนไขอยู่ในหัวข้อ 4

Rules applied: register ธุรกิจ (`เรา` `ท่าน` → `บริษัทฯ` and the department name) · broad ad words (ยกระดับ · โซลูชัน) → what is actually done · `t-mai-wa` · `t-thuk` · `t-padding` · `t-doi` · key term at first use as `ไทย (English: abbreviation)` · a number replaces "อย่างครบถ้วน" · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register ราชการ (official): resolution in meeting minutes

**Before**

> ที่ประชุมได้มีการพิจารณาเรื่องการจัดซื้อเครื่องคอมพิวเตอร์ ซึ่งฝ่ายไอทีได้ทำการเสนอราคามาแล้ว โดยที่ประชุมเห็นว่ามีความเหมาะสม ดังนั้นจึงมีมติให้ทำการจัดซื้อต่อไป ทั้งนี้ให้ฝ่ายจัดซื้อดำเนินการให้แล้วเสร็จโดยเร็ว

**After**

> ฝ่ายเทคโนโลยีสารสนเทศเสนอจัดซื้อเครื่องคอมพิวเตอร์ 12 เครื่อง วงเงิน 420,000 บาท ตามใบเสนอราคาเลขที่ QT-2569-031 ที่ประชุมพิจารณาแล้วเห็นว่าราคาอยู่ในงบประมาณที่ได้รับอนุมัติ มติที่ประชุม อนุมัติให้จัดซื้อตามที่เสนอ และมอบฝ่ายจัดซื้อดำเนินการให้แล้วเสร็จภายใน 30 วัน นับจากวันที่รับรองรายงานการประชุมฉบับนี้

Rules applied: `t-padding` (ได้มีการ · ทำการ ×2 · มีความเหมาะสม) · `t-chueung` · `t-doi` · `t-budget` (ดังนั้น · ทั้งนี้) · extras for the official register: call departments by their real names · figures and document numbers · keep `ดำเนินการ` because it is a standard form word · deadline `ภายใน X วัน นับจาก…` instead of "โดยเร็ว" · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register ข่าว (news): release note

**Before**

> ในเวอร์ชันนี้ เราได้ทำการปรับปรุงประสิทธิภาพในส่วนของการส่งออกรายงาน ซึ่งจะทำให้ผู้ใช้ได้รับประสบการณ์ที่ดียิ่งขึ้น นอกจากนี้ยังมีการแก้ไขข้อผิดพลาดต่าง ๆ อีกมากมาย

**After**

> ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จากเดิม 12 วินาที เพราะเปลี่ยนมาเขียนไฟล์ทีละก้อนแทนสร้างทั้งไฟล์ในหน่วยความจำ แก้บั๊กวันที่ใน Excel แสดงเป็น ค.ศ. ทั้งที่ตั้งค่าเป็น พ.ศ. (ฝ่ายบัญชีแจ้งเมื่อ 2 ต.ค.) เวอร์ชัน 2.4.0 · 22 ต.ค. 2569

Rules applied: register ข่าว (no `เรา` · first sentence says who does what to what · close with version and date) · `t-padding` · `t-block` (ในส่วนของ) · `t-chueung` · `f7` (นอกจากนี้) · "ต่าง ๆ อีกมากมาย" → say what was fixed · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

## Register แชตร้าน (shop chat): replying to a customer about a late parcel

**Before**

> สวัสดีค่ะ ทางร้านต้องขออภัยในความไม่สะดวกเป็นอย่างสูงนะคะ ทางร้านได้ทำการตรวจสอบแล้วพบว่าพัสดุของลูกค้าอยู่ระหว่างการจัดส่ง ทางร้านจะทำการติดตามให้อย่างใกล้ชิด ไม่ต้องกังวลนะคะ

**After**

> ขอโทษด้วยนะคะที่ของยังไม่ถึง ร้านเช็กกับ Flash แล้ว พัสดุเลข TH1234 ออกจากศูนย์คัดแยกลาดกระบังเมื่อเช้านี้ ปกติถึงบ้านภายใน 1–2 วันค่ะ ถ้าพรุ่งนี้เย็นยังไม่ได้รับ ทักมาได้เลย ร้านจะเปิดเรื่องตามกับขนส่งให้ทันทีค่ะ

Rules applied: register แชตร้าน (`ทางร้าน` ×3 → `ร้าน` once per sentence · ค่ะ in every message · keep the apology, because polite words are not padding) · `t-padding` (ทำการ ×2) · `t-reassure` → the next step the customer can take · "อย่างใกล้ชิด" "อย่างสูง" → facts (parcel number · sorting centre · time) · Source: written by the team 2026-10-22 · owner read and accepted 2026-10-29

---

Registers with no pair yet: marketing · personal · academic · complaint · job application · screen. Add them from the owner's edits under the rules above (`thai-grammar` section 8). The 5 team-written pairs above wait for the owner to read them aloud and accept or edit them.


## reference: thai-grammar.md

# Smooth Thai: 7-point composition framework · words to avoid · registers

Open this file when writing or editing Thai of 1 paragraph or more, or when a strict review is ordered (see [`strict-review`](strict-review.md)). Short chat messages, labels, buttons and variable names do not need it.

Thai written by AI carries English sentence structure: sentences run long, are chained with "ซึ่ง" and "โดย", and open the same way every time. Deleting banned words fixes only the symptom. The cause is sentence structure, covered by the 7 points below. Once the structure is right, most of the smaller rules pass by themselves.

Every rule has a code (`f1` · `t-chueung`) to cite during review.

**Contents**

- [1 · The 7-point composition framework](#1--the-7-point-composition-framework)
- [2 · Moves AI likes to use (fix on sight)](#2--moves-ai-likes-to-use-fix-on-sight)
- [3 · Grammar AI often gets wrong](#3--grammar-ai-often-gets-wrong)
- [4 · Registers](#4--registers)
- [5 · Loanwords: pick 1 form per word, use it throughout](#5--loanwords-pick-1-form-per-word-use-it-throughout)
- [6 · Closing](#6--closing)
- [7 · Translating English into Thai](#7--translating-english-into-thai)
- [8 · Discipline for adding rules, and companion files](#8--discipline-for-adding-rules-and-companion-files)

## 1 · The 7-point composition framework

| Code | Point | Before (literal translation) | After (Thai) |
|---|---|---|---|
| `f1` | **Put the topic first.** Do not drag a long subject along as in English. Stop using `การที่…นั้น…` and `การที่ X ทำให้ Y`. | ระบบประมวลผลข้อมูลพวกนี้ทุก 5 นาที | ข้อมูลพวกนี้ ระบบจะ process ทุก 5 นาที |
| `f2` | **Condition and time come first.** Do not trail them at the end with "เมื่อ…". | DB จะเริ่ม timeout เมื่อ traffic พุ่งสูง | พอ traffic พุ่ง DB ก็เริ่ม timeout |
| `f3` | **Start a new sentence with a space or a new paragraph.** Do not put a full stop after every sentence. Use a full stop at the end of a paragraph, or between 2 long sentences on different topics. | เร็วขึ้น. ใช้ memory น้อยลง. ทีมพอใจ. | เร็วขึ้น ใช้ memory น้อยลง ทีมพอใจ |
| `f4` | **Close the clause with a final word:** `ด้วย` `แล้ว` `เลย` `อยู่` `อยู่ดี` `ต่างหาก`. A "ไม่ได้…อย่างเดียว" or "ไม่ใช่แค่…" sentence must close with `ด้วย`. A "ไม่ได้อยู่ที่ X อยู่ที่ Y" sentence must close with `ต่างหาก`. | ปัญหาไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุน | ปัญหาไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุนต่างหาก |
| `f5` | **Drop a subject that is already known, and use a demonstrative instead of a pronoun** (`ตัวนี้` `เคสนั้น` `ตรงนี้แหละที่…`). Do not use `มัน` `เขา` `พวกเขา` for it/they. Take care not to drop so much that it is unclear who acts. | มันลด memory และมันยังปรับปรุงการทดสอบ | ทั้งลด memory และยังปรับปรุงการทดสอบอีกด้วย |
| `f6` | **Use "ก็" to control rhythm:** `พอ X ก็ Y` · `ถ้า X ก็ Y` · `X แล้วก็ Y`. Link a sequence of actions with `แล้ว`. | ถ่ายรูปบิล ระบบอ่านรายการให้เอง | ถ่ายรูปบิลแล้วระบบจะอ่านรายการให้เอง |
| `f7` | **Change topic with a question, a demonstrative or "แต่"** instead of `อย่างไรก็ตาม` `นอกจากนี้` (this cuts about half of them). After listing 2–3 problems, put a turning point before the fix. | อย่างไรก็ตาม การใช้งานจริงมีข้อจำกัด | แต่พอขึ้น production จริง ก็มีเรื่องให้ปวดหัวอีก |

**"ก็" does not go everywhere (`f6-scope`).** A `…ทีไร` sentence does not need ก็ (`ลองทีไร พังทุกที`). A `ไม่ว่าจะ…เมื่อไหร่` sentence needs `ก็จะ`. A result that is the definition of its cause (cost = price of raw materials) takes no ก็ (`วัตถุดิบขึ้นเมื่อไหร่ ต้นทุนต่อจานขึ้นตามทันที`).

## 2 · Moves AI likes to use (fix on sight)

| Code | Move | Fix |
|---|---|---|
| `t-chueung` | "ซึ่ง" chained several levels deep | At most 1 ซึ่ง per sentence. Use "ที่" when the noun is clear. Or split the sentence. |
| `t-budget` | Frequent formal connectors | Per paragraph: ซึ่ง ≤ 1 · โดย ≤ 1 · ดังนั้น ≤ 1. `ทั้งนี้` does not open a paragraph (allowed near a disclaimer or a call to action). This budget does **not** count the final words `ด้วย` `แล้ว` `เลย` `อยู่`, nor `เพื่อ…เพื่อ` in official letters. If a final word reads oddly, restructure the sentence, do not delete the word. In an explanatory article, order connectors ดังนั้น → นอกจากนี้ (rarely) → แต่. |
| `t-doi` | `โดยที่… โดยการ… โดยมี…` | Use ผ่าน · จาก · ด้วย, or no connector at all. |
| `t-khanathi` | `ในขณะที่` used to mean "while (contrast)" / "but" | `A เชื่อ X แต่ B เชื่อ Y` · `ส่วน B กลับเชื่อ Y` (ในขณะที่ = the same period of time) |
| `t-thuk` | ถูก- in every sentence (literal passive) | ถูก/โดน is for bad things or an unknown doer. Otherwise say who did it. |
| `t-padding` | ทำการ · มีการ · ได้มีการ · มีความ + adjective · ที่มีความ | Use the verb directly: `ซับซ้อน` not `มีความซับซ้อน`. Exception: `เป็นความ + verb` (`เป็นความตั้งใจ`) must be kept. |
| `t-khong` | ของ…ของ…ของ | Join the nouns directly: `การพัฒนาเศรษฐกิจไทย` |
| `t-nueng-nai` | หนึ่งใน…ที่สุด (one of the most) | `…ที่สุดคนหนึ่ง` |
| `t-mai-wa` | ไม่ว่าจะเป็น A, B หรือ C (merely listing items) | `A B หรือ C` · `ทั้ง A B และ C` |
| `t-hedge` | Stacked hedges `อาจจะมีความเป็นไปได้ที่จะ` | A single `อาจ`, exactly where you are truly unsure. |
| `t-pronoun` | เรา…เรา…เรา / ท่าน | Drop after the first sentence. Address the reader as `คุณ`, not `ท่าน` (except in official letters). |
| `t-mun` | `มันเป็นที่ชัดเจนว่า` (it is clear that) | `ชัดเจนว่า` |
| `t-comma` | Commas around a modifier `แฮรารี, นักประวัติศาสตร์, แย้งว่า` | Use spaces. |
| `t-dash` | Long dash — and ; | Use a space, a new paragraph, or ที่/ซึ่ง. |
| `t-particle` | ครับ/ค่ะ in document body text | Allowed only in chat, quoted speech and personal blogs (opening, closing, and when speaking to the reader directly, such as `มาดูกันครับ`). |
| `t-overcut` | Cutting words until it turns curt: `อยากช่วย` `ใช้ template` `ส่งมา` | Thai does not "pay rent" on every word the way English does. `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` and the polite words `ขอ` `รบกวน` `นะ` do real work: `อยากจะช่วย` · `ให้ใช้ template` · `รบกวนส่งมาด้วยนะครับ`. The "cut words" rule of other skills applies only to padding words (`t-padding`). |
| `t-reassure` | Vague soothing `ไม่ต้องกังวล` `สบายใจได้` | End on a fact and the next step: `แอดมินจะแจ้งผลภายในพรุ่งนี้ค่ะ` |
| `t-force` | `ระบบบังคับให้…` `ระบบไม่อนุญาตให้…` (the system forces… / does not allow…) | Tell it as a capability or a sequence: `ต้องยืนยันอีเมลก่อน ถึงจะเข้าใช้ได้` (`ถึงจะ` for sequence · `ก็ต่อเมื่อ` for a single condition) |
| `t-samrap` | `สำหรับผมแล้ว ผมคิดว่า` · `สำหรับ…นั้น` opening a sentence | `ผมว่า…` · put the topic first as in `f1` |
| `t-topology` | Telling structure instead of the case `มีเส้นทางเชื่อมระหว่าง A กับ B` | Tell who does what and what happens: `ลูกค้ากดสั่ง ร้านเห็นรายการทันที` |
| `t-considered` | `ถูกพิจารณาว่าเป็น` `ถูกมองว่า` (is considered) | `ถือว่าเป็น` · `คนมองว่า` · or say who is looking. |

**Words and phrases to avoid (`t-block`).** Fix on sight, unless inside `` ` `` or quotation marks (quoted for discussion):

`ในยุคปัจจุบัน` · `ในโลกปัจจุบัน` · `ในโลกที่…` · `เป็นที่ทราบกันดีว่า` · `เป็นที่รู้กันว่า` · `ปฏิเสธไม่ได้ว่า` · `เป็นสิ่งสำคัญที่ต้องตระหนัก` · `มีความสำคัญ` (use `สำคัญ`) · `การที่…นั้น` · `ในเรื่องของ` · `ในส่วนของ` · `อย่างมหาศาล` · `อย่างน่าทึ่ง` · `อย่างไม่น่าเชื่อ` · `ทุกสิ่งที่คุณต้องรู้เกี่ยวกับ` · `โดยสรุปแล้ว` · `กล่าวโดยสรุป` · `นั่นเอง!` · `รีบ…เลย!`

Ad words that are acceptable when paired with a number: `อย่างมาก` · `อย่างมีประสิทธิภาพ` (business documents only) · a single `!` at a hook or call to action on a sales page, not elsewhere.

## 3 · Grammar AI often gets wrong

| Code | Topic | Example |
|---|---|---|
| `g-classifier` | Wrong or missing classifier | server 1 `เครื่อง` · function/parameter 1 `ตัว` · token/record 1 `อัน` · บรรทัด · หน้า · รายการ. If unsure, avoid counting. The official register needs exact classifiers (ถัง · ฉบับ · ราย); informal registers may use `อัน` `ตัว`. |
| `g-cha` | Missing `จะ` in a future or hypothetical sentence | `จะเลือกตัวไหนขึ้นอยู่กับ…` · `วิธีนี้จะคุม rate ได้` |
| `g-function` | Short connector used with the wrong function | `จะ` ≠ `จน` · informal language uses `เวลา` `ตอนที่` instead of `เมื่อ` · `เหมาะกับ` needs กับ |
| `g-verb` | Literally translated verb | burst ≠ `ระเบิด` (use `ยิง`) · drop ≠ `ทิ้ง` (use `ปฏิเสธ`) · match ≠ `ซ้ำ` (use `ตรง`) · cap ≠ `ครอบ` (use `จำกัดไว้ที่`) · throttle ≠ `บีบคอ` (use `ชะลอ` `หน่วง`). A verb that is a physical image in English often needs a different Thai verb. |
| `g-capability` | สามารถ…ได้ (can) | Academic, official and news writing use the full `สามารถ + verb + ได้`. General writing uses `verb + ได้`. |
| `g-time` | Period of time takes ของ | `ในศตวรรษที่ 20` not `ของศตวรรษที่ 20` |
| `g-tirai` | `ทีไร` must close with `ทุกที` or `ไม่เคย…สักที` | `ฝนตกทีไร น้ำท่วมทุกที` · `ทุกครั้ง` is weaker and breaks the idiom · `ทีไร…เสมอ` is borderline, avoid. |
| `g-quant` | A number paired with a feeling verb | `ตัวเลขไม่ตรงกับที่คาด` not `ที่รู้สึก` |
| `g-yamok` | Mai yamok attached to the word `ต่างๆ` `บ่อยๆ` | Put a space before and after: `ต่าง ๆ` `บ่อย ๆ` throughout. Source: spacing rules item ๑.๒.๑๕.๑ "เว้นวรรคเล็กหน้าและหลังเครื่องหมายไปยาลใหญ่ ไม้ยมก …" with example `วันหนึ่ง ๆ เขาทำอะไรบ้าง` · Royal Society of Thailand office https://www.orst.go.th/iwfm_table.asp?a=36 (checked 2026-10-26 · royin.go.th could not be opened from this machine; the same site moved to orst.go.th) |

## 4 · Registers

Choose the register before writing, then keep it for the whole piece (`r-drift`). Change only at a new heading.

| Work | Register | Final particle ครับ/ค่ะ | Speaker/reader |
|---|---|---|---|
| Technical docs · README · manuals · explanatory articles | อธิบาย (explain) | None | `เรา` / `คุณ` |
| Sales pages · landing pages | การตลาด (marketing) | None | `คุณ` only in the body (do not use `เจ้าของร้าน` `ผู้ใช้` in place of คุณ) |
| Personal blog · telling experience · team announcements | ส่วนตัว (personal) | Opening, closing, and when speaking to the reader directly | `ผม` / `ดิฉัน` according to the author (if unknown, use the owner's default in `~/.claude/superuser-style.md` and note it as `ตัดสินใจเอง`) |
| News · release notes · announcements · CHANGELOG | ข่าว (news) | None | No first person · first sentence says who does what to what · the source goes in sentence 2 · close with the version, date or source · `ดังนั้น` only when there is a real cause |
| Thesis · IS · research article · long analysis | วิชาการ (academic) | None | `ผู้วิจัย` or drop the pronoun · `เรา` only for shared experience |
| Official letters · meeting minutes · policy | ราชการ (official) | None | No first person · use standard-form wording (word table below) |
| Company letter to a customer · proposal · BRD FSD SRS · company profile | ธุรกิจ (business) | None | `บริษัทฯ` or the team name, not `เรา` · `คุณ` only in steps telling the reader to do something · key term at first use `ไทย (English: abbreviation)` |
| Customer chat · live selling · review replies · broadcast | แชตร้าน (shop chat) | In every message (ค่ะ or ครับ, one style for the whole shop) | The shop calls itself `ร้าน` or `แอดมิน` once per message · customer is `คุณลูกค้า` or dropped · end on a fact and the next step, no vague soothing (`t-reassure`) |
| Complaint letter · refund request · contract cancellation | ร้องเรียน (complaint) | None | `ข้าพเจ้า` · recipient `ท่าน` or the company name · facts, dates, amounts before the demand · deadline `ภายใน X วัน นับจากวันที่ได้รับหนังสือฉบับนี้` · no threats, no apology |
| CV · job application letter · salary negotiation · LinkedIn | สมัครงาน (job application) | None in a CV · yes in letters and messages to HR | `ผม` / `ดิฉัน` · a CV bullet starts with a verb and ends with a number (`ลดเวลาปิดงบจาก 8 วันเหลือ 5 วัน`) · no `ซึ่งทำให้` |
| On-screen text · buttons · errors · notifications · placeholders | หน้าจอ (screen) | None | `คุณ` or dropped · a button starts with a verb (`บันทึก` `ส่งคำขอ`) · an error = what happened + what to do next, in 1–2 sentences · no stacked `กรุณา` `ท่าน` `ครับ/ค่ะ` · 1 word per action across the whole app, kept in a glossary |

**Person and reader do not switch within a paragraph (`r-deixis`).** Teaching uses `เรา`, advising uses `คุณ`, never mixed in a paragraph. In text that speaks to the reader, `ใคร` `คน` `ผู้ใช้` do not appear in place of the reader: `ขาดทุน แต่ไม่มีใครรู้` → `ขาดทุนโดยไม่รู้ตัว`

**Extra for the official register** (temporary · from one set of examples, waiting for real letters to confirm). A procedure sentence = doer + method + what is done + destination. Call documents by their real names, do not abbreviate like notes (`15/30/45`). Word swaps: เซ็น → `ลงนาม` · ทำ → `ดำเนินการ` · เช็ค → `ตรวจสอบ` · ส่งให้ → `ส่งมาเพื่อ…` · open questions → `ประเด็นที่ยังต้องการคำชี้แจง`. The official correspondence regulation in force is edition 4 of B.E. 2564 (checked 2026-10-22, edition 5 not found).

**Extra for the marketing register.** A single `!` at a hook or call to action · `…` as a coach-style pause is allowed in financial work · a soft close (`ลองได้เลย`) is better than a curt command · do not open a sales page with a definition `X คือ…` · financial work closes with 1 sentence of advice on moderation (`กู้เท่าที่จำเป็นและชำระคืนไหว`) and folds the disclaimer into a sentence in the same voice.

**Word pairs where you pick one side for the whole piece (`r-drift`)**

| Informal | Formal (academic · official) |
|---|---|
| ยังไง | อย่างไร |
| คนไหน · แบบไหน | คนใด · รูปแบบใด |
| เยอะ | มาก · จำนวนมาก |
| ทำไม | เพราะเหตุใด |
| ตอนนี้ | ขณะนี้ · ปัจจุบัน |
| อยากรู้ | ต้องการทราบ |

**Extra for the academic register.** Sentences may be long but must alternate with short ones · `ทว่า` `อย่างไรก็ตาม` `นอกจากนี้` only at real turning points · assert directly, do not hedge if the source did not hedge · open with a question or the frame of the topic, not something broad · close by posing a new question, not by recapping.

## 5 · Loanwords: pick 1 form per word, use it throughout

| Form | Use when | Example |
|---|---|---|
| Translate to Thai | A Thai word people know exists, or the Royal Society of Thailand coined one | เสรีภาพ · ผลิตภาพ · ทุนนิยม |
| Write the sound in Thai | Proper names, new words with no direct Thai word | อัลกอริทึม · บล็อกเชน · ซอฟต์แวร์ |
| Keep English letters | Brand names, abbreviations, terms developers use in English | Google · API · deploy · query |
| Coin a Thai term + brackets at first use | A core concept used repeatedly · abbreviations | ระเบียบในจินตนาการ (imagined order), then Thai only afterwards · ปัญญาประดิษฐ์ (Artificial Intelligence: AI), then Thai or AI, one style for the whole piece. This is the one form for every plugin (`human-writing/spell-out-abbreviations` · `requirements-writing` · `thesis-writing` refer here). |

Mix English only at a single noun or verb (`deploy โค้ด` `query ตาราง`), not `ทำการ deployment ของ code`. Write sounds in Thai following the Royal Society of Thailand's transliteration rules: no tone marks, unless the word's sound collides with a Thai word and causes confusion, such as `โค้ก` (item ๕) (`ซอฟต์แวร์` not `ซ้อฟต์แว่ร์`). Add the silencer mark (karan) on letters that are not pronounced (item ๓.๑). Choose 1 spelling per word and note it. (Source: Office of the Prime Minister announcement, "Rules for transliterating English", announced 26 August B.E. 2532, Royal Gazette volume 106 part 153, 14 September 1989 · read the PDF published by the Royal Society of Thailand https://www.orst.go.th/FILEROOM/CABROYINWEB/DRAWER004/GENERAL/DATA0000/00000753.PDF pages 1-5, checked 2026-10-26 · the consonant table (table 2) has not been compared letter by letter.) Write a foreign person's name in Thai, then English in brackets at first use: `ไมเคิล แซนเดล (Michael Sandel)`. Do not use commas around a modifier.

## 6 · Closing

No recap (`c-recap`). End with what to do next, a newly posed question, or simply stop.

## 7 · Translating English into Thai

Use when the source is English (docs · error messages · papers · articles) and the result is Thai for people to read. Retell the whole paragraph, do not translate sentence by sentence.

1. Reorder by `f1` `f2`: topic first, condition and time first. Turn English passives back into who-did-it (`t-thuk`), except for bad things or an unknown doer.
2. Add nothing the source lacks: no ครับ/ค่ะ, no `อาจจะ` or other hedges the source did not make. Do not drop numbers or conditions.
3. Translate idioms by meaning, not word by word. For an author's metaphor used throughout the piece, coin 1 Thai word and use it every time (section 5, row 4).
4. `it is … that …` `there is` `one of the most` have no Thai form: `ชัดเจนว่า` · `มี…` · `…ที่สุดคนหนึ่ง` (`t-mun` `t-nueng-nai`) · `is considered` is not `ถูกพิจารณาว่า` (`t-considered`).
5. English italics used for emphasis become a final word or word order in Thai (`ต่างหาก` `เลย` `แหละ`), not italics. Foreign person's name `ไมเคิล แซนเดล (Michael Sandel)` at first use.
6. Technical terms stay English per section 5. Verbs that are physical images (burst · cap · throttle · drop) take a different Thai verb each (`g-verb`). Choose classifiers yourself, do not translate `a` `an`.
7. Read the whole paragraph aloud. If you can tell the source was English, restructure it.

## 8 · Discipline for adding rules, and companion files

- **A new rule needs a source:** the owner's edit (before → after) · a source actually opened, with its date · or a real run result. If none, tag it `(ชั่วคราว)` (temporary), like the extra official-register rule above.
- **The user edits an agent's Thai.** Before adding a rule, search this file for whether the rule already exists. If it exists but was not applied, fix the wording or move the rule, and do not add a duplicate. If not, store the before/after pair in [`thai-examples`](thai-examples.md) first (the "after" text must be the user's, not one the agent wrote). Only when it repeats 2 or more times, summarise it into a rule. The examples file keeps at most 10 pairs per register, and a rule that absorbs a pair deletes that pair.
- **Before/after pairs teach better than rules.** Before writing a long Thai paragraph, open [`thai-examples`](thai-examples.md) and look at the pair for the register in use.
- **Automatic checker** `scripts/thai_tells.py` catches `t-block` `t-budget` `t-padding` `f3` (mid-paragraph full stops) `g-yamok` `t-dash` and `ทั้งนี้` opening a paragraph. It only warns, and does not judge whether the text reads smoothly. What the script cannot see (`f1` `f2` `f4`–`f7`, register) you still have to read yourself.
- **Thai letters in exported files** (line breaking · spacing · line-height per medium) live only in [`thai-line-breaking`](thai-line-breaking.md). Other skills link to it.

---

Source: distilled from [chakrit/kien-thai](https://github.com/chakrit/kien-thai) (MIT License · Copyright (c) 2026 Chakrit Wichian · full licence text in [`THIRD-PARTY-NOTICES`](../THIRD-PARTY-NOTICES.md)): the 7-point framework · files `ai-tells` · `grammar` · `register` · `style-rules` · `forbidden-phrases` · `decisions/` (polite words are not an AI tell · Thai does not cut words the English way · do not let the model judge language quality · example pairs before rules), checked 2026-10-22. Academic sources as cited by that repo: Iwasaki & Ingkaphirom · Takahashi 2023 (ก็) · Olsson 2013 (แล้ว) · spacing rules of the Royal Society of Thailand. The 5 extra register rows (business · shop chat · complaint · job application · screen) come from sweeping the templates in the SQT-Marketplace plugins on 2026-10-22.


## reference: thai-line-breaking.md

# Breaking Thai words so lines wrap cleanly

Use whenever you export a Thai document as Word · PDF · HTML · slides with justified paragraphs, or when you see a line with stretched letter spacing (`เ ท ค โ น โ ล ยี`).

## Why it happens

Thai has no spaces between words, so the program must guess where to break. If it cannot guess (a run tagged as English · a font that does not support Thai · a file generated by a script), the whole block of Thai text becomes one long word. The previous line is left with empty space, and justification then stretches the spacing letter by letter to fill the line.

## Fix by file type

| File | Fix |
|---|---|
| **.docx** (made by you or received) | Run `python scripts/thai_linebreak.py <file>.docx` after the file is built. It inserts invisible break points (U+200B) between words · tags runs as Thai · binds numbers to neighbouring words ("4 ประเด็น" does not split across lines) · keep the original in `_to_delete/` · test the script itself with `python -B scripts/thai_linebreak.py --self-test` (pythainlp not needed). |
| **.md before converting with pandoc** | Run the same script on the .md · code inside `` ` `` is not touched. |
| **python-docx / docx-js** | Set the Thai language on the run (`w:lang w:bidi="th-TH"`) and the complex-script font (`w:rFonts w:cs="TH Sarabun New"`) at creation time, then run the script at the end. |
| **HTML** | Chrome · Edge · Firefox break Thai words on their own, no ZWSP needed · set `<html lang="th">` · CSS `word-break: normal; overflow-wrap: anywhere; line-break: auto;` · use `text-align: left` for Thai content · never `word-break: break-all` (breaks mid-word). |
| **PDF** | Fix at the source (.docx or HTML), then convert again. |
| **Slides .pptx** | Thai text boxes left-aligned · long text cannot go through the script, so break lines by hand at phrase boundaries. |

## Paragraph alignment

- General Thai content: **left-aligned** is the safest.
- Academic or official work that needs justification: use "ชิดสองข้าง" (justify, `both`) only **after** running the script.
- Do not use "กระจายแบบไทย" (Thai distribute, `thaiDistribute`) or "กระจาย" (distribute, `distribute`) for body text, because they stretch letters on every line. The script reports paragraphs that use them, and can change them with `--align both` or `--align left`.

## Never break here

- A number and its unit or prefix: `4 ประเด็น` · `ตารางที่ 1` · `พ.ศ. 2569` · `50 %`
- Before `ๆ` `ฯ`, and before vowels or tone marks that cannot start a line.
- Short proper names: `IEEE Transactions`. If it is hard to read after wrapping onto a new line, hold it together with a non-breaking space.

## Line spacing per medium (the central values other skills refer to)

Thai has upper vowels, lower vowels and tone marks that can stack 2 levels, so it needs more line spacing than Latin. Pure Latin can use 1.2–1.4, but for Thai below about 1.4 the upper vowels and tone marks collide or get clipped. The values in the table are the central values the skills in this set use. Change them here, and the skills that refer to them follow.

| Medium | Body text | Headings | Used by |
|---|---|---|---|
| Web page (CSS `line-height` times font size) | 1.6 · long articles 1.75–1.85 | Thai not below 1.4 · large pure-Latin headings can go down to 1.0–1.1 | `ui-craft` |
| Mobile app | 1.5–1.75 · the smaller the screen, the more spacing | Not below 1.4 | `ui-craft` |
| Windows app | 20px at 14px text for on-screen text · long paragraphs 22px | Follow the Fluent scale | `ui-craft` |
| Slides | Not below 1.5 | Not below 1.4 | `slide-deck` |
| Graphics · posts · posters | 1.5–1.7 | Not below 1.4 | `brand-kit` · `graphic-design` |
| Diagram | Not below 1.5 | — | `diagrams` |
| Word .docx (Tahoma font) | 1.3–1.35 as "Multiple" (หลายเท่า) | Follow the template | `document-design` |

**Word does not count the same way as CSS.** "Multiple" in Word multiplies the line height that the font itself defines, and Thai fonts already reserve room for vowels and tone marks. So the number in Word can be lower than on the web without lines colliding. Whenever you change the font, reopen the PDF and look at every page again.

**Web pages must tolerate user adjustment.** WCAG 2.2 criterion 1.4.12 (level AA) requires that when the user sets line spacing to 1.5 times the font size, content must not be cut off or overlap. How to check is in `web-audit`.

## Check

1. Run `--check` to see the number of break points and the paragraphs that are distributed.
2. Convert to PDF and open every page, looking for lines with abnormally wide letter spacing.
3. The word segmenter (pythainlp `newmm`) can break wrongly now and then, for example `ท่า|ทางการ` where it should be `ท่าทาง|การ`. A wrong break point does not change the text, it only may start a new line mid-word. If you find it on a real line, fix that spot by hand.

**Good to know:** the invisible break points are in the actual file. Searching for a word in Word mostly still finds it, but if you copy text into another system and search fails, run the script on the print copy only.
