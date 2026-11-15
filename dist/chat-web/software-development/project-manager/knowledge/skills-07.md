# skill: repeated-mistakes-to-checks

Use when the same mistake gets corrected twice

# repeated-mistakes-to-checks: a mistake that repeats must become impossible

> The agent does not need to remember a hundred rules. If the path has guard rails at the right places, it hits one and gets stopped at the right moment on its own.
> A warning in SKILL.md is the weakest guard rail. Use it as the last resort.

This comes from pstack's correct command and rules-as-checks (not in this marketplace).

## Do not use when

For choosing among `session-lessons-to-skills` · `repeated-mistakes-to-checks` · `owner-style-capture`, see the central table in [`session-lessons-to-skills`](../session-lessons-to-skills/SKILL.md), under the heading "Which one to use".

## Steps

1. **Gather evidence:** what the user corrected (messages in this conversation · lines with `correction: true` in `.claude/superuser/log/` · repeated topics in `.claude/superuser/learn/` · rows of the "การตัดสินใจ" (decisions) table that start with `ผู้ใช้แก้ —` (user corrected) · review comments · work a client sent back · commits reverted repeatedly). You need at least 2 incidents of the same thing. One incident does not count yet.
   - **Do not wait for the user to say it again; dig it out yourself.** Read the user's messages in the conversation, working back from the latest, and look for 3 kinds of signal: a prohibition ("อย่า…" · "ไม่ต้อง…") · "ฉันไม่ได้ขอ" (I did not ask for that) or a request to redo · a revert or overwrite of work the agent just finished. Then rank by severity before going to step 2.

     | Severity | Signal | Next |
     |---|---|---|
     | High | A revert · deleting something the agent added · "ทำไมแตะไฟล์นี้" (why did you touch this file) | Build a check right away, even after one incident, if a machine can check it |
     | Medium | "อย่า…" · "ไม่ได้ขอ" repeated 2 or more times | Go to step 2 as usual |
     | Low | A preference about wording or format | `owner-style-capture` |
2. **Sort into types.** Name each type of mistake short and clear, e.g. "using a price excluding VAT in a quotation" · "forgetting the source date in a report" · "using Buddhist Era years in the database".
3. **Choose the layer to fix at: the highest you can.**

   | Layer | Examples | Why it beats the layer below |
   |---|---|---|
   | Structure | A template that leaves only the fields that must be filled · leave only one way to do it · delete old things that cause confusion | The wrong path disappears |
   | Data type | A date field in a sheet set to accept only dates · in code: separate types `ThaiYear` and `Year` | The machine stops you |
   | Check script | A formula that compares totals in a sheet · a grep script that finds banned words in documents · lint in CI · **an error message that says how to fix it** | On a hit you know at once what to do |
   | Check examples | A set of examples that must pass before sending · a test that fails when behavior is wrong | Catches it before sending or merging |
   | Text | Edit a paragraph in SKILL.md or an agent | Use only when the layers above are truly impossible. A "never" rule must not live only in a skill, because the skill may not be called (course CWN2026 2026-11-04: asked about the plan without calling the skill, the agent opened the whole answer-key heading). Put it in a hook or CLAUDE.md too |

4. **Build the check.** Write the smallest form that catches that type ([`principle-build-a-tool-not-handwork`](../principle-build-a-tool-not-handwork/SKILL.md)).
   - Draft a rule that a regex can catch first: name the tool or file the rule governs · the pattern · the message shown on a hit (saying how to fix) · 1 example that must hit and 1 example that must not hit (used in step 5). If a regex cannot catch it → use the text layer and say why.
5. **Prove it really catches.** Take the code or document from the real mistake (or recreate it faithfully) and run the check, which **must fail.** Then run it on the current version, which must pass. A check that has never failed is a broken check.
6. **Log it in the table:** `| ความผิด | ชั้นที่แก้ | ตัวตรวจ (ไฟล์) | พิสูจน์ด้วย |` (mistake · layer fixed · check (file) · proven by) in `.claude/superuser/IMPROVEMENTS.md` (for code work, `docs/AGENT-RULES.md` or the `README` of the skill repo also works). Then add 1 line under the "กติกา" (rules) heading of `CONTEXT.md` that points to it.
7. Repeat every time the user corrects a new topic for the 2nd time.

## Do not wait for a repeat: signs you should build a check right away

- If the same rule lives in several files (e.g. repeated in every prompt), move it to one place and let the others refer to it.
- If you are about to write one more "never..." line when a machine could check it (grep · formula · CI), build a check instead.
- A check's error message must say how to fix it, not just say it is wrong.

Examples in this set:

| Rule | Used to be | Now it is |
|---|---|---|
| A skill's description must not contain `": "` without quotation marks | A warning in a document | `scripts/check/validate-marketplace.mjs` + `--self-test` |
| Numbers in the README must match reality | Edited by hand | `scripts/sync/sync-docs.mjs --check` |
| SuperUser shared files must be identical in every plugin | A text line "edit every copy" | `scripts/sync/sync-superuser.mjs --check` |

## What not to do

- Add a "never..." text to SKILL.md when it could be a check.
- Create a rule that was not proven with a real mistake, because a rule that misses its target makes everyone wrongly believe they are safe.
- Check so broadly that it also catches correct things, because in the end everyone learns to skip it.

## Source

hookify (Apache-2.0) · `agents/conversation-analyzer.md` · viewed 2026-11-10 (dig out the user's correction signals working back from the latest, rank by severity, draft regex-style rules).


---

# skill: session-lessons-to-skills

Use when a big task ends and lessons should be kept

# session-lessons-to-skills — every big task leaves its lessons in the tools

> A past conversation is valuable because it really happened, not because someone imagined it.
> But a lesson that lives only in the conversation disappears with the conversation.

## Skip when

The task is short or easy, the agent followed the existing skills correctly, or the issue happened only once.

## Which one to use — one table for 3 skills

This table is shared by `session-lessons-to-skills` · `repeated-mistakes-to-checks` · `owner-style-capture` (the other 2 point here).

| What happened | Use | Output |
|---|---|---|
| A big task ended · the user asked to gather lessons · a skill led the agent wrong | `session-lessons-to-skills` (this one) | A proposal to fix a skill or agent |
| The user corrected the same thing a 2nd time · a review warned about the same thing again | [`repeated-mistakes-to-checks`](../repeated-mistakes-to-checks/SKILL.md) | A checker (type · lint · test · hook) |
| The user's taste or preference, not a mistake | [`owner-style-capture`](../owner-style-capture/SKILL.md) | `~/.claude/superuser-style.md` |

## Steps

Use this as the review step of the playbook [`learn-from-session`](../superuser/references/playbook-learn-from-session.md). Gathering, showing the result to the user, and closing the items follow that playbook and are not repeated here.

0. **Read the `learn/drop/` folder first** (if it exists). These are lessons dropped one per file during the work, and they were never judged when written. Read all the files together and group them by topic. Merge items that repeat or are of the same kind into one item, then put it in the digest. After use, move them to `learn/drop/used/` (source: claude-remember · do not redistribute, take only the mechanism · see 2026-11-10)
1. **Make a digest.** From what the playbook gathered, write `_to_delete/session-digest.md`: the order of events · where the user corrected · where it got stuck for long · which skills were called and the result. Then hand this file to the subagent. Do not hand over the raw conversation.
2. **Launch the reviewers for 3 angles at the same time** (each reads the digest and the related skill files)

   | Angle | Asks | Model level + effort · agent |
   |---|---|---|
   | Decisions | Where did the agent decide wrongly, and why? What rule would have made it decide right? | big + high · fresh `general-purpose` |
   | Tools | What was done by hand that should be a script, a template, or a formula? Which step failed repeatedly? Which skill gave the wrong steps? | medium + medium · `learning-reviewer` |
   | Reverse | If starting over, what is a much easier path? Which assumption should not have been trusted from the start? | big + high · fresh `general-purpose` |

   Each reviewer returns a table `| บทเรียน | ชนิดพลาด | หลักฐานในบทสนทนา | แก้ที่ไฟล์ไหน | ข้อความเดิม → ข้อความใหม่ |` (lesson · mistake type · evidence in the conversation · file to fix · old text → new text), at most 40 lines per reviewer. The mistake type takes 3 values per agent `learning-reviewer`: `ไม่ได้เปิด skill` (did not open the skill; fix how the skill is advertised, not its content) · `เปิดแต่ไม่ทำตาม` (opened but did not follow it; fix the wording or position, or add a checker) · `ไม่มีกฎ` (no rule; paired example first).
   **Paired examples come before rules.** A lesson about wording, tone, or looks goes in as a `ก่อน → หลัง` (before → after) pair in the references file of that skill (the "after" must be text the user wrote). Write it as a rule only when a pair of the same shape appears at least 2 times.
   **Categories the reviewers must go through every round** (besides the 3 angles above): (a) signposts: skill names or descriptions that make the agent open the wrong skill or not open it · (b) automatic gates: items that should be a test, lint, or hook instead of a warning text (send to `repeated-mistakes-to-checks`) · (c) a `CLAUDE.md` or `CONTEXT.md` so large that nobody reads it to the end · (d) instructions written down that have no effect (the log shows they were ignored or could not be done). The result for every category must meet the same standard: evidence from the digest (source: mattpocock-skills · MIT · see 2026-11-10)
3. **Filter.** Keep only items that (a) have real evidence, (b) will happen again, (c) can point to which file to fix, and (d) have a scope saying which work they apply to and expire when the source wording changes. A lesson from one task should not make another task wrong. (Example from course CWN2026: the old answer was tied to the plan name, the URL, and the wording in the plan; when the wording changes it expires. The "expires" test was reported by Claude itself and has not been rerun, 2026-11-04.) For example, "the customer report used old figures because the skill did not say to open the latest file", not "be more careful with figures". A lesson that can become an automatic check goes to [`repeated-mistakes-to-checks`](../repeated-mistakes-to-checks/SKILL.md) instead.
4. **Fix what exists before creating new, and fix one paragraph at a time.** Do not rewrite the whole SKILL.md, because the parts that already work will be lost. Most of the time, edit a paragraph in an existing SKILL.md or agent file. Create a new skill only for work that no skill covers yet.
5. **Test the fix before and after.** Take the situation from the digest that caused the mistake and write it as a short task of 3–5 lines (no answer given). Send a fresh small-level subagent to do this task with the **old version** of the skill. It must make the same mistake as in the digest (if it does not, this lesson did not come from the skill; drop it). Fix the skill, then send another fresh subagent to do the same task. It must not make the mistake (if it still does, the fixed wording is not clear enough or is in the wrong place; fix it again). Record both rounds in the table shown to the user (idea from writing-skills in obra/superpowers · MIT)
6. Send the filtered table back to the propose-to-user step of the playbook `learn-from-session`. The digest is already in `_to_delete/`, so it does not need to be moved.

## What not to do

- Write broad lessons such as "be more careful", because nobody can follow them
- Change a skill without letting the user see it first
- Add text until the rules contradict each other. If a new item conflicts with an old one, fix the old one. Do not append.


---

# skill: document-naming

Use when naming or filing a document others keep

# Naming and versioning documents

> **The one rule:** a file that a system already keeps history for (git · Google Docs version history) **must not carry a version in its name.**
> A file that leaves that system **must carry one**, because nothing else can tell you who holds which copy.

## When to use this skill

- Creating a new document that the team or the client will keep.
- Sending a document to people outside the team.
- A folder starts to fill with `final`, `final2`, `ล่าสุด` (latest), `แก้แล้ว` (edited).
- Someone asks "so which version do we go with?"

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| The content inside the document | `human-writing` (code work: `srs-writing` · `fsd-writing` in plugin `software-development`) | instead |
| Markdown formatting | `polished-document-style` | instead |
| The look of the rendered file | `branded-document-design` (plugin `software-development`) | instead |
| Temporary files during work | `superuser:temp-file-discipline` | instead |
| Code work: commit messages · version of the **program** · the project document index | `commit-message-format` · `cicd-and-release` · `project-bootstrap` (plugin `software-development`) | instead / together |
| Abbreviations in work people read | [`spell-out-abbreviations`](../spell-out-abbreviations/SKILL.md) | together |

**The revision-history table template and the standard file-name list** are in `assets/naming-cheatsheet.md`.

---

## 1 · Pick the format before naming

**One test: if someone signs it or it goes outside the team, make it a deliverable file. A document that changes with the work stays markdown in the documents folder (e.g. `docs/`).**

| Document | Format | Reason |
|---|---|---|
| Proposal · quotation · handover report · acceptance certificate · contract (software project document sets → plugin `software-development`) | **docx** | Someone signs it, so the version must be locked |
| User manual | **docx + PDF** | End users can open it on any machine |
| Presentation slides | **pptx** · if html is requested → a single .html file (file type per `presentation-design` in plugin `software-development`) · PDF when the target machine lacks the fonts | |
| Work procedures · internal guides · README · meeting notes · decision records (code work → plugin `software-development`) | **markdown** in the documents folder | It changes often, needs diffs, and is easy to search |

> 🚨 **Markdown source that can be re-rendered is kept permanently in `docs/src/<topic>.md`, then rendered to docx into the documents folder (`docs/`).**
> `docs/` holds exactly one deliverable for that topic, the .docx. No .md or .pdf of the same topic sits beside it. (The source lives in `docs/src/`, not `_to_delete/`, because it is needed every time you revise.)
> On the next revision, edit `docs/src/` and render again. Never open Word and edit by hand (matches `markdown-report-docx`). The "ต้นฉบับ" (source) line on the cover points to this file.

**Make a PDF only for user manuals, or when the client asks.** Otherwise, one docx.

---

## 2 · File name format

```
<project code>-<type>-<topic>-v<M.m>-<status>.docx
```

| Document type | Format | Example |
|---|---|---|
| Exported file | `<project>-<type>-v<M.m>-<status>.docx` | `ACME-QUOTE-v1.2-APPROVED.docx` |
| Several topics | Add the topic after the type | `ACME-REPORT-sales-v0.3-DRAFT.docx` |
| Version actually sent to the client | Add the date at the very end, in International Organization for Standardization (ISO) 8601 format | `ACME-QUOTE-v1.2-APPROVED-2026-09-25.docx` |
| Markdown document | `<type>-<topic>.md`, lowercase, hyphens | `docs/guide-onboarding.md` |
| Meeting notes (exception: date first) | `YYYY-MM-DD-<topic>.md` | `docs/meetings/2026-09-25-kickoff.md` |

**File name rules:**

- No spaces; use hyphens. Spaces break links and command-line commands.
- **The date is always ISO `YYYY-MM-DD`** and goes at the very end, so sorting by name also sorts by time. The one exception: meeting notes put the date first, because the `docs/meetings/` folder holds only meeting notes, so it sorts by date at once.
- File names are in English even when the content is Thai. This avoids trouble when attaching to email and zipping across systems.
- Never put a person's name in a file name. `-somchai-edit` is a sign that people are not working from one source.

**Check with the script:** `node <this skill's folder>/scripts/doc-name-check.mjs docs/*` → it lists wrong names with a proposed name. To rename many files, add `--plan _to_delete/renames.json` to get a plan without touching files, check or edit the plan, then run `--plan _to_delete/renames.json --apply`. The script does not rename `APPROVED` files, does not overwrite existing files, and does not put received files (`ref/`) in the plan.

---

## 3 · Versions

| Which number goes up | When |
|---|---|
| **major** (1.x → 2.0) | Scope changes · document structure changes · needs a new sign-off |
| **minor** (1.1 → 1.2) | Content added or edited, still the same topic |
| No number change | Typo fixes, layout, but you **must still log it in the revision history** |

- The first version shown to anyone is `v0.1`, and the first version someone signs is `v1.0`.
- **Version numbers only move forward.** Never go back to an old number.
- A file that a system keeps history for has no version number in its name. To refer to a version, use a tag, commit, or version history.

---

## 4 · Status is a different thing from version

| Status | Means | Who may edit |
|---|---|---|
| `DRAFT` | Still being written | The author |
| `REVIEW` | Sent for review, awaiting comments | The author, following the comments received |
| `APPROVED` | Signed off | **No edits.** Raise a new version as DRAFT |

> **Once `APPROVED`, never edit the original file**, even for a typo.
> If you can, the version the client holds and the one we hold will differ, even though the file names match letter for letter.

---

## 5 · The revision history must be in the file

**A file name says only which version this is, not what changed.**
Every exported document must have this table on the first page.

```markdown
| เวอร์ชัน | วันที่ | ผู้แก้ | แก้อะไร | เหตุผล |
|---|---|---|---|---|
| 1.2 | 2026-09-25 | สมชาย | เพิ่มบทสรุปผู้บริหาร · ตารางราคาเป็น 12 รายการ | ลูกค้าขอเพิ่มสรุป |
| 1.1 | 2026-09-12 | สมชาย | แก้ระยะส่งมอบจาก 3 วันเป็น 5 วัน | ถามผู้ขนส่งแล้วทำไม่ได้ |
| 1.0 | 2026-09-01 | สมชาย | ฉบับเซ็นรับ | — |
```

- **The "แก้อะไร" (what changed) column must be concrete.** "Improved the content" helps nobody.
- Put the newest on top. A reader opening the file wants to know what changed last.

---

## 6 · Storage and sending

| Topic | Rule |
|---|---|
| Source | Lives in `docs/src/` of the work, in one place only (code work: `project-doc-set` in plugin `software-development`) |
| Exported files | Live in the documents folder (`docs/`) or the client's storage, **not the project root** |
| Received files | Keep their original name; never rename. They refer to that name |
| Files mid-conversion | `_to_delete/` (see `superuser:temp-file-discipline`) |
| Sending by chat or email | Always send a file with the version and status in the name. Never send `เอกสาร.docx` |

---

## 7 · Anti-patterns

- **`final.docx`, `final2.docx`, `final_ล่าสุด.docx`**: nobody knows which is newer.
- **`ใบเสนอราคา แก้แล้ว.docx`**: edited from which version, and what was edited?
- **Putting a version in the name of a file that a system keeps history for.** You get `spec-v1.md` and `spec-v2.md` side by side forever.
- **Editing a file that is already `APPROVED`**, even a single typo.
- **No revision-history table.** Then you must open and compare page by page.
- **Dates like `25-09-2026` or `250926`.** They do not sort, and people read them differently.
