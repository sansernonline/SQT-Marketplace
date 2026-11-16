# skill: markdown-visuals

Use when a Markdown doc needs an image, SVG or ASCII art

# Markdown Visuals

> **Pre-work gate (every time):** read the owner's theme → search live references → 3 genuinely different directions → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (plugin `software-development`) (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

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
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) (plugin `software-development`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG (doc read on GitHub → same SVG as a `.svg` file, §2)
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / process / money flow / decision   →  repo note (README · Pull Request (PR) · code note) → Mermaid (`software-diagrams`, plugin `software-development`)
│                                              project document (BRD · Software Requirements Specification (SRS) · FSD · ADR) or read outside the team → `diagram-figures`
├─ Architecture / Entity-Relationship (ER) / class → same rule as the line above
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design (plugin `software-development`) tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Routing rule (same in `software-diagrams` and `diagram-figures`):** markdown in a repo read by the team (README · PR · code note) → Mermaid via `software-diagrams` · a project document (BRD · SRS · FSD · ADR · ER · flows) or anything people outside the team read → `diagram-figures`.

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

If the document or project already has a colour palette, use it. If not, search for references per `design-references` (plugin `superuser`), type `document`, and take the colours from the chosen work · if live search is not possible, use the house value `#2A78D6`, mark it `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask (order in `diagram-figures` item 5 · colour-by-domain table [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) · for role-based tokens (`bg-canvas` · `accent-primary` · `state-*` …) see [references/svg-snippets.md](references/svg-snippets.md) · and **1 document uses 1 palette**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](references/svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

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

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](references/ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**Choosing a diagram type, theme, readability rules and Thai labels is covered in `software-diagrams` (plugin `software-development`) items 1–5 and `assets/mermaid-theme.md`** · for Mermaid in project documents that must be converted to a picture for Word, use the converter in `diagram-figures` → `references/engine-mermaid.md`
This file only says *when to choose Mermaid over other formats*

| Choose Mermaid when | Choose something else when |
|---|---|
| It is boxes and arrows that the engine can lay out | If you must control placement yourself, use inline SVG; for a figure that must look designed, use `diagram-figures` (HTML layout or engine-svg-python) and embed it as an image file |
| It lives in a file that must be diffed in git | It is a real screenshot: use an image file |
| Readers open it in GitHub or Notion | Readers open it in a Word document or slides: use an image file |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](references/combining-formats.md). Don't force everything into one format.

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

Before sending, go through item 3 of `no-ai-look` — for HTML work, run its script · every piece must also pass eye check 3.2 (a web page adds items 10–14), because a script result of 0 items is not yet a pass · the bans in this file are specific to this work, and the full list for all media is there


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](../SKILL.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

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


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](../SKILL.md) · a full design spec usually mixes formats.

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


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG pictures of a screen inside .md docs (the real mockup is HTML) · used by [SKILL.md](../SKILL.md) §1

## Colour: it comes from the subject, not from a ready-made table

If the document or project already has a colour set, use that set.
If not, use the house value `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask. Propose a tone drawn from the subject in the report: medical green · finance dark blue ·
industrial amber · government navy · general software blue (the full table is in [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

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


---

# skill: software-diagrams

Use when a README or PR needs a quick Mermaid diagram

# Software Diagrams

> **The one rule of this skill:** a diagram answers **one question**.
> If it answers 2 questions, draw 2 pictures.

> **The destination decides the tool:** this skill draws quick diagrams with Mermaid in the house theme, only for a README · Pull Request · note in code.
> For figures in project documents (BRD · SRS · FSD · ADR · ER · process maps), client proposals, slides and print work, go to `diagram-figures`. The full table for choosing is at the top of that skill.
>
> **Colour in a figure must carry meaning, not decorate.** If the source document already declares a `doc-theme`, use that value and do not pick new colours per figure (the default is the house set in `polished-document-style` · for the meaning of colours see `branded-document-design/references/tokens-and-type.md`):
> A quick diagram uses **one main colour** = "the thing we are talking about" · grey = external/closed systems · white with a grey line (`store`) = data stores · other boxes use the defaults (3 classes `focus` · `ext` · `store` in `assets/mermaid-theme.md`). If you need several colours to separate failure points, exceptions and successes, the figure answers several questions. Split it into new figures or use `diagram-figures`.

## When to use this skill

In a README · Pull Request · note in code:

- Explain the system architecture
- Explain the order of work across several parts
- Explain the states of data
- Design a database
- Say what runs on which machine
- Review a diagram someone else drew


Not for: choosing SVG / ASCII / Mermaid → `markdown-visuals` · screenshots and wireframes → `ui-craft` + the platform skill · data charts → `web-app-design` `references/tokens.md` heading "สีข้อมูล (กราฟ)" · choosing an architecture → `architecture-patterns`

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
| "I want a nice picture for the client proposal" | Not the job of this skill — `diagram-figures` |

**Always draw C4 levels 1 and 2 in full first.** Draw level 3 only for the parts that are truly complex.

## 2 · Theme — one set for the whole project

Put the `%%{init: ...}%%` line on the **very first line** of every diagram, and use the one main colour with the 3 classes `focus` · `ext` · `store`. The main colour is reserved for "the thing we are talking about" only.
The theme line, colour stand-ins, classes and rendered examples are in [`assets/mermaid-theme.md`](assets/mermaid-theme.md). The table that matches kinds of work to colour tones is in `diagram-figures/references/colour-by-domain.md`.

> Warning: **`fontFamily` must sit outside `themeVariables`.** If you put it inside, it is silently ignored and Mermaid falls back to its default font.

**Check with a tool before every send.** This rule is forgotten most often:

The scripts are in the `scripts/` folder of this skill. Run them with the script's full path and the `docs` folder of the project being checked (`<path ของ skill>` = the folder where this skill is installed):

```bash
node <path ของ skill>/scripts/check-mermaid-theme.mjs docs          # exit 1 with file:line of each block that lacks %%{init
node <path ของ skill>/scripts/check-mermaid-theme.mjs --self-test   # proves the checker still catches it
```

An agent with no shell cannot run it → the main agent runs it after taking the work back.

## 3 · Diagrams that need real logos (infrastructure)

If an infrastructure diagram that lives in the repo needs real Amazon Web Services (AWS) · Azure · Kubernetes icons, which Mermaid cannot draw, use the **`diagrams`** library (Python + Graphviz), starting from [`assets/infra-diagram.py`](assets/infra-diagram.py).
Install steps, the commonly used node rules and the traps are in [`assets/diagrams-python.md`](assets/diagrams-python.md). For cloud diagrams that a client or a slide will show, use `diagram-figures`.

## 4 · Rules that make it readable

**No more than 7 boxes.** Past that, readers stop reading (count real boxes, not subgraphs).

**Count boxes before drawing, not after.** If there are more than 7, **split the figure by the order of the story before drawing**. Note the split in `decision-log` and say so in the reply.
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

If you truly cannot get the layout you want and the figure stays in a markdown document, draw an inline SVG per `markdown-visuals`. If the figure must look designed, go to `diagram-figures`.

To record why a design was chosen, use `adr-writer`. A figure that must look designed or needs sign-off → `diagram-figures`.

## Do not look AI-made

Before sending, walk through item 3 of `no-ai-look`. For HTML work, run its script. Every job must also pass eye check 3.2 (web pages also answer items 10–14), because a script result of 0 items is not yet a pass.


---

# skill: presentation-design

Use when planning a slide deck story and layouts

# Presentation Design — slide deck story, layouts, and checks

> **Pre-work gate (every time):** read the owner's theme → search live for a reference → 3 genuinely different directions → check `no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search is for this piece's structure). Close the work with a line `ด่านก่อนลงมือ:`.

> **One rule:** a slide title is a **conclusion**, not a **topic name**. If the audience reads only the titles and understands the whole story, the deck is usable.

## Use when
- Making a deck: client proposal · business plan · research summary · progress report · training · design review
- Reviewing a deck someone else made, or converting a long document into a deck
- Not for: a real `.pptx` file (python-pptx, fonts, cover) → `branded-document-design` · chart palette → `diagram-figures` (`references/colour-by-domain.md`) · diagrams on a slide → `diagram-figures` · a document read alone → `polished-document-style` + `branded-document-design` (a deck sent to be read alone is a document: make a deck for speaking and attach a document)

## Steps
1. **Choose the delivered file.** Do not ask which type: not stated = .pptx · at the end say in 1 line that an .html version with animation is possible.

   | User asks | Gets | Use |
   |---|---|---|
   | "ทำ slide deck" · "ทำสไลด์" · "ทำ presentation" (type not stated) | **.pptx** | `branded-document-design` · `StageDeck` |
   | "slide deck html" · "เด็ค html" · "มี animation" · "นำเสนอจากเบราว์เซอร์" | One .html file with animation | `html-slide-deck` |
   | Has a .pptx · "แปลง pptx เป็น html" · "animation แบบเด็ค IS" · wants interactive pages or click-by-click reveal | One .html that looks like the .pptx on every page | `html-slide-deck` (`references/from-pptx.md`) |
   | Both | .pptx + .html from one source | Build the .pptx with `StageDeck`, then convert with the .pptx entry of `html-slide-deck` |

2. **Research only what is missing.** If the deck cites facts, numbers, a market, or competitors, collect them with sources per `research-with-sources` (plugin `superuser`) before writing titles: a conclusion title must stand on real facts, not memory.
3. **Take the theme from the source work, for every deck.** Run `python scripts/source_palette.py <source file>` on the file, logo, or website the user gave, then choose the mood from the table in [`deck-theme`](references/deck-theme.md) item 2 · if the source has no colour, use the project's colour per `diagram-figures` item 5 · light background by default, section-change pages full-slide main colour · only when live search is really impossible, use the house colour `#2A78D6` and write `(รอยืนยัน)` · if the work already has colours, do not pick new ones. Write a head-of-work line: which file the colour came from · which mood row · light or dark.
4. **Choose the visual direction, stopping at the first hit:** the source work → the design the project already has → a reference the user attached → research (search live per `design-references`, type `slide`, then extract colours from the chosen work; pick 2–3 decks of the same kind and choose light or dark · font · density · image style; write a 1-line reason with sources) → the house default "Stage" (`branded-document-design` · `brandkit_stage.py`). Stage is the fallback when there is no information at all, not the answer for every deck: two decks for different work look different. If the source, project, or user reference supplies colour and fonts, search only for page structure and storytelling. The direction belongs to this deck alone: do not reuse the last deck's without checking the work differs. Render diagram figures with the deck's background colour (`#bg=`).
5. **Write every slide title as plain text, one line per slide.** Read them in order; if they do not form one story, reorder now (much cheaper than later), then cut slides that do not move the story. This step takes under 20 minutes and decides good or bad. Order by purpose: [`references/deck-details.md`](references/deck-details.md). For executives, put the conclusion on slide 1.
6. **Choose a layout per slide** from the 6 in the reference, then put in content and trim to the budget. Every slide has the same footer: section name left, page number right.
7. **Budget per slide, counted in lines on the real slide** (Thai words cannot be counted): title at most 2 lines · at most 6 bullets · at most 2 lines per bullet · bullets are gist, not full sentences. If over, cut whole bullets or move them to the next slide. Never cut function words (จะ ให้ ก็ แล้ว, polite words) to fit; cut items.
8. **Text size.** Smallest content text 18 pt (40 cover · 26 title · 18 bullet in .pptx; table and the Stage-deck exception in the reference). If content does not fit at 18 pt, cut content; never shrink text. 2 weights only; titles bold, body not.
9. **Data slides:** 1 chart, 1 conclusion (a chart saying 2 things becomes 2 slides) · the title is the conclusion · highlight the point in the brand colour and grey the rest · numbers on bars, no gridlines or legend if data can be labelled · state period, sample size, and source · a table over 5 rows by 4 columns becomes a chart or an attachment.
10. **Thai type:** line height at least 1.4 for titles and 1.5 for body · break long Thai titles yourself where the thought ends · a font with real regular and bold · one family for Thai and English on a line (details in the reference).
11. **Render and view the whole deck as thumbnails**, then run the checks below. Before sending, go through item 3 of `no-ai-look` (for HTML work run its script; the eye gate 3.2 must also pass, and web pages answer items 10–14).

## Check before done
- Reading only the titles gives the whole story · every title is a conclusion
- No slide visibly denser than the others · margins and title position match on every slide
- Three-metre test: at 25% size the title is still readable
- At most 6 bullets, each at most 2 lines · smallest content text at least 18 pt
- Every chart has a conclusion and a data source · every slide has a page number
- Opened once on the real projector or screen
- The list of 13 anti-patterns checked ([`references/anti-patterns.md`](references/anti-patterns.md))
- The line `ด่านก่อนลงมือ:` closes the work

## References
- [`references/deck-details.md`](references/deck-details.md) — open when ordering the story, choosing a layout, setting text sizes, building a data slide, or setting Thai type
- [`references/deck-theme.md`](references/deck-theme.md) — open for colours and mood (central file for every slide skill)
- [`references/anti-patterns.md`](references/anti-patterns.md) — open when checking the work


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

Chart colour palette: `diagram-figures` → `references/colour-by-domain.md` · for charts that must also be used with app screens, `web-app-design` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" (data colours, charts).

## Thai on slides

- Line height at least 1.4 for slide titles and 1.5 for body text, because below that the upper and lower vowels of 2 lines collide (middle value in `human-writing` `references/thai-line-breaking.md`)
- For a long Thai slide title, break the line yourself where the thought ends: the program breaks mid-word because Thai has no spaces between words
- A font with both a real regular and a real bold weight: fake bold blurs the vowels
- Thai mixed with English on the same line: one font family that has both languages, otherwise letter heights differ and the line looks tilted
- Font settings in a real `.pptx` file (including the complex script problem): `branded-document-design`

## Off-the-shelf look: avoid

- Things that make a deck look off-the-shelf: a colour line under the title of every slide · cream/beige background as the default · the same 3-column icons on every slide · gradient text · long centred paragraphs
- Flat decks: dark or all-white background across the whole deck when the source work is vividly coloured · the main colour appearing only as thin lines · more than 3 text-only slides in a row · colours not in the source work (fix in [`deck-theme`](deck-theme.md) item 3)

## Related skills

| Need | Use with |
|---|---|
| A single .html deck presented from a browser (menu · notes · clock · click for detail) | `html-slide-deck` |
| Convert .pptx to .html with animation · click-by-click reveal | `html-slide-deck` (`references/from-pptx.md`) |
| Spacing rules and eye order (app screens) | `ui-craft` (plugin `software-development`) |
| Content comes from a Software Requirements Specification (SRS) | `srs-writing` (plugin `software-development`) |
| Cut content down to what is necessary | `simplicity-first` (plugin `software-development`) |
| Brand colour and type system · illustration | `graphic-design` (plugin `software-development`) |


## reference: deck-theme.md

# Deck theme: bright, and fitted to the source work

The central file for every slide skill (`presentation-design` · `html-slide-deck` (including the entry from .pptx) · `StageDeck` in `branded-document-design`). Open it at item 1 step 0, before opening the program.

> **The one rule:** the deck must look like it came from the source work, in both colour and mood. Someone who sees the deck next to the source document must know it is the same work.

## 1 · Colour comes from the source work first

"Source work" is what the user gave you to turn into a deck, such as a report .docx · .pdf · an existing .pptx · a website or app · a poster · a logo · a product photo. Find the colour in this order and stop at the first hit:

1. **If the source work has its own colours, extract them with the script**, not by eye:
   ```bash
   python scripts/source_palette.py <ไฟล์ต้นทาง> [โลโก้] [ภาพหน้าจอ]
   ```
   The script reports the main colour, up to 2 secondary colours, and whether the source background is dark or light, then prints values ready to put into `build_deck.py` · `StageDeck` · `pptx_to_html.py`. It reads .pptx .docx .xlsx .html .css .svg images and .pdf (needs `pdftoppm`). Colours it ignores: grey, white, black · the default Office theme (colours the author did not choose) · Word styles the content does not use · colours that appear fewer than 3 times or under 10% of the main colour
2. If the source has no colour (plain text · black-and-white documents), use the project's colour in the order in `diagram-figures` item 5 (`doc-theme`, then the brand colour in code or the logo)
3. If there is still none, search for a reference per `design-references`, type `slide`, with the work's keywords, then extract colours from the chosen work (the same script works on a screenshot of the reference)
4. If live search is not possible, use the house colour `#2A78D6` and write `(รอยืนยัน)` (to be confirmed) in the report

You must still open and look at the script result once: the main colour it gives must be one that people remember the work by (logo colour · cover colour). If it picked the colour of an illustration or a screenshot that happens to cover a large area, feed it the logo or cover file instead.

**Never invent a secondary colour.** The secondary colour must come from the source work. If the source has one colour, use one colour, and make it vivid with item 3 instead.

## 2 · Mood comes from the content

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

When the user says "สดใส" (bright) "น่าดู" (good to look at) "ไม่จืด" (not flat), or says nothing at all, do the following by default (`no-ai-look` forbids ordering by free-floating adjectives, so this is turned into rules that can be checked):

1. **Light background by default.** Use a dark background only when the source work or app is dark (the script says `พื้นต้นทาง … (เข้ม)`)
2. **Full-slide main colour** on the cover, section openers and closing page · `build_deck.py --theme bright` does all 3 types (`.hero` `.divider` `.close`) · `StageDeck(block=True)` does the cover and chapter dividers (no separate closing page) · content pages use a light background, with cards tinted faintly with the main colour
   - **Logos on solid-colour pages use a pure white or pure black version** to match that page's text colour, because a logo the same colour as the background, or close to it, disappears · if you only have a coloured logo, place it on a white rounded box, or move the logo to the first content page
3. **Secondary colour from the source** (if any) separates sections, for example section 2's opener is fully the secondary colour, or it emphasises numbers whose meaning differs from the main colour · the whole deck has at most 3 colours plus status colours
4. **Real images in at least 1 of every 3 slides.** Images from the source work, screenshots, product photos, or images made per `image-generation` · no more than 3 text-only slides in a row
5. **No layout repeated more than 2 slides in a row** (`no-ai-look` item 3.2 item 5)
6. **Never use vividness in place of readability.** Text of every size on a solid colour must reach ≥ 4.5:1 · `build_deck.py --theme bright` and `StageDeck(block=True)` choose for you: white when white reaches 4.5:1; if not, near-black (for example on yellow); and if near-black still falls short, pure black (for example on orange, teal and the house blue) · you must still open every slide image and check per item 7 of `presentation-design`

Do not count as vividness, and still forbidden per `no-ai-look`: purple-blue gradients · gradient text · neon or glow · several pastel colours not in the source work · decorative icons on every card · every animation

Work in the "stable" and "calm" rows of item 2 uses only items 1 2 4 5 6 · use item 3 when the source really has a secondary colour, and full-slide main colour is left only on the cover and closing page.

## 4 · Put it into the tools

| Tool | What to put in |
|---|---|
| `html-slide-deck` | `build_deck.py … --theme bright --brand <main colour>,<light colour>,<secondary colour>` · pages that use the secondary colour full-slide get `data-tone="2"` on `<section>` · a dark source background uses `--theme dark` |
| `StageDeck` (.pptx) | `StageDeck(accent="<main colour>", bg="FFFFFF", block=True)` when the background is light (`block=True` makes the cover and chapter dividers solid full-slide main colour) · the secondary colour is used for figures and charts passed in (`diagram-figures` `#accent=`) |
| `html-slide-deck` entry from .pptx | The look comes from the .pptx · make the .pptx per this file first, then `--accent <main colour>` |
| Diagram figures in the deck | `diagram-figures` with `#accent=<main colour>&bg=<deck background colour>` |

## 5 · Check before sending

- [ ] Place the deck thumbnails next to the source work: the main colours match and it is clearly the same work
- [ ] Every colour in the deck comes from the source work or the order in item 1 · the report says which file
- [ ] The mood matches a row in item 2 and the reason is written at the head of the work
- [ ] Item 3 is complete: background follows the source · full-slide main colour on section-change pages · real images ≥ 1 in 3 · no more than 3 text-only slides in a row
- [ ] `check_deck.py` or `check_html_deck.py` reports 0 problems, then open `sheet-*.png` and look at every slide
