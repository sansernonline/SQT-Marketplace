<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# รูปของทุก plugin

รูปทั้งหมดสร้างจากไฟล์จริงใน `plugins/` ด้วย `scripts/diagrams/` · แก้ plugin แล้วสร้างใหม่ได้ (ดู [scripts/README.md](../../scripts/README.md) หัวข้อ 6)

## ภาพรวม

![ภาพรวม marketplace](marketplace-overview.png)

## hook ทำงานอย่างไร

![hook](hook-lifecycle.png)

## แต่ละ plugin

แต่ละโฟลเดอร์มี 3 รูป: `flow.png` วิธีทำงานของ SuperUser · `map.png` แผนผัง plugin · `playbooks.png` ขั้นตอนของ playbook

| plugin | ทำอะไร | รูป |
|---|---|---|
| [`superuser` (แกนกลาง)](superuser/README.md) | ทีมผู้ช่วยทำงานหลายขั้นให้จบพร้อมตรวจ | [flow](superuser/flow.png) · [map](superuser/map.png) · [playbooks](superuser/playbooks.png) |
| [`e-commerce`](e-commerce/README.md) | ขายออนไลน์ ซื้ออย่างมั่นใจ และงานหลังบ้านบริษัทไทย | [flow](e-commerce/flow.png) · [map](e-commerce/map.png) · [playbooks](e-commerce/playbooks.png) |
| [`graphic-design`](graphic-design/README.md) | ทำโลโก้ แบรนด์ โพสต์ และคลิปให้หน้าตาเป็นชุดเดียวกัน | [flow](graphic-design/flow.png) · [map](graphic-design/map.png) · [playbooks](graphic-design/playbooks.png) |
| [`personal-life`](personal-life/README.md) | จัดการงานธุระ เอกสาร ประชุม เป้าหมาย บ้าน สุขภาพ อาชีพ และการเรียนรู้ | [flow](personal-life/flow.png) · [map](personal-life/map.png) · [playbooks](personal-life/playbooks.png) |
| [`software-company`](software-company/README.md) | ทีมซอฟต์แวร์ครบชุด ตั้งแต่โจทย์จนส่งมอบ | [flow](software-company/flow.png) · [map](software-company/map.png) · [playbooks](software-company/playbooks.png) |
| [`trading-finance`](trading-finance/README.md) | วางแผนเงิน ดูพอร์ต และเทรดอย่างมีวินัย ไม่ชี้นำ | [flow](trading-finance/flow.png) · [map](trading-finance/map.png) · [playbooks](trading-finance/playbooks.png) |

## สีในรูป

| สี | หมายถึง |
|---|---|
| สีประจำ plugin | หัวรูป · ไอคอน · เส้นนำสายตาของ plugin นั้น |
| กรอบเส้นประ + ป้าย "รอผู้ใช้อนุมัติ" | ขั้นที่หยุดรอผู้ใช้ หรือผู้ใช้ต้องกดเอง |
| ชิป skill · agent · playbook | ชื่อจริงในไฟล์ ค้นใน `plugins/` ได้ตรงตัว |
