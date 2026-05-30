---
description: Run HIPAA readiness audit using hipaa-officer agent. Covers all 3 safeguard categories and produces remediation roadmap.
argument-hint: <scope, e.g., "full enterprise" or "patient portal">
---

Use the `hipaa-officer` agent to perform HIPAA audit on: **$ARGUMENTS**

The HIPAA officer should:

1. **Initial Discovery** — gather:
   - PHI inventory (data + locations)
   - Workforce with PHI access
   - Current BAAs
   - Past incidents
   - Last risk assessment date

2. **Apply `hipaa-compliance` skill** for all 3 safeguard categories

3. **Assess Administrative Safeguards:**
   - Security management process
   - Workforce security + training
   - Information access management
   - Security incident procedures
   - Contingency plan
   - BAA inventory

4. **Assess Physical Safeguards:**
   - Facility access controls
   - Workstation use/security
   - Device + media controls

5. **Assess Technical Safeguards:**
   - Access controls (MFA, auto-logoff)
   - Audit controls (logging coverage)
   - Integrity (tamper detection)
   - Transmission security (TLS)
   - Encryption (rest + transit)

6. **Risk-rank gaps:**
   - 🔴 Critical (audit failure imminent)
   - 🟠 High (significant exposure)
   - 🟡 Medium (improvement needed)
   - 🟢 Low (nice-to-have)

7. **Produce polished HIPAA audit report** using `polished-document-style` skill (from software-company):
   - Executive summary
   - PHI data flow diagram (Mermaid)
   - Readiness scorecard per safeguard category
   - Detailed findings
   - BAA gap analysis
   - 30/60/90 day remediation plan
   - Sign-off section

8. **Hand-off suggestions:**
   - Technical safeguard implementation → `developer`, `devops-engineer`, `security-engineer` (from software-company)
   - Engineering training → `technical-writer` (from software-company)
   - Incident response → `devops-engineer` (from software-company)
   - Clinical workflow changes → `healthcare-engineer`
