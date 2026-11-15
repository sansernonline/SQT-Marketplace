# skill: srs-writing

Use when writing a Software Requirements Specification

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


## reference: brd-template.md

# BRD template — stakeholder version (Mode B)

Business Requirements Document (BRD) template, the version sent to stakeholders, for the agent `business-analyst` · format it following `polished-document-style`

**สารบัญ:**

- [Standard Output: Polished BRD (Mode B)](#standard-output-polished-brd-mode-b) — template sections: Executive Summary · Business Objective · Stakeholders · Scope · Business Requirements · Business Rules · Assumptions & Constraints · Open Questions · Process Flow · Sign-off

## Standard Output: Polished BRD (Mode B)

```markdown
# BRD: <Feature Name>

| | |
|--|--|
| **Document Type** | Business Requirements Document |
| **Version** | 1.0 |
| **Status** | Draft |
| **Date** | YYYY-MM-DD |
| **Author** | @ba-name |
| **Reviewer(s)** | @stakeholder |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Objective](#2-business-objective)
3. [Stakeholders](#3-stakeholders)
4. [Scope](#4-scope)
5. [Business Requirements](#5-business-requirements)
6. [Business Rules](#6-business-rules)
7. [Assumptions & Constraints](#7-assumptions--constraints)
8. [Open Questions](#8-open-questions)
9. [Process Flow](#9-process-flow-if-applicable)
10. [Sign-off](#sign-off)

---

## 1. Executive Summary

> **For non-technical readers** — 1 paragraph capturing what, why, and impact.

## 2. Business Objective

| Aspect | Details |
|--------|---------|
| **Problem** | ... |
| **Goal** | ... |
| **Success Metrics** | • Metric 1: target<br>• Metric 2: target |
| **Business Impact** | Revenue / Efficiency / UX |

## 3. Stakeholders

| Role | Name | Interest | Influence | RACI |
|------|------|:--------:|:---------:|:----:|
| Product Owner | @alice | High | High | A |
| End User | @customer | High | Medium | C |
| Engineering | @bob | Medium | High | R |
| Legal | @charlie | Low | Medium | I |

> **RACI:** R=Responsible, A=Accountable, C=Consulted, I=Informed

## 4. Scope

### In Scope
- ...

### Out of Scope
- ...

> **Note:** Out-of-scope items may be addressed in future phases (list each one in Section 8, Open Questions, with its target phase).

## 5. Business Requirements

| ID | Requirement | Priority | Acceptance |
|:---|:------------|:--------:|:-----------|
| BREQ-001 | System shall... | Must | Verified by ... |
| BREQ-002 | System should... | Should | Verified by ... |
| BREQ-003 | System could... | Could | Verified by ... |

> **MoSCoW prioritization:** Must / Should / Could / Won't

## 6. Business Rules

| ID | Rule | Source |
|:---|:-----|:-------|
| BRL-001 | Returns accepted within 14 days of delivery | Return policy |
| BRL-002 | Max discount = 30% per order | Pricing policy |

## 7. Assumptions & Constraints

### Assumptions
- ...

### Constraints
| Type | Constraint |
|------|------------|
| Budget | ฿XX,XXX |
| Timeline | Launch by YYYY-MM-DD |
| Compliance | Personal Data Protection Act (PDPA), Payment Card Industry Data Security Standard (PCI-DSS) |
| Technical | Must integrate with existing Customer Relationship Management (CRM) system |

## 8. Open Questions

| ID | Question | Owner | Due |
|:---|:---------|:------|:---:|
| Q-001 | Which payment gateway? | @alice | MM/DD |
| Q-002 | Refund policy? | @legal | MM/DD |

## 9. Process Flow (if applicable)

[Flowchart: Customer requests → Validate → Process → Notify; invalid → Reject]
(draw it as a house-style figure with `diagram-figures`, not inline Mermaid)

## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| Product Owner | @alice | Pending | — |
| Tech Lead | @bob | Pending | — |
| Compliance | @charlie | Pending | — |
```


## reference: reader-test.md

# Fresh-reader test — for SRS · FSD · BRD before sending to the customer

A checklist says the sections are all there. It does not say the reader understood what we meant. In this method, an agent that never saw the meeting reads the document and answers questions. A wrong answer, or an answer of "don't know", marks a gap in the document. (Adapted from Stage 3 Reader Testing of `doc-coauthoring` in anthropics/skills · viewed 2026-11-10 · not a literal translation)

## Steps

1. **Write 8–10 questions before showing the document to anyone** — questions a developer and QA would really ask, such as "what happens on a double booking of the same time" · "which statuses can be reversed" · "how is the amount rounded" · "who may cancel". Write down the correct answer to each first (from us).
2. **Send to a new agent that gets only the document file** — no chat history, no code, no other files (`handoff` · empty folder). It answers one question at a time and cites the section it used.
3. **Compare with the correct answers** — wrong · answered "don't know" · right but had to guess = 1 gap.
4. **Fix the document at that point, then ask the same question again to another new agent** — do not change the answer to match.
5. **If it fails, do not send to the customer** — it passes when every question is answered right without guessing.

## Thai-specific questions (add at least 2)

- Are years on screens and reports in Buddhist Era (พ.ศ.) or Common Era (ค.ศ.)? Which field is stored as which in the database?
- What format do document numbers (quotations · tax invoices) use, and when does the count restart?

## Bilingual documents

Have a different new agent read the Thai version and the English version, answer the same set of questions, then compare the answers. A difference = the 2 versions do not match.


## reference: review-checklist.md

# SRS completeness review

Use with `srs-writing` section 8. Go through all of it before every send. "Section 5" means the chapter of non-functional requirements in `SKILL.md`.

**Scope**

- [ ] Is there an "ไม่อยู่ในขอบเขต" (out of scope) list?
- [ ] Are the assumptions written down clearly, and who must confirm each one?
- [ ] Are all the other systems to connect to listed, and who owns each one?

**Individual requirements**

- [ ] Does every requirement have an id?
- [ ] Can a test case be written for every requirement?
- [ ] Are any of the words "เร็ว" (fast) "ง่าย" (easy) "เหมาะสม" (suitable) "เสถียร" (stable) "ยืดหยุ่น" (flexible) left over?
- [ ] Are any of "เป็นต้น" (and so on) "ฯลฯ" (etc.) "และ/หรือ" (and/or) left over?
- [ ] Does any requirement state a way of doing it instead of the result?
- [ ] Do any 2 requirements conflict?

**Chapter coverage**

- [ ] Are all 11 chapters in section 5 present (or does the document say which chapter does not apply and why)?
- [ ] Is there a requirement on user permissions?
- [ ] Is there a requirement on migrating old data into the new system?
- [ ] Is there a requirement on reports? (Often forgotten, then it pops up near delivery.)
- [ ] Is there a requirement on notifications? (email · LINE · in-system)
- [ ] Are there acceptance criteria that can be measured?

**Document**

- [ ] Does every requirement have a source in the traceability table?
- [ ] Is "must have" no more than 60%?
- [ ] Is there a revision history with version numbers?
- [ ] Is there a sign-off box with real names and positions?
- [ ] Does the glossary cover every term used in the document?


---

# skill: spell-out-abbreviations

Use when text is heavy with abbreviations or jargon

# Spell Out Abbreviations

> **Language:** follow `human-writing` for the wording of every line. This skill gives the format and structure. `human-writing` says how to write so readers understand.

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

## Common examples

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Key Performance Indicator (KPI) · Service Level Agreement (SLA) ·
Return on Investment (ROI) · Stock Keeping Unit (SKU) · Value Added Tax (VAT) ·
Cash on Delivery (COD) · Objectives and Key Results (OKR) ·
Personally Identifiable Information (PII) · Proof of Concept (POC)

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

# The shape of an answer

This skill gives the shape and structure; every line of wording follows `human-writing` · lives only in plugin `superuser`; other plugins share it through `dependencies`

> **One rule:** whatever structure the content has, the answer uses that shape.
> Comparison → table · connections → figure · one thing → sentences

---

## Pick the shape from signals in the question

The quoted signals are Thai user phrasings; English meanings are in brackets.

| Signal | Shape |
|---|---|
| "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" ("which is better" · "how do they differ" · "what options are there") | **Comparison table** |
| "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" ("what connects to what" · "how does data flow" · "what is the sequence") | **Figure** |
| "มีอะไรบ้าง" ("what are there") when the items are not compared | **Bullet list** |
| "ทำไม" · "แปลว่าอะไร" ("why" · "what does it mean") · one thing with no branches | **Plain sentences** |
| Several numbers that must be seen together | **Table** |
| Steps that must be done in order | **Numbered list** |
| Cannot continue · must wait for something from the user | **Short list: what is blocking → what is needed** |

**The most important signal is having 2 or more "things being compared"**; use a table then,
because in a paragraph the reader must hold the first one in their head while reading the second.

---

## A table that reads easily

- **The first column is the thing being compared**, and the next columns are the aspects compared
- **3–5 columns**; more than that cannot be read in time, and at most 8 rows in a chat answer
- **Every cell must have content** — an empty cell means that column should not exist, or the data is incomplete; if there is no data, write "ไม่มี" (none) plainly · a table where every cell says "it depends" also has no content
- **At most 1 line per cell**; if longer, move it below the table
- **Order rows by weight**: the recommended one or the most used one on top, not alphabetical
- **Column headings are the questions in the reader's head**, not names of academic fields

```
ผิด: | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
ถูก: | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

(Gloss: wrong = "Option | Performance | Complexity" · right = "Option | How fast | Does it need much upkeep".)

**Always close a table with a 1-line conclusion** — a table gives data; it does not say what to choose

---

## When a figure beats a table

Use a figure when **the relationship is the answer** — a table can give properties, but cannot say what connects to what.

| Use a figure | Use a table |
|---|---|
| What connects to what · what sits inside what | Which is better than which, and in what respect |
| A sequence with forks or loops back | A straight sequence of steps with no branches (a numbered list is enough) |
| The same thing in several states | Different things on the same aspects |

In chat, **a small ASCII figure or a short Mermaid is enough** — no need to open a drawing tool

```
กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน
                    │
                    └──▶ ที่เก็บถาวร
```

(Gloss: กล้อง = camera/scanner · รายงาน = report · ที่เก็บถาวร = permanent storage.)

A figure that must be a real file to go into a document or slides uses the figure-drawing skill of that plugin (if there is one)

---

## When sentences beat both

- The answer is shorter than 3 lines — a 2-row table is only decoration and explains nothing
- A question answered "yes" or "no" followed by 1 sentence of reason
- A matter where **the reason matters more than the options** — a table cuts the reason to fit the cell

> A table with one row or 2 short rows means the wrong shape was used · a figure that draws what one sentence can say is the same

---

## When you cannot continue

Whenever you are blocked → list only 2 things: **what is blocking** and **what you need from the user**

- 1 line per item · at most 4 items
- Do not tell the cause at length, do not answer side topics, do not plan the work ahead — wait until you have the thing, then do it
- If there are several paths for the user to choose → each path is 1 item, the easiest on top

```
ผิด: ย่อหน้ายาวเล่าว่า container ใหม่ · โฟลเดอร์ว่าง · OneDrive หาย · แล้ววางแผนแก้ 3 ข้อรอไว้
ถูก: ติดอยู่ 1 เรื่อง:
   - มองไม่เห็นไฟล์ — โฟลเดอร์ที่เชื่อมไว้ว่าง
   ต้องการ 1 อย่าง:
   - แนบ Mockup.html มา หรือบอก path ใหม่
```

(Gloss: wrong = a long paragraph telling that the container is new · the folder is empty · OneDrive is gone · and then planning 3 fixes while waiting · right = "Blocked on 1 thing: cannot see the file — the linked folder is empty. Need 1 thing: attach Mockup.html or give the new path.")

---

## Abbreviations

Abbreviations used in this file · rules for writing abbreviations → `spell-out-abbreviations`

- **ASCII** — American Standard Code for Information Interchange (drawing figures with plain characters)
- **Mermaid** — a language that writes diagrams as text and lets a program draw them
- **DICOM** — Digital Imaging and Communications in Medicine (a standard for medical image files and transfer)
- **API** — Application Programming Interface (the channel through which one program calls another)


---

# skill: temp-file-discipline

Use when a task writes temporary files into a project

# Temporary file discipline

> **One rule:** anything that is not a real work product must live only in `_to_delete/`.
> Never leave it in the project root, and never mix it with work files.

---

## Choose where to put it

| What the file is | Put it in |
|---|---|
| Temporary items of work in the user's project (check images · logs · one-off scripts · run results) | `_to_delete/<task folder>/` at the project root (section "How to use"), so the user can check back later |
| An intermediate step not tied to any project (not working in the user's folder) | The session's workspace |
| A work product the user will keep | The destination folder of that work |

**The project root must hold no temporary files at all.**
- If an agent creates a temporary file and it lands in the root (log · image · trial script), move it into `_to_delete/` right away
- If you are not sure whether the user created or is using that file, do not move it yourself; tell the user
- When running from inside a subfolder (for example the code folder, see `project-bootstrap` in plugin `software-development`), write temporary things to the **project root's** `_to_delete/`, and do not create a nested one

---

## What counts as a temporary file

- A compressed file sent through chat to get files onto the machine, and the folder it was extracted to
- Images rendered to check work · screenshots · sample files made for comparison
- Backup copies of a file being edited · files `.bak` `.old` `.tmp` `ไฟล์ (1).xlsx` (`ไฟล์` = "file")
- Scripts written for one use · log files from a one-time run
- Intermediate-format files during a conversion, such as an `.svg` already converted to `.png`
- **Documents converted to another format to make them easier to read or process** — a `.docx` or `.pdf` converted to `.md`
  The original is the real thing and the converted one is temporary. **Never mix them in the documents folder**,
  or in 3 months nobody knows which file is the version the client signed off
- Old versions of a file that was just replaced

**A file no longer in use is a temporary file** — when you replace an old file with a new one, move the old one into `_to_delete/`
and do not leave them side by side.

---

## What does not count

- A work product the user asked for
- Source files of a work product, such as design files `.psd` `.fig` · a `.py` that produces an image · an `.html` that is the source of an image —
  **if you will edit next year, you need the source file**, so keep it in a subfolder beside the work product, not in `_to_delete/`
- Files the user placed themselves, even if they look like junk — **never move the user's things without asking**
- Output of build tools (`build/` · `node_modules/`) — leave it, check that it is in `.gitignore`, and never move it into `_to_delete/`

---

## How to use

```
โปรเจกต์/
├── ผลงานจริง
└── _to_delete/
    ├── 2026-11-06-login-page-redesign/
    │   ├── screenshots/
    │   ├── logs/
    │   └── transfer.zip
    ├── 2026-11-07-fix-export-bug/
    │   └── logs/
    └── superuser-lock/            ← ของเครื่องมือ ไม่ใช่ของงาน
```

(Gloss: `โปรเจกต์/` = project · `ผลงานจริง` = real work products · `ของเครื่องมือ ไม่ใช่ของงาน` = belongs to the tool, not to a task.)

- There is exactly one `_to_delete/` folder at the **project root** · inside, **1 folder per task**, so things do not mix and a whole task can be deleted at once
- **Task folder name** `YYYY-MM-DD-<topic>` · the date is the day the task started · the topic is lowercase English joined by `-`, 2–5 words, saying what is being done (`2026-11-06-temp-task-folders`, not `2026-11-06-task1`) · sorting by name gives time order directly
- **Create the folder when the task starts**, before writing the first temporary file · a task that continues over several rounds or across sessions uses the same folder (find it with `find _to_delete -mindepth 1 -maxdepth 1 -type d -printf '%f\n'`) · a new topic gets a new folder · when the task is split to sub-agents, they write into the lead's task folder, and the path is given in the brief
- **Never place a file directly in `_to_delete/`** · except things a tool or hook creates itself at a fixed location (`superuser-lock/` · `STOP`) and the delete plan `delete-plan.txt` (the check script requires it directly in `_to_delete/`), which do not move
- **When another skill writes `_to_delete/<x>`** (for example `_to_delete/screenshots/` · `_to_delete/deck-check`), always read it as `_to_delete/<task folder>/<x>` · for a script whose default is `_to_delete/...`, pass `--out` pointing into the task folder
- Standard subfolders **inside the task folder** that other skills use — use only these names:

  | Subfolder | What goes in | Skill that uses it |
  |---|---|---|
  | `drafts/` | Temporary drafts that are not the original (the markdown original that is re-rendered lives permanently at `docs/src/<topic>.md`) | `superuser:document-naming` |
  | `attempts-<topic>/` | Work of each competing agent | [`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md) |
  | `screenshots/` | Rendered images of a design mockup or images for checking work | every design skill |
  | `logs/` | Logs from a one-time run | every skill |

  Code work (`verify-runs/` · `security/` · `check/`) → the addition in plugin `software-development` → `superuser` → `references/code-extensions.md`
- Put `_to_delete/` into `.gitignore` in every project that uses git — check first, and add it if missing
- A project whose README already names another temporary folder (for example `tmp/` `scratch/`) → follow that, then record 1 row in the "การตัดสินใจ" (decisions) table · none named → `_to_delete/` · never use `.cache/` (it belongs to tools and can mix with tool state)

---

## At the end of the work

1. **Say where this task's temporary things are**, in one line (`_to_delete/2026-11-06-login-page-redesign/`), with no long list
2. **Never delete on your own** — delete only when the user orders it; deletion in the user's folder cannot be undone
3. **When the user orders deletion** → move into `_to_delete/` first (per the central rule), then tell the user · actually delete only things inside `_to_delete/` when the user orders it directly, in 3 steps:
   1. Write the plan into the file `_to_delete/delete-plan.txt`, 1 path per line, counted from the project root (`_to_delete/2026-11-06-login-page-redesign`) · to delete a whole task, put the task folder on one line
   2. Run `node <this skill's folder>/scripts/delete-plan-check.mjs _to_delete/delete-plan.txt` → it prints the delete list and the keep list to compare · any path that escapes `_to_delete/` (`..` · full path · a link pointing outside) makes it exit 1, and you must not delete
   3. Only after it passes, delete line by line from the "delete" list; the script does not delete by itself · never build the list from `ls` (on Windows names may end in `/`, see `context-budget` → [`windows-shell`](../context-budget/references/windows-shell.md))
4. **Before saying the work is finished**, run `node <this skill's folder>/scripts/root-check.mjs <project root>` → it lists things in the root outside the allowed list (`ref` `docs` `mockup` `assets` `qa` `_to_delete` `.claude` the code folder, and things in `.gitignore`) · for things the project deliberately keeps in the root, add `--allow README.md,LICENSE`

---

## Anti-patterns

- **Extracting a zip into the project root** and cleaning up later — later never comes
- **Naming files `file-v2` `file-final` `file-really-new`** (Thai: `ไฟล์-v2` `ไฟล์-final` `ไฟล์-ใหม่จริง`) and leaving them beside the original
- **Deleting a user's file because you think it is no longer used**
- **Leaving a project task's temporary files in the session workspace** — after the session ends the user cannot check back
- **Making a new subfolder name for an existing kind of thing** (`shots/` `img-check/`) — use the names in the table above
- **Placing files directly in `_to_delete/` or sharing `screenshots/` across several tasks** — a week later nobody knows which image belongs to which task, and you cannot delete one task alone
- **Keeping a work product's source file in `_to_delete/`** — that is not temporary
- **Leaving stray files without telling anyone** — the user will find them on their own months later

---

Abbreviations and technical terms in messages to the user follow `spell-out-abbreviations`.
