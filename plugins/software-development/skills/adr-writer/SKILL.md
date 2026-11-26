---
name: adr-writer
description: Use when recording why an architecture choice was made
---

# Architecture Decision Record (ADR) Writer

## When to use this skill

- Choosing between two or more technical options
- Significant change to existing architecture
- Deprecating a technology or pattern
- Documenting "why" for future team members

## 0 · Find the existing format first (every time)

Before using the structure or template in this file, check whether the user, client or project already has its own format:

- **Where to look:** existing ADRs (Architecture Decision Records): `docs/adr/` · `docs/decisions/` · `doc/architecture/decisions/` · `adr/` · the `.adr-dir` file → check the format (Nygard · MADR · Y-statement), the file naming and the latest number.
- **Result:** if found, use that format (headings, order, field names, running number) and say in the reply which file it came from. If not found, use the template in this file as the fallback and say that no existing format was found.
- **Always, whichever format:** continue the number from the latest file. Use the team's existing status names.

## ADR Numbering

- Sequential: ADR-0001, ADR-0002, ...
- Never reuse numbers, even if ADR is superseded
- Save as `docs/decisions/ADR-NNNN-<slug>.md` (see `workspace-rules/document-naming` and `project-doc-set`)
- Keep an index at `docs/decisions/README.md` — one table `| ADR | Decision | Status | Date |` — add a row when an ADR is created and edit the row when its status changes, so nobody has to open 20 files to find the live decisions (idea from wshobson architecture-decision-records)

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
  python <โฟลเดอร์ skill polished-document-style ใน plugin superuser>/scripts/check_outline.py assets/adr.md <your ADR file>
  ```

  It flags missing or reordered headings, missing fields, changed table headers, and anything still unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option).

## Quality Checklist

Before finalizing:

- [ ] Title clearly states the decision (not just the topic)
- [ ] Context explains WHY this decision is needed now
- [ ] At least 2 options considered (even if one is "do nothing")
- [ ] Trade-offs are honest — every choice has downsides
- [ ] Consequences include both positive AND negative
- [ ] Consequences name **one way to confirm the decision is still followed** — a test, a lint or dependency rule, or a review-checklist line (MADR calls this Confirmation); "we will be careful" is not one
- [ ] Could a new team member understand this in 6 months?
- [ ] `check_outline.py` passes

## Anti-patterns

- Writing ADR after implementation is done (write BEFORE)
- Editing accepted ADRs (create new one that supersedes it instead)

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `design-gate/polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `diagram-figures` for project documents (`software-diagrams` only for README / PR notes) |
