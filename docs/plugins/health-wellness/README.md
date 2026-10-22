<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# health-wellness

จัดเรื่องสุขภาพของตัวเองและครอบครัวให้เป็นระเบียบ

agent 1 · skill 48 · คำสั่ง 2 · playbook 7 · ส่งงานต่อให้ [`home-family`](../home-family/README.md) · [`trading-finance`](../trading-finance/README.md) · [`personal-life`](../personal-life/README.md)

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/health-wellness/`](../../../plugins/health-wellness/)

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
| `checkup-cycle` | วางแผนตรวจสุขภาพปีนี้ | 5 |
| `doctor-visit` | เตรียมตัวไปหาหมอ | 5 |
| `habit-tracking` | ติดตามนอนและออกกำลัง | 4 |
| `learn-from-session` | เรียนรู้จากงานที่ทำ (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 7 |
| `medication-routine` | จัดตารางกินยา | 6 |
| `review` | ตรวจงานที่เสร็จแล้ว | 6 |
| `unattended-run` | งานยาวไม่ต้องเฝ้า | 7 |
