# แม่แบบแผน deploy

ย้ายมาจาก agent `devops-engineer` · เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

## Standard Output: Polished Deployment Plan

```markdown
# 🚀 Deployment Plan: <Release vX.Y.Z>

| | |
|--|--|
| **Release** | vX.Y.Z |
| **Type** | 🟢 Routine \| 🟡 Major \| 🔴 Hotfix |
| **Status** | 🟡 Planned |
| **Deploy Lead** | @name |
| **Maintenance Window** | YYYY-MM-DD HH:MM-HH:MM UTC |
| **Expected Downtime** | ⚡ Zero / ⏸️ 5 min |

---

## 📋 Pre-Deployment Checklist

| # | Item | Owner | Status |
|:-:|------|:------|:------:|
| 1 | All tests passing in CI | @dev | ✅ |
| 2 | Security scan passed | @security | ✅ |
| 3 | Database migrations reviewed | @dba | ⚪ |
| 4 | Rollback plan documented | @devops | ⚪ |
| 5 | Stakeholders notified | @pm | ⚪ |
| 6 | On-call engineer briefed | @oncall | ⚪ |
| 7 | Status page prepared | @devops | ⚪ |

## 🔄 Deployment Flow

\`\`\`mermaid
flowchart TD
    A[Tag release vX.Y.Z] --> B[Run final CI]
    B --> C{All green?}
    C -->|No| D[Abort + Investigate]
    C -->|Yes| E[Deploy to canary 5%]
    E --> F{Healthy after 10min?}
    F -->|No| G[🔄 Rollback]
    F -->|Yes| H[Deploy to 50%]
    H --> I{Healthy?}
    I -->|No| G
    I -->|Yes| J[Deploy to 100%]
    J --> K[Smoke tests]
    K --> L([Done ✅])
\`\`\`

## 📝 Deployment Steps

| Step | Action | Command/Link | Owner |
|:----:|--------|--------------|:------|
| 1 | Tag release | `git tag vX.Y.Z && git push --tags` | @devops |
| 2 | Trigger CD pipeline | [Pipeline link](#) | @devops |
| 3 | Deploy canary | Auto via pipeline | — |
| 4 | Monitor canary | [Grafana](#) | @oncall |
| 5 | Approve full deploy | Slack `/deploy approve` | @lead |
| 6 | Verify production | Smoke test suite | @qa |

## ✅ Verification

### Health Checks
- [ ] `/health` returns 200
- [ ] All pods/instances running
- [ ] Database connections OK
- [ ] No spike in 5xx errors (Grafana dashboard X)

### Smoke Tests
- [ ] User login works
- [ ] Critical user journey #1 works
- [ ] Critical API endpoints return expected response

### Key Metrics (15 min post-deploy)
| Metric | Baseline | Threshold | Current |
|--------|---------:|----------:|--------:|
| ⚡ p95 latency | 150ms | < 200ms | — |
| 🐛 Error rate | 0.1% | < 0.5% | — |
| 📊 Throughput | 1000 RPS | > 800 RPS | — |

## 🔄 Rollback Plan

> ⚠️ **Triggers:** Any of the following requires immediate rollback
> - 5xx error rate > 2% sustained for 5 min
> - p95 latency > 500ms sustained for 5 min
> - Customer-impacting bug confirmed

### Rollback Steps
1. Run: `./scripts/rollback.sh vX.Y.Z-1`
2. Verify health checks
3. Post in #incidents channel
4. Schedule post-mortem within 48h

## 📢 Post-Deployment

- 📊 Monitor for 1 hour post-deploy
- 📝 Update changelog with release notes
- 📨 Send announcement to #releases
- ✅ Close release ticket
```
