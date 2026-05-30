---
description: Guide live incident response using devops-engineer agent. Structures detection→triage→mitigation→resolution and prepares postmortem.
argument-hint: <incident description, e.g., "users can't login since 14:00 UTC">
---

Use the `devops-engineer` agent to coordinate incident response for: **$ARGUMENTS**

> 🚨 **Critical:** Speed matters. Don't over-document during active incident. Focus on stopping the bleed.

The DevOps engineer should follow this structured response:

## 🔥 Phase 1: Detection & Triage (first 5 min)

1. **Confirm the incident:**
   - Is it real? (multiple signals or just one)
   - What's the user-facing symptom?
   - When did it start (exact UTC time)?
   - How widespread (all users, region, segment)?

2. **Assess severity:**
   - 🔴 **SEV1** — total outage, data loss, security breach → page everyone
   - 🟠 **SEV2** — major feature down → page on-call team
   - 🟡 **SEV3** — degraded service → notify team in business hours
   - 🟢 **SEV4** — minor issue → tracked but not paged

3. **Assemble response team:**
   - Incident Commander (IC)
   - Subject Matter Experts (SMEs)
   - Communications lead (for SEV1/2)
   - Scribe (timestamps everything)

4. **Open incident channel** (e.g., `#inc-YYYYMMDD-shortname`)

5. **Update status page** (for user-facing SEV1/2)

## 🔍 Phase 2: Investigation (next 15-30 min)

1. **Gather evidence:**
   - Logs (application, infra)
   - Metrics dashboards (errors, latency, traffic)
   - Recent changes (deploys in last 24h)
   - External factors (AWS status, vendor incidents)

2. **Form hypotheses** — avoid tunnel vision:
   - What recently changed?
   - What pattern do logs show?
   - Could it be capacity? Network? Bug? Config?

3. **Communicate updates** every 15-30 min even if "still investigating"

## 🩹 Phase 3: Mitigation (stop the bleeding)

> 💡 Mitigation ≠ fix. Goal is reduce user impact NOW.

Common mitigations:
- **Rollback** recent deploy
- **Failover** to backup region/instance
- **Scale up** capacity
- **Disable** broken feature (feature flag)
- **Rate limit** abusive traffic
- **Block** at WAF/firewall

Document what worked AND what didn't.

## ✅ Phase 4: Resolution

1. **Implement permanent fix:**
   - Identify root cause (5 Whys)
   - Code fix or config change
   - Test in staging first if possible

2. **Verify stability:**
   - Monitor for at least 30 min
   - Watch key metrics (errors, latency, throughput)
   - Confirm no related issues

3. **All-clear announcement:**
   - Update status page
   - Notify customer support
   - Post in incident channel

## 📝 Phase 5: Post-Incident (within 48h)

1. **Schedule postmortem** within 48 hours
2. **Use `postmortem-template` skill** for blameless analysis
3. **Track action items** in real tickets
4. **Share learnings** broader than just affected team

## Output Required

Throughout the incident, produce a running **incident log** using `polished-document-style` skill with:
- Severity + timeline table
- Affected services + user count
- Investigation steps + findings
- Mitigations attempted (worked + didn't)
- Resolution actions
- Action items for postmortem

Use the `postmortem-template` skill afterwards for the full analysis.

## Hand-off Suggestions

- Permanent code fix → `developer`
- Architecture issue → `solution-architect`
- Security implication → `security-engineer`
- Customer communication → `technical-writer` + `product-manager`
- Process improvement → `project-manager`
