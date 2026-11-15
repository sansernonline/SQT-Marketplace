---
name: diagram-figures
description: Use when a document or slide needs a designed diagram
---

> **The figure's main colour = the project's main colour.** Look for it in the order given in item 5. Only if nothing is found, use the house palette `#2A78D6` from `polished-document-style/references/theme-colors.md` ("ค่าตั้งต้นประจำบ้าน", the house default).

# Diagram Figures

> **Pre-work gate (every time):** read the owner's theme → search live for a reference → 3 genuinely different directions → check `no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search is for finding this piece's structure). Close the work with a line `ด่านก่อนลงมือ:` (pre-work gate:).

> **Language:** write every line of wording per `human-writing`. This skill gives the format and structure; human-writing gives the way to write so people understand.

This skill is the single house style for figures that must look "designed", not "generated". It has 3 engines that share one set of colours, icons and rules.

## Choose a route

| Need | Go to |
|---|---|
| A figure in any work document (business plan · shop process chart · family money chart · research summary · software documents such as Business Requirements Document (BRD) · Software Requirements Specification (SRS) · Entity-Relationship (ER) diagram) and figures that must look designed, for client proposals · slides · print · sign-off documents, including cloud diagrams that need real logos | **This skill: HTML layout engine** (default · item 2) |
| The same style, but generated from data or code, for example re-issued every time the data changes, or needing coordinates controlled on a grid | **This skill: SVG/Python engine** ([references/engine-svg-python.md](references/engine-svg-python.md)) |
| Dozens of Mermaid blocks (sequence · state · ER · gantt) that must go into a Word or Portable Document Format (PDF) file looking like hand-drawn figures | **This skill: Mermaid engine** ([references/engine-mermaid.md](references/engine-mermaid.md)) |
| A quick diagram in a README · Pull Request · code note (not a project document) | `software-diagrams` (plugin `software-development`) (Mermaid with the house theme; for a cloud diagram in a repo that needs logos, use the `diagrams` library in the same skill) |
| Deciding how to embed a figure in a markdown file (inline SVG · image file · ASCII · Mermaid) | [`markdown-visuals`](../markdown-visuals/SKILL.md) |

**Routing rule (matches `software-diagrams` and `markdown-visuals`):** markdown in a repo the team reads (README · Pull Request · code note) → Mermaid via `software-diagrams` · project documents (BRD · SRS · Functional Specification Document (FSD) · Architecture Decision Record (ADR) · ER · process charts) or anything read by people outside the team → this skill.

The cost of this skill is **time**, because 1 figure needs several rounds of fixes.
So use it only for figures that people outside the team will see, and see repeatedly.

## 1 · Answer three questions before opening a file

1. **Where does this figure go?** Slide 16:9 · A4 page · screen.
   Then set `.sheet{width:...}` to match: slide 1600px · A4 portrait 1240px · A4 landscape 1750px
2. **Who is the reader?** For a non-technical client, write box names in Thai. A technical team reads the real service names.
3. **What is the one question this figure answers?** 1 figure answers 1 question (same rule as `software-diagrams` (plugin `software-development`))

## 2 · Choose a template

There are 4 templates in the `assets/` folder. **Copy one and edit it; do not start writing your own.** Details of each template are in the linked files.

| Question the figure answers | Template | Details |
|---|---|---|
| "Who outside does this system, shop or organisation talk to?" — the top-level overview (software calls it C4 model (Context · Containers · Components · Code) level 1) | [`figure-context.html`](assets/figure-context.html) | [layout-context.md](references/layout-context.md) |
| "Where is the real thing, and what is inside?" — departments · places · machines (in software: deployment · container) | [`figure-template.html`](assets/figure-template.html) | [layout-deployment.md](references/layout-deployment.md) |
| "Which cloud services are used?" — must have real Amazon Web Services (AWS) · Azure · Google Cloud logos | [`figure-cloud.html`](assets/figure-cloud.html) | [layout-cloud.md](references/layout-cloud.md) |
| "What does 1 item (a message · an order · money) pass through, and in what order?" — a chart with sequence numbers ①–⑥ · user → channel → internal layer → external services and data | [`figure-flow.html`](assets/figure-flow.html) · [example](assets/figure-flow-example.png) | [layout-flow.md](references/layout-flow.md) |

Every template uses the same colours, sizes, fonts and line-drawing script. They differ only in layout.

## 3 · The figure header needs all six parts

Project logo · title · 1-line sub-title · figure number · version and date · owner

The logo goes before the figure title (`<img class="logo">` points to the project's `assets/logo/`; if there is no logo, note in the report that it is missing). The sub-title says "what the real thing is", not an expansion of the title. **A figure with no date is one nobody dares edit and nobody dares trust.**

Full reasoning and the wrong/right example of the sub-title → [`references/design-system.md`](references/design-system.md), section "Figure header".

## 4 · Size system

**Sizes, spacing and corners are already in `:root` of `assets/figure-template.html`. Do not set new values yourself.**
These numbers were tuned until figures look deliberate. If you move them, figures in the same document will look uneven.

Icon frame 66px or more (below 56px the figure looks hollow) · connectors vertical or horizontal only, bent with rounded corners, no diagonal lines

Full value table (text · icon · box · `.focus` · line · spacing) → [`references/design-system.md`](references/design-system.md), section "Size system". Open it when adjusting a template or writing a new one.

> **Text size depends on where the figure will be placed, not on the canvas.** The table above suits slides and screens. A figure placed in an A4 document must be worked back from the placed size: the smallest text after placing must be ≥ 7 points (pt) → `minimum px = 0.247 × canvas width(px) ÷ placed width(cm)`. A 2000px canvas on a 17 cm portrait page = 29px; on a 25.7 cm landscape page = 20px. After enlarging the font, boxes must be wide enough that Thai names are not cut mid-word.
> **2 versions from one source file:** the full version (with all 6 header parts, for standalone or slide use) and the in-document version (`?embed=1` hides the header because the document's caption already says it; a repeated header makes the figure smaller and cluttered). Make the aspect ratio wide enough to fill a landscape page (width ÷ height ≥ 1.46).
> **The whole set of figures uses one CSS file** (`figure-theme.css` next to the source files) that pulls colour, font and logo from the project's identity (`assets/logo/` · mockup tokens). Change it in one place and every figure follows.
> **The beauty gate for figures** runs together with the beauty gate for documents (`branded-document-design` item 0.1): main path is a solid line in the strong colour · secondary lines grey · a legend · flow order numbered when there are more than 3 steps.

## 5 · Colour system

**The figure's main colour is the project's main colour (or the shop's, the family's, that job's).** Never use a colour from an example or a reference image. Look in this order and stop at the first hit:

1. `doc-theme` in the project's documents (see `polished-document-style`, section "ธีมของเอกสาร" (document theme))
2. The brand colour the project actually uses: main colour variables in code (`--primary` · `--brand` · `--accent` in CSS · `primary` in Tailwind / UI theme · `colorPrimary` in a mobile app) · brand kit · main colour in the logo
   Read the background colour from the same places (`--background` · `--bg` · `background` in Tailwind · the dark or light mode the app mainly uses), because figures and decks use the background that follows the project's design.
3. Nothing at all yet → **search for a reference first:** take the project's words and search live per `design-references` (plugin `superuser`), type `document`, then extract colours from the chosen work. The stored colour library is used when live search is not possible.
4. Live search not possible → use the house palette `#2A78D6`, write `(รอยืนยัน)` (to be confirmed) in the report, and carry on without stopping to ask. Put a tone from [references/colour-by-domain.md](references/colour-by-domain.md) in the report to choose later.

If you found a colour in item 2 but there is no `doc-theme` yet, declare a `doc-theme` with that value, so the project's figures, documents and slides use the same colour.

In the HTML templates, change `--accent` in `:root` in one place (SVG/Python engine: change `ACCENT` in `theme.py`) · background that follows the project's design → append `#accent=<main colour>&bg=<background colour>` to the file name · exceptions that do not change with the brand (provider logo colours · structural grey) and the **7 icon colour groups** (`t-neutral` · `t-edge` · `t-app` · `t-view` · `t-data` · `t-alert` · `t-warn`) with their meanings → [`references/design-system.md`](references/design-system.md), section "Colour system". An 8th colour means colour is used for looks.

**Limit the number of colours, not the weight of colour.** In a figure that must look designed, the main colour must be visible across the whole figure, not only in the header bar. Labels that must be found fast (step number · owner · status) use a solid fill · card headers are a full-width solid colour band (do not use a thick colour stripe beside a rounded card, because that is an AI signal in `no-ai-look`) · summary boxes use a dark fill · pastel colours are allowed only as a fill that has text or a dark border with it · check with the "colour power" axis in the beauty gate of `ui-craft` (`ui-craft/references/states-and-checks.md` (plugin `software-development`)).

### 5.1 · A figure needs a focal point, not flatness

A figure that is readable but flat = white cards that all look alike · all lines the same thickness · nothing draws the eye. The user will say "ดีขึ้นแต่ไม่ว้าว" (better but not wow). Ways that pass the beauty gate:

| Part | What to do |
|---|---|
| Canvas | Use the same background as the app's identity. A dark app gets a figure that is dark all over (not a white frame around a dark image) · faint dot-grid pattern, at most 8% opaque, for depth |
| Main path | 6px thick in the brand colour + glow (`filter: drop-shadow(0 0 8px <brand colour 75%>)`) · secondary lines thin, grey, no glow. The difference is clear enough that the legend need not be read |
| Focal point | 1 `.focus` card per figure: 3px brand-colour border + surrounding glow + icon with brand-colour fill · other cards' fill blends into the canvas |
| Sequence badge | Brand-colour fill, text in the canvas colour + a light glow |
| Contrast | Secondary text on a dark fill ≥ 7:1 (light grey, not mid grey) |
| Theme | Every colour is a variable in a single css file · arrowheads read colour from the variable (`getComputedStyle`), no values hard-coded in JavaScript (JS) · meaning colours (`t-app` `t-alert` `t-warn`) have a dark-background pair · no colour in `style=""` of figure files |

**Dot grid + glowing lines = an approved house style** (the exception "an approved look always wins" in `no-ai-look`) · when scanning with `slop_scan.py`, add `slop-ok` at `grid-bg` and `neon-glow` of these figures, with a short reason.

**How to choose a direction:** write 3 directions as override css, inject them into 2 real figures at render time (`add_init_script` before the line-drawing script runs) → place them next to the original → have a reviewer who did not do the work score them → edit the one theme css file and render the whole set. A dark figure in a white-page document must be a recorded decision (for example, chapter-opening pages and the cover are dark too), not an accident.

## 6 · Icons: use official ones from the library, and draw your own only when there is none

**Whether an official icon of that service exists** decides it.

- **If it exists** (AWS · Azure · Google Cloud · Kubernetes · most open-source tools), use the official one from `assets/`.
  That means the 205 selected in `assets/icons/`, or the full library through `python assets/find-icon.py <name>`. These sets are published for drawing architecture diagrams. Group lists, commands and licences are in [references/icons.md](references/icons.md).
- **If it does not exist**, or it is something we built ourselves, draw a line icon yourself, and write in the footnote that
  the icon is not an official logo (the `figure-template.html` template already has this line).
- **Never mix** them in one figure, because brightly coloured logos next to thin line icons make the figure look unfinished.

Hand-drawn line icons: `viewBox 0 0 24 24` · `stroke-width 1.6` · no fill · round line caps · must be readable at 24px (detail beyond 3 strokes turns into a black blob)

## 7 · Wires

**Within the same column** use the down arrow `.down`. **Across columns** use the `WIRES` list at the end of the file (`{from, fs, to, ts, tp, label}`) and let the script draw after layout. Never write fixed coordinates.

**Rules you must not miss:**

- Vertical or horizontal lines only, bent with rounded corners via `elbow()` (use `mx` when several lines share one channel) · no diagonal lines
- A label must be narrower than the gap between columns (longer label → increase `gap` of `.stage`)
- **No more than 5** cross-column lines per figure · connect to the smallest box that is correct
- A label says **what flows through** (`HTTPS 443`), not `เชื่อมต่อ` (connect) · if there is nothing to say, put no label · a line not yet really connected uses `planned:true` with a footnote

`WIRES` code example · where each rule comes from · `lp` · `tp` → [`references/wires.md`](references/wires.md). Open it when writing `WIRES`.

### 7.1 · Layout: process charts and team charts

The user set this rule after seeing a real figure (2026-10-28), because a figure with wandering curved lines and boxes scattered out of rows is confusing to read.

- **Read top to bottom**, 1 level per tier: entry → middle → receiver → result · use left to right only when there is a time axis (Gantt)
- **The middle element sits in the centre of the figure** (team lead · main system · `.focus` box), and the whole figure is centred as a rule, not pushed left leaving the other side empty
- **Things at the same level go in the same frame, in the same row**, with a group name on the border line, such as "ทางเข้า" (entry) or "agent 8 ตัว" (8 agents)
  - The frame is a single line, no fill, no shadow
  - Cards in the same frame have equal height
  - If there are too many for one row, split into several rows in the same frame and centre the last row
- **If every box in a group receives the same thing, draw one line into the frame**, do not branch a line to every box · if each box is a different choice, draw a separate line per box and move the group name to the bottom border so the line does not cross the name
- **Line channels are outside the frame.** Lines leaving or entering a group bend in the gap between frames and do not cross a group name or a card
- **Keep it soft.** Straight runs of a line are still vertical or horizontal, but every bend is a curve of radius about 12 px (runs shorter than 24 px reduce the radius accordingly) · cards have 14 px corners · group frames have 20 px corners · labels are capsules · no sharp corners on boxes or lines
- **Thai words must not break mid-word.** The browser's word breaker splits some words wrongly, and the pieces may not fall on word boundaries (for example `เช็|กมิจฉา|ชีพ`). Keep a list of these words (ทีละ · สต็อก · ร้านค้า · เช็ก) and never break a line at any point that is inside a word in the list (wrap with `white-space:nowrap`) · for a long text not in the list, put `<br>` yourself per item 8 · open the figure and look at every card
- **Every box has a name and a 1-line description**, not only an icon · steps connected in a sequence (1 → 2 → 3) need no frame, because they are not the same level

## 8 · Thai language

- **`line-height` cannot go below 1.5**, because upper vowels and tone marks stacked in 2 layers get cut off. For the same reason, **never set a fixed height on a text box**.
- Font order is `"Noto Sans Thai","IBM Plex Sans Thai",Tahoma,Loma`, already set in the templates.
For a figure to be embedded in a deck (`StageDeck` · `html-slide-deck`), move `"IBM Plex Sans Thai"` to the first position · a Word document uses the brand's Thai font and falls back to Tahoma if it is missing (`branded-document-design` item 2); a figure inside it may use a different font · if the machine has no Thai font at all, vowels silently end up in the wrong position, so **always render and look**.
- **Thai has no spaces between words**, so the browser breaks a line mid-word. If the text is long, put `<br>` yourself.
- Thai characters look smaller than English at the same size, so keep descriptions at 12px or more.

## 9 · Render and look. Never skip

```bash
pip install playwright && playwright install chromium
cp <skill>/assets/render-figure.py docs/figures/render.py     # ครั้งแรกของโปรเจกต์
python docs/figures/render.py                  # ทุกรูปใน docs/figures/src/ → docs/figures/*.png + docs/figures/doc/*.png
python docs/figures/render.py arch-01 --min-px 20             # เฉพาะรูปที่ระบุ · ตัวอักษรขั้นต่ำตามขนาดที่วาง (ข้อ 4)
python assets/render-figure.py figure.html figure.png 2       # ไฟล์เดียว (สไลด์ · ลองแนว)
```

- **The render script lives at `docs/figures/render.py`, next to the `src/` folder.** It is a project tool needed every time a figure is edited. Never keep it in `_to_delete/` or a scratchpad (when the temp folder is cleared you are left with sources that cannot be rendered) · never delete `docs/figures/src/`, because .png files are only output
- The folder mode produces 2 versions per figure (full version + in-document version `?embed=1` per item 4) and checks the text for you: text smaller than `--min-px` · a name or label that wrapped · text overflowing a box or the canvas · overlapping labels → `problems: 0` and exit 0 means pass

Always use multiplier **2**, because multiplier 1 gives a blurry image when enlarged in a slide.

Then run the geometry checker, which catches diagonal lines, corners that are not rounded, overlapping labels, and lines crossing text:

```bash
python scripts/check-figure-geometry.py docs/figures/src     # exit 0 = ผ่าน
python scripts/check-figure-source.py docs/figures/src       # ทุกรูปเริ่มจากโครงของ skill นี้
```

Then open the image file and look with your own eyes, going through this list:

- [ ] Does every cross-column wire have an arrowhead? Does any line cross a box or text?
- [ ] Are the labels on lines readable, and do they not overlap each other?
- [ ] Is the Thai text complete? Are any vowels or tone marks missing? Is any word cut mid-word?
- [ ] Is there really only one `.focus` box? Does the header have all 6 parts? Does the logo actually show?
- [ ] Shrink the figure to 25% width. Can you still tell what is where?
- [ ] Measure the smallest text in the HTML and convert it to pt at the real placed size (item 4): is it ≥ 7pt?
- [ ] Can someone who has never seen this system answer the original question?

## 10 · Pitfalls found in practice

If a figure comes out wrong, for example a missing arrowhead, a line drawn to the wrong box, missing Thai vowels, or a label overlapping a box, open the table of symptom → cause → fix in [references/pitfalls.md](references/pitfalls.md) before fixing it yourself.

## 11 · Anti-patterns

- **Using this skill for in-team figures.** It wastes several rounds on beauty nobody needs.
- **Using an official logo in a way that looks like the provider endorses it.** Item 6 and [icons.md](references/icons.md)
- **2 `.focus` boxes.** It means the figure answers 2 questions
- **Sending an HTML file to the client.** Send a PNG; the HTML file is the source, keep it in the repo
- **Not keeping the HTML file.** Next year the figure needs editing and must be redrawn from scratch
- **A figure with no date and owner**
- **Diagonal lines or sharp corners.** Lines must be vertical or horizontal, bent with rounded corners (items 4 and 7)
- **Same-level things scattered across rows or without a frame · the middle element pushed to the figure's edge.** Lay out per item 7.1
- **Mixed icon styles.** Thin lines mixed with thick lines, mixed with solid icons
- **A flat figure: all cards white and alike, all lines equally thin.** Readable but with no focal point. Follow item 5.1

## 12 · Connect to other skills

| Need | Use with |
|---|---|
| A quick diagram in markdown of a repo the team reads (README · Pull Request · code note) | `software-diagrams` (plugin `software-development`) |
| Choose how to embed a figure in a markdown file | `markdown-visuals` |
| Put a figure in a slide | `presentation-design` |
| Put a figure in a Word / PDF file | `branded-document-design` |
| A figure in an SRS document | `srs-writing` (plugin `software-development`) |
| Colour and spacing of app screens (a different system from this figure) | `ui-craft` (plugin `software-development`) |

## Not looking AI-made

Before sending, go through item 3 of `no-ai-look`: for HTML work, run its script · every job must also pass the eye gate 3.2 (web pages also answer items 10–14), because 0 findings from the script is not yet a pass · the prohibitions in this file are specific to this work; the full list for every medium is there.

## Abbreviations

HTML — HyperText Markup Language · PNG — Portable Network Graphics · SVG — Scalable Vector Graphics · CSS — Cascading Style Sheets
