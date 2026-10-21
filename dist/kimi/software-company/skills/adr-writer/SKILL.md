---
name: adr-writer
description: Use when recording an architecture decision or why a tech choice was made, or revisiting an ADR.
---

# Architecture Decision Record (ADR) Writer

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

## When to use this skill

- Choosing between two or more technical options
- Significant change to existing architecture
- Deprecating a technology or pattern
- Documenting "why" for future team members

## ADR Numbering

- Sequential: ADR-0001, ADR-0002, ...
- Never reuse numbers, even if ADR is superseded
- Save as `docs/decisions/ADR-NNNN-<slug>.md` (see `document-naming` and `project-doc-set`)

## Status Lifecycle

```
Proposed → Accepted → Deprecated/Superseded
              ↓
           Rejected (if not accepted)
```

## Output Template

Copy **[`assets/adr.md`](assets/adr.md)** and fill it in. Do not write the outline from memory.

- Do not add, remove or reorder headings and `**fields:**`. A section marked `<!-- optional -->` may be deleted whole when it does not apply.
- A value you do not know yet → `(รอยืนยัน)`, never a guess and never the template's placeholder.
- Before handing over, run the shared checker until it passes (paths from this skill's folder):

  ```bash
  python ../polished-document-style/scripts/check_outline.py assets/adr.md <your ADR file>
  ```

  It flags missing or reordered headings, missing fields, changed table headers, and anything still unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option).

## Quality Checklist

Before finalizing:

- [ ] Title clearly states the decision (not just the topic)
- [ ] Context explains WHY this decision is needed now
- [ ] At least 2 options considered (even if one is "do nothing")
- [ ] Trade-offs are honest — every choice has downsides
- [ ] Consequences include both positive AND negative
- [ ] Could a new team member understand this in 6 months?
- [ ] `check_outline.py` passes

## Anti-patterns

- ❌ Writing ADR after implementation is done (write BEFORE)
- ❌ Listing only the chosen option (need real alternatives)
- ❌ Vague titles like "Database Decision" (be specific: "Use PostgreSQL over MongoDB for user data")
- ❌ Skipping "Negative consequences" (every decision has trade-offs)
- ❌ Editing accepted ADRs (create new one that supersedes it instead)

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.
