<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# software-company

ทีมซอฟต์แวร์ครบชุด ตั้งแต่โจทย์จนส่งมอบ

agent 38 · skill 140 (ของ plugin 101 · ของกลางจาก superuser 39) · คำสั่ง 29 · playbook 17 · ส่งงานต่อให้ —

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/software-company/`](../../../plugins/software-company/)

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
| [`bug-fix`](#pb-bug-fix) | แก้บั๊ก | 10 |
| [`feature`](#pb-feature) | เพิ่มฟีเจอร์ | 10 |
| [`housekeeping`](#pb-housekeeping) | เก็บกวาดเครื่อง | 5 |
| [`investigation`](#pb-investigation) | สืบหาคำตอบ | 9 |
| `learn-from-session` | เรียนรู้จากงานที่ผ่านมา (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 7 |
| [`new-project`](#pb-new-project) | เริ่มโปรเจกต์ใหม่ | 10 |
| [`performance`](#pb-performance) | ทำให้เร็วขึ้น | 9 |
| [`pickup-and-pause`](#pb-pickup-and-pause) | รับงานต่อและพักงาน | 8 |
| [`project-docs`](#pb-project-docs) | เขียนเอกสารโปรเจกต์ | 8 |
| [`prototype`](#pb-prototype) | ลองของก่อนตัดสินใจ | 7 |
| [`refactor`](#pb-refactor) | จัดโค้ดใหม่ | 9 |
| [`review`](#pb-review) | รีวิวโค้ด | 6 |
| [`ship`](#pb-ship) | ส่งมอบงาน | 9 |
| [`skill-authoring`](#pb-skill-authoring) | เขียน skill ใหม่ | 8 |
| `team-project` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 9 |
| [`unattended-run`](#pb-unattended-run) | ปล่อยให้ทำเองยาว ๆ | 7 |
| [`visual-parity`](#pb-visual-parity) | ทำหน้าจอให้ตรงต้นแบบ | 9 |

<a id="pb-bug-fix"></a>

### แก้บั๊ก · `bug-fix`

![แก้บั๊ก](playbooks/bug-fix.png)

<a id="pb-feature"></a>

### เพิ่มฟีเจอร์ · `feature`

![เพิ่มฟีเจอร์](playbooks/feature.png)

<a id="pb-housekeeping"></a>

### เก็บกวาดเครื่อง · `housekeeping`

![เก็บกวาดเครื่อง](playbooks/housekeeping.png)

<a id="pb-investigation"></a>

### สืบหาคำตอบ · `investigation`

![สืบหาคำตอบ](playbooks/investigation.png)

<a id="pb-new-project"></a>

### เริ่มโปรเจกต์ใหม่ · `new-project`

![เริ่มโปรเจกต์ใหม่](playbooks/new-project.png)

<a id="pb-performance"></a>

### ทำให้เร็วขึ้น · `performance`

![ทำให้เร็วขึ้น](playbooks/performance.png)

<a id="pb-pickup-and-pause"></a>

### รับงานต่อและพักงาน · `pickup-and-pause`

![รับงานต่อและพักงาน](playbooks/pickup-and-pause.png)

<a id="pb-project-docs"></a>

### เขียนเอกสารโปรเจกต์ · `project-docs`

![เขียนเอกสารโปรเจกต์](playbooks/project-docs.png)

<a id="pb-prototype"></a>

### ลองของก่อนตัดสินใจ · `prototype`

![ลองของก่อนตัดสินใจ](playbooks/prototype.png)

<a id="pb-refactor"></a>

### จัดโค้ดใหม่ · `refactor`

![จัดโค้ดใหม่](playbooks/refactor.png)

<a id="pb-review"></a>

### รีวิวโค้ด · `review`

![รีวิวโค้ด](playbooks/review.png)

<a id="pb-ship"></a>

### ส่งมอบงาน · `ship`

![ส่งมอบงาน](playbooks/ship.png)

<a id="pb-skill-authoring"></a>

### เขียน skill ใหม่ · `skill-authoring`

![เขียน skill ใหม่](playbooks/skill-authoring.png)

<a id="pb-unattended-run"></a>

### ปล่อยให้ทำเองยาว ๆ · `unattended-run`

![ปล่อยให้ทำเองยาว ๆ](playbooks/unattended-run.png)

<a id="pb-visual-parity"></a>

### ทำหน้าจอให้ตรงต้นแบบ · `visual-parity`

![ทำหน้าจอให้ตรงต้นแบบ](playbooks/visual-parity.png)
