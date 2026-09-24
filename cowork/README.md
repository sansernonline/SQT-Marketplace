# software-company.zip — plugin ระดับ account

ไฟล์นี้คือ plugin `software-company` ที่บีบอัดไว้สำหรับ **อัปโหลดเข้า claude.ai** เพื่อให้ใช้ skill ได้ใน Cowork และแชทบนเว็บ/เดสก์ท็อป — ไม่ใช่เฉพาะ Claude Code

**ในไฟล์:** 38 skills · 13 agents · 15 commands · `plugin.json` v1.15.0 · โฟลเดอร์หลักในไฟล์ zip ชื่อ `software-company/`

---

## 📤 อัปโหลด

1. เปิด **claude.ai บนเว็บ** (เมนูนี้ยังไม่มีในแอปเดสก์ท็อป)
2. **Customize → Plugins → `+`** → Upload custom plugin
3. เลือก `software-company.zip`

**ถ้าเคยอัปโหลดตัวเก่าไว้แล้ว** ต้องลบตัวเก่าออกก่อนแล้วอัปโหลดใหม่ ไม่งั้นจะเป็น skill ชุดเดิม

ข้อจำกัด: ไฟล์ ≤ 50 MB · 1 marketplace เก็บได้ ≤ 100 plugins

---

## ✅ ใช้ได้ที่ไหนบ้าง

| | skills | commands | agents | hooks |
|---|:---:|:---:|:---:|:---:|
| Cowork | ✅ | ✅ | ✅ | ✅ |
| แชทเว็บ / แท็บ Chat ในเดสก์ท็อป | ✅ | ✅ | ⛔ เทา | ⛔ เทา |

skill ทำงานทุกที่ · agent กับ hook จะเป็นสีเทาในหน้าแชทธรรมดา

---

## 🔄 สร้าง zip ใหม่หลังแก้ skill

แก้ไฟล์ใน `plugins/software-company/` แล้วสำเนาที่อัปโหลดไว้จะ **ไม่อัปเดตตาม** ต้อง build ใหม่แล้วอัปโหลดทับ

```bash
node scripts/validate-marketplace.mjs          # ตรวจก่อนเสมอ
cd plugins
rm -f ../cowork/software-company.zip
zip -q -r -X ../cowork/software-company.zip software-company
```

PowerShell:

```powershell
node scripts\validate-marketplace.mjs
Remove-Item cowork\software-company.zip -ErrorAction SilentlyContinue
Compress-Archive -Path plugins\software-company -DestinationPath cowork\software-company.zip
```

> ⚠️ ต้อง zip จากในโฟลเดอร์ `plugins/` เพื่อให้โฟลเดอร์หลักในไฟล์เป็น `software-company/` ไม่ใช่ `plugins/software-company/`

---

## 🔗 ต่างจาก Claude Code อย่างไร

| | ไฟล์ zip นี้ (ระดับ account) | `/plugin install` (Claude Code) |
|---|---|---|
| ใช้ได้ที่ | Cowork + แชททุกช่องทาง | Claude Code เท่านั้น |
| แหล่งไฟล์ | สำเนาที่อัปโหลด | GitHub หรือ path ในเครื่อง |
| แก้ไฟล์แล้ว | zip ใหม่ + อัปโหลดทับ | `/reload-plugins` หรือ push |

ทั้งสองทางใช้ร่วมกันได้ — แต่ถ้าแก้ skill ต้องอัปเดตทั้งคู่

---

## หมายเหตุ

- ตอนนี้ `cowork/` **ยังไม่อยู่ใน `.gitignore`** ไฟล์ zip 384 KB จะถูก commit ขึ้น git ด้วย ถ้าไม่ต้องการให้เพิ่ม `cowork/` ลงใน `.gitignore`

---

## ตัวย่อ

- **zip** — ไฟล์บีบอัดรูปแบบ ZIP
- **MB** — megabyte (เมกะไบต์)
- **KB** — kilobyte (กิโลไบต์)
