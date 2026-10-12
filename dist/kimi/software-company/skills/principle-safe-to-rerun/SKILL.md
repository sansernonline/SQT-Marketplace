---
name: principle-safe-to-rerun
description: Use when writing anything that may run twice or stop halfway (migration, script, import, sync, webhook handler, retried job). Same end state on rerun.
---

# principle · safe to rerun — รันกี่รอบก็ได้ผลเหมือนกัน

> ของที่รันได้ครั้งเดียวจะพังในวันที่มันถูกรัน 2 ครั้ง — retry · คนกดซ้ำ · เครื่องดับกลางทาง
> เขียนให้รันกี่รอบผลสุดท้ายก็เหมือนเดิม (idempotent)

## รูปแบบ

| แทนที่จะ | ทำแบบนี้ |
|---|---|
| `INSERT` เปล่า | upsert ด้วย key ธรรมชาติ หรือมี unique constraint กันซ้ำ |
| `CREATE TABLE` · `mkdir` | `IF NOT EXISTS` · `mkdir -p` |
| `balance = balance + 100` | บันทึกรายการด้วย id ที่ไม่ซ้ำ แล้วคำนวณยอดจากรายการ |
| รับ webhook แล้วทำทันที | เก็บ event id ที่ทำแล้ว ถ้าเจอซ้ำให้ข้าม |
| API ที่สร้างของ | รับ `Idempotency-Key` จาก client (`api-conventions`) |
| สคริปต์แก้ไฟล์ | เช็กก่อนว่าแก้แล้วหรือยัง และแทนค่าเดิม ไม่ต่อท้ายซ้ำ |
| ทำทั้งก้อนรวดเดียว | ทำทีละชุดและบันทึกจุดที่ทำถึง รันใหม่ก็เริ่มต่อจากจุดนั้น |

## โหมดลองก่อน

สคริปต์ที่แก้ข้อมูลจริงมี `--dry-run` ที่พิมพ์ว่าจะเปลี่ยนอะไรโดยยังไม่เปลี่ยน

## พิสูจน์

- รัน 2 ครั้งติดกัน แล้วเทียบผลกับการรันรอบเดียว ผลต้องเหมือนกัน
- หยุดกลางทาง (kill) แล้วรันใหม่ งานต้องจบครบและไม่มีของซ้ำ
- ใส่ 2 ข้อนี้เป็น test ของ migration และสคริปต์ที่ใช้ซ้ำ

## ดูต่อ

งานเบื้องหลังใช้ `background-jobs` ส่วน migration ฐานข้อมูลใช้ `database-design`

## ไม่ต้องทำเมื่อ

คำสั่งอ่านอย่างเดียว หรือสคริปต์ที่ใช้ครั้งเดียวแล้วทิ้งใน `_to_delete/`
