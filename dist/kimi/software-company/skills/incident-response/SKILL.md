---
name: "incident-response"
description: "Guide a live incident with devops-engineer (breaches with security-analyst) — triage, mitigate with human approval, resolve, postmortem."
disableModelInvocation: true
---

> **ทางลัดเข้า SuperUser:** เปิด skill `superuser` ด้วย playbook `bug-fix` แล้วคัดขั้นตอนของ playbook ลง todo ก่อน ส่วนขั้นตอนด้านล่างคือรูปแบบงานและ output ของคำสั่งนี้ ให้ใช้ประกอบ playbook ไม่ใช่แทนที่

Use the `devops-engineer` agent to coordinate incident response for: **$ARGUMENTS**

> 🚨 **Critical:** Speed matters. During the incident keep only a plain timestamped log (one line per event). Polish it after the incident. Focus on stopping the bleed.
>
> 🔐 **Security breach or leaked personal data?** Hand the lead to the `security-analyst` agent and start `pdpa-compliance` section 8 now: the 72-hour clock to notify the PDPC (Personal Data Protection Committee) office starts when the breach is known.

The DevOps engineer should follow this structured response:

## 🔥 Phase 1: Detection & Triage (first 5 min)

1. **Confirm the incident:**
   - Is it real? (multiple signals or just one)
   - What's the user-facing symptom?
   - When did it start (exact UTC time)?
   - How widespread (all users, region, segment)?

2. **Assess severity** with the one severity table in `postmortem-template` (Severity Levels). SEV1 pages everyone; SEV4 is tracked, not paged.

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

3. **Communicate updates** every 15-30 min even if "still investigating" — one message per audience, the Communications lead sends them (แนวคิดจาก borghei incident-commander (MIT+Commons Clause → เขียนใหม่)):

   | Audience | When | Says (and nothing more) |
   |---|---|---|
   | Internal (incident channel · support) | every 15-30 min | what is broken · who is affected · what we are trying now · next update at HH:MM |
   | Exec (SEV1/2) | at declare · at mitigate · at all-clear | impact in business terms (users · orders · baht) · ETA or "unknown" · what we need from them (a decision, a vendor call) |
   | Customers (status page · in-app) | at declare · on change · at all-clear | symptom in their words · workaround if any · next update time — no root cause, no blame, no promises of a fix time |
   | Regulator / PDPC (personal-data breach only) | within 72 h of knowing, via `pdpa-compliance` section 8 | what data · how many people · what was done · contact person — drafted by `legal-compliance-officer`, not improvised in the channel |

## 🩹 Phase 3: Mitigation (stop the bleeding)

> 💡 Mitigation ≠ fix. The goal is to cut user impact NOW.

Common mitigations, lowest risk first (same order as `incident-runbook-template`):
- **Disable** broken feature (feature flag) · **Rate limit** abusive traffic
- **Scale up** capacity
- **Rollback** recent deploy
- **Block** at WAF (web application firewall) or firewall
- **Failover** to backup region/instance (last resort)

> ✋ **Production changes need a human.** The agent proposes the action, the command and the expected effect. A human on-call runs it or approves it before rollback, failover, WAF or firewall blocks, scaling or flag changes touch production (`principle-proceed-on-reversible-work`).

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
4. **Share learnings** beyond the affected team

## Output Required

Throughout the incident, keep a running **incident log** as plain timestamped lines. After the all-clear, format it with `polished-document-style`. It covers:
- Severity + timeline table
- Affected services + user count
- Investigation steps + findings
- Mitigations attempted (worked + didn't)
- Resolution actions
- Action items for postmortem

## Hand-off Suggestions

- Permanent code fix → `developer`
- Architecture issue → `solution-architect`
- Security breach (live) → `security-analyst` + `pdpa-compliance` section 8 · code vulnerability found → `security-engineer`
- Customer communication → `technical-writer` + `product-manager`
- Process improvement → `project-manager`
