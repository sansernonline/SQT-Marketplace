---
description: Start a new feature by coordinating BA → SA → Architect → planning. Produces requirements, FSD, and architecture.
argument-hint: <feature description>
---

You will run a complete feature kickoff workflow. The feature is:

**$ARGUMENTS**

Execute these steps **in order**, using sub-agents:

1. **Business Analyst** — Use the `business-analyst` agent to:
   - Ask clarifying questions to the user
   - Produce a BRD with objective, scope, stakeholders, business rules
   - Write user stories with acceptance criteria

2. **Solution Architect** — Use the `solution-architect` agent to:
   - Propose high-level architecture
   - Recommend tech stack with trade-offs (use the `adr-writer` skill)
   - Identify NFRs

3. **System Analyst** — Use the `system-analyst` agent to:
   - Write FSD with use cases
   - Define API endpoints
   - Create data model

4. **Project Manager** — Use the `project-manager` agent to:
   - Estimate phases / milestones
   - Identify dependencies and risks
   - Produce a project plan

After each step, summarize and ask if user wants to proceed to the next role.
