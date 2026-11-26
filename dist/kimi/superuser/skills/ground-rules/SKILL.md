---
name: ground-rules
description: Use before saying done, and to keep work small, simple, reversible
---

# ground-rules — the working principles behind every task

> **The one rule:** never say done until you have seen the result from the real thing this round. Everything else here keeps work small, cheap, reversible and easy for the user.

The `simplify` part below is a skill about what the work contains. It is not Claude Code's own `/simplify` command.

## Hard rules

**Prove it works**
- Before using the words done (`เสร็จ`) · fixed · passed (`ผ่าน`) · works · sent, you must have seen the result from the real thing yourself in this round.
- If you truly cannot check, say plainly `ยังไม่ได้ตรวจ` and what is missing; never write `ผ่าน`.
- A draft for a customer or outsider must not say "แก้แล้ว" or "เรียบร้อย" while the check is unfinished.

**Small verifiable steps**
- Write the pieces first, each with a 1-line "ผ่านเมื่อ" criterion. One piece changes one thing and ends in a checkable state.
- Check each piece before the next. If a piece fails, fix it now; do not skip ahead.
- Never overwrite the baseline result of a re-run; save it in a new folder.

**Build a tool, not handwork**
- Mechanical work (same change in more than 10 places · many documents from a template · checking every row) becomes a script, tried on a sample first.
- The tool gives the same result when rerun and prints what changed, what was skipped and what failed.
- A one-off script goes in `_to_delete/`; a reused one goes in `scripts/`.

**Proceed on reversible work**
- If the work can be undone, do it and let them look; do not ask "ให้ทำต่อไหม" after each step of ordered work.
- Never guess numbers, names, dates or budgets: write `(รอยืนยัน)` and carry on.
- Irreversible work (send to outsiders · delete real data · pay · deploy · merge to main) goes in "รออนุมัติ"; do not do it yourself.
- "Continue" means finishing the ordered work, not widening the scope.

**User experience first**
- "This way is easier" is allowed only when the user cannot see the difference.
- Fewer features, fully finished (empty · error · loading states); cut content, not polish.
- Error messages say what happened and what to do next, in the user's language.
- Every visible button must really work. Before sending, walk the main path as a new user.

**Simplify**
- Someone not on this work, opening it 6 months from now, must understand it and continue it without asking anyone.
- Climb the ladder: not needed → skip it; something exists → use it; else the shortest complete and correct version.
- Never cut correctness, safety, validation of outside data, data-loss error handling, or what the user asked for.
- A deliberate shortcut gets a note on how far it works, and `ข้าม: X — เพิ่มเมื่อ Y` in the report.

## Parts

| When | Open |
|---|---|
| About to report done · fixed · passed · sent | [parts/principle-prove-it-works/guide.md](parts/principle-prove-it-works/guide.md) |
| Long work that needs cutting into pieces | [parts/principle-small-verifiable-steps/guide.md](parts/principle-small-verifiable-steps/guide.md) |
| Repeated or mechanical work | [parts/principle-build-a-tool-not-handwork/guide.md](parts/principle-build-a-tool-not-handwork/guide.md) |
| Tempted to stop and ask | [parts/principle-proceed-on-reversible-work/guide.md](parts/principle-proceed-on-reversible-work/guide.md) |
| Choosing what the user feels | [parts/principle-user-experience-first/guide.md](parts/principle-user-experience-first/guide.md) |
| Work may hold more than needed; ทำให้ง่าย | [parts/simplify/guide.md](parts/simplify/guide.md) |

## Check before done
- Raw result from the real thing seen this round, or `ยังไม่ได้ตรวจ` written.
- Every piece checked, none skipped.
- Nothing irreversible done without approval; nothing guessed as fact.
