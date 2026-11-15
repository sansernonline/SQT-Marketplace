---
name: testing-standards
description: Use when setting up automated tests or fixing flaky ones
---

# Testing Standards

> **One rule:** a test nobody trusts is worse than no test.
> A test that flips between red and green on its own gets `skip`ped within 2 weeks, and then the whole suite dies with it.

## When to use this skill

- Starting tests in a new project, or adding tests to existing code
- Someone asks "have unit tests / automate the tests"
- The existing suite is slow, flips red and green, or nobody maintains it

## When **not** to use it

- E2E through a browser (Playwright/Cypress): use `e2e-testing-patterns`
- Driving a real mobile app on an emulator: use `app-verifier-setup` (`references/android-native.md`)
- Designing business-level test cases before writing: use `test-case-template`

---

## 1 · First: use what exists; ask only when a new one must be added

- **If the project already has a framework, or the stack ships a test library with its SDK** (Flutter `flutter_test` · Angular CLI), use it. Do not ask.
- **If a new test package must be installed**, put this question into the single round of questions before starting (if the tool has a picker for answers, such as `AskUserQuestion`, use it), because switching later after a wrong choice is very expensive.
- If you only discover mid-work that a choice is needed, pick the **recommended** one in the table and continue, then record it under the "ตัดสินใจเอง" (decided on my own) heading of the report. Do not stop to ask midway.

2 things to settle:

**Item 1 — framework**

| Stack | Options to offer |
|---|---|
| .NET | **xUnit** (recommended · the standard of modern .NET) · NUnit (a team coming from NUnit) · MSTest (organizations tied to VS) |
| Node/TS | **Vitest** (recommended · fast, little setup, ESM/TS work out of the box) · Jest (largest ecosystem) · `node:test` (when you want to install nothing) |
| Python | **pytest** (recommended) · `unittest` (pure stdlib; no extra packages allowed) |
| Angular | **Vitest that ships with Angular CLI** (`ng test` · recommended · default for new projects) + Testing Library if wanted · Jasmine + Karma (the old default, still usable) · very old versions use Analog |
| Flutter · Dart | **`flutter_test`** (ships with the SDK, no need to ask) · fake with a class that `implements` the real one, before installing `mocktail` |

**Item 2 — the scope wanted now**

- unit only (fast, touches no DB/network)
- unit + integration (touches a real DB through Testcontainers, using the same DB type as production · in-memory SQLite is allowed only when production is also SQLite)
- the full set including E2E (continue to `e2e-testing-patterns`)

> If the project **already has a framework**, do not ask; use the existing one, because having 2 systems in one project
> is worse than using one you do not quite like.

---

## 2 · The pyramid — a ratio that lasts

```
        ▲  E2E  5%      ช้า เปราะ แพง — เอาไว้ทดสอบ "เส้นทางที่ทำเงิน" เท่านั้น
       ╱ ╲
      ╱   ╲ Integration 20%   ต่อ DB/API จริง ทดสอบว่าชิ้นส่วนคุยกันรู้เรื่อง
     ╱     ╲
    ╱       ╲ Unit 75%        ไม่แตะอะไรข้างนอก รันจบใน < 100ms ต่อตัว
   ╱_________╲
```

**A mobile app has a widget test layer (Flutter) or component test layer (React Native)** between unit and E2E. This layer builds the real screen in memory, then taps and reads it without an emulator. Most mobile apps have no integration tests that connect to a DB, so this layer is used as the main middle layer instead.

**The whole unit suite must finish in 10 seconds** (Flutter: count after compilation finishes, because merely starting `flutter test` takes several seconds · this number is รอยืนยัน (to be confirmed) on a real machine).
If it takes longer, people stop running it before commit, and a broken test is only found in CI, which is too late.

---

## 3 · What needs a test / what does not

**Must have**
- Business logic: calculations, permission conditions, state transitions
- Every edge case: empty value, zero, negative, lower/upper bound, duplicates
- **Every bug that has happened** — write a test that is red first, then fix (regression test)
- Contracts others depend on: the API response shape, the event schema

**Not needed**
- getters/setters, DTOs, direct mappings
- framework code (no need to test whether EF Core can save)
- other people's libraries
- UI that only displays with no logic

> **Honest coverage: 70–80% of business logic**, not 100% of the whole project.
> Chasing 100% gives you fake tests written just to make the number look good.
> A gate of "must not drop below the current level" is more useful than a target number.

---

## 4 · How to write

**Naming** — reading the name must tell you what broke, without opening the code

```
MethodName_Scenario_ExpectedResult

CalculateDiscount_WhenMemberIsGold_Returns15Percent
CreateOrder_WhenStockIsZero_ThrowsOutOfStock
ParseDate_WhenInputIsEmpty_ReturnsNull
```

In languages where the test name is a string (Dart · Vitest · Jest), use `group('<what is tested>')` + `test('<scenario> → <expected result>')` as a sentence, e.g. `group('verdict')` · `test('below 50 lux is too dark for reading')`

**AAA structure** — separate the 3 parts with blank lines so they are clearly visible

```
// Arrange   เตรียมข้อมูลและ dependency
// Act       เรียกสิ่งที่ทดสอบ — บรรทัดเดียว
// Assert    ตรวจผล
```

**1 test = 1 reason to break.** If there are 5 unrelated asserts, split into 5 tests.

**Be able to say, before writing, which code change makes this test go red** (adapted from superpowers `test-driven-development` · MIT)
- Cannot say → this test does not catch behavior. Rewrite it to catch an observable result.
- The answer is "the text in the source file changes" → you are testing characters. Run the real thing and check the result instead.
- It goes red only when someone deliberately changes a value (e.g. changes a label color) → it is a change detector, not a behavior test. Move to testing what that value affects.

**No logic in tests** — no `if`, no loop that computes the expected value.
To run several cases, use a parameterized test (`[Theory]` / `test.each` / `@pytest.mark.parametrize`).

**Make results the same every time**
- Time: inject `TimeProvider` (.NET 8+) or `now()`; do not call `DateTime.Now` directly in the code under test.
- Randomness: fix the seed.
- Order: tests must run in any order; never depend on state a previous test left behind.
- **No `sleep`** to wait for async — use a fake timer or wait for a real signal.

**Mock only what is necessary** — mock boundaries outside the system (HTTP, queues, time, files).
Do not mock your own purely computational classes. If you mock too much, the test is tied to how the code is written;
one refactor turns the whole suite red even though behavior did not change.

---

## 5 · Integration test

- Use a **real DB of the same type as production** (Testcontainers), not SQLite instead of PostgreSQL,
  because SQL that passes on SQLite may break on the real one.
- Each test starts from a known state — transaction rollback or truncate every time.
- Separate the command from unit so they can run separately (`npm run test:unit` / `test:integration`).
- Test the API **contract**: status code, JSON shape, important headers — not just "no error".

---

## 6 · CI

```
push / PR → lint → unit (< 10 วินาที) → integration → build
```

- **Red test = cannot merge**, no exceptions.
- No `skip`/`ignore` left in the main branch — to skip, an issue link must be attached.
- A flaky test (flips red and green on its own) must be **fixed or deleted**; never retry until green, because that hides a bug.
- Show the coverage report on the PR page so it is visible whether it rose or fell.

Command details and config files for each framework are in `references/per-stack.md`.

---

## 7 · Review

- [ ] Used the existing framework or the one that ships with the stack; if a new one was installed, it was asked or recorded under "ตัดสินใจเอง"
- [ ] `npm test` / `dotnet test` / `pytest` / `flutter test` passes from a clean machine with no extra setup (long output → `> _to_delete/test.txt 2>&1` then `tail -20`)
- [ ] The unit suite finishes in 10 seconds
- [ ] Shuffling the test order still gives all green (pytest: install `pytest-randomly` then run plain `pytest` · Vitest: `--sequence.shuffle` · Jest: `--randomize` · Flutter: `--test-randomize-ordering-seed random`)
- [ ] 3 repeated runs give the same result (not flaky)
- [ ] Break the code deliberately in 1 spot, and the test **must go red** — if still green, the test tests nothing
- [ ] **Try breaking it in your head before closing the test file** — go through 5 ways: wrong constant or argument · entering the wrong branch · forgetting to change state or a side effect · returning empty or a default · not checking 0 · empty · null · no permission · wrong format — any way that makes no test red means that behavior is not yet protected by anyone
- [ ] Reading the test name tells you what broke, without opening the code
- [ ] No `sleep` / `Thread.Sleep` in the test suite
- [ ] No test left skipped without a reason attached

---

## 8 · Anti-patterns

- **Writing tests after the work is done just to pass the gate** — you get tests that confirm the code does what it does,
  not what it should do
- **Asserting only "does not throw"** — tests nothing at all
- **A test that depends on the previous test** — red at once when run alone
- **Mocking everything until the test tests only the mock**
- **`sleep(1000)` to wait for async** — slow and still brittle
- **Retrying a flaky test until green** — you just hid a bug that really happens in production
- **Chasing 100% coverage** — writing tests for getters for the number
- **Test data that is real customer data** — illegal and easy to leak; use a fake-data generator

---

## 9 · Link to other skills

| Need | Use together with |
|---|---|
| E2E through a browser | `e2e-testing-patterns` |
| E2E for a mobile app (`integration_test` · `adb`) | `app-verifier-setup` |
| Design test cases before writing code | `test-case-template` |
| Test health/ping endpoints | `web-service-essentials` |
| Logs that help trace a problem when a test is red | `logging-standards` |
| Review test code | `code-review-checklist` |
