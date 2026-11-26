
# principle · fix root cause — fix the cause, not the symptom

> **One rule:** catching null on the screen hides the error, but wrong data still flows through the system. Fix where the wrong value first appears.

## Use when
- Something is broken and the cause is unknown
- A report, total, or result is wrong and you are tempted to patch the output

Not for: the cause is known and only the smallest fix at the spot the user pointed to is left (feedback · a clear stack trace · a regression with a known source) → `fix-at-source/targeted-fix`. Use together with `fix-at-source/targeted-fix` and playbook `bug-fix` of `superuser` in plugin `software-development`.

## Steps
1. **Build a repeat loop before forming a hypothesis.** Find one command that shows the symptom exactly as the user described it (red). Run it and see the real symptom once, then think about why. If you cannot reproduce it, you do not yet know what you are fixing.
   - Loops, from most direct: a failing test · a script or `curl` hitting the same thing the user hit · replay the log or file that causes the break · compare old and new output · on-screen steps from the project's app-checking skill.
   - Make it fast (seconds) and deterministic. If it happens only sometimes, run N rounds or pin the random seed/time until the rate is high enough to see a fix's effect. If a step needs a person (tapping a real device), write a script that guides the person step by step and records the result.
2. **Explore from evidence only.** Read, run the loop, look at logs and history, and edit no file until you can name where the wrong value first appears. "Please explain why" is answered with an explanation, not a behavior change.
3. **Ask "why" until you reach where the wrong value first appears**, not where it blows up.
4. **Fix at that point**, then run the loop until it passes (green). If the fix adds a condition, also add a case that "must not happen" (`fix-at-source/targeted-fix` step 6).
5. **If a fix breaks 3 times on one symptom, stop.** The 4th is not another try; you are fixing the wrong layer. Write 3 lines: what was tried · how each attempt broke differently · which assumption every attempt shared. Then send `brainstormer` or ask the user with this information. Do not guess a 4th time.

**Find the spot fast**
- Error message or stack trace: find the first line that is our code. Python prints the failing point at the bottom; Java · Node.js · .NET at the top.
- Search for the wrong text, number or error exactly; it is usually in one place.
- "It used to work": look at the latest change there (`git log -p <file>` · `git blame`).
- Scope clues ("only big orders" · "only after login") cut the search space.

**Exception:** patch the symptom temporarily only when the real system is being damaged and the damage must stop first. Record it in `decision-desk/decision-log` as a temporary fix and open the root-cause fix right away.

| Symptom | Symptom fix (forbidden) | Root-cause fix |
|---|---|---|
| Report total does not match the books | Type over the total | Find the row imported twice or the formula with the wrong range |
| Several customers received goods late | Apologize one by one | Find the stuck step (stock not synced · slow shipping) and fix it |
| Report page breaks because `date` is null | `if (date) ...` on the screen | Find why the import did not set the date: the parser cannot read Buddhist Era years |

## Check before done
- The loop showed red before the fix and green after
- The fix is at the point where the wrong value first appears
- A temporary patch is recorded in `decision-desk/decision-log` with the root-cause fix opened

## References
- [`references/sources.md`](references/sources.md) — open to see where the loop and explore-first rules come from
