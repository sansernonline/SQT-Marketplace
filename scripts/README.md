# scripts/

สคริปต์ให้คนรันเอง ไม่ใช่ส่วนหนึ่งของ plugin — Claude ไม่ได้โหลดไฟล์ในโฟลเดอร์นี้

| ไฟล์ | ทำอะไร | รันเมื่อไหร่ |
|------|--------|---|
| `validate-marketplace.mjs` | ตรวจ frontmatter / ชื่อ / ความยาว ของทุก skill · agent · plugin | **ก่อน commit ทุกครั้ง** |
| `sync-docs.mjs` | เขียนตัวเลขนับและรายการ skill ในเอกสารจากของจริงใน `plugins/` | **หลังเพิ่มหรือลบ skill / agent / command** |
| `install-marketplace.ps1` | ติดตั้ง marketplace นี้จากโฟลเดอร์ในเครื่อง | ครั้งแรก และเมื่อเพิ่ม plugin ใหม่ |

---

## 1 · validate-marketplace.mjs

```bash
node scripts/validate-marketplace.mjs --self-test   # พิสูจน์ว่าตัวตรวจยังจับบั๊กได้
node scripts/validate-marketplace.mjs               # แล้วค่อยตรวจจริง
```

ออก exit code 1 เมื่อเจอ error — ใช้เป็นประตูใน continuous integration (CI) ได้ · ไม่ใช้ dependency ภายนอก

**รัน `--self-test` ก่อนเสมอ** ไม่งั้นตัวตรวจที่พังจะรายงานว่าทุกอย่างเรียบร้อย

### ตรวจอะไร

| ระดับ | รายการ |
|---|---|
| error | frontmatter หาย/ปิดไม่ครบ · **ค่าที่มี `": "` โดยไม่ครอบเครื่องหมายคำพูด** · `name` ไม่ตรงชื่อโฟลเดอร์ · `name` ผิดรูปแบบหรือมีคำว่า claude/anthropic · ไม่มี `description` · `description` เกิน 1024 หรือมีแท็ก `< >` · เนื้อหาเกิน 500 บรรทัด · agent ใช้ `allowed-tools:` แทน `tools:` · `plugin.json` หาย/พัง/`version` ผิดรูป · plugin ที่มีจริงแต่ไม่ได้ประกาศใน `marketplace.json` |
| warning | `description` สั้นกว่า 60 ตัว หรือไม่บอกว่าใช้เมื่อไหร่ · เนื้อหาเกิน 400 บรรทัด · ไฟล์ใน `references/` เกิน 100 บรรทัดแต่ไม่มีสารบัญ · README ไม่พูดถึง plugin บางตัว |

### กับดักหลักที่มันมีไว้จับ

```yaml
description: ... as a working system: a token contract ...
                                    ^^ ตรงนี้
```

`": "` ในค่าที่ไม่ได้ครอบเครื่องหมายคำพูด ทำให้ YAML **parse ทั้งบล็อกไม่ผ่าน** →
loader ทิ้ง field ทุกตัว → **skill ไม่เคยถูกเรียก และไม่มี error ให้เห็น**
เจอมาแล้ว 3 ตัวในรีโปนี้ · แก้โดยเปลี่ยน `: ` เป็น ` — ` หรือครอบด้วย `"..."`

### สองกฎที่ฝังอยู่ในสคริปต์

- **ตรวจศูนย์รายการ = พัง ไม่ใช่ผ่าน** — path ผิดแล้วขึ้นเขียวคือบั๊กที่อยู่ได้เป็นเดือน
- **`--self-test` พิสูจน์ว่ากฎยังยิงโดนเป้า** — ป้อนไฟล์พังจริง 4 แบบแล้วยืนยันว่าจับได้ครบ

---

## 2 · install-marketplace.ps1

```powershell
.\scripts\install-marketplace.ps1
.\scripts\install-marketplace.ps1 -WhatIf     # ดูก่อนว่าจะทำอะไร
```

เพิ่ม marketplace ด้วย **path ของโฟลเดอร์นี้** (ไม่ใช่ชื่อรีโปบน GitHub) แล้วติดตั้งทุก plugin
ที่ประกาศไว้ใน `marketplace.json` · รัน validator ก่อนเสมอ · รันซ้ำได้

**ผลของการเพิ่มด้วย path:** Claude Code อ่านจากโฟลเดอร์นี้โดยตรง —
แก้ `SKILL.md` แล้ว `/reload-plugins` เห็นผลทันที ไม่ต้อง commit

ถ้าจะให้คนอื่นติดตั้ง ใช้ `sansernonline/SQT-Marketplace` แทน (ดู [README หลัก](../README.md))

> Claude Code กับ Cowork อ่าน `~\.claude\settings.json` ไฟล์เดียวกัน — ติดตั้งครั้งเดียวเห็นทั้งคู่
> แต่ต้องปิดเปิดใหม่ทั้งสองโปรแกรม

---

## รันสคริปต์ไม่ได้

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\<ชื่อไฟล์>.ps1
```

## ใส่ใน CI

```yaml
- run: node scripts/validate-marketplace.mjs --self-test
- run: node scripts/validate-marketplace.mjs
```

---

## สถานะการทดสอบ

| ไฟล์ | สถานะ |
|---|---|
| `validate-marketplace.mjs` | ✅ รันจริงกับทั้งรีโป + `--self-test` ผ่าน 4/4 |
| `install-marketplace.ps1` | ✅ ทดสอบบน PowerShell 7.4 ครบทุกเส้นทาง |

---

## 3 · sync-docs.mjs

```bash
node scripts/sync-docs.mjs --check   # ตรวจว่าเอกสารตรงกับของจริงไหม (CI)
node scripts/sync-docs.mjs           # เขียนทับให้ตรง
```

**แหล่งความจริงคือโฟลเดอร์ `plugins/` เท่านั้น** เอกสารทุกไฟล์เป็นผลลัพธ์ที่สร้างจากที่นั่น

| ไฟล์ที่ถูกเขียน | เขียนอะไร |
|---|---|
| `README.md` | บรรทัดยอดรวม และตัวเลขสามคอลัมน์ในตาราง plugin ทุกแถว |
| `docs/PLUGINS.md` | จำนวน plugin · ตัวเลขของแต่ละ plugin · บล็อก Marketplace Total |
| `docs/REFERENCE.md` | เลขในหัวข้อ Agents/Skills/Commands · บล็อก skill ทั้งหมด พร้อมเลขลำดับและบรรทัด `**ใช้กับ:**` |
| `plugins-global/README.md` | บรรทัด "ในไฟล์:" พร้อมเลขเวอร์ชันจาก `plugin.json` |

**บรรทัดคำอธิบายที่เขียนมือใน `docs/REFERENCE.md` ไม่หาย** — สคริปต์เก็บทุกบรรทัดที่ขึ้นต้นด้วย `**`
(เช่น `**Includes:**` `**Anti-patterns ที่กันไว้:**`) แล้วย้ายตามไปให้เอง
มีแต่ `**ใช้กับ:**` ที่ถูกเขียนใหม่ เพราะหาได้จากการที่ agent อ้างชื่อ skill นั้นจริง ๆ

skill ใหม่ที่ยังไม่มีบล็อกใน `REFERENCE.md` จะถูกต่อท้ายพร้อม `description` จาก frontmatter
เขียนคำอธิบายมือเพิ่มทีหลังได้ รันซ้ำแล้วไม่หาย

`validate-marketplace.mjs` เรียก `--check` ให้อัตโนมัติ ถ้าไม่ตรงจะขึ้นคำเตือนและ exit code 1
