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
