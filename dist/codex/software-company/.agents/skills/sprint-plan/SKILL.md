---
name: "sprint-plan"
description: "Run sprint planning — backlog refinement, prioritization, and capacity planning."
---

Use the `project-manager` agent to facilitate sprint planning for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

The PM should:

1. Read the backlog from the index table in `docs/USER-STORIES.md` (format: `user-story-writer`). Candidates are stories with status Ready. Only if the file does not exist, ask for the backlog — and have `business-analyst` write it into that file first
2. Ask for team capacity (members, days, allocation %)
3. For each story:
   - Verify it has acceptance criteria (if not, refer to `business-analyst`)
   - Get story point estimate (consult `developer` if needed)
   - Confirm dependencies are clear
4. Propose sprint scope based on capacity
5. Identify risks for this sprint
6. Write the sprint plan to `docs/sprints/sprint-NN.md` (two-digit number, one file per sprint, never overwrite an earlier sprint) with:
   - Sprint goal (one sentence)
   - Committed stories with point totals
   - Daily standup schedule
   - Demo / review date
7. Write back to `docs/USER-STORIES.md`: committed stories get status In sprint and the sprint number in the Sprint column; new estimates go into Points. Stories sent back for missing AC stay Draft
