---
name: "bug-report"
description: "File a structured bug report using QA tester + bug-report-template skill."
---

> **ทางลัดเข้า A-Team:** เปิด skill `agent-team` ด้วย playbook `bug-fix` แล้วคัดขั้นตอนของ playbook ลง todo ก่อน · ขั้นตอนด้านล่างคือรูปแบบงานและ output ของคำสั่งนี้ ใช้ประกอบ playbook ไม่ใช่แทนที่

Use the `qa-tester` agent to create a complete bug report for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

The tester should:

1. Apply the `bug-report-template` skill
2. Ask clarifying questions to gather missing info:
   - Steps to reproduce (exact)
   - Environment details
   - Expected vs actual behavior
   - Frequency
   - Evidence (screenshots, logs)
3. Assess severity (S1-S4) and propose priority (P1-P4)
4. Identify possible root cause hypothesis if visible
5. Produce final bug report in standard format
6. Suggest related test cases that should be added
