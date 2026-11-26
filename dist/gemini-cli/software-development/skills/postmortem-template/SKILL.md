---
name: postmortem-template
description: Use when writing a blameless post-incident review
---

# Blameless Postmortem Template

## When to use this skill

- After any production incident: a full postmortem for SEV1 / SEV2, repeated SEV3, security, customer-facing or data-integrity incidents; a short writeup for any other SEV3 and for SEV4
- After a near-miss that could have been a major incident
- After significant bugs that reached production
- After a security incident

## ไม่ใช้เมื่อ

| งาน | ใช้ตัวนี้แทน |
|---|---|
| The incident is still happening and you need to know what to do now | `incident-runbook-template` |
| An ordinary bug that did not take the real system down | `bug-report-template` |
| Action item "add a load test" (the system went down because of heavy traffic or a full connection pool) | `load-testing` — set p95 and error-rate thresholds · permission gate before firing · smoke test in CI |

## 0 · Look for an existing format first (every time)

Before using the structure or template in this file, check whether the user, customer or project already has its own format:

- **Where to look:** the organisation's incident report format · the severity levels the organisation defines (SEV/P1–P4) · earlier postmortems in `docs/postmortems/` or where the user points
- **Result:** found → use that format (headings, order, field names, numbering) and say in the reply which file's format you used · not found → use the template in this file as a fallback and say that no existing format was found
- **Still required either way:** use the organisation's severity names · the blameless principle, a timeline, and action items with owners are required in every format

## Core Principles

1. **Blameless** — focus on systems and processes, not individuals
2. **Honest** — don't soften facts to protect feelings
3. **Actionable** — every postmortem produces concrete action items
4. **Educational** — others should learn from this

## Severity Levels

| Level | Definition | Response Time |
|-------|-----------|---------------|
| **SEV1** | Total outage, data loss, security breach | Immediate, 24/7 |
| **SEV2** | Major feature down, significant user impact | Within 1 hour |
| **SEV3** | Degraded service, partial impact | Within business hours |
| **SEV4** | Minor issue, no user impact | Next business day |

## Output Template

Open [`references/template.md`](references/template.md) and fill every section of the full template (summary · impact · timeline · detail with TTD/TTM/TTR · 5 Whys · went well/wrong/lucky · action items with type · lessons · supporting info). For a SEV3 not repeated, SEV4 or near-miss use the quick postmortem below instead.

## Blameless Language Guide

| ✗ Blameful | ✓ Blameless |
|------------|--------------|
| "Alice deployed the bug" | "A bug was deployed in PR #123" |
| "Bob should have caught this in review" | "The review process didn't catch this; we should add automated checks" |
| "QA missed this case" | "Our test coverage didn't include this scenario" |
| "Someone forgot to..." | "The process doesn't ensure that..." |
| "Human error" | "The system allowed the mistake to happen" |

## Quality Checklist

- [ ] Timeline includes specific times (not vague "morning of")
- [ ] Root cause goes deep enough (not just "bug in code")
- [ ] Action items have owners AND due dates
- [ ] Action items are tracked in actual ticket system
- [ ] Blameless language throughout
- [ ] Reviewed by someone NOT involved in incident
- [ ] Shared with broader team for learning

## Common Mistakes

- "Lessons learned: be more careful" — not actionable
- Single root cause when there are usually multiple factors
- Skipping postmortem because "minor" — near-misses teach us most

### Quick postmortem (SEV3 not repeated · SEV4 · near-miss)

One block in the incident channel or ticket, same day — no meeting. Trigger · Detection · action-item Type are the same words as the full template:

```markdown
**Quick postmortem:** <title> · SEV3 · YYYY-MM-DD · <XX min>
- Trigger → impact: <what set it off> → <who felt what>
- Detection: <alert | customer | chance> after <XX min>
- Mitigation: <what stopped it> after <XX min> from first impact · recovered after <XX min>
- Root cause: <one sentence>
- Action: <one item> · @owner · Type <Prevent | Detect | Mitigate | Process> · due YYYY-MM-DD
```

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `design-gate/polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.

## References

- [`references/template.md`](references/template.md) — open to write a full postmortem (the full template)
