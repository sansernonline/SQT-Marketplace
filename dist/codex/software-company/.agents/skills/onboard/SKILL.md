---
name: "onboard"
description: "Use when a new team member needs onboarding docs (30/60/90-day guide) via technical-writer."
---

Use the `technical-writer` agent to create an onboarding guide for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

The technical writer should:

1. **Initial Discovery** — gather:
   - Role + level (junior, senior, lead)
   - Team they're joining
   - Tech stack they'll work with
   - Existing onboarding materials
   - Common confusion points from past onboards

2. **Apply Diátaxis framework** — onboarding has 4 parts:
   - **Tutorial** — first day setup + first task
   - **How-To** — common dev workflows (pull request (PR), deploy, test)
   - **Reference** — links to systems, who-owns-what
   - **Explanation** — architecture overview, history

3. **Structure as 30/60/90 day plan:**

   **Day 1-7: Setup & Orientation**
   - Environment setup checklist
   - Tool access (Slack, GitHub, Amazon Web Services (AWS), etc.) — ใส่ลิงก์ไปที่ขอสิทธิ์ ไม่ใส่รหัสผ่านหรือ token ในเอกสาร
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
   - On-call info / escalation (ชื่อช่องทางและตารางเวร ไม่ใส่รหัสผ่านหรือ token — ลิงก์ไปที่ขอสิทธิ์แทน)
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
   - 30/60/90 timeline (รูปไทม์ไลน์ตามแบบประจำบ้านของ skill `diagram-figures` — เอกสารโปรเจกต์ห้ามใช้ Mermaid ค่าเริ่มต้น · Mermaid ใช้ได้เฉพาะภาพร่างในแชตหรือโน้ต README สั้น ๆ)
   - Checklist per phase
   - Frequently Asked Questions (FAQ) section
   - Glossary of company terms

6. **Hand-off suggestions:**
   - Architecture deep dive → `solution-architect`
   - Security training → `security-engineer`
   - Domain training → `business-analyst`
   - Buddy system pairing → `project-manager`
