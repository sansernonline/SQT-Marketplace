---
name: context-budget
description: Use when a task reads large material or writes long output
---

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
