---
name: fix-at-source
description: Use when something is broken or feedback says it is wrong
---

# fix-at-source — fix the cause, change only the wrong spot

> **The one rule:** fix where the wrong value first appears, and fix what was reported, no more, no less.

## Hard rules

**Fix root cause**
- Catching null on the screen hides the error, but wrong data still flows through the system. Fix where the wrong value first appears.
- Fix at that point, then run the loop until it passes. If the fix adds a condition, also add a case that must not happen.
- Exception: patch the symptom temporarily only when the real system is being damaged and the damage must stop first. Record it as a temporary fix in `decision-desk/decision-log` and open the root-cause fix right away.

**Targeted fix**
- A fix that also changes 3 other things is a new bug waiting to happen and a change nobody can review.
- Never patch the symptom and leave the cause (a `try/except` that swallows the real error, a typed-over total).
- Never refactor or restyle unrelated parts, or widen scope.
- Asked to send the whole document back, return it in its original shape: same numbering, line breaks and wording, only the wrong line changed. Say `old → new` for the changed line.
- Never say it is fixed without re-running the exact failing case.
- Fix one item at a time and re-run its check before the next. Report per item: `id · fixed (evidence) / declined (evidence) / open (why)`.

## Parts

| When | Open |
|---|---|
| Cause not known yet, or wrong data keeps flowing | [parts/principle-fix-root-cause/guide.md](parts/principle-fix-root-cause/guide.md) |
| Cause known; make the smallest fix and prove it | [parts/targeted-fix/guide.md](parts/targeted-fix/guide.md) |

## Check before done
`Cause: [the one reason]. Fix: [what changed]. Verified: [the case that now passes].` The change must be small enough to read on one screen.
