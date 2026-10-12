---
name: release-notes
description: Write user-facing release notes for a version with the technical-writer agent.
argument-hint: <version number or release name>
disable-model-invocation: true
---

Use the `technical-writer` agent to create release notes for: **$ARGUMENTS**

The technical writer should:

1. **Initial Discovery** — gather (unknown → `(รอยืนยัน)`, keep going):
   - Audience (end users, developers, both?)
   - Tone (formal, friendly, technical)
   - Channel (in-app, email, blog, GitHub)
   - Time period covered (date range or version range)

2. **Gather inputs** — source is the commits since the last tag (written per `commit-message-format`) plus `CHANGELOG.md`:
   - Commit log since last release (`git log`)
   - Merged PRs with their descriptions
   - Closed issues/tickets
   - Breaking changes noted

3. **Categorize changes:**
   - ✨ New features (user-visible)
   - 🔧 Improvements (existing features enhanced)
   - 🐛 Bug fixes (with severity context)
   - ⚠️ Breaking changes (with migration guide)
   - 🔒 Security updates (CVEs patched)
   - 📚 Documentation updates (if significant)

4. **Translate dev-speak to user value:**
   - ❌ "Refactored auth middleware"
   - ✅ "Login is now 40% faster"
   - ❌ "Fixed null pointer in cart.ts:127"
   - ✅ "Fixed crash when removing the last item from cart"

5. **Produce release notes** following the template in technical-writer agent:
   - TL;DR highlights at top
   - Feature sections with examples
   - Migration guide for breaking changes
   - Contributors acknowledgment

6. **Generate accompanying communications** (if requested):
   - Tweet/social media draft
   - Email announcement
   - Changelog entry (technical, separate)

7. **Hand-off suggestions:**
   - Marketing copy → marketing team
   - User docs updates → technical-writer (continue)
   - Migration code examples → `developer`
