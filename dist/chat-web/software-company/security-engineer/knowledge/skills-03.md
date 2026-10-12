# skill: code-review-checklist

Use when reviewing a pull request, self-reviewing before submitting, or auditing code quality.

> **ใน SuperUser:** รีวิวเริ่มจาก playbook [`review`](../superuser/references/playbook-review.md) แล้วใช้ checklist นี้กับรีวิวทั่วไป ส่วนงานเสี่ยงสูงหรือ diff ใหญ่ใช้ [`adversarial-review-panel`](../adversarial-review-panel/SKILL.md)

# Code Review Checklist

## When to use this skill

- Reviewing a pull request
- Self-review before submitting code
- Onboarding new code reviewers
- Auditing code quality of existing modules

## When NOT to use

| Task | Use instead |
|---|---|
| Contested design, large or high-risk diff, "stress test" / "find blind spots" | `adversarial-review-panel` |
| Writing or updating the PR description itself | `pr-description-template` |
| Hunting misleading patterns across the codebase, not one diff | `code-gardener` |

## Review Process

1. **Understand the intent** — read PR description and linked ticket
2. **Skim the diff** — get overall sense of changes
3. **Deep review** — go through each section of checklist below
4. **Run the code** if non-trivial — don't just read
5. **Leave actionable comments** — suggest fixes, not just point out problems

## Checklist

### 🎯 Correctness

- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled? (null, empty, zero, negative, very large)
- [ ] Are error paths handled? (network failure, timeout, invalid input)
- [ ] Are race conditions / concurrency issues considered?
- [ ] Off-by-one errors checked?
- [ ] Are assumptions explicit (or asserted)?

### 🏗️ Design

- [ ] Does this fit the existing architecture?
- [ ] Is the abstraction at the right level? (not too generic, not too specific)
- [ ] Single Responsibility — does each function/class do one thing?
- [ ] DRY — but not over-abstracted?
- [ ] Are dependencies appropriate? (no circular, minimal coupling)
- [ ] Could this be simpler?

### 🧪 Tests

- [ ] Are there tests for the new code?
- [ ] Tests cover happy path + edge cases + errors?
- [ ] Tests would actually fail if code broke? (no false positives)
- [ ] Tests are readable and maintainable?
- [ ] No flaky tests introduced?

### 🔒 Security

- [ ] Input validation at boundaries?
- [ ] No SQL injection (parameterized queries)?
- [ ] No XSS (proper escaping)?
- [ ] No secrets/credentials in code?
- [ ] Authorization checks for sensitive operations?
- [ ] PII / sensitive data logged appropriately?
- [ ] Dependencies updated? No known CVEs?

### 🚀 Performance

- [ ] No N+1 queries?
- [ ] Appropriate caching where beneficial?
- [ ] Loops/algorithms with appropriate complexity?
- [ ] Large data handled with pagination/streaming?
- [ ] No unnecessary network calls?

### 📖 Readability

- [ ] Names reveal intent? (variables, functions, classes)
- [ ] Functions reasonably short?
- [ ] Complex logic has explanatory comments? (WHY, not WHAT)
- [ ] No commented-out code left behind?
- [ ] No debug prints / TODO without ticket?
- [ ] Consistent with existing code style?

### 📚 Documentation

- [ ] Public APIs documented?
- [ ] README/CHANGELOG updated if needed?
- [ ] Breaking changes called out?
- [ ] New env vars / config documented?

### 🔄 Maintainability

- [ ] Could a new team member understand this in 6 months?
- [ ] Easy to modify when requirements change?
- [ ] No magic numbers / strings (use constants)?
- [ ] Logging at appropriate levels?

## Comment Templates

### Suggestion (non-blocking)
```
nit: Consider X for readability
```

### Question
```
q: Why did you choose X over Y here?
```

### Blocking issue
```
blocking: This will cause Y in production because Z.
Suggest: <concrete fix>
```

### Praise
```
✨ Nice approach with X — much cleaner than the previous version.
```

## Review Severity Levels

| Prefix | Meaning |
|--------|---------|
| `blocking:` | Must fix before merge |
| `important:` | Should fix, can be follow-up if urgent |
| `nit:` | Minor improvement, optional |
| `q:` | Question, not necessarily a change |
| `praise:` | Acknowledge good work |

## Anti-patterns to Avoid

As a reviewer:
- ❌ Bikeshedding — don't fight over trivial style if there's no convention
- ❌ "Why didn't you do it MY way?" — there are often multiple valid approaches
- ❌ Only criticism — acknowledge good things too
- ❌ Vague comments like "this is wrong" — explain WHY and suggest fix
- ❌ Reviewing too much at once — request smaller PRs (under 400 lines)


---

# skill: simplicity-first

Use when producing a document, design, architecture or plan (BRD, FSD, ADR, roadmap, API design). Simplest version that works.

# Simplicity First

> The best architecture has the fewest moving parts. The best plan is the one a
> teammate can follow with no context.

This skill covers **non-code outputs** — documents, plans, architecture, and
designs. For code, use `lazy-coding`.

## The one test

Before submitting, ask:

> Could a tired teammate understand this in 6 months, with no prior context?

If "no" or "not sure" → simplify.

## 5 principles

1. **Start with the simplest thing that works.** Add complexity only when something breaks.
2. **Reduce moving parts.** Each component adds failure modes, ops burden, and docs. Default to one thing.
3. **Use familiar patterns.** Boring, proven tech for critical paths. Save novelty for low-risk experiments.
4. **Optimize for reading.** It's read far more often than written.
5. **Delete &gt; add.** The best edit removes something. The worst adds a layer for an imagined future need.

## By output type

### Documents (BRD, FSD, ADR)

Do: short sentences (≤ 20 words), plain English, one idea per paragraph, an
example for every abstract point, tables for structured data.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy"), undefined
jargon, walls of text, hedging ("might possibly potentially"), acronym soup.

### Architecture

Do: monolith first (split only when a bottleneck is proven), familiar stack,
standard patterns (REST, queues, caches), single source of truth per data type.

Avoid: microservices for small teams, distributed-everything, multi-master
databases before you must, event-driven by default (sync is simpler).

### Plans

Do: 3-5 priorities (not 20), a named owner per item, measurable success
criteria, realistic timelines with buffer, cut scope to fit time.

Avoid: vague goals ("improve quality"), 50-item lists (= no priority),
aspirational dates with no buffer, plans without success metrics.

### Designs (UX, API)

Do: fewest steps to the user's goal, reuse existing patterns, stay consistent
across screens, defaults that work for 80%, progressive disclosure.

Avoid: novel interactions where a standard one works, 10-step flows when 3
work, required fields with no smart default, hidden features needing tutorials.

## The 3-question filter

Before adding any new component, configuration option, or pattern:

1. Is there real evidence we need this **now** (not "might need")?
2. Is there a simpler way? (Sleep on it. Often yes.)
3. What's the cost of **not** adding it? (Often nothing, or a small refactor later.)

Two or more answers point to "simpler is fine" → don't add it.

## Examples

**API description**

❌ "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

✅ "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

❌ "Improve overall product quality and customer satisfaction through various
initiatives."

✅ "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

❌ "Event-sourced microservice with CQRS, Kafka ingestion, Redis cache, and a
dedicated auth service."

✅ "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

## Anti-patterns to reject

- **Future-proofing** — abstractions for needs that never arrive.
- **"It might scale"** — infra for 1M users while you have 1k.
- **Layer cake** — 6 layers where 90% just pass through.
- **Resume-driven design** — fancy tech to look sophisticated.
- **Buzzword stacking** — "cloud-native event-driven AI-powered".

## Pre-submit checklist

- [ ] A tired teammate would understand this in 6 months.
- [ ] Nothing can be deleted without losing meaning.
- [ ] No jargon the audience won't know.
- [ ] Every abstract claim has an example.
- [ ] I could explain the whole thing in two sentences.

If any answer is "no" → simplify before delivering.

> "Perfection is achieved not when there is nothing more to add, but when there
> is nothing left to take away." — Saint-Exupéry


---

# skill: auth-implementation-patterns

Use when implementing login or identity (session vs JWT, OAuth, SSO, MFA, password reset).

# Authentication Implementation Patterns

## When to use this skill

- Building login/signup/logout
- Adding password reset flow
- Adding multi-factor authentication (MFA): TOTP, SMS, WebAuthn
- Choosing session vs token authentication
- Integrating OAuth or OpenID Connect (OIDC) logins (Google, GitHub, etc.)
- Implementing single sign-on (SSO) with SAML or OIDC
- Designing API authentication (API keys, JSON Web Token (JWT), OAuth)
- Reviewing existing auth code for security issues

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/auth-flows.md](references/auth-flows.md) | ถ้าจะลงมือเขียน session · JWT · OAuth กับ PKCE หรือการรีเซ็ตรหัสผ่าน ให้เปิดดูลำดับขั้นทีละข้อ |
| [references/mfa.md](references/mfa.md) | ตอนเลือกหรือลงมือทำ MFA และต้องการขั้นตั้งค่า TOTP · การใช้ WebAuthn · ข้อจำกัดของ SMS |
| [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md) | ถ้าออกแบบการยืนยันตัวตนของ API หรือ API key หรือต้องการตัวอย่าง RBAC กับ ABAC ให้เปิดไฟล์นี้ |
| [references/libraries-and-code.md](references/libraries-and-code.md) | ตอนเลือกไลบรารีตามภาษา หรือต้องการโค้ดตัวอย่างการ hash รหัสผ่านและเครื่องมือจำกัดจำนวนครั้ง |

## Choose the Right Pattern

```
What's authenticating?
│
├─ Browser user
│  ├─ First-party app → Session cookies (HttpOnly, Secure, SameSite)
│  └─ Need cross-domain → JWT with httpOnly cookie (NOT localStorage)
│
├─ Mobile app
│  └─ Token-based: OAuth 2.0 PKCE flow
│
├─ Service-to-service
│  ├─ Same org → mTLS or service mesh
│  └─ External → OAuth 2.0 Client Credentials
│
└─ Third-party developer
   └─ API keys (with rotation) OR OAuth
```

## Pattern 1: Session-Based Auth (Most apps)

**When to use:** server-rendered apps, monoliths, one domain

**Implementation requirements:**
- ✅ Cookie: `HttpOnly`, `Secure`, `SameSite=Lax` (or Strict)
- ✅ Session ID: cryptographically random, ≥ 128 bits
- ✅ Session storage: Redis with a time-to-live (TTL). Not in app memory if you run more than one instance
- ✅ Idle timeout: 30 min default
- ✅ Absolute timeout: 8-12 hours
- ✅ Issue a new session ID when privileges change (login, role change)
- ✅ On logout, delete the session from the store

**Pitfalls:**
- ❌ Storing session in JWT (can't revoke)
- ❌ Using `localStorage` for the session token (cross-site scripting (XSS) can steal it)
- ❌ Keeping the same ID after login (session fixation)

## Pattern 2: JWT (Stateless Token)

**When to use:** microservices, mobile, single-page app (SPA) with a backend API

> ⚠️ **JWT is overused.** If you have a single backend, sessions are simpler and safer.

**Implementation requirements:**
- ✅ Algorithm: `RS256` or `ES256` (NOT `HS256` for distributed systems)
- ✅ Short-lived access token: 5-15 min
- ✅ Refresh token: longer-lived (days), stored separately, revocable
- ✅ Issue a new refresh token each time one is used
- ✅ Required claims: `sub`, `iat`, `exp`, `iss`, `aud`
- ✅ Store JWT in `HttpOnly Secure cookie` (NOT localStorage)
- ✅ Have a way to cancel tokens (blocklist, short expiry, etc.)

**Pitfalls:**
- ❌ `alg: none` attacks (check the algorithm explicitly)
- ❌ Storing JWT in `localStorage` (XSS-stealable)
- ❌ Long-lived access tokens (you can't cancel them)
- ❌ Putting sensitive data in JWT (it's base64, not encrypted)
- ❌ Skipping signature verification

## Pattern 3: OAuth 2.0 / OIDC

**When to use:** "Login with Google/GitHub", or handing login to an identity provider (IdP)

ใช้ Authorization Code Flow with PKCE (Proof Key for Code Exchange) เสมอ เพราะกันไม่ให้ code ที่ถูกขโมยไปแลกเป็น token ได้ ลำดับขั้นอยู่ใน [references/auth-flows.md](references/auth-flows.md)

**Implementation requirements:**
- ✅ **Always use PKCE** (even for confidential clients)
- ✅ Validate `id_token` signature (use IdP's JWKS)
- ✅ Validate `aud`, `iss`, `exp`, `nonce`
- ✅ Use the `state` parameter to prevent cross-site request forgery (CSRF)
- ✅ Match `code_verifier` to `code_challenge`
- ✅ Use a library, don't write your own (Auth0, Passport.js, etc.)

**Pitfalls:**
- ❌ Implicit flow (deprecated, insecure)
- ❌ Resource Owner Password Credentials flow (deprecated)
- ❌ Skipping `state` validation (CSRF risk)
- ❌ Trusting `id_token` without verifying signature

## Pattern 4: Multi-Factor Authentication (MFA)

มี 3 แบบ ถ้าเป็นแอปใหม่ให้ใช้ WebAuthn (passkeys) เป็นค่าเริ่มต้น เพราะไม่มีความลับร่วมให้ถูกหลอกเอาไป ถ้าต้องการ 2FA มาตรฐานที่ผู้ใช้ตั้งเองได้ง่ายให้ใช้ TOTP ส่วน SMS หรือ email ให้ใช้เป็นทางสุดท้ายเท่านั้น เพราะ SMS ไม่ปลอดภัยจากการสลับซิม (SIM swap) รายละเอียดทั้ง 3 แบบอยู่ใน [references/mfa.md](references/mfa.md)

## Pattern 5: Password Management

### Storage
- ✅ **Argon2id** (preferred) or **bcrypt** (cost factor ≥ 12)
- ❌ Never: MD5, SHA-1, SHA-256 raw, plain text

### Password policy (2026 NIST guidelines)
- ✅ Minimum 12 characters
- ✅ Check against a list of breached passwords (Have I Been Pwned (HIBP) API)
- ✅ Allow long passphrases (any maximum must be at least 64 chars)
- ✅ Allow special characters (don't restrict them)
- ❌ Don't force composition rules (uppercase + digit + symbol)
- ❌ Don't force regular password changes (only when you suspect a breach)

### Password reset flow

ข้อที่ห้ามพลาดในการรีเซ็ตรหัสผ่าน: ข้อความตอบต้องเหมือนกันไม่ว่าอีเมลจะมีในระบบหรือไม่ token ต้องสุ่มอย่างน้อย 256 bits เก็บแบบ hash และหมดอายุใน 15 นาที และเมื่อตั้งรหัสใหม่แล้วต้องยกเลิกทุก session เดิมและส่งอีเมลยืนยัน ลำดับขั้นครบทั้ง 9 ข้ออยู่ใน [references/auth-flows.md](references/auth-flows.md)

## Pattern 6: Account Lockout & Rate Limiting

```
Login attempts:
- 5 failed attempts in 15 min → lock account 15 min
- 10 failed attempts in 1 hour → lock 1 hour
- Use IP + email combo, not just one

Lockout messaging:
✅ "Too many failed attempts. Try again in 15 minutes."
❌ "Account locked." (reveals account exists)
```

ให้ใช้เครื่องมือที่มีอยู่แล้วแทนการเขียนเอง รายชื่อเครื่องมืออยู่ใน [references/libraries-and-code.md](references/libraries-and-code.md)

## Pattern 7: API Authentication

เลือกตามผู้เรียก: API key สำหรับ server-to-server แบบง่าย · OAuth 2.0 Client Credentials สำหรับ service-to-service · mTLS สำหรับระบบภายในที่ต้องการความปลอดภัยสูง · HMAC signing สำหรับตรวจ webhook ส่วน API key ต้องแสดง secret ครั้งเดียวตอนสร้าง เก็บแบบ hash และให้ผู้ใช้ยกเลิกได้ทันที ตารางเทียบและหลักการครบอยู่ใน [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

## Authorization Patterns (after authentication)

ใช้ RBAC (Role-Based Access Control) เป็นหลัก และใช้ ABAC (Attribute-Based Access Control) เมื่อต้องการสิทธิ์ละเอียดตามคุณสมบัติของข้อมูล ตัวอย่างอยู่ใน [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

### Implementation tip
- Check authorization at every endpoint
- Don't trust a role sent by the client
- Check on the server, using the user from the session or token

## Common Vulnerabilities Checklist

- [ ] Session fixation (regenerate ID on login)
- [ ] CSRF (token or SameSite cookie)
- [ ] Brute force (rate limiting)
- [ ] Credential stuffing, i.e. logins with leaked passwords (HIBP check, MFA)
- [ ] Open redirect (allowlist redirect URLs)
- [ ] User enumeration, i.e. finding which accounts exist (same error message every time)
- [ ] Timing attacks (compare in constant time)
- [ ] Token in URL (use header or cookie)
- [ ] Logout that does nothing on the server (invalidate server-side)
- [ ] Privilege escalation (re-check after role change)

## Anti-patterns

- ❌ Writing your own crypto or auth (use libraries)
- ❌ Storing passwords reversibly
- ❌ JWT for sessions when you have one backend
- ❌ Long-lived JWT without rotation
- ❌ Authentication without authorization checks
- ❌ Trusting JWT claims as authorization source
- ❌ Logout that doesn't invalidate token server-side
- ❌ Allowing weak passwords for compliance "convenience"


## reference: api-auth-and-authorization.md

# API Authentication และ Authorization Patterns

วิธียืนยันตัวตนของ API แต่ละแบบ หลักการจัดการ API key และตัวอย่าง RBAC กับ ABAC

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

### ABAC (Attribute-Based) — fine-grained
```
Allow if user.department === resource.department AND action === "read"
```


## reference: auth-flows.md

# ลำดับขั้นของแต่ละ flow

ลำดับขั้นทีละข้อของ session · JWT · OAuth กับ PKCE และการรีเซ็ตรหัสผ่าน ใช้ตอนลงมือเขียนโค้ดหรือรีวิวว่าโค้ดทำครบทุกขั้นไหม ส่วนข้อกำหนดและข้อผิดพลาดที่ต้องเลี่ยงอยู่ใน `SKILL.md`

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


## reference: libraries-and-code.md

# ไลบรารีและโค้ดตัวอย่าง

โค้ดตัวอย่างการเก็บรหัสผ่าน เครื่องมือจำกัดจำนวนครั้ง และไลบรารีที่แนะนำแยกตามภาษา

## Password storage — code

```typescript
// ✅ Good (using bcrypt)
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, storedHash);

// ❌ Bad
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
| Node.js | `passport`, `lucia-auth` | Lucia is simpler and newer |
| Python | `authlib`, `python-jose` | authlib for OAuth |
| Go | `oauth2`, `golang-jwt` | Standard |
| Rust | `axum-login`, `jsonwebtoken` | — |
| Any | Auth0, Clerk, Supabase Auth | Managed (faster) |


## reference: mfa.md

# Pattern 4: Multi-Factor Authentication (MFA)

รายละเอียดของการยืนยันตัวตนหลายขั้นทั้ง 3 แบบ ใช้ตอนเลือกหรือลงมือทำ MFA

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

- ⚠️ SMS is **NOT secure** (SIM swap attacks)
- Use only as a last resort, never as the main method
- Use strict rate limits
- Codes: 6 digits, 5 min expiry
