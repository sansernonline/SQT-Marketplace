# skill: auth-implementation-patterns

Use when building login with sessions, JWT, OAuth or SSO

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

4. **OAuth 2.0 / OIDC ("Login with Google/GitHub", handing login to an identity provider (IdP)).** Always Authorization Code Flow with PKCE, even for confidential clients (steps in [`references/auth-flows.md`](references/auth-flows.md)). Validate the `id_token` signature with the IdP's JWKS, and validate `aud`, `iss`, `exp`, `nonce`. Use the `state` parameter against cross-site request forgery (CSRF) and validate it. Match `code_verifier` to `code_challenge`. Use a library (Auth0, Passport.js), do not write your own. Avoid: implicit flow · Resource Owner Password Credentials flow (both deprecated).

5. **MFA.** For a new app use WebAuthn (passkeys) by default (no shared secret to steal). Use TOTP when users need easy standard 2FA. Use SMS or email only as a last resort (SMS is not safe against SIM swap). Details: [`references/mfa.md`](references/mfa.md).

6. **Passwords.**
   - Hash with **Argon2id** (preferred) or **bcrypt** with cost ≥ 12. Never MD5, SHA-1, raw SHA-256 or plain text.
   - Policy per NIST SP 800-63B-4 (checked 2026-10-14): minimum **15 characters** when the password is the only factor, **8** when used only inside MFA. Check against breached passwords (Have I Been Pwned (HIBP) API). Allow long passphrases (any maximum at least 64) and special characters. No forced composition rules, no forced regular changes (only on suspected breach).
   - Reset flow: the response is the same whether or not the email exists. Token random, ≥ 256 bits, stored as a hash, expires in 15 minutes. After the new password is set, revoke all old sessions and send a confirmation email. All 9 steps: [`references/auth-flows.md`](references/auth-flows.md).

7. **Lockout and rate limiting.** 5 failed attempts in 15 min → lock 15 min; 10 in 1 hour → lock 1 hour; key on IP + email together. Message "Too many failed attempts. Try again in 15 minutes." Never "Account locked." (reveals the account exists). Use existing tools: [`references/libraries-and-code.md`](references/libraries-and-code.md).

8. **API authentication.** API key for simple server-to-server · OAuth 2.0 Client Credentials for service-to-service · mTLS for high-security internal · HMAC signing for webhooks. For an API key, show the secret once at creation, store it as a hash, let users revoke it at once. Table: [`references/api-auth-and-authorization.md`](references/api-auth-and-authorization.md).

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
- [`references/auth-flows.md`](references/auth-flows.md) — open when writing session, JWT, OAuth with PKCE or password reset code
- [`references/mfa.md`](references/mfa.md) — open when building MFA (TOTP setup, WebAuthn, SMS limits)
- [`references/api-auth-and-authorization.md`](references/api-auth-and-authorization.md) — open when designing API keys or RBAC/ABAC
- [`references/libraries-and-code.md`](references/libraries-and-code.md) — open when choosing a library or needing hashing and rate-limit samples
- [`references/sources.md`](references/sources.md) — NIST source and check date


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

### ABAC (Attribute-Based) — fine-grained
```
Allow if user.department === resource.department AND action === "read"
```


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


## reference: sources.md

# Sources · auth-implementation-patterns

- Password policy (minimum 15 characters as the only factor, 8 inside multi-factor authentication, breached-password check, no composition rules, no forced rotation, maximum at least 64): NIST SP 800-63B-4 §3.1.1.2, https://pages.nist.gov/800-63-4/sp800-63b.html, checked 2026-10-14.


---

# skill: config-and-secrets

Use when settings differ by environment or secrets need hiding

# Config and secrets

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
| Secrets in a Jenkinsfile (`withCredentials` · single quote) | `jenkins-pipeline` | together |
| Kubernetes secrets kept out of values.yaml (External Secrets · SealedSecret) | `kubernetes-helm` | together |
| Designing login, tokens, user permissions | `auth-implementation-patterns` | instead |
| Keeping sensitive values out of logs | `logging-standards` | instead |
| Database connection strings | `database-design` | together |
| Recording a secret leak · steps during the incident | `postmortem-template` · `incident-runbook-template` | together |

**How to do it in each language and framework** is in `references/per-stack.md`.

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

Node zod example: `references/per-stack.md` section 2. The pattern is a schema that parses `process.env` once at boot, so an invalid value kills the process and names the value.

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
5. Record the incident with `postmortem-template`.

> **Step 4 is not step 1**, because deleting the commit does not make the key any safer.
> Anyone who forked or cloned already, and the provider's backups, still have the old value.
> **Treat every secret that has ever been in git as leaked**, even if the repo is private.

---

## 9 · Do not let secrets flow out other ways

| Leak path | How to close it |
|---|---|
| Logs | The list of terms to mask is in `logging-standards` |
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


## reference: per-stack.md

# Practical how-to by language and framework

**Contents:** 1 .NET / ASP.NET Core · 2 Node.js · 3 Python · 4 Angular and frontend in general · 5 Docker and Kubernetes · 6 Tools that detect secrets leaked into git · 7 Commands that generate safe random values

1. [.NET / ASP.NET Core](#1--net--aspnet-core)
2. [Node.js](#2--nodejs)
3. [Python](#3--python)
4. [Angular and frontend in general](#4--angular-and-frontend-in-general)
5. [Docker and Kubernetes](#5--docker-and-kubernetes)
6. [Tools that detect secrets leaked into git](#6--tools-that-detect-secrets-leaked-into-git)
7. [Commands that generate safe random values](#7--commands-that-generate-safe-random-values)

---

## 1 · .NET / ASP.NET Core

**On the developer machine, stored outside the project folder so it can never reach git:**

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;..."
dotnet user-secrets list
```

**Validate at boot:**

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

**Order in which ASP.NET Core reads (later values override earlier ones):**

```
appsettings.json → appsettings.{Environment}.json → user-secrets (dev)
→ environment variable → อาร์กิวเมนต์บรรทัดคำสั่ง
```

Environment variables use `__` in place of hierarchy levels, for example `ConnectionStrings__Default`

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

> **Do not read `process.env` scattered through the code.** Gather it in one file
> so you can answer which values the system uses, without grepping the whole project

Node 20 and up can load `.env` itself with `node --env-file=.env`, with no need for `dotenv`

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

- Reads `APP_DATABASE_URL`, `APP_JWT_SECRET` according to `env_prefix`
- Import at the top level of the app so the error happens at boot, not at the first use

---

## 4 · Angular and frontend in general

> **Everything in a file the browser loads is public.** No exceptions

**Embedded at build time** (`environment.ts`, `import.meta.env`, `NEXT_PUBLIC_*`):
The value is baked into the built files. Every change needs a rebuild, which breaks the rule of building once and using in every environment

**Loaded at run time (recommended):**

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

Set the header `Cache-Control: no-store` on `/config.json`, otherwise the browser will use the old value

---

## 5 · Docker and Kubernetes

**For Docker, do not put secrets in at build time:**

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

Do not write a trailing `# comment` on a value line in a `.env` used with `--env-file`: docker keeps the comment as part of the value, making the value wrong with no error (tested 2026-11-04: `A=value # note` gives the value `value # note`) · put the comment on its own line

**Kubernetes:**

```yaml
env:
  - name: APP_DB_PASSWORD
    valueFrom:
      secretKeyRef: { name: app-secrets, key: db-password }
```

> **A Kubernetes Secret is only base64, not encryption**
> Anyone with `get secret` permission can read the value directly
> You must turn on encryption at rest in etcd and control access with RBAC
> A better way: let External Secrets Operator pull the value from Key Vault / Secrets Manager and create the Secret

---

## 6 · Tools that detect secrets leaked into git

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

**Remove from history** (only after the old value has been revoked):

```bash
pip install git-filter-repo
git filter-repo --path .env --invert-paths
# รอผู้ใช้อนุมัติก่อน · แจ้งทีมก่อน force push (เขียนประวัติร่วมทับ ทุกคนต้อง clone ใหม่)
git push --force --all
```

---

## 7 · Commands that generate safe random values

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

> Wrong: **do not use a general-purpose random generator** (`Math.random`, `random.random`, .NET `Random`)
> because they are predictable; use the cryptographic random generator as in the commands above


---

# skill: audit-trail

Use when a system must record who did what and when

# Audit trail

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
| Logs for technical troubleshooting | `logging-standards` | instead |
| Metrics and alerts | `observability-basics` | instead |
| Columns `created_by` `updated_at` in working tables | `database-design` | instead |
| Permissions and identity verification | `auth-implementation-patterns` | instead |
| Consent and data-subject rights | `pdpa-compliance` | instead |
| Requirements on what to keep and for how many years | `srs-writing` | together |

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
