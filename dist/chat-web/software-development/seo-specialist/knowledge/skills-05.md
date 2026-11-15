# skill: answer-shape

Use when an answer needs prose, a table or a diagram

# The shape of an answer

This skill gives the shape and structure; every line of wording follows `human-writing` · lives only in plugin `superuser`; other plugins share it through `dependencies`

> **One rule:** whatever structure the content has, the answer uses that shape.
> Comparison → table · connections → figure · one thing → sentences

---

## Pick the shape from signals in the question

The quoted signals are Thai user phrasings; English meanings are in brackets.

| Signal | Shape |
|---|---|
| "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" ("which is better" · "how do they differ" · "what options are there") | **Comparison table** |
| "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" ("what connects to what" · "how does data flow" · "what is the sequence") | **Figure** |
| "มีอะไรบ้าง" ("what are there") when the items are not compared | **Bullet list** |
| "ทำไม" · "แปลว่าอะไร" ("why" · "what does it mean") · one thing with no branches | **Plain sentences** |
| Several numbers that must be seen together | **Table** |
| Steps that must be done in order | **Numbered list** |
| Cannot continue · must wait for something from the user | **Short list: what is blocking → what is needed** |

**The most important signal is having 2 or more "things being compared"**; use a table then,
because in a paragraph the reader must hold the first one in their head while reading the second.

---

## A table that reads easily

- **The first column is the thing being compared**, and the next columns are the aspects compared
- **3–5 columns**; more than that cannot be read in time, and at most 8 rows in a chat answer
- **Every cell must have content** — an empty cell means that column should not exist, or the data is incomplete; if there is no data, write "ไม่มี" (none) plainly · a table where every cell says "it depends" also has no content
- **At most 1 line per cell**; if longer, move it below the table
- **Order rows by weight**: the recommended one or the most used one on top, not alphabetical
- **Column headings are the questions in the reader's head**, not names of academic fields

```
ผิด: | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
ถูก: | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

(Gloss: wrong = "Option | Performance | Complexity" · right = "Option | How fast | Does it need much upkeep".)

**Always close a table with a 1-line conclusion** — a table gives data; it does not say what to choose

---

## When a figure beats a table

Use a figure when **the relationship is the answer** — a table can give properties, but cannot say what connects to what.

| Use a figure | Use a table |
|---|---|
| What connects to what · what sits inside what | Which is better than which, and in what respect |
| A sequence with forks or loops back | A straight sequence of steps with no branches (a numbered list is enough) |
| The same thing in several states | Different things on the same aspects |

In chat, **a small ASCII figure or a short Mermaid is enough** — no need to open a drawing tool

```
กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน
                    │
                    └──▶ ที่เก็บถาวร
```

(Gloss: กล้อง = camera/scanner · รายงาน = report · ที่เก็บถาวร = permanent storage.)

A figure that must be a real file to go into a document or slides uses the figure-drawing skill of that plugin (if there is one)

---

## When sentences beat both

- The answer is shorter than 3 lines — a 2-row table is only decoration and explains nothing
- A question answered "yes" or "no" followed by 1 sentence of reason
- A matter where **the reason matters more than the options** — a table cuts the reason to fit the cell

> A table with one row or 2 short rows means the wrong shape was used · a figure that draws what one sentence can say is the same

---

## When you cannot continue

Whenever you are blocked → list only 2 things: **what is blocking** and **what you need from the user**

- 1 line per item · at most 4 items
- Do not tell the cause at length, do not answer side topics, do not plan the work ahead — wait until you have the thing, then do it
- If there are several paths for the user to choose → each path is 1 item, the easiest on top

```
ผิด: ย่อหน้ายาวเล่าว่า container ใหม่ · โฟลเดอร์ว่าง · OneDrive หาย · แล้ววางแผนแก้ 3 ข้อรอไว้
ถูก: ติดอยู่ 1 เรื่อง:
   - มองไม่เห็นไฟล์ — โฟลเดอร์ที่เชื่อมไว้ว่าง
   ต้องการ 1 อย่าง:
   - แนบ Mockup.html มา หรือบอก path ใหม่
```

(Gloss: wrong = a long paragraph telling that the container is new · the folder is empty · OneDrive is gone · and then planning 3 fixes while waiting · right = "Blocked on 1 thing: cannot see the file — the linked folder is empty. Need 1 thing: attach Mockup.html or give the new path.")

---

## Abbreviations

Abbreviations used in this file · rules for writing abbreviations → `spell-out-abbreviations`

- **ASCII** — American Standard Code for Information Interchange (drawing figures with plain characters)
- **Mermaid** — a language that writes diagrams as text and lets a program draw them
- **DICOM** — Digital Imaging and Communications in Medicine (a standard for medical image files and transfer)
- **API** — Application Programming Interface (the channel through which one program calls another)


---

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
