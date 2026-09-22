# scripts/

สคริปต์ช่วยงานของรีโปนี้ ไม่ใช่ส่วนหนึ่งของ plugin — Claude ไม่ได้โหลดไฟล์ในโฟลเดอร์นี้
เป็นเครื่องมือให้คนรันเอง

| ไฟล์ | ทำอะไร |
|------|--------|
| `sync-global-skills.ps1` | คัดลอก core skills ทั้งหมดไปเป็น personal skill ที่ `%USERPROFILE%\.claude\skills\` |
| `validate-marketplace.mjs` | ตรวจ frontmatter, ชื่อ, ความยาว และความครบถ้วนของทุก skill/agent/plugin |

---

## validate-marketplace.mjs

```bash
node scripts/validate-marketplace.mjs              # ตรวจทั้ง marketplace
node scripts/validate-marketplace.mjs --warn       # ให้ warning นับเป็น error ด้วย
node scripts/validate-marketplace.mjs --self-test  # พิสูจน์ว่าตัวตรวจยังจับบั๊กได้จริง
```

ออก exit code 1 เมื่อเจอ error — ใช้เป็นประตูใน continuous integration (CI) ได้เลย
ไม่ใช้ dependency ภายนอก

### ตรวจอะไรบ้าง

| ระดับ | รายการ |
|---|---|
| error | frontmatter หาย/ปิดไม่ครบ · **ค่าที่มี `": "` โดยไม่ครอบเครื่องหมายคำพูด** · `name` ไม่ตรงชื่อโฟลเดอร์หรือชื่อไฟล์ · `name` ผิดรูปแบบหรือมีคำว่า claude/anthropic · ไม่มี `description` · `description` ยาวเกิน 1024 หรือมีแท็ก `< >` · เนื้อหาเกิน 500 บรรทัด · agent ใช้คีย์ `allowed-tools:` แทน `tools:` · `plugin.json` หาย/พัง/`version` ผิดรูป · plugin ที่มีจริงแต่ไม่ได้ประกาศใน `marketplace.json` (และกลับกัน) |
| warning | `description` สั้นกว่า 60 ตัวอักษร หรือไม่ได้บอกว่าใช้เมื่อไหร่ · เนื้อหาเกิน 400 บรรทัด · ไฟล์ใน `references/` ยาวเกิน 100 บรรทัดแต่ไม่มีสารบัญ · README ไม่พูดถึง plugin บางตัว |

### กับดักที่ตัวตรวจนี้มีไว้จับเป็นหลัก

```yaml
description: ... as a working system: a token contract ...
                                    ^^ ตรงนี้
```

`": "` ในค่าที่ไม่ได้ครอบด้วยเครื่องหมายคำพูด ทำให้ YAML **parse ทั้งบล็อกไม่ผ่าน**
loader จะทิ้ง field ทุกตัว → skill ไม่มี `name` ไม่มี `description` → **ไม่เคยถูกเรียกเลย
และไม่มี error ให้เห็น** · เจอมาแล้ว 3 ตัวในรีโปนี้ (แก้แล้ว)

แก้โดยเปลี่ยน `: ` เป็น ` — ` หรือครอบค่าทั้งหมดด้วย `"..."`

### สองกฎที่อยู่ในตัวสคริปต์เอง

**ตรวจศูนย์รายการ = พัง ไม่ใช่ผ่าน** — ถ้าหาไฟล์ไม่เจอเลย สคริปต์ออก exit 1
พร้อมบอกว่า "ไม่ได้ตรวจอะไรเลย" ไม่ใช่ขึ้นเขียวแล้วเงียบ · ตัวตรวจที่ path ผิด
แล้วขึ้นเขียวคือบั๊กที่อยู่ได้เป็นเดือนโดยไม่มีใครรู้

**`--self-test` พิสูจน์ว่ากฎยังยิงโดนเป้า** — ป้อนไฟล์ที่พังจริง 4 แบบ
แล้วยืนยันว่าจับได้ทุกแบบ รันก่อนเชื่อผลทุกครั้งที่แก้ตัวสคริปต์

### ใส่ใน CI

```yaml
- run: node scripts/validate-marketplace.mjs --self-test
- run: node scripts/validate-marketplace.mjs
```

รัน `--self-test` **ก่อน** เสมอ — ไม่งั้นตัวตรวจที่พังจะรายงานว่าทุกอย่างเรียบร้อย

---

## sync-global-skills.ps1

### ใช้ตอนไหน

ตอนกำลังแก้ skill อยู่แล้วอยากลองทันที โดยไม่ต้อง commit และไม่ต้องติดตั้ง plugin ใหม่

ถ้าไม่ได้กำลังแก้อะไร ให้ใช้ทาง plugin แทน — ได้ agent กับ command ไปด้วย
และใช้ได้ทั้ง Claude Code และ Cowork:

```
/plugin marketplace update sqt-marketplace
/plugin update software-company@sqt-marketplace
```

### วิธีรัน

```powershell
cd "C:\_DATA\Personal\Work\_KK\Agent Skill - Sub Agents & Agent Skills\SQT-Marketplace"
.\scripts\sync-global-skills.ps1
```

แล้วรีสตาร์ท Claude Code

### พารามิเตอร์

| พารามิเตอร์ | ค่าเริ่มต้น | ใช้ทำอะไร |
|---|---|---|
| `-WhatIf` | — | แสดงว่าจะทำอะไรบ้าง แต่ไม่เขียนจริง · **รันอันนี้ก่อนเสมอตอนใช้ครั้งแรก** |
| `-Destination` | `%USERPROFILE%\.claude\skills` | เปลี่ยนปลายทาง เช่น ทดสอบลงโฟลเดอร์ชั่วคราวก่อน |
| `-Verbose` | — | บอกทีละไฟล์ว่าคัดลอกอะไรไป |

```powershell
# ดูก่อนว่าจะทำอะไร
.\scripts\sync-global-skills.ps1 -WhatIf

# ลองลงโฟลเดอร์ชั่วคราวก่อน
.\scripts\sync-global-skills.ps1 -Destination "$env:TEMP\skills-test"
```

### ทำงานยังไง

1. อ่านทุกโฟลเดอร์ใน `plugins/software-company/skills/` ที่มี `SKILL.md` — ตัวไหนไม่มีจะข้าม
2. คัดลอกไปที่ปลายทาง **ทับของเดิม** (ลบโฟลเดอร์เดิมก่อนแล้วคัดลอกใหม่ ไม่ใช่ merge —
   ไฟล์ที่ถูกลบออกจากรีโปแล้วจึงไม่ค้างอยู่)
3. เขียน `.sqt-synced.json` ไว้ที่ปลายทาง บันทึกว่ารอบนี้คัดลอกอะไรไปบ้าง
4. รอบถัดไป อ่านไฟล์นั้นแล้วลบเฉพาะ skill ที่ **เคยคัดลอกไปแล้วถูกลบออกจากรีโป**

ข้อ 4 คือเหตุผลที่ต้องมี manifest — ถ้าไม่มี สคริปต์จะแยกไม่ออกว่า skill
ที่อยู่ในปลายทางตัวไหนเป็นของรีโป ตัวไหนคุณเขียนเอง แล้วจะลบผิดตัว

### ข้อควรระวัง

⚠️ **ชื่อซ้ำจะถูกทับ** — ถ้ามี personal skill ชื่อเดียวกับใน
`plugins/software-company/skills/` ตัวในรีโปชนะ เปลี่ยนชื่อตัวใดตัวหนึ่งก่อนรัน

⚠️ **ไม่รวม add-on 39 skills** ของ plugin อุตสาหกรรม (fintech, healthcare, gaming ฯลฯ)
ตั้งใจให้เป็นแบบนั้น — โหลดทุกตัวเข้ามาทำให้ context หนักขึ้นทุก session
อยากได้ตัวไหนเพิ่มให้คัดลอกเองทีละตัว:

```powershell
$dst = "$env:USERPROFILE\.claude\skills"
Copy-Item ".\plugins\software-company-fintech\skills\pci-dss-compliance" $dst -Recurse -Force
```

แต่ตัวที่คัดลอกเองแบบนี้จะ**ไม่อยู่ใน manifest** สคริปต์จึงไม่ยุ่งกับมัน
และไม่อัปเดตให้ด้วย — ต้องคัดลอกเองทุกครั้งที่แก้

⚠️ **personal skill ใช้ได้เฉพาะ Claude Code** — Cowork (แอปเดสก์ท็อป) อ่านจาก plugin
เท่านั้น ไม่เห็นโฟลเดอร์ `.claude/skills`

### ตรวจว่าโหลดครบไหม

```
/doctor
```

| อาการ | สาเหตุที่เจอบ่อย |
|---|---|
| ไม่ขึ้นเลย | ยังไม่ได้รีสตาร์ท Claude Code |
| ขึ้นแต่ไม่ทำงาน | `SKILL.md` ไม่มี frontmatter `name` / `description` |
| ชื่อไม่ตรง | `name` ใน frontmatter ต้องตรงกับชื่อโฟลเดอร์ |
| รันสคริปต์ไม่ได้ | execution policy — ใช้ `powershell -ExecutionPolicy Bypass -File .\scripts\sync-global-skills.ps1` |

### สถานะการทดสอบ

> ⚠️ สคริปต์นี้**ยังไม่ได้รันทดสอบ** — เขียนและตรวจระดับอ่านโค้ดเท่านั้น
> ใช้ `-WhatIf` ก่อนรันจริงครั้งแรก
