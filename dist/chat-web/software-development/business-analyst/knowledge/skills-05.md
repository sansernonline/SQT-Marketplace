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


---

# skill: status-report

Use when a task ends, to report status in a table

# รายงานสถานะเมื่อจบงาน

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียว:** จบงานทุกครั้ง ต้องมีตารางสถานะในไฟล์กลางของงาน และตารางเดียวกันในคำตอบ
> งานที่ไม่มีตารางสถานะ ถือว่ายังไม่จบ
> **ยกเว้น** playbook ที่อ่านอย่างเดียว (`research` · `review` · software-development: `investigation`) — ใส่ตารางในคำตอบอย่างเดียว ไม่เขียนไฟล์

---

## 1 · เขียนที่ไหน

| สถานการณ์ | ทำอย่างไร |
|---|---|
| งานทั่วไป (**ค่าตั้งต้น**) | `.claude/superuser/CONTEXT.md` แก้เฉพาะ `## ความคืบหน้า` · หัวข้อ `## รับงานต่อ` เป็นของ `handoff` หัวข้อ 5 เขียนตามกติกาที่นั่น · ไม่แตะหัวข้ออื่น · ยังไม่มีไฟล์ → สร้างจาก [`templates/CONTEXT.md`](../superuser/templates/CONTEXT.md) |
| โปรเจกต์มี `docs/BUILD-PLAN.md` | ใช้แบบในข้อ 3 แทน เขียนที่เดียว ไม่เขียนซ้ำสองที่ |
| มี subagent หลายตัวทำงานพร้อมกัน | subagent **รายงานกลับ** อย่างเดียว ให้หัวหน้าทีมเขียนไฟล์คนเดียว ไม่งั้นไฟล์พัง |

ที่อยู่และกติกาของไฟล์ทั้งหมดอยู่ใน [`team-files`](../superuser/references/team-files.md)

---

## 2 · ตาราง `## ความคืบหน้า`

```markdown
## ความคืบหน้า
| งาน | สถานะ | หลักฐาน | อัปเดต |
|---|---|---|---|
| สรุปยอดขายเดือนนี้ (`docs/sales-oct.xlsx`) | เสร็จ | ยอดรวมตรงใบสั่งซื้อ 212/212 · `reviewer` ตรวจแล้ว | 2026-10-21 14:20 |
| รายงานคู่แข่ง 5 ราย | ทำอยู่ | อ่านแหล่งทางการครบ 3/5 | 2026-10-21 14:20 |
| ใบเสนอราคาลูกค้า A | รออนุมัติ | ร่างพร้อมใน `out/quote-A.pdf` · ส่งแล้วย้อนไม่ได้ | 2026-10-21 14:20 |
| ค่าส่งต่างประเทศ | ค้างอยู่ | รอผู้ใช้ยืนยันเรทของขนส่ง | 2026-10-21 14:20 |
| ค้นหาสินค้า (โค้ด) | เสร็จ | test 48/48 · `reviewer` ตรวจแล้ว | 2026-10-21 14:20 |
```

หัวข้อ `## รับงานต่อ` ที่อยู่ถัดลงไป เขียนตาม `handoff` หัวข้อ 5 (แบบเดียว ใช้ทั้งตอนจบงานและตอนส่งต่อ)

- สถานะใช้ 5 คำเดียวกับ `superuser`: `เสร็จ` · `ทำอยู่` · `ติด` · `รออนุมัติ` · `ค้างอยู่` (ยังไม่เริ่มใช้ `ค้างอยู่`)
- **หลักฐานต้องมีเสมอ** เมื่อเขียนว่า `เสร็จ` — ตัวเลขที่ตรวจจริง · จำนวนข้อที่เทียบ · ชื่อไฟล์ที่เปิดดู · ผลจาก `reviewer` ถ้าไม่ได้ตรวจให้เขียน `ยังไม่ได้ตรวจ` ห้ามเขียนว่าผ่าน
- ผู้ตรวจต้องไม่ใช่ตัวเดียวกับผู้ทำ · มี subagent → ระบุชื่อบทบาทในช่องหลักฐาน
- ตารางมีเฉพาะงานที่ยังเปิด ไม่เกิน 15 แถว · งานที่เสร็จแล้วย้ายเป็น 1 บรรทัดใน `HISTORY.md` · เขียนทับทั้งหัวข้อ ไม่ต่อท้าย
- **ค้างอยู่** คือสิ่งที่ agent ไปต่อเองไม่ได้ ต้องมีคนตอบหรือตัดสิน เขียนเป็นคำถามที่ตอบได้ พร้อมบอกว่าถามใคร ไม่มีให้เขียน `ไม่มี`
- **รออนุมัติ** คืองานที่เตรียมพร้อมแล้วแต่ย้อนไม่ได้ (superuser หัวข้อ 6) บอกคำสั่งหรือไฟล์ที่พร้อมใช้ ไม่มีก็ไม่ต้องใส่
- **ข้อเสนอ** (ในคำตอบ) คือการปรับปรุงนอกขอบเขตไม่เกิน 3 ข้อ บอกว่าได้อะไรและใช้แรงแค่ไหน ไม่มีก็ไม่ต้องใส่

---

## 3 · แบบสำหรับโปรเจกต์ที่มี `docs/BUILD-PLAN.md`

เขียน `## สถานะล่าสุด` (เขียนทับ) และ `## ประวัติสถานะ` (เพิ่มบรรทัดบนสุด) ในไฟล์นั้นแทน `CONTEXT.md` · ลำดับหัวข้อ คอลัมน์ ค่าที่ใช้ได้ และเพดานแถว อยู่ใน [`build-plan-rules`](references/build-plan-rules.md) **เปิดก่อนเขียนทุกครั้ง**

---

## 4 · ในคำตอบ

แสดง "ภาพรวม" (ถ้ามี) + ตารางเฉพาะ **แถวที่เปลี่ยนในรอบนี้** + "ค้างอยู่" + "รออนุมัติ" (ถ้ามี) + "ข้อเสนอ" (ถ้ามี) + "ถัดไป" แล้วบอกว่าตารางเต็มอยู่ที่ไหน (`CONTEXT.md` หรือ `docs/BUILD-PLAN.md`) — ไม่ต้องแปะทั้งไฟล์

---

## 5 · รายการตรวจก่อนบอกว่าจบ

- [ ] อ่านไฟล์กลางจากดิสก์ก่อนแก้ (คนอื่นอาจแก้ไปแล้ว)
- [ ] ตารางความคืบหน้าเขียนทับ ไม่ได้ต่อท้าย และมีวันที่เวลา
- [ ] ทุกแถวที่เขียนว่า `เสร็จ` หรือ `ผ่าน` มีหลักฐาน · ผู้ตรวจไม่ใช่ผู้ทำ
- [ ] ไม่ได้ตั้ง `Approved` เอง
- [ ] `## รับงานต่อ` อัปเดตตาม `handoff` หัวข้อ 5 แล้ว
- [ ] ไม่แตะหัวข้ออื่นในไฟล์
- [ ] แบบ BUILD-PLAN: ตัวเลขใน "ภาพรวม" ตรงตาราง · เพิ่มบรรทัดใน `## ประวัติสถานะ` 1 บรรทัด · "ทีมตอนนี้" ไม่มีแถว `ทำอยู่` ค้างของงานที่จบแล้ว
- [ ] แบบ BUILD-PLAN: รันตัวตรวจจนผ่าน (ตัวตรวจอยู่ใน plugin `superuser`): `python <โฟลเดอร์ superuser>/skills/polished-document-style/scripts/check_outline.py assets/build-plan-status.md <path ของ docs/BUILD-PLAN.md>` — จับหัวข้อหาย หัวข้อสลับ ช่องตัวหนาหาย หัวตารางเปลี่ยน และช่องที่ยังไม่เติม · หัวข้ออื่นในไฟล์ (ตารางงาน `## ตัดสินใจเอง`) ตัวตรวจปล่อยผ่าน
- [ ] คำตอบมีตารางเฉพาะแถวที่เปลี่ยน + ค้าง + รออนุมัติ (ถ้ามี) + ข้อเสนอ (ถ้ามี) + ถัดไป

---

## 6 · สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| เขียนว่า `เสร็จ` หรือ `ผ่าน` โดยไม่ได้ตรวจจริง | ตารางสถานะที่โกหกแย่กว่าไม่มีตาราง |
| ต่อท้ายตารางทุกรอบ | ไฟล์ยาวขึ้นเรื่อย ๆ และไม่รู้ว่าแถวไหนคือปัจจุบัน |
| สร้างไฟล์สถานะใหม่ (`STATUS.md` `progress.md`) | สถานะกระจายหลายที่ ไม่มีใครรู้ว่าดูที่ไหน |
| ซ่อนรายการที่ไม่ผ่านไว้ในร้อยแก้ว | คนอ่านตารางแล้วเข้าใจว่าผ่านหมด |
| ให้ subagent เขียนไฟล์กลางเอง | เขียนชนกันแล้วไฟล์พัง |

---

## แผนโครงการและรายงานประจำสัปดาห์

แม่แบบแผนโครงการ (ผังเวลา · milestone · risk register · Responsible-Accountable-Consulted-Informed (RACI)) และรายงานสถานะประจำสัปดาห์ฉบับส่งผู้เกี่ยวข้อง อยู่ใน [`references/project-plan-and-weekly-status.md`](references/project-plan-and-weekly-status.md)

## เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ตารางงานและวงรอบเขียนโค้ด ในไฟล์เดียวกัน | `spec-to-code-loop` (plugin `software-development`) |
| ชุดเอกสารของโปรเจกต์และสถานะเอกสาร | `project-doc-set` (plugin `software-development`) |
| บันทึกบริบทเพื่อทำต่อในรอบสนทนาหน้า | `handoff` |
| ตารางการตัดสินใจเองในไฟล์เดียวกัน | `decision-log` |
| เลือก playbook และจบงานทุกชนิด | `superuser` |
| รูปแบบตารางและเอกสาร | `polished-document-style` |
| ชื่อและสถานะของไฟล์เอกสาร | `document-naming` |


## reference: build-plan-rules.md

# Format for projects that have docs/BUILD-PLAN.md

Moved from `SKILL.md` item 3 · open it when the project has `docs/BUILD-PLAN.md`

Write these 2 sections in that file instead of `CONTEXT.md` · no file → create a file holding only the project name, then copy from [`assets/build-plan-status.md`](../assets/build-plan-status.md) (never invent the structure) · **never touch the job table or other sections**
Section order: `## สถานะล่าสุด` (latest status) → job table → `## ประวัติสถานะ` (status history) → `## ตัดสินใจเอง` (decisions made on your own, `decision-log`)

- `## สถานะล่าสุด` — **overwrite the whole section** every time, as the single current picture
- `## ประวัติสถานะ` — **add 1 line at the very top** per job, never delete the old ones, in the format `วันที่ เวลา · งาน · สถานะ · ผล · ทำ <agent> · ตรวจ <agent> · ค้างกี่ข้อ` (date time · job · status · result · made by <agent> · checked by <agent> · how many items pending; if you decided anything on your own that round, append `· ตัดสินใจเอง <count>`)

Section `## สถานะล่าสุด` holds: an update line (date and time · latest job) · **ภาพรวม** (overview: done N/total · in progress · blocked · failed check — counted from the table and must match) · a table `| รายการ | ประเภท | สถานะ | ใครทำ | ใครตรวจ | ผลตรวจ | ค้าง / หมายเหตุ |` (item · type · status · made by · checked by · check result · pending / note) · **ทีมตอนนี้** (team now: 1 row per agent used this round · no subagent, leave it out · starting a new round clears the old rows) · ค้างอยู่ (pending) · รออนุมัติ (awaiting approval) · ถัดไป (next, at most 3) · ข้อเสนอ (proposals)

| Column | Allowed values |
|---|---|
| ประเภท (type) | `เอกสาร` (document) · `ตรวจ` (check) · `ส่งมอบ` (delivery) · `โค้ด` (code) · `build` |
| สถานะ (status), documents | `ยังไม่เริ่ม` (not started) · `Draft` · `Review` · `Approved` · `Archived` (the same set as `polished-document-style`) — `Approved` belongs only to someone who can change it, and an agent may set at most `Review` |
| สถานะ (status), others | the 5 words in `SKILL.md` item 2 |
| ผลตรวจ (check result) | `ผ่าน — <evidence>` · `ไม่ผ่าน — <what failed>` · `ยังไม่ได้ตรวจ` · `—` |

The table holds every item of the project, not just this round's work (items not touched copy their old values), at most 25 rows
Code work (a full example table · type `build`/`ส่งมอบ` · mobile app evidence) → the extension in plugin `software-development` → `superuser` → `references/code-extensions.md`


## reference: project-plan-and-weekly-status.md

# Project plan and weekly status — stakeholder templates

แม่แบบของ agent `project-manager` — ย้ายมาจากตัว agent (2026-10-14) · ตารางสถานะท้ายงานแบบสั้นอยู่ใน SKILL.md ของ `status-report` ส่วนไฟล์นี้คือแผนโครงการและรายงานประจำสัปดาห์ฉบับส่งผู้เกี่ยวข้อง

**สารบัญ:**

- [Standard Output: Polished Project Plan](#standard-output-polished-project-plan)
- [Standard Output: Polished Status Report](#standard-output-polished-status-report)

## Standard Output: Polished Project Plan

```markdown
# Project Plan: <Project Name>

| | |
|--|--|
| **Project Lead** | @pm-name |
| **Sponsor** | @sponsor |
| **Status** | ทำอยู่ (วางแผน) |
| **Start Date** | YYYY-MM-DD |
| **Target End** | YYYY-MM-DD |
| **Budget** | ฿XX,XXX |

---

## Objective

> One-sentence goal that fits in a tweet.

## Scope

| In Scope | Out of Scope |
|-------------|-----------------|
| ... | ... |

## Timeline

![ผังเวลาโครงการ: Discovery → Build → Launch](figures/fig-01.png)

**รูปที่ 1 —** ผังเวลาโครงการ วาดด้วย `diagram-figures` (plugin `software-development` · house style) แล้วฝังเป็นไฟล์ภาพ · ไม่ใช้ Mermaid ในแผนที่ส่งผู้เกี่ยวข้อง

## Milestones

| # | Milestone | Target Date | Owner | Status |
|:-:|-----------|:-----------:|:------|:------:|
| 1 | Requirements approved | YYYY-MM-DD | @ba | ค้างอยู่ |
| 2 | Architecture signed off | YYYY-MM-DD | @architect | ค้างอยู่ |
| 3 | Minimum Viable Product (MVP) feature complete | YYYY-MM-DD | @dev-lead | ค้างอยู่ |
| 4 | User Acceptance Testing (UAT) passed | YYYY-MM-DD | @qa | ค้างอยู่ |
| 5 | Production launch | YYYY-MM-DD | @devops | ค้างอยู่ |

## Risk Register

| ID | Risk | Likelihood | Impact | Score | Mitigation | Owner |
|:--:|------|:----------:|:------:|:-----:|------------|:------|
| R-001 | Payment vendor delay | Medium | High | 6 | Plan B vendor | @architect |
| R-002 | Resource availability | Low | Medium | 2 | Cross-training | @pm |

> **Score = Likelihood × Impact** (1-9 scale)

## Dependencies

| Type | Dependency | Owner | Status |
|------|------------|:------|:------:|
| External | Payment gateway (Application Programming Interface, API) | Vendor X | ติด |
| Internal | Design team availability | @design-lead | ทำอยู่ |
| Technical | New cloud account | @devops | ทำอยู่ |

## Responsible-Accountable-Consulted-Informed (RACI) Matrix

| Activity | PM | BA | Arch | Dev | QA | DevOps |
|----------|:--:|:--:|:----:|:---:|:--:|:------:|
| Requirements | A | R | C | I | C | I |
| Architecture | A | C | R | C | I | C |
| Implementation | A | I | C | R | C | C |
| Testing | A | I | I | C | R | I |
| Deployment | A | I | C | C | I | R |
```

## Standard Output: Polished Status Report

```markdown
# Status Report: <Project> — Week of YYYY-MM-DD

| | |
|--|--|
| **Reporting Period** | YYYY-MM-DD to YYYY-MM-DD |
| **Overall Status** | On Track |
| **Health Trend** | Improving / Declining / Stable |

---

## สรุปสั้นสำหรับผู้บริหาร (Too Long; Didn't Read, TL;DR)

> 1-2 sentence summary for executives.

## Status by Track

| Track | Status | Notes |
|-------|:------:|-------|
| Scope | On track | On target |
| Schedule | At risk | 3 days behind, recoverable |
| Budget | On track | 65% spent, on track |
| Quality | On track | 0 critical bugs open |
| Team Morale | On track | High |

> **Note:** On track / At risk / Off track คือระดับสุขภาพของแต่ละด้านสำหรับผู้อ่านต่างประเทศ ไม่ใช่สถานะของงาน · สถานะรายการงานใช้ 5 คำกลาง (เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่)

## Completed This Period

- ...
- ...

## In Progress

| Item | Owner | Due | % Done |
|------|:------|:---:|:------:|
| Feature X | @alice | MM/DD | 75% |
| Feature Y | @bob | MM/DD | 40% |

## Blocked

| Item | Blocker | Owner | Action |
|------|---------|:------|--------|
| ... | Waiting on legal review | @legal | Escalate to Chief Technology Officer (CTO) |

## Upcoming (Next Period)

- ...

## New Risks / Issues

| Severity | Item | Owner |
|:--------:|------|:------|
| High | ... | ... |

## Asks for Stakeholders

- Decision needed on X by MM/DD
- Need 1 more QA resource starting next sprint
```
