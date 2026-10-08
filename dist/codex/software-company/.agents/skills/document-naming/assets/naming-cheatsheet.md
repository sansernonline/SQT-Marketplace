# แผ่นสรุปการตั้งชื่อเอกสาร

## รหัสประเภทเอกสาร

| รหัส | เอกสาร |
|---|---|
| `BRD` | Business Requirements Document |
| `SRS` | Software Requirements Specification |
| `FSD` | Functional Specification Document |
| `ADR` | Architecture Decision Record |
| `API` | API Specification |
| `UAT` | User Acceptance Test Plan / Result |
| `MAN` | คู่มือผู้ใช้ (Manual) |
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
TRS-DECK-kickoff-v1.0-2026-08-15.pptx     สไลด์เปิดโครงการ

docs/srs.md                               ต้นฉบับใน repo — ไม่มีเวอร์ชันในชื่อ
docs/fsd-recording.md
docs/adr/0007-เลือก-whisper.md
docs/meetings/2026-09-25-kickoff.md
docs/releases/                            ไฟล์ส่งออกทั้งหมดอยู่ที่นี่
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
| **สถานะ** | 🟢 APPROVED |
| **วันที่** | 2026-09-25 |
| **ผู้จัดทำ** | |
| **ผู้อนุมัติ** | |
| **ต้นฉบับ** | `docs/srs.md` |
```

> บรรทัด **ต้นฉบับ** สำคัญ เพราะบอกคนที่ถือไฟล์ Word ว่าถ้าจะแก้ต้องไปแก้ที่ไหน

## รายการตรวจก่อนส่งออก

- [ ] ชื่อไฟล์มีเวอร์ชันและสถานะ
- [ ] ตารางประวัติการแก้ไขอัปเดตแล้ว คอลัมน์ "แก้อะไร" เป็นรูปธรรม
- [ ] หน้าปกระบุเส้นทางต้นฉบับ
- [ ] ส่ง PDF คู่กับ docx
- [ ] ไฟล์อยู่ใน `docs/releases/` ไม่ใช่รากโปรเจกต์
- [ ] ถ้าฉบับก่อนเป็น APPROVED — ไม่ได้แก้ทับ แต่ขึ้นเวอร์ชันใหม่
