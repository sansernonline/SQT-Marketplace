# โปรเจกต์แบบ ecosystem — 1 ระบบ แบ่งเป็นหลาย sub-project

อ่านเมื่อโปรเจกต์มี sub-project ตั้งแต่ 2 ตัวและแต่ละตัวมีเอกสารชุดของตัวเอง · กฎย่ออยู่ใน `SKILL.md` ข้อ 1

ใช้เมื่อโปรเจกต์เป็นชุดผลิตภัณฑ์ที่มี sub-project ตั้งแต่ 2 ตัวขึ้นไป และแต่ละตัวมีเอกสารชุดของตัวเอง (SRS · mockup · สถาปัตยกรรม) เช่น Quanton ที่แบ่งเป็น CONNECT · LAB · INTEL · DESK
**ชื่อโฟลเดอร์ต้องเป็น `ecosystem/` เสมอ** ห้ามใช้ `projects/` `modules/` หรือ `apps/` เพราะพอเปิดโฟลเดอร์แล้วต้องรู้ทันทีว่าทุกตัวข้างในเป็นชิ้นของระบบเดียวกัน

```
<ชื่อโปรเจกต์>/
├─ docs/                เอกสารระดับ ecosystem — README (สารบัญ) · BUILD-PLAN · project-plan · BRD · figures/
├─ ecosystem/
│  └─ <รหัส>-<SUB>/     1 โฟลเดอร์ต่อ 1 sub-project เช่น QTN-CONNECT
│     ├─ docs/          srs.md · architecture.md · decisions/ · figures/ · fsd-*.md · test-plan.md
│     ├─ mockup/
│     ├─ qa/
│     └─ <sub-name>/    repo โค้ดของ sub-project นี้ (ตัวพิมพ์เล็กคั่น `-`)
├─ ref/ · assets/ · _to_delete/ · .claude/   ใช้ร่วมกันทั้ง ecosystem (กติกาเดียวกับแบบ B)
```

- เอกสารที่ครอบทุก sub-project (BRD · แผนโครงการ · BUILD-PLAN) อยู่ใน `docs/` ที่รากที่เดียว ห้ามก๊อปไปไว้ในแต่ละ sub-project
- สร้างโฟลเดอร์ sub-project เมื่อเริ่มเขียนเอกสารของตัวนั้นจริง ไม่สร้างเผื่อ
- ชื่อโฟลเดอร์ sub-project = รหัสโปรเจกต์ + ชื่อ sub-project ตัวพิมพ์ใหญ่ (`QTN-CONNECT`) ใช้รหัสเดียวกับที่เอกสารอ้าง
- โปรเจกต์ที่ใช้ `projects/` อยู่แล้ว → เปลี่ยนชื่อเป็น `ecosystem/` แล้วแก้ path ในเอกสารและสคริปต์ทุกไฟล์ในรอบเดียวกัน
- โปรเจกต์ที่มีผลิตภัณฑ์เดียว ไม่ต้องมี `ecosystem/` ใช้แบบ B ตามปกติ
