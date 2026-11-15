---
name: worktree-and-branch
description: Use when 2+ agents edit one repo or a branch must merge
---

# worktree-and-branch — give each agent its own workspace and close the branch properly

> **The one rule of this skill:** 1 agent that edits files = 1 worktree = 1 branch · when done, **choose how to close the branch with evidence** (tests pass on that branch) and **clean up** — a leftover worktree is a branch nobody is responsible for

A git worktree is a "copy of the working folder" that shares the same `.git` but has its own branch · HEAD · index — 2 agents edit files at the same time without colliding, and the main checkout is not touched · use together with `parallel-split-and-merge` (a shared piece in `superuser`) at its step "ห้ามเขียนที่เดียวกัน" (do not write to the same place) — that skill splits the work, and this skill separates the workspaces and merges back

## When it pays off

| Situation | Do |
|---|---|
| 2 or more agents will **edit files** in the same repo at the same time | One worktree per agent — read-only agents do not need one |
| A spike or refactor that may break in a way hard to undo (moving structure · changing a big dependency) | A separate worktree · the main checkout keeps running throughout |
| An urgent bug fix is needed while the main checkout has half-finished work | A worktree from `main` · no stash needed |
| Comparing 2 approaches (`parallel-attempts-pick-best`) | One worktree per approach · if separate machines are really needed → `docker-sandbox` isolated per approach |

## When it does **not** pay off

| Situation | Use |
|---|---|
| A single agent, small job, reversible with `git checkout -- .` | A plain branch in the same checkout |
| Read-only work (survey · review · measure) | No separation needed — `Explore` or an agent told "do not edit files" |
| The repo has no commit yet | A worktree cannot be created · make the first commit |
| The project must install things or run servers that collide on a port | worktree + `docker-sandbox` (one room per worktree) |

---

## 1 · Create a worktree

```bash
git worktree add ../<repo>-<งาน> -b <ประเภท>/<งาน>     # จาก HEAD ปัจจุบัน
git worktree add ../<repo>-<งาน> -b fix/login main      # จาก main
git worktree list                                        # ต้องเห็น 2 บรรทัด: main checkout + ใหม่
```

- **Place it as a sibling folder** `../<repo>-<task>` (for example `../shop-api-fix-login`) — not inside the repo, except a folder that is already gitignored such as Claude Code's `.claude/worktrees/` (item 2) · inside without ignore = the worktree's files show as untracked in main, and `rg`/build sweep up 2 copies
- **Branch named `<type>/<task>`** per `commit-message-format` (`feat/` · `fix/` · `refactor/` · `spike/`) · one branch can be checked out in only one worktree (git refuses a duplicate), so use a new name for every worktree
- **Windows: path ≤ 260 characters** — Git for Windows turns long paths off by default · keep the sibling folder name short (`-fix-login`, not `-fix-login-page-validation-2026-10-23`) · for a project whose `node_modules` is already deep, run `git config core.longpaths true` first (gitforwindows.org · checked 2026-10-23) · a worktree under OneDrive gets synced — place it outside OneDrive
- **A worktree does not have main's untracked files** — `.env` · `.env.local` · `appsettings.Development.json` · dev certificates must be copied by hand, **naming each file** (`cp ../<repo>/.env .env`), not `cp -r` of a whole folder (it would bring `node_modules` and unintended secrets along) · secrets stay outside git as before (`config-and-secrets`)
- **Install dependencies and then measure a baseline** — `npm ci` / `pip install -r` / `dotnet restore` in the worktree · run the tests once before changing anything · if tests are broken at baseline → report first, do not mix the fix into the job (after obra/superpowers `using-git-worktrees` · MIT · rewritten)
- Record path · branch · baseline in `docs/BUILD-PLAN.md` or that round's report — whoever comes later must know whose worktree this is and how far it got

## 2 · Claude Code has it built in (docs checked 2026-10-23)

| Need | Do | Note |
|---|---|---|
| A separate session from the terminal | `claude --worktree <name>` (or `-w`) | Creates `.claude/worktrees/<name>/` at the root and branch `worktree-<name>` · put `.claude/worktrees/` in `.gitignore` · with no name → it picks one · the repo must already have a commit |
| Have Claude create one mid-session | Say "work in a worktree" → tool `EnterWorktree` · leave with `ExitWorktree` | Entering a path outside `.claude/worktrees/` needs approval each time · while inside a worktree Claude Code **blocks** file edits and git commands that point back to the main checkout |
| Each subagent has its own worktree | Frontmatter `isolation: worktree` or say "use worktrees for your agents" | A temporary worktree · no changes → deleted for you · has changes → stays until swept per `cleanupPeriodDays` |
| Carry `.env` to every worktree Claude creates | A `.worktreeinclude` file at the root (`.gitignore` syntax) | Copies only files that match **and** are gitignored · has no effect on a hand-typed `git worktree add` |
| Branch from pending work, not from the remote's `main` | Settings `"worktree": { "baseRef": "head" }` | The default `"fresh"` = from the default branch on `origin` (fetched for you if older than 24 hours) |
| Leaving the session | Claude checks for pending work → clean and unnamed = deletes the worktree + branch for you · has work = asks keep/delete · come back with `claude --worktree <name> --resume` | `-p` (non-interactive) does not ask → does not delete · you must `git worktree remove` yourself · a worktree Claude locked needs `git worktree unlock` first |
| Not git (SVN · Perforce) or want it placed elsewhere | The `WorktreeCreate` hook reads `name` from stdin and `echo`es a path · paired with `WorktreeRemove` | The hook replaces git entirely → `.worktreeinclude` does not work, copy `.env` in the hook yourself · the hook does not run when Claude types `git worktree add` itself through Bash |

A worktree created by hand with `git worktree add` and one from Claude Code share the `.git` · project-level plugins · permissions where "don't ask again" was pressed (on Windows the permission stays with that worktree) · Windows: deleting a worktree does not delete files outside it — a junction/symlink inside removes only the link

## 3 · Work → evidence

1. Work only in the worktree — do not `cd` back to the main checkout to "just look" (Claude Code blocks it · humans must take care themselves)
2. Commit in verifiable steps (`principle-small-verifiable-steps`) on the worktree's branch — a commit on a work branch is under "รออนุมัติ" (awaiting approval) unless the user ordered it or wrote permission (`approvals.md` of `superuser`) · if not yet permitted → keep it as a diff in the worktree and propose it
3. **Evidence before closing**: the whole test set passes on this branch · `git status` clean · `git log main..HEAD --oneline -n 30` shows the commits that will go in · if there is a screen: images from `app-verifier-setup` · record commands and results in `docs/BUILD-PLAN.md` (`principle-prove-it-works`)
4. If main moved meanwhile → `git fetch` then `git rebase origin/main` (branch not yet pushed · one person using it) or `git merge origin/main` (already pushed or others use it) · conflict → item 5 · re-test after combining

## 4 · Close the branch — decision table

Tests pass first, then let the user choose 1 of 4 ways: merge locally · open a PR · keep for now · discard · merge, push and discard must **wait for approval** (รออนุมัติ) · PR and keep leave the worktree in place · the full table (choose when · must be true first · command) must be opened from [`references/close-branch.md`](references/close-branch.md) before every close

**Split parallel work by owned files** (measured in the website-clone lesson: 3 groups merged with no collision, and parallel time equalled the longest group)

1. Name in the work order the files each group may edit, and new files must be under the group's folder (for example new CSS is a separate file, not touching another group's shared file)
2. A shared contract that every group uses (for example 1 new field in a central data type) is committed before splitting · the side that uses it while waiting writes a fallback
3. Separate resources per group: ports, compose project names
4. An agent must not merge, rebase, or push itself. It commits in its own folder, then reports 4 things: files changed · measured results · what it could not do · if it edited a file outside the group to experiment, it must revert before committing and say so
5. The lead re-measures every number itself after merge · the next fix round must not regress (one number may drop, but others must not get worse) · an agent that finishes unusually fast with no answer: read the log and re-issue the order

## 5 · Resolve conflicts

1. **Look at the status before touching files** — `git status` · conflicting files: `git diff --name-only --diff-filter=U` · whether a merge or rebase is in progress (which step) · do not `git add` everything right away
2. **Understand both sides** per file — what our side did (`git log --oneline -n 30 main..HEAD -- <file>`) · what their side did (`git log --oneline -n 30 HEAD..main -- <file>`) · the intent of each commit, not just the differing lines
3. **Resolve hunk by hunk to keep both intents** — most cases need both (their new function + our fix) · if they truly conflict, choose by this job's goal and note the reason in the commit · **never** `git checkout --ours` / `--theirs` on a whole file to get through fast — that silently deletes someone else's work
4. Generated files (lock file · snapshot · build output) → regenerate from the command, do not edit by hand
5. **Run the whole test set after combining** — a conflict "fixed" but with tests not run = not fixed · `git add <file>` → `git merge --continue` or `git rebase --continue`
6. If you cannot resolve it this round → `git merge --abort` / `git rebase --abort` to return to the original state, then report which file conflicted and why — never leave the repo mid-merge
7. The approach of mattpocock `resolving-merge-conflicts` (MIT): trace the intent of each hunk and resolve fully, do not abort and run away — the original is not found at its old path in the current repo (`ยังไม่ได้ตรวจ` not yet checked · read from a copy someone else kept)

## 6 · Clean up (evidence required before deleting)

```bash
git worktree list                        # ก่อนลบ ดูว่าเหลืออะไร
git -C ../<repo>-<งาน> status --porcelain -uall   # ว่าง = สะอาด · ไม่ว่าง = ถามผู้ใช้ก่อน
git worktree remove ../<repo>-<งาน>      # สะอาดเท่านั้น · มีของค้างต้อง --force (ถาม)
git worktree prune                       # ล้างรายการของโฟลเดอร์ที่ถูกลบมือ
git branch --merged main                 # รายชื่อ branch ที่ main มีครบแล้ว — ลบได้ด้วย -d
git branch -d <branch>                   # -d ปฏิเสธถ้ายังไม่ merge · -D บังคับ = ต้องอนุมัติ
```

- Delete a branch when **that branch's PR has been merged** (`gh pr list --head <branch> --state merged`) · in a repo with no PRs, `git branch --merged main` may be used only for a branch that has its own commits and is known to be finished · `-D` is used only on the "discard" path that has been approved
- **After merge, delete at once with no need to ask** — the branch's PR is merged · `status --porcelain -uall` is empty · not locked → `git worktree remove` then `git branch -d` right away, even when it belongs to another session or AI (the work is fully in main, nothing is lost) · a branch just created with no commits also shows in `--merged`, so `--merged` alone cannot decide · if `-d` refuses → stop, do not use `-D` · check every time at the start and end of work, do not leave `<repo>-<task>` folders piled beside the repo · not yet merged or has leftover files → do not touch
- To delete a worktree that Claude Code locked → `git worktree unlock` first · a lock a person set (`--reason`) is not touched, ask the owner
- At the end of the day or of a playbook: `git worktree list` must show only those with a reason in the record · the `housekeeping` playbook of `superuser` calls this item

## 7 · PowerShell and bash commands

| Need | PowerShell 5.1 (Windows) | bash |
|---|---|---|
| Create a worktree + new branch | `git worktree add ..\shop-api-fix-login -b fix/login main` | `git worktree add ../shop-api-fix-login -b fix/login main` |
| Copy `.env` by name | `Copy-Item ..\shop-api\.env .\.env` | `cp ../shop-api/.env .env` |
| Go in to work | `Set-Location ..\shop-api-fix-login` | `cd ../shop-api-fix-login` |
| Install then measure a baseline (long output → file) | `npm ci > ..\shop-api\_to_delete\install.txt 2>&1; npm test > ..\shop-api\_to_delete\baseline.txt 2>&1; Get-Content ..\shop-api\_to_delete\baseline.txt -Tail 20` | `npm ci > ../shop-api/_to_delete/install.txt 2>&1 && npm test > ../shop-api/_to_delete/baseline.txt 2>&1; tail -20 ../shop-api/_to_delete/baseline.txt` |
| Commits that will go into main | `git log main..HEAD --oneline -n 30` | `git log main..HEAD --oneline -n 30` |
| Files in conflict during merge | `git diff --name-only --diff-filter=U` | `git diff --name-only --diff-filter=U` |
| Is the worktree clean | `git -C ..\shop-api-fix-login status --porcelain -uall` (empty = clean) | `git -C ../shop-api-fix-login status --porcelain -uall` |
| Remove the worktree then prune | `git worktree remove ..\shop-api-fix-login; git worktree prune` | `git worktree remove ../shop-api-fix-login && git worktree prune` |
| Branches already merged | `git branch --merged main` | `git branch --merged main` |
| Turn on long path (Windows only) | `git config core.longpaths true` | — |

PowerShell 5.1 has no `&&` → use `;` or `if ($?) { … }` · paths may use `\` or `/` with git · do not use `2>&1` with native commands in PowerShell unless redirecting to a file (stderr becomes an error record) — the table above writes to files so it works

## 8 · Check before sending

- [ ] `git worktree list` matches the record — every worktree has a branch owner and a reason
- [ ] The worktree is a sibling folder or an ignored `.claude/worktrees/` · no untracked files of the worktree show up in main
- [ ] `.env` and dev config files were copied by name · no secrets in a commit (`security-gate`)
- [ ] A baseline test before the change and the whole test set after it, with results recorded and dated
- [ ] The way to close the branch was chosen from the table in item 4 · steps marked "รออนุมัติ" (awaiting approval) (merge into main · push · discard) are not done until the user answers
- [ ] Every conflicting file was resolved knowing both sides · tests ran after combining · no whole-file `--ours`/`--theirs` in the log
- [ ] After merge: worktree removed · `git worktree prune` · branch deleted with `-d` after `--merged` confirmed
- [ ] Windows: the longest worktree path < 260 or `core.longpaths` is on

## 9 · Anti-patterns

- **A worktree inside the repo folder with no ignore** — main sees it as untracked · `rg` and build find 2 copies
- **`cp -r` of the whole main into a worktree** — brings `node_modules` · nested `.git` · unintended secrets
- **One branch used by 2 worktrees** — git refuses · forcing with `--force` gives colliding HEADs
- **Resolving conflicts with `--ours` on a whole file** — deletes someone else's work without knowing · not detected until production
- **Merge into main and test afterwards** — tests breaking on main = everyone breaks · test on the branch first, then test again after merge and before push
- **`git worktree remove --force` without looking at `status`** — leftover work is lost for good
- **Leaving a worktree for months** — the branch falls behind main · conflicts grow every day · close or discard within the work cycle
- **`git branch -D` instead of `-d` because `-d` refuses** — `-d` refusing is evidence it is not merged
- **An agent merging into main or pushing itself** because "tests pass" — always under "รออนุมัติ" (awaiting approval) unless permission is written

## Connecting to other skills

| Need | Use |
|---|---|
| Split work into independent pieces before separating worktrees · merge results back | `parallel-split-and-merge` (a shared piece in `superuser`) — its step "ห้ามเขียนที่เดียวกัน" (do not write to the same place) points to this skill · do not edit superuser's files from here |
| Try several approaches then choose | `parallel-attempts-pick-best` — one worktree per approach |
| Separate real machines (port collision · installing things) | `docker-sandbox` — an isolated room per worktree |
| Branch names · commit messages | `commit-message-format` |
| PR content | `pr-description-template` · review with `code-review-checklist` |
| Steps that must ask a person first (merge main · push · delete) | `superuser` → `references/approvals.md` |
| Work in verifiable steps · prove it works | `principle-small-verifiable-steps` · `principle-prove-it-works` |
| Record leftover worktrees and the reason | `decision-log` · `handoff` |
| Secrets in a copied `.env` | `config-and-secrets` · `security-gate` before push |
| Routine cleanup | the `housekeeping` playbook of `superuser` |

## Sources (checked 2026-10-23)

| Topic | Source |
|---|---|
| `git worktree add/list/remove/prune/lock/unlock/repair` · one branch per worktree · `remove` needs a clean state · `.git` is a file pointing to `gitdir` | git-scm.com/docs/git-worktree |
| `-d` needs merged · `-D` = `--delete --force` · `--merged` | git-scm.com/docs/git-branch |
| `claude --worktree` · `.claude/worktrees/<name>` · branch `worktree-<name>` · `EnterWorktree`/`ExitWorktree` · `.worktreeinclude` · `worktree.baseRef` · cleanup on exit · blocks commands that point to the main checkout · `isolation: worktree` · Windows junction · sweep `cleanupPeriodDays` | code.claude.com/docs/en/worktrees · code.claude.com/docs/en/common-workflows |
| hook `WorktreeCreate` (reads `name` from stdin · `echo` path) · `WorktreeRemove` · does not run when `git worktree add` is typed by hand | code.claude.com/docs/en/hooks (section WorktreeCreate) · the full input fields of `WorktreeRemove` (`ยังไม่ได้ตรวจ` not yet checked) |
| Place an already-ignored worktree · install dependencies · baseline test before changes | github.com/obra/superpowers → skills/using-git-worktrees (MIT · rewritten · the original recommends `.worktrees/` inside the project — we chose sibling folders per the Claude Code docs "Manage worktrees manually") |
| Test before the menu · merge/PR/keep paths · discard only when ordered · never `--force` by itself | github.com/obra/superpowers → skills/finishing-a-development-branch (MIT · rewritten) |
| Trace intent per hunk · resolve both sides fully · run checks after resolving | mattpocock/skills → skills/engineering/resolving-merge-conflicts (MIT) — the original URL returned 404 on 2026-10-23 · read from a third-party copy (`ยังไม่ได้ตรวจ` original not yet checked) |
| Windows 260 characters · long path off by default · `core.longpaths` | gitforwindows.org FAQ "Git cannot create a file or directory with a long path" |
| PowerShell 5.1 has no `&&` · stderr of native commands | Claude Code's PowerShell tool rules on this machine (checked against the real shell 2026-10-23) |
