---
name: pr-description-template
description: Use when writing a pull request description, preparing a PR for review, or documenting changes for merge. Provides reviewers with context, testing details, and screenshots needed to review effectively.
---

# Pull Request Description Template

## When to use this skill

- Opening any pull request
- Updating a PR description after major changes
- Onboarding team to consistent PR practices

## Output Template

```markdown
## Summary
<2-4 sentence explanation of what this PR does and why>

## Linked Issues
- Closes #XXX
- Refs #YYY

## Changes
- ✨ Added: ...
- 🔧 Changed: ...
- 🐛 Fixed: ...
- 🗑️ Removed: ...

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change)
- [ ] ✨ New feature (non-breaking change)
- [ ] 💥 Breaking change (fix or feature that breaks existing behavior)
- [ ] 📚 Documentation update
- [ ] 🔧 Refactor (no functional change)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test additions/updates
- [ ] 🏗️ Build/CI changes

## How to Test
1. Pull this branch
2. Run `<command>`
3. Verify ...
4. Try edge case: ...

## Screenshots / Demos
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
<env var changes, migrations, feature flags needed, OR "Standard deployment">

## Notes for Reviewer
<anything reviewer should pay attention to, gotchas, alternative approaches considered>
```

## Size Guidelines

| Lines changed | Review difficulty | Recommendation |
|--------------|-------------------|----------------|
| < 100 | Easy | ✅ Ideal size |
| 100-400 | Moderate | ✅ Acceptable |
| 400-800 | Hard | ⚠️ Consider splitting |
| > 800 | Very hard | ❌ Should be split |

If your PR is huge, split into:
1. Refactoring PR (no behavior change)
2. Feature PR (small, focused)
3. Test PR (adding coverage)

## Summary Writing

❌ Bad summaries:
- "Fixes bug"
- "Updates code"
- "See ticket"

✅ Good summaries:
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

## Anti-patterns

- ❌ Empty description: "see code"
- ❌ Linking ticket without explanation in PR
- ❌ Massive PR with 1000+ lines mixed concerns
- ❌ No screenshots for UI changes
- ❌ "Testing: tested locally" with no detail
- ❌ Pushing right before merge deadline with no time to review
