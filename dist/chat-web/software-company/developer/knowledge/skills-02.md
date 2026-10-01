# skill: simplicity-first

Use when producing a document, design, architecture or plan — BRD, FSD, ADR, roadmap, UX or API design, sprint plan. Defaults to the simplest version that works and applies the "could a tired teammate follow this in 6 months?" test before delivery. Rejects buzzwords, premature abstraction and unnecessary layers. For code use lazy-coding instead.

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

Use when a markdown document needs a picture — wireframe, UI state, architecture diagram, flow or data viz. Picks the format (inline SVG, image file, ASCII, Mermaid) and embeds it so it renders in GitHub, Notion, VS Code and Obsidian. For any document where prose alone will not carry the idea.

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

Use when building software from a specification and mockups as a repeating agent loop rather than one long conversation — plan, write a failing test for one requirement, write code until it passes, check the screen, record progress, repeat. Gives the loop a machine-checkable stop condition, a state file and a retry ceiling.

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

**ข้อไหนกำกวมจนเขียน test ไม่ได้ ห้ามเดา** — รวมเป็นรายการคำถามท้ายไฟล์ แล้ว**หยุดถามผู้ใช้**

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
