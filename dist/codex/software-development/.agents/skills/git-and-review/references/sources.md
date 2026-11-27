# Sources · worktree-and-branch

Checked 2026-10-23

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
