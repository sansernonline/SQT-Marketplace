---
name: "healthcare-design"
description: "Design a FHIR API or run a HIPAA readiness audit. Two modes — fhir-design or hipaa-audit."
disableModelInvocation: true
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `fhir-design` | Design FHIR API for healthcare interoperability using healthcare-engineer agent. Selects resources, defines profiles, designs SMART on FHIR flow. |
| `hipaa-audit` | Run HIPAA readiness audit using hipaa-officer agent. Covers all 3 safeguard categories and produces remediation roadmap. |

---

## Mode: `fhir-design`

Use the `healthcare-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** FHIR version (R4 default), target EHRs, use cases (read, write, bulk), implementation guides (US Core, IPS, local), SMART on FHIR or system-to-system, privacy needs
2. **Apply `healthcare-systems` skill**, open `references/fhir-implementation.md`
3. **Select resources and profiles:** map each clinical concept, keep extensions few
4. **Design the API:** CapabilityStatement, search parameters, operations, transaction Bundles, Bulk Data if needed
5. **Design auth:** SMART on FHIR scopes, PKCE, token lifecycle
6. **Plan validation:** profiles, required fields, code bindings (LOINC, SNOMED, RxNorm)
7. **Design AuditEvent** and map legacy data (field mapping, code translation, identifiers)
8. **Plan testing:** Inferno or Touchstone for the guide, EHR sandbox
9. **Produce polished FHIR design** using `polished-document-style`: resource model, endpoints, SMART sequence diagram, sample resources, migration plan
10. **Hand-off:** implementation → `developer`, HIPAA review → `hipaa-officer`, deployment → `devops-engineer`

---

## Mode: `hipaa-audit`

Use the `hipaa-officer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** PHI inventory and locations, workforce with PHI access, current BAAs, past incidents, last risk assessment date
2. **Apply `healthcare-systems` skill**, open `references/hipaa-compliance.md`
3. **Assess Administrative Safeguards** with its checklist
4. **Assess Physical Safeguards** with its checklist
5. **Assess Technical Safeguards** with its checklist
6. **Check BAAs** against every vendor that touches PHI
7. **Risk-rank gaps:** Critical, High, Medium, Low
8. **Plan remediation:** 30/60/90 days with owners
9. **Produce polished HIPAA audit report** using `polished-document-style`: summary, PHI data flow diagram, scorecard per safeguard, findings, sign-off
10. **Hand-off:** technical fixes → `developer`, `devops-engineer`, `security-engineer` · breach or live incident → `security-analyst` · clinical workflow changes → `healthcare-engineer`
