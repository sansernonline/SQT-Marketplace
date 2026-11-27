# agent-patterns — how to run each pattern

Open this file the first time you use a pattern in a task, or when you are unsure of the steps.

- Contents: [1 Planning](#1--planning--plan-first-then-work-one-item-at-a-time) · [2 ReAct](#2--react--think--act--check-result-repeat-until-done) · [3 Reflection](#3--reflection--do--another-agent-checks--fix) · [4 Multi-Agent](#4--multi-agent--several-agents-one-job-each-handed-along-a-chain) · [5 MoA](#5--mixture-of-agents-moa--same-task-different-angles-then-merge) · [6 Reranker](#6--reranker--score-then-pick-the-best-match) · [7 ledger](#7--claim-ledger--when-a-conclusion-must-be-proved-item-by-item) · [wait for sub-agents](#waiting-for-sub-agents-without-asking-in-chat)

## 1 · Planning — plan first, then work one item at a time

1. The playbook you chose is the plan: copy its steps into the todo list as they are. If no playbook fits, write the plan in this shape: understand → plan → do → prove → report
2. Every item in the plan has a checkable "เสร็จเมื่อ" (done when). If you cannot write the condition for an item, split it smaller
3. Work one item at a time, in order. If you find mid-way that the plan is wrong, adjust the plan under "Re-plan" below first. Never go off-plan silently
4. If the work is long or takes several days, write the plan to a file (`docs/BUILD-PLAN.md` or `CONTEXT.md`), not keep it in chat
5. Work that edits many files as a set, deletes or moves things, or is hard to undo → write a list of what will change (file · what changes · how to check it) and check the list with a script before touching the real thing · it does not replace the check after the work · if the diff can be explained in 1 sentence → skip

Trap: a plan so detailed that you never start, when a 3-item plan is enough for half an hour of work.

### Re-plan (Dynamic) — when reality is not what you thought

After every piece, the team lead asks itself one question: **does the remaining plan still reach the goal?** If yes, carry on. If not, re-plan. But re-plan only for one of these 3 reasons, because re-planning without a reason makes the work loop without progress.

1. The result of a finished piece reveals work the plan does not have (for example, dirty data must be cleaned first)
2. One piece cannot be done as planned (all of ReAct item 4 has been tried)
3. The user or the owner sends new information that changes the requirements

**Per-round questions (progress ledger)** — for long work or many sub-agents, answer 5 short questions after every piece: is the whole job done · are we looping in the same place · is there progress · who does the next piece · what do we tell them · if "no progress" twice in a row, count it as reason 2 and re-plan (idea from Magentic-One and Microsoft Agent Framework, which count stalls, then re-plan, and have a reset cap)

Number the new plan (v2 · v3) and write 4 fields into the plan file or `CONTEXT.md`:

| Field | What to write |
|---|---|
| Reason | Which of the 3 reasons, and what result shows it |
| What changes | Add · cut · split · merge · reorder · change which pieces must wait |
| What it affects | Which pieces must be redone · trace from the "ต้องรอชิ้นไหน" (waits for which piece) column of the task-split table |
| Reusable | Pieces already done and not affected: keep and reuse, never redo · prove the reuse is real: store a hash of the old result, then check the event log that the piece was not run again, not just write "reused" (idea from lab 04_Basic_AI_WORFLOW fields `no_duplicate_execution` · `artifact_hashes_valid` · caution: the checker is written by the same agent that does the work and runs in the same chat with a simulated role, so it is a claim, not a real measurement) |

- A piece that is cut gets the status `ตัดออก` (cut) with a reason and is not deleted from the plan · never cut a user requirement silently
- At most 3 re-plans per job. When used up and it still does not settle, stop re-planning, finish the parts that can be done, and report what is still undecided
- **Requirements change mid-job** (reason 3): keep the old result first (move or copy to `_to_delete/` or the first round's folder) → check the old result against the new criteria to see which items fail → redo only the failing pieces → count as 1 re-plan
- Also record the re-plan as 1 row in "การตัดสินใจ" (decisions) (`decision-desk/decision-log`)

Work whose path is clear from the start does not need this part. If the plan never needs adjusting, do not create a v2 for show.

## 2 · ReAct — think → act → check result, repeat until done

1. **Think** — what will this step do, and what result do you expect to see (write 1 line)
2. **Act** — do 1 action: run a command · search the web · read a file · calculate
3. **Check result** — read the real result and compare it with what you expected. If it matches, go to the next step. If not, go back and think again from the result you saw
4. Fails 2 rounds → split into smaller steps or change method, do not retry the same way · reaches 3 rounds → mark the status "ติด" (blocked) and move to other items

Traps: doing many things at once and only then looking at results, so when it breaks you do not know where · trusting a result that "should" have come out without opening the real result.

## 3 · Reflection — do → another agent checks → fix

1. The doer hands in the work with the checking criteria (the 3 criteria in item 4 of `superuser` of that plugin)
2. **The checker must be a fresh `reviewer` (or a specialist reviewer) who has not seen the work**, because checking yourself in the same context sees only what you meant to do, not what you did
3. The checker returns a list: problem · where in the work it points · evidence · level (สูง · กลาง · ต่ำ — high · medium · low)
4. The team lead confirms every item before ordering a fix. Drop items that cannot be confirmed
5. **The checker must compare against the real thing** — test results · files opened and read · sources searched · screenshots, not loose opinion, because research found that a model that corrects its own answer without real material to compare against usually gets worse (GPT-3.5 on CommonSenseQA scored 75.8 before correction and 38.1 after the first correction round · Huang et al. ICLR 2024) · a criterion with no evidence counts as failed, and say what is missing
6. After fixing, send a **fresh** reviewer to check again, following the check-loop rule in `team-roles` of `superuser` (no high or medium items left · when the round cap (medium work 3 · large or risky work 5) is reached and it still does not pass → stop looping, finish the other parts, and report the remaining items)

7. **The fixer moves up with the rounds** — fix rounds 1–3 use the same agent as that piece · rounds 4–5 (large or risky work only) switch to a fresh agent one level higher on the ladder in `superuser` item 5, with a report every round · medium and low items chosen not to be fixed go into the deferred-items ledger under "ค้างอยู่" (pending) and are closed at the end (details in `team-roles` "รอบตรวจ" (review rounds))

Model level of the checker: equal to or higher than the doer (from round 2 up of medium work, use the middle level per `team-roles` "รอบตรวจ") · never use a small model to check a large model's work (models like work written the way they write it) · the instruction to the checker does not include the team lead's opinion.

## 4 · Multi-Agent — several agents, one job each, handed along a chain

1. The team lead splits the work into pieces, 1 piece per agent by role, and says what this piece takes from the previous piece and what it hands to the next
2. Hand over through files, not memory: agent A writes the result to a file → agent B reads that file
3. Pieces that do not depend on each other go out at the same time, and pieces that depend on each other go in chain order
4. The team lead checks the result of every piece before handing on, because if an earlier piece is wrong, every later piece is wrong with it
5. Never let 2 agents write the same file at the same time
6. **Agree on the data shape before splitting** — the first piece fixes the data names, file shape or interface that all pieces share, and then every piece returns the same shape: status (`เสร็จ` · `ติด`) · result (path) · assumptions used · pieces that did not agree beforehand often use different names and then break at merge time
7. **Release a piece as soon as it is ready** — a piece whose awaited work is all done can go out right away, without waiting for the whole round (the LLMCompiler research found up to 3.7 times faster than going step by step)
8. **Work with many small decisions that must stay consistent** (the same part of the code · a continuous story) should not be split in parallel. Do it in one chain, or send a "shared artifact" clear enough that every piece decides the same way, because sub-agents that cannot see each other's work often choose differently and then break at merge time (Cognition "Don't Build Multi-Agents" · different from searching and reading, which split well in parallel · Anthropic multi-agent research system)
9. **Requirements that contradict each other** — if the first piece finds the owner's requirements contradict each other, split out a "collect the conflict" piece that records both sides with evidence without picking a side, tag it `(รอยืนยัน)` (awaiting confirmation), and make the merge step wait for this piece too · the merge step may use only pieces that are `เสร็จ` and returned in full shape

Traps: splitting so finely that handover costs more time than doing the work · a later agent guesses what the earlier one did instead of reading the file.

## 5 · Mixture-of-Agents (MoA) — same task, different angles, then merge

1. Give the same task to 3 agents (at most 4 for costly work), and put in a difference on purpose: different viewpoints, or different constraints, or different model levels
2. Write the judging criteria before release. The criteria stay with the team lead and are not sent to the agents doing the work
3. Send all agents at the same time. Each sends its result back. The team lead saves them to files and passes the paths to the aggregator
4. **Aggregate** — the aggregator is a new agent (`brainstormer`) that reads every answer, scores it by the criteria, lays them out in one table, and points out every conflict, but does not cut off any path and does not choose for you — the team lead chooses, then borrows the strengths of the other paths to add
5. If the result is an on-paper option → no need to enter a review round · if the result is a work product that reaches other people → pass Reflection before sending

Cost: 3–5 times the effort of doing it once, so use it only where a wrong choice is expensive.

## 6 · Reranker — score, then pick the best match

1. **Collect wide** — search or list 10–30 items first (sources · files · options · job ads · products)
2. **Set 3–4 criteria**, score each 0–3, for example matches the question · trustworthy (official > standard > tool maintainer > others) · recent enough · complete
3. **Score one item at a time** — if there are many items, have a small-level sub-agent score the first round, and when 5–8 items remain for the last round, have a middle or large level score again
4. **Pick top-k** (normally 3–5), then read in full only the chosen items, and do not read the dropped ones · for pairwise comparison, judge 2 rounds with the order swapped; results that disagree always count (model judges lean by order and favour long answers)
5. Show the score table in the report or appendix: item · score per criterion · total · chosen or not, so the reader sees why this one was chosen

Use together with the "≥ 3 sources confirm the same" rule of `superuser`, where the Reranker picks the sources and the 3-source rule decides whether to believe them.
If it is a system the user builds (Retrieval-Augmented Generation (RAG) in a real app), use a real model-based reranker per `ai-engineering` of software-development, because this file covers only how an agent team works.

## 7 · Claim ledger — when a conclusion must be proved item by item

Use when the work's result is several claims that must all be true (conclusions of a search · an analysis · claims that code does certain things), instead of the plain Reflection list of findings.

1. Record every claim the conclusion depends on: `node scripts/ledger.mjs add <file.json> <id> "<text>"` · the starting status is `OPEN`
2. A **fresh** checker checks one item at a time and records the result: `mark <file.json> <id> PROVED|REFUTED|OPEN --evidence "<file:line or run result>"` · `PROVED` and `REFUTED` need evidence · no evidence = still `OPEN`
3. Ask the script what to do next: `next <file.json>` prints 1 line saying which item to check next · which to check again · which to withdraw from the conclusion · or that you can finish · do what that line says
4. **Minimum 2 rounds** — an item `PROVED` by a single check is not done. Another fresh checker must try to refute it and fail (`--min-rounds` is adjustable · own default, not measured), because the one who proves it usually feels overconfident
5. `REFUTED` → withdraw that item from the conclusion, then `close <file.json> <id>` · `OPEN` after 4 checks (`--max-rounds`) → stop and report that it was not proved and what is missing
6. Test: `node --test scripts/ledger.test.mjs`

## Waiting for sub-agents without asking in chat

`node scripts/keep-waiting.mjs --until-file <report file> --seconds 100` sleeps for less than the Bash timeout (120 seconds), then prints `KEEP WAITING` (run it again) or `DONE` when the file appears · works with Node on Windows without any other shell

Sources: ReAct (Yao et al., 2022) · Reflexion (Shinn et al., 2023) · Plan-and-Solve (Wang et al., 2023) · Mixture-of-Agents (Wang et al., 2024) · multi-agent frameworks (AutoGen · MetaGPT) · cross-encoder reranking · [Huang et al. 2023 · LLMs cannot self-correct reasoning yet](https://arxiv.org/abs/2310.01798) · [LLMCompiler](https://arxiv.org/abs/2312.04511) · [ADaPT](https://arxiv.org/abs/2311.05772) · [Anthropic: multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) · the Loop · Graph · Dynamic templates of the AI Workflow course (CWN2026) by the repo owner · read 2026-10-26

More sources (see 2026-11-10): fix rounds that move the agent, and the deferred-items ledger: superpowers (MIT) · `skills/subagent-driven-development/` · the claim ledger and the minimum rounds: math-proof (has a LICENSE, type not yet identified · took the mechanism only) · `agents/math-proof-judge.md` · `keep-waiting`: claude-security (All rights reserved · took the mechanism only) · `scripts/keep-waiting.sh`
