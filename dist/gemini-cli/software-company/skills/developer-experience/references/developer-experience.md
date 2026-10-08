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
- Measuring developer experience (DX)

## Core DX Principles

### 1. Reduce time-to-value
Every minute matters. A new developer should run something in < 10 min.

### 2. Errors are user interface
A bad error confuses the developer, and confused developers abandon the product.

### 3. Smart defaults
80% of users need no configuration.

### 4. Progressive disclosure
Start with an easy default. Let users configure more when they need it.

### 5. Show working code
Examples > prose.

### 6. Feedback loops short
Use hot reload, instant validation and fast tests.

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
- ✅ Free tier with no sign-up
- ✅ Templates with sensible defaults
- ✅ Dependencies bundled in
- ✅ Docs that start with code
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

Track how many developers pass each step. Fix the step that loses the most.

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
- Time-to-first-hello-world (per signup cohort)
- Time-to-first-paid-conversion
- Time-to-first-deploy
- Activation rate (share of signups who reach first real use)
- Tutorial completion rate
- Support tickets per active developer

### Qualitative
- Developer surveys (Net Promoter Score (NPS), Customer Satisfaction (CSAT))
- Friction logs (record developer sessions)
- User interviews
- Sentiment on Stack Overflow and Discord

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

- ❌ Force sign-up before the first code runs
- ❌ Hide errors that need to be visible
- ❌ Require configuration with no sensible defaults
- ❌ Give examples that leave parts for the reader to guess
- ❌ Make onboarding long before the developer does anything
- ❌ Ignore DX metrics

## Reference

- [DX Conference talks](https://www.developerexperiencecon.com/)
- [Stripe's DX philosophy](https://stripe.com/blog)
- [Vercel's DX team](https://vercel.com/blog)
- [Developer Experience Book (DX Tomorrow)](https://www.devexperience.com/)
- [Tom Tunguz writing on DX](https://tomtunguz.com/)
