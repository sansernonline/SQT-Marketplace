<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# personal-life

จัดการงานธุระ เอกสาร ประชุม เป้าหมาย บ้าน สุขภาพ อาชีพ และการเรียนรู้

agent 9 · skill 81 (ของ plugin 42 · ของกลางจาก superuser 39) · คำสั่ง 16 · playbook 30 · ส่งงานต่อให้ [`superuser`](../superuser/README.md) · [`software-company`](../software-company/README.md) · [`trading-finance`](../trading-finance/README.md) · [`e-commerce`](../e-commerce/README.md) · [`graphic-design`](../graphic-design/README.md)

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/personal-life/`](../../../plugins/personal-life/)

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
| [`bills`](#pb-bills) | ไล่ดูบิลค่าน้ำค่าไฟ | 5 |
| [`care-setup`](#pb-care-setup) | ตั้งระบบดูแลผู้สูงอายุ | 4 |
| [`cert-prep`](#pb-cert-prep) | เตรียมสอบใบรับรอง | 5 |
| [`checkup-cycle`](#pb-checkup-cycle) | วางแผนตรวจสุขภาพปีนี้ | 5 |
| [`decide-and-goals`](#pb-decide-and-goals) | ตัดสินใจและตั้งเป้า | 4 |
| [`digital-safety`](#pb-digital-safety) | ความปลอดภัยออนไลน์ | 5 |
| [`doctor-visit`](#pb-doctor-visit) | เตรียมตัวไปหาหมอ | 5 |
| [`documents`](#pb-documents) | จัดเอกสารสำคัญ | 4 |
| [`family-week`](#pb-family-week) | วางสัปดาห์ของครอบครัว | 4 |
| [`habit-tracking`](#pb-habit-tracking) | ติดตามนอนและออกกำลัง | 4 |
| [`interview`](#pb-interview) | เตรียมสัมภาษณ์ | 6 |
| [`job-application`](#pb-job-application) | สมัครงาน | 8 |
| `learn-from-session` | เรียนรู้จากงานที่ผ่านมา (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 7 |
| [`learning-path`](#pb-learning-path) | วางเส้นทางเรียน | 5 |
| [`maintenance`](#pb-maintenance) | วางแผนซ่อมบำรุงบ้าน | 5 |
| [`medication-routine`](#pb-medication-routine) | จัดตารางกินยา | 6 |
| [`meeting`](#pb-meeting) | เตรียมและสรุปประชุม | 4 |
| [`offer-negotiation`](#pb-offer-negotiation) | ต่อรองข้อเสนองาน | 6 |
| [`paper-to-practice`](#pb-paper-to-practice) | จากบทความสู่โค้ดจริง | 5 |
| [`profile-refresh`](#pb-profile-refresh) | ปรับ CV และโปรไฟล์ | 5 |
| [`promotion-case`](#pb-promotion-case) | เตรียมขอขึ้นตำแหน่ง | 5 |
| [`review`](#pb-review) | ตรวจงานก่อนส่ง | 6 |
| [`side-project`](#pb-side-project) | เลือกโปรเจกต์ฝึกมือ | 4 |
| [`subscriptions`](#pb-subscriptions) | ตรวจค่าสมาชิกรายเดือน | 5 |
| `team-project` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 9 |
| [`tech-radar`](#pb-tech-radar) | ตามข่าวเทคโนโลยี | 5 |
| [`trip`](#pb-trip) | เตรียมเที่ยว | 4 |
| [`unattended-run`](#pb-unattended-run) | ให้ทำงานยาวเอง | 7 |
| [`vehicle`](#pb-vehicle) | ต่อภาษีและประกันรถ | 4 |
| [`weekly-reset`](#pb-weekly-reset) | รีเซ็ตประจำสัปดาห์ | 5 |

<a id="pb-bills"></a>

### ไล่ดูบิลค่าน้ำค่าไฟ · `bills`

![ไล่ดูบิลค่าน้ำค่าไฟ](playbooks/bills.png)

<a id="pb-care-setup"></a>

### ตั้งระบบดูแลผู้สูงอายุ · `care-setup`

![ตั้งระบบดูแลผู้สูงอายุ](playbooks/care-setup.png)

<a id="pb-cert-prep"></a>

### เตรียมสอบใบรับรอง · `cert-prep`

![เตรียมสอบใบรับรอง](playbooks/cert-prep.png)

<a id="pb-checkup-cycle"></a>

### วางแผนตรวจสุขภาพปีนี้ · `checkup-cycle`

![วางแผนตรวจสุขภาพปีนี้](playbooks/checkup-cycle.png)

<a id="pb-decide-and-goals"></a>

### ตัดสินใจและตั้งเป้า · `decide-and-goals`

![ตัดสินใจและตั้งเป้า](playbooks/decide-and-goals.png)

<a id="pb-digital-safety"></a>

### ความปลอดภัยออนไลน์ · `digital-safety`

![ความปลอดภัยออนไลน์](playbooks/digital-safety.png)

<a id="pb-doctor-visit"></a>

### เตรียมตัวไปหาหมอ · `doctor-visit`

![เตรียมตัวไปหาหมอ](playbooks/doctor-visit.png)

<a id="pb-documents"></a>

### จัดเอกสารสำคัญ · `documents`

![จัดเอกสารสำคัญ](playbooks/documents.png)

<a id="pb-family-week"></a>

### วางสัปดาห์ของครอบครัว · `family-week`

![วางสัปดาห์ของครอบครัว](playbooks/family-week.png)

<a id="pb-habit-tracking"></a>

### ติดตามนอนและออกกำลัง · `habit-tracking`

![ติดตามนอนและออกกำลัง](playbooks/habit-tracking.png)

<a id="pb-interview"></a>

### เตรียมสัมภาษณ์ · `interview`

![เตรียมสัมภาษณ์](playbooks/interview.png)

<a id="pb-job-application"></a>

### สมัครงาน · `job-application`

![สมัครงาน](playbooks/job-application.png)

<a id="pb-learning-path"></a>

### วางเส้นทางเรียน · `learning-path`

![วางเส้นทางเรียน](playbooks/learning-path.png)

<a id="pb-maintenance"></a>

### วางแผนซ่อมบำรุงบ้าน · `maintenance`

![วางแผนซ่อมบำรุงบ้าน](playbooks/maintenance.png)

<a id="pb-medication-routine"></a>

### จัดตารางกินยา · `medication-routine`

![จัดตารางกินยา](playbooks/medication-routine.png)

<a id="pb-meeting"></a>

### เตรียมและสรุปประชุม · `meeting`

![เตรียมและสรุปประชุม](playbooks/meeting.png)

<a id="pb-offer-negotiation"></a>

### ต่อรองข้อเสนองาน · `offer-negotiation`

![ต่อรองข้อเสนองาน](playbooks/offer-negotiation.png)

<a id="pb-paper-to-practice"></a>

### จากบทความสู่โค้ดจริง · `paper-to-practice`

![จากบทความสู่โค้ดจริง](playbooks/paper-to-practice.png)

<a id="pb-profile-refresh"></a>

### ปรับ CV และโปรไฟล์ · `profile-refresh`

![ปรับ CV และโปรไฟล์](playbooks/profile-refresh.png)

<a id="pb-promotion-case"></a>

### เตรียมขอขึ้นตำแหน่ง · `promotion-case`

![เตรียมขอขึ้นตำแหน่ง](playbooks/promotion-case.png)

<a id="pb-review"></a>

### ตรวจงานก่อนส่ง · `review`

![ตรวจงานก่อนส่ง](playbooks/review.png)

<a id="pb-side-project"></a>

### เลือกโปรเจกต์ฝึกมือ · `side-project`

![เลือกโปรเจกต์ฝึกมือ](playbooks/side-project.png)

<a id="pb-subscriptions"></a>

### ตรวจค่าสมาชิกรายเดือน · `subscriptions`

![ตรวจค่าสมาชิกรายเดือน](playbooks/subscriptions.png)

<a id="pb-tech-radar"></a>

### ตามข่าวเทคโนโลยี · `tech-radar`

![ตามข่าวเทคโนโลยี](playbooks/tech-radar.png)

<a id="pb-trip"></a>

### เตรียมเที่ยว · `trip`

![เตรียมเที่ยว](playbooks/trip.png)

<a id="pb-unattended-run"></a>

### ให้ทำงานยาวเอง · `unattended-run`

![ให้ทำงานยาวเอง](playbooks/unattended-run.png)

<a id="pb-vehicle"></a>

### ต่อภาษีและประกันรถ · `vehicle`

![ต่อภาษีและประกันรถ](playbooks/vehicle.png)

<a id="pb-weekly-reset"></a>

### รีเซ็ตประจำสัปดาห์ · `weekly-reset`

![รีเซ็ตประจำสัปดาห์](playbooks/weekly-reset.png)
