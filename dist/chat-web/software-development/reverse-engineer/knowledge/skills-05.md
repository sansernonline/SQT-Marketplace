# skill: temp-file-discipline

Use when a task writes temporary files into a project

# Temporary file discipline

> **One rule:** anything that is not a real work product must live only in `_to_delete/`.
> Never leave it in the project root, and never mix it with work files.

---

## Choose where to put it

| What the file is | Put it in |
|---|---|
| Temporary items of work in the user's project (check images · logs · one-off scripts · run results) | `_to_delete/<task folder>/` at the project root (section "How to use"), so the user can check back later |
| An intermediate step not tied to any project (not working in the user's folder) | The session's workspace |
| A work product the user will keep | The destination folder of that work |

**The project root must hold no temporary files at all.**
- If an agent creates a temporary file and it lands in the root (log · image · trial script), move it into `_to_delete/` right away
- If you are not sure whether the user created or is using that file, do not move it yourself; tell the user
- When running from inside a subfolder (for example the code folder, see `project-bootstrap` in plugin `software-development`), write temporary things to the **project root's** `_to_delete/`, and do not create a nested one

---

## What counts as a temporary file

- A compressed file sent through chat to get files onto the machine, and the folder it was extracted to
- Images rendered to check work · screenshots · sample files made for comparison
- Backup copies of a file being edited · files `.bak` `.old` `.tmp` `ไฟล์ (1).xlsx` (`ไฟล์` = "file")
- Scripts written for one use · log files from a one-time run
- Intermediate-format files during a conversion, such as an `.svg` already converted to `.png`
- **Documents converted to another format to make them easier to read or process** — a `.docx` or `.pdf` converted to `.md`
  The original is the real thing and the converted one is temporary. **Never mix them in the documents folder**,
  or in 3 months nobody knows which file is the version the client signed off
- Old versions of a file that was just replaced

**A file no longer in use is a temporary file** — when you replace an old file with a new one, move the old one into `_to_delete/`
and do not leave them side by side.

---

## What does not count

- A work product the user asked for
- Source files of a work product, such as design files `.psd` `.fig` · a `.py` that produces an image · an `.html` that is the source of an image —
  **if you will edit next year, you need the source file**, so keep it in a subfolder beside the work product, not in `_to_delete/`
- Files the user placed themselves, even if they look like junk — **never move the user's things without asking**
- Output of build tools (`build/` · `node_modules/`) — leave it, check that it is in `.gitignore`, and never move it into `_to_delete/`

---

## How to use

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

- There is exactly one `_to_delete/` folder at the **project root** · inside, **1 folder per task**, so things do not mix and a whole task can be deleted at once
- **Task folder name** `YYYY-MM-DD-<topic>` · the date is the day the task started · the topic is lowercase English joined by `-`, 2–5 words, saying what is being done (`2026-11-06-temp-task-folders`, not `2026-11-06-task1`) · sorting by name gives time order directly
- **Create the folder when the task starts**, before writing the first temporary file · a task that continues over several rounds or across sessions uses the same folder (find it with `find _to_delete -mindepth 1 -maxdepth 1 -type d -printf '%f\n'`) · a new topic gets a new folder · when the task is split to sub-agents, they write into the lead's task folder, and the path is given in the brief
- **Never place a file directly in `_to_delete/`** · except things a tool or hook creates itself at a fixed location (`superuser-lock/` · `STOP`) and the delete plan `delete-plan.txt` (the check script requires it directly in `_to_delete/`), which do not move
- **When another skill writes `_to_delete/<x>`** (for example `_to_delete/screenshots/` · `_to_delete/deck-check`), always read it as `_to_delete/<task folder>/<x>` · for a script whose default is `_to_delete/...`, pass `--out` pointing into the task folder
- Standard subfolders **inside the task folder** that other skills use — use only these names:

  | Subfolder | What goes in | Skill that uses it |
  |---|---|---|
  | `drafts/` | Temporary drafts that are not the original (the markdown original that is re-rendered lives permanently at `docs/src/<topic>.md`) | `superuser:document-naming` |
  | `attempts-<topic>/` | Work of each competing agent | [`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md) |
  | `screenshots/` | Rendered images of a design mockup or images for checking work | every design skill |
  | `logs/` | Logs from a one-time run | every skill |

  Code work (`verify-runs/` · `security/` · `check/`) → the addition in plugin `software-development` → `superuser` → `references/code-extensions.md`
- Put `_to_delete/` into `.gitignore` in every project that uses git — check first, and add it if missing
- A project whose README already names another temporary folder (for example `tmp/` `scratch/`) → follow that, then record 1 row in the "การตัดสินใจ" (decisions) table · none named → `_to_delete/` · never use `.cache/` (it belongs to tools and can mix with tool state)

---

## At the end of the work

1. **Say where this task's temporary things are**, in one line (`_to_delete/2026-11-06-login-page-redesign/`), with no long list
2. **Never delete on your own** — delete only when the user orders it; deletion in the user's folder cannot be undone
3. **When the user orders deletion** → move into `_to_delete/` first (per the central rule), then tell the user · actually delete only things inside `_to_delete/` when the user orders it directly, in 3 steps:
   1. Write the plan into the file `_to_delete/delete-plan.txt`, 1 path per line, counted from the project root (`_to_delete/2026-11-06-login-page-redesign`) · to delete a whole task, put the task folder on one line
   2. Run `node <this skill's folder>/scripts/delete-plan-check.mjs _to_delete/delete-plan.txt` → it prints the delete list and the keep list to compare · any path that escapes `_to_delete/` (`..` · full path · a link pointing outside) makes it exit 1, and you must not delete
   3. Only after it passes, delete line by line from the "delete" list; the script does not delete by itself · never build the list from `ls` (on Windows names may end in `/`, see `context-budget` → [`windows-shell`](../context-budget/references/windows-shell.md))
4. **Before saying the work is finished**, run `node <this skill's folder>/scripts/root-check.mjs <project root>` → it lists things in the root outside the allowed list (`ref` `docs` `mockup` `assets` `qa` `_to_delete` `.claude` the code folder, and things in `.gitignore`) · for things the project deliberately keeps in the root, add `--allow README.md,LICENSE`

---

## Anti-patterns

- **Extracting a zip into the project root** and cleaning up later — later never comes
- **Naming files `file-v2` `file-final` `file-really-new`** (Thai: `ไฟล์-v2` `ไฟล์-final` `ไฟล์-ใหม่จริง`) and leaving them beside the original
- **Deleting a user's file because you think it is no longer used**
- **Leaving a project task's temporary files in the session workspace** — after the session ends the user cannot check back
- **Making a new subfolder name for an existing kind of thing** (`shots/` `img-check/`) — use the names in the table above
- **Placing files directly in `_to_delete/` or sharing `screenshots/` across several tasks** — a week later nobody knows which image belongs to which task, and you cannot delete one task alone
- **Keeping a work product's source file in `_to_delete/`** — that is not temporary
- **Leaving stray files without telling anyone** — the user will find them on their own months later

---

Abbreviations and technical terms in messages to the user follow `spell-out-abbreviations`.


---

# skill: flag-and-propose

Use when a mid-task finding needs a decision before going on

# Flag what you found, then propose a way forward

> **Language:** write every line of wording following `human-writing`. This skill gives the format and structure. human-writing says how to write so the reader understands.

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
| Report finished work | `human-writing` · `status-report` | instead |
| Explain something complex so it is understood | `answer-shape` | instead |
| Write a document for others to read | `polished-document-style` | instead |
| Something is really broken and must be fixed now | `targeted-fix`: fix first, then report | instead |
| Spell out abbreviations and jargon in the answer | `spell-out-abbreviations` | together |
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

---


## 8 · Anti-patterns

- **Opening with "ระหว่างตรวจผมพบว่า…" (while checking I found…).** The reader must read to the end of the paragraph to learn what to do.
- **Disagreeing numbers written as a sentence.** "เดิม 214 ตอนนี้ 245" (was 214, now 245) makes the eye jump back and forth.
- **Explaining how the problem happened** when it does not change what must be done.
- **A proposal that says how to do it instead of the benefit.** The reader still cannot decide.
- **Three questions in one paragraph.** You get one answer and must ask again.
- **Closing with "แจ้งได้เลยครับ" (just let me know).** It asks for no decision.
- **A long apology for a mistake.** Say what was wrong and how you fix it. That is enough.
- **Reporting without proposing.** It pushes all the thinking back to the user.


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


---

# skill: markdown-visuals

Use when a Markdown doc needs an image, SVG or ASCII art

# Markdown Visuals

> **Pre-work gate (every time):** read the owner's theme → search live references → 3 genuinely different directions → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

> **Language:** write every line of wording per `human-writing`. This skill gives the format and structure; human-writing gives the way to write so people understand.

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (plugin `software-development`) (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every plan, process, design, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — sketch, flow or state in a business plan, report, process guide, spec or README
- Writing a plan, Functional Specification Document (FSD), Business Requirements Document (BRD), Architecture Decision Record (ADR) or architecture doc that describes layout, flow, or relationships (the diagrams themselves follow the routing rule below)
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) (plugin `software-development`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG (doc read on GitHub → same SVG as a `.svg` file, §2)
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / process / money flow / decision   →  repo note (README · Pull Request (PR) · code note) → Mermaid (`software-diagrams`, plugin `software-development`)
│                                              project document (BRD · Software Requirements Specification (SRS) · FSD · ADR) or read outside the team → `diagram-figures`
├─ Architecture / Entity-Relationship (ER) / class → same rule as the line above
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design (plugin `software-development`) tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Routing rule (same in `software-diagrams` and `diagram-figures`):** markdown in a repo read by the team (README · PR · code note) → Mermaid via `software-diagrams` · a project document (BRD · SRS · FSD · ADR · ER · flows) or anything people outside the team read → `diagram-figures`.

**Follow the tree above.** Where the doc will be read decides inline SVG vs image file:

- **Inline `<svg>` renders** in VS Code preview, Obsidian, many static-site generators and chat replies.
- **Inline `<svg>` does not render on GitHub** — GitHub's sanitizer drops the `<svg>` element, so the reader sees nothing. Other hosts (GitLab, Bitbucket): preview before relying on it.
- **Doc will be read on GitHub** → save the SVG as `docs/figures/x.svg` and reference it with `![alt](figures/x.svg)` or `<img>` (§2). It still versions cleanly in git and stays editable.

## 1 · Inline SVG (for viewers that render it — not GitHub)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background = bg-canvas of the project palette (see สี below) -->
  <rect width="640" height="280" rx="14" fill="<bg-canvas>"/>

  <!-- content goes here -->
</svg>
</p>
```

**Required attributes:**
- `xmlns="http://www.w3.org/2000/svg"` — required when the same markup is saved as a `.svg` file (GitHub shows `.svg` files only through `![]()` / `<img>`, and only with `xmlns`)
- `viewBox` — sets the coordinate space; lets the SVG scale responsively
- `role="img"` + `aria-label` — accessibility, screen readers
- `<p align="center">` wrapper — centers in the rendered page

**Sizing:** Use `viewBox` (not width/height) so it scales. Common sizes:
- Sketch of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี

If the document or project already has a colour palette, use it. If not, search for references per `design-references` (plugin `superuser`), type `document`, and take the colours from the chosen work · if live search is not possible, use the house value `#2A78D6`, mark it `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask (order in `diagram-figures` item 5 · colour-by-domain table [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) · for role-based tokens (`bg-canvas` · `accent-primary` · `state-*` …) see [references/svg-snippets.md](references/svg-snippets.md) · and **1 document uses 1 palette**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](references/svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

## 2 · External image files

Use when:
- The doc will be read on GitHub (inline `<svg>` is dropped there) — save the SVG as a file
- Photo or screenshot
- Illustration too complex to author as SVG by hand (50+ shapes)
- Reusing the same image across many docs
- Generated by a design tool (Figma export, etc.)

### Folder convention

```
docs/
  figures/
    01-hover-state.svg
    02-empty-state.png
    architecture-overview.svg
    src/                      editable sources (.mmd · .drawio · .html)
```

- Put figures in `docs/figures/` (editable sources in `docs/figures/src/`) — relative to the doc · brand files (logo, icons) live in the project-root `assets/`, not here
- Name files `<doc-section-number>-<short-slug>.<ext>` so they sort with the doc
- Prefer `.svg` over `.png` when possible (scales, smaller, diff-friendly)

### Reference syntax

```markdown
![Hover state showing magnified Projects tile](figures/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="figures/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file in `docs/figures/`.

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](references/ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**Choosing a diagram type, theme, readability rules and Thai labels is covered in `software-diagrams` (plugin `software-development`) items 1–5 and `assets/mermaid-theme.md`** · for Mermaid in project documents that must be converted to a picture for Word, use the converter in `diagram-figures` → `references/engine-mermaid.md`
This file only says *when to choose Mermaid over other formats*

| Choose Mermaid when | Choose something else when |
|---|---|
| It is boxes and arrows that the engine can lay out | If you must control placement yourself, use inline SVG; for a figure that must look designed, use `diagram-figures` (HTML layout or engine-svg-python) and embed it as an image file |
| It lives in a file that must be diffed in git | It is a real screenshot: use an image file |
| Readers open it in GitHub or Notion | Readers open it in a Word document or slides: use an image file |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](references/combining-formats.md). Don't force everything into one format.

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

## Anti-patterns

- **Text-only design docs** — "the icon is in the top-right" with no picture
- **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- **PNG screenshots of text** — use the text, in a code block
- **Inline `<svg>` in a doc read on GitHub** — GitHub drops it; save as `docs/figures/x.svg` and use `![alt](figures/x.svg)` · a `.svg` file without `xmlns` also fails
- **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- **ASCII art outside a code fence** — proportional fonts will mangle alignment
- **Mermaid syntax newer than the viewer** — GitHub's Mermaid version changes; check it with a ```` ```mermaid ```` block containing `info` before using new diagram types
- **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

## Quick-start recipe

When a markdown doc needs a design picture (clickable app screens go to the platform design skill, `mockup/<CODE>-mockup.html`):

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

Not sure a visual will render? Preview it in the viewer the reader will use (GitHub, Notion, VS Code) before delivery.

## Related skills

- `polished-document-style` — overall doc formatting, figure captions, callout boxes
- `simplicity-first` (plugin `software-development`) — don't over-design the diagram; show what's needed
- `software-diagrams` (plugin `software-development`) — which diagram type answers which question, plus the shared Mermaid theme
- `diagram-figures` — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- `ui-craft` (plugin `software-development`) — spacing, hierarchy and states when the picture is a screen

## ไม่ให้ดูเหมือน AI ทำ

Before sending, go through item 3 of `no-ai-look` — for HTML work, run its script · every piece must also pass eye check 3.2 (a web page adds items 10–14), because a script result of 0 items is not yet a pass · the bans in this file are specific to this work, and the full list for all media is there

## ตัวย่อ

Spell out each abbreviation in full on first use and put the short form in brackets — for example Model Context Protocol (MCP)
After that, use the short form. Details are in the skill `spell-out-abbreviations`


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](../SKILL.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

## Box-drawing characters

```
┌─────┐  ┏━━━━━┓  ╭─────╮  ┌╌╌╌╌╌┐
│     │  ┃     ┃  │     │  ╎     ╎
└─────┘  ┗━━━━━┛  ╰─────╯  └╌╌╌╌╌┘
 light    heavy   rounded   dashed
```

Corners: `┌ ┐ └ ┘` ‧ `┏ ┓ ┗ ┛` ‧ `╭ ╮ ╰ ╯`
Lines:   `─ │` ‧ `━ ┃` ‧ `═ ║`
Joins:   `├ ┤ ┬ ┴ ┼`
Arrows:  `→ ← ↑ ↓ ▲ ▼ ▶ ◀ ↔ ↕ ⇒ ⇐`
Dots:    `• · ◦ ● ○ ▪ ▫`

## Common patterns

**Layout sketch:**
```
┌─────────────────────────────────────┐
│ Header        [Search]      [👤]    │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main content             │
│  • Item  │                          │
│  • Item  │  ┌────────────────────┐  │
│          │  │  Primary CTA       │  │
│          │  └────────────────────┘  │
└──────────┴──────────────────────────┘
```

**State machine:**
```
┌─────────┐  hover  ┌──────────┐  click  ┌─────────┐
│  REST   │────────►│ MAGNIFIED│────────►│ LAUNCH  │
└─────────┘◄────────└──────────┘◄────────└─────────┘
            exit               done
```

**Curve / chart:**
```
scale
 ↑
1.7│         ╱╲
1.4│       ╱    ╲
1.2│     ╱        ╲
1.0│___╱            ╲___
   └──────────┬──────────→ cursor X
         tile.Center
```


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](../SKILL.md) · a full design spec usually mixes formats.

The 6-part pattern for a design spec:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't force everything into one format. Each format is best at something different.


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG pictures of a screen inside .md docs (the real mockup is HTML) · used by [SKILL.md](../SKILL.md) §1

## Colour: it comes from the subject, not from a ready-made table

If the document or project already has a colour set, use that set.
If not, use the house value `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask. Propose a tone drawn from the subject in the report: medical green · finance dark blue ·
industrial amber · government navy · general software blue (the full table is in [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

Define **tokens by role** at the top of the document, then use the same values in every figure in that document:

| Token | Role | Comes from |
|---|---|---|
| `bg-canvas` | Background of the figure | The darkest shade (dark mode) or the lightest (light mode) |
| `bg-surface` | Sheets, panels, cards | Different enough from canvas to show the edge without drawing a line |
| `bg-elevated` | A tile raised one more layer | |
| `accent-primary` | Emphasis, the active state | **The brand colour** (none → `#2A78D6` + `(รอยืนยัน)`) |
| `text-primary` | Main text | Contrast ≥ 4.5:1 against the surface it sits on |
| `text-muted` | Secondary text, placeholder | `rgba(...,0.55)` of `text-primary` |
| `state-success` · `state-warning` · `state-danger` | Status | **Does not change with the brand.** Green always means pass and red always means fail |

**One document, one colour set.** 10 figures in one document with mismatched colours are harder to read than plain figures with matching colours.

## Snippets

> The examples below use one dark-mode colour set as a stand-in only.
> **Change the colour values to match the agreed set before use.** The structure is what you copy, not the colour values.

**Window chrome (desktop app mockup):**
```xml
<rect x="20" y="20" width="600" height="360" rx="10" fill="#2a3245"/>
<circle cx="42" cy="42" r="6" fill="#ff5f57"/>
<circle cx="62" cy="42" r="6" fill="#febc2e"/>
<circle cx="82" cy="42" r="6" fill="#28c940"/>
<text x="320" y="46" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Window title</text>
<line x1="20" y1="64" x2="620" y2="64" stroke="rgba(255,255,255,0.08)"/>
```

**Phone frame (mobile mockup):**
```xml
<rect x="100" y="20" width="200" height="400" rx="28" fill="#0a0d14" stroke="#2a3245" stroke-width="2"/>
<rect x="120" y="50" width="160" height="340" rx="6" fill="#1c2230"/>
<rect x="170" y="28" width="60" height="14" rx="7" fill="#0a0d14"/>
```

**Button:**
```xml
<rect x="40" y="100" width="120" height="40" rx="8" fill="#0078d4"/>
<text x="100" y="125" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="14" font-weight="500">Click me</text>
```

**Card with title and body:**
```xml
<rect x="40" y="40" width="240" height="120" rx="12" fill="#2a3245"/>
<text x="60" y="72" fill="#fff" font-family="system-ui" font-size="14" font-weight="600">Card title</text>
<text x="60" y="96" fill="rgba(255,255,255,0.7)" font-family="system-ui" font-size="12">Supporting body text goes here.</text>
<rect x="60" y="116" width="80" height="28" rx="6" fill="#0078d4"/>
<text x="100" y="134" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Action</text>
```

**Status badge (top-right of tile):**
```xml
<circle cx="<tile-right-x>" cy="<tile-top-y>" r="9" fill="#e24b4a"/>
<text x="<tile-right-x>" y="<tile-top-y + 4>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="13" font-weight="500">!</text>
```

**Running dot (indicator below tile):**
```xml
<circle cx="<tile-center-x>" cy="<tile-bottom-y + 12>" r="4" fill="#4cc2ff"/>
```

**Tooltip text (no balloon — plain floating text):**
```xml
<text x="<tile-center-x>" y="<tile-top-y - 12>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12" font-weight="500">Tooltip label</text>
```

## Worked example — UI state mockup

Use this pattern by default for showing UI feature states. On GitHub, save the SVG as a file in `docs/figures/` and reference it (inline `<svg>` is dropped there).
