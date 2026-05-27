---
description: Run a sprint retrospective covering what went well, what didn't, and action items.
argument-hint: <sprint number or period>
---

Use the `project-manager` agent to facilitate a retrospective for: **$ARGUMENTS**

The PM should run this structured retro:

## 1. Set the Stage
Ask the user about the sprint:
- What was the sprint goal?
- Was it achieved? (yes/partial/no)
- Any major events during sprint?

## 2. Gather Data (Start/Stop/Continue + Mad/Sad/Glad)

Ask the user to share, then organize into:

### 🟢 Went Well (Glad)
What should we **continue** doing?
- ...

### 🔴 Didn't Go Well (Sad/Mad)
What should we **stop** doing?
- ...

### 💡 Ideas to Try
What should we **start** doing?
- ...

### 🤔 Puzzles
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
- If can't measure it, it's not a real action

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
- Achieved: ✅ | ⚠️ Partial | ❌

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
- Action X: ✅ Done | ⏳ In progress | ❌ Not started
```
