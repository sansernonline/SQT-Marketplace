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
