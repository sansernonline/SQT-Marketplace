# playbook · review — check before sending

Use when: reviewing a PR or diff · checking a design · checking a document · "Take a look and tell me if I missed anything"
Main principles: [`dev-principles`](../../dev-principles/SKILL.md) · [`references/code.md`](../../dev-principles/references/code.md) · [`references/testing.md`](../../dev-principles/references/testing.md) · [`references/security.md`](../../dev-principles/references/security.md)
Output: a verdict with a list of confirmed problems · **read-only — do not fix it yourself and do not write any file, including `docs/BUILD-PLAN.md` · `CONTEXT.md`.** Everything goes in the reply
Main skills: `code-craft` · `git-and-review` · `security-audit` (security findings) · `web-audit` (web pages) · `qa-docs` (test documents and bug reports) · `pdpa-compliance` (personal data)

## Real tools used for checking in code work

- Judge the work against the principle file for its kind (`code.md`, `testing.md`, `security.md`, or the file for screens, data or documents), and name that file in the checker brief.
- Step 3: send a fresh `reviewer` together with `git-and-review` and the "check before sending" list of the stack's skill
- Big or high-risk work uses `crew-patterns/adversarial-review-panel` (a fresh `reviewer` per angle)
- Visual work → (if plugin `graphic-design` is installed) `design-critic` or `design-review`; if not, check per [`ui-craft`](../../ui-craft/SKILL.md)
- Step 6 under **ที่ทำ** (what was done) uses the status table of type `ตรวจ` (check) from `superuser/status-report` in the reply only

## ขั้นตอน · Steps (copy into the todo as written)

1. Open the principle file for the kind of work first (see Main principles). Set the scope — the files or diff to check (`git diff --stat main...HEAD`, then open the per-file diff only for what needs a look) and the surrounding files that must be read to understand it ([`code-craft`](../../code-craft/SKILL.md)); find the impact outside the diff per [`code-craft`](../../code-craft/SKILL.md) · ใคร: หัวหน้าทีม
<!-- superuser:begin review-steps -->
2. Prepare the review package per [`review-lenses`](review-lenses.md) item 1: the intent of the work in 1 paragraph (who uses it, for what; if unsure, choose the interpretation with the least impact and do not stop to ask) · the diff as a file · the spec's conditions quoted exactly · the `head:` id · the author's reasoning kept separate in `author-notes.md`, with no opinion on pass or fail put in the prompt · ใคร: หัวหน้าทีม
3. Choose lenses by the kind of work from [`review-lenses`](review-lenses.md) item 2 (every job has `spec` and `quality`), then follow the checklist of this playbook's main skill (none → a related skill) · ใคร: หัวหน้าทีม
4. Check (ตรวจ) by the chosen lenses. Answer the checklist `PASS` · `FAIL` with file:line, and give a verdict on 2 sides separately: does it meet the spec's conditions · is the quality good enough. Each checker holds 1–3 lenses, at most the 15 largest files per checker, and says how many files it skipped · for large or high-risk work, add one more checker that has never seen the work, on the large tier (`model: opus`) · tell every checker "do not edit the work (you may write your own report in `_to_delete/`)" · ใคร: `reviewer` ตัวใหม่ (read-only · large work `model: opus`)
5. Confirm (ยืนยัน) item by item. Each finding goes to 1 confirmer per finding, who does not know who found it. The default is `FALSE_POSITIVE`; it becomes `ยืนยัน` (confirmed) only with evidence and confidence of at least 80, per item 3 of `review-lenses` · ใคร: `reviewer` ตัวใหม่ (read-only)
6. Split into 3 groups: สูง · กลาง · ต่ำ (high · medium · low, as defined in `reviewer`). Items that cannot be confirmed get `ยังไม่ได้ตรวจ`. Record every item you dismiss in `ledger.md` with a reason from the list (`false_positive` · `intentional` · `deferred` · `rejected` · `มีมาก่อน` (pre-existing)), then read the file back and count so it matches the number dismissed. Round 2 and later: compare the previous round's items with the diff to see they were really fixed · ใคร: หัวหน้าทีม
7. Check freshness before reporting. Compare `head:` in the package with the real current state. Mismatch, or a checker still running, failed, or had its result cut → report that the result is stale or incomplete and do not count it as clean · ใคร: หัวหน้าทีม
8. Report: a 1-line verdict (`ส่งได้` (ready to deliver) · `ส่งได้หลังแก้` (deliver after fixes) · `ยังไม่ควรส่ง` (not yet ready to deliver)), then the list and a work summary per `superuser` section 7 · ใคร: หัวหน้าทีม

## Done when

Every item in the report points to a spot in the work and has passed confirmation
<!-- superuser:end review-steps -->
