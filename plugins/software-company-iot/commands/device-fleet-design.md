---
description: Design device fleet management — provisioning, OTA, monitoring, config. Uses iot-engineer agent.
argument-hint: <fleet description, e.g., "10k smart thermostats">
---

Use the `iot-engineer` agent to design fleet management for: **$ARGUMENTS**

Workflow:

1. **Initial Discovery:**
   - Fleet size + growth projection
   - Device types
   - Deployment pattern (consumer / B2B / industrial)
   - Update frequency expected

2. **Apply `device-fleet-management` skill** for patterns

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
    - Firmware support → `firmware-engineer`
    - Backend implementation → `developer` (from software-company)
    - Production deployment → `devops-engineer` (from software-company)
