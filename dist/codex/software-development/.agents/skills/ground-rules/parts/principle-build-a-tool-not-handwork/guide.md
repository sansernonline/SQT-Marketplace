
# principle · build a tool, not handwork — turn mechanical work into a tool
> Use together with: `ground-rules/principle-small-verifiable-steps` (cut into small pieces that can be checked) · `crew-patterns/parallel-split-and-merge` (run several pieces at once)

> Work has 2 parts: the part that needs judgment, and the part that is purely mechanical.
> For the mechanical part, do not make the agent work out a new method every time. Write it as a program once, and save the thinking effort for the parts that need a decision.

## When to build a tool

| Signal | Tool |
|---|---|
| The same change in more than 10 places (files · sheet rows · documents · code) | A script or find-and-replace, tried on a sample first (code: codemod · `sed`) |
| Many documents from one template (40 quotations) | A template + a script that merges data from the sheet |
| Checking every screen, every file or every row | A looping check script that prints a result table |
| Every agent must set up the environment itself before checking | A `start` script in the verify skill (`app-verifier-setup` (plugin `software-development`)) |
| Moving or importing data | A script that gives the same result when rerun, with a trial mode (dry run) |
| The claim "everywhere already does it this way" | A grep command or script that proves it |
| Doing the same job for the 3rd time | Make it a command or a skill |

## Rules for the tool

- **Same result when rerun** — running it twice must not break anything and must not change things twice (`principle-safe-to-rerun` (plugin `software-development`))
- **Print results that can be checked** — say how many were changed · which items were skipped · which items failed
- **As small as it can be and still work** — it need not be pretty, and need not handle every future case (`lazy-coding` (plugin `software-development`))
- **Keep it in the right place** — a one-off script goes in `_to_delete/`, while a script used repeatedly goes in `scripts/` with one line in the README saying when to run it
- **The skill shrinks to a thin description** — the fixed steps live in the script, while SKILL.md says only when to call it and how to read the result

## When not to bother

A change in 2–3 places that really differ, because writing a script takes longer than editing by hand
