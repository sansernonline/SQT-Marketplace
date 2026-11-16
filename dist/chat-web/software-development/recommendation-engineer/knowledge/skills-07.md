# skill: answer-shape

Use when an answer needs prose, a table or a diagram

# The shape of an answer — pick prose, table, list or figure from the content

> **One rule:** whatever structure the content has, the answer uses that shape. Comparison → table · connections → figure · one thing → sentences.

## Use when
- Deciding how to lay out an answer: prose, table, list or figure.
- The question compares options, asks what connects to what, or you are blocked and must ask for something.

## Steps
1. Pick the shape from the signal in the question (quoted signals are Thai phrasings; English in brackets):

   | Signal | Shape |
   |---|---|
   | "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" (which is better · how they differ · what options) | **Comparison table** |
   | "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" (what connects to what · how data flows · the sequence) | **Figure** |
   | "มีอะไรบ้าง" (what are there) when the items are not compared | **Bullet list** |
   | "ทำไม" · "แปลว่าอะไร" (why · what does it mean) · one thing with no branches | **Plain sentences** |
   | Several numbers that must be seen together | **Table** |
   | Steps that must be done in order | **Numbered list** |
   | Cannot continue · must wait for something from the user | **Short list: what is blocking → what is needed** |

   Having 2 or more "things being compared" is the strongest signal for a table, because in a paragraph the reader must hold the first one in their head while reading the second.
2. **If you use a table:** the first column is the thing compared, the next columns the aspects · 3–5 columns, at most 8 rows in chat · every cell has content (no data → "ไม่มี"; a table where every cell says "it depends" has no content either) · at most 1 line per cell, longer goes below the table · rows ordered by weight (recommended or most used first, not alphabetical) · column headings are the reader's questions (`เร็วแค่ไหน` · `ต้องดูแลมากไหม`, not `ประสิทธิภาพ` · `ความซับซ้อน`) · always close with a 1-line conclusion.
3. **If the relationship is the answer** (what connects to what, what sits inside what, a sequence with forks or loops, one thing in several states), draw a figure. In chat a small ASCII figure or a short Mermaid is enough (`กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน`). A figure that must be a real file for a document or slides uses that plugin's figure-drawing skill, if there is one.
4. **If the answer is shorter than 3 lines, is yes/no plus 1 sentence of reason, or the reason matters more than the options, use sentences.** A 1–2 row table, or a figure that draws what one sentence can say, is the wrong shape.
5. **If you cannot continue,** list only 2 things: what is blocking, and what you need from the user. 1 line per item, at most 4 items. Do not tell the cause at length, answer side topics or plan ahead. If the user must choose among paths, 1 item per path, easiest first. Example:
   ```
   ติดอยู่ 1 เรื่อง:
      - มองไม่เห็นไฟล์ — โฟลเดอร์ที่เชื่อมไว้ว่าง
      ต้องการ 1 อย่าง:
      - แนบ Mockup.html มา หรือบอก path ใหม่
   ```

## Check before done
- [ ] The shape matches the content's structure (not a table for one thing, not a paragraph for a comparison).
- [ ] Every table has content in every cell and ends with a 1-line conclusion.
- [ ] A blocked answer lists only what is blocking and what is needed.


---

# skill: polished-document-style

Use when a kept document needs headings, tables and theme

# Polished Document Style — headings, tables, callouts, and theme for a kept document

> **Gate before starting (every time):** read the owner's theme → search live references → 3 genuinely different directions → check `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-references` (plugin `superuser`) even when a brand exists (the brand controls color and font, the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **Boundary:** this skill handles the look; the wording belongs to `human-writing`. Open both for a document people keep to read.

## Use when
- Output is for general readers (managers, executives, clients), needs sign-off, or will be shared widely or converted to PDF/Word · any doc with 3+ sections or 500+ words
- Laying out any document people keep to read (Markdown · Word · PDF), including Thai text in Office files
- Not for: internal notes for the author's own team, scratch notes, code comments · a whole Markdown report that must come out as one .docx → `markdown-report-docx` · a rendered .docx/.pptx/.pdf → `branded-document-design` on top of this skill (this skill governs the markdown source)

## Steps
1. **Find an existing template first.** Check the client's or organization's standard: Word/Google Docs templates the client gave · earlier documents in the project (`docs/`, `ref/`) · format requirements in the TOR or contract. If found, use it (headings, order, field names, running numbers) and say which file it came from. If not, use this skill's structure and say no template was found. Readability applies either way.
2. **Start with the header.** A plain-text H1, then a quote box with version, date, status, author, reviewer, tags, closed with `---` (example in [`references/markdown-patterns.md`](references/markdown-patterns.md)). Formal documents (proposal · formal report · contract · postmortem) open with a cover block: type, version, status, date, author, reviewer, related documents.
   - Status takes only: **Draft** (ร่าง) · **Review** (กำลังรีวิว) · **Approved** (อนุมัติแล้ว) · **Archived** (เก็บถาวร) (`status-report` adds `ยังไม่เริ่ม` for work not begun) · in a Sign-off table the Status column is the signer's: **Approved** · **Review** · **Pending** · **Rejected**.
3. **Headings.** One H1 · H2 numbered (`## 1. Section`) · H3 (`### 1.1 Sub-topic`) · H4 rare. 5+ sections → add a table of contents whose links reach the real headings.
4. **Declare the theme once.** At the end of the header put `<!-- doc-theme: accent=… · ที่มา=… · ยืนยันเมื่อ=YYYY-MM-DD -->`; every tool (`diagram-figures` · `branded-document-design` · `presentation-design`) reads the color from there. To choose a color or put real colors into a figure, .docx, or slides, open [`references/theme-colors.md`](references/theme-colors.md).
5. **Labels are words, never emoji** (emoji in headings and badges signal AI-made, `no-ai-look`):

   | Used for | Words |
   |---|---|
   | Importance | วิกฤต · สูง · กลาง · ต่ำ |
   | Work status | เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่ |
   | Check result | ผ่าน · ไม่ผ่าน |
   | Text box type | ข้อแนะนำ (Tip) · ข้อควรจำ (Note) · ข้อควรระวัง (Warning) · อันตราย (Critical) · คำถามที่ยังเปิด (Open Question) |

   Yes/no cells may use `✓` `✗` or "ใช่" / "ไม่". Status badge = a bold word (`**Status:** Approved`).
6. **Callouts** are blockquotes with a bold label · 1–3 sentences · one per topic, no stacking · at most 3–5 per page.
7. **Tables** when items have 2+ attributes (bullets whose lines hold several comma-separated values become a table). Left-align text, center checkmarks and numbers, right-align money · `—` for not applicable · short cells (long content goes in paragraphs; cells over 2 sentences become headings) · bold key columns.
   - Compare options or weigh pros and cons → comparison table with a Recommendation column · needs approval → end with a Sign-off table · 5+ abbreviations → glossary. Examples in `references/markdown-patterns.md`.
8. **Figures** in project documents are drawn with `diagram-figures` (house style) and embedded as images; Mermaid (`software-diagrams`) only for quick figures in a README, PR, or code notes. Place the figure after the paragraph that says what question it answers · 1-line caption under it starting **รูปที่ N —** · never repeat a figure; refer to its number.
9. **Lists and code.** Never nest bullets: use sub-headings or a table. Code blocks always name the language; long code gets the file name as a comment on line 1.
10. **Thai in Word · Excel · PDF** (complex-script font · no justify · embed fonts · BOM CSV): open [`references/thai-office.md`](references/thai-office.md) before creating the file.
11. If the skill that writes the document has a template in `assets/`, run `python scripts/check_outline.py <template.md> <document.md>` before sending. It checks headings are complete and in template order, bold fields complete, table headers match, no field unfilled. In a template, end an optional heading or field with `<!-- optional -->`. After editing the checker, run `--self-test` first.

## Check before done
- H1 in plain text · no emoji in any heading, callout, badge, or table
- Header block with version, date, status, authors · TOC if 5+ sections · sections numbered consistently · TOC links work
- Tables where data has 2+ attributes · every flow or relationship has a `diagram-figures` figure, not default Mermaid
- Code blocks have language hints · glossary if 5+ abbreviations · terms used consistently ("user" vs "customer")
- No placeholder text (TBD, TODO, Lorem ipsum); `(รอยืนยัน)` markers listed in the pending-confirmation list are not placeholders, keep them
- Rendered once in the real viewer (Word · PDF · GitHub preview) · item 3 of `no-ai-look` passed

## References
- [`references/markdown-patterns.md`](references/markdown-patterns.md) — open when writing a header, TOC, callout, table, badge, cover block, comparison table, sign-off, or glossary (copy the examples)
- [`references/theme-colors.md`](references/theme-colors.md) — open when choosing the main color or putting colors into a figure, .docx, or slides
- [`references/thai-office.md`](references/thai-office.md) — open when creating Word · Excel · PDF with Thai
- Abbreviation writing → `spell-out-abbreviations`


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
