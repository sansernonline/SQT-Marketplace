---
name: seo-audit
description: Run a search engine optimization (SEO) audit with the seo-specialist agent — technical, on-page, content, off-page.
argument-hint: <URL or page/site description>
disable-model-invocation: true
---

Use the `seo-specialist` agent to perform a search engine optimization (SEO) audit on: **$ARGUMENTS**

The SEO specialist should:

1. **Gather context** by asking the user once, all at the start (unknown → `(รอยืนยัน)`, keep going):
   - What's the primary business goal? (lead gen, e-commerce, content, brand)
   - Target market / language / region?
   - Main competitors?
   - Current SEO performance (if known)
   - Specific concerns (traffic drop, low rankings, etc.)?

2. **Apply the `seo-audit-checklist` skill** systematically:
   - Technical SEO
   - On-Page SEO
   - Content
   - Off-Page SEO
   - Analytics setup

3. **Write findings and the report** with the checklist's per-finding fields and report template (`seo-audit-checklist` → `references/report-template.md`).

4. **Suggest next steps**:
   - Which findings should go to `developer` (code/markup changes)
   - Which to `technical-writer` / `ux-designer` (content / information architecture (IA))
   - Which to `devops-engineer` (performance/infra)
   - Which need ongoing monitoring
