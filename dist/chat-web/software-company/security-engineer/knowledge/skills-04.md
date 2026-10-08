# skill: auth-implementation-patterns

Use when implementing login or identity (session vs JWT, OAuth, SSO, MFA, password reset). Pattern choice and security pitfalls.

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


---

# skill: incident-runbook-template

Use when writing an operational runbook, on-call guide or what to do when X breaks playbook, so on-call engineers act fast in an incident.

# Incident Runbook Template

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

## When to use this skill

- Writing a runbook for a known failure mode
- Documenting on-call procedures
- Creating playbooks for common alerts
- After a postmortem finds "we need a runbook for X"
- Onboarding new on-call engineers

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/runbook-template.md](references/runbook-template.md) | ทุกครั้งที่เริ่มเขียน runbook ใหม่ ให้คัดลอกแม่แบบเต็มจากไฟล์นี้ไปกรอก |
| [references/index-and-alert-links.md](references/index-and-alert-links.md) | ถ้าทีมยังไม่มีหน้ารวม runbook หรือ alert ยังไม่มีลิงก์ไปหา runbook ให้เปิดดูตัวอย่างในไฟล์นี้ |
| [references/game-days.md](references/game-days.md) | ตอนวางแผนซ้อมรับมือเหตุขัดข้องเพื่อทดสอบว่า runbook ใช้ได้จริง |

## What's a Runbook?

A **runbook** answers: "Alert X fired. What do I do?"

It's NOT:
- ❌ A postmortem (that analyses the incident afterwards)
- ❌ Architecture documentation (that explains the bigger picture)
- ❌ Training material (that goes into too much detail)

It IS:
- ✅ Step-by-step actions
- ✅ Decision flowcharts
- ✅ Commands to copy-paste
- ✅ Escalation paths

## Runbook Quality Standards

A good runbook is:

| Property | Test |
|----------|------|
| **Actionable** | Can a tired engineer at 3am follow it? |
| **Concrete** | Are commands copy-pasteable? |
| **Tested** | Has someone followed it during a real incident? |
| **Updated** | Was it last reviewed less than 6 months ago? |
| **Discoverable** | Can on-call find it from the alert link? |
| **Concise** | Under 1 page for common cases |

## Runbook Template

แม่แบบเต็มอยู่ใน [references/runbook-template.md](references/runbook-template.md) ทุกฉบับมีส่วนตามลำดับนี้ และแต่ละส่วนต้องมีของต่อไปนี้

| ส่วน | ต้องมี |
|---|---|
| ส่วนหัว | Severity · Service · Owner Team · Last Reviewed · Linked Alert |
| 🎯 TL;DR (30 seconds) | ย่อหน้าเดียวว่าอะไรพัง ต้องทำอะไรก่อน และต้องโทรหาใคร |
| 📊 How to Detect | อาการที่ผู้ใช้เห็นและที่เห็นภายใน · alert ที่ดัง · dashboard ที่ต้องเปิด |
| 🔍 Diagnosis (60 seconds) | ผัง flowchart ตัดสินใจ และ quick checks ที่เป็นคำสั่งคัดลอกไปรันได้ เรียงตามลำดับ |
| 🩹 Mitigation Steps | ขั้นตอนเรียงจากความเสี่ยงต่ำไปสูง ทุกขั้นบอก Expected effect และ Caveats หรือ If doesn't work |
| 📞 Escalation Path | ใครต้องถูกเรียกเมื่อไหร่ เป็นนาทีที่ชัดเจน |
| 🔁 Verification | รายการตรวจว่าแก้แล้วจริง |
| 📝 After Resolution | บันทึกในช่องเหตุการณ์ → อัปเดตหน้าสถานะ → เปิดตั๋ว postmortem → อัปเดต runbook นี้ |
| 🤝 Related Runbooks · 📚 Background | ลิงก์ไป runbook ที่เกี่ยวข้อง และที่มาของปัญหาแบบสั้น (ไม่บังคับ) |

**ลำดับ mitigation ในแม่แบบ:** 🟢 Reduce load (low risk) → 🟡 Scale up (medium risk) → 🟠 Rollback recent deploy (higher risk) → 🔴 Failover to backup region (last resort)

**ลำดับ escalation ในแม่แบบ:** ถ้าแก้ไม่ได้ใน 15 นาที ให้เรียก secondary on-call ถ้าสองคนแก้ไม่ได้ใน 30 นาที ให้เรียกทีมเจ้าของ service ถ้ายังเป็น SEV1 หลัง 45 นาที ให้เรียก incident commander (IC) และถ้า SEV1 เกิน 1 ชั่วโมง ให้เรียกผู้บริหารฝ่ายวิศวกรรม

**ถือว่าแก้แล้วเมื่อ** error rate กลับสู่ระดับปกติ · latency p95 ต่ำกว่าเกณฑ์ · หน้าสถานะเป็น "Operational" · ไม่มี alert ใหม่ · ลูกค้าหยุดแจ้งปัญหา และเฝ้าดูต่ออีก 30 นาทีแล้ว

> 💡 Use `postmortem-template` skill for the full analysis

## Runbook Index and Alert Links

ทำหน้ารวม runbook ไว้ที่เดียว ให้ค้นได้ทั้งตาม service ตามชื่อ alert และตามเหตุที่เกิดบ่อยใน 90 วันล่าสุด

alert ทุกตัว**ต้อง**มีลิงก์ไป runbook ผ่าน annotation `runbook:` ของ alert และควรใส่ `dashboard:` คู่กันด้วย ส่วนตัวอย่างหน้ารวมและตัวอย่าง AlertManager อยู่ใน [references/index-and-alert-links.md](references/index-and-alert-links.md)

## What Makes Runbooks Fail

| Problem | Fix |
|---------|-----|
| Out of date | Review every 6 months, update after every incident |
| Too long | Split into 1 runbook per failure mode |
| Too generic | Be specific to YOUR service |
| No commands | Include actual copy-paste commands |
| Not discoverable | Link it from the alert and the index page |
| No ownership | Each runbook has a team owner |
| Not tested | Run game days, and follow it during real incidents |

## Game Days

ทดสอบ runbook ด้วยการจำลองเหตุขัดข้องโดยตั้งใจ ทุกไตรมาสให้เลือก runbook หนึ่งฉบับ จำลองเหตุใน staging แล้วให้ on-call ทำตาม จากนั้นอัปเดต runbook ตามช่องโหว่ที่เจอ รายการตรวจเต็มอยู่ใน [references/game-days.md](references/game-days.md)

## Anti-patterns

- ❌ **Theoretical runbooks** written by someone who never saw the failure
- ❌ **Long background text** before the first action
- ❌ **"Contact the team"** without saying who or how
- ❌ **Treating mitigation as the root-cause fix** (mitigation should be FAST; the fix comes later)
- ❌ **Runbook in a wiki nobody can find** — link from alert
- ❌ **Update postmortems but not runbooks** — every postmortem should lead to a runbook update

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.


## reference: game-days.md

# Game Days

รายการตรวจของการซ้อมรับมือเหตุขัดข้องเพื่อทดสอบ runbook ใช้ตอนวางแผนซ้อมรายไตรมาส

Test runbooks by faking failures on purpose:

```markdown
## Game Day Checklist

Quarterly:
- [ ] Pick a runbook to test
- [ ] Simulate the failure in staging (chaos engineering)
- [ ] On-call engineer follows runbook
- [ ] Identify gaps
- [ ] Update runbook based on learnings
- [ ] Repeat with different runbook next quarter
```


## reference: index-and-alert-links.md

# Runbook Index และการผูก runbook กับ alert

ตัวอย่างหน้ารวม runbook และตัวอย่างการใส่ลิงก์ runbook ลงใน alert ใช้ตอนตั้งระบบ runbook ของทีมครั้งแรก

## Runbook Index Pattern

Maintain a central index:

```markdown
# 📚 Runbook Index

## By Service
- [API Service](runbooks/api/)
  - [High error rate](runbooks/api/high-error-rate.md)
  - [Memory leak](runbooks/api/memory-leak.md)
- [Database](runbooks/db/)
  - [Connection pool exhausted](runbooks/db/conn-pool.md)
  - [Replication lag](runbooks/db/repl-lag.md)

## By Alert Name
| Alert | Runbook |
|-------|---------|
| `api_5xx_rate_high` | [API: High error rate](link) |
| `db_connections_high` | [DB: Connection pool](link) |
| `disk_full_warn` | [Generic: Disk full](link) |

## Most Common Incidents (last 90 days)
1. High error rate on payment service — [runbook](link) (12 times)
2. DB replication lag — [runbook](link) (8 times)
3. Cache invalidation storm — [runbook](link) (5 times)
```

## Linking Runbook to Alert

Every alert MUST link to a runbook:

```yaml
# Prometheus AlertManager
- alert: APIHighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  annotations:
    summary: "API error rate > 5%"
    runbook: "https://runbooks.example.com/api/high-error-rate"
    dashboard: "https://grafana.example.com/d/api-overview"
```


## reference: runbook-template.md

# Runbook Template

- [แม่แบบทั้งไฟล์](#runbook-template) อยู่ในบล็อกเดียว ให้คัดลอกทั้งบล็อกไปเป็นไฟล์ runbook ใหม่

แม่แบบเต็มของ runbook หนึ่งฉบับ ให้คัดลอกไปกรอกต่อได้ทันที ส่วนกฎว่าแต่ละส่วนต้องมีอะไรอยู่ใน `SKILL.md`

````markdown
# 🚨 Runbook: <Alert Name or Failure Mode>

| | |
|--|--|
| **Severity** | 🔴 SEV1 \| 🟠 SEV2 \| 🟡 SEV3 |
| **Service** | service-name |
| **Owner Team** | @team-name |
| **Last Reviewed** | YYYY-MM-DD |
| **Linked Alert** | [Grafana/PagerDuty link] |

---

## 🎯 TL;DR (30 seconds)

> One paragraph: what's broken, what to do first, who to call.

## 📊 How to Detect

**Symptoms:**
- User-facing: ...
- Internal: ...

**Alerts that fire:**
- 🚨 [Alert Name](link) — fires when ...
- 🚨 [Another Alert](link) — fires when ...

**Dashboards to check:**
- 📈 [Main Dashboard](link)
- 📈 [Service Health](link)

## 🔍 Diagnosis (60 seconds)

\`\`\`mermaid
flowchart TD
    Start([Alert fires]) --> Q1{Is the service healthy in dashboard?}
    Q1 -->|No| A[Check infrastructure]
    Q1 -->|Yes| Q2{Are errors >5%?}
    Q2 -->|Yes| B[Check recent deploys]
    Q2 -->|No| Q3{Is latency high?}
    Q3 -->|Yes| C[Check downstream services]
    Q3 -->|No| D[Check alert config - may be false alarm]
\`\`\`

### Quick checks (run in order)

**1. Is service responding?**
\`\`\`bash
curl -fsS https://api.example.com/health || echo "DOWN"
\`\`\`

**2. Are recent deploys suspicious?**
\`\`\`bash
gh release list --repo our-org/service --limit 5
\`\`\`

**3. Check error rate in logs:**
\`\`\`bash
# Last 10 min of 5xx errors
kubectl logs -n prod deployment/api --since=10m | grep -c '"status":5'
\`\`\`

**4. Check downstream dependencies:**
- Database: [Dashboard link]
- Redis: [Dashboard link]
- External API: [Status page link]

## 🩹 Mitigation Steps

Try mitigations in order of risk (lowest first):

### 🟢 Step 1: Reduce load (low risk)
\`\`\`bash
# Enable rate limiting
kubectl set env deployment/api -n prod RATE_LIMIT_AGGRESSIVE=true
\`\`\`

**Expected effect:** Error rate drops within 2 min
**If doesn't work:** Go to Step 2

### 🟡 Step 2: Scale up (medium risk)
\`\`\`bash
kubectl scale deployment/api -n prod --replicas=10
\`\`\`

**Expected effect:** Latency improves within 3 min
**Caveats:** Will increase cost, monitor budget alerts

### 🟠 Step 3: Rollback recent deploy (higher risk)
\`\`\`bash
kubectl rollout undo deployment/api -n prod
\`\`\`

**Expected effect:** Reverts to previous version
**Caveats:** Loses any data created since deploy

### 🔴 Step 4: Failover to backup region (last resort)
\`\`\`bash
# Update DNS to point to backup region
./scripts/failover-to-us-west.sh
\`\`\`

**Expected effect:** All traffic shifts to backup
**Caveats:** Some user data may need migration, full rollback complex

## 📞 Escalation Path

```
You can't resolve in 15 min
  ↓
1. Page secondary on-call (PagerDuty group: team-secondary)
  ↓
You both can't in 30 min
  ↓
2. Page service owner team (team-owner)
  ↓
Still SEV1 after 45 min
  ↓
3. Page incident commander on-call (IC)
  ↓
SEV1 still active after 1h
  ↓
4. Page engineering leadership
```

## 🔁 Verification (after mitigation)

Confirm the issue is resolved:

- [ ] Error rate back to baseline
- [ ] Latency p95 < threshold
- [ ] Status page updated to "Operational"
- [ ] No new alerts firing
- [ ] Customer reports stopped
- [ ] Monitor for 30 min before considering resolved

## 📝 After Resolution

1. **Document in incident channel**: what happened, what you did
2. **Update status page**: clear incident, post resolution message
3. **Create postmortem ticket**: if SEV1/SEV2, schedule postmortem
4. **Update this runbook**: if you learned something new

> 💡 Use `postmortem-template` skill for the full analysis

## 🤝 Related Runbooks

- [Database connection issues](link)
- [Cache failure](link)
- [Authentication service down](link)

## 📚 Background / Why this happens

Optional section: brief context on why this failure mode exists.
Useful for new on-call engineers.
````


---

# skill: spell-out-abbreviations

Use when writing anything for a person (docs, comments, commits, replies, UI text, labels). Spell out each abbreviation on first use, gloss jargon.

# Spell Out Abbreviations

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อ 1:** ตัวย่อทุกตัว เขียนเต็มครั้งแรก แล้ววงเล็บตัวย่อไว้ — หลังจากนั้นใช้ตัวย่อได้
> **กฎข้อ 2:** ศัพท์เฉพาะทุกคำ วงเล็บคำอธิบายสั้น ๆ ไว้ครั้งแรก — ผู้อ่านนอกสายจะได้ไม่ต้องเดา

## รูปแบบ

```
✅ Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
❌ MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **ครั้งแรกของแต่ละเอกสาร** เขียนเต็มแล้ววงเล็บตัวย่อ ครั้งต่อไปใช้ตัวย่อล้วน
- เอกสารยาวที่แบ่งบท ให้เขียนเต็มใหม่**ครั้งแรกของแต่ละบท** เพราะคนมักอ่านทีละบท
- ตารางหรือหัวข้อที่มีที่ไม่พอ ให้เขียนเต็มในบรรทัดแรกของส่วนนั้นแทน
- เอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป ต้องมี **อภิธานศัพท์ (glossary)** ท้ายเอกสาร

## ยกเว้น — ไม่ต้องขยาย

คำที่คนทั่วไปรู้จักมากกว่าชื่อเต็ม: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
และนามสกุลไฟล์ (`.docx`, `.pptx`) ถ้าไม่แน่ใจ **ให้ขยาย** เพราะขยายเกินไม่เสียหาย แต่คนอ่านไม่รู้เรื่องเสียหาย

## ศัพท์เฉพาะ — วงเล็บคำอธิบาย ไม่ใช่แค่ตัวย่อ

ขยายตัวย่อแล้วอาจยังไม่พอ ถ้าชื่อเต็มก็ยังไม่บอกอะไร **คำที่ผู้อ่านนอกสายไม่รู้จัก
ต้องมีคำอธิบายสั้นในวงเล็บครั้งแรก**

```
❌ ใช้ idempotency key กันงานซ้ำ
✅ ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

❌ ต้องทำ expand-contract ตอน migrate
✅ ต้องทำ expand-contract (ทยอยเพิ่มของใหม่ก่อน ค่อยลบของเก่าทีหลัง) ตอนเปลี่ยนโครงฐานข้อมูล
```

**คำอธิบายต้องสั้นกว่า 1 บรรทัด** ถ้ายาวกว่านั้นให้แยกเป็นประโยคของตัวเอง

**วัดว่าคำไหนต้องอธิบาย** ด้วยคำถามเดียว — คนที่ทำงานคนละสายกับเรื่องนี้
อ่านแล้วเดาความหมายได้ไหม ถ้าเดาไม่ได้ก็ต้องอธิบาย

| ระดับผู้อ่าน | อธิบายแค่ไหน |
|---|---|
| ลูกค้า ผู้บริหาร คนนอกสาย | ศัพท์เทคนิคทุกคำ แม้แต่คำที่ช่างใช้กันทุกวัน |
| ทีมพัฒนาแต่คนละส่วน | เฉพาะคำเฉพาะของส่วนนั้น เช่น ชื่อรูปแบบ ชื่อกระบวนการ |
| คนที่ทำเรื่องนี้อยู่แล้ว | เฉพาะคำที่เพิ่งตั้งขึ้นใหม่ในโปรเจกต์นี้ |

---

## ใช้กับอะไรบ้าง

เอกสารทุกชนิด · คอมเมนต์ในโค้ด · ข้อความ commit · ข้อความบนหน้าจอ · คำอธิบายไดอะแกรม ·
คำตอบในแชต — **ทุกอย่างที่มีคนอ่าน**

## ตัวอย่างที่เจอบ่อย

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Service Level Agreement (SLA) · Role-Based Access Control (RBAC) ·
Software Development Life Cycle (SDLC) · Single Sign-On (SSO) ·
Continuous Integration / Continuous Deployment (CI/CD) ·
Software Requirements Specification (SRS) · Key Performance Indicator (KPI) ·
Personally Identifiable Information (PII) · Proof of Concept (POC) ·
Business Requirements Document (BRD) · Functional Specification Document (FSD) ·
Architecture Decision Record (ADR) · User Interface (UI) · User Experience (UX)

## Anti-patterns

- ❌ ขยายตัวย่อซ้ำทุกครั้งที่โผล่ — รกและกวนสายตา ครั้งแรกพอ
- ❌ วงเล็บกลับด้าน — `MCP (Model Context Protocol)` อ่านสะดุดกว่าเขียนเต็มขึ้นก่อน
- ❌ ขยายผิด — ถ้าไม่รู้ว่าย่อมาจากอะไร ให้ค้นก่อน อย่าเดา
- ❌ ขยายตัวย่อครบแต่ปล่อยศัพท์เฉพาะลอย — `Quadratic Weighted Kappa (QWK)` ยังไม่ช่วยใครถ้าไม่บอกว่ามันวัดอะไร
- ❌ อธิบายยาวเป็นย่อหน้าในวงเล็บ — วงเล็บไว้ให้คำสั้น ๆ ถ้ายาวให้แยกประโยค


---

# skill: answer-shape

Use when an answer has structure (options, trade-offs, how parts connect, several numbers). Chooses prose, table, small diagram or short list.

# รูปทรงของคำตอบ

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

ไฟล์นี้เหมือนกันทุก plugin ใน SQT-Marketplace ต้นฉบับอยู่ที่ plugin `superuser` ถ้าจะแก้ให้แก้ที่นั่นแล้วรัน `node scripts/sync/sync-superuser.mjs`

> **กฎข้อเดียว:** เนื้อหามีโครงสร้างอะไร คำตอบใช้รูปทรงนั้น
> เปรียบเทียบ → ตาราง · เชื่อมโยง → รูป · เรื่องเดียว → ประโยค

---

## เลือกรูปทรงจากสัญญาณในคำถาม

| สัญญาณ | รูปทรง |
|---|---|
| "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" | **ตารางเปรียบเทียบ** |
| "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" | **รูป** |
| "มีอะไรบ้าง" ที่ไม่ได้เทียบกัน | **รายการหัวข้อย่อย** |
| "ทำไม" · "แปลว่าอะไร" · เรื่องเดียวไม่มีแขนง | **ประโยคธรรมดา** |
| ตัวเลขหลายตัวที่ต้องดูพร้อมกัน | **ตาราง** |
| ขั้นตอนที่ต้องทำเรียงกัน | **รายการมีเลข** |

**สัญญาณสำคัญที่สุดคือมี "สิ่งที่ถูกเทียบ" ตั้งแต่ 2 ตัวขึ้นไป** แบบนี้ให้ใช้ตาราง
เพราะถ้าเขียนเป็นย่อหน้า ผู้อ่านต้องจำตัวแรกไว้ในหัวระหว่างอ่านตัวที่ 2

---

## ตารางที่อ่านง่าย

- **คอลัมน์แรกคือสิ่งที่ถูกเทียบ** คอลัมน์ถัดไปคือแง่มุมที่เทียบ
- **3–5 คอลัมน์** เกินนี้อ่านไม่ทัน ส่วนแถวไม่เกิน 8 แถวในคำตอบแชต
- **ทุกช่องต้องมีเนื้อ** — ช่องว่างแปลว่าคอลัมน์นั้นไม่ควรมี หรือข้อมูลยังไม่ครบ ถ้าไม่มีข้อมูลให้เขียนว่า "ไม่มี" ตรง ๆ
- **ช่องละไม่เกิน 1 บรรทัด** ถ้ายาวกว่านั้นให้ยกไปเขียนใต้ตาราง
- **เรียงแถวตามน้ำหนัก** ตัวที่แนะนำหรือตัวที่ใช้บ่อยที่สุดอยู่บนสุด ไม่ใช่เรียงตามตัวอักษร
- **หัวคอลัมน์เป็นคำถามที่ผู้อ่านมีในหัว** ไม่ใช่ชื่อสาขาวิชา

```
❌ | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
✅ | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

**ปิดท้ายตารางด้วยข้อสรุป 1 บรรทัดเสมอ** — ตารางบอกข้อมูล ไม่ได้บอกว่าควรเลือกอะไร

---

## เมื่อไหร่รูปชนะตาราง

ใช้รูปเมื่อ**ความสัมพันธ์คือคำตอบ** — ตารางบอกคุณสมบัติได้ แต่บอกไม่ได้ว่าอะไรต่อกับอะไร

| ใช้รูป | ใช้ตาราง |
|---|---|
| อะไรต่อกับอะไร · อะไรอยู่ในอะไร | ตัวไหนดีกว่าตัวไหนในแง่ใด |
| ลำดับที่มีทางแยกหรือวนกลับ | ขั้นตอนเรียงตรงไม่มีแขนง (ใช้รายการมีเลขพอ) |
| สิ่งเดียวกันในหลายสถานะ | สิ่งต่างกันในแง่มุมเดียวกัน |

ในแชต **รูปเล็ก ๆ แบบ ASCII หรือ Mermaid สั้น ๆ ก็พอ** — ไม่ต้องเปิดเครื่องมือวาด

```
กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน
                    │
                    └──▶ ที่เก็บถาวร
```

รูปที่ต้องเป็นไฟล์จริงเพื่อใส่เอกสารหรือสไลด์ ให้ใช้ skill วาดรูปของ plugin นั้น (ถ้ามี)

---

## เมื่อไหร่ประโยคชนะทั้งคู่

- คำตอบสั้นกว่า 3 บรรทัด — ตาราง 2 แถวเป็นแค่การตกแต่ง ไม่ได้อธิบายอะไร
- คำถามที่ตอบว่า "ใช่" หรือ "ไม่ใช่" แล้วตามด้วยเหตุผล 1 ประโยค
- เรื่องที่**เหตุผลสำคัญกว่าตัวเลือก** — ตารางจะตัดเหตุผลทิ้งเพื่อให้พอดีช่อง

> ตารางที่มีแถวเดียวหรือ 2 แถวสั้น ๆ แปลว่าใช้ผิดรูปทรง

---

## Anti-patterns

- ❌ **ย่อหน้ายาวเปรียบเทียบ 3 ตัวเลือก** — ผู้อ่านต้องจำตัวแรกไว้จนจบ
- ❌ **ตารางที่มีช่องว่าง** หรือช่องที่เขียนว่า "ขึ้นอยู่กับ" ทุกช่อง
- ❌ **ตาราง 2 แถวเพื่อให้ดูเป็นระเบียบ**
- ❌ **รูปที่วาดสิ่งที่ประโยคเดียวบอกได้**
- ❌ **ตารางที่ไม่มีข้อสรุป** — ทิ้งให้ผู้อ่านตัดสินใจเอง ทั้งที่เขาถามเพราะอยากได้คำแนะนำ
- ❌ **เรียงแถวตามตัวอักษร** ทั้งที่มีตัวที่แนะนำชัดเจน
- ❌ **หัวคอลัมน์เป็นศัพท์วิชาการ** ทั้งที่เขียนเป็นคำถามธรรมดาได้

---

## เชื่อมกับ skill อื่น

- ถ้อยคำ ความยาว และการตัดกลิ่น AI ใช้ `human-writing`
- รูปที่ต้องเป็นไฟล์จริง หรือการเปิดเรื่องที่ต้องให้ผู้ใช้ตัดสินใจ ให้ใช้ skill เฉพาะของ plugin นั้นถ้ามี

---

## ตัวย่อ

- **ASCII** — American Standard Code for Information Interchange (การวาดรูปด้วยตัวอักษรธรรมดา)
- **Mermaid** — ภาษาเขียนไดอะแกรมเป็นข้อความ แล้วให้โปรแกรมวาดให้
