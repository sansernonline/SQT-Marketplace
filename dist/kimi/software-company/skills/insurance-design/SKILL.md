---
name: "insurance-design"
description: "Use when the user asks to design an insurance claims flow or underwriting model. Modes — claims-flow-design · underwriting-model-design."
disableModelInvocation: true
---

> **ภาษา:** ถ้อยคำทุกบรรทัดในเอกสารที่ได้ เขียนตาม `human-writing` — command นี้บอกขั้นตอน ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `claims-flow-design` | Design claims processing flow using insurance-engineer agent. |
| `underwriting-model-design` | Design an underwriting model using the insurance-analyst agent. |

---

## Mode: `claims-flow-design`

Use `insurance-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** line of business (LOB), volume, complexity distribution, fraud rate
2. **Apply `insurance-systems` skill**
3. **Design first notice of loss (FNOL) flow:** progressive capture, multi-channel
4. **Design triage logic:** routing rules
5. **Plan fraud detection:** rules + machine learning (ML) + network analysis
6. **Reserves automation:** initial + adjustment
7. **Customer communication touchpoints**
8. **Repair network integration** if applicable
9. **Produce polished claims design** using `polished-document-style`
10. **Hand-off:** implementation → `developer`, compliance review → `insurance-compliance-officer`

---

## Mode: `underwriting-model-design`

Use the `insurance-analyst` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** LOB, data availability, regulatory regime, auto-bind target
2. **Apply `insurance-systems` skill**
3. **Choose approach:** generalized linear model (GLM, interpretable) vs gradient boosting machine (GBM, accurate) vs hybrid
4. **Define eligibility rules**
5. **Design risk scoring**
6. **Design rating algorithm**
7. **Plan fairness testing** (disparate impact)
8. **Plan model documentation** (regulatory)
9. **Plan continuous monitoring**
10. **Apply `insurance-systems` skill** for regulatory check
11. **Produce polished model design** using `polished-document-style`
12. **Hand-off:** ML implementation → `ai-engineer`, compliance filings → `insurance-compliance-officer`
