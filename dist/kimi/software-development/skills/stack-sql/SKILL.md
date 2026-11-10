---
name: stack-sql
description: Use when writing or reviewing SQL queries, procedures or data-change scripts (SQL Server, PostgreSQL, MySQL).
---

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
