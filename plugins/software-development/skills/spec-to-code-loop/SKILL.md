---
name: spec-to-code-loop
description: Use when building test-first from a spec and mockups
---

# The loop from requirements to code — one requirement per round, test first

> **In SuperUser:** this loop is the core of the playbooks [`feature`](../superuser/references/playbook-feature.md) and [`new-project`](../superuser/references/playbook-new-project.md). If superuser is open, follow the playbook and use this file as the detail of the loop.

> **One rule:** the loop needs a stop condition that gives a result the moment you run it. "Finish implementing the requirements" cannot be checked by a machine; "all 47 tests are green" can.

## Use when
- Building code test-first from a spec (SRS or FSD) and mockups
- The user says TDD · test-driven · "write the test first": this is that loop. Red = steps 1–2 (test named with the requirement ID, seen red). Green = step 3 (least code, per `lazy-coding`). Refactor = during step 4 with the whole set green and no new behaviour. One round = 1 requirement. Test skeleton, run command and unit/integration ratio: `testing-standards`.
- A loop that chases a metric (match an existing system or mockup, a measurable score): open `references/metric-loop.md` before starting.

## Steps
1. **Check prerequisites.** Requirements must each be testable with an ID such as `FR-AUTH-010`; if not, stop and use `srs-writing`. A 1-line test command must really run; if not, stop and set up the test skeleton with `testing-standards`. If there are screens, a command to run the app is needed; if missing, skip image comparison and tell the user. Mockup images must be named to match the screens; if not, ask the user.
2. **Round zero, no code.** Read requirements and mockups in full. Split into sub-tasks, 1 requirement per task, in `docs/BUILD-PLAN.md` (row format in [`references/plan-and-files.md`](references/plan-and-files.md)): รหัส · milestone · สิ่งที่ต้องได้ · ไฟล์ที่จะแตะ · test ที่จะเขียน · สถานะ · commit.
3. **Set document order before splitting.** Write one line at the top of `BUILD-PLAN.md`, such as `ลำดับเอกสาร: TEST-DATA.md > REQUIREMENTS.md > DESIGN.md > mockup`. If the user set an order, use it. Otherwise use that default (test data with expected values > SRS > design document > mockup) and log it in `decision-log` with `(รอยืนยัน)`. On a real conflict, follow the higher-ranked document, record the conflicting pair (file · section · both values) under "ค้างอยู่", and never edit the source documents.
4. **Ambiguous item** (you cannot write a test): do not guess. List it as a question at the end of the file under **"ค้างอยู่"** and carry on with the others.
5. **Check the plan yourself** (no agent needed) on 5 items; fix in place, no re-check: complete (every requirement has a row) · size (1 sensible thing per row; wide → split, detailed → leave signature and test name) · names match across rows · biting cases (each input and failure path has a test) · proportion (a plan many times longer than the requirements is pre-written code; cut to signatures and assertions). Table in the reference.
6. **Stop** at the end of round zero and let the user read the plan. Do not flow on into code.
7. **Per requirement.** Read `BUILD-PLAN.md` first, take the first item not done, then:
   1. Write the test first, with the requirement ID in its name.
   2. Run it and see it **red**. Never skip this: a test never seen red may pass whether the code is right or wrong.
   3. Write code until green.
   4. Run the whole suite, so old things do not break.
   5. If there is a screen, take a real screenshot and compare with the mockup (5-item check in the reference). List every difference; never claim done in silence.
   6. Update status in `BUILD-PLAN.md`, then commit 1 requirement per commit only if permitted. If not permitted, put the recommended commit message with `(รอ commit)` in the commit column.
8. **Close** with a traceability table: every requirement → the test that covers it → latest result. For a requirement with no test, say plainly there is none; never write a shallow test to fill the table.

## Iron rules
1. Never edit or delete a test to make it pass. A red test means the code is wrong. Edit a test only when you can prove it was written wrongly against the requirement, and tell the user every time.
2. 1 requirement per round; never bundle because "they are similar".
3. At most 3 rounds per requirement. If 2 rounds fail, split into sub-steps instead of retrying the same way. At 3, mark it `ติด` and follow "After stuck".
4. Never mock the thing under test; only external things.
5. Never skip to an easier requirement before trying 3 rounds. Only items already `ติด` may be skipped; the plan order is the real order.

### After stuck
1. Record why under "ค้างอยู่": what was tried in all 3 rounds · where you think the problem is · what you need (answer · data · permission).
2. Return to the last point where tests were green. Keep the pending work in branch `stuck/<ID>`; if not permitted to commit, keep a patch at `_to_delete/patches/stuck-<ID>.patch`. The stuck item's test stays there too, never deleted.
3. Items waiting on it are marked `ติด` with reason `รอ <ID>`, untried. Go on to the next item that does not wait on it.
4. After everything else is done, have a new agent on a larger model try 1 more round from `stuck/<ID>` (or the patch) and record it in step 1. If an answer is already in `.claude/superuser/inbox/`, start from it.
5. Still stuck: keep `ติด` in the closing report with what is needed from the user. If the user answers later, continue per playbook `pickup-and-pause`.

## The status file
State lives in `docs/BUILD-PLAN.md`, not in the head. Read it before every round; starting without reading it is the number 1 cause of rework.
- Status has 5 values: `เสร็จ` · `ทำอยู่` · `ติด` · `รออนุมัติ` · `ค้างอยู่` (not yet started = `ค้างอยู่`). `ติด` needs a 1-line reason.
- Every `เสร็จ` item has a commit number. If commit is not yet permitted, put the recommended commit message + `(รอ commit)` and the test evidence (test name + run result) in its place; it may then count as `เสร็จ`.
- At the end of each round update `## สถานะล่าสุด` and `## ประวัติสถานะ` at the top of the file per `status-report`.
- Converted `.docx`/`.pdf` text, screenshots and logs are temporary: put them in `_to_delete/extracted/` · `_to_delete/check/` · `_to_delete/logs/`, never in `docs/` (see `temp-file-discipline`).

## Parallel agents
Split only when the files to touch do not overlap at all. Each writing agent gets its own worktree. A split-off agent never edits `BUILD-PLAN.md`; it reports back and the main agent writes it. Recipe and handover list in the reference.

## Check before done
- Every test name has a requirement ID, and one command can list requirements with no test.
- Every item in `BUILD-PLAN.md` has a status; every `เสร็จ` has a commit number or `(รอ commit)` plus test evidence.
- No test was edited to pass without telling the user.
- Screens were opened and compared with the mockups, or the user was told it was skipped.
- The traceability table is in the closing report.
- Loop going wrong (all green with never red · tests growing faster than requirements closed · one commit touching 15 files · same item past 3 rounds · `BUILD-PLAN.md` stale for 2 rounds · fake data or hidden content to lift numbers): stop and see the signs table in the reference.

## References
- [`references/plan-and-files.md`](references/plan-and-files.md) — open when writing `BUILD-PLAN.md` the first time, running the plan check table, comparing a mockup, splitting agents, or when the loop looks wrong
- [`references/metric-loop.md`](references/metric-loop.md) — open before any loop that adjusts by a number
