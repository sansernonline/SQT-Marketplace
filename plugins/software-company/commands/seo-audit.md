---
description: Run a comprehensive SEO audit using the seo-specialist agent + seo-audit-checklist skill. Covers technical, on-page, content, and off-page SEO.
argument-hint: <URL or page/site description>
---

Use the `seo-specialist` agent to perform an SEO audit on: **$ARGUMENTS**

The SEO specialist should:

1. **Gather context** by asking the user:
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

3. **For each area**, identify:
   - What's working ✅
   - Issues found with severity (🔴/🟠/🟡/🟢)
   - Page examples (not generic statements)
   - Specific recommendation
   - Estimated effort vs impact

4. **Produce the audit report** in the standard format with:
   - Executive summary
   - Health score per category
   - Prioritized findings
   - 3-month action plan (Month 1 quick wins → Month 3+ ongoing)
   - Estimated traffic/ranking impact

5. **Suggest next steps**:
   - Which findings should go to `developer` (code/markup changes)
   - Which to content writer / `ux-designer` (content/IA)
   - Which to `devops-engineer` (performance/infra)
   - Which need ongoing monitoring
