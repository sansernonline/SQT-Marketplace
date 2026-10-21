# BRD template — stakeholder version (Mode B)

แม่แบบ Business Requirements Document (BRD) ฉบับส่งผู้เกี่ยวข้อง ของ agent `business-analyst` — ย้ายมาจากตัว agent (2026-10-14) · จัดรูปแบบตาม `polished-document-style`

**สารบัญ:**

- [Standard Output: Polished BRD (Mode B)](#standard-output-polished-brd-mode-b) — template sections: Executive Summary · Business Objective · Stakeholders · Scope · Business Requirements · Business Rules · Assumptions & Constraints · Open Questions · Process Flow · Sign-off

## Standard Output: Polished BRD (Mode B)

```markdown
# BRD: <Feature Name>

| | |
|--|--|
| **Document Type** | Business Requirements Document |
| **Version** | 1.0 |
| **Status** | Draft |
| **Date** | YYYY-MM-DD |
| **Author** | @ba-name |
| **Reviewer(s)** | @stakeholder |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Objective](#2-business-objective)
3. [Stakeholders](#3-stakeholders)
4. [Scope](#4-scope)
5. [Business Requirements](#5-business-requirements)
6. [Business Rules](#6-business-rules)
7. [Assumptions & Constraints](#7-assumptions--constraints)
8. [Open Questions](#8-open-questions)

---

## 1. Executive Summary

> **For non-technical readers** — 1 paragraph capturing what, why, and impact.

## 2. Business Objective

| Aspect | Details |
|--------|---------|
| **Problem** | ... |
| **Goal** | ... |
| **Success Metrics** | • Metric 1: target<br>• Metric 2: target |
| **Business Impact** | Revenue / Efficiency / UX |

## 3. Stakeholders

| Role | Name | Interest | Influence | RACI |
|------|------|:--------:|:---------:|:----:|
| Product Owner | @alice | High | High | A |
| End User | @customer | High | Medium | C |
| Engineering | @bob | Medium | High | R |
| Legal | @charlie | Low | Medium | I |

> **RACI:** R=Responsible, A=Accountable, C=Consulted, I=Informed

## 4. Scope

### In Scope
- ...

### Out of Scope
- ...

> **Note:** Out-of-scope items may be addressed in future phases (see Section 7).

## 5. Business Requirements

| ID | Requirement | Priority | Acceptance |
|:---|:------------|:--------:|:-----------|
| BR-001 | System shall... | Must | Verified by ... |
| BR-002 | System should... | Should | Verified by ... |
| BR-003 | System could... | Could | Verified by ... |

> **MoSCoW prioritization:** Must / Should / Could / Won't

## 6. Business Rules

| ID | Rule | Source |
|:---|:-----|:-------|
| BRL-001 | Tax rate = 7% on Thai customers | Thai VAT law |
| BRL-002 | Max discount = 30% per order | Pricing policy |

## 7. Assumptions & Constraints

### Assumptions
- ...

### Constraints
| Type | Constraint |
|------|------------|
| Budget | $XX,XXX |
| Timeline | Launch by YYYY-MM-DD |
| Compliance | PDPA, PCI-DSS |
| Technical | Must integrate with existing CRM |

## 8. Open Questions

| ID | Question | Owner | Due |
|:---|:---------|:------|:---:|
| Q-001 | Which payment gateway? | @alice | MM/DD |
| Q-002 | Refund policy? | @legal | MM/DD |

## 9. Process Flow (if applicable)

\`\`\`mermaid
flowchart LR
    A[Customer requests] --> B{Validate}
    B -->|Valid| C[Process]
    B -->|Invalid| D[Reject]
    C --> E[Notify]
\`\`\`

## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| Product Owner | @alice | Pending | — |
| Tech Lead | @bob | Pending | — |
| Compliance | @charlie | Pending | — |
```
