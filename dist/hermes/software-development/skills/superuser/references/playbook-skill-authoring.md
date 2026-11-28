# playbook · skill-authoring — write or edit a skill and prove it really helps

Use when: creating a new skill · editing SKILL.md · editing an agent file · editing a prompt in `prompt/` (covers pstack's `authoring a skill` · `eval`)
Main principles: `superuser:work-principles` → `references/skill-authoring.md` (6 principles: when-to-use description · distinct from siblings · short main file · red → green · strictness by fragility · scripts for machine checks)
Main skills: `learn-loop/repeated-mistakes-to-checks` · `human-writing/spell-out-abbreviations` · `superuser:ground-rules` · `coding-evals`

## ขั้นตอน · Steps (copy into the todo as written)

1. Open the principle file `superuser:work-principles` → `references/skill-authoring.md` first. Look for whether a skill already covers this — editing an existing skill beats creating a new one, and a new name must say what it does, not be a nickname · ใคร: หัวหน้าทีม
2. Write the description to say "use when" (ใช้เมื่อ) in words the user really says, and it must not contain `": "` outside quotation marks · ใคร: หัวหน้าทีม
3. Content — short rules · steps that can be followed · what is forbidden. Move mechanical parts out of SKILL.md: `scripts/` for code that runs · `assets/` for templates (SKILL.md only says when to call them) · ใคร: หัวหน้าทีม
4. Prepare 3–5 test tasks the skill should help with, and 1 that should not call it · ใคร: หัวหน้าทีม
5. **Blind test** — send 2 fresh subagents on the same task, one with the skill and one without (or with the old version of the skill), then have a 3rd subagent that does not know which result came from which set score them against criteria written beforehand (for a skill about code, take the test tasks from `coding-evals`) (ตัดสินผลตาม `superuser:work-principles` → `references/skill-authoring.md`) · ใคร: `general-purpose` ตัวใหม่ 2 do the task · `reviewer` ตัวใหม่ scores blind
6. If the new skill does not clearly win, fix it and test again, or do not add it, then log the result in `decision-desk/decision-log` · ใคร: หัวหน้าทีม
7. In the SQT-Marketplace repo, run (รัน) `node scripts/check/validate-marketplace.mjs --self-test`, then `node scripts/check/validate-marketplace.mjs` · `node scripts/sync/sync-docs.mjs` · `node scripts/build/build-targets.mjs` · ใคร: หัวหน้าทีม
8. `superuser/status-report` · ใคร: หัวหน้าทีม

## Done when

The validator has no new errors, and there is a blind test result showing the skill really helps
