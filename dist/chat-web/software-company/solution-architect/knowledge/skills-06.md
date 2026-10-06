# skill: principle-rules-as-checks-not-text

Use when writing the same agent instruction a second time, adding another must-not line, or seeing a correction recur. Encode the rule as structure (folder layout, type, lint, runtime check, script) instead of more text.

# principle · rules as checks, not text — กฎที่ต้องพูดซ้ำ ทำเป็นการตรวจ

> ยิ่งเขียนกฎลงข้อความมาก ยิ่งมีโอกาสที่ agent อ่านข้าม และกฎจะเริ่มขัดกันเอง
> กฎที่เป็นการตรวจ ไม่ต้องจำ — ชนแล้วถูกหยุด และข้อความ error บอกทางแก้

## ลำดับชั้น — เลือกชั้นบนสุดที่ทำได้

1. **โครงสร้าง** — ทำให้ทางผิดไม่มีอยู่ (ฟีเจอร์ละโฟลเดอร์ · ทางทำทางเดียว · ลบ API เก่า)
2. **type** — compiler ไม่ยอม
3. **lint หรือสคริปต์ตรวจ** — ข้อความ error ต้องบอกวิธีแก้ ไม่ใช่แค่บอกว่าผิด
4. **ตรวจตอนรันหรือ test** — ล้มทันทีเมื่อเกิด
5. **ข้อความใน skill หรือ prompt** — ทางสุดท้าย และต้องอยู่ที่เดียว

## สัญญาณ

- กฎเดียวกันอยู่ในหลายไฟล์ (เช่น เขียนซ้ำในทุก prompt) → ย้ายไปไว้ที่เดียว แล้วให้ที่อื่นอ้างถึง
- ข้อความ "ห้าม..." ที่ตรวจด้วย grep ได้ → ทำเป็นสคริปต์ใน CI
- ผู้ใช้แก้เรื่องเดิมครั้งที่สอง → [`repeated-mistakes-to-checks`](../repeated-mistakes-to-checks/SKILL.md)

## ตัวอย่างในชุดนี้

| กฎ | เคยเป็นข้อความ | ตอนนี้เป็น |
|---|---|---|
| description ของ skill ห้ามมี `": "` โดยไม่ครอบเครื่องหมายคำพูด | คำเตือนในเอกสาร | `scripts/validate-marketplace.mjs` + `--self-test` |
| ตัวเลขใน README ต้องตรงกับของจริง | แก้มือ | `scripts/sync-docs.mjs --check` |


---

# skill: database-design

Use when designing or changing a database schema (tables, columns, indexes, relationships, migrations). Naming, identifiers, data types, indexes, constraints, expand-and-contract migrations, multi-tenancy. Load before CREATE TABLE.

# ออกแบบฐานข้อมูล

> **กฎข้อเดียว:** schema คือของที่แก้ยากที่สุดในระบบ
> โค้ดผิดแก้วันนี้จบวันนี้ · schema ผิดอยู่กับมันสามปี พร้อมข้อมูลจริงอีกสิบล้านแถวที่ต้องย้ายตาม

## เมื่อไหร่ใช้ skill นี้

- ออกแบบฐานข้อมูลของระบบใหม่ หรือ module ใหม่
- จะเพิ่ม/แก้ตาราง คอลัมน์ ความสัมพันธ์ หรือ index
- จะเขียน migration โดยเฉพาะตอนที่ระบบมีข้อมูลจริงแล้ว
- query ช้าแล้วสงสัยว่าเป็นที่ schema หรือที่ index

## เมื่อไหร่ **ไม่** ใช้

| โจทย์ | ไปที่ |
|---|---|
| เลือกสถาปัตยกรรมภาพรวม | `architecture-patterns` |
| ออกแบบ endpoint และรูปร่าง JSON | `api-conventions` |
| เก็บรหัสผ่าน token สิทธิ์ผู้ใช้ | `auth-implementation-patterns` |
| ที่เก็บ connection string | `config-and-secrets` |
| รัน migration ใน pipeline | `cicd-and-release` |

---

## 1 · เลือกชนิดฐานข้อมูลก่อน

| เกณฑ์ | Relational (PostgreSQL, SQL Server, MySQL) | Document (MongoDB) |
|---|---|---|
| ข้อมูลมีความสัมพันธ์ชัด ต้อง join | ✅ | ❌ ต้องทำมือ |
| รูปร่างข้อมูลไม่แน่นอน ต่างกันรายตัว | ⚠️ ใช้คอลัมน์ JSON | ✅ |
| ต้องการ transaction ข้ามหลายตาราง | ✅ | ⚠️ ได้แต่แพงกว่า |
| รายงาน ผลรวม การวิเคราะห์ | ✅ | ❌ |
| เขียนหนักมาก log/telemetry | ⚠️ | ✅ หรือใช้ time-series |

> **ค่าเริ่มต้นคือ relational** — เลือก document เมื่อ**ตอบได้ว่าทำไม**
> "ยืดหยุ่นกว่า" ไม่ใช่เหตุผล แปลว่ายังไม่ได้ออกแบบ
> ระบบส่วนใหญ่ที่เลือก document เพราะยืดหยุ่น สุดท้ายเขียนโค้ด join เองในแอป

**ผสมกันได้** — ใช้ relational เป็นหลัก แล้วเก็บของที่รูปร่างไม่แน่นอนเป็นคอลัมน์ `jsonb`
ตัวเลือกนี้ดีกว่าแยกฐานข้อมูลสองตัวเกือบทุกกรณี

---

## 2 · กฎตั้งชื่อ — เลือกครั้งเดียว ใช้ทั้งระบบ

| สิ่งที่ตั้งชื่อ | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ตาราง | `snake_case` **พหูพจน์** | `orders`, `order_items` |
| คอลัมน์ | `snake_case` เอกพจน์ | `created_at`, `total_amount` |
| primary key | `id` | `id` |
| foreign key | `<ตารางเอกพจน์>_id` | `customer_id` |
| ตารางเชื่อม | `<a>_<b>` เรียงตามตัวอักษร | `role_users` → `user_roles` |
| index | `ix_<ตาราง>_<คอลัมน์>` | `ix_orders_customer_id` |
| unique | `ux_<ตาราง>_<คอลัมน์>` | `ux_users_email` |
| foreign key constraint | `fk_<ตาราง>_<ตารางปลายทาง>` | `fk_orders_customers` |
| check constraint | `ck_<ตาราง>_<เรื่อง>` | `ck_orders_total_non_negative` |

**สิ่งที่ห้ามทำ:**

- ❌ ใส่ชนิดข้อมูลในชื่อ — `name_varchar`, `is_active_bit`
- ❌ ใส่ชื่อตารางนำหน้าคอลัมน์ — `order_order_date` (มันอยู่ในตาราง `orders` อยู่แล้ว)
- ❌ ใช้คำสงวน — `user`, `order`, `group`, `key` ต้องใส่เครื่องหมายคำพูดทุกครั้ง ใช้ `users`, `orders` แทน
- ❌ ตัวย่อที่คนอ่านไม่ออก — `cst_nm` ประหยัดได้ 8 ตัวอักษร แลกกับความสับสนสามปี

> SQL Server ที่ใช้ `PascalCase` ก็ได้ ถ้าโปรเจกต์เดิมใช้อยู่แล้ว
> **ความสม่ำเสมอสำคัญกว่ารูปแบบไหนถูก** — อย่าเปลี่ยนกลางทาง

---

## 3 · คอลัมน์ที่ทุกตารางต้องมี

```sql
id           bigint / uuid   PRIMARY KEY
created_at   timestamptz     NOT NULL DEFAULT now()
updated_at   timestamptz     NOT NULL DEFAULT now()
```

เพิ่มตามความจำเป็น:

| คอลัมน์ | ใส่เมื่อ | หมายเหตุ |
|---|---|---|
| `deleted_at timestamptz` | ต้องกู้ข้อมูลคืนได้ หรือกฎหมายบังคับให้เก็บ | **ทุก query ต้องกรอง** ไม่งั้นข้อมูลที่ลบแล้วโผล่ |
| `created_by` / `updated_by` | ต้องตอบได้ว่าใครแก้ | เก็บ id ผู้ใช้ ไม่ใช่ชื่อ |
| `row_version` / `xmin` | มีคนแก้พร้อมกันได้ | ใช้คู่กับ ETag ใน `api-conventions` |
| `tenant_id` | ระบบหลายผู้เช่า | ดูข้อ 10 |

> 🚨 **soft delete ไม่ใช่ของฟรี** — ทุก unique constraint ต้องคิดใหม่
> `ux_users_email` จะกันไม่ให้สมัครอีเมลเดิมซ้ำ แม้บัญชีเก่าถูกลบไปแล้ว
> แก้ด้วย partial index — `CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`

---

## 4 · เลือกชนิด identifier

| ชนิด | ข้อดี | ข้อเสีย | ใช้เมื่อ |
|---|---|---|---|
| `bigint` เรียงเพิ่ม | เล็ก เร็ว index ไม่แตก อ่านง่ายตอนไล่ปัญหา | เดา id ถัดไปได้ · รวมข้อมูลหลายที่แล้วชนกัน | ค่าเริ่มต้น ระบบเดียว ฐานข้อมูลเดียว |
| **UUIDv7 / ULID** | เรียงตามเวลา · สร้างจากฝั่งแอปได้ · ไม่ชนกัน | 16 ไบต์ · อ่านด้วยตายาก | ระบบกระจาย · ต้องสร้าง id ก่อนบันทึก · id โผล่ใน URL |
| `UUIDv4` สุ่มล้วน | ไม่ชนกัน เดาไม่ได้ | **index แตกกระจาย เขียนช้าลงชัดเจนเมื่อข้อมูลเยอะ** | เลี่ยงถ้าเลือกได้ |

> 🚨 **UUIDv4 เป็น primary key คือกับดักที่เจอบ่อยที่สุด**
> ค่าสุ่มล้วนทำให้ทุกการ insert ไปแทรกกลางโครงสร้าง index
> ตอนข้อมูลหลักหมื่นไม่รู้สึก ตอนหลักสิบล้านคือช้าจนต้องรื้อ
> ถ้าต้องใช้ UUID ให้ใช้ **v7** ซึ่งขึ้นต้นด้วยเวลา จึงเรียงเพิ่มเหมือน bigint

**เลขที่คนเห็น ≠ primary key** — เลขใบสั่งซื้อ `SO-2026-00042` ที่ลูกค้าอ้างถึง
ให้เป็นคอลัมน์ต่างหากที่มี unique constraint ไม่ใช่เอา primary key ไปโชว์

---

## 5 · normalisation แค่ไหนพอ

**เริ่มที่ 3NF เสมอ** — ข้อเท็จจริงหนึ่งอย่างเก็บที่เดียว

denormalise ได้เมื่อครบสามข้อนี้เท่านั้น:

1. วัดแล้วว่าช้าจริง (มีตัวเลข ไม่ใช่ความรู้สึก)
2. รู้ว่าข้อมูลซ้ำจะถูกอัปเดตยังไงให้ตรงกัน
3. เขียนเหตุผลไว้ในคอมเมนต์ของตาราง

**ยกเว้นที่ยอมรับกันทั่วไป** — ข้อมูลที่ต้อง "แช่แข็ง" ณ เวลาหนึ่ง:
ราคาสินค้าในใบสั่งซื้อต้องคัดลอกลง `order_items.unit_price`
ไม่ใช่ join ไปหา `products.price` เพราะราคาวันนี้ไม่ใช่ราคาวันที่ลูกค้าซื้อ

---

## 6 · สี่ชนิดข้อมูลที่พลาดกันประจำ

### เงิน

```sql
total_amount   numeric(19,4)   NOT NULL      -- ✅
currency       char(3)         NOT NULL      -- ✅ ISO 4217 เช่น THB
total_amount   float / double                -- ❌ 0.1 + 0.2 ไม่เท่ากับ 0.3
```

> ❌ **float กับเงินคือบั๊กที่หาไม่เจอ** — ยอดรวมเพี้ยนไปสตางค์เดียวต่อรายการ
> พอปิดงบสิ้นเดือนถึงรู้ แล้วไล่ย้อนไม่ได้ว่าเพี้ยนตรงไหน

### เวลา

| เก็บ | ใช้ | เหตุผล |
|---|---|---|
| เวลาที่เกิดเหตุการณ์ | `timestamptz` (SQL Server ใช้ `datetimeoffset`) เก็บเป็น UTC | ประเทศไทยไม่มี daylight saving แต่ระบบที่ขายต่างประเทศมี |
| วันเกิด วันครบกำหนด | `date` | ไม่มีเวลา ไม่มีโซนเวลา |
| ช่วงเวลาเปิดร้าน | `time` + คอลัมน์โซนเวลาแยก | |

**กฎ:** เก็บ UTC · แปลงเป็น `+07:00` ตอนแสดงผลเท่านั้น · ห้ามเก็บเวลาไทยดิบ ๆ ใน `timestamp` ที่ไม่มีโซน

**พุทธศักราช** — เก็บเป็น ค.ศ. เสมอ แปลงเป็น พ.ศ. ตอนแสดงผล
ฐานข้อมูลที่เก็บปี 2569 จะคำนวณช่วงเวลาผิดทุกฟังก์ชัน

### enum / สถานะ

| วิธี | ดีเมื่อ | เสียเมื่อ |
|---|---|---|
| ตาราง lookup + foreign key | ค่าเพิ่มได้โดยไม่ deploy · มีชื่อไทย/อังกฤษ · มีลำดับการแสดง | ต้อง join |
| `check constraint` เป็นข้อความ | ค่าคงที่ ไม่ค่อยเปลี่ยน | เพิ่มค่าต้อง migration |
| ชนิด `enum` ของ PostgreSQL | เร็ว เล็ก | **ลบค่าออกไม่ได้** เปลี่ยนลำดับไม่ได้ |
| `int` ดิบ ๆ | — | ❌ อ่าน `status = 3` แล้วไม่มีใครรู้ว่าอะไร |

### boolean

- ตั้งชื่อเป็นประโยคบอกเล่าเชิงบวก — `is_active` ✅ · `is_not_disabled` ❌
- **ถ้าอาจมีสถานะที่สามในอนาคต อย่าใช้ boolean** — `is_approved` จะกลายเป็น `approval_status`
  ในหกเดือน เมื่อมี "รออนุมัติ" เพิ่มมา

---

## 7 · index — วางตรงไหนถึงได้ผล

**ต้องมี:**

- ทุก foreign key (ฐานข้อมูลส่วนใหญ่ **ไม่สร้างให้อัตโนมัติ**)
- คอลัมน์ที่ปรากฏใน `WHERE` ของ query ที่วิ่งบ่อย
- คอลัมน์ที่ใช้ `ORDER BY` คู่กับ pagination

**composite index — ลำดับคอลัมน์สำคัญ:**

```sql
-- query: WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX ix_orders_tenant_status_created
  ON orders (tenant_id, status, created_at DESC);
```

ลำดับคือ **เท่ากับ → ช่วง → เรียงลำดับ**
index `(a, b)` ใช้กับ query ที่กรองด้วย `a` อย่างเดียวได้ แต่กรองด้วย `b` อย่างเดียว**ไม่ได้**

**อย่าใส่ index เมื่อ:**

- ตารางเล็กกว่าไม่กี่พันแถว — ฐานข้อมูลอ่านทั้งตารางเร็วกว่า
- คอลัมน์มีค่าซ้ำเยอะ เช่น `is_active` ที่ 95% เป็น true
- ตารางเขียนหนักกว่าอ่านมาก — ทุก index คือต้นทุนที่จ่ายทุกครั้งที่เขียน

> **วัดก่อนเดา** — `EXPLAIN ANALYZE` (PostgreSQL) หรือ execution plan (SQL Server)
> บอกได้ว่า index ถูกใช้จริงไหม การเดาว่า "น่าจะช่วย" ผิดบ่อยกว่าถูก

---

## 8 · constraint อยู่ที่ฐานข้อมูล ไม่ใช่แค่ที่แอป

| กฎ | ที่ควรอยู่ |
|---|---|
| อีเมลห้ามซ้ำ | `UNIQUE` ที่ฐานข้อมูล **และ** ตรวจในแอปเพื่อให้ข้อความ error สวย |
| ยอดเงินห้ามติดลบ | `CHECK (total_amount >= 0)` |
| ใบสั่งซื้อต้องมีลูกค้าจริง | `FOREIGN KEY` |
| สถานะต้องเป็นค่าที่กำหนด | `CHECK` หรือ lookup table |

> **เหตุผล:** แอปไม่ใช่ทางเดียวที่แตะข้อมูล — ยังมี script แก้ข้อมูลด่วน
> งาน import ตอนตีสาม และ service ตัวที่สองที่เขียนทีหลัง
> constraint ที่ฐานข้อมูลคือด่านสุดท้ายที่ไม่มีใครข้ามได้

**`ON DELETE` ต้องเลือกอย่างตั้งใจ:**

| ตัวเลือก | ความหมาย | ใช้กับ |
|---|---|---|
| `RESTRICT` (ค่าเริ่มต้นที่ควรใช้) | ลบไม่ได้ถ้ายังมีลูก | เกือบทุกกรณี |
| `CASCADE` | ลบลูกตามทั้งหมด | ของที่เป็นส่วนประกอบจริง ๆ เช่น `order_items` |
| `SET NULL` | ลูกกลายเป็นไม่มีพ่อ | ความสัมพันธ์ที่ไม่บังคับ |

`CASCADE` ผิดที่เดียว = ลบลูกค้าหนึ่งคนแล้วประวัติการซื้อสิบปีหายตาม

---

## 9 · migration — เปลี่ยน schema โดยไม่ต้องปิดระบบ

**กฎสามข้อ:**

1. **เดินหน้าอย่างเดียว** — migration ที่ merge แล้วห้ามแก้ ถ้าผิดให้เขียนตัวใหม่ทับ
2. **หนึ่ง migration ทำเรื่องเดียว** — ไล่ปัญหาง่าย rollback ตรงจุด
3. **โค้ดเวอร์ชันเก่ากับ schema เวอร์ชันใหม่ต้องอยู่ด้วยกันได้** — ระหว่าง deploy มีทั้งสองเวอร์ชันวิ่งพร้อมกันเสมอ

### expand / contract — ขั้นตอนมาตรฐานสำหรับการเปลี่ยนที่ทำลายของเดิม

ตัวอย่าง: เปลี่ยนชื่อคอลัมน์ `name` → `full_name`

| รอบ deploy | ฐานข้อมูล | โค้ด |
|:--:|---|---|
| **1 · ขยาย** | เพิ่ม `full_name` (nullable) | เขียนลงทั้งสองคอลัมน์ · อ่านจาก `name` |
| **2 · ย้าย** | คัดลอกข้อมูลเก่าเป็นชุด ๆ | อ่านจาก `full_name` ถ้าไม่มีค่อยดู `name` |
| **3 · บีบ** | ตั้ง `NOT NULL` · ลบ `name` | อ่านและเขียน `full_name` อย่างเดียว |

ทำสามรอบดูเสียเวลา แต่แต่ละรอบ rollback ได้โดยไม่เสียข้อมูล
การทำรอบเดียวคือการยอมรับว่าจะปิดระบบ

**คำสั่งที่ล็อกตารางจนระบบค้าง** (ระวังเป็นพิเศษบนตารางใหญ่):

- เพิ่มคอลัมน์ที่มี `DEFAULT` และ `NOT NULL` พร้อมกัน — PostgreSQL รุ่นใหม่ทำได้เร็ว แต่ MySQL ยังเขียนใหม่ทั้งตาราง
- เปลี่ยนชนิดข้อมูล
- สร้าง index ธรรมดา → ใช้ `CREATE INDEX CONCURRENTLY` (PostgreSQL) หรือ `ONLINE = ON` (SQL Server)

**ทดสอบ migration กับสำเนาข้อมูลจริงเสมอ** — migration ที่รัน 0.2 วินาทีบนเครื่องตัวเอง
อาจใช้ 40 นาทีบน production พร้อมล็อกตารางไว้ตลอด

---

## 10 · ระบบหลายผู้เช่า (multi-tenant)

| แบบ | แยกกันแค่ไหน | ต้นทุน | เหมาะกับ |
|---|---|---|---|
| คอลัมน์ `tenant_id` ในทุกตาราง | ต่ำ — พลาดที่เดียวข้อมูลรั่วข้ามผู้เช่า | ถูกสุด | ผู้เช่าเยอะ ข้อมูลต่อรายไม่ใหญ่ |
| schema แยกต่อผู้เช่า | กลาง | migration ต้องวนทุก schema | ผู้เช่าหลักสิบถึงหลักร้อย |
| ฐานข้อมูลแยกต่อผู้เช่า | สูงสุด | แพงสุด | ลูกค้าองค์กรที่บังคับให้แยก |

> 🚨 ถ้าเลือกแบบ `tenant_id` — **บังคับที่ชั้นล่างสุด ไม่ใช่ที่ query แต่ละตัว**
> ใช้ row-level security ของฐานข้อมูล หรือ global filter ของ ORM
> เพราะ query ที่ลืมใส่ `WHERE tenant_id = ?` แค่ตัวเดียว คือข้อมูลลูกค้ารายหนึ่งโผล่ให้อีกรายเห็น
> และมันจะไม่มี error ให้เห็นเลย

---

## 11 · ข้อมูลส่วนบุคคล

- ทำรายการไว้ว่า **คอลัมน์ไหนคือข้อมูลส่วนบุคคล** — ตอบคำถาม "ข้อมูลฉันอยู่ที่ไหนบ้าง" ไม่ได้ถ้าไม่มีรายการนี้
- เลขบัตรประชาชน หมายเลขบัตรเครดิต ข้อมูลสุขภาพ — เข้ารหัสระดับคอลัมน์ หรือไม่เก็บเลยถ้าไม่จำเป็น
- กำหนด **อายุการเก็บ** ต่อตาราง และมีงานลบจริงตามนั้น
- ต้องลบได้เมื่อเจ้าของขอ — soft delete อย่างเดียวไม่นับว่าลบ
- ห้ามคัดลอกข้อมูลจริงลงเครื่อง developer โดยไม่ปิดบัง

---

## 12 · Anti-patterns

- ❌ **ตารางเดียวเก็บทุกอย่าง** (`entity` / `attribute` / `value`) — query อะไรก็ยากไปหมด
- ❌ **`varchar(255)` ทุกคอลัมน์** — ตัวเลขนี้ไม่ได้มีความหมายอะไรเลย กำหนดจากข้อมูลจริง
- ❌ **เก็บหลายค่าในคอลัมน์เดียว** — `"1,4,7"` ค้นไม่ได้ constraint ไม่ได้ ใช้ตารางเชื่อม
- ❌ **ไม่มี foreign key เพราะ "แอปดูแลเอง"** — แล้ววันหนึ่งก็มีแถวกำพร้า
- ❌ **index ทุกคอลัมน์เผื่อไว้** — เขียนช้าลง พื้นที่บาน โดยไม่มีใครได้ประโยชน์
- ❌ **`SELECT *` ในโค้ดจริง** — เพิ่มคอลัมน์ทีไรโค้ดพังทุกที
- ❌ **ตรรกะธุรกิจใน trigger** — ไล่ปัญหาไม่เจอ เพราะไม่มีใครเห็นว่ามันทำงาน
- ❌ **migration ที่เขียนข้อมูลด้วย** ปนกับที่เปลี่ยนโครงสร้าง — rollback แล้วข้อมูลหาย
- ❌ **แก้ schema บน production ด้วยมือ** — รอบหน้าที่ deploy จะไม่ตรงกัน

---

## 13 · ตัวย่อ

- **3NF** — Third Normal Form (การจัดตารางให้ข้อเท็จจริงหนึ่งอย่างเก็บที่เดียว)
- **UUID** — Universally Unique Identifier (รหัสสุ่มยาวที่ไม่ชนกันแม้สร้างคนละเครื่อง)
- **ULID** — Universally Unique Lexicographically Sortable Identifier (UUID ที่เรียงตามเวลาได้)
- **ORM** — Object-Relational Mapper (ตัวแปลงระหว่างตารางกับ object ในโค้ด)
- **PDPA** — Personal Data Protection Act (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล)

## 14 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปร่าง JSON ที่ API ส่งออก | `api-conventions` |
| รัน migration ตอน deploy | `cicd-and-release` |
| ที่เก็บ connection string | `config-and-secrets` |
| ตาราง user, role, session | `auth-implementation-patterns` |
| วาดผัง ER | `svg-diagram-system` หรือ `markdown-visuals` |
| บันทึกเหตุผลที่เลือกฐานข้อมูลตัวนี้ | `adr-writer` |

**ไวยากรณ์เฉพาะแต่ละฐานข้อมูล ชนิดข้อมูลเทียบกัน และคำสั่ง migration ของแต่ละ ORM** → `references/per-stack.md`


## reference: per-stack.md

# ไวยากรณ์และเครื่องมือแยกตามฐานข้อมูล/ORM

1. [ชนิดข้อมูลเทียบกัน](#1--ชนิดข้อมูลเทียบกัน)
2. [PostgreSQL](#2--postgresql)
3. [SQL Server](#3--sql-server)
4. [MySQL / MariaDB](#4--mysql--mariadb)
5. [MongoDB](#5--mongodb)
6. [Entity Framework Core (.NET)](#6--entity-framework-core-net)
7. [Prisma / Drizzle (Node)](#7--prisma--drizzle-node)
8. [Alembic (Python)](#8--alembic-python)
9. [คำสั่งตรวจ query ช้า](#9--คำสั่งตรวจ-query-ช้า)

---

## 1 · ชนิดข้อมูลเทียบกัน

| ต้องการเก็บ | PostgreSQL | SQL Server | MySQL |
|---|---|---|---|
| id เรียงเพิ่ม | `bigint GENERATED ALWAYS AS IDENTITY` | `bigint IDENTITY(1,1)` | `BIGINT AUTO_INCREMENT` |
| UUID | `uuid` | `uniqueidentifier` | `BINARY(16)` หรือ `CHAR(36)` |
| เงิน | `numeric(19,4)` | `decimal(19,4)` | `DECIMAL(19,4)` |
| เวลา + โซนเวลา | `timestamptz` | `datetimeoffset(3)` | `TIMESTAMP` (เก็บ UTC) |
| วันที่ล้วน | `date` | `date` | `DATE` |
| ข้อความยาวไม่จำกัด | `text` | `nvarchar(max)` | `TEXT` / `LONGTEXT` |
| ข้อความไทย | `text` (UTF-8 อยู่แล้ว) | **`nvarchar` เท่านั้น** | `utf8mb4` |
| จริง/เท็จ | `boolean` | `bit` | `TINYINT(1)` |
| JSON | `jsonb` (มี index ได้) | `nvarchar(max)` + `JSON_VALUE` | `JSON` |
| ไฟล์ไบนารี | `bytea` (หรือเก็บนอกฐานข้อมูล) | `varbinary(max)` | `BLOB` |

> 🚨 **SQL Server + ภาษาไทย** — `varchar` ทำให้ตัวอักษรไทยกลายเป็น `?`
> ต้องใช้ `nvarchar` และเขียนค่าคงที่เป็น `N'ข้อความ'` เสมอ
>
> 🚨 **MySQL ต้องเป็น `utf8mb4`** — ชุดอักขระที่ชื่อ `utf8` เฉย ๆ ของ MySQL
> เก็บได้แค่ 3 ไบต์ ทำให้อีโมจิและอักขระบางตัวหาย

---

## 2 · PostgreSQL

```sql
CREATE TABLE orders (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no      varchar(20)  NOT NULL,
  customer_id   bigint       NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status        varchar(20)  NOT NULL DEFAULT 'draft',
  total_amount  numeric(19,4) NOT NULL DEFAULT 0,
  currency      char(3)      NOT NULL DEFAULT 'THB',
  meta          jsonb,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0),
  CONSTRAINT ck_orders_status CHECK (status IN ('draft','confirmed','shipped','cancelled'))
);

CREATE UNIQUE INDEX ux_orders_order_no ON orders (order_no) WHERE deleted_at IS NULL;
CREATE INDEX ix_orders_customer_id ON orders (customer_id);
CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC);
```

**สร้าง index โดยไม่ล็อกตาราง:**

```sql
CREATE INDEX CONCURRENTLY ix_orders_status ON orders (status);
-- ห้ามอยู่ใน transaction · ถ้าล้มจะเหลือ index สถานะ invalid ต้อง DROP แล้วทำใหม่
```

**อัปเดต `updated_at` อัตโนมัติ:**

```sql
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_touch BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

**row-level security สำหรับระบบหลายผู้เช่า:**

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::bigint);
-- แอปตั้งค่าต่อ connection: SET app.tenant_id = '42';
```

---

## 3 · SQL Server

```sql
CREATE TABLE orders (
  id            bigint IDENTITY(1,1) PRIMARY KEY,
  order_no      nvarchar(20)   NOT NULL,
  customer_id   bigint         NOT NULL,
  status        nvarchar(20)   NOT NULL CONSTRAINT df_orders_status DEFAULT N'draft',
  total_amount  decimal(19,4)  NOT NULL CONSTRAINT df_orders_total DEFAULT 0,
  created_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_created DEFAULT sysdatetimeoffset(),
  updated_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_updated DEFAULT sysdatetimeoffset(),
  row_version   rowversion,
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0)
);

CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC)
  WITH (ONLINE = ON);   -- Enterprise / Azure SQL เท่านั้น
```

- `rowversion` ใช้เป็น ETag สำหรับตรวจการแก้ชนกันได้ตรง ๆ
- เรียงลำดับภาษาไทย ให้ตั้ง collation `Thai_100_CI_AS` ที่ระดับคอลัมน์หรือฐานข้อมูล
- `datetime` แบบเก่ามีความละเอียดแค่ 3.33 มิลลิวินาที — ใช้ `datetime2` / `datetimeoffset` แทน

---

## 4 · MySQL / MariaDB

```sql
CREATE TABLE orders (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_no     VARCHAR(20)   NOT NULL,
  customer_id  BIGINT        NOT NULL,
  total_amount DECIMAL(19,4) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_orders_order_no (order_no),
  KEY ix_orders_customer_id (customer_id),
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

- `ALTER TABLE` ส่วนใหญ่เขียนตารางใหม่ทั้งตาราง — ตารางใหญ่ให้ใช้ `pt-online-schema-change` หรือ `gh-ost`
- ตั้งเวลาเซิร์ฟเวอร์เป็น UTC (`default_time_zone = '+00:00'`)

---

## 5 · MongoDB

```js
db.createCollection("orders", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["orderNo", "customerId", "totalAmount", "createdAt"],
    properties: {
      orderNo:     { bsonType: "string" },
      customerId:  { bsonType: "objectId" },
      totalAmount: { bsonType: "decimal" },   // ❌ อย่าใช้ double กับเงิน
      createdAt:   { bsonType: "date" }
    }
  }}
});
db.orders.createIndex({ orderNo: 1 }, { unique: true });
db.orders.createIndex({ customerId: 1, createdAt: -1 });
```

- ฝัง (embed) เมื่อข้อมูลลูก **อ่านคู่กับพ่อเสมอและไม่โตไม่จำกัด** · นอกนั้นให้อ้างอิง
- เอกสารหนึ่งใบมีเพดาน 16 MB — อาเรย์ที่โตเรื่อย ๆ จะชนเพดานวันหนึ่ง
- `Decimal128` เท่านั้นสำหรับเงิน

---

## 6 · Entity Framework Core (.NET)

```bash
dotnet ef migrations add AddOrderStatus
dotnet ef migrations script <from> <to> -o migrate.sql   # ✅ ตรวจ SQL ก่อนรันจริง
dotnet ef database update                                # dev เท่านั้น
```

> **บน production ให้รัน script ที่ตรวจแล้ว ไม่ใช่ `database update`**
> คำสั่งนั้นต้องการสิทธิ์แก้ schema จาก connection ของแอป ซึ่งไม่ควรมีอยู่แล้ว

```csharp
modelBuilder.Entity<Order>(e => {
    e.ToTable("orders");
    e.Property(x => x.TotalAmount).HasColumnType("decimal(19,4)");
    e.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("ix_orders_status_created");
    e.HasQueryFilter(x => x.DeletedAt == null);          // soft delete ทั้งระบบ
    e.Property(x => x.RowVersion).IsRowVersion();        // ตรวจการแก้ชนกัน
});
```

---

## 7 · Prisma / Drizzle (Node)

```prisma
model Order {
  id          BigInt   @id @default(autoincrement())
  orderNo     String   @unique @map("order_no") @db.VarChar(20)
  totalAmount Decimal  @map("total_amount") @db.Decimal(19, 4)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(3)
  customer    Customer @relation(fields: [customerId], references: [id])
  customerId  BigInt   @map("customer_id")

  @@index([status, createdAt], name: "ix_orders_status_created")
  @@map("orders")
}
```

```bash
npx prisma migrate dev --name add_order_status   # dev — สร้างไฟล์ migration
npx prisma migrate deploy                        # production — รันเฉพาะที่มีอยู่แล้ว
```

- `Decimal` ของ Prisma กลับมาเป็น object ไม่ใช่ number — คำนวณด้วย `decimal.js` อย่าแปลงเป็น float
- `BigInt` แปลงเป็น JSON ตรง ๆ ไม่ได้ ต้องแปลงเป็น string ที่ชั้น API

---

## 8 · Alembic (Python)

```bash
alembic revision --autogenerate -m "add order status"
alembic upgrade head
alembic downgrade -1
```

```python
def upgrade():
    op.add_column("orders", sa.Column("status", sa.String(20), nullable=True))
    op.execute("UPDATE orders SET status = 'draft' WHERE status IS NULL")
    op.alter_column("orders", "status", nullable=False)
    op.create_index("ix_orders_status_created", "orders", ["status", "created_at"],
                    postgresql_concurrently=True)
```

> `--autogenerate` **ไม่เห็น** การเปลี่ยนชื่อ (มองเป็นลบแล้วเพิ่มใหม่ = ข้อมูลหาย)
> อ่านไฟล์ที่มันสร้างทุกครั้งก่อน commit

---

## 9 · คำสั่งตรวจ query ช้า

| ฐานข้อมูล | คำสั่ง |
|---|---|
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) <query>;` · ส่วนขยาย `pg_stat_statements` |
| SQL Server | เปิด "Include Actual Execution Plan" · `sys.dm_exec_query_stats` |
| MySQL | `EXPLAIN ANALYZE <query>;` · `performance_schema` |
| MongoDB | `db.orders.find(...).explain("executionStats")` |

**สัญญาณอันตรายที่ต้องแก้:** `Seq Scan` / `Table Scan` บนตารางใหญ่ ·
จำนวนแถวที่ประมาณไว้ต่างจากที่ได้จริงเกินสิบเท่า · `Nested Loop` ที่วนหลักแสนรอบ


---

# skill: api-conventions

Use when starting an API, adding endpoints, or reviewing for consistency. One project-wide rulebook for URLs, versioning, breaking changes, pagination, dates, money, ids, nulls, errors, idempotency and deprecation.

# ข้อตกลงของ API

> **กฎข้อเดียว:** ตัดสินใจครั้งเดียว ใช้ทุก endpoint
> API ที่ทุก endpoint ทำเหมือนกันแบบ "ไม่ค่อยถูกตามทฤษฎี" ใช้งานง่ายกว่า
> API ที่แต่ละ endpoint ถูกต้องคนละแบบ — เพราะฝั่งเรียกต้องเดาใหม่ทุกครั้ง

## เมื่อไหร่ใช้ skill นี้

- เริ่มออกแบบ API ตัวแรกของโปรเจกต์
- จะเพิ่ม endpoint ในของเดิม และอยากให้เข้ากันได้
- รีวิว API แล้วรู้สึกว่าแต่ละส่วนไม่เหมือนกัน
- ต้องตอบว่า "การเปลี่ยนนี้ทำให้ client พังไหม"

## เมื่อไหร่ **ไม่** ใช้

| โจทย์ | ไปที่ |
|---|---|
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง ๆ ให้ครบ | command `/api-design` |
| health check, error envelope, graceful shutdown | `web-service-essentials` |
| ตาราง คอลัมน์ ความสัมพันธ์ | `database-design` |
| token, scope, สิทธิ์ | `auth-implementation-patterns` |

---

## 1 · เอกสารข้อตกลงต้องมีจริง

วางไฟล์ `API-CONVENTIONS.md` ที่รากโปรเจกต์ (แม่แบบอยู่ที่ `assets/API-CONVENTIONS.md`)
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
POST   /v1/orders/{id}/cancel     การกระทำที่ไม่ใช่ CRUD
```

| กฎ | ✅ | ❌ |
|---|---|---|
| คำนาม พหูพจน์ | `/orders` | `/getOrders`, `/order` |
| ตัวพิมพ์เล็ก ขีดกลาง | `/purchase-orders` | `/purchaseOrders`, `/purchase_orders` |
| ความลึกไม่เกิน 2 ชั้น | `/orders/{id}/items` | `/customers/{a}/orders/{b}/items/{c}/logs` |
| กริยาใช้เมื่อไม่ใช่ CRUD จริง ๆ | `POST /orders/{id}/cancel` | `POST /orders/cancelOrder` |

**การกระทำที่ไม่ใช่ CRUD** (อนุมัติ ยกเลิก ส่งซ้ำ) — ใช้ `POST /{resource}/{id}/{action}`
อย่าดัดให้เป็น `PATCH` ที่มี `status` เพราะการเปลี่ยนสถานะมักมีผลข้างเคียงมากกว่าการแก้ฟิลด์

**วิธี `PATCH`:** เลือกแบบเดียวทั้งระบบ — ส่งเฉพาะฟิลด์ที่แก้ (`merge patch`) เป็นค่าเริ่มต้นที่แนะนำ
และต้องตอบให้ได้ว่า `null` แปลว่า "ล้างค่า" หรือ "ไม่แตะ" (ดูข้อ 6)

---

## 3 · versioning

| วิธี | ข้อดี | ข้อเสีย |
|---|---|---|
| **ใน path** `/v1/orders` | เห็นชัด ทดสอบง่าย แคชง่าย | URL เปลี่ยนตอนขึ้นเวอร์ชัน |
| ใน header `Accept: application/vnd.acme.v1+json` | URL คงที่ | มองไม่เห็นตอน debug ลืมส่งบ่อย |

> **เลือก path** ถ้าไม่มีเหตุผลเฉพาะ — ทุกคนเห็นเวอร์ชันได้จากบรรทัดเดียวใน log

**อะไรคือการเปลี่ยนที่ทำให้ฝั่งเรียกพัง:**

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

**ขึ้นเวอร์ชันใหญ่เมื่อจำเป็นจริง** — แต่ละเวอร์ชันที่ยังเปิดอยู่คือโค้ดที่ต้องดูแลอีกชุด

---

## 4 · pagination

**ทุก endpoint ที่คืนรายการต้องมี pagination ตั้งแต่วันแรก** ไม่มีข้อยกเว้น
รายการที่ "มีไม่กี่รายการหรอก" คือรายการที่จะมีหมื่นรายการในสองปี

| วิธี | ใช้เมื่อ | ข้อจำกัด |
|---|---|---|
| **cursor** `?limit=50&cursor=eyJ...` | ค่าเริ่มต้น · ข้อมูลเยอะ · มีการเพิ่มระหว่างเปิดดู | กระโดดไปหน้า 7 ไม่ได้ |
| offset `?limit=50&offset=100` | ต้องมีเลขหน้าให้กด · ข้อมูลไม่เยอะ | ช้าลงเรื่อย ๆ · ข้อมูลซ้ำ/หายเมื่อมีการแทรกระหว่างหน้า |

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

- ห่อรายการไว้ใน `data` เสมอ — ตอบเป็นอาเรย์เปล่า ๆ แล้ววันหนึ่งจะเติมข้อมูลหน้าไม่ได้
- `limit` มีค่าเริ่มต้นและ**เพดานที่บังคับฝั่งเซิร์ฟเวอร์** (เช่น เริ่มต้น 20 สูงสุด 100)
- `totalCount` เป็นของแพง — ทำเป็นตัวเลือก `?includeTotal=true` อย่านับทุกครั้ง
- **cursor ต้องทึบ** — ฝั่งเรียกห้ามแกะหรือประกอบเอง

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

- **อนุญาตเฉพาะฟิลด์ที่กำหนดไว้** — รับชื่อฟิลด์อะไรก็ได้ = ช่องโหว่และ query ที่ไม่มี index
- พารามิเตอร์ที่ไม่รู้จัก ให้ตอบ `400` ดีกว่าเงียบ ๆ ข้าม — ฝั่งเรียกพิมพ์ผิดแล้วได้ข้อมูลผิดโดยไม่รู้ตัว

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
> `bigint` ที่โตเกินนั้นจะถูกปัดเศษเงียบ ๆ ตอน `JSON.parse` และเปลี่ยนเป็นสตริงทีหลังคือ breaking change
>
> 🚨 **เงินเป็น float ใน JSON** — `1250.10` ที่วิ่งผ่านสองภาษาอาจกลายเป็น `1250.0999999999999`

**`null` กับ "ไม่มีฟิลด์" ต้องต่างกันอย่างชัดเจน:**

- ใน response — ฟิลด์ที่มีอยู่แต่ไม่มีค่า ให้ส่ง `null` ไม่ใช่ตัดออก ฝั่งเรียกจะได้ไม่ต้องเช็คสองแบบ
- ใน `PATCH` — `{"note": null}` = ล้างค่า · ไม่ส่งคีย์ `note` เลย = ไม่แตะ

**อาเรย์ว่างคือ `[]` ไม่ใช่ `null`** — ฝั่งเรียกจะได้วนลูปได้เลย

---

## 7 · error

รูปแบบ error envelope อยู่ที่ `web-service-essentials` (RFC 9457) — ใช้ตัวเดียวกัน
สิ่งที่ต้องตกลงเพิ่มคือ **error ระดับฟิลด์**:

```jsonc
// 422 Unprocessable Content
{
  "type": "https://api.acme.co/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "traceId": "01J9Z8...",
  "errors": [
    { "field": "email",          "code": "invalid_format", "message": "รูปแบบอีเมลไม่ถูกต้อง" },
    { "field": "items[0].qty",   "code": "min_value",      "message": "ต้องมากกว่า 0" }
  ]
}
```

- **`code` คือของที่โปรแกรมอ่าน · `message` คือของที่คนอ่าน** — อย่าให้ฝั่งเรียกต้องแปลงข้อความเป็นเงื่อนไข
- ชี้ตำแหน่งฟิลด์ด้วยเส้นทางเต็ม รวมดัชนีของอาเรย์
- **คืน error ให้ครบทุกฟิลด์ในครั้งเดียว** ไม่ใช่ทีละตัว ผู้ใช้จะได้ไม่ต้องกดส่งห้ารอบ
- ข้อความภาษาไทยหรืออังกฤษ เลือกจาก `Accept-Language` ถ้ารองรับหลายภาษา

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

- เซิร์ฟเวอร์เก็บคู่ (key, ผลลัพธ์) ไว้อย่างน้อย 24 ชั่วโมง
- key เดิม + เนื้อหาเดิม → คืนผลเดิม ไม่ทำงานซ้ำ
- key เดิม + เนื้อหา**ต่าง** → `422` ไม่ใช่ทำงานใหม่
- เครือข่ายขาดตอนรอคำตอบเป็นเรื่องปกติ ไม่ใช่กรณีพิเศษ — ฝั่งเรียก retry เสมอ

### แก้ชนกัน (optimistic concurrency)

```
GET   /v1/orders/1042        → 200  ETag: "v7"
PATCH /v1/orders/1042        If-Match: "v7"
                             → 200 ปกติ · 412 ถ้ามีคนแก้ไปก่อนแล้ว
```

ถ้าไม่มีสิ่งนี้ คนที่กดบันทึกทีหลังจะทับงานของคนแรกโดยไม่มีใครรู้

---

## 9 · rate limit

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1758790000
Retry-After: 42                ← ต้องมีคู่กับ 429 เสมอ
```

`429` ที่ไม่มี `Retry-After` ทำให้ฝั่งเรียกเดาเอง แล้วส่วนใหญ่จะเดาว่า "ลองใหม่ทันที"

---

## 10 · การเลิกใช้ endpoint

1. ประกาศล่วงหน้า พร้อมบอกว่าใช้อะไรแทน
2. ส่ง header ในทุก response ของ endpoint นั้น:
   ```
   Deprecation: true
   Sunset: Wed, 31 Dec 2026 23:59:59 GMT
   Link: <https://docs.acme.co/v2/orders>; rel="successor-version"
   ```
3. **ดูจาก log ว่ายังมีใครเรียกอยู่** — ติดต่อไปตรง ๆ อย่ารอให้เงียบไปเอง
4. ปิดจริงหลังวันที่ประกาศ ไม่ใช่ก่อน

ระยะเวลาที่สมเหตุสมผล: API ภายใน 1 รอบ release · API ที่คนนอกใช้ อย่างน้อย 6 เดือน

---

## 11 · Anti-patterns

- ❌ **`200 OK` พร้อม `{"success": false}`** — ทำให้ตัวตรวจสอบและ log ทั้งระบบตาบอด
- ❌ **กริยาใน URL** — `/createOrder`, `/getOrderById`
- ❌ **รายการที่ไม่มี pagination** — วันหนึ่งจะคืนข้อมูลห้าหมื่นแถวพร้อมกัน
- ❌ **รูปแบบวันที่คนละแบบในแต่ละ endpoint** — `"25/09/2026"` ที่ไม่มีใครรู้ว่าวันหรือเดือนขึ้นก่อน
- ❌ **ส่ง entity ของฐานข้อมูลออกไปตรง ๆ** — เพิ่มคอลัมน์ทีไร API เปลี่ยนตามโดยไม่ตั้งใจ และเสี่ยงหลุดข้อมูลภายใน
- ❌ **ชื่อฟิลด์ปนกัน** `created_at` กับ `updatedAt` ใน response เดียวกัน
- ❌ **`GET` ที่เปลี่ยนข้อมูล** — ตัวโหลดหน้าเว็บล่วงหน้าจะยิงให้เองโดยไม่มีใครกด
- ❌ **error message เปลี่ยนไปเรื่อย ๆ** โดยไม่มี `code` คงที่
- ❌ **ไม่มีเอกสาร** — OpenAPI ที่สร้างจากโค้ดจริง ดีกว่าเอกสารที่เขียนมือแล้วไม่ตรง

---

## 12 · ตัวย่อ

- **API** — Application Programming Interface (ช่องทางให้โปรแกรมเรียกใช้กันเอง)
- **CRUD** — Create Read Update Delete (สร้าง อ่าน แก้ ลบ)
- **RFC 3339** — มาตรฐานรูปแบบวันเวลาในข้อความ
- **RFC 9457** — มาตรฐานรูปร่างข้อความ error ของ HTTP
- **ETag** — Entity Tag (รหัสระบุรุ่นของข้อมูล ใช้ตรวจว่ามีคนแก้ไปก่อนไหม)
- **ISO 4217** — มาตรฐานรหัสสกุลเงิน เช่น THB
- **OpenAPI** — รูปแบบมาตรฐานสำหรับบรรยาย API ให้เครื่องอ่านได้

## 13 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| health check · error envelope · timeout | `web-service-essentials` |
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง ๆ | command `/api-design` |
| ชนิดข้อมูลในฐานข้อมูล | `database-design` |
| token · scope · สิทธิ์ | `auth-implementation-patterns` |
| correlation id ที่โผล่ใน error | `logging-standards` |
| test สัญญาระหว่างระบบ | `testing-standards` |
| บันทึกเหตุผลที่เลือกข้อตกลงนี้ | `adr-writer` |

**แม่แบบเอกสารข้อตกลงที่คัดลอกไปใช้ได้เลย** → `assets/API-CONVENTIONS.md`


---

# skill: cicd-and-release

Use when setting up or fixing a build and deploy pipeline or deciding how a project ships. Stages and gates, build once and promote, traceable versions, environments, release patterns, flags, rehearsed rollback.

# CI/CD และการปล่อยของ

> **กฎข้อเดียว:** build ครั้งเดียว แล้วเอา **artifact ตัวเดิม** ไปทุก environment
> ถ้า build ใหม่ตอนขึ้น production แปลว่าของที่ทดสอบผ่าน กับของที่ลูกค้าใช้ ไม่ใช่ตัวเดียวกัน

## เมื่อไหร่ใช้ skill นี้

- ตั้ง pipeline ให้โปรเจกต์ใหม่ หรือรื้อของเดิมที่ช้า/ไม่น่าเชื่อถือ
- ต้องตัดสินใจเรื่อง branch, เวอร์ชัน, environment, หรือวิธีปล่อยของ
- deploy แล้วพังบ่อย หรือ rollback ไม่ได้
- มีคนถามว่า "ตอนนี้ production รันเวอร์ชันอะไร commit ไหน"

## เมื่อไหร่ **ไม่** ใช้

| โจทย์ | ไปที่ |
|---|---|
| ที่เก็บ secret และการหมุนเวียน | `config-and-secrets` |
| สัดส่วนและขอบเขตของ test | `testing-standards` |
| เขียน migration | `database-design` |
| ขั้นตอนตอนระบบล่ม | `incident-runbook-template` |
| เขียนบันทึกการปล่อยให้ผู้ใช้อ่าน | command `/release-notes` |

---

## 1 · ขั้นตอนใน pipeline

| ลำดับ | ขั้น | บล็อกเมื่อ | เวลาที่ยอมรับได้ |
|:--:|---|---|---|
| 1 | ตรวจรูปแบบโค้ด + lint | ผิดกฎ | < 1 นาที |
| 2 | build | คอมไพล์ไม่ผ่าน · มี warning ที่ตั้งเป็น error | < 3 นาที |
| 3 | unit test | มี test ตก · ความครอบคลุมต่ำกว่าเกณฑ์ | < 5 นาที |
| 4 | ตรวจ dependency + secret ที่หลุดเข้า git | พบช่องโหว่ระดับสูง · พบ secret | < 2 นาที |
| 5 | สร้าง artifact + ประทับเวอร์ชัน | — | < 2 นาที |
| 6 | deploy ลง staging | — | |
| 7 | integration + end-to-end test | test ตก | < 15 นาที |
| 8 | **ด่านคน** (เฉพาะ production) | ยังไม่มีคนกดอนุมัติ | |
| 9 | deploy ลง production | — | |
| 10 | ตรวจหลัง deploy | health check ไม่ผ่าน → rollback อัตโนมัติ | < 2 นาที |

**ขั้น 1–5 คือ CI ต้องวิ่งกับทุก pull request** ไม่ใช่เฉพาะตอน merge
**รวมขั้น 1–5 ควรจบใน 10 นาที** — เกินกว่านั้นคนจะเริ่มหาทางข้าม

---

## 2 · build ครั้งเดียว แล้วเลื่อนขั้น

```
commit → build → artifact v1.4.0+abc1234 ─┬→ staging  (ตัวนี้)
                                           ├→ uat      (ตัวเดิม)
                                           └→ production (ตัวเดิม)
```

- artifact คือไฟล์ที่ deploy ได้จริง — container image, ไฟล์ zip ที่ publish แล้ว, แพ็กเกจ
- **ความต่างระหว่าง environment ต้องมาจาก config ตอนรันเท่านั้น** ไม่ใช่จากการ build ใหม่
- เก็บ artifact ไว้ให้ย้อนกลับได้อย่างน้อย 30 วัน — rollback คือการ deploy artifact เก่า ไม่ใช่การ build ย้อน

> ❌ **`git pull` บนเครื่อง production แล้ว build ตรงนั้น** — ของที่รันอยู่ไม่มีใครรู้ว่าคือ commit ไหน
> และ dependency ที่ดึงตอนนั้นอาจไม่ใช่ชุดเดียวกับที่ทดสอบ

---

## 3 · เวอร์ชันต้องไล่กลับไปหา commit ได้

ใช้ SemVer — `MAJOR.MINOR.PATCH`

| ขึ้นเลขไหน | เมื่อ |
|---|---|
| MAJOR | เปลี่ยนแล้วฝั่งที่เรียกใช้พัง (ดูตารางใน `api-conventions`) |
| MINOR | เพิ่มความสามารถ ของเดิมยังใช้ได้ |
| PATCH | แก้บั๊ก |

- **tag ใน git คือแหล่งความจริง** — `v1.4.0` ชี้ commit เดียวเท่านั้น
- artifact แปะ commit hash ไว้ด้วย — `1.4.0+abc1234`
- `/version` endpoint ต้องคืนค่าเดียวกันนี้ (ดู `web-service-essentials`) · แอปมือถือไม่มี endpoint ให้แสดงในหน้า "เกี่ยวกับ" แทน
- **ยกเว้น Flutter / Android** — `+` ใน `pubspec.yaml` คือ versionCode ต้องเป็นจำนวนเต็ม ใส่ hash ไม่ได้ ดูหัวข้อ "แอป Android / Flutter"
- ก่อน 1.0.0 ให้ใช้ `0.x` และยอมรับว่ายังเปลี่ยนแรงได้

---

## 4 · branch

| แบบ | วิธี | เหมาะกับ |
|---|---|---|
| **trunk-based** (แนะนำ) | branch อายุสั้น 1–2 วัน merge เข้า `main` บ่อย · ของยังไม่เสร็จซ่อนด้วย feature flag | ทีมส่วนใหญ่ · ปล่อยของบ่อย |
| release branch | `main` + `release/1.4` สำหรับแก้ด่วน | ซอฟต์แวร์ที่ลูกค้าติดตั้งเอง · ต้องดูแลหลายเวอร์ชันพร้อมกัน |
| gitflow | `develop` + `feature` + `release` + `hotfix` | ปล่อยของเป็นรอบใหญ่ ๆ นาน ๆ ครั้ง · ส่วนใหญ่ซับซ้อนเกินจำเป็น |

**กฎที่ไม่ขึ้นกับแบบที่เลือก:**

- `main` ต้อง deploy ได้ตลอดเวลา
- ป้องกัน `main` ไว้ — ต้องผ่าน pull request และ CI เขียว ห้าม push ตรง
- branch ที่อายุเกินหนึ่งสัปดาห์ = merge conflict ที่รออยู่

---

## 5 · environment และด่าน

| environment | ข้อมูล | ใครกด deploy | ต้องผ่านอะไร |
|---|---|---|---|
| dev | ปลอม | อัตโนมัติทุก commit | build ผ่าน |
| staging | คล้ายจริง (ปิดบังแล้ว) | อัตโนมัติเมื่อ merge เข้า `main` | unit + integration |
| uat | คล้ายจริง | ทีมกด | ผู้ใช้ทดสอบผ่าน |
| production | จริง | **คนกดอนุมัติ** | ทุกอย่างข้างบน |

- staging ต้องใกล้เคียง production ให้มากที่สุด — เวอร์ชันฐานข้อมูล ระบบปฏิบัติการ ค่า config
- **ห้ามคัดลอกข้อมูลจริงลง staging โดยไม่ปิดบังข้อมูลส่วนบุคคล**
- ถ้ามี environment เดียวเพราะงบจำกัด ให้บอกตรง ๆ ในเอกสาร และเพิ่ม feature flag ทดแทน

---

## 6 · secret ใน pipeline

- เก็บใน secret store ของแพลตฟอร์ม ไม่ใช่ในไฟล์ pipeline
- ให้สิทธิ์เท่าที่ขั้นนั้นต้องใช้ — ขั้น build ไม่ต้องรู้รหัสฐานข้อมูล production
- pipeline ที่วิ่งจาก fork ของคนนอก **ห้ามเห็น secret**
- ตัวตรวจ secret ที่หลุดเข้า git ต้องอยู่ในขั้นที่ 4 ไม่ใช่ตรวจปีละครั้ง

รายละเอียดทั้งหมด → `config-and-secrets`

---

## 7 · migration ฐานข้อมูลใน pipeline

```
deploy schema (ขยาย) → deploy โค้ด → ตรวจ → deploy schema (บีบ) รอบถัดไป
```

- migration รันเป็น**ขั้นของตัวเอง** ก่อน deploy โค้ด ไม่ใช่รันตอนแอปบูต
  (แอปหลาย instance บูตพร้อมกันแล้วรัน migration ชนกันคือหายนะ)
- ใช้บัญชีที่มีสิทธิ์แก้ schema เฉพาะขั้นนี้ บัญชีที่แอปใช้รันต้องไม่มีสิทธิ์นั้น
- migration ต้องเข้ากันได้กับโค้ดเวอร์ชันก่อนหน้า — ไม่งั้น rollback โค้ดแล้วระบบพัง
- สำรองข้อมูลก่อนเสมอ และ**ทดสอบว่ากู้คืนได้จริง**
- **ข้อยกเว้น: ฐานข้อมูลในเครื่องผู้ใช้** (SQLite · sqflite · drift บนมือถือ) migrate ตอนแอปเปิดเป็นทางเดียวที่มี —
  กฎข้างบนใช้กับฐานข้อมูลบนเซิร์ฟเวอร์ที่หลาย instance ใช้ร่วมกัน · migration ในเครื่องต้องมี test ไล่จากทุกเวอร์ชัน schema ที่เคยปล่อย

วิธี expand/contract → `database-design` ข้อ 9

---

## 8 · วิธีปล่อยของ

| วิธี | ทำงานยังไง | ต้องมี | เหมาะกับ |
|---|---|---|---|
| หยุดแล้วเปลี่ยน | ปิด → เปลี่ยน → เปิด | ไม่มี | ระบบภายใน · ปิดได้ตอนกลางคืน |
| **rolling** | ทยอยเปลี่ยนทีละเครื่อง | health check ที่เชื่อถือได้ · เข้ากันได้ทั้งสองเวอร์ชัน | ค่าเริ่มต้นของระบบที่รันหลาย instance |
| blue-green | ยกชุดใหม่ขึ้นครบ แล้วสลับ traffic | ทรัพยากรสองเท่าชั่วคราว | ต้อง rollback ได้ในไม่กี่วินาที |
| canary | ปล่อยให้ผู้ใช้ 5% ก่อน แล้วค่อยขยาย | ตัวชี้วัดที่แยกตามเวอร์ชันได้ | ระบบใหญ่ · ความเสี่ยงสูง |

> **rolling ต้องการสิ่งที่คนมักลืม** — ระหว่าง deploy เวอร์ชันเก่าและใหม่ให้บริการพร้อมกัน
> API และ schema จึงต้องเข้ากันได้ทั้งสองทาง ถ้าออกแบบไม่เผื่อไว้ ผู้ใช้บางคนจะเจอ error ทุกครั้งที่ deploy

**feature flag** — แยก "ปล่อยโค้ด" ออกจาก "เปิดใช้ฟีเจอร์"

- merge โค้ดที่ยังไม่เสร็จเข้า `main` ได้ โดยปิด flag ไว้
- เปิดให้คนบางกลุ่มก่อน ปิดได้ทันทีโดยไม่ต้อง deploy
- 🚨 **flag ต้องมีวันหมดอายุ** — flag ที่ค้างหนึ่งปีคือโค้ดสองเส้นทางที่ไม่มีใครกล้าลบ
  กำหนดให้ลบภายใน 2 sprint หลังเปิดใช้เต็มร้อย

---

## 9 · rollback

**เกณฑ์ที่ต้องกำหนดล่วงหน้า:** rollback เมื่ออัตรา error เกิน X% หรือเวลาตอบสนองเกิน Y วินาที
ไม่ใช่ตอนที่ทุกคนกำลังตกใจแล้วเถียงกันว่าควรรอดูอีกหน่อยไหม

| ต้องมี | เกณฑ์ |
|---|---|
| คำสั่ง rollback | ทำได้ด้วยคำสั่งเดียว |
| เวลาที่ใช้ | ต่ำกว่า 5 นาที |
| **ซ้อมจริง** | อย่างน้อยไตรมาสละครั้ง บน staging |
| ข้อมูล | migration ที่ทำไปแล้วต้องไม่ทำให้โค้ดเก่าพัง |

> **rollback ที่ไม่เคยซ้อม = ไม่มี rollback** — จะรู้ว่ามันใช้ไม่ได้ตอนที่ต้องใช้พอดี

---

## 10 · pipeline ต้องเร็วและน่าเชื่อถือ

| ปัญหา | วิธีแก้ |
|---|---|
| ช้า | แคช dependency · รัน test แบบขนาน · แยก test ที่ช้าไปวิ่งกลางคืน |
| test ที่ผลไม่คงที่ (flaky) | **แยกออกทันที** แล้วตั้งงานตามแก้ — test ที่ตกบ้างผ่านบ้างทำให้คนเลิกอ่านผล |
| ทุกคนรอคิว | เพิ่มตัวรันขนาน · ให้ pull request วิ่งเฉพาะที่เกี่ยวข้อง |
| build ไม่เหมือนเดิมทุกครั้ง | ล็อกเวอร์ชัน dependency (lock file) · ปักหมุดเวอร์ชัน image ด้วย digest |

**ตัวชี้วัดที่ควรดู:** ปล่อยของบ่อยแค่ไหน · จากคอมมิตถึงขึ้นจริงใช้เวลาเท่าไร ·
deploy แล้วพังกี่เปอร์เซ็นต์ · กู้คืนใช้เวลาเท่าไร

---

## แอป Android / Flutter — ข้อที่ต่างจากเซิร์ฟเวอร์

| เรื่อง | กฎ |
|---|---|
| เลขเวอร์ชัน | `pubspec.yaml` `version: X.Y.Z+N` · `X.Y.Z` ตาม SemVer · **`N` คือ versionCode เป็นจำนวนเต็มที่ขึ้นอย่างเดียว** (เช่นเลขรอบของ CI) · commit hash ส่งผ่าน `--dart-define=GIT_SHA=<hash>` แล้วแสดงในหน้า "เกี่ยวกับ" |
| build ครั้งเดียว | `flutter build appbundle --release` ได้ AAB ไฟล์เดียว แล้วเลื่อนไฟล์เดิมผ่าน track ของ Play: internal → closed → production · ไม่ build ใหม่ต่อ track |
| ปล่อยทีละส่วน | production ใช้ staged rollout เป็น % (เช่น 5 → 20 → 50 → 100) แทน canary ของเซิร์ฟเวอร์ · track ของ Play แทน environment ในข้อ 5 |
| rollback | **ย้อนเวอร์ชันบน Play ไม่ได้** — versionCode ลดไม่ได้และเครื่องที่ติดตั้งแล้วไม่ถอยกลับ · ให้หยุด rollout (halt) แล้วปล่อยตัวแก้ที่ versionCode สูงกว่า · ซ้อมขั้นตอนนี้แทนข้อ 9 |
| กุญแจเซ็น | upload key เก็บใน secret store ของ CI เป็น base64 + รหัสผ่านแยกเป็น secret · `android/key.properties` และ `*.jks` อยู่ใน `.gitignore` · **สำรองกุญแจไว้นอก CI อย่างน้อยหนึ่งที่** — ทำหาย = อัปเดตแอปไม่ได้จนกว่าจะขอ Play support รีเซ็ต (ใช้ Play App Signing ให้ Google ถือกุญแจจริง) |

---

## 11 · Anti-patterns

- ❌ **build ใหม่ตอนขึ้น production** — ของที่ทดสอบไม่ใช่ของที่ปล่อย
- ❌ **deploy ด้วยมือตามขั้นตอนใน Word** — วันที่คนเขียนลาป่วยคือวันที่ deploy ไม่ได้
- ❌ **secret ในไฟล์ pipeline** — ใครอ่านโค้ดได้ก็อ่าน secret ได้
- ❌ **test ที่ตกแล้วปล่อยผ่าน** — ทำครั้งเดียวก็เลิกเชื่อผลไปตลอด
- ❌ **deploy วันศุกร์เย็น** ในทีมที่ยัง rollback ไม่ได้ด้วยคำสั่งเดียว
- ❌ **migration ของฐานข้อมูลบนเซิร์ฟเวอร์รันตอนแอปบูต** — หลาย instance ชนกัน (ฐานข้อมูลในเครื่องมือถือยกเว้น ดูข้อ 7)
- ❌ **ไม่มี artifact เก็บไว้** — rollback กลายเป็นการ build ย้อนจาก commit เก่า
- ❌ **environment ที่ config ต่างกันจนคาดเดาไม่ได้** — "บน staging ผ่านนะ"
- ❌ **feature flag ที่ไม่มีวันลบ**
- ❌ **pipeline ใช้เวลา 45 นาที** — คนจะเริ่ม merge โดยไม่รอผล

---

## 12 · ตัวย่อ

- **CI** — Continuous Integration (รวมโค้ดเข้าด้วยกันบ่อย ๆ พร้อมตรวจอัตโนมัติทุกครั้ง)
- **CD** — Continuous Delivery/Deployment (พาโค้ดที่ผ่านการตรวจไปถึงผู้ใช้อัตโนมัติ)
- **SemVer** — Semantic Versioning (มาตรฐานเลขเวอร์ชัน MAJOR.MINOR.PATCH)
- **artifact** — ไฟล์ผลลัพธ์จากการ build ที่นำไป deploy ได้จริง
- **canary** — การปล่อยของใหม่ให้ผู้ใช้ส่วนน้อยก่อนเพื่อดูอาการ
- **UAT** — User Acceptance Testing (การทดสอบโดยผู้ใช้ก่อนรับมอบ)
- **AAB** — Android App Bundle (ไฟล์ที่อัปโหลดขึ้น Google Play แล้ว Play แตกเป็น APK ตามเครื่อง)
- **versionCode** — เลขจำนวนเต็มที่ Android ใช้ตัดสินว่าเวอร์ชันไหนใหม่กว่า

## 13 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| secret และ config ต่อ environment | `config-and-secrets` |
| migration ที่ deploy ได้โดยไม่ปิดระบบ | `database-design` |
| สัดส่วน test แต่ละชั้นใน pipeline | `testing-standards` · `e2e-testing-patterns` |
| health check ที่ pipeline ใช้ตัดสิน | `web-service-essentials` |
| ขั้นตอนเมื่อ deploy แล้วล่ม | `incident-runbook-template` · `postmortem-template` |
| ข้อความ commit ที่สร้างบันทึกการปล่อยอัตโนมัติได้ | `commit-message-format` |

**ไฟล์ pipeline ที่ใช้ได้จริงของ GitHub Actions, Azure DevOps และ GitLab** → `references/per-platform.md`


## reference: per-platform.md

# ไฟล์ pipeline ตั้งต้น แยกตามแพลตฟอร์ม

1. [GitHub Actions](#1--github-actions)
2. [Azure DevOps](#2--azure-devops)
3. [GitLab CI](#3--gitlab-ci)
4. [Dockerfile หลายขั้น](#4--dockerfile-หลายขั้น)
5. [ตารางเทียบความสามารถ](#5--ตารางเทียบความสามารถ)

---

## 1 · GitHub Actions

`.github/workflows/ci.yml` — วิ่งกับทุก pull request

```yaml
name: ci
on:
  pull_request:
  push: { branches: [main] }

concurrency:                       # ยกเลิกรอบเก่าเมื่อ push ซ้ำ
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions: { contents: read }
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }   # ต้องมีประวัติครบเพื่อคำนวณเวอร์ชัน

      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test -- --coverage

      - name: ตรวจ dependency
        run: npm audit --audit-level=high

      - uses: actions/upload-artifact@v4
        with:
          name: app-${{ github.sha }}
          path: dist/
          retention-days: 30
```

`.github/workflows/deploy.yml` — เลื่อนขั้น artifact ตัวเดิม

```yaml
name: deploy
on:
  workflow_run:
    workflows: [ci]
    types: [completed]
    branches: [main]

jobs:
  staging:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: app-${{ github.event.workflow_run.head_sha }}
          run-id: ${{ github.event.workflow_run.id }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - run: ./scripts/deploy.sh staging

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production        # ← ตั้ง required reviewers ที่นี่ = ด่านคน
    steps:
      - run: ./scripts/deploy.sh production
      - name: ตรวจหลัง deploy
        run: |
          for i in $(seq 1 10); do
            curl -fsS https://api.example.co/health/ready && exit 0
            sleep 6
          done
          ./scripts/rollback.sh && exit 1
```

**ข้อควรระวัง:**

- `pull_request_target` เห็น secret และรันโค้ดจาก fork — **อย่าใช้** เว้นแต่รู้จริงว่ากำลังทำอะไร
- ตั้ง `permissions` ให้แคบที่สุดในทุก workflow ค่าเริ่มต้นของบางองค์กรคือเขียนได้ทั้ง repo
- ปักหมุด action ด้วย tag เวอร์ชัน (`@v4`) อย่างน้อย · ถ้าเข้มงวดให้ปักด้วย commit hash
- `environment:` คือที่ตั้ง required reviewers และ secret เฉพาะ environment

---

## 2 · Azure DevOps

`azure-pipelines.yml`

```yaml
trigger:
  branches: { include: [main] }

variables:
  buildConfiguration: Release

stages:
- stage: build
  jobs:
  - job: build
    pool: { vmImage: ubuntu-latest }
    steps:
    - task: UseDotNet@2
      inputs: { version: '8.x' }
    - script: dotnet restore
    - script: dotnet build -c $(buildConfiguration) --no-restore
    - script: dotnet test -c $(buildConfiguration) --no-build --collect:"XPlat Code Coverage"
    - script: dotnet publish -c $(buildConfiguration) -o $(Build.ArtifactStagingDirectory) --no-build
    - publish: $(Build.ArtifactStagingDirectory)
      artifact: app

- stage: staging
  dependsOn: build
  jobs:
  - deployment: staging
    environment: staging
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app
          - script: ./scripts/deploy.sh staging

- stage: production
  dependsOn: staging
  jobs:
  - deployment: production
    environment: production        # ← ตั้ง approval ที่หน้า Environments
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app          # artifact ตัวเดิมจาก stage build
          - script: ./scripts/deploy.sh production
```

- `deployment` job ต่างจาก `job` ธรรมดาตรงที่ผูกกับ environment จึงมีประวัติและ approval ให้
- ตัวแปรลับเก็บใน variable group ที่ผูกกับ Azure Key Vault อย่าพิมพ์ลงไฟล์
- ตัวแปรลับ**ไม่ถูกส่งเข้า script โดยอัตโนมัติ** ต้อง map ผ่าน `env:` ทีละตัว

---

## 3 · GitLab CI

`.gitlab-ci.yml`

```yaml
stages: [test, build, deploy]

default:
  interruptible: true

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  key: { files: [requirements.txt] }
  paths: [.cache/pip]

test:
  stage: test
  image: python:3.12
  script:
    - pip install -r requirements.txt
    - ruff check .
    - pytest --cov --cov-fail-under=70
  coverage: '/TOTAL.*\s+(\d+%)$/'

build:
  stage: build
  image: docker:27
  services: [docker:27-dind]
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:staging:
  stage: deploy
  environment: { name: staging, url: https://staging.example.co }
  script: ./scripts/deploy.sh staging $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:production:
  stage: deploy
  environment: { name: production, url: https://example.co }
  when: manual                     # ← ด่านคน
  script: ./scripts/deploy.sh production $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

- ตั้งตัวแปรลับเป็น `Masked` และ `Protected` ที่หน้า Settings → CI/CD
- `when: manual` คู่กับ protected environment คือด่านอนุมัติที่ใช้ได้จริง

---

## 4 · Dockerfile หลายขั้น

```dockerfile
# ---- ขั้น build ----
FROM node:22-alpine AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci                      # ชั้นนี้ถูกแคชตราบใดที่ lock file ไม่เปลี่ยน
COPY . .
RUN npm run build

# ---- ขั้นรัน ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /src/dist ./dist
COPY --from=build /src/node_modules ./node_modules
USER node                       # ❌ อย่ารันเป็น root
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node dist/healthcheck.js
CMD ["node", "dist/main.js"]
```

**กฎ:**

- คัดลอกไฟล์ที่เปลี่ยนน้อยก่อน เพื่อให้ชั้นแคชได้ผล
- อย่าคัดลอก `.env`, `.git`, `node_modules` เข้า image — ใช้ `.dockerignore`
- ปักหมุด base image ด้วย digest ถ้าต้องการให้ build ได้ผลเดิมทุกครั้ง
- ตั้งชื่อ tag ด้วย commit hash เสมอ · `latest` ใช้เป็นชื่อเล่นได้ แต่ห้าม deploy ด้วย `latest`

---

## 5 · ตารางเทียบความสามารถ

| สิ่งที่ต้องการ | GitHub Actions | Azure DevOps | GitLab CI |
|---|---|---|---|
| ด่านอนุมัติโดยคน | Environment + required reviewers | Environment approvals | `when: manual` + protected env |
| เก็บ artifact | `upload/download-artifact` | `publish` / `download` | `artifacts:` |
| แคช dependency | `actions/cache` หรือ `cache:` ใน setup | `Cache@2` | `cache:` |
| secret ต่อ environment | Environment secrets | Variable group + Key Vault | ตัวแปร Protected ต่อ environment |
| ยกเลิกรอบเก่า | `concurrency` | `batch: true` | `interruptible: true` |
| วิ่งขนาน | `strategy.matrix` | `strategy.matrix` | `parallel:` |
| รันเอง (self-hosted) | ได้ | ได้ | ได้ |

> **ทุกแพลตฟอร์มทำสิ่งเดียวกันได้** — อย่าเลือกด้วยรายการความสามารถ
> เลือกตัวที่อยู่ที่เดียวกับ repo แล้วลงแรงกับเนื้อหาของ pipeline แทน


---

# skill: flag-and-propose

Use when something found mid-task changes what happens next (stale file, mismatched number, blocked step, risk) and a decision is needed. Lead with the consequence, show recorded vs actual, end with one short question.

# แจ้งสิ่งที่เจอ แล้วเสนอทางไป

> **กฎข้อเดียว:** เปิดด้วย**ผลกระทบ** ปิดด้วย**คำถามเดียว**
> ตรงกลางคือหลักฐานกับข้อเสนอ ไม่ใช่การเล่าว่าเจอมาได้ยังไง

## เมื่อไหร่ใช้ skill นี้

- เจอของที่ทำให้แผนเดิมใช้ไม่ได้ ระหว่างทำงานอย่างอื่นอยู่
- ตัวเลข ไฟล์ หรือเอกสารไม่ตรงกัน แล้วต้องรู้ว่าจะยึดอันไหน
- มีทางไปต่อหลายทาง และต้องให้ผู้ใช้เลือกก่อนถึงจะทำต่อได้
- เสนอให้เพิ่มหรือเปลี่ยนอะไรบางอย่าง ที่ผู้ใช้ยังไม่ได้ขอ

## เมื่อไหร่ **ไม่** ใช้

| สถานการณ์ | ใช้ตัวนี้แทน |
|---|---|
| ตอบคำถามที่ผู้ใช้ถามมา | `answer-shape` |
| รายงานผลงานที่ทำเสร็จแล้ว | `anthropic-skills:short-answers` |
| อธิบายเรื่องซับซ้อนให้เข้าใจ | `anthropic-skills:direct-answers` |
| เขียนเป็นเอกสารให้คนอื่นอ่าน | `polished-document-style` |
| งานพังจริงและต้องแก้ทันที | `targeted-fix` — แก้ก่อน แล้วค่อยรายงาน |

---

## 1 · โครงคำตอบ 4 บล็อก

| บล็อก | ความยาว | กฎ |
|---|---|---|
| 1 · สิ่งที่เจอ + ผลถ้าไม่แก้ | 1–2 บรรทัด | **ขึ้นก่อนเสมอ** ไม่มีคำเกริ่น ไม่ทวนคำถาม |
| 2 · หลักฐาน | ตาราง ≤ 5 แถว | ตัวเลขที่ขัดกันเท่านั้น ไม่ต้องเล่าวิธีตรวจ |
| 3 · ข้อเสนอ | ตาราง ≤ 5 แถว | ทำอะไร → **ได้อะไร** ไม่ใช่ทำอะไร → ทำยังไง |
| 4 · คำถามปิด | 1 บรรทัด | คำถามเดียว ตอบได้ด้วยไม่กี่คำ |

บล็อก 2 ตัดได้ถ้าไม่มีตัวเลข · บล็อก 3 ตัดได้ถ้ายังไม่มีข้อเสนอจริง ๆ
**บล็อก 1 กับ 4 ตัดไม่ได้**

**ทั้งคำตอบควรจบใน 1 หน้าจอ** — ยาวกว่านั้นแปลว่ากำลังอธิบายกระบวนการ ไม่ใช่ขอการตัดสินใจ

---

## 2 · บล็อกที่ 1 — สูตรประโยคเดียว

```
<อะไรผิด> เพราะ <สาเหตุสั้น ๆ> · ต้อง <ทำอะไร> ก่อน <ขั้นถัดไป> ไม่งั้น <ผลเสียที่เป็นรูปธรรม>
```

| ❌ เขียนแบบเล่าเรื่อง | ✅ เขียนแบบขึ้นด้วยผลกระทบ |
|---|---|
| "ระหว่างตรวจผมพบว่าไฟล์ BUILD-PLAN.md ที่สร้างเมื่อเช้านี้นั้นได้อ่านข้อมูลมาจากโฟลเดอร์ extracted ซึ่งเป็นฉบับก่อนที่จะมีการแก้ไข…" | "**BUILD-PLAN.md ตัวเลขเก่า** เพราะอ่านจากไฟล์ฉบับก่อนแก้ ต้อง re-extract ก่อนปล่อย agent เขียนโค้ด ไม่งั้นมันข้าม FR-14.x กับ PLT ทั้งชุด" |

- **"ไม่งั้น…" ต้องเป็นรูปธรรม** — "ข้าม FR-14.x ทั้งชุด" ไม่ใช่ "อาจมีปัญหาตามมา"
- ไม่ต้องบอกว่าเจอตอนไหนหรือเจอได้ยังไง เว้นแต่วิธีเจอจะเปลี่ยนสิ่งที่ต้องทำ
- ตัวหนาใช้กับ**คำที่เปลี่ยนการตัดสินใจ**เท่านั้น ไม่ใช่ทุกคำสำคัญ

---

## 3 · ตัวเลขที่ขัดกัน = ตารางเทียบเสมอ

สองค่าขึ้นไปที่ไม่ตรงกัน อ่านจากประโยคยากกว่าอ่านจากตารางทุกครั้ง

```markdown
| | ที่บันทึกไว้ | ของจริง |
|---|---|---|
| FR ถึง | 13.9 | **14.12** |
| Test case | 214 | **245** |
| PLT | ไม่มี | **มี** |
```

- หัวคอลัมน์บอกว่า**ค่าไหนเชื่อได้** — "ที่บันทึกไว้ / ของจริง" ไม่ใช่ "เก่า / ใหม่"
- ตัวหนาที่ฝั่งที่ถูกต้อง เพื่อให้กวาดตาแล้วรู้ทันทีว่าต้องยึดอะไร
- แถวที่ตรงกันอยู่แล้ว **ไม่ต้องใส่**

**คำถามหรือสมมติฐานเดิมที่ตกไปเพราะข้อมูลใหม่ ให้ตัดทิ้งในหนึ่งบรรทัด**
เช่น "คำถามข้อ 1 เรื่องเลขไม่ตรง — ตกไปเอง" แล้วไปต่อ อย่าอธิบายว่าทำไมถึงตก

---

## 4 · ข้อเสนอเป็นตาราง "ทำอะไร → ได้อะไร"

```markdown
| ไฟล์ | ได้อะไร |
|---|---|
| `docs/README.md` | สารบัญ — อ่านอะไรก่อน ใครเป็นเจ้าของ |
| ประวัติการแก้ไขในหน้าแรกของ docx | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอ |
```

- คอลัมน์ขวาคือ **ประโยชน์** ไม่ใช่ขั้นตอน — คนอ่านกำลังตัดสินใจว่าคุ้มไหม ไม่ได้กำลังลงมือทำ
- เรียงจากคุ้มที่สุดลงมา ไม่ใช่เรียงตามลำดับการทำ
- **ผูกข้อเสนอกับปัญหาที่เพิ่งเจอถ้าผูกได้** — เป็นเหตุผลที่หนักแน่นที่สุดที่มี
- เกิน 5 แถวเมื่อไหร่ แปลว่ากำลังเสนอหลายเรื่องปนกัน ให้แยกเป็นคนละรอบ

---

## 5 · บอกสิ่งที่**ไม่**ทำด้วย

หนึ่งบรรทัด พร้อมเหตุผลและเวลาที่ควรทำแทน

> FSD กับ API spec ไม่ทำตอนนี้ — ทำตอนเริ่มเขียนโค้ดของแต่ละหน้าจอ

บรรทัดนี้กัน **"แล้วอันนั้นล่ะ ทำไมไม่ทำ"** ซึ่งเป็นคำถามที่ตามมาเกือบทุกครั้ง
และบอกกลาย ๆ ว่าคิดครบแล้ว ไม่ได้ลืม

---

## 6 · ปิดด้วยคำถามเดียว

```
เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วย re-extract + อัปเดต BUILD-PLAN
```

| กฎ | เหตุผล |
|---|---|
| **หนึ่งคำถาม** ต่อหนึ่งคำตอบ | สองคำถามขึ้นไป จะได้คำตอบแค่ข้อเดียว |
| ตอบได้ด้วยไม่กี่คำ | "ทั้ง 4" · "เริ่มข้อ 2" |
| มีตัวเลือก "เอาทั้งหมด" ให้ | ส่วนใหญ่ผู้ใช้เลือกอันนี้ ถ้าต้องพิมพ์เองจะเสียเวลา |
| ถ้ามีลำดับที่แนะนำ ใส่ไว้ในคำถามเลย | เขาจะได้ตอบว่า "ตามนั้น" คำเดียว |

**ห้ามปิดด้วยการถามว่า "มีอะไรให้ช่วยเพิ่มไหม"** — ไม่ใช่คำถามที่ขอการตัดสินใจ

---

## 7 · ตัวอย่างเต็ม

**❌ ก่อน — 1 ย่อหน้ายาว 3 ก้อน อ่านจบแล้วยังไม่รู้ว่าต้องตอบอะไร**

> เรื่องด่วนที่เจอระหว่างตรวจ — BUILD-PLAN.md ที่สร้างเมื่อเช้านี้อ่านจาก
> `_to_delete/extracted/*.md` ซึ่งเป็นฉบับก่อนที่ผมจะแก้ มันจึงบันทึกไว้ว่า
> "FR ถึง FR-13.9 · TC 214 ข้อ · ไม่มี PLT" และตั้งคำถามข้อ 1 ว่าเลข 239 ไม่ตรง
> ตอนนี้เอกสารจริงเป็น FR-14.12 และ 245 กรณีแล้ว ต้อง extract ใหม่แล้วอัปเดต
> BUILD-PLAN ก่อนให้ agent เขียนโค้ดต่อ ไม่งั้นมันจะสร้างระบบตามสเปกเก่าและข้าม
> FR-14.x กับ PLT ทั้งหมด … ถ้าจะทำให้ชุดนี้เป็นตัวอย่างของโปรเจกต์ถัดไป ผมเสนอให้
> เติม 4 ไฟล์ที่คุ้มที่สุดก่อน คือ docs/README.md เป็นสารบัญบอกว่าอ่านอะไรก่อนและ
> ใครเป็นเจ้าของ, เพิ่มตารางประวัติการแก้ไขในหน้าแรกของทั้ง 4 docx, …

**✅ หลัง — โครงเดียวกัน 4 บล็อก**

> **ด่วน — `BUILD-PLAN.md` ตัวเลขเก่า** เพราะอ่านจาก `_to_delete/extracted/` ฉบับก่อนคุณแก้
> ต้อง re-extract ก่อนปล่อย agent เขียนโค้ด ไม่งั้นมันสร้างตามสเปกเก่าและข้าม FR-14.x กับ PLT ทั้งชุด
>
> | | ที่บันทึกไว้ | ของจริง |
> |---|---|---|
> | FR ถึง | 13.9 | **14.12** |
> | Test case | 214 | **245** |
> | PLT | ไม่มี | **มี** |
>
> คำถามข้อ 1 ที่ตั้งไว้ว่าเลข 239 ไม่ตรง — ตกไปเอง
>
> **ทำเป็นแม่แบบ: 4 ไฟล์ที่คุ้มสุด**
>
> | ไฟล์ | ได้อะไร |
> |---|---|
> | `docs/README.md` | สารบัญ — อ่านอะไรก่อน ใครเป็นเจ้าของ |
> | ประวัติการแก้ไข หน้าแรกของ docx ทั้ง 4 | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอพอดี |
> | `docs/DESIGN-SYSTEM.md` | ดึง token ออกจาก mockup มาเขียนเป็นเอกสาร |
> | `docs/adr/` | แยก ADR-1..12 เป็นไฟล์ละข้อ |
>
> FSD กับ API spec ไม่ทำตอนนี้ — ทำตอนเริ่มเขียนโค้ดของแต่ละหน้าจอ
>
> เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วย re-extract + อัปเดต BUILD-PLAN

**สิ่งที่หายไป ทั้งที่ข้อมูลครบเท่าเดิม:** คำเกริ่น · การเล่าว่าตรวจเจอยังไง ·
ชื่อไฟล์เต็มที่ไม่ได้ช่วยตัดสินใจ · คำอธิบายว่าทำไมคำถามเดิมถึงตกไป ·
รายละเอียดวิธีทำของแต่ละข้อเสนอ

---

## 8 · Anti-patterns

- ❌ **เปิดด้วย "ระหว่างตรวจผมพบว่า…"** — ผู้อ่านต้องอ่านถึงท้ายย่อหน้าถึงจะรู้ว่าต้องทำอะไร
- ❌ **ตัวเลขที่ขัดกันเขียนเป็นประโยค** — "เดิม 214 ตอนนี้ 245" ตาต้องกระโดดไปมา
- ❌ **อธิบายว่าปัญหาเกิดได้ยังไง** ทั้งที่ไม่เปลี่ยนสิ่งที่ต้องทำ
- ❌ **ข้อเสนอที่บอกวิธีทำแทนที่จะบอกประโยชน์** — ยังตัดสินใจไม่ได้อยู่ดี
- ❌ **ถามสามคำถามในย่อหน้าเดียว** — จะได้คำตอบข้อเดียว แล้วต้องถามซ้ำ
- ❌ **ปิดด้วย "แจ้งได้เลยครับ"** — ไม่ได้ขอการตัดสินใจอะไร
- ❌ **ขอโทษยาว ๆ ที่พลาด** — บอกว่าอะไรผิดและแก้ยังไง พอแล้ว
- ❌ **รายงานอย่างเดียวโดยไม่เสนอ** — ผลักภาระคิดกลับไปให้ผู้ใช้ทั้งหมด

---

## 9 · ตัวย่อ

- **FR** — Functional Requirement (ข้อกำหนดเชิงหน้าที่)
- **TC** — Test Case (กรณีทดสอบ)
- **ADR** — Architecture Decision Record (บันทึกเหตุผลของการตัดสินใจเชิงสถาปัตยกรรม)

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| เลือกว่าจะตอบเป็นตาราง รูป หรือร้อยแก้ว | `answer-shape` |
| กางตัวย่อและศัพท์เฉพาะในคำตอบ | `spell-out-abbreviations` |
| รายงานผลงานที่ทำเสร็จแล้ว | `anthropic-skills:short-answers` |
| แก้ของที่พังทันทีแทนที่จะรายงาน | `targeted-fix` |
| สิ่งที่เจอใหญ่พอจะเป็นเอกสาร | `polished-document-style` |
| สิ่งที่เจอคือเหตุขัดข้องของระบบจริง | `incident-runbook-template` · `postmortem-template` |
