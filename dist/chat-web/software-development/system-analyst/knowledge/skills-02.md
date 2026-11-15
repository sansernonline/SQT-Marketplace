# skill: polished-document-style

Use when a kept document needs headings, tables and theme

# Polished Document Style

> **Gate before starting (every time):** read the owner's theme → search live references → 3 genuinely different directions → check `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (gate before starting) of `design-references` (plugin `superuser`) even when a brand exists (the brand controls color and font, while the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **Boundary:** this skill handles the look (headings, tables, text boxes, theme) · every line of wording belongs to `human-writing` — open both for a document people keep to read

## When to use this skill

- Output is meant for **general readers** (managers, executives, clients, customers)
- Document needs **sign-off** or formal review
- Output will be **shared widely** or converted to PDF/Word later · any doc with 3+ sections or 500+ words
- Laying out any kind of document people keep to read (Markdown · Word · PDF), including Thai text in Office files

## When NOT to use

- Internal notes for the author's own team (keep them concise)
- Quick scratch notes · code comments
- A whole Markdown report that must come out as one .docx → `markdown-report-docx` (plugin `software-development`)

> **Note:** This skill governs the *markdown source*. When the deliverable is a
> rendered **.docx / .pptx / .pdf** that a stakeholder will open, use
> `branded-document-design` (plugin `software-development`) on top of it — that skill carries the design tokens,
> the typography scale, Thai typography rules, and the `brandkit.py` builder.

## Read more when

| File | Open when |
|---|---|
| [references/markdown-patterns.md](references/markdown-patterns.md) | When you will write a header, table of contents, text box, table, status badge, cover block, options comparison table, sign-off section, or glossary, open it to see the markdown examples and copy them |
| [scripts/check_outline.py](scripts/check_outline.py) | If the skill that writes the document has a template in `assets/`, run `python scripts/check_outline.py <template.md> <document.md>` before sending — it checks that headings are complete and in the template's order, bold fields are complete, table headers match, and no field is left unfilled · in a template, put `<!-- optional -->` at the end of a heading or field that is not required · after editing the checker, run `--self-test` first |
| [references/theme-colors.md](references/theme-colors.md) | When you must choose the document's main color, or put real colors into a figure, .docx file or slides, open it to see how to declare the theme, who controls the color of which part, and the house default colors |
| [references/thai-office.md](references/thai-office.md) | When creating Word · Excel · PDF files that contain Thai, open it first for fonts, paragraph layout, and export |

## 0 · Find an existing template first (every time)

Before using a structure or template in this file, check whether the user, client or project already has its own:

- **Where to look:** the client's or organization's document standard: Word/Google Docs templates the client gave · earlier documents in the project (`docs/` · `ref/`) · format requirements in the TOR (terms of reference) or contract
- **Result:** found → use that template (headings, order, field names, running numbers) and say in the answer which file it came from · not found → use the template in this file as the fallback and say no existing template was found
- **Still required for every template:** the document header, heading order and theme in this file are the fallback · readability (clear headings, readable tables) applies to every template

## Document Header (Always)

Every polished doc MUST start with the same header set: a plain-text H1, then a quote box giving version, date, status, author, reviewer and tags, closed with `---`. A full example is in [references/markdown-patterns.md](references/markdown-patterns.md)

Status values:
- **Draft** (ร่าง) — work in progress
- **Review** (กำลังรีวิว) — under stakeholder review
- **Approved** (อนุมัติแล้ว) — signed off
- **Archived** (เก็บถาวร) — historical reference

Only these 4 values, written the same in every skill (`status-report` uses the same set and adds `ยังไม่เริ่ม` (not started) for documents where work has not begun) · the Status column in the Sign-off table is the signer's status and uses **Approved** · **Review** · **Pending** (not yet sent for review) · **Rejected**

## Section Hierarchy

- **H1** — Document title (exactly one)
- **H2** — Numbered sections (`## 1. Section`)
- **H3** — Sub-sections (`### 1.1 Sub-topic`)
- **H4** — Rare, use only if needed

**Always add Table of Contents** for docs with 5+ sections, and clicking a link in the table of contents must reach the real heading. An example is in [references/markdown-patterns.md](references/markdown-patterns.md)

## Document theme — decide once, use everywhere in that document

One document passes through several skills (markdown · `diagram-figures` · `branded-document-design` · `presentation-design`), so choose the main color once, declare it as `<!-- doc-theme: accent=… · ที่มา=… · ยืนยันเมื่อ=YYYY-MM-DD -->` at the end of the document header, and every tool reads the value from there · when you must choose a color or put real colors into a .docx figure or slides → open [references/theme-colors.md](references/theme-colors.md) (where the color comes from, house default, status colors)

## Labels — use words, not emoji

**No emoji in documents**: not in headings, text boxes, status badges or tables, because emoji in headings and badges signal that an AI made it (`no-ai-look`) · use bold words that stay fixed across the whole document instead.

| Used for | Words to use |
|---|---|
| Importance level | วิกฤต · สูง · กลาง · ต่ำ |
| Work status | เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่ |
| Check result | ผ่าน · ไม่ผ่าน |
| Text box type | ข้อแนะนำ (Tip) · ข้อควรจำ (Note) · ข้อควรระวัง (Warning) · อันตราย (Critical) · คำถามที่ยังเปิด (Open Question) |

For yes/no cells in a table, you may use the text characters `✓` `✗` (not colored emoji), or write "ใช่" (yes) / "ไม่" (no).

## Callout Boxes

Use blockquotes with a bold label (no emoji). There are 5 kinds: **Tip** (ข้อแนะนำ) · **Note** (ข้อควรจำ) · **Warning** (ข้อควรระวัง) · **Critical** (อันตราย) · **Open Question** (คำถามที่ยังเปิด). Examples are in [references/markdown-patterns.md](references/markdown-patterns.md)

**Rules:**
- Keep callouts to 1-3 sentences
- One callout per topic — don't stack
- Don't overuse — max 3-5 per page

## Tables — When and How

Use tables when items have **2+ attributes**. If you wrote bullets where each line has several values separated by commas, change them to a table. Side-by-side examples are in [references/markdown-patterns.md](references/markdown-patterns.md)

- Left-align text, center checkmarks/numbers, right-align money
- Use `—` (em dash) for "not applicable", not `-` or blank
- Keep cells short — long content goes in body paragraphs
- Bold key columns: `**email**`

If the document must compare options or weigh pros and cons (strategy, vendor choice, plan options), use a comparison table with a Recommendation column. A document that needs approval ends with a Sign-off table, and a document with 5 or more abbreviations (the same threshold as `spell-out-abbreviations`) gets a glossary. Examples of all three are in [references/markdown-patterns.md](references/markdown-patterns.md)

## Diagrams

**Figures in project documents (reports · proposals · process flows · data flows) are drawn with `diagram-figures`, the single house style, and embedded as image files** · Mermaid (`software-diagrams` in plugin `software-development`) is only for quick figures in a README · PR · code notes
This skill controls only how figures are placed in the document.

- Place it **after the paragraph that explains what question the figure answers**, not floating in from nowhere
- Every figure has a 1-line caption under it, starting with **รูปที่ N —** (Figure N —)
- Do not put the same figure in several places in the document; refer to the figure number instead

## Status Badges and Cover Block

For important fields in the header or in a table, use a status badge as a bold word, such as `**Status:** Approved`. A formal document (proposal · formal report · contract · postmortem) opens with a cover block that gives the document type, version, status, date, author, reviewer, and related documents. An example is in [references/markdown-patterns.md](references/markdown-patterns.md)

## Lists and Code Blocks

**Rule:** never nest bullets. If a list needs sub-levels, split into sub-headings or use a table.
Examples of a good list and an over-nested list are in [references/markdown-patterns.md](references/markdown-patterns.md)

Code blocks must always specify the language (Always specify language), and if the code is long, put the file name as a comment on the first line. An example is in [references/markdown-patterns.md](references/markdown-patterns.md)

## Thai Office documents

Word · Excel · PDF files that contain Thai (complex-script font · no justify · embed fonts · BOM CSV) → open [references/thai-office.md](references/thai-office.md) before creating the file

## Quality Checklist

Before delivering any polished doc:

- [ ] H1 title in plain text — no emoji in any heading, callout, badge or table
- [ ] Header block with version, date, status, authors (cover block for formal documents only)
- [ ] TOC if 5+ sections
- [ ] All sections numbered consistently
- [ ] Anchor links in TOC actually work
- [ ] Status badges where applicable
- [ ] Tables used (not bullets) where data has 2+ attributes
- [ ] Every flow or relationship has a diagram drawn with `diagram-figures` (plugin `software-development` · house style), not default Mermaid
- [ ] Callout boxes for tips/warnings (not just paragraphs)
- [ ] Code blocks have language hints
- [ ] Glossary for docs with 5+ abbreviations
- [ ] No placeholder text (TBD, TODO, Lorem ipsum) — `(รอยืนยัน)` markers listed in the pending-confirmation list are not placeholders; keep them
- [ ] Tested rendering in the real viewer (Word · PDF · GitHub preview)

> Diagrams in project documents are in `diagram-figures` · code documents (quick Mermaid · software requirements) → the addition in plugin `software-development`

## Anti-patterns

- **Inconsistent terminology** — "user" in one section, "customer" in next
- **Tables of paragraphs** — if cells are >2 sentences, use headings instead

AI-looking style in any medium → before sending, go through item 3 of `no-ai-look` · rules for writing abbreviations → `spell-out-abbreviations`


## reference: markdown-patterns.md

# รูปแบบ markdown พร้อมตัวอย่าง

ตัวอย่างโค้ด markdown ของทุกรูปแบบที่ `SKILL.md` อ้างถึง ให้ลอกไปใช้ได้ทันที ส่วนกฎว่าใช้เมื่อไหร่อยู่ใน `SKILL.md`

**สารบัญ:** Document Header · Table of Contents · Callout Boxes · Tables · Figures · Status Badges · Cover Block · Comparison / Decision Tables · Lists · Code Blocks · Approval/Sign-off · Glossary

## Document Header (Always)

Every polished doc MUST start with:

```markdown
# <Document Title>

> **Version:** 1.0 · **Date:** YYYY-MM-DD · **Status:** Draft
> **Authors:** <names> · **Reviewers:** <names>
> **Tags:** `<area>` `<topic>`

---
```

Status values:
- **Draft** — work in progress
- **Review** — under stakeholder review
- **Approved** — signed off
- **Archived** — historical reference

## Table of Contents

**Always add Table of Contents** for docs with 5+ sections:

```markdown
## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope](#2-scope)
3. [Details](#3-details)
```

## Callout Boxes

Use blockquotes with a bold label — no emoji. 5 ชนิด ชื่อไทยคู่กัน: Tip (ข้อแนะนำ) · Note (ข้อควรจำ) · Warning (ข้อควรระวัง) · Critical (อันตราย) · Open Question (คำถามที่ยังเปิด):

```markdown
> **Tip:** Brief actionable insight.

> **Warning:** Important caveat or limitation.

> **Critical:** Must-read before proceeding.

> **Note:** Additional context or background.

> **Open Question:** Needs decision/clarification.
```

## Tables — When and How

### When to use tables instead of bullets

Use tables when items have **2+ attributes**:

Don't use bullets:
```markdown
- email: string, required, unique
- age: number, optional
- role: enum, required, default "user"
```

Use a table:
```markdown
| Field | Type   | Required | Default | Description       |
|-------|--------|:--------:|:-------:|-------------------|
| email | string | ✓        | —       | Unique login email|
| age   | number | ✗        | —       | Optional          |
| role  | enum   | ✓        | `user`  | Access level      |
```

## Figures (รูปในเอกสาร)

รูปในเอกสารโปรเจกต์วาดด้วย `diagram-figures` (plugin `software-development` · house style) แล้วฝังเป็นไฟล์ภาพ · Mermaid ใช้แค่รูปด่วนใน README · PR ไม่ใช้ในเอกสารที่ส่งต่อ

```markdown
ลำดับการเรียกเมื่อผู้ใช้กดบันทึกแสดงในรูปที่ 3

![ลำดับการเรียกเมื่อผู้ใช้กดบันทึก](figures/fig-03.png)

**รูปที่ 3 —** ลำดับการเรียกเมื่อผู้ใช้กดบันทึก
```

## Status Badges (Inline)

For key fields in headers/tables:

```markdown
**Status:** Approved
**Priority:** High
**Risk Level:** Medium
**Service Level Agreement (SLA):** < 200ms
```

Multiple badges in a header:

```markdown
> **Approved** · **High Priority** · Owner @alice · Due 2025-03-15
```

## Cover Block Pattern

For formal documents (Business Requirements Document (BRD), Functional Specification Document (FSD), Architecture Decision Record (ADR), postmortem):

```markdown
# <Title>

| | |
|--|--|
| **Document Type** | BRD \| FSD \| ADR \| Postmortem |
| **Version** | 1.2 |
| **Status** | Approved |
| **Date** | 2025-01-15 |
| **Author(s)** | @alice, @bob |
| **Reviewer(s)** | @charlie |
| **Related** | [BRD-001](link), [FSD-005](link) |

---
```

## Comparison / Decision Tables

For trade-off analysis (architect, Project Manager (PM), Search Engine Optimization (SEO) recommendations):

```markdown
| Option | Cost | Effort | Risk | Time-to-Value | Recommendation |
|--------|:----:|:------:|:----:|:-------------:|:--------------:|
| **A**  | ฿80k | Med  | Low  | Fast | **Recommended** |
| B      | ฿40k | Low  | High | Med  | Not recommended |
| C      | ฿150k| High | Low  | Slow | Future consideration |
```

## Lists — When to nest, when to flatten

### Good list
```markdown
- Email is unique across all users
- Passwords must be 8+ characters with mixed case
- Sessions expire after 30 days of inactivity
```

### Bad list (over-nested)
```markdown
- Users
  - Email
    - Must be unique
    - Required
  - Password
    - 8+ chars
    - Mixed case
```

→ Should be a table instead.

## Code Blocks

Always specify language:

````markdown
```typescript
const user: User = { id: 1, email: 'a@b.com' };
```

```bash
npm install
```

```sql
SELECT * FROM users WHERE id = $1;
```
````

For long blocks, put the file name in a comment on the first line:

```typescript
// src/services/auth.ts
export async function login(email: string, password: string) {
  // ...
}
```

## Approval/Sign-off Section (End of Doc)

For documents needing formal approval:

```markdown
## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| Product Owner | @alice | Approved | 2025-01-15 |
| Tech Lead | @bob | Review | — |
| QA Lead | @charlie | Pending | — |
| Security | @dave | Rejected | 2025-01-14 |
```

## Glossary Section

For docs with 5+ technical terms:

```markdown
## Glossary

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token, used for stateless auth |
| **SLA** | Service Level Agreement |
```

Define acronyms on first use, then add to glossary.


## reference: thai-office.md

# เอกสาร Office ภาษาไทย

ใช้กับไฟล์ Word · Excel · PDF ทุกไฟล์ที่มีภาษาไทย จะสร้างด้วยสคริปต์หรือทำมือก็ตาม รายละเอียดและตัวช่วยอยู่ใน `branded-document-design`

- Word นับภาษาไทยเป็น complex script จึงมีช่องฟอนต์ ขนาด และตัวหนาแยกจากละติน ถ้าตั้งแค่ช่องละติน ข้อความไทยจะไม่เปลี่ยน ต้องตั้งให้ครบทั้งสองชุด
- ย่อหน้าไทยไม่จัดชิดสองขอบ (justify) เพราะไทยไม่มีช่องว่างระหว่างคำ Word จะยืดช่องไฟจนเป็นรู (ยกเว้นคู่มือวิทยานิพนธ์สั่ง Thai Distributed)
- ข้อความไทยห้ามใช้ฟอนต์ mono เพราะ Consolas กับ Cascadia ไม่มีอักษรไทย ใช้ mono กับรหัส คีย์ และตัวเลขเท่านั้น
- ส่งออก PDF ให้ฝังฟอนต์ทุกครั้ง ไม่งั้นเครื่องที่ไม่มีฟอนต์จะเอาตัวอื่นมาแทนและวรรณยุกต์ลอย
- CSV ที่ให้คนไทยเปิดใน Excel บันทึกเป็น UTF-8 แบบมี BOM ไม่งั้นภาษาไทยเพี้ยน
- ก่อนบอกว่าเสร็จ แปลงทุกหน้าเป็นภาพแล้วเปิดดูจริง ตารางล้น หัวข้อค้างท้ายหน้า วรรณยุกต์ลอย ดูจากโค้ดไม่เห็น


## reference: theme-colors.md

# Document theme color table

This file says who controls the color of each part of a document, and what the house default colors are. Use it when you must put real colors into a figure, a .docx file or slides.

## Declare the theme — decide once, use everywhere in that document

One document passes through several skills: markdown (`polished-document-style`) · figures from `diagram-figures` ·
.docx files from `branded-document-design` · slides from `presentation-design` (all three are in plugin `software-development`).
If each one picks its own color, the reader gets a document with figures in one color, headings in another, and slides in a third.

**Markdown is the main source (source of truth), so the theme is declared here** — put it at the end of the document header or in a file beside it:

```markdown
<!-- doc-theme: accent=<สีหลัก> · ที่มา=<แบรนด์ลูกค้า / เสนอจากเนื้องาน> · ยืนยันเมื่อ=YYYY-MM-DD -->
```

(Keys: `accent` = main color · `ที่มา` = source (client brand / proposed from the work's content) · `ยืนยันเมื่อ` = confirmed on.)

**The main color comes from the work's content, not from a tool's default.**
If a brand color already exists, use it. If not, search for references per `design-references` (plugin `superuser`) of type `document` and extract the color from the chosen work · if live search is not possible, use the house default, write `(รอยืนยัน)` (awaiting confirmation), carry on without stopping to ask, and propose a tone that fits the work's content in the report.
(Backup: the table matching work content to color tones is in `colour-by-domain` of skill `diagram-figures` (plugin `software-development`).)

Markdown itself has no color, so use labels and font weight instead. Diagrams, figures, .docx files and slides read the value from `doc-theme`. If `doc-theme` has not declared a work-specific accent, use the house default. Both tables are below.

**Status words do not depend on the theme** — วิกฤต (critical) · ผ่าน (pass) use the same words in every document. Status colors in .docx files and slides are below.

## Who controls the color of which part

| Part of the document | Who controls the color | Read the value from |
|---|---|---|
| Headings, tables, text boxes in markdown | Markdown has no color; use bold labels and font weight instead | — |
| Mermaid diagrams | `diagram-figures` → `references/engine-mermaid.md` (README · PR: `software-diagrams` item 2 in plugin `software-development`) | `doc-theme` |
| Figures that are image files | `diagram-figures` (plugin `software-development`) | `doc-theme` |
| Exported .docx / .pdf files | `branded-document-design` (plugin `software-development`) items 0–1 | `doc-theme` |
| Slides | `presentation-design` (plugin `software-development`) | `doc-theme` |

## House default

If `doc-theme` has not declared a work-specific accent, every skill uses this set as the default, so figures, documents and slides share one palette from the start. This is the same set as `presentation-design` and `branded-document-design`:

| token | Value | Used for |
|---|---|---|
| brand | `#2A78D6` | Main color · headings · accent lines |
| brand-deep | `#2A4C86` | Table headers · H2 · system names |
| brand-2 | `#6A5CD6` | Secondary accent (purple) |
| tint | `#EDF1FB` | Table header background · highlight box background |
| ink / body | `#333B4A` / `#414957` | Headings / body text |
| muted / faint | `#7D8492` / `#A9AEB9` | Captions / notes |
| line | `#E4E7EE` | Borders · connector lines |
| exception | `#C77A11` | A path/zone that is not the main route (always different from brand) |
| Font | Tahoma (documents/slides) · Noto Sans Thai → Tahoma (images) | Both Thai and English |

Once a work-specific accent is declared, use it in place of brand, and compute the other colors from that accent.


---

# skill: diagram-figures

Use when a document or slide needs a designed diagram

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


## reference: colour-by-domain.md

# Work domain → colour tone

Use this when the document has no `doc-theme` and no brand colour. Use the house default `#2A78D6`, mark it `(รอยืนยัน)` (to be confirmed), and carry on without stopping to ask. Put a tone from this table in the report so the user can choose later (the full order is in `diagram-figures` item 5). This table is shared by both engines of `diagram-figures` and by every skill that draws figures.

| Domain | Suggested tone | Reason |
|---|---|---|
| Medical · health | Teal · green | Cleanliness, safety |
| Finance · banking | Dark blue · silver grey | Stability |
| Industry · factory | Amber yellow · steel grey | Machinery, warning |
| Education | Purple · light orange | Enthusiasm |
| Retail · food | Orange · pinkish red | Warmth, appetite |
| Government · law | Navy · oxblood | Formality |
| General software | Blue | Neutral default when there is no other context |


## reference: design-system.md

# Figure design system — details

Contents: figure header → size system → colour system → hand-drawn line icons. The short rules are in `SKILL.md`.

## Figure header (from item 3)

The logo goes before the figure title. Every template already has an `<img class="logo">` slot pointing at the project's `assets/logo/`; change only the file name. If the project has no logo yet, the slot disappears by itself, but note in the report that the logo is missing, because a figure without a logo always gets asked "โลโก้อยู่ไหน".

The reason is not looks. Architecture figures get copied into emails, slides and contracts, and then live on for a year. **A figure with no date is one nobody dares edit and nobody dares trust.**

The sub-title says "what the real thing is", not an expansion of the title:

```
ผิด: ภาพรวมระบบ Dr Screening
ถูก: เครื่องเดียวในห้อง Server ของโรงพยาบาล รันทุกบริการด้วย Docker Compose
```

## Size system (from item 4)

| Item | Value |
|---|---|
| Text | Figure title 30 · box title 16 · description 13.5 · group label 12 uppercase |
| Icon | Frame 66px · corner 18px · icon 29px · stroke 1.6px |
| Box | Corner 20px · 1px light grey border · nested box corner 16px, very light grey fill |
| `.focus` box | 2px border in a dark shade of `--accent` · corner 22px |
| Connector | Vertical or horizontal only · right-angle bends with a rounded corner of radius 10px (SVG/Python engine uses 12–14) · no diagonal lines, no free curves, no sharp corners |
| Spacing | 12 · 20 · 26 · 34 · 48 · column gap 130 |

> **The icon frame must be big.** 66px is the point where a figure starts to look deliberate, not like a generated diagram.
> Below 56px the icon becomes a small dot inside a big box and the figure looks hollow.

## Colour system (from item 5)

In the HTML templates, change `--accent` in `:root` in one place; the light and dark shades are computed from it. (In the SVG/Python engine, change `ACCENT` in `theme.py`.)

**Figure background follows the project's design.** Append `#accent=<main colour>&bg=<background colour>` to the file name to match the deck or app. A dark or light background both work. Every grey is computed from the background (currently available in `figure-flow.html`). Without `bg` you get a white background.

Exceptions that do not change with the brand:

- **Provider logo colours.** AWS orange and Azure blue must be their real colours, not our brand colour.
- **Structural grey.** Borders and box fills must be faint enough not to compete with the content.

**Icon colour has 7 groups, and each group must mean something.**

| Class | Use for |
|---|---|
| `t-neutral` | People, devices, things outside the system, plain file storage |
| `t-edge` | Entry and exit points · gateway · API |
| `t-app` | Tools the user works with |
| `t-view` | Parts the user uses to view or read results |
| `t-data` | Database · backup |
| `t-alert` | Queues, work that can pile up, things that hurt when they break |
| `t-warn` | Things with conditions — licences, legal limits |

Every frame has a **light fill with a border in the same tone**, not a solid fill, because a solid colour pulls the eye away from the content.
If you want an 8th colour, you are using colour for looks, not for meaning.

## Hand-drawn line icons (from item 6)

Hand-drawn line icons: `viewBox 0 0 24 24` · `stroke-width 1.6` · no fill · round line caps.
The shape must be readable at 24px, because detail beyond 3 strokes turns into a black blob.

## Fonts in figures embedded in a deck (from item 8)

  For a figure that will be embedded in a deck (`StageDeck` · `html-slide-deck`), move `"IBM Plex Sans Thai"` to the first position so the figure gets the same font as the deck body. A Word document uses the brand's Thai font and falls back to Tahoma if it is missing, per `branded-document-design` item 2; a figure inside it may use a different font.
  If the machine has none of them, the figure silently falls back to a font that places vowels in the wrong position, so **always render and look**.


## reference: engine-mermaid.md

# Mermaid → right-angle figures with rounded corners

Route 3 of `diagram-figures`. Use it when a document has dozens of Mermaid blocks (sequence · state · ER · gantt) and must be delivered as a Word or PDF file that looks designed.
An image drawn by Mermaid itself has free-curved, diagonal lines and colours that do not match hand-drawn figures. This engine reads the original blocks and redraws them with the same rules as the HTML templates.

## What you get

- Vertical or horizontal lines only, bent with rounded corners (radii are in `theme.py`: `WIRE_R` 12 · box `BOX_R` 10)
- Line labels are white with a light border, and a checker makes sure no label overlaps a box or a line
- The one main box is a dark card with a gradient border, matching the `.focus` box
- Layout is done by ELK (`elkjs`, layered + orthogonal), so you do not place coordinates yourself

## Use

1. Copy the folder `assets/mermaid-engine/` to `docs/figures/src/gen/`
2. Edit `figures.json`:
   - `prefix` is the project code (`document-naming`)
   - `drafts` is the folder of `.md` files that hold Mermaid blocks
   - `skip` is the blocks that already have a hand-drawn figure
   - `captions` replaces captions generated from headings
3. Edit `theme.py`: make `ACCENT` and `SECOND` match the project's `doc-theme`, and `MEASURE_FONTS` must point at real font files on the machine
4. Run `python build.py`. You get `docs/figures/<prefix>-<file>-m<N>.png` and `map.md`, which says which block became which file
   - If `elkjs` is not installed yet, `elk.py` installs version 0.9.3 into the configured `node_modules` folder by itself
5. Always check the output:
   - A `PROBLEM` line means a diagonal line, an overlapping label, or an unreadable block. Do not deliver while any such line remains
   - Open and look at at least 1 figure of each type

## Limits

- Works for 4 types: `sequenceDiagram` · `stateDiagram-v2` · `erDiagram` · `gantt`. Draw a flowchart as an HTML template (item 2 of SKILL.md), because flowcharts are the figures people read most
- The figure is 1240px wide to fit a portrait A4 page. If a figure has more than 7 participants, the text gets small; split the figure or put it on a landscape page


## reference: engine-svg-python.md

# SVG/Python engine — รูปที่ generate จากข้อมูลหรือโค้ด

ทางที่ 2 ของ `diagram-figures` ใช้แทนโครง HTML เมื่อรูปต้องสร้างจากข้อมูลหรือโค้ด เช่น รูปหลายใบที่ต้องออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือรูปที่ต้องคุมตำแหน่งทุกจุดเองบนกริดด้วยเส้นตั้งฉากมุมโค้ง
Python เขียน SVG ลงกริดแล้วเรนเดอร์เป็น PNG ส่วนไอคอนและโลโก้มาจากคลังเดียวกับโครง HTML ([icons.md](icons.md))

ข้อเสียคือใช้เวลา เพราะ 1 รูปต้องแก้หลายรอบ ดังนั้นให้ใช้เฉพาะรูปที่คนนอกทีมจะเห็นและเห็นซ้ำ

> **สีหลัก = สีหลักของโปรเจกต์** · หาตามลำดับใน `diagram-figures` ข้อ 5 (ระบบสี) แล้วใส่ใน `ACCENT` ของ `theme.py` · ชุดประจำบ้าน `#2A78D6` ใช้เฉพาะเมื่อลำดับนั้นหาไม่เจอเลย

---

**สารบัญ**
- [0 · สีมาจากเนื้องาน — ไม่หยุดถาม](#0--สีมาจากเนื้องาน--ไม่หยุดถาม)
- [1 · ลำดับการทำงาน](#1--ลำดับการทำงาน)
- [2 · โครงไฟล์](#2--โครงไฟล์)
- [3 · กฎข้อที่หนึ่ง — กริดก่อน เส้นทีหลัง](#3--กฎข้อที่หนึ่ง--กริดก่อน-เส้นทีหลัง)
- [4 · เส้นเชื่อม](#4--เส้นเชื่อม)
- [5 · ป้ายบนเส้น — สองบทบาทเท่านั้น](#5--ป้ายบนเส้น--สองบทบาทเท่านั้น)
- [6 · โซน](#6--โซน)
- [7 · ไอคอนและโลโก้](#7--ไอคอนและโลโก้)
- [8 · เรนเดอร์](#8--เรนเดอร์)
- [9 · วงจรตรวจงาน — ห้ามข้าม](#9--วงจรตรวจงาน--ห้ามข้าม)
- [10 · ค่าคงที่ที่ใช้ได้จริง](#10--ค่าคงที่ที่ใช้ได้จริง)
- [11 · แถบสัญลักษณ์](#11--แถบสัญลักษณ์)
- [ตัวย่อ](#ตัวย่อ)

## 0 · สีมาจากเนื้องาน — ไม่หยุดถาม

**ถ้าเอกสารต้นทางประกาศ `doc-theme` ไว้แล้ว ให้ใช้ค่านั้นและอย่าถามซ้ำ**
(ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร") ถ้ายังไม่มี ให้ทำตามข้างล่างนี้แล้วเขียนกลับลง `doc-theme`

**ไม่มีสีแบรนด์ → ทำตามลำดับใน `diagram-figures` ข้อ 5:** ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม
เสนอโทนจากเนื้องานตามตารางใน [colour-by-domain.md](colour-by-domain.md) ไว้ในรายงานให้เลือกทีหลัง

ใส่**สีหลักสีเดียว**ที่ `ACCENT` ใน `assets/svg-engine/theme.py` แล้วเฉดอ่อนและเข้มทั้งหมด
จะคำนวณจากสีนั้นด้วย `tint()` โค้ดวาดรูปจึงไม่มีสีอื่นฝังอยู่

สีเดียวที่ไม่ผูกกับ `ACCENT` คือ `EXCEPT_HUE` สำหรับป้าย "ข้อยกเว้น" ซึ่งต้องต่างจากสีหลักเสมอ
ถ้าสีหลักเป็นส้มอยู่แล้ว ให้เปลี่ยน `EXCEPT_HUE` เป็นสีอื่นที่ตัดกัน

---

## 1 · ลำดับการทำงาน

1. อ่านไดอะแกรมที่มีอยู่ทั้งหมดก่อน แล้วถามว่า**รูปนี้ตอบคำถามอะไร** — 1 รูปตอบ 1 คำถาม
2. เลือกสีตามข้อ 0 (ไม่มีสี → ค่าประจำบ้าน + `(รอยืนยัน)`)
3. **วางตำแหน่งทุกกล่องลงกริดก่อนลากเส้น** — ข้อนี้สำคัญที่สุด ดูข้อ 3
4. แก้ `theme.py` และ `ref.py` ให้เสร็จก่อน แล้วค่อยเขียนไฟล์รูป
5. **เรนเดอร์แล้วเปิดไฟล์ภาพดูจริง** ไม่ใช่แค่เช็กว่าสคริปต์รันผ่าน
6. เมื่อได้รูปที่สะอาดแล้ว จึงเขียนลงโฟลเดอร์ปลายทาง ส่วนรูปเก่าให้ย้ายไป `_to_delete/`

---

## 2 · โครงไฟล์

```
architecture/
  01-system-context.png      ← ผลลัพธ์ เลขนำหน้าเรียงตามลำดับการอ่าน
  _src/
    theme.py                 ← สีทั้งหมด — แก้ที่นี่ที่เดียว
    ref.py                   ← ภาษาภาพ: โซน หน่วย เส้น ป้าย แถบสัญลักษณ์
    render.py                ← SVG → PNG ด้วย Playwright ที่ 2 เท่า
    d01.py … dNN.py          ← หนึ่งไฟล์ต่อหนึ่งรูป มีแต่การจัดวาง
    logos/                   ← โลโก้ผลิตภัณฑ์ + colors.json
```

ให้คัดลอกทั้งโฟลเดอร์ [`assets/svg-engine/`](../assets/svg-engine/) ไปเป็น `_src/` แล้วเริ่มงาน — [`d01.py`](../assets/svg-engine/d01.py) เป็นรูปตัวอย่างที่เรนเดอร์ได้จริง

---

## 3 · กฎข้อที่หนึ่ง — กริดก่อน เส้นทีหลัง

เส้นเฉียงทำให้อ่านยาก แต่การดัดเส้นทีหลังไม่ช่วย **ต้องแก้ที่ตำแหน่ง**

```python
CA,CB,CC,CD,CE,CF = 178,452,678,896,1080,1312   # คอลัมน์
R1,R2,R3          = 288,458,624                  # แถว ห่างกัน ~170
```

ทุกกล่องอยู่บนจุดตัดของคอลัมน์กับแถว และไม่มีตัวไหนหลุดกริด
เมื่อทุกจุดอยู่บนเส้นเดียวกัน เส้นเชื่อมก็ตั้งฉากได้เองโดยไม่ต้องดัด

### กฎจุดกึ่งกลาง

ตัวที่รับหลายทางต้องอยู่**กึ่งกลางของทางเหล่านั้น** ไม่ใช่เกาะแถวใดแถวหนึ่ง
และถ้าส่งต่อหลายทาง ก็ต้องอยู่กึ่งกลางของทางที่ส่งออกด้วย

ให้ใช้**จุดรวมเดียวและจุดแยกเดียว** เพื่อให้เส้นสมมาตร

```python
RM = (R1+R2)//2      # Nginx อยู่กึ่งกลางของสองแถวที่รับเข้ามา
J1, J2 = CB-74, CB+86

flow([(CA+34,R1),(J1,R1),(J1,RM),(CB-30,RM)])   # เข้าจากบน
flow([(CA+34,R2),(J1,R2),(J1,RM),(CB-30,RM)])   # เข้าจากล่าง
flow([(CB+30,RM),(J2,RM),(J2,R1),(CC-30,R1)])   # ออกขึ้นบน
flow([(CB+30,RM),(J2,RM),(J2,R2),(CC-30,R2)])   # ออกลงล่าง
```

### ช่องเดินสาย

เส้นที่ต้องข้ามกริด **ห้ามวิ่งทับแถวที่มีกล่อง** ให้จองช่องว่างไว้เฉพาะ

```python
TB = 238        # ช่องบน — ห่างจากขอบโซนอย่างน้อย 36
MB = R3-48      # ช่องกลาง — ระหว่างแถว
```

---

## 4 · เส้นเชื่อม

เส้นตั้งฉากทั้งหมดและมุมโค้งรัศมี 14 — จุดนี้ทำให้ดูประณีตขึ้นมากโดยไม่เสียความชัดเจน
`ref.flow(pts, dashed=False, arrow=True)` คำนวณมุมโค้งให้เอง

**หัวลูกศรต้องจบที่ขอบไอคอน ไม่ใช่ที่ป้ายชื่อ** — เช่น `CD-30` เมื่อไอคอนกว้าง 46

---

## 5 · ป้ายบนเส้น — สองบทบาทเท่านั้น

| บทบาท | สี | ใช้กับ |
|---|---|---|
| ปกติ | เฉดอ่อนของ `ACCENT` | สิ่งที่ไหลผ่านเส้นตามปกติ |
| ข้อยกเว้น | `EXCEPT_HUE` | ทางที่ไม่ผ่านประตูหน้า · กรณีพิเศษ |

**ข้อยกเว้นมีได้ป้ายเดียวต่อรูป** ถ้ามีตั้งแต่ 2 ป้าย แปลว่าไม่มีป้ายไหนเด่นจริง

ป้ายบอกว่า**อะไรไหลผ่าน** เช่น `SQL` `/api/` `DICOM 11112` ไม่ใช่ `เชื่อมต่อ`

---

## 6 · โซน

โซนเป็นกรอบพื้นสีอ่อนมาก ส่วนป้ายชื่อเป็นแคปซูลพื้นขาวคร่อมเส้นขอบและมีจุดสีนำหน้า

```python
zone(x, y, w, h, "ห้อง Server ของโรงพยาบาล", "physical")
```

| ชนิด | เส้น | ความหมาย |
|---|---|---|
| `physical` | ทึบ | ขอบเขตของจริงทางกายภาพ — ห้อง อาคาร เครื่อง |
| `logical` | ประ | ขอบเขตเชิงตรรกะ — Docker Compose · namespace · VPC |
| `outside` | ประ | นอกระบบที่เราดูแล |

ผู้อ่านจะเห็นทันทีว่าอันไหนมีอยู่จริง และซ้อนโซนได้ไม่เกิน 3 ชั้น

---

## 7 · ไอคอนและโลโก้

ไอคอน**ลอยบนพื้น ไม่มีกรอบ ไม่มีไทล์** ส่วนชื่อและคำอธิบายอยู่ใต้ภาพ

```python
unit(cx, cy, "Nginx", "ประตูเดียวที่เข้าระบบได้", slug="nginx")
#  มี logos/<slug>.svg → ใช้โลโก้จริง เติมสีจาก colors.json
#  ไม่มี              → ใช้สัญลักษณ์เส้นที่ออกแบบเอง
```

ค่าที่ใช้ได้จริง: ไอคอน 46 · ชื่อ 11.5 ตัวหนา ห่างจากกึ่งกลาง `size/2+20` · คำอธิบาย 10 ห่าง `size/2+35`

โลโก้เอามาจากคลังไอคอนของ skill นี้ ([icons.md](icons.md)) ให้รัน `python assets/find-icon.py --group brands <ชื่อ>` จากโฟลเดอร์ `diagram-figures/` แล้ว `--copy` ไปไว้ใน `_src/logos/`
Simple Icons ให้ SVG สีเดียว `viewBox 0 0 24 24` และมาพร้อม `colors.json` ที่เก็บรหัสสีทางการของแต่ละแบรนด์

### เรื่องเครื่องหมายการค้า — ห้ามข้าม

- โลโก้เป็นของเจ้าของ ใช้เพื่ออ้างถึงตัวผลิตภัณฑ์ในผังได้
  แต่**ห้ามดัดแปลงรูปทรง ห้ามยืดบีบ และห้ามทำให้ดูเหมือนเจ้าของมารับรอง**
- ถ้าตัวไหนไม่มีไฟล์โลโก้ ให้ใช้สัญลักษณ์แทน แล้ว**ระบุชื่อตัวนั้นไว้ในหมายเหตุท้ายรูป**
- อย่าไปดาวน์โหลดโลโก้ใหม่มาเอง ให้ใช้จากชุดที่มีอยู่ หรือให้ผู้ใช้หาจากหน้า brand ของโครงการนั้น

---

## 8 · เรนเดอร์

```bash
pip install playwright && playwright install chromium
python render.py d01.svg ../01-architecture.png 1400 860
```

เรนเดอร์ที่ 2 เท่าเสมอ เพราะ 1 เท่าได้ภาพเบลอเมื่อขยายในสไลด์

ภาษาไทยต้องมีฟอนต์ไทยในเครื่องที่เรนเดอร์ แล้วประกาศไว้ใน `font-family` ของ `<svg>`
**อย่าใช้ Python Imaging Library (PIL) วาดข้อความไทยปนอังกฤษ** เพราะจะได้กล่องสี่เหลี่ยมแทนตัวอักษร

---

## 9 · วงจรตรวจงาน — ห้ามข้าม

เรนเดอร์ → เปิดไฟล์ภาพดูจริง → แก้ → เรนเดอร์ใหม่ จนกว่าจะสะอาด
**6 ข้อนี้เจอซ้ำทุกครั้ง ให้ตรวจทุกรอบ:**

1. **ป้ายบนเส้นทับไอคอนหรือชื่อ** — ย้ายไปกึ่งกลางช่วงที่ยาวที่สุด หรือย้ายไปบนขาตั้ง
2. **เส้นที่ออกจากไอคอนตัดคำอธิบายของตัวเอง** — เริ่มเส้นที่ `cy+58` ไม่ใช่ `cy+32`
3. **ขอบโซนตัดคำอธิบายแถวล่างสุด** — ขอบล่างโซนต้อง ≥ `R_ล่างสุด + 58 + 24`
4. **ข้อความกำกับโซนนั่งทับเส้นขอบ** — รวมกับชื่อในแคปซูลเดียว
5. **หัวลูกศรไปจบที่ป้ายชื่อ ไม่ใช่ที่ไอคอน** — ให้จบที่ขอบไอคอน
6. **ข้อความล้นกรอบ** — ไทย 11.5px ≈ 6.0 px/ตัว · หัวเรื่อง 15px ≈ 7.5 px/ตัว
   ถ้าที่ไม่พอ ให้ตัดคำ **อย่าลดขนาดตัวอักษร**

---

## 10 · ค่าคงที่ที่ใช้ได้จริง

```
ความกว้าง 1400 · ขอบ 56
หัวเรื่องกลางหน้า 22 · คำอธิบายใต้หัว 12.5
ชื่อหน่วย 11.5 ตัวหนา · คำอธิบาย 10 · ป้ายบนเส้น 10.5
เส้นเชื่อม 1.6 · ขอบโซน 1.4 · รัศมีมุมโค้ง 14 · ป้ายสูง 21
```

---

## 11 · แถบสัญลักษณ์

ทุกรูปปิดท้ายด้วยแถบเดียวที่บอกว่ากรอบแต่ละแบบคืออะไร และป้าย 2 สีต่างกันตรงไหน
แล้วต่อด้วยหมายเหตุ 2–4 บรรทัด ซึ่งรวมบรรทัดเรื่องเครื่องหมายการค้า และการอ้างถึงรูปอื่นที่เกี่ยวข้อง

---

## ตัวย่อ

- **SVG** — Scalable Vector Graphics
- **PNG** — Portable Network Graphics
- **PIL** — Python Imaging Library


## reference: icons.md

# คลังไอคอน — ใช้ร่วมกันทั้งโครง HTML และ SVG/Python engine

**ไอคอนมีให้แล้ว 205 ตัวใน `assets/icons/`** ไม่ต้องติดตั้งอะไรเพิ่ม —
เป็น PNG พื้นโปร่ง 160×160 ซึ่งเป็นไอคอนทางการของผู้ให้บริการและเครื่องมือ แบ่งเป็น 9 กลุ่ม

| โฟลเดอร์ | มีอะไร |
|---|---|
| `icons/aws/` | 39 — EC2 · RDS · S3 · Lambda · ELB · Route 53 · CloudFront · SQS · SNS · IAM · CloudWatch … |
| `icons/azure/` | 24 — VM · App Service · AKS · Cosmos DB · Blob Storage · Key Vault … |
| `icons/gcp/` | 21 — Compute Engine · GKE · Cloud Run · BigQuery · Pub/Sub · Firestore … |
| `icons/k8s/` | 16 — Pod · Deployment · Service · Ingress · ConfigMap · Secret · Node … |
| `icons/data/` | 17 — PostgreSQL · MySQL · MongoDB · Redis · Elasticsearch · ClickHouse … |
| `icons/queue/` | 6 — RabbitMQ · Kafka · Celery · NATS · ActiveMQ · EMQX |
| `icons/infra/` | 26 — Nginx · Docker · HAProxy · Traefik · Istio · firewall · router · Windows · Linux … |
| `icons/ops/` | 19 — Prometheus · Grafana · Jenkins · GitLab CI · GitHub Actions · Terraform · Vault … |
| `icons/app/` | 37 — Angular · React · .NET · Spring · Python · LINE · Slack · Stripe · ผู้ใช้ … |

รายชื่อทั้งหมดอยู่ใน [`assets/icons/INDEX.md`](../assets/icons/INDEX.md) และเปิด [`assets/icons/contact-sheet.html`](../assets/icons/contact-sheet.html) เพื่อดูรูปทั้งหมดในหน้าเดียว

**ถ้าต้องการตัวที่ไม่มีใน 205 ตัวนี้** ให้ค้นในคลังเต็ม `assets/tech-icons.zip` (8,602 ไอคอน · 5 กลุ่ม) ด้วย [`find-icon.py`](../assets/find-icon.py) ซึ่งไม่ต้องติดตั้งอะไรและไม่ต้องแตกทั้งก้อน

| กลุ่ม | มีอะไร |
|---|---|
| `cloud/` | 1,986 PNG · AWS · Azure · Google Cloud · IBM · Oracle · Alibaba · DigitalOcean · Firebase … |
| `platform/` | 471 PNG · ฐานข้อมูล · คิว · CI/CD · เฝ้าระวัง · Kubernetes · ภาษาโปรแกรม · GIS |
| `brands/` | 3,461 SVG สีเดียว · โลโก้แบรนด์ + รหัสสีทางการใน `colors.json` |
| `devtools/` | 572 SVG มีสี · โลโก้เครื่องมือนักพัฒนา |
| `ui/` | 2,112 SVG ไอคอนเส้นทั่วไป (Lucide) ไม่ใช่โลโก้ |

```bash
python assets/find-icon.py kafka redis                       # ค้นชื่อ
python assets/find-icon.py --group ui user                    # ค้นเฉพาะกลุ่ม
python assets/find-icon.py --copy cloud/aws/compute/ec2.png brands/docker.svg --to docs/figures/icons
python assets/find-icon.py --colors docker                    # สีทางการของโลโก้
```

ให้ดึงมาเฉพาะตัวที่ใช้แล้ววางไว้ข้างไฟล์รูป ห้ามแตกทั้งคลังลงโปรเจกต์ สัญญาอนุญาตของคลังคือ MIT · CC0 · ISC (ดู `--groups`) แต่โลโก้ยังเป็นเครื่องหมายการค้าของเจ้าของ

> **เรื่องสัญญาอนุญาต** — ชุดไอคอนสถาปัตยกรรมของ AWS · Azure · Google Cloud
> เผยแพร่มาเพื่อใช้วาดผังสถาปัตยกรรมโดยเฉพาะ จึงใช้ในเอกสารข้อเสนอได้
> สิ่งที่ทำไม่ได้คือใช้โลโก้ในลักษณะที่ทำให้เข้าใจว่าผู้ให้บริการรับรองหรือร่วมงานด้วย
> และใช้เป็นส่วนหนึ่งของแบรนด์ตัวเอง ส่วนถ้าไม่มีไอคอนทางการของเครื่องมือนั้น ให้วาดไอคอนเส้นเองตาม [SKILL.md](../SKILL.md) ข้อ 6


## reference: layout-cloud.md

# โครง `figure-cloud.html` — ผังคลาวด์พร้อมโลโก้ผู้ให้บริการ

โครงนี้ตอบคำถาม "ใช้บริการอะไรของคลาวด์บ้าง" ไฟล์โครงอยู่ที่ [`assets/figure-cloud.html`](../assets/figure-cloud.html)

ใช้เมื่อผู้อ่านคาดหวังจะเห็นไอคอน Amazon Web Services (AWS) · Azure · Google Cloud ·
Kubernetes ของจริง แบบผังอ้างอิงที่ผู้ให้บริการเผยแพร่ ไอคอนหาได้จากคลังตาม [icons.md](icons.md)

```html
<div class="unit"><img src="icons/aws/ec2.png" alt="">
  <div class="name">Web Server</div><div class="desc">AZ-1</div></div>
```

**กติกาเฉพาะโครงนี้:**

- **สายที่ข้ามขอบเขต ให้ออกจากขอบของกล่องขอบเขต** (`n-region`) ไม่ใช่จากกล่องข้างใน
  — เพราะถ้าต่อจากกล่องข้างใน เส้นจะพาดทะแยงทับทุกอย่างที่ขวางทาง
- **เส้นประ = ขอบเขตที่ผู้ให้บริการจัดการให้** ส่วนเส้นทึบสีส้ม = เครื่องที่เราดูแลเอง
  และให้ใส่ความหมายไว้ในคำอธิบายสัญลักษณ์เสมอ
- ไอคอนแสดงเปล่า ๆ ไม่ต้องมีกรอบ เพราะโลโก้มีสีและรูปทรงของตัวเองอยู่แล้ว
- ชื่อบริการใช้ชื่อทางการ (`Amazon RDS`) ส่วนคำอธิบายใต้ชื่อเป็นภาษาไทยได้


## reference: layout-context.md

# โครง `figure-context.html` — ระบบกับโลกภายนอก

ตอบคำถาม "ระบบนี้คุยกับใครและกับอะไรข้างนอกบ้าง" (C4 ระดับ 1) ไฟล์โครงอยู่ที่ [`assets/figure-context.html`](../assets/figure-context.html)

```
┌─ หัวรูป ────────────────────────────────────────────────────────┐
│  ผู้ใช้งาน (แถบนอน)   →   ระบบที่อธิบาย (การ์ดใหญ่)   ←   ระบบภายนอก  │
│  ─ เจ้าหน้าที่           ─ ชื่อ + คำขยาย                ─ external system │
│  ─ แพทย์                ─ หน้าที่ 3-6 ข้อ               ─ ชื่อ + สถานะ    │
│  ─ ผู้ดูแล               ─ ป้ายข้อจำกัด                                │
├─ คำอธิบายสัญลักษณ์ ─────────────────────────────────────────────┤
│  เชิงอรรถ — ความหมายเส้นประ · ตัวย่อทั้งหมด · รูปถัดไป              │
└────────────────────────────────────────────────────────────────┘
```

- **ผู้ใช้งานอยู่ซ้าย ส่วนระบบภายนอกอยู่ขวา** และไม่ปนกัน เพราะคนกับเครื่องเป็นคนละชนิด
- **หน้าที่ในการ์ดกลางมี 3 ถึง 6 ข้อ** ถ้าเกินนี้ แปลว่ากำลังเขียน SRS ไม่ใช่วาดรูป
- **ระบบภายนอกที่ยังไม่ได้เชื่อม** ให้ใช้เส้นประ (`planned:true`) แล้วเขียนไว้ในการ์ดว่าอยู่ในแผนเวอร์ชันไหน
  — เพราะรูปที่วาดเฉพาะของที่มีแล้วจะถูกถามซ้ำทุกรอบว่า "แล้วเชื่อม HIS หรือยัง"
- **มีคำอธิบายสัญลักษณ์เสมอ** เมื่อรูปทรงหรือเส้นสื่อความหมาย
- **ตัวย่อเขียนเต็มที่เชิงอรรถ** เพราะผู้อ่านฝั่งลูกค้าไม่รู้ว่า SEG คืออะไร


## reference: layout-deployment.md

# โครง `figure-template.html` — deployment · ข้างในเครื่อง

ตอบคำถาม "ของจริงรันอยู่บนเครื่องอะไร มีอะไรอยู่ข้างใน" ไฟล์โครงอยู่ที่ [`assets/figure-template.html`](../assets/figure-template.html)

โครงนี้มี 3 คอลัมน์ เรียงซ้ายไปขวาตามทิศที่ข้อมูลไหล:

```
┌─ หัวรูป ───────────────────────────────────────────────┐
│  ชื่อ + คำขยาย                    เลขรูป · เวอร์ชัน · เจ้าของ  │
├────────────┬──────────────────────────┬────────────────┤
│ นอกระบบ    │  ⬅ กล่อง .focus           │ ปลายทาง        │
│ คน อุปกรณ์  │  สิ่งที่เอกสารนี้อธิบาย       │ ข้อบังคับ       │
│ ระบบอื่น    │  ซ้อนได้อีก 1 ชั้น          │ ของที่ไหลออก    │
├────────────┴──────────────────────────┴────────────────┤
│ เชิงอรรถ — รูปอื่นที่เกี่ยวข้อง · ที่มาของไอคอน              │
└────────────────────────────────────────────────────────┘
```

**ซ้อนกล่องได้ไม่เกิน 3 ชั้น** คือ คอลัมน์ → กล่องใหญ่ → กล่องย่อย
ถ้ามีชั้นที่ 4 แปลว่ารูปนี้ตอบ 2 คำถาม ให้แยกเป็น 2 รูป

**กล่อง `.focus` มีได้กล่องเดียวต่อรูป** ถ้ามี 2 กล่อง แปลว่ายังไม่ได้ตัดสินใจว่ารูปนี้เรื่องอะไร


## reference: layout-flow.md

# โครง `figure-flow.html` — ข้อมูลไหลผ่านอะไร ตามลำดับไหน

ตอบคำถาม "ข้อความ 1 ชิ้น (คำขอ · งาน · เอกสาร) วิ่งผ่านอะไรบ้าง ตามลำดับไหน" ไฟล์โครงอยู่ที่ [`assets/figure-flow.html`](../assets/figure-flow.html) · ตัวอย่างที่เรนเดอร์แล้ว [`assets/figure-flow-example.png`](../assets/figure-flow-example.png)

```
┌─ หัวรูป ──────────────────────────────────── ①–⑥ ความหมายเลขลำดับ ┐
│ ┌ผู้ใช้┐   ┌ช่องทาง┐    ┌ เครื่องที่รัน (เทา) ─────────┐   ┌ บริการภายนอก ┐ │
│ │ คน  │①→│ เว็บ   │②→ │ ┌ ระบบ .focus (สีหลัก) ┐ │③→ │ AI · API     │ │
│ │ คน  │①→│ LINE  │②→ │ │ ชั้น · หน้าที่         │ │   └─────────────┘ │
│ │ คน  │ →│ หลังบ้าน│ → │ │ ชั้น · หน้าที่         │ │④→ ┌ ข้อมูล ──────┐ │
│ └────┘   └──────┘    │ └──────────────────────┘ │   │ ไฟล์ · DB    │ │
│                       └─────────────────────────┘   └─────────────┘ │
├─ เชิงอรรถ: ความหมายพื้นสีอ่อน · เส้นประ · ตัวย่อทั้งหมด ───────────────┤
```

## สี — มาจากสีหลักของโปรเจกต์ตัวเดียว

- แก้ `--accent` ใน `:root` ที่เดียว แล้วเฉดเข้ม พื้นอ่อน และสีตัวหนังสือบนพื้นสีหลักคำนวณให้เอง (สีสว่างเช่นเหลือง สคริปต์จะสลับตัวหนังสือเป็นสีเข้มให้อ่านออก)
- หาสีหลักตามลำดับใน SKILL.md ข้อ 5 · ลองสีอื่นโดยไม่แก้ไฟล์: เปิด `figure-flow.html#accent=0F8B8D`
- **สีหลักใช้กับ 4 อย่างเท่านั้น:** ขอบกล่อง `.focus` · ป้ายชื่อระบบ · เส้นทางข้อมูลกับเลขลำดับ · ชื่อโปรเจกต์ในหัวรูป
- โครงที่เหลือเป็นเทากลาง — กลุ่มเส้นประ กล่องเครื่องที่รัน การ์ด ส่วนไอคอนใช้ 7 สีความหมายเดิม (ข้อ 5)

## กติกา

- **ทิศเดียว ซ้าย → ขวา**: ผู้ใช้ → ช่องทาง → ระบบ → ของที่ระบบเรียกใช้ ถ้ามีเส้นย้อนกลับ ให้บอกในคำอธิบายชั้น (เช่น "push คำตอบกลับ LINE") แทนการลากเส้นย้อน
- **เลขลำดับ = เส้นทางของ 1 ข้อความ** ไม่ใช่เลขเส้น เส้นที่เกิดพร้อมกันใช้เลขเดียวกัน (สองช่องทางเข้า = ② ทั้งคู่) · เส้นทางแยกที่ไม่ได้เกิดทุกครั้ง (เช่นอ่านภาพ) ไม่ต้องมีเลข
- **ชั้นในกล่องระบบ 5–9 ชั้น** เรียงตามลำดับที่ข้อความผ่าน · ชื่อชั้นสั้น หน้าที่ 1–2 บรรทัด ถ้าเกิน 9 ชั้น แยกเป็นรูปข้างในระบบอีกรูป
- **ชั้นเน้น `.guard` ไม่เกิน 2 ชั้น** และเขียนความหมายไว้ที่เชิงอรรถ
- **เส้นต่อเข้าชั้นที่ทำงานนั้นจริง** ไม่ใช่ขอบกล่องใหญ่ — เส้นวาดอยู่บนกล่อง หัวลูกศรจึงถึงชั้นข้างใน
- **เส้นที่ใช้ช่องว่างเดียวกันต้องไม่ตัดกัน** — เลื่อนช่วงหักด้วย `mx` (เส้นที่ปลายอยู่สูงกว่าให้ `mx` น้อยกว่า) แล้วเรนเดอร์ดูทุกครั้ง
- ป้ายบนเส้นเป็นคำสั้น 1–3 คำบอกว่าอะไรไหลผ่าน (`HTTPS` · `webhook` · `ถาม LLM`) · ต้นเส้นมีเลขลำดับ ให้ใช้ `lp:"start"` เมื่อช่วงท้ายสั้นเกิน


## reference: pitfalls.md

# กับดักที่เจอจริง — โครง HTML

อาการที่เจอซ้ำเมื่อทำรูปด้วยโครงใน `assets/` พร้อมสาเหตุและทางแก้ ส่วนกับดักของ SVG/Python engine อยู่ใน [engine-svg-python.md](engine-svg-python.md) ข้อ 9

| อาการ | สาเหตุ · ทางแก้ |
|---|---|
| หัวลูกศรหายทั้งรูป | สคริปต์ลบ `path` ทุกตัวก่อนวาดใหม่ รวมถึงสามเหลี่ยมหัวลูกศรที่อยู่ใน `<defs>` — ลบเฉพาะ `path.wire` (โครงแก้ไว้แล้ว) |
| เส้นลากไปผิดกล่อง | `id` ไปติดกล่องอื่นที่หน้าตาเหมือนกัน — เปิด console ดู `wire: ไม่พบ id` และตรวจว่า `id` ไม่ซ้ำ |
| เส้นจ่อกลางกล่องสูง แล้วพาดทับของข้างใน | ใส่ `tp` / `fp` ให้เส้นเข้าใกล้ขอบบน |
| สระไทยหาย | เครื่องไม่มีฟอนต์ไทยในรายการ — ติดตั้ง Noto Sans Thai หรือเพิ่มฟอนต์ที่มีเข้าไปในรายการ |
| ภาพเบลอในสไลด์ | เรนเดอร์ด้วยตัวคูณ 1 |
| รูปมีขอบขาวเยอะ | ถ่ายทั้งหน้าแทนที่จะถ่ายเฉพาะ `.sheet` |
| แก้ข้อความแล้วเส้นหลุด | เขียนพิกัดเส้นตายตัวแทนที่จะใช้ `WIRES` |
| ป้ายบนเส้นทับกล่อง หรือบังเส้นจนมองไม่เห็น | ป้ายกว้างกว่าช่องว่างระหว่างคอลัมน์ — เพิ่ม `gap` หรือตัดคำในป้ายให้สั้นลง |
| ชื่อกล่องภาษาไทยตกบรรทัดสอง | คอลัมน์แคบไป — เพิ่มความกว้างคอลัมน์นั้น อย่าลดขนาดตัวอักษร |
| ใช้ไอคอนเป็นไฟล์ภาพแล้วเส้นลากผิดตำแหน่งทั้งรูป | สคริปต์คำนวณก่อนรูปโหลดเสร็จ — เรียก `draw()` ใน `window.onload` ไม่ใช่ตอนอ่านสคริปต์ (`figure-cloud.html` ทำไว้แล้ว) |
| เส้นหักมุมใน `figure-flow.html` ตัดกันเอง | หลายเส้นใช้ช่องว่างเดียวกัน — ตั้ง `mx` ให้เส้นที่ปลายอยู่สูงกว่ามีค่าน้อยกว่า แล้วเรนเดอร์ดูใหม่ |
| ลูกศรหายเข้าไปใต้กล่องระบบ | ชั้น `.wires` ไม่มี `z-index` — โครง flow ตั้งไว้แล้ว ถ้าก๊อปไปใช้โครงอื่นต้องตั้งตาม |
| รูปออกมาเป็นสีของรูปตัวอย่าง | ลืมแก้ `--accent` — หาสีหลักของโปรเจกต์ตาม SKILL.md ข้อ 5 ก่อนเรนเดอร์ |
| เส้นพาดทะแยงทับทั้งรูป | ต่อเส้นจากกล่องข้างในกล่องขอบเขต — ต่อจากขอบของกล่องขอบเขตแทน |


## reference: wires.md

# สายเชื่อม — รายละเอียด

เปิดเมื่อเขียน `WIRES` หรือแก้เส้นที่ลากผิด

**ในคอลัมน์เดียวกัน** ให้ใช้ลูกศรลง `.down` ระหว่างกล่อง โดยไม่ต้องเขียนอะไรเพิ่ม

**ข้ามคอลัมน์** ให้ใช้รายการ `WIRES` ท้ายไฟล์ แล้วสคริปต์จะลากเส้นให้หลังจัดหน้าเสร็จ:

```js
{from:"n-browser", fs:"r", to:"n-server", ts:"l", tp:0.10, label:"HTTPS 443"}
//    ^id ต้นทาง   ^ด้านออก  ^id ปลายทาง  ^ด้านเข้า ^ตำแหน่งบนขอบ 0=บน 1=ล่าง
```

ที่ต้องคำนวณหลังจัดหน้า เพราะตำแหน่งกล่องขึ้นกับความยาวข้อความไทย
ถ้าเขียนพิกัดตายตัวไว้ พอแก้ข้อความทีเดียวเส้นจะหลุดทั้งรูป

**กติกา:**

- **เส้นวิ่งแนวตั้งหรือแนวนอนเท่านั้น และหักมุมด้วยมุมโค้ง** — ฟังก์ชัน `elbow()` ในโครงทำให้เอง (นอน → ตั้ง → นอน) ใช้ `mx` เลื่อนช่วงหักเมื่อหลายเส้นใช้ช่องเดียวกัน อย่าเขียน `path` เป็นเส้นตรงจากจุดถึงจุด เพราะกล่องสองข้างสูงไม่เท่ากันแล้วเส้นจะเฉียง
- **ป้ายต้องแคบกว่าช่องว่างระหว่างคอลัมน์** ไม่อย่างนั้นป้ายจะทับกล่องหรือบังเส้นจนหาย ถ้าป้ายยาวขึ้น ต้องเพิ่ม `gap` ของ `.stage` ตามไปด้วย
- เลื่อนป้ายไปตามเส้นได้ด้วย `lp` (0 = ต้นทาง · 1 = ปลายทาง · ไม่ใส่ = กลางเส้น)
- เส้นที่ยังไม่ได้เชื่อมจริง ให้ใช้ `planned:true` เพื่อได้เส้นประ แล้ว**เขียนความหมายไว้ที่เชิงอรรถ**
- เส้นข้ามคอลัมน์ **ไม่เกิน 5 เส้น** ต่อรูป เพราะเกินนี้รูปจะกลายเป็นใยแมงมุม
- ต่อเข้า**กล่องเล็กที่สุดที่ถูกต้อง** ไม่ใช่กล่องใหญ่ที่ครอบอยู่ ถ้ากล่องสูงมาก ให้ใส่ `tp` เพื่อเลี่ยงไม่ให้เส้นจ่อกลางกล่อง
- ป้ายบนเส้นบอกว่า**อะไรไหลผ่าน** เช่น `HTTPS 443` ไม่ใช่ `เชื่อมต่อ` ส่วนเส้นที่ไม่มีอะไรจะบอก ไม่ต้องใส่ป้ายเลยดีกว่าใส่คำว่า "ใช้"


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
