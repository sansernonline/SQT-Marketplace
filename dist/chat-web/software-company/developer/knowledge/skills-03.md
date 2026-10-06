# skill: pr-description-template

Use when writing a pull request description, preparing a PR for review, or documenting changes for merge. Provides reviewers with context, testing details, and screenshots needed to review effectively.

# Pull Request Description Template

## When to use this skill

- Opening any pull request
- Updating a PR description after major changes
- Onboarding team to consistent PR practices

## Output Template

```markdown
## Summary
<2-4 sentence explanation of what this PR does and why>

## Linked Issues
- Closes #XXX
- Refs #YYY

## Changes
- ✨ Added: ...
- 🔧 Changed: ...
- 🐛 Fixed: ...
- 🗑️ Removed: ...

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change)
- [ ] ✨ New feature (non-breaking change)
- [ ] 💥 Breaking change (fix or feature that breaks existing behavior)
- [ ] 📚 Documentation update
- [ ] 🔧 Refactor (no functional change)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test additions/updates
- [ ] 🏗️ Build/CI changes

## How to Test
1. Pull this branch
2. Run `<command>`
3. Verify ...
4. Try edge case: ...

## Screenshots / Demos
| Before | After |
|--------|-------|
| <img>  | <img> |

## Checklist
- [ ] My code follows the project style guide
- [ ] I have performed self-review of my code
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] I have updated documentation as needed
- [ ] No new linter warnings
- [ ] No console.log / debug code left
- [ ] Breaking changes are documented

## Breaking Changes
<describe what breaks and migration path, OR write "None">

## Performance Impact
<measurements if applicable, OR write "No significant impact">

## Security Considerations
<note any security implications, OR write "None">

## Deployment Notes
<env var changes, migrations, feature flags needed, OR "Standard deployment">

## Notes for Reviewer
<anything reviewer should pay attention to, gotchas, alternative approaches considered>
```

## Size Guidelines

| Lines changed | Review difficulty | Recommendation |
|--------------|-------------------|----------------|
| < 100 | Easy | ✅ Ideal size |
| 100-400 | Moderate | ✅ Acceptable |
| 400-800 | Hard | ⚠️ Consider splitting |
| > 800 | Very hard | ❌ Should be split |

If your PR is huge, split into:
1. Refactoring PR (no behavior change)
2. Feature PR (small, focused)
3. Test PR (adding coverage)

## Summary Writing

❌ Bad summaries:
- "Fixes bug"
- "Updates code"
- "See ticket"

✅ Good summaries:
- "Prevents double-charging customers when payment provider times out, by adding idempotency key to charge API calls"
- "Adds email verification step during signup to reduce spam accounts; sends 6-digit code via existing email service"

**Structure:** What changed + Why it matters + Brief how

## Screenshots Best Practices

- Always for UI changes
- Show before AND after side-by-side
- Highlight the actual change with arrows/circles
- Include mobile view if responsive
- Use GIFs for interactions (max 30 sec)

## Reviewer-Friendly Tips

- Tag specific people for areas they know
- Mention if breaking change requires coordination
- Note non-obvious decisions in code comments
- Reply to your own PR with "Self-review notes" for tricky parts
- Mark draft PRs as Draft until ready

## Anti-patterns

- ❌ Empty description: "see code"
- ❌ Linking ticket without explanation in PR
- ❌ Massive PR with 1000+ lines mixed concerns
- ❌ No screenshots for UI changes
- ❌ "Testing: tested locally" with no detail
- ❌ Pushing right before merge deadline with no time to review

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.


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

# skill: spec-to-code-loop

Use when building from a spec and mockups as a repeating loop (failing test, code, check screen, record progress) with a stop condition, state file and retry ceiling. Inside agent-team this is the feature and new-project playbooks.

> **ใน A-Team:** ลูปนี้คือแกนของ playbook [`feature`](../agent-team/references/playbook-feature.md) และ [`new-project`](../agent-team/references/playbook-new-project.md) · ถ้าเปิด agent-team อยู่ ให้ทำตาม playbook แล้วใช้ไฟล์นี้เป็นรายละเอียดของลูป

# วงรอบจากข้อกำหนดไปเป็นโค้ด

> **กฎข้อเดียว:** วงรอบต้องมีเงื่อนไขหยุดที่**รันแล้วรู้ผลทันที**
> "ทำตามข้อกำหนดให้เสร็จ" เครื่องตรวจไม่ได้ · "test ทั้ง 47 ตัวเขียว" ตรวจได้

---

## ต้องมีครบก่อนเริ่ม

| สิ่งที่ต้องมี | ถ้าไม่มี |
|---|---|
| ข้อกำหนดที่แต่ละข้อทดสอบได้ มีรหัสกำกับ เช่น `FR-AUTH-010` | หยุด ใช้ `srs-writing` ทำให้ทดสอบได้ก่อน |
| คำสั่งรัน test ที่รันได้จริงหนึ่งบรรทัด | หยุด ตั้งค่าโครง test ก่อน ใช้ `testing-standards` |
| คำสั่งรันแอปขึ้นมาดูได้ (ถ้ามีหน้าจอ) | ข้ามขั้นเทียบภาพไปก่อน แล้วบอกผู้ใช้ว่าข้าม |
| ภาพ mockup ที่ตั้งชื่อตรงกับหน้าจอ | UI จะไม่มีวันตรง — ขอจากผู้ใช้ |

**ไม่ครบแล้วยังเริ่ม = เขียนโค้ดที่ไม่มีใครรู้ว่าถูกหรือผิด**

---

## 1 · รอบที่ศูนย์ — วางแผน ยังไม่เขียนโค้ด

อ่านข้อกำหนดและ mockup ให้ครบก่อน แล้วแตกเป็นงานย่อย **งานละหนึ่งข้อกำหนด**
เขียนลง `docs/BUILD-PLAN.md`

```markdown
| # | รหัส | สิ่งที่ต้องได้ | ไฟล์ที่จะแตะ | test ที่จะเขียน | สถานะ | commit |
|---|---|---|---|---|---|---|
| 1 | FR-AUTH-010 | ล็อกอินด้วยอีเมลและรหัสผ่าน | auth/login.ts · auth/session.ts | login_FR-AUTH-010 | รอทำ | |
| 2 | FR-AUTH-020 | ล็อกผู้ใช้หลังผิด 5 ครั้ง | auth/lockout.ts | lockout_FR-AUTH-020 | รอทำ | |
```

**ข้อไหนกำกวมจนเขียน test ไม่ได้ ห้ามเดา** — รวมเป็นรายการคำถามท้ายไฟล์ และใน **"ค้างอยู่"** ครั้งเดียว แล้วทำข้ออื่นต่อ

> คำถามที่ต้องถาม ไม่ใช่เดา: ค่าขอบเขตเป็นเท่าไหร่ · ผิดแล้วต้องเกิดอะไร ·
> ใครเห็นข้อมูลนี้ได้บ้าง · ถ้าของเดิมมีอยู่แล้วจะทับหรือจะเตือน

จบรอบที่ศูนย์ **ต้องหยุด** ให้ผู้ใช้อ่านแผนก่อน — อย่าไหลต่อไปเขียนโค้ดเอง

---

## 2 · วงรอบต่อหนึ่งข้อกำหนด

```
อ่าน BUILD-PLAN.md  →  หยิบข้อแรกที่ยังไม่ทำ
  1. เขียน test ก่อน  ชื่อ test มีรหัสข้อกำหนดอยู่ในชื่อ
  2. รัน test ให้เห็นว่า "แดง"        ← ข้ามขั้นนี้ไม่ได้
  3. เขียนโค้ดจน test เขียว
  4. รัน test ทั้งชุด                  ← กันของเดิมพัง
  5. หน้าจอ: ถ่ายภาพจริงเทียบ mockup   ← ข้อ 5 ข้างล่าง
  6. อัปเดตสถานะใน BUILD-PLAN.md + commit หนึ่งข้อต่อหนึ่ง commit
  →  วนข้อถัดไป
```

**ขั้นที่ 2 คือขั้นที่คนข้ามบ่อยที่สุดและแพงที่สุด** — test ที่ไม่เคยเห็นแดง
คือ test ที่อาจผ่านตลอดไม่ว่าโค้ดจะถูกหรือผิด

---

## 3 · กฎเหล็ก

1. **ห้ามแก้หรือลบ test เพื่อให้ผ่าน** — test แดงแปลว่าโค้ดผิด ไม่ใช่ test ผิด
   จะแก้ test ได้ต่อเมื่อพิสูจน์ได้ว่า test เขียนผิดจากข้อกำหนด และต้องบอกผู้ใช้ทุกครั้ง
2. **หนึ่งข้อต่อหนึ่งรอบ** — ห้ามรวบหลายข้อเพราะ "มันคล้ายกัน"
3. **เพดานการลองซ้ำคือ 3 ครั้ง** — ติดข้อเดียวเกินสามรอบ ให้**หยุดแล้วรายงาน**
   ว่าติดอะไร ลองอะไรไปแล้ว และคิดว่าปัญหาอยู่ที่ไหน · อย่าลองต่อไปเรื่อย ๆ
4. **ห้าม mock สิ่งที่กำลังทดสอบ** — mock ของข้างนอกได้ mock ตัวเองไม่ได้
5. **ห้ามข้ามไปทำข้อที่ง่ายกว่า** เพราะข้อปัจจุบันติด — ลำดับในแผนคือลำดับจริง

---

## 4 · ไฟล์สถานะ — context หมดแน่นอน

วงรอบยาวกว่าหน่วยความจำของรอบสนทนาเสมอ **สถานะต้องอยู่ในไฟล์ ไม่ใช่ในหัว**

- `docs/BUILD-PLAN.md` — แผนและสถานะ · **อ่านไฟล์นี้ก่อนเริ่มทุกรอบ**
  นี่คือไฟล์เดียวที่วงรอบนี้เพิ่มเข้าไปในโฟลเดอร์เอกสารหลัก
- สถานะมีสี่ค่าเท่านั้น: `รอทำ` · `กำลังทำ` · `เสร็จ` · `ติด`
- `ติด` ต้องมีเหตุผลต่อท้ายหนึ่งบรรทัด
- ทุกข้อที่ `เสร็จ` ต้องมีเลข commit — ไม่มีเลข แปลว่ายังไม่เสร็จจริง
- จบทุกรอบ อัปเดตหัวข้อ `## สถานะล่าสุด` และ `## ประวัติสถานะ` บนสุดของไฟล์ตาม `status-report` — ตารางงานกับตารางสถานะอยู่ไฟล์เดียวกันแต่คนละหัวข้อ

**เริ่มรอบใหม่แล้วไม่อ่านไฟล์นี้ก่อน คือสาเหตุอันดับหนึ่งที่งานย้อนกลับไปทำซ้ำ**

### ไฟล์ที่วงรอบสร้างขึ้นระหว่างทาง — ไปที่ `_to_delete/` ทั้งหมด

เอกสารข้อกำหนดมักเป็น `.docx` หรือ `.pdf` ที่ต้องแปลงเป็นข้อความก่อนถึงจะอ่านซ้ำได้ถูก
**ไฟล์ที่แปลงออกมาไม่ใช่เอกสาร** เป็นของใช้ชั่วคราวของวงรอบ

```
_to_delete/
  extracted/       ← .docx .pdf ที่แปลงเป็น .md แล้ว
  check/           ← ภาพหน้าจอที่ถ่ายไว้เทียบ mockup
  logs/            ← ผลรัน test ที่เก็บไว้ดูย้อนหลัง
```

| ไฟล์ | ไปไหน |
|---|---|
| เอกสารที่แปลงรูปแบบมาให้อ่านง่าย | `_to_delete/extracted/` |
| ภาพหน้าจอที่ถ่ายไว้ตรวจ | `_to_delete/check/` |
| ผลรัน test · log | `_to_delete/logs/` |
| แผนและสถานะ `BUILD-PLAN.md` | `docs/` — เป็นเอกสารจริง |
| โค้ดและ test | โฟลเดอร์โปรเจกต์ |

**ห้ามเขียนไฟล์แปลงลง `docs/` ปนกับเอกสารต้นฉบับ** — อีกสามเดือนไม่มีใครรู้ว่า
ไฟล์ไหนคือของจริงที่ลูกค้าเซ็นรับ และไฟล์ไหนคือของที่เครื่องแปลงมา

รายละเอียดเต็มอยู่ใน `temp-file-discipline`

---

## 5 · เทียบ mockup ด้วยภาพจริง

อ่านโค้ดแล้วบอกว่า "ตรงแล้ว" ใช้ไม่ได้ ต้องเปิดจริงแล้วดู

```python
page.set_viewport_size({"width": 1280, "height": 900})   # ให้เท่ากับความกว้าง mockup
page.goto(url); page.wait_for_timeout(500)
page.screenshot(path="_to_delete/check/login.png")
```

แล้วเปิดทั้งสองภาพดูเทียบกัน ห้าข้อนี้:

- [ ] ลำดับและการจัดกลุ่มขององค์ประกอบตรงกันไหม
- [ ] ระยะห่างและขนาดตัวอักษรใกล้เคียงไหม (ไม่ต้องเป๊ะพิกเซล)
- [ ] สถานะที่ mockup แสดงไว้ มีครบไหม — ว่าง · กำลังโหลด · ผิดพลาด
- [ ] ข้อความตรงกับ mockup ไหม หรือไปแต่งเอง
- [ ] ภาษาไทยตกบรรทัดหรือสระหายไหม

ต่างตรงไหน**บอกเป็นรายการ** อย่าเงียบแล้วเคลมว่าเสร็จ
ภาพที่ถ่ายไว้ตรวจเป็นไฟล์ชั่วคราว — ไปที่ `_to_delete/` ตาม `temp-file-discipline`

---

## 6 · การสืบย้อน

ชื่อ test ต้องมีรหัสข้อกำหนดอยู่ในชื่อ เช่น `test_lockout_after_5_failures_FR_AUTH_020`
เพราะทำให้ค้นได้ด้วยคำสั่งเดียวว่าข้อไหนยังไม่มี test ครอบ

ปิดงานด้วยตารางสืบย้อน: ข้อกำหนดทุกข้อ → test ที่ครอบ → ผลล่าสุด

> **ข้อไหนไม่มี test ครอบ ให้บอกตรง ๆ ว่าไม่มี** — ห้ามเขียน test ตื้น ๆ มาเติมให้ตารางเต็ม
> ตารางที่เต็มเพราะเติมเอง อันตรายกว่าตารางที่มีช่องว่าง

---

## 7 · เมื่อไหร่แตกหลาย agent

**เกณฑ์เดียว: ไฟล์ที่จะแตะต้องไม่ทับกันเลย** — ดูคอลัมน์ "ไฟล์ที่จะแตะ" ในแผน

| แตกได้ | แตกไม่ได้ |
|---|---|
| คนละโมดูล คนละหน้าจอ ไฟล์ไม่ทับกัน | แตะไฟล์เดียวกันแม้แต่ไฟล์เดียว — งานจะทับกัน |
| agent ตรวจงานแบบ**อ่านอย่างเดียว** วิ่งคู่กับ agent ที่เขียนโค้ด | งานที่ต้องรอผลจากอีกงานอยู่แล้ว |
| แปลงข้อกำหนดเป็น test หลายโมดูลพร้อมกัน | ตอนยังไม่มีแผน — ต้องมีแผนก่อนถึงจะรู้ว่าแตกตรงไหนได้ |

ทุก agent ที่แตกออกไปต้องได้รับ: รหัสข้อที่รับผิดชอบ · รายการไฟล์ที่แตะได้ ·
คำสั่งรัน test · และกฎข้อ 3 ทั้งหมด

**ห้ามให้ agent ที่แตกออกไปแก้ `BUILD-PLAN.md` เอง** — ให้รายงานกลับ แล้วตัวหลักเขียนไฟล์เดียว
ไม่งั้นไฟล์สถานะจะพังก่อนโค้ด

---

## 8 · สัญญาณว่าวงรอบกำลังพัง

| อาการ | ความหมายจริง |
|---|---|
| test เขียวหมดตั้งแต่รอบแรกโดยไม่เคยแดง | test ไม่ได้ทดสอบอะไร |
| จำนวน test เพิ่มเร็วกว่าจำนวนข้อกำหนดที่ปิด | กำลังเขียน test ให้ตัวเองผ่าน |
| commit เดียวแตะ 15 ไฟล์ | รวบหลายข้อ ย้อนกลับไม่ได้แล้วเมื่อพัง |
| ข้อเดิมวนเกิน 3 รอบ | ข้อกำหนดกำกวม ไม่ใช่โค้ดยาก — กลับไปถาม |
| ไม่มีใครอัปเดต `BUILD-PLAN.md` มาสองรอบ | สถานะอยู่ในหัว รอบหน้าจะทำซ้ำ |

---

## 9 · Anti-patterns

- ❌ **โยนข้อกำหนดทั้งฉบับให้รอบเดียว** — เหตุผลอันดับหนึ่งที่ได้โค้ดมั่ว
- ❌ **เขียนโค้ดก่อนแล้วค่อยเขียน test ตาม** — ได้ test ที่ยืนยันสิ่งที่เพิ่งเขียน ไม่ใช่สิ่งที่ต้องการ
- ❌ **เดาเมื่อข้อกำหนดกำกวม** — ผิดตั้งแต่ต้น แต่จะรู้ตอนส่งมอบ
- ❌ **แก้ test ให้ผ่าน** แล้วรายงานว่าเสร็จ
- ❌ **แตก agent ขนานบนไฟล์เดียวกัน**
- ❌ **เคลมว่า UI ตรง mockup โดยไม่เคยเปิดดู**
- ❌ **ปิดงานโดยไม่มีตารางสืบย้อน** — ไม่มีใครรู้ว่าอะไรยังไม่ได้ทำ

---

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ทำข้อกำหนดให้ทดสอบได้ก่อน | `srs-writing` |
| แปลงข้อกำหนดเป็น test case | `test-case-template` |
| โครง test กรอบทดสอบ ชื่อ ความครอบคลุม | `testing-standards` |
| test ระดับเปิดเบราว์เซอร์จริง | `e2e-testing-patterns` |
| เขียนโค้ดให้เรียบง่ายที่สุดที่ใช้ได้ | `lazy-coding` |
| แก้เมื่อ test แดงหรือผลไม่ตรง | `targeted-fix` |
| รูปแบบข้อความ commit | `commit-message-format` |
| ไฟล์ภาพที่ถ่ายไว้ตรวจ | `temp-file-discipline` |
| บันทึกสถานะข้ามรอบสนทนา | `work-session-context` |
| ตารางสรุปสถานะเมื่อจบรอบ | `status-report` |

---

## ตัวย่อ

- **test** — ชุดทดสอบอัตโนมัติ
- **mockup** — ภาพต้นแบบหน้าจอ
- **commit** — การบันทึกการเปลี่ยนแปลงลงระบบควบคุมเวอร์ชัน
- **UI** — User Interface (ส่วนติดต่อผู้ใช้)


---

# skill: testing-standards

Use when adding, reviewing or setting up automated tests in .NET, Node, Python, Angular or Flutter, or when a test suite is slow or flaky. Uses the project's existing framework and sets what to test, naming and honest coverage.

# Testing Standards

> **กฎข้อเดียว:** test ที่ไม่มีใครเชื่อถือ แย่กว่าไม่มี test
> test ที่แดงสลับเขียวเองจะถูก `skip` ภายในสองสัปดาห์ แล้วทั้งชุดจะตายตามกันไป

## เมื่อไหร่ใช้ skill นี้

- เริ่มวาง test ในโปรเจกต์ใหม่ หรือเพิ่ม test ให้โค้ดที่มีอยู่
- มีคนขอ "ให้มี unit test / automate test"
- ชุด test เดิมช้า แดง ๆ เขียว ๆ หรือไม่มีใครดูแล้ว

## เมื่อไหร่ **ไม่** ใช้

- E2E ผ่านเบราว์เซอร์ (Playwright/Cypress) → `e2e-testing-patterns`
- ขับแอปมือถือจริงบน emulator → `app-verifier-setup` (`references/android-native.md`)
- ออกแบบ test case เชิงธุรกิจก่อนลงมือเขียน → `test-case-template`

---

## 1 · ขั้นแรก: ใช้ของที่มี ถามเฉพาะตอนต้องเพิ่มตัวใหม่

- **โปรเจกต์มี framework อยู่แล้ว หรือสแต็กมี test library มากับ SDK** (Flutter `flutter_test` · Angular CLI) → ใช้เลย ไม่ต้องถาม
- **ต้องลงแพ็กเกจ test ตัวใหม่** → ใส่คำถามนี้ในการถามครั้งเดียวก่อนเริ่มงาน (ถ้าเครื่องมือมีหน้าต่างให้เลือกคำตอบ เช่น `AskUserQuestion` ให้ใช้ตัวนั้น) — เพราะการเลือกผิดแล้วย้ายทีหลังแพงมาก
- เริ่มงานไปแล้วเพิ่งรู้ว่าต้องเลือก → เลือกตัว**แนะนำ**ในตาราง ทำต่อ แล้วบันทึกไว้ในหัวข้อ "ตัดสินใจเอง" ของรายงาน ไม่หยุดถามกลางทาง

สองเรื่องที่ต้องตกลง:

**ข้อ 1 — framework**

| สแต็ก | ตัวเลือกที่ควรเสนอ |
|---|---|
| .NET | **xUnit** (แนะนำ · เป็นมาตรฐานของ .NET ยุคใหม่) · NUnit (ทีมมาจาก NUnit เดิม) · MSTest (องค์กรที่ผูกกับ VS) |
| Node/TS | **Vitest** (แนะนำ · เร็ว ตั้งค่าน้อย ใช้ ESM/TS ได้เลย) · Jest (ระบบนิเวศใหญ่ที่สุด) · `node:test` (ไม่อยากลงอะไรเลย) |
| Python | **pytest** (แนะนำ) · `unittest` (stdlib ล้วน ห้ามลงแพ็กเกจเพิ่ม) |
| Angular | **Vitest + Testing Library** (แนะนำสำหรับโปรเจกต์ใหม่) · Jasmine + Karma (ค่าเริ่มต้นเดิมของ Angular) |
| Flutter · Dart | **`flutter_test`** (มากับ SDK ไม่ต้องถาม) · fake ด้วยคลาสที่ `implements` ของจริง ก่อนจะลง `mocktail` |

**ข้อ 2 — ขอบเขตที่ต้องการตอนนี้**

- unit อย่างเดียว (เร็ว ไม่แตะ DB/network)
- unit + integration (แตะ DB จริงผ่าน Testcontainers / SQLite in-memory)
- ครบชุดรวม E2E (ต่อยอดไป `e2e-testing-patterns`)

> ถ้าโปรเจกต์**มี framework อยู่แล้ว** ไม่ต้องถาม — ใช้ของเดิม การมีสองระบบในโปรเจกต์เดียว
> แย่กว่าการใช้ของที่ไม่ถูกใจนัก

---

## 2 · พีระมิด — สัดส่วนที่ยั่งยืน

```
        ▲  E2E  5%      ช้า เปราะ แพง — เอาไว้ทดสอบ "เส้นทางที่ทำเงิน" เท่านั้น
       ╱ ╲
      ╱   ╲ Integration 20%   ต่อ DB/API จริง ทดสอบว่าชิ้นส่วนคุยกันรู้เรื่อง
     ╱     ╲
    ╱       ╲ Unit 75%        ไม่แตะอะไรข้างนอก รันจบใน < 100ms ต่อตัว
   ╱_________╲
```

**แอปมือถือมีชั้น widget test (Flutter) หรือ component test (React Native)** อยู่ระหว่าง unit กับ E2E — สร้างหน้าจอจริงในหน่วยความจำ กดและอ่านได้โดยไม่ต้องมี emulator · เป็นชั้นกลางหลักของแอปมือถือแทน integration ที่ต่อ DB ซึ่งแอปส่วนใหญ่ไม่มี

**ชุด unit ทั้งหมดต้องรันจบใน 10 วินาที** (Flutter: นับหลังคอมไพล์เสร็จ — การเริ่ม `flutter test` เองก็กินหลายวินาที (รอยืนยันตัวเลขบนเครื่องจริง)) ถ้าเกินนี้คนจะเลิกรันก่อน commit
แล้ว test จะกลายเป็นด่านที่ CI เท่านั้นที่เจอ — ซึ่งช้าเกินไป

---

## 3 · อะไรควรมี test / อะไรไม่ต้อง

**ต้องมี**
- ตรรกะทางธุรกิจ: การคำนวณ, เงื่อนไขสิทธิ์, การเปลี่ยนสถานะ
- ทุกกรณีขอบ: ค่าว่าง, ศูนย์, ติดลบ, ขอบเขตล่าง/บน, ค่าซ้ำ
- **ทุกบั๊กที่เคยเกิด** — เขียน test ที่แดงก่อน แล้วค่อยแก้ (regression test)
- สัญญาที่คนอื่นพึ่งพา: รูปแบบ response ของ API, schema ของ event

**ไม่ต้องมี**
- getter/setter, DTO, mapping ตรง ๆ
- โค้ดของเฟรมเวิร์ก (ไม่ต้อง test ว่า EF Core บันทึกได้ไหม)
- ไลบรารีของคนอื่น
- UI ที่แค่แสดงผลโดยไม่มีตรรกะ

> **Coverage ที่ซื่อสัตย์: 70–80% ของ business logic** ไม่ใช่ 100% ของทั้งโปรเจกต์
> ไล่ตาม 100% จะได้ test ปลอม ๆ ที่เขียนเพื่อให้ตัวเลขสวยเต็มไปหมด
> ตั้ง gate ที่ "ห้ามลดลงจากเดิม" มีประโยชน์กว่าตั้งเลขเป้า

---

## 4 · เขียนยังไง

**ตั้งชื่อ** — อ่านชื่อแล้วต้องรู้ว่าพังอะไรโดยไม่ต้องเปิดโค้ด

```
MethodName_Scenario_ExpectedResult

CalculateDiscount_WhenMemberIsGold_Returns15Percent
CreateOrder_WhenStockIsZero_ThrowsOutOfStock
ParseDate_WhenInputIsEmpty_ReturnsNull
```

ภาษาที่ชื่อ test เป็นข้อความ (Dart · Vitest · Jest) ใช้ `group('<สิ่งที่ทดสอบ>')` + `test('<สถานการณ์> → <ผลที่ต้องได้>')` เป็นประโยค เช่น `group('verdict')` · `test('below 50 lux is too dark for reading')`

**โครง AAA** — เว้นบรรทัดคั่นสามส่วนให้เห็นชัด

```
// Arrange   เตรียมข้อมูลและ dependency
// Act       เรียกสิ่งที่ทดสอบ — บรรทัดเดียว
// Assert    ตรวจผล
```

**หนึ่ง test = หนึ่งเหตุผลที่จะพัง** ถ้ามี assert 5 อันที่ไม่เกี่ยวกัน ให้แยกเป็น 5 test

**ห้ามมี logic ใน test** — ไม่มี `if`, ไม่มีลูปที่คำนวณค่าคาดหวัง
ถ้าอยากรันหลายเคส ใช้ parameterized test (`[Theory]` / `test.each` / `@pytest.mark.parametrize`)

**ทำให้ผลเหมือนเดิมทุกครั้ง**
- เวลา: inject `IClock`/`now()` ไม่เรียก `DateTime.Now` ตรง ๆ ในโค้ดที่ทดสอบ
- สุ่ม: fix seed
- ลำดับ: test ต้องรันสลับลำดับได้ ห้ามพึ่งสถานะที่ test ก่อนหน้าทิ้งไว้
- **ห้าม `sleep`** เพื่อรอ async — ใช้ fake timer หรือรอ signal จริง

**Mock เท่าที่จำเป็น** — mock ขอบเขตนอกระบบ (HTTP, คิว, เวลา, ไฟล์)
ไม่ mock คลาสของตัวเองที่คำนวณล้วน ๆ mock เยอะเกินไปแปลว่า test ผูกกับวิธีเขียน
พอ refactor ทีเดียวแดงทั้งชุดทั้งที่พฤติกรรมไม่เปลี่ยน

---

## 5 · Integration test

- ใช้ **DB จริงชนิดเดียวกับ production** (Testcontainers) ไม่ใช่ SQLite แทน PostgreSQL
  เพราะ SQL ที่ผ่านบน SQLite อาจพังบนของจริง
- แต่ละ test เริ่มจากสถานะที่รู้แน่ — transaction rollback หรือ truncate ทุกครั้ง
- แยก command ออกจาก unit เพื่อให้รันแยกกันได้ (`npm run test:unit` / `test:integration`)
- ทดสอบ **สัญญา** ของ API: status code, รูปร่าง JSON, header สำคัญ — ไม่ใช่แค่ "ไม่ error"

---

## 6 · CI

```
push / PR → lint → unit (< 10 วินาที) → integration → build
```

- **test แดง = merge ไม่ได้** ไม่มีข้อยกเว้น
- ห้ามมี `skip`/`ignore` ค้างในสาขาหลัก — ถ้าจะ skip ต้องมีลิงก์ issue กำกับ
- test ที่ flaky ให้ **แก้หรือลบ** ห้าม retry จนกว่าจะเขียว นั่นคือการซ่อนบั๊ก
- รายงาน coverage ในหน้า PR ให้เห็นว่าเพิ่มหรือลด

รายละเอียดคำสั่งและไฟล์ config ของแต่ละ framework อยู่ใน `references/per-stack.md`

---

## 7 · ตรวจงาน

- [ ] ใช้ framework ของเดิมหรือที่มากับสแต็ก · ถ้าลงตัวใหม่ ถามแล้วหรือบันทึกใน "ตัดสินใจเอง"
- [ ] `npm test` / `dotnet test` / `pytest` / `flutter test` รันผ่านจากเครื่องเปล่าโดยไม่ต้องตั้งค่าอะไรเพิ่ม
- [ ] ชุด unit รันจบใน 10 วินาที
- [ ] ลองสลับลำดับ test แล้วยังเขียวหมด (`pytest -p no:randomly --lf` / `--shuffle`)
- [ ] รันซ้ำ 3 รอบได้ผลเหมือนเดิม (ไม่ flaky)
- [ ] แก้โค้ดให้พังโดยตั้งใจ 1 จุด แล้ว test **ต้องแดง** — ถ้ายังเขียว แปลว่า test ไม่ได้ทดสอบอะไร
- [ ] ชื่อ test อ่านแล้วรู้ว่าพังอะไรโดยไม่ต้องเปิดโค้ด
- [ ] ไม่มี `sleep` / `Thread.Sleep` ในชุด test
- [ ] ไม่มี test ที่ถูก skip ค้างโดยไม่มีเหตุผลกำกับ

---

## 8 · Anti-patterns

- ❌ **เขียน test หลังจบงานเพื่อให้ผ่าน gate** — ได้ test ที่ยืนยันว่าโค้ดทำสิ่งที่มันทำ
  ไม่ใช่สิ่งที่มันควรทำ
- ❌ **assert ว่า "ไม่ throw"** เฉย ๆ — ไม่ได้ทดสอบอะไรเลย
- ❌ **test ที่พึ่ง test ก่อนหน้า** — พอรันเดี่ยว ๆ แดงทันที
- ❌ **mock ทุกอย่างจน test ทดสอบแค่ mock**
- ❌ **`sleep(1000)` รอ async** — ช้าและยังเปราะอยู่ดี
- ❌ **retry flaky test จนเขียว** — คุณเพิ่งซ่อนบั๊กที่เกิดจริงใน production
- ❌ **ไล่ coverage 100%** — เขียน test ให้ getter เพื่อตัวเลข
- ❌ **ข้อมูลทดสอบเป็นข้อมูลลูกค้าจริง** — ผิดกฎหมายและหลุดง่าย ใช้ตัวสร้างข้อมูลปลอม

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| E2E ผ่านเบราว์เซอร์ | `e2e-testing-patterns` |
| E2E แอปมือถือ (`integration_test` · `adb`) | `app-verifier-setup` |
| ออกแบบ test case ก่อนเขียนโค้ด | `test-case-template` |
| ทดสอบ endpoint health/ping | `web-service-essentials` |
| log ที่ช่วยไล่ปัญหาตอน test แดง | `logging-standards` |
| review โค้ด test | `code-review-checklist` |


## reference: per-stack.md

# ตั้งค่าและตัวอย่างต่อสแต็ก

> ตัวอย่างในไฟล์นี้ **ยังไม่ได้รันทดสอบ** (ยกเว้นหัวข้อ Flutter ซึ่งมาจากแอปจริง Lumio) เป็นการตั้งค่ามาตรฐานของแต่ละ framework
> ให้รันครั้งแรกแล้วดูว่าคำสั่งและ path ตรงกับโครงโปรเจกต์จริงหรือไม่

---

## สารบัญ

1. [.NET — xUnit](#net--xunit)
2. [Node / TypeScript — Vitest](#node--typescript--vitest)
3. [Python — pytest](#python--pytest)
4. [Angular](#angular)
5. [Flutter / Dart — flutter_test](#flutter--dart--flutter_test)
6. [ตารางเทียบ](#ตารางเทียบ)

---

## .NET — xUnit

```bash
dotnet new xunit -o tests/MyApp.Tests
dotnet add tests/MyApp.Tests reference src/MyApp
dotnet add tests/MyApp.Tests package FluentAssertions      # assert ที่อ่านเป็นประโยค
dotnet add tests/MyApp.Tests package NSubstitute           # mock ที่ syntax สั้นกว่า Moq
dotnet add tests/MyApp.Tests package Microsoft.AspNetCore.Mvc.Testing   # integration
dotnet add tests/MyApp.Tests package Testcontainers.PostgreSql
```

```csharp
public class DiscountCalculatorTests
{
    [Fact]
    public void CalculateDiscount_WhenMemberIsGold_Returns15Percent()
    {
        // Arrange
        var sut = new DiscountCalculator();

        // Act
        var result = sut.Calculate(new Order { Total = 1000m }, MemberTier.Gold);

        // Assert
        result.Should().Be(150m);
    }

    // Theory = ทดสอบหลายเคสด้วยโค้ดชุดเดียว — ห้ามเขียนลูปเอง
    [Theory]
    [InlineData(MemberTier.None, 0)]
    [InlineData(MemberTier.Silver, 50)]
    [InlineData(MemberTier.Gold, 150)]
    public void CalculateDiscount_ByTier_ReturnsExpected(MemberTier tier, decimal expected)
        => new DiscountCalculator().Calculate(new Order { Total = 1000m }, tier)
               .Should().Be(expected);
}
```

Integration ผ่าน `WebApplicationFactory` — ยิง HTTP จริงเข้า pipeline จริงโดยไม่ต้องเปิดพอร์ต:

```csharp
public class OrdersApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task GetOrders_WhenNotAuthenticated_Returns401()
    {
        var res = await factory.CreateClient().GetAsync("/api/v1/orders");
        res.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

```bash
dotnet test                                        # ทั้งหมด
dotnet test --filter "FullyQualifiedName!~Integration"   # เฉพาะ unit
dotnet test --collect:"XPlat Code Coverage"
```

---

## Node / TypeScript — Vitest

```bash
npm i -D vitest @vitest/coverage-v8
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // ไฟล์ setup ใช้ตั้ง fake timer / ล้าง mock ให้ทุกไฟล์เหมือนกัน
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.dto.ts', 'src/**/index.ts'],
      thresholds: { lines: 70, functions: 70, branches: 60 },
    },
  },
});
```

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscountCalculator } from '../src/discount';

describe('DiscountCalculator', () => {
  beforeEach(() => vi.restoreAllMocks());   // กันสถานะรั่วข้าม test

  it('calculateDiscount_whenMemberIsGold_returns15Percent', () => {
    const sut = new DiscountCalculator();
    expect(sut.calculate({ total: 1000 }, 'gold')).toBe(150);
  });

  it.each([
    ['none', 0], ['silver', 50], ['gold', 150],
  ])('calculateDiscount_byTier_%s', (tier, expected) => {
    expect(new DiscountCalculator().calculate({ total: 1000 }, tier)).toBe(expected);
  });
});
```

คุมเวลาแทนการ `sleep`:

```ts
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-01-15T10:00:00+07:00'));
await vi.advanceTimersByTimeAsync(5000);   // เดินเวลา 5 วิ ทันที
vi.useRealTimers();
```

```json
{ "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts"
} }
```

> **Jest แทน Vitest:** API เกือบเหมือนกัน (`jest.fn` ↔ `vi.fn`) แต่ต้องตั้ง `ts-jest`
> หรือ babel เพิ่มสำหรับ TypeScript · เลือก Jest เมื่อทีมคุ้นอยู่แล้วหรือมี preset ที่ต้องใช้

---

## Python — pytest

```bash
pip install pytest pytest-cov pytest-randomly
```

`pyproject.toml`:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q --strict-markers --cov=src --cov-report=term-missing"
markers = ["integration: ต้องมี DB/network — รันแยกจาก unit"]
```

```python
import pytest
from src.discount import calculate_discount

def test_calculate_discount_when_member_is_gold_returns_15_percent():
    assert calculate_discount(total=1000, tier="gold") == 150

@pytest.mark.parametrize("tier,expected", [("none", 0), ("silver", 50), ("gold", 150)])
def test_calculate_discount_by_tier(tier, expected):
    assert calculate_discount(total=1000, tier=tier) == expected

@pytest.mark.integration
def test_create_order_persists_to_db(db_session):
    ...
```

`conftest.py` — fixture ที่ใช้ร่วมกัน (คืนสถานะเดิมทุก test):

```python
import pytest

@pytest.fixture
def db_session(engine):
    conn = engine.connect()
    tx = conn.begin()
    yield Session(bind=conn)
    tx.rollback()          # ทุก test เริ่มจากฐานสะอาดเสมอ
    conn.close()
```

```bash
pytest                        # ทั้งหมด (pytest-randomly สลับลำดับให้เอง = จับ test ที่พึ่งกัน)
pytest -m "not integration"   # เฉพาะ unit
pytest --lf                   # เฉพาะที่แดงรอบก่อน
```

---

## Angular

**Vitest + Testing Library** (โปรเจกต์ใหม่ — เร็วกว่า Karma มาก ไม่ต้องเปิดเบราว์เซอร์จริง)

```bash
npm i -D vitest @analogjs/vite-plugin-angular jsdom \
         @testing-library/angular @testing-library/user-event
```

```ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { OrderFormComponent } from './order-form.component';

it('orderForm_whenSubmitWithEmptyName_showsRequiredError', async () => {
  await render(OrderFormComponent);

  await userEvent.click(screen.getByRole('button', { name: /บันทึก/ }));

  expect(await screen.findByText(/กรุณากรอกชื่อ/)).toBeTruthy();
});
```

> ทดสอบจาก**มุมผู้ใช้** — หาปุ่มด้วยข้อความที่คนเห็น (`getByRole`, `getByText`)
> ไม่ใช่ `By.css('.btn-primary')` เพราะพอเปลี่ยนคลาส CSS test จะแดงทั้งที่ UI ยังทำงานถูก

**Jasmine + Karma** (ค่าเริ่มต้นเดิมของ Angular — ใช้ต่อได้ถ้าโปรเจกต์มีอยู่แล้ว):

```ts
describe('DiscountService', () => {
  let service: DiscountService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DiscountService] });
    service = TestBed.inject(DiscountService);
  });

  it('calculate_whenMemberIsGold_returns15Percent', () => {
    expect(service.calculate(1000, 'gold')).toBe(150);
  });
});
```

```bash
ng test --watch=false --browsers=ChromeHeadless --code-coverage    # สำหรับ CI
```

---

## Flutter / Dart — flutter_test

มากับ SDK ไม่ต้องลงอะไร · ไฟล์อยู่ใน `test/` ล้อโครง `lib/` (`lib/features/measure/lux_math.dart` → `test/features/measure/lux_math_test.dart`) · ชื่อไฟล์ snake_case ตามธรรมเนียม Dart

```dart
// fake ของสะพานไปฝั่ง native: implements คลาสจริงได้เลย ไม่ต้องสร้าง interface ใหม่
class FakeDeviceLight implements DeviceLight {
  final _lux = StreamController<double>.broadcast();
  void emitSensor(double lux) => _lux.add(lux);
  @override
  Stream<double> sensorLux() => _lux.stream;
  // ...override ที่เหลือคืนค่าที่ test เลือก (มี sensor ไหม · สิทธิ์กล้อง)
}

void main() {
  group('measure screen', () {
    testWidgets('shows live lux and verdict', (tester) async {
      // จอทดสอบเริ่มต้น 800×600 — ตั้งเป็นขนาดมือถือ ไม่งั้นปุ่มอยู่นอกจอแล้วกดพลาด
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.75;
      addTearDown(tester.view.reset);

      final device = FakeDeviceLight();
      final meter = MeterController(device);
      await tester.pumpWidget(App(meter: meter));
      device.emitSensor(420);
      await tester.pump(MeterController.tick);   // ไม่ใช้ pumpAndSettle เมื่อมี Timer วนอยู่

      expect(find.textContaining('420 lux'), findsOneWidget);
      meter.dispose();   // ปิด Timer ในตัว test เอง ไม่งั้นล้มด้วย "A Timer is still pending"
    });
  });
}
```

| เรื่อง | ทำอย่างนี้ |
|---|---|
| ชั้น test | unit (`test`) สำหรับตรรกะล้วน · widget (`testWidgets`) สำหรับหน้าจอ — เป็นชั้นกลางหลัก · E2E บนเครื่อง: `integration_test` (`flutter test integration_test/`) หรือสคริปต์ `adb` ตาม `app-verifier-setup` |
| platform channel | fake ด้วยคลาสที่ `implements` คลาสสะพานของจริง · ลง `mocktail` เมื่อ fake ด้วยมือเริ่มยาวเท่านั้น |
| `pumpAndSettle` | ใช้ได้เมื่อหน้าจอหยุดนิ่งจริง · มี Timer หรือ animation วนตลอด → ไม่มีวันนิ่ง (หมดเวลา) ใช้ `pump(duration)` |
| Timer ค้าง | dispose controller ที่ถือ Timer ในตัว test เอง ก่อนบรรทัดสุดท้าย — Timer ที่ยังวิ่งอยู่ตอนจบทำให้ test ล้ม |
| จอเล็ก | test แยกหนึ่งชุดที่ 360×800 dp ภาษาไทย + `textScaler` ใหญ่ เพื่อจับข้อความล้น (Flutter ฟ้อง overflow เป็น exception ใน test) |
| SnackBar บังปุ่ม | widget test จับได้ — กดปุ่มล่างหลัง SnackBar ขึ้นแล้ว assert **ผลของการกด** (`tester.tap` ที่โดนของบังแค่พิมพ์คำเตือน ไม่ทำให้ล้ม) |
| golden test | ไม่บังคับ · ภาพต่างกันตามเครื่องและฟอนต์ ใช้เมื่อทีมมีเครื่อง CI ตายตัว |
| coverage | `flutter test --coverage` → `coverage/lcov.info` |
| พิสูจน์ว่า test ใช้ได้ | แก้โค้ดให้ผิดหนึ่งจุด รันแล้วต้องแดง แล้วคืนค่า |

```bash
flutter test                              # ทั้งหมด
flutter test test/features/measure        # โฟลเดอร์เดียว
flutter test --coverage
flutter test integration_test/            # ต้องมี emulator หรือเครื่องจริงต่ออยู่
```

---

## ตารางเทียบ

| เรื่อง | xUnit | Vitest | pytest | Angular (Vitest) | flutter_test |
|---|---|---|---|---|---|
| หลายเคส | `[Theory]` + `[InlineData]` | `it.each` | `@pytest.mark.parametrize` | `it.each` | วน `for` สร้าง `test(...)` ใน `group` |
| mock | NSubstitute `Substitute.For<T>()` | `vi.fn()` / `vi.mock()` | `unittest.mock` / `mocker` | `vi.fn()` + `providers` | คลาส `implements` · `mocktail` |
| ก่อน/หลังแต่ละ test | constructor / `IDisposable` | `beforeEach` / `afterEach` | fixture | `beforeEach` | `setUp` / `tearDown` / `addTearDown` |
| คุมเวลา | inject `TimeProvider` | `vi.useFakeTimers()` | `freezegun` | `vi.useFakeTimers()` | `tester.pump(duration)` · `fakeAsync` |
| DB จริง | Testcontainers | Testcontainers | Testcontainers / `pytest-postgresql` | — | — (`SharedPreferences.setMockInitialValues`) |
| coverage | `--collect:"XPlat Code Coverage"` | `--coverage` | `--cov` | `--coverage` | `--coverage` |
| สลับลำดับ | ไม่มีในตัว | `--sequence.shuffle` | `pytest-randomly` | `--sequence.shuffle` | `--test-randomize-ordering-seed random` |


---

# skill: e2e-testing-patterns

Use when designing end-to-end tests (Playwright, Cypress), structuring suites, fixing flaky tests or running E2E in CI. To give an agent a way to run and check the app itself, use app-verifier-setup.

> **ใน A-Team:** ให้ agent รันแอปและพิสูจน์ผลเองใช้ [`app-verifier-setup`](../app-verifier-setup/SKILL.md) · skill นี้คือหลักออกแบบชุดทดสอบ E2E (end-to-end) ที่ verifier นั้นเรียกใช้

# End-to-End Testing Patterns

## When to use this skill

- Setting up E2E testing in a new project
- Choosing between Playwright, Cypress, Selenium
- Structuring a growing E2E test suite
- Fighting flaky tests
- Designing test data strategy
- Adding E2E to CI/CD pipeline
- Migrating from one framework to another

---

## The Testing Pyramid (Get This Right First)

```
        ▲
       ╱E╲       E2E: 5-10% of tests
      ╱ 2 ╲
     ╱  E  ╲     - Slow, expensive, flaky
    ╱───────╲    - Test critical user journeys ONLY
   ╱  Integ  ╲   Integration: 15-25%
  ╱           ╲  - API contracts, DB interactions
 ╱─────────────╲ Unit: 70-80%
╱      Unit     ╲ - Fast, deterministic, many
─────────────────
```

> 🚨 **Anti-pattern: Ice cream cone** (many E2E, few units)
> Means: slow CI, flaky tests, slow debugging

---

## Framework Selection (2026)

| Framework | Best for | Avoid for |
|-----------|----------|-----------|
| **Playwright** ⭐ | Modern apps, cross-browser, parallel | Legacy apps with weird patterns |
| **Cypress** | DX, learning curve, single-app | Multi-tab, cross-origin tests |
| **Selenium** | Legacy, language flexibility | Greenfield projects |
| **Puppeteer** | Chrome-only, scraping | Cross-browser needs |
| **WebDriverIO** | Mobile + web, BDD style | Simple use cases |

> 💡 **Default recommendation: Playwright** — best DX, fast, cross-browser, official from Microsoft

---

## Test Structure: Page Object Model (POM)

### ❌ Bad (no abstraction)
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

test('user can update profile', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');  // ← duplicated
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await page.goto('/profile');
  // ...
});
```

### ✅ Good (Page Object)
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test('user can login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('user@example.com', 'pass123');
  await expect(page).toHaveURL('/dashboard');
});
```

> 💡 **One Page Object per page or major component.**

---

## Selectors: Hierarchy of Goodness

```
Most resilient ─────────────────────────► Most brittle

✅ Role + accessible name      page.getByRole('button', { name: 'Submit' })
✅ Test IDs                     page.getByTestId('submit-btn')
🟡 Visible text                 page.getByText('Submit')
🟡 Label                        page.getByLabel('Email')
🔴 CSS classes                  page.locator('.btn-primary')
🔴 Tag + index                  page.locator('button:nth-child(3)')
❌ XPath                        page.locator('//div[2]/button')
```

**Rule:** Prefer queries that survive refactoring.

---

## Test Data Strategy

### Option 1: Shared test DB (popular, problematic)
```
❌ All tests share same data
❌ Order-dependent
❌ Hard to parallelize
❌ Pollution between tests
```

### Option 2: Per-test setup (slow)
```
🟡 Clean slate every test
🟡 Reliable but slow
✅ Good for critical flows
```

### Option 3: API setup, UI verification (best)
```typescript
// ✅ Setup via API (fast), verify via UI (real test)
test('user sees orders', async ({ page, request }) => {
  // Setup via API — fast, reliable
  const user = await api.createUser();
  await api.createOrder(user.id, { items: [...] });

  // Test the actual UI flow
  await page.goto('/orders');
  await expect(page.getByText('Order #123')).toBeVisible();
});
```

### Option 4: Database snapshot + rollback
```
✅ Real production-like data
✅ Fast (uses snapshots)
🟡 Requires DB tooling
```

---

## What to Test E2E (Not Everything!)

### ✅ DO test E2E
- Critical user journeys (login → checkout → confirmation)
- Multi-step workflows that span multiple pages
- Integration with external services (payment, email)
- "Smoke tests" that verify deployment works
- Cross-browser specific behavior

### ❌ DON'T test E2E
- Every form validation (use unit tests)
- Edge cases of business logic (use unit/integration)
- Every error message (use unit tests)
- Performance (use dedicated tools)
- Visual design (use visual regression tools)

> 💡 **Rule of thumb:** If a unit/integration test can verify it, don't add E2E.

---

## Critical Path Coverage Matrix

```markdown
| User Journey | Coverage | Priority |
|--------------|:--------:|:--------:|
| Signup → first action | ✅ | 🔴 P0 |
| Login → main task | ✅ | 🔴 P0 |
| Add to cart → checkout → success | ✅ | 🔴 P0 |
| Search → filter → result | ✅ | 🟡 P1 |
| Settings → save | ✅ | 🟡 P1 |
| Admin panel CRUD | ✅ | 🟡 P1 |
| Password reset | ✅ | 🟢 P2 |
| Profile edit | 🟡 Sample | 🟢 P2 |
```

---

## Fighting Flaky Tests

### Top causes of flakiness

| Cause | Fix |
|-------|-----|
| Hard-coded sleeps | Use auto-waiting (Playwright/Cypress have this) |
| Animation timing | Wait for animation to complete OR disable in tests |
| Network race conditions | `page.waitForResponse(url)` before assertion |
| Test data leak | Use unique data per test (timestamp/UUID) |
| Order dependency | Each test fully isolated, parallelizable |
| Auth race condition | Pre-authenticate via API, inject session |
| Element not stable | `expect(el).toBeVisible()` before interacting |

### ❌ Bad (sleep hack)
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // ← flaky
await expect(page.getByText('Success')).toBeVisible();
```

### ✅ Good (event-based wait)
```typescript
const responsePromise = page.waitForResponse('/api/submit');
await page.click('#submit');
await responsePromise; // ← deterministic
await expect(page.getByText('Success')).toBeVisible();
```

### Retry strategy
- **In CI:** auto-retry failed tests 1-2 times
- **Track flakiness:** flag tests failing > 5% as quarantine candidates
- **Don't accept flaky:** investigate or delete, don't ignore

---

## Authentication in E2E

### ❌ Bad: log in via UI every test
```
Slow, brittle, duplicate code
```

### ✅ Good: log in once, share state
```typescript
// playwright.config.ts
{
  use: { storageState: 'auth.json' },
  globalSetup: 'global-setup.ts',  // logs in once, saves cookies
}
```

### ✅ Better: API login + cookie injection
```typescript
async function login(page, user) {
  const response = await page.request.post('/api/login', { data: user });
  const cookies = await response.headers();
  await page.context().addCookies([...]);
}
```

---

## Parallelization

| Level | Speedup | Complexity |
|-------|--------:|:----------:|
| File-level parallel | 4-8x | 🟢 Low (just enable) |
| Test-level within file | 10x+ | 🟡 Med (isolation needed) |
| Sharded across CI workers | Nx | 🟡 Med (requires sharding config) |
| Cloud grid (BrowserStack, etc.) | Massive | 🔴 High (cost) |

**Requirements for safe parallel:**
- ✅ Tests don't share state
- ✅ Unique test data per test
- ✅ Database/external services support concurrency

---

## CI Integration

### Run E2E tier
```yaml
# Smoke (every PR, 2 min)
- 5-10 critical tests
- Fail = block merge

# Full (nightly, 30 min)
- All E2E tests
- Cross-browser
- Failures investigated next day

# Pre-prod (before deploy, 10 min)
- P0 + P1 tests
- Must pass before prod deploy
```

### Artifacts to capture
- ✅ Screenshots on failure
- ✅ Video on failure
- ✅ Trace files (Playwright)
- ✅ Console logs
- ✅ Network logs

---

## Anti-patterns

- ❌ **Testing implementation details** — selectors based on internal structure
- ❌ **Long monolithic tests** — one test, 50 steps, hard to debug
- ❌ **Coupled tests** — Test B depends on Test A having run
- ❌ **Hidden state** — tests behave differently based on order/data
- ❌ **Manual cleanup** — relying on humans to reset env
- ❌ **No quarantine** — failing tests merged anyway "it's flaky"
- ❌ **Mocking everything** — at this layer, integrate or it's not E2E

---

## Quality Targets (from qa-tester agent)

- Critical path coverage: 100%
- Test runtime: ≤ 10 min for smoke, ≤ 30 min for full
- Flakiness rate: < 2%
- Pass rate in main: > 95%
- Mean time to fix flake: < 2 days

---

## Library Quick Reference

| Need | Playwright | Cypress |
|------|-----------|---------|
| Visit page | `page.goto(url)` | `cy.visit(url)` |
| Click | `page.click(sel)` | `cy.get(sel).click()` |
| Type | `page.fill(sel, text)` | `cy.get(sel).type(text)` |
| Assert text | `expect(page.getByText(...))` | `cy.contains(...)` |
| Wait for response | `page.waitForResponse(...)` | `cy.intercept(...).as(...)` |
| Screenshot | `page.screenshot()` | `cy.screenshot()` |
