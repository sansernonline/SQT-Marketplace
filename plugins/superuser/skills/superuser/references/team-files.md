# Team working files — where they live, how to write them

This file is identical in every plugin. The original lives in plugin `superuser`. The lead opens it when creating the files for the first time, or when about to record in `IMPROVEMENTS.md`.

## Location

The project root keeps only the standard folders (`ref/` · `docs/` · `mockup/` · `assets/` · `qa/` · `_to_delete/` · `.claude/` · code folders), so SuperUser's working files live in `.claude/superuser/`. Only the lead writes them (except `handoff/<id>.md`, where a worker may append its own handover note).

**Commit rules (one place; other files link here).** `CONTEXT.md` · `HISTORY.md` · `IMPROVEMENTS.md` may go in git. An agent may commit only when permitted, per rule 9 of `SKILL.md` (the user orders it · `~/.claude/superuser-style.md` · `docs/AGENT-LOOP.md` · the "กติกา" (rules) section in `CONTEXT.md`) → 1 step that passes its check = 1 commit per `commit-log`. Not permitted → put the suggested commit message in the answer. Do not push unless the user orders it, or the **`git อัตโนมัติ`** (automatic git) line in "กติกา" is `auto`. `log/` · `inbox/` · `learn/` · `handoff/` · `notes/` · `ledger/` · `out-of-scope/` · `state.json` and `_to_delete/` are not committed and go in `.gitignore`, because the log holds internal file names and commands.

| Where | What it keeps | Rules |
|---|---|---|
| `.claude/superuser/CONTEXT.md` | The central file: what this job is · **ความคืบหน้า** (progress) · กติกา (rules) · where things are · การตัดสินใจ (decisions) · **รับงานต่อ** (pick up the work) | At most 150 lines · overwrite by section, do not append · progress only for jobs still open, at most 15 rows, with status words from section 7 of `SKILL.md` · decisions: the latest 20 rows · whoever opens only this file must know the overview and be able to start the first item |
| `.claude/superuser/HISTORY.md` | Finished jobs (moved from progress as 1 line) · decisions beyond 20 rows | Add a line at the very top, do not delete the old |
| `.claude/superuser/IMPROVEMENTS.md` | New knowledge that fits other jobs | See the next section |
| `.claude/superuser/log/` · `inbox/` · `learn/` | The log the hook records · incoming messages · learning-round notes | Details in [`learning-loop`](learning-loop.md) |
| `.claude/superuser/handoff/` | Work order + handover note, 1 piece per file (`<id>.md`) · a piece's long result in `<id>/` | Format per the skill `handoff` · the lead writes the order, a worker appends its own handover note |
| `.claude/superuser/log/SUMMARY.md` | A log summary for people: cumulative per agent (tasks received · finished normally · failed · working time) · tasks sent to workers today · daily for 30 days | The hook writes it each time the lead finishes a round, never edit by hand · "finished normally" is not a check result; check results are in `docs/BUILD-PLAN.md` or `CONTEXT.md` |
| `.claude/superuser/outbound/` | Draft messages to outsiders awaiting the user to send | The lead writes them · actually sending needs approval · details in [`playbook-unattended-run`](playbook-unattended-run.md) item 5 |
| `.claude/superuser/notes/` · `ledger/` · `out-of-scope/` · `learn/drop/` | The plan's notebook · ledger · rejected ideas · lessons dropped along the way | The lead writes them · before writing, `git check-ignore` must find it and the path must not be a symlink · details in `handoff` → `team-memory` section 8 |
| `docs/BRIEF.md` | Summary of a big job after brainstorming, per [`brief-template`](brief-template.md) | Overwrite when the job changes direction |
| `_to_delete/` | Temporary things · files that were "deleted" | Never really delete; move them here |

- The hook works only in folders that have `.claude/superuser/` and does not create this folder itself.
- Old projects that have `CONTEXT.md` · `IMPROVEMENTS.md` · `.superuser/` at the root can keep using them (the hook still reads `.superuser/`), then move into `.claude/superuser/` when convenient.
- `AGENTS.md` · `GEMINI.md` are created only when the project really uses Codex or Gemini, and are declared as a root exception in the code folder's README.
- **Is anyone else editing?** (if there is git) At the start, record the file list from `git status` and `git diff --stat` for files already pending · run again before sending parallel workers · a file that changed **beyond the start state** without the team touching it = someone else is editing → do not touch that group of files, continue with other parts, and list it under **รออนุมัติ** (awaiting approval) (do not stop to ask mid-job).
- Never put secrets, ID card numbers, full account numbers, or other people's data in files that the lead or a worker writes under `.claude/superuser/` (the log the hook records is an exception, see the next item · work files in the user's own folder, such as their parents' records, may be kept as the user orders).
- **The log also stores messages the user typed** (at most 4,000 characters) after redaction. The hook strips keys, tokens, passwords, 13-digit national ID numbers, 13–19-digit card numbers (passing Luhn), account numbers of the form xxx-x-xxxxx-x, and runs of 10–12 digits (account numbers · phone numbers) · hyphenated phone numbers such as 08x-xxx-xxxx are not stripped · health data or people's names can still enter the log, so `log/` is not committed · to test the redaction (the hook lives only in plugin `superuser`): from the SQT-Marketplace repo root run `node plugins/superuser/hooks/superuser-hook.mjs --self-test` · for an installed plugin, run the file `hooks/superuser-hook.mjs --self-test` in the folder of plugin `superuser` under `~/.claude/plugins/`

## `IMPROVEMENTS.md`

When you find something new that also fits other jobs, record 1 row **at once**, without waiting for the job to end. If there is no file yet, create it.

```markdown
| วันที่ | เจออะไร | ใครเจอ | หลักฐาน · แหล่ง | ควรไปรวมที่ | ควรรวมไหม | รวมแล้ว |
|---|---|---|---|---|---|---|
| 2026-10-07 | <เรื่องที่ใช้กับงานอื่นได้> | `<agent>` | <ลิงก์ · ไฟล์ · ผลที่รัน> | `<skill>` | ใหม่ | ยัง |
```

- **Record when:** a best practice or a fact that changed (rates · procedures · platform rules) · a method the existing skill does not state · a skill or agent that is wrong or out of date · a script that saves time · a trap that cost more than 15 minutes.
- **Do not record:** anything specific to this job or this user · secrets · personal data · the user's money figures.
- **ควรรวมไหม** (should merge?): `ใหม่` (new, not yet decided) · `ควรรวม` (should merge) · `ไม่รวม (<เหตุผล>)` (do not merge) · **รวมแล้ว** (merged): `ยัง` (not yet) · `แล้ว <วันที่> (<ไฟล์>)` (done) once a skill has really been fixed · a row that is not merged gets `—` · new rows go at the top.
- **ใครเจอ** (who found it): an agent name such as `<plugin>:reviewer` · `หัวหน้าทีม` (the lead) · `ผู้ใช้` (the user) · several are ordered with → · the one who writes it into the file is always the lead.
- **The same issue found again:** add evidence to the existing row, do not add a row.
- **After recording a new row:** also add 1 row to the central queue `~/.claude/superuser/IMPROVEMENTS.md` ([`learning-loop`](learning-loop.md)).
- **Merging into a skill:** only when the user says "รวมบทเรียน" (merge the lessons) (playbook [`learn-from-session`](playbook-learn-from-session.md)) · during other work, never edit a skill in SQT-Marketplace yourself.

## Several AIs in one repo (หลาย AI ใน repo เดียว)

2 sessions working in the same folder share the working tree and the staging area: a file the other has staged gets swept into our commit, and scripts that generate files (such as `dist/`) pick up the other's uncommitted files · recording in a table who works on which branch does not help, because both still edit the same folder · you must separate the folders.

1. **1 session, 1 worktree.** Start new work from the latest main branch:
   ```bash
   git fetch origin
   git worktree add ../<repo>-<เครื่องมือ>-<งาน> -b <เครื่องมือ>/<งาน> origin/main
   ```
   then do all the work in that folder · the repo's main folder is for the person, or for the AI the user designates.
2. **A branch name starts with the tool name** (`claude/` · `codex/` · `gemini/`) followed by the job, for example `claude/ui-scan-hook` · the name tells who is working, with no separate table to maintain.
3. **See who is doing what from git.** `git worktree list` (who is in which folder on which branch) · `git branch -vv` · this need not be recorded again in `CONTEXT.md`, because each branch has its own `CONTEXT.md`, and a copy would be stale and would collide at merge.
4. **Never touch another session's worktree.** No commit · no delete · no switching branch in a folder that is not your own (except cleanup per item 5) · a stray file that did not come from this session's tool input = someone else's, never stage it.
5. **Clean up after merge.** Delete the branch (`gh pr merge --delete-branch`), then `git worktree remove <folder>` · if the worktree still has stray files git refuses to remove it; tell the user, never add `--force` · at the start and end of work also go through `git worktree list`: a branch whose PR has been merged (`gh pr list --head <branch> --state merged` finds one), and `git -C <folder> status --porcelain -uall` is empty, and it is not locked → you may `git worktree remove <folder>` then `git branch -d <branch>` at once without asking, even if it belongs to another session or AI · no merged PR found (including a branch just created with no commits yet, which `--merged` counts as merged) · stray files present · `-d` refuses → do not touch, never `-D` or `--force`.
6. Files not in git (`node_modules` · `.venv` · `.env`) do not follow into a new worktree and must be installed or copied by hand · copy secrets only for files `.gitignore` already protects.
