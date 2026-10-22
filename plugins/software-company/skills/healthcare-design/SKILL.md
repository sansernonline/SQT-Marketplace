---
name: healthcare-design
description: Use when the user asks to design a FHIR API or run a HIPAA or PDPA readiness audit. Modes — fhir-design · hipaa-audit.
argument-hint: <fhir-design | hipaa-audit> <details>
disable-model-invocation: true
---

> **ภาษา:** ถ้อยคำทุกบรรทัดในเอกสารที่ได้ เขียนตาม `human-writing` — command นี้บอกขั้นตอน ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `fhir-design` | Design a Fast Healthcare Interoperability Resources (FHIR) API for healthcare interoperability using healthcare-engineer agent. Selects resources, defines profiles, designs SMART on FHIR flow. |
| `hipaa-audit` | Run a Health Insurance Portability and Accountability Act (HIPAA) readiness audit using hipaa-officer agent. Covers all 3 safeguard categories and produces remediation roadmap. For a Thai project it also covers the Personal Data Protection Act (PDPA). |

---

## Mode: `fhir-design`

Use the `healthcare-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** FHIR version (R4 default), target electronic health records (EHRs), use cases (read, write, bulk), implementation guides (US Core, IPS, local), SMART on FHIR or system-to-system, privacy needs
2. **Apply `healthcare-systems` skill**, open `references/fhir-implementation.md`
3. **Select resources and profiles:** map each clinical concept, keep extensions few
4. **Design the API:** CapabilityStatement, search parameters, operations, transaction Bundles, Bulk Data if needed
5. **Design auth:** SMART on FHIR scopes, Proof Key for Code Exchange (PKCE), token lifecycle
6. **Plan validation:** profiles, required fields, code bindings (LOINC, SNOMED, RxNorm)
7. **Design AuditEvent** and map legacy data (field mapping, code translation, identifiers)
8. **Plan testing:** Inferno or Touchstone for the guide, EHR sandbox
9. **Produce polished FHIR design** using `polished-document-style`: resource model, endpoints, SMART sequence diagram, sample resources, migration plan
10. **Hand-off:** implementation → `developer`, HIPAA review → `hipaa-officer`, deployment → `devops-engineer`

---

## Mode: `hipaa-audit`

Use the `hipaa-officer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** protected health information (PHI) inventory and locations, workforce with PHI access, current business associate agreements (BAAs), past incidents, last risk assessment date, **and where the patients are** (US, Thailand, both)
2. **Apply `healthcare-systems` skill**, open `references/hipaa-compliance.md`. Project in Thailand / Thai patients → also apply `pdpa-compliance`: health data is sensitive data, needs explicit consent, and a breach goes to the regulator within 72 hours
3. **Assess Administrative Safeguards** with its checklist
4. **Assess Physical Safeguards** with its checklist
5. **Assess Technical Safeguards** with its checklist
6. **Check BAAs** against every vendor that touches PHI
7. **Risk-rank gaps:** Critical, High, Medium, Low
8. **Plan remediation:** 30/60/90 days with owners
9. **Produce polished HIPAA audit report** using `polished-document-style`: summary, PHI data flow diagram, scorecard per safeguard, findings, sign-off
10. **Hand-off:** technical fixes → `developer`, `devops-engineer`, `security-engineer` · breach or live incident → `security-analyst` · clinical workflow changes → `healthcare-engineer`
