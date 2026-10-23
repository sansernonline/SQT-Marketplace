---
name: "security-ops-design"
description: "Design a security operations center (SOC) or run a threat hunt with the security-analyst agent (soc-design or threat-hunt)."
disableModelInvocation: true
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
2. **Choose model:** in-house, managed security service provider (MSSP), hybrid
3. **Apply `security-operations` skill** for tier structure + processes
4. **Design coverage:** 24/7 model (follow-sun, on-call, MSSP-augmented)
5. **Detection coverage** via `security-operations` skill (MITRE ATT&CK coverage)
6. **Tool stack:** security information and event management (SIEM), endpoint detection and response (EDR), security orchestration, automation and response (SOAR), threat intelligence platform (TIP), ticketing
7. **Playbook library:** top scenarios
8. **Key performance indicators (KPIs) + service level agreements (SLAs):** mean time to detect (MTTD), mean time to acknowledge (MTTA), mean time to respond (MTTR), false positive (FP) rate
9. **Staffing + training plan**
10. **Produce polished SOC design** using `polished-document-style` (from superuser)
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
6. **Outcome:** escalate to incident response (IR) OR convert to detection OR document negative — any containment step during IR needs the user's approval per action (`security-operations` → `references/security-incident-response.md` Phase 3)
7. **Produce polished hunt report** using `polished-document-style` (from superuser)
8. **Hand-off:** to SOC for new detection rule, IR for findings
