---
name: principle-proceed-on-reversible-work
description: Use before asking to continue on undoable work
---

# principle · proceed on reversible work: if it can be undone, do it

> Every question that stops and waits for an answer is time when both the person and the agent are not working.
> If the work is reversible, doing it and letting them look is faster than asking and waiting.

## Tell them apart

| Reversible: do it now | Irreversible: prepare it in "รออนุมัติ" (awaiting approval) and carry on with the rest |
|---|---|
| Edit a file that has a copy or history (document file · sheet · git) | Edit or delete real data (database · master sheet · the user's files) |
| Draft a document · draft an email or customer reply (not yet sent) · draft a mockup | Send an email, message or post to outsiders |
| Run tests · calculate · try in a copy | Release to the real system (deploy · announce a price · publish) |
| Choose between 2 paths that can be changed later | Pay money · book · accept terms · enter a real secret |
| Move a temporary file to `_to_delete/` | Delete permanently |
| Code: commit on the work branch, when the user allows it | Code: merge into the main branch · force-push |

## Before you ask, pass these three gates

1. **Can an experiment show it?** If the answer is behaviour, speed, looks or output, try a draft (code work: playbook `prototype` in plugin `software-development`) instead of asking.
2. **Is it reversible?** If so, pick the path with the least impact, do it, and note it in [`decision-log`](../decision-log/SKILL.md).
3. **Is it a fact or the user's taste?** Numbers, names, dates and budgets must never be guessed: put `(รอยืนยัน)` (awaiting confirmation) and carry on with the rest. If the brand colour is missing, use that skill's default with `(รอยืนยัน)` and note the stand-in under "ค้างอยู่" (pending) once.

If you pass all 3 gates, do not ask: decide by research + vote (`superuser` `references/autonomy.md`), log it under **ตัดสินใจเอง**, and carry on. For irreversible work, prepare the command, the diff or the draft message in "รออนุมัติ" and do not do it yourself.

**No question at the start either:** a brief that reads several ways → take the reading the evidence supports best (tie → the easiest to undo), say it in line 1, and keep going · questions left go in one list at the end, 0–3, only the kinds in skill `superuser` section 6 → `autonomy`. For a fork that is irreversible, costly or reaches outsiders, use [`flag-and-propose`](../flag-and-propose/SKILL.md).

## What not to do

- Ask "ให้ทำต่อไหม" (shall I continue?) after each step of a job that was already ordered
- Offer a plan and wait for approval when the work is clear and reversible
- Use this principle as an excuse to do things the user did not ask for, because "continue" means finishing the ordered work, not widening the scope yourself
