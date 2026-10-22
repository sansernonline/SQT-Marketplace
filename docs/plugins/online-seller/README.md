<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# online-seller

ตั้งราคา ลงสินค้า ตอบแชต และคุมสต็อกหลายร้านให้ไม่พลาด

agent 3 · skill 51 · คำสั่ง 4 · playbook 8 · ส่งงานต่อให้ [`graphic-design`](../graphic-design/README.md) · [`thai-workplace`](../thai-workplace/README.md) · [`software-company`](../software-company/README.md)

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/online-seller/`](../../../plugins/online-seller/)

## SuperUser ทำงานอย่างไร

หัวหน้าทีมรับงาน → เลือก playbook → แจกงานทีละขั้น → ตรวจก่อนตัดสินใจ → ส่งผล → เรียนรู้

![SuperUser ทำงานอย่างไร](flow.png)

## แผนผัง plugin

มี agent ไหน ใช้ skill อะไร มีคำสั่งอะไร และส่งงานต่อให้ plugin ไหน

![แผนผัง plugin](map.png)

## ขั้นตอนของ playbook

แต่ละ playbook ทำกี่ขั้น ใครทำขั้นไหน ใช้ skill ไหน ตรงไหนรอผู้ใช้

![ขั้นตอนของ playbook](playbooks.png)

## playbook ทั้งหมด

| playbook | ทำอะไร | ขั้น |
|---|---|---|
| `customer-issue` | แก้ปัญหาลูกค้าและรีวิว | 5 |
| `learn-from-session` | เรียนรู้จากงานที่ทำ (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 7 |
| `live-session` | วางแผนไลฟ์ขาย | 4 |
| `new-product` | ลงสินค้าใหม่ | 6 |
| `pricing-check` | ตรวจราคาและกำไร | 5 |
| `review` | ตรวจงานที่เสร็จแล้ว | 6 |
| `stock-sync` | ซิงก์สต็อกหลายร้าน | 5 |
| `unattended-run` | งานยาวไม่ต้องเฝ้า | 7 |
