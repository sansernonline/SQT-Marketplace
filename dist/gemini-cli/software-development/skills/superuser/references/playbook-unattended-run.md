# playbook · unattended-run — long work with nobody watching

Use when: "Finish it, I'll come back to look" · "Do it overnight" · "Don't ask" · multi-step work that a person will check all at once (covers pstack's `autonomous run` · `multi-phase plan` · `orchestrate` · `autopilot-full`)
This is a wrapper around the work and does not replace the work's own playbook — it keeps the run going to the end, while each piece inside still picks its playbook by the work as usual
Main skills: `decision-log` · `principle-proceed-on-reversible-work` · `status-report`
Worker per piece: per that piece's sub-playbook (for example, a fresh `developer`)
Reviewer per piece: a fresh `reviewer`
Common `รออนุมัติ` (awaiting approval) items: deploy · delete data · merge into the main branch · send messages to outsiders

## Real tools used in code work

- The done condition (step 1) uses things a machine can check: which test suite must pass · which screen must be clickable · if the task is unclear, let a fresh `brainstormer` help break down the work (step 2)
- For multi-day or multi-phase work, write the phase plan into the task table in `docs/BUILD-PLAN.md`; the team lead coordinates and does not write code itself (shared items and small pieces it may do itself)
- After a piece passes review, commit on the work's branch per rule 9 of `superuser` (if not permitted → leave it in the files and summarise the diff at the end)
- After getting blocked, keep the leftover work in branch `stuck/<ID>` and return the line of work to green tests · if the user answers later → continue per playbook `pickup-and-pause`
- If the project has `.sandbox/`, use mode `-Isolated` (or one sandbox per piece when working in parallel) and `sync` the results out as a patch at the end

<!-- superuser:begin unattended-steps -->
## ขั้นตอน — Steps (copy into the todo exactly)

Labels kept in Thai because the validator matches them: `ใคร:` = who · `หัวหน้าทีม` = the lead · `ตัวใหม่` = fresh (a new instance) · `ตัวเดิม (ถือ …)` = the same agent, holding something.

1. Write a checkable end condition: which file must exist · which table must be complete · which draft must be ready to send · running with `claude -p` → always add `--max-budget-usd <budget>` (budget unknown → ask in the single set of questions at the start). Hitting the ceiling = `ติด`, then report how far it got · ใคร: หัวหน้าทีม
2. Split the work into pieces that each end with a check, record them in the "ความคืบหน้า" (progress) table in `CONTEXT.md`, choose a sub-playbook for each piece, and hand them out to fresh subagents one piece at a time · ใคร: หัวหน้าทีม
   - **Check external tools before handing out the first piece.** For any piece that needs an MCP (Model Context Protocol) tool, load that tool by name with ToolSearch and call it once to test now (before the user leaves). Cannot call it → mark that piece `ติด` at once, with the fix written step by step (which server to connect · how to log in), then carry on with other pieces. Do not call the API directly with curl or a token in a command instead, because that goes beyond the permission the user gave.
3. Do one piece at a time. Pass the section 4 criteria, then go to the next piece. Breaks twice → split into sub-steps, do not retry the same way · after 3 rounds → record it as `ติด` and go to other pieces · ใคร: workers per the `ลูกทีมต่อชิ้น` line above, a fresh one per piece · check (ตรวจ): per the `ผู้ตรวจต่อชิ้น` line above
   - **After getting stuck.** Record in "ค้างอยู่" (pending) what was tried · where the problem probably is · what is needed to go on. Keep the unfinished work separately as a draft, not over pieces that already passed.
   - **A piece that must wait for a stuck piece.** Record it as `ติด` with reason `รอ <piece>` (waiting for <piece>), without trying.
   - **All other pieces are done.** Have a fresh agent on a larger model try once more from that note (an answer in the inbox → start from the answer).
   - **Still stuck.** Keep it in the report with what is needed from the user · the user answers later → a new session reads `CONTEXT.md` and continues from that piece.
   - **Stuck because it must be the user** (a decision · a check by eye or ear · spending money or tokens · endorsing text an agent wrote on their behalf): add a row to the "รอผู้ใช้" (waiting on the user) table of `CONTEXT.md` and go on to other pieces, without stopping to wait.
4. Every time you choose a path on your own, record it in the "การตัดสินใจ" (decisions) table at once, do not bundle it to write at the end · ใคร: หัวหน้าทีม
5. If you meet an item that is "รออนุมัติ" (example in the `รออนุมัติที่เจอบ่อย` line above · full list in `autonomy`, section "รออนุมัติ — ทุกสาขา" of `superuser`), prepare it ready to press, never do it yourself; put questions the user must answer under "ค้างอยู่" · ใคร: หัวหน้าทีม (approval: the user)
   - **Messages to outsiders are written as drafts in the outbox.** An email draft, a reply, a review, or a post goes into a file `.claude/superuser/outbound/<date>-<topic>.md` (recipient · channel · ready-to-send text · reason for sending), then move on to the next piece without stopping to wait for a person · drafting needs no approval, actually sending does · the user sends it, or orders it sent later on their behalf · list the outbox item in the "รอผู้ใช้" table of `CONTEXT.md`, 1 row per file.
6. After finishing each piece, update "ความคืบหน้า" and "รับงานต่อ" (pick up the work), then look in `.claude/superuser/inbox/`, so a user coming back midway sees the latest status · starting a new session mid-job → run the "เสร็จเมื่อ" (done when) checker of the latest `เสร็จ` piece once before the next piece; fail → fix that piece first · ใคร: หัวหน้าทีม
7. When the job is finished, check all the step 1 conditions once more, run the learning round, then report once: what is done · what is stuck · how many decisions made on your own · what awaits approval · what is pending · ใคร: หัวหน้าทีม (re-checking the conditions: `reviewer` ตัวใหม่)
   - End the report with a table `ขั้น | ผล | หลักฐาน` (step | result | evidence), 1 row per condition in step 1 · evidence is a file path · link · check result · summarise as **"ผ่าน X / N"** (passed X of N) counted from the real checker, not from what workers say · an item that needs a human eye does not count as passed, put it in a separate row `ต้องให้คนดู` (needs a person to look) · for items that failed, give the cause in 1 line.

## Done when

All the step 1 conditions pass, or every remaining piece has a reason why it is stuck
<!-- superuser:end unattended-steps -->
