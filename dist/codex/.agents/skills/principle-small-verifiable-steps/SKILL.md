---
name: principle-small-verifiable-steps
description: Use for multi-step work (migrations, sweeps, many similar edits, long or unattended runs) and when stacking commits or PRs. Cut it into small units that each end verified before the next one starts.
---

# principle · small verifiable steps — ตัดเป็นชิ้นเล็กที่ตรวจได้ทีละชิ้น

> งานยาวที่ตรวจทีเดียวตอนจบ ถ้าพังจะไม่รู้ว่าพังที่ชิ้นไหน
> ตัดเป็นชิ้นเล็กที่แต่ละชิ้นจบในสภาพที่ตรวจได้ พังเมื่อไรก็รู้ทันทีว่าชิ้นไหน

## วิธีตัด

1. เขียนรายการชิ้นลง todo ก่อนเริ่ม — แต่ละชิ้นมี "ผ่านเมื่อ" หนึ่งบรรทัด
2. หนึ่งชิ้น = เปลี่ยนเรื่องเดียว · build ผ่าน · test ผ่าน · แอปยังรันได้
3. ทำทีละชิ้น ตรวจ แล้ว commit ก่อนขึ้นชิ้นถัดไป — commit เฉพาะเมื่อได้รับอนุญาต · ไม่ได้รับ บันทึกชิ้นที่ผ่านไว้ใน `docs/BUILD-PLAN.md` แทน
4. ชิ้นไหนตรวจไม่ผ่าน หยุดแก้ที่ชิ้นนั้น ห้ามข้ามไปชิ้นถัดไปแล้วค่อยกลับมา

## ลำดับ

| ทำก่อน | ทำหลัง |
|---|---|
| ของที่คนอื่นพึ่ง (type · schema · ฟังก์ชันกลาง) | ของที่เรียกใช้ |
| เพิ่มของใหม่ | ย้ายผู้ใช้ แล้วลบของเก่า ([`principle-replace-then-delete`](../principle-replace-then-delete/SKILL.md)) |
| ชิ้นที่เสี่ยงที่สุด | ชิ้นที่รู้แน่ว่าทำได้ |

## commit และ PR

- ทุก commit อ่านจบในตัวเองและ build ผ่าน — คนรีวิวไล่ทีละ commit แล้วเชื่อได้
- PR ที่เปลี่ยนเกินราว 400 บรรทัด แบ่งเป็นหลาย PR ต่อกัน
- รูปแบบข้อความใช้ `commit-message-format`

## งานที่ปล่อยทำเอง

playbook `unattended-run` บันทึกชิ้นที่ผ่านแล้วลง `docs/BUILD-PLAN.md` ทุกชิ้น — หยุดกลางทางแล้วรับต่อจากชิ้นสุดท้ายที่ผ่านได้

## ไม่ต้องทำเมื่อ

งานชิ้นเดียวที่ตรวจครั้งเดียวจบ
