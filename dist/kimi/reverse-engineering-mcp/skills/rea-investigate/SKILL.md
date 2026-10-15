---
name: "rea-investigate"
description: "Investigate how a feature works inside an authorized binary, app or package with REA, with evidence for every claim."
disableModelInvocation: true
---

ใช้ skill `reverse-engineer-anything` กับ: **$ARGUMENTS**

1. **สิทธิ์** — ถามเหตุผลที่ผู้ใช้มีสิทธิ์ แล้วจดบรรทัดแรกของ `_to_delete/re/<ชื่อเป้าหมาย>/notes.md` (skill หัวข้อ 1) · ไม่มีเหตุผล หรือเป็นงานเลี่ยง DRM สัญญาอนุญาต anti-cheat ทำโปรแกรมโกง หรือ malware → หยุด
2. **ตัวตน** — คัดลอกเป้าหมายลงโฟลเดอร์นั้น จด SHA-256 · ติดตั้ง software-company ไว้ให้รัน `triage.py` ของ `software-company:reverse-engineering` ก่อน · เป็น .NET ที่อยากได้ C# ให้ส่งไปทาง `ilspycmd` แทน
3. **คำถาม** — แตก "$ARGUMENTS" เป็นรายการคำถาม พร้อมหลักฐานที่แต่ละข้อต้องใช้
4. **วิเคราะห์ static** — เลือก tool แรกตามตารางใน skill หัวข้อ 3 · ขอ summary ก่อนแล้วค่อยเจาะ
5. **runtime เฉพาะเมื่อ static ตอบไม่ได้** — บอกผู้ใช้ว่าจะรันอะไร แล้วรอคำอนุญาตทุกครั้ง · เป้าหมายไม่น่าไว้ใจใช้ `software-company:docker-sandbox`
6. **รายงาน** — คำตอบก่อน · เรื่องเล่า "ฟีเจอร์ X ทำงานโดย A เรียก B เก็บที่ C มี D คุม" · ตารางหลักฐาน (ข้อสรุป · Evidence ID · ป้าย `จากแหล่ง`/`ตรวจจริง`/`อนุมาน`/`ยังไม่ได้ตรวจ`) · สิ่งที่ยังไม่รู้และวิธีตอบ · secret ที่เจอบอกแค่ชื่อและตำแหน่ง
7. **ปิด** — `export_evidence_bundle` ลงโฟลเดอร์งานถ้าต้องเก็บ แล้ว `close_binary`
