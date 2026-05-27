# คู่มือใช้งาน Software Company Plugin

## ภาพรวม: 3 วิธีเรียกใช้

| วิธี | ใช้เมื่อ | ตัวอย่าง |
|------|---------|---------|
| **Slash Command** | Workflow ครบชุด | `/feature-kickoff ระบบจอง` |
| **เรียก Agent ตรง** | งานเฉพาะของ role นั้น | `ใช้ developer ช่วย refactor login.ts` |
| **ปล่อยให้ Claude เลือกเอง** | งานทั่วไป | `เขียน user story เรื่อง...` |

---

## เริ่มต้นใช้งาน

### Hello World: ลอง skill แรก

```
ช่วยเขียน user story สำหรับ feature "ลืมรหัสผ่าน" หน่อย
```

Claude จะ:
1. เรียก `business-analyst` agent (จาก description ที่ตรงกับงาน)
2. BA ใช้ skill `user-story-writer`
3. คืนค่าเป็น user story ตาม format มาตรฐาน

---

## Workflow 1: เริ่ม Feature ใหม่ (Full SDLC)

### Use case
มี feature ใหม่อยากเริ่มทำ ต้องการ requirement → design → spec → plan

### คำสั่ง
```
/feature-kickoff ระบบจองห้องประชุมพร้อมการแจ้งเตือนทาง email และ Line
```

### สิ่งที่เกิดขึ้น

```
Step 1: Business Analyst
├─ ถามคำถามคุณ (ใครใช้, ทำไปทำไม, success metric)
├─ สร้าง BRD
└─ เขียน user stories + acceptance criteria

[หยุดถามว่าไปต่อไหม]

Step 2: Solution Architect
├─ เสนอ architecture 2-3 ตัวเลือก
├─ เปรียบเทียบ trade-offs
├─ บันทึก ADR (ใช้ adr-writer skill)
└─ แนะนำ tech stack

[หยุดถาม]

Step 3: System Analyst
├─ เขียน FSD พร้อม use cases
├─ ออกแบบ API endpoints
└─ ออกแบบ data model

[หยุดถาม]

Step 4: Project Manager
├─ ประเมิน effort
├─ จัด milestone
└─ ระบุ risk และ dependencies
```

---

## Workflow 2: Sprint Planning

### Use case
ทุกๆ ต้น sprint ต้องวางแผนว่าจะทำอะไรบ้าง

### คำสั่ง
```
/sprint-plan Sprint 12 - Q2 Goals
```

### สิ่งที่ได้
- Sprint goal ที่ชัดเจน 1 ประโยค
- รายการ stories ที่จะทำ (พร้อม story points)
- ตาราง daily standup
- รายการ risk
- กำหนดวัน demo/review

---

## Workflow 3: Code Review

### Use case
มี PR เข้ามาต้อง review

### คำสั่ง
```
/code-review src/auth/login.ts
```

หรือ
```
/code-review PR #234 - Add password reset feature
```

### สิ่งที่ได้
- Review ครอบคลุม 7 หมวด: correctness, design, tests, security, performance, readability, maintainability
- จัดลำดับความรุนแรง: `blocking:`, `important:`, `nit:`, `q:`, `praise:`
- สรุปท้าย: ✅ Approve / 🔄 Request changes / 💬 Comment

---

## Workflow 4: ออกแบบ Test Cases

### Use case
มี user story ใหม่ ต้องการ test cases ครบทุกแง่

### คำสั่ง
```
/test-design feature การ checkout พร้อม promo code
```

### สิ่งที่ได้
- Test cases ครอบคลุม:
  - Happy path
  - Boundary
  - Negative
  - Equivalence classes
  - State transitions
  - Integration
  - Security
  - Performance
  - Accessibility
- ระบุ priority (P1-P4) แต่ละ case
- Mark automation candidates
- Coverage summary table

---

## Workflow 5: รายงาน Bug

### Use case
พบ bug ระหว่างทดสอบ หรือมี user complaint

### คำสั่ง
```
/bug-report เวลาคลิกปุ่ม save แล้ว app crash
```

### สิ่งที่เกิดขึ้น
1. QA Tester ถาม:
   - Steps to reproduce ละเอียด
   - Environment (browser, OS)
   - Frequency
   - Evidence
2. ประเมิน severity (S1-S4) และ priority (P1-P4)
3. สร้าง bug report ตาม template

---

## Workflow 6: Sprint Retrospective

### Use case
จบ sprint ต้องการทำ retro

### คำสั่ง
```
/retrospective Sprint 11
```

### สิ่งที่เกิดขึ้น
1. ถามว่า sprint goal บรรลุไหม
2. รวบรวม:
   - 🟢 Went well
   - 🔴 Didn't go well
   - 💡 Ideas to try
3. สรุปเป็น action items (3-5 ข้อ พร้อม owner + due date)
4. เช็ค carry-over จาก retro ก่อน

---

## การเรียก Agent โดยตรง

ถ้าต้องการงานเฉพาะ ไม่ต้องผ่าน workflow:

```
ใช้ developer agent ช่วย implement function ที่ validate email หน่อย
```

```
ให้ qa-tester ช่วยเขียน test plan สำหรับ feature payment integration
```

```
ขอ solution-architect ช่วยตัดสินใจระหว่าง PostgreSQL กับ MongoDB
```

---

## การเรียก Skill โดยตรง

```
/user-story-writer
```

หรือพิมพ์งานที่ตรงกับ description ของ skill:

```
เขียน commit message สำหรับการเพิ่ม rate limiting ใน API
```
(Claude จะเรียก `commit-message-format` skill)

```
ช่วย review postmortem ของ incident เมื่อวานหน่อย
```
(Claude จะเรียก `postmortem-template` skill)

---

## ตัวอย่างใช้งานจริง

### Scenario A: ทำ feature ใหม่ตั้งแต่ต้นจนจบ

```
1. /feature-kickoff ระบบสมาชิกแบบ tier (Bronze/Silver/Gold)

2. (รอ BA → Architect → SA → PM ทำงาน)

3. ใช้ ux-designer ช่วยออกแบบ user flow และ wireframe หน้า upgrade tier

4. /sprint-plan วาง sprint 1

5. ใช้ developer implement endpoint POST /api/membership/upgrade

6. /code-review src/membership/upgrade.controller.ts

7. /test-design การ upgrade membership

8. ใช้ devops-engineer ตั้ง feature flag สำหรับ tier rollout
```

### Scenario B: เกิด incident ใน production

```
1. /bug-report users รายงานว่า login ไม่ได้

2. (qa-tester เก็บข้อมูล + จัด priority)

3. ใช้ developer ช่วย debug และ fix

4. /code-review ของ fix

5. ใช้ devops-engineer deploy hotfix

6. หลังเหตุการณ์: เรียก skill postmortem-template เขียน postmortem
```

### Scenario C: รับ requirement จาก stakeholder

```
1. ใช้ business-analyst สัมภาษณ์ requirement (BA จะถามคำถามให้)

2. BA produces BRD + user stories

3. /feature-kickoff (ข้าม BA step เพราะทำแล้ว, เริ่มจาก architect)

4. ดำเนินต่อตาม Scenario A
```

---

## Tips & Tricks

### 1. ผสม agent + skill
```
ให้ developer agent ใช้ commit-message-format skill เขียน commit สำหรับการแก้ bug login timeout
```

### 2. เรียกหลาย agent ต่อเนื่อง
```
1. ให้ business-analyst เขียน user story เรื่อง search filter
2. แล้วให้ system-analyst เขียน FSD ต่อจากนั้น
3. สุดท้าย developer ลอง implement
```

### 3. ใช้ Claude หลักเป็น coordinator
```
ผมอยากทำระบบ notification ช่วย coordinate ระหว่าง agents ให้หน่อย
```

Claude หลักจะเรียก agents ตามความเหมาะสมเอง

### 4. ทำงานทีละ phase
ไม่ต้องเร่งใช้ slash command ทีเดียวจบ ค่อยๆ ทำทีละ phase จะได้ผลลัพธ์ละเอียดกว่า

---

## ข้อแนะนำ

✅ **ทำ**
- ระบุ context ให้ชัด (เช่น "สำหรับ web app", "ใช้ React")
- ตรวจสอบผลลัพธ์แต่ละ step ก่อนไปขั้นต่อ
- ถ้า agent ตอบไม่ตรง ลองให้ context เพิ่ม
- Save ผลลัพธ์สำคัญ (BRD, ADR, FSD) เป็นไฟล์ใน project

❌ **อย่าทำ**
- คาดหวังว่า AI agent จะตัดสินใจ business แทนคุณ
- รัน /feature-kickoff โดยไม่อ่านระหว่างทาง
- เชื่อ estimation จาก developer agent โดยไม่ verify
- ใช้ output ไป production โดยไม่มี human review
