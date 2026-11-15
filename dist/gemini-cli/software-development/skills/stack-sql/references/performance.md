# Making it fast — read the plan · indexes · paging · big jobs (full version)

Read this when a query is slow or you are adding an index · the short rules are in `SKILL.md` section 3

| engine | Command to see the real plan |
|---|---|
| SQL Server | `SET STATISTICS IO, TIME ON;` + open the Actual Execution Plan (in SQL Server Management Studio (SSMS) press `Ctrl+M`), then look at logical reads |
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) SELECT ...` beware that `ANALYZE` really runs the statement; for UPDATE/DELETE wrap it in `BEGIN ... ROLLBACK` |
| MySQL 8.0.18+ | `EXPLAIN ANALYZE SELECT ...` |

What to look for in a plan: a scan of a whole big table · expected vs actual row counts far apart (stale statistics) · key lookups repeated thousands of times · a sort or hash that spills to disk

- **sargable** means a condition that can use an index; never wrap an indexed column in a function
  - Wrong: `WHERE YEAR(created_at) = 2026` → right: `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'`
  - Wrong: `WHERE LOWER(email) = @e` → right: store email in lower case from the start, or make an index on an expression (PostgreSQL) or a computed column + index (SQL Server)
  - Wrong: `WHERE name LIKE '%สมชาย'` cannot use an index; if you must search the middle of a word, use full-text search
- **covering index**: put the columns the query reads in `INCLUDE (...)` (SQL Server · PostgreSQL 11+) so it need not go back to read the table; MySQL has no `INCLUDE`, so append them to the key instead
- Every index you add must answer which query it serves, because every index makes INSERT/UPDATE slower
- **For deep paging** use keyset instead of `OFFSET`, because `OFFSET 100000` must read and throw away 100,000 rows every time

```sql
-- keyset: ส่งค่าแถวสุดท้ายของหน้าก่อนมาเป็น parameter
SELECT id, created_at, total_amount
FROM orders
WHERE (created_at, id) < ($1, $2)   -- PostgreSQL ($1, $2) · MySQL (?, ?) · ส่งค่าแถวสุดท้ายของหน้าก่อน
ORDER BY created_at DESC, id DESC
LIMIT 50;
-- SQL Server: WHERE created_at < @c OR (created_at = @c AND id < @id) · ใช้ TOP (50)
```

- **N+1 from an Object-Relational Mapper (ORM)**: a loop that loads children one row at a time → 1 screen fires 201 queries; turn on the ORM's SQL log and count, then fix with `Include` (EF Core) · `selectinload` (SQLAlchemy) · `include` (Prisma)
- **parameter sniffing (SQL Server)**: a plan is built from the first value passed and reused with values that are distributed very differently → some customers are fast, some are 100 times slower
  - Fixes from lightest to heaviest: SQL Server 2022+ compatibility level 160 has Parameter Sensitive Plan optimization · `OPTION (RECOMPILE)` for queries that run rarely · `OPTIMIZE FOR` · force a plan through Query Store
  - Never fix it by clearing the plan cache of the whole server
- **statistics**: after loading a big batch of data, run `UPDATE STATISTICS dbo.orders` or, in PostgreSQL, `ANALYZE orders`
- **Big UPDATE/DELETE** in batches, for example 5,000 rows, because doing a million rows in one batch locks the whole table, grows the log, and takes just as long to roll back

```sql
-- SQL Server: ลบทีละ 5,000 แถวจนหมด
WHILE 1 = 1
BEGIN
    DELETE TOP (5000) FROM dbo.audit_logs WHERE created_at < @cutoff;
    IF @@ROWCOUNT < 5000 BREAK;
END
-- PostgreSQL: DELETE FROM audit_logs WHERE id IN (SELECT id FROM audit_logs WHERE created_at < $1 LIMIT 5000); วนจากแอปหรือ procedure
```

## Indexes for a small share of rows, and bloated tables (SKILL.md section 5)

```sql
-- PostgreSQL · partial index: index เฉพาะแถวที่ query กรองเสมอ
CREATE INDEX CONCURRENTLY ix_orders_pending ON orders (created_at) WHERE status = 'pending';
-- SQL Server · filtered index แบบเดียวกัน (query ต้องมี WHERE status = 'pending' ตรงตัว)
CREATE INDEX ix_orders_pending ON dbo.orders (created_at) WHERE status = 'pending';

-- PostgreSQL · ตารางบวมหลังลบหรืออัปเดตก้อนใหญ่
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables WHERE n_dead_tup > 10000 ORDER BY n_dead_tup DESC;
VACUUM (VERBOSE, ANALYZE) orders;          -- ปกติ
REINDEX INDEX CONCURRENTLY ix_orders_pending; -- index บวม

-- SQL Server · index แตกเป็นชิ้น
SELECT i.name, s.avg_fragmentation_in_percent, s.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('dbo.orders'), NULL, NULL, 'LIMITED') s
JOIN sys.indexes i ON i.object_id = s.object_id AND i.index_id = s.index_id
WHERE s.page_count > 1000;
ALTER INDEX ix_orders_pending ON dbo.orders REORGANIZE; -- < 30%
ALTER INDEX ix_orders_pending ON dbo.orders REBUILD WITH (ONLINE = ON); -- >= 30% (Enterprise/Azure)
```
