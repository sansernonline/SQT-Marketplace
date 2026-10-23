---
name: thesis-writing
description: Use when writing a thesis, independent study (IS) or research paper (proposal, literature review, citations, Thai .docx typesetting, defense).
---

# Thesis and Paper Writing

The user's research, the user's claims, the user's data. Claude makes the argument clear, the structure tight and every citation real.

## Workflow

1. **Get the rules first.** Ask for the faculty's thesis manual (คู่มือการทำวิทยานิพนธ์) or the journal's author guidelines. They decide the chapter names, citation style, margins, fonts, abstract length and the AI-use policy. Everything in this skill is the default when no manual is given, and the manual wins when it differs
2. **One research question in one sentence.** Write the question, the objectives (วัตถุประสงค์, 2–4 items, each starts with a measurable verb: ศึกษา · เปรียบเทียบ · พัฒนา · ประเมิน) and the hypotheses if any. Every later chapter must trace back to these. If it cannot be said in one sentence, the scope is still too wide
3. **Literature matrix before prose.** Collect sources into the matrix in [references/literature-matrix.md](references/literature-matrix.md): who · year · method · sample · finding · gap. Write chapter 2 from the matrix, grouped by theme, not one paragraph per paper
4. **Outline every chapter as headings plus 1-line claims**, using [references/thesis-structure.md](references/thesis-structure.md). The adviser checks the outline before anyone writes full text. Changing an outline costs minutes; changing 40 pages costs weeks
5. **Draft chapter by chapter**, in the order 3 → 1 → 2 → 4 → 5 → abstract. Method first, because it fixes what the rest may claim. Abstract last, because it summarises what exists
6. **Every paragraph does one job**: topic sentence → evidence with citation → what it means for this study. A paragraph with no citation in chapter 2, or with no number in chapter 4, is usually empty
7. **Citations checked one by one** against the rules in [references/citation-and-integrity.md](references/citation-and-integrity.md). Each reference must exist, be found by Digital Object Identifier (DOI), ThaiJO, ThaiLIS or the publisher's page, and actually say what the sentence says. Resolve in this order and stop at the first hit: DOI at doi.org → CrossRef (metadata) → arXiv for preprints → Semantic Scholar → ThaiJO or ThaiLIS for Thai journals and theses → the user's own reference manager (Zotero or EndNote) as the last check, never the first. Google Scholar finds candidates; it is not proof
8. **Language pass** for Thai academic register with [references/thai-academic-language.md](references/thai-academic-language.md), or the English rules in the same file. Then a **typesetting pass** for a Thai .docx with [references/thai-typesetting.md](references/thai-typesetting.md): Thai Distributed body text, no spaces between phrases, zero-width break points
9. **Similarity check** in the university's tool (Turnitin or อักขราวิสุทธิ์) before sending to the adviser. Threshold per university (รอยืนยัน)
10. **Defense or journal submission** with [references/defense-and-review.md](references/defense-and-review.md): slide plan, likely committee questions, and the response-to-reviewers table

## What Claude does and does not do

| Claude does | Claude does not |
|---|---|
| Outline, restructure, tighten paragraphs, fix register and grammar | Write findings, results or conclusions the user has not produced |
| Find candidate sources and show where each came from | Cite a source it has not verified exists — unverified ones are marked `(ยังไม่ได้ตรวจ)` |
| Explain a statistical test and check that the method fits the question | Invent, adjust or "smooth" data, sample sizes or p-values |
| Draft the methods text from the user's real procedure | Fill gaps in the procedure with plausible-sounding steps |
| Turn the user's notes into a draft the user then rewrites | Produce a whole chapter for submission as the user's own work when the university or journal forbids it |

When asked to cross a line in the right column, say which rule it breaks and offer the nearest allowed help (an outline, a critique, a template).

## Rules

- **A citation that cannot be found does not go in.** Language models invent plausible references; one fake reference can fail a defense or retract a paper. Show the DOI or URL for every source Claude suggests
- **Cite what you read.** If the user only read a review that cites the original, cite the review, or find and read the original
- **AI use follows the institution's policy** and is disclosed where the policy or journal asks. Tools cannot be listed as authors (Committee on Publication Ethics (COPE) position)
- **Numbers in the text match the tables.** Re-check every number in chapters 4, 5 and the abstract against the analysis output
- **One term per concept** across all chapters. Keep a glossary (นิยามศัพท์เฉพาะ) and use it
- Dates in Thai theses usually use พ.ศ.; references to English sources keep ค.ศ. Follow the manual
- **Thai body text is Thai Distributed, and spaces go only where Thai prose puts them.** Spaces typed between phrases to help line breaking become visible gaps. Use zero-width spaces instead ([references/thai-typesetting.md](references/thai-typesetting.md)) and check the exported PDF page by page

## Quick sizes (defaults when the manual is silent)

| Part | Master's thesis | Journal article |
|---|---|---|
| Whole text | 80–150 pages (รอยืนยัน per faculty) | 10–20 pages / 4,000–8,000 words per journal |
| Abstract | 1 page each in Thai and English, about 250–350 words | 150–250 words, one paragraph |
| Keywords | 3–5 | 3–6 |
| Literature review | 25–35% of the text | 15–20% |
| Discussion | Compares each finding with ≥ 1 earlier study | Same, shorter |

Related: `paper-to-practice` (understand someone else's paper), `english-tech-reading` (read long English papers faster), `human-writing` (plain language for everything outside the thesis itself), and `presentation-design` for defense slides. Word output from Markdown → `markdown-report-docx` builds the .docx; keep the rules in [references/thai-typesetting.md](references/thai-typesetting.md).
