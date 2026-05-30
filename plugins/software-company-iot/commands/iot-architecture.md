---
description: Design IoT system architecture using iot-engineer + edge-architect agents. Covers connectivity, data flow, edge tier.
argument-hint: <use case, e.g., "smart factory" or "fleet vehicle telemetry">
---

Use the `iot-engineer` and `edge-architect` agents to design IoT architecture for: **$ARGUMENTS**

Workflow:

1. **iot-engineer Initial Discovery:**
   - Device count and connectivity
   - Power constraints
   - Data volume + latency tolerance
   - Regulatory + security requirements

2. **Choose connectivity** (apply `mqtt-protocol-patterns` skill):
   - Protocol (MQTT, CoAP, HTTP)
   - QoS strategy per message type
   - Topic structure
   - Security (mTLS, ACLs)

3. **edge-architect Compute Placement:**
   - Apply `edge-computing-architecture` skill
   - Device vs edge vs cloud per task
   - Edge runtime selection
   - Offline operation strategy

4. **Design data flow:**
   - Telemetry pipeline
   - Command + control path
   - Edge → cloud aggregation
   - Cloud → edge sync

5. **Plan fleet management** (apply `device-fleet-management` skill):
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
   - Firmware → `firmware-engineer`
   - MQTT deep design → `mqtt-specialist`
   - Backend services → `solution-architect` (from software-company)
   - Production deployment → `devops-engineer` (from software-company)
