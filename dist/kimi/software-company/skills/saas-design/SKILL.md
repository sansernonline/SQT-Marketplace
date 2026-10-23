---
name: "saas-design"
description: "Review business-to-business (B2B) software as a service (SaaS) architecture or design an enterprise integration."
disableModelInvocation: true
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `saas-architecture-review` | Review B2B SaaS architecture using solution-architect agent. Covers multi-tenancy, isolation, scaling. |
| `integration-design` | Design enterprise integration using solution-architect agent. Covers single sign-on (SSO), System for Cross-domain Identity Management (SCIM), webhooks, application programming interface (API) client. |

---

## Mode: `saas-architecture-review`

Use `solution-architect` agent to review SaaS architecture for: **$ARGUMENTS**

Workflow:

1. **Discovery:** tenant model, isolation needs, scale, compliance
2. **Apply `saas-platform` skill** for current vs ideal state
3. **Assess tenant isolation:** row/schema/db patterns
4. **Assess noisy neighbor mitigation:** rate limiting, pools
5. **Assess scalability:** horizontal, regional
6. **Assess tenant lifecycle:** provisioning, offboarding, migration
7. **Assess per-tenant features:** config, customization, flags
8. **Identify risks** with severity
9. **Produce polished architecture review** using `polished-document-style` (from superuser)
10. **Hand-off:** implementation → `developer`, `devops-engineer` (from software-company)

---

## Mode: `integration-design`

Use `solution-architect` agent for: **$ARGUMENTS**

Workflow:

1. **Discovery:** target system, direction, volume, latency, compliance
2. **Apply `saas-platform` skill** for protocol/pattern selection
3. **Design auth:** Security Assertion Markup Language (SAML) / OpenID Connect (OIDC), mutual TLS (mTLS), API key as appropriate
4. **Design data flow:** push/pull, real-time/batch, idempotency
5. **Design webhook system** (in/out): signing, retry, dead letter
6. **Plan customer setup flow:** docs, admin user interface (UI), test mode
7. **Plan observability:** per-tenant, per-integration metrics + logs
8. **Plan reliability:** retries, circuit breakers, fallbacks
9. **Produce polished integration spec** using `polished-document-style` (from superuser)
10. **Hand-off:** implementation → `developer`, security → `security-engineer` (from software-company)
