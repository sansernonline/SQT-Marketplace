# แม่แบบงานความปลอดภัย — threat model · security review · compliance brief

ย้ายมาจาก agent `security-engineer` · agent และ `/threat-model` เปิดไฟล์นี้เมื่อต้องเขียนเอกสารจริง · กรอกจากของจริง ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

- [กรอบที่ใช้](#กรอบที่ใช้) — OWASP Top 10:2025 · STRIDE · defense in depth
- [Quick Reference: Common Vulnerabilities](#quick-reference-common-vulnerabilities)
- [แม่แบบเอกสาร](#แม่แบบเอกสาร) — threat model · security code review · compliance audit brief

## กรอบที่ใช้

### OWASP Top 10:2025 (Web Application)
A01 Broken Access Control (รวม SSRF) · A02 Security Misconfiguration · A03 Software Supply Chain Failures · A04 Cryptographic Failures · A05 Injection · A06 Insecure Design · A07 Authentication Failures · A08 Software or Data Integrity Failures · A09 Security Logging and Alerting Failures · A10 Mishandling of Exceptional Conditions

สิ่งที่ต้องมี วิธีพิสูจน์ และรายงานรายข้อ → skill [`owasp-top10`](../../owasp-top10/SKILL.md)

### STRIDE Threat Categories

| Category | Threat | Example | Defense |
|----------|--------|---------|---------|
| **S**poofing | Identity theft | Phishing, session hijack | Strong auth, MFA |
| **T**ampering | Data modification | SQL injection, XSS | Input validation, integrity checks |
| **R**epudiation | Deny actions | No audit trail | Logging, non-repudiation |
| **I**nformation Disclosure | Data leak | SQL dump, log exposure | Encryption, least privilege |
| **D**enial of Service | Service down | DDoS, resource exhaustion | Rate limiting, autoscaling |
| **E**levation of Privilege | Privilege escalation | Broken access control | RBAC, regular reviews |

### Defense in Depth Layers

```
Internet
  ↓
Edge (CDN, WAF, DDoS protection)
  ↓
Perimeter (Load balancer, TLS termination)
  ↓
Network (VPC, segmentation, firewall rules)
  ↓
Host (Hardened OS, EDR, patching)
  ↓
Application (Auth, input validation, secure coding)
  ↓
Data (Encryption, masking, access controls)
```

## Quick Reference: Common Vulnerabilities

| Vuln | Symptom | Defense |
|------|---------|---------|
| SQL injection | DB error on quote in input | Parameterized queries |
| XSS | Script tag in user input renders | Output encoding, CSP |
| CSRF | Cross-origin form submit succeeds | CSRF tokens, SameSite cookie |
| SSRF | Server fetches internal URL | URL allowlist, network egress rules |
| IDOR | Change ID in URL → other user's data | Authorization check per object |
| Open redirect | `?redirect=evil.com` works | Allowlist redirect URLs |
| Mass assignment | POST extra field → admin=true | Explicit field allowlist |
| Insecure deserialization | Object inputs → RCE | Don't deserialize untrusted data |

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

\`\`\`mermaid
flowchart LR
    User([User]) -->|HTTPS| WAF[WAF]
    WAF --> LB[Load Balancer]
    LB --> API[API]
    API -->|Internal TLS| DB[(Database)]
    API -->|API key| Ext[External Service]

    classDef trust1 fill:#e1f5ff
    classDef trust2 fill:#fff4e1
    classDef trust3 fill:#ffe1e1

    class User trust1
    class WAF,LB,API trust2
    class DB,Ext trust3
\`\`\`

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
- [ ] Password policy: 12+ chars, breached-password check
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

### SEC-001: XSS in profile.tsx:45

**Issue:**
\`\`\`typescript
// User-controlled name rendered without escaping
return <div>{user.name}</div>; // if name = "<script>...", fires
\`\`\`

**Severity:** Critical
**OWASP:** A05:2025 (Injection)

**Fix:**
\`\`\`typescript
// React escapes by default — confirmed safe
return <div>{user.name}</div>; // already safe in JSX
// But for innerHTML cases, use sanitization library
\`\`\`

## High Findings (Fix in This Sprint)

### SEC-002: Insufficient rate limiting on /auth/login

**Issue:** No rate limit on failed login attempts → brute force risk
**Fix:** Add `express-rate-limit` with 5 attempts / 15 min per IP

## Suggestions (Nice-to-Have)

- nit: Consider adding CSRF token to forms
- nit: Update Helmet config to include HSTS preload

## Compliance Notes

- 🇪🇺 GDPR: PII handling looks compliant
- PCI: No card data touched
```

### Compliance Audit Brief

```markdown
# Compliance Audit: PDPA Readiness

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
| Cross-border | Gap | — | No SCC with US vendor |

## Critical Gaps

| ID | Gap | Severity | Deadline |
|:--:|-----|:--------:|----------|
| G-001 | No DPA with vendor X | High | 30 days |
| G-002 | Backup retention undefined | Medium | 60 days |
```
