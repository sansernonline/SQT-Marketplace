---
name: "iot-design"
description: "Design an IoT system or device fleet management (iot-architecture or device-fleet-design)."
disableModelInvocation: true
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `iot-architecture` | Design IoT system architecture using the iot-engineer agent. Covers connectivity, data flow, edge tier. |
| `device-fleet-design` | Design device fleet management — provisioning, OTA, monitoring, config. Uses iot-engineer agent. |

---

## Mode: `iot-architecture`

Use the `iot-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** device count and connectivity, power limits, data volume and latency tolerance, regulatory and security needs
2. **Apply `iot-systems` skill**, open `references/mqtt-protocol-patterns.md` and `references/edge-computing-architecture.md`
3. **Choose connectivity:** protocol, QoS per message type, topic structure
4. **Place compute:** device vs edge vs cloud per task, edge runtime, offline operation
5. **Design data flow:** telemetry, command and control, edge-to-cloud and cloud-to-edge sync
6. **Outline fleet management** (full design: mode `device-fleet-design`)
7. **Design security:** device identity, mTLS, per-device ACLs, certificate lifecycle
8. **Estimate cost and scaling**
9. **Produce polished IoT architecture** using `polished-document-style`: system and sequence diagrams, compute placement matrix, stack with reasons
10. **Hand-off:** firmware → `iot-engineer`, backend services → `solution-architect`, deployment → `devops-engineer`

---

## Mode: `device-fleet-design`

Use the `iot-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** fleet size and growth, device types, deployment pattern (consumer, B2B, industrial), expected update rate
2. **Apply `iot-systems` skill**, open `references/device-fleet-management.md`
3. **Design provisioning:** just-in-time, zero-touch or pre-registered, device claiming
4. **Design OTA (over-the-air) updates:** layers, A/B partitions, staged rollout, rollback triggers
5. **Design configuration:** desired state and reconciliation, group config, per-device rollback
6. **Design monitoring:** health tiers, key metrics and SLOs, alert thresholds
7. **Design diagnostics:** remote logs, live metrics, self-test, support escalation
8. **Plan decommissioning:** wipe, certificate revocation, audit trail
9. **Produce polished fleet design** using `polished-document-style`: lifecycle diagram, provisioning sequence, rollout phases, runbook
10. **Hand-off:** firmware → `iot-engineer`, backend → `developer`, deployment → `devops-engineer`
