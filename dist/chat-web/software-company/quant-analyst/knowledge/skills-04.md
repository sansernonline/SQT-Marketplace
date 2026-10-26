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

# skill: stack-mql

Use when writing, reviewing or testing MQL4/MQL5 code for MetaTrader 4/5 (Expert Advisors, indicators, scripts) or preparing one for the MQL5 Market.

# stack · MQL — Expert Advisor (EA) ที่ส่งออร์เดอร์ถูก ทุกโบรกเกอร์ ทุกครั้ง

> **กฎข้อเดียว:** ทุกออร์เดอร์ผ่านตัวตรวจก่อนส่ง และทุกผลส่งกลับถูกอ่าน · EA ที่ "ทำงานใน tester" แต่ไม่ตรวจ ยังไม่เสร็จ

ใช้กับ EA · indicator · script บน MetaTrader 4 (MT4) และ MetaTrader 5 (MT5) · กลยุทธ์ ความเสี่ยง และเกณฑ์ backtest อยู่ใน spec การเทรดของโปรเจกต์ (ถ้าใช้ชุด prompt ของ repo: `prompt/software-company/prompt-trading-system.md` — ผู้ที่ติดตั้งเฉพาะ plugin จะไม่มีไฟล์นี้ ให้ขอ spec จากเจ้าของ) · หลักทั่วไปอยู่ที่ `lazy-coding` · `readable-code` · `testing-standards` · `logging-standards` · `error-handling-patterns`

## 1 · เริ่มงาน: รู้ว่าเขียนให้แพลตฟอร์มไหน

- ไฟล์ `.mq4` = MQL4 (MT4) · `.mq5` = MQL5 (MT5) · `.mqh` = include ใช้ร่วมได้ถ้าแยกส่วนที่ต่างไว้หลัง `#ifdef __MQL5__`
- MQL4 ใส่ `#property strict` ทุกไฟล์ (ไม่ใส่ → compiler ปล่อยบั๊กชนิดข้อมูลผ่าน)
- compile และ test ต้องมี terminal (Windows หรือ Wine บน macOS / Linux ที่ MetaQuotes แจก) · เครื่องที่ไม่มี → เขียนในรายงานว่า "ยังไม่ได้ compile" ห้ามบอกว่าผ่าน

| ขั้น | MT5 | MT4 |
|---|---|---|
| compile | `metaeditor64.exe /compile:"MQL5\Experts\X.mq5" /log` | `metaeditor.exe /compile:"MQL4\Experts\X.mq4" /log` |
| ผล compile | ไฟล์ `.log` ข้างไฟล์ต้นทาง · 0 errors 0 warnings | เหมือนกัน |
| backtest จาก command line | `terminal64.exe /config:"tester.ini"` (หัวข้อ `[Tester]`: `Expert` · `Symbol` · `Period` · `FromDate` · `ToDate` · `Model` · `Report` · `ShutdownTerminal=1`) | `terminal.exe` + ไฟล์ config แบบ MT4 (ตัวเลือกน้อยกว่า) |

ตรวจล่าสุด 2026-10-20 · แหล่ง: https://www.metatrader5.com/en/terminal/help/start_advanced/start · ก่อนใช้ให้ตรวจหน้านี้ซ้ำ

## 2 · ความต่างที่ทำให้ port ระหว่าง MT4 กับ MT5 พัง

| เรื่อง | MT4 | MT5 |
|---|---|---|
| โมเดลออร์เดอร์ | ออร์เดอร์ = สถานะ (`OrderSend` · `OrderSelect` · `OrdersTotal`) | แยก order · position · deal · ใช้ `CTrade` (`Trade\Trade.mqh`) |
| บัญชี | hedging เสมอ | netting หรือ hedging → อ่าน `ACCOUNT_MARGIN_MODE` · netting มีได้ 1 position ต่อ symbol |
| วิธีเติมออร์เดอร์ | ไม่มีให้เลือก | FOK / IOC อ่านจาก flag ใน `SYMBOL_FILLING_MODE` (Market / Exchange Execution) · RETURN ใช้ได้ทุกโหมดยกเว้น Market Execution · pending order ใช้ RETURN |
| indicator | คืนค่าทันที (`iMA(...)`) | สร้าง handle ครั้งเดียวใน `OnInit` แล้ว `CopyBuffer` · ปล่อยใน `OnDeinit` |
| ผลส่งออร์เดอร์ | `GetLastError()` (130 stops ผิด · 134 เงินไม่พอ · 138 requote · 146 trade context busy) | `MqlTradeResult.retcode` (10009 done · 10008 placed (pending order) · 10010 done partial = สำเร็จ · 10004 requote · 10014 volume ผิด · 10015 ราคาผิด · 10016 stops ผิด · 10018 ตลาดปิด · 10019 เงินไม่พอ · 10030 filling ผิด) |
| เหตุการณ์ออร์เดอร์ | ไม่มี ต้องไล่ดูเอง | `OnTradeTransaction` |

## 3 · ตัวตรวจก่อนส่งออร์เดอร์ (ทุกออร์เดอร์ ทุกครั้ง)

| ตรวจ | ทำแบบนี้ | ไม่ตรวจแล้วเจอ |
|---|---|---|
| volume | ปัดลงตาม `SYMBOL_VOLUME_STEP` · อยู่ระหว่าง `SYMBOL_VOLUME_MIN` กับ `SYMBOL_VOLUME_MAX` | 10014 · error 131 |
| ราคา | `NormalizeDouble(price, _Digits)` | 10015 |
| Stop Loss (SL) / Take Profit (TP) | ห่างราคาปัจจุบันไม่น้อยกว่า `SYMBOL_TRADE_STOPS_LEVEL` × `_Point` | 10016 · error 130 |
| แก้ออร์เดอร์ | ไม่แก้เมื่อราคาอยู่ในระยะ `SYMBOL_TRADE_FREEZE_LEVEL` · ไม่ส่งค่าเดิมซ้ำ | ถูกปฏิเสธ · 10025 no changes |
| margin | `OrderCalcMargin` (MT5) · `AccountFreeMarginCheck` (MT4) ก่อนส่ง | 10019 · error 134 |
| จำนวนออร์เดอร์ | น้อยกว่า `ACCOUNT_LIMIT_ORDERS` (0 = ไม่จำกัด) | ถูกปฏิเสธ |
| symbol | `SYMBOL_TRADE_MODE` ไม่ใช่ disabled · ตลาดเปิด | 10018 |
| MT5 ทั้งชุด | `OrderCheck()` ก่อน `OrderSend()` | error ที่บอกไม่ได้ว่าข้อไหนผิด |

- ทุกผลส่งกลับต้องอ่าน · requote / off quotes → ลองใหม่ไม่เกิน 3 ครั้ง ราคาใหม่ทุกครั้ง · เงินไม่พอ / stops ผิด → ไม่ลองซ้ำ ลง log แล้วหยุดไม้นั้น
- pip กับ point ไม่เท่ากัน: ราคา 5 ตำแหน่ง (หรือ 3 ตำแหน่งของคู่ JPY) → 1 pip = 10 point · input ที่ผู้ใช้กรอกเป็น pip ให้แปลงที่จุดเดียว
- **กับดักที่โค้ดดูถูกแต่พังจริง** (ปรับจาก ThomasPraun/mql-developer · MIT): เทียบ `double` ด้วย `==` ไม่ได้ ให้ `NormalizeDouble` ทั้ง 2 ฝั่งหรือเทียบกับค่าคลาดเคลื่อน · MT4 ปิดหลายออร์เดอร์ต้องวนจาก `OrdersTotal()-1` ลงถึง 0 เพราะปิดแล้ว index เลื่อน · โบรกเกอร์ ECN บางเจ้าไม่รับ SL/TP ใน `OrderSend` ต้องส่งก่อนแล้ว `OrderModify` ตาม · `WebRequest` บล็อกจนกว่าจะตอบ และใช้ใน indicator กับ tester ไม่ได้ · MT4 terminal เดียวเทรดได้ทีละ EA (error 146) ต้องรอแล้วลองใหม่ ไม่ใช่ส่งซ้ำทันที · array แบบ series index 0 = แท่งล่าสุด ให้ `ArraySetAsSeries` กำกับทุกครั้ง ไม่เดาว่าทิศไหน

ตัวอย่างโค้ดตัวตรวจแต่ละข้อ → https://www.mql5.com/en/articles/23204 (อ่านแล้วเขียนเอง ไม่ลอกทั้งไฟล์)

## 4 · โครง EA ที่อ่านง่ายและกู้คืนได้

- `OnInit` ตรวจ input ทุกตัว (ค่าผิด → `INIT_PARAMETERS_INCORRECT`) · สร้าง handle · `OnDeinit` ปล่อย handle
- logic หนักทำครั้งเดียวต่อแท่งใหม่ (เทียบ `iTime(_Symbol, _Period, 0)` กับค่าที่จำไว้) ไม่ทำทุก tick
- magic number ต่อ EA + symbol + กลยุทธ์ · นับและจัดการเฉพาะออร์เดอร์ที่ magic ตรง ห้ามแตะออร์เดอร์มือหรือ EA อื่น
- **ไม่เก็บ state สำคัญไว้ในตัวแปรอย่างเดียว:** terminal รีสตาร์ท → state หาย · `OnInit` สร้าง state ใหม่จาก position/order ที่ magic ตรง · ค่าที่สร้างใหม่ไม่ได้ (เช่น ยอดขาดทุนวันนี้) เก็บใน `GlobalVariableSet` หรือไฟล์ใน `MQL5\Files` / `MQL4\Files`
- เวลา: ใช้เวลา server (`TimeCurrent`) ตัดสินแท่งและ session · เวลา server ของแต่ละโบรกเกอร์ไม่เท่ากับเวลาไทย และเลื่อนตาม daylight saving · ใน tester `TimeGMT()` เท่ากับเวลา server จำลองเสมอ (แหล่ง: https://www.mql5.com/en/docs/dateandtime/timegmt) → ตัวกรองข่าวและ session ที่อิง Greenwich Mean Time (GMT) ต้องตั้ง offset เป็น input
- 1 ฟังก์ชัน 1 หน้าที่: สัญญาณ · ขนาดไม้ · ส่งออร์เดอร์ · จัดการออร์เดอร์ที่เปิดอยู่ แยกกัน · สัญญาณเป็นฟังก์ชันบริสุทธิ์ที่รับข้อมูลแท่งแล้วคืนผล (test ได้ใน script)
- log ทุกการตัดสินใจที่ส่งหรือไม่ส่งออร์เดอร์: เวลา server · symbol · เหตุผล · ราคา · spread · ผลส่งกลับ · ไม่ log ทุก tick

## 5 · test

- **script test:** ฟังก์ชันสัญญาณและขนาดไม้ test ด้วย script ที่ป้อนข้อมูลตายตัวแล้วเทียบผล (MQL ไม่มี framework test มาตรฐาน)
- **backtest:** MT5 ใช้โหมด "Every tick based on real ticks" สำหรับผลที่จะใช้ตัดสิน · MT4 รายงาน modelling quality ทุกครั้ง · ค่า spread · commission · swap ตั้งตามบัญชีจริง ไม่ใช่ 0
- **ทดสอบกับหลายสภาพ:** symbol อย่างน้อย 3 ตัวที่ digits ต่างกัน (เช่น EURUSD · USDJPY · XAUUSD) · timeframe อย่างน้อย 2 ตัว · บัญชี netting และ hedging (MT5) · ทุนน้อยจนส่งไม้ขั้นต่ำไม่ได้
- **ไม่ตัดสินจากผลที่ optimize มา:** ใช้ forward period ของ MT5 หรือแบ่ง in-sample / out-of-sample เอง · ตัวเลขที่รายงานคือผลช่วงที่ไม่ได้ใช้ optimize
- `OnTester()` คืนค่าเกณฑ์ที่ spec กำหนด (เช่น profit factor ที่ drawdown ไม่เกินเกณฑ์) เพื่อให้ optimizer เลือกตามเกณฑ์จริง ไม่ใช่กำไรสูงสุด

## 6 · ขายบน MQL5 Market

ตรวจล่าสุด 2026-10-20 · แหล่ง: https://www.metatrader5.com/en/terminal/help/market/market_sell · กฎเปลี่ยนได้ ตรวจซ้ำก่อนส่ง

- ส่งไฟล์ compile แล้วไฟล์เดียว (`.ex5` / `.ex4`) · indicator · เสียง · รูป ฝังเป็น resource · **ห้ามใช้ Dynamic Link Library (DLL)**
- **ห้ามจำกัดตามเลขบัญชีหรือชนิดบัญชี** · Market ล็อกเครื่องและจำนวน activation ให้เอง · ระบบ license ของเรา (ข้อ 7) ใช้ได้เฉพาะช่องทางขายเอง
- การตรวจอัตโนมัติรัน EA ใน tester หลาย symbol และ timeframe · EA ต้องส่งออร์เดอร์ได้จริงในทุกสภาพนั้น (ไม่ส่งเลย = ไม่ผ่าน) · ตัวตรวจข้อ 3 ครบทุกข้อคือสิ่งที่ทำให้ผ่าน
- ห้ามสัญญาผลกำไรในคำบรรยาย · ชื่อสินค้าตัวอักษรละตินไม่เกิน 50 ตัว ไม่มีเลขรุ่น · ระบุถ้าใช้ได้เฉพาะ hedging หรือ netting

## 7 · ความปลอดภัยและการขายเอง

- รหัสผ่านบัญชีเทรด · API key · license key ไม่อยู่ในโค้ดหรือ `.set` · ค่าที่ต้องเก็บใช้ input ที่ผู้ใช้กรอกเองบนเครื่อง
- `WebRequest` ใช้ได้เฉพาะ URL ที่ผู้ใช้เพิ่มใน allow list ของ terminal เอง · บอกในคู่มือว่าต้องเพิ่ม URL ไหน
- ขายเอง (ไม่ผ่าน Market): ล็อก license ด้วยเลขบัญชี (`ACCOUNT_LOGIN`) + วันหมดอายุ ตรวจใน `OnInit` · ไม่ส่ง `.mq4` / `.mq5` ให้ลูกค้า · ไฟล์ `.ex4` / `.ex5` ถอดกลับได้บางส่วน อย่าวางกฎลับไว้ในตัว EA อย่างเดียว

## 8 · รายการตรวจก่อนส่ง

- [ ] compile ได้ 0 errors 0 warnings (หรือรายงานว่ายังไม่ได้ compile เพราะไม่มี terminal)
- [ ] ทุกออร์เดอร์ผ่านตัวตรวจข้อ 3 · ทุกผลส่งกลับถูกอ่านและ log
- [ ] magic number · state สร้างใหม่ได้หลังรีสตาร์ท · ไม่แตะออร์เดอร์ที่ magic ไม่ตรง
- [ ] input ทุกตัวมีค่า default และช่วงที่ตรวจใน `OnInit`
- [ ] backtest ใช้ spread · commission · swap จริง · ผลที่รายงานมาจากช่วงที่ไม่ได้ optimize
- [ ] ทดสอบแล้วอย่างน้อย 3 symbol · 2 timeframe (· netting และ hedging สำหรับ MT5)
- [ ] ขาย Market: ไม่มี DLL · ไม่ล็อกบัญชีหรือ symbol · คำบรรยายไม่สัญญาผลกำไร

## 9 · เชื่อมกับ skill อื่น

สูตรและสถิติ backtest → agent `quant-analyst` · test ทั่วไป → `testing-standards` · log → `logging-standards` · ค่าลับ → `config-and-secrets` · ขั้นตอนเล็กที่ตรวจได้ → `principle-small-verifiable-steps` · ขายและราคา → `prompt/software-company/prompt-sell-product.md` ของ repo (ถ้าใช้ชุด prompt)
