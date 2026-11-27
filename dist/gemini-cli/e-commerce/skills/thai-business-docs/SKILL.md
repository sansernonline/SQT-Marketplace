---
name: thai-business-docs
description: Use when issuing a Thai quotation, invoice, letter, memo or contract
---

# thai-business-docs — quotations, formal letters and contracts

> **One rule:** every field comes from a real fact, and any risky clause is flagged for a Thai lawyer, never removed without saying so.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Issuing a Thai quotation, invoice or receipt | [references/doc-quotation.md](references/doc-quotation.md) |
| Drafting a formal Thai letter or memo | [references/doc-thai-official.md](references/doc-thai-official.md) |
| Drafting or checking a Thai contract | [references/doc-contract-th.md](references/doc-contract-th.md) |

Other files in this folder: `fields-and-example.md` (required fields for each document), `clause-checklists.md`, `chasing-overdue.md`, `script.md`, `templates.md` and `doc-thai-official/templates.md`. Scripts: `scripts/thai-doc-total.mjs`.

## Steps every part shares

1. Pick the document type and check the required fields in `references/fields-and-example.md`.
2. Fill each field from the seller's own data; write `(รอยืนยัน)` for anything missing.
3. Run `scripts/thai-doc-total.mjs` for any total with VAT, so the sums are not typed by hand.

## Check before done

- General information, not legal or tax advice. A Thai lawyer (ทนายความ) reviews every clause marked `[ให้ทนายตรวจ]` before anyone signs.
- A business that is not VAT-registered never shows VAT or the words ใบกำกับภาษี.
- No blank or guessed date on a document; every date is written in full.
- A red-flag clause stays in the draft with its `[ให้ทนายตรวจ]` mark, never removed quietly.
- The company's accountant (นักบัญชี) has the final word on tax documents.

Whole job with several steps → playbook [business-doc](../superuser/references/playbook-business-doc.md).
