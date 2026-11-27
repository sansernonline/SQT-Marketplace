
# decision-log — every decision the agent makes itself must be traceable

> An agent may carry on without asking only if a person can come back later, see what it chose, and reverse each decision one by one.

It uses the same file as [`superuser/status-report`](../../../superuser/parts/status-report/guide.md).

## Where to write

Default: the "การตัดสินใจ" (decisions) table in `.claude/superuser/CONTEXT.md` (keep the latest 20 rows, and move older rows to `HISTORY.md` per [`team-files`](../../../superuser/references/team-files.md)).
If the project has `docs/BUILD-PLAN.md`, write under `## ตัดสินใจเอง` (decided on my own) instead. That is the last section of the file (order: `## สถานะล่าสุด` → task table → `## ประวัติสถานะ` → `## ตัดสินใจเอง`). If the section does not exist yet, create it, and add 2 columns before `เลือก`: `งาน` · `เรื่อง`.
A subagent does not write the table itself. It **reports its decisions back**, and the main agent adds them to the table.

```markdown
| วันที่ | เลือก | ไม่เลือก | เหตุผล · หลักฐาน |
|---|---|---|---|
| 2026-10-04 15:40 | ยอดขายเดือนนี้ใช้ไฟล์ส่งออกของร้าน | ยอดจากแอปธนาคาร | ธนาคารรวมค่าส่งและเงินคืน · ไฟล์ร้านตรงใบสั่งซื้อ 212/212 `ตรวจจริง` |
| 2026-10-04 16:05 | รายงานคู่แข่งใช้ราคาจากหน้าเว็บทางการ | ราคาจากรีวิว | รีวิวเก่า 8 เดือน · หน้าทางการ `จากแหล่ง` |
| 2026-10-04 16:20 | เก็บไฟล์แนบบนดิสก์ + path ในฐานข้อมูล | object storage | งานขนาด S · ย้ายทีหลังได้ · ADR-0004 |
```

## When to log

- The user corrects or changes the direction of the work. Start the "เหตุผล · หลักฐาน" (reason · evidence) cell with `ผู้ใช้แก้ —` (user corrected). The agent `learning-reviewer` uses this to find where the user made corrections.
- You choose among several ways that would all work.
- The document does not say, and the agent fills in a value itself.
- Two documents conflict, and you choose to follow one. If it is a checkable fact, follow the one with evidence. If it is a rule or policy of the owner, do not choose yourself: write both sides, mark them `(รอยืนยัน)` (awaiting confirmation), and carry on with the parts that do not depend on this point (`crew-patterns/agent-patterns` section 4 item 9).
- You skip an ordered step or document because it cannot be done or is not needed.
- An experiment or a comparison of options decides it (for example `crew-patterns/parallel-attempts-pick-best`).

**Do not log:** anything a skill or document already orders clearly, and small details that do not change the result (temporary file names · variable names).
**Not here (the user must decide):** anything the agent cannot decide itself and must wait on before continuing that part (an old file, a wrong number, a blocked step) → [`decision-desk/flag-and-propose`](../flag-and-propose/guide.md). This skill records only what the agent decided itself and then carried on.
**Not here (long-lived choices):** a choice that must stand for a long time and that people will later ask about (main vendor · contract form · architecture) → write a separate record such as `architecture` (plugin `software-development`), and add just 1 row to this table pointing to it.

## How to choose when you must decide yourself

Choose the way with the least impact: easy to reverse · edits few files · matches what the documents or repo already use · does not close other options.
**When the criteria conflict** (for example, one way edits few files but does not match the repo's style) and there are 3 or more ways → score instead of guessing. Reversibility is a hard rule, and the other 3 criteria are weighted. Use the template [`templates/score.json`](templates/score.json) and run `node <plugin>/skills/decision-desk/parts/decision-scoring/scripts/decide.mjs score score.json`. In the reason cell, write the scores and the word `นิ่ง` (stable) or `ยังไม่นิ่ง` (not stable). Not stable means the scores are close, which counts as a point whose change affects the work → vote per the next line. For 2 ways or a small point, choose yourself per `voting.md`.
**A point whose change affects the work** is decided by searching and then a vote of 3 agents, per skill `superuser` section 6 → `references/voting.md`. Start the "เหตุผล · หลักฐาน" cell with the vote result, for example `โหวต 2/3 (ต้นทุน ✔ · ความเสี่ยง ✘ · ส่งเร็ว ✔) —` (vote 2/3: cost, risk, fast delivery), then the source.
**The owner's defaults** in `~/.claude/superuser-style.md` (names of people in empty roles · spending policy) can replace asking. Start the reason cell with `ค่าตั้งต้นของเจ้าของ —` (owner's default).
**Remaining facts** (numbers, names, dates, budgets that you cannot look up and that have no default) must never be guessed. Put `(รอยืนยัน)` where they are needed (a value that comes from evidence, such as a number that was `ตรวจจริง`, may be entered with its label). Then write the question under "ค้างอยู่" (pending) in `superuser/status-report`. For work that cannot be undone, prepare the command, the draft email, or the diff under "รออนุมัติ" (awaiting approval) and do not act yourself.

## Row rules

- 1 row per decision. Log it the moment you decide, and never save it all for the end.
- "ไม่เลือก" (not chosen) needs at least 1 option. If there is no other option at all, it is not a decision. An unchosen option must really exist per the evidence, not be made up to fill the cell, because at the end it is shown to the user, who may switch to it later without being asked (skill `superuser` section 6).
- "เหตุผล · หลักฐาน" names the source: file · ADR · measured number. If it is a number, add the label `ตรวจจริง` / `จากแหล่ง` / `อนุมาน`.
- Never delete or edit an old row. If the user disagrees, add a new row at the top. Start its "เหตุผล · หลักฐาน" cell with `ผู้ใช้แก้ — แทนแถว <วันที่>` (user corrected, replaces the row of <date>), then redo only that piece of work. The old row stays so people can see what was chosen before.
- If **the user decides** (for example, accepts a risk that was warned about), log it in the same table, and add a last column `ผู้ตัดสิน` (decided by) with `agent` or `ผู้ใช้` (user). If the table has no such column, it means the agent decided every row.
- You may add a column `ทบทวนเมื่อ` (review when) if you want — a date or event when someone should check that the decision is still right (for example, after the next release · when there are over 100 users).

## In the closing answer

The end of the answer has a section **ตัดสินใจเอง**, showing **every row of this round**, 1 line per row (what was chosen · what was not · why), then pointing to the full table.
If there are more than 15 rows, you may summarize by group (for example "chose 6 data sources"), but you must give the total count and a link to the table, and rows that affect the result strongly must still be shown in full.
