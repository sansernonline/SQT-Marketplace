# skill: architecture-patterns

Use when choosing monolith, microservices or serverless

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

Details are in [references/core-patterns.md](references/core-patterns.md). Load it after the decision tree picks a direction:

- Pattern 1: Modular Monolith (the default) · Pattern 2: Microservices · Pattern 3: Serverless / Functions
- Communication: synchronous vs asynchronous (event-driven), and when to choose which
- Cross-cutting: database per service vs shared DB · caching tiers · idempotency · decision matrix template

---

## Patterns 4–8: CQRS, Event Sourcing, Saga, API Gateway, Strangler Fig

Details for each are in [references/advanced-patterns.md](references/advanced-patterns.md). Load that file when the decision involves one of these:

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

**อ่านเพิ่มเมื่อต้องใช้:** [`references/architecture-overview-template.md`](references/architecture-overview-template.md) — แม่แบบภาพรวมสถาปัตยกรรม


## reference: advanced-patterns.md

# Architecture Patterns — Advanced Pattern Catalogue

Details moved out of [SKILL.md](../SKILL.md). Load this file when the decision involves one of these patterns.

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

_[รูปภาพรวมสถาปัตยกรรม: User → CDN → Load Balancer → API Gateway → Auth / App → Redis · PostgreSQL · Queue → Worker. วาดเป็นรูปสไตล์เดียวกับเอกสารด้วย skill `diagram-figures` ไม่ใช้ Mermaid]_

## 4. Components

| Component | Responsibility | Technology | Owner |
|-----------|----------------|------------|-------|
| API Gateway | Routing, rate-limit | Kong | Platform |
| Auth Service | JWT, OAuth | Node.js | Security |
| App Service | Business logic | Node.js + NestJS | App Team |
| Database | Persistence | PostgreSQL 16 | DBA |
| Cache | Session, hot data | Redis 7 | Platform |

## 5. Data Flow

_[รูปลำดับ Data Flow: User → API → App → DB แล้วตอบกลับ. วาดด้วย skill `diagram-figures`]_

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


## reference: core-patterns.md

# Architecture Patterns — Core Patterns and Cross-Cutting Decisions

Details moved out of [SKILL.md](../SKILL.md). Load this file once the decision tree has pointed at a pattern, or when the choice involves communication style, data ownership, caching or idempotency.

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
