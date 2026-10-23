# Project plan and weekly status — stakeholder templates

แม่แบบของ agent `project-manager` — ย้ายมาจากตัว agent (2026-10-14) · ตารางสถานะท้ายงานแบบสั้นอยู่ใน SKILL.md ของ `status-report` ส่วนไฟล์นี้คือแผนโครงการและรายงานประจำสัปดาห์ฉบับส่งผู้เกี่ยวข้อง

**สารบัญ:**

- [Standard Output: Polished Project Plan](#standard-output-polished-project-plan)
- [Standard Output: Polished Status Report](#standard-output-polished-status-report)

## Standard Output: Polished Project Plan

```markdown
# Project Plan: <Project Name>

| | |
|--|--|
| **Project Lead** | @pm-name |
| **Sponsor** | @sponsor |
| **Status** | ทำอยู่ (วางแผน) |
| **Start Date** | YYYY-MM-DD |
| **Target End** | YYYY-MM-DD |
| **Budget** | ฿XX,XXX |

---

## Objective

> One-sentence goal that fits in a tweet.

## Scope

| In Scope | Out of Scope |
|-------------|-----------------|
| ... | ... |

## Timeline

![ผังเวลาโครงการ: Discovery → Build → Launch](figures/fig-01.png)

**รูปที่ 1 —** ผังเวลาโครงการ วาดด้วย `diagram-figures` (plugin `software-company` · house style) แล้วฝังเป็นไฟล์ภาพ · ไม่ใช้ Mermaid ในแผนที่ส่งผู้เกี่ยวข้อง

## Milestones

| # | Milestone | Target Date | Owner | Status |
|:-:|-----------|:-----------:|:------|:------:|
| 1 | Requirements approved | YYYY-MM-DD | @ba | ค้างอยู่ |
| 2 | Architecture signed off | YYYY-MM-DD | @architect | ค้างอยู่ |
| 3 | Minimum Viable Product (MVP) feature complete | YYYY-MM-DD | @dev-lead | ค้างอยู่ |
| 4 | User Acceptance Testing (UAT) passed | YYYY-MM-DD | @qa | ค้างอยู่ |
| 5 | Production launch | YYYY-MM-DD | @devops | ค้างอยู่ |

## Risk Register

| ID | Risk | Likelihood | Impact | Score | Mitigation | Owner |
|:--:|------|:----------:|:------:|:-----:|------------|:------|
| R-001 | Payment vendor delay | Medium | High | 6 | Plan B vendor | @architect |
| R-002 | Resource availability | Low | Medium | 2 | Cross-training | @pm |

> **Score = Likelihood × Impact** (1-9 scale)

## Dependencies

| Type | Dependency | Owner | Status |
|------|------------|:------|:------:|
| External | Payment gateway (Application Programming Interface, API) | Vendor X | ติด |
| Internal | Design team availability | @design-lead | ทำอยู่ |
| Technical | New cloud account | @devops | ทำอยู่ |

## Responsible-Accountable-Consulted-Informed (RACI) Matrix

| Activity | PM | BA | Arch | Dev | QA | DevOps |
|----------|:--:|:--:|:----:|:---:|:--:|:------:|
| Requirements | A | R | C | I | C | I |
| Architecture | A | C | R | C | I | C |
| Implementation | A | I | C | R | C | C |
| Testing | A | I | I | C | R | I |
| Deployment | A | I | C | C | I | R |
```

## Standard Output: Polished Status Report

```markdown
# Status Report: <Project> — Week of YYYY-MM-DD

| | |
|--|--|
| **Reporting Period** | YYYY-MM-DD to YYYY-MM-DD |
| **Overall Status** | On Track |
| **Health Trend** | Improving / Declining / Stable |

---

## สรุปสั้นสำหรับผู้บริหาร (Too Long; Didn't Read, TL;DR)

> 1-2 sentence summary for executives.

## Status by Track

| Track | Status | Notes |
|-------|:------:|-------|
| Scope | On track | On target |
| Schedule | At risk | 3 days behind, recoverable |
| Budget | On track | 65% spent, on track |
| Quality | On track | 0 critical bugs open |
| Team Morale | On track | High |

> **Note:** On track / At risk / Off track คือระดับสุขภาพของแต่ละด้านสำหรับผู้อ่านต่างประเทศ ไม่ใช่สถานะของงาน · สถานะรายการงานใช้ 5 คำกลาง (เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่)

## Completed This Period

- ...
- ...

## In Progress

| Item | Owner | Due | % Done |
|------|:------|:---:|:------:|
| Feature X | @alice | MM/DD | 75% |
| Feature Y | @bob | MM/DD | 40% |

## Blocked

| Item | Blocker | Owner | Action |
|------|---------|:------|--------|
| ... | Waiting on legal review | @legal | Escalate to Chief Technology Officer (CTO) |

## Upcoming (Next Period)

- ...

## New Risks / Issues

| Severity | Item | Owner |
|:--------:|------|:------|
| High | ... | ... |

## Asks for Stakeholders

- Decision needed on X by MM/DD
- Need 1 more QA resource starting next sprint
```
