---
description: Design enterprise integration using integration-engineer agent. Covers SSO, SCIM, webhooks, API client.
argument-hint: <integration type or system, e.g., "SAML SSO with Okta">
---

Use `integration-engineer` agent for: **$ARGUMENTS**

Workflow:

1. **Discovery:** target system, direction, volume, latency, compliance
2. **Apply `enterprise-integration` skill** for protocol/pattern selection
3. **Design auth:** SAML/OIDC, mTLS, API key as appropriate
4. **Design data flow:** push/pull, real-time/batch, idempotency
5. **Design webhook system** (in/out): signing, retry, dead letter
6. **Plan customer setup flow:** docs, admin UI, test mode
7. **Plan observability:** per-tenant, per-integration metrics + logs
8. **Plan reliability:** retries, circuit breakers, fallbacks
9. **Produce polished integration spec** using `polished-document-style` (from software-company)
10. **Hand-off:** implementation → `developer`, security → `security-engineer` (from software-company)
