---
name: pr-description-template
description: Use when writing a pull request description or preparing a PR for review.
---

# Pull Request Description Template

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง
> ข้อความภาษาไทย → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ ธุรกิจ

## When to use this skill

- Opening any pull request
- Updating a PR description after major changes
- Onboarding team to consistent PR practices

## When NOT to use

| Task | Use instead |
|---|---|
| Reviewing someone's PR or self-reviewing the code | `code-review-checklist` |
| Adversarial review of a risky or contested change | `adversarial-review-panel` |

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

> ส่วน Evidence และ Merge Danger — แนวคิดจาก mattpocock/skills pr (เครดิต HumanLayer) เขียนใหม่ด้วยคำเรา

## Size Guidelines

| Lines changed | Review difficulty | Recommendation |
|--------------|-------------------|----------------|
| < 100 | Easy | ✅ Ideal size |
| 100-400 | Moderate | ✅ Acceptable |
| > 400 | Hard | ❌ Split into stacked PRs |

If your PR is huge, split into:
1. Refactoring PR (no behavior change)
2. Feature PR (small, focused) — พร้อมเทสที่พิสูจน์ว่างานนั้นใช้ได้ใน PR เดียวกัน ไม่แยกเป็น PR เทสต่างหาก

> การ push branch หรือเปิด PR ทำเมื่อผู้ใช้สั่งเท่านั้น — เตรียมคำอธิบาย PR ไว้ให้ก่อนได้ แต่ไม่ push และไม่เปิดเอง

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

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.
