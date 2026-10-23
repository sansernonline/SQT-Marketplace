# Page SEO brief — keywords, titles, URLs, schema

Search engine optimization (SEO) brief for one page.

ใช้ตอนเขียน brief ของหน้าเดียว (ไม่ใช่ audit ทั้งเว็บ) · rich result ของ Google: ตั้งแต่ 8 ส.ค. 2023 FAQ แสดงเฉพาะเว็บรัฐและเว็บสุขภาพที่น่าเชื่อถือ · HowTo เลิกแสดงแล้ว — ที่มา [Google Search Central blog: Changes to HowTo and FAQ rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes) (ตรวจ 22 ต.ค. 2569)

**สารบัญ:**

- [Keyword Research Framework](#keyword-research-framework)
- [Title Tag Formula](#title-tag-formula)
- [Meta Description Formula](#meta-description-formula)
- [URL Structure](#url-structure)
- [Common Output: Page SEO Brief](#common-output-page-seo-brief)
- [Schema.org Common Types](#schemaorg-common-types)
- [Tools You Reference](#tools-you-reference)

## Keyword Research Framework

```markdown
## Keyword Analysis: <topic>

### Primary Keyword
- Keyword: ...
- Search volume: X/month
- Difficulty: X/100
- Intent: Informational | Commercial | Transactional | Navigational
- Current rank: ...

### Secondary Keywords (5-10)
| Keyword | Volume | Difficulty | Intent |
|---------|--------|------------|--------|

### Long-tail Variations
- ...

### Questions People Ask (from PAA, Quora, Reddit)
- ...

### Semantic / LSI Terms
- ...
```

## Title Tag Formula

`Primary Keyword | Secondary Keyword - Brand`

Examples:
- ✅ `Best Running Shoes for Flat Feet (2025 Guide) | RunBetter`
- ✅ `iPhone 16 Pro Review: Worth the Upgrade? - TechReview`
- ❌ `Home - Welcome to Our Site` (no keywords, vague)

## Meta Description Formula

`<Hook> + <Primary keyword> + <Value prop> + <CTA>` (call to action)

Example:
> Looking for the best running shoes for flat feet? Our podiatrist-reviewed
> guide tests 12 top models with arch support analysis. Find your perfect
> fit today.

## URL Structure

✅ Good:
- `/blog/running-shoes-flat-feet`
- `/products/nike-air-zoom-pegasus`
- `/category/men/shoes/running`

❌ Bad:
- `/p?id=12345`
- `/blog/2025/03/15/post-title-with-many-stop-words-and-stuff`
- `/รองเท้า/วิ่ง` (avoid non-ASCII unless localized)

## Common Output: Page SEO Brief

```markdown
# SEO Brief: <page title / URL>

## Target
- Primary keyword: ...
- Secondary keywords: ...
- Search intent: ...
- Target audience: ...

## Title Tag (50-60 chars)
<text>

## Meta Description (150-160 chars)
<text>

## H1
<text>

## Content Outline
- H2: ...
  - H3: ...
  - H3: ...
- H2: ...

## Internal Links to Add
- From <page A> → this page (anchor: "...")
- This page → <page B> (anchor: "...")

## Schema Markup
- Type: Article | Product | FAQPage (rich result only for government/health sites) | LocalBusiness
- Properties: ...

## Image Requirements
- Hero: <topic>, alt: "..."
- Inline: ...

## Word Count Target
~XXX words (based on top 10 ranking pages)

## Search Engine Results Page (SERP) Features to Target
- [ ] Featured snippet
- [ ] People Also Ask
- [ ] Image pack
- [ ] Video carousel
```

## Schema.org Common Types

| Page Type | Schema |
|-----------|--------|
| Blog post | `Article` or `BlogPosting` |
| Product page | `Product` + `Offer` + `AggregateRating` |
| FAQ section | `FAQPage` — Google shows the FAQ rich result only for well-known government and health sites |
| Local business | `LocalBusiness` |
| Recipe | `Recipe` |
| Event | `Event` |
| Person/Author | `Person` |
| Organization | `Organization` |
| Breadcrumbs | `BreadcrumbList` |

## Tools You Reference

When advising the user, mention these tools (don't claim to use them directly):
- **Free**: Google Search Console, Google Analytics, Google PageSpeed Insights, Lighthouse, Bing Webmaster Tools
- **Keyword research**: Google Keyword Planner, Ubersuggest, AnswerThePublic
- **Paid**: Ahrefs, SEMrush, Moz, Screaming Frog
- **Technical**: Schema.org Validator, Rich Results Test, GTmetrix
