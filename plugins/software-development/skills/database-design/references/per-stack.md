# Syntax and tools per database and ORM

**Contents:** 1 Data types compared · 2 PostgreSQL · 3 SQL Server · 4 MySQL / MariaDB · 5 MongoDB · 6 Entity Framework Core (.NET) · 7 Prisma / Drizzle (Node) · 8 Alembic (Python) · 9 Slow query commands

1. [Data types compared](#1--data-types-compared)
2. [PostgreSQL](#2--postgresql)
3. [SQL Server](#3--sql-server)
4. [MySQL / MariaDB](#4--mysql--mariadb)
5. [MongoDB](#5--mongodb)
6. [Entity Framework Core (.NET)](#6--entity-framework-core-net)
7. [Prisma / Drizzle (Node)](#7--prisma--drizzle-node)
8. [Alembic (Python)](#8--alembic-python)
9. [Slow query commands](#9--slow-query-commands)

---

## 1 · Data types compared

| To store | PostgreSQL | SQL Server | MySQL |
|---|---|---|---|
| Auto-increment id | `bigint GENERATED ALWAYS AS IDENTITY` | `bigint IDENTITY(1,1)` | `BIGINT AUTO_INCREMENT` |
| UUID | `uuid` | `uniqueidentifier` | `BINARY(16)` or `CHAR(36)` |
| Money | `numeric(19,4)` | `decimal(19,4)` | `DECIMAL(19,4)` |
| Time + time zone | `timestamptz` | `datetimeoffset(3)` | `TIMESTAMP` (store UTC) |
| Date only | `date` | `date` | `DATE` |
| Unlimited-length text | `text` | `nvarchar(max)` | `TEXT` / `LONGTEXT` |
| Thai text | `text` (already UTF-8) | **`nvarchar` only** | `utf8mb4` |
| True/false | `boolean` | `bit` | `TINYINT(1)` |
| JSON | `jsonb` (can be indexed) | `nvarchar(max)` + `JSON_VALUE` | `JSON` |
| Binary file | `bytea` (or store outside the database) | `varbinary(max)` | `BLOB` |

> **SQL Server + Thai**: `varchar` turns Thai characters into `?`.
> Use `nvarchar` and always write literals as `N'ข้อความ'`.
>
> **MySQL must use `utf8mb4`**, because MySQL's character set named plain `utf8`
> stores only 3 bytes per character, so emoji and some other characters are lost.

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

**Create an index without locking the table:**

```sql
CREATE INDEX CONCURRENTLY ix_orders_status ON orders (status);
-- Must not run inside a transaction · if it fails it leaves an index in invalid state: DROP it and redo
```

**Update `updated_at` automatically:**

```sql
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_touch BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

**Row-level security for multi-tenant systems:**

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::bigint);
-- The app sets this per connection: SET app.tenant_id = '42';
```

**Common PostgreSQL traps** (ideas from wshobson postgresql-table-design · version numbers are the version where the behaviour began)

| Trap | Do this instead |
|---|---|
| `timestamp` (no time zone) silently drops the offset, so a `+07:00` machine and UTC store values with different meanings | Always `timestamptz` |
| `serial` creates a separate sequence whose permissions and `DROP` do not follow the table | `GENERATED ALWAYS AS IDENTITY` (PG 10+) |
| `ADD COLUMN ... NOT NULL` on a big table risks a long lock | With a constant `DEFAULT` the table is no longer rewritten (PG 11+) · a function DEFAULT such as `now()` still rewrites the whole table |
| `ADD CONSTRAINT` (FK · CHECK) scans the whole table while holding the lock | Use `... NOT VALID` first, then run `VALIDATE CONSTRAINT` as a separate statement (lighter lock) |
| DDL queues behind a long transaction, and every query after it waits too | Run `SET lock_timeout = '5s'` before every DDL, and rerun if it times out |
| A unique index lets `NULL` repeat on many rows | `UNIQUE NULLS NOT DISTINCT` (PG 15+) or a partial index `WHERE col IS NOT NULL` |
| `LIKE '%คำ%'` and `ILIKE` do not use a btree index | Extension `pg_trgm` + GIN index · for serious text search use `tsvector` |
| `jsonb` search with `->>` does not use an index | GIN index on the column (`@>` · `?`) or an expression index on `(meta->>'key')` |
| `count(*)` over the whole table to show a page count | Use the estimate from `pg_class.reltuples`, or drop the total count (cursor pagination) |

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
  WITH (ONLINE = ON);   -- Enterprise / Azure SQL only
```

- `rowversion` works directly as an ETag to detect conflicting edits.
- To sort Thai correctly, set the collation `Thai_100_CI_AS` at the column or database level.
- The old `datetime` has a precision of only 3.33 milliseconds. Use `datetime2` / `datetimeoffset` instead.

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

- From MySQL 8.0.12, `ADD COLUMN` can use `ALGORITHM=INSTANT` (before 8.0.29 it could add only at the end of the table). Changing a data type still rewrites the table (dev.mysql.com online DDL, checked 22 Oct 2026 (B.E. 2569)). For big tables that need a rebuild, use `pt-online-schema-change` or `gh-ost`.
- Set the server time to UTC (`default_time_zone = '+00:00'`).

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
      totalAmount: { bsonType: "decimal" },   // wrong: do not use double for money
      createdAt:   { bsonType: "date" }
    }
  }}
});
db.orders.createIndex({ orderNo: 1 }, { unique: true });
db.orders.createIndex({ customerId: 1, createdAt: -1 });
```

- Embed when the child data is **always read together with the parent and does not grow without limit**. Otherwise use references.
- One document has a 16 MB ceiling, so an array that keeps growing will hit it one day.
- Use `Decimal128` for money, and nothing else.

---

## 6 · Entity Framework Core (.NET)

```bash
dotnet ef migrations add AddOrderStatus
dotnet ef migrations script <from> <to> -o migrate.sql   # right: review the SQL before the real run
dotnet ef database update                                # dev only
```

> **On production, run the reviewed script, not `database update`.**
> That command needs the app's connection to have permission to change the schema, which it should not have in the first place.

```csharp
modelBuilder.Entity<Order>(e => {
    e.ToTable("orders");
    e.Property(x => x.TotalAmount).HasColumnType("decimal(19,4)");
    e.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("ix_orders_status_created");
    e.HasQueryFilter(x => x.DeletedAt == null);          // soft delete across the whole system
    e.Property(x => x.RowVersion).IsRowVersion();        // detect conflicting edits
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
npx prisma migrate dev --name add_order_status   # dev — creates the migration file
npx prisma migrate deploy                        # production — runs only the existing ones
```

- Prisma's `Decimal` returns an object, not a number. Calculate with `decimal.js` and do not convert to float.
- `BigInt` cannot be converted to JSON directly. Convert it to a string at the API layer.

---

## 8 · Alembic (Python)

```bash
alembic revision --autogenerate -m "add order status"
alembic upgrade head
alembic downgrade -1
```

Split into 3 migrations (1 migration does one thing):

```python
# 1) schema: add a nullable column
def upgrade():
    op.add_column("orders", sa.Column("status", sa.String(20), nullable=True))

# 2) data: backfill existing values (on a big table, do it in small batches)
def upgrade():
    op.execute("UPDATE orders SET status = 'draft' WHERE status IS NULL")

# 3) schema: enforce NOT NULL and create the index
def upgrade():
    op.alter_column("orders", "status", nullable=False)
    # CREATE INDEX CONCURRENTLY must not run inside a transaction, so step out of Alembic's transaction
    with op.get_context().autocommit_block():
        op.create_index("ix_orders_status_created", "orders", ["status", "created_at"],
                        postgresql_concurrently=True)
```

> `--autogenerate` **does not see** renames (it reads them as a drop plus a new add, so the data is lost).
> Always read the file it generates before you commit.

---

## 9 · Slow query commands

| Database | Command |
|---|---|
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) <query>;` · extension `pg_stat_statements` |
| SQL Server | Turn on "Include Actual Execution Plan" · `sys.dm_exec_query_stats` |
| MySQL | `EXPLAIN ANALYZE <query>;` · `performance_schema` |
| MongoDB | `db.orders.find(...).explain("executionStats")` |

**Danger signs to fix:** `Seq Scan` / `Table Scan` on a big table ·
estimated row count differs from the actual by more than 10 times · a `Nested Loop` that runs hundreds of thousands of times
