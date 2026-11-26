# Learning round and central queue — details

This file is identical in every plugin. The original lives in plugin `superuser`. For a normal learning round, the summary in `modules` of the core `superuser:superuser` is enough (linked from `SKILL.md` section 9). Open this file when: setting up the team folder for the first time · writing the first `review` line · the final check round fails · the user says "รวมบทเรียน" (merge the lessons).

## End-of-job learning round — `.claude/superuser/learn/`

`IMPROVEMENTS.md` records knowledge found during the work. The learning round looks at where the team went wrong, then proposes changes to the team (skill · playbook · agent · checker · rule).

1. **During the work.** Create the folder `.claude/superuser/` from the first job (inside: `CONTEXT.md` · `log/` · `inbox/` · `learn/` · see [`team-files`](team-files.md) for what gets committed · temporary things go to `_to_delete/`).
   - **The hook logs by itself.** Once this folder exists, the plugin's hook records every action to `.claude/superuser/log/<date>/<agent>.jsonl` (1 file per agent; `main` is the lead and the user's messages) and writes a human-readable summary to `log/SUMMARY.md` each time the lead finishes a round.
   - **User-correction flag.** The hook sets `correction: true` when a user message sounds like a correction (ไม่ใช่ · ผิด · อย่า · บอกแล้ว · แก้ใหม่ — "no" · "wrong" · "don't" · "I told you" · "redo").
   - **The log stays on the user's machine only** and secrets are already stripped. Old projects that have `.superuser/` at the root can still be read by the hook; move it into `.claude/superuser/` when convenient.
   - **The user changes direction** → record 1 row in the decision log (the "การตัดสินใจ" (decisions) table in `CONTEXT.md`, or `decision-desk/decision-log` in `docs/BUILD-PLAN.md`). The reason field starts with `ผู้ใช้แก้ —` (user corrected —).
   - **Dispatch line.** When the lead sends work to a subagent, the hook also records `role` (agent type) · `role_model` · `spawned_id` (8-character short id), and every subagent line has its own `id`. This tells apart which reviewer round did what, even when the same type writes to the same file.
   - **Review-result line.** The hook does not know the check result, so the lead writes it itself every time it gets a result from a reviewer: 1 line per round, appended to `.claude/superuser/log/<date>/main.jsonl` (writable even if the hook does not run, for example when run from the cloud):
     `{"ts":"<local time in International Organization for Standardization (ISO) 8601 format>","event":"review","agent":"main","task":"<task>","round":2,"by":"<agent type that checked>","by_id":"<short id>","result":"ผ่าน|ไม่ผ่าน","high":0,"mid":4,"low":8,"report":"<report path>"}`
2. **At the end, send a fresh `learning-reviewer` agent (medium tier) together with the `reviewer` for the round expected to be the last** (same message, no separate round).
   - **What to send.** A 5–10 line job summary: goal · size · playbook (chosen, adapted, or self-assembled) · skills used · where the user corrected · the result delivered. This agent will read the log · the decision record · `IMPROVEMENTS.md` · old notes in `.claude/superuser/learn/`, then write `.claude/superuser/learn/<date>-<task>.md`.
   - **Skip.** For a job where the user made no correction and there was no **`ตัดสินใจเอง`** (decided on my own), send the first-round `reviewer` alone first. If it passes → skip and note in the log why it was skipped. If it fails → send `learning-reviewer` with the next round.
   - **The round sent together fails** → use the `learning-reviewer` note as is, do not send again. The lead adds 1 line at the end of the `learn/` file saying how many check rounds in total and the final result.
   - **Lessons dropped along the way.** Whoever finds a lesson at any time drops 1 item as 1 file in `learn/drop/<date>-<short-word>.md` (what happened · evidence · where it should be fixed). Do not judge while writing whether it is worth it — hesitation is what makes lessons get lost. At the end of the job, send this folder to `learning-reviewer` to read together. Duplicate or same-type items merge into one, and used files move to `learn/drop/used/`.
3. **The lead checks the evidence for every item**, then puts items that pass (at most 3) under the heading "ควรปรับทีม" (team should change) in the end-of-job answer. If no item has evidence, omit this heading.
4. **The user reviews item by item (human review).** Ask once, in the end-of-job answer, using a choice-style question tool if there is one (if not, ask them to answer with item numbers). Each item has 3 paths:

   | User chooses | "ควรรวมไหม" (should merge?) field in the central queue | What follows |
   |---|---|---|
   | `รับ + ทำเลย` (accept + do now) | `ควรรวม` (should merge) | The lead opens the playbook [`learn-from-session`](playbook-learn-from-session.md) in that round for this item only, without waiting for the user to say "รวมบทเรียน" |
   | `รับ` (accept) | `ควรรวม` | The user can order it right away, or wait for the next "รวมบทเรียน" · at session start the hook reports how many accepted items are waiting to be merged |
   | `ไม่รับ` (decline) | `ไม่รวม (<the user's reason>)` (do not merge) | Do not propose this again unless there is new evidence · if it is an idea to remember permanently, write 1 file in `out-of-scope/` (template `OUT-OF-SCOPE.md`) · before proposing a new item, match it by idea against the files in that folder first; if found → give the earlier decision instead of proposing again |
   | `ไว้ทีหลัง` (later) or no answer | `ใหม่` (new) | Waits in the queue |

   **Timing.** When sending the answer, record every item in the central queue as `ใหม่` first. Whenever the user answers (this round or the next), the lead edits the existing row per the table. If you can ask with a choice tool before sending the answer, you can record the real value straight away.

   Anything new must get `รับ` before it is created: a new playbook → [`playbook-template`](playbook-template.md) · a new skill or agent → the plugin's skill-writing playbook (if any), otherwise copy the structure from an existing skill or agent in the same branch · a user rule → 1 line in `~/.claude/superuser-style.md`, which works from every project.
5. **Edit the real files.** The user says "รวมบทเรียน" or "reflect" → playbook [`learn-from-session`](playbook-learn-from-session.md). If the user does not say so, the notes wait, and nobody edits a skill.

## The machine's central queue — `~/.claude/superuser/IMPROVEMENTS.md`

Team-change proposals from every project gather in one file, so they can be merged in one go and repeats across projects are visible.

- **When to write.** Every time you record a new row in `IMPROVEMENTS.md` or put a "ควรปรับทีม" item in the end-of-job answer, the lead must also add 1 row to the central queue (start at `ใหม่`, then update to what the user chose in step 4). If the file does not exist, create it from the [template](../templates/improvements-queue.md).
- **The same issue again.** Add to the "ครั้ง" (times) column and append the source in the existing row. Do not add a row.
- **Keep only an index.** Full evidence stays in the project's files. Never put in customer names, personal data, money figures, or secrets.
- **Who merges.** When the user opens SQT-Marketplace and says "รวมบทเรียน", read this queue first, sorted by number of times. When done merging, fill the "รวมแล้ว" (merged) column. While doing other work, never edit a skill on your own.
- Windows: `%USERPROFILE%/.claude/superuser/IMPROVEMENTS.md` · Claude Code may ask for permission the first time it writes outside the work folder; allow only the `~/.claude/superuser/` folder.
- **An old lowercase file** (`improvements.md`) — Windows does not distinguish case, so keep using it · on macOS and Linux, rename it to `IMPROVEMENTS.md` before writing a new row.

The column template and the values used in each field live in one place, the [queue template](../templates/improvements-queue.md).

- **Expected · check date · result after merge.** Every row is a hypothesis: how much the mistakes are expected to drop, and when to check (normally after 5 similar jobs). On the check date, the lead looks at the log and `learn/` of the open projects to see how many times the same mistake happened again (say how many projects were counted), then fills "ผลหลังรวม" (result after merge). Merged and still happened 2 more times → turn it into a checker or roll the fix back, and do not write more warnings.
- **Lessons live at the point of use.** The queue is only a holding place. A merged lesson must end up in a skill, a checker, or a playbook that gets opened during the work, not in a list someone must go and search.
