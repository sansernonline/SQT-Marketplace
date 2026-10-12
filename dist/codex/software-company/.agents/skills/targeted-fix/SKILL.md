---
name: targeted-fix
description: Use when feedback says something is wrong (error, failing test, regression, not what I asked). Smallest fix. Cause unknown → principle-fix-root-cause.
---

> **ใน SuperUser:** งานแก้บั๊กเริ่มจาก playbook [`bug-fix`](../superuser/references/playbook-bug-fix.md) และ skill นี้คือขั้น "แก้ให้เล็กที่สุด" ส่วนการหาสาเหตุจริงใช้ [`principle-fix-root-cause`](../principle-fix-root-cause/SKILL.md)

# Targeted Fix

Feedback came in. Find the one spot that's wrong, fix exactly that, prove it.
Resist the urge to rewrite, "improve while you're here", or guess.

## ไม่ใช้เมื่อ

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ยังไม่รู้ว่าพังเพราะอะไร ต้องไล่หาสาเหตุ (error · crash · flaky test) | `principle-fix-root-cause` แล้วค่อยกลับมาแก้ตรงจุดด้วย skill นี้ |
| แก้โค้ดที่ใช้ร่วมกันหลายที่ (helper · type · schema) | `blast-radius` ก่อนแก้ |
| ยังไม่เคยอ่านโค้ดส่วนนี้ | `code-orientation` ก่อน |

## The rule

Fix what was reported — no more, no less. A fix that also changes three other
things is a new bug waiting to happen and a diff nobody can review.

## Steps

1. **Pin the symptom.** Quote the exact error / failing test / wrong output. Don't paraphrase — exact text points to the exact line.
2. **Reproduce.** Find the smallest input that triggers it. Can't reproduce? Don't stop to ask: log the gap in `decision-log`, take the most likely reversible path (add a failing test or logging at the suspected spot), and list the missing piece (input, env, steps) in the report.
3. **Locate the root cause.** Trace from symptom to line. Stop at the cause, not the first suspicious line.
4. **Confirm intent.** Restate in one line what "correct" means here. If the feedback is ambiguous ("it's wrong"), pick the reading that matches the spec or existing behaviour, log it in `decision-log`, and say so in the report. Ask only when readings lead to wholly different, hard-to-undo changes.
5. **Smallest fix.** Change only what's needed. Match the surrounding style.
6. **Prove it.** Re-run the failing case → it passes. Re-run nearby cases → still pass. Show the before/after of the one thing that changed.

## Locate fast

- Stack trace: read bottom-up (your code first), not top-down (framework first).
- Grep the literal error string — it usually appears exactly once.
- "Worked before?" → check the last change to this path (`git log -p <file>`, `git blame <line>`).
- Use scope clues to cut the search: "only large payloads", "only in prod", "only after login" each narrow it hard.

## Don't

- Don't patch the symptom and leave the cause (a `try/except` that swallows the real error).
- Don't refactor unrelated code inside a fix.
- Don't widen scope: "fix the date bug" ≠ "replace the date library".
- Don't say it's fixed without re-running the exact failing case.

## Output

`Cause: [the one reason]. Fix: [what changed]. Verified: [the case that now passes].`

Keep the diff small enough to read on one screen. If it isn't, the fix grew too
big — split it.

## Pairs with

- `lazy-coding` — the fix is the smallest correct diff.
- `code-review-checklist` — confirm the fix introduced nothing new.
