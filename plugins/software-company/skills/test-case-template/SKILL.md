---
name: test-case-template
description: Use when writing test cases or a feature test plan, or turning acceptance criteria into tests.
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
| รันเคสแล้วเก็บหลักฐาน (GIF) · รายงานผ่าน/ไม่ผ่าน | `test-evidence` |
| คัดรายงานบั๊กที่กองอยู่ในกล่องข้อความ | `bug-inbox-triage` |
| ตัดสินสัดส่วน unit · integration · end-to-end (E2E) หรือเขียนโค้ด test | `testing-standards` · `e2e-testing-patterns` |

## Where test cases live

Test cases go in the `qa/` folder at the project root, never inside `docs/`. Use `qa/<project-code>-test-cases.md`, or `.xlsx` on large projects where quality assurance (QA) testers fill in results. `docs/test-plan.md` holds only the plan and links here. Bugs found while testing go in `qa/bugs/`. User stories (US) and their acceptance criteria (AC) live in `docs/USER-STORIES.md` — the **Related** line cites those IDs exactly (`US-012, AC2`), so a changed AC there points to the test cases that must change.

**The `.xlsx` workbook** — build it with `<โฟลเดอร์ skill test-case-template>/scripts/build-test-workbook.py` from one flat table (columns `id, module, fr (functional requirement, FR), title, type, result`, others kept):
- An **Overview** tab, then **one tab per module**. With `--mockup`, tabs follow the mockup screen order, every row gets a `screen` column, and each tab lists its mockup screens under the title. Use the same topics as the mockup start page (`ui-craft` → `references/mockup-start-page.md`).
- Overview counts Pass / Fail / Blocked / Not run per tab with formulas. **No "all cases" tab** — a result typed in two places drifts.
- Header: light brand fill, dark brand text, one brand-colour rule under it (the same table look as `branded-document-design`). Pass `--brand --head-fill --ink` from the project's `doc-theme`.
- Columns `test_result` (what actually happened) and `evidence` (GIF link) follow `result`, added empty if the table lacks them. After a run, `--results qa/evidence/<run-id>/results.csv` fills all three — see `test-evidence`. A workbook the user made themselves → `test-evidence/scripts/record_results.py`.
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
  python <โฟลเดอร์ skill polished-document-style ใน plugin superuser>/scripts/check_outline.py assets/test-case.md <your test-case file>
  ```

  It flags missing or reordered headings, missing fields, changed table headers, and anything still unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option).

## ผลที่คาดหวังมาจากไหน (oracle)

ทุก TC บอกในช่อง **Oracle** ว่าผลที่คาดหวังมาจากใคร

| ป้าย | ฟังจาก | เชื่อได้ |
|---|---|---|
| `[D]` เจ้าของงาน | ลูกค้า · เจ้าของระบบ → `docs/USER-STORIES.md` · REQUIREMENTS · ข้อมูลทดสอบที่เขายืนยัน | ✓ สูงสุด |
| `[R]` กฎทั่วไป | คณิตศาสตร์ · กฎหมาย · มาตรฐาน · สามัญสำนึก → เขียนเหตุผลกำกับ | 🟡 ดี |
| `[A]` คนสร้าง | SPEC · README · คำอ้างของคนหรือ AI ที่เขียนระบบ | 🟠 ต่ำ — ตรวจงานตัวเอง |
| `[O]` หน้าจอ | สิ่งที่เห็นตอนสำรวจระบบ | 🔴 ต่ำสุด — ระบบอาจผิดอยู่แล้ว |

- ทุก TC ต้องมี `[D]` หรือ `[R]` · มีแค่ `[A]` / `[O]` → ใส่ `[O-ยังไม่ยืนยัน]` แล้วเพิ่มเป็นคำถามถึงเจ้าของงาน (ผ่าน BA หรือหัวหน้าทีม)
- `[A]` ใช้ได้กับรายละเอียดที่เจ้าของงานไม่สนใจ เช่น ข้อความ error คำต่อคำ · แต่ "ต้องห้าม / ต้องเตือน" ต้องมี `[D]` หรือ `[R]` รองรับ
- **อย่าอบบั๊กลงในผลที่คาดหวัง** → ตัวเลขเงิน แต้ม ยอดรวม คิดจาก `[D]` + `[R]` **ก่อนเปิดระบบ** และเขียนวิธีคิดไว้ (`฿800 − 5% (฿40) = ฿760`) · ห้ามลอกค่าจากหน้าจอ เพราะถ้าระบบผิดอยู่แล้ว test จะผ่านตลอดไป

**ค่าขอบผูกกับกฎ** → กฎธุรกิจ (Business Rule, BR) ที่มีตัวเลข 1 ข้อ = 3 ค่า: ต่ำกว่าขอบ · ที่ขอบ · เกินขอบ เช่น `ส่งฟรี ≤ 5 กม.` → 4.9 · 5.0 · 5.1 · ช่อง Related อ้าง BR ด้วย

**จังหวะตรวจ** → TC ที่เปลี่ยนข้อมูล (จอง · ยกเลิก · แต้ม · สต็อก · สิทธิ์) ใส่ **Check when** = `ทันที` · `หลังรีโหลด` · `ทั้งสอง` · ถูกทันทีแต่หายหลังรีโหลด = ไม่ได้บันทึกจริง

**ครอบคลุมและโยงกลับ** → ท้ายไฟล์ test case มี 2 ตาราง

| ตาราง | หน้าตา | กติกา |
|---|---|---|
| Coverage matrix | ฟีเจอร์ × เทคนิค (Happy · Negative · Boundary · Equivalence · State · Security/API) | ช่องที่ควรมีแต่ยังว่าง → ระวัง + เหตุผล · ไม่เกี่ยว → `—` |
| Traceability | FR / BR → รหัส TC | BR ทุกข้อมี ≥ 1 TC · ไม่มี → ระวัง แล้วเพิ่ม TC |

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
- Test fails → expected result edited to match the system. Triage first (`qa-tester` → เมื่อผลไม่ตรง)

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
