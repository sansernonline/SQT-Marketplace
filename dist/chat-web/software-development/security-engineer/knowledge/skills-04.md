# skill: web-service-essentials

Use when building an HTTP backend, login, config, uploads or audit

# web-service-essentials — the basic parts every HTTP backend needs before its first business endpoint

> **The one rule:** before writing the first business endpoint, the service must be able to answer "Are you still alive? · Are you ready for work? · Which version are you running now?" If it cannot, on the day the system goes down you will be guessing blind.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| New service, health check, ping, readiness, version endpoint, graceful shutdown, one error format | This file: sections 1 to 4 |
| Login with sessions, JWT, OAuth, SSO, MFA, passwords, lockout | [`references/auth-implementation-patterns.md`](references/auth-implementation-patterns.md) · [`references/auth-flows.md`](references/auth-flows.md) · [`references/mfa.md`](references/mfa.md) · [`references/api-auth-and-authorization.md`](references/api-auth-and-authorization.md) |
| Settings differ by environment, secrets must stay hidden, `.env` files | [`references/config-and-secrets.md`](references/config-and-secrets.md) |
| Users upload files, or the app serves stored files | [`references/file-upload-and-storage.md`](references/file-upload-and-storage.md) |
| The system must record who did what and when | [`references/audit-trail.md`](references/audit-trail.md) |
| Ready-made libraries and sample code | [`references/libraries-and-code.md`](references/libraries-and-code.md) |
| Stack-specific setup (.NET, Angular, Node, Python) | [`references/per-stack.md`](references/per-stack.md) |

## When to use this skill

- Starting a new service / REST API / microservice
- Someone asks for a health check, ping, readiness, liveness, or version endpoint
- Deploying to production for the first time, or moving into Docker/Kubernetes
- You must set one API error format for the whole system

## When **not** to use it

- To design business endpoints, use the command `/api-design`
- For URL style · paging · dates · API ids, use `api-design`
- For log format, use `errors-and-logs`
- To choose an architecture, use `architecture`
- To check responses against OpenAPI in CI or catch breaking changes, see `api-design` [`references/contract-testing.md`](../api-design/references/contract-testing.md)

---

## 1 · The 4 basic endpoints

| Endpoint | What it answers | auth | Checks dependencies | Who calls it |
|---|---|:---:|:---:|---|
| `GET /ping` | `pong` (text) | no | no | load balancer, every second |
| `GET /health/live` | the process is still alive | no | **no** | orchestrator (restarts if dead) |
| `GET /health/ready` | ready to take traffic | no | yes | orchestrator (removes from the pool) |
| `GET /version` | what is running | no* | no | a person, when tracing a problem |

> **live must not check dependencies.** This is the most common mistake.
> If `/health/live` checks the database (DB) and the DB goes down briefly, Kubernetes will **kill every pod**
> even though the app itself is fine. When the DB comes back, no pod is left to take traffic.
> The dependency check belongs in `/health/ready`, which only removes a pod from the pool for a while.

\* If you do not want the public to see the commit hash in `/version`, restrict it so only the internal network can call it.

**Wire it to Kubernetes like this** — live and ready must point to different paths, or the point above means nothing.

```yaml
livenessProbe:            # dead → restart the container
  httpGet: { path: /health/live, port: 3000 }
  initialDelaySeconds: 15 # let the app start first, or it gets killed before it can listen
  periodSeconds: 10
  failureThreshold: 3     # restart only after 3 failures in a row (30 seconds)
readinessProbe:           # not ready → remove from the Service for a while, no restart
  httpGet: { path: /health/ready, port: 3000 }
  initialDelaySeconds: 5
  periodSeconds: 10
```

For an app with a long warm-up (loading a model · a big cache), add a `startupProbe` pointing to `/health/live` with a high `failureThreshold`, instead of stretching the liveness `initialDelaySeconds`.

### Response shape (the same in every language)

```jsonc
// GET /health/ready → 200 normally · 503 when a critical dependency is down
{
  "status": "up",                       // up | degraded | down
  "timestamp": "2026-08-31T09:42:13.482Z",
  "checks": {
    "db":    { "status": "up",   "durationMs": 12 },
    "redis": { "status": "up",   "durationMs": 3 },
    "mail":  { "status": "down", "durationMs": 3001, "error": "smtp timeout" }
  }
}
```

```jsonc
// GET /version → 200
{
  "name": "orders-api", "version": "1.4.0", "commit": "abc1234",
  "buildTime": "2026-08-31T09:00:00Z", "env": "production", "host": "pod-7f9c"
}
```

**3 states, not 2:**
- `up` — everything is normal → 200
- `degraded` — a **non-critical** dependency is down (such as email) but the service can still take traffic → 200
- `down` — a critical dependency is down (such as the DB) → **503**

**Every check must have a timeout** (default 3 seconds). Otherwise a hung dependency
makes the health endpoint hang too, and the orchestrator makes the wrong decision for the whole system.

**Never send a stack trace or connection string out through these endpoints**, because anyone can call them.

---

## 2 · One error format for the whole system

Follow **RFC 9457 (`application/problem+json`)**, which is a real standard, so you do not invent your own.

```jsonc
// 422 — the format is right, but the data fails a rule (see the table below)
{
  "type": "https://api.example.com/errors/validation",
  "title": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
  "status": 422,
  "detail": "จำนวนสินค้าต้องมากกว่า 0",
  "instance": "/api/v1/orders",
  "requestId": "a3f9c1b2",              // matches the cid in the log — trace the case at once
  "errors": [                           // validation only · every field in one response
    { "field": "items[0].qty", "code": "min_value", "message": "ต้องมากกว่า 0" }
  ]
}
```

- `field` is the full path including array indexes · `code` is for programs · `message` is for people

| Status | Use when |
|---|---|
| 400 | Malformed data |
| 401 | Not yet authenticated |
| 403 | Authenticated but not allowed |
| 404 | The thing does not exist |
| 409 | Conflicts with current state (duplicate, overwrite) |
| 422 | Format is right but breaks a business rule |
| 429 | Called too often — must have `Retry-After` |
| 500 | Our side broke — **never send internal details out**, send `requestId` instead |

> **A 500 must say only "an error occurred, please report this requestId".** The real details stay in the log.
> Sending a stack trace out is like handing the system's blueprint to someone looking for a way in.

---

## 3 · Request id

- Accept it from the **`X-Request-Id`** header only when it matches `^[A-Za-z0-9-]{1,64}$` · if it is missing or does not match → create a new one (a uuid cut to 8 characters).
  This value goes into every log line. If you accept it as is, the sender can insert new lines or fake text into the log (log injection).
- **Return it in a response header every time**, including on errors.
- Put it in every log line (see `errors-and-logs`) and in the error body.
- Pass it on to the downstream service every time you call across systems.

When a customer calls to say "it broke", ask for the requestId and `grep` once to find the whole story.

---

## 4 · Graceful shutdown

On a new deploy the orchestrator sends `SIGTERM`. If the app dies at once, requests in progress are cut off midway.

```
SIGTERM → 1. Stop accepting new requests (make /health/ready answer down at once)
          2. Wait for in-flight requests to finish (timeout 15–30 seconds)
          3. Close the DB pool / queues / files
          4. exit(0)
```

> Step 1 matters more than it looks. `/health/ready` must answer `down` about 5 seconds **before** the real shutdown,
> so the load balancer removes us from the pool in time. Otherwise traffic keeps arriving while we are closing.

---

## 5 · What must exist before deploy (not optional)

- **Timeouts everywhere**: incoming requests, outgoing calls, and DB queries. Without a timeout, the moment a downstream is slow, the whole system hangs with it.
- **Limit body size** (for example 1MB) to stop memory blowing up from a large payload.
- **Cross-Origin Resource Sharing (CORS) names the origin explicitly** — `*` is allowed only for a public API with no cookies.
- **Rate limit** at least on the login endpoint and on anything that sends a one-time password (OTP)/email.
- **Security headers**: `X-Content-Type-Options: nosniff` · `Content-Security-Policy: frame-ancestors 'none'` (replaces the old `X-Frame-Options` header · also add `X-Frame-Options: DENY` for old browsers) ·
  `Strict-Transport-Security` (HTTP Strict Transport Security · HSTS)
  Node: `helmet` sets them all in one line · .NET: `UseHsts()` sets only HSTS, and the rest needs a short middleware or the package `NetEscapades.AspNetCore.SecurityHeaders` (example in `references/per-stack.md`)
- **Turn off the full error page in production** (`app.UseDeveloperExceptionPage()` in dev only)
- **Put the version in the path**: `/api/v1/...` from day one, because moving later costs much more.
- **OpenAPI** generated from the real code, not written by hand and then forgotten.

---

## 6 · Ready-made code

| File | Stack | Status |
|---|---|---|
| `assets/health.node.js` | Node / Express | ✓ all 4 endpoints run and tested, plus the degraded/down/timeout cases |
| `assets/health_py.py` | Python / FastAPI | ✓ run and tested the same way, results match on every field |
| `references/per-stack.md` | .NET (ASP.NET Core health checks) + Angular | Caution: not yet compiled or tested |

Usage snippets for the Node and Python routers: [`references/per-stack.md`](references/per-stack.md).

---

## 7 · Check the work

```bash
curl -i localhost:8080/ping                    # 200 pong
curl -s localhost:8080/health/live  | jq
curl -s localhost:8080/health/ready | jq
curl -s localhost:8080/version      | jq

# stop the DB and call again — ready must be 503 but live must still be 200
docker stop mydb && curl -i localhost:8080/health/ready && curl -i localhost:8080/health/live
```

- [ ] `/health/live` does **not** touch the DB — it still answers 200 with the DB stopped
- [ ] `/health/ready` answers 503 when a critical dependency is down
- [ ] When a non-critical dependency is down, the result is `degraded` + 200 (still takes traffic)
- [ ] Every check has a timeout — make a dependency hang, and the endpoint must answer within ~3 seconds
- [ ] `/version` matches the commit actually deployed
- [ ] Every response has `X-Request-Id`, including a 500
- [ ] Trigger a 500 and confirm no stack trace / connection string leaks out
- [ ] After `SIGTERM`, in-flight requests finish before the app closes
- [ ] `/ping` is not written to the log (or the file fills up with pings)

## Check before done

- **Never** store passwords in plain text or with MD5, SHA-1 or raw SHA-256. Use Argon2id, or bcrypt with cost 12 or more.
- **Never** put a secret in git, in a log, or in a file sent to the browser. Log only "set" or the last 4 characters of a secret.
- **Never** use the file name the user sent as the stored name. Check the file's real contents, not its extension, and strip EXIF location data from photos.
- **Never** edit or delete an audit record. Write a correction entry instead, and never record passwords, tokens, ID card numbers or health data in it.
- Every request, outgoing call and database query has a timeout, and the sections 5 and 7 checks pass before deploy.


## reference: api-auth-and-authorization.md

# API Authentication และ Authorization Patterns

How each type of API authentication works, principles for managing API keys, and examples of RBAC and ABAC

## Pattern 7: API Authentication

| Method | Use case | Token format |
|--------|----------|--------------|
| **API Keys** | Server-to-server, simple | `sk_live_xxx` |
| **OAuth 2.0 Client Credentials** | Service-to-service | JWT bearer |
| **mTLS** (both sides present certificates) | High-security, internal | X.509 certs |
| **HMAC signing** | Webhook verification | `HMAC-SHA256` |

### API Key best practices
- Prefix with environment: `sk_test_xxx`, `sk_live_xxx`
- Show the secret ONCE, when it is created
- Store it hashed (like a password)
- Allow scopes/permissions per key
- Allow expiry and replacement
- Show when each key was last used
- Let users revoke a key instantly

## Authorization Patterns (after authentication)

### RBAC (Role-Based Access Control)
```
User → Role → Permissions
e.g., user@example.com → admin → [users.read, users.write, billing.read]
```

### Enforcing a role on an endpoint
- Check on the server in middleware before the handler runs; never trust a role sent by the client
- Deny by default: a route with no rule is closed
- No or bad credentials → `401`; signed in but without the role → `403`; do not reveal whether the resource exists
- Test both: a request without the role gets `403`, one with it gets `200` (name tests after the rule, e.g. `A01_non_manager_gets_403`)

### ABAC (Attribute-Based) — fine-grained
```
Allow if user.department === resource.department AND action === "read"
```


## reference: audit-trail.md

<!-- merged from skill `audit-trail` on 2026-11-27 · description was: Use when a system must record who did what and when -->
# Audit trail

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When to use another skill, or together](#when-to-use-another-skill-or-together)
- [1 · audit log ≠ application log](#1--audit-log--application-log)
- [2 · Fields every entry must have](#2--fields-every-entry-must-have)
- [3 · Which events to record](#3--which-events-to-record)
- [4 · How to record "what changed"](#4--how-to-record-what-changed)
- [5 · Never edit after writing](#5--never-edit-after-writing)
- [6 · Who can view, and what must not be recorded](#6--who-can-view-and-what-must-not-be-recorded)
- [7 · Show it to people](#7--show-it-to-people)

> **One rule:** a trail cannot be built after the fact.
> The day a customer asks "who changed this price", if it was not recorded beforehand, it can never be answered.

## When to use this skill

- The system has approvals, money, user permissions, or personal data
- A customer or auditor can ask "who did it, when, and what was changed from what to what"
- There was a dispute over edited data and nobody could answer
- The system falls under the Personal Data Protection Act (PDPA) or a standard that must be checkable after the fact

## When to use another skill, or together

| Job | skill | |
|---|---|---|
| Logs for technical troubleshooting | `errors-and-logs` | instead |
| Metrics and alerts | `incidents-and-monitoring` | instead |
| Columns `created_by` `updated_at` in working tables | `database-design` | instead |
| Permissions and identity verification | `auth-implementation-patterns.md` | instead |
| Consent and data-subject rights | `pdpa-compliance` | instead |
| Requirements on what to keep and for how many years | `requirements-writing` | together |

---

## 1 · audit log ≠ application log

| | application log | **audit log** |
|---|---|---|
| Who reads it | developers, when troubleshooting | auditors · customers · the legal team |
| What it records | anything that helps troubleshooting | **only events with business meaning** |
| Where it is kept | files · a log collection system | **a table in the database**, or storage that cannot be overwritten |
| Lifetime | 7–90 days | **years, as the law or contract requires** |
| Can it be edited | does not matter | **never edit, never delete** |
| Can it be lost | some loss is acceptable | **cannot be lost.** If the write fails, the transaction must fail with it |

> **Always keep these 2 separate.** An audit log mixed into the general log files
> gets deleted by the log retention period within a month, and nobody finds it when it is needed.

---

## 2 · Fields every entry must have

| Field | Example | Note |
|---|---|---|
| `id` | UUIDv7 | sortable by time |
| `occurred_at` | `2026-09-25T09:42:13.482Z` | **UTC**, and the time it happened, not the time it was recorded |
| `actor_id` | `1042` | the user id, not the name, because names can change |
| `actor_type` | `user` · `system` · `api_client` | automated jobs need an identity too |
| `actor_ip` · `user_agent` | | keep only when needed for the audit |
| `action` | `order.cancelled` | **a past-tense verb**, in one style across the system |
| `entity_type` · `entity_id` | `order` · `1042` | the thing acted on |
| `changes` | `{"status":{"from":"confirmed","to":"cancelled"}}` | only the fields that changed |
| `reason` | "ลูกค้าโทรแจ้งยกเลิก" (customer phoned to cancel) | required for actions that need a reason |
| `correlation_id` | `01J9Z8…` | links back to the application log |
| `result` | `success` · `denied` | **denied attempts must be recorded too** |

> **A denied action is worth more than a successful one**, because someone trying to reach something
> they have no right to is what auditors most want to see, and it is the best warning sign there is.

---

## 3 · Which events to record

**Record:**

| Group | Examples |
|---|---|
| money and contracts | create/cancel/refund · price change · discount change |
| approvals | approve · reject · send back for fixing |
| permissions and identity | grant/revoke permission · create/close account · change password · consecutive failed logins |
| personal data | view · edit · export · delete |
| system settings | changing a value that affects the whole system |
| bulk data access | exporting a report · downloading a name list |

**Do not record:** ordinary screen views · searches · sorting · clicks that change nothing.
An audit log that records everything is worth the same as none, because nothing can be found in it.

**Name actions in one style across the system:** `<entity>.<past-tense verb>`, for example `order.cancelled` · `user.role_granted` ·
`invoice.exported` · `patient_record.viewed`

---

## 4 · How to record "what changed"

| Method | Good | Bad |
|---|---|---|
| **Record only the changed fields (from/to)** ✓ | small, readable at once | to see the whole picture you must trace back |
| Record the whole row before and after | full picture | grows very fast and risks keeping more sensitive data than needed |
| Record only that "it was edited" | smallest | **cannot answer the question**, so do not use it |

```jsonc
"changes": {
  "status":       { "from": "confirmed", "to": "cancelled" },
  "total_amount": { "from": "1250.00",   "to": "0.00" }
}
```

**For sensitive fields, record only that it changed, not the value:**

```jsonc
"changes": { "password_hash": { "changed": true } }
```

---

## 5 · Never edit after writing

- Grant the audit table only **INSERT and SELECT**. The account the app uses must have no UPDATE or DELETE permission.
- Write in the same transaction as the real data change. **If the audit write fails, the transaction must fail with it.**
- Never edit history to "tidy up". If a record is wrong, add a correction entry. Do not overwrite.
- A system that needs stronger protection should chain the entries with hashes, to prove nobody inserted or deleted anything.

**Retention** follows the law or the contract. Accounting documents in Thailand usually must be kept 5 years.
When the period ends, move them to cheap storage. Never delete them without someone's approval.

---

## 6 · Who can view, and what must not be recorded

| Topic | Rule |
|---|---|
| Read permission | only roles with an audit duty, and **reading the audit log must also be recorded in the audit** |
| Export | record every time who exported which period |
| **Must not record** | passwords · tokens · ID card numbers · health data · the content of personal data |
| Record instead | point to **which item** was viewed or edited, not the content inside |

> `patient_record.viewed` with the `entity_id` is enough. **Never copy test results into the audit log.**
> Otherwise the audit log becomes the most sensitive data store in the system, without anyone meaning it to.

---

## 7 · Show it to people

The history screen must filter by at least 4 things: **time period · actor · action type · which item**.

Show it as a sentence people can read, not raw JSON (the sample below is the Thai text shown to Thai users: on 25 Sep 2569 [B.E.; 2026] at 16:42, Somchai (sales) cancelled order SO-2026-00042, status: confirmed → cancelled, reason: customer phoned to cancel):

```
25 ก.ย. 2569 16:42  สมชาย (ฝ่ายขาย)  ยกเลิกคำสั่งซื้อ SO-2026-00042
                    สถานะ: ยืนยันแล้ว → ยกเลิก · เหตุผล: ลูกค้าโทรแจ้งยกเลิก
```

Show the time in the viewer's time zone, but store it as UTC (see `i18n-and-locale`).


## reference: auth-flows.md

# ลำดับขั้นของแต่ละ flow

Step-by-step order for session, JWT, OAuth with PKCE and password reset. Use it when writing code, or when reviewing whether the code covers every step. The requirements and mistakes to avoid are in `SKILL.md`

## Pattern 1: Session-Based Auth — Flow

```
1. User submits credentials
2. Server validates, creates session ID
3. Server stores session in Redis/DB
4. Server sets HttpOnly Secure cookie
5. Client sends cookie on every request
6. Server looks up session, identifies user
```

## Pattern 2: JWT — Flow

```
1. User submits credentials
2. Server validates, signs JWT
3. Client stores JWT (in HttpOnly cookie preferred)
4. Client sends JWT on every request (Authorization header or cookie)
5. Server verifies signature, extracts claims
```

## Pattern 3: OAuth 2.0 / OIDC — Authorization Code Flow with PKCE

PKCE = Proof Key for Code Exchange. It stops a stolen code from being swapped for a token.

```
1. App → IdP: /authorize?code_challenge=...
2. User logs in at IdP
3. IdP → App: /callback?code=...
4. App → IdP: /token (with code_verifier)
5. IdP → App: access_token + id_token + refresh_token
```

## Pattern 5: Password reset flow

```
1. User requests reset (enter email)
2. Server: always show "if email exists, link sent" (don't leak)
3. Generate random token (≥ 256 bits), hash it, store with expiry (15 min)
4. Email link with raw token
5. User clicks → /reset?token=...
6. Server hashes input, compares, verifies expiry
7. User sets new password (apply policy)
8. Invalidate all existing sessions
9. Send confirmation email
```


## reference: auth-implementation-patterns.md

<!-- merged from skill `auth-implementation-patterns` on 2026-11-27 · description was: Use when building login with sessions, JWT, OAuth or SSO -->
# auth-implementation-patterns — secure login, token, MFA and authorization choices

## Use when
- Building login/signup/logout or a password reset flow.
- Adding multi-factor authentication (MFA): TOTP, SMS, WebAuthn.
- Choosing session vs token authentication.
- Integrating OAuth or OpenID Connect (OIDC) logins, or single sign-on (SSO) with SAML or OIDC.
- Designing API authentication (API keys, JSON Web Token (JWT), OAuth).
- Reviewing existing auth code for security issues.

## Steps

1. **Choose the pattern by who is authenticating.**
   - Browser user, first-party app → session cookies (`HttpOnly`, `Secure`, `SameSite`). Cross-domain → JWT in an `HttpOnly` cookie, never `localStorage`.
   - Mobile app → OAuth 2.0 PKCE flow.
   - Service-to-service → same org: mTLS or service mesh; external: OAuth 2.0 Client Credentials.
   - Third-party developer → API keys (with rotation) or OAuth.

2. **Sessions (server-rendered apps, monoliths, one domain).** Cookie `HttpOnly` + `Secure` + `SameSite=Lax` (or Strict). Session ID cryptographically random, ≥ 128 bits. Store in Redis with a time-to-live (TTL), not in app memory if more than one instance runs. Idle timeout 30 min, absolute timeout 8–12 hours. Issue a new session ID when privileges change (login, role change). On logout, delete the session from the store. Avoid: session inside a JWT (cannot revoke) · session token in `localStorage` (cross-site scripting (XSS) can steal it) · same ID after login (session fixation).

3. **JWT (microservices, mobile, single-page app (SPA) with a backend API).** JWT is overused: with a single backend, sessions are simpler and safer. Algorithm `RS256` or `ES256`, not `HS256` for distributed systems. Access token 5–15 min. Refresh token lives days, is stored separately, is revocable, and is replaced each time it is used. Required claims `sub`, `iat`, `exp`, `iss`, `aud`. Store in an `HttpOnly Secure` cookie. Have a way to cancel tokens (blocklist, short expiry). Avoid: accepting `alg: none` (check the algorithm explicitly) · skipping signature verification · sensitive data in the payload (base64, not encrypted).

4. **OAuth 2.0 / OIDC ("Login with Google/GitHub", handing login to an identity provider (IdP)).** Always Authorization Code Flow with PKCE, even for confidential clients (steps in [`auth-flows.md`](auth-flows.md)). Validate the `id_token` signature with the IdP's JWKS, and validate `aud`, `iss`, `exp`, `nonce`. Use the `state` parameter against cross-site request forgery (CSRF) and validate it. Match `code_verifier` to `code_challenge`. Use a library (Auth0, Passport.js), do not write your own. Avoid: implicit flow · Resource Owner Password Credentials flow (both deprecated).

5. **MFA.** For a new app use WebAuthn (passkeys) by default (no shared secret to steal). Use TOTP when users need easy standard 2FA. Use SMS or email only as a last resort (SMS is not safe against SIM swap). Details: [`mfa.md`](mfa.md).

6. **Passwords.**
   - Hash with **Argon2id** (preferred) or **bcrypt** with cost ≥ 12. Never MD5, SHA-1, raw SHA-256 or plain text.
   - Policy per NIST SP 800-63B-4 (checked 2026-10-14): minimum **15 characters** when the password is the only factor, **8** when used only inside MFA. Check against breached passwords (Have I Been Pwned (HIBP) API). Allow long passphrases (any maximum at least 64) and special characters. No forced composition rules, no forced regular changes (only on suspected breach).
   - Reset flow: the response is the same whether or not the email exists. Token random, ≥ 256 bits, stored as a hash, expires in 15 minutes. After the new password is set, revoke all old sessions and send a confirmation email. All 9 steps: [`auth-flows.md`](auth-flows.md).

7. **Lockout and rate limiting.** 5 failed attempts in 15 min → lock 15 min; 10 in 1 hour → lock 1 hour; key on IP + email together. Message "Too many failed attempts. Try again in 15 minutes." Never "Account locked." (reveals the account exists). Use existing tools: [`libraries-and-code.md`](libraries-and-code.md).

8. **API authentication.** API key for simple server-to-server · OAuth 2.0 Client Credentials for service-to-service · mTLS for high-security internal · HMAC signing for webhooks. For an API key, show the secret once at creation, store it as a hash, let users revoke it at once. Table: [`api-auth-and-authorization.md`](api-auth-and-authorization.md).

9. **Authorization.** RBAC (Role-Based Access Control) as the main model; ABAC (Attribute-Based Access Control) when permissions depend on data attributes. Check at every endpoint, on the server, using the user from the session or token. Never trust a role sent by the client or JWT claims as the authorization source.

## Check before done
- [ ] Session ID regenerated on login (fixation)
- [ ] CSRF token or SameSite cookie
- [ ] Rate limiting (brute force) and HIBP check or MFA (credential stuffing)
- [ ] Redirect URLs on an allowlist (open redirect)
- [ ] Same error message every time (user enumeration)
- [ ] Constant-time comparison (timing attacks)
- [ ] No token in the URL; header or cookie only
- [ ] Logout invalidates on the server
- [ ] Authorization re-checked after a role change
- [ ] No homemade crypto or auth; no reversible password storage

## References
- [`auth-flows.md`](auth-flows.md) — open when writing session, JWT, OAuth with PKCE or password reset code
- [`mfa.md`](mfa.md) — open when building MFA (TOTP setup, WebAuthn, SMS limits)
- [`api-auth-and-authorization.md`](api-auth-and-authorization.md) — open when designing API keys or RBAC/ABAC
- [`libraries-and-code.md`](libraries-and-code.md) — open when choosing a library or needing hashing and rate-limit samples
- [`sources.md`](sources.md) — NIST source and check date


## reference: config-and-secrets.md

<!-- merged from skill `config-and-secrets` on 2026-11-27 · description was: Use when settings differ by environment or secrets need hiding -->
# Config and secrets

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When to use another skill instead, or together](#when-to-use-another-skill-instead-or-together)
- [1 · Tell config and secret apart first](#1--tell-config-and-secret-apart-first)
- [2 · Order of priority: later values override earlier ones](#2--order-of-priority-later-values-override-earlier-ones)
- [3 · Check at boot: if any value is missing, die at once](#3--check-at-boot-if-any-value-is-missing-die-at-once)
- [4 · Naming environment variables](#4--naming-environment-variables)
- [5 · `.env` and `.env.example`](#5--env-and-envexample)
- [6 · Where to keep secrets](#6--where-to-keep-secrets)
- [7 · Rotation](#7--rotation)
- [8 · When a secret leaks: order matters more than speed](#8--when-a-secret-leaks-order-matters-more-than-speed)
- [9 · Do not let secrets flow out other ways](#9--do-not-let-secrets-flow-out-other-ways)
- [10 · Frontend config: nothing in it is secret](#10--frontend-config-nothing-in-it-is-secret)

> **2 rules:**
> 1. The same code must run in every environment. The only difference is config.
> 2. A secret must not be in git, not in logs, and not in any file sent to the browser.

## When to use this skill

- Starting a project, or adding a new environment.
- You need to store a connection string, API key, certificate, or signing key.
- You find a hardcoded value in code and must move it out.
- A secret leaked into git, or you suspect it did: go to step 8 at once.

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Storing secrets in a pipeline · approval gates | `cicd-and-release` | instead |
| Secrets in a Jenkinsfile (`withCredentials` · single quote) | `cicd-and-release` | together |
| Kubernetes secrets kept out of values.yaml (External Secrets · SealedSecret) | `infra-and-deploy` | together |
| Designing login, tokens, user permissions | `auth-implementation-patterns.md` | instead |
| Keeping sensitive values out of logs | `errors-and-logs` | instead |
| Database connection strings | `database-design` | together |
| Recording a secret leak · steps during the incident | `incidents-and-monitoring` | together |

**How to do it in each language and framework** is in `per-stack.md`.

---

## 1 · Tell config and secret apart first

| | config | secret |
|---|---|---|
| Examples | API address, log level, page size, time zone, feature flag | Database password, API key, token signing key, certificate |
| Allowed in git | ✓ yes | ✗ never |
| Who can see it | The whole team | Only those who need it |
| If it leaks | No harm | Must be revoked and replaced at once |
| Changes how often | With the work | On a rotation schedule |

> **If you cannot decide which one it is, treat it as a secret.** Being too careful costs only a small annoyance.
> But if you guess wrong, the key stays in git history forever.

---

## 2 · Order of priority: later values override earlier ones

```
1. Defaults in code             (safe, really usable for dev)
2. Config file per environment  (appsettings.Production.json, config/production.yaml)
3. Environment variables
4. Secret store                 (Key Vault, Secrets Manager, Kubernetes secret)
5. Arguments at launch          (for troubleshooting only)
```

**Defaults must be safe.** If someone forgets to set a value, the system must run in its strictest mode.
For example `DEBUG=false` · `ALLOWED_ORIGINS=` empty · Transport Layer Security (TLS) on, not the opposite.

---

## 3 · Check at boot: if any value is missing, die at once

> **Important:** this step is worth the most on this page.
> A system that boots with wrong config will break at 2 a.m. in a function that is rarely used.
> A system that **refuses to boot** on wrong config tells you at deploy time, when you can still roll back.

Node zod example: `per-stack.md` section 2. The pattern is a schema that parses `process.env` once at boot, so an invalid value kills the process and names the value.

**What to check:** every value is present · types are right · values are in the accepted range ·
keys are long enough · values banned on production (`JWT_SECRET=dev-secret` must fail).

**Print a config summary at boot:** the value names, and the values that are not secrets.
For a secret, print only "set" or the last 4 characters, never the full value.

---

## 4 · Naming environment variables

```
<system>_<group>_<name>

APP_DB_HOST          APP_DB_PASSWORD
APP_REDIS_URL        APP_SMTP_PASSWORD
APP_FEATURE_NEW_CHECKOUT
```

| Rule | Reason |
|---|---|
| Uppercase with underscores | The convention on every operating system |
| Start with a system prefix | Avoids clashing with the system's `PATH`, `HOME`, `USER` |
| Same name in every environment | Values may differ, but names must not, or every move between environments means editing code |
| Put the unit in the name | `APP_TIMEOUT_SECONDS`, not `APP_TIMEOUT` |
| Do not put the environment name in the variable name | ✗ `APP_PROD_DB_HOST` |

---

## 5 · `.env` and `.env.example`

| File | In git | Role |
|---|:--:|---|
| `.env.example` | ✓ | The list of **all** required values, with explanations and example values that are not real |
| `.env` | ✗ | Real values on each developer's machine |
| `.env.production` | ✗ | **This file should not exist at all**, because production uses a secret store |

```bash
# .gitignore
.env
.env.*
!.env.example
```

```bash
# .env.example
APP_DB_HOST=localhost              # database address
APP_DB_PASSWORD=change-me          # important: the real value is in the team's 1Password vault
APP_JWT_SECRET=                    # important: generate with: openssl rand -base64 48
APP_LOG_LEVEL=debug
```

**Update `.env.example` in the same commit that adds a new value.**
Otherwise the next person who clones hits an error nobody can explain.

> **A `.env` added to `.gitignore` too late:** once the file has been tracked, even once,
> adding it to `.gitignore` later **does not remove it from history.** Run `git rm --cached` and treat the secret as leaked.

**Pre-commit gate**: `.gitignore` blocks only files you know by name, but a key pasted by mistake into code or YAML needs a scanner. Install gitleaks as a pre-commit hook in every repo (`gitleaks git --pre-commit --staged` in gitleaks 8.19 and later · earlier versions use `gitleaks protect --staged`) and rerun it in CI over the whole history with `gitleaks git --redact`. If the hook fails, never use `--no-verify`; move the value out first. If you find one in history, go to step 8 at once, not just delete the line.

---

## 6 · Where to keep secrets

| Situation | Use | Note |
|---|---|---|
| Developer machine | A `.env` that stays out of git; for .NET use `dotnet user-secrets` | Never use production values |
| Small team sharing | The team's password manager (1Password, Bitwarden) | Not chat, not email, not a Google Sheet |
| Production in the cloud | Azure Key Vault · AWS Secrets Manager · Google Secret Manager | Grant access with a managed identity, not another key |
| Kubernetes | External Secrets Operator pulling from a vault above | A Kubernetes secret is only base64, **not encryption** |
| You really must store in git | SOPS or sealed-secrets (encrypt before commit) | Last resort |

**Permissions:** each service reads only its own secrets, environments are fully separate, and
no account can read all of them, except an admin account whose access is logged.

---

## 7 · Rotation

**Design for it from day one**, not when you finally have to rotate.

| Must have | Detail |
|---|---|
| Two values valid at once | During the change, both the old and the new value must work, or you must shut the system down |
| Reload without restart | Or accept that you need one deploy, and write down that it must be done |
| Schedule | Token signing key 90 days · database password 180 days · certificate 30 days before expiry |
| Automatic | A task that depends on someone remembering ends up done by nobody |

**A token signing key must carry an id (key id)**, so that after signing new tokens with the new key,
you can still verify old tokens that have not expired.

---

## 8 · When a secret leaks: order matters more than speed

1. **Revoke the old value first:** disable that key at its source.
2. Issue a new value, then deploy.
3. Check past logs for anyone using it from a place that is not ours.
4. Remove it from git history (`git filter-repo`) and tell everyone to clone again. (If you must force push, wait for the user's approval and tell the team first.)
5. Record the incident with `incidents-and-monitoring`.

> **Step 4 is not step 1**, because deleting the commit does not make the key any safer.
> Anyone who forked or cloned already, and the provider's backups, still have the old value.
> **Treat every secret that has ever been in git as leaked**, even if the repo is private.

---

## 9 · Do not let secrets flow out other ways

| Leak path | How to close it |
|---|---|
| Logs | The list of terms to mask is in `errors-and-logs` |
| Error messages sent to the client | Return only a `requestId`, not a stack trace or connection string |
| Crash reports / error trackers | Set a sensitive-data filter before sending out |
| Shell command history | Use `read -s` or read from a file, instead of typing the value on the command line |
| `docker history` | Do not put secrets in `ARG`/`ENV` at build time; use a mount at run time instead |
| Backup files and dumps | Encrypt them and store them where you control access |
| Screenshots in documents and issues | Always mask before attaching |

---

## 10 · Frontend config: nothing in it is secret

> **Important:** everything in a file the browser loads **is public information**,
> whether it is named `VITE_SECRET_KEY` or sits in a file minified until it is unreadable.
> Minifying code is not encryption. Open DevTools and you can see it.

| Allowed in the frontend | Must stay on the server only |
|---|---|
| API address · environment name | API keys of any external service |
| Publishable key of a payment provider | The secret key of the same provider |
| Feature flags that are not secret | Pricing rules · approval thresholds |
| Web ID of an analytics tool | Tokens that call a third party's API |

**If you need to change a value without rebuilding,** load `/config.json` when the app starts,
instead of embedding the value at build time (`import.meta.env`), which locks the value into the built files.

---


## reference: file-upload-and-storage.md

<!-- merged from skill `file-upload-and-storage` on 2026-11-27 · description was: Use when users upload files or an app serves stored files -->
# Accepting file uploads and storing files

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When to use another skill instead, or together](#when-to-use-another-skill-instead-or-together)
- [1 · Check before accepting](#1--check-before-accepting)
- [2 · Where to store](#2--where-to-store)
- [3 · Naming the stored file](#3--naming-the-stored-file)
- [4 · Sending files back to the user](#4--sending-files-back-to-the-user)
- [5 · Images](#5--images)
- [6 · Deleting and retention](#6--deleting-and-retention)

> **One rule:** a file a user sends is untrusted data.
> The file name, the extension, the type the browser reports, and the size it claims can **all be faked**.

## When to use this skill

- A screen lets users attach files, images, or documents.
- The system must store files and send them back for viewing or download.
- You must decide where to keep the files.
- Some files should be hidden from others, but right now anyone with the link can open them.

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Import Excel/CSV and load the data into the system | `data-import-export` | instead |
| Permissions: who may access what | `auth-implementation-patterns.md` | instead |
| Process large files as a background job | `async-messaging` | instead |

---

## 1 · Check before accepting

| What to check | How |
|---|---|
| **File type** | Read the **contents** (magic bytes). Do not trust the extension or `Content-Type`. |
| **Size** | Enforce it on the server **and** at the front-facing request receiver. A check in the browser is only a convenience. |
| Files per request | Set a limit. |
| Total size per user | Set a quota, or one person uses up all the space. |
| Allowed types | **An allow list, not a deny list.** |

```
Typical allow list: jpg · png · webp · pdf · xlsx · docx · csv
Always forbidden: executables (exe, sh, bat) · server script files (php, aspx, jsp) · svg that has not been sanitised
```

> **SVG is HTML.** It can run scripts. To accept it, sanitise it first or convert it to PNG.
>
> **Check the size before reading the file into memory.** Otherwise a 5 GB file kills the server
> before the size-check code gets to run.

**Virus-scan** any file that other people will download. While the scan result is pending, set the status to `pending`
and give nobody access.

---

## 2 · Where to store

| Store | Good for | Note |
|---|---|---|
| **object storage** (S3 · Azure Blob · GCS) | The default to use | Scales · has expiring links built in |
| The server's disk | A small, single-machine system | **Must sit outside the folder the web serves**, and must be backed up |
| In the database | Very small files that must be in the same transaction | Grows fast · backups get much slower |

> Wrong: **keeping files in the app's folder.** They vanish on every deploy, and with several instances they cannot see each other.
> Wrong: **keeping files directly in the folder the web serves.** Someone uploads a script file and runs it.

**The database holds only metadata; the file itself lives elsewhere.** The metadata table needs the columns
`id` · `original_name` · `stored_key` · `content_type` · `size_bytes` · `checksum` ·
`uploaded_by` · `uploaded_at` · `scan_status` · `owner_entity_type` · `owner_entity_id`

---

## 3 · Naming the stored file

**Never use the file name the user sent as the real stored name.**

```
Wrong: uploads/รายงาน (1).xlsx              spaces · Thai · brackets
Wrong: uploads/../../etc/passwd             escapes the folder
Right: 2026/09/25/01J9Z8K7X2M4.xlsx         random · split into folders by date
```

- The real stored name is a random value (UUIDv7 or ULID) + an extension that you have **verified**.
- Keep the user's original name in the database, and send it back on download through a header.
- Split folders by date. One folder with millions of files is slow and cannot be browsed.
- Store a checksum too. It detects duplicates and checks the file is not corrupted.

---

## 4 · Sending files back to the user

| File | How to send |
|---|---|
| Public (logo, product image) | A direct URL through a CDN is fine |
| **Private** (document, receipt, user photo) | **A signed link that expires** in 5–15 minutes |

> **A "hard-to-guess link" is not access control.** Links get forwarded, logged by proxies,
> and left in the `Referer` header. For a private file, **check permission every time**, then issue a temporary link.

- For large files, let the user upload straight to object storage with a link we sign, so the file does not pass through the app.
  **The checks in §1 are still all required.** This route bypasses the app, so restore the checks like this:
  - **When signing the link:** limit size and type inside the signature. S3 uses a presigned POST whose policy has `content-length-range` and a `Content-Type` condition (a presigned PUT cannot enforce size). Other providers have equivalents, for example GCS uses the header `x-goog-content-length-range`.
  - **When signing the link:** set the key yourself (a random name as in §3) in a holding folder · keep the link's expiry short · save a metadata row with `scan_status = pending`.
  - **After the upload finishes** (a storage event, or the user reports it done): read the real magic bytes from the object · compare the real size with the limit · virus-scan. If it passes, move it to the real store and set `clean`. If it fails, delete or quarantine it.
  - While `pending`, issue no download link to anyone.
- When serving a file for download, set `Content-Disposition` and `Content-Type` correctly,
  and never send back user-uploaded HTML in a way that lets the browser render it.
- If you can, serve user files from a different domain than the app, so scripts in a file cannot reach the app's cookies.

---

## 5 · Images

- **Never send the original camera image to the screen.** An 8 MB photo on a phone is a page that does not load.
- Pre-generate 2–3 sizes (thumbnail · medium · a downsized full size).
- **Strip EXIF.** The photo holds the location where it was taken, and users do not know they are publishing it.
- Convert to WebP if the browser supports it.
- Rotate the image according to EXIF before you strip EXIF, or phone photos come out sideways.
- If the file is large or there are many, resize as a background job (see `async-messaging`).

---

## 6 · Deleting and retention

| Topic | Rule |
|---|---|
| Deleting the parent record | A job must also hunt down and delete the orphan files left behind. |
| Order of deletion | Delete the metadata first, then the file. An orphan file is harmless, but metadata pointing to a file that is gone breaks the screen. |
| An uploaded file never linked to anything | Delete it after 24 hours. |
| Retention | Set it per file type · a file with personal data needs an expiry date (see `pdpa-compliance`). |
| Backup | Files belong in the backup plan just like the database, **and a restore must have been tested for real.** |


## reference: libraries-and-code.md

# ไลบรารีและโค้ดตัวอย่าง

Sample code for storing passwords, rate-limiting tools, and recommended libraries by language

## Password storage — code

```typescript
// Good (using bcrypt)
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, storedHash);

// Bad
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

## Rate limiting tools

Use existing tools:
- `express-rate-limit` (Node.js)
- `django-ratelimit` (Django)
- Cloudflare / AWS WAF (edge)

## Library Recommendations

| Stack | Library | Notes |
|-------|---------|-------|
| Node.js | `passport`, Auth.js, Better Auth | Lucia v3 is deprecated (lucia-auth.com, checked 22 Oct 2026) so do not start new work on it; Better Auth status (รอยืนยัน, check before use) |
| Python | `authlib`, `PyJWT` (or `joserfc`) | authlib for OAuth; python-jose is rarely maintained (รอยืนยัน) |
| Go | `oauth2`, `golang-jwt` | Standard |
| Rust | `axum-login`, `jsonwebtoken` | — |
| Any | Auth0, Clerk, Supabase Auth | Managed (faster) |


## reference: mfa.md

# Pattern 4: Multi-Factor Authentication (MFA)

Details of all 3 types of multi-factor authentication. Use it when choosing or building MFA

## TOTP (Google Authenticator, Authy)
**When:** standard two-factor login (2FA), easy for users. TOTP = time-based one-time password.

```
Setup:
1. Server generates random secret (160 bits)
2. Server shows QR code: otpauth://totp/...?secret=...
3. User scans with authenticator app
4. User confirms with first code
5. Server stores secret encrypted

Verify:
1. User enters 6-digit code
2. Server computes expected code(s) (±1 window for clock drift)
3. Match → grant access
```

## WebAuthn (Passkeys) — Future-proof
**When:** you want login that phishing can't beat, no SMS, hardware keys

- Use `@simplewebauthn` library
- Supports Touch ID, Face ID, YubiKey
- No shared secret, so nothing to phish
- Default for new apps in 2026+

## SMS / Email codes
**When:** there's no other option (users without smartphone apps)

- Note: SMS is **NOT secure** (SIM swap attacks)
- Use only as a last resort, never as the main method
- Use strict rate limits
- Codes: 6 digits, 5 min expiry


## reference: per-stack.md

# .NET และ Angular

> Caution: the code in this file is **not yet compiled or tested** (unlike `assets/health.node.js` and
> `assets/health_py.py`, which have been run against every endpoint). It is the standard setup of
> ASP.NET Core. On the first run, compare the response with the shape in SKILL.md section 1.

---

## สารบัญ

1. [ASP.NET Core — health checks](#aspnet-core--health-checks)
2. [Angular — ฝั่งที่เรียกใช้](#angular--ฝั่งที่เรียกใช้)
3. [ตารางเทียบ](#ตารางเทียบ)

---

## ASP.NET Core — health checks

```bash
dotnet add package AspNetCore.HealthChecks.NpgSql
dotnet add package AspNetCore.HealthChecks.Redis
dotnet add package AspNetCore.HealthChecks.Network   # AddSmtpHealthCheck อยู่ในแพ็กเกจนี้
```

```csharp
builder.Services.AddHealthChecks()
    // tag "ready" = ตัวที่ /health/ready จะเรียก · ไม่ติด tag = ไม่ถูกเรียกที่ไหนเลย
    .AddNpgSql(cs, name: "db", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddRedis(redisCs, name: "redis", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddSmtpHealthCheck(o => { }, name: "mail",
        failureStatus: HealthStatus.Degraded,          // ไม่ critical → degraded ไม่ใช่ down
        tags: ["ready"])
    // ตอนกำลังปิด → Unhealthy → /health/ready ตอบ 503 (ดู "Graceful shutdown" ข้างล่าง)
    .AddCheck<ShutdownHealthCheck>("shutdown", tags: ["ready", "critical"]);
```

```csharp
// ---- ping: เบาที่สุด ไม่ผ่าน middleware ที่ไม่จำเป็น ----
app.MapGet("/ping", () => Results.Text("pong")).ExcludeFromDescription();

// ---- liveness: ไม่เรียก check ตัวไหนเลย (predicate = _ => false) ----
// ถ้าเผลอให้เช็ค DB ตรงนี้ DB สะดุด = Kubernetes ฆ่า pod ยกแถว
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteLive,
});

// ---- readiness: เฉพาะ check ที่ติด tag "ready" ----
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = c => c.Tags.Contains("ready"),
    ResponseWriter = WriteReady,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy]   = StatusCodes.Status200OK,
        [HealthStatus.Degraded]  = StatusCodes.Status200OK,     // ยังรับ traffic ได้
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
    },
});

app.MapGet("/version", () => Results.Ok(new
{
    name = "orders-api",
    version = typeof(Program).Assembly.GetName().Version?.ToString() ?? "0.0.0",
    commit = Environment.GetEnvironmentVariable("GIT_SHA") ?? "unknown",
    buildTime = Environment.GetEnvironmentVariable("BUILD_TIME") ?? "unknown",
    env = app.Environment.EnvironmentName,
    host = Environment.MachineName,
}));
```

Make the response match the same format as the other stacks:

```csharp
static Task WriteReady(HttpContext ctx, HealthReport report)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new
    {
        status = report.Status switch
        {
            HealthStatus.Healthy  => "up",
            HealthStatus.Degraded => "degraded",
            _                     => "down",
        },
        timestamp = DateTimeOffset.UtcNow,
        checks = report.Entries.ToDictionary(
            e => e.Key,
            e => new
            {
                status = e.Value.Status == HealthStatus.Healthy ? "up" : "down",
                durationMs = (int)e.Value.Duration.TotalMilliseconds,
                // ข้อความเท่านั้น ห้ามส่ง exception เต็ม ๆ — endpoint นี้เปิดสาธารณะ
                error = e.Value.Exception?.Message,
            }),
    });
}

static Task WriteLive(HttpContext ctx, HealthReport _)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new { status = "up", timestamp = DateTimeOffset.UtcNow });
}
```

### Error envelope (RFC 9457)

ASP.NET Core already ships `ProblemDetails`. Use it, and do not invent your own format.

```csharp
builder.Services.AddProblemDetails(o => o.CustomizeProblemDetails = ctx =>
{
    ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
    ctx.ProblemDetails.Extensions["requestId"] =
        ctx.HttpContext.Response.Headers["X-Request-Id"].ToString();
});

app.UseExceptionHandler();      // แปลง exception ที่หลุดเป็น problem+json ให้อัตโนมัติ
app.UseStatusCodePages();
```

### Graceful shutdown

Make `/health/ready` answer down for a short while before the real shutdown, so the load balancer removes the instance from its pool in time.
Use `IHostedLifecycleService.StoppingAsync` (.NET 8 and later), because the host calls it **before** it stops Kestrel (after `ApplicationStopping`).
So you can wait with `await Task.Delay` without blocking a thread, and the server still answers 503 for the load balancer to see.

```csharp
// สถานะร่วม: ตัวรอปิดเขียน · health check อ่าน
public sealed class ReadinessState { public volatile bool IsShuttingDown; }

public sealed class ShutdownHealthCheck(ReadinessState state) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default) =>
        Task.FromResult(state.IsShuttingDown
            ? HealthCheckResult.Unhealthy("shutting down")
            : HealthCheckResult.Healthy());
}

public sealed class DrainOnShutdown(ReadinessState state) : IHostedLifecycleService
{
    public async Task StoppingAsync(CancellationToken ct)
    {
        state.IsShuttingDown = true;                       // /health/ready → 503 ทันที
        await Task.Delay(TimeSpan.FromSeconds(5), ct);     // รอ load balancer ตัดออก
    }
    public Task StartingAsync(CancellationToken ct) => Task.CompletedTask;
    public Task StartAsync(CancellationToken ct)    => Task.CompletedTask;
    public Task StartedAsync(CancellationToken ct)  => Task.CompletedTask;
    public Task StopAsync(CancellationToken ct)     => Task.CompletedTask;
    public Task StoppedAsync(CancellationToken ct)  => Task.CompletedTask;
}

// ก่อน builder.Build()
builder.Services.AddSingleton<ReadinessState>();
builder.Services.AddHostedService<DrainOnShutdown>();
builder.Services.Configure<HostOptions>(o =>
    o.ShutdownTimeout = TimeSpan.FromSeconds(30));   // รวมเวลารอ 5 วินาทีข้างบน + request ที่ค้าง
```

Host shutdown order (.NET 8+): `ApplicationStopping` → `StoppingAsync` → `StopAsync` of the hosted services (including Kestrel) → `StoppedAsync` → `ApplicationStopped` — per the .NET Generic Host page at learn.microsoft.com (checked 22 Oct 2026)

### สิ่งที่ต้องเปิดก่อน deploy

Register services only **before** `builder.Build()`. After Build the service list is read-only, and calling `builder.Services.Add…` then throws `InvalidOperationException` at app start.

```csharp
// ---- ก่อน Build: ลงทะเบียน service ----
builder.Services.Configure<KestrelServerOptions>(o => o.Limits.MaxRequestBodySize = 1_048_576);
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // อย่างน้อยที่ /login และที่ส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password · OTP)
    o.AddFixedWindowLimiter("login", w => { w.PermitLimit = 5; w.Window = TimeSpan.FromMinutes(1); });
});
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("https://app.example.com")   // ระบุ origin ห้าม AllowAnyOrigin คู่กับ cookie
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

var app = builder.Build();

// ---- หลัง Build: ลำดับ middleware ----
if (!app.Environment.IsDevelopment())
    app.UseHsts();                             // ตั้งแค่ Strict-Transport-Security · ไม่ใช้ตอน dev เพราะเบราว์เซอร์จำค่าไว้
app.UseHttpsRedirection();
app.Use(async (ctx, next) =>                   // header ที่ UseHsts ไม่ได้ตั้งให้
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["Content-Security-Policy"] = "frame-ancestors 'none'";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";   // สำหรับเบราว์เซอร์เก่า
    await next();
});
app.UseCors();
app.UseRateLimiter();

app.MapPost("/api/v1/login", Login).RequireRateLimiting("login");
```

To avoid writing your own middleware, use the package `NetEscapades.AspNetCore.SecurityHeaders` (`app.UseSecurityHeaders()`) which sets the full basic header set

---

## Angular — ฝั่งที่เรียกใช้

**Interceptor ใส่ request id ทุก request** (คู่กับ `errors-and-logs`):

```ts
export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const id = crypto.randomUUID().slice(0, 8);
  return next(req.clone({ setHeaders: { 'X-Request-Id': id } }));
};
```

**Turn problem+json into a message the user can understand**:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      const p = e.error;                       // ProblemDetails
      // 500 ไม่มีรายละเอียดให้แสดง — โชว์ requestId เพื่อให้ผู้ใช้แจ้งทีมได้
      const msg = p?.detail || p?.title || 'เกิดข้อผิดพลาด';
      toast.error(p?.requestId ? `${msg} (รหัสอ้างอิง ${p.requestId})` : msg);
      return throwError(() => e);
    }),
  );
};
```

**System status page**, so the support team can check it without calling a developer:

```ts
this.http.get<ReadyResponse>('/health/ready').subscribe(r => this.status.set(r));
// r.status = 'up' | 'degraded' | 'down' → แสดงเป็น pill สีเขียว/เหลือง/แดง
// (ใช้คลาส .pill-green / .pill-amber / .pill-red จาก ui-craft ส่วน web-app-design)
```

---

## ตารางเทียบ

| เรื่อง | .NET | Node/Express | Python/FastAPI |
|---|---|---|---|
| health | `AddHealthChecks()` + tag | `createHealthRouter()` | `make_health_router()` |
| error envelope | `ProblemDetails` (มีในตัว) | `express-problem-json` หรือเขียน middleware | `HTTPException` + custom handler |
| request id | middleware + `LogContext` | `AsyncLocalStorage` | `ContextVar` + middleware |
| graceful shutdown | `IHostedLifecycleService.StoppingAsync` | `server.close()` ใน `SIGTERM` | `lifespan` context ของ FastAPI |
| security headers | `UseHsts()` (HTTP Strict Transport Security (HSTS) เท่านั้น) + middleware สั้น ๆ หรือ `NetEscapades.AspNetCore.SecurityHeaders` | `helmet` | `secure` middleware |
| OpenAPI | `Microsoft.AspNetCore.OpenApi` (`AddOpenApi()` + `MapOpenApi()` · มากับ template ตั้งแต่ .NET 9) · ทางเลือก: Swashbuckle / NSwag | `swagger-jsdoc` | มีในตัว `/docs` |
| rate limit | `AddRateLimiter` | `express-rate-limit` | `slowapi` |

## Wiring the ready-made health router

```js
// Node
app.use(createHealthRouter({
  version: { name: 'orders-api', version: '1.4.0', commit: process.env.GIT_SHA },
  checks: {
    db:   async () => { await pool.query('SELECT 1'); },          // critical
    mail: { critical: false, run: async () => { await smtp.verify(); } },
  },
}));
```

```python
# Python
app.include_router(make_health_router(
    version={"name": "orders-api", "version": "1.4.0", "commit": os.getenv("GIT_SHA")},
    checks={"db": lambda: db.execute("SELECT 1"),
            "mail": {"critical": False, "run": smtp.verify}},
))
```


## reference: sources.md

# Sources · auth-implementation-patterns

- Password policy (minimum 15 characters as the only factor, 8 inside multi-factor authentication, breached-password check, no composition rules, no forced rotation, maximum at least 64): NIST SP 800-63B-4 §3.1.1.2, https://pages.nist.gov/800-63-4/sp800-63b.html, checked 2026-10-14.


---

# skill: errors-and-logs

Use when code can fail, needs retry or timeout, or writes logs

# errors-and-logs — handle failures on purpose and write logs people can read

> **One rule:** catch an error only when you can really do something about it, and log each failure once, at the outermost layer.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Code calls a network, database, file or another system; "should I retry?"; "the user sees a blank error" | [`references/error-handling-patterns.md`](references/error-handling-patterns.md) |
| Writing or reviewing log lines, log levels, log files, "nothing in the log" | [`references/logging-standards.md`](references/logging-standards.md) |
| Code for a specific stack (.NET, Angular, Node, Python) | [`references/per-stack.md`](references/per-stack.md) |

## Steps every part shares

1. **Decide where the error is handled.** Inner layers (DB, HTTP, files) let it pass or turn it into a domain error. Business logic catches only where a real fallback exists. The outermost layer (controller, handler, main) catches everything, logs once, and returns an answer the user understands.
2. **Sort the failure before you act.** A user mistake, a transient failure, a rate limit, a permanent failure, or our own bug. Only a transient failure or a rate limit may retry, and only after the time the server asks for.
3. **Give every outside call a timeout.** Most libraries wait forever by default. The total retry time must be shorter than the caller's own timeout.
4. **Write the log line in the shared format.** Time with timezone, level 5 characters wide, an 8-character correlation id, the source module, one sentence, then `key=value` context. Read `references/logging-standards.md` section 1 for the full layout.
5. **Show the user a message they can act on, and log the detail.** Never send a stack trace or SQL text to the user.

## Check before done

- **Never log** passwords, tokens or API keys, cookies or Authorization headers, OTP or PIN, card numbers or CVV, national ID numbers, health data, or full payloads that hold personal data. Check that a test log with `password` and `token` prints `***`.
- Never write an empty `catch`, and never `return null` in place of an error. If you really swallow an error, write the reason in a comment next to it.
- A write that retries carries an idempotency key, or a customer may be charged twice.
- A person waiting on a screen gets at most 1 automatic retry, then a retry button they press themselves.
- Each outside dependency has at least one failure-path test (timeout, 5xx, bad payload).

## References

- [`references/sources.md`](references/sources.md) and [`references/error-handling-patterns.md`](references/error-handling-patterns.md) — error patterns and where the ideas came from
- [`assets/logger.node.js`](assets/logger.node.js) and [`assets/logger_py.py`](assets/logger_py.py) — tested logger starters with password masking
- Retry numbers for background jobs live in `async-messaging`; alarms and error-rate metrics live in `incidents-and-monitoring`


## reference: error-handling-patterns.md

<!-- merged from skill `error-handling-patterns` on 2026-11-27 · description was: Use when writing code that can fail, with retry and timeout -->
# Error handling

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When to use another skill, or use it alongside](#when-to-use-another-skill-or-use-it-alongside)
- [1 · Where to catch, where to let it pass](#1--where-to-catch-where-to-let-it-pass)
- [2 · The message to the user ≠ the message in the log](#2--the-message-to-the-user--the-message-in-the-log)
- [3 · Classify before deciding](#3--classify-before-deciding)
- [4 · Timeout and retry](#4--timeout-and-retry)
- [5 · Circuit breaker](#5--circuit-breaker)
- [6 · Partial failure](#6--partial-failure)
- [7 · Check before sending](#7--check-before-sending)
- [References](#references)

> **The one rule:** catch an error only when you **can really do something about it.**
> Catching it and doing nothing is worse than not catching, because the system keeps going while it is already broken inside.

## When to use this skill

- Writing code that calls the network, a database, files, or another team's system
- Deciding whether to retry, how many times, and how long to wait
- The user sees "an error occurred" and does not know what to do next
- Tracing a problem and finding nothing in the log because someone caught and discarded the error

## When to use another skill, or use it alongside

| Task | Skill | |
|---|---|---|
| The JSON shape of errors the API sends out | `web-service-essentials` · `api-design` | instead |
| Log line format and data masking | `logging-standards.md` | instead |
| Fixing one specific bug someone reported | `fix-at-source/targeted-fix` | instead |
| Steps when the system is really down | `incidents-and-monitoring` | instead |
| Error-rate metrics and alerts | `incidents-and-monitoring` | alongside |
| Where a failed background job goes next | `async-messaging` | alongside |
| Error messages that must be translated into several languages | `i18n-and-locale` | alongside |
| Tests for failure cases | `test-automation` | alongside |

---

## 1 · Where to catch, where to let it pass

| Layer | What to do |
|---|---|
| Innermost layer (calls DB, HTTP, files) | **let it pass**, or convert it into a domain error that has meaning |
| Business logic layer | catch only where there is a real fallback (a default value, a backup data source) |
| **Outermost layer** (controller, handler, main) | **catch everything** · log once · convert to an answer the user understands |

> **Log in one place only, the outermost layer.** If every layer catches, logs, and rethrows,
> 1 error becomes 10 log lines and nobody knows they are the same event.

**3 things you must never do:**

```csharp
try { ... } catch { }                      // wrong: swallowed silently
try { ... } catch (Exception) { return null; }   // wrong: the caller gets null and never learns what happened
catch (Exception ex) { log.Error(ex); throw; }   // wrong: logs again at every layer
```

**If you really mean to swallow it, write the reason:**

```csharp
catch (SmtpException ex)
{
    // swallowed on purpose — a failed notification email should not make the order fail
    log.Warning(ex, "ส่งอีเมลยืนยันไม่สำเร็จ orderId={OrderId}", order.Id);
}
```

---

## 2 · The message to the user ≠ the message in the log

| | The user sees | The log keeps |
|---|---|---|
| Content | what happened · what to do next | stack trace · variable values · request id |
| Language | the user's language | English is fine |
| Internal detail | **none at all** | allowed |
| Link between the 2 sides | **a reference code** | the same code |

```
Wrong: "เกิดข้อผิดพลาด" (An error occurred)   the user cannot tell what to do
Wrong: "SqlException: timeout expired"      leaks internal detail, and they cannot read it anyway
Right: "บันทึกไม่สำเร็จเพราะระบบตอบช้า ลองอีกครั้งใน 1 นาที (อ้างอิง: 01J9Z8K)"
       (Save failed because the system was slow. Try again in 1 minute. Reference: 01J9Z8K)
```

**A good message has 3 parts**: what happened · why (if you can say) · what to do next.
The reference code is the same correlation id as in `logging-standards.md`.

---

## 3 · Classify before deciding

| Type | Example | What to do | Log level |
|---|---|---|---|
| **User mistake** | incomplete input, wrong format | tell them to fix it · **do not retry** | no log needed |
| **Transient** | timeout · 503 · deadlock · dropped connection | **may retry** | warning |
| **Rate limited** | 429 Too Many Requests | may retry **after the time `Retry-After` gives** (if absent, use the formula in §4) · never fire faster than that | warning |
| **Permanent** | 404 · 401 · data fails a condition | do not retry · say so clearly | warning |
| **Our bug** | null reference · cannot convert the type | do not retry · **someone must fix it** | error |
| **Inconsistent data** | totals do not match, an impossible state | stop · **call a person** | error + alert |

> **Retrying an error that no number of tries will cure means firing again at a system that is already down, so it falls harder.**
> Sending `400` or `401` another 100 times gets the same answer.

---

## 4 · Timeout and retry

**Every call that leaves the process needs a timeout** — the default in most libraries is "wait forever"

| Call | A timeout that works in general |
|---|---|
| Ordinary database query | 5–10 seconds |
| Internal HTTP | 3–5 seconds |
| External HTTP | 10–30 seconds |
| Heavy background job | set it from the real work, and it must be possible to cut it off |

**The retry formula** (service-to-service calls · jobs in a queue use the numbers in [`async-messaging`](../../async-messaging/SKILL.md) §4 · when a person sits waiting on the screen → see the last item below):

```
at most 3 tries · exponential delay + jitter
try 1 waits 1 second · try 2 waits 2 · try 3 waits 4  (each ±20% random)
```

- **You need the random part** — otherwise every instance retries at the exact same moment and hits the target system again together
- **The total retry time must be less than the caller's timeout**, or the caller has given up while we are still trying
- **Retrying a write needs an idempotency key**, or the customer is charged twice (see `api-design`)
- **A person sits waiting on the screen** → at most 1 automatic retry, then show a "ลองอีกครั้ง" (try again) button for them to press (do not use the 3 tries of the formula above)

---

## 5 · Circuit breaker

When the target is down, firing more does not help. It only makes us hang along with it.

```
closed (normal) → N failures in a row → open (do not call at all, answer with an error at once)
                → wait X seconds → half-open: let 1 request try → success: back to closed · failure: stay open
```

A default that works: if 5 calls fail in a row within 30 seconds, keep the circuit open for 60 seconds.

**Add one when** — calling an external system that has gone down before · calling across several services · a slow target spreads the slowness to us
**Not needed when** — calling your own database · a job that runs once a day

---

## 6 · Partial failure

Work that handles many items must be able to answer **"8 of 10 succeeded, where did the other 2 go?"**

| Style | Fits |
|---|---|
| All or nothing (transaction) | money · stock · anything that breaks when half done |
| Do what you can, then report the items that failed | data import · notifying many people |

The second style must **return the failed items with a reason for each**, not just say "some items failed".

**Cleanup must always run**, whether or not the main work succeeds: closing files, returning connections, deleting temp files.
Use `finally` / `using` / `with` / `defer` instead of repeating it on every exit path.

---

## 7 · Check before sending

Go through this against the diff every time you touch code that calls outside the process

- [ ] Every `catch` clearly does one of these: handles it and goes on · converts it to an error of its own layer and throws on · lets it pass to the outermost layer to log (section 1) — no `catch` that logs and rethrows
- [ ] Every outside call (HTTP · DB · queue · file) has a deliberate timeout and retries only the transient types in section 3 · a write that retries has an idempotency key (section 4)
- [ ] The message to the user says what to do next · no stack trace or table name goes out (section 2) · the log for the same error has a correlation id and enough data to reproduce it
- [ ] Outcomes the business expects (not found · insufficient balance · duplicate) are return values or types the caller must handle, not exceptions
- [ ] Each outside dependency has at least 1 failure-path test (timeout · 5xx · bad payload), and a test confirms that partial failure follows section 6 and does not fail the whole page
- [ ] None of these 4 kinds of silent failure swallowing:
  - **optional chaining or `?? default`** that lets a missing value pass with nobody knowing (`order?.total ?? 0` turns an order that failed to load into a zero total)
  - **falling back to a mock or sample data outside tests** — the live system shows fake data and looks normal
  - **retries run out, then silence** — after the last try it returns empty or success, throws no error, and tells the caller nothing
  - **a catch that logs and carries on in the UI** — the user sees a normal screen although the data never arrived; show an error state they can see

## References

- [`sources.md`](sources.md) — where the checklist ideas came from


## reference: logging-standards.md

<!-- merged from skill `logging-standards` on 2026-11-27 · description was: Use when writing or reviewing code that logs -->
# Logging Standards

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When **not** to use it](#when-not-to-use-it)
- [1 · Line format — the same in every language](#1--line-format--the-same-in-every-language)
- [2 · Log levels — write them to match their meaning](#2--log-levels--write-them-to-match-their-meaning)
- [3 · Correlation id — what makes logs usable](#3--correlation-id--what-makes-logs-usable)
- [4 · Log files](#4--log-files)
- [5 · What must never go into a log](#5--what-must-never-go-into-a-log)
- [6 · Ready-to-use code](#6--ready-to-use-code)
- [7 · Checking the work](#7--checking-the-work)
- [8 · Anti-patterns not covered above](#8--anti-patterns-not-covered-above)
- [9 · Links to other skills](#9--links-to-other-skills)

> **The one rule:** Logs exist for a person to read at 3 a.m. when the system is down, not while writing the code.
> If a line does not help answer "what happened, to whom, and when", do not write it.

## When to use this skill

- Starting any new project (service, API, worker, batch, desktop, frontend)
- Someone asks for "a log file", or asks about log format and levels
- You are chasing a production problem and find that the existing logs are unusable

## When **not** to use it

- You need metrics or tracing (Prometheus, OpenTelemetry). That is a different topic from logs, so use `incidents-and-monitoring`.
- You are building a service health endpoint. Use `web-service-essentials`.

---

## 1 · Line format — the same in every language

```
2026-08-31 09:42:13.482 +07:00  INFO   [a3f9c1b2] orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 userId=57 ms=134
└───────── time + timezone ─────────┘ └level┘  └ cid ┘ └source┘ └─ message ─┘  └──── context k=v ────┘
```

| Part | Rule |
|---|---|
| time | `YYYY-MM-DD HH:mm:ss.SSS ±HH:MM` — **the timezone is required**, or you cannot compare logs across machines |
| level | Left-aligned, 5 characters wide (`INFO ` `WARN ` `ERROR` `DEBUG` `FATAL`), so the columns line up |
| cid | An 8-character correlation id in square brackets. If there is none, use `[--------]` (also 8 characters, so the columns line up) |
| source | The module or class that writes the log, not the file name |
| message | One sentence, with no variables embedded in the string |
| context | `key=value` separated by spaces. If a value contains a space, wrap it in `"` |

**Why not JSON:** This file is mainly for people to open and `grep`. This format still works with `grep "\[a3f9c1b2\]"` or `awk`, but the eye reads it at once without any tool.
When you must ship logs to a central system such as Grafana Loki or Elasticsearch, Logstash, Kibana (ELK), add one more JSON sink (the destination logs are sent to). But **do not drop the text file**.

**1 event = 1 line**, except a stack trace, which follows indented by 4 spaces.

---

## 2 · Log levels — write them to match their meaning

| Level | Use when | Example |
|---|---|---|
| `FATAL` | The app is about to die and cannot continue | Cannot connect to the DB at start |
| `ERROR` | This job failed **and someone must look** | Saving an order failed |
| `WARN` | Abnormal, but the system can continue | Retry number 2, disk down to 10% |
| `INFO` | An important business event | Order created, user logged in, job started/finished |
| `DEBUG` | Details for chasing problems — **off in production** | Values computed along the way |
| `TRACE` | Step-by-step detail — turn on only when really chasing | Raw payload |

> Warning: **an `ERROR` that nobody needs to act on is a `WARN`.** If ERROR fires every minute until people stop looking,
> you have just destroyed your own alarm system.

The default is `DEBUG` in dev and `INFO` in production, adjustable with the env var `LOG_LEVEL`. **No new build is needed; just restart (or reload the config).** .NET reads it from `appsettings.json` instead (see `per-stack.md`).

---

## 3 · Correlation id — what makes logs usable

One request uses one id from start to finish, so every line that comes from that request has the same id.

```
Client ──X-Request-Id?── API Gateway ──┬── Service A ──┐
                        (create if none)└── Service B ──┴─→ every line has the same cid
```

- Take it from the header **`X-Request-Id`** only when it matches `^[A-Za-z0-9-]{1,64}$`. If it is missing or does not match, create a new one (`uuid v4`, first 8 characters). For the reason, see `web-service-essentials` item 3.
- **Always return it in the response header**, so the customer can send the id when reporting a problem and we can trace it at once.
- Pass it to the downstream service on every cross-system call.
- Store it with a mechanism that is separate per request: `AsyncLocalStorage` (Node) · `ContextVar` (Python)
  · `IHttpContextAccessor`/`LogContext` (.NET). **Never use a global variable**, because ids mix as soon as several requests run at once.

---

## 4 · Log files

```
logs/
  app-20260831.log        all levels · rotate at midnight · keep 30 days · max 100MB per file
  error-20260831.log      ERROR/FATAL only · keep 90 days
  fatal.log               uncaught exceptions (app died)
```

- Set the folder with the env var `LOG_DIR`. **Never hardcode the path.**
- Compress old files (`.gz`) and **retention is required**. Otherwise the disk fills and the system goes down from its own logs.
- In a container, also log to stdout (besides the file) so `docker logs` works.
- `logs/` must be in `.gitignore`.

---

## 5 · What must never go into a log

Passwords · tokens/API keys · cookies/Authorization headers · OTP/PIN · credit card numbers/CVV ·
**national ID numbers** · health data · full payloads that contain personal data

Helper already provided: the redaction function (which hides secret values) checks **whether the key name contains a forbidden word** (`userPassword`, `pwd`,
`accessToken` are all caught) and replaces the value with `***`. It checks up to 4 levels deep inside an object.

> **Log injection** — A value from a user may contain `\n`. If you let it through, the user can "forge" a fake log line,
> which misleads readers and breaks parsers. So the provided code strips `\r\n\t` from every value and from the main message.

---

## 6 · Ready-to-use code

| File | Stack | Status |
|---|---|---|
| `assets/logger.node.js` | Node/TS — winston + winston-daily-rotate-file | ✓ Run and tested 2026-10-25 (Node 22.23.2 · winston 3.19.0 · winston-daily-rotate-file 5.0.0 · password redaction · correlation id · strips line breaks in the main message and values) |
| `assets/logger_py.py` | Python — stdlib only, nothing to install | ✓ Run and tested 2026-10-25 (Python 3.13.5 · same test set) |
| `per-stack.md` | .NET (Serilog) + Angular | Caution: not yet compiled or tested |

```js
// Node
const { withCorrelation } = require('./logger.node');
const log = withCorrelation(req.id).child({ source: 'orders' });
log.info('สร้างคำสั่งซื้อสำเร็จ', { orderId: 1042, ms: 134 });
log.error('บันทึกไม่สำเร็จ', err);          // pass an Error directly; the stack is added for you
```

```python
# Python
from logger_py import setup_logging, get_logger, set_correlation_id
setup_logging(app_name="myapi")             # once, when the app starts
log = get_logger("orders")
log.info("สร้างคำสั่งซื้อสำเร็จ", extra={"ctx": {"order_id": 1042, "ms": 134}})
log.exception("บันทึกไม่สำเร็จ")             # inside except — the stack is added for you
```

---

## 7 · Checking the work

```bash
# no leftover print/console.log in production code
grep -rnE "console\.(log|error)|Console\.WriteLine|^\s*print\(" src/ --include="*.ts" \
  --include="*.js" --include="*.cs" --include="*.py" | grep -v test | head -30

# the output logs are readable and greppable
tail -n 50 logs/app-*.log
grep "a3f9c1b2" logs/app-*.log          # does one request show every line?
```

- [ ] Every line has all of: time+timezone · level · cid · source
- [ ] `grep` with one cid shows the story of that request from start to finish
- [ ] No secrets leak: log an object with `password` and `token`, and you must see `***`
- [ ] Feeding in a value that contains `\n` produces no fake line
- [ ] With `LOG_LEVEL=INFO`, DEBUG really disappears
- [ ] Files rotate daily and have retention (left for 1 month, the disk must not fill)
- [ ] `logs/` is in `.gitignore`
- [ ] The response sends `X-Request-Id` back to the customer

---

## 8 · Anti-patterns not covered above

- **A silent `try { } catch (e) { }`** — log at least 1 line
- **Log, then rethrow** — one problem shows up 3 times in the file. Log at the top layer that really handles the error instead.
- **Logging inside a loop that runs thousands of times** — log one summary when the loop ends
- **Logging everything** — the file grows so large you cannot find anything, and it is expensive and slow

---

## 9 · Links to other skills

`test-automation` (tests with full coverage) · `incidents-and-monitoring`


## reference: per-stack.md

# Set up the logger to produce the same format — .NET and Angular

> Warning: the code in this file is **not yet compiled or tested** (unlike `assets/logger.node.js` and
> `assets/logger_py.py`, which have really been run). It uses the standard setup of each library.
> At the first build, compare the output lines with the format in `logging-standards.md` item 1.

---

## Contents

1. [.NET / C# — Serilog](#net--c--serilog)
2. [Angular / frontend](#angular--frontend)
3. [Comparison table](#comparison-table)

---

## .NET / C# — Serilog

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
```

`appsettings.json` — keeps the settings outside the code, so you can change the log level without a new build:

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning",
        "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
      }
    }
  }
}
```

`Program.cs`:

```csharp
using Serilog;
using Serilog.Events;

const string LineTemplate =
    "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}  {Level:u5}  " +
    "[{CorrelationId}] {SourceContext}  {Message:lj}  {Context:l}{NewLine}{Exception}";

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("CorrelationId", "--------") // default when there is no request (8 characters)
    .Enrich.WithProperty("Context", "")              // empty when there is no context k=v
    .WriteTo.Console(outputTemplate: LineTemplate)
    .WriteTo.File(
        path: Path.Combine(Environment.GetEnvironmentVariable("LOG_DIR") ?? "logs", "app-.log"),
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        fileSizeLimitBytes: 100 * 1024 * 1024,
        rollOnFileSizeLimit: true,
        outputTemplate: LineTemplate)
    .WriteTo.File(
        path: Path.Combine(Environment.GetEnvironmentVariable("LOG_DIR") ?? "logs", "error-.log"),
        restrictedToMinimumLevel: LogEventLevel.Error,
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 90,
        outputTemplate: LineTemplate)
    .CreateLogger();

builder.Host.UseSerilog();
```

> `{Level:u5}` means upper case, 5 characters wide, which gives `INFO ` `WARN ` `ERROR` to match the other stacks.
> `{Message:lj}` and `{Context:l}` mean the string is not wrapped in an extra layer of `"`.

### Middleware correlation id

```csharp
using System.Text.RegularExpressions;

public sealed class CorrelationIdMiddleware(RequestDelegate next)
{
    public const string Header = "X-Request-Id";
    // accept from the customer only letters, digits, and - up to 36 characters — blocks people stuffing long text or \n into the log
 into the log
    private static readonly Regex Valid = new("^[A-Za-z0-9-]{1,36}$", RegexOptions.Compiled);

    public async Task Invoke(HttpContext ctx)
    {
        var cid = ctx.Request.Headers[Header].FirstOrDefault();
        if (cid is null || !Valid.IsMatch(cid))
            cid = Guid.NewGuid().ToString("N")[..8];   // missing or invalid → create a new one

        var logCid = cid.Length > 8 ? cid[..8] : cid;   // the log uses the first 8 characters to fit the cid column (same as Node/Python) — the header returns the full value

        ctx.Response.Headers[Header] = cid;          // return it so the customer can quote it

        // LogContext is tied only to this request's async flow — it does not mix with other requests
        using (Serilog.Context.LogContext.PushProperty("CorrelationId", logCid))
            await next(ctx);
    }
}
```

### Writing logs

```csharp
// Right: fixed message + values go in {Context} as k=v, per the format in `logging-standards.md` item 1
//    Output: ... INFO   [a3f9c1b2] Orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 ms=134
using (Serilog.Context.LogContext.PushProperty("Context", $"orderId={orderId} ms={sw.ElapsedMilliseconds}"))
    _logger.LogInformation("สร้างคำสั่งซื้อสำเร็จ");

// Wrong: a variable embedded in the string — every line becomes a different message and cannot be grouped
_logger.LogInformation($"สร้างคำสั่งซื้อ {orderId} สำเร็จ");
```

### Redacting secrets

Serilog does not redact secrets automatically. The surest way is to **never pass a whole object into the log**.
Pick only the fields you need. If you must pass the whole object, write an `IDestructuringPolicy`
or add `[NotLogged]` through `Destructure.ByTransforming<T>()`.

---

## Angular / frontend

The principle differs from the backend: **a browser cannot write files**, so important logs must be sent up to the backend.

```ts
// core/logger.service.ts
import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private http = inject(HttpClient);
  private buffer: unknown[] = [];

  private write(level: Level, message: string, ctx: Record<string, unknown> = {}) {
    // dev: print to the console for chasing problems — prod: silent, except WARN and above, which go to the server
    if (isDevMode()) console[level === 'ERROR' ? 'error' : 'log'](level, message, ctx);
    if (level === 'DEBUG' || (!isDevMode() && level === 'INFO')) return;   // prod sends only WARN and above

    this.buffer.push({ ts: new Date().toISOString(), level, message, ctx });
    if (this.buffer.length >= 10 || level === 'ERROR') this.flush();
  }

  /** Send in batches, not line by line — otherwise the network tab fills with the log's own requests */
  flush() {
    if (!this.buffer.length) return;
    const batch = this.buffer.splice(0);
    this.http.post('/api/client-logs', { entries: batch }).subscribe({ error: () => {} });
  }

  debug = (m: string, c?: Record<string, unknown>) => this.write('DEBUG', m, c);
  info  = (m: string, c?: Record<string, unknown>) => this.write('INFO', m, c);
  warn  = (m: string, c?: Record<string, unknown>) => this.write('WARN', m, c);
  error = (m: string, c?: Record<string, unknown>) => this.write('ERROR', m, c);
}
```

Catch every uncaught error:

```ts
// core/global-error.handler.ts
import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private log = inject(LoggerService);
  handleError(err: unknown) {
    const e = err as Error;
    this.log.error(e?.message ?? 'unknown error', { stack: e?.stack?.slice(0, 2000) });
    if (isDevMode()) console.error(err);
  }
}
// app.config.ts → providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
```

Send a correlation id with every request so client-side and server-side logs connect:

```ts
// core/correlation.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const correlationInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'X-Request-Id': crypto.randomUUID().slice(0, 8) } }));
```

**On the backend** you need an endpoint `POST /api/client-logs` that:
- Limits the body size and applies a rate limit. Otherwise it becomes a hole for people to flood you with logs.
- Writes to a separate file `logs/client-YYYYMMDD.log`
- **Treats the content as untrusted data**, so strip `\r\n` from every value just like a normal log

---

## Comparison table

| Topic | .NET | Node | Python | Angular |
|---|---|---|---|---|
| Library | Serilog | winston | stdlib `logging` | Hand-written (thin) |
| File rotation | `rollingInterval: Day` | `winston-daily-rotate-file` | `TimedRotatingFileHandler` | — (sent to the backend) |
| correlation | `LogContext.PushProperty` | `AsyncLocalStorage` + `child()` | `ContextVar` | header `X-Request-Id` |
| Level | `LogEventLevel` | `level` | `setLevel` | Its own enum |
| External configuration | `appsettings.json` | env `LOG_LEVEL` | env `LOG_LEVEL` | `isDevMode()` |


## reference: sources.md

# Sources · error-handling-patterns

- Section 7 checklist: idea from ECC error-handling.
- The 4 silent-failure kinds in section 7: adapted from silent-failure-hunter in pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10.
