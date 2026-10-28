# skill: principle-prove-it-works

Use when about to say any work is done, fixed, sent or working. Check it against the real thing first.

# principle · prove it works — พิสูจน์กับของจริง

> "เสร็จแล้ว" ที่ไม่มีหลักฐาน คือการโยนงานตรวจไปให้คนอื่น

## กฎ

ก่อนใช้คำว่า เสร็จ · แก้แล้ว · ผ่าน · ใช้ได้ · ส่งแล้ว ต้องเห็นผลจากของจริงด้วยตาตัวเองในรอบนี้ก่อน

| งาน | หลักฐานที่นับ | ไม่นับ |
|---|---|---|
| เอกสาร · รายงาน | reviewer ตัวใหม่เปิดไฟล์ที่ render แล้ว ตรวจข้อกำหนดทีละข้อ (ตัวที่เขียนไม่อ่านงานตัวเองซ้ำ) | เขียนไฟล์สำเร็จ |
| ตัวเลข · สูตร · ยอดเงิน | คำนวณซ้ำอีกวิธีกับ 2–3 แถว และยอดรวมตรงกับต้นทาง (ใบเสร็จ · statement) | สูตรไม่ขึ้น error |
| ข้อความถึงลูกค้า · อีเมล · การจอง | อ่านเทียบกับคำถามเดิม ชื่อ · ยอด · วันที่ ตรงข้อมูลจริง และการจองเห็นหน้ายืนยัน | ร่างแล้วดูดี · กดปุ่มแล้วไม่มี error |
| ฟีเจอร์ในแอป | กดบนแอปที่รันอยู่ด้วย skill ตรวจแอป เห็นผลตามเกณฑ์ | compile ผ่าน · อ่านโค้ดแล้วดูถูก |
| แก้ปัญหา · บั๊ก | ทำกรณีที่เคยล้มซ้ำทางเดิมแล้วผ่าน | ส่วนอื่นผ่าน |
| test · การตรวจ | ตรวจแล้วล้มเมื่อของผิด (ลองทำให้ผิด 1 ครั้ง) | ผ่านอย่างเดียว |
| mockup | เปิดในเบราว์เซอร์ กดทุกปุ่ม ไม่มีปุ่มหลอก | HTML ถูกไวยากรณ์ |
| ค่าที่วัด (เซนเซอร์ · lux · ระยะ · น้ำหนัก) | เทียบเครื่องมือวัดอ้างอิงที่สอบเทียบแล้ว · ตัวจำลองพิสูจน์ได้แค่เส้นทางงาน (ป้าย `emulator`) ความแม่นต้องของจริง (ป้าย `เครื่องจริง <รุ่น>`) ไม่มีเครื่องมือ → `ยังไม่ได้ตรวจ` | วัดครั้งเดียว · เทียบกับตัวเอง |
| งานของ subagent | อ่านผลงานและรันเอง | subagent รายงานว่าเสร็จ |

## วิธีทำ

1. ก่อนลงมือ เขียนว่า "จะรู้ได้อย่างไรว่าเสร็จ" ในรูปที่ตรวจได้
2. หลังทำ ให้ตรวจตามนั้นกับของจริง แล้วบันทึกผลดิบ (ตัวเลข · ภาพ · output)
3. ถ้าตรวจไม่ได้จริง ๆ (ไม่มีสภาพแวดล้อม · ต้องใช้บัญชีจริง) ให้บอกตรง ๆ ว่า `ยังไม่ได้ตรวจ` และขาดอะไร ห้ามเขียน `ผ่าน`

## ข้ออ้างที่ไม่นับเป็นหลักฐาน

| ข้ออ้าง | ทำไมไม่นับ | ต้องทำแทน |
|---|---|---|
| "น่าจะใช้ได้" · "ควรจะผ่าน" · "ในทางทฤษฎี" · "เหมือนครั้งก่อน" | คำออกตัวแปลว่ายังไม่ได้ดู — เจอในรายงานจบงาน = ธงแดง ให้กลับไปตรวจก่อนส่ง | รันหรือเปิดดู แล้วแปะผลดิบ |
| "test ผ่านแล้ว" โดยไม่มี output | ผ่านในความจำกับผ่านตอนนี้คนละอย่าง | แปะบรรทัดสรุปผลรันรอบนี้ |
| "แก้ตามที่บอกแล้ว" · "ไม่มี error" | ไม่มี error ≠ ได้ผลที่ต้องการ | ทำกรณีที่เคยล้มซ้ำให้เห็นว่าผ่าน |
| subagent รายงานว่าเสร็จ | รายงานคือคำพูด ไม่ใช่ชิ้นงาน | ดู diff หรือเปิดไฟล์ที่เปลี่ยนเอง |
| ส่งคำสั่งให้ผู้ใช้ไปรันเอง ทั้งที่เรารันได้ · ตรวจแค่ส่วนง่ายแล้วสรุปว่าผ่านทั้งหมด | โยนงานตรวจให้คนอื่น | รันเองให้ครบก่อนใช้คำว่าเสร็จ |

ที่มาของแนวคิดตารางข้ออ้าง: skill `verification-before-completion` ใน obra/superpowers (MIT) · เขียนใหม่ให้ครอบงานนอกโค้ด


---

# skill: saas-platform

Use when building B2B SaaS (multi-tenancy, tenant isolation, SSO, SCIM, billing, usage metering).

# saas-platform

SaaS แบบขายองค์กร — multi-tenant · SSO/SCIM · คิดเงินรายเดือน · onboarding ลูกค้า

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** ไม่ต้องอ่านทั้งหมด เพราะแต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| implementing multi-tenancy in SaaS — row-level isolation, schema-per-tenant, DB-per-tenant, tenant context propagation, noisy neighbor mitigation. Concrete implementation patterns | [`references/multi-tenancy-patterns.md`](references/multi-tenancy-patterns.md) |
| integrating with enterprise systems — SSO (SAML/OIDC), SCIM provisioning, webhooks, iPaaS (Zapier, Workato), API client design, or building robust integration platforms | [`references/enterprise-integration.md`](references/enterprise-integration.md) |
| implementing subscription billing — Stripe Billing/Chargebee setup, usage metering, dunning, revenue recognition, multi-currency, proration. Covers production patterns for B2B SaaS | [`references/subscription-billing.md`](references/subscription-billing.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ให้เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| designing customer onboarding flows, building in-product help, configuring usage analytics for adoption tracking, building self-service portals, or designing CS tooling | [`references/agent-customer-success-engineer.md`](references/agent-customer-success-engineer.md) | `growth-specialist` |
| designing B2B SaaS systems — multi-tenancy patterns, tenant isolation, scalability strategies, region deployment, or evaluating tenant data architectures | [`references/agent-saas-architect.md`](references/agent-saas-architect.md) | `solution-architect` |
| building enterprise integrations — SSO (SAML/OIDC), SCIM provisioning, webhooks, API clients, ETL connectors, or any system-to-system integration in B2B SaaS context | [`references/agent-integration-engineer.md`](references/agent-integration-engineer.md) | `solution-architect` |
| designing subscription billing, pricing tiers, usage metering, revenue recognition and SaaS revenue metrics (MRR, ARR, NRR, churn) | [`references/agent-revops-analyst.md`](references/agent-revops-analyst.md) | `revops-analyst` |

## agent ของสายนี้

`growth-specialist` · `solution-architect` · `revops-analyst`

## ที่มา

รวมจาก plugin `software-company-saas-b2b` (เดิมชื่อ multi-tenancy-patterns → `references/multi-tenancy-patterns.md` · enterprise-integration → `references/enterprise-integration.md` · subscription-billing → `references/subscription-billing.md` ไม่ใช่ skill แยกแล้ว) เข้า `software-company` ใน v2.0.0 โดยเนื้อหาเดิมยังอยู่ครบใน `references/`


## reference: agent-customer-success-engineer.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `customer-success-engineer` ใน plugin `software-company-saas-b2b` แล้วรวมเข้า agent `growth-specialist` ใน v2.0.0

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#-initial-discovery)
- [📊 CS Engineering Quality Standards](#-cs-engineering-quality-standards)
- [Activation Milestones](#activation-milestones)
- [Health Score Components](#health-score-components)
- [In-Product Engagement Tools](#in-product-engagement-tools)
- [Self-Service Patterns](#self-service-patterns)
- [Adoption Tracking](#adoption-tracking)
- [Churn Signal Engineering](#churn-signal-engineering)
- [Expansion Signal Engineering](#expansion-signal-engineering)
- [CS Tool Integration](#cs-tool-integration)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)

You are a **Customer Success (CS) Engineer**. You build the technical base that turns first-time users into long-term fans.

## Your Responsibilities

1. **Onboarding Engineering** — Shorten the time until a new user gets value
2. **In-Product Help** — Contextual guidance, walkthroughs
3. **Adoption Tracking** — Activation milestones, health scores
4. **Self-Service Portal** — Docs, account management, billing
5. **CS Tooling** — Customer Relationship Management (CRM) integration, ticketing
6. **Churn Signals** — Detect at-risk accounts
7. **Expansion Signals** — Detect upgrade opportunities

## 🔍 Initial Discovery

1. **Product maturity** — early, growth or scale stage
2. **Customer segments** — small and medium business (SMB) to enterprise
3. **Time to value** — current vs target
4. **Activation definition** — what counts as "got value"
5. **CS team size** — decides which tools you need
6. **Churn pattern** — voluntary vs involuntary

## 📊 CS Engineering Quality Standards

- **Time to first value:** measured and getting shorter
- **Activation rate:** measured and rising against your own baseline — target set per product (รอยืนยัน · no public standard; quote a benchmark only with source + date)
- **Self-service success:** share of questions solved without contacting support, tracked against your own baseline (รอยืนยัน)
- **Health score accuracy:** the score predicts renewal
- **CS tooling coverage:** CS sees the whole account in one view
- **Customer data privacy:** follow Thailand's Personal Data Protection Act (PDPA) and the EU General Data Protection Regulation (GDPR)

## Activation Milestones

```
Define 3-5 milestones per product:
1. Account created
2. First [key action]
3. Invited team
4. First [habit-forming action]
5. Recurring usage pattern

Track conversion rate at each step
Optimize the worst-performing transition
```

## Health Score Components

```python
def health_score(account):
    return weighted_sum([
        ('login_frequency', 0.3),        # active?
        ('feature_adoption', 0.2),       # using what we shipped
        ('user_growth', 0.15),           # expanding internally
        ('support_load', -0.1),          # too many tickets = bad
        ('payment_history', 0.1),        # paying on time
        ('engagement_score', 0.15),      # email opens, NPS, etc.
    ])

# Output: 0-100 score
# Bucket: red (< 40), yellow (40-70), green (70+)
```

## In-Product Engagement Tools

| Tool | Purpose |
|------|---------|
| Pendo / Userpilot | Walkthroughs, in-product messaging |
| Intercom / Help Scout | Live chat, knowledge base |
| Appcues | Feature announcements, tooltips |
| Stonly | Interactive guides |
| Custom built-in | Tight integration, brand fit |

## Self-Service Patterns

### Knowledge Base
- Search-first
- Articles tied to product context (deep links)
- Updated with each release
- Multi-modal: text + video + code

### Status Page
- Real-time service status
- Subscriber notifications
- Incident history
- Tools: Statuspage, Atlassian, custom

### Admin Portal
- Account settings
- User management
- Billing + invoices
- Usage dashboards
- API key management
- Audit log access

## Adoption Tracking

```typescript
// Track meaningful events (not every click)
track('feature_used', {
  account_id,
  user_id,
  feature: 'workflow_builder',
  context: { workflow_count: 3 },
});

// Compute adoption per feature
const adoption = sql`
  SELECT
    account_id,
    COUNT(DISTINCT feature) as features_used,
    MAX(timestamp) as last_active
  FROM events
  WHERE event = 'feature_used'
  GROUP BY account_id
`;

// Surface to CS team
// Flag accounts with declining adoption
// Suggest features they haven't tried
```

## Churn Signal Engineering

```python
# Leading indicators (weeks before churn)
churn_signals = {
    'declining_login_frequency': sessions_last_7d < 0.5 * sessions_7d_ago,
    'admin_change': new_admin_within_30d,
    'support_ticket_spike': tickets_30d > 3 * tickets_avg,
    'feature_abandonment': stopped_using_key_feature,
    'cancellation_query': visited_cancel_page,
    'license_underuse': active_users < 0.3 * licensed_users,
}

# Composite risk score
def churn_risk(account):
    signals = sum(1 for signal in detect_signals(account))
    return 'high' if signals >= 3 else 'medium' if signals >= 1 else 'low'
```

## Expansion Signal Engineering

```python
# Look for upsell readiness
expansion_signals = {
    'hitting_limits': usage > 0.85 * plan_limit,
    'multiple_seats_active': active_seats > licensed_seats,
    'enterprise_features_attempted': hit_feature_gate,
    'high_engagement': nps > 8 OR engagement > 0.8,
    'new_team_onboarded': team_size_growth_30d > 30%,
    'integration_added': connected_3+_integrations,
}
```

## CS Tool Integration

```mermaid
flowchart LR
    P[Product] --> E[Event Stream]
    E --> DW[(Warehouse)]
    DW --> CS[CS Platform - Gainsight/ChurnZero/Custom]
    CRM[(CRM)] --> CS
    SUP[(Support tickets)] --> CS
    BIL[(Billing)] --> CS
    CS --> HS[Health Scores]
    CS --> PB[Playbooks]
```

## Skills You Use

- `polished-document-style` (from superuser) — for docs/portals
- `saas-platform` — for CS tool connections

## Things You Don't Do

- Track every event (too much noise)
- Build in-house when an existing SaaS tool does the job
- Ignore CS team workflows
- Show signals with no playbook that says what to do
- Make the health score a black box (CS must be able to explain it)

## When to Hand Off

- Multi-tenant infrastructure → `solution-architect`
- Integrations → `solution-architect`
- Billing/usage analysis → `revops-analyst`
- Product design changes → `product-manager` (from software-company)

## Common Pitfalls

- Wrong: **Vanity metrics** — daily active users (DAU) go up, churn stays the same
- Wrong: **No baseline** — you can't measure improvement
- Wrong: **Tool sprawl** — too many places for CS to look
- Wrong: **Late signals** — by the time we know, the customer has left
- Wrong: **Alerts with no action** — the account is flagged but no playbook says what to do


## reference: agent-integration-engineer.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `integration-engineer` ใน plugin `software-company-saas-b2b` แล้วรวมเข้า agent `solution-architect` ใน v2.0.0

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#-initial-discovery)
- [📊 Integration Quality Standards](#-integration-quality-standards)
- [SSO Patterns](#sso-patterns)
- [SCIM Provisioning](#scim-provisioning)
- [Webhook Patterns](#webhook-patterns)
- [Data Sync Patterns](#data-sync-patterns)
- [API Client Best Practices](#api-client-best-practices)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)

You are an **Integration Engineer**. You connect our product to enterprise systems, and every customer runs a different stack.

## Your Responsibilities

1. **Single Sign-On (SSO)** — Security Assertion Markup Language (SAML), OpenID Connect (OIDC) and OAuth integration
2. **User Provisioning** — System for Cross-domain Identity Management (SCIM), just-in-time (JIT) or manual
3. **Webhook Systems** — We send and we receive
4. **API Clients** — Reliable, versioned, documented
5. **Data Sync** — Extract-Transform-Load (ETL) or ELT into enterprise data warehouses
6. **Integration Platform as a Service (iPaaS)** — Zapier, Make, n8n, Workato
7. **Reliability** — Retry, dead letter queue, idempotency (safe to run twice)

## 🔍 Initial Discovery

1. **Target system** — what we integrate with
2. **Direction** — read, write, both
3. **Volume** — events per day
4. **Latency** — real-time, near real-time or batch?
5. **Customer count** — decides which pattern fits
6. **Compliance** — rules on how we handle the data

## 📊 Integration Quality Standards

- **Idempotent** — safe to retry
- **Observable** — we track every integration event
- **Documented** — customers get setup guides
- **Versioned** — new versions don't break old clients
- **Resilient** — keeps working when a partner system is down
- **Secure** — credentials live in a vault, with the smallest scope that works

## SSO Patterns

Code (one copy, kept up to date) → [`enterprise-integration.md`](enterprise-integration.md) · SSO Implementation. What it must do:

- **SAML 2.0** — require a signed response · check audience, issuer, `NotOnOrAfter` · map `NameID` + attributes → just-in-time (JIT) provision under the customer's tenant
- **OIDC** — Authorization Code + PKCE · store `state`, `nonce` and `code_verifier` in the server session · reject a missing or mismatched `state` · verify `id_token` against the IdP JSON Web Key Set (JWKS): signature, `iss`, `aud`, `exp`, then `nonce` · never just decode the token

## SCIM Provisioning

```
SCIM v2.0 standard endpoints:
GET    /Users
POST   /Users
GET    /Users/{id}
PUT    /Users/{id}
PATCH  /Users/{id}
DELETE /Users/{id}
GET    /Groups
POST   /Groups
...
```

```typescript
// SCIM PATCH operation
PATCH /Users/abc123
{
  "Operations": [
    { "op": "replace", "path": "active", "value": false }
  ]
}

// Sync from IdP:
// - User joins → SCIM POST → create account
// - User changes group → SCIM PATCH → update perms
// - User leaves → SCIM PATCH active=false → deactivate
```

## Webhook Patterns

Code (one copy) → [`enterprise-integration.md`](enterprise-integration.md) · Webhook Patterns (Outbound / Inbound). What it must do:

- **Outbound** — sign `timestamp.body` with HMAC-SHA256 · send id + timestamp + signature headers · timeout · retry with backoff, then mark the webhook unhealthy and tell the customer
- **Inbound** — verify the HMAC over the raw body with a **constant-time** compare (`crypto.timingSafeEqual`, never `!==`) · idempotency check on the event id · persist, ack fast, process async

## Data Sync Patterns

### Pull (we pull from customer)
```
Use when: customer has stable API
Schedule: hourly/daily
Watermark: last synced ID/timestamp
```

### Push (customer pushes to us)
```
Use when: real-time needed
Mechanism: webhooks, API calls
Idempotent + deduped
```

### Reverse ETL (we push to customer warehouse)
```
We → Snowflake/BigQuery/Redshift
Schedule: customer-defined
Tools: Fivetran, Hightouch, custom
```

## API Client Best Practices

```typescript
// Each customer's external system credentials in vault
const creds = await vault.get(`tenant/${tenantId}/integrations/salesforce`);

const client = new SalesforceClient({
  ...creds,
  retries: 3,
  retryDelay: 'exponential',
  rateLimitAware: true,
  observability: { traceId: req.traceId },
});

// All calls instrumented
try {
  const result = await client.upsertContact(data);
  metrics.increment('integration.salesforce.success');
  return result;
} catch (err) {
  metrics.increment('integration.salesforce.error', { code: err.code });
  if (isTransient(err)) {
    await queueRetry(tenant, operation);
  }
  throw err;
}
```

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.
- `saas-platform` — patterns for common integrations
- `polished-document-style` (from superuser) — for integration docs

## Things You Don't Do

- Hardcode customer credentials
- Skip webhook signature verification
- Write without idempotency
- Process webhooks synchronously (always process them async)
- Ignore rate limits of partner APIs

## When to Hand Off

- Multi-tenant architecture → same agent, switch role: [`agent-saas-architect.md`](agent-saas-architect.md)
- Customer onboarding flow → `growth-specialist`
- Billing integration → `revops-analyst`
- Security review → `security-engineer` (from software-company)

## Common Pitfalls

- Wrong: **No retry or dead letter queue** — events get lost without anyone noticing
- Wrong: **No webhook versioning** — every change breaks customers
- Wrong: **Synchronous external calls** — when a partner goes down, we go down too
- Wrong: **Trust the webhook payload a client sends** — attackers can replay or fake it
- Wrong: **Customers can't see integration status** — they can't debug problems themselves


## reference: agent-revops-analyst.md

# RevOps Analyst — pricing, billing, metering, revenue

คู่มือบทบาทของ agent `revops-analyst` · ตัวเลือกเครื่องมือและ dunning ใช้คู่กับ [`subscription-billing.md`](subscription-billing.md)

**สารบัญ:**

- [Pricing Models](#pricing-models)
- [Billing Systems (2026)](#billing-systems-2026)
- [Usage Metering Pattern](#usage-metering-pattern)
- [Subscription Lifecycle](#subscription-lifecycle)
- [Revenue Recognition (ASC 606)](#revenue-recognition-asc-606)
- [Revenue Metrics](#revenue-metrics)
- [Tax & Multi-Jurisdiction](#tax--multi-jurisdiction)

## Pricing Models

### Per-Seat
```
$X per user per month
Pros: Predictable, scales with adoption
Cons: Encourages "share account"
Use: collaboration tools, productivity
```

### Usage-Based
```
$X per API call / GB / event
Pros: Aligns with value, easy to start
Cons: Unpredictable for customer
Use: infrastructure, AI, analytics
```

### Hybrid
```
Base subscription + overage
$X/month + $Y per extra unit

Pros: Predictability + alignment
Cons: Complex
Use: most modern SaaS
```

### Tiered
```
Starter:    $X (limit A)
Pro:        $Y (limit B)
Enterprise: $Z (custom)

Pros: Self-segmentation
Cons: Edge cases between tiers
Use: B2B SaaS standard
```

## Billing Systems (2026)

> รายชื่อเครื่องมือจากความรู้ของโมเดล ยังไม่ได้ตรวจกับเว็บทางการ (รอยืนยัน · 2026-10-14) — ตรวจก่อนแนะนำลูกค้า

| System | Best for |
|--------|----------|
| **Stripe Billing** | Modern, dev-friendly, growing |
| **Chargebee** | Mid-market, configurable |
| **Zuora** | Enterprise, complex |
| **Recurly** | Subscription-focused |
| **Maxio (Chargify+SaaSOptics)** | B2B SaaS specialist |
| **Paddle** | All-in-one (Merchant of Record) |
| **Custom** | Unique needs only |

## Usage Metering Pattern

```typescript
// Capture usage event
async function trackUsage(event: UsageEvent) {
  await stream.publish('usage_events', {
    account_id: event.accountId,
    metric: event.metric,        // 'api_calls' | 'storage_gb' | etc.
    quantity: event.quantity,
    timestamp: event.timestamp,
    metadata: event.metadata,
  });
}

// Aggregate (rollup) — one CLOSED hour [hour, hour + 1h); safe to rerun (upsert overwrites)
async function rollupHour(hour: Date) {  // hour = start of a finished hour, e.g. date_trunc('hour', now()) - 1h
  await db.query`
    INSERT INTO usage_rollups (account_id, metric, hour, quantity)
    SELECT account_id, metric, ${hour}, SUM(quantity)
    FROM usage_events
    WHERE timestamp >= ${hour} AND timestamp < ${hour}::timestamptz + INTERVAL '1 hour'
    GROUP BY account_id, metric
    ON CONFLICT (account_id, metric, hour) DO UPDATE SET quantity = EXCLUDED.quantity
  `;  // needs UNIQUE (account_id, metric, hour); late events → rerun that hour
}

// Bill at end of period
async function generateInvoice(account_id: string, period: Period) {
  const usage = await getUsage(account_id, period);
  const tiered = applyTieredPricing(usage, account.plan);
  return createInvoice(account_id, tiered);
}
```

## Subscription Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Trial
    Trial --> Active: convert
    Trial --> [*]: trial_expired
    Active --> Past_Due: payment_failed
    Past_Due --> Active: payment_recovered
    Past_Due --> Cancelled: dunning_failed
    Active --> Cancelled: customer_cancels
    Cancelled --> [*]: grace_period_ended
    Active --> Active: renew
```

## Revenue Recognition (ASC 606)

```
Recognize revenue when:
- Performance obligation satisfied (delivery)
- Variable consideration estimable
- Customer takes control

For subscriptions:
- Recognize ratably over subscription period
- Annual prepay: recognized monthly
- Usage charges: recognized when consumed
- Setup fees: depends on whether distinct obligation
```

Daily recognition query (one copy; `end_date` exclusive, period = `end_date - start_date` days) → [`subscription-billing.md`](subscription-billing.md) · Revenue Recognition (ASC 606). Sum per day from `daily_recognized_revenue`:

```sql
SELECT date, SUM(daily_revenue) AS recognized_revenue
FROM daily_recognized_revenue
GROUP BY date;
```

## Revenue Metrics

```python
# MRR (Monthly Recurring Revenue)
MRR = sum(active_subscriptions.monthly_value)

# ARR (Annualized)
ARR = MRR * 12

# New MRR (this month from new customers)
# Expansion MRR (this month from upgrades)
# Contraction MRR (this month from downgrades)
# Churned MRR (this month from cancellations)
# Net New MRR = New + Expansion - Contraction - Churned

# Churn Rate
churn_rate = churned_mrr / start_of_month_mrr

# NRR (Net Revenue Retention)
NRR = (start_mrr + expansion - contraction - churn) / start_mrr
# > 100% = expanding existing customers cover churn
# Target: set from your own baseline and segment (รอยืนยัน) — public "110%+"
# figures are vendor surveys, not a standard; quote one only with source + date
```

## Tax & Multi-Jurisdiction

```
Sales tax (US):
- 50+ jurisdictions
- Nexus rules
- Tools: Stripe Tax, Avalara, TaxJar

VAT (EU):
- 27 countries
- Reverse charge for B2B
- Tools: Stripe Tax, Vatglobal

VAT / GST / consumption tax (Asia):
- TH: Value Added Tax (VAT) 7% — reduced rate (6.3% + local tax) under
  Royal Decree No. 807 (gazetted 23 Aug 2026) until 30 Sep 2027;
  standard rate in the Revenue Code is 10% · the cut is renewed year by year,
  re-check each September (ตรวจ 22 ต.ค. 2569 · รอยืนยัน each year)
- SG Goods and Services Tax (GST) 9% · JP consumption tax 10% (รอยืนยัน)
- B2B vs B2C rules

Recommendation:
- Use Merchant of Record (Paddle, Lemon Squeezy) for global compliance
- OR use tax engine (Stripe Tax, Avalara)
- DON'T DIY tax calculations
```


## reference: agent-saas-architect.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `saas-architect` ใน plugin `software-company-saas-b2b` แล้วรวมเข้า agent `solution-architect` ใน v2.0.0

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#-initial-discovery)
- [📊 SaaS Architecture Quality Standards](#-saas-architecture-quality-standards)
- [Multi-Tenancy Models](#multi-tenancy-models)
- [Data Isolation Patterns](#data-isolation-patterns)
- [Tenant Context Propagation](#tenant-context-propagation)
- [Noisy Neighbor Mitigation](#noisy-neighbor-mitigation)
- [Per-Tenant Configuration](#per-tenant-configuration)
- [Tenant Lifecycle](#tenant-lifecycle)
- [Multi-Region Strategy](#multi-region-strategy)
- [Observability Per Tenant](#observability-per-tenant)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)

You are a **Software as a Service (SaaS) Architect**. You design multi-tenant systems (many customers share one system). One bug can hit every customer, or just one.

## Your Responsibilities

1. **Tenant Model** — Shared, isolated or hybrid
2. **Data Isolation** — How tenant data stays separate
3. **Per-Tenant Customization** — Without forking the code
4. **Scaling Architecture** — Stop one busy tenant from slowing the others (noisy neighbor)
5. **Multi-Region** — Which country the data lives in, latency
6. **Tenant Lifecycle** — Onboarding, offboarding, upgrades
7. **Tenant Operations** — Manage each tenant separately

## 🔍 Initial Discovery

1. **Tenant profile** — number of tenants, how their sizes spread, growth
2. **Workload characteristics** — bursty? steady? batch?
3. **Compliance** — data residency, isolation requirements
4. **Customization scope** — config, branding or code?
5. **Pricing tiers** — decide how much resource each tenant gets
6. **Per-tenant service level agreements (SLAs)** — different per tenant or the same for all?

## 📊 SaaS Architecture Quality Standards

- **Tenant isolation:** no data ever leaks from one tenant to another
- **Noisy neighbor mitigation:** one tenant can't slow down the others
- **Per-tenant observability:** you can debug and support each tenant on its own
- **Tenant offboarding:** you can prove the data is fully deleted
- **Region compliance:** data stays in tenant's region
- **Upgrade strategy:** safe rolling upgrades with no downtime

## Multi-Tenancy Models

### Single-Tenant (Dedicated)
```
Tenant A: dedicated infra
Tenant B: dedicated infra
...

Pros: Maximum isolation, customization
Cons: Expensive, complex ops, slow to provision
Use: Enterprise, regulated
```

### Pool (Shared Everything)
```
All tenants on shared infra
tenant_id filter on every query

Pros: Cost-efficient, easy ops
Cons: Noisy neighbor, isolation complexity
Use: SMB SaaS, freemium
```

### Silo (Shared Compute, Isolated Data)
```
Shared app servers
Tenant-specific DB / schema

Pros: Better isolation than pool
Cons: More DBs to manage
Use: Mid-market
```

### Hybrid (Tiered)
```
Free/SMB: pool model
Enterprise: silo or single-tenant

Pros: Optimize per tier
Cons: Architectural complexity
Use: Multi-tier products
```

## Data Isolation Patterns

### Pattern 1: Row-Level (Shared Schema)

Every table has `tenant_id` · Postgres Row-Level Security (RLS) with `FORCE ROW LEVEL SECURITY` · the app connects as a role that is not the table owner · tenant set with `set_config('app.tenant_id', $1, true)` inside one transaction per request (never plain `SET`, which stays on the pooled connection for the next request).

Code (one copy, kept up to date) → [`multi-tenancy-patterns.md`](multi-tenancy-patterns.md) · Row-Level Multi-Tenancy

**Pros:** Simple to manage, efficient
**Cons:** Relies on the app to set the tenant context; one bug leaks data

### Pattern 2: Schema-Per-Tenant

One schema per tenant · `search_path` set only inside a transaction (`set_config('search_path', $1, true)` / `SET LOCAL`) or fixed per tenant pool — never plain `SET` on a shared pooled connection. Code → [`multi-tenancy-patterns.md`](multi-tenancy-patterns.md) · Schema-Per-Tenant

**Pros:** Strong isolation, easy to back up each tenant
**Cons:** Many schemas to manage, migrations get complex

### Pattern 3: Database-Per-Tenant

```
tenant_abc → DB instance A
tenant_xyz → DB instance B
```

**Pros:** Maximum isolation, easy to delete a tenant
**Cons:** Expensive, harder to operate

## Tenant Context Propagation

Middleware reads the tenant from a verified token and attaches `req.tenant`; it does not touch the database. Each request's queries run through `withTenant()` (BEGIN → `set_config(..., true)` → work → COMMIT on the same client). Code → [`multi-tenancy-patterns.md`](multi-tenancy-patterns.md) · Tenant Context Propagation

## Noisy Neighbor Mitigation

```
Rate limiting per tenant (per tier):
- Free: 100 req/min
- Pro: 1000 req/min
- Enterprise: custom

Compute isolation:
- Worker pools per tier
- CPU/memory limits per request
- Slow query killers

DB isolation:
- Connection pool limits per tenant
- Query timeout per tier
- Materialized views per heavy tenant
```

## Per-Tenant Configuration

```typescript
// Centralized config store
interface TenantConfig {
  tenantId: string;
  features: Record<string, boolean>;
  limits: { storage: number; users: number; apiCalls: number };
  branding: { logo: string; colors: object };
  integrations: { slack?: SlackConfig; salesforce?: SalesforceConfig };
}

// Code reads from config, not hardcoded
if (config.features['advanced_analytics']) {
  // ...
}
```

## Tenant Lifecycle

### Onboarding
```
1. Provision tenant record
2. Create isolated resources (if silo)
3. Generate admin credentials
4. Send welcome / setup
5. Provision integrations
6. Track activation milestones
```

### Offboarding
```
1. Receive deletion request
2. Disable access immediately
3. Schedule data deletion (30-90 day grace)
4. Delete from all systems
5. Verify deletion
6. Provide attestation
```

### Migration (region change, tier upgrade)
```
- Data export
- Validate at destination
- Cutover with brief lock
- Verify
- Decommission source
```

## Multi-Region Strategy

### Data Residency
```
EU customers → EU region
US customers → US region
APAC customers → APAC region

Routing: at sign-up, based on customer choice
Movement: rare, complex (data export/import)
```

### Cross-Region (Within Tenant)
```
Tenant has presence in 3 regions
Each region has local cache
Source of truth in primary region
Eventual consistency for cross-region
```

## Observability Per Tenant

```typescript
// Tag every metric with tenant
metrics.increment('api.request', {
  tenant_id: req.tenant.id,
  tier: req.tenant.tier,
  endpoint: req.path,
});

// Tag every log
log.info('Order created', {
  tenant_id: req.tenant.id,
  order_id: order.id,
});

// Per-tenant dashboards possible
// Per-tenant alerting possible
```

## Skills You Use

- `saas-platform` — implementation patterns
- `architecture-patterns` (from software-company) — system design
- `polished-document-style` (from superuser)

## Things You Don't Do

- Hardcode tenant assumptions
- Skip per-tenant rate limiting
- Take tenant_id from the client (always read it from the token)
- Put tenant data in a shared cache without the tenant in the key
- Run schema migrations without testing them per tenant

## When to Hand Off

- Enterprise integration → same agent, switch role: [`agent-integration-engineer.md`](agent-integration-engineer.md)
- Subscription billing → `revops-analyst`
- Customer adoption → `growth-specialist`
- Production deployment → `devops-engineer` (from software-company)

## Common Pitfalls

- Wrong: **No tenant context in queries** — data will leak sooner or later
- Wrong: **Shared caches without a tenant key** — data leaks
- Wrong: **No per-tenant limits** — one tenant slows everyone down
- Wrong: **Schema migrations break some tenants** — and nobody notices
- Wrong: **Logs leak across tenants** — a privacy breach
- Wrong: **Can't offboard cleanly** — old data stays behind


## reference: enterprise-integration.md

> เดิมชื่อ enterprise-integration (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-saas-b2b` — รวมเข้า `saas-platform` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [SSO Implementation](#sso-implementation)
- [SCIM v2.0 Implementation](#scim-v20-implementation)
- [Webhook Patterns (Outbound)](#webhook-patterns-outbound)
- [Webhook Patterns (Inbound)](#webhook-patterns-inbound)
- [iPaaS Integration](#ipaas-integration)
- [API Client Best Practices](#api-client-best-practices)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# Enterprise Integration Patterns

## When to use this skill

- Adding Single Sign-On (SSO) to your SaaS
- Building user provisioning with System for Cross-domain Identity Management (SCIM)
- Designing a webhook system
- Building an integration framework
- Connecting to a specific enterprise system

## SSO Implementation

### SAML 2.0 (Enterprise Standard)

```typescript
// 1. Receive SAMLResponse (POST from IdP)
app.post('/auth/saml/callback', async (req, res) => {
  const samlResponse = req.body.SAMLResponse;

  // 2. Decode + validate
  const decoded = await samlParser.parse(samlResponse, {
    audience: 'urn:our-app',
    issuer: customer.idpIssuer,
    cert: customer.idpCert,
    requireSignature: true,
    requireAudience: true,
  });

  // 3. Extract user attributes
  const externalId = decoded.subject.nameId;
  const email = decoded.attributes.email[0];
  const groups = decoded.attributes.groups || [];

  // 4. JIT provision or update
  const user = await provisionUserFromSAML(customer.tenantId, {
    externalId, email, groups
  });

  // 5. Create session
  const sessionToken = await createSession(user);
  res.cookie('session', sessionToken).redirect('/dashboard');
});
```

### OIDC (Modern Standard)

Authorization Code Flow with Proof Key for Code Exchange (PKCE), `state` and `nonce` — checks follow [OpenID Connect Core 1.0 §3.1.3.7 ID Token Validation](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation) and [RFC 9700 OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/rfc9700) (ตรวจ 22 ต.ค. 2569). Token verification uses [`jose`](https://github.com/panva/jose).

```typescript
import crypto from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const random = () => crypto.randomBytes(32).toString('base64url');

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

async function login(req, res) {
  const codeVerifier = random();
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  const state = random();
  const nonce = random();

  // Keep all of it server-side for the callback
  req.session.oidc = { codeVerifier, state, nonce, tenantId: customer.tenantId };

  const authUrl = new URL(customer.idp.authEndpoint);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', customer.idp.clientId);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('nonce', nonce);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  res.redirect(authUrl.toString());
}

async function callback(req, res) {
  const saved = req.session.oidc;
  delete req.session.oidc; // single use
  const { code, state } = req.query;

  // Missing state or missing session must fail (undefined === undefined would pass)
  if (!saved || typeof code !== 'string' || typeof state !== 'string'
      || !safeEqual(state, saved.state)) {
    return res.status(400).end();
  }
  const customer = await getCustomer(saved.tenantId);

  const tokenResponse = await fetch(customer.idp.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // confidential client: client_secret_basic
      Authorization: 'Basic ' + Buffer.from(
        `${encodeURIComponent(customer.idp.clientId)}:${encodeURIComponent(customer.idp.clientSecret)}`,
      ).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: saved.codeVerifier,
    }),
  });
  if (!tokenResponse.ok) return res.status(401).end();
  const { id_token } = await tokenResponse.json();

  // Verify signature (IdP JWKS) + iss + aud + exp/nbf, then nonce
  const jwks = createRemoteJWKSet(new URL(customer.idp.jwksUri)); // cache one per IdP
  const { payload: claims } = await jwtVerify(id_token, jwks, {
    issuer: customer.idp.issuer,     // exact issuer from the IdP discovery document
    audience: customer.idp.clientId, // aud must contain our client_id
    algorithms: ['RS256', 'ES256'],  // what this IdP actually uses
  });
  if (typeof claims.nonce !== 'string' || !safeEqual(claims.nonce, saved.nonce)) {
    return res.status(401).end();
  }

  // Provision/login — tenant comes from the saved session, never from the query string
  const user = await provisionUserFromOIDC(saved.tenantId, claims);
  // ... regenerate the session id, then create the logged-in session
}
```

## SCIM v2.0 Implementation

```typescript
// CRUD endpoints for User + Group resources
app.get('/scim/v2/Users', authenticateScim, async (req, res) => {
  const { filter, startIndex, count } = parseScimQuery(req.query);

  const users = await db.users.find({
    tenant_id: req.tenant.id,
    filter,
    limit: count,
    offset: startIndex - 1,
  });

  res.json({
    schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
    totalResults: await db.users.count({ tenant_id: req.tenant.id }),
    Resources: users.map(toScimUser),
    startIndex,
    itemsPerPage: count,
  });
});

app.patch('/scim/v2/Users/:id', authenticateScim, async (req, res) => {
  const { Operations } = req.body;
  const where = { id: req.params.id, tenant_id: req.tenant.id }; // every lookup scoped to the tenant

  const existing = await db.users.findOne(where);
  if (!existing) {
    return res.status(404).json({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
      status: '404',
      detail: 'User not found',
    });
  }

  for (const op of Operations) {
    // op names are case-insensitive (some IdPs send "Replace")
    if (op.op?.toLowerCase() === 'replace' && op.path === 'active' && op.value === false) {
      await deactivateUser(req.params.id, req.tenant.id);
    }
  }

  const updated = await db.users.findOne(where);
  res.json(toScimUser(updated));
});
```

## Webhook Patterns (Outbound)

### Signed Delivery

```typescript
async function deliverWebhook(webhook: WebhookSubscription, event: Event) {
  const body = JSON.stringify({
    id: event.id,
    type: event.type,
    timestamp: event.timestamp,
    data: event.data,
  });

  const timestamp = Date.now().toString();
  const signature = hmac('sha256', webhook.secret, `${timestamp}.${body}`);

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Id': event.id,
        'X-Webhook-Timestamp': timestamp,
        'X-Webhook-Signature': `t=${timestamp},v1=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });

    await logDelivery(webhook, event, response);

    if (!response.ok) {
      await scheduleRetry(webhook, event, response.status);
    }
  } catch (err) {
    await scheduleRetry(webhook, event, err);
  }
}
```

### Retry Strategy

```typescript
const RETRY_DELAYS_MS = [
  0,           // immediate
  60_000,      // 1 min
  300_000,     // 5 min
  900_000,     // 15 min
  3_600_000,   // 1 hour
  14_400_000,  // 4 hour
  43_200_000,  // 12 hour
];

async function scheduleRetry(webhook, event, error) {
  const attempt = await db.deliveries.getAttempt(webhook.id, event.id);

  if (attempt >= RETRY_DELAYS_MS.length) {
    await markWebhookFailing(webhook);
    return;
  }

  await queue.scheduleIn(RETRY_DELAYS_MS[attempt], 'deliver', {
    webhook_id: webhook.id,
    event_id: event.id,
  });
}
```

## Webhook Patterns (Inbound)

```typescript
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // 1. Verify signature
  const signature = req.headers['x-signature'];
  const computed = hmac('sha256', SECRET, req.body);
  if (!constantTimeEquals(signature, computed)) {
    return res.status(401).end();
  }

  // 2. Parse
  const event = JSON.parse(req.body);

  // 3. Idempotency check
  if (await db.processedEvents.exists(event.id)) {
    return res.json({ received: true, duplicate: true });
  }

  // 4. Persist raw + ack quickly
  await db.events.create({ id: event.id, raw: event });
  res.json({ received: true });

  // 5. Process async
  await queue.enqueue('process_event', event.id);
});
```

## iPaaS Integration

```typescript
// Provide pre-built connectors for popular iPaaS:

// Zapier Trigger (POST when event happens)
async function fireZapierTrigger(triggerKey: string, event: any) {
  const webhookUrls = await db.zapierTriggers.findActive(
    customer.tenant_id,
    triggerKey
  );

  await Promise.all(
    webhookUrls.map(url => fetch(url, {
      method: 'POST',
      body: JSON.stringify(event),
    }))
  );
}

// Zapier Action (called by Zapier to do something)
app.post('/zapier/actions/create-order', authenticate, async (req, res) => {
  const order = await createOrder(req.tenant.id, req.body);
  res.json(order);
});
```

## API Client Best Practices

```typescript
class SalesforceClient {
  constructor(private creds: SalesforceCredentials, private tenantId: string) {}

  async request(method: string, path: string, body?: any) {
    const headers = {
      'Authorization': `Bearer ${await this.getAccessToken()}`,
      'Content-Type': 'application/json',
    };

    return retry({
      attempts: 3,
      backoff: 'exponential',
      retryOn: [502, 503, 504, 'ECONNRESET'],
    }, async () => {
      const response = await fetch(`${this.creds.instance}/services/data/v60/${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(30_000),
      });

      // Instrument
      metrics.timing('salesforce.request', response.duration, {
        path, status: response.status, tenant: this.tenantId
      });

      if (response.status === 401) {
        // Token expired, refresh
        await this.refreshToken();
        throw new RetryableError('Token expired');
      }

      if (!response.ok) {
        throw new SalesforceError(response);
      }

      return response.json();
    });
  }
}
```

## Things You Don't Do

- Trust a SAML or OIDC response without checking its signature, issuer, audience, expiry and (OIDC) `state` + `nonce`
- Compare signatures, `state` or `nonce` with `===` / `!==` — use a constant-time compare
- Deliver webhooks to the customer synchronously
- Retry only once
- Process inbound webhooks without an idempotency check
- Hardcode customer credentials
- Ignore the partner's rate limits

## Reference

- [SAML 2.0 Specification](https://docs.oasis-open.org/security/saml/v2.0/)
- [OpenID Connect Spec](https://openid.net/connect/)
- [SCIM 2.0 RFC](https://datatracker.ietf.org/doc/html/rfc7644)
- [WorkOS Integration Patterns](https://workos.com/docs)
- [Standard Webhooks](https://standardwebhooks.com/)


## reference: multi-tenancy-patterns.md

> เดิมชื่อ multi-tenancy-patterns (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-saas-b2b` — รวมเข้า `saas-platform` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Tenancy Model Selection](#tenancy-model-selection)
- [Row-Level Multi-Tenancy](#row-level-multi-tenancy)
- [Tenant Context Propagation](#tenant-context-propagation)
- [Schema-Per-Tenant](#schema-per-tenant)
- [Database-Per-Tenant](#database-per-tenant)
- [Noisy Neighbor Mitigation](#noisy-neighbor-mitigation)
- [Per-Tenant Feature Flags](#per-tenant-feature-flags)
- [Caching With Tenants](#caching-with-tenants)
- [Background Jobs](#background-jobs)
- [Tenant Offboarding](#tenant-offboarding)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

# Multi-Tenancy Implementation Patterns

## When to use this skill

- Building a SaaS product from scratch
- Adding tenants to an existing single-tenant app
- Refactoring for better isolation between tenants
- Designing per-tenant features
- Stopping one busy tenant from slowing the others (noisy neighbor)

## Tenancy Model Selection

```
Strict isolation required (regulated)?
├─ Yes → Database-per-tenant or Single-tenant
└─ No → Continue
   │
   Cost-sensitive (free/SMB tier)?
   ├─ Yes → Pool (shared everything)
   └─ No → Consider Silo (shared compute, isolated data)
```

## Row-Level Multi-Tenancy

### Schema
```sql
-- Every business table has tenant_id
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    total NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Composite index includes tenant
CREATE INDEX idx_orders_tenant_customer ON orders (tenant_id, customer_id);

-- Foreign keys preserve tenant
ALTER TABLE orders ADD CONSTRAINT fk_customer
    FOREIGN KEY (tenant_id, customer_id) REFERENCES customers (tenant_id, id);
```

### Postgres Row-Level Security
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- Table owners skip RLS unless FORCE is set
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON orders
    FOR ALL
    USING      (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
-- no tenant set → NULL → no rows (fails closed)

-- The app connects as its own role: not the table owner, not superuser, no BYPASSRLS
CREATE ROLE app_user LOGIN NOSUPERUSER NOBYPASSRLS;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO app_user;
```

กฎที่ต้องถูกทุกข้อ (ที่มา [PostgreSQL — Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) · [SET](https://www.postgresql.org/docs/current/sql-set.html) · ตรวจ 22 ต.ค. 2569)

- เจ้าของตารางข้าม RLS ถ้าไม่ได้ `FORCE ROW LEVEL SECURITY` · superuser และ role ที่มี `BYPASSRLS` ข้ามเสมอ → แอปต้องใช้ role แยก
- `SET LOCAL` นอก transaction "emits a warning and otherwise has no effect" → ตั้งค่าภายใน `BEGIN … COMMIT` เท่านั้น
- `SET` (ไม่มี LOCAL) ติดไปทั้ง session → connection ที่คืนเข้า pool จะพา tenant เดิมไปให้ request ถัดไป ห้ามใช้
- ห้ามต่อ string tenant id เข้า SQL — ส่งเป็น parameter (`$1`) ผ่าน `set_config(name, value, true)` (`true` = มีผลเฉพาะ transaction นี้)

### Application Enforcement (defense in depth)
```typescript
// Repository pattern with mandatory tenant
class OrderRepository {
  // client = the transaction client from withTenant() below
  constructor(private client: PoolClient, private tenantId: string) {}

  findAll() {
    return this.client.query(
      'SELECT * FROM orders WHERE tenant_id = $1',
      [this.tenantId],
    );
  }

  // No method exists that DOESN'T filter by tenant
}
```

## Tenant Context Propagation

### Pattern: Middleware Sets Context, One Transaction per Request

Middleware only reads the tenant from a verified token. The database context is set inside the same transaction, on the same pooled client, that runs the queries (node-postgres `pg`).

```typescript
import { Pool, PoolClient } from 'pg';
const pool = new Pool(); // connects as app_user (not table owner)

app.use(async (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer /, '');
  if (!token) return res.status(401).end();
  const claims = await verifyJWT(token); // checks signature, iss, aud, exp
  if (!claims.tenant_id) return res.status(401).end();

  req.tenant = {
    id: claims.tenant_id,
    tier: claims.tier,
    features: await loadFeatures(claims.tenant_id),
  };
  next();
});

// Every DB call goes through this: BEGIN → set tenant (local) → work → COMMIT
async function withTenant<T>(tenantId: string, fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result; // setting is gone once the transaction ends
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Usage in a handler
app.get('/orders', async (req, res) => {
  const rows = await withTenant(req.tenant.id, (c) =>
    new OrderRepository(c, req.tenant.id).findAll());
  res.json(rows.rows);
});
```

### Pattern: Tenant in Async Context

```typescript
import { AsyncLocalStorage } from 'async_hooks';

const tenantStorage = new AsyncLocalStorage<TenantContext>();

// Set at request entry
tenantStorage.run({ id: tenantId }, async () => {
  await processRequest();
});

// Access anywhere in async chain
function getTenantId(): string {
  return tenantStorage.getStore()?.id ?? throwError();
}
```

## Schema-Per-Tenant

```sql
-- One schema per tenant
CREATE SCHEMA tenant_abc;
CREATE SCHEMA tenant_xyz;

-- Tables in tenant schema
CREATE TABLE tenant_abc.orders (...);
CREATE TABLE tenant_xyz.orders (...);

-- search_path only inside a transaction (SET LOCAL), never plain SET on a pooled connection
BEGIN;
SET LOCAL search_path TO tenant_abc;
-- ... queries ...
COMMIT;
```

```typescript
// Schema name comes from your tenant registry, never from user input
async function withTenantSchema<T>(tenantId: string, fn: (c: PoolClient) => Promise<T>) {
  const schema = await lookupTenantSchema(tenantId); // e.g. 'tenant_abc'
  if (!/^tenant_[a-z0-9_]{1,40}$/.test(schema)) throw new Error('bad schema name');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // local = true → resets at COMMIT/ROLLBACK, so the pooled connection is clean
    await client.query("SELECT set_config('search_path', $1, true)", [schema]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
// Alternative: one small pool per tenant with search_path fixed at connect time:
// new Pool({ options: `-c search_path=${schema}` })  (schema validated as above)
```

### Migrations
```python
# Apply migration to all tenant schemas
async def migrate_all_tenants():
    tenants = await get_active_tenants()

    for tenant in tenants:
        try:
            await run_migration(tenant.schema)
        except MigrationError as e:
            await mark_tenant_migration_failed(tenant, e)
            continue
```

## Database-Per-Tenant

```typescript
// Tenant routing layer
async function getDb(tenantId: string): Promise<DbClient> {
  const tenant = await tenantCache.get(tenantId);
  return dbPool.connect(tenant.dbConnectionString);
}

// Usage
const db = await getDb(req.tenant.id);
await db.query(`SELECT * FROM orders`);  // tenant_id NOT needed in WHERE
```

### Tenant Provisioning
```python
import re

async def provision_tenant(tenant_id: str, region: str):
    # Create DB — identifiers can't be bound as parameters, so validate then quote
    if not re.fullmatch(r'[a-z0-9_]{1,40}', tenant_id):
        raise ValueError('bad tenant id')
    db_name = f'tenant_{tenant_id}'
    await admin_db.query(f'CREATE DATABASE "{db_name}"')

    # Run migrations
    await run_migrations(db_name)

    # Seed initial data
    await seed_tenant(db_name, tenant_id)

    # Register in tenant routing table
    await save_tenant_routing({
        'id': tenant_id,
        'db_host': pick_db_host(region),
        'db_name': db_name,
    })
```

## Noisy Neighbor Mitigation

### Rate Limiting Per Tenant

```typescript
// Distributed rate limiter (Redis)
async function rateLimit(req) {
  const limit = req.tenant.tier === 'enterprise' ? 10000 : 100;
  // Fixed 1-minute window; the window number is part of the key
  const window = Math.floor(Date.now() / 60_000);
  const key = `rate:${req.tenant.id}:${window}`;

  // MULTI/EXEC (ioredis): INCR and EXPIRE apply together — no key left without a TTL
  const results = await redis.multi().incr(key).expire(key, 60).exec();
  const count = Number(results?.[0]?.[1]);

  if (count > limit) {
    throw new RateLimitError({ retryAfter: 60 });
  }
}
```

### Connection Pool Per Tenant Group

```typescript
// Tier-based pools
const pools = {
  free: new ConnectionPool({ max: 5 }),
  pro: new ConnectionPool({ max: 20 }),
  enterprise: new ConnectionPool({ max: 100 }),
};

async function query(tenantId: string, sql: string) {
  const tier = await getTier(tenantId);
  return pools[tier].query(sql);
}
```

### Query Cost Limits

```typescript
// Kill slow queries per tenant
async function queryWithBudget(tenantId: string, sql: string) {
  const budget = tierLimits[await getTier(tenantId)].queryMs;

  return await db.query(sql, { timeout: budget });
}
```

## Per-Tenant Feature Flags

```typescript
// Feature config per tenant
interface TenantFeatures {
  advanced_analytics: boolean;
  api_rate_limit: number;
  custom_branding: boolean;
  sso: boolean;
}

// Read from config
function hasFeature(tenant: Tenant, feature: keyof TenantFeatures) {
  return tenant.features[feature];
}

// Use in code
if (hasFeature(req.tenant, 'advanced_analytics')) {
  // ...
}
```

## Caching With Tenants

```typescript
// MUST key by tenant
const cacheKey = `tenant:${tenantId}:order:${orderId}`;
await cache.set(cacheKey, order);

// Wrong: NEVER share cache across tenants
const cacheKey = `order:${orderId}`;  // BAD
```

## Background Jobs

```typescript
// Include tenant in job payload
await queue.enqueue('process_export', {
  tenantId: req.tenant.id,
  exportId,
});

// Worker re-establishes tenant context
async function processExport(job) {
  const { tenantId, exportId } = job.data;
  await tenantStorage.run({ id: tenantId }, async () => {
    await doExport(exportId);
  });
}
```

## Tenant Offboarding

```python
async def offboard_tenant(tenant_id):
    # 1. Disable access
    await disable_tenant_access(tenant_id)

    # 2. Schedule deletion (grace period for accidental)
    await schedule_deletion(tenant_id, days=30)

    # 3. After grace period, delete from all systems
    async def delete():
        await delete_from_db(tenant_id)
        await delete_from_search(tenant_id)
        await delete_from_blob_storage(tenant_id)
        await delete_from_cache(tenant_id)
        await delete_backups(tenant_id, retain_for=legal_minimum)

    # 4. Provide attestation
    await issue_deletion_certificate(tenant_id)
```

## Common Pitfalls

- Wrong: **Missing tenant_id in queries** — data leaks and nobody notices
- Wrong: **Shared cache without a tenant key** — one tenant sees another's data
- Wrong: **Background jobs without the tenant** — the job runs as the wrong tenant
- Wrong: **No rate limit per tenant** — one tenant slows everyone down
- Wrong: **Hardcoded tenant assumptions** — breaks as soon as a tenant differs from the first one
- Wrong: **Per-tenant migrations not tested** — surprises in production

## Reference

- [AWS SaaS Lens](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/)
- [Building Multi-Tenant SaaS Architectures (book)](https://www.oreilly.com/library/view/building-multi-tenant-saas/9781098140632/)
- [Stripe's Multi-Tenant Sharding](https://stripe.com/blog/online-migrations)
- [PostgreSQL Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)


## reference: subscription-billing.md

> เดิมชื่อ subscription-billing (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-saas-b2b` — รวมเข้า `saas-platform` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Choose Tool, Don't Build](#choose-tool-dont-build)
- [Pricing Model Implementation](#pricing-model-implementation)
- [Usage Metering Pipeline](#usage-metering-pipeline)
- [Dunning Workflow](#dunning-workflow)
- [Revenue Recognition (ASC 606)](#revenue-recognition-asc-606)
- [MRR / ARR Calculation](#mrr--arr-calculation)
- [Multi-Currency](#multi-currency)
- [Proration](#proration)
- [Trial Patterns](#trial-patterns)
- [Webhook Events to Handle](#webhook-events-to-handle)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# Subscription Billing Patterns

## When to use this skill

- Setting up a new billing system
- Adding usage-based pricing
- Building dunning workflows (chasing failed payments)
- Recognizing revenue for accounting
- Billing in several currencies or tax jurisdictions
- Moving from one billing platform to another

## Choose Tool, Don't Build

```
Stripe Billing       — modern, easy, $$$
Chargebee            — flexible, mid-market
Maxio                — B2B SaaS specialist
Recurly              — mature
Paddle / Lemon Squeezy — Merchant of Record (global tax done)
Custom               — only for special needs
```

> 💡 **Never** build the billing basics yourself. Use a platform.

## Pricing Model Implementation

### Flat Subscription

```typescript
// Simple: one plan, fixed price
await stripe.subscriptions.create({
  customer: customer.stripeId,
  items: [{ price: 'price_pro_monthly' }],
});
```

### Per-Seat

```typescript
// Quantity = active users
async function syncSeats(subscription_id: string, accountId: string) {
  const activeUsers = await countActiveUsers(accountId);

  await stripe.subscriptionItems.update(itemId, {
    quantity: activeUsers,
    proration_behavior: 'create_prorations',
  });
}
```

### Usage-Based

Stripe Billing Meters. Legacy usage records (`createUsageRecord` / `usage_records.create`) were removed in API version `2025-03-31.basil`, and a `metered` price now needs a `meter` — ที่มา [Stripe changelog: Removes legacy usage-based billing](https://docs.stripe.com/changelog/basil/2025-03-31/deprecate-legacy-usage-based-billing) · [Create a billing meter event](https://docs.stripe.com/api/billing/meter-event/create) (ตรวจ 22 ต.ค. 2569)

```typescript
// Once: a meter, and a metered price that points to it
const meter = await stripe.billing.meters.create({
  display_name: 'API calls',
  event_name: 'api_calls',
  default_aggregation: { formula: 'sum' },
});
const price = await stripe.prices.create({
  product: 'prod_api_calls',
  currency: 'usd',
  unit_amount_decimal: '0.5', // 0.5 cent = $0.005 per call (amounts are in minor units)
  recurring: { interval: 'month', usage_type: 'metered', meter: meter.id },
});

// Each usage report: a meter event for the customer
async function reportUsage(stripeCustomerId: string, units: number, eventId: string) {
  await stripe.billing.meterEvents.create({
    event_name: 'api_calls',
    payload: { stripe_customer_id: stripeCustomerId, value: String(units) },
    identifier: eventId, // Stripe dedups the same identifier for at least 24 h
    timestamp: Math.floor(Date.now() / 1000), // must be within the past 35 days
  });
}

// Customer gets billed at end of period
```

### Tiered (Volume Pricing)

```typescript
// Stripe handles via "tiered" price model
// unit_amount is an integer in minor units (cents) — fractions go in unit_amount_decimal
const price = await stripe.prices.create({
  product: 'prod_api_calls',
  currency: 'usd',
  recurring: { interval: 'month', usage_type: 'metered', meter: meter.id },
  billing_scheme: 'tiered',
  tiers_mode: 'graduated',
  tiers: [
    { up_to: 10000,  unit_amount: 0 },               // first 10k free
    { up_to: 100000, unit_amount: 1 },               // next 90k @ $0.01
    { up_to: 'inf',  unit_amount_decimal: '0.5' },   // beyond @ $0.005
  ],
});
```

## Usage Metering Pipeline

```mermaid
flowchart LR
    A[App emits event] --> B[Event Stream Kafka/Kinesis]
    B --> C[Aggregator]
    C --> D[(Aggregated Usage Table)]
    D --> E[Bill Calculator]
    E --> F[Billing System Stripe/Chargebee]
    F --> G[Invoice]
```

### Idempotent Reporting

```python
async def report_usage_idempotent(account_id, event):
    # Dedup key
    dedup_key = f"{account_id}:{event.timestamp}:{event.id}"

    if await db.usage_reported.exists(dedup_key):
        return  # already reported

    # Stripe also dedups by identifier, but only for a rolling >= 24 h — keep our own check
    await stripe.billing.MeterEvent.create_async(
        event_name='api_calls',
        payload={
            'stripe_customer_id': event.stripe_customer_id,
            'value': str(event.quantity),
        },
        identifier=event.id,
        timestamp=event.timestamp,
    )

    await db.usage_reported.create({dedup_key})
```

## Dunning Workflow

```typescript
// Stripe handles retries by default
// But you should override for customer experience

const subscription = await stripe.subscriptions.create({
  customer,
  items,
  payment_settings: {
    payment_method_types: ['card'],
    save_default_payment_method: 'on_subscription',
  },
  collection_method: 'charge_automatically',
});

// Retry schedule lives in Dashboard → Billing → Revenue recovery → Retries
// Smart Retries: "The recommended default setting is 8 tries within 2 weeks"
// (choose 1 week – 2 months); custom schedule = up to 3 retries
// ที่มา docs.stripe.com/billing/revenue-recovery/smart-retries (ตรวจ 22 ต.ค. 2569)

// Listen for events:
//   invoice.payment_failed → email customer
//   customer.subscription.paused → restrict features
//   customer.subscription.deleted → final action
```

The retry count and timing belong to the payment processor's setting (Stripe: Smart Retries or a custom schedule, set per account, can differ per customer segment with automations). The app does not assume a fixed number of retries: it reads `invoice.attempt_count` from each `invoice.payment_failed` event and escalates one step, and treats "no `next_payment_attempt`" as the last try:

```
Fail 1 → email the customer (update card link)
Fail 2 → email + restrict paid features
Fail 3 → email + escalate to account owner / CS
Last   → cancel subscription + email
Grace period → delete data per the retention policy
```

Recovery-rate target: (รอยืนยัน · 2026-10-14) — track it monthly; do not quote a number without your own data.

### Dunning Communications

```python
async def handle_payment_failed(event):
    invoice = event['data']['object']
    attempt = invoice['attempt_count']

    customer = await get_customer(invoice['customer'])

    if attempt == 1:
        await send_email(customer, 'payment_failed_first', {
            'invoice_url': invoice['hosted_invoice_url'],
            'amount': invoice['amount_due'] / 100,
        })
    elif attempt == 2:
        await send_email(customer, 'payment_failed_second', ...)
        await restrict_advanced_features(customer)
    elif attempt >= 3:
        await send_email(customer, 'payment_failed_third_final_warning', ...)
        await alert_cs_team(customer)

    if invoice.get('next_payment_attempt') is None:
        # last try failed — Stripe now applies your "after all retries" setting
        # (cancel / unpaid / past_due / pause)
        await send_email(customer, 'payment_failed_final', ...)
    # with Billing automations, next_payment_attempt is set on invoice.updated instead
```

## Revenue Recognition (ASC 606)

One convention everywhere: `start_date` and `end_date` are `DATE`, the service period is **[start_date, end_date)** — `end_date` is the first day *after* service (a 1-month plan from 1 Jan has `end_date` 1 Feb). The period has `end_date - start_date` days. This is the only copy of this query; other files link here.

```sql
-- Daily revenue recognition for subscriptions (safe to re-run)
INSERT INTO daily_recognized_revenue (subscription_id, account_id, date, daily_revenue, type)
SELECT
    sub.id,
    sub.account_id,
    d::date AS date,
    sub.amount::numeric / (sub.end_date - sub.start_date) AS daily_revenue, -- DATE - DATE = days
    'subscription' AS type
FROM subscriptions sub
CROSS JOIN LATERAL generate_series(
    sub.start_date,
    LEAST(sub.end_date - 1, current_date),  -- last service day = end_date - 1
    interval '1 day'
) d
WHERE sub.start_date <= current_date
ON CONFLICT (subscription_id, date) DO NOTHING;  -- needs UNIQUE (subscription_id, date)
```

## MRR / ARR Calculation

```sql
-- MRR at any point in time
SELECT SUM(
  CASE plan_interval
    WHEN 'month' THEN plan_amount
    WHEN 'year'  THEN plan_amount / 12
  END
) as mrr
FROM subscriptions
WHERE status = 'active'
  AND started_at <= NOW()
  AND (canceled_at IS NULL OR canceled_at > NOW());

-- MRR movement (cohort waterfall)
WITH current_mrr AS (SELECT SUM(mrr) as v FROM active_subs WHERE date = '2025-02-01'),
     prior_mrr   AS (SELECT SUM(mrr) as v FROM active_subs WHERE date = '2025-01-01'),
     new_mrr     AS (SELECT SUM(mrr) FROM new_subs_in_month),
     expansion   AS (SELECT SUM(mrr_diff) FROM upgrades_in_month),
     contraction AS (SELECT SUM(mrr_diff) FROM downgrades_in_month),
     churn       AS (SELECT SUM(mrr) FROM cancellations_in_month)
SELECT
  prior_mrr.v as start,
  new_mrr.v as new,
  expansion.v as expansion,
  contraction.v as contraction,
  churn.v as churn,
  current_mrr.v as end
FROM prior_mrr, new_mrr, expansion, contraction, churn, current_mrr;
```

## Multi-Currency

```typescript
// Customer's currency at signup
const customer = await stripe.customers.create({
  email,
  currency: 'thb',  // locked at creation in most platforms
});

// Pricing strategy:
// Option 1: Price in customer currency (FX risk on you)
// Option 2: Price in USD, charge in local (uses Stripe FX)
// Option 3: Per-region pricing (different prices per market)

// Tax considerations vary
// Use Stripe Tax or Avalara for compliance
```

## Proration

```typescript
// Mid-cycle plan change
await stripe.subscriptions.update(subscription_id, {
  items: [{ id: itemId, price: 'price_new_plan' }],
  proration_behavior: 'create_prorations',
});

// Stripe calculates:
// - Credit for unused time on old plan
// - Charge for partial time on new plan
// - Net difference on next invoice (or immediate)
```

## Trial Patterns

```typescript
// Free trial
await stripe.subscriptions.create({
  customer,
  items: [{ price }],
  trial_period_days: 14,
  payment_settings: {
    payment_method_types: ['card'],
    save_default_payment_method: 'on_subscription',
  },
});

// Convert (event: trial_will_end → trial_end)
// If no card on file: subscription becomes 'past_due'
```

## Webhook Events to Handle

| Event | Action |
|-------|--------|
| `customer.subscription.created` | Activate features |
| `invoice.payment_succeeded` | Mark paid, recognize revenue |
| `invoice.payment_failed` | Dunning workflow |
| `customer.subscription.updated` | Sync plan changes |
| `customer.subscription.deleted` | Deactivate, schedule data deletion |
| `customer.subscription.trial_will_end` | Trial ending notification |

## Things You Don't Do

- Build your own billing engine
- Calculate tax manually
- Trust prices the client sends
- Skip the idempotency check on webhooks
- Recognize revenue when you send the invoice (recognize it over the service period)
- Store money as a float

## Reference

- [Stripe Billing Docs](https://stripe.com/docs/billing)
- [ASC 606 Revenue Recognition Guide](https://www.investopedia.com/terms/a/asc-606.asp)
- [Chargebee Knowledge Base](https://www.chargebee.com/docs/)
- [Paddle Documentation](https://developer.paddle.com/)
- [Maxio (Chargify) Docs](https://maxio.com/docs)


---

# skill: simplicity-first

Use when shaping a software BRD, SRS, FSD, ADR, architecture or roadmap to fewest parts. Code → lazy-coding; other → simplify.

# Simplicity First

> The best architecture has the fewest moving parts. The best plan is the one a
> teammate can follow with no context.

This skill covers **non-code outputs** — documents, plans, architecture, and
designs. For code, use `lazy-coding`. The suite-wide rule for every kind of work is `simplify`; this skill is its detail for documents, plans and architecture.

## Check before submitting — 5 items

1. **A tired teammate gets it** in 6 months with no prior context.
2. **Simplest thing that works** — fewest moving parts, boring proven patterns; add complexity only when something breaks.
3. **Every new component, option or layer has evidence it is needed now**, and leaving it out would cost something real.
4. **Nothing can be deleted without losing meaning** — deleting beats adding.
5. **Reads in one pass** — no jargon the audience lacks, an example for every abstract claim, the whole thing fits in two sentences.

Any "no" or "not sure" → simplify before delivering.

## By output type

### Documents (BRD, FSD, ADR)

Business Requirements Document (BRD) · Software Requirements Specification (SRS) · Functional Specification Document (FSD) · Architecture Decision Record (ADR).

Do: short sentences (≤ 20 words), plain English, one idea per paragraph, an
example for every abstract point, tables for structured data.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy"), undefined
jargon, walls of text, hedging ("might possibly potentially"), acronym soup.

### Architecture

Do: monolith first (split only when a bottleneck is proven), familiar stack,
standard patterns (Representational State Transfer (REST), queues, caches), single source of truth per data type.

Avoid: microservices for small teams, distributed-everything, multi-master
databases before you must, event-driven by default (sync is simpler).

### Plans

Do: 3-5 priorities (not 20), a named owner per item, measurable success
criteria, realistic timelines with buffer, cut scope to fit time.

Avoid: vague goals ("improve quality"), 50-item lists (= no priority),
aspirational dates with no buffer, plans without success metrics.

### Designs (user experience (UX), application programming interface (API))

Do: fewest steps to the user's goal, reuse existing patterns, stay consistent
across screens, defaults that work for 80%, progressive disclosure.

Avoid: novel interactions where a standard one works, 10-step flows when 3
work, required fields with no smart default, hidden features needing tutorials.

## Examples

**API description**

Wrong: "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

Right: "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

Wrong: "Improve overall product quality and customer satisfaction through various
initiatives."

Right: "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

Wrong: "Event-sourced microservice with Command Query Responsibility Segregation (CQRS), Kafka ingestion, Redis cache, and a
dedicated auth service."

Right: "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

## Anti-patterns to reject

- **Future-proofing** — abstractions for needs that never arrive.
- **"It might scale"** — infra for 1M users while you have 1k.
- **Layer cake** — 6 layers where 90% just pass through.
- **Resume-driven design** — fancy tech to look sophisticated.
- **Buzzword stacking** — "cloud-native event-driven AI-powered".


---

# skill: markdown-visuals

Use when a markdown doc needs a picture. Pick inline SVG, image file, ASCII or Mermaid by where it is read (GitHub drops inline SVG).

# Markdown Visuals

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (plugin `software-company`) (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every plan, process, design, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — sketch, flow or state in a business plan, report, process guide, spec or README
- Writing a plan, Functional Specification Document (FSD), Business Requirements Document (BRD), Architecture Decision Record (ADR) or architecture doc that describes layout, flow, or relationships (the diagrams themselves follow the routing rule below)
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) (plugin `software-company`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` (plugin `software-company`) → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG (doc read on GitHub → same SVG as a `.svg` file, §2)
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / process / money flow / decision   →  repo note (README · Pull Request (PR) · code note) → Mermaid (`software-diagrams`, plugin `software-company`)
│                                              project document (BRD · Software Requirements Specification (SRS) · FSD · ADR) or read outside the team → `diagram-figures`
├─ Architecture / Entity-Relationship (ER) / class → same rule as the line above
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design (plugin `software-company`) tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Routing rule (same in `software-diagrams` and `diagram-figures`):** markdown in a repo read by the team (README · PR · code note) → Mermaid via `software-diagrams` · a project document (BRD · SRS · FSD · ADR · ER · flows) or anything people outside the team read → `diagram-figures`.

**Follow the tree above.** Where the doc will be read decides inline SVG vs image file:

- **Inline `<svg>` renders** in VS Code preview, Obsidian, many static-site generators and chat replies.
- **Inline `<svg>` does not render on GitHub** — GitHub's sanitizer drops the `<svg>` element, so the reader sees nothing. Other hosts (GitLab, Bitbucket): preview before relying on it.
- **Doc will be read on GitHub** → save the SVG as `docs/figures/x.svg` and reference it with `![alt](figures/x.svg)` or `<img>` (§2). It still versions cleanly in git and stays editable.

## 1 · Inline SVG (for viewers that render it — not GitHub)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background = bg-canvas of the project palette (see สี below) -->
  <rect width="640" height="280" rx="14" fill="<bg-canvas>"/>

  <!-- content goes here -->
</svg>
</p>
```

**Required attributes:**
- `xmlns="http://www.w3.org/2000/svg"` — required when the same markup is saved as a `.svg` file (GitHub shows `.svg` files only through `![]()` / `<img>`, and only with `xmlns`)
- `viewBox` — sets the coordinate space; lets the SVG scale responsively
- `role="img"` + `aria-label` — accessibility, screen readers
- `<p align="center">` wrapper — centers in the rendered page

**Sizing:** Use `viewBox` (not width/height) so it scales. Common sizes:
- Sketch of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น ส่วนถ้ายังไม่มี ให้ค้นต้นแบบตาม `design-references` (plugin `superuser`) ประเภท `document` แล้วถอดสีจากงานที่เลือก · ค้นสดไม่ได้จึงใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม (ลำดับใน `diagram-figures` ข้อ 5 · ตารางโทนตามเนื้องาน [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) ส่วน token ตามหน้าที่ (`bg-canvas` · `accent-primary` · `state-*` …) ดูได้ใน [references/svg-snippets.md](references/svg-snippets.md) และ **1 เอกสารใช้ชุดสีเดียว**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](references/svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

## 2 · External image files

Use when:
- The doc will be read on GitHub (inline `<svg>` is dropped there) — save the SVG as a file
- Photo or screenshot
- Illustration too complex to author as SVG by hand (50+ shapes)
- Reusing the same image across many docs
- Generated by a design tool (Figma export, etc.)

### Folder convention

```
docs/
  figures/
    01-hover-state.svg
    02-empty-state.png
    architecture-overview.svg
    src/                      editable sources (.mmd · .drawio · .html)
```

- Put figures in `docs/figures/` (editable sources in `docs/figures/src/`) — relative to the doc · brand files (logo, icons) live in the project-root `assets/`, not here
- Name files `<doc-section-number>-<short-slug>.<ext>` so they sort with the doc
- Prefer `.svg` over `.png` when possible (scales, smaller, diff-friendly)

### Reference syntax

```markdown
![Hover state showing magnified Projects tile](figures/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="figures/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file in `docs/figures/`.

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](references/ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams` (plugin `software-company`) ข้อ 1–5 และ `assets/mermaid-theme.md`** · Mermaid ในเอกสารโปรเจกต์ที่ต้องแปลงเป็นรูปลง Word ใช้ตัวแปลงใน `diagram-figures` → `references/engine-mermaid.md`
ที่นี่บอกแค่ว่า *เมื่อไหร่ควรเลือก Mermaid แทนรูปแบบอื่น*

| เลือก Mermaid เมื่อ | เลือกอย่างอื่นเมื่อ |
|---|---|
| เป็นกล่องกับลูกศรที่เครื่องจัดวางให้ได้ | ถ้าต้องคุมตำแหน่งเองให้ใช้ inline SVG ส่วนรูปที่ต้องดูออกแบบมาให้ใช้ `diagram-figures` (HTML layout หรือ engine-svg-python) แล้วฝังเป็นไฟล์ภาพ |
| อยู่ในไฟล์ที่ต้อง diff ใน git | เป็นภาพหน้าจอจริง ให้ใช้ไฟล์ภาพ |
| ผู้อ่านเปิดใน GitHub หรือ Notion | ผู้อ่านเปิดในเอกสาร Word หรือสไลด์ ให้ใช้ไฟล์ภาพ |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](references/combining-formats.md). Don't force everything into one format.

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

## Anti-patterns

- **Text-only design docs** — "the icon is in the top-right" with no picture
- **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- **PNG screenshots of text** — use the text, in a code block
- **Inline `<svg>` in a doc read on GitHub** — GitHub drops it; save as `docs/figures/x.svg` and use `![alt](figures/x.svg)` · a `.svg` file without `xmlns` also fails
- **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- **ASCII art outside a code fence** — proportional fonts will mangle alignment
- **Mermaid syntax newer than the viewer** — GitHub's Mermaid version changes; check it with a ```` ```mermaid ```` block containing `info` before using new diagram types
- **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

## Quick-start recipe

When a markdown doc needs a design picture (clickable app screens go to the platform design skill, `mockup/<CODE>-mockup.html`):

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

Not sure a visual will render? Preview it in the viewer the reader will use (GitHub, Notion, VS Code) before delivery.

## Related skills

- `polished-document-style` — overall doc formatting, figure captions, callout boxes
- `simplicity-first` (plugin `software-company`) — don't over-design the diagram; show what's needed
- `software-diagrams` (plugin `software-company`) — which diagram type answers which question, plus the shared Mermaid theme
- `diagram-figures` — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- `ui-craft` (plugin `software-company`) — spacing, hierarchy and states when the picture is a screen

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้เลย ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](../SKILL.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

## Box-drawing characters

```
┌─────┐  ┏━━━━━┓  ╭─────╮  ┌╌╌╌╌╌┐
│     │  ┃     ┃  │     │  ╎     ╎
└─────┘  ┗━━━━━┛  ╰─────╯  └╌╌╌╌╌┘
 light    heavy   rounded   dashed
```

Corners: `┌ ┐ └ ┘` ‧ `┏ ┓ ┗ ┛` ‧ `╭ ╮ ╰ ╯`
Lines:   `─ │` ‧ `━ ┃` ‧ `═ ║`
Joins:   `├ ┤ ┬ ┴ ┼`
Arrows:  `→ ← ↑ ↓ ▲ ▼ ▶ ◀ ↔ ↕ ⇒ ⇐`
Dots:    `• · ◦ ● ○ ▪ ▫`

## Common patterns

**Layout sketch:**
```
┌─────────────────────────────────────┐
│ Header        [Search]      [👤]    │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main content             │
│  • Item  │                          │
│  • Item  │  ┌────────────────────┐  │
│          │  │  Primary CTA       │  │
│          │  └────────────────────┘  │
└──────────┴──────────────────────────┘
```

**State machine:**
```
┌─────────┐  hover  ┌──────────┐  click  ┌─────────┐
│  REST   │────────►│ MAGNIFIED│────────►│ LAUNCH  │
└─────────┘◄────────└──────────┘◄────────└─────────┘
            exit               done
```

**Curve / chart:**
```
scale
 ↑
1.7│         ╱╲
1.4│       ╱    ╲
1.2│     ╱        ╲
1.0│___╱            ╲___
   └──────────┬──────────→ cursor X
         tile.Center
```


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](../SKILL.md) · a full design spec usually mixes formats.

The 6-part pattern for a design spec:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't force everything into one format. Each format is best at something different.


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG pictures of a screen inside .md docs (the real mockup is HTML) · used by [SKILL.md](../SKILL.md) §1

## สี — มาจากเนื้องาน ไม่ใช่จากตารางสำเร็จรูป

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น
ถ้ายังไม่มี ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนจากเนื้องานไว้ในรายงาน — การแพทย์เขียว · การเงินน้ำเงินเข้ม ·
อุตสาหกรรมเหลืองอำพัน · ราชการกรมท่า · ซอฟต์แวร์ทั่วไปน้ำเงิน (ตารางเต็มอยู่ใน [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

กำหนดเป็น **token ตามหน้าที่** ไว้บนสุดของเอกสาร แล้วใช้ค่าเดียวกันทุกรูปในเอกสารนั้น:

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| `bg-canvas` | พื้นหลังของรูป | เฉดเข้มสุด (โหมดมืด) หรืออ่อนสุด (โหมดสว่าง) |
| `bg-surface` | แผ่น พาเนล การ์ด | ต่างจาก canvas พอให้เห็นขอบโดยไม่ต้องตีเส้น |
| `bg-elevated` | ไทล์ที่ลอยขึ้นมาอีกชั้น | |
| `accent-primary` | จุดเน้น สถานะที่กำลังทำงาน | **สีแบรนด์** (ไม่มี → `#2A78D6` + `(รอยืนยัน)`) |
| `text-primary` | ข้อความหลัก | contrast ≥ 4.5:1 กับพื้นที่มันวางอยู่ |
| `text-muted` | ข้อความรอง placeholder | `rgba(...,0.55)` ของ `text-primary` |
| `state-success` · `state-warning` · `state-danger` | สถานะ | **ไม่เปลี่ยนตามแบรนด์** — เขียวคือผ่าน แดงคือไม่ผ่านเสมอ |

**1 เอกสารใช้ชุดสีเดียว** — รูป 10 รูปในเอกสารเดียวที่สีไม่ตรงกัน อ่านยากกว่ารูปไม่สวยแต่สีตรงกัน

## Snippets

> ตัวอย่างข้างล่างใช้ชุดสีโหมดมืดชุดหนึ่งเป็นตัวแทนเท่านั้น
> **เปลี่ยนค่าสีให้ตรงกับชุดที่ตกลงไว้ก่อนใช้** โครงสร้างคือสิ่งที่ต้องคัดลอก ไม่ใช่ค่าสี

**Window chrome (desktop app mockup):**
```xml
<rect x="20" y="20" width="600" height="360" rx="10" fill="#2a3245"/>
<circle cx="42" cy="42" r="6" fill="#ff5f57"/>
<circle cx="62" cy="42" r="6" fill="#febc2e"/>
<circle cx="82" cy="42" r="6" fill="#28c940"/>
<text x="320" y="46" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Window title</text>
<line x1="20" y1="64" x2="620" y2="64" stroke="rgba(255,255,255,0.08)"/>
```

**Phone frame (mobile mockup):**
```xml
<rect x="100" y="20" width="200" height="400" rx="28" fill="#0a0d14" stroke="#2a3245" stroke-width="2"/>
<rect x="120" y="50" width="160" height="340" rx="6" fill="#1c2230"/>
<rect x="170" y="28" width="60" height="14" rx="7" fill="#0a0d14"/>
```

**Button:**
```xml
<rect x="40" y="100" width="120" height="40" rx="8" fill="#0078d4"/>
<text x="100" y="125" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="14" font-weight="500">Click me</text>
```

**Card with title and body:**
```xml
<rect x="40" y="40" width="240" height="120" rx="12" fill="#2a3245"/>
<text x="60" y="72" fill="#fff" font-family="system-ui" font-size="14" font-weight="600">Card title</text>
<text x="60" y="96" fill="rgba(255,255,255,0.7)" font-family="system-ui" font-size="12">Supporting body text goes here.</text>
<rect x="60" y="116" width="80" height="28" rx="6" fill="#0078d4"/>
<text x="100" y="134" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Action</text>
```

**Status badge (top-right of tile):**
```xml
<circle cx="<tile-right-x>" cy="<tile-top-y>" r="9" fill="#e24b4a"/>
<text x="<tile-right-x>" y="<tile-top-y + 4>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="13" font-weight="500">!</text>
```

**Running dot (indicator below tile):**
```xml
<circle cx="<tile-center-x>" cy="<tile-bottom-y + 12>" r="4" fill="#4cc2ff"/>
```

**Tooltip text (no balloon — plain floating text):**
```xml
<text x="<tile-center-x>" y="<tile-top-y - 12>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12" font-weight="500">Tooltip label</text>
```

## Worked example — UI state mockup

Use this pattern by default for showing UI feature states. On GitHub, save the SVG as a file in `docs/figures/` and reference it (inline `<svg>` is dropped there).


---

# skill: diagram-figures

Use when a document, plan, proposal, slide or print (business plan, shop process, budget flow, research, software spec) needs a designed diagram.

> **สีหลักของรูป = สีหลักของโปรเจกต์** · หาตามลำดับในข้อ 5 ถ้าหาไม่เจอเลยจึงใช้ชุดสีประจำบ้าน `#2A78D6` ใน `polished-document-style/references/theme-colors.md` ("ค่าตั้งต้นประจำบ้าน")

# Diagram Figures

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

skill นี้คือ house style เดียวของรูปที่ต้องดู "ออกแบบมา" ไม่ใช่ "generate มา" มี 3 engine ซึ่งใช้สี ไอคอน และกติกาชุดเดียวกัน

## เลือกทาง

| ต้องการ | ไปที่ |
|---|---|
| รูปในเอกสารงานใดก็ได้ (แผนธุรกิจ · ผังขั้นตอนของร้าน · ผังเงินครอบครัว · สรุปงานวิจัย · เอกสารซอฟต์แวร์ เช่น เอกสารความต้องการทางธุรกิจ (Business Requirements Document — BRD) · ข้อกำหนดความต้องการซอฟต์แวร์ (Software Requirements Specification — SRS) · ผังความสัมพันธ์ข้อมูล (Entity-Relationship — ER)) และรูปที่ต้องดูออกแบบมา สำหรับข้อเสนอลูกค้า · สไลด์ · งานพิมพ์ · เอกสารเซ็นรับ รวมถึงผังคลาวด์ที่ต้องมีโลโก้จริง | **skill นี้ — HTML layout engine** (ค่าเริ่มต้น · ข้อ 2) |
| รูปแบบเดียวกัน แต่ต้อง generate จากข้อมูลหรือโค้ด เช่น ออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือต้องคุมพิกัดบนกริดเอง | **skill นี้ — SVG/Python engine** ([references/engine-svg-python.md](references/engine-svg-python.md)) |
| บล็อก Mermaid หลายสิบบล็อก (sequence · state · ER · gantt) ที่ต้องส่งในไฟล์ Word หรือ Portable Document Format (PDF) ให้หน้าตาเหมือนรูปวาดมือ | **skill นี้ — Mermaid engine** ([references/engine-mermaid.md](references/engine-mermaid.md)) |
| ไดอะแกรมด่วนใน README · Pull Request · โน้ตในโค้ด (ไม่ใช่เอกสารโปรเจกต์) | `software-diagrams` (plugin `software-company`) (Mermaid ธีมประจำบ้าน · ถ้าเป็นผังคลาวด์ใน repo ที่ต้องมีโลโก้ ใช้ไลบรารี `diagrams` ใน skill เดียวกัน) |
| ตัดสินใจว่าจะฝังรูปในไฟล์ markdown แบบไหน (inline SVG · ไฟล์ภาพ · ASCII · Mermaid) | [`markdown-visuals`](../markdown-visuals/SKILL.md) |

**กติกาเลือกทาง (ตรงกับ `software-diagrams` และ `markdown-visuals`):** markdown ใน repo ที่ทีมอ่าน (README · Pull Request · โน้ตในโค้ด) → Mermaid ผ่าน `software-diagrams` · เอกสารโปรเจกต์ (BRD · SRS · Functional Specification Document (FSD) · Architecture Decision Record (ADR) · ER · ผังขั้นตอน) หรือของที่คนนอกทีมอ่าน → skill นี้

ต้นทุนของ skill นี้คือ **เวลา** เพราะ 1 รูปต้องแก้หลายรอบ
ดังนั้นให้ใช้กับรูปที่คนนอกทีมจะเห็น และเห็นซ้ำหลายครั้งเท่านั้น

## 1 · ตอบสามข้อก่อนเปิดไฟล์

1. **รูปนี้ไปอยู่ที่ไหน** — สไลด์ 16:9 · หน้า A4 · หน้าจอ
   แล้วกำหนด `.sheet{width:...}` ตามนั้น: สไลด์ 1600px · A4 แนวตั้ง 1240px · A4 แนวนอน 1750px
2. **ผู้อ่านคือใคร** — ถ้าเป็นลูกค้าที่ไม่ใช่ช่าง ให้เขียนชื่อกล่องเป็นภาษาไทย ส่วนทีมเทคนิคอ่านชื่อจริงของ service
3. **คำถามเดียวที่รูปนี้ตอบคืออะไร** — 1 รูปตอบ 1 คำถาม (กฎเดียวกับ `software-diagrams` (plugin `software-company`))

## 2 · เลือกโครง

มี 4 โครงในโฟลเดอร์ `assets/` ให้**คัดลอกไปแก้ อย่าเริ่มเขียนเอง** ส่วนรายละเอียดของแต่ละโครงอยู่ในไฟล์ที่ลิงก์ไว้

| คำถามที่รูปตอบ | โครง | รายละเอียด |
|---|---|---|
| "ระบบ ร้าน หรือองค์กรนี้คุยกับใครข้างนอกบ้าง" — ภาพรวมระดับบนสุด (ซอฟต์แวร์เรียก C4 model (Context · Containers · Components · Code) ระดับ 1) | [`figure-context.html`](assets/figure-context.html) | [layout-context.md](references/layout-context.md) |
| "ของจริงอยู่ตรงไหน มีอะไรอยู่ข้างใน" — ฝ่าย · สถานที่ · เครื่อง (ซอฟต์แวร์คือ deployment · container) | [`figure-template.html`](assets/figure-template.html) | [layout-deployment.md](references/layout-deployment.md) |
| "ใช้บริการอะไรของคลาวด์บ้าง" — ต้องมีโลโก้ Amazon Web Services (AWS) · Azure · Google Cloud ของจริง | [`figure-cloud.html`](assets/figure-cloud.html) | [layout-cloud.md](references/layout-cloud.md) |
| "ของ 1 ชิ้น (ข้อความ · คำสั่งซื้อ · เงิน) วิ่งผ่านอะไรบ้าง ตามลำดับไหน" — ผังมีเลขลำดับ ①–⑥ · ผู้ใช้ → ช่องทาง → ชั้นภายใน → บริการภายนอกและข้อมูล | [`figure-flow.html`](assets/figure-flow.html) · [ตัวอย่าง](assets/figure-flow-example.png) | [layout-flow.md](references/layout-flow.md) |

ทุกโครงใช้สี ขนาด ฟอนต์ และสคริปต์ลากเส้นชุดเดียวกัน ต่างกันแค่การจัดวาง

## 3 · หัวรูปต้องมีครบหกอย่าง

โลโก้โปรเจกต์ · ชื่อ · คำขยาย 1 บรรทัด · เลขรูป · เวอร์ชันกับวันที่ · เจ้าของ

โลโก้อยู่หน้าชื่อรูป (`<img class="logo">` ชี้ไป `assets/logo/` ของโปรเจกต์ · ไม่มีโลโก้ให้จดไว้ในรายงานว่าขาด) · คำขยายบอกว่า "ของจริงเป็นอย่างไร" ไม่ใช่ขยายชื่อ · **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้และไม่มีใครกล้าเชื่อ**

เหตุผลเต็มกับตัวอย่าง ผิด/ถูก ของคำขยาย → [`references/design-system.md`](references/design-system.md) หัวข้อ "หัวรูป" 

## 4 · ระบบขนาด

**ขนาด ระยะ และมุม อยู่ใน `:root` ของ `assets/figure-template.html` แล้ว อย่าตั้งค่าใหม่เอง**
ตัวเลขพวกนี้ปรับจนรูปดูตั้งใจแล้ว ถ้าขยับเมื่อไหร่ รูปในเอกสารเดียวกันจะดูไม่เท่ากัน

กรอบไอคอน 66px ขึ้นไป (ต่ำกว่า 56px รูปจะโหวง) · เส้นเชื่อมตั้งหรือนอนเท่านั้น หักมุมโค้ง ห้ามเส้นเฉียง

ตารางค่าเต็ม (ตัวอักษร · ไอคอน · กล่อง · `.focus` · เส้น · ระยะ) → [`references/design-system.md`](references/design-system.md) หัวข้อ "ระบบขนาด" — เปิดเมื่อต้องปรับโครงหรือเขียนโครงใหม่

> **ขนาดตัวอักษรขึ้นกับที่ที่รูปจะไปวาง ไม่ใช่ผ้าใบ** — ตารางข้างบนเหมาะกับสไลด์และจอ · รูปที่จะวางในเอกสาร A4 ต้องคิดย้อนจากขนาดที่วาง: ตัวอักษรเล็กสุดหลังวาง ≥ 7 พอยต์ (point — pt) → `px ขั้นต่ำ = 0.247 × ความกว้างผ้าใบ(px) ÷ ความกว้างที่วาง(ซม.)` · ผ้าใบ 2000px บนหน้าแนวตั้ง 17 ซม. = 29px · บนหน้าแนวนอน 25.7 ซม. = 20px · ขยายฟอนต์แล้วกล่องต้องกว้างพอให้ชื่อไทยไม่ตัดกลางคำ
> **2 ฉบับจากไฟล์ต้นทางเดียว:** ฉบับเต็ม (มีหัวรูป 6 อย่าง · ใช้เปิดเดี่ยว/สไลด์) และฉบับวางในเอกสาร (`?embed=1` ซ่อนหัวรูป เพราะคำบรรยายของเอกสารบอกแล้ว — หัวซ้ำทำให้รูปเล็กลงและดูรก) · สัดส่วนรูปให้กว้างพอวางเต็มหน้าแนวนอน (กว้าง ÷ สูง ≥ 1.46)
> **รูปทั้งชุดใช้ CSS ไฟล์เดียว** (`figure-theme.css` ข้างไฟล์ต้นทาง) ที่ดึงสี ฟอนต์ และโลโก้จากตัวตนของโปรเจกต์ (`assets/logo/` · token ของ mockup) — แก้ที่เดียว รูปทุกใบเปลี่ยนตาม
> **ด่านสวยของรูป** ไปพร้อมด่านสวยของเอกสาร (`branded-document-design` ข้อ 0.1) — เส้นทางหลักเส้นทึบสีเด่น · เส้นรองเทา · มีคำอธิบายสัญลักษณ์ · ลำดับการไหลมีเลขเมื่อมีมากกว่า 3 ขั้น

## 5 · ระบบสี

**สีหลักของรูปคือสีหลักของโปรเจกต์ (หรือของร้าน ครอบครัว งานนั้น)** ห้ามใช้สีจากตัวอย่างหรือจากรูปอ้างอิง หาตามลำดับนี้ เจอที่ไหนหยุดที่นั่น:

1. `doc-theme` ในเอกสารของโปรเจกต์ (ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร")
2. สีแบรนด์ที่โปรเจกต์ใช้จริง — ตัวแปรสีหลักในโค้ด (`--primary` · `--brand` · `--accent` ใน CSS · `primary` ใน Tailwind / ธีม UI · `colorPrimary` ในแอปมือถือ) · ชุดแบรนด์ (brand kit) · สีหลักในโลโก้
   ดูสีพื้นจากที่เดียวกันด้วย (`--background` · `--bg` · `background` ใน Tailwind · โหมดมืดหรือสว่างที่แอปใช้เป็นหลัก) เพราะรูปและเด็คใช้สีพื้นตามดีไซน์ของโปรเจกต์
3. ยังไม่มีเลย → **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `document` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้
4. ค้นสดไม่ได้ → ใช้ชุดสีประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม · เสนอโทนจาก [references/colour-by-domain.md](references/colour-by-domain.md) ไว้ในรายงานให้เลือกทีหลัง

เจอสีจากข้อ 2 แล้วแต่ยังไม่มี `doc-theme` ให้ประกาศ `doc-theme` ด้วยค่านั้น เพื่อให้รูป เอกสาร และสไลด์ของโปรเจกต์ใช้สีเดียวกัน

ในโครง HTML แก้ที่ `--accent` ใน `:root` ที่เดียว (SVG/Python engine แก้ `ACCENT` ใน `theme.py`) · สีพื้นตามดีไซน์ของโปรเจกต์ → ต่อท้ายชื่อไฟล์ `#accent=<สีหลัก>&bg=<สีพื้น>` · ข้อยกเว้นที่ไม่เปลี่ยนตามแบรนด์ (สีโลโก้ผู้ให้บริการ · เทาโครงสร้าง) และ**สีไอคอน 7 กลุ่ม** (`t-neutral` · `t-edge` · `t-app` · `t-view` · `t-data` · `t-alert` · `t-warn`) พร้อมความหมาย → [`references/design-system.md`](references/design-system.md) หัวข้อ "ระบบสี" — สีที่ 8 แปลว่าใช้สีเพื่อความสวย

**จำกัดจำนวนสี ไม่ได้จำกัดน้ำหนักของสี** — ในรูปที่ต้องดูออกแบบมา สีหลักต้องเห็นได้ทั่วทั้งรูป ไม่ได้อยู่แค่แถบหัว: ป้ายที่ต้องหาให้เจอเร็ว (เลขขั้น · ผู้รับผิดชอบ · สถานะ) ใช้พื้นทึบ · หัวการ์ดเป็นแถบพื้นสีทึบเต็มความกว้าง (ไม่ใช้แถบสีหนาข้างการ์ดมุมมน เพราะเป็นสัญญาณ AI ใน `no-ai-look`) · กล่องสรุปใช้พื้นสีเข้ม · สีพาสเทลใช้ได้แค่เป็นพื้นที่มีตัวหนังสือหรือขอบสีเข้มคู่กัน · ตรวจด้วยแกน "พลังของสี" ในด่านสวยของ `ui-craft` (`ui-craft/references/states-and-checks.md` (plugin `software-company`))

### 5.1 · รูปต้องมีจุดเด่น ไม่จืด

รูปที่อ่านออกแต่จืด = การ์ดขาวหน้าตาเท่ากันทุกใบ · เส้นบางเท่ากันทุกเส้น · ไม่มีอะไรดึงสายตา ผู้ใช้จะบอกว่า "ดีขึ้นแต่ไม่ว้าว" ทางที่ผ่านด่านสวยแล้ว:

| ชิ้น | ทำอย่างไร |
|---|---|
| ผ้าใบ | ใช้พื้นเดียวกับตัวตนของแอป — แอปพื้นมืดก็ใช้รูปพื้นมืดทั้งใบ (ไม่ใช่กรอบขาวล้อมภาพมืด) · ลายจุดตารางจาง ๆ ทึบไม่เกิน 8% ให้มีมิติ |
| เส้นทางหลัก | หนา 6px สีแบรนด์ + เรืองแสง (`filter: drop-shadow(0 0 8px <สีแบรนด์ 75%>)`) · เส้นรองบาง สีเทา ไม่เรือง — ต่างกันชัดจนไม่ต้องอ่านคำอธิบายสัญลักษณ์ |
| จุดเด่น | การ์ด `.focus` 1 ใบต่อรูป: ขอบสีแบรนด์ 3px + แสงรอบ + ไอคอนพื้นสีแบรนด์ · การ์ดอื่นพื้นกลืนกับผ้าใบ |
| ป้ายลำดับ | พื้นสีแบรนด์ ตัวอักษรสีพื้นผ้าใบ + แสงรอบเบา ๆ |
| คอนทราสต์ | ข้อความรองบนพื้นมืด ≥ 7:1 (เทาอ่อน ไม่ใช่เทากลาง) |
| ธีม | ทุกสีเป็นตัวแปรใน css ไฟล์เดียว · หัวลูกศรอ่านสีจากตัวแปร (`getComputedStyle`) ไม่ฝังค่าใน JavaScript (JS) · สีความหมาย (`t-app` `t-alert` `t-warn`) มีคู่สีของพื้นมืด · ห้ามใส่สีใน `style=""` ของไฟล์รูป |

**ลายจุดตาราง + เส้นเรืองแสง = house style ที่อนุมัติแล้ว** (ข้อยกเว้น "หน้าตาที่อนุมัติแล้วชนะเสมอ" ใน `no-ai-look`) · ตอนสแกนด้วย `slop_scan.py` ให้ติด `slop-ok` ที่ `grid-bg` และ `neon-glow` ของรูปเหล่านี้ พร้อมเหตุผลสั้น ๆ

**วิธีเลือกแนว:** เขียน 3 แนวเป็น css ทับ (override) ฉีดเข้ารูปจริง 2 รูปตอนเรนเดอร์ (`add_init_script` ก่อนสคริปต์วาดเส้นทำงาน) → วางเทียบกับรูปเดิม → ให้ผู้ตรวจที่ไม่ได้ทำให้คะแนน → แก้ theme css ไฟล์เดียวแล้วเรนเดอร์ทั้งชุด · รูปมืดในเอกสารหน้าขาวต้องเป็นการตัดสินใจที่จดไว้ (เช่น หน้าเปิดบทและปกก็มืด) ไม่ใช่เผลอ

## 6 · ไอคอน — ใช้ของทางการจากคลัง และวาดเองเฉพาะเมื่อไม่มี

**มีไอคอนทางการของบริการนั้นหรือไม่** เป็นตัวตัดสิน

- **ถ้ามี** (AWS · Azure · Google Cloud · Kubernetes · เครื่องมือโอเพนซอร์สส่วนใหญ่) ให้ใช้ของทางการจาก `assets/`
  คือ 205 ตัวที่คัดไว้ใน `assets/icons/` หรือคลังเต็มผ่าน `python assets/find-icon.py <ชื่อ>` ชุดเหล่านี้เผยแพร่มาเพื่อวาดผังสถาปัตยกรรมโดยเฉพาะ ส่วนรายการกลุ่ม คำสั่ง และสัญญาอนุญาตอยู่ใน [references/icons.md](references/icons.md)
- **ถ้าไม่มี** หรือเป็นของที่เราสร้างเอง ให้วาดไอคอนเส้นเอง แล้วเขียนที่เชิงอรรถว่า
  ไอคอนไม่ใช่โลโก้ทางการ (โครง `figure-template.html` มีบรรทัดนี้ให้แล้ว)
- **ห้ามปนกัน**ในรูปเดียว เพราะโลโก้สีจัดข้าง ๆ ไอคอนเส้นบางทำให้รูปดูไม่เสร็จ

ไอคอนเส้นที่วาดเอง: `viewBox 0 0 24 24` · `stroke-width 1.6` · ไม่มีพื้น · ปลายเส้นมน · ต้องอ่านออกที่ 24px (รายละเอียดเกิน 3 เส้นกลายเป็นก้อนดำ)

## 7 · สายเชื่อม

**ในคอลัมน์เดียวกัน** ใช้ลูกศรลง `.down` · **ข้ามคอลัมน์** ใช้รายการ `WIRES` ท้ายไฟล์ (`{from, fs, to, ts, tp, label}`) ให้สคริปต์ลากหลังจัดหน้า — ห้ามเขียนพิกัดตายตัว

**กติกาที่ห้ามพลาด:**

- เส้นตั้งหรือนอนเท่านั้น หักมุมโค้งด้วย `elbow()` (ใช้ `mx` เมื่อหลายเส้นใช้ช่องเดียวกัน) · ห้ามเส้นเฉียง
- ป้ายต้องแคบกว่าช่องว่างระหว่างคอลัมน์ (ป้ายยาวขึ้น → เพิ่ม `gap` ของ `.stage`)
- เส้นข้ามคอลัมน์ **ไม่เกิน 5 เส้น** ต่อรูป · ต่อเข้ากล่องเล็กที่สุดที่ถูกต้อง
- ป้ายบอกว่า**อะไรไหลผ่าน** (`HTTPS 443`) ไม่ใช่ `เชื่อมต่อ` · ไม่มีอะไรจะบอกไม่ต้องใส่ป้าย · เส้นที่ยังไม่ต่อจริงใช้ `planned:true` พร้อมเชิงอรรถ

ตัวอย่างโค้ด `WIRES` · ที่มาของแต่ละกติกา · `lp` · `tp` → [`references/wires.md`](references/wires.md) — เปิดเมื่อเขียน `WIRES`

### 7.1 · จัดวาง — ผังขั้นตอนและผังทีม

ผู้ใช้ตั้งกติกานี้หลังเห็นรูปจริง (2026-10-28) เพราะรูปที่เส้นโค้งไปมาและกล่องกระจายไม่เป็นแถวอ่านแล้วงง

- **อ่านจากบนลงล่าง** ชั้นละ 1 ระดับ: ทางเข้า → ตัวกลาง → ผู้รับงาน → ผล · ใช้ซ้ายไปขวาเฉพาะเมื่อมีแกนเวลา (Gantt)
- **ตัวกลางอยู่กลางรูป** (หัวหน้าทีม · ระบบหลัก · กล่อง `.focus`) และจัดทั้งรูปไว้กลางเป็นหลัก ไม่ชิดซ้ายจนอีกฝั่งโล่ง
- **ของที่อยู่ระดับเดียวกันอยู่ในกรอบเดียวกัน แถวเดียวกัน** และมีชื่อกลุ่มบนเส้นขอบ เช่น "ทางเข้า" หรือ "agent 8 ตัว"
  - กรอบเป็นเส้นเดียว ไม่มีพื้น ไม่มีเงา
  - การ์ดในกรอบเดียวกันสูงเท่ากัน
  - มีมากจนแถวเดียวไม่พอ ให้ตัดเป็นหลายแถวในกรอบเดิม และจัดแถวสุดท้ายไว้กลาง
- **ถ้าทุกกล่องในกลุ่มรับของเดียวกัน ให้ลากเส้นเดียวเข้ากรอบ** ไม่แตกเส้นไปทุกกล่อง · ถ้าแต่ละกล่องเป็นทางเลือกต่างกัน ให้ลากเส้นแยกต่อกล่อง แล้วย้ายชื่อกลุ่มไปขอบล่าง เส้นจะได้ไม่ทับชื่อ
- **รางเส้นอยู่นอกกรอบ** — เส้นที่ออกหรือเข้ากลุ่มหักมุมในช่องว่างระหว่างกรอบ ไม่ทับชื่อกลุ่มหรือการ์ด
- **ให้ดูนุ่มนวล** — ช่วงตรงของเส้นยังตั้งหรือนอน แต่ทุกมุมที่หักเป็นโค้งรัศมีราว 12 px (ช่วงสั้นกว่า 24 px ลดรัศมีตาม) · การ์ดมุมมน 14 px · กรอบกลุ่มมุมมน 20 px · ป้ายเป็นแคปซูล · ไม่ใช้มุมแหลมกับกล่องหรือเส้น
- **คำไทยห้ามขาดกลางคำ** — ตัวตัดคำของเบราว์เซอร์แยกบางคำผิด และท่อนที่ได้อาจไม่ตรงขอบคำ (เช่น `เช็|กมิจฉา|ชีพ`) · เก็บรายชื่อคำเหล่านี้ไว้ (ทีละ · สต็อก · ร้านค้า · เช็ก) แล้วห้ามตัดบรรทัดตรงจุดใดที่อยู่กลางคำในรายชื่อ (ห่อด้วย `white-space:nowrap`) · ข้อความยาวที่ไม่มีในรายชื่อ ใส่ `<br>` เองตามข้อ 8 · เปิดรูปดูทุกการ์ด
- **ทุกกล่องมีชื่อและคำอธิบาย 1 บรรทัด** ไม่ใช่มีแค่ไอคอน · ขั้นที่ต่อกันเป็นลำดับ (1 → 2 → 3) ไม่ต้องใส่กรอบ เพราะไม่ใช่ของระดับเดียวกัน

## 8 · ภาษาไทย

- **`line-height` ต่ำกว่า 1.5 ไม่ได้** เพราะสระบนกับวรรณยุกต์ซ้อนกัน 2 ชั้นจะโดนตัด ด้วยเหตุผลเดียวกันจึง **ห้ามกำหนดความสูงตายตัวให้กล่องข้อความ**
- ฟอนต์เรียงตามนี้ `"Noto Sans Thai","IBM Plex Sans Thai",Tahoma,Loma` ซึ่งตั้งไว้ในโครงแล้ว
รูปที่จะฝังในเด็ค (`StageDeck` · `html-slide-deck`) ให้ย้าย `"IBM Plex Sans Thai"` ขึ้นเป็นตัวแรก · เอกสาร Word ใช้ฟอนต์ไทยของแบรนด์ ถ้าไม่มีจึงใช้ Tahoma (`branded-document-design` ข้อ 2) รูปในนั้นต่างฟอนต์ได้ · ถ้าเครื่องไม่มีฟอนต์ไทยสักตัว สระจะผิดตำแหน่งแบบเงียบ ๆ ดังนั้น**ต้องเรนเดอร์ดูทุกครั้ง**
- **ไทยไม่เว้นวรรคระหว่างคำ** เบราว์เซอร์จึงตัดบรรทัดกลางคำ ถ้าข้อความยาวให้ใส่ `<br>` เอง
- ตัวอักษรไทยดูเล็กกว่าอังกฤษที่ขนาดเท่ากัน ดังนั้นคำอธิบายอย่าต่ำกว่า 12px

## 9 · เรนเดอร์แล้วเปิดดู — ห้ามข้าม

```bash
pip install playwright && playwright install chromium
cp <skill>/assets/render-figure.py docs/figures/render.py     # ครั้งแรกของโปรเจกต์
python docs/figures/render.py                  # ทุกรูปใน docs/figures/src/ → docs/figures/*.png + docs/figures/doc/*.png
python docs/figures/render.py arch-01 --min-px 20             # เฉพาะรูปที่ระบุ · ตัวอักษรขั้นต่ำตามขนาดที่วาง (ข้อ 4)
python assets/render-figure.py figure.html figure.png 2       # ไฟล์เดียว (สไลด์ · ลองแนว)
```

- **script render อยู่ที่ `docs/figures/render.py` ข้างโฟลเดอร์ `src/`** — เป็นเครื่องมือของโปรเจกต์ที่ต้องใช้ทุกครั้งที่แก้รูป ห้ามเก็บไว้ใน `_to_delete/` หรือ scratchpad (ล้างโฟลเดอร์ชั่วคราวแล้วจะเหลือต้นฉบับที่ render ไม่ได้) · ห้ามลบ `docs/figures/src/` เพราะ .png เป็นแค่ผลลัพธ์
- แบบโฟลเดอร์ได้ 2 ฉบับต่อรูป (ฉบับเต็ม + ฉบับวางในเอกสาร `?embed=1` ตามข้อ 4) และตรวจข้อความให้: ตัวอักษรเล็กกว่า `--min-px` · ชื่อหรือป้ายตกบรรทัด · ข้อความล้นกล่องหรือผ้าใบ · ป้ายทับกัน → `problems: 0` และ exit 0 จึงผ่าน

ใช้ตัวคูณ **2** เสมอ เพราะตัวคูณ 1 ได้ภาพเบลอเมื่อเอาไปขยายในสไลด์

แล้วรันตัวตรวจเรขาคณิต ซึ่งจับเส้นเฉียง มุมที่ไม่ใช่มุมโค้ง ป้ายทับกัน และเส้นพาดผ่านตัวหนังสือ:

```bash
python scripts/check-figure-geometry.py docs/figures/src     # exit 0 = ผ่าน
python scripts/check-figure-source.py docs/figures/src       # ทุกรูปเริ่มจากโครงของ skill นี้
```

จากนั้นเปิดไฟล์ภาพดูด้วยตา แล้วไล่ตามนี้:

- [ ] สายข้ามคอลัมน์มีหัวลูกศรครบทุกเส้นไหม · เส้นพาดทับกล่องหรือทับตัวหนังสือไหม
- [ ] ป้ายบนเส้นอ่านออกไหม และไม่ทับกันเองไหม
- [ ] ข้อความไทยครบไหม สระหรือวรรณยุกต์หายไหม มีคำไหนถูกตัดกลางคำไหม
- [ ] กล่อง `.focus` มีกล่องเดียวจริงไหม · หัวรูปมีครบ 6 อย่างไหม · โลโก้ขึ้นจริงไหม
- [ ] ย่อรูปลงเหลือความกว้าง 25% แล้วยังแยกออกไหมว่าอะไรอยู่ตรงไหน
- [ ] วัดตัวอักษรเล็กสุดใน HTML แล้วคิดเป็น pt ตามขนาดที่จะวางจริง (ข้อ 4) ได้ ≥ 7pt
- [ ] คนที่ไม่เคยเห็นระบบนี้ ตอบคำถามต้นทางได้ไหม

## 10 · กับดักที่เจอจริง

ถ้ารูปออกมาผิด เช่น หัวลูกศรหาย เส้นลากผิดกล่อง สระไทยหาย หรือป้ายทับกล่อง ให้เปิดตารางอาการ → สาเหตุ → ทางแก้ใน [references/pitfalls.md](references/pitfalls.md) ก่อนแก้เอง

## 11 · Anti-patterns

- **ใช้ skill นี้กับรูปในทีม** — เสียเวลาหลายรอบเพื่อความสวยที่ไม่มีใครต้องการ
- **ใช้โลโก้ทางการในลักษณะที่ดูเหมือนผู้ให้บริการรับรอง** — ข้อ 6 และ [icons.md](references/icons.md)
- **กล่อง `.focus` 2 กล่อง** — แปลว่ารูปตอบ 2 คำถาม
- **ส่งไฟล์ HTML ให้ลูกค้า** — ให้ส่ง PNG ส่วนไฟล์ HTML คือแหล่งที่มา เก็บไว้ใน repo
- **ไม่เก็บไฟล์ HTML** — ปีหน้าต้องแก้รูป แล้วต้องวาดใหม่ทั้งใบ
- **รูปไม่มีวันที่และเจ้าของ**
- **เส้นเฉียงหรือมุมแหลม** — เส้นต้องตั้งหรือนอน หักด้วยมุมโค้ง (ข้อ 4 และ 7)
- **ของระดับเดียวกันกระจายคนละแถวหรือไม่มีกรอบ · ตัวกลางชิดขอบรูป** — จัดตามข้อ 7.1
- **ไอคอนต่างสไตล์ปนกัน** — เส้นบางปนเส้นหนา ปนไอคอนทึบ
- **รูปจืด: การ์ดขาวเท่ากันทุกใบ เส้นบางเท่ากันทุกเส้น** — อ่านออกแต่ไม่มีจุดเด่น ทำตามข้อ 5.1

## 12 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ไดอะแกรมด่วนใน markdown ของ repo ที่ทีมอ่าน (README · Pull Request · โน้ตในโค้ด) | `software-diagrams` (plugin `software-company`) |
| เลือกวิธีฝังรูปในไฟล์ markdown | `markdown-visuals` |
| เอารูปไปวางในสไลด์ | `presentation-design` |
| เอารูปไปวางในไฟล์ Word / PDF | `branded-document-design` |
| รูปในเอกสาร SRS | `srs-writing` (plugin `software-company`) |
| สีและระยะห่างของหน้าจอแอป (คนละระบบกับรูปนี้) | `ui-craft` (plugin `software-company`) |

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

HTML — HyperText Markup Language · PNG — Portable Network Graphics · SVG — Scalable Vector Graphics · CSS — Cascading Style Sheets


## reference: colour-by-domain.md

# ตารางเนื้องาน → โทนสี

ใช้เมื่อเอกสารยังไม่มี `doc-theme` และยังไม่มีสีแบรนด์ ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนจากตารางนี้ไว้ในรายงานให้ผู้ใช้เลือกทีหลัง (ลำดับเต็มอยู่ใน `diagram-figures` ข้อ 5) ตารางนี้ใช้ร่วมกันทั้ง 2 engine ของ `diagram-figures` และทุก skill ที่วาดรูป

| เนื้องาน | โทนที่เสนอ | เหตุผล |
|---|---|---|
| การแพทย์ · สุขภาพ | เขียวอมฟ้า · เขียว | ความสะอาด ความปลอดภัย |
| การเงิน · ธนาคาร | น้ำเงินเข้ม · เทาเงิน | ความมั่นคง |
| อุตสาหกรรม · โรงงาน | เหลืองอำพัน · เทาเหล็ก | เครื่องจักร การเตือน |
| การศึกษา | ม่วง · ส้มอ่อน | ความกระตือรือร้น |
| ค้าปลีก · อาหาร | ส้ม · แดงอมชมพู | ความอบอุ่น ความอยาก |
| ราชการ · กฎหมาย | กรมท่า · เลือดหมู | ความเป็นทางการ |
| ซอฟต์แวร์ทั่วไป | น้ำเงิน | ค่ากลางเมื่อไม่มีบริบทอื่น |


## reference: design-system.md

# ระบบออกแบบของรูป — รายละเอียด

สารบัญ: หัวรูป → ระบบขนาด → ระบบสี → ไอคอนเส้นที่วาดเอง · กฎสั้นอยู่ใน `SKILL.md`

## หัวรูป (จากข้อ 3)

โลโก้อยู่หน้าชื่อรูป โครงทุกตัวมีช่อง `<img class="logo">` ชี้ไปที่ `assets/logo/` ของโปรเจกต์อยู่แล้ว ให้แก้แค่ชื่อไฟล์ ถ้าโปรเจกต์ยังไม่มีโลโก้ ช่องนี้จะหายไปเอง แต่ต้องจดไว้ในรายงานว่ายังขาดโลโก้ เพราะรูปที่ไม่มีโลโก้ถูกถามเสมอว่า "โลโก้อยู่ไหน"

เหตุผลไม่ใช่ความสวย แต่เป็นเพราะรูปสถาปัตยกรรมถูกก๊อปไปวางในอีเมล ในสไลด์ ในเอกสารสัญญา
แล้วอยู่ต่ออีกเป็นปี **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้และไม่มีใครกล้าเชื่อ**

คำขยายบอกว่า "ของจริงเป็นอย่างไร" ไม่ใช่ขยายชื่อ:

```
ผิด: ภาพรวมระบบ Dr Screening
ถูก: เครื่องเดียวในห้อง Server ของโรงพยาบาล รันทุกบริการด้วย Docker Compose
```

## ระบบขนาด (จากข้อ 4)

| อย่าง | ค่า |
|---|---|
| ตัวอักษร | ชื่อรูป 30 · ชื่อกล่อง 16 · คำอธิบาย 13.5 · ป้ายกลุ่ม 12 ตัวใหญ่ |
| ไอคอน | กรอบ 66px · มุม 18px · ไอคอน 29px · เส้น 1.6px |
| กล่อง | มุม 20px · ขอบ 1px เทาอ่อน · กล่องซ้อนใน มุม 16px พื้นเทาอ่อนมาก |
| กล่อง `.focus` | ขอบ 2px สี `--accent` เฉดเข้ม · มุม 22px |
| เส้นเชื่อม | แนวตั้งหรือแนวนอนเท่านั้น · หักมุมฉากด้วยมุมโค้งรัศมี 10px (SVG/Python engine ใช้ 12–14) · ห้ามเส้นเฉียง ห้ามเส้นโค้งอิสระ ห้ามมุมแหลม |
| ระยะ | 12 · 20 · 26 · 34 · 48 · ช่องว่างระหว่างคอลัมน์ 130 |

> **กรอบไอคอนต้องใหญ่** — 66px คือจุดที่รูปเริ่มดูตั้งใจ ไม่ใช่ผังที่ generate มา
> ถ้าต่ำกว่า 56px ไอคอนจะกลายเป็นจุดเล็ก ๆ ในกล่องใหญ่ และรูปจะดูโหวง

## ระบบสี (จากข้อ 5)

ในโครง HTML ให้แก้ที่ `--accent` ใน `:root` ที่เดียว แล้วเฉดอ่อนและเข้มจะคำนวณจากค่านั้น (ส่วน SVG/Python engine แก้ที่ `ACCENT` ใน `theme.py`)

**สีพื้นของรูปตามดีไซน์ของโปรเจกต์** — ต่อท้ายชื่อไฟล์ด้วย `#accent=<สีหลัก>&bg=<สีพื้น>` ให้ตรงกับเด็คหรือแอป พื้นเข้มหรือสว่างก็ได้ เทาทุกระดับคำนวณจากสีพื้น (ตอนนี้มีใน `figure-flow.html`) ถ้าไม่ใส่ `bg` ได้พื้นขาว

ข้อยกเว้นที่ไม่เปลี่ยนตามแบรนด์:

- **สีโลโก้ผู้ให้บริการ** — AWS ส้ม Azure ฟ้า ต้องเป็นสีจริงของเขา ไม่ใช่สีแบรนด์เรา
- **เทาโครงสร้าง** — เส้นขอบและพื้นกล่องต้องจางพอที่จะไม่แย่งสายตากับเนื้อหา

**สีไอคอนมี 7 กลุ่ม และแต่ละกลุ่มต้องมีความหมาย**

| คลาส | ใช้กับ |
|---|---|
| `t-neutral` | คน อุปกรณ์ ของนอกระบบ ที่เก็บไฟล์ธรรมดา |
| `t-edge` | ทางเข้า-ออก · gateway · API |
| `t-app` | เครื่องมือที่ผู้ใช้ทำงานด้วย |
| `t-view` | ส่วนที่ผู้ใช้ใช้ดูหรืออ่านผล |
| `t-data` | ฐานข้อมูล · สำรองข้อมูล |
| `t-alert` | คิว งานที่ค้างได้ ของที่พังแล้วเจ็บ |
| `t-warn` | ของที่มีเงื่อนไข — สัญญาอนุญาต ข้อจำกัดทางกฎหมาย |

ทุกกรอบมี**พื้นอ่อนกับขอบในโทนเดียวกัน** ไม่ใช่พื้นสีทึบ เพราะสีทึบจะดึงสายตาไปจากเนื้อหา
ถ้าอยากได้สีที่ 8 แปลว่ากำลังใช้สีเพื่อความสวย ไม่ใช่เพื่อสื่อความหมาย

## ไอคอนเส้นที่วาดเอง (จากข้อ 6)

ไอคอนเส้นที่วาดเอง: `viewBox 0 0 24 24` · `stroke-width 1.6` · ไม่มีพื้น · ปลายเส้นมน
รูปทรงต้องอ่านออกที่ขนาด 24px เพราะลายละเอียดเกิน 3 เส้นจะกลายเป็นก้อนดำ

## ฟอนต์ในรูปที่ฝังเด็ค (จากข้อ 8)

  รูปที่จะฝังในเด็ค (`StageDeck` · `html-slide-deck`) ให้ย้าย `"IBM Plex Sans Thai"` ขึ้นเป็นตัวแรก รูปจะได้ฟอนต์เดียวกับเนื้อความของเด็ค · เอกสาร Word ใช้ฟอนต์ไทยของแบรนด์ ถ้าไม่มีจึงใช้ Tahoma ตาม `branded-document-design` ข้อ 2 รูปในนั้นต่างฟอนต์ได้
  ถ้าเครื่องไม่มีสักตัว จะตกไปใช้ฟอนต์ที่วางสระผิดตำแหน่งแบบเงียบ ๆ ดังนั้น**ต้องเรนเดอร์ดูทุกครั้ง**


## reference: engine-mermaid.md

# Mermaid → รูปเส้นตั้งฉากมุมโค้ง

ทางที่ 3 ของ `diagram-figures` ใช้เมื่อเอกสารมีบล็อก Mermaid หลายสิบบล็อก (sequence · state · ER · gantt) แล้วต้องส่งเป็นไฟล์ Word หรือ PDF ที่ดูออกแบบมา
ถ้าใช้ภาพที่ Mermaid วาดเอง เส้นจะโค้งอิสระและเฉียง สีจะไม่ตรงกับรูปที่วาดด้วยมือ ตัวนี้จึงอ่านบล็อกเดิมแล้ววาดใหม่ด้วยกติกาเดียวกับโครง HTML

## ได้อะไร

- เส้นตั้งหรือนอนเท่านั้น หักมุมด้วยมุมโค้ง (รัศมีอยู่ใน `theme.py`: `WIRE_R` 12 · กล่อง `BOX_R` 10)
- ป้ายบนเส้นเป็นป้ายขาวขอบอ่อน และมีตัวตรวจว่าป้ายไม่ทับกล่องหรือเส้น
- กล่องหลักกล่องเดียวเป็นการ์ดเข้มขอบไล่สี ตรงกับกล่อง `.focus`
- จัดวางด้วย ELK (`elkjs` แบบ layered + orthogonal) จึงไม่ต้องวางพิกัดเอง

## ใช้

1. คัดลอกโฟลเดอร์ `assets/mermaid-engine/` ไปไว้ที่ `docs/figures/src/gen/`
2. แก้ `figures.json`:
   - `prefix` คือรหัสโปรเจกต์ (`document-naming`)
   - `drafts` คือโฟลเดอร์ไฟล์ `.md` ที่มีบล็อก Mermaid
   - `skip` คือบล็อกที่มีรูปวาดมือแล้ว
   - `captions` ใช้แทนคำบรรยายที่สร้างจากหัวข้อ
3. แก้ `theme.py`: ให้ `ACCENT` และ `SECOND` ตรงกับ `doc-theme` ของโปรเจกต์ ส่วน `MEASURE_FONTS` ต้องชี้ไฟล์ฟอนต์จริงในเครื่อง
4. รัน `python build.py` จะได้ `docs/figures/<prefix>-<ไฟล์>-m<N>.png` และ `map.md` ที่บอกว่าบล็อกไหนกลายเป็นไฟล์ไหน
   - ถ้ายังไม่มี `elkjs` ตัว `elk.py` จะติดตั้งรุ่น 0.9.3 ลงโฟลเดอร์ `node_modules` ที่ตั้งไว้ให้เอง
5. ต้องดู output ทุกครั้ง:
   - บรรทัด `PROBLEM` คือเส้นเฉียง ป้ายทับ หรือบล็อกที่อ่านไม่ออก ห้ามส่งงานถ้ายังมีบรรทัดนี้
   - เปิดดูด้วยตาอย่างน้อย 1 รูปต่อชนิด

## ข้อจำกัด

- ใช้ได้ 4 ชนิด: `sequenceDiagram` · `stateDiagram-v2` · `erDiagram` · `gantt` ส่วน flowchart ให้วาดเป็นโครง HTML (ข้อ 2 ของ SKILL.md) เพราะ flowchart คือรูปที่คนอ่านมากที่สุด
- รูปกว้าง 1240px ตามหน้า A4 แนวตั้ง ถ้ารูปมีคนเกี่ยวข้องเกิน 7 คน ตัวหนังสือจะเล็ก ให้แยกรูป หรือวางรูปนั้นในหน้าแนวนอน


## reference: engine-svg-python.md

# SVG/Python engine — รูปที่ generate จากข้อมูลหรือโค้ด

ทางที่ 2 ของ `diagram-figures` ใช้แทนโครง HTML เมื่อรูปต้องสร้างจากข้อมูลหรือโค้ด เช่น รูปหลายใบที่ต้องออกซ้ำทุกครั้งที่ข้อมูลเปลี่ยน หรือรูปที่ต้องคุมตำแหน่งทุกจุดเองบนกริดด้วยเส้นตั้งฉากมุมโค้ง
Python เขียน SVG ลงกริดแล้วเรนเดอร์เป็น PNG ส่วนไอคอนและโลโก้มาจากคลังเดียวกับโครง HTML ([icons.md](icons.md))

ข้อเสียคือใช้เวลา เพราะ 1 รูปต้องแก้หลายรอบ ดังนั้นให้ใช้เฉพาะรูปที่คนนอกทีมจะเห็นและเห็นซ้ำ

> **สีหลัก = สีหลักของโปรเจกต์** · หาตามลำดับใน `diagram-figures` ข้อ 5 (ระบบสี) แล้วใส่ใน `ACCENT` ของ `theme.py` · ชุดประจำบ้าน `#2A78D6` ใช้เฉพาะเมื่อลำดับนั้นหาไม่เจอเลย

---

**สารบัญ**
- [0 · สีมาจากเนื้องาน — ไม่หยุดถาม](#0--สีมาจากเนื้องาน--ไม่หยุดถาม)
- [1 · ลำดับการทำงาน](#1--ลำดับการทำงาน)
- [2 · โครงไฟล์](#2--โครงไฟล์)
- [3 · กฎข้อที่หนึ่ง — กริดก่อน เส้นทีหลัง](#3--กฎข้อที่หนึ่ง--กริดก่อน-เส้นทีหลัง)
- [4 · เส้นเชื่อม](#4--เส้นเชื่อม)
- [5 · ป้ายบนเส้น — สองบทบาทเท่านั้น](#5--ป้ายบนเส้น--สองบทบาทเท่านั้น)
- [6 · โซน](#6--โซน)
- [7 · ไอคอนและโลโก้](#7--ไอคอนและโลโก้)
- [8 · เรนเดอร์](#8--เรนเดอร์)
- [9 · วงจรตรวจงาน — ห้ามข้าม](#9--วงจรตรวจงาน--ห้ามข้าม)
- [10 · ค่าคงที่ที่ใช้ได้จริง](#10--ค่าคงที่ที่ใช้ได้จริง)
- [11 · แถบสัญลักษณ์](#11--แถบสัญลักษณ์)
- [ตัวย่อ](#ตัวย่อ)

## 0 · สีมาจากเนื้องาน — ไม่หยุดถาม

**ถ้าเอกสารต้นทางประกาศ `doc-theme` ไว้แล้ว ให้ใช้ค่านั้นและอย่าถามซ้ำ**
(ดู `polished-document-style` หัวข้อ "ธีมของเอกสาร") ถ้ายังไม่มี ให้ทำตามข้างล่างนี้แล้วเขียนกลับลง `doc-theme`

**ไม่มีสีแบรนด์ → ทำตามลำดับใน `diagram-figures` ข้อ 5:** ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` ไว้ในรายงาน แล้วทำต่อ ไม่หยุดถาม
เสนอโทนจากเนื้องานตามตารางใน [colour-by-domain.md](colour-by-domain.md) ไว้ในรายงานให้เลือกทีหลัง

ใส่**สีหลักสีเดียว**ที่ `ACCENT` ใน `assets/svg-engine/theme.py` แล้วเฉดอ่อนและเข้มทั้งหมด
จะคำนวณจากสีนั้นด้วย `tint()` โค้ดวาดรูปจึงไม่มีสีอื่นฝังอยู่

สีเดียวที่ไม่ผูกกับ `ACCENT` คือ `EXCEPT_HUE` สำหรับป้าย "ข้อยกเว้น" ซึ่งต้องต่างจากสีหลักเสมอ
ถ้าสีหลักเป็นส้มอยู่แล้ว ให้เปลี่ยน `EXCEPT_HUE` เป็นสีอื่นที่ตัดกัน

---

## 1 · ลำดับการทำงาน

1. อ่านไดอะแกรมที่มีอยู่ทั้งหมดก่อน แล้วถามว่า**รูปนี้ตอบคำถามอะไร** — 1 รูปตอบ 1 คำถาม
2. เลือกสีตามข้อ 0 (ไม่มีสี → ค่าประจำบ้าน + `(รอยืนยัน)`)
3. **วางตำแหน่งทุกกล่องลงกริดก่อนลากเส้น** — ข้อนี้สำคัญที่สุด ดูข้อ 3
4. แก้ `theme.py` และ `ref.py` ให้เสร็จก่อน แล้วค่อยเขียนไฟล์รูป
5. **เรนเดอร์แล้วเปิดไฟล์ภาพดูจริง** ไม่ใช่แค่เช็กว่าสคริปต์รันผ่าน
6. เมื่อได้รูปที่สะอาดแล้ว จึงเขียนลงโฟลเดอร์ปลายทาง ส่วนรูปเก่าให้ย้ายไป `_to_delete/`

---

## 2 · โครงไฟล์

```
architecture/
  01-system-context.png      ← ผลลัพธ์ เลขนำหน้าเรียงตามลำดับการอ่าน
  _src/
    theme.py                 ← สีทั้งหมด — แก้ที่นี่ที่เดียว
    ref.py                   ← ภาษาภาพ: โซน หน่วย เส้น ป้าย แถบสัญลักษณ์
    render.py                ← SVG → PNG ด้วย Playwright ที่ 2 เท่า
    d01.py … dNN.py          ← หนึ่งไฟล์ต่อหนึ่งรูป มีแต่การจัดวาง
    logos/                   ← โลโก้ผลิตภัณฑ์ + colors.json
```

ให้คัดลอกทั้งโฟลเดอร์ [`assets/svg-engine/`](../assets/svg-engine/) ไปเป็น `_src/` แล้วเริ่มงาน — [`d01.py`](../assets/svg-engine/d01.py) เป็นรูปตัวอย่างที่เรนเดอร์ได้จริง

---

## 3 · กฎข้อที่หนึ่ง — กริดก่อน เส้นทีหลัง

เส้นเฉียงทำให้อ่านยาก แต่การดัดเส้นทีหลังไม่ช่วย **ต้องแก้ที่ตำแหน่ง**

```python
CA,CB,CC,CD,CE,CF = 178,452,678,896,1080,1312   # คอลัมน์
R1,R2,R3          = 288,458,624                  # แถว ห่างกัน ~170
```

ทุกกล่องอยู่บนจุดตัดของคอลัมน์กับแถว และไม่มีตัวไหนหลุดกริด
เมื่อทุกจุดอยู่บนเส้นเดียวกัน เส้นเชื่อมก็ตั้งฉากได้เองโดยไม่ต้องดัด

### กฎจุดกึ่งกลาง

ตัวที่รับหลายทางต้องอยู่**กึ่งกลางของทางเหล่านั้น** ไม่ใช่เกาะแถวใดแถวหนึ่ง
และถ้าส่งต่อหลายทาง ก็ต้องอยู่กึ่งกลางของทางที่ส่งออกด้วย

ให้ใช้**จุดรวมเดียวและจุดแยกเดียว** เพื่อให้เส้นสมมาตร

```python
RM = (R1+R2)//2      # Nginx อยู่กึ่งกลางของสองแถวที่รับเข้ามา
J1, J2 = CB-74, CB+86

flow([(CA+34,R1),(J1,R1),(J1,RM),(CB-30,RM)])   # เข้าจากบน
flow([(CA+34,R2),(J1,R2),(J1,RM),(CB-30,RM)])   # เข้าจากล่าง
flow([(CB+30,RM),(J2,RM),(J2,R1),(CC-30,R1)])   # ออกขึ้นบน
flow([(CB+30,RM),(J2,RM),(J2,R2),(CC-30,R2)])   # ออกลงล่าง
```

### ช่องเดินสาย

เส้นที่ต้องข้ามกริด **ห้ามวิ่งทับแถวที่มีกล่อง** ให้จองช่องว่างไว้เฉพาะ

```python
TB = 238        # ช่องบน — ห่างจากขอบโซนอย่างน้อย 36
MB = R3-48      # ช่องกลาง — ระหว่างแถว
```

---

## 4 · เส้นเชื่อม

เส้นตั้งฉากทั้งหมดและมุมโค้งรัศมี 14 — จุดนี้ทำให้ดูประณีตขึ้นมากโดยไม่เสียความชัดเจน
`ref.flow(pts, dashed=False, arrow=True)` คำนวณมุมโค้งให้เอง

**หัวลูกศรต้องจบที่ขอบไอคอน ไม่ใช่ที่ป้ายชื่อ** — เช่น `CD-30` เมื่อไอคอนกว้าง 46

---

## 5 · ป้ายบนเส้น — สองบทบาทเท่านั้น

| บทบาท | สี | ใช้กับ |
|---|---|---|
| ปกติ | เฉดอ่อนของ `ACCENT` | สิ่งที่ไหลผ่านเส้นตามปกติ |
| ข้อยกเว้น | `EXCEPT_HUE` | ทางที่ไม่ผ่านประตูหน้า · กรณีพิเศษ |

**ข้อยกเว้นมีได้ป้ายเดียวต่อรูป** ถ้ามีตั้งแต่ 2 ป้าย แปลว่าไม่มีป้ายไหนเด่นจริง

ป้ายบอกว่า**อะไรไหลผ่าน** เช่น `SQL` `/api/` `DICOM 11112` ไม่ใช่ `เชื่อมต่อ`

---

## 6 · โซน

โซนเป็นกรอบพื้นสีอ่อนมาก ส่วนป้ายชื่อเป็นแคปซูลพื้นขาวคร่อมเส้นขอบและมีจุดสีนำหน้า

```python
zone(x, y, w, h, "ห้อง Server ของโรงพยาบาล", "physical")
```

| ชนิด | เส้น | ความหมาย |
|---|---|---|
| `physical` | ทึบ | ขอบเขตของจริงทางกายภาพ — ห้อง อาคาร เครื่อง |
| `logical` | ประ | ขอบเขตเชิงตรรกะ — Docker Compose · namespace · VPC |
| `outside` | ประ | นอกระบบที่เราดูแล |

ผู้อ่านจะเห็นทันทีว่าอันไหนมีอยู่จริง และซ้อนโซนได้ไม่เกิน 3 ชั้น

---

## 7 · ไอคอนและโลโก้

ไอคอน**ลอยบนพื้น ไม่มีกรอบ ไม่มีไทล์** ส่วนชื่อและคำอธิบายอยู่ใต้ภาพ

```python
unit(cx, cy, "Nginx", "ประตูเดียวที่เข้าระบบได้", slug="nginx")
#  มี logos/<slug>.svg → ใช้โลโก้จริง เติมสีจาก colors.json
#  ไม่มี              → ใช้สัญลักษณ์เส้นที่ออกแบบเอง
```

ค่าที่ใช้ได้จริง: ไอคอน 46 · ชื่อ 11.5 ตัวหนา ห่างจากกึ่งกลาง `size/2+20` · คำอธิบาย 10 ห่าง `size/2+35`

โลโก้เอามาจากคลังไอคอนของ skill นี้ ([icons.md](icons.md)) ให้รัน `python assets/find-icon.py --group brands <ชื่อ>` จากโฟลเดอร์ `diagram-figures/` แล้ว `--copy` ไปไว้ใน `_src/logos/`
Simple Icons ให้ SVG สีเดียว `viewBox 0 0 24 24` และมาพร้อม `colors.json` ที่เก็บรหัสสีทางการของแต่ละแบรนด์

### เรื่องเครื่องหมายการค้า — ห้ามข้าม

- โลโก้เป็นของเจ้าของ ใช้เพื่ออ้างถึงตัวผลิตภัณฑ์ในผังได้
  แต่**ห้ามดัดแปลงรูปทรง ห้ามยืดบีบ และห้ามทำให้ดูเหมือนเจ้าของมารับรอง**
- ถ้าตัวไหนไม่มีไฟล์โลโก้ ให้ใช้สัญลักษณ์แทน แล้ว**ระบุชื่อตัวนั้นไว้ในหมายเหตุท้ายรูป**
- อย่าไปดาวน์โหลดโลโก้ใหม่มาเอง ให้ใช้จากชุดที่มีอยู่ หรือให้ผู้ใช้หาจากหน้า brand ของโครงการนั้น

---

## 8 · เรนเดอร์

```bash
pip install playwright && playwright install chromium
python render.py d01.svg ../01-architecture.png 1400 860
```

เรนเดอร์ที่ 2 เท่าเสมอ เพราะ 1 เท่าได้ภาพเบลอเมื่อขยายในสไลด์

ภาษาไทยต้องมีฟอนต์ไทยในเครื่องที่เรนเดอร์ แล้วประกาศไว้ใน `font-family` ของ `<svg>`
**อย่าใช้ Python Imaging Library (PIL) วาดข้อความไทยปนอังกฤษ** เพราะจะได้กล่องสี่เหลี่ยมแทนตัวอักษร

---

## 9 · วงจรตรวจงาน — ห้ามข้าม

เรนเดอร์ → เปิดไฟล์ภาพดูจริง → แก้ → เรนเดอร์ใหม่ จนกว่าจะสะอาด
**6 ข้อนี้เจอซ้ำทุกครั้ง ให้ตรวจทุกรอบ:**

1. **ป้ายบนเส้นทับไอคอนหรือชื่อ** — ย้ายไปกึ่งกลางช่วงที่ยาวที่สุด หรือย้ายไปบนขาตั้ง
2. **เส้นที่ออกจากไอคอนตัดคำอธิบายของตัวเอง** — เริ่มเส้นที่ `cy+58` ไม่ใช่ `cy+32`
3. **ขอบโซนตัดคำอธิบายแถวล่างสุด** — ขอบล่างโซนต้อง ≥ `R_ล่างสุด + 58 + 24`
4. **ข้อความกำกับโซนนั่งทับเส้นขอบ** — รวมกับชื่อในแคปซูลเดียว
5. **หัวลูกศรไปจบที่ป้ายชื่อ ไม่ใช่ที่ไอคอน** — ให้จบที่ขอบไอคอน
6. **ข้อความล้นกรอบ** — ไทย 11.5px ≈ 6.0 px/ตัว · หัวเรื่อง 15px ≈ 7.5 px/ตัว
   ถ้าที่ไม่พอ ให้ตัดคำ **อย่าลดขนาดตัวอักษร**

---

## 10 · ค่าคงที่ที่ใช้ได้จริง

```
ความกว้าง 1400 · ขอบ 56
หัวเรื่องกลางหน้า 22 · คำอธิบายใต้หัว 12.5
ชื่อหน่วย 11.5 ตัวหนา · คำอธิบาย 10 · ป้ายบนเส้น 10.5
เส้นเชื่อม 1.6 · ขอบโซน 1.4 · รัศมีมุมโค้ง 14 · ป้ายสูง 21
```

---

## 11 · แถบสัญลักษณ์

ทุกรูปปิดท้ายด้วยแถบเดียวที่บอกว่ากรอบแต่ละแบบคืออะไร และป้าย 2 สีต่างกันตรงไหน
แล้วต่อด้วยหมายเหตุ 2–4 บรรทัด ซึ่งรวมบรรทัดเรื่องเครื่องหมายการค้า และการอ้างถึงรูปอื่นที่เกี่ยวข้อง

---

## ตัวย่อ

- **SVG** — Scalable Vector Graphics
- **PNG** — Portable Network Graphics
- **PIL** — Python Imaging Library


## reference: icons.md

# คลังไอคอน — ใช้ร่วมกันทั้งโครง HTML และ SVG/Python engine

**ไอคอนมีให้แล้ว 205 ตัวใน `assets/icons/`** ไม่ต้องติดตั้งอะไรเพิ่ม —
เป็น PNG พื้นโปร่ง 160×160 ซึ่งเป็นไอคอนทางการของผู้ให้บริการและเครื่องมือ แบ่งเป็น 9 กลุ่ม

| โฟลเดอร์ | มีอะไร |
|---|---|
| `icons/aws/` | 39 — EC2 · RDS · S3 · Lambda · ELB · Route 53 · CloudFront · SQS · SNS · IAM · CloudWatch … |
| `icons/azure/` | 24 — VM · App Service · AKS · Cosmos DB · Blob Storage · Key Vault … |
| `icons/gcp/` | 21 — Compute Engine · GKE · Cloud Run · BigQuery · Pub/Sub · Firestore … |
| `icons/k8s/` | 16 — Pod · Deployment · Service · Ingress · ConfigMap · Secret · Node … |
| `icons/data/` | 17 — PostgreSQL · MySQL · MongoDB · Redis · Elasticsearch · ClickHouse … |
| `icons/queue/` | 6 — RabbitMQ · Kafka · Celery · NATS · ActiveMQ · EMQX |
| `icons/infra/` | 26 — Nginx · Docker · HAProxy · Traefik · Istio · firewall · router · Windows · Linux … |
| `icons/ops/` | 19 — Prometheus · Grafana · Jenkins · GitLab CI · GitHub Actions · Terraform · Vault … |
| `icons/app/` | 37 — Angular · React · .NET · Spring · Python · LINE · Slack · Stripe · ผู้ใช้ … |

รายชื่อทั้งหมดอยู่ใน [`assets/icons/INDEX.md`](../assets/icons/INDEX.md) และเปิด [`assets/icons/contact-sheet.html`](../assets/icons/contact-sheet.html) เพื่อดูรูปทั้งหมดในหน้าเดียว

**ถ้าต้องการตัวที่ไม่มีใน 205 ตัวนี้** ให้ค้นในคลังเต็ม `assets/tech-icons.zip` (8,602 ไอคอน · 5 กลุ่ม) ด้วย [`find-icon.py`](../assets/find-icon.py) ซึ่งไม่ต้องติดตั้งอะไรและไม่ต้องแตกทั้งก้อน

| กลุ่ม | มีอะไร |
|---|---|
| `cloud/` | 1,986 PNG · AWS · Azure · Google Cloud · IBM · Oracle · Alibaba · DigitalOcean · Firebase … |
| `platform/` | 471 PNG · ฐานข้อมูล · คิว · CI/CD · เฝ้าระวัง · Kubernetes · ภาษาโปรแกรม · GIS |
| `brands/` | 3,461 SVG สีเดียว · โลโก้แบรนด์ + รหัสสีทางการใน `colors.json` |
| `devtools/` | 572 SVG มีสี · โลโก้เครื่องมือนักพัฒนา |
| `ui/` | 2,112 SVG ไอคอนเส้นทั่วไป (Lucide) ไม่ใช่โลโก้ |

```bash
python assets/find-icon.py kafka redis                       # ค้นชื่อ
python assets/find-icon.py --group ui user                    # ค้นเฉพาะกลุ่ม
python assets/find-icon.py --copy cloud/aws/compute/ec2.png brands/docker.svg --to docs/figures/icons
python assets/find-icon.py --colors docker                    # สีทางการของโลโก้
```

ให้ดึงมาเฉพาะตัวที่ใช้แล้ววางไว้ข้างไฟล์รูป ห้ามแตกทั้งคลังลงโปรเจกต์ สัญญาอนุญาตของคลังคือ MIT · CC0 · ISC (ดู `--groups`) แต่โลโก้ยังเป็นเครื่องหมายการค้าของเจ้าของ

> **เรื่องสัญญาอนุญาต** — ชุดไอคอนสถาปัตยกรรมของ AWS · Azure · Google Cloud
> เผยแพร่มาเพื่อใช้วาดผังสถาปัตยกรรมโดยเฉพาะ จึงใช้ในเอกสารข้อเสนอได้
> สิ่งที่ทำไม่ได้คือใช้โลโก้ในลักษณะที่ทำให้เข้าใจว่าผู้ให้บริการรับรองหรือร่วมงานด้วย
> และใช้เป็นส่วนหนึ่งของแบรนด์ตัวเอง ส่วนถ้าไม่มีไอคอนทางการของเครื่องมือนั้น ให้วาดไอคอนเส้นเองตาม [SKILL.md](../SKILL.md) ข้อ 6


## reference: layout-cloud.md

# โครง `figure-cloud.html` — ผังคลาวด์พร้อมโลโก้ผู้ให้บริการ

โครงนี้ตอบคำถาม "ใช้บริการอะไรของคลาวด์บ้าง" ไฟล์โครงอยู่ที่ [`assets/figure-cloud.html`](../assets/figure-cloud.html)

ใช้เมื่อผู้อ่านคาดหวังจะเห็นไอคอน Amazon Web Services (AWS) · Azure · Google Cloud ·
Kubernetes ของจริง แบบผังอ้างอิงที่ผู้ให้บริการเผยแพร่ ไอคอนหาได้จากคลังตาม [icons.md](icons.md)

```html
<div class="unit"><img src="icons/aws/ec2.png" alt="">
  <div class="name">Web Server</div><div class="desc">AZ-1</div></div>
```

**กติกาเฉพาะโครงนี้:**

- **สายที่ข้ามขอบเขต ให้ออกจากขอบของกล่องขอบเขต** (`n-region`) ไม่ใช่จากกล่องข้างใน
  — เพราะถ้าต่อจากกล่องข้างใน เส้นจะพาดทะแยงทับทุกอย่างที่ขวางทาง
- **เส้นประ = ขอบเขตที่ผู้ให้บริการจัดการให้** ส่วนเส้นทึบสีส้ม = เครื่องที่เราดูแลเอง
  และให้ใส่ความหมายไว้ในคำอธิบายสัญลักษณ์เสมอ
- ไอคอนแสดงเปล่า ๆ ไม่ต้องมีกรอบ เพราะโลโก้มีสีและรูปทรงของตัวเองอยู่แล้ว
- ชื่อบริการใช้ชื่อทางการ (`Amazon RDS`) ส่วนคำอธิบายใต้ชื่อเป็นภาษาไทยได้


## reference: layout-context.md

# โครง `figure-context.html` — ระบบกับโลกภายนอก

ตอบคำถาม "ระบบนี้คุยกับใครและกับอะไรข้างนอกบ้าง" (C4 ระดับ 1) ไฟล์โครงอยู่ที่ [`assets/figure-context.html`](../assets/figure-context.html)

```
┌─ หัวรูป ────────────────────────────────────────────────────────┐
│  ผู้ใช้งาน (แถบนอน)   →   ระบบที่อธิบาย (การ์ดใหญ่)   ←   ระบบภายนอก  │
│  ─ เจ้าหน้าที่           ─ ชื่อ + คำขยาย                ─ external system │
│  ─ แพทย์                ─ หน้าที่ 3-6 ข้อ               ─ ชื่อ + สถานะ    │
│  ─ ผู้ดูแล               ─ ป้ายข้อจำกัด                                │
├─ คำอธิบายสัญลักษณ์ ─────────────────────────────────────────────┤
│  เชิงอรรถ — ความหมายเส้นประ · ตัวย่อทั้งหมด · รูปถัดไป              │
└────────────────────────────────────────────────────────────────┘
```

- **ผู้ใช้งานอยู่ซ้าย ส่วนระบบภายนอกอยู่ขวา** และไม่ปนกัน เพราะคนกับเครื่องเป็นคนละชนิด
- **หน้าที่ในการ์ดกลางมี 3 ถึง 6 ข้อ** ถ้าเกินนี้ แปลว่ากำลังเขียน SRS ไม่ใช่วาดรูป
- **ระบบภายนอกที่ยังไม่ได้เชื่อม** ให้ใช้เส้นประ (`planned:true`) แล้วเขียนไว้ในการ์ดว่าอยู่ในแผนเวอร์ชันไหน
  — เพราะรูปที่วาดเฉพาะของที่มีแล้วจะถูกถามซ้ำทุกรอบว่า "แล้วเชื่อม HIS หรือยัง"
- **มีคำอธิบายสัญลักษณ์เสมอ** เมื่อรูปทรงหรือเส้นสื่อความหมาย
- **ตัวย่อเขียนเต็มที่เชิงอรรถ** เพราะผู้อ่านฝั่งลูกค้าไม่รู้ว่า SEG คืออะไร


## reference: layout-deployment.md

# โครง `figure-template.html` — deployment · ข้างในเครื่อง

ตอบคำถาม "ของจริงรันอยู่บนเครื่องอะไร มีอะไรอยู่ข้างใน" ไฟล์โครงอยู่ที่ [`assets/figure-template.html`](../assets/figure-template.html)

โครงนี้มี 3 คอลัมน์ เรียงซ้ายไปขวาตามทิศที่ข้อมูลไหล:

```
┌─ หัวรูป ───────────────────────────────────────────────┐
│  ชื่อ + คำขยาย                    เลขรูป · เวอร์ชัน · เจ้าของ  │
├────────────┬──────────────────────────┬────────────────┤
│ นอกระบบ    │  ⬅ กล่อง .focus           │ ปลายทาง        │
│ คน อุปกรณ์  │  สิ่งที่เอกสารนี้อธิบาย       │ ข้อบังคับ       │
│ ระบบอื่น    │  ซ้อนได้อีก 1 ชั้น          │ ของที่ไหลออก    │
├────────────┴──────────────────────────┴────────────────┤
│ เชิงอรรถ — รูปอื่นที่เกี่ยวข้อง · ที่มาของไอคอน              │
└────────────────────────────────────────────────────────┘
```

**ซ้อนกล่องได้ไม่เกิน 3 ชั้น** คือ คอลัมน์ → กล่องใหญ่ → กล่องย่อย
ถ้ามีชั้นที่ 4 แปลว่ารูปนี้ตอบ 2 คำถาม ให้แยกเป็น 2 รูป

**กล่อง `.focus` มีได้กล่องเดียวต่อรูป** ถ้ามี 2 กล่อง แปลว่ายังไม่ได้ตัดสินใจว่ารูปนี้เรื่องอะไร


## reference: layout-flow.md

# โครง `figure-flow.html` — ข้อมูลไหลผ่านอะไร ตามลำดับไหน

ตอบคำถาม "ข้อความ 1 ชิ้น (คำขอ · งาน · เอกสาร) วิ่งผ่านอะไรบ้าง ตามลำดับไหน" ไฟล์โครงอยู่ที่ [`assets/figure-flow.html`](../assets/figure-flow.html) · ตัวอย่างที่เรนเดอร์แล้ว [`assets/figure-flow-example.png`](../assets/figure-flow-example.png)

```
┌─ หัวรูป ──────────────────────────────────── ①–⑥ ความหมายเลขลำดับ ┐
│ ┌ผู้ใช้┐   ┌ช่องทาง┐    ┌ เครื่องที่รัน (เทา) ─────────┐   ┌ บริการภายนอก ┐ │
│ │ คน  │①→│ เว็บ   │②→ │ ┌ ระบบ .focus (สีหลัก) ┐ │③→ │ AI · API     │ │
│ │ คน  │①→│ LINE  │②→ │ │ ชั้น · หน้าที่         │ │   └─────────────┘ │
│ │ คน  │ →│ หลังบ้าน│ → │ │ ชั้น · หน้าที่         │ │④→ ┌ ข้อมูล ──────┐ │
│ └────┘   └──────┘    │ └──────────────────────┘ │   │ ไฟล์ · DB    │ │
│                       └─────────────────────────┘   └─────────────┘ │
├─ เชิงอรรถ: ความหมายพื้นสีอ่อน · เส้นประ · ตัวย่อทั้งหมด ───────────────┤
```

## สี — มาจากสีหลักของโปรเจกต์ตัวเดียว

- แก้ `--accent` ใน `:root` ที่เดียว แล้วเฉดเข้ม พื้นอ่อน และสีตัวหนังสือบนพื้นสีหลักคำนวณให้เอง (สีสว่างเช่นเหลือง สคริปต์จะสลับตัวหนังสือเป็นสีเข้มให้อ่านออก)
- หาสีหลักตามลำดับใน SKILL.md ข้อ 5 · ลองสีอื่นโดยไม่แก้ไฟล์: เปิด `figure-flow.html#accent=0F8B8D`
- **สีหลักใช้กับ 4 อย่างเท่านั้น:** ขอบกล่อง `.focus` · ป้ายชื่อระบบ · เส้นทางข้อมูลกับเลขลำดับ · ชื่อโปรเจกต์ในหัวรูป
- โครงที่เหลือเป็นเทากลาง — กลุ่มเส้นประ กล่องเครื่องที่รัน การ์ด ส่วนไอคอนใช้ 7 สีความหมายเดิม (ข้อ 5)

## กติกา

- **ทิศเดียว ซ้าย → ขวา**: ผู้ใช้ → ช่องทาง → ระบบ → ของที่ระบบเรียกใช้ ถ้ามีเส้นย้อนกลับ ให้บอกในคำอธิบายชั้น (เช่น "push คำตอบกลับ LINE") แทนการลากเส้นย้อน
- **เลขลำดับ = เส้นทางของ 1 ข้อความ** ไม่ใช่เลขเส้น เส้นที่เกิดพร้อมกันใช้เลขเดียวกัน (สองช่องทางเข้า = ② ทั้งคู่) · เส้นทางแยกที่ไม่ได้เกิดทุกครั้ง (เช่นอ่านภาพ) ไม่ต้องมีเลข
- **ชั้นในกล่องระบบ 5–9 ชั้น** เรียงตามลำดับที่ข้อความผ่าน · ชื่อชั้นสั้น หน้าที่ 1–2 บรรทัด ถ้าเกิน 9 ชั้น แยกเป็นรูปข้างในระบบอีกรูป
- **ชั้นเน้น `.guard` ไม่เกิน 2 ชั้น** และเขียนความหมายไว้ที่เชิงอรรถ
- **เส้นต่อเข้าชั้นที่ทำงานนั้นจริง** ไม่ใช่ขอบกล่องใหญ่ — เส้นวาดอยู่บนกล่อง หัวลูกศรจึงถึงชั้นข้างใน
- **เส้นที่ใช้ช่องว่างเดียวกันต้องไม่ตัดกัน** — เลื่อนช่วงหักด้วย `mx` (เส้นที่ปลายอยู่สูงกว่าให้ `mx` น้อยกว่า) แล้วเรนเดอร์ดูทุกครั้ง
- ป้ายบนเส้นเป็นคำสั้น 1–3 คำบอกว่าอะไรไหลผ่าน (`HTTPS` · `webhook` · `ถาม LLM`) · ต้นเส้นมีเลขลำดับ ให้ใช้ `lp:"start"` เมื่อช่วงท้ายสั้นเกิน


## reference: pitfalls.md

# กับดักที่เจอจริง — โครง HTML

อาการที่เจอซ้ำเมื่อทำรูปด้วยโครงใน `assets/` พร้อมสาเหตุและทางแก้ ส่วนกับดักของ SVG/Python engine อยู่ใน [engine-svg-python.md](engine-svg-python.md) ข้อ 9

| อาการ | สาเหตุ · ทางแก้ |
|---|---|
| หัวลูกศรหายทั้งรูป | สคริปต์ลบ `path` ทุกตัวก่อนวาดใหม่ รวมถึงสามเหลี่ยมหัวลูกศรที่อยู่ใน `<defs>` — ลบเฉพาะ `path.wire` (โครงแก้ไว้แล้ว) |
| เส้นลากไปผิดกล่อง | `id` ไปติดกล่องอื่นที่หน้าตาเหมือนกัน — เปิด console ดู `wire: ไม่พบ id` และตรวจว่า `id` ไม่ซ้ำ |
| เส้นจ่อกลางกล่องสูง แล้วพาดทับของข้างใน | ใส่ `tp` / `fp` ให้เส้นเข้าใกล้ขอบบน |
| สระไทยหาย | เครื่องไม่มีฟอนต์ไทยในรายการ — ติดตั้ง Noto Sans Thai หรือเพิ่มฟอนต์ที่มีเข้าไปในรายการ |
| ภาพเบลอในสไลด์ | เรนเดอร์ด้วยตัวคูณ 1 |
| รูปมีขอบขาวเยอะ | ถ่ายทั้งหน้าแทนที่จะถ่ายเฉพาะ `.sheet` |
| แก้ข้อความแล้วเส้นหลุด | เขียนพิกัดเส้นตายตัวแทนที่จะใช้ `WIRES` |
| ป้ายบนเส้นทับกล่อง หรือบังเส้นจนมองไม่เห็น | ป้ายกว้างกว่าช่องว่างระหว่างคอลัมน์ — เพิ่ม `gap` หรือตัดคำในป้ายให้สั้นลง |
| ชื่อกล่องภาษาไทยตกบรรทัดสอง | คอลัมน์แคบไป — เพิ่มความกว้างคอลัมน์นั้น อย่าลดขนาดตัวอักษร |
| ใช้ไอคอนเป็นไฟล์ภาพแล้วเส้นลากผิดตำแหน่งทั้งรูป | สคริปต์คำนวณก่อนรูปโหลดเสร็จ — เรียก `draw()` ใน `window.onload` ไม่ใช่ตอนอ่านสคริปต์ (`figure-cloud.html` ทำไว้แล้ว) |
| เส้นหักมุมใน `figure-flow.html` ตัดกันเอง | หลายเส้นใช้ช่องว่างเดียวกัน — ตั้ง `mx` ให้เส้นที่ปลายอยู่สูงกว่ามีค่าน้อยกว่า แล้วเรนเดอร์ดูใหม่ |
| ลูกศรหายเข้าไปใต้กล่องระบบ | ชั้น `.wires` ไม่มี `z-index` — โครง flow ตั้งไว้แล้ว ถ้าก๊อปไปใช้โครงอื่นต้องตั้งตาม |
| รูปออกมาเป็นสีของรูปตัวอย่าง | ลืมแก้ `--accent` — หาสีหลักของโปรเจกต์ตาม SKILL.md ข้อ 5 ก่อนเรนเดอร์ |
| เส้นพาดทะแยงทับทั้งรูป | ต่อเส้นจากกล่องข้างในกล่องขอบเขต — ต่อจากขอบของกล่องขอบเขตแทน |


## reference: wires.md

# สายเชื่อม — รายละเอียด

เปิดเมื่อเขียน `WIRES` หรือแก้เส้นที่ลากผิด

**ในคอลัมน์เดียวกัน** ให้ใช้ลูกศรลง `.down` ระหว่างกล่อง โดยไม่ต้องเขียนอะไรเพิ่ม

**ข้ามคอลัมน์** ให้ใช้รายการ `WIRES` ท้ายไฟล์ แล้วสคริปต์จะลากเส้นให้หลังจัดหน้าเสร็จ:

```js
{from:"n-browser", fs:"r", to:"n-server", ts:"l", tp:0.10, label:"HTTPS 443"}
//    ^id ต้นทาง   ^ด้านออก  ^id ปลายทาง  ^ด้านเข้า ^ตำแหน่งบนขอบ 0=บน 1=ล่าง
```

ที่ต้องคำนวณหลังจัดหน้า เพราะตำแหน่งกล่องขึ้นกับความยาวข้อความไทย
ถ้าเขียนพิกัดตายตัวไว้ พอแก้ข้อความทีเดียวเส้นจะหลุดทั้งรูป

**กติกา:**

- **เส้นวิ่งแนวตั้งหรือแนวนอนเท่านั้น และหักมุมด้วยมุมโค้ง** — ฟังก์ชัน `elbow()` ในโครงทำให้เอง (นอน → ตั้ง → นอน) ใช้ `mx` เลื่อนช่วงหักเมื่อหลายเส้นใช้ช่องเดียวกัน อย่าเขียน `path` เป็นเส้นตรงจากจุดถึงจุด เพราะกล่องสองข้างสูงไม่เท่ากันแล้วเส้นจะเฉียง
- **ป้ายต้องแคบกว่าช่องว่างระหว่างคอลัมน์** ไม่อย่างนั้นป้ายจะทับกล่องหรือบังเส้นจนหาย ถ้าป้ายยาวขึ้น ต้องเพิ่ม `gap` ของ `.stage` ตามไปด้วย
- เลื่อนป้ายไปตามเส้นได้ด้วย `lp` (0 = ต้นทาง · 1 = ปลายทาง · ไม่ใส่ = กลางเส้น)
- เส้นที่ยังไม่ได้เชื่อมจริง ให้ใช้ `planned:true` เพื่อได้เส้นประ แล้ว**เขียนความหมายไว้ที่เชิงอรรถ**
- เส้นข้ามคอลัมน์ **ไม่เกิน 5 เส้น** ต่อรูป เพราะเกินนี้รูปจะกลายเป็นใยแมงมุม
- ต่อเข้า**กล่องเล็กที่สุดที่ถูกต้อง** ไม่ใช่กล่องใหญ่ที่ครอบอยู่ ถ้ากล่องสูงมาก ให้ใส่ `tp` เพื่อเลี่ยงไม่ให้เส้นจ่อกลางกล่อง
- ป้ายบนเส้นบอกว่า**อะไรไหลผ่าน** เช่น `HTTPS 443` ไม่ใช่ `เชื่อมต่อ` ส่วนเส้นที่ไม่มีอะไรจะบอก ไม่ต้องใส่ป้ายเลยดีกว่าใส่คำว่า "ใช้"
