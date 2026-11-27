<!-- merged from skill `test-case-template` on 2026-11-27 · description was: Use when writing test cases or a test plan -->
# Test Case Template — test cases (`TC-<MODULE>-<NUMBER>`) that trace to requirements, with a coverage matrix

## Use when
- Converting a user story / acceptance criteria into test cases, or designing scenarios for a new feature.
- Building a regression suite, or reviewing coverage gaps.

Not for: 1 defect already found → `bug-report-template.md` · running cases and collecting evidence (GIF), pass/fail report → `test-evidence.md` · sorting a pile of bug reports → `bug-inbox-triage.md` · unit/integration/E2E ratio or test code → `test-automation`.

## Steps
1. **Look for an existing format first.** Check the customer's or QA team's format: Excel/CSV in `docs/` or `ref/` · the tool in use (TestRail · Zephyr · Xray · Azure Test Plans) and its mandatory fields · the project's earlier test case set (columns, ID system, priority levels). If found, use it and say which file it came from; if not, use the template below and say none was found. In every format, IDs continue from the existing set and expected results still come from the requirements.
2. **Place the file.** Test cases go in `qa/<project-code>-test-cases.md` (never in `docs/`; `.xlsx` on large projects → [`workbook-xlsx.md`](workbook-xlsx.md)). `docs/test-plan.md` holds only the plan and links here (template: [`test-plan-template.md`](test-plan-template.md)). Bugs found go in `qa/bugs/`. User stories and AC live in `docs/USER-STORIES.md`; the **Related** line cites those IDs exactly (`US-012, AC2`).
3. **Write each case from [`assets/test-case.md`](../assets/test-case.md)**, one copy per case, ID `TC-<MODULE>-<NUMBER>` (`TC-LOGIN-001`). Do not write the outline from memory. One file holds many cases (the checker finds each `## TC-` block). Do not add, remove or reorder headings and `**fields:**`; a section marked `<!-- optional -->` may be deleted whole. An unknown value → `(รอยืนยัน)`, never a guess or the template placeholder.
4. **Cover every category for each feature** and note which do not apply and why: Functional/Happy path · Boundary (every numeric BR at 3 values) · Negative · Equivalence classes · State transitions · Integration · Concurrency · Security · Performance · Accessibility (UI). What to test in each: [`categories.md`](categories.md).
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
   It flags missing or reordered headings, missing fields, changed table headers, and anything unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option). Worked example of 3 login cases: [`example-login.md`](example-login.md). Look of the document: markdown someone reads → `design-gate/polished-document-style` · rendered .docx/.pptx/PDF for sign-off → `document-design` · a picture to land the point → `diagrams`.

## Run as a command

`/software-development:qa-docs <feature or user story>`

Use the `qa-tester` agent to design test cases for: **the user's request**

1. Review the feature / user story / acceptance criteria
2. Apply the `qa-docs` skill
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
- [`categories.md`](categories.md) — open when listing what to test per category
- [`example-login.md`](example-login.md) — open for a worked example
- [`test-plan-template.md`](test-plan-template.md) — open when writing the test plan
- [`workbook-xlsx.md`](workbook-xlsx.md) — open when building the `.xlsx` workbook
