---
name: auth-implementation-patterns
description: Use when building login with sessions, JWT, OAuth or SSO
---

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
| [references/auth-flows.md](references/auth-flows.md) | When writing session, JWT, OAuth with PKCE or password reset code, open it for the step-by-step order |
| [references/mfa.md](references/mfa.md) | When choosing or building MFA and you need TOTP setup steps, WebAuthn usage or the limits of SMS |
| [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md) | Open this file if you are designing API authentication or API keys, or need RBAC and ABAC examples |
| [references/libraries-and-code.md](references/libraries-and-code.md) | When choosing a library by language, or you need sample code for password hashing and rate limiting |

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

> Caution: **JWT is overused.** If you have a single backend, sessions are simpler and safer.

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

Use Authorization Code Flow with PKCE (Proof Key for Code Exchange) always, because it stops a stolen code from being exchanged for a token. The steps are in [references/auth-flows.md](references/auth-flows.md)

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

There are 3 types. For a new app, use WebAuthn (passkeys) as the default, because there is no shared secret to steal. If you need 2FA that users can set up easily and that is standard, use TOTP. Use SMS or email only as a last resort, because SMS is not safe against SIM swap. Details of all 3 are in [references/mfa.md](references/mfa.md)

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

Must-haves for password reset: the response message must be the same whether or not the email exists in the system. The token must be random with at least 256 bits, stored as a hash, and expire in 15 minutes. After the new password is set, revoke all old sessions and send a confirmation email. All 9 steps in order are in [references/auth-flows.md](references/auth-flows.md)

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

Use existing tools instead of writing your own. The list of tools is in [references/libraries-and-code.md](references/libraries-and-code.md)

## Pattern 7: API Authentication

Choose by caller: API key for simple server-to-server · OAuth 2.0 Client Credentials for service-to-service · mTLS for internal systems that need high security · HMAC signing for verifying webhooks. For an API key, show the secret only once at creation, store it as a hash, and let users revoke it immediately. The comparison table and full principles are in [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

## Authorization Patterns (after authentication)

Use RBAC (Role-Based Access Control) as the main model, and use ABAC (Attribute-Based Access Control) when you need fine-grained permissions based on data attributes. Examples are in [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

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
