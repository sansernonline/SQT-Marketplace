---
name: app-verifier-upkeep
description: Use when a project verify skill no longer matches the app
---

# app-verifier-upkeep — keep the hands and eyes in step with the app

> A verify skill that gives wrong steps is more dangerous than none, because the agent will trust it and report a pass.

Use it with a skill built by [`app-verifier-setup`](../app-verifier-setup/SKILL.md). On Claude Code that file is `.claude/skills/verify/SKILL.md` (see [`app-verifier-setup/references/builtin-verify.md`](../app-verifier-setup/references/builtin-verify.md)). Maintain that one file and do not create a second `verify-<project>`.

## Steps

1. **List the real features** by pulling from routes · menu · command list · the latest Software Requirements Specification (SRS). Compare against the feature map in the script `<project-name>/test/e2e/verify.*`, and split into 3 groups: matching · missing from the feature map · no longer in the app.
2. **Read the code in parallel.** Send 1 fresh `qa-tester` agent per feature group (at most 5 features each). Each reads only, then reports whether each feature's checks in `verify.*` still match the code, with file and line number, using `parallel-split-and-merge`.
3. **Drive the real app once.** Use 1 agent to run `verify.*` (the script opens and closes the app itself) for every feature, and record pass or fail · screenshots · the step that failed.
4. **Fix only what is proven.** Every fix needs evidence from step 2 or 3. If a feature fails because the app is really broken, not because the steps are wrong, file it as a bug report (`bug-report-template`). Do not edit the steps to make it pass.
5. **Add the features missing from the map** in the existing format, and run each at least once for real before saving.
6. **Bundle the fixes into one set**, prepared as a single commit or a single Pull Request (PR) (commit only when the user says so), and state the count of each group in the message: matching · fixed · added · removed · bugs found.
7. `status-report` type `ตรวจ` (check).

## What not to do

- Edit the steps to pass when the app behaves wrongly, because that hides the bug inside the checking tool.
- Remove a feature from the map because it is hard to test.
- Split the PR into many small pieces, because the reviewer needs to see the whole change in one round.
