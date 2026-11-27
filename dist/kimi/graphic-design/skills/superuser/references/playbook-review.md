# playbook · review — check design work before delivery

Use when: checking work before delivery or real use · "ช่วยดูหน่อยว่ามีอะไรพลาด" (take a look and see if anything is wrong) · the user did it themselves and wants it checked
Result: a verdict with a list of confirmed problems · **does not fix anything automatically** · read-only work, so it does not create `CONTEXT.md`
Main principles: [`design-principles`](../../design-principles/SKILL.md) · the medium's file from its table (the checkers in step 4 judge against it)
Main skills: `design-review` · `brand-kit` · `campaign-set` · agent `design-critic`

## ขั้นตอน (Steps) (copy into the todo exactly)

1. Set the scope: the pieces to check, and the source documents to compare against (brand kit · brief · platform sizes), and open the medium's principle file in `design-principles` · ใคร: หัวหน้าทีม
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
