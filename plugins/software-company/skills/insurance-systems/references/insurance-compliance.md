> เดิมชื่อ insurance-compliance (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-insurtech` — รวมเข้า `insurance-systems` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Regulatory Landscape Overview](#regulatory-landscape-overview)
- [US: State Filings via SERFF](#us-state-filings-via-serff)
- [US: Market Conduct](#us-market-conduct)
- [EU: Solvency II](#eu-solvency-ii)
- [US: Risk-Based Capital (RBC)](#us-risk-based-capital-rbc)
- [Thailand OIC](#thailand-oic)
- [Data Privacy in Insurance](#data-privacy-in-insurance)
- [Producer Licensing](#producer-licensing)
- [Filing Templates](#filing-templates)
- [Examinations](#examinations)
- [Common Compliance Gaps](#common-compliance-gaps)
- [Reference](#reference)

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
  National Association of Insurance Commissioners (NAIC) coordination (non-binding)
  System for Electronic Rates & Forms Filing (SERFF) for filings

EU:
  Solvency II framework
  European Insurance and Occupational Pensions Authority (EIOPA) coordination
  Member state implementation

UK (post-Brexit):
  Prudential Regulation Authority (PRA, prudential) + Financial Conduct Authority (FCA, conduct)
  Generally aligned with EU but diverging

Thailand:
  OIC (Office of Insurance Commission)
  Insurance Acts

Singapore:
  MAS (Monetary Authority of Singapore)

Japan:
  FSA (Financial Services Agency)

Australia:
  Australian Prudential Regulation Authority (APRA) + Australian Securities and Investments Commission (ASIC)
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

This is the one place in the skill for the RBC formulas; role files link here.
Sources: American Academy of Actuaries, "Regulatory Capital Requirements — US Life Insurers"
(actuary.org) and actuary.info "Risk-Based Capital explained" (both checked 2026-10-22).
The NAIC instructions themselves (content.naic.org) were not opened → (รอยืนยัน) before quoting.

```
LIFE (C factors) — two charges sit outside the square root:
  RBC after covariance = C0 + C4a + sqrt[ (C1o + C3a)² + (C1cs + C3c)² + C2² + C3b² + C4b² ]
  Authorized Control Level (ACL) = 50% × RBC after covariance (plus an operational-risk add-on)

  C0   affiliated investments and off-balance-sheet items
  C1o  asset risk — bonds, mortgages, other fixed income
  C1cs asset risk — common stock
  C2   insurance risk — mortality, morbidity, longevity
  C3a  interest rate risk          C3b  health credit risk
  C3c  market risk on guarantees
  C4a  business risk, premium-based   C4b  health administrative expense risk

PROPERTY AND CASUALTY (R factors):
  RBC after covariance = R0 + sqrt( R1² + R2² + R3² + R4² + R5² + Rcat² )   (plus operational-risk add-on)
  ACL = 50% × RBC after covariance

  R0 affiliated insurers   R1 fixed-income assets   R2 equity assets
  R3 credit (incl. reinsurance recoverables)   R4 loss and loss-adjustment reserves
  R5 written premium       Rcat catastrophe (earthquake, hurricane, wildfire)

Levels (Total Adjusted Capital ÷ ACL):
- 200%: Company Action (alert)
- 150%: Regulatory Action
- 100%: Authorized Control
- 70%: Mandatory Control (taken over)

Target: 300%+ in practice
```

## Thailand OIC

```
Regulator: สำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย
(Office of Insurance Commission, OIC) — oic.or.th

Key laws (both amended several times — check the current consolidated text on oic.or.th):
- พระราชบัญญัติประกันชีวิต พ.ศ. 2535 (Life Insurance Act B.E. 2535)
- พระราชบัญญัติประกันวินาศภัย พ.ศ. 2535 (Non-Life Insurance Act B.E. 2535)
- กฎกระทรวง (Ministerial Regulations) + ประกาศ คปภ. (OIC Notifications) under each Act

Capital requirements — OIC risk-based capital (RBC) framework, now "RBC 2" (รอยืนยัน: effective year):
- Capital adequacy ratio (CAR) = capital available ÷ capital required
- OIC early-warning / supervisory level: CAR not below 140%
  (stated in Prudential Life Q2 2025 and Tokio Marine Life 2025 public disclosures, checked
  2026-10-22; the OIC notification itself was not opened → (รอยืนยัน))
- Legal floor in the Acts: 100% of required capital (รอยืนยัน)
- Insurers publish their CAR quarterly on their own websites

Product approval:
- Policy forms and rates need OIC approval before sale (แบบและข้อความกรมธรรม์ + อัตราเบี้ยประกันภัย)
- Forms and procedures: oic.or.th → กฎหมาย / ประกาศ (รอยืนยัน: current menu path)

Online and electronic sales:
- OIC notifications on offering and issuing policies through electronic channels
  (issued from B.E. 2560 onward, including the "Digital Face to Face" sales rules of B.E. 2563)
  — find the version in force on oic.or.th before building a sales flow (รอยืนยัน)
- Electronic signatures and records: Electronic Transactions Act B.E. 2544
  (see `legal-document-systems` → e-signature-compliance.md)

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
~30 states adopted (count not dated — check NAIC before quoting (รอยืนยัน))
Requirements:
- Written information security program
- Risk assessment
- Designated person(s) responsible for the program (employee, affiliate or vendor)
  — a named Chief Information Security Officer (CISO) is a New York Department of Financial Services (DFS)
    rule (23 NYCRR 500), not the model law
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
- ❌ Producer licenses not checked at the point of sale
- ❌ Missing or incomplete privacy notices
- ❌ Claims handling inconsistent across states
- ❌ Adverse action notices missing
- ❌ No testing for discrimination

## Reference

- [NAIC](https://www.naic.org/)
- [SERFF](https://www.serff.com/)
- [EIOPA (Solvency II)](https://www.eiopa.europa.eu/)
- [Thai OIC](https://www.oic.or.th/)
- [NIPR (US producer licensing)](https://nipr.com/)
