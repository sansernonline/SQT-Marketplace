# Awaiting approval · pre-approved · Docker sandbox

## Autonomy — do not stop work

Moved from `superuser` section 6 (to shrink the main file that loads every time, 2026-11-11)

Principle behind this section: `ground-rules/principle-proceed-on-reversible-work`

Examples of reversible work and this plugin's order of official sources → [`examples`](examples.md)

**`รออนุมัติ` (awaiting approval)** — work that cannot be undone or that affects outsiders. The agent does not do it by itself:
- deploy to production · touch the real database · delete the user's data or files
- install software machine-wide · use admin rights
- `git commit` · `push` (see the commit rule below)
- force-push · rewrite history on a branch others use · merge into the main branch
- send a message or email to a customer or an outsider
- enter real secrets · pay money · accept terms on the user's behalf
- hit a CAPTCHA on someone else's website — do not solve it and do not look for a way around it; tell the user to do it. For our own system, use the provider's test values instead (see `docker-sandbox` item 6)

Pre-approved · full freedom inside the Docker sandbox → [`approvals`](approvals.md)

**Commit rule** — if the user orders it, or has clearly written permission in `~/.claude/superuser-style.md` or `docs/AGENT-LOOP.md` or the "กติกา" (rules) section of `CONTEXT.md` → commit in small pieces per `commit-message-format` on the work branch, never on the main branch · if not permitted → put the suggested commit message in the reply · do not guess that other documents grant permission (do not push unless the user orders it or has written it in those files) · every playbook refers to this rule

## Pre-approved · Docker sandbox

Continues the `รออนุมัติ` (awaiting approval) list above · applies when the user has written the permission, or when working in a sandbox

**Pre-approved** — written in `~/.claude/superuser-style.md` or `docs/AGENT-LOOP.md` or the "กติกา" (rules) section of the project's `CONTEXT.md` (a file the user wrote counts as the user's order), for example "commit on the work branch freely" · "push on the work branch is allowed" (push must be written explicitly) · "deploy to staging is allowed". That item leaves `รออนุมัติ` only within the written scope. **Cannot be pre-approved:** deploy to production · delete real data · force-push a branch others use · pay money · send messages on the user's behalf · CAPTCHA

**Inside the project's Docker sandbox ([`docker-sandbox`](../../docker-sandbox/SKILL.md))** — installing software · deleting files in the sandbox · running servers · wiping the sandbox and rebuilding are fully allowed, because a break can be rebuilt. Anything that leaves the sandbox (sending data · real accounts · push · deploy) stays in `รออนุมัติ`.
