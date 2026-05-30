---
description: Run a PCI-DSS readiness audit using compliance-officer agent. Identifies scope, gaps, and produces remediation plan.
argument-hint: <scope description, e.g., "checkout flow" or "full CDE">
---

Use the `compliance-officer` agent to perform a PCI-DSS audit on: **$ARGUMENTS**

The compliance officer should:

1. **Initial Discovery** — gather:
   - Current PCI level (1-4 based on volume)
   - Existing SAQ type
   - Recent QSA findings
   - Data flow diagrams
   - In-scope systems

2. **Apply `pci-dss-compliance` skill** for the 12 requirements:
   - Network security (Req 1)
   - Secure configurations (Req 2)
   - Protect stored CHD (Req 3)
   - Encryption in transit (Req 4)
   - Anti-malware (Req 5)
   - Secure development (Req 6)
   - Access restriction (Req 7)
   - User identification (Req 8)
   - Physical access (Req 9)
   - Logging & monitoring (Req 10)
   - Security testing (Req 11)
   - Information security policy (Req 12)

3. **Scope analysis**:
   - Map ALL systems that touch CHD
   - Identify SAQ candidates (aim for A)
   - Recommend scope reduction opportunities

4. **Gap assessment** per requirement:
   - 🟢 Compliant (evidence available)
   - 🟡 Partial (in progress)
   - 🔴 Gap (not implemented)
   - ⚪ Not applicable (justified)

5. **Risk-rank gaps**:
   - Severity (impact on assessment outcome)
   - Effort to remediate
   - Dependencies

6. **Produce polished PCI audit report** using `polished-document-style` skill:
   - Executive summary
   - Scope diagram (Mermaid)
   - Readiness scorecard
   - Detailed findings per requirement
   - Remediation plan (30/60/90 day)
   - Sign-off section

7. **Hand-off suggestions**:
   - Code/infra fixes → `developer`, `devops-engineer`
   - Architecture changes → `solution-architect`
   - Security implementation → `security-engineer`
   - Payment scope review → `payment-integration` agent
