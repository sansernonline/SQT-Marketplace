# Warehouse modeling — ELT, stack, star schema, SCD

สำหรับคลังข้อมูลเพื่อวิเคราะห์ (analytics warehouse) ไม่ใช่ฐานข้อมูลของแอป — ย้ายมาจาก agent `data-engineer` (2026-10-14)

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
