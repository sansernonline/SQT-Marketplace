# skill: spell-out-abbreviations

Use when text is heavy with abbreviations or jargon

# Spell Out Abbreviations

> **Language:** follow `human-writing` for the wording of every line. This skill gives the format and structure. `human-writing` says how to write so readers understand.

> **Rule 1:** write every abbreviation in full the first time, with the abbreviation in brackets. After that you may use the abbreviation.
> **Rule 2:** put a short explanation in brackets the first time you use any technical term, so readers from outside the field do not have to guess.

## Format

```
ถูก: Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
ผิด: MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **The first time in each document**, write it in full with the abbreviation in brackets. After that, use the bare abbreviation.
- In a long document split into chapters, write it in full again **the first time in each chapter**, because people often read one chapter at a time.
- If a table or heading has no room, write it in full on the first line of that section instead.
- A document with 5 or more abbreviations must have a **glossary** at the end.

### Thai documents

The first time, write **Thai (English full name: abbreviation)**, for example ปัญญาประดิษฐ์ (Artificial Intelligence: AI). After that, use either the Thai word or the abbreviation, but pick one style for the whole document. This rule is the only place that sets the format. `human-writing` `references/thai-grammar.md` section 5 row 4 follows it.

## Exceptions — no need to expand

Terms the public knows better than the full name: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
and file extensions (`.docx`, `.pptx`). If you are not sure, **expand it**, because expanding too much does no harm, but a reader who does not understand does.

## Technical terms — explain in brackets, not just the abbreviation

Expanding the abbreviation may not be enough if the full name still says nothing. **A term that an outside reader does not know
needs a short explanation in brackets the first time.**

```
ผิด: ใช้ idempotency key กันงานซ้ำ
ถูก: ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

ผิด: ต้องดู cash flow ก่อนกู้
ถูก: ต้องดู cash flow (เงินเข้า-ออกจริงแต่ละเดือน) ก่อนกู้
```

**The explanation must be shorter than 1 line.** If it is longer, make it a sentence of its own.

**Decide which terms need explaining** with one question: could a person who works in a different field from this topic
read it and guess the meaning? If they cannot guess, explain it.

| Reader level | How much to explain |
|---|---|
| Customers, executives, people outside the field | Every technical term, even words engineers use every day |
| The same team but a different area of work | Only the terms specific to that area, such as names of formats and processes |
| People already working on this | Only terms newly coined in this project |

---

## What it applies to

Every kind of document · slides · labels and on-screen text · sales copy · diagram descriptions · code comments ·
chat answers — **anything a person reads**

## Common examples

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Key Performance Indicator (KPI) · Service Level Agreement (SLA) ·
Return on Investment (ROI) · Stock Keeping Unit (SKU) · Value Added Tax (VAT) ·
Cash on Delivery (COD) · Objectives and Key Results (OKR) ·
Personally Identifiable Information (PII) · Proof of Concept (POC)

Code-side abbreviations (RBAC · SSO · CI/CD · SRS · ADR and so on) → the extension in plugin `software-development` → `superuser` → `references/code-extensions.md`

## Anti-patterns

- Expanding the abbreviation every time it appears — cluttered and distracting. The first time is enough.
- Reversed brackets — `MCP (Model Context Protocol)` reads less smoothly than writing the full name first.
- Expanding wrongly — if you do not know what it stands for, look it up first. Do not guess.
- Expanding every abbreviation but leaving technical terms unexplained — `Quadratic Weighted Kappa (QWK)` still helps no one unless you say what the value measures.
- A paragraph-long explanation in brackets — brackets are for short words. If it is long, split it into sentences.


---

# skill: context-budget

Use when a task reads large material or writes long output

# Context budget

> **One rule:** decide **before** you read, not regret it after.
> Tokens that enter context cannot be removed, except by `/clear` (drops everything) · `/compact` (shrinks to a summary) · `/rewind` (cuts back to an earlier point).

## When to use this skill

- About to read something big: a folder of documents · a long PDF · several web pages · search results · a whole code project · output of a command that may be long
- Starting work on a folder or project whose structure you do not know yet
- Context fills unusually fast, or `/compact` triggers often
- Setting rules for the whole team or every project

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Make the **answer** shorter | `answer-shape` | instead |
| Keep a work summary across sessions | `handoff` | instead |
| Where to put temporary files | `temp-file-discipline` | instead |
| A coding loop that must survive loss of context | `spec-to-code-loop` (plugin `software-development`) | instead |
| Project map and folder layout | `project-bootstrap` (plugin `software-development`) | together |
| Fix a bug at one spot without reading the whole project | `targeted-fix` | together |
| Abbreviations in work people read | `spell-out-abbreviations` | together |

---

## 1 · What really eats context

| Source | Rough size | Can you control it? |
|---|---|---|
| **Things you read in** (files · PDFs · web pages · search results · command output) | Biggest; one item can be tens of thousands of tokens | Fully. This whole page is about it |
| Tools from a Model Context Protocol (MCP) server | Only tool names and the server's instructions load · the full schema loads when used | If a Command-Line Interface (CLI) can do it, use the CLI (no tool list at all) · turn off servers you do not use |
| `CLAUDE.md` | As long as written | Write it short |
| Skill descriptions | ~100 tokens per skill | Trim them |
| Conversation history | Keeps growing | Careful: `/clear` when the topic changes |

> **What to control first is clear**: trimming the descriptions of the whole skill set saves only a few thousand tokens,
> but opening a 200-page PDF or running `cat` on a 3,000-line file once costs more than that.
> **Be most disciplined about the top row of the table.**

---

## 2 · Decision tree before reading

```
ต้องรู้อะไรจากของก้อนนี้
├─ รู้แล้วว่าอยู่ไฟล์ไหน หน้าไหน บรรทัดไหน → อ่านเฉพาะช่วง (ข้อ 3) · หลายชิ้น → อ่านพร้อมกันในข้อความเดียว
├─ ต้องหาว่าอยู่ตรงไหน                   → ค้นแบบมีขอบเขต (ข้อ 3)
├─ ต้องค้นข้ามหลายชิ้นที่ยังไม่รู้ตำแหน่ง   → ส่ง subagent (ข้อ 4)
└─ ต้องแปลง/รวม/นับข้อมูลจำนวนมาก        → เขียนลงไฟล์แล้วอ่านเฉพาะสรุป (ข้อ 5)
```

Tree, in English: what do you need from this item?
- You know the file, page and line → read only that range (item 3) · several items → read them together in one message
- You need to find where it is → bounded search (item 3)
- You must search across many items whose location you do not know → send a subagent (item 4)
- You must convert, merge or count a lot of data → write to a file and read only the summary (item 5)

If you do not know how big the thing is, **always check the size first**: number of PDF pages · number and size of files in a folder (`ls -l`, `du -h`) · number of lines (`wc -l`).

---

## 3 · Read only a range, and search with a boundary

3 numeric rules: **read only a range of any file over 300 lines** · **add `--glob` to `grep`/`rg`** · **end with `| head -50`** (if the user's `CLAUDE.md` has no "งบ context" (context budget) section, use these 3 rules as they are). What goes beyond that:

| Thing | How to read it |
|---|---|
| Folder of documents | Look at names and sizes first, then open only files whose names match the question |
| PDF · long report | Read the table of contents first, then name the pages or chapters you need |
| Web page | Ask for only the part you need (a number, a date, one heading), do not pull the whole page |
| Code | `rg -l` first to learn which file, then drill in · `-C2` of context is enough |
| Session files · `.jsonl` logs | One line can be megabytes, so never `cat` · `wc -l -c <file>` first · find long lines with `awk 'length>100000{print NR": "length}' <file> \| head -20` · read one field at a time with `cut -c1-2000` or `jq` selecting a field |

Read the whole file when: you are about to overwrite the whole file · the file is short · you must understand the whole file to edit it correctly, and it is under ~300 lines.

---

## 4 · Send a subagent instead

**This is the biggest saving on this page.**

A subagent has its own context, so it can read 20 items
and send back only one paragraph to the main conversation, without the content it read coming along.

| Use a subagent when | Do it yourself when |
|---|---|
| You expect to read over 20k tokens or over 5 files whose location you do not know (default, not measured · estimate the size from the step's PERT in `model-scorecard` if present) · you must search across many items to answer one question | You already know the files and locations, even 4–6 of them → read them together in one message, faster than starting a new subagent |
| Exploring a folder or project you do not know | Editing the file that is already open |
| Checking/reviewing across many files | Work that needs the full detail to continue |

**To brief it well, say what you want back:**

```
ผิด: "ดูสัญญา 12 ฉบับนี้ให้หน่อย"
   → มันอาจคืนมาทั้งเนื้อหา

ถูก: "หาวันหมดอายุ ค่าปรับ และเงื่อนไขต่ออายุของสัญญาแต่ละฉบับ
    คืนกลับมาเป็นตาราง 1 บรรทัดต่อฉบับ ระบุชื่อไฟล์:หน้า
    ไม่ต้องแปะข้อความสัญญา ไม่เกิน 15 บรรทัด"
```

(The example above, in English: wrong = "Take a look at these 12 contracts" → it may return the whole content. Right = "Find the expiry date, penalty and renewal terms of each contract. Return a table, 1 line per contract, with file:page. Do not paste contract text. At most 15 lines.")

(Code work is the same: "Return a list of file:line in call order, do not paste code")

> 🚨 **Always set the format and length of the result.** If you do not say what you want,
> the subagent sends back a long report, and you save nothing.

---

## 5 · Write to a file instead of holding it in the conversation

```bash
# ผิด: output ทั้งหมดเข้า context
<คำสั่งที่ output ยาว>

# ถูก: เข้า context แค่บรรทัดสรุป
<คำสั่งที่ output ยาว> > <โฟลเดอร์ชั่วคราว>/out.log 2>&1; tail -20 <โฟลเดอร์ชั่วคราว>/out.log
```

(Comments above: wrong = the whole output enters context · right = only the summary line enters context. `<คำสั่งที่ output ยาว>` = a command with long output · `<โฟลเดอร์ชั่วคราว>` = temp folder.)

**Use it for**: text pulled from the web or PDFs · big data tables (filter or count with a script, do not read every row) · test run results · logs · results of file conversions
Where to put these files → `temp-file-discipline` · note what you find into a file from the first pass, so you do not read it again

**Repeats on every task → let a hook filter instead of relying on discipline** — a hook can trim long output before it enters context (a log of tens of thousands of tokens becomes a few hundred) · coding example → the addition in plugin `software-development` → `superuser` → `references/code-extensions.md`

---

## 6 · So the next session does not explore again

Work you return to often needs a short "map" that **loads automatically**: where things are · what must not be read · commands used often
- General work: the section "ของอยู่ที่ไหน" (where things are) in `.claude/superuser/CONTEXT.md` (`superuser` reads it before every start), at most 40 lines
- Files with other names (`notes.md`) do not load themselves and must be told to be read every time, so they are wasted
- An outdated map is worse than no map, because it confidently leads you to the wrong place. Do not put a full file list or change history in it

Code work (project and folder `CLAUDE.md`, example maps) → the addition in plugin `software-development` → `superuser` → `references/code-extensions.md`

---

## 7 · Other settings that help

Turn off MCP servers and plugins you do not use · pick the model and effort at the start · `/clear` when the topic changes · project `CLAUDE.md` at most 40 lines — the full table with reasons is in [`settings`](references/settings.md) · working on Windows (Git Bash · PowerShell) → traps that really happened are in [`windows-shell`](references/windows-shell.md)

**Compact yourself at about 70%, do not wait for the system** — when about 70% of context is used and a step has just finished (tests pass · file saved · check passed) → first update "รับงานต่อ" (resume work) in `CONTEXT.md` (`handoff` item 5), then `/compact` and say what to keep (files edited · decisions · next step) · when the system compacts by itself, it often hits mid-step, when nothing has been written down yet (idea from strategic-compact in everything-claude-code · MIT · 70% is a default, not measured)

---

## 7.1 · Seams between phases — continue · clear · handoff · subagent · compact

When a phase ends and the next begins, ask in order from item 1. **The first question answered yes is the route you pick**, then stop asking:

| # | Ask | If yes |
|---|---|---|
| 1 | Does the next phase need what is in this context as its source, and is there room left (roughly over 150k tokens · default, not measured)? | **Continue** in the same session |
| 2 | Will the next phase move to another vendor's tool, another model, or another repo? | **handoff** — update "รับงานต่อ" (resume work) and start in the new place (`handoff` item 5) |
| 3 | Can the next phase be split off without talking to us (no wait for a user answer, no need to know this context beyond what a brief can say)? | **subagent** — send the 5-part brief |
| 4 | Can this whole context be dropped (everything needed is already in files) and the new topic is unrelated to the old? | **clear** — cannot be undone; check that `notes/` and "รับงานต่อ" (resume work) are complete first |
| 5 | None of the above | **compact** and say what to keep (item 7 above) |

Item 4 is the only one that cannot be undone, so answer yes only when there is evidence everything is in files · if unsure → go to item 5 · source: mattpocock-skills (MIT) · PHASE-BOUNDARIES · seen 2026-11-10

---

## 8 · Anti-patterns

- **Opening the whole big thing to "see what is in it first"** when the table of contents, the first page, or `head -40` answers the same question at 1% of the cost
- **Searching without a boundary** (`rg` without `--glob` brings back unrelated folders in bulk · searching the web and opening every link)
- **Searching across 10 items yourself to answer one question** when you should send a subagent
- **Sending a subagent to read something whose location you already know** when reading in parallel yourself or a direct search is faster
- **Briefing a subagent without saying what you want back**, which brings back a long report and saves nothing
- **Letting long output (tests · logs · pulled text) into context in one lump**
- **Reading the same thing again because you forgot you read it** — note what you find into a file from the first pass
- **A map file that does not load automatically** · **a `CLAUDE.md` 300 lines long** that everyone on the team pays tokens for every session
- **Keeping every MCP server on all the time**


## reference: settings.md

# Settings that save context

Moved from `SKILL.md` item 7. Open it when you are about to advise the user on settings.

| Action | Effect |
|---|---|
| **Turn off MCP servers the task does not use**. If a CLI can do the job, use the CLI | Tool names and instructions of every server still load in every session |
| Pick the model and effort at the start of the session | Switching model mid-session loses the cache, so the whole conversation is read again (changing effort on Opus · Sonnet · Haiku 5.5 and Fable 5.1 through an Application Programming Interface (API) key or a subscription keeps the cache · through Bedrock · Agent Platform · a gateway or special setups, see the conditions at the link) · ([Claude Code: prompt caching](https://code.claude.com/docs/en/prompt-caching) · checked 21 Oct 2569 BE) |
| Fast mode — the user turns it on with `/fast` at the start of the session · the agent never turns it on | Opus only · up to 2.5 times faster text generation, but the first token is not faster · 2 times the price, and subscription users pay from usage credits, not the quota · worth it for a step that writes a long piece, not for short steps that wait on tools · turning it on mid-session pays the fast price once for the whole uncached conversation · ([Claude Code: fast mode](https://code.claude.com/docs/en/fast-mode) · [API: fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) · checked 21 Oct 2569 BE) |
| Turn off plugins unrelated to the task | The description of every skill is always in context |
| `permissions.deny` in `.claude/settings.json` for folders that should not be read | The system guards it, so you do not depend on discipline |
| `/clear` when the topic changes (costs nothing) · `/compact <what to keep>` at a rest point in the work, not when nearly full · on the wrong path → `/rewind` to an earlier point | Frees space · `/compact` while the cache is warm is cheap, but after a long pause the whole conversation is read again · `/rewind` cuts back to a point where the cache already exists |
| Project `CLAUDE.md` at most 40 lines · `~/.claude/CLAUDE.md` (used by every project) at most 60 lines — this set's own cap, stricter than the official docs, which suggest at most 200 · the one shipped in `scripts/install/CLAUDE.global.md` is 84 lines (over the cap, waiting to be cut) | Every line costs tokens in every session |


## reference: windows-shell.md

# Shell traps on Windows

Open it when working on a Windows machine through Git Bash or PowerShell · every item happened in the SQT-Marketplace repo between 2026-10-23 and 25 · kept as a reference file first; if it happens again, promote it to a skill.

| Symptom | Cause | Do this instead |
|---|---|---|
| Deleted every folder the user told you to keep (2026-10-25) | `ls` on the machine is aliased to `ls -F`, so folder names end with `/`. The keep list written as a regex matched no name, and then `rm -rf` deleted all of them · `rm` in Git Bash does not use the recycle bin | Build the list with `find <dir> -mindepth 1 -maxdepth 1 -printf '%f\n'` or `\ls -1A` · print the delete list and the keep list and compare them before running `rm` · move to `_to_delete/` instead of deleting |
| A pattern in JSON or a regex is wrong: `\b` became `\b` (2026-10-23) | Python code was sent through a heredoc in the Bash tool, and the escapes were interpreted twice | Edit the file with the Edit tool · or write the script to a file first and then run it · check the result by reading the actual value · a `\r` that became a real CR character in a .md is now caught by the SQT-Marketplace checker (2026-10-25), but a lost `\b` is still not caught |
| The validator fails with "documents do not match the real ones" though the content matches · the zip in `dist/` changes though nothing was edited (2026-10-25) | A new worktree with `core.autocrlf=true` checks files out as CRLF, but the scripts build text with LF | Scripts that compare or build files must convert CRLF to LF first (`sync-docs` · `writeZip` already do) · files that must be CRLF are declared in `.gitattributes` · check whether they really differ with `git diff --ignore-cr-at-eol --stat` |
| A plugin hook does nothing, with no error (2026-10-25) | It checks it is the main file with `fileURLToPath(import.meta.url) === process.argv[1]`, which does not match on Windows when called through `${CLAUDE_PLUGIN_ROOT}/…` | Compare with `process.argv[1].replace(/\/g, "/").endsWith("<file name>")` as in `superuser-hook.mjs` · test the hook by calling it through the real path Claude Code uses |

## Small things worth knowing

- `perl -i` or `sed -i` on a CRLF file: a regex anchored to the line end with `$` must allow for `\r` (`(\r?)$`), or the edit silently does not apply
- `cd` in Bash does not carry across commands · use a full quoted path, because folder names often contain spaces and `&`
- A `.cmd` script that ends with `pause` waits for a key · when running it from an agent, pass empty stdin (`< /dev/null`), save the output to a file, and read the end of the file


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
