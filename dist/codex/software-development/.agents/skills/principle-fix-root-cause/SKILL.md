---
name: principle-fix-root-cause
description: Use when something is broken and the cause is unknown
---

# principle · fix root cause — fix the cause, not the symptom

> Catching null on the screen does make the error vanish from sight, but wrong data still flows through the system.

## Rule

1. **Build a repeat loop before forming a hypothesis** — find one command that, when run, shows the symptom exactly as the user described it, character for character (red) · run it and see the real symptom once, and only then think about why · if you cannot reproduce it, you do not yet know what you are fixing
   - Usable loops (from most direct): a failing test · a script or `curl` that hits the same thing the user hit · replay the log or file that causes the break · compare the output of the old and new versions · on-screen steps from the project's app-checking skill
   - Squeeze it to be fast (seconds, not minutes) and deterministic (same result every round) · happens only sometimes → run N rounds or pin the random seed/time until the rate is high enough to see the effect of a fix · some step needs a person (tapping on a real device) → write a script that tells the person step by step and records the result back
2. **EXPLORE before fixing, from evidence only** — read, run the loop from item 1, look at logs and history, without editing any file until you can name where the wrong value first appears · a request like "please explain why" is answered with an explanation, and is not a license to change behavior
3. **Ask "why" until you reach the point where the wrong value first appears** — not the point where it blows up
4. **Fix at that point**, then run the loop from item 1 until it passes (green) · if the fix adds a condition, also add a case that "must not happen", see `targeted-fix` step 6
5. **Fix breaks 3 times on one symptom → stop fixing** — the 4th time is not another try but a signal that you are fixing the wrong layer (misunderstood structure · wrong starting hypothesis · the problem is in the design, not at that point) · write 3 lines: what was tried · how each attempt broke differently · which assumption every attempt believed the same → send `brainstormer` or ask the user with this information, and do not guess a 4th time (idea from systematic-debugging in obra/superpowers · MIT)

**Find the spot fast**
- Error message · stack trace → find the first line that is our code (our part first, the framework's part later) · Python prints the failing point at the bottom, while Java · Node.js · .NET print it at the top
- Search for the wrong text, number or error exactly · you usually find it in one place
- "It used to work" → look at the latest change at that spot (version history · for code work `git log -p <file>` · `git blame`)
- Clues about scope ("only big orders" · "only after login") cut the search space a lot

## Do not use when

The cause is known and only the smallest possible fix at the spot the user pointed to is left (feedback · a clear stack trace · a regression with a known source) → `targeted-fix`

## Examples

| Symptom | Fix at the symptom (forbidden) | Fix at the root cause |
|---|---|---|
| The report total does not match the books | Type over the total to make it match | Find which row was imported twice or which formula references the wrong range, and fix at the source |
| Several customers received goods late | Apologize one by one | Find which step is stuck (stock not synced · slow shipping) and fix that step |
| The report page breaks because `date` is null | `if (date) ...` on the screen | Find why the import did not set the date, and discover the parser must be fixed because it cannot read Buddhist Era years |

## Exception

You may patch the symptom temporarily when the real system is being damaged and the damage must stop first, but record in `decision-log` that it is a temporary fix, and open the root-cause fix right away

## Use together with

`targeted-fix` (the smallest-fix procedure) · playbook `bug-fix` of `superuser` in plugin `software-development`

## Sources

- mattpocock/skills (MIT) · `skills/engineering/diagnosing-bugs/SKILL.md` · seen 2026-11-10 (a repeat loop that must show red before any hypothesis)
- mlflow (Apache-2.0) · `mlflow-agent-improvement/SKILL.md` · seen 2026-11-10 (EXPLORE without fixing · a request to explain is not a license to change behavior)
