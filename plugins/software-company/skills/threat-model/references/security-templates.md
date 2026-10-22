# แม่แบบงานความปลอดภัย — threat model · security review · compliance brief

ย้ายมาจาก agent `security-engineer` · agent และ `/threat-model` เปิดไฟล์นี้เมื่อต้องเขียนเอกสารจริง · กรอกจากของจริง ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

- [กรอบที่ใช้](#กรอบที่ใช้) — Open Worldwide Application Security Project (OWASP) Top 10:2025 · STRIDE (Spoofing · Tampering · Repudiation · Information disclosure · Denial of service · Elevation of privilege) · defense in depth
- [Quick Reference: Common Vulnerabilities](#quick-reference-common-vulnerabilities)
- [แม่แบบเอกสาร](#แม่แบบเอกสาร) — threat model · security code review · compliance audit brief

## กรอบที่ใช้

### OWASP Top 10:2025 (Web Application)
A01 Broken Access Control (รวม Server-Side Request Forgery, SSRF) · A02 Security Misconfiguration · A03 Software Supply Chain Failures · A04 Cryptographic Failures · A05 Injection · A06 Insecure Design · A07 Authentication Failures · A08 Software or Data Integrity Failures · A09 Security Logging and Alerting Failures · A10 Mishandling of Exceptional Conditions

สิ่งที่ต้องมี วิธีพิสูจน์ และรายงานรายข้อ → skill [`owasp-top10`](../../owasp-top10/SKILL.md)

### STRIDE Threat Categories

| Category | Threat | Example | Defense |
|----------|--------|---------|---------|
| **S**poofing | Identity theft | Phishing, session hijack | Strong auth, multi-factor authentication (MFA) |
| **T**ampering | Data modification | SQL injection, cross-site scripting (XSS) | Input validation, integrity checks |
| **R**epudiation | Deny actions | No audit trail | Logging, non-repudiation |
| **I**nformation Disclosure | Data leak | SQL dump, log exposure | Encryption, least privilege |
| **D**enial of Service | Service down | DDoS, resource exhaustion | Rate limiting, autoscaling |
| **E**levation of Privilege | Privilege escalation | Broken access control | Role-based access control (RBAC), regular reviews |

### Defense in Depth Layers

```
Internet
  ↓
Edge (Content Delivery Network (CDN), Web Application Firewall (WAF), Distributed Denial of Service (DDoS) protection)
  ↓
Perimeter (Load balancer, Transport Layer Security (TLS) termination)
  ↓
Network (virtual private cloud (VPC), segmentation, firewall rules)
  ↓
Host (Hardened OS, Endpoint Detection and Response (EDR), patching)
  ↓
Application (Auth, input validation, secure coding)
  ↓
Data (Encryption, masking, access controls)
```

## Quick Reference: Common Vulnerabilities

| Vuln | Symptom | Defense |
|------|---------|---------|
| SQL injection | DB error on quote in input | Parameterized queries |
| XSS | Script tag in user input renders | Output encoding, Content Security Policy (CSP) |
| Cross-Site Request Forgery (CSRF) | Cross-origin form submit succeeds | CSRF tokens, SameSite cookie |
| SSRF | Server fetches internal URL | URL allowlist, network egress rules |
| Insecure Direct Object Reference (IDOR) | Change ID in URL → other user's data | Authorization check per object |
| Open redirect | `?redirect=evil.com` works | Allowlist redirect URLs |
| Mass assignment | POST extra field → admin=true | Explicit field allowlist |
| Insecure deserialization | Object inputs → remote code execution (RCE) | Don't deserialize untrusted data |

## แม่แบบเอกสาร

### Threat Model (STRIDE)

```markdown
# Threat Model: <Feature/System Name>

| | |
|--|--|
| **Document Type** | Threat Model |
| **Framework** | STRIDE |
| **Status** | Draft |
| **Reviewer** | @security-team |

---

## Scope

**In scope:**
- Component A
- Data flow B

**Out of scope:**
- Component X (covered by separate model)

## Data Flow Diagram

Draw the DFD as a house-style figure with the `diagram-figures` skill (not raw Mermaid, no hard-coded fills). List the flows here too, so the figure can be checked against them:

| From | To | Channel | Crosses boundary |
|------|----|---------|------------------|
| User | Web Application Firewall (WAF) | HTTPS | Internet → demilitarized zone (DMZ) |
| WAF | Load balancer → API | HTTPS | DMZ → Internal |
| API | Database | Internal TLS | Internal → Data tier |
| API | External service | API key | Internal → outside |

> **Trust boundaries:** Internet → DMZ → Internal → Data tier

## Identified Threats

| # | Component | Threat (STRIDE) | Likelihood | Impact | Risk | Mitigation |
|:-:|-----------|-----------------|:----------:|:------:|:----:|------------|
| 1 | API | Injection (T) | Medium | High | High | Parameterized queries, input validation |
| 2 | Session | Hijacking (S) | Medium | High | High | HttpOnly, Secure, SameSite cookies |
| 3 | Auth | Bypass (E) | Low | High | Medium | Strong RBAC, audit logs |
| 4 | DB backup | Disclosure (I) | Low | High | Medium | Encryption at rest, access control |

## Required Controls

### Authentication
- [ ] MFA for all admin accounts
- [ ] Password policy: 15+ chars when the password is the only factor · 8+ when MFA is on · breached-password check (NIST SP 800-63B-4 §3.1.1.2, checked 22 Oct 2026 on pages.nist.gov, official source only → `(รอยืนยัน)` until a second source agrees)
- [ ] Session timeout: 30 min idle, 8 hr absolute
- [ ] Account lockout: 5 failed attempts → 15 min lock

### Authorization
- [ ] RBAC with principle of least privilege
- [ ] Authorization check on every endpoint
- [ ] Multi-tenant isolation verified

### Cryptography
- [ ] TLS 1.3 minimum, no weak ciphers
- [ ] AES-256 for data at rest
- [ ] Bcrypt/Argon2 for passwords
- [ ] No homebrew crypto

### Logging & Monitoring
- [ ] All auth events logged
- [ ] All privileged actions logged
- [ ] Logs shipped to immutable store
- [ ] Alerts on suspicious patterns

## Residual Risks

After mitigations, what risk remains?

| Risk | Acceptable? | Owner |
|------|:-----------:|:------|
| ... | Yes | @cto |

## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| Security Lead | @sec | Pending | — |
| Architect | @architect | Pending | — |
| Compliance | @compliance | Pending | — |
```

### Security Code Review

```markdown
# Security Review: <PR / Component>

**Reviewer:** @sec-name
**Scope:** ...
**Risk Level:** Medium

---

## What Looks Good

- Input validation present
- Parameterized queries used
- Secrets via env vars, not code

## Critical Findings (Must Fix Before Merge)

### SEC-001: Stored XSS via dangerouslySetInnerHTML in profile.tsx:45

**Issue:**
\`\`\`typescript
// User-controlled bio injected as raw HTML, bypassing React's escaping
return <div dangerouslySetInnerHTML={{ __html: user.bio }} />; // bio = "<img src=x onerror=...>" fires
\`\`\`

**Severity:** Critical
**OWASP:** A05:2025 (Injection)

**Fix:**
\`\`\`typescript
// Sanitise with DOMPurify before injecting (or render as text: <div>{user.bio}</div>)
import DOMPurify from 'dompurify';
return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(user.bio) }} />;
\`\`\`

## High Findings (Fix in This Sprint)

### SEC-002: Insufficient rate limiting on /auth/login

**Issue:** No rate limit on failed login attempts → brute force risk
**Fix:** Add `express-rate-limit` with 5 attempts / 15 min per IP

## Suggestions (Nice-to-Have)

- nit: Consider adding CSRF token to forms
- nit: Update Helmet config to include HTTP Strict Transport Security (HSTS) preload

## Compliance Notes

- 🇪🇺 General Data Protection Regulation (GDPR): personally identifiable information (PII) handling looks compliant
- Payment Card Industry Data Security Standard (PCI DSS): No card data touched
```

### Compliance Audit Brief

```markdown
# Compliance Audit: Personal Data Protection Act (PDPA) Readiness

| | |
|--|--|
| **Scope** | Full application |
| **Regulation** | Thai PDPA 2019 |
| **Status** | In Progress |

## Readiness by Pillar

| Pillar | Status | Evidence | Gaps |
|--------|:------:|----------|------|
| Lawful basis | Compliant | Consent UI live | — |
| Data inventory | Partial | Partial map | Backups not mapped |
| Subject rights | Compliant | Export/delete API | — |
| Breach response | Partial | Plan drafted | Not yet tested |
| Cross-border | Gap | — | No Standard Contractual Clauses (SCC) with US vendor |

## Critical Gaps

| ID | Gap | Severity | Deadline |
|:--:|-----|:--------:|----------|
| G-001 | No data processing agreement (DPA) with vendor X | High | 30 days |
| G-002 | Backup retention undefined | Medium | 60 days |
```
