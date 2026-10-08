---
name: security-ops-design
description: Design a SOC or run a hypothesis-driven threat hunt using the security-analyst agent. Two modes — soc-design or threat-hunt.
argument-hint: <soc-design | threat-hunt> <details>
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `soc-design` | Design SOC structure, processes, and tooling using the security-analyst agent. |
| `threat-hunt` | Conduct hypothesis-driven threat hunt using security-analyst agent. |

---

## Mode: `soc-design`

Use the `security-analyst` agent to design a SOC for: **$ARGUMENTS**

Workflow:

1. **Initial Discovery:** org size, regulatory, threats, budget
2. **Choose model:** in-house, MSSP, hybrid
3. **Apply `security-operations` skill** for tier structure + processes
4. **Design coverage:** 24/7 model (follow-sun, on-call, MSSP-augmented)
5. **Detection coverage** via `security-operations` skill (MITRE coverage)
6. **Tool stack:** SIEM, EDR, SOAR, TIP, ticketing
7. **Playbook library:** top scenarios
8. **KPIs + SLAs:** MTTD, MTTA, MTTR, FP rate
9. **Staffing + training plan**
10. **Produce polished SOC design** using `polished-document-style` (from software-company)
11. **Hand-off:** implementation → `developer`, `devops-engineer` (from software-company)

---

## Mode: `threat-hunt`

Use the `security-analyst` agent for: **$ARGUMENTS**

Workflow:

1. **Initial Discovery:** scope, data sources, time-box
2. **Form hypothesis** with reasoning + threat intel basis
3. **Apply `security-operations` skill** for detection logic
4. **Execute hunt:** queries across SIEM, EDR, etc.
5. **Analyze results:** triage findings, eliminate FPs
6. **Outcome:** escalate to IR OR convert to detection OR document negative
7. **Produce polished hunt report** using `polished-document-style` (from software-company)
8. **Hand-off:** to SOC for new detection rule, IR for findings
