# prompt — ชุดคำสั่งสร้างเอกสารโปรเจกต์

ใช้คู่กับ plugin `software-company` · หนึ่งไฟล์ = หนึ่งหน้าที่งาน ในไฟล์มีหลาย prompt (ฉบับ) แต่ละฉบับสร้างเอกสารหนึ่งชุด

## วิธีใช้

1. เปิด Claude Code, Codex CLI หรือ Gemini CLI ที่**รากโฟลเดอร์โปรเจกต์**
2. วางทั้งไฟล์ แล้วพิมพ์ต่อท้ายว่าจะทำฉบับไหน เช่น `ทำทั้งหมด` หรือ `ทำข้อ 3 และ 4`
3. agent ทำทีละฉบับ จบแต่ละฉบับจะหยุดรายงาน แล้วรอคุณตรวจ — พิมพ์ `ต่อ` หรือสั่งแก้

## รายการไฟล์

| ไฟล์ | ใช้เมื่อ | ฉบับในไฟล์ |
|---|---|---|
| `prompt-new-project.md` | เปิดโปรเจกต์ใหม่ | **0 research แอปต้นแบบ** (เช่น "อยากได้แบบ MobaXterm") · 1 project plan · 2 BRD · 3 SRS · 4 mockup · 5 ตรวจ mockup · 6 architecture + ADR · 7 FSD · 8 test plan + test case · 9 tech doc · **10 prompt agent-loop ของโปรเจกต์** · 11 user guide · 12 ตรวจเอกสาร · 13 render .docx/.pdf |
| `prompt-change.md` | มีคำขอเปลี่ยน / พบบั๊ก หลังส่งงาน | 1 change request · 2 bugfix |
| `prompt-quality.md` | ตรวจคุณภาพก่อนปล่อยหรือตามรอบ | 1 security review · 2 code review · 3 doc sync (เอกสารกับโค้ดไม่ตรงกัน) |
| `prompt-release.md` | เตรียม deploy / ออกรุ่น | 1 deploy guide · 2 release notes · 3 runbook |
| `prompt-brownfield.md` | มีโค้ดอยู่แล้วแต่ไม่มีเอกสาร | 1 reverse spec (`docs/as-is/`) |
| `prompt-handover.md` | ส่งงานต่อ / ปิดโครงการ | 1 handover · 2 retrospective |
| `prompt-manual.md` | ทำคู่มือและอบรมผู้ใช้ | 1 user manual แยกบทบาท · 2 training guide |

## โครงโฟลเดอร์ของโปรเจกต์ที่ prompt สร้างไฟล์ลงไป

```
<project>/
├─ ref/          ไฟล์ที่ได้รับมา (TOR บันทึกประชุม ภาพระบบเดิม) — อ่านอย่างเดียว
├─ docs/         เอกสารทุกฉบับที่เราเขียน · BUILD-PLAN.md (สถานะ) · AGENT-LOOP.md
│  ├─ figures/   รูปในเอกสาร + src/ ไฟล์ต้นทาง
│  ├─ decisions/ ADR
│  └─ research/  research แอปต้นแบบ
├─ mockup/       UI mockup (.html กดได้จริง)
├─ qa/           test case · ผลทดสอบ · bugs/
├─ assets/       โลโก้ ไอคอน favicon
├─ _to_delete/   ของชั่วคราว
└─ <repo>/       โค้ด
```

สร้างโฟลเดอร์เมื่อมีของจริงเท่านั้น — รายละเอียดอยู่ใน skill `project-doc-set`

## agent-loop

ไม่มี prompt agent-loop แบบสำเร็จรูป — ฉบับที่ 10 ของ `prompt-new-project.md` **สร้าง `docs/AGENT-LOOP.md` เฉพาะโปรเจกต์นั้น** จากเอกสารที่ทำไว้ (ข้อกำหนด คำสั่ง test path ของ mockup) แล้วค่อยนำ prompt นั้นไปใช้เขียนโปรแกรมใน repo ของโปรเจกต์

## หมายเหตุ

- ทุกฉบับสร้างเอกสารอย่างเดียว ไม่แก้โค้ด — ยกเว้น bugfix ที่มีช่องให้ติ๊กอนุญาตแก้เอง
- `prompt-new-project.md` ฉบับ 11 (คู่มือเล่มเดียว) กับ `prompt-manual.md` ฉบับ 1 (แยกบทบาท) ซ้อนกัน เลือกใช้อย่างใดอย่างหนึ่ง
- ไฟล์แยกรายฉบับรุ่นเก่าและ `agent-loop.ps1` เก็บไว้ที่ `../_to_delete/prompt-folders-backup/` — ลบได้เมื่อไม่ต้องการ
