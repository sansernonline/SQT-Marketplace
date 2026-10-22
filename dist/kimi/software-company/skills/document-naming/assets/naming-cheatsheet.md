# แผ่นสรุปการตั้งชื่อเอกสาร

## รหัสประเภทเอกสาร

| รหัส | เอกสาร |
|---|---|
| `PLAN` | แผนโครงการ (Project Plan) |
| `BRD` | Business Requirements Document |
| `SRS` | Software Requirements Specification |
| `FSD` | Functional Specification Document |
| `ARCH` | เอกสารสถาปัตยกรรม (Architecture) |
| `ADR` | Architecture Decision Record |
| `API` | API Specification |
| `TESTPLAN` | แผนทดสอบ (Test Plan) |
| `UAT` | User Acceptance Test Plan / Result |
| `MAN` | คู่มือผู้ใช้ (Manual) — แยกบทบาทด้วยเรื่อง เช่น `MAN-admin` |
| `CHECKLIST` | รายการตรวจเอกสารส่งมอบ (Document Checklist) |
| `PROP` | ข้อเสนอโครงการ (Proposal) |
| `RPT` | รายงาน (Report) |
| `DECK` | สไลด์นำเสนอ |
| `MOM` | บันทึกการประชุม (Minutes of Meeting) |

## ตัวอย่างชื่อไฟล์

```
TRS-PROP-v1.0-APPROVED-2026-08-01.pdf     ข้อเสนอที่ลูกค้าอนุมัติ
TRS-SRS-v1.2-APPROVED.docx                ข้อกำหนดฉบับเซ็นรับ
TRS-FSD-recording-v0.3-DRAFT.docx         FSD เฉพาะส่วนอัดเสียง ยังร่างอยู่
TRS-UAT-v1.0-REVIEW.xlsx                  แผนทดสอบตรวจรับ รอความเห็น
TRS-MAN-admin-v1.0-APPROVED.pdf           คู่มือผู้ดูแลระบบ
TRS-DECK-kickoff-v1.0-APPROVED-2026-08-15.pptx  สไลด์เปิดโครงการ

docs/src/srs.md                           ต้นฉบับ markdown ที่ render เป็น docx — เก็บถาวร ไม่ใช่ใน _to_delete/
docs/decisions/ADR-0007-choose-whisper.md เอกสารเชิงเทคนิค (`docs/` ที่ราก) — ไม่มีเวอร์ชันในชื่อ
docs/meetings/2026-09-25-kickoff.md
```

## แม่แบบตารางประวัติการแก้ไข

วางไว้ **หน้าแรก** ของทุกเอกสารส่งออก

```markdown
## ประวัติการแก้ไข

| เวอร์ชัน | วันที่ | ผู้แก้ | แก้อะไร | เหตุผล |
|---|---|---|---|---|
| 1.2 | 2026-09-25 | | | |
| 1.1 | | | | |
| 1.0 | | | ฉบับเซ็นรับ | — |
```

## แม่แบบหน้าปก

```markdown
| | |
|---|---|
| **เอกสาร** | Software Requirements Specification |
| **โครงการ** | <ชื่อโครงการ> |
| **เวอร์ชัน** | 1.2 |
| **สถานะ** | APPROVED |
| **วันที่** | 2026-09-25 |
| **ผู้จัดทำ** | |
| **ผู้อนุมัติ** | |
| **ต้นฉบับ** | `docs/src/srs.md` |
```

> บรรทัด **ต้นฉบับ** สำคัญ เพราะบอกคนที่ถือไฟล์ Word ว่าถ้าจะแก้ต้องไปแก้ที่ไหน

## รายการตรวจก่อนส่งออก

- [ ] ชื่อไฟล์มีเวอร์ชันและสถานะ
- [ ] ตารางประวัติการแก้ไขอัปเดตแล้ว คอลัมน์ "แก้อะไร" เป็นรูปธรรม
- [ ] หน้าปกระบุเส้นทางต้นฉบับ
- [ ] PDF ทำเฉพาะคู่มือผู้ใช้ หรือเมื่อลูกค้าขอ — นอกนั้นส่ง docx ฉบับเดียว
- [ ] ไฟล์อยู่ในโฟลเดอร์เอกสาร (`docs/`) หรือที่เก็บของลูกค้า ไม่ใช่รากโปรเจกต์
- [ ] ถ้าฉบับก่อนเป็น APPROVED — ไม่ได้แก้ทับ แต่ขึ้นเวอร์ชันใหม่
