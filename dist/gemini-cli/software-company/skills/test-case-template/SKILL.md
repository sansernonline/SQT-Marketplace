---
name: test-case-template
description: Use when writing test cases, scenarios or a feature test plan, or turning acceptance criteria into tests.
---

# Test Case Template

## When to use this skill

- Converting user story / acceptance criteria into test cases
- Designing test scenarios for a new feature
- Building a regression test suite
- Reviewing test coverage gaps

## ไม่ใช้เมื่อ

| งาน | ใช้ตัวนี้แทน |
|---|---|
| รายงานข้อบกพร่องที่เจอแล้ว 1 เรื่อง | `bug-report-template` |
| คัดรายงานบั๊กที่กองอยู่ในกล่องข้อความ | `bug-inbox-triage` |
| ตัดสินสัดส่วน unit · integration · E2E หรือเขียนโค้ด test | `testing-standards` · `e2e-testing-patterns` |

## Where test cases live

Test cases go in the `qa/` folder at the project root, never inside `docs/`. Use `qa/<project-code>-test-cases.md`, or `.xlsx` on large projects where QA fills in results. `docs/test-plan.md` holds only the plan and links here. Bugs found while testing go in `qa/bugs/`. Stories and their AC live in `docs/USER-STORIES.md` — the **Related** line cites those IDs exactly (`US-012, AC2`), so a changed AC there points to the test cases that must change.

**The `.xlsx` workbook** — build it with `scripts/build-test-workbook.py` from one flat table (columns `id, module, fr, title, type, result`, others kept):
- An **Overview** tab, then **one tab per module**. With `--mockup`, tabs follow the mockup screen order, every row gets a `screen` column, and each tab lists its mockup screens under the title. Use the same topics as the mockup start page (`ui-craft` → `references/mockup-start-page.md`).
- Overview counts Pass / Fail / Blocked / Not run per tab with formulas. **No "all cases" tab** — a result typed in two places drifts.
- Header: light brand fill, dark brand text, one brand-colour rule under it (the same table look as `branded-document-design`). Pass `--brand --head-fill --ink` from the project's `doc-theme`.
- Check: open it in Excel; the Overview totals must equal the source row count.

## Test Case ID Convention

```
TC-<MODULE>-<NUMBER>
Example: TC-LOGIN-001, TC-CHECKOUT-042
```

## Output Template

Copy **[`assets/test-case.md`](assets/test-case.md)** once per test case and fill it in. Do not write the outline from memory. One file holds many test cases; the checker finds each `## TC-` block and checks every one.

- Do not add, remove or reorder headings and `**fields:**`. A section marked `<!-- optional -->` may be deleted whole when it does not apply.
- A value you do not know yet → `(รอยืนยัน)`, never a guess and never the template's placeholder.
- Before handing over, run the shared checker until it passes (paths from this skill's folder):

  ```bash
  python ../polished-document-style/scripts/check_outline.py assets/test-case.md <your test-case file>
  ```

  It flags missing or reordered headings, missing fields, changed table headers, and anything still unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option).

## Test Case Categories (Coverage Guide)

For every feature, create test cases in these categories:

### 1. Functional / Happy Path
Valid inputs producing expected outputs.

### 2. Boundary
- Minimum valid value
- Maximum valid value
- Just below minimum
- Just above maximum
- Empty / null
- Single item / first / last

### 3. Negative
- Invalid format (wrong type, regex mismatch)
- Missing required fields
- Extra unexpected fields
- Special characters / SQL injection patterns
- Very long strings

### 4. Equivalence Classes
Pick one value from each class:
- Valid class
- Invalid class - too small
- Invalid class - too large
- Invalid class - wrong format

### 5. State Transitions
For features with states (e.g., order: draft → submitted → paid → shipped):
- Each valid transition
- Each invalid transition attempt

### 6. Integration
- Interaction with other modules
- External API calls (success, failure, timeout)
- Database state after operation

### 7. Concurrency
- Two users acting simultaneously
- Same user multiple tabs
- Race conditions

### 8. Security
- Unauthorized access
- Privilege escalation attempts
- Input sanitization (XSS, SQL injection)
- Rate limiting

### 9. Performance
- Response time under normal load
- Behavior under peak load
- Memory/CPU usage

### 10. Accessibility (UI features)
- Keyboard-only navigation
- Screen reader compatibility
- Color contrast
- Focus management

## Example: Login Feature Test Cases

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

**Related:** US-001, AC4
```

## Quality Checklist

Each test case should:
- [ ] Have one clear purpose
- [ ] Be reproducible by anyone reading it
- [ ] Have clear expected results
- [ ] Be independent (doesn't rely on TC-XXX running first)
- [ ] Be deterministic (same result every run)
- [ ] Trace back to a requirement (user story, AC)
- [ ] `check_outline.py` passes on the whole file

## Anti-patterns

- ❌ "Test the login page" — too vague. Test what, exactly?
- ❌ Combining 10 actions into one test case — split them
- ❌ Expected result = "It works" — be specific
- ❌ Test cases that depend on previous test cases passing
- ❌ Only happy-path tests (must include negative + boundary)
- ❌ Tests with no traceability to requirements

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.

**อ่านเพิ่มเมื่อต้องใช้:** [`references/test-plan-template.md`](references/test-plan-template.md) — แม่แบบ
