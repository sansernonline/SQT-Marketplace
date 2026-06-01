---
name: simplicity-first
description: Use ALWAYS when producing code, designs, architectures, documents, or plans. Defaults to the simplest solution that works. Applies the "could a tired junior teammate understand this in 6 months?" test before submitting any output. Rejects premature abstraction, over-engineering, buzzword complexity, and unnecessary layers. Universal — applies to every agent's output.
---

# Simplicity First

> **The best code is no code. The best architecture is the one with fewest moving parts. The best plan is the one a 5-year-old could follow.**

## When to use this skill

**Always.** Every output (code, design, document, plan) should pass the simplicity test before delivery.

## The One Test

Before submitting, ask:

> 💡 **Could a tired junior teammate understand this in 6 months,
> with no prior context, at 3 AM during an incident?**

If "no" or "I'm not sure" → simplify.

---

## 5 Universal Principles

### 1. Start with the simplest thing that works

```
Need: store user preferences
─────────────────────────────
✅ Default:   Single DB table with JSON column
🟡 Maybe:     Add caching when measured slow
❌ Avoid:     Event-sourced CQRS preference service
```

### 2. Reduce moving parts

Each component adds: failure modes, deployment complexity, ops burden, docs.

**Default: one thing.** Glue more things only when one isn't enough.

### 3. Use familiar patterns

Team knows REST + Postgres? Don't introduce GraphQL + Cassandra unless there's a measurable, present need.

**Boring tech for critical paths. Novel tech for non-critical experiments.**

### 4. Optimize for reading, not writing

Code is written once, read 100x.

```
❌ Clever 1-liner
✅ Boring 5-liner that's obvious
```

### 5. Delete > Add

Best PR deletes code. Second best doesn't add new abstractions. Worst adds layers for imagined future needs.

---

## By Output Type

### 💻 Code

✅ **Do**
- Direct, obvious logic
- Named functions over clever one-liners
- Plain data structures (objects, arrays, maps)
- Explicit > implicit
- Early returns, guard clauses
- Short functions (5-20 lines)
- Type the inputs + outputs, skip middle types unless needed

❌ **Avoid**
- Generic abstractions for one use case
- Magic (auto-discovery, reflection, metaprogramming)
- Deep inheritance hierarchies
- Premature DRY (sharing because *looks* similar)
- Layers that just pass through
- Frameworks within frameworks
- Defensive checks on values that can't be null/undefined

### 📄 Documents (BRD, FSD, ADR, etc.)

✅ **Do**
- Short sentences (≤ 20 words)
- Plain English (no buzzwords)
- One idea per paragraph
- Examples for every abstract concept
- Tables/bullets for structured data

❌ **Avoid**
- Marketing-speak ("revolutionary", "best-in-class", "synergy")
- Jargon without definition
- Walls of text
- Hedging ("might possibly potentially")
- Acronym soup

### 🏗️ Architecture

✅ **Do**
- Monolith first (split only when bottleneck proven)
- Familiar stack
- Standard patterns (REST, queues, caches)
- Single source of truth per data type
- Boring tech for production-critical paths

❌ **Avoid**
- Microservices for small teams
- Distributed everything
- Multi-master databases (use leader-replica until you must)
- New tech for non-novel problems
- Event-driven by default (sync is simpler)

### 📋 Plans

✅ **Do**
- 3-5 priorities (not 20)
- Concrete owner per item
- Measurable success criteria
- Reasonable timelines + buffer
- Cut scope to fit time

❌ **Avoid**
- Vague goals ("improve quality")
- 50-item lists (= no priority)
- Aspirational dates without buffer
- Cross-cutting work across 5 teams
- Plans without success metrics

### 🎨 Designs (UX, API)

✅ **Do**
- Fewest steps to user goal
- Reuse existing patterns
- Consistent across screens
- Defaults that work for 80%
- Progressive disclosure

❌ **Avoid**
- Novel interactions where standard works
- 10-step flows when 3 work
- Required fields with no smart defaults
- Hidden features needing tutorials
- Customization at every level

---

## The 3-Question Filter

Before adding ANY new:
- Abstraction (interface, class, generic function)
- Component (service, library, file)
- Configuration option
- Pattern (event sourcing, queue, cache layer)

Ask:

```
1. Is there REAL evidence we need this NOW?
   (Not "might need", but "DO need")

2. Is there a simpler way?
   (Sleep on it. Often yes.)

3. What's the cost of NOT adding this?
   (Often: nothing. Or small refactor later.)
```

If 2+ answers say "simpler is fine" → **don't add**.

---

## Common Anti-Patterns

### ❌ "Future-Proofing"

```
"We might need to support 10 databases someday"
→ Build database abstraction layer
→ 6 months later: still using one database
→ Stuck maintaining the abstraction

Better: Use one database directly. Refactor IF the day comes.
```

### ❌ "It Might Scale"

```
"What if we have 1M users?"
→ Microservices, Kafka, Cassandra
→ Have 1k users
→ Spend 80% of time on infrastructure

Better: Monolith + Postgres. Scale when you have the problem.
```

### ❌ "Clean Architecture Layer Cake"

```
Controller → Service → UseCase → Repository → Entity → DB
6 layers, 90% pass-through, hard to follow

Better: Controller → Repository → DB. Add layers when justified by complexity.
```

### ❌ "Resume-Driven Design"

```
"We use AI/ML/blockchain/web3 for X"
→ X doesn't need any of these
→ Just adding for resume/marketing/pitch deck

Better: Use boring tech that fits the actual problem.
```

### ❌ "Engineering Excellence"

```
- Tests for every getter/setter
- Logging at every line
- Error wrapping at every call

Better: Test behavior. Log at boundaries. Fail clearly.
```

### ❌ "Premature DRY"

```
Two functions look similar → extract shared helper
6 months later: helper has 8 boolean flags to handle divergence

Better: Duplicate until the abstraction is OBVIOUS.
Rule of three: third occurrence → consider extraction.
```

---

## Examples

### Code: Validate email

❌ **Over-engineered** (100 lines, 5 classes):
```typescript
interface IValidator<T> { validate(value: T): ValidationResult }
abstract class BaseValidator<T> implements IValidator<T> { ... }
class EmailValidator extends BaseValidator<string> { ... }
class ValidationOrchestrator { ... }
const orch = new ValidationOrchestrator()
orch.register(new EmailValidator())
orch.validate(input)
```

✅ **Simple** (3 lines):
```typescript
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

### Document: API description

❌ **Verbose**:
> This sophisticated, enterprise-grade API endpoint leverages
> state-of-the-art authentication mechanisms to facilitate the
> seamless retrieval of user profile information through a
> comprehensive set of query parameters.

✅ **Simple**:
> `GET /users/{id}` returns user profile. Requires Bearer token.
> Use `?fields=name,email` to limit response.

### Plan: Sprint goal

❌ **Vague**:
> Improve overall product quality and customer satisfaction
> through various initiatives focused on stability, performance,
> and user experience.

✅ **Simple**:
> Sprint goal: Reduce login errors by 50% (8% → 4%).
> - Fix timeout bug (2 days)
> - Add retry on transient errors (1 day)
> - Improve error messages (1 day)

### Architecture: New feature

❌ **Over-architected**:
> Event-sourced microservice with CQRS, Kafka for ingestion,
> Redis for caching, separate read + write databases, sidecar
> for observability, dedicated auth service.

✅ **Simple**:
> Add endpoint to existing API. Postgres table for state.
> Standard auth middleware. Log to existing system.

---

## How to Push Back on Complexity

When someone proposes adding complexity, ask:

```
1. What problem does this solve?
2. Have we hit that problem yet?
3. What's the simplest version we could try first?
4. What happens if we skip this?
5. Can we delete instead of add?
```

Most "needed" complexity disappears under these questions.

---

## The "Simple by Default, Complex by Necessity" Pattern

```
Default → SIMPLE
  ↓
Hit a wall? → Add ONE layer of complexity
  ↓
Wait. Did it solve the problem?
  ↓
If yes → STOP. Don't pre-emptively add 5 more layers.
If no → Try ONE more, justified by evidence.
```

---

## Pre-Submit Checklist

Before delivering any output:

- [ ] Would a tired junior understand this in 6 months?
- [ ] Can I delete anything without losing functionality?
- [ ] Did I consider a simpler approach? Why did I reject it?
- [ ] Did I add anything "just in case"? Is that justified?
- [ ] Are all abstractions justified by ACTUAL (not imagined) needs?
- [ ] Could I explain this in 2 sentences?
- [ ] Did I use boring tech for critical paths?
- [ ] Did I match the audience's level (no jargon for non-experts)?

If any answer is "no" or "I'm not sure" → **simplify before delivering**.

---

## Anti-Patterns to Watch

- ❌ **Resume-driven design** — fancy tech to look sophisticated
- ❌ **Defensive programming overdose** — null checks everywhere
- ❌ **Layer addiction** — abstraction every time, "just in case"
- ❌ **Configuration sprawl** — YAML so complex it needs docs
- ❌ **Premature DRY** — sharing code that just *looks* similar
- ❌ **Hidden complexity** — looks clean, actually does magic
- ❌ **God objects** — one class does everything (file count: 1, comprehensibility: 0)
- ❌ **Buzzword stacking** — "cloud-native event-driven AI-powered"

---

## The Two Quotes

> "Make it work, make it right, make it fast — in that order."
> — Kent Beck

> "Perfection is achieved, not when there is nothing more to add,
> but when there is nothing left to take away."
> — Antoine de Saint-Exupéry

When in doubt: **take something away**.
