---
name: workspace-rules
description: Use for commits, temp files, file names or a new project folder
---

# workspace-rules — commits, temp files, document names, workspace setup

> **The one rule:** finish 1 step → make 1 commit when permitted; anything that is not a work product lives only in `_to_delete/`; a file that leaves its history system carries a version in its name; the agent never grants itself permissions.

## Hard rules

- **Commit-log:** finish 1 step → make 1 commit. Reading `git log --oneline` from bottom to top must tell what was done, in what order, and why.
- Commit only when permitted: the user's order · `~/.claude/superuser-style.md` · `docs/AGENT-LOOP.md` · the section "กติกา" in `CONTEXT.md`. Never commit to the main branch without asking. Not permitted → put the suggested message in the answer. Do not push, amend or edit history unless the user orders it.
- Never commit secrets · `.env` · keys · build files · large files · `.claude/superuser/log/` `inbox/` `learn/` `handoff/` `state.json` · `_to_delete/`: put them in `.gitignore`. Scope is a module or feature name, never `misc`.
- **Temp-file-discipline:** anything that is not a real work product must live only in `_to_delete/`. Never leave it in the project root, and never mix it with work files.
- Never place a file directly in `_to_delete/`, except what a tool or hook creates at a fixed place (`superuser-lock/` · `STOP`) and `delete-plan.txt`. Never move files the user placed themselves without asking. Never use `.cache/`.
- Add `_to_delete/` to `.gitignore` in every git project.
- Never delete on your own. Delete only when the user orders it: move into `_to_delete/` first, tell the user, run `delete-plan-check.mjs` and delete only what it lists. Never build the delete list from `ls`.
- **Document-naming:** a file that a system already keeps history for (git · Google Docs version history) must not carry a version in its name. A file that leaves that system must carry one.
- Never put a person's name in a file name. Never name a file `final` · `final2` · `final_ล่าสุด` · `แก้แล้ว`. Never rename received files. Never send `เอกสาร.docx` without version and status in the name.
- Version numbers only move forward. Every change gets a row in the revision history, even a typo fix, and its "แก้อะไร" column must be concrete. Once `APPROVED`, never edit the original file. Never edit a rendered .docx by hand: edit the source and render again.
- **Workspace-setup:** the agent may run checks and edit `.gitignore` on its own. It may add its own permissions only when the user says so in the chat that round. Otherwise the user runs one command. The user's personal rules are always run by the user. Never look for a way around this.
- Tell the user in 1 line what a setup run will do before every run. Never run `git rm --cached` yourself.

## Parts

| When | Open |
|---|---|
| Committing a finished step, writing a commit message | [parts/commit-log/guide.md](parts/commit-log/guide.md) |
| Leaving or cleaning checks, logs, backups, old versions, deleting files | [parts/temp-file-discipline/guide.md](parts/temp-file-discipline/guide.md) |
| Naming a document, version, status, revision history | [parts/document-naming/guide.md](parts/document-naming/guide.md) |
| Setting up a project, `.gitignore`, CLAUDE.md, permissions, git policy | [parts/workspace-setup/guide.md](parts/workspace-setup/guide.md) |

## Check before done

- Temp files are inside `_to_delete/`, and `_to_delete/` is in `.gitignore`.
- No secret or log file is staged.
- Every exported document has version, status and revision history.
