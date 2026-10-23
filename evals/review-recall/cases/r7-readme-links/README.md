# leave-api

บริการ API ของระบบลางานออนไลน์ แอปมือถือและหน้าเว็บของฝ่ายบุคคลเรียกใช้ร่วมกัน

## เริ่มบนเครื่องตัวเอง

ต้องมี Node 22 และ Docker Desktop

```bash
git clone https://git.squaretech.example/hr/leave-api.git
cd leave-api
cp .env.example .env
docker compose up -d db
npm install
npm run dev
```

เปิด http://localhost:3000/health ต้องเห็น `{"status":"ok"}`

## เอกสาร

- [ตั้งเครื่องแบบละเอียดและปัญหาที่เจอบ่อย](docs/setup.md)
- [รายการ endpoint พร้อมตัวอย่างคำขอ](docs/api.md)

## ติดต่อ

ทีม HR Platform ช่อง #hr-platform ใน Slack
