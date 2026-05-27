---
description: Design test cases for a feature using QA tester + test-case-template skill.
argument-hint: <feature or user story>
---

Use the `qa-tester` agent to design test cases for: **$ARGUMENTS**

The tester should:

1. Review the feature / user story / acceptance criteria
2. Apply the `test-case-template` skill
3. Design test cases covering ALL categories:
   - Functional (happy path)
   - Boundary
   - Negative
   - Equivalence classes
   - State transitions (if applicable)
   - Integration
   - Concurrency (if applicable)
   - Security
   - Performance (if applicable)
   - Accessibility (for UI)
4. Mark each test case with priority (P1-P4)
5. Indicate automation candidacy
6. Produce a coverage summary table at the end
