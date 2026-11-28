# Examples for this plugin — model level · autonomy · team patterns

Moved from `SKILL.md` sections 5 and 6 and `superuser:superuser` section 9. The rules live in `SKILL.md`. This file holds only examples.

## Autonomy — reversible work and sources (section 6)

| Situation | Action |
|---|---|
| Reversible work — edit files · create a branch · run tests · draft documents | Just do it |
| Must choose a path | If you can try it and see real results, use playbook `prototype`. If you cannot, choose the path with the least impact and log it in `decision-desk/decision-log` |
| Do not know the best practice or the right method | Search yourself by the 3-source rule in `SKILL.md` section 6, in this order: official docs → standards (RFC · OWASP · ISO) → the repo or blog of the tool's maintainers · all 3 found → put all 3 links in the document or `decision-desk/decision-log` with the `จากแหล่ง` (from a source) tag · incomplete or in conflict → choose the most easily reversed path, then log it in `decision-desk/decision-log` with `(รอยืนยัน)` (awaiting confirmation) |

## Team patterns — how to use them in this work (`superuser:superuser` section 9)

How to do each one, its cost and its traps are in `handoff/agent-patterns`.

| Pattern | How it is used in this work |
|---|---|
| **Planning** | Pick playbooks into a todo; for long work use `docs/BUILD-PLAN.md` |
| **ReAct** | Run every piece for real · `ground-rules/principle-small-verifiable-steps` · the project's app-checking skill |
| **Reflection** | A fresh reviewer in the playbook's review step; if the work is risky, use `handoff/adversarial-review-panel` |
| **Multi-Agent** | Per section 5. If there are several independent pieces, use `handoff/parallel-split-and-merge`; for the documents track use `/software-development:requirements-writing` |
| **Mixture-of-Agents (MoA)** | For design · API · mockups that could lock in the wrong shape, use `handoff/parallel-attempts-pick-best` |
| **Reranker** | Choose which files to read from whole-repo search results (`context-budget`) · choose best-practice sources · choose a library from `research-with-sources/prior-art-review` |
