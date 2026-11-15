# skill: answer-shape

Use when an answer needs prose, a table or a diagram

# The shape of an answer

This skill gives the shape and structure; every line of wording follows `human-writing` · lives only in plugin `superuser`; other plugins share it through `dependencies`

> **One rule:** whatever structure the content has, the answer uses that shape.
> Comparison → table · connections → figure · one thing → sentences

---

## Pick the shape from signals in the question

The quoted signals are Thai user phrasings; English meanings are in brackets.

| Signal | Shape |
|---|---|
| "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" ("which is better" · "how do they differ" · "what options are there") | **Comparison table** |
| "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" ("what connects to what" · "how does data flow" · "what is the sequence") | **Figure** |
| "มีอะไรบ้าง" ("what are there") when the items are not compared | **Bullet list** |
| "ทำไม" · "แปลว่าอะไร" ("why" · "what does it mean") · one thing with no branches | **Plain sentences** |
| Several numbers that must be seen together | **Table** |
| Steps that must be done in order | **Numbered list** |
| Cannot continue · must wait for something from the user | **Short list: what is blocking → what is needed** |

**The most important signal is having 2 or more "things being compared"**; use a table then,
because in a paragraph the reader must hold the first one in their head while reading the second.

---

## A table that reads easily

- **The first column is the thing being compared**, and the next columns are the aspects compared
- **3–5 columns**; more than that cannot be read in time, and at most 8 rows in a chat answer
- **Every cell must have content** — an empty cell means that column should not exist, or the data is incomplete; if there is no data, write "ไม่มี" (none) plainly · a table where every cell says "it depends" also has no content
- **At most 1 line per cell**; if longer, move it below the table
- **Order rows by weight**: the recommended one or the most used one on top, not alphabetical
- **Column headings are the questions in the reader's head**, not names of academic fields

```
ผิด: | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
ถูก: | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

(Gloss: wrong = "Option | Performance | Complexity" · right = "Option | How fast | Does it need much upkeep".)

**Always close a table with a 1-line conclusion** — a table gives data; it does not say what to choose

---

## When a figure beats a table

Use a figure when **the relationship is the answer** — a table can give properties, but cannot say what connects to what.

| Use a figure | Use a table |
|---|---|
| What connects to what · what sits inside what | Which is better than which, and in what respect |
| A sequence with forks or loops back | A straight sequence of steps with no branches (a numbered list is enough) |
| The same thing in several states | Different things on the same aspects |

In chat, **a small ASCII figure or a short Mermaid is enough** — no need to open a drawing tool

```
กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน
                    │
                    └──▶ ที่เก็บถาวร
```

(Gloss: กล้อง = camera/scanner · รายงาน = report · ที่เก็บถาวร = permanent storage.)

A figure that must be a real file to go into a document or slides uses the figure-drawing skill of that plugin (if there is one)

---

## When sentences beat both

- The answer is shorter than 3 lines — a 2-row table is only decoration and explains nothing
- A question answered "yes" or "no" followed by 1 sentence of reason
- A matter where **the reason matters more than the options** — a table cuts the reason to fit the cell

> A table with one row or 2 short rows means the wrong shape was used · a figure that draws what one sentence can say is the same

---

## When you cannot continue

Whenever you are blocked → list only 2 things: **what is blocking** and **what you need from the user**

- 1 line per item · at most 4 items
- Do not tell the cause at length, do not answer side topics, do not plan the work ahead — wait until you have the thing, then do it
- If there are several paths for the user to choose → each path is 1 item, the easiest on top

```
ผิด: ย่อหน้ายาวเล่าว่า container ใหม่ · โฟลเดอร์ว่าง · OneDrive หาย · แล้ววางแผนแก้ 3 ข้อรอไว้
ถูก: ติดอยู่ 1 เรื่อง:
   - มองไม่เห็นไฟล์ — โฟลเดอร์ที่เชื่อมไว้ว่าง
   ต้องการ 1 อย่าง:
   - แนบ Mockup.html มา หรือบอก path ใหม่
```

(Gloss: wrong = a long paragraph telling that the container is new · the folder is empty · OneDrive is gone · and then planning 3 fixes while waiting · right = "Blocked on 1 thing: cannot see the file — the linked folder is empty. Need 1 thing: attach Mockup.html or give the new path.")

---

## Abbreviations

Abbreviations used in this file · rules for writing abbreviations → `spell-out-abbreviations`

- **ASCII** — American Standard Code for Information Interchange (drawing figures with plain characters)
- **Mermaid** — a language that writes diagrams as text and lets a program draw them
- **DICOM** — Digital Imaging and Communications in Medicine (a standard for medical image files and transfer)
- **API** — Application Programming Interface (the channel through which one program calls another)


---

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

Markdown code examples for every format that `SKILL.md` refers to, ready to copy and use · the rules on when to use each one live in `SKILL.md`

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

Figures in project documents are drawn with `diagram-figures` (plugin `software-development` · house style) and embedded as image files · use Mermaid only for quick figures in a README · do not use it in documents that are handed on, nor in PRs

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

# Thai Office documents

Applies to every Word · Excel · PDF file that contains Thai, whether a script builds it or a person makes it by hand. Details and helpers are in `branded-document-design`.

- Word treats Thai as a complex script, so it has separate font, size and bold fields from Latin. If you set only the Latin field, the Thai text does not change. Set both.
- Do not justify Thai paragraphs. Thai has no spaces between words, so Word stretches the letter spacing and leaves gaps. The exception is a thesis guide that requires Thai Distributed.
- Never use a mono font for Thai text, because Consolas and Cascadia have no Thai letters. Use mono only for codes, keys and numbers.
- Always embed fonts when exporting PDF. Otherwise a machine without the font substitutes another one and the tone marks float.
- Save a CSV that Thai users will open in Excel as UTF-8 with BOM (byte order mark). Otherwise the Thai text turns to garbage.
- Before you say it is done, render every page to an image and look at it. Overflowing tables, headings stranded at the bottom of a page and floating tone marks do not show up in the code.


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
