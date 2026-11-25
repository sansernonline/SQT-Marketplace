# skill: principle-proceed-on-reversible-work

Use before asking to continue on undoable work

# principle · proceed on reversible work: if it can be undone, do it

> Every question that stops and waits for an answer is time when both the person and the agent are not working.
> If the work is reversible, doing it and letting them look is faster than asking and waiting.

## Tell them apart

| Reversible: do it now | Irreversible: prepare it in "รออนุมัติ" (awaiting approval) and carry on with the rest |
|---|---|
| Edit a file that has a copy or history (document file · sheet · git) | Edit or delete real data (database · master sheet · the user's files) |
| Draft a document · draft an email or customer reply (not yet sent) · draft a mockup | Send an email, message or post to outsiders |
| Run tests · calculate · try in a copy | Release to the real system (deploy · announce a price · publish) |
| Choose between 2 paths that can be changed later | Pay money · book · accept terms · enter a real secret |
| Move a temporary file to `_to_delete/` | Delete permanently |
| Code: commit on the work branch, when the user allows it | Code: merge into the main branch · force-push |

## Before you ask, pass these three gates

1. **Can an experiment show it?** If the answer is behaviour, speed, looks or output, try a draft (code work: playbook `prototype` in plugin `software-development`) instead of asking.
2. **Is it reversible?** If so, pick the path with the least impact, do it, and note it in [`decision-log`](../decision-log/SKILL.md).
3. **Is it a fact or the user's taste?** Numbers, names, dates and budgets must never be guessed: put `(รอยืนยัน)` (awaiting confirmation) and carry on with the rest. If the brand colour is missing, use that skill's default with `(รอยืนยัน)` and note the stand-in under "ค้างอยู่" (pending) once.

If you pass all 3 gates, do not ask: decide by research + vote (`superuser` `references/autonomy.md`), log it under **ตัดสินใจเอง**, and carry on. For irreversible work, prepare the command, the diff or the draft message in "รออนุมัติ" and do not do it yourself.

**No question at the start either:** a brief that reads several ways → take the reading the evidence supports best (tie → the easiest to undo), say it in line 1, and keep going · questions left go in one list at the end, 0–3, only the kinds in skill `superuser` section 6 → `autonomy`. For a fork that is irreversible, costly or reaches outsiders, use [`flag-and-propose`](../flag-and-propose/SKILL.md).

## What not to do

- Ask "ให้ทำต่อไหม" (shall I continue?) after each step of a job that was already ordered
- Offer a plan and wait for approval when the work is clear and reversible
- Use this principle as an excuse to do things the user did not ask for, because "continue" means finishing the ordered work, not widening the scope yourself


---

# skill: status-report

Use when a task ends, to report status in a table

# Report status when a task ends

> **The one rule:** every time a task ends, there must be a status table in the task's central file, and the same table in the reply.
> A task with no status table is not finished.
> **Exception:** read-only playbooks (`research` · `review` · software-development: `investigation`) put the table in the reply only and write no file.

---

## 1 · Where to write

| Situation | What to do |
|---|---|
| General work (**default**) | `.claude/superuser/CONTEXT.md`. Edit only `## ความคืบหน้า` (progress). The heading `## รับงานต่อ` (take over) belongs to `handoff` section 5, so write it by the rules there. Touch no other heading. If the file does not exist yet, create it from [`templates/CONTEXT.md`](../superuser/templates/CONTEXT.md). |
| The project has `docs/BUILD-PLAN.md` | Use the form in section 3 instead. Write in one place, never duplicate in two. |
| Several subagents work at the same time | Subagents only **report back**. Let the team lead write the file alone, or the file breaks. |

The location and rules of every file are in [`team-files`](../superuser/references/team-files.md).

---

## 2 · The `## ความคืบหน้า` table

```markdown
## ความคืบหน้า
| งาน | สถานะ | หลักฐาน | อัปเดต |
|---|---|---|---|
| สรุปยอดขายเดือนนี้ (`docs/sales-oct.xlsx`) | เสร็จ | ยอดรวมตรงใบสั่งซื้อ 212/212 · `reviewer` ตรวจแล้ว | 2026-10-21 14:20 |
| รายงานคู่แข่ง 5 ราย | ทำอยู่ | อ่านแหล่งทางการครบ 3/5 | 2026-10-21 14:20 |
| ใบเสนอราคาลูกค้า A | รออนุมัติ | ร่างพร้อมใน `out/quote-A.pdf` · ส่งแล้วย้อนไม่ได้ | 2026-10-21 14:20 |
| ค่าส่งต่างประเทศ | ค้างอยู่ | รอผู้ใช้ยืนยันเรทของขนส่ง | 2026-10-21 14:20 |
| ค้นหาสินค้า (โค้ด) | เสร็จ | test 48/48 · `reviewer` ตรวจแล้ว | 2026-10-21 14:20 |
```

The `## รับงานต่อ` heading that sits below it is written by `handoff` section 5 (one format, used both at the end of a task and at hand-over).

- Status uses the same 5 words as `superuser`: `เสร็จ` (done) · `ทำอยู่` (in progress) · `ติด` (blocked) · `รออนุมัติ` (awaiting approval) · `ค้างอยู่` (pending; not started yet also uses `ค้างอยู่`).
- **Evidence is always required** when you write `เสร็จ`: a number that was really checked · how many items were compared · the file name that was opened · the result from `reviewer`. If it was not checked, write `ยังไม่ได้ตรวจ` (not yet checked). Never write that it passed.
- The checker must not be the same one that did the work. If there is a subagent, name its role in the evidence column.
- The table holds only open tasks, at most 15 rows. A finished task moves to 1 line in `HISTORY.md`. Overwrite the whole heading, never append.
- **ค้างอยู่** (pending) is what the agent cannot continue by itself, because a person must answer or decide. Write it as a question that can be answered, and say whom to ask. If there is none, write `ไม่มี` (none).
- **รออนุมัติ** (awaiting approval) is work that is prepared but irreversible (superuser section 6). Give the command or file that is ready to use. If there is none, leave it out.
- **ข้อเสนอ** (proposals, in the reply) are improvements outside the scope, at most 3. Say what is gained and how much effort it takes. If there are none, leave it out.

---

## 3 · The form for a project that has `docs/BUILD-PLAN.md`

Write `## สถานะล่าสุด` (latest status; overwrite) and `## ประวัติสถานะ` (status history; add a line at the top) in that file instead of `CONTEXT.md`. The heading order, columns, allowed values and row ceiling are in [`build-plan-rules`](references/build-plan-rules.md). **Open it before every write.**

---

## 4 · In the reply

Show "ภาพรวม" (overview, if any) + a table of only **the rows that changed this round** + "ค้างอยู่" + "รออนุมัติ" (if any) + "ข้อเสนอ" (if any) + "ถัดไป" (next), then say where the full table lives (`CONTEXT.md` or `docs/BUILD-PLAN.md`). Do not paste the whole file.

---

## 5 · Checklist before saying it is finished

- [ ] Read the central file from disk before editing (someone else may have edited it)
- [ ] The progress table is overwritten, not appended, and has a date and time
- [ ] Every row that says `เสร็จ` or `ผ่าน` (pass) has evidence · the checker is not the doer
- [ ] You did not set `Approved` yourself
- [ ] `## รับงานต่อ` is updated per `handoff` section 5
- [ ] You touched no other heading in the file
- [ ] BUILD-PLAN form: the numbers in "ภาพรวม" match the table · 1 line is added to `## ประวัติสถานะ` · "ทีมตอนนี้" (current team) has no leftover `ทำอยู่` row for a task that has finished
- [ ] BUILD-PLAN form: run the checker until it passes (the checker is in plugin `superuser`): `python <superuser folder>/skills/polished-document-style/scripts/check_outline.py assets/build-plan-status.md <path of docs/BUILD-PLAN.md>`. It catches missing headings, swapped headings, missing bold cells, changed table headers and cells not yet filled. Other headings in the file (the task table, `## ตัดสินใจเอง`) the checker lets pass.
---

## 6 · What not to do

- Do not create a new status file (`STATUS.md` `progress.md`), because status then scatters across places.
- Do not hide failing items in prose, because a reader of the table will think everything passed.
- Do not append to the table every round, and do not let a subagent write the central file.

---

## Project plan and weekly report

The template for a project plan (timeline · milestone · risk register · Responsible-Accountable-Consulted-Informed (RACI)) and the weekly status report sent to stakeholders is in [`references/project-plan-and-weekly-status.md`](references/project-plan-and-weekly-status.md)

## Link to other skills

| Need | Use together with |
|---|---|
| The task table and the code-writing loop in the same file | `spec-to-code-loop` (plugin `software-development`) |
| A project's document set and document status | `project-doc-set` (plugin `software-development`) |
| Recording context to continue in the next conversation | `handoff` |
| The table of self-made decisions in the same file | `decision-log` |
| Choosing a playbook and finishing every kind of task | `superuser` |
| Table and document format | `polished-document-style` |
| Names and status of document files | `document-naming` |


## reference: build-plan-rules.md

# Format for projects that have docs/BUILD-PLAN.md

Moved from `SKILL.md` item 3 · open it when the project has `docs/BUILD-PLAN.md`

Write these 2 sections in that file instead of `CONTEXT.md` · no file → create a file holding only the project name, then copy from [`assets/build-plan-status.md`](../assets/build-plan-status.md) (never invent the structure) · **never touch the job table or other sections**
Section order: `## สถานะล่าสุด` (latest status) → job table → `## ประวัติสถานะ` (status history) → `## ตัดสินใจเอง` (decisions made on your own, `decision-log`)

- `## สถานะล่าสุด` — **overwrite the whole section** every time, as the single current picture
- `## ประวัติสถานะ` — **add 1 line at the very top** per job, never delete the old ones, in the format `วันที่ เวลา · งาน · สถานะ · ผล · ทำ <agent> · ตรวจ <agent> · ค้างกี่ข้อ` (date time · job · status · result · made by <agent> · checked by <agent> · how many items pending; if you decided anything on your own that round, append `· ตัดสินใจเอง <count>`)

Section `## สถานะล่าสุด` holds: an update line (date and time · latest job) · **ภาพรวม** (overview: done N/total · in progress · blocked · failed check — counted from the table and must match) · a table `| รายการ | ประเภท | สถานะ | ใครทำ | ใครตรวจ | ผลตรวจ | ค้าง / หมายเหตุ |` (item · type · status · made by · checked by · check result · pending / note) · **ทีมตอนนี้** (team now: 1 row per agent used this round · no subagent, leave it out · starting a new round clears the old rows) · ค้างอยู่ (pending) · รออนุมัติ (awaiting approval) · ถัดไป (next, at most 3) · ข้อเสนอ (proposals)

| Column | Allowed values |
|---|---|
| ประเภท (type) | `เอกสาร` (document) · `ตรวจ` (check) · `ส่งมอบ` (delivery) · `โค้ด` (code) · `build` |
| สถานะ (status), documents | `ยังไม่เริ่ม` (not started) · `Draft` · `Review` · `Approved` · `Archived` (the same set as `polished-document-style`) — `Approved` belongs only to someone who can change it, and an agent may set at most `Review` |
| สถานะ (status), others | the 5 words in `SKILL.md` item 2 |
| ผลตรวจ (check result) | `ผ่าน — <evidence>` · `ไม่ผ่าน — <what failed>` · `ยังไม่ได้ตรวจ` · `—` |

The table holds every item of the project, not just this round's work (items not touched copy their old values), at most 25 rows
Code work (a full example table · type `build`/`ส่งมอบ` · mobile app evidence) → the extension in plugin `software-development` → `superuser` → `references/code-extensions.md`


## reference: project-plan-and-weekly-status.md

# Project plan and weekly status — stakeholder templates

Template for the agent `project-manager` · moved from the agent file (2026-10-14) · the short status table at the end of a job is in the SKILL.md of `status-report`, while this file holds the project plan and the weekly report for stakeholders

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

**รูปที่ 1 —** ผังเวลาโครงการ วาดด้วย `diagram-figures` (plugin `software-development` · house style) แล้วฝังเป็นไฟล์ภาพ · ไม่ใช้ Mermaid ในแผนที่ส่งผู้เกี่ยวข้อง

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
