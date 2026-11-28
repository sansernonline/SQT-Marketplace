# Rules for the eval-tuning loop: before running, while tuning, and checking the judge

Use when you are editing a skill and looping eval runs until the score is good. The goal of the loop is a skill that really works better, not a green number. The case format is in [`eval-format`](eval-format.md) · the tools that run are in `scripts/evals/` (table at the end of this file)

## Contents
- [1 · Before running the whole set](#1--before-running-the-whole-set)
- [2 · The test set must not be dead](#2--the-test-set-must-not-be-dead)
- [3 · Anti-cheating rules in the tuning loop](#3--anti-cheating-rules-in-the-tuning-loop)
- [4 · Have the judge check the criteria too](#4--have-the-judge-check-the-criteria-too)
- [5 · Calibrate the LLM judge against human labels](#5--calibrate-the-llm-judge-against-human-labels)
- [6 · What the model cannot check itself, a script checks](#6--what-the-model-cannot-check-itself-a-script-checks)
- [Tools](#tools)

## 1 · Before running the whole set

1. **Pilot 3 items** with the real mode and scorer (not a simulated mode) · if there are many items, pick 3 that differ · open and read every row of the result, not only the total score
2. **Stop at once** when you see auth rejected · an empty answer · a score that comes purely from errors · then fix the root cause before running on
3. A pilot score of 0 can be a real result (the skill may not help yet) · if it is 0 because the criteria check something the judge cannot see, fix the criteria using evidence from that row, following the section "Write `llm` criteria" in `eval-format`, and do not lower the criteria to make it pass
4. Label pilot results "นำร่อง" (pilot) so they do not mix with whole-set results
5. **Turn off the installed copy of the plugin, or check it is not loaded.** An eval of a skill has 2 ways of loading: have the executor read the skill file by path, and load with `--plugin-dir` when measuring triggers. If an installed copy is also active, the description of that copy may be scored in place of the working-tree version without anyone noticing. `plugin-eval.mjs` and `ab-run.mjs` check before running (`ab-run.mjs` stops when it finds one, while `plugin-eval.mjs` warns, because `claude plugin eval` uses a fresh home each round). Turn it off with `claude plugin disable <plugin>@<marketplace>` and turn it back on after the run.

## 2 · The test set must not be dead

- **Every "must not happen" case has a paired "must happen" case in the same set.** A set that is broken and returns nothing passes every "must not happen" case. Pairs in use: `-no-trigger` with `-trigger` · `regex` `not_contains` with `match` for what must be present
- **Case-screening question:** if the code or skill did nothing at all, would this case still pass? If it passes, the case measures nothing: add a paired case or change the criteria
- **Red case first**, always: see the case fail against the old version (or the no-plugin round), then fix · a case that was green from the start in both arms is not evidence
- **Do not tune a case to make it green.** When a case fails, fix the skill, or prove with evidence that the case is wrong (for example the judge checks something it cannot see), and record the reason before editing the case

## 3 · Anti-cheating rules in the tuning loop

The tuning loop = edit skill → run eval → look at results → edit again. Written as things you must do:

| Do | Guards against |
|---|---|
| Keep the pass criterion and grader weights as set before the first round · to change the criteria, propose it to the user with evidence | Lowering the criteria until it passes |
| Keep the hard cases and report the cases that still fail plainly | Deleting hard cases |
| Use the same model, judge and `runs` throughout the loop · you may change only by comparing the two values side by side in the same round and telling the user | Switching provider or judge to make it pass |
| Cause of failure unknown → open the trace (`--keep-temp`), read the failing round, then add information for that exact spot to the skill or the case before trying again | Fixing many spots blindly at once |
| End the loop at 5 rounds (default) or when 2 rounds in a row do not improve · then report the true status and ask the user | Looping forever |
| Record every round: what was edited · scores before and after · cases still failing | Being unable to refer back |

This rule adds to `fix-at-source/principle-fix-root-cause` (find the cause before fixing) for loops whose indicator is a score.

## 4 · Have the judge check the criteria too

After judging results, have the judge (or another agent) do 3 things to the set of criteria, not only pass or fail:

1. Judge every assertion with a quoted passage from the answer as evidence · no evidence counts as not passed
2. **Point out assertions that pass too easily**, for example passing in both the with-plugin and without-plugin rounds · or passing with an empty answer · these measure nothing, so make them stricter or remove them (with a recorded reason, not because you want the number to look good)
3. **Point out important results that have no criterion**, for example the skill says to ask before acting but no grader covers it · then check implied claims in the answer (such as "tested") for evidence in the result

The results of items 2–3 are proposals to edit the cases, for the user to decide.

## 5 · Calibrate the LLM judge against human labels

Before trusting a score from an `llm` grader, you need to know how closely it agrees with people:

1. Have a person label real answers `pass` or `fail`, **at least 20 passing and 20 failing** · too few labels, the result does not count
2. Split the set into **train** (put the examples into the judge) · **dev** (tune the prompt) · **test** (run once at the end) · `calibrate.mjs --assign-splits` assigns them repeatably
3. Have the judge judge every item, store it in a `judge` column, then run `calibrate.mjs` to get TPR (judge says pass on items the person said pass) · TNR (judge says fail on items the person said fail) · accuracy · and a table of items that disagree
4. **Starting threshold 85%** for accuracy, TPR and TNR on the test split (the 85% comes from langfuse's guidance as a human-level bar · not yet measured on our work, adjust when there is data)
5. Below the threshold → look at the disagreement table, then **propose a new prompt for the user to approve** before editing · rerun on dev · never edit labels or criteria to make the number pass · once it reaches the threshold, run test once
6. Rules that code can check (regex · line counts) do not need judge calibration · write a unit test for the checker instead

Until now the `llm` criteria that work with `reviewer` and the eval graders have never been calibrated against human labels at all (checked `skills/handoff/parts/adversarial-review-panel` 2026-11-10), so start with the grader whose results wobble most.

## 6 · What the model cannot check itself, a script checks

A model cannot check its own claims (it says "moved every table" and believes itself) · build a fixture that has a known correct answer, then let a **checker script** lock only the decisions that are "wrong once altered", that is, the spots where the model tends to differ from the correct answer · it does not need to check everything · example on this machine: `scripts/evals/coding/` (hidden tests of tasks c1–c8)

## Tools

| Job | Tool | Notes |
|---|---|---|
| A/B baseline against the working tree | `node scripts/evals/ab/ab-run.mjs --help` | The baseline is cached by git sha · it reruns when the ref moves · score is pure regex · calls a real model, use `--dry-run` to see the plan first |
| Calibrate the judge against human labels | `node scripts/evals/judge/calibrate.mjs --help` | Does not call a model · reads labels from CSV or JSON |
| Run `claude plugin eval` so it measures properly | `node scripts/evals/plugin-eval.mjs --help` | Tries the trigger case first · warns about an installed copy |

## Sources

Rewritten in our own words · format `plugin (licence) · file · date viewed`

- claude-remember (Community License, no redistribution · only the idea taken, no text copied) · CONTRIBUTING.md and CLAUDE.md · viewed 2026-11-10 → section 2
- deepeval (Apache-2.0) · skills/deepeval/references/iteration-loop.md · viewed 2026-11-10 → section 3
- anthropics skill-creator (Apache-2.0) · agents/grader.md · viewed 2026-11-10 → section 4
- outputai (Apache-2.0) · skills/output-eval-validate-judge/SKILL.md · viewed 2026-11-10 → section 5
- langfuse (has a LICENSE file, type not checked) · skills/langfuse/references/judge-calibration.md · viewed 2026-11-10 → section 5 (85% threshold and the step of asking approval before editing the prompt)
- migration-to-aws (awslabs/startups · licence type not checked) · fixtures/azure-iac-terraform/README.md · viewed 2026-11-10 → section 6
- mlflow (Apache-2.0) · mlflow-evaluation/SKILL.md step 4 · viewed 2026-11-10 → section 1 items 1–4
- expo (MIT) · .claude/skills/expo-skill-eval/SKILL.md · viewed 2026-11-10 → section 1 item 5
- crowdstrike-falcon-fusion (MIT) · run-ab-test.sh · viewed 2026-11-10 → `ab-run.mjs`
