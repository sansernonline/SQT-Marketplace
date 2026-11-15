# skill: markdown-visuals

Use when a Markdown doc needs an image, SVG or ASCII art

# Markdown Visuals

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

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

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น ส่วนถ้ายังไม่มี ให้ค้นต้นแบบตาม `design-references` (plugin `superuser`) ประเภท `document` แล้วถอดสีจากงานที่เลือก · ค้นสดไม่ได้จึงใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม (ลำดับใน `diagram-figures` ข้อ 5 · ตารางโทนตามเนื้องาน [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) ส่วน token ตามหน้าที่ (`bg-canvas` · `accent-primary` · `state-*` …) ดูได้ใน [references/svg-snippets.md](references/svg-snippets.md) และ **1 เอกสารใช้ชุดสีเดียว**

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

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams` (plugin `software-development`) ข้อ 1–5 และ `assets/mermaid-theme.md`** · Mermaid ในเอกสารโปรเจกต์ที่ต้องแปลงเป็นรูปลง Word ใช้ตัวแปลงใน `diagram-figures` → `references/engine-mermaid.md`
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

- **Text-only design docs** — "the icon is in the top-right" with no picture
- **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- **PNG screenshots of text** — use the text, in a code block
- **Inline `<svg>` in a doc read on GitHub** — GitHub drops it; save as `docs/figures/x.svg` and use `![alt](figures/x.svg)` · a `.svg` file without `xmlns` also fails
- **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- **ASCII art outside a code fence** — proportional fonts will mangle alignment
- **Mermaid syntax newer than the viewer** — GitHub's Mermaid version changes; check it with a ```` ```mermaid ```` block containing `info` before using new diagram types
- **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

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
- `simplicity-first` (plugin `software-development`) — don't over-design the diagram; show what's needed
- `software-diagrams` (plugin `software-development`) — which diagram type answers which question, plus the shared Mermaid theme
- `diagram-figures` — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- `ui-craft` (plugin `software-development`) — spacing, hierarchy and states when the picture is a screen

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ทุกงานต้องผ่านด่านตา 3.2 ด้วย (หน้าเว็บตอบเพิ่มข้อ 10–14) เพราะสคริปต์ 0 ข้อยังไม่ใช่ผ่าน · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

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

Use when a README or PR needs a quick Mermaid diagram

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

> ระวัง: **`fontFamily` ต้องอยู่นอก `themeVariables`** ถ้าใส่ไว้ข้างใน จะถูกเมินเงียบ ๆ แล้วกลับไปใช้ฟอนต์เริ่มต้นของ Mermaid

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
ผิด: api --> db
ผิด: api -->|ใช้| db
ถูก: api -->|SQL · อ่าน-เขียนคำสั่งซื้อ| db
```

**ทิศทางเดียว** — บนลงล่าง (`TB`) หรือซ้ายไปขวา (`LR`) เลือกแล้วอย่าให้มีเส้นวิ่งย้อน
เส้นย้อนแปลว่าเรียงลำดับกล่องผิด ไม่ใช่ว่าต้องวาดลูกศร 2 หัว

**ชื่อกล่อง = สิ่งที่มันทำ ไม่ใช่เทคโนโลยี** เทคโนโลยีใส่บรรทัดที่สองตัวเล็ก

```
ผิด: [Redis]
ถูก: ["ที่พักข้อมูลชั่วคราว<br><small>Redis</small>"]
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

- **ไดอะแกรมสถาปัตยกรรม 40 กล่อง** — ไม่มีใครอ่าน แยกเป็น C4 หลายระดับ
- **วาดจนเกินเพดานแล้วค่อยบอก** — ต้องแยกตั้งแต่นับได้ว่าเกิน
- **ยัดตัวเลือกบรรทัดคำสั่งลงในกล่อง** — กล่องบาน ตัวอักษรเล็ก อ่านไม่ออกทั้งรูป
- **เส้นไม่มีป้าย** — ผู้อ่านเดาเองว่าอะไรไหลผ่าน แล้วเดาผิด
- **ผสมระดับรายละเอียด** — `Kubernetes` อยู่ข้าง ๆ `UserService.validate()`
- **สีรุ้ง** — สีต้องมีความหมาย ไม่ใช่ใส่ให้ไม่น่าเบื่อ
- **วาดทุกกรณี error ใน sequence เดียว** — วาดทางหลักก่อน แล้วแยกรูปกรณีพิเศษ
- **ER ที่มีทุกตารางในระบบ** — แยกตามโดเมน
- **ไดอะแกรมที่ไม่มีวันที่และเจ้าของ** — ผ่านไป 1 ปีไม่มีใครกล้าแก้
- **ส่งไดอะแกรมโดยไม่เคยเรนเดอร์ดู**
- **ธีมต่างกันทุกรูปในเอกสารเดียว**

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

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ทุกงานต้องผ่านด่านตา 3.2 ด้วย (หน้าเว็บตอบเพิ่มข้อ 10–14) เพราะสคริปต์ 0 ข้อยังไม่ใช่ผ่าน · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ ดูรายละเอียดใน skill `spell-out-abbreviations`


---

# skill: presentation-design

Use when planning a slide deck story and layouts

# Presentation Design

> **Pre-work gate (every time):** read the owner's theme → search live for a reference → 3 genuinely different directions → check `no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search is for finding this piece's structure). Close the work with a line `ด่านก่อนลงมือ:` (pre-work gate:).

> **Language:** write every line of wording per `human-writing`. This skill gives the format and structure; human-writing gives the way to write so people understand.

> **The one rule of this skill:** a slide title must be a **conclusion**, not a **topic name**.
> If the audience reads only the slide titles of every slide and understands the whole story, the deck is usable.

---

> **The deck must be bright and look like it came from the source work.** Extract colours from the source work (the file, logo or website the user gave) with `scripts/source_palette.py` first · if the source has no colour, use the project's colour per `diagram-figures` item 5 · choose the deck's mood from the content · light background by default, and section-change pages are full-slide main colour · all rules are in [`deck-theme`](references/deck-theme.md), the central file for every slide skill · only when live search is really not possible, use the house colour `#2A78D6` and write `(รอยืนยัน)` (to be confirmed) · if the work already has colours, do not pick new colours for the deck.
>
> **Delivered file: the models are the X Fitness Chatbot deck and the IS "Few-shot KIE" deck (.pptx converted to .html)**
>
> | User asks | Gets file | Use |
> |---|---|---|
> | "ทำ slide deck" · "ทำสไลด์" · "ทำ presentation" (type not stated) | **.pptx** | `branded-document-design` · `StageDeck` |
> | "slide deck html" · "เด็ค html" · "มี animation" · "นำเสนอจากเบราว์เซอร์" | **One .html file with animation** | `html-slide-deck` |
> | Already has a .pptx · "แปลง pptx เป็น html" · "animation แบบเด็ค IS" · has a .pptx and wants interactive pages or click-by-click reveal | **One .html file that looks like the .pptx on every page** | `html-slide-deck` (`references/from-pptx.md`) |
> | Asks for both | .pptx + .html from one source | Build the .pptx with `StageDeck`, then convert it with the .pptx entry of `html-slide-deck`. The look matches on every page; edit the .pptx in one place |
>
> Do not ask again which type they want: not stated = .pptx · at the end of the answer, say in 1 line that an .html version with animation is possible too
>
> **Choose the deck's style in this order and stop at the first hit:** the source work being turned into a deck → the design the project already has → a reference the user attached → direction from research (item 1 step 0) → the house default "Stage" (`branded-document-design` · `brandkit_stage.py`). **Stage is the fallback when there is no information at all, not the answer for every deck.** Two decks for different work should look different. Page structure and the text budget still follow this skill, while background colour · fonts · density · image style change with the chosen direction. Diagram figures from `diagram-figures` are rendered with the same background colour as the deck (`#bg=`)

## When to use this skill

- Making a presentation deck: client proposal · business plan · research summary · progress report · training · design review
- Reviewing a deck someone else made
- Converting a long document into a deck

## When **not** to use

| Task | Use this instead |
|---|---|
| Creating a real `.pptx` file (python-pptx, fonts, cover page) | `branded-document-design` |
| Chart colour palette | `diagram-figures` → `references/colour-by-domain.md` (app screens: `web-app-design` in plugin `software-development` → `references/tokens.md` "สีข้อมูล (กราฟ)" (data colours, charts)) |
| A document read alone, with no one speaking | `polished-document-style` + `branded-document-design` |
| Diagrams, processes or architecture on a slide | `diagram-figures` (for software, `software-diagrams` (plugin `software-development`) works too) |

> **A deck sent to be read alone is not a deck.** It is a document; make it a document.
> If you must do both, make a deck for speaking and attach a separate document. Do not stuff everything onto slides.

---

## 1 · Work order: research first, then write the story before opening the program

0. **2 kinds of research, done only for what is missing, not for every deck**
   - **Content.** The deck must cite facts, numbers, a market, competitors, or something we are not strong in → collect facts with sources per `research-with-sources` (plugin `superuser`) before writing slide titles · a slide title that is a conclusion must stand on real facts, not the model's memory
   - **Theme from the source work.** Do this for every deck: run `python scripts/source_palette.py <source file>` to get colours, then choose the mood from the table in [`deck-theme`](references/deck-theme.md) item 2 · write the head-of-work line: which file the colour came from · which mood row · light or dark background
   - **Visual direction.** Search for every deck per the pre-work gate · if the source work has colours, the project has a design, or the user attached a reference → use that for colour and fonts, and search only for page structure and storytelling · if there is nothing at all → **search for a reference first:** take the project's words and search live per `design-references` (plugin `superuser`), type `slide`, then extract colours from the chosen work · the stored colour library is used when live search is not possible · pick 2–3 decks of the same kind of work (pitches in the same field · events on the same stage · competitors') and choose 1 direction: light or dark background · font · density · image style · write a 1-line reason with the sources you looked at at the head of the work. **This direction belongs to this deck alone, not a permanent value.** The next deck must not start from the previous deck's direction without checking whether the work differs
1. **Write every slide title as plain text first**, one line per slide
2. **Read them all in order.** If they do not yet form one story, reorder here, because it is much cheaper than reordering later
3. **Cut slides that do not move the story forward**
4. **Choose a layout for each slide** from item 4
5. **Put in content,** then trim bullets to fit the line budget in item 3
6. **Render and view as thumbnails of the whole deck** per item 7

Steps 1–3 take under 20 minutes and decide whether the deck is good or bad.
Most people skip them and open the program straight away, then waste time laying out a story that is still in the wrong order.

---

## 2 · Order the story by purpose

**First ask what this deck needs from the audience,** then choose the order

| Purpose | Order |
|---|---|
| **Ask for approval / a decision** | Conclusion and the ask → 3 reasons → alternatives considered → risks → the ask again |
| **Progress report** | Overall status (green/yellow/red) → what is done → what is blocked and what is needed from whom → next period's plan |
| **Review a plan or design** | Problem solved → constraints → chosen design → why others were not chosen → points where you want opinions |
| **Training** | What they can do after learning → concepts → demo → let them try → summary and what to study next |
| **Selling work** | Customer's problem (in their words) → results they will get → our method → evidence → price and next step |

**For executives: the conclusion goes on the first slide,** not the last.
They may have only the first 5 minutes, and may decide on the spot if the information is enough.

---

## 3 · One slide, one idea

### The slide title is the conclusion

```
ผิด: ผลการวิเคราะห์เวลาดำเนินการ
ถูก: ขั้นอนุมัติกินเวลาสองในสามของทั้งหมด

ผิด: สถานะโครงการ
ถูก: ส่งทันกำหนด ยกเว้นงานเชื่อมระบบบัญชีที่ช้า 1 สัปดาห์
```

A slide title may run up to 2 lines. **Do not shorten it into a topic name,** and do not shorten it until it reads badly: a title with 2 parts needs a connector, use phrases people actually say, and choose words by who is listening (full rules in `human-writing` item 6)

```
ผิด: ทุกข้อความผ่าน 8 ขั้น: Artificial Intelligence (AI) ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ
ถูก: ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน
```

### Budget per slide, counted in lines

| Item | At most |
|---|---|
| Slide title | 2 lines |
| Bullets | 6 items |
| Lines per bullet | 2 lines |

Thai words cannot be counted, so count lines on the real slide instead.

**If over budget, cut whole bullets or move them to the next slide,** because slides cost nothing per page; speaking time is what is limited · **never cut function words** (จะ ให้ ก็ แล้ว, polite words) to make a line fit; cut only items (the rule "cut items, not function words" is in `human-writing` item 3)

**Bullets must be gist, not full sentences.** If written as full sentences, the audience reads instead of listening
(people read faster than a speaker talks; the audience finishes reading first and then loses interest).

---

## 4 · Six layouts that are enough for almost every deck

An overview of all 6 is at `assets/slide-mockup-preview.webp` · the file `assets/slide-mockup.html` has all 6 **rendered at 1280×720 and checked by eye**.
Open it in a browser to see the real thing, or use it as the model when building a `.pptx`.

| # | Layout | Use when |
|---|---|---|
| 1 | **Cover**: big title + divider line + description | First slide |
| 2 | **Title + bullets + side strip** | General content, with the side strip holding the source of the numbers |
| 3 | **3 number boxes** | Results · metrics · before-after |
| 4 | **Chart + explanation beside the chart** | Data slides |
| 5 | **Chapter divider**: solid main-colour fill, full slide (a dark deck may use a dark fill) | Starting a new section · giving the audience a break |
| 6 | **One statement in the middle of the slide** | The ask · conclusion · customer quote |

**Side strip rule (layouts 2 and 4):** put what the audience **might ask**: the source of the numbers, how to read the chart,
limits of the data. Not extra content.

**Every slide has the same footer:** section name on the left, page number on the right.
Page numbers matter more than you think, because the audience can say "ขอย้อนกลับแผ่น 9" (please go back to slide 9).

---

## 5 · Text size

A 16:9 slide 13.333 inches wide = **960 pt** in slide software, and equals 1280 px in a browser.
Conversion: **1 px = 0.75 pt**

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

**Exception for the Stage deck:** the "ตัวอย่าง" (example) line · the sub-text in a process table · Q/A under numbers may use 12–14 pt, because the audience reads them later. Slide titles, step names and the main gist must still be ≥ 18 pt.

**18 pt is the smallest content size in a meeting room.** Below it, people in the back row cannot read.
If the content does not fit at 18 pt, the problem is too much content, not text that is too big.
**Never reduce the size to make content fit.** Cut content instead.

**2 weights are enough** (regular + bold). Slide titles should be bold; body text should not.

---

## 6 · Data slides

**1 chart, 1 conclusion.** If a chart says 2 things, split it into 2 slides.

- **The slide title is the conclusion from the chart,** not the chart's name
- **Highlight the bar/line that is the point with the brand colour, and make the rest grey.**
  Colour alone says the point with no explanation needed
- **Put the numbers on the bars directly.** Do not make the audience sweep their eyes over to read the axis
- **Remove gridlines, unnecessary axes and the legend** if you can label the data directly
- **Always state the data source:** period, sample size, source (put it in the side strip or footer)
- **A table over 5 rows by 4 columns should not be on a slide.** Make it a chart, or move it to an attachment

The chart colour palette in slides comes from `diagram-figures` → `references/colour-by-domain.md` · for charts that must also be used with app screens, see `web-app-design` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" (data colours, charts)

---

## 7 · Check the work

### View the whole deck as thumbnails

Open the slide sorter view, or render every slide as an image and lay them out together.

- [ ] Reading only the slide titles of every slide, do you understand the whole story?
- [ ] Is any slide visibly denser than the others (= over the text budget)?
- [ ] Do the page margins match on every slide?
- [ ] Is the slide title in the same position on every slide?

### The three-metre test

Shrink the slide to 25% and look from a distance. If you cannot read the slide title, the back row cannot either.

### Go through slide by slide

- [ ] The slide title is a conclusion, not a topic name
- [ ] No more than 6 bullets, each no more than 2 lines on the real slide (per the table "Budget per slide"; Thai words cannot be counted)
- [ ] Smallest text in the content ≥ 18 pt
- [ ] Every chart has a conclusion and a data source
- [ ] Every slide has a page number
- [ ] Opened on the real projector or the screen that will actually be used, at least once

---

## 8 · Thai on slides

- **Line height at least 1.4** for slide titles and **1.5** for body text,
  because below that, the upper vowels and lower vowels of 2 lines collide (the middle value is in `human-writing` `references/thai-line-breaking.md`)
- **For a long Thai slide title, break the line yourself** at the point where the thought ends.
  Do not let the program break it, because Thai has no spaces between words and the program breaks mid-word
- **A font with both a real regular and a real bold weight.** A fake bold generated by the program blurs the vowels
- **Thai mixed with English on the same line: use one font family that has both languages.**
  Otherwise letter heights differ and the line looks tilted
- Font settings in a real `.pptx` file (including the complex script problem) are in `branded-document-design`

---

## 9 · Anti-patterns

A list of 13 common ones (slide title is a topic name · slide is a document · shrinking text to fit · no page numbers, etc.) is in [`anti-patterns`](references/anti-patterns.md). Open it when checking item 7.

**Things that make a deck look off-the-shelf: avoid** (idea from anthropics/skills pptx): a colour line under the title of every slide · cream/beige background as the default · the same 3-column icons on every slide · gradient text · long centred paragraphs

**Flat decks: avoid:** dark or all-white background across the whole deck when the source work is vividly coloured · the main colour appearing only as thin lines · more than 3 text-only slides in a row · colours not in the source work (the fix is in [`deck-theme`](references/deck-theme.md) item 3)

---

## 10 · Connect to other skills

| Need | Use with |
|---|---|
| Create a real `.pptx` file | `branded-document-design` |
| A single .html deck presented from a browser (menu · notes · clock · click for detail) | `html-slide-deck` |
| Convert .pptx to .html with animation · click-by-click reveal · insert interactive pages | `html-slide-deck` (`references/from-pptx.md`) |
| Chart colour palette | The work's main colour + secondary colour per `diagram-figures` → `references/colour-by-domain.md` (app screens: `web-app-design` in plugin `software-development`) |
| Diagrams on slides | `diagram-figures` (for software, `software-diagrams` (plugin `software-development`) works too) |
| Spacing rules and eye order (app screens) | `ui-craft` (plugin `software-development`) |
| Content comes from a Software Requirements Specification (SRS) document | `srs-writing` (plugin `software-development`) |
| Cut content down to what is necessary | `simplicity-first` (plugin `software-development`) |
| Brand colour and type system · illustration | `graphic-design` (plugin `software-development`) |

---

## Not looking AI-made

Before sending, go through item 3 of `no-ai-look`: for HTML work, run its script · every job must also pass the eye gate 3.2 (web pages also answer items 10–14), because 0 findings from the script is not yet a pass · the prohibitions in this file are specific to this work; the full list for every medium is there.

## Abbreviations

Always spell out an abbreviation in full the first time, and put the abbreviation in brackets, for example Model Context Protocol (MCP).
After that you may use the abbreviation. See the skill `spell-out-abbreviations` for details.


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
