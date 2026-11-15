# skill: simplify

Use to cut extras nobody needs yet. Not Claude Code simplify

# simplify — make it simple so a first-time reader can follow

Use on any work handed to people: code, documents, plans, designs, slides, tables and answers · `human-writing` controls **how it is written**, while this skill controls **what the work contains** · lives only in plugin `superuser`; other plugins share it through `dependencies`

## 1 · Main principles

- **The test:** someone not on this work, opening it 6 months from now, must understand it and continue it without asking anyone
- Do only what the task needs; do not provide for a future nobody has asked for
- Cut before adding · if removing a part loses neither meaning nor function, cut it
- Plain things people know beat clever things that need decoding
- **Simple is not sloppy** — never cut correctness, safety, validation of data from outside, error handling that prevents data loss, or what the user asked for explicitly
- **Simple is not one big pile** — reduce the number of things, but keep clear separation of duties, 1 part doing 1 thing, as professional work does

## 2 · Ladder before starting — stop at the first step that works

1. Do we really need this · not needed → do not do it, and say in 1 line what you skipped
2. Is there an existing thing that works (file, template, function, tool, a feature that comes with the system) · yes → use the existing thing
3. Do the shortest version that is still complete and correct

## 3 · By kind of work

| Work | Do | Avoid |
|---|---|---|
| **Code** | Names say what it is and carry units · 1 function does 1 thing · return early instead of nesting `if` · at most 3 levels of indentation · comments say "why" · follow the project's style | An abstraction with a single user · a clever shortcut that is hard to read · one big file doing everything · a pile-up `utils/` folder · a new dependency for a few lines of work |
| **Documents · reports** | Conclusion first · 1 paragraph 1 topic · an example for abstract points · a table for data that is compared | Repeating what was already said · headings with no content · terms the reader does not know |
| **Plans · procedures** | 3–5 key items · every item has an owner and a way to measure done · the fewest steps that work | A list of 20 items with no priority · steps kept "just in case" |
| **Designs · slides · figures** | 1 page 1 point · the shortest path to the user's goal · use patterns people are familiar with | Cramming data until people must squint · decoration that does not help understanding |
| **Tables · data** | Only the columns used to decide · short formulas you can follow | Columns that repeat a meaning · long nested formulas in one line |
| **Answers** | Answer first · as long as the question needs | An explanation longer than the work itself |

Plugin `software-development` has more detail on code and architecture: `lazy-coding` (write less) · `readable-code` (names, function shape, file structure) · `simplicity-first` (documents, plans, architecture) · if installed, open them together

## 4 · Say that you made it simple on purpose

A deliberate shortcut should be written down with how far it works and when it changes, so it does not look forgotten, for example `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process` (gloss: simple: kept in memory — move to Redis when running more than 1 process) · in the report put 1 line `ข้าม: X — เพิ่มเมื่อ Y` (skipped: X — add when Y)

## 5 · 5-point check before sending

1. Can an outsider open it for the first time and understand within 30 seconds
2. Is there any part, step or layer that can be cut with no loss? If so, cut it
3. Does every part added have a reason it is needed now, not "just in case"
4. Is it still complete on correctness, safety, and what the user asked for
5. Are duties still clearly separated, and not several things squashed into one place to look short


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


---

# skill: branded-document-design

Use when a Word, PowerPoint or PDF must look designed

# Branded Document Design

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live for reference designs → 3 genuinely different directions → check `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand controls color and fonts; the search is for finding this piece's structure) · close the job with the line `ด่านก่อนลงมือ:`

> **Language:** write all wording per `human-writing`. This skill gives format and structure; human-writing gives how to write so people can understand.

> **The one rule of this skill:** an exported document must look intentionally designed: one color set, one set of type sizes
> and spacing that is the same on every page. It must not look like someone opened Word and just typed.

## When to use this skill

- The output is a **.docx / .pptx / .pdf** (quotation · business plan · report · contract · software document such as an SRS) that a customer, executive or another team will open
- The document must be **signed off** or attached to a contract/proposal
- Mixed Thai–English documents (they break very easily if fonts are not fully set)
- The same kind of document is issued repeatedly and every copy should look the same

## When **not** to use

- The output is markdown (in the repo or work folder): use `polished-document-style`
- You only need to **read/extract** a received Office file: use `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf`
- Diagrams in a markdown document: use `markdown-visuals`
- A whole-book report from a single Markdown file (shared logo cover · table of contents · tables · figures): use `markdown-report-docx`, which has a ready md → docx script

**The correct order:** write the content as markdown first (polished-document-style)
→ then use this skill to render it into the deliverable file, and always fix content in the markdown (markdown is the source).

---

**Install before use:** `pip install python-docx python-pptx` · LibreOffice (`soffice`) to convert to PDF · `pdftoppm` (poppler) to convert to images

## 0 · Colors come from the project — look in order, do not stop and wait

**If the source markdown already has a `doc-theme`, use that value. Do not ask again, do not set a new one.**
(See `polished-document-style`, section "ธีมของเอกสาร" (document theme).)

If there is none yet, look in the order given in `diagram-figures` item 5, in that one place (`doc-theme` → brand colors in code, logo, brand kit → nothing at all).
Nothing at all → **search for reference designs first:** take the project's keywords to a live search per `design-references` (plugin `superuser`), type `document`, then extract colors from the chosen work. The stored palette library is used when a live search is impossible. Live search impossible → use the house color `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation) in the report, and carry on without stopping to ask. Put a tone suggested by the content of the work (see the next line) in the report for the user to choose later.
Once you have the colors, **write them back into `doc-theme`** in the markdown file so the document, figures and slides use the same colors.

Tones suggested by the content of the work (medical · finance · government etc. · fallback library, used when live search is impossible) → [`references/palette-examples.md`](references/palette-examples.md) · if the customer already has a brand, always use the brand colors.

**There is only one main color.** All light and dark shades are computed from it; do not pick more one by one.
The only colors not tied to the main color are the status colors (success · warning · error), and they must always keep their meaning.


## 0.1 · The document's look continues from the brand's or app's look — do this before the first render

> This skill's defaults (Tahoma · solid color band cover · table with lines in every cell) are the **floor**, not the deliverable look.
> Using the defaults as is = a document that looks printed from Word at every company, even though the brand or app of that job already passed a beauty gate.

1. **Is there an identity already?** Look at the existing brand kit (`graphic-design:brand-kit` if installed; use the colors and fonts from that kit) · `assets/logo/` · `docs/design/` · software work: a mockup that passed the beauty gate (score in `docs/BUILD-PLAN.md`) · field `doc-theme` in `docs/README.md` → if there is: the document must use the same logo (cover + page header), brand colors and patterns as the app · if not: follow item 0
2. **Do 1 direction first.** Only if the user is not wowed, or asks for several directions, do **3 directions in parallel** (3–5 times the labor · `parallel-attempts-pick-best` · a new agent with Bash per direction · for the cover use the 3-direction vote method in section 0.2). Each direction makes an HTML mock of A4 pages: cover · a content page with a real 4-row requirements table + callout · a table-of-contents page or a figure page · **1 figure redone for the direction** (use `diagram-figures`) · the file header says how to build each piece in real Word. When doing several directions they must really differ, for example a dark cover continuing from the app / a light editorial report / an engineering spec.
3. **2 reviewers who did not do the work** (if there is only one direction, score that one only; no mixing) score 1–5 (pass = 4): first impression · continuity with the app · craftsmanship (a long Thai table of 60 rows without breaking mid-word · type scale · contrast) · figures readable when placed for real · really buildable in Word → **mixing is allowed** (cover from one direction, body from another) if the reviewers name the pieces clearly.
4. Work on the render script (do not edit .docx files one by one) → render every copy → **document beauty gate (`ด่านสวย`)**: 2 new reviewers look at images of the real pages (cover · table of contents · chapter opener · long table page · figure page) using the 5 axes above, and take the lower score · ceiling **3 rounds** (more detail in `ui-craft/references/states-and-checks.md` in plugin `software-development` if installed) · record every round's score in `docs/BUILD-PLAN.md`
5. **Fonts:** use the brand's Thai font installed on the machine and embedded in the file (`embed_fonts`) · Tahoma is the fallback when embedding is impossible · **never set Thai text in a mono font** (Cascadia/Consolas have no Thai letters). Mono is for code, keys and numbers only.
6. **Figures in documents · rules the beauty gate often catches · cover** (minimum pixel sizes, rules in the render script's `check`, cover recipe) → [`references/word-layout.md`](references/word-layout.md), section at the end of the file

## 0.2 · A cover that belongs to this document set — make 3 directions, then vote 2 of 3

Use when a document set (proposal · report · business plan) needs its own cover and the default cover looks like another job's. Do one direction first; only if the user is not wowed, or asks for several directions, use this (3–5 times the labor). The full steps (find real examples to hold up · 3 designers · 3 reviewers · voting criteria · cover text) are in [`cover-vote`](references/cover-vote.md).

---

## 1 · Design tokens — never hardcode colors outside this table

This table defines each token's **role**, not the color value. The real values come from item 0, then are set once with `use_brand(...)`.

- tokens: `brand` · `brand_2` · `brand_deep` · `brand_tint` · `brand_tint_2` · `text` · `text_body` · `text_muted` · `line` + 6 status colors (success · info · warning · error · accent · neutral) that **do not change with the brand**
- Choose colors by meaning, not by looks (red = danger/real error only) · use the same meaning set as diagrams
- Thresholds every color set must pass: body text and `text_muted` on the background ≥ 4.5:1 · H2 and table headers (`brand_deep`) ≥ 7:1 · H1 and KPI numbers (`brand`, large) ≥ 3:1 · `use_brand()` checks and stops if it fails · printed in black and white, the hierarchy must still be distinguishable · if it fails, adjust the darkness, do not change the color
- Text is never pure black (use `text_body`) · **do not add type sizes outside the scale** (Word body 11pt · slides 17pt)

Full token table · color meaning table · type scale (pt) · reusable elements + methods → [`references/tokens-and-type.md`](references/tokens-and-type.md). Open it when setting the theme or choosing sizes/colors · examples of color sets used before → [`references/palette-examples.md`](references/palette-examples.md)

---

## 2 · Fonts and Thai — where it breaks most often

Use the brand's Thai font per item 0.1 step 5 first · if absent or not embeddable, use **Tahoma** as the fallback · rules that must not be missed:

- Word treats Thai as a *complex script*: **never set font/size/bold by hand.** Use `style_run()` in `brandkit.py` (it sets `w:szCs` `w:bCs` `w:iCs` and all 4 slots of `w:rFonts`)
- When the Latin and Thai fonts differ → set `bk.FONT` and `bk.LATIN_FONT`, then call `bk.thai_runs(doc.element.body)` and on every header/footer before `save()`
- Line spacing 1.3–1.35 (Tahoma) (the middle value is in `human-writing` `references/thai-line-breaking.md`) · **never justify** Thai paragraphs · to send a PDF, export it from real Word or check by eye first (LibreOffice breaks Thai words differently from Word)
- Linux has no Tahoma → Loma/Sarabun · ReportLab places tone marks wrongly

Details on dual-font traps · embedding fonts · variable fonts · Thai looking small on Linux → [`references/thai-fonts.md`](references/thai-fonts.md). Open it when setting fonts or when a PDF looks off.

---

## 3 · Word page structure

Document structure: cover page (project has a logo and mockup already → a project-specific cover per section 0.2 · no identity → use the default) → table of contents (TOC field) → body (H1 with section numbers · keep-with-next on every heading) → sign-off table · footer "หน้า N" (page N) centered, gray 9pt · full structure line by line → [`references/word-layout.md`](references/word-layout.md), section "Page structure"

**Dark cover** (the app or brand uses a dark screen) → `doc.cover(..., style="night")` · example `scripts/example_srs.py` · image `examples/example_srs-preview.png` · details and lessons from the work's owner → [`references/word-layout.md`](references/word-layout.md). Rule to remember every time:
- The cover background image and logo must not be in the first-page header (Word shows them faded while editing the file). Anchor them to the cover's first paragraph.

**Inner-page table headers must not use a full-width solid dark fill.** Dark cover background · logo size · small text · glow line under the title → [`references/word-layout.md`](references/word-layout.md)

Paper A4 · margins top/bottom 2.2 cm · left/right 2.0 cm give a content width of **17 cm = 9638 twips** (`BODY_TWIPS`)
(use this number to set table column widths so they add up exactly)

---

## 4 · Reusable elements

Elements (`cover()` · `table()` · `pill_table()` · `kpi_row()` · `callout()` · `figure()` · `code()` · `signoff()`): full look and methods → [`references/tokens-and-type.md`](references/tokens-and-type.md)

**Right proportions:** at most 3–5 callout boxes per 10 pages · KPI strip of 3–5 cells · a table over 6 columns should become a landscape page (`landscape_section()`)

---

## 5 · How to use brandkit

Import: `from brandkit import BrandDoc, use_brand, to_pdf` (put `scripts/` on the path or copy `brandkit.py` next to the work) · slides → `brandkit_pptx.BrandDeck` · speaking deck → `brandkit_stage.StageDeck`

Full sample code (Word · slides · Stage deck) → [`references/brandkit-usage.md`](references/brandkit-usage.md) · all methods → `references/api.md` · runnable scripts `scripts/example_srs.py` · `scripts/example_deck.py`

**Stage deck** (the default for a deck used for speaking): the colors `accent`/`bg` are extracted from the source work per `presentation-design` `references/deck-theme.md` (`source_palette.py` prints the `StageDeck(...)` line for you) · if the source has no color, look per `diagram-figures` item 5 · a light background `FFFFFF` with `block=True` (cover and chapter dividers in solid main color) is the default; use a dark background when the source work is dark · no color at all → use `#2A78D6` with background `FFFFFF` + `(รอยืนยัน)` (awaiting confirmation) · details → `references/brandkit-usage.md`

---

## 6 · Check the work by eye — a step that must not be skipped

A document that nobody has opened to look at the real pages is not finished, because there may be tables overflowing the margin, headings stranded at the page bottom,
floating tone marks. These problems cannot be seen from the code.
Render to PDF, convert to images, then **open and look at every page** (Read tool) before delivery · `soffice` and `pdftoppm` commands and the 7-point checklist → [`references/visual-check.md`](references/visual-check.md)

---

## 7 · Anti-patterns

- **Using Word's built-in Heading styles** → use `h1()/h2()/h3()`
- **Thick black default table lines** → `line` 0.5pt lines
- **Pure black text** → use `text_body`
- **Bold table headers with no fill color**
- **Letting Word decide column widths** → always `fixed_widths()`
- **Too many emoji**
- **Sending a file never rendered for a look**
- **Using the skill's default look as the deliverable when the app already has an identity** → do item 0.1
- **A 2000px-wide figure placed on a 17 cm portrait page without thinking about type size** → the text ends up around 5pt (item 0.1 step 6)
- **A decorative image on the cover that nobody said wows** → cut it, let the type be the highlight (references/word-layout.md item 8)
- **Creating a .docx without keeping the source markdown**

Reasons and replacements for each item → [`references/anti-patterns.md`](references/anti-patterns.md)

---

## 8 · Linking with other skills

| Need | Use together with |
|---------|-----------|
| Content structure/wording of formal documents · **the document's color theme** | `polished-document-style` |
| Diagrams to paste in as figures | `diagram-figures` (designed figures) · `software-diagrams` (plugin `software-development`) (Mermaid) → export PNG → `figure()` |
| Read Office files a customer sent | `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf` |
| Spreadsheet deliverable | `anthropic-skills:xlsx` (the same color tokens can be used) |
| Content and completeness of an SRS document | `srs-writing` (plugin `software-development`) |
| Slide storyline and layout | `presentation-design` |
| A presentation deck as a single .html file | `html-slide-deck` (when a .pptx exists, use the entry from .pptx in the same skill) |
| Diagrams drawn in Mermaid with the same theme | `software-diagrams` (plugin `software-development`) |
| Origin of the color and type system · logo | `graphic-design` (plugin `software-development`) |

---

## Do not look AI-made

Before sending, go through item 3 of `no-ai-look`. For HTML work, run its script. Every job must also pass the eye gate 3.2 (web pages answer items 10–14 in addition), because 0 script findings is not yet a pass. The prohibitions in this file are the parts specific to this work; the full list for all media is there.

## Abbreviations

Always spell out an abbreviation in full the first time, then put the abbreviation in brackets, for example Model Context Protocol (MCP).
After that the abbreviation may be used. See the skill `spell-out-abbreviations` for details.


## reference: anti-patterns.md

# Anti-patterns — reasons and what to use instead

The short headings are in `SKILL.md`.

- **Using Word's built-in Heading styles** — they override the colors you set. Use `h1()/h2()/h3()`,
  which set `outlineLvl` themselves, so the table of contents (TOC) still shows the headings.
- **Thick black default table borders** — the document looks dated at once. Use lines in the `line` color at 0.5pt between rows (under the header row is the 1.5pt brand line).
- **Pure black text** — use `text_body`, a dark gray. The body text becomes much softer.
- **Bold table headers with no fill color** — when a table spans pages, readers cannot tell where it starts.
- **Letting Word work out column widths** — always call `fixed_widths()`.
  Otherwise the code column ends up as wide as the detail column.
- **Too many emoji** — 1 per callout is enough. Do not put one in every heading.
- **Sending the file without ever rendering it** — see item 6.
- **Creating the .docx without keeping the source markdown** — you cannot edit it next time.


## reference: api.md

# brandkit API — method reference

Every method returns the object it created (paragraph / table / slide), so you can customize it further.

## Contents

1. [brandkit.py — Word (.docx)](#brandkitpy--word-docx)
2. [brandkit_pptx.py — slides (.pptx)](#brandkit_pptxpy--slides-pptx)
3. [brandkit_stage.py — Stage deck (.pptx)](#brandkit_stagepy--stage-deck-pptx)
4. [Column width formulas (Word)](#column-width-formulas-word)

---

## brandkit.py — Word (.docx)

### Create a document

```python
BrandDoc(path_template=None, page="A4", margins_cm=(2.2, 2.0, 2.2, 2.0),
         footer_text="หน้า")
```

| Parameter | Meaning |
|-------------|----------|
| `path_template` | A .docx/.dotx file used as the template (already holds the organization's header/logo) |
| `page` | `"A4"` or `"Letter"` |
| `margins_cm` | (top, right, bottom, left) |
| `footer_text` | Prefix before the page number · `""` = bare number |

### Page-level blocks

| Method | Note |
|-------|----------|
| `cover(title, subtitle, meta, note, logo, logo_width_cm=None, eyebrow=None, meta_rows=None, top_space_pt=24, page_break=True, style="light", art_colors=None)` | The logo accepts .png and .emf, but **.svg does not work in python-docx**; convert to PNG first (`rsvg-convert -w 600` or `cairosvg`) |
| `cover(..., style="night")` | **Full-page dark cover** (see the example `examples/example_srs-preview.png`): dark gray background `#1C1C22` + a faint brand-colored glow · `logo` (omitted = no logo) small at top left, 4.6 cm wide · `eyebrow` → document title (32pt · if longer than 2 lines, reduce to 26pt) → `subtitle` → a glow line the full width of the text · `meta_rows` short values (≤18 characters, at most 4 values) go in a 4-cell table, the rest as label/value rows · `note` last · the cover has no footer · `art_colors=(color1, color2, color3)` colors of the glow line from left to right and of the background glow (default `brand_2` → `brand` → light `brand`) · the background image/logo/line are anchored to a paragraph in the body, not the header · needs numpy + pillow (`cover_art.py`) · `logo_width_cm` default 2.6 (light) / 4.6 (night) |
| `toc(heading="สารบัญ", levels="1-3")` | Inserts a TOC field; then in Word press **Ctrl+A then F9** so the entries appear (it is empty when created) |
| `page_break()` | |
| `landscape_section()` | Opens a landscape section for wide tables |

### Headings and text

| Method | Result |
|-------|---------|
| `h1(text)` `h2(text)` `h3(text)` | 16 / 12.5 / 11.5 pt · bold · brand / brand_deep / text · sets `outlineLvl` so the TOC sees them |
| `para(text, size, color, bold, italic, align, space_after)` | `align` = `"center"｜"right"｜"justify"` (do not justify Thai) |
| `rich([(text, opts), ...])` | Several formats in one paragraph, e.g. `[("สถานะ: ", {"bold": True}), ("อนุมัติ", {"color": "green"})]` |
| `bullets([...], style="List Bullet")` | `style="List Number"` for numbered lists |
| `code(text)` | Gray-background code block |

### Tables and data

| Method | Note |
|-------|----------|
| `table(headers, rows, widths=None, zebra=False, align=None, first_col_bold=False, size=None, header_style="tint")` | `widths` in twips totaling **9638** (`BODY_TWIPS`) for A4 with 2 cm margins · `align` = a list per column · `header_style="tint"` (default) header filled with `brand` mixed 80% with white, bold `brand_deep` text, no top line, a single 1.5pt `brand` line under the header, thin row lines, no vertical lines · `"classic"` = the old style (`brand_tint` header, thin gray grid) |
| `pill_table(headers, rows, status_col, palette, widths)` | `palette = {"เสร็จ": "green", "ค้าง": "red"}` · available tones: green blue amber red violet grey |
| `kpi_row([(value, label), ...])` | Exactly 3–5 cells |
| `signoff([(role, name), ...])` | Sign-off table |

### Other

| Method | Note |
|-------|----------|
| `callout(kind, title, body)` | kind = `tip｜note｜warning｜critical｜success｜question` |
| `figure(image_path, caption, width_cm=15.5, number=None)` | `number=1` prefixes the caption with "รูปที่ 1 — " (Figure 1) |
| `save(path)` | |

### Module-level functions

| Function | Use when |
|----------|---------|
| `use_brand(**tokens)` | Change the whole color set; must be called **before** creating `BrandDoc` |
| `style_run(run, size, color, bold, italic, mono)` | Set the font yourself (complex-script is already covered) |
| `shade(cell, token)` · `left_accent(cell, token, size)` | Fill a cell / add a colored bar on its left |
| `fixed_widths(table, widths)` | Force column widths |
| `set_borders(table)` · `row_borders(table)` · `no_borders(table)` · `cell_border(cell, edge, color, size)` | `row_borders` = horizontal lines only · `cell_border(..., color=None)` = no line on that side |
| `mix(color, other="FFFFFF", amount=0.5)` | Mix colors to make lighter/darker shades from the palette |
| `repeat_header(row)` · `keep_with_next(paragraph)` | |
| `add_field(paragraph, "PAGE")` | Insert a Word field |
| `to_pdf(docx_path, outdir)` | Calls LibreOffice to convert to PDF |

---

## brandkit_pptx.py — slides (.pptx)

```python
BrandDeck(template=None)      # 16:9 (13.333 × 7.5 inches)
```

| Method | Resulting slide |
|-------|-------------|
| `title_slide(title, subtitle, meta)` | Light blue background + a brand divider line |
| `section(title, kicker=None)` | Vertical brand bar on the left + section name |
| `bullets_slide(title, items, subtitle=None)` | Title + purple dash under the title + 17pt bullets |
| `kpi_slide(title, items, subtitle=None)` | Number cards |
| `table_slide(title, headers, rows, col_widths, subtitle, status_col, palette)` | `col_widths` are proportions, e.g. `[1, 4, 2, 2]` |
| `image_slide(title, image_path, caption, subtitle)` | Image centered on the slide, fitted to the frame automatically |
| `quote_slide(text, source)` | Quote/conclusion slide |
| `save(path)` | |

**Limits to know**

- Every slide is built from the blank layout (`slide_layouts[6]`), so there are no placeholders to edit in PowerPoint
  as in a normal template. If the customer will edit a lot themselves, pass `template=` as the organization's .pptx file instead.
- Tables in python-pptx have no API to turn off borders directly. If you want a table without lines, arrange text boxes instead.
- Table row height is a minimum. Long text pushes the row taller by itself, so leave room.

---

## brandkit_stage.py — Stage deck (.pptx)

```python
StageDeck(accent="2A78D6", bg="09090A", project="", template=None,
          head_font="Chakra Petch", body_font="IBM Plex Sans Thai", block=False, **colors)
# accent / bg = main color and background color from the project's design · colors = colors the project already fixed, e.g. text="1B2430"
# block=True = cover() and section() are a solid main-color full sheet, text on it gets ≥ 4.5:1 (white, near black or black)
```

Every sheet except the cover and chapter divider has: a main-color square + category name (`kicker`) · 28 pt slide title · a line at the foot of the page · `PROJECT · category` · 2-digit page number

| Method | Resulting slide |
|-------|-------------|
| `cover(title, lines, meta, logo=None, mark=None)` | 60 pt title + a main-color dash · `lines[1]` is in the main color · `mark` = a large faint symbol on the right (omitted = a faint ring) |
| `section(number, title, note)` | Chapter divider: a large number in the main color |
| `figure(kicker, title, image, caption, subtitle)` | Full-sheet diagram image (rendered with the same `#bg=` as the deck) |
| `compare(kicker, title, headers, rows, widths=(1, 1.85, 1.95))` | Table with row separator lines · column 1 gray, 2 bold white, 3 body text · at most 5 rows |
| `stats(kicker, title, items, subtitle)` | 2–4 big numbers + a sample question/answer under each number |
| `steps(kicker, title, rows, example_head, note)` | Numbered steps · `rows = [(name, what it does, example)]` at most 6 steps |
| `points(kicker, title, points, image, caption, side, side_caption)` | Image on the left + gist with a main-color dash · `side` = a small image on the right, e.g. a QR code |
| `statement(kicker, text, sub)` | A single statement centered on the sheet |
| `save(path)` | |

Color helpers: `make_theme(accent, bg)` returns the whole color set · `fit(color, bg)` adjusts lightness while keeping vividness until readable on that background · `is_dark(bg)` · `contrast(a, b)`

---

## Column width formulas (Word)

| Columns | Example widths (total 9638) |
|:---:|---|
| 2 | `[2600, 7038]` — heading/detail |
| 3 | `[1400, 6238, 2000]` — code/item/owner |
| 4 | `[1100, 4478, 1900, 2160]` — code/item/owner/status |
| 5 | `[1000, 1800, 2838, 2000, 2000]` |
| 6 or more | Use `landscape_section()` (area 14570 twips) |


## reference: brandkit-usage.md

# How to use brandkit — sample code

Read when you start writing a script that builds real files · all methods are in `api.md`

## Word document (`brandkit.py`)

```python
import sys; sys.path.insert(0, "scripts")     # หรือ copy brandkit.py มาไว้ข้างงาน
from brandkit import BrandDoc, use_brand, to_pdf

doc = BrandDoc()                                # A4 · Tahoma · สีประจำบ้าน
doc.cover("เอกสารข้อกำหนดซอฟต์แวร์ (Software Specification)",
          subtitle="ระบบตัวอย่าง (Sample System) — Project Control & Monitor",
          meta="เวอร์ชันเอกสาร 3.5  •  ปรับปรุง 19 กรกฎาคม 2026",
          logo="asset/Sample_Logo_Badge.png")
doc.toc()

doc.h1("1. ภาพรวมระบบ")
doc.para("ระบบตัวอย่างเป็นระบบบริหารและติดตามโครงการ ...")
doc.kpi_row([("19", "โครงการ"), ("115", "Work items"), ("103", "Open tasks")])
doc.table(["หัวข้อ", "รายละเอียด"],
          [["URL ระบบ", "https://app.example.com"]],
          widths=[2600, 7038])                  # รวม = 9638
doc.callout("warning", "ข้อควรระวัง", "Token ต้องไม่ถูกแสดงกลับใน UI หลังบันทึก")
doc.figure("diagrams/context.png", "ภาพรวมระบบและขอบเขตการใช้งาน", number=1)
doc.pill_table(["รหัส", "งาน", "สถานะ"], rows, status_col=2,
               palette={"เสร็จ": "green", "กำลังทำ": "amber", "ค้าง": "red"})
doc.signoff([("Product Owner", "—"), ("Tech Lead", "—")])
doc.save("SRS.docx")
```

## Slides (`brandkit_pptx.py`)

Slides use `brandkit_pptx.py`, which takes the same token set:

```python
from brandkit_pptx import BrandDeck
d = BrandDeck()                                  # 16:9
d.title_slide("ระบบตัวอย่าง", "Project Control & Monitor", "19 กรกฎาคม 2026")
d.section("1 · ภาพรวมระบบ", kicker="ส่วนที่ 1")
d.bullets_slide("ขอบเขตงาน", ["...", "..."], subtitle="สรุปจาก SRS v3.5")
d.kpi_slide("ตัวเลขสำคัญ", [("19", "โครงการ"), ("115", "Work items")])
d.table_slide("สถานะ Milestone", headers, rows, col_widths=[1, 4, 2, 2],
              status_col=3, palette={"เสร็จ": "green", "กำลังทำ": "amber"})
d.image_slide("สถาปัตยกรรม", "diagrams/arch.png", caption="ภาพรวมองค์ประกอบ")
d.save("deck.pptx")
```

All methods are in `references/api.md`. The runnable example files are
`scripts/example_srs.py` (document) · `scripts/example_deck.py` (`BrandDeck` slides)

## "Stage" deck (`brandkit_stage.py`) — the default for a deck used for speaking

`brandkit_stage.py` makes a deck with the same structure as the model deck: headings in Chakra Petch, body in IBM Plex Sans Thai, while the **background and main colors come from the project's design**, dark or light.
(The model is for deck structure only: X Fitness Chatbot Summary v1.2 · an example already run: `examples/example_stage.pptx`)

```python
from brandkit_stage import StageDeck
d = StageDeck(accent="2A78D6", bg="09090A", project="Sample Chatbot")   # ตัวอย่าง: สีหลัก · สีพื้นต้องมาจากดีไซน์ของโปรเจกต์คุณเอง
d.cover("Sample Chatbot", ["สรุปการทำงานของแชตบอท", "ตอบจากข้อมูลจริง และไม่ถูกหลอก"],
        meta="ทีมพัฒนา · ตุลาคม 2569", logo="logo.png", mark="mark.png")
d.figure("องค์ประกอบของระบบ", "แอปเดียวรับทุกช่องทาง ความฉลาดเรียกจาก Typhoon",
         "fig-flow-dark.png", caption="หน้าเว็บ + LINE OA → FastAPI → LightRAG + Typhoon")
d.save("deck.pptx")
```

- **2 colors come from the project's design:** `accent` (main color) and `bg` (background color). Look in the order given in `diagram-figures` item 5 (`doc-theme` → design in code, such as `--primary` · `--background` · the Tailwind theme · the app's dark/light mode → logo and brand kit → nothing at all: use the house color `#2A78D6` with background `FFFFFF` and write `(รอยืนยัน)` (awaiting confirmation)). Never use the model deck's colors · if the work being made into a deck has its own colors, extract them first with `presentation-design/scripts/source_palette.py` · for a light-background deck, set `block=True` so the cover and chapter dividers are a solid main-color full sheet (`presentation-design` `references/deck-theme.md`)
- Every gray level is computed from `bg` (dark background mixed with white, light background mixed with black), so it carries the same tone as the project's background · `accent_hi` is the main color with lightness adjusted until readable on that background; use it for big numbers, sequence numbers and emphasis words · a project that already fixed a text color can override it, e.g. `text="1B2430"`
- Fonts of the project can be used (`head_font=` · `body_font=`); if the project has none, use Chakra Petch + IBM Plex Sans Thai
- **Diagram images must use the same background color as the deck** — render `diagram-figures` with `#accent=<main color>&bg=<background color>` (now available in `figure-flow.html`)
- **The fonts Chakra Petch and IBM Plex Sans Thai must be installed** (Google Fonts · free to use) on the machine that opens the file. If the destination machine lacks them, send a PDF along, or rebuild with `head_font="Tahoma", body_font="Tahoma"`
- For printing, build another set with `bg="FFFFFF"` instead of using a dark background that wastes ink · `BrandDeck` (color bar on top) is still usable for reports sent to be read on their own


## reference: cover-vote.md

# A cover that belongs to this document set — make 3 directions, then vote 2 of 3

Open when a document set needs its own cover.

Use when a document set (proposal · report · business plan) needs its own cover and the default cover looks like another job's. Do one direction first; use this only if the user is not wowed or asks for several directions (3–5 times the labor).

1. **Find the real thing to hold on to:** logo, name, the main verb of the job (propose · analyze · sell), or real images of the work · look at at least 6 real covers by others · every image on the cover must point back to something real, otherwise cut it.
2. **3 designers (use `parallel-attempts-pick-best`).** Same brief, different directions: A drawn from the job's real data · B a real image of the work is the hero (screen, photo, sample of the output) · C the logo shape or lettering is the structure, no drawn image · each agent needs Bash to render and open the image itself.
3. **3 new reviewers who have not seen the work, each from a different angle:** art director (is it truly wow, does it look AI-made) · brand and customer (is it memorable, does it show what the work is about, does it go with the whole set) · Word production (is it repeatable, can the text be edited) · include the old cover as an option too.
4. **Criteria scored 1–5, then vote:** wow compared with the old cover · not a repeat of other work · tells the truth of the work · fits the whole set · craftsmanship (Thai, contrast, smallest text) · buildable and repeatable in Word · the direction with **2 of 3 votes wins** · borrow at most 2 strong pieces from a losing direction · if the votes split 3 ways, "repeatable" decides.
5. **Text on the cover is editable Word text** (title, version, date) · the background image has no lettering baked in · anchor the image to the first paragraph, not in the header.
6. **Software document sets only** (BRD · SRS · FSD whose cover must come from the logo shape or a real mockup · uses the cover generator) → if plugin `software-development` is present, also see `doc-cover-design` · without it, items 1–5 are complete on their own.


## reference: palette-examples.md

# Color sets that were actually used (examples)

> Warning: **these are examples, not standard values.**
> Always choose colors from the content of the work first, per item 0 of `SKILL.md`.
> Use this file to see what a complete set that passes the contrast thresholds looks like (checked with the script on 22 Oct 2026 (2569 BE)), not to copy.

## Set A — blue–violet (general software · extracted from Apps Track)

Light tone, airy, soft, cool gray text

```python
use_brand(
    brand="2A78D6", brand_2="6A5CD6", brand_deep="2A4C86",
    brand_tint="EDF1FB", brand_tint_2="F6F8FD",
    text="333B4A", text_body="414957", text_muted="676D7A", line="E4E7EE",
)
```

## Set B — teal green (medical · health)

```python
use_brand(
    brand="0E8F86", brand_2="2F9E6E", brand_deep="0A5A56",
    brand_tint="E6F4F2", brand_tint_2="F3FAF9",
    text="2C3A38", text_body="3A4846", text_muted="636F6A", line="E1EAE8",
)
```

## Set C — navy (government · legal)

```python
use_brand(
    brand="1F3C88", brand_2="5B4B8A", brand_deep="14275C",
    brand_tint="E8ECF7", brand_tint_2="F5F7FC",
    text="2B3245", text_body="3A4156", text_muted="636A7D", line="E2E6F0",
)
```

## Set D — amber yellow + steel gray (industrial · factory)

A warm accent on a cool gray frame. Use the accent only at the spots that need attention, not across the whole page.

```python
use_brand(
    brand="B57509", brand_2="8C5A2B", brand_deep="704805",
    brand_tint="FBF2E1", brand_tint_2="FDF9F1",
    text="2F3439", text_body="3E444A", text_muted="676F76", line="E5E8EA",
)
```

## Status colors — the same set for every brand

Status colors **do not change with the brand**, because their meaning is fixed.

| Status | Background | Text |
|---|---|---|
| Success | `E9F7EF` | `17794A` |
| Info | `EAF2FD` | `2160AB` |
| Warning | `FDF5E4` | `96660D` |
| Error | `FDEDEC` | `A63A34` |
| Accent | `F1EEFC` | `52439F` |
| Neutral | `F2F4F8` | `626A7A` |

> If the brand color clashes with one of the status colors (for example the brand is green), change the **brand color in that context**.
> Do not change the status color. Readers interpret green as "passed" before reading the text.

## How to check before use

1. Body text and `text_muted` on a white background and on a `brand_tint` background ≥ 4.5:1 · `brand_deep` (H2 and table headers) on white and `brand_tint` ≥ 7:1 · `brand` (H1 16pt bold, and KPI numbers count as large text) ≥ 3:1
2. Printed in black and white, headings must still be distinguishable from body text
3. Open the rendered file and look by eye; do not trust the values in the table

## Tones suggested by the content of the work (use when there is no brand color to hold on to)

| Content of the work | Suggested tone | Reason |
|---|---|---|
| Medical · health | Teal green · green | Cleanliness, safety |
| Finance · banking | Dark blue · silver gray | Stability |
| Industrial · factory | Amber yellow · steel gray | Machinery, warning |
| Education | Purple · light orange | Enthusiasm |
| Retail · food | Orange · pinkish red | Warmth, appetite |
| Government · legal | Navy · oxblood | Formality |
| General software | Blue | A neutral default when there is no other context |

If the customer already has a brand, use the brand colors. This table is used only when there is nothing to hold on to.


## reference: thai-fonts.md

# Fonts and Thai — details

The rules that must not be missed are abbreviated in `SKILL.md`

Use **Tahoma** as the default: on every Windows/Office machine · tone marks do not collide with vowels ·
bold reads clearly · the x-height of Thai and English is close.

> **Complex script trap:** Word treats Thai as a *complex script*, a separate set from Latin.
> If you set only `run.font.size` / `run.font.bold`, Thai text will **not follow**.
> You must set `w:szCs`, `w:bCs`, `w:iCs` and `w:rFonts` in all of `ascii/hAnsi/cs/eastAsia`.
> The function `style_run()` in `brandkit.py` handles this. **Never set fonts by hand.**

> **Dual-font trap:** if the Latin font and the Thai font differ, such as Noto Sans + Noto Sans Thai,
> setting only the `cs` slot is not enough. Word draws Thai with the font in the Latin slot if that font has Thai glyphs; if not, it silently falls back to Browallia New.
> Set `bk.FONT` (Thai) and `bk.LATIN_FONT` (Latin), then call `bk.thai_runs(doc.element.body)` and on every header and footer before `save()`.
> This function splits Thai text into runs of its own and sets all 4 slots to the Thai font.
> For fonts that are not on every machine, call `bk.embed_fonts(doc)` to embed the fonts in the file. This works only for fonts whose license allows embedding, such as OFL, and the file grows by several MB.
> Variable fonts such as Cascadia Mono become Calibri when Word exports to PDF. Use Consolas for code.

Other rules for Thai documents:

- Line spacing **1.3–1.35** for Tahoma (English only can use 1.15, but Thai has tone marks and upper–lower vowels that need room) · Noto family fonts have a built-in line height of 1.36–1.51 em, so **1.1–1.15** gives the same spacing. Decide from the real PDF page, not from the numbers.
- **Never justify** Thai paragraphs, because Thai has no spaces between words and Word stretches words until holes appear.
- LibreOffice breaks Thai words differently from Word. To send a PDF, export it from real Word,
  or at least open the PDF and check by eye before sending.
- To create a PDF on Linux without Tahoma, use **Loma** or **Sarabun** instead
  (ReportLab places Thai tone marks wrongly; use python-docx→LibreOffice or WeasyPrint instead).
- When previewing on Linux, Thai text looks **smaller** than Latin because the substitute font has a lower x-height.
  It is not a bug in the font size. On Windows with real Tahoma the heights are equal, so do the final check from Word.


## reference: tokens-and-type.md

# Design tokens · type scale · reusable elements

Contents: tokens → color meanings → type scale → reusable elements

This table sets the **job** of each token, not the color value.
The real values come from item 0, then you set them once with `use_brand(...)`.

| Token | Job | Comes from |
|-------|---------|----------|
| `brand` | H1 headings · KPI numbers · accent bars · links (if `brand` is below 4.5:1 on a white background, use `brand_deep` for links) | The brand color (none → the house default + `(รอยืนยัน)` (awaiting confirmation)) |
| `brand_2` | Secondary accent · underline under slide headings · end of a gradient | A neighbor of the main color on the color wheel |
| `brand_deep` | H2 headings · table header text | The main color mixed with black, giving contrast ≥ 7:1 on white |
| `brand_tint` | Table header fill · KPI cards · cover background | The main color mixed with white, about 90% |
| `brand_tint_2` | Alternating (zebra) rows in long tables | The main color mixed with white, about 96% |
| `text` | H3 headings · emphasized text | A dark gray tinted toward the main color |
| `text_body` | All body text | A dark gray 1 step lighter than `text`. **Not pure black, because pure black tires the eyes** |
| `text_muted` | Figure captions · meta · footer | A mid gray with contrast ≥ 4.5:1 on white and on `brand_tint` |
| `line` | Table lines, dividers | A very light gray, visible but not competing for attention |

**6 status colors** (each has a fill color and a text color as a pair): success · info · warning · error · highlight · neutral
Status colors **do not change with the brand**, because green means pass and red means fail in every document.
The fill is a very light shade and the text is a dark shade of the same color, giving contrast ≥ 4.5:1.

**What each color means — always choose a color by its meaning** (the same for documents and diagrams)

| Color | Means | Used for (callout / pill / box / line in a figure) |
|---|---|---|
| Red | Danger · forbidden · delete · error · overdue | `critical` · status "stuck/failed" · a step that destroys data · a broken line |
| Yellow/orange | Caution · waiting for action · caveat · a path that is not the main line | `warning` · status "in progress" · exception zone/line (`#C77A11`) |
| Green | Success · pass · safe · done | `success` · status "done" · a confirmed result |
| Main color (the brand color; with no brand, the house blue) | Information · main action · normal path | `tip` · primary button · box/line of the main path |
| Purple | Question · option · side note | `question` · optional extras |
| Gray | Neutral · disabled · external | `note` · external system · a part that is switched off |

The one rule: **choose a color by meaning, not by looks.** Do not use red just to stand out. Use red only when something is truly dangerous or wrong. Diagrams use this same set of meanings too (see `software-diagrams` · `diagram-figures`, which has the orange `EXCEPT_HUE` for paths that leave the main line).

> **Thresholds every color set must pass:** body text and `text_muted` on the background ≥ 4.5:1 · H2 and table headers (`brand_deep`) ≥ 7:1 ·
> H1 and KPI numbers (`brand` in large size, per the WCAG 2.2 large-text definition, criterion 1.4.3) ≥ 3:1 ·
> printed in black and white, the hierarchy must still be distinguishable. If a set fails, adjust the intensity and do not change the color.
>
> **A color set that was really used** (not a standard value; do not copy it without looking at the content of the work) → `references/palette-examples.md`

> **Change the whole brand in one line:**
> `use_brand(brand="C1121F", brand_deep="780000", brand_tint="FDECEC")`

## Type scale (pt)

| Level | Word | Slide | Weight · color |
|-------|------|-------|--------------|
| Cover title | 20 | 40 | bold · `brand` (Word) / `brand_deep` (slides) |
| H1 | 16 | 26 | bold · `brand` |
| H2 | 12.5 | — | bold · `brand_deep` |
| H3 | 11.5 | — | bold · `text` |
| Body | 11 | 17 | regular · `text_body` |
| Table | 11 | 12.5 | regular · `text_body` |
| Caption/footer | 8.5–9 | 10–12 | italic or regular · `text_muted` |

**Do not add sizes outside this scale.** Every extra size makes the document look inconsistent, and readers notice.

## Reusable elements (from item 4)

| Element | Look | Method |
|-----------|--------|-------|
| Cover page | Logo + title in the brand color, centered on the page | `cover()` |
| Table | Header fill `brand_tint` with `brand_deep` text · 1.5pt brand line under the header row · `line` 0.5pt between rows · header repeats on every page | `table()` |
| Status table | The status column is tinted by value | `pill_table()` |
| Summary figure strip | Cards with `brand_tint` fill, a big number in the brand color + a small gray label | `kpi_row()` |
| Text box | Light fill + a thick colored bar on the left + 1 emoji | `callout()` |
| Figure with caption | Figure centered on the page + "รูปที่ N — ..." in gray italic under the figure | `figure()` |
| Code block | Light gray fill, Consolas 9pt font | `code()` |
| Sign-off table | Role / name / signature / date | `signoff()` |

**Good proportions:** no more than 3–5 callouts per 10 pages · a summary figure strip (KPI strip) of 3–5 cells (from 6 cells on, the numbers get too small to stand out) ·
a table with more than 6 columns should move to a landscape page (`landscape_section()`).


## reference: visual-check.md

# Check a document by eye — commands and checklist

```bash
soffice --headless --convert-to pdf --outdir _to_delete/preview SRS.docx
pdftoppm -png -r 80 _to_delete/preview/SRS.pdf _to_delete/preview/page      # ได้ page-1.png หรือ page-01.png (เลขเติมศูนย์ตามจำนวนหน้าทั้งหมด)
```

Then **open and look at every page image** (Read tool) before delivery. Check these:

- [ ] No table overflows the paper edge; columns are wide enough; no word is squeezed onto a strange new line
- [ ] No heading stranded on the last line of a page
- [ ] Thai tone marks/vowels do not collide, and no character turns into a square box
- [ ] The cover has no overflowing or edge-cut text · **page 2 is not blank** (a full-page cover, then the page-break paragraph falls onto page 2; `cover()` puts the break at the end of the last paragraph already, and a hand-written cover must do the same)
- [ ] Spacing before/after tables and callouts is the same across the document
- [ ] Footer page numbers on every page
- [ ] No TBD / Lorem ipsum / leftover placeholder (except `(รอยืนยัน)` (awaiting confirmation) that is in the report's awaiting-confirmation list)


## reference: word-layout.md

# Dark cover and table headers — details from real jobs

Read when making a dark cover or adjusting table headers on inner pages · the short rules to use every time are in `SKILL.md` item 3.

## Dark cover style

**Dark cover style (when the app or brand uses a dark screen):** a full-page cover in a neutral near-black dark gray (for example `#1C1C22`) with a very faint brand-colored glow (at most 15%). A deep purple glow filling the corner made the cover look purple, and the work's owner asked to go back to dark gray ·
The document title, subtitle and the line under the title go **right under the logo**, not in the middle or at the bottom of the page. The document-info table sits toward the bottom ·
A light-on-dark lettering logo at top left · document title 28–32pt · a 4-cell document-info table
(document code · version · date · status) · inner pages have a white background and dark code blocks; the header has a small logo, the document title and the document code;
the footer has the system name and "หน้า / ทั้งหมด" (page / total). The dark color is on the cover page only, so it can still be printed. The title size on this kind of cover may exceed the scale in item 1.
The logo on the cover uses a **small size (about 4.5 cm wide) at top left, above the document title**. Enlarging the symbol into the main image in the middle of the cover was tried, and the work's owner asked to go back to small.
If you want a flourish, stretch the logo's color glow into a long line as wide as the text (leave left and right margins equal to the paper margins; a line touching the paper edge was asked to be set in from the edge) as a bar of even thickness **with straight-cut ends and slightly rounded corners** (about 0.7 mm thick, corners about 0.25 mm). Tapered pointed ends were criticized as too sharp · the glow must fade to zero before the image edge, otherwise the box edge of the image shows. Use it instead of an underline below the document title (anchor the line image to the paragraph under the title so it follows both 1-line and 2-line titles) · the line must be **one continuous image** with the same thickness and glow throughout, a smoothstep gradient with both ends fading softly, drawn at 300 dpi. Never lay short bars over a long line, because it shows as a thick lump with colors that do not join (the work's owner said "the colored line is not smooth").
> **The cover background image and the logo on the cover must not be placed in the first page's header.** Word shows everything in the header as faded while reading or editing the document, so a full-page dark cover looks washed out (it is not faded in the PDF, so checking from the PDF alone will not find it; the work's owner said "looks washed out"). Anchor the floating behind-text image to the cover's first paragraph instead, and set `relativeHeight` the way Word does (background image 251658240 · images above it increase by 1024 each), because Word re-orders small numbers like 1, 2, 3 on save, and then the background image covers the logo.

Small text on a dark cover (labels, author info, notes) uses a size **of at least 8.5pt** and a light gray from `#CFCCDE` up; the subtitle uses a near-white light color. 7.5pt mid-gray text on a dark background looks faint.

**Use in code:** `doc.cover(title, subtitle=..., eyebrow=..., meta_rows=[...], logo="logo.png", style="night")`. The logo is optional · the glow line colors can be adjusted with `art_colors=(color1, color2, color3)` · the resulting look: `examples/example_srs-preview.png` (cover + inner page) · the example call: `scripts/example_srs.py` · `table()` uses this table header style by default (`header_style="classic"` = the old style)

## Table headers on inner pages

**Table headers on inner pages must not use a full-width solid dark fill**, even when the cover is dark, because tables are on every page, so dark color is heavy on the eye and wastes ink (the work's owner really asked for this change in one job).
Use a light fill of the brand color that still clearly reads as the header row, such as `#E4DCFD` (a lighter fill like `#F5F3FF` was called too faint by the work's owner), with bold dark brand-colored text.
There is only one border: a 1.5pt brand-colored line under the header row. No line on top (a black top line looks heavy and was asked to be changed), and no white gaps between header cells, because that would break the line under the header into segments.
Word cannot draw gradient borders; if you add a gradient, the color changes in steps along the columns.

## Page structure (moved from `SKILL.md` item 3; wording not changed)

```
หน้าปก        โลโก้กลาง → ชื่อเอกสาร (brand, bold) → ชื่อระบบ (text, bold)
              → บรรทัดเวอร์ชัน/วันที่ (9pt) → หมายเหตุการแก้ไข (8pt เอียง เทา)
              → ขึ้นหน้าใหม่
สารบัญ        field TOC (ผู้ใช้กด F9 อัปเดต) → ขึ้นหน้าใหม่
เนื้อหา        H1 มีเลขข้อเสมอ ("1. ภาพรวมระบบ") · H2 เป็น "1.1"
              ทุก H1/H2/H3 ตั้ง keep-with-next กันหัวข้อค้างท้ายหน้า
ท้ายเอกสาร    ตารางลงนามอนุมัติ
footer        "หน้า N" กลางหน้า สีเทา 9pt
```

## Figures in documents · beauty-gate rules · cover (moved from SKILL.md §0.1 items 6–8)

6. **Figures in documents:** the smallest text after real placement ≥ 7pt → minimum pixels on the canvas = `0.247 × canvas width(px) ÷ placed width(cm)` (a 2000px canvas placed 17 cm wide = 29px · placed on a 25.7 cm landscape page = 20px · use 26px to get 9pt) · a wide figure should go on a landscape page at the full column width (≥ 95%) · use the **version placed in the document without a figure title**, because the Word caption already gives the number and the figure's name · figure caption ≥ 9pt in body text color · after a figure, start a new section; the next paragraph must not flow onto the figure's page.
7. **What the beauty gate (`ด่านสวย`) often catches (put them as rules in the render script's `check`):** stray markdown marks (`**` · backtick) · Thai text in a mono font · a table overflowing a text column · a table of contents with a single entry stranded on the next page · a code list cut in the middle of a code (one code per line, one font for the whole column) · the "(รอยืนยัน)" tag uses the warning color, not the brand color · identity lost after the cover (chapter opener pages use the app's brand color bar) · a light cover available to print alongside the dark cover.
8. **Cover — plain lettering first, images later** (a project-specific cover that uses the logo shape or a real screen instead of decorative images → `doc-cover-design` (plugin `software-development`))**:** an illustration on the cover is optional, and an open cover with well-set lettering always beats an image that does not wow · a design that passed the gate: the document type (SRS · FSD · ARCH) large at 150–200px in the brand color as the only highlight (width at most ~85% of the column · a name over 5 letters such as TESTPLAN splits into 2 lines, never shrunk smaller than other copies, since the whole set must look the same size) → a short brand-colored line → Thai title → English title → a 1-sentence summary line (≥ 12pt, narrow column) → an info row at the page foot (labels ≥ 10pt) · leave the rest empty · parts with fixed positions (logo · document type · line · status tag) are drawn into the cover background image, while the title and info are Word text that can be searched and edited · the `(รอยืนยัน)` (awaiting confirmation) tag on a dark background uses a bright warning color, with no highlight fill · **if the user says the cover is not beautiful → cut the decorative images first** (curves, glowing dots, gradients), then make 3 plain-lettering covers to choose from (project has a logo or mockup → use `doc-cover-design` item 7 instead)
