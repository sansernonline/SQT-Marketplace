# ตั้งเครื่องแบบละเอียด

## ค่าใน .env

| ชื่อ | ตัวอย่าง | ใช้ทำอะไร |
|---|---|---|
| `DATABASE_URL` | `postgres://leave:leave@localhost:5432/leave` | ฐานข้อมูลบนเครื่องจาก `docker compose` |
| `JWT_ISSUER` | `https://login.squaretech.example` | ผู้ออก token ที่ระบบยอมรับ |

## ปัญหาที่เจอบ่อย

- `ECONNREFUSED 5432` แปลว่าฐานข้อมูลยังไม่ขึ้น รัน `docker compose up -d db` แล้วรอ 10 วินาที
- พอร์ต 3000 มีโปรแกรมอื่นใช้อยู่ ให้ตั้ง `PORT=3001` ใน `.env`

กลับไป [README](../README.md)
