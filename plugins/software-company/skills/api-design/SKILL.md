---
name: api-design
description: Design an API spec with the system-analyst agent — endpoints, schemas, errors, examples.
argument-hint: <feature or API to design, e.g., "user management API">
disable-model-invocation: true
---

Use the `system-analyst` agent to design API specifications for: **$ARGUMENTS**

The system analyst should:

0. **Load the rulebooks first** — `api-conventions` (URLs, versioning, pagination, dates, ids, idempotency) and `web-service-essentials` (RFC 9457 error shape, request ids, operational endpoints). The spec follows them; do not invent new rules per document.

1. **Initial Discovery** — gather (unknown → `(รอยืนยัน)`, keep going):
   - User stories / use cases this API supports
   - Consumers (web app, mobile, third-party)
   - Existing API conventions in the codebase
   - Rate limit / SLA requirements
   - Authentication mechanism in use
   - Versioning strategy (URL vs header)

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

4. **Apply REST best practices:**
   - Resource-oriented URLs (`/users/123/orders`, not `/getUserOrders?id=123`)
   - Plural resource names
   - Lowercase, hyphens (not camelCase) in URLs
   - Standard HTTP status codes
   - Errors as RFC 9457 `application/problem+json` (`web-service-essentials` §2)
   - Pagination per `api-conventions`

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

8. **Hand-off suggestions:**
   - Implementation → `developer`
   - Security review → `security-engineer`
   - Documentation for external devs → `technical-writer`
   - Performance testing → `qa-tester`
