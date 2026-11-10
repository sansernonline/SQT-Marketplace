---
name: "api-design"
description: "Design an API spec with the system-analyst agent — endpoints, schemas, errors, examples."
disableModelInvocation: true
---

> **ทางลัดเข้า SuperUser:** เปิด skill `superuser` ด้วย playbook `feature` (หรือ `project-docs` ถ้าทำแค่เอกสาร) แล้วคัดลอกขั้นตอนของ playbook ลง todo ก่อน ส่วนขั้นตอนด้านล่างบอกรูปแบบงานและ output ของคำสั่งนี้ ให้ใช้คู่กับ playbook ไม่ได้ใช้แทน

Use the `system-analyst` agent to design API specifications for: **$ARGUMENTS**

The system analyst should:

0. **Load the rulebooks first** — `api-conventions` (URLs, versioning, pagination, dates, ids, idempotency) and `web-service-essentials` (RFC 9457 error shape, request ids, operational endpoints). The spec follows them; do not invent new rules per document.

1. **Initial Discovery** — gather (unknown → `(รอยืนยัน)`, keep going):
   - User stories / use cases this API supports
   - Consumers (web app, mobile, third-party)
   - Existing API conventions in the codebase
   - Rate limit / SLA requirements
   - Authentication mechanism in use

2. **Design RESTful resources** (or GraphQL types):
   - Identify the nouns (resources)
   - Map verbs to HTTP methods
   - Consider resource hierarchy
   - Plan for pagination, filtering, sorting

3. **For each endpoint, specify:**
   - HTTP method + path
   - Auth requirements
   - Request headers
   - Request body schema with examples
   - Response 2xx schema with examples
   - All error responses (4xx, 5xx)
   - Rate limits
   - Idempotency notes

4. **Check every endpoint against the rulebooks from step 0** (URLs, status codes, pagination per `api-conventions` · errors per `web-service-essentials` §2). Do not restate the rules in the spec

5. **Plan cross-cutting concerns:**
   - Authentication (Bearer? API key? OAuth?)
   - Rate limiting tiers
   - Versioning per `api-conventions`
   - CORS (if browser clients)
   - Idempotency keys for mutations
   - Request ID tracing

6. **Generate examples:**
   - cURL command per endpoint
   - Sample request/response JSON
   - Common error scenarios

7. **Produce polished API spec document** using `polished-document-style` skill:
   - Cover block with version
   - Authentication section
   - Endpoint-by-endpoint reference (use template from system-analyst)
   - Common errors section
   - Versioning policy
   - Rate limiting table

8. **Change protocol** (the spec is the contract consumers test against · idea from ECC contract-first):
   - Spec first, code second — every later change edits the OpenAPI/proto file before any handler, and the diff of that file is what reviewers read
   - Additive changes only in place (new optional field · new endpoint · new enum value the client ignores); rename, remove, type change or new required field → new version or deprecation per `api-conventions` §10
   - Each spec change names its consumers and how they were told (changelog line · deprecation header date)

9. **Hand-off suggestions:**
   - Implementation → `developer`
   - Security review → `security-engineer`
   - Documentation for external devs → `technical-writer`
   - Performance testing → `qa-tester`
