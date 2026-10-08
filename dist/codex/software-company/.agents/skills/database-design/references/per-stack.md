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

- `ALTER TABLE` ส่วนใหญ่เขียนตารางใหม่ทั้งตาราง ตารางใหญ่จึงควรใช้ `pt-online-schema-change` หรือ `gh-ost`
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

- ฝัง (embed) เมื่อข้อมูลลูก **อ่านคู่กับพ่อเสมอ และไม่โตไม่จำกัด** นอกนั้นใช้การอ้างอิง
- เอกสาร 1 ใบมีเพดาน 16 MB อาเรย์ที่โตเรื่อย ๆ จึงชนเพดานสักวัน
- เงินใช้ `Decimal128` เท่านั้น

---

## 6 · Entity Framework Core (.NET)

```bash
dotnet ef migrations add AddOrderStatus
dotnet ef migrations script <from> <to> -o migrate.sql   # ✅ ตรวจ SQL ก่อนรันจริง
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

```python
def upgrade():
    op.add_column("orders", sa.Column("status", sa.String(20), nullable=True))
    op.execute("UPDATE orders SET status = 'draft' WHERE status IS NULL")
    op.alter_column("orders", "status", nullable=False)
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
