# skill: architecture-patterns

Use when choosing system architecture (monolith, microservices, serverless), sync vs event-driven, or patterns like CQRS, Event Sourcing and Saga.

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
- ✅ Small/medium team (< 30 engineers)
- ✅ You need to ship changes fast
- ✅ Operations needs are simple
- ✅ All parts can deploy together

**When NOT to use:**
- ❌ Multiple teams needing independent deploys
- ❌ Features need very different scaling
- ❌ Parts need different tech stacks

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
- ✅ Independent teams (Conway's Law)
- ✅ Different scaling needs per service
- ✅ Services need different languages or stacks
- ✅ Mature continuous integration and delivery (CI/CD) and monitoring already in place

**When NOT to use (most projects):**
- ❌ Small team — the extra overhead slows everyone down
- ❌ No Kubernetes (K8s) or infrastructure-as-code (IaC) skills on the team
- ❌ Can't afford distributed tracing
- ❌ Business areas don't have clear boundaries yet

**Hidden costs:**
- 💸 Much harder to operate (about 5x the ops effort)
- 💸 Network latency between services
- 💸 Transactions across services are hard
- 💸 Bugs are harder to trace
- 💸 You need a service mesh and a monitoring stack

> 🚨 **Microservices are an organizational scaling pattern**, not a tech pattern. Adopt them only when teams blocking each other is the real bottleneck.

---

## Pattern 3: Serverless / Functions

**For spiky, event-driven workloads.**

```
Event ──► Function ──► Service / DB / Queue
```

**Good fits:**
- ✅ Async background processing
- ✅ Scheduled tasks (cron)
- ✅ Glue code between services
- ✅ Spiky / unpredictable traffic
- ✅ Image/video processing pipelines

**Bad fits:**
- ❌ Long-running processes (the limit is usually 15 min)
- ❌ Processing that must keep state between calls
- ❌ Frequent calls that need a fast response (cold starts add delay)
- ❌ Heavy traffic all day (the bill climbs fast)

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

## Patterns 4–8: CQRS, Event Sourcing, Saga, API Gateway, Strangler Fig

Details for each are in [references/advanced-patterns.md](references/advanced-patterns.md). Load that file when the decision involves one of these:

- Pattern 4: CQRS (Command Query Responsibility Segregation)
- Pattern 5: Event Sourcing
- Pattern 6: Saga (Distributed Transactions)
- Pattern 7: API Gateway
- Pattern 8: Strangler Fig (Migration)

---

## Cross-Cutting Decisions

### Database per service vs Shared DB

| | Shared DB | DB per service |
|---|-----------|----------------|
| Coupling | 🔴 High | 🟢 Low |
| Consistency | 🟢 ACID (all-or-nothing transactions) | 🟡 Eventual |
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

Each tier is roughly 10x faster than the next. CDN = content delivery network.

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
| **Total** | 100% | **7.95** | 7.10 | 7.20 |
```

---

## Anti-patterns

- ❌ **Microservices too early** — start with a monolith
- ❌ **Distributed monolith** — services that must deploy together
- ❌ **God service** — one service that does everything
- ❌ **Chatty interfaces** — one request fans out into many service calls (N+1)
- ❌ **Shared database across microservices** — all the coupling, none of the isolation
- ❌ **Synchronous calls in critical path** — cascading failures
- ❌ **No bulkheads** (no limits that isolate one service's resources) — one slow service drags everything down
- ❌ **Resume-driven architecture** — using K8s/microservices to look fancy

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
- ✅ Read load and write load are very different
- ✅ Complex reporting / dashboards
- ✅ Multiple read views from same data

**When NOT to use:**
- ❌ Simple create/read/update/delete (CRUD) apps (far too much)
- ❌ Reads must always show the latest write

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
- ✅ Strong audit/compliance requirements
- ✅ Need to replay history
- ✅ Questions about the past ("balance at date X")
- ✅ Complex business logic with many state transitions

**When NOT to use:**
- ❌ Apps with simple state (too much)
- ❌ No team experience with it
- ❌ Don't need history/audit
- ❌ You must be able to delete data, e.g. under GDPR (events are hard to delete)

> ⚠️ **CQRS and Event Sourcing both add a lot of complexity. Use them only where they pay off.**

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

> 💡 **Safer than rewriting everything at once.**


---

# skill: human-writing

Use when writing anything a person will read (chat answer, report, status update, document, slide, diagram label) in Thai or English. Answer first, plain words.

# human-writing — เขียนภาษาคน อ่านลื่น เข้าใจง่าย

ใช้กับทุกอย่างที่คนจะอ่าน: คำตอบในแชต · รายงานสถานะ · เอกสาร (BRD · SRS · FSD · คู่มือ · proposal · paper) · สไลด์ · สคริปต์พูด · หัวตาราง · ป้ายใน diagram · คำอธิบาย skill และ agent

ไฟล์นี้เหมือนกันทุก plugin ใน SQT-Marketplace ต้นฉบับอยู่ที่ plugin `superuser` ถ้าจะแก้ให้แก้ที่นั่นแล้วรัน `node scripts/sync/sync-superuser.mjs`

---

## 1 · หลักใหญ่

- เขียนเหมือนอธิบายให้เพื่อนร่วมงานที่เก่งแต่ไม่ได้อยู่ในโปรเจกต์ฟัง ถ้าอ่านออกเสียงแล้วสะดุดให้เขียนใหม่
- คำตอบหรือข้อสรุปขึ้นก่อน แล้วค่อยเหตุผล ไม่เกริ่น ไม่ทวนคำถาม
- 1 ประโยค 1 ความคิด ถ้าประโยคต่อด้วย "ซึ่ง" "โดย" "จึง" หลายชั้น ให้แยกเป็นหลายประโยค
- ภาษาอังกฤษใช้หลักเดียวกัน: ประโยคไม่เกิน 25 คำ · ใครทำอะไร (active voice) · คำธรรมดา (buy ไม่ใช่ purchase)

## 2 · สัญลักษณ์และตัวเลข

สัญลักษณ์ใช้ได้ แต่คำที่อยู่รอบสัญลักษณ์ต้องเป็นภาษาคน

| ใช้ | เมื่อไร | ตัวอย่าง |
|---|---|---|
| `→` | ลำดับขั้น · ผลที่ตามมา | เข้าใจ → วางแผน → ลงมือ |
| `·` | คั่นรายการคำนามสั้น ๆ ในบรรทัดเดียว | ทำอะไร · ได้อะไร · ใช้แรงแค่ไหน |
| `:` | ตามด้วยรายละเอียดหรือรายการ | แยกโค้ด 3 ชั้น: รับข้อมูล → กฎธุรกิจ → เก็บข้อมูล |
| ตัวเลข | จำนวนทุกชนิด เขียนเป็นเลข ไม่สะกด | 3 ชั้น · 12 คำ · 1 ระดับ |

- **เงื่อนไขและคำสั่งเขียนเป็นประโยคเต็ม มีคำเชื่อม** (ถ้า … ให้ … · แล้ว · ส่วน · เพราะ) ไม่ใช้ `→` หรือ `·` ต่อประโยคเป็นท่อน ๆ:
  - ก่อน: `ไม่แน่ใจว่าขนาดไหน → ถือเป็นขนาดที่ใหญ่กว่า 1 ขั้น`
  - หลัง: `ถ้าไม่แน่ใจว่างานขนาดไหน ให้ถือว่าใหญ่ขึ้นอีก 1 ขั้น`
  - ก่อน: `ย้อนได้ → ทำเลย · ไม่รู้ → ค้นเอง · ย้อนไม่ได้ → เตรียมไว้ใน "รออนุมัติ"`
  - หลัง: `งานที่ย้อนได้ให้ทำเลย ไม่รู้ให้ค้นเอง ส่วนงานที่ย้อนไม่ได้ให้เตรียมไว้ใน "รออนุมัติ"`
- ในตารางใช้ข้อความสั้นได้ แต่ยังต้องอ่านเป็นภาษาคน ไม่ใช่รหัส
- สัญลักษณ์ช่วยให้สั้น แต่ห้ามแทนคำจนต้องถอดรหัส ถ้าคนนอกอ่านแล้วต้องเดาว่าลูกศรหมายถึงอะไร ให้เติมคำ
- ทุกตัวเลขบอกว่าหมายถึงอะไร: "กำไร 32% ของราคาขาย" ไม่ใช่ "margin 32%" ลอย ๆ
- เทียบให้เห็นภาพ: "เร็วขึ้น 3.2 เท่า" อ่านง่ายกว่า "ลดลง 69%"
- ถ้าผลยังไม่แน่นอน ให้บอกตรง ๆ ว่าเพราะอะไร: "รันรอบเดียว ยังสรุปไม่ได้"

## 3 · คำ

- ใช้คำที่คนพูดจริง ไม่ใช้คำราชการหรือศัพท์แปลตรงตัว: "ยกระดับ" → "ส่งต่อ" · "ผลสุดท้ายขัดกฎ" → "คำตอบไม่ผ่านกฎ"
- ศัพท์ที่คนในวงการใช้กันอยู่แล้ว (token · prompt · API · OCR) ให้คงภาษาอังกฤษไว้
- ตัวย่อเขียนเต็มครั้งแรกแล้ววงเล็บ: Large Language Model (LLM) จากนั้นใช้ตัวย่อ
- คำที่ตั้งขึ้นเองหรือคำที่ทำให้งง ให้อธิบายครั้งแรกที่ใช้: "hook (สคริปต์จด log อัตโนมัติ)"
- สิ่งเดียวกันเรียกคำเดียวทั้งชุด ทั้งแชต สไลด์ เอกสาร และ diagram
- ตัดคำฟุ่มเฟือย: "ทำการตรวจสอบ" → "ตรวจ" · "มีการนำเข้า" → "นำเข้า" · "ในส่วนของ" · "ได้มีการ" · "เป็นการ" → ตัด
- เลี่ยงท่าที่ทำให้ดูเหมือน AI เขียน: คำคมเปิดเรื่อง · "ไม่ใช่แค่… แต่ยัง…" · จัดทุกอย่างเป็นชุดละ 3 · ชมว่าสำคัญเกินจริง · ตัวหนาทุกบรรทัด · สรุปซ้ำตอนจบ

## 4 · ตอบในแชต

- ประโยคแรกตอบตรง ๆ: ถ้าถามว่า "ใส่ในรายงานดีไหม" ให้ตอบ "ควรใส่ครับ" แล้วค่อยเหตุผล
- คำถามสั้นให้ตอบสั้น 2–3 ประโยค ไม่ต้องมีหัวข้อหรือตาราง
- ใช้ตารางเมื่อเทียบตั้งแต่ 2 ตัวเลือกหรือหลายตัวเลข ส่วนรายการใช้เมื่อมีหลายข้อที่ต้องไล่อ่าน
- งานที่ทำแล้วบอกด้วยผล ไม่เล่าขั้นตอน: "แก้แล้ว 8 จุด เปิดไฟล์ได้ปกติ"
- ถ้าเคยบอกผิด ให้บอกตรง ๆ ว่าผิดตรงไหน ที่ถูกคืออะไร ไม่ขอโทษยืดยาว
- ถ้าไม่แน่ใจ ให้บอกว่าไม่แน่ใจตรงไหน ตรวจได้อย่างไร ไม่เดาให้ฟังดูมั่นใจ
- ถ้าต้องให้ผู้ใช้ตัดสินใจ ให้เสนอตัวเลือก บอกว่าแนะนำข้อไหนเพราะอะไร แล้วปิดด้วยคำถามเดียวที่ตอบง่าย
- ลงท้ายด้วยสิ่งที่ทำต่อได้จริง 1 อย่าง ไม่สรุปซ้ำ

## 5 · เอกสารและรายงาน

- ย่อหน้าแรกของเอกสารคือข้อสรุปหรือสิ่งที่ผู้อ่านต้องรู้ คนที่อ่านแค่ย่อหน้านี้ต้องได้เรื่อง
- หัวข้อบอกเนื้อหา ไม่ใช่ชื่อหมวด: "ระบบส่งต่อลดการเรียก LLM ได้ครึ่งหนึ่ง" ดีกว่า "ผลการทดลอง"
- ย่อหน้าละไม่เกิน 5 ประโยค
- หัวคอลัมน์บอกว่าวัดอะไร: "เรียก LLM" · "คำตอบไม่ผ่านกฎ" · 1 คอลัมน์ 1 ความหมาย
- เชิงอรรถมีไว้สำหรับนิยามและที่มาของตัวเลข · ข้อสรุปสำคัญห้ามซ่อนในเชิงอรรถ
- รายงานสถานะ: ผลต่อคนใช้ก่อน → ตารางสถานะ → สิ่งที่รออนุมัติ และทุกข้ออ้างต้องบอกว่าตรวจแล้วหรือคาดเอา
- เอกสารทางการตามแบบ (หนังสือราชการ · สัญญา · ใบกำกับภาษี) ให้ใช้ถ้อยคำตามแบบที่กำหนด ส่วนหลักในไฟล์นี้ใช้กับส่วนที่เขียนเองได้

## 6 · สไลด์

- หัวสไลด์ = ข้อสรุปของหน้า ไม่ใช่ชื่อหัวข้อ: "ยิ่ง Tier 1 เติมค่าเอง Gate ยิ่งมองไม่เห็นค่าผิด"
- โครงหน้า: ปัญหา → วิธีแก้ → ผล · แต่ละส่วนอ่านจบในแวบเดียว
- สคริปต์พูดเขียนแบบที่พูดจริง อ่านออกเสียงได้ไม่สะดุด

## 7 · Diagram

- ป้ายในกล่องเป็นคำนามสั้น 1–4 คำ ที่คนเข้าใจ: "รับข้อมูลเข้า" ไม่ใช่ "Ingress Layer Handler"
- ป้ายบนลูกศรเป็นกริยา: "ส่งไฟล์" · "ตรวจสิทธิ์" · ลูกศรที่ไม่มีป้ายต้องเดาไม่ผิด
- คำในรูปต้องตรงกับคำในเอกสารทุกคำ
- ชื่อรูปเป็นข้อสรุป เหมือนหัวสไลด์ · ใต้รูปมี 1 ประโยคบอกว่าควรดูอะไร
- ถ้าโปรเจกต์มีแบบรูปประจำ (house style) ให้ใช้ตามนั้น ส่วนวิธีวาดดูใน skill รูปของ plugin นั้น

## 8 · ตัวอย่าง ก่อน → หลัง

| ก่อน | หลัง |
|---|---|
| ขอบระบบ (รับ input) → service (กฎธุรกิจ) → data | แยกโค้ด 3 ชั้น: รับข้อมูลเข้า → กฎธุรกิจ → เก็บข้อมูล |
| ตรวจ input ที่ขอบ · พังแบบปิด | ตรวจข้อมูลจากภายนอกทันทีที่เข้ามา ถ้าเกิดข้อผิดพลาดให้ปฏิเสธไว้ก่อน |
| เล็กพลาดหรือตรวจไม่ผ่าน → ขยับขึ้นหนึ่งระดับ | ถ้าโมเดลเล็กทำพลาด ให้ขยับขึ้น 1 ระดับ ไม่ลองซ้ำกับตัวเดิม |
| มีผลเหนือค่าเริ่มของ playbook แต่ไม่เหนือรายการ "รออนุมัติ" | ถ้าไฟล์นี้กับ playbook ขัดกัน ให้ทำตามไฟล์นี้ ยกเว้นเรื่องที่ต้องรออนุมัติ |
| เมื่อความต้องการมีการนำเข้าหรือส่งออกไฟล์ | เมื่องานต้องนำเข้าหรือส่งออกไฟล์ |
| ทีมที่ดีไม่ได้เก่งเพราะแต่ละคนเก่ง แต่เพราะ… | วิธีทำงานของทีม: เลือกแผน → แจกงาน → ตรวจผล → จดบันทึก |
| คำค้น 12/12 จากประกาศงานอยู่ใน CV | คำค้นจากประกาศงานอยู่ใน CV ครบ 12 คำ · ตรวจแล้ว |
| margin 32–35% หลังทุกค่าธรรมเนียม | หักค่าธรรมเนียมแล้วเหลือกำไร 32–35% ของราคาขาย |
| hook จะทำงานเฉพาะโฟลเดอร์ที่มีการสร้างโฟลเดอร์ .superuser ไว้แล้วเท่านั้น | hook (สคริปต์จด log) ทำงานเฉพาะโฟลเดอร์ที่มี `.superuser/` |
| ตรวจด้วย validate ผ่าน ไม่มี error และ warning แต่ยังต้อง build ใหม่ | ตัวตรวจผ่านหมด · เหลือ build ใหม่บนเครื่องคุณ |

## 9 · ตรวจก่อนส่ง 5 ข้อ

1. อ่านออกเสียงแล้วลื่นไหม
2. คนนอกโปรเจกต์อ่านแล้วเข้าใจโดยไม่ต้องถามไหม · สัญลักษณ์ทุกตัวอ่านออกไหม
3. ประโยคแรกตอบคำถามหรือบอกข้อสรุปแล้วหรือยัง
4. ศัพท์และตัวเลขตรงกันทุกไฟล์ในชุดเดียวกันไหม (แชต · สไลด์ · เอกสาร · diagram)
5. มีคำไหนตัดออกได้โดยความหมายไม่เปลี่ยนไหม ถ้ามีให้ตัด

ที่มา: ISO 24495-1 (plain language) · GOV.UK clear language · Microsoft Writing Style Guide · Wikipedia: Signs of AI writing · คู่มือการร่างเอกสารภาษาไทย
