---
description: Review B2B SaaS architecture using saas-architect agent. Covers multi-tenancy, isolation, scaling.
argument-hint: <system or area to review>
---

Use `saas-architect` agent to review SaaS architecture for: **$ARGUMENTS**

Workflow:

1. **Discovery:** tenant model, isolation needs, scale, compliance
2. **Apply `multi-tenancy-patterns` skill** for current vs ideal state
3. **Assess tenant isolation:** row/schema/db patterns
4. **Assess noisy neighbor mitigation:** rate limiting, pools
5. **Assess scalability:** horizontal, regional
6. **Assess tenant lifecycle:** provisioning, offboarding, migration
7. **Assess per-tenant features:** config, customization, flags
8. **Identify risks** with severity
9. **Produce polished architecture review** using `polished-document-style` (from software-company)
10. **Hand-off:** implementation → `developer`, `devops-engineer` (from software-company)
