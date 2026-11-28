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
| Adversarial review of a risky or contested change | `handoff/adversarial-review-panel` |

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
