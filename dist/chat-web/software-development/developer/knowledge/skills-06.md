# skill: database-design

Use when designing or changing a database schema

# Database design

> **One rule:** the schema is the hardest thing in a system to change.
> A code bug fixed today is done today, but a wrong schema stays for 3 years, with another 10 million real rows to migrate along with it.

## When to use this skill

- Designing the database of a new system or a new module
- Adding or changing a table, column, relationship or index
- Writing a migration, especially once the system holds real data
- A query is slow and you suspect the schema or an index

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Choose the overall architecture | `architecture-patterns` | instead |
| Design endpoints and JSON shapes | `api-conventions` | instead |
| Store passwords, tokens, user permissions | `auth-implementation-patterns` | instead |
| Where to keep connection strings | `config-and-secrets` | instead |
| Run migrations in a pipeline | `cicd-and-release` | instead |
| Draw an Entity-Relationship (ER) diagram | `diagram-figures` or `markdown-visuals` | together |
| Record why this database was chosen | `adr-writer` | together |
| Abbreviations in work people read | `spell-out-abbreviations` | together |

**Syntax specific to each database, data types compared, and the migration commands of each Object-Relational Mapping (ORM) tool** are in `references/per-stack.md`.

---

## 1 · Choose the database type first

| Criterion | Relational (PostgreSQL, SQL Server, MySQL) | Document (MongoDB) |
|---|---|---|
| Data has clear relationships and needs joins | ✓ | ✗ must be done by hand |
| Data shape is uncertain and differs per record | Careful: use a JSON column | ✓ |
| Needs transactions across several tables | ✓ | Careful: possible but costlier |
| Reports, totals, analysis | ✓ | ✗ |
| Very heavy writes, log/telemetry | Careful | ✓ or use a time-series database |

> **The default is relational.** Choose document only when you **can answer why**.
> "More flexible" is not a reason. It means the design is not done yet.
> Most systems that chose document for flexibility end up writing join code by hand in the app.

**You can mix them**: use relational as the base, and store data of uncertain shape in a `jsonb` column.
In almost every case this is better than running 2 separate databases.

---

## 2 · Naming rules — choose once, use across the whole system

| What you name | Format | Example |
|---|---|---|
| Table | `snake_case` **plural** | `orders`, `order_items` |
| Column | `snake_case` singular | `created_at`, `total_amount` |
| primary key | `id` | `id` |
| foreign key | `<singular table>_id` | `customer_id` |
| Join table | `<a>_<b>` in alphabetical order | `role_users` ✓ (not `user_roles`) |
| index | `ix_<table>_<column>` | `ix_orders_customer_id` |
| unique | `ux_<table>_<column>` | `ux_users_email` |
| foreign key constraint | `fk_<table>_<target table>` | `fk_orders_customers` |
| check constraint | `ck_<table>_<topic>` | `ck_orders_total_non_negative` |

**Do not:**

- Wrong: put the data type in the name, such as `name_varchar`, `is_active_bit`
- Wrong: prefix a column with the table name, such as `order_order_date` (it is already in the `orders` table)
- Wrong: use reserved words such as `user`, `order`, `group`, `key`, which need quotes every time. Use `users`, `orders` instead.
- Wrong: use abbreviations people cannot read, such as `cst_nm`. It saves 8 characters but costs 3 years of confusion.

> SQL Server may use `PascalCase` if the existing project already does.
> **Using one style across the whole system matters more than which style is right.** Do not switch midway.

---

## 3 · Columns every table must have

```sql
id           bigint / uuid   PRIMARY KEY
created_at   timestamptz     NOT NULL DEFAULT now()
updated_at   timestamptz     NOT NULL DEFAULT now()
```

Add these as needed:

| Column | Add when | Note |
|---|---|---|
| `deleted_at timestamptz` | Data must be recoverable, or the law requires keeping it | **Every query must filter on it**, or deleted data shows up |
| `created_by` / `updated_by` | You must be able to say who changed it | Store the user id, not the name |
| `row_version` / `xmin` | Several people can edit at the same time | Use with the ETag in `api-conventions` |
| `tenant_id` | Multi-tenant system | See section 10 |

> **soft delete (delete by only setting a flag) has a cost**: every unique constraint must be rethought.
> `ux_users_email` will block signing up with the same email again, even though the old account was deleted.
> Fix it with a partial index: `CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`

---

## 4 · Choose the identifier type

| Type | Pros | Cons | Use when |
|---|---|---|---|
| `bigint` auto-increment | Small, fast, index does not fragment, easy to read when tracing problems | Next id can be guessed · ids collide when merging data from several places | Default, single system, single database |
| **UUIDv7 / ULID** | Sorted by time · can be generated on the app side · no collisions | 16 bytes · hard to read by eye | Distributed system · id needed before saving · id appears in a URL |
| `UUIDv4` fully random | No collisions, cannot be guessed | **index fragments, and writes get clearly slower with lots of data** | Avoid if you can |

> **UUIDv4 as a primary key is the most common trap.**
> Fully random values make every insert land in the middle of the index structure.
> You do not feel it at tens of thousands of rows, but at tens of millions it gets so slow you must rebuild.
> If you must use a UUID, use **v7**, which starts with the time, so it grows in order like bigint.

**A number people see is not the primary key**: a purchase order number such as `SO-2026-00042` that the customer refers to
should be stored as a separate column with a unique constraint, and the primary key should not be shown.

---

## 5 · How much normalisation is enough

**Always start at Third Normal Form (3NF)**: each fact is stored in one place.

You may denormalise (accept duplicated data) only when all 3 of these hold:

1. You measured and it is truly slow (with numbers, not a feeling).
2. You know how the duplicated data will be updated so that the copies match.
3. You wrote the reason in the table comment.

**A commonly accepted exception**: data that must be "frozen" at a point in time.
The product price in a purchase order must be copied into `order_items.unit_price`
and not joined to `products.price`, because today's price is not the price on the day the customer bought.

---

## 6 · Four data types people get wrong all the time

Details of the 4 data types people get wrong all the time (money · time · enum or status · boolean), with examples, are in [`data-types`](references/data-types.md).

## 7 · index — where to put one so it works

**Must have:**

- Every foreign key (most databases **do not create it automatically**)
- Columns in the `WHERE` of frequently run queries
- Columns used in `ORDER BY` together with pagination

**composite index (an index on several columns): column order matters**

```sql
-- query: WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX ix_orders_tenant_status_created
  ON orders (tenant_id, status, created_at DESC);
```

Order the columns by condition type: **equals → range → sort**.
An index `(a, b)` works for a query that filters on `a` alone, but **not** for one that filters on `b` alone.

**Do not add an index when:**

- The table has fewer than a few thousand rows, because the database reads the whole table faster
- The column has many repeated values, such as `is_active` where 95% are true
- The table is written far more often than read, because every index adds cost on every write

> **Measure before guessing**: `EXPLAIN ANALYZE` (PostgreSQL) or the execution plan (SQL Server)
> tells you whether the index is really used. Guessing that it "should help" is wrong more often than right.

---

## 8 · Constraints live in the database, not only in the app

| Rule | Where it should live |
|---|---|
| Email must not repeat | `UNIQUE` in the database **and** a check in the app so the error message looks nice |
| Amount must not be negative | `CHECK (total_amount >= 0)` |
| A purchase order must have a real customer | `FOREIGN KEY` |
| Status must be one of the defined values | `CHECK` or a lookup table |

> **Reason:** the app is not the only thing that touches the data. There are also urgent data-fix scripts,
> import jobs at 3 a.m., and a 2nd service written later.
> A constraint in the database is the last gate that nobody can skip.

**Choose `ON DELETE` on purpose:**

| Option | Meaning | Use with |
|---|---|---|
| `RESTRICT` (the default you should use) | Cannot delete while children exist | Almost every case |
| `CASCADE` | Delete all the children too | True components, such as `order_items` |
| `SET NULL` | Child becomes parentless | Optional relationships |

If you put `CASCADE` in the wrong place just once, deleting 1 customer wipes 10 years of purchase history with it.

---

## 9 · migration — change the schema without taking the system down

The expand-and-contract steps, and example migrations that deploy without downtime, are in [`migrations`](references/migrations.md).

Data warehouses for analysis (star schema · SCD · ELT) are in [`warehouse-modeling`](references/warehouse-modeling.md) · pipelines that can rerun safely (incremental · backfill · data quality tests · checklist before going to production) are in [`data-pipeline-patterns`](references/data-pipeline-patterns.md).

## 10 · Multi-tenant systems

| Style | How separate | Cost | Fits |
|---|---|---|---|
| A `tenant_id` column in every table | Low: one slip and data leaks across tenants | Cheapest | Many tenants, small data per tenant |
| A separate schema per tenant | Medium | Migrations must loop over every schema | Tens to hundreds of tenants |
| A separate database per tenant | Highest | Most expensive | Enterprise customers who require separation |

> **Important:** if you choose the `tenant_id` style, **enforce it at the lowest layer, not by adding it to each query**.
> Use the database's row-level security, or the ORM's global filter.
> A single query that forgets `WHERE tenant_id = ?` shows one customer's data to another,
> and no error appears at all.

---

## 11 · Personal data

- Keep a list of **which columns are personal data**. Without this list you cannot answer the question "where is my data?".
- National ID numbers, credit card numbers and health data: encrypt at the column level, or do not store them at all if not needed.
- Set a **retention period** per table, and have a real job that deletes accordingly.
- Data must be deletable when the owner asks, and soft delete alone does not count as deleting.
- Never copy real data onto a developer machine without masking it.

---

## 12 · Anti-patterns

- **One table that stores everything** (`entity` / `attribute` / `value`): every query becomes hard.
- **`varchar(255)` on every column**: this number means nothing. Set it from real data.
- **Several values in one column**, such as `"1,4,7"`: cannot search it, cannot add a constraint. Use a join table.
- **No foreign key because "the app takes care of it"**: one day you will have orphan rows.
- **An index on every column just in case**: writes get slower and storage bloats, with no one benefiting.
- **`SELECT *` in real code**: the code breaks every time a column is added.
- **Business logic in triggers**: problems are untraceable, because nobody sees it running.
- **A migration that also writes data**, mixed with the structure change: on rollback the data is lost.
- **Changing the schema on production by hand**: at the next deploy the schema will not match.


## reference: data-pipeline-patterns.md

# Data pipeline patterns — incremental, backfill, quality, catalog

Every pipeline must give the same result when run again (`principle-safe-to-rerun`) and must always pass values into SQL as parameters.

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

# 6 · Four data types that are routinely got wrong

### Money

```sql
total_amount   numeric(19,4)   NOT NULL      -- ถูก:
currency       char(3)         NOT NULL      -- ถูก: ISO 4217 เช่น THB
total_amount   float / double                -- ผิด: 0.1 + 0.2 ไม่เท่ากับ 0.3
```

> Wrong: **float for money is a bug you cannot find.** The total drifts by 1 satang per line
> You only learn at month-end close, and cannot trace back where it drifted

### Time

| Store | Use | Reason |
|---|---|---|
| Time an event happened | `timestamptz` (SQL Server uses `datetimeoffset`) stored as UTC | Thailand has no daylight saving, but systems sold abroad do |
| Birth date, due date | `date` | no time, no time zone |
| Shop opening hours | `time` + a separate time zone column | |

**Rule:** store UTC and convert to `+07:00` only at display time; never store raw Thai time in a `timestamp` that has no zone

**Buddhist Era (BE)**: always store Common Era (CE), then convert to BE at display time
If you store the year 2569 in the database, every function will compute durations wrongly

### enum / status

| Approach | Good when | Bad when |
|---|---|---|
| Lookup table + foreign key | values can be added without a deploy, has Thai/English names, and has a display order | needs a join |
| `check constraint` as text | constant values that rarely change | adding a value needs a migration |
| PostgreSQL `enum` type | fast, small | **a value cannot be removed** and the order cannot be changed |
| raw `int` | — | ✗ reading `status = 3`, nobody knows what it means |

### boolean

- Name it as a positive statement: `is_active` (right) · `is_not_disabled` (wrong)
- **If a third state might appear in the future, do not use boolean**, because `is_approved` will become `approval_status`
  within 6 months, once "รออนุมัติ" (awaiting approval) is added

---


## reference: migrations.md

# 9 · migration — change the schema without taking the system down

**3 rules:**

1. **Forward only**: a migration that has been merged must not be edited; if it is wrong, write a new one over it
2. **1 migration does one thing**: easy to trace problems, and rollback is exact
3. **Old-version code and the new-version schema must work together**, because during a deploy both versions of the code always run at the same time

### expand / contract — the standard steps for a change that destroys something existing

Example: rename the column `name` → `full_name`

| Deploy round | Database | Code |
|:--:|---|---|
| **1 · Expand** | add `full_name` (nullable) | write to both columns · read from `name` |
| **2 · Migrate** | copy old data in batches | read from `full_name`, fall back to `name` if it has no value |
| **3 · Contract** | set `NOT NULL` · drop `name` | read and write only `full_name` |

3 rounds looks slow, but every round can roll back without losing data
If you do it in one round, you must accept that the system has to go down

**Commands that lock the table until the system hangs** (be extra careful on large tables):

- Adding a column with both `DEFAULT` and `NOT NULL` at once — newer PostgreSQL does this fast, and MySQL 8.0.12 and up can add a column as INSTANT (changing a data type still rewrites the table)
- Changing a data type
- Creating a plain index; use `CREATE INDEX CONCURRENTLY` instead (PostgreSQL) or `ONLINE = ON` (SQL Server)

**Always test a migration against a copy of real data**, because a migration that runs in 0.2 seconds on your own machine
may take 40 minutes on production and hold the table lock the whole time

---


## reference: per-stack.md

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


## reference: warehouse-modeling.md

# Warehouse modeling — ELT, stack, star schema, SCD

For an analytics warehouse, not an application database.

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

> **2026 default: ELT with dbt** — load raw to warehouse, transform with SQL via dbt

## Tech Stack (2026 Recommendations)

> The tool list comes from model knowledge and has not been checked against official websites (รอยืนยัน, awaiting confirmation). Check before recommending.

### Warehouse / Lake
| Tool | Best for | Cost |
|------|----------|------|
| **Snowflake** | Pure warehouse, separation of compute/storage | $$|
| **BigQuery** | Serverless, ad-hoc, GCP shops | $$|
| **Databricks** | Unified lake + warehouse, ML-heavy | $$$|
| **DuckDB** | Local dev, embedded analytics | $free |
| **Redshift** | AWS-native, legacy | $$|
| **Postgres** | Small data (<1TB), simplicity | $|

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

> **Star = denormalized, query-fast**
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

# skill: config-and-secrets

Use when settings differ by environment or secrets need hiding

# Config and secrets

> **2 rules:**
> 1. The same code must run in every environment. The only difference is config.
> 2. A secret must not be in git, not in logs, and not in any file sent to the browser.

## When to use this skill

- Starting a project, or adding a new environment.
- You need to store a connection string, API key, certificate, or signing key.
- You find a hardcoded value in code and must move it out.
- A secret leaked into git, or you suspect it did: go to step 8 at once.

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Storing secrets in a pipeline · approval gates | `cicd-and-release` | instead |
| Secrets in a Jenkinsfile (`withCredentials` · single quote) | `jenkins-pipeline` | together |
| Kubernetes secrets kept out of values.yaml (External Secrets · SealedSecret) | `kubernetes-helm` | together |
| Designing login, tokens, user permissions | `auth-implementation-patterns` | instead |
| Keeping sensitive values out of logs | `logging-standards` | instead |
| Database connection strings | `database-design` | together |
| Recording the incident after a secret leak | `postmortem-template` | together |
| Steps during an incident | `incident-runbook-template` | together |
| Abbreviations in work people read | `spell-out-abbreviations` | together |

**How to do it in each language and framework** is in `references/per-stack.md`.

---

## 1 · Tell config and secret apart first

| | config | secret |
|---|---|---|
| Examples | API address, log level, page size, time zone, feature flag | Database password, API key, token signing key, certificate |
| Allowed in git | ✓ yes | ✗ never |
| Who can see it | The whole team | Only those who need it |
| If it leaks | No harm | Must be revoked and replaced at once |
| Changes how often | With the work | On a rotation schedule |

> **If you cannot decide which one it is, treat it as a secret.** Being too careful costs only a small annoyance.
> But if you guess wrong, the key stays in git history forever.

---

## 2 · Order of priority: later values override earlier ones

```
1. Defaults in code             (safe, really usable for dev)
2. Config file per environment  (appsettings.Production.json, config/production.yaml)
3. Environment variables
4. Secret store                 (Key Vault, Secrets Manager, Kubernetes secret)
5. Arguments at launch          (for troubleshooting only)
```

**Defaults must be safe.** If someone forgets to set a value, the system must run in its strictest mode.
For example `DEBUG=false` · `ALLOWED_ORIGINS=` empty · Transport Layer Security (TLS) on, not the opposite.

---

## 3 · Check at boot: if any value is missing, die at once

> **Important:** this step is worth the most on this page.
> A system that boots with wrong config will break at 2 a.m. in a function that is rarely used.
> A system that **refuses to boot** on wrong config tells you at deploy time, when you can still roll back.

```ts
// Node — zod
const Env = z.object({
  NODE_ENV:      z.enum(['development', 'staging', 'production']),
  PORT:          z.coerce.number().int().positive().default(3000),
  DATABASE_URL:  z.string().url(),
  JWT_SECRET:    z.string().min(32),
  LOG_LEVEL:     z.enum(['debug','info','warn','error']).default('info'),
});

export const env = Env.parse(process.env);   // invalid = the process dies and says which value is wrong
```

**What to check:** every value is present · types are right · values are in the accepted range ·
keys are long enough · values banned on production (`JWT_SECRET=dev-secret` must fail).

**Print a config summary at boot:** the value names, and the values that are not secrets.
For a secret, print only "set" or the last 4 characters, never the full value.

---

## 4 · Naming environment variables

```
<system>_<group>_<name>

APP_DB_HOST          APP_DB_PASSWORD
APP_REDIS_URL        APP_SMTP_PASSWORD
APP_FEATURE_NEW_CHECKOUT
```

| Rule | Reason |
|---|---|
| Uppercase with underscores | The convention on every operating system |
| Start with a system prefix | Avoids clashing with the system's `PATH`, `HOME`, `USER` |
| Same name in every environment | Values may differ, but names must not, or every move between environments means editing code |
| Put the unit in the name | `APP_TIMEOUT_SECONDS`, not `APP_TIMEOUT` |
| Do not put the environment name in the variable name | ✗ `APP_PROD_DB_HOST` |

---

## 5 · `.env` and `.env.example`

| File | In git | Role |
|---|:--:|---|
| `.env.example` | ✓ | The list of **all** required values, with explanations and example values that are not real |
| `.env` | ✗ | Real values on each developer's machine |
| `.env.production` | ✗ | **This file should not exist at all**, because production uses a secret store |

```bash
# .gitignore
.env
.env.*
!.env.example
```

```bash
# .env.example
APP_DB_HOST=localhost              # database address
APP_DB_PASSWORD=change-me          # important: the real value is in the team's 1Password vault
APP_JWT_SECRET=                    # important: generate with: openssl rand -base64 48
APP_LOG_LEVEL=debug
```

**Update `.env.example` in the same commit that adds a new value.**
Otherwise the next person who clones hits an error nobody can explain.

> **A `.env` added to `.gitignore` too late:** once the file has been tracked, even once,
> adding it to `.gitignore` later **does not remove it from history.** Run `git rm --cached` and treat the secret as leaked.

**Pre-commit gate** (idea from wshobson secrets-management): `.gitignore` blocks only files you know by name, but a key pasted by mistake into code or YAML needs a scanner. Install gitleaks as a pre-commit hook in every repo (`gitleaks git --pre-commit --staged` in gitleaks 8.19 and later · earlier versions use `gitleaks protect --staged`) and rerun it in CI over the whole history with `gitleaks git --redact`. If the hook fails, never use `--no-verify`; move the value out first. If you find one in history, go to step 8 at once, not just delete the line.

---

## 6 · Where to keep secrets

| Situation | Use | Note |
|---|---|---|
| Developer machine | A `.env` that stays out of git; for .NET use `dotnet user-secrets` | Never use production values |
| Small team sharing | The team's password manager (1Password, Bitwarden) | Not chat, not email, not a Google Sheet |
| Production in the cloud | Azure Key Vault · AWS Secrets Manager · Google Secret Manager | Grant access with a managed identity, not another key |
| Kubernetes | External Secrets Operator pulling from a vault above | A Kubernetes secret is only base64, **not encryption** |
| You really must store in git | SOPS or sealed-secrets (encrypt before commit) | Last resort |

**Permissions:** each service reads only its own secrets, environments are fully separate, and
no account can read all of them, except an admin account whose access is logged.

---

## 7 · Rotation

**Design for it from day one**, not when you finally have to rotate.

| Must have | Detail |
|---|---|
| Two values valid at once | During the change, both the old and the new value must work, or you must shut the system down |
| Reload without restart | Or accept that you need one deploy, and write down that it must be done |
| Schedule | Token signing key 90 days · database password 180 days · certificate 30 days before expiry |
| Automatic | A task that depends on someone remembering ends up done by nobody |

**A token signing key must carry an id (key id)**, so that after signing new tokens with the new key,
you can still verify old tokens that have not expired.

---

## 8 · When a secret leaks: order matters more than speed

1. **Revoke the old value first:** disable that key at its source.
2. Issue a new value, then deploy.
3. Check past logs for anyone using it from a place that is not ours.
4. Remove it from git history (`git filter-repo`) and tell everyone to clone again. (If you must force push, wait for the user's approval and tell the team first.)
5. Record the incident with `postmortem-template`.

> **Step 4 is not step 1**, because deleting the commit does not make the key any safer.
> Anyone who forked or cloned already, and the provider's backups, still have the old value.
> **Treat every secret that has ever been in git as leaked**, even if the repo is private.

---

## 9 · Do not let secrets flow out other ways

| Leak path | How to close it |
|---|---|
| Logs | The list of terms to mask is in `logging-standards` |
| Error messages sent to the client | Return only a `requestId`, not a stack trace or connection string |
| Crash reports / error trackers | Set a sensitive-data filter before sending out |
| Shell command history | Use `read -s` or read from a file, instead of typing the value on the command line |
| `docker history` | Do not put secrets in `ARG`/`ENV` at build time; use a mount at run time instead |
| Backup files and dumps | Encrypt them and store them where you control access |
| Screenshots in documents and issues | Always mask before attaching |

---

## 10 · Frontend config: nothing in it is secret

> **Important:** everything in a file the browser loads **is public information**,
> whether it is named `VITE_SECRET_KEY` or sits in a file minified until it is unreadable.
> Minifying code is not encryption. Open DevTools and you can see it.

| Allowed in the frontend | Must stay on the server only |
|---|---|
| API address · environment name | API keys of any external service |
| Publishable key of a payment provider | The secret key of the same provider |
| Feature flags that are not secret | Pricing rules · approval thresholds |
| Web ID of an analytics tool | Tokens that call a third party's API |

**If you need to change a value without rebuilding,** load `/config.json` when the app starts,
instead of embedding the value at build time (`import.meta.env`), which locks the value into the built files.

---

## 11 · Anti-patterns

- **A connection string in code**, even a dev one, because one day someone will copy it for production.
- **A production `.env` placed on the server.** Anyone who can enter the machine can read it, and nothing records who read it.
- **The same secret in every environment.** When staging leaks, production leaks too.
- **Sending secrets by chat or email.** The value stays there forever, and is searchable.
- **No `.env.example`.** A new person wastes half a day guessing which values are needed.
- **Booting successfully with incomplete config,** then breaking in real use.
- **Printing the whole config to the log at boot,** secrets included.
- **`ALLOWED_ORIGINS=*` on production** because "it was blocked by Cross-Origin Resource Sharing (CORS) in dev."
- **A key that has never changed since the first year.**


## reference: per-stack.md

# Practical how-to by language and framework

**Contents:** 1 .NET / ASP.NET Core · 2 Node.js · 3 Python · 4 Angular and frontend in general · 5 Docker and Kubernetes · 6 Tools that detect secrets leaked into git · 7 Commands that generate safe random values

1. [.NET / ASP.NET Core](#1--net--aspnet-core)
2. [Node.js](#2--nodejs)
3. [Python](#3--python)
4. [Angular and frontend in general](#4--angular-and-frontend-in-general)
5. [Docker and Kubernetes](#5--docker-and-kubernetes)
6. [Tools that detect secrets leaked into git](#6--tools-that-detect-secrets-leaked-into-git)
7. [Commands that generate safe random values](#7--commands-that-generate-safe-random-values)

---

## 1 · .NET / ASP.NET Core

**On the developer machine, stored outside the project folder so it can never reach git:**

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;..."
dotnet user-secrets list
```

**Validate at boot:**

```csharp
public sealed class AppOptions
{
    public const string Section = "App";

    [Required, Url]                       public string ApiBaseUrl { get; init; } = "";
    [Required, MinLength(32)]             public string JwtSecret  { get; init; } = "";
    [Range(1, 300)]                       public int TimeoutSeconds { get; init; } = 30;
}

builder.Services
    .AddOptions<AppOptions>()
    .Bind(builder.Configuration.GetSection(AppOptions.Section))
    .ValidateDataAnnotations()
    .ValidateOnStart();                   // ← ขาดค่า = แอปไม่ยอมบูต
```

**Order in which ASP.NET Core reads (later values override earlier ones):**

```
appsettings.json → appsettings.{Environment}.json → user-secrets (dev)
→ environment variable → อาร์กิวเมนต์บรรทัดคำสั่ง
```

Environment variables use `__` in place of hierarchy levels, for example `ConnectionStrings__Default`

**Azure Key Vault:**

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{vaultName}.vault.azure.net/"),
    new DefaultAzureCredential());        // ใช้ managed identity ไม่ต้องมี key อีกอัน
```

---

## 2 · Node.js

```ts
// config/env.ts — ไฟล์เดียวที่แตะ process.env ได้ทั้งโปรเจกต์
import { z } from 'zod';

const Env = z.object({
  NODE_ENV:     z.enum(['development','test','staging','production']),
  PORT:         z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET:   z.string().min(32),
  SMTP_PASSWORD: z.string().optional(),
}).superRefine((v, ctx) => {
  if (v.NODE_ENV === 'production' && v.JWT_SECRET.startsWith('dev-'))
    ctx.addIssue({ code: 'custom', message: 'ห้ามใช้ JWT_SECRET ของ dev บน production' });
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  console.error('config ไม่ถูกต้อง:', z.treeifyError(parsed.error));
  process.exit(1);
}
export const env = parsed.data;
```

> **Do not read `process.env` scattered through the code.** Gather it in one file
> so you can answer which values the system uses, without grepping the whole project

Node 20 and up can load `.env` itself with `node --env-file=.env`, with no need for `dotenv`

---

## 3 · Python

```python
# settings.py
from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="APP_", env_file=".env")

    env: str = Field(pattern="^(development|staging|production)$")
    database_url: PostgresDsn
    jwt_secret: str = Field(min_length=32)
    timeout_seconds: int = Field(default=30, ge=1, le=300)

settings = Settings()      # ขาดค่า = ValidationError ตั้งแต่ import
```

- Reads `APP_DATABASE_URL`, `APP_JWT_SECRET` according to `env_prefix`
- Import at the top level of the app so the error happens at boot, not at the first use

---

## 4 · Angular and frontend in general

> **Everything in a file the browser loads is public.** No exceptions

**Embedded at build time** (`environment.ts`, `import.meta.env`, `NEXT_PUBLIC_*`):
The value is baked into the built files. Every change needs a rebuild, which breaks the rule of building once and using in every environment

**Loaded at run time (recommended):**

```ts
// main.ts — โหลดก่อนแอปเริ่ม
fetch('/config.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(cfg => {
    (window as any).__APP_CONFIG__ = cfg;
    return bootstrapApplication(AppComponent, appConfig);
  });
```

```json
// config.json — ไฟล์นี้วางแยกต่อ environment ไม่ต้อง build ใหม่
{ "apiBaseUrl": "https://api.example.co", "env": "production", "sentryDsn": "..." }
```

Set the header `Cache-Control: no-store` on `/config.json`, otherwise the browser will use the old value

---

## 5 · Docker and Kubernetes

**For Docker, do not put secrets in at build time:**

```dockerfile
# ผิด: ค่าจะติดอยู่ในชั้นของ image ตลอดไป เห็นได้ด้วย docker history
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN

# ถูก: mount เฉพาะตอนใช้ ไม่ติดไปกับ image
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
```

```bash
docker build --secret id=npmrc,src=$HOME/.npmrc .
docker run --env-file .env myapp        # ตอนรัน ส่งค่าเข้าไป
```

Do not write a trailing `# comment` on a value line in a `.env` used with `--env-file`: docker keeps the comment as part of the value, making the value wrong with no error (tested 2026-11-04: `A=value # note` gives the value `value # note`) · put the comment on its own line

**Kubernetes:**

```yaml
env:
  - name: APP_DB_PASSWORD
    valueFrom:
      secretKeyRef: { name: app-secrets, key: db-password }
```

> **A Kubernetes Secret is only base64, not encryption**
> Anyone with `get secret` permission can read the value directly
> You must turn on encryption at rest in etcd and control access with RBAC
> A better way: let External Secrets Operator pull the value from Key Vault / Secrets Manager and create the Secret

---

## 6 · Tools that detect secrets leaked into git

```bash
# ตรวจทั้งประวัติ
gitleaks git --redact        # คำสั่ง detect เดิมถูกแทนด้วย git / dir

# กันไว้ก่อน commit
pip install pre-commit detect-secrets
detect-secrets scan > .secrets.baseline
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2   # ตัวอย่าง ตรวจ rev ล่าสุดก่อนใช้ (รอยืนยัน)
    hooks: [{ id: gitleaks }]
```

**Remove from history** (only after the old value has been revoked):

```bash
pip install git-filter-repo
git filter-repo --path .env --invert-paths
# รอผู้ใช้อนุมัติก่อน · แจ้งทีมก่อน force push (เขียนประวัติร่วมทับ ทุกคนต้อง clone ใหม่)
git push --force --all
```

---

## 7 · Commands that generate safe random values

```bash
openssl rand -base64 48                 # กุญแจทั่วไป
openssl rand -hex 32                    # กุญแจ 256 บิตเป็นเลขฐานสิบหก
uuidgen                                 # id ไม่ลับ

node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

```powershell
# Windows
# PowerShell 5.1 และ 7 (ตัวสุ่มสำหรับงานเข้ารหัส ไม่ใช่ Get-Random)
$b = New-Object byte[] 48
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
[Convert]::ToBase64String($b)
# PowerShell 7.4 ขึ้นไป: Get-SecureRandom ก็ใช้ได้
```

> Wrong: **do not use a general-purpose random generator** (`Math.random`, `random.random`, .NET `Random`)
> because they are predictable; use the cryptographic random generator as in the commands above


---

# skill: background-jobs

Use when work runs outside the request in queues or schedules

# Background jobs

> **The one rule:** every background job must be **safe to run again without repeating its effect**,
> because it will certainly run again: the machine dies halfway · a person clicks again · the system retries by itself.

## When to use this skill

- Work the user should not have to sit and wait for: sending email, building a report, importing a file
- Scheduled work: a daily summary, month-end closing, deleting expired data
- Calling an external system that is slow or often down
- A jammed queue, or jobs that vanish with nobody noticing

## When to use another skill, or use it alongside

| Task | Skill | |
|---|---|---|
| Timeouts and retries for ordinary requests | `error-handling-patterns` | instead |
| Events across several services through Kafka (several consumers read the same event · history is kept) | `kafka-streaming` | instead |
| A job queue through RabbitMQ (several workers · retry · dead letter · needs a real broker) | `rabbitmq-messaging` | instead |
| Metrics and alerts | `observability-basics` | instead |
| Choosing the overall architecture | `architecture-patterns` | instead |
| Importing Excel/CSV files as the main job | `data-import-export` | instead |
| Sending email/SMS as the main job | `notifications` | instead |
| The job table and indexes | `database-design` | alongside |
| Worker logs and correlation id | `logging-standards` | alongside |
| Jobs that delete expired data | `pdpa-compliance` | alongside |
| Abbreviations in work that people read | `spell-out-abbreviations` | alongside |
| Designing an agent system (Loop · Graph · Dynamic · choosing a framework) | `llm-engineering` → [`agent-systems.md`](../llm-engineering/references/agent-systems.md) | alongside |

---

## 1 · What belongs in the background

| Send to the background | Do inside the request |
|---|---|
| Takes more than 1–2 seconds | Fast, and the user must see the result at once |
| Calls an external system that can fail | Permission checks · data validation |
| The user does not wait for the result (email, notification) | The result is what they clicked to see |
| Many items done as a batch | |

> **Do not move work to the background just because it is slow.** If the user must see the result before moving on,
> moving it adds a waiting screen, a notification, and a place to store results.
> Sometimes making it faster is much cheaper (see `lazy-coding`).

---

## 2 · Choose a mechanism

| Mechanism | Fits | Watch out for |
|---|---|---|
| **Job table in the database** | small to medium systems · up to a few thousand jobs a day | you must write the job picker yourself · watch for workers fighting over jobs |
| **A real queue** (Redis · RabbitMQ · Amazon Simple Queue Service (SQS)) | many jobs · need built-in retry and dead letter | one more thing to look after |
| In-app scheduler (cron in code) | scheduled work with a single instance | **several instances will run it at the same time** · see section 5 |
| Platform scheduler | scheduled work on the cloud | |

**If the system is still small, always start with a table in the database,** because PostgreSQL's `SELECT ... FOR UPDATE SKIP LOCKED`
lets several workers pick jobs at once safely, with no new system to add.

**Every job needs at least:** `id` · `type` · `payload` · `status` · `attempts` ·
`run_after` · `locked_by` · `locked_at` · `last_error` · `created_at`

---

## 3 · Running again must not repeat the effect

Almost every queue system guarantees only "delivered at least once", **not exactly once**.

| Method | How to use it |
|---|---|
| **Duplicate-blocking key** | a unique constraint on `(job_type, business_key)` makes a duplicate job fail to insert |
| **Check state before acting** | "if the email for this purchase order was already sent, stop" |
| **Pass on an idempotency key** | when calling an external API (see `api-conventions`) |
| **Set a new value, do not add to the old one** | `set status = 'paid'` is safer than `balance = balance + 100` |

> **A job that adds to a value or sends something outside costs real money if it runs twice.**
> Two emails are only annoying, but two money transfers are a big problem.

---

## 4 · Retry and dead jobs

These numbers are for jobs in a queue · for retries outside a queue use [`error-handling-patterns`](../error-handling-patterns/SKILL.md) §4: service-to-service calls use 3 tries at 1/2/4 seconds · when a person waits on the screen → at most 1 retry, then let them press again

```
fail → wait 1 min → fail → wait 4 min → fail → wait 16 min → 4th failure → dead letter
```

| Rule | Detail |
|---|---|
| **Always set a cap** | 3–5 tries · with unlimited retries a single job can jam the queue |
| Increase the wait each round (a fixed multiple such as ×4) + a little randomness | same as `error-handling-patterns` |
| Bad data needs no retry | a malformed payload stays the same however many times you try |
| **A job that has run out of tries goes to one place** | dead letter (where jobs that failed until they ran out of tries are kept), keeping the full payload and the last error |
| A person must watch the dead letter | **alert when a new job arrives there**, do not wait for a customer to complain |
| It can be run again | after fixing the cause, you can re-run from the dead letter without writing a script |

**A job stuck because a worker died** needs an unlocker.
If a job's `locked_at` is older than N minutes, treat it as having nobody working on it, and unlock it so another worker picks it up.

**Job state is a state machine, not a boolean** (idea from wshobson python-background-jobs) — every mechanism in section 2 must be able to say which state a job is in: `queued → running → succeeded`, or `running → failed (attempts < cap) → queued`, or `failed → dead` · keep `attempts` · `locked_at` · `last_error` · `finished_at` with the job · move only along the arrows above (a `succeeded` job cannot go back to `running`; create a new job) · the admin screen and the dead letter read from this state in one place

---

## 5 · Scheduled jobs

> **With several instances, a scheduled job runs several times at once.**
> A summary report sent 3 times, or money charged 3 times, comes from this.

| Method | Use when |
|---|---|
| Lock in the database (advisory lock) | you can do it right away with nothing added |
| The platform scheduler calls an endpoint | on the cloud · Kubernetes CronJob |
| A scheduler that supports several instances directly | Quartz · Hangfire |

**Rules for scheduled jobs:**

- **Take the time range as a parameter**, so you can re-run missed dates without changing code
- If a run is missed, you must be able to catch up, not skip it for good
- State the time zone clearly: "every midnight" in which zone (see `i18n-and-locale`)
- **Record which runs succeeded**, do not infer it from logs

---

## 6 · Long jobs the user waits on

| Needed | Detail |
|---|---|
| Job id | return it the moment the job is accepted · the user uses it to ask about progress |
| State | `queued` · `running` · `succeeded` · `failed` · `cancelled` |
| Progress | "340 of 1,200 items done" (ทำแล้ว 340 จาก 1,200 รายการ), not a blind spinner |
| Cancellable | the job must check for a cancel signal regularly |
| Result | keep it available to download, with an expiry date |
| Notify when done | email or an in-system notification (see `notifications`) |

**Split a big job into small pieces.** For example, import 50,000 rows as sub-jobs of 500 rows each,
because a single 40-minute job that fails at minute 39 must start over from the beginning.

---

## 7 · What to measure

| Metric | Alert when |
|---|---|
| Jobs waiting in the queue | keeps growing and does not fall |
| Wait time in the queue (p95 · 95% of jobs wait no longer than this) | above what was promised |
| Failure rate | above the threshold |
| **Count in the dead letter** | **rises, even by just one** |
| Scheduled runs that did not run | a run was skipped |
| Jobs stuck in the running state for an unusual time | more than N times the normal |

> **A jammed queue is completely silent.** The API still answers 200 to every request and the health checks are all green,
> but no email has gone out for 3 hours. You see it only if you measure.

---

## 8 · Anti-patterns

- **A job that repeats its effect when run again** — the queue will certainly run it again, not maybe
- **Unlimited retry** — one broken job jams the whole queue
- **No dead letter** — jobs vanish silently and nobody knows
- **A dead letter that nobody watches** — the same as having none
- **Scheduled jobs on several instances with no lock** — they run on top of each other
- **Sending the whole data block in the payload** — send the id and let the job read it itself, so it gets the latest data too
- **A long job that cannot be cancelled** — the user clicks wrong and waits 40 minutes
- **A blind spinner that gives no progress** — the user clicks again and gets a duplicate job
- **Not measuring the queue** — it jams and you find out when a customer calls

---

## 9 · Durable workflow for agent jobs that run long or wait for human approval

An agent job that runs for tens of minutes, calls an LLM and tools many times, or pauses for approval across days cannot use a plain queue, because a failure at step 8 of 10 means starting over and paying the token cost again · use an engine that records the result of every step and resumes from the same point

| Tool | Fits | Waits for human approval | Watch out for |
|---|---|---|---|
| **Temporal** | Python and other languages · the agent loop lives in a workflow, while LLM and tool calls are activities · has `OpenAIAgentsPlugin` · `activity_as_tool` | (`ยังไม่ได้ตรวจ` · see the signal page) | the integration with the OpenAI Agents SDK is still in Public Preview |
| **AWS Step Functions** | fixed steps on AWS · fan-out with `Map` (Inline in parallel 40 · Distributed 10,000 child jobs) | `.waitForTaskToken` can wait up to 1 year until `SendTaskSuccess` / `SendTaskFailure` arrives · set `HeartbeatSeconds` to prevent a silent hang | when an LLM must choose the route, let Lambda or Bedrock decide, then use `Choice` |
| **Agent framework checkpointer** | you do not want to add an engine · LangGraph `PostgresSaver` · Microsoft Agent Framework `CheckpointManager` · OpenAI `RunState.to_json()` | LangGraph `interrupt()` · OpenAI `needs_approval` · Microsoft Agent Framework `RequestInfoExecutor` | an in-memory store is lost when the process restarts · use a database-backed store in production |

**Rules for code that must be replayable** (Temporal · Google ADK · Claude Code workflows use the same principle · checked against [Temporal: Workflow Definition](https://docs.temporal.io/workflow-definition) 2026-10-26)

- **Never read the time or draw a random value in code that controls the order of work** (`Date.now()` · `datetime.now()` · `Math.random()` · `uuid4()`) · on replay the value differs from the first run, the order drifts, and the old result cannot be reused · do anything that needs time or randomness in an activity, or use the SDK's own API for it
- **All LLM calls, tool calls, and outside reads and writes go in activities.** The result is recorded once, and replay reads the record instead of calling again.
- **The order of calls must be the same on every run** · changing the order of steps in code that still has jobs in flight makes the old jobs fail replay (Temporal calls this a nondeterminism error) · switch to the engine's versioning or patching
- **The steps before a wait point must be safe to repeat** (section 3) · LangGraph re-runs the paused node from the start on resume, so move side effects to after the wait point
- **Saved state carries no identity check** (the OpenAI docs warn about `RunState`) · load it only from a store we control
- The cap on rounds, the token budget, and stopping when there is no improvement are still needed, as for jobs in a queue · details in [`agent-systems.md`](../llm-engineering/references/agent-systems.md) section 6

Sources (opened 2026-10-26): [Temporal · OpenAI Agents SDK](https://docs.temporal.io/ai-cookbook/openai-agents-sdk-python) · [Temporal announcement](https://temporal.io/blog/announcing-openai-agents-sdk-integration) · [Step Functions integration patterns](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) · [Step Functions Map](https://docs.aws.amazon.com/step-functions/latest/dg/state-map.html) · [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) · [OpenAI human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) · [Claude Code workflows](https://code.claude.com/docs/en/workflows)


---

# skill: audit-trail

Use when a system must record who did what and when

# Audit trail

> **One rule:** a trail cannot be built after the fact.
> The day a customer asks "who changed this price", if it was not recorded beforehand, it can never be answered.

## When to use this skill

- The system has approvals, money, user permissions, or personal data
- A customer or auditor can ask "who did it, when, and what was changed from what to what"
- There was a dispute over edited data and nobody could answer
- The system falls under the Personal Data Protection Act (PDPA) or a standard that must be checkable after the fact

## When to use another skill, or together

| Job | skill | |
|---|---|---|
| Logs for technical troubleshooting | `logging-standards` | instead |
| Metrics and alerts | `observability-basics` | instead |
| Columns `created_by` `updated_at` in working tables | `database-design` | instead |
| Permissions and identity verification | `auth-implementation-patterns` | instead |
| Consent and data-subject rights | `pdpa-compliance` | instead |
| Requirements on what to keep and for how many years | `srs-writing` | together |
| Abbreviations in work that people read | `spell-out-abbreviations` | together |

---

## 1 · audit log ≠ application log

| | application log | **audit log** |
|---|---|---|
| Who reads it | developers, when troubleshooting | auditors · customers · the legal team |
| What it records | anything that helps troubleshooting | **only events with business meaning** |
| Where it is kept | files · a log collection system | **a table in the database**, or storage that cannot be overwritten |
| Lifetime | 7–90 days | **years, as the law or contract requires** |
| Can it be edited | does not matter | **never edit, never delete** |
| Can it be lost | some loss is acceptable | **cannot be lost.** If the write fails, the transaction must fail with it |

> **Always keep these 2 separate.** An audit log mixed into the general log files
> gets deleted by the log retention period within a month, and nobody finds it when it is needed.

---

## 2 · Fields every entry must have

| Field | Example | Note |
|---|---|---|
| `id` | UUIDv7 | sortable by time |
| `occurred_at` | `2026-09-25T09:42:13.482Z` | **UTC**, and the time it happened, not the time it was recorded |
| `actor_id` | `1042` | the user id, not the name, because names can change |
| `actor_type` | `user` · `system` · `api_client` | automated jobs need an identity too |
| `actor_ip` · `user_agent` | | keep only when needed for the audit |
| `action` | `order.cancelled` | **a past-tense verb**, in one style across the system |
| `entity_type` · `entity_id` | `order` · `1042` | the thing acted on |
| `changes` | `{"status":{"from":"confirmed","to":"cancelled"}}` | only the fields that changed |
| `reason` | "ลูกค้าโทรแจ้งยกเลิก" (customer phoned to cancel) | required for actions that need a reason |
| `correlation_id` | `01J9Z8…` | links back to the application log |
| `result` | `success` · `denied` | **denied attempts must be recorded too** |

> **A denied action is worth more than a successful one**, because someone trying to reach something
> they have no right to is what auditors most want to see, and it is the best warning sign there is.

---

## 3 · Which events to record

**Record:**

| Group | Examples |
|---|---|
| money and contracts | create/cancel/refund · price change · discount change |
| approvals | approve · reject · send back for fixing |
| permissions and identity | grant/revoke permission · create/close account · change password · consecutive failed logins |
| personal data | view · edit · export · delete |
| system settings | changing a value that affects the whole system |
| bulk data access | exporting a report · downloading a name list |

**Do not record:** ordinary screen views · searches · sorting · clicks that change nothing.
An audit log that records everything is worth the same as none, because nothing can be found in it.

**Name actions in one style across the system:** `<entity>.<past-tense verb>`, for example `order.cancelled` · `user.role_granted` ·
`invoice.exported` · `patient_record.viewed`

---

## 4 · How to record "what changed"

| Method | Good | Bad |
|---|---|---|
| **Record only the changed fields (from/to)** ✓ | small, readable at once | to see the whole picture you must trace back |
| Record the whole row before and after | full picture | grows very fast and risks keeping more sensitive data than needed |
| Record only that "it was edited" | smallest | **cannot answer the question**, so do not use it |

```jsonc
"changes": {
  "status":       { "from": "confirmed", "to": "cancelled" },
  "total_amount": { "from": "1250.00",   "to": "0.00" }
}
```

**For sensitive fields, record only that it changed, not the value:**

```jsonc
"changes": { "password_hash": { "changed": true } }
```

---

## 5 · Never edit after writing

- Grant the audit table only **INSERT and SELECT**. The account the app uses must have no UPDATE or DELETE permission.
- Write in the same transaction as the real data change. **If the audit write fails, the transaction must fail with it.**
- Never edit history to "tidy up". If a record is wrong, add a correction entry. Do not overwrite.
- A system that needs stronger protection should chain the entries with hashes, to prove nobody inserted or deleted anything.

**Retention** follows the law or the contract. Accounting documents in Thailand usually must be kept 5 years.
When the period ends, move them to cheap storage. Never delete them without someone's approval.

---

## 6 · Who can view, and what must not be recorded

| Topic | Rule |
|---|---|
| Read permission | only roles with an audit duty, and **reading the audit log must also be recorded in the audit** |
| Export | record every time who exported which period |
| **Must not record** | passwords · tokens · ID card numbers · health data · the content of personal data |
| Record instead | point to **which item** was viewed or edited, not the content inside |

> `patient_record.viewed` with the `entity_id` is enough. **Never copy test results into the audit log.**
> Otherwise the audit log becomes the most sensitive data store in the system, without anyone meaning it to.

---

## 7 · Show it to people

The history screen must filter by at least 4 things: **time period · actor · action type · which item**.

Show it as a sentence people can read, not raw JSON (the sample below is the Thai text shown to Thai users: on 25 Sep 2569 [B.E.; 2026] at 16:42, Somchai (sales) cancelled order SO-2026-00042, status: confirmed → cancelled, reason: customer phoned to cancel):

```
25 ก.ย. 2569 16:42  สมชาย (ฝ่ายขาย)  ยกเลิกคำสั่งซื้อ SO-2026-00042
                    สถานะ: ยืนยันแล้ว → ยกเลิก · เหตุผล: ลูกค้าโทรแจ้งยกเลิก
```

Show the time in the viewer's time zone, but store it as UTC (see `i18n-and-locale`).

---

## 8 · Anti-patterns

- **Keeping the audit in general log files**: deleted by retention within a month
- **Recording the actor's name instead of the id**: when they change their surname, the old history turns into a different person
- **Recording only successes**: the denied attempts are what auditors look for
- **Recording only "edited data"** without saying from what to what
- **The app has UPDATE permission on the audit table**: a trail that can be edited is not a trail
- **Writing the audit outside the transaction**: the transaction succeeds but there is no record
- **Recording every click**: the important entries sink in a pile of data nobody uses
- **Copying sensitive data into the audit**: it creates a new leak by accident
- **No screen to view it**: the data exists, but a developer must run a query every time a customer asks


---

# skill: file-upload-and-storage

Use when users upload files or an app serves stored files

# Accepting file uploads and storing files

> **One rule:** a file a user sends is untrusted data.
> The file name, the extension, the type the browser reports, and the size it claims can **all be faked**.

## When to use this skill

- A screen lets users attach files, images, or documents.
- The system must store files and send them back for viewing or download.
- You must decide where to keep the files.
- Some files should be hidden from others, but right now anyone with the link can open them.

## When to use another skill instead, or together

| Task | Skill | |
|---|---|---|
| Import Excel/CSV and load the data into the system | `data-import-export` | instead |
| Permissions: who may access what | `auth-implementation-patterns` | instead |
| Process large files as a background job | `background-jobs` | instead |
| The file metadata table | `database-design` | together |
| Upload endpoints and errors | `api-conventions` · `web-service-essentials` | together |
| Retention of files that hold personal data | `pdpa-compliance` | together |
| Storage used and alerts | `observability-basics` | together |
| Abbreviations in anything a person reads | `spell-out-abbreviations` | together |

---

## 1 · Check before accepting

| What to check | How |
|---|---|
| **File type** | Read the **contents** (magic bytes). Do not trust the extension or `Content-Type`. |
| **Size** | Enforce it on the server **and** at the front-facing request receiver. A check in the browser is only a convenience. |
| Files per request | Set a limit. |
| Total size per user | Set a quota, or one person uses up all the space. |
| Allowed types | **An allow list, not a deny list.** |

```
Typical allow list: jpg · png · webp · pdf · xlsx · docx · csv
Always forbidden: executables (exe, sh, bat) · server script files (php, aspx, jsp) · svg that has not been sanitised
```

> **SVG is HTML.** It can run scripts. To accept it, sanitise it first or convert it to PNG.
>
> **Check the size before reading the file into memory.** Otherwise a 5 GB file kills the server
> before the size-check code gets to run.

**Virus-scan** any file that other people will download. While the scan result is pending, set the status to `pending`
and give nobody access.

---

## 2 · Where to store

| Store | Good for | Note |
|---|---|---|
| **object storage** (S3 · Azure Blob · GCS) | The default to use | Scales · has expiring links built in |
| The server's disk | A small, single-machine system | **Must sit outside the folder the web serves**, and must be backed up |
| In the database | Very small files that must be in the same transaction | Grows fast · backups get much slower |

> Wrong: **keeping files in the app's folder.** They vanish on every deploy, and with several instances they cannot see each other.
> Wrong: **keeping files directly in the folder the web serves.** Someone uploads a script file and runs it.

**The database holds only metadata; the file itself lives elsewhere.** The metadata table needs the columns
`id` · `original_name` · `stored_key` · `content_type` · `size_bytes` · `checksum` ·
`uploaded_by` · `uploaded_at` · `scan_status` · `owner_entity_type` · `owner_entity_id`

---

## 3 · Naming the stored file

**Never use the file name the user sent as the real stored name.**

```
Wrong: uploads/รายงาน (1).xlsx              spaces · Thai · brackets
Wrong: uploads/../../etc/passwd             escapes the folder
Right: 2026/09/25/01J9Z8K7X2M4.xlsx         random · split into folders by date
```

- The real stored name is a random value (UUIDv7 or ULID) + an extension that you have **verified**.
- Keep the user's original name in the database, and send it back on download through a header.
- Split folders by date. One folder with millions of files is slow and cannot be browsed.
- Store a checksum too. It detects duplicates and checks the file is not corrupted.

---

## 4 · Sending files back to the user

| File | How to send |
|---|---|
| Public (logo, product image) | A direct URL through a CDN is fine |
| **Private** (document, receipt, user photo) | **A signed link that expires** in 5–15 minutes |

> **A "hard-to-guess link" is not access control.** Links get forwarded, logged by proxies,
> and left in the `Referer` header. For a private file, **check permission every time**, then issue a temporary link.

- For large files, let the user upload straight to object storage with a link we sign, so the file does not pass through the app.
  **The checks in §1 are still all required.** This route bypasses the app, so restore the checks like this:
  - **When signing the link:** limit size and type inside the signature. S3 uses a presigned POST whose policy has `content-length-range` and a `Content-Type` condition (a presigned PUT cannot enforce size). Other providers have equivalents, for example GCS uses the header `x-goog-content-length-range`.
  - **When signing the link:** set the key yourself (a random name as in §3) in a holding folder · keep the link's expiry short · save a metadata row with `scan_status = pending`.
  - **After the upload finishes** (a storage event, or the user reports it done): read the real magic bytes from the object · compare the real size with the limit · virus-scan. If it passes, move it to the real store and set `clean`. If it fails, delete or quarantine it.
  - While `pending`, issue no download link to anyone.
- When serving a file for download, set `Content-Disposition` and `Content-Type` correctly,
  and never send back user-uploaded HTML in a way that lets the browser render it.
- If you can, serve user files from a different domain than the app, so scripts in a file cannot reach the app's cookies.

---

## 5 · Images

- **Never send the original camera image to the screen.** An 8 MB photo on a phone is a page that does not load.
- Pre-generate 2–3 sizes (thumbnail · medium · a downsized full size).
- **Strip EXIF.** The photo holds the location where it was taken, and users do not know they are publishing it.
- Convert to WebP if the browser supports it.
- Rotate the image according to EXIF before you strip EXIF, or phone photos come out sideways.
- If the file is large or there are many, resize as a background job (see `background-jobs`).

---

## 6 · Deleting and retention

| Topic | Rule |
|---|---|
| Deleting the parent record | A job must also hunt down and delete the orphan files left behind. |
| Order of deletion | Delete the metadata first, then the file. An orphan file is harmless, but metadata pointing to a file that is gone breaks the screen. |
| An uploaded file never linked to anything | Delete it after 24 hours. |
| Retention | Set it per file type · a file with personal data needs an expiry date (see `pdpa-compliance`). |
| Backup | Files belong in the backup plan just like the database, **and a restore must have been tested for real.** |

---

## 7 · Anti-patterns

- **Trusting the file extension.** Anyone can rename a file to `.jpg`.
- **Checking size only in the browser.** It is bypassed in 3 seconds.
- **Using the user's file name as the real path.** `../` leads anywhere.
- **Keeping files in the folder the web serves.** Someone uploads a script and runs it.
- **A "hard-to-guess link" instead of a permission check.**
- **Accepting SVG without sanitising it.** The script runs in other people's browsers.
- **Sending an 8 MB original image to a phone.**
- **Not stripping EXIF.** The coordinates of the user's home leak out and nobody meant it to.
- **Files outside the backup plan.** The database can be restored, but every document is gone.
- **Reading the whole file into memory.** A large file kills the process.


---

# skill: notifications

Use when a system sends email, SMS, LINE or push

# User notifications

> **One rule:** users stop reading everything if they receive enough that they did not need to read.
> Every message sent beyond what is necessary makes the necessary messages get ignored too.
> For Thai text in templates → `human-writing` `references/thai-grammar.md` section 4, register "screen"

## When to use this skill

- The system must send email, SMS, LINE push or in-app notifications
- Users complain of getting duplicates, getting too many, or getting none
- You must build a settings page for which notifications to receive
- Important email lands in spam

## When **not** to use it

| Task | Use this instead |
|---|---|
| Alerting the team when the system has a problem | `observability-basics` |
| Queue mechanics and retries | `background-jobs` |
| Multi-language messages | `i18n-and-locale` |
| Marketing consent | `pdpa-compliance` |

---

## 1 · Choose the channel by urgency, not by habit

| Channel | Good for | Limits |
|---|---|---|
| **In-app** | Everything — a permanent record that can be looked back at | Seen only when the user opens the app |
| **Email** | Receipts, summaries, attachments, things to keep | Slow · can land in spam |
| **push** | Things the user must know now | Can be turned off · lost if not tapped |
| **LINE** | Thailand · general customers · high open rate | Cost per message · provider rules apply |
| **SMS** | Verification codes · urgent things that must arrive | Most expensive · 70 characters if Thai |

> **Thai SMS holds only 70 characters per message** (not 160 as in English).
> Anything longer is split into several messages and billed for every part, so always count the length before sending.

**One matter goes on one channel** — unless it is something that truly cannot be missed.
Let the user choose which channel they want (section 5).

---

## 2 · Message templates live outside the code

```
templates/
  order-confirmed/
    th.subject.txt  th.html  th.txt
    en.subject.txt  en.html  en.txt
```

| Rule | Reason |
|---|---|
| **Never build messages by string concatenation in code** | Every wording change would need a new deploy |
| Variables are named | Use names like `{{customerName}}`, not positions |
| Email needs both HTML and plain text | Spam filters lower the score of HTML-only email |
| One file per language | See `i18n-and-locale` |
| **Test with real values before sending** | A leaked `สวัสดีคุณ {{name}}` damages the brand |

**Every message needs 3 things** — what happened · which item it concerns (with a reference number) · what to do next (a single button)

---

## 3 · Always send as a background job

> **A failed email must not make the order fail.**
> Separate them with a queue — the transaction is saved first, then the message enters the send queue (see `background-jobs`)

| Topic | Rule |
|---|---|
| Enqueue after the transaction succeeds | Not during the transaction, because if it rolls back later the email has already gone out |
| retry | 3 times, doubling the wait each round, then move to the dead letter queue (a queue that holds jobs that failed to send) |
| **Prevent duplicate sends** | Use a unique key `(type, entity_id, event_id, recipient)` — `event_id` is the id of the event or version of the change (for example, the 2nd status of the same order must be sendable). Do not just hope nobody calls twice |
| Urgent messages (OTP codes) | Use a separate queue so they do not wait behind 5,000 monthly summary emails |

**Prevent a flood** — set a per-user ceiling per hour, and merge frequent events of the same kind
into one message ("มี 12 รายการใหม่", not 12 messages).

---

## 4 · What must never go in a message

| Never | Put this instead |
|---|---|
| Passwords | A reset link that expires |
| Full card numbers · national ID numbers | The last 4 digits |
| Health data, test results | "มีผลตรวจใหม่ กรุณาเข้าระบบเพื่อดู" |
| Attachments with sensitive data | A link that requires login first |
| Links reachable without identity verification | A short-lived link that checks permission |

> **Treat email as a postcard** — it passes through many systems, sits in a mailbox on a device that may not be theirs,
> and can be found forever.

**Links in email must be on our own domain** — shortened links make users unable to tell them from scam email.

---

## 5 · Let users choose

| Type | Can it be turned off? |
|---|---|
| Transactional (receipts · verification codes · security notices) | ✗ cannot be turned off |
| Action (order status · someone replied) | ✓ the channel can be chosen |
| Periodic summary | ✓ the frequency can be chosen |
| Marketing | ✓ **consent must be obtained before sending** (see `pdpa-compliance`) |

- Settings table: `user_id` · `notification_type` · `channel` · `enabled`
- **Every non-transactional message must have an unsubscribe link**, and it must take effect within 24 hours (our own internal target, stricter than the 2 days that Gmail and Yahoo set)
- **High-volume marketing email** must also carry a one-click unsubscribe header: `List-Unsubscribe: <https://...>` (an HTTPS URL) together with `List-Unsubscribe-Post: List-Unsubscribe=One-Click` per the RFC 8058 standard, and the email must pass SPF + DKIM (Gmail applies this to senders above about 5,000 messages per day · it applies to marketing email, not transactional · without it the email is more likely to land in spam) — sources: support.google.com/a/answer/14229414 · senders.yahooinc.com/best-practices checked 22 Oct 2026 (B.E. 2569)
- Unsubscribing must work without logging in — use a token in the link
- Respect "quiet hours" — never send non-urgent push or SMS at 2 a.m. (by the recipient's time zone)

---

## 6 · Track delivery

| Status | Meaning |
|---|---|
| `queued` · `sent` | Entered the queue · left our system |
| `delivered` | The destination accepted it |
| `bounced` | Did not arrive — **separate hard (the address does not exist) from soft (mailbox full)** |
| `failed` | Could not be sent |

- **Stop sending to an address immediately after a hard bounce** — continuing gets our domain blacklisted
- Keep a send log to answer "why didn't the customer get it" — who, which channel, when, what result
- Email that must arrive needs **SPF · DKIM · DMARC** all set, or it lands in spam with no warning at all
- Measure: delivery success rate · bounce rate · queue backlog (see `observability-basics`)

---

## 7 · Anti-patterns

- **Sending the message in the same request as the transaction** — the email provider is slow and the screen hangs
- **Sending before commit** — rolled back, but the customer already got the email
- **Messages in code** — every wording change needs a new deploy
- **No duplicate prevention** — the customer gets 5 receipts
- **Sending on every channel at once** — the user turns everything off within a week
- **No unsubscribe link** — the user clicks "this is spam" instead and our domain loses reputation
- **Putting sensitive data in the message body**
- **Continuing to send to a hard bounce** — the domain gets blacklisted
- **Not counting the length of Thai SMS** — costs balloon without anyone noticing
- **No send log** — you cannot tell the customer whether it was sent

---

## 8 · Abbreviations

- **OTP** — One-Time Password
- **RFC** — Request for Comments (internet standards documents) · RFC 8058 = the standard for the one-click unsubscribe header
- **push notification** — a notification that pops up on the user's device
- **bounce** — an email that did not arrive and was returned
- **SPF · DKIM · DMARC** — standards that prove an email was really sent from that domain
- **opt-in / opt-out** — asking to receive / asking to stop receiving
- **LINE Official Account** — a business's official account on LINE, used to send messages to customers

## 9 · Link to other skills

| Need | Use together with |
|---|---|
| Retry queue and dead letter | `background-jobs` |
| Multi-language messages | `i18n-and-locale` |
| Marketing consent | `pdpa-compliance` |
| Settings table and send log | `database-design` |
| Delivery success rate metrics | `observability-basics` |
| Attachments and expiring links | `file-upload-and-storage` |
| Alerting the team when the system has a problem | `observability-basics` · `incident-runbook-template` |
| Broadcast to LINE OA friends (quota · target group · frequency) | `e-commerce:line-broadcast` (if installed) |
