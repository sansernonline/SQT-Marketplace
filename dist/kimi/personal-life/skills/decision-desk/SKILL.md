---
name: decision-desk
description: Use when a call must be made, scored, voted on or logged
---

# decision-desk — find a fork, score it, vote, log it

> **The one rule:** decide yourself with a record a person can check and reverse; only what cannot be undone is flagged to the user, impact first, one question last.

The loop: fork found → score the numbers → vote → log the row. Flag only when the user must decide.

## Hard rules

- **decision-log:** An agent may carry on without asking only if a person can come back later, see what it chose, and reverse each decision one by one. 1 row per decision, logged the moment you decide. "ไม่เลือก" needs at least 1 real option. Never delete or edit an old row; add a new row at the top (`ผู้ใช้แก้ — แทนแถว <วันที่>`). A subagent reports its decisions back; the main agent writes the table.
- **decision-log:** Choose the way with the least impact (easy to undo · few files · matches the repo). Remaining facts (numbers, names, dates, budgets) must never be guessed: put `(รอยืนยัน)`.
- **decision-scoring:** For every decision with 2 or more options, put the numbers into a JSON file and let `decide.mjs` do the thinking. Hard rules filter options out first (`must`) and are never turned into scores. Every number has a source; never guess into the file.
- **decision-scoring:** A result that is not stable, or that concerns money, law or health, is a proposal and a person decides. Never use the Kelly criterion with real money.
- **flag-and-propose:** The one rule: open with the **impact**, close with **one question**. The middle is evidence and proposals, not a story of how you found it. The "ไม่งั้น…" part must be concrete. Never close with "มีอะไรให้ช่วยเพิ่มไหม".
- **flag-and-propose:** Flag only when a wrong choice cannot be undone; if it can be undone, choose yourself and log it. In SuperUser, finish the other parts first, then write it under **รออนุมัติ**; do not stop mid-task.
- **research-vote-decision:** An open item is closed only with a record a person can check: options · evidence from ≥ 3 independent sources · a vote · the choice · where it was applied.
- **research-vote-decision:** Money, law, price, license and budget items are decided the same way (plus a `payoff` table) and applied; none is sent back to the user as a question. Fewer than 3 independent sources → keep `(รอยืนยัน)`, do not fill the value.
- **research-vote-decision:** Apply the choice everywhere, then search again for the old value: 0 hits outside the history line.

## Parts

| When | Open |
|---|---|
| The agent decided something itself and must record it (what chosen · not chosen · why) | [parts/decision-log/guide.md](parts/decision-log/guide.md) |
| Found something that breaks the plan, numbers or files disagree, or you propose something unasked and the user must choose | [parts/flag-and-propose/guide.md](parts/flag-and-propose/guide.md) |
| 2 or more options with numbers: choose, rank, knapsack, priority, review panel or not | [parts/decision-scoring/guide.md](parts/decision-scoring/guide.md) |
| Open items in a document (`รอยืนยัน` · TBD · Q1..Qn) or "เลือกมาให้เลย" · "pick for me": research, compare, vote, apply | [parts/research-vote-decision/guide.md](parts/research-vote-decision/guide.md) |

## Check before done

- Every decision has a row with a chosen and a not-chosen option, and a source on each number.
- Hard rules are in `must`, not weights.
- Anything irreversible is under **รออนุมัติ** with one question, not asked mid-task.
- The chosen value is applied everywhere and the old value is gone.
