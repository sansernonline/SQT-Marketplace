---
name: code-review-checklist
description: Use when reviewing a pull request or self-reviewing code before submitting.
argument-hint: <file path or PR description>
---

> **ใน SuperUser:** รีวิวเริ่มจาก playbook [`review`](../superuser/references/playbook-review.md) แล้วใช้ checklist นี้กับรีวิวทั่วไป ส่วนงานเสี่ยงสูงหรือ diff ใหญ่ใช้ `adversarial-review-panel`

# Code Review Checklist

## When to use this skill

- Reviewing a pull request
- Self-review before submitting code
- Onboarding new code reviewers
- Auditing code quality of existing modules

## When NOT to use

| Task | Use instead |
|---|---|
| Second look at a finished piece inside a team | a new `reviewer` agent (it applies this checklist to code) |
| Contested design, large or high-risk diff, "stress test" / "find blind spots" | `adversarial-review-panel` (several `reviewer` agents) |
| Reviewing a visual (image, poster, screen look) | (if plugin `graphic-design` is installed) `graphic-design:design-review`, else `ui-craft` checks |
| Writing or updating the PR description itself | `pr-description-template` |
| Hunting misleading patterns across the codebase, not one diff | `code-gardener` |
| Scanners, secrets or dependency check before ship or after adding a dependency | `security-gate` (run both before merge) |
| Web app or API that must meet OWASP Top 10:2025 | `security-gate` (`references/owasp-top10.md` · per-stack checks in `references/owasp-stack-checks.md`) |

## Review Process

1. **Understand the intent** — read PR description and linked ticket
2. **Skim the diff** — get overall sense of changes
3. **Deep review** — go through each section of checklist below
   - **Verify before posting:** hand every `blocking:` finding to a fresh agent (or a second reader) with only the diff and the finding, and ask whether it is real. Drop it if they cannot reproduce or point to the line. For a contested diff use `adversarial-review-panel`.
   - **Do not flag** (adapted from the `code-review` command of claude-plugins-official · Apache-2.0 · opened 2026-11-10): a problem that existed before this PR · something the linter or compiler already catches · a nitpick a senior reviewer would skip · behaviour that looks wrong but is right (check the context first) · a rule the team silenced on purpose with a lint-ignore comment · a problem that only appears for an input that cannot occur here
4. **Run the code** if non-trivial — don't just read
5. **Leave actionable comments** — suggest fixes, not just point out problems

## Checklist

House checks first. Each skill holds the full rules, so link to it in the comment:

- [ ] Security: run [`security-gate`](../security-gate/SKILL.md) on the diff (input checked at the boundary, parameterized SQL, server-side permission check, no secrets in code or logs)
- [ ] Simple enough: [`lazy-coding`](../lazy-coding/SKILL.md) (no unused layers, standard library first, one concern per file)
- [ ] Readable: [`readable-code`](../readable-code/SKILL.md) (names, file and folder layout, config outside code)
- [ ] Tests sit next to the code and prove the change: [`testing-standards`](../testing-standards/SKILL.md)
- [ ] Shared code touched → [`blast-radius`](../blast-radius/SKILL.md) list is in the PR
- [ ] Commit message follows [`commit-message-format`](../commit-message-format/SKILL.md)

The generic list (correctness, design, performance, documentation, maintainability) is in [`references/full-checklist.md`](references/full-checklist.md).

## Comment Templates

### Suggestion (non-blocking)
```
nit: Consider X for readability
```

### Question
```
q: Why did you choose X over Y here?
```

### Blocking issue
```
blocking: This will cause Y in production because Z.
Suggest: <concrete fix>
```

### Praise
```
Nice approach with X — much cleaner than the previous version.
```

## Review Severity Levels

| Prefix | Meaning |
|--------|---------|
| `blocking:` | Must fix before merge |
| `important:` | Should fix, can be follow-up if urgent |
| `nit:` | Minor improvement, optional |
| `q:` | Question, not necessarily a change |
| `praise:` | Acknowledge good work |

These prefixes are for comments on a pull request. A review report uses the `reviewer` scale: `blocking:` = สูง · `important:` = กลาง · `nit:` = ต่ำ, verdict ผ่าน / ไม่ผ่าน

## Anti-patterns to Avoid

As a reviewer:
- Bikeshedding — don't fight over trivial style if there's no convention
- "Why didn't you do it MY way?" — there are often multiple valid approaches
- Only criticism — acknowledge good things too
- Vague comments like "this is wrong" — explain WHY and suggest fix
- Reviewing too much at once — request smaller PRs (under 400 lines)

## เรียกเป็นคำสั่ง

`/software-development:code-review-checklist <file path or PR description>`

> **ทางลัดเข้า SuperUser:** เปิด skill `superuser` ด้วย playbook `review` แล้วคัดลอกขั้นตอนของ playbook ลง todo ก่อน ส่วนขั้นตอนด้านล่างบอกรูปแบบงานและ output ของคำสั่งนี้ ให้ใช้คู่กับ playbook ไม่ได้ใช้แทน

Use a new `reviewer` agent (read-only) to perform a thorough code review of: **$ARGUMENTS** · high-stakes or contested change → `adversarial-review-panel`

The reviewer should:

1. Read the file(s) or diff to understand the change · for a branch or PR, pin the exact range first (`BASE=$(git merge-base main HEAD)` · `HEAD=$(git rev-parse HEAD)` · review `git diff $BASE..$HEAD`) and write both SHAs in the report so author and reviewer talk about the same code
2. Apply the `code-review-checklist` skill systematically
3. Rate each finding with the reviewer's own scale: **สูง** (must fix before merge) · **กลาง** (should fix) · **ต่ำ** (optional)
4. Give a concrete fix for each finding, not just criticism
5. Use the reviewer's output format: verdict **ผ่าน** / **ไม่ผ่าน** with counts per level. The `blocking:`/`nit:` prefixes in `code-review-checklist` are only for comments posted on a pull request

The author does not fix every finding on sight: a finding can be wrong (reviewer misread the code, or the "bug" is covered by a test). Push back with evidence (`file:line` · test name · command output), not opinion · fix what stands · list each rejected finding and its evidence in the report so the lead can judge · idea from superpowers requesting-code-review
