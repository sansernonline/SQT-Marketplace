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
| [`career`](career/README.md) | ช่วยหางาน เขียน CV เตรียมสัมภาษณ์ และต่อรองเงินเดือน | [flow](career/flow.png) · [map](career/map.png) · [playbooks](career/playbooks.png) |
| [`consumer-rights`](consumer-rights/README.md) | ช่วยเลือกซื้อ ขอคืนเงิน ร้องเรียน และเคลมประกัน | [flow](consumer-rights/flow.png) · [map](consumer-rights/map.png) · [playbooks](consumer-rights/playbooks.png) |
| [`dev-learning`](dev-learning/README.md) | ช่วยเรียนเทคโนโลยีใหม่ให้จบเป็นโค้ดที่รันได้ | [flow](dev-learning/flow.png) · [map](dev-learning/map.png) · [playbooks](dev-learning/playbooks.png) |
| [`graphic-design`](graphic-design/README.md) | ทำโลโก้ แบรนด์ โพสต์ และคลิปให้หน้าตาเป็นชุดเดียวกัน | [flow](graphic-design/flow.png) · [map](graphic-design/map.png) · [playbooks](graphic-design/playbooks.png) |
| [`health-wellness`](health-wellness/README.md) | จัดเรื่องสุขภาพของตัวเองและครอบครัวให้เป็นระเบียบ | [flow](health-wellness/flow.png) · [map](health-wellness/map.png) · [playbooks](health-wellness/playbooks.png) |
| [`home-family`](home-family/README.md) | จัดบ้าน บิล ลูก พ่อแม่ และสัตว์เลี้ยงให้ไม่ตกหล่น | [flow](home-family/flow.png) · [map](home-family/map.png) · [playbooks](home-family/playbooks.png) |
| [`online-seller`](online-seller/README.md) | ตั้งราคา ลงสินค้า ตอบแชต และคุมสต็อกหลายร้านให้ไม่พลาด | [flow](online-seller/flow.png) · [map](online-seller/map.png) · [playbooks](online-seller/playbooks.png) |
| [`personal-life`](personal-life/README.md) | จัดการงานธุระ เอกสาร ประชุม และเป้าหมายส่วนตัว | [flow](personal-life/flow.png) · [map](personal-life/map.png) · [playbooks](personal-life/playbooks.png) |
| [`software-company`](software-company/README.md) | ทีมซอฟต์แวร์ครบชุด ตั้งแต่โจทย์จนส่งมอบ | [flow](software-company/flow.png) · [map](software-company/map.png) · [playbooks](software-company/playbooks.png) |
| [`thai-workplace`](thai-workplace/README.md) | เอกสาร ภาษี เงินเดือน LINE และ PDPA ของบริษัทไทย | [flow](thai-workplace/flow.png) · [map](thai-workplace/map.png) · [playbooks](thai-workplace/playbooks.png) |
| [`trading-finance`](trading-finance/README.md) | วางแผนเงิน ดูพอร์ต และเทรดอย่างมีวินัย ไม่ชี้นำ | [flow](trading-finance/flow.png) · [map](trading-finance/map.png) · [playbooks](trading-finance/playbooks.png) |

## สีในรูป

| สี | หมายถึง |
|---|---|
| สีประจำ plugin | หัวรูป · ไอคอน · เส้นนำสายตาของ plugin นั้น |
| กรอบเส้นประ + ป้าย "รอผู้ใช้อนุมัติ" | ขั้นที่หยุดรอผู้ใช้ หรือผู้ใช้ต้องกดเอง |
| ชิป skill · agent · playbook | ชื่อจริงในไฟล์ ค้นใน `plugins/` ได้ตรงตัว |
