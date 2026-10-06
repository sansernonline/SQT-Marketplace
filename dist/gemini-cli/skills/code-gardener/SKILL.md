---
name: code-gardener
description: Use when a codebase should be patrolled for patterns that mislead agents and people (duplication, wrong-layer calls, dead code, naming drift) or the user says garden or tidy patrol. Logs findings, then turns themes into structural fixes.
---

# code-gardener — คนสวนที่จดก่อน ยังไม่ตัด

> ถ้าแก้ทุกอย่างทันทีที่เห็น จะได้การแก้ร้อยครั้งที่ไม่เห็นภาพรวม
> จดไว้ก่อน แล้ววันหลังค่อยมองรวม จะเห็นว่าร้อยข้อนั้นจริง ๆ คือสามเรื่อง

## ไฟล์เดียวที่ใช้ — `docs/GARDEN.md`

```markdown
## บันทึก (ต่อท้ายทุกรอบ ไม่แก้ของเก่า)
| วันที่ | ไฟล์:บรรทัด | สิ่งที่เห็น | ทำไมน่ากังวล | รูปแบบ |

## ทบทวนแล้ว
| วันที่ | ธีม | จำนวนข้อ | ทำอะไรต่อ | ไฟล์งาน |
```

## รอบสำรวจ (ทุกวัน หรือหลังมี commit ใหม่)

1. อ่าน `docs/GARDEN.md` ส่วน "ทบทวนแล้ว" — ธีมที่ตัดสินแล้วไม่ต้องจดซ้ำ
2. ดูเฉพาะไฟล์ที่เปลี่ยนตั้งแต่รอบก่อน (`git log --since`) · ทั้ง repo ทำแค่สัปดาห์ละครั้ง · งานใหญ่แบ่งด้วย [`parallel-split-and-merge`](../parallel-split-and-merge/SKILL.md)
3. มองหา — logic ซ้ำ · เรียกข้ามชั้น (หน้าจอคุยฐานข้อมูลตรง) · กับดักของ framework ที่ใช้ · โค้ดตาย · ชื่อที่ไม่ตรงกับ `readable-code` · test ที่ผ่านทั้งที่โค้ดผิด · ของที่ขัดกับ `docs/AGENT-RULES.md`
4. **ต่อท้ายลงตารางบันทึก ห้ามแก้โค้ด** · ใส่ "รูปแบบ" เป็นคำสั้นที่ใช้ซ้ำได้ เพื่อให้รวมกลุ่มง่าย
5. ไม่เจออะไร ไม่ต้องเขียน

## รอบทบทวน (ทุก 2–3 วัน หรือบันทึกเกิน 20 แถว)

1. จัดกลุ่มบันทึกที่ยังไม่ทบทวนตาม "รูปแบบ" และต้นเหตุ
2. ทุกธีมเลือกทางเดียว
   - เกิดซ้ำได้อีก → [`repeated-mistakes-to-checks`](../repeated-mistakes-to-checks/SKILL.md) ทำเป็นโครงสร้าง type หรือ lint
   - ของที่มีอยู่แล้วต้องจัดใหม่ → playbook `refactor` ของ [`agent-team`](../agent-team/SKILL.md)
   - ไม่คุ้มแก้ → เขียนเหตุผล
3. ลงตาราง "ทบทวนแล้ว" แล้วเสนอให้ผู้ใช้ดูว่าจะทำธีมไหนก่อน — งานแก้จริงเริ่มเมื่อผู้ใช้เลือก
4. `status-report`

## ตั้งให้รันเอง

scheduled task ในแอป Claude หรือ Windows Task Scheduler รัน `claude -p "ใช้ code-gardener รอบสำรวจ"` ทุกวัน และ `"... รอบทบทวน"` ทุกวันจันทร์และพฤหัส · ใช้ห้อง `-Isolated` ถ้ามี `.sandbox/`
