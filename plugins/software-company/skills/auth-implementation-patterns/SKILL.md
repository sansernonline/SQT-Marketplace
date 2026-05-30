---
name: auth-implementation-patterns
description: Use when implementing authentication, designing login flows, choosing between session vs JWT, implementing OAuth/SSO, adding MFA, password reset, or any identity & access management feature. Covers patterns, security pitfalls, and concrete implementation guidance.
---

# Authentication Implementation Patterns

## When to use this skill

- Building login/signup/logout
- Adding password reset flow
- Implementing MFA (TOTP, SMS, WebAuthn)
- Choosing session vs token authentication
- Integrating OAuth/OIDC (Google, GitHub, etc.)
- Implementing SSO (SAML, OIDC)
- Designing API authentication (API keys, JWT, OAuth)
- Reviewing existing auth code for security issues

---

## Choose the Right Pattern

### Decision tree

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

---

## Pattern 1: Session-Based Auth (Most apps)

**When to use:** Server-rendered apps, monoliths, single domain

**Flow:**
```
1. User submits credentials
2. Server validates, creates session ID
3. Server stores session in Redis/DB
4. Server sets HttpOnly Secure cookie
5. Client sends cookie on every request
6. Server looks up session, identifies user
```

**Implementation requirements:**
- ✅ Cookie: `HttpOnly`, `Secure`, `SameSite=Lax` (or Strict)
- ✅ Session ID: cryptographically random, ≥ 128 bits
- ✅ Session storage: Redis with TTL (NOT in-memory for multi-instance)
- ✅ Idle timeout: 30 min default
- ✅ Absolute timeout: 8-12 hours
- ✅ Regenerate on privilege change (login, role change)
- ✅ Invalidate on logout (delete from store)

**Pitfalls:**
- ❌ Storing session in JWT (can't revoke)
- ❌ Using `localStorage` for session token (XSS-vulnerable)
- ❌ Not rotating ID on login (session fixation)

---

## Pattern 2: JWT (Stateless Token)

**When to use:** Microservices, mobile, SPA with backend API

> ⚠️ **JWT is overused.** If you have a single backend, sessions are simpler and safer.

**Flow:**
```
1. User submits credentials
2. Server validates, signs JWT
3. Client stores JWT (in HttpOnly cookie preferred)
4. Client sends JWT on every request (Authorization header or cookie)
5. Server verifies signature, extracts claims
```

**Implementation requirements:**
- ✅ Algorithm: `RS256` or `ES256` (NOT `HS256` for distributed systems)
- ✅ Short-lived access token: 5-15 min
- ✅ Refresh token: longer-lived (days), stored separately, revocable
- ✅ Refresh token rotation on use
- ✅ Claims: `sub`, `iat`, `exp`, `iss`, `aud` mandatory
- ✅ Store JWT in `HttpOnly Secure cookie` (NOT localStorage)
- ✅ Have a revocation strategy (blocklist, short expiry, etc.)

**Pitfalls:**
- ❌ `alg: none` attacks (validate algorithm explicitly)
- ❌ Storing JWT in `localStorage` (XSS-stealable)
- ❌ Long-lived access tokens (no revocation possible)
- ❌ Putting sensitive data in JWT (it's base64, not encrypted)
- ❌ Skipping signature verification

---

## Pattern 3: OAuth 2.0 / OIDC

**When to use:** "Login with Google/GitHub", delegating auth to identity provider

### Authorization Code Flow with PKCE (recommended)

```
1. App → IdP: /authorize?code_challenge=...
2. User logs in at IdP
3. IdP → App: /callback?code=...
4. App → IdP: /token (with code_verifier)
5. IdP → App: access_token + id_token + refresh_token
```

**Implementation requirements:**
- ✅ **Always use PKCE** (even for confidential clients)
- ✅ Validate `id_token` signature (use IdP's JWKS)
- ✅ Validate `aud`, `iss`, `exp`, `nonce`
- ✅ Use `state` parameter to prevent CSRF
- ✅ Match `code_verifier` to `code_challenge`
- ✅ Use library: don't roll your own (Auth0, Passport.js, etc.)

**Pitfalls:**
- ❌ Implicit flow (deprecated, insecure)
- ❌ Resource Owner Password Credentials flow (deprecated)
- ❌ Skipping `state` validation (CSRF risk)
- ❌ Trusting `id_token` without verifying signature

---

## Pattern 4: Multi-Factor Authentication (MFA)

### TOTP (Google Authenticator, Authy)
**When:** Standard 2FA, user-friendly

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

### WebAuthn (Passkeys) — Future-proof
**When:** Want phishing-resistant, no SMS, hardware tokens

- Use `@simplewebauthn` library
- Supports Touch ID, Face ID, YubiKey
- No shared secret = no phishing
- Default for new apps in 2026+

### SMS / Email codes
**When:** No other option (users without smartphone apps)

- ⚠️ SMS is **NOT secure** (SIM swap attacks)
- Use only as last resort, not primary
- Rate limit aggressively
- Codes: 6 digits, 5 min expiry

---

## Pattern 5: Password Management

### Storage
- ✅ **Argon2id** (preferred) or **bcrypt** (cost factor ≥ 12)
- ❌ Never: MD5, SHA-1, SHA-256 raw, plain text

```typescript
// ✅ Good (using bcrypt)
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, storedHash);

// ❌ Bad
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

### Password policy (2026 NIST guidelines)
- ✅ Minimum 12 characters
- ✅ Check against breached password list (HIBP API)
- ✅ Allow long passphrases (NO max < 64 chars)
- ✅ Allow special chars (don't restrict)
- ❌ Don't force composition rules (uppercase + digit + symbol)
- ❌ Don't force periodic rotation (only if breach suspected)

### Password reset flow
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

---

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

Use existing tools:
- `express-rate-limit` (Node.js)
- `django-ratelimit` (Django)
- Cloudflare / AWS WAF (edge)

---

## Pattern 7: API Authentication

| Method | Use case | Token format |
|--------|----------|--------------|
| **API Keys** | Server-to-server, simple | `sk_live_xxx` |
| **OAuth 2.0 Client Credentials** | Service-to-service | JWT bearer |
| **mTLS** | High-security, internal | X.509 certs |
| **HMAC signing** | Webhook verification | `HMAC-SHA256` |

### API Key best practices
- Prefix with environment: `sk_test_xxx`, `sk_live_xxx`
- Show secret ONCE on creation
- Store hashed (like password)
- Allow scopes/permissions per key
- Allow expiration + rotation
- Last-used timestamp visible
- Revocable instantly

---

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

### Implementation tip
- Check authorization at every endpoint
- Don't trust client-sent role
- Server-side check based on user from session/token

---

## Common Vulnerabilities Checklist

- [ ] Session fixation (regenerate ID on login)
- [ ] CSRF (token or SameSite cookie)
- [ ] Brute force (rate limiting)
- [ ] Credential stuffing (HIBP check, MFA)
- [ ] Open redirect (allowlist redirect URLs)
- [ ] User enumeration (consistent error messages)
- [ ] Timing attacks (constant-time comparison)
- [ ] Token in URL (use header or cookie)
- [ ] Missing logout (invalidate server-side)
- [ ] Privilege escalation (re-check after role change)

---

## Library Recommendations

| Stack | Library | Notes |
|-------|---------|-------|
| Node.js | `passport`, `lucia-auth` | Lucia simpler, modern |
| Python | `authlib`, `python-jose` | authlib for OAuth |
| Go | `oauth2`, `golang-jwt` | Standard |
| Rust | `axum-login`, `jsonwebtoken` | — |
| Any | Auth0, Clerk, Supabase Auth | Managed (faster) |

---

## Anti-patterns

- ❌ Rolling your own crypto/auth (use libraries)
- ❌ Storing passwords reversibly
- ❌ JWT for sessions when you have one backend
- ❌ Long-lived JWT without rotation
- ❌ Authentication without authorization checks
- ❌ Trusting JWT claims as authorization source
- ❌ Logout that doesn't invalidate token server-side
- ❌ Allowing weak passwords for compliance "convenience"
