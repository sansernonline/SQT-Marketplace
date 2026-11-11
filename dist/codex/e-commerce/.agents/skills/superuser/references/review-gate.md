# Checking and the full rules — details of rules 0–10

The core `SKILL.md` section 1 holds every rule in short form · Open this file before sending a `reviewer`, before writing `ข้ามรีวิว:` (review skipped), or when the short rule in the core cannot settle the question

## Rules 0–10, full version

0. **Read first**: `.claude/superuser/CONTEXT.md` sections "ความคืบหน้า" and "รับงานต่อ" (if `docs/BUILD-PLAN.md` exists, see its "สถานะล่าสุด" table there) · `~/.claude/superuser-style.md` beats the playbook, except for the rules in this section and `รออนุมัติ` · read the enabled modules per `modules`
1. **Understand the task, size it, pick a budget before touching it** (section 2), then pick the steps into a todo list
2. **Every piece sent to a worker has a 5-item brief** (section 5): no brief, no dispatch · send only the relevant files, never the whole folder
3. **Do → check → fix → recheck until it passes**: check against "done-when" using outside evidence only (tool output · tests · official sources · `reviewer`) · "It should work" does not count · If it fails → fix the root cause, then recheck both the original item and the fixed spot
   - Small task → the lead checks it and puts the line `ข้ามรีวิว: <reason>` in the answer · It may be skipped when the expected cost of failure (chance of failure × price of failure) is lower than the reviewer's price; give both numbers on that line (compute it directly, no script needed · chance and price are the lead's own estimates) · The review gate does not let a task finish with ≥ 3 files edited without a fresh reviewer or this line (still an iron rule)
   - Medium task the hook says the lead may do alone (under 5 pieces · no money, law, contracts, employment, personal data, health · no delete or overwrite · not a live system · not sent to outsiders) does not need to open this skill → check with outside evidence (tests pass, or go through the requirements one by one with the line cited) and then write `ข้ามรีวิว: <check result>` (bench 2026-11-11 rounds 07:11 · 07:34: t3 t6 fully passed with no reviewer, recorded in `scripts/evals/speed/RESULTS.md`)
   - Large task, or one reaching outsiders → a fresh `reviewer` every round, level per budget (section 2), counting only `สูง` (high) and `กลาง` (medium) items · A medium task that opens this skill: at most 3 rounds · A large or risky task (money · law · health · sent to outsiders): at most 5 rounds · If still failing at the cap → stop per `autonomy` "รู้จังหวะหยุด" (know when to stop) · Exception: internal code work not delivered to outsiders in the right-dispatch mode (section 5)
4. **Ask once at the start, as a choice question, then do not stop to ask until done** (`autonomy`)
5. **Own decisions must be logged**: what was chosen · what was not · why, in the "การตัดสินใจ" table in `CONTEXT.md`, and gathered at the end of the answer under **ตัดสินใจเอง**
6. **Never invent user data**: unknown numbers, names, dates, budgets get `(รอยืนยัน)` and work continues · If an estimated number is needed to keep the plan moving → put `(รอยืนยัน)` after every such number; a bare "estimate" or "assumption" is not enough (eval 2026-11-09 failed 3 of 3 rounds)
7. **Risky or irreversible work: the lead does it or checks it before release**, never a low-effort worker (the "รออนุมัติ" list in `autonomy`)
8. **End the task with a short summary (section 7) and compare expected with actual**, except for small questions · general chat · read-only playbooks
9. **Commit only when allowed** (the user orders it · `~/.claude/superuser-style.md` · `docs/AGENT-LOOP.md` · section "กติกา" (rules) in `CONTEXT.md`) → 1 step that passes check = 1 commit per `commit-log` · If not allowed, put the suggested commit message in the answer · Do not push unless the user orders it, or the **git อัตโนมัติ** (auto git) line in "กติกา" is `auto` · Never commit to the main branch without asking · The source of this rule is in `team-files`
   - Work in a git repo is edited on the task's branch, not the main branch · A repo that other AIs or sessions also edit → **1 worker 1 worktree**, with the branch name starting with the tool name (`claude/` · `codex/`) · Method and rules in [`team-files`](team-files.md) section "หลาย AI ใน repo เดียว" (several AIs in one repo)
10. **Cite only skills opened in this round**, and mention only those that change a decision · Never edit a skill · agent · playbook file yourself (wait for the user to say "รวมบทเรียน")

## Test gate before the reviewer (code tasks that have tests)

1. **Before the fix** the lead runs the tests covering the spot to be fixed and sees them fail (a new test from the spec must also fail first) · log the command and result
2. **After the fix** run the same tests and see them pass, then run the whole related suite · The fail → pass pair is first-layer evidence; put it in **ผล** with the label `ตรวจจริง`
3. **One reviewer round**: a fresh `reviewer` gets only the diff + test command + test results (before and after) + done-when · Tell it to check only the diff, run the tests once, not survey the whole repo, and not open files outside the diff except at a doubtful spot
4. **Round 2 only if round 1 finds a `สูง` item** · If it finds only `กลาง` or `ต่ำ` (low) → the lead fixes, reruns tests, and may close (items not fixed go into the deferred-items list per [`team-roles`](team-roles.md) "รอบตรวจ" (review rounds))
5. **Risky work still uses the old rule**: money · law · health · personal data · irreversible · sent to outsiders → loop rounds per [`team-roles`](team-roles.md) "รอบตรวจ", and the last round is `opus` + `high`
6. No tests, or tests do not cover the fixed spot → this gate does not apply; use the normal review rounds

Reasons: a test that fails before the fix filters patches twice as accurately (arXiv 2406.12952) · tests from the spec give 94.3% against 69.8% when the agent writes its own tests (arXiv 2510.23761, TDFlow) · bench t5 2026-11-11: the reviewer took 38% of the task time
