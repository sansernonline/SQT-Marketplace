<!-- merged from skill `saas-platform` on 2026-11-27 · description was: Use when building B2B SaaS with tenants and billing -->
# saas-platform

Enterprise-sold SaaS: multi-tenant · SSO/SCIM · monthly billing · customer onboarding

**Open only the files that match the task.** Do not read them all, because each file is a full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| implementing multi-tenancy in SaaS — row-level isolation, schema-per-tenant, DB-per-tenant, tenant context propagation, noisy neighbor mitigation. Concrete implementation patterns | [`multi-tenancy-patterns.md`](multi-tenancy-patterns.md) |
| integrating with enterprise systems — SSO (SAML/OIDC), SCIM provisioning, webhooks, iPaaS (Zapier, Workato), API client design, or building robust integration platforms | [`enterprise-integration.md`](enterprise-integration.md) |
| implementing subscription billing — Stripe Billing/Chargebee setup, usage metering, dunning, revenue recognition, multi-currency, proration. Covers production patterns for B2B SaaS | [`subscription-billing.md`](subscription-billing.md) |

## คู่มือบทบาท

An agent called to work in this area opens its own role file before starting.

| บทบาท | อ่าน | agent |
|---|---|---|
| designing customer onboarding flows, building in-product help, configuring usage analytics for adoption tracking, building self-service portals, or designing CS tooling | [`agent-customer-success-engineer.md`](agent-customer-success-engineer.md) | `growth-specialist` |
| designing B2B SaaS systems — multi-tenancy patterns, tenant isolation, scalability strategies, region deployment, or evaluating tenant data architectures | [`agent-saas-architect.md`](agent-saas-architect.md) | `solution-architect` |
| building enterprise integrations — SSO (SAML/OIDC), SCIM provisioning, webhooks, API clients, ETL connectors, or any system-to-system integration in B2B SaaS context | [`agent-integration-engineer.md`](agent-integration-engineer.md) | `solution-architect` |
| designing subscription billing, pricing tiers, usage metering, revenue recognition and SaaS revenue metrics (MRR, ARR, NRR, churn) | [`agent-revops-analyst.md`](agent-revops-analyst.md) | `revops-analyst` |

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:domain-systems <saas-architecture-review | integration-design> <details>`

Two modes. Read the first word of **the user's request**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `saas-architecture-review` | Review B2B SaaS architecture using solution-architect agent. Covers multi-tenancy, isolation, scaling. |
| `integration-design` | Design enterprise integration using solution-architect agent. Covers single sign-on (SSO), System for Cross-domain Identity Management (SCIM), webhooks, application programming interface (API) client. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](saas-platform/design-modes.md)
