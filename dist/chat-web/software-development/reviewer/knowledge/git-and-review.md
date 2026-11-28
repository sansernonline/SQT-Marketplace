# skill: git-and-review

Use for PR review, PR text, commit messages or git worktrees

# git-and-review — review code, write the PR and commits, and keep branches tidy

> **One rule:** nothing is pushed, merged or opened as a pull request unless the user asks for it, and every branch ends with a clear close or a recorded reason to keep it.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Cards running in parallel need their own folder, port and test database · "merge the lanes one at a time" | [`scripts/lane.mjs`](scripts/lane.mjs) `add <card>` (worktree beside the project folder as `<project>-lane-<card>` + `PORT` + `TEST_DB_NAME` in `.env.lane`, which is added to `.git/info/exclude` so it is never committed) · [`scripts/merge-queue.mjs`](scripts/merge-queue.mjs) `<card>... --check "<cmd>"` (merge one, re-check, roll back if it breaks, never pushes) · which cards may run together: `superuser` `card.mjs next --parallel` |
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


## reference: claude-code-worktrees.md

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


## reference: close-branch.md

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


## reference: code-review-checklist.md

<!-- merged from skill `code-review-checklist` on 2026-11-27 · description was: Use when reviewing a pull request or your own code -->
# Code Review Checklist — review a pull request or your own code, with actionable comments

> **In SuperUser:** start from the playbook [`review`](../../superuser/references/playbook-review.md), then use this checklist for ordinary reviews. High-risk work or a large diff → `crew-patterns/adversarial-review-panel`.

## Use when
- Reviewing a pull request, self-reviewing before submitting, or auditing an existing module
- Not for: a second look inside a team → a new `reviewer` agent (it applies this checklist) · contested design, large or high-risk diff, "stress test" → `crew-patterns/adversarial-review-panel` · reviewing a visual → `graphic-design:design-review` if installed, else `ui-craft` · writing the PR description → `pr-description-template.md` · hunting misleading patterns across the codebase → `code-craft` · scanners, secrets, dependency check, OWASP Top 10:2025 → `security-gate` (run both before merge; `owasp-top10.md`, `owasp-stack-checks.md`)

## Steps
1. **Understand the intent:** read the PR description and linked ticket. For a branch or PR, pin the range first (`BASE=$(git merge-base main HEAD)` · `HEAD=$(git rev-parse HEAD)` · review `git diff $BASE..$HEAD`) and write both SHAs in the report.
2. **Skim the diff** for the overall shape.
3. **Review against the checklist.** House checks first; each skill holds the full rules, so link it in the comment:
   - Security: run [`security-gate`](../../security-gate/SKILL.md) on the diff (input checked at the boundary, parameterized SQL, server-side permission check, no secrets in code or logs)
   - Simple enough: [`code-craft`](../../code-craft/SKILL.md) · readable: [`code-craft`](../../code-craft/SKILL.md) · tests next to the code and proving the change: [`test-automation`](../../test-automation/SKILL.md)
   - Shared code touched → [`code-craft`](../../code-craft/SKILL.md) list is in the PR · commit message follows [`commit-message-format.md`](commit-message-format.md)
   - The generic list (correctness, design, performance, documentation, maintainability): [`full-checklist.md`](full-checklist.md)
4. **Verify before posting:** hand every `blocking:` finding to a fresh agent (or second reader) with only the diff and the finding, and ask if it is real. Drop it if they cannot reproduce or point to the line.
5. **Do not flag:** a problem that existed before this PR · what the linter or compiler already catches · a nitpick a senior reviewer would skip · behaviour that looks wrong but is right (check context first) · a rule the team silenced on purpose with a lint-ignore comment · a problem only for an input that cannot occur here.
6. **Run the code** if non-trivial; do not just read.
7. **Leave actionable comments:** a concrete fix for each, not just the problem. Prefixes:

   | Prefix | Meaning | Example |
   |---|---|---|
   | `blocking:` | Must fix before merge | `blocking: This will cause Y in production because Z.` then `Suggest: <concrete fix>` |
   | `important:` | Should fix, can be follow-up if urgent | |
   | `nit:` | Minor, optional | `nit: Consider X for readability` |
   | `q:` | Question, not necessarily a change | `q: Why did you choose X over Y here?` |
   | `praise:` | Acknowledge good work | `Nice approach with X — much cleaner than the previous version.` |

   These prefixes are for comments on a pull request. A review report uses the `reviewer` scale: `blocking:` = สูง · `important:` = กลาง · `nit:` = ต่ำ, verdict ผ่าน / ไม่ผ่าน with counts per level.
8. **Avoid:** bikeshedding when there is no convention · "why not MY way" · only criticism · vague comments ("this is wrong": say why and suggest a fix) · reviewing too much at once (ask for PRs under 400 lines).

## Run as a command
`/software-development:git-and-review <file path or PR description>` — use a new read-only `reviewer` agent to review **the user's request** (high-stakes or contested → `crew-patterns/adversarial-review-panel`). Open `superuser` with the playbook `review` and copy its steps into the todo first; use both together. The reviewer: reads the file(s) or diff and pins the range (step 1) · applies this skill · rates each finding **สูง** (must fix before merge) · **กลาง** (should fix) · **ต่ำ** (optional) · gives a concrete fix for each · outputs verdict **ผ่าน** / **ไม่ผ่าน** with counts per level (not the `blocking:`/`nit:` prefixes).

The author does not fix every finding on sight: a finding can be wrong (misread code, or the "bug" is covered by a test). Push back with evidence (`file:line` · test name · command output), not opinion · fix what stands · list each rejected finding and its evidence in the report so the lead can judge.

## Check before done
- Every finding has a severity and a concrete fix · every `blocking:` was verified by a second reader
- Both SHAs are in the report · none of the "do not flag" kinds is in the findings

## References
- [`full-checklist.md`](full-checklist.md) — open when the diff needs the generic checks (correctness, design, performance, documentation, maintainability)


## reference: commit-message-format.md

<!-- merged from skill `commit-message-format` on 2026-11-27 · description was: Use when setting up commitlint or semantic-release -->
# Conventional Commit Message Format

> When to commit and logging each step → `workspace-rules/commit-log` (shared skill). This file adds the release side: scope, commitlint, semantic-release.

## When to use this skill

- Writing commits that feed release tooling (commitlint, semantic-release) — everyday commits use `workspace-rules/commit-log`
- Reviewing commits in a PR for consistency
- Setting up commitlint / semantic-release

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

| Type | Use for | Triggers release? |
|------|---------|-------------------|
| `feat` | New feature | minor version bump |
| `fix` | Bug fix | patch version bump |
| `docs` | Documentation only | no |
| `style` | Formatting, no code change | no |
| `refactor` | Refactor without behavior change | no |
| `perf` | Performance improvement | patch |
| `test` | Adding/updating tests | no |
| `build` | Build system, dependencies | no |
| `ci` | CI/CD changes | no |
| `chore` | Maintenance tasks | no |
| `revert` | Revert previous commit | depends |

## Subject Rules

- **Imperative mood** — "add" not "added" or "adds"
- **Lowercase** — start with lowercase letter
- **No period at end**
- **Max 50 characters**
- **Complete this sentence:** "If applied, this commit will _____"

## Short and readable (applies to every commit)

Someone scanning `git log --oneline` should understand each line without opening the diff.

- **Measure the repo's norm, then follow it** — `git log --oneline -30` before the first commit: language, whether `scope` is used, which types appear, typical subject length. A repo that never uses scope does not get one from you; a repo at 40 characters does not get a 72-character subject. Note what you measured in the report once (idea from ECC conventional-commit-review).
- **Language follows the repo** — A Thai repo gets Thai descriptions; `type(scope):` stays English so tools can parse it. Lowercase and imperative mood apply to English only.
- **Subject says what changed for the reader**, not which file was touched: `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว`, not `fix: แก้ items.js บรรทัด 42`
- **One line is enough** for most commits. Add a body only when *why* is not obvious from the subject — at most 3 short lines or bullets
- **No filler** — no "this commit", "minor changes", "update code", "แก้นิดหน่อย", or a list of changed files (the diff already shows them)
- **One commit, one topic** — if the subject needs "and" or `·` to join unrelated changes, split the commit. Check `git diff --stat` before writing the subject: when the files fall into more than one topic (feature + unrelated rename, fix + formatting sweep), propose the split as a list of `<subject> → <files>` per commit and stage each with `git add <files>` or `git add -p`; never hide the second topic in the body

| ✗ Hard to read | ✓ Short and clear |
|---|---|
| `update items.js, server.js, add test, fix bug` | `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว` |
| `feat: implement new functionality for exporting the low-stock report data to CSV format` | `feat(report): ส่งออกรายงานของใกล้หมดเป็น CSV` |
| `refactor: แก้โค้ดให้ดีขึ้น` | `refactor(report): อ่านประวัติเบิกครั้งเดียวแทนทุกสินค้า` |

## Body Rules

- Separate from subject with blank line
- Wrap at 72 characters
- Explain **why**, not just **what** (diff shows what)
- Use bullet points if multiple points
- Reference issues/tickets at the end

## Footer Conventions

```
Closes #123              ← closes the issue
Refs #456                ← references but doesn't close
BREAKING CHANGE: ...     ← breaking change notice
Co-authored-by: ...      ← attribution
```

## Quality Checklist

- [ ] Type matches the change (not just "chore" for everything)
- [ ] Scope is meaningful (component/module name)
- [ ] Subject is imperative and ≤50 chars — Thai subjects count base consonants only (~50); vowels and tone marks do not count · กติกาเต็มอยู่ใน `superuser` skill `workspace-rules/commit-log`
- [ ] Body explains WHY (if change isn't obvious)
- [ ] Breaking changes marked with `!` AND `BREAKING CHANGE:` footer
- [ ] Linked to issue/ticket when applicable


## reference: full-checklist.md

# Code review — full generic checklist

Moved out of [SKILL.md](code-review-checklist.md). Open it for a large or unfamiliar change. The house-specific checks stay in `code-review-checklist.md`.

### Correctness

- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled? (null, empty, zero, negative, very large)
- [ ] Are error paths handled? (network failure, timeout, invalid input)
- [ ] Are race conditions / concurrency issues considered?
- [ ] Off-by-one errors checked?
- [ ] Are assumptions explicit (or asserted)?

### Design

- [ ] Does this fit the existing architecture?
- [ ] Is the abstraction at the right level? (not too generic, not too specific)
- [ ] Single Responsibility — does each function/class do one thing?
- [ ] DRY — but not over-abstracted?
- [ ] Are dependencies appropriate? (no circular, minimal coupling)
- [ ] Could this be simpler?

### Tests

- [ ] Are there tests for the new code?
- [ ] Tests cover happy path + edge cases + errors?
- [ ] Tests would actually fail if code broke? (no false positives)
- [ ] Tests are readable and maintainable?
- [ ] No flaky tests introduced?

**Rate each missing test 1–10 before suggesting it** (adapted from `pr-test-analyzer` · claude-plugins-official · Apache-2.0 · opened 2026-11-10). 9–10: data loss, money or security would break unnoticed · 7–8: the user sees an error · 5–6: edge case with limited impact · below 5: do not suggest it. Review behaviour, not line coverage. Do not ask for tests of plain getters and setters.

### Security

- [ ] Input validation at boundaries?
- [ ] No SQL injection (parameterized queries)?
- [ ] No XSS (proper escaping)?
- [ ] No secrets/credentials in code?
- [ ] Authorization checks for sensitive operations?
- [ ] PII / sensitive data logged appropriately?
- [ ] Dependencies updated? No known CVEs?

### Performance

- [ ] No N+1 queries?
- [ ] Appropriate caching where beneficial?
- [ ] Loops/algorithms with appropriate complexity?
- [ ] Large data handled with pagination/streaming?
- [ ] No unnecessary network calls?

### Readability

- [ ] Names reveal intent? (variables, functions, classes)
- [ ] Functions reasonably short?
- [ ] Complex logic has explanatory comments? (WHY, not WHAT)
- [ ] No commented-out code left behind?
- [ ] No debug prints / TODO without ticket?
- [ ] Consistent with existing code style?

### Documentation

- [ ] Public APIs documented?
- [ ] README/CHANGELOG updated if needed?
- [ ] Breaking changes called out?
- [ ] New env vars / config documented?

### Maintainability

- [ ] Could a new team member understand this in 6 months?
- [ ] Easy to modify when requirements change?
- [ ] No magic numbers / strings (use constants)?
- [ ] Logging at appropriate levels?


## reference: pr-description-template.md

<!-- merged from skill `pr-description-template` on 2026-11-27 · description was: Use when writing a pull request description -->
# Pull Request Description Template

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When NOT to use](#when-not-to-use)
- [0 · Look for an existing format first (every time)](#0--look-for-an-existing-format-first-every-time)
- [Output Template](#output-template)
- [Size Guidelines](#size-guidelines)
- [Summary Writing](#summary-writing)
- [References](#references)

ข้อความภาษาไทย → `human-writing` `thai-grammar.md` หัวข้อ 4 ระดับ ธุรกิจ

## When to use this skill

- Opening any pull request
- Updating a PR description after major changes
- Onboarding team to consistent PR practices

## When NOT to use

| Task | Use instead |
|---|---|
| Reviewing someone's PR or self-reviewing the code | `code-review-checklist.md` |
| Adversarial review of a risky or contested change | `crew-patterns/adversarial-review-panel` |

## 0 · Look for an existing format first (every time)

Before using the structure or templates in this file, check whether the user, the client or the project already has its own format:

- **What to look at:** PR templates in the repo: `.github/pull_request_template.md` · `.github/PULL_REQUEST_TEMPLATE/*.md` · `docs/pull_request_template.md` · `PULL_REQUEST_TEMPLATE.md` at the root · and the 3 most recently merged PRs (`gh pr list --state merged -L 3`) to see how the team writes them
- **Result:** if found, use it (headings, order, field names, running numbers) and say in the reply which file the format came from · if not found, use the template in this file as the fallback and say that no existing format was found
- **Every format still needs the content:** parts the team's format lacks but this skill requires (how to test · merge risk) are added at the end of the team's format, without reworking the team's structure

## Output Template

```markdown
## Summary
<2-4 sentence explanation of what this PR does and why>

## Linked Issues
- Closes #XXX
- Refs #YYY

## Changes
- Added: ...
- Changed: ...
- Fixed: ...
- Removed: ...

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that breaks existing behavior)
- [ ] Documentation update
- [ ] Refactor (no functional change)
- [ ] Performance improvement
- [ ] Test additions/updates
- [ ] Build/CI changes

## How to Test
1. Pull this branch
2. Run `<command>`
3. Verify ...
4. Try edge case: ...

## Evidence
<!-- ก่อน/หลัง ที่ reviewer ตรวจเองได้: ผล test ที่รันจริง (ชื่อ test + ผ่าน/ไม่ผ่าน) · ตัวเลขที่วัดได้ · ภาพหน้าจอ — "tested locally" ไม่นับ -->
- Before: ...
- After: ...

## Merge Danger
<!-- one-way door = ย้อนกลับยาก (migration ลบคอลัมน์ · ลบ API · เปลี่ยนรูปแบบข้อมูลที่เก็บแล้ว) ต้องบอกแผนถอยกลับ · two-way door = revert ได้ใน 1 commit -->
<one-way door / two-way door — ถ้า one-way ใส่แผนถอยกลับ>

## Screenshots / Demos
<!-- ใช้ภาพจากข้อมูลจำลอง หรือเบลอข้อมูลลูกค้าจริงก่อนแนบ -->
| Before | After |
|--------|-------|
| <img>  | <img> |

## Checklist
- [ ] My code follows the project style guide
- [ ] I have performed self-review of my code
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] I have updated documentation as needed
- [ ] No new linter warnings
- [ ] No console.log / debug code left
- [ ] Breaking changes are documented

## Breaking Changes
<describe what breaks and migration path, OR write "None">

## Performance Impact
<measurements if applicable, OR write "No significant impact">

## Security Considerations
<note any security implications, OR write "None">

## Deployment Notes
<env var changes (ใส่ชื่อตัวแปรเท่านั้น ห้ามใส่ค่าจริงหรือรหัสลับ), migrations, feature flags needed, OR "Standard deployment">

## Notes for Reviewer
<anything reviewer should pay attention to, gotchas, alternative approaches considered>
```

## Size Guidelines

| Lines changed | Review difficulty | Recommendation |
|--------------|-------------------|----------------|
| < 100 | Easy | ✓ Ideal size |
| 100-400 | Moderate | ✓ Acceptable |
| > 400 | Hard | ✗ Split into stacked PRs |

If your PR is huge, split into:
1. Refactoring PR (no behavior change)
2. Feature PR (small, focused) — with tests that prove the work functions, in the same PR, not a separate test PR

> Pushing a branch or opening a PR is done only when the user asks — you may prepare the PR description in advance, but do not push or open it yourself

## Summary Writing

**Structure:** What changed + Why it matters + Brief how. Bad and good summary examples, screenshot tips and reviewer-friendly tips are in [`writing-tips.md`](writing-tips.md).

## References

- [`writing-tips.md`](writing-tips.md) — open for summary examples, screenshot tips and reviewer-friendly tips


## reference: shell-commands.md

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


## reference: sources.md

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


## reference: worktree-and-branch.md

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


## reference: writing-tips.md

# Writing tips · pr-description-template

## Summary Writing

Bad summaries:
- "Fixes bug"
- "Updates code"
- "See ticket"

Good summaries:
- "Prevents double-charging customers when payment provider times out, by adding idempotency key to charge API calls"
- "Adds email verification step during signup to reduce spam accounts; sends 6-digit code via existing email service"

**Structure:** What changed + Why it matters + Brief how

## Screenshots Best Practices

- Always for UI changes
- Show before AND after side-by-side
- Highlight the actual change with arrows/circles
- Include mobile view if responsive
- Use GIFs for interactions (max 30 sec)

## Reviewer-Friendly Tips

- Tag specific people for areas they know
- Mention if breaking change requires coordination
- Note non-obvious decisions in code comments
- Reply to your own PR with "Self-review notes" for tricky parts
- Mark draft PRs as Draft until ready
