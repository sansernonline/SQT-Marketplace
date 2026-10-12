# skill: thesis-writing

Use when writing a thesis, IS or journal paper (วิทยานิพนธ์ · สารนิพนธ์ · บทความวิจัย) — proposal, literature review, chapters, citations, defense.

# Thesis and Paper Writing

The user's research, the user's claims, the user's data. Claude makes the argument clear, the structure tight and every citation real.

## Workflow

1. **Get the rules first.** Ask for the faculty's thesis manual (คู่มือการทำวิทยานิพนธ์) or the journal's author guidelines. They decide the chapter names, citation style, margins, fonts, abstract length and the AI-use policy. Everything in this skill is the default when no manual is given, and the manual wins when it differs
2. **One research question in one sentence.** Write the question, the objectives (วัตถุประสงค์, 2–4 items, each starts with a measurable verb: ศึกษา · เปรียบเทียบ · พัฒนา · ประเมิน) and the hypotheses if any. Every later chapter must trace back to these. If it cannot be said in one sentence, the scope is still too wide
3. **Literature matrix before prose.** Collect sources into the matrix in [references/literature-matrix.md](references/literature-matrix.md): who · year · method · sample · finding · gap. Write chapter 2 from the matrix, grouped by theme, not one paragraph per paper
4. **Outline every chapter as headings plus 1-line claims**, using [references/thesis-structure.md](references/thesis-structure.md). The adviser checks the outline before anyone writes full text. Changing an outline costs minutes; changing 40 pages costs weeks
5. **Draft chapter by chapter**, in the order 3 → 1 → 2 → 4 → 5 → abstract. Method first, because it fixes what the rest may claim. Abstract last, because it summarises what exists
6. **Every paragraph does one job**: topic sentence → evidence with citation → what it means for this study. A paragraph with no citation in chapter 2, or with no number in chapter 4, is usually empty
7. **Citations checked one by one** against the rules in [references/citation-and-integrity.md](references/citation-and-integrity.md). Each reference must exist, be found by DOI, ThaiJO, ThaiLIS or the publisher's page, and actually say what the sentence says
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
- **AI use follows the institution's policy** and is disclosed where the policy or journal asks. Tools cannot be listed as authors (COPE position)
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

Related: `paper-to-practice` (understand someone else's paper), `english-tech-reading` (read long English papers faster), `human-writing` (plain language for everything outside the thesis itself), and `presentation-design` in `software-company` for defense slides.


## reference: citation-and-integrity.md

# Citations and research integrity

## Which style

Use the style in the faculty manual or journal guidelines. When none is given:

| Field | Common style |
|---|---|
| Education, social sciences, business, psychology | APA 7th edition |
| Engineering, computer science | IEEE |
| Medicine, nursing, health sciences | Vancouver |

## APA 7 with Thai sources — the usual Thai-university convention

| Case | In text | Reference list |
|---|---|---|
| Thai author | (สมชาย ใจดี, 2565) — first name and surname, Buddhist year | สมชาย ใจดี. (2565). ชื่อบทความ. *ชื่อวารสาร*, *14*(2), 45–60. |
| English author | (Davis, 1989) — surname only | Davis, F. D. (1989). Perceived usefulness... *MIS Quarterly*, *13*(3), 319–340. https://doi.org/10.2307/249008 |
| 3 or more authors | (สมชาย ใจดี และคณะ, 2565) · (Venkatesh et al., 2003) | List up to 20 authors |
| Order in the list | Thai sources first, then English, each alphabetical (common convention, check the manual) | |

Some universities ask for Thai references to be translated into English as well (รอยืนยัน per university). Use Zotero with the university's citation style file when one exists.

## Verifying a citation — before it goes in

1. Find the source by DOI (doi.org), ThaiJO, ThaiLIS, Google Scholar or the publisher page. Not found = not cited
2. Open it. Check the author names, year, title, volume, issue and pages against the reference entry
3. Find the passage that supports the sentence. If the source does not say it, change the sentence or remove the citation
4. Mark the row in the literature matrix with where it was verified

When Claude suggests a source, it must show the DOI or URL it found it at. A reference written from memory is a guess, and is labelled `(ยังไม่ได้ตรวจ)` until the user or a search confirms it.

## Plagiarism and similarity

- Paraphrase means new sentence structure and new words, plus a citation. Changing a few words is still plagiarism
- Direct quotes: short, in quotation marks, with the page number
- Self-plagiarism: reusing your own published text also needs a citation
- Check in the university's tool before each submission: Turnitin or อักขราวิสุทธิ์ (Akarawisut). Similarity limits differ by university and by chapter (รอยืนยัน)
- A low score does not prove the work is original, and a high score is not always plagiarism (references and standard phrases match). Read the matching passages, not only the percentage

## Generative AI

- Follow the university's and the journal's AI policy. Many require disclosure of how AI tools were used (รอยืนยัน per institution)
- AI tools cannot be authors and cannot take responsibility for the content (COPE position statement on authorship and AI tools, https://publicationethics.org/cope-position-statements/ai-author)
- Never use AI to produce data, results, interview quotes or survey responses. That is fabrication, the most serious kind of research misconduct
- Keep notes on what the tool was used for (outline, language editing, code) so the disclosure can be written honestly

## Research ethics

Studies with human participants need approval from the university's human research ethics committee (คณะกรรมการจริยธรรมการวิจัยในมนุษย์) before collecting data. Personal data collected falls under the PDPA: consent, purpose, storage and deletion are stated in the consent form.


## reference: defense-and-review.md

# Defense (สอบเค้าโครง · สอบปากเปล่า) and journal review

## Slide plan — 20 minutes, about 15–18 slides

| # | Slide | Time |
|---|---|---|
| 1 | Title, name, adviser | 0.5 min |
| 2–3 | Problem and gap — 1 number that shows the problem is real | 2 min |
| 4 | Objectives and research questions | 1 min |
| 5 | Conceptual framework diagram | 1 min |
| 6–8 | Method: design, sample, instruments with IOC and reliability, analysis | 4 min |
| 9–13 | Results: 1 slide per objective, the table reduced to the key numbers | 7 min |
| 14–15 | Discussion: agrees or disagrees with whom, and why | 3 min |
| 16 | Contributions and limitations | 1 min |
| 17 | Recommendations | 0.5 min |

Proposal defenses stop at slide 8 and add the timeline. Slide headlines state the finding ("ความพึงพอใจโดยรวมอยู่ในระดับมาก (x̄ = 4.21)"), not the topic ("ผลการวิจัย"). See `presentation-design` in `software-company` (if installed) for layouts.

## Questions committees often ask — prepare 2–3 sentence answers

- Why this topic, and what is new compared with existing studies?
- Why this sample size and sampling method? Is it representative?
- How were the instruments validated? Who were the experts?
- Why this statistic? Were its assumptions checked (normality, equal variance)?
- This result differs from study X. Why?
- What would you do differently?
- What are the limitations, and how do they affect the conclusions?
- How can the results be used in practice?

## After the defense

List every committee comment in a table: comment · page · what was changed · new page. The adviser signs off on this table before the final submission.

## Response to journal reviewers

| # | Reviewer comment (quoted) | Response | Change in manuscript (page, line) |
|---|---|---|---|
| R1.1 | "The sample size is not justified." | Thank you. We added the G*Power calculation (effect size 0.3, power 0.80, α 0.05 → n = 84). | p. 6, lines 12–18 |
| R1.2 | "Compare with recent studies." | We added 3 studies from 2023–2025 to the discussion. | p. 12, lines 4–20 |

Rules:
- Answer every comment, numbered, even the ones you disagree with
- Disagree politely with evidence: "We respectfully keep X because [reason, citation]"
- Mark changes in the manuscript (highlight or track changes) as the journal asks
- Keep the tone thankful and short. No arguing about the reviewer's competence

## Submission checklist

- Journal scope fits the topic, tier checked (TCI 1/2, Scopus quartile)
- Not a predatory journal: check it is in the TCI or Scopus list, beware of fast acceptance for a fee and spam invitations
- Formatted to the author guidelines (template, word limit, reference style)
- Cover letter: what the paper finds and why it fits this journal, 3–4 sentences
- Not submitted to another journal at the same time


## reference: literature-matrix.md

# Literature matrix

Fill this before writing chapter 2. Keep it in `thesis/literature-matrix.md` or a spreadsheet, and export the same records from Zotero (free) or the university's reference manager.

```markdown
| # | Author (year) | Theme | Question / aim | Method · sample | Key finding | Gap or limitation | Verified at (DOI / URL) | Used in |
|---|---|---|---|---|---|---|---|---|
| 1 | สมชาย ใจดี (2565) | ความพึงพอใจ | | survey · n=400 | | | https://doi.org/... | 2.1, 5 |
| 2 | Davis (1989) | TAM | | | | | https://doi.org/10.2307/249008 | 2.2 |
```

## Rules

- **Verified at** is filled only after opening the source. Empty = `(ยังไม่ได้ตรวจ)` and the row may not be cited
- **Theme** comes from the conceptual framework. A row with no theme is off-topic: drop it
- When 3 or more rows agree, write them as one synthesis sentence with several citations, not three paragraphs
- **Gap** column, read down: the most common gap that this study fills is the thesis's reason to exist. Quote it in chapter 1

## Where to search

| Source | For |
|---|---|
| ThaiJO (thaijo.org) | Thai journal articles, TCI-indexed |
| ThaiLIS digital collection (tdc.thailis.or.th) | Thai theses and dissertations |
| Google Scholar | Wide search, citation counts, "cited by" to find newer work |
| Scopus · Web of Science · IEEE Xplore · PubMed | International peer-reviewed work, via the university library login |
| The university library's database list | Licensed full text |

## From matrix to paragraph (example)

> หลายงานวิจัยพบว่าการรับรู้ประโยชน์มีผลต่อความตั้งใจใช้งานมากกว่าการรับรู้ความง่าย (Davis, 1989; สมชาย ใจดี, 2565; Venkatesh & Davis, 2000) อย่างไรก็ตาม งานส่วนใหญ่ศึกษากลุ่มพนักงานในองค์กร ยังไม่มีงานที่ศึกษากลุ่มผู้สูงอายุในชุมชน ซึ่งเป็นกลุ่มเป้าหมายของงานวิจัยนี้

Topic → combined evidence → the gap → why it matters here.


## reference: thai-academic-language.md

# Academic language — Thai and English

## Thai academic register (ภาษาวิชาการ)

| Avoid | Use instead | Why |
|---|---|---|
| ผม · ดิฉัน · เรา | ผู้วิจัย | Thai theses do not use first person |
| เยอะ · ได้ผลดีมาก · ค่อนข้าง | มาก · ระบุตัวเลข (ค่าเฉลี่ย 4.21) | Spoken words and vague degrees |
| มันทำให้ | ส่งผลให้ · ทำให้ | มัน is spoken Thai |
| เป็นอย่างมาก · อย่างยิ่ง ทุกประโยค | State the size once, with the number | Overused intensifiers |
| ซึ่ง…ที่…ซึ่ง… in one sentence | Split into 2 sentences | Long chained clauses lose the reader |
| การ… ความ… stacked (การดำเนินการในการจัดการ) | The verb itself (จัดการ) | Noun stacking adds words, not meaning |
| ทำการศึกษา · ทำการวิเคราะห์ | ศึกษา · วิเคราะห์ | ทำการ adds nothing |
| ได้รับ…จาก in passive everywhere | Active voice when the actor is known | Clearer who did what |

## Terms

- Thai technical term first, English in brackets the first time: ปัญญาประดิษฐ์ (Artificial Intelligence: AI). Afterwards use one form only
- Use the Royal Society (ราชบัณฑิตยสภา) coinage when one exists. If no accepted Thai term exists, transliterate following the Royal Society rules or keep the English, and do it the same way everywhere
- Numbers: Arabic digits throughout unless the manual asks for Thai digits
- Spacing and alignment of Thai text in Word: see [thai-typesetting.md](thai-typesetting.md)

## Tense

| Part | Thai | English |
|---|---|---|
| Proposal | จะ… (future) | will |
| Method, results (what was done and found) | ได้… / past sense | past tense |
| Established knowledge, what a table shows | present | present tense |

## English academic writing

- One claim per sentence. Lead with the claim, then the evidence
- Hedge exactly as much as the evidence: "suggests" for one study, "shows" for consistent results, never "proves" for statistics
- Prefer verbs to nouns: "we analysed" over "an analysis was performed"
- Cut fillers: "it is important to note that", "in order to", "a number of"
- Active voice is accepted by most journals now (check the guidelines). Use "we" in multi-author papers
- Thai writers' common errors: missing articles (a / the), plural -s, tense switching inside a paragraph, "discuss about", "research" as countable ("researches"), "according to" + own opinion

## Abstract formula (Thai and English versions say the same thing)

1. Purpose — 1 sentence
2. Method — design, sample, instruments, analysis — 2 sentences
3. Results — the key numbers for each objective — 2–3 sentences
4. Conclusion or implication — 1 sentence

No citations, no abbreviations without definition, no claims absent from the body.


## reference: thai-typesetting.md

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


## reference: thesis-structure.md

# Thesis structure — the common Thai 5-chapter layout

Most Thai universities use this layout for วิทยานิพนธ์, สารนิพนธ์ and การค้นคว้าอิสระ (IS). Chapter names and order differ by faculty, so the faculty manual wins.

## Contents

- Front matter
- บทที่ 1 บทนำ (Introduction)
- บทที่ 2 เอกสารและงานวิจัยที่เกี่ยวข้อง (Literature review)
- บทที่ 3 วิธีดำเนินการวิจัย (Methodology)
- บทที่ 4 ผลการวิจัย (Results)
- บทที่ 5 สรุป อภิปรายผล และข้อเสนอแนะ (Conclusion and discussion)
- Proposal = chapters 1–3
- Journal article (IMRaD) mapping

## Front matter

ปก · ใบรับรอง · บทคัดย่อภาษาไทย · Abstract · กิตติกรรมประกาศ · สารบัญ · สารบัญตาราง · สารบัญภาพ · คำอธิบายสัญลักษณ์และคำย่อ

## บทที่ 1 บทนำ

| Section | Must contain | Check |
|---|---|---|
| ความเป็นมาและความสำคัญของปัญหา | Wide context → the specific problem → evidence the problem is real (a number, a citation) → what is not yet known → what this study does | Ends with the gap, not with a promise |
| วัตถุประสงค์ของการวิจัย | 2–4 numbered objectives | Each one is answered by a section of chapter 4 |
| สมมติฐานการวิจัย | Only for quantitative studies that test something | Each one is testable with a named statistic |
| ขอบเขตของการวิจัย | Population, sample, variables, place, period, content | Nothing in chapter 4 lies outside it |
| กรอบแนวคิดการวิจัย | A diagram: independent → dependent variables, or input → process → output | Every box is defined in chapter 2 |
| นิยามศัพท์เฉพาะ | Operational definitions: how each variable is measured in this study | Not a dictionary definition |
| ประโยชน์ที่คาดว่าจะได้รับ | Who gains what | Specific, not "เป็นประโยชน์ต่อผู้ที่สนใจ" |

## บทที่ 2 เอกสารและงานวิจัยที่เกี่ยวข้อง

- Order by theme following the conceptual framework, one theme per variable or concept
- Each theme: definitions from 2–3 sources → theories or models → empirical studies (Thai and international) → a synthesis paragraph (สังเคราะห์) saying what this means for this study
- Ends with a summary of the gap and how the framework was built from the themes
- Recent sources: most should be from the last 5–10 years, except classic theories

## บทที่ 3 วิธีดำเนินการวิจัย

| Section | Must contain |
|---|---|
| รูปแบบการวิจัย | Quantitative · qualitative · mixed · research and development (R&D) · experimental — and why it fits the question |
| ประชากรและกลุ่มตัวอย่าง | Population size, sample size with the formula or table used (for example Yamane, Krejcie & Morgan, G*Power) and the sampling method |
| เครื่องมือที่ใช้ในการวิจัย | Each instrument, how it was built, and its quality: IOC from ≥ 3 experts (keep items ≥ 0.50), reliability (Cronbach's alpha ≥ 0.70) from a try-out group |
| การเก็บรวบรวมข้อมูล | Steps and dates, ethics approval number (เลขรับรองจริยธรรมการวิจัยในมนุษย์) if people are involved |
| การวิเคราะห์ข้อมูล | Each objective → the statistic or analysis that answers it, and the interpretation criteria (เกณฑ์แปลความหมาย) |

Software or system theses (R&D) add: requirements, design, development tools, testing method, and evaluation (efficiency by experts, satisfaction by users).

## บทที่ 4 ผลการวิจัย

- One section per objective, in the same order as chapter 1
- Each section: a table or figure → 1–3 sentences stating what it shows with the numbers → no explanation of why (that is chapter 5)
- Table titles above tables, figure titles below figures (common Thai rule, check the manual)
- Report statistics in full: mean, SD, test statistic, df, p-value, effect size where relevant

## บทที่ 5 สรุป อภิปรายผล และข้อเสนอแนะ

| Section | Rule |
|---|---|
| สรุปผล | Answer each objective in 1 short paragraph, with the key number |
| อภิปรายผล | Each finding → agrees or disagrees with which earlier studies → why that could be → what it means. This is where the thesis shows thinking |
| ข้อเสนอแนะ | 2 kinds: for applying the results, and for future research. Each follows from a finding, not a generic wish |

## Proposal (เค้าโครงวิทยานิพนธ์) = chapters 1–3

Write chapters 1–3 in the future tense ("ผู้วิจัยจะ…"), add a timeline (Gantt by month) and the budget if required. After approval, change the tense to past and update anything that changed in the field.

## Journal article (IMRaD) mapping

| Article section | Comes from |
|---|---|
| Introduction | Chapter 1 background + the gap from chapter 2, cut to about 1 page |
| Methods | Chapter 3, only what is needed to repeat the study |
| Results | Chapter 4, the 3–5 tables that answer the question |
| Discussion | Chapter 5 discussion, compared with the most recent studies |
| Conclusion | 1 paragraph |

Thai programmes often require publication in a TCI tier 1 or 2 journal (or Scopus) before graduation (รอยืนยัน per programme). Check the journal's tier on tci-thailand.org and its scope before formatting.
