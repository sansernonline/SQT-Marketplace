# playbook · line-oa — ตั้งและดูแล LINE Official Account

ใช้เมื่อ: สร้าง LINE OA · เปิด Messaging API · ทำ chatbot · rich menu · broadcast
skill หลัก: `line-oa-setup` · `line-chatbot` · `line-richmenu` · `line-broadcast` · agent `line-admin`

## ขั้นตอน (คัดลง todo ตรงตัว)

1. ตรวจแพ็กเกจและโควตาข้อความของบัญชีจากหน้าทางการของ LINE
2. ตั้ง channel และ webhook ตาม `line-oa-setup` — ตรวจลายเซ็น X-Line-Signature และเก็บค่าลับไว้ในไฟล์ตั้งค่าที่ผู้ใช้ใส่เอง
3. chatbot — จัดกลุ่มคำถามจริงของลูกค้าตามเจตนา (intent) แล้วตอบจากฐานความรู้ ถ้าไม่มั่นใจให้ส่งต่อให้พนักงาน และไม่แต่งราคาหรือสต็อก
4. rich menu — ทำขนาดภาพและพื้นที่กดตาม `line-richmenu`
5. ทดสอบ echo หรือข้อความทดสอบกับบัญชีทดสอบ
6. broadcast — คำนวณโควตาก่อนส่ง ส่วนการส่งจริงต้องรออนุมัติ

## จบเมื่อ

ข้อความทดสอบผ่านจริง ค่าลับไม่อยู่ในโค้ดหรือแชต และโควตาคำนวณแล้ว
