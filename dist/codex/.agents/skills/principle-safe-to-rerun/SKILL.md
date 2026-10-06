---
name: principle-safe-to-rerun
description: Use when writing anything that may run twice or stop halfway (migrations, scripts, setup, imports, sync, webhook handlers, retried jobs). Same end state whether it runs once, twice or again after a crash.
---

# principle · safe to rerun — รันกี่รอบก็ได้ผลเหมือนกัน

> ของที่รันได้ครั้งเดียวจะพังในวันที่มันถูกรันสองครั้ง — retry · คนกดซ้ำ · เครื่องดับกลางทาง
> เขียนให้รันกี่รอบผลสุดท้ายก็เหมือนเดิม (idempotent)

## รูปแบบ

| แทนที่จะ | ทำแบบนี้ |
|---|---|
| `INSERT` เปล่า | upsert ด้วย key ธรรมชาติ หรือมี unique constraint กันซ้ำ |
| `CREATE TABLE` · `mkdir` | `IF NOT EXISTS` · `mkdir -p` |
| `balance = balance + 100` | บันทึกรายการด้วย id ที่ไม่ซ้ำ แล้วคำนวณยอดจากรายการ |
| รับ webhook แล้วทำทันที | เก็บ event id ที่ทำแล้ว เจอซ้ำให้ข้าม |
| API ที่สร้างของ | รับ `Idempotency-Key` จาก client (`api-conventions`) |
| สคริปต์แก้ไฟล์ | เช็กว่าแก้แล้วหรือยังก่อนแก้ · แทนค่า ไม่ต่อท้ายซ้ำ |
| ทำทั้งก้อนรวดเดียว | ทำทีละชุด บันทึกจุดที่ทำถึง รันใหม่เริ่มต่อจากจุดนั้น |

## โหมดลองก่อน

สคริปต์ที่แก้ข้อมูลจริงมี `--dry-run` ที่พิมพ์ว่าจะเปลี่ยนอะไรโดยยังไม่เปลี่ยน

## พิสูจน์

- รันสองครั้งติดกัน แล้วเทียบผลกับการรันรอบเดียว — ต้องเหมือนกัน
- หยุดกลางทาง (kill) แล้วรันใหม่ — ต้องจบครบและไม่มีของซ้ำ
- ใส่สองข้อนี้เป็น test ของ migration และสคริปต์ที่ใช้ซ้ำ

## ดูต่อ

งานเบื้องหลังใช้ `background-jobs` · migration ฐานข้อมูลใช้ `database-design`

## ไม่ต้องทำเมื่อ

คำสั่งอ่านอย่างเดียว หรือสคริปต์ที่ใช้ครั้งเดียวแล้วทิ้งใน `_to_delete/`
