---
name: stack-sql
description: Use when writing or reviewing SQL queries
---

# stack · SQL — write queries that are correct, fast, and change data safely

> **The one rule:** a query that has never run against a realistic amount of data is not finished

Table design, naming, data types, and expand-and-contract migrations → `database-design`

## 1 · Getting started: know the database before writing the first line

- engine and version: `SELECT @@VERSION` (SQL Server) · `SELECT version()` (PostgreSQL) · `SELECT VERSION()` (MySQL) · on SQL Server also check `SERVERPROPERTY('Edition')`, because many features exist only in Enterprise
- what the repo runs migrations with: `Migrations/` (EF Core) · `db/migration/V1__*.sql` (Flyway) · Liquibase `changelog` · `alembic/` · `prisma/migrations/` · raw scripts in `sql/`
- the server's collation and time zone: `SERVERPROPERTY('Collation')` · `SHOW timezone`

- Use the migration tool the repo already uses; never add a second one and never change the schema by hand outside the tool
- Never run anything on production; prepare the commands for a person to approve instead (see `principle-proceed-on-reversible-work`)
- Use a local or sandbox database whose row count is close to real (a 100-row table hides every speed problem); if you have none, generate mock data with a script so the volume and value distribution are close to real

## 2 · Write queries that are correct

| Topic | Do this | Trap |
|---|---|---|
| Values from users | Always pass as a parameter | Concatenating strings → SQL injection |
| Columns | Write the full column names | `SELECT *` → pulls too much · a new column breaks code · cannot use a covering index |
| NULL | `IS NULL` · `NOT EXISTS` | `= NULL` is never true · `NOT IN (subquery)` with a single NULL → 0 rows |
| JOIN | Count rows before and after the join | Join on the 1-to-many side then `SUM` → doubled totals; fix by summing before the join |
| GROUP BY | Every non-aggregate column must be in `GROUP BY` | MySQL with `ONLY_FULL_GROUP_BY` off → silently picks a random value |
| Division | `CAST(a AS decimal(18,4)) / b` and guard against divide by 0 with `NULLIF(b, 0)` | SQL Server and PostgreSQL give `5/2 = 2`, while MySQL gives `5/2 = 2.5000` |
| Mismatched data types | A parameter of the same type as the column | SQL Server sends `nvarchar` to compare with a `varchar` column → `CONVERT_IMPLICIT` → scans the whole table |
| Date range | `>= start AND < end` (half-open) | `BETWEEN '2026-01-01' AND '2026-01-31'` → drops all of the 31st after midnight |
| time zone | Store UTC, convert to Asia/Bangkok when displaying | Storing Thai time with no offset → merging data across systems is off by 7 hours |
| Buddhist Era (พ.ศ.) year | Always store Common Era (ค.ศ.), convert when displaying | Storing 2569 → age calculation, sorting and export all break |
| Money | `decimal(19,4)` · `numeric(19,4)` | `float` · `real` → 0.1 + 0.2 does not equal 0.3 |
| Sorting Thai names | SQL Server `Thai_100_CI_AS` · PostgreSQL `COLLATE "th-TH-x-icu"` | A general collation → leading vowels (เ แ โ ใ ไ) sort wrong with no error |

Convert UTC to Thai time when displaying: SQL Server `AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'` · PostgreSQL `AT TIME ZONE 'Asia/Bangkok'` (a `timestamptz` column)

- A Thai collation is not on every server, so check before choosing (commands in [`references/snippets.md`](references/snippets.md)) · showing Thai dates and accepting Buddhist Era years from a form → `i18n-and-locale`

## 3 · Make it fast: read the real plan, do not guess

Commands to see the real plan by engine · what to look for in a plan · keyset example · deleting in batches · parameter sniffing fixes step by step → [`references/performance.md`](references/performance.md)

- Short rules: look at the real plan on data close to real volume, do not guess · conditions must be sargable (do not wrap an indexed column in a function) · every index must answer which query it serves · deep paging uses keyset · count N+1 from the Object-Relational Mapper (ORM) log · big UPDATE/DELETE goes in batches — details and examples are only in [`references/performance.md`](references/performance.md)

## 4 · Change data safely

A table of isolation levels · upsert · creating an index without locking the table, by engine, with examples that check row counts → [`references/safe-changes.md`](references/safe-changes.md)

- Short rules: scripts can be rerun · back up before changing a big batch of data · count rows first and check before `COMMIT` · upsert uses the engine's own form · touch tables in the same order to prevent deadlocks · `ALTER TABLE` on a big table needs `lock_timeout` set — details and examples are only in [`references/safe-changes.md`](references/safe-changes.md)

## 5 · Common traps

- `MERGE` (SQL Server) has several bugs, and without `HOLDLOCK` 2 sessions insert duplicates → separate `UPDATE` + `INSERT`, or `MERGE ... WITH (HOLDLOCK)` with a test
- A trigger hides business rules and breaks on multi-row inserts → keep rules in app code; use triggers only for audit · a cursor/row-by-row loop → a set-based statement
- `WITH (NOLOCK)` reads uncommitted data, rows go missing or repeat → turn on Read Committed Snapshot Isolation (RCSI) instead · building SQL by string concatenation → parameters (section 7)
- A collation mismatch in a join → set them equal on the column (putting `COLLATE` in the query stops it using the index)
- Ids are not always consecutive (identity jumps · a sequence does not go back on rollback) → document numbers that must have no gaps are issued by yourself in a counter table
- A timestamp with no time zone → PostgreSQL `timestamptz` · SQL Server `datetime2` agreed to be UTC, or `datetimeoffset`
- A query that always filters a small share of rows (`WHERE status = 'pending'` · `deleted_at IS NULL`) but the index covers every row → the index is big and the planner does not pick it → put that condition into the index itself: PostgreSQL `CREATE INDEX ... WHERE status = 'pending'` · SQL Server filtered index `CREATE INDEX ... WHERE status = 'pending'` (the query must write the same condition for it to be used · idea from supabase/agent-skills · MIT)
- After deleting or updating many rows, queries get slower though the plan did not change → table and index bloat (dead tuples · split pages) → in PostgreSQL look at `pg_stat_user_tables.n_dead_tup` then `VACUUM (ANALYZE)` or `REINDEX CONCURRENTLY` · in SQL Server look at `sys.dm_db_index_physical_stats` then `ALTER INDEX ... REORGANIZE` (below 30%) or `REBUILD` · check this before blaming the query

Example commands for both of these → [`references/performance.md`](references/performance.md)

## 6 · Tests

- Test queries against a real database of the same kind as production; never use SQLite or in-memory in place of SQL Server/PostgreSQL, because NULL, collation and lock behavior differ
- Start a fresh database every run with Testcontainers and load seed data with a script · logic in stored procedures uses tSQLt (SQL Server) or pgTAP (PostgreSQL)
- Check both row counts and values: cases with NULL · date ranges right at the midnight edge · Thai names · money amounts with fractions
- Run a new migration on a copy of a production-like schema with data close to real volume, then time it and watch the locks
- To fix a bug, write a test that fails first, then fix it (`principle-fix-root-cause`); for the general test framework see `testing-standards`

## 7 · Database-specific security

- 1 app, 1 database user, with only the permissions it uses; the app must never use `sa` · `postgres` · `root`, and the user that runs migrations must be separate from the user the app uses at run time
- For dynamic SQL with values from users, pass the values as parameters, and choose table or column names from an allowlist and then quote them

Examples of `sp_executesql` · `QUOTENAME` · plpgsql `format('%I')` → [`references/snippets.md`](references/snippets.md)

- If the data of several companies is in one table, consider row-level security: SQL Server `CREATE SECURITY POLICY` · PostgreSQL `CREATE POLICY` (the table owner bypasses the policy unless `FORCE ROW LEVEL SECURITY`)
- Personal data columns (national ID number · phone number · address) are not pulled unless used; SQL Server's Dynamic Data Masking helps hide values on display but is not access control; for details see `pdpa-compliance`
- Changes to important data must leave a trace of who did it (`audit-trail`)

## 8 · Check before sending

- [ ] Every outside value is a parameter · no `SELECT *`
- [ ] Checked NULL · half-open date ranges · division · parameter types match the columns
- [ ] Looked at the real plan on near-real data, noted logical reads or time before/after · every new index can say which query it serves
- [ ] Scripts can be rerun and big data goes in batches
- [ ] Transaction + check row counts before `COMMIT` · wrote the way back and confirmed a backup exists
- [ ] There is a test that runs against the same kind of database as production

## 9 · Connecting to other skills

Table design and expand-and-contract migrations → `database-design` · rerunnable scripts → `principle-safe-to-rerun` · Excel/CSV → `data-import-export` · who changed what → `audit-trail` · injection and permissions → `principle-secure-by-default` · Thai Buddhist Era dates, Thai sorting → `i18n-and-locale` · connection string → `config-and-secrets` · migrations in the pipeline → `cicd-and-release`
