---
name: dev-principles
description: Use before code, tests, ops, docs or screen work to judge it
---

# dev-principles — what good looks like for software-development work

> **One rule:** open the principle file of the kind of work before you start, and judge the finished work against it. A principle says what good is and why; how-to lives in the skills, order and roles in the playbooks. The 3-layer idea and the principles for every job are in `superuser:work-principles`.

## Kind of work → principle → skills → playbook

| Kind of work | Principle file | Main skills (full list in each file) | Main playbooks |
|---|---|---|---|
| Code | [`references/code.md`](references/code.md) | `code-craft` · `stack-*` · `errors-and-logs` · `project-bootstrap` | `feature` · `bug-fix` · `refactor` · `housekeeping` |
| Architecture · API · database | [`references/architecture-api.md`](references/architecture-api.md) | `architecture` · `api-design` · `database-design` | `new-project` · `feature` |
| Testing · quality evidence | [`references/testing.md`](references/testing.md) | `test-automation` · `qa-docs` | `feature` · `bug-fix` · `review` |
| Security | [`references/security.md`](references/security.md) | `security-gate` · `security-audit` · `security-operations` | `review` · `ship` |
| Operations · release · incidents | [`references/operations.md`](references/operations.md) | `cicd-and-release` · `incidents-and-monitoring` | `ship` · `incident` · `investigation` |
| Requirements · project documents | [`references/requirements-docs.md`](references/requirements-docs.md) | `requirements-writing` · `architecture` · `project-docs` | `project-docs` · `new-project` |
| Application screens (web · mobile · Windows) | [`references/ui.md`](references/ui.md) | `ui-craft` · `web-audit` | `feature` · `visual-parity` |
| Data · AI/LLM · voice agents · MCP | [`references/data-ai.md`](references/data-ai.md) | `data-analysis` · `data-import-export` · `ai-engineering` | `ai-feature` · `feature` · `prototype` |
| Mobile apps · games | [`references/mobile-game.md`](references/mobile-game.md) | `mobile-engineering` · `ui-craft` · `game-development` | `feature` · `ship` · `performance` |
| Regulated or money domains (payments · health · insurance · IoT · smart contracts · SaaS · checkout · legal docs) | [`references/domain-systems.md`](references/domain-systems.md) | `domain-systems` | `feature` · `review` · `ship` |
| Designed documents · slides · diagrams · one-off logo or poster | [`references/documents-diagrams.md`](references/documents-diagrams.md) | `document-design` · `slide-deck` · `diagrams` · `graphic-design:design-by-type` | `project-docs` |
| Product and project planning (roadmap · sprint · retrospective · naming · reference apps) | [`references/product-project.md`](references/product-project.md) | `product-planning` · `product-naming` · `reference-app-research` · `requirements-writing` | `new-project` · `prototype` · `project-docs` |
| Systems without docs or source (legacy spec recovery · authorized reverse engineering · framework upgrades) | [`references/legacy-reverse.md`](references/legacy-reverse.md) | `legacy-spec-recovery` · `reverse-engineering` · `code-craft` | `investigation` · `refactor` · `project-docs` |

Writing or changing a skill, agent or playbook: the principles are in `superuser:work-principles` → `references/skill-authoring.md`; how-to in `superuser:skill-authoring`; playbook `skill-authoring`.

Every job also follows `superuser:work-principles` (prove it works · small steps · simple · root cause · human writing · sources).

## Adding a kind of work

1. Write `references/<work>.md` in the same format: `งานดีคืออะไร` (6–8 principles, each with why + how a reviewer checks it) · `พลาดบ่อย` · `ใช้คู่กับ` · sources.
2. Each principle needs at least 3 reliable sources that agree; drop it otherwise.
3. Add 1 row to the table above.

## Check before done

- The principle file for this kind of work was opened before starting, and the reviewer judged against it
- No step order or `ใคร:` went into a principle file; no how-to was copied into a playbook
