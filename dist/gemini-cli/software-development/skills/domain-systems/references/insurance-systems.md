<!-- merged from skill `insurance-systems` on 2026-11-27 · description was: Use when building insurance policy, quote or claims software -->
# insurance-systems

Insurance software — policies · claims · underwriting · actuarial maths · insurance law

**Open only the files that match the job.** Do not read them all, because each file is the full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| implementing claims processing — FNOL flows, triage logic, reserves management, fraud detection, settlement calculation, subrogation, repair network integration | [`claims-workflow-patterns.md`](claims-workflow-patterns.md) |
| building underwriting models — risk scoring, rating algorithms, GLM/GBM pricing, eligibility logic, fairness testing, regulatory documentation | [`underwriting-models.md`](underwriting-models.md) |
| navigating insurance regulatory requirements — US state filings (SERFF), Solvency II (EU), market conduct, NAIC model laws, country-specific (TH OIC, etc.), data privacy in insurance context | [`insurance-compliance.md`](insurance-compliance.md) |

## คู่มือบทบาท

An agent called in for this area opens its own role file before starting · read the table of contents first, then read only the sections the job uses

| บทบาท | อ่าน | agent |
|---|---|---|
| building insurance products — policy management, quote engines, customer-facing apps, agent portals, embedded insurance APIs. Covers core insurance domain logic | [`agent-insurance-engineer.md`](agent-insurance-engineer.md) | `insurance-engineer` |
| building claims workflows — FNOL (First Notice of Loss), triage, fraud detection, settlement, claim reserves, integration with adjusters and repair networks | [`agent-claims-processing-specialist.md`](agent-claims-processing-specialist.md) | `insurance-engineer` |
| building actuarial models for insurance — loss modeling, pricing, reserves analysis, capital modeling, IBNR, regulatory reporting. Combines statistics + insurance domain | [`agent-actuarial-engineer.md`](agent-actuarial-engineer.md) | `insurance-analyst` |
| building underwriting systems — risk assessment, rating models, eligibility rules, data enrichment from external sources, automated decisioning, manual review queues | [`agent-underwriting-analyst.md`](agent-underwriting-analyst.md) | `insurance-analyst` |
| insurance regulatory compliance — US state filings, Solvency II, Thailand OIC, market conduct, insurance privacy, solvency and regulatory reporting | [`agent-insurance-compliance-officer.md`](agent-insurance-compliance-officer.md) | `insurance-compliance-officer` |

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:domain-systems <claims-flow-design | underwriting-model-design> <details>`

Two modes. Read the first word of **the user's request**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `claims-flow-design` | Design claims processing flow using insurance-engineer agent. |
| `underwriting-model-design` | Design an underwriting model using the insurance-analyst agent. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](insurance-systems/design-modes.md)
