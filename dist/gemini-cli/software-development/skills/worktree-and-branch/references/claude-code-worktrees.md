# Claude Code built-in worktrees (docs checked 2026-10-23)

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
