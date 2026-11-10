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
