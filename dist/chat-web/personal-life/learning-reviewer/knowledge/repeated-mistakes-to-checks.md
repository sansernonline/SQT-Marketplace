# skill: repeated-mistakes-to-checks

Use when the same mistake gets corrected twice

# repeated-mistakes-to-checks: a mistake that repeats must become impossible

> A warning in SKILL.md is the weakest guard rail. Use it as the last resort.

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

## What not to do

- Add a "never..." text to SKILL.md when it could be a check.
- Create a rule that was not proven with a real mistake, because a rule that misses its target makes everyone wrongly believe they are safe.
- Check so broadly that it also catches correct things, because in the end everyone learns to skip it.

## References

- [`references/examples.md`](references/examples.md) — open when you want examples of rules already turned into checks in this set
- [`references/sources.md`](references/sources.md) — origin notes


## reference: examples.md

# Examples · repeated-mistakes-to-checks

Rules in this set that became checks:

| Rule | Used to be | Now it is |
|---|---|---|
| A skill's description must not contain `": "` without quotation marks | A warning in a document | `scripts/check/validate-marketplace.mjs` + `--self-test` |
| Numbers in the README must match reality | Edited by hand | `scripts/sync/sync-docs.mjs --check` |
| SuperUser shared files must be identical in every plugin | A text line "edit every copy" | `scripts/sync/sync-superuser.mjs --check` |


## reference: sources.md

# Sources · repeated-mistakes-to-checks

- Idea from pstack's correct command and rules-as-checks (not in this marketplace).
- hookify (Apache-2.0) · `agents/conversation-analyzer.md` · viewed 2026-11-10 (dig out the user's correction signals working back from the latest, rank by severity, draft regex-style rules).
