---
name: postmortem-template
description: Use when writing a blameless post-incident review
---

# Blameless Postmortem Template

> **Language:** write every line per `human-writing`. This skill gives the format and the structure, while human-writing says how to write so a person can follow it.
> ข้อความภาษาไทย → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ ธุรกิจ

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

```markdown
# Postmortem: <Short Incident Title>

**Date of Incident:** YYYY-MM-DD
**Date of Postmortem:** YYYY-MM-DD
**Severity:** SEV1 | SEV2 | SEV3 | SEV4
**Duration:** XX hours XX minutes
**Authors:** <names>
**Status:** Draft | Final

---

## 1. Summary

<3-5 sentences for executives: what happened, impact, what we did, what we learned>

## 2. Impact

- **User-facing:** Yes | No
- **Users affected:** ~XX,XXX (X%)
- **Duration:** XX min
- **Revenue impact:** $XXX (if known)
- **Data loss:** None | Minor | Significant
- **SLA breached:** Yes | No
- **Regulatory implications:** None | <describe> — ข้อมูลส่วนบุคคลรั่ว → `pdpa-compliance` ข้อ 8 (แจ้งสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลภายใน 72 ชั่วโมง เมื่อเข้าเงื่อนไข)

## 3. Timeline

All times in UTC.

| Time | Event |
|------|-------|
| HH:MM | First customer complaint |
| HH:MM | On-call paged by alert |
| HH:MM | Investigation started |
| HH:MM | Root cause identified |
| HH:MM | Mitigation deployed |
| HH:MM | Service restored |
| HH:MM | All clear confirmed |

## 4. What Happened (Detailed)

### Trigger
What set it off? (deploy · config change · traffic spike · dependency outage · scheduled job) — keep separate from the root cause and from how we noticed

### Detection
How was the incident detected? Was it automated alerting or customer report?
- Time to detect (TTD): XX minutes
- Could we have detected faster? How?
- If a person noticed before any alert, name the gap type (adapted from `incident-postmortem` in claude-tag-plugins · opened 2026-11-10): **coverage** = no rule watched it · **late** = a rule exists but fired too slowly · **noise** = it fired and was ignored. The action item fixes that type (new rule · tighter threshold or window · remove or merge noisy alerts) → alert rules in `observability-basics`.

| Measure from first user impact | Minutes |
|---|---|
| Time to detect (TTD) | XX |
| Time to mitigate (impact stops growing) | XX |
| Time to recover (fully back to normal) | XX |

### Investigation
What did we look at? What did we rule out?
- Tools used: ...
- Wrong turns / red herrings: ...

### Mitigation
What stopped the bleeding? (Not necessarily the fix)
- Time to mitigate (TTM): XX minutes

### Resolution
What was the permanent fix?
- Time to resolve (TTR): XX minutes

## 5. Root Cause Analysis

Use **5 Whys** technique:

- Why did the service go down? → Database queries timed out
- Why did queries time out? → Connection pool exhausted
- Why was the pool exhausted? → A new endpoint didn't release connections
- Why didn't it release connections? → Missing `finally` block
- Why wasn't this caught? → No load tests for that endpoint

**Root cause:** <one-sentence statement>

**Contributing factors:**
- ...
- ...

## 6. What Went Well

- Monitoring alerted within X minutes
- Rollback completed quickly thanks to ...
- Team collaboration on Slack was effective
- ...

## 7. What Went Wrong

- Took X minutes longer than needed because ...
- Runbook was outdated
- Required engineer was offline; no backup
- ...

## 8. Where We Got Lucky

- Issue happened during business hours; would have been worse at night
- Customer X didn't notice because they were also having maintenance
- ...

## 9. Action Items

| # | Action | Owner | Type | Priority | Due Date |
|---|--------|-------|------|----------|----------|
| 1 | Add monitoring for X | @alice | Prevent | P1 | YYYY-MM-DD |
| 2 | Update runbook | @bob | Mitigate | P2 | YYYY-MM-DD |
| 3 | Add load test for endpoint (see `load-testing`) | @charlie | Prevent | P1 | YYYY-MM-DD |

**Action types:**
- **Prevent:** stops this from happening again
- **Detect:** catches it sooner if it happens
- **Mitigate:** reduces impact when it happens
- **Process:** improves how we respond

## 10. Lessons Learned

What can other teams learn from this?
- Lesson 1: ...
- Lesson 2: ...

## 11. Supporting Information

- Incident channel: #inc-XXX
- Status page updates: <link>
- Customer communications: <link>
- Graphs / dashboards: <link>
- Related PRs: <links>
```

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
- Action items without owners → never done
- Skipping postmortem because "minor" — near-misses teach us most
- Hiding postmortems — share widely for org learning
- Blame language even when "talking about systems"

### Quick postmortem (SEV3 not repeated · SEV4 · near-miss)

One block in the incident channel or ticket, same day — no meeting. Trigger · Detection · action-item Type are the same words as the full template (แนวคิดจาก Google SRE postmortem example):

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
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.
