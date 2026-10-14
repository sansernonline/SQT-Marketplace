# Project plan and weekly status — stakeholder templates

แม่แบบของ agent `project-manager` — ย้ายมาจากตัว agent (2026-10-14) · ตารางสถานะท้ายงานแบบสั้นอยู่ใน SKILL.md ของ `status-report` ส่วนไฟล์นี้คือแผนโครงการและรายงานประจำสัปดาห์ฉบับส่งผู้เกี่ยวข้อง

**สารบัญ:**

- [Standard Output: Polished Project Plan](#standard-output-polished-project-plan)
- [Standard Output: Polished Status Report](#standard-output-polished-status-report)

## Standard Output: Polished Project Plan

```markdown
# 📋 Project Plan: <Project Name>

| | |
|--|--|
| **Project Lead** | @pm-name |
| **Sponsor** | @sponsor |
| **Status** | 🟡 Planning |
| **Start Date** | YYYY-MM-DD |
| **Target End** | YYYY-MM-DD |
| **Budget** | $XX,XXX |

---

## 🎯 Objective

> One-sentence goal that fits in a tweet.

## Scope

| ✅ In Scope | ❌ Out of Scope |
|-------------|-----------------|
| ... | ... |

## 🗓️ Timeline

\`\`\`mermaid
gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Discovery
    Requirements    :a1, 2025-01-01, 14d
    Architecture    :a2, after a1, 7d
    section Build
    Sprint 1        :b1, after a2, 14d
    Sprint 2        :b2, after b1, 14d
    Sprint 3        :b3, after b2, 14d
    section Launch
    UAT             :c1, after b3, 7d
    Go-live         :c2, after c1, 3d
\`\`\`

## 🏁 Milestones

| # | Milestone | Target Date | Owner | Status |
|:-:|-----------|:-----------:|:------|:------:|
| 1 | Requirements approved | YYYY-MM-DD | @ba | ⚪ |
| 2 | Architecture signed off | YYYY-MM-DD | @architect | ⚪ |
| 3 | MVP feature complete | YYYY-MM-DD | @dev-lead | ⚪ |
| 4 | UAT passed | YYYY-MM-DD | @qa | ⚪ |
| 5 | Production launch | YYYY-MM-DD | @devops | ⚪ |

## ⚠️ Risk Register

| ID | Risk | Likelihood | Impact | Score | Mitigation | Owner |
|:--:|------|:----------:|:------:|:-----:|------------|:------|
| R-001 | Payment vendor delay | 🟡 Med | 🔴 High | 6 | Plan B vendor | @architect |
| R-002 | Resource availability | 🟢 Low | 🟡 Med | 2 | Cross-training | @pm |

> 📊 **Score = Likelihood × Impact** (1-9 scale)

## 🔗 Dependencies

| Type | Dependency | Owner | Status |
|------|------------|:------|:------:|
| 🌐 External | Payment gateway API | Vendor X | 🟡 |
| 👥 Internal | Design team availability | @design-lead | 🟢 |
| ⚙️ Technical | New cloud account | @devops | 🟢 |

## 👥 RACI Matrix

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
# 📊 Status Report: <Project> — Week of YYYY-MM-DD

| | |
|--|--|
| **Reporting Period** | YYYY-MM-DD to YYYY-MM-DD |
| **Overall Status** | 🟢 On Track |
| **Health Trend** | 📈 Improving / 📉 Declining / ➡️ Stable |

---

## TL;DR

> 💡 1-2 sentence summary for executives.

## 📊 Status by Track

| Track | Status | Notes |
|-------|:------:|-------|
| Scope | 🟢 | On target |
| Schedule | 🟡 | 3 days behind, recoverable |
| Budget | 🟢 | 65% spent, on track |
| Quality | 🟢 | 0 critical bugs open |
| Team Morale | 🟢 | High |

## ✅ Completed This Period

- ...
- ...

## 🔄 In Progress

| Item | Owner | Due | % Done |
|------|:------|:---:|:------:|
| Feature X | @alice | MM/DD | 75% |
| Feature Y | @bob | MM/DD | 40% |

## ⏸️ Blocked

| Item | Blocker | Owner | Action |
|------|---------|:------|--------|
| ... | Waiting on legal review | @legal | Escalate to CTO |

## 🗓️ Upcoming (Next Period)

- ...

## ⚠️ New Risks / Issues

| Severity | Item | Owner |
|:--------:|------|:------|
| 🔴 | ... | ... |

## 💬 Asks for Stakeholders

- ❓ Decision needed on X by MM/DD
- 👥 Need 1 more QA resource starting next sprint
```
