
# Report status when a task ends

> **The one rule:** every time a task ends, there must be a status table in the task's central file, and the same table in the reply.
> A task with no status table is not finished.
> **Exception:** read-only playbooks (`research` · `review` · software-development: `investigation`) put the table in the reply only and write no file.

---

## 1 · Where to write

| Situation | What to do |
|---|---|
| General work (**default**) | `.claude/superuser/CONTEXT.md`. Edit only `## ความคืบหน้า` (progress). The heading `## รับงานต่อ` (take over) belongs to `handoff` section 5, so write it by the rules there. Touch no other heading. If the file does not exist yet, create it from [`templates/CONTEXT.md`](../../templates/CONTEXT.md). |
| The project has `docs/BUILD-PLAN.md` | Use the form in section 3 instead. Write in one place, never duplicate in two. |
| Several subagents work at the same time | Subagents only **report back**. Let the team lead write the file alone, or the file breaks. |

The location and rules of every file are in [`team-files`](../../references/team-files.md).

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
- [ ] BUILD-PLAN form: run the checker until it passes (the checker is in plugin `superuser`): `python <superuser folder>/skills/design-gate/parts/polished-document-style/scripts/check_outline.py assets/build-plan-status.md <path of docs/BUILD-PLAN.md>`. It catches missing headings, swapped headings, missing bold cells, changed table headers and cells not yet filled. Other headings in the file (the task table, `## ตัดสินใจเอง`) the checker lets pass.
---

## 6 · What not to do

- Do not create a new status file (`STATUS.md` `progress.md`), because status then scatters across places.
- Do not hide failing items in prose, because a reader of the table will think everything passed.
- Do not append to the table every round, and do not let a subagent write the central file.

---

## 7 · When the user asks what is pending (`งานค้าง` · `มีอะไรค้าง` · what is left)

The owner wants to clear the list in one reply, so every row says what the owner must do (owner asked 2026-11-26).

1. **Look before you list.** Read `## รับงานต่อ` in `CONTEXT.md`, run `git worktree list` · `git status --porcelain` in the main folder · open PRs and unmerged branches. Drop what is already closed; list nothing from memory.
2. **First line: the verdict**, such as `งานใน git ปิดหมดแล้ว เหลือ 5 เรื่องที่รอคุณ`.
3. **One table, columns exactly** `# · งาน · สถานะ · ต้องให้ทำอะไร`. Rows needing the owner come first, then work you can finish yourself.
   - `ต้องให้ทำอะไร` is one concrete action the owner can do in one reply: a word to type in quotes (`สั่ง "เริ่มรวม skill"` · `ตอบ "คงไว้" หรือ "เอาออก"`), a file or board to open, a budget to approve. Work you can do alone: `ไม่ต้อง ผมทำต่อได้`, then do it unless it needs approval.
   - `สถานะ` says where it stands with the evidence (merged PR · file path · what is not yet run).
4. **Small items** that need no decision go in at most 4 short bullets under the table, not in the table.
5. **Last line: a recommendation**, `แนะนำ: ทำข้อ N ก่อน` with a one-line reason (fastest to clear · unblocks other work · deadline).
6. Number the rows so the owner can answer by number (`ข้อ 2 เอาออก`).

---

## Project plan and weekly report

The template for a project plan (timeline · milestone · risk register · Responsible-Accountable-Consulted-Informed (RACI)) and the weekly status report sent to stakeholders is in [`references/project-plan-and-weekly-status.md`](references/project-plan-and-weekly-status.md)

## Link to other skills

| Need | Use together with |
|---|---|
| The task table and the code-writing loop in the same file | `spec-to-code-loop` (plugin `software-development`) |
| A project's document set and document status | `project-docs` (plugin `software-development`) |
| Recording context to continue in the next conversation | `handoff` |
| The table of self-made decisions in the same file | `decision-desk/decision-log` |
| Choosing a playbook and finishing every kind of task | `superuser` |
| Table and document format | `design-gate/polished-document-style` |
| Names and status of document files | `workspace-rules/document-naming` |
