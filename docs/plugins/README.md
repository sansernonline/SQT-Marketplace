<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# รูปของทุก plugin

รูปทั้งหมดสร้างจากไฟล์จริงใน `plugins/` ด้วย `scripts/diagrams/` · แก้ plugin แล้วสร้างใหม่ได้ (ดู [scripts/README.md](../../scripts/README.md) หัวข้อ 6)

## ภาพรวม

![ภาพรวม marketplace](marketplace-overview.png)

## hook ทำงานอย่างไร

![hook](hook-lifecycle.png)

## แต่ละ plugin

แต่ละโฟลเดอร์มี `map.png` แผนผัง plugin · `flow/` วิธีทำงานของ SuperUser เป็นชุดรูปเรียงขั้น · `playbooks/` playbook ละ 1 รูป

| plugin | ทำอะไร | รูป |
|---|---|---|
| [`superuser` (แกนกลาง)](superuser/README.md) | ทีมผู้ช่วยทำงานหลายขั้นให้จบพร้อมตรวจ | [แผนผัง](superuser/map.png) · flow 6 รูป · playbook 7 รูป |
| [`e-commerce`](e-commerce/README.md) | ขายออนไลน์ ซื้ออย่างมั่นใจ และงานหลังบ้านบริษัทไทย | [แผนผัง](e-commerce/map.png) · flow 6 รูป · playbook 16 รูป |
| [`graphic-design`](graphic-design/README.md) | ทำโลโก้ แบรนด์ โพสต์ และคลิปให้หน้าตาเป็นชุดเดียวกัน | [แผนผัง](graphic-design/map.png) · flow 6 รูป · playbook 7 รูป |
| [`personal-life`](personal-life/README.md) | จัดการงานธุระ เอกสาร ประชุม เป้าหมาย บ้าน สุขภาพ อาชีพ และการเรียนรู้ | [แผนผัง](personal-life/map.png) · flow 6 รูป · playbook 28 รูป |
| [`software-company`](software-company/README.md) | ทีมซอฟต์แวร์ครบชุด ตั้งแต่โจทย์จนส่งมอบ | [แผนผัง](software-company/map.png) · flow 6 รูป · playbook 15 รูป |
| [`trading-finance`](trading-finance/README.md) | วางแผนเงิน ดูพอร์ต และเทรดอย่างมีวินัย ไม่ชี้นำ | [แผนผัง](trading-finance/map.png) · flow 6 รูป · playbook 8 รูป |

## สีในรูป

| สี | หมายถึง |
|---|---|
| สีประจำ plugin | ตรา · เลขขั้น · เส้นทางหลักของ plugin นั้น |
| วงม่วง | ผู้ใช้ · ทางเข้าของงาน |
| วงกรมท่า | หัวหน้าทีม · ของกลางจาก superuser |
| วงฟ้า · วงเขียวอมฟ้า | agent · skill |
| วงกลวงขอบส้ม | ขั้นที่หยุดรอผู้ใช้อนุมัติ หรือผู้ใช้ต้องกดเอง |
