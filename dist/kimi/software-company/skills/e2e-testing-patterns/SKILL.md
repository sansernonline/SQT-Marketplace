---
name: e2e-testing-patterns
description: Use when designing end-to-end tests with Playwright or Cypress, structuring suites, fixing flaky tests or running E2E in CI.
---

> **ใน SuperUser:** ถ้าอยากให้ agent รันแอปและพิสูจน์ผลเอง ให้ใช้ [`app-verifier-setup`](../app-verifier-setup/SKILL.md) ส่วน skill นี้คือหลักออกแบบชุดทดสอบ E2E (end-to-end) ที่ verifier นั้นเรียกใช้

# End-to-End Testing Patterns

## When to use this skill

- Setting up E2E testing in a new project
- Choosing between Playwright, Cypress, Selenium
- Structuring a growing E2E test suite
- Fighting flaky tests
- Designing test data strategy
- Adding E2E to a CI/CD pipeline
- Migrating from one framework to another

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/page-object-model.md](references/page-object-model.md) | ถ้าจะตั้งโครงชุดทดสอบใหม่ หรือเจอเทสต์ที่ลอกขั้นตอนล็อกอินซ้ำกัน ให้เปิดดูโค้ดเทียบแบบไม่ดีกับแบบ Page Object |
| [references/test-data-strategies.md](references/test-data-strategies.md) | ตอนเลือกวิธีเตรียมข้อมูลทดสอบ และอยากเห็นข้อดีข้อเสียของทั้ง 4 แบบพร้อมโค้ดตัวอย่าง |
| [references/flaky-tests.md](references/flaky-tests.md) | ถ้าเทสต์ผ่านบ้างไม่ผ่านบ้าง ให้เปิดดูโค้ดเทียบการรอแบบ sleep กับการรอตามเหตุการณ์ |
| [references/auth-in-e2e.md](references/auth-in-e2e.md) | ตอนวางวิธีล็อกอินในชุดทดสอบ และต้องการโค้ด `storageState` หรือการฉีด cookie ผ่าน API |
| [references/ci-and-parallel.md](references/ci-and-parallel.md) | ตอนตั้งการรันขนานหรือแบ่งรอบการรัน E2E ใน CI และต้องรู้ว่าต้องเก็บไฟล์อะไรเมื่อเทสต์ล้ม |
| [references/coverage-and-libraries.md](references/coverage-and-libraries.md) | ตอนทำตารางความครอบคลุมของเส้นทางผู้ใช้ หรือย้ายคำสั่งระหว่าง Playwright กับ Cypress |

## The Testing Pyramid (Get This Right First)

```
        ▲
       ╱E╲       E2E: 5-10% of tests
      ╱ 2 ╲
     ╱  E  ╲     - Slow, expensive, flaky
    ╱───────╲    - Test critical user journeys ONLY
   ╱  Integ  ╲   Integration: 15-25%
  ╱           ╲  - API contracts, DB interactions
 ╱─────────────╲ Unit: 70-80%
╱      Unit     ╲ - Fast, deterministic, many
─────────────────
```

> 🚨 **Anti-pattern: Ice cream cone** (many E2E tests, few unit tests)
> Result: slow CI, flaky tests, slow debugging

## Framework Selection (2026)

| Framework | Best for | Avoid for |
|-----------|----------|-----------|
| **Playwright** ⭐ | Modern apps, cross-browser, parallel | Legacy apps with weird patterns |
| **Cypress** | Developer experience, easy to learn, single-app | Multi-tab, cross-origin tests |
| **Selenium** | Legacy, language flexibility | Greenfield projects |
| **Puppeteer** | Chrome-only, scraping | Cross-browser needs |
| **WebDriverIO** | Mobile + web, BDD style | Simple use cases |

> 💡 **Default recommendation: Playwright** — best developer experience, fast, cross-browser, made by Microsoft

## Test Structure: Page Object Model (POM)

ถ้าทุกเทสต์เขียน `page.fill` และ `page.click` ของหน้าเดียวกันซ้ำ ๆ ให้ย้ายขั้นตอนเหล่านั้นไปไว้ในคลาสของหน้านั้น แล้วให้เทสต์เรียกเมธอดแทน โค้ดเทียบอยู่ใน [references/page-object-model.md](references/page-object-model.md)

> 💡 **One Page Object per page or major component.**

## Selectors: Hierarchy of Goodness

```
Most resilient ─────────────────────────► Most brittle

✅ Role + accessible name      page.getByRole('button', { name: 'Submit' })
✅ Test IDs                     page.getByTestId('submit-btn')
🟡 Visible text                 page.getByText('Submit')
🟡 Label                        page.getByLabel('Email')
🔴 CSS classes                  page.locator('.btn-primary')
🔴 Tag + index                  page.locator('button:nth-child(3)')
❌ XPath                        page.locator('//div[2]/button')
```

**Rule:** Prefer queries that survive refactoring.

## Test Data Strategy

มี 4 แบบ คือ shared test DB · per-test setup · API setup กับ UI verification · database snapshot กับ rollback
แบบที่แนะนำคือ **Option 3: API setup, UI verification (best)** — เตรียมข้อมูลผ่าน API ให้เร็วและแน่นอน แล้วค่อยทดสอบ UI จริง ส่วน shared test DB ทำให้เทสต์พึ่งลำดับกัน รันขนานยาก และข้อมูลปนกัน ส่วนข้อดีข้อเสียครบทุกแบบอยู่ใน [references/test-data-strategies.md](references/test-data-strategies.md)

## What to Test E2E (Not Everything!)

### ✅ DO test E2E
- Critical user journeys (login → checkout → confirmation)
- Multi-step workflows that span multiple pages
- Integration with external services (payment, email)
- "Smoke tests" that verify deployment works
- Cross-browser specific behavior

### ❌ DON'T test E2E
- Every form validation (use unit tests)
- Edge cases of business logic (use unit/integration)
- Every error message (use unit tests)
- Performance (use dedicated tools)
- Visual design (use visual regression tools)

> 💡 **Rule of thumb:** If a unit/integration test can verify it, don't add E2E.

ให้ทำตารางความครอบคลุมของเส้นทางผู้ใช้ (Critical Path Coverage Matrix) ที่บอกว่าแต่ละเส้นทางครอบคลุมแล้วหรือยัง และสำคัญระดับ P0 P1 หรือ P2 ตัวอย่างอยู่ใน [references/coverage-and-libraries.md](references/coverage-and-libraries.md)

## Fighting Flaky Tests

| Cause | Fix |
|-------|-----|
| Hard-coded sleeps | Use auto-waiting (Playwright/Cypress have this) |
| Animation timing | Wait for animation to complete OR disable in tests |
| Network race conditions | `page.waitForResponse(url)` before assertion |
| Test data leak | Use unique data per test (timestamp/UUID) |
| Order dependency | Each test fully isolated, parallelizable |
| Auth race condition | Pre-authenticate via API, inject session |
| Element not stable | `expect(el).toBeVisible()` before interacting |

ห้ามใช้ `page.waitForTimeout` รอแบบกำหนดเวลา ให้รอเหตุการณ์จริง เช่น response ของ API แทน โค้ดเทียบอยู่ใน [references/flaky-tests.md](references/flaky-tests.md)

### Retry strategy
- **In CI:** auto-retry failed tests 1-2 times
- **Track flakiness:** a test that fails > 5% of runs is a candidate for quarantine (pulled out of the blocking run)
- **Don't accept flaky tests:** investigate or delete them. Don't ignore them

## Authentication in E2E

อย่าล็อกอินผ่าน UI ในทุกเทสต์ เพราะช้า เปราะ และโค้ดซ้ำ ให้ล็อกอินครั้งเดียวแล้วแชร์สถานะ (`storageState`) หรือดีกว่านั้นคือล็อกอินผ่าน API แล้วฉีด cookie เข้า browser context โค้ดทั้งสามแบบอยู่ใน [references/auth-in-e2e.md](references/auth-in-e2e.md)

## Parallelization and CI

**Requirements for safe parallel:**
- ✅ Tests don't share state
- ✅ Unique test data per test
- ✅ Database/external services support concurrency

แบ่ง E2E ใน CI เป็น 3 รอบ คือ smoke ทุก PR ที่ล้มแล้วบล็อกการ merge → full ทุกคืนแบบข้าม browser → pre-prod ก่อน deploy ที่ต้องผ่าน P0 และ P1 เมื่อเทสต์ล้มต้องเก็บ screenshot · video · trace · console log · network log ไว้เสมอ ส่วนระดับการรันขนานและรายละเอียดของแต่ละรอบอยู่ใน [references/ci-and-parallel.md](references/ci-and-parallel.md)

## Anti-patterns

- ❌ **Testing implementation details** — selectors based on internal structure
- ❌ **Long monolithic tests** — one test with 50 steps is hard to debug
- ❌ **Coupled tests** — Test B depends on Test A having run
- ❌ **Hidden state** — tests behave differently depending on order or data
- ❌ **Manual cleanup** — relying on people to reset the environment
- ❌ **No quarantine** — failing tests get merged anyway because "it's flaky"
- ❌ **Mocking everything** — at this layer, use the real integrations, or it's not E2E

## Quality Targets (from qa-tester agent)

- Critical path coverage: 100%
- Test runtime: ≤ 10 min for smoke, ≤ 30 min for full
- Flakiness rate: < 2%
- Pass rate in main: > 95%
- Mean time to fix flake: < 2 days

ตารางเทียบคำสั่งที่ใช้บ่อยของ Playwright กับ Cypress (Library Quick Reference) อยู่ใน [references/coverage-and-libraries.md](references/coverage-and-libraries.md)
