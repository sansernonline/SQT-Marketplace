---
name: principle-replace-then-delete
description: Use when replacing an API, function, table, component or pattern, or during a planned migration or rewrite. Clear dead weight first, move every caller in the same wave, delete the old path, leave no compatibility layer.
---

# principle · replace then delete — ย้ายให้ครบ แล้วลบของเก่าในรอบเดียวกัน

> ของเก่าที่ "เก็บไว้ก่อนเผื่อใช้" จะอยู่ตลอดไป และคนต่อไปไม่รู้ว่าควรใช้ตัวไหน

## ขั้นตอน

1. **ลบก่อนเพิ่ม** — เอาโค้ดตาย · validator ที่ซ้ำ · stub · flag ที่เปิดถาวรแล้ว ออกก่อน แล้วสร้างบนฐานที่เล็กลง
2. **นับผู้ใช้ของเก่าทั้งหมด** ด้วยคำสั่งที่รันซ้ำได้ (grep · find references) — ตัวเลขนี้คือหลักฐาน
3. **สร้างของใหม่ตามรูปที่ควรเป็น** ไม่ดัดให้หน้าตาเหมือนของเก่า
4. **ย้ายผู้ใช้ทุกตัว** — เกิน 10 จุดใช้ codemod ([`principle-build-a-tool-not-handwork`](../principle-build-a-tool-not-handwork/SKILL.md))
5. **ลบของเก่าใน PR หรือชุดเดียวกัน** แล้วรันคำสั่งในข้อ 2 ซ้ำ — ต้องได้ 0

## ห้าม

- wrapper ที่เรียกของใหม่ผ่านชื่อเก่า "ชั่วคราว"
- flag สลับเก่า-ใหม่ที่ไม่มีวันถอด
- โค้ดรองรับสภาพครึ่งทางระหว่างเฟสของ migration ที่วางแผนไว้แล้ว — มุ่งไปที่ปลายทางตรง ๆ

## ข้อยกเว้น — ต้องมีชั้นรองรับจริง

| กรณี | ทำ |
|---|---|
| API สาธารณะที่คนนอกเรียก | deprecate ตาม `api-conventions` แล้วกำหนดวันลบ |
| ตารางฐานข้อมูลที่รันอยู่จริง | expand-and-contract ตาม `database-design` |
| แอปมือถือรุ่นเก่ายังใช้งานอยู่ | รองรับถึงรุ่นขั้นต่ำที่บังคับอัปเดต |

ทุกข้อยกเว้นลง `decision-log` พร้อมวันที่จะลบ
