---
name: git-and-review
description: Use for PR review, PR text, commit messages or git worktrees
argument-hint: '<file path or PR description>'
---

# git-and-review — review code, write the PR and commits, and keep branches tidy

> **One rule:** nothing is pushed, merged or opened as a pull request unless the user asks for it, and every branch ends with a clear close or a recorded reason to keep it.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Cards running in parallel need their own folder, port and test database · "merge the lanes one at a time" | [`scripts/lane.mjs`](scripts/lane.mjs) `add <card>` (worktree + `PORT` + `TEST_DB_NAME` in `.env.lane`) · [`scripts/merge-queue.mjs`](scripts/merge-queue.mjs) `<card>... --check "<cmd>"` (merge one, re-check, roll back if it breaks, never pushes) · which cards may run together: `superuser` `card.mjs next --parallel` |
| "Review this PR", "check my code before I submit", "is this diff safe?" | [`references/code-review-checklist.md`](references/code-review-checklist.md) |
| "Write the PR description", "what do I put in the pull request?" | [`references/pr-description-template.md`](references/pr-description-template.md) |
| Commit messages, commitlint, semantic-release, "what format for the commit?" | [`references/commit-message-format.md`](references/commit-message-format.md) |
| 2 or more agents edit one repo, parallel attempts, "merge this branch", "clean up worktrees" | [`references/worktree-and-branch.md`](references/worktree-and-branch.md) |
| Closing a branch: merge, open a PR, keep or discard | [`references/close-branch.md`](references/close-branch.md) |
| Claude Code's own `--worktree` flag or `EnterWorktree` | [`references/claude-code-worktrees.md`](references/claude-code-worktrees.md) |
| A large or unfamiliar change, full checklist | [`references/full-checklist.md`](references/full-checklist.md) |
| PowerShell or bash commands for worktrees and diffs | [`references/shell-commands.md`](references/shell-commands.md) |
| Writing a PR summary that a reader can act on | [`references/writing-tips.md`](references/writing-tips.md) |

## Steps every part shares

1. **Pin the range before you review.** For a branch or PR, find the base with `git merge-base main HEAD`, then review `git diff <base>..<head>`. Write both commit hashes in the report.
2. **Read the intent first.** Read the PR description and the linked ticket, then skim the diff for its overall shape.
3. **Run the code** for anything non-trivial. Do not only read it.
4. **Give each comment a level.** Use `blocking:` for a must-fix before merge, and a lighter label for a suggestion. Each blocking comment says what breaks and gives a concrete fix.
5. **Close the branch on purpose.** Pick one of 4 routes in `close-branch.md`: merge locally, open a PR, keep for now, or discard. The user chooses the route.

## Check before done

- Do not push, rebase, merge, or open a PR on your own. An agent in a worktree commits in its own folder and reports back; the lead merges.
- Never run `git push --force` by itself. Discard a branch or worktree only when the user orders it, and first show how many commits would be lost.
- Never leave a repo mid-merge or mid-rebase. If a merge fails, abort it and report which file conflicted.
- Never commit `.env`, keys or tokens. Copy config files by name into a new worktree, never with `cp -r`.
- Do not flag a problem that existed before the change, something the linter already catches, or a nitpick a senior reviewer would skip.
- High-risk work or a large diff goes to a second, adversarial review (`superuser` `playbook-review`) before merge.

## References

- [`references/worktree-and-branch.md`](references/worktree-and-branch.md) and [`references/close-branch.md`](references/close-branch.md) — the branch lifecycle
- [`references/sources.md`](references/sources.md) — where the worktree and branch rules came from
