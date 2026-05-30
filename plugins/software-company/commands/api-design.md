---
description: Design API specifications using system-analyst agent. Produces OpenAPI-style spec with endpoints, schemas, errors, and examples.
argument-hint: <feature or API to design, e.g., "user management API">
---

Use the `system-analyst` agent to design API specifications for: **$ARGUMENTS**

The system analyst should:

1. **Initial Discovery** — gather:
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
   - Consistent error envelope
   - Cursor-based pagination for scale (not offset)

5. **Plan cross-cutting concerns:**
   - Authentication (Bearer? API key? OAuth?)
   - Rate limiting tiers
   - Versioning (`/v1/`, `Accept: application/vnd.api+json;version=1`)
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
