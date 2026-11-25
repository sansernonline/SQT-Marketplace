# skill: context-budget

Use when a task reads large material or writes long output

# context-budget — decide before you read what enters context

> **One rule:** decide **before** you read, not regret it after. Tokens that enter context cannot be removed, except by `/clear` (drops everything) · `/compact` (shrinks to a summary) · `/rewind` (cuts back to an earlier point). Things you read in (files · PDFs · web pages · search results · command output) are the biggest source, so be most disciplined about them. If a Command-Line Interface (CLI) can do what a Model Context Protocol (MCP) tool does, use the CLI.

## Use when
- About to read something big: a folder of documents · a long PDF · several web pages · search results · a whole code project · command output that may be long.
- Starting work on a folder or project whose structure you do not know.
- Context fills unusually fast, or `/compact` triggers often.
- Setting context rules for the whole team or every project.

Not for: shorter **answers** → `answer-shape` · work summary across sessions → `handoff` · where temp files go → `temp-file-discipline` · a coding loop that must survive context loss → `spec-to-code-loop` (plugin `software-development`).

## Steps

### 2 · Before reading, choose the route
- Know the file, page and line → read only that range (item 3); several items → read them together in one message.
- Need to find where it is → bounded search (item 3).
- Must search across many items whose location you do not know → send a subagent (item 4).
- Must convert, merge or count a lot of data → write to a file and read only the summary (item 5).

If you do not know how big the thing is, check the size first: PDF pages · file count and size in a folder (`ls -l`, `du -h`) · lines (`wc -l`).

### 3 · Read only a range, and search with a boundary
3 numeric rules (use them as they are if the user's `CLAUDE.md` has no "งบ context" section): **read only a range of any file over 300 lines** · **add `--glob` to `grep`/`rg`** · **end with `| head -50`**.

| Thing | How to read it |
|---|---|
| Folder of documents | Names and sizes first, then open only files whose names match the question |
| PDF · long report | Table of contents first, then name the pages or chapters |
| Web page | Ask for only the part you need (a number, a date, one heading) |
| Code | `rg -l` to learn which file, then drill in · `-C2` context is enough |
| Session files · `.jsonl` logs | One line can be megabytes: never `cat` · `wc -l -c <file>` first · find long lines with `awk 'length>100000{print NR": "length}' <file> \| head -20` · read one field at a time with `cut -c1-2000` or `jq` |

Read the whole file when you are about to overwrite it, or it is short, or you must understand all of it to edit correctly and it is under ~300 lines.

### 4 · Send a subagent instead (the biggest saving)
A subagent has its own context: it can read 20 items and send back one paragraph.

| Use a subagent when | Do it yourself when |
|---|---|
| You expect to read over 20k tokens or over 5 files whose location you do not know (default, not measured; estimate from the step's PERT in `model-scorecard` if present), or must search across many items to answer one question | You know the files and locations, even 4–6 of them: read them together in one message, faster than a new subagent |
| Exploring an unknown folder or project · checking across many files | Editing the file already open · work that needs full detail to continue |

**Always set the format and length of the result**, or the subagent returns a long report and you save nothing. Wrong: "Take a look at these 12 contracts". Right: "Find the expiry date, penalty and renewal terms of each contract. Return a table, 1 line per contract, with file:page. Do not paste contract text. At most 15 lines." Code work: "Return a list of file:line in call order, do not paste code".

### 5 · Write to a file instead of holding it in the conversation
```bash
<command with long output> > <temp folder>/out.log 2>&1; tail -20 <temp folder>/out.log
```
Use it for text pulled from the web or PDFs · big data tables (filter or count with a script, do not read every row) · test results · logs · file conversions. Where to put these files → `temp-file-discipline`. Note what you find into a file on the first pass so you do not read it again.

If it repeats on every task, let a hook filter long output before it enters context: coding example in `superuser` → `references/code-extensions.md` (the addition in plugin `software-development`).

### 6 · So the next session does not explore again
Work you return to often needs a short map that **loads automatically**: where things are · what must not be read · commands used often. General work: the section "ของอยู่ที่ไหน" in `.claude/superuser/CONTEXT.md`, at most 40 lines. Files with other names (`notes.md`) do not load themselves, so they are wasted. An outdated map is worse than none: no full file list or change history in it. Code work (project and folder `CLAUDE.md`, example maps) → `superuser` → `references/code-extensions.md`.

### 7 · Other settings that help
Turn off MCP servers and plugins you do not use · pick model and effort at the start · `/clear` when the topic changes · project `CLAUDE.md` at most 40 lines (table with reasons: [`references/settings.md`](references/settings.md)) · on Windows (Git Bash · PowerShell) see [`references/windows-shell.md`](references/windows-shell.md).

**Compact yourself at about 70%, do not wait for the system** (70% is a default, not measured). When about 70% of context is used and a step has just finished (tests pass · file saved · check passed): first update "รับงานต่อ" in `CONTEXT.md` (`handoff` item 5), then `/compact` and say what to keep (files edited · decisions · next step). The system's own compaction often hits mid-step, before anything is written down.

### 7.1 · Seams between phases
Ask in order; **the first yes is the route**, then stop:

| # | Ask | If yes |
|---|---|---|
| 1 | Does the next phase need this context as its source, and is there room left (roughly over 150k tokens · default, not measured)? | **Continue** in the same session |
| 2 | Will the next phase move to another vendor's tool, model, or repo? | **handoff**: update "รับงานต่อ" and start in the new place (`handoff` item 5) |
| 3 | Can the next phase be split off without talking to us (no user answer to wait for, no context beyond what a brief can say)? | **subagent**: send the 5-part brief |
| 4 | Can this whole context be dropped (everything needed is in files) and the new topic is unrelated? | **clear**: cannot be undone; check `notes/` and "รับงานต่อ" are complete first |
| 5 | None of the above | **compact** and say what to keep (item 7) |

Item 4 is the only one that cannot be undone: answer yes only with evidence everything is in files; if unsure, go to 5.

## Project map
- Workers read `docs/FILE-MAP.md` instead of exploring the repo.
- Generate it: `node scripts/map-folder.mjs [dir=.] [--out docs/FILE-MAP.md] [--max 400] [--stdout]`.
- It lists each file with a role line and its relative imports, then a Mermaid folder graph.
- Over `--max` files it lists folders with file counts only.
- It never copies file contents beyond the role line. Regenerate after big changes.

## Check before done
- Big things were read by range, bounded search, subagent or file, not opened whole.
- Every subagent brief said the result format and length.
- Long output went to a file with only a tail or summary read back.

## Anti-patterns
Opening the whole thing to "see what is in it" when the table of contents or `head -40` answers it · searching without a boundary (`rg` without `--glob`; opening every search link) · searching across 10 items yourself instead of a subagent · sending a subagent to read something whose location you know · letting long output in one lump · reading the same thing again because you forgot (note findings to a file) · a map file that does not load automatically · a 300-line `CLAUDE.md` · all MCP servers always on.

## References
- [`references/settings.md`](references/settings.md) — open when setting rules for a team or project
- [`references/windows-shell.md`](references/windows-shell.md) — open when working in Git Bash or PowerShell on Windows
- [`references/sources.md`](references/sources.md) — sources and licences

## Squeeze logs
- Run long test or build logs through `node scripts/squeeze-log.mjs [file] [--max 100] [--context 3]` (stdin if no file) before reading them or handing them to another agent.
- It keeps the first 10 and last 20 lines, every error/fail/warn line with context, and collapses repeated lines as `(×N)`.
- The first output line says `squeeze-log: <in> → <out> lines · errors <k>`.


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


## reference: sources.md

# Sources · context-budget

- Compact yourself at about 70% (section 7): idea from strategic-compact in everything-claude-code (MIT). 70% is a default, not measured.
- Seams between phases (section 7.1): mattpocock-skills (MIT) · PHASE-BOUNDARIES · seen 2026-11-10. The 150k token line is a default, not measured.


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


---

# skill: principle-proceed-on-reversible-work

Use before asking to continue on undoable work

# principle · proceed on reversible work: if it can be undone, do it

> Every question that stops and waits for an answer is time when both the person and the agent are not working.
> If the work is reversible, doing it and letting them look is faster than asking and waiting.

## Tell them apart

| Reversible: do it now | Irreversible: prepare it in "รออนุมัติ" (awaiting approval) and carry on with the rest |
|---|---|
| Edit a file that has a copy or history (document file · sheet · git) | Edit or delete real data (database · master sheet · the user's files) |
| Draft a document · draft an email or customer reply (not yet sent) · draft a mockup | Send an email, message or post to outsiders |
| Run tests · calculate · try in a copy | Release to the real system (deploy · announce a price · publish) |
| Choose between 2 paths that can be changed later | Pay money · book · accept terms · enter a real secret |
| Move a temporary file to `_to_delete/` | Delete permanently |
| Code: commit on the work branch, when the user allows it | Code: merge into the main branch · force-push |

## Before you ask, pass these three gates

1. **Can an experiment show it?** If the answer is behaviour, speed, looks or output, try a draft (code work: playbook `prototype` in plugin `software-development`) instead of asking.
2. **Is it reversible?** If so, pick the path with the least impact, do it, and note it in [`decision-log`](../decision-log/SKILL.md).
3. **Is it a fact or the user's taste?** Numbers, names, dates and budgets must never be guessed: put `(รอยืนยัน)` (awaiting confirmation) and carry on with the rest. If the brand colour is missing, use that skill's default with `(รอยืนยัน)` and collect the question into "ค้างอยู่" (pending) once.

If you pass all 3 gates and still must ask, do not stop and wait. Collect every question into "ค้างอยู่" once, with your recommended path, and carry on with the rest. For irreversible work, prepare the command, the diff or the draft message in "รออนุมัติ" and do not do it yourself.

**The one exception where you may ask first:** at the start of the job, if the brief can be read in so many ways that the whole output would differ, ask once, putting every question of that round together as multiple choice, with evidence for every option (skill `superuser` section 6 → `autonomy`). After you start, do not ask again. For a fork that is irreversible, costly or reaches outsiders, use [`flag-and-propose`](../flag-and-propose/SKILL.md).

## What not to do

- Ask "ให้ทำต่อไหม" (shall I continue?) after each step of a job that was already ordered
- Offer a plan and wait for approval when the work is clear and reversible
- Use this principle as an excuse to do things the user did not ask for, because "continue" means finishing the ordered work, not widening the scope yourself


---

# skill: status-report

Use when a task ends, to report status in a table

# Report status when a task ends

> **The one rule:** every time a task ends, there must be a status table in the task's central file, and the same table in the reply.
> A task with no status table is not finished.
> **Exception:** read-only playbooks (`research` · `review` · software-development: `investigation`) put the table in the reply only and write no file.

---

## 1 · Where to write

| Situation | What to do |
|---|---|
| General work (**default**) | `.claude/superuser/CONTEXT.md`. Edit only `## ความคืบหน้า` (progress). The heading `## รับงานต่อ` (take over) belongs to `handoff` section 5, so write it by the rules there. Touch no other heading. If the file does not exist yet, create it from [`templates/CONTEXT.md`](../superuser/templates/CONTEXT.md). |
| The project has `docs/BUILD-PLAN.md` | Use the form in section 3 instead. Write in one place, never duplicate in two. |
| Several subagents work at the same time | Subagents only **report back**. Let the team lead write the file alone, or the file breaks. |

The location and rules of every file are in [`team-files`](../superuser/references/team-files.md).

---

## 2 · The `## ความคืบหน้า` table

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

The `## รับงานต่อ` heading that sits below it is written by `handoff` section 5 (one format, used both at the end of a task and at hand-over).

- Status uses the same 5 words as `superuser`: `เสร็จ` (done) · `ทำอยู่` (in progress) · `ติด` (blocked) · `รออนุมัติ` (awaiting approval) · `ค้างอยู่` (pending; not started yet also uses `ค้างอยู่`).
- **Evidence is always required** when you write `เสร็จ`: a number that was really checked · how many items were compared · the file name that was opened · the result from `reviewer`. If it was not checked, write `ยังไม่ได้ตรวจ` (not yet checked). Never write that it passed.
- The checker must not be the same one that did the work. If there is a subagent, name its role in the evidence column.
- The table holds only open tasks, at most 15 rows. A finished task moves to 1 line in `HISTORY.md`. Overwrite the whole heading, never append.
- **ค้างอยู่** (pending) is what the agent cannot continue by itself, because a person must answer or decide. Write it as a question that can be answered, and say whom to ask. If there is none, write `ไม่มี` (none).
- **รออนุมัติ** (awaiting approval) is work that is prepared but irreversible (superuser section 6). Give the command or file that is ready to use. If there is none, leave it out.
- **ข้อเสนอ** (proposals, in the reply) are improvements outside the scope, at most 3. Say what is gained and how much effort it takes. If there are none, leave it out.

---

## 3 · The form for a project that has `docs/BUILD-PLAN.md`

Write `## สถานะล่าสุด` (latest status; overwrite) and `## ประวัติสถานะ` (status history; add a line at the top) in that file instead of `CONTEXT.md`. The heading order, columns, allowed values and row ceiling are in [`build-plan-rules`](references/build-plan-rules.md). **Open it before every write.**

---

## 4 · In the reply

Show "ภาพรวม" (overview, if any) + a table of only **the rows that changed this round** + "ค้างอยู่" + "รออนุมัติ" (if any) + "ข้อเสนอ" (if any) + "ถัดไป" (next), then say where the full table lives (`CONTEXT.md` or `docs/BUILD-PLAN.md`). Do not paste the whole file.

---

## 5 · Checklist before saying it is finished

- [ ] Read the central file from disk before editing (someone else may have edited it)
- [ ] The progress table is overwritten, not appended, and has a date and time
- [ ] Every row that says `เสร็จ` or `ผ่าน` (pass) has evidence · the checker is not the doer
- [ ] You did not set `Approved` yourself
- [ ] `## รับงานต่อ` is updated per `handoff` section 5
- [ ] You touched no other heading in the file
- [ ] BUILD-PLAN form: the numbers in "ภาพรวม" match the table · 1 line is added to `## ประวัติสถานะ` · "ทีมตอนนี้" (current team) has no leftover `ทำอยู่` row for a task that has finished
- [ ] BUILD-PLAN form: run the checker until it passes (the checker is in plugin `superuser`): `python <superuser folder>/skills/polished-document-style/scripts/check_outline.py assets/build-plan-status.md <path of docs/BUILD-PLAN.md>`. It catches missing headings, swapped headings, missing bold cells, changed table headers and cells not yet filled. Other headings in the file (the task table, `## ตัดสินใจเอง`) the checker lets pass.
---

## 6 · What not to do

- Do not create a new status file (`STATUS.md` `progress.md`), because status then scatters across places.
- Do not hide failing items in prose, because a reader of the table will think everything passed.
- Do not append to the table every round, and do not let a subagent write the central file.

---

## Project plan and weekly report

The template for a project plan (timeline · milestone · risk register · Responsible-Accountable-Consulted-Informed (RACI)) and the weekly status report sent to stakeholders is in [`references/project-plan-and-weekly-status.md`](references/project-plan-and-weekly-status.md)

## Link to other skills

| Need | Use together with |
|---|---|
| The task table and the code-writing loop in the same file | `spec-to-code-loop` (plugin `software-development`) |
| A project's document set and document status | `project-doc-set` (plugin `software-development`) |
| Recording context to continue in the next conversation | `handoff` |
| The table of self-made decisions in the same file | `decision-log` |
| Choosing a playbook and finishing every kind of task | `superuser` |
| Table and document format | `polished-document-style` |
| Names and status of document files | `document-naming` |


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

Template for the agent `project-manager` · moved from the agent file (2026-10-14) · the short status table at the end of a job is in the SKILL.md of `status-report`, while this file holds the project plan and the weekly report for stakeholders

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
