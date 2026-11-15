---
name: test-case-template
description: Use when writing test cases or a test plan
argument-hint: <feature or user story>
---

# Test Case Template

## When to use this skill

- Converting user story / acceptance criteria into test cases
- Designing test scenarios for a new feature
- Building a regression test suite
- Reviewing test coverage gaps

## When not to use

| Task | Use this instead |
|---|---|
| A report of 1 defect that was already found | `bug-report-template` |
| Running the cases and collecting evidence (GIF) · pass/fail report | `test-evidence` |
| Sorting bug reports piled up in an inbox | `bug-inbox-triage` |
| Deciding the ratio of unit · integration · end-to-end (E2E) tests, or writing test code | `testing-standards` · `e2e-testing-patterns` |

## Where test cases live

Test cases go in the `qa/` folder at the project root, never inside `docs/`. Use `qa/<project-code>-test-cases.md`, or `.xlsx` on large projects where quality assurance (QA) testers fill in results. `docs/test-plan.md` holds only the plan and links here. Bugs found while testing go in `qa/bugs/`. User stories (US) and their acceptance criteria (AC) live in `docs/USER-STORIES.md` — the **Related** line cites those IDs exactly (`US-012, AC2`), so a changed AC there points to the test cases that must change.

**The `.xlsx` workbook** — build it with `<โฟลเดอร์ skill test-case-template>/scripts/build-test-workbook.py` from one flat table (columns `id, module, fr (functional requirement, FR), title, type, result`, others kept):
- An **Overview** tab, then **one tab per module**. With `--mockup`, tabs follow the mockup screen order, every row gets a `screen` column, and each tab lists its mockup screens under the title. Use the same topics as the mockup start page (`ui-craft` → `references/mockup-start-page.md`).
- Overview counts Pass / Fail / Blocked / Not run per tab with formulas. **No "all cases" tab** — a result typed in two places drifts.
- Header: light brand fill, dark brand text, one brand-colour rule under it (the same table look as `branded-document-design`). Pass `--brand --head-fill --ink` from the project's `doc-theme`.
- Columns `test_result` (what actually happened) and `evidence` (GIF link) follow `result`, added empty if the table lacks them. After a run, `--results qa/evidence/<run-id>/results.csv` fills all three — see `test-evidence`. A workbook the user made themselves → `test-evidence/scripts/record_results.py`.
- Check: open it in Excel; the Overview totals must equal the source row count.

## 0 · Look for an existing format first (every time)

Before using the structure or template in this file, check whether the user, the customer, or the project already has its own format:

- **Where to look:** the test case format of the customer or QA team: Excel/CSV files in `docs/` or `ref/` · the tool in use (TestRail · Zephyr · Xray · Azure Test Plans) and its mandatory fields · the project's earlier test case set → look at the columns, the ID system, and the priority levels
- **Result:** found → use that format (headings, order, field names, run numbers) and say in the answer which file the format came from · not found → use the template in this file as a fallback and say that no existing format was found
- **Still required in every format:** IDs must continue from the existing set · expected results must still come from the requirements

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
  python <โฟลเดอร์ skill polished-document-style ใน plugin superuser>/scripts/check_outline.py assets/test-case.md <your test-case file>
  ```

  It flags missing or reordered headings, missing fields, changed table headers, and anything still unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option).

## Where the expected result comes from (oracle)

Every TC says in the **Oracle** field who the expected result comes from.

| Label | Heard from | Trust |
|---|---|---|
| `[D]` the work owner | the customer · the system owner → `docs/USER-STORIES.md` · REQUIREMENTS · test data they confirmed | ✓ highest |
| `[R]` general rule | mathematics · law · standards · common sense → write the reason beside it | good |
| `[A]` the builder | SPEC · README · claims of the person or AI who wrote the system | low — it checks its own work |
| `[O]` the screen | what was seen while exploring the system | lowest — the system may already be wrong |

- Every TC needs `[D]` or `[R]`. If it has only `[A]` / `[O]`, put `[O-ยังไม่ยืนยัน]` (observed, not confirmed) and add it as a question to the work owner (through the BA or the team lead).
- Every `[O-ยังไม่ยืนยัน]` must carry a question number (for example `Q7`). Never use the label by itself.
- **Priority:** a Security TC (XSS · open redirect · IDOR · calling the API around the web page's checks · changing price/stock on the client and still being able to order) is always P1, whichever feature it sits in. Other TCs use the same priority as the feature.
- **The system is already wrong today:** write the expected result as the correct behavior, then append `(ตอนนี้ล้ม: …)` (currently failing: …) with what the system returns. Count the items with this label and split them by priority, to forecast how many items will fail the exit criteria in the first round (example from that work: 88 items had the label, 39 of them P1).
- `[A]` is fine for details the work owner does not care about, such as the exact wording of an error message. But a "must not / must warn" rule needs `[D]` or `[R]` behind it.
- **Do not bake the bug into the expected result.** Work out money, points, and totals from `[D]` + `[R]` **before opening the system**, and write the working (`฿800 − 5% (฿40) = ฿760`). Never copy a value from the screen, because if the system is already wrong, the test will pass forever.

**Boundary values tied to rules.** A business rule (BR) with a number gives 3 values: below the edge · at the edge · over the edge. For example `free delivery ≤ 5 km` → 4.9 · 5.0 · 5.1. The Related field cites the BR too.

**When to check.** A TC that changes data (booking · cancelling · points · stock · permissions) gets **Check when** = `ทันที` (immediately) · `หลังรีโหลด` (after reload) · `ทั้งสอง` (both). Right at once but gone after a reload = it was not really saved.

**Coverage and tracing back.** At the end of the test case file there are 2 tables.

| Table | Looks like | Rule |
|---|---|---|
| Coverage matrix | feature × technique (Happy · Negative · Boundary · Equivalence · State · Security/API) | A cell that should have a case but is empty → `ระวัง` (watch out) + the reason · not relevant → `—` |
| Traceability | FR / BR → TC ID | Every BR has ≥ 1 TC · if none → `ระวัง`, then add a TC |

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
- Every BR with a number → just below · at · just above the limit (see oracle section)

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
- Input sanitization (cross-site scripting (XSS), SQL injection)
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

## Example

Worked example with 3 login cases (happy path · empty field · lockout): [`references/example-login.md`](references/example-login.md)

## Quality Checklist

Each test case should:
- [ ] Have one clear purpose
- [ ] Be reproducible by anyone reading it
- [ ] Have clear expected results
- [ ] Be independent (doesn't rely on TC-XXX running first)
- [ ] Be deterministic (same result every run)
- [ ] Trace back to a requirement (user story, AC)
- [ ] **Oracle** has `[D]` or `[R]` (or `[O-ยังไม่ยืนยัน]` + a question sent)
- [ ] Money and totals show their sum, worked out before opening the system
- [ ] Every BR has a TC · every BR with a number has its 3 boundary values
- [ ] Coverage matrix and traceability tables at the end, gaps marked "GAP"
- [ ] `check_outline.py` passes on the whole file

## Anti-patterns

- "Test the login page" — too vague. Test what, exactly?
- Combining 10 actions into one test case — split them
- Expected result = "It works" — be specific
- Test cases that depend on previous test cases passing
- Only happy-path tests (must include negative + boundary)
- Tests with no traceability to requirements
- Expected result copied from the screen or the builder's SPEC — it bakes the bug into the test
- Test fails → expected result edited to match the system. Triage first (`qa-tester` → "when the result does not match")

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

**Read more when needed:** [`references/test-plan-template.md`](references/test-plan-template.md) — template

## Run as a command

`/software-development:test-case-template <feature or user story>`

Use the `qa-tester` agent to design test cases for: **$ARGUMENTS**

The tester should:

1. Review the feature / user story / acceptance criteria
2. Apply the `test-case-template` skill
3. Cover every category in `test-case-template` (Test Case Categories), noting which ones do not apply and why
4. Mark each test case with priority (P1-P4)
5. Indicate automation candidacy
6. Produce a coverage summary table at the end
