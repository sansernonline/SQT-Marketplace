---
description: Create comprehensive onboarding documentation for a new team member using technical-writer agent. Produces role-specific guide for first 30/60/90 days.
argument-hint: <role, e.g., "backend developer" or "QA engineer">
---

Use the `technical-writer` agent to create an onboarding guide for: **$ARGUMENTS**

The technical writer should:

1. **Initial Discovery** — gather:
   - Role + level (junior, senior, lead)
   - Team they're joining
   - Tech stack they'll work with
   - Existing onboarding materials
   - Common confusion points from past onboards

2. **Apply Diátaxis framework** — onboarding has 4 parts:
   - 🎓 **Tutorial** — first day setup + first task
   - 🔧 **How-To** — common dev workflows (PR, deploy, test)
   - 📖 **Reference** — links to systems, who-owns-what
   - 💡 **Explanation** — architecture overview, history

3. **Structure as 30/60/90 day plan:**

   **Day 1-7: Setup & Orientation**
   - Environment setup checklist
   - Tool access (Slack, GitHub, AWS, etc.)
   - Key people to meet (intros)
   - Codebase tour (key directories)
   - First small task (warm-up)

   **Day 8-30: Foundation**
   - Architecture overview
   - Domain knowledge basics
   - First real feature/bug fix
   - Pair programming sessions
   - Code review participation

   **Day 31-60: Contribution**
   - Independent feature delivery
   - On-call shadowing (if applicable)
   - Participate in planning meetings
   - Start mentoring suggestions

   **Day 61-90: Full Productivity**
   - Lead small initiatives
   - Contribute to design discussions
   - Improve team processes
   - Performance check-in

4. **Include practical sections:**

   **Quick Reference Card:**
   - Critical commands
   - Important Slack channels
   - On-call info / escalation
   - Where to find docs
   - Who to ask about X

   **Codebase Tour:**
   - Repository structure
   - Build / test / deploy commands
   - Branching strategy
   - Code style + linting

   **Team Norms:**
   - Meeting cadence
   - Communication channels (Slack vs email vs sync)
   - PR review expectations
   - Working hours / time zones

5. **Produce polished onboarding doc** using `polished-document-style` skill:
   - Welcome message
   - 30/60/90 timeline (Mermaid gantt)
   - Checklist per phase
   - FAQ section
   - Glossary of company terms

6. **Hand-off suggestions:**
   - Architecture deep dive → `solution-architect`
   - Security training → `security-engineer`
   - Domain training → `business-analyst`
   - Buddy system pairing → `project-manager`
