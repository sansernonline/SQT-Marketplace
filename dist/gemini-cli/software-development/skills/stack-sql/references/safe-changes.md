# Changing data safely — engine comparison table and examples (full version)

Read this when writing a data-fix script, an upsert or an ALTER TABLE · the short rules are in `SKILL.md` item 4

| Topic | SQL Server | PostgreSQL | MySQL (InnoDB) |
|---|---|---|---|
| Default isolation | Lock-based READ COMMITTED. Azure SQL Database already has Read Committed Snapshot Isolation (RCSI) on | READ COMMITTED (reads from a snapshot, does not block writers) | REPEATABLE READ |
| A rerunnable upsert | `UPDATE`, then `INSERT ... WHERE NOT EXISTS` in a transaction with `UPDLOCK, HOLDLOCK` | `INSERT ... ON CONFLICT (...) DO UPDATE` | `INSERT ... ON DUPLICATE KEY UPDATE` |
| Create an index without locking the table | `WITH (ONLINE = ON)`, Enterprise only (including 2025) | `CREATE INDEX CONCURRENTLY`, but it cannot run inside a transaction | `ALGORITHM=INPLACE, LOCK=NONE` |

- If readers often block writers in SQL Server, consider turning on `READ_COMMITTED_SNAPSHOT ON`. It adds load on tempdb, so test first.
- To prevent deadlocks: every piece of code touches tables in the same order, keep transactions as short as possible, and never wait on an external API while holding a transaction.
- Every script must be rerunnable (`principle-safe-to-rerun`): `IF NOT EXISTS` · `CREATE INDEX IF NOT EXISTS` (PostgreSQL) · `CREATE OR ALTER` (SQL Server)
- Before a command that deletes or edits a lot of data: back up the affected tables, or confirm that the latest backup can really be restored, and write down the way back before running.
- Count the expected rows first, then check before `COMMIT`:

```sql
BEGIN TRAN;
UPDATE dbo.orders SET status = 'cancelled'
WHERE status = 'pending' AND created_at < @cutoff;
IF @@ROWCOUNT <> @expected
BEGIN ROLLBACK; THROW 50001, 'จำนวนแถวไม่ตรงกับที่นับไว้', 1; END
COMMIT;
-- PostgreSQL: in a DO block use GET DIAGNOSTICS n = ROW_COUNT; if it does not match → RAISE EXCEPTION
```

- `ALTER TABLE` on a big table:
  - PostgreSQL asks for an `ACCESS EXCLUSIVE` lock and waits for long queries still running. While it waits, every new query queues behind it too, so set `SET lock_timeout = '5s'` and retry.
  - PostgreSQL 11+ can add a column with a constant default instantly, but changing a column type rewrites the whole table.
  - SQL Server can add a `NOT NULL` column with a default instantly only on Enterprise. Other editions must write every row.
  - To change a type or move data, use expand-and-contract per `database-design`.
