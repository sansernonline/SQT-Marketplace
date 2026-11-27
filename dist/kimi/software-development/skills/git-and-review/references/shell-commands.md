# PowerShell and bash commands

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
