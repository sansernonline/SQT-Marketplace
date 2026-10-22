# skill: markdown-visuals

Use when a markdown doc needs a picture. Pick inline SVG, image file, ASCII or Mermaid by where it is read (GitHub drops inline SVG).

# Markdown Visuals

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (plugin `software-company`) (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

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
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) (plugin `software-company`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` (plugin `software-company`) → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG (doc read on GitHub → same SVG as a `.svg` file, §2)
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / process / money flow / decision   →  repo note (README · Pull Request (PR) · code note) → Mermaid (`software-diagrams`, plugin `software-company`)
│                                              project document (BRD · Software Requirements Specification (SRS) · FSD · ADR) or read outside the team → `diagram-figures`
├─ Architecture / Entity-Relationship (ER) / class → same rule as the line above
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design (plugin `software-company`) tokens.md "สีข้อมูล (กราฟ)"
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

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น ส่วนถ้ายังไม่มี ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม (ลำดับใน `diagram-figures` ข้อ 5 · ตารางโทนตามเนื้องาน [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) ส่วน token ตามหน้าที่ (`bg-canvas` · `accent-primary` · `state-*` …) ดูได้ใน [references/svg-snippets.md](references/svg-snippets.md) และ **1 เอกสารใช้ชุดสีเดียว**

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

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams` (plugin `software-company`) ข้อ 1–5 และ `assets/mermaid-theme.md`** · Mermaid ในเอกสารโปรเจกต์ที่ต้องแปลงเป็นรูปลง Word ใช้ตัวแปลงใน `diagram-figures` → `references/engine-mermaid.md`
ที่นี่บอกแค่ว่า *เมื่อไหร่ควรเลือก Mermaid แทนรูปแบบอื่น*

| เลือก Mermaid เมื่อ | เลือกอย่างอื่นเมื่อ |
|---|---|
| เป็นกล่องกับลูกศรที่เครื่องจัดวางให้ได้ | ถ้าต้องคุมตำแหน่งเองให้ใช้ inline SVG ส่วนรูปที่ต้องดูออกแบบมาให้ใช้ `diagram-figures` (HTML layout หรือ engine-svg-python) แล้วฝังเป็นไฟล์ภาพ |
| อยู่ในไฟล์ที่ต้อง diff ใน git | เป็นภาพหน้าจอจริง ให้ใช้ไฟล์ภาพ |
| ผู้อ่านเปิดใน GitHub หรือ Notion | ผู้อ่านเปิดในเอกสาร Word หรือสไลด์ ให้ใช้ไฟล์ภาพ |

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

- ❌ **Text-only design docs** — "the icon is in the top-right" with no picture
- ❌ **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- ❌ **PNG screenshots of text** — use the text, in a code block
- ❌ **Inline `<svg>` in a doc read on GitHub** — GitHub drops it; save as `docs/figures/x.svg` and use `![alt](figures/x.svg)` · a `.svg` file without `xmlns` also fails
- ❌ **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- ❌ **ASCII art outside a code fence** — proportional fonts will mangle alignment
- ❌ **Mermaid syntax newer than the viewer** — GitHub's Mermaid version changes; check it with a ```` ```mermaid ```` block containing `info` before using new diagram types
- ❌ **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- ❌ **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

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

Not sure a visual will render? Preview it in the viewer the reader will use (GitHub, Notion, VS Code) before delivery.

## Related skills

- `polished-document-style` — overall doc formatting, figure captions, callout boxes
- `simplicity-first` (plugin `software-company`) — don't over-design the diagram; show what's needed
- `software-diagrams` (plugin `software-company`) — which diagram type answers which question, plus the shared Mermaid theme
- `diagram-figures` — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- `ui-craft` (plugin `software-company`) — spacing, hierarchy and states when the picture is a screen

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้เลย ดูรายละเอียดใน skill `spell-out-abbreviations`


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

## สี — มาจากเนื้องาน ไม่ใช่จากตารางสำเร็จรูป

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น
ถ้ายังไม่มี ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนจากเนื้องานไว้ในรายงาน — การแพทย์เขียว · การเงินน้ำเงินเข้ม ·
อุตสาหกรรมเหลืองอำพัน · ราชการกรมท่า · ซอฟต์แวร์ทั่วไปน้ำเงิน (ตารางเต็มอยู่ใน [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

กำหนดเป็น **token ตามหน้าที่** ไว้บนสุดของเอกสาร แล้วใช้ค่าเดียวกันทุกรูปในเอกสารนั้น:

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| `bg-canvas` | พื้นหลังของรูป | เฉดเข้มสุด (โหมดมืด) หรืออ่อนสุด (โหมดสว่าง) |
| `bg-surface` | แผ่น พาเนล การ์ด | ต่างจาก canvas พอให้เห็นขอบโดยไม่ต้องตีเส้น |
| `bg-elevated` | ไทล์ที่ลอยขึ้นมาอีกชั้น | |
| `accent-primary` | จุดเน้น สถานะที่กำลังทำงาน | **สีแบรนด์** (ไม่มี → `#2A78D6` + `(รอยืนยัน)`) |
| `text-primary` | ข้อความหลัก | contrast ≥ 4.5:1 กับพื้นที่มันวางอยู่ |
| `text-muted` | ข้อความรอง placeholder | `rgba(...,0.55)` ของ `text-primary` |
| `state-success` · `state-warning` · `state-danger` | สถานะ | **ไม่เปลี่ยนตามแบรนด์** — เขียวคือผ่าน แดงคือไม่ผ่านเสมอ |

**1 เอกสารใช้ชุดสีเดียว** — รูป 10 รูปในเอกสารเดียวที่สีไม่ตรงกัน อ่านยากกว่ารูปไม่สวยแต่สีตรงกัน

## Snippets

> ตัวอย่างข้างล่างใช้ชุดสีโหมดมืดชุดหนึ่งเป็นตัวแทนเท่านั้น
> **เปลี่ยนค่าสีให้ตรงกับชุดที่ตกลงไว้ก่อนใช้** โครงสร้างคือสิ่งที่ต้องคัดลอก ไม่ใช่ค่าสี

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

Use when a README, PR or code note needs a quick Mermaid diagram. Diagrams in project docs (BRD, SRS, FSD, ER, flows) → diagram-figures.

# Software Diagrams

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียวของ skill นี้:** ไดอะแกรมตอบ**คำถามเดียว**
> ถ้าตอบ 2 คำถาม ให้วาด 2 รูป

> **ปลายทางตัดสินเครื่องมือ:** skill นี้วาดไดอะแกรมด่วนด้วย Mermaid ธีมประจำบ้าน สำหรับ README · Pull Request · โน้ตในโค้ดเท่านั้น
> ส่วนรูปในเอกสารโปรเจกต์ (BRD · SRS · FSD · ADR · ER · ผังขั้นตอน) ข้อเสนอลูกค้า สไลด์ และงานพิมพ์ ให้ไปที่ `diagram-figures` · ตารางเลือกทางฉบับเต็มอยู่ที่หัว skill นั้น
>
> **สีในรูปต้องสื่อความหมาย ไม่ใช่ตกแต่ง** และถ้าเอกสารต้นทางประกาศ `doc-theme` ไว้แล้ว ให้ใช้ค่านั้น ไม่ต้องเลือกสีใหม่รายรูป (ค่าเริ่มต้นคือชุดประจำบ้านใน `polished-document-style` · ความหมายของสีดู `branded-document-design/references/tokens-and-type.md`):
> ไดอะแกรมด่วนใช้ **สีหลักสีเดียว** = "ของที่เรากำลังพูดถึง" · เทา = ระบบภายนอก/ปิดอยู่ · ขาวเส้นเทา (`store`) = ที่เก็บข้อมูล · กล่องอื่นใช้ค่าตั้งต้น (3 คลาส `focus` · `ext` · `store` ใน `assets/mermaid-theme.md`) · ถ้าต้องแยกจุดพัง/ข้อยกเว้น/สำเร็จด้วยสีหลายสี แปลว่าตอบหลายคำถามในรูปเดียว ให้แยกเป็นรูปใหม่หรือใช้ `diagram-figures`

## เมื่อไหร่ใช้ skill นี้

ใน README · Pull Request · โน้ตในโค้ด:

- อธิบายสถาปัตยกรรมระบบ
- อธิบายลำดับการทำงานข้ามหลายส่วน
- อธิบายสถานะของข้อมูล
- ออกแบบฐานข้อมูล
- บอกว่าอะไรรันอยู่บนเครื่องไหน
- รีวิวไดอะแกรมที่คนอื่นวาด

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| เลือกว่าจะใช้ภาพแบบไหน (SVG / ASCII / Mermaid) | `markdown-visuals` |
| ภาพหน้าจอ · wireframe | `ui-craft` + skill แพลตฟอร์ม |
| กราฟข้อมูล | `web-app-design` → `references/tokens.md` หัวข้อ "สีข้อมูล (กราฟ)" |
| ตัดสินใจเลือกสถาปัตยกรรม | `architecture-patterns` |

## 1 · คำถามไหน วาดแบบไหน

**เริ่มจากคำถาม ไม่ใช่เริ่มจากชนิดไดอะแกรม** — คนวาดผิดเพราะเลือกชนิดก่อนแล้วค่อยยัดเนื้อหาลงไป

| คำถามที่ผู้อ่านมีในหัว | ไดอะแกรม |
|---|---|
| "ระบบนี้คุยกับใครข้างนอกบ้าง" | C4 ระดับ 1 — System Context |
| "ข้างในระบบมีอะไรบ้าง รันแยกกันไหม" | C4 ระดับ 2 — Container |
| "ใน service ตัวนี้แบ่งเป็นส่วนอะไร" | C4 ระดับ 3 — Component |
| "กดปุ่มนี้แล้วเกิดอะไรขึ้นบ้าง ตามลำดับ" | Sequence |
| "เอกสารนี้เปลี่ยนสถานะยังไงได้บ้าง" | State |
| "ตารางไหนเชื่อมกับตารางไหน" | Entity Relationship (ER) |
| "ของจริงรันอยู่บนเครื่องอะไร กี่ตัว" | Deployment |
| "ใครอนุมัติต่อจากใคร" | Flowchart (ขั้นตอนงาน) |
| "ผังคลาวด์ใน repo ที่มีโลโก้ AWS / Azure จริง ๆ" | Infrastructure — ข้อ 3 |
| "อยากได้รูปสวย ๆ ไว้ใส่ข้อเสนอลูกค้า" | ไม่ใช่งานของ skill นี้ — `diagram-figures` |

> **C4 model** คือวิธีวาดสถาปัตยกรรมเป็นชั้น ๆ เหมือนซูมแผนที่ —
> ระดับ 1 มองจากนอกระบบ · ระดับ 2 เปิดฝาดูข้างใน · ระดับ 3 ซูมเข้าไปในกล่องเดียว
> **วาดระดับ 1 กับ 2 ให้ครบก่อนเสมอ** ระดับ 3 วาดเฉพาะส่วนที่ซับซ้อนจริง

## 2 · ธีม — ใช้ชุดเดียวทั้งโปรเจกต์

วางบรรทัด `%%{init: ...}%%` ไว้**บรรทัดแรกสุด**ของทุกไดอะแกรม แล้วใช้สีหลักสีเดียวกับ 3 คลาส `focus` · `ext` · `store` ซึ่งสีหลักสงวนไว้ให้ "ของที่เรากำลังพูดถึง" เท่านั้น
บรรทัดธีม ตัวแทนค่าสี คลาส และตัวอย่างที่เรนเดอร์แล้วอยู่ใน [`assets/mermaid-theme.md`](assets/mermaid-theme.md) ส่วนตารางที่จับคู่เนื้องานกับโทนสีอยู่ใน `diagram-figures/references/colour-by-domain.md`

> ⚠️ **`fontFamily` ต้องอยู่นอก `themeVariables`** ถ้าใส่ไว้ข้างใน จะถูกเมินเงียบ ๆ แล้วกลับไปใช้ฟอนต์เริ่มต้นของ Mermaid

**ตรวจด้วยเครื่องก่อนส่งทุกครั้ง** — กฎข้อนี้ถูกลืมบ่อยที่สุด (โปรเจกต์ทดสอบหนึ่งมี 63 จาก 66 รูปที่ไม่มีบรรทัดธีม และไม่มีใครเห็น):

สคริปต์อยู่ในโฟลเดอร์ `scripts/` ของ skill นี้ — รันด้วย path เต็มของสคริปต์ กับโฟลเดอร์ `docs` ของโปรเจกต์ที่ตรวจ (`<path ของ skill>` = โฟลเดอร์ที่ติดตั้ง skill นี้):

```bash
node <path ของ skill>/scripts/check-mermaid-theme.mjs docs          # exit 1 พร้อม ไฟล์:บรรทัด ของบล็อกที่ไม่มี %%{init
node <path ของ skill>/scripts/check-mermaid-theme.mjs --self-test   # พิสูจน์ว่าตัวตรวจยังจับได้
```

agent ที่ไม่มี shell รันเองไม่ได้ → agent หลักรันหลังรับงาน

## 3 · ผังที่ต้องมีโลโก้จริง (infrastructure)

ถ้าผังโครงสร้างพื้นฐานที่อยู่ใน repo ต้องมีไอคอน Amazon Web Services (AWS) · Azure · Kubernetes ของจริง ซึ่ง Mermaid วาดให้ไม่ได้ ให้ใช้ไลบรารี **`diagrams`** (Python + Graphviz) โดยเริ่มจาก [`assets/infra-diagram.py`](assets/infra-diagram.py)
วิธีติดตั้ง กติกา node ที่ใช้บ่อย และกับดักอยู่ใน [`assets/diagrams-python.md`](assets/diagrams-python.md) · ส่วนผังคลาวด์ที่ลูกค้าหรือสไลด์จะเห็น ให้ใช้ `diagram-figures`

## 4 · กฎที่ทำให้อ่านรู้เรื่อง

**ไม่เกิน 7 กล่อง** — เกินนี้คนอ่านเลิกอ่าน (นับกล่องจริง ไม่นับ subgraph)

**นับกล่องก่อนวาด ไม่ใช่หลังวาด** — ถ้าเกิน 7 ให้**แยกรูปตามลำดับเรื่องก่อนวาด** จดการแยกลง `decision-log` แล้วบอกในคำตอบ
ห้ามวาดจนครบแล้วค่อยบอกทีหลัง

```
เนื้อหาที่ให้มามี 20 กล่อง เกินเพดานสามเท่า ขอแยกเป็น 3 รูป:
  รูปที่ 1 — ตอนทดลอง: อะไรเข้า อะไรออก
  รูปที่ 2 — ตอนรันชุดการทดลอง
  รูปที่ 3 — ตอนออกรายงาน
อยากแบ่งแบบอื่น บอกได้ — แยกใหม่ได้
```

> **"แยกคนละไฟล์ก็ได้" แปลว่าต้องแยก** — ถ้าคำขอเปิดช่องให้แยก และเนื้อหาเกินเพดาน
> ให้ถือว่าเป็นคำสั่งให้แยก ไม่ใช่ทางเลือก

**3 อย่างนี้ห้ามอยู่ในไดอะแกรม** — เป็นเนื้อหาของคู่มือ ไม่ใช่รูป และทำให้กล่องบานจนผังเบี้ยว

| ห้ามใส่ | ไปอยู่ที่ไหน |
|---|---|
| ตัวเลือกบรรทัดคำสั่ง `--all` `--resume` `--limit N` | `README` หรือ `docs/cli.md` |
| รายการ input/output ของหลายตัว | **ตารางข้างรูป** — คอลัมน์: ส่วนประกอบ · รับอะไร · ให้อะไร · เก็บที่ไหน |
| ชื่อไฟล์หรือ path ครบทุกตัว | ตารางเดียวกัน ใส่ในรูปเฉพาะตัวที่เป็นใจความ |

**คำขอว่า "บอก input/output ด้วย" ไม่ได้แปลว่าให้วาดทุกอย่างเป็นกล่อง** —
กล่องคือสิ่งที่ *ทำงาน* สิ่งที่ *ไหลผ่าน* เป็นป้ายบนเส้น ส่วน *รายละเอียด* ไปอยู่ในตาราง

**ระดับรายละเอียดเดียวกันทั้งรูป** — มี `PostgreSQL` กับ `OrderRepository.cs` อยู่ในรูปเดียวกัน
คือสัญญาณว่าผสม 2 ระดับ

**ทุกเส้นต้องมีป้าย** และป้ายต้องบอก**อะไรไหลผ่าน** ไม่ใช่ว่าต่อกันอยู่

```
❌ api --> db
❌ api -->|ใช้| db
✅ api -->|SQL · อ่าน-เขียนคำสั่งซื้อ| db
```

**ทิศทางเดียว** — บนลงล่าง (`TB`) หรือซ้ายไปขวา (`LR`) เลือกแล้วอย่าให้มีเส้นวิ่งย้อน
เส้นย้อนแปลว่าเรียงลำดับกล่องผิด ไม่ใช่ว่าต้องวาดลูกศร 2 หัว

**ชื่อกล่อง = สิ่งที่มันทำ ไม่ใช่เทคโนโลยี** เทคโนโลยีใส่บรรทัดที่สองตัวเล็ก

```
❌ [Redis]
✅ ["ที่พักข้อมูลชั่วคราว<br><small>Redis</small>"]
```

**มีคำอธิบายสัญลักษณ์ (legend) เมื่อใช้สีหรือรูปทรงสื่อความหมาย** —
ถ้าอธิบายไม่ได้ว่าทำไมกล่องนี้สีต่าง แปลว่าสีนั้นไม่ควรมี

## 5 · ภาษาไทยในไดอะแกรม

- **ป้ายเส้นภาษาไทยยาวเกิน 3 คำจะทับเส้น** — ตัดให้สั้น หรือใส่ `<br>` เอง
- **ห้ามใช้ `()` `[]` `{}` ในข้อความ** จะไปชนกับไวยากรณ์ Mermaid — ครอบด้วย `"..."` เสมอ
- **วรรณยุกต์ลอยเหนือกล่อง** เมื่อ `fontSize` เล็กกว่า 12px — อย่าลดต่ำกว่านี้
- ชื่อตารางและชื่อฟิลด์ในไดอะแกรม ER ใช้ภาษาอังกฤษ (ตรงกับฐานข้อมูลจริง)
  ส่วนคำอธิบายใช้ไทยได้

## 6 · เรนเดอร์ดูจริง — ห้ามข้าม

ไดอะแกรมที่ไม่เคยเรนเดอร์ยังเป็นแค่ข้อความ ไม่ใช่รูป เพราะไวยากรณ์ผิดบางแบบ Mermaid ไม่แจ้ง error
และบ่อยครั้งวาดออกมาไม่ตรงกับที่คิด

```bash
# ไม่ติดตั้งลงเครื่อง · pin รุ่นที่ทดสอบธีมไว้ (11.17.0 · รุ่นล่าสุด 12.0.0 ณ 2026-10-14 ยังไม่ได้ทดสอบธีม)
npx -y @mermaid-js/mermaid-cli@11.17.0 -i diagram.mmd -o diagram.png -b white -s 2
```

แล้ว**เปิดไฟล์ภาพดูด้วยตา** ไล่ตามนี้:

- [ ] กล่องไม่เกิน 7 ใบใช่ไหม
- [ ] ทุกเส้นมีป้ายไหม และป้ายบอกว่าอะไรไหลผ่านไหม
- [ ] มีเส้นวิ่งย้อนทิศไหม
- [ ] ป้ายทับเส้นหรือทับกล่องไหม
- [ ] ข้อความไทยครบ ไม่มีสระหาย
- [ ] ระดับรายละเอียดเดียวกันทั้งรูป
- [ ] คนที่ไม่เคยเห็นระบบนี้อ่านแล้วตอบคำถามต้นทางได้ไหม

**ข้อจำกัดของ Mermaid ที่ต้องรู้ก่อนเสียเวลา:**

| อาการ | สาเหตุ |
|---|---|
| `direction LR` ใน subgraph ไม่ทำงาน | ถูกเมินเมื่อ subgraph มีเส้นเชื่อมออกนอก — ต้องจัดลำดับกล่องเอา |
| กล่องกว้างผิดปกติ | มีข้อความยาวบรรทัดเดียว — ใส่ `<br>` เอง Mermaid ไม่ตัดบรรทัดให้ |
| เส้นทับกันมั่ว | กล่องเยอะเกินไป — Mermaid ไม่มีการจัดเส้นแบบฉลาด ต้องลดกล่อง |
| ฟอนต์ไม่เปลี่ยน | `fontFamily` อยู่ผิดที่ (ดูข้อ 2) |

ถ้าจัดวางเองไม่ได้ดั่งใจจริง ๆ และรูปยังอยู่ในเอกสาร markdown ให้วาด inline SVG ตาม `markdown-visuals` · ส่วนถ้ารูปต้องดูออกแบบมา ให้ไปที่ `diagram-figures`

## 7 · Anti-patterns

- ❌ **ไดอะแกรมสถาปัตยกรรม 40 กล่อง** — ไม่มีใครอ่าน แยกเป็น C4 หลายระดับ
- ❌ **วาดจนเกินเพดานแล้วค่อยบอก** — ต้องแยกตั้งแต่นับได้ว่าเกิน
- ❌ **ยัดตัวเลือกบรรทัดคำสั่งลงในกล่อง** — กล่องบาน ตัวอักษรเล็ก อ่านไม่ออกทั้งรูป
- ❌ **เส้นไม่มีป้าย** — ผู้อ่านเดาเองว่าอะไรไหลผ่าน แล้วเดาผิด
- ❌ **ผสมระดับรายละเอียด** — `Kubernetes` อยู่ข้าง ๆ `UserService.validate()`
- ❌ **สีรุ้ง** — สีต้องมีความหมาย ไม่ใช่ใส่ให้ไม่น่าเบื่อ
- ❌ **วาดทุกกรณี error ใน sequence เดียว** — วาดทางหลักก่อน แล้วแยกรูปกรณีพิเศษ
- ❌ **ER ที่มีทุกตารางในระบบ** — แยกตามโดเมน
- ❌ **ไดอะแกรมที่ไม่มีวันที่และเจ้าของ** — ผ่านไป 1 ปีไม่มีใครกล้าแก้
- ❌ **ส่งไดอะแกรมโดยไม่เคยเรนเดอร์ดู**
- ❌ **ธีมต่างกันทุกรูปในเอกสารเดียว**

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| เลือกรูปแบบภาพในเอกสาร markdown | `markdown-visuals` |
| เอกสารรอบ ๆ ไดอะแกรม | `polished-document-style` |
| ฝังในไฟล์ Word / PowerPoint | `branded-document-design` |
| ไดอะแกรมในเอกสาร SRS | `srs-writing` |
| เลือกสถาปัตยกรรมก่อนวาด | `architecture-patterns` |
| รูปที่ต้องดูออกแบบมาหรือต้องเซ็นรับ | `diagram-figures` |
| บันทึกเหตุผลที่เลือกแบบนี้ | `adr-writer` |

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`


---

# skill: presentation-design

Use when building a slide deck for any work (pitch, plan, report, training) that someone will present or read. Story, headlines, layouts.

# Presentation Design

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียวของ skill นี้:** หัวสไลด์ต้องเป็น**ข้อสรุป** ไม่ใช่**ชื่อหัวข้อ**
> ถ้าผู้ฟังอ่านแค่หัวสไลด์ทุกแผ่นแล้วเข้าใจเรื่องทั้งหมด แปลว่าเด็คใช้ได้

---

> **สีของเด็ค = สีหลักของโปรเจกต์** หาตามลำดับใน `diagram-figures` ข้อ 5 (`doc-theme` → สีแบรนด์ในโค้ดหรือโลโก้ → ยังไม่มีใช้สีประจำบ้าน `#2A78D6` แล้วเขียน `(รอยืนยัน)`) อย่าเลือกสีใหม่ให้เด็ค
>
> **ไฟล์ที่ส่งมอบ — ต้นแบบคือเด็ค X Fitness Chatbot และเด็ค IS "Few-shot KIE" (.pptx ที่แปลงเป็น .html)**
>
> | ผู้ใช้สั่ง | ได้ไฟล์ | ใช้ |
> |---|---|---|
> | "ทำ slide deck" · "ทำสไลด์" · "ทำ presentation" (ไม่ระบุชนิด) | **.pptx** | `branded-document-design` · `StageDeck` |
> | "slide deck html" · "เด็ค html" · "มี animation" · "นำเสนอจากเบราว์เซอร์" | **.html ไฟล์เดียว พร้อม animation** | `html-slide-deck` |
> | มี .pptx อยู่แล้ว · "แปลง pptx เป็น html" · "animation แบบเด็ค IS" · มี .pptx แล้วอยากได้หน้าโต้ตอบหรือเปิดทีละคลิก | **.html ไฟล์เดียว หน้าตาเหมือน .pptx ทุกหน้า** | `pptx-to-html-deck` |
> | ขอทั้ง 2 | .pptx + .html จากต้นฉบับเดียว | สร้าง .pptx ด้วย `StageDeck` แล้วแปลงด้วย `pptx-to-html-deck` — หน้าตาตรงกันทุกหน้า แก้ที่ .pptx ที่เดียว |
>
> ไม่ถามซ้ำว่าจะเอาชนิดไหน — ไม่ระบุ = .pptx · ท้ายคำตอบบอก 1 บรรทัดว่าทำแบบ .html มี animation ได้ด้วย
>
> **สไตล์เริ่มต้นของเด็คที่ใช้พูด = "Stage"** (`branded-document-design` · `brandkit_stage.py`) — โครงหน้าและตัวอักษรตามต้นแบบ ส่วน**สีพื้นกับสีหลักมาจากดีไซน์ของโปรเจกต์** พื้นเข้มหรือสว่างตามที่โปรเจกต์ออกแบบไว้ สีหลักใช้กับสิ่งที่ต้องการให้มองเท่านั้น และรูปผังจาก `diagram-figures` เรนเดอร์ด้วยสีพื้นเดียวกับเด็ค (`#bg=`)

## เมื่อไหร่ใช้ skill นี้

- ทำเด็คนำเสนอ — ข้อเสนอลูกค้า · แผนธุรกิจ · สรุปงานวิจัย · รายงานความคืบหน้า · อบรม · รีวิวออกแบบ
- รีวิวเด็คที่คนอื่นทำ
- แปลงเอกสารยาวเป็นเด็ค

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| สร้างไฟล์ `.pptx` จริง (python-pptx, ฟอนต์, หน้าปก) | `branded-document-design` |
| ชุดสีของกราฟ | `diagram-figures` → `references/colour-by-domain.md` (หน้าจอแอป: `web-app-design` ใน plugin `software-company` → `references/tokens.md` "สีข้อมูล (กราฟ)") |
| เอกสารที่อ่านเอง ไม่มีคนพูด | `polished-document-style` + `branded-document-design` |
| ผัง ขั้นตอน หรือสถาปัตยกรรมในสไลด์ | `diagram-figures` (ซอฟต์แวร์ใช้ `software-diagrams` (plugin `software-company`) ได้) |

> **เด็คที่ส่งให้อ่านเอง ไม่ใช่เด็ค** — เป็นเอกสาร ให้ทำเป็นเอกสาร
> ถ้าต้องทำทั้ง 2 อย่าง ให้ทำเด็คสำหรับพูด แล้วแนบเอกสารแยก อย่ายัดทุกอย่างลงสไลด์

---

## 1 · ลำดับการทำงาน — เขียนเรื่องก่อนเปิดโปรแกรม

1. **เขียนหัวสไลด์ทุกแผ่นเป็นข้อความธรรมดาก่อน** บรรทัดละแผ่น
2. **อ่านเรียงกันทั้งหมด** — ถ้ายังไม่เป็นเรื่องเดียวกัน ให้สลับลำดับตรงนี้ เพราะถูกกว่าไปสลับทีหลังมาก
3. **ตัดแผ่นที่ไม่ได้ขยับเรื่องให้ไปข้างหน้า**
4. **เลือกเลย์เอาต์ให้แต่ละแผ่น** จากข้อ 4
5. **ใส่เนื้อหา** แล้วตัดคำตามงบในข้อ 3
6. **เรนเดอร์ดูเป็นภาพย่อทั้งเด็ค** ตามข้อ 7

ขั้นที่ 1–3 ใช้เวลาไม่ถึง 20 นาที และเป็นขั้นที่ตัดสินว่าเด็คดีหรือไม่ดี
คนส่วนใหญ่ข้ามไปเปิดโปรแกรมเลย แล้วเสียเวลาจัดหน้าให้เรื่องที่ยังเรียงผิด

---

## 2 · ลำดับเรื่องตามจุดประสงค์

**ถามก่อนว่าเด็คนี้ต้องการอะไรจากผู้ฟัง** แล้วเลือกลำดับ

| จุดประสงค์ | ลำดับ |
|---|---|
| **ขออนุมัติ / ตัดสินใจ** | ข้อสรุปและสิ่งที่ขอ → เหตุผล 3 ข้อ → ทางเลือกที่พิจารณาแล้ว → ความเสี่ยง → สิ่งที่ขออีกครั้ง |
| **รายงานความคืบหน้า** | สถานะรวม (เขียว/เหลือง/แดง) → ทำอะไรเสร็จ → ติดอะไร ต้องการอะไรจากใคร → แผนรอบหน้า |
| **รีวิวแผนหรืองานออกแบบ** | ปัญหาที่แก้ → ข้อจำกัด → แบบที่เลือก → ที่ไม่เลือกเพราะอะไร → ประเด็นที่อยากได้ความเห็น |
| **อบรม** | ทำอะไรได้หลังเรียน → แนวคิด → สาธิต → ให้ลองทำ → สรุปและที่ค้นต่อ |
| **ขายงาน** | ปัญหาของลูกค้า (ด้วยคำของเขา) → ผลที่จะได้ → วิธีของเรา → หลักฐาน → ราคาและขั้นต่อไป |

**สำหรับผู้บริหาร: ข้อสรุปอยู่แผ่นแรก** ไม่ใช่แผ่นสุดท้าย
เขาอาจมีเวลาแค่ 5 นาทีแรก และอาจตัดสินใจได้เลยถ้าข้อมูลพอ

---

## 3 · หนึ่งแผ่น หนึ่งความคิด

### หัวสไลด์คือข้อสรุป

```
❌ ผลการวิเคราะห์เวลาดำเนินการ
✅ ขั้นอนุมัติกินเวลาสองในสามของทั้งหมด

❌ สถานะโครงการ
✅ ส่งทันกำหนด ยกเว้นงานเชื่อมระบบบัญชีที่ช้า 1 สัปดาห์
```

หัวสไลด์ยาวได้ถึง 2 บรรทัด **อย่าย่อจนกลายเป็นชื่อหัวข้อ** และอย่าย่อจนอ่านไม่ลื่น: หัวที่มี 2 ท่อนต้องมีคำเชื่อม ใช้วลีที่คนพูดจริง และเลือกคำตามคนฟัง (กฎเต็มอยู่ใน `human-writing` หัวข้อ 6)

```
❌ ทุกข้อความผ่าน 8 ขั้น: Artificial Intelligence (AI) ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ
✅ ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน
```

### งบตัวอักษรต่อแผ่น

| ของ | ไม่เกิน |
|---|---|
| หัวสไลด์ | 2 บรรทัด |
| บูลเล็ต | 5 ข้อ |
| คำต่อบูลเล็ต | 12 คำ |
| คำทั้งแผ่น | ~50 คำ |

**ถ้าเกินงบให้แยกเป็น 2 แผ่น** เพราะสไลด์ไม่มีค่าใช้จ่ายต่อแผ่น เวลาพูดต่างหากที่มีจำกัด

**บูลเล็ตต้องเป็นใจความ ไม่ใช่ประโยคเต็ม** — ถ้าเขียนเต็มประโยค ผู้ฟังจะอ่านแทนที่จะฟัง
(คนอ่านเร็วกว่าคนพูด ผู้ฟังจะอ่านจบก่อนแล้วเลิกสนใจ)

---

## 4 · หกเลย์เอาต์ที่พอสำหรับเกือบทุกเด็ค

ภาพรวมทั้ง 6 แบบอยู่ที่ `assets/slide-mockup-preview.webp` · ไฟล์ `assets/slide-mockup.html` มีครบ 6 แบบ **เรนเดอร์ที่ 1280×720 และเปิดตรวจด้วยตาแล้ว**
เปิดในเบราว์เซอร์เพื่อดูของจริง หรือใช้เป็นต้นแบบตอนสร้าง `.pptx`

| # | เลย์เอาต์ | ใช้เมื่อ |
|---|---|---|
| 1 | **ปก** — หัวใหญ่ + เส้นคั่น + คำอธิบาย | แผ่นแรก |
| 2 | **หัวข้อ + บูลเล็ต + แถบข้าง** | เนื้อหาทั่วไป โดยแถบข้างใส่ที่มาของตัวเลข |
| 3 | **ตัวเลข 3 ช่อง** | ผลลัพธ์ · ตัวชี้วัด · ก่อน-หลัง |
| 4 | **กราฟ + คำอธิบายข้างกราฟ** | สไลด์ข้อมูล |
| 5 | **คั่นบท** — พื้นเข้มเต็มแผ่น | ขึ้นส่วนใหม่ · ให้ผู้ฟังพัก |
| 6 | **ข้อความเดียวกลางแผ่น** | สิ่งที่ขอ · ข้อสรุป · คำพูดลูกค้า |

**กฎของแถบข้าง (แบบ 2 และ 4):** ใส่สิ่งที่ผู้ฟัง**อาจถาม** — ที่มาของตัวเลข วิธีอ่านกราฟ
ข้อจำกัดของข้อมูล ไม่ใช่เนื้อหาเพิ่ม

**ทุกแผ่นมีท้ายกระดาษเหมือนกัน** — ชื่อส่วนซ้าย เลขหน้าขวา
เลขหน้าสำคัญกว่าที่คิด เพราะผู้ฟังอ้างถึงได้ว่า "ขอย้อนกลับแผ่น 9"

---

## 5 · ขนาดตัวอักษร

สไลด์ 16:9 กว้าง 13.333 นิ้ว = **960 pt** ในโปรแกรมทำสไลด์ และเท่ากับ 1280 px ในเบราว์เซอร์
แปลงกัน **1 px = 0.75 pt**

| ของ | ใน mockup | ในไฟล์ .pptx |
|---|---|---|
| หัวปก | 54 px | **40 pt** |
| ตัวเลขใหญ่ | 46 px | **34 pt** |
| หัวสไลด์ | 34 px | **26 pt** |
| บูลเล็ต | 24 px | **18 pt** |
| คำอธิบาย | 22 px | **17 pt** |
| แถบข้าง | 19 px | **14 pt** |
| คำนำหัว · ป้าย | 16 px | **12 pt** |
| ท้ายกระดาษ | 14 px | **11 pt** |
| ขอบกระดาษ | 64 px | **48 pt** (0.67 นิ้ว) |

**ข้อยกเว้นของเด็ค Stage:** บรรทัด "ตัวอย่าง" · คำขยายในตารางขั้นตอน · ถาม/ตอบใต้ตัวเลข ใช้ 12–14 pt ได้ เพราะเป็นของที่ผู้ฟังอ่านทีหลัง หัวสไลด์ ชื่อขั้น และใจความหลักยังต้อง ≥ 18 pt

**18 pt คือขนาดเล็กสุดของเนื้อหาในห้องประชุม** ต่ำกว่านี้คนแถวหลังอ่านไม่ออก
ถ้าเนื้อหาไม่พอดีที่ 18 pt ปัญหาคือเนื้อหาเยอะไป ไม่ใช่ตัวอักษรใหญ่ไป
**ห้ามลดขนาดเพื่อให้เนื้อหาพอดี** ให้ตัดเนื้อหาแทน

**ใช้ 2 น้ำหนักพอ** (ปกติ + หนา) และหัวสไลด์ควรหนา ตัวเนื้อหาไม่ควรหนา

---

## 6 · สไลด์ข้อมูล

**1 กราฟ 1 ข้อสรุป** — ถ้ากราฟบอก 2 เรื่อง ให้แยกเป็น 2 แผ่น

- **หัวสไลด์คือข้อสรุปจากกราฟ** ไม่ใช่ชื่อกราฟ
- **เน้นแท่ง/เส้นที่เป็นประเด็นด้วยสีแบรนด์ ที่เหลือเป็นสีเทา**
  แค่สีก็บอกประเด็นได้เองโดยไม่ต้องมีคำอธิบาย
- **ติดตัวเลขไว้บนแท่งเลย** อย่าให้ผู้ฟังกวาดตาไปอ่านแกน
- **ตัดเส้นตาราง แกนที่ไม่จำเป็น และคำอธิบายสัญลักษณ์** ถ้าติดป้ายตรงข้อมูลได้แล้ว
- **บอกที่มาของข้อมูลเสมอ** — ช่วงเวลา จำนวนตัวอย่าง แหล่ง (ใส่ในแถบข้างหรือท้ายกระดาษ)
- **ตารางที่เกิน 5 แถว 4 คอลัมน์ไม่ควรอยู่ในสไลด์** ให้ทำเป็นกราฟ หรือย้ายไปเอกสารแนบ

ชุดสีของกราฟในสไลด์มาจาก `diagram-figures` → `references/colour-by-domain.md` · กราฟที่ต้องใช้ร่วมกับหน้าจอแอปดู `web-app-design` (plugin `software-company`) → `references/tokens.md` "สีข้อมูล (กราฟ)"

---

## 7 · ตรวจงาน

### ดูเป็นภาพย่อทั้งเด็ค

เปิดมุมมองเรียงสไลด์ (slide sorter) หรือเรนเดอร์ทุกแผ่นเป็นภาพแล้ววางเรียงกัน

- [ ] อ่านแค่หัวสไลด์ทุกแผ่น เข้าใจเรื่องทั้งหมดไหม
- [ ] มีแผ่นไหนดูแน่นผิดจากเพื่อนไหม (= เกินงบตัวอักษร)
- [ ] ขอบกระดาษตรงกันทุกแผ่นไหม
- [ ] หัวสไลด์อยู่ตำแหน่งเดียวกันทุกแผ่นไหม

### การทดสอบสามเมตร

ย่อสไลด์เหลือ 25% แล้วมองห่าง ๆ ถ้าอ่านหัวสไลด์ไม่ออก คนแถวหลังก็อ่านไม่ออก

### ไล่รายแผ่น

- [ ] หัวสไลด์เป็นข้อสรุป ไม่ใช่ชื่อหัวข้อ
- [ ] ไม่เกิน 5 บูลเล็ต บูลเล็ตละไม่เกิน 12 คำ
- [ ] ตัวอักษรเล็กสุดในเนื้อหา ≥ 18 pt
- [ ] กราฟทุกอันมีข้อสรุปและที่มาของข้อมูล
- [ ] ทุกแผ่นมีเลขหน้า
- [ ] เปิดบนโปรเจกเตอร์จริงหรือจอที่จะใช้จริงแล้วอย่างน้อย 1 ครั้ง

---

## 8 · ภาษาไทยบนสไลด์

- **ความสูงบรรทัดอย่างน้อย 1.4** สำหรับหัวสไลด์ และ **1.5** สำหรับเนื้อหา
  เพราะถ้าต่ำกว่านี้ สระบนกับสระล่างของ 2 บรรทัดจะชนกัน
- **หัวสไลด์ภาษาไทยที่ยาว ให้ตัดบรรทัดเอง** ตรงจุดที่จบใจความ
  อย่าปล่อยให้โปรแกรมตัด เพราะภาษาไทยไม่มีช่องว่างระหว่างคำ โปรแกรมจึงตัดกลางคำ
- **ฟอนต์ที่มีทั้งน้ำหนักปกติและหนาจริง** — ตัวหนาปลอมที่โปรแกรมสร้างเองทำให้สระเบลอ
- **ไทยปนอังกฤษในบรรทัดเดียวกัน ให้ใช้ฟอนต์ตระกูลเดียวที่มีทั้งสองภาษา**
  ไม่งั้นความสูงตัวอักษรไม่เท่ากันแล้วบรรทัดดูเอียง
- การตั้งค่าฟอนต์ในไฟล์ `.pptx` จริง (รวมปัญหา complex script) อยู่ใน `branded-document-design`

---

## 9 · Anti-patterns

- ❌ **หัวสไลด์เป็นชื่อหัวข้อ** — "ภาพรวมระบบ" ไม่ได้บอกอะไรเลย
- ❌ **หัวสไลด์ย่อจนต้องเดา** — 2 วลีวางเรียงกันโดยไม่มีคำเชื่อม หรือใช้ศัพท์ที่คนฟังไม่รู้ ("Guard" · "โค้ด") กับผู้ฟังทั่วไป
- ❌ **สไลด์เป็นเอกสาร** — ย่อหน้าเต็มแผ่น ตัวอักษร 12 pt
- ❌ **อ่านสไลด์ให้ผู้ฟังฟัง** — ถ้าทุกคำอยู่บนจอแล้ว ไม่ต้องมีคนพูด
- ❌ **ลดขนาดตัวอักษรเพื่อให้เนื้อหาพอดี** — ให้ตัดเนื้อหาแทน
- ❌ **บูลเล็ตซ้อน 3 ชั้น** — มากสุดคือ 2 ชั้น ถ้าถึง 3 ชั้นแปลว่าควรแยกแผ่น
- ❌ **แอนิเมชันเข้าทีละบูลเล็ตทุกแผ่น** — ช้า และผู้ฟังรำคาญตั้งแต่แผ่นที่ 3
- ❌ **ภาพสต๊อกที่ไม่เกี่ยวกับเนื้อหา** — คนจับมือกัน ลูกศรพุ่งขึ้น
- ❌ **ตารางข้อมูล 15 แถวบนสไลด์** — ย้ายไปเอกสารแนบ
- ❌ **กราฟที่คัดลอกจาก Excel มาทั้งดุ้น** พร้อมเส้นตารางและคำอธิบายครบ
- ❌ **สีแบรนด์บนทุกอย่าง** — สีแบรนด์ใช้กับสิ่งที่ต้องการให้มองเท่านั้น
- ❌ **ไม่มีเลขหน้า** — ผู้ฟังอ้างถึงแผ่นไม่ได้
- ❌ **ส่งเด็คโดยไม่เคยดูเป็นภาพย่อทั้งชุด**

---

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| สร้างไฟล์ `.pptx` จริง | `branded-document-design` |
| เด็ค .html ไฟล์เดียว นำเสนอจากเบราว์เซอร์ (เมนู · โน้ต · นาฬิกา · คลิกดูรายละเอียด) | `html-slide-deck` |
| แปลง .pptx เป็น .html มี animation · เปิดทีละคลิก · แทรกหน้าโต้ตอบ | `pptx-to-html-deck` |
| ชุดสีของกราฟ | สีหลักของงาน + สีรองตาม `diagram-figures` → `references/colour-by-domain.md` (หน้าจอแอป: `web-app-design` ใน plugin `software-company`) |
| ผังในสไลด์ | `diagram-figures` (ซอฟต์แวร์ใช้ `software-diagrams` (plugin `software-company`) ได้) |
| กฎระยะห่างและลำดับสายตา (หน้าจอแอป) | `ui-craft` (plugin `software-company`) |
| เนื้อหามาจากเอกสาร Software Requirements Specification (SRS) | `srs-writing` (plugin `software-company`) |
| ตัดเนื้อหาให้เหลือเท่าที่จำเป็น | `simplicity-first` (plugin `software-company`) |
| ระบบสีและตัวอักษรของแบรนด์ · ภาพประกอบ | `graphic-design` (plugin `software-company`) |

---

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`
