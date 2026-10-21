# Legal Compliance Officer — privacy, retention, e-discovery, residency, audit

คู่มือบทบาทของ agent `legal-compliance-officer` — ย้ายมาจากตัว agent (2026-10-14) · PDPA ฉบับเต็ม (ฐานทางกฎหมาย · ความยินยอม · สิทธิ · แจ้งเหตุรั่วใน 72 ชั่วโมง) ใช้ skill `pdpa-compliance` · ระยะเวลาเก็บเอกสารต่างกันตามประเทศ ตรวจกับกฎหมายจริงก่อนใช้ (รอยืนยัน)

**สารบัญ:**

- [Privacy Regulations Overview](#privacy-regulations-overview)
- [Records Retention](#records-retention)
- [E-Discovery Requirements](#e-discovery-requirements)
- [Bar Rules + Ethics](#bar-rules--ethics)
- [Data Residency Architecture](#data-residency-architecture)
- [Cross-Border Transfer Mechanisms (post-Schrems II)](#cross-border-transfer-mechanisms-post-schrems-ii)
- [Output: Compliance Audit](#output-compliance-audit)

## Privacy Regulations Overview

### GDPR (EU)
- Breach notification within 72 hours
- Right to access, deletion, portability
- Often requires a Data Protection Officer
- Data Protection Impact Assessment (DPIA) for high-risk processing
- Lawful basis required

### PDPA (Thailand)
- Similar to GDPR
- Consent and legitimate interest
- Breach: notify the PDPC within 72 h when the breach is likely to harm people — steps in `pdpa-compliance` § 8
- Data residency considerations

### CCPA/CPRA (California)
- Right to know and to delete
- Opt-out of sale
- "Sensitive PI" extra protections

### Other key regimes
- HIPAA (US, healthcare)
- LGPD (Brazil)
- PIPEDA (Canada)
- POPIA (South Africa)
- APPI (Japan)

## Records Retention

### Common periods (vary by jurisdiction)

| Record type | Typical retention |
|-------------|------------------:|
| Client matters (closed) | 7-10 years |
| Trust account records | 7+ years |
| Court filings | Permanent |
| Communications (privileged) | Per matter rules |
| Billing | 6-7 years (tax) |
| HR records | 4-7 years post-termination |
| AI/computer logs | 1-3 years |

### Legal Hold

```typescript
interface LegalHold {
  id: string;
  matter_id: string;
  custodians: string[];           // users whose data preserved
  data_scope: {
    types: string[];              // emails, contracts, etc.
    date_range?: { from: Date; to?: Date };
    keywords?: string[];
  };
  active: boolean;
  created_at: Date;
  released_at?: Date;
}

// When hold active, suspend destruction
async function canDestroy(document) {
  const holds = await db.legalHolds.findActive();

  for (const hold of holds) {
    if (matchesHold(document, hold)) {
      return false;  // preserve
    }
  }

  return true;
}
```

## E-Discovery Requirements

```
Production capability:
- Search across all data
- Export in standard formats (e.g., EDRM)
- Maintain chain of custody
- Privilege review workflow
- Redaction tools

Standards:
- EDRM Reference Model
- Federal Rules of Civil Procedure (US)
- Practice Direction 31B (UK)
```

## Bar Rules + Ethics

### Common rules to encode

```
Attorney advertising:
- Disclaimers required
- No outcome guarantees
- "Specialist" designation rules

Conflict checking:
- Run on every new matter
- Across multiple entities (firm + clients + adverse parties)
- Maintain conflict database

Trust account (IOLTA):
- Strict segregation
- Three-way reconciliation
- No commingling
- Special rules per state/country

Unauthorized practice:
- Some tools may risk UPL if not lawyer-supervised
- Disclaimers + tool limitations
```

## Data Residency Architecture

```
Tenant chooses region at sign-up
Data stays in region:
- Database in region
- Backups in region
- Compute in region
- Logs in region

Exceptions need legal basis:
- Audit logs to global SIEM (BAA/SCC)
- Telemetry (aggregated, anonymized)
- Customer support tickets (DPA)

Document EVERY cross-border flow
```

## Cross-Border Transfer Mechanisms (post-Schrems II)

### From EU to other countries
- Adequacy decision (some countries qualified)
- Standard Contractual Clauses (SCCs) + TIA
- Binding Corporate Rules (BCRs)
- Specific consent (limited)

### Other regimes
- Each has own framework
- Often similar to GDPR approach

## Output: Compliance Audit

Use polished doc style:

```markdown
# LegalTech Compliance Audit

| | |
|--|--|
| **Scope** | Full platform |
| **Jurisdictions** | US, EU, TH |
| **Date** | YYYY-MM-DD |

## Applicable Regulations
[Matrix]

## Data Flow Analysis
[Mermaid + cross-border highlights]

## Privacy Controls
[Per regulation]

## Records Retention Posture
[Per record type]

## E-Discovery Capability
[Assessment]

## Bar Rule Compliance
[Per jurisdiction]

## Findings + Risk
[Prioritized]

## Remediation Plan
[Timeline]
```
