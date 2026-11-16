# playbook · pickup-and-pause — pick up unfinished work · pause so someone else can take over

Use when: "Continue from yesterday" · "Where did we leave off" · taking over from another agent · "That's enough for now, I'll continue later" (covers pstack's `session pickup` · `pause safely` · skill `recall`)
Main skills: `handoff` · `status-report` · `decision-log`

## ขั้นตอน · Steps — pick up (copy into the todo as written)

1. Read `CONTEXT.md` section "รับงานต่อ" (pick up) · pending messages in `.claude/superuser/inbox/` · `docs/BUILD-PLAN.md` (latest status · `ค้างอยู่` (pending) · `ตัดสินใจเอง` (decided on own)) · look at the latest log in `.claude/superuser/log/` to see what the previous instance really did · ใคร: หัวหน้าทีม
2. Look at the real thing, do not trust the notes alone — `git status` · `git log -10` · the current branch · the sandbox that is running (`.sandbox/sandbox.ps1 list`) · whether the latest tests pass · ใคร: `qa-tester` ตัวใหม่
3. Write a summary of the current state in at most 10 lines — what is done · what is pending · where it conflicts with the notes (rewrite each conflicting note to what was seen, or tag `ขัดกัน` per `handoff` section 5) · ใคร: หัวหน้าทีม
4. Claim the item (`รับโดย:` with the branch name per `handoff` section 5; already claimed by someone else → take another), then choose the playbook for the remaining work, then continue · ใคร: หัวหน้าทีม

## ขั้นตอน · Steps — pause (copy into the todo as written)

1. Bring the piece in progress to a point that can be checked, or go back to the latest checkable point — do not leave half-done code with red tests without saying so · ใคร: `developer` ตัวเดิม (ถือ the piece not yet saved)
2. Work not yet committed — if the user does not allow commits, save `git diff` to `_to_delete/pause-<วันที่>.patch` and say so in the report · ใคร: หัวหน้าทีม
3. Stop the dev server or processes you opened. A sandbox may keep running, but note its name · ใคร: หัวหน้าทีม
4. `status-report`, and rewrite the "รับงานต่อ" (pick up) section in `CONTEXT.md` (`handoff` section 5) — remove finished items (1 line each to `HISTORY.md`) and your own unfinished `รับโดย:` · write: what the next step must do first · the commands to repeat · things to watch out for · ใคร: หัวหน้าทีม · `reviewer` ตัวใหม่ checks (ตรวจ) against the real `git status`

## Done when

A person or bot taking over, from any vendor, can read only `CONTEXT.md` and start work again
