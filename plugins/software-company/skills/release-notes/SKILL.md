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
   - Merged pull requests (PRs) with their descriptions
   - Closed issues/tickets
   - Breaking changes noted

3. **Categorize changes:**
   - New features (user-visible)
   - Improvements (existing features enhanced)
   - Bug fixes (with severity context)
   - Breaking changes (with migration guide)
   - Security updates (Common Vulnerabilities and Exposures (CVE) entries patched)
   - Documentation updates (if significant)

4. **Translate dev-speak to user value:**
   - ❌ "Refactored auth middleware"
   - ✅ "Login is now 40% faster" — only with a measured number (before/after, how measured); no measurement → describe the change without a number
   - ❌ "Fixed null pointer in cart.ts:127"
   - ✅ "Fixed crash when removing the last item from cart"

5. **Produce release notes** following the release-notes template in `project-doc-set/references/writer-templates.md`:
   - Too long; didn't read (TL;DR) highlights at top
   - Feature sections with examples
   - Migration guide for breaking changes
   - Contributors acknowledgment

6. **Generate accompanying communications** (if requested):
   - X / social post draft
   - Email announcement
   - Changelog entry (technical, separate)

7. **Hand-off suggestions:**
   - Marketing copy → `growth-specialist`
   - User docs updates → technical-writer (continue)
   - Migration code examples → `developer`
