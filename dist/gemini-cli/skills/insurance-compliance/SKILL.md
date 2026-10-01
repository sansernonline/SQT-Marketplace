---
name: insurance-compliance
description: Use when navigating insurance regulatory requirements — US state filings (SERFF), Solvency II (EU), market conduct, NAIC model laws, country-specific (TH OIC, etc.), data privacy in insurance context.
---

# Insurance Regulatory Compliance

## When to use this skill

- Pre-launch product compliance review
- State filing preparation
- Market conduct examination prep
- Adverse action compliance
- Privacy compliance in insurance

## Regulatory Landscape Overview

```
US (state-by-state):
  50 state insurance commissioners
  NAIC coordination (non-binding)
  SERFF for filings

EU:
  Solvency II framework
  EIOPA coordination
  Member state implementation

UK (post-Brexit):
  PRA (prudential) + FCA (conduct)
  Generally aligned with EU but diverging

Thailand:
  OIC (Office of Insurance Commission)
  Insurance Acts

Singapore:
  MAS (Monetary Authority of Singapore)

Japan:
  FSA (Financial Services Agency)

Australia:
  APRA + ASIC
```

## US: State Filings via SERFF

### Rate filings
```
Product:
- New rates for new product
- Rate revisions for existing
- Form filings (policy wording)

Each state has own:
- Filing requirements (templates, supporting docs)
- Review timeline (30-180 days)
- Approval type (prior approval, file & use)
- Specific rules

Process:
1. Prepare filing (legal + actuarial)
2. Submit via SERFF
3. Respond to state objections
4. Approval (or rejection)
5. Effective date
```

### Common state objections
```
- Inadequate actuarial support
- Rate inadequacy (insolvency risk)
- Excessive rates (unfair to consumers)
- Discrimination (protected classes)
- Form clarity
- Conflicts with statutes
```

## US: Market Conduct

### Sales Practices
```
Suitability:
- Annuities (NAIC model)
- Long-term care (NAIC model)
- State-specific extensions

Producer requirements:
- Licensed in state for line of business
- Continuing education
- Anti-rebating rules

Disclosures:
- Replacement notices (life)
- Free look periods
- Senior protections (60+, varies)
```

### Claims Practices

```
Unfair Claims Settlement Practices Act (UCSPA):
- Acknowledge within X days
- Investigate promptly
- Reasonable settlement
- Don't compel litigation for legit claims
- Reasonable explanation of denial
- (specifics vary by state)

Bad faith laws (state-specific):
- Extra-contractual damages
- Punitive damages possible
```

### Pattern: Compliance by Design

```typescript
// Build state-specific rules into systems

interface StateRules {
  state: string;
  acknowledgment_days: number;     // varies
  investigation_days: number;
  settlement_days: number;
  free_look_days_life?: number;
  rate_change_cap_pct?: number;
  required_disclosures: Disclosure[];
}

// Use in claims workflow
async function ackClaim(claim) {
  const rules = await stateRules.get(claim.state);
  const dueDate = addBusinessDays(claim.received_at, rules.acknowledgment_days);

  if (Date.now() > dueDate) {
    await alert('MISSED_STATUTORY_DEADLINE', claim);
  }

  await sendAcknowledgment(claim);
}
```

## EU: Solvency II

### Pillar 1: Quantitative
```
SCR (Solvency Capital Requirement):
- 99.5% confidence over 1 year
- Modular approach: market, credit, life, non-life, health, operational
- Combined via correlation matrix

MCR (Minimum Capital Requirement):
- Lower bound (85% confidence)
- Below = supervisor intervention

Required disclosures:
- SCR coverage ratio
- MCR coverage ratio
- Own funds composition
```

### Pillar 2: Qualitative
```
Required:
- Governance system
- Risk management function
- Compliance function
- Internal audit
- Actuarial function

ORSA (Own Risk and Solvency Assessment):
- Annual + ad-hoc
- Forward-looking
- Strategic context
```

### Pillar 3: Disclosure
```
SFCR (Solvency and Financial Condition Report):
- Annual public report
- Standardized format

QRTs (Quantitative Reporting Templates):
- Quarterly + annual
- Detailed templates
- Submitted to regulator
```

## US: Risk-Based Capital (RBC)

```
Total RBC = sqrt(C0² + C1² + C2² + C3² + C4² + C5²)

Categories:
C0: Asset risk - Affiliate (subsidiaries)
C1: Asset risk - Investment
C2: Insurance risk (premium + reserves)
C3: Interest rate + market risk
C4: Operational risk
C5: Other / catastrophe

Levels:
- 200%: Company Action (alert)
- 150%: Regulatory Action
- 100%: Authorized Control
- 70%: Mandatory Control (taken over)

Target: 300%+ in practice
```

## Thailand OIC

```
Key regulations:
- Insurance Acts (Life + Non-Life)
- Ministerial Regulations
- OIC Notifications

Capital requirements:
- RBC framework (Thai version)
- Minimum paid-up capital
- Solvency margin

Product approval:
- Pre-approval required
- Form + rate filings to OIC

Reporting:
- Quarterly RBC
- Annual statements
- Catastrophe exposure reports
```

## Data Privacy in Insurance

### US Specifics

**GLBA (Gramm-Leach-Bliley Act):**
```
- Initial privacy notice
- Annual privacy notice
- Opt-out for sharing
- Information security program (Safeguards Rule)
```

**NAIC Insurance Data Security Model Law:**
```
~30 states adopted
Requirements:
- Written information security program
- Risk assessment
- Designated CISO
- Annual certification
- 72-hour breach notification
```

**State-specific:**
```
NY DFS 23 NYCRR 500 - strict cyber rules
CA CCPA/CPRA - consumer privacy
TX cybersecurity (insurance-specific)
```

### EU: GDPR + Insurance-Specific
```
GDPR fully applies
+ Member state insurance-specific rules
+ Sectoral guidelines (EDPB)
```

### Thailand: PDPA
```
+ Insurance Acts data provisions
+ OIC guidance on data handling
```

## Producer Licensing

```typescript
// Verify producer is licensed for state + line
async function verifyProducer(producerId, state, lineOfBusiness) {
  const license = await nipr.getLicense(producerId, state);

  if (!license) return { authorized: false, reason: 'No license' };
  if (license.expired) return { authorized: false, reason: 'Expired' };
  if (!license.lines.includes(lineOfBusiness)) {
    return { authorized: false, reason: 'Not licensed for line' };
  }

  return { authorized: true, expires: license.expires };
}
```

## Filing Templates

```
Rate filing must include:
- Cover letter
- Filing summary
- Actuarial memorandum
- Rate manual / pages
- Rate change exhibit
- Supporting data
- Loss experience exhibits
- Cause-and-effect analysis
- Distribution of impact

Form filing must include:
- Cover letter
- Form (with track changes if revision)
- Readability scoring
- Statement of variability
- Side-by-side comparison (if revision)
```

## Examinations

### Financial exam
```
Frequency: every 3-5 years (US)
Scope: financial condition, reserves, capital, controls

Preparation:
- Provide requested data
- Walk-throughs of processes
- Make staff available
- Address findings
```

### Market conduct exam
```
Focus: sales practices, claims handling
Targeted: triggered by complaints or risk
Period: 1-3 years of activity

Preparation:
- Provide samples (policies, claims)
- Demonstrate procedures
- Show training records
- Address findings + violations
```

## Common Compliance Gaps

- ❌ Outdated rate filings (still using approved rates from 2018)
- ❌ Producer licensing not verified at point of sale
- ❌ Privacy notice gaps
- ❌ Claims handling inconsistent across states
- ❌ Adverse action notices missing
- ❌ Discrimination not tested

## Reference

- [NAIC](https://www.naic.org/)
- [SERFF](https://www.serff.com/)
- [EIOPA (Solvency II)](https://www.eiopa.europa.eu/)
- [Thai OIC](https://www.oic.or.th/)
- [NIPR (US producer licensing)](https://nipr.com/)
- [Insurance Compliance Magazine](https://www.insurancecomplianceinsight.com/)
