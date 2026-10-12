---
name: user-story-writer
description: Use when writing user stories, turning business requirements into stories or refining existing ones. Acceptance criteria in Given-When-Then form.
---

# User Story Writer

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

## เมื่อไหร่ใช้ skill นี้

- ผู้ใช้ขอให้เขียน user story ใหม่
- มี requirement เป็นข้อความยาว ต้องแตกเป็น stories
- ต้องเขียน acceptance criteria
- ต้อง review/refine user story เดิมที่ไม่ชัดเจน

## ขั้นตอนการทำงาน

1. **เก็บข้อมูลให้ครบ** ก่อนเขียน ถ้าขาดอะไรให้ถาม:
   - ใครคือ user (persona/role)
   - เขาต้องการทำอะไร
   - ทำเพื่ออะไร (business value)
   - มีข้อจำกัด/business rule อะไรไหม

2. **เขียน user story ตาม format**:
   ```
   As a <type of user>
   I want <some goal>
   So that <some reason / business value>
   ```

3. **เขียน Acceptance Criteria** แบบ Given-When-Then:
   ```
   Given <precondition>
   When <action>
   Then <expected result>
   ```
   - อย่างน้อย 1 happy path
   - อย่างน้อย 1 edge case / error case

4. **ใส่ metadata เพิ่มเติม**:
   - Priority (High/Medium/Low)
   - Story Points (ถ้าจำเป็น) — ใช้ Fibonacci: 1, 2, 3, 5, 8, 13
   - Dependencies (ถ้ามี)

5. **บันทึกลงไฟล์** — ดูหัวข้อถัดไป story ที่อยู่แค่ในแชตถือว่ายังไม่ได้เขียน

## เขียนลงไฟล์ไหน

ทุก story อยู่ใน **`docs/USER-STORIES.md`** ไฟล์เดียว เริ่มจากแบบฟอร์ม [assets/user-stories.md](assets/user-stories.md)

- **อ่านไฟล์ก่อนเขียนเสมอ** ถ้ามีอยู่แล้ว ให้ต่อเลข ID จากตัวสุดท้าย และแก้ story เดิมในที่เดิม ไม่สร้างซ้ำ
- **ID ไม่นำกลับมาใช้ซ้ำ** story ที่เลิกทำแล้วให้เปลี่ยนสถานะเป็น Dropped ไม่ลบทิ้ง
- **ตารางสารบัญด้านบนต้องตรงกับเนื้อหาเสมอ** เพิ่มหรือแก้ story แล้วต้องแก้แถวในตารางในรอบเดียวกัน `/sprint-plan` อ่านจากตารางนี้
- **คอลัมน์อ้างอิง** ใส่ที่มาของ story เช่นข้อกำหนดใน SRS (`REQ-xxx`), กฎธุรกิจ (`BR-xxx`) หรือ change request (`CR-xxx`) เพื่อให้ไล่กลับไปหาได้
- **story ที่เริ่มทำหรือทำเสร็จแล้ว (In sprint หรือ Done) ถ้าแก้ AC** ให้บันทึกในส่วนประวัติการเปลี่ยนท้ายไฟล์ แล้วค้นใน `qa/` หา test case ที่อ้าง `US-xxx, ACn` นั้น ใส่ชื่อลงช่อง test case ที่ต้องแก้ — ไม่แก้ไฟล์ของ QA เอง
- **เกิน 30 story หรือมีหลาย epic ที่แยกทีมกันทำ** ให้ย้ายเนื้อหาไปไว้ที่ `docs/stories/<epic>.md` ส่วนตารางสารบัญยังคงอยู่ใน `docs/USER-STORIES.md` ที่เดียว

## INVEST Checklist (ตรวจก่อนส่ง)

ทุก story ต้องผ่านเกณฑ์เหล่านี้:

- [ ] **I**ndependent — ไม่ขึ้นกับ story อื่น
- [ ] **N**egotiable — เปิดให้คุยรายละเอียดได้
- [ ] **V**aluable — มี business value ชัดเจน
- [ ] **E**stimable — ประเมิน effort ได้
- [ ] **S**mall — เล็กพอจะทำเสร็จใน 1 sprint
- [ ] **T**estable — ทดสอบได้

## Output Template

```markdown
## US-XXX: <ชื่อสั้นๆ>

**Story**
As a <role>
I want <goal>
So that <value>

**Acceptance Criteria**

AC1: <ชื่อ scenario>
- Given <context>
- When <action>
- Then <result>

AC2: <ชื่อ scenario>
- Given ...
- When ...
- Then ...

**Priority:** High | Medium | Low
**Story Points:** X
**Dependencies:** US-YYY (ถ้ามี)
**Notes:** ข้อมูลเพิ่มเติม / business rules
```

## ตัวอย่าง

ดูตัวอย่างเต็มได้ที่ `examples/login-story.md`

## ข้อห้าม

- ❌ อย่าเขียน technical solution ใน story (เช่น "ใช้ JWT")
- ❌ อย่าเขียน UI detail (เช่น "ปุ่มสีฟ้า") — ให้ designer ตัดสิน
- ❌ อย่าใช้ "user" เฉยๆ ต้องระบุ role เจาะจง (admin, customer, guest)
- ❌ อย่าเขียน story ใหญ่เกิน 13 points — ให้แตกออก

---

## หน้าตาของเอกสาร

skill นี้ตัดสินว่า**เนื้อหาต้องมีอะไร** ไม่ได้ตัดสินว่า**หน้าตาเป็นอย่างไร** —
โหลด skill ที่ตรงกับปลายทางก่อนเริ่มเขียน ไม่ใช่ตอนเขียนเสร็จ:

| ส่งมอบเป็นอะไร | โหลด |
|---|---|
| markdown ที่คนอ่าน (repo · wiki · ระบบติดตามงาน) | `polished-document-style` |
| ไฟล์ `.docx` / `.pptx` / PDF ที่ผู้มีส่วนได้เสียเซ็นรับ | `branded-document-design` |
| ต้องมีภาพถึงจะเข้าใจ | `markdown-visuals` แล้วต่อด้วย `software-diagrams` |

การปล่อยรูปแบบเริ่มต้นไว้ไม่ได้ทำให้ดูเป็นกลาง คนอ่านจะมองว่างานยังไม่เสร็จ
