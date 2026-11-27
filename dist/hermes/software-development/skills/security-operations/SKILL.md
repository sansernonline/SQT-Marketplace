---
name: security-operations
description: Use when running SOC, SIEM rules or threat hunting
argument-hint: <soc-design | threat-hunt> <details>
---

# security-operations

Operational security work — incident response · Security Operations Center (SOC, the team that watches for security events) · detection rules · threat hunting · security architecture (for code, use `security-gate`)

**Open only the files that match the job.** Do not read them all, because each file is the full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| leading security incident response — IR lifecycle (PICERL), containment strategies, evidence handling, communications, regulatory notifications. Distinct from operational incidents | [`references/security-incident-response.md`](references/security-incident-response.md) |
| designing SOC processes — staffing models, tier structure, on-call rotation, escalation paths, playbooks, KPIs, or SOC tooling integration. Covers Tier 1-3 operations | [`references/soc-operations.md`](references/soc-operations.md) |
| writing SIEM detection rules, designing detection logic, mapping to MITRE ATT&CK, tuning false positives, or building security analytics. Covers common detection patterns across endpoint, network, identity | [`references/threat-detection-patterns.md`](references/threat-detection-patterns.md) |

## คู่มือบทบาท

An agent called in for this area opens its own role file before starting.

| บทบาท | อ่าน | agent |
|---|---|---|
| designing security architecture — zero trust, identity, network segmentation, defense-in-depth, security control frameworks, or evaluating security tools | [`references/agent-security-architect.md`](references/agent-security-architect.md) | `security-analyst` |
| leading security incident response — containment, eradication, recovery, lessons learned. Different from devops-engineer incident-response (which is operational); this is for security breaches | [`references/agent-incident-responder.md`](references/agent-incident-responder.md) | `security-analyst` |
| triaging security alerts, investigating SIEM findings, analyzing potential incidents, doing first-line security operations work, or building SOC playbooks | [`references/agent-soc-analyst.md`](references/agent-soc-analyst.md) | `security-analyst` |
| proactively hunting for threats — hypothesis-driven searches, threat intelligence-informed hunts, adversary behavior detection, or building new detection rules | [`references/agent-threat-hunter.md`](references/agent-threat-hunter.md) | `security-analyst` |

## ไม่ใช้เมื่อ

- Write an incident runbook for on-call → `incidents-and-monitoring` · summarise an incident after it ends → `incidents-and-monitoring`

## agent ของสายนี้

`security-analyst`

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:security-operations <soc-design | threat-hunt> <details>`

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `soc-design` | Design SOC structure, processes, and tooling using the security-analyst agent. |
| `threat-hunt` | Conduct hypothesis-driven threat hunt using security-analyst agent. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](references/design-modes.md)
