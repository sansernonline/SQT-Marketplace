---
name: healthcare-design
description: Design a FHIR API or run a HIPAA readiness audit. Two modes — fhir-design or hipaa-audit.
argument-hint: <fhir-design | hipaa-audit> <details>
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `fhir-design` | Design FHIR API for healthcare interoperability using healthcare-engineer agent. Selects resources, defines profiles, designs SMART on FHIR flow. |
| `hipaa-audit` | Run HIPAA readiness audit using hipaa-officer agent. Covers all 3 safeguard categories and produces remediation roadmap. |

---

## Mode: `fhir-design`

Use the `healthcare-engineer` agent to design FHIR implementation for: **$ARGUMENTS**

The FHIR specialist should:

1. **Initial Discovery** — gather:
   - FHIR version (R4 default)
   - Target EHRs (Epic, Cerner, Athena, etc.)
   - Use cases (read? write? bulk?)
   - Applicable IGs (US Core, IPS, country-specific)
   - SMART on FHIR vs system-to-system
   - Privacy/security requirements

2. **Apply `healthcare-systems` skill** for design patterns

3. **Select FHIR resources** for each clinical concept:
   - Map domain entities to FHIR resources
   - Identify needed extensions (minimize)
   - Choose profile (e.g., US Core Patient vs base Patient)

4. **Design API:**
   - Capability Statement
   - Search parameters supported
   - Operations (if any)
   - Bundle (transaction) endpoints
   - Bulk Data Export (if applicable)

5. **Design authentication:**
   - SMART on FHIR scopes
   - PKCE flow
   - Token lifecycle
   - System-to-system auth (if applicable)

6. **Plan validation:**
   - Profile validation strategy
   - Required vs optional fields
   - Code system bindings (LOINC, SNOMED, RxNorm)

7. **Design AuditEvent:**
   - What triggers an AuditEvent
   - Storage + retention
   - Search interface

8. **Map legacy data:**
   - Source field → FHIR field mappings
   - Code system translations (legacy → standard)
   - Identifier strategies

9. **Plan testing:**
   - Inferno test suite (if US Core)
   - Touchstone (if specific IG)
   - EHR sandbox testing

10. **Produce polished FHIR design document** using `polished-document-style` skill (from software-company):
    - Resource model with relationships
    - API endpoint reference
    - SMART on FHIR sequence diagram (Mermaid)
    - Profile constraints
    - Sample resources
    - Validation rules
    - Migration plan from legacy

11. **Hand-off suggestions:**
    - Implementation → `developer` (from software-company)
    - HIPAA compliance review → `hipaa-officer`
    - Clinical workflow validation → `healthcare-engineer`
    - Production deployment → `devops-engineer` (from software-company)

---

## Mode: `hipaa-audit`

Use the `hipaa-officer` agent to perform HIPAA audit on: **$ARGUMENTS**

The HIPAA officer should:

1. **Initial Discovery** — gather:
   - PHI inventory (data + locations)
   - Workforce with PHI access
   - Current BAAs
   - Past incidents
   - Last risk assessment date

2. **Apply `healthcare-systems` skill** for all 3 safeguard categories

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
