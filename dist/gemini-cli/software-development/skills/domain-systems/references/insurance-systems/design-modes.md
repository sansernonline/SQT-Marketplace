# โหมดออกแบบ

Use when the user asks to design an insurance claims flow or underwriting model. Modes — claims-flow-design · underwriting-model-design.

> **Language:** write every line of wording in the resulting document per `human-writing`. This command gives the steps; human-writing gives the way to write so people understand.

Two modes. Read the first word of **the user's request**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `claims-flow-design` | Design claims processing flow using insurance-engineer agent. |
| `underwriting-model-design` | Design an underwriting model using the insurance-analyst agent. |

---

## Mode: `claims-flow-design`

Use `insurance-engineer` agent for: **the user's request**

Workflow:
1. **Discovery:** line of business (LOB), volume, complexity distribution, fraud rate
2. **Apply `domain-systems` skill**
3. **Design first notice of loss (FNOL) flow:** progressive capture, multi-channel
4. **Design triage logic:** routing rules
5. **Plan fraud detection:** rules + machine learning (ML) + network analysis
6. **Reserves automation:** initial + adjustment
7. **Customer communication touchpoints**
8. **Repair network integration** if applicable
9. **Produce polished claims design** using `design-gate/polished-document-style`
10. **Hand-off:** implementation → `developer`, compliance review → `insurance-compliance-officer`

---

## Mode: `underwriting-model-design`

Use the `insurance-analyst` agent for: **the user's request**

Workflow:
1. **Discovery:** LOB, data availability, regulatory regime, auto-bind target
2. **Apply `domain-systems` skill**
3. **Choose approach:** generalized linear model (GLM, interpretable) vs gradient boosting machine (GBM, accurate) vs hybrid
4. **Define eligibility rules**
5. **Design risk scoring**
6. **Design rating algorithm**
7. **Plan fairness testing** (disparate impact)
8. **Plan model documentation** (regulatory)
9. **Plan continuous monitoring**
10. **Apply `domain-systems` skill** for regulatory check
11. **Produce polished model design** using `design-gate/polished-document-style`
12. **Hand-off:** ML implementation → `ai-engineer`, compliance filings → `insurance-compliance-officer`
