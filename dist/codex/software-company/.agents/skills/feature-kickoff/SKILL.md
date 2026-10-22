---
name: "feature-kickoff"
description: "Start a feature — business analyst → solution architect → system analyst → planning. Requirements, FSD, architecture."
---

> **ทางลัดเข้า SuperUser:** เปิด skill `superuser` ด้วย playbook `feature` แล้วคัดลอกขั้นตอนของ playbook ลง todo ก่อน ส่วนขั้นตอนด้านล่างบอกรูปแบบงานและ output ของคำสั่งนี้ ให้ใช้คู่กับ playbook ไม่ได้ใช้แทน

You will run a complete feature kickoff workflow. The feature is:

**สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Execute these steps **in order**, using sub-agents:

1. **Business Analyst** — Use the `business-analyst` agent to:
   - Ask the user once at the start, only what would change the whole BRD (other unknowns → `(รอยืนยัน)`, keep going)
   - Produce a Business Requirements Document (BRD) with objective, scope, stakeholders, business rules
   - Write user stories with acceptance criteria into `docs/USER-STORIES.md` (`user-story-writer` — read the file first, continue its IDs, update the index table)

2. **Solution Architect** — Use the `solution-architect` agent to:
   - Propose high-level architecture
   - Recommend tech stack with trade-offs (use the `adr-writer` skill)
   - Identify non-functional requirements (NFRs)

3. **System Analyst** — Use the `system-analyst` agent to:
   - Write a Functional Specification Document (FSD) with use cases
   - Define API endpoints
   - Create data model

4. **Project Manager** — Use the `project-manager` agent to:
   - Estimate phases / milestones
   - Identify dependencies and risks
   - Produce a project plan

Run all 4 roles in one go without stopping to ask. Report once at the end and list your own judgment calls under **ตัดสินใจเอง**.
