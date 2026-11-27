
# Polished Document Style — headings, tables, callouts, and theme for a kept document

> **Gate before starting (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls color and font, the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **Boundary:** this skill handles the look; the wording belongs to `human-writing`. Open both for a document people keep to read.

## Use when
- Output is for general readers (managers, executives, clients), needs sign-off, or will be shared widely or converted to PDF/Word · any doc with 3+ sections or 500+ words
- Laying out any document people keep to read (Markdown · Word · PDF), including Thai text in Office files
- Not for: internal notes for the author's own team, scratch notes, code comments · a whole Markdown report that must come out as one .docx → `document-design` · a rendered .docx/.pptx/.pdf → `document-design` on top of this skill (this skill governs the markdown source)

## Steps
1. **Find an existing template first.** Check the client's or organization's standard: Word/Google Docs templates the client gave · earlier documents in the project (`docs/`, `ref/`) · format requirements in the TOR or contract. If found, use it (headings, order, field names, running numbers) and say which file it came from. If not, use this skill's structure and say no template was found. Readability applies either way.
2. **Start with the header.** A plain-text H1, then a quote box with version, date, status, author, reviewer, tags, closed with `---` (example in [`references/markdown-patterns.md`](references/markdown-patterns.md)). Formal documents (proposal · formal report · contract · postmortem) open with a cover block: type, version, status, date, author, reviewer, related documents.
   - Status takes only: **Draft** (ร่าง) · **Review** (กำลังรีวิว) · **Approved** (อนุมัติแล้ว) · **Archived** (เก็บถาวร) (`superuser/status-report` adds `ยังไม่เริ่ม` for work not begun) · in a Sign-off table the Status column is the signer's: **Approved** · **Review** · **Pending** · **Rejected**.
3. **Headings.** One H1 · H2 numbered (`## 1. Section`) · H3 (`### 1.1 Sub-topic`) · H4 rare. 5+ sections → add a table of contents whose links reach the real headings.
4. **Declare the theme once.** At the end of the header put `<!-- doc-theme: accent=… · ที่มา=… · ยืนยันเมื่อ=YYYY-MM-DD -->`; every tool (`diagrams` · `document-design` · `slide-deck`) reads the color from there. To choose a color or put real colors into a figure, .docx, or slides, open [`references/theme-colors.md`](references/theme-colors.md).
5. **Labels are words, never emoji** (emoji in headings and badges signal AI-made, `design-gate/no-ai-look`):

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
8. **Figures** in project documents are drawn with `diagrams` (house style) and embedded as images; Mermaid (`diagrams`) only for quick figures in a README, PR, or code notes. Place the figure after the paragraph that says what question it answers · 1-line caption under it starting **รูปที่ N —** · never repeat a figure; refer to its number.
9. **Lists and code.** Never nest bullets: use sub-headings or a table. Code blocks always name the language; long code gets the file name as a comment on line 1.
10. **Thai in Word · Excel · PDF** (complex-script font · no justify · embed fonts · BOM CSV): open [`references/thai-office.md`](references/thai-office.md) before creating the file.
11. If the skill that writes the document has a template in `assets/`, run `python scripts/check_outline.py <template.md> <document.md>` before sending. It checks headings are complete and in template order, bold fields complete, table headers match, no field unfilled. In a template, end an optional heading or field with `<!-- optional -->`. After editing the checker, run `--self-test` first.

## Check before done
- H1 in plain text · no emoji in any heading, callout, badge, or table
- Header block with version, date, status, authors · TOC if 5+ sections · sections numbered consistently · TOC links work
- Tables where data has 2+ attributes · every flow or relationship has a `diagrams` figure, not default Mermaid
- Code blocks have language hints · glossary if 5+ abbreviations · terms used consistently ("user" vs "customer")
- No placeholder text (TBD, TODO, Lorem ipsum); `(รอยืนยัน)` markers listed in the pending-confirmation list are not placeholders, keep them
- Rendered once in the real viewer (Word · PDF · GitHub preview) · item 3 of `design-gate/no-ai-look` passed

## References
- [`references/markdown-patterns.md`](references/markdown-patterns.md) — open when writing a header, TOC, callout, table, badge, cover block, comparison table, sign-off, or glossary (copy the examples)
- [`references/theme-colors.md`](references/theme-colors.md) — open when choosing the main color or putting colors into a figure, .docx, or slides
- [`references/thai-office.md`](references/thai-office.md) — open when creating Word · Excel · PDF with Thai
- Abbreviation writing → `human-writing/spell-out-abbreviations`
