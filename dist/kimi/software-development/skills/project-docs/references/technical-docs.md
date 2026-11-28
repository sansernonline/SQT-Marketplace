# Technical docs: table, writing order and who writes what

Read this when choosing the technical doc set or about to write one of them. The summary is in `SKILL.md` sections 2.2–4.

## Technical docs (section 2.2)

This group is **all markdown** and **does not depend on project size**. It depends on what the project contains.

| Doc | File | Answers the question | Needed when |
|---|---|---|---|
| README | `<project-name>/README.md` | How to install and run | **Always** |
| BUILD-PLAN | `docs/BUILD-PLAN.md` | What to build first and next · where we are now | **Always** |
| USER-STORIES | `docs/USER-STORIES.md` | What to build for whom · which story is ready for a sprint · what the AC (acceptance criteria) are | Work runs in sprints or there is a backlog (`requirements-writing`) |
| Sprint plan | `docs/sprints/sprint-NN.md` | Which stories this sprint takes · what the goal is · what the risks are | Work runs in sprints (`/sprint-plan`). One file per sprint; never overwrite old ones |
| AGENT-LOOP | `docs/AGENT-LOOP.md` | How the agent works in a cycle · what the stop condition is | An agent writes code in rounds (`spec-to-code-loop`) |
| API-SPEC | `docs/API-SPEC.md` | What each endpoint accepts, returns and how it fails | There is an API that others call (`api-design`) |
| DATA-DICTIONARY | `docs/DATA-DICTIONARY.md` | What a field means · what values it can take | There is a database or data schema (`database-design`) |
| EVALUATION-POLICY | `docs/EVALUATION-POLICY.md` | What measures whether the output is good enough · what the pass threshold is | Output comes from a model or LLM that is not always right |
| PROMPT-LIBRARY | `docs/PROMPT-LIBRARY.md` | Which prompt is the real one · which version · what changed | An LLM sits on the system's main path |
| ADR | `docs/decisions/ADR-*.md` | Why we chose this way and not the other | A decision will be questioned again (`architecture`) |
| Runbook | `docs/runbook-<topic>.md`, one topic per file | What to do when the system goes down at 2 a.m. | A system is really running and someone is on call |

> **The 4 conditional docs (LLM · API · database) are the ones people forget most often.**
> The team then ends up asking the agent every round "which prompt is the real one" or "what does this field mean".

## Technical track: when to write (section 3)

| Write when | Doc |
|---|---|
| Before the first line of code | README · BUILD-PLAN |
| Before letting an agent work in rounds | AGENT-LOOP |
| When designing the first table | DATA-DICTIONARY |
| When designing the first endpoint | API-SPEC |
| When writing the first prompt that will really be used | PROMPT-LIBRARY · EVALUATION-POLICY |
| When deciding something that will be questioned again | ADR |
| Before going live | Runbook |

> **Write the ADR and DATA-DICTIONARY at decision time, not in the project wrap-up.**
> You can write them afterwards, but the real reasons are gone by then.

## Who writes which doc, with which skill (section 4)

| Doc | agent | skill used |
|---|---|---|
| README · CHANGELOG | `technical-writer` | `project-bootstrap` |
| Project Plan | `project-manager` | `document-design` |
| BRD · user story | `business-analyst` | `requirements-writing` |
| SRS | `system-analyst` | `requirements-writing` |
| FSD | `system-analyst` | `requirements-writing` |
| Architecture | `solution-architect` | `architecture` · `diagrams` |
| ADR | `solution-architect` | `architecture` |
| Test Plan · Test Cases | `qa-tester` | `qa-docs` |
| mockups | `ux-designer` | `ui-craft` |
| User guide (`MAN`) | `technical-writer` | `design-gate/polished-document-style` |
| Runbook | `devops-engineer` | `incidents-and-monitoring` |
| BUILD-PLAN | `project-manager` | `superuser:ground-rules` |
| AGENT-LOOP | `developer` | `spec-to-code-loop` |
| API-SPEC | `system-analyst` | `api-design` |
| DATA-DICTIONARY | `system-analyst` | `database-design` |
| PROMPT-LIBRARY · EVALUATION-POLICY | `developer` | none (pairs with skill `ai-engineering`) |
