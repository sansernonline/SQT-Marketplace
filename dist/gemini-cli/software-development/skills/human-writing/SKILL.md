---
name: human-writing
description: Use before writing or editing anything people read (answer, email, report, README, slide, label) in Thai or English. Look → polished-document-style.
---

# human-writing — write like a person: smooth to read, easy to understand

Applies to everything a person will read, from chat to labels in a diagram. This skill teaches good Thai and good English. Rules about Thai output stay as written. Examples of every rule and their sources → [`headings-and-examples`](references/headings-and-examples.md). Thai of 1 paragraph or more → [`thai-grammar`](references/thai-grammar.md) (sentence structure · register · example paragraphs in [`thai-examples`](references/thai-examples.md)). Research or work sent to outsiders → [`strict-review`](references/strict-review.md). Thai documents with justified alignment → [`thai-line-breaking`](references/thai-line-breaking.md). It lives only in plugin `superuser`; other plugins share it through `dependencies`.

Boundary: this skill owns the wording. The look of kept documents (headings, tables, text boxes, theme) → `polished-document-style`. Abbreviations and glossaries → `spell-out-abbreviations`.

## 1 · Core principles

- Write as if explaining to a skilled coworker who is not on the project. If it trips you up when read aloud, rewrite it.
- Answer or conclusion first, then the reason. No preamble, no repeating the question.
- 1 sentence, 1 idea. If you chain "ซึ่ง" "โดย" "จึง" several layers deep, split into several sentences.
- English follows the same rules: sentences under 25 words · who does what (active voice) · plain words.

## 2 · Symbols and numbers

- `→` means order of steps or a consequence · `·` separates short nouns on one line · `:` introduces detail · write every kind of count as a numeral · the words around a symbol must be human language.
- **Write conditions and instructions as full sentences with connectors** (ถ้า … ให้ … · แล้ว · ส่วน · เพราะ — that is, if … then … · and then · as for · because). Do not chain sentences into fragments with `→` or `·`.
- In tables, short text is fine, but it must still read as human language, not code.
- A symbol must never replace a word so far that the reader has to decode it. If an outsider must guess what the arrow means, add words.
- **No emoji or icons** (📌 ✅ 💡 🚀 👀) in headings, body, tables, labels, or text boxes, because readers spot them at once as AI-written. Use bold words instead, such as **หมายเหตุ** (note). Yes/no cells in a table may use `✓` `✗`. Show severity with the words `วิกฤต · สูง · กลาง · ต่ำ`, never coloured dots. Do not delete emoji the owner wrote, and do not copy them. The one exception is customer chat text that the task's own skill prescribes.
- Say what every number means. Compare so it is easy to picture (times, easier to read than %). If a result is uncertain, say plainly why.
- **Figures that change over time** (prices · tax rates · law · filing deadlines): give the source and the date checked. Cite only sources you actually opened, with a link or DOI. Mark hypothetical numbers or mock data with the label `ตัวอย่าง` (example) from the first place they appear.
- **Dates** in Thai text use Buddhist Era (พ.ศ.) or Common Era (ค.ศ.), one style across the whole set. File names, codes, and machine-read data use Common Era `YYYY-MM-DD`.
- **Task status** uses these 5 words in every document: `เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่` (done · in progress · blocked · awaiting approval · pending). Check results use `ผ่าน · ไม่ผ่าน` (pass · fail).

## 3 · Words

- Use words people actually say. No bureaucratic words or literal-translation jargon.
- Keep terms the field already uses in English (token · prompt · API · OCR).
- Abbreviations → follow `spell-out-abbreviations`. Explain a coined or confusing term the first time you use it.
- Call one thing by one word across the whole set: chat, slides, documents, and diagrams.
- Two-language documents: pick 1 main language and put the other in brackets or a second column. Do not switch back and forth inside a sentence.
- Cut padding words ("ทำการ" · "มีการ" · "ในส่วนของ" · "ได้มีการ" · "เป็นการ" — empty Thai fillers such as "ทำการ" before a verb).
- **Cut items, not function words.** Every kind of length budget (words per bullet · characters per commit title · characters per subtitle) is met by dropping items, condensing content, or moving it to the next piece. Never cut `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` (Thai function words: future marker, "to/let", "also", "too", "then", emphatic particle) or polite words (`ขอ` `รบกวน` `นะ` and ครับ/ค่ะ, per register). These do work in the sentence. Cut them and Thai turns curt and reads like a translation.
- Avoid moves that look AI-written: a quotable opener · the slogan "ไม่ใช่แค่… แต่ยัง…" (not just… but also…) used for emphasis (a sentence that contrasts with something real or reframes the problem is fine, but it must close with "ด้วย") · grouping everything in threes · praising something as more important than it is · bold on every line · a closing recap · opening with "แน่นอน" (certainly) · closing with "หวังว่าจะช่วยได้" (hope this helps) · using "หลาย" (several) when you know the number · stacked hedges (hedge once, at the point you are truly unsure).
- For work people look at (screens · slides · ads) also avoid: broad ad words (ยกระดับ · ไร้รอยต่อ · ล้ำสมัย · supercharge — elevate · seamless · cutting-edge) · em dashes in every sentence · canned openers ("ในยุคดิจิทัลที่…" — "In the digital age where…") · short fragments split by full stops ("เร็ว. ง่าย. ครบ." — "Fast. Easy. Complete.") · claims a competitor could also make: put in a real name or number instead · for the look of the work, use `no-ai-look`.

## 4 · Answering in chat

- First sentence answers directly, then the reason.
- Short question → short answer, 2–3 sentences, no headings or tables.
- Use a table to compare 2 or more options or many numbers. Use a list when there are several items to scan. No nested bullets (split sub-topics into a new bold heading). 2–3 short items go on one line separated by ` · `. Include only what the reader needs.
- Report finished work by its result, not by narrating the steps.
- If you told them something wrong, say what was wrong and what is right. No long apology. If unsure, say where and how to check. Do not guess in a confident voice.
- When the user must decide: offer options, name the recommended one and why, and close with 1 question that is easy to answer.
- Longer than 1 screen: answer the important part first and offer the detailed version in 1 line (do not stop to ask).
- If the user says "งง" (confused) or "พูดง่าย ๆ" (say it simply): rewrite the last answer at half the length, with no unexplained jargon and no new content.
- End with 1 thing they can actually do next. No recap.
- **Answering from a document or the web**: retell in your own words, never translate sentence by sentence · cause and effect in one paragraph · small exceptions in brackets · 2–3 bold labels are enough · put sources together at the end of the answer.

## 5 · Documents and reports

- The first paragraph is the conclusion. Reading only it must give the point.
- Headings say what the content is, not the category name · at most 5 sentences per paragraph.
- Column headings say what is measured · 1 column, 1 meaning.
- Footnotes are for definitions and number sources · never hide an important conclusion in a footnote.
- Work summaries and status reports: bold headings only as needed, **ผล** (result) → **ที่ทำ** (what was done) → **ต่อไป** (next) (add headings when there is real content, such as awaiting approval) · cut behind-the-scenes method, solved problems that do not affect the reader, and numbers not used for a decision · tag every claim `ตรวจจริง` · `จากแหล่ง` · `อนุมาน` · `ยังไม่ได้ตรวจ` (verified · from a source · inferred · not yet checked; meanings in `superuser` `references/evidence.md`).
- Formal documents (official letters · contracts · tax invoices) use the wording the form requires. This file covers only the parts you write yourself. Choose the register for each job (official · business · shop chat · job application · complaint · screen) from the table in `thai-grammar` section 4 before writing, and keep it through the whole piece.

## 6 · Slides and headings of every kind

Applies to slide titles, figure titles, document headings, and box titles in a diagram. The full rules and the before → after table are in the same reference.

- A slide title = the conclusion of the page, not the topic name · at most 2 lines (about 15 words) · detail goes in the page body.
- **A title with 2 parts needs a connector that matches the real relationship** ("เพราะ" or "จึง" for reason · "ส่วน" for a split of roles · "แต่" for contrast — because or so · as for · but) · 1 title, 1 connector. If it needs 2, you crammed too much in.
- Use phrases people actually say, not strings of nouns · choose words by reader.
- The verb matches what the page shows · do not use "คน" (person) for things that are not people.
- The caption under a picture must say what the picture does not. If it repeats the picture, cut it · page structure: problem → fix → result · write a speaking script the way it is actually spoken.
- **Test:** read the title once to an outsider. If they cannot retell it, rewrite it.

## 7 · Diagrams

- Box labels are short nouns of 1–4 words people understand · arrow labels are verbs · an unlabelled arrow must be impossible to misread.
- Words in the figure match the document · the figure title is a conclusion, with 1 sentence under it saying what to look at · follow the house style if there is one.

## 8 · 7-point check before sending

1. Does it read smoothly aloud, and not like a translation?
2. Can an outsider understand it without asking? Can every symbol be read?
3. Does the first sentence already answer the question or give the conclusion?
4. Do terms and numbers match across every file in the set?
5. Is there any padding you can cut without changing the meaning? If so, cut it. But `จะ` `ให้` `ก็` `ด้วย` `แล้ว` and polite words are not padding (section 3). If cutting made a sentence curt, put them back.
6. Does every heading pass section 6: 2 parts have a connector · a phrase people say · words fit the reader · the verb matches what the figure shows?
7. Thai of 1 paragraph or more: run `python scripts/thai_tells.py <file>` (warns only, does not judge), then walk the 7 sentence-structure rules in `thai-grammar`. Passing every rule is not the same as reading smoothly. For language, taste, and looks, the final verdict belongs to the user, not to the model doing the check.
