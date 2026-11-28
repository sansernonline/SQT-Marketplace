# Cards — work that cannot be called done until a machine says so

Open this when a task has 2 or more pieces that each need proof, or when work runs unattended. One card = one piece with its own files and its own checks. `scripts/card.mjs` runs the checks and keeps the evidence, so "done" comes from the evidence file, not from the agent's report.

Idea adapted from Super Agent Framework (Bellero-Advanced/super-agent-framework, MIT, read 2026-11-28): cards with allowed files, done-when commands, evidence JSON and size caps. Code written fresh for this plugin.

## Files

All under `<project>/.claude/superuser/`:

| File | Holds | Written by |
|---|---|---|
| `cards/<id>.md` | one card: frontmatter + free notes | the lead (or `friction.mjs draft`) |
| `evidence/<id>.json` | start commit · each command's exit code and output tail · changed files · line counts · reasons | `card.mjs` only |
| `evidence/reviews/<id>.json` | one entry per review round (pass/fail · kinds · note) | `card.mjs review` only |

## Card format

```
---
id: T-01
title: Sign-in shows a clear error for a wrong password
size: M                 # S | M | L
depends: [T-00]
touch: [src/auth/**, test/auth/**]
dont_touch: [src/auth/crypto/**]
done_when:
  - npm test -- auth
  - node tools/check.mjs
---
Notes for the worker.
```

`done_when` lines are commands that exit 0 only when the piece is right. Not only code: a document card can run `validate-marketplace.mjs`, a render-and-compare script, or `thai_tells.py`. A line you cannot write as a command means the piece needs a human check; put that in the review instead.

## The loop

1. The lead writes the cards. `card.mjs next --parallel` lists the cards that can run at the same time (dependencies done, no overlapping `touch`).
2. `card.mjs start <id>` — records the start commit and which files were already dirty, so old changes are not blamed on this card.
3. The worker edits only files that match `touch`.
4. `card.mjs verify <id>` — runs every `done_when` command, then fails the card if a file outside `touch` or inside `dont_touch` changed, or if it changed more than 2 times the size cap. Over the cap but under 2 times → warning; the reviewer decides or the lead splits the card.
5. A fresh reviewer checks the card. The lead records the round: `card.mjs review <id> pass` or `card.mjs review <id> fail --kind spec-mismatch,missing-test --note "..."`. A fail reopens the card; the worker fixes it and runs verify again.
6. `card.mjs status --write docs/plan/STATE.md` writes the status table from evidence; paste or link it in "รับงานต่อ" instead of typing statuses. `--check` works in CI only if `.claude/superuser/cards/` and `evidence/` are committed; most projects ignore `.claude/superuser/`, so run `--check` locally before the hand-off instead.
7. `card.mjs stats` counts review failures by kind; a kind that keeps coming back goes to `learn-loop/repeated-mistakes-to-checks`.

A card with no `done_when` line never passes: write at least one command.

Give up a card: `card.mjs abandon <id> --reason "..."`.

## Cards in parallel lanes

Each lane is its own worktree (`git-and-review/scripts/lane.mjs` in plugin `software-development`), but the cards and evidence stay in the main folder, so the lead sees one set. The Stop gate guards the lead's session in the main folder; a worker's session inside a lane does not see it, so the lead runs `card.mjs status` before closing a wave. Run a lane's card from the lane like this:

```
node card.mjs start T-05  --root <lane folder> --state <main folder>/.claude/superuser
node card.mjs verify T-05 --root <lane folder> --state <main folder>/.claude/superuser
```

`--root` is where git and the commands run; `--state` (read relative to the current folder) is where `cards/`, `evidence/` and `config.json` live (default `<root>/.claude/superuser`). `merge-queue.mjs` ignores `.claude/superuser/` when it checks that the main folder is clean.

## Size caps

Lines changed (added + removed), code and tests counted apart:

| Size | Code | Tests |
|---|---|---|
| S | 100 | 200 |
| M | 300 | 600 |
| L | 800 | 1600 |

Values set by us, not measured (รอยืนยัน · agent: ปรับจาก `card.mjs stats` หลังใช้ 20 การ์ด) · override with `"card_caps": {"S": [100, 200], ...}` in `.claude/superuser/config.json`.

## Stop gate

When a project has `evidence/`, the Stop hook blocks the end of the session once per stop while a card touched in the last 24 hours is `doing` or `failed`; a second stop in a row goes through (Claude Code lets a Stop hook block only once), so the gate is a reminder the lead cannot miss, not a lock. If this session did not work on those cards, write the skip line. Verify it, abandon it, or write the line `ข้ามการ์ด: <reason>` in the final answer. Turn the gate off with `"card_gate": false` in `config.json` modules.

## Commands

| Command | Does |
|---|---|
| `card.mjs start <id> [--restart]` | begin a card (dependencies must be done) |
| `card.mjs verify <id> [--timeout <sec>]` | run the checks, write evidence, exit 0 pass · 1 fail |
| `card.mjs review <id> pass\|fail [--kind a,b] [--note text]` | record a review round |
| `card.mjs abandon <id> --reason <text>` | give up a card |
| `card.mjs status [--write <file>] [--check <file>]` | status table computed from evidence |
| every command `--root <dir> --state <dir>` | run in a lane while keeping cards and evidence in the main folder |
| `card.mjs next [--parallel]` | the next ready card, or the set that can run together |
| `card.mjs stats` | review failures by kind |

Software projects add: `spec-to-code-loop/scripts/spec-matrix.mjs` (every scenario has a test) as a `done_when` line · `test-automation/scripts/test-lock.mjs` around heavy tests · `test-automation/scripts/culprit.mjs` when the suite breaks · `git-and-review/scripts/lane.mjs` and `merge-queue.mjs` for parallel cards (all in plugin `software-development`).
