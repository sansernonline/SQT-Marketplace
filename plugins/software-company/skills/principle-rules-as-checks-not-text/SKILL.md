---
name: principle-rules-as-checks-not-text
description: Use when writing the same agent instruction a second time, adding another must-not line, or seeing a correction recur. Encode the rule as structure (folder layout, type, lint, runtime check, script) instead of more text.
---

# principle · rules as checks, not text — กฎที่ต้องพูดซ้ำ ทำเป็นการตรวจ

> ยิ่งเขียนกฎลงข้อความมาก ยิ่งมีโอกาสที่ agent อ่านข้าม และกฎจะเริ่มขัดกันเอง
> กฎที่เป็นการตรวจ ไม่ต้องจำ — ชนแล้วถูกหยุด และข้อความ error บอกทางแก้

## ลำดับชั้น — เลือกชั้นบนสุดที่ทำได้

1. **โครงสร้าง** — ทำให้ทางผิดไม่มีอยู่ (ฟีเจอร์ละโฟลเดอร์ · ทางทำทางเดียว · ลบ API เก่า)
2. **type** — compiler ไม่ยอม
3. **lint หรือสคริปต์ตรวจ** — ข้อความ error ต้องบอกวิธีแก้ ไม่ใช่แค่บอกว่าผิด
4. **ตรวจตอนรันหรือ test** — ล้มทันทีเมื่อเกิด
5. **ข้อความใน skill หรือ prompt** — ทางสุดท้าย และต้องอยู่ที่เดียว

## สัญญาณ

- กฎเดียวกันอยู่ในหลายไฟล์ (เช่น เขียนซ้ำในทุก prompt) → ย้ายไปไว้ที่เดียว แล้วให้ที่อื่นอ้างถึง
- ข้อความ "ห้าม..." ที่ตรวจด้วย grep ได้ → ทำเป็นสคริปต์ใน CI
- ผู้ใช้แก้เรื่องเดิมครั้งที่สอง → [`repeated-mistakes-to-checks`](../repeated-mistakes-to-checks/SKILL.md)

## ตัวอย่างในชุดนี้

| กฎ | เคยเป็นข้อความ | ตอนนี้เป็น |
|---|---|---|
| description ของ skill ห้ามมี `": "` โดยไม่ครอบเครื่องหมายคำพูด | คำเตือนในเอกสาร | `scripts/validate-marketplace.mjs` + `--self-test` |
| ตัวเลขใน README ต้องตรงกับของจริง | แก้มือ | `scripts/sync-docs.mjs --check` |
