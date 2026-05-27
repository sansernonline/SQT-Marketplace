---
description: File a structured bug report using QA tester + bug-report-template skill.
argument-hint: <brief description of the bug>
---

Use the `qa-tester` agent to create a complete bug report for: **$ARGUMENTS**

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
