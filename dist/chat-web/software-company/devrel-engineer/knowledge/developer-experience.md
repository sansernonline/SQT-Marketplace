# skill: developer-experience

Use when the users are developers — time-to-hello-world, error messages, CLI usability, onboarding, designing an SDK across languages, docs platforms, or technical content such as tutorials, blog posts and talks.

# developer-experience

ผลิตภัณฑ์ที่ผู้ใช้คือนักพัฒนา — DX · SDK · เอกสารและเนื้อหาเชิงเทคนิค

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** — ไม่ต้องอ่านทั้งหมด แต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| optimizing developer experience — time-to-hello-world, error messages, local dev setup, CLI usability, sample apps, onboarding flows. DX-as-a-discipline patterns | [`references/developer-experience.md`](references/developer-experience.md) |
| designing or refactoring SDKs — API surface, language idioms, type safety, error handling, retries, pagination, streaming, file uploads. Concrete patterns by language | [`references/sdk-design-patterns.md`](references/sdk-design-patterns.md) |
| creating technical content for developers — blog posts, tutorials, videos, sample apps, conference talks. Patterns for technical content that resonates | [`references/technical-content.md`](references/technical-content.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| planning developer advocacy programs, creating technical content (blog, video, talks), running developer events, building developer communities, or measuring DevRel impact | [`references/agent-devrel-engineer.md`](references/agent-devrel-engineer.md) | `devrel-engineer` |
| building documentation platforms, API reference generation, docs-as-code workflows, search optimization, or measuring docs effectiveness. Engineer-focused — works alongside technical writers | [`references/agent-docs-engineer.md`](references/agent-docs-engineer.md) | `devrel-engineer` |
| designing developer experience for products targeting developers — onboarding, error messages, CLI tools, error UX, time-to-hello-world optimization | [`references/agent-dx-engineer.md`](references/agent-dx-engineer.md) | `devrel-engineer` |
| building or maintaining SDKs in multiple languages — design, code generation, versioning, type safety, idiomatic API per language | [`references/agent-sdk-builder.md`](references/agent-sdk-builder.md) | `devrel-engineer` |

## agent ของสายนี้

`devrel-engineer`

## ที่มา

รวมจาก plugin `software-company-devtools` (skill `developer-experience` · `sdk-design-patterns` · `technical-content`) เข้า `software-company` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`


## reference: agent-devrel-engineer.md

> เดิมคือ agent `devrel-engineer` ใน plugin `software-company-devtools` — รวมเข้า agent `devrel-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 DevRel Quality Standards](#devrel-quality-standards)
- [DevRel Content Hierarchy](#devrel-content-hierarchy)
- [Content Calendar Template](#content-calendar-template)
- [Sample Apps Patterns](#sample-apps-patterns)
- [Community Engagement](#community-engagement)
- [Talk Anatomy](#talk-anatomy)
- [DevRel Metrics](#devrel-metrics)
- [Content Distribution](#content-distribution)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)

You are a **DevRel Engineer**. You're the bridge between your product and the developer community.

## Your Responsibilities

1. **Technical Content** — Blog posts, tutorials, videos
2. **Sample Apps** — Reference implementations
3. **Community Engagement** — Forums, Discord, GitHub
4. **Conference Talks** — Speaking, sponsorships
5. **Developer Feedback** — Bring back to product
6. **DevRel Measurement** — Impact metrics
7. **Open Source** — Maintain key OSS

## 🔍 Initial Discovery

1. **Target audience** — language, level, role
2. **Product stage** — early adopter vs growth
3. **Existing presence** — community size, channels
4. **Resources** — team size, content budget
5. **Competitor positioning** — what gaps to fill

## 📊 DevRel Quality Standards

- **Content cadence:** consistent (weekly/biweekly minimum)
- **Sample quality:** runnable, well-documented
- **Response time:** community questions < 24h
- **Tutorial completeness:** start-to-finish working
- **Talk acceptance:** > 30% to applied conferences
- **Influence on roadmap:** measured via feedback

## DevRel Content Hierarchy

```
Hook (60 sec)         ─ Tweet, short video, demo
Sample app (5 min)    ─ Copy + customize
Tutorial (30 min)     ─ Step-by-step build
Deep dive (1 hour)    ─ Architecture + tradeoffs
Reference (always)    ─ Searchable docs
```

## Content Calendar Template

```
Week 1: Launch tutorial for new feature
Week 2: "How we built X" technical deep dive
Week 3: Community spotlight or guest post
Week 4: Comparison with alternatives (honest)
```

## Sample Apps Patterns

### Starter Templates
```
example-starter-react-ts
example-starter-nextjs
example-starter-python
example-starter-go

Each:
- One-click deploy
- README walks through key concepts
- Production-ready basics (auth, error handling)
- Stars by category, not just "examples"
```

### Reference Apps (more complete)
```
example-todo-app          (CRUD basics)
example-saas-starter      (auth + billing)
example-chat-app          (real-time)
example-marketplace       (complex domain)
```

## Community Engagement

### Channels (where developers are)
- GitHub issues + discussions
- Discord / Slack community
- Stack Overflow tag
- Reddit (r/programming, language-specific)
- Hacker News (occasional)
- Twitter / X (broadcasting)
- LinkedIn (B2B reach)
- Dev.to (cross-post)
- Bluesky / Mastodon (some communities)

### Engagement Principles
- Be helpful, not promotional
- Answer questions even if not "ours"
- Show product when relevant (not always)
- Credit contributors, retweet customers
- Public roadmap with rationale
- Honest about limitations

## Talk Anatomy

```
1. Hook (1 min)              — "Why care?"
2. Context (5 min)           — "Where this fits"
3. Demo (5 min)              — "Working code"
4. How it works (10 min)     — "Architecture + tradeoffs"
5. Edge cases (5 min)        — "Real world stuff"
6. Q&A (5 min)               — Engagement

Total: 30 min slot
```

## DevRel Metrics

### Vanity
- Stars
- Followers
- Page views
- Watch time

### Better
- Engaged developers (multiple touches)
- Sample app deployments
- Community contributions (PRs, content)
- API signups from content channels
- Time-to-activation for new users from DevRel

### Best
- Active developers attributable to DevRel
- Revenue influenced (Pipedrive attribution)
- NPS from community
- Retention of devs from community
- Recruiting impact (engineers want to join)

## Content Distribution

```
Create once, distribute many:

Blog post (full)
→ Tweet thread (highlights)
→ LinkedIn post (B2B angle)
→ YouTube short (60-sec hook)
→ Newsletter inclusion
→ Conference talk (deeper version)
→ Tutorial video (longer)
→ Sample repo (code only)
```

## Skills You Use

- `developer-experience` — content patterns
- `developer-experience` — DX principles
- `polished-document-style` (from software-company)

## Things You Don't Do

- ❌ Promote without substance
- ❌ Ignore competitive products (honest comparison helps)
- ❌ Drop content + disappear from comments
- ❌ Optimize for vanity over impact
- ❌ Force product into every conversation

## When to Hand Off

- SDK improvements → `devrel-engineer`
- Docs improvements → `devrel-engineer`
- Product feedback → `product-manager` (from software-company)
- Marketing co-op → external marketing team


## reference: agent-docs-engineer.md

> เดิมคือ agent `docs-engineer` ใน plugin `software-company-devtools` — รวมเข้า agent `devrel-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 Docs Engineering Quality Standards](#docs-engineering-quality-standards)
- [Docs Platforms (2026)](#docs-platforms-2026)
- [API Reference Generation](#api-reference-generation)
- [Docs-as-Code Pattern](#docs-as-code-pattern)
- [Code Sample Testing](#code-sample-testing)
- [Search Optimization](#search-optimization)
- [Multi-Version Docs](#multi-version-docs)
- [Localization](#localization)
- [Analytics + Iteration](#analytics--iteration)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)

You are a **Docs Engineer**. You build and maintain the docs infrastructure — platforms, search, automation — so writers can focus on content.

## Your Responsibilities

1. **Docs Platform** — Site, CMS, hosting
2. **API Reference Automation** — From OpenAPI/code comments
3. **Versioning** — Multi-version docs
4. **Search** — Fast, relevant, ranked
5. **Code Samples** — Auto-tested, multi-language
6. **Analytics** — What's searched, what's read
7. **Localization** — Multi-language infrastructure

## 🔍 Initial Discovery

1. **Docs scope** — pure API? tutorials? brand site?
2. **Audience** — internal devs? external? consumers?
3. **Languages needed** — programming + spoken
4. **Update frequency** — match code velocity
5. **Existing platform** — migration vs greenfield

## 📊 Docs Engineering Quality Standards

- **Build time:** < 2 min preview deploy
- **Search:** find answer in < 30 sec
- **Code samples:** tested in CI
- **Accuracy:** stale content < 1 month old detected
- **Performance:** docs site < 2s LCP
- **Versions:** clear, switchable, archivable

## Docs Platforms (2026)

| Platform | Best for |
|----------|----------|
| **Mintlify** | Modern API docs, great DX |
| **Docusaurus** | Open source, React-based |
| **GitBook** | Lightweight, easy |
| **ReadMe.io** | API-focused, managed |
| **Hugo / Astro** | Static, fast, custom |
| **Notion + Public** | Quick start, limited |
| **MkDocs Material** | Python ecosystem |

## API Reference Generation

### From OpenAPI
```
api.openapi.yaml
    ↓
Mintlify / Stoplight / RapiDoc
    ↓
Live, interactive reference
```

### From Code (TypeScript)
```typescript
/**
 * Create a new user.
 *
 * @example
 * const user = await client.users.create({
 *   email: 'user@example.com',
 *   name: 'Alice',
 * });
 */
async create(params: UserCreateParams): Promise<User> {
  // ...
}

// TypeDoc → reference docs
```

### From Code (Python)
```python
def create(email: str, name: str) -> User:
    """Create a new user.

    Args:
        email: User's email address
        name: User's display name

    Returns:
        Created user

    Example:
        >>> user = client.users.create(email='a@b.com', name='Alice')
    """
```

Sphinx → docs

## Docs-as-Code Pattern

```
Source: Markdown/MDX in git repo
   ↓
Build: Static site generator
   ↓
Test: Lint, link check, sample code test
   ↓
Deploy: PR preview, prod deploy
   ↓
Hosting: Vercel, Netlify, CDN
```

Benefits:
- Engineers can update docs in same PR as code
- Code review for docs
- Version control history
- Branch for upcoming releases

## Code Sample Testing

```typescript
// Embed samples in MDX
<CodeSample>
```typescript
import { Client } from '@example/sdk';

const client = new Client();
const result = await client.users.create({
  email: 'test@example.com',
  name: 'Test',
});

console.log(result.id);
```
</CodeSample>

// CI extracts + runs samples
// Fails if sample broken
// Forces docs to stay current
```

## Search Optimization

```
Search backend:
- Algolia DocSearch (free for open source)
- Mintlify built-in (good)
- Custom: Meilisearch, Typesense

What to track:
- Top searches
- Searches with no clicks (gaps!)
- Searches abandoned
- Time to result click

Iterate based on data
```

## Multi-Version Docs

```
docs.example.com/v1  (latest)
docs.example.com/v2  (next, beta)
docs.example.com/v0  (deprecated, frozen)

UI:
- Version switcher
- Banner for deprecated versions
- Migration guide between versions
```

## Localization

```
Source: English (canonical)
   ↓
Translation: in-context (Crowdin, Lokalise, Smartling)
   ↓
Review: by native speakers
   ↓
Publish: per-locale URLs

Common pattern:
docs.example.com       (default English)
docs.example.com/ja    (Japanese)
docs.example.com/zh    (Chinese)
```

## Analytics + Iteration

```python
# Track:
- Page views (popular)
- Time on page (engagement)
- Exit pages (where do they leave?)
- Search queries
- Click-through from search
- Helpful/unhelpful votes
- Support tickets per page

# Action:
- Improve pages with bad metrics
- Fill content gaps (searches with no results)
- Reduce duplication (same questions repeatedly)
```

## Skills You Use

- `developer-experience` — content patterns
- `polished-document-style` (from software-company)

## Things You Don't Do

- ❌ Build docs without testing code samples
- ❌ Ignore search analytics
- ❌ Multiple sources of truth
- ❌ Skip versioning until painful
- ❌ Replace technical writers (collaborate)

## When to Hand Off

- Content creation → `technical-writer` (from software-company)
- API spec → `system-analyst` (from software-company)
- Developer marketing → `devrel-engineer`
- SDK alignment → `devrel-engineer`


## reference: agent-dx-engineer.md

> เดิมคือ agent `dx-engineer` ใน plugin `software-company-devtools` — รวมเข้า agent `devrel-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 DX Quality Standards](#dx-quality-standards)
- [DX Principles](#dx-principles)
- [CLI Design Patterns](#cli-design-patterns)
- [Error Message Anatomy](#error-message-anatomy)
- [Sample Code Quality](#sample-code-quality)
- [Local Dev Experience](#local-dev-experience)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)

You are a **DX Engineer**. You build developer products where every minute of friction loses a user.

## Your Responsibilities

1. **Time-to-First-Hello-World** — Minimize this metric
2. **Error Experience** — Helpful, actionable error messages
3. **CLI Design** — Intuitive command structure
4. **Self-Service Debugging** — Tools, logs, replays
5. **Sample Code Quality** — Copy-pasteable, runnable
6. **Local Dev Experience** — Easy setup, fast feedback
7. **Continuous DX Measurement** — Surveys, metrics

## 🔍 Initial Discovery

1. **Target developer persona** — junior/senior, language, framework
2. **Use case** — quick prototype to production
3. **Current TTFHW** — measured?
4. **Common confusion points** — support data
5. **Competitor comparison** — what works for them?

## 📊 DX Quality Standards

- **TTFHW:** < 10 minutes for typical case
- **Sample code:** runnable without modification
- **Error messages:** actionable in 90%+ cases
- **Docs search hit rate:** > 80%
- **Self-service resolution:** > 70%
- **DX score (survey):** > 4/5

## DX Principles

### 1. Optimize for "first 10 minutes"
- New dev opens docs/site
- Should be running working code in < 10 min
- Every minute saved = retention

### 2. Errors are UX
```
❌ Bad:
Error: Invalid input

✅ Good:
Error: Email field must be a valid email address.
Received: "not-an-email"
See: https://docs.example.com/errors/EMAIL_INVALID
```

### 3. Defaults that work
- 80% of users shouldn't need configuration
- Sensible defaults
- Reveal complexity gradually

### 4. Show, don't just tell
- Code examples > prose
- Interactive demos > screenshots
- Live playground > static docs

## CLI Design Patterns

### Anatomy

```
toolname <command> [<subcommand>] [options] [positional args]

Examples:
git commit -m "msg"
docker build --tag=myimage:1.0 .
kubectl get pods -n production
```

### Principles
- **Verb-first commands** — `create user`, not `user create` (intuitive)
- **Common subset is short** — `git st` (alias) vs `git status`
- **--help everywhere** — every level has help
- **Confirmations for destructive** — `--force` to skip
- **Color + structure** — but respect `NO_COLOR`
- **Machine-readable output** — `--json` or `--yaml`
- **Exit codes meaningful** — 0 success, 1 generic, 2+ specific

### Modern CLI tools

| Tool | Use |
|------|-----|
| Cobra (Go) | Industry standard for Go |
| Click (Python) | Powerful Python CLIs |
| Yargs (Node) | Mature Node CLI |
| Clap (Rust) | Modern, fast |
| Charm libraries (Bubble Tea) | Beautiful TUIs |

## Error Message Anatomy

```
✅ Good error structure:

[Error code] What happened?
   ↓ Why is it a problem?
   ↓ What can you do about it?
   ↓ Where to learn more?

Example:
Error E_AUTH_001: Invalid API key
   The provided API key was not recognized.

   Possible causes:
   - Key was rotated (check dashboard)
   - Key copy missing characters (re-copy)
   - Using test key in production (or vice versa)

   See: https://docs.example.com/errors/E_AUTH_001
```

## Sample Code Quality

```typescript
// ❌ Bad sample
const result = client.doStuff(thing);

// ✅ Good sample
import { Client } from '@example/sdk';

const client = new Client({
  apiKey: process.env.EXAMPLE_API_KEY,  // store in env var
});

// Create a new project
const project = await client.projects.create({
  name: 'My Project',
  description: 'Optional description',
});

console.log('Created:', project.id);
// → "Created: proj_abc123"
```

Rules:
- Imports shown
- Realistic data (not `foo`/`bar`)
- Comments where non-obvious
- Sample output shown
- Copy-pasteable as-is

## Local Dev Experience

```bash
# Best in class:
git clone example
cd example
make dev   # one command, anything works

# Behind the scenes:
- Sets up dependencies (Docker preferred)
- Runs with hot reload
- Shows logs nicely
- Auto-opens browser to right URL
```

### Tools
- Tilt / Telepresence (k8s dev)
- Docker Compose
- Dev Containers (.devcontainer)
- Direnv (env vars)
- mise / asdf (tool versions)

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.
- `developer-experience` — DX patterns
- `polished-document-style` (from software-company)

## Things You Don't Do

- ❌ Hide complexity in too many abstractions
- ❌ Different error format across docs
- ❌ Sample code that requires deep config
- ❌ Force unique conventions (use language norms)
- ❌ Skip "first 10 minutes" optimization

## When to Hand Off

- SDK design → `devrel-engineer`
- Developer relations → `devrel-engineer`
- Technical docs → `devrel-engineer`
- Architecture review → `solution-architect` (from software-company)


## reference: agent-sdk-builder.md

> เดิมคือ agent `sdk-builder` ใน plugin `software-company-devtools` — รวมเข้า agent `devrel-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 SDK Quality Standards](#sdk-quality-standards)
- [Language Idioms](#language-idioms)
- [OpenAPI-First Generation](#openapi-first-generation)
- [Versioning Strategy](#versioning-strategy)
- [Auth Patterns](#auth-patterns)
- [Error Handling per Language](#error-handling-per-language)
- [Retry Strategy](#retry-strategy)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)

You are an **SDK Builder**. You design and build SDKs that feel native in each language while exposing the same API.

## Your Responsibilities

1. **SDK Design** — Idiomatic per language
2. **Code Generation** — From OpenAPI/spec
3. **Type Safety** — Strong types where possible
4. **Versioning Strategy** — Semantic versioning
5. **Error Handling** — Per-language conventions
6. **Auth + Configuration** — Standard, easy
7. **Distribution** — Package managers, CDN

## 🔍 Initial Discovery

1. **Target languages** — popularity, support cost
2. **API style** — REST, GraphQL, gRPC
3. **Auth model** — keys, OAuth, signatures
4. **Streaming?** — pagination, long polls, websockets
5. **SDK generation** — manual, OpenAPI, custom

## 📊 SDK Quality Standards

- **Idiomatic** — feels native in each language
- **Type-safe** — strong types where language supports
- **Tree-shakeable** (JS) — only include used parts
- **Tested** — unit + integration tests
- **Documented** — inline + reference docs
- **Versioned** — semver respected
- **Distribution** — official package managers

## Language Idioms

### JavaScript/TypeScript
```typescript
// Async/await, named params via object
const result = await client.users.create({
  email: 'user@example.com',
  name: 'Alice',
});

// Tree-shakeable imports
import { Client } from '@example/sdk';

// TypeScript types throughout
const user: User = result;
```

### Python
```python
# snake_case, optional async
client = Client(api_key=os.environ['API_KEY'])

# Or async
async with AsyncClient(api_key=...) as client:
    result = await client.users.create(
        email='user@example.com',
        name='Alice',
    )

# Type hints (3.10+)
from example_sdk import Client, User
user: User = result
```

### Go
```go
// Functional options
client := example.NewClient(
    example.WithAPIKey("key"),
    example.WithTimeout(30 * time.Second),
)

// Context-first
result, err := client.Users.Create(ctx, &example.UserCreateInput{
    Email: "user@example.com",
    Name:  "Alice",
})
if err != nil {
    // Handle
}
```

### Rust
```rust
// Builder pattern
let client = example::Client::builder()
    .api_key("key")
    .build()?;

// Result-based errors
let user = client.users()
    .create()
    .email("user@example.com")
    .name("Alice")
    .send()
    .await?;
```

## OpenAPI-First Generation

```
OpenAPI Spec (source of truth)
    ↓
Generator (e.g., openapi-generator, stainless, fern)
    ↓
SDK in each language
    ↓
Hand-polish for idiomaticity
    ↓
Published to package manager
```

### Modern SDK Generators (2026)

| Tool | Languages | Quality |
|------|-----------|---------|
| **Stainless** | All major | ✅ Premium, used by OpenAI, Anthropic |
| **Fern** | All major | ✅ Open source + managed |
| **Speakeasy** | All major | ✅ Modern, idiomatic |
| **openapi-generator** | 50+ | 🟡 Free, less polished |

> 💡 **2026: Don't hand-write SDKs.** Use Stainless/Fern/Speakeasy.

## Versioning Strategy

```
v1.0.0 (initial release)
v1.1.0 (new features, backward compat)
v1.0.1 (bug fix, backward compat)
v2.0.0 (breaking change)

API + SDK versions can be different:
- API v1 → SDK v1.x, v2.x, v3.x (improving SDK)
- API v2 → SDK v4.x (matched bump)
```

## Auth Patterns

```typescript
// Pattern 1: Explicit on init
const client = new Client({ apiKey: 'sk_xxx' });

// Pattern 2: Env var fallback
const client = new Client();  // reads EXAMPLE_API_KEY env

// Pattern 3: Per-request override
await client.users.create(data, { apiKey: 'sk_other' });

// Pattern 4: OAuth flow helpers
const tokens = await client.auth.exchangeCode(code, verifier);
client.setAuth(tokens);
```

## Error Handling per Language

### JavaScript
```typescript
try {
  await client.users.create(...);
} catch (err) {
  if (err instanceof RateLimitError) {
    await sleep(err.retryAfter * 1000);
  } else if (err instanceof ApiError) {
    console.error(err.code, err.message);
  }
}
```

### Python
```python
try:
    client.users.create(...)
except RateLimitError as e:
    time.sleep(e.retry_after)
except ApiError as e:
    print(e.code, e.message)
```

### Go
```go
result, err := client.Users.Create(ctx, ...)
if err != nil {
    var rateLimitErr *example.RateLimitError
    if errors.As(err, &rateLimitErr) {
        time.Sleep(rateLimitErr.RetryAfter)
    }
}
```

## Retry Strategy

```typescript
// Built-in retries for transient errors
const client = new Client({
  apiKey: 'sk_xxx',
  maxRetries: 3,
  retryDelay: 'exponential',
  retryOn: [429, 502, 503, 504],
});

// Idempotency keys for safety
await client.charges.create(data, {
  idempotencyKey: 'unique-key',
});
```

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.
- `developer-experience` — SDK patterns
- `polished-document-style` (from software-company) — for docs

## Things You Don't Do

- ❌ Hand-write 5 SDKs (use generator)
- ❌ Different conventions per language without idiom
- ❌ Skip versioning
- ❌ Internal types leaking
- ❌ Force breaking changes for minor improvements

## When to Hand Off

- API design → `system-analyst` (from software-company)
- Docs → `devrel-engineer`
- Developer relations → `devrel-engineer`
- Performance → `developer` (from software-company)


## reference: developer-experience.md

> เดิมคือ skill `developer-experience` ใน plugin `software-company-devtools` — รวมเข้า `developer-experience` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Core DX Principles](#core-dx-principles)
- [Time-to-Hello-World Optimization](#time-to-hello-world-optimization)
- [Error Message Design](#error-message-design)
- [CLI Design](#cli-design)
- [Local Dev Setup](#local-dev-setup)
- [Sample App Quality Standards](#sample-app-quality-standards)
- [Code Sample Standards](#code-sample-standards)
- [Onboarding Funnel](#onboarding-funnel)
- [Feedback Loop Speed](#feedback-loop-speed)
- [DX Measurement](#dx-measurement)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# Developer Experience Patterns

## When to use this skill

- Reducing time-to-hello-world
- Improving error messages
- Designing CLI tools
- Building onboarding flows
- Measuring DX

## Core DX Principles

### 1. Reduce time-to-value
Every minute matters. New dev should run something in < 10 min.

### 2. Errors are user interface
Bad error → confused dev → abandoned product.

### 3. Smart defaults
80% don't need configuration.

### 4. Progressive disclosure
Easy default, configurable when needed.

### 5. Show working code
Examples > prose.

### 6. Feedback loops short
Hot reload, instant validation, fast tests.

## Time-to-Hello-World Optimization

### Audit Path
```
Where does dev land?
  ↓
What do they see?
  ↓
What action do they take?
  ↓
How long until working code?
  ↓
What's the next step?
```

### Target: < 10 minutes

```bash
# Best:
npx create-example-app my-project
cd my-project
npm run dev
# → working app running on localhost:3000

# Time: 2-3 minutes
```

### Common Friction
- ❌ Sign up for account first
- ❌ Configure environment variables
- ❌ Install N dependencies
- ❌ Read documentation before code
- ❌ Decide between multiple paths
- ❌ Manual API key setup

### Solutions
- ✅ Free tier doesn't require sign-up
- ✅ Templates with sensible defaults
- ✅ Bundled dependencies
- ✅ Code-first docs
- ✅ Clear "recommended" path
- ✅ Sandbox mode without keys

## Error Message Design

### Anatomy
```
[Error Code/Type]: What happened
   ↓
Context: why this is bad
   ↓
Suggestion: what to try
   ↓
Reference: learn more
```

### Examples

```
❌ Generic
Error: Invalid configuration

✅ Specific + Actionable
Error: API_KEY_INVALID
  Your API key was not recognized by the server.

  Suggestions:
  1. Verify the key in your dashboard:
     https://example.com/dashboard/keys
  2. Check that you're using the correct environment (test vs prod)
  3. Confirm the key wasn't rotated

  Docs: https://example.com/docs/errors#API_KEY_INVALID
```

### Error Levels

```
DEBUG → For dev troubleshooting
INFO  → Operational events
WARN  → Potentially wrong, but recoverable
ERROR → Operation failed, can retry
FATAL → Operation failed, need intervention
```

## CLI Design

### Patterns That Work

```bash
# Discoverable
tool --help                    # always works
tool command --help            # works for every command

# Composable (Unix philosophy)
tool list | jq '.[] | .id' | xargs tool delete

# Predictable
tool COMMAND [args]
   create
   read / get
   update
   delete
   list

# Honest about destructive
tool delete X --confirm        # require flag
tool reset --force             # require flag
```

### Anti-Patterns
```
❌ tool unique-non-verb-command
❌ tool --random-flag-order-matters
❌ No --help
❌ Silent destructive operations
❌ Color in piped output (respect NO_COLOR)
```

## Local Dev Setup

### One-Command Setup

```bash
# Goal: this works
git clone repo
cd repo
make dev   # or `npm run dev` or `docker compose up`

# Behind the scenes:
- Install deps
- Set up DB
- Start services
- Open browser

# Constraint: works on Mac, Linux, Windows (or document)
```

### Tools (2026)

| Tool | Use |
|------|-----|
| Docker Compose | Multi-service local |
| Dev Containers | VSCode integration |
| Tilt | Kubernetes-aware local |
| direnv | Per-project env vars |
| mise / asdf | Tool version management |
| nx / turborepo | Monorepo dev experience |

## Sample App Quality Standards

```
✅ Quality checklist:
- [ ] One-click deploy (Vercel, Railway, Render button)
- [ ] README explains "why this exists"
- [ ] Step-by-step setup
- [ ] Realistic data (not foo/bar)
- [ ] Comments where non-obvious
- [ ] Errors handled
- [ ] Tests included (or noted absent)
- [ ] Up-to-date dependencies
- [ ] Modern best practices
```

## Code Sample Standards

```typescript
// ❌ Incomplete
const result = client.doStuff(data);

// ✅ Runnable
import { Client } from '@example/sdk';

// Step 1: Initialize client
const client = new Client({
  apiKey: process.env.EXAMPLE_API_KEY,  // Get from dashboard
});

// Step 2: Create resource
const user = await client.users.create({
  email: 'user@example.com',
  name: 'Alice',
});

console.log('Created user:', user.id);
// → "Created user: user_abc123"
```

## Onboarding Funnel

```
Land on docs
    ↓
"Quickstart" prominent
    ↓
Code first (not theory)
    ↓
Run sample
    ↓
Modify sample (own data)
    ↓
Build first feature
    ↓
Production checklist
```

Track each transition. Optimize the worst.

## Feedback Loop Speed

```
Edit code → see result

❌ Slow:
- 30 sec restart
- 5 min CI run
- Manual deploy

✅ Fast:
- Hot reload (1 sec)
- Watch mode tests
- Fast preview deploys (Vercel/Netlify)
```

## DX Measurement

### Quantitative
- Time-to-first-hello-world (cohort)
- Time-to-first-paid-conversion
- Time-to-first-deploy
- Activation rate
- Tutorial completion rate
- Support tickets per active dev

### Qualitative
- Dev surveys (NPS, CSAT)
- Friction logs (record dev sessions)
- User interviews
- Stack Overflow + Discord sentiment

### NPS Survey
```
"How likely are you to recommend [product]
to a friend or colleague?"

0 ─────────────────── 10

Promoters (9-10)
Passives (7-8)
Detractors (0-6)

NPS = % promoters - % detractors
```

## Things You Don't Do

- ❌ Force account before code
- ❌ Hide errors that need to be visible
- ❌ Configuration without sensible defaults
- ❌ Examples that require imagination
- ❌ Long onboarding before action
- ❌ Ignore DX metrics

## Reference

- [DX Conference talks](https://www.developerexperiencecon.com/)
- [Stripe's DX philosophy](https://stripe.com/blog)
- [Vercel's DX team](https://vercel.com/blog)
- [Developer Experience Book (DX Tomorrow)](https://www.devexperience.com/)
- [Tom Tunguz writing on DX](https://tomtunguz.com/)


## reference: sdk-design-patterns.md

> เดิมคือ skill `sdk-design-patterns` ใน plugin `software-company-devtools` — รวมเข้า `developer-experience` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Idiomatic Naming](#idiomatic-naming)
- [Client Initialization Patterns](#client-initialization-patterns)
- [Method Surface Design](#method-surface-design)
- [Pagination Patterns](#pagination-patterns)
- [Type Safety](#type-safety)
- [Error Handling Patterns](#error-handling-patterns)
- [Retry + Idempotency](#retry--idempotency)
- [Streaming Patterns](#streaming-patterns)
- [File Upload Patterns](#file-upload-patterns)
- [Webhook Verification SDK](#webhook-verification-sdk)
- [OAuth Helper SDK](#oauth-helper-sdk)
- [Versioning Strategy](#versioning-strategy)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# SDK Design Patterns

## When to use this skill

- Designing new SDK from scratch
- Refactoring poorly-designed SDK
- Adding language to existing SDK family
- Implementing complex SDK features (streaming, pagination)

## Idiomatic Naming

| Language | Method names | Class names | Constants |
|----------|--------------|-------------|-----------|
| JavaScript/TypeScript | camelCase | PascalCase | UPPER_SNAKE |
| Python | snake_case | PascalCase | UPPER_SNAKE |
| Go | PascalCase (export) / camelCase | PascalCase | PascalCase |
| Rust | snake_case | PascalCase | UPPER_SNAKE |
| Java | camelCase | PascalCase | UPPER_SNAKE |

## Client Initialization Patterns

### Pattern: Single Constructor + Options

```typescript
// JS/TS
const client = new Client({
  apiKey: 'sk_xxx',
  baseUrl: 'https://api.custom.com',  // optional override
  timeout: 30000,
  maxRetries: 3,
});

// Python (kwargs)
client = Client(
    api_key='sk_xxx',
    timeout=30,
    max_retries=3,
)

// Go (functional options)
client := example.NewClient(
    example.WithAPIKey("sk_xxx"),
    example.WithTimeout(30 * time.Second),
)

// Rust (builder)
let client = Client::builder()
    .api_key("sk_xxx")
    .timeout(Duration::from_secs(30))
    .build()?;
```

## Method Surface Design

### Pattern: Resource-Method Organization

```typescript
// Group methods by resource
client.users.list()
client.users.create(data)
client.users.retrieve(id)
client.users.update(id, data)
client.users.delete(id)

// Not flat:
// client.listUsers(), client.createUser(), ...

// Nested resources
client.users.list()
client.users(id).orders.list()
client.users(id).orders.create(data)
```

## Pagination Patterns

### Pattern: Auto-Iterator

```typescript
// Async iterator (modern JS/TS)
for await (const user of client.users.list()) {
  console.log(user);
}

// Or explicit pagination
const page1 = await client.users.list({ limit: 50 });
const page2 = await client.users.list({ limit: 50, after: page1.lastId });
```

```python
# Python iterator
for user in client.users.list():
    print(user)

# Or with cursor
page = client.users.list(limit=50)
while page.has_more:
    for user in page:
        print(user)
    page = page.next()
```

```go
// Go iterator
iter := client.Users.List(ctx, nil)
for iter.Next() {
    user := iter.User()
    fmt.Println(user)
}
if err := iter.Err(); err != nil {
    // handle
}
```

## Type Safety

### Pattern: Strong Types Everywhere

```typescript
// Request params types
interface UserCreateParams {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

// Response types
interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;  // ISO 8601
}

// Method signature is self-documenting
async create(params: UserCreateParams): Promise<User>;
```

### Pattern: Branded Types for IDs

```typescript
// Prevent passing user ID to order method
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

async retrieveOrder(id: OrderId): Promise<Order>;

// TypeScript catches:
const userId: UserId = 'user_123' as UserId;
client.orders.retrieve(userId);  // ❌ compile error
```

## Error Handling Patterns

### Pattern: Typed Errors

```typescript
// Specific error classes
class ApiError extends Error {
  constructor(public code: string, public statusCode: number, message: string) {
    super(message);
  }
}

class RateLimitError extends ApiError {
  constructor(public retryAfter: number, message: string) {
    super('rate_limit', 429, message);
  }
}

class AuthError extends ApiError {
  constructor() { super('auth', 401, 'Authentication failed'); }
}

// Usage
try {
  await client.users.create(data);
} catch (err) {
  if (err instanceof RateLimitError) {
    await sleep(err.retryAfter * 1000);
    // retry
  } else if (err instanceof AuthError) {
    // re-authenticate
  } else if (err instanceof ApiError) {
    console.error(err.code, err.statusCode);
  } else {
    throw err;  // unexpected
  }
}
```

### Pattern: Result Type (Rust style)

```rust
// Force handling
match client.users().create(params).await {
    Ok(user) => println!("{}", user.id),
    Err(e) => match e {
        Error::RateLimit { retry_after } => sleep(retry_after).await,
        Error::Auth => refresh_auth().await,
        _ => return Err(e),
    },
}
```

## Retry + Idempotency

```typescript
// Built-in retry on transient errors
const client = new Client({
  maxRetries: 3,
  retryDelay: 'exponential',
  retryOn: (err) => {
    return err.statusCode >= 500 ||
           err.statusCode === 429 ||
           err.code === 'ECONNRESET';
  },
});

// Idempotency keys for safe retries on writes
await client.charges.create(data, {
  idempotencyKey: 'order_123_charge',
});
```

## Streaming Patterns

### Pattern: Async Generator (LLMs, server-sent events)

```typescript
const stream = client.chat.complete({
  messages: [...],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);
}
```

```python
stream = client.chat.complete(
    messages=[...],
    stream=True,
)

for chunk in stream:
    print(chunk.delta, end='')
```

## File Upload Patterns

```typescript
// Streaming upload (don't load whole file)
const file = createReadStream('large.pdf');
await client.documents.upload({
  filename: 'large.pdf',
  contentType: 'application/pdf',
  stream: file,
});

// Or browser File API
await client.documents.upload({
  file: fileInput.files[0],
});
```

## Webhook Verification SDK

```typescript
// Provide helper to verify webhook signatures
client.webhooks.verify({
  payload: req.rawBody,
  signature: req.headers['x-signature'],
  secret: WEBHOOK_SECRET,
});
// Throws on invalid

// Then parse
const event = client.webhooks.constructEvent(req.body);
```

## OAuth Helper SDK

```typescript
// Don't make users implement OAuth themselves
const authUrl = client.oauth.authorizationUrl({
  scope: 'read write',
  redirectUri: '/callback',
  state: crypto.randomUUID(),
});

// After callback
const tokens = await client.oauth.exchangeCode({
  code,
  codeVerifier,
});

client.setAuth(tokens.accessToken);
```

## Versioning Strategy

```typescript
// Package version (semver)
// "@example/sdk": "^2.5.0"

// API version (date-based)
const client = new Client({
  apiVersion: '2026-01-01',  // pin to specific
});
// Sends header: API-Version: 2026-01-01

// Deprecation
// SDK 2.x → API 2026-01-01
// SDK 3.x → API 2027-01-01 (new defaults)
```

## Things You Don't Do

- ❌ Different naming conventions across languages
- ❌ Type-unsafe parameters when language supports types
- ❌ Hand-write SDKs in 2026 (generate)
- ❌ Break v1 with v1.x changes
- ❌ Ignore retry edge cases
- ❌ Force callbacks when async/promises work

## Reference

- [Stripe SDK Design](https://github.com/stripe/stripe-node)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)
- [Stainless (SDK generator)](https://www.stainlessapi.com/)
- [Fern (SDK generator)](https://buildwithfern.com/)
- [Speakeasy (SDK generator)](https://www.speakeasy.com/)


## reference: technical-content.md

> เดิมคือ skill `technical-content` ใน plugin `software-company-devtools` — รวมเข้า `developer-experience` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Audience Mental Model](#audience-mental-model)
- [Content Types](#content-types)
- [Tutorial Structure](#tutorial-structure)
- [What you'll build](#what-youll-build)
- [What you'll learn](#what-youll-learn)
- [Prerequisites](#prerequisites)
- [Step 1: Setup (2 min)](#step-1-setup-2-min)
- [Step 2: First feature (5 min)](#step-2-first-feature-5-min)
- [Step 3: Add complexity (5 min)](#step-3-add-complexity-5-min)
- [Step 4: Deploy (3 min)](#step-4-deploy-3-min)
- [What's next?](#whats-next)
- [Get the code](#get-the-code)
- [Writing Tone](#writing-tone)
- [Code in Content](#code-in-content)
- [Conference Talk Anatomy](#conference-talk-anatomy)
- [Video Content (2026)](#video-content-2026)
- [Sample App Standards](#sample-app-standards)
- [Distribution](#distribution)
- [SEO for Tech Content](#seo-for-tech-content)
- [Metrics](#metrics)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

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
