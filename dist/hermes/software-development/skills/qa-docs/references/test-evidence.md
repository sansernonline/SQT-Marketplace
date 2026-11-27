<!-- merged from skill `test-evidence` on 2026-11-27 · description was: Use when running test cases and keeping proof -->
# Test Evidence

Every case you run → 1 GIF file that says which case it is, what was done, what was seen, and whether it passed · 1 `.md` report per run · results go into Excel with links to the evidence

## When not to use

| Task | Use this instead |
|---|---|
| Writing test cases before running | `test-case-template.md` |
| 1 bug already found | `bug-report-template.md` (can attach the GIF from this skill) |
| Writing E2E code · CI tests that fail | `test-automation` (Playwright trace · video) |

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
- Web → Playwright at a 1280×720 screen size for every case (`page.screenshot(path=...)`) · desktop · mobile → use the capture method from the project's verify skill (`test-automation`)
- A wrong step → set `box` = a red frame around the wrong spot (x, y, w, h of the image) · Playwright finds it with `locator.bounding_box()`
- Use test data only. No real people's data, passwords or tokens in the images (`pdpa-compliance`) · password fields must show dots

## 2 · Write the captions

1 sentence per step: **what was done → what was seen.** Example: `กดเข้าสู่ระบบ → ขึ้นว่า รหัสผ่านไม่ถูกต้อง แต่ที่คาดคือ อีเมลหรือรหัสผ่านไม่ถูกต้อง` (Thai caption sample: "Pressed log in → saw 'password incorrect', but expected 'email or password incorrect'")

- At most 2 lines (about 70 characters per line) · anything longer is cut
- Put spaces between phrases in Thai captions, because the script breaks lines at spaces
- A failed step must give both "what was seen" and "what was expected" · wording by `human-writing`

## 3 · Build the GIF + report

Fill in `run.json` (the full format is at the top of [`scripts/make_evidence.py`](../scripts/make_evidence.py)) · per case: `id` · `title` · `result` (`Pass` `Fail` `Blocked` `Not run`) · `expected` · `actual` · `issue` · `bug` · `steps[]`

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
- If the script warns `no raqm`, Thai vowels and tone marks will stack on each other · run it in the project's Docker sandbox (`infra-and-deploy`) and it goes away
- The report contains: the run header · a summary count table · per-case results with GIF links · details of failed or blocked cases with images · cases not yet run
- Open the report and write a 1–2 sentence **ข้อสรุป** (conclusion: can it ship? what is stuck?) yourself in place of the `(รอยืนยัน)` line · fill in any `ปัญหา` (problem) field still empty

## 4 · Record the results in Excel

`results.csv` has the columns `id` · `result` · `test_result` (what actually happened, or the problem) · `evidence` (GIF file name)

| Which Excel exists already | Command |
|---|---|
| None yet, or built from `test-case-template.md` | `python "<โฟลเดอร์ skill test-case-template>/scripts/build-test-workbook.py" cases.csv qa/PRJ-test-cases.xlsx --results qa/evidence/<run-id>/results.csv` |
| The user sent their own file (any layout) | `python "<โฟลเดอร์ skill test-evidence>/scripts/record_results.py" <ไฟล์ของผู้ใช้>.xlsx qa/evidence/<run-id>/results.csv -o qa/PRJ-test-cases.xlsx` |

`record_results.py` looks in every sheet for a header row with a case id column (`ID` · `TC ID` · `Test Case ID` · `รหัส`) · it reuses an existing result column (`Status` · `ผล`) · if none exists, it adds these at the end of the table: **Result** · **Test result** · **Evidence** (a clickable link that opens the GIF) · it never overwrites the user's original file. To overwrite, move the old one to `_to_delete/` first.

## 5 · Make the numbers believable

Use this when test results decide whether an app got better or worse (against the old system, across versions, or as a loop's criterion). The table of problems and fixes is in [`trustworthy-numbers.md`](trustworthy-numbers.md): open it before you count or compare scores. The short rules:

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

- [`trustworthy-numbers.md`](trustworthy-numbers.md) — open when test results decide whether an app got better or worse (item 5)
