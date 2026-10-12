# Runbook Index และการผูก runbook กับ alert

ตัวอย่างหน้ารวม runbook และตัวอย่างการใส่ลิงก์ runbook ลงใน alert ใช้ตอนตั้งระบบ runbook ของทีมครั้งแรก

## Runbook Index Pattern

Maintain a central index (`docs/runbook-index.md`). Each runbook is one file `docs/runbook-<service>-<เรื่อง>.md` per `document-naming`:

```markdown
# 📚 Runbook Index

## By Service
- API Service
  - [High error rate](runbook-api-high-error-rate.md)
  - [Memory leak](runbook-api-memory-leak.md)
- Database
  - [Connection pool exhausted](runbook-db-conn-pool.md)
  - [Replication lag](runbook-db-repl-lag.md)

## By Alert Name
| Alert | Runbook |
|-------|---------|
| `api_5xx_rate_high` | [API: High error rate](link) |
| `db_connections_high` | [DB: Connection pool](link) |
| `disk_full_warn` | [Generic: Disk full](link) |

## Most Common Incidents (last 90 days)
1. High error rate on payment service — [runbook](link) (12 times)
2. DB replication lag — [runbook](link) (8 times)
3. Cache invalidation storm — [runbook](link) (5 times)
```

## Linking Runbook to Alert

Every alert MUST link to a runbook:

```yaml
# Prometheus AlertManager
- alert: APIHighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  annotations:
    summary: "API error rate > 5%"
    runbook: "https://runbooks.example.com/api/high-error-rate"
    dashboard: "https://grafana.example.com/d/api-overview"
```
