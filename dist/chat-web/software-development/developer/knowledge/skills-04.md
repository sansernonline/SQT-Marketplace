# skill: stack-mql

Use when writing MQL4 or MQL5 code for MetaTrader

# stack · MQL — an Expert Advisor (EA) that sends orders correctly, on every broker, every time

> **One rule:** every order goes through the pre-send checker and every returned result is read · an EA that "works in the tester" but does not check is not done.

For EAs · indicators · scripts on MetaTrader 4 (MT4) and MetaTrader 5 (MT5) · strategy, risk and backtest criteria live in the project's trading spec (if using the repo's prompt set: `prompt/software-development/prompt-trading-system.md` — someone who installed only the plugin will not have this file; ask the owner for the spec) · general principles are in `lazy-coding` · `readable-code` · `testing-standards` · `logging-standards` · `error-handling-patterns`

## 1 · Start: know which platform you are writing for

- `.mq4` file = MQL4 (MT4) · `.mq5` = MQL5 (MT5) · `.mqh` = an include that can be shared if the differing parts are separated behind `#ifdef __MQL5__`
- In MQL4 put `#property strict` in every file (without it the compiler lets data-type bugs through)
- Compiling and testing need a terminal (Windows, or the Wine build MetaQuotes distributes for macOS / Linux) · on a machine without one → write in the report "ยังไม่ได้ compile" (not yet compiled); never say it passed

| Step | MT5 | MT4 |
|---|---|---|
| compile | `metaeditor64.exe /compile:"MQL5\Experts\X.mq5" /log` | `metaeditor.exe /compile:"MQL4\Experts\X.mq4" /log` |
| compile result | a `.log` file next to the source file · 0 errors 0 warnings | same |
| backtest from the command line | `terminal64.exe /config:"tester.ini"` (section `[Tester]`: `Expert` · `Symbol` · `Period` · `FromDate` · `ToDate` · `Model` · `Report` · `ShutdownTerminal=1`) | `terminal.exe` + an MT4-style config file (fewer options) |

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/start_advanced/start · re-check this page before use

## 2 · Differences that break a port between MT4 and MT5

| Topic | MT4 | MT5 |
|---|---|---|
| order model | an order = a position (`OrderSend` · `OrderSelect` · `OrdersTotal`) | order · position · deal are separate · use `CTrade` (`Trade\Trade.mqh`) |
| account | always hedging | netting or hedging → read `ACCOUNT_MARGIN_MODE` · netting allows 1 position per symbol |
| order filling | no choice | FOK / IOC read from the flags in `SYMBOL_FILLING_MODE` (Market / Exchange Execution) · RETURN works in every mode except Market Execution · pending orders use RETURN |
| indicator | returns the value at once (`iMA(...)`) | create the handle once in `OnInit`, then `CopyBuffer` · release it in `OnDeinit` |
| order send result | `GetLastError()` (130 invalid stops · 134 not enough money · 138 requote · 146 trade context busy) | `MqlTradeResult.retcode` (10009 done · 10008 placed (pending order) · 10010 done partial = success · 10004 requote · 10014 invalid volume · 10015 invalid price · 10016 invalid stops · 10018 market closed · 10019 not enough money · 10030 invalid filling) |
| order events | none; you must poll | `OnTradeTransaction` |

## 3 · The pre-send order checker (every order, every time)

| Check | Do this | What you hit if you skip it |
|---|---|---|
| volume | round down to `SYMBOL_VOLUME_STEP` · between `SYMBOL_VOLUME_MIN` and `SYMBOL_VOLUME_MAX` | 10014 · error 131 |
| price | `NormalizeDouble(price, _Digits)` | 10015 |
| Stop Loss (SL) / Take Profit (TP) | at least `SYMBOL_TRADE_STOPS_LEVEL` × `_Point` away from the current price | 10016 · error 130 |
| modifying an order | do not modify when the price is within `SYMBOL_TRADE_FREEZE_LEVEL` · do not resend the same values | rejected · 10025 no changes |
| margin | `OrderCalcMargin` (MT5) · `AccountFreeMarginCheck` (MT4) before sending | 10019 · error 134 |
| order count | less than `ACCOUNT_LIMIT_ORDERS` (0 = unlimited) | rejected |
| symbol | `SYMBOL_TRADE_MODE` is not disabled · market is open | 10018 |
| MT5 whole set | `OrderCheck()` before `OrderSend()` | an error that cannot tell which item is wrong |

- Read every returned result · requote / off quotes → retry at most 3 times, with a new price each time · not enough money / invalid stops → do not retry; log and stop that trade.
- pip and point are not equal: a 5-digit price (or 3-digit for JPY pairs) → 1 pip = 10 points · if the user enters input in pips, convert at a single place.
- **Traps where the code looks right but really breaks** (adapted from ThomasPraun/mql-developer · MIT): `double` cannot be compared with `==`; `NormalizeDouble` both sides or compare against a tolerance · in MT4, closing several orders must loop from `OrdersTotal()-1` down to 0 because the index shifts after a close · some ECN brokers do not accept SL/TP in `OrderSend`, so send first and then `OrderModify` · `WebRequest` blocks until it gets a reply and cannot be used in indicators and the tester · one MT4 terminal can trade with only one EA at a time (error 146); wait and retry, do not resend at once · a series array has index 0 = the latest bar; always mark with `ArraySetAsSeries`, never guess the direction.

Sample code for each checker item → https://www.mql5.com/en/articles/23204 (read it and write your own; do not copy the whole file)

## 4 · An EA structure that is easy to read and recoverable

- `OnInit` validates every input (wrong value → `INIT_PARAMETERS_INCORRECT`) · create handles · `OnDeinit` releases the handles.
- Do heavy logic once per new bar (compare `iTime(_Symbol, _Period, 0)` with a remembered value), not on every tick.
- A magic number per EA + symbol + strategy · count and manage only orders whose magic matches; never touch manual orders or another EA's.
- **Never keep important state only in a variable:** a terminal restart → state is lost · `OnInit` rebuilds state from the positions/orders with a matching magic · values that cannot be rebuilt (such as today's loss total) are stored with `GlobalVariableSet` or a file in `MQL5\Files` / `MQL4\Files`.
- Time: use server time (`TimeCurrent`) to decide bars and sessions · each broker's server time is not Thai time and shifts with daylight saving · in the tester `TimeGMT()` always equals the simulated server time (source: https://www.mql5.com/en/docs/dateandtime/timegmt) → news and session filters based on Greenwich Mean Time (GMT) must take the offset as an input.
- 1 function, 1 job: signal · lot size · sending the order · managing open orders are kept separate · the signal is a pure function that takes bar data and returns a result (testable in a script).
- Log every decision to send or not send an order: server time · symbol · reason · price · spread · returned result · do not log every tick.

## 5 · test

- **script test:** test the signal and lot-size functions with a script that feeds fixed data and compares the result (MQL has no standard test framework).
- **backtest:** MT5 uses the "Every tick based on real ticks" mode for results used to decide · MT4 reports modelling quality every time · spread · commission · swap are set to the real account, not 0.
- **Test under several conditions:** at least 3 symbols with different digits (such as EURUSD · USDJPY · XAUUSD) · at least 2 timeframes · netting and hedging accounts (MT5) · a capital so small the minimum lot cannot be sent.
- **Do not judge from optimized results:** use MT5's forward period or split in-sample / out-of-sample yourself · the reported numbers are the results of the period not used for optimizing.
- `OnTester()` returns the criterion the spec defines (such as profit factor with drawdown under the limit) so the optimizer picks by the real criterion, not maximum profit.

## 6 · Selling on the MQL5 Market

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/market/market_sell · the rules can change; re-check before submitting

- Submit a single compiled file (`.ex5` / `.ex4`) · indicators · sounds · images embedded as resources · **no Dynamic Link Library (DLL)**
- **Do not restrict by account number or account type** · the Market locks machines and the number of activations itself · our license system (item 7) is for self-sale channels only.
- The automatic check runs the EA in the tester on several symbols and timeframes · the EA must really send orders in every one of those conditions (sending none = fail) · having every item of the item 3 checker is what makes it pass.
- Do not promise profit in the description · the product name in Latin letters is at most 50 characters with no version number · state it if it works only with hedging or netting.

## 7 · Security and self-sale

- Trading account passwords · API keys · license keys never go in the code or `.set` · for values that must be kept, use an input the user types on their own machine.
- `WebRequest` works only with URLs the user added to the terminal's own allow list · say in the manual which URLs must be added.
- Self-sale (not through the Market): lock the license with the account number (`ACCOUNT_LOGIN`) + an expiry date, checked in `OnInit` · do not give the customer the `.mq4` / `.mq5` · `.ex4` / `.ex5` files can be partly decompiled, so do not put secret rules only inside the EA.

## 8 · Pre-submit checklist

- [ ] compiles with 0 errors 0 warnings (or the report says it was not compiled because there is no terminal)
- [ ] every order passes the item 3 checker · every returned result is read and logged
- [ ] magic number · state can be rebuilt after a restart · orders with a non-matching magic are untouched
- [ ] every input has a default and a range checked in `OnInit`
- [ ] backtest uses real spread · commission · swap · the reported result comes from a period not used for optimizing
- [ ] tested on at least 3 symbols · 2 timeframes (· netting and hedging for MT5)
- [ ] selling on the Market: no DLL · no account or symbol lock · the description promises no profit

## 9 · Link to other skills

Only a `.ex5` and no `.mq5` (the source is lost, or you want one that trades the same way) → `reverse-engineering`, file `references/mql5-ex5.md`: extract the behavior in the Strategy Tester and rewrite it under the rules of this file · do not decompile.

Backtest formulas and statistics → agent `quant-analyst` · general tests → `testing-standards` · logs → `logging-standards` · secrets → `config-and-secrets` · small checkable steps → `principle-small-verifiable-steps` · selling and pricing → the repo's `prompt/software-development/prompt-sell-product.md` (if using the prompt set)


---

# skill: e2e-testing-patterns

Use when writing end-to-end tests or fixing flaky ones

> **In SuperUser:** to have an agent run the app and prove the result itself, use [`app-verifier-setup`](../app-verifier-setup/SKILL.md). This skill holds the design principles for the E2E (end-to-end) test suite that verifier calls.

# End-to-End Testing Patterns

## When to use this skill

- Setting up E2E testing in a new project
- Choosing between Playwright, Cypress, Selenium
- Structuring a growing E2E test suite
- Fighting flaky tests
- Designing test data strategy
- Adding E2E to a continuous integration and continuous delivery (CI/CD) pipeline
- Migrating from one framework to another

## When NOT to use

| Task | Use instead |
|---|---|
| Writing manual test cases (steps, expected result) | `test-case-template` |
| Unit or integration tests, test ratio and scope | `testing-standards` |

## Read more when

| File | Open when |
|---|---|
| [references/page-object-model.md](references/page-object-model.md) | You are setting up a new suite structure, or you find tests that copy the same login steps. It shows code comparing the bad way with the Page Object way. |
| [references/test-data-strategies.md](references/test-data-strategies.md) | You are choosing how to prepare test data and want the pros and cons of all 4 options with sample code. |
| [references/flaky-tests.md](references/flaky-tests.md) | Tests pass sometimes and fail sometimes. It shows code comparing a sleep wait with an event-based wait. |
| [references/auth-in-e2e.md](references/auth-in-e2e.md) | You are planning how to log in within the suite and need the `storageState` code or cookie injection through the API. |
| [references/ci-and-parallel.md](references/ci-and-parallel.md) | You are setting up parallel runs or splitting E2E run rounds in CI, and need to know which files to keep when a test fails. |
| [references/coverage-and-libraries.md](references/coverage-and-libraries.md) | You are building the user-path coverage table, or translating commands between Playwright and Cypress. |
| [references/oracle-and-mutation.md](references/oracle-and-mutation.md) | You have an old system to compare against (differential) · you will compare page structure with the accessibility tree · you want to know whether the suite really catches bugs (mutation) · or you must record and replay network requests to keep them stable. |

## The Testing Pyramid (Get This Right First)

```
        ▲
       ╱E╲       E2E: ~5% of tests (same pyramid as testing-standards)
      ╱ 2 ╲
     ╱  E  ╲     - Slow, expensive, flaky
    ╱───────╲    - Test critical user journeys ONLY
   ╱  Integ  ╲   Integration: ~20%
  ╱           ╲  - API contracts, DB interactions
 ╱─────────────╲ Unit: ~75%
╱      Unit     ╲ - Fast, deterministic, many
─────────────────
```

> **Anti-pattern: Ice cream cone** (many E2E tests, few unit tests)
> Result: slow CI, flaky tests, slow debugging

## Framework Selection

| Framework | Best for | Avoid for |
|-----------|----------|-----------|
| **Playwright** (recommended) | Modern apps, cross-browser, parallel | Legacy apps with weird patterns |
| **Cypress** | Developer experience, easy to learn, single-app | Multi-tab, cross-origin tests |
| **Selenium** | Legacy, language flexibility | Greenfield projects |
| **Puppeteer** | Chrome-only, scraping | Cross-browser needs |
| **WebDriverIO** | Mobile + web, BDD style | Simple use cases |

> **Default recommendation: Playwright** — best developer experience, fast, cross-browser, made by Microsoft

## Test Structure: Page Object Model (POM)

If every test repeats the same `page.fill` and `page.click` calls for one page, move those steps into that page's class and have the tests call its methods instead. Comparison code is in [references/page-object-model.md](references/page-object-model.md)

> **One Page Object per page or major component.**

## Selectors: Hierarchy of Goodness

```
Most resilient ─────────────────────────► Most brittle

Good:   Role + accessible name   page.getByRole('button', { name: 'Submit' })
Good:   Test IDs                page.getByTestId('submit-btn')
Medium: Visible text            page.getByText('Submit')
Medium: Label                   page.getByLabel('Email')
Bad:    CSS classes             page.locator('.btn-primary')
Bad:    Tag + index             page.locator('button:nth-child(3)')
Bad:    XPath                   page.locator('//div[2]/button')
```

**Rule:** Prefer queries that survive refactoring.

## Test Data Strategy

There are 4 options: shared test DB · per-test setup · API setup with UI verification · database snapshot with rollback.
The recommended one is **Option 3: API setup, UI verification (best)**. Prepare data through the API so it is fast and certain, then test the real UI. A shared test DB makes tests depend on order, makes parallel runs hard and mixes data. The pros and cons of every option are in [references/test-data-strategies.md](references/test-data-strategies.md)

## What to Test E2E (Not Everything!)

### DO test E2E
- Critical user journeys (login → checkout → confirmation)
- Multi-step workflows that span multiple pages
- Integration with external services (payment, email)
- "Smoke tests" that verify deployment works
- Cross-browser specific behavior

### DON'T test E2E
- Every form validation (use unit tests)
- Edge cases of business logic (use unit/integration)
- Every error message (use unit tests)
- Performance (use dedicated tools)
- Visual design (use visual regression tools)

> **Rule of thumb:** If a unit/integration test can verify it, don't add E2E.

Make a Critical Path Coverage Matrix that says whether each path is covered yet and how important it is: P1, P2 or P3 (the same scale as `test-case-template` and the tags below · P1 is most important). An example is in [references/coverage-and-libraries.md](references/coverage-and-libraries.md)

## Expected Values and Failing Tests

For an E2E suite converted from a test plan (`test-case-template`):

- Start each test name with the TC code · tag `@<module>` `@P1|@P2|@P3` · put the expected result and the oracle in an annotation
  `test.info().annotations.push({ type: 'expected', description: '฿760 · [D] BR-03' })`
- Expected values are constants from the plan · never read a value from the screen and assert it back, for example reading the price from the card and comparing it with the total → if both are wrong, the test still passes
- Reset data before every TC (API reset or seed) · lock "today" with `page.clock.setFixedTime()` · `timezoneId` · `locale` in the config
- A TC with **Check when** `หลังรีโหลด` (after reload) → call `page.reload()` and assert again
- Run every browser the plan names · judge pass criteria per browser separately
- When a test fails → never edit the expected value · classify it as `app` / `plan` / `test` per the `qa-tester` agent into `triage.json` · in CI, never retry until green and call it done

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
| Click times out "not visible/stable" but the site works | The tab may be in the background (`document.visibilityState === "hidden"`, common with Playwright MCP sharing one browser). Check with `browser_evaluate`, switch to the tab, then click. Do not retry blindly |

Never use `page.waitForTimeout` for a fixed-time wait. Wait for a real event instead, such as the API response. Comparison code is in [references/flaky-tests.md](references/flaky-tests.md)

### Retry strategy
- **In CI:** retry at most 1 time, **only to collect a trace** (`retries: 1` + `trace: 'on-first-retry'`)
- **Pass on retry = flaky, not a pass** — report it as flaky and fail the run (`failOnFlakyTests: true` in `playwright.config.ts`, Playwright 1.52+) — the same rule as "Expected Values and Failing Tests" above and `testing-standards` (flaky test: fix or delete, never retry until green)
- **Track flakiness:** a test that fails > 5% of runs is a candidate for quarantine (pulled out of the blocking run)
- **Quarantine has an expiry date** (idea from ECC e2e-testing): tag the test `@flaky` with an issue link and a date (`test('checkout total @flaky', { annotation: { type: 'quarantine', description: 'until 2026-11-15 · issue #123' } }, ...)`), run the `@flaky` set as a separate non-blocking job so the signal is not lost, and have CI fail when today is past the date — the test is then fixed or deleted, never extended twice
- **Don't accept flaky tests:** investigate or delete them. Don't ignore them

## Authentication in E2E

Do not log in through the UI in every test, because it is slow, brittle and repeats code. Log in once and share the state (`storageState`), or better, log in through the API and inject the cookie into the browser context. Code for all three ways is in [references/auth-in-e2e.md](references/auth-in-e2e.md)

## Parallelization and CI

The requirements for safe parallel runs are in [references/ci-and-parallel.md](references/ci-and-parallel.md)

Split E2E in CI into 3 rounds. First, smoke on every pull request (PR) on Chromium only; a failure blocks the merge. Second, full on merge into main and every night, on Chromium + WebKit (iPhone screen). Third, pre-prod before deploy, which must pass P1 and P2 on all 3 browsers (adding Firefox). When a test fails, always keep the screenshot · video · trace · console log · network log. The parallel level, the browser table for each round and the details of each round are in [references/ci-and-parallel.md](references/ci-and-parallel.md)

## Anti-patterns

- **Testing implementation details** — selectors based on internal structure
- **Long monolithic tests** — one test with 50 steps is hard to debug
- **Coupled tests** — Test B depends on Test A having run
- **Hidden state** — tests behave differently depending on order or data
- **Manual cleanup** — relying on people to reset the environment
- **No quarantine** — failing tests get merged anyway because "it's flaky"
- **Mocking everything** — at this layer, use the real integrations, or it's not E2E
- **Expected value read from the page** — the bug becomes the expectation

## Quality Targets (from qa-tester agent)

- Critical path coverage: 100%
- Test runtime: ≤ 10 min for smoke, ≤ 30 min for full
- Flakiness rate: < 2%
- Pass rate in main: > 95%
- Mean time to fix flake: < 2 days

The table comparing common Playwright and Cypress commands (Library Quick Reference) is in [references/coverage-and-libraries.md](references/coverage-and-libraries.md)


## reference: auth-in-e2e.md

# Authentication in E2E — ตัวอย่างการล็อกอินในเทสต์

Three ways to log in within a test suite, ordered from worst to best, with Playwright code examples

## Bad: log in via UI every test
```
Slow, brittle, duplicate code
```

## Good: log in once, share state
```typescript
// playwright.config.ts
{
  use: { storageState: 'auth.json' },
  globalSetup: 'global-setup.ts',  // logs in once, saves cookies
}
```

## Better: API login (no UI)
```typescript
// page.request shares its cookie jar with the page's browser context,
// so the Set-Cookie from the login response is already in the browser — no addCookies needed.
async function login(page, user) {
  const response = await page.request.post('/api/login', { data: user });
  expect(response.ok()).toBeTruthy();
}

// Or once for the whole run (global setup), saved for every test:
// const ctx = await request.newContext({ baseURL });
// await ctx.post('/api/login', { data: user });
// await ctx.storageState({ path: 'playwright/.auth/user.json' });
```

> **Security:** The saved state file holds a live session (cookies, tokens). Keep it out of git: add `playwright/.auth/` (or your `auth.json`) to `.gitignore`, and use a test account only.


## reference: ci-and-parallel.md

# Parallelization and CI Integration

Parallelism levels, the end-to-end (E2E) run tiers in continuous integration (CI), and the files to keep when a test fails.

## Parallelization

| Level | Speedup | Complexity |
|-------|--------:|:----------:|
| File-level parallel | 4-8x | Low (just enable) |
| Test-level within file | 10x+ | Med (isolation needed) |
| Sharded across CI workers | Nx | Med (requires sharding config) |
| Cloud grid (BrowserStack, etc.) | Massive | High (cost) |

**Requirements for safe parallel:**
- Tests don't share state
- Unique test data per test
- Database/external services support concurrency

**Agree on rules before running many agents or workers at once** (example from an online-shop test job where a reset wipes the data of the whole server, run with 6 agents at once):

| Rule | Prevents |
|---|---|
| Reset once before the combined run starts; no agent resets during the run (set a variable such as `PP_SKIP_RESET=1`), and each agent keeps its results in its own folder | deleting each other's data and result files |
| Tests that buy things use different products, and never one that another test is checking stock on | stock collisions |
| New-account emails include `{run}` (project name + run start time) | a second run getting "อีเมลนี้ถูกใช้แล้ว" ("this email is already used") (one plan had 30 tests that could not be re-run; 0 after the fix) |
| Tests that hit the rate limit use their own account and run last | counters carrying over across tests |
| Tests that use shared central state and cannot be separated → `workers: 1` · `fullyParallel: false` | randomly wrong results |

## CI Integration

### Run E2E tier
```yaml
# Smoke (every pull request (PR), 2 min)
- 5-10 critical tests
- Chromium only → feedback เร็ว
- Fail = block merge

# Full (merge to main + nightly, 30 min)
- All E2E tests
- Chromium (desktop) + WebKit (iPhone viewport)
- Failures investigated next day

# Pre-prod (before deploy, 10 min)
- P1 + P2 tests (test-case-template scale: P1 = most important)
- Chromium + WebKit + Firefox (ครั้งเดียวก่อน release)
- Must pass before prod deploy
```

### Browser matrix

Do not run all 3 browsers every round → CI time grows ~3x and flaky tests grow with the number of browsers.

| Browser | Covers | When to run |
|---------|----------|-----------|
| Chromium | Chrome · Edge (most users) | every round |
| WebKit | every browser on iPhone/iPad (including Chrome on iOS) | merge to main · nightly · pre-prod |
| Firefox | small share | pre-prod only · can be dropped if the customer does not use it |

Adjust to real users → look at analytics first; if an enterprise customer mandates Firefox, move it up to the nightly round.

Set them up as projects in Playwright and pick with `--project`.

```ts
// playwright.config.ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'webkit-mobile', use: { ...devices['iPhone 15'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
],
```

```bash
npx playwright test --project=chromium                          # PR
npx playwright test --project=chromium --project=webkit-mobile  # main · nightly
npx playwright test                                             # pre-prod (ครบ 3)
```

**Tests that should run across browsers** (tag `@cross-browser`) → places that often break differently per browser:
- date/time input
- file upload · clipboard
- date/number formatting with `Intl`
- CSS layout · scroll · sticky
- video/audio autoplay

Pure-logic tests → Chromium alone is enough.

> Playwright's WebKit is not 100% the real Safari → for work where customers use iPhone a lot, try on a real device once more before release.

### Artifacts to capture
- Screenshots on failure
- Video on failure
- Trace files (Playwright)
- Console logs
- Network logs


## reference: coverage-and-libraries.md

# Critical Path Coverage Matrix และ Library Quick Reference

An example user-journey coverage table, and a table comparing commonly used Playwright and Cypress commands

## Critical Path Coverage Matrix

```markdown
| User Journey | Coverage | Priority |
|--------------|:--------:|:--------:|
| Signup → first action | ✓ | P1 |
| Login → main task | ✓ | P1 |
| Add to cart → checkout → success | ✓ | P1 |
| Search → filter → result | ✓ | P2 |
| Settings → save | ✓ | P2 |
| Admin panel CRUD | ✓ | P2 |
| Password reset | ✓ | P3 |
| Profile edit | Sample | P3 |
```

Priority uses the `test-case-template` scale (P1 = most important, P3 = least), the same as the `@P1|@P2|@P3` test tags.

## Library Quick Reference

| Need | Playwright | Cypress |
|------|-----------|---------|
| Visit page | `page.goto(url)` | `cy.visit(url)` |
| Click | `page.click(sel)` | `cy.get(sel).click()` |
| Type | `page.fill(sel, text)` | `cy.get(sel).type(text)` |
| Assert text | `expect(page.getByText(...))` | `cy.contains(...)` |
| Wait for response | `page.waitForResponse(...)` | `cy.intercept(...).as(...)` |
| Screenshot | `page.screenshot()` | `cy.screenshot()` |


## reference: flaky-tests.md

# Fighting Flaky Tests — examples of waiting the right way

Code comparing a fixed-time wait with an event-based wait. The cause table and the retry strategy are in `SKILL.md`.

## Bad (sleep hack)
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // ← flaky
await expect(page.getByText('Success')).toBeVisible();
```

## Good (event-based wait)
```typescript
const responsePromise = page.waitForResponse('/api/submit');
await page.click('#submit');
await responsePromise; // ← deterministic
await expect(page.getByText('Success')).toBeVisible();
```


## reference: oracle-and-mutation.md

# Oracle, structure comparison and mutation — use when an existing system is available to compare against

Source: lessons from a 6-chapter web-clone course (Week 03 of Teaching_CWN2026), measured on 5 app versions · the numbers are results of that job, used as examples, not as criteria · content specific to the cloned website (flight data, container ports) is not carried over.

## 1 · Use the existing system as the answer key (differential testing)

Run the same scenario on the existing system and on our app, then compare the results field by field, instead of writing expected values by hand.

- The result passes only if every compared field matches (example: count + price + name + time, position by position).
- Fetch expected values from the existing system at run time; do not hard-code numbers in the comparison code, except parameters that come from the task.
- For a scenario the existing system cannot answer itself, an **inferred answer key** (computed by yourself) may be used, but first prove the method on cases that have a real answer key · if the order cannot be trusted, judge by count and data set · say plainly that the criterion is weaker (real round: S2 passed even though it had 10 tickets).
- Report a difference as position, row, field, not just "failed" · in the real round, 4 scenarios had one cause, fixed in one place (310 lines of data, 7 lines of code), going from 4/8 → 8/8.
- Remove what is meant to differ before comparing (banners, brand names, links to other domains, mock-data labels).

### If you must record and replay (record-replay), keep the existing system stable

| Trap | Do |
|---|---|
| The URL does not match the recorded one character for character (`+` vs `%20`) | `routeFromHAR` matches URL + method + body exactly · you need your own route for the cases that do not match |
| Random values in the URL or body | match POST by body and pick stable keys |
| Results differ every round | freeze the clock (`context.clock.setFixedTime`) · turn off telemetry · cut the network with a last-layer abort |
| Counting rows while the filter box is still open | wait for the count to settle before counting |
| Route order | Playwright tries the one registered later first |
| No recording file | never open the real live site instead; stability is lost |

- Check that it is really stable by running 3 rounds and getting the same result.
- Limit: it can answer only what was recorded; for full coverage, record every scenario first.
- The recording file contains cookies and tokens: do not commit it and do not take it off the machine.

## 2 · Compare page structure with the accessibility tree (`ariaSnapshot`)

Pixel comparison is brittle and can mislead (matching white backgrounds). Structure comparison tells you "what is missing" as a list.

1. Capture the page in the same state.
2. Remove what is meant to differ before comparing (banners, links to other domains, brand names, mock-data labels).
3. Normalize names: strip symbols, turn numbers into `#`.
4. Make `role | name` tokens (button, combobox, textbox can count as one control kind).
5. Compute the Jaccard score of the tokens (intersection ÷ union).
6. Check a list of key elements chosen from the existing system (38 items in the real round) · the existing system must pass all of them first, otherwise the list itself is wrong.
7. Total score = average of the two · give the result as a list of what is still missing.

Caution: Thai has no spaces, so splitting by whitespace fails; use `Intl.Segmenter('th')` · half of the score depends on the list you chose yourself.

## 3 · Mutation testing — examine the test suite with deliberate bugs

Plant bugs one at a time in an app that already passes, then see whether the test suite catches them.

**Count "caught" as pass → fail against the baseline, not "at least 1 failure".** If the baseline already has a red test, the latter criterion passes automatically (real round: raw score 10/10 for both suites, but the strict criterion gave acceptance 8/10 and differential 4/10 · the survivors survived because the related test was already red) · make the baseline green first, then the score can be read.

Steps:

1. Copy the base code to `mutants/base` · write `manifest.json` holding the before and after text of every bug (file + line) · change 1 spot per bug, never combined.
2. Run the baseline first and record the set of failing tests.
3. Per bug: create a compose project with a separate name → wait for the health endpoint (loop with a limited count) → run every test suite → always `down -v --remove-orphans` in `finally`.
4. Do not edit tests to point at a new target; wrap them: load `endpoint.cjs` with `node --require` to change only the baseURL · or write an extra runner that calls the same scenarios.
5. Compute both the raw criterion and the pass → fail criterion · record the additionally failing tests one by one.
6. Check the SHA-256 of the test files before and after · generate the report from a script, not by hand.
7. Tell the user the duration in advance (real round: 11 rounds × 2 suites took 46 minutes because Docker is built every round).

Bugs worth having: reversed sorting · turning off filters one at a time · result count short by 1 · load-more ending at 299 · `<` instead of `≤` · time shifted by 1 hour · wrong code.

Observations:
- The surviving bug was `<` instead of `≤`, because the boundary value was not in the test data; a dedicated boundary-value test is needed.
- Different kinds of suites catch different groups of bugs (acceptance catches several data bugs that differential cannot newly catch, while differential tells the wrong row and field) · use them together.
- 80% and 40% are lower bounds; they do not mean that a bug with no newly failing test certainly slipped through.
- The real round has not yet re-run mutation against the version where differential is green, and had only 10 bugs.

## 4 · Reusable runner

- 1 test per item · a fresh context for every test · no retry · no lowering of criteria · never edit a test.
- Keep it inside the scope: a route cancels navigate requests across origins.
- Locators must be specific: in the real round, a test that passed because it saw only 10 rows broke at once when the data was complete and it found 2 rows.
- Set an evidence-mode switch (e.g. `EVIDENCE=1`): normally run fast with many workers and no video; evidence mode lowers workers, raises timeouts and records video.
- A neutral element finder (control/choice) that supports both `select` and a tap menu lets one test suite run against two apps written differently · the projects differ only in `baseURL`.
- A test must not add things it does not delete (creating a new booking on every run = not idempotent).
- A popup that blocks a click needs a step that closes the popup first · look at the screenshot and snapshot of the failed test, not only the error text (real round: "cannot click the button" was really a popup blocking; root cause: a re-render removed the Escape key listener).
- Measuring an empty page and waiting for the timeout at every step took 24 minutes; it should fail fast.


## reference: page-object-model.md

# Page Object Model (POM) — ตัวอย่างโค้ด

An example comparing a test with no abstraction and a test that uses a Page Object · use it when setting up a test suite or reviewing tests that copy the same steps

## Bad (no abstraction)
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

## Good (Page Object)
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

> **One Page Object per page or major component.**


## reference: test-data-strategies.md

# Test Data Strategy — ทางเลือกทั้ง 4 แบบ

The pros and cons of each way to prepare test data, with code examples of the recommended way

## Option 1: Shared test DB (popular, problematic)
```
Wrong: All tests share same data
Wrong: Order-dependent
Wrong: Hard to parallelize
Wrong: Pollution between tests
```

## Option 2: Per-test setup (slow)
```
Right: Clean slate every test
Mixed: Reliable but slow
Good for critical flows
```

## Option 3: API setup, UI verification (best)
```typescript
// Right: Setup via API (fast), verify via UI (real test)
test('user sees orders', async ({ page, request }) => {
  // Setup via API — fast, reliable
  const user = await api.createUser();
  await api.createOrder(user.id, { items: [...] });

  // Test the actual UI flow
  await page.goto('/orders');
  await expect(page.getByText('Order #123')).toBeVisible();
});
```

## Option 4: Database snapshot + rollback
```
Right: Real production-like data
Right: Fast (uses snapshots)
Mixed: Requires DB tooling
```


---

# skill: spec-to-code-loop

Use when building test-first from a spec and mockups

> **In SuperUser:** this loop is the core of the playbooks [`feature`](../superuser/references/playbook-feature.md) and [`new-project`](../superuser/references/playbook-new-project.md). If superuser is open, follow the playbook and use this file as the detail of the loop.

# The loop from requirements to code

> **The one rule:** the loop needs a stop condition that **gives a result the moment you run it**.
> "Finish implementing the requirements" cannot be checked by a machine, while "all 47 tests are green" can.

---

## What you must have before starting

| What you need | If missing |
|---|---|
| Requirements that are each testable, with an ID such as `FR-AUTH-010` (FR = Functional Requirement) | Stop and use `srs-writing` to make them testable first |
| A 1-line test command that really runs | Stop and set up the test skeleton first, using `testing-standards` |
| A command to run the app and look at it (if there are screens) | Skip the image-comparison step for now, and tell the user it was skipped |
| Mockup images named to match the screens | Ask the user, otherwise the UI will never match |

**Starting without all of these amounts to writing code that nobody can tell is right or wrong**

---

## 1 · Round zero — plan, no code yet

Read the requirements and mockups in full, then break them into sub-tasks, **1 requirement per task**
and write them to `docs/BUILD-PLAN.md`

```markdown
| # | รหัส | milestone | สิ่งที่ต้องได้ | ไฟล์ที่จะแตะ | test ที่จะเขียน | สถานะ | commit |
|---|---|---|---|---|---|---|---|
| 1 | FR-AUTH-010 | M2 | ล็อกอินด้วยอีเมลและรหัสผ่าน | auth/login.ts · auth/session.ts | login_FR-AUTH-010 | ค้างอยู่ | |
| 2 | FR-AUTH-020 | M2 | ล็อกผู้ใช้หลังผิด 5 ครั้ง | auth/lockout.ts | lockout_FR-AUTH-020 | ค้างอยู่ | |
```

The `milestone` column takes an `M…` ID from the project plan or the timeline in `BUILD-PLAN.md` (playbook `new-project` step 1) · no timeline → may be empty

**Documents conflict → follow the order, do not guess** — write a 1-line priority order of the documents at the very top of `BUILD-PLAN.md` before splitting the work, for example `ลำดับเอกสาร: TEST-DATA.md > REQUIREMENTS.md > DESIGN.md > mockup` (document order: …)
- The user has already set an order → use it
- Not set → use the default: test data with expected values (the clearest numbers) > requirements (Software Requirements Specification — SRS) > design document > mockup, and log it in `decision-log` with `(รอยืนยัน)` (awaiting confirmation)
- A real conflict found → follow the higher-ranked document, and record the conflicting pair (file · section · both values) under "ค้างอยู่" (pending) for the owner to fix the source · never edit the source documents yourself

**If an item is so ambiguous that you cannot write a test, do not guess** — collect it into a list of questions at the end of the file, put it under the heading **"ค้างอยู่"** (pending) once, and carry on with the other items

> Questions to ask instead of guessing: what is the boundary value · what must happen on failure ·
> who may see this data · if the item already exists, overwrite or warn

**Check the plan yourself before sending — 5 items, do it yourself, no need to send an agent** (adapted from superpowers `writing-plans` · MIT)

| Item | Ask | If found, do |
|---|---|---|
| Complete | Going through every requirement in the SRS or FSD, can you point to a row in the table | Cannot point → add a row |
| Size | Each row gives a writer 1 sensible thing, not so wide they must guess, not so detailed it becomes code | Wide → split · detailed → leave the signature and the test name |
| Names match | The types · functions · columns that later rows reference are spelled as the first row set them | Different → fix to one name |
| Biting cases | Each kind of input and failure path the requirement implies: which row has a test for it | None → add a test name to the owning row |
| Proportion | A plan many times longer than the requirements = pre-written code, not a plan | Cut the code body to signatures and assertions |

Fix in place when found, no need to check again

At the end of round zero you **must stop** and let the user read the plan first — do not flow on to write code yourself

If building from a single build prompt: read the prompt through before pasting, fix anything that does not match the requirements first, then paste in a fresh session with empty memory to prove the prompt is really complete (reported from the training exercise, not measured against a baseline)

---

## 2 · The loop per requirement

```
อ่าน BUILD-PLAN.md  →  หยิบข้อแรกที่ยังไม่ทำ
  1. เขียน test ก่อน  ชื่อ test มีรหัสข้อกำหนดอยู่ในชื่อ
  2. รัน test ให้เห็นว่า "แดง"        ← ข้ามขั้นนี้ไม่ได้
  3. เขียนโค้ดจน test เขียว
  4. รัน test ทั้งชุด                  ← กันของเดิมพัง
  5. หน้าจอ: ถ่ายภาพจริงเทียบ mockup   ← ข้อ 5 ข้างล่าง
  6. อัปเดตสถานะใน BUILD-PLAN.md + commit หนึ่งข้อต่อหนึ่ง commit (เมื่อได้รับอนุญาตเท่านั้น — ไม่ได้อนุญาต → ใส่ข้อความ commit ที่แนะนำในคอลัมน์ commit พร้อม `(รอ commit)`)
  →  วนข้อถัดไป
```

**Step 2 is the one people skip most, and the costliest to get wrong** — a test that has never been seen red
may pass forever whether the code is right or wrong

**If the user says TDD · test-driven · "write the test first"** — that is this very loop, no need to look for another way: red = steps 1–2 (a test named with the requirement ID, which must really be seen red) · green = step 3 (the least code that makes it green, per `lazy-coding`) · refactor = done during step 4 with the whole test set still green, adding no new behaviour in that round · the unit of 1 round is 1 requirement, not 1 function, so it is smaller than people think and larger than textbook TDD · for test skeleton · run command · ratio of unit to integration see `testing-standards` · no testable requirement → you cannot do TDD yet, go back to "What you must have before starting"

---

## 3 · Iron rules

1. **Never edit or delete a test to make it pass** — a red test means the code is wrong, not the test
   A test may be edited only when you can prove it was written wrongly against the requirement, and you must tell the user every time
2. **1 requirement per round** — never bundle several because "they are similar"
3. **A single requirement may be tried at most 3 rounds** — fails 2 rounds → split into sub-steps, do not retry the same way · 3 rounds reached → **mark it `ติด` (blocked) and follow "After stuck" below**, do not keep trying on and on
4. **Never mock the thing under test** — you may mock external things, you may not mock yourself
5. **Never skip to an easier requirement** before trying 3 rounds — the order in the plan is the real order, and only items already marked `ติด` (blocked) may be skipped

### After stuck — 5 steps

1. **Record why it is stuck** under "ค้างอยู่" (pending): what was tried across all 3 rounds · where you think the problem is · what you need to go on (an answer · data · permission)
2. **Go back to the last point where tests were green** — keep the pending work in a branch `stuck/<ID>` (if not permitted to commit → keep it as a patch at `_to_delete/patches/stuck-<ID>.patch` instead) and return the line of work to where the whole test set is green. The test of the stuck item stays in that branch or patch too, never delete it
3. **Items that wait on the stuck item** are marked `ติด` (blocked) with the reason `รอ <ID>` (waiting for <ID>) without trying, then go to the next item in plan order that does not wait on it
4. **Try 1 more round at the end** — once everything else is done, have a new agent on a larger model try 1 round from branch `stuck/<ID>` (or the kept patch) and record it in step 1 · if an answer is already in the inbox (`.claude/superuser/inbox/`) → start from that answer
5. **Still stuck** → keep `ติด` (blocked) in the closing report, stating what is needed from the user · if the user answers later → continue from that item per the playbook `pickup-and-pause`

---

## 4 · The status file — context will certainly run out

A loop is always longer than one conversation can remember. **State must live in a file, not in the head**

- `docs/BUILD-PLAN.md` — the plan and status. **Read this file before starting every round**
  This is the only file this loop adds to the main documents folder
- Status has only 5 values (the same set as `superuser`): `เสร็จ` (done) · `ทำอยู่` (in progress) · `ติด` (blocked) · `รออนุมัติ` (awaiting approval) · `ค้างอยู่` (pending) — work not yet started uses `ค้างอยู่`
- `ติด` must have a 1-line reason after it
- Every `เสร็จ` item must have a commit number — no number means not really done · except when not yet permitted to commit (commit only when permitted): put the recommended commit message + `(รอ commit)` (awaiting commit) and test evidence (test name + run result) in place of the number, and it may count as `เสร็จ`
- At the end of each round, update the headings `## สถานะล่าสุด` (latest status) and `## ประวัติสถานะ` (status history) at the top of the file per `status-report` — the task table and the status table are in the same file under different headings

**Starting a new round without reading this file first is the number 1 cause of rework**

### Files the loop creates along the way — all go to `_to_delete/`

Requirements documents are often `.docx` or `.pdf` and must be converted to text before they can be re-read correctly.
**A converted file is not a document**, it is a temporary working item of the loop

```
_to_delete/
  extracted/       ← .docx .pdf ที่แปลงเป็น .md แล้ว
  check/           ← ภาพหน้าจอที่ถ่ายไว้เทียบ mockup
  logs/            ← ผลรัน test ที่เก็บไว้ดูย้อนหลัง
```

| File | Goes where |
|---|---|
| Documents converted to a readable format | `_to_delete/extracted/` |
| Screenshots taken for checking | `_to_delete/check/` |
| Test run results · logs | `_to_delete/logs/` |
| The plan and status `BUILD-PLAN.md` | `docs/` — it is a real document |
| Code and tests | The project folder |

**Never write converted files into `docs/` mixed with the original documents** — in 3 months nobody will know
which file is the real one the customer signed and which a machine converted

Full detail is in `temp-file-discipline`

---

## 5 · Compare to the mockup with a real image

Reading the code and saying "it matches" does not work. You must really open it and look

```python
page.set_viewport_size({"width": 1280, "height": 900})   # ให้เท่ากับความกว้าง mockup
page.goto(url); page.wait_for_timeout(500)
page.screenshot(path="_to_delete/check/login.png")
```

Then open both images and compare by these 5 items:

- [ ] Do the order and grouping of elements match
- [ ] Are spacing and font size close (not pixel-exact)
- [ ] Are all the states the mockup shows present — empty · loading · error
- [ ] Does the text match the mockup, or was it made up
- [ ] Does Thai wrap badly or lose vowels

Wherever they differ, **say so as a list**; do not stay silent and claim done
Screenshots taken for checking are temporary files — they go to `_to_delete/` per `temp-file-discipline`

---

## 6 · Traceability

A test name must contain the requirement ID, for example `test_lockout_after_5_failures_FR_AUTH_020`
so one command can search which requirement has no test covering it

Close the job with a traceability table: every requirement → the test that covers it → the latest result

> **For any requirement with no test covering it, say plainly that there is none** — never write a shallow test to fill the table
> A table that is full because you filled it yourself is more dangerous than a table with gaps

---

## 7 · When to split into multiple agents

**One criterion: the files to be touched must not overlap at all** — see the "files to touch" column in the plan

| Can split | Cannot split |
|---|---|
| Different modules, different screens, files that do not overlap | Touching the same file, even just one — the work will overwrite each other |
| A **read-only** checking agent running alongside an agent that writes code | Work that already has to wait for the result of another task |
| Turning requirements into tests for several modules at once | When there is no plan yet — you need a plan first to know where you can split |

**Each agent that writes files must get its own worktree**, per the recipe in `superuser/references/code-extensions.md` section "parallel-split-and-merge" (including how to handle uncommitted work)

Every agent that is split off must receive: the IDs of the requirements it owns · the list of files it may touch ·
the test command · and all of rule 3

**Never let a split-off agent edit `BUILD-PLAN.md` itself** — have it report back, and the main agent writes the one file
otherwise the status file breaks before the code does

---

## 8 · Signs the loop is breaking

| Symptom | What it really means |
|---|---|
| All tests green from the first round without ever being red | The tests test nothing |
| The number of tests grows faster than the number of requirements closed | Writing tests to make itself pass |
| One commit touches 15 files | Several requirements bundled, cannot be reverted when it breaks |
| The same item loops past 3 rounds | The requirement is ambiguous, not the code hard, so go back and ask |
| Nobody has updated `BUILD-PLAN.md` for 2 rounds | State is in the head, the next round will redo work |
| Numbers improve but people cannot use it (text off-screen, pale colours, input fields cutting words) | The loop is chasing the metric, not solving the problem → item 10 on guards |
| The remaining items can be fixed only by adding fake data or hiding content | The ceiling of the data has been reached → item 10 on stop rules |

---

## 9 · Anti-patterns

- **Throwing the whole requirements document in one round** — the number 1 cause of messy code
- **Writing the code first and the tests after** — you get tests that confirm what was just written, not what is needed
- **Guessing when a requirement is ambiguous** — wrong from the start, but discovered at delivery
- **Editing a test to make it pass** and then reporting done
- **Splitting parallel agents on the same file**
- **Claiming the UI matches the mockup without ever opening it**
- **Closing the job with no traceability table** — nobody knows what is not yet done
- **Faking data, hiding content, or relaxing the criteria** to make numbers look good

---

## 10 · A loop that adjusts by numbers

Use it when the loop chases a metric (match the existing system · match the mockup · a measurable score) rather than closing requirement by requirement · the loop's contract, the guards against gaming the numbers, the stop rules, and a real measured example are in [`references/metric-loop.md`](references/metric-loop.md) · it must be opened and read before starting this kind of loop

---

## 11 · Connecting to other skills

| Need | Use together with |
|---|---|
| Make requirements testable first | `srs-writing` |
| Turn requirements into test cases | `test-case-template` |
| Test skeleton, test framework, names, coverage | `testing-standards` |
| Tests that open a real browser | `e2e-testing-patterns` |
| Write the simplest code that works | `lazy-coding` |
| Fix when a test is red or the result does not match | `targeted-fix` |
| Commit message format | `commit-message-format` |
| Screenshot files taken for checking | `temp-file-discipline` |
| Test sets and metrics for a number-chasing loop | `test-evidence` item 5 · `e2e-testing-patterns` (oracle-and-mutation) |
| Record state across conversation rounds | `handoff` |
| Status summary table at the end of a round | `status-report` |

---

## Abbreviations

- **test** — an automated test suite
- **mockup** — a prototype image of a screen
- **commit** — recording a change into the version control system
- **UI** — User Interface


## reference: metric-loop.md

# A loop that tunes to a number

Moved from SKILL.md section 10 (2026-11-10) · open it when the loop chases a metric rather than closing requirements one by one.


Use this when the loop does not close requirements one by one but chases a metric, such as matching the old system, matching a mockup, or a measurable score. Source: the lessons from cloning a website in 6 chapters (Week 03 of Teaching_CWN2026), measured on a real app with chained versions. The numbers below are results from that job. Use them as examples, not as criteria.

**The loop contract is written before you start, and a machine can check it. It is not just a request.**

| Part | Write |
|---|---|
| Start state | An empty folder, or the tag from the previous round |
| Scope | Which files may change · checked by a script that reads `git diff` |
| Metric | One command that gives pass/fail and a number · exit 2 = could not measure, kept separate from "fail" and not counted against the budget |
| Keep rule | Keep the change when it passes the overall bar, or when more sub-units pass without the main metric dropping · if not, `git revert` |
| Stop rule | The set number of rounds is used up, or a ceiling is reached (see below) |
| Budget | Number of rounds, and time per round |

**Rules found to be necessary**

- **No going backwards.** You may add one item, and the others that passed before must still pass.
- **Count in sub-units.** Going from 27 of 31 items passing to 30 is measurable and keeps the work, even if the overall bar is not yet met.
- **A data ceiling is not a failure.** If an item can be fixed only by adding fake data, editing the test, or hiding content, stop chasing it and report it as a ceiling (real round: 74 of 82 items).
- **Separate where the score came from.** A score that jumps may come from adding data before the loop, not from looping (real round: 51 → 73 from data, the loop itself added 1 item).
- **The builder does not read the source of the test or the answer key.** It may only see the result report, and it does not bind to identifiers that the test itself defines. (There is no evidence that using a different model reduces shared error, so it is not a rule.)
- **A judge's test must pass against the original before it counts in the gate.** A test that fails because it was written wrongly can be fixed once. A test that fails because the original changed, or because it cannot be checked through the screen, gets an invalid label with a reason and is not counted. (Example from that job: a judge from another vendor wrote 47 items, 25 invalid (53%), leaving 22 valid.) What helps is "the answer comes from the original", not the model's vendor: data that was wrong on both sides (matching the live screen in only 278 of 300 items) was caught because the tests were rerun against the live original. There was no control group, so we do not yet know how much the model's vendor matters. For how to make a test trustworthy see `test-evidence` item 5 (not repeated here).
- **The lead re-measures every number itself after the round ends.** Do not trust the report of the agent that made the fix.

**Lock the structure first, then tune the look** (colours, spacing, sizes)

1. Step 1 builds the full structure and content, with all look values referencing variables in a single values file. No numbers or colours are written directly in other files.
2. Lock: a hash of the settled structure tree · a script checks `git diff` that step 2 touches only the values file · no variable name may be added or removed.
3. Step 2 tunes only the values in that file · the quick metric must match the full metric pixel for pixel before starting and after every build (a real round once drifted, 51,960 versus 53,255, because of font weight).

Reason: structure moves the number by about 18 points, and the look by about 2–3 points. Limit: you can tune only continuous values. If the layout is wrong (the first row is at y=602 where the original is near 399), step 2 cannot reach it, so check the layout before locking.

**Guards that stop the machine from cheating the number (Goodhart)**: in a trial round the optimizer lowered the visual diff by pushing content off-screen, changing text colour to blend into the image, and squeezing input fields until city names were cut off.

| Guard | What it prevents |
|---|---|
| Text ≥ 12 px · contrast ≥ 4.5:1 · no cutting mid-word | Shrinking, fading, or hiding text |
| The first row is on the first screen, within 150 px of its position when locked | Pushing content off-screen |
| Text colour is a neutral colour (saturation ≤ 20%) | Recolouring text to blend in |
| Text in input fields does not overflow (`scrollWidth ≤ clientWidth`) | Squeezing input fields |
| Do not change the font family to monospace or a display font to lower the diff · a person looks at the real image before accepting | The earlier guards all passed, but the optimizer chose a monospace font because it gave the lowest diff, and the builder said it looked like a typewriter |
| The order of font sizes must stay the same | Flattening the type hierarchy (real round: md/lg/xl all became 17, which the earlier guards did not see) |

- The guards' baseline comes from the values at lock time, not from fixed numbers. An element missing from the baseline must **fail**, not be skipped.
- The final set of values must pass on screens or data that were never used for tuning (the real round tuned on a 1366×900 screen only).
- For a guard where a change in look needs a person to decide (moving text, hiding a price range), ask the user whether it is acceptable. Do not decide yourself.

**Commands in the loop always use `cd X && cmd` or full paths.** Once, a `cd` failed and `sed` edited about 20 files outside the scope (including 4 files in the toolkit). Keep a hash of the toolkit folder (`kit/`) as a manifest and compare it after every round.

The tests and metrics of a loop like this must be trustworthy first → `test-evidence` item 5


---

# skill: app-verifier-setup

Use when an agent has no scripted way to run the app

# app-verifier-setup — give the agent hands and eyes

> If an agent cannot see its own work, it cannot adjust that work, and a person must keep relaying what is on the screen.
> This skill builds the tool once, so every later agent can reuse it.

**Output:** 2 things, a script that lives with the project's tests, and a skill that is only a short guide for agents.

```
<project>/
├─ <project-name>/test/e2e/verify.*         script that drives the real app and opens and closes it itself (in the code folder, see project-bootstrap)
│                                           the list of features and checks lives only in this file (the feature map)
├─ .claude/skills/verify-<project>/SKILL.md   how to run · how to read results · what not to do (at the root, where Claude Code looks)
└─ _to_delete/verify-runs/                  evidence from each run — the script finds paths from its own location, so it does not depend on the folder it runs from
```

(Codex · Gemini use `.agents/skills/` · `skills/` instead of `.claude/skills/`.) Examples already built: the `calculator-demo` project (web) · the Flutter Android app `Lumio - Light Meter` → `lumio-light-meter/test/e2e/verify.mjs` (Node driving `adb`, summarized in [`references/android-native.md`](references/android-native.md)).

**Why not write the steps as a separate text file.** In the sample project, the steps in a `.md` file and in the script disagreed from the first round. So keep the information in the script only, and let the skill point to it.

---

## Steps

1. **Find the existing way to run the app** from the README · `package.json` · `Makefile` · `docker-compose` · launch config (`.vscode/launch.json`) · `pubspec.yaml` (Flutter) · `build.gradle(.kts)` / `gradlew` (Android). If one exists, use it and do not build a new one.
2. **Choose how to drive it by app type**

   | Type | Drive with | Read results from |
   |---|---|---|
   | Web | Playwright (if Chromium is already installed, never download it again) | Screenshot · DOM · console · network |
   | Electron · desktop | Playwright `_electron` or Chrome DevTools Protocol (CDP) · on Windows use pywinauto (the latest WinAppDriver release was probably in 2020 and it is not confirmed that Microsoft still maintains it (`รอยืนยัน`, awaiting confirmation)) | Screenshot · log |
   | Command line · TUI | Run the real command with fixed input | stdout · stderr · exit code · created files |
   | API · service | `curl` or the client the repo uses | Status · body · log · values in the test database |
   | Web-based mobile (progressive web app (PWA) · web-wrapped) | Playwright mobile viewport | Screenshot · DOM |
   | Native mobile · Flutter (Android) | A Node/Python script calling `adb` + `uiautomator dump` (the Lumio way) · or Flutter `integration_test` · or Maestro · Playwright cannot drive an APK | Image from `adb exec-out screencap -p` · text/Semantics labels from `uiautomator` · `dumpsys` · `logcat` |

   - If the project has `.sandbox/`, drive the browser in the container. The default is headless (no window). To let a person watch, turn on `up -Browser` (see [`docker-sandbox`](../docker-sandbox/SKILL.md) step 5). An Android emulator cannot run in Docker on Windows (it needs KVM), so run the emulator on the host machine and say so in the report.
   - For a page with CAPTCHA, use the provider's test keys or turn it off in the test environment. Never write a script that solves CAPTCHAs.
   - For an app that reads hardware (sensor · camera · GPS), feed values known in advance, through the emulator (`adb emu sensor set light 420`, virtual camera) or a fake data source that can be turned on only in a debug build. Label every check `emulator` or `เครื่องจริง` (real device), because real sensor accuracy cannot be proven on an emulator. If it has not run on a real device, write "ยังไม่ได้ตรวจบนเครื่องจริง" (not yet checked on a real device).

3. **Write `test/e2e/verify.*`** so it opens the app itself on a port that does not clash (mobile: install the APK and clear app data), seeds test data, and waits until ready **with a time limit** (web: if it is not up in 10 seconds, count it as failed · mobile: set separate times for build · emulator boot · app start · each check, see the reference). Always close the app at the end, and a second run must give the same result (`principle-build-a-tool-not-handwork`).
   - **For a web app or API that needs a server started first**, use [`scripts/with_server.py`](scripts/with_server.py). It starts the server, waits for the port, runs the script, then shuts everything down. For example `python -I scripts/with_server.py --server "npm run dev" --port 5173 -- node test/e2e/verify.mjs` (start several servers by repeating `--server` and `--port` · logs go to `--log-dir`, default `_to_delete/with-server-logs`, created automatically if missing). Tested on Windows on 2026-11-10 with `python -m http.server`, and the port was really closed afterwards. For dynamic apps, wait for `networkidle` (Playwright `page.wait_for_load_state("networkidle")`) or `data-ready="true"` before reading the DOM. Never guess with `sleep`.

4. **Keep the feature list as data in the script.** Go through the menu · routes · command list · SRS, and write 1 group per feature with 1 line per check (`what to do → what must be seen`). Cover at least 3 main features and 1 error case per feature. **Every check starts from a clean state**, can run alone or in a different order, and prints `PASS/FAIL` with expected and actual values.
5. **The script must never pass emptily** (pass without really checking anything). If a feature name does not exist, exit 1. If the app does not come up, exit 1. If no check ran, exit 1 (checking 0 items counts as broken, not as a pass).
   - **A check that verifies "stopped/released" must check the precondition first** (for example, the camera is held before pressing Home). Otherwise it passes emptily. Wait for the result by polling until a timeout, not with a guessed `sleep`.
   - **Make sure you read the latest screen**: delete the old result file before each new read, and tap only when the target position has been steady for 2 reads in a row. If the screen cannot be read because the app never stops redrawing, treat it as an app bug, not a script bug.
6. **Prove the script catches wrong behavior** by breaking the app in 1 place temporarily. Run it, it must `FAIL`, and then restore the change.
7. **Prove the skill works in practice** by sending a fresh `qa-tester` agent that has never seen the code. It uses only this skill to test 1 feature from opening the app to taking a screenshot of the result. Wherever it gets stuck, fix the skill at that point.
8. **Keep the evidence in `_to_delete/verify-runs/<time>/`**, both screenshots and test logs, apart from the code (it is temporary, the user can delete it after delivery, and the agent never deletes it).

## Testing contract — build it into the app from the first screen

verify must depend on things the app provides, not guess from text or CSS. Write this contract into the feature map in the script, and have the developer follow it from the first feature.

| What the app must have | What it is for | Rule |
|---|---|---|
| `data-testid="<page>-<thing>"` in kebab-case on every button, input, result, and error message | Find elements without tying to text or CSS, so checks do not break when language or design changes | For example `book-submit` · `summary-total` · `book-error` · no duplicates on one page · the full list of testids lives in the feature map |
| `<html data-ready="false">` → `"true"` when the page has finished loading data | Wait on a condition instead of a guessed `sleep` (step 5) | Set `true` after the last batch of data arrives, not when the component mounts |
| A reset endpoint such as `POST /api/test/reset` → clears and re-seeds within 5 seconds | Every check starts from a clean state (step 4) | Exists only when `ALLOW_TEST_RESET=1` is set · if not set, answer 404 · never enable in production |
| Clock lock: reset accepts `{"now":"<ISO + offset>"}` and every rule reads "today" from one module (`clock`) | Test date-dependent rules (expiry · cancel at least 24 hours ahead) with the same result every time | If `now` is not sent, use the start date written in the seed · flag off, use real time · never call `Date.now()` / `DateTime.Now` directly in a rule |

Non-web apps follow the same idea: Flutter → a `Key` / Semantics label with the same name · Android → `resource-id` · command line → a `--now` option or an `APP_NOW` variable · a reset on mobile can be enabled only in a debug build.

## What the SKILL.md of the verify skill must contain

- A description saying to use it when you "must prove a feature works on the real app · reproduce a bug · check before shipping".
- Commands that start with `with_server.py` (if the app needs a server) and the rule to wait for `networkidle` or `data-ready` before reading the DOM.
- Start · stop commands · test data (which file holds the test accounts — **never put real passwords**).
- A link to the feature map.
- Prohibitions: do not touch the real database · do not call external APIs that cost money or send real messages.

## What not to do

| Do not | Because |
|---|---|
| Write test steps only in human language with no script | Each agent will invent its own way to run them every time, and no two runs are alike. |
| Put in every feature from day one | A big map that has not been tested decays faster than a small map that really works. |
| Point the verify skill at the real system (production) | Checking turns into editing customer data. |
| Say it is done without doing step 7 | You do not yet know whether other agents can use it. |

## Links to other skills

- [`references/builtin-verify.md`](references/builtin-verify.md) — Claude Code ships with `/verify`: for a project running on Claude Code, create a skill named `verify` at `.claude/skills/verify/SKILL.md` in that format, instead of `verify-<project>`.
- [`app-verifier-upkeep`](../app-verifier-upkeep/SKILL.md) — fix it when the app has changed so much that the map no longer matches.
- `e2e-testing-patterns` — if you want to lift some steps into automated tests in continuous integration (CI).
- [`superuser`](../superuser/SKILL.md) — the playbooks `bug-fix` and `feature` call the skill built here.


## reference: android-native.md

# Driving a native Android / Flutter app on an emulator

> Summarized from a real app, `Lumio - Light Meter` (Flutter · Android). The script that ran and passed is `lumio-light-meter/test/e2e/verify.mjs`.
> Values marked "measured" come from an emulator on Windows using software GPU rendering. Other machines may be faster.

## Choose how to drive

| Method | Strength | Limit | Use when |
|---|---|---|---|
| Node/Python calling `adb` + `uiautomator dump` | Nothing extra to install · can drive the virtual sensor and camera · can check `dumpsys` | Reading the screen takes 3–4 seconds each time (measured) | Default · tests the whole path hardware → native → Dart → screen |
| Flutter `integration_test` (`flutter test integration_test/`) | Finds widgets directly with `find` · fast | Cannot feed real sensor values, so it needs a fake data source · cannot check system state (was the camera released?) | Long screen sequences that do not touch hardware |
| Maestro | Flows written in readable YAML | Needs an extra install · not yet tested in this setup | The team already uses Maestro |

## Script structure (verify.mjs style)

1. **Check before starting** that a device is connected (`adb devices`) and the APK exists (`build/app/outputs/flutter-apk/app-debug.apk`). If either is missing, exit 1 and print the command to run.
2. **Install** with `adb install -r <apk>`, then **start clean for every feature**: `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → wait for the text on the first screen.
3. **Read the screen**: `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → pull `text` and `content-desc` with the center point from `bounds`.
4. **Tap** with `adb shell input tap x y` · **feed a value** with `adb emu sensor set light <lux>` · **take a screenshot** with `adb exec-out screencap -p > shot.png`.
5. **Result**: `PASS/FAIL` with expected and actual values, and exit 0 only when at least 1 check ran and all checks passed.

## Rules learned from real runs

| Topic | Do this | Because |
|---|---|---|
| Text in Flutter | Add `Semantics(label: ...)` to every value you must check | The label appears as `content-desc` in `uiautomator dump`, so it can be checked, and it also helps screen-reader users. |
| Stale dump file | Delete `/sdcard/ui.xml` before every dump | When a dump fails it does **not overwrite** the old file, so you may read an old screen without knowing. |
| "could not get idle state" | Treat it as an app bug and fix the app | The app redraws constantly (Lumio redrew 5 times per second even when the value did not change). That wastes battery and makes TalkBack repeat itself. Fix it by notifying the UI only when the displayed value really changes (for a jittery sensor: a change over 1 %). For a secondary value that drifts slowly, update about once per second. |
| Moving targets | Tap only when 2 reads in a row give the same position | A dialog shifts up when the keyboard opens. A tap at the old position hits the backdrop and the dialog closes (probably the cause of the 1 remaining flaky (inconsistent) result, but not yet re-checked). |
| Permissions | Run `adb shell pm grant <package> android.permission.CAMERA` before any check that does not test the permission screen | The system permission dialog is not what that check is testing. |
| "Released" check | Check the precondition first (the camera is held) → press Home → poll `dumpsys media.camera` for "Active Camera Clients" every 1 second for up to 20 seconds | The emulator releases the camera in 5–8 seconds (measured). Without the precondition check, the check passes while testing nothing. |
| Git Bash | Call `adb` from Node/Python (`execFile`) or set `MSYS_NO_PATHCONV=1` | Git Bash rewrites `/sdcard/...` into `C:/Program Files/Git/sdcard/...`. |

## Feeding hardware values

| What to feed | On the emulator | Note |
|---|---|---|
| Light sensor | `adb emu sensor set light <lux>`, and the app receives the value through `Sensor.TYPE_LIGHT` (measured) | For other sensors use `adb emu sensor set <name> <value>` (not checked one by one) |
| Camera | The virtual front camera sends an image with ISO and exposure time (measured) | The image is a synthetic scene, so you can only check that "a value comes out", not its accuracy |
| Anything else, or what the emulator cannot do | A fake data source compiled into the debug build only | It must never leak into a release build |

Label every check: `emulator` means the data path is right, and `เครื่องจริง` (real device) means the value is right. If a check needs a real device but has not run there, report "ยังไม่ได้ตรวจบนเครื่องจริง" (not yet checked on a real device).

## Time and memory

| Step | Measured time | Set a separate timeout |
|---|---|---|
| First Gradle build (downloads NDK · platform) | ~10 minutes | 20 minutes |
| Later Gradle builds | 1–2 minutes | 5 minutes |
| Emulator boot | Several minutes (not timed) | Poll `adb shell getprop sys.boot_completed` = 1 |
| Open the app until the first screen shows | A few seconds | 20 seconds |
| Per check (waiting for a value on screen) | 3–4 seconds per read | 15–20 seconds |

- The emulator and Gradle use a lot of memory. Claude Code once closed a background emulator because memory ran out.
- Run one emulator only, and stop the Gradle daemon after the build (`gradlew --stop` in `android/`).
- If the emulator is closed midway, report "ยังไม่ได้รันซ้ำ" (not yet re-run) with the list of checks that did not run. Never retry silently and report only the later run.
- No Docker: an emulator in Docker needs KVM, which Docker Desktop on Windows does not have, so run it on the host.


## reference: builtin-verify.md

# The `/verify` bundled with Claude Code — versus our app-verifier

Source: code.claude.com/docs/en/skills (read 2026-10-23) · the version numbers cited come from that page and were not tested on every version

## What Claude Code already has

- 3 bundled skills work together: `/run` opens and drives the app to show that a fix works · `/verify` builds and runs the app to confirm that the changed code does what it should, without falling back on tests or type checks · `/run-skill-generator` teaches the first 2 how to build and open this project
- `/verify` and `/code-review` run only when the user invokes them (since v2.1.215 — before that Claude could invoke them itself)
- `/run-skill-generator` runs from a clean environment, records what really works (install commands · env · launch script), and commits it as a project skill at `.claude/skills/run-<name>/` — run once per project, and again when the build method changes
- `/verify` can record its own recipe: if there is no recipe, it writes what works to `.claude/skills/verify/SKILL.md` at the project root (monorepo: in the package folder that was touched) · **a skill at the root named `verify` replaces the bundled `/verify`**
- A session that starts with a project skill named `verify` or `simplify` (or personal · organization · `.claude/commands/`) → the Claude Code commit command tells it to run before every commit, except when only docs or tests changed · bundled ones · plugin skills · skills from claude.ai do not count
- The whole set can be turned off with `disableBundledSkills` (leaving `/doctor`)

## What `app-verifier-setup` adds

| Ours | The bundled one lacks |
|---|---|
| A contract for in-app testing: `data-testid` · `data-ready` · reset endpoint behind a flag · a lockable clock (`clock`) | It drives the app from what it sees and does not force the app to prepare anchors |
| A feature map as data in the script `test/e2e/verify.*` that prints `PASS/FAIL` with expected and actual · 0 items checked = exit 1 | The recipe is in human language in SKILL.md |
| Proof that it catches wrong things (break 1 spot and it must FAIL) and a new `qa-tester` agent can really use it | — |
| Evidence of every run in `_to_delete/verify-runs/` · can drive native mobile · CLI · API, not just web | — |

## Decision

**A project working on a Claude Code that has the bundled `/verify` → `app-verifier-setup` creates a project skill at `.claude/skills/verify/SKILL.md` (named `verify`, not `verify-<project>`) in the recipe format that `/verify` records itself** — the first part is the build and open-the-app recipe (the same kind `/run-skill-generator` records), followed by ours: the command that runs `test/e2e/verify.*` · the link to the feature map · the testing contract · the prohibitions (the section "SKILL.md ของ verify skill ต้องมี", meaning "what the verify skill's SKILL.md must contain", in the main SKILL.md) · you get 2 things free: it replaces the bundled one, and it runs automatically before commit

- Before writing, read `.claude/skills/verify/SKILL.md` or `run-<name>/` that `/verify` already recorded (if any), then continue in the same format — the frontmatter fields the bundled one uses have not been checked against the docs (`ยังไม่ได้ตรวจ`, not yet checked)
- monorepo → place it in the package folder that was touched, following the bundled one's rule
- Codex · Gemini or Claude Code before v2.1.145 (`ยังไม่ได้ตรวจ` — not yet checked which version `/verify` started in) → use the old name `verify-<project>` in `.claude/skills/` · `.agents/skills/` · `skills/`
- `app-verifier-upkeep` maintains this one file only and does not create a nested `verify-<project>`


---

# skill: principle-build-a-tool-not-handwork

Use when the same edit repeats across many files or rows

# principle · build a tool, not handwork — turn mechanical work into a tool
> Use together with: `principle-small-verifiable-steps` (cut into small pieces that can be checked) · `parallel-split-and-merge` (run several pieces at once)

> Work has 2 parts: the part that needs judgment, and the part that is purely mechanical.
> For the mechanical part, do not make the agent work out a new method every time. Write it as a program once, and save the thinking effort for the parts that need a decision.

## When to build a tool

| Signal | Tool |
|---|---|
| The same change in more than 10 places (files · sheet rows · documents · code) | A script or find-and-replace, tried on a sample first (code: codemod · `sed`) |
| Many documents from one template (40 quotations) | A template + a script that merges data from the sheet |
| Checking every screen, every file or every row | A looping check script that prints a result table |
| Every agent must set up the environment itself before checking | A `start` script in the verify skill (`app-verifier-setup` (plugin `software-development`)) |
| Moving or importing data | A script that gives the same result when rerun, with a trial mode (dry run) |
| The claim "everywhere already does it this way" | A grep command or script that proves it |
| Doing the same job for the 3rd time | Make it a command or a skill |

## Rules for the tool

- **Same result when rerun** — running it twice must not break anything and must not change things twice (`principle-safe-to-rerun` (plugin `software-development`))
- **Print results that can be checked** — say how many were changed · which items were skipped · which items failed
- **As small as it can be and still work** — it need not be pretty, and need not handle every future case (`lazy-coding` (plugin `software-development`))
- **Keep it in the right place** — a one-off script goes in `_to_delete/`, while a script used repeatedly goes in `scripts/` with one line in the README saying when to run it
- **The skill shrinks to a thin description** — the fixed steps live in the script, while SKILL.md says only when to call it and how to read the result

## When not to bother

A change in 2–3 places that really differ, because writing a script takes longer than editing by hand


---

# skill: security-gate

Use when about to ship or merge code, as a security check

# security-gate — a security gate before shipping

> Scanners find issues fast but raise many false alarms. Human reviewers understand context but are slow.
> This gate lets the tools search first, then the agent confirms every finding against the real code, before it reaches a person.

Use it together with [`principle-secure-by-default`](../principle-secure-by-default/SKILL.md). For an in-depth report, use the `security-engineer` agent.

## Steps

1. **Run in the sandbox** (the project's sandbox) — if the project has `.sandbox/`, run every command through `sandbox.ps1 exec`. Install any missing tool inside the sandbox. Never install on the user's machine.
2. **Scan 3 areas** (pick what the project has)

   | Area | Recommended tool | Example command |
   |---|---|---|
   | Leaked secrets (including git history) | gitleaks 8.19+ | Git history: `gitleaks git . --redact` · uncommitted files: `gitleaks dir . --redact` (`detect`/`protect` are deprecated since v8.19.0 — source github.com/gitleaks/gitleaks/releases/tag/v8.19.0 · checked 22 Oct 2026 (B.E. 2569)) |
   | Vulnerable dependencies | The language's own tool + trivy or osv-scanner | `npm audit --omit=dev` · `pip-audit` · `dotnet list package --vulnerable --include-transitive` · `trivy fs --scanners vuln .` |
   | Risky code patterns (static analysis) | semgrep | With internet: `semgrep scan --config p/default --metrics=off` · in a `-Locked` sandbox or without access to semgrep.dev: `semgrep scan --config <this skill>/assets/semgrep-offline.yml --metrics=off` |
   | Dart / Flutter and Gradle dependencies | osv-scanner (reads `pubspec.lock` and `gradle.lockfile`) | `osv-scanner scan source -r .` (`ยังไม่ได้ตรวจ` on this machine) · use `flutter pub outdated` to see stale versions · if Gradle has no lockfile, turn on `dependencyLocking` before the scan can work |
   | Dockerfile · compose · IaC (if present) | trivy | `trivy config .` An Android app has none of these, so read `android/app/build.gradle*` by eye instead (signingConfig must not hard-code passwords, and release must enable minify) |
   | Android app (if present) | Check by eye with [`references/android.md`](references/android.md). For a deeper check, use MobSF (Mobile Security Framework) | — |

   **Android checklist** → [`references/android.md`](references/android.md)

   Keep raw output in `_to_delete/security/`
   - **Never use `--config auto` together with `--metrics=off`** — semgrep refuses to run (seen in a real sample project).
   - **Choose semgrep rulesets by the languages found, not `p/default` alone** (idea from trailofbits/skills `semgrep` · CC-BY-SA, rewritten in our own words). For every project, run `p/security-audit` + `p/secrets` once over the whole repo. Then add per language: `p/python` (+`p/django` or `p/flask`) · `p/javascript` + `p/typescript` (+`p/react` · `p/nodejs`) · `p/csharp` · `p/dockerfile`. For several languages, pass several `--config` flags in one command. If a ruleset cannot load (no internet · wrong name), the report must say it did not run. It must not vanish silently.
   - The offline set has 6 rules that almost never have a safe case (eval · HTML from a variable · shell from a variable · SQL built by concatenation · secrets in code), and it was proven to catch every one in files deliberately written wrong. If any tool cannot run, write `ยังไม่ได้ตรวจ` (not yet checked) with the reason in the report.
   - **semgrep supports Dart very poorly, and the offline rules were written for web and backend.** If semgrep finds nothing in a Flutter project, that does not mean it is safe. The report must say the Dart code is `ยังไม่ได้ตรวจด้วย static analysis` (not yet checked with static analysis) and rely on `flutter analyze` and reading the code instead. Never conclude `ผ่าน` from an empty result.
3. **Confirm every finding** — open the real code and see whether it applies (for example, the vulnerability is in a function the project never calls). Then label it `ยืนยันแล้ว` (confirmed) / `แจ้งผิด` (false alarm) / `ยังไม่ยืนยัน` (not yet confirmed) with a reason. Give `ยังไม่ยืนยัน` no severity and say what evidence is missing. If the customer asks for a deep check of the whole system, or you find an item that needs tracing data flow across several files → [`security-audit`](../security-audit/SKILL.md) (the confirmer is a fresh agent, not the one that scanned).
4. **Rate and decide**

   | Level | What to do |
   |---|---|
   | Real secret leaked | **Stop at once and tell the user.** The secret must be rotated at the provider, because deleting it from the file is not enough, and the agent never rewrites git history itself. |
   | Confirmed critical · high | **Do not ship** until fixed, or until the user accepts the risk in writing in `decision-log`. |
   | medium | Fix it in this round if the estimate is 1 hour or less (a starting value, not yet measured · adjust per team). If it takes longer, open a separate task in the queue and rank it with `decision-scoring` command `priority` in `rice` mode (people or systems affected × impact × confidence ÷ hours to fix). If the scores are close, let a person choose. |
   | low · false alarm | Record the reason. No fix needed. |

5. **Fix**
   - For a vulnerable dependency, update to a fixed version, then run the tests.
   - For a vulnerability in code, use the playbook `bug-fix` (find the root cause + write a test that fails before the fix + search for other places written the same way).
   - For a pattern that keeps coming back, pass it to `repeated-mistakes-to-checks` to turn into a lint rule.
6. **Report** — `qa/security/<year-month-day>-gate.md`, a table `| ระดับ | เรื่อง | ไฟล์:บรรทัด หรือแพ็กเกจ | ยืนยัน | ทำอะไร |` (level · issue · file:line or package · confirmed · action), with a 1-line verdict (`ผ่าน` · `ผ่านหลังแก้` (passed after fixes) · `ไม่ผ่าน`). Never copy secrets into the report (use `--redact` output). Then report status with `status-report` type `ตรวจ` (check).
   - **The report must have a section "ไม่ได้รัน" (not run)** before the verdict. List by name, with a reason each: tools or rulesets that could not be installed · tools that exited with a non-zero code · languages the scanner does not support (such as Dart) · files or folders skipped. A report that scanned partly but reads as complete is worse than no scan. If this section has any entry, a `ผ่าน` verdict must end with `(ยกเว้นที่ไม่ได้รัน)` (except what was not run).
   - Before handing over to a customer, or when the contract names OWASP → fill in the per-item report A01–A10 following [`references/owasp-top10.md`](references/owasp-top10.md), as a second file `qa/security/<year-month-day>-owasp.md`. This gate's scan results serve as evidence for items A02 · A03 · A04 · A05 · A08.

## When to run

- Every time before the `ship` playbook and before handing work to a customer.
- After adding or updating a dependency — if the scan lists findings, follow [`references/dependency-updates.md`](references/dependency-updates.md) (group by real risk · order patch → minor → major · prove · write in CHANGELOG).
- When the contract or a security requirement says the web app or API must pass OWASP Top 10:2025 → read [`references/owasp-top10.md`](references/owasp-top10.md) (the A01–A10 table to cover and prove · delivery criteria · contract clause [`owasp-contract-clause.md`](references/owasp-contract-clause.md) · per-stack methods [`owasp-stack-checks.md`](references/owasp-stack-checks.md) · report template [`assets/owasp-report.md`](assets/owasp-report.md)).
- For a project still in use, run it once a week as a scheduled task, because new vulnerabilities are announced every day even when the code does not change.

## Not the job of this skill

- Real penetration testing, or testing someone else's system, because this skill covers only this project's code and test environment.
- Certifying 100% safety. The report says only what was checked, with what, and what was not checked.
- Reviewing the logic and design of a diff → `code-review-checklist` (run both before merge).


## reference: android.md

# Android checklist — used by `security-gate` step 2

**Android checklist** — Read the merged `AndroidManifest.xml`, not just the source file, because plugins add permissions on their own. The folder changes with the Android Gradle Plugin (AGP) version (`merged_manifests/<variant>/` or `merged_manifest/<variant>/process<Variant>MainManifest/` — `ยังไม่ได้ตรวจ`). After a release build, find it with `find build -path '*merged_manifest*' -name AndroidManifest.xml`.
- `android:exported` — only the main activity may be `true`. Every other component needs a stated reason.
- `android:allowBackup` / `dataExtractionRules` — state clearly which data may be backed up. Do not leave the defaults.
- `android:debuggable` must not appear in release, and `usesCleartextTraffic` must not be `true`.
- Request only the permissions the app really uses. An offline app must not have `INTERNET`, and you must also check the permissions plugins added.
- `key.properties` · `*.jks` · `*.keystore` must not be in git (run `git ls-files` and search the output).


## reference: dependency-updates.md

# Updating vulnerable dependencies — an extension of `security-gate` step 5

Use when the dependency scan result has entries, or a new dependency was just added · ideas from wshobson `dependency-management` (MIT) and Trail of Bits `supply-chain-risk-auditor` (CC-BY-SA 4.0 — ideas only, rewritten in our own words)

## 1 · Scan — use the tool that comes with the language, then add one that reads lockfiles of every language

| stack | Command | Note |
|---|---|---|
| Node | `npm audit --omit=dev --json > _to_delete/security/npm-audit.json` | `--omit=dev` drops things that never reach production · never `npm audit fix --force` because it allows updates across a major version |
| Python | `pip-audit -r requirements.txt` or `pip-audit` inside the venv | For projects using `uv` / `poetry`, export the lockfile to requirements first |
| .NET | `dotnet list package --vulnerable --include-transitive` | Without `--include-transitive` you see only directly referenced ones |
| Every stack | `trivy fs --scanners vuln .` or `osv-scanner scan source -r .` | Reads the lockfiles of every language at once, use it to confirm the results above and to catch Dart · Go · Rust |

**Always commit the lockfile** (`package-lock.json` · `uv.lock` / `poetry.lock` · `packages.lock.json` · `pubspec.lock`) — with no lockfile each machine gets different versions, and the scanner does not know which version is really used

## 2 · Group by real risk, not by the scanner's severity label

Answer 3 questions per entry, then fill the table `| แพ็กเกจ | เวอร์ชัน | ช่องโหว่ | ใช้ถึงโค้ดที่เสี่ยงไหม | ตรง/ผ่านตัวอื่น | มีเวอร์ชันแก้ไหม | ทำอะไร |` (package · version · vulnerability · reaches the risky code · direct/via another · fixed version available · action)

| Question | Look at | Effect on the decision |
|---|---|---|
| Does our code call the vulnerable function, and can outside input reach it | `grep` the function name in the advisory · the path of input | Does not reach → may be downgraded, but the reason must be recorded, not closed silently |
| Referenced directly or through another package (transitive) | `npm ls <pkg>` · `pipdeptree -r -p <pkg>` · `dotnet nuget why <pkg>` | transitive → fix at the parent first, and if the parent has no new version yet, override in the lockfile and note that it must be removed when the parent is fixed |
| Is there a fixed version | The `fixed in` field of the advisory | None → find a replacement package, or close the input's entry path and record it as an accepted risk in `decision-log` |

Resulting summary: **fix now** (really reached + a fix exists) · **fix next round** (cannot be reached, but a fix exists) · **accept the risk temporarily** (no fix — the user must see it and agree)

## 3 · Update order — small first, split the large ones out so they are visible

1. All **patch** updates in one round (1.2.3 → 1.2.9) — by the semver contract they do not change behaviour, but you still must run tests
2. **minor** may be combined if in the same group (for example the `@angular/*` set together) · read the release notes for the word deprecated
3. **major — 1 PR per 1 package**: read the migration guide first, change the code accordingly, then run the whole test set · never bundle 2 majors in one PR, because when it breaks you will not know which one
4. A package nobody maintains any more (no release over 2 years · open security issues) → open a separate task to find a replacement, do not hide it inside an update PR

Automatic route: turn on **Renovate** or **Dependabot** to file PRs in the order above by themselves (group patch+minor automatically · major in its own PR · set the day of the week) — a person still must read the release notes and merge, and never auto-merge a major

## 4 · Prove it before closing the entry

- The whole test set is green and the build passes from a clean machine with the committed lockfile
- **Walk the vulnerability's original path again** — if the advisory says input of form X makes it break, really send X in (in a sandbox) and see that it does not break · write it as a test if you can, so it does not regress when someone downgrades
- Re-run the scanner of item 1, and that entry must be gone, not merely have its version changed in the file

## 5 · Record

- `CHANGELOG.md` under the heading Security: package · from → to · vulnerability ID (CVE or GHSA) · 1 line on whether we reach that vulnerability
- Entries with an accepted risk or an override in the lockfile → `decision-log` with the date to come back and look
- That round's gate report (`qa/security/<วัน>-gate.md`) points to the CHANGELOG instead of writing it again


## reference: owasp-contract-clause.md

# OWASP Top 10:2025 clause for contracts and the Software Requirements Specification (SRS)

This draft is a starting point, not legal advice. Have `legal-compliance-officer` or the client's lawyer review the real contract. For a full Thai contract draft, use `e-commerce:doc-contract-th`.

## Why the clause must be measurable

"The system must be secure per OWASP" cannot be measured, and the two sides will argue at handover. Write it as **acceptance criteria** that can be checked one item at a time, and state what is out of scope.

## Draft clause (Thai, paste into the contract as written)

> **ข้อ X ความปลอดภัยของระบบ**
>
> X.1 ผู้รับจ้างจะพัฒนาระบบโดยมีมาตรการรองรับความเสี่ยงทั้ง 10 ข้อของ Open Worldwide Application Security Project (OWASP) Top 10 ฉบับปี 2025 (A01 ถึง A10)
>
> X.2 ก่อนส่งมอบแต่ละงวด ผู้รับจ้างจะส่งรายงานผลการตรวจ OWASP Top 10:2025 ซึ่งระบุ สำหรับแต่ละข้อ (ก) มาตรการที่ใช้ (ข) วิธีตรวจและเครื่องมือที่ใช้ (ค) หลักฐานผลการตรวจ และ (ง) สถานะ ผ่าน · ผ่านโดยการตรวจเอกสารหรือการตั้งค่าพร้อมระบุไฟล์ที่ตรวจ (สำหรับข้อที่ทดสอบอัตโนมัติไม่ได้) · ไม่ผ่าน · ไม่เกี่ยวข้องพร้อมเหตุผล · ยอมรับความเสี่ยงตามข้อ X.4 · ยังไม่ได้ตรวจพร้อมเหตุผล
>
> X.3 งวดงานจะถือว่าผ่านเกณฑ์ด้านความปลอดภัยเมื่อ (ก) ไม่มีข้อใดมีสถานะไม่ผ่าน (ข) ไม่มีข้อใดมีสถานะยังไม่ได้ตรวจ และ (ค) ไม่มีช่องโหว่ระดับวิกฤต (Critical) หรือสูง (High) ที่ยืนยันแล้วค้างอยู่ในโค้ดหรือไลบรารีที่ใช้ ณ วันส่งมอบ โดยวัดระดับตามคะแนน Common Vulnerability Scoring System (CVSS) รุ่น 3.1 ขึ้นไป ที่เครื่องมือตรวจในภาคผนวกรายงาน · ช่องโหว่ที่ยังไม่มีเวอร์ชันแก้ไขจากผู้พัฒนาไลบรารี ผู้รับจ้างจะแจ้งพร้อมมาตรการบรรเทา แล้วให้ใช้ข้อ X.4
>
> X.4 ข้อใดที่ผู้ว่าจ้างตกลงยอมรับความเสี่ยง ให้บันทึกเป็นลายลักษณ์อักษร พร้อมชื่อผู้อนุมัติและวันที่
>
> X.5 ขอบเขตนี้ไม่รวม (ก) การทดสอบเจาะระบบ (penetration test) โดยบุคคลภายนอก เว้นแต่ตกลงไว้ในภาคผนวก (ข) โครงสร้างพื้นฐานและเซิร์ฟเวอร์ที่ผู้ว่าจ้างจัดหาและดูแลเอง (ค) ช่องโหว่ที่ประกาศหลังวันส่งมอบ ซึ่งให้เป็นไปตามข้อตกลงการดูแลรักษาระบบ (ถ้ามี)
>
> X.6 การตรวจตามข้อนี้ไม่ใช่การรับรองว่าระบบปลอดภัยโดยสมบูรณ์

## Draft for the SRS — security non-functional requirements (NFR) section (Thai, paste as written)

| รหัส | ความต้องการ | วิธีตรวจรับ |
|---|---|---|
| NFR-SEC-01 | ระบบรองรับ OWASP Top 10:2025 ครบ A01–A10 | รายงานผลการตรวจตามข้อ X.2 ผ่านเกณฑ์ข้อ X.3 |
| NFR-SEC-02 | ทุก endpoint ตรวจสิทธิ์ฝั่ง server และผู้ใช้เข้าถึงได้เฉพาะข้อมูลของตน | ชุด test ด้านสิทธิ์ (A01) ผ่านทั้งหมด |
| NFR-SEC-03 | ไม่มี dependency ที่มีช่องโหว่ระดับ critical หรือ high (ตาม CVSS) ณ วันส่งมอบ ยกเว้นตามข้อ X.3 | ผลสแกน dependency ในภาคผนวกรายงาน |
| NFR-SEC-04 | admin และธุรกรรมเงินใช้การยืนยันตัวตนหลายชั้น (MFA) | ชุด test ด้าน login (A07) |
| NFR-SEC-05 | เหตุการณ์ความปลอดภัยมี log และแจ้งเตือน | ชุด test ด้าน log (A09) + ตัวอย่าง log |

Add or remove rows to fit the system. Every row needs an acceptance check ("วิธีตรวจรับ") that can really be done.


## reference: owasp-stack-checks.md

# OWASP Top 10:2025 by the stacks the team uses

Open this file when writing code and when filling in the report. Each item says what to use and what to avoid. Where a framework default is already secure, use it and do not write your own.

- [.NET / ASP.NET Core](#net--aspnet-core)
- [TypeScript · Node · Angular](#typescript--node--angular)
- [Python (FastAPI · Django · Flask)](#python-fastapi--django--flask)
- [SQL (SQL Server · PostgreSQL · MySQL)](#sql-sql-server--postgresql--mysql)
- [Tools for proving each item](#tools-for-proving-each-item)

---

## .NET / ASP.NET Core

| Item | Use | Avoid |
|---|---|---|
| A01 | `FallbackPolicy` so every endpoint requires login, then open only the intended ones with `[AllowAnonymous]` · check record ownership with `IAuthorizationService` + a resource-based policy · old ASP.NET MVC: `[Authorize]` at controller level + a global filter · antiforgery token on every form (`[ValidateAntiForgeryToken]` or `AutoValidateAntiforgeryTokenAttribute` app-wide) · take input through a ViewModel or DTO, never bind an entity directly | Hiding a button in the view and calling that access control · looking up the DB by the id in the URL without filtering by user |
| A02 | `app.UseExceptionHandler` + `UseHsts` in production · `customErrors mode="RemoteOnly"` (old MVC) · remove the `Server` · `X-Powered-By` headers | Enabling `UseDeveloperExceptionPage` in production · keeping the connection string in a committed `appsettings.json` |
| A03 | `dotnet list package --vulnerable --include-transitive` · `Directory.Packages.props` to control versions in one place · SBOM: `dotnet CycloneDX` | Using packages nobody maintains any more (check the last release date) |
| A04 | ASP.NET Core Identity (PBKDF2) or `Rfc2898DeriveBytes.Pbkdf2` · Data Protection API for values that must be decrypted · secrets in User Secrets or Key Vault | `MD5` · `SHA1` · `DES` · writing your own crypto |
| A05 | EF Core LINQ · `FromSqlInterpolated` · Dapper with parameters · Razor encodes HTML itself | `FromSqlRaw` with string concatenation · `Html.Raw` with user data · `Process.Start` with input |
| A07 | Identity: `Lockout.MaxFailedAccessAttempts` + `PasswordSignInAsync(..., lockoutOnFailure: true)` (the scaffolded Login page sets it to false) · cookie `HttpOnly` `Secure` `SameSite` · JWT: set `ValidateIssuer` `ValidateAudience` `ValidateLifetime` `ValidateIssuerSigningKey` = true | `ValidateLifetime = false` · accepting algorithm `none` |
| A08 | `System.Text.Json` · verify webhook Hash-based Message Authentication Code (HMAC) signatures with `CryptographicOperations.FixedTimeEquals` | `BinaryFormatter` · Newtonsoft `TypeNameHandling.All` |
| A09 | structured `ILogger` (Serilog) · log login results and permission denials · strip secrets with a destructuring policy | Logging the whole request body when it holds passwords |
| A10 | A central `IExceptionHandler` (.NET 8 and later; register `AddExceptionHandler<T>()` + `AddProblemDetails()` **and** put `app.UseExceptionHandler()` in the pipeline, or the handler never runs) that returns `ProblemDetails` · older .NET: `UseExceptionHandler` with a lambda or path · wrap multi-step work in `TransactionScope` or `BeginTransaction` · `CancellationToken` + an `HttpClient` timeout | An empty `catch { }` · a `catch` that returns `true` from an authorization check |

## TypeScript · Node · Angular

| Item | Use | Avoid |
|---|---|---|
| A01 | One authorization middleware on the top-level router (deny by default) · filter every query by the session's `userId` · an Angular route guard only hides pages, so check real permissions at the API · SSRF: allowlist hosts before `fetch` on a user-supplied URL · CSRF token when using cookie sessions · validate the body with a schema (zod), then pick only the allowed fields | Trusting a `role` sent by the client · `Object.assign(entity, req.body)` · `cors({ origin: true, credentials: true })` |
| A02 | `helmet()` · `NODE_ENV=production` · turn off source maps in the production build · Express `app.disable("x-powered-by")` | Sending `err.stack` back to the client |
| A03 | `npm ci` + `package-lock.json` · `npm audit --omit=dev` · SBOM: `npx @cyclonedx/cyclonedx-npm` · check `postinstall` of new packages | Running `npm install` on a package whose name looks like a popular one (typosquat) without checking the maintainer |
| A04 | `argon2` or `bcrypt` · `crypto.randomBytes` · `crypto.timingSafeEqual` | `Math.random()` for tokens · `crypto.createHash("md5")` on passwords |
| A05 | An ORM (Prisma · TypeORM) or `$1` parameters · Angular escapes by itself · `execFile` with arguments as an array | `innerHTML` · `bypassSecurityTrustHtml` with user data · `eval` · `exec` with string concatenation · `new Function` |
| A07 | `express-rate-limit` on `/login` · cookie `httpOnly` `secure` `sameSite` · JWT: `jwt.verify(token, key, { algorithms: ["RS256"], issuer, audience })` (fix the algorithm you really use) | Keeping tokens in `localStorage` in a system with sensitive data · `jwt.decode` instead of `verify` |
| A08 | Verify the webhook signature before `JSON.parse` · Subresource Integrity (SRI) on scripts from a CDN | `node-serialize` · loading a CDN script without `integrity` |
| A09 | pino or winston in JSON · `redact: ["req.headers.authorization", "*.password"]` | `console.log(req.body)` |
| A10 | An Express error middleware as the last one · `process.on("unhandledRejection")` logs, then shuts down cleanly · ORM transactions · `AbortSignal.timeout()` with `fetch` | `.catch(() => {})` · a promise nobody awaits |

## Python (FastAPI · Django · Flask)

| Item | Use | Avoid |
|---|---|---|
| A01 | FastAPI `Depends(current_user)` at router level · Django `LoginRequiredMixin` + `get_object_or_404(Model, pk=..., owner=request.user)` · SSRF: allowlist hosts before `httpx.get` · keep the Django CSRF middleware on · take input with a Pydantic model or Django `ModelForm(fields=[...])` | `Model.objects.get(pk=id)` without filtering by owner · `fields = "__all__"` · `@csrf_exempt` on a whole view without a reason |
| A02 | Django `DEBUG=False` · `SECURE_*` settings · `python manage.py check --deploy` · turn off FastAPI `/docs` in production unless it is meant to be open | `DEBUG=True` · `ALLOWED_HOSTS=["*"]` |
| A03 | A lockfile (`uv.lock` · `poetry.lock` · `requirements.txt` with pinned versions + `--require-hashes`) · `pip-audit` · SBOM: `cyclonedx-py environment` (or `requirements` · `poetry`) | `pip install` from an unknown URL |
| A04 | `argon2-cffi` · the Django default password hasher · `secrets.token_urlsafe` · `hmac.compare_digest` | `hashlib.md5(password)` · `random` for tokens |
| A05 | An ORM or `cursor.execute(sql, params)` · Jinja2 `autoescape=True` · `subprocess.run([...])` as a list | An f-string in SQL · `shell=True` with input · `eval` |
| A07 | `slowapi` or django-axes against rapid login attempts · PyJWT: `jwt.decode(token, key, algorithms=["RS256"], audience=..., issuer=...)` (fix the algorithm you really use) | `jwt.decode(..., options={"verify_signature": False})` |
| A08 | Verify the webhook signature with `hmac.compare_digest` · `yaml.safe_load` · `json` | `pickle.loads` · `yaml.load` on external data |
| A09 | Structured `logging` (structlog) · a filter that strips secrets | Logging the whole of `request.headers` |
| A10 | FastAPI `@app.exception_handler(Exception)` · Django `handler500` · `with transaction.atomic():` · a timeout on every `httpx` call | `except Exception: pass` · an authorization check that does `except` then `return True` |

## SQL (SQL Server · PostgreSQL · MySQL)

| Item | Use | Avoid |
|---|---|---|
| A01 | The app's user has only the rights it needs (not `sa` · `postgres` · `root`) · a separate read-only user for reports · Row-Level Security (RLS) in PostgreSQL or SQL Server for multi-tenant systems | Letting the app use the database owner's user |
| A02 | Close the DB port to the outside · force TLS on connections · turn off `xp_cmdshell` | Exposing the DB to the internet |
| A04 | Transparent Data Encryption (TDE) or disk-level encryption · encrypt sensitive columns at app level or with Always Encrypted · encrypted backups | Storing national ID numbers or credit card numbers as plain text |
| A05 | Stored procedures or parameterized queries · if you must build dynamic SQL, use `sp_executesql` with parameters and `QUOTENAME` on object names | `EXEC('... ' + @input)` · building table names from input |
| A09 | Audit the money and permission tables (trigger or temporal table) · log failed DB logins | Turning off auditing for speed |
| A10 | `BEGIN TRY ... BEGIN CATCH ... ROLLBACK` · `SET XACT_ABORT ON` · migrations that can run again (`IF NOT EXISTS`) | A migration that fails halfway and leaves half-built tables |

## Tools for proving each item

| Purpose | Tool | Covers |
|---|---|---|
| Secrets · dependencies · risky code · Infrastructure as Code (IaC) config files | As in [`security-gate`](../../security-gate/SKILL.md) (gitleaks · npm audit · pip-audit · dotnet · osv-scanner · trivy · semgrep) | A02 · A03 · A04 · A05 · A08 |
| OWASP-specific semgrep rules | `semgrep scan --config p/owasp-top-ten --metrics=off` (needs internet) · offline, use the `security-gate` ruleset | A01 · A04 · A05 · A08 |
| Scan a running app (headers · cookies · error pages) | OWASP ZAP (Zed Attack Proxy) baseline, against the project's own test environment only: `docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t <test URL>` | A02 · A05 · A07 |
| SBOM | CycloneDX per language (above), stored in `qa/security/sbom/` | A03 |
| Tests for permissions · login · errors · webhooks | The project's integration tests, with names starting with the item code (`A01_...`) | A01 · A06 · A07 · A08 · A09 · A10 |

- ZAP sends real attacks. Use it only on a test environment the team deployed itself. Never run it on production or on someone else's system without written permission.
- If a tool cannot run, write `ยังไม่ได้ตรวจ` (not yet checked) with the reason in the report. Never conclude "pass" from an empty result.


## reference: owasp-top10.md

# OWASP Top 10:2025 — a delivered system must pass an item-by-item checklist

An extension of [`SKILL.md`](../SKILL.md) · use when building or delivering a web app or API whose contract or security requirement (NFR) names OWASP Top 10:2025

> A web-app contract may say "must pass OWASP Top 10:2025", but nobody can issue a certificate like that
> What can really be delivered is **a report that says, item by item A01–A10, what controls it, what checks it, and what evidence there is**
> This file makes every system the team builds have that report, from design to delivery

Open Worldwide Application Security Project (OWASP) Top 10:2025 is the list of the 10 most common and most serious web-app risks, in its latest edition (original: owasp.org/Top10/2025)

Use together with: [`principle-secure-by-default`](../../principle-secure-by-default/SKILL.md) (writing code) · [`security-gate`](../SKILL.md) (scan before sending) · the command `/software-development:threat-model` (design) · agent `security-engineer` (in-depth report)

---

## 1 · The 10 items, and what the system must have

Each item has 3 parts → **must have** (what code and configuration must do) · **prove with** (a test or tool that can really run) · **business-owner wording** (for explaining to the customer and in the report)

| Item | Risk | Business-owner wording (ภาษาเจ้าของกิจการ) | Must have | Prove with |
|---|---|---|---|---|
| A01 | Broken Access Control | ลูกค้าคนหนึ่งเห็นข้อมูลของอีกคนได้ | Check permissions server-side on every endpoint · deny by default · check ownership of the record every time one is read or changed by id · stop the server from fetching internal URLs (Server-Side Request Forgery (SSRF)) with an allowlist · Cross-Origin Resource Sharing (CORS) never `*` together with cookies · a system using cookie sessions must have a token against forged requests on the user's behalf (Cross-Site Request Forgery (CSRF)) · accept input through a Data Transfer Object (DTO) or an allowed-field list, never bind a whole object (stops a client sending `role` · `isAdmin` itself) | integration test per endpoint: not logged in → 401 · wrong role → 403 · another person's id → 403 or 404 · POST with no CSRF token → 403 (cookie-based systems) · sending an extra `role` field → the value in the database does not change |
| A02 | Security Misconfiguration | ตั้งค่าเซิร์ฟเวอร์หละหลวม เปิดหน้า admin ทิ้งไว้ | Configure by the same script in every environment, differing only in secrets · turn off debug · stack traces · directory listing · sample admin pages · add security headers (Content Security Policy (CSP) including `frame-ancestors` · HTTP Strict Transport Security (HSTS) · X-Content-Type-Options) · no default passwords · cloud storage not public | Scan headers (OWASP ZAP (Zed Attack Proxy) baseline) · `trivy config .` · a test that production returns errors with no stack trace |
| A03 | Software Supply Chain Failures | ใช้ไลบรารีเก่า หรือมีช่องโหว่ | Lockfiles for every language · a list of software components (Software Bill of Materials (SBOM)) · no dependency with a critical or high vulnerability · cut what is not used · pull only from official registries | `security-gate` dependency side (npm audit · pip-audit · `dotnet list package --vulnerable` · osv-scanner) · SBOM in CycloneDX form |
| A04 | Cryptographic Failures | ไม่เข้ารหัสรหัสผ่านและข้อมูลสำคัญ | Transport Layer Security (TLS) 1.2 or higher everywhere + HSTS · passwords use Argon2id · bcrypt · PBKDF2 (never MD5 · SHA-1 · plain SHA-256) · sensitive data encrypted at rest · secrets outside code · store only the data you use | semgrep (crypto rules) · a test that passwords in the DB are not the original text · check the TLS of the deployed server |
| A05 | Injection | กรอกคำสั่งในช่องค้นหา แล้วดึงฐานข้อมูลได้ | SQL only through parameters or an ORM · never concatenate strings into shell commands · HTML-escape on output (stops Cross-Site Scripting (XSS)) · validate input at the system boundary | semgrep · a test sending `' OR 1=1--` · `<script>` · `; rm` which must not take effect |
| A06 | Insecure Design | ออกแบบผิดตั้งแต่ต้น เช่น ใช้คูปองซ้ำได้ | threat model of login · permissions · money · personal data before writing · business rules enforced at the server (cannot reuse · balance cannot go negative · repeating does not charge twice) · rate limit · file upload: check the type from the file contents, limit size, store outside the web root, rename ([`file-upload-and-storage`](../../file-upload-and-storage/SKILL.md)) | The threat model document · a test uploading a `.php` · `.exe` renamed to `.jpg` → rejected · an abuse-case test, at least 1 per business rule about money or permissions |
| A07 | Authentication Failures | เดารหัสได้ไม่จำกัด ไม่มี MFA | Limit failed logins · multiple-factor authentication (Multi-Factor Authentication (MFA)) for admin and money work · passwords at least 15 characters (8 if MFA is present per National Institute of Standards and Technology (NIST) Special Publication (SP) 800-63B-4) and check against lists of leaked passwords · a failed-login message does not reveal whether the user exists · session id random from the server and rotated after login · JSON Web Token (JWT) checks `iss` `aud` `exp` and the algorithm | test: N failed logins → delayed or locked · expired token → 401 · the failure message is the same for existing and non-existing users |
| A08 | Software or Data Integrity Failures | อัปเดตหรือข้อมูลถูกแก้ระหว่างทาง โดยไม่ตรวจ | Never deserialize outside data into an object that can run code · webhooks verify signatures · update files verify a checksum or signature · the automatic delivery pipeline (CI/CD) uses least privilege and has no secrets in logs · prices and amounts are computed at the server and values from the client are not trusted | test a webhook with a wrong signature → rejected · test sending a fake price from the client → the server's price is used |
| A09 | Security Logging and Alerting Failures | ถูกเจาะแล้วไม่มีใครรู้ ไม่มี log | Log successful and failed logins · permission denials · failed input validation · admin actions · money changes — with time · who · what · result · no passwords, tokens, or ID-card numbers in logs · an alert when logins fail in bursts | a test that a failed login leaves a log line · searching the logs for secrets must find none · see `audit-trail` · `logging-standards` |
| A10 | Mishandling of Exceptional Conditions | ระบบล่มแล้วแสดงข้อมูลภายใน หรือเปิดช่องให้ผ่าน | Every error is caught, with a global handler as the last gate · on failure **close**, not open (permission check errors → deny) · a transaction that does not complete must roll back · error messages shown to users carry no stack trace or SQL · limit quota · timeout | test: make the DB or an external service fail mid-operation → a normal error, and data is not left half done · permission check throws → 403, not let through |

**Items that do not apply**: write `ไม่เกี่ยว` (not applicable) with a 1-line reason, for example A07 in a system with no login at all · never leave blank

How to write it for the team's stacks (.NET · TypeScript/Node/Angular · Python · SQL) → [`owasp-stack-checks.md`](owasp-stack-checks.md)

---

## 2 · When to use it in the job

| Phase | Do | Get |
|---|---|---|
| Taking the job · writing the contract | Put in the requirements and acceptance criteria per [`owasp-contract-clause.md`](owasp-contract-clause.md) · put in the requirements document (Software Requirements Specification (SRS)) security category (`srs-writing`) | Customer and team agree on what "pass" means |
| Design | threat model of login · permissions · money · personal data (A01 · A06 · A07) · state roles and permissions as a table | `docs/security/threat-model.md` |
| Writing code | Follow the "must have" column and [`owasp-stack-checks.md`](owasp-stack-checks.md) · make every item that can be so a reusable shared piece (one permission checker · one error handler · one logger) | Code where the safe way is the easiest way |
| test | Write tests per the "prove with" column, put them in the normal test folder, named starting with the item code, such as `A01_other_user_order_returns_404` | Evidence that can be re-run every time |
| Before delivery | Run `security-gate`, then fill [`assets/owasp-report.md` (in the security-gate folder)](../assets/owasp-report.md) item by item | `qa/security/<ปี-เดือน-วัน>-owasp.md` |

---

## 3 · The report before delivery — rules

- 1 row per item, all of A01–A10 · status uses only these 6 values

  | Status | Deliverable | Write when |
  |---|---|---|
  | `ผ่าน` (pass) | Yes | There is evidence that can be run — test name + run result · tool name + result file |
  | `ผ่าน (ตรวจด้วยตา)` (pass, checked by eye) | Yes, if it says which file was checked and that item truly cannot have a test written | For example a server configuration the team did not deploy a test for |
  | `ไม่เกี่ยว — <เหตุผล>` (not applicable — <reason>) | Yes | The system has no such part at all |
  | `ยอมรับความเสี่ยง — <วันที่ · ใคร>` (risk accepted — <date · who>) | Yes | The customer approved in writing, recorded in `decision-log` |
  | `ไม่ผ่าน` (fail) | No | A confirmed vulnerability was found |
  | `ยังไม่ได้ตรวจ — <เหตุผล>` (not yet checked — <reason>) | No | The tool cannot run or it has not been done |

- **Deliverable when** there is no `ไม่ผ่าน` item and no `ยังไม่ได้ตรวจ` item
- **An item that is `ไม่ผ่าน` is written as a finding block, one per entry** (template in `assets/owasp-report.md` (in the security-gate folder)) — ID `F-01` · file:line · item A0x + the Application Security Verification Standard (ASVS) level it must reach (L1 every system · L2 has personal data or transactions · L3 money, health, critical infrastructure) · impact in business-owner wording · fix · evidence used to confirm (command · test · image) · 1 block per vulnerability, never several spots in one row (idea from agamm/claude-code-owasp (MIT))
- Always include a section **scope not checked**, for example penetration testing by outsiders · the customer's servers the team did not deploy · libraries with no vulnerability data
- Never write "100% secure" or "OWASP certified" — OWASP issues no certificates · if it can be delivered, write "passes the OWASP Top 10:2025 criteria per the checklist in this report"
- The totals count all 6 statuses separately, for example `ผ่าน 7 · ผ่าน (ตรวจด้วยตา) 1 · ไม่เกี่ยว 2 · ยอมรับความเสี่ยง 0 · ไม่ผ่าน 0 · ยังไม่ได้ตรวจ 0`
- Summarise the status into `docs/BUILD-PLAN.md` with `status-report` of type `ตรวจ` (check) (who did it · who checked · check result `ผ่าน — ผ่าน 8 · ไม่เกี่ยว 2` or `ไม่ผ่าน — A01 · A07`)

---

## 4 · Who does what

| Part | agent |
|---|---|
| Contract and SRS requirements | `business-analyst` · legal clauses → `legal-compliance-officer` |
| threat model · permissions table · design review | `security-engineer` |
| Code and tests per the "must have" · "prove with" columns | `developer` (and the agent for the stack) |
| Scan and fill the report | `security-engineer` through `security-gate` |
| Check the report before sending to the customer | a new `reviewer` — every row marked `ผ่าน` (pass) must have evidence that can really be opened |

---

## 5 · Not this file's job

- Real penetration testing, or testing someone else's system — this file checks only this project's code and test environment
- Other standards, such as OWASP API Security Top 10 · Application Security Verification Standard (ASVS) · Payment Card Industry Data Security Standard (PCI-DSS) · the Personal Data Protection Act (PDPA) — use the skill for that topic (`fintech-payments` · `pdpa-compliance`), but this report can be used as a common base
- Mobile apps — use OWASP Mobile Top 10 together with [`android.md`](android.md) · the backend of a mobile app still uses this file
