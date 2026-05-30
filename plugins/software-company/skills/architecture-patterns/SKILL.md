---
name: architecture-patterns
description: Use when choosing system architecture (monolith vs microservices vs serverless), designing distributed systems, deciding on synchronous vs event-driven communication, applying patterns like CQRS/Event Sourcing/Saga, or evaluating architectural trade-offs. Reference for common patterns with concrete decision guidance.
---

# Architecture Patterns

## When to use this skill

- Greenfield architecture decisions
- Choosing communication patterns between services
- Refactoring monolith → modular or microservices
- Designing event-driven systems
- Implementing CQRS, Event Sourcing, Saga
- Reviewing existing architecture
- Making ADR-level decisions

---

## High-Level Architecture Choice

### Decision tree

```
How many engineers? Team count? Domain complexity?
│
├─ <10 engineers, 1 team
│  └─ ✅ Monolith (modular monolith)
│
├─ 10-50 engineers, 2-5 teams
│  └─ ✅ Modular monolith OR few services
│
├─ 50+ engineers, 5+ teams
│  └─ Consider microservices (only if needed)
│
└─ Any size + spiky/event-driven workload
   └─ Add serverless for that piece
```

---

## Pattern 1: Modular Monolith

**The 2026 default for most teams.**

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
- ✅ Small/medium team (< 30 engineers)
- ✅ Need fast iteration
- ✅ Simple ops requirements
- ✅ Can deploy together

**When NOT to use:**
- ❌ Multiple teams needing independent deploys
- ❌ Wildly different scaling needs per feature
- ❌ Different tech stacks needed

**Implementation tips:**
- Enforce module boundaries (e.g., NestJS modules, Java packages, Go internal/)
- Each module exposes a public interface
- Avoid cross-module DB access
- One DB but logical schema separation

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
- ✅ Independent teams (Conway's Law)
- ✅ Different scaling needs per service
- ✅ Need polyglot tech stacks
- ✅ Mature CI/CD + observability

**When NOT to use (most projects):**
- ❌ Small team — overhead kills velocity
- ❌ No K8s/IaC expertise
- ❌ Can't afford distributed tracing
- ❌ Don't have strong domain boundaries yet

**Hidden costs:**
- 💸 Operational complexity (5x ops effort)
- 💸 Network latency between services
- 💸 Distributed transactions hard
- 💸 Debug-ability suffers
- 💸 Need service mesh, observability stack

> 🚨 **Microservices are an organizational scaling pattern**, not a tech pattern. Adopt only when team coordination is the bottleneck.

---

## Pattern 3: Serverless / Functions

**For spiky, event-driven workloads.**

```
Event ──► Function ──► Service / DB / Queue
```

**Sweet spots:**
- ✅ Async background processing
- ✅ Scheduled tasks (cron)
- ✅ Glue code between services
- ✅ Spiky / unpredictable traffic
- ✅ Image/video processing pipelines

**Bad fits:**
- ❌ Long-running processes (15 min limit usually)
- ❌ Stateful processing
- ❌ High-frequency low-latency (cold starts)
- ❌ Massive sustained traffic (cost spikes)

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

**Pros:** Simple mental model, easy debugging
**Cons:** Coupling, cascading failures, hard to scale independently

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
| Redis Pub/Sub | Simple, ephemeral |

**Pros:** Decoupling, resilience, scalability
**Cons:** Eventual consistency, harder debugging, ordering challenges

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

## Pattern 4: CQRS (Command Query Responsibility Segregation)

**Split write model from read model.**

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
- ✅ Vastly different read vs write loads
- ✅ Complex reporting / dashboards
- ✅ Multiple read views from same data

**When NOT to use:**
- ❌ Simple CRUD (massive overkill)
- ❌ Strong consistency required for reads

---

## Pattern 5: Event Sourcing

**Store events, not state.**

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
- ✅ Strong audit/compliance requirements
- ✅ Need to replay history
- ✅ Temporal queries ("balance at date X")
- ✅ Complex business logic with many state transitions

**When NOT to use:**
- ❌ Simple state apps (overkill)
- ❌ No team experience with it
- ❌ Don't need history/audit
- ❌ Hard to delete data (GDPR considerations)

> ⚠️ **Both CQRS and Event Sourcing add MASSIVE complexity. Use sparingly.**

---

## Pattern 6: Saga (Distributed Transactions)

**When you need atomicity across services.**

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
| Visibility | 🟢 Central | 🔴 Distributed |
| Coupling | 🟡 Coupled to orchestrator | 🟢 Loosely coupled |
| Debugging | 🟢 Easier | 🔴 Hard |
| Adding services | 🟡 Update orchestrator | 🟢 Add subscriber |

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

**Use when:** External clients, multiple services, need cross-cutting concerns

---

## Pattern 8: Strangler Fig (Migration)

**Migrate monolith → modular gradually.**

```
Phase 1:    Phase 2:           Phase 3:
[Monolith]  [Mono] [NewSvc]    [NewSvc1] [NewSvc2]
                ▲    │              ▲
                └────┘ Proxy routes  └── Old Monolith deprecated
                  selective traffic
```

**Steps:**
1. Identify bounded context to extract
2. Build new service for that context
3. Add proxy/feature flag to route portion of traffic
4. Gradually shift traffic to new service
5. Delete old code when fully migrated

> 💡 **Beats big-bang rewrites every time.**

---

## Cross-Cutting Decisions

### Database per service vs Shared DB

| | Shared DB | DB per service |
|---|-----------|----------------|
| Coupling | 🔴 High | 🟢 Low |
| Consistency | 🟢 ACID | 🟡 Eventual |
| Schema changes | 🔴 Coordinate | 🟢 Independent |
| Performance | 🟢 Easy joins | 🔴 Network calls |
| Use when | Monolith | Microservices |

### Caching tiers

```
Browser cache ──► CDN ──► Reverse Proxy ──► App Cache (Redis) ──► DB
       1                  2                       3                4
       ▲                                                           ▲
       Closest to user (fastest)              Furthest (last resort)
```

Each tier ~10x faster than the next.

### Idempotency

**Always design APIs to handle duplicate requests:**
```
Client retries → Server detects duplicate → Same result, no side effect
```

Methods:
- Idempotency key header (Stripe pattern)
- Deduplication window
- Natural idempotency (PUT vs POST)

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
| **Total** | 100% | **7.95** | 7.10 | 7.20 |
```

---

## Anti-patterns

- ❌ **Microservices premature** — monolith first
- ❌ **Distributed monolith** — services that must deploy together
- ❌ **God service** — one service that does everything
- ❌ **Chatty interfaces** — N+1 service calls
- ❌ **Shared database across microservices** — coupling without isolation
- ❌ **Synchronous calls in critical path** — cascading failures
- ❌ **No bulkheading** — one slow service kills everything
- ❌ **Resume-driven architecture** — using K8s/microservices to look fancy

---

## Quick Reference: When to Use What

| Need | Pattern |
|------|---------|
| Small team, fast iteration | Modular monolith |
| Independent team deploys | Microservices |
| Spiky background jobs | Serverless |
| High write throughput, complex reads | CQRS |
| Full audit trail, time-travel | Event Sourcing |
| Multi-service transaction | Saga |
| Reduce service-to-service complexity | Service mesh |
| Multiple external clients | API Gateway |
| Migrate legacy system | Strangler Fig |

---

## Always Reference

When you make a decision, document it with **adr-writer** skill. Architecture decisions are about trade-offs, and future-you (or your replacement) needs to understand why.
