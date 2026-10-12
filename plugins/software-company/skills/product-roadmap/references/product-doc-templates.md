# แม่แบบเอกสาร product — vision · roadmap · PRD brief

ย้ายมาจาก agent `product-manager` · เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

- [Product Vision Statement](#product-vision-statement)
- [Polished Roadmap](#polished-roadmap)
- [Product Requirements Document (PRD) Brief](#product-requirements-document-prd-brief)

## Standard Outputs

### Product Vision Statement

```markdown
# 🎯 Product Vision: <Product Name>

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
# 📋 Product Roadmap: <Product> — Q1-Q4 YYYY

| | |
|--|--|
| **Document Type** | Product Roadmap |
| **Version** | 1.0 |
| **Status** | 🟢 Approved |
| **Product Owner** | @pm-name |
| **Time Horizon** | 12 months |

---

## 🎯 Strategic Themes

| Theme | Why It Matters | Success Metric |
|-------|---------------|----------------|
| 🚀 Activation Lift | Conversion is 30% below industry | +15% activation rate |
| 💰 Monetization | Unlock paid tier | $XXk MRR by Q4 |
| 🌍 International | Expand to APAC | 3 new locales |

## 🗓️ Quarterly Plan

\`\`\`mermaid
gantt
    title Product Roadmap YYYY
    dateFormat YYYY-MM-DD
    section Activation
    Onboarding redesign     :a1, 2025-01-01, 60d
    Free trial extension    :a2, after a1, 30d
    section Monetization
    Pricing experiments     :b1, 2025-02-01, 45d
    Paid tier launch        :b2, after b1, 30d
    section International
    APAC research           :c1, 2025-03-01, 30d
    JP/KR/TH localization   :c2, after c1, 90d
\`\`\`

## 📊 Feature Prioritization (RICE)

| Feature | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|---------|:-----:|:------:|:----------:|:------:|:----------:|:--------:|
| Onboarding redesign | 10k | 3 | 80% | 8 wks | 300 | 🔴 P0 |
| Paid tier | 5k | 5 | 90% | 12 wks | 188 | 🟡 P1 |
| Mobile app | 8k | 4 | 60% | 16 wks | 120 | 🟢 P2 |

> 📐 **RICE = (Reach × Impact × Confidence) / Effort**

## 🎯 Out of Scope (This Year)

- ❌ Enterprise SSO (revisit Q1 next year)
- ❌ AI chatbot (waiting for market signal)

## 📊 Key Metrics Dashboard

| Metric | Current | Q1 Target | Q4 Target |
|--------|--------:|----------:|----------:|
| Activation rate | 18% | 25% | 35% |
| MRR | $50k | $80k | $200k |
| NPS | 32 | 40 | 50 |

## ⚠️ Strategic Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| Competitor launches similar feature | 🟡 Med | 🔴 High | Speed to market |
| Key engineering hire delayed | 🟢 Low | 🟡 Med | External contractors |

## ✍️ Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| CEO | @ceo | ⚪ Pending | — |
| Head of Eng | @eng | ⚪ Pending | — |
| Head of Sales | @sales | ⚪ Pending | — |
```

### Product Requirements Document (PRD) Brief

```markdown
# 📋 PRD: <Feature Name>

| | |
|--|--|
| **Author** | @pm-name |
| **Status** | 🟡 Draft |
| **Target Release** | Q2 YYYY |

## 🎯 Problem Statement

> What user problem are we solving? Why now?

## 👥 Target User

Primary persona + their context.

## 💡 Solution Overview

High-level approach — NOT detailed spec.

## 📊 Success Metrics

| Metric | Baseline | Target | How Measured |
|--------|---------:|-------:|--------------|
| ... | ... | ... | ... |

## 🎯 Hypothesis

> If we build <X>, then <metric Y> will improve by <Z>%, because <reasoning>.

## 🔄 Out of Scope

What we explicitly are NOT doing in v1.

## ⚠️ Risks & Open Questions

| ID | Item | Owner |
|----|------|------|
| Q1 | ... | @pm |

## 📖 References

- User research: [link]
- Competitive analysis: [link]
```
