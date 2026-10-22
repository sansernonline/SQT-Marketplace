# Insurance Compliance Officer — frameworks, filings, conduct, solvency

คู่มือบทบาทของ agent `insurance-compliance-officer` — ย้ายมาจากตัว agent (2026-10-14) · รายละเอียดเต็มของ SERFF · RBC · Solvency II · OIC · examinations อยู่ที่ [`insurance-compliance.md`](insurance-compliance.md) · ตัวเลขและจำนวนรัฐเป็นค่าจากความรู้ของโมเดล ยังไม่ได้ตรวจกับแหล่งทางการ (รอยืนยัน)

**สารบัญ:**

- [Regulatory Frameworks](#regulatory-frameworks)
- [Product + Rate Filings (US)](#product--rate-filings-us)
- [Market Conduct](#market-conduct)
- [Data Privacy in Insurance](#data-privacy-in-insurance)
- [Solvency](#solvency)
- [Regulatory Reporting](#regulatory-reporting)
- [Compliance Workflow](#compliance-workflow)

## Regulatory Frameworks

### US (Highly Fragmented)

**State-by-state:**
- Each state has its own insurance commissioner
- Product and rate filings required
- Licensing per state, per line
- Market conduct rules vary
- Producer licensing

**Federal layer:**
- Federal Insurance Office (FIO) — limited role
- ERISA (employer health benefits)
- McCarran-Ferguson Act — leaves insurance regulation to the states

**National Association of Insurance Commissioners (NAIC) — coordinates, but its rules are not binding:**
- Model laws and regulations
- States adopt them, often with changes

### EU (Solvency II)
- Pillar 1: Capital requirements (SCR + MCR)
- Pillar 2: Governance and risk management
- Pillar 3: Disclosure and transparency
- Same framework across EU member states

### Thailand
- **OIC (Office of Insurance Commission)** — สำนักงาน คปภ., oic.or.th
- Life Insurance Act B.E. 2535 and Non-Life Insurance Act B.E. 2535, plus ministerial regulations and OIC notifications
- OIC risk-based capital: capital adequacy ratio (CAR) supervisory level 140% (รอยืนยัน)
- Product forms and rates approved before sale; separate rules for electronic sales
- Details, sources and check dates: `insurance-compliance.md` → Thailand OIC

### Other major
- UK: Prudential Regulation Authority (PRA) + Financial Conduct Authority (FCA)
- Japan: Financial Services Agency (FSA)
- Singapore: Monetary Authority of Singapore (MAS)
- Australia: Australian Prudential Regulation Authority (APRA) + Australian Securities and Investments Commission (ASIC)

## Product + Rate Filings (US)

```typescript
interface RateFiling {
  state: string;
  line_of_business: string;
  filing_type: 'new_program' | 'rate_revision' | 'form_revision';
  effective_date: Date;
  rate_change: number;          // % change
  actuarial_justification: Document;
  supporting_documents: Document[];
  filing_status: 'submitted' | 'approved' | 'rejected' | 'objected';
  serff_filing_number?: string;
}

// File via SERFF (System for Electronic Rate and Form Filing)
// Each state has own review timeline — see insurance-compliance.md (US: State Filings via SERFF)
// Some states "prior approval", others "file and use"
```

### Common filing review issues
- Inadequate actuarial support
- Discrimination (protected classes)
- Excessive or inadequate rates
- Form clarity / readability
- Conflict with existing law

## Market Conduct

### Sales practices
- Suitability (especially life insurance and annuities)
- Replacement disclosure
- Senior protections
- Producer licensing verification
- Anti-rebating rules

### Claims handling
- Prompt acknowledgment (timeframes vary)
- Fair investigation
- Reasonable settlement
- Bad faith laws (state-specific)
- Unfair claims settlement practices acts

### Pattern: Compliance by Design

```typescript
// Build compliance into systems

// E.g., suitability for annuities
async function recommendAnnuity(customer, product) {
  const suitabilityScore = await calculateSuitability(customer, product);

  if (suitabilityScore < THRESHOLD) {
    return {
      can_proceed: false,
      reason: 'Product not suitable for customer profile',
      better_alternatives: await findSuitableAlternatives(customer),
    };
  }

  // Required disclosures
  await displayDisclosures(customer, product);
  await collectAcknowledgments(customer, REQUIRED_ACKS);

  return { can_proceed: true };
}
```

## Data Privacy in Insurance

### Specific regulations

**GLBA (Gramm-Leach-Bliley Act, US):**
- Privacy notices to customers
- Opt-out from sharing
- Information security program

**NAIC Insurance Data Security Model Law:**
- Adopted by ~30 states (จำนวนจากความรู้ของโมเดล ไม่มีวันที่อ้างอิง — ตรวจกับ NAIC ก่อนอ้าง (รอยืนยัน))
- Required: written information security program
- Notification of cybersecurity events

**New York Department of Financial Services (DFS) Cybersecurity Regulation (23 NYCRR 500):**
- Strict requirements
- Chief Information Security Officer (CISO) required (the NAIC model law only asks for a designated responsible person)
- Annual certification

**Other regimes:**
- GDPR (EU)
- PIPEDA (Canada)
- PDPA (Thailand, Singapore)

### Insurance-specific privacy
```
Special considerations:
- Health information (different rules than HIPAA but related)
- Genetic information (GINA, state laws)
- Driving records (DPPA)
- Credit information (FCRA)
```

## Solvency

### Reserves
```
Statutory reserves >= actuarially indicated
Quarterly review
Independent actuary opinion annually
```

### Capital
```
US: RBC ratio > 200% (target 300%+)
EU: SCR ratio > 100% (target 150%+)
TH: CAR ≥ 140% OIC supervisory level (รอยืนยัน) — see insurance-compliance.md → Thailand OIC
```

### Liquidity
- Cash flow testing
- Asset adequacy analysis

## Regulatory Reporting

### US: Annual + Quarterly Statements
- Statutory financial statements
- Schedule P (loss development)
- Schedule F (reinsurance)
- Risk-Based Capital filing

### EU: Quantitative Reporting Templates (QRTs)
- Balance sheet
- Risk modules
- ORSA report

### Thailand
- RBC quarterly
- Annual financial statements
- Product-specific reports

## Compliance Workflow

```
New product idea
   ↓
Compliance review (early!)
   ↓
Actuarial + legal review
   ↓
Form + rate filings
   ↓
Regulatory approval
   ↓
Producer training
   ↓
Launch (post-approval only!)
   ↓
Ongoing monitoring
```
