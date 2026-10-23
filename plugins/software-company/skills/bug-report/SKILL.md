---
name: bug-report
description: File a structured bug report using QA tester + bug-report-template skill.
argument-hint: <brief description of the bug>
disable-model-invocation: true
---

> **ทางลัดเข้า SuperUser:** เปิด skill `superuser` ด้วย playbook `bug-fix` แล้วคัดลอกขั้นตอนของ playbook ลง todo ก่อน ส่วนขั้นตอนด้านล่างบอกรูปแบบงานและ output ของคำสั่งนี้ ให้ใช้คู่กับ playbook ไม่ได้ใช้แทน

Use the `qa-tester` agent to create a complete bug report for: **$ARGUMENTS**

The tester should:

1. Apply the `bug-report-template` skill
2. Gather missing info in one question at the start (unknown → `(รอยืนยัน)`, keep going):
   - Steps to reproduce (exact)
   - Environment details
   - Expected vs actual behavior
   - Frequency
   - Evidence (screenshots, logs)
3. Reproduce once yourself from the reporter's steps before trusting them, and reject these excuses before scoring (idea from trailofbits/skills):
   - "cannot reproduce, so not a bug" → try another environment, data set or timing first, then file as `ทำซ้ำไม่ได้` with what was tried
   - "user did it wrong" → then it is a usability or validation bug, still filed
   - "edge case nobody hits" → count who can hit it; file with the number
   - "already known" → link the existing report; no link, no excuse
4. Assess severity (S1-S4) and propose priority (P1-P4)
5. Identify possible root cause hypothesis if visible
6. Produce final bug report in standard format
7. Suggest related test cases that should be added
