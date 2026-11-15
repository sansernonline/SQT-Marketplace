---
name: session-lessons-to-skills
description: Use when a big task ends and lessons should be kept
---

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
