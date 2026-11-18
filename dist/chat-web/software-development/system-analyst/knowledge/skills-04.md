# skill: answer-shape

Use when an answer needs prose, a table or a diagram

# The shape of an answer — pick prose, table, list or figure from the content

> **One rule:** whatever structure the content has, the answer uses that shape. Comparison → table · connections → figure · one thing → sentences.

## Use when
- Deciding how to lay out an answer: prose, table, list or figure.
- The question compares options, asks what connects to what, or you are blocked and must ask for something.

## Steps
1. Pick the shape from the signal in the question (quoted signals are Thai phrasings; English in brackets):

   | Signal | Shape |
   |---|---|
   | "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" (which is better · how they differ · what options) | **Comparison table** |
   | "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" (what connects to what · how data flows · the sequence) | **Figure** |
   | "มีอะไรบ้าง" (what are there) when the items are not compared | **Bullet list** |
   | "ทำไม" · "แปลว่าอะไร" (why · what does it mean) · one thing with no branches | **Plain sentences** |
   | Several numbers that must be seen together | **Table** |
   | Steps that must be done in order | **Numbered list** |
   | Cannot continue · must wait for something from the user | **Short list: what is blocking → what is needed** |

   Having 2 or more "things being compared" is the strongest signal for a table, because in a paragraph the reader must hold the first one in their head while reading the second.
2. **If you use a table:** the first column is the thing compared, the next columns the aspects · 3–5 columns, at most 8 rows in chat · every cell has content (no data → "ไม่มี"; a table where every cell says "it depends" has no content either) · at most 1 line per cell, longer goes below the table · rows ordered by weight (recommended or most used first, not alphabetical) · column headings are the reader's questions (`เร็วแค่ไหน` · `ต้องดูแลมากไหม`, not `ประสิทธิภาพ` · `ความซับซ้อน`) · always close with a 1-line conclusion.
3. **If the relationship is the answer** (what connects to what, what sits inside what, a sequence with forks or loops, one thing in several states), draw a figure. In chat a small ASCII figure or a short Mermaid is enough (`กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน`). A figure that must be a real file for a document or slides uses that plugin's figure-drawing skill, if there is one.
4. **If the answer is shorter than 3 lines, is yes/no plus 1 sentence of reason, or the reason matters more than the options, use sentences.** A 1–2 row table, or a figure that draws what one sentence can say, is the wrong shape.
5. **If you cannot continue,** list only 2 things: what is blocking, and what you need from the user. 1 line per item, at most 4 items. Do not tell the cause at length, answer side topics or plan ahead. If the user must choose among paths, 1 item per path, easiest first. Example:
   ```
   ติดอยู่ 1 เรื่อง:
      - มองไม่เห็นไฟล์ — โฟลเดอร์ที่เชื่อมไว้ว่าง
      ต้องการ 1 อย่าง:
      - แนบ Mockup.html มา หรือบอก path ใหม่
   ```

## Check before done
- [ ] The shape matches the content's structure (not a table for one thing, not a paragraph for a comparison).
- [ ] Every table has content in every cell and ends with a 1-line conclusion.
- [ ] A blocked answer lists only what is blocking and what is needed.


---

# skill: temp-file-discipline

Use when a task writes temporary files into a project

# Temporary file discipline — keep non-products in `_to_delete/<task folder>/`

> **One rule:** anything that is not a real work product must live only in `_to_delete/`. Never leave it in the project root, and never mix it with work files.

## Use when
- A task creates check images, logs, one-off scripts, backups, extracted zips, converted copies of documents (`.docx`/`.pdf` → `.md`), or replaces a file (the old one is now temporary).
- Finishing work in a project: confirm the root holds no stray files.

Not for: a work product the user keeps (goes in its own destination folder) · intermediate steps not tied to any project (use the session's workspace).

## Steps
1. **Decide what is temporary:** check images, logs, one-off scripts, backups, extracted zips, converted copies, old versions, anything no longer in use. Not temporary: a work product the user asked for · the source file of a work product (keep it in a subfolder beside it) · files the user placed themselves (never move them without asking) · build output (leave it, check `.gitignore`). If unsure whether the user created or uses a file, do not move it; tell the user. Detail: [`references/layout.md`](references/layout.md).
2. **Use one `_to_delete/` at the project root.** From inside a subfolder (such as the code folder), write to the project root's `_to_delete/`; do not nest one. A temporary file that landed in the root: move it into `_to_delete/` right away.
3. **Make a task folder when the task starts**, before the first temporary file: `_to_delete/YYYY-MM-DD-<topic>/` (the day the task started; topic lowercase English joined by `-`, 2–5 words, such as `2026-11-06-temp-task-folders`, not `task1`). A task that spans rounds or sessions reuses its folder; a new topic gets a new folder. Sub-agents write into the lead's task folder; put the path in the brief.
4. **Never place a file directly in `_to_delete/`**, except what a tool or hook creates at a fixed place (`superuser-lock/` · `STOP`) and `delete-plan.txt`.
5. **When another skill writes `_to_delete/<x>`** (such as `_to_delete/screenshots/`), read it as `_to_delete/<task folder>/<x>`. For a script whose default is `_to_delete/...`, pass `--out` pointing into the task folder.
6. **Use only these subfolder names inside the task folder:**

   | Subfolder | What goes in |
   |---|---|
   | `drafts/` | Temporary drafts that are not the original (a re-rendered markdown original lives at `docs/src/<topic>.md`; `superuser:document-naming`) |
   | `attempts-<topic>/` | Work of each competing agent ([`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md)) |
   | `screenshots/` | Rendered mockup images or images for checking work |
   | `logs/` | Logs from a one-time run |

   Code work (`verify-runs/` · `security/` · `check/`) → `superuser` → `references/code-extensions.md` in plugin `software-development`.
7. **Add `_to_delete/` to `.gitignore`** in every git project (check first, add if missing). If the project README already names another temporary folder (`tmp/` `scratch/`), follow it and record 1 row in the "การตัดสินใจ" table. Never use `.cache/`.
8. **At the end of the work,** say where this task's temporary things are in one line (`_to_delete/2026-11-06-login-page-redesign/`), with no long list. Then run `node <this skill's folder>/scripts/root-check.mjs <project root>`. It lists things in the root outside the allowed list (`ref` `docs` `mockup` `assets` `qa` `_to_delete` `.claude` the code folder, and things in `.gitignore`); for things the project keeps in the root on purpose, add `--allow README.md,LICENSE`.
9. **Never delete on your own.** Delete only when the user orders it (deleting in the user's folder cannot be undone). When ordered, move into `_to_delete/` first, tell the user, and actually delete only things inside `_to_delete/` when the user orders that directly:
   1. Write the plan into `_to_delete/delete-plan.txt`, 1 path per line from the project root (a whole task = its folder on one line).
   2. Run `node <this skill's folder>/scripts/delete-plan-check.mjs _to_delete/delete-plan.txt`. It prints the delete list and the keep list to compare. A path that escapes `_to_delete/` (`..` · full path · a link pointing outside) makes it exit 1, and you must not delete.
   3. Only after it passes, delete line by line from the "delete" list. The script does not delete. Never build the list from `ls` (on Windows names may end in `/`; see `context-budget` → [`windows-shell`](../context-budget/references/windows-shell.md)).

## Check before done
- [ ] Every temporary file is under `_to_delete/<task folder>/` using the standard subfolder names.
- [ ] `root-check.mjs` shows nothing unexpected in the root.
- [ ] `_to_delete/` is in `.gitignore`.
- [ ] The reply says where the temporary things are, in one line, and nothing was deleted without the user's order.

## References
- [`references/layout.md`](references/layout.md) — open when unsure whether a file is temporary, or for the example layout and anti-patterns.


## reference: layout.md

# Layout of `_to_delete/` and what counts as temporary

Open when you are unsure whether a file is temporary, or when you need the example layout.

## Example layout

```
โปรเจกต์/
├── ผลงานจริง
└── _to_delete/
    ├── 2026-11-06-login-page-redesign/
    │   ├── screenshots/
    │   ├── logs/
    │   └── transfer.zip
    ├── 2026-11-07-fix-export-bug/
    │   └── logs/
    └── superuser-lock/            ← ของเครื่องมือ ไม่ใช่ของงาน
```

(Gloss: `โปรเจกต์/` = project · `ผลงานจริง` = real work products · `ของเครื่องมือ ไม่ใช่ของงาน` = belongs to the tool, not to a task.)

## What counts as a temporary file

- A compressed file sent through chat to get files onto the machine, and the folder it was extracted to
- Images rendered to check work · screenshots · sample files made for comparison
- Backup copies of a file being edited · files `.bak` `.old` `.tmp` `ไฟล์ (1).xlsx` (`ไฟล์` = "file")
- Scripts written for one use · log files from a one-time run
- Intermediate-format files during a conversion, such as an `.svg` already converted to `.png`
- **Documents converted to another format to make them easier to read or process** (a `.docx` or `.pdf` converted to `.md`). The original is the real thing and the converted one is temporary. Never mix them in the documents folder, or in 3 months nobody knows which file is the version the client signed off
- Old versions of a file that was just replaced. A file no longer in use is a temporary file: when you replace an old file with a new one, move the old one into `_to_delete/` and do not leave them side by side

## What does not count

- A work product the user asked for
- Source files of a work product, such as design files `.psd` `.fig` · a `.py` that produces an image · an `.html` that is the source of an image. If you will edit next year, you need the source file, so keep it in a subfolder beside the work product, not in `_to_delete/`
- Files the user placed themselves, even if they look like junk. Never move the user's things without asking
- Output of build tools (`build/` · `node_modules/`): leave it, check that it is in `.gitignore`, and never move it into `_to_delete/`

## Anti-patterns

- Extracting a zip into the project root and cleaning up later
- Naming files `file-v2` `file-final` `file-really-new` (Thai: `ไฟล์-v2` `ไฟล์-final` `ไฟล์-ใหม่จริง`) and leaving them beside the original
- Leaving a project task's temporary files in the session workspace, so the user cannot check back after the session ends
- Making a new subfolder name for an existing kind of thing (`shots/` `img-check/`)
- Placing files directly in `_to_delete/` or sharing `screenshots/` across tasks
- Leaving stray files without telling anyone


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
