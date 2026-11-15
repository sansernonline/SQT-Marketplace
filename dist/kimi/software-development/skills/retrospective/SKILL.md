---
name: "retrospective"
description: "Run a sprint retrospective covering what went well, what didn't, and action items."
disableModelInvocation: true
---

> This retro belongs to the **human team**. The result is only the retro document and action items. **Do not edit any skill · agent · playbook.** If the user wants the lessons to go into the agent team's skills, the user must give a separate "รวมบทเรียน" (collect lessons) order (the `learn-from-session` playbook of `superuser`).

Use the `project-manager` agent to facilitate a retrospective for: **$ARGUMENTS**

The PM should run this structured retro:

## 0 · Look for an existing format first (every time)

Before using the structure or template in this file, check whether the user, the customer or the project already has its own format:

- **Where to look:** the retro format the team used last round (recorded in `docs/retros/` or on the board the user points to) · action items left open from the last round · team size and the main problem of this round
- **Result:** found → use that format (headings, order, field names, running numbers) and say in the answer which file it came from · not found → use the template in this file as a fallback and say that no earlier format was found
- **Every format still needs:** choose the style to fit this round: a normal round can use Start/Stop/Continue · a round with a major event uses a timeline · a quiet team uses write-first-then-speak · always open with the action items left open from the last round

## 1. Set the Stage
Ask the user once, at the start, all of the following (sprint facts and the retro input in step 2); do not stop to ask again. Anything the user doesn't know → write `(รอยืนยัน)` (awaiting confirmation) and keep going:
- What was the sprint goal?
- Was it achieved? (yes/partial/no)
- Any major events during sprint?
- What went well — what should we keep doing?
- What didn't go well — what should we stop doing?
- Any ideas to try next sprint, or puzzles we don't understand yet?

## 2. Gather Data (Start/Stop/Continue + Mad/Sad/Glad)

Using the answers from the start question, organize into:

### Went Well (Glad)
What should we **continue** doing?
- ...

### Didn't Go Well (Sad/Mad)
What should we **stop** doing?
- ...

### Ideas to Try
What should we **start** doing?
- ...

### Puzzles
Things we don't yet understand:
- ...

## 3. Generate Insights

For each major theme:
- Why did this happen?
- What's the systemic cause?
- Is this a one-time issue or pattern?

## 4. Decide on Actions

Produce **3-5 concrete action items** (not 20 — focus matters):

| Action | Owner | Due | Success Metric |
|--------|-------|-----|----------------|
| ...    | ...   | ... | ...            |

Rules:
- Each action has ONE owner (not "the team")
- Each action has a due date
- Each action has a way to measure if it worked
- If you can't measure it, it's not a real action

## 5. Close

- Summarize key takeaways (2-3 lines)
- Acknowledge team wins
- Confirm next retro date

## Output Format

```markdown
# Sprint Retrospective: <sprint>

**Date:** YYYY-MM-DD
**Facilitator:** ...
**Participants:** ...

## Sprint Goal & Outcome
- Goal: ...
- Achieved: Yes | Partial | No

## What Went Well
- ...

## What Didn't Go Well
- ...

## Ideas to Try
- ...

## Action Items
| Action | Owner | Due | Metric |

## Key Takeaways
- ...

## Carry-over from Last Retro
- Action X: Done | In progress | Not started
```
