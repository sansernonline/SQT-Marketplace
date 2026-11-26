# Software work playbooks

Moved from `superuser` section 2 (to shrink the main file that loads every time, 2026-11-11) · the team lead opens this file when the work is medium size or bigger.

For medium-size work and up, choose **1** playbook, or compose one per `playbook-template`, and read the whole file before starting · if 2 apply → the end of [`triggers`](triggers.md)

| playbook | Use when |
|---|---|
| [`investigation`](playbook-investigation.md) | A read-only question — how X works · why it is done this way · where something should go · for matters outside the code → `research-with-sources/prior-art-review` · `reference-app-research` ([`triggers`](triggers.md)) |
| [`pickup-and-pause`](playbook-pickup-and-pause.md) | Continue from where it was left · take over from another agent · pause so someone can take over |
| [`new-project`](playbook-new-project.md) | Start a new project that has no code yet, until it runs and can be proven |
| [`feature`](playbook-feature.md) | Add or change the behavior of an existing program |
| [`bug-fix`](playbook-bug-fix.md) | Something is broken — an error · a failing test · a wrong screen · a memory leak · a user report |
| [`refactor`](playbook-refactor.md) | Change the structure with the same behavior · migrate a system |
| [`performance`](playbook-performance.md) | Slow · heavy on the machine · you want one number to improve to a target |
| [`visual-parity`](playbook-visual-parity.md) | The real screen must match a mockup or the old system |
| [`prototype`](playbook-prototype.md) | A choice that can be answered by trying it for real, without asking a person |
| [`review`](playbook-review.md) | Check code, a design or a document before sending |
| [`ship`](playbook-ship.md) | Open a Pull Request (PR) · keep it going until Continuous Integration (CI) is green · fix per review · prepare to merge |
| [`project-docs`](playbook-project-docs.md) | Project documents following the SQT-Marketplace prompt set — Business Requirements Document (BRD) · Software Requirements Specification (SRS) · mockup · Functional Specification Document (FSD) · manual |
| [`unattended-run`](playbook-unattended-run.md) | Long or multi-phase work with nobody watching — "finish it, I'll come back to look" · "do it overnight" |
| [`skill-authoring`](playbook-skill-authoring.md) | Write or edit a skill · agent · prompt and test that it really helps |
| [`learn-from-session`](playbook-learn-from-session.md) | The user orders "collect the lessons" · "reflect" · the team keeps fixing the same issue |
| [`housekeeping`](playbook-housekeeping.md) | Clean up old worktrees · branches · sandboxes · images |
