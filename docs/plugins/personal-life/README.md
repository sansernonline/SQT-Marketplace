<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# personal-life

จัดการงานธุระ เอกสาร ประชุม เป้าหมาย บ้าน สุขภาพ อาชีพ และการเรียนรู้

agent 9 · skill 72 · คำสั่ง 16 · playbook 30 · ส่งงานต่อให้ [`superuser`](../superuser/README.md) · [`software-company`](../software-company/README.md) · [`trading-finance`](../trading-finance/README.md) · [`e-commerce`](../e-commerce/README.md) · [`thai-workplace`](../thai-workplace/README.md) · [`graphic-design`](../graphic-design/README.md)

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/personal-life/`](../../../plugins/personal-life/)

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
| `bills` | ไล่ดูบิลค่าน้ำค่าไฟ | 5 |
| `care-setup` | ตั้งระบบดูแลผู้สูงอายุ | 4 |
| `cert-prep` | เตรียมสอบใบรับรอง | 5 |
| `checkup-cycle` | วางแผนตรวจสุขภาพปีนี้ | 5 |
| `decide-and-goals` | ตัดสินใจและตั้งเป้า | 4 |
| `digital-safety` | ความปลอดภัยออนไลน์ | 5 |
| `doctor-visit` | เตรียมตัวไปหาหมอ | 5 |
| `documents` | จัดเอกสารสำคัญ | 4 |
| `family-week` | วางสัปดาห์ของครอบครัว | 4 |
| `habit-tracking` | ติดตามนอนและออกกำลัง | 4 |
| `interview` | เตรียมสัมภาษณ์ | 6 |
| `job-application` | สมัครงาน | 8 |
| `learn-from-session` | เรียนรู้จากงานที่ผ่านมา (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 7 |
| `learning-path` | วางเส้นทางเรียน | 5 |
| `maintenance` | วางแผนซ่อมบำรุงบ้าน | 5 |
| `medication-routine` | จัดตารางกินยา | 6 |
| `meeting` | เตรียมและสรุปประชุม | 4 |
| `offer-negotiation` | ต่อรองข้อเสนองาน | 6 |
| `paper-to-practice` | จากบทความสู่โค้ดจริง | 5 |
| `profile-refresh` | ปรับ CV และโปรไฟล์ | 5 |
| `promotion-case` | เตรียมขอขึ้นตำแหน่ง | 5 |
| `review` | ตรวจงานก่อนส่ง | 6 |
| `side-project` | เลือกโปรเจกต์ฝึกมือ | 4 |
| `subscriptions` | ตรวจค่าสมาชิกรายเดือน | 5 |
| `team-project` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 9 |
| `tech-radar` | ตามข่าวเทคโนโลยี | 5 |
| `trip` | เตรียมเที่ยว | 4 |
| `unattended-run` | ให้ทำงานยาวเอง | 7 |
| `vehicle` | ต่อภาษีและประกันรถ | 4 |
| `weekly-reset` | รีเซ็ตประจำสัปดาห์ | 5 |
