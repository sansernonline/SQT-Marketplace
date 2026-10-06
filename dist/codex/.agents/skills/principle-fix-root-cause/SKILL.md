---
name: principle-fix-root-cause
description: Use when debugging or fixing anything broken (error, crash, wrong value, flaky test, slow page). Reproduce first, ask why until the cause, fix there instead of a null check, retry or catch that hides the symptom.
---

# principle · fix root cause — แก้ที่ต้นเหตุ

> การดัก null ที่หน้าจอ ทำให้ error หายไปจากสายตา แต่ข้อมูลผิดยังไหลอยู่ในระบบ

## กฎ

1. **ทำให้เกิดซ้ำก่อนแก้** — ทำซ้ำไม่ได้ = ยังไม่รู้ว่าแก้อะไร · ใช้ skill ตรวจแอปของโปรเจกต์ หรือคำสั่งที่รันได้
2. **ถาม "ทำไม" จนถึงจุดที่ค่าผิดเกิดขึ้นครั้งแรก** — ไม่ใช่จุดที่มันระเบิด
3. **แก้ที่จุดนั้น** แล้วรันกรณีเดิมให้ผ่าน

## ตัวอย่าง

| อาการ | แก้ที่อาการ (ห้าม) | แก้ที่ต้นเหตุ |
|---|---|---|
| หน้ารายงานพังเพราะ `date` เป็น null | `if (date) ...` ที่หน้าจอ | หาว่าทำไม import ไม่ใส่วันที่ → แก้ parser ที่อ่านปี พ.ศ. ไม่ได้ |
| test ล้มบ้างผ่านบ้าง | ใส่ retry 3 ครั้ง | หาว่าแข่งกันที่ไหน → รอสถานะที่ถูกแทนการรอเวลา |
| API ช้า | เพิ่ม cache | วัดก่อนว่าช้าที่ไหน → query ไม่มี index |

## ข้อยกเว้น

แก้ชั่วคราวที่อาการได้ เมื่อระบบจริงกำลังเสียหายและต้องหยุดเลือดก่อน — แต่ต้องลง `decision-log` ว่าเป็นการแก้ชั่วคราว และเปิดงานแก้ต้นเหตุต่อทันที

## ใช้คู่กับ

`targeted-fix` (ขั้นตอนแก้แบบเล็กที่สุด) · playbook `bug-fix` ของ [`agent-team`](../agent-team/SKILL.md)
