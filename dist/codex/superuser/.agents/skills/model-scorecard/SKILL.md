---
name: model-scorecard
description: Use when comparing which model fits which step
---

# model-scorecard — which model fits which step, judged from the project's real work

> **One rule:** the data stays in its own project (`.claude/superuser/log/`) and is never written outside the project · combining several projects happens only when a person asks and names the folders.

## Use when

- Someone asks which model fits which step · compare tokens, speed and value per model from work already done
- Before changing the default model of an agent or a step (for example, letting the reviewer use Sonnet instead of Opus), you want to see numbers first
- A person asks to combine results from several projects to tune a plugin (`--rollup`, step 3)

Do not use when: the person only tells you to change the model for this task → just do as told.

## Use another skill instead, or together

| Situation | Use | Reason |
|---|---|---|
| Ask the current price of a model | `research-with-sources` | Prices change, so open the official price page |
| Decide which skill to fix from the lessons of a task | `session-lessons-to-skills` | This skill gives numbers, it does not decide what to fix |
| Want to test models against each other on the same problem | `scripts/evals/models/` in the SQT-Marketplace repo | The real work log can only answer for the models in use · a head-to-head test can cover every model (costs money) |

## Where the data comes from

The `superuser` hook records it by itself in `log/<date>/runs.jsonl` (you do nothing, if the `log` module is on):

Fields of each line type (`run` · `result` · `feedback` · `expect`): [references/log-format.md](references/log-format.md) · open it when you read or debug the log.

- The step (`plan` `code` `review` `research` `design` `write` `test` `other`) is assigned from the word rules in `hooks/step-rules.json` · you can edit that file without touching code
- A brief that has the line `ขนาด: <N>k` (size) → the `run` line gets `estimate_tokens` · the report heading **ขนาดจริงต่อที่ประเมิน** (actual size per estimate) gives the k value per step (k ← 0.6k + 0.4 × actual ÷ estimated) · the team lead multiplies k by the size estimated when splitting the next job (`superuser` → `references/team-roles.md` "แบ่งงาน" (splitting work) item 2) · actual size = `subagent_tokens` from the background task-finished message, or the sum of the 4 token fields (input · output · cache read · cache write) of work that waits for the result · whether these 2 routes count the same way is `ยังไม่ได้ตรวจ` (not yet checked) against a real log · until checked, use the k from the same kind of work you are about to estimate
- The report has 3 headings used to decide instead of a feeling (every number comes from a real `run` · a step with fewer than 5 samples is tagged "ตัวอย่างน้อย" (few samples) and must not be used to decide):
  - **Job size from past work** per step: P10 · P50 · P90 of the tokens actually used, with the PERT expected value = (O + 4M + P) ÷ 6 (O = P10 · M = P50 · P = P90) ± (P − O) ÷ 2.56 · use it as the size of a piece the team lead cannot size (`superuser` heading 2) · the k above still adjusts a size you estimated yourself
  - **Model per step** (Thompson sampling): draw each model's pass probability from Beta(1 + pass, 1 + fail), then divide by the cost per task, and count how often each model is the best value · at 95%, use that model as the default for the step · below that, pick per task with `scorecard.mjs --pick <step> [--candidates a,b]` (needs at least 2 challengers)
  - **Work distribution**, counted from the log itself: model given · effort given · runs per model · most subagents at the same time per session (`ts` within 5 seconds, not counting review) and the number of times it exceeds 8 · brief completeness (`brief_sections` ÷ 5) · passed the first round, with the Wilson 95% interval and how many rows have an empty `verdict` · expected before ordering, and actual ÷ expected · a field the log lacks shows "cannot measure — needs field <name>"
  - **Iron rule:** work on the "รออนุมัติ" (awaiting approval) list, or risky work (money · law · health · sending to outsiders), is never randomly assigned to a small model · use the large tier from the table in `superuser` heading 5 · the numbers are supporting data, not orders
- For days with no `runs.jsonl` (old logs), use `main.jsonl` + `tokens.json` for a rough version, with no review results

## Steps

1. **Report on this project** (safe: reads its own log and writes a file in the log folder):
   `node <plugin>/skills/model-scorecard/scripts/scorecard.mjs` → `log/MODEL-REPORT.md` · pick other places with `--log` and `--out`
2. **Read the report with care:** a cell tagged "ตัวอย่างน้อย" (below 5) must not be used to decide · passed the first round, and the fix round, tie the reviewer's result to the latest earlier work in the same session, which is an estimate · prices are in `references/prices.json` · if empty it shows "ยังไม่มีราคา" (no price yet): fill it in from the official price page and add the date checked
3. **Combine several projects (only when a person asks):**
   `node scorecard.mjs --rollup <project folder 1> <project folder 2> --out <file>` · read-only · `--out` must be outside every project that is read (the script refuses it by itself) · read only the folders the person named, and do not go looking for other projects
4. **Pick a model for the next task:** `node scorecard.mjs --pick <step>` when the report says it has not reached 95% and the work does not hit the iron rule above · put the result in the model field of the brief
5. **Decide:** the 3 findings at the end of the report are a starting point, not a conclusion · to change the model of a step, state the numbers and the sample count, then record it in the `decision-log` table · the user decides anything that affects his or her costs

Test the script: `node scripts/scorecard.mjs --self-test`

## Tools for reading transcripts and logs

Besides the hook's log, you can also read session transcripts (`~/.claude/projects/`) with 4 Node scripts in `scripts/` · they read as a stream and send no raw lines into context · printed text goes through the hook's secret stripper · details of each are in `references/log-tools.md`

| Need | Run |
|---|---|
| Find when topic X was done (this project) | `node scripts/session-search.mjs <word>...` |
| Find router gaps from real prompts | `node scripts/router-replay.mjs --installed` |
| Shrink the log into `.claude/superuser/digest.md` (blocked or waiting items are not cut) | `node scripts/digest.mjs` |
| See tokens per skill per subagent type, cache misses, most expensive message | `node scripts/usage-report.mjs --json`, read the numbers, write 3–5 findings, then `--findings <file>` to get HTML |

Across projects (`--all`) only when a person asks · test: `node scripts/log-tools.test.mjs`

## Real example

A made-up case: is Opus for the reviewer too expensive → [references/example.md](references/example.md)

## Check before sending

- [ ] Every number cited states its sample count and does not use a cell tagged "ตัวอย่างน้อย"
- [ ] No combined result file was written into a project that was read
- [ ] Price figures come from `references/prices.json`, which has a source and a date checked

Sources: [references/sources.md](references/sources.md)
