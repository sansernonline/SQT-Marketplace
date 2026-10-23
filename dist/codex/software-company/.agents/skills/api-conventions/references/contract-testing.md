# Contract testing — OpenAPI คือสัญญา แล้วให้ CI ตรวจว่าของจริงตรง

เอกสาร `docs/API-CONVENTIONS.md` บอกกติกา · ไฟล์ OpenAPI บอกรูปร่างของแต่ละ endpoint · contract test คือสิ่งที่ทำให้ 2 อย่างนี้ไม่เป็นแค่เอกสาร

## 1 · OpenAPI เป็นสัญญา

- สร้างจากโค้ดจริง (annotation · decorator · generator ของ framework) แล้ว commit ไฟล์ที่ได้ — ไม่เขียนมือแยก · เมื่อ 2 ฝั่งต่างกัน ฝั่งโค้ดคือความจริง และ diff ในไฟล์คือสิ่งที่ reviewer เห็น
- ทุก response มี schema รวมถึง error (`web-service-essentials` §2) · ทุกฟิลด์มี `format` ของวันที่ · id · เงิน ตาม §6 ของ SKILL.md หลัก

## 2 · ตรวจ response กับ spec ใน CI (provider side)

| เครื่องมือ | ทำอะไร | licence | หมายเหตุ (ตรวจ 2026-10-23) |
|---|---|---|---|
| Schemathesis | อ่าน OpenAPI แล้วสร้าง request จาก schema ยิงใส่ service จริง ตรวจว่า response ตรง spec และไม่ 500 · `schemathesis run <url ของ openapi.json>` | MIT | ยิงจริง สร้างและลบข้อมูล → ชี้ไป dev หรือ staging เท่านั้น · Python |
| Prism (Stoplight) | `prism mock <spec>` ให้ frontend ใช้ก่อน backend เสร็จ · `prism proxy <spec> <upstream>` ตรวจ traffic จริงกับ spec | Apache-2.0 | Node ≥ 18.20 · โหมด proxy ใส่หน้า service ใน test environment ได้ |
| Dredd | ตรวจ API กับ API Blueprint / OpenAPI 2 (OpenAPI 3 ทดลอง) | MIT | **เลิกดูแลแล้ว** (archived 2024-11-08) — ไม่เริ่มใช้ใหม่ |

ค่าเริ่มของเรา: Schemathesis ใน job ของ CI หลัง service ขึ้นด้วยข้อมูลทดสอบ (reset endpoint จาก `app-verifier-setup`) · ล้ม = ไม่ merge

## 3 · Consumer-driven contract — เมื่อทีม frontend หรือผู้เรียกแยกจาก backend

- Pact (pact-foundation · MIT): ฝั่งผู้เรียกเขียน test ว่าใช้ request/response คู่ไหนบ้าง → ได้ไฟล์ pact → ฝั่ง provider รันตรวจกับไฟล์นั้นใน CI ของตัวเอง · provider เปลี่ยนส่วนที่ไม่มีใครใช้ได้โดย test ไม่พัง
- ใช้เมื่อ: ทีมคนละชุด ปล่อยคนละรอบ หรือมีผู้เรียกมากกว่า 1 ราย (mobile + web + partner) · ทีมเดียวทำทั้ง 2 ฝั่ง → ข้อ 2 พอ
- ไฟล์ pact แลกกันผ่าน Pact Broker หรือ commit ลง repo ของ provider — ตกลงที่เดียวใน `API-CONVENTIONS.md`

## 4 · เช็ค breaking change ทุก PR

- `oasdiff breaking <spec เดิม> <spec ใหม่>` (Apache-2.0 · Go · มี Docker image) รายงานเฉพาะการเปลี่ยนที่ทำให้ผู้เรียกเดิมพัง: ลบ endpoint หรือฟิลด์ · ฟิลด์กลายเป็น required · type เปลี่ยน · enum หาย
- ใน CI: spec เดิม = ของ branch หลัก · spec ใหม่ = ของ PR · เจอ breaking → ต้องขึ้นเวอร์ชันใหม่ตาม §3 หรือ deprecate ตาม §10 ของ SKILL.md หลัก — ไม่ใช่ปิด check
- เพิ่มฟิลด์ optional · เพิ่ม endpoint · เพิ่มค่า enum ที่ผู้เรียกไม่ switch ตาย = ไม่ breaking

## ตรวจก่อนส่ง

- [ ] OpenAPI อยู่ใน repo และสร้างจากโค้ด · CI ล้มถ้าไฟล์ไม่ตรงโค้ด
- [ ] Schemathesis (หรือเทียบเท่า) รันกับ service ที่ขึ้นด้วยข้อมูลทดสอบ · `oasdiff breaking` รันทุก PR
- [ ] ผู้เรียกแยกทีม → มี pact อย่างน้อย 1 ไฟล์ต่อผู้เรียก และ provider ตรวจใน CI
