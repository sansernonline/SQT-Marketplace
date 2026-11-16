# Common SQL traps · stack-sql

Open when a query behaves oddly, or when reviewing SQL for the usual mistakes. Example commands for the last two traps are in [performance.md](performance.md).

- `MERGE` (SQL Server) has several bugs, and without `HOLDLOCK` 2 sessions insert duplicates → separate `UPDATE` + `INSERT`, or `MERGE ... WITH (HOLDLOCK)` with a test
- A trigger hides business rules and breaks on multi-row inserts → keep rules in app code; use triggers only for audit · a cursor/row-by-row loop → a set-based statement
- `WITH (NOLOCK)` reads uncommitted data, rows go missing or repeat → turn on Read Committed Snapshot Isolation (RCSI) instead · building SQL by string concatenation → parameters
- A collation mismatch in a join → set them equal on the column (putting `COLLATE` in the query stops it using the index)
- Ids are not always consecutive (identity jumps · a sequence does not go back on rollback) → document numbers that must have no gaps are issued by yourself in a counter table
- A timestamp with no time zone → PostgreSQL `timestamptz` · SQL Server `datetime2` agreed to be UTC, or `datetimeoffset`
- A query that always filters a small share of rows (`WHERE status = 'pending'` · `deleted_at IS NULL`) but the index covers every row → the index is big and the planner does not pick it → put that condition into the index itself: PostgreSQL `CREATE INDEX ... WHERE status = 'pending'` · SQL Server filtered index `CREATE INDEX ... WHERE status = 'pending'` (the query must write the same condition for it to be used · idea from supabase/agent-skills · MIT)
- After deleting or updating many rows, queries get slower though the plan did not change → table and index bloat (dead tuples · split pages) → in PostgreSQL look at `pg_stat_user_tables.n_dead_tup` then `VACUUM (ANALYZE)` or `REINDEX CONCURRENTLY` · in SQL Server look at `sys.dm_db_index_physical_stats` then `ALTER INDEX ... REORGANIZE` (below 30%) or `REBUILD` · check this before blaming the query
