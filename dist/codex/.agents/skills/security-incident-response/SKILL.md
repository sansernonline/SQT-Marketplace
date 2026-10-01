---
name: security-incident-response
description: Use when leading security incident response — IR lifecycle (PICERL), containment strategies, evidence handling, communications, regulatory notifications. Distinct from operational incidents.
---

# Security Incident Response

## When to use this skill

- Leading active security incident
- Building IR plans + playbooks
- Tabletop exercises
- Post-incident reviews
- Building IR capability

## PICERL Lifecycle

```
Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned
```

## Phase 1: Preparation (Before Incident)

### Documentation
- IR plan (current, signed)
- Roles + responsibilities
- Communication tree
- Escalation paths
- Tool authorizations
- Legal contacts (internal + external)
- Cyber insurance details

### Tooling readiness
- IR retainer agreements
- Forensic tools licensed + tested
- Out-of-band comms (Signal, etc.)
- Evidence preservation infrastructure
- Backup integrity verified
- War room ready

### Skills + drills
- Tabletop exercises (quarterly)
- Functional exercises (semi-annual)
- Full simulation (annual)
- Role training

## Phase 2: Identification

### Triggers
- SOC alert escalation
- User report
- Threat intel match
- Anomaly detection
- External notification (LE, peer, customer)
- Discovered during other work

### Validation
```
Is this real?
- Multiple signals?
- Direct observation possible?
- Known false positive pattern?

Decision: declare incident OR continue investigation
```

### Initial declaration
```
- Severity assignment
- Incident Commander assigned
- War room opened
- Initial team called
- Initial scope documented
```

## Phase 3: Containment

### Two phases

**Short-term (minutes-hours):**
- Stop active damage
- Isolate, block, disable
- Quick wins

**Long-term (hours-days):**
- Comprehensive eradication preparation
- Sustainable containment
- Restoration enabled

### Containment options

| Option | Pros | Cons |
|--------|------|------|
| Network isolate host | Fast, targeted | May tip adversary |
| Disable account | Stops abuse | Tips off |
| Block IPs/domains | Cuts C2 | Adversary may switch |
| Rebuild from image | Clean | Slow |
| Air-gap segment | Strong | Operational impact |
| Shut down service | Total | Major outage |

### Decision factors
- Adversary awareness (already know we're watching?)
- Value at risk (data, lives, money)
- Business impact of containment
- Investigation needs

## Phase 4: Eradication

### Goals
- Remove adversary access
- Remove malware
- Remove persistence
- Close exploited vulnerabilities
- Rotate exposed credentials

### Comprehensive eradication checklist

**Per affected endpoint:**
- [ ] Forensic image taken
- [ ] Malware removed (or rebuild)
- [ ] Persistence mechanisms checked + removed
- [ ] Backdoor accounts removed
- [ ] Compromised credentials rotated
- [ ] Tokens/sessions invalidated
- [ ] Patches applied

**Per affected account:**
- [ ] Password reset
- [ ] MFA tokens reset
- [ ] Active sessions terminated
- [ ] OAuth grants revoked
- [ ] API keys rotated
- [ ] Recent activity reviewed
- [ ] Forwarding rules removed

**Per affected service:**
- [ ] Vulnerabilities patched
- [ ] Backdoors checked
- [ ] Audit logs reviewed
- [ ] Authorization re-checked

## Phase 5: Recovery

### Staged restoration

```
Stage 1: Test environment
- Restore from clean backup
- Validate functionality
- Test with controlled traffic
- Monitor 24-48 hours

Stage 2: Limited production
- Bring online with monitoring
- Limit to subset of users
- Watch for re-infection signs

Stage 3: Full production
- All users
- Enhanced monitoring 30+ days
- Daily reviews
```

### Verification
- No anomalous processes
- No persistence mechanisms
- Network traffic normal
- User behavior baseline
- No alerts indicating presence
- Independent verification (third party for major)

## Phase 6: Lessons Learned

### Within 7 days
Use `postmortem-template` skill for blameless analysis.

### Specific to security
- Detection latency (TTD)
- Containment speed (TTC)
- Eradication completeness verified
- Initial vector + how preventable
- Lateral movement enabled by what
- Data accessed/exfiltrated assessment
- Adversary attribution

### Improvements
```
Detection: new rules, better tuning
Prevention: patches, configuration, controls
Response: playbook updates, tool gaps
Process: communication, escalation, decision-making
```

## Evidence Handling

### Chain of custody
```
- Who collected what when
- Hash of original (and verification)
- Custody transfers logged
- Storage with access controls
- Original preserved, work on copies
```

### What to preserve
- Disk images (affected systems)
- Memory dumps
- Network captures
- Log exports (immutable storage)
- Endpoint snapshots
- Timeline documentation

### Tools
- FTK Imager, dd (disk imaging)
- Volatility (memory)
- Wireshark (network)
- Velociraptor (endpoint)

## Communications

### Internal stakeholders
```
Tier 0:  IR team
Tier 1:  Security leadership
Tier 2:  CISO, CTO
Tier 3:  CEO, board
Tier 4:  All employees (if appropriate)
```

### External
```
Customers: per BAAs, ToS, regulatory
Regulators: per requirement (GDPR 72h, etc.)
Law enforcement: per company policy
Insurers: per claim requirement
Public: per disclosure obligations
```

### Communications principles
- Single source of truth
- Pre-approved templates
- Legal review for external
- Avoid speculation
- Update on cadence, not emergence

## Regulatory Notification Timelines

| Regime | Timeline | Trigger |
|--------|----------|---------|
| GDPR | 72h | Personal data breach |
| HIPAA | 60d | PHI breach |
| State (US) | Varies | Per state law |
| PDPA Thailand | Without delay | Personal data breach |
| SEC (US public) | 4 business days | Material cyber incident |
| PCI-DSS | Immediate | Card data compromise |

## Output: Incident Report

Use `polished-document-style` + `postmortem-template` skills.

Include:
- Executive summary
- Detailed timeline
- Impact assessment
- Root cause
- Eradication verification
- Action items with owners
- Regulatory + customer comms log

## Things You Don't Do

- ❌ Pay ransom without leadership decision
- ❌ Public statements without legal/PR
- ❌ Negotiate with adversary unauthorized
- ❌ Tip off adversary unnecessarily
- ❌ Skip evidence preservation
- ❌ Declare resolved before verified clean

## Reference

- [NIST SP 800-61 Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)
- [SANS Incident Handler's Handbook](https://www.sans.org/white-papers/33901/)
- [ENISA Good Practice Guide for Incident Management](https://www.enisa.europa.eu/)
- [FIRST.org Best Practices](https://www.first.org/)
