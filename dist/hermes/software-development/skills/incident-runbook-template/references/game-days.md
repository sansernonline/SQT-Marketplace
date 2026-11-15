# Game Days

รายการตรวจของการซ้อมรับมือเหตุขัดข้องเพื่อทดสอบ runbook ใช้ตอนวางแผนซ้อมรายไตรมาส

Test runbooks by faking failures on purpose:

```markdown
## Game Day Checklist

Quarterly:
- [ ] Pick a runbook to test
- [ ] Simulate the failure in staging (chaos engineering)
- [ ] On-call engineer follows runbook
- [ ] Identify gaps
- [ ] Update runbook based on learnings
- [ ] Repeat with different runbook next quarter
```
