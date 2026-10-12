# Thai typesetting in Word — neat body text

Thai has no spaces between words. Neat Thai body text needs two settings working together: an alignment that fills the line evenly, and line-break points that print nothing.

## Settings

| Item | Use | Not this | Why |
|---|---|---|---|
| Body paragraphs | **Thai Distributed** (Home → Paragraph → Thai Distributed · OOXML `w:jc w:val="thaiDistribute"`) | Left · Justify | Left leaves a ragged right edge, which is worst in two columns. Justify stretches only the few spaces, so it opens holes |
| Headings · captions · one-line items | Leave as they are (centred or left) | Thai Distributed | A short line gets spread out letter by letter |
| Tables · reference list · English blocks | Left (references with hanging indent) | Thai Distributed | Columns of numbers and English text do not need it |
| Spaces in Thai text | Only where Thai prose spaces: end of a sentence, between clauses, between list items, before and after a number or English word, around ๆ, between quoted fragments | Between every phrase "so the line can break" | With Thai Distributed every extra space becomes a visible gap |
| Line-break points | Zero-width space U+200B at Thai word boundaries | A normal space | Prints nothing but lets the line break there |

## Why the zero-width space is needed

Word breaks Thai lines at word boundaries only when the Thai word-breaking dictionary on that machine works. When it does not, a long run of Thai has no break point. The line then ends early and Thai Distributed spreads the letters apart ("ใ น แ ต ่ ล ะ ว ั น"). Writers often "fix" this by typing a space between phrases, which is what makes the text gappy in the first place.

So: remove the phrase spaces, and put U+200B at every Thai word boundary. The text looks the same on every machine, and copy-paste and similarity checkers ignore the character.

## Doing it on a .docx

1. Copy the file to a new version (never overwrite the user's draft)
2. Classify each Thai–Thai space: keep it (sentence end, clause, list, ๆ, quotation) or turn it into U+200B. This is a language judgement made per space, not a regex — a regex cannot tell a sentence end from a phrase gap, because Thai marks both with a space
3. Insert U+200B at word boundaries with a Thai tokenizer (PyThaiNLP `word_tokenize(text, engine="newmm")`) inside the body paragraphs only
4. Set body paragraphs (Thai, at least about 100 characters, not centred) to Thai Distributed. In python-docx: `paragraph.alignment = WD_ALIGN_PARAGRAPH.THAI_JUSTIFY`
5. Change text run by run so bold labels and fonts survive. Then check that, after removing spaces and U+200B, each paragraph has exactly the same characters as before
6. Export to PDF with Word and look at every page. A line with letters spread apart means a break point is still missing there. The usual culprit is a long compound the tokenizer keeps whole (การประมวลผล, ความเชื่อมั่น) right after an English word: add U+200B inside it (การ​ประมวล​ผล) and export again

## Check before sending

- [ ] No visible gap between words inside a phrase
- [ ] No line with letters spread apart
- [ ] Headings, captions and tables keep their own alignment
- [ ] Page count checked — removing spaces usually shortens the paper, which can matter for a page limit
- [ ] The manual or template still wins: if it prescribes a different alignment or font, follow it
