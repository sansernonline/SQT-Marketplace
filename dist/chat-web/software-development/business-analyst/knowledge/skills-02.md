# skill: simplicity-first

Use when cutting a spec or architecture to fewest parts

# Simplicity First

> The best architecture has the fewest moving parts. The best plan is the one a
> teammate can follow with no context.

This skill covers **non-code outputs** — documents, plans, architecture, and
designs. For code, use `lazy-coding`. The suite-wide rule for every kind of work is `simplify`; this skill is its detail for documents, plans and architecture.

## Check before submitting — 5 items

1. **A tired teammate gets it** in 6 months with no prior context.
2. **Simplest thing that works** — fewest moving parts, boring proven patterns; add complexity only when something breaks.
3. **Every new component, option or layer has evidence it is needed now**, and leaving it out would cost something real.
4. **Nothing can be deleted without losing meaning** — deleting beats adding.
5. **Reads in one pass** — no jargon the audience lacks, an example for every abstract claim, the whole thing fits in two sentences.

Any "no" or "not sure" → simplify before delivering.

## By output type

### Documents (BRD, FSD, ADR)

Business Requirements Document (BRD) · Software Requirements Specification (SRS) · Functional Specification Document (FSD) · Architecture Decision Record (ADR).

Do: short sentences (≤ 20 words), plain English, one idea per paragraph, an
example for every abstract point, tables for structured data.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy"), undefined
jargon, walls of text, hedging ("might possibly potentially"), acronym soup.

### Architecture

Do: monolith first (split only when a bottleneck is proven), familiar stack,
standard patterns (Representational State Transfer (REST), queues, caches), single source of truth per data type.

Avoid: microservices for small teams, distributed-everything, multi-master
databases before you must, event-driven by default (sync is simpler).

### Plans

Do: 3-5 priorities (not 20), a named owner per item, measurable success
criteria, realistic timelines with buffer, cut scope to fit time.

Avoid: vague goals ("improve quality"), 50-item lists (= no priority),
aspirational dates with no buffer, plans without success metrics.

### Designs (user experience (UX), application programming interface (API))

Do: fewest steps to the user's goal, reuse existing patterns, stay consistent
across screens, defaults that work for 80%, progressive disclosure.

Avoid: novel interactions where a standard one works, 10-step flows when 3
work, required fields with no smart default, hidden features needing tutorials.

## Examples

**API description**

Wrong: "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

Right: "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

Wrong: "Improve overall product quality and customer satisfaction through various
initiatives."

Right: "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

Wrong: "Event-sourced microservice with Command Query Responsibility Segregation (CQRS), Kafka ingestion, Redis cache, and a
dedicated auth service."

Right: "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

## Anti-patterns to reject

- **Future-proofing** — abstractions for needs that never arrive.
- **"It might scale"** — infra for 1M users while you have 1k.
- **Layer cake** — 6 layers where 90% just pass through.
- **Resume-driven design** — fancy tech to look sophisticated.
- **Buzzword stacking** — "cloud-native event-driven AI-powered".


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

# SVG/Python engine — figures generated from data or code

Route 2 of `diagram-figures`. Use it instead of the HTML skeleton when a figure must be generated from data or code. Examples: several figures that must be re-exported every time the data changes, or a figure where you control every position on a grid with right-angle lines and rounded corners.
Python writes the SVG onto the grid, then renders it to PNG. Icons and logos come from the same library as the HTML skeleton ([icons.md](icons.md)).

The cost is time, because 1 figure takes several rounds of fixes. So use it only for figures that people outside the team will see, and see repeatedly.

> **Main colour = the project's main colour.** Find it in the order given in `diagram-figures` section 5 (colour system), then put it in `ACCENT` in `theme.py`. Use the house colour `#2A78D6` only when that order finds nothing at all.

---

**Contents**
- [0 · Colour comes from the work — do not stop to ask](#0--colour-comes-from-the-work--do-not-stop-to-ask)
- [1 · Order of work](#1--order-of-work)
- [2 · File layout](#2--file-layout)
- [3 · Rule 1 — grid first, lines after](#3--rule-1--grid-first-lines-after)
- [4 · Connector lines](#4--connector-lines)
- [5 · Labels on lines — only two roles](#5--labels-on-lines--only-two-roles)
- [6 · Zones](#6--zones)
- [7 · Icons and logos](#7--icons-and-logos)
- [8 · Rendering](#8--rendering)
- [9 · Check loop — do not skip](#9--check-loop--do-not-skip)
- [10 · Constants that work](#10--constants-that-work)
- [11 · Legend bar](#11--legend-bar)
- [Abbreviations](#abbreviations)

## 0 · Colour comes from the work — do not stop to ask

**If the source document already declares a `doc-theme`, use that value and do not ask again.**
(See `polished-document-style`, section "Document theme".) If there is none yet, follow the steps below, then write the result back into `doc-theme`.

**No brand colour → follow the order in `diagram-figures` section 5:** use the house value `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation) in the report, and carry on without stopping to ask.
Put a tone suggested from the content, using the table in [colour-by-domain.md](colour-by-domain.md), in the report so the user can choose later.

Put **one main colour** in `ACCENT` in `assets/svg-engine/theme.py`. All light and dark shades
are computed from it with `tint()`, so the drawing code has no other colour hard-coded.

The only colour not tied to `ACCENT` is `EXCEPT_HUE`, for the "exception" label. It must always differ from the main colour.
If the main colour is already orange, change `EXCEPT_HUE` to another contrasting colour.

---

## 1 · Order of work

1. Read all existing diagrams first, then ask **what question this figure answers**. 1 figure answers 1 question.
2. Pick the colour by section 0 (no colour → house value + `(รอยืนยัน)`).
3. **Place every box on the grid before drawing any line.** This is the most important step. See section 3.
4. Finish `theme.py` and `ref.py` first, then write the figure file.
5. **Render, then open the image file and look at it.** Checking that the script ran without errors is not enough.
6. Once the figure is clean, write it to the target folder. Move the old figure to `_to_delete/`.

---

## 2 · File layout

```
architecture/
  01-system-context.png      ← output; the number prefix follows reading order
  _src/
    theme.py                 ← all colours — edit here only
    ref.py                   ← visual language: zones, units, lines, labels, legend bar
    render.py                ← SVG → PNG with Playwright at 2x
    d01.py … dNN.py          ← one file per figure; layout only
    logos/                   ← product logos + colors.json
```

Copy the whole folder [`assets/svg-engine/`](../assets/svg-engine/) to `_src/` and start from there. [`d01.py`](../assets/svg-engine/d01.py) is a sample figure that really renders.

---

## 3 · Rule 1 — grid first, lines after

Diagonal lines are hard to read, and bending the lines afterwards does not help. **Fix the positions.**

```python
CA,CB,CC,CD,CE,CF = 178,452,678,896,1080,1312   # columns
R1,R2,R3          = 288,458,624                  # rows, spaced ~170 apart
```

Every box sits on an intersection of a column and a row, and none strays off the grid.
When all points sit on the same lines, the connectors are right-angled by themselves with no bending.

### Midpoint rule

A node that receives from several paths must sit **midway between those paths**, not stick to one row.
If it also sends on to several paths, it must sit midway between the outgoing paths too.

Use **one merge point and one split point** so the lines are symmetric.

```python
RM = (R1+R2)//2      # Nginx sits midway between the two incoming rows
J1, J2 = CB-74, CB+86

flow([(CA+34,R1),(J1,R1),(J1,RM),(CB-30,RM)])   # enters from above
flow([(CA+34,R2),(J1,R2),(J1,RM),(CB-30,RM)])   # enters from below
flow([(CB+30,RM),(J2,RM),(J2,R1),(CC-30,R1)])   # leaves going up
flow([(CB+30,RM),(J2,RM),(J2,R2),(CC-30,R2)])   # leaves going down
```

### Wiring channels

A line that must cross the grid **must not run over a row that holds boxes.** Reserve separate channels for it.

```python
TB = 238        # top channel — at least 36 from the zone edge
MB = R3-48      # middle channel — between rows
```

---

## 4 · Connector lines

All lines are right-angled, with corners rounded at radius 14. This makes the figure look much more refined without losing clarity.
`ref.flow(pts, dashed=False, arrow=True)` computes the rounded corners itself.

**The arrowhead must end at the icon edge, not at the name label.** For example `CD-30` when the icon is 46 wide.

---

## 5 · Labels on lines — only two roles

| Role | Colour | Use for |
|---|---|---|
| Normal | light shade of `ACCENT` | what normally flows along the line |
| Exception | `EXCEPT_HUE` | a path that does not pass the front gate · special cases |

**A figure may have only one exception label.** If there are 2 or more, no label really stands out.

A label says **what flows through**, such as `SQL` `/api/` `DICOM 11112`, not `เชื่อมต่อ` (connect).

---

## 6 · Zones

A zone is a frame with a very light fill. Its name label is a white capsule that straddles the border and has a coloured dot in front.

```python
zone(x, y, w, h, "ห้อง Server ของโรงพยาบาล", "physical")
```

| Type | Line | Meaning |
|---|---|---|
| `physical` | solid | A real physical boundary: room, building, machine |
| `logical` | dashed | A logical boundary: Docker Compose · namespace · VPC |
| `outside` | dashed | Outside the system we look after |

The reader sees at once which one physically exists. Nest zones no more than 3 levels deep.

---

## 7 · Icons and logos

Icons **float on the background with no frame and no tile.** The name and description sit below the image.

```python
unit(cx, cy, "Nginx", "ประตูเดียวที่เข้าระบบได้", slug="nginx")
#  logos/<slug>.svg exists → use the real logo, filled with the colour from colors.json
#  does not exist         → use a line symbol of our own design
```

Values that work: icon 46 · name 11.5 bold, placed `size/2+20` from the centre · description 10, placed `size/2+35` from the centre.

Take logos from this skill's icon library ([icons.md](icons.md)). Run `python assets/find-icon.py --group brands <name>` from the `diagram-figures/` folder, then `--copy` the result into `_src/logos/`.
Simple Icons gives single-colour SVG with `viewBox 0 0 24 24` and comes with `colors.json`, which holds each brand's official colour code.

### Trademarks — do not skip

- A logo belongs to its owner. You may use it to refer to the product itself in the diagram,
  but **do not alter its shape, do not stretch or squash it, and do not make it look as if the owner endorses the figure.**
- If a product has no logo file, use a symbol instead, and **name that product in the note under the figure.**
- Do not download new logos on your own. Use the set that exists, or have the user get them from that project's brand page.

---

## 8 · Rendering

```bash
pip install playwright && playwright install chromium
python render.py d01.svg ../01-architecture.png 1400 860
```

Always render at 2x, because 1x gives a blurry image when enlarged on a slide.

Thai text needs a Thai font on the machine that renders, declared in the `font-family` of `<svg>`.
**Do not use Python Imaging Library (PIL) to draw mixed Thai and English text**, because it produces square boxes in place of letters.

---

## 9 · Check loop — do not skip

Render → open the image and look → fix → render again, until it is clean.
**These 6 problems come up every time. Check them in every round:**

1. **A label on a line covers an icon or a name.** Move it to the midpoint of the longest segment, or onto the stub.
2. **A line leaving an icon cuts through its own description.** Start the line at `cy+58`, not `cy+32`.
3. **A zone edge cuts the description of the bottom row.** The zone's bottom edge must be ≥ `R_bottom + 58 + 24`.
4. **Zone caption text sits on the border.** Merge it with the name into one capsule.
5. **An arrowhead ends at the name label, not the icon.** Make it end at the icon edge.
6. **Text overflows its frame.** Thai 11.5px ≈ 6.0 px/char · heading 15px ≈ 7.5 px/char.
   If space is short, cut words. **Do not shrink the font.**

---

## 10 · Constants that work

```
width 1400 · margin 56
centred title 22 · subtitle under title 12.5
unit name 11.5 bold · description 10 · label on line 10.5
connector 1.6 · zone border 1.4 · corner radius 14 · label height 21
```

---

## 11 · Legend bar

Every figure ends with a single bar that says what each kind of frame means and where the 2 label colours differ.
After it come 2–4 lines of notes. These include the trademark line and references to other related figures.

---

## Abbreviations

- **SVG** — Scalable Vector Graphics
- **PNG** — Portable Network Graphics
- **PIL** — Python Imaging Library


## reference: icons.md

# Icon library — shared by the HTML skeleton and the SVG/Python engine

**205 icons are already provided in `assets/icons/`.** Nothing more to install.
They are PNG files with a transparent background at 160×160, official icons of providers and tools, split into 9 groups.

| Folder | Contents |
|---|---|
| `icons/aws/` | 39 — EC2 · RDS · S3 · Lambda · ELB · Route 53 · CloudFront · SQS · SNS · IAM · CloudWatch … |
| `icons/azure/` | 24 — VM · App Service · AKS · Cosmos DB · Blob Storage · Key Vault … |
| `icons/gcp/` | 21 — Compute Engine · GKE · Cloud Run · BigQuery · Pub/Sub · Firestore … |
| `icons/k8s/` | 16 — Pod · Deployment · Service · Ingress · ConfigMap · Secret · Node … |
| `icons/data/` | 17 — PostgreSQL · MySQL · MongoDB · Redis · Elasticsearch · ClickHouse … |
| `icons/queue/` | 6 — RabbitMQ · Kafka · Celery · NATS · ActiveMQ · EMQX |
| `icons/infra/` | 26 — Nginx · Docker · HAProxy · Traefik · Istio · firewall · router · Windows · Linux … |
| `icons/ops/` | 19 — Prometheus · Grafana · Jenkins · GitLab CI · GitHub Actions · Terraform · Vault … |
| `icons/app/` | 37 — Angular · React · .NET · Spring · Python · LINE · Slack · Stripe · user … |

The full list is in [`assets/icons/INDEX.md`](../assets/icons/INDEX.md). Open [`assets/icons/contact-sheet.html`](../assets/icons/contact-sheet.html) to see every icon on one page.

**If you need an icon that is not among these 205**, search the full library `assets/tech-icons.zip` (8,602 icons · 5 groups) with [`find-icon.py`](../assets/find-icon.py). It needs no installation and does not need the archive unpacked.

| Group | Contents |
|---|---|
| `cloud/` | 1,986 PNG · AWS · Azure · Google Cloud · IBM · Oracle · Alibaba · DigitalOcean · Firebase … |
| `platform/` | 471 PNG · databases · queues · CI/CD · monitoring · Kubernetes · programming languages · GIS |
| `brands/` | 3,461 single-colour SVG · brand logos + official colour codes in `colors.json` |
| `devtools/` | 572 coloured SVG · developer tool logos |
| `ui/` | 2,112 SVG general line icons (Lucide), not logos |

```bash
python assets/find-icon.py kafka redis                       # search by name
python assets/find-icon.py --group ui user                    # search one group only
python assets/find-icon.py --copy cloud/aws/compute/ec2.png brands/docker.svg --to docs/figures/icons
python assets/find-icon.py --colors docker                    # official logo colours
```

Pull out only the icons you use and put them next to the figure file. Do not unpack the whole library into the project. The library's licences are MIT · CC0 · ISC (see `--groups`), but logos remain trademarks of their owners.

> **About licences** — The architecture icon sets of AWS · Azure · Google Cloud
> are published specifically for drawing architecture diagrams, so they may be used in proposal documents.
> What you cannot do is use a logo in a way that suggests the provider endorses or partners with you,
> or use it as part of your own brand. If a tool has no official icon, draw a line icon yourself following [SKILL.md](../SKILL.md) section 6.


## reference: layout-cloud.md

# Skeleton `figure-cloud.html` — cloud diagram with provider logos

This skeleton answers "which cloud services do we use?" The skeleton file is at [`assets/figure-cloud.html`](../assets/figure-cloud.html).

Use it when the reader expects to see real Amazon Web Services (AWS) · Azure · Google Cloud ·
Kubernetes icons, like the reference diagrams the providers publish. Find the icons in the library, per [icons.md](icons.md).

```html
<div class="unit"><img src="icons/aws/ec2.png" alt="">
  <div class="name">Web Server</div><div class="desc">AZ-1</div></div>
```

**Rules specific to this skeleton:**

- **A line that crosses a boundary leaves from the edge of the boundary box** (`n-region`), not from a box inside it,
  because a line that starts from an inner box cuts diagonally across everything in the way.
- **Dashed line = a boundary the provider manages for you.** A solid orange line = a machine we look after ourselves.
  Always put these meanings in the legend.
- Show icons bare, with no frame, because a logo already has its own colour and shape.
- Use the official service name (`Amazon RDS`). The description under the name may be in Thai.


## reference: layout-context.md

# Skeleton `figure-context.html` — the system and the outside world

This skeleton answers "who and what outside does this system talk to?" (C4 level 1). The skeleton file is at [`assets/figure-context.html`](../assets/figure-context.html).

```
┌─ figure header ─────────────────────────────────────────────────┐
│  users (horizontal strip) → described system (large card) ← external systems │
│  ─ staff                    ─ name + subtitle              ─ external system │
│  ─ doctor                   ─ 3-6 functions                ─ name + status   │
│  ─ admin                    ─ limitation tag                                 │
├─ legend ────────────────────────────────────────────────────────┤
│  footnote — meaning of dashed line · all abbreviations · next figure │
└────────────────────────────────────────────────────────────────┘
```

- **Users go on the left and external systems on the right**, never mixed, because people and machines are different kinds of thing.
- **The central card lists 3 to 6 functions.** More than that means you are writing an SRS (Software Requirements Specification), not drawing a figure.
- **An external system not yet connected** gets a dashed line (`planned:true`), and the card says which version plans it,
  because a figure that shows only what exists gets the question "so is HIS connected yet?" every round.
- **Always include a legend** when a shape or line carries meaning.
- **Spell out abbreviations in the footnote**, because readers on the customer side do not know what SEG is.


## reference: layout-deployment.md

# Skeleton `figure-template.html` — deployment · inside the machine

This skeleton answers "what machine does the real thing run on, and what is inside?" The skeleton file is at [`assets/figure-template.html`](../assets/figure-template.html).

It has 3 columns, left to right in the direction the data flows:

```
┌─ figure header ────────────────────────────────────────┐
│  name + subtitle              figure number · version · owner │
├────────────┬──────────────────────────┬────────────────┤
│ outside    │  ⬅ .focus box             │ destination    │
│ people,    │  what this document       │ regulations    │
│ devices,   │  explains                 │ outgoing items │
│ other      │  can nest 1 more level    │                │
│ systems    │                           │                │
├────────────┴──────────────────────────┴────────────────┤
│ footnote — related figures · icon sources              │
└────────────────────────────────────────────────────────┘
```

**Nest boxes no more than 3 levels:** column → large box → small box.
A 4th level means the figure answers 2 questions, so split it into 2 figures.

**A figure may have only one `.focus` box.** With 2 boxes, you have not yet decided what the figure is about.


## reference: layout-flow.md

# Skeleton `figure-flow.html` — what the data flows through, in what order

This skeleton answers "what does 1 message (request · job · document) pass through, and in what order?" The skeleton file is at [`assets/figure-flow.html`](../assets/figure-flow.html) · a rendered example is at [`assets/figure-flow-example.png`](../assets/figure-flow-example.png)

```
┌─ figure header ─────────────────────── ①–⑥ meaning of sequence numbers ┐
│ ┌users┐   ┌channels┐    ┌ host machine (grey) ──────────┐   ┌ external services ┐ │
│ │ person │①→│ web    │②→ │ ┌ system .focus (main colour) ┐ │③→ │ AI · API     │ │
│ │ person │①→│ LINE   │②→ │ │ layer · function      │ │   └─────────────┘ │
│ │ person │ →│ back office│ → │ │ layer · function      │ │④→ ┌ data ────────┐ │
│ └────┘   └──────┘    │ └──────────────────────┘ │   │ files · DB   │ │
│                       └─────────────────────────┘   └─────────────┘ │
├─ footnote: meaning of light fill · dashed line · all abbreviations ────┤
```

## Colour — from the project's single main colour

- Change `--accent` in `:root` in one place. The dark shade, light fill and the text colour on the main-colour fill are computed for you. (For a light colour such as yellow, the script switches the text to a dark colour so it stays readable.)
- Find the main colour in the order in SKILL.md section 5 · to try another colour without editing the file, open `figure-flow.html#accent=0F8B8D`
- **The main colour is used for only 4 things:** the border of the `.focus` box · the system name label · the data path and its sequence numbers · the project name in the figure header
- The rest of the skeleton is neutral grey: dashed groups, host machine boxes, cards. Icons use the 7 existing meaning colours (section 5).

## Rules

- **One direction, left → right**: users → channels → system → things the system calls. If a line must go back, say so in the layer's description (for example "push the reply back to LINE") instead of drawing a return line.
- **Sequence number = the path of 1 message**, not a line number. Lines that happen together share the same number (two incoming channels are both ②) · a branch that does not happen every time (such as reading an image) needs no number.
- **5–9 layers in the system box**, in the order the message passes through them · short layer names, 1–2 lines for each function. If there are more than 9 layers, split into a separate figure of the inside of the system.
- **At most 2 emphasised `.guard` layers**, and explain what they mean in the footnote.
- **Connect a line to the layer that really does the work**, not the edge of the big box. The lines are drawn above the boxes, so the arrowhead reaches the inner layer.
- **Lines that share the same gap must not cross.** Shift the bend with `mx` (a line whose end sits higher gets a smaller `mx`), and render to check every time.
- A label on a line is 1–3 short words saying what flows through (`HTTPS` · `webhook` · `ถาม LLM`) · if the start of the line carries a sequence number, use `lp:"start"` when the final segment is too short


## reference: pitfalls.md

# Pitfalls found in practice — HTML skeletons

Symptoms that come up again and again when making figures with the skeletons in `assets/`, with their causes and fixes. Pitfalls of the SVG/Python engine are in [engine-svg-python.md](engine-svg-python.md) section 9.

| Symptom | Cause · fix |
|---|---|
| Arrowheads vanish from the whole figure | The script deletes every `path` before redrawing, including the arrowhead triangle inside `<defs>`. Delete only `path.wire` (the skeletons already do this) |
| A line goes to the wrong box | The `id` is attached to another box that looks the same. Open the console, look for `wire: ไม่พบ id`, and check that the `id` is unique |
| A line aims at the middle of a tall box and cuts across what is inside | Set `tp` / `fp` so the line enters near the top edge |
| Thai vowels disappear | The machine has no Thai font in the list. Install Noto Sans Thai or add an installed font to the list |
| Image is blurry on a slide | Rendered at a 1x multiplier |
| Image has a lot of white margin | You captured the whole page instead of only `.sheet` |
| A line comes loose after editing text | You wrote fixed line coordinates instead of using `WIRES` |
| A label on a line covers a box, or hides the line so it cannot be seen | The label is wider than the gap between columns. Increase `gap` or shorten the label text |
| A Thai box name wraps to a second line | The column is too narrow. Widen that column. Do not shrink the font |
| Icons used as image files, and the lines go wrong everywhere | The script calculates before the images finish loading. Call `draw()` in `window.onload`, not when the script is read (`figure-cloud.html` already does this) |
| Elbow lines in `figure-flow.html` cross each other | Several lines use the same gap. Set `mx` so a line whose end is higher gets a smaller value, then render again |
| Arrows disappear under the system box | The `.wires` layer has no `z-index`. The flow skeleton sets it already. If you copy to another skeleton, set it there too |
| The figure comes out in the example figure's colour | You forgot to edit `--accent`. Find the project's main colour by SKILL.md section 5 before rendering |
| A line cuts diagonally across the whole figure | The line starts from a box inside the boundary box. Start it from the edge of the boundary box instead |


## reference: wires.md

# Connector wires — details

Open this when writing `WIRES` or fixing a line that goes the wrong way.

**Within the same column**, use the downward arrow `.down` between boxes. Nothing more to write.

**Across columns**, use the `WIRES` list at the end of the file. The script draws the lines after the layout is done:

```js
{from:"n-browser", fs:"r", to:"n-server", ts:"l", tp:0.10, label:"HTTPS 443"}
//    ^source id   ^exit side ^target id  ^entry side ^position on the edge 0=top 1=bottom
```

The calculation happens after layout because box positions depend on the length of the Thai text.
If you write fixed coordinates, one text edit knocks the lines off across the whole figure.

**Rules:**

- **Lines run only vertically or horizontally, and turn with rounded corners.** The `elbow()` function in the skeleton does this itself (horizontal → vertical → horizontal). Use `mx` to shift the bend when several lines share one gap. Do not write a `path` as a straight line from point to point, because when the boxes at the two ends have different heights, the line goes slanted.
- **A label must be narrower than the gap between columns.** Otherwise it covers a box or hides the line. If a label gets longer, raise the `gap` of `.stage` to match.
- Move a label along the line with `lp` (0 = source · 1 = target · omit = middle of the line).
- For a line not yet really connected, use `planned:true` to get a dashed line, and **explain the meaning in the footnote.**
- **No more than 5** cross-column lines per figure, because beyond that the figure turns into a spider web.
- Connect to the **smallest box that is correct**, not the large box around it. If a box is very tall, set `tp` so the line does not aim at the middle of the box.
- A label on a line says **what flows through**, such as `HTTPS 443`, not `เชื่อมต่อ` (connect). If there is nothing to say about a line, leave the label off rather than writing "use".
