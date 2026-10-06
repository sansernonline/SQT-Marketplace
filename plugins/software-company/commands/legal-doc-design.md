---
name: legal-doc-design
description: Design a contract analysis system or audit e-signature compliance. Two modes — contract-analysis-design or esignature-audit.
argument-hint: <contract-analysis-design | esignature-audit> <details>
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `contract-analysis-design` | Design contract analysis system using legaltech-engineer agent. |
| `esignature-audit` | Audit e-signature system compliance using legaltech-engineer agent. |

---

## Mode: `contract-analysis-design`

Use `legaltech-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** contract types, volume, accuracy bar, privacy
2. **Apply `legal-document-systems` skill**
3. **Design extraction pipeline:** sections → clauses → entities
4. **Design risk detection** rules + ML + LLM hybrid
5. **Plan LLM integration** with privacy + verification
6. **Design review queue** for uncertain cases
7. **Plan accuracy measurement + improvement**
8. **Produce polished design doc** using `polished-document-style` (from software-company)
9. **Hand-off:** Implementation → `developer`, LLM details → `ai-engineer`

---

## Mode: `esignature-audit`

Use `legaltech-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** jurisdictions, use cases, current vendor + flow
2. **Apply `legal-document-systems` skill**
3. **Map jurisdictions** to required signature levels
4. **Audit authentication strength** per use case
5. **Audit document integrity** (hashing, version control)
6. **Audit audit trail** completeness
7. **Audit Certificate of Completion** quality
8. **Check carve-outs** (must-be-wet documents)
9. **Plan remediation** for gaps
10. **Produce polished compliance audit** using `polished-document-style` (from software-company)
11. **Hand-off:** Fixes → `legaltech-engineer`, compliance details → `legal-compliance-officer`
