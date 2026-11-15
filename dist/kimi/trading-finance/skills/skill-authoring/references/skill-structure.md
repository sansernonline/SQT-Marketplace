# Structure of a skill and a plugin: before writing, separating things, command files and shared rules

## Contents
- [1 · Declaration before writing](#1--declaration-before-writing)
- [2 · Separate knowledge, contract and procedure](#2--separate-knowledge-contract-and-procedure)
- [3 · The 4-heading command file](#3--the-4-heading-command-file)
- [4 · The plugin intent file](#4--the-plugin-intent-file)
- [5 · When the CLI rejects a command the skill names](#5--when-the-cli-rejects-a-command-the-skill-names)

## 1 · Declaration before writing

Before writing the first file of a skill, the author (person or agent) writes out these 5 lines, and keeps them at the end of the PR or in the work order:

1. The `name` and `description` to use (per section 1 of SKILL.md)
2. **3 topics this skill will not cover**, with the name of the skill that takes each one · if you cannot write 3, the scope is still too wide, so cut it first
3. Target size: how many lines of SKILL.md (normally 100–250 · cap 500) · how many reference files
4. **A table of what lives in which file**
5. The 3 test cases you will write (section 6 of SKILL.md)

| Item | Lives in | Reason |
|---|---|---|
| Rules to remember every time the skill is used · the "one rule" box · the "use when" table | `SKILL.md` | Loaded when the skill is invoked |
| Details used for some jobs only · long examples · evidence | `references/<topic>.md` (linked directly from SKILL.md) | Costs no context if unused |
| Work a machine can do (counting · checking · converting images) | `scripts/` | Runs without being read into context |
| Templates to copy and use | `templates/` or `assets/` | |
| Constants and lookup tables | Data file (section 2) | Changes for reasons other than the procedure |

## 2 · Separate knowledge, contract and procedure

A skill that mixes 3 kinds of things in one file must edit the whole file every time a value changes. Separate them into 3 places:

| Kind | What it is | Example | Lives in |
|---|---|---|---|
| Knowledge | Tables of constants · rates · lists | Tax rates · image sizes per platform | `references/<name>.md` as a table, or `data/*.json` if a script must read it |
| Contract | The shape of what is handed over | Schema of a handoff note · column headings of an import file | `*.schema.json` or a separate "format" section |
| Procedure | How to decide and the order of work | SKILL.md | SKILL.md |

**Test question:** will this thing change for reasons unrelated to the procedure? If yes (the law adjusts a rate · a platform changes a size), move it out to knowledge or contract. Result: changing a rate does not touch the procedure, and the procedure's evals do not need to run again.

## 3 · The 4-heading command file

Use for command files (slash commands · files in `commands/`) and for skills that act on things outside the files. This repo has no `commands/` yet (checked 2026-11-10), so this serves as the template for when it does. A playbook has its own structure per section 3 of SKILL.md.

```markdown
## Preflight
ตรวจสิ่งที่ต้องมีก่อนเริ่ม (login · สิทธิ์ · ไฟล์ · รุ่นเครื่องมือ) · ขาดข้อไหนบอกวิธีแก้แล้วหยุด

## Plan
บอกว่าจะทำอะไรเป็นข้อ ๆ · ขั้นที่ทำลายหรือย้อนยาก (ลบ · เขียนทับ · ส่งออก) ให้ถามยืนยันก่อน

## Commands
คำสั่งจริงที่รัน · ใช้ผลที่มีโครงสร้าง (JSON · exit code) ไม่ parse ข้อความที่คนอ่าน

## Verification
อ่านสถานะซ้ำจากของจริง (ไม่เชื่อ exit code อย่างเดียว) · รายงานสิ่งที่เปลี่ยนจริง
```

## 4 · The plugin intent file

For a plugin with 3 or more skills and a rule that every skill must follow, write that rule in one place and do not copy it into every SKILL.md:

- Location: `plugins/<plugin>/INTENT.md` (short, at most 40 lines) · each skill points to it with one line
- Content: the shared rules as a numbered list, for example (1) one source of truth per piece of data (2) an action others can see (sending a message · publishing) must be asked first (3) facts you do not know get `(รอยืนยัน)` (pending confirmation), never invented (4) a system-bootstrap skill is a precondition to do first, not an option beside the others
- Different from `plugins/superuser/hooks/core-rules.md`: that one holds the rules for every session on the whole machine · `INTENT.md` holds rules for that plugin only
- A skill that conflicts with `INTENT.md` must be fixed, or that file must be fixed, and the document must say so. Do not leave them in silent conflict.

## 5 · When the CLI rejects a command the skill names

A skill that calls an outside tool's command may be newer than the installed tool. Put this recipe in that skill:

1. The command is rejected (unknown flag · missing subcommand) → run `<tool> --version` and compare with the latest version (from the channel it was installed through, such as `npm view`), then tell the user both versions
2. **Ask the user before upgrading** (an upgrade changes their machine)
3. If permitted → upgrade through the same channel as the install (npm → npm · winget → winget), never across channels
4. Retry the original command **1 time** · if it still fails → report the real error message and the versions before and after, do not loop
5. The skill states the minimum tested version in its body (for example "Claude Code 2.1.269 or later") so step 1 can compare

Example: `claude plugin eval` needs 2.1.269 or later · lower versions do not have this command

## Sources

Rewritten in our own words · format `plugin (licence) · file · date viewed`

- buildkite (MIT) · CONVENTIONS.md · viewed 2026-11-10 → section 1
- migration-to-aws (awslabs/startups · licence type not checked) · docs/01-concepts.md section 3 · viewed 2026-11-10 → section 2
- vercel (has a LICENSE file, type not checked) · commands/_conventions.md · viewed 2026-11-10 → section 3
- postman (has a LICENSE file, type not checked) · intent.md · viewed 2026-11-10 → section 4
- mergify (self-written licence, not classified · only the idea taken) · skills/mergify-cli-upgrade/SKILL.md · viewed 2026-11-10 → section 5
