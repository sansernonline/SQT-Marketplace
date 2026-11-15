---
name: blast-radius
description: Use when a small change touches shared code
---

# blast radius — a tiny edit, what does it affect

> A tiny edit does not mean a small impact, because a single helper may be called from 40 places.
> Never answer "it probably affects nothing." Find every place, then run something real to prove the riskiest spot.

## Steps

1. **Name what changes**: the symbol name · field · column · class · config value · behavior that differs from before
2. **Find every place this change reaches** with commands that can be rerun, and keep the commands in the report

   | Look for | With |
   |---|---|
   | Direct callers | find references in the IDE or language server · `grep -rn` the full name (limit the output with `head -50`) |
   | Indirect callers | names in strings · reflection · routes · dependency injection (DI) registration · templates · raw SQL |
   | Data already stored | rows in the database · cache · files · queue messages that still have the old shape |
   | Outside the repo | public API · old mobile app versions · scheduled jobs · other systems that read the same table |

3. **Sort into 3 groups:** surely safe (with a 1-line reason) · needs checking · unknown
4. **Prove the most important spot.** Pick the spot where a failure would cost the most, then run something real: a test that covers that path · call the app through a verify skill · query data in a sandbox. "Type check passed" does not count as evidence.
5. **The "unknown" group must not vanish quietly.** Either check it, or write in the report that it is still risky.
6. **After the edit is done, compare the plan with the real diff** (`git diff --stat`). A file touched but not in the step 2 table → go back to step 2 for that file. A spot in the table that was finally not touched → write a 1-line reason, and do not delete the row silently (idea from ECC change-impact).

## Report

| Spot reached | Group | Evidence |
|---|---|---|

Follow it with the search commands used and the run results from step 4.

## In SuperUser

This is a step before delivery in the playbooks `bug-fix` · `refactor` · `review` when the diff touches shared code, and it is used together with `targeted-fix`.

## Skip when

Code just written in this task that nobody calls yet
