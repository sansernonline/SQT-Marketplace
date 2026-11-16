---
name: decision-scoring
description: Use when ranking options by numbers, not gut feel
---

# decision-scoring — decide with numbers, not feelings

> **One rule:** for every decision with 2 or more options, put the numbers into a JSON file and let `decide.mjs` do the thinking. Hard rules filter options out first and are never turned into scores. A result that is not stable, or that concerns money, law or health, is a proposal and a person decides.

## Use when
- Choosing 1 from several options (funds · carriers · job offers · quotations · buy or build)
- The result depends on an uncertain future (interest rates · fight the claim or take the refund · extended warranty or not)
- Choosing several things under a budget, time or quota (tax deductions · flash-deal items · segments)
- Ordering work (bugs · vulnerabilities · emails · daily tasks)
- Picking the best of several attempts already made · deciding whether to review one more round

Not for: a direct formula exists (loan installment · tax · position size) → that task's skill · taste (color, icon, tone) → a person looks · only one option · option numbers not yet available → `research-with-sources` first · no options yet → `brainstormer` · splitting big work or order of pieces → `parallel-split-and-merge` (`plan.mjs`) · which model fits which step → `model-scorecard` · recording the decision → `decision-log` (paste this skill's result table in).

## Steps
1. **Find the script.** Installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/superuser/*/skills/decision-scoring/scripts/decide.mjs | sort -V | tail -1`. In the SQT-Marketplace repo: `plugins/superuser/skills/decision-scoring/scripts/decide.mjs`. Node only, no dependencies.
2. **Write the hard rules first** (over budget · risk above what is acceptable · illegal · on the awaiting-approval list). Put them in `must`. An item that fails is cut no matter how good its other scores are. Never convert a hard rule into a weight.
3. **Choose at most 5–6 criteria** measurable as numbers, each with `better` (`high` or `low`). For an opinion criterion, score 1–5 and write who gave the score.
4. **Weights come from the user.** If none, use the values that task's skill proposes and record it under **ตัดสินใจเอง**. If neither exists, weight equally.
5. **Every number has a source.** A number that changes over time has the source and the date checked. If you do not know, ask or write `(รอยืนยัน)`; never guess into the file. If a criterion's value is missing, the script drops that option with the reason and does not fill in zero.
6. **Pick the command** from the table, copy the matching `templates/` file, fill it, and run `node decide.mjs <command> <file.json>`. It gives a markdown table with a **ผล** line. Add `--json` for further calculation. Keep the input file in the work's `_to_delete/` (or attach it in `decision-log` if it must be checked later).
7. **Read the result line.** If it says `ยังไม่นิ่ง` or `2 เกณฑ์ไม่ตรงกัน` or `สูสี`, give the person the top-ranked options with the criteria that cause the flip, and do not choose for them.
8. **Answer** with the script's table + 1 line of result + the criteria that cause the flip (if any). For money, law, health, close by saying it is supporting information and the user decides.

| Question | Command | How it thinks | Template |
|---|---|---|---|
| Which is best, on several criteria | `score` | Hard rules cut options → every criterion to 0–1 (min-max) → apply weights → shift each weight ±20% one at a time to see if rank 1 flips | `templates/score.json` |
| Result depends on the future | `payoff` | Expected value (odds known); minimax regret if odds unknown or the choice cannot be undone | `templates/payoff.json` |
| Choose several under a budget | `knapsack` | Up to 20 items: tries every set, gives the best and how far the runner-up set is behind in %; more: value per cost, compared with the single highest-value item (close, not guaranteed best) · `max_items` limits count · `must` forces a pick · `groups` + `group` cap cost per group | `templates/knapsack.json` |
| What to do first | `priority` | `rice` people × impact × confidence ÷ effort (impact 0.25–3 only) · `wsjf` (value + time urgency + risk reduction) ÷ size · `eisenhower` 4 groups, then urgent × important ÷ minutes · `"must_first": true` for an item that makes the result wrong or unsafe goes to the top regardless · duplicate names warn | `templates/priority.json` |
| Which version is better, scoring directly is hard | `pairwise` | One pair at a time, positions swapped in every pair, strength by Bradley-Terry · a pair where the first (or last) placed always wins always counts | `templates/pairwise.json` |
| Is one more review worth it | `review` | Expected value of items found next round (this round's value × decay) vs the price of 1 round · a remaining high item always needs a re-check · the round cap is a hard rule | `templates/review.json` |

## Traps
- min-max with 2 options gives 0 and 100 on every criterion; a tiny difference looks big, so also look at the raw numbers in brackets.
- Goodhart's law: a number used for control stops telling the truth. Use several criteria and have a person spot-check.
- An LLM judge leans by position and favours long answers; `pairwise` must swap positions in every pair; direct scoring leans more.
- Script defaults are self-set, not measured: high item 3 · medium item 1 · review round price 2 (adjust via `value` · `round_cost`); weight shift ±20% · too-close below 60% (pairwise) · runner-up closer than 10% (knapsack) are constants.
- Never use the Kelly criterion with real money; position size uses `position-sizing`.

## Check before done
- `node decide.mjs --self-test` passes every case
- Hard rules are in `must`, not mixed in as weights
- Every input number has a source or `(รอยืนยัน)`
- A result that is not stable, too close, or with 2 criteria in conflict went to a person to decide

## References
- [`references/sources.md`](references/sources.md) — open when checking the source of a method, or to see the real example run
