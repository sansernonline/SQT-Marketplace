# skill: user-story-writer

Use when writing user stories or turning requirements into stories (Given-When-Then criteria).

# User Story Writer

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

## เมื่อไหร่ใช้ skill นี้

- ผู้ใช้ขอให้เขียน user story ใหม่
- มี requirement เป็นข้อความยาว ต้องแตกเป็น stories
- ต้องเขียน acceptance criteria
- ต้อง review/refine user story เดิมที่ไม่ชัดเจน

ไม่ใช้เมื่อ: ต้องการเอกสาร requirement เต็ม → `srs-writing` · สเปกหน้าจอ → `fsd-writing` · เขียนกรณีทดสอบ → `test-case-template`

## ขั้นตอนการทำงาน

1. **เก็บข้อมูลให้ครบ** ก่อนเขียน ถ้าขาดอะไรให้ถาม:
   - ใครคือ user (persona/role)
   - เขาต้องการทำอะไร
   - ทำเพื่ออะไร (business value)
   - มีข้อจำกัด/business rule อะไรไหม

2. **เขียน user story ตาม format**:
   ```
   As a <type of user>
   I want <some goal>
   So that <some reason / business value>
   ```

3. **เขียน Acceptance Criteria** แบบ Given-When-Then:
   ```
   Given <precondition>
   When <action>
   Then <expected result>
   ```
   - อย่างน้อย 1 happy path
   - อย่างน้อย 1 edge case / error case

4. **ใส่ metadata เพิ่มเติม**:
   - Priority (High/Medium/Low)
   - Story Points (ถ้าจำเป็น) — ใช้ Fibonacci: 1, 2, 3, 5, 8, 13
   - Dependencies (ถ้ามี)

5. **บันทึกลงไฟล์** — ดูหัวข้อถัดไป story ที่อยู่แค่ในแชตถือว่ายังไม่ได้เขียน

## เขียนลงไฟล์ไหน

ทุก story อยู่ใน **`docs/USER-STORIES.md`** ไฟล์เดียว เริ่มจากแบบฟอร์ม [assets/user-stories.md](assets/user-stories.md)

- **อ่านไฟล์ก่อนเขียนเสมอ** ถ้ามีอยู่แล้ว ให้ต่อเลข ID จากตัวสุดท้าย และแก้ story เดิมในที่เดิม ไม่สร้างซ้ำ
- **ID ไม่นำกลับมาใช้ซ้ำ** story ที่เลิกทำแล้วให้เปลี่ยนสถานะเป็น Dropped ไม่ลบทิ้ง
- **ตารางสารบัญด้านบนต้องตรงกับเนื้อหาเสมอ** เพิ่มหรือแก้ story แล้วต้องแก้แถวในตารางในรอบเดียวกัน `/sprint-plan` อ่านจากตารางนี้
- **คอลัมน์อ้างอิง** ใส่ที่มาของ story เช่นข้อกำหนดใน SRS (`REQ-xxx`), กฎธุรกิจ (`BR-xxx`) หรือ change request (`CR-xxx`) เพื่อให้ไล่กลับไปหาได้
- **story ที่เริ่มทำหรือทำเสร็จแล้ว (In sprint หรือ Done) ถ้าแก้ AC** ให้บันทึกในส่วนประวัติการเปลี่ยนท้ายไฟล์ แล้วค้นใน `qa/` หา test case ที่อ้าง `US-xxx, ACn` นั้น ใส่ชื่อลงช่อง test case ที่ต้องแก้ — ไม่แก้ไฟล์ของ QA เอง
- **เกิน 30 story หรือมีหลาย epic ที่แยกทีมกันทำ** ให้ย้ายเนื้อหาไปไว้ที่ `docs/stories/<epic>.md` ส่วนตารางสารบัญยังคงอยู่ใน `docs/USER-STORIES.md` ที่เดียว

## INVEST Checklist (ตรวจก่อนส่ง)

ทุก story ต้องผ่านเกณฑ์เหล่านี้:

- [ ] **I**ndependent — ไม่ขึ้นกับ story อื่น
- [ ] **N**egotiable — เปิดให้คุยรายละเอียดได้
- [ ] **V**aluable — มี business value ชัดเจน
- [ ] **E**stimable — ประเมิน effort ได้
- [ ] **S**mall — เล็กพอจะทำเสร็จใน 1 sprint
- [ ] **T**estable — ทดสอบได้

## Output Template

```markdown
## US-XXX: <ชื่อสั้นๆ>

**Story**
As a <role>
I want <goal>
So that <value>

**Acceptance Criteria**

AC1: <ชื่อ scenario>
- Given <context>
- When <action>
- Then <result>

AC2: <ชื่อ scenario>
- Given ...
- When ...
- Then ...

**Priority:** High | Medium | Low
**Story Points:** X
**Dependencies:** US-YYY (ถ้ามี)
**Notes:** ข้อมูลเพิ่มเติม / business rules
```

## ตัวอย่าง

ดูตัวอย่างเต็มได้ที่ `examples/login-story.md`

## ข้อห้าม

- ❌ อย่าเขียน technical solution ใน story (เช่น "ใช้ JWT")
- ❌ อย่าเขียน UI detail (เช่น "ปุ่มสีฟ้า") — ให้ designer ตัดสิน
- ❌ อย่าใช้ "user" เฉยๆ ต้องระบุ role เจาะจง (admin, customer, guest)
- ❌ อย่าเขียน story ใหญ่เกิน 13 points — ให้แตกออก

---

## หน้าตาของเอกสาร

skill นี้ตัดสินว่า**เนื้อหาต้องมีอะไร** ไม่ได้ตัดสินว่า**หน้าตาเป็นอย่างไร** —
โหลด skill ที่ตรงกับปลายทางก่อนเริ่มเขียน ไม่ใช่ตอนเขียนเสร็จ:

| ส่งมอบเป็นอะไร | โหลด |
|---|---|
| markdown ที่คนอ่าน (repo · wiki · ระบบติดตามงาน) | `polished-document-style` |
| ไฟล์ `.docx` / `.pptx` / PDF ที่ผู้มีส่วนได้เสียเซ็นรับ | `branded-document-design` |
| ต้องมีภาพถึงจะเข้าใจ | `markdown-visuals` แล้วต่อด้วย `software-diagrams` |

การปล่อยรูปแบบเริ่มต้นไว้ไม่ได้ทำให้ดูเป็นกลาง คนอ่านจะมองว่างานยังไม่เสร็จ


---

# skill: markdown-visuals

Use when a markdown doc needs a picture (UI state, flow, architecture) that renders everywhere. Mermaid content → software-diagrams.

# Markdown Visuals

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every design, mockup, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — wireframe sketch or UI state in a spec, FSD, ADR or README
- Writing FSD, BRD, ADR, or architecture docs that describe layout, flow, or relationships
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / sequence / decision tree          →  Mermaid (software-diagrams)
├─ Architecture / ER / class                →  Mermaid (software-diagrams)
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Follow the tree above**; when two branches fit, pick inline SVG over an image file. Inline SVG renders everywhere and versions cleanly in git. It adds no binary files to the repo, and the user can read and edit the markup.

## 1 · Inline SVG (primary technique)

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
- `xmlns="http://www.w3.org/2000/svg"` — without this, GitHub may not render
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

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams`**
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
- ❌ **SVG without `xmlns`** — GitHub silently fails to render
- ❌ **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- ❌ **ASCII art outside a code fence** — proportional fonts will mangle alignment
- ❌ **Mixing Mermaid syntax versions** — stick to v10 syntax so GitHub renders it
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

Not sure a visual will render? Tell the user to preview it in GitHub or Notion.

## Related skills

- [[polished-document-style]] — overall doc formatting, Mermaid catalogue, callout boxes
- [[simplicity-first]] — don't over-design the diagram; show what's needed
- [[software-diagrams]] — which diagram type answers which question, plus the shared Mermaid theme
- [[diagram-figures]] — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- [[ui-craft]] — spacing, hierarchy and states when the picture is a screen

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

Pattern from `DockXI/docs/12-design-mockup.md`:

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

This is the pattern used in `DockXI/docs/12-design-mockup.md` and should be the default for showing UI feature states.


---

# skill: prior-art-review

Use when about to build something that may already exist (library, model, product). Adopt or build.

# สำรวจของที่มีอยู่แล้วก่อนลงมือทำ

> **กฎข้อเดียว:** จบที่**การตัดสินใจ** ไม่ใช่จบที่รายงาน
> ถ้าอ่านจบแล้วยังไม่รู้ว่าจะใช้ตัวไหน แปลว่ายังไม่เสร็จ

---

## ต่างจาก `reference-app-research` อย่างไร

| | `reference-app-research` | skill นี้ |
|---|---|---|
| ผลลัพธ์ | รายงาน feature · UI · UX + ข้อเสนอปรับปรุง | ตารางเทียบ + การตัดสินใจ + สิ่งที่ยอมแลก |
| คำถามตั้งต้น | "แอปนี้ดีและพังตรงไหน ของเราจะดีกว่าอย่างไร" | "ควรหยิบตัวไหนมาใช้ หรือทำเอง" |
| ใช้ร่วมกัน | แกะแอปต้นแบบที่จะสร้างแบบเดียวกัน | ตัดสินเรื่องไลบรารี เครื่องมือ หรือของที่จะนำมาใช้ แล้วบันทึก |

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| แกะแอปต้นแบบเพื่อทำแบบเดียวกัน | `reference-app-research` |
| เลือกรูปแบบสถาปัตยกรรม ไม่ใช่เลือกเครื่องมือ | `architecture-patterns` |
| ตัดสินใจแล้ว เหลือแค่บันทึกเหตุผล | `adr-writer` |
| ค้นคว้าเรื่องทั่วไป (เทคโนโลยี · ตลาด) ที่ไม่ได้จบที่การเลือกของมาใช้ | (ถ้าติดตั้ง plugin `superuser`) playbook `research` ไม่มีก็ใช้ skill นี้หรือ `reference-app-research` ตามที่ใกล้กว่า |

---

## 1 · ตั้งคำถามให้แคบก่อนค้น

คำถามกว้างจะได้รายชื่อยาวที่เทียบกันไม่ได้

```
❌ มีเครื่องมือถอดเสียงอะไรบ้าง
✅ ตัวไหนถอดเสียงไทยยาว 2 ชั่วโมงได้ แยกผู้พูดได้ รันบนเครื่องตัวเองได้
   และสัญญาอนุญาตให้ขายต่อได้
```

คำถามต้องมี **3 อย่าง** เสมอ: สิ่งที่ต้องทำได้ · ข้อจำกัดที่ยอมไม่ได้ · เงื่อนไขการนำไปใช้

**เขียนคำถามลงไฟล์ก่อนค้น** ไม่งั้นพอเจอของสวย ๆ จะเผลอเปลี่ยนคำถามให้เข้ากับของที่เจอ

---

## 2 · ดูให้ครบสี่แหล่ง

| แหล่ง | หาอะไร | สัญญาณที่ต้องเก็บ |
|---|---|---|
| โค้ดโอเพนซอร์ส | ของที่หยิบมาใช้ได้ทันที | สัญญาอนุญาต · commit ล่าสุด · จำนวนผู้ดูแล |
| ผลิตภัณฑ์ที่ขายอยู่ | ตลาดยอมจ่ายเท่าไหร่ ของเขาขาดอะไร | ราคา · สิ่งที่เขาไม่ทำ · คำบ่นของผู้ใช้ |
| งานวิจัย | วิธีที่ดีกว่าที่ยังไม่มีใครทำเป็นผลิตภัณฑ์ | ปีที่ตีพิมพ์ · มีโค้ดให้ไหม · ทำซ้ำได้ไหม |
| มาตรฐานและข้อกำหนด | สิ่งที่ห้ามคิดเอง | หมายเลขมาตรฐาน · ฉบับล่าสุด |

**แหล่งที่คนลืมบ่อยที่สุดคือมาตรฐาน** ถ้าเขียนรูปแบบไฟล์เองทั้งที่มีมาตรฐานอยู่แล้ว
ก็เท่ากับสร้างงานให้ตัวเองและปิดทางเชื่อมกับระบบอื่น

---

## 3 · ตารางเทียบ — หกคอลัมน์นี้ต้องมีเสมอ

| ตัวเลือก | ทำสิ่งที่เราต้องได้ไหม | สัญญาอนุญาต | โครงการยังมีชีวิตไหม | ต้องยอมแลกอะไร | ต้นทุนจริง |
|---|---|---|---|---|---|

- **คอลัมน์ "ทำสิ่งที่เราต้องได้ไหม" ไม่ใช่รายการความสามารถ** ให้ตอบเฉพาะข้อที่เราถามในข้อ 1
- **ต้นทุนจริง** รวมค่าเรียนรู้ ค่าดูแล และค่าย้ายออกถ้าวันหนึ่งต้องเลิกใช้ ไม่ใช่แค่ค่าลิขสิทธิ์
- เรียงแถวตามความเหมาะสม ให้ตัวที่แนะนำอยู่บนสุด
- **ปิดท้ายด้วยข้อสรุป 1 บรรทัดเสมอ**

---

## 4 · สัญญาอนุญาต — ตรวจก่อน อย่าตรวจทีหลัง

**เรื่องนี้ถ้ารู้ช้าจะเจ็บที่สุด** เพราะถ้ามารู้ตอนใกล้ส่งมอบ ก็ต้องรื้อ

| กลุ่ม | ตัวอย่าง | ใช้ในของที่ขายได้ไหม |
|---|---|---|
| ปล่อยเสรี | MIT · Apache-2.0 · BSD | ได้ แต่ Apache-2.0 มีเงื่อนไขเรื่องสิทธิบัตรเพิ่ม |
| ต้องเปิดโค้ดต่อ | GPL-3.0 · AGPL-3.0 | ได้แต่**ต้องเปิดโค้ดของเรา** และ AGPL นับรวมการให้บริการผ่านเครือข่ายด้วย |
| ห้ามเชิงพาณิชย์ | CC BY-NC · โมเดลที่เขียนว่า research only | **ขายไม่ได้** แต่ใช้ทดลองและเทียบผลได้ |
| เฉพาะราย | ต้องอ่านสัญญาจริง | ขึ้นกับข้อสัญญา |

**กฎ 2 ข้อที่พลาดกันบ่อย**

1. **โมเดลปัญญาประดิษฐ์มีสัญญาแยกจากโค้ด** — โค้ดอาจเป็น MIT แต่น้ำหนักโมเดลเป็น non-commercial ก็ได้
2. **สัญญาตกทอดไปถึงโมเดลที่ต่อยอด** — เช่น โมเดลที่ fine-tune มาจากโมเดล non-commercial ก็ยัง non-commercial

ทุกตัวที่จะใช้จริง ต้อง**เขียนชื่อสัญญาอนุญาตลงไฟล์** ไม่ใช่จำไว้

---

## 5 · โครงการยังมีชีวิตไหม

| สัญญาณ | ตีความ |
|---|---|
| commit ล่าสุดเกิน 12 เดือน | ตายแล้ว เว้นแต่เป็นของที่นิ่งจริง เช่นไลบรารีคณิตศาสตร์เล็ก ๆ |
| ผู้ดูแลคนเดียว | ความเสี่ยงสูง ถ้าคนนั้นหายไปก็จบ |
| issue ค้างเป็นร้อยไม่มีใครตอบ | ไม่มีใครดูแลจริง |
| ไม่มีการออกรุ่นเลยในปีที่ผ่านมา | เหมือนข้อแรก |
| เอกสารตรงกับโค้ดรุ่นเก่า | จะเสียเวลาเดามาก |
| ไม่มี test ในโครงการ | ยกรุ่นทีไรพังทุกที |

**ของที่ตายแล้วยังใช้ได้** ถ้ายอมรับว่าจะต้องดูแลเอง แต่ต้องรู้ตัวตั้งแต่ต้น ไม่ใช่มารู้ตอนติดปัญหา

---

## 6 · จบด้วยหนึ่งในสี่ทาง

| ทาง | เมื่อไหร่ | สิ่งที่ต้องบันทึก |
|---|---|---|
| **ใช้เลย** | ตรงความต้องการ ≥80% สัญญาอนุญาตผ่าน และยังมีชีวิต | รุ่นที่ล็อกไว้ · สิ่งที่มันทำไม่ได้ |
| **แยกไปแก้เอง** | ใกล้เคียงมากแต่ขาดบางอย่าง และสัญญาอนุญาตให้แก้ได้ | แก้อะไรบ้าง · จะตามรุ่นต้นทางอย่างไร |
| **ทำเอง** | ไม่มีตัวไหนผ่านข้อจำกัดที่ยอมไม่ได้ | ตัวที่ใกล้ที่สุดคือตัวไหน และขาดอะไร |
| **ไม่ทำ** | มีของที่ดีกว่าอยู่แล้วในราคาที่ถูกกว่าทำเอง | เหตุผล และเงื่อนไขที่จะกลับมาคิดใหม่ |

**"ทำเอง" ต้องมีเหตุผลที่เขียนออกมาได้** ส่วน "อยากคุมเอง" ไม่ใช่เหตุผล
ต้องบอกได้ว่าคุมเองแล้วได้อะไรที่หยิบของเขามาใช้แล้วไม่ได้

---

## 7 · บันทึกสิ่งที่ยอมแลก

ทุกทางเลือกต้องแลกบางอย่างไป **ถ้าไม่บันทึกวันนี้ อีก 6 เดือนจะไม่มีใครจำได้**
ให้บันทึกเป็น Architecture Decision Record ด้วย `adr-writer` อย่างน้อย 3 บรรทัด

```
เลือก: <ตัวเลือก>  เพราะ <เหตุผลหลักข้อเดียว>
ยอมแลก: <สิ่งที่เสียไป>
จะกลับมาคิดใหม่เมื่อ: <เงื่อนไขที่วัดได้>
```

---

## 8 · ฉบับงานวิจัย

ผลลัพธ์ไม่ใช่ "ใช้ตัวไหน" แต่คือ **"ช่องว่างอยู่ตรงไหน"**

- เปลี่ยนคอลัมน์ของตารางเทียบเป็น: งาน · ปี · วิธีที่ใช้ · ชุดข้อมูล · ผลที่รายงาน · ข้อจำกัดที่เขาบอกเอง
- **คอลัมน์ "ข้อจำกัดที่เขาบอกเอง" คือที่มาของช่องว่าง** เพราะส่วนใหญ่ผู้เขียนบอกไว้เองในหัวข้อสุดท้าย
- ช่องว่างที่ใช้ได้ต้องเป็นอย่างใดอย่างหนึ่ง: ยังไม่มีใครทดสอบกับบริบทนี้ · วิธีเดิมใช้ไม่ได้เมื่อเงื่อนไขเปลี่ยน · ผลที่รายงานทำซ้ำไม่ได้
- **ห้ามอ้างงานที่ยังไม่ได้อ่านตัวเต็ม** เพราะการอ่านแค่บทคัดย่อแล้วอ้าง คือความผิดพลาดที่กรรมการจับได้เร็วที่สุด
- งานที่หาโค้ดหรือชุดข้อมูลไม่ได้ ให้ระบุไว้ว่าทำซ้ำไม่ได้ อย่าเงียบไว้

---

## 9 · Anti-patterns

- ❌ **ค้นจนได้รายชื่อ 20 ตัวแล้วไม่ตัดสินใจ** — รายชื่อไม่ใช่ผลงาน
- ❌ **เทียบด้วยรายการความสามารถ** — ทุกตัวจะดูดีหมด เพราะทุกคนเขียนหน้าแรกเก่ง
- ❌ **ตรวจสัญญาอนุญาตหลังเขียนโค้ดไปแล้ว**
- ❌ **เชื่อหน้าแรกของโครงการ** — ต้องดู commit และ issue จริง
- ❌ **"ทำเองเร็วกว่า" โดยไม่เคยลองของที่มี**
- ❌ **ไม่บันทึกสิ่งที่ยอมแลก** — ทีมจะถกเรื่องเดิมซ้ำทุก 6 เดือน
- ❌ **ลืมมาตรฐานที่มีอยู่แล้ว** แล้วประดิษฐ์รูปแบบข้อมูลเอง

---

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| แกะแอปต้นแบบที่จะทำแบบเดียวกัน — feature · UI · UX · ข้อเสนอปรับปรุง | `reference-app-research` |
| บันทึกการตัดสินใจ | `adr-writer` |
| เทียบรูปแบบสถาปัตยกรรม ไม่ใช่เทียบเครื่องมือ | `architecture-patterns` |
| รูปทรงของตารางเทียบในคำตอบ | `answer-shape` |
| ตัดข้อเสนอให้เหลือเท่าที่จำเป็น | `simplicity-first` |
| ไฟล์ที่ดาวน์โหลดหรือแปลงระหว่างสำรวจ | `temp-file-discipline` |

---

## ตัวย่อ

- **MIT** — Massachusetts Institute of Technology License (สัญญาอนุญาตแบบปล่อยเสรี)
- **GPL** — General Public License (ใช้ได้แต่ต้องเปิดโค้ดที่ต่อยอด)
- **AGPL** — Affero General Public License (เหมือน GPL และนับรวมการให้บริการผ่านเครือข่าย)
- **BSD** — Berkeley Software Distribution License
- **CC BY-NC** — Creative Commons Attribution-NonCommercial (ห้ามใช้เชิงพาณิชย์)
- **ADR** — Architecture Decision Record (บันทึกการตัดสินใจเชิงสถาปัตยกรรม)
