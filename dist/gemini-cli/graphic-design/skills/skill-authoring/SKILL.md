---
name: skill-authoring
description: Use when creating or changing a skill, agent or playbook in this marketplace, or its evals.
---

# skill-authoring — write skills that get called, can be followed, and can be measured

Lives only in plugin `superuser`; other plugins share it through `dependencies`. Wording follows `human-writing`. The official eval format is in [`eval-format`](references/eval-format.md).

> **The one rule:** a skill is not finished until you have seen an agent fail without it and seen it called on its own. Every new skill has 3 eval cases and passes a before-and-after test round.

## Must-not-skip rules (read these first)

1. Run `node scripts/check/validate-marketplace.mjs` (error must be 0) and `node scripts/sync/sync-superuser.mjs --check` before every handoff.
2. `description` starts with `Use when …` or `ใช้เมื่อ …`, is at most 160 characters, has no `: ` in an unquoted value and no `<` `>`. It says when to use the skill, never summarises the steps.
3. Add a row to `plugins/superuser/hooks/skill-router.json` and test it with 3–5 real sentences (match) and one unrelated sentence (no match).
4. Edit JSON or YAML that contains a regex with Edit or a script file. Never through a Bash heredoc: `\\b` becomes `\b`, a backspace (happened 5 times up to 2026-10-26).
5. Every new skill gets 3 eval cases (`-trigger` · `-behaviour` · `-regression`) and a red/green test with fresh subagents. Details: [`eval-cases`](references/eval-cases.md) · [`before-after-testing`](references/before-after-testing.md).
6. Bump `version` in `plugins/<plugin>/.claude-plugin/plugin.json` whenever plugin content changes. The validator does not check this; without it `claude plugin update` says "latest" although content changed (found in the course, 2026-11-04).
7. Write rules as instructions saying what to do, not prohibitions (section 2). Every number or fact carries a source and date, or `(ยังไม่ได้ตรวจ)`.
8. A skill that spends money or creates things outside the machine needs all 4 safeguards in section 2.

## When to use

- Create a new skill, agent or playbook in `plugins/<plugin>/`; change a description or move a skill across plugins.
- Write or change a skill's evals; `/skill-doctor` or `scripts/evals/triggers` says a skill is not being called.
- Review a skill someone else wrote before merging.

Not for: lessons from work not yet filtered → `session-lessons-to-skills` first (it decides which skill to change, then come here to change it the right way) · a repeated mistake that can become an automatic check → `repeated-mistakes-to-checks` · a team lead splitting skill writing into several steps for team members → playbook `skill-authoring` in plugin `software-development` (`skills/superuser/references/playbook-skill-authoring.md`, step 5 blind test), which uses the rules in this file.

## 1 · Name and description — the only part that decides whether a skill gets called

At session start Claude sees only `name` + `description` of every skill. The SKILL.md body loads only when the skill is called, and the list has a budget of about 1% of context; rarely-called skills get their description cut to the name first (`จากแหล่ง` Claude Code docs, skills page · 2026-10-23). So the name must say the job by itself, and the description must say "when to use", not "what it does".

| Rule | How | Enforced by |
|---|---|---|
| `name` = folder name · a-z 0-9 and `-` · at most 64 characters · no "anthropic" or "claude" | Use verb + object or the name of the output (`translate-th-en`, not `thai-helper`) | validator |
| Name collides with a built-in Claude Code skill (e.g. `simplify`) | In `skill-router.json` prefix the plugin name: `superuser:simplify` | sync-superuser |
| `description` starts with `Use when …` or `ใช้เมื่อ …` (a skill that must be opened before work starts uses `Use before …`; an agent called at a point in the flow may use `Use at …`; the validator accepts all of these) | Put in situations and words users really type, in both Thai and English ("says reflect or รวมบทเรียน"). Do not summarise the working steps, because an agent may follow the summary instead of opening the skill | validator · idea from obra/superpowers |
| At most 160 characters (warn at 150; agent warns at 120) · no `: ` in an unquoted value · no `<` `>` | `: ` breaks the whole YAML block and the skill silently disappears. Write `(reflect or รวมบทเรียน)` instead of `: reflect` | validator (Claude Code truncates at 1,536 characters but the Agent Skills spec says 1,024, which applies to `dist/` used outside Claude Code. Our 160 is under both ceilings; the budget for the whole list truncates long ones first) |
| No overlap with sibling skills | `grep -rn "^description:" plugins/*/skills/*/SKILL.md \| grep -i <word>`. If they overlap, say in the description which one takes what ("Cause known → targeted-fix") and add a "use the other one instead" table in the body | the author |
| The hook router sees it | Add 1 pattern row to `plugins/superuser/hooks/skill-router.json`, then test with `node -e` that 3–5 real sentences match and unrelated sentences do not (example in [`wiring-and-validator`](references/wiring-and-validator.md)). The human-read rows are in `references/triggers.md` of `superuser` | sync-superuser checks the name |

Usable frontmatter fields (`จากแหล่ง` skills page · 2026-10-23): `name` · `description` · `when_to_use` (appended to description for trigger phrases; our validator counts only description, so put the phrases in description first) · `allowed-tools` · `disallowed-tools` · `disable-model-invocation: true` (skills with side effects such as deploy: the user calls them) · `user-invocable: false` (hide from the `/` menu) · `model` · `effort` · `context: fork` + `agent` (run in a subagent) · `paths` (load only when files matching the glob are touched) · `argument-hint` · `hooks` · `license` · `metadata`. **Outside Claude Code** (claude.ai · `dist/`) accepts only `name` `description` `license` `compatibility` `metadata` `allowed-tools`; other fields get the file rejected, so use special fields only in skills that do not go to `dist/`. An agent uses the key `tools:`, not `allowed-tools:` (the wrong one is silently ignored).

## 2 · Shape of the SKILL.md body

- **At most 500 lines** (validator fails above). Detail used only sometimes moves to `references/<topic>.md` (a file over 300 lines needs a table of contents). A file the agent must read to work correctly is linked directly from SKILL.md. A reference file may link one level further only for optional detail or skippable examples (e.g. `thai-grammar` → `thai-examples`), because Claude often does not read second-level files completely. Work a machine can do goes in `scripts/` (run without reading into context); templates go in `templates/` or `assets/`.
- Same heading order in every core skill: a line saying which plugin it is in and that it follows `human-writing` → **the one rule** in a `>` box → **When to use / Not for** → a **use another / pairs with** table → steps or rules as numbered items → **one real example** (task · what was done · result) → **ตรวจก่อนส่ง** (pre-send checklist) → **sources**: every item has a link and date viewed, or the label `(ยังไม่ได้ตรวจ)`.
- **Declare before writing**: name · target size · 3 topics that will not be covered · a table of what lives in which file, separating knowledge (constant tables) · contract (file formats) · steps. Follow [`skill-structure`](references/skill-structure.md).
- **Do 1 real run of the task before drafting the skill** and keep the methods that actually worked, rather than letting the AI guess (reason cited from a course clip, not measured against a baseline). An AI-written draft must pass a human reader and evals before merging. Skills are small and narrow, a few per task. SKILL.md body sits in context every turn, so write it as standing instructions; after compaction Claude Code keeps about 5,000 tokens per skill (Claude Code docs via summary, 2026-11-04). Evidence and limits: [`skill-evaluation-evidence`](references/skill-evaluation-evidence.md).
- **Write as a recipe saying what to do, not a prohibition.** Measured 5 runs per wording: "don't retype the value in the order form" gave an average of 4.4 retyped values, worse than no rule at all, while the recipe "copy from the source file" gave 3.0 and was stable (superpowers 2026-06 · n=5 per wording · read via summary, not reproduced yourself). "Must open before doing" rules (tripwire) work well. If 2 wordings tie, pick the shorter. Test important wording with [`eval-loop-rules`](references/eval-loop-rules.md). Write direct commands with a 1-line reason, no shouting in capitals. A rule about words or tone goes in first as a `before → after` pair, and becomes a rule once it repeats twice (`session-lessons-to-skills` item 2).
- A new item that contradicts an old one → fix the old one, do not append. A skill that continues work from another names that skill and section instead of copying its content (example: `translate-th-en` points to `thai-grammar` section 7).
- Numbers that change over time (prices · rules · versions) carry the date checked, and go into `scripts/check/facts.json` if you want the validator to warn when stale.
- **A skill that costs money or creates things outside the machine** (renting cloud machines · GPU · purchases · APIs billed per call) needs all 4: (1) a money ceiling set by the user; the skill cannot raise it itself and must ask first (2) never delete or cancel the user's own things without asking (3) after deleting, re-check with a list command that they are really gone, then summarise the actual cost (4) say clearly that stop is not destroy, because a merely stopped item still bills for storage. Pair with `disable-model-invocation: true` when the model should not call it itself. Use the least-privilege key that is enough (e.g. no billing-edit rights) and check the environment by reporting only OK or MISSING, never printing the value (pattern from the course's VastAi_Skill lab, CWN2026).
  - GPU rental example from the course (numbers from a single run, not a standard): download cost per GB can exceed the GPU cost (11.8 GB × $0.029 = $0.34 vs GPU $0.16), so set a `inet_down_cost` ceiling when choosing a machine. Advertised network speed cannot be trusted (advertised 1391 Mbps, actual 1.8 MB/s): measure, then switch machines. The invoice total keeps growing after destroy: wait until it settles before summarising costs.

## 3 · Agents and playbooks

- **Command files and shared rules of a plugin**: a command file has 4 headings: Preflight · Plan · Commands · Verification. A plugin with 3 or more skills keeps shared rules in a single `INTENT.md`. A skill that calls an external command has a fallback for when the CLI is older than the skill. All templates are in [`skill-structure`](references/skill-structure.md).
- **agent** (`agents/<name>.md`): `name` matches the file name · `description` "Use when …" at most 120 characters · `tools:` · `model` · `effort` · must have a `## Writing` heading pointing to `human-writing` · says what it receives from the team lead, what it returns (result format as a markdown block) and what it must not do. See `agents/brainstormer.md` as the model.
- **playbook** (`skills/superuser/references/playbook-<name>.md` from `playbook-template.md`): has `## ขั้นตอน` as numbered items · every step ends with `ใคร:` (team lead · user · or a new agent) · must have a check step done by someone other than the doer, and the last check step comes after the last doing step · a check step is pure checking (check · prove · review · run · measure), not "check and fix" · no step that waits for a user reply mid-work (ask everything at the start, or write `(รอยืนยัน)` and log "รออนุมัติ") · an agent from another plugin is written "(ถ้าติดตั้ง plugin …)" with a fallback · do not use "ตัวเดิม" (the same one) unless carrying something hard to move.

## 4–8 · Detail moved to references

Must-not-skip points are in the list at the top. Full text, with all original rules, numbers and dates:

- **4 · Wiring a new skill** (files a new skill touches: SKILL.md · `SHARED_ONLY_IN_SUPERUSER` and `SHARED_SKILLS` lists in the same order · `file-map-th.json` + `sync-file-map.mjs` · `skill-router.json` · `triggers.md` · 3 `case.yaml` · CHANGELOG Unreleased bullet · `plugin.json` version · `build-targets.mjs` at release) and **5 · what the validator enforces** (frontmatter · name · description · 500-line body · tables · agent · playbook · plugin · shared files): [`wiring-and-validator`](references/wiring-and-validator.md).
- **6 · Evals**, 3 cases per new skill in `claude plugin eval` format (the suite must not die · `-guard` · default 3 runs per case reporting `WITH` `W/OUT` `Δ` · gate by pre-set numbers, not by eye): [`eval-cases`](references/eval-cases.md), with [`eval-format`](references/eval-format.md) · [`eval-loop-rules`](references/eval-loop-rules.md) · [`eval-audit`](references/eval-audit.md) · [`optimize-loop`](references/optimize-loop.md).
- **7 · Before/after test with fresh subagents** (red → green → close loopholes → record 2 rounds; run in an empty folder with other plugins hidden; judges must not know which version has the skill): [`before-after-testing`](references/before-after-testing.md).
- **8 · Reading `/skill-doctor`** (never-called flag · checklist when our skill is never called · "written in settings" is not "installed" · a "never ever" rule also goes into a hook or CLAUDE.md): [`skill-doctor`](references/skill-doctor.md).

## ตรวจก่อนส่ง

1. The validator passes and `node scripts/sync/sync-superuser.mjs --check` passes.
2. description starts with "Use when", at most 160, no overlap with siblings · the router matches real sentences.
3. Every file in the wiring list (section 4, [`wiring-and-validator`](references/wiring-and-validator.md)) touched · 3 case files · red/green round results recorded.
4. Every number and fact has a source + date, or was measured yourself + date + tool version · written from memory = `(ยังไม่ได้ตรวจ)` until measured · a line saying something was tested or checked has the date on the same line (the validator checks).
5. For an AI-written draft, a human has read it looking for places where the AI silently decided something just to make the test pass · after editing plugin content, `version` in `plugin.json` is bumped (manual check) · after installing, count the skills in a fresh chat.

## Sources

- Claude Code docs — [Skills](https://code.claude.com/docs/en/skills) · [Plugin evals](https://code.claude.com/docs/en/plugin-evals) · [Plugins reference](https://code.claude.com/docs/en/plugins-reference) · viewed 2026-10-23
- [anthropics/skills — skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator) (Apache-2.0 · reworded ideas: progressive disclosure · description as trigger · eval tasks must be hard · viewed 2026-10-23)
- [obra/superpowers — writing-skills](https://github.com/obra/superpowers/tree/main/skills/writing-skills) (MIT · red/green with subagents · close loopholes in excuses · description does not summarise steps · viewed 2026-10-23; before/after test text in [`before-after-testing`](references/before-after-testing.md) is reworded from it)
- This repo's rules — `scripts/check/validate-marketplace.mjs` (read 2026-10-23)
- Loop rules, judges and tools — [`eval-loop-rules`](references/eval-loop-rules.md) · [`eval-audit`](references/eval-audit.md) · skill and plugin structure — [`skill-structure`](references/skill-structure.md) (sources of each item are at the end of those files · viewed 2026-11-10) · superpowers (MIT) · docs/superpowers/specs/2026-06-10-positive-instruction-redesign-design.md · viewed 2026-11-10 → the "recipe saying what to do" rule
- Course CWN2026 evidence and papers (SkillsBench etc.) with limits and version of the numbers — [`skill-evaluation-evidence`](references/skill-evaluation-evidence.md) (viewed 2026-11-04)
- Optimise loop with an acceptance gate — adapted from course CWN2026 week 2, lesson Skill Optimization (`skill-optimizer`), by the repo owner · reworded 2026-11-11 → [`optimize-loop`](references/optimize-loop.md)
