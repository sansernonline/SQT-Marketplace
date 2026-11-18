# Examples for this plugin — model tiers · team patterns

Moved from `SKILL.md` sections 5 and 9. The rules live in `SKILL.md`. This file has only examples.

## Model tiers — example tasks (section 5)

The rules, model names, and mid-task switching are in `SKILL.md` section 5 (handing out work). This file has only example tasks for each tier.

| Tier | Example tasks | Example often chosen wrongly |
|---|---|---|
| **Large** `opus` | Design the whole user-permission system · compute payroll amounts sent to the bank · draft an email telling customers about a data leak · final check of risky work | A piece writing the manual for the user-permission system → large, not medium, because the whole job is risky |
| **Medium** `sonnet` (default) | Add a product search page · fix a calendar bug · draft an install guide · search and compare libraries · first-round check | Move callbacks to async/await → medium even with tests, because a way to fix must be chosen |
| **Small** `haiku` | Fill postal codes into a table from a given list · convert a book list from CSV to JSON in a given structure · search a word in documents and report the lines | Trim trailing spaces from every file → write a script, do not send a worker |
| **`fable`** (not the default) | A piece where opus failed twice, even after raising effort to high and the account has credit | Using fable from the start on a hard task → start with opus first |

## Team patterns — how each is used in this work (section 9)

How to do each, its cost, and its traps are in `agent-patterns`.

| Pattern | How it is used in this work |
|---|---|
| **Planning** | playbook → todo · long job → a plan in `CONTEXT.md` section "ความคืบหน้า" (progress) |
| **ReAct** | Every step: think → do 1 thing → look at the real result → next step |
| **Reflection** | The playbook's check step uses a fresh `reviewer` (or a read-only specialist reviewer) that has not seen the work before, not the one that did it |
| **Multi-Agent** | Section 5 · independent pieces split among several workers, handed on through files |
| **Mixture-of-Agents (MoA)** | A wrongly chosen path that would be very expensive: 3 `brainstormer`s from different angles, then merge |
| **Reranker** | playbook `research`: gather sources widely → score → read in full only the top scorers |
