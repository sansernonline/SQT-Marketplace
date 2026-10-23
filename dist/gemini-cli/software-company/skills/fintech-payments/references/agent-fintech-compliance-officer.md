# Fintech Compliance Officer — regulatory map, outputs, workflows

คู่มือบทบาทของ agent `fintech-compliance-officer` · รายละเอียด PCI-DSS (SAQ, ระดับ, control) อยู่ที่ [`pci-dss-compliance.md`](pci-dss-compliance.md) · KYC/AML อยู่ที่ [`kyc-aml-patterns.md`](kyc-aml-patterns.md)

**สารบัญ:**

- [Regulatory Framework Map](#regulatory-framework-map)
- [Standard Outputs](#standard-outputs)
- [Common Compliance Workflows](#common-compliance-workflows)

## Regulatory Framework Map

### 🌏 By Region

**Thailand:**
- 🏦 **BoT (ธปท.)** — banks, payment systems, e-money
- 💼 **SEC** — securities, digital assets
- 🛡️ **AMLO** — anti-money laundering, KYC requirements
- 📋 **PDPA** — personal data protection
- 💳 **Card scheme rules in Thailand** — (ยังไม่ได้ตรวจ ว่ามีกรอบเฉพาะชื่อนี้) ตรวจกับธนาคารแห่งประเทศไทยและ card scheme ก่อนอ้าง

**Singapore:**
- 🏦 **MAS** — banking, payments (PSA), capital markets
- 📋 **PDPA SG** — data protection
- 🛡️ **AMLA, TSOFA** — AML/CTF

**EU:**
- 🏦 **EBA, ECB** — banking
- 💳 **PSD2** — payment services, Strong Customer Authentication
- 💰 **MiCA** — crypto-assets
- 📋 **GDPR** — data protection
- 🛡️ **AMLD6** — AML

**USA:**
- 🏦 **OCC, Fed, FDIC, CFPB** — banking
- 💳 **State money transmitter** licenses
- 📋 **CCPA, state privacy laws**
- 🛡️ **BSA/FinCEN** — AML
- 🛍️ **PCI-DSS** — card data (industry-mandated)

### 🛡️ By Domain

**Payments (PCI-DSS):**
| Level | Annual transactions | Validation |
|-------|--------------------:|------------|
| 1 | > 6M | On-site assessment by QSA |
| 2 | 1-6M | Self-assessment + scans |
| 3 | 20k-1M | Self-assessment + scans |
| 4 | < 20k | Self-assessment |

**SAQ types:** see `pci-dss-compliance.md` § SAQ Selection (aim for SAQ A)

**AML/KYC:**
- Customer identification (CIP)
- Beneficial ownership
- Sanctions screening (OFAC, UN, EU)
- Politically Exposed Persons (PEP)
- Transaction monitoring
- Suspicious Activity Reports (SAR)

## Standard Outputs

### Regulatory Applicability Matrix

```markdown
## Applicable Regulations

| Regulation | Applies? | Reason | Owner | Status |
|-----------|:--------:|--------|:------|:------:|
| PCI-DSS v4 | ✓ | We process card data | @sec-lead | In progress |
| PDPA Thailand | ✓ | TH customers | @dpo | Compliant |
| AML (Thailand) | ✓ | Money transmission | @compliance | In progress |
| PSD2 | ✗ | No EU operations yet | — | N/A |
| GDPR | Indirect | EU users via web | @dpo | Compliant |
```

### Control Mapping

```markdown
## Control: Encrypted Data at Rest

**Regulation:** PCI-DSS v4 Req 3.5
**Scope:** Cardholder data (PAN if stored)

**Implementation:**
- AES-256 encryption for DB
- KMS-managed keys
- Annual key rotation

**Evidence:**
- KMS configuration screenshot
- DB encryption verification command output
- Key rotation log

**Owner:** @devops-lead
**Last verified:** YYYY-MM-DD
**Next review:** YYYY-MM-DD
```

### Audit Readiness Report

```markdown
# Audit Readiness: PCI-DSS v4

| | |
|--|--|
| **Audit type** | RoC (Report on Compliance) |
| **QSA** | (auditor name) |
| **Scope** | Cardholder Data Environment (CDE) |
| **Target date** | YYYY-MM-DD |
| **Status** | In Progress |

## Readiness by Requirement

| Req | Description | Status | Evidence | Gap |
|:---:|-------------|:------:|----------|-----|
| 1 | Network security | Compliant | Firewall config, network diagram | — |
| 2 | Secure config | Compliant | Hardening checklist | — |
| 3 | Protect stored CHD | Partial | Encryption proof | Need key rotation log |
| 4 | Transmit encryption | Compliant | TLS config | — |
| 5 | Malware protection | Partial | EDR deployment | Coverage 95%, need 100% |
| 6 | Secure development | Compliant | SAST in CI, code review | — |
| 7 | Restrict access | Compliant | RBAC matrix | — |
| 8 | Identify users | Compliant | MFA enforced | — |
| 9 | Physical access | Compliant | Cloud provider attestation | — |
| 10 | Logging | Compliant | SIEM, retention 1yr | — |
| 11 | Test security | Partial | Last pen test 7mo ago | Schedule new pen test |
| 12 | Policy | Compliant | InfoSec policy current | — |

## Action Items

| ID | Action | Owner | Due | Priority |
|:--:|--------|:------|:---:|:--------:|
| 1 | Document key rotation log | @dba | MM/DD | High |
| 2 | Roll out EDR to remaining 5% | @sec | MM/DD | Medium |
| 3 | Schedule pen test | @sec | MM/DD | Medium |
```

## Common Compliance Workflows

### Workflow 1: New product → Regulatory review
```
1. PM defines product (PRD)
   ↓
2. Compliance reviews against framework map
   ↓
3. Identify applicable regs
   ↓
4. Design required controls
   ↓
5. Engineering implements
   ↓
6. Compliance verifies
   ↓
7. Document for audit trail
```

### Workflow 2: Incident → Regulatory notification
```
1. Incident detected
   ↓
2. Assess: is data breach / personal data / financial loss?
   ↓
3. Within 24h: Compliance notified
   ↓
4. Within 72h: Regulator notified (PDPA → PDPC, see `pdpa-compliance` · GDPR)
   ↓
5. Customer notification (when required)
   ↓
6. Post-incident review
```
