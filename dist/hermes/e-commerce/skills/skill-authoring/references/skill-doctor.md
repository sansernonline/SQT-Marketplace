# Reading /skill-doctor output

Moved from SKILL.md section 8. "หัวข้อ 4" means the wiring list in [`wiring-and-validator`](wiring-and-validator.md).

## 8 · Read the `/skill-doctor` result

- `/skill-doctor` (Claude Code 2.1.252 or later · in interactive mode it opens the Stats tab of `/plugin` · in `-p` mode it prints text) reports the context cost of each skill and how many times it was called, with a flag **never called** = it is in the list but was never opened. Start with the flagged skills that use the most context (`จากแหล่ง` (from a source): the skills page · the counting period is `ยังไม่ได้ตรวจ` (not yet checked)).
- If one of our skills is never called, go in this order: (1) Is the YAML broken? → run the validator. (2) Does the description say "use when" with words users really type? → fix it, then run the `-trigger` case. (3) Does the hook router have a row for it? → section 4. (4) Does that kind of work really happen? → if not within 1 month, move the skill to the plugin where that work lives, or merge it into a close neighbour, and record it in the CHANGELOG.
- **Written in settings is not the same as installed.** After installing, open a new chat and count the skills the agent really sees (course, 2026-11-04: 13 of 21 desks had no `core`, even though the template named it). Do not leave a "never ever" rule only in a skill, because the skill may never be called. Put it in a hook or CLAUDE.md too (for the layers of checks see `learn-loop/repeated-mistakes-to-checks`).
- A plugin's skills can be turned off only from `/plugin` (`skillOverrides` in settings applies to personal and project skills) · `/doctor` reports the context cost of the whole list.
