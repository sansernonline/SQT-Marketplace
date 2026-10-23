---
name: "threat-model"
description: "Use when the user asks for a STRIDE threat model of a feature or system (user command). Runs security-engineer."
disableModelInvocation: true
---

Use the `security-engineer` agent to perform STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) threat modeling on: **$ARGUMENTS**

The security engineer should:

1. **Initial Discovery** — gather:
   - Data sensitivity (personally identifiable information (PII), protected health information (PHI), payment, secrets)
   - Architecture context (trust boundaries, components)
   - Regulatory scope (Personal Data Protection Act (PDPA), General Data Protection Regulation (GDPR), Payment Card Industry Data Security Standard (PCI DSS), etc.)
   - Existing security controls
   - **Incremental mode** — if `docs/threat-model*.md` or `qa/security/` already holds a model for this system, do not start over: diff the new feature against it, list only the components, flows and boundaries that are new or changed, carry forward unchanged threats with their status, and mark each threat `new` / `changed` / `unchanged` in the table
   - **Non-capabilities** — write down what the system must *not* be able to do even when fully compromised (e.g. "the web tier cannot read raw card numbers", "a tenant's token cannot list another tenant's rows"); each becomes a check in step 4 and a line in the residual-risk section (idea from github/awesome-copilot `threat-model-analyst`, MIT, rewritten)

2. **Create Data Flow Diagram (DFD)** as a house-style figure with the `diagram-figures` skill (not raw Mermaid):
   - Show all components
   - Mark trust boundaries explicitly
   - Identify entry points

3. **Apply STRIDE per interaction, not only per box** — for every data flow that crosses a trust boundary in the DFD, go through all 6 categories with the question "what can the sender or the channel do to the receiver here"; then do the stores and processes themselves. A flow with no threat in any category is a finding to double-check, not a pass. Each row names the interaction (`source → target`), the category and the attacker's capability

4. **Assess risks** using likelihood × impact:
   - Score each threat
   - Identify top risks (must mitigate)
   - Identify acceptable risks (with justification)

5. **Define required controls**:
   - Authentication (multi-factor authentication (MFA), password policy, session)
   - Authorization (role-based access control (RBAC), least privilege)
   - Cryptography (Transport Layer Security (TLS), at-rest, hashing)
   - Logging & monitoring (audit events)

6. **Produce polished threat model document** using `polished-document-style` skill, including:
   - Scope section
   - Data flow diagram (`diagram-figures` figure)
   - Threat table with severity
   - Required controls checklist
   - Residual risks with sign-off section

7. **Suggest hand-offs**:
   - Implementation needs → `developer`
   - Infrastructure hardening → `devops-engineer`
   - Compliance documentation → `technical-writer`

**อ่านเพิ่มเมื่อต้องใช้:** [`references/security-templates.md`](references/security-templates.md) — แม่แบบเอกสารความปลอดภัย
