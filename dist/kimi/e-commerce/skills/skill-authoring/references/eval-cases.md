# Eval cases: 3 per new skill

Moved from SKILL.md section 6. "หัวข้อ 7" means [`before-after-testing`](before-after-testing.md). Template path `templates/ISSUES.md` is at `../templates/ISSUES.md` from here.

## 6 · eval: 3 cases per new skill, in the `claude plugin eval` format

Cases live at `plugins/<plugin>/evals/<skill>-<case>/case.yaml`. The official format and all commands are in [`eval-format`](eval-format.md). For 3 real examples see the `human-writing` files in `plugins/superuser/evals/`; the README there explains how to run them.

| Case | What it proves | Main grader |
|---|---|---|
| `<skill>-trigger` | A task a user really types (without naming the skill) makes the skill open | `tool_used` on the `Skill` tool catches the skill name (`arm: with-only`, because the round without the plugin cannot open it anyway) + 1 outcome grader that can score. The task must be written by a person or agent who never saw the description (a word set that had been seen got hit@1 98.3%, a fresh set got 80%, in a BM25 simulation with n=60, not real Claude picking · from the course 2026-11-04). A tighter way to measure is in `eval-format`. |
| `<skill>-behaviour` | Once open, it follows the 2–3 main rules | `regex` on the output (`not_contains` for forbidden words · `match` for required content) + `llm` for criteria regex cannot catch |
| `<skill>-regression` | A failure the agent really made in the red round (section 7) or in a `learn-loop/session-lessons-to-skills` digest does not come back | A `regex` that catches the old symptom directly. Write the symptom and the date seen in the case's `description`. |

- **The case set must not die.** Every "must not happen" case has a paired "must happen" case. Do not tune cases to turn them green. A loop that tunes to the score keeps the criteria fixed: it does not delete hard cases or swap the judge to pass. Pilot 3 items and look at every row before running the whole set. Turn off the installed copy of the plugin before measuring. Calibrate the judge against human labels before trusting its scores. The full rules are in [`eval-loop-rules`](eval-loop-rules.md). To audit a set you did not write, use [`eval-audit`](eval-audit.md).
- **The red round already does it right** → name the case `<skill>-guard`; it does not count as 1 of the 3 cases. If red does every task right, shrink the skill to scripts and facts the model cannot know by itself, then ask the user whether to keep or drop it. The validator fails when a `-regression` `case.yaml` says it has never been seen for real.

- The task must be work the agent cannot do well without the skill. If a task is too easy, both rounds pass and nothing is measured (`จากแหล่ง` skill-creator). The default is 3 runs per case, both with and without the plugin, then report `WITH` `W/OUT` `Δ`.
- Compare a fix with a git ref using `node scripts/evals/ab/ab-run.mjs --help` (the baseline is cached per commit · scores come from regex). Calibrate the judge with `node scripts/evals/judge/calibrate.mjs --help`.
- **Decide that a new version is better with numbers set beforehand, not by eye.** Check the regex grader with `scripts/evals/gate/grader-check.mjs` before spending tokens (the reference answer passes 100% · an answer wrong in 1 place fails only that item). Split the cases into train/val/test and fix from train only. Let `scripts/evals/gate/gate.mjs` decide from the spread of repeated runs (exit 0 accept · 1 reject · 2 cannot compare). Record causes in the issue log and fix at most 3 points per version. The full steps are in [`optimize-loop`](optimize-loop.md) · template [`templates/ISSUES.md`](../templates/ISSUES.md).
- Run: `node scripts/evals/plugin-eval.mjs <plugin> --only "^<skill>-" --max-cost-usd 5` (a plugin with `dependencies` will not load if you run `claude plugin eval` directly · details in `eval-format`). In CI add `--json results.json --threshold 0.8` and read the exit code (0 pass · 1 fail · 2 hit the cost cap or auth).
- Put `evals/results/` in `.gitignore`. Put summaries you want to keep in that plugin's `RESULTS.md`.
- The repo's own evals (`scripts/evals/triggers` `speed` `coding`) are a different layer: they measure across all plugins and compare 2 versions by git ref. They do not replace each other (the difference is explained in the README of `plugins/superuser/evals/`).
