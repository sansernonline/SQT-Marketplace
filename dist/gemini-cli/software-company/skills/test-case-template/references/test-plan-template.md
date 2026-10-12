# แม่แบบแผนทดสอบ (test plan)

ย้ายมาจาก agent `qa-tester` · เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

## Standard Output: Polished Test Plan

```markdown
# 🧪 Test Plan: <Feature Name>

| | |
|--|--|
| **Plan Type** | Functional + Regression |
| **Version** | 1.0 |
| **Status** | 🟡 Draft |
| **QA Lead** | @name |
| **Target Release** | vX.Y.Z |
| **Test Period** | YYYY-MM-DD to YYYY-MM-DD |

---

## 📑 Table of Contents

1. [Objective](#1-objective)
2. [Scope](#2-scope)
3. [Test Approach](#3-test-approach)
4. [Entry & Exit Criteria](#4-entry--exit-criteria)
5. [Test Environment](#5-test-environment)
6. [Schedule](#6-schedule)
7. [Risks](#7-risks)

---

## 1. 🎯 Objective

> 💡 What we're testing and why.

## 2. Scope

| ✅ In Scope | ❌ Out of Scope |
|-------------|-----------------|
| Functional, boundary, negative | Performance (separate plan) |
| Integration with X | Mobile app (Phase 2) |

## 3. 🔄 Test Approach

| Test Type | Coverage | Tool | Owner |
|-----------|:--------:|------|:------|
| 🟢 Functional | ⚡ Manual + automated | Playwright | @alice |
| 🔒 Security | Smoke | OWASP ZAP | @bob |
| ♿ Accessibility | WCAG AA | Axe DevTools | @charlie |
| 🌐 Compatibility | Top 3 browsers | BrowserStack | @alice |
| 🐛 Exploratory | Time-boxed 4h/day | — | All |

## 4. Entry & Exit Criteria

### ✅ Entry Criteria (Must be met before testing starts)
- [ ] Code deployed to test environment
- [ ] Smoke test passing
- [ ] Test data prepared
- [ ] Test environment stable for 24h

### 🏁 Exit Criteria (Must be met before release)
- [ ] 100% planned test cases executed
- [ ] 0 critical (S1) bugs open
- [ ] ≤ 2 high (S2) bugs open with approved workaround
- [ ] Regression suite 100% pass
- [ ] Performance benchmarks met

## 5. 🌐 Test Environment

| Aspect | Detail |
|--------|--------|
| URL | https://staging.example.com |
| Test data | Refreshed nightly from prod (anonymized) |
| Browsers | Chrome 120+, Firefox 121+, Safari 17+ |
| Devices | iPhone 15, Galaxy S24, iPad Pro |

## 6. 🗓️ Schedule

\`\`\`mermaid
gantt
    title Test Schedule
    dateFormat YYYY-MM-DD
    Smoke + Sanity     :a1, 2025-01-15, 2d
    Functional Testing :a2, after a1, 5d
    Integration        :a3, after a2, 3d
    Regression         :a4, after a3, 2d
    Bug Bash           :a5, after a4, 1d
    Sign-off           :a6, after a5, 1d
\`\`\`

## 7. ⚠️ Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|:--:|------|:----------:|:------:|------------|
| R-001 | Test env instability | 🟡 Med | 🔴 High | Backup env ready |
| R-002 | Late requirement changes | 🟡 Med | 🟡 Med | Buffer +20% |

## ✍️ Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| QA Lead | @qa | ⚪ Pending | — |
| Dev Lead | @dev | ⚪ Pending | — |
| Product Owner | @po | ⚪ Pending | — |
```
