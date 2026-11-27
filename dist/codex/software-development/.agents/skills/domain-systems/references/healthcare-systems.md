<!-- merged from skill `healthcare-systems` on 2026-11-27 · description was: Use when software handles patient or clinical data -->
# healthcare-systems

Software that touches patient data — clinical workflow · FHIR · HIPAA · clinical data analytics

**Open only the files that match the job.** Do not read them all, because each file is the full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| designing clinical software workflows — order entry, medication management, clinical decision support, care plans, patient handoffs. Bridges clinical processes and software design | [`clinical-workflows.md`](clinical-workflows.md) |
| implementing FHIR R4/R5 — choosing resources, designing profiles, building FHIR APIs, integrating with EHRs via SMART on FHIR, validating resources, or mapping legacy data to FHIR. Concrete patterns and gotchas | [`fhir-implementation.md`](fhir-implementation.md) |
| project in Thailand / Thai patients — health data is sensitive personal data under the Personal Data Protection Act (PDPA) of Thailand: explicit consent, breach notice to the regulator within 72 hours. HIPAA is US-only; use it only when the project also serves the US | skill `pdpa-compliance` |
| implementing HIPAA Security Rule safeguards (administrative, physical, technical), conducting risk assessments, preparing for OCR audits, designing BAA workflows, or evaluating cloud services for PHI workloads. Provides concrete engineering patterns | [`hipaa-compliance.md`](hipaa-compliance.md) |

## คู่มือบทบาท

An agent called to work in this area opens its own role file before starting · read the table of contents first, then read only the sections the job uses

| บทบาท | อ่าน | agent |
|---|---|---|
| building healthcare applications — EHR/EMR integration, clinical workflows, telemedicine, patient portals, or any health-tech product handling PHI. Specializes in healthcare interoperability and clinical safety requirements | [`agent-healthcare-engineer.md`](agent-healthcare-engineer.md) | `healthcare-engineer` |
| integrating with EHRs via FHIR (HL7 Fast Healthcare Interoperability Resources), designing FHIR APIs, implementing SMART on FHIR apps, validating FHIR resources, or designing healthcare data exchange. Specializes in FHIR R4/R5 standards | [`agent-fhir-specialist.md`](agent-fhir-specialist.md) | `healthcare-engineer` |
| analysing clinical data — cohorts, readmission and mortality rates, HEDIS/CMS measures, risk adjustment, small-cell suppression, clinical analysis reports | [`clinical-analytics.md`](clinical-analytics.md) | `clinical-data-analyst` |
| HIPAA compliance work — rule map, patient rights, BAAs, breach response workflow, de-identification gotchas, risk analysis report | [`agent-hipaa-officer.md`](agent-hipaa-officer.md) | `hipaa-officer` |

## อ้างอิงภายนอก

- anthropics/healthcare `fhir-developer` (github.com/anthropics/healthcare) — real validation code and value sets · ToS: link only, do not copy

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:domain-systems <fhir-design | hipaa-audit> <details>`

Two modes. Read the first word of **the user's request**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `fhir-design` | Design a Fast Healthcare Interoperability Resources (FHIR) API for healthcare interoperability using healthcare-engineer agent. Selects resources, defines profiles, designs SMART on FHIR flow. |
| `hipaa-audit` | Run a Health Insurance Portability and Accountability Act (HIPAA) readiness audit using hipaa-officer agent. Covers all 3 safeguard categories and produces remediation roadmap. For a Thai project it also covers the Personal Data Protection Act (PDPA). |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](healthcare-systems/design-modes.md)
