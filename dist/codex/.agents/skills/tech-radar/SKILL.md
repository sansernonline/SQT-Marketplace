---
name: tech-radar
description: Use weekly to catch up on what changed in the libraries, frameworks and tools the user follows. Short radar report — what changed, what matters, what to ignore — from official release notes and changelogs, not social media.
---

# Tech Radar

One weekly pass over what you follow, filtered to what matters.

## Steps

1. **Radar list** — the user's tracked projects (from `radar.md`; create on first run with their stack, max ~15 entries)
2. **Sweep** — for each project, pull the latest release notes / changelog from official sources; note version, date, and breaking changes
3. **Triage into three buckets**:
   - **Act** — affects the user's projects; concrete upgrade or fix steps
   - **Know** — worth understanding; one-paragraph plain-language summary
   - **Skip** — everything else; listed by title only so nothing feels hidden
4. **Write** the radar report to `radar/reports/YYYY-Www.md`

## Worked example — one weekly report

```markdown
# Radar 2026-W41 (6–12 Oct)

## Act
- **Node.js 20 → end of life** (date from nodejs.org release schedule) — our 2 services still on 20.
  Steps: bump `.nvmrc` and the CI image to 22 LTS, run tests, deploy staging. Owner: me, by 24 Oct.
- **Library X 4.0** — breaking: `config.load()` now async. Affects `api/settings.ts`. Pin to 3.x until migrated.

## Know
- **PostgreSQL 18** — new async I/O for some reads; matters when we upgrade next year. Source: release notes, dated.

## Skip
- Framework Y 2.3.1 (patch), Tool Z 0.9 (beta)
```

(Versions above are illustrative — every real entry carries the version and date from the official source.)

## Templates

The `radar.md` tracking list and the report skeleton are in [references/radar-templates.md](references/radar-templates.md).

## Rules

- Official release notes and changelogs only; blog summaries are pointers, not sources
- Breaking changes go first, always
- One page maximum — a radar you do not read is worse than none
- Monthly: prune the radar list; entries nobody acted on in three months leave the list
