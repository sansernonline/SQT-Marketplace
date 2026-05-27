---
name: seo-audit-checklist
description: Use when auditing a website's SEO health, reviewing a page for SEO issues, preparing an SEO improvement plan, or doing pre-launch SEO checks. Covers technical, on-page, content, and off-page SEO with prioritized findings.
---

# SEO Audit Checklist

## When to use this skill

- Auditing an existing website for SEO issues
- Reviewing a new page before launch
- Diagnosing traffic drops
- Quarterly SEO health checks

## Audit Process

1. **Define scope** — Full site? Single page? Specific section?
2. **Run automated checks** — Lighthouse, PageSpeed, Screaming Frog
3. **Manual review** using the checklist below
4. **Prioritize findings** by impact + effort
5. **Document with actionable recommendations**

## Findings Severity

| Level | Impact | Examples |
|-------|--------|----------|
| 🔴 **Critical** | Blocks indexing or major ranking loss | noindex on important pages, broken sitemap, mobile unfriendly |
| 🟠 **High** | Significant ranking impact | Missing titles, slow Core Web Vitals, duplicate content |
| 🟡 **Medium** | Moderate impact | Suboptimal meta descriptions, thin content, weak internal links |
| 🟢 **Low** | Minor improvements | Image alt text gaps, schema enhancements |

---

## ✅ Technical SEO Checklist

### Crawling & Indexing
- [ ] robots.txt is present and not blocking important pages
- [ ] XML sitemap exists, submitted to Google Search Console
- [ ] No accidental `noindex` on important pages
- [ ] No `nofollow` on internal links by default
- [ ] Pagination uses correct canonical or `rel="prev/next"`
- [ ] No orphan pages (every page reachable via internal links)
- [ ] Crawl depth ≤ 3 clicks from homepage for important pages

### Site Speed (Core Web Vitals)
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] INP (Interaction to Next Paint) < 200ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Images compressed and properly sized
- [ ] Lazy loading for below-fold images
- [ ] Critical CSS inlined
- [ ] JavaScript deferred / async
- [ ] Browser caching configured
- [ ] CDN used for static assets
- [ ] Server response time < 200ms

### Mobile
- [ ] Mobile-friendly (passes Mobile-Friendly Test)
- [ ] Responsive design (no horizontal scroll)
- [ ] Tap targets ≥ 48px and adequately spaced
- [ ] Font size readable (≥ 16px body)
- [ ] No intrusive interstitials/popups

### Security & Trust
- [ ] HTTPS enforced site-wide
- [ ] No mixed content warnings
- [ ] Valid SSL certificate (not expiring soon)
- [ ] HSTS header set
- [ ] No malware / phishing warnings

### Site Architecture
- [ ] Clear, logical URL structure
- [ ] Breadcrumbs implemented and marked up
- [ ] Hreflang correctly set for international sites
- [ ] Canonical tags on every page
- [ ] No infinite scroll without paginated alternative

### Structured Data
- [ ] Relevant Schema.org markup present
- [ ] Validated with Rich Results Test
- [ ] No errors in Search Console structured data report
- [ ] Common types: Organization, BreadcrumbList, Article, Product, FAQ

---

## ✅ On-Page SEO Checklist

### Title Tags
- [ ] Every page has a unique title
- [ ] Title length 50-60 characters
- [ ] Primary keyword near the start
- [ ] Brand name included (usually at end)
- [ ] Compelling for click-through (not just keyword-stuffed)

### Meta Descriptions
- [ ] Every page has unique meta description
- [ ] Length 150-160 characters
- [ ] Includes primary keyword naturally
- [ ] Has clear CTA
- [ ] Accurately describes page content

### Headings
- [ ] Exactly one H1 per page
- [ ] H1 contains primary keyword
- [ ] Heading hierarchy logical (no skipping levels)
- [ ] H2/H3s use secondary/related keywords
- [ ] Headings descriptive, not vague ("Section 1", "Info")

### URLs
- [ ] Short and descriptive
- [ ] Lowercase
- [ ] Hyphens (not underscores or spaces)
- [ ] No unnecessary parameters
- [ ] Primary keyword included
- [ ] Trailing slash consistent across site

### Content
- [ ] Matches search intent
- [ ] Comprehensive (covers topic vs competitors)
- [ ] Unique (not duplicated from other pages)
- [ ] Above-fold content engaging
- [ ] Readable (Flesch score appropriate for audience)
- [ ] Updated recently (where relevance matters)
- [ ] Includes related semantic terms (LSI)
- [ ] No keyword stuffing

### Images
- [ ] Descriptive file names (`running-shoes-nike.jpg` not `IMG_1234.jpg`)
- [ ] Alt text on all meaningful images
- [ ] Decorative images have empty alt=""
- [ ] Properly sized (no 4MB hero images)
- [ ] Modern format (WebP/AVIF with fallback)
- [ ] Lazy loading where appropriate

### Internal Linking
- [ ] At least 2-3 internal links per page
- [ ] Anchor text descriptive (not "click here")
- [ ] Important pages have many internal links pointing to them
- [ ] No broken internal links
- [ ] No links to noindex/nofollow pages from important content

### External Linking
- [ ] Links to authoritative sources where appropriate
- [ ] No broken external links
- [ ] `rel="nofollow"` for sponsored/paid links
- [ ] `rel="ugc"` for user-generated content

---

## ✅ Content SEO Checklist

- [ ] Search intent matched (informational/commercial/transactional)
- [ ] Topic clusters with pillar pages
- [ ] Content gaps from competitor analysis filled
- [ ] FAQ sections for question-based queries
- [ ] Author bylines with credentials (E-E-A-T)
- [ ] Publication and update dates visible
- [ ] Engaging multimedia (images, videos, charts)
- [ ] Table of contents on long pages
- [ ] Featured snippet optimization (definitions, lists, tables)

---

## ✅ Off-Page SEO Checklist

- [ ] Backlink profile reviewed (Ahrefs / SEMrush)
- [ ] No toxic backlinks (disavow if needed)
- [ ] Brand mentions monitored
- [ ] Google Business Profile claimed (for local)
- [ ] Consistent NAP (Name, Address, Phone) across web
- [ ] Citations in relevant directories
- [ ] Social media profiles linked to site
- [ ] Reviews on key platforms (Google, Trustpilot, industry-specific)

---

## ✅ Analytics & Monitoring

- [ ] Google Search Console verified
- [ ] Google Analytics 4 installed
- [ ] Goals/conversions tracked
- [ ] Rank tracking for target keywords
- [ ] Core Web Vitals monitored
- [ ] Crawl errors reviewed weekly
- [ ] Manual actions checked (Search Console)
- [ ] Security issues monitored

---

## Audit Output Template

```markdown
# SEO Audit Report: <site or page>

**Date:** YYYY-MM-DD
**Scope:** ...
**Auditor:** ...

## Executive Summary
<3-5 sentence overview: overall health + top findings>

## Health Score
- Technical SEO: X/10
- On-Page SEO: X/10
- Content: X/10
- Off-Page SEO: X/10
- **Overall: X/10**

## Critical Issues (🔴 Fix Immediately)
| # | Issue | Pages Affected | Impact | Effort |
|---|-------|----------------|--------|--------|
| 1 | ...   | ...            | ...    | ...    |

## High Priority (🟠)
...

## Medium Priority (🟡)
...

## Low Priority / Nice-to-Have (🟢)
...

## Action Plan
### Month 1 (Quick Wins)
- ...

### Month 2 (Larger Fixes)
- ...

### Month 3+ (Ongoing)
- ...

## Estimated Impact
- Traffic uplift potential: +X% (based on...)
- Ranking improvement: ...
- Conversion impact: ...

## Tools Used
- ...
```

## Quality Checklist for the Audit Itself

- [ ] Every finding has page examples (not vague "some pages have...")
- [ ] Severity assigned to each finding
- [ ] Recommendations are specific and actionable
- [ ] Impact estimated where possible
- [ ] Quick wins identified separately
- [ ] Tied to business goals, not just SEO metrics

## Anti-patterns

- ❌ Audit without business context (ranking for irrelevant terms)
- ❌ All findings as "critical" — be honest about priorities
- ❌ Recommendations without "how" (just "improve content")
- ❌ Ignoring user experience for SEO gains
- ❌ Audit that's a list of tool screenshots, not insights
- ❌ Recommendations that contradict accessibility/UX best practices
