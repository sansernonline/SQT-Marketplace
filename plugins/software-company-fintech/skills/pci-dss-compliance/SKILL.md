---
name: pci-dss-compliance
description: Use when handling card data, reducing PCI scope, selecting SAQ type, designing CDE (Cardholder Data Environment), preparing for PCI assessment, or implementing PCI-DSS v4 controls. Provides concrete guidance on the 12 requirements with implementation patterns.
---

# PCI-DSS v4 Compliance Patterns

## When to use this skill

- Starting a project that touches card data
- Choosing SAQ type for assessment
- Reducing PCI scope through tokenization
- Implementing CDE controls
- Preparing for QSA assessment
- Responding to scan findings

## Scope Reduction First (Most Important)

> 💡 **The cheapest control is the one you don't need.** Reduce scope first.

### What's "in scope"?

Anything that stores, processes, or transmits **CHD** (Cardholder Data):
- 💳 PAN (Primary Account Number)
- 📅 Expiration date
- 👤 Cardholder name
- 🔢 Service code

Or **SAD** (Sensitive Authentication Data) — NEVER store these:
- 🔐 Full magnetic stripe / chip data
- 🔢 CVV/CVC2/CID
- 🔢 PIN/PIN block

### Scope reduction techniques

```
Card data path: Browser → Server → Gateway

Anywhere card data goes, that system is in scope.

✅ Hosted fields:    Browser → Gateway (skip your server)
✅ Tokenization:     Server stores TOKEN, not PAN
✅ Network segmentation:  CDE isolated from rest of infra
```

## SAQ Selection (Critical Decision)

| SAQ | Use when | Controls | Effort |
|:---:|----------|:--------:|:------:|
| **A** ⭐ | Fully outsourced (Stripe Elements, hosted page) | 24 | 🟢 Low |
| **A-EP** | E-commerce, hosted with some your server interaction | 191 | 🟡 Med |
| **B** | Imprint machines only | 41 | 🟡 Med |
| **B-IP** | Stand-alone IP terminals | 79 | 🟡 Med |
| **C** | Payment app + isolated network | 162 | 🔴 High |
| **D** | Everything else (full CDE) | 329 | 🔴 Very High |

> 🎯 **Aim for SAQ A.** Difference between SAQ A and D = 305 controls. Architect to enable SAQ A.

## The 12 Requirements (Cheat Sheet)

### 1. Network security controls
- Firewall + segmentation
- DMZ for inbound
- Default deny

### 2. Apply secure configurations
- No vendor defaults
- Hardened baselines
- Documented config

### 3. Protect stored account data
- Encryption (AES-256 minimum)
- Key management (KMS, HSM)
- Truncation/masking when displaying

### 4. Protect data in transit
- TLS 1.2+ (1.3 preferred)
- Strong ciphers only
- Validated certificates

### 5. Protect against malware
- EDR/AV deployed
- Logged + monitored
- Coverage 100%

### 6. Develop secure software
- SAST in CI
- Vulnerability management
- Patch management

### 7. Restrict access by need-to-know
- RBAC
- Least privilege
- Documented justifications

### 8. Authenticate users
- Unique IDs
- MFA for admin + remote
- Strong password policy

### 9. Restrict physical access
- Cloud provider attestation
- Workstation controls
- Media handling

### 10. Log + monitor everything
- Centralized logs
- 12-month retention (3 months readily available)
- Daily review of critical events

### 11. Test security regularly
- Quarterly vulnerability scans (ASV)
- Annual pen test (internal + external)
- Quarterly internal scans
- Authenticated scanning

### 12. Information security policy
- InfoSec policy approved annually
- Risk assessment documented
- Incident response plan
- Training for all employees

## Common Anti-patterns

### ❌ Storing CVV
**Never.** Period. Not even encrypted. PCI-DSS forbids it.

### ❌ Card data in logs
```typescript
// 💥 BAD — logs may contain card number
log.info(`Processing payment: ${JSON.stringify(req.body)}`);

// ✅ GOOD — mask sensitive fields
log.info(`Processing payment`, { last4: req.body.card?.last4 });
```

### ❌ Card data in URL
```
❌ /process-payment?pan=4111111111111111  ← in proxy logs forever
✅ POST /process-payment (body, TLS, masked logs)
```

### ❌ Custom encryption
```typescript
// 💥 NEVER
function "encrypt"(pan: string): string {
  return Buffer.from(pan).toString('base64'); // not encryption!
}

// ✅ Use proven libraries
import { createCipheriv } from 'crypto';
// AES-256-GCM with KMS-managed key
```

### ❌ Local key storage
Keys in `.env` file or codebase = audit failure.
→ Use KMS (AWS, Azure, GCP) or HSM.

## Tokenization Pattern

```typescript
// Use gateway's tokenization
// Card NEVER touches your server

// Browser side (Stripe.js example):
const { token } = await stripe.createToken(cardElement);
// `token.id` = 'tok_xxx', safe to send

// Server side:
const charge = await stripe.charges.create({
  amount: 1000,
  currency: 'thb',
  source: token.id,  // ← token, not PAN
});

// Store in your DB:
await db.payments.create({
  paymentMethodToken: charge.payment_method,  // e.g., 'pm_xxx'
  last4: charge.payment_method_details.card.last4,  // ok to store
  // NEVER: full PAN, CVV
});
```

## Network Segmentation Pattern

```
Internet
   │
   ▼
[WAF]
   │
   ▼
[Load Balancer]
   │
   ├──► [Public app servers]  ← NOT in CDE if hosted fields
   │
   └──► [CDE network]         ← isolated, restricted
            │
            ├── [App server with card token only]
            ├── [Token vault]
            └── [Audit log destination]
```

**Rules:**
- CDE has its own VPC/subnet
- Firewall denies all by default, allows specific ports
- Documented rationale for every allowed flow
- Quarterly review of rules

## Logging Requirements

| Event type | Log what |
|------------|----------|
| Access to CHD | Who, when, what, from where |
| Admin actions | All privileged commands |
| Auth events | Success + failures |
| Config changes | Before + after |
| Logging failures | Yes, log when logging fails |

**Retention:** 12 months total, 3 months readily available

## Quarterly Scan Checklist

- [ ] ASV scan from approved vendor
- [ ] Internal vulnerability scan
- [ ] Penetration test (annual + post-significant-change)
- [ ] Wireless network scan
- [ ] Remediate all High + Critical
- [ ] Document all findings + remediation
- [ ] Re-scan to confirm closure

## Pre-Assessment Checklist

Before QSA arrives:

- [ ] Scope documented (data flow diagrams)
- [ ] Network diagrams current
- [ ] Asset inventory current
- [ ] All policies signed, dated
- [ ] Training records for last 12 months
- [ ] Risk assessment current
- [ ] Vulnerability scans (last quarter passing)
- [ ] Pen test report (last 12 months)
- [ ] Incident response plan tested
- [ ] Vendor management documentation
- [ ] Evidence portal organized by requirement

## Anti-patterns Specific to PCI

- ❌ **Believing SAQ-A is automatic** — still need controls + attestation
- ❌ **Mixing CHD with other data** — increases scope
- ❌ **Allowing developer access to prod** — even read-only includes PCI data
- ❌ **Skipping rotation** — keys, passwords, certificates
- ❌ **One-time compliance** — it's continuous
- ❌ **Treating QSA as adversary** — they're trying to help

## Reference

- [PCI-DSS v4.0 Standard](https://www.pcisecuritystandards.org/document_library/?category=pcidss)
- [SAQ Selection Tool](https://www.pcisecuritystandards.org/)
- [Tokenization Best Practices](https://www.pcisecuritystandards.org/document_library/?category=guidance)
