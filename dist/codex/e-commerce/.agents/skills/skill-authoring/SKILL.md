---
name: skill-authoring
description: Use when creating or changing a skill, agent or playbook
---

# skill-authoring — write skills that get called, can be followed, and can be measured

> **The one rule:** a skill is not finished until you have seen an agent fail without it and seen it called on its own. Every new skill has 3 eval cases and passes a before-and-after test round.

## Use when
- Create a new skill, agent or playbook in `plugins/<plugin>/`; change a description or move a skill across plugins.
- Write or change a skill's evals; `/skill-doctor` or `scripts/evals/triggers` says a skill is not being called.
- Review a skill someone else wrote before merging.

Not for: unfiltered lessons from work → `learn-loop/session-lessons-to-skills` first (it picks the skill, then come here) · a repeated mistake that can become an automatic check → `learn-loop/repeated-mistakes-to-checks` · a team lead splitting skill writing among team members → playbook `skill-authoring` in plugin `software-development` (`skills/superuser/references/playbook-skill-authoring.md`), which uses these rules.

## Steps
1. Declare before writing: name · target size · 3 topics not covered · which file holds what (knowledge · contract · steps), per [`skill-structure`](references/skill-structure.md). Do 1 real run of the task first and keep the methods that worked.
2. Write `description` to start with `Use when …` or `ใช้เมื่อ …`, at most 160 characters, no `: ` in an unquoted value, no `<` `>`. It says when to use the skill, never summarises the steps. Put in words users really type (Thai and English). Check overlap with `grep -rn "^description:" plugins/*/skills/*/SKILL.md | grep -i <word>`; if siblings overlap, say in the description which takes what. Full rules, frontmatter fields and the outside-Claude-Code limits: [`description-and-frontmatter`](references/description-and-frontmatter.md).
3. Write the body as a recipe saying what to do, not as prohibitions, with a 1-line reason and no capitals for shouting. Body at most 500 lines; sometimes-used detail goes to `references/<topic>.md` (over 300 lines needs a table of contents), machine work to `scripts/`, templates to `templates/` or `assets/`. If a new rule contradicts an old one, fix the old one. Point to another skill's section instead of copying it. Details: [`body-shape`](references/body-shape.md).
4. Every number or fact carries a source and date, or `(ยังไม่ได้ตรวจ)`. Put changing numbers in `scripts/check/facts.json` if the validator should warn when stale.
5. If the skill spends money or creates things outside the machine (cloud machines · GPU · purchases · per-call APIs), build in all 4 safeguards: (1) a money ceiling set by the user, which the skill cannot raise and must ask about first; (2) never delete or cancel the user's own things without asking; (3) after deleting, re-check with a list command that they are gone, then summarise the real cost; (4) say plainly that stop is not destroy, since a stopped item still bills for storage. Use `disable-model-invocation: true` when the model must not call it itself, the least-privilege key, and report environment checks as OK or MISSING without printing values.
6. For an agent, a playbook, a plugin command file or `INTENT.md`, follow [`agents-and-playbooks`](references/agents-and-playbooks.md): an agent needs a `## Writing` heading pointing to `human-writing`; a playbook has numbered steps each ending `ใคร:` and a check step by someone other than the doer.
7. Wire the skill: add a row to `plugins/superuser/hooks/skill-router.json` and test 3–5 real sentences (match) plus 1 unrelated (no match). Touch every file in the wiring list in [`wiring-and-validator`](references/wiring-and-validator.md). Edit JSON or YAML that holds a regex with Edit or a script file, never a Bash heredoc (`\\b` becomes a backspace; happened 5 times up to 2026-10-26).
8. Write 3 eval cases (`-trigger` · `-behaviour` · `-regression`) and run a red/green test with fresh subagents: [`eval-cases`](references/eval-cases.md) · [`before-after-testing`](references/before-after-testing.md).
9. Bump `version` in `plugins/<plugin>/.claude-plugin/plugin.json` whenever plugin content changes. The validator does not check this, and without it `claude plugin update` says "latest" although content changed (found 2026-11-04).
10. Run `node scripts/check/validate-marketplace.mjs` (error must be 0) and `node scripts/sync/sync-superuser.mjs --check` before every handoff.

## Check before done
- The validator and `sync-superuser --check` pass.
- description starts with "Use when", at most 160, no overlap with siblings; the router matches real sentences.
- Every file in the wiring list touched · 3 case files · red/green round results recorded.
- Every number and fact has a source + date, or was measured yourself with date and tool version; from memory = `(ยังไม่ได้ตรวจ)`. A line saying something was tested or checked has the date on the same line (the validator checks).
- For an AI-written draft, a human has read it for places where the AI silently decided something just to pass the test.
- `version` in `plugin.json` bumped after content changes (manual check) · after installing, count the skills in a fresh chat.

## References
- [`references/eval-format.md`](references/eval-format.md) — open for the official eval format
- [`references/description-and-frontmatter.md`](references/description-and-frontmatter.md) — open when writing name, description or frontmatter fields
- [`references/body-shape.md`](references/body-shape.md) — open when drafting or restructuring a body, or costing money
- [`references/agents-and-playbooks.md`](references/agents-and-playbooks.md) — open when writing an agent, playbook, command file or `INTENT.md`
- [`references/skill-structure.md`](references/skill-structure.md) — open for templates and the declare-before-writing table
- [`references/wiring-and-validator.md`](references/wiring-and-validator.md) — open when adding a skill (files to touch) or when the validator complains
- [`references/eval-cases.md`](references/eval-cases.md) · [`references/eval-loop-rules.md`](references/eval-loop-rules.md) · [`references/eval-audit.md`](references/eval-audit.md) · [`references/optimize-loop.md`](references/optimize-loop.md) — open when writing, running or auditing evals (3 cases per skill; the suite must not die; `-guard`; default 3 runs per case reporting `WITH` `W/OUT` `Δ`; gate by pre-set numbers)
- [`references/before-after-testing.md`](references/before-after-testing.md) — open for the red → green → close loopholes round (empty folder, other plugins hidden, judges blind to which version has the skill)
- [`references/skill-doctor.md`](references/skill-doctor.md) — open when `/skill-doctor` flags a skill as never called
- [`references/skill-evaluation-evidence.md`](references/skill-evaluation-evidence.md) — open for evidence and limits behind these rules
- [`references/sources.md`](references/sources.md) — sources and check dates
