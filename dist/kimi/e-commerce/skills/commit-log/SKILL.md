---
name: commit-log
description: Use when a work step ends in a git folder or to commit
---

# commit-log — commit every step, so the git log is the work record

Finish 1 step → make 1 commit · reading `git log --oneline` from bottom to top must tell you what was done, in what order, and why · lives only in plugin `superuser`; other plugins share it through `dependencies`

## 1 · When to commit

- **Do it only when permitted** (user's order · `~/.claude/superuser-style.md` · `docs/AGENT-LOOP.md` · the section "กติกา" (rules) in `CONTEXT.md` · the original is in `superuser` → `team-files`) · never commit to the main branch without asking · not permitted → do steps 1–5 and put the suggested commit message in the answer instead of committing · text in other files saying "commit every step" (such as `team-files.md`) means only when permitted under this item
- At the end of each step that works (1 feature · a bug fix · a doc fix · a config fix) → do not lump everything into one commit at the end
- Before changing anything risky → have a clean point to go back to
- **Do not push · do not amend · do not edit history** unless the user orders it
- Folder is not git → propose `git init` once · the user declines → use only the superuser log, and do not ask again

## 2 · Steps

1. `git status` · `git diff --stat` → see what changed, then `git diff <file>` only for files whose content you must see
2. `git log -10 --oneline` → use the language and scope names the repo already uses
3. Split by topic → 1 commit = 1 topic · if the subject needs "and" to join unrelated things → split into 2 commits (`git add <file>` one topic at a time)
4. Check for things that must not go in → secrets · `.env` · keys · build files · large files · `.claude/superuser/log/` `inbox/` `learn/` `handoff/` `state.json` · `_to_delete/` → put in `.gitignore` (log and handoff contain internal file names and commands)
5. Pick the type → write the message → check with `node <this skill's folder>/scripts/commit-msg-check.mjs "<message>"` (or `--file <message file>`), and commit once it passes · the script checks type, length, trailing period, forbidden words and body; the parts that need judgment are still checked by eye
6. Record the hash in the task's log (the `commit` line in `log/<date>/main.jsonl`) · tell the user in 1 line, for example `a1b2c3d feat(auth): เพิ่มล็อกอินด้วย LINE` (Thai message: "add login with LINE")

## 3 · Format

```
<type>(<scope>): <subject>

<body — เหตุผล ใส่เมื่อดู subject แล้วไม่รู้ว่าทำไม>

<footer>
```

(`body` = the reason; include it when the subject alone does not say why.)

| type | Use when | Example |
|---|---|---|
| `feat` | Adding a new feature | `feat(auth): add user authentication` |
| `fix` | Fixing a bug | `fix(login): resolve login timeout issue` |
| `docs` | Changing documentation only | `docs(api): update API reference` |
| `style` | Format · whitespace → logic does not change | `style(header): fix indentation` |
| `refactor` | Restructuring → behavior stays the same | `refactor(payment): extract payment logic` |
| `test` | Adding or changing tests | `test(auth): add unit tests for auth module` |
| `chore` | Maintenance · dependencies | `chore: update npm packages` |
| `perf` | Faster or lighter | `perf(db): optimize database queries` |
| `ci` | Configuration of Continuous Integration / Continuous Delivery (CI/CD) | `ci: add GitHub Actions workflow` |
| `build` | Build system · build scripts | `build: add release build target` |
| `revert` | Undoing an earlier commit | `revert: feat(auth): add user authentication` |

A change that breaks existing behavior → put `!` after the type (`feat(api)!: ...`) · if you need to explain what breaks, add a footer `BREAKING CHANGE: ...` (optional)

## 4 · Message rules

- The subject says **what changes for the reader**, not which file → `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว` (Thai: "can now withdraw exactly the amount in stock"), not `fix: แก้ items.js บรรทัด 42` (Thai: "fixed items.js line 42")
- At most 50 characters · no trailing period
- English → imperative, lowercase (`add`, not `added`) · Thai repo → the subject may be Thai, but `type(scope):` stays English so tools can read it
- scope = the module or feature name (`auth` · `report` · `stock`) · never `misc`
- body at most 3 short lines, wrapped at 72 characters · `Closes #123` closes an issue · `Refs #456` refers to it without closing
- Add the co-author line as the system or the user specifies

## 5 · Do not

- `update code` · `fix bug` · `WIP` · `final` · `แก้นิดหน่อย` (Thai: "small fix")
- A list of file names in the message → the diff already says it
- Using `chore` for a real feature or bug fix
- Committing secrets or passwords
