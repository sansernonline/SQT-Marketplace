---
name: short-answers
description: Use when reporting the outcome of work just completed — a command that was run, files that were changed, a test or build result, an installation, a migration, or a summary of a finished task. Puts the outcome on the first line instead of narrating the steps, names the files and paths that changed, and always states what broke or went untested even when that makes the report longer. Not for answering questions or explaining something in conversation, and not for written pieces another person will read such as email, proposals or documents.
---

# Short Answers

> **กฎ:** บรรทัดแรกคือ**ผลลัพธ์** ไม่ใช่การเล่าว่าทำอะไรไปบ้าง

---

## เมื่อไหร่ใช้ skill นี้

รายงานหลังลงมือทำอะไรเสร็จแล้ว — รันคำสั่ง แก้ไฟล์ ติดตั้ง ย้ายข้อมูล
รันเทสต์ สร้าง build หรือสรุปงานที่เพิ่งทำจบ

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ตอบคำถาม อธิบาย เทียบตัวเลือก | `direct-answers` |
| อีเมล ข้อเสนอ ใบเสนอราคา โพสต์ | `clear-writing` |
| อยากได้สั้นแบบห้วน ๆ ตัดคำ 50–75% | `caveman` |

---

## รูปแบบรายงาน

1. **บรรทัดแรก — ผลลัพธ์** สำเร็จหรือไม่สำเร็จ และผลนั้นคืออะไร
2. **ไฟล์หรือ path ที่เปลี่ยน** ระบุชื่อจริง ไม่ใช่ "อัปเดตไฟล์ที่เกี่ยวข้องแล้ว"
3. **สิ่งที่พังหรือยังไม่ได้ทดสอบ** — บอกเสมอ ถึงจะทำให้ยาวขึ้น
4. **สิ่งที่ผู้ใช้ต้องทำต่อ** ถ้ามี

ไม่ต้องเล่าขั้นตอนที่ผู้ใช้เห็นอยู่แล้วจากผลของเครื่องมือหรือรายการงานบนจอ

## ตัวอย่าง

```
❌ "ผมได้ทำการตรวจสอบไฟล์ทั้งหมดแล้ว จากนั้นจึงแก้ไข frontmatter
   และรัน validator อีกครั้งเพื่อยืนยันว่าไม่มีข้อผิดพลาดเหลืออยู่..."

✅ "แก้แล้ว 3 ไฟล์ — validator ผ่านครบ 73/73
   web-app-design, mobile-app-design, presentation-design (frontmatter พัง)
   ⚠️ รันในสำเนาที่คัดลอกมา ต้องรันบนเครื่องคุณอีกรอบถึงจะเชื่อได้"
```

---

## ยังต้องบอกอยู่

- **สิ่งที่ผิดพลาด** — ถ้าทำพัง บอกก่อนที่เขาจะถาม
- **ข้อจำกัดที่ยังไม่ได้ทดสอบ** — อย่าปล่อยให้เขาคิดว่าตรวจแล้ว
- **จุดที่ไม่เห็นด้วย** — สั้นได้ แต่ห้ามตัดทิ้งเพื่อให้รายงานสั้นลง

> สั้น ≠ ตัดความจริงออก · ตัดคำฟุ่มเฟือย ไม่ใช่ตัดเนื้อหาที่เขาต้องรู้

---

## Anti-patterns

- ❌ เล่าขั้นตอนตามลำดับแทนที่จะบอกผลลัพธ์
- ❌ "อัปเดตไฟล์ที่เกี่ยวข้องเรียบร้อยแล้ว" — ไฟล์ไหน
- ❌ สรุปซ้ำสิ่งที่เห็นอยู่แล้วจากผลของเครื่องมือ
- ❌ เกริ่นนำ ("ก่อนอื่นต้องเข้าใจว่า...")
- ❌ ขอโทษยืดยาว — บอกสิ่งที่ผิดแล้วบอกวิธีแก้
- ❌ **ข้ามเรื่องที่ยังไม่ได้ทดสอบเพราะอยากให้รายงานดูสั้นและเรียบร้อย**
