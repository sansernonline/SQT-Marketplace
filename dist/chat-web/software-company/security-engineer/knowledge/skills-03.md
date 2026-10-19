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
| Second look at a finished piece inside a team | a new `reviewer` agent (it applies this checklist to code) |
| Contested design, large or high-risk diff, "stress test" / "find blind spots" | `adversarial-review-panel` (several `reviewer` agents) |
| Reviewing a visual (image, poster, screen look) | (if plugin `graphic-design` is installed) `graphic-design:design-review`, else `ui-craft` checks |
| Writing or updating the PR description itself | `pr-description-template` |
| Hunting misleading patterns across the codebase, not one diff | `code-gardener` |
| Scanners, secrets or dependency check before ship or after adding a dependency | `security-gate` (run both before merge) |

## Review Process

1. **Understand the intent** — read PR description and linked ticket
2. **Skim the diff** — get overall sense of changes
3. **Deep review** — go through each section of checklist below
4. **Run the code** if non-trivial — don't just read
5. **Leave actionable comments** — suggest fixes, not just point out problems

## Checklist

House checks first. Each skill holds the full rules, so link to it in the comment:

- [ ] Security: run [`security-gate`](../security-gate/SKILL.md) on the diff (input checked at the boundary, parameterized SQL, server-side permission check, no secrets in code or logs)
- [ ] Simple enough: [`lazy-coding`](../lazy-coding/SKILL.md) (no unused layers, standard library first, one concern per file)
- [ ] Readable: [`readable-code`](../readable-code/SKILL.md) (names, file and folder layout, config outside code)
- [ ] Tests sit next to the code and prove the change: [`testing-standards`](../testing-standards/SKILL.md)
- [ ] Shared code touched → [`blast-radius`](../blast-radius/SKILL.md) list is in the PR
- [ ] Commit message follows [`commit-message-format`](../commit-message-format/SKILL.md)

The generic list (correctness, design, performance, documentation, maintainability) is in [`references/full-checklist.md`](references/full-checklist.md).

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

These prefixes are for comments on a pull request. A review report uses the `reviewer` scale: `blocking:` = สูง · `important:` = กลาง · `nit:` = ต่ำ, verdict ผ่าน / ไม่ผ่าน

## Anti-patterns to Avoid

As a reviewer:
- ❌ Bikeshedding — don't fight over trivial style if there's no convention
- ❌ "Why didn't you do it MY way?" — there are often multiple valid approaches
- ❌ Only criticism — acknowledge good things too
- ❌ Vague comments like "this is wrong" — explain WHY and suggest fix
- ❌ Reviewing too much at once — request smaller PRs (under 400 lines)


## reference: full-checklist.md

# Code review — full generic checklist

Moved out of [SKILL.md](../SKILL.md). Open it for a large or unfamiliar change. The house-specific checks stay in SKILL.md.

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


---

# skill: simplicity-first

Use when producing a document, design, architecture or plan (BRD, FSD, ADR, roadmap). Simplest that works.

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

### Password policy (NIST SP 800-63B-4 §3.1.1.2, checked 2026-10-14 at pages.nist.gov/800-63-4/sp800-63b.html)
- ✅ Minimum **15 characters** when the password is the only factor · minimum **8** when it is used only inside multi-factor authentication (MFA)
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


---

# skill: config-and-secrets

Use when settings differ by environment or something must never be committed (keys, connection strings).

# Config และ Secret

> **กฎ 2 ข้อ:**
> 1. โค้ดชุดเดียวกันต้องรันได้ทุก environment ความต่างอยู่ที่ config เท่านั้น
> 2. secret ต้องไม่อยู่ใน git ไม่อยู่ใน log และไม่อยู่ในไฟล์ที่ส่งไปให้เบราว์เซอร์

## เมื่อไหร่ใช้ skill นี้

- เริ่มโปรเจกต์ หรือเพิ่ม environment ใหม่
- ต้องเก็บ connection string, API key, ใบรับรอง, กุญแจสำหรับเซ็น
- เจอค่าคงที่ฝังอยู่ในโค้ด (hardcode) แล้วต้องย้ายออก
- secret หลุดเข้า git หรือสงสัยว่าหลุด ให้ไปข้อ 8 ทันที

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| เก็บ secret ใน pipeline · ด่านอนุมัติ | `cicd-and-release` | แทน |
| ออกแบบ login, token, สิทธิ์ผู้ใช้ | `auth-implementation-patterns` | แทน |
| กันไม่ให้ค่าอ่อนไหวโผล่ใน log | `logging-standards` | แทน |
| connection string ของฐานข้อมูล | `database-design` | คู่ |
| บันทึกเหตุการณ์หลัง secret หลุด | `postmortem-template` | คู่ |
| ขั้นตอนตอนเกิดเหตุ | `incident-runbook-template` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

**วิธีทำจริงในแต่ละภาษาและเฟรมเวิร์ก** อยู่ใน `references/per-stack.md`

---

## 1 · แยก config กับ secret ให้ออกก่อน

| | config | secret |
|---|---|---|
| ตัวอย่าง | ที่อยู่ API, ระดับ log, จำนวนต่อหน้า, โซนเวลา, feature flag | รหัสผ่านฐานข้อมูล, API key, กุญแจเซ็น token, ใบรับรอง |
| อยู่ใน git ได้ | ✅ ได้ | ❌ ไม่ได้เด็ดขาด |
| ใครเห็นได้ | ทั้งทีม | เฉพาะที่จำเป็น |
| หลุดแล้วเป็นไร | ไม่เป็นไร | ต้องเพิกถอนและเปลี่ยนทันที |
| เปลี่ยนบ่อย | ตามงาน | ตามรอบหมุนเวียน |

> **ถ้าตัดสินใจไม่ได้ว่าเป็นแบบไหน ให้ถือว่าเป็น secret** เพราะระวังเกินไปเสียแค่ความรำคาญเล็กน้อย
> แต่ถ้าเดาผิด กุญแจจะอยู่ในประวัติ git ตลอดไป

---

## 2 · ลำดับความสำคัญ — ค่าหลังทับค่าก่อน

```
1. ค่าเริ่มต้นในโค้ด        (ปลอดภัย ใช้ได้จริงสำหรับ dev)
2. ไฟล์ config ตาม environment  (appsettings.Production.json, config/production.yaml)
3. ตัวแปรสภาพแวดล้อม        (environment variable)
4. secret store              (Key Vault, Secrets Manager, Kubernetes secret)
5. อาร์กิวเมนต์ตอนสั่งรัน     (ใช้ตอนไล่ปัญหาเท่านั้น)
```

**ค่าเริ่มต้นต้องปลอดภัย** ถ้าลืมตั้งค่า ระบบต้องทำงานแบบเข้มงวดที่สุด
เช่น `DEBUG=false` · `ALLOWED_ORIGINS=` ว่าง · เปิด TLS ไม่ใช่ตรงกันข้าม

---

## 3 · ตรวจตอนบูต — ขาดค่าไหนให้ตายทันที

> 🚨 ข้อนี้คุ้มที่สุดในหน้านี้
> ระบบที่บูตขึ้นมาได้ทั้งที่ config ผิด จะไปพังตอนตี 2 ในฟังก์ชันที่นาน ๆ ใช้ที
> ระบบที่ **ไม่ยอมบูต** เมื่อ config ผิด ทำให้รู้ตั้งแต่ตอน deploy ซึ่งยัง rollback ได้

```ts
// Node — zod
const Env = z.object({
  NODE_ENV:      z.enum(['development', 'staging', 'production']),
  PORT:          z.coerce.number().int().positive().default(3000),
  DATABASE_URL:  z.string().url(),
  JWT_SECRET:    z.string().min(32),
  LOG_LEVEL:     z.enum(['debug','info','warn','error']).default('info'),
});

export const env = Env.parse(process.env);   // ผิด = process ตายพร้อมบอกว่าตัวไหนผิด
```

**สิ่งที่ต้องตรวจ:** มีค่าครบ · ชนิดถูก · อยู่ในช่วงที่ยอมรับ ·
กุญแจยาวพอ · ค่าที่ห้ามใช้บน production (`JWT_SECRET=dev-secret` ต้องไม่ผ่าน)

**พิมพ์สรุป config ตอนบูต**: ชื่อค่า และค่าที่ไม่ใช่ secret
ส่วน secret พิมพ์แค่ "มีค่าแล้ว" หรือ 4 ตัวท้าย ไม่พิมพ์ค่าเต็ม

---

## 4 · ตั้งชื่อตัวแปรสภาพแวดล้อม

```
<ระบบ>_<กลุ่ม>_<ชื่อ>

APP_DB_HOST          APP_DB_PASSWORD
APP_REDIS_URL        APP_SMTP_PASSWORD
APP_FEATURE_NEW_CHECKOUT
```

| กฎ | เหตุผล |
|---|---|
| ตัวพิมพ์ใหญ่ ขีดล่าง | ข้อตกลงของทุกระบบปฏิบัติการ |
| มีคำนำหน้าของระบบ | กัน `PATH`, `HOME`, `USER` ของระบบชนกัน |
| ชื่อเดียวกันทุก environment | ค่าต่างได้ แต่ชื่อห้ามต่าง ไม่งั้นย้าย environment ทีไรต้องแก้โค้ด |
| ใส่หน่วยในชื่อ | `APP_TIMEOUT_SECONDS` ไม่ใช่ `APP_TIMEOUT` |
| อย่าใส่ชื่อ environment ในชื่อตัวแปร | ❌ `APP_PROD_DB_HOST` |

---

## 5 · `.env` และ `.env.example`

| ไฟล์ | อยู่ใน git | หน้าที่ |
|---|:--:|---|
| `.env.example` | ✅ | รายชื่อค่าที่ต้องมี **ทั้งหมด** พร้อมคำอธิบาย และค่าตัวอย่างที่ไม่ใช่ของจริง |
| `.env` | ❌ | ค่าจริงบนเครื่องนักพัฒนาแต่ละคน |
| `.env.production` | ❌ | **ไม่ควรมีไฟล์นี้เลย** เพราะ production ใช้ secret store |

```bash
# .gitignore
.env
.env.*
!.env.example
```

```bash
# .env.example
APP_DB_HOST=localhost              # ที่อยู่ฐานข้อมูล
APP_DB_PASSWORD=change-me          # ❗ ค่าจริงอยู่ใน 1Password ห้องทีม
APP_JWT_SECRET=                    # ❗ สร้างด้วย: openssl rand -base64 48
APP_LOG_LEVEL=debug
```

**`.env.example` ต้องอัปเดตในคอมมิตเดียวกับที่เพิ่มค่าใหม่**
ไม่งั้นคนถัดไปที่ clone จะเจอ error ที่ไม่มีใครอธิบายได้

> 🚨 **`.env` ที่ใส่ `.gitignore` ไม่ทัน**: ไฟล์ถูก track ไปแล้วแม้ครั้งเดียว
> การเพิ่มใน `.gitignore` ทีหลัง**ไม่ลบมันออกจากประวัติ** ต้อง `git rm --cached` และถือว่า secret หลุดแล้ว

---

## 6 · เก็บ secret ไว้ที่ไหน

| สถานการณ์ | ใช้ | หมายเหตุ |
|---|---|---|
| เครื่องนักพัฒนา | `.env` ที่ไม่เข้า git ส่วน .NET ใช้ `dotnet user-secrets` | ห้ามใช้ค่าของ production |
| ทีมเล็ก แชร์กัน | ตัวจัดการรหัสผ่านของทีม (1Password, Bitwarden) | ไม่ใช่แชต ไม่ใช่อีเมล ไม่ใช่ Google Sheet |
| production บนคลาวด์ | Azure Key Vault · AWS Secrets Manager · Google Secret Manager | ให้สิทธิ์ด้วย managed identity ไม่ใช่ key อีกอัน |
| Kubernetes | External Secrets Operator ดึงจาก vault ข้างบน | secret ของ Kubernetes เองเป็นแค่ base64 **ไม่ใช่การเข้ารหัส** |
| ต้องเก็บใน git จริง ๆ | SOPS หรือ sealed-secrets (เข้ารหัสก่อน commit) | ทางเลือกสุดท้าย |

**สิทธิ์:** แต่ละ service อ่านได้เฉพาะ secret ของตัวเอง environment แยกกันสนิท และ
ไม่มีบัญชีไหนอ่านได้ทุกอัน ยกเว้นบัญชีดูแลระบบที่บันทึกการเข้าถึง

---

## 7 · การหมุนเวียน (rotation)

**ออกแบบให้รองรับตั้งแต่วันแรก** ไม่ใช่รอถึงตอนต้องหมุนจริง

| ต้องมี | รายละเอียด |
|---|---|
| ใช้ 2 ค่าพร้อมกันได้ | ระหว่างเปลี่ยน ทั้งค่าเก่าและใหม่ต้องใช้ได้ ไม่งั้นต้องปิดระบบ |
| โหลดใหม่โดยไม่ต้อง restart | หรือยอมรับว่าต้อง deploy 1 รอบ และจดไว้ว่าต้องทำ |
| รอบเวลา | กุญแจเซ็น token 90 วัน · รหัสฐานข้อมูล 180 วัน · ใบรับรองก่อนหมดอายุ 30 วัน |
| ทำอัตโนมัติ | เพราะงานที่ต้องจำทำเอง สุดท้ายไม่มีใครทำ |

**กุญแจสำหรับเซ็น token ต้องมี id กำกับ (key id)** เพื่อให้เซ็น token ใหม่ด้วยกุญแจใหม่แล้ว
ก็ยังตรวจ token เก่าที่ยังไม่หมดอายุได้

---

## 8 · เมื่อ secret หลุด — ลำดับสำคัญกว่าความเร็ว

1. **เพิกถอนค่าเดิมก่อน**: ปิด key นั้นที่ต้นทาง
2. ออกค่าใหม่ แล้ว deploy
3. ตรวจ log ย้อนหลังว่ามีใครใช้จากที่ที่ไม่ใช่ของเราไหม
4. ลบออกจากประวัติ git (`git filter-repo`) และแจ้งทุกคนให้ clone ใหม่
5. บันทึกเหตุการณ์ด้วย `postmortem-template`

> 🚨 **ข้อ 4 ไม่ใช่ข้อ 1** เพราะลบ commit แล้วกุญแจก็ไม่ปลอดภัยขึ้นเลย
> ใครที่ fork หรือ clone ไปแล้ว รวมถึงข้อมูลสำรองของผู้ให้บริการ ยังมีค่าเดิมอยู่
> **ถือว่าทุก secret ที่เคยเข้า git คือหลุดแล้ว** แม้ repo จะเป็น private

---

## 9 · อย่าให้ secret ไหลออกทางอื่น

| ทางรั่ว | วิธีปิด |
|---|---|
| log | รายการคำที่ต้องปิดบัง ดูที่ `logging-standards` |
| ข้อความ error ที่ส่งให้ client | คืนเฉพาะ `requestId` ไม่ใช่ stack trace หรือ connection string |
| รายงาน crash / ตัวติดตามข้อผิดพลาด | ตั้งตัวกรองข้อมูลอ่อนไหวก่อนส่งออก |
| ประวัติคำสั่งใน shell | ใช้ `read -s` หรืออ่านจากไฟล์ แทนการพิมพ์ค่าลงบรรทัดคำสั่ง |
| `docker history` | อย่าใส่ secret ใน `ARG`/`ENV` ตอน build ให้ใช้ mount ตอนรันแทน |
| ไฟล์สำรองข้อมูลและ dump | เข้ารหัส และเก็บที่ที่คุมสิทธิ์ได้ |
| ภาพหน้าจอในเอกสารและ issue | ปิดบังก่อนแนบเสมอ |

---

## 10 · config ของ frontend — ไม่มีอะไรลับ

> 🚨 ทุกอย่างที่อยู่ในไฟล์ที่เบราว์เซอร์โหลด **คือข้อมูลสาธารณะ**
> ไม่ว่าจะชื่อว่า `VITE_SECRET_KEY` หรืออยู่ในไฟล์ที่ถูกย่อจนอ่านไม่ออกก็ตาม
> การย่อโค้ดไม่ใช่การเข้ารหัส เปิด DevTools ก็เห็น

| ใส่ใน frontend ได้ | ต้องอยู่ฝั่งเซิร์ฟเวอร์เท่านั้น |
|---|---|
| ที่อยู่ API · ชื่อ environment | API key ของบริการภายนอกทุกชนิด |
| กุญแจสาธารณะ (publishable key) ของผู้ให้บริการชำระเงิน | กุญแจลับ (secret key) ของผู้ให้บริการเดียวกัน |
| feature flag ที่ไม่ลับ | กฎการคิดราคา · เกณฑ์อนุมัติ |
| รหัสเว็บของตัววัดสถิติ | token ที่เรียก API ของบุคคลที่สาม |

**ถ้าต้องการเปลี่ยนค่าโดยไม่ build ใหม่** ให้โหลด `/config.json` ตอนแอปเริ่มทำงาน
แทนการฝังค่าตอน build (`import.meta.env`) ที่ล็อกค่าติดไปกับไฟล์ที่ build ได้

---

## 11 · Anti-patterns

- ❌ **connection string ในโค้ด** แม้จะเป็นของ dev เพราะสักวันจะมีคนลอกแบบนี้ไปใช้กับ production
- ❌ **`.env` ของ production วางไว้บนเซิร์ฟเวอร์** ใครเข้าเครื่องได้ก็อ่านได้ และไม่มีบันทึกว่าใครอ่าน
- ❌ **secret เดียวกันทุก environment** พอ staging หลุด production ก็หลุดด้วย
- ❌ **ส่ง secret ทางแชตหรืออีเมล** ค่าจะอยู่ในนั้นตลอดไป และค้นเจอด้วย
- ❌ **ไม่มี `.env.example`** คนใหม่จะเสียเวลาครึ่งวันเดาว่าต้องมีค่าอะไรบ้าง
- ❌ **บูตผ่านทั้งที่ config ไม่ครบ** แล้วไปพังตอนใช้งานจริง
- ❌ **พิมพ์ config ทั้งก้อนลง log ตอนบูต** รวม secret
- ❌ **`ALLOWED_ORIGINS=*` บน production** เพราะ "ตอน dev มันติด CORS"
- ❌ **กุญแจที่ไม่เคยเปลี่ยนเลยตั้งแต่ปีแรก**


## reference: per-stack.md

# วิธีทำจริงแยกตามภาษาและเฟรมเวิร์ก

1. [.NET / ASP.NET Core](#1--net--aspnet-core)
2. [Node.js](#2--nodejs)
3. [Python](#3--python)
4. [Angular และ frontend ทั่วไป](#4--angular-และ-frontend-ทั่วไป)
5. [Docker และ Kubernetes](#5--docker-และ-kubernetes)
6. [เครื่องมือตรวจ secret ที่หลุดเข้า git](#6--เครื่องมือตรวจ-secret-ที่หลุดเข้า-git)
7. [คำสั่งสร้างค่าสุ่มที่ปลอดภัย](#7--คำสั่งสร้างค่าสุ่มที่ปลอดภัย)

---

## 1 · .NET / ASP.NET Core

**บนเครื่องนักพัฒนา เก็บนอกโฟลเดอร์โปรเจกต์ จึงไม่มีทางเข้า git:**

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;..."
dotnet user-secrets list
```

**ตรวจตอนบูต:**

```csharp
public sealed class AppOptions
{
    public const string Section = "App";

    [Required, Url]                       public string ApiBaseUrl { get; init; } = "";
    [Required, MinLength(32)]             public string JwtSecret  { get; init; } = "";
    [Range(1, 300)]                       public int TimeoutSeconds { get; init; } = 30;
}

builder.Services
    .AddOptions<AppOptions>()
    .Bind(builder.Configuration.GetSection(AppOptions.Section))
    .ValidateDataAnnotations()
    .ValidateOnStart();                   // ← ขาดค่า = แอปไม่ยอมบูต
```

**ลำดับที่ ASP.NET Core อ่าน (ค่าหลังทับค่าก่อน):**

```
appsettings.json → appsettings.{Environment}.json → user-secrets (dev)
→ environment variable → อาร์กิวเมนต์บรรทัดคำสั่ง
```

ตัวแปรสภาพแวดล้อมใช้ `__` แทนลำดับชั้น เช่น `ConnectionStrings__Default`

**Azure Key Vault:**

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{vaultName}.vault.azure.net/"),
    new DefaultAzureCredential());        // ใช้ managed identity ไม่ต้องมี key อีกอัน
```

---

## 2 · Node.js

```ts
// config/env.ts — ไฟล์เดียวที่แตะ process.env ได้ทั้งโปรเจกต์
import { z } from 'zod';

const Env = z.object({
  NODE_ENV:     z.enum(['development','test','staging','production']),
  PORT:         z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET:   z.string().min(32),
  SMTP_PASSWORD: z.string().optional(),
}).superRefine((v, ctx) => {
  if (v.NODE_ENV === 'production' && v.JWT_SECRET.startsWith('dev-'))
    ctx.addIssue({ code: 'custom', message: 'ห้ามใช้ JWT_SECRET ของ dev บน production' });
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  console.error('config ไม่ถูกต้อง:', z.treeifyError(parsed.error));
  process.exit(1);
}
export const env = parsed.data;
```

> **ห้ามอ่าน `process.env` กระจายทั่วโค้ด** ให้รวมไว้ที่ไฟล์เดียว
> จะได้ตอบได้ว่าระบบใช้ค่าอะไรบ้าง โดยไม่ต้องไล่ grep ทั้งโปรเจกต์

Node 20 ขึ้นไปโหลด `.env` ได้เองด้วย `node --env-file=.env` ไม่ต้องพึ่ง `dotenv`

---

## 3 · Python

```python
# settings.py
from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="APP_", env_file=".env")

    env: str = Field(pattern="^(development|staging|production)$")
    database_url: PostgresDsn
    jwt_secret: str = Field(min_length=32)
    timeout_seconds: int = Field(default=30, ge=1, le=300)

settings = Settings()      # ขาดค่า = ValidationError ตั้งแต่ import
```

- อ่าน `APP_DATABASE_URL`, `APP_JWT_SECRET` ตาม `env_prefix`
- import ที่ระดับบนสุดของแอป error จะได้เกิดตอนบูต ไม่ใช่ตอนเรียกใช้ครั้งแรก

---

## 4 · Angular และ frontend ทั่วไป

> 🚨 **ทุกอย่างที่อยู่ในไฟล์ที่เบราว์เซอร์โหลด คือสาธารณะ** ไม่มีข้อยกเว้น

**แบบฝังตอน build** (`environment.ts`, `import.meta.env`, `NEXT_PUBLIC_*`):
ค่าติดไปกับไฟล์ที่ build ได้ เปลี่ยนค่าทีไรต้อง build ใหม่ จึงขัดกับกฎ build ครั้งเดียวแล้วใช้ทุก environment

**แบบโหลดตอนรัน (แนะนำ):**

```ts
// main.ts — โหลดก่อนแอปเริ่ม
fetch('/config.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(cfg => {
    (window as any).__APP_CONFIG__ = cfg;
    return bootstrapApplication(AppComponent, appConfig);
  });
```

```json
// config.json — ไฟล์นี้วางแยกต่อ environment ไม่ต้อง build ใหม่
{ "apiBaseUrl": "https://api.example.co", "env": "production", "sentryDsn": "..." }
```

ตั้ง header `Cache-Control: no-store` ให้ `/config.json` ไม่งั้นเบราว์เซอร์จะใช้ค่าเก่า

---

## 5 · Docker และ Kubernetes

**Docker อย่าใส่ secret ตอน build:**

```dockerfile
# ❌ ค่าจะติดอยู่ในชั้นของ image ตลอดไป เห็นได้ด้วย docker history
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN

# ✅ mount เฉพาะตอนใช้ ไม่ติดไปกับ image
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
```

```bash
docker build --secret id=npmrc,src=$HOME/.npmrc .
docker run --env-file .env myapp        # ตอนรัน ส่งค่าเข้าไป
```

**Kubernetes:**

```yaml
env:
  - name: APP_DB_PASSWORD
    valueFrom:
      secretKeyRef: { name: app-secrets, key: db-password }
```

> 🚨 **Secret ของ Kubernetes เป็นแค่ base64 ไม่ใช่การเข้ารหัส**
> ใครมีสิทธิ์ `get secret` ก็อ่านค่าได้ตรง ๆ
> ต้องเปิด encryption at rest ที่ etcd และคุมสิทธิ์ด้วย RBAC
> ทางที่ดีกว่า: ให้ External Secrets Operator ดึงค่าจาก Key Vault / Secrets Manager มาสร้าง Secret ให้

---

## 6 · เครื่องมือตรวจ secret ที่หลุดเข้า git

```bash
# ตรวจทั้งประวัติ
gitleaks detect --source . --redact

# กันไว้ก่อน commit
pip install pre-commit detect-secrets
detect-secrets scan > .secrets.baseline
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2
    hooks: [{ id: gitleaks }]
```

**ลบออกจากประวัติ** (ทำหลังเพิกถอนค่าเดิมแล้วเท่านั้น):

```bash
pip install git-filter-repo
git filter-repo --path .env --invert-paths
git push --force --all      # ทุกคนต้อง clone ใหม่
```

---

## 7 · คำสั่งสร้างค่าสุ่มที่ปลอดภัย

```bash
openssl rand -base64 48                 # กุญแจทั่วไป
openssl rand -hex 32                    # กุญแจ 256 บิตเป็นเลขฐานสิบหก
uuidgen                                 # id ไม่ลับ

node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

```powershell
# Windows
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Max 256 }))
```

> ❌ **อย่าใช้ตัวสุ่มทั่วไป** (`Math.random`, `random.random`, `Random` ของ .NET)
> เพราะพวกนี้คาดเดาได้ ต้องใช้ตัวสุ่มสำหรับงานเข้ารหัสตามคำสั่งข้างบน
