---
name: translate-th-en
description: Use when translating Thai and English or syncing files
---

# translate-th-en — translate Thai-English so it reads as if written in that language from the start

Lives only in plugin `superuser`; other plugins share it through `dependencies` · wording of the translation follows `human-writing` · this file holds only rules `human-writing` does not have, and does not repeat it

> **One rule:** translate meaning one paragraph at a time, not word by word · 1 term = 1 translation across the whole project, recorded in `docs/glossary.md`

## Use when

- Translating a document, README, manual, proposal, email or chat from Thai to English, or English to Thai
- Translating screen text (buttons · labels · errors · notifications) into language files
- The project has paired Thai/English files that must be edited to match

Do not use when: writing fresh in one language → `human-writing` · storing and showing dates, numbers, money in code → `i18n-and-locale` (plugin `software-development`)

## Use another skill instead, or together

| Task | Use |
|---|---|
| English to Thai — sentence structure, idiom, AI habits | `human-writing` `references/thai-grammar.md` item 7 (the 7-point checklist) · pick the Thai register from item 4 before choosing words; if unsure, pick 1 step more formal than the source, and never switch register inside one paragraph |
| Transliteration, foreign personal names, abbreviations | `thai-grammar` item 5 · `spell-out-abbreviations` |
| Hard-to-say messages (refusal · debt reminder) in 2 languages | `polite-message-th-en` |
| Date, number, currency, Buddhist Era (พ.ศ.) formats in a system | `i18n-and-locale` items 2–4 · Thai word-segmentation and transliteration tools → `i18n-and-locale/references/thai-text-tools.md` |
| CV · job application letter in 2 languages | `resume-th-en` (plugin `career`) |

## 1 · Thai to English — what must change, not just swap words

| Thai has it, English does not | What to do | Example |
|---|---|---|
| Sentence-final particles ครับ ค่ะ นะ จ้ะ เลย | Drop them · politeness moves into the tone of the sentence (`please` once, not in every sentence) | `ส่งไฟล์ให้ด้วยนะคะ` → `Please send me the file.` |
| The subject can be dropped | Put a subject in every sentence · work out who from context; if unsure → `(รอยืนยัน)` (awaiting confirmation), do not guess | `ส่งแล้ว` → `We sent it.` or `I sent it.` |
| Titles and forms of address (คุณ · พี่ · ท่าน · อาจารย์ · นาย/นาง) | Use `Mr`, `Ms`, `Dr` by the real position · `พี่/น้อง` is just a name · `ท่าน` in an official letter → `you` or the position (`the Director`) | `พี่สมชายบอกว่า` → `Somchai said` |
| Buddhist Era (พ.ศ.) years | Convert to Common Era (CE) (subtract 543) every time · in body text write dates as `15 November 2026` · in file names or machine-read data use `2026-11-15` | `ปีงบประมาณ 2569` → `fiscal year 2026` |
| Thai personal names | Use the spelling the owner uses (business card · email · LinkedIn) first · none → transliterate by the Royal Institute's rule (Royal Thai General System of Transcription: RTGS) and tag `(รอยืนยัน)` (awaiting confirmation) · one name, one spelling across the set | `สันเสริญ` → `Sansern` (the owner's spelling), not `Sansoen` |
| Names of agencies, laws, forms | Use that agency's official English name (check the official website) · none → transliterate and put the translation in brackets · Thai abbreviations (ภ.ง.ด. · สคบ.) are written in full the first time | `กรมสรรพากร` → `the Revenue Department` · `ภ.ง.ด.53` → `PND 53 (withholding tax return)` |
| Money | `THB 1,500` or `1,500 baht`, one style across the set · do not use `฿` in English documents | |
| A long sentence chained with ซึ่ง โดย จึง | Split into 2–3 sentences, 1 idea each, at most 25 words | |
| Repeated words for emphasis (ดี ๆ · เร็ว ๆ) and softening words (จัง · มาก ๆ) | Translate as one word of the right strength, or drop it if the meaning does not change | `รีบ ๆ หน่อยนะ` → `Please hurry.` |

When done, reread the whole paragraph: if an English reader could guess that the source was Thai (sentences with no subject · stacked `very` · `already` closing every sentence in place of `แล้ว`), rewrite it — the same rule as `thai-grammar` item 7 point 7, but in the other direction.

## 2 · Glossary per project — `docs/glossary.md`

- Open it before every translation · none → create it from the terms found in the first piece of work
- 1 term = 1 translation = 1 spelling across documents, screens and chat · if the same word is translated 2 ways, fix it to one, do not leave it
- Table `| ไทย | English | ใช้เมื่อ · ไม่ใช้ |` (Thai | English | use when · do not use) · include product names, screen names, feature names, work statuses, and words deliberately left untranslated (item 5)
- A code project that already has `locales/glossary.md` per `i18n-and-locale` uses that file and does not create another · put a one-line link in `docs/glossary.md`

## 3 · Paired files — edit Thai and English in the same round

- Files that are a pair (`README.md` / `README.th.md` · `brd-th.md` / `brd-en.md` · `th.json` / `en.json`) are all edited in the same round · editing one side and sending = the work is not done
- Heading order, item numbers and the number of table rows must match, so a reader who switches files finds the same spot · a heading that exists in one language only is tagged `(ยังไม่มีฉบับ EN)` (no EN version yet) and not left to vanish
- 1 main language, the other follows · say on the first line of the translated file `แปลจาก README.md รุ่น 2026-10-23` (translated from README.md version 2026-10-23) so people know whether it is up to date
- Links, file names, images and code blocks are the same in both files, except text inside images that are in different languages

## 4 · Screen text

- **Length budget per language** — Thai is often 20–40% longer than English at the same width (not checked, a general figure, measure on a real screen before trusting) · for buttons and menu labels, set a budget as a character count per language, then cut by reducing words per `human-writing` item 3, never cutting function words
- **Do not concatenate strings** — a full sentence lives in one key, with placeholders (`{count}` · `{name}`) that can move, because Thai and English word order differ (example in `i18n-and-locale` item 1)
- **Placeholders keep the same name** in both languages · count the placeholders so they are equal in every key (`{count}` missing on one side = a bug) · check JSON files with `node <this skill's folder>/scripts/i18n-pair-check.mjs th.json en.json` to get missing keys, extra keys and mismatched placeholders for every key in one pass
- Plurals: English has 2 forms, Thai has one · use the library's plural mechanism, do not write `(s)`
- Thai register of screens = the "หน้าจอ" (screen) row in `thai-grammar` item 4 · English uses sentence case, verb first (`Save` · `Send request`), not Title Case on every word
- Keys are named by place and meaning (`order.status.shipped`), not by the English text

## 5 · Do not translate

Code, variable names, commands, paths and text inside code blocks · product names, brand names, company names (use the form the owner uses) · contract clause numbers and section names (`ข้อ 7.2` stays `Clause 7.2`, not renumbered) · official names of laws and forms stay as the official name (item 1) · file names and URLs · terms the field already uses in English (API · deploy · token — per `thai-grammar` item 5) · words the glossary marks as untranslated

## 6 · 6-point check before sending

1. **Meaning complete** — numbers, dates, conditions, names and exceptions in the source are all there, and no hedging or polite words are added that the source does not have (compare paragraph by paragraph)
2. **Years and money** — Buddhist Era to Common Era converted correctly everywhere · one style for money and dates across the set
3. **Glossary** — every term in the table is used exactly as in the table · new terms are added to the table
4. **Names of people and agencies** — spelled as the owner or the official name · unconfirmed ones tagged `(รอยืนยัน)` (awaiting confirmation)
5. **Reads as if written in that language** — read the whole paragraph aloud · English: every subject present, sentences at most 25 words · Thai: passes the `thai-grammar` item 7 checklist and run `human-writing/scripts/thai_tells.py`
6. **Paired files and screens** — paired files all edited, heading order matches · screen strings have equal placeholders in every key and stay within the length budget

Deliver: the translated files · the updated glossary · the `(รอยืนยัน)` list under its own heading · do not paste the source back into the answer

## Sources

- The idea "choose the register and the relationship before choosing words · the final particles ครับ/ค่ะ have no English counterpart · the pronouns I/you have no 1-to-1 translation · which words stay English" is adapted from `thai-translate`, and the word-segmentation, transliteration and sorting tools from `thai-text-processing`, in [Boom-Vitt/claude-thai-skills](https://github.com/Boom-Vitt/claude-thai-skills) (MIT · reworded, not copied · seen 2026-10-23) · the parts on Buddhist Era years, personal names, paired files and screen text are not in the source and were written fresh
- Rules for transcribing Thai letters into Roman (RTGS) — Royal Society of Thailand, 1999 edition (B.E. 2542) (not checked against the real Royal Gazette issue)
- English-to-Thai rules, register, and transliteration — `human-writing/references/thai-grammar.md` items 4 5 7 (a file in this repo, not repeated)
