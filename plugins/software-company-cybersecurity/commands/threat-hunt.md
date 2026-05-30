---
description: Conduct hypothesis-driven threat hunt using threat-hunter agent.
argument-hint: <hypothesis or threat to hunt>
---

Use the `threat-hunter` agent for: **$ARGUMENTS**

Workflow:

1. **Initial Discovery:** scope, data sources, time-box
2. **Form hypothesis** with reasoning + threat intel basis
3. **Apply `threat-detection-patterns` skill** for detection logic
4. **Execute hunt:** queries across SIEM, EDR, etc.
5. **Analyze results:** triage findings, eliminate FPs
6. **Outcome:** escalate to IR OR convert to detection OR document negative
7. **Produce polished hunt report** using `polished-document-style` (from software-company)
8. **Hand-off:** to SOC for new detection rule, IR for findings
