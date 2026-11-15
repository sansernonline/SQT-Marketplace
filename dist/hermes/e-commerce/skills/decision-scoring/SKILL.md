---
name: decision-scoring
description: Use when ranking options by numbers, not gut feel
---

# decision-scoring — decide with numbers, not feelings

Lives only in plugin `superuser`; other plugins share it through `dependencies` · wording follows `human-writing`

> **One rule:** for every decision with 2 or more options, put the numbers into a JSON file and let `decide.mjs` do the thinking · hard rules filter options out first and are never turned into scores · a result that is not stable, or that concerns money, law or health, is a proposal and a person decides

## Use when

- Choosing 1 from several options (funds · carriers · job offers · quotations · buy or build)
- The result depends on an uncertain future (interest rates up or down · fight the claim or take the refund · buy the extended warranty or not)
- Choosing several things under a budget, time or quota (tax deductions · flash-deal items · segments to broadcast to)
- Ordering work (bugs · vulnerabilities · emails · daily tasks)
- Picking the best result from several attempts already made · deciding whether to review one more round

Do not use when: a direct formula already exists (loan installment · tax · position size) → use the formula in that task's skill · matters of taste (color, icon, tone) → a person looks · only one option, nothing to compare

## Use another skill instead, or together

| Situation | Use | Reason |
|---|---|---|
| The options' numbers (price, rate, fee) are not available yet | `research-with-sources` first | However good the formula, wrong input numbers give a wrong result |
| No options yet, need to think of paths first | `brainstormer` | This skill scores options that exist; it does not think of options |
| Split big work, order, which piece first, how many sub-agents | `parallel-split-and-merge` (`plan.mjs`) | A task graph has its own Critical Path Method (CPM) formula |
| Which model fits which step · size of a piece of work from old work | `model-scorecard` | Uses the project's real log |
| Record what was decided and why | `decision-log` | You can paste this skill's result table straight into that table |

## Find the script path

Installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/superuser/*/skills/decision-scoring/scripts/decide.mjs | sort -V | tail -1` · working in the SQT-Marketplace repo: `plugins/superuser/skills/decision-scoring/scripts/decide.mjs` · Node only, no dependencies

## 1 · Pick the command that matches the question

| Question | Command | How it thinks | Example file |
|---|---|---|---|
| Which is best, on several criteria | `score` | Hard rules cut options → turn every criterion into a 0–1 scale (min-max) → apply weights → shift each criterion's weight ±20% one at a time to see whether rank 1 flips | `templates/score.json` |
| The result depends on the future | `payoff` | Expected value (if the odds are known) and minimax regret (smallest worst-case regret) if the odds are unknown or the choice cannot be undone | `templates/payoff.json` |
| Choose several things under a budget | `knapsack` | Up to 20 items: tries every set and gets the truly best answer, and tells you how far behind the **runner-up set** is, in % · more than that: sorts by value per cost, then compares with the single item of highest value (close, not guaranteed best) · `max_items` limits the count · `must` forces a pick · `groups` + `group` set a cost cap per group | `templates/knapsack.json` |
| What to do first | `priority` | `rice` people affected × impact × confidence ÷ effort · `wsjf` (value + time urgency + risk reduction) ÷ size · `eisenhower` splits into 4 groups, then urgent × important ÷ minutes · an item that makes the result wrong or unsafe gets `"must_first": true` and goes to the top regardless of score · `rice` accepts impact 0.25–3 only · duplicate names raise a warning | `templates/priority.json` |
| Which version is better, when scoring directly is hard | `pairwise` | Compare one pair at a time, swap positions in every pair, then compute strength with Bradley-Terry · a pair where the one placed first (or last) wins every time always counts | `templates/pairwise.json` |
| Is one more review worth it | `review` | Value of the items expected to be found next round (this round's value × decay rate) against the price of 1 round · a remaining high item always needs a re-check · the round cap is a hard rule | `templates/review.json` |

Run: `node decide.mjs <command> <file.json>` gives a markdown table with a **ผล** (result) line · add `--json` when you will use the result for further calculation · keep the input file in the work's `_to_delete/` (or attach it in `decision-log` if it must be checked later)

## 2 · Steps

1. **Write the hard rules first** — an item that fails is cut right away no matter how good its other scores are (over budget · risk above what is acceptable · illegal · on the awaiting-approval list). Put them in `must` · never convert a hard rule into a weight, because other scores can drown it
2. **Choose at most 5–6 criteria** that can be measured as numbers, and say `better` (`high` or `low`) · for a criterion that is an opinion, score 1–5 and write who gave the score
3. **Weights come from the user.** If they give none, use the values that task's skill proposes and record it under **ตัดสินใจเอง** (decided on my own) · if neither exists, weight equally
4. **Every number has a source** — a number that changes over time has a source and the date checked · if you do not know, ask or write `(รอยืนยัน)` (awaiting confirmation), never guess into the file · if a criterion's value is missing, the script drops that option and gives the reason, and does not fill in zero
5. **Run, then read the result line** — `ยังไม่นิ่ง` (not stable) or `2 เกณฑ์ไม่ตรงกัน` (2 criteria disagree) or `สูสี` (too close to call) = give the person the top-ranked options with the criteria that cause the flip, and do not choose for them
6. **Answer the user** with the script's table + 1 line of result + the criteria that cause the flip (if any) · for money, law, health, close by saying it is supporting information and the user decides

## 3 · Traps to know

- **min-max with 2 options** gives 0 and 100 on every criterion, so a tiny difference looks like a big deal; also look at the raw numbers in brackets
- **Goodhart's law** — a number used for control stops telling the truth (Strathern 1997 summarized it: "when a measure becomes a target, it ceases to be a good measure"). People or agents will make the score good instead of doing the work well, so use several criteria and have a person spot-check now and then
- **An LLM acting as judge leans by position and favours long answers** — `pairwise` must swap positions in every pair · direct scoring leans even more
- **Defaults in the script are self-set, not measured** — high item 3 · medium item 1 · review round price 2 are adjustable in the input file (`value` · `round_cost`) · shifting weights ±20% · too-close below 60% (pairwise) · runner-up set closer than 10% (knapsack) are constants in the script
- **Do not use the Kelly criterion with real money** — a slightly wrong estimate of the odds bets more than you can afford; position size uses `position-sizing`

## Real example

**Task:** choose 1 fund of 3, accepting risk no higher than level 6, minimum purchase no more than 1,000 baht (hypothetical numbers in `templates/score.json`)
**Do:** `node decide.mjs score templates/score.json`
**Result (run 2026-10-27):** fund C was cut because its risk is level 8, though its return is the highest · fund A scored 60, B 40 · shifting each criterion's weight ±20%, A stayed at rank 1, so it is called stable

## Check before sending

- [ ] `node decide.mjs --self-test` passes every case (2026-10-27: 19/19)
- [ ] Hard rules are in `must` and not mixed in as weights
- [ ] Every number in the input has a source or is marked `(รอยืนยัน)` (awaiting confirmation)
- [ ] A result that is not stable, too close, or where 2 criteria conflict goes to a person to decide, and you do not choose for them

## Sources

The main sources really opened on 2026-10-27 · each method has at least 3 independent sources, and the full list is kept in this work's research round · several originals (Savage 1951 · Fishburn 1967 · Malcolm 1959 · Bradley & Terry 1952 · Dantzig 1957) are under copyright, so they are cited through works that cite the original

| Method | Main source | Note |
|---|---|---|
| minimax regret | [Stoye 2011 · Axioms for Minimax Regret](https://stoye.economics.cornell.edu/docs/AxiomsRegret.pdf) · [TU Delft · Games Against Nature](https://ocw.tudelft.nl/wp-content/uploads/Lecture_Slides_Chapter_10_.pdf) | |
| weighted sum + min-max | [Roszkowska 2026 · Entropy 28(1):114](https://pmc.ncbi.nlm.nih.gov/articles/PMC12839561/) · [Krishnan 2022 · Frontiers in Big Data](https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2022.990699/full) | |
| Shifting weights to see sensitivity | [O'Shea et al. 2026 · weight stability intervals of WSM](https://research.ucc.ie/en/publications/weight-stability-intervals-for-multi-criteria-decision-analysis-u/) | Weak: only the abstract was seen · ±20% is self-set |
| PERT 3-point (in `model-scorecard`) | [IBM · PERT General Information Manual E20-8067-1](https://bitsavers.org/pdf/ibm/generalInfo/E20-8067-1_PERT_A_Dynamic_Project_Planning_and_Control_Method.pdf) | |
| Eisenhower | [Eisenhower 1954 · speech at Evanston](https://www.presidency.ucsb.edu/documents/address-the-second-assembly-the-world-council-churches-evanston-illinois) | He quoted someone else · the 4-box table came later from Covey |
| Goodhart's law | [Strathern 1997 · Improving ratings](https://www.gwern.net/doc/statistics/decision/1997-strathern.pdf) · [Manheim & Garrabrant · arXiv 1803.04585](https://arxiv.org/pdf/1803.04585) | |
| Bradley-Terry + position bias | [Chatbot Arena · arXiv 2403.04132](https://arxiv.org/pdf/2403.04132) · [Zheng et al. · arXiv 2306.05685](https://arxiv.org/pdf/2306.05685) · [Wang et al. · arXiv 2305.17926](https://arxiv.org/pdf/2305.17926) | Computed with the MM method of Hunter 2004 (original not opened) |
| WSJF | [SAFe · WSJF](https://framework.scaledagile.com/wsjf) | |
| RICE | [Intercom · RICE](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/) | Only one primary source, and it is by the method's inventor |
| knapsack | [Duke CS 330 · Greedy Algorithm II](https://courses.cs.duke.edu/spring20/compsci330/lecture8scribe.pdf) | Greedy by best ratio is optimal only when fractions can be taken, so every set is tried when there are 20 items or fewer |
| marginal value of a review round | — | Value and decay rate are self-set, not measured · the stop-when-no-progress rule comes from `team-roles` |
