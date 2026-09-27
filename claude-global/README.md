# claude-global — ค่าตั้งระดับเครื่อง

ไฟล์ในโฟลเดอร์นี้ **ไม่ได้ติดไปกับปลั๊กอิน** — ปลั๊กอินตามบัญชีไปเอง
แต่ `~/.claude/CLAUDE.md` เป็นไฟล์บนเครื่อง ต้องติดตั้งใหม่ทุกครั้งที่ย้ายเครื่อง

| ไฟล์ | คืออะไร |
|---|---|
| `CLAUDE.global.md` | ต้นฉบับกฎประจำตัว — แก้ที่นี่ที่เดียว |
| `install-global.ps1` | ติดตั้งบน Windows |
| `install-global.sh` | ติดตั้งบน macOS / Linux |

## เครื่องใหม่ ทำ 2 อย่าง

```powershell
# 1. กฎประจำตัว
git clone <repo> && cd SQT-Marketplace\claude-global
powershell -ExecutionPolicy Bypass -File .\install-global.ps1
```

```
# 2. ปลั๊กอิน (ใน Claude Code)
/plugin marketplace add <repo>
/plugin install software-company@sqt-marketplace
```

## อะไรควรอยู่ไฟล์ไหน

| อยู่ใน `CLAUDE.global.md` | อยู่ใน skill |
|---|---|
| กฎสั้น ๆ ที่ต้องเห็นตลอดเวลา | ตาราง เกณฑ์ ตัวอย่าง รายละเอียด |
| อยู่ใน context ทุกเซสชัน = มีต้นทุน | โหลดเมื่อตรงงานเท่านั้น = ฟรีจนกว่าจะใช้ |

**เกณฑ์:** ถ้ากฎนั้นต้องเตือนตอนที่โมเดลกำลังจะพลาด ให้อยู่ที่นี่ · ถ้าเป็นความรู้ที่ไปเปิดอ่านได้ทัน ให้อยู่ใน skill

ไฟล์นี้ควรยาวไม่เกิน **40 บรรทัด** — ทุกบรรทัดจ่ายต้นทุนทุกเซสชันของทุกโปรเจกต์
