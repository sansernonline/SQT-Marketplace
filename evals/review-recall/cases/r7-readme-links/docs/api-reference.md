# รายการ endpoint

ทุก endpoint ต้องส่ง header `Authorization: Bearer <token>` และวันที่ใช้รูปแบบ `YYYY-MM-DD`

| วิธี | path | ทำอะไร |
|---|---|---|
| GET | `/leaves?employeeId=E1024` | ใบลาของพนักงาน 1 คน |
| POST | `/leaves` | ยื่นใบลาใหม่ |
| POST | `/leaves/{id}/approve` | หัวหน้าอนุมัติ |

ตัวอย่างยื่นใบลา:

```json
{ "employeeId": "E1024", "type": "sick", "from": "2026-11-02", "to": "2026-11-03" }
```

กลับไป [README](../README.md)
