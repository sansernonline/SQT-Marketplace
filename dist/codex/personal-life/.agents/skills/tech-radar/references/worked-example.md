# Worked example · tech-radar

```markdown
# Radar 2026-W41 (5–11 Oct)

## Act
- **Node.js 20 is past end of life** (check the date and the current long-term support (LTS) release on nodejs.org release schedule) — our 2 services still on 20.
  Steps: bump `.nvmrc` and the continuous integration (CI) image to the current LTS (read it from the schedule), run tests, deploy staging. Owner: me, by 24 Oct.
- **Library X 4.0** — breaking: `config.load()` now async. Affects `api/settings.ts`. Pin to 3.x until migrated.

## Know
- **PostgreSQL 18** — new async I/O for some reads; matters when we upgrade next year. Source: release notes, dated.

## Skip
- Framework Y 2.3.1 (patch), Tool Z 0.9 (beta)
```

(Versions above are illustrative — every real entry carries the version and date from the official source.)
