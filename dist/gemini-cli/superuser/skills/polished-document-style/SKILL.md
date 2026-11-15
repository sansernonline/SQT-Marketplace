---
name: polished-document-style
description: Use when a kept document needs headings, tables and theme
---

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
