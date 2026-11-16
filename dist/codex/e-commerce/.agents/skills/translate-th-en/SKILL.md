---
name: translate-th-en
description: Use when translating Thai and English or syncing files
---

# translate-th-en — translate Thai-English so it reads as if written in that language from the start

> **One rule:** translate meaning one paragraph at a time, not word by word · 1 term = 1 translation across the whole project, recorded in `docs/glossary.md`

## Use when
- Translating a document, README, manual, proposal, email, or chat, Thai to English or English to Thai
- Translating screen text (buttons · labels · errors · notifications) into language files
- The project has paired Thai/English files that must be edited to match
- Not for: writing fresh in one language → `human-writing` · storing and showing dates, numbers, money in code → `i18n-and-locale` (plugin `software-development`) · hard-to-say messages in 2 languages → `polite-message-th-en` · CV in 2 languages → `resume-th-en` (plugin `career`)

## Steps
1. **Open `docs/glossary.md`** (none → create it from the terms in the first piece of work). Table `| ไทย | English | ใช้เมื่อ · ไม่ใช้ |` with product, screen, and feature names, work statuses, and words left untranslated. One term = one translation = one spelling across documents, screens, and chat; fix a word translated 2 ways. If the code project has `locales/glossary.md` per `i18n-and-locale`, use that and link it in one line from `docs/glossary.md`.
2. **If translating Thai to English, change what English lacks** (full table with examples: [`references/th-to-en-table.md`](references/th-to-en-table.md)):
   - Final particles (ครับ ค่ะ นะ เลย): drop; `please` once, not in every sentence.
   - Dropped subject: put one in every sentence, worked out from context; if unsure, tag `(รอยืนยัน)`, do not guess.
   - Titles: `Mr`/`Ms`/`Dr` by real position · `พี่/น้อง` is just a name · `ท่าน` → `you` or the position.
   - Buddhist Era years: subtract 543 every time · body text `15 November 2026` · file names and machine-read data `2026-11-15`.
   - Personal names: the owner's own spelling first (card, email, LinkedIn); none → RTGS transliteration tagged `(รอยืนยัน)` · one name, one spelling.
   - Agency, law, and form names: official English name (check the official site); none → transliterate with the translation in brackets · write Thai abbreviations (ภ.ง.ด. · สคบ.) in full the first time.
   - Money: `THB 1,500` or `1,500 baht`, one style, no `฿`.
   - Long sentences chained with ซึ่ง โดย จึง: split, 1 idea each, at most 25 words.
   - Emphasis and softening words (ดี ๆ · จัง · มาก ๆ): one word of the right strength, or drop.
   - Reread the paragraph: if an English reader could tell the source was Thai (no subjects, stacked `very`, `already` ending every sentence), rewrite.
3. **If translating English to Thai,** follow `human-writing` `references/thai-grammar.md` item 7 (7-point checklist) and pick the register from item 4 before choosing words. If unsure, pick 1 step more formal than the source; never switch register inside a paragraph. Transliteration and abbreviations: `thai-grammar` item 5 · `spell-out-abbreviations`.
4. **If there are paired files** (`README.md` / `README.th.md` · `brd-th.md` / `brd-en.md` · `th.json` / `en.json`), edit both in the same round; editing one side only is not done. Heading order, item numbers, and table row counts match; a heading in one language only is tagged `(ยังไม่มีฉบับ EN)`. One main language, the other follows; put `แปลจาก README.md รุ่น 2026-10-23` (source file and version) on the first line of the translated file. Links, file names, images, and code blocks are identical in both.
5. **If translating screen text:**
   - Thai is often 20–40% longer than English (general figure, not checked: measure on a real screen). Set a character budget per language for buttons and labels, and cut by removing words, never function words.
   - Never concatenate strings: one full sentence per key, with movable placeholders (`{count}` · `{name}`) (`i18n-and-locale` item 1).
   - Placeholders keep the same name in both languages, and counts match in every key. Check JSON with `node <this skill's folder>/scripts/i18n-pair-check.mjs th.json en.json` (missing keys, extra keys, mismatched placeholders).
   - Plurals: use the library's mechanism, not `(s)`. Thai screen register = the "หน้าจอ" row in `thai-grammar` item 4 · English uses sentence case, verb first (`Save` · `Send request`).
   - Keys are named by place and meaning (`order.status.shipped`), not by the English text.
6. **Do not translate:** code, variable names, commands, paths, text in code blocks · product, brand, and company names (the owner's form) · contract clause numbers and section names (`ข้อ 7.2` → `Clause 7.2`, not renumbered) · official names of laws and forms · file names and URLs · terms the field keeps in English (API · deploy · token) · words the glossary marks untranslated.
7. Date, number, currency, and Buddhist Era formats in a system: `i18n-and-locale` items 2–4 (Thai word-segmentation and transliteration tools: `i18n-and-locale/references/thai-text-tools.md`).

## Check before done
- Meaning complete: numbers, dates, conditions, names, exceptions all there; no hedges or polite words added that the source lacks (compare paragraph by paragraph)
- Years and money converted correctly and in one style across the set
- Every term used exactly as in the glossary; new terms added
- Names of people and agencies as the owner or the official name; unconfirmed ones tagged `(รอยืนยัน)`
- Reads as if written in that language (read aloud): English has every subject and sentences of at most 25 words · Thai passes `thai-grammar` item 7 and `human-writing/scripts/thai_tells.py`
- Paired files all edited with matching heading order · screen strings have equal placeholders and fit the budget
- Delivered: translated files · updated glossary · the `(รอยืนยัน)` list under its own heading · source not pasted back

## References
- [`references/th-to-en-table.md`](references/th-to-en-table.md) — open when translating Thai to English and need the full rule table with examples
- [`references/sources.md`](references/sources.md) — sources and check dates
