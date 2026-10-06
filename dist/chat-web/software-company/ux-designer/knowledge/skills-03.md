# skill: simplicity-first

Use when producing a document, design, architecture or plan (BRD, FSD, ADR, roadmap, UX, API design, sprint plan). Simplest version that works, the tired-teammate test, no buzzwords or extra layers. For code use lazy-coding.

# Simplicity First

> The best architecture has the fewest moving parts. The best plan is the one a
> teammate can follow with no context.

This skill covers **non-code outputs** — documents, plans, architecture, and
designs. For code, use `lazy-coding`.

## The one test

Before submitting, ask:

> Could a tired teammate understand this in 6 months, with no prior context?

If "no" or "not sure" → simplify.

## 5 principles

1. **Start with the simplest thing that works.** Add complexity only when something breaks.
2. **Reduce moving parts.** Each component adds failure modes, ops burden, and docs. Default to one thing.
3. **Use familiar patterns.** Boring, proven tech for critical paths. Save novelty for low-risk experiments.
4. **Optimize for reading.** It's read far more often than written.
5. **Delete &gt; add.** The best edit removes something. The worst adds a layer for an imagined future need.

## By output type

### Documents (BRD, FSD, ADR)

Do: short sentences (≤ 20 words), plain English, one idea per paragraph, an
example for every abstract point, tables for structured data.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy"), undefined
jargon, walls of text, hedging ("might possibly potentially"), acronym soup.

### Architecture

Do: monolith first (split only when a bottleneck is proven), familiar stack,
standard patterns (REST, queues, caches), single source of truth per data type.

Avoid: microservices for small teams, distributed-everything, multi-master
databases before you must, event-driven by default (sync is simpler).

### Plans

Do: 3-5 priorities (not 20), a named owner per item, measurable success
criteria, realistic timelines with buffer, cut scope to fit time.

Avoid: vague goals ("improve quality"), 50-item lists (= no priority),
aspirational dates with no buffer, plans without success metrics.

### Designs (UX, API)

Do: fewest steps to the user's goal, reuse existing patterns, stay consistent
across screens, defaults that work for 80%, progressive disclosure.

Avoid: novel interactions where a standard one works, 10-step flows when 3
work, required fields with no smart default, hidden features needing tutorials.

## The 3-question filter

Before adding any new component, configuration option, or pattern:

1. Is there real evidence we need this **now** (not "might need")?
2. Is there a simpler way? (Sleep on it. Often yes.)
3. What's the cost of **not** adding it? (Often nothing, or a small refactor later.)

Two or more answers point to "simpler is fine" → don't add it.

## Examples

**API description**

❌ "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

✅ "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

❌ "Improve overall product quality and customer satisfaction through various
initiatives."

✅ "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

❌ "Event-sourced microservice with CQRS, Kafka ingestion, Redis cache, and a
dedicated auth service."

✅ "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

## Anti-patterns to reject

- **Future-proofing** — abstractions for needs that never arrive.
- **"It might scale"** — infra for 1M users while you have 1k.
- **Layer cake** — 6 layers where 90% just pass through.
- **Resume-driven design** — fancy tech to look sophisticated.
- **Buzzword stacking** — "cloud-native event-driven AI-powered".

## Pre-submit checklist

- [ ] A tired teammate would understand this in 6 months.
- [ ] Nothing can be deleted without losing meaning.
- [ ] No jargon the audience won't know.
- [ ] Every abstract claim has an example.
- [ ] I could explain the whole thing in two sentences.

If any answer is "no" → simplify before delivering.

> "Perfection is achieved not when there is nothing more to add, but when there
> is nothing left to take away." — Saint-Exupéry


---

# skill: markdown-visuals

Use when a markdown document needs a picture (wireframe, UI state, architecture, flow, data viz). Picks inline SVG, image, ASCII or Mermaid and embeds it so it renders in GitHub, Notion, VS Code and Obsidian.

# Markdown Visuals

> **Rule:** Every design, mockup, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- Producing **any** design mockup, wireframe, or UI spec
- Writing FSD, BRD, ADR, or architecture docs that describe layout, flow, or relationships
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user said "make a mockup," "show me how it looks," or "design X"

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

---

## Decision tree: which format?

```
What are you showing?
│
├─ UI mockup / component state / icon       →  Inline SVG
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / sequence / decision tree          →  Mermaid (see polished-document-style)
├─ Architecture / ER / class                →  Mermaid
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG
├─ Photo, screenshot, complex illustration  →  External file → ![alt](assets/x.png)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Default to inline SVG** for anything that isn't a flow/sequence (use Mermaid for those). It renders everywhere, versions in git, doesn't bloat the repo with binaries, and the user can read/edit the markup.

---

## 1 · Inline SVG (primary technique)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background -->
  <rect width="640" height="280" rx="14" fill="#1c2230"/>

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
- Mockup of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี — มาจากเนื้องาน ไม่ใช่จากตารางสำเร็จรูป

**อย่าเลือกสีเอง** ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ใช้ชุดนั้น
ถ้ายังไม่มี ให้เสนอโทนจากเนื้องานแล้วรอผู้ใช้ยืนยัน — การแพทย์เขียว · การเงินน้ำเงินเข้ม ·
อุตสาหกรรมเหลืองอำพัน · ราชการกรมท่า · ซอฟต์แวร์ทั่วไปน้ำเงิน (ตารางเต็มอยู่ใน `svg-diagram-system` ข้อ 0)

กำหนดเป็น **token ตามหน้าที่** ไว้บนสุดของเอกสาร แล้วใช้ค่าเดียวกันทุกรูปในเอกสารนั้น:

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| `bg-canvas` | พื้นหลังของรูป | เฉดเข้มสุด (โหมดมืด) หรืออ่อนสุด (โหมดสว่าง) |
| `bg-surface` | แผ่น พาเนล การ์ด | ต่างจาก canvas พอให้เห็นขอบโดยไม่ต้องตีเส้น |
| `bg-elevated` | ไทล์ที่ลอยขึ้นมาอีกชั้น | |
| `accent-primary` | จุดเน้น สถานะที่กำลังทำงาน | **สีหลักที่ผู้ใช้เลือก** |
| `text-primary` | ข้อความหลัก | contrast ≥ 4.5:1 กับพื้นที่มันวางอยู่ |
| `text-muted` | ข้อความรอง placeholder | `rgba(...,0.55)` ของ `text-primary` |
| `state-success` · `state-warning` · `state-danger` | สถานะ | **ไม่เปลี่ยนตามแบรนด์** — เขียวคือผ่าน แดงคือไม่ผ่านเสมอ |

**หนึ่งเอกสารใช้หนึ่งชุด** — รูปสิบรูปในเอกสารเดียวที่สีไม่ตรงกัน อ่านยากกว่ารูปที่ไม่สวยแต่สีตรงกัน

### Reusable SVG snippets

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

### Worked example — UI state mockup

This is the pattern used in `DockXI/docs/12-design-mockup.md` and should be the default for showing UI feature states:

```markdown
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
![Hover state showing magnified Projects tile](assets/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="assets/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file alongside the doc.

---

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

### Box-drawing characters

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

### Common patterns

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

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

---

## 4 · Mermaid

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams`**
ที่นี่บอกแค่ว่า *เมื่อไหร่ควรเลือก Mermaid แทนรูปแบบอื่น*

| เลือก Mermaid เมื่อ | เลือกอย่างอื่นเมื่อ |
|---|---|
| เป็นกล่องกับลูกศรที่เครื่องจัดวางให้ได้ | ต้องคุมตำแหน่งเอง → SVG หรือ `svg-diagram-system` |
| อยู่ในไฟล์ที่ต้อง diff ใน git | เป็นภาพหน้าจอจริง → ไฟล์ภาพ |
| ผู้อ่านเปิดใน GitHub หรือ Notion | ผู้อ่านเปิดในเอกสาร Word หรือสไลด์ → ไฟล์ภาพ |

---

## Combining formats in one doc

A full design spec usually mixes formats. Pattern from `DockXI/docs/12-design-mockup.md`:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't pick one format and force everything into it — each format has a sweet spot.

---

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

---

## Anti-patterns

- ❌ **Text-only design docs** — "the icon is in the top-right" with no picture
- ❌ **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- ❌ **PNG screenshots of text** — use the text, in a code block
- ❌ **SVG without `xmlns`** — GitHub silently fails to render
- ❌ **Inline SVG with 200+ lines** — extract to `assets/x.svg` and reference it
- ❌ **ASCII art outside a code fence** — proportional fonts will mangle alignment
- ❌ **Mixing Mermaid syntax versions** — stick to v10 syntax for GitHub compat
- ❌ **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- ❌ **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

---

## Quick-start recipe

When the user asks for a design / mockup:

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

If unsure whether a visual will render, mention that the user should preview in GitHub/Notion to confirm.

---

## Related skills

- [[polished-document-style]] — overall doc formatting, Mermaid catalogue, callout boxes
- [[simplicity-first]] — don't over-design the diagram; show what's needed
- [[software-diagrams]] — which diagram type answers which question, plus the shared Mermaid theme
- [[ui-craft]] — spacing, hierarchy and states when the picture is a screen

---

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ · รายละเอียดใน skill `spell-out-abbreviations`


---

# skill: ui-craft

Use on any task that produces a screen or screen spec, alongside the platform skill. One spacing scale, one type scale, one hierarchy per screen, accessible contrast, five screen states. Sets no colours or fonts.

# UI Craft

> **กฎข้อเดียวของ skill นี้:** หน้าจอที่ดูดีไม่ได้มาจากสีสวย มาจาก**ความสม่ำเสมอ**
> ระยะห่างมาจากสเกลเดียว ขนาดตัวอักษรมาจากสเกลเดียว และมีของสำคัญที่สุดแค่อย่างเดียวต่อหน้า

---

## เมื่อไหร่ใช้ skill นี้

- ทุกครั้งที่ทำ user interface (UI) — ใช้**คู่กับ** skill แพลตฟอร์ม ไม่ใช่แทนกัน
- หน้าจอ "ดูแปลก ๆ" แต่บอกไม่ถูกว่าผิดตรงไหน
- รีวิว UI ที่คนอื่นทำ
- แพลตฟอร์มที่ยังไม่มี skill เฉพาะ (เช่น แอป TV, kiosk, smart watch)

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ต้องการสี ฟอนต์ คอมโพเนนต์จริง ๆ | `web-app-design` · `windows-app-design` · `mobile-app-design` |
| กราฟและแผนภูมิข้อมูล | `web-app-design` ข้อ chart colors |
| เอกสารที่พิมพ์ออกมา | `branded-document-design` |
| สไลด์ | `presentation-design` |

**skill นี้ไม่กำหนดสีและไม่กำหนดฟอนต์** — เอาจาก skill แพลตฟอร์ม
ที่นี่คุมแค่ *ระยะ ขนาด ลำดับ และสถานะ*

---

## 1 · สเกลระยะห่าง — ใช้ชุดเดียวทั้งแอป

```
4  8  12  16  24  32  48  64
```

ทุก padding, margin, gap ต้องเป็นค่าใดค่าหนึ่งในนี้ ห้ามมี `13px` `18px` `22px`
ถ้ารู้สึกว่า `16` แน่นไป `24` ห่างไป — เลือก `16` แล้วแก้อย่างอื่นแทน
(ปกติปัญหาอยู่ที่ขนาดตัวอักษรหรือความยาวบรรทัด ไม่ใช่ระยะห่าง)

**ชนกับค่าใน skill แพลตฟอร์ม → สเกลนี้ชนะ** — ค่าระยะตัวอย่างที่อยู่นอกสเกล (เช่น `mobile-app-design/references/tokens.md` gap 9 · padding 14 · ขอบ 18) ให้ปัดเป็นค่าใกล้สุดในสเกล (8 · 12 หรือ 16 · 16) ตอนเอาไปใช้
สเกลนี้คุมแค่ padding · margin · gap — มุมโค้งและขนาดคอมโพเนนต์ (ปุ่ม 38 · มุม 13) skill แพลตฟอร์มเป็นคนกำหนด

**กฎระยะห่างที่คนมองข้ามบ่อยที่สุด:**

> ของที่เกี่ยวข้องกันต้องอยู่ใกล้กันมากกว่าของที่ไม่เกี่ยว

```
❌ label และ input ห่าง 16px     ❌ ระหว่างฟิลด์ห่าง 16px เท่ากัน
✅ label และ input ห่าง 8px      ✅ ระหว่างฟิลด์ห่าง 24px
```

ตาอ่านกลุ่มจากระยะห่าง ไม่ใช่จากเส้น — ถ้าจัดระยะถูก เส้นคั่นส่วนใหญ่จะไม่จำเป็น

**ระยะในการ์ด:** padding การ์ด ≥ gap ระหว่างของข้างใน เสมอ
การ์ด padding `16` แล้วข้างในห่างกัน `24` จะดูเหมือนของล้นออกนอกกรอบ

---

## 2 · สเกลตัวอักษร

อัตราส่วนคงที่ประมาณ 1.2–1.25 เท่า ต่อขั้น · **ใช้ไม่เกิน 5 ขนาดต่อหน้าจอ**

| ขั้น | ตัวอย่าง (เว็บ) | ใช้กับ |
|---|---|---|
| lg | 22 | หัวหน้าจอ · มีได้หน้าละ 1 |
| md | 15 | หัวการ์ด · หัวตาราง |
| base | 13 | เนื้อหาทั้งหมด |
| sm | 12 | label · คำอธิบายใต้ฟิลด์ |
| xs | 11 | timestamp · badge |

**ความสูงบรรทัด (line-height):**

| ขนาด | line-height | เหตุผล |
|---|---|---|
| หัวข้อใหญ่ | 1.2–1.3 | ตัวใหญ่อยู่แล้ว ไม่ต้องการอากาศ |
| เนื้อหา | 1.5–1.6 | ตาต้องหาต้นบรรทัดถัดไปเจอ |
| ภาษาไทย | +0.1 จากค่าข้างบน | สระบนล่างชนกัน |

**ความยาวบรรทัด:** 45–75 ตัวอักษร ยาวกว่านี้ตาหลงบรรทัด
บนหน้าจอกว้างให้จำกัดความกว้างคอลัมน์ข้อความ ไม่ใช่ปล่อยเต็มจอ

**ขนาดเล็กสุด 11** สำหรับข้อความที่ต้องอ่าน — สเกลของ skill แพลตฟอร์มมีขนาดให้เลือกมากกว่า 5 ได้ แต่**หนึ่งหน้าจอยังใช้ไม่เกิน 5** (ตัวเลขใหญ่โชว์ค่าหลักนับเป็นหนึ่งขนาด)

**น้ำหนักตัวอักษร:** ใช้ 2 น้ำหนักพอต่อหน้าจอ (ปกติ + หนา) — ฟอนต์มีครบ 400–700 ได้ แต่หน้าเดียวไม่ควรใช้เกิน 2
อยากเน้นให้เปลี่ยน**สี**หรือ**ขนาด** ก่อนจะเปลี่ยนน้ำหนักเป็นตัวที่ 3

---

## 3 · ลำดับสายตา — หนึ่งหน้าจอ หนึ่งของสำคัญ

ถามตัวเองก่อนวางองค์ประกอบ: **ผู้ใช้เปิดหน้านี้มาเพื่อทำอะไร**
ของชิ้นนั้นได้ความเด่นระดับ 1 ที่เหลือลดหลั่นลงไป

| ระดับ | วิธีทำให้เด่น | มีได้กี่อย่างต่อหน้า |
|---|---|---|
| 1 | สีแบรนด์ทึบ + ขนาดใหญ่สุด | **1** |
| 2 | ตัวหนา หรือ พื้นหลังอ่อน | 2–3 |
| 3 | สีข้อความปกติ | ไม่จำกัด |
| 4 | สีข้อความจาง | ไม่จำกัด |

**ทดสอบด้วยตา 2 วินาที:** หรี่ตามองหน้าจอ อะไรเด้งมาก่อน
ถ้าเด้งมาพร้อมกัน 4 อย่าง = ยังไม่มีลำดับ

**ปุ่มหลักมีได้ปุ่มเดียวต่อหน้าจอ** ที่เหลือเป็นปุ่มรอง (เส้นขอบ) หรือปุ่มเปล่า (ข้อความล้วน)
ปุ่มอันตราย (ลบ) เป็นปุ่มรองสีแดง ไม่ใช่ปุ่มทึบสีแดง — ไม่งั้นมันแย่งความเด่นไปจากงานหลัก

---

## 4 · แยกส่วนด้วยอะไร — เส้น เงา หรือพื้นหลัง

เลือกได้ 3 วิธี **ใช้วิธีเดียวต่อหนึ่งระดับความลึก** ปนกันเมื่อไหร่รกทันที

| วิธี | ใช้เมื่อ | ระวัง |
|---|---|---|
| ระยะห่างอย่างเดียว | แยกกลุ่มในพื้นที่เดียวกัน | **ลองอันนี้ก่อนเสมอ** |
| เส้น 1px สีอ่อน | ตาราง · รายการ · คั่นส่วน | เส้นต้องอ่อนกว่าที่คิด |
| พื้นหลังต่างเฉด | การ์ดบนพื้นหน้า | ต่างกัน 2–4% พอ |
| เงา | ของที่**ลอยจริง** เท่านั้น | modal · dropdown · toast |

> เงาไม่ใช่เครื่องประดับ มันแปลว่า "สิ่งนี้อยู่เหนือของอื่นและกดที่อื่นเพื่อปิดได้"
> การ์ดที่อยู่นิ่ง ๆ ในหน้าไม่ได้ลอย — ไม่ต้องมีเงา

**ความลึกมีได้ 3 ระดับพอ:** พื้นหน้า → การ์ด → ของลอย
เกินนี้ตาแยกไม่ออกแล้ว

**มุมโค้ง:** ใช้ 2–3 ค่า และ**ของข้างในต้องโค้งน้อยกว่าของข้างนอกเสมอ**
การ์ดโค้ง 14 รูปข้างในโค้ง 14 จะเห็นช่องว่างสามเหลี่ยมที่มุม — ข้างในควรเป็น 8–10

---

## 5 · ความต่างของสี — ตัวเลขที่ต้องผ่าน

| ของ | อัตราส่วนขั้นต่ำ |
|---|---|
| ข้อความปกติ | 4.5 : 1 |
| ข้อความ ≥ 19px หรือหนา | 3 : 1 |
| ขอบ input · ไอคอนที่สื่อความหมาย | 3 : 1 |
| เส้นคั่นตกแต่ง | ไม่มีเกณฑ์ |

ตรวจในเบราว์เซอร์: DevTools → เลือก element → ช่องสีใน Styles บอกค่าให้เลย
ไม่ใช่เบราว์เซอร์ (Flutter · native): คำนวณจากค่าสีใน token ตามสูตร Web Content Accessibility Guidelines (WCAG) — `(L1 + 0.05) / (L2 + 0.05)` เมื่อ L คือ relative luminance ของสีสว่างกว่า (L1) และเข้มกว่า (L2) — เขียนเป็น test สั้น ๆ ที่วนตรวจทุกคู่ข้อความ/พื้นทั้งโหมดสว่างและมืด หรือใช้เครื่องมือตรวจคอนทราสต์ตัวใดก็ได้ (Flutter มี `textContrastGuideline` ใน widget test)

**ข้อที่พลาดกันบ่อย:**

- ❌ ข้อความสีเทาจาง ๆ บนพื้นขาว เพราะ "ดูสะอาดดี" — อ่านไม่ออกบนจอโน้ตบุ๊กกลางแดด
- ❌ **สีเป็นตัวบอกสถานะอย่างเดียว** — คนตาบอดสีมองไม่เห็น ต้องมีไอคอนหรือข้อความคู่เสมอ
- ❌ placeholder แทน label — พอพิมพ์แล้วผู้ใช้ลืมว่าช่องนี้คืออะไร

---

## 6 · ห้าสถานะที่ทุกหน้าจอต้องมี

ออกแบบแค่สถานะ "มีข้อมูลครบสวยงาม" = ทำงานเสร็จ 20%

| สถานะ | ต้องมีอะไร | พลาดบ่อย |
|---|---|---|
| **ว่าง** | บอกว่าทำไมว่าง + ปุ่มทำอะไรต่อ | ขึ้นแค่ "ไม่มีข้อมูล" |
| **กำลังโหลด** | โครงร่างเทา (skeleton) ในรูปทรงของจริง | วงกลมหมุนกลางจอ = จอกระพริบ |
| **ผิดพลาด** | เกิดอะไร + ทำยังไงต่อ + ปุ่มลองใหม่ | โยน error จากระบบให้ผู้ใช้อ่าน |
| **มีบางส่วน** | ส่วนที่โหลดได้แสดงเลย ส่วนที่พังบอกเฉพาะจุด | ทั้งหน้าพังเพราะ widget เดียวล่ม |
| **สำเร็จ** | บอกให้รู้ แล้วหายไปเอง | เด้ง modal ให้กด "ตกลง" |

**สถานะว่างครั้งแรก ≠ สถานะว่างเพราะค้นหาไม่เจอ** — คนละข้อความ คนละปุ่ม

**แอปที่อ่าน hardware ใช้ 5 สถานะเดียวกัน แค่ต้นเหตุต่างกัน:**

| สถานะ | ตัวอย่าง (เครื่องวัดแสง) |
|---|---|
| ว่าง | ยังไม่ได้ให้สิทธิ์กล้อง → การ์ดอธิบายพร้อมปุ่มเดียว |
| กำลังโหลด | sensor กำลังอุ่นเครื่อง ยังไม่มีค่าแรก → โครงร่างของตัวเลข ไม่ใช่ `0` |
| ผิดพลาด | เครื่องไม่มี sensor · สิทธิ์ถูกบล็อก → บอกเหตุ + ทางไปต่อ (ใช้กล้องแทน · เปิดหน้าตั้งค่า) |
| มีบางส่วน | ค่าเกินช่วงที่วัดได้ (อิ่มตัว) → แสดง "มากกว่า X" ไม่ใช่ตัวเลขผิด ๆ |
| สำเร็จ | บันทึกจุดวัดแล้ว → SnackBar สั้น ๆ ที่ไม่บังปุ่ม |

**ข้อความ error ที่ใช้ได้:**

```
❌ Error 500: Internal Server Error
❌ เกิดข้อผิดพลาด กรุณาลองใหม่
✅ บันทึกไม่สำเร็จ เพราะเลขที่เอกสารนี้มีอยู่แล้ว
   เปลี่ยนเลขที่แล้วกดบันทึกอีกครั้ง [ลองใหม่]
```

---

## 7 · งบการเคลื่อนไหว

| ประเภท | เวลา | เส้นความเร็ว |
|---|---|---|
| hover · สีเปลี่ยน | 100–150ms | `ease-out` |
| เปิด/ปิด dropdown · toast | 150–250ms | `ease-out` |
| modal · หน้าเปลี่ยน | 250–350ms | `ease-in-out` |

**เกิน 400ms = ผู้ใช้รู้สึกว่าแอปช้า** ไม่ใช่ว่าแอปหรู

- ของที่**เข้ามา**เร็วกว่าของที่**ออกไป** ไม่ได้ — ออกควรเร็วกว่าหรือเท่ากัน
- อย่าเคลื่อนไหวของที่ผู้ใช้กำลังจะกด (ปุ่มขยับหนีนิ้ว)
- เคารพ `prefers-reduced-motion` — บางคนเวียนหัวจริง ๆ (Flutter: `MediaQuery.disableAnimationsOf(context)` เป็น `true` → ข้าม animation)
- **ไม่วาดใหม่เมื่อค่าที่แสดงไม่เปลี่ยน** — แจ้ง UI เมื่อค่าบนจอเปลี่ยนจริง (ค่าจาก sensor ที่สั่น: เปลี่ยนเกิน ~1 %) ค่ารองที่ค่อย ๆ ไหลอัปเดตราว 1 วินาทีครั้ง · วาดไม่หยุดกินแบต ทำให้โปรแกรมอ่านจอพูดซ้ำ และเครื่องมือทดสอบอ่านหน้าจอไม่ได้

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

---

## 8 · ความหนาแน่น — เลือกครั้งเดียวแล้วอยู่กับมัน

| แบบ | แถวสูง | เหมาะกับ |
|---|---|---|
| แน่น | 32–36px | ตารางข้อมูล · คนใช้ทั้งวัน · ต้องเห็นเยอะ ๆ พร้อมกัน |
| ปกติ | 40–44px | แอปทั่วไป |
| โปร่ง | 48–56px | หน้า marketing · แอปที่ใช้นาน ๆ ที |

**เป้าที่นิ้วกดได้ต้อง ≥ 44×44 pt บน iOS (Apple) · ≥ 48×48 dp บน Android (Material)** ถึงไอคอนจะเล็กกว่านั้นก็ตาม
(ขยายด้วย padding หรือ pseudo-element ไม่ใช่ขยายไอคอน)

**เลือกแบบแน่นแล้วห้ามมีแถวโปร่งแทรก** — ความหนาแน่นที่ไม่คงที่คือสิ่งที่ทำให้
หน้าจอ "ดูไม่เป็นระบบ" มากที่สุด และเป็นข้อที่คนมองข้ามมากที่สุด

---

## 9 · ตรวจงาน

เรนเดอร์ดูจริงเสมอ (skill แพลตฟอร์มบอกวิธีไว้แล้ว) แล้วไล่ตามนี้:

- [ ] หรี่ตามอง — มีของเด้งมาก่อนอย่างเดียวใช่ไหม
- [ ] วัดระยะห่าง 5 จุดแบบสุ่ม — อยู่ในสเกล `4 8 12 16 24 32 48 64` ทุกจุดไหม
- [ ] นับขนาดตัวอักษรในหน้า — เกิน 5 ขนาดไหม
- [ ] นับปุ่มทึบสีแบรนด์ — เกิน 1 ปุ่มไหม
- [ ] ของที่เกี่ยวข้องกันอยู่ใกล้กว่าของที่ไม่เกี่ยวไหม
- [ ] ครบ 5 สถานะไหม (ไม่ใช่แค่สถานะมีข้อมูล)
- [ ] ข้อความ error บอกว่า**ทำอะไรต่อ**ไหม
- [ ] contrast ผ่าน 4.5:1 ไหม
- [ ] สถานะที่บอกด้วยสี มีไอคอนหรือข้อความคู่ไหม
- [ ] มุมของข้างในโค้งน้อยกว่าของข้างนอกไหม
- [ ] เงามีเฉพาะของที่ลอยจริงไหม
- [ ] ย่อจอเหลือครึ่งหนึ่ง (เว็บ) · ตัวอักษรระบบ 200 % + หมุนจอแนวนอน (มือถือ) — พังตรงไหน

---

## 10 · Anti-patterns

- ❌ **แก้ "ดูไม่สวย" ด้วยการเพิ่มสี** — ปัญหาเกือบทุกครั้งคือระยะห่างไม่เป็นระบบ
- ❌ **เส้นคั่นทุกอย่าง** — ลองลบเส้นแล้วเพิ่มระยะห่างแทน ดีขึ้นเกือบทุกครั้ง
- ❌ **เงาใต้ทุกการ์ด** — เงาแปลว่าลอย การ์ดที่อยู่นิ่งไม่ได้ลอย
- ❌ **ตัวหนาเพื่อเน้น จนหนาไปหมดทั้งหน้า** — เมื่อทุกอย่างเน้น = ไม่มีอะไรเน้น
- ❌ **ขนาดตัวอักษรใหม่ทุกครั้งที่รู้สึกว่าไม่พอดี** — จบที่ 9 ขนาดในหน้าเดียว
- ❌ **สร้าง state ตอนเจอ bug** — ออกแบบทั้ง 5 สถานะตั้งแต่แรก
- ❌ **placeholder แทน label**
- ❌ **สีอย่างเดียวบอกสถานะ**
- ❌ **animation 600ms เพราะดูนุ่มนวลดี** — ผู้ใช้อ่านว่า "ช้า"
- ❌ **จัดกึ่งกลางข้อความยาว ๆ** — ตาหาต้นบรรทัดไม่เจอ ชิดซ้ายเสมอสำหรับเนื้อหา
- ❌ **ส่งงานโดยไม่เคยย่อจอดู** (มือถือ: ไม่เคยขยายตัวอักษรระบบดู)

---

## 11 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| สี ฟอนต์ คอมโพเนนต์จริงของเว็บ | `web-app-design` |
| แอป Windows | `windows-app-design` |
| แอปมือถือ | `mobile-app-design` |
| user flow ก่อนลงมือวาด | agent `ux-designer` |
| ไดอะแกรมประกอบ spec | `software-diagrams` |
| สไลด์นำเสนอ | `presentation-design` |
| ตัดของที่ไม่จำเป็นออก | `simplicity-first` |
| โลโก้ · โปสเตอร์ · โพสต์ · งานพิมพ์ | `graphic-design` |

---

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้ · รายละเอียดใน skill `spell-out-abbreviations`
