
# commit-log — commit every step, so the git log is the work record

> **One rule:** finish 1 step → make 1 commit. Reading `git log --oneline` from bottom to top must tell what was done, in what order, and why.

## Use when
- A work step ends in a git folder (1 feature · a bug fix · a doc fix · a config fix), or the user asks to commit.
- Before a risky change, to have a clean point to go back to.

Do it only when permitted: the user's order · `~/.claude/superuser-style.md` · `docs/AGENT-LOOP.md` · the section "กติกา" in `CONTEXT.md` (original in `superuser` → `team-files`). Text elsewhere saying "commit every step" (such as `team-files.md`) means only when permitted here. Never commit to the main branch without asking. Not permitted → do steps 1–5 and put the suggested message in the answer instead of committing. Do not push, amend or edit history unless the user orders it. Folder is not git → propose `git init` once; if the user declines, use only the superuser log and do not ask again.

## Steps
1. `git status` · `git diff --stat`, then `git diff <file>` only for files whose content you must see.
2. `git log -10 --oneline` → use the language and scope names the repo already uses.
3. Split by topic: 1 commit = 1 topic. If the subject needs "and" to join unrelated things, split into 2 commits (`git add <file>` one topic at a time). Do not lump everything into one commit at the end.
4. Check for things that must not go in: secrets · `.env` · keys · build files · large files · `.claude/superuser/log/` `inbox/` `learn/` `handoff/` `state.json` · `_to_delete/` → put in `.gitignore` (log and handoff hold internal file names and commands).
5. Pick the type, write the message, check with `node <this skill's folder>/scripts/commit-msg-check.mjs "<message>"` (or `--file <message file>`), and commit once it passes. The script checks type, length, trailing period, forbidden words and body; judgment parts you still check by eye.
6. Record the hash in the task's log (the `commit` line in `log/<date>/main.jsonl`) and tell the user in 1 line, for example `a1b2c3d feat(auth): เพิ่มล็อกอินด้วย LINE`.

## Format
```
<type>(<scope>): <subject>

<body: the reason; include it when the subject alone does not say why>

<footer>
```

Types: `feat` new feature · `fix` bug fix · `docs` documentation only · `style` format or whitespace, logic unchanged · `refactor` restructuring, behavior unchanged · `test` · `chore` maintenance or dependencies · `perf` faster or lighter · `ci` Continuous Integration / Continuous Delivery (CI/CD) configuration · `build` build system or scripts · `revert` undo an earlier commit (`revert: feat(auth): add user authentication`).

A change that breaks existing behavior → `!` after the type (`feat(api)!: ...`); to explain what breaks, add a footer `BREAKING CHANGE: ...` (optional).

## Message rules
- The subject says **what changes for the reader**, not which file: `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว`, not `fix: แก้ items.js บรรทัด 42`.
- At most 50 characters · no trailing period.
- English → imperative, lowercase (`add`, not `added`). Thai repo → the subject may be Thai, but `type(scope):` stays English so tools can read it.
- scope = the module or feature name (`auth` · `report` · `stock`), never `misc`.
- Body at most 3 short lines, wrapped at 72 characters. `Closes #123` closes an issue; `Refs #456` refers without closing.
- Add the co-author line as the system or the user specifies.
- Do not use: `update code` · `fix bug` · `WIP` · `final` · `แก้นิดหน่อย` · a list of file names (the diff says it) · `chore` for a real feature or fix.

## Check before done
- Permission to commit was confirmed; nothing from item 4 is staged; no secrets.
- 1 commit per topic and `commit-msg-check.mjs` passed.
- The hash is in the log and the user was told in 1 line.
