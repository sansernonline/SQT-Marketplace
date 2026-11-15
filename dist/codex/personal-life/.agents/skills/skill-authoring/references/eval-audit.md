# Auditing an inherited eval set, and measuring across CLIs

## Eval audit: make an inventory table, then diagnose cell by cell

Use when you take over an eval set you did not write · after a model change · or when scores are green but the skill still fails in real work. One question: **does this set catch real failures?**

1. **Make the inventory table.** Read from the real files, do not guess:

| Column | What it answers |
|---|---|
| Case | Name · type (trigger · behaviour · regression · guard · no-trigger) · number of rounds |
| Grader | Grader kind (`regex` · `tool_used` · `llm` …) · does it check something visible in the real answer? |
| Judge | Model · how the criteria are written · has it ever been calibrated against human labels ([`eval-loop-rules`](eval-loop-rules.md) section 5)? |
| Data | Where the prompts came from (real work · self-written) · who wrote them · did the writer see the description first? |
| Coverage | How many cases check each rule of the skill · which rules have none at all |

2. **Diagnose row by row** with this set of questions. For each finding, write down 1 proposed fix per problem:

| Symptom | Diagnosis | Fix |
|---|---|---|
| Case passes in both arms (Δ ≈ 0) | The prompt is too easy, or the skill does not help | Make the prompt harder, or shorten the skill |
| A "must not happen" case has no paired case | A dead set would pass too | Add the paired case (section 2 of eval-loop-rules) |
| Case is all `llm` | It wobbles, and checking the same way as a person is not proven | Move facts to `regex` · calibrate the judge against labels |
| A rule of the skill has no case | Regress and nobody knows | Write a case from that rule |
| Trigger prompt written by someone who saw the description | Measures too high | Have an agent that never saw it rewrite it |
| No token or time report | A skill that got slower or costlier can pass | Read `costUsd` per arm |

3. Give the user the summary numbers and the proposed fixes to decide. Do not edit cases or criteria yourself during the audit.

Tools that count the mechanical parts: `node scripts/evals/scorecard.mjs` (counts cases per skill) · `node scripts/evals/skill-grades.mjs` (pass rate with confidence interval)

## Measure scenarios across CLIs (optional, use when the skill must work outside Claude Code)

When a skill is distributed through `dist/` to other agents (Codex · Gemini CLI), measuring in Claude Code alone cannot tell you it works there:

- **1 scenario = a prompt + a grading criterion** (write the criterion as something visible in the result, such as "uses the correct API, does not call raw HTTP")
- Run the same prompt under each CLI, having it read the `dist/` version of the skill · keep the answer and the log of tool calls
- **Have a different agent judge**, not the one that did the work · the judge does not know which CLI the result came from
- **Keep it on this machine only.** Results and answers do not leave the machine (they may contain code or project data)
- It finds what Claude Code does not show: a skill that was edited and now calls an API directly or picks the wrong mechanism
- For now only the Claude Code runner exists · this machine has `codex` but not `gemini` (checked 2026-11-10), so there is no cross-CLI script yet · when you write one, use the same structure as `scripts/evals/ab/ab-run.mjs` (cases.json + regex score) and run it in a separate worktree per `AGENTS.md`

## Sources

- outputai (Apache-2.0) · skills/output-eval-audit/SKILL.md · viewed 2026-11-10 → the inventory table and diagnosis
- netlify-skills (MIT) · axis-scenarios/README.md · viewed 2026-11-10 → measuring across CLIs
