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
   - Breaking changes — every one carries 3 fields: **what changed** · **who is affected** (which users, integrations or versions) · **how to migrate** (steps or link); a field unknown → `(รอยืนยัน)`, never a one-line "X removed" (แนวคิดจาก keepachangelog / borghei release-notes · เขียนใหม่)
   - Security updates (Common Vulnerabilities and Exposures (CVE) entries patched)
   - Documentation updates (if significant)

4. **Translate dev-speak to user value:**
   - ผิด: "Refactored auth middleware"
   - ถูก: "Login is now 40% faster" — only with a measured number (before/after, how measured); no measurement → describe the change without a number
   - ผิด: "Fixed null pointer in cart.ts:127"
   - ถูก: "Fixed crash when removing the last item from cart"

   **ภาษาไทย** — ใช้ระดับ ข่าว (`human-writing` `references/thai-grammar.md` หัวข้อ 4): ไม่มีบุรุษที่ 1 · แต่ละบรรทัด ประธาน + กริยา + กรรม ("ส่งออกรายงานเป็น CSV ได้แล้ว") · ปิดท้ายด้วยเลขเวอร์ชันและวันที่
   - ผิด: "ได้มีการปรับปรุงประสิทธิภาพในส่วนของการส่งออก ซึ่งทำให้ผู้ใช้ได้รับประสบการณ์ที่ดีขึ้น"
   - ถูก: "ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จาก 12 วินาที"
   - ผิด: "เราได้แก้ไขข้อผิดพลาดที่เกิดขึ้นเมื่อผู้ใช้ทำการลบสินค้าชิ้นสุดท้าย"
   - ถูก: "ลบสินค้าชิ้นสุดท้ายในตะกร้าแล้วแอปไม่ปิดตัวเองอีก"

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
