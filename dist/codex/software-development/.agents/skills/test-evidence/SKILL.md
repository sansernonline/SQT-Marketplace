---
name: test-evidence
description: Use when running test cases and keeping proof
---

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

| Part | Value | Reason |
|---|---|---|
| Width | Every image scaled to 1280 px | Cases differ but text size stays the same |
| Top bar | Case id · case title · `ขั้น n/N` (step n of N) · badge PASS green / FAIL red / BLOCKED orange · 24 px text | You know at once which case and what result |
| Caption bar | Under the image, not over the screen · 28 px text · black background, white text | Still readable (~17 px) when shrunk to 800 px |
| Time per step | 2–6 seconds, by caption length | Time to read, no need to pause the image |
| Closing image | Big result + problem + expected / actual | The last image alone tells the story |
| Font | Sarabun (Thai + English) and the ✓ ✗ symbol set are in `assets/fonts/` | Looks the same on every machine |

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

Use this when test results decide whether an app got better or worse (against the old system, across versions, or as a loop's criterion) · source: a real measurement of 6 versions of a web clone app (Week 03 of Teaching_CWN2026) · the numbers are examples from that job

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

- The runner should keep evidence for every item, passed and failed, and use separate exit codes: 0 = all passed · 1 = some items failed · 2 = the runner crashed
- Raw data recorded from the network contains cookies and tokens. Never commit it and never take it off the machine.
- The numbers above come from a single job, and the version-comparison example has 3–4 points. Use them to see direction, not as statistical proof.

## Check before sending

- [ ] A case marked `Pass` was really run this round (`principle-prove-it-works`) · one not run gets `Not run` with a reason
- [ ] Open the GIF of at least 1 failed case by eye: the caption reads clearly, and the red frame sits on the spot
- [ ] The count in the report's summary table = the number of cases in `run.json` = the results in Excel
- [ ] If the results judge an app or a loop: the exam was run against the old system · every uncounted item has a reason · "failed at setup" is separated from "fail" (item 5)
- [ ] No real data or passwords in the images
- [ ] Raw images are in `_to_delete/`, none left in `qa/`
- [ ] The scripts' own tests pass: `python "<โฟลเดอร์ skill test-evidence>/scripts/make_evidence.py" --self-test` · `python "<โฟลเดอร์ skill test-evidence>/scripts/record_results.py" --self-test`
