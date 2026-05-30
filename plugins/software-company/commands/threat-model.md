---
description: Run STRIDE threat modeling on a feature or system using security-engineer agent. Produces structured threat model with mitigations.
argument-hint: <feature or system to analyze>
---

Use the `security-engineer` agent to perform STRIDE threat modeling on: **$ARGUMENTS**

The security engineer should:

1. **Initial Discovery** — gather:
   - Data sensitivity (PII, PHI, payment, secrets)
   - Architecture context (trust boundaries, components)
   - Regulatory scope (PDPA, GDPR, PCI-DSS, etc.)
   - Existing security controls

2. **Create Data Flow Diagram** using Mermaid:
   - Show all components
   - Mark trust boundaries explicitly
   - Identify entry points

3. **Apply STRIDE per component:**
   - 🎭 Spoofing — identity threats
   - 🔄 Tampering — data modification threats
   - 🚫 Repudiation — non-repudiation threats
   - 📢 Information Disclosure — data leak threats
   - 🛑 Denial of Service — availability threats
   - ⬆️ Elevation of Privilege — auth bypass threats

4. **Assess risks** using likelihood × impact:
   - Score each threat
   - Identify top risks (must mitigate)
   - Identify acceptable risks (with justification)

5. **Define required controls**:
   - Authentication (MFA, password policy, session)
   - Authorization (RBAC, least privilege)
   - Cryptography (TLS, at-rest, hashing)
   - Logging & monitoring (audit events)

6. **Produce polished threat model document** using `polished-document-style` skill, including:
   - Scope section
   - Data flow diagram (Mermaid)
   - Threat table with severity
   - Required controls checklist
   - Residual risks with sign-off section

7. **Suggest hand-offs**:
   - Implementation needs → `developer`
   - Infrastructure hardening → `devops-engineer`
   - Compliance documentation → `technical-writer`
