---
name: "contract-analysis-design"
description: "Design contract analysis system using contract-analyzer agent."
---

Use `contract-analyzer` agent for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Workflow:
1. **Discovery:** contract types, volume, accuracy bar, privacy
2. **Apply `contract-parsing-patterns` skill**
3. **Design extraction pipeline:** sections → clauses → entities
4. **Design risk detection** rules + ML + LLM hybrid
5. **Plan LLM integration** with privacy + verification
6. **Design review queue** for uncertain cases
7. **Plan accuracy measurement + improvement**
8. **Produce polished design doc** using `polished-document-style` (from software-company)
9. **Hand-off:** Implementation → `developer`, LLM details → `llm-architect` (from software-company-ai if installed)
