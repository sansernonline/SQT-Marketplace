---
name: product-planning
description: Use for a product roadmap, sprint plan or sprint retrospective
argument-hint: '<time horizon, e.g. "Q1-Q4 2026", or sprint number or goal>'
---

# product-planning — plan what to build next, sprint by sprint, and learn from each one

> **One rule:** every plan states the outcome it serves and the number it must move. Items without that link wait in the backlog.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Build a roadmap", "quarterly plan", "RICE scores", "success metrics for next half-year" | [`references/product-roadmap.md`](references/product-roadmap.md) (templates: [`references/product-doc-templates.md`](references/product-doc-templates.md)) |
| "Plan sprint 12", "backlog refinement", "what fits in this sprint" | [`references/sprint-plan.md`](references/sprint-plan.md) |
| "Run the retro", "what went well, what did not, action items" | [`references/retrospective.md`](references/retrospective.md) |

Scoring files: `templates/rice.json` for RICE and `templates/knapsack.json` for fitting work into a capacity. Sources are in [`references/sources.md`](references/sources.md).

## Steps every part shares

1. Look for the team's existing format first (roadmap, backlog file, last retro). Use it before writing a new one.
2. Ask the user once for the facts that change the whole plan. Other unknowns are written as `(รอยืนยัน)` (awaiting confirmation), and the work goes on.
3. Score items by putting them in a JSON file and running `decision-desk/decision-scoring` (`priority` for RICE, `knapsack` for capacity). Do not do the arithmetic by hand.
4. Save the output to its own file, such as `docs/sprints/sprint-NN.md`. Never overwrite an earlier sprint.

## Check before done

- Each roadmap outcome names a counter-metric that must not get worse, such as refund rate while pushing conversion.
- Confidence is a fraction from 0 to 1, never a percentage.
- A retrospective changes only the retro document and the action items. It does not edit any skill, agent or playbook. Lessons go into the agent team's skills only on a separate order to collect lessons.
- The sprint plan lists only stories with status Ready from the backlog index.
