<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# e-commerce

ซื้อ-ขายออนไลน์ทั้งสองฝั่ง ขายบน Shopee Lazada TikTok และซื้ออย่างรู้สิทธิ์

agent 4 · skill 45 · คำสั่ง 6 · playbook 12 · ส่งงานต่อให้ [`graphic-design`](../graphic-design/README.md) · [`thai-workplace`](../thai-workplace/README.md) · [`software-company`](../software-company/README.md) · [`superuser`](../superuser/README.md) · [`personal-life`](../personal-life/README.md) · [`trading-finance`](../trading-finance/README.md)

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/e-commerce/`](../../../plugins/e-commerce/)

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
| `buy-decision` | ตัดสินใจซื้อของ | 6 |
| `complaint` | ร้องเรียนร้านค้า | 6 |
| `customer-issue` | แก้ปัญหาลูกค้าและรีวิว | 5 |
| `learn-from-session` | เรียนรู้จากงานที่ทำ (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 7 |
| `live-session` | วางแผนไลฟ์ขาย | 4 |
| `new-product` | ลงสินค้าใหม่ | 6 |
| `pricing-check` | ตรวจราคาและกำไร | 5 |
| `refund` | ขอคืนเงิน | 5 |
| `review` | ตรวจงานที่เสร็จแล้ว | 6 |
| `stock-sync` | ซิงก์สต็อกหลายร้าน | 5 |
| `unattended-run` | งานยาวไม่ต้องเฝ้า | 7 |
| `warranty-claim` | เคลมและติดตามประกัน | 5 |
