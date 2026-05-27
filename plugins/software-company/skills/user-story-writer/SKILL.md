---
name: user-story-writer
description: ใช้เมื่อต้องเขียน user story, แปลง business requirement เป็น user story, หรือ refine user story ที่มีอยู่ให้ครบถ้วน รวมถึงการเขียน acceptance criteria แบบ Given-When-Then
---

# User Story Writer

## เมื่อไหร่ใช้ skill นี้

- ผู้ใช้ขอให้เขียน user story ใหม่
- มี requirement เป็นข้อความยาว ต้องแตกเป็น stories
- ต้องเขียน acceptance criteria
- ต้อง review/refine user story เดิมที่ไม่ชัดเจน

## ขั้นตอนการทำงาน

1. **เก็บข้อมูลให้ครบ** ก่อนเขียน ถ้าขาดให้ถาม:
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
