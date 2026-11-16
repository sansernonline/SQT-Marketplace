---
name: coding-evals
description: Use when changing coding skills, playbooks or the developer agent, or asked if the team codes better.
disable-model-invocation: true
---

# coding-evals — measure whether the team really codes better

Use when: changing `stack-*` · `code-orientation` · `testing-standards` · the playbooks `feature` · `bug-fix` · `refactor` · the agent `developer` · or the user asks whether the team has improved
Do not use for: real customer work · work with no code

---

## 1 · The job set

There are 8 jobs, 2 per stack. Each job has a small runnable project and a pass criterion checked by command, not by opinion.

| # | Stack | Job | Checked by |
|---|---|---|---|
| 1 | .NET | add an endpoint that cancels an order (not allowed once shipped) | 6 hidden tests · no new warnings |
| 2 | .NET | fix a Buddhist-year 2569 date bug in a report (machine culture `th-TH`) | hidden tests · root cause at the right spot |
| 3 | TypeScript | an Angular sign-up form that validates Thai phone numbers | hidden tests · `tsc` 0 errors · no `any` |
| 4 | TypeScript | fix a memory leak from a subscription in a component | count the subscriptions before and after |
| 5 | Python | a script that imports a Thai CSV (cp874) into the DB and can run again | run twice, no duplicate rows · hidden tests |
| 6 | Python | a FastAPI endpoint that is slow because of a blocking call in async | latency before and after · tests pass |
| 7 | SQL | a monthly sales report query that takes over 2 seconds on 1 million rows | run time and plan · result matches the answer |
| 8 | SQL | a migration adding a NOT NULL column on a big table without a long lock | can run again · no downtime in the script |

The job set lives in SQT-Marketplace at `scripts/evals/coding/tasks/c<number>-<name>/` (not inside a plugin): `TASK.md` (the instruction handed to the team) · `task.json` · `repo/` (starting code) · `hidden/` (tests the team must not see) · `reference/` (the reference answer) · `check.mjs` · full rules in `scripts/evals/coding/CONTRACT.md`

## 2 · Score per job (out of 10)

| Item | Points | Judged from |
|---|---|---|
| Correct | 4 | what % of hidden tests pass (100% = 4 · ≥ 80% = 2 · lower = 0) |
| The team's own tests | 2 | a new test that failed before the fix = 2 · tests exist but do not prove they ever failed = 1 |
| Clean | 2 | build/lint/type 0 new problems = 1 · diff no more than 1.5 times the reference answer = 1 |
| Follows repo conventions | 1 | a new reviewer answers follows / does not follow, with the spot |
| Honest report | 1 | every claim in the report can be checked · no "passed" that was never run |

Also record: time used · approximate tokens · number of times it needed fixing again · report time and tokens separately for each version (with or without the skill), because a skill can add tokens, and a skill the AI wrote itself may score lower than no skill, so expect the difference on coding jobs to be small (source: [references/sources.md](references/sources.md))

## 3 · How to run

The script `scripts/evals/coding/run-coding.mjs` does every step (full usage in `scripts/evals/coding/README.md`)

```powershell
node scripts/evals/coding/run-coding.mjs --verify                     # check the job set first: starting code must fail · the reference answer must pass fully
node scripts/evals/coding/run-coding.mjs --old HEAD --tasks c1,c5     # old version = latest commit · new version = the files being edited
```

1. Each run happens in a new folder under `_to_delete/coding-bench/runs/`. It loads the plugin being compared together with the same version of `superuser` (it does not load plugins installed on the machine), then hands the same instruction to `superuser` exactly, with no extra help.
2. Check with the job's `check.mjs`, then count the items "the team's own tests" and "clean" automatically (run the team's tests against the starting code · compare the diff size with `reference/`)
3. A new claude that did not see the work being done judges the items "follows conventions" and "honest report" · the judge must not know which version has the skill: swap the A/B labels, keep the key out of the judge's sight, and finish writing the criteria before seeing results
4. For jobs whose results swing (a random model), run `--runs 2` or more and use the average, and report 2 numbers per job: **pass@k** = passes at least 1 of k runs (shows the ceiling) · **pass^k** = passes all k runs (shows stability) · decide on release by pass^k, because real work is not rerun for you to pick the best run

## 4 · Reporting results

The script adds a row to `scripts/evals/coding/RESULTS.md` itself (1 row per version) · per-run results live in `_to_delete/coding-bench/runs/`:

| Date | Version | Jobs 1–8 | Total /80 | Time | Note |
|---|---|---|---|---|---|

- If the new version's total is lower than before, or any job drops by ≥ 2 points, do not release yet, and find the cause from the job that dropped
- Put a 3-line summary in the report of the playbook `skill-authoring`: what got better · what got worse · why

## 5 · Rules

- The team must not see `hidden/` or the reference answer, and the scorer must always be a new subagent
- Do not edit the job set to make it easier to pass during a comparison. You may add new jobs, but compare only jobs that have both rounds.
- Real bugs the team once missed (from `.claude/superuser/learn/`) can become new jobs in this set after customer data is removed
