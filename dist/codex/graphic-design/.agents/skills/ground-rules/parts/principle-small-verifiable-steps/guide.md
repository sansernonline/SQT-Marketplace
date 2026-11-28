
# principle · small verifiable steps — cut the work into small pieces and check them one at a time
> Use together with: `ground-rules/principle-build-a-tool-not-handwork` (write a script for repeated work) · `handoff/parallel-split-and-merge` (run several pieces at once)

> Long work checked only once at the end gives no clue which piece broke when it fails.
> Cut it into small pieces that each end in a checkable state, so a failure points straight to its piece.

## How to cut

1. Write the list of pieces into the todo before starting, and give each piece a 1-line "ผ่านเมื่อ" (passes when) criterion. If the work has more than 5 pieces, spans sessions, or is handed to another agent, write a plan file from [`templates/plan.md`](templates/plan.md) (each item has a file · a check command · done-when · ticked one at a time).
2. 1 piece changes 1 thing and ends in a checkable state (file opens · totals match · code: build and tests pass).
3. Do one piece at a time, check it, and record it before moving to the next. For code, commit following the commit rules (`superuser` section 1 item 9 · for code work: `superuser` of plugin `software-development` section 6). If commits are not allowed or the work is not code, record the passed piece in the "ความคืบหน้า" (progress) table of `CONTEXT.md` instead (a project with `docs/BUILD-PLAN.md` uses that file).
4. If a piece fails its check, stop and fix that piece. Do not skip to the next piece and come back later.
5. Save every re-run into a new folder and never overwrite the baseline result. Keep the prompt actually used (`prompt-used.md`) and a copy of the plan after every piece finishes (`plans/after-T1.json`) so you can look back.

## Order

| Do first | Do after |
|---|---|
| What others depend on (main headings · templates · source tables · types · schemas) | What calls it |
| Add the new thing | Move users over, then delete the old one (`code-craft` (plugin `software-development`)) |
| The riskiest piece | The piece you know for sure can be done |

## Hand over in pieces

Every piece reads complete on its own, so the reviewer can go through piece by piece and trust the result (for example, change the price of 200 items → 20 items at a time). For code work → the extension in plugin `software-development` → `superuser` → `references/code-extensions.md`

## Work left to run unattended

The `unattended-run` playbook records each passed piece in the "ความคืบหน้า" table in `CONTEXT.md` (a project with `docs/BUILD-PLAN.md` uses that file). If it stops midway, resume from the last piece that passed.

## Not needed when

A single piece of work that is checked once and done.
