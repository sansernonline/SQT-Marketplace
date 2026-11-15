# Claude Code eval format: `claude plugin eval`

Every item is `จากแหล่ง` (from a source) [code.claude.com/docs/en/plugin-evals](https://code.claude.com/docs/en/plugin-evals) · viewed 2026-10-23 · needs Claude Code 2.1.269 or later · uses the logged-in account and costs money

## Contents
- [File layout](#file-layout)
- [case.yaml](#caseyaml)
- [Graders](#graders)
- [Scores and the no-plugin arm](#scores-and-the-no-plugin-arm) (includes [Making trigger measurement tighter](#making-trigger-measurement-tighter-more-exact-than-our-minimum))
- [Number of runs and pass threshold](#number-of-runs-and-pass-threshold)
- [Run environment](#run-environment)
- [Commands and exit codes](#commands-and-exit-codes)

## File layout

```
plugins/<plugin>/
└─ evals/
   ├─ <เคส>/
   │  ├─ case.yaml          ← เราใช้ไฟล์นี้ไฟล์เดียว (โจทย์ใน execution.prompt · grader ใน graders:)
   │  ├─ prompt.md          ← ทางเลือก: frontmatter = ช่องของเคส · เนื้อ = โจทย์ (ทับค่าใน case.yaml)
   │  ├─ graders/<ชื่อ>.md  ← ทางเลือก: grader ละ 1 ไฟล์ ต่อท้ายรายการใน case.yaml
   │  └─ mocks/             ← ผลจำลองของ MCP tool
   ├─ mocks/<server>/<tool>.md
   └─ results/<timestamp>/  ← aggregate-result.json + report.html — ใส่ .gitignore
```

- A folder counts as a case when it has `prompt.md` or `case.yaml` · a case with no grader fails to load · cases can be nested under group folders
- `claude plugin eval init` has Claude help write cases · `init --bare <name>` creates an empty template
- Another folder in place of `evals/`: `"experimental": { "evals": "<path>" }` in plugin.json or `--eval-dir`

## case.yaml

```yaml
schema_version: "1.1"        # บังคับ
name: human-writing-behaviour # บังคับ · ตรงชื่อโฟลเดอร์
description: …               # ให้คนอ่าน
tags: [smoke]
runs: 10                     # 1–50 · เราใช้ 10 (เหตุผลในหัวข้อ "จำนวนรอบและเกณฑ์ผ่าน")
expected_outcome: …          # ให้คนอ่าน ไม่ใช้ตัดสิน
execution:
  prompt: |                  # โจทย์ (เมื่อไม่มี prompt.md)
    …
  model: …
  max_turns: 10              # ≤ 200
  timeout_seconds: 300       # ≤ 3600
  allowed_tools: []
  append_system_prompt: …
  env: { EVAL_X: … }         # ชื่อต้องขึ้นต้น EVAL_
context:
  scaffold_script: fixture.sh  # รันเมื่อใส่ --scaffold เท่านั้น · 120 วินาที
  add_dirs: [resources]        # โฟลเดอร์อ่านอย่างเดียว
  history_file: …jsonl         # เริ่มจากบทสนทนาเดิม
graders:
  - name: …
    type: …                  # ดูตาราง
    …
```

The comments above (Thai, kept as is) mean: required · matches the folder name · for people to read · we use 10 (reason in the section "Number of runs and pass threshold") · for people to read, not used for judging · the prompt (when there is no prompt.md) · env names must start with EVAL_ · runs only with --scaffold, 120 seconds · read-only folders · start from an existing conversation · see the table.

## Graders

Shared fields: `type` (required) · `weight` (1) · `arm` (`with-only` or `both`) · `target` or `focus` = `last_message` (default) · `trace` · `files` · `{ source: file, path }` · `mock_calls`

| type | Fields | Use when |
|---|---|---|
| `regex` | `pattern` · `flags` · `match` (`contains` default · `not_contains` · `"count:N"`) · `target` | A word must be present/absent · cheapest, does not wobble |
| `tool_used` | `tool` · `input_match` (regex against the JSON of the input) · `min` (1) · `max` · `min: 0, max: 0` = must not be called (a `-no-trigger` case also gets `arm: both` so it counts toward the score) | Was the skill opened: `tool: Skill` + `input_match: '"skill"\s*:\s*"(?:[\w-]+:)?human-writing"'` |
| `tool_order` | `before` · `after` | Order of tools |
| `file_exists` | `path` · `exists` | The result is a file (Write permission must be granted first) |
| `llm` | `criteria` · `focus` | Criteria a regex cannot catch · 3 judge votes, passes when ≥ 2 |
| `baseline` | `baseline_file` · `criteria` | Compare against a reference answer |

There is no self-written-code grader · one written in `graders/*.md` uses the same frontmatter fields, and the file body = `criteria`

### Write `llm` criteria so the judge judges correctly

In the 2026-10-26 round, 4 `llm` criteria failed 0/3 in both the with-skill and without-skill arms. We asked the judge (haiku) one item at a time and found the answer passed 4–5 of 6 items but failed as a whole because of a single item:

- **1 grader = 1–3 matters at the heart of the skill.** If there are many matters, split them into several graders so you can see which one fails. Before, 4–6 items were combined as "all items present", and missing the single word "ชัก" failed it.
- **Start with "ตัดสินจากความหมาย ไม่ต้องใช้คำเดียวกัน" (judge by meaning, the same words are not needed).** Write the examples in brackets as "เช่น … อย่างใดอย่างหนึ่งก็พอ" (for example … any one is enough), otherwise the judge treats every one as required.
- **No criteria the judge cannot check**, such as "do not invent numbers with no source". The judge sees only the answer, with no source list or prompt, so it failed numbers that were actually correct (the OIC phone number 1186). Write it as something visible in the answer instead: "number X must carry its source or `รอยืนยัน`", or put the surely-wrong value in a `regex` `not_contains`.
- **Facts that are numbers or specific words go in `regex`** (120 วัน · 15,000 · 1669). Keep `llm` for judging order, stance and reasoning.
- **A criterion that catches a real mistake gets its own grader**, such as `rmf-skip-limit`, where the agent wrongly answered that you may stop buying RMF for 2 years, although the skill says you may not.
- Failing in both arms more than half the time → check the criteria before blaming the skill: send the answer in the result's `evidence` and the criteria to `claude -p --model haiku` to judge one item at a time with a quoted passage, then see which item causes the failure.

### Read-only cases: let regex score first

- Give the case only read tools (`Read` `Glob` `Grep` `Skill`) in `allowed_tools` · a case that needs no file writing asks for no `Write` `Edit` `Bash` at all (so it also runs on Windows, since no sandbox is needed)
- **Score with `regex` first**, because it is cheap and does not wobble · an `llm` grader is an adviser: set `arm: with-only` so it is an indicator and does not count toward the score, while it is not yet calibrated against human labels ([`eval-loop-rules`](eval-loop-rules.md) section 5) · `tool_used: Skill` is an indicator of whether the skill was opened, not an outcome
- **Always set a cost cap** `--max-cost-usd` (example in the commands section) · a single round on 2026-10-26 cost 35.39 dollars without anyone noticing
- Before running the whole set, pilot 3 items and check the installed copy of the plugin: [`eval-loop-rules`](eval-loop-rules.md) section 1 (idea from coderabbit evals/README.md · MIT · viewed 2026-11-10)

## Scores and the no-plugin arm

- Each case runs 3 rounds per arm · round score = the weighted share of graders that passed · case score = the mean · passes when it reaches `--threshold` (default 1.0)
- **2 arms by default**: the with-plugin round (`WITH`) and the round with no plugin at all (`W/OUT`), then the difference `Δ` is reported · `--ablation none` runs a single arm
- In a 2-arm round, a `tool_used` grader with `tool: Skill` and a grader with `arm: with-only` are reported as indicators (`scored: false`) and do not count toward the score, unless `arm: both` is set · so a case that has only graders of this kind needs 1 more outcome grader

## Number of runs and pass threshold

The values in this section are starting values, not yet measured · adjust once there are real results from many rounds

- **Run each case 10 times** (`runs: 10`) · 3 rounds gives only the pass rates 0 · .33 · .67 · 1, and at .67 the 95% confidence interval (p ± 1.96√(p(1−p)/n)) is wide, ±.53 · 10 rounds narrows it to ±.29 · telling 80% from 95% apart takes about 72 rounds per arm, so 10 rounds catches only a clear regression, and is not used to judge small differences
- **Report 2 values** from the per-round results in `aggregate-result.json`: **pass@k** = at least 1 of k rounds passes (can the skill do it?) · **pass^k** = all k rounds pass (can it be trusted every time?) · a single average hides a case that passes only half the time
- **Separate 2 kinds of criteria** instead of a single threshold of 0.8 · run them separately with `--tag`:

| Kind | Cases (tag) | Pass criterion |
|---|---|---|
| Measure capability | `trigger` · `behaviour` | Mean score ≥ 0.8 (`--threshold 0.8`) |
| Guard against regression | `regression` · `guard` · `no-trigger` | Pass all k of k rounds (`--threshold 1.0`) · failing 1 round = regression |

- **A single number hides differences.** Report secondary indicators too (example from the course queue-scheduling work 2026-11-04: total time stayed at 125 minutes under every weight setting, but the work moved to an account that was not near its reset). A case where every arm scores the same does not count as evidence (see section 6 of `SKILL.md`).
- **Report tokens and time per arm** besides pass or fail · 2 papers report that a skill that looks relevant makes things slower or costlier (arXiv 2608.11888: 307 failure cases, 182 of them slower or costlier · arXiv 2608.23067: tokens up 72–394%, low to medium confidence · seen through a 2026-11-04 summary; see [`skill-evaluation-evidence`](skill-evaluation-evidence.md)) · the result of `claude plugin eval` already has `costUsd` per case
- **The judge must be blind.** Do not say which version has the skill · swap the A/B labels · write the criteria before reading results · if `tool_used: Skill` passes but `Δ` is negative, suspect the judge first, then rerun with `--judge-model sonnet` (Claude Code docs, via a 2026-11-04 summary)

### Making trigger measurement tighter (more exact than our minimum)

Our minimum is 1 `-trigger` case per skill · when the description is a real problem (the skill is not called, or collides with a sibling), use the method from agentskills.io optimizing-descriptions and anthropics/skills skill-creator, which agree (seen through a 2026-11-04 summary):

1. A set of about 20 queries: 8–10 should open the skill · 8–10 should not, focusing on near misses (the same words but a different job)
2. The query set is written by a person or agent who has never seen the description (a BM25 simulation in the course got hit@1 98.3% on queries it had seen and 80% on new ones, n=60, 2026-11-04)
3. Run each query 3 rounds · it passes when the open rate is > 0.5 (for a query that should not open, the rate must be below 0.5 · this part is our own interpretation, the source states only the should-open ones) · count it as opened only when a real `Skill` tool call is seen
4. Split train 60% and validation 40% · edit the description using train · choose the version using validation · at most 5 rounds

You can compare 2 versions of a description or skill with a script: `node scripts/evals/ab/ab-run.mjs --cases cases.json --plugin <plugin> --baseline-ref origin/main` · it runs the baseline (the version in a git ref) and the working tree through `claude -p --plugin-dir` · keep the baseline by commit id, and rerun when the ref moves or the case set or model changes (idea from crowdstrike-falcon-fusion run-ab-test.sh · MIT · viewed 2026-11-10) · scores with regex only, unlike `claude plugin eval`, which uses several grader kinds

Format note: skill-creator's `evals/evals.json` is a different format from `claude plugin eval` (neither reads the other's files) · `claude plugin eval` needs git 2.31 or later

## Run environment

- Each round = a new home · a new workspace · a `claude -p` that loads only this plugin · no machine CLAUDE.md · no auto memory · no other plugins · so evals of the central skill run directly at `plugins/superuser`
- **A plugin that has `dependencies` does not load at all in an eval** (`plugin_errors: dependency-unsatisfied` in the trace kept by `--keep-temp`) · there is no option to load dependencies · the result is that the with-plugin round has none of our skills, trigger cases open the skill 0/3 in every case, and Δ is near 0 · `ตรวจจริง` 2026-10-26 Claude Code 2.1.310 (ran all 5 sets, 59 cases, cost 35.39 dollars before we found out) · **How to run:** `node scripts/evals/plugin-eval.mjs <plugin> [--only <case-name regex>] [eval arguments]` makes a copy with `dependencies` removed, tries 1 trigger case first, and if the skill is not opened it stops before running the whole set (really tested 2026-10-26 with `flood-prep-trigger`) · `--case` accepts globs but not braces `{a,b}-*` (gets 0 cases with no error), so use `--only` instead · the central skill of superuser will not be in that round
- **Turn off the installed copy of the plugin before measuring with `--plugin-dir`**, otherwise the description of that copy gets scored instead without anyone noticing · `plugin-eval.mjs` warns, and `ab-run.mjs` stops when it finds a plugin that is installed and enabled ([`eval-loop-rules`](eval-loop-rules.md) section 1)
- Tools given without asking: read-only (`Read` `Glob` `Grep` `Skill` `Agent` `TodoWrite` …) · add more with `--allow-tools Write Edit "Bash(npm test *)"` · Bash runs under the system sandbox — **Windows has no sandbox, use WSL2** · the `evals/` folder is hidden from the agent

## Commands and exit codes

```
claude plugin eval plugins/superuser --trust-plugin --case "human-writing-*" --no-publish --max-cost-usd 5
claude plugin eval plugins/superuser --trust-plugin --tag behaviour --json behaviour.json --threshold 0.8 --model claude-sonnet-5 --judge-model claude-haiku-4-5 --no-publish --max-cost-usd 20   # CI ความสามารถ
claude plugin eval plugins/superuser --trust-plugin --tag regression --json regression.json --threshold 1.0 --model claude-sonnet-5 --judge-model claude-haiku-4-5 --no-publish --max-cost-usd 20   # CI กันถอยหลัง (ทำซ้ำกับ --tag guard และ --tag no-trigger)
```

(The Thai comments mean: CI for capability · CI against regression, repeat with `--tag guard` and `--tag no-trigger`.)

Other flags: `--runs` · `-j/--concurrency 1–8` · `--ablation none|with-without` · `--tag` · `--scaffold` · `--mocks record|off` · `--output-dir` · `--report` · `--verbose` · `--keep-temp` · put the target before `--tag` `--allow-tools` `--json`

| exit | Meaning |
|---|---|
| 0 | Every case reached the threshold |
| 1 | A case is below the threshold · cases could not load · no cases · API broke · folder not trusted without `--trust-plugin` |
| 2 | Run incomplete (`partial: true`) because the cost cap was hit or auth was rejected |
| 130 / 143 | Interrupted / stopped |

`Δ` does not change the exit code · the JSON result has `aggregates.overallScore` `casesPassed` `casesTotal` `meanDelta` and `cases[].aggregates.score` · `delta` · `costUsd`
