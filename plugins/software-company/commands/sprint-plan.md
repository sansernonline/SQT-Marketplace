---
description: Run sprint planning — backlog refinement, prioritization, and capacity planning.
argument-hint: <sprint number or goal>
---

Use the `project-manager` agent to facilitate sprint planning for: **$ARGUMENTS**

The PM should:

1. Ask for the backlog of user stories to plan
2. Ask for team capacity (members, days, allocation %)
3. For each story:
   - Verify it has acceptance criteria (if not, refer to `business-analyst`)
   - Get story point estimate (consult `developer` if needed)
   - Confirm dependencies are clear
4. Propose sprint scope based on capacity
5. Identify risks for this sprint
6. Produce sprint plan with:
   - Sprint goal (one sentence)
   - Committed stories with point totals
   - Daily standup schedule
   - Demo / review date
