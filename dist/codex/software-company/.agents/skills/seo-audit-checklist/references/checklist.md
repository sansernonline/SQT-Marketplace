# SEO audit checklist

Search engine optimization (SEO) checks. Facts on Google behaviour checked 22 ต.ค. 2569 (sources inline).

Used by `seo-audit-checklist` step 3 (manual review). Numbers here are the single source; agents link here.

## Contents

- [Technical SEO Checklist](#technical-seo-checklist)
- [On-Page SEO Checklist](#on-page-seo-checklist)
- [Content SEO Checklist](#content-seo-checklist)
- [Off-Page SEO Checklist](#off-page-seo-checklist)
- [Analytics & Monitoring](#analytics--monitoring)

## Technical SEO Checklist

### Crawling & Indexing
- [ ] robots.txt is present and not blocking important pages
- [ ] Extensible Markup Language (XML) sitemap exists, submitted to Google Search Console
- [ ] No accidental `noindex` on important pages
- [ ] No `nofollow` on internal links by default
- [ ] Paginated pages each have a self-referencing canonical (not all pointing to page 1) and plain crawlable `<a href>` links between pages — Google stopped using `rel="prev/next"` for indexing (announced Mar 2019, [Google Search Central: pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading))
- [ ] No orphan pages (every page reachable via internal links)
- [ ] Crawl depth ≤ 3 clicks from homepage for important pages

### Site Speed (Core Web Vitals)
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] INP (Interaction to Next Paint) < 200ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Images compressed and properly sized
- [ ] Lazy loading for below-fold images
- [ ] Critical Cascading Style Sheets (CSS) inlined
- [ ] JavaScript deferred / async
- [ ] Browser caching configured
- [ ] Content delivery network (CDN) used for static assets
- [ ] Time to First Byte (TTFB) ≤ 0.8 s — "most sites should strive to have a TTFB of 0.8 seconds or less" ([web.dev: TTFB](https://web.dev/articles/ttfb)); not a Core Web Vital, a guide

### Mobile
- [ ] Mobile-friendly — check with Lighthouse (mobile) and Search Console URL Inspection (the Mobile-Friendly Test tool and report were retired on 1 Dec 2023)
- [ ] Responsive design (no horizontal scroll)
- [ ] Tap targets ≥ 48px and adequately spaced
- [ ] Font size readable (≥ 16px body)
- [ ] No intrusive interstitials/popups

### Security & Trust
- [ ] Hypertext Transfer Protocol Secure (HTTPS) enforced site-wide
- [ ] No mixed content warnings
- [ ] Valid TLS (Transport Layer Security, often called SSL) certificate (not expiring soon)
- [ ] HTTP Strict Transport Security (HSTS) header set
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
- [ ] Common types: Organization, BreadcrumbList, Article, Product (FAQ rich results show only for well-known government and health sites; HowTo rich results are no longer shown — [Google, 8 Aug 2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes))

---

## On-Page SEO Checklist

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
- [ ] Has a clear call to action (CTA)
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
- [ ] Covers the topic at least as fully as competitors
- [ ] Unique (not duplicated from other pages)
- [ ] Content above the fold (visible without scrolling) is engaging
- [ ] Readable (Flesch score appropriate for audience)
- [ ] Updated recently (where relevance matters)
- [ ] Covers the related subtopics and terms a reader expects (Google says it does not use "LSI keywords" — don't optimise for them)
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

## Content SEO Checklist

- [ ] Search intent matched (informational/commercial/transactional)
- [ ] Topic clusters with pillar pages
- [ ] Topics competitors cover but you don't are filled in
- [ ] FAQ sections for question-based queries
- [ ] Author bylines with credentials (Experience, Expertise, Authoritativeness, Trustworthiness — E-E-A-T)
- [ ] Publication and update dates visible
- [ ] Engaging multimedia (images, videos, charts)
- [ ] Table of contents on long pages
- [ ] Featured snippet optimization (definitions, lists, tables)

---

## Off-Page SEO Checklist

- [ ] Backlink profile reviewed (Ahrefs / SEMrush)
- [ ] No toxic backlinks (disavow if needed)
- [ ] Brand mentions monitored
- [ ] Google Business Profile claimed (for local)
- [ ] Consistent NAP (Name, Address, Phone) across web
- [ ] Citations in relevant directories
- [ ] Social media profiles linked to site
- [ ] Reviews on key platforms (Google, Trustpilot, industry-specific)

---

## Analytics & Monitoring

- [ ] Google Search Console verified
- [ ] Google Analytics 4 (GA4) installed
- [ ] Goals/conversions tracked
- [ ] Rank tracking for target keywords
- [ ] Core Web Vitals monitored
- [ ] Crawl errors reviewed weekly
- [ ] Manual actions checked (Search Console)
- [ ] Security issues monitored
