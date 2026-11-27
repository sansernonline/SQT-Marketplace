---
name: dev-principles
description: Use before code, architecture, tests, ops, docs or screen work to know what good looks like
---

# dev-principles — what good looks like for software-development work

> **One rule:** open the principle file of the kind of work before you start, and judge the finished work against it. A principle says what good is and why; how-to lives in the skills, order and roles in the playbooks. The 3-layer idea and the principles for every job are in `superuser:work-principles`.

## Kind of work → principle → skills → playbook

| Kind of work | Principle file | Main skills (full list in each file) | Main playbooks |
|---|---|---|---|
| Code | [`references/code.md`](references/code.md) | `lazy-coding` · `readable-code` · `principle-*` · `stack-*` · `error-handling-patterns` | `feature` · `bug-fix` · `refactor` |
| Architecture · API · database | [`references/architecture-api.md`](references/architecture-api.md) | `architecture-patterns` · `api-design` · `api-conventions` · `database-design` · `adr-writer` | `new-project` · `feature` |
| Testing · quality evidence | [`references/testing.md`](references/testing.md) | `testing-standards` · `e2e-testing-patterns` · `test-case-template` · `test-evidence` | `feature` · `bug-fix` · `review` |
| Security | [`references/security.md`](references/security.md) | `security-gate` · `threat-model` · `security-audit` · `principle-secure-by-default` | `review` · `ship` |
| Operations · release · incidents | [`references/operations.md`](references/operations.md) | `cicd-and-release` · `observability-basics` · `incident-response` · `postmortem-template` | `ship` · `investigation` |
| Requirements · project documents | [`references/requirements-docs.md`](references/requirements-docs.md) | `srs-writing` · `fsd-writing` · `user-story-writer` · `adr-writer` · `release-notes` · `project-doc-set` | `project-docs` · `new-project` |
| Application screens (web · mobile · Windows) | [`references/ui.md`](references/ui.md) | `ui-craft` · `web-app-design` · `mobile-app-design` · `windows-app-design` · `web-quality-audit` | `feature` · `visual-parity` |

Every job also follows `superuser:work-principles` (prove it works · small steps · simple · root cause · human writing · sources).

## Adding a kind of work

1. Write `references/<work>.md` in the same format: `งานดีคืออะไร` (6–8 principles, each with why + how a reviewer checks it) · `พลาดบ่อย` · `ใช้คู่กับ` · sources.
2. Each principle needs at least 3 reliable sources that agree; drop it otherwise.
3. Add 1 row to the table above.

## Check before done

- The principle file for this kind of work was opened before starting, and the reviewer judged against it
- No step order or `ใคร:` went into a principle file; no how-to was copied into a playbook
