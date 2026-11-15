---
name: srs-writing
description: Use when writing a Software Requirements Specification
---

# SRS Writing

> **Language:** write every line of wording by `human-writing` — this skill gives the format and structure, while human-writing says how to write so people can follow.

> **The one rule of this skill:** every requirement must let you write a **test case** from it right away.
> If you cannot, it is not a requirement, just a hope.

---

## When to use this skill

- Writing a Software Requirements Specification (SRS)
- Reviewing an SRS someone else wrote, before signing off
- Turning meeting notes into usable requirements
- Preparing documents for a tender or statement of work (SOW)

## When **not** to use

| Task | Use this instead |
|---|---|
| User stories for a sprint | `user-story-writer` |
| Record of why a technology was chosen | `adr-writer` |
| Screen-level Functional Specification Document (FSD) | `fsd-writing` |
| Look of the exported Word file | `branded-document-design` |
| Figures in the document | `software-diagrams` · `diagram-figures` |

---

## 0 · Find an existing format first (every time)

Before using the structure or template in this file, check whether the user, customer, or project already has its own format:

- **Where to look:** format requirements from the client: TOR (Terms of Reference) · scope of work in the contract · the agency's forms · the earlier SRS of the same system in `docs/` · if there is no file, ask the user one question: does the client require a document format?
- **Result:** found → use that format (headings, order, field names, running numbers) and say in the reply which file it came from · not found → use the template in this file as the fallback and say that no earlier format was found.
- **Every format still needs:** job size sets the depth: a small internal system drops sections that have nothing in them · a system with legal rules or an inspector uses everything the TOR orders · testable requirement IDs are needed in every format.

## 1 · Order of work

1. **Collect all the information before writing** — who uses it · how work is done now · what the problem is ·
   how success is measured · other systems to connect · legal obligations
2. **Draft the outline first** — use `assets/srs-outline.md` to lay out all the headings, no body text yet
3. **Write scope and stakeholders before requirements** — if you do not yet know who uses it, you will write requirements for the wrong person
4. **Write requirements by section 3**, one at a time, and assign the ID as soon as you write it
5. **Build the traceability matrix** — every requirement needs a source
6. **Review by section 8** and then send

> Step 5 is the one people skip most, but it is what gives the document real value when a change request arrives

---

## 2 · Document structure

Based on ISO/IEC/IEEE 29148 (the international standard for requirements processes).
The full version, with hints on what each section must contain, is in **`assets/srs-outline.md`**

For the Business Requirements Document (BRD), which is often written before the SRS, use the template in [`references/brd-template.md`](references/brd-template.md)

| # | Section | Answers the question | Can it be skipped |
|---|---|---|---|
| 1 | Introduction · purpose · scope · definitions | What this document covers and does not cover | No |
| 2 | System overview · users · constraints · assumptions | Where the system sits in the world | No |
| 3 | Functional requirements | What the system must be able to do | No |
| 4 | Interface requirements | How it connects to other systems | If it connects to nothing |
| 5 | Non-functional requirements | How fast, how secure | No |
| 6 | Data and business rules | What the data looks like, which rules apply | No |
| 7 | Acceptance criteria | When it counts as done | No |
| 8 | Traceability matrix | Where this requirement came from | No |
| 9 | Appendices · revision history | Who changed what, when | No |

**Section 1.2 Scope must have both "in scope" and "out of scope"** —
in the whole document, the "out of scope" list prevents the most disputes

**2 subsections that ISO 29148 has but we often forget** (idea from jam01/SRS-Template, which states no licence, so it is rewritten in our own words, no text copied)

| Subsection | What to put in | When it is needed |
|---|---|---|
| 2.6 Apportioning of requirements | A table of which release · milestone or subsystem each group of requirements goes to, and which items are **deferred to a later round** — for an item whose destination is not yet known, write "not yet apportioned" and track it as a pending task | More than 1 release or 1 team · matches the `milestone` column of `spec-to-code-loop` |
| 3.6 Systems with AI/ML | 6 items: what the model does and which number measures a pass · where training data comes from, who consented, how it is stored · guardrails (check input · filter output · limit the actions it can take · fallback) · fairness and explainability · points where a person must check before it takes effect · release, monitoring, retraining, and retiring the model | Every system that calls an LLM or has a model — write it together with `llm-engineering` and `pdpa-compliance` |

**Choose sections by project, do not fill every slot just because the template has it** — before writing, declare one line at the very top saying which section is `เขียน` (write) · `ข้าม (เหตุผล)` (skip (reason)) · `ตัดออก` (drop), following this set

| Project | Write in addition to core 1 2 3 5 6 7 8 9 | Can drop |
|---|---|---|
| Internal web or app, no other systems | — | 4 interface · 2.6 · 3.6 |
| Connects to an external API or device | 4 interface (both sides) | 3.6 |
| Multiple releases or teams | 2.6 | 3.6 if no AI |
| Has an LLM or model | 3.6 + the security and personal-data categories in 5 | — |
| Regulated work (finance · health · insurance) | The compliance category in 5 as its own section, citing the law with the date checked | — |

---

## 3 · How to write one requirement

### Mandatory words

| Word | Meaning | Contract effect |
|---|---|---|
| **ต้อง** (shall) | Mandatory | If missing, fails acceptance |
| **ควร** (should) | Recommended | May be absent if the reason is recorded |
| **อาจ** (may) | Optional | May be absent |

**Do not mix "ต้อง" and "จะ" (will)** — pick one word and use it through the whole document

### Sentence form

```
<รหัส> · <ผู้กระทำ> ต้อง <ทำอะไร> <เงื่อนไข/ขีดจำกัดที่วัดได้>
```

```
ผิด: ระบบต้องค้นหาได้เร็ว
ผิด: ระบบต้องใช้งานง่ายและรองรับผู้ใช้จำนวนมาก
ถูก: FR-SRCH-010 · ระบบต้องคืนผลการค้นหาคำสั่งซื้อภายใน 2 วินาที
   เมื่อฐานข้อมูลมีคำสั่งซื้อไม่เกิน 500,000 รายการ
```

### Seven rules

1. **1 requirement per item** — when you see the word "and" (และ), suspect it should be split into 2 items
2. **Always name the actor**, such as "the system" (ระบบ) · "the approver" (ผู้อนุมัติ) · "the scheduled job" (งานตามเวลา); never write a sentence with no subject
3. **Numbers instead of adjectives** — "fast" "many" "easy" "stable" must each be converted to a number
4. **Do not state the method** — a requirement says *what must be obtained*, not *how*
   (`ต้องเก็บใน Redis` is wrong · `ต้องคืนผลภายใน 200ms` is right)
5. **No "etc." (เป็นต้น, ฯลฯ) and no "and/or" (และ/หรือ)** — the contractor will always read it as narrowly as possible
6. **Testable** — on reading it you must be able to say at once *how to prove it passes*
7. **No conflict with other items** — after writing, go through and look for items that contradict each other

### How to convert vague words

| Customer says | Ask back | Write down |
|---|---|---|
| "ต้องเร็ว" (must be fast) | How fast, measured where, with how many users | Return results within 2 seconds at the 95th percentile with 200 concurrent users |
| "ใช้ง่าย" (easy to use) | What must a new user be able to do, in how long, without training | A new user creates their first order within 5 minutes without opening the manual |
| "ปลอดภัย" (secure) | Against whom, what must they be unable to do | A user with the "viewer" role must be unable to call an API that changes data, and gets code 403 |
| "รองรับคนเยอะ" (supports many people) | How many at once, which period is heaviest | Supports 500 concurrent users during month-end closing |
| "รายงานครบ" (complete reports) | Which reports, who views them, how often | List them item by item, one report per item |

---

## 4 · IDs and traceability

### ID scheme

```
FR-<โมดูล>-<เลข 3 หลัก>      ข้อกำหนดเชิงหน้าที่    FR-ORD-010
NFR-<หมวด>-<เลข 3 หลัก>      ข้อกำหนดที่ไม่ใช่หน้าที่  NFR-PERF-010
BR-<เลข 3 หลัก>              กฎทางธุรกิจ            BR-020
IF-<ระบบปลายทาง>-<เลข>       ส่วนต่อประสาน           IF-LINE-010
```

**Number in steps of 10** — you can insert items later without renumbering the whole document

**An ID that has been issued must never be reused.** Mark a cancelled item `(ยกเลิก v1.3)` (cancelled v1.3)
in place — do not delete it, or people holding the old document will read different things

### Traceability table

| รหัส | ที่มา | โมดูล | ความสำคัญ | ทดสอบด้วย | สถานะ |
|---|---|---|---|---|---|
| FR-ORD-010 | ประชุม 12 ส.ค. ข้อ 3 | คำสั่งซื้อ | ต้องมี | TC-ORD-001..004 | ตกลงแล้ว |
| NFR-PERF-010 | สัญญา ข้อ 7.2 | ทั้งระบบ | ต้องมี | TC-PERF-001 | ตกลงแล้ว |

- **Every requirement needs a source** — an item with no source is one the team made up, and you must go ask to get an answer
- **Every requirement needs at least 1 test case**
- Priority uses MoSCoW: ต้องมี (Must) · ควรมี (Should) · มีก็ดี (Could) · ไว้ทีหลัง (Won't)
  **If "ต้องมี" (Must) exceeds 60% of the total, the items have not really been prioritised**

**The business-rule (BR) table gets a column "boundary values to test"** — for a rule with a number, write 3 values: below the boundary · at the boundary · over the boundary · and put the boundary numbers in a story's acceptance criteria too (for example ฿9,999 and ฿10,000), because the 3 bugs planted for testing in the training exercise were all at the boundaries (an example from that exercise, not a criterion)

**Two-way traceability** — the table above traces one way, from requirement to source. At the end add a table story | functional requirement (FR) | business rule (BR) and set a pass rule of "nothing dropped": every story must be backed by an FR or BR, and for any that is not, mark it and fix it before sending (example from that exercise: 36 stories, 36/36 covered)

---

## 5 · Non-functional requirements — categories to ask about every time

The categories that hurt most when forgotten are **maintainability** and **backup** —
nobody asks at contract signing, but everyone asks when the system goes down

| Category | Must ask | Example that can be written |
|---|---|---|
| Performance | What is the slowest acceptable, at which percentile | หน้ารายการโหลดภายใน 1.5 วิ ที่ p95 |
| Capacity | How much data grows per year, how many years it will be used | รองรับ 2 ล้านรายการใน 3 ปี |
| Concurrent users | Which period is heaviest, how many people | 500 คน ช่วงปิดยอดสิ้นเดือน |
| Availability | Can it be shut down for maintenance, when | 99.5% ต่อเดือน · ปิดได้คืนวันอาทิตย์ 01:00–03:00 |
| Backup | How far back can it restore, how long does recovery take | สำรองทุกวัน · เก็บ 90 วัน · กู้คืนภายใน 4 ชม. |
| Security | How many permission levels, which data is sensitive · for web apps and APIs, put in NFR-SEC per `security-gate/references/owasp-contract-clause.md` | 4 บทบาท · เลขบัตรประชาชนเข้ารหัสตอนพัก |
| Audit trail | Must we know who changed what, when | บันทึกทุกการเปลี่ยนสถานะ เก็บ 2 ปี |
| Compatibility | Which browsers, mobile or not | Chrome/Edge 2 รุ่นล่าสุด · จอ ≥ 360px |
| Language | 2 languages, currency, time zone | ไทย/อังกฤษ · Asia/Bangkok · พ.ศ. ในรายงาน |
| Maintenance | Who takes over, what is handed over | ส่งมอบซอร์สโค้ด · คู่มือติดตั้ง · อบรม 2 วัน |
| Legal | Which regulations apply | พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) |

Every number must come from the **customer**, not from the document writer.
If the customer does not know, propose a number and **record it as an assumption** in section 2

**Facts the interviewee did not state must never be guessed silently** (for example the time or price of a service · whether discounts can stack · whether travel cost is charged per vehicle or per person). Flag that item "(รอยืนยัน)" (awaiting confirmation), write the assumption used, and give the number of the source question, then summarise in a table at the end of the document: question → assumption → business rule that uses that value (example from that exercise: 20 assumptions A1–A20)

**Every NFR has a "how to measure" column** (for example `scrollWidth ≤ 375` · requests sending images off the device = 0) and put NFRs on "testability" in from the requirements stage: the AI part uses fixed rules (asking the same thing gets the same answer) · a button to reset test data · the system's "today" date can be locked · every button has a label so tools can find it (this is reported from the training exercise, not measured against how much it helps)

---

## 6 · Figures in the document

An SRS with no figures at all makes readers imagine the picture, and each imagines it differently.
**Figures in the SRS itself use one house style:**

| Which figure | Draw with |
|---|---|
| Every figure in the SRS itself (overview · flowchart · sequence · ER · state), whether delivered as markdown, .docx or PDF | `diagram-figures` — sharp image files, placement under your own control, source files kept in the repo so git can track them |
| Quick figures in a README · PR · code note, outside the SRS itself | `software-diagrams` (Mermaid) |

**Every figure in one document must use the same colour theme** — declare the theme at the top of the document per
`polished-document-style` section "ธีมของเอกสาร" (Document theme), and every tool reads values from that one place

Minimum figures to have:

| Section | Figure |
|---|---|
| 2 System overview | C4 level 1 — who the system talks to |
| 2 Users | Table of roles and permissions |
| 3 Functional requirements | Work-flow chart of the main process |
| 3 Complex processes | sequence diagram |
| 6 Data | ER diagram + state diagram of the main document |

---

## 7 · Bilingual documents

- **Choose 1 main language** and put the other in brackets or in a 2nd column — never switch back and forth
- **First time a technical term appears, write Thai (full English name: abbreviation)**, for example ปัญญาประดิษฐ์ (Artificial Intelligence: AI), per the rule "เอกสารภาษาไทย" (Thai-language documents) in `spell-out-abbreviations` · afterwards use the Thai or the abbreviation, one way through the document
- Thai text → `human-writing` `references/thai-grammar.md` section 4, the business register
- **Field names, API names, and status names in the database are always English** even if the document is Thai —
  otherwise people will translate them differently when writing code
- Complete the **glossary** in section 1.3: Thai term · English term · meaning · name in the system
- For fonts and page layout of the Word file, see `branded-document-design`

---

## 8 · Completeness review

Go through the checklist in [`references/review-checklist.md`](references/review-checklist.md) in full before every send (scope · each requirement · category completeness · document)
because items that fail become disputes at acceptance

**Fresh-reader test** after the checklist: have a new agent that gets only the SRS file answer 8–10 questions a developer and QA would ask. An item answered wrong or answered "don't know" is a point to fix. If it has not passed, do not send to the customer → [`references/reader-test.md`](references/reader-test.md)

---

## 9 · Anti-patterns

- **Pasting meeting notes in as requirements** — different form, different level of detail
- **"The system must be easy to use"** — nobody can accept this item
- **Putting already-designed screens into the SRS** — locks the method before all requirements are known
  (screen sketches belong in the FSD)
- **No "out of scope" section** — the number 1 cause of unpaid extra work
- **Every item is "Must"** — means priorities have not been discussed with the customer
- **Non-functional requirements written together as one paragraph** — must be split into items with IDs
- **Numbers the writer made up** without asking the customer and without saying they are assumptions
- **No version number and revision history** — nobody knows whether they hold the latest version
- **Reusing an ID of a cancelled item**
- **Sending a Word file with the default look** — see `branded-document-design`

---

## 10 · Connecting to other skills

| Need | Use together with |
|---|---|
| Look of the exported .docx file | `branded-document-design` |
| Markdown format while drafting | `polished-document-style` |
| Figures in the document (see section 6 for which to choose) | `software-diagrams` · `diagram-figures` |
| Colour theme of the whole document | `polished-document-style` section "ธีมของเอกสาร" (Document theme) |
| Detail at a level a developer can start work from | `fsd-writing` |
| Break into user stories when real work starts | `user-story-writer` |
| Turn requirements into test cases | `test-case-template` |
| Cut unnecessary things out of the document | `simplicity-first` |
| Present the SRS to executives | `presentation-design` |

---

## Abbreviations

Always write the abbreviation in full the first time, then put the abbreviation in brackets — for example Model Context Protocol (MCP)
After that you may use the abbreviation. See the skill `spell-out-abbreviations` for details.
