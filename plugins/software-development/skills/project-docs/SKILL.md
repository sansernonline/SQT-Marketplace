---
name: project-docs
description: Use when choosing project docs, onboarding docs or release notes
argument-hint: '<role, e.g. "backend developer", or version number, e.g. "1.4.0">'
---

# project-docs — pick the right docs, then write them for the reader who uses them

> **One rule:** every doc must answer who reads it and what they decide after reading. If it cannot answer, do not write it.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Which docs does this project need?", "docs are scattered", "a client asks what we deliver", "open-items Excel" | [`references/project-doc-set.md`](references/project-doc-set.md) (table of docs: [`references/technical-docs.md`](references/technical-docs.md)) |
| "Onboard a new developer", "30/60/90-day guide", "a new QA joins next week" | [`references/onboard.md`](references/onboard.md) |
| "Release notes for 1.4.0", "what changed in this version for users" | [`references/release-notes.md`](references/release-notes.md) (templates: [`references/writer-templates.md`](references/writer-templates.md)) |
| "Put the docs on a website", "searchable manual with versions" | [`references/docs-site.md`](references/docs-site.md) |
| The project has 2 or more sub-projects, each with its own docs | [`references/ecosystem.md`](references/ecosystem.md) |

To list the open items in the open-items Excel, run `scripts/open_items.py`. The checklist of docs is in `assets/doc-set-checklist.md`.

## Steps every part shares

1. Ask who reads the doc, and what they must do after reading. Unknown answers go in as `(รอยืนยัน)` (awaiting confirmation), and the work goes on.
2. Look for the real document first. Keep one source for each fact, and link to it instead of copying it.
3. Put files that come from the client or the old system in `ref/`. Treat `ref/` as read-only.
4. Create a folder only when it has real content, not in advance.
5. Write the doc in the register its reader needs, then check it with a fresh reader who has not seen the project.

## Check before done

- No password, token or account secret is in any doc. Link to the place where access is requested instead.
- A document that outsiders must not see stays in `docs/` in the repo. It does not go on a public docs site.
- A public docs site is not used as free hosting for an online business or a SaaS product, and the site counts as public even when the repo is private.
- Release notes are written for users, from the commits since the last version, and every unknown is marked `(รอยืนยัน)`.
- Every sub-project folder in an ecosystem is named `ecosystem/`, and shared docs live once in the root `docs/`.
