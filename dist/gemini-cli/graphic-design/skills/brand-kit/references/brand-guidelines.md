# Brand guidelines — the full brand guidelines document

The long part of the "write it as a document" section in `SKILL.md` · use it when an organisation or team needs a full manual: voice, key messages, work-approval rules, file storage, or needs colours synced into tokens.

> **The one rule:** brand guidelines must be one file, `docs/brand-guidelines.md`, that every person and every agent reads from one place · the colours and fonts in it are the source, and the token file follows them, not the other way round.

Copied and adapted from ui-ux-pro-max-skill (MIT · commit `b7d5353` · viewed 2026-11-05) · the original English text is kept unchanged in `data/upstream/` · licence at `data/upstream/LICENSE`

## Choose the right job

| Job | Use |
|---|---|
| Small shop that wants a brand kit readable in 5 minutes (4 logo versions, colours by role, Thai fonts) | `SKILL.md` section Workflow |
| Organisation or team that needs a full manual: voice, key messages, work-approval rules, file storage | This file |
| Read existing code and summarise it into tokens | `ui-craft` → `design_tokens.py` (plugin `software-development`) |
| Write three-layer tokens and generate CSS | `design-system` (plugin `software-development`) |
| Check the contrast of a colour pair | The example table in `SKILL.md` |

## Steps

1. **Start from the template** `templates/brand-guidelines-starter.md` → copy it to `docs/brand-guidelines.md` and fill in the brand's real information · information not yet available gets `(รอยืนยัน)` (pending confirmation), never made up.
2. **Fill in one section at a time** by the table below · read the source file only for the section you are working on.
3. **Colours and fonts are numbers that can be checked** · choose Thai fonts by `thai-fonts.md`, and do not apply the upstream's English font examples to Thai work.
4. **Sync into tokens** (when there is an app or website): `node scripts/sync-brand-to-tokens.cjs` → gives `assets/design-tokens.json` · it creates `design-tokens.css` automatically if skill `design-system` is installed alongside, and if not, the script warns and writes only the JSON · if the project already has tokens or a `:root`, the script stops and reports, and does not overwrite (`--force` only for files it synced itself last time).
5. **Check the work before sending:** `node scripts/validate-asset.cjs <file>` (file name, size, type) · `node scripts/extract-colors.cjs <image>` compares the image's colours with the palette · `node scripts/inject-brand-context.cjs` prints a brand summary to paste into an agent's prompt.

All 4 scripts are in `scripts/` of skill `brand-kit`, written in Node, installing no extra packages and making no network connection · they read and write files relative to the folder they run in (the project root), not the skill folder.

## Sections and source files

| Section | File in `data/upstream/` |
|---|---|
| Voice | `voice-framework.md` |
| Key messages | `messaging-framework.md` |
| Visual identity | `visual-identity.md` · `logo-usage-rules.md` |
| Colours and type | `color-palette-management.md` · `typography-specifications.md` |
| Work files and approval | `asset-organization.md` · `approval-checklist.md` |
| Consistency check | `consistency-checklist.md` |
| Change the brand and sync everywhere | `update.md` |
| Document structure | `brand-guideline-template.md` |

## Limits to know

- The upstream is written in English and its examples are SaaS-style blue-purple · use it as a skeleton only, real colours come from the brand (`design-gate/no-ai-look` item 1)
- `update.md` is a command from the original ClaudeKit (`/brand update`), which our marketplace does not have yet, so follow the steps in the file by hand
- There is no logo or icon generator — the owner chose not to use work an agent draws itself, so always ask for reference examples first (`icon-design`)

## Check before sending

1. `docs/brand-guidelines.md` has no value that did not come from the brand owner (where unknown, use `(รอยืนยัน)`)
2. Every text/background colour pair passes 4.5:1 (normal text)
3. If tokens were synced, open `assets/design-tokens.json` and compare the colours with the document once

## Sources

- nextlevelbuilder/ui-ux-pro-max-skill `.claude/skills/brand` · MIT · commit `b7d5353` · viewed 2026-11-05 · files in `data/upstream/` `scripts/` `templates/` copied without changes
