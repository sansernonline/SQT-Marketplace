---
name: superuser
description: Use when software work is big or risky (5+ modules, whole repo, money, personal data, deletes, prod, client delivery) or says superuser.
---

# SuperUser — the team's single front door

> **เปิด `superuser:superuser` ก่อน** (open it first). This file holds only the branch parts (extra rules · playbooks · agents · approvals `รออนุมัติ` · shared files). The lead's full way of working (sizing · budget · 5-point brief · dispatch · evaluation · re-check · answer) lives in the core of plugin `superuser`. Installing this plugin brings superuser in through `dependencies`.

Call it with `/software-development:superuser` or say "use superuser" on software work.

Other plugins have their own `superuser` (`/<plugin>:superuser`). The list is in [`agents`](references/agents.md).

---

## 1 · Rules you must not skip

**Rules specific to this plugin**

- **Where to record** — log decisions with `decision-log` in `docs/BUILD-PLAN.md`, not in the `CONTEXT.md` table. Status tables use `status-report`. `CONTEXT.md` and handoff points follow `handoff`. Style files are made with `owner-style-capture`.
- **Principles behind the rules** — rule 3 `principle-prove-it-works` · rule 4 `principle-proceed-on-reversible-work` (rule numbers of `superuser:superuser`). Read-only playbooks: `investigation` · `review`.

---

## 2 · Understand the task, then pick a playbook

For medium tasks and up, pick **1** from [`playbooks`](references/playbooks.md) and read the whole file before starting.

---

## 3 · Triggers — meet this situation, call this skill

The situation → skill table lives in one place only: [`triggers`](references/triggers.md). Open it when unsure which skill to call.

Shared skills (principles · checking · splitting work · documents · images · slides) live in plugin `superuser`. The code-only parts of those skills are in [`code-extensions`](references/code-extensions.md). Open both together when the task is code.

---

## 4 · Code criteria and principle index

**Code criteria — every diff must pass all 3** (full criteria and the principle index for every group are in [`principles`](references/principles.md))
- **Simple** — nothing not yet needed · the shortest diff that is still correct · `lazy-coding`
- **Engineer-grade structure** — folders by feature · 1 file 1 job · settings outside code · tests beside code · `readable-code`
- **Secure from the start** — validate input immediately · SQL uses parameters · check permissions on the server · secrets outside code · [`principle-secure-by-default`](../principle-secure-by-default/SKILL.md)
- The 3 go together. If a shorter diff makes things harder for the user, `principle-user-experience-first` wins.

---

## 5 · The lead and subagents

The **lead** is the one the user talks to, one per project. On large work the lead coordinates and checks, and does not write big code itself. Shared pieces, small pieces and combined code under an estimated 200 lines the lead may do itself (core `superuser` section 2). Pick the agent: code → `developer` · tests and app checks → `qa-tester` · system design → `solution-architect` · spec → `system-analyst` · documents → `technical-writer`. Full duties of the branch agents, model levels and code-work additions (worktree · read-only work) are in [`agents`](references/agents.md).

---

## 6 · Independence — do not stop the work

Do reversible work right away. Do not do irreversible work or work that affects outsiders on your own. The "`รออนุมัติ`" list, commit rules and pre-approved actions → [`approvals`](references/approvals.md).

---

## 7 · The closing answer

- Name a principle only when it changes the decision. Status tables use the words of `status-report` (the code-work word set differs from other plugins on purpose).

---

## 9 · Shared files — `CONTEXT.md` · `IMPROVEMENTS.md`

Software work uses `docs/BUILD-PLAN.md` (status table and `decision-log`) instead of `HISTORY.md`. Create `CONTEXT.md` per `handoff` → `references/team-memory.md` section 2.

**Working patterns** — pick at planning time. How to run them, costs, pitfalls → `agent-patterns`. Examples → [`examples`](references/examples.md)
