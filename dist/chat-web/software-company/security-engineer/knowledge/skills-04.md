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
- Cookie: `HttpOnly`, `Secure`, `SameSite=Lax` (or Strict)
- Session ID: cryptographically random, ≥ 128 bits
- Session storage: Redis with a time-to-live (TTL). Not in app memory if you run more than one instance
- Idle timeout: 30 min default
- Absolute timeout: 8-12 hours
- Issue a new session ID when privileges change (login, role change)
- On logout, delete the session from the store

**Pitfalls:**
- ผิด: Storing session in JWT (can't revoke)
- ผิด: Using `localStorage` for the session token (cross-site scripting (XSS) can steal it)
- ผิด: Keeping the same ID after login (session fixation)

## Pattern 2: JWT (Stateless Token)

**When to use:** microservices, mobile, single-page app (SPA) with a backend API

> ระวัง: **JWT is overused.** If you have a single backend, sessions are simpler and safer.

**Implementation requirements:**
- Algorithm: `RS256` or `ES256` (NOT `HS256` for distributed systems)
- Short-lived access token: 5-15 min
- Refresh token: longer-lived (days), stored separately, revocable
- Issue a new refresh token each time one is used
- Required claims: `sub`, `iat`, `exp`, `iss`, `aud`
- Store JWT in `HttpOnly Secure cookie` (NOT localStorage)
- Have a way to cancel tokens (blocklist, short expiry, etc.)

**Pitfalls:**
- ผิด: `alg: none` attacks (check the algorithm explicitly)
- ผิด: Storing JWT in `localStorage` (XSS-stealable)
- ผิด: Long-lived access tokens (you can't cancel them)
- ผิด: Putting sensitive data in JWT (it's base64, not encrypted)
- ผิด: Skipping signature verification

## Pattern 3: OAuth 2.0 / OIDC

**When to use:** "Login with Google/GitHub", or handing login to an identity provider (IdP)

ใช้ Authorization Code Flow with PKCE (Proof Key for Code Exchange) เสมอ เพราะกันไม่ให้ code ที่ถูกขโมยไปแลกเป็น token ได้ ลำดับขั้นอยู่ใน [references/auth-flows.md](references/auth-flows.md)

**Implementation requirements:**
- **Always use PKCE** (even for confidential clients)
- Validate `id_token` signature (use IdP's JWKS)
- Validate `aud`, `iss`, `exp`, `nonce`
- Use the `state` parameter to prevent cross-site request forgery (CSRF)
- Match `code_verifier` to `code_challenge`
- Use a library, don't write your own (Auth0, Passport.js, etc.)

**Pitfalls:**
- ผิด: Implicit flow (deprecated, insecure)
- ผิด: Resource Owner Password Credentials flow (deprecated)
- ผิด: Skipping `state` validation (CSRF risk)
- ผิด: Trusting `id_token` without verifying signature

## Pattern 4: Multi-Factor Authentication (MFA)

มี 3 แบบ ถ้าเป็นแอปใหม่ให้ใช้ WebAuthn (passkeys) เป็นค่าเริ่มต้น เพราะไม่มีความลับร่วมให้ถูกหลอกเอาไป ถ้าต้องการ 2FA มาตรฐานที่ผู้ใช้ตั้งเองได้ง่ายให้ใช้ TOTP ส่วน SMS หรือ email ให้ใช้เป็นทางสุดท้ายเท่านั้น เพราะ SMS ไม่ปลอดภัยจากการสลับซิม (SIM swap) รายละเอียดทั้ง 3 แบบอยู่ใน [references/mfa.md](references/mfa.md)

## Pattern 5: Password Management

### Storage
- ถูก: **Argon2id** (preferred) or **bcrypt** (cost factor ≥ 12)
- ผิด: Never: MD5, SHA-1, SHA-256 raw, plain text

### Password policy (NIST SP 800-63B-4 §3.1.1.2, checked 2026-10-14 at pages.nist.gov/800-63-4/sp800-63b.html)
- ถูก: Minimum **15 characters** when the password is the only factor · minimum **8** when it is used only inside multi-factor authentication (MFA)
- ถูก: Check against a list of breached passwords (Have I Been Pwned (HIBP) API)
- ถูก: Allow long passphrases (any maximum must be at least 64 chars)
- ถูก: Allow special characters (don't restrict them)
- Don't force composition rules (uppercase + digit + symbol)
- Don't force regular password changes (only when you suspect a breach)

### Password reset flow

ข้อที่ห้ามพลาดในการรีเซ็ตรหัสผ่าน: ข้อความตอบต้องเหมือนกันไม่ว่าอีเมลจะมีในระบบหรือไม่ token ต้องสุ่มอย่างน้อย 256 bits เก็บแบบ hash และหมดอายุใน 15 นาที และเมื่อตั้งรหัสใหม่แล้วต้องยกเลิกทุก session เดิมและส่งอีเมลยืนยัน ลำดับขั้นครบทั้ง 9 ข้ออยู่ใน [references/auth-flows.md](references/auth-flows.md)

## Pattern 6: Account Lockout & Rate Limiting

```
Login attempts:
- 5 failed attempts in 15 min → lock account 15 min
- 10 failed attempts in 1 hour → lock 1 hour
- Use IP + email combo, not just one

Lockout messaging:
ถูก: "Too many failed attempts. Try again in 15 minutes."
ผิด: "Account locked." (reveals account exists)
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

- Writing your own crypto or auth (use libraries)
- Storing passwords reversibly
- JWT for sessions when you have one backend
- Long-lived JWT without rotation
- Authentication without authorization checks
- Trusting JWT claims as authorization source
- Logout that doesn't invalidate token server-side
- Allowing weak passwords for compliance "convenience"


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

- Note: SMS is **NOT secure** (SIM swap attacks)
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
| ค่าลับใน Jenkinsfile (`withCredentials` · single quote) | `jenkins-pipeline` | คู่ |
| Secret ของ Kubernetes ไม่อยู่ใน values.yaml (External Secrets · SealedSecret) | `kubernetes-helm` | คู่ |
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
| อยู่ใน git ได้ | ✓ ได้ | ✗ ไม่ได้เด็ดขาด |
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
เช่น `DEBUG=false` · `ALLOWED_ORIGINS=` ว่าง · เปิด Transport Layer Security (TLS) ไม่ใช่ตรงกันข้าม

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
| อย่าใส่ชื่อ environment ในชื่อตัวแปร | ✗ `APP_PROD_DB_HOST` |

---

## 5 · `.env` และ `.env.example`

| ไฟล์ | อยู่ใน git | หน้าที่ |
|---|:--:|---|
| `.env.example` | ✓ | รายชื่อค่าที่ต้องมี **ทั้งหมด** พร้อมคำอธิบาย และค่าตัวอย่างที่ไม่ใช่ของจริง |
| `.env` | ✗ | ค่าจริงบนเครื่องนักพัฒนาแต่ละคน |
| `.env.production` | ✗ | **ไม่ควรมีไฟล์นี้เลย** เพราะ production ใช้ secret store |

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

**ด่านก่อน commit** (แนวคิดจาก wshobson secrets-management): `.gitignore` กันแค่ไฟล์ที่รู้ชื่อ แต่กุญแจที่เผลอวางในโค้ดหรือ YAML ต้องมีตัวสแกน — ติดตั้ง gitleaks เป็น pre-commit hook ของทุก repo (`gitleaks git --pre-commit --staged` ใน gitleaks 8.19 ขึ้นไป · รุ่นก่อนหน้าใช้ `gitleaks protect --staged`) และรันซ้ำใน CI ทั้งประวัติด้วย `gitleaks git --redact` · hook ตกแล้วห้าม `--no-verify` ให้ย้ายค่าออกก่อน · เจอใน history แล้วไปข้อ 8 ทันที ไม่ใช่แค่ลบบรรทัด

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
4. ลบออกจากประวัติ git (`git filter-repo`) และแจ้งทุกคนให้ clone ใหม่ (ถ้าต้อง force push ให้รอผู้ใช้อนุมัติก่อน · แจ้งทีมก่อน)
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

- **connection string ในโค้ด** แม้จะเป็นของ dev เพราะสักวันจะมีคนลอกแบบนี้ไปใช้กับ production
- **`.env` ของ production วางไว้บนเซิร์ฟเวอร์** ใครเข้าเครื่องได้ก็อ่านได้ และไม่มีบันทึกว่าใครอ่าน
- **secret เดียวกันทุก environment** พอ staging หลุด production ก็หลุดด้วย
- **ส่ง secret ทางแชตหรืออีเมล** ค่าจะอยู่ในนั้นตลอดไป และค้นเจอด้วย
- **ไม่มี `.env.example`** คนใหม่จะเสียเวลาครึ่งวันเดาว่าต้องมีค่าอะไรบ้าง
- **บูตผ่านทั้งที่ config ไม่ครบ** แล้วไปพังตอนใช้งานจริง
- **พิมพ์ config ทั้งก้อนลง log ตอนบูต** รวม secret
- **`ALLOWED_ORIGINS=*` บน production** เพราะ "ตอน dev มันติด Cross-Origin Resource Sharing (CORS)"
- **กุญแจที่ไม่เคยเปลี่ยนเลยตั้งแต่ปีแรก**


## reference: per-stack.md

# วิธีทำจริงแยกตามภาษาและเฟรมเวิร์ก

**สารบัญ:** 1 .NET / ASP.NET Core · 2 Node.js · 3 Python · 4 Angular และ frontend ทั่วไป · 5 Docker และ Kubernetes · 6 เครื่องมือตรวจ secret ที่หลุดเข้า git · 7 คำสั่งสร้างค่าสุ่มที่ปลอดภัย

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
# ผิด: ค่าจะติดอยู่ในชั้นของ image ตลอดไป เห็นได้ด้วย docker history
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN

# ถูก: mount เฉพาะตอนใช้ ไม่ติดไปกับ image
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
gitleaks git --redact        # คำสั่ง detect เดิมถูกแทนด้วย git / dir

# กันไว้ก่อน commit
pip install pre-commit detect-secrets
detect-secrets scan > .secrets.baseline
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2   # ตัวอย่าง ตรวจ rev ล่าสุดก่อนใช้ (รอยืนยัน)
    hooks: [{ id: gitleaks }]
```

**ลบออกจากประวัติ** (ทำหลังเพิกถอนค่าเดิมแล้วเท่านั้น):

```bash
pip install git-filter-repo
git filter-repo --path .env --invert-paths
# รอผู้ใช้อนุมัติก่อน · แจ้งทีมก่อน force push (เขียนประวัติร่วมทับ ทุกคนต้อง clone ใหม่)
git push --force --all
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
# PowerShell 5.1 และ 7 (ตัวสุ่มสำหรับงานเข้ารหัส ไม่ใช่ Get-Random)
$b = New-Object byte[] 48
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
[Convert]::ToBase64String($b)
# PowerShell 7.4 ขึ้นไป: Get-SecureRandom ก็ใช้ได้
```

> ผิด: **อย่าใช้ตัวสุ่มทั่วไป** (`Math.random`, `random.random`, `Random` ของ .NET)
> เพราะพวกนี้คาดเดาได้ ต้องใช้ตัวสุ่มสำหรับงานเข้ารหัสตามคำสั่งข้างบน


---

# skill: audit-trail

Use when a system must show who did what and when (approvals, money, permissions, personal data).

# ร่องรอยการใช้งาน (audit trail)

> **กฎข้อเดียว:** ร่องรอยย้อนหลังสร้างไม่ได้
> วันที่ลูกค้าถามว่า "ใครเปลี่ยนราคาอันนี้" ถ้าไม่ได้เก็บไว้ก่อน ก็ตอบไม่ได้ตลอดไป

## เมื่อไหร่ใช้ skill นี้

- ระบบมีงานอนุมัติ การเงิน สิทธิ์ผู้ใช้ หรือข้อมูลส่วนบุคคล
- ลูกค้าหรือผู้ตรวจสอบถามได้ว่า "ใครทำ เมื่อไหร่ เปลี่ยนจากอะไรเป็นอะไร"
- มีข้อพิพาทเรื่องข้อมูลที่ถูกแก้ แล้วไม่มีใครตอบได้
- ระบบอยู่ภายใต้ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (Personal Data Protection Act: PDPA) หรือมาตรฐานที่ต้องตรวจย้อนหลังได้

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| log สำหรับไล่ปัญหาทางเทคนิค | `logging-standards` | แทน |
| ตัวชี้วัดและการแจ้งเตือน | `observability-basics` | แทน |
| คอลัมน์ `created_by` `updated_at` ในตารางงาน | `database-design` | แทน |
| สิทธิ์และการยืนยันตัวตน | `auth-implementation-patterns` | แทน |
| ความยินยอมและสิทธิเจ้าของข้อมูล | `pdpa-compliance` | แทน |
| ข้อกำหนดว่าต้องเก็บอะไรกี่ปี | `srs-writing` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · audit log ≠ application log

| | application log | **audit log** |
|---|---|---|
| มีไว้ให้ใครอ่าน | developer ตอนไล่ปัญหา | ผู้ตรวจสอบ · ลูกค้า · ฝ่ายกฎหมาย |
| เขียนอะไร | อะไรก็ได้ที่ช่วยไล่ปัญหา | **เฉพาะเหตุการณ์ที่มีความหมายทางธุรกิจ** |
| เก็บที่ไหน | ไฟล์ · ระบบรวบรวม log | **ตารางในฐานข้อมูล** หรือที่เก็บที่เขียนทับไม่ได้ |
| อายุ | 7–90 วัน | **เป็นปี ตามที่กฎหมายหรือสัญญากำหนด** |
| แก้ได้ไหม | ไม่สำคัญ | **ห้ามแก้ ห้ามลบ** |
| หายได้ไหม | หายบ้างรับได้ | **หายไม่ได้** ถ้าเขียนไม่สำเร็จ ธุรกรรมต้องล้มตาม |

> 🚨 **2 อย่างนี้แยกกันเสมอ** เพราะ audit log ที่ปนอยู่ในไฟล์ log ทั่วไป
> จะถูกลบตามอายุการเก็บ (retention) ของ log ภายในเดือนเดียว และไม่มีใครค้นเจอตอนที่ต้องใช้

---

## 2 · ฟิลด์ที่ทุกรายการต้องมี

| ฟิลด์ | ตัวอย่าง | หมายเหตุ |
|---|---|---|
| `id` | UUIDv7 | เรียงตามเวลาได้ |
| `occurred_at` | `2026-09-25T09:42:13.482Z` | **UTC** และเป็นเวลาที่เกิด ไม่ใช่เวลาที่บันทึก |
| `actor_id` | `1042` | id ผู้ใช้ ไม่ใช่ชื่อ เพราะชื่อเปลี่ยนได้ |
| `actor_type` | `user` · `system` · `api_client` | งานอัตโนมัติก็ต้องมีตัวตน |
| `actor_ip` · `user_agent` | | เก็บเมื่อจำเป็นต่อการตรวจสอบเท่านั้น |
| `action` | `order.cancelled` | **คำกริยารูปอดีต** แบบเดียวกันทั้งระบบ |
| `entity_type` · `entity_id` | `order` · `1042` | ของที่ถูกกระทำ |
| `changes` | `{"status":{"from":"confirmed","to":"cancelled"}}` | เฉพาะฟิลด์ที่เปลี่ยน |
| `reason` | "ลูกค้าโทรแจ้งยกเลิก" | บังคับกับการกระทำที่ต้องมีเหตุผล |
| `correlation_id` | `01J9Z8…` | เชื่อมกลับไปที่ application log |
| `result` | `success` · `denied` | **ต้องบันทึกครั้งที่ถูกปฏิเสธด้วย** |

> **การกระทำที่ถูกปฏิเสธมีค่ามากกว่าที่สำเร็จ** เพราะคนที่พยายามเข้าถึงสิ่งที่ไม่มีสิทธิ์
> คือสิ่งที่ผู้ตรวจสอบอยากเห็นที่สุด และเป็นสัญญาณเตือนที่ดีที่สุดที่มี

---

## 3 · เก็บเหตุการณ์ไหน

**เก็บ:**

| กลุ่ม | ตัวอย่าง |
|---|---|
| เงินและสัญญา | สร้าง/ยกเลิก/คืนเงิน · เปลี่ยนราคา · เปลี่ยนส่วนลด |
| การอนุมัติ | อนุมัติ · ปฏิเสธ · ส่งกลับแก้ |
| สิทธิ์และตัวตน | ให้/เพิกถอนสิทธิ์ · สร้าง/ปิดบัญชี · เปลี่ยนรหัสผ่าน · เข้าสู่ระบบล้มเหลวติดกัน |
| ข้อมูลส่วนบุคคล | ดู · แก้ · ส่งออก · ลบ |
| ค่าตั้งของระบบ | เปลี่ยนค่าที่กระทบทั้งระบบ |
| การเข้าถึงข้อมูลจำนวนมาก | ส่งออกรายงาน · ดาวน์โหลดรายชื่อ |

**ไม่เก็บ:** เปิดดูหน้าจอทั่วไป · ค้นหา · เรียงลำดับ · กดปุ่มที่ไม่เปลี่ยนอะไร
audit log ที่เก็บทุกอย่าง มีค่าเท่ากับไม่มีเลย เพราะค้นไม่เจอ

**ตั้งชื่อ action แบบเดียวทั้งระบบ:** `<entity>.<กริยาอดีต>` เช่น `order.cancelled` · `user.role_granted` ·
`invoice.exported` · `patient_record.viewed`

---

## 4 · เก็บ "เปลี่ยนอะไร" ยังไง

| วิธี | ดี | เสีย |
|---|---|---|
| **เก็บเฉพาะฟิลด์ที่เปลี่ยน (from/to)** ✓ | เล็ก อ่านรู้เรื่องทันที | อยากเห็นภาพรวมต้องไล่ย้อน |
| เก็บทั้งแถวก่อนและหลัง | ได้ภาพเต็ม | โตเร็วมาก และเสี่ยงเก็บข้อมูลอ่อนไหวเกินจำเป็น |
| เก็บเฉพาะว่า "แก้แล้ว" | เล็กสุด | **ตอบคำถามไม่ได้** ไม่ควรใช้ |

```jsonc
"changes": {
  "status":       { "from": "confirmed", "to": "cancelled" },
  "total_amount": { "from": "1250.00",   "to": "0.00" }
}
```

**ฟิลด์อ่อนไหวเก็บแค่ว่าเปลี่ยน ไม่เก็บค่า:**

```jsonc
"changes": { "password_hash": { "changed": true } }
```

---

## 5 · เขียนแล้วห้ามแก้

- ตาราง audit ให้สิทธิ์แค่ **INSERT และ SELECT** · บัญชีที่แอปใช้ต้องไม่มีสิทธิ์ UPDATE หรือ DELETE
- เขียนใน transaction เดียวกับการเปลี่ยนข้อมูลจริง **ถ้าเขียน audit ไม่สำเร็จ ธุรกรรมต้องล้มตาม**
- ห้ามแก้ประวัติเพื่อ "จัดระเบียบ" ถ้าบันทึกผิด ให้เพิ่มรายการแก้ไข ไม่เขียนทับ
- ระบบที่ต้องเข้มกว่านั้นให้ทำ hash ต่อกันเป็นสาย เพื่อพิสูจน์ว่าไม่มีใครแทรกหรือลบ

**อายุการเก็บ** ตั้งตามกฎหมายหรือสัญญา เอกสารทางบัญชีในไทยมักต้องเก็บ 5 ปี
เมื่อครบอายุให้ย้ายไปที่เก็บราคาถูก ไม่ลบทิ้งโดยไม่มีใครอนุมัติ

---

## 6 · ใครดูได้ และห้ามเก็บอะไร

| เรื่อง | กฎ |
|---|---|
| สิทธิ์อ่าน | เฉพาะบทบาทที่มีหน้าที่ตรวจสอบ และ**การอ่าน audit log ก็ต้องบันทึกลง audit ด้วย** |
| การส่งออก | บันทึกทุกครั้งว่าใครส่งออกช่วงไหน |
| **ห้ามเก็บ** | รหัสผ่าน · token · เลขบัตร · ข้อมูลสุขภาพ · เนื้อหาของข้อมูลส่วนบุคคล |
| เก็บได้แทน | ชี้ว่า**ของชิ้นไหน**ถูกดูหรือถูกแก้ ไม่ใช่เนื้อหาข้างใน |

> `patient_record.viewed` กับ `entity_id` ก็พอแล้ว **ห้ามคัดลอกผลตรวจลงไปใน audit log**
> ไม่งั้น audit log จะกลายเป็นที่รวมข้อมูลอ่อนไหวที่สุดในระบบ โดยไม่มีใครตั้งใจ

---

## 7 · แสดงให้คนอ่าน

หน้าจอประวัติต้องกรองได้อย่างน้อย 4 อย่าง: **ช่วงเวลา · ผู้ทำ · ประเภทการกระทำ · ของชิ้นไหน**

แสดงเป็นประโยคที่คนอ่านรู้เรื่อง ไม่ใช่ JSON ดิบ:

```
25 ก.ย. 2569 16:42  สมชาย (ฝ่ายขาย)  ยกเลิกคำสั่งซื้อ SO-2026-00042
                    สถานะ: ยืนยันแล้ว → ยกเลิก · เหตุผล: ลูกค้าโทรแจ้งยกเลิก
```

แสดงเวลาตามเขตเวลาของผู้ดู แต่เก็บเป็น UTC (ดู `i18n-and-locale`)

---

## 8 · Anti-patterns

- **เก็บ audit ในไฟล์ log ทั่วไป** — ถูกลบตาม retention ภายในเดือนเดียว
- **เก็บชื่อผู้ทำแทน id** — พอเขาเปลี่ยนนามสกุล ประวัติเก่าก็กลายเป็นคนละคน
- **บันทึกเฉพาะที่สำเร็จ** — ครั้งที่ถูกปฏิเสธคือสิ่งที่ผู้ตรวจสอบตามหา
- **บันทึกแค่ "แก้ไขข้อมูล"** โดยไม่บอกว่าจากอะไรเป็นอะไร
- **แอปมีสิทธิ์ UPDATE ตาราง audit** — ร่องรอยที่แก้ได้ ไม่ใช่ร่องรอย
- **เขียน audit นอก transaction** — ธุรกรรมสำเร็จแต่ไม่มีบันทึก
- **บันทึกทุกการคลิก** — ของสำคัญจมอยู่ในกองข้อมูลที่ไม่มีใครใช้
- **คัดลอกข้อมูลอ่อนไหวลง audit** — เกิดช่องรั่วใหม่โดยไม่ตั้งใจ
- **ไม่มีหน้าจอให้ดู** — มีข้อมูลแต่ต้องให้ developer query ทุกครั้งที่ลูกค้าถาม


---

# skill: file-upload-and-storage

Use when users upload files or the system stores and serves them (type checks, virus scan, links).

# รับไฟล์อัปโหลดและการเก็บไฟล์

> **กฎข้อเดียว:** ไฟล์ที่ผู้ใช้ส่งมาคือข้อมูลที่เชื่อไม่ได้
> ชื่อไฟล์ นามสกุล ชนิดที่เบราว์เซอร์แจ้งมา และขนาดที่บอกไว้ — **ปลอมได้ทั้งหมด**

## เมื่อไหร่ใช้ skill นี้

- มีหน้าจอให้ผู้ใช้แนบไฟล์ รูป หรือเอกสาร
- ระบบต้องเก็บไฟล์แล้วส่งกลับให้ดูหรือดาวน์โหลด
- ต้องตัดสินใจว่าเก็บไฟล์ไว้ที่ไหน
- มีไฟล์ที่ไม่ควรให้คนอื่นเห็น แต่ตอนนี้ใครมีลิงก์ก็เปิดได้

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| นำเข้า Excel/CSV แล้วเอาข้อมูลเข้าระบบ | `data-import-export` | แทน |
| สิทธิ์ว่าใครเข้าถึงอะไรได้ | `auth-implementation-patterns` | แทน |
| ประมวลผลไฟล์ใหญ่เป็นงานเบื้องหลัง | `background-jobs` | แทน |
| ตาราง metadata ของไฟล์ | `database-design` | คู่ |
| endpoint และ error ของการอัปโหลด | `api-conventions` · `web-service-essentials` | คู่ |
| อายุการเก็บไฟล์ที่มีข้อมูลบุคคล | `pdpa-compliance` | คู่ |
| ขนาดพื้นที่ที่ใช้และการแจ้งเตือน | `observability-basics` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · ตรวจก่อนรับ

| ตรวจอะไร | ทำยังไง |
|---|---|
| **ชนิดไฟล์** | อ่าน**เนื้อในไฟล์** (magic bytes) ไม่ใช่เชื่อนามสกุลหรือ `Content-Type` |
| **ขนาด** | บังคับที่เซิร์ฟเวอร์ **และ**ที่ตัวรับคำขอด้านหน้า — ตรวจฝั่งเบราว์เซอร์เป็นแค่ความสะดวก |
| จำนวนไฟล์ต่อครั้ง | ตั้งเพดาน |
| ขนาดรวมต่อผู้ใช้ | ตั้งโควตา ไม่งั้นคนเดียวกินพื้นที่หมด |
| ชนิดที่อนุญาต | **รายการที่อนุญาต ไม่ใช่รายการที่ห้าม** |

```
รายการที่อนุญาตทั่วไป: jpg · png · webp · pdf · xlsx · docx · csv
ห้ามเสมอ: ไฟล์รันได้ (exe, sh, bat) · ไฟล์สคริปต์ของเซิร์ฟเวอร์ (php, aspx, jsp) · svg ที่ไม่ได้ทำความสะอาด
```

> 🚨 **SVG คือ HTML** — มันรันสคริปต์ได้ ถ้าจะรับต้องทำความสะอาดก่อน หรือแปลงเป็น PNG
>
> 🚨 **ตรวจขนาดก่อนอ่านไฟล์เข้าหน่วยความจำ** — ไม่งั้นไฟล์ 5 GB ทำให้เซิร์ฟเวอร์ตาย
> ก่อนที่โค้ดตรวจขนาดจะได้ทำงาน

**สแกนไวรัส** สำหรับไฟล์ที่คนอื่นจะดาวน์โหลดต่อ — ระหว่างรอผลสแกนให้สถานะเป็น `pending`
และยังไม่ให้ใครเข้าถึง

---

## 2 · เก็บที่ไหน

| ที่เก็บ | เหมาะกับ | หมายเหตุ |
|---|---|---|
| **object storage** (S3 · Azure Blob · GCS) | ค่าเริ่มต้นที่ควรใช้ | ขยายได้ · มีลิงก์หมดอายุในตัว |
| ดิสก์ของเซิร์ฟเวอร์ | ระบบเล็ก เครื่องเดียว | **ต้องอยู่นอกโฟลเดอร์ที่เว็บเสิร์ฟ** และต้องสำรองข้อมูล |
| ในฐานข้อมูล | ไฟล์เล็กมากและต้องอยู่ใน transaction เดียวกัน | โตเร็ว · สำรองข้อมูลช้าลงมาก |

> ผิด: **เก็บไฟล์ในโฟลเดอร์ของแอป** — deploy ทีไรหาย และถ้ามีหลาย instance ก็ไม่เห็นกัน
> ผิด: **เก็บไฟล์ในโฟลเดอร์ที่เว็บเสิร์ฟตรง ๆ** — อัปโหลดไฟล์สคริปต์แล้วเรียกรันได้

**ฐานข้อมูลเก็บแค่ metadata ส่วนตัวไฟล์เก็บที่อื่น** — ตาราง metadata ต้องมีคอลัมน์
`id` · `original_name` · `stored_key` · `content_type` · `size_bytes` · `checksum` ·
`uploaded_by` · `uploaded_at` · `scan_status` · `owner_entity_type` · `owner_entity_id`

---

## 3 · ตั้งชื่อไฟล์ที่เก็บ

**ห้ามใช้ชื่อไฟล์ที่ผู้ใช้ส่งมาเป็นชื่อจริงที่เก็บ**

```
ผิด: uploads/รายงาน (1).xlsx              เว้นวรรค · ภาษาไทย · วงเล็บ
ผิด: uploads/../../etc/passwd             หลุดออกนอกโฟลเดอร์
ถูก: 2026/09/25/01J9Z8K7X2M4.xlsx         สุ่ม · แยกโฟลเดอร์ตามวันที่
```

- ชื่อจริงที่เก็บเป็นค่าสุ่ม (UUIDv7 หรือ ULID) + นามสกุลที่**ตรวจแล้ว**
- ชื่อเดิมของผู้ใช้เก็บไว้ในฐานข้อมูล แล้วส่งกลับตอนดาวน์โหลดผ่าน header
- แยกโฟลเดอร์ตามวันที่ — โฟลเดอร์เดียวที่มีไฟล์เป็นล้านจะช้าและเปิดดูไม่ไหว
- เก็บ checksum ไว้ด้วย — ตรวจไฟล์ซ้ำและตรวจว่าไฟล์ไม่เสีย

---

## 4 · ส่งไฟล์กลับให้ผู้ใช้

| ไฟล์ | วิธีส่ง |
|---|---|
| สาธารณะ (โลโก้ รูปสินค้า) | URL ตรงผ่าน CDN ได้ |
| **ส่วนตัว** (เอกสาร ใบเสร็จ รูปผู้ใช้) | **ลิงก์ที่มีลายเซ็นและหมดอายุ** 5–15 นาที |

> 🚨 **"ลิงก์เดายาก" ไม่ใช่การควบคุมสิทธิ์** — ลิงก์ถูกส่งต่อ ถูกบันทึกใน log ของ proxy
> และติดอยู่ใน `Referer` เสมอ ไฟล์ส่วนตัวต้อง**ตรวจสิทธิ์ทุกครั้ง**แล้วค่อยออกลิงก์ชั่วคราวให้

- ไฟล์ใหญ่ให้ผู้ใช้อัปโหลดตรงไปที่ object storage ด้วยลิงก์ที่เราเซ็นให้ ตัวไฟล์ไม่ต้องผ่านแอป
  **แต่การตรวจใน §1 ยังต้องครบ** — ทางนี้ข้ามแอปไป เลยต้องคืนการตรวจกลับมาแบบนี้:
  - **ตอนเซ็นลิงก์:** จำกัดขนาดและชนิดไว้ในลายเซ็น — S3 ใช้ presigned POST ที่ policy มี `content-length-range` และเงื่อนไข `Content-Type` (presigned PUT บังคับขนาดไม่ได้) · ผู้ให้บริการอื่นใช้ตัวเทียบเท่า เช่น GCS ใช้ header `x-goog-content-length-range`
  - **ตอนเซ็นลิงก์:** กำหนด key เอง (ชื่อสุ่มตาม §3) ลงที่โฟลเดอร์พักไฟล์ · ลิงก์หมดอายุสั้น · บันทึกแถว metadata ด้วย `scan_status = pending`
  - **หลังอัปโหลดเสร็จ** (event จาก storage หรือผู้ใช้แจ้งว่าเสร็จ): อ่าน magic bytes จริงจาก object · เทียบขนาดจริงกับเพดาน · สแกนไวรัส → ผ่านแล้วย้ายไปที่เก็บจริง และเปลี่ยนเป็น `clean` · ไม่ผ่านให้ลบหรือกักไว้
  - ระหว่าง `pending` ห้ามออกลิงก์ดาวน์โหลดให้ใคร
- ตอนส่งไฟล์ให้ดาวน์โหลด ต้องตั้ง `Content-Disposition` และ `Content-Type` ให้ถูก
  และห้ามส่ง HTML ที่ผู้ใช้อัปโหลดกลับมาแบบให้เบราว์เซอร์เรนเดอร์
- ถ้าทำได้ ให้เสิร์ฟไฟล์ของผู้ใช้จากคนละโดเมนกับแอป เพื่อกันสคริปต์ในไฟล์เข้าถึง cookie ของแอป

---

## 5 · รูปภาพ

- **ห้ามส่งรูปต้นฉบับจากกล้องลงหน้าจอ** — รูป 8 MB บนมือถือคือหน้าเว็บที่โหลดไม่ขึ้น
- สร้างขนาดย่อไว้ล่วงหน้า 2–3 ขนาด (thumbnail · ขนาดกลาง · ขนาดเต็มที่ย่อแล้ว)
- **ลบ EXIF ออก** — ในรูปมีพิกัดที่ถ่าย ผู้ใช้ไม่รู้ว่ากำลังเผยแพร่ออกไป
- แปลงเป็น WebP ถ้าเบราว์เซอร์รองรับ
- หมุนรูปตาม EXIF ก่อนลบ EXIF ทิ้ง ไม่งั้นรูปจากมือถือจะตะแคง
- ถ้าไฟล์ใหญ่หรือมีหลายไฟล์ ให้ย่อรูปเป็นงานเบื้องหลัง (ดู `background-jobs`)

---

## 6 · ลบและอายุการเก็บ

| เรื่อง | กฎ |
|---|---|
| ลบข้อมูลต้นเรื่อง | ต้องมีงานคอยตามลบไฟล์กำพร้าที่เหลืออยู่ด้วย |
| ลำดับการลบ | ลบ metadata ก่อน แล้วค่อยลบไฟล์ — ไฟล์กำพร้าไม่อันตราย แต่ metadata ที่ชี้ไปหาไฟล์ที่หายไปแล้วทำให้หน้าจอพัง |
| ไฟล์ที่อัปโหลดแล้วไม่ถูกผูกกับอะไร | ลบทิ้งหลัง 24 ชั่วโมง |
| อายุการเก็บ | กำหนดต่อประเภทไฟล์ · ไฟล์ที่มีข้อมูลบุคคลต้องมีวันหมดอายุ (ดู `pdpa-compliance`) |
| สำรองข้อมูล | ไฟล์ต้องอยู่ในแผนสำรองเหมือนฐานข้อมูล **และต้องเคยทดสอบกู้คืนจริง** |

---

## 7 · Anti-patterns

- **เชื่อนามสกุลไฟล์** — เปลี่ยนชื่อไฟล์เป็น `.jpg` ใครก็ทำได้
- **ตรวจขนาดแค่ฝั่งเบราว์เซอร์** — ข้ามได้ใน 3 วินาที
- **ใช้ชื่อไฟล์ของผู้ใช้เป็นเส้นทางจริง** — `../` พาไปไหนก็ได้
- **เก็บไฟล์ในโฟลเดอร์ที่เว็บเสิร์ฟ** — อัปโหลดสคริปต์แล้วเรียกรันได้
- **"ลิงก์เดายาก" แทนการตรวจสิทธิ์**
- **รับ SVG โดยไม่ทำความสะอาด** — สคริปต์ทำงานในเบราว์เซอร์คนอื่น
- **ส่งรูปต้นฉบับ 8 MB ลงมือถือ**
- **ไม่ลบ EXIF** — พิกัดบ้านผู้ใช้หลุดออกไปโดยไม่มีใครตั้งใจ
- **ไฟล์ไม่อยู่ในแผนสำรองข้อมูล** — ฐานข้อมูลกู้ได้ แต่เอกสารหายหมด
- **อ่านไฟล์ทั้งก้อนเข้าหน่วยความจำ** — ไฟล์ใหญ่ทำให้ process ตาย
