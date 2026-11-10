# ให้เร็ว — อ่าน plan · index · แบ่งหน้า · งานก้อนใหญ่ (ฉบับเต็ม)

อ่านเมื่อ query ช้าหรือกำลังเพิ่ม index · กฎย่ออยู่ใน `SKILL.md` ข้อ 3

| engine | คำสั่งดู plan จริง |
|---|---|
| SQL Server | `SET STATISTICS IO, TIME ON;` + เปิด Actual Execution Plan (SQL Server Management Studio (SSMS) กด `Ctrl+M`) แล้วดู logical reads |
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) SELECT ...` ระวังว่า `ANALYZE` รันคำสั่งจริง ถ้าเป็น UPDATE/DELETE ให้ห่อด้วย `BEGIN ... ROLLBACK` |
| MySQL 8.0.18+ | `EXPLAIN ANALYZE SELECT ...` |

สิ่งที่ต้องดูใน plan: scan ทั้งตารางที่ใหญ่ · จำนวนแถวที่คาด vs ได้จริงต่างกันมาก (statistics เก่า) · key lookup ซ้ำหลายพันครั้ง · sort หรือ hash ที่ล้นลง disk

- **sargable** คือเงื่อนไขที่ใช้ index ได้ ห้ามครอบคอลัมน์ที่มี index ด้วย function
  - ผิด: `WHERE YEAR(created_at) = 2026` → ถูก: `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'`
  - ผิด: `WHERE LOWER(email) = @e` → ถูก: เก็บ email ตัวเล็กตั้งแต่แรก หรือทำ index บน expression (PostgreSQL) หรือ computed column + index (SQL Server)
  - ผิด: `WHERE name LIKE '%สมชาย'` ใช้ index ไม่ได้ ถ้าต้องค้นกลางคำให้ใช้ full-text search
- **covering index**: ใส่คอลัมน์ที่ query อ่านไว้ใน `INCLUDE (...)` (SQL Server · PostgreSQL 11+) จะได้ไม่ต้องย้อนไปอ่านตาราง ส่วน MySQL ไม่มี `INCLUDE` ให้ต่อท้ายใน key แทน
- ทุก index ที่เพิ่มต้องตอบได้ว่ารับ query ไหน เพราะ index ทำให้ INSERT/UPDATE ช้าลงทุกตัว
- **แบ่งหน้าลึก** ใช้ keyset แทน `OFFSET` เพราะ `OFFSET 100000` ต้องอ่านทิ้ง 100,000 แถวทุกครั้ง

```sql
-- keyset: ส่งค่าแถวสุดท้ายของหน้าก่อนมาเป็น parameter
SELECT id, created_at, total_amount
FROM orders
WHERE (created_at, id) < ($1, $2)   -- PostgreSQL ($1, $2) · MySQL (?, ?) · ส่งค่าแถวสุดท้ายของหน้าก่อน
ORDER BY created_at DESC, id DESC
LIMIT 50;
-- SQL Server: WHERE created_at < @c OR (created_at = @c AND id < @id) · ใช้ TOP (50)
```

- **N+1 จาก Object-Relational Mapper (ORM)**: loop แล้วโหลดลูกทีละแถว → 1 หน้าจอยิง 201 query ให้เปิด log SQL ของ ORM แล้วนับ แล้วแก้ด้วย `Include` (EF Core) · `selectinload` (SQLAlchemy) · `include` (Prisma)
- **parameter sniffing (SQL Server)**: plan ถูกสร้างจากค่าแรกที่ส่งมา แล้วใช้ซ้ำกับค่าที่กระจายต่างกันมาก → บางลูกค้าเร็ว บางลูกค้าช้า 100 เท่า
  - ทางแก้เรียงจากเบาไปหนัก: SQL Server 2022+ compatibility level 160 มี Parameter Sensitive Plan optimization · `OPTION (RECOMPILE)` กับ query ที่รันไม่บ่อย · `OPTIMIZE FOR` · บังคับ plan ผ่าน Query Store
  - ห้ามแก้ด้วยการลบ plan cache ทั้ง server
- **statistics**: หลังโหลดข้อมูลก้อนใหญ่ให้รัน `UPDATE STATISTICS dbo.orders` หรือ PostgreSQL `ANALYZE orders`
- **UPDATE/DELETE ก้อนใหญ่** ทำทีละชุด เช่น 5,000 แถว เพราะถ้าทำชุดเดียวล้านแถวจะ lock ทั้งตาราง log โต และ rollback นานเท่ากัน

```sql
-- SQL Server: ลบทีละ 5,000 แถวจนหมด
WHILE 1 = 1
BEGIN
    DELETE TOP (5000) FROM dbo.audit_logs WHERE created_at < @cutoff;
    IF @@ROWCOUNT < 5000 BREAK;
END
-- PostgreSQL: DELETE FROM audit_logs WHERE id IN (SELECT id FROM audit_logs WHERE created_at < $1 LIMIT 5000); วนจากแอปหรือ procedure
```

## index เฉพาะแถวส่วนน้อย และตารางบวม (SKILL.md ข้อ 5)

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
