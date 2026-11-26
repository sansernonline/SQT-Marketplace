
# แก้ตรงจุด (Targeted Fix) — fix the one spot that is wrong, and prove it

> **ใน SuperUser:** งานแก้บั๊กเริ่มจาก playbook `bug-fix` (`superuser` → `references/playbook-bug-fix.md` (plugin `software-development`)) และ skill นี้คือขั้น "แก้ให้เล็กที่สุด" ส่วนการหาสาเหตุจริงใช้ [`fix-at-source/principle-fix-root-cause`](../principle-fix-root-cause/guide.md)

> **One rule:** fix what was reported, no more, no less. A fix that also changes 3 other things is a new bug waiting to happen and a change nobody can review.

## Use when
- Feedback says one thing is wrong (a line of code, a cell, a paragraph, a price) and the cause is clear.

Not for: cause not known yet (error · totals that do not match · flaky test) → `fix-at-source/principle-fix-root-cause`, then come back · editing something shared by many places (template · source sheet · helper · type · schema) → find who uses it first (`blast-radius`, plugin `software-development`) · code never read → `code-orientation` first.

## Steps
1. **Pin the symptom.** Quote the exact error, failing test, wrong figure or wrong sentence; exact text points to the exact spot. Cause known but line not found → search the literal wrong text, number or error string.
2. **Reproduce** with the smallest input that triggers it. Cannot reproduce? Do not stop to ask: log the gap in `decision-desk/decision-log`, take the most likely reversible path (a failing test, a check, or a note at the suspected spot), and list the missing piece (input, env, steps) in the report.
3. **Confirm the cause points here.** If not clear → `fix-at-source/principle-fix-root-cause` first.
4. **Confirm intent.** Restate in one line what "correct" means. If the feedback is ambiguous ("it's wrong"), pick the reading that matches the spec or existing behaviour, log it in `decision-desk/decision-log`, say so in the report. Ask only when readings lead to wholly different, hard-to-undo changes.
5. **Smallest fix.** Change only what is needed; match the surrounding style.
6. **Prove it.** Re-run the failing case → it passes. Re-run nearby cases → still pass. Show before/after of the one thing that changed.
   - Fix adds a condition or special case → also add one case that **must not trigger** it (a neighbour input that was right before) and show it still passes.
   - The request was "explain why…" → answer with the explanation only; change behaviour only after the user says to.

## Receiving review feedback
Comments from `reviewer`, a person or a bot are claims, not orders.
1. **List every item** with its own id. Unclear item → restate it in one line before touching anything.
2. **Check each against the code or evidence** (file:line, test, source). Mark: right · wrong · unsure.
3. **Wrong → push back with evidence** (the passing test, the line that already handles it, the spec clause). Do not apply a change just to silence a comment, and do not agree without checking.
4. **Unsure → verify first** (run it, read it). Still unsure → log in `decision-desk/decision-log` and take the lowest-impact reading.
5. **Fix one item at a time** with the steps above and re-run its check before the next. No batch of fixes followed by one test run.
6. **Report per item:** `id · fixed (evidence) / declined (evidence) / open (why)`.

## Never
- Patch the symptom and leave the cause (a `try/except` that swallows the real error, a typed-over total).
- Refactor or restyle unrelated parts, or widen scope ("fix the date bug" ≠ "replace the date library").
- Asked to send the whole document back (quotation, letter, list) → return it in its original shape: same numbering, line breaks and wording, only the wrong line changed. A numbered list stays a list, not a table; no added headings, columns or VAT. Say `old → new` for the changed line.
- Say it is fixed without re-running the exact failing case.

## Check before done
`Cause: [the one reason]. Fix: [what changed]. Verified: [the case that now passes].` Keep the change small enough to read on one screen; if it is not, the fix grew too big, so split it. Use with `lazy-coding` (smallest correct diff) and `code-review-checklist` (nothing new introduced), both in plugin `software-development`.

## References
- [`references/sources.md`](references/sources.md) — where the rules came from; open only to trace the origin.
