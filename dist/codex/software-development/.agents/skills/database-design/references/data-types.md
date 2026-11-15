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
