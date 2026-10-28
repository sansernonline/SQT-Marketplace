<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# e-commerce

ขายออนไลน์ ซื้ออย่างมั่นใจ และงานหลังบ้านบริษัทไทย

agent 8 · skill 71 (ของ plugin 32 · ของกลางจาก superuser 39) · คำสั่ง 14 · playbook 18 · ส่งงานต่อให้ [`graphic-design`](../graphic-design/README.md) · [`software-company`](../software-company/README.md) · [`trading-finance`](../trading-finance/README.md) · [`superuser`](../superuser/README.md) · [`personal-life`](../personal-life/README.md)

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/e-commerce/`](../../../plugins/e-commerce/)

## แผนผัง plugin

เรื่องเข้ามาทางไหน ไปถึง agent ไหน ใช้ skill อะไร

![แผนผัง plugin](map.png)

## SuperUser ทำงานอย่างไร

หัวหน้าทีมรับงาน → จัดขนาด → แจกงาน → ตรวจซ้ำจนผ่าน → ส่งมอบ → เรียนรู้

![SuperUser ขั้น 1 intake](flow/1-intake.png)

![SuperUser ขั้น 2 size](flow/2-size.png)

![SuperUser ขั้น 3 loop](flow/3-loop.png)

![SuperUser ขั้น 4 decide](flow/4-decide.png)

![SuperUser ขั้น 5 learn](flow/5-learn.png)

![SuperUser ขั้น 6 modules](flow/6-modules.png)

## playbook ทั้งหมด

| playbook | ทำอะไร | ขั้น |
|---|---|---|
| [`business-doc`](#pb-business-doc) | ร่างเอกสารธุรกิจ | 5 |
| [`buy-decision`](#pb-buy-decision) | ตัดสินใจซื้อของ | 6 |
| [`complaint`](#pb-complaint) | ร้องเรียนร้านค้า | 6 |
| [`customer-issue`](#pb-customer-issue) | แก้ปัญหาลูกค้าและรีวิว | 5 |
| `learn-from-session` | เรียนรู้จากงานที่ทำ (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 7 |
| [`line-oa`](#pb-line-oa) | ตั้งและใช้ LINE OA | 6 |
| [`live-session`](#pb-live-session) | วางแผนไลฟ์ขาย | 4 |
| [`monthly-close`](#pb-monthly-close) | ปิดเงินเดือนประจำเดือน | 6 |
| [`new-product`](#pb-new-product) | ลงสินค้าใหม่ | 6 |
| [`pdpa-setup`](#pb-pdpa-setup) | ตั้งระบบ PDPA | 5 |
| [`pricing-check`](#pb-pricing-check) | ตรวจราคาและกำไร | 5 |
| [`refund`](#pb-refund) | ขอคืนเงิน | 5 |
| [`review`](#pb-review) | ตรวจงานที่เสร็จแล้ว | 6 |
| [`stock-sync`](#pb-stock-sync) | ซิงก์สต็อกหลายร้าน | 5 |
| `team-project` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 9 |
| [`unattended-run`](#pb-unattended-run) | งานยาวไม่ต้องเฝ้า | 7 |
| [`warranty-claim`](#pb-warranty-claim) | เคลมและติดตามประกัน | 5 |
| [`year-end`](#pb-year-end) | ปิดปีและยื่นประจำปี | 5 |

<a id="pb-business-doc"></a>

### ร่างเอกสารธุรกิจ · `business-doc`

![ร่างเอกสารธุรกิจ](playbooks/business-doc.png)

<a id="pb-buy-decision"></a>

### ตัดสินใจซื้อของ · `buy-decision`

![ตัดสินใจซื้อของ](playbooks/buy-decision.png)

<a id="pb-complaint"></a>

### ร้องเรียนร้านค้า · `complaint`

![ร้องเรียนร้านค้า](playbooks/complaint.png)

<a id="pb-customer-issue"></a>

### แก้ปัญหาลูกค้าและรีวิว · `customer-issue`

![แก้ปัญหาลูกค้าและรีวิว](playbooks/customer-issue.png)

<a id="pb-line-oa"></a>

### ตั้งและใช้ LINE OA · `line-oa`

![ตั้งและใช้ LINE OA](playbooks/line-oa.png)

<a id="pb-live-session"></a>

### วางแผนไลฟ์ขาย · `live-session`

![วางแผนไลฟ์ขาย](playbooks/live-session.png)

<a id="pb-monthly-close"></a>

### ปิดเงินเดือนประจำเดือน · `monthly-close`

![ปิดเงินเดือนประจำเดือน](playbooks/monthly-close.png)

<a id="pb-new-product"></a>

### ลงสินค้าใหม่ · `new-product`

![ลงสินค้าใหม่](playbooks/new-product.png)

<a id="pb-pdpa-setup"></a>

### ตั้งระบบ PDPA · `pdpa-setup`

![ตั้งระบบ PDPA](playbooks/pdpa-setup.png)

<a id="pb-pricing-check"></a>

### ตรวจราคาและกำไร · `pricing-check`

![ตรวจราคาและกำไร](playbooks/pricing-check.png)

<a id="pb-refund"></a>

### ขอคืนเงิน · `refund`

![ขอคืนเงิน](playbooks/refund.png)

<a id="pb-review"></a>

### ตรวจงานที่เสร็จแล้ว · `review`

![ตรวจงานที่เสร็จแล้ว](playbooks/review.png)

<a id="pb-stock-sync"></a>

### ซิงก์สต็อกหลายร้าน · `stock-sync`

![ซิงก์สต็อกหลายร้าน](playbooks/stock-sync.png)

<a id="pb-unattended-run"></a>

### งานยาวไม่ต้องเฝ้า · `unattended-run`

![งานยาวไม่ต้องเฝ้า](playbooks/unattended-run.png)

<a id="pb-warranty-claim"></a>

### เคลมและติดตามประกัน · `warranty-claim`

![เคลมและติดตามประกัน](playbooks/warranty-claim.png)

<a id="pb-year-end"></a>

### ปิดปีและยื่นประจำปี · `year-end`

![ปิดปีและยื่นประจำปี](playbooks/year-end.png)
