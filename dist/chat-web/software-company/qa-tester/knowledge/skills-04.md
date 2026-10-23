# skill: stack-sql

Use when writing or reviewing SQL queries, procedures or data-change scripts (SQL Server, PostgreSQL, MySQL).

# stack · SQL — เขียน query ให้ถูก เร็ว และเปลี่ยนข้อมูลได้ปลอดภัย

> **กฎข้อเดียว:** query ที่ยังไม่เคยรันกับข้อมูลจำนวนเท่าของจริง ถือว่ายังไม่เสร็จ

ออกแบบตาราง ตั้งชื่อ ชนิดข้อมูล และ migration แบบ expand-and-contract → `database-design`

## 1 · เริ่มงาน: รู้จักฐานข้อมูลก่อนเขียนบรรทัดแรก

- engine และรุ่น: `SELECT @@VERSION` (SQL Server) · `SELECT version()` (PostgreSQL) · `SELECT VERSION()` (MySQL) · SQL Server ดู `SERVERPROPERTY('Edition')` ด้วย เพราะหลายความสามารถมีเฉพาะ Enterprise
- repo รัน migration ด้วยอะไร: `Migrations/` (EF Core) · `db/migration/V1__*.sql` (Flyway) · Liquibase `changelog` · `alembic/` · `prisma/migrations/` · สคริปต์ดิบใน `sql/`
- collation และ time zone ของ server: `SERVERPROPERTY('Collation')` · `SHOW timezone`

- ใช้เครื่องมือ migration ที่ repo ใช้อยู่ ห้ามเพิ่มตัวที่ 2 และห้ามแก้ schema ด้วยมือนอกเครื่องมือ
- ห้ามรันอะไรกับ production ให้เตรียมคำสั่งให้คนอนุมัติแทน (ดู `principle-proceed-on-reversible-work`)
- ใช้ฐานข้อมูล local หรือ sandbox ที่จำนวนแถวใกล้ของจริง (ตาราง 100 แถวซ่อนปัญหาความเร็วทุกอย่าง) ไม่มีก็สร้างข้อมูลจำลองด้วยสคริปต์ให้จำนวนและการกระจายค่าใกล้จริง

## 2 · เขียน query ให้ถูก

| เรื่อง | ทำแบบนี้ | กับดัก |
|---|---|---|
| ค่าจากผู้ใช้ | ส่งเป็น parameter เสมอ | ต่อ string → SQL injection |
| คอลัมน์ | เขียนชื่อคอลัมน์ครบ | `SELECT *` → ดึงเกิน · คอลัมน์ใหม่ทำโค้ดพัง · ใช้ covering index ไม่ได้ |
| NULL | `IS NULL` · `NOT EXISTS` | `= NULL` ไม่เคยจริง · `NOT IN (subquery)` ที่มี NULL 1 ตัว → ได้ 0 แถว |
| JOIN | นับแถวก่อนและหลัง join | join ฝั่ง 1-ต่อ-หลาย แล้ว `SUM` → ยอดเบิ้ล แก้โดยรวมยอดก่อน join |
| GROUP BY | ทุกคอลัมน์ที่ไม่ใช่ aggregate ต้องอยู่ใน `GROUP BY` | MySQL ที่ปิด `ONLY_FULL_GROUP_BY` → สุ่มค่าให้เงียบ ๆ |
| หาร | `CAST(a AS decimal(18,4)) / b` และกันหาร 0 ด้วย `NULLIF(b, 0)` | SQL Server และ PostgreSQL ได้ `5/2 = 2` ส่วน MySQL ได้ `5/2 = 2.5000` |
| ชนิดข้อมูลไม่ตรง | parameter ชนิดเดียวกับคอลัมน์ | SQL Server ส่ง `nvarchar` ไปเทียบคอลัมน์ `varchar` → `CONVERT_IMPLICIT` → scan ทั้งตาราง |
| ช่วงวันที่ | `>= start AND < end` (ครึ่งเปิด) | `BETWEEN '2026-01-01' AND '2026-01-31'` → หลุดทั้งวันที่ 31 หลังเที่ยงคืน |
| time zone | เก็บ UTC แล้วแปลงเป็น Asia/Bangkok ตอนแสดง | เก็บเวลาไทยไม่มี offset → รวมข้อมูลข้ามระบบแล้วเพี้ยน 7 ชั่วโมง |
| ปี พ.ศ. | เก็บ ค.ศ. เสมอ แล้วแปลงตอนแสดง | เก็บ 2569 → คำนวณอายุ เรียง และ export พังหมด |
| เงิน | `decimal(19,4)` · `numeric(19,4)` | `float` · `real` → 0.1 + 0.2 ไม่เท่ากับ 0.3 |
| เรียงชื่อไทย | SQL Server `Thai_100_CI_AS` · PostgreSQL `COLLATE "th-TH-x-icu"` | collation ทั่วไป → สระหน้า (เ แ โ ใ ไ) เรียงผิดโดยไม่มี error |

แปลง UTC เป็นเวลาไทยตอนแสดง: SQL Server `AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'` · PostgreSQL `AT TIME ZONE 'Asia/Bangkok'` (คอลัมน์ `timestamptz`)

- collation ไทยไม่มีทุก server ตรวจก่อนเลือก (คำสั่งใน [`references/snippets.md`](references/snippets.md)) · แสดงวันที่ไทยและรับปี พ.ศ. จากฟอร์ม → `i18n-and-locale`

## 3 · ให้เร็ว: อ่าน plan จริง ไม่เดา

คำสั่งดู plan จริงแยกตาม engine · สิ่งที่ต้องดูใน plan · ตัวอย่าง keyset · ลบทีละชุด · ทางแก้ parameter sniffing ทีละขั้น → [`references/performance.md`](references/performance.md)

- กฎย่อ: ดู plan จริงบนข้อมูลจำนวนใกล้ของจริง ไม่เดา · เงื่อนไขต้อง sargable (ไม่ครอบคอลัมน์ที่มี index ด้วย function) · ทุก index ตอบได้ว่ารับ query ไหน · แบ่งหน้าลึกใช้ keyset · นับ N+1 จาก log ของ Object-Relational Mapper (ORM) · UPDATE/DELETE ก้อนใหญ่ทำทีละชุด — รายละเอียดและตัวอย่างอยู่ใน [`references/performance.md`](references/performance.md) ที่เดียว

## 4 · เปลี่ยนข้อมูลอย่างปลอดภัย

ตาราง isolation · upsert · สร้าง index ไม่ล็อกตาราง แยกตาม engine พร้อมตัวอย่างตรวจจำนวนแถว → [`references/safe-changes.md`](references/safe-changes.md)

- กฎย่อ: สคริปต์รันซ้ำได้ · backup ก่อนแก้ข้อมูลก้อนใหญ่ · นับแถวก่อนแล้วตรวจก่อน `COMMIT` · upsert ใช้แบบของ engine · แตะตารางเรียงลำดับเดียวกันกัน deadlock · `ALTER TABLE` ตารางใหญ่ต้องตั้ง `lock_timeout` — รายละเอียดและตัวอย่างอยู่ใน [`references/safe-changes.md`](references/safe-changes.md) ที่เดียว

## 5 · กับดักที่เจอบ่อย

- `MERGE` (SQL Server) มี bug หลายตัว และไม่ใส่ `HOLDLOCK` แล้ว 2 session insert ซ้ำ → `UPDATE` + `INSERT` แยก หรือ `MERGE ... WITH (HOLDLOCK)` พร้อม test
- trigger ซ่อนกฎธุรกิจและพังเมื่อ insert หลายแถว → กฎอยู่ในโค้ดแอป trigger ใช้กับ audit เท่านั้น · cursor/loop ทีละแถว → คำสั่งแบบ set-based
- `WITH (NOLOCK)` อ่านของที่ยังไม่ commit แถวหายหรือซ้ำ → เปิด Read Committed Snapshot Isolation (RCSI) แทน · ต่อ string เป็น SQL → parameter (ข้อ 7)
- collation ไม่ตรงตอน join → ตั้งให้ตรงที่คอลัมน์ (ใส่ `COLLATE` ใน query ทำให้ไม่ใช้ index)
- id ไม่เรียงต่อเนื่องเสมอ (identity กระโดด · sequence ไม่ย้อนเมื่อ rollback) → เลขเอกสารที่ห้ามขาดออกเองในตารางนับเลข
- timestamp ไม่มี time zone → PostgreSQL `timestamptz` · SQL Server `datetime2` ที่ตกลงว่าเป็น UTC หรือ `datetimeoffset`
- query ที่กรองแถวส่วนน้อยเสมอ (`WHERE status = 'pending'` · `deleted_at IS NULL`) แต่ index ครอบทุกแถว → index ใหญ่และ planner ไม่หยิบ → ใส่เงื่อนไขนั้นลงใน index เลย: PostgreSQL `CREATE INDEX ... WHERE status = 'pending'` · SQL Server filtered index `CREATE INDEX ... WHERE status = 'pending'` (query ต้องเขียนเงื่อนไขตรงกันถึงจะใช้ได้ · แนวคิดจาก supabase/agent-skills · MIT)
- ลบหรืออัปเดตแถวจำนวนมากแล้ว query ช้าลงทั้งที่ plan ไม่เปลี่ยน → ตารางและ index บวม (dead tuple · page แตก) → PostgreSQL ดู `pg_stat_user_tables.n_dead_tup` แล้ว `VACUUM (ANALYZE)` หรือ `REINDEX CONCURRENTLY` · SQL Server ดู `sys.dm_db_index_physical_stats` แล้ว `ALTER INDEX ... REORGANIZE` (ต่ำกว่า 30%) หรือ `REBUILD` · ตรวจข้อนี้ก่อนโทษ query

ตัวอย่างคำสั่งทั้ง 2 ข้อ → [`references/performance.md`](references/performance.md)

## 6 · test

- test query กับฐานข้อมูลจริงชนิดเดียวกับ production ห้ามใช้ SQLite หรือ in-memory แทน SQL Server/PostgreSQL เพราะพฤติกรรม NULL collation และ lock ต่างกัน
- เปิดฐานข้อมูลใหม่ทุกรอบด้วย Testcontainers แล้วใส่ข้อมูลตั้งต้นด้วยสคริปต์ · logic ใน stored procedure ใช้ tSQLt (SQL Server) หรือ pgTAP (PostgreSQL)
- ตรวจทั้งจำนวนแถวและค่า: กรณีมี NULL · ช่วงวันที่ตรงขอบเที่ยงคืน · ชื่อไทย · ยอดเงินมีเศษ
- migration ใหม่ให้รันขึ้นบนสำเนา schema ที่เหมือน production พร้อมข้อมูลจำนวนใกล้จริง แล้วจับเวลาและดู lock
- แก้ bug ให้เขียน test ที่ fail ก่อน แล้วค่อยแก้ (`principle-fix-root-cause`) ส่วนกรอบ test ทั่วไปดู `testing-standards`

## 7 · ความปลอดภัยเฉพาะฐานข้อมูล

- 1 แอป 1 user ฐานข้อมูล ให้สิทธิ์เท่าที่ใช้ แอปห้ามใช้ `sa` · `postgres` · `root` และ user ที่รัน migration ต้องแยกจาก user ที่แอปใช้ตอนทำงาน
- dynamic SQL ที่มีค่าจากผู้ใช้ให้ส่งค่าเป็น parameter ส่วนชื่อตารางหรือคอลัมน์ให้เลือกจาก allowlist แล้ว quote

ตัวอย่าง `sp_executesql` · `QUOTENAME` · plpgsql `format('%I')` → [`references/snippets.md`](references/snippets.md)

- ถ้ามีข้อมูลหลายบริษัทในตารางเดียว ให้พิจารณา row-level security: SQL Server `CREATE SECURITY POLICY` · PostgreSQL `CREATE POLICY` (เจ้าของตารางข้าม policy ได้ ถ้าไม่ `FORCE ROW LEVEL SECURITY`)
- คอลัมน์ข้อมูลส่วนบุคคล (เลขบัตรประชาชน · เบอร์โทร · ที่อยู่) ไม่ดึงถ้าไม่ใช้ ส่วน Dynamic Data Masking ของ SQL Server ช่วยซ่อนตอนแสดง แต่ไม่ใช่การกันสิทธิ์ รายละเอียดดู `pdpa-compliance`
- การแก้ข้อมูลสำคัญต้องมีร่องรอยว่าใครทำ (`audit-trail`)

## 8 · รายการตรวจก่อนส่ง

- [ ] ทุกค่าจากภายนอกเป็น parameter · ไม่มี `SELECT *`
- [ ] ตรวจ NULL · ช่วงวันที่แบบครึ่งเปิด · หาร · ชนิด parameter ตรงกับคอลัมน์
- [ ] ดู plan จริงบนข้อมูลใกล้ของจริง จด logical reads หรือเวลาก่อน/หลัง · index ใหม่ทุกตัวบอกได้ว่ารับ query ไหน
- [ ] สคริปต์รันซ้ำได้ และข้อมูลก้อนใหญ่ทำทีละชุด
- [ ] transaction + ตรวจจำนวนแถวก่อน `COMMIT` · เขียนวิธีย้อนกลับและยืนยัน backup แล้ว
- [ ] มี test ที่รันกับฐานข้อมูลชนิดเดียวกับ production

## 9 · เชื่อมกับ skill อื่น

ออกแบบตารางและ migration แบบ expand-and-contract → `database-design` · สคริปต์รันซ้ำได้ → `principle-safe-to-rerun` · Excel/CSV → `data-import-export` · ใครแก้อะไร → `audit-trail` · injection และสิทธิ์ → `principle-secure-by-default` · วันที่ไทย พ.ศ. การเรียงไทย → `i18n-and-locale` · connection string → `config-and-secrets` · migration ใน pipeline → `cicd-and-release`


## reference: performance.md

# ให้เร็ว — อ่าน plan · index · แบ่งหน้า · งานก้อนใหญ่ (ฉบับเต็ม)

อ่านเมื่อ query ช้าหรือกำลังเพิ่ม index · กฎย่ออยู่ใน `SKILL.md` ข้อ 3

| engine | คำสั่งดู plan จริง |
|---|---|
| SQL Server | `SET STATISTICS IO, TIME ON;` + เปิด Actual Execution Plan (SQL Server Management Studio (SSMS) กด `Ctrl+M`) แล้วดู logical reads |
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) SELECT ...` ระวังว่า `ANALYZE` รันคำสั่งจริง ถ้าเป็น UPDATE/DELETE ให้ห่อด้วย `BEGIN ... ROLLBACK` |
| MySQL 8.0.18+ | `EXPLAIN ANALYZE SELECT ...` |

สิ่งที่ต้องดูใน plan: scan ทั้งตารางที่ใหญ่ · จำนวนแถวที่คาด vs ได้จริงต่างกันมาก (statistics เก่า) · key lookup ซ้ำหลายพันครั้ง · sort หรือ hash ที่ล้นลง disk

- **sargable** คือเงื่อนไขที่ใช้ index ได้ ห้ามครอบคอลัมน์ที่มี index ด้วย function
  - ❌ `WHERE YEAR(created_at) = 2026` → ✅ `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'`
  - ❌ `WHERE LOWER(email) = @e` → ✅ เก็บ email ตัวเล็กตั้งแต่แรก หรือทำ index บน expression (PostgreSQL) หรือ computed column + index (SQL Server)
  - ❌ `WHERE name LIKE '%สมชาย'` ใช้ index ไม่ได้ ถ้าต้องค้นกลางคำให้ใช้ full-text search
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


## reference: safe-changes.md

# เปลี่ยนข้อมูลอย่างปลอดภัย — ตารางเทียบ engine และตัวอย่าง (ฉบับเต็ม)

อ่านเมื่อเขียนสคริปต์แก้ข้อมูล upsert หรือ ALTER TABLE · กฎย่ออยู่ใน `SKILL.md` ข้อ 4

| เรื่อง | SQL Server | PostgreSQL | MySQL (InnoDB) |
|---|---|---|---|
| isolation เริ่มต้น | READ COMMITTED แบบ lock ส่วน Azure SQL Database เปิด Read Committed Snapshot Isolation (RCSI) ให้แล้ว | READ COMMITTED (อ่านจาก snapshot ไม่บล็อกคนเขียน) | REPEATABLE READ |
| upsert ที่รันซ้ำได้ | `UPDATE` แล้ว `INSERT ... WHERE NOT EXISTS` ใน transaction พร้อม `UPDLOCK, HOLDLOCK` | `INSERT ... ON CONFLICT (...) DO UPDATE` | `INSERT ... ON DUPLICATE KEY UPDATE` |
| สร้าง index ไม่ล็อกตาราง | `WITH (ONLINE = ON)` ใช้ได้เฉพาะ Enterprise (รวม 2025) | `CREATE INDEX CONCURRENTLY` แต่รันใน transaction ไม่ได้ | `ALGORITHM=INPLACE, LOCK=NONE` |

- ถ้า SQL Server มีคนอ่านบล็อกคนเขียนบ่อย ให้พิจารณาเปิด `READ_COMMITTED_SNAPSHOT ON` แต่จะเพิ่มภาระ tempdb จึงต้องทดสอบก่อน
- ป้องกัน deadlock: ทุกโค้ดแตะตารางเรียงลำดับเดียวกัน ทำ transaction ให้สั้นที่สุด และไม่รอ API ภายนอกขณะถือ transaction
- สคริปต์ทุกตัวต้องรันซ้ำได้ (`principle-safe-to-rerun`): `IF NOT EXISTS` · `CREATE INDEX IF NOT EXISTS` (PostgreSQL) · `CREATE OR ALTER` (SQL Server)
- ก่อนคำสั่งที่ลบหรือแก้ข้อมูลจำนวนมาก: backup ตารางที่โดน หรือยืนยันว่า backup ล่าสุด restore ได้จริง แล้วเขียนวิธีย้อนกลับไว้ก่อนรัน
- นับแถวที่คาดไว้ก่อน แล้วตรวจก่อน `COMMIT`:

```sql
BEGIN TRAN;
UPDATE dbo.orders SET status = 'cancelled'
WHERE status = 'pending' AND created_at < @cutoff;
IF @@ROWCOUNT <> @expected
BEGIN ROLLBACK; THROW 50001, 'จำนวนแถวไม่ตรงกับที่นับไว้', 1; END
COMMIT;
-- PostgreSQL: ใน DO block ใช้ GET DIAGNOSTICS n = ROW_COUNT; ไม่ตรง → RAISE EXCEPTION
```

- `ALTER TABLE` บนตารางใหญ่:
  - PostgreSQL ขอ lock `ACCESS EXCLUSIVE` แล้วรอ query ยาวที่ค้างอยู่ ระหว่างรอ query ใหม่ทุกตัวก็ต่อคิวด้วย จึงต้องตั้ง `SET lock_timeout = '5s'` แล้ว retry
  - PostgreSQL 11+ เพิ่มคอลัมน์ที่มี default คงที่ได้ทันที แต่การเปลี่ยนชนิดคอลัมน์จะเขียนตารางใหม่ทั้งก้อน
  - SQL Server เพิ่มคอลัมน์ `NOT NULL` พร้อม default ทำได้ทันทีเฉพาะ Enterprise ส่วน edition อื่นต้องเขียนทุกแถว
  - ถ้าเปลี่ยนชนิดหรือย้ายข้อมูล ให้ทำแบบ expand-and-contract ตาม `database-design`


## reference: snippets.md

# ตัวอย่างโค้ดสั้น — เวลาไทย · dynamic SQL

กฎอยู่ใน `SKILL.md` ข้อ 2 และ 7

## แปลงเวลา UTC เป็นเวลาไทยตอนแสดง (ข้อ 2)

```sql
-- แปลงเวลา UTC เป็นเวลาไทยตอนแสดง
SELECT created_at AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'  -- SQL Server (ชื่อโซนแบบ Windows)
FROM dbo.orders;
SELECT created_at AT TIME ZONE 'Asia/Bangkok' FROM orders;                  -- PostgreSQL (คอลัมน์ timestamptz)
```

## dynamic SQL ที่ส่งค่าเป็น parameter (ข้อ 7)

```sql
-- SQL Server
EXEC sp_executesql N'SELECT id, name FROM dbo.customers WHERE email = @email',
                   N'@email nvarchar(320)', @email = @input;
-- ชื่อคอลัมน์: QUOTENAME(@column) หลังตรวจกับ allowlist
-- PostgreSQL ใน plpgsql
EXECUTE format('SELECT id, name FROM %I WHERE email = $1', tbl) USING p_email;
```

## ตรวจว่ามี collation ไทยหรือไม่ (ข้อ 2)

- PostgreSQL มี `th-TH-x-icu` เมื่อ server build ด้วย International Components for Unicode (ICU) ตรวจได้ด้วย `SELECT collname FROM pg_collation WHERE collname LIKE 'th%'`
- MySQL ตรวจ collation ไทยที่มีด้วย `SHOW COLLATION LIKE '%thai%'` ก่อนเลือก


---

# skill: api-conventions

Use when starting an API, adding endpoints or checking API consistency (URLs, paging, dates, ids).

# ข้อตกลงของ Application Programming Interface (API)

> **กฎข้อเดียว:** ตัดสินใจครั้งเดียว ใช้ทุก endpoint
> API ที่ทุก endpoint ทำเหมือนกัน แม้ "ไม่ค่อยถูกตามทฤษฎี" ใช้ง่ายกว่า
> API ที่แต่ละ endpoint ถูกต้องคนละแบบ เพราะแบบหลังฝั่งเรียกต้องเดาใหม่ทุกครั้ง

## เมื่อไหร่ใช้ skill นี้

- เริ่มออกแบบ API ตัวแรกของโปรเจกต์
- จะเพิ่ม endpoint ใน API เดิม และอยากให้เข้ากับของเดิม
- รีวิว API แล้วรู้สึกว่าแต่ละส่วนไม่เหมือนกัน
- ต้องตอบว่า "เปลี่ยนแบบนี้แล้ว client พังไหม"

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง ๆ ให้ครบ | command `/api-design` | แทน |
| health check, error envelope, graceful shutdown | `web-service-essentials` | แทน |
| ตาราง คอลัมน์ ความสัมพันธ์ | `database-design` | แทน |
| token, scope, สิทธิ์ | `auth-implementation-patterns` | แทน |
| correlation id ที่โผล่ใน error | `logging-standards` | คู่ |
| test สัญญาระหว่างระบบ | `testing-standards` | คู่ |
| บันทึกเหตุผลที่เลือกข้อตกลงนี้ | `adr-writer` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

**แม่แบบเอกสารข้อตกลงที่คัดลอกไปใช้ได้เลย** → `assets/API-CONVENTIONS.md`

---

## 1 · เอกสารข้อตกลงต้องมีจริง

วางไฟล์ `docs/API-CONVENTIONS.md` (แม่แบบอยู่ที่ `assets/API-CONVENTIONS.md`)
ทุกข้อในหน้านี้ที่ตัดสินใจแล้ว ให้เขียนลงไฟล์นั้น พร้อมวันที่และเหตุผลสั้น ๆ

> ข้อตกลงที่อยู่ในหัวคนใดคนหนึ่ง ไม่ใช่ข้อตกลง — คนที่เข้าทีมเดือนหน้าจะทำอีกแบบ

---

## 2 · ตั้งชื่อ URL

```
GET    /v1/orders                 รายการ
POST   /v1/orders                 สร้าง
GET    /v1/orders/{id}            รายตัว
PATCH  /v1/orders/{id}            แก้บางส่วน
PUT    /v1/orders/{id}            แทนที่ทั้งตัว
DELETE /v1/orders/{id}            ลบ
GET    /v1/orders/{id}/items      ทรัพยากรลูก
POST   /v1/orders/{id}/cancel     การกระทำที่ไม่ใช่ CRUD (Create, Read, Update, Delete)
```

| กฎ | ✅ | ❌ |
|---|---|---|
| คำนาม พหูพจน์ | `/orders` | `/getOrders`, `/order` |
| ตัวพิมพ์เล็ก ขีดกลาง | `/purchase-orders` | `/purchaseOrders`, `/purchase_orders` |
| ความลึกไม่เกิน 2 ชั้น | `/orders/{id}/items` | `/customers/{a}/orders/{b}/items/{c}/logs` |
| กริยาใช้เมื่อไม่ใช่ CRUD จริง ๆ | `POST /orders/{id}/cancel` | `POST /orders/cancelOrder` |

**การกระทำที่ไม่ใช่ CRUD** (อนุมัติ ยกเลิก ส่งซ้ำ) — ใช้ `POST /{resource}/{id}/{action}`
อย่าดัดให้เป็น `PATCH` ที่แก้ `status` เพราะการเปลี่ยนสถานะมักมีผลข้างเคียงมากกว่าการแก้ฟิลด์ทั่วไป

**วิธี `PATCH`:** เลือกแบบเดียวทั้งระบบ โดยแนะนำให้ส่งเฉพาะฟิลด์ที่แก้ (`merge patch`)
และต้องกำหนดให้ชัดว่า `null` แปลว่า "ล้างค่า" หรือ "ไม่แตะ" (ดูข้อ 6)

---

## 3 · versioning

| วิธี | ข้อดี | ข้อเสีย |
|---|---|---|
| **ใน path** `/v1/orders` | เห็นชัด ทดสอบง่าย แคชง่าย | URL เปลี่ยนตอนขึ้นเวอร์ชัน |
| ใน header `Accept: application/vnd.acme.v1+json` | URL คงที่ | มองไม่เห็นตอน debug ลืมส่งบ่อย |

> **เลือก path** ถ้าไม่มีเหตุผลเฉพาะ — ทุกคนเห็นเวอร์ชันได้จากบรรทัดเดียวใน log

**เปลี่ยนแบบไหนแล้วฝั่งเรียกพัง:**

| การเปลี่ยน | พังไหม |
|---|:--:|
| เพิ่ม endpoint ใหม่ | ไม่ |
| เพิ่มฟิลด์ **ที่ไม่บังคับ** ใน request | ไม่ |
| เพิ่มฟิลด์ใน response | ไม่* |
| เพิ่มค่า enum ใหม่ | **พัง** — client ที่ `switch` ครบทุกค่าจะเจอค่าที่ไม่รู้จัก |
| ลบ/เปลี่ยนชื่อฟิลด์ | **พัง** |
| เปลี่ยนชนิดข้อมูล (`"12"` → `12`) | **พัง** |
| ทำให้ฟิลด์ที่เคยไม่บังคับกลายเป็นบังคับ | **พัง** |
| เปลี่ยน HTTP status ที่คืนในกรณีเดิม | **พัง** |
| ทำให้กฎ validation เข้มขึ้น | **พัง** |

\* ต่อเมื่อบอกฝั่งเรียกไว้แต่แรกว่า "ฟิลด์ที่ไม่รู้จักให้ข้ามไป"
ข้อนี้ต้องเขียนไว้ใน `API-CONVENTIONS.md` ไม่ใช่หวังเอาเอง

**ขึ้นเวอร์ชันใหญ่เมื่อจำเป็นจริง** เพราะทุกเวอร์ชันที่ยังเปิดอยู่คือโค้ดอีกชุดที่ต้องดูแล

---

## 4 · pagination

**ทุก endpoint ที่คืนรายการต้องมี pagination ตั้งแต่วันแรก** ไม่มีข้อยกเว้น
รายการที่ "มีไม่กี่รายการหรอก" อีก 2 ปีจะมี 10,000 รายการ

| วิธี | ใช้เมื่อ | ข้อจำกัด |
|---|---|---|
| **cursor** `?limit=50&cursor=eyJ...` | ค่าเริ่มต้น · ข้อมูลเยอะ · มีข้อมูลเพิ่มระหว่างเปิดดู | กระโดดไปหน้า 7 ไม่ได้ |
| offset `?limit=50&offset=100` | ต้องมีเลขหน้าให้กด · ข้อมูลไม่เยอะ | ยิ่งหน้าลึกยิ่งช้า · ถ้ามีแถวแทรกระหว่างเปิดดู ข้อมูลจะซ้ำหรือหาย |

```jsonc
// GET /v1/orders?limit=2 → 200
{
  "data": [ { "id": "1042" }, { "id": "1041" } ],
  "page": {
    "limit": 2,
    "nextCursor": "eyJpZCI6MTA0MX0",   // null เมื่อหมดแล้ว
    "hasMore": true
  }
}
```

- ห่อรายการไว้ใน `data` เสมอ เพราะถ้าตอบเป็นอาเรย์เปล่า ๆ วันหลังจะเติมข้อมูลหน้าไม่ได้
- `limit` มีค่าเริ่มต้นและ**เพดานที่บังคับฝั่งเซิร์ฟเวอร์** (เช่น เริ่มต้น 20 สูงสุด 100)
- `totalCount` นับแพง จึงให้ขอเป็นตัวเลือก `?includeTotal=true` อย่านับทุกครั้ง
- **cursor ต้องทึบ** (ฝั่งเรียกห้ามแกะหรือประกอบเอง)

---

## 5 · filtering · sorting · ฟิลด์ที่ขอ

```
GET /v1/orders?status=confirmed&createdAt[gte]=2026-01-01&sort=-createdAt&fields=id,orderNo,total
```

| เรื่อง | ข้อตกลง |
|---|---|
| กรองค่าเท่ากับ | `?status=confirmed` |
| หลายค่า | `?status=confirmed,shipped` |
| ช่วง | `?createdAt[gte]=...&createdAt[lt]=...` |
| เรียง | `?sort=-createdAt,orderNo` — `-` คือมากไปน้อย |
| ค้นหาข้อความ | `?q=สมชาย` แยกจากการกรอง |
| เลือกฟิลด์ | `?fields=id,orderNo` |

- **รับเฉพาะฟิลด์ที่กำหนดไว้** ถ้ารับชื่อฟิลด์อะไรก็ได้ จะเกิดช่องโหว่ และ query ที่ไม่มี index
- พารามิเตอร์ที่ไม่รู้จัก ตอบ `400` ดีกว่าข้ามเงียบ ๆ ไม่งั้นฝั่งเรียกพิมพ์ผิดแล้วได้ข้อมูลผิดโดยไม่รู้ตัว

---

## 6 · รูปแบบข้อมูล

| ข้อมูล | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ชื่อฟิลด์ | `camelCase` ทั้งระบบ | `createdAt` |
| เวลา | RFC 3339 · UTC · ลงท้าย `Z` | `"2026-09-25T09:42:13.482Z"` |
| วันที่ล้วน | `YYYY-MM-DD` | `"2026-09-25"` |
| เงิน | ตัวเลขเป็น**สตริง** + สกุลเงินแยก | `{ "amount": "1250.00", "currency": "THB" }` |
| identifier | **สตริงเสมอ** | `"1042"` ไม่ใช่ `1042` |
| enum | `SCREAMING_SNAKE` หรือ `lower_snake` เลือกแบบเดียว | `"CONFIRMED"` |
| ระยะเวลา | วินาทีเป็นตัวเลข ตั้งชื่อให้รู้หน่วย | `"timeoutSeconds": 30` |
| ประเทศ / สกุลเงิน / ภาษา | ISO 3166 · ISO 4217 · BCP 47 | `"TH"` · `"THB"` · `"th-TH"` |

> 🚨 **id เป็นตัวเลขใน JSON คือระเบิดเวลา** — JavaScript เก็บจำนวนเต็มได้ปลอดภัยถึง 9,007,199,254,740,991
> `bigint` ที่เกินนั้นจะถูกปัดเศษเงียบ ๆ ตอน `JSON.parse` และถ้าจะเปลี่ยนเป็นสตริงทีหลังก็เป็น breaking change
>
> 🚨 **เงินเป็น float ใน JSON** — `1250.10` ที่ผ่าน 2 ภาษาโปรแกรมอาจกลายเป็น `1250.0999999999999`

**`null` กับ "ไม่มีฟิลด์" ต้องหมายถึงคนละอย่าง:**

- ใน response ฟิลด์ที่มีแต่ไม่มีค่าให้ส่ง `null` ไม่ตัดทิ้ง ฝั่งเรียกจะได้ไม่ต้องเช็ค 2 แบบ
- ใน `PATCH` ถ้าส่ง `{"note": null}` แปลว่าล้างค่า ถ้าไม่ส่งคีย์ `note` เลยแปลว่าไม่แตะ

**อาเรย์ว่างคือ `[]` ไม่ใช่ `null`** ฝั่งเรียกจะวนลูปได้เลย

---

## 7 · error

รูปแบบ error (RFC 9457 · `requestId` · `errors` แบบ array `{field, code, message}`) และตัวอย่างอยู่ที่ `web-service-essentials` ข้อ 2 ที่เดียว ใช้ตามนั้น
ที่ต้องตกลงเพิ่มคือ **error ระดับฟิลด์**:

- **`code` ให้โปรแกรมอ่าน · `message` ให้คนอ่าน** อย่าให้ฝั่งเรียกต้องเอาข้อความไปเขียนเงื่อนไข
- ชี้ตำแหน่งฟิลด์ด้วยเส้นทางเต็ม รวมดัชนีของอาเรย์
- **คืน error ครบทุกฟิลด์ในครั้งเดียว** ไม่ใช่ทีละตัว ผู้ใช้จะได้ไม่ต้องกดส่ง 5 รอบ
- ถ้ารองรับหลายภาษา ให้เลือกข้อความไทยหรืออังกฤษจาก `Accept-Language`

**เลือก status ให้ตรง:** `400` รูปแบบคำขอผิด · `401` ยังไม่ได้ยืนยันตัวตน · `403` ยืนยันแล้วแต่ไม่มีสิทธิ์ ·
`404` ไม่มีหรือไม่ให้รู้ว่ามี · `409` ชนกับสถานะปัจจุบัน · `422` รูปแบบถูกแต่ข้อมูลไม่ผ่านกฎ · `429` เรียกถี่เกิน

---

## 8 · เรียกซ้ำไม่เกิดผลซ้ำ และการแก้ชนกัน

### idempotency key (รหัสกำกับคำขอ — ส่งซ้ำแล้วไม่ทำงานซ้ำ)

**บังคับกับทุก `POST` ที่มีผลทางการเงินหรือส่งของออกไปข้างนอก**

```
POST /v1/payments
Idempotency-Key: 7f3c1e10-...        ← ฝั่งเรียกสร้าง เก็บไว้ใช้ตอน retry
```

- เซิร์ฟเวอร์เก็บ key คู่กับผลลัพธ์ไว้อย่างน้อย 24 ชั่วโมง
- key เดิมกับเนื้อหาเดิม ให้คืนผลเดิม ไม่ทำงานซ้ำ
- key เดิมแต่เนื้อหา**ต่าง** ให้ตอบ `422` ไม่ทำงานใหม่
- เครือข่ายขาดระหว่างรอคำตอบเป็นเรื่องปกติ ไม่ใช่กรณีพิเศษ ฝั่งเรียกจึง retry เสมอ

### แก้ชนกัน (optimistic concurrency)

```
GET   /v1/orders/1042        → 200  ETag: "v7"
PATCH /v1/orders/1042        If-Match: "v7"
                             → 200 ปกติ · 412 ถ้ามีคนแก้ไปก่อนแล้ว
```

ถ้าไม่มี คนที่กดบันทึกทีหลังจะทับงานของคนแรกโดยไม่มีใครรู้

---

## 9 · rate limit

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1758790000
Retry-After: 42                ← ต้องมีคู่กับ 429 เสมอ
```

ถ้า `429` ไม่มี `Retry-After` ฝั่งเรียกต้องเดาเอง และส่วนใหญ่เดาว่า "ลองใหม่ทันที"

---

## 10 · การเลิกใช้ endpoint

1. ประกาศล่วงหน้า พร้อมบอกว่าใช้อะไรแทน
2. ส่ง header ในทุก response ของ endpoint นั้น:
   ```
   Deprecation: @1790812800
   Sunset: Wed, 31 Dec 2026 23:59:59 GMT
   Link: <https://docs.acme.co/v2/orders>; rel="successor-version"
   ```
   `Deprecation` ตามมาตรฐาน Request for Comments (RFC) 9745 (มี.ค. 2025) ต้องเป็นวันที่แบบ `@<วินาที unix>` (ตัวอย่างนี้คือ 1 ต.ค. 2026 00:00 UTC) ไม่ใช่ `true` · ตรวจ 22 ต.ค. 2569
3. **ดูจาก log ว่ายังมีใครเรียกอยู่** แล้วติดต่อเขาตรง ๆ อย่ารอให้เงียบไปเอง
4. ปิดจริงหลังวันที่ประกาศ ไม่ใช่ก่อน

ระยะเวลาที่พอดี: API ภายในให้ 1 รอบ release ส่วน API ที่คนนอกใช้ให้อย่างน้อย 6 เดือน

---

## 11 · ตรวจก่อนปล่อย endpoint ใหม่

ไล่ทุกข้อกับ endpoint ที่เพิ่ม ตกข้อเดียวยังไม่ merge (แนวคิดจาก ECC api-design)

- [ ] URL เป็นคำนามพหูพจน์ตามข้อ 2 · อยู่ใต้เวอร์ชันตามข้อ 3 · ไม่มี `GET` ที่เปลี่ยนข้อมูล
- [ ] รายการทุกตัวมี pagination และเพดานขนาดหน้า (ข้อ 4) · filter และ sort ใช้ชื่อพารามิเตอร์เดียวกับ endpoint เดิม (ข้อ 5)
- [ ] วันที่ · id · เงิน อยู่ในรูปแบบของข้อ 6 · response ไม่ใช่ entity ของฐานข้อมูลตรง ๆ
- [ ] error ทุกตัวตาม `web-service-essentials` §2 และมี `code` คงที่ (ข้อ 7) · คำขอที่สร้างหรือจ่ายเงินรับ idempotency key · การแก้รับ `If-Match` (ข้อ 8)
- [ ] ระบุ auth และ rate limit (ข้อ 9) · อยู่ใน OpenAPI แล้ว และตัวอย่าง cURL ในเอกสารรันผ่านจริง
- [ ] มี contract test หรือ test ระดับ endpoint อย่างน้อย 1 กรณีสำเร็จ 1 กรณี error — ตรวจ response กับ OpenAPI ใน CI · Pact เมื่อผู้เรียกแยกทีม · `oasdiff breaking` ทุก PR: [`references/contract-testing.md`](references/contract-testing.md)

## 12 · Anti-patterns

- ❌ **`200 OK` พร้อม `{"success": false}`** — ตัวเฝ้าระบบและ log ทั้งหมดจะมองไม่เห็นว่าพัง
- ❌ **กริยาใน URL** — `/createOrder`, `/getOrderById`
- ❌ **รายการที่ไม่มี pagination** — วันหนึ่งจะคืนข้อมูล 50,000 แถวในครั้งเดียว
- ❌ **รูปแบบวันที่คนละแบบในแต่ละ endpoint** — เช่น `"25/09/2026"` ที่ไม่มีใครรู้ว่าวันหรือเดือนขึ้นก่อน
- ❌ **ส่ง entity ของฐานข้อมูลออกไปตรง ๆ** — เพิ่มคอลัมน์ทีไร API เปลี่ยนตามโดยไม่ตั้งใจ และเสี่ยงข้อมูลภายในหลุด
- ❌ **ชื่อฟิลด์ปนกัน** `created_at` กับ `updatedAt` ใน response เดียวกัน
- ❌ **`GET` ที่เปลี่ยนข้อมูล** — ตัวโหลดหน้าเว็บล่วงหน้าจะยิงเองโดยไม่มีใครกด
- ❌ **error message เปลี่ยนไปเรื่อย ๆ** โดยไม่มี `code` คงที่
- ❌ **ไม่มีเอกสาร** — OpenAPI ที่สร้างจากโค้ดจริง ดีกว่าเอกสารที่เขียนมือแล้วไม่ตรง


## reference: contract-testing.md

# Contract testing — OpenAPI คือสัญญา แล้วให้ CI ตรวจว่าของจริงตรง

เอกสาร `docs/API-CONVENTIONS.md` บอกกติกา · ไฟล์ OpenAPI บอกรูปร่างของแต่ละ endpoint · contract test คือสิ่งที่ทำให้ 2 อย่างนี้ไม่เป็นแค่เอกสาร

## 1 · OpenAPI เป็นสัญญา

- สร้างจากโค้ดจริง (annotation · decorator · generator ของ framework) แล้ว commit ไฟล์ที่ได้ — ไม่เขียนมือแยก · เมื่อ 2 ฝั่งต่างกัน ฝั่งโค้ดคือความจริง และ diff ในไฟล์คือสิ่งที่ reviewer เห็น
- ทุก response มี schema รวมถึง error (`web-service-essentials` §2) · ทุกฟิลด์มี `format` ของวันที่ · id · เงิน ตาม §6 ของ SKILL.md หลัก

## 2 · ตรวจ response กับ spec ใน CI (provider side)

| เครื่องมือ | ทำอะไร | licence | หมายเหตุ (ตรวจ 2026-10-23) |
|---|---|---|---|
| Schemathesis | อ่าน OpenAPI แล้วสร้าง request จาก schema ยิงใส่ service จริง ตรวจว่า response ตรง spec และไม่ 500 · `schemathesis run <url ของ openapi.json>` | MIT | ยิงจริง สร้างและลบข้อมูล → ชี้ไป dev หรือ staging เท่านั้น · Python |
| Prism (Stoplight) | `prism mock <spec>` ให้ frontend ใช้ก่อน backend เสร็จ · `prism proxy <spec> <upstream>` ตรวจ traffic จริงกับ spec | Apache-2.0 | Node ≥ 18.20 · โหมด proxy ใส่หน้า service ใน test environment ได้ |
| Dredd | ตรวจ API กับ API Blueprint / OpenAPI 2 (OpenAPI 3 ทดลอง) | MIT | **เลิกดูแลแล้ว** (archived 2024-11-08) — ไม่เริ่มใช้ใหม่ |

ค่าเริ่มของเรา: Schemathesis ใน job ของ CI หลัง service ขึ้นด้วยข้อมูลทดสอบ (reset endpoint จาก `app-verifier-setup`) · ล้ม = ไม่ merge

## 3 · Consumer-driven contract — เมื่อทีม frontend หรือผู้เรียกแยกจาก backend

- Pact (pact-foundation · MIT): ฝั่งผู้เรียกเขียน test ว่าใช้ request/response คู่ไหนบ้าง → ได้ไฟล์ pact → ฝั่ง provider รันตรวจกับไฟล์นั้นใน CI ของตัวเอง · provider เปลี่ยนส่วนที่ไม่มีใครใช้ได้โดย test ไม่พัง
- ใช้เมื่อ: ทีมคนละชุด ปล่อยคนละรอบ หรือมีผู้เรียกมากกว่า 1 ราย (mobile + web + partner) · ทีมเดียวทำทั้ง 2 ฝั่ง → ข้อ 2 พอ
- ไฟล์ pact แลกกันผ่าน Pact Broker หรือ commit ลง repo ของ provider — ตกลงที่เดียวใน `API-CONVENTIONS.md`

## 4 · เช็ค breaking change ทุก PR

- `oasdiff breaking <spec เดิม> <spec ใหม่>` (Apache-2.0 · Go · มี Docker image) รายงานเฉพาะการเปลี่ยนที่ทำให้ผู้เรียกเดิมพัง: ลบ endpoint หรือฟิลด์ · ฟิลด์กลายเป็น required · type เปลี่ยน · enum หาย
- ใน CI: spec เดิม = ของ branch หลัก · spec ใหม่ = ของ PR · เจอ breaking → ต้องขึ้นเวอร์ชันใหม่ตาม §3 หรือ deprecate ตาม §10 ของ SKILL.md หลัก — ไม่ใช่ปิด check
- เพิ่มฟิลด์ optional · เพิ่ม endpoint · เพิ่มค่า enum ที่ผู้เรียกไม่ switch ตาย = ไม่ breaking

## ตรวจก่อนส่ง

- [ ] OpenAPI อยู่ใน repo และสร้างจากโค้ด · CI ล้มถ้าไฟล์ไม่ตรงโค้ด
- [ ] Schemathesis (หรือเทียบเท่า) รันกับ service ที่ขึ้นด้วยข้อมูลทดสอบ · `oasdiff breaking` รันทุก PR
- [ ] ผู้เรียกแยกทีม → มี pact อย่างน้อย 1 ไฟล์ต่อผู้เรียก และ provider ตรวจใน CI


---

# skill: data-import-export

Use when a system imports or exports Excel or CSV. Validate before write, row errors, Buddhist years.

# นำเข้าและส่งออกข้อมูล

> **กฎข้อเดียว:** ตรวจให้จบก่อน แล้วค่อยเขียน
> ถ้าเขียนไปครึ่งทางแล้วเจอแถวผิด ข้อมูลจะค้างอยู่ครึ่ง ๆ และไม่มีใครรู้ว่าต้องแก้ตรงไหน

## เมื่อไหร่ใช้ skill นี้

- มีหน้าจอให้ผู้ใช้อัปโหลด Excel หรือ CSV เพื่อนำข้อมูลเข้าระบบ
- มีปุ่มส่งออกเป็น Excel หรือ CSV
- ย้ายข้อมูลจากระบบเก่าเข้าระบบใหม่
- ผู้ใช้อัปโหลดแล้วได้ข้อความว่า "ไฟล์ไม่ถูกต้อง" แล้วไม่รู้ว่าผิดตรงไหน

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| รับไฟล์อัปโหลดทั่วไป (รูป เอกสาร) | `file-upload-and-storage` | แทน |
| สร้างไฟล์ Excel ที่จัดรูปแบบสวยงาม | `anthropic-skills:xlsx` | แทน |
| กลไกคิวและความคืบหน้า | `background-jobs` | แทน |
| ปี พ.ศ. และการเรียงลำดับไทย | `i18n-and-locale` | แทน |
| ส่งเอกสารเข้าโปรแกรมบัญชีไทย (PEAK · FlowAccount) ผ่าน API แทนไฟล์ | [`references/thai-accounting-apis.md`](references/thai-accounting-apis.md) | แทน |
| บันทึกว่าใครนำเข้าหรือส่งออกอะไร | `audit-trail` | คู่ |
| ปิดบังข้อมูลส่วนบุคคลในไฟล์ส่งออก | `pdpa-compliance` | คู่ |
| แจ้งผู้ใช้เมื่อนำเข้าเสร็จ | `notifications` | คู่ |
| ข้อจำกัดและ constraint ของตารางปลายทาง | `database-design` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · ให้แม่แบบ อย่าให้เดา

**ทุกหน้าจอนำเข้าต้องมีปุ่มดาวน์โหลดแม่แบบ** ในแม่แบบมี

- หัวคอลัมน์ตรงกับที่ระบบต้องการเป๊ะ
- **แถวตัวอย่าง 1–2 แถวที่ถูกต้อง**
- แถวคำอธิบายว่าคอลัมน์ไหนบังคับ รูปแบบอะไร ค่าที่รับได้มีอะไรบ้าง
- ชีตแยกสำหรับรายการค่าที่เลือกได้ (สถานะ ประเภท หน่วย)

| ไฟล์ต่างจากแม่แบบแบบไหน | ทำ |
|---|---|
| ลำดับคอลัมน์สลับ | ✅ อ่านจากชื่อหัวคอลัมน์ ไม่ใช่ตำแหน่ง |
| หัวคอลัมน์มีเว้นวรรคเกิน ตัวพิมพ์ต่าง | ✅ ตัดช่องว่างและเทียบแบบไม่สนตัวพิมพ์ |
| มีคอลัมน์เกินที่ไม่รู้จัก | ✅ ข้ามไป แต่**บอกให้รู้ว่าข้ามอะไร** |
| ขาดคอลัมน์บังคับ | ❌ หยุดทันที บอกว่าขาดคอลัมน์ไหน |

---

## 2 · ตรวจสามชั้น ก่อนเขียนอะไรทั้งนั้น

| ชั้น | ตรวจอะไร | ตัวอย่างข้อความ |
|:--:|---|---|
| 1 · ไฟล์ | เปิดได้ · มีชีตที่ต้องการ · คอลัมน์บังคับครบ · ไม่เกินจำนวนแถวสูงสุด | "ไม่พบคอลัมน์ 'รหัสสินค้า'" |
| 2 · รายแถว | ชนิดข้อมูล · ค่าบังคับ · อยู่ในรายการที่กำหนด · ช่วงตัวเลข | "แถว 42 คอลัมน์ 'จำนวน' ต้องเป็นตัวเลขมากกว่า 0 (พบ '-5')" |
| 3 · ความสัมพันธ์ | รหัสมีอยู่จริงในระบบ · ไม่ซ้ำกันเองในไฟล์ · กฎทางธุรกิจ | "แถว 88 ไม่พบลูกค้ารหัส C-1042" |

**รายงานความผิดพลาดต้องระบุ: แถว · คอลัมน์ · ค่าที่พบ · ค่าที่ควรเป็น**

```
❌ "ไฟล์ไม่ถูกต้อง"
❌ "พบข้อผิดพลาด 37 รายการ"
✅ ตารางผลตรวจ พร้อมปุ่มดาวน์โหลดไฟล์เดิมที่มีคอลัมน์ "ข้อผิดพลาด" ต่อท้าย
```

> **รายงานข้อผิดพลาดทั้งหมดในครั้งเดียว ไม่หยุดที่แถวแรกที่ผิด**
> ผู้ใช้จะได้แก้รอบเดียวจบ ไม่ใช่อัปโหลดใหม่ 37 รอบ

---

## 3 · เขียนลงระบบ

| แบบ | ใช้เมื่อ |
|---|---|
| **ทั้งหมดหรือไม่ทำเลย** | ค่าเริ่มต้น ไฟล์ต้องถูกหมดถึงจะนำเข้า |
| ทำเท่าที่ผ่าน ข้ามแถวที่ผิด | ไฟล์ใหญ่มากและแต่ละแถวไม่เกี่ยวกัน โดย**ผู้ใช้ต้องเลือกเอง ระบบไม่ตัดสินใจแทน** |

- **ทุกครั้งต้องมีหน้าสรุปก่อนยืนยัน** เช่น "จะเพิ่ม 120 · แก้ 45 · ข้าม 3 · ผิด 0" แล้วให้กดยืนยัน
- ถ้าเจอแถวซ้ำในไฟล์ ให้หยุดและบอก ไม่ใช่ใช้แถวสุดท้ายเงียบ ๆ
- ถ้าข้อมูลมีอยู่แล้วในระบบ ให้ผู้ใช้เลือก: ข้าม · เขียนทับ · หยุด
- **นำเข้าทุกครั้งต้องบันทึกใน audit** ว่าใครนำเข้า ไฟล์อะไร กระทบกี่แถว (ดู `audit-trail`)
- **เก็บไฟล์ต้นฉบับไว้** พอมีปัญหาจะได้ย้อนดูว่าไฟล์ที่ส่งมาหน้าตาอย่างไรจริง ๆ
- ทำให้ย้อนกลับได้: บันทึก batch id (รหัสรอบนำเข้า) ไว้กับทุกแถวที่นำเข้า

**ไฟล์ใหญ่ทำเป็นงานเบื้องหลัง**: ถ้าเกินประมาณ 1,000 แถวให้เข้าคิว
แบ่งเป็นชุดละ 500 แถว แสดงความคืบหน้า และยกเลิกได้ (ดู `background-jobs`)

---

## 4 · กับดักของ Excel และ CSV

| กับดัก | ผลที่เกิด | ทางแก้ |
|---|---|---|
| **ภาษาไทยใน CSV เพี้ยน** | เปิดใน Excel แล้วตัวอักษรอ่านไม่ออก | บันทึกเป็น UTF-8 **พร้อม BOM** หรือแนะให้ใช้ .xlsx |
| **รหัสที่ขึ้นต้นด้วย 0 หาย** | `0812345678` กลายเป็น `812345678` | อ่านเป็นข้อความเสมอ ส่วนตอนส่งออกให้ตั้งรูปแบบเซลล์เป็นข้อความ |
| **เลขยาวกลายเป็นเลขยกกำลัง** | เลขบัตร 13 หลัก → `1.23457E+12` | เหมือนข้างบน |
| **วันที่ถูกตีความเอง** | `03/04/2026` เป็นมีนาคมหรือเมษายน | บังคับ `YYYY-MM-DD` ในแม่แบบ |
| **ปี พ.ศ. กับ ค.ศ. ปนกัน** | เพี้ยน 543 ปีเงียบ ๆ | **ถามในหน้าจอนำเข้าว่าไฟล์ใช้ปีแบบไหน** |
| ช่องว่างท้ายค่า | จับคู่รหัสไม่เจอ | ตัดช่องว่างหัวท้ายทุกค่า |
| เซลล์ที่เป็นสูตร | ได้สูตรแทนค่า | อ่านค่าที่คำนวณแล้ว |
| **สูตรที่ขึ้นต้นด้วย `=` `+` `-` `@` ในไฟล์ส่งออก** | ผู้ใช้เปิดแล้ว Excel รันคำสั่ง | เติม `'` นำหน้าค่าที่ขึ้นต้นด้วยอักขระเหล่านี้ |

> 🚨 **ช่องโหว่ที่คนไม่ค่อยรู้**: ชื่อลูกค้าที่เป็น `=cmd|'/c calc'!A1` ถ้าส่งออกดิบ ๆ
> แล้วมีคนเปิดใน Excel มันจะพยายามรันคำสั่งจริง ตอนส่งออกจึงต้อง escape เสมอ

---

## 5 · ส่งออก

| เรื่อง | กฎ |
|---|---|
| ขนาด | ถ้าเกินประมาณ 50,000 แถว ให้ทำเป็นงานเบื้องหลัง แล้วส่งลิงก์ให้ดาวน์โหลด |
| สิทธิ์ | **ส่งออกได้เฉพาะข้อมูลที่ผู้ใช้คนนั้นมีสิทธิ์เห็นอยู่แล้ว** เพราะนี่คือจุดรั่วที่พบบ่อยที่สุด |
| audit | บันทึกทุกครั้งว่าใครส่งออกข้อมูลอะไร ช่วงไหน กี่แถว |
| ข้อมูลส่วนบุคคล | ปิดบังคอลัมน์ที่ไม่จำเป็น (ดู `pdpa-compliance`) |
| ชื่อไฟล์ | `<เรื่อง>-<ช่วงวันที่>-<เวลาที่ส่งออก>.xlsx` |
| ส่วนหัวของไฟล์ | ใส่เงื่อนไขกรองที่ใช้ และเวลาที่ส่งออก ไม่งั้นอีก 3 เดือนไม่มีใครรู้ว่าไฟล์นี้คือข้อมูลอะไร |
| ลิงก์ดาวน์โหลด | ต้องหมดอายุ (ดู `file-upload-and-storage`) |
| รูปแบบ | `.xlsx` สำหรับคนอ่าน · CSV สำหรับเครื่องอ่าน |

---

## 6 · Anti-patterns

- ❌ **"ไฟล์ไม่ถูกต้อง"** ผู้ใช้ทำอะไรต่อไม่ได้
- ❌ **หยุดที่แถวแรกที่ผิด** ผู้ใช้ต้องอัปโหลดใหม่ 30 รอบ
- ❌ **เขียนไปตรวจไป** พอล้มกลางทาง ข้อมูลก็ค้างครึ่ง ๆ
- ❌ **ไม่มีหน้าสรุปก่อนยืนยัน** เขียนทับข้อมูลจริงโดยไม่มีใครทันได้ดู
- ❌ **ไม่มีแม่แบบให้ดาวน์โหลด** ผู้ใช้ต้องเดาหัวคอลัมน์
- ❌ **อ่านคอลัมน์ตามตำแหน่ง** ผู้ใช้แทรกคอลัมน์เดียวก็พังทั้งไฟล์
- ❌ **อ่านรหัสเป็นตัวเลข** เลข 0 นำหน้าหายทุกครั้ง
- ❌ **ไม่ถามว่าปีเป็น พ.ศ. หรือ ค.ศ.** ปีเพี้ยน 543 ปีโดยไม่มีใครรู้
- ❌ **ส่งออกโดยไม่ escape สูตร** เปิดไฟล์แล้วรันคำสั่ง
- ❌ **ส่งออกได้เกินสิทธิ์ที่มี** ข้อมูลรั่วผ่านปุ่มที่เราทำเอง
- ❌ **ไม่เก็บไฟล์ต้นฉบับ** มีปัญหาแล้วย้อนดูไม่ได้


## reference: thai-accounting-apis.md

# ต่อโปรแกรมบัญชี SME ไทยผ่าน API

ใช้เมื่อระบบของเราต้องส่งเอกสารขายหรือซื้อเข้าโปรแกรมบัญชีของลูกค้า แทนการ export Excel ให้คีย์ซ้ำ · กฎของ `SKILL.md` ใช้เหมือนเดิม: ตรวจให้จบก่อนเขียน · มีหน้าสรุปก่อนยืนยัน · batch id · audit
ข้อเท็จจริงทุกข้อมาจากเอกสารของผู้ผลิตที่เปิดตรวจ 2026-10-23 (ตาราง "ที่มา") · ราคาและเงื่อนไขเปลี่ยนบ่อย ยืนยันกับผู้ขายก่อนเสนอราคาลูกค้า
ตัวย่อ: small and medium enterprises (SME) · Application Programming Interface (API) · User Acceptance Testing (UAT) คือระบบทดสอบ · Hash-based Message Authentication Code (HMAC) คือลายเซ็นที่สร้างจากกุญแจลับ · Software Development Kit (SDK)

## 1 · เลือกทาง

| ทาง | ใช้เมื่อ |
|---|---|
| ส่งไฟล์ตามแม่แบบนำเข้าของโปรแกรมบัญชี (รูปแบบไฟล์ของแต่ละเจ้ายังไม่ได้ตรวจ) | เอกสารน้อย · แพ็กเกจของลูกค้าไม่เปิด API |
| ต่อ API ตรง (ข้อ 2–3) | เอกสารหลายร้อยใบต่อเดือน · ต้องการสถานะกลับ เช่น ชำระแล้ว |
| ผ่านแอปพาร์ทเนอร์ที่โปรแกรมบัญชีรับรอง (PEAK: เมนู ตั้งค่า > การเชื่อมต่อแอปพลิเคชันภายนอก) | ร้านค้าออนไลน์ที่ใช้ระบบหลังร้านอยู่แล้ว → `ecommerce-patterns` `references/thai-marketplace-apis.md` |

## 2 · PEAK

| เรื่อง | ข้อมูล |
|---|---|
| เอกสาร | developers.peakaccount.com (API Integration Guide · ไฟล์ `llms.txt` รวมลิงก์ทุกหน้า) · มี Postman collection |
| แพ็กเกจ | PEAK PRO Plus (12,000 บาท/ปี) ขึ้นไป · ค่าบริการ API จ่ายก่อนขึ้นระบบจริง เอกสารไม่ระบุจำนวนเงิน (รอยืนยัน) |
| ขอสิทธิ์ | กรอกแบบฟอร์ม ทีมงานติดต่อกลับใน 3 วันทำการ · ได้ Connect ID + Application Code · credential ของ UAT กับระบบจริงแยกกัน |
| ยืนยันตัวตน | Client Token อายุ 24 ชม. (`POST /api/v1/ClientToken`) · User Token ต่อกิจการ ลูกค้ากดสร้างเองในเมนู เชื่อมต่อแอปพลิเคชันภายนอก ด้วย Application Code · header `Time-Stamp` (yyyyMMddHHmmss เวลา UTC) · `Time-Signature` = HMAC-SHA1 ของ Time-Stamp ใช้ connectId เป็นกุญแจ |
| ของที่ทำได้ | contacts · products (มี adjust) · services · quotations · invoices · billing notes · receipts · credit notes · purchase orders · expenses · daily journals · รับชำระ · void · approve · แนบไฟล์ |
| e-Tax | มี endpoint ส่ง e-Tax Invoice ของ invoice และ receipt · ส่ง e-Receipt |
| UAT | `http://peakengineapidev.azurewebsites.net/api/v1` (เป็น http ไม่ใช่ https) · ฟรี 3 เดือน · เปิด จ.–ศ. 08:00–22:00 |
| ระบบจริง | `https://api.peakaccount.com/api/v1` · ก่อนขึ้นต้องผ่าน Final UAT Review (test case · error case · duplicate case · ผลทางบัญชี) |
| rate limit | ขอ ClientToken 10 ครั้ง/นาที/IP · ต่อ User Token: GET พร้อมกัน 20 · POST พร้อมกัน 10 · แนบไฟล์พร้อมกัน 10 · เกิน → HTTP 429 `RATE_LIMITED` พร้อม `retryAfterSeconds` |
| คิดเงินตาม | POST Create ที่สำเร็จเท่านั้น (invoice · receipt · quotation · billing note · purchase order · expense · daily journal) |
| webhook | event Create · Edit · Void · PaidPayment · VoidPayment ของเอกสารหลัก (contact · product ได้แค่ Create · Edit) · ตั้ง custom header ต่อ endpoint ได้ เช่น `x-api-key` · เอกสารไม่พูดถึงลายเซ็นและการส่งซ้ำ |

## 3 · FlowAccount

| เรื่อง | ข้อมูล |
|---|---|
| เอกสาร | developers.flowaccount.com · spec ที่ใช้อยู่จริง `https://developers.flowaccount.com/swagger.yml` (OpenAPI 3.0.2 · 130 path) · SDK หลายภาษาใน github.com/flowaccount |
| แพ็กเกจ | Pro Business (หน้าราคา: เริ่ม ฿457/เดือน เมื่อจ่ายรายปี ฿5,490/ปี) · นำเข้าไม่เกิน 5,000 รายการ/เดือน เกินคิดราคาพิเศษ · หน้า API เขียนว่า "Pay when you go live" ไม่ระบุจำนวนเงิน (รอยืนยัน) |
| ขอสิทธิ์ | แบบฟอร์ม request-openapi · ทีมติดต่อใน 1–2 วันทำการ · sandbox ใช้ได้ 30 วัน · credential จริงส่งอีเมลเจ้าของกิจการใน 3 วันทำการหลังยืนยันแพ็กเกจ |
| ยืนยันตัวตน | OAuth 2.0 · Client Credentials = 1 client ต่อ 1 กิจการ · OpenID = พาร์ทเนอร์ 1 client หลายกิจการ (scope `flowaccount-api offline_access` · refresh token ราว 30 วันนับจากครั้งล่าสุด) · token ที่ `https://openapi.flowaccount.com/{test หรือ v1}/token` อายุ 86,400 วินาที · ส่งใน header `Authorization: Bearer` |
| base URL | sandbox `https://openapi.flowaccount.com/test` · ระบบจริง `https://openapi.flowaccount.com/v1` |
| ของที่ทำได้ | contacts · products · quotations · billing-notes · tax-invoices · receipts · cash-invoices · purchases · purchases-orders · expenses · withholding-taxes · journal-entries · chart-of-accounts · เปลี่ยนสถานะ · รับชำระ · แนบไฟล์ · export PDF · ส่งอีเมล |
| อ้างอิงข้ามระบบ | ฟิลด์ `externalDocumentId` "รหัสเอกสารอ้างอิงจากระบบภายนอก" |
| e-Tax · rate limit · webhook | ไม่พบใน spec และหน้าเอกสารที่เปิด (ยังไม่ได้ตรวจกับผู้ขาย) |

## 4 · เจ้าอื่น

| โปรแกรม | สิ่งที่พบ |
|---|---|
| TRCLOUD | หน้า API ของผู้ผลิตบอกว่ามี RESTful API · สร้าง API Key จากเมนูตั้งค่า · มี Custom API & Webhook · ไม่พบเอกสารนักพัฒนาสาธารณะ ต้องขอคู่มือจากทีมขาย |
| AccRevo | ไม่พบ API สาธารณะ · เว็บมีบทความเปิดตัว AccRevoX × MCP (ทำงานกับ Claude) |
| Express | ค้น 2 รอบไม่พบเว็บผู้ผลิตและไม่พบ API สาธารณะ |

## 5 · e-Tax Invoice

- เลือกระบบเดียวเป็นผู้ออกเลขที่ใบกำกับภาษี · ห้ามระบบเรากับโปรแกรมบัญชีออกเลขซ้อนกัน
- ส่งเข้าโปรแกรมบัญชีเป็นเอกสารต้นทาง แล้วให้โปรแกรมบัญชีออก e-Tax · PEAK มี endpoint ส่ง e-Tax · FlowAccount ไม่พบใน spec ต้องถามผู้ขาย
- กฎของใบกำกับ (มาตรา 86/4 · e-Tax Invoice & e-Receipt กับ by Email) → `thai-workplace:e-tax-invoice` (ถ้าติดตั้ง)

## 6 · กันซ้ำและกระทบยอด

- เก็บตาราง mapping: รหัสฝั่งเรา ↔ รหัสฝั่งโปรแกรมบัญชี · PEAK แนะนำให้เก็บ External Reference และ mapping เพื่อกันเอกสารซ้ำ · FlowAccount ใช้ `externalDocumentId` เก็บรหัสฝั่งเรา
- เอกสารของทั้ง 2 เจ้าไม่มี idempotency key → ค้น mapping ก่อน POST create ทุกครั้ง (`principle-safe-to-rerun`)
- timeout ไม่ได้แปลว่าล้มเหลว · ดึงรายการตามช่วงวันที่มาเทียบก่อนส่งซ้ำ
- ได้ 429 → รอตาม `retryAfterSeconds` หรือถอยแบบ exponential (1 · 2 · 4 · 8 วินาที ตามที่ PEAK แนะนำ)
- กระทบยอดทุกวัน: จำนวนเอกสารและยอดรวมของ 2 ระบบต้องตรงกัน → `fintech-payments` (`references/agent-payment-integration.md` หัวข้อ Settlement Reconciliation)
- ทุกการส่งลง audit: ใครส่ง · เอกสารไหน · รหัสปลายทาง · ผล → `audit-trail`
- Client Token · client secret · connectId อยู่นอกโค้ด → `config-and-secrets` · UAT ของ PEAK เป็น http จึงใช้ข้อมูลทดสอบเท่านั้น

## ที่มา

| เรื่อง | URL (เปิดตรวจ 2026-10-23) |
|---|---|
| PEAK แพ็กเกจ · UAT ฟรี 3 เดือน · คู่มือ | https://www.peakaccount.com/developers · https://developers.peakaccount.com/reference/api-integration-guide |
| PEAK รายการหน้า API ทั้งหมด | https://developers.peakaccount.com/llms.txt |
| PEAK token · ลายเซ็น | https://developers.peakaccount.com/reference/peak-api-client-token-guide.md |
| PEAK rate limit · การนับเงิน · ขึ้นระบบจริง | https://developers.peakaccount.com/reference/copy-of-api-rate-limiting-concurrency-control.md · .../peak-api-transaction-counting.md · .../peak-api-implementation-go-live-guide.md |
| PEAK webhook · สิทธิ์ API | https://developers.peakaccount.com/reference/webhook.md · .../api-access-rights.md |
| PEAK ศูนย์ช่วยเหลือ (แพ็กเกจ · User Token) | https://intercom.help/peak/en/articles/13176287 · https://intercom.help/peak/en/articles/10078711 |
| FlowAccount หน้า API · ราคา | https://flowaccount.com/en/developers · https://flowaccount.com/en/pricing |
| FlowAccount การเชื่อมต่อ · token | https://developers.flowaccount.com/tutorial/connect-open-api · .../tutorial/connect/client-credentials-flow · .../tutorial/connect/open-id-flow |
| FlowAccount spec · SDK | https://developers.flowaccount.com/swagger.yml · https://github.com/flowaccount/open-api (README ชี้ว่า swagger.yml คือ spec ที่ใช้จริง) |
| TRCLOUD · AccRevo | https://www.trcloud.co/api.php · https://www.accrevo.com/ |


---

# skill: error-handling-patterns

Use when writing or reviewing code that can fail (network, database, services). Retry, timeout.

# จัดการข้อผิดพลาด

> **กฎข้อเดียว:** จับ error เฉพาะตอนที่**ทำอะไรกับมันได้จริง**
> จับแล้วไม่ทำอะไร แย่กว่าไม่จับ เพราะระบบจะเดินต่อทั้งที่ข้างในพังไปแล้ว

## เมื่อไหร่ใช้ skill นี้

- เขียนโค้ดที่เรียกเครือข่าย ฐานข้อมูล ไฟล์ หรือระบบของทีมอื่น
- ต้องตัดสินใจว่าจะ retry ไหม กี่ครั้ง รอเท่าไหร่
- ผู้ใช้เจอข้อความว่า "เกิดข้อผิดพลาด" แล้วไม่รู้ต้องทำอะไรต่อ
- ไล่ปัญหาแล้วพบว่า log ไม่มีอะไรให้ดูเลย เพราะมีคน catch ทิ้ง

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| รูปร่าง JSON ของ error ที่ API ส่งออก | `web-service-essentials` · `api-conventions` | แทน |
| รูปแบบบรรทัด log และการปิดบังข้อมูล | `logging-standards` | แทน |
| แก้บั๊กเฉพาะจุดที่มีคนแจ้งมา | `targeted-fix` | แทน |
| ขั้นตอนตอนระบบล่มจริง | `incident-runbook-template` | แทน |
| ตัวชี้วัดอัตรา error และการแจ้งเตือน | `observability-basics` | คู่ |
| งานเบื้องหลังที่ล้มแล้วต้องไปไหนต่อ | `background-jobs` | คู่ |
| ข้อความ error ที่ต้องแปลหลายภาษา | `i18n-and-locale` | คู่ |
| test กรณีล้มเหลว | `testing-standards` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

---

## 1 · จับที่ไหน ปล่อยที่ไหน

| ชั้น | ทำอะไร |
|---|---|
| ชั้นในสุด (เรียก DB, HTTP, ไฟล์) | **ปล่อยผ่าน** หรือแปลงเป็น error ของโดเมนที่มีความหมาย |
| ชั้นตรรกะธุรกิจ | จับเฉพาะที่มีทางเลือกสำรองจริง ๆ (มีค่าเริ่มต้น มีแหล่งข้อมูลสำรอง) |
| **ชั้นนอกสุด** (controller, handler, main) | **จับทุกอย่าง** · log 1 ครั้ง · แปลงเป็นคำตอบที่ผู้ใช้เข้าใจ |

> **log ที่เดียว คือชั้นนอกสุด** — ถ้าทุกชั้น catch แล้ว log แล้ว throw ต่อ
> error 1 ตัวจะกลายเป็น 10 บรรทัดใน log และไม่มีใครรู้ว่าเป็นเรื่องเดียวกัน

**3 อย่างที่ห้ามทำเด็ดขาด:**

```csharp
try { ... } catch { }                      // ❌ กลืนเงียบ
try { ... } catch (Exception) { return null; }   // ❌ ผู้เรียกเจอ null โดยไม่รู้ว่าเกิดอะไร
catch (Exception ex) { log.Error(ex); throw; }   // ❌ log ซ้ำทุกชั้น
```

**ถ้าตั้งใจจะกลืนจริง ๆ ต้องเขียนเหตุผลไว้:**

```csharp
catch (SmtpException ex)
{
    // ตั้งใจกลืน — ส่งอีเมลแจ้งไม่สำเร็จไม่ควรทำให้การสั่งซื้อล้ม
    log.Warning(ex, "ส่งอีเมลยืนยันไม่สำเร็จ orderId={OrderId}", order.Id);
}
```

---

## 2 · ข้อความถึงผู้ใช้ ≠ ข้อความใน log

| | ผู้ใช้เห็น | log เก็บ |
|---|---|---|
| เนื้อหา | เกิดอะไร · ต้องทำอะไรต่อ | stack trace · ค่าตัวแปร · id ของคำขอ |
| ภาษา | ภาษาของผู้ใช้ | อังกฤษก็ได้ |
| รายละเอียดภายใน | **ไม่มีเลย** | มีได้ |
| ตัวเชื่อม 2 ฝั่ง | **รหัสอ้างอิง** | รหัสเดียวกัน |

```
❌ "เกิดข้อผิดพลาด"                    ผู้ใช้ทำอะไรต่อไม่ได้
❌ "SqlException: timeout expired"      หลุดรายละเอียดภายใน และเขาก็อ่านไม่ออก
✅ "บันทึกไม่สำเร็จเพราะระบบตอบช้า ลองอีกครั้งใน 1 นาที (อ้างอิง: 01J9Z8K)"
```

**ข้อความที่ดีมี 3 ส่วน** — เกิดอะไร · เพราะอะไร (ถ้าบอกได้) · ต้องทำอะไรต่อ
รหัสอ้างอิงคือ correlation id ตัวเดียวกับใน `logging-standards`

---

## 3 · แยกประเภทก่อนตัดสินใจ

| ประเภท | ตัวอย่าง | ทำยังไง | log ระดับ |
|---|---|---|---|
| **ผู้ใช้ทำผิด** | กรอกไม่ครบ ค่าผิดรูปแบบ | บอกให้แก้ · **ห้าม retry** | ไม่ต้อง log |
| **ชั่วคราว** | timeout · 503 · deadlock · เชื่อมต่อหลุด | **retry ได้** | warning |
| **ถูกจำกัดอัตรา** | 429 Too Many Requests | retry ได้ **หลังเวลาที่ `Retry-After` บอก** (ไม่มีค่านี้ → ใช้สูตร §4) · ห้ามยิงถี่กว่านั้น | warning |
| **ถาวร** | 404 · 401 · ข้อมูลไม่ตรงเงื่อนไข | ไม่ retry · บอกให้ชัด | warning |
| **บั๊กของเรา** | null reference · แปลงชนิดไม่ได้ | ไม่ retry · **ต้องมีคนแก้** | error |
| **ข้อมูลไม่สอดคล้อง** | ยอดไม่ตรง สถานะเป็นไปไม่ได้ | หยุด · **เรียกคน** | error + แจ้งเตือน |

> 🚨 **การ retry error ที่ลองกี่ครั้งก็ไม่หาย คือการยิงซ้ำใส่ระบบที่ล้มอยู่ให้ล้มหนักขึ้น**
> `400` กับ `401` ยิงอีก 100 ครั้งก็ได้คำตอบเดิม

---

## 4 · timeout และการลองใหม่

**ทุกการเรียกออกนอก process ต้องมี timeout** — ค่าเริ่มต้นของไลบรารีส่วนใหญ่คือ "รอตลอดไป"

| การเรียก | timeout ที่ใช้ได้ทั่วไป |
|---|---|
| ฐานข้อมูล query ปกติ | 5–10 วินาที |
| HTTP ภายใน | 3–5 วินาที |
| HTTP ภายนอก | 10–30 วินาที |
| งานเบื้องหลังที่หนัก | ตั้งตามของจริง แล้วต้องตัดจบได้ |

**สูตรการลองใหม่** (service เรียก service · งานในคิวใช้ตัวเลขของ [`background-jobs`](../background-jobs/SKILL.md) §4 · มีคนนั่งรอหน้าจอ → ดูข้อสุดท้ายด้านล่าง):

```
ลองไม่เกิน 3 ครั้ง · หน่วงแบบทวีคูณ + สุ่ม
ครั้งที่ 1 รอ 1 วินาที · ครั้งที่ 2 รอ 2 · ครั้งที่ 3 รอ 4  (แต่ละครั้ง ±20% แบบสุ่ม)
```

- **ต้องมีตัวสุ่ม** — ไม่งั้นทุก instance จะลองใหม่พร้อมกันเป๊ะ แล้วทับระบบปลายทางซ้ำ
- **เวลารวมของการลองใหม่ต้องน้อยกว่า timeout ของผู้เรียก** ไม่งั้นเขาเลิกรอไปแล้วแต่เรายังลองอยู่
- **retry การเขียนต้องมี idempotency key** ไม่งั้นลูกค้าถูกตัดเงิน 2 รอบ (ดู `api-conventions`)
- **มีคนนั่งรออยู่หน้าจอ** → ลองใหม่อัตโนมัติไม่เกิน 1 ครั้ง แล้วแสดงปุ่ม "ลองอีกครั้ง" ให้เขากดเอง (ไม่ใช้ 3 ครั้งของสูตรด้านบน)

---

## 5 · ตัดวงจร (circuit breaker)

เมื่อปลายทางล้ม การยิงต่อไม่ได้ช่วยอะไร แค่ทำให้เราค้างตามไปด้วย

```
ปิด (ปกติ) → ล้มติดกัน N ครั้ง → เปิด (ไม่ยิงเลย ตอบ error ทันที)
           → รอ X วินาที → ครึ่งเปิด (half-open): ปล่อยให้ลอง 1 คำขอ → สำเร็จก็กลับไปปิด · ล้มก็เปิดต่อ
```

ค่าเริ่มต้นที่ใช้ได้: ถ้าล้ม 5 ครั้งติดกันภายใน 30 วินาที ให้เปิดวงจรไว้ 60 วินาที

**ควรใส่เมื่อ** — เรียกระบบภายนอกที่เคยล่ม · เรียกข้ามหลาย service · ปลายทางช้าแล้วลามมาถึงเรา
**ไม่ต้องใส่เมื่อ** — เรียกฐานข้อมูลของตัวเอง · งานที่วิ่งครั้งเดียวต่อวัน

---

## 6 · ล้มบางส่วน

งานที่ทำหลายรายการ ต้องตอบให้ได้ว่า **"ทำได้ 8 จาก 10 แล้วอีก 2 ไปไหน"**

| แบบ | เหมาะกับ |
|---|---|
| ทั้งหมดหรือไม่ทำเลย (transaction) | เงิน · สต็อก · อะไรที่ครึ่ง ๆ แล้วพัง |
| ทำเท่าที่ได้ แล้วรายงานรายการที่ไม่ผ่าน | นำเข้าข้อมูล · ส่งแจ้งเตือนหลายคน |

แบบที่สองต้อง**คืนรายการที่ล้มพร้อมเหตุผลรายตัว** ไม่ใช่บอกว่า "บางรายการไม่สำเร็จ"

**งานเก็บกวาดต้องรันเสมอ** ไม่ว่างานหลักจะสำเร็จหรือไม่ เช่น ปิดไฟล์ คืน connection ลบไฟล์ชั่วคราว
ให้ใช้ `finally` / `using` / `with` / `defer` แทนการเขียนซ้ำในทุกทางออก

---

## 7 · ตรวจก่อนส่ง

ไล่กับ diff ทุกครั้งที่แตะโค้ดที่เรียกออกนอก process (แนวคิดจาก ECC error-handling)

- [ ] ทุก `catch` ทำอย่างใดอย่างหนึ่งชัด ๆ: จัดการแล้วไปต่อ · แปลงเป็น error ของชั้นตัวเองแล้วโยนต่อ · ปล่อยไปให้ชั้นนอกสุด log (ข้อ 1) — ไม่มี `catch` ที่ log แล้วโยนต่อ
- [ ] ทุกการเรียกออกนอก (HTTP · DB · คิว · ไฟล์) มี timeout ที่ตั้งใจ และ retry เฉพาะประเภทชั่วคราวในข้อ 3 · การเขียนที่ retry มี idempotency key (ข้อ 4)
- [ ] ข้อความถึงผู้ใช้บอกว่าทำอะไรต่อ · ไม่มี stack trace หรือชื่อตารางออกไป (ข้อ 2) · log ของ error เดียวกันมี correlation id และข้อมูลพอให้ทำซ้ำ
- [ ] ผลที่ธุรกิจคาดไว้ (ไม่พบ · ยอดไม่พอ · ซ้ำ) เป็นค่าคืนหรือ type ที่ผู้เรียกต้องจัดการ ไม่ใช่ exception
- [ ] dependency ภายนอกแต่ละตัวมี test เส้นทางล้มอย่างน้อย 1 กรณี (timeout · 5xx · payload ผิด) และ test ยืนยันว่าระบบล้มบางส่วนตามข้อ 6 ไม่ล้มทั้งหน้า

## 8 · Anti-patterns

- ❌ **`catch` ว่างเปล่า** — ปัญหาที่หายากที่สุดคือปัญหาที่ไม่มีร่องรอย
- ❌ **คืน `null` แทนการโยน error** — ผู้เรียกไม่รู้ว่าไม่มีข้อมูล หรือระบบพัง
- ❌ **`catch (Exception)` ที่ชั้นในสุด** — กลืนบั๊กของตัวเองไปด้วย
- ❌ **log แล้ว throw ต่อทุกชั้น** — error 1 ตัวได้ 10 บรรทัด
- ❌ **"เกิดข้อผิดพลาด"** — ไม่บอกว่าต้องทำอะไรต่อ
- ❌ **ส่ง stack trace ให้ผู้ใช้** — เปิดโครงสร้างภายในให้คนที่กำลังหาช่องโหว่เห็น
- ❌ **retry แบบไม่หน่วง** — ยิงรัวใส่ระบบที่ล้มอยู่
- ❌ **retry การเขียนโดยไม่มี idempotency key** — ได้รายการซ้ำ
- ❌ **ไม่มี timeout** — thread ค้างสะสมจนระบบตาย
- ❌ **ใช้ error เป็นตัวควบคุมการทำงานปกติ** — เช่นโยน exception เมื่อ "ไม่พบข้อมูล" ซึ่งเป็นเรื่องปกติ


---

# skill: app-verifier-setup

Use when a project has no scripted way for an agent to run the app and see results, or before feature one.

# app-verifier-setup — ให้ agent มีมือและตา

> ถ้า agent มองไม่เห็นผลงานตัวเอง ก็ปรับงานต่อเองไม่ได้ และคนต้องคอยส่งต่อสิ่งที่เห็นบนจอให้ agent
> skill นี้สร้างเครื่องมือครั้งเดียว ให้ agent ทุกตัวหลังจากนี้ใช้ซ้ำ

**ผลลัพธ์:** 2 ชิ้น คือสคริปต์ที่อยู่กับ test ของโปรเจกต์ และ skill ที่เป็นแค่คู่มือสั้น ๆ ให้ agent

```
<โปรเจกต์>/
├─ <project-name>/test/e2e/verify.*         สคริปต์ขับแอปจริง เปิดและปิดแอปเอง (อยู่ในโฟลเดอร์โค้ด ดู project-bootstrap)
│                                           รายการฟีเจอร์และ check อยู่ในไฟล์นี้ที่เดียว (แผนที่ฟีเจอร์)
├─ .claude/skills/verify-<โปรเจกต์>/SKILL.md   รันอย่างไร · อ่านผลอย่างไร · ข้อห้าม (ที่ราก — ที่ Claude Code เปิด)
└─ _to_delete/verify-runs/                  หลักฐานแต่ละรอบ — สคริปต์หา path จากที่อยู่ของตัวเอง ไม่ขึ้นกับโฟลเดอร์ที่รัน
```

(Codex · Gemini ใช้ `.agents/skills/` · `skills/` แทน `.claude/skills/`) ตัวอย่างที่ทำจริงแล้ว: โปรเจกต์ `calculator-demo` (เว็บ) · แอป Flutter Android `Lumio - Light Meter` → `lumio-light-meter/test/e2e/verify.mjs` (Node ขับ `adb` สรุปไว้ใน [`references/android-native.md`](references/android-native.md))

**ทำไมไม่เขียนขั้นตอนแยกเป็นไฟล์ข้อความ** เพราะลองแล้วในโปรเจกต์ตัวอย่าง ขั้นตอนในไฟล์ `.md` กับใน script ไม่ตรงกันตั้งแต่รอบแรก จึงเก็บข้อมูลไว้ในสคริปต์ที่เดียว แล้วให้ skill ชี้ไปหา

---

## ขั้นตอน

1. **หาวิธีรันที่มีอยู่แล้ว** จาก README · `package.json` · `Makefile` · `docker-compose` · launch config (`.vscode/launch.json`) · `pubspec.yaml` (Flutter) · `build.gradle(.kts)` / `gradlew` (Android) ถ้ามีของเดิมให้ใช้ของเดิม ไม่สร้างใหม่
2. **เลือกวิธีขับตามชนิดแอป**

   | ชนิด | ขับด้วย | อ่านผลจาก |
   |---|---|---|
   | เว็บ | Playwright (ถ้ามี Chromium ติดตั้งอยู่แล้ว ห้ามดาวน์โหลดใหม่) | ภาพหน้าจอ · DOM · console · network |
   | Electron · desktop | Playwright `_electron` หรือ Chrome DevTools Protocol (CDP) · Windows ใช้ pywinauto (WinAppDriver รุ่นล่าสุดน่าจะออกปี 2020 และยังไม่ยืนยันว่า Microsoft ยังดูแลอยู่ (รอยืนยัน)) | ภาพหน้าจอ · log |
   | command line · TUI | เรียกคำสั่งจริงพร้อม input ตายตัว | stdout · stderr · exit code · ไฟล์ที่สร้าง |
   | API · service | `curl` หรือ client ที่ repo ใช้ | status · body · log · ค่าในฐานข้อมูลทดสอบ |
   | มือถือแบบเว็บ (progressive web app (PWA) · web-wrapped) | Playwright mobile viewport | ภาพหน้าจอ · DOM |
   | มือถือ native · Flutter (Android) | สคริปต์ Node/Python เรียก `adb` + `uiautomator dump` (แบบ Lumio) · หรือ `integration_test` ของ Flutter · หรือ Maestro · Playwright ขับ APK ไม่ได้ | ภาพ `adb exec-out screencap -p` · ข้อความ/Semantics label จาก `uiautomator` · `dumpsys` · `logcat` |

   - ถ้าโปรเจกต์มี `.sandbox/` ให้ขับเบราว์เซอร์ใน container ซึ่งค่าเริ่มคือ headless (ไม่เปิดหน้าต่าง) ถ้าอยากให้คนดูได้ ให้เปิด `up -Browser` (ดู [`docker-sandbox`](../docker-sandbox/SKILL.md) ข้อ 5) ส่วน Android emulator รันใน Docker บน Windows ไม่ได้ (ต้องมี KVM) จึงให้รัน emulator บนเครื่อง host แล้วบอกในรายงาน
   - หน้าที่มี CAPTCHA ให้ใช้ค่าทดสอบของผู้ให้บริการหรือปิดใน environment ทดสอบ ห้ามเขียนสคริปต์แก้ CAPTCHA
   - แอปที่อ่าน hardware (sensor · กล้อง · GPS) ให้ป้อนค่าที่รู้ล่วงหน้า ผ่าน emulator (`adb emu sensor set light 420`, กล้องเสมือน) หรือแหล่งข้อมูลปลอมที่เปิดได้เฉพาะ debug build แล้วติดป้ายทุก check ว่า `emulator` หรือ `เครื่องจริง` เพราะความแม่นของ sensor จริงพิสูจน์บน emulator ไม่ได้ ถ้ายังไม่ได้รันบนเครื่องจริง ให้เขียนว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

3. **เขียน `test/e2e/verify.*`** ให้เปิดแอปเองบนพอร์ตที่ไม่ชน (มือถือ: ติดตั้ง APK แล้วล้างข้อมูลแอป) ใส่ข้อมูลทดสอบ (seed) และรอจนพร้อม**โดยมีเวลาจำกัด** (เว็บ: ถ้าไม่ขึ้นใน 10 วินาทีถือว่าล้ม · มือถือ: ตั้งเวลาแยกสำหรับ build · boot emulator · เปิดแอป · แต่ละ check ดู reference) ปิดแอปเมื่อจบเสมอ และรันซ้ำต้องได้ผลเดิม (`principle-build-a-tool-not-handwork`)
4. **รายการฟีเจอร์เป็นข้อมูลในสคริปต์** ไล่จากเมนู · route · command list · SRS แล้วเขียน 1 กลุ่มต่อฟีเจอร์ 1 บรรทัดต่อ check (`ทำอะไร → ต้องเห็นอะไร`) อย่างน้อย 3 ฟีเจอร์หลัก และกรณีผิดพลาด 1 กรณีต่อฟีเจอร์ **ทุก check เริ่มจากสถานะสะอาด** รันเดี่ยวหรือสลับลำดับได้ และพิมพ์ผล `PASS/FAIL` พร้อม expected กับ actual
5. **สคริปต์ต้องไม่ผ่านลอย ๆ** (ผ่านทั้งที่ไม่ได้ตรวจอะไรจริง) ถ้าชื่อฟีเจอร์ไม่มีจริงให้ exit 1 ถ้าแอปไม่ขึ้นให้ exit 1 และถ้าไม่มี check ไหนได้รันก็ให้ exit 1 (ตรวจ 0 รายการถือว่าพัง ไม่ใช่ผ่าน)
   - **check ที่ตรวจว่า "หยุด/ปล่อยแล้ว" ต้องตรวจเงื่อนไขก่อนเสมอ** (เช่น กล้องถูกถืออยู่ก่อนกด Home) ไม่งั้นจะผ่านลอย ๆ และรอผลด้วยการวนตรวจจนหมดเวลา ไม่ใช่ `sleep` ค่าเดา
   - **ต้องแน่ใจว่าอ่านหน้าจอล่าสุด** โดยลบไฟล์ผลเก่าก่อนอ่านใหม่ และกดเมื่อตำแหน่งเป้าหมายนิ่ง 2 รอบติด ถ้าอ่านหน้าจอไม่ได้เพราะแอปวาดไม่หยุด ถือเป็นบั๊กของแอป ไม่ใช่ของสคริปต์
6. **พิสูจน์ว่าสคริปต์จับของผิดได้** โดยแก้แอปให้ผิด 1 จุดชั่วคราว รันแล้วต้อง `FAIL` แล้วค่อยคืนค่า
7. **พิสูจน์ว่า skill ใช้ได้จริง** โดยส่ง agent `qa-tester` ตัวใหม่ที่ไม่เคยเห็นโค้ด ให้ใช้แค่ skill นี้ทดสอบ 1 ฟีเจอร์ตั้งแต่เปิดแอปจนถ่ายภาพผล ติดตรงไหนให้แก้ skill ตรงนั้น
8. **เก็บหลักฐานไว้ใน `_to_delete/verify-runs/<เวลา>/`** ทั้งภาพหน้าจอและ log ของการทดสอบ ไม่ปนกับโค้ด (เป็นของชั่วคราว ผู้ใช้ลบเองได้เมื่อส่งงานแล้ว · agent ไม่ลบ)

## สัญญาสำหรับทดสอบ — ใส่ในแอปตั้งแต่หน้าจอแรก

verify ต้องพึ่งของที่แอปเตรียมไว้ให้ ไม่ใช่เดาจากข้อความหรือ CSS · เขียนสัญญานี้ลงแผนที่ฟีเจอร์ในสคริปต์ และให้ developer ทำตามตั้งแต่ฟีเจอร์แรก

| สิ่งที่แอปต้องมี | ใช้ทำอะไร | กฎ |
|---|---|---|
| `data-testid="<หน้า>-<สิ่งนั้น>"` แบบ kebab-case บนทุกปุ่ม ช่องกรอก ผลลัพธ์ และข้อความ error | หาองค์ประกอบโดยไม่ผูกกับข้อความหรือ CSS → เปลี่ยนภาษาหรือดีไซน์แล้ว check ไม่พัง | เช่น `book-submit` · `summary-total` · `book-error` · ห้ามซ้ำในหน้าเดียว · รายการ testid ทั้งหมดอยู่ในแผนที่ฟีเจอร์ |
| `<html data-ready="false">` → `"true"` เมื่อหน้าโหลดข้อมูลเสร็จ | รอแบบมีเงื่อนไขแทน `sleep` ค่าเดา (ข้อ 5) | ตั้ง `true` หลังข้อมูลชุดสุดท้ายมาถึง ไม่ใช่ตอน component mount |
| reset endpoint เช่น `POST /api/test/reset` → ล้างแล้วใส่ seed ใหม่ ภายใน 5 วินาที | ทุก check เริ่มจากสถานะสะอาด (ข้อ 4) | มีเฉพาะเมื่อตั้ง `ALLOW_TEST_RESET=1` · ไม่ตั้ง → ตอบ 404 · ห้ามเปิดใน production |
| ล็อกนาฬิกา: reset รับ `{"now":"<ISO + offset>"}` แล้วกฎทุกข้ออ่าน "วันนี้" จากโมดูลเดียว (`clock`) | ทดสอบกฎที่ขึ้นกับวันเวลา (หมดอายุ · ยกเลิกก่อน 24 ชั่วโมง) ให้ได้ผลเดิมทุกครั้ง | ไม่ส่ง `now` → ใช้วันเริ่มที่เขียนใน seed · ปิด flag → ใช้เวลาจริง · ห้ามเรียก `Date.now()` / `DateTime.Now` ตรง ๆ ในกฎ |

แอปที่ไม่ใช่เว็บใช้แนวเดียวกัน: Flutter → `Key` / Semantics label ชื่อเดียวกัน · Android → `resource-id` · command line → ตัวเลือก `--now` หรือตัวแปร `APP_NOW` · reset บนมือถือเปิดได้เฉพาะ debug build

## SKILL.md ของ verify skill ต้องมี

- description บอกว่าใช้เมื่อ "ต้องพิสูจน์ว่าฟีเจอร์ใช้ได้บนแอปจริง · ทำบั๊กให้เกิดซ้ำ · ตรวจก่อนส่ง"
- คำสั่งเริ่ม · หยุด · ข้อมูลทดสอบ (บัญชีทดสอบอยู่ไฟล์ไหน — **ห้ามใส่รหัสผ่านจริง**)
- ลิงก์ไปแผนที่ฟีเจอร์
- ข้อห้าม: ไม่แตะฐานข้อมูลจริง · ไม่เรียก API ภายนอกที่เสียเงินหรือส่งข้อความจริง

## สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| เขียนขั้นตอนทดสอบเป็นภาษาคนอย่างเดียว ไม่มีสคริปต์ | agent แต่ละตัวจะสร้างวิธีรันใหม่เองทุกครั้ง และแต่ละครั้งไม่เหมือนกัน |
| ใส่ทุกฟีเจอร์ตั้งแต่วันแรก | แผนที่ใหญ่ที่ไม่ได้ทดสอบ เสียเร็วกว่าแผนที่เล็กที่ใช้ได้จริง |
| ให้ verify skill ชี้ไปที่ระบบจริง (production) | ตรวจไปตรวจมา กลายเป็นแก้ข้อมูลลูกค้า |
| บอกว่าเสร็จโดยไม่ได้ทำข้อ 7 | ยังไม่รู้ว่า agent ตัวอื่นใช้ได้หรือไม่ |

## เชื่อมกับ skill อื่น

- [`references/builtin-verify.md`](references/builtin-verify.md) — Claude Code มี `/verify` ติดเครื่อง: โปรเจกต์ที่รันบน Claude Code ให้สร้าง skill ชื่อ `verify` ที่ `.claude/skills/verify/SKILL.md` ในรูปแบบนั้น แทน `verify-<โปรเจกต์>`
- [`app-verifier-upkeep`](../app-verifier-upkeep/SKILL.md) — แก้เมื่อแอปเปลี่ยนจนแผนที่ไม่ตรง
- `e2e-testing-patterns` — ถ้าจะยกขั้นตอนบางส่วนขึ้นเป็น test อัตโนมัติใน continuous integration (CI)
- [`superuser`](../superuser/SKILL.md) — playbook `bug-fix` และ `feature` เรียกใช้ skill ที่สร้างจากที่นี่


## reference: android-native.md

# ขับแอป Android native / Flutter บน emulator

> สรุปจากแอปจริง `Lumio - Light Meter` (Flutter · Android) · สคริปต์ที่รันผ่านแล้วคือ `lumio-light-meter/test/e2e/verify.mjs`
> ค่าที่เขียนว่า "วัดแล้ว" มาจาก emulator บน Windows ที่ใช้ GPU แบบซอฟต์แวร์ เครื่องอื่นอาจเร็วกว่า

## เลือกวิธีขับ

| วิธี | ดีตรงไหน | ข้อจำกัด | ใช้เมื่อ |
|---|---|---|---|
| Node/Python เรียก `adb` + `uiautomator dump` | ไม่ต้องลงอะไรเพิ่ม · ขับ sensor และกล้องเสมือนได้ · ตรวจ `dumpsys` ได้ | อ่านหน้าจอ 3–4 วินาทีต่อครั้ง (วัดแล้ว) | ค่าเริ่ม · ทดสอบทั้งเส้นทาง hardware → native → Dart → จอ |
| Flutter `integration_test` (`flutter test integration_test/`) | หา widget ด้วย `find` ได้ตรง · เร็ว | ป้อนค่า sensor จริงไม่ได้ ต้องใช้แหล่งข้อมูลปลอม · ตรวจสถานะระบบ (กล้องถูกปล่อยไหม) ไม่ได้ | ลำดับหน้าจอยาว ๆ ที่ไม่แตะ hardware |
| Maestro | เขียน flow เป็น YAML อ่านง่าย | ต้องติดตั้งเพิ่ม · ยังไม่ได้ทดสอบในชุดนี้ | ทีมมี Maestro อยู่แล้ว |

## โครงสคริปต์ (แบบ verify.mjs)

1. **ตรวจก่อนเริ่ม** ว่ามีเครื่องต่ออยู่ (`adb devices`) และมี APK (`build/app/outputs/flutter-apk/app-debug.apk`) ถ้าไม่ครบ ให้ exit 1 พร้อมบอกคำสั่งที่ต้องรัน
2. **ติดตั้ง** `adb install -r <apk>` แล้ว **เริ่มสะอาดทุกฟีเจอร์** `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → รอข้อความหน้าแรก
3. **อ่านหน้าจอ** `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → ดึง `text` และ `content-desc` พร้อมจุดกึ่งกลางจาก `bounds`
4. **กด** `adb shell input tap x y` · **ป้อนค่า** `adb emu sensor set light <lux>` · **ถ่ายภาพ** `adb exec-out screencap -p > shot.png`
5. **ผล** `PASS/FAIL` พร้อม expected กับ actual และ exit 0 เฉพาะเมื่อมี check ได้รันอย่างน้อย 1 ข้อและผ่านทั้งหมด

## กฎที่ได้จากการรันจริง

| เรื่อง | ทำอย่างนี้ | เพราะ |
|---|---|---|
| ข้อความใน Flutter | ใส่ `Semantics(label: ...)` ให้ค่าที่ต้องตรวจ | label ขึ้นเป็น `content-desc` ใน `uiautomator dump` จึงใช้ตรวจได้ และช่วยผู้ใช้โปรแกรมอ่านจอด้วย |
| ไฟล์ dump เก่า | ลบ `/sdcard/ui.xml` ก่อน dump ทุกครั้ง | dump ล้มแล้ว**ไม่เขียนทับ**ไฟล์เดิม จะอ่านได้หน้าจอเก่าโดยไม่รู้ตัว |
| "could not get idle state" | ถือเป็นบั๊กของแอป แก้ที่แอป | แอปวาดใหม่ตลอด (Lumio วาด 5 ครั้ง/วินาทีทั้งที่ค่าไม่เปลี่ยน) ทำให้เปลืองแบต และ TalkBack พูดซ้ำ ให้แก้โดยแจ้ง UI เฉพาะเมื่อค่าที่แสดงเปลี่ยนจริง (sensor ที่ค่าแกว่ง: เปลี่ยนเกิน 1 %) ส่วนค่ารองที่ค่อย ๆ ขยับ ให้อัปเดตราว 1 วินาทีครั้ง |
| ตำแหน่งที่ขยับ | กดเมื่ออ่าน 2 ครั้งติดได้ตำแหน่งเดียวกัน | dialog เลื่อนขึ้นตอนคีย์บอร์ดเปิด ถ้ากดตำแหน่งเก่าจะโดนฉากหลังแล้ว dialog ปิด (น่าจะเป็นต้นเหตุของ flake (ผลไม่คงที่) ที่เหลือ 1 ครั้ง แต่ยังไม่ได้ตรวจซ้ำ) |
| สิทธิ์ | `adb shell pm grant <package> android.permission.CAMERA` ก่อน check ที่ไม่ได้ทดสอบหน้าขอสิทธิ์ | หน้าต่างขอสิทธิ์ของระบบไม่ใช่สิ่งที่ check นั้นตรวจ |
| check "ปล่อยแล้ว" | ตรวจเงื่อนไขก่อน (กล้องถูกถืออยู่) → กด Home → วนตรวจ `dumpsys media.camera` หา "Active Camera Clients" ทุก 1 วินาที นานสุด 20 วินาที | emulator ปล่อยกล้อง 5–8 วินาที (วัดแล้ว) ถ้าไม่ตรวจเงื่อนไขก่อน check จะผ่านทั้งที่ไม่ได้ตรวจอะไร |
| Git Bash | เรียก `adb` จาก Node/Python (`execFile`) หรือตั้ง `MSYS_NO_PATHCONV=1` | Git Bash แปลง `/sdcard/...` เป็น `C:/Program Files/Git/sdcard/...` |

## ป้อนค่า hardware

| สิ่งที่ป้อน | บน emulator | หมายเหตุ |
|---|---|---|
| sensor แสง | `adb emu sensor set light <lux>` แล้วแอปได้ค่าผ่าน `Sensor.TYPE_LIGHT` (วัดแล้ว) | sensor อื่นใช้ `adb emu sensor set <ชื่อ> <ค่า>` (ยังไม่ได้ตรวจทีละตัว) |
| กล้อง | กล้องหน้าเสมือนส่งภาพพร้อม ISO และเวลาเปิดรับแสง (วัดแล้ว) | ภาพเป็นฉากสังเคราะห์ จึงตรวจได้แค่ว่า "มีค่าออกมา" ตรวจความแม่นไม่ได้ |
| อื่น ๆ หรือ emulator ทำไม่ได้ | แหล่งข้อมูลปลอมที่ compile เข้าเฉพาะ debug build | ห้ามหลุดไป release build |

ติดป้ายทุก check: `emulator` แปลว่าทางเดินข้อมูลถูก ส่วน `เครื่องจริง` แปลว่าค่าถูก ถ้า check ไหนต้องใช้เครื่องจริงแต่ยังไม่ได้รัน ให้รายงานว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

## เวลาและหน่วยความจำ

| ขั้น | เวลาที่วัดได้ | ตั้ง timeout แยก |
|---|---|---|
| Gradle build ครั้งแรก (ดาวน์โหลด NDK · platform) | ~10 นาที | 20 นาที |
| Gradle build ครั้งต่อไป | 1–2 นาที | 5 นาที |
| boot emulator | หลายนาที (ยังไม่ได้จับเวลา) | วนตรวจ `adb shell getprop sys.boot_completed` = 1 |
| เปิดแอปจนเห็นหน้าแรก | ไม่กี่วินาที | 20 วินาที |
| ต่อ check (รอค่าบนจอ) | 3–4 วินาทีต่อการอ่าน | 15–20 วินาที |

- emulator กับ Gradle กินหน่วยความจำมาก จน Claude Code เคยปิด emulator ที่รันเบื้องหลังเพราะหน่วยความจำไม่พอ
- เปิด emulator ตัวเดียว และหยุด Gradle daemon หลัง build (`gradlew --stop` ใน `android/`)
- ถ้า emulator ถูกปิดกลางทาง ให้รายงานว่า "ยังไม่ได้รันซ้ำ" พร้อมรายชื่อ check ที่ไม่ได้รัน ห้ามลองใหม่เงียบ ๆ แล้วรายงานเฉพาะผลรอบหลัง
- ไม่มี Docker: emulator ใน Docker ต้องมี KVM ซึ่ง Docker Desktop บน Windows ไม่มี จึงให้รันบน host


## reference: builtin-verify.md

# `/verify` ที่มากับ Claude Code — กับ app-verifier ของเรา

ที่มา: code.claude.com/docs/en/skills (อ่าน 2026-10-23) · ตัวเลขรุ่นที่อ้างมาจากหน้านั้น ไม่ได้ทดสอบกับทุกรุ่น

## สิ่งที่ Claude Code มีอยู่แล้ว

- skill ติดเครื่อง 3 ตัวทำงานด้วยกัน: `/run` เปิดและขับแอปให้เห็นว่าการแก้ใช้ได้ · `/verify` build แล้วรันแอปเพื่อยืนยันว่าโค้ดที่แก้ทำสิ่งที่ควรทำ โดยไม่ถอยไปพึ่ง test หรือ type check · `/run-skill-generator` สอน 2 ตัวแรกว่า build และเปิดโปรเจกต์นี้อย่างไร
- `/verify` และ `/code-review` รันเมื่อผู้ใช้เรียกเท่านั้น (ตั้งแต่ v2.1.215 — ก่อนหน้านั้น Claude เรียกเองได้)
- `/run-skill-generator` รันจาก environment สะอาด จดสิ่งที่ใช้ได้จริง (คำสั่งติดตั้ง · env · สคริปต์เปิด) แล้ว commit เป็น skill ของโปรเจกต์ที่ `.claude/skills/run-<name>/` — รันครั้งเดียวต่อโปรเจกต์ และอีกครั้งเมื่อวิธี build เปลี่ยน
- `/verify` จดสูตรของตัวเองได้: ถ้าไม่มีสูตร มันเขียนสิ่งที่ใช้ได้ลง `.claude/skills/verify/SKILL.md` ที่รากโปรเจกต์ (monorepo: ในโฟลเดอร์ package ที่แตะ) · **skill ที่รากชื่อ `verify` แทนที่ `/verify` ติดเครื่อง**
- session ที่เริ่มโดยมี skill ชื่อ `verify` หรือ `simplify` ของโปรเจกต์ (หรือส่วนตัว · องค์กร · `.claude/commands/`) → คำสั่ง commit ของ Claude Code สั่งให้รันก่อนทุก commit ยกเว้นแก้เฉพาะเอกสารหรือ test · ตัวติดเครื่อง · plugin skill · skill จาก claude.ai ไม่นับ
- ปิดทั้งชุดได้ด้วย `disableBundledSkills` (เหลือ `/doctor`)

## สิ่งที่ `app-verifier-setup` เพิ่มให้

| ของเรา | ตัวติดเครื่องไม่มี |
|---|---|
| สัญญาสำหรับทดสอบในแอป: `data-testid` · `data-ready` · reset endpoint ใต้ flag · นาฬิกาล็อกได้ (`clock`) | มันขับแอปจากสิ่งที่เห็น ไม่ได้บังคับให้แอปเตรียมที่ยึด |
| แผนที่ฟีเจอร์เป็นข้อมูลในสคริปต์ `test/e2e/verify.*` พิมพ์ `PASS/FAIL` พร้อม expected กับ actual · ตรวจ 0 รายการ = exit 1 | สูตรเป็นภาษาคนใน SKILL.md |
| พิสูจน์ว่าจับของผิดได้ (ทำให้พัง 1 จุด ต้อง FAIL) และ agent `qa-tester` ตัวใหม่ใช้ได้จริง | — |
| หลักฐานทุกรอบใน `_to_delete/verify-runs/` · ขับมือถือ native · CLI · API ได้ ไม่ใช่แค่เว็บ | — |

## ตัดสินใจ

**โปรเจกต์ที่ทำงานบน Claude Code ที่มี `/verify` ติดเครื่อง → `app-verifier-setup` สร้าง skill ของโปรเจกต์ที่ `.claude/skills/verify/SKILL.md` (ชื่อ `verify` ไม่ใช่ `verify-<โปรเจกต์>`) ในรูปแบบสูตรที่ `/verify` จดเอง** — ส่วนแรกคือสูตร build และเปิดแอป (แบบเดียวกับที่ `/run-skill-generator` จด) ต่อด้วยของเรา: คำสั่งรัน `test/e2e/verify.*` · ลิงก์แผนที่ฟีเจอร์ · สัญญาสำหรับทดสอบ · ข้อห้าม (หัวข้อ "SKILL.md ของ verify skill ต้องมี" ใน SKILL.md หลัก) · ได้ 2 อย่างฟรี: แทนที่ตัวติดเครื่อง และถูกรันก่อน commit อัตโนมัติ

- ก่อนเขียน ให้อ่าน `.claude/skills/verify/SKILL.md` หรือ `run-<name>/` ที่ `/verify` จดไว้แล้ว (ถ้ามี) แล้วเขียนต่อในรูปแบบเดียวกัน — ฟิลด์ frontmatter ที่ตัวติดเครื่องใช้ยังไม่ได้ตรวจจากเอกสาร (ยังไม่ได้ตรวจ)
- monorepo → วางในโฟลเดอร์ package ที่แตะ ตามกติกาของตัวติดเครื่อง
- Codex · Gemini หรือ Claude Code รุ่นก่อน v2.1.145 (ยังไม่ได้ตรวจว่า `/verify` เริ่มรุ่นไหน) → ใช้ชื่อเดิม `verify-<โปรเจกต์>` ใน `.claude/skills/` · `.agents/skills/` · `skills/`
- `app-verifier-upkeep` ดูแลไฟล์นี้ไฟล์เดียว ไม่สร้าง `verify-<โปรเจกต์>` ซ้อน
