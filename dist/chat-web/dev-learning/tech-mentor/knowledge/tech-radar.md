# skill: tech-radar

Use when catching up weekly on changes in followed libraries, frameworks and tools. Act, know, skip report from official release notes and changelogs.

# Tech Radar

Once a week, check what you follow and keep only what matters.

## Steps

1. **Radar list** — the projects the user tracks, from `radar.md`. On the first run, create it from their stack, about 15 entries at most
2. **Sweep** — for each project, get the latest release notes or changelog from official sources. Note the version, date and breaking changes
3. **Sort into 3 groups**:
   - **Act** — affects the user's projects. Give concrete upgrade or fix steps
   - **Know** — worth understanding. Give a 1-paragraph plain-language summary
   - **Skip** — everything else. List by title only, so nothing feels hidden
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

- Use official release notes and changelogs only. Blog summaries can point you there, but they are not sources
- Breaking changes go first, always
- 1 page at most — a radar you do not read is worse than none
- Monthly: prune the radar list. Remove entries nobody acted on in 3 months


## reference: radar-templates.md

# Radar templates

## `radar.md` — what is tracked (maximum ~15 entries)

```markdown
| Project | Why I follow it | Used in | Official source (release notes / changelog URL) | Last version seen | Last acted |
|---|---|---|---|---|---|
| Node.js | runtime | api, worker | https://nodejs.org/en/blog/release | | |
| | | | | | |
```

## Report skeleton — `radar/reports/YYYY-Www.md`

```markdown
# Radar YYYY-Www (<date range>)

## Act  (breaking changes first)
- **<project> <version>** (<release date>) — <what changed> → affects <file/service>.
  Steps: <1-3 steps>. Owner/date: <>.

## Know
- **<project> <version>** — <one paragraph, plain language>. Source: <url>

## Skip
- <project> <version> (patch / beta / not used)

## Radar list changes
- Added: — · Removed (no action in 3 months): —
```
