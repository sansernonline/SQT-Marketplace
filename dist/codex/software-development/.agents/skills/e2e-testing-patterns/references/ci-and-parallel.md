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
