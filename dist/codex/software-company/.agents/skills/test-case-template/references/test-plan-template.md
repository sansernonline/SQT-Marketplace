# แม่แบบแผนทดสอบ (test plan)

**สารบัญ:** แม่แบบเต็ม 1 บล็อก: Objective · Scope · Test Approach · Entry & Exit Criteria · Test Environment · Schedule · Risks · Plan Quality · Sign-off

เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

## Standard Output: Polished Test Plan

```markdown
# Test Plan: <Feature Name>

| | |
|--|--|
| **Plan Type** | Functional + Regression |
| **Version** | 1.0 |
| **Status** | Draft |
| **Quality Assurance (QA) Lead** | @name |
| **Target Release** | vX.Y.Z |
| **Test Period** | YYYY-MM-DD to YYYY-MM-DD |

---

## Table of Contents

1. [Objective](#1-objective)
2. [Scope](#2-scope)
3. [Test Approach](#3-test-approach)
4. [Entry & Exit Criteria](#4-entry--exit-criteria)
5. [Test Environment](#5-test-environment)
6. [Schedule](#6-schedule)
7. [Risks](#7-risks)
8. [Plan Quality](#8-plan-quality)

---

## 1. Objective

> What we're testing and why.

**Where expected results come from:** `[D]` owner / customer > `[R]` general rules (maths, law, standards) > `[A]` the builder's SPEC > `[O]` the screen · every test case needs `[D]` or `[R]` (see `test-case-template` → oracle)

## 2. Scope

| In Scope | Out of Scope |
|-------------|-----------------|
| Functional, boundary, negative | Performance (separate plan) |
| Integration with X | Mobile app (Phase 2) |

## 3. Test Approach

| Test Type | Coverage | Tool | Owner |
|-----------|:--------:|------|:------|
| Functional | Manual + automated | Playwright | @alice |
| Security | Smoke | OWASP ZAP | @bob |
| Accessibility | WCAG AA | Axe DevTools | @charlie |
| Compatibility | PR: Chromium · nightly: + WebKit (iPhone) · pre-prod: + Firefox | Playwright projects (+ real iPhone before release) | @alice |
| Exploratory | Time-boxed 4h/day | — | All |

### Coverage matrix

| Feature | Happy | Negative | Boundary | Equivalence | State | Security/API |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Booking | TC-BOOK-01 | TC-BOOK-04 | TC-BOOK-06–08 | TC-BOOK-05 | TC-BOOK-10 | TC-BOOK-12 |
| Gift card | TC-GIFT-01 | TC-GIFT-02 | Gap: no expiry-day case yet | — | TC-GIFT-04 | — |

Every BR in the traceability table at the end of the test-case file has at least 1 case.

## 4. Entry & Exit Criteria

### Entry Criteria (Must be met before testing starts)
- [ ] Code deployed to test environment
- [ ] Smoke test passing
- [ ] Test data prepared
- [ ] Expected results for money and limits worked out from `[D]` + `[R]` and written in the cases — before the first run
- [ ] Test environment stable for 24h

### Exit Criteria (Must be met before release)
- [ ] 100% planned test cases executed
- [ ] Every P1 case passes, on every browser in scope
- [ ] Pass rate ≥ 95% per browser (round up · `Not run` counts as fail)
- [ ] Every failed case triaged (system wrong / plan wrong / test wrong) — none "fixed" by editing the expected result
- [ ] 0 critical (severity 1, S1) bugs open
- [ ] ≤ 2 high (severity 2, S2) bugs open with approved workaround
- [ ] Regression suite 100% pass
- [ ] Performance benchmarks met

## 5. Test Environment

| Aspect | Detail |
|--------|--------|
| URL | https://staging.example.com |
| Test data | Synthetic data (generator) · production copies only with anonymisation that the data owner signs off (Personal Data Protection Act, PDPA) |
| Browsers | Chromium (every run) · WebKit/iPhone (nightly, pre-prod) · Firefox (pre-prod only, drop if users don't use it) |
| Devices | iPhone 15, Galaxy S24, iPad Pro |

## 6. Schedule

| Step | Start | Length | Owner |
|------|-------|--------|-------|
| Smoke + Sanity | (รอยืนยัน) | 2d | @name |
| Functional Testing | after Smoke | 5d | @name |
| Integration | after Functional | 3d | @name |
| Regression | after Integration | 2d | @name |
| Bug Bash | after Regression | 1d | @name |
| Sign-off | after Bug Bash | 1d | @name |

> Want a Gantt chart? Draw it with `diagram-figures` (house-style figure), not raw Mermaid. Dates stay `(รอยืนยัน)` until the owner confirms them.

## 7. Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|:--:|------|:----------:|:------:|------------|
| R-001 | Test env instability | Medium | High | Backup env ready |
| R-002 | Late requirement changes | Medium | Medium | Buffer +20% |

## 8. Plan Quality

> Would this plan catch a broken system? At least 6 rows, covering money, bookings/transactions and state.

| If the system breaks like this | Case(s) that must fail | Caught because (oracle) |
|---|---|---|
| Discount applied twice | TC-PRICE-03 | `[D]` BR-03 · `[R]` ฿800 − 5% (฿40) = ฿760 |
| Double-click confirm creates 2 bookings | TC-BOOK-11 | `[R]` one click = one booking · count after reload |
| Data gone after reload | TC-POINT-02 (Check when: หลังรีโหลด) | `[D]` points kept after a completed visit |

A break with no case that fails → add a case, then add the row again.

## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| QA Lead | @qa | Pending | — |
| Dev Lead | @dev | Pending | — |
| Product Owner | @po | Pending | — |
```
