# skill: auth-implementation-patterns

Use when implementing authentication, designing login flows, choosing between session vs JWT, implementing OAuth/SSO, adding MFA, password reset, or any identity & access management feature. Covers patterns, security pitfalls, and concrete implementation guidance.

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


---

# skill: incident-runbook-template

Use when writing operational runbooks, on-call documentation, incident response playbooks, or "what to do when X breaks" guides. Provides a structured format that helps on-call engineers act fast during incidents.

# Incident Runbook Template

## When to use this skill

- Writing a runbook for a known failure mode
- Documenting on-call procedures
- Creating playbooks for common alerts
- After a postmortem identifies "we need a runbook for X"
- Onboarding new on-call engineers

## What's a Runbook?

A **runbook** answers: "Alert X fired. What do I do?"

It's NOT:
- ❌ A postmortem (that's analysis after)
- ❌ Architecture documentation (that's the bigger picture)
- ❌ Training material (too detailed)

It IS:
- ✅ Step-by-step actions
- ✅ Decision flowcharts
- ✅ Commands to copy-paste
- ✅ Escalation paths

---

## Runbook Quality Standards

A good runbook is:

| Property | Test |
|----------|------|
| **Actionable** | Can a tired engineer at 3am follow it? |
| **Concrete** | Are commands copy-pasteable? |
| **Tested** | Has someone followed it during a real incident? |
| **Updated** | Is the last-reviewed date < 6 months? |
| **Discoverable** | Can on-call find it from the alert link? |
| **Concise** | < 1 page for common cases |

---

## Runbook Template

```markdown
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
```

---

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

---

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

---

## What Makes Runbooks Fail

| Problem | Fix |
|---------|-----|
| Out of date | Review every 6 months, update after every incident |
| Too long | Split into multiple runbooks per failure mode |
| Too generic | Be specific to YOUR service |
| No commands | Include actual copy-paste commands |
| Not discoverable | Link from alerts, index page |
| No ownership | Each runbook has a team owner |
| Not tested | Run game days, follow during real incidents |

---

## Game Days

Test runbooks by simulating failures:

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

---

## Anti-patterns

- ❌ **Theoretical runbooks** written without experiencing the failure
- ❌ **Walls of context** before any actionable step
- ❌ **"Contact the team"** without specifying who/how
- ❌ **Mitigation = root-cause fix** (mitigation should be FAST, fix is later)
- ❌ **Runbook in a wiki nobody can find** — link from alert
- ❌ **Update postmortems but not runbooks** — postmortems → runbook updates

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.


---

# skill: spell-out-abbreviations

Use in every piece of writing produced for a person — documents, code comments, commit messages, chat replies, interface text, diagram labels. Each abbreviation is written out in full the first time with the short form in brackets, for example Model Context Protocol (MCP), and a specialist term gets a short plain-language gloss.

# Spell Out Abbreviations

> **กฎที่หนึ่ง:** ตัวย่อทุกตัว เขียนเต็มครั้งแรก แล้ววงเล็บตัวย่อไว้ — หลังจากนั้นใช้ตัวย่อได้
> **กฎที่สอง:** ศัพท์เฉพาะทุกคำ วงเล็บคำอธิบายสั้น ๆ ไว้ครั้งแรก — ผู้อ่านนอกสายต้องไม่ต้องเดา

## รูปแบบ

```
✅ Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
❌ MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **ครั้งแรกของแต่ละเอกสาร** เขียนเต็ม + วงเล็บ · ครั้งต่อไปใช้ตัวย่อล้วน
- เอกสารยาวที่แบ่งบท ให้เขียนเต็มใหม่**ครั้งแรกของแต่ละบท** เพราะคนมักอ่านทีละบท
- ตารางหรือหัวข้อที่ที่ไม่พอ ให้เขียนเต็มในบรรทัดแรกของส่วนนั้นแทน
- เอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป ต้องมี **อภิธานศัพท์ (glossary)** ท้ายเอกสาร

## ยกเว้น — ไม่ต้องขยาย

คำที่คนทั่วไปรู้จักมากกว่าชื่อเต็ม: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
และนามสกุลไฟล์ (`.docx`, `.pptx`) · ถ้าไม่แน่ใจ **ให้ขยาย** เสียเปล่าดีกว่าคนอ่านไม่รู้เรื่อง

## ศัพท์เฉพาะ — วงเล็บคำอธิบาย ไม่ใช่แค่ตัวย่อ

ตัวย่อขยายแล้วยังไม่พอ ถ้าชื่อเต็มก็ยังไม่บอกอะไร **คำที่ผู้อ่านนอกสายไม่รู้จัก
ต้องมีคำอธิบายสั้นในวงเล็บครั้งแรก**

```
❌ ใช้ idempotency key กันงานซ้ำ
✅ ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

❌ ต้องทำ expand-contract ตอน migrate
✅ ต้องทำ expand-contract (ทยอยเพิ่มของใหม่ก่อน ค่อยลบของเก่าทีหลัง) ตอนเปลี่ยนโครงฐานข้อมูล
```

**คำอธิบายต้องสั้นกว่าหนึ่งบรรทัด** ยาวกว่านั้นแปลว่าควรแยกเป็นประโยคของตัวเอง

**วัดว่าคำไหนต้องอธิบาย** ด้วยคำถามเดียว — คนที่ทำงานคนละสายกับเรื่องนี้
อ่านแล้วเดาความหมายได้ไหม เดาไม่ได้คือต้องอธิบาย

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
