---
name: iot-design
description: Design an IoT system architecture or device fleet management. Two modes — iot-architecture or device-fleet-design.
argument-hint: <iot-architecture | device-fleet-design> <details>
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `iot-architecture` | Design IoT system architecture using iot-engineer + iot-engineer agents. Covers connectivity, data flow, edge tier. |
| `device-fleet-design` | Design device fleet management — provisioning, OTA, monitoring, config. Uses iot-engineer agent. |

---

## Mode: `iot-architecture`

Use the `iot-engineer` and `iot-engineer` agents to design IoT architecture for: **$ARGUMENTS**

Workflow:

1. **iot-engineer Initial Discovery:**
   - Device count and connectivity
   - Power constraints
   - Data volume + latency tolerance
   - Regulatory + security requirements

2. **Choose connectivity** (apply `iot-systems` skill):
   - Protocol (MQTT, CoAP, HTTP)
   - QoS strategy per message type
   - Topic structure
   - Security (mTLS, ACLs)

3. **iot-engineer Compute Placement:**
   - Apply `iot-systems` skill
   - Device vs edge vs cloud per task
   - Edge runtime selection
   - Offline operation strategy

4. **Design data flow:**
   - Telemetry pipeline
   - Command + control path
   - Edge → cloud aggregation
   - Cloud → edge sync

5. **Plan fleet management** (apply `iot-systems` skill):
   - Provisioning approach
   - OTA strategy
   - Configuration management
   - Monitoring

6. **Security architecture:**
   - Device identity + auth
   - mTLS everywhere
   - Per-device ACLs
   - Cert lifecycle

7. **Produce polished IoT architecture document** using `polished-document-style` skill (from software-company):
   - System diagram (Mermaid)
   - Data flow sequences
   - Compute placement matrix
   - Tech stack rationale
   - Security architecture
   - Cost projection
   - Scaling plan

8. **Hand-off suggestions:**
   - Firmware → `iot-engineer`
   - MQTT deep design → `iot-engineer`
   - Backend services → `solution-architect` (from software-company)
   - Production deployment → `devops-engineer` (from software-company)

---

## Mode: `device-fleet-design`

Use the `iot-engineer` agent to design fleet management for: **$ARGUMENTS**

Workflow:

1. **Initial Discovery:**
   - Fleet size + growth projection
   - Device types
   - Deployment pattern (consumer / B2B / industrial)
   - Update frequency expected

2. **Apply `iot-systems` skill** for patterns

3. **Design provisioning:**
   - JITP, zero-touch, or pre-registered
   - Cert lifecycle
   - Device claiming flow

4. **Design OTA strategy:**
   - Update layers (firmware/app/config)
   - A/B partitioning
   - Staged rollout (1% → 10% → 100%)
   - Rollback triggers + procedure

5. **Design configuration management:**
   - Desired state + reconciliation
   - Group-based config (by region, tier, etc.)
   - Version control + rollback per device

6. **Design monitoring:**
   - Health tiers (healthy/degraded/unhealthy/offline)
   - Key metrics + SLOs
   - Anomaly detection patterns
   - Alert thresholds

7. **Design diagnostic tools:**
   - Remote log retrieval
   - Live metric inspection
   - Self-test triggers
   - Support escalation flow

8. **Plan decommissioning:**
   - Wipe procedure
   - Cert revocation
   - Audit trail

9. **Produce polished fleet management document** using `polished-document-style` skill (from software-company):
   - Lifecycle diagram (Mermaid)
   - Provisioning sequence
   - OTA rollout phases (Gantt)
   - Monitoring dashboard spec
   - Operations runbook
   - Compliance considerations

10. **Hand-off suggestions:**
    - Firmware support → `iot-engineer`
    - Backend implementation → `developer` (from software-company)
    - Production deployment → `devops-engineer` (from software-company)
