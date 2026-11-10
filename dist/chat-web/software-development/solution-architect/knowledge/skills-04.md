# skill: database-design

Use when designing or changing a database schema (tables, columns, indexes, relations, migrations).

# ออกแบบฐานข้อมูล

> **กฎข้อเดียว:** schema คือของที่แก้ยากที่สุดในระบบ
> โค้ดผิดแก้วันนี้จบวันนี้ แต่ schema ผิดต้องอยู่กับมัน 3 ปี พร้อมข้อมูลจริงอีก 10 ล้านแถวที่ต้องย้ายตาม

## เมื่อไหร่ใช้ skill นี้

- ออกแบบฐานข้อมูลของระบบใหม่ หรือ module ใหม่
- จะเพิ่ม/แก้ตาราง คอลัมน์ ความสัมพันธ์ หรือ index
- จะเขียน migration โดยเฉพาะตอนที่ระบบมีข้อมูลจริงแล้ว
- query ช้าแล้วสงสัยว่าเป็นที่ schema หรือที่ index

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| เลือกสถาปัตยกรรมภาพรวม | `architecture-patterns` | แทน |
| ออกแบบ endpoint และรูปร่าง JSON | `api-conventions` | แทน |
| เก็บรหัสผ่าน token สิทธิ์ผู้ใช้ | `auth-implementation-patterns` | แทน |
| ที่เก็บ connection string | `config-and-secrets` | แทน |
| รัน migration ใน pipeline | `cicd-and-release` | แทน |
| วาดผัง Entity-Relationship (ER) | `diagram-figures` หรือ `markdown-visuals` | คู่ |
| บันทึกเหตุผลที่เลือกฐานข้อมูลตัวนี้ | `adr-writer` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

**ไวยากรณ์เฉพาะแต่ละฐานข้อมูล ชนิดข้อมูลเทียบกัน และคำสั่ง migration ของแต่ละ Object-Relational Mapping (ORM)** อยู่ใน `references/per-stack.md`

---

## 1 · เลือกชนิดฐานข้อมูลก่อน

| เกณฑ์ | Relational (PostgreSQL, SQL Server, MySQL) | Document (MongoDB) |
|---|---|---|
| ข้อมูลมีความสัมพันธ์ชัด ต้อง join | ✓ | ✗ ต้องทำมือ |
| รูปร่างข้อมูลไม่แน่นอน ต่างกันรายตัว | ระวัง ใช้คอลัมน์ JSON | ✓ |
| ต้องการ transaction ข้ามหลายตาราง | ✓ | ระวัง ได้แต่แพงกว่า |
| รายงาน ผลรวม การวิเคราะห์ | ✓ | ✗ |
| เขียนหนักมาก log/telemetry | ระวัง | ✓ หรือใช้ time-series |

> **ค่าเริ่มต้นคือ relational** ให้เลือก document เมื่อ**ตอบได้ว่าทำไม**
> "ยืดหยุ่นกว่า" ไม่ใช่เหตุผล แต่แปลว่ายังไม่ได้ออกแบบ
> ระบบส่วนใหญ่ที่เลือก document เพราะยืดหยุ่น สุดท้ายเขียนโค้ด join เองในแอป

**ผสมกันได้**: ใช้ relational เป็นหลัก แล้วเก็บข้อมูลที่รูปร่างไม่แน่นอนเป็นคอลัมน์ `jsonb`
เกือบทุกกรณี ทางนี้ดีกว่าแยกฐานข้อมูล 2 ตัว

---

## 2 · กฎตั้งชื่อ — เลือกครั้งเดียว ใช้ทั้งระบบ

| สิ่งที่ตั้งชื่อ | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ตาราง | `snake_case` **พหูพจน์** | `orders`, `order_items` |
| คอลัมน์ | `snake_case` เอกพจน์ | `created_at`, `total_amount` |
| primary key | `id` | `id` |
| foreign key | `<ตารางเอกพจน์>_id` | `customer_id` |
| ตารางเชื่อม | `<a>_<b>` เรียงตามตัวอักษร | `role_users` ✓ (ไม่ใช่ `user_roles`) |
| index | `ix_<ตาราง>_<คอลัมน์>` | `ix_orders_customer_id` |
| unique | `ux_<ตาราง>_<คอลัมน์>` | `ux_users_email` |
| foreign key constraint | `fk_<ตาราง>_<ตารางปลายทาง>` | `fk_orders_customers` |
| check constraint | `ck_<ตาราง>_<เรื่อง>` | `ck_orders_total_non_negative` |

**สิ่งที่ห้ามทำ:**

- ผิด: ใส่ชนิดข้อมูลในชื่อ เช่น `name_varchar`, `is_active_bit`
- ผิด: ใส่ชื่อตารางนำหน้าคอลัมน์ เช่น `order_order_date` (มันอยู่ในตาราง `orders` อยู่แล้ว)
- ผิด: ใช้คำสงวน เช่น `user`, `order`, `group`, `key` ซึ่งต้องใส่เครื่องหมายคำพูดทุกครั้ง ให้ใช้ `users`, `orders` แทน
- ผิด: ตัวย่อที่คนอ่านไม่ออก เช่น `cst_nm` ประหยัดได้ 8 ตัวอักษร แต่แลกกับความสับสน 3 ปี

> SQL Server ใช้ `PascalCase` ก็ได้ ถ้าโปรเจกต์เดิมใช้อยู่แล้ว
> **ใช้แบบเดียวกันทั้งระบบสำคัญกว่าว่าแบบไหนถูก** อย่าเปลี่ยนกลางทาง

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

> 🚨 **soft delete (ลบโดยแค่ติดป้าย) มีต้นทุน** คือทุก unique constraint ต้องคิดใหม่
> `ux_users_email` จะกันไม่ให้สมัครอีเมลเดิมซ้ำ แม้บัญชีเก่าถูกลบไปแล้ว
> แก้ด้วย partial index: `CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`

---

## 4 · เลือกชนิด identifier

| ชนิด | ข้อดี | ข้อเสีย | ใช้เมื่อ |
|---|---|---|---|
| `bigint` เรียงเพิ่ม | เล็ก เร็ว index ไม่แตก อ่านง่ายตอนไล่ปัญหา | เดา id ถัดไปได้ · รวมข้อมูลหลายที่แล้วชนกัน | ค่าเริ่มต้น ระบบเดียว ฐานข้อมูลเดียว |
| **UUIDv7 / ULID** | เรียงตามเวลา · สร้างจากฝั่งแอปได้ · ไม่ชนกัน | 16 ไบต์ · อ่านด้วยตายาก | ระบบกระจาย · ต้องสร้าง id ก่อนบันทึก · id โผล่ใน URL |
| `UUIDv4` สุ่มล้วน | ไม่ชนกัน เดาไม่ได้ | **index แตกกระจาย เขียนช้าลงชัดเจนเมื่อข้อมูลเยอะ** | เลี่ยงถ้าเลือกได้ |

> 🚨 **UUIDv4 เป็น primary key คือกับดักที่เจอบ่อยที่สุด**
> ค่าสุ่มล้วนทำให้ทุก insert ไปแทรกกลางโครงสร้าง index
> ข้อมูลหลักหมื่นยังไม่รู้สึก แต่พอถึงหลักสิบล้านจะช้าจนต้องรื้อ
> ถ้าต้องใช้ UUID ให้ใช้ **v7** ซึ่งขึ้นต้นด้วยเวลา จึงเรียงเพิ่มเหมือน bigint

**เลขที่คนเห็นไม่ใช่ primary key**: เลขใบสั่งซื้อ `SO-2026-00042` ที่ลูกค้าอ้างถึง
ให้เก็บเป็นคอลัมน์ต่างหากที่มี unique constraint และไม่เอา primary key ไปโชว์

---

## 5 · normalisation แค่ไหนพอ

**เริ่มที่ Third Normal Form (3NF) เสมอ**: ข้อเท็จจริง 1 อย่างเก็บที่เดียว

denormalise (ยอมเก็บข้อมูลซ้ำ) ได้เมื่อครบ 3 ข้อนี้เท่านั้น:

1. วัดแล้วว่าช้าจริง (มีตัวเลข ไม่ใช่ความรู้สึก)
2. รู้ว่าข้อมูลซ้ำจะถูกอัปเดตยังไงให้ตรงกัน
3. เขียนเหตุผลไว้ในคอมเมนต์ของตาราง

**ข้อยกเว้นที่ยอมรับกันทั่วไป**: ข้อมูลที่ต้อง "แช่แข็ง" ณ เวลาหนึ่ง
ราคาสินค้าในใบสั่งซื้อต้องคัดลอกลง `order_items.unit_price`
ไม่ join ไปหา `products.price` เพราะราคาวันนี้ไม่ใช่ราคาวันที่ลูกค้าซื้อ

---

## 6 · สี่ชนิดข้อมูลที่พลาดกันประจำ

รายละเอียด 4 ชนิดข้อมูลที่พลาดกันประจำ (เงิน · เวลา · enum หรือสถานะ · boolean) พร้อมตัวอย่าง อยู่ใน [`data-types`](references/data-types.md)

## 7 · index — วางตรงไหนถึงได้ผล

**ต้องมี:**

- ทุก foreign key (ฐานข้อมูลส่วนใหญ่ **ไม่สร้างให้อัตโนมัติ**)
- คอลัมน์ที่อยู่ใน `WHERE` ของ query ที่รันบ่อย
- คอลัมน์ที่ใช้ `ORDER BY` คู่กับ pagination

**composite index (index หลายคอลัมน์): ลำดับคอลัมน์สำคัญ**

```sql
-- query: WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX ix_orders_tenant_status_created
  ON orders (tenant_id, status, created_at DESC);
```

เรียงคอลัมน์ตามเงื่อนไข: **เท่ากับ → ช่วง → เรียงลำดับ**
index `(a, b)` ใช้กับ query ที่กรองด้วย `a` อย่างเดียวได้ แต่กรองด้วย `b` อย่างเดียว**ไม่ได้**

**อย่าใส่ index เมื่อ:**

- ตารางเล็กกว่าไม่กี่พันแถว เพราะฐานข้อมูลอ่านทั้งตารางเร็วกว่า
- คอลัมน์มีค่าซ้ำเยอะ เช่น `is_active` ที่ 95% เป็น true
- ตารางเขียนบ่อยกว่าอ่านมาก เพราะทุก index เพิ่มต้นทุนทุกครั้งที่เขียน

> **วัดก่อนเดา**: `EXPLAIN ANALYZE` (PostgreSQL) หรือ execution plan (SQL Server)
> บอกได้ว่า index ถูกใช้จริงไหม ส่วนการเดาว่า "น่าจะช่วย" ผิดบ่อยกว่าถูก

---

## 8 · constraint อยู่ที่ฐานข้อมูล ไม่ใช่แค่ที่แอป

| กฎ | ที่ควรอยู่ |
|---|---|
| อีเมลห้ามซ้ำ | `UNIQUE` ที่ฐานข้อมูล **และ** ตรวจในแอปเพื่อให้ข้อความ error สวย |
| ยอดเงินห้ามติดลบ | `CHECK (total_amount >= 0)` |
| ใบสั่งซื้อต้องมีลูกค้าจริง | `FOREIGN KEY` |
| สถานะต้องเป็นค่าที่กำหนด | `CHECK` หรือ lookup table |

> **เหตุผล:** แอปไม่ใช่ทางเดียวที่แตะข้อมูล ยังมี script แก้ข้อมูลด่วน
> งาน import ตอนตี 3 และ service ตัวที่ 2 ที่เขียนทีหลัง
> constraint ที่ฐานข้อมูลคือด่านสุดท้ายที่ไม่มีใครข้ามได้

**`ON DELETE` ต้องเลือกอย่างตั้งใจ:**

| ตัวเลือก | ความหมาย | ใช้กับ |
|---|---|---|
| `RESTRICT` (ค่าเริ่มต้นที่ควรใช้) | ลบไม่ได้ถ้ายังมีลูก | เกือบทุกกรณี |
| `CASCADE` | ลบลูกตามทั้งหมด | ของที่เป็นส่วนประกอบจริง ๆ เช่น `order_items` |
| `SET NULL` | ลูกกลายเป็นไม่มีพ่อ | ความสัมพันธ์ที่ไม่บังคับ |

ถ้าใส่ `CASCADE` ผิดที่เดียว ลบลูกค้า 1 คน แล้วประวัติการซื้อ 10 ปีจะหายตาม

---

## 9 · migration — เปลี่ยน schema โดยไม่ต้องปิดระบบ

ขั้นตอน expand-and-contract และตัวอย่าง migration ที่ deploy ได้โดยไม่ปิดระบบ อยู่ใน [`migrations`](references/migrations.md)

คลังข้อมูลเพื่อวิเคราะห์ (star schema · SCD · ELT) อยู่ใน [`warehouse-modeling`](references/warehouse-modeling.md) · pipeline ที่รันซ้ำได้ (incremental · backfill · ทดสอบคุณภาพข้อมูล · checklist ก่อนขึ้น production) อยู่ใน [`data-pipeline-patterns`](references/data-pipeline-patterns.md)

## 10 · ระบบหลายผู้เช่า (multi-tenant)

| แบบ | แยกกันแค่ไหน | ต้นทุน | เหมาะกับ |
|---|---|---|---|
| คอลัมน์ `tenant_id` ในทุกตาราง | ต่ำ พลาดที่เดียวข้อมูลก็รั่วข้ามผู้เช่า | ถูกสุด | ผู้เช่าเยอะ ข้อมูลต่อรายไม่ใหญ่ |
| schema แยกต่อผู้เช่า | กลาง | migration ต้องวนทุก schema | ผู้เช่าหลักสิบถึงหลักร้อย |
| ฐานข้อมูลแยกต่อผู้เช่า | สูงสุด | แพงสุด | ลูกค้าองค์กรที่บังคับให้แยก |

> 🚨 ถ้าเลือกแบบ `tenant_id` ให้**บังคับที่ชั้นล่างสุด ไม่ใช่ใส่ใน query ทีละตัว**
> ใช้ row-level security ของฐานข้อมูล หรือ global filter ของ ORM
> query ที่ลืมใส่ `WHERE tenant_id = ?` แค่ตัวเดียว ก็ทำให้ข้อมูลลูกค้ารายหนึ่งโผล่ให้อีกรายเห็น
> และไม่มี error ให้เห็นเลย

---

## 11 · ข้อมูลส่วนบุคคล

- ทำรายการว่า **คอลัมน์ไหนเป็นข้อมูลส่วนบุคคล** ถ้าไม่มีรายการนี้จะตอบคำถาม "ข้อมูลฉันอยู่ที่ไหนบ้าง" ไม่ได้
- เลขบัตรประชาชน หมายเลขบัตรเครดิต และข้อมูลสุขภาพ ให้เข้ารหัสระดับคอลัมน์ หรือไม่เก็บเลยถ้าไม่จำเป็น
- กำหนด **อายุการเก็บ** ต่อตาราง และมีงานลบจริงตามนั้น
- ต้องลบได้เมื่อเจ้าของขอ และ soft delete อย่างเดียวไม่นับว่าลบ
- ห้ามคัดลอกข้อมูลจริงลงเครื่อง developer โดยไม่ปิดบัง

---

## 12 · Anti-patterns

- **ตารางเดียวเก็บทุกอย่าง** (`entity` / `attribute` / `value`) query อะไรก็ยากไปหมด
- **`varchar(255)` ทุกคอลัมน์** ตัวเลขนี้ไม่มีความหมายอะไร ให้กำหนดจากข้อมูลจริง
- **เก็บหลายค่าในคอลัมน์เดียว** เช่น `"1,4,7"` ค้นไม่ได้ ใส่ constraint ไม่ได้ ให้ใช้ตารางเชื่อม
- **ไม่มี foreign key เพราะ "แอปดูแลเอง"** สักวันจะมีแถวกำพร้า
- **index ทุกคอลัมน์เผื่อไว้** เขียนช้าลง พื้นที่บาน โดยไม่มีใครได้ประโยชน์
- **`SELECT *` ในโค้ดจริง** เพิ่มคอลัมน์ทีไรโค้ดพังทุกที
- **ตรรกะธุรกิจใน trigger** ไล่ปัญหาไม่เจอ เพราะไม่มีใครเห็นว่ามันทำงาน
- **migration ที่เขียนข้อมูลด้วย** ปนกับที่เปลี่ยนโครงสร้าง พอ rollback ข้อมูลก็หาย
- **แก้ schema บน production ด้วยมือ** deploy รอบหน้า schema จะไม่ตรงกัน


## reference: data-pipeline-patterns.md

# Data pipeline patterns — incremental, backfill, quality, catalog

ทุก pipeline ต้องรันซ้ำได้ผลเท่าเดิม (`principle-safe-to-rerun`) และส่งค่าเข้า SQL เป็น parameter เสมอ

**สารบัญ:**

- [Pipeline Patterns](#pipeline-patterns)
- [Data Catalog Pattern](#data-catalog-pattern)
- [Production Pipeline Checklist](#production-pipeline-checklist)

## Pipeline Patterns

### Pattern 1: Incremental Loading

```sql
-- dbt incremental model
{{ config(materialized='incremental', unique_key='id') }}

SELECT
    id,
    user_id,
    event_type,
    created_at
FROM {{ source('raw', 'events') }}
WHERE 1=1
{% if is_incremental() %}
    -- Only new since last run
    AND created_at > (SELECT MAX(created_at) FROM {{ this }})
{% endif %}
```

### Pattern 2: Late-arriving Data

```sql
-- Don't just look at last 1 hour, look back further for late events
WHERE created_at > NOW() - INTERVAL '7 days'  -- buffer
  AND created_at > (SELECT MAX(created_at) - INTERVAL '1 day' FROM target)
```

### Pattern 3: Data Quality Tests (dbt)

```yaml
# models/marts/orders.yml
version: 2

models:
  - name: orders
    description: One row per order
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('customers')
              field: customer_id
      - name: amount
        tests:
          - dbt_utils.expression_is_true:
              expression: ">= 0"
```

### Pattern 4: Idempotent Backfills

```python
# Backfill should be safe to re-run
async def backfill(start_date: date, end_date: date):
    for d in date_range(start_date, end_date):
        # DELETE then INSERT in one transaction (idempotent); value passed as a parameter, never in the SQL string
        async with db.transaction():
            await db.execute("DELETE FROM target WHERE date = $1", d)
            await load_for_date(d)
```

### Pattern 5: Real-time Pipeline

```python
# Kafka consumer pattern
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'events',
    bootstrap_servers='kafka:9092',
    enable_auto_commit=False,  # ← manual commit = at-least-once (not exactly-once)
    isolation_level='read_committed',
)

batch = []
for message in consumer:
    batch.append(parse(message))

    if len(batch) >= 1000:
        # Write first, commit the offset after. Kafka and the DB share no
        # transaction, so a crash between the two replays this batch
        # (at-least-once). Make the write idempotent so a replay is harmless.
        with db.transaction():
            db.bulk_upsert('events', batch, key=('topic', 'partition', 'offset'))  # unique key + ON CONFLICT DO NOTHING
        consumer.commit()  # only after the DB write succeeds
        batch = []
```

For exactly-once effect: idempotent upsert as above, or store the offsets in the
same DB transaction as the data and seek to them on start (skip `consumer.commit()`).

## Data Catalog Pattern

For every table, document:

```yaml
- table: dim_customer
  description: Slowly-changing customer master
  owner: data-team
  freshness: hourly
  source: postgres.app.users (CDC)
  pii: yes
  retention: 7 years
  columns:
    - name: customer_key
      description: Surrogate key
    - name: customer_id
      description: Natural key from source system
    - name: email
      pii: yes
```

## Production Pipeline Checklist

- [ ] Schema validation at ingestion
- [ ] Schema evolution handled (additive only)
- [ ] Tests on critical columns (uniqueness, not-null, ranges)
- [ ] Monitoring on row counts, freshness, error rates
- [ ] Alerting (PagerDuty / Slack) on failures
- [ ] Backfill procedure documented + tested
- [ ] Idempotency verified
- [ ] Lineage visible (dbt docs, OpenLineage)
- [ ] PII tagged
- [ ] Access controls per dataset
- [ ] Cost monitored (query / storage)


## reference: data-types.md

# 6 · สี่ชนิดข้อมูลที่พลาดกันประจำ

### เงิน

```sql
total_amount   numeric(19,4)   NOT NULL      -- ถูก:
currency       char(3)         NOT NULL      -- ถูก: ISO 4217 เช่น THB
total_amount   float / double                -- ผิด: 0.1 + 0.2 ไม่เท่ากับ 0.3
```

> ผิด: **float กับเงินคือบั๊กที่หาไม่เจอ** ยอดรวมเพี้ยนรายการละ 1 สตางค์
> ปิดงบสิ้นเดือนถึงรู้ แล้วไล่ย้อนไม่ได้ว่าเพี้ยนตรงไหน

### เวลา

| เก็บ | ใช้ | เหตุผล |
|---|---|---|
| เวลาที่เกิดเหตุการณ์ | `timestamptz` (SQL Server ใช้ `datetimeoffset`) เก็บเป็น UTC | ประเทศไทยไม่มี daylight saving แต่ระบบที่ขายต่างประเทศมี |
| วันเกิด วันครบกำหนด | `date` | ไม่มีเวลา ไม่มีโซนเวลา |
| ช่วงเวลาเปิดร้าน | `time` + คอลัมน์โซนเวลาแยก | |

**กฎ:** เก็บ UTC แล้วแปลงเป็น `+07:00` ตอนแสดงผลเท่านั้น ห้ามเก็บเวลาไทยดิบ ๆ ใน `timestamp` ที่ไม่มีโซน

**พุทธศักราช**: เก็บเป็น ค.ศ. เสมอ แล้วแปลงเป็น พ.ศ. ตอนแสดงผล
ถ้าเก็บปี 2569 ลงฐานข้อมูล ทุกฟังก์ชันจะคำนวณช่วงเวลาผิด

### enum / สถานะ

| วิธี | ดีเมื่อ | เสียเมื่อ |
|---|---|---|
| ตาราง lookup + foreign key | ค่าเพิ่มได้โดยไม่ deploy มีชื่อไทย/อังกฤษ และมีลำดับการแสดง | ต้อง join |
| `check constraint` เป็นข้อความ | ค่าคงที่ ไม่ค่อยเปลี่ยน | เพิ่มค่าต้อง migration |
| ชนิด `enum` ของ PostgreSQL | เร็ว เล็ก | **ลบค่าออกไม่ได้** เปลี่ยนลำดับไม่ได้ |
| `int` ดิบ ๆ | — | ✗ อ่าน `status = 3` แล้วไม่มีใครรู้ว่าอะไร |

### boolean

- ตั้งชื่อเป็นประโยคบอกเล่าเชิงบวก: `is_active` (ถูก) · `is_not_disabled` (ผิด)
- **ถ้าอาจมีสถานะที่ 3 ในอนาคต อย่าใช้ boolean** เพราะ `is_approved` จะกลายเป็น `approval_status`
  ภายใน 6 เดือน เมื่อมี "รออนุมัติ" เพิ่มมา

---


## reference: migrations.md

# 9 · migration — เปลี่ยน schema โดยไม่ต้องปิดระบบ

**กฎ 3 ข้อ:**

1. **เดินหน้าอย่างเดียว**: migration ที่ merge แล้วห้ามแก้ ถ้าผิดให้เขียนตัวใหม่ทับ
2. **1 migration ทำเรื่องเดียว**: ไล่ปัญหาง่าย และ rollback ได้ตรงจุด
3. **โค้ดเวอร์ชันเก่ากับ schema เวอร์ชันใหม่ต้องทำงานด้วยกันได้** เพราะระหว่าง deploy มีโค้ดทั้ง 2 เวอร์ชันรันพร้อมกันเสมอ

### expand / contract — ขั้นตอนมาตรฐานสำหรับการเปลี่ยนที่ทำลายของเดิม

ตัวอย่าง: เปลี่ยนชื่อคอลัมน์ `name` → `full_name`

| รอบ deploy | ฐานข้อมูล | โค้ด |
|:--:|---|---|
| **1 · ขยาย** | เพิ่ม `full_name` (nullable) | เขียนลงทั้ง 2 คอลัมน์ · อ่านจาก `name` |
| **2 · ย้าย** | คัดลอกข้อมูลเก่าเป็นชุด ๆ | อ่านจาก `full_name` ถ้าไม่มีค่อยดู `name` |
| **3 · บีบ** | ตั้ง `NOT NULL` · ลบ `name` | อ่านและเขียน `full_name` อย่างเดียว |

ทำ 3 รอบดูเสียเวลา แต่ทุกรอบ rollback ได้โดยไม่เสียข้อมูล
ถ้าทำรอบเดียว ก็ต้องยอมรับว่าต้องปิดระบบ

**คำสั่งที่ล็อกตารางจนระบบค้าง** (ระวังเป็นพิเศษบนตารางใหญ่):

- เพิ่มคอลัมน์ที่มี `DEFAULT` และ `NOT NULL` พร้อมกัน ซึ่ง PostgreSQL รุ่นใหม่ทำได้เร็ว และ MySQL 8.0.12 ขึ้นไปเพิ่มคอลัมน์แบบ INSTANT ได้ (การเปลี่ยนชนิดข้อมูลยังเขียนตารางใหม่)
- เปลี่ยนชนิดข้อมูล
- สร้าง index ธรรมดา ให้ใช้ `CREATE INDEX CONCURRENTLY` แทน (PostgreSQL) หรือ `ONLINE = ON` (SQL Server)

**ทดสอบ migration กับสำเนาข้อมูลจริงเสมอ** เพราะ migration ที่รัน 0.2 วินาทีบนเครื่องตัวเอง
อาจใช้ 40 นาทีบน production และล็อกตารางไว้ตลอด

---


## reference: per-stack.md

# ไวยากรณ์และเครื่องมือแยกตามฐานข้อมูล/ORM

**สารบัญ:** 1 ชนิดข้อมูลเทียบกัน · 2 PostgreSQL · 3 SQL Server · 4 MySQL / MariaDB · 5 MongoDB · 6 Entity Framework Core (.NET) · 7 Prisma / Drizzle (Node) · 8 Alembic (Python) · 9 คำสั่งตรวจ query ช้า

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

> 🚨 **SQL Server + ภาษาไทย**: `varchar` ทำให้ตัวอักษรไทยกลายเป็น `?`
> ต้องใช้ `nvarchar` และเขียนค่าคงที่เป็น `N'ข้อความ'` เสมอ
>
> 🚨 **MySQL ต้องเป็น `utf8mb4`** เพราะชุดอักขระชื่อ `utf8` เฉย ๆ ของ MySQL
> เก็บได้แค่ 3 ไบต์ต่อตัว อีโมจิและอักขระบางตัวจึงหาย

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

**กับดักที่เจอบ่อยใน PostgreSQL** (แนวคิดจาก wshobson postgresql-table-design · เลขรุ่นคือรุ่นที่พฤติกรรมเริ่มเป็นแบบนี้)

| กับดัก | ทำแบบนี้แทน |
|---|---|
| `timestamp` (ไม่มี time zone) ทิ้ง offset เงียบ ๆ เครื่อง `+07:00` กับ UTC เก็บค่าคนละความหมาย | `timestamptz` เสมอ |
| `serial` สร้าง sequence แยกที่สิทธิ์และ `DROP` ไม่ตามตาราง | `GENERATED ALWAYS AS IDENTITY` (PG 10+) |
| `ADD COLUMN ... NOT NULL` บนตารางใหญ่กลัวล็อกนาน | ถ้าใส่ `DEFAULT` ค่าคงที่ ไม่เขียนตารางใหม่แล้ว (PG 11+) · DEFAULT ที่เป็นฟังก์ชันเช่น `now()` ยังเขียนใหม่ทั้งตาราง |
| `ADD CONSTRAINT` (FK · CHECK) สแกนทั้งตารางขณะถือล็อก | `... NOT VALID` ก่อน แล้ว `VALIDATE CONSTRAINT` แยกคำสั่ง (ล็อกเบากว่า) |
| DDL ต่อคิวหลัง transaction ยาว แล้วทุก query หลังมันค้างตาม | `SET lock_timeout = '5s'` ก่อน DDL ทุกครั้ง ตกแล้วรันใหม่ |
| unique index ปล่อยให้ `NULL` ซ้ำได้หลายแถว | `UNIQUE NULLS NOT DISTINCT` (PG 15+) หรือ partial index `WHERE col IS NOT NULL` |
| `LIKE '%คำ%'` และ `ILIKE` ไม่ใช้ btree index | extension `pg_trgm` + GIN index · ค้นข้อความจริงจังใช้ `tsvector` |
| `jsonb` ค้นด้วย `->>` ไม่ใช้ index | GIN index บนคอลัมน์ (`@>` · `?`) หรือ expression index บน `(meta->>'key')` |
| `count(*)` ทั้งตารางเพื่อแสดงจำนวนหน้า | ใช้ค่าประมาณจาก `pg_class.reltuples` หรือเลิกแสดงจำนวนรวม (cursor pagination) |

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

- `rowversion` ใช้เป็น ETag ตรวจว่ามีคนแก้ชนกันได้ตรง ๆ
- ถ้าต้องเรียงลำดับภาษาไทย ให้ตั้ง collation `Thai_100_CI_AS` ที่ระดับคอลัมน์หรือฐานข้อมูล
- `datetime` แบบเก่าละเอียดแค่ 3.33 มิลลิวินาที ให้ใช้ `datetime2` / `datetimeoffset` แทน

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

- MySQL 8.0.12 ขึ้นไป `ADD COLUMN` ใช้ `ALGORITHM=INSTANT` ได้ (ก่อน 8.0.29 เพิ่มได้เฉพาะท้ายตาราง) ส่วนการเปลี่ยนชนิดข้อมูลยังเขียนตารางใหม่ (dev.mysql.com online DDL, ตรวจ 22 ต.ค. 2569) ตารางใหญ่ที่ต้อง rebuild จึงควรใช้ `pt-online-schema-change` หรือ `gh-ost`
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
      totalAmount: { bsonType: "decimal" },   // ผิด: อย่าใช้ double กับเงิน
      createdAt:   { bsonType: "date" }
    }
  }}
});
db.orders.createIndex({ orderNo: 1 }, { unique: true });
db.orders.createIndex({ customerId: 1, createdAt: -1 });
```

- ฝัง (embed) เมื่อข้อมูลลูก **อ่านคู่กับพ่อเสมอ และไม่โตไม่จำกัด** นอกนั้นใช้การอ้างอิง
- เอกสาร 1 ใบมีเพดาน 16 MB อาเรย์ที่โตเรื่อย ๆ จึงชนเพดานสักวัน
- เงินใช้ `Decimal128` เท่านั้น

---

## 6 · Entity Framework Core (.NET)

```bash
dotnet ef migrations add AddOrderStatus
dotnet ef migrations script <from> <to> -o migrate.sql   # ถูก: ตรวจ SQL ก่อนรันจริง
dotnet ef database update                                # dev เท่านั้น
```

> **บน production รัน script ที่ตรวจแล้ว ไม่ใช่ `database update`**
> คำสั่งนั้นต้องให้ connection ของแอปมีสิทธิ์แก้ schema ซึ่งไม่ควรมีตั้งแต่แรก

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
  status      String   @db.VarChar(20)
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

- `Decimal` ของ Prisma คืนค่าเป็น object ไม่ใช่ number ให้คำนวณด้วย `decimal.js` อย่าแปลงเป็น float
- `BigInt` แปลงเป็น JSON ตรง ๆ ไม่ได้ ต้องแปลงเป็น string ที่ชั้น API

---

## 8 · Alembic (Python)

```bash
alembic revision --autogenerate -m "add order status"
alembic upgrade head
alembic downgrade -1
```

แยกเป็น 3 migration (1 migration ทำเรื่องเดียว):

```python
# 1) schema: เพิ่มคอลัมน์ที่ยังว่างได้
def upgrade():
    op.add_column("orders", sa.Column("status", sa.String(20), nullable=True))

# 2) ข้อมูล: เติมค่าเดิม (ตารางใหญ่ให้ทำเป็นชุดเล็ก ๆ)
def upgrade():
    op.execute("UPDATE orders SET status = 'draft' WHERE status IS NULL")

# 3) schema: บังคับ NOT NULL และสร้าง index
def upgrade():
    op.alter_column("orders", "status", nullable=False)
    # CREATE INDEX CONCURRENTLY ห้ามอยู่ใน transaction จึงต้องออกจาก transaction ของ Alembic
    with op.get_context().autocommit_block():
        op.create_index("ix_orders_status_created", "orders", ["status", "created_at"],
                        postgresql_concurrently=True)
```

> `--autogenerate` **ไม่เห็น** การเปลี่ยนชื่อ (มองเป็นลบแล้วเพิ่มใหม่ ข้อมูลจึงหาย)
> อ่านไฟล์ที่มันสร้างก่อน commit ทุกครั้ง

---

## 9 · คำสั่งตรวจ query ช้า

| ฐานข้อมูล | คำสั่ง |
|---|---|
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) <query>;` · ส่วนขยาย `pg_stat_statements` |
| SQL Server | เปิด "Include Actual Execution Plan" · `sys.dm_exec_query_stats` |
| MySQL | `EXPLAIN ANALYZE <query>;` · `performance_schema` |
| MongoDB | `db.orders.find(...).explain("executionStats")` |

**สัญญาณอันตรายที่ต้องแก้:** `Seq Scan` / `Table Scan` บนตารางใหญ่ ·
จำนวนแถวที่ประมาณไว้ต่างจากที่ได้จริงเกิน 10 เท่า · `Nested Loop` ที่วนหลักแสนรอบ


## reference: warehouse-modeling.md

# Warehouse modeling — ELT, stack, star schema, SCD

สำหรับคลังข้อมูลเพื่อวิเคราะห์ (analytics warehouse) ไม่ใช่ฐานข้อมูลของแอป

**สารบัญ:**

- [ELT vs ETL (Modern Default: ELT)](#elt-vs-etl-modern-default-elt)
- [Tech Stack (2026 Recommendations)](#tech-stack-2026-recommendations)
- [Schema Design: Star/Snowflake](#schema-design-starsnowflake)
- [SCD (Slowly Changing Dimensions)](#scd-slowly-changing-dimensions)

## ELT vs ETL (Modern Default: ELT)

```
ETL (old way):
Source → Transform → Warehouse
        ↑
        Limited compute, slow

ELT (modern):
Source → Load raw → Transform in warehouse
                    ↑
                    Snowflake/BigQuery scale
```

> 💡 **2026 default: ELT with dbt** — load raw to warehouse, transform with SQL via dbt

## Tech Stack (2026 Recommendations)

> รายชื่อเครื่องมือจากความรู้ของโมเดล ยังไม่ได้ตรวจกับเว็บทางการ (รอยืนยัน) — ตรวจก่อนแนะนำ

### Warehouse / Lake
| Tool | Best for | Cost |
|------|----------|------|
| **Snowflake** | Pure warehouse, separation of compute/storage | 💰💰 |
| **BigQuery** | Serverless, ad-hoc, GCP shops | 💰💰 |
| **Databricks** | Unified lake + warehouse, ML-heavy | 💰💰💰 |
| **DuckDB** | Local dev, embedded analytics | 💰 free |
| **Redshift** | AWS-native, legacy | 💰💰 |
| **Postgres** | Small data (<1TB), simplicity | 💰 |

### Transformation
- **dbt** — SQL-based, version controlled, tested (industry default)
- **SQLMesh** — newer alternative to dbt, stronger features

### Orchestration
- **Airflow** — most popular, mature
- **Prefect** — modern Python-native
- **Dagster** — software-engineering approach to pipelines

### Stream Processing
- **Kafka + Flink** — high throughput, exactly-once
- **Kinesis Streams + Flink** — AWS-native
- **Pub/Sub + Dataflow** — GCP-native
- **Materialized views** (Snowflake, BigQuery) — for simple cases

### Ingestion
- **Airbyte** — open source, many connectors
- **Fivetran** — managed, expensive but reliable
- **Estuary** — modern, streaming-first
- **Custom** — for sources not covered

## Schema Design: Star/Snowflake

```sql
-- Fact table (events / measurements)
CREATE TABLE fact_orders (
    order_key BIGINT PRIMARY KEY,
    customer_key BIGINT,
    product_key BIGINT,
    date_key INT,
    quantity INT,
    amount NUMERIC(19,4)
    -- foreign keys to dimensions
);

-- Dimension tables (descriptive context)
CREATE TABLE dim_customer (
    customer_key BIGINT PRIMARY KEY,
    customer_id VARCHAR,        -- natural key
    name VARCHAR,
    email VARCHAR,
    country VARCHAR,
    -- SCD Type 2 tracking:
    valid_from DATE,
    valid_to DATE,
    is_current BOOLEAN
);
```

> 💡 **Star = denormalized, query-fast**
> **Snowflake = normalized dims, save storage**
> **Wide tables / OBT (One Big Table) = even faster for analytics**

## SCD (Slowly Changing Dimensions)

### Type 1: Overwrite
```
Customer Bob lived in Bangkok. Moved to Phuket.
→ Update row, lose Bangkok history
```

### Type 2: New row per change (most common)
```
| customer_key | id | name | city    | valid_from | valid_to   | is_current |
| 1            | 42 | Bob  | Bangkok | 2024-01-01 | 2025-06-30 | false      |
| 2            | 42 | Bob  | Phuket  | 2025-07-01 | 9999-12-31 | true       |
```

### Type 3: Add column
```
Customer table: current_city, previous_city
→ Only most recent change preserved
```


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

| กฎ | ✓ | ✗ |
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

- **`200 OK` พร้อม `{"success": false}`** — ตัวเฝ้าระบบและ log ทั้งหมดจะมองไม่เห็นว่าพัง
- **กริยาใน URL** — `/createOrder`, `/getOrderById`
- **รายการที่ไม่มี pagination** — วันหนึ่งจะคืนข้อมูล 50,000 แถวในครั้งเดียว
- **รูปแบบวันที่คนละแบบในแต่ละ endpoint** — เช่น `"25/09/2026"` ที่ไม่มีใครรู้ว่าวันหรือเดือนขึ้นก่อน
- **ส่ง entity ของฐานข้อมูลออกไปตรง ๆ** — เพิ่มคอลัมน์ทีไร API เปลี่ยนตามโดยไม่ตั้งใจ และเสี่ยงข้อมูลภายในหลุด
- **ชื่อฟิลด์ปนกัน** `created_at` กับ `updatedAt` ใน response เดียวกัน
- **`GET` ที่เปลี่ยนข้อมูล** — ตัวโหลดหน้าเว็บล่วงหน้าจะยิงเองโดยไม่มีใครกด
- **error message เปลี่ยนไปเรื่อย ๆ** โดยไม่มี `code` คงที่
- **ไม่มีเอกสาร** — OpenAPI ที่สร้างจากโค้ดจริง ดีกว่าเอกสารที่เขียนมือแล้วไม่ตรง


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

# skill: web-service-essentials

Use when building or reviewing any HTTP service or backend (health endpoints, RFC 9457 errors).

# Web Service Essentials

> **กฎข้อเดียว:** ก่อนเขียน endpoint ธุรกิจตัวแรก service ต้องตอบได้ว่า
> "ยังอยู่ไหม · พร้อมรับงานไหม · ตอนนี้รันเวอร์ชันอะไร" ถ้าตอบไม่ได้ วันที่ระบบล่มคุณจะต้องเดาล้วน ๆ

## เมื่อไหร่ใช้ skill นี้

- เริ่ม service / REST API / microservice ใหม่
- มีคนขอ health check, ping, readiness, liveness, version endpoint
- จะ deploy ขึ้น production ครั้งแรก หรือย้ายเข้า Docker/Kubernetes
- ต้องกำหนดรูปแบบ error ของ API ให้เหมือนกันทั้งระบบ

## เมื่อไหร่ **ไม่** ใช้

- ออกแบบ endpoint ทางธุรกิจ ให้ใช้ command `/api-design`
- รูปแบบ URL · paging · วันที่ · id ของ API ให้ใช้ `api-conventions`
- รูปแบบ log ให้ใช้ `logging-standards`
- เลือกสถาปัตยกรรม ให้ใช้ `architecture-patterns`

---

## 1 · endpoint พื้นฐาน 4 ตัว

| Endpoint | ตอบอะไร | auth | เช็ค dependency | ใครเรียก |
|---|---|:---:|:---:|---|
| `GET /ping` | `pong` (text) | ไม่ | ไม่ | load balancer ทุกวินาที |
| `GET /health/live` | process ยังอยู่ | ไม่ | **ไม่** | orchestrator (restart ถ้าตาย) |
| `GET /health/ready` | พร้อมรับ traffic | ไม่ | ใช่ | orchestrator (ตัดออกจาก pool) |
| `GET /version` | รันอะไรอยู่ | ไม่* | ไม่ | คน ตอนไล่ปัญหา |

> 🚨 **live ห้ามเช็ค dependency** นี่คือความผิดพลาดที่เจอบ่อยที่สุด
> ถ้า `/health/live` เช็คฐานข้อมูล (database · DB) แล้ว DB ล่มชั่วคราว Kubernetes จะ**ฆ่า pod ทิ้งทั้งหมด**
> ทั้งที่แอปยังปกติดี พอ DB กลับมาก็ไม่มี pod เหลือรับ traffic แล้ว
> การเช็ค dependency ต้องอยู่ที่ `/health/ready` ซึ่งแค่ตัด pod ออกจาก pool ชั่วคราว

\* ถ้าไม่อยากให้คนทั่วไปเห็น commit hash ใน `/version` ให้จำกัดให้เรียกได้เฉพาะเครือข่ายภายใน

**ผูกกับ Kubernetes แบบนี้** (ปรับจาก secondsky `health-check-endpoints` · MIT) — live กับ ready ต้องชี้คนละ path ไม่งั้นข้อข้างบนไร้ความหมาย

```yaml
livenessProbe:            # ตาย → restart container
  httpGet: { path: /health/live, port: 3000 }
  initialDelaySeconds: 15 # ให้แอปขึ้นก่อน ไม่งั้นโดนฆ่าตั้งแต่ยังไม่ทัน listen
  periodSeconds: 10
  failureThreshold: 3     # พลาด 3 ครั้งติด (30 วินาที) ค่อย restart
readinessProbe:           # ไม่พร้อม → ตัดออกจาก Service ชั่วคราว ไม่ restart
  httpGet: { path: /health/ready, port: 3000 }
  initialDelaySeconds: 5
  periodSeconds: 10
```

แอปที่ warm-up นาน (โหลดโมเดล · cache ใหญ่) เพิ่ม `startupProbe` ชี้ `/health/live` พร้อม `failureThreshold` สูง แทนการยืด `initialDelaySeconds` ของ liveness

### รูปร่าง response (เหมือนกันทุกภาษา)

```jsonc
// GET /health/ready → 200 ปกติ · 503 เมื่อ dependency ที่ critical ล่ม
{
  "status": "up",                       // up | degraded | down
  "timestamp": "2026-08-31T09:42:13.482Z",
  "checks": {
    "db":    { "status": "up",   "durationMs": 12 },
    "redis": { "status": "up",   "durationMs": 3 },
    "mail":  { "status": "down", "durationMs": 3001, "error": "smtp timeout" }
  }
}
```

```jsonc
// GET /version → 200
{
  "name": "orders-api", "version": "1.4.0", "commit": "abc1234",
  "buildTime": "2026-08-31T09:00:00Z", "env": "production", "host": "pod-7f9c"
}
```

**3 สถานะ ไม่ใช่ 2:**
- `up` — ทุกอย่างปกติ → 200
- `degraded` — dependency ที่**ไม่ critical** ล่ม (เช่น อีเมล) แต่ยังรับ traffic ได้ → 200
- `down` — dependency ที่ critical ล่ม (เช่น DB) → **503**

**ทุก check ต้องมี timeout** (ค่าเริ่มต้น 3 วินาที) ไม่งั้น dependency ที่ค้าง
จะทำให้ health endpoint ค้างตาม แล้ว orchestrator ตัดสินใจผิดทั้งระบบ

**ห้ามส่ง stack trace หรือ connection string ออกทาง endpoint นี้** เพราะ endpoint นี้ใครก็เรียกได้

---

## 2 · รูปแบบ error ที่เหมือนกันทั้งระบบ

ยึด **RFC 9457 (`application/problem+json`)** ซึ่งเป็นมาตรฐานจริง ไม่ต้องคิดเอง

```jsonc
// 422 — รูปแบบถูก แต่ข้อมูลไม่ผ่านกฎ (ดูตารางล่าง)
{
  "type": "https://api.example.com/errors/validation",
  "title": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
  "status": 422,
  "detail": "จำนวนสินค้าต้องมากกว่า 0",
  "instance": "/api/v1/orders",
  "requestId": "a3f9c1b2",              // ตรงกับ cid ใน log — ตามเรื่องได้ทันที
  "errors": [                           // เฉพาะ validation · ครบทุกฟิลด์ในครั้งเดียว
    { "field": "items[0].qty", "code": "min_value", "message": "ต้องมากกว่า 0" }
  ]
}
```

- `field` เป็นเส้นทางเต็มรวมดัชนีอาเรย์ · `code` ให้โปรแกรมอ่าน · `message` ให้คนอ่าน

| สถานะ | ใช้เมื่อ |
|---|---|
| 400 | ข้อมูลผิดรูป |
| 401 | ยังไม่ได้ยืนยันตัวตน |
| 403 | ยืนยันแล้วแต่ไม่มีสิทธิ์ |
| 404 | ไม่มีสิ่งนี้ |
| 409 | ชนกับสถานะปัจจุบัน (ซ้ำ, แก้ทับ) |
| 422 | รูปแบบถูกแต่ผิดกฎธุรกิจ |
| 429 | เรียกถี่เกิน — ต้องมี `Retry-After` |
| 500 | ฝั่งเราพัง — **ห้ามส่งรายละเอียดภายในออกไป** ส่ง `requestId` แทน |

> **500 ต้องบอกแค่ "เกิดข้อผิดพลาด กรุณาแจ้ง requestId นี้"** รายละเอียดจริงอยู่ใน log
> การส่ง stack trace ออกไปก็เหมือนแจกแผนผังระบบให้คนที่กำลังหาช่องโจมตี

---

## 3 · Request id

- รับจาก header **`X-Request-Id`** เฉพาะเมื่อตรง `^[A-Za-z0-9-]{1,64}$` · ไม่มีหรือไม่ตรง → สร้างใหม่ (uuid ตัด 8 ตัว)
  ค่านี้ลงทุกบรรทัด log ถ้ารับมาตรง ๆ ผู้ส่งจะแทรกขึ้นบรรทัดใหม่หรือข้อความปลอมลง log ได้ (log injection)
- **ส่งกลับใน response header ทุกครั้ง** รวมทั้งตอน error
- ใส่ในทุกบรรทัด log (ดู `logging-standards`) และใน error body
- ส่งต่อไป service ปลายทางทุกครั้งที่เรียกข้ามระบบ

พอลูกค้าโทรมาบอกว่า "มันพัง" ก็ขอ requestId แล้ว `grep` ครั้งเดียวเจอทั้งเรื่อง

---

## 4 · Graceful shutdown

ตอน deploy ใหม่ orchestrator จะส่ง `SIGTERM` มา ถ้าแอปตายทันที request ที่ทำอยู่จะขาดกลางคัน

```
SIGTERM → 1. หยุดรับ request ใหม่ (ให้ /health/ready ตอบ down ทันที)
          2. รอ request ที่ค้างอยู่ทำงานจบ (timeout 15–30 วิ)
          3. ปิด DB pool / คิว / ไฟล์
          4. exit(0)
```

> ข้อ 1 สำคัญกว่าที่คิด ต้องให้ `/health/ready` ตอบ `down` **ก่อน** ปิดจริงสัก 5 วินาที
> เพื่อให้ load balancer ตัดเราออกจาก pool ทัน ไม่งั้นยังมี traffic วิ่งเข้ามาตอนกำลังปิด

---

## 5 · สิ่งที่ต้องมีก่อน deploy (ไม่ใช่ทางเลือก)

- **Timeout ทุกทาง** ทั้ง request เข้า การเรียกออก และ query DB ถ้าไม่มี timeout ปลายทางช้าเมื่อไร ทั้งระบบจะค้างตาม
- **จำกัดขนาด body** (เช่น 1MB) เพื่อกัน memory ระเบิดจาก payload ใหญ่
- **Cross-Origin Resource Sharing (CORS) ระบุ origin ชัดเจน** — `*` ใช้ได้เฉพาะ API สาธารณะที่ไม่มี cookie
- **Rate limit** อย่างน้อยที่ endpoint ล็อกอินและที่ที่ส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password · OTP)/อีเมล
- **Security headers**: `X-Content-Type-Options: nosniff` · `Content-Security-Policy: frame-ancestors 'none'` (ตัวแทนของ `X-Frame-Options` ที่เป็น header รุ่นเก่า · ใส่ `X-Frame-Options: DENY` คู่ไว้ให้เบราว์เซอร์เก่า) ·
  `Strict-Transport-Security` (HTTP Strict Transport Security · HSTS)
  Node: `helmet` ตั้งครบในบรรทัดเดียว · .NET: `UseHsts()` ตั้งแค่ HSTS ที่เหลือต้องเขียน middleware สั้น ๆ หรือใช้แพ็กเกจ `NetEscapades.AspNetCore.SecurityHeaders` (ตัวอย่างใน `references/per-stack.md`)
- **ปิดหน้าโชว์ error เต็ม ๆ ใน production** (`app.UseDeveloperExceptionPage()` เฉพาะ dev)
- **ตั้งเวอร์ชันไว้ใน path**: `/api/v1/...` ตั้งแต่วันแรก เพราะย้ายทีหลังแพงกว่ามาก
- **OpenAPI** ที่ generate จากโค้ดจริง ไม่ใช่เขียนมือแล้วลืมอัปเดต

---

## 6 · โค้ดที่พร้อมใช้

| ไฟล์ | สแต็ก | สถานะ |
|---|---|---|
| `assets/health.node.js` | Node / Express | ✓ รันทดสอบครบทั้ง 4 endpoint + เคส degraded/down/timeout |
| `assets/health_py.py` | Python / FastAPI | ✓ รันทดสอบครบเหมือนกัน ผลตรงกันทุก field |
| `references/per-stack.md` | .NET (ASP.NET Core health checks) + Angular | ระวัง ยังไม่ได้คอมไพล์ทดสอบ |

```js
// Node
app.use(createHealthRouter({
  version: { name: 'orders-api', version: '1.4.0', commit: process.env.GIT_SHA },
  checks: {
    db:   async () => { await pool.query('SELECT 1'); },          // critical
    mail: { critical: false, run: async () => { await smtp.verify(); } },
  },
}));
```

```python
# Python
app.include_router(make_health_router(
    version={"name": "orders-api", "version": "1.4.0", "commit": os.getenv("GIT_SHA")},
    checks={"db": lambda: db.execute("SELECT 1"),
            "mail": {"critical": False, "run": smtp.verify}},
))
```

---

## 7 · ตรวจงาน

```bash
curl -i localhost:8080/ping                    # 200 pong
curl -s localhost:8080/health/live  | jq
curl -s localhost:8080/health/ready | jq
curl -s localhost:8080/version      | jq

# ปิด DB แล้วยิงซ้ำ — ready ต้องเป็น 503 แต่ live ต้องยัง 200
docker stop mydb && curl -i localhost:8080/health/ready && curl -i localhost:8080/health/live
```

- [ ] `/health/live` **ไม่** แตะ DB — ปิด DB แล้วยังตอบ 200
- [ ] `/health/ready` ตอบ 503 เมื่อ dependency ที่ critical ล่ม
- [ ] dependency ที่ไม่ critical ล่มแล้วได้ `degraded` + 200 (ยังรับ traffic)
- [ ] ทุก check มี timeout — ลองทำให้ dependency ค้าง แล้ว endpoint ต้องตอบภายใน ~3 วิ
- [ ] `/version` ตรงกับ commit ที่ deploy จริง
- [ ] ทุก response มี `X-Request-Id` รวมทั้งตอน 500
- [ ] ยิง 500 แล้วไม่มี stack trace / connection string หลุดออกมา
- [ ] `SIGTERM` แล้ว request ที่ค้างอยู่ทำงานจบก่อนแอปปิด
- [ ] `/ping` ไม่ถูกเขียนลง log (ไม่งั้นไฟล์เต็มไปด้วย ping)

---

## 8 · Anti-patterns

- **`/health` ตัวเดียวเช็คทุกอย่าง** — orchestrator แยกไม่ออกว่าควร restart หรือแค่ตัด traffic
- **liveness เช็ค DB** — DB สะดุด 10 วินาที = pod ตายยกแถว
- **health check ไม่มี timeout** — dependency ค้าง แล้ว health ค้างตาม
- **ส่ง stack trace / connection string ใน health หรือ error 500**
- **health ต้อง login** — orchestrator ไม่มี token ให้
- **รูปแบบ error ต่างกันทุก endpoint** — client ต้องเขียนโค้ดแกะ 5 แบบ
- **`/ping` เขียนลง log** — ทุกวินาที × 86400 = ขยะเต็มไฟล์
- **ไม่มี graceful shutdown** — deploy ทีไรลูกค้าเจอ error ทุกที
- **`Access-Control-Allow-Origin: *` คู่กับ cookie** — เปิดช่องให้เว็บอื่นยิงแทนผู้ใช้

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปแบบ log และ correlation id | `logging-standards` |
| test ให้ endpoint พวกนี้ | `testing-standards` |
| ตรวจ response ตรงกับ OpenAPI ใน CI · contract กับทีม frontend · เช็ค breaking change | `api-conventions` [`references/contract-testing.md`](../api-conventions/references/contract-testing.md) |
| ออกแบบ endpoint ธุรกิจ | command `/api-design` |
| runbook ตอน service ล่ม | `incident-runbook-template` |
| ตรวจความปลอดภัย | `security-engineer` + command `/security-scan` |


## reference: per-stack.md

# .NET และ Angular

> ระวัง: โค้ดในไฟล์นี้ **ยังไม่ได้คอมไพล์ทดสอบ** (ต่างจาก `assets/health.node.js` และ
> `assets/health_py.py` ที่รันจริงครบทุก endpoint แล้ว) โค้ดนี้เป็นการตั้งค่ามาตรฐานของ
> ASP.NET Core ตอนรันครั้งแรกให้เทียบ response กับรูปร่างใน SKILL.md ข้อ 1

---

## สารบัญ

1. [ASP.NET Core — health checks](#aspnet-core--health-checks)
2. [Angular — ฝั่งที่เรียกใช้](#angular--ฝั่งที่เรียกใช้)
3. [ตารางเทียบ](#ตารางเทียบ)

---

## ASP.NET Core — health checks

```bash
dotnet add package AspNetCore.HealthChecks.NpgSql
dotnet add package AspNetCore.HealthChecks.Redis
dotnet add package AspNetCore.HealthChecks.Network   # AddSmtpHealthCheck อยู่ในแพ็กเกจนี้
```

```csharp
builder.Services.AddHealthChecks()
    // tag "ready" = ตัวที่ /health/ready จะเรียก · ไม่ติด tag = ไม่ถูกเรียกที่ไหนเลย
    .AddNpgSql(cs, name: "db", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddRedis(redisCs, name: "redis", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddSmtpHealthCheck(o => { }, name: "mail",
        failureStatus: HealthStatus.Degraded,          // ไม่ critical → degraded ไม่ใช่ down
        tags: ["ready"])
    // ตอนกำลังปิด → Unhealthy → /health/ready ตอบ 503 (ดู "Graceful shutdown" ข้างล่าง)
    .AddCheck<ShutdownHealthCheck>("shutdown", tags: ["ready", "critical"]);
```

```csharp
// ---- ping: เบาที่สุด ไม่ผ่าน middleware ที่ไม่จำเป็น ----
app.MapGet("/ping", () => Results.Text("pong")).ExcludeFromDescription();

// ---- liveness: ไม่เรียก check ตัวไหนเลย (predicate = _ => false) ----
// ถ้าเผลอให้เช็ค DB ตรงนี้ DB สะดุด = Kubernetes ฆ่า pod ยกแถว
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteLive,
});

// ---- readiness: เฉพาะ check ที่ติด tag "ready" ----
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = c => c.Tags.Contains("ready"),
    ResponseWriter = WriteReady,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy]   = StatusCodes.Status200OK,
        [HealthStatus.Degraded]  = StatusCodes.Status200OK,     // ยังรับ traffic ได้
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
    },
});

app.MapGet("/version", () => Results.Ok(new
{
    name = "orders-api",
    version = typeof(Program).Assembly.GetName().Version?.ToString() ?? "0.0.0",
    commit = Environment.GetEnvironmentVariable("GIT_SHA") ?? "unknown",
    buildTime = Environment.GetEnvironmentVariable("BUILD_TIME") ?? "unknown",
    env = app.Environment.EnvironmentName,
    host = Environment.MachineName,
}));
```

ให้ response ตรงรูปแบบเดียวกับสแต็กอื่น:

```csharp
static Task WriteReady(HttpContext ctx, HealthReport report)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new
    {
        status = report.Status switch
        {
            HealthStatus.Healthy  => "up",
            HealthStatus.Degraded => "degraded",
            _                     => "down",
        },
        timestamp = DateTimeOffset.UtcNow,
        checks = report.Entries.ToDictionary(
            e => e.Key,
            e => new
            {
                status = e.Value.Status == HealthStatus.Healthy ? "up" : "down",
                durationMs = (int)e.Value.Duration.TotalMilliseconds,
                // ข้อความเท่านั้น ห้ามส่ง exception เต็ม ๆ — endpoint นี้เปิดสาธารณะ
                error = e.Value.Exception?.Message,
            }),
    });
}

static Task WriteLive(HttpContext ctx, HealthReport _)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new { status = "up", timestamp = DateTimeOffset.UtcNow });
}
```

### Error envelope (RFC 9457)

ASP.NET Core มี `ProblemDetails` มาให้อยู่แล้ว ให้ใช้ของที่มี อย่าประดิษฐ์รูปแบบเอง

```csharp
builder.Services.AddProblemDetails(o => o.CustomizeProblemDetails = ctx =>
{
    ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
    ctx.ProblemDetails.Extensions["requestId"] =
        ctx.HttpContext.Response.Headers["X-Request-Id"].ToString();
});

app.UseExceptionHandler();      // แปลง exception ที่หลุดเป็น problem+json ให้อัตโนมัติ
app.UseStatusCodePages();
```

### Graceful shutdown

ให้ `/health/ready` ตอบ down ก่อนปิดจริงสักพัก เพื่อให้ load balancer ตัดเราออกจาก pool ทัน
ใช้ `IHostedLifecycleService.StoppingAsync` (.NET 8 ขึ้นไป) เพราะ host เรียกมัน**ก่อน**หยุด Kestrel (หลัง `ApplicationStopping`)
จึงรอแบบ `await Task.Delay` ได้โดยไม่บล็อกเธรด และ server ยังตอบ 503 ให้ load balancer เห็น

```csharp
// สถานะร่วม: ตัวรอปิดเขียน · health check อ่าน
public sealed class ReadinessState { public volatile bool IsShuttingDown; }

public sealed class ShutdownHealthCheck(ReadinessState state) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default) =>
        Task.FromResult(state.IsShuttingDown
            ? HealthCheckResult.Unhealthy("shutting down")
            : HealthCheckResult.Healthy());
}

public sealed class DrainOnShutdown(ReadinessState state) : IHostedLifecycleService
{
    public async Task StoppingAsync(CancellationToken ct)
    {
        state.IsShuttingDown = true;                       // /health/ready → 503 ทันที
        await Task.Delay(TimeSpan.FromSeconds(5), ct);     // รอ load balancer ตัดออก
    }
    public Task StartingAsync(CancellationToken ct) => Task.CompletedTask;
    public Task StartAsync(CancellationToken ct)    => Task.CompletedTask;
    public Task StartedAsync(CancellationToken ct)  => Task.CompletedTask;
    public Task StopAsync(CancellationToken ct)     => Task.CompletedTask;
    public Task StoppedAsync(CancellationToken ct)  => Task.CompletedTask;
}

// ก่อน builder.Build()
builder.Services.AddSingleton<ReadinessState>();
builder.Services.AddHostedService<DrainOnShutdown>();
builder.Services.Configure<HostOptions>(o =>
    o.ShutdownTimeout = TimeSpan.FromSeconds(30));   // รวมเวลารอ 5 วินาทีข้างบน + request ที่ค้าง
```

ลำดับตอนปิดของ host (.NET 8+): `ApplicationStopping` → `StoppingAsync` → `StopAsync` ของ hosted service (รวม Kestrel) → `StoppedAsync` → `ApplicationStopped` — ตามหน้า .NET Generic Host ที่ learn.microsoft.com (ตรวจ 22 ต.ค. 2569)

### สิ่งที่ต้องเปิดก่อน deploy

ลงทะเบียน service ได้**ก่อน** `builder.Build()` เท่านั้น — หลัง Build รายการ service เป็นแบบอ่านอย่างเดียว เรียก `builder.Services.Add…` ตอนนั้นจะได้ `InvalidOperationException` ตอนเริ่มแอป

```csharp
// ---- ก่อน Build: ลงทะเบียน service ----
builder.Services.Configure<KestrelServerOptions>(o => o.Limits.MaxRequestBodySize = 1_048_576);
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // อย่างน้อยที่ /login และที่ส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password · OTP)
    o.AddFixedWindowLimiter("login", w => { w.PermitLimit = 5; w.Window = TimeSpan.FromMinutes(1); });
});
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("https://app.example.com")   // ระบุ origin ห้าม AllowAnyOrigin คู่กับ cookie
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

var app = builder.Build();

// ---- หลัง Build: ลำดับ middleware ----
if (!app.Environment.IsDevelopment())
    app.UseHsts();                             // ตั้งแค่ Strict-Transport-Security · ไม่ใช้ตอน dev เพราะเบราว์เซอร์จำค่าไว้
app.UseHttpsRedirection();
app.Use(async (ctx, next) =>                   // header ที่ UseHsts ไม่ได้ตั้งให้
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["Content-Security-Policy"] = "frame-ancestors 'none'";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";   // สำหรับเบราว์เซอร์เก่า
    await next();
});
app.UseCors();
app.UseRateLimiter();

app.MapPost("/api/v1/login", Login).RequireRateLimiting("login");
```

ไม่อยากเขียน middleware เอง → แพ็กเกจ `NetEscapades.AspNetCore.SecurityHeaders` (`app.UseSecurityHeaders()`) ตั้งชุด header พื้นฐานให้ครบ

---

## Angular — ฝั่งที่เรียกใช้

**Interceptor ใส่ request id ทุก request** (คู่กับ `logging-standards`):

```ts
export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const id = crypto.randomUUID().slice(0, 8);
  return next(req.clone({ setHeaders: { 'X-Request-Id': id } }));
};
```

**แกะ problem+json ให้เป็นข้อความที่ผู้ใช้อ่านรู้เรื่อง**:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      const p = e.error;                       // ProblemDetails
      // 500 ไม่มีรายละเอียดให้แสดง — โชว์ requestId เพื่อให้ผู้ใช้แจ้งทีมได้
      const msg = p?.detail || p?.title || 'เกิดข้อผิดพลาด';
      toast.error(p?.requestId ? `${msg} (รหัสอ้างอิง ${p.requestId})` : msg);
      return throwError(() => e);
    }),
  );
};
```

**หน้าสถานะระบบ** ให้ทีมซัพพอร์ตเปิดดูเองได้โดยไม่ต้องเรียกนักพัฒนา:

```ts
this.http.get<ReadyResponse>('/health/ready').subscribe(r => this.status.set(r));
// r.status = 'up' | 'degraded' | 'down' → แสดงเป็น pill สีเขียว/เหลือง/แดง
// (ใช้คลาส .pill-green / .pill-amber / .pill-red จาก web-app-design)
```

---

## ตารางเทียบ

| เรื่อง | .NET | Node/Express | Python/FastAPI |
|---|---|---|---|
| health | `AddHealthChecks()` + tag | `createHealthRouter()` | `make_health_router()` |
| error envelope | `ProblemDetails` (มีในตัว) | `express-problem-json` หรือเขียน middleware | `HTTPException` + custom handler |
| request id | middleware + `LogContext` | `AsyncLocalStorage` | `ContextVar` + middleware |
| graceful shutdown | `IHostedLifecycleService.StoppingAsync` | `server.close()` ใน `SIGTERM` | `lifespan` context ของ FastAPI |
| security headers | `UseHsts()` (HTTP Strict Transport Security (HSTS) เท่านั้น) + middleware สั้น ๆ หรือ `NetEscapades.AspNetCore.SecurityHeaders` | `helmet` | `secure` middleware |
| OpenAPI | `Microsoft.AspNetCore.OpenApi` (`AddOpenApi()` + `MapOpenApi()` · มากับ template ตั้งแต่ .NET 9) · ทางเลือก: Swashbuckle / NSwag | `swagger-jsdoc` | มีในตัว `/docs` |
| rate limit | `AddRateLimiter` | `express-rate-limit` | `slowapi` |


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
try { ... } catch { }                      // ผิด: กลืนเงียบ
try { ... } catch (Exception) { return null; }   // ผิด: ผู้เรียกเจอ null โดยไม่รู้ว่าเกิดอะไร
catch (Exception ex) { log.Error(ex); throw; }   // ผิด: log ซ้ำทุกชั้น
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
ผิด: "เกิดข้อผิดพลาด"                    ผู้ใช้ทำอะไรต่อไม่ได้
ผิด: "SqlException: timeout expired"      หลุดรายละเอียดภายใน และเขาก็อ่านไม่ออก
ถูก: "บันทึกไม่สำเร็จเพราะระบบตอบช้า ลองอีกครั้งใน 1 นาที (อ้างอิง: 01J9Z8K)"
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

- **`catch` ว่างเปล่า** — ปัญหาที่หายากที่สุดคือปัญหาที่ไม่มีร่องรอย
- **คืน `null` แทนการโยน error** — ผู้เรียกไม่รู้ว่าไม่มีข้อมูล หรือระบบพัง
- **`catch (Exception)` ที่ชั้นในสุด** — กลืนบั๊กของตัวเองไปด้วย
- **log แล้ว throw ต่อทุกชั้น** — error 1 ตัวได้ 10 บรรทัด
- **"เกิดข้อผิดพลาด"** — ไม่บอกว่าต้องทำอะไรต่อ
- **ส่ง stack trace ให้ผู้ใช้** — เปิดโครงสร้างภายในให้คนที่กำลังหาช่องโหว่เห็น
- **retry แบบไม่หน่วง** — ยิงรัวใส่ระบบที่ล้มอยู่
- **retry การเขียนโดยไม่มี idempotency key** — ได้รายการซ้ำ
- **ไม่มี timeout** — thread ค้างสะสมจนระบบตาย
- **ใช้ error เป็นตัวควบคุมการทำงานปกติ** — เช่นโยน exception เมื่อ "ไม่พบข้อมูล" ซึ่งเป็นเรื่องปกติ


---

# skill: observability-basics

Use when a live system must be known healthy before users complain (metrics, logs, traces, alerts).

# วัดผลและเฝ้าระบบ

> **กฎข้อเดียว:** ถ้าลูกค้าเป็นคนบอกเราว่าระบบล่ม แปลว่าการเฝ้าระวังล้มเหลว
> ไม่ใช่ว่าลูกค้าใจดี

## เมื่อไหร่ใช้ skill นี้

- ระบบมีผู้ใช้จริงแล้ว
- มีคนถามว่า "ตอนนี้ระบบปกติดีไหม" แล้วต้องไปเปิด log ดูถึงจะตอบได้
- ถูกปลุกกลางดึกด้วยการแจ้งเตือนที่ไม่ต้องทำอะไร
- ระบบช้าแล้วไม่รู้ว่าช้าตรงไหน

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| รูปแบบบรรทัด log และการปิดบัง | `logging-standards` |
| ร่องรอยว่าใครทำอะไร | `audit-trail` |
| endpoint health check | `web-service-essentials` |
| ขั้นตอนตอนเกิดเหตุ | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |

---

## 1 · สามอย่างนี้ตอบคนละคำถาม

| | ตอบคำถาม | ตัวอย่าง | ต้นทุน |
|---|---|---|---|
| **metric** (ตัวชี้วัด) | "ตอนนี้แย่ไหม แย่ขึ้นหรือลง" | error 2.3% · p95 = 840 ms | ถูกสุด เก็บได้นาน |
| **log** (บันทึก) | "คำขอนั้นเกิดอะไรขึ้น" | ข้อความ + stack trace + id | แพงปานกลาง |
| **trace** (การไล่รอย) | "ช้าที่ขั้นตอนไหน" | คำขอเดียว ผ่าน 5 service | แพงสุด สุ่มเก็บ |

**ลำดับการใช้เวลาเกิดเหตุ:** metric บอกว่า**มีปัญหา** → trace บอกว่า**ตรงไหน** → log บอกว่า**ทำไม**
ทั้ง 3 อย่างต้องเชื่อมกันด้วย correlation id ตัวเดียวกัน (ดู `logging-standards`)

---

## 2 · สี่สัญญาณที่ต้องวัด

| สัญญาณ | วัดอะไร | ตัวเลขที่ดู |
|---|---|---|
| **อัตราคำขอ** | มีงานเข้ามาเท่าไหร่ | ต่อวินาที แยกตาม endpoint |
| **อัตราความผิดพลาด** | ล้มกี่เปอร์เซ็นต์ | แยก 4xx (ผู้ใช้ผิด) กับ 5xx (เราผิด) |
| **เวลาตอบสนอง** | ช้าแค่ไหน | **p50 · p95 · p99** |
| **ทรัพยากร** | ใกล้เต็มไหม | CPU · หน่วยความจำ · พื้นที่ · connection pool |

> 🚨 **ห้ามดูค่าเฉลี่ยของเวลาตอบสนอง** — เฉลี่ย 200 ms ฟังดูดี
> ทั้งที่ผู้ใช้ 5% รอ 9 วินาที ค่าเฉลี่ยกลบคนที่เจอปัญหาเสมอ **ดู p95 และ p99**

**สำหรับคิวและงานเบื้องหลัง** เพิ่มอีก 3 ตัว — งานค้างในคิว · เวลารอในคิว · งานที่ล้มถาวร
(ดู `background-jobs`)

---

## 3 · ตั้งชื่อตัวชี้วัด

```
<โดเมน>_<สิ่งที่วัด>_<หน่วย>

http_requests_total              จำนวนสะสม
http_request_duration_seconds    ระยะเวลา
orders_created_total             เหตุการณ์ทางธุรกิจ
queue_depth_jobs                 ค่า ณ ขณะนั้น
```

| กฎ | เหตุผล |
|---|---|
| ลงท้ายด้วยหน่วยเสมอ | `_seconds` ไม่ใช่ `_time` ที่ไม่มีใครรู้ว่าวินาทีหรือมิลลิวินาที |
| ค่าสะสมลงท้าย `_total` | บอกว่าเป็นค่าที่เพิ่มขึ้นเรื่อย ๆ ไม่ใช่ค่าปัจจุบัน |
| ใช้ label แทนการสร้างชื่อใหม่ | `http_requests_total{route,status}` ไม่ใช่ชื่อแยกต่อ endpoint |
| **label ห้ามมีค่าที่ไม่จำกัด** | ถ้าใส่ user id หรือ order id เป็น label ระบบเก็บ metric จะรับไม่ไหว |

### 3.1 · ถ้าใช้ Prometheus และ Grafana

- **ชนิด metric:** counter ใช้นับเหตุการณ์ (อ่านด้วย `rate()`) · gauge ใช้ค่า ณ ตอนนี้ · histogram ใช้ระยะเวลาที่ต้องหา p95 · summary ใช้เมื่อไม่ต้องรวมข้าม instance
- **หน่วย:** วินาที · byte · ratio 0 ถึง 1 (`_seconds` ไม่ใช่ `_milliseconds`)
- **ห้ามใส่ `user_id` · เบอร์โทร · `call_id` เป็น label** เพราะทุกค่าใหม่คือ series ใหม่ 1 เส้น จนระบบเก็บ metric รับไม่ไหว · id เหล่านี้ลง log และ trace
- p95: `histogram_quantile(0.95, sum by (le) (rate(<ชื่อ>_bucket[5m])))`
- alert ทุกกฎมี `for:` · `severity` · ลิงก์ runbook · เตือนจากอาการ (latency · error) ไม่เตือนจาก CPU หรือ GPU
- dashboard เก็บเป็น JSON ใน git แล้ว provision ด้วยไฟล์ · RED ต่อ service · USE ต่อทรัพยากร
- รายละเอียด PromQL · ตัวอย่างกฎ alert · provisioning · ตัวอย่างระบบ voice agent (latency STT · LLM · TTS · lag ของ Kafka · GPU): `references/prometheus-grafana.md`

---

## 4 · การแจ้งเตือน

> **แจ้งเตือนทุกครั้งต้องมีอะไรให้ทำ** — ถ้าคนรับอ่านแล้วไม่ต้องทำอะไร
> อีก 3 สัปดาห์เขาจะปิดเสียงแจ้งเตือน แล้ววันที่ของจริงเกิดก็จะไม่มีใครเห็น

**แจ้งเตือนจากสิ่งที่ผู้ใช้รู้สึก ไม่ใช่จากตัวเลขของเครื่อง**

| ✗ เตือนแบบนี้ | ✓ เตือนแบบนี้ |
|---|---|
| CPU เกิน 80% | อัตรา error เกิน 2% นาน 5 นาที |
| หน่วยความจำเกิน 70% | p95 ของหน้าชำระเงินเกิน 3 วินาที นาน 10 นาที |
| pod restart | คำสั่งซื้อสำเร็จลดลงเกิน 50% เทียบกับสัปดาห์ก่อน |
| disk 60% | **disk จะเต็มใน 4 ชั่วโมงตามอัตราปัจจุบัน** |

| ระดับ | ตัวอย่าง | ส่งไปไหน |
|---|---|---|
| **ปลุกคน** | ผู้ใช้ใช้งานไม่ได้ · ข้อมูลกำลังเสียหาย | โทร · push |
| **ดูในเวลางาน** | disk จะเต็มใน 3 วัน · error เพิ่มแต่ยังไม่มาก | แชตของทีม |
| **แค่บันทึกไว้** | ทุกอย่างที่เหลือ | แดชบอร์ด |

**ทุกการแจ้งเตือนต้องมี:** อะไรพัง · กระทบใคร · **ลิงก์ไป runbook** · ลิงก์ไปแดชบอร์ด
**ตั้งช่วงเวลา (นาน N นาที) เสมอ** ไม่ใช่เตือนทันทีที่ค่าพุ่งครั้งเดียว

### 4.1 · งบความผิดพลาด (error budget) และอัตราเผางบ (burn rate)

ระบบที่มี SLO ใช้วิธีนี้แทนการตั้งเกณฑ์ error % ตายตัว เพราะมันบอกว่า "ถ้าปล่อยไว้แบบนี้ งบทั้งเดือนจะหมดเมื่อไหร่" (แนวคิดจาก Google SRE Workbook)

- **งบ** = เวลาที่ยอมให้ล้มได้ใน 30 วัน → SLO 99.9% = 43 นาที · 99.5% = 3.6 ชั่วโมง · 99% = 7.2 ชั่วโมง
- **burn rate** = อัตรา error ตอนนี้ ÷ (1 − SLO) → burn 1 = งบหมดพอดีวันที่ 30 · burn 10 = หมดใน 3 วัน
- ตั้งแจ้งเตือน 3 ระดับตามตาราง และทุกระดับต้องเป็นจริงทั้งช่วงยาวและช่วงสั้น (ช่วงสั้น = 1/12 ของช่วงยาว) จะได้หยุดเตือนทันทีที่ระบบหาย

| ระดับ | burn rate | ช่วงยาว · ช่วงสั้น | กินงบไปแล้ว | SLO 99.9% แปลว่า error เกิน | ส่งไปไหน |
|---|---|---|---|---|---|
| ไหม้เร็ว | 14.4 | 1 ชั่วโมง · 5 นาที | 2% ของเดือน ใน 1 ชั่วโมง | 1.44% | ปลุกคน |
| ไหม้ช้า | 6 | 6 ชั่วโมง · 30 นาที | 5% ของเดือน ใน 6 ชั่วโมง | 0.6% | ปลุกคน |
| รั่วซึม | 1 | 3 วัน · 6 ชั่วโมง | 10% ของเดือน ใน 3 วัน | 0.1% | แชตของทีม |

งบเหลือเท่าไหร่ให้ขึ้นบนแดชบอร์ดภาพรวม — งบใกล้หมด = หยุดปล่อยฟีเจอร์ ไปแก้ความเสถียรก่อน เป็นกติกาที่ตกลงกับเจ้าของผลิตภัณฑ์ล่วงหน้า ไม่ใช่ตอนทะเลาะกัน

---

## 5 · แดชบอร์ด

ทำ 2 หน้าพอ

| หน้า | ตอบคำถาม | มีอะไร |
|---|---|---|
| **ภาพรวม** | "ตอนนี้ปกติไหม" | 4 สัญญาณของทั้งระบบ · สถานะ dependency · การปล่อยของล่าสุด |
| **เจาะลึกต่อ service** | "พังตรงไหน" | 4 สัญญาณแยกตาม endpoint · คิว · ฐานข้อมูล |

- **เส้นแนวตั้งบอกเวลาที่ deploy** — ปัญหาส่วนใหญ่เริ่มหลังเส้นนี้ และเห็นได้ในวินาทีเดียว
- หน้าภาพรวมต้องอ่านจบใน 10 วินาที จึงควรมีไม่เกิน 6 กราฟ
- ใส่เส้นเกณฑ์ที่ตั้งแจ้งเตือนไว้ในกราฟ จะได้รู้ว่าห่างจากเส้นแค่ไหน

---

## 6 · ตัวชี้วัดทางธุรกิจ

ตัวชี้วัดทางเทคนิคเขียวหมดแต่ธุรกิจหยุดเดิน เป็นเรื่องที่เกิดขึ้นจริงและตรวจไม่เจอถ้าไม่วัด

| ตัวอย่าง | จับอะไรได้ |
|---|---|
| คำสั่งซื้อสำเร็จต่อชั่วโมง | ปุ่มชำระเงินพังแม้ทุก endpoint คืน 200 |
| อัตราเข้าสู่ระบบสำเร็จ | ผู้ให้บริการยืนยันตัวตนภายนอกมีปัญหา |
| งานเบื้องหลังที่รอเกิน N นาที | คิวตัน แต่ API ยังตอบปกติ |
| อีเมลส่งไม่สำเร็จ | ลูกค้าไม่ได้รับใบเสร็จ โดยไม่มี error ที่ไหนเลย |

**เลือก 3–5 ตัวที่เป็นหัวใจของธุรกิจ** แล้วเตือนเมื่อมันตกผิดปกติเทียบกับช่วงเดียวกันของสัปดาห์ก่อน

---

## 7 · Anti-patterns

- **ดูค่าเฉลี่ยของเวลาตอบสนอง** — กลบคนที่เจอปัญหาทุกครั้ง
- **แจ้งเตือนที่ไม่ต้องทำอะไร** — สอนให้ทุกคนเลิกสนใจการแจ้งเตือน
- **เตือนจาก CPU และหน่วยความจำ** — ระบบที่ CPU 90% แต่ผู้ใช้ปกติ ไม่ใช่เหตุ
- **ใส่ id ที่ไม่จำกัดค่าเป็น label** — ระบบเก็บ metric ล่มเสียเอง
- **แดชบอร์ด 40 กราฟ** — ไม่มีใครรู้ว่าต้องดูอันไหน
- **วัดแต่เทคนิค ไม่วัดธุรกิจ** — ทุกอย่างเขียวแต่ไม่มีใครสั่งซื้อได้
- **เก็บ trace ทุกคำขอ** — แพงโดยไม่ได้อะไรเพิ่ม สุ่มเก็บก็พอ
- **ไม่มีเส้นบอกเวลา deploy** — เสียเวลาครึ่งชั่วโมงกว่าจะนึกได้ว่าเพิ่ง deploy ไป
- **แจ้งเตือนที่ไม่มีลิงก์ไป runbook** — คนรับต้องเริ่มค้นจากศูนย์ตอนตี 3

---

## 8 · ตัวย่อ

- **metric** — ตัวชี้วัด ตัวเลขที่เก็บตามเวลา
- **trace** — การไล่รอยคำขอหนึ่งตลอดเส้นทางที่มันวิ่งผ่าน
- **p95 / p99** — เปอร์เซ็นไทล์ที่ 95 และ 99 (ช้ากว่านี้มีแค่ 5% หรือ 1% ของคำขอ)
- **label / tag** — ป้ายกำกับที่แนบกับตัวชี้วัด ใช้แยกดูเป็นกลุ่ม
- **on-call** — เวรรับแจ้งเหตุนอกเวลาทำการ
- **SLO** — Service Level Objective (เป้าหมายระดับบริการที่ตั้งไว้เอง เช่น สำเร็จ 99.5%)
- **error budget / burn rate** — เวลาที่ยอมให้ล้มได้ต่อเดือนตาม SLO และความเร็วที่กำลังใช้มันหมด (ข้อ 4.1)

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปแบบ log และ correlation id | `logging-standards` |
| health check ที่ระบบเฝ้าใช้ | `web-service-essentials` |
| ตัวชี้วัดของคิวและงานเบื้องหลัง | `background-jobs` |
| อัตรา error และการตัดวงจร | `error-handling-patterns` |
| ขั้นตอนเมื่อการแจ้งเตือนดัง | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |
| ตัวเลขเป้าหมายที่ตกลงกับลูกค้า | `srs-writing` |
| PromQL · กฎ alert · Grafana provisioning · ตัวอย่าง voice agent | `references/prometheus-grafana.md` |
| ให้ agent อ่าน Prometheus หรือ Grafana ผ่าน MCP | `mcp-server` ข้อ 1.1 |

ที่มาของข้อ 3.1: prometheus.io (metric types · naming · histograms · alerting) และ grafana.com (dashboard best practices · provisioning) ตรวจ 2026-10-27 · ลิงก์เต็มอยู่ท้าย `references/prometheus-grafana.md`


## reference: prometheus-grafana.md

# Prometheus และ Grafana — ใช้ให้ถูก

อยู่ใน `observability-basics` · หลักคิดเรื่องอะไรควรวัดและควรเตือนอยู่ใน `SKILL.md` ข้อ 2 · 4 · 5 ไฟล์นี้บอกวิธีทำใน Prometheus และ Grafana · ชื่อ metric และตัวเลขที่ติดป้าย `ตัวอย่าง` เป็นข้อมูลสมมุติ ต้องปรับให้ตรงกับระบบจริง

## สารบัญ

- [1 · metric 4 ชนิด](#1--metric-4-ชนิด)
- [2 · ชื่อและหน่วย](#2--ชื่อและหน่วย)
- [3 · label และ cardinality](#3--label-และ-cardinality)
- [4 · PromQL ที่ใช้บ่อย](#4--promql-ที่ใช้บ่อย)
- [5 · กฎ alert](#5--กฎ-alert)
- [6 · Grafana](#6--grafana)
- [7 · ตัวอย่างระบบ voice agent](#7--ตัวอย่างระบบ-voice-agent)
- [8 · ตรวจก่อนส่ง](#8--ตรวจก่อนส่ง)
- [9 · ที่มา](#9--ที่มา)

## 1 · metric 4 ชนิด

| ชนิด | คืออะไร | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|---|
| counter | ค่าสะสม เพิ่มอย่างเดียว กลับเป็น 0 เมื่อ process เริ่มใหม่ | นับเหตุการณ์ที่เกิดแล้ว (คำขอ · error · งานที่เสร็จ) · อ่านด้วย `rate()` ไม่อ่านค่าดิบ | `http_requests_total` |
| gauge | ค่า ณ ขณะนั้น ขึ้นลงได้ | ของที่นับค้างอยู่หรือวัดได้ตอนนี้ (สายที่กำลังคุย · ความยาวคิว · หน่วยความจำ) | `voice_calls_active` |
| histogram | นับค่าที่วัดได้ลงช่วง (bucket) พร้อมผลรวมและจำนวน | ระยะเวลาหรือขนาดที่ต้องหา p95 · p99 และรวมข้ามหลาย instance ได้ | `http_request_duration_seconds` |
| summary | คำนวณ quantile ที่ฝั่งแอป ในช่วงเวลาเลื่อน | ใช้เมื่อไม่ต้องรวมข้าม instance เท่านั้น · quantile และช่วงเวลาเลือกตอนเขียนโค้ด เปลี่ยนทีหลังไม่ได้ | หายาก ปกติเลือก histogram |

- ห้ามเอา quantile จาก summary หลาย instance มาเฉลี่ยกัน ผลที่ได้ไม่มีความหมายทางสถิติ (เอกสาร Prometheus ใช้คำนี้)
- **เลือกอย่างไร** (prometheus.io/docs/practices/histograms/ ตรวจ 2026-10-27): ถ้า library และ Prometheus ที่ใช้รองรับ ให้ใช้ native histogram ก่อน เพราะเปลี่ยน percentile และช่วงเวลาทีหลังใน PromQL ได้ · ไม่รองรับแต่ต้องรวมข้าม instance ให้ใช้ classic histogram · summary เฉพาะเมื่อไม่ต้องรวมข้าม instance
- เอกสาร Prometheus แนะนำ native histogram ก่อน แต่ library ที่รองรับยังจำกัด ถ้า library ไม่รองรับให้ใช้ classic histogram แล้ววาง bucket ให้มีขอบอยู่ตรงค่า SLO ไม่งั้น p95 ที่ประมาณได้จะคลาด (ตัวอย่างในเอกสาร: p95 จริงราว 320 ms ประมาณได้ 443 ms เพราะ bucket กว้างตั้งแต่ 300 ถึง 450 ms)

## 2 · ชื่อและหน่วย

| กฎ | ถูก | ผิด |
|---|---|---|
| ขึ้นต้นด้วยคำเดียวบอกระบบ | `voice_stage_duration_seconds` | `stage_duration` |
| ใช้หน่วยพื้นฐาน: วินาที · byte · ratio 0 ถึง 1 | `_seconds` · `_bytes` · `_ratio` | `_milliseconds` · `_megabytes` · `_percent` |
| หน่วยเป็นรูปพหูพจน์ต่อท้าย | `node_memory_usage_bytes` | `node_memory_usage_byte` |
| counter ลงท้าย `_total` (ถ้ามีหน่วย หน่วยมาก่อน) | `process_cpu_seconds_total` · `http_requests_total` | `http_requests_count` |
| 1 ชื่อ 1 หน่วย 1 ความหมาย | วินาทีทั้งชื่อ | ครึ่งหนึ่งวินาทีครึ่งหนึ่งมิลลิวินาที |
| ไม่ใส่ชื่อ label ซ้ำในชื่อ metric | `http_requests_total{route=…}` | `http_requests_by_route_total` |

## 3 · label และ cardinality

ทุกชุดค่า label ที่ไม่ซ้ำกันคือ time series ใหม่ 1 เส้น เอกสาร Prometheus เตือนให้เลี่ยง label ที่ค่าไม่จำกัด เช่น user id หรืออีเมล

| ห้ามเป็น label | ให้ใช้แทน |
|---|---|
| `user_id` · `customer_id` · เบอร์โทร · อีเมล | ไม่ใส่เลย · เก็บใน log หรือ trace · ถ้าต้องนับรายคน ใช้ฐานข้อมูล ไม่ใช่ metric |
| `call_id` · `session_id` · `request_id` · `trace_id` | log และ trace ที่ผูกกับ id เดียวกัน (`logging-standards`) |
| URL เต็มที่มี id หรือ query string | แม่แบบเส้นทาง เช่น `/orders/{id}` |
| ข้อความ error ที่มีค่าแปรผัน | รหัส error ที่มีจำนวนจำกัด เช่น `reason="timeout"` |

- label ที่ใช้ได้ต้องนับค่าที่เป็นไปได้ทั้งหมดได้ล่วงหน้า (stage = 3 ค่า · status = 5 กลุ่ม) · จำนวน series ของ metric หนึ่งใกล้เคียงผลคูณของจำนวนค่าในแต่ละ label · histogram คูณจำนวน bucket เข้าไปอีก
- ตรวจว่า metric ไหนทำ series ระเบิด: เปิดหน้า TSDB status ใน Prometheus UI · เครื่องมือ `tsdb_stats` ของ `prometheus-mcp` ให้ข้อมูลทำนองเดียวกัน (ดู `mcp-server` ข้อ 1.1)

## 4 · PromQL ที่ใช้บ่อย

| ต้องการ | คำสั่ง | หมายเหตุ |
|---|---|---|
| คำขอต่อวินาที | `sum by (route) (rate(http_requests_total[5m]))` | ช่วง `[5m]` ควรยาวหลายเท่าของระยะ scrape (ยังไม่ได้ตรวจตัวเลขกับเอกสาร) |
| อัตรา error | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | นับ 5xx (เราผิด) แยกจาก 4xx · ตอนไม่มีทราฟฟิกผลหารเป็น NaN กฎ alert จะไม่ fire ซึ่งอาจซ่อนระบบที่ไม่มีคำขอเข้าเลย ให้เตือนเรื่องไม่มีคำขอแยกอีกกฎ |
| p95 ของ latency (classic histogram) | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` | ต้องคง `le` ไว้ใน `sum by` · แยกตาม route ให้เติม `route` ใน `by` |
| p95 (native histogram) | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds[5m])))` | ใช้เมื่อ library และ Prometheus รองรับ |
| ค่าเฉลี่ย latency (ประกอบเท่านั้น ห้ามใช้ตัดสิน) | `rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])` | ดู `SKILL.md` ข้อ 2 |
| disk จะเต็มใน 4 ชั่วโมง | `predict_linear(node_filesystem_avail_bytes[1h], 4*3600) < 0` | ตัวอย่างของ saturation ที่เตือนล่วงหน้า (ยังไม่ได้ตรวจกับเอกสาร PromQL) |

## 5 · กฎ alert

หลักจากเอกสาร Prometheus: เตือนจากอาการที่ผู้ใช้รู้สึก (latency · error) ที่จุดสูงในสแตกเท่าที่ทำได้ · ปลุกคนเรื่อง latency ที่จุดเดียวของสแตก · สาเหตุ (CPU · GPU · lag ของ consumer) ใส่ในแดชบอร์ดไว้ไล่หา ไม่ปลุกคน · ยกเว้นเรื่องที่ต้องมีคนลงมือก่อนระบบล่ม เช่นความจุ

ข้อยกเว้น: ตัวเลขที่ผู้ใช้รู้สึกโดยตรงนับเป็นอาการ แม้มาจากระบบข้างใต้ เช่น consumer lag ของ Kafka ที่ทำให้ผู้โทรต้องรอคำตอบ (ข้อ 7) ปลุกคนได้ · lag ที่ไม่กระทบใครทันที เช่นงานรายงานหลังจบสาย เป็นสาเหตุ ใส่แดชบอร์ดหรือแชตทีม

ทุกกฎต้องมี 4 อย่าง

| อย่าง | ใส่ที่ไหน | เหตุผล |
|---|---|---|
| `for:` | ในกฎ | ไม่เตือนทันทีที่ค่าพุ่งครั้งเดียว · ถ้าไม่ใส่ กฎจะ fire ตั้งแต่รอบประเมินแรก |
| ระดับความรุนแรง | label `severity` (ชื่อและค่าเป็นธรรมเนียมที่ทีมตั้ง ไม่ใช่ข้อบังคับของ Prometheus) | ให้ Alertmanager ส่งต่อถูกที่ · ใช้ 3 ระดับตาม `SKILL.md` ข้อ 4: ปลุกคน · ดูในเวลางาน · บันทึกไว้ |
| ลิงก์ runbook | annotation `runbook_url` (ชื่อ key เป็นธรรมเนียม เอกสารบอกแค่ว่า annotation ใส่ลิงก์ runbook ได้) | ให้คนรับเริ่มจากขั้นตอน ไม่ใช่เริ่มจากศูนย์ตอนตี 3 |
| `summary` บอกอาการและผู้ที่กระทบ | annotation | อ่านจากโทรศัพท์แล้วรู้ว่าต้องทำอะไร |

ตัวอย่าง (เกณฑ์สมมุติ ต้องตั้งจาก SLO จริง):

```yaml
groups:
  - name: voice-agent-symptoms
    rules:
      - alert: VoiceTurnLatencyHigh
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(voice_turn_duration_seconds_bucket[5m]))) > 1.5
        for: 10m
        labels:
          severity: page
        annotations:
          summary: "ผู้โทรรอคำตอบเกิน 1.5 วินาที (p95) นาน 10 นาที"
          runbook_url: https://runbooks.example.com/voice/turn-latency
```

`keep_firing_for` กันเตือนเด้งไปมาเมื่อค่าแกว่งรอบเกณฑ์ · แจ้งเตือนแบบ burn rate ดู `SKILL.md` ข้อ 4.1

## 6 · Grafana

| เรื่อง | ทำอย่างไร |
|---|---|
| 1 dashboard ต่อ 1 service | service ที่รับคำขอใช้ RED: Rate · Errors · Duration · ทรัพยากร (CPU · GPU · disk · connection pool) ใช้ USE: Utilization · Saturation · Errors · เอกสาร Grafana ว่า RED เป็นตัวแทนประสบการณ์ผู้ใช้ จึงตั้ง alert จาก RED ส่วน USE ใช้ไล่หาสาเหตุ |
| เก็บเป็นโค้ด | JSON ของ dashboard อยู่ใน git · เอกสาร Grafana ถือว่าไม่เก็บ JSON ใน version control เป็นสัญญาณว่าระบบยังไม่เป็นระเบียบ · เมื่อมีหลาย dashboard หน้าตาเหมือนกัน สร้างด้วย grafonnet (Jsonnet) หรือ grafanalib (Python) |
| โหลดอัตโนมัติ | ไฟล์ provider YAML ใน `provisioning/dashboards/` ชี้ `options.path` ไปโฟลเดอร์ JSON |
| ไม่ให้แก้ในเบราว์เซอร์แล้วหาย | ตั้ง `allowUiUpdates: false` · ใครอยากแก้ให้แก้ JSON ใน git แล้วเปิด PR · การโหลดจากไฟล์เขียนทับฉบับในฐานข้อมูลเสมอ |
| ไม่ copy dashboard | ใช้ template variable (เลือก service · environment) บน dashboard แม่ · เอกสาร Grafana เตือนว่าการ copy ทำให้ไม่ได้การแก้จากต้นฉบับ |
| dashboard ชั่วคราว | ตั้งชื่อขึ้นต้น `TEST:` แล้วลบเมื่อเสร็จ |
| uid | ตั้ง `uid` คงที่ใน JSON ให้ลิงก์จาก alert ไม่พัง · `uid` และ `title` ต้องไม่ซ้ำกันในโฟลเดอร์เดียวกัน |

ตัวอย่าง provider (ตรวจกับเอกสาร Grafana 2026-10-27):

```yaml
apiVersion: 1
providers:
  - name: services
    type: file
    allowUiUpdates: false
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
```

## 7 · ตัวอย่างระบบ voice agent

ชื่อ metric ในหัวข้อนี้ทีมตั้งเองทั้งหมด (ตัวอย่าง) ยกเว้น `DCGM_FI_DEV_GPU_UTIL` และ `kafka_consumergroup_lag*` ที่มาจาก exporter

**latency แต่ละช่วงของสาย** · 1 histogram แยกช่วงด้วย label `stage` ที่มีค่าจำกัด

```
voice_stage_duration_seconds_bucket{stage="stt|llm|tts", le="…"}
voice_turn_duration_seconds_bucket{le="…"}   # จากผู้โทรพูดจบถึงเสียงตอบแรกออก
```

- วาง bucket ให้ถี่ช่วง 0.1 ถึง 3 วินาที เช่น `0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 1.5, 2, 3, 5` โดยมีขอบตรงเกณฑ์ที่ตั้ง (1.5 วินาทีในตัวอย่างข้อ 5)
- p95 แยกช่วง: `histogram_quantile(0.95, sum by (le, stage) (rate(voice_stage_duration_seconds_bucket[5m])))` · วางเป็นกราฟเดียว 3 เส้น เห็นทันทีว่าช่วงไหนกินเวลา
- เตือนที่ `voice_turn_duration_seconds` (อาการที่ผู้โทรรู้สึก) ไม่เตือนทุก stage · stage ไว้ไล่หาสาเหตุ
- ห้ามใส่ `call_id` หรือเบอร์ผู้โทรเป็น label · call id ลง log และ trace

**consumer lag ของ Kafka** · เมื่อ pipeline ส่งเหตุการณ์ของสายผ่าน Kafka

- ค่า lag มาจาก exporter ของ Kafka · `kafka_exporter` (danielqsj · Apache-2.0 · ไม่ใช่โครงการทางการของ Apache · ตรวจ 2026-10-27) ให้ `kafka_consumergroup_lag{consumergroup,topic,partition}` และ `kafka_consumergroup_lag_sum{consumergroup,topic}` · ถ้าใช้ exporter ตัวอื่น ชื่ออาจต่าง
- ปลุกคนเมื่อ lag ของ consumer ที่ทำให้ผู้โทรรอ (เช่นตัวสรุปสายแบบทันที) สูงและไม่ลดนาน · ตัวอย่าง `sum by (consumergroup, topic) (kafka_consumergroup_lag_sum) > 1000` ด้วย `for: 10m` (เกณฑ์สมมุติ) · lag ของงานรายงานหลังจบสายส่งแชตทีมพอ
- label `partition` ใช้เฉพาะกราฟเจาะลึก ไม่ใส่ในกฎ alert

**GPU utilization** · exporter คือ NVIDIA `dcgm-exporter`

- `DCGM_FI_DEV_GPU_UTIL` เป็น gauge หน่วย % (ตรวจจาก `etc/default-counters.csv` ของ repo 2026-10-27) · ชื่อนี้ exporter ตั้งมาเอง ไม่ตามกฎข้อ 2 ให้ใช้ตามเดิม
- GPU เป็นสาเหตุ (USE) ไม่ใช่อาการ · ใส่ในแดชบอร์ดคู่กับ latency ของ stage ที่ใช้ GPU (STT · TTS) · utilization สูงพร้อม p95 ของ stage นั้นสูง แปลว่าเครื่องอิ่มตัว ต้องเพิ่มเครื่องหรือลดโหลด
- GPU สูงต่อเนื่องหลายชั่วโมงเตือนเป็นระดับดูในเวลางาน ไม่ปลุกคน

## 8 · ตรวจก่อนส่ง

- [ ] ทุก metric มีหน่วยและ `_total` ตามกฎ · ไม่มี label ที่ค่าไม่จำกัด (user · เบอร์ · call id)
- [ ] latency เป็น histogram ที่มีขอบ bucket ตรงเกณฑ์ SLO · ไม่ใช้ค่าเฉลี่ยตัดสิน
- [ ] ทุก alert มี `for:` · `severity` · `runbook_url` · `summary` · เตือนจากอาการ ไม่ใช่ CPU หรือ GPU
- [ ] dashboard เป็น JSON ใน git · provision ด้วยไฟล์ · `allowUiUpdates: false`
- [ ] มี dashboard RED ต่อ service และ USE ต่อทรัพยากร

## 9 · ที่มา

ตรวจ 2026-10-27

| เรื่อง | ที่มา |
|---|---|
| ชนิด metric | prometheus.io/docs/concepts/metric_types/ |
| ชื่อ หน่วย label cardinality | prometheus.io/docs/practices/naming/ |
| histogram · summary · `histogram_quantile` · native histogram | prometheus.io/docs/practices/histograms/ |
| หลักการ alert จากอาการ | prometheus.io/docs/practices/alerting/ |
| ไวยากรณ์กฎ `for` · `keep_firing_for` · annotations | prometheus.io/docs/prometheus/latest/configuration/alerting_rules/ |
| RED · USE · dashboard as code · sprawl | grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/ |
| provisioning dashboard | grafana.com/docs/grafana/latest/administration/provisioning/ |
| `DCGM_FI_DEV_GPU_UTIL` | github.com/NVIDIA/dcgm-exporter → etc/default-counters.csv |
| `kafka_consumergroup_lag` | github.com/danielqsj/kafka_exporter (ไม่ใช่ทางการของ Kafka) |
| `predict_linear` · ช่วง `[5m]` เทียบระยะ scrape · พฤติกรรม NaN เมื่อหารด้วย 0 | ความรู้ทั่วไปของทีม (ยังไม่ได้ตรวจกับหน้า PromQL ทางการ) |
