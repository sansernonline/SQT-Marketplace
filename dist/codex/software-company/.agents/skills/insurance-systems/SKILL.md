---
name: insurance-systems
description: Use when building insurance software (policy and quote engines, claims from first notice of loss, fraud detection, underwriting, reserves, OIC filings).
---

# insurance-systems

ซอฟต์แวร์ประกันภัย — กรมธรรม์ · เคลม · underwriting · คณิตศาสตร์ประกันภัย · กฎหมายประกันภัย

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** ไม่ต้องอ่านทั้งหมด เพราะแต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้นอยู่แล้ว

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| implementing claims processing — FNOL flows, triage logic, reserves management, fraud detection, settlement calculation, subrogation, repair network integration | [`references/claims-workflow-patterns.md`](references/claims-workflow-patterns.md) |
| building underwriting models — risk scoring, rating algorithms, GLM/GBM pricing, eligibility logic, fairness testing, regulatory documentation | [`references/underwriting-models.md`](references/underwriting-models.md) |
| navigating insurance regulatory requirements — US state filings (SERFF), Solvency II (EU), market conduct, NAIC model laws, country-specific (TH OIC, etc.), data privacy in insurance context | [`references/insurance-compliance.md`](references/insurance-compliance.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ให้เปิดไฟล์บทบาทของตัวเองก่อนเริ่มงาน

| บทบาท | อ่าน | agent |
|---|---|---|
| building insurance products — policy management, quote engines, customer-facing apps, agent portals, embedded insurance APIs. Covers core insurance domain logic | [`references/agent-insurance-engineer.md`](references/agent-insurance-engineer.md) | `insurance-engineer` |
| building claims workflows — FNOL (First Notice of Loss), triage, fraud detection, settlement, claim reserves, integration with adjusters and repair networks | [`references/agent-claims-processing-specialist.md`](references/agent-claims-processing-specialist.md) | `insurance-engineer` |
| building actuarial models for insurance — loss modeling, pricing, reserves analysis, capital modeling, IBNR, regulatory reporting. Combines statistics + insurance domain | [`references/agent-actuarial-engineer.md`](references/agent-actuarial-engineer.md) | `insurance-analyst` |
| building underwriting systems — risk assessment, rating models, eligibility rules, data enrichment from external sources, automated decisioning, manual review queues | [`references/agent-underwriting-analyst.md`](references/agent-underwriting-analyst.md) | `insurance-analyst` |

## agent ของสายนี้

`insurance-engineer` · `insurance-analyst` · `insurance-compliance-officer`

## ที่มา

รวมจาก plugin `software-company-insurtech` (skill `claims-workflow-patterns` · `underwriting-models` · `insurance-compliance`) เข้า `software-company` ใน v2.0.0 โดยเนื้อหาเดิมยังอยู่ครบใน `references/`
