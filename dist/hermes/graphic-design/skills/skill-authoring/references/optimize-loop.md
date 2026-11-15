# Skill optimise loop with an acceptance gate: decide whether a new version is better by numbers set in advance

Use when you change a skill that already has eval cases and want to know whether the new version is really better or just lucky. The anti-cheating rules of the loop (keep the bar · never drop hard cases · stop at 5 rounds) are in [`eval-loop-rules`](eval-loop-rules.md). This file adds 4 things that turn the verdict into a number: check the grader first · split train/val/test · measure noise and let the gate decide · an issue log with at most 3 fixes per version.

Tools live in `scripts/evals/gate/` (no model calls, no cost) · issue log template: [`templates/ISSUES.md`](../templates/ISSUES.md)

## Steps, in order

0. **Check the grader before spending tokens.** A grader that judges wrong makes every number wrong. Write 1 reference answer that is right on every point and, per grader, 1 answer that is deliberately wrong on that point, then run `node scripts/evals/gate/grader-check.mjs <case.yaml> --good ref.md --bad <grader>=wrong.md`. The reference must pass 100% and each wrong answer must fail only its own point. Calibrate `llm` graders against human labels with `judge/calibrate.mjs` ([`eval-loop-rules`](eval-loop-rules.md) section 5).
1. **Write the split file before running.** Give every case a split and declare the cost metric (next section). Never change it after seeing results.
2. **Pick the model you will really use, and measure the baseline with it.** The same skill can help one model and hurt another (course: skill v0 made sonnet 21% more expensive but helped haiku), so a result from a different model does not carry over. Run `node scripts/evals/plugin-eval.mjs <plugin> --only "<regex>" --json _to_delete/<task>/v0.json --max-cost-usd <cap>` on every train and val case, at least 2 runs per case (eval default is 3). Also run the no-skill arm once: if the task already scores near 100% without the skill, the gain can only come from cost.
3. **Look at the noise.** `node scripts/evals/gate/gate.mjs --null v0.json --split split.json`, then write "noise of the difference between 2 versions" in the log. A difference below 1.5 times this value counts as no difference. If this value is bigger than the gain you hope for, add runs or cases before fixing anything.
4. **Find causes in the train set only.** Open the traces (`--keep-temp`) and answers of failed train runs. For val, look only at the totals in the gate table, never the single runs: once you fix things from val answers, val no longer measures what the skill has never seen.
5. **Write the issue log** from the template. 1 row = 1 cause · seen in how many of how many runs · a cause seen once is not fixed yet.
6. **At most 3 fixes per version.** Every version is its own commit with its own result file (`v1.json` `v2.json`) so you can roll back and compare. Choose fixes in this order of value:
   - A script that checks and warns by itself (the warning says how to fix) beats a rule the AI must remember
   - A rule naming a command, a file or a checkable value beats broad advice
   - Delete or merge rules that repeat or never had an effect · the skill must not grow without a reason
   - Never put answers or names specific to train cases into the skill
7. **Measure again** with the same model · effort · number of runs · cases and graders. Only the skill text differs from the baseline.
8. **Let the gate decide.** `node scripts/evals/gate/gate.mjs --base v0.json --cand v1.json --split split.json` · exit 0 accept · 1 reject · 2 not comparable. On reject, go back to the old version, log the result `ไม่ได้ผล`, and try another way. Never change graders or cases to make it pass.
9. **Confirm the final version on the test set, once.** Never fix the skill from test results.

## Splitting train / val / test

| Set | Used for | Rule |
|---|---|---|
| train | finding defects, traces allowed | fix the skill from this set only |
| val | the gate's verdict | totals only · at most 3 versions judged, then add new val cases (gate counts; the 4th version gets exit 2) |
| test (optional) | confirming the final version | run once, never used for fixes |

- Val cases must differ from train in what the skill could memorise (different topic, different trap), not the same case reworded.
- **At least 3 val cases.** With fewer, only large differences mean anything (course part 2 had 2 val cases). The gate warns when val has fewer than 3.
- **Train up but val down = the skill memorised the cases (overfit): reject.** The gate checks this.
- Split file: `{ "costMetric": "cost_usd", "splits": { "<case>": "train" | "val" | "test" } }` · cases not listed count as train · with no val case at all the gate rejects.

## How the gate decides

- **Noise:** one skill version on the same case scores differently run to run. The gate takes the sd between runs of the same case, pooled across cases, and divides by √runs to get the noise of the mean. Noise of the difference of 2 versions = √(base² + new²).
- **Threshold** = the larger of `--eps` (2 points) and `--z` (1.5) × noise of the difference, per set, because a set with few cases is noisier.
- Reject when train or val drops by more than that set's threshold.
- Accept when the train+val total improves by more than the threshold, **or** does not drop beyond it and cost falls by at least 10%.
- **Declare the cost metric before measuring.** The gate refuses to change the value declared in the split.

| Metric | What it counts | Available in | Pick it when |
|---|---|---|---|
| `cost_usd` | list price | plugin eval · bench | the default |
| `turns` | conversation turns | plugin eval · bench | a cheap model whose price barely moves |
| `tokens` | all tokens incl. subagents | bench | comparing context size |
| `tool_calls` | tool calls the agent made per run (bench also records failed calls) | bench | the skill aims to cut wasted commands, or price barely moves |

  Course example: haiku cost $0.031–0.033 per run even when commands differed 3 times, so a version that cut commands 39% passed on `tool_calls` and failed on `cost_usd`. Choose the metric from what the skill is meant to improve, before the first run.
- **Not comparable (exit 2)** when case × run sets differ · a case's prompt or grader changed · the models differ · no cost metric declared · the result file lacks the declared metric.
- **Passing the gate is not proof.** At z 1.5 a version that is not really different still slips through about 7% of the time. For work where a mistake is costly, use `--z 2` (about 2%) and add runs.

## When a grader looks wrong, open the work before trusting the score

For a point with an odd score (a version that just fixed that point fails it more), open the real answers and see whether the skill or the grader is wrong.

| Allowed | Not allowed |
|---|---|
| Fix the grader after opening the work and finding it judged wrong, log it, then rerun every version with the same grader set | Change a grader so the new version passes without looking at the work |
| Use `grader-check.mjs` to confirm the fixed grader still fails wrong answers and passes right ones | Grade the old version with the old grader and the new one with the new grader (gate answers exit 2) |

Real examples

- Course: point `image_data` of v1 scored 0/4, worse than v0, right after a rule for it was added. Opening the work showed the grader counted the logo, which needs no data wait, as a failure. After fixing the grader and regrading every version, v0 stayed at 1/4 and v1 got 4/4. In another set, 5 grader mistakes made the skill look 4.7 points worse; once fixed, both arms scored 100%.
- This repo 2026-11-11: `gate.mjs` compared round 1 and round 2 of `personal-life` evals and gave exit 2 because 3 of 4 behaviour cases changed grader or prompt between rounds. `grader-check.mjs` found that `no-promise-9000` in `flood-prep-behaviour` failed the right answer "ยังไม่แน่ว่าจะได้เงิน 9,000 บาท" because its regex caught the negation.

## What was not copied from the course

| Course | This repo uses instead |
|---|---|
| Multi-account case runner (`skillopt.py run`) | `plugin-eval.mjs` and `speed/run-bench.mjs` |
| `lint` command for skill size | `validate-marketplace.mjs` |
| `report` and `failures` commands | `report.html` from `claude plugin eval` and traces from `--keep-temp` |
| "Read the skill" column | `-trigger` cases with a `tool_used` grader |
| Every version as a fresh copied folder | Every version as its own git commit |
| Regrade every version without calling the model (`grade`) | Not possible with `llm` graders, so rerun the baseline instead |
| Bandit to choose which version to measure (COBRA-Skills) | Not used: the case sets here are small enough to measure every version |

## Source

Adapted from course CWN2026 week 2, lesson Skill Optimization (`skill-optimizer`), by the repo owner · reworded 2026-11-11, translated and extended 2026-11-13 (`tool_calls`, real model, val size) from `Skill_Optimization_Slides.pdf` pages 58–67 · read from `skills/skill-optimizer/SKILL.md` · `references/issues.md` · `references/suite.md` · `scripts/skillopt.py` (`noise_of` `se_diff` `cmd_gate`) · `01_theory/README.md` sections ข3 ข4 ข5 ค1–ค6 · `README.md` steps 4.3 and 8.1 · 7% and 2% are the one-sided normal tails at z 1.5 and 2 (6.7% and 2.3%)
