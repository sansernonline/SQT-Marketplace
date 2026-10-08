---
name: "insurance-design"
description: "Design a claims processing flow or an underwriting model. Two modes — claims-flow-design or underwriting-model-design."
---

Two modes. Read the first word of **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `claims-flow-design` | Design claims processing flow using insurance-engineer agent. |
| `underwriting-model-design` | Design an underwriting model using the insurance-analyst agent. |

---

## Mode: `claims-flow-design`

Use `insurance-engineer` agent for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Workflow:
1. **Discovery:** LOB, volume, complexity distribution, fraud rate
2. **Apply `insurance-systems` skill**
3. **Design FNOL flow:** progressive capture, multi-channel
4. **Design triage logic:** routing rules
5. **Plan fraud detection:** rules + ML + network analysis
6. **Reserves automation:** initial + adjustment
7. **Customer communication touchpoints**
8. **Repair network integration** if applicable
9. **Produce polished claims design** using `polished-document-style` (from software-company)
10. **Hand-off:** implementation → `developer`, compliance review → `insurance-compliance-officer`

---

## Mode: `underwriting-model-design`

Use the `insurance-analyst` agent for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Workflow:
1. **Discovery:** LOB, data availability, regulatory regime, auto-bind target
2. **Apply `insurance-systems` skill**
3. **Choose approach:** GLM (interpretable) vs GBM (accurate) vs hybrid
4. **Define eligibility rules**
5. **Design risk scoring**
6. **Design rating algorithm**
7. **Plan fairness testing** (disparate impact)
8. **Plan model documentation** (regulatory)
9. **Plan continuous monitoring**
10. **Apply `insurance-systems` skill** for regulatory check
11. **Produce polished model design** using `polished-document-style` (from software-company)
12. **Hand-off:** ML implementation → `ai-engineer`, compliance filings → `insurance-compliance-officer`
