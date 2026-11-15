---
name: parallel-attempts-pick-best
description: Use when one attempt may lock in a wrong design or plan
---

# parallel-attempts-pick-best — try several ways, pick the best

> The first way you think of is often not the best, but once you start building, nobody comes back to try another.

Comes from `arena` in pstack.

If you only want options on paper before starting, with nothing built, use the agent `brainstormer`.

The line between this and [`adversarial-review-panel`](../adversarial-review-panel/SKILL.md): this skill builds several versions before choosing (no work yet, or the form is not settled) · the panel attacks 1 finished piece before shipping · they chain: pick the winning version, then send it to the panel.

## 1 · Set the task

0. **For work decided by taste (icons · logos · looks · colors), ask for 2–3 examples the user likes before the contest**, and put them in every contestant's task · with no examples, every direction guesses the taste on its own and the user will like none (3 plugin icon directions were all rejected on 2026-10-26) · before asking, search real work in the same category yourself, the way a designer would, by `design-references`, the type that fits the work (things that will sit side by side · the destination's rules · directions that are overused), then offer 3–4 directions with links for the user to choose from. Do not offer directions from a gut feeling (the user asked for this on 2026-10-26).
1. Say clearly what every contestant must deliver (a draft proposal · sales copy · a slide page · a plan · a function). Every contestant gets the same task, because the task is the contract.
2. Write 3–6 checkable scoring criteria, such as (writing) reads smoothly aloud · meets the requirements · cheaper than X · (code) passes tests — **keep the criteria with the chooser and do not give them to the contestants** · for the Thai language quality of writing, do not let models vote a ranking. The owner chooses, and a model can only list the `human-writing` rule codes it finds in each entry.
3. Choose the number. Normally 3 contestants, and at most 4 for big or costly work.
4. The difference must come from somewhere, because in Claude Code the models come from one vendor.
   - **Default:** give each contestant a different constraint, such as "at most 1 page" · "start from the reader's question" · all use the same agent type + model + effort.
   - If constraints do not make them different enough → mix model tiers (large · medium; for real names see section 5 in `superuser`) (different model = different cache).
5. Set separate delivery spots: 1 folder per contestant, `_to_delete/attempts-<topic>/<n>/`, and never write to the same place (like [`parallel-split-and-merge`](../parallel-split-and-merge/SKILL.md)) · code work → the add-on in plugin `software-development` → `superuser` → `references/code-extensions.md`.

## 2 · Launch all at once

Send every subagent in one message, running in the background. Each receives: the task · the location of reference files · its own delivery spot.
Each delivers the work (path) with a short reason of about 40 lines at most saying which ways it considered and which it cut and why. If a contestant delivers nothing, go on with the rest and note it.

## 3 · Get a second vote from a neutral party

After all finish, send a fresh subagent (`reviewer` · read-only · not a contestant) to score each criterion in turn.

## 4 · Choose the base

Read every entry to the end before deciding. Score criterion by criterion, not by overall feeling, then compare with the neutral party's scores.
- **Rank with `decision-scoring`, command `pairwise`:** have the reviewer compare pair by pair, and swap the positions of every pair (an LLM reviewer leans toward the position it sees first · Zheng et al. arXiv 2306.05685) · a pair whose result flips when swapped always counts · a close result (chance that 2nd place wins is below 60%) → a human looks at both entries · criteria that can be measured as numbers (how many tests pass · price · size) can use direct scoring with the command `score`, with no pairwise comparison.
- The job's hard rules (required specs) filter out entries that fail, before comparing.
- If the scores agree, treat it as confirmed.
- If they disagree, the criteria are ambiguous or one side is biased. Read both sides' reasons before deciding.
- If scores are close, choose the entry that is easiest to keep working on, meaning clearer scope and fewer parts (`lazy-coding` (plugin `software-development`)).
- **Fewer than 2 entries pass the criteria → fall back to a single piece of work.** There is nothing to compare. Skip step 5, take the entry closest to passing as the draft, and fix it by the normal review round of `superuser`. Do not launch a new round, because every entry failing together usually means the task or criteria are unclear, not that the contestants are weak. Note in `decision-log` why the bake-off did not work (idea from best-of-n by paulingham).

## 5 · Lift the strong parts in

Go through the losing entries once more and look for what is worth lifting, usually 1–2 things per entry, not almost the whole thing.
Write them into the base yourself so they blend in, never paste a whole block. The result must read as one idea.

## 6 · Check

Check the merged result against the criteria in step 1 again, and by the job's real method (open the real thing · for code, run the tests).
Record in [`decision-log`](../decision-log/SKILL.md): which entry is the base · what was lifted from which entry · what was dropped and why · what the neutral party said.

## When not to use

- Mechanical work with a single answer, because it wastes effort
- Work that one number can decide: measure that number directly instead (code work: the `prototype` playbook of `superuser` in plugin `software-development`)
