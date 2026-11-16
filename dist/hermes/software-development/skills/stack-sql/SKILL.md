---
name: stack-sql
description: Use when writing or reviewing SQL queries
---

# stack · SQL — write queries that are correct, fast, and change data safely

> **The one rule:** a query that has never run against a realistic amount of data is not finished

## Use when
- Writing, reviewing or tuning SQL (SQL Server · PostgreSQL · MySQL), or changing data with a script.

Not for: table design, naming, data types, expand-and-contract migrations → `database-design` · Excel/CSV → `data-import-export` · Thai dates and sorting in the app → `i18n-and-locale`.

## Steps
1. **Know the database first.** Engine and version: `SELECT @@VERSION` (SQL Server; also `SERVERPROPERTY('Edition')`, many features are Enterprise-only) · `SELECT version()` (PostgreSQL) · `SELECT VERSION()` (MySQL). Find what runs migrations (`Migrations/` EF Core · `db/migration/V1__*.sql` Flyway · Liquibase `changelog` · `alembic/` · `prisma/migrations/` · `sql/`) and use that tool; never add a second one or change the schema by hand. Check server collation and time zone (`SERVERPROPERTY('Collation')` · `SHOW timezone`).
2. **Never run anything on production**; prepare the commands for a person to approve (`principle-proceed-on-reversible-work`). Use a local or sandbox database with row count close to real (100 rows hides every speed problem); if none, generate mock data so volume and value distribution are close to real.
3. **Write correct queries:**

   | Topic | Do this | Trap |
   |---|---|---|
   | Values from users | Always a parameter | String concatenation → SQL injection |
   | Columns | Full column names | `SELECT *` pulls too much, breaks on a new column, blocks covering index |
   | NULL | `IS NULL` · `NOT EXISTS` | `= NULL` never true · `NOT IN (subquery)` with one NULL → 0 rows |
   | JOIN | Count rows before and after | Join the 1-to-many side then `SUM` → doubled totals; sum before the join |
   | GROUP BY | Every non-aggregate column in it | MySQL with `ONLY_FULL_GROUP_BY` off → random value |
   | Division | `CAST(a AS decimal(18,4)) / b`, guard `NULLIF(b, 0)` | SQL Server and PostgreSQL: `5/2 = 2`; MySQL: `2.5000` |
   | Data types | Parameter of the same type as the column | SQL Server sends `nvarchar` against `varchar` → `CONVERT_IMPLICIT` → full scan |
   | Date range | `>= start AND < end` | `BETWEEN '2026-01-01' AND '2026-01-31'` drops the 31st after midnight |
   | Time zone | Store UTC, convert to Asia/Bangkok on display (SQL Server `AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'` · PostgreSQL `AT TIME ZONE 'Asia/Bangkok'` on `timestamptz`) | Thai time with no offset → 7 hours off when merging |
   | Buddhist Era year | Always store Common Era (ค.ศ.), convert on display | Storing 2569 breaks age, sorting, export |
   | Money | `decimal(19,4)` · `numeric(19,4)` | `float` · `real` → 0.1 + 0.2 ≠ 0.3 |
   | Sorting Thai names | SQL Server `Thai_100_CI_AS` · PostgreSQL `COLLATE "th-TH-x-icu"` | General collation → leading vowels (เ แ โ ใ ไ) sort wrong silently |

   A Thai collation is not on every server; check before choosing (commands in [`references/snippets.md`](references/snippets.md)).
4. **Make it fast by reading the real plan on near-real data, never guessing.** Conditions sargable (no function around an indexed column) · every index can say which query it serves · deep paging uses keyset · count N+1 from the ORM log · big UPDATE/DELETE in batches. Commands per engine, keyset example, batches, parameter sniffing: [`references/performance.md`](references/performance.md).
5. **Change data safely.** Scripts can be rerun · back up before a big change · count rows first and check before `COMMIT` · upsert in the engine's own form · touch tables in the same order (deadlocks) · `ALTER TABLE` on a big table needs `lock_timeout`. Isolation levels, upsert, non-locking index creation, row-count checks: [`references/safe-changes.md`](references/safe-changes.md).
6. **Avoid the usual traps** (`MERGE` without `HOLDLOCK` · triggers with business rules · cursors · `NOLOCK` → use RCSI · collation mismatch in joins · gaps in ids · partial-index candidates · bloat after big deletes): [`references/traps.md`](references/traps.md).
7. **Test** against a real database of the production kind, never SQLite or in-memory (NULL, collation, locks differ). Fresh database every run with Testcontainers and seed script; stored procedures use tSQLt (SQL Server) or pgTAP (PostgreSQL). Check row counts and values: NULL · midnight date edges · Thai names · fractional money. Run a new migration on a production-like copy with near-real volume, time it, watch the locks. For a bug, write the failing test first (`principle-fix-root-cause`); framework → `testing-standards`.
8. **Security.** 1 app, 1 database user with only needed permissions; never `sa` · `postgres` · `root`, and migrations run as a separate user. Dynamic SQL with user values: pass values as parameters, choose table or column names from an allowlist and quote them (`sp_executesql` · `QUOTENAME` · plpgsql `format('%I')` in [`references/snippets.md`](references/snippets.md)). Several companies in one table → consider row-level security (SQL Server `CREATE SECURITY POLICY` · PostgreSQL `CREATE POLICY`; the table owner bypasses unless `FORCE ROW LEVEL SECURITY`). Do not pull personal data columns unless used; Dynamic Data Masking is not access control (`pdpa-compliance`). Changes to important data leave a trace of who (`audit-trail`). Injection and permissions → `principle-secure-by-default`.

## Check before done
- [ ] Every outside value is a parameter · no `SELECT *`.
- [ ] Checked NULL · half-open date ranges · division · parameter types match the columns.
- [ ] Looked at the real plan on near-real data, noted logical reads or time before/after.
- [ ] Scripts can be rerun and big data goes in batches (`principle-safe-to-rerun`).
- [ ] Transaction + row counts checked before `COMMIT` · the way back written and a backup confirmed.
- [ ] A test runs against the same kind of database as production.

## References
- [`references/performance.md`](references/performance.md) — open when reading a plan, paging, batching, parameter sniffing, bloat commands
- [`references/safe-changes.md`](references/safe-changes.md) — open when changing data, upsert, isolation, creating an index on a live table
- [`references/snippets.md`](references/snippets.md) — open for collation checks and dynamic-SQL examples
- [`references/traps.md`](references/traps.md) — open when a query behaves oddly or during review
