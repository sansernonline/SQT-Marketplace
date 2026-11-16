# The `.xlsx` test workbook · test-case-template

Open when the project is large and QA testers fill in results in Excel.

Build it with `<โฟลเดอร์ skill test-case-template>/scripts/build-test-workbook.py` from one flat table (columns `id, module, fr (functional requirement, FR), title, type, result`, others kept):

- An **Overview** tab, then **one tab per module**. With `--mockup`, tabs follow the mockup screen order, every row gets a `screen` column, and each tab lists its mockup screens under the title. Use the same topics as the mockup start page (`ui-craft` → `references/mockup-start-page.md`).
- Overview counts Pass / Fail / Blocked / Not run per tab with formulas. **No "all cases" tab** — a result typed in two places drifts.
- Header: light brand fill, dark brand text, one brand-colour rule under it (the same table look as `branded-document-design`). Pass `--brand --head-fill --ink` from the project's `doc-theme`.
- Columns `test_result` (what actually happened) and `evidence` (GIF link) follow `result`, added empty if the table lacks them. After a run, `--results qa/evidence/<run-id>/results.csv` fills all three — see `test-evidence`. A workbook the user made themselves → `test-evidence/scripts/record_results.py`.
- Check: open it in Excel; the Overview totals must equal the source row count.
