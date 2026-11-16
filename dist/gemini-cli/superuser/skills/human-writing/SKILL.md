---
name: human-writing
description: Use before writing anything people read, in Thai or English
---

# human-writing — write like a person: smooth to read, easy to understand

## Use when
- Writing anything a person will read, from chat to labels in a diagram, in Thai or English.

Not for: the look of kept documents (headings, tables, text boxes, theme) → `polished-document-style` · abbreviations and glossaries → `spell-out-abbreviations`.

## Steps

### 1 · Core principles
- Write as if explaining to a skilled coworker who is not on the project. If it trips you up when read aloud, rewrite it.
- Answer or conclusion first, then the reason. No preamble, no repeating the question.
- 1 sentence, 1 idea. If you chain "ซึ่ง" "โดย" "จึง" several layers deep, split into several sentences.
- English follows the same rules: sentences under 25 words · who does what (active voice) · plain words.

### 2 · Symbols and numbers
- `→` means order of steps or a consequence · `·` separates short nouns on one line · `:` introduces detail · write every kind of count as a numeral.
- **Write conditions and instructions as full sentences with connectors** (ถ้า … ให้ … · แล้ว · ส่วน · เพราะ). Do not chain sentences into fragments with `→` or `·`. If an outsider must guess what an arrow means, add words. In tables short text is fine, but it must read as human language, not code.
- **No emoji or icons** (📌 ✅ 💡 🚀 👀) in headings, body, tables, labels, or text boxes. Use bold words instead, such as **หมายเหตุ**. Yes/no cells in a table may use `✓` `✗`. Show severity with the words `วิกฤต · สูง · กลาง · ต่ำ`, never coloured dots. Do not delete emoji the owner wrote, and do not copy them. The one exception is customer chat text that the task's own skill prescribes.
- Say what every number means. Compare so it is easy to picture (times, easier to read than %). If a result is uncertain, say plainly why.
- **Figures that change over time** (prices · tax rates · law · filing deadlines): give the source and the date checked. Cite only sources you actually opened, with a link or DOI. Mark hypothetical numbers or mock data with the label `ตัวอย่าง` from the first place they appear.
- **Dates** in Thai text use พ.ศ. or ค.ศ., one style across the whole set. File names, codes, and machine-read data use `YYYY-MM-DD` in Common Era.
- **Task status** uses these 5 words in every document: `เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่`. Check results use `ผ่าน · ไม่ผ่าน`.

### 3 · Words
- Use words people actually say. No bureaucratic words or literal-translation jargon. Keep terms the field uses in English (token · prompt · API · OCR). Explain a coined or confusing term the first time. Abbreviations → `spell-out-abbreviations`.
- Call one thing by one word across the whole set: chat, slides, documents, diagrams.
- Two-language documents: pick 1 main language and put the other in brackets or a second column. Do not switch inside a sentence.
- Cut padding words ("ทำการ" · "มีการ" · "ในส่วนของ" · "ได้มีการ" · "เป็นการ").
- **Cut items, not function words.** Every length budget (words per bullet · characters per commit title · characters per subtitle) is met by dropping items, condensing, or moving content to the next piece. Never cut `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` or polite words (`ขอ` `รบกวน` `นะ` and ครับ/ค่ะ, per register). They do work in the sentence; without them Thai turns curt and reads like a translation.
- Avoid AI-looking moves: a quotable opener · the slogan "ไม่ใช่แค่… แต่ยัง…" for emphasis (a sentence that contrasts with something real or reframes the problem is fine, but it must close with "ด้วย") · grouping everything in threes · praising something as more important than it is · bold on every line · a closing recap · opening with "แน่นอน" · closing with "หวังว่าจะช่วยได้" · "หลาย" when you know the number · stacked hedges (hedge once, where you are truly unsure).
- For work people look at (screens · slides · ads) also avoid: broad ad words (ยกระดับ · ไร้รอยต่อ · ล้ำสมัย · supercharge) · em dashes in every sentence · canned openers ("ในยุคดิจิทัลที่…") · short fragments split by full stops ("เร็ว. ง่าย. ครบ.") · claims a competitor could also make (put in a real name or number). For the look of the work, use `no-ai-look`.

### 4 · Answering in chat
- First sentence answers directly, then the reason. Short question → 2–3 sentences, no headings or tables.
- Table to compare 2 or more options or many numbers; list for several items to scan. No nested bullets (use a new bold heading). 2–3 short items go on one line with ` · `. Include only what the reader needs.
- Report finished work by its result, not by narrating the steps.
- If you told them something wrong, say what was wrong and what is right, with no long apology. If unsure, say where and how to check; do not guess in a confident voice.
- When the user must decide: offer options, name the recommended one and why, close with 1 easy question.
- Longer than 1 screen: answer the important part first and offer the detailed version in 1 line (do not stop to ask).
- If the user says "งง" or "พูดง่าย ๆ": rewrite the last answer at half the length, no unexplained jargon, no new content.
- End with 1 thing they can do next. No recap.
- **Answering from a document or the web**: retell in your own words, never sentence-by-sentence translation · cause and effect in one paragraph · small exceptions in brackets · 2–3 bold labels are enough · sources together at the end.

### 5 · Documents and reports
- The first paragraph is the conclusion; reading only it gives the point. Headings say what the content is, not the category name. At most 5 sentences per paragraph.
- Column headings say what is measured · 1 column, 1 meaning. Footnotes are for definitions and number sources; never hide an important conclusion there.
- Work summaries and status reports: bold headings only as needed, **ผล** → **ที่ทำ** → **ต่อไป** (add headings for real content, such as awaiting approval). Cut behind-the-scenes method, solved problems that do not affect the reader, and numbers not used for a decision. Tag every claim `ตรวจจริง` · `จากแหล่ง` · `อนุมาน` · `ยังไม่ได้ตรวจ` (meanings in `superuser` `references/evidence.md`).
- Formal documents (official letters · contracts · tax invoices) use the wording the form requires; this skill covers only the parts you write yourself. Choose the register for each job (official · business · shop chat · job application · complaint · screen) from the table in `thai-grammar` section 4 before writing, and keep it through the piece.

### 6 · Slides and headings of every kind
Applies to slide titles, figure titles, document headings, and box titles in a diagram.
- A slide title = the conclusion of the page, not the topic name · at most 2 lines (about 15 words) · detail goes in the body.
- **A title with 2 parts needs a connector that matches the real relationship** ("เพราะ" or "จึง" for reason · "ส่วน" for a split of roles · "แต่" for contrast) · 1 title, 1 connector. If it needs 2, you crammed too much in.
- Use phrases people actually say, not strings of nouns · choose words by reader · the verb matches what the page shows · do not use "คน" for things that are not people.
- The caption under a picture must say what the picture does not; if it repeats the picture, cut it · page structure: problem → fix → result · write a speaking script the way it is spoken.
- **Test:** read the title once to an outsider. If they cannot retell it, rewrite it.

### 7 · Diagrams
- Box labels are short nouns of 1–4 words · arrow labels are verbs · an unlabelled arrow must be impossible to misread.
- Words in the figure match the document · the figure title is a conclusion, with 1 sentence under it saying what to look at · follow the house style if there is one.

## Check before sending
1. Does it read smoothly aloud, and not like a translation?
2. Can an outsider understand it without asking? Can every symbol be read?
3. Does the first sentence already answer or give the conclusion?
4. Do terms and numbers match across every file in the set?
5. Any padding to cut without changing meaning? Cut it, but `จะ` `ให้` `ก็` `ด้วย` `แล้ว` and polite words are not padding; if cutting made a sentence curt, put them back.
6. Does every heading pass section 6?
7. Thai of 1 paragraph or more: run `python scripts/thai_tells.py <file>` (warns only), then walk the 7 sentence-structure rules in `thai-grammar`. Passing every rule is not the same as reading smoothly. The final verdict on language, taste and looks belongs to the user.

## References
- [`references/headings-and-examples.md`](references/headings-and-examples.md) — open for examples of every rule, the before → after heading table, and their sources
- [`references/thai-grammar.md`](references/thai-grammar.md) — open when writing Thai of 1 paragraph or more (sentence structure · register); example paragraphs in [`references/thai-examples.md`](references/thai-examples.md)
- [`references/strict-review.md`](references/strict-review.md) — open for research or work sent to outsiders
- [`references/thai-line-breaking.md`](references/thai-line-breaking.md) — open for Thai documents with justified alignment
