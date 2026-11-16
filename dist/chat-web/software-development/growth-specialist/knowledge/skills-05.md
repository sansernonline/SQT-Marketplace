# skill: spell-out-abbreviations

Use when text is heavy with abbreviations or jargon

# Spell Out Abbreviations

> **Rule 1:** write every abbreviation in full the first time, with the abbreviation in brackets. After that you may use the abbreviation.
> **Rule 2:** put a short explanation in brackets the first time you use any technical term, so readers from outside the field do not have to guess.

## Format

```
ถูก: Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
ผิด: MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **The first time in each document**, write it in full with the abbreviation in brackets. After that, use the bare abbreviation.
- In a long document split into chapters, write it in full again **the first time in each chapter**, because people often read one chapter at a time.
- If a table or heading has no room, write it in full on the first line of that section instead.
- A document with 5 or more abbreviations must have a **glossary** at the end.

### Thai documents

The first time, write **Thai (English full name: abbreviation)**, for example ปัญญาประดิษฐ์ (Artificial Intelligence: AI). After that, use either the Thai word or the abbreviation, but pick one style for the whole document. This rule is the only place that sets the format. `human-writing` `references/thai-grammar.md` section 5 row 4 follows it.

## Exceptions — no need to expand

Terms the public knows better than the full name: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
and file extensions (`.docx`, `.pptx`). If you are not sure, **expand it**, because expanding too much does no harm, but a reader who does not understand does.

## Technical terms — explain in brackets, not just the abbreviation

Expanding the abbreviation may not be enough if the full name still says nothing. **A term that an outside reader does not know
needs a short explanation in brackets the first time.**

```
ผิด: ใช้ idempotency key กันงานซ้ำ
ถูก: ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

ผิด: ต้องดู cash flow ก่อนกู้
ถูก: ต้องดู cash flow (เงินเข้า-ออกจริงแต่ละเดือน) ก่อนกู้
```

**The explanation must be shorter than 1 line.** If it is longer, make it a sentence of its own.

**Decide which terms need explaining** with one question: could a person who works in a different field from this topic
read it and guess the meaning? If they cannot guess, explain it.

| Reader level | How much to explain |
|---|---|
| Customers, executives, people outside the field | Every technical term, even words engineers use every day |
| The same team but a different area of work | Only the terms specific to that area, such as names of formats and processes |
| People already working on this | Only terms newly coined in this project |

---

## What it applies to

Every kind of document · slides · labels and on-screen text · sales copy · diagram descriptions · code comments ·
chat answers — **anything a person reads**

Code-side abbreviations (RBAC · SSO · CI/CD · SRS · ADR and so on) → the extension in plugin `software-development` → `superuser` → `references/code-extensions.md`

## Anti-patterns

- Expanding the abbreviation every time it appears — cluttered and distracting. The first time is enough.
- Reversed brackets — `MCP (Model Context Protocol)` reads less smoothly than writing the full name first.
- Expanding wrongly — if you do not know what it stands for, look it up first. Do not guess.
- Expanding every abbreviation but leaving technical terms unexplained — `Quadratic Weighted Kappa (QWK)` still helps no one unless you say what the value measures.
- A paragraph-long explanation in brackets — brackets are for short words. If it is long, split it into sentences.


---

# skill: answer-shape

Use when an answer needs prose, a table or a diagram

# The shape of an answer — pick prose, table, list or figure from the content

> **One rule:** whatever structure the content has, the answer uses that shape. Comparison → table · connections → figure · one thing → sentences.

## Use when
- Deciding how to lay out an answer: prose, table, list or figure.
- The question compares options, asks what connects to what, or you are blocked and must ask for something.

## Steps
1. Pick the shape from the signal in the question (quoted signals are Thai phrasings; English in brackets):

   | Signal | Shape |
   |---|---|
   | "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" (which is better · how they differ · what options) | **Comparison table** |
   | "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" (what connects to what · how data flows · the sequence) | **Figure** |
   | "มีอะไรบ้าง" (what are there) when the items are not compared | **Bullet list** |
   | "ทำไม" · "แปลว่าอะไร" (why · what does it mean) · one thing with no branches | **Plain sentences** |
   | Several numbers that must be seen together | **Table** |
   | Steps that must be done in order | **Numbered list** |
   | Cannot continue · must wait for something from the user | **Short list: what is blocking → what is needed** |

   Having 2 or more "things being compared" is the strongest signal for a table, because in a paragraph the reader must hold the first one in their head while reading the second.
2. **If you use a table:** the first column is the thing compared, the next columns the aspects · 3–5 columns, at most 8 rows in chat · every cell has content (no data → "ไม่มี"; a table where every cell says "it depends" has no content either) · at most 1 line per cell, longer goes below the table · rows ordered by weight (recommended or most used first, not alphabetical) · column headings are the reader's questions (`เร็วแค่ไหน` · `ต้องดูแลมากไหม`, not `ประสิทธิภาพ` · `ความซับซ้อน`) · always close with a 1-line conclusion.
3. **If the relationship is the answer** (what connects to what, what sits inside what, a sequence with forks or loops, one thing in several states), draw a figure. In chat a small ASCII figure or a short Mermaid is enough (`กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน`). A figure that must be a real file for a document or slides uses that plugin's figure-drawing skill, if there is one.
4. **If the answer is shorter than 3 lines, is yes/no plus 1 sentence of reason, or the reason matters more than the options, use sentences.** A 1–2 row table, or a figure that draws what one sentence can say, is the wrong shape.
5. **If you cannot continue,** list only 2 things: what is blocking, and what you need from the user. 1 line per item, at most 4 items. Do not tell the cause at length, answer side topics or plan ahead. If the user must choose among paths, 1 item per path, easiest first. Example:
   ```
   ติดอยู่ 1 เรื่อง:
      - มองไม่เห็นไฟล์ — โฟลเดอร์ที่เชื่อมไว้ว่าง
      ต้องการ 1 อย่าง:
      - แนบ Mockup.html มา หรือบอก path ใหม่
   ```

## Check before done
- [ ] The shape matches the content's structure (not a table for one thing, not a paragraph for a comparison).
- [ ] Every table has content in every cell and ends with a 1-line conclusion.
- [ ] A blocked answer lists only what is blocking and what is needed.
