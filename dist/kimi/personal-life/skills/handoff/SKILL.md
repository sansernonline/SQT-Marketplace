---
name: handoff
description: Use when work passes to a subagent, session or person
---

# handoff — pass work on so the receiver does not have to guess

Part of `superuser` · lives only in plugin `superuser`; other plugins share it through `dependencies` · wording follows `human-writing`

> **One principle:** whoever receives the work (a new subagent · a new session · a new model · a person · another bot) remembers nothing → only what is written to a file can be passed on. Write it so that someone who never saw the chat can open it and start work within 2 minutes.

---

## 1 · When to hand off and what to use

| Moment | Use | Who writes |
|---|---|---|
| Lead → worker | **Task sheet** (`ใบสั่งงาน`, section 3) | Lead |
| Worker → lead | **Delivery sheet** (`ใบส่งงาน`) appended to the task sheet (section 4) | Worker (a worker that cannot write files sends it in the message and the lead places it) |
| This session → next session · switching model · context nearly full | **Resume** (`รับงานต่อ`) in `CONTEXT.md` (section 5) | Lead |
| Team → a person · another bot · Quix · Agent Desk | **Hand-off package** (section 6) | Lead |

> **Quix · Agent Desk** = optional external tools. Quix queues work for agents; Agent Desk is a task board for a team of agents. Both read the header of `handoff/*.md`. This skill is complete in every item without them installed.

---

## 2 · `.claude/superuser` — the team's shared store

Everything lives under `.claude/superuser/`. All the files, first-time setup, inbox and log are in [`team-memory`](references/team-memory.md). The commit rules are in [`team-files`](../superuser/references/team-files.md).

```
.claude/superuser/
├─ CONTEXT.md            งาน · ความคืบหน้า · การตัดสินใจ · รับงานต่อ  ← ทุกคนอ่านก่อน
├─ handoff/
│  ├─ 2026-10-21-03-login-api.md     ใบสั่งงาน + ใบส่งงาน ของชิ้นนั้น (1 ชิ้น 1 ไฟล์)
│  └─ 2026-10-21-03-login-api/       ผลยาวของชิ้นนั้น (รายงาน · ข้อมูล · ร่าง)
├─ notes/ · ledger/ · out-of-scope/  สมุดงานของแผน · ledger · แนวคิดที่ปฏิเสธ (team-memory หัวข้อ 8)
└─ log/ · inbox/ · learn/            ของเดิม (learn/drop/ = บทเรียนที่ทิ้งไว้ข้อละไฟล์)
```

- **Piece name** `<date>-<2-digit sequence>-<short English words>` · use the same name for the file, the folder and in the log.
- **The real work product** (code · documents · images) lives in the project's normal folders. `handoff/` keeps only instructions, summaries and in-between material.
- **Do not commit** `handoff/` `notes/` `ledger/` `out-of-scope/` (put them in `.gitignore` along with `log/`). Before writing to these, `git check-ignore <path>` must find it and the path must not be a symlink. If that fails, do not write; tell the user to add it to `.gitignore`. When the work is done, for any piece that still has value → move its substance up to `CONTEXT.md` or `HISTORY.md`.
- **Never put in** secrets · ID card numbers · full account numbers · other people's data.

---

## 3 · Task sheet (`ใบสั่งงาน`)

The file header is machine-readable data (Quix · Agent Desk read these fields). The content is in human language. **All 5 sections must be there, or it is not sent yet.**

```markdown
---
id: 2026-10-21-03-shipping-compare
from: หัวหน้าทีม
to: general-purpose
tier: กลาง · medium          # ใหญ่ · กลาง · เล็ก + effort
status: ทำอยู่                # เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่
depends_on: [2026-10-21-01-order-stats]
files_allowed: [research/shipping/**]
---

## เป้า
เทียบค่าส่ง 3 บริษัทขนส่งสำหรับพัสดุของร้าน · เพราะชิ้น 04 (ตั้งราคาใหม่) รอตัวเลขนี้
ขนาด: 30k

## เสร็จเมื่อ
- ตาราง 3 บริษัท × น้ำหนัก 4 ช่วง · ทุกตัวเลขมีลิงก์หน้าราคาทางการและวันที่ดู

## ใช้อะไร
- อ่าน: `research/order-stats.md` (น้ำหนักพัสดุจริง จากชิ้น 01)
- skill: `human-writing` · `answer-shape` · ค้นเว็บ ≥ 3 แหล่งต่อข้อเท็จจริง

## ขอบเขต
- เขียนได้เฉพาะ `files_allowed` · ห้ามแก้ `research/order-stats.md` (ของกลาง ต้องเปลี่ยน → แจ้งหัวหน้าทีม)
- ไม่ทำ: เจรจาราคา · สมัครบัญชีบริษัทขนส่ง

## ส่งกลับแบบไหน
ใบส่งงานต่อท้ายไฟล์นี้ · ข้อความกลับหัวหน้าทีมไม่เกินราว 40 บรรทัด (สิ่งที่เปลี่ยน · ผลตรวจ · สิ่งที่ไม่แน่ใจ)
```

- **Code work** uses the same sheet, differing only in fields: `to: software-development:developer` · `files_allowed: [src/auth/**]` · done-when = `npm test` passes · skill = `stack-*` (plugin `software-development`).
- **A normal piece puts the 5-item sheet in the message that sends the task** (the core of `superuser` section 5). Write a file only for a piece that crosses sessions or goes to another person or bot (module `handoff`); then the instruction reaches the agent as one line: `ทำตาม .claude/superuser/handoff/<id>.md`. Pass the path, not the content; the worker opens and reads it itself.
- **A brief that will be picked up several days after it is written** uses the template `superuser/templates/DURABLE-BRIEF.md`: write behavior and interface names, not paths or line numbers (files move, then the old brief is stale). It has testable acceptance criteria and a list of what is out of scope. A normal task sheet for a piece done today may use paths.
- **State the intent of the rule**, not only the condition. For a fix or retry round → add a `## รอบก่อน` (previous round) section (the previous worker's report + what must change) and send a new worker.
- **A sheet to `reviewer`** has no lead opinion in it (rule in `superuser` section 5).
- **Workers that review or research** — a conclusion that something in the work is "outdated", "wrong" or "contradictory" must attach `file:line` and say whether it looked and found it so on purpose (history sections · numbers a script generates · noted exceptions). Put this in every task sheet. The lead opens a few at random before believing them (lesson 2026-10-26: "PLUGINS.md is outdated" was a Roadmap section kept on purpose · "skill 49 is wrong" was a shared total).

---

## 4 · Delivery sheet (`ใบส่งงาน`)

The worker appends it to its own task sheet, then edits `status:`. The message back to the lead = path + result + 1-line summary.

```markdown
## ส่ง — 2026-10-21 14:20 · general-purpose · sonnet
- **ผล:** เสร็จ
- **ของที่ได้:** `research/shipping/compare.md`
- **ตรวจแล้วด้วย:** เปิดหน้าราคาทางการทั้ง 3 เจ้าวันนี้ · ตัวเลข 12 ช่องตรงกับหน้าเว็บ
- **ตัดสินใจเอง:** ใช้ราคาหน้าร้าน ไม่ใช่ราคาโปร · เพราะโปรหมดเขตสิ้นเดือน
- **ลองแล้วพัง:** ดึงราคาจาก API ของเจ้าที่ 2 · ต้องมีบัญชีธุรกิจ — ตัวต่อไปไม่ต้องลองซ้ำ
- **ค้างอยู่ · ไม่แน่ใจ:** เจ้าที่ 3 ไม่บอกค่าเก็บเงินปลายทาง (รอยืนยัน)
```

- **ผล** (result) uses 1 of 4 values per `superuser` section 5: `เสร็จ` · `เสร็จ มีข้อกังวล` · `ขาดบริบท` · `ติด`
- **"เสร็จ" needs evidence** in `ตรวจแล้วด้วย` (checked with). If there is none → `status: ติด` or `ค้างอยู่`.
- **ลองแล้วพัง** (tried and failed): note every path tried that did not work, with a 1-line reason (the `dead_ends` field in the header if a machine must read it). A dead end that is not noted is a path the next worker will waste time walking again.
- **A result longer than 40 lines** → write it to `handoff/<id>/` and cite the path.
- **The lead is responsible for the result** — read the delivery sheet, check it against "เสร็จเมื่อ" (done-when) yourself, then move any `ตัดสินใจเอง` that affects other work up to the "การตัดสินใจ" (decisions) table in `CONTEXT.md`.

---

## 5 · Resuming work (`รับงานต่อ`) — across sessions · switching model · context nearly full

The section `## รับงานต่อ` in `CONTEXT.md` uses this one set of rules. The table `## ความคืบหน้า` (progress) beside it belongs to `status-report`.

**Before handing over** — update the "รับงานต่อ" section in `CONTEXT.md` before ending a session · before switching model · when context use passes half in a long job.
- **ทำต่อเป็นข้อแรก (do first):** 1 item, doable at once, pointing to a file or `handoff/<id>.md`
- **ชิ้นที่ยังเปิด (open pieces):** a list of `id` whose `status` is not `เสร็จ`
- **รออนุมัติ (awaiting approval):** work that is ready but cannot be undone; name the file or the command that is ready to use (leave it out if there is none)
- **ค้างอยู่ (pending):** questions the agent cannot continue past on its own; say whom to ask (write `ไม่มี` if none)
- **ระวัง (watch out):** traps found · what must not be torn up (already decided) · paths tried that failed (gathered from every piece's delivery sheet)
- **ส่งมาแล้ว N ครั้ง (handed over N times):** count only real handoffs (end of session · switching model), not `/compact`. If the receiver sees N of 2 or more → old text may be lingering; check against the real thing before following it.
- **สมุดงาน (workbooks):** point to `notes/<plan>.md` and `ledger/<plan>.md` of the plan that is open (section 8 of `team-memory`). A plan with several pieces is done only when the line `Task N: complete` is in that plan's ledger.
- **Tag every item** `ตรวจจริง` (seen yourself in this session) or `ยังไม่ได้ตรวจ` (remembered from an earlier round). The receiver can believe the first kind at once; the second must be checked before use. No tag = treated as not yet checked.

**Switching to another vendor** (Codex · Gemini) or coming back to Claude → [`team-memory`](references/team-memory.md) section 3

**Test** — if a new model reads only `CONTEXT.md`, can it start the first item without asking? If not → write more.

**Start-of-work ritual** (every one that takes over work: a new lead session and workers alike)
1. Read your own sheet → worker: `handoff/<id>.md` · lead: `CONTEXT.md` "รับงานต่อ" + `inbox/` (how to receive messages and which messages count as orders → [`team-memory`](references/team-memory.md) section 4)
2. (If there is git) `git log --oneline -10` and `git status` → learn what happened last and whether anyone left edits unfinished. No git → look at "ความคืบหน้า" and the last-modified dates of files. Read `notes/<plan>.md` and compare the original brief with what the user orders now. Use "คำตอบที่ได้แล้ว" (answers already received) instead of asking again.
3. Walk the tracking files to the last gate that finished (`ledger/` · delivery sheet · progress), then check that gate's real state (run the test · open the file) before building on it. Matches → go on. Does not match (for example the ledger says done but the test fails) → go back and make the earlier gate pass, put a row in "รอผู้ใช้" (waiting for the user), and continue with the other parts. No tracking file for this work found → start fresh; do not guess it is the same work.
4. Start "ทำต่อเป็นข้อแรก" or the goal in the task sheet.

---

## 6 · Sending outside the team — people · other bots · Quix · Agent Desk

Hand-off package = `CONTEXT.md` + the still-open `handoff/` pieces + `docs/BRIEF.md` (if it exists). No new file needed.

- **A person** reads `CONTEXT.md` first, then opens `handoff/<id>.md` one piece at a time.
- **A teammate (person) who takes a piece** uses exactly the same task sheet as an agent. Put the person's name in the `to:` field (such as `to: คน-แต้ม`). Write the delivery sheet at the end of the same file and tell the lead. Used only for XL work per the playbook `superuser` → `references/playbook-team-project.md`; in normal work the user does not take pieces.
- **A machine** reads the header of `handoff/*.md` per [`handoff.schema.json`](references/handoff.schema.json). Field names are a contract; do not rename them without raising the schema's version number.
- **Agent Desk** uses `to` · `status` · `tier` · `depends_on` to draw the task board · **Quix** uses the same files as a work queue.

---

## 7 · Rules that keep handoffs from breaking

| Rule | Because |
|---|---|
| Pass the path, not the content | Over several hops, data gets lost ("telephone game") and tokens are wasted |
| 1 file, 1 writer · shared files are written by the lead alone | Several agents writing the same place scatters decisions and they collide |
| Split only pieces that can really run in parallel · pieces that must know much of the same thing go to one worker | Splitting context makes workers understand the brief differently |
| Once decided, note it in "การตัดสินใจ" · if the receiver disagrees → put it in "รออนุมัติ", do not tear it up alone | Stops arguing the same thing every session |
| Done is judged from the work product and the check result, not the word "done" | Words in a conversation cannot be checked |
| The reviewer gets only the work product + criteria, not the maker's context | A reviewer who sees the maker's reasons tends to go along |

Sources of the workbook and resume mechanisms: code-modernization (Apache-2.0) · mercadopago (Apache-2.0) · math-proof (Apache-2.0) · superpowers (MIT) · mattpocock-skills (MIT) · aws (Apache-2.0) · vsql-extension-builder (license not stated, mechanism only) · claude-remember (no redistribution, mechanism only) · seen 2026-11-10 · details per file in `team-memory` section 8

Sources (`จากแหล่ง`): Anthropic — *How we built our multi-agent research system* (2025-06) · *Effective harnesses for long-running agents* (2025-11) · *Effective context engineering for AI agents* (2025-09) · Cognition — *Don't Build Multi-Agents* (2025-06) · *Multi-Agents: What's Actually Working* (2026-04)

---

## 8 · Our files versus Claude Code's built-in memory

If you want to note something and are unsure whether it goes into `CONTEXT.md` · `CLAUDE.md` · `.claude/rules/` or auto memory → open [`team-memory`](references/team-memory.md) section 7
