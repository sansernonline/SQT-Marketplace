<!-- merged from skill `worktree-and-branch` on 2026-11-27 · description was: Use when 2+ agents edit one repo or a branch must merge -->
# worktree-and-branch — give each agent its own workspace and close the branch properly

> **One rule:** 1 agent that edits files = 1 worktree = 1 branch. When done, choose how to close the branch with evidence (tests pass on that branch) and clean up. A leftover worktree is a branch nobody is responsible for.

## Use when
- 2 or more agents will edit files in the same repo at the same time (read-only agents need no worktree).
- A spike or refactor may break things in a way that is hard to undo, or an urgent fix is needed while the main checkout has half-finished work (branch from `main`, no stash).
- Comparing 2 approaches (`crew-patterns/parallel-attempts-pick-best`): one worktree per approach. Separate machines or port collisions → add `infra-and-deploy`.
- A branch must be merged, closed, or cleaned up, or conflicts must be resolved.

Not for: a single agent on a small reversible job → a plain branch · read-only work → `Explore` · a repo with no commit yet (make the first commit first). Splitting the work into pieces → `crew-patterns/parallel-split-and-merge` (its step "ห้ามเขียนที่เดียวกัน" points here).

## Steps
1. **Create.** Run `git worktree add ../<repo>-<task> -b <type>/<task> [main]`, then `git worktree list` (must show main + the new one).
   - Place it as a sibling folder, not inside the repo. Exception: an already-gitignored folder such as `.claude/worktrees/`.
   - Branch name `<type>/<task>` per `commit-message-format.md`. One branch can be checked out in only one worktree, so use a new name each time.
   - Windows: path ≤ 260 characters. Keep the folder name short; if `node_modules` is deep, run `git config core.longpaths true` first. Do not place a worktree under OneDrive.
   - A worktree lacks main's untracked files. Copy `.env` and similar config files by name (`cp ../<repo>/.env .env`), never `cp -r` a whole folder (`web-service-essentials`).
   - Install dependencies (`npm ci` / `pip install -r` / `dotnet restore`), then run the tests once before changing anything. If the baseline is broken, report it first and do not mix the fix into the job.
   - Record path · branch · baseline in `docs/BUILD-PLAN.md` or that round's report.
   - Claude Code has built-in worktree commands, and PowerShell has different syntax from bash: see References.
2. **Work only in the worktree.** Do not `cd` back to the main checkout to "just look".
3. **Commit in verifiable steps** on the worktree's branch (`ground-rules/principle-small-verifiable-steps`). A commit on a work branch is **รออนุมัติ** (awaiting approval) unless the user ordered it or wrote permission (`approvals.md` of `superuser`). If not permitted, keep the diff in the worktree and propose it.
4. **Give each parallel group its own files.** Name in the work order the files each group may edit; new files go under the group's folder. Commit a shared contract (for example 1 new field in a central type) before splitting; the side waiting for it writes a fallback. Give each group its own ports and compose project names.
   - An agent must not merge, rebase, or push. It commits in its own folder, then reports: files changed · measured results · what it could not do · any file it edited outside the group (revert before committing, and say so).
   - The lead re-measures every number after merge. The next fix round must not regress (one number may drop, none may get worse). An agent that finishes unusually fast with no answer: read the log and re-issue the order.
5. **Get evidence before closing.** The whole test set passes on this branch · `git status` clean · `git log main..HEAD --oneline -n 30` shows the commits that will go in · if there is a screen, images from `test-automation`. Record commands and results in `docs/BUILD-PLAN.md` (`ground-rules/principle-prove-it-works`).
6. **If main moved**, `git fetch`, then `git rebase origin/main` (branch not pushed, one person using it) or `git merge origin/main` (already pushed or shared). Re-test after combining. On conflict, go to step 8.
7. **Close the branch.** Tests pass first, then let the user choose 1 of 4 routes: merge locally · open a PR · keep for now · discard. Merge, push, and discard wait for **รออนุมัติ**. PR and keep leave the worktree in place. Open [`close-branch.md`](close-branch.md) before every close for the full table.
8. **Resolve conflicts.**
   - Run `git status` first; list conflicting files with `git diff --name-only --diff-filter=U`; note whether a merge or rebase is in progress. Do not `git add` everything at once.
   - Per file, read what our side did (`git log --oneline -n 30 main..HEAD -- <file>`) and what theirs did (`git log --oneline -n 30 HEAD..main -- <file>`): the intent of each commit, not just the differing lines.
   - Resolve hunk by hunk and keep both intents (usually both are needed). If they truly conflict, choose by this job's goal and note the reason in the commit. **Never** `git checkout --ours` / `--theirs` on a whole file: it silently deletes someone else's work.
   - Generated files (lock file · snapshot · build output): regenerate from the command, do not edit by hand.
   - Run the whole test set after combining, then `git add <file>` → `git merge --continue` or `git rebase --continue`. Tests not run = not fixed.
   - If you cannot resolve it this round, run `git merge --abort` / `git rebase --abort`, then report which file conflicted and why. Never leave the repo mid-merge.
9. **Clean up, with evidence before deleting.**
   ```bash
   git worktree list
   git -C ../<repo>-<task> status --porcelain -uall   # empty = clean · not empty = ask the user first
   git worktree remove ../<repo>-<task>               # clean only · leftovers need --force (ask)
   git worktree prune
   git branch -d <branch>                             # -d refuses if not merged · -D needs approval
   ```
   - Delete a branch when its PR is merged (`gh pr list --head <branch> --state merged`). In a repo with no PRs, `git branch --merged main` may be used only for a branch that has its own commits and is known to be finished. `-D` is for the approved "discard" route only.
   - **After merge, delete at once without asking:** PR merged · `status --porcelain -uall` empty · not locked → `git worktree remove`, then `git branch -d`, even when it belongs to another session or AI. A branch just created with no commits also shows in `--merged`, so `--merged` alone cannot decide. If `-d` refuses, stop; do not use `-D`. Check at the start and end of every job. Not merged, or leftover files → do not touch.
   - A worktree Claude Code locked needs `git worktree unlock` first. A lock a person set (`--reason`) is not touched; ask the owner.
   - At the end of the day or of a playbook, `git worktree list` must show only worktrees with a reason in the record (the `housekeeping` playbook of `superuser` calls this step).

## Check before done
- [ ] `git worktree list` matches the record: every worktree has an owner and a reason.
- [ ] The worktree is a sibling folder or an ignored `.claude/worktrees/`; no worktree files show as untracked in main.
- [ ] `.env` and config files were copied by name; no secrets in a commit (`security-gate`).
- [ ] Baseline tests before the change and the whole test set after it, results recorded and dated.
- [ ] The close route was chosen from the table; merge · push · discard are not done until the user answers.
- [ ] Every conflicting file was resolved knowing both sides, tests ran after combining, and no whole-file `--ours`/`--theirs`.
- [ ] After merge: worktree removed · `git worktree prune` · branch deleted with `-d`.
- [ ] Windows: the longest worktree path < 260, or `core.longpaths` is on.

## References
- [`close-branch.md`](close-branch.md) — open before every close: the 4 routes, what must be true first, commands, approval.
- [`claude-code-worktrees.md`](claude-code-worktrees.md) — open when using `claude --worktree`, `EnterWorktree`, `isolation: worktree`, `.worktreeinclude`, or the `WorktreeCreate` hook.
- [`shell-commands.md`](shell-commands.md) — open when on Windows PowerShell 5.1 (no `&&`, stderr rules) or when you want a side-by-side command table.
- [`sources.md`](sources.md) — sources and check dates.
