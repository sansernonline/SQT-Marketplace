---
name: spec-to-code-loop
description: Use when building test-first from a spec and mockups
---

> **In SuperUser:** this loop is the core of the playbooks [`feature`](../superuser/references/playbook-feature.md) and [`new-project`](../superuser/references/playbook-new-project.md). If superuser is open, follow the playbook and use this file as the detail of the loop.

# The loop from requirements to code

> **The one rule:** the loop needs a stop condition that **gives a result the moment you run it**.
> "Finish implementing the requirements" cannot be checked by a machine, while "all 47 tests are green" can.

---

## What you must have before starting

| What you need | If missing |
|---|---|
| Requirements that are each testable, with an ID such as `FR-AUTH-010` (FR = Functional Requirement) | Stop and use `srs-writing` to make them testable first |
| A 1-line test command that really runs | Stop and set up the test skeleton first, using `testing-standards` |
| A command to run the app and look at it (if there are screens) | Skip the image-comparison step for now, and tell the user it was skipped |
| Mockup images named to match the screens | Ask the user, otherwise the UI will never match |

**Starting without all of these amounts to writing code that nobody can tell is right or wrong**

---

## 1 · Round zero — plan, no code yet

Read the requirements and mockups in full, then break them into sub-tasks, **1 requirement per task**
and write them to `docs/BUILD-PLAN.md`

```markdown
| # | รหัส | milestone | สิ่งที่ต้องได้ | ไฟล์ที่จะแตะ | test ที่จะเขียน | สถานะ | commit |
|---|---|---|---|---|---|---|---|
| 1 | FR-AUTH-010 | M2 | ล็อกอินด้วยอีเมลและรหัสผ่าน | auth/login.ts · auth/session.ts | login_FR-AUTH-010 | ค้างอยู่ | |
| 2 | FR-AUTH-020 | M2 | ล็อกผู้ใช้หลังผิด 5 ครั้ง | auth/lockout.ts | lockout_FR-AUTH-020 | ค้างอยู่ | |
```

The `milestone` column takes an `M…` ID from the project plan or the timeline in `BUILD-PLAN.md` (playbook `new-project` step 1) · no timeline → may be empty

**Documents conflict → follow the order, do not guess** — write a 1-line priority order of the documents at the very top of `BUILD-PLAN.md` before splitting the work, for example `ลำดับเอกสาร: TEST-DATA.md > REQUIREMENTS.md > DESIGN.md > mockup` (document order: …)
- The user has already set an order → use it
- Not set → use the default: test data with expected values (the clearest numbers) > requirements (Software Requirements Specification — SRS) > design document > mockup, and log it in `decision-log` with `(รอยืนยัน)` (awaiting confirmation)
- A real conflict found → follow the higher-ranked document, and record the conflicting pair (file · section · both values) under "ค้างอยู่" (pending) for the owner to fix the source · never edit the source documents yourself

**If an item is so ambiguous that you cannot write a test, do not guess** — collect it into a list of questions at the end of the file, put it under the heading **"ค้างอยู่"** (pending) once, and carry on with the other items

> Questions to ask instead of guessing: what is the boundary value · what must happen on failure ·
> who may see this data · if the item already exists, overwrite or warn

**Check the plan yourself before sending — 5 items, do it yourself, no need to send an agent** (adapted from superpowers `writing-plans` · MIT)

| Item | Ask | If found, do |
|---|---|---|
| Complete | Going through every requirement in the SRS or FSD, can you point to a row in the table | Cannot point → add a row |
| Size | Each row gives a writer 1 sensible thing, not so wide they must guess, not so detailed it becomes code | Wide → split · detailed → leave the signature and the test name |
| Names match | The types · functions · columns that later rows reference are spelled as the first row set them | Different → fix to one name |
| Biting cases | Each kind of input and failure path the requirement implies: which row has a test for it | None → add a test name to the owning row |
| Proportion | A plan many times longer than the requirements = pre-written code, not a plan | Cut the code body to signatures and assertions |

Fix in place when found, no need to check again

At the end of round zero you **must stop** and let the user read the plan first — do not flow on to write code yourself

If building from a single build prompt: read the prompt through before pasting, fix anything that does not match the requirements first, then paste in a fresh session with empty memory to prove the prompt is really complete (reported from the training exercise, not measured against a baseline)

---

## 2 · The loop per requirement

```
อ่าน BUILD-PLAN.md  →  หยิบข้อแรกที่ยังไม่ทำ
  1. เขียน test ก่อน  ชื่อ test มีรหัสข้อกำหนดอยู่ในชื่อ
  2. รัน test ให้เห็นว่า "แดง"        ← ข้ามขั้นนี้ไม่ได้
  3. เขียนโค้ดจน test เขียว
  4. รัน test ทั้งชุด                  ← กันของเดิมพัง
  5. หน้าจอ: ถ่ายภาพจริงเทียบ mockup   ← ข้อ 5 ข้างล่าง
  6. อัปเดตสถานะใน BUILD-PLAN.md + commit หนึ่งข้อต่อหนึ่ง commit (เมื่อได้รับอนุญาตเท่านั้น — ไม่ได้อนุญาต → ใส่ข้อความ commit ที่แนะนำในคอลัมน์ commit พร้อม `(รอ commit)`)
  →  วนข้อถัดไป
```

**Step 2 is the one people skip most, and the costliest to get wrong** — a test that has never been seen red
may pass forever whether the code is right or wrong

**If the user says TDD · test-driven · "write the test first"** — that is this very loop, no need to look for another way: red = steps 1–2 (a test named with the requirement ID, which must really be seen red) · green = step 3 (the least code that makes it green, per `lazy-coding`) · refactor = done during step 4 with the whole test set still green, adding no new behaviour in that round · the unit of 1 round is 1 requirement, not 1 function, so it is smaller than people think and larger than textbook TDD · for test skeleton · run command · ratio of unit to integration see `testing-standards` · no testable requirement → you cannot do TDD yet, go back to "What you must have before starting"

---

## 3 · Iron rules

1. **Never edit or delete a test to make it pass** — a red test means the code is wrong, not the test
   A test may be edited only when you can prove it was written wrongly against the requirement, and you must tell the user every time
2. **1 requirement per round** — never bundle several because "they are similar"
3. **A single requirement may be tried at most 3 rounds** — fails 2 rounds → split into sub-steps, do not retry the same way · 3 rounds reached → **mark it `ติด` (blocked) and follow "After stuck" below**, do not keep trying on and on
4. **Never mock the thing under test** — you may mock external things, you may not mock yourself
5. **Never skip to an easier requirement** before trying 3 rounds — the order in the plan is the real order, and only items already marked `ติด` (blocked) may be skipped

### After stuck — 5 steps

1. **Record why it is stuck** under "ค้างอยู่" (pending): what was tried across all 3 rounds · where you think the problem is · what you need to go on (an answer · data · permission)
2. **Go back to the last point where tests were green** — keep the pending work in a branch `stuck/<ID>` (if not permitted to commit → keep it as a patch at `_to_delete/patches/stuck-<ID>.patch` instead) and return the line of work to where the whole test set is green. The test of the stuck item stays in that branch or patch too, never delete it
3. **Items that wait on the stuck item** are marked `ติด` (blocked) with the reason `รอ <ID>` (waiting for <ID>) without trying, then go to the next item in plan order that does not wait on it
4. **Try 1 more round at the end** — once everything else is done, have a new agent on a larger model try 1 round from branch `stuck/<ID>` (or the kept patch) and record it in step 1 · if an answer is already in the inbox (`.claude/superuser/inbox/`) → start from that answer
5. **Still stuck** → keep `ติด` (blocked) in the closing report, stating what is needed from the user · if the user answers later → continue from that item per the playbook `pickup-and-pause`

---

## 4 · The status file — context will certainly run out

A loop is always longer than one conversation can remember. **State must live in a file, not in the head**

- `docs/BUILD-PLAN.md` — the plan and status. **Read this file before starting every round**
  This is the only file this loop adds to the main documents folder
- Status has only 5 values (the same set as `superuser`): `เสร็จ` (done) · `ทำอยู่` (in progress) · `ติด` (blocked) · `รออนุมัติ` (awaiting approval) · `ค้างอยู่` (pending) — work not yet started uses `ค้างอยู่`
- `ติด` must have a 1-line reason after it
- Every `เสร็จ` item must have a commit number — no number means not really done · except when not yet permitted to commit (commit only when permitted): put the recommended commit message + `(รอ commit)` (awaiting commit) and test evidence (test name + run result) in place of the number, and it may count as `เสร็จ`
- At the end of each round, update the headings `## สถานะล่าสุด` (latest status) and `## ประวัติสถานะ` (status history) at the top of the file per `status-report` — the task table and the status table are in the same file under different headings

**Starting a new round without reading this file first is the number 1 cause of rework**

### Files the loop creates along the way — all go to `_to_delete/`

Requirements documents are often `.docx` or `.pdf` and must be converted to text before they can be re-read correctly.
**A converted file is not a document**, it is a temporary working item of the loop

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
| The plan and status `BUILD-PLAN.md` | `docs/` — it is a real document |
| Code and tests | The project folder |

**Never write converted files into `docs/` mixed with the original documents** — in 3 months nobody will know
which file is the real one the customer signed and which a machine converted

Full detail is in `temp-file-discipline`

---

## 5 · Compare to the mockup with a real image

Reading the code and saying "it matches" does not work. You must really open it and look

```python
page.set_viewport_size({"width": 1280, "height": 900})   # ให้เท่ากับความกว้าง mockup
page.goto(url); page.wait_for_timeout(500)
page.screenshot(path="_to_delete/check/login.png")
```

Then open both images and compare by these 5 items:

- [ ] Do the order and grouping of elements match
- [ ] Are spacing and font size close (not pixel-exact)
- [ ] Are all the states the mockup shows present — empty · loading · error
- [ ] Does the text match the mockup, or was it made up
- [ ] Does Thai wrap badly or lose vowels

Wherever they differ, **say so as a list**; do not stay silent and claim done
Screenshots taken for checking are temporary files — they go to `_to_delete/` per `temp-file-discipline`

---

## 6 · Traceability

A test name must contain the requirement ID, for example `test_lockout_after_5_failures_FR_AUTH_020`
so one command can search which requirement has no test covering it

Close the job with a traceability table: every requirement → the test that covers it → the latest result

> **For any requirement with no test covering it, say plainly that there is none** — never write a shallow test to fill the table
> A table that is full because you filled it yourself is more dangerous than a table with gaps

---

## 7 · When to split into multiple agents

**One criterion: the files to be touched must not overlap at all** — see the "files to touch" column in the plan

| Can split | Cannot split |
|---|---|
| Different modules, different screens, files that do not overlap | Touching the same file, even just one — the work will overwrite each other |
| A **read-only** checking agent running alongside an agent that writes code | Work that already has to wait for the result of another task |
| Turning requirements into tests for several modules at once | When there is no plan yet — you need a plan first to know where you can split |

**Each agent that writes files must get its own worktree**, per the recipe in `superuser/references/code-extensions.md` section "parallel-split-and-merge" (including how to handle uncommitted work)

Every agent that is split off must receive: the IDs of the requirements it owns · the list of files it may touch ·
the test command · and all of rule 3

**Never let a split-off agent edit `BUILD-PLAN.md` itself** — have it report back, and the main agent writes the one file
otherwise the status file breaks before the code does

---

## 8 · Signs the loop is breaking

| Symptom | What it really means |
|---|---|
| All tests green from the first round without ever being red | The tests test nothing |
| The number of tests grows faster than the number of requirements closed | Writing tests to make itself pass |
| One commit touches 15 files | Several requirements bundled, cannot be reverted when it breaks |
| The same item loops past 3 rounds | The requirement is ambiguous, not the code hard, so go back and ask |
| Nobody has updated `BUILD-PLAN.md` for 2 rounds | State is in the head, the next round will redo work |
| Numbers improve but people cannot use it (text off-screen, pale colours, input fields cutting words) | The loop is chasing the metric, not solving the problem → item 10 on guards |
| The remaining items can be fixed only by adding fake data or hiding content | The ceiling of the data has been reached → item 10 on stop rules |

---

## 9 · Anti-patterns

- **Throwing the whole requirements document in one round** — the number 1 cause of messy code
- **Writing the code first and the tests after** — you get tests that confirm what was just written, not what is needed
- **Guessing when a requirement is ambiguous** — wrong from the start, but discovered at delivery
- **Editing a test to make it pass** and then reporting done
- **Splitting parallel agents on the same file**
- **Claiming the UI matches the mockup without ever opening it**
- **Closing the job with no traceability table** — nobody knows what is not yet done
- **Faking data, hiding content, or relaxing the criteria** to make numbers look good

---

## 10 · A loop that adjusts by numbers

Use it when the loop chases a metric (match the existing system · match the mockup · a measurable score) rather than closing requirement by requirement · the loop's contract, the guards against gaming the numbers, the stop rules, and a real measured example are in [`references/metric-loop.md`](references/metric-loop.md) · it must be opened and read before starting this kind of loop

---

## 11 · Connecting to other skills

| Need | Use together with |
|---|---|
| Make requirements testable first | `srs-writing` |
| Turn requirements into test cases | `test-case-template` |
| Test skeleton, test framework, names, coverage | `testing-standards` |
| Tests that open a real browser | `e2e-testing-patterns` |
| Write the simplest code that works | `lazy-coding` |
| Fix when a test is red or the result does not match | `targeted-fix` |
| Commit message format | `commit-message-format` |
| Screenshot files taken for checking | `temp-file-discipline` |
| Test sets and metrics for a number-chasing loop | `test-evidence` item 5 · `e2e-testing-patterns` (oracle-and-mutation) |
| Record state across conversation rounds | `handoff` |
| Status summary table at the end of a round | `status-report` |

---

## Abbreviations

- **test** — an automated test suite
- **mockup** — a prototype image of a screen
- **commit** — recording a change into the version control system
- **UI** — User Interface
