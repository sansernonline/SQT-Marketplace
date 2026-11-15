---
name: bug-report-template
description: Use when writing up one software defect
argument-hint: <brief description of the bug>
---

# Bug Report Template

> **Language:** write all wording per `human-writing`. This skill gives format and structure; human-writing gives how to write so people can understand.

## Where bug reports live

One file per bug in `qa/bugs/BUG-<NNNN>-<slug>.md` at the project root. Attach screenshots and logs under `qa/bugs/BUG-<NNNN>/` — redact personal data first.

## When to use this skill

- Filing a new bug during testing
- Converting user complaints into bug tickets
- Reproducing an issue and documenting findings

## ไม่ใช้เมื่อ

| Task | Use this instead |
|---|---|
| A pile of bug reports that must be screened, reproduced and grouped first | `bug-inbox-triage`, then use this skill to write each one |
| Writing test cases ahead of time from requirements (no bug yet) | `test-case-template` |
| The live system is down or many users are affected | `incident-runbook-template` during the incident · `postmortem-template` after it |

## 0 · Look for an existing format first (every time)

Before using the structure or templates in this file, check whether the user, the client or the project already has its own format:

- **What to look at:** the form of the issue tracker the project uses: `.github/ISSUE_TEMPLATE/*.yml` or `*.md` · the required fields of Jira / Azure Boards / GitLab that the user names · 2–3 old bug reports in `docs/` or the tracker
- **Result:** if found, use it (headings, order, field names, running numbers) and say in the reply which file the format came from. If not found, use the template in this file as the fallback and say that no existing format was found
- **Every format still needs:** the severity names and criteria of the team, if they have them · the reproduction steps, actual result and expected result, whichever format is used

## Severity vs Priority

These are **different**:

| | Severity | Priority |
|---|----------|----------|
| What it measures | Technical impact | Business urgency |
| Set by | QA (quality assurance) / Engineering | PM (product manager) / PO (product owner) |

| Severity | Definition |
|----------|------------|
| **S1 Critical** | System unusable, data loss, no workaround |
| **S2 High** | Major feature broken, workaround exists |
| **S3 Medium** | Feature partially broken |
| **S4 Low** | Cosmetic, minor inconvenience |

In a review report (the `reviewer` scale): S1–S2 = สูง · S3 = กลาง · S4 = ต่ำ

| Priority | Definition |
|----------|------------|
| **P1** | Fix immediately, block release |
| **P2** | Fix in current sprint |
| **P3** | Fix in next sprint |
| **P4** | Fix when there is time / backlog |

## Output Template

Copy **[`assets/bug-report.md`](assets/bug-report.md)** and fill it in. Do not write the outline from memory.

- Do not add, remove or reorder headings and `**fields:**`. A section marked `<!-- optional -->` may be deleted whole when it does not apply.
- A value you do not know yet → `(รอยืนยัน)`, never a guess and never the template's placeholder.
- Before handing over, run the shared checker until it passes (paths from this skill's folder):

  ```bash
  python <โฟลเดอร์ skill polished-document-style ใน plugin superuser>/scripts/check_outline.py assets/bug-report.md <your bug file>
  ```

  It flags missing or reordered headings, missing fields, changed table headers, and anything still unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option).

## Title Writing Guide

Bad titles:
- "Login broken"
- "Bug in checkout"
- "It doesn't work"

Good titles (action + condition + result):
- "Login fails with 500 error when email contains apostrophe"
- "Checkout total shows NaN when quantity is decimal"
- "Search returns no results for queries longer than 100 chars"

**Formula:** `<Action> + <Condition> + <Unexpected result>`

## Steps to Reproduce Rules

- [ ] Start from a known state (logged out, fresh browser, etc.)
- [ ] Each step is one action
- [ ] Anyone can follow without prior knowledge
- [ ] Include exact data used (not "some user")
- [ ] No skipped steps (even "obvious" ones)
- [ ] Numbered sequentially

## Quality Checklist

Before submitting:

- [ ] Title clearly summarizes the issue
- [ ] Severity set · priority set, or `(รอยืนยัน)` until the PM/PO sets it
- [ ] Steps are reproducible by someone else
- [ ] Expected and actual results clearly differ
- [ ] At least one piece of evidence attached
- [ ] Environment info complete
- [ ] Searched for duplicates first
- [ ] `check_outline.py` passes

## Anti-patterns

- "Same as last week's bug" — describe it fully
- Multiple bugs in one report — split them
- "Bug" without steps — give steps to reproduce
- Putting a proposed fix in the title — the developer decides the fix
- Marking everything as P1 — be honest about priority

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks**.
Load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `diagram-figures` for project documents (`software-diagrams` only for README / PR notes) |

Default formatting is not neutral. It looks like unfinished work.

## เรียกเป็นคำสั่ง

`/software-development:bug-report-template <brief description of the bug>`

> **Shortcut into SuperUser:** open the `superuser` skill with the `bug-fix` playbook and copy the playbook's steps into the todo first. The steps below describe the work format and output of this command. Use them together with the playbook, not instead of it.

Use the `qa-tester` agent to create a complete bug report for: **$ARGUMENTS**

The tester should:

1. Apply the `bug-report-template` skill
2. Gather missing info in one question at the start (unknown → `(รอยืนยัน)`, keep going):
   - Steps to reproduce (exact)
   - Environment details
   - Expected vs actual behavior
   - Frequency
   - Evidence (screenshots, logs)
3. Reproduce once yourself from the reporter's steps before trusting them, and reject these excuses before scoring (idea from trailofbits/skills):
   - "cannot reproduce, so not a bug" → try another environment, data set or timing first, then file as `ทำซ้ำไม่ได้` with what was tried
   - "user did it wrong" → then it is a usability or validation bug, still filed
   - "edge case nobody hits" → count who can hit it; file with the number
   - "already known" → link the existing report; no link, no excuse
4. Assess severity (S1-S4) and propose priority (P1-P4)
5. Identify possible root cause hypothesis if visible
6. Produce final bug report in standard format
7. Suggest related test cases that should be added
