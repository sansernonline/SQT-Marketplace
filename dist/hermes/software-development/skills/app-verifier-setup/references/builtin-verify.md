# The `/verify` bundled with Claude Code — versus our app-verifier

Source: code.claude.com/docs/en/skills (read 2026-10-23) · the version numbers cited come from that page and were not tested on every version

## What Claude Code already has

- 3 bundled skills work together: `/run` opens and drives the app to show that a fix works · `/verify` builds and runs the app to confirm that the changed code does what it should, without falling back on tests or type checks · `/run-skill-generator` teaches the first 2 how to build and open this project
- `/verify` and `/code-review` run only when the user invokes them (since v2.1.215 — before that Claude could invoke them itself)
- `/run-skill-generator` runs from a clean environment, records what really works (install commands · env · launch script), and commits it as a project skill at `.claude/skills/run-<name>/` — run once per project, and again when the build method changes
- `/verify` can record its own recipe: if there is no recipe, it writes what works to `.claude/skills/verify/SKILL.md` at the project root (monorepo: in the package folder that was touched) · **a skill at the root named `verify` replaces the bundled `/verify`**
- A session that starts with a project skill named `verify` or `simplify` (or personal · organization · `.claude/commands/`) → the Claude Code commit command tells it to run before every commit, except when only docs or tests changed · bundled ones · plugin skills · skills from claude.ai do not count
- The whole set can be turned off with `disableBundledSkills` (leaving `/doctor`)

## What `app-verifier-setup` adds

| Ours | The bundled one lacks |
|---|---|
| A contract for in-app testing: `data-testid` · `data-ready` · reset endpoint behind a flag · a lockable clock (`clock`) | It drives the app from what it sees and does not force the app to prepare anchors |
| A feature map as data in the script `test/e2e/verify.*` that prints `PASS/FAIL` with expected and actual · 0 items checked = exit 1 | The recipe is in human language in SKILL.md |
| Proof that it catches wrong things (break 1 spot and it must FAIL) and a new `qa-tester` agent can really use it | — |
| Evidence of every run in `_to_delete/verify-runs/` · can drive native mobile · CLI · API, not just web | — |

## Decision

**A project working on a Claude Code that has the bundled `/verify` → `app-verifier-setup` creates a project skill at `.claude/skills/verify/SKILL.md` (named `verify`, not `verify-<project>`) in the recipe format that `/verify` records itself** — the first part is the build and open-the-app recipe (the same kind `/run-skill-generator` records), followed by ours: the command that runs `test/e2e/verify.*` · the link to the feature map · the testing contract · the prohibitions (the section "SKILL.md ของ verify skill ต้องมี", meaning "what the verify skill's SKILL.md must contain", in the main SKILL.md) · you get 2 things free: it replaces the bundled one, and it runs automatically before commit

- Before writing, read `.claude/skills/verify/SKILL.md` or `run-<name>/` that `/verify` already recorded (if any), then continue in the same format — the frontmatter fields the bundled one uses have not been checked against the docs (`ยังไม่ได้ตรวจ`, not yet checked)
- monorepo → place it in the package folder that was touched, following the bundled one's rule
- Codex · Gemini or Claude Code before v2.1.145 (`ยังไม่ได้ตรวจ` — not yet checked which version `/verify` started in) → use the old name `verify-<project>` in `.claude/skills/` · `.agents/skills/` · `skills/`
- `app-verifier-upkeep` maintains this one file only and does not create a nested `verify-<project>`
