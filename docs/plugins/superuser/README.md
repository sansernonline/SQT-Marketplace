<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# superuser

ทีมผู้ช่วยทำงานหลายขั้นให้จบพร้อมตรวจ

agent 3 · skill 39 (ของ plugin 0 · ของกลางจาก superuser 39) · คำสั่ง 0 · playbook 7 · ส่งงานต่อให้ —

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/superuser/`](../../../plugins/superuser/)

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
| [`document`](#pb-document) | เขียนเอกสาร | 8 |
| [`learn-from-session`](#pb-learn-from-session) | เรียนรู้จากงานที่ทำ | 7 |
| [`pickup-and-pause`](#pb-pickup-and-pause) | รับงานต่อ · หยุดงาน | 8 |
| [`research`](#pb-research) | ค้นคว้าหาคำตอบ | 7 |
| [`review`](#pb-review) | ตรวจงานก่อนส่ง | 6 |
| [`team-project`](#pb-team-project) | งานใหญ่หลายวัน คนกับ agent ร่วมทีม | 9 |
| [`unattended-run`](#pb-unattended-run) | ปล่อยงานยาวให้ทำเอง | 7 |

<a id="pb-document"></a>

### เขียนเอกสาร · `document`

![เขียนเอกสาร](playbooks/document.png)

<a id="pb-learn-from-session"></a>

### เรียนรู้จากงานที่ทำ · `learn-from-session`

![เรียนรู้จากงานที่ทำ](playbooks/learn-from-session.png)

<a id="pb-pickup-and-pause"></a>

### รับงานต่อ · หยุดงาน · `pickup-and-pause`

![รับงานต่อ · หยุดงาน](playbooks/pickup-and-pause.png)

<a id="pb-research"></a>

### ค้นคว้าหาคำตอบ · `research`

![ค้นคว้าหาคำตอบ](playbooks/research.png)

<a id="pb-review"></a>

### ตรวจงานก่อนส่ง · `review`

![ตรวจงานก่อนส่ง](playbooks/review.png)

<a id="pb-team-project"></a>

### งานใหญ่หลายวัน คนกับ agent ร่วมทีม · `team-project`

![งานใหญ่หลายวัน คนกับ agent ร่วมทีม](playbooks/team-project.png)

<a id="pb-unattended-run"></a>

### ปล่อยงานยาวให้ทำเอง · `unattended-run`

![ปล่อยงานยาวให้ทำเอง](playbooks/unattended-run.png)
