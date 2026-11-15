# Wiring a new skill, and what the validator enforces

Moved from SKILL.md sections 4 and 5. Section numbers in the text below ("หัวข้อ 6", "หัวข้อ 4") refer to the old SKILL.md numbering: 4 = this wiring list, 6 = evals ([`eval-cases`](eval-cases.md)), 7 = before/after test ([`before-after-testing`](before-after-testing.md)).

## Wiring: one new skill touches all these files

| File | What it does |
|---|---|
| `plugins/<plugin>/skills/<name>/SKILL.md` | The skill itself |
| Shared items in `superuser` only: the `SHARED_ONLY_IN_SUPERUSER` list in `scripts/sync/sync-superuser.mjs` and the `SHARED_SKILLS` list in `scripts/build/build-targets.mjs` | Add the name in alphabetical order. The 2 lists must match. |
| `scripts/sync/file-map-th.json` → `node scripts/sync/sync-file-map.mjs` | A 1-line Thai description, then regenerate `docs/FILE-MAP.md` |
| `plugins/superuser/hooks/skill-router.json` | 1 pattern row · test: `node -e "const j=require('./plugins/superuser/hooks/skill-router.json');for(const s of ['ประโยคจริง 1','ประโยคที่ไม่เกี่ยว'])console.log(s,j.rules.filter(r=>new RegExp(r.pattern,'i').test(s)).flatMap(r=>r.skills))"` · **Edit JSON or YAML that contains a regex with Edit or with a script saved as a file, never through a Bash heredoc**, because `\\b` loses a backslash and becomes `\b`, which is backspace (it happened 5 times up to 2026-10-26). `sync-superuser --check` and the validator already catch control characters and `\s` in `"..."` YAML. |
| `plugins/superuser/skills/superuser/references/triggers.md` | A situation → skill row for the team lead to read |
| `plugins/<plugin>/evals/<name>-*/case.yaml` × 3 | Section 6 |
| `plugins/<plugin>/CHANGELOG.md`, section Unreleased | 1 bullet |
| `plugins/<plugin>/.claude-plugin/plugin.json`, field `version` | Raise the number every time you change plugin content. If you do not, `claude plugin update` says it is already latest even though the content changed (found in the course, 2026-11-04). The validator does not check this; do it by hand. |
| `node scripts/build/build-targets.mjs` | Rebuild `dist/` (do it when releasing, not every time) |

## Validator: what `node scripts/check/validate-marketplace.mjs` enforces

Run it before every delivery (`--warn` makes warnings count as failures · `--self-test` proves the checker can still catch problems). It exits 1 on any error, so it works as a CI gate. It checks:

1. frontmatter: `---` on the first line · a closing line · every line is `key: value` · a value that contains `: ` or starts with a special character must be quoted · no block scalars (`|` `>`)
2. `name`: present · matches the folder or file name · a-z 0-9 `-` · at most 64 characters · no anthropic/claude
3. `description`: present · starts with "Use when" or "ใช้เมื่อ" · at most 160 characters (warning at 150 · agents 120) · not so short that it fails to say when to use it · no `< >`
4. SKILL.md body at most 500 lines (warns when close) · a long file needs a table of contents · markdown tables: a header and a `|---|` row, and every row has as many cells as the header (a row broken off by a blank line is the most common bug)
5. agent: `tools:` not `allowed-tools:` · has a `## Writing` section pointing to `human-writing`
6. playbook: every rule in section 3 (agent and playbook rules, kept in SKILL.md section 3)
7. plugin: has `.claude-plugin/plugin.json` · `version` is x.y.z · description at most 500 characters (claude.ai rejects longer) · fully declared in `marketplace.json` and README · `mcpServers` pinned to `<package>@x.y.z`
8. shared items: `sync-superuser --check` and `sync-prompt-rules --check` match the source · names in `skill-router.json` exist · deprecated terms (`scripts/check/deprecated-terms` inside the validator) do not linger · values in `facts.json` still match the files
