# SRS structure options, figures, bilingual rules

Open this when choosing which sections to write, adding figures, or writing a Thai/English document.

Structure is based on ISO/IEC/IEEE 29148. The full outline with hints per section is in `assets/srs-outline.md`. For the Business Requirements Document (BRD), written before the SRS, use [`brd-template.md`](brd-template.md).

## Two subsections ISO 29148 has that people forget

(Idea from jam01/SRS-Template, which states no licence, so this is rewritten in our own words.)

| Subsection | What to put in | When it is needed |
|---|---|---|
| 2.6 Apportioning of requirements | A table of which release · milestone or subsystem each group of requirements goes to, and which items are **deferred to a later round**. For an item whose destination is not yet known, write "not yet apportioned" and track it as a pending task | More than 1 release or 1 team · matches the `milestone` column of `spec-to-code-loop` |
| 3.6 Systems with AI/ML | 6 items: what the model does and which number measures a pass · where training data comes from, who consented, how it is stored · guardrails (check input · filter output · limit the actions it can take · fallback) · fairness and explainability · points where a person must check before it takes effect · release, monitoring, retraining, and retiring the model | Every system that calls an LLM or has a model; write it together with `llm-engineering` and `pdpa-compliance` |

## Choosing sections by project

| Project | Write in addition to core 1 2 3 5 6 7 8 9 | Can drop |
|---|---|---|
| Internal web or app, no other systems | none | 4 interface · 2.6 · 3.6 |
| Connects to an external API or device | 4 interface (both sides) | 3.6 |
| Multiple releases or teams | 2.6 | 3.6 if no AI |
| Has an LLM or model | 3.6 + the security and personal-data categories in 5 | none |
| Regulated work (finance · health · insurance) | The compliance category in 5 as its own section, citing the law with the date checked | none |

## Figures

An SRS with no figures makes each reader imagine a different picture.

| Which figure | Draw with |
|---|---|
| Every figure in the SRS itself (overview · flowchart · sequence · ER · state), whether delivered as markdown, .docx or PDF | `diagram-figures` (sharp image files, placement under your own control, source files kept in the repo so git can track them) |
| Quick figures in a README · PR · code note, outside the SRS | `software-diagrams` (Mermaid) |

Every figure in one document uses the same colour theme. Declare the theme at the top per `polished-document-style` section "ธีมของเอกสาร" (Document theme); every tool reads values from that one place.

Minimum figures:

| Section | Figure |
|---|---|
| 2 System overview | C4 level 1 (who the system talks to) |
| 2 Users | Table of roles and permissions |
| 3 Functional requirements | Work-flow chart of the main process |
| 3 Complex processes | Sequence diagram |
| 6 Data | ER diagram + state diagram of the main document |

## Bilingual documents

- Choose 1 main language and put the other in brackets or a 2nd column; never switch back and forth.
- First time a technical term appears, write Thai (full English name: abbreviation), for example ปัญญาประดิษฐ์ (Artificial Intelligence: AI), per the rule "เอกสารภาษาไทย" in `spell-out-abbreviations`. Afterwards use the Thai or the abbreviation, one way through the document.
- Thai text: `human-writing` `references/thai-grammar.md` section 4, the business register.
- Field names, API names, and status names in the database are always English even if the document is Thai; otherwise people translate them differently when writing code.
- Complete the glossary in section 1.3: Thai term · English term · meaning · name in the system.
- Fonts and page layout of the Word file: `branded-document-design`.

## Anti-patterns

- Pasting meeting notes in as requirements (different form, different level of detail).
- Putting already-designed screens into the SRS (screen sketches belong in the FSD).
- Non-functional requirements written together as one paragraph; split into items with IDs.
- No version number and revision history.
- Sending a Word file with the default look (see `branded-document-design`).
- Every item "Must", no "out of scope" section, vague items, invented numbers, reused IDs: covered by the rules in `SKILL.md`.

## Other skills to use together

`polished-document-style` (markdown while drafting) · `fsd-writing` (detail a developer can start from) · `user-story-writer` (break into stories) · `test-case-template` (turn requirements into test cases) · `superuser:simplify` (cut unneeded content) · `presentation-design` (present to executives).
