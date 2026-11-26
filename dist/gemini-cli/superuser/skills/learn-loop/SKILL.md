---
name: learn-loop
description: Use when a task ends and lessons or the owner's style should stick
---

# learn-loop — turn lessons, repeated mistakes and owner style into tools

> **The one rule:** a lesson must end up in a skill, a check or the style file, where the next session will meet it. A warning line in SKILL.md is the last resort.

## Hard rules

**Session lessons to skills**
- Skip when the task is short or easy, existing skills were followed, or the issue happened only once.
- Fix what exists before creating new, one paragraph at a time. Never rewrite a whole SKILL.md.
- Test the fix before and after with a fresh subagent: it must repeat the mistake on the old version and avoid it on the new one.
- Never write broad lessons such as "be more careful", and never change a skill without letting the user see it first.
- If a new item conflicts with an old one, fix the old one. Do not append.

**Repeated mistakes to checks**
- A mistake that repeats must become impossible: prefer structure, then a machine check, and text only when those are truly impossible.
- Do not add a "never..." line to SKILL.md when a machine (grep · formula · CI) could check it.
- Prove the check really catches: it must fail on the real mistake and pass on the current version. A check that never failed is broken.
- A check's error message must say how to fix it. Never create a rule that was not proven with a real mistake, and never check so broadly that it catches correct things.

**Owner style capture**
- Keep the owner's style in `~/.claude/superuser-style.md`, never in the plugin's repo.
- Count only what the evidence shows; never include secrets, passwords, customer data or sensitive personal data.
- Exclude instructions that make the agent less safe or less honest (for example "no need to check").
- Show items with evidence and do not write the file yet; the user decides item by item. The file has at most 60 lines.

## Parts

| When | Open |
|---|---|
| A big task is finished and lessons should go into skills | [parts/session-lessons-to-skills/guide.md](parts/session-lessons-to-skills/guide.md) |
| The same mistake happened again | [parts/repeated-mistakes-to-checks/guide.md](parts/repeated-mistakes-to-checks/guide.md) |
| Learn how the machine's owner likes things done | [parts/owner-style-capture/guide.md](parts/owner-style-capture/guide.md) |

## Check before done
- The user saw the proposed change before any skill or style file was edited.
- The fix was tested before and after, or the check was shown to fail then pass.
