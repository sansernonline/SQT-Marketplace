# แม่แบบเอกสาร product — vision · roadmap · PRD brief

**สารบัญ:** Product Vision Statement · Polished Roadmap · Product Requirements Document (PRD) Brief

เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

- [Product Vision Statement](#product-vision-statement)
- [Polished Roadmap](#polished-roadmap)
- [Product Requirements Document (PRD) Brief](#product-requirements-document-prd-brief)

## Standard Outputs

### Product Vision Statement

```markdown
# Product Vision: <Product Name>

## Vision (5-year)
> One sentence describing what the product will become.

## Mission (1-year)
> One sentence describing what we'll achieve this year.

## Target User
- Primary persona: ...
- Their key job-to-be-done: ...

## Differentiation
- We are NOT: ...
- We ARE: ...
- Why we win: ...
```

### Polished Roadmap

```markdown
# Product Roadmap: <Product> — Q1-Q4 <YYYY>

| | |
|--|--|
| **Document Type** | Product Roadmap |
| **Version** | 1.0 |
| **Status** | Draft |
| **Product Owner** | @pm-name |
| **Time Horizon** | 12 months |

---

## Strategic Themes

| Theme | Why It Matters | Success Metric |
|-------|---------------|----------------|
| Activation Lift | Conversion is 30% below industry | +15% activation rate |
| Monetization | Unlock paid tier | $XXk Monthly Recurring Revenue (MRR) by Q4 |
| International | Expand to APAC | 3 new locales |

## Quarterly Plan

> รูปไทม์ไลน์ (Gantt) วาดตามแบบประจำบ้านของ skill `diagram-figures` — เอกสารโปรเจกต์ไม่ใช้ Mermaid ค่าเริ่มต้น · ข้อมูลที่ใช้วาด:

| Theme | งาน | เริ่ม | ยาว / ต่อจาก |
|-------|-----|-------|--------------|
| Activation | Onboarding redesign | `<YYYY>`-01-01 | 60 วัน |
| Activation | Free trial extension | ต่อจาก Onboarding redesign | 30 วัน |
| Monetization | Pricing experiments | `<YYYY>`-02-01 | 45 วัน |
| Monetization | Paid tier launch | ต่อจาก Pricing experiments | 30 วัน |
| International | Asia-Pacific (APAC) research | `<YYYY>`-03-01 | 30 วัน |
| International | JP/KR/TH localization | ต่อจาก APAC research | 90 วัน |

## Feature Prioritization (RICE)

| Feature | Reach (users / quarter) | Impact (0.25–3) | Confidence | Effort (person-months) | RICE Score | Priority |
|---------|:-----:|:------:|:----------:|:------:|:----------:|:--------:|
| Onboarding redesign | 10,000 | 2 | 80% | 2 | 8,000 | P0 |
| Paid tier | 5,000 | 3 | 90% | 3 | 4,500 | P1 |
| Mobile app | 8,000 | 1 | 60% | 4 | 1,200 | P2 |

> **RICE = (Reach × Impact × Confidence) / Effort** — ตัวเลขข้างบนเป็นตัวอย่างสมมติ · Impact ใช้สเกล 0.25 / 0.5 / 1 / 2 / 3 · Effort เป็นคน-เดือน (ตรงกับ `SKILL.md` ข้อ 4)

## Out of Scope (This Year)

- Enterprise Single Sign-On (SSO) (revisit Q1 next year)
- AI chatbot (waiting for market signal)

## Key Metrics Dashboard

| Metric | Current | Q1 Target | Q4 Target |
|--------|--------:|----------:|----------:|
| Activation rate | 18% | 25% | 35% |
| MRR | $50k | $80k | $200k |
| Net Promoter Score (NPS) | 32 | 40 | 50 |

## Strategic Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| Competitor launches similar feature | Medium | High | Speed to market |
| Key engineering hire delayed | Low | Medium | External contractors |

## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| CEO | @ceo | Pending | — |
| Head of Eng | @eng | Pending | — |
| Head of Sales | @sales | Pending | — |
```

### Product Requirements Document (PRD) Brief

```markdown
# PRD: <Feature Name>

| | |
|--|--|
| **Author** | @pm-name |
| **Status** | Draft |
| **Target Release** | Q2 <YYYY> |

## Problem Statement

> What user problem are we solving? Why now?

## Target User

Primary persona + their context.

## Solution Overview

High-level approach — NOT detailed spec.

## Success Metrics

| Metric | Baseline | Target | How Measured |
|--------|---------:|-------:|--------------|
| ... | ... | ... | ... |

## Hypothesis

> If we build <X>, then <metric Y> will improve by <Z>%, because <reasoning>.

## Out of Scope

What we explicitly are NOT doing in v1.

## Risks & Open Questions

| ID | Item | Owner |
|----|------|------|
| Q1 | ... | @pm |

## References

- User research: [link]
- Competitive analysis: [link]
```
