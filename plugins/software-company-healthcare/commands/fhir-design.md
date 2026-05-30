---
description: Design FHIR API for healthcare interoperability using fhir-specialist agent. Selects resources, defines profiles, designs SMART on FHIR flow.
argument-hint: <feature, e.g., "patient labs API" or "EHR integration for X">
---

Use the `fhir-specialist` agent to design FHIR implementation for: **$ARGUMENTS**

The FHIR specialist should:

1. **Initial Discovery** — gather:
   - FHIR version (R4 default)
   - Target EHRs (Epic, Cerner, Athena, etc.)
   - Use cases (read? write? bulk?)
   - Applicable IGs (US Core, IPS, country-specific)
   - SMART on FHIR vs system-to-system
   - Privacy/security requirements

2. **Apply `fhir-implementation` skill** for design patterns

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
