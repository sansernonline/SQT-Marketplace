---
name: commit-message-format
description: Use when writing git commit messages. Enforces Conventional Commits format with type, scope, description, body, and footer. Helps maintain consistent commit history and enables automated changelog generation.
---

# Conventional Commit Message Format

## When to use this skill

- Writing any git commit message
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

## Examples

### Simple commit
```
feat(auth): add password reset via email
```

### With scope
```
fix(checkout): prevent double-charge on slow networks
```

### With body
```
feat(api): add rate limiting to public endpoints

Implement token bucket algorithm with 100 req/min limit per IP.
Returns 429 status with Retry-After header when exceeded.
Cache state stored in Redis to handle multi-instance deployments.
```

### Breaking change
```
feat(api)!: change auth response shape

BREAKING CHANGE: The /auth endpoint now returns tokens nested under
"data" key instead of root level. Update clients accordingly.

Before: { "access_token": "..." }
After:  { "data": { "access_token": "..." } }
```

### With issue reference
```
fix(login): handle email with leading whitespace

Closes #1234
Refs #5678
```

### Revert
```
revert: feat(auth): add password reset via email

This reverts commit a1b2c3d4.
Reverting due to security issue found in production.

Refs INCIDENT-42
```

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
- [ ] Subject is imperative and ≤50 chars
- [ ] Body explains WHY (if change isn't obvious)
- [ ] Breaking changes marked with `!` AND `BREAKING CHANGE:` footer
- [ ] Linked to issue/ticket when applicable

## Anti-patterns

- ❌ `update code`
- ❌ `fix bug`
- ❌ `WIP`
- ❌ `final commit` / `final final`
- ❌ Mixed changes: don't combine feature + refactor + fix in one commit
- ❌ Past tense: `added feature` (use `add feature`)
- ❌ Vague scope: `fix(misc): ...` (be specific)

## Splitting Commits

If your change is hard to summarize in one subject, split it:

```bash
# Instead of one big commit
feat(profile): redesign UI, add export, fix bug

# Split into focused commits
refactor(profile): extract user info component
feat(profile): redesign user info layout
feat(profile): add CSV export
fix(profile): correct date format in display
```
