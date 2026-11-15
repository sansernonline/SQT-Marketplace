---
name: insurance-systems
description: Use when building insurance policy, quote or claims software
argument-hint: <claims-flow-design | underwriting-model-design> <details>
---

# insurance-systems

Insurance software — policies · claims · underwriting · actuarial maths · insurance law

**Open only the files that match the job.** Do not read them all, because each file is the full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| implementing claims processing — FNOL flows, triage logic, reserves management, fraud detection, settlement calculation, subrogation, repair network integration | [`references/claims-workflow-patterns.md`](references/claims-workflow-patterns.md) |
| building underwriting models — risk scoring, rating algorithms, GLM/GBM pricing, eligibility logic, fairness testing, regulatory documentation | [`references/underwriting-models.md`](references/underwriting-models.md) |
| navigating insurance regulatory requirements — US state filings (SERFF), Solvency II (EU), market conduct, NAIC model laws, country-specific (TH OIC, etc.), data privacy in insurance context | [`references/insurance-compliance.md`](references/insurance-compliance.md) |

## คู่มือบทบาท

An agent called in for this area opens its own role file before starting · read the table of contents first, then read only the sections the job uses

| บทบาท | อ่าน | agent |
|---|---|---|
| building insurance products — policy management, quote engines, customer-facing apps, agent portals, embedded insurance APIs. Covers core insurance domain logic | [`references/agent-insurance-engineer.md`](references/agent-insurance-engineer.md) | `insurance-engineer` |
| building claims workflows — FNOL (First Notice of Loss), triage, fraud detection, settlement, claim reserves, integration with adjusters and repair networks | [`references/agent-claims-processing-specialist.md`](references/agent-claims-processing-specialist.md) | `insurance-engineer` |
| building actuarial models for insurance — loss modeling, pricing, reserves analysis, capital modeling, IBNR, regulatory reporting. Combines statistics + insurance domain | [`references/agent-actuarial-engineer.md`](references/agent-actuarial-engineer.md) | `insurance-analyst` |
| building underwriting systems — risk assessment, rating models, eligibility rules, data enrichment from external sources, automated decisioning, manual review queues | [`references/agent-underwriting-analyst.md`](references/agent-underwriting-analyst.md) | `insurance-analyst` |
| insurance regulatory compliance — US state filings, Solvency II, Thailand OIC, market conduct, insurance privacy, solvency and regulatory reporting | [`references/agent-insurance-compliance-officer.md`](references/agent-insurance-compliance-officer.md) | `insurance-compliance-officer` |

## agent ของสายนี้

`insurance-engineer` · `insurance-analyst` · `insurance-compliance-officer`

## ที่มา

รวมจาก plugin `software-development-insurtech` (เดิมชื่อ claims-workflow-patterns → `references/claims-workflow-patterns.md` · underwriting-models → `references/underwriting-models.md` · insurance-compliance → `references/insurance-compliance.md` ไม่ใช่ skill แยกแล้ว) เข้า `software-development` ใน v2.0.0 โดยเนื้อหาเดิมยังอยู่ครบใน `references/`

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:insurance-systems <claims-flow-design | underwriting-model-design> <details>`

> **Language:** write every line of wording in the resulting document per `human-writing`. This command gives the steps; human-writing gives the way to write so people understand.

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `claims-flow-design` | Design claims processing flow using insurance-engineer agent. |
| `underwriting-model-design` | Design an underwriting model using the insurance-analyst agent. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](references/design-modes.md)
