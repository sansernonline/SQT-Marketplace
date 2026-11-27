# Close a branch — decision table

Moved from `worktree-and-branch.md` section 4 (2026-11-10)

| Route | Choose when | Must be true first | Commands (run from the main checkout unless noted) | Approval |
|---|---|---|---|---|
| **Merge locally** | The project has no PR flow · a single person · small work already reviewed in the diff | Tests pass on the branch · the base branch is correct (ask if unsure) · no unfinished work in the worktree | `git checkout main` → `git pull` → `git merge --no-ff <branch>` → run tests on main → once they pass, go to step 6 · tests break on main → `git merge --abort` (not possible after the commit → `git reset --hard ORIG_HEAD` at once) and keep the worktree | **รออนุมัติ** (awaiting approval) — committing to main and the rule "do not commit to the main branch without asking" |
| **Open a PR** | The team reviews · CI · the repo has a remote | Tests pass · rebased/merged the latest main · commit messages follow `commit-message-format.md` | In the worktree: `git push -u origin <branch>` → `gh pr create --fill` (or the URL that push prints) · write the body per `pr-description-template.md` · **keep the worktree** until the PR is closed, so you can fix comments | **รออนุมัติ** — pushing off the machine |
| **Keep for now** | Waiting for information · waiting for a decision · work stopped midway | Write the path · branch · what is pending in `docs/BUILD-PLAN.md` or a handoff | Do nothing with git · `git worktree lock --reason "<what it waits for>" ../<repo>-<task>` if you fear it will be pruned | Not needed |
| **Discard** | A spike is done · the losing route in a bake-off · the result is not worth it | The user clearly said to discard (offer it as a choice, never as the default) · first show what will be lost: how many commits (`git log main..<branch> --oneline`) · untracked files | `git worktree remove ../<repo>-<task>` (with leftovers it needs `--force` — ask first) → `git branch -D <branch>` | **รออนุมัติ** — deleting work |

- Takeaways from `finishing-a-development-branch` (obra/superpowers · MIT · reworded): tests before the menu · the user chooses the route · "discard" is not in the normal menu · PR and keep = keep the worktree
- `--no-ff` gives main 1 merge commit per task, so the whole task can be undone with `git revert -m 1` · if the team already uses squash or rebase-merge, follow the team (`cicd-and-release`)
