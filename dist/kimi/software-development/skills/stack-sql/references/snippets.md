# Short code examples — Thai time · dynamic SQL

The rules are in `SKILL.md` items 2 and 7

## Convert UTC to Thai time when displaying (item 2)

```sql
-- Convert UTC time to Thai time when displaying
SELECT created_at AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'  -- SQL Server (Windows-style zone name)
FROM dbo.orders;
SELECT created_at AT TIME ZONE 'Asia/Bangkok' FROM orders;                  -- PostgreSQL (timestamptz column)
```

## Dynamic SQL that passes values as parameters (item 7)

```sql
-- SQL Server
EXEC sp_executesql N'SELECT id, name FROM dbo.customers WHERE email = @email',
                   N'@email nvarchar(320)', @email = @input;
-- Column name: QUOTENAME(@column) after checking against an allowlist
-- PostgreSQL in plpgsql
EXECUTE format('SELECT id, name FROM %I WHERE email = $1', tbl) USING p_email;
```

## Check whether a Thai collation exists (item 2)

- PostgreSQL has `th-TH-x-icu` when the server is built with International Components for Unicode (ICU). Check with `SELECT collname FROM pg_collation WHERE collname LIKE 'th%'`
- For MySQL, check which Thai collations exist with `SHOW COLLATION LIKE '%thai%'` before choosing
