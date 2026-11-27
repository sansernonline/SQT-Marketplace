<!-- merged from skill `legal-document-systems` on 2026-11-27 · description was: Use when software handles legal documents or Thai ETA -->
# legal-document-systems

Legal document software — reading contracts · automatic document generation · electronic signatures

**Open only the files that match the job.** Do not read them all, because each file is the full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| extracting structure and clauses from contracts with NLP and ML. Patterns for clause identification, party extraction, date parsing, value extraction, and LLM-assisted analysis | [`contract-parsing-patterns.md`](contract-parsing-patterns.md) |
| building document automation — template languages, variable systems, conditional logic, intake forms, multi-format output (DOCX, PDF, HTML) | [`document-automation-patterns.md`](document-automation-patterns.md) |
| implementing electronic signatures with legal compliance — eIDAS, ESIGN, UETA, country-specific frameworks, signature levels (SES/AES/QES), authentication requirements | [`e-signature-compliance.md`](e-signature-compliance.md) |

## คู่มือบทบาท

An agent called in for this area opens its own role file before starting.

| บทบาท | อ่าน | agent |
|---|---|---|
| building legal technology — contract management systems, document automation, e-signature platforms, legal workflow tools, or legal AI applications | [`agent-legaltech-engineer.md`](agent-legaltech-engineer.md) | `legaltech-engineer` |
| building contract analysis tools — clause extraction, risk identification, comparison, NLP for legal text, AI-assisted review | [`agent-contract-analyzer.md`](agent-contract-analyzer.md) | `legaltech-engineer` |
| building document automation systems — template engines, conditional logic, multi-language documents, version control for templates, integration with intake forms | [`agent-document-automation-engineer.md`](agent-document-automation-engineer.md) | `legaltech-engineer` |
| building e-signature platforms, integrating DocuSign/Adobe Acrobat Sign, designing signing workflows, ensuring legal validity (eIDAS, ESIGN, local laws), or handling authentication for signing | [`agent-e-signature-specialist.md`](agent-e-signature-specialist.md) | `legaltech-engineer` |
| legal-tech regulatory compliance — privacy regimes, records retention and legal hold, e-discovery, bar rules, data residency, cross-border transfers, compliance audit | [`agent-legal-compliance-officer.md`](agent-legal-compliance-officer.md) | `legal-compliance-officer` |

## agent ของสายนี้

`legaltech-engineer` · `legal-compliance-officer`

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:domain-systems <contract-analysis-design | esignature-audit> <details>`

Two modes. Read the first word of **the user's request**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `contract-analysis-design` | Design contract analysis system using legaltech-engineer agent. |
| `esignature-audit` | Audit e-signature system compliance using legaltech-engineer agent. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](legal-document-systems/design-modes.md)
