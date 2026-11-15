# Sizing, budget, expectation — details of section 2

The core `SKILL.md` section 2 holds only the short form · Open this file when sizing a task, picking a budget and picking a playbook (before touching a medium or larger task)

One lead is good at 4 things: **dispatching** · **rating team members** · **managing the work** · **rechecking until it succeeds** — low-effort team members are fine because the brief is clear and someone checks · Call `/superuser:superuser` or say "ใช้ superuser" (use superuser)

## 3 lines before touching the task

**3 lines before touching the task** (1 minute at most), written with these Thai labels word for word: `เป้า:` (goal) what the user gets · `เสร็จเมื่อ:` (done-when) how it is checked · `เสี่ยง:` (risk) what is lost if it goes wrong, and can it be undone (irreversible → rule 7) · Medium tasks and up add to the end of the done-when line which workflow: Loop (one piece, do-check-fix) · Graph (split into pieces, then merge) · Dynamic (facts may change midway) · The lead picks from the request table in [`agent-patterns`](../../agent-patterns/SKILL.md) and does not ask the user · If the user asks to see the plan before work starts → put these 3 lines at the very top of the plan sent (eval 2026-11-09: the plan had no done-when line in 3 of 3 rounds)

## Size

| Size | Judged by | What to do |
|---|---|---|
| **Small** | 1 piece (piece = a part that can be done without waiting on others, e.g. 1 module with its tests) · code task: total expected < 200 lines even across several files · ≤ 50k tokens · a single question · a one-spot fix · instantly reversible | The lead does it alone: no split, no playbook or reference, no log or team files · check the result before answering · answer as one word or 3 lines (section 7) |
| **Medium** | 2–8 independent pieces · code task: total expected ≥ 200 lines (below this, splitting costs more and is no faster, bench 2026-11-11) · several steps, but the way is known (a known way still needs splitting) | The best-fit playbook (table below) · no match → compose one per [`playbook-template`](playbook-template.md) · number of workers = width of the task graph |
| **Large or unclear** | (the hook counts ≥ 5 pieces or risky work as "must open this skill", which may be medium in this table) over 8 pieces, or a critical path longer than 4 pieces · several possible routes · a wrong pick is costly | A fresh `brainstormer` proposes 2–3 routes → the lead picks 1 → brief per [`brief-template`](brief-template.md) at `docs/BRIEF.md` → playbook · lay out the whole graph first; worker count comes from graph width, with non-overlapping duties |
| **XL (several days · milestones · people on the team)** | cannot finish in one session · a real person takes a piece alongside an agent | [`team-project`](playbook-team-project.md) — brief → BUILD-PLAN splits milestones → a `handoff` note for every piece · check per milestone · close the day with "รับงานต่อ" (pickup) |

The numeric thresholds are defaults and not yet measured (tied to S/M/L 20/50/100k and WORKFLOW_AT 8 in `plan.mjs`) · For an unknown piece size, use that step's PERT expected value from `model-scorecard` (section "ขนาดชิ้นงานจากงานเก่า", piece size from past work) · Unsure of size → treat as one size up · Used more than 2 times the planned workers and still not done → review the plan and log 1 row in "การตัดสินใจ"

## Budget

**Budget**: the user may state it; if not, use `สมดุล` (balanced) · A value in chat beats `config.json`

| Budget | Workers | Reviewer | Review rounds | Parallel |
|---|---|---|---|---|
| **เร็ว** (fast) | mostly small; medium only for hard pieces | `sonnet` + `medium`, gets the diff and the "done-when" | 1 round (risky work 2) | most |
| **สมดุล** (balanced) | per section 5 | `sonnet` + `medium` every round · `opus` + `high` only in the last round of risky work (money · law · health · personal data · irreversible) · earlier rounds check the diff against tests, which sonnet can do even when the author is opus | per rule 3 | per task |
| **คุณภาพ** (quality) | one level up on every piece | `opus` + `high` every round · check from 2 angles | full cap | per task |

## Expectation

**Expectation**: 1 line in "การตัดสินใจ" before dispatch: `คาด: size <small/medium/large> · workers <N> · review rounds <N> · level <small/medium/large>` (Graph form appends `· critical path <N>k · max width <N> · speedup <N> times`) · At the end compare with what actually happened and with the tokens from `log/SUMMARY.md` (section 7) · A repeated gap is a lesson for the lead, logged per [`lead-playbook`](lead-playbook.md) · Before sizing, open `~/.claude/superuser/LEAD-PLAYBOOK.md` if it exists

## Choosing a playbook

For medium tasks and up, pick **1** playbook or compose your own, and read the whole file before starting

| playbook | use when |
|---|---|
| [`research`](playbook-research.md) | finding information or an answer that must be confirmed · comparing options |
| [`document`](playbook-document.md) | a document, report, plan, or text others will read |
| [`review`](playbook-review.md) | checking work before sending or before real use |
| [`unattended-run`](playbook-unattended-run.md) | a long task the user will not watch — "ทำให้เสร็จ" (get it done) · "ไม่ต้องถาม" (no questions) |
| [`learn-from-session`](playbook-learn-from-session.md) | "รวมบทเรียน" (roll up lessons) · "reflect" · fixing a team that repeats the same issue |
| [`pickup-and-pause`](playbook-pickup-and-pause.md) | "ทำต่อจากเมื่อวาน" (continue from yesterday) · taking over from another agent · "พอก่อน" (stop for now) |
| [`team-project`](playbook-team-project.md) | an XL task over several days with milestones · a real person takes pieces alongside an agent |

Examples of model levels and team shapes for this plugin → [`examples`](examples.md)
