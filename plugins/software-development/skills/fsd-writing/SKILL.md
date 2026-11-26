---
name: fsd-writing
description: Use when writing or reviewing a Functional Specification Document
---

# Writing a Functional Specification Document (FSD)

> For Thai text, use the business register (`human-writing` `references/thai-grammar.md` section 4).

> **The one rule:** An FSD is done when a developer can read it and **write code without guessing or asking**.
> Every point that forces a guess becomes rework after delivery.

## When to use this skill

- Writing an FSD or Functional Spec for a feature, a module, or a whole system
- Expanding a Software Requirements Specification (SRS) or Business Requirements Document (BRD) to a level detailed enough to build from
- Reviewing someone else's FSD, where you must say what is missing
- A developer keeps asking the same questions while building. That means the FSD is incomplete.

Not for: requirements a customer signs off → `srs-writing` · user stories for a sprint → `user-story-writer` · endpoints of one feature → command `/api-design` (system-wide agreements → `api-conventions`) · tables and columns → `database-design`

## Read more when

| File | Open when |
|---|---|
| [references/worked-examples.md](references/worked-examples.md) | You are writing the first use case, screen, state table, or business rule of the document. Open the full examples and copy the format. |
| [references/edge-cases.md](references/edge-cases.md) | You are writing the errors and edge cases section, and when you review before sending, to cover every case. |
| [references/fsd-vs-srs.md](references/fsd-vs-srs.md) | You are unsure whether a piece of content belongs in the SRS or the FSD. Open this comparison table. |
| [references/stakeholder-doc-templates.md](references/stakeholder-doc-templates.md) | You are writing an easy-to-read FSD for stakeholders (Mode B, the same 11 sections as item 3), or you need a reviewer-friendly template for a use case, API endpoint, or data model. |
| [references/figures.md](references/figures.md) | You are planning which section needs which figure type. |
| [references/outline-sections.md](references/outline-sections.md) | You must decide which section can be skipped. Open this table. The full copy-and-fill outline is in [assets/fsd-outline.md](assets/fsd-outline.md). |
| [references/related-skills.md](references/related-skills.md) | The task needs another skill alongside this one, such as figures, API agreements, or test cases. Open it to see which one. |

## 0 · Look for an existing template first (every time)

Before you use the outline or templates in this file, check whether the user, customer, or project already has its own:

- **Where to look:** the FSD (Functional Specification Document) template from the client or the TOR (terms of reference) · an earlier FSD of the same system · the screen spec template the dev team uses (look in `docs/`, or ask the user one question)
- **Result:** Found → use it (sections, order, field names, numbering) and say in the reply which file it came from. Not found → use the template in this file as a fallback and say that no earlier template was found.
- **Still required in every template:** the FSD/SRS boundary in item 1 and linking codes to use cases.

## 1 · How an FSD differs from an SRS — the boundary must be clear

These two documents get mixed up most often. The result is an SRS so long the customer does not read it, and an FSD so shallow that developers must ask.
The SRS says what the system **must be able to do**. The FSD says **how** the system does it. A dimension-by-dimension comparison is in [references/fsd-vs-srs.md](references/fsd-vs-srs.md).

> **An FSD must not create new requirements.** When you find something the SRS does not cover, **add it to the open-questions list**, mark it `(รอยืนยัน)` (awaiting confirmation), and keep working on the rest.
> The item must be added to the SRS first. Do not write it quietly into the FSD.
> An item that shows up in the FSD with no source is one the customer will refuse to pay for at acceptance.

## 2 · Working order

1. Read the whole SRS or BRD first, then **list the items that are still unclear**. Ask once, at the start, as multiple choice. Every option has evidence (skill `superuser` item 6). Ask only about items where different readings would change the whole deliverable (options = the possible readings, citing the item in the SRS/BRD). Mark the rest `(รอยืนยัน)` and keep going.
2. Confirm who the document is for: developers only (**Mode A**, the default), or also a customer who reads it to sign off (**Mode B**: the same 11 sections in the same order, only laid out so a reviewer can read them easily; see [references/stakeholder-doc-templates.md](references/stakeholder-doc-templates.md)).
3. Go use case by use case, not screen by screen. Screens come from use cases, not the other way around.
4. Write the business rules separately first, then refer to them from the steps (item 7).
5. Build the traceability matrix as you go, not at the end.
6. **Draw, then collect questions.** While drawing the sequence diagram, cancellation flow, and ERD, you will find matters the stories and SRS do not answer (for example, whether a course deducts a session at booking or at attendance). Note them at the end of the document as questions with a proposed answer marked `(รอยืนยัน)`. Do not choose for the customer.
7. Review by item 11 before sending.

## 3 · Document outline

There are 11 sections, in this order: Introduction · Users and permissions · Process overview · Use cases · Screen requirements · State diagram · Business rules · Data and integrations · Errors and edge cases · Traceability matrix · Revision history.
You may skip only the screen requirements if there is no screen, and the state diagram if there are no states. The full outline is in **[`assets/fsd-outline.md`](assets/fsd-outline.md)**. The table of the question each section answers is in [references/outline-sections.md](references/outline-sections.md).

## 4 · Use cases — one format across the document

Every use case has a header table (comes from · actor · preconditions · result on success · frequency), followed by tables for the main steps, alternatives, and error cases. The full example UC-ORD-010 is in [references/worked-examples.md](references/worked-examples.md).

**Rules for a use case:**

- **One use case = one user goal**, not one screen.
- Every use case needs at least one **alternative** and one **error case**.
  A use case with only the smooth path is a use case that is not finished.
- The "what the system does next" column must not be empty. An empty cell means nobody has worked out how the system responds.
- **Always re-check preconditions on the server.** Hiding a button is not access control.
- Write it as alternating "user does → system responds", not as a paragraph of narrative.

## 5 · Screen requirements

The full example SC-ORD-020 with its field table is in [references/worked-examples.md](references/worked-examples.md).

**Every screen must specify all 6 things:**

| Required | Detail |
|---|---|
| Field table | Type · required or not · validation rule · **the actual error message** · default value |
| Permission per role | Which role can see · edit · only read · not see at all |
| The five screen states | Empty · loading · error · partial · success (see `ui-craft`) |
| Actions and results | Which button goes where · which button opens a confirmation box |
| Display rules | Date format · decimals for money · rounding · time zone |
| Data source | Which endpoint or table this field comes from |

> **"The actual error message" means the words the user will really see**, not "show a warning message".
> If you leave it out, the developer will invent one, and the system will end up with ten different phrasings.
>
> **Display rules must be written down.** A "total" that does not say how it rounds
> is a bug you will find at month-end reconciliation.

## 6 · State diagram — the point FSDs forget most often

Anything with a "status" (an order, a leave request, a work ticket, a document) needs a table with the columns From · To · Who can do it · Condition · Side effects, and **must not have only a picture**. A sample table is in [references/worked-examples.md](references/worked-examples.md).

**Rules:**

- **A transition not in the table is a transition that must be rejected.** Write a clear "not allowed" row.
  What is forbidden is the hardest thing to test if nobody wrote it down.
- Every state needs an exit, except a final state that is meant to end.
- Side effects on other systems (email, stock, accounting) belong in this table, not hidden in the steps.

## 7 · Business rules separate from the steps

Each rule has a code, a name, the rule text, and a source. A sample BR-030 is in [references/worked-examples.md](references/worked-examples.md).

- **Write each rule in one place**, then cite it by code from everywhere it applies. If you copy it into three places, someday you will miss one when you change it.
- Every rule needs a **source**. A rule with no source is a rule the team made up.
- A rule that changes over time (tax rate, fee) must say **where it is stored**:
  in code, in a settings table, or editable by the system administrator.

## 8 · Errors and edge cases to answer in full

The edge-case table is what the test team will use, and it is what most FSDs lack. It runs from no data, rapid repeated clicks, and two people editing at once, to insufficient permission. Go through every row in [references/edge-cases.md](references/edge-cases.md) and answer every row that touches the feature.

## 9 · Codes and traceability

```
UC-<module>-<3-digit number>      use case              UC-ORD-010
SC-<module>-<3-digit number>      screen requirement    SC-ORD-020
BR-<3-digit number>               business rule         BR-030
```

Use the same system as `srs-writing`: **number in steps of 10**, and **never reuse a code that has been issued**.

| SRS | FSD | Screen | test case | Status |
|---|---|---|---|---|
| FR-ORD-040 | UC-ORD-010 | SC-ORD-020 | TC-ORD-010..014 | Done |
| FR-ORD-040 | UC-ORD-010 · 010-E1 | SC-ORD-020 | TC-ORD-015 | Done |

- **Every use case must trace back to a requirement in the SRS.** If it cannot, someone added a bonus nobody ordered.
- **Every requirement in the SRS must have at least one use case.** If it has none, it was forgotten.
- Alternatives and error cases need their own test cases. Do not count them with the main path.

## 10 · Figures in the document

The table of which section needs which figure type is in [references/figures.md](references/figures.md). The point to remember: a state diagram goes **with the table, not instead of it**.

Every figure in an FSD document (Mode A and Mode B, in markdown and in the file the customer signs off) uses `diagram-figures` in one house style. Screen sketches use `markdown-visuals`.
Mermaid through `software-diagrams` is only for drafts discussed in chat. Do not put it in a delivered document.
**Every figure in one version uses the same color theme**, per `doc-theme` (see `design-gate/polished-document-style`).

## 11 · Completeness review before sending

**Completeness**

- [ ] Every requirement in the SRS has at least one use case
- [ ] Every use case has at least one alternative and one error case
- [ ] Every screen has a field table with all 5 columns, and the five states
- [ ] Everything that has a status has a state transition table, including the "not allowed" rows
- [ ] Every relevant row of the edge-case table in item 8 is answered

**Clarity**

- [ ] No phrase such as "as appropriate", "automatically", or "as needed" without saying what it means
- [ ] Every error message is written as real words, not "show a warning message"
- [ ] Every number has a unit and a source
- [ ] Field names, status names, and endpoint names are in English, matching what the real code will use

**Consistency**

- [ ] The same word means the same thing throughout (there is a glossary)
- [ ] State names match across the diagram, the table, and the use cases
- [ ] No new requirement that is missing from the SRS

> **Final test:** Have one developer who was not in the meeting read it.
> Every question they ask is one gap to fill before sending.

If nobody is free to read it, use a fresh agent that gets only the FSD file. Have it answer 8–10 questions that a developer and QA would ask (for example, "what happens on a duplicate booking?" and "which states can be reversed?"). Fix every answer that is wrong or says "I don't know" before sending. For the method and the Thai-specific questions (B.E. years · document number format), see [`../srs-writing/references/reader-test.md`](../srs-writing/references/reader-test.md).

**Once code exists, compare the FSD with the real code.** Do this when you review the FSD after a build or before taking over a fix.

- Go code by code through item 9. Search the code and tests for use case codes and screen names (`rg -n "UC-0[0-9]+" --glob '!**/node_modules/**' | head -50`). A code that appears nowhere in the code or tests is a gap. Answer whether it is not built yet or built under another name.
- Compare the 3 places that differ most often: field table (item 5) ↔ validation code · state transition table (item 6) ↔ the code that changes state (including "not allowed" rows) · error messages (item 8) ↔ strings in the code.
- Record each difference as a table `| spec:line | file:line | who is right |` and let a person decide. During the review, do not change the FSD to match the code, and do not change the code to match the FSD.
