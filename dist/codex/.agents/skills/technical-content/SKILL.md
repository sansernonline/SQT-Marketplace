---
name: technical-content
description: Use when creating technical content for developers — blog posts, tutorials, videos, sample apps, conference talks. Patterns for technical content that resonates.
---

# Technical Content for Developers

## When to use this skill

- Writing developer blog post
- Producing tutorial / video
- Designing conference talk
- Building sample apps
- Creating learning paths

## Audience Mental Model

Developers read content with:
- Skeptical eye (filter marketing)
- Limited time (skim first)
- Pattern matching (familiar libraries, patterns)
- Code-first hunger (show me)
- Tradeoff appreciation (no silver bullets)

## Content Types

### Hook (1-3 min)
- Single insight
- Twitter thread
- LinkedIn post
- YouTube short
- Goal: curiosity → click

### Tutorial (10-30 min)
- Step-by-step build
- Working result
- Goal: learn by doing

### Deep dive (30-60 min)
- Why something works that way
- Architecture
- Tradeoffs
- Goal: understanding

### Reference (always-available)
- Searchable
- Specific
- Goal: lookup speed

## Tutorial Structure

```markdown
# Build X with Y in 15 minutes

## What you'll build
[Screenshot or live demo link]

## What you'll learn
- Concept A
- Concept B
- Concept C

## Prerequisites
- Node.js 18+
- Free account at example.com

## Step 1: Setup (2 min)
[Concrete commands]

## Step 2: First feature (5 min)
[Code + explanation]

## Step 3: Add complexity (5 min)
[More code]

## Step 4: Deploy (3 min)
[Production deploy]

## What's next?
- Try [adjacent tutorial]
- Read [deeper concept]
- Join [community]

## Get the code
github.com/example/tutorial-x
```

## Writing Tone

### For developers (technical content)
- Direct, not flowery
- Specific, not generic
- Concrete examples
- Acknowledge tradeoffs
- Cite sources
- First person OK ("I" or "we")
- Avoid marketing fluff

### Examples

❌ Marketing tone:
> Our revolutionary platform empowers developers to seamlessly build cutting-edge applications.

✅ Developer tone:
> This API lets you create users in 2-3 lines of code. Here's an example using TypeScript.

## Code in Content

### Sample code rules
- Runnable as-is
- Realistic data
- Imports shown
- Output shown
- Common errors handled

### Inline vs Block

```
Inline: variable names, function names
Block: examples, multi-line code

Brief: <1 line inline
Medium: 5-15 lines block
Long: link to repo or playground
```

### Annotations

```typescript
// ✅ Inline comments explain WHY
const cache = new LRU(1000);  // 1000 items based on memory budget

// ✅ Numbered for narrative
// 1. Authenticate
const token = await getToken();

// 2. Make request
const response = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Conference Talk Anatomy

```
0-1 min: Hook
   "What if I told you..."
   "We deleted 50% of our code by doing X"
   "I'll show you a bug that took 6 months to find"

1-5 min: Context + Problem
   What were we doing?
   What broke?
   Why does this matter?

5-15 min: Demo + Code
   Show working code
   Explain key parts
   Acknowledge what's hidden

15-25 min: How it works
   Architecture
   Tradeoffs
   Alternatives considered

25-28 min: Real-world considerations
   Edge cases
   Scaling
   Where it fails

28-30 min: Q&A
```

## Video Content (2026)

### YouTube short (60 sec)
- Single insight
- Visual demo
- Hook in first 2 seconds
- End: "follow for more"

### Tutorial video (5-15 min)
- Code-along format
- Show terminal + browser side-by-side
- Pause for "what if" questions
- Link timestamps in description

### Deep dive (30-60 min)
- Live coding
- Off-camera prep (Q&A list)
- Editing for jumps
- Chapters in description

## Sample App Standards

```
✅ README has:
- 1-paragraph "what this is"
- Live demo link
- "Why we built this" (motivation)
- Setup steps (copy-paste)
- Architecture overview
- "How to extend" examples

✅ Code has:
- Type safety where possible
- Production patterns (auth, errors)
- Tests for key functions
- Comments where non-obvious
- Modern best practices
```

## Distribution

### Owned channels
- Blog (own domain, owned audience)
- Newsletter (direct connection)
- Discord/Slack community
- YouTube (subscribers)

### Earned channels
- Twitter/X (algorithmic reach)
- LinkedIn (B2B reach)
- Hacker News (engineering audience)
- Reddit (subreddit-specific)
- Dev.to (cross-post)

### Co-promotion
- Guest posts on partner blogs
- Podcast appearances
- Conference talks
- Co-marketing with adjacent products

## SEO for Tech Content

```
Target keywords:
- Long-tail: "How to X with Y" (often >$10 ARPU intent)
- Problem-driven: "X error fix" (high intent)
- Tutorial: "Build X in N minutes"

Title format:
- "How to [verb] [noun] with [tech]"
- "Building [thing]: A [framework] tutorial"
- "[Number] [things] you didn't know about [topic]"

Structure:
- H1 has keyword
- TOC for long posts
- Code samples in <code> blocks (Google indexes)
- Internal links to related
```

## Metrics

### Vanity
- Views, likes, shares

### Better
- Time on page
- Scroll depth
- Comments / questions
- Link clicks to docs/signup

### Best
- Signups from content
- Active devs attributable
- Revenue influenced (Pipedrive)

## Things You Don't Do

- ❌ Buzzword soup ("AI-powered cloud-native")
- ❌ Vague claims without examples
- ❌ Code that needs imagination
- ❌ Long intro before content
- ❌ Hide tradeoffs (look only at upside)
- ❌ Outdated examples

## Reference

- [Writing for Engineers (Heinemeier Hansson)](https://world.hey.com/dhh)
- [Stripe Increment Magazine](https://increment.com/)
- [Julia Evans (zines + blog)](https://jvns.ca/)
- [Stack Overflow Blog](https://stackoverflow.blog/)
- [Hacker News Discussion](https://news.ycombinator.com/)
