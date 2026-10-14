---
name: "threat-model"
description: "Use when the user asks for a STRIDE threat model of a feature or system (user command). Runs security-engineer."
---

Use the `security-engineer` agent to perform STRIDE threat modeling on: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

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

3. **Apply STRIDE per component** (all 6 categories for every component and data flow)

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

**อ่านเพิ่มเมื่อต้องใช้:** [`references/security-templates.md`](references/security-templates.md) — แม่แบบเอกสารความปลอดภัย
