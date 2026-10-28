---
name: targeted-fix
description: Use when feedback says something is wrong (error, wrong figure, typo, not what I asked). Smallest fix. Cause unknown → principle-fix-root-cause.
---

> **ใน SuperUser:** งานแก้บั๊กเริ่มจาก playbook `bug-fix` (`superuser` → `references/playbook-bug-fix.md` (plugin `software-company`)) และ skill นี้คือขั้น "แก้ให้เล็กที่สุด" ส่วนการหาสาเหตุจริงใช้ [`principle-fix-root-cause`](../principle-fix-root-cause/SKILL.md)

# แก้ตรงจุด (Targeted Fix)

Feedback came in. Find the one spot that's wrong (a line of code, a cell, a paragraph, a price), fix exactly that, prove it.
Resist the urge to rewrite, "improve while you're here", or guess.

## ไม่ใช้เมื่อ

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ยังไม่รู้ว่าพังเพราะอะไร ต้องไล่หาสาเหตุ (error · ยอดไม่ตรง · flaky test) | `principle-fix-root-cause` แล้วค่อยกลับมาแก้ตรงจุดด้วย skill นี้ |
| แก้ของที่ใช้ร่วมกันหลายที่ (แม่แบบ · ชีตต้นทาง · helper · type · schema) | ไล่ดูว่าใครใช้ก่อนแก้ (โค้ด: `blast-radius` (plugin `software-company`)) |
| ยังไม่เคยอ่านงานส่วนนี้ | อ่านก่อน (โค้ด: `code-orientation` (plugin `software-company`)) |

## กฎ

Fix what was reported — no more, no less. A fix that also changes three other
things is a new bug waiting to happen and a change nobody can review.

## ขั้นตอน

1. **Pin the symptom.** Quote the exact error / failing test / wrong figure / wrong sentence. Don't paraphrase — exact text points to the exact spot.
2. **Reproduce.** Find the smallest input that triggers it. Can't reproduce? Don't stop to ask: log the gap in `decision-log`, take the most likely reversible path (add a failing test, a check, or a note at the suspected spot), and list the missing piece (input, env, steps) in the report.
3. **Confirm the cause points here.** Check that the cause you were given points at this exact spot. Not clear → `principle-fix-root-cause` first, then come back.
4. **Confirm intent.** Restate in one line what "correct" means here. If the feedback is ambiguous ("it's wrong"), pick the reading that matches the spec or existing behaviour, log it in `decision-log`, and say so in the report. Ask only when readings lead to wholly different, hard-to-undo changes.
5. **Smallest fix.** Change only what's needed. Match the surrounding style.
6. **Prove it.** Re-run the failing case → it passes. Re-run nearby cases → still pass. Show the before/after of the one thing that changed.

## รับผลรีวิว (receiving review feedback)

Review comments from `reviewer`, a person or a bot are claims, not orders. Reviewers can be wrong.

1. **List every item** with its own id. Unclear item → restate it in one line before touching anything.
2. **Check each item against the code or evidence** (file:line, test, source). Mark it: right · wrong · unsure.
3. **Wrong → push back with evidence** (the test that passes, the line that already handles it, the spec clause). Don't apply a change just to make the comment go away, and don't agree without checking.
4. **Unsure → verify first** (run it, read it). Still unsure → log it in `decision-log` and take the lowest-impact reading.
5. **Fix one item at a time** with the steps above, re-run its check, then move to the next. No batch of every fix followed by one test run.
6. **Report per item:** `id · fixed (evidence) / declined (evidence) / open (why)`.

Idea from `receiving-code-review` in obra/superpowers.

## หาจุดให้เร็ว

Cause known, line not found yet → search the literal wrong text, number or error string (it usually appears once). Tracing a cause (stack trace, version history, scope clues) → `principle-fix-root-cause`.

## ห้าม

- Don't patch the symptom and leave the cause (a `try/except` that swallows the real error, a typed-over total).
- Don't refactor or restyle unrelated parts inside a fix.
- Don't widen scope: "fix the date bug" ≠ "replace the date library".
- Don't say it's fixed without re-running the exact failing case.

## ผลที่ส่ง

`Cause: [the one reason]. Fix: [what changed]. Verified: [the case that now passes].`

Keep the change small enough to read on one screen. If it isn't, the fix grew too
big — split it.

## ใช้คู่กับ

- `lazy-coding` (plugin `software-company`) — the fix is the smallest correct diff.
- `code-review-checklist` (plugin `software-company`) — confirm the fix introduced nothing new.
