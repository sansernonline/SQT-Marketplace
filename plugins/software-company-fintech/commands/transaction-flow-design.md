---
description: Design end-to-end financial transaction flow using fintech-engineer agent. Covers idempotency, state machine, audit, reconciliation.
argument-hint: <transaction type, e.g., "P2P transfer" or "card payment with refund">
---

Use the `fintech-engineer` agent to design transaction flow for: **$ARGUMENTS**

The fintech engineer should:

1. **Initial Discovery** — gather:
   - Money movement type (intra-account, P2P, B2C, card, etc.)
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
   - Sequence diagram (Mermaid)
   - State machine diagram (Mermaid stateDiagram)
   - API spec for endpoints
   - Database schema (ledger + audit tables)
   - Error handling table
   - Test scenarios (happy + failure + edge)

9. **Apply relevant skills**:
   - `payment-gateway-integration` if external gateway involved
   - `pci-dss-compliance` if cards involved
   - `kyc-aml-patterns` if customer-facing

10. **Hand-off suggestions**:
    - Implementation → `developer`
    - Security review → `security-engineer` (from software-company)
    - Compliance review → `compliance-officer`
    - Test design → `qa-tester` (from software-company)
