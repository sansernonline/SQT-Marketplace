# skill: architecture

Use when choosing an architecture, reviewing one or writing an ADR

# architecture — choose the shape of a system, review it, and record the decision

> **One rule:** start with the simplest shape that meets the real requirements (usually a modular monolith), and write down why each big choice was made, with the options it beat.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Monolith or microservices?", "should this be serverless?", splitting a monolith | [`references/architecture-patterns.md`](references/architecture-patterns.md) |
| Deeper pattern catalogue: CQRS, event sourcing, saga, API gateway, strangler fig | [`references/advanced-patterns.md`](references/advanced-patterns.md) and [`references/core-patterns.md`](references/core-patterns.md) |
| "Review this architecture" against quality needs and risks, with the `solution-architect` agent | [`references/architecture-review.md`](references/architecture-review.md) |
| "Record why we chose X", an ADR, a decision that will be hard to undo | [`references/adr-writer.md`](references/adr-writer.md) and [`assets/adr.md`](assets/adr.md) |
| A written architecture overview for the team or a customer | [`references/architecture-overview-template.md`](references/architecture-overview-template.md) |
| Scoring two or three options side by side | [`templates/options-score.json`](templates/options-score.json) |

## Steps every part shares

1. **Name the real requirements first.** Write the load, data size, team size, uptime and budget that the shape must meet. Mark any number you do not know as `(รอยืนยัน)` (awaiting confirmation).
2. **Compare at least 2 options.** One of them may be "do nothing". Say which one wins and why, in plain words.
3. **Keep the shape simple.** Microservices too early is a common mistake: start with a monolith, and split only when a measured limit forces it.
4. **Record the decision** as an ADR when it is hard to reverse, or when a person will later ask why.

## Check before done

- Every choice names its trade-off, and every unknown number is marked `(รอยืนยัน)`, never guessed.
- An ADR uses the format already in the project if one exists (look in `docs/adr/`, `docs/decisions/` or `.adr-dir` first), continues the latest number, and never reuses a number, even for a superseded ADR.
- A risk in a review is scored `Likelihood (1 to 3) × Impact (1 to 3)` and has evidence (a config line, a metric, an incident or a file). A risk without evidence stays marked as unverified.
- Security, data and money flows named in the design go on to `security-gate`, `security-audit` or `pdpa-compliance` as the case needs.

## References

- [`references/architecture-overview-template.md`](references/architecture-overview-template.md) and [`references/architecture-review.md`](references/architecture-review.md) — write-up templates
- [`references/adr-writer.md`](references/adr-writer.md) — the full ADR rules


## reference: adr-writer.md

<!-- merged from skill `adr-writer` on 2026-11-27 · description was: Use when recording why an architecture choice was made -->
# Architecture Decision Record (ADR) Writer

## When to use this skill

- Choosing between two or more technical options
- Significant change to existing architecture
- Deprecating a technology or pattern
- Documenting "why" for future team members

## 0 · Find the existing format first (every time)

Before using the structure or template in this file, check whether the user, client or project already has its own format:

- **Where to look:** existing ADRs (Architecture Decision Records): `docs/adr/` · `docs/decisions/` · `doc/architecture/decisions/` · `adr/` · the `.adr-dir` file → check the format (Nygard · MADR · Y-statement), the file naming and the latest number.
- **Result:** if found, use that format (headings, order, field names, running number) and say in the reply which file it came from. If not found, use the template in this file as the fallback and say that no existing format was found.
- **Always, whichever format:** continue the number from the latest file. Use the team's existing status names.

## ADR Numbering

- Sequential: ADR-0001, ADR-0002, ...
- Never reuse numbers, even if ADR is superseded
- Save as `docs/decisions/ADR-NNNN-<slug>.md` (see `workspace-rules/document-naming` and `project-docs`)
- Keep an index at `docs/decisions/README.md` — one table `| ADR | Decision | Status | Date |` — add a row when an ADR is created and edit the row when its status changes, so nobody has to open 20 files to find the live decisions (idea from wshobson architecture-decision-records)

## Status Lifecycle

```
Proposed → Accepted → Deprecated/Superseded
              ↓
           Rejected (if not accepted)
```

## Output Template

Copy **[`assets/adr.md`](../assets/adr.md)** and fill it in. Do not write the outline from memory.

- Do not add, remove or reorder headings and `**fields:**`. A section marked `<!-- optional -->` may be deleted whole when it does not apply.
- A value you do not know yet → `(รอยืนยัน)`, never a guess and never the template's placeholder.
- Before handing over, run the shared checker until it passes (paths from this skill's folder):

  ```bash
  python <โฟลเดอร์ skill polished-document-style ใน plugin superuser>/scripts/check_outline.py assets/adr.md <your ADR file>
  ```

  It flags missing or reordered headings, missing fields, changed table headers, and anything still unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option).

## Quality Checklist

Before finalizing:

- [ ] Title clearly states the decision (not just the topic)
- [ ] Context explains WHY this decision is needed now
- [ ] At least 2 options considered (even if one is "do nothing")
- [ ] Trade-offs are honest — every choice has downsides
- [ ] Consequences include both positive AND negative
- [ ] Consequences name **one way to confirm the decision is still followed** — a test, a lint or dependency rule, or a review-checklist line (MADR calls this Confirmation); "we will be careful" is not one
- [ ] Could a new team member understand this in 6 months?
- [ ] `check_outline.py` passes

## Anti-patterns

- Writing ADR after implementation is done (write BEFORE)
- Editing accepted ADRs (create new one that supersedes it instead)

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `design-gate/polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `document-design` |
| The point needs a picture to land | `diagrams`, then `diagrams` for project documents (`diagrams` only for README / PR notes) |


## reference: advanced-patterns.md

# Architecture Patterns — Advanced Pattern Catalogue

Details moved out of [SKILL.md](architecture-patterns.md). Load this file when the decision involves one of these patterns.

## Contents

- [Pattern 4: CQRS (Command Query Responsibility Segregation)](#pattern-4-cqrs-command-query-responsibility-segregation)
- [Pattern 5: Event Sourcing](#pattern-5-event-sourcing)
- [Pattern 6: Saga (Distributed Transactions)](#pattern-6-saga-distributed-transactions)
- [Pattern 7: API Gateway](#pattern-7-api-gateway)
- [Pattern 8: Strangler Fig (Migration)](#pattern-8-strangler-fig-migration)

---

## Pattern 4: CQRS (Command Query Responsibility Segregation)

**Use one model for writes and a separate model for reads.**

```
Commands ──► Write Model ──► Event Store
                              │
                              ▼
                          Projector
                              │
                              ▼
Queries ◄── Read Models (denormalized for query)
```

**When to use:**
- Read load and write load are very different
- Complex reporting / dashboards
- Multiple read views from same data

**When NOT to use:**
- Simple create/read/update/delete (CRUD) apps (far too much)
- Reads must always show the latest write

---

## Pattern 5: Event Sourcing

**Store every change as an event, not just the current state.**

```
Instead of:           Store:
Account                Events:
  balance: $100        ├─ AccountOpened
                       ├─ Deposit($50)
                       ├─ Deposit($75)
                       └─ Withdraw($25)

State is computed from events
```

**When to use:**
- Strong audit/compliance requirements
- Need to replay history
- Questions about the past ("balance at date X")
- Complex business logic with many state transitions

**When NOT to use:**
- Apps with simple state (too much)
- No team experience with it
- Don't need history/audit
- You must be able to delete data, e.g. under GDPR (events are hard to delete)

> Note: **CQRS and Event Sourcing both add a lot of complexity. Use them only where they pay off.**

---

## Pattern 6: Saga (Distributed Transactions)

**When several services must all succeed or all roll back.**

### Orchestration (centralized)
```
Orchestrator
   │
   ├──► Service A (do step 1)
   │    [if fail → Orchestrator triggers compensations]
   ├──► Service B (do step 2)
   └──► Service C (do step 3)
```

### Choreography (decentralized)
```
Service A ──Event──► Service B ──Event──► Service C
   ▲                                            │
   └──────────── Compensation Event ────────────┘
```

| | Orchestration | Choreography |
|---|--------------|--------------|
| Visibility | ✓Central | ✗Distributed |
| Coupling | ~ Coupled to orchestrator | ✓Loosely coupled |
| Debugging | ✓Easier | ✗Hard |
| Adding services | ~ Update orchestrator | ✓Add subscriber |

**Choose orchestration** when: complex flow, need clear visibility
**Choose choreography** when: simple flow, many independent teams

---

## Pattern 7: API Gateway

```
Clients ──► API Gateway ──► Multiple Services
              │
              ├─ Routing
              ├─ Auth
              ├─ Rate limit
              ├─ Logging
              └─ Aggregation
```

**Tools:** Kong, AWS API Gateway, Envoy, Tyk, NGINX

**Use when:** external clients call many services, and you want auth, rate limits and logging in one place

---

## Pattern 8: Strangler Fig (Migration)

**Move off a monolith step by step.**

```
Phase 1:    Phase 2:           Phase 3:
[Monolith]  [Mono] [NewSvc]    [NewSvc1] [NewSvc2]
                ▲    │              ▲
                └────┘ Proxy routes  └── Old Monolith deprecated
                  selective traffic
```

**Steps:**
1. Pick one business area (bounded context) to pull out
2. Build new service for that context
3. Add a proxy or feature flag that routes part of the traffic
4. Gradually shift traffic to new service
5. Delete old code when fully migrated

> **Safer than rewriting everything at once.**


## reference: architecture-overview-template.md

# Architecture Overview Document Template

**สารบัญ:** แม่แบบเต็ม 1 บล็อก: Context · Quality Attributes · High-Level Architecture · Components · Data Flow · Tech Stack · Cross-Cutting Concerns · Trade-offs · References

Open this only when you actually need to write this kind of document · put `(รอยืนยัน)` (awaiting confirmation) on anything you do not know

## Standard Output: Polished Architecture Overview

```markdown
# Architecture: <System Name>

| | |
|--|--|
| **Document Type** | Architecture Overview |
| **Version** | 1.0 |
| **Status** | Draft |
| **Date** | YYYY-MM-DD |
| **Architect** | @name |
| **Related ADRs** | ADR-0001 (`docs/decisions/ADR-0001-database-choice.md`), ADR-0002 (`docs/decisions/ADR-0002-api-style.md`) |

---

## Table of Contents

1. [Context](#1-context)
2. [Quality Attributes](#2-quality-attributes)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Components](#4-components)
5. [Data Flow](#5-data-flow)
6. [Tech Stack](#6-tech-stack)
7. [Cross-Cutting Concerns](#7-cross-cutting-concerns)
8. [Trade-offs](#8-trade-offs)

---

## 1. Context

> What problem does this solve? Why now?

## 2. Quality Attributes (Priority Order)

| Rank | Attribute | Target | Why |
|:----:|-----------|--------|-----|
| 1 | Performance | < 200ms p95 | Customer-facing |
| 2 | Security | PDPA compliant | Legal req |
| 3 | Scalability | 10k RPS | Growth plan |
| 4 | Cost | < $5k/month | Budget |

## 3. High-Level Architecture

_[รูปภาพรวมสถาปัตยกรรม: User → CDN → Load Balancer → API Gateway → Auth / App → Redis · PostgreSQL · Queue → Worker. วาดเป็นรูปสไตล์เดียวกับเอกสารด้วย skill `diagrams` ไม่ใช้ Mermaid]_

## 4. Components

| Component | Responsibility | Technology | Owner |
|-----------|----------------|------------|-------|
| API Gateway | Routing, rate-limit | Kong | Platform |
| Auth Service | JWT, OAuth | Node.js | Security |
| App Service | Business logic | Node.js + NestJS | App Team |
| Database | Persistence | PostgreSQL 16 | DBA |
| Cache | Session, hot data | Redis 7 | Platform |

## 5. Data Flow

_[รูปลำดับ Data Flow: User → API → App → DB แล้วตอบกลับ. วาดด้วย skill `diagrams`]_

## 6. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React + Next.js (ใส่เวอร์ชันที่ใช้จริง) | SSR, ecosystem |
| Backend | Node.js + NestJS | Team expertise |
| Database | PostgreSQL 16 | ACID + JSON |
| Cache | Redis 7 | Standard |
| Infra | AWS (ECS Fargate) | Cost + ops simplicity |
| CI/CD | GitHub Actions | Already in use |

## 7. Cross-Cutting Concerns

| Concern | Approach |
|---------|----------|
| Authentication | JWT with refresh tokens |
| Logging | Structured JSON → CloudWatch |
| Monitoring | Prometheus + Grafana |
| Alerting | PagerDuty (P1), Slack (P2-P3) |
| Error Handling | Standard error envelope, Sentry |

## 8. Trade-offs

| Decision | Chose | Over | Reason |
|----------|-------|------|--------|
| Database | PostgreSQL | MongoDB | Strong consistency needed |
| Hosting | ECS Fargate | EKS | Lower ops burden |
| API Style | REST | GraphQL | Simpler caching, client maturity |

> **Known Limitations:** Single-region deployment limits availability to 99.9%. Multi-region planned for v2.

## References

- ADR-0001: Database choice (`docs/decisions/ADR-0001-database-choice.md`)
- ADR-0002: API style (`docs/decisions/ADR-0002-api-style.md`)
```


## reference: architecture-patterns.md

<!-- merged from skill `architecture-patterns` on 2026-11-27 · description was: Use when choosing monolith, microservices or serverless -->
# Architecture Patterns

## When to use this skill

- Architecture decisions for a new system
- Choosing communication patterns between services
- Splitting a monolith into modules or microservices
- Designing event-driven systems
- Implementing Command Query Responsibility Segregation (CQRS), Event Sourcing or Saga
- Reviewing existing architecture
- Making decisions big enough for an Architecture Decision Record (ADR)

---

## High-Level Architecture Choice

### Decision tree

```
How many engineers? Team count? Domain complexity?
│
├─ <10 engineers, 1 team
│  └─ Monolith (modular monolith)
│
├─ 10-50 engineers, 2-5 teams
│  └─ Modular monolith OR few services
│
├─ 50+ engineers, 5+ teams
│  └─ Consider microservices (only if needed)
│
└─ Any size + spiky/event-driven workload
   └─ Add serverless for that piece
```

---

## Patterns 1–3, communication and cross-cutting decisions

Details are in [references/core-patterns.md](core-patterns.md). Load it after the decision tree picks a direction:

- Pattern 1: Modular Monolith (the default) · Pattern 2: Microservices · Pattern 3: Serverless / Functions
- Communication: synchronous vs asynchronous (event-driven), and when to choose which
- Cross-cutting: database per service vs shared DB · caching tiers · idempotency · decision matrix template

---

## Patterns 4–8: CQRS, Event Sourcing, Saga, API Gateway, Strangler Fig

Details for each are in [references/advanced-patterns.md](advanced-patterns.md). Load that file when the decision involves one of these:

- Pattern 4: CQRS (Command Query Responsibility Segregation)
- Pattern 5: Event Sourcing
- Pattern 6: Saga (Distributed Transactions)
- Pattern 7: API Gateway
- Pattern 8: Strangler Fig (Migration)

---

## Anti-patterns

- **Microservices too early** — start with a monolith
- **Distributed monolith** — services that must deploy together
- **God service** — one service that does everything
- **Chatty interfaces** — one request fans out into many service calls (N+1)
- **Shared database across microservices** — all the coupling, none of the isolation
- **Synchronous calls in critical path** — cascading failures
- **No bulkheads** (no limits that isolate one service's resources) — one slow service drags everything down
- **Resume-driven architecture** — using K8s/microservices to look fancy

---

## Quick Reference: When to Use What

| Need | Pattern |
|------|---------|
| Small team, fast iteration | Modular monolith |
| Independent team deploys | Microservices |
| Spiky background jobs | Serverless |
| High write throughput, complex reads | CQRS |
| Full audit trail, view state at any past time | Event Sourcing |
| Multi-service transaction | Saga |
| Reduce service-to-service complexity | Service mesh |
| Multiple external clients | API Gateway |
| Migrate legacy system | Strangler Fig |

---

## Always Reference

When you make a decision, record it with the **adr-writer** skill. Architecture decisions are trade-offs. Future you, or whoever replaces you, needs to know why.

**อ่านเพิ่มเมื่อต้องใช้:** [`architecture-overview-template.md`](architecture-overview-template.md) — แม่แบบภาพรวมสถาปัตยกรรม


## reference: architecture-review.md

<!-- merged from skill `architecture-review` on 2026-11-27 · description was: Review existing or proposed architecture with the solution-architect agent against non-functional requirements and risks. -->
Use the `solution-architect` agent to perform an architecture review of: **the user's request**

The solution architect should:

1. **Initial Discovery** — gather:
   - Current architecture docs (existing diagrams, Architecture Decision Records (ADRs))
   - System scope (which components, boundaries)
   - Review purpose: pre-implementation, mid-build, or operating system
   - Stakeholder concerns driving the review
   - Recent incidents or pain points

2. **Document current architecture:**
   - Create Context-Container-Component-Code (C4) model views (Context, Container, Component) as figures with the `diagrams` skill (not plain Mermaid)
   - List components + responsibilities
   - Map data flows
   - Identify integration points

3. **Evaluate against quality attributes:**

   **Performance**
   - Latency targets vs measured
   - Throughput requirements
   - Caching strategy
   - Database query patterns

   **Scalability**
   - Horizontal vs vertical
   - Bottlenecks (CPU, memory, network, DB)
   - Stateful vs stateless components
   - Auto-scaling readiness

   **Security**
   - Authentication / authorization
   - Data encryption (transit + rest)
   - Secrets management
   - Attack surface
   - (Hand off detailed threat model to `security-engineer`)

   **Reliability**
   - Single points of failure
   - Failure modes
   - Disaster recovery
   - Backup + restore tested

   **Cost**
   - Current monthly spend
   - Cost per service / per request
   - Optimization opportunities

   **Maintainability**
   - Tech debt accumulated
   - Tooling gaps
   - Documentation quality
   - Team familiarity

4. **Apply architecture patterns** (use `architecture-patterns.md` skill):
   - Is the chosen pattern appropriate?
   - Are we suffering from anti-patterns (distributed monolith, etc.)?
   - Would refactoring to a different pattern help?

5. **Identify risks** — walk every component through 6 lenses so nothing hides behind the one the stakeholder named: data loss · security exposure · availability (single point of failure, no rollback) · cost run-away · lock-in (vendor, one-person knowledge) · change cost (idea from ECC production-audit)

   Score each risk `Likelihood (1–3) × Impact (1–3)` and attach evidence (config line · metric · incident · file); a risk with no evidence stays `(ยังไม่ได้ตรวจ)` and never scores above Medium

   | Severity | Score | Definition |
   |----------|-------|------------|
   | Critical | 7–9 | Will fail / cause outage soon |
   | High | 5–6 | Significant risk within 12 months |
   | Medium | 3–4 | Known limitation, manageable |
   | Low | 1–2 | Future consideration |

   Summary line uses the house review scale: Critical–High = สูง · Medium = กลาง · Low = ต่ำ

6. **Propose improvements** with trade-offs:
   - Quick wins (low effort, high impact)
   - Strategic changes (require investment)
   - Things to NOT do (anti-patterns to avoid)

7. **Produce polished architecture review document** using `design-gate/polished-document-style` skill:
   - Executive summary
   - Current state diagrams (`diagrams` house style)
   - Quality attribute scorecard
   - Risk register
   - Recommendations prioritized
   - ADRs needed (list for follow-up)
   - Sign-off section

8. **Hand-off suggestions:**
   - Detailed threat model → `security-engineer`
   - Implementation of changes → `developer`
   - Cost optimization details → `devops-engineer`
   - Refactoring plan → `project-manager`


## reference: core-patterns.md

# Architecture Patterns — Core Patterns and Cross-Cutting Decisions

Details moved out of [SKILL.md](architecture-patterns.md). Load this file once the decision tree has pointed at a pattern, or when the choice involves communication style, data ownership, caching or idempotency.

## Contents

- [Pattern 1: Modular Monolith](#pattern-1-modular-monolith)
- [Pattern 2: Microservices](#pattern-2-microservices)
- [Pattern 3: Serverless / Functions](#pattern-3-serverless--functions)
- [Communication Patterns](#communication-patterns)
  - [Synchronous (Request-Response)](#synchronous-request-response)
  - [Asynchronous (Event-Driven)](#asynchronous-event-driven)
  - [When to choose which](#when-to-choose-which)
- [Cross-Cutting Decisions](#cross-cutting-decisions)
  - [Database per service vs Shared DB](#database-per-service-vs-shared-db)
  - [Caching tiers](#caching-tiers)
  - [Idempotency](#idempotency)
- [Decision Matrix Template](#decision-matrix-template)

---

## Pattern 1: Modular Monolith

**The 2026 default for most teams.** One deployable app, split into modules with strict boundaries.

```
┌─────────────────────────────────────┐
│   Single deployable application     │
│ ┌───────┐ ┌───────┐ ┌───────────┐  │
│ │Module │ │Module │ │  Module   │  │
│ │  A    │ │  B    │ │     C     │  │
│ └───────┘ └───────┘ └───────────┘  │
│   ▲           ▲           ▲         │
│   └── Strict module boundaries ──┘  │
└─────────────────────────────────────┘
         │
         ▼
    Single DB (or per-module schemas)
```

**When to use:**
- Small/medium team (up to about 50 engineers; same bands as the decision tree in SKILL.md)
- You need to ship changes fast
- Operations needs are simple
- All parts can deploy together

**When NOT to use:**
- Multiple teams needing independent deploys
- Features need very different scaling
- Parts need different tech stacks

**Implementation tips:**
- Enforce module boundaries (e.g., NestJS modules, Java packages, Go internal/)
- Each module exposes a public interface
- Don't let one module read another module's tables
- One DB, with a separate schema per module

---

## Pattern 2: Microservices

**When you've outgrown the monolith.**

```
┌──────┐  ┌──────┐  ┌──────┐
│ Svc A│  │ Svc B│  │ Svc C│
└──┬───┘  └──┬───┘  └──┬───┘
   │ ▲      │ ▲      │ ▲
   │ │      │ │      │ │     ← Each owns its DB
   ▼ │      ▼ │      ▼ │
  ┌──┴┐    ┌──┴┐    ┌──┴┐
  │DB │    │DB │    │DB │
  └───┘    └───┘    └───┘
```

**When to use:**
- Independent teams (Conway's Law)
- Different scaling needs per service
- Services need different languages or stacks
- Mature continuous integration and delivery (CI/CD) and monitoring already in place

**When NOT to use (most projects):**
- Small team — the extra overhead slows everyone down
- No Kubernetes (K8s) or infrastructure-as-code (IaC) skills on the team
- Can't afford distributed tracing
- Business areas don't have clear boundaries yet

**Hidden costs:**
- Much harder to operate (more services to deploy, monitor and debug)
- Network latency between services
- Transactions across services are hard
- Bugs are harder to trace
- You need a service mesh and a monitoring stack

> **Microservices are an organizational scaling pattern**, not a tech pattern. Adopt them only when teams blocking each other is the real bottleneck.

---

## Pattern 3: Serverless / Functions

**For spiky, event-driven workloads.**

```
Event ──► Function ──► Service / DB / Queue
```

**Good fits:**
- Async background processing
- Scheduled tasks (cron)
- Glue code between services
- Spiky / unpredictable traffic
- Image/video processing pipelines

**Bad fits:**
- Long-running processes (the limit is usually 15 min)
- Processing that must keep state between calls
- Frequent calls that need a fast response (cold starts add delay)
- Heavy traffic all day (the bill climbs fast)

---

## Communication Patterns

### Synchronous (Request-Response)

```
Client ──HTTP/gRPC──► Server
       ◄──Response───
```

| Protocol | When |
|----------|------|
| REST | Public APIs, simple CRUD |
| GraphQL | Mobile clients, multiple read patterns |
| gRPC | Internal service-to-service |
| WebSocket | Real-time bidirectional |

**Pros:** Easy to reason about and debug
**Cons:** Services depend on each other directly, one failure spreads to the next, hard to scale each part on its own

### Asynchronous (Event-Driven)

```
Producer ──► Topic/Queue ──► Consumer(s)
         (publish)         (subscribe)
```

| Tech | When |
|------|------|
| Kafka | High throughput, event sourcing, replay needed |
| RabbitMQ | Traditional queuing, work distribution |
| SQS/SNS | AWS-native, simpler than Kafka |
| NATS | Lightweight, low-latency |
| Redis Pub/Sub | Simple, messages are not stored |

**Pros:** Services don't depend on each other directly, survive failures better, scale more easily
**Cons:** Data is consistent only after a delay (eventual consistency), harder to debug, message order is hard to guarantee

### When to choose which

```
Need immediate response? ─Yes─► Sync
                         └─No──► Async

Is producer impacted by consumer? ─Yes─► Sync
                                  └─No──► Async

Multiple consumers? ─Yes─► Async (pub/sub)
                   └─No──► Either
```

---


## Cross-Cutting Decisions

### Database per service vs Shared DB

| | Shared DB | DB per service |
|---|-----------|----------------|
| Coupling | ✗High | ✓Low |
| Consistency | ✓ACID (all-or-nothing transactions) | ~ Eventual |
| Schema changes | ✗Coordinate | ✓Independent |
| Performance | ✓Easy joins | ✗Network calls |
| Use when | Monolith | Microservices |

### Caching tiers

```
Browser cache ──► CDN ──► Reverse Proxy ──► App Cache (Redis) ──► DB
       1                  2                       3                4
       ▲                                                           ▲
       Closest to user (fastest)              Furthest (last resort)
```

Each tier is faster than the next (the gap depends on your system; measure it). CDN = content delivery network.

### Idempotency

**Always design APIs so a repeated request does no extra harm:**
```
Client retries → Server detects duplicate → Same result, no side effect
```

Methods:
- Idempotency key header (Stripe pattern)
- A time window in which the server drops duplicates
- Methods that are safe to repeat by nature (PUT, unlike POST)

---

## Decision Matrix Template

When proposing architecture, compare options:

```markdown
| Factor | Weight | Option A | Option B | Option C |
|--------|:------:|:--------:|:--------:|:--------:|
| Performance | 30% | 8 | 9 | 7 |
| Cost | 20% | 9 | 6 | 8 |
| Team skill | 20% | 9 | 5 | 7 |
| Operations | 15% | 8 | 5 | 7 |
| Future-proof | 15% | 6 | 9 | 7 |
| **Total** | 100% | **8.10** | 7.00 | 7.20 |
```
