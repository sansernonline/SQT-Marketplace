---
name: "test-design"
description: "Use when the user asks for test cases for a feature or user story (user command). Runs qa-tester with test-case-template."
disableModelInvocation: true
---

Use the `qa-tester` agent to design test cases for: **$ARGUMENTS**

The tester should:

1. Review the feature / user story / acceptance criteria
2. Apply the `test-case-template` skill
3. Cover every category in `test-case-template` (Test Case Categories), noting which ones do not apply and why
4. Mark each test case with priority (P1-P4)
5. Indicate automation candidacy
6. Produce a coverage summary table at the end
