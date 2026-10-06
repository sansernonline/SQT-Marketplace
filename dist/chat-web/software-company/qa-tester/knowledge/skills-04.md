# skill: e2e-testing-patterns

Use when designing end-to-end tests (Playwright, Cypress), structuring suites, fixing flaky tests or running E2E in CI. To give an agent a way to run and check the app itself, use app-verifier-setup.

> **ใน A-Team:** ให้ agent รันแอปและพิสูจน์ผลเองใช้ [`app-verifier-setup`](../app-verifier-setup/SKILL.md) · skill นี้คือหลักออกแบบชุดทดสอบ E2E (end-to-end) ที่ verifier นั้นเรียกใช้

# End-to-End Testing Patterns

## When to use this skill

- Setting up E2E testing in a new project
- Choosing between Playwright, Cypress, Selenium
- Structuring a growing E2E test suite
- Fighting flaky tests
- Designing test data strategy
- Adding E2E to CI/CD pipeline
- Migrating from one framework to another

---

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

> 🚨 **Anti-pattern: Ice cream cone** (many E2E, few units)
> Means: slow CI, flaky tests, slow debugging

---

## Framework Selection (2026)

| Framework | Best for | Avoid for |
|-----------|----------|-----------|
| **Playwright** ⭐ | Modern apps, cross-browser, parallel | Legacy apps with weird patterns |
| **Cypress** | DX, learning curve, single-app | Multi-tab, cross-origin tests |
| **Selenium** | Legacy, language flexibility | Greenfield projects |
| **Puppeteer** | Chrome-only, scraping | Cross-browser needs |
| **WebDriverIO** | Mobile + web, BDD style | Simple use cases |

> 💡 **Default recommendation: Playwright** — best DX, fast, cross-browser, official from Microsoft

---

## Test Structure: Page Object Model (POM)

### ❌ Bad (no abstraction)
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

test('user can update profile', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');  // ← duplicated
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await page.goto('/profile');
  // ...
});
```

### ✅ Good (Page Object)
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test('user can login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('user@example.com', 'pass123');
  await expect(page).toHaveURL('/dashboard');
});
```

> 💡 **One Page Object per page or major component.**

---

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

---

## Test Data Strategy

### Option 1: Shared test DB (popular, problematic)
```
❌ All tests share same data
❌ Order-dependent
❌ Hard to parallelize
❌ Pollution between tests
```

### Option 2: Per-test setup (slow)
```
🟡 Clean slate every test
🟡 Reliable but slow
✅ Good for critical flows
```

### Option 3: API setup, UI verification (best)
```typescript
// ✅ Setup via API (fast), verify via UI (real test)
test('user sees orders', async ({ page, request }) => {
  // Setup via API — fast, reliable
  const user = await api.createUser();
  await api.createOrder(user.id, { items: [...] });

  // Test the actual UI flow
  await page.goto('/orders');
  await expect(page.getByText('Order #123')).toBeVisible();
});
```

### Option 4: Database snapshot + rollback
```
✅ Real production-like data
✅ Fast (uses snapshots)
🟡 Requires DB tooling
```

---

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

---

## Critical Path Coverage Matrix

```markdown
| User Journey | Coverage | Priority |
|--------------|:--------:|:--------:|
| Signup → first action | ✅ | 🔴 P0 |
| Login → main task | ✅ | 🔴 P0 |
| Add to cart → checkout → success | ✅ | 🔴 P0 |
| Search → filter → result | ✅ | 🟡 P1 |
| Settings → save | ✅ | 🟡 P1 |
| Admin panel CRUD | ✅ | 🟡 P1 |
| Password reset | ✅ | 🟢 P2 |
| Profile edit | 🟡 Sample | 🟢 P2 |
```

---

## Fighting Flaky Tests

### Top causes of flakiness

| Cause | Fix |
|-------|-----|
| Hard-coded sleeps | Use auto-waiting (Playwright/Cypress have this) |
| Animation timing | Wait for animation to complete OR disable in tests |
| Network race conditions | `page.waitForResponse(url)` before assertion |
| Test data leak | Use unique data per test (timestamp/UUID) |
| Order dependency | Each test fully isolated, parallelizable |
| Auth race condition | Pre-authenticate via API, inject session |
| Element not stable | `expect(el).toBeVisible()` before interacting |

### ❌ Bad (sleep hack)
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // ← flaky
await expect(page.getByText('Success')).toBeVisible();
```

### ✅ Good (event-based wait)
```typescript
const responsePromise = page.waitForResponse('/api/submit');
await page.click('#submit');
await responsePromise; // ← deterministic
await expect(page.getByText('Success')).toBeVisible();
```

### Retry strategy
- **In CI:** auto-retry failed tests 1-2 times
- **Track flakiness:** flag tests failing > 5% as quarantine candidates
- **Don't accept flaky:** investigate or delete, don't ignore

---

## Authentication in E2E

### ❌ Bad: log in via UI every test
```
Slow, brittle, duplicate code
```

### ✅ Good: log in once, share state
```typescript
// playwright.config.ts
{
  use: { storageState: 'auth.json' },
  globalSetup: 'global-setup.ts',  // logs in once, saves cookies
}
```

### ✅ Better: API login + cookie injection
```typescript
async function login(page, user) {
  const response = await page.request.post('/api/login', { data: user });
  const cookies = await response.headers();
  await page.context().addCookies([...]);
}
```

---

## Parallelization

| Level | Speedup | Complexity |
|-------|--------:|:----------:|
| File-level parallel | 4-8x | 🟢 Low (just enable) |
| Test-level within file | 10x+ | 🟡 Med (isolation needed) |
| Sharded across CI workers | Nx | 🟡 Med (requires sharding config) |
| Cloud grid (BrowserStack, etc.) | Massive | 🔴 High (cost) |

**Requirements for safe parallel:**
- ✅ Tests don't share state
- ✅ Unique test data per test
- ✅ Database/external services support concurrency

---

## CI Integration

### Run E2E tier
```yaml
# Smoke (every PR, 2 min)
- 5-10 critical tests
- Fail = block merge

# Full (nightly, 30 min)
- All E2E tests
- Cross-browser
- Failures investigated next day

# Pre-prod (before deploy, 10 min)
- P0 + P1 tests
- Must pass before prod deploy
```

### Artifacts to capture
- ✅ Screenshots on failure
- ✅ Video on failure
- ✅ Trace files (Playwright)
- ✅ Console logs
- ✅ Network logs

---

## Anti-patterns

- ❌ **Testing implementation details** — selectors based on internal structure
- ❌ **Long monolithic tests** — one test, 50 steps, hard to debug
- ❌ **Coupled tests** — Test B depends on Test A having run
- ❌ **Hidden state** — tests behave differently based on order/data
- ❌ **Manual cleanup** — relying on humans to reset env
- ❌ **No quarantine** — failing tests merged anyway "it's flaky"
- ❌ **Mocking everything** — at this layer, integrate or it's not E2E

---

## Quality Targets (from qa-tester agent)

- Critical path coverage: 100%
- Test runtime: ≤ 10 min for smoke, ≤ 30 min for full
- Flakiness rate: < 2%
- Pass rate in main: > 95%
- Mean time to fix flake: < 2 days

---

## Library Quick Reference

| Need | Playwright | Cypress |
|------|-----------|---------|
| Visit page | `page.goto(url)` | `cy.visit(url)` |
| Click | `page.click(sel)` | `cy.get(sel).click()` |
| Type | `page.fill(sel, text)` | `cy.get(sel).type(text)` |
| Assert text | `expect(page.getByText(...))` | `cy.contains(...)` |
| Wait for response | `page.waitForResponse(...)` | `cy.intercept(...).as(...)` |
| Screenshot | `page.screenshot()` | `cy.screenshot()` |


---

# skill: spell-out-abbreviations

Use in every piece of writing for a person (docs, comments, commits, replies, UI text, diagram labels). Spell out each abbreviation the first time, e.g. Model Context Protocol (MCP), and gloss specialist terms.

# Spell Out Abbreviations

> **กฎที่หนึ่ง:** ตัวย่อทุกตัว เขียนเต็มครั้งแรก แล้ววงเล็บตัวย่อไว้ — หลังจากนั้นใช้ตัวย่อได้
> **กฎที่สอง:** ศัพท์เฉพาะทุกคำ วงเล็บคำอธิบายสั้น ๆ ไว้ครั้งแรก — ผู้อ่านนอกสายต้องไม่ต้องเดา

## รูปแบบ

```
✅ Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
❌ MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **ครั้งแรกของแต่ละเอกสาร** เขียนเต็ม + วงเล็บ · ครั้งต่อไปใช้ตัวย่อล้วน
- เอกสารยาวที่แบ่งบท ให้เขียนเต็มใหม่**ครั้งแรกของแต่ละบท** เพราะคนมักอ่านทีละบท
- ตารางหรือหัวข้อที่ที่ไม่พอ ให้เขียนเต็มในบรรทัดแรกของส่วนนั้นแทน
- เอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป ต้องมี **อภิธานศัพท์ (glossary)** ท้ายเอกสาร

## ยกเว้น — ไม่ต้องขยาย

คำที่คนทั่วไปรู้จักมากกว่าชื่อเต็ม: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
และนามสกุลไฟล์ (`.docx`, `.pptx`) · ถ้าไม่แน่ใจ **ให้ขยาย** เสียเปล่าดีกว่าคนอ่านไม่รู้เรื่อง

## ศัพท์เฉพาะ — วงเล็บคำอธิบาย ไม่ใช่แค่ตัวย่อ

ตัวย่อขยายแล้วยังไม่พอ ถ้าชื่อเต็มก็ยังไม่บอกอะไร **คำที่ผู้อ่านนอกสายไม่รู้จัก
ต้องมีคำอธิบายสั้นในวงเล็บครั้งแรก**

```
❌ ใช้ idempotency key กันงานซ้ำ
✅ ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

❌ ต้องทำ expand-contract ตอน migrate
✅ ต้องทำ expand-contract (ทยอยเพิ่มของใหม่ก่อน ค่อยลบของเก่าทีหลัง) ตอนเปลี่ยนโครงฐานข้อมูล
```

**คำอธิบายต้องสั้นกว่าหนึ่งบรรทัด** ยาวกว่านั้นแปลว่าควรแยกเป็นประโยคของตัวเอง

**วัดว่าคำไหนต้องอธิบาย** ด้วยคำถามเดียว — คนที่ทำงานคนละสายกับเรื่องนี้
อ่านแล้วเดาความหมายได้ไหม เดาไม่ได้คือต้องอธิบาย

| ระดับผู้อ่าน | อธิบายแค่ไหน |
|---|---|
| ลูกค้า ผู้บริหาร คนนอกสาย | ศัพท์เทคนิคทุกคำ แม้แต่คำที่ช่างใช้กันทุกวัน |
| ทีมพัฒนาแต่คนละส่วน | เฉพาะคำเฉพาะของส่วนนั้น เช่น ชื่อรูปแบบ ชื่อกระบวนการ |
| คนที่ทำเรื่องนี้อยู่แล้ว | เฉพาะคำที่เพิ่งตั้งขึ้นใหม่ในโปรเจกต์นี้ |

---

## ใช้กับอะไรบ้าง

เอกสารทุกชนิด · คอมเมนต์ในโค้ด · ข้อความ commit · ข้อความบนหน้าจอ · คำอธิบายไดอะแกรม ·
คำตอบในแชต — **ทุกอย่างที่มีคนอ่าน**

## ตัวอย่างที่เจอบ่อย

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Service Level Agreement (SLA) · Role-Based Access Control (RBAC) ·
Software Development Life Cycle (SDLC) · Single Sign-On (SSO) ·
Continuous Integration / Continuous Deployment (CI/CD) ·
Software Requirements Specification (SRS) · Key Performance Indicator (KPI) ·
Personally Identifiable Information (PII) · Proof of Concept (POC) ·
Business Requirements Document (BRD) · Functional Specification Document (FSD) ·
Architecture Decision Record (ADR) · User Interface (UI) · User Experience (UX)

## Anti-patterns

- ❌ ขยายตัวย่อซ้ำทุกครั้งที่โผล่ — รกและกวนสายตา ครั้งแรกพอ
- ❌ วงเล็บกลับด้าน — `MCP (Model Context Protocol)` อ่านสะดุดกว่าเขียนเต็มขึ้นก่อน
- ❌ ขยายผิด — ถ้าไม่รู้ว่าย่อมาจากอะไร ให้ค้นก่อน อย่าเดา
- ❌ ขยายตัวย่อครบแต่ปล่อยศัพท์เฉพาะลอย — `Quadratic Weighted Kappa (QWK)` ยังไม่ช่วยใครถ้าไม่บอกว่ามันวัดอะไร
- ❌ อธิบายยาวเป็นย่อหน้าในวงเล็บ — วงเล็บไว้ให้คำสั้น ๆ ถ้ายาวให้แยกประโยค


---

# skill: answer-shape

Use when an answer has structure (comparing options, trade-offs, how parts connect, several numbers). Decides prose, table, small diagram or short list, and keeps it readable.

# รูปทรงของคำตอบ

> **กฎข้อเดียว:** เนื้อหามีโครงสร้างอะไร คำตอบใช้รูปทรงนั้น
> เปรียบเทียบ → ตาราง · เชื่อมโยง → รูป · เรื่องเดียว → ประโยค

---

## เลือกรูปทรงจากสัญญาณในคำถาม

| สัญญาณ | รูปทรง |
|---|---|
| "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" | **ตารางเปรียบเทียบ** |
| "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" | **รูป** |
| "มีอะไรบ้าง" ที่ไม่ได้เทียบกัน | **รายการหัวข้อย่อย** |
| "ทำไม" · "แปลว่าอะไร" · เรื่องเดียวไม่มีแขนง | **ประโยคธรรมดา** |
| ตัวเลขหลายตัวที่ต้องดูพร้อมกัน | **ตาราง** |
| ขั้นตอนที่ต้องทำเรียงกัน | **รายการมีเลข** |

**สัญญาณสำคัญที่สุดคือมี "สิ่งที่ถูกเทียบ" ตั้งแต่สองตัวขึ้นไป** — มีเมื่อไหร่ใช้ตาราง
เขียนเป็นย่อหน้าแล้วผู้อ่านต้องจำของตัวแรกไว้ในหัวระหว่างอ่านตัวที่สอง

---

## ตารางที่อ่านง่าย

- **คอลัมน์แรกคือสิ่งที่ถูกเทียบ** คอลัมน์ถัดไปคือแง่มุมที่เทียบ
- **3–5 คอลัมน์** เกินนี้อ่านไม่ทัน · แถวไม่เกิน 8 แถวในคำตอบแชต
- **ทุกช่องต้องมีเนื้อ** — ช่องว่างแปลว่าคอลัมน์นั้นไม่ควรมี หรือข้อมูลยังไม่ครบ ให้เขียนว่า "ไม่มี" ตรง ๆ
- **ช่องละไม่เกินหนึ่งบรรทัด** ยาวกว่านั้นยกออกไปเป็นข้อความใต้ตาราง
- **เรียงแถวตามน้ำหนัก** ตัวที่แนะนำหรือตัวที่ใช้บ่อยที่สุดอยู่บนสุด ไม่ใช่เรียงตามตัวอักษร
- **หัวคอลัมน์เป็นคำถามที่ผู้อ่านมีในหัว** ไม่ใช่ชื่อสาขาวิชา

```
❌ | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
✅ | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

**ปิดท้ายตารางด้วยข้อสรุปหนึ่งบรรทัดเสมอ** — ตารางบอกข้อมูล ไม่ได้บอกว่าควรเลือกอะไร

---

## เมื่อไหร่รูปชนะตาราง

ใช้รูปเมื่อ**ความสัมพันธ์คือคำตอบ** — ตารางบอกคุณสมบัติได้ แต่บอกไม่ได้ว่าอะไรต่อกับอะไร

| ใช้รูป | ใช้ตาราง |
|---|---|
| อะไรต่อกับอะไร · อะไรอยู่ในอะไร | ตัวไหนดีกว่าตัวไหนในแง่ใด |
| ลำดับที่มีทางแยกหรือวนกลับ | ขั้นตอนเรียงตรงไม่มีแขนง (ใช้รายการมีเลขพอ) |
| สิ่งเดียวกันในหลายสถานะ | สิ่งต่างกันในแง่มุมเดียวกัน |

ในแชต **รูปเล็ก ๆ แบบ ASCII หรือ Mermaid สั้น ๆ ก็พอ** — ไม่ต้องเปิดเครื่องมือวาด

```
กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน
                    │
                    └──▶ ที่เก็บถาวร
```

รูปที่ต้องเป็นไฟล์จริงเพื่อใส่เอกสารหรือสไลด์ ไปที่ `software-diagrams` หรือ `svg-diagram-system`

---

## เมื่อไหร่ประโยคชนะทั้งคู่

- คำตอบสั้นกว่าสามบรรทัด — ตารางสองแถวคือการตกแต่ง ไม่ใช่การอธิบาย
- คำถามที่ตอบว่า "ใช่" หรือ "ไม่ใช่" แล้วตามด้วยเหตุผลหนึ่งประโยค
- เรื่องที่**เหตุผลสำคัญกว่าตัวเลือก** — ตารางจะตัดเหตุผลทิ้งเพื่อให้พอดีช่อง

> ตารางที่มีแถวเดียวหรือสองแถวสั้น ๆ แปลว่าใช้ผิดรูปทรง

---

## ความยาวของคำตอบ

- **คำตอบอยู่บรรทัดแรก** เหตุผลตามหลัง — ไม่ใช่ไล่เหตุผลมาก่อนแล้วค่อยเฉลย
- ไม่ต้องทวนคำถาม ไม่ต้องเกริ่น ไม่ต้องสรุปซ้ำตอนจบ
- **สิ่งที่ยังไม่ได้ทำหรือยังไม่แน่ใจ ต้องบอก** แม้จะทำให้คำตอบยาวขึ้น
- คำตอบยาวเกินหน้าจอ ให้ถามก่อนว่าต้องการละเอียดแค่ไหน แทนที่จะเทให้หมด

---

## ตัดกลิ่น AI

อ่านทวนก่อนส่งทุกคำตอบและเอกสาร — เจอแบบไหนแก้ทันที

| เจอ | แก้เป็น |
|---|---|
| เปิดด้วย "แน่นอน" · "คำถามดีมาก" · ทวนคำถาม | ขึ้นต้นด้วยคำตอบ |
| ปิดด้วย "หวังว่าจะช่วยได้" · "ถ้ามีอะไรถามได้" | ตัดทิ้ง หรือเสนอขั้นต่อไปที่มีจริงหนึ่งข้อ |
| คำขยายใหญ่โต — สำคัญมาก · ครอบคลุม · ทรงพลัง · ไร้รอยต่อ | ตัด หรือแทนด้วยตัวเลขหรือข้อเท็จจริง |
| "ไม่ใช่แค่ X แต่ยัง Y" · ไล่สามคำเพื่อจังหวะ | พูดตรง ๆ ทีละเรื่อง |
| "หลาย" · "บางส่วน" · "ค่อนข้าง" ทั้งที่รู้ตัวเลข | ใส่ตัวเลข |
| ออกตัวซ้อนกันหลายชั้น — อาจจะ · น่าจะ · ในบางกรณี | ออกตัวครั้งเดียวที่จุดที่ไม่แน่ใจจริง พร้อมป้าย `อนุมาน` หรือ `เดา` |
| หัวข้อและ bullet ในคำตอบสั้น | ประโยคธรรมดา |
| ประโยคยาวหลายความคิด | หนึ่งประโยค หนึ่งความคิด |

**ผู้ใช้บอก "งง" · "พูดง่าย ๆ" · "แปลเป็นภาษาคน"** → เขียนคำตอบล่าสุดใหม่ สั้นลงครึ่งหนึ่ง ไม่มีศัพท์เทคนิคที่ไม่ได้อธิบาย ไม่เพิ่มเนื้อหาใหม่

---

## Anti-patterns

- ❌ **ย่อหน้ายาวเปรียบเทียบสามตัวเลือก** — ผู้อ่านต้องจำตัวแรกไว้จนจบ
- ❌ **ตารางที่มีช่องว่าง** หรือช่องที่เขียนว่า "ขึ้นอยู่กับ" ทุกช่อง
- ❌ **ตารางสองแถวเพื่อให้ดูเป็นระเบียบ**
- ❌ **รูปที่วาดสิ่งที่ประโยคเดียวบอกได้**
- ❌ **ตารางที่ไม่มีข้อสรุป** — ทิ้งให้ผู้อ่านตัดสินใจเองทั้งที่เขาถามเพราะอยากได้คำแนะนำ
- ❌ **เรียงแถวตามตัวอักษร** ทั้งที่มีตัวที่แนะนำชัดเจน
- ❌ **หัวคอลัมน์เป็นศัพท์วิชาการ** ทั้งที่เขียนเป็นคำถามธรรมดาได้

---

## เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ถ้อยคำในคำตอบ — ตัวย่อและศัพท์เฉพาะ | `spell-out-abbreviations` |
| รูปที่ต้องเป็นไฟล์จริง | `software-diagrams` · `svg-diagram-system` |
| ภาพในเอกสาร markdown | `markdown-visuals` |
| ตัดเนื้อหาให้เหลือเท่าที่จำเป็น | `simplicity-first` |

---

## ตัวย่อ

- **ASCII** — American Standard Code for Information Interchange (การวาดรูปด้วยตัวอักษรธรรมดา)
- **Mermaid** — ภาษาเขียนไดอะแกรมเป็นข้อความ แล้วให้โปรแกรมวาดให้

---

**ถ้าสิ่งที่จะพูดคือของที่เจอระหว่างทำงาน แล้วต้องให้ผู้ใช้ตัดสินใจก่อนไปต่อ** →
`flag-and-propose` (เปิดด้วยผลกระทบ · ตารางเทียบ · ข้อเสนอ · ปิดด้วยคำถามเดียว)


---

# skill: temp-file-discipline

Use on every task that writes files into a project folder. Sends temporary files (archives, extracts, previews, backups, one-off scripts) to one _to_delete/ folder at the root. Load before the first file is written.

# ระเบียบไฟล์ชั่วคราว

> **กฎข้อเดียว:** อะไรที่ไม่ใช่ผลงานจริง ต้องอยู่ใน `_to_delete/` เท่านั้น
> ห้ามวางไว้ที่รากโปรเจกต์ ห้ามวางปนกับไฟล์งาน

---

## เลือกที่วาง

| ไฟล์นั้นคืออะไร | วางที่ |
|---|---|
| ของชั่วคราวของงานในโปรเจกต์ผู้ใช้ (ภาพตรวจ · log · สคริปต์ครั้งเดียว · ผลรัน) | `_to_delete/` ที่รากโปรเจกต์ — ผู้ใช้ตรวจย้อนได้ |
| ขั้นกลางที่ไม่ผูกกับโปรเจกต์ใด (ไม่ได้ทำงานในโฟลเดอร์ผู้ใช้) | พื้นที่ทำงานของเซสชัน |
| ผลงานที่ผู้ใช้จะเก็บไว้ | โฟลเดอร์ปลายทางของงานนั้น |

**รากโปรเจกต์ต้องไม่มีไฟล์ชั่วคราวเลย** — ไฟล์ชั่วคราวที่ agent สร้างแล้วไปตกที่ราก (log · ภาพ · สคริปต์ลอง) ย้ายเข้า `_to_delete/` ทันที ·
ไฟล์ที่ไม่แน่ใจว่าผู้ใช้สร้างหรือใช้อยู่ ไม่ย้ายเอง ให้บอกผู้ใช้ ·
คำสั่งที่รันจากในโฟลเดอร์โค้ด (`<project-name>/` ดู `project-bootstrap`) ต้องเขียนของชั่วคราวไปที่ `_to_delete/` ของ**รากโปรเจกต์** ไม่สร้าง `_to_delete/` ซ้อนในโฟลเดอร์โค้ด

---

## อะไรคือไฟล์ชั่วคราว

- ไฟล์บีบอัดที่ส่งผ่านแชทเพื่อเอาไฟล์ลงเครื่อง และโฟลเดอร์ที่แตกออกมา
- ภาพที่เรนเดอร์ไว้ตรวจงาน · ภาพหน้าจอ · ไฟล์ตัวอย่างที่ทำไว้เทียบ
- สำเนาสำรองของไฟล์ที่กำลังแก้ · ไฟล์ `.bak` `.old` `.tmp` `ไฟล์ (1).xlsx`
- สคริปต์ที่เขียนขึ้นใช้ครั้งเดียว · ไฟล์ log จากการรันครั้งเดียว
- ไฟล์รูปแบบกลางระหว่างแปลง เช่น `.svg` ที่แปลงต่อเป็น `.png` แล้ว
- **เอกสารที่แปลงรูปแบบมาเพื่อให้อ่านหรือประมวลผลง่าย** — `.docx` หรือ `.pdf` ที่แปลงเป็น `.md`
  ต้นฉบับคือของจริง ตัวที่แปลงคือของชั่วคราว · **ห้ามวางปนกันในโฟลเดอร์เอกสาร**
  ไม่งั้นอีกสามเดือนไม่มีใครรู้ว่าไฟล์ไหนคือฉบับที่ลูกค้าเซ็นรับ
- เวอร์ชันเก่าของไฟล์ที่เพิ่งแทนที่ไป

**ไฟล์ที่เลิกใช้แล้วก็คือไฟล์ชั่วคราว** — แทนที่ไฟล์เก่าด้วยของใหม่ ให้ย้ายตัวเก่าเข้า `_to_delete/`
ไม่ใช่ทิ้งไว้ข้าง ๆ กัน

---

## อะไรไม่ใช่

- ผลงานที่ผู้ใช้ขอ
- ไฟล์ต้นทางของผลงาน เช่น `.py` ที่ผลิตรูป หรือ `.html` ที่เป็นแหล่งที่มาของภาพ —
  **ปีหน้าต้องแก้ ต้องมีไฟล์ต้นทาง** เก็บไว้ในโฟลเดอร์ย่อยข้างผลงาน ไม่ใช่ `_to_delete/`
- ไฟล์ที่ผู้ใช้วางไว้เอง แม้จะดูเหมือนขยะ — **ห้ามย้ายของผู้ใช้โดยไม่ถาม**
- output ของเครื่องมือ build (`build/` · `.dart_tool/` · `node_modules/` · `bin/` `obj/`) — ปล่อยไว้ที่เครื่องมือวาง ตรวจว่าอยู่ใน `.gitignore` · ห้ามย้ายเข้า `_to_delete/`

---

## วิธีใช้

```
โปรเจกต์/
├── ผลงานจริง
└── _to_delete/
    ├── transfer.zip
    └── render-check/
```

- โฟลเดอร์เดียวที่**รากของโปรเจกต์** ไม่ต้องแตกย่อยตามวันที่ นอกจากของเยอะจริง
- โฟลเดอร์ย่อยมาตรฐานที่ skill อื่นใช้ — ใช้ชื่อเดียวกันนี้เท่านั้น:

  | โฟลเดอร์ย่อย | ใส่อะไร | skill ที่ใช้ |
  |---|---|---|
  | `verify-runs/` | ภาพหน้าจอและผลรันของแอปจริงตอนตรวจ (หลักฐาน verify) | `app-verifier-setup` · `spec-to-code-loop` |
  | `screenshots/` | ภาพเรนเดอร์ของดีไซน์หรือ mockup | `mobile-app-design` · `web-app-design` · `windows-app-design` |
  | `security/` | ผลสแกนดิบ | `security-gate` |
  | `logs/` | log จากการรันครั้งเดียว | ทุกตัว |
  | `check/` | ชื่อเดิมของ `spec-to-code-loop` สำหรับภาพตรวจ — งานใหม่ใช้ `verify-runs/` แทน | `spec-to-code-loop` |
- ใส่ `_to_delete/` ลงใน `.gitignore` ทุกโปรเจกต์ที่ใช้ git — ตรวจก่อน ถ้ายังไม่มีให้เพิ่ม
- โปรเจกต์ที่มีชื่อโฟลเดอร์ชั่วคราวอยู่แล้ว (`tmp/` `scratch/` `.cache/`) ใช้ของเดิม อย่าสร้างซ้ำ

---

## ตอนจบงาน

1. **บอกว่ามีอะไรค้างอยู่ใน `_to_delete/`** เป็นบรรทัดเดียว ไม่ต้องลงรายการยาว
2. **ห้ามลบเอง** — ลบเมื่อผู้ใช้สั่งเท่านั้น การลบในโฟลเดอร์ผู้ใช้กู้คืนไม่ได้
3. ลบไม่ได้เพราะไม่มีสิทธิ์ ก็ให้ย้ายเข้า `_to_delete/` แล้วบอกผู้ใช้ — อย่าทิ้งไว้ที่เดิม

---

## Anti-patterns

- ❌ **แตกไฟล์ zip ลงรากโปรเจกต์** แล้วค่อยเก็บกวาดทีหลัง — ทีหลังไม่เคยมาถึง
- ❌ **ตั้งชื่อ `ไฟล์-v2` `ไฟล์-final` `ไฟล์-ใหม่จริง`** วางไว้ข้างของเดิม
- ❌ **ลบไฟล์ผู้ใช้เพราะคิดว่าไม่ใช้แล้ว**
- ❌ **ทิ้งไฟล์ชั่วคราวของงานในโปรเจกต์ไว้ในพื้นที่เซสชัน** — เซสชันจบแล้วผู้ใช้ตรวจย้อนไม่ได้
- ❌ **ตั้งโฟลเดอร์ย่อยชื่อใหม่ให้ของเดิม** (`shots/` `img-check/`) — ใช้ชื่อในตารางข้างบน
- ❌ **เก็บไฟล์ต้นทางของผลงานไว้ใน `_to_delete/`** — นั่นไม่ใช่ของชั่วคราว
- ❌ **ทิ้งไฟล์ค้างโดยไม่บอก** — ผู้ใช้จะมาเจอเองอีกหลายเดือนถัดไป

---

## ตัวย่อ

- **zip** — ไฟล์บีบอัดรูปแบบ ZIP
- **git** — ระบบควบคุมเวอร์ชัน Git
