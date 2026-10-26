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

# skill: commit-message-format

Use when setting up commitlint or semantic-release, or a commit needs release rules (scope, BREAKING CHANGE). Everyday commits → commit-log.

# Conventional Commit Message Format

> When to commit and logging each step → `commit-log` (shared skill). This file adds the release side: scope, commitlint, semantic-release.

## When to use this skill

- Writing commits that feed release tooling (commitlint, semantic-release) — everyday commits use `commit-log`
- Reviewing commits in a PR for consistency
- Setting up commitlint / semantic-release

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

| Type | Use for | Triggers release? |
|------|---------|-------------------|
| `feat` | New feature | minor version bump |
| `fix` | Bug fix | patch version bump |
| `docs` | Documentation only | no |
| `style` | Formatting, no code change | no |
| `refactor` | Refactor without behavior change | no |
| `perf` | Performance improvement | patch |
| `test` | Adding/updating tests | no |
| `build` | Build system, dependencies | no |
| `ci` | CI/CD changes | no |
| `chore` | Maintenance tasks | no |
| `revert` | Revert previous commit | depends |

## Subject Rules

- **Imperative mood** — "add" not "added" or "adds"
- **Lowercase** — start with lowercase letter
- **No period at end**
- **Max 50 characters**
- **Complete this sentence:** "If applied, this commit will _____"

## Short and readable (applies to every commit)

Someone scanning `git log --oneline` should understand each line without opening the diff.

- **Measure the repo's norm, then follow it** — `git log --oneline -30` before the first commit: language, whether `scope` is used, which types appear, typical subject length. A repo that never uses scope does not get one from you; a repo at 40 characters does not get a 72-character subject. Note what you measured in the report once (idea from ECC conventional-commit-review).
- **Language follows the repo** — A Thai repo gets Thai descriptions; `type(scope):` stays English so tools can parse it. Lowercase and imperative mood apply to English only.
- **Subject says what changed for the reader**, not which file was touched: `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว`, not `fix: แก้ items.js บรรทัด 42`
- **One line is enough** for most commits. Add a body only when *why* is not obvious from the subject — at most 3 short lines or bullets
- **No filler** — no "this commit", "minor changes", "update code", "แก้นิดหน่อย", or a list of changed files (the diff already shows them)
- **One commit, one topic** — if the subject needs "and" or `·` to join unrelated changes, split the commit. Check `git diff --stat` before writing the subject: when the files fall into more than one topic (feature + unrelated rename, fix + formatting sweep), propose the split as a list of `<subject> → <files>` per commit and stage each with `git add <files>` or `git add -p`; never hide the second topic in the body

| ✗ Hard to read | ✓ Short and clear |
|---|---|
| `update items.js, server.js, add test, fix bug` | `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว` |
| `feat: implement new functionality for exporting the low-stock report data to CSV format` | `feat(report): ส่งออกรายงานของใกล้หมดเป็น CSV` |
| `refactor: แก้โค้ดให้ดีขึ้น` | `refactor(report): อ่านประวัติเบิกครั้งเดียวแทนทุกสินค้า` |

## Body Rules

- Separate from subject with blank line
- Wrap at 72 characters
- Explain **why**, not just **what** (diff shows what)
- Use bullet points if multiple points
- Reference issues/tickets at the end

## Footer Conventions

```
Closes #123              ← closes the issue
Refs #456                ← references but doesn't close
BREAKING CHANGE: ...     ← breaking change notice
Co-authored-by: ...      ← attribution
```

## Quality Checklist

- [ ] Type matches the change (not just "chore" for everything)
- [ ] Scope is meaningful (component/module name)
- [ ] Subject is imperative and ≤50 chars — Thai subjects count base consonants only (~50); vowels and tone marks do not count · กติกาเต็มอยู่ใน `superuser` skill `commit-log`
- [ ] Body explains WHY (if change isn't obvious)
- [ ] Breaking changes marked with `!` AND `BREAKING CHANGE:` footer
- [ ] Linked to issue/ticket when applicable

## Anti-patterns

- `update code`
- `fix bug`
- `WIP`
- `final commit` / `final final`
- Past tense: `added feature` (use `add feature`)
- Vague scope: `fix(misc): ...` (be specific)


---

# skill: markdown-report-docx

Use when one Markdown file must become a polished Word report (business, research, test, handover). Thesis or Independent Study (IS) → thesis-writing.

# Markdown Report → .docx

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและขั้นตอน ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียวของ skill นี้:** Markdown คือต้นฉบับ .docx คือผลที่สร้างจากต้นฉบับ
> แก้ที่ .md แล้วรันสคริปต์ใหม่ทุกครั้ง ไม่เปิด Word แก้มือ เพราะรอบหน้าจะหายหมด

ต้นแบบหน้าตามาจากรายงานโครงงาน X Fitness (29 หน้า · ใช้เป็นแบบอ้างอิงสไตล์เท่านั้น สีใช้ของโปรเจกต์ตัวเอง): ปกโลโก้กลางหน้า · สารบัญ · ตารางหัวสีแบรนด์อ่อน · กล่องหมายเหตุ · รูปพื้นเข้มพร้อมคำบรรยาย · ตารางสั้นไม่ขาดข้ามหน้า

## เมื่อไหร่ใช้

- รายงานธุรกิจ สรุปงานวิจัย รายงานโครงงาน รายงานส่งอาจารย์ รายงานผลทดสอบ เอกสารส่งมอบที่เนื้อหาเขียนเป็น Markdown อยู่แล้ว
- ต้องสร้างรายงานซ้ำหลายรอบ (ตัวเลขหรือผลทดสอบเปลี่ยน → รันใหม่ ได้ไฟล์หน้าตาเดิม)

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ |
|---|---|
| เอกสารทางการแบบปกมีแถบสี กล่อง metadata ตารางลงนาม (ข้อกำหนดความต้องการซอฟต์แวร์ (Software Requirements Specification — SRS) · เอกสารความต้องการทางธุรกิจ (Business Requirements Document — BRD) · ข้อเสนอ) | `branded-document-design` เรียก `BrandDoc` ตรง |
| สไลด์นำเสนอ | `presentation-design` (ตารางบนสุดเลือก .pptx · .html · แปลง) |
| เอกสารที่อยู่ในรีโปเป็น Markdown อย่างเดียว | `polished-document-style` |
| วิทยานิพนธ์ · IS · บทความวิจัย | `personal-life:thesis-writing` ก่อน (ถ้าติดตั้ง) — คู่มือคณะคุมโครงเล่มและการจัดหน้า สคริปต์นี้ใช้ทำ .docx ต่อได้ |

---

## 1 · ขั้นตอน

1. เขียนเนื้อหาใน `docs/src/<ชื่อ>.md` (ต้นฉบับถาวร ตาม `document-naming` ข้อ 1) ตาม `polished-document-style` (plugin `superuser`) · ใส่ front matter (ข้อ 2)
2. รัน `python scripts/md_to_docx.py docs/src/<ชื่อ>.md -o docs/<ชื่อไฟล์ส่งมอบ>.docx --pdf`
   - สคริปต์ใช้ `brandkit.py` จาก `branded-document-design/scripts/` ที่อยู่ข้างกัน ต้องมี `python-docx`
   - `--pdf` ใช้ Word บน Windows (อัปเดตสารบัญให้ด้วย) ไม่มี Word → LibreOffice · PDF นี้ไว้ตรวจข้อ 5 — ส่งเฉพาะคู่มือผู้ใช้หรือเมื่อลูกค้าขอ นอกนั้นย้ายไป `_to_delete/` (`document-naming` ข้อ 1)
3. แปลง PDF เป็นภาพแล้ว**เปิดดูทุกหน้า** ตามข้อ 5 · เจอปัญหา → แก้ที่ .md แล้วรันใหม่
4. ตั้งชื่อไฟล์ส่งมอบตาม `document-naming` (plugin `superuser`) เช่น `CLINIC-RPT-project-v1.0-DRAFT.docx`

ลองดูตัวอย่างครบทุกองค์ประกอบ: `python scripts/md_to_docx.py assets/example-report.md --pdf`

## 2 · Front matter

```yaml
---
title: Clinic Booking Assistant              # ชื่อใหญ่สีแบรนด์บนปก
subtitle: เอกสารการพัฒนาโครงงานและผลการทดสอบ   # บรรทัดรองตัวหนา
meta: วิชา 01234567 · ฉบับ 1.2 · 10 ตุลาคม 2569 # บรรทัดเล็กใต้ชื่อรอง
note: ผู้พัฒนา 6500001 ชื่อ นามสกุล             # ตัวเอียงสีเทา (ไม่บังคับ)
logo: ../assets/logo-on-light.png             # path เทียบกับไฟล์ .md (ไม่บังคับ)
logo_width_cm: 6.5
brand: 2A78D6          # สีหลักของโปรเจกต์ (ลำดับใน diagram-figures ข้อ 5) · ตัวอย่างนี้ = ค่าประจำบ้าน · หัวข้อ H1 ชื่อปก เลขข้อ
brand_deep: 1B4E8B     # หัวข้อ H2 ตัวหนังสือหัวตาราง โค้ดในบรรทัด
brand_tint: EAF2FB     # พื้นหัวตาราง
brand_tint_2: F4F8FD   # พื้นแถวสลับ (ตารางเกิน 6 แถว)
---
```

ค่าเสริม: `brand_2` (สี accent รอง) · `toc: no` (ไม่ใส่สารบัญ) · `footer: Page` (คำหน้าเลขหน้า ค่าเริ่มต้น "หน้า") · `figure_width_cm` (ค่าเริ่มต้น 17) · `cover_top_pt` (ระยะจากขอบบนถึงโลโก้ ค่าเริ่มต้น 150)

**สีมาจากเจ้าของงาน** — หาตามลำดับใน `diagram-figures` ข้อ 5 (ระบบสี) · หาไม่เจอเลย → ใส่ `brand: 2A78D6` (ค่าประจำบ้าน) เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม · ห้ามคัดลอกสีจากตัวอย่างหรือรายงานต้นแบบ · `brand_tint` ต้องอ่อนพอให้ตัวหนังสือ `brand_deep` อ่านชัด (contrast ≥ 7:1 ทั้งบนพื้นขาวและ `brand_tint` — สคริปต์ตรวจให้ ไม่ผ่านจะหยุดพร้อมบอกค่า)

## 3 · Markdown แต่ละแบบกลายเป็นอะไร

| เขียนใน .md | ได้ใน .docx |
|---|---|
| `# 1. หัวข้อ` · `##` · `###` | หัวข้อ 3 ระดับ สีแบรนด์ อยู่ในสารบัญ ไม่ค้างท้ายหน้า · **ใส่เลขข้อเอง** |
| ย่อหน้า มี `**ตัวหนา**` · `` `โค้ด` `` | เนื้อความเทาเข้ม · ตัวหนาสีเข้ม · โค้ดฟอนต์ monospace สี `brand_deep` |
| ตาราง `\| … \|` | หัวพื้น `brand_tint` · คอลัมน์แรกตัวหนา · กว้างตามความยาวข้อความ · เกิน 6 แถวมีแถวสลับสี · ไม่เกิน 8 แถวอยู่หน้าเดียวกันทั้งตาราง · หัวตารางซ้ำเมื่อข้ามหน้า |
| `> ข้อความ` | กล่อง "หมายเหตุ" พื้นเทา |
| `> [!TIP]` · `[!WARNING]` · `[!IMPORTANT]` · `[!CAUTION]` · `[!NOTE]` | กล่องข้อแนะนำ · ข้อควรระวัง · สำคัญ · อันตราย · หมายเหตุ |
| `![คำบรรยาย](path.png)` | รูปกลางหน้า + "รูปที่ N — คำบรรยาย" ตัวเอียง อยู่หน้าเดียวกับรูป |
| `1. …` | เลขข้อสีแบรนด์ ตั้งเลขใหม่ทุกรายการ |
| `- …` | bullet |
| ```` ``` ```` | กล่องโค้ดพื้นเทา |
| `<!-- pagebreak -->` | ขึ้นหน้าใหม่ |
| `---` · `<!-- อื่น ๆ -->` | ข้าม |

บรรทัดที่อยู่ก่อนตาราง (ย่อหน้านำหรือกล่องหมายเหตุ) ถูกผูกให้อยู่หน้าเดียวกับตาราง

## 4 · กฎเขียนให้ออกมาสวย

- **ตารางคือเครื่องมือหลัก** — ข้อมูลที่มีหัวข้อ + รายละเอียดเขียนเป็นตาราง 2 คอลัมน์ ดีกว่าย่อหน้ายาว
- **เซลล์ตารางไม่เกิน ~170 ตัวอักษร** — ยาวกว่านั้นตัดไปเขียนใต้ตาราง
- **รูปพื้นเข้มหรือพื้นขาวเลือกแบบเดียวทั้งเล่ม** · กว้าง 1600–2000 px · วาดด้วย [`diagram-figures`](../diagram-figures/SKILL.md) แล้ว export PNG
- **ผลทดสอบมาจากไฟล์ผลจริง** — สร้างตารางผลด้วยสคริปต์แล้วแทรกระหว่าง `<!-- RESULTS:START -->` กับ `<!-- RESULTS:END -->` ใน .md ก่อนรัน ไม่พิมพ์ตัวเลขเอง
- **ข้อมูลจำลองต้องบอก** — กล่องหมายเหตุ 1 บรรทัดตั้งแต่หน้าแรกของเนื้อหา

## 5 · ตรวจด้วยตา — ห้ามข้าม

```bash
python -c "import pymupdf; d=pymupdf.open('report.pdf'); [p.get_pixmap(dpi=70).save(f'_to_delete/p{i+1:02}.png') for i,p in enumerate(d)]"
```

เปิดภาพทุกหน้า (Read tool) แล้วไล่เช็ก:

- [ ] ปก: โลโก้ไม่แตก ชื่อไม่ขึ้นบรรทัดใหม่กลางคำ
- [ ] สารบัญมีเลขหน้าครบ (ว่าง → เปิดใน Word กด F9 หรือใช้ `--pdf` บน Windows)
- [ ] ไม่มีหน้าที่เกือบว่าง · ไม่มีหัวข้อค้างท้ายหน้า · คำบรรยายรูปไม่หลุดไปหน้าถัดไป
- [ ] คอลัมน์ตารางไม่ตัดชื่อหรือรหัสกลางคำ — ถ้าตัด ย่อข้อความในคอลัมน์ที่ยาวที่สุด
- [ ] สีแบรนด์ตรงกับโลโก้ (ไม่มีแบรนด์ → ค่าประจำบ้าน + `(รอยืนยัน)`) · ไม่มีสีฟ้าค่าเริ่มต้นของ Word หลงเหลือ
- [ ] ไม่มี placeholder `[...]` หลงเหลือ · `(รอยืนยัน)` ไม่ใช่ placeholder ให้คงไว้ และทุกจุดอยู่ในรายการรอยืนยันของรายงาน

## 6 · Anti-patterns

- **แก้ .docx ใน Word แล้วส่ง** — รันใหม่เมื่อไรก็หาย · แก้ที่ .md
- **ใช้ List Number ของ Word** — นับต่อข้ามรายการ สคริปต์จึงใส่เลขเอง
- **ภาพหน้าจอขนาดเล็กขยายเต็มหน้า** — แตก ให้ถ่ายใหม่ที่ความกว้าง ≥ 1600 px
- **ตารางกว้าง 7 คอลัมน์ขึ้นไปในหน้าแนวตั้ง** — แยกเป็น 2 ตาราง
- **ส่งโดยไม่ได้เปิดดู PDF** — ดูข้อ 5

## 7 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้ |
|---|---|
| เพิ่มองค์ประกอบที่สคริปต์ไม่มี (KPI · pill · ลงนาม · หน้าแนวนอน) | เรียก `BrandDoc` ใน [`branded-document-design`](../branded-document-design/SKILL.md) ต่อจาก `build()` |
| สไลด์คู่กับรายงานชุดเดียวกัน สีเดียวกัน | [`presentation-design`](../presentation-design/SKILL.md) (ตารางบนสุดเลือก .pptx · .html · แปลง) |
| ชื่อไฟล์และเวอร์ชัน | `document-naming` (plugin `superuser`) |
| รูปในรายงาน | [`diagram-figures`](../diagram-figures/SKILL.md) |
| ปกเฉพาะโปรเจกต์ (มีโลโก้และ mockup แล้ว) | `doc-cover-design` (plugin `software-company`) |
