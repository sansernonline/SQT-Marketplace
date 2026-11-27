# Full postmortem template · postmortem-template

## Contents

- [1. Summary](#1-summary) · [2. Impact](#2-impact) · [3. Timeline](#3-timeline) · [4. What Happened](#4-what-happened-detailed) (Trigger · Detection · Investigation · Mitigation · Resolution) · [5. Root Cause](#5-root-cause-analysis)
- [6. What Went Well](#6-what-went-well) · [7. What Went Wrong](#7-what-went-wrong) · [8. Where We Got Lucky](#8-where-we-got-lucky) · [9. Action Items](#9-action-items) · [10. Lessons Learned](#10-lessons-learned) · [11. Supporting Information](#11-supporting-information)

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
- If a person noticed before any alert, name the gap type: **coverage** = no rule watched it · **late** = a rule exists but fired too slowly · **noise** = it fired and was ignored. The action item fixes that type (new rule · tighter threshold or window · remove or merge noisy alerts) → alert rules in `observability-basics.md`.

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
| 3 | Add load test for endpoint (see `test-automation`) | @charlie | Prevent | P1 | YYYY-MM-DD |

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
