# BUILD-PLAN template, mockup check, parallel split, loop-failure signs

Open this when writing `docs/BUILD-PLAN.md` for the first time, comparing a screen to a mockup, splitting work across agents, or when a loop looks like it is going wrong.

Contents:
- [BUILD-PLAN.md row format](#build-planmd-row-format)
- [Where the loop's files go](#where-the-loops-files-go)
- [Compare to the mockup with a real image](#compare-to-the-mockup-with-a-real-image)
- [Splitting into multiple agents](#splitting-into-multiple-agents)
- [Signs the loop is breaking](#signs-the-loop-is-breaking)
- [Other skills to use together](#other-skills-to-use-together)

## BUILD-PLAN.md row format

```markdown
| # | รหัส | milestone | สิ่งที่ต้องได้ | ไฟล์ที่จะแตะ | test ที่จะเขียน | สถานะ | commit |
|---|---|---|---|---|---|---|---|
| 1 | FR-AUTH-010 | M2 | ล็อกอินด้วยอีเมลและรหัสผ่าน | auth/login.ts · auth/session.ts | login_FR-AUTH-010 | ค้างอยู่ | |
| 2 | FR-AUTH-020 | M2 | ล็อกผู้ใช้หลังผิด 5 ครั้ง | auth/lockout.ts | lockout_FR-AUTH-020 | ค้างอยู่ | |
```

The `milestone` column takes an `M…` ID from the project plan or the timeline in `BUILD-PLAN.md` (playbook `new-project` step 1). No timeline: it may be empty.

Questions to ask instead of guessing: what is the boundary value · what must happen on failure · who may see this data · if the item already exists, overwrite or warn.

Plan check, 5 items (adapted from superpowers `writing-plans`, MIT):

| Item | Ask | If found, do |
|---|---|---|
| Complete | Going through every requirement in the SRS or FSD, can you point to a row in the table | Cannot point: add a row |
| Size | Each row gives a writer 1 sensible thing, not so wide they must guess, not so detailed it becomes code | Wide: split · detailed: leave the signature and the test name |
| Names match | The types · functions · columns that later rows reference are spelled as the first row set them | Different: fix to one name |
| Biting cases | Each kind of input and failure path the requirement implies: which row has a test for it | None: add a test name to the owning row |
| Proportion | A plan many times longer than the requirements is pre-written code, not a plan | Cut the code body to signatures and assertions |

Building from a single build prompt: read the prompt through before pasting, fix anything that does not match the requirements first, then paste in a fresh session with empty memory to prove the prompt is complete (reported from a training exercise, not measured against a baseline).

## Where the loop's files go

Requirements documents are often `.docx` or `.pdf` and must be converted to text before they can be re-read. A converted file is a temporary working item, not a document.

```
_to_delete/
  extracted/       ← .docx .pdf ที่แปลงเป็น .md แล้ว
  check/           ← ภาพหน้าจอที่ถ่ายไว้เทียบ mockup
  logs/            ← ผลรัน test ที่เก็บไว้ดูย้อนหลัง
```

| File | Goes where |
|---|---|
| Documents converted to a readable format | `_to_delete/extracted/` |
| Screenshots taken for checking | `_to_delete/check/` |
| Test run results · logs | `_to_delete/logs/` |
| The plan and status `BUILD-PLAN.md` | `docs/` (a real document) |
| Code and tests | The project folder |

Never write converted files into `docs/` mixed with the originals; in 3 months nobody will know which file the customer signed. Full detail: `temp-file-discipline`.

## Compare to the mockup with a real image

Reading the code and saying "it matches" does not work. Open it and look.

```python
page.set_viewport_size({"width": 1280, "height": 900})   # ให้เท่ากับความกว้าง mockup
page.goto(url); page.wait_for_timeout(500)
page.screenshot(path="_to_delete/check/login.png")
```

Open both images and compare 5 items:

- [ ] Do the order and grouping of elements match
- [ ] Are spacing and font size close (not pixel-exact)
- [ ] Are all the states the mockup shows present: empty · loading · error
- [ ] Does the text match the mockup, or was it made up
- [ ] Does Thai wrap badly or lose vowels

Wherever they differ, say so as a list. Do not stay silent and claim done.

## Splitting into multiple agents

One criterion: the files to be touched must not overlap at all (see the "files to touch" column).

| Can split | Cannot split |
|---|---|
| Different modules, different screens, files that do not overlap | Touching the same file, even just one |
| A **read-only** checking agent running alongside an agent that writes code | Work that already has to wait for the result of another task |
| Turning requirements into tests for several modules at once | When there is no plan yet |

- Each agent that writes files gets its own worktree, per `superuser/references/code-extensions.md` section "parallel-split-and-merge" (including how to handle uncommitted work).
- Every split-off agent receives: the IDs of the requirements it owns · the list of files it may touch · the test command · all of the iron rules (especially rule 3).
- Never let a split-off agent edit `BUILD-PLAN.md`. It reports back, and the main agent writes the one file.

## Signs the loop is breaking

| Symptom | What it really means |
|---|---|
| All tests green from the first round without ever being red | The tests test nothing |
| The number of tests grows faster than the number of requirements closed | Writing tests to make itself pass |
| One commit touches 15 files | Several requirements bundled, cannot be reverted when it breaks |
| The same item loops past 3 rounds | The requirement is ambiguous, not the code hard: go back and ask |
| Nobody has updated `BUILD-PLAN.md` for 2 rounds | State is in the head, the next round will redo work |
| Numbers improve but people cannot use it (text off-screen, pale colours, input fields cutting words) | The loop is chasing the metric: see `metric-loop.md` guards |
| The remaining items can be fixed only by adding fake data or hiding content | The ceiling of the data has been reached: see `metric-loop.md` stop rules |

Anti-patterns: throwing the whole requirements document in one round · writing code first and tests after · guessing on an ambiguous requirement · editing a test to make it pass · parallel agents on the same file · claiming the UI matches without opening it · closing with no traceability table · faking data, hiding content or relaxing criteria to make numbers look good.

## Other skills to use together

`srs-writing` (testable requirements) · `test-case-template` · `testing-standards` (skeleton, framework, names, coverage) · `e2e-testing-patterns` (real browser) · `lazy-coding` · `targeted-fix` (red test) · `commit-message-format` · `temp-file-discipline` · `test-evidence` item 5 and `e2e-testing-patterns` (oracle-and-mutation) for number-chasing loops · `handoff` · `status-report`.
