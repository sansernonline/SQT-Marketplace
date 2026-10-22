---
name: fintech-design
description: Design a financial transaction flow or run a Payment Card Industry Data Security Standard (PCI-DSS) readiness audit.
argument-hint: <transaction-flow-design | pci-audit> <details>
disable-model-invocation: true
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `transaction-flow-design` | Design end-to-end financial transaction flow using fintech-engineer agent. Covers idempotency, state machine, audit, reconciliation. |
| `pci-audit` | Run a PCI-DSS readiness audit using fintech-compliance-officer agent. Identifies scope, gaps, and produces remediation plan. |

---

## Mode: `transaction-flow-design`

Use the `fintech-engineer` agent to design transaction flow for: **$ARGUMENTS**

The fintech engineer should:

1. **Initial Discovery** — gather:
   - Money movement type (intra-account, peer-to-peer (P2P), business-to-consumer (B2C), card, etc.)
   - Currencies involved
   - Settlement timing requirements
   - Regulatory scope
   - Reversal/refund requirements
   - Integration partners (banks, gateways)

2. **Design state machine**:
   - All possible states (PENDING, PROCESSING, SUCCEEDED, FAILED, REVERSED, etc.)
   - Valid transitions
   - Terminal states
   - Reversal mechanism (NOT update, always append)

3. **Design idempotency**:
   - Idempotency key strategy
   - Dedup window
   - Replay safety

4. **Design double-entry ledger** entries:
   - Debit accounts
   - Credit accounts
   - Settlement timing

5. **Plan failure modes**:
   - Network failure mid-transaction
   - Partner timeout
   - Insufficient funds
   - Currency conversion errors
   - Each → defined behavior + recovery

6. **Design audit trail**:
   - What's logged
   - Where (immutable store)
   - Retention period
   - Access controls

7. **Design reconciliation**:
   - Daily reconciliation job
   - Discrepancy alerting
   - Manual reconciliation tooling

8. **Produce polished design document** using `polished-document-style` skill:
   - Sequence diagram (`diagram-figures`, house style)
   - State machine diagram (`diagram-figures`, house style)
   - API spec for endpoints
   - Database schema (ledger + audit tables)
   - Error handling table
   - Test scenarios (happy + failure + edge)

9. **Apply relevant skills**:
   - `fintech-payments` → `references/payment-gateway-integration.md` if an external gateway is involved
   - `fintech-payments` → `references/pci-dss-compliance.md` if cards are involved
   - `fintech-payments` → `references/kyc-aml-patterns.md` if customer-facing (identity checks)

10. **Hand-off suggestions**:
    - Implementation → `developer`
    - Security review → `security-engineer` (from software-company)
    - Compliance review → `fintech-compliance-officer`
    - Test design → `qa-tester` (from software-company)

---

## Mode: `pci-audit`

Use the `fintech-compliance-officer` agent to perform a PCI-DSS audit on: **$ARGUMENTS**

The compliance officer should:

1. **Initial Discovery** — gather:
   - Current PCI level (1-4 based on volume)
   - Existing Self-Assessment Questionnaire (SAQ) type
   - Recent Qualified Security Assessor (QSA) findings
   - Data flow diagrams
   - In-scope systems

2. **Go through the 12 PCI-DSS requirements** in `fintech-payments/references/pci-dss-compliance.md`

3. **Scope analysis**:
   - Map ALL systems that touch cardholder data (CHD)
   - Identify SAQ candidates (aim for A)
   - Recommend scope reduction opportunities

4. **Gap assessment** per requirement:
   - Compliant (evidence available)
   - Partial (in progress)
   - Gap (not implemented)
   - Not applicable (justified)

5. **Risk-rank gaps**:
   - Severity (impact on assessment outcome)
   - Effort to remediate
   - Dependencies

6. **Produce polished PCI audit report** using `polished-document-style` skill:
   - Executive summary
   - Scope diagram (`diagram-figures`, house style)
   - Readiness scorecard
   - Detailed findings per requirement
   - Remediation plan (30/60/90 day)
   - Sign-off section

7. **Hand-off suggestions**:
   - Code/infra fixes → `developer`, `devops-engineer`
   - Architecture changes → `solution-architect`
   - Security implementation → `security-engineer`
   - Payment scope review → `fintech-engineer` agent
