# skill: temp-file-discipline

Use when a task writes temporary files into a project

# Temporary file discipline — keep non-products in `_to_delete/<task folder>/`

> **One rule:** anything that is not a real work product must live only in `_to_delete/`. Never leave it in the project root, and never mix it with work files.

## Use when
- A task creates check images, logs, one-off scripts, backups, extracted zips, converted copies of documents (`.docx`/`.pdf` → `.md`), or replaces a file (the old one is now temporary).
- Finishing work in a project: confirm the root holds no stray files.

Not for: a work product the user keeps (goes in its own destination folder) · intermediate steps not tied to any project (use the session's workspace).

## Steps
1. **Decide what is temporary:** check images, logs, one-off scripts, backups, extracted zips, converted copies, old versions, anything no longer in use. Not temporary: a work product the user asked for · the source file of a work product (keep it in a subfolder beside it) · files the user placed themselves (never move them without asking) · build output (leave it, check `.gitignore`). If unsure whether the user created or uses a file, do not move it; tell the user. Detail: [`references/layout.md`](references/layout.md).
2. **Use one `_to_delete/` at the project root.** From inside a subfolder (such as the code folder), write to the project root's `_to_delete/`; do not nest one. A temporary file that landed in the root: move it into `_to_delete/` right away.
3. **Make a task folder when the task starts**, before the first temporary file: `_to_delete/YYYY-MM-DD-<topic>/` (the day the task started; topic lowercase English joined by `-`, 2–5 words, such as `2026-11-06-temp-task-folders`, not `task1`). A task that spans rounds or sessions reuses its folder; a new topic gets a new folder. Sub-agents write into the lead's task folder; put the path in the brief.
4. **Never place a file directly in `_to_delete/`**, except what a tool or hook creates at a fixed place (`superuser-lock/` · `STOP`) and `delete-plan.txt`.
5. **When another skill writes `_to_delete/<x>`** (such as `_to_delete/screenshots/`), read it as `_to_delete/<task folder>/<x>`. For a script whose default is `_to_delete/...`, pass `--out` pointing into the task folder.
6. **Use only these subfolder names inside the task folder:**

   | Subfolder | What goes in |
   |---|---|
   | `drafts/` | Temporary drafts that are not the original (a re-rendered markdown original lives at `docs/src/<topic>.md`; `superuser:document-naming`) |
   | `attempts-<topic>/` | Work of each competing agent ([`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md)) |
   | `screenshots/` | Rendered mockup images or images for checking work |
   | `logs/` | Logs from a one-time run |

   Code work (`verify-runs/` · `security/` · `check/`) → `superuser` → `references/code-extensions.md` in plugin `software-development`.
7. **Add `_to_delete/` to `.gitignore`** in every git project (check first, add if missing). If the project README already names another temporary folder (`tmp/` `scratch/`), follow it and record 1 row in the "การตัดสินใจ" table. Never use `.cache/`.
8. **At the end of the work,** say where this task's temporary things are in one line (`_to_delete/2026-11-06-login-page-redesign/`), with no long list. Then run `node <this skill's folder>/scripts/root-check.mjs <project root>`. It lists things in the root outside the allowed list (`ref` `docs` `mockup` `assets` `qa` `_to_delete` `.claude` the code folder, and things in `.gitignore`); for things the project keeps in the root on purpose, add `--allow README.md,LICENSE`.
9. **Never delete on your own.** Delete only when the user orders it (deleting in the user's folder cannot be undone). When ordered, move into `_to_delete/` first, tell the user, and actually delete only things inside `_to_delete/` when the user orders that directly:
   1. Write the plan into `_to_delete/delete-plan.txt`, 1 path per line from the project root (a whole task = its folder on one line).
   2. Run `node <this skill's folder>/scripts/delete-plan-check.mjs _to_delete/delete-plan.txt`. It prints the delete list and the keep list to compare. A path that escapes `_to_delete/` (`..` · full path · a link pointing outside) makes it exit 1, and you must not delete.
   3. Only after it passes, delete line by line from the "delete" list. The script does not delete. Never build the list from `ls` (on Windows names may end in `/`; see `context-budget` → [`windows-shell`](../context-budget/references/windows-shell.md)).

## Check before done
- [ ] Every temporary file is under `_to_delete/<task folder>/` using the standard subfolder names.
- [ ] `root-check.mjs` shows nothing unexpected in the root.
- [ ] `_to_delete/` is in `.gitignore`.
- [ ] The reply says where the temporary things are, in one line, and nothing was deleted without the user's order.

## References
- [`references/layout.md`](references/layout.md) — open when unsure whether a file is temporary, or for the example layout and anti-patterns.


## reference: layout.md

# Layout of `_to_delete/` and what counts as temporary

Open when you are unsure whether a file is temporary, or when you need the example layout.

## Example layout

```
โปรเจกต์/
├── ผลงานจริง
└── _to_delete/
    ├── 2026-11-06-login-page-redesign/
    │   ├── screenshots/
    │   ├── logs/
    │   └── transfer.zip
    ├── 2026-11-07-fix-export-bug/
    │   └── logs/
    └── superuser-lock/            ← ของเครื่องมือ ไม่ใช่ของงาน
```

(Gloss: `โปรเจกต์/` = project · `ผลงานจริง` = real work products · `ของเครื่องมือ ไม่ใช่ของงาน` = belongs to the tool, not to a task.)

## What counts as a temporary file

- A compressed file sent through chat to get files onto the machine, and the folder it was extracted to
- Images rendered to check work · screenshots · sample files made for comparison
- Backup copies of a file being edited · files `.bak` `.old` `.tmp` `ไฟล์ (1).xlsx` (`ไฟล์` = "file")
- Scripts written for one use · log files from a one-time run
- Intermediate-format files during a conversion, such as an `.svg` already converted to `.png`
- **Documents converted to another format to make them easier to read or process** (a `.docx` or `.pdf` converted to `.md`). The original is the real thing and the converted one is temporary. Never mix them in the documents folder, or in 3 months nobody knows which file is the version the client signed off
- Old versions of a file that was just replaced. A file no longer in use is a temporary file: when you replace an old file with a new one, move the old one into `_to_delete/` and do not leave them side by side

## What does not count

- A work product the user asked for
- Source files of a work product, such as design files `.psd` `.fig` · a `.py` that produces an image · an `.html` that is the source of an image. If you will edit next year, you need the source file, so keep it in a subfolder beside the work product, not in `_to_delete/`
- Files the user placed themselves, even if they look like junk. Never move the user's things without asking
- Output of build tools (`build/` · `node_modules/`): leave it, check that it is in `.gitignore`, and never move it into `_to_delete/`

## Anti-patterns

- Extracting a zip into the project root and cleaning up later
- Naming files `file-v2` `file-final` `file-really-new` (Thai: `ไฟล์-v2` `ไฟล์-final` `ไฟล์-ใหม่จริง`) and leaving them beside the original
- Leaving a project task's temporary files in the session workspace, so the user cannot check back after the session ends
- Making a new subfolder name for an existing kind of thing (`shots/` `img-check/`)
- Placing files directly in `_to_delete/` or sharing `screenshots/` across tasks
- Leaving stray files without telling anyone


---

# skill: flag-and-propose

Use when a mid-task finding needs a decision before going on

# Flag what you found, then propose a way forward

> **The one rule:** open with the **impact**, close with **one question**.
> The middle is evidence and proposals, not a story of how you found it.

## When to use this skill

- You find something that makes the original plan unusable while working on something else.
- Numbers, files or documents disagree, and you must know which to follow. Only when a wrong choice cannot be undone. If it can be undone, choose yourself and log it in [`decision-log`](../decision-log/SKILL.md).
- There are several ways forward that cannot be undone, cost a lot of money or time, or go out to outsiders, and the user must choose first. In SuperUser, finish the other parts first, then write this under **รออนุมัติ** (awaiting approval) at the end. Do not stop to ask mid-task.
- You propose adding or changing something the user has not asked for.

## When to use something else, or use it together

| Work | Skill | |
|---|---|---|
| Answer a question the user asked | `answer-shape` | instead |
| A reversible choice (can be changed later at no cost) | `principle-proceed-on-reversible-work`: do it now, then log it in `decision-log` | instead |
| An unknown fact (number, name, date, budget) | Put `(รอยืนยัน)` (awaiting confirmation) and keep going; do not stop to ask | instead |
| Something is really broken and must be fixed now | `targeted-fix`: fix first, then report | instead |
| What you found is a real system incident | `incident-runbook-template` · `postmortem-template` (plugin `software-development`) | together |

---

## 1 · The 4-block answer

| Block | Length | Rule |
|---|---|---|
| 1 · What you found + the result if not fixed | 1–2 lines | **Always first.** No lead-in, no repeating the question |
| 2 · Evidence | Table, at most 5 rows | Only the numbers that disagree. Do not tell how you checked |
| 3 · Proposal | Table, at most 5 rows | Do what → **get what**, not do what → how |
| 4 · Closing question | 1 question | One question, multiple choice, every option backed by evidence (section 6) |

Block 2 can be cut if there are no numbers. Block 3 can be cut if you have no real proposal yet.
**Blocks 1 and 4 cannot be cut.**

**The whole answer should end within 1 screen.** Longer than that means you are explaining a process, not asking for a decision.

---

## 2 · Block 1: the one-sentence formula

```
<อะไรผิด> เพราะ <สาเหตุสั้น ๆ> · ต้อง <ทำอะไร> ก่อน <ขั้นถัดไป> ไม่งั้น <ผลเสียที่เป็นรูปธรรม>
```

| Wrong: written as a story | Right: written opening with the impact |
|---|---|
| "ระหว่างทำสรุปยอดผมพบว่าไฟล์ยอดขายที่ดึงมาเมื่อเช้านี้นั้นเป็นฉบับก่อนที่ร้านจะแก้ราคา…" | "**สรุปยอดขายใช้ราคาเก่า** เพราะดึงจากไฟล์ก่อนร้านแก้ราคา ต้องดึงใหม่ก่อนส่งบัญชี ไม่งั้นภาษีคำนวณผิด 38 รายการ" |

- **The "ไม่งั้น…" (otherwise…) part must be concrete.** "ข้าม FR-14.x (Functional Requirement — ความต้องการเชิงฟังก์ชัน ข้อ 14.x) ทั้งชุด" (skips the whole FR-14.x set), not "อาจมีปัญหาตามมา" (may cause problems later).
- Do not say when or how you found it, unless how you found it changes what must be done.
- Use bold only for **words that change the decision**, not every important word.

---

## 3 · Numbers that disagree: always a comparison table

Two or more values that do not match are always harder to read in a sentence than in a table.

```markdown
| | ที่บันทึกไว้ | ของจริง |
|---|---|---|
| ออเดอร์ที่ดึงมา | 214 | **245** |
| ราคา SKU-07 | 390 | **420** |
| ค่าส่งต่างประเทศ | ไม่มี | **มี** |
```

- Column headings say **which value can be trusted**: "ที่บันทึกไว้ / ของจริง" (recorded / actual), not "เก่า / ใหม่" (old / new).
- Bold the correct side, so a glance shows what to follow.
- Rows that already match: **leave them out.**

**Drop an old question or assumption that new data made obsolete, in one line,**
such as "คำถามข้อ 1 เรื่องยอดไม่ตรง — ตกไปเอง" (question 1 about the mismatched total, dropped by itself), and move on. Do not explain why it dropped.

---

## 4 · Proposals as a "do what → get what" table

```markdown
| ไฟล์ | ได้อะไร |
|---|---|
| สารบัญของโฟลเดอร์งาน (`README`) | รู้ว่าอ่านอะไรก่อน ใครเป็นเจ้าของ |
| วันที่และฉบับบนหน้าแรกของแต่ละไฟล์ | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอ |
```

- The right column is the **benefit**, not the steps. The reader is deciding whether it is worth it, not doing it.
- Order from most worthwhile downward, not in the order of doing. "Worthwhile" is measured by the formula: people or files that benefit × impact × confidence ÷ effort. With 3 or more items, fill in numbers using the template [`templates/priority.json`](templates/priority.json) and run `node <plugin>/skills/decision-scoring/scripts/decide.mjs priority priority.json`. Put `"first": true` on any item that makes the result wrong or unsafe so it always comes first. If time is limited, use `knapsack` instead (`decision-scoring`).
- **Tie the proposal to the problem you just found, if you can.** It is the strongest reason you have.
- More than 5 rows means you are proposing several things mixed together. Split them into separate rounds.

---

## 5 · Also say what you will **not** do

One line, with the reason and when to do it instead.

> รายงานย้อนหลังรายปีไม่ทำตอนนี้ — ทำหลังยอดเดือนนี้ยืนยัน

This line heads off **"แล้วอันนั้นล่ะ ทำไมไม่ทำ"** (what about that one, why not do it), which is the question that follows almost every time.
It also signals that you thought it through and did not forget.

---

## 6 · Close with one question

```
เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วยดึงไฟล์ใหม่ + อัปเดตสรุป
```

| Rule | Reason |
|---|---|
| **One question** per answer | If you ask two or more, you get an answer to only one |
| Answerable in a few words | "ทั้ง 4" · "เริ่มข้อ 2" |
| Offer an "all of them" option | Most users pick it. Typing their own answer costs them time |
| If there is a recommended order, put it in the question | They can answer "ตามนั้น" in one word |
| **Ask as multiple choice, every option backed by evidence** per `superuser` §6: 2–4 options · the recommended one on top, ending with `(แนะนำ)` (recommended) and 1 line of reason | They can just pick, and do not choose from options you made up |

**Never close by asking "มีอะไรให้ช่วยเพิ่มไหม" (anything else I can help with)**. It does not ask for a decision.

---

## 7 · Full example

A before-and-after example (a software requirements document and work plan) is in [`references/example.md`](references/example.md)


## reference: example.md

# flag-and-propose — full example

Moved from [SKILL.md](../SKILL.md) §7

Abbreviations in the example: Functional Requirement (FR) · Non-Functional Requirement (NFR) · Test Case (TC) · Architecture Decision Record (ADR) · Functional Specification Document (FSD) · Application Programming Interface (API)

**Before: 1 long paragraph with 3 lumps. After reading it, you still do not know what to answer.**

> เรื่องด่วนที่เจอระหว่างตรวจ — BUILD-PLAN.md ที่สร้างเมื่อเช้านี้อ่านจาก
> `_to_delete/extracted/*.md` ซึ่งเป็นฉบับก่อนที่ผมจะแก้ มันจึงบันทึกไว้ว่า
> "FR ถึง FR-13.9 · TC 214 ข้อ · ไม่มี NFR" และตั้งคำถามข้อ 1 ว่าเลข 239 ไม่ตรง
> ตอนนี้เอกสารจริงเป็น FR-14.12 และ 245 กรณีแล้ว ต้อง extract ใหม่แล้วอัปเดต
> BUILD-PLAN ก่อนให้ agent เขียนโค้ดต่อ ไม่งั้นมันจะสร้างระบบตามสเปกเก่าและข้าม
> FR-14.x กับ NFR ทั้งหมด … ถ้าจะทำให้ชุดนี้เป็นตัวอย่างของโปรเจกต์ถัดไป ผมเสนอให้
> เติม 4 ไฟล์ที่คุ้มที่สุดก่อน คือ docs/README.md เป็นสารบัญบอกว่าอ่านอะไรก่อนและ
> ใครเป็นเจ้าของ, เพิ่มตารางประวัติการแก้ไขในหน้าแรกของทั้ง 4 docx, …

**After: the same structure in 4 blocks**

> **ด่วน — `BUILD-PLAN.md` ตัวเลขเก่า** เพราะอ่านจาก `_to_delete/extracted/` ฉบับก่อนคุณแก้
> ต้อง re-extract ก่อนปล่อย agent เขียนโค้ด ไม่งั้นมันสร้างตามสเปกเก่าและข้าม FR-14.x กับ NFR ทั้งชุด
>
> | | ที่บันทึกไว้ | ของจริง |
> |---|---|---|
> | FR ถึง | 13.9 | **14.12** |
> | Test case | 214 | **245** |
> | NFR | ไม่มี | **มี** |
>
> คำถามข้อ 1 ที่ตั้งไว้ว่าเลข 239 ไม่ตรง — ตกไปเอง
>
> **ทำเป็นแม่แบบ: 4 ไฟล์ที่คุ้มสุด**
>
> | ไฟล์ | ได้อะไร |
> |---|---|
> | `docs/README.md` | สารบัญ — อ่านอะไรก่อน ใครเป็นเจ้าของ |
> | ประวัติการแก้ไข หน้าแรกของ docx ทั้ง 4 | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอพอดี |
> | `docs/DESIGN-SYSTEM.md` | ดึง token ออกจาก mockup มาเขียนเป็นเอกสาร |
> | `docs/decisions/` | แยก ADR-1..12 เป็นไฟล์ละข้อ |
>
> FSD กับ API spec ไม่ทำตอนนี้ — ทำตอนเริ่มเขียนโค้ดของแต่ละหน้าจอ
>
> เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วย re-extract + อัปเดต BUILD-PLAN

**What disappeared, though the information is just as complete:** the lead-in · the story of how it was found ·
full file names that do not help the decision · the explanation of why the old question dropped ·
the how-to details of each proposal
