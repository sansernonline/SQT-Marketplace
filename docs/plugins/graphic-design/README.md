<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# graphic-design

ทำโลโก้ แบรนด์ โพสต์ และคลิปให้หน้าตาเป็นชุดเดียวกัน

agent 6 · skill 58 (ของ plugin 19 · ของกลางจาก superuser 39) · คำสั่ง 6 · playbook 9 · ส่งงานต่อให้ [`software-company`](../software-company/README.md) · [`e-commerce`](../e-commerce/README.md)

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/graphic-design/`](../../../plugins/graphic-design/)

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
| [`asset-cleanup`](#pb-asset-cleanup) | จัดระเบียบไฟล์งาน | 5 |
| [`brand-setup`](#pb-brand-setup) | ตั้งชุดแบรนด์ใหม่ | 5 |
| [`campaign`](#pb-campaign) | ทำแคมเปญหลายขนาด | 7 |
| [`image-series`](#pb-image-series) | ทำภาพ AI เป็นชุด | 6 |
| `learn-from-session` | เรียนรู้จากงานที่ทำ (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 7 |
| [`review`](#pb-review) | ตรวจงานที่เสร็จแล้ว | 6 |
| `team-project` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 9 |
| [`unattended-run`](#pb-unattended-run) | งานยาวไม่ต้องเฝ้า | 7 |
| [`video`](#pb-video) | ทำคลิปสั้นจากสคริปต์ | 6 |

<a id="pb-asset-cleanup"></a>

### จัดระเบียบไฟล์งาน · `asset-cleanup`

![จัดระเบียบไฟล์งาน](playbooks/asset-cleanup.png)

<a id="pb-brand-setup"></a>

### ตั้งชุดแบรนด์ใหม่ · `brand-setup`

![ตั้งชุดแบรนด์ใหม่](playbooks/brand-setup.png)

<a id="pb-campaign"></a>

### ทำแคมเปญหลายขนาด · `campaign`

![ทำแคมเปญหลายขนาด](playbooks/campaign.png)

<a id="pb-image-series"></a>

### ทำภาพ AI เป็นชุด · `image-series`

![ทำภาพ AI เป็นชุด](playbooks/image-series.png)

<a id="pb-review"></a>

### ตรวจงานที่เสร็จแล้ว · `review`

![ตรวจงานที่เสร็จแล้ว](playbooks/review.png)

<a id="pb-unattended-run"></a>

### งานยาวไม่ต้องเฝ้า · `unattended-run`

![งานยาวไม่ต้องเฝ้า](playbooks/unattended-run.png)

<a id="pb-video"></a>

### ทำคลิปสั้นจากสคริปต์ · `video`

![ทำคลิปสั้นจากสคริปต์](playbooks/video.png)
