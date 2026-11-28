# playbook · pickup-and-pause — pick up unfinished work · pause so others can take over

Use when: "ทำต่อจากเมื่อวาน" (continue from yesterday) · "ค้างไว้ตรงไหน" (where did we leave off) · taking over from another agent or vendor · "พอก่อน เดี๋ยวมาทำต่อ" (enough for now, I'll continue later)
Result: a status summary checked against the real thing (when picking up) · a "รับงานต่อ" (pick up the work) section in `CONTEXT.md` that someone else can read and start from at once (when pausing)
Main patterns: ReAct · Reflection (`handoff/agent-patterns`)

Code work (branch · sandbox/docker · server · test) → the same playbook in plugin `software-development`

## ขั้นตอน — Steps — picking up (copy into the todo exactly)

Labels kept in Thai because the validator matches them: `ใคร:` = who · `หัวหน้าทีม` = the lead · `ตัวใหม่` = fresh (a new instance) · `ตัวเดิม (ถือ …)` = the same agent, holding something.

1. Read the "รับงานต่อ" section in `CONTEXT.md` · `notes/<plan>.md` (compare the original brief with what the user orders now · use "คำตอบที่ได้แล้ว" (answers already received) instead of asking again) · `ledger/<plan>.md` · messages waiting in `.claude/superuser/inbox/` · handover notes still open in `.claude/superuser/handoff/` (`status` is not `เสร็จ`) · the latest log for what the previous agent really did · ใคร: หัวหน้าทีม
   - Also read the "รอผู้ใช้" (waiting on the user) table in `CONTEXT.md`: a row that already has an answer in the inbox or the latest message → delete the row and start from the work it unlocks.
2. Check (ตรวจ) the real thing, do not trust the notes alone. Check the most recently finished gate according to the tracking file (run tests · open that gate's files) · open the work files · check numbers or data the notes claim · the last file-edit date · (if there is git) `git status` and `git log --oneline -10` · ใคร: `reviewer` ตัวใหม่
3. Write a status summary of no more than 10 lines: what is done · what is left · where it conflicts with the notes · ใคร: หัวหน้าทีม
   - A note that does not match the real thing → rewrite the note to what was seen, or tag `ขัดกัน` when it cannot be checked now (`handoff` section 5 "Flag contradictions").
   - The latest gate's check result does not match the notes → go back and make the earlier gate pass, add a row in "รอผู้ใช้", then continue with other parts · no tracking file for this work is found → start over, do not resume on your own.
4. Claim the item (`รับโดย:` per `handoff` section 5; an item already claimed by someone else → take another), start with "ทำต่อเป็นข้อแรก" (continue first with), then choose or assemble a playbook for the remaining work · ใคร: หัวหน้าทีม

## ขั้นตอน — Steps — pausing (copy into the todo exactly)

1. Bring the piece in progress to a point that can be checked, or roll back to the last checkable point. Do not leave work half-done without saying so · ใคร: ตัวเดิม (ถือ: the piece not yet saved)
2. Things not yet saved permanently (draft files · uncommitted edits): if they cannot be saved properly, copy them to `_to_delete/pause-<date>/` and say so in the report · ใคร: หัวหน้าทีม
3. `superuser/status-report` updates "ความคืบหน้า" (progress) · `decision-desk/decision-log` records decisions not yet recorded · ใคร: หัวหน้าทีม
4. Close completed handover notes (write `Task N: complete` in the plan's ledger) · remove finished items from "รับงานต่อ" (1 line each to `HISTORY.md`) and your own unfinished `รับโดย:` (or mark it `ค้างอยู่`), then rewrite the "รับงานต่อ" section in `CONTEXT.md` through `handoff`: handed over N times (add 1) · continue first with · pieces still open · what to watch out for · ใคร: หัวหน้าทีม · `reviewer` ตัวใหม่ checks against the real thing

Details of notes · ledger · counter are in `handoff` → `team-memory` section 8 · the resume mechanism comes from vsql-extension-builder (no licence stated, take only the mechanism · see 2026-11-10).

## Done when

A person or bot taking over, from any vendor, can read only `CONTEXT.md` and continue the work without asking.
