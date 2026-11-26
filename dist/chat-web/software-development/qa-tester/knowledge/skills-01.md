# skill: test-case-template

Use when writing test cases or a test plan

# Test Case Template — test cases (`TC-<MODULE>-<NUMBER>`) that trace to requirements, with a coverage matrix

## Use when
- Converting a user story / acceptance criteria into test cases, or designing scenarios for a new feature.
- Building a regression suite, or reviewing coverage gaps.

Not for: 1 defect already found → `bug-report-template` · running cases and collecting evidence (GIF), pass/fail report → `test-evidence` · sorting a pile of bug reports → `bug-inbox-triage` · unit/integration/E2E ratio or test code → `testing-standards` · `e2e-testing-patterns`.

## Steps
1. **Look for an existing format first.** Check the customer's or QA team's format: Excel/CSV in `docs/` or `ref/` · the tool in use (TestRail · Zephyr · Xray · Azure Test Plans) and its mandatory fields · the project's earlier test case set (columns, ID system, priority levels). If found, use it and say which file it came from; if not, use the template below and say none was found. In every format, IDs continue from the existing set and expected results still come from the requirements.
2. **Place the file.** Test cases go in `qa/<project-code>-test-cases.md` (never in `docs/`; `.xlsx` on large projects → [`references/workbook-xlsx.md`](references/workbook-xlsx.md)). `docs/test-plan.md` holds only the plan and links here (template: [`references/test-plan-template.md`](references/test-plan-template.md)). Bugs found go in `qa/bugs/`. User stories and AC live in `docs/USER-STORIES.md`; the **Related** line cites those IDs exactly (`US-012, AC2`).
3. **Write each case from [`assets/test-case.md`](assets/test-case.md)**, one copy per case, ID `TC-<MODULE>-<NUMBER>` (`TC-LOGIN-001`). Do not write the outline from memory. One file holds many cases (the checker finds each `## TC-` block). Do not add, remove or reorder headings and `**fields:**`; a section marked `<!-- optional -->` may be deleted whole. An unknown value → `(รอยืนยัน)`, never a guess or the template placeholder.
4. **Cover every category for each feature** and note which do not apply and why: Functional/Happy path · Boundary (every numeric BR at 3 values) · Negative · Equivalence classes · State transitions · Integration · Concurrency · Security · Performance · Accessibility (UI). What to test in each: [`references/categories.md`](references/categories.md).
5. **Set the oracle** (the **Oracle** field says who the expected result comes from):

   | Label | Heard from | Trust |
   |---|---|---|
   | `[D]` the work owner | customer · system owner → `docs/USER-STORIES.md` · REQUIREMENTS · test data they confirmed | ✓ highest |
   | `[R]` general rule | mathematics · law · standards · common sense → write the reason beside it | good |
   | `[A]` the builder | SPEC · README · claims of whoever wrote the system | low — checks its own work |
   | `[O]` the screen | what was seen exploring the system | lowest |

   - Every TC needs `[D]` or `[R]`. With only `[A]` / `[O]`, put `[O-ยังไม่ยืนยัน]` plus a question number (`Q7`, never the label alone) and add the question to the work owner (through the BA or team lead). `[A]` is fine for details the owner does not care about (exact error wording), but a "must not / must warn" rule needs `[D]` or `[R]`.
   - **Priority:** a Security TC (XSS · open redirect · IDOR · calling the API around the page's checks · changing price/stock on the client and still ordering) is always P1. Others take the feature's priority.
   - **Do not bake the bug in.** Work out money, points and totals from `[D]` + `[R]` before opening the system and show the working (`฿800 − 5% (฿40) = ฿760`); never copy a value from the screen.
   - **System already wrong today:** write the correct behaviour, then append `(ตอนนี้ล้ม: …)` with what the system returns. Count items with this label and split by priority to forecast first-round failures against exit criteria.
   - **Boundary values:** a BR with a number gives 3 values: below · at · over the edge (`free delivery ≤ 5 km` → 4.9 · 5.0 · 5.1); Related cites the BR.
   - **Check when:** a TC that changes data (booking · cancelling · points · stock · permissions) gets `ทันที` · `หลังรีโหลด` · `ทั้งสอง`.
6. **End the file with 2 tables.** Coverage matrix: feature × technique (Happy · Negative · Boundary · Equivalence · State · Security/API); a cell that should have a case but is empty → `ระวัง` + reason, not relevant → `—`. Traceability: FR / BR → TC ID; every BR has ≥ 1 TC, if none → `ระวัง`, then add a TC.
7. **Run the shared checker until it passes:**
   ```bash
   python <โฟลเดอร์ skill polished-document-style ใน plugin superuser>/scripts/check_outline.py assets/test-case.md <your test-case file>
   ```
   It flags missing or reordered headings, missing fields, changed table headers, and anything unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option). Worked example of 3 login cases: [`references/example-login.md`](references/example-login.md). Look of the document: markdown someone reads → `design-gate/polished-document-style` · rendered .docx/.pptx/PDF for sign-off → `branded-document-design` · a picture to land the point → `markdown-visuals`.

## Run as a command

`/software-development:test-case-template <feature or user story>`

Use the `qa-tester` agent to design test cases for: **$ARGUMENTS**

1. Review the feature / user story / acceptance criteria
2. Apply the `test-case-template` skill
3. Cover every category in step 4, noting which do not apply and why
4. Mark each test case with priority (P1-P4)
5. Indicate automation candidacy
6. Produce a coverage summary table at the end

## Check before done
- [ ] Each case has one clear purpose, is reproducible by anyone, independent of other TCs, deterministic, with a specific expected result (never "It works").
- [ ] Each case traces to a requirement (user story, AC); no vague "test the login page"; one case is not 10 actions; negative and boundary cases exist, not only happy path.
- [ ] **Oracle** has `[D]` or `[R]` (or `[O-ยังไม่ยืนยัน]` + a question sent).
- [ ] Money and totals show their sum, worked out before opening the system; expected results never copied from the screen or the builder's SPEC.
- [ ] A failing test is triaged first (`qa-tester` → "when the result does not match"), never "fixed" by editing the expected result to match.
- [ ] Every BR has a TC · every BR with a number has its 3 boundary values.
- [ ] Coverage matrix and traceability tables at the end, gaps marked.
- [ ] `check_outline.py` passes on the whole file.

## References
- [`references/categories.md`](references/categories.md) — open when listing what to test per category
- [`references/example-login.md`](references/example-login.md) — open for a worked example
- [`references/test-plan-template.md`](references/test-plan-template.md) — open when writing the test plan
- [`references/workbook-xlsx.md`](references/workbook-xlsx.md) — open when building the `.xlsx` workbook


## reference: categories.md

# Test case categories (coverage guide) · test-case-template

Open when listing what to test for a feature. For every feature, create test cases in these categories.

1. **Functional / Happy path** — valid inputs producing expected outputs.
2. **Boundary** — minimum valid value · maximum valid value · just below minimum · just above maximum · empty / null · single item / first / last · every BR with a number → just below · at · just above the limit.
3. **Negative** — invalid format (wrong type, regex mismatch) · missing required fields · extra unexpected fields · special characters / SQL injection patterns · very long strings.
4. **Equivalence classes** — one value from each class: valid · invalid too small · invalid too large · invalid wrong format.
5. **State transitions** — for features with states (for example order: draft → submitted → paid → shipped): each valid transition · each invalid transition attempt.
6. **Integration** — interaction with other modules · external API calls (success, failure, timeout) · database state after the operation.
7. **Concurrency** — two users acting simultaneously · same user in multiple tabs · race conditions.
8. **Security** — unauthorized access · privilege escalation attempts · input sanitization (cross-site scripting (XSS), SQL injection) · rate limiting.
9. **Performance** — response time under normal load · behavior under peak load · memory/CPU usage.
10. **Accessibility (UI features)** — keyboard-only navigation · screen reader compatibility · color contrast · focus management.


## reference: example-login.md

# Example: Login Feature Test Cases

**Contents:** (the case headings are inside a code block, so they cannot be linked. Scroll to the case code.)

- TC-LOGIN-001: Successful login with valid credentials
- TC-LOGIN-002: Empty email field
- TC-LOGIN-003: Account lockout after 5 failed attempts
- TC-LOGIN-004: 4 failed attempts do not lock the account (just below the limit)
- TC-LOGIN-005: 6th attempt on a locked account is rejected (just above the limit)
- [Coverage matrix](#coverage-matrix)
- [Traceability](#traceability)

Worked example for `test-case-template` (5 cases: happy path · negative · lockout at the limit of 5 failed attempts with its 3 boundary values 4 · 5 · 6 · security).

IDs: User Story (US) · Acceptance Criteria (AC) · Web Content Accessibility Guidelines (WCAG) · Business Rule (BR) · Functional Requirement (FR).

```markdown
## TC-LOGIN-001: Successful login with valid credentials

**Module:** Authentication
**Type:** Functional
**Priority:** P1
**Automation:** Automated

**Preconditions:**
- User account exists with email "test@example.com"
- User is on login page

**Test Data:**
| Field    | Value              |
|----------|--------------------|
| Email    | test@example.com   |
| Password | ValidPass123!      |

**Steps:**
| # | Action                          | Expected Result                    |
|---|--------------------------------|-----------------------------------|
| 1 | Enter email in email field      | Email shown in field              |
| 2 | Enter password                  | Password masked with dots         |
| 3 | Click "Login" button            | Loading indicator appears         |
| 4 | Wait for response               | Redirect to /dashboard            |
| 5 | Verify dashboard               | Welcome message with user name    |

**Postconditions:**
- Session cookie set
- Last login timestamp updated

**Oracle:** [D] US-001 AC1 — login ถูก → เข้า /dashboard
**Related:** US-001, AC1
```

```markdown
## TC-LOGIN-002: Empty email field

**Module:** Authentication
**Type:** Negative
**Priority:** P2
**Automation:** Automated

**Preconditions:**
- User is on login page

**Steps:**
| # | Action                | Expected Result                      |
|---|----------------------|--------------------------------------|
| 1 | Leave email empty     | Field shows placeholder              |
| 2 | Enter valid password  | Password accepted                    |
| 3 | Click "Login"         | Error: "Email is required"           |
| 4 | Verify focus          | Email field gets focus               |

**Oracle:** [D] US-001 AC2 — อีเมลเป็นช่องบังคับ และช่องที่ผิดต้องได้โฟกัส (ขั้นที่ 4) · [R] WCAG 3.3.1 — ข้อผิดพลาดต้องบอกเป็นข้อความ (ขั้นที่ 3) · WCAG ไม่ได้บังคับเรื่องโฟกัส จึงอ้างเฉพาะเรื่องข้อความ
**Related:** US-001, AC2
```

```markdown
## TC-LOGIN-003: Account lockout after 5 failed attempts

**Module:** Authentication
**Type:** Security
**Priority:** P1
**Automation:** Candidate

**Preconditions:**
- User account exists and is not locked

**Steps:**
| # | Action                              | Expected Result                |
|---|-------------------------------------|-------------------------------|
| 1 | Enter valid email + wrong password  | Error message                 |
| 2 | Repeat step 1 four more times       | Same error each time          |
| 3 | Enter valid email + correct password| Error: "Account locked..."    |
| 4 | Wait 15 minutes                     | Can login successfully        |

**Oracle:** [D] US-001 AC4 — ผิด 5 ครั้ง → ล็อก 15 นาที
**Check when:** ทั้งสอง — หลังรีโหลดหน้าต้องยังล็อกอยู่
**Related:** US-001, AC4
```

```markdown
## TC-LOGIN-004: 4 failed attempts do not lock the account (just below the limit)

**Module:** Authentication
**Type:** Boundary
**Priority:** P1
**Automation:** Automated

**Preconditions:**
- User account exists and is not locked

**Steps:**
| # | Action                              | Expected Result                |
|---|-------------------------------------|-------------------------------|
| 1 | Enter valid email + wrong password, 4 times | Error message each time |
| 2 | Enter valid email + correct password| Redirect to /dashboard        |

**Oracle:** [D] US-001 AC4 — ล็อกเมื่อผิดครบ 5 ครั้ง (4 ครั้งยังไม่ล็อก)
**Check when:** ทันที
**Related:** US-001, AC4, BR-001
```

```markdown
## TC-LOGIN-005: 6th attempt on a locked account is rejected (just above the limit)

**Module:** Authentication
**Type:** Boundary
**Priority:** P1
**Automation:** Automated

**Preconditions:**
- User account is locked after 5 failed attempts (see TC-LOGIN-003)

**Steps:**
| # | Action                              | Expected Result                |
|---|-------------------------------------|-------------------------------|
| 1 | Enter valid email + correct password (6th attempt) | Error: "Account locked..." |

**Oracle:** [D] US-001 AC4 — ล็อกอยู่ 15 นาที แม้รหัสผ่านถูก
**Check when:** ทั้งสอง — หลังรีโหลดหน้าต้องยังล็อกอยู่
**Related:** US-001, AC4, BR-001
```

## Coverage matrix

| Feature | Happy | Negative | Boundary | Equivalence | State | Security/API |
|---|---|---|---|---|---|---|
| Login | TC-LOGIN-001 | TC-LOGIN-002 | TC-LOGIN-004 · 005 | ระวัง ยังไม่มี: ชนิดรหัสผ่านที่ผิด | — | TC-LOGIN-003 |

## Traceability

| FR / BR | Test cases |
|---|---|
| US-001 AC1 | TC-LOGIN-001 |
| US-001 AC2 | TC-LOGIN-002 |
| BR-001 (ผิด 5 ครั้ง → ล็อก 15 นาที) | TC-LOGIN-003 · 004 · 005 |


## reference: test-plan-template.md

# Test plan template

**Contents:** 1 full template block: Objective · Scope · Test Approach · Entry & Exit Criteria · Test Environment · Schedule · Risks · Plan Quality · Sign-off

Open it when you really must write this kind of document · mark anything you do not know `(รอยืนยัน)` (pending confirmation)

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

Every Out of Scope row needs a reason and a question number (for example "ยังไม่รู้เกณฑ์ → Q13 · ทดสอบเฉพาะจุดที่รู้" — criteria not known yet → Q13 · test only the parts that are known). Do not leave it as an empty heading.

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
| Shared-run agreement | Every test resets data before it starts · `workers: 1` per shared website · tests that exercise a rate limit get a tag and run last, with their own account · for the `{run}` rule in emails and parallel runs, see `e2e-testing-patterns` → `references/ci-and-parallel.md` |
| TEST-DATA | A test-data file that the work owner reviews and confirms (counts as `[D]`): the locked "today" date · sample users · pre-existing data · a table of edge values from every BR with the correct results and how the money is worked out · unconfirmed values get `(รอยืนยัน)` (pending confirmation) · choose the locked date so it lands on an edge (example from that project: locking 10:00 makes a booking tomorrow at 10:00 sit exactly on the 24 h edge with no special data to create) · an edge value that cannot be tested through the web page: say it is a unit test |

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

**Have an independent reviewer check the plan before the real run** (not the person who wrote the plan):
- Check every TC against 6 criteria: ① the expected result can be verified ② money figures recomputed independently and they match ③ not ambiguous ④ not a duplicate of another item ⑤ the steps can really be followed ⑥ the level, source, rule, and technique are correct
- One behavior = one owning TC. Cut the other items that check it again, or cut the repeated steps, otherwise one bug fails many items and the levels do not match
- Count TCs before and after fixing with a script, not by hand (example from that project: 344 → 339 TCs · 156 issues found)
- The review result is the evidence (example from another teaching project, checked 2026-11-04 from the review result table): verifiable expected results 36/40 → 42/42 · items that state when to check (immediate / after reload, `ทันที` / `หลังรีโหลด`) 0/14 → 16/16
- Technique mix of the large set after review (example from a 339-TC plan, not a standard): Happy 91 · Negative 129 · Boundary 69 · Equivalence 62 · State 87 · Security 54 (1 TC can count under several techniques)
- Caution: the figure "0 issues left" in that example comes from the fixer's own log; an independent reviewer has not yet done a second check; the script can only confirm the table structure and the rule links

## Sign-off

| Role | Name | Status | Date |
|------|------|:------:|------|
| QA Lead | @qa | Pending | — |
| Dev Lead | @dev | Pending | — |
| Product Owner | @po | Pending | — |
```


## reference: workbook-xlsx.md

# The `.xlsx` test workbook · test-case-template

Open when the project is large and QA testers fill in results in Excel.

Build it with `<โฟลเดอร์ skill test-case-template>/scripts/build-test-workbook.py` from one flat table (columns `id, module, fr (functional requirement, FR), title, type, result`, others kept):

- An **Overview** tab, then **one tab per module**. With `--mockup`, tabs follow the mockup screen order, every row gets a `screen` column, and each tab lists its mockup screens under the title. Use the same topics as the mockup start page (`ui-craft` → `references/mockup-start-page.md`).
- Overview counts Pass / Fail / Blocked / Not run per tab with formulas. **No "all cases" tab** — a result typed in two places drifts.
- Header: light brand fill, dark brand text, one brand-colour rule under it (the same table look as `branded-document-design`). Pass `--brand --head-fill --ink` from the project's `doc-theme`.
- Columns `test_result` (what actually happened) and `evidence` (GIF link) follow `result`, added empty if the table lacks them. After a run, `--results qa/evidence/<run-id>/results.csv` fills all three — see `test-evidence`. A workbook the user made themselves → `test-evidence/scripts/record_results.py`.
- Check: open it in Excel; the Overview totals must equal the source row count.


---

# skill: test-evidence

Use when running test cases and keeping proof

# Test Evidence

Every case you run → 1 GIF file that says which case it is, what was done, what was seen, and whether it passed · 1 `.md` report per run · results go into Excel with links to the evidence

## When not to use

| Task | Use this instead |
|---|---|
| Writing test cases before running | `test-case-template` |
| 1 bug already found | `bug-report-template` (can attach the GIF from this skill) |
| Writing E2E code · CI tests that fail | `e2e-testing-patterns` (Playwright trace · video) |

## Where the files go

| File | Location |
|---|---|
| Per-step images + `run.json` (temporary) | `_to_delete/test-frames/<run-id>/` |
| GIF · full image of the failed step · `results.csv` | `qa/evidence/<run-id>/` |
| Report | `qa/reports/<run-id>-test-report.md` |
| Excel test cases | `qa/<project-code>-test-cases.xlsx` |

`<run-id>` = `YYYY-MM-DD-r<n>`, such as `2026-10-18-r1` · links in Excel and the report are relative paths, so you can move the whole `qa/` folder and they still open

## 1 · Take screenshots while running

- 1 step in a test case = 1 image, taken **after** that step is done (so it shows the step's result) · the first image is the state before starting
- Web → Playwright at a 1280×720 screen size for every case (`page.screenshot(path=...)`) · desktop · mobile → use the capture method from the project's verify skill (`app-verifier-setup`)
- A wrong step → set `box` = a red frame around the wrong spot (x, y, w, h of the image) · Playwright finds it with `locator.bounding_box()`
- Use test data only. No real people's data, passwords or tokens in the images (`pdpa-compliance`) · password fields must show dots

## 2 · Write the captions

1 sentence per step: **what was done → what was seen.** Example: `กดเข้าสู่ระบบ → ขึ้นว่า รหัสผ่านไม่ถูกต้อง แต่ที่คาดคือ อีเมลหรือรหัสผ่านไม่ถูกต้อง` (Thai caption sample: "Pressed log in → saw 'password incorrect', but expected 'email or password incorrect'")

- At most 2 lines (about 70 characters per line) · anything longer is cut
- Put spaces between phrases in Thai captions, because the script breaks lines at spaces
- A failed step must give both "what was seen" and "what was expected" · wording by `human-writing`

## 3 · Build the GIF + report

Fill in `run.json` (the full format is at the top of [`scripts/make_evidence.py`](scripts/make_evidence.py)) · per case: `id` · `title` · `result` (`Pass` `Fail` `Blocked` `Not run`) · `expected` · `actual` · `issue` · `bug` · `steps[]`

```bash
# run from the project root · call the script by the full path of this skill's folder (write it in place of <โฟลเดอร์ skill test-evidence>)
python "<โฟลเดอร์ skill test-evidence>/scripts/make_evidence.py" _to_delete/test-frames/2026-10-18-r1/run.json \
  --out qa/evidence/2026-10-18-r1 --report qa/reports/2026-10-18-r1-test-report.md
```

GIF look (set in the script, do not adjust by hand):

| Part | Value |
|---|---|
| Width | Every image scaled to 1280 px |
| Top bar | Case id · case title · `ขั้น n/N` (step n of N) · badge PASS green / FAIL red / BLOCKED orange · 24 px text |
| Caption bar | Under the image, not over the screen · 28 px text · black background, white text |
| Time per step | 2–6 seconds, by caption length |
| Closing image | Big result + problem + expected / actual |
| Font | Sarabun (Thai + English) and the ✓ ✗ symbol set are in `assets/fonts/` |

- A `Fail` or `Blocked` case also gets `<id>-fail.png` = the failed step in full color (a GIF has only 256 colors), used to attach to the bug
- If the script warns `no raqm`, Thai vowels and tone marks will stack on each other · run it in the project's Docker sandbox (`docker-sandbox`) and it goes away
- The report contains: the run header · a summary count table · per-case results with GIF links · details of failed or blocked cases with images · cases not yet run
- Open the report and write a 1–2 sentence **ข้อสรุป** (conclusion: can it ship? what is stuck?) yourself in place of the `(รอยืนยัน)` line · fill in any `ปัญหา` (problem) field still empty

## 4 · Record the results in Excel

`results.csv` has the columns `id` · `result` · `test_result` (what actually happened, or the problem) · `evidence` (GIF file name)

| Which Excel exists already | Command |
|---|---|
| None yet, or built from `test-case-template` | `python "<โฟลเดอร์ skill test-case-template>/scripts/build-test-workbook.py" cases.csv qa/PRJ-test-cases.xlsx --results qa/evidence/<run-id>/results.csv` |
| The user sent their own file (any layout) | `python "<โฟลเดอร์ skill test-evidence>/scripts/record_results.py" <ไฟล์ของผู้ใช้>.xlsx qa/evidence/<run-id>/results.csv -o qa/PRJ-test-cases.xlsx` |

`record_results.py` looks in every sheet for a header row with a case id column (`ID` · `TC ID` · `Test Case ID` · `รหัส`) · it reuses an existing result column (`Status` · `ผล`) · if none exists, it adds these at the end of the table: **Result** · **Test result** · **Evidence** (a clickable link that opens the GIF) · it never overwrites the user's original file. To overwrite, move the old one to `_to_delete/` first.

## 5 · Make the numbers believable

Use this when test results decide whether an app got better or worse (against the old system, across versions, or as a loop's criterion). The table of problems and fixes is in [`references/trustworthy-numbers.md`](references/trustworthy-numbers.md): open it before you count or compare scores. The short rules:

- The runner should keep evidence for every item, passed and failed, and use separate exit codes: 0 = all passed · 1 = some items failed · 2 = the runner crashed
- Raw data recorded from the network contains cookies and tokens. Never commit it and never take it off the machine.

## Check before sending

- [ ] A case marked `Pass` was really run this round (`ground-rules/principle-prove-it-works`) · one not run gets `Not run` with a reason
- [ ] Open the GIF of at least 1 failed case by eye: the caption reads clearly, and the red frame sits on the spot
- [ ] The count in the report's summary table = the number of cases in `run.json` = the results in Excel
- [ ] If the results judge an app or a loop: the exam was run against the old system · every uncounted item has a reason · "failed at setup" is separated from "fail" (item 5)
- [ ] No real data or passwords in the images
- [ ] Raw images are in `_to_delete/`, none left in `qa/`
- [ ] The scripts' own tests pass: `python "<โฟลเดอร์ skill test-evidence>/scripts/make_evidence.py" --self-test` · `python "<โฟลเดอร์ skill test-evidence>/scripts/record_results.py" --self-test`

## References

- [`references/trustworthy-numbers.md`](references/trustworthy-numbers.md) — open when test results decide whether an app got better or worse (item 5)


## reference: trustworthy-numbers.md

# Make the numbers believable · test-evidence item 5

Source: a real measurement of 6 versions of a web clone app (Week 03 of Teaching_CWN2026). The numbers are examples from that job, from a single job, and the version-comparison example has 3–4 points. Use them to see direction, not as statistical proof.

| Problem | Do |
|---|---|
| The exam itself is wrong, so the app loses points | **Run the exam against the old system before counting** · pass = valid · fail because it was written wrong = fix and rerun once · fail because it cannot be checked through the screen or the old system changed = invalid, not counted, with a reason (in the real run 22 of 47 items were usable. Without this, 25 items would have cut the app's score although the app was not wrong) |
| Answer key written by hand is old or wrong | **Compute the expected value from the old system at run time** and do not hardcode numbers in the comparison code, except parameters that come from the task · the answer key and the data must be frozen at the same time (in the real run prices changed on 22 tickets within 1 hour) · collect the app's data and the answer screen in the same run (data collected at 17:07 matched the answer screen at 18:34 only 278/300 · recollecting in the same run gave 300/300) |
| An answer key you inferred yourself (filtered or counted yourself) | Prove the method first on cases that have a real answer · if the order cannot be trusted, judge by count and data set · say plainly that the criterion is weaker, and add a "ที่มาของเฉลย" (source of the answer key) table per scenario |
| Results are only pass/fail | Use a 3-value verdict **ผ่าน · ไม่ผ่าน · ยืนยันไม่ได้ในขอบเขตนี้** (cannot be confirmed within this scope), and count "cannot be confirmed" clearly as a fail, never guess it passed · in the report, say where a difference is: position, row or field ("airlines differ at 6 positions, starting at #13"), not just fail |
| 0 for the whole set | Check whether a single setup broke (in the real run 0/82 because every item started from a form that did not exist) · report "failed at setup" separately from "failed at the check step" · 0% does not mean the feature is absent |
| The exam's expected numbers contradict each other | Before use, check that the expected numbers do not contradict each other and match the real data (example from that job: the total was 299 but must be 300 · 35 versus 33 · 76 versus 77 came from different surveys) · the builder must not bend the app to fit an exam that contradicts itself. Conclude it is a ceiling and send it back to the exam owner to fix |
| A loose pass criterion | Write the criterion as an exact number ("must be 300," not "main part works") · if you use a loose criterion, also report the result under the strict one (real run: 4/35 loose became 2/35 strict) |
| Comparing scores across exam sets | Not possible if the author, scope, criterion or setup differ (in the real run the same version got 94.3% on the old set and 62.2% on the new set) · when the exam and the app come from the same recording, button names match and the score is inflated |
| One measure can mislead | Read several together (in the real run visual diff was 27% although there was no form at all, because the white backgrounds matched, while structure scored 3.8%) · an item you accept you cannot fix makes that measure blind (74/82 could not tell two versions apart), so bring in a different kind of measure to help |
| The measure itself may be wrong | Prove it before use: measure the answer key against itself, which must score full · plant a bug and see whether the relaxed criterion still catches it · simulate a "perfectly correct app" to learn whether the criterion or the app is wrong · keep the SHA-256 of the exam files before and after the run to prove they were not edited |
| Repeated measurement gives different values | Explain it with an experiment, then separate "confirmed" (removing the sentence gave 27.36%) from "not yet confirmed" (the remainder, about 0.5 points) · for data that changes over time, compare structure and rules, not numbers, and note the date collected |
| An agent's report | The file is the evidence, the summary is an opinion (in the real run the agent said a full pass of 16 items, but the real file had 14) · re-measure yourself with the same set before believing it |


---

# skill: bug-report-template

Use when writing up one software defect

# Bug Report Template

## Where bug reports live

One file per bug in `qa/bugs/BUG-<NNNN>-<slug>.md` at the project root. Attach screenshots and logs under `qa/bugs/BUG-<NNNN>/` — redact personal data first.

## When to use this skill

- Filing a new bug during testing
- Converting user complaints into bug tickets
- Reproducing an issue and documenting findings

## ไม่ใช้เมื่อ

| Task | Use this instead |
|---|---|
| A pile of bug reports that must be screened, reproduced and grouped first | `bug-inbox-triage`, then use this skill to write each one |
| Writing test cases ahead of time from requirements (no bug yet) | `test-case-template` |
| The live system is down or many users are affected | `incident-runbook-template` during the incident · `postmortem-template` after it |

## 0 · Look for an existing format first (every time)

Before using the structure or templates in this file, check whether the user, the client or the project already has its own format:

- **What to look at:** the form of the issue tracker the project uses: `.github/ISSUE_TEMPLATE/*.yml` or `*.md` · the required fields of Jira / Azure Boards / GitLab that the user names · 2–3 old bug reports in `docs/` or the tracker
- **Result:** if found, use it (headings, order, field names, running numbers) and say in the reply which file the format came from. If not found, use the template in this file as the fallback and say that no existing format was found
- **Every format still needs:** the severity names and criteria of the team, if they have them · the reproduction steps, actual result and expected result, whichever format is used

## Severity vs Priority

These are **different**:

| | Severity | Priority |
|---|----------|----------|
| What it measures | Technical impact | Business urgency |
| Set by | QA (quality assurance) / Engineering | PM (product manager) / PO (product owner) |

| Severity | Definition |
|----------|------------|
| **S1 Critical** | System unusable, data loss, no workaround |
| **S2 High** | Major feature broken, workaround exists |
| **S3 Medium** | Feature partially broken |
| **S4 Low** | Cosmetic, minor inconvenience |

In a review report (the `reviewer` scale): S1–S2 = สูง · S3 = กลาง · S4 = ต่ำ

| Priority | Definition |
|----------|------------|
| **P1** | Fix immediately, block release |
| **P2** | Fix in current sprint |
| **P3** | Fix in next sprint |
| **P4** | Fix when there is time / backlog |

## Output Template

Copy **[`assets/bug-report.md`](assets/bug-report.md)** and fill it in. Do not write the outline from memory.

- Do not add, remove or reorder headings and `**fields:**`. A section marked `<!-- optional -->` may be deleted whole when it does not apply.
- A value you do not know yet → `(รอยืนยัน)`, never a guess and never the template's placeholder.
- Before handing over, run the shared checker until it passes (paths from this skill's folder):

  ```bash
  python <โฟลเดอร์ skill polished-document-style ใน plugin superuser>/scripts/check_outline.py assets/bug-report.md <your bug file>
  ```

  It flags missing or reordered headings, missing fields, changed table headers, and anything still unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option).

## Title Writing Guide

Bad titles:
- "Login broken"
- "Bug in checkout"
- "It doesn't work"

Good titles (action + condition + result):
- "Login fails with 500 error when email contains apostrophe"
- "Checkout total shows NaN when quantity is decimal"
- "Search returns no results for queries longer than 100 chars"

**Formula:** `<Action> + <Condition> + <Unexpected result>`

## Steps to Reproduce Rules

- [ ] Start from a known state (logged out, fresh browser, etc.)
- [ ] Each step is one action
- [ ] Anyone can follow without prior knowledge
- [ ] Include exact data used (not "some user")
- [ ] No skipped steps (even "obvious" ones)
- [ ] Numbered sequentially

## Quality Checklist

Before submitting:

- [ ] Title clearly summarizes the issue
- [ ] Severity set · priority set, or `(รอยืนยัน)` until the PM/PO sets it
- [ ] Steps are reproducible by someone else
- [ ] Expected and actual results clearly differ
- [ ] At least one piece of evidence attached
- [ ] Environment info complete
- [ ] Searched for duplicates first
- [ ] One bug per report · no proposed fix in the title
- [ ] `check_outline.py` passes

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks**.
Load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `design-gate/polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `diagram-figures` for project documents (`software-diagrams` only for README / PR notes) |

Default formatting is not neutral. It looks like unfinished work.

## เรียกเป็นคำสั่ง

`/software-development:bug-report-template <brief description of the bug>`

> **Shortcut into SuperUser:** open the `superuser` skill with the `bug-fix` playbook and copy the playbook's steps into the todo first. The steps below describe the work format and output of this command. Use them together with the playbook, not instead of it.

Use the `qa-tester` agent to create a complete bug report for: **$ARGUMENTS**

The tester should:

1. Apply the `bug-report-template` skill
2. Gather missing info in one question at the start (unknown → `(รอยืนยัน)`, keep going):
   - Steps to reproduce (exact)
   - Environment details
   - Expected vs actual behavior
   - Frequency
   - Evidence (screenshots, logs)
3. Reproduce once yourself from the reporter's steps before trusting them, and reject these excuses before scoring:
   - "cannot reproduce, so not a bug" → try another environment, data set or timing first, then file as `ทำซ้ำไม่ได้` with what was tried
   - "user did it wrong" → then it is a usability or validation bug, still filed
   - "edge case nobody hits" → count who can hit it; file with the number
   - "already known" → link the existing report; no link, no excuse
4. Assess severity (S1-S4) and propose priority (P1-P4)
5. Identify possible root cause hypothesis if visible
6. Produce final bug report in standard format
7. Suggest related test cases that should be added
