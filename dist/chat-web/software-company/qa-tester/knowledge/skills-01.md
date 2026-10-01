# skill: test-case-template

Use when writing test cases, designing test scenarios, creating test plans for a feature, or converting acceptance criteria into executable test cases. Covers functional, boundary, negative, and edge cases.

# Test Case Template

## When to use this skill

- Converting user story / acceptance criteria into test cases
- Designing test scenarios for a new feature
- Building a regression test suite
- Reviewing test coverage gaps

## Where test cases live

Test cases go in the project-root `qa/` folder, never inside `docs/`: `qa/<project-code>-test-cases.md` (or `.xlsx` for large projects where QA fills results in). `docs/test-plan.md` holds the plan only and links here. Bug reports found while testing go in `qa/bugs/`.

## Test Case ID Convention

```
TC-<MODULE>-<NUMBER>
Example: TC-LOGIN-001, TC-CHECKOUT-042
```

## Test Case Template

```markdown
## TC-XXX-NNN: <Short descriptive title>

**Module:** <feature area>
**Type:** Functional | Boundary | Negative | Integration | Performance | Security
**Priority:** P1 (critical) | P2 (high) | P3 (medium) | P4 (low)
**Automation:** Manual | Automated | Candidate

**Preconditions:**
- ...
- ...

**Test Data:**
| Field | Value |
|-------|-------|
| ...   | ...   |

**Steps:**
| # | Action | Expected Result |
|---|--------|----------------|
| 1 | ...    | ...            |
| 2 | ...    | ...            |
| 3 | ...    | ...            |

**Postconditions:**
- ...

**Related:** US-XXX, AC-X
```

## Test Case Categories (Coverage Guide)

For every feature, create test cases in these categories:

### 1. Functional / Happy Path
Valid inputs producing expected outputs.

### 2. Boundary
- Minimum valid value
- Maximum valid value
- Just below minimum
- Just above maximum
- Empty / null
- Single item / first / last

### 3. Negative
- Invalid format (wrong type, regex mismatch)
- Missing required fields
- Extra unexpected fields
- Special characters / SQL injection patterns
- Very long strings

### 4. Equivalence Classes
Pick one value from each class:
- Valid class
- Invalid class - too small
- Invalid class - too large
- Invalid class - wrong format

### 5. State Transitions
For features with states (e.g., order: draft → submitted → paid → shipped):
- Each valid transition
- Each invalid transition attempt

### 6. Integration
- Interaction with other modules
- External API calls (success, failure, timeout)
- Database state after operation

### 7. Concurrency
- Two users acting simultaneously
- Same user multiple tabs
- Race conditions

### 8. Security
- Unauthorized access
- Privilege escalation attempts
- Input sanitization (XSS, SQL injection)
- Rate limiting

### 9. Performance
- Response time under normal load
- Behavior under peak load
- Memory/CPU usage

### 10. Accessibility (UI features)
- Keyboard-only navigation
- Screen reader compatibility
- Color contrast
- Focus management

## Example: Login Feature Test Cases

```markdown
## TC-LOGIN-001: Successful login with valid credentials

**Module:** Authentication
**Type:** Functional
**Priority:** P1
**Automation:** Automated

**Preconditions:**
- User account exists with email "test@example.com"
- User is on login page

**Test Data:**
| Field    | Value              |
|----------|--------------------|
| Email    | test@example.com   |
| Password | ValidPass123!      |

**Steps:**
| # | Action                          | Expected Result                    |
|---|--------------------------------|-----------------------------------|
| 1 | Enter email in email field      | Email shown in field              |
| 2 | Enter password                  | Password masked with dots         |
| 3 | Click "Login" button            | Loading indicator appears         |
| 4 | Wait for response               | Redirect to /dashboard            |
| 5 | Verify dashboard               | Welcome message with user name    |

**Postconditions:**
- Session cookie set
- Last login timestamp updated

**Related:** US-001, AC1
```

```markdown
## TC-LOGIN-002: Empty email field

**Type:** Negative
**Priority:** P2

**Steps:**
| # | Action                | Expected Result                      |
|---|----------------------|--------------------------------------|
| 1 | Leave email empty     | Field shows placeholder              |
| 2 | Enter valid password  | Password accepted                    |
| 3 | Click "Login"         | Error: "Email is required"           |
| 4 | Verify focus          | Email field gets focus               |
```

```markdown
## TC-LOGIN-003: Account lockout after 5 failed attempts

**Type:** Security
**Priority:** P1

**Steps:**
| # | Action                              | Expected Result                |
|---|-------------------------------------|-------------------------------|
| 1 | Enter valid email + wrong password  | Error message                 |
| 2 | Repeat step 1 four more times       | Same error each time          |
| 3 | Enter valid email + correct password| Error: "Account locked..."    |
| 4 | Wait 15 minutes                     | Can login successfully        |
```

## Quality Checklist

Each test case should:
- [ ] Have one clear purpose
- [ ] Be reproducible by anyone reading it
- [ ] Have clear expected results
- [ ] Be independent (doesn't rely on TC-XXX running first)
- [ ] Be deterministic (same result every run)
- [ ] Trace back to a requirement (user story, AC)

## Anti-patterns

- ❌ "Test the login page" — too vague, what specifically?
- ❌ Combining 10 actions into one test case — split them
- ❌ Expected result = "It works" — be specific
- ❌ Test cases that depend on previous test cases passing
- ❌ Only happy-path tests (must include negative + boundary)
- ❌ Tests with no traceability to requirements

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.


---

# skill: simplicity-first

Use when producing a document, design, architecture or plan — BRD, FSD, ADR, roadmap, UX or API design, sprint plan. Defaults to the simplest version that works and applies the "could a tired teammate follow this in 6 months?" test before delivery. Rejects buzzwords, premature abstraction and unnecessary layers. For code use lazy-coding instead.

# Simplicity First

> The best architecture has the fewest moving parts. The best plan is the one a
> teammate can follow with no context.

This skill covers **non-code outputs** — documents, plans, architecture, and
designs. For code, use `lazy-coding`.

## The one test

Before submitting, ask:

> Could a tired teammate understand this in 6 months, with no prior context?

If "no" or "not sure" → simplify.

## 5 principles

1. **Start with the simplest thing that works.** Add complexity only when something breaks.
2. **Reduce moving parts.** Each component adds failure modes, ops burden, and docs. Default to one thing.
3. **Use familiar patterns.** Boring, proven tech for critical paths. Save novelty for low-risk experiments.
4. **Optimize for reading.** It's read far more often than written.
5. **Delete &gt; add.** The best edit removes something. The worst adds a layer for an imagined future need.

## By output type

### Documents (BRD, FSD, ADR)

Do: short sentences (≤ 20 words), plain English, one idea per paragraph, an
example for every abstract point, tables for structured data.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy"), undefined
jargon, walls of text, hedging ("might possibly potentially"), acronym soup.

### Architecture

Do: monolith first (split only when a bottleneck is proven), familiar stack,
standard patterns (REST, queues, caches), single source of truth per data type.

Avoid: microservices for small teams, distributed-everything, multi-master
databases before you must, event-driven by default (sync is simpler).

### Plans

Do: 3-5 priorities (not 20), a named owner per item, measurable success
criteria, realistic timelines with buffer, cut scope to fit time.

Avoid: vague goals ("improve quality"), 50-item lists (= no priority),
aspirational dates with no buffer, plans without success metrics.

### Designs (UX, API)

Do: fewest steps to the user's goal, reuse existing patterns, stay consistent
across screens, defaults that work for 80%, progressive disclosure.

Avoid: novel interactions where a standard one works, 10-step flows when 3
work, required fields with no smart default, hidden features needing tutorials.

## The 3-question filter

Before adding any new component, configuration option, or pattern:

1. Is there real evidence we need this **now** (not "might need")?
2. Is there a simpler way? (Sleep on it. Often yes.)
3. What's the cost of **not** adding it? (Often nothing, or a small refactor later.)

Two or more answers point to "simpler is fine" → don't add it.

## Examples

**API description**

❌ "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

✅ "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

❌ "Improve overall product quality and customer satisfaction through various
initiatives."

✅ "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

❌ "Event-sourced microservice with CQRS, Kafka ingestion, Redis cache, and a
dedicated auth service."

✅ "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

## Anti-patterns to reject

- **Future-proofing** — abstractions for needs that never arrive.
- **"It might scale"** — infra for 1M users while you have 1k.
- **Layer cake** — 6 layers where 90% just pass through.
- **Resume-driven design** — fancy tech to look sophisticated.
- **Buzzword stacking** — "cloud-native event-driven AI-powered".

## Pre-submit checklist

- [ ] A tired teammate would understand this in 6 months.
- [ ] Nothing can be deleted without losing meaning.
- [ ] No jargon the audience won't know.
- [ ] Every abstract claim has an example.
- [ ] I could explain the whole thing in two sentences.

If any answer is "no" → simplify before delivering.

> "Perfection is achieved not when there is nothing more to add, but when there
> is nothing left to take away." — Saint-Exupéry
