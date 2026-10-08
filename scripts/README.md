# scripts/

สคริปต์ให้คนรันเอง และกฎประจำตัวระดับเครื่อง — ไม่ใช่ส่วนหนึ่งของ plugin · Claude ไม่ได้โหลดไฟล์ในโฟลเดอร์นี้

```
scripts/
├─ build-dist.cmd      ← ตัวที่รันบ่อยสุด: ตรวจ → sync → build ในคลิกเดียว
├─ check/              ตรวจว่าของในรีโปถูกต้อง
├─ sync/               ทำให้ไฟล์ที่ต้องเหมือนกันตรงกัน
├─ build/              สร้าง dist/ สำหรับเครื่องมืออื่น
└─ install/            ติดตั้งลงเครื่อง
```

| กลุ่ม | ไฟล์ | ทำอะไร | รันเมื่อไหร่ |
|---|---|---|---|
| — | `build-dist.cmd` | รัน validate → sync-docs → build-targets ต่อกัน หยุดทันทีถ้าขั้นไหนล้ม (ดับเบิลคลิกได้) | **ก่อน commit** แทนการรันสามตัวทีละคำสั่ง |
| **check** | `check/validate-marketplace.mjs` | ตรวจ frontmatter / ชื่อ / ความยาว ของทุก skill · agent · plugin | **ก่อน commit ทุกครั้ง** |
| check | `check/facts.json` | ข้อเท็จจริงไทยที่หลายไฟล์อ้างถึง (ฐานประกันสังคม · ลาคลอด · เกณฑ์ VAT · คุ้มครองเงินฝาก · 1441 · ภาษีขั้นสูงสุด) — `validate-marketplace` ตรวจว่าทุกไฟล์ในรายการยังมีค่าปัจจุบัน | **อัตราเปลี่ยน** → แก้ `value` ที่นี่ แล้วรันตรวจ จะได้รายชื่อไฟล์ที่ต้องตามแก้ |
| **sync** | `sync/sync-docs.mjs` | เขียนตัวเลขนับและรายการ skill ในเอกสารจากของจริงใน `plugins/` | **หลังเพิ่มหรือลบ skill / agent / command** |
| sync | `sync/sync-superuser.mjs` | คัดลอกของกลาง SuperUser จาก `plugins/superuser` ไปทุก plugin (skill กลาง · learning-reviewer · hook · บล็อก `superuser:begin`) · `--check` ตรวจอย่างเดียว | **หลังแก้อะไรใน `plugins/superuser`** |
| **build** | `build/build-targets.mjs` | สร้าง `dist/` สำหรับ claude.ai (zip), Codex CLI, Gemini CLI และหน้าเว็บ ChatGPT / Gemini จาก `plugins/` | **หลังแก้อะไรก็ได้ใน `plugins/`** แล้ว commit `dist/` ไปด้วย |
| **install** | `install/install-marketplace.ps1` | ติดตั้ง marketplace นี้จากโฟลเดอร์ในเครื่อง | ครั้งแรก และเมื่อเพิ่ม plugin ใหม่ |
| install | `install/install-global-rules.ps1` / `.sh` | ติดตั้ง `CLAUDE.global.md` เป็น `~/.claude/CLAUDE.md` (สำรองไฟล์เดิมก่อน) | ครั้งแรกบนเครื่องใหม่ และหลังแก้กฎ |
| install | `install/CLAUDE.global.md` | ต้นฉบับกฎประจำตัวระดับเครื่อง — ไม่ใช่สคริปต์ แต่เป็นไฟล์ที่ `install-global-rules` ติดตั้ง | แก้ที่นี่ที่เดียว |

---

## 1 · validate-marketplace.mjs

```bash
node scripts/check/validate-marketplace.mjs --self-test   # พิสูจน์ว่าตัวตรวจยังจับบั๊กได้
node scripts/check/validate-marketplace.mjs               # แล้วค่อยตรวจจริง
```

ออก exit code 1 เมื่อเจอ error — ใช้เป็นประตูใน continuous integration (CI) ได้ · ไม่ใช้ dependency ภายนอก

**รัน `--self-test` ก่อนเสมอ** ไม่งั้นตัวตรวจที่พังจะรายงานว่าทุกอย่างเรียบร้อย

### ตรวจอะไร

| ระดับ | รายการ |
|---|---|
| error | frontmatter หาย/ปิดไม่ครบ · **ค่าที่มี `": "` โดยไม่ครอบเครื่องหมายคำพูด** · `name` ไม่ตรงชื่อโฟลเดอร์ · `name` ผิดรูปแบบหรือมีคำว่า claude/anthropic · ไม่มี `description` · `description` เกิน 1024 หรือมีแท็ก `< >` · เนื้อหาเกิน 500 บรรทัด · agent ใช้ `allowed-tools:` แทน `tools:` · `plugin.json` หาย/พัง/`version` ผิดรูป · plugin ที่มีจริงแต่ไม่ได้ประกาศใน `marketplace.json` · ไฟล์ใน `facts.json` ไม่มีค่าปัจจุบัน |
| warning | `description` ยาวเกิน 250 ตัว (โหลดเข้า context ทุก session) · `description` สั้นกว่า 60 ตัว หรือไม่บอกว่าใช้เมื่อไหร่ · เนื้อหาเกิน 400 บรรทัด · ไฟล์ใน `references/` เกิน 100 บรรทัดแต่ไม่มีสารบัญ · README ไม่พูดถึง plugin บางตัว |

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
.\scripts\install\install-marketplace.ps1
.\scripts\install\install-marketplace.ps1 -WhatIf     # ดูก่อนว่าจะทำอะไร
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
- run: node scripts/check/validate-marketplace.mjs --self-test
- run: node scripts/check/validate-marketplace.mjs
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
node scripts/sync/sync-docs.mjs --check   # ตรวจว่าเอกสารตรงกับของจริงไหม (CI)
node scripts/sync/sync-docs.mjs           # เขียนทับให้ตรง
```

**แหล่งความจริงคือโฟลเดอร์ `plugins/` เท่านั้น** เอกสารทุกไฟล์เป็นผลลัพธ์ที่สร้างจากที่นั่น

| ไฟล์ที่ถูกเขียน | เขียนอะไร |
|---|---|
| `README.md` | บรรทัดยอดรวม และตัวเลขสามคอลัมน์ในตาราง plugin ทุกแถว |
| `docs/PLUGINS.md` | จำนวน plugin · ตัวเลขของแต่ละ plugin · บล็อก Marketplace Total |
| `docs/REFERENCE.md` | เลขในหัวข้อ Agents/Skills/Commands · บล็อก skill ทั้งหมด พร้อมเลขลำดับและบรรทัด `**ใช้กับ:**` |
| `docs/INSTALL.md` (หัวข้อ claude.ai) | บรรทัด "ในไฟล์:" พร้อมเลขเวอร์ชันจาก `plugin.json` |

**บรรทัดคำอธิบายที่เขียนมือใน `docs/REFERENCE.md` ไม่หาย** — สคริปต์เก็บทุกบรรทัดที่ขึ้นต้นด้วย `**`
(เช่น `**Includes:**` `**Anti-patterns ที่กันไว้:**`) แล้วย้ายตามไปให้เอง
มีแต่ `**ใช้กับ:**` ที่ถูกเขียนใหม่ เพราะหาได้จากการที่ agent อ้างชื่อ skill นั้นจริง ๆ

skill ใหม่ที่ยังไม่มีบล็อกใน `REFERENCE.md` จะถูกต่อท้ายพร้อม `description` จาก frontmatter
เขียนคำอธิบายมือเพิ่มทีหลังได้ รันซ้ำแล้วไม่หาย

`validate-marketplace.mjs` เรียก `--check` ให้อัตโนมัติ ถ้าไม่ตรงจะขึ้นคำเตือนและ exit code 1

---

## 4 · build-targets.mjs

```bash
node scripts/build/build-targets.mjs
```

ลบ `dist/` แล้วสร้างใหม่จาก `plugins/` ทุกครั้ง · ไม่ใช้ dependency ภายนอก · วิธีติดตั้งฝั่งปลายทางอยู่ใน [docs/OTHER-LLMS.md](../docs/INSTALL.md#ใช้ชุดนี้กับ-llm-ตัวอื่น)

| ปลายทาง | skill | agent | command |
|---|---|---|---|
| `dist/claude-web/` | `software-company.zip` — plugin หลักทั้งโฟลเดอร์ตามเดิม ([วิธีอัปโหลด](../docs/INSTALL.md#claudeai--อัปโหลด-software-companyzip)) | ← | ← |
| `dist/codex/` | คัดลอกไป `.agents/skills/` | `.codex/agents/<name>.toml` | แปลงเป็น skill (Codex เลิกใช้ custom prompt) · `$ARGUMENTS` → ข้อความบอกให้ใช้สิ่งที่ผู้ใช้ระบุ |
| `dist/gemini-cli/` | คัดลอกไป `skills/` | `agents/<name>.md` ตัด `tools:` `model:` ทิ้ง | `commands/<name>.toml` · `$ARGUMENTS` → `{{args}}` |
| `dist/chat-web/` | รวมเป็นไฟล์ความรู้ไม่เกิน 10 ไฟล์ต่อบทบาท | `instructions.md` · ถ้าเกิน 8000 ตัวอักษรย้ายไป `knowledge/00-role.md` | ไม่มี (หน้าเว็บไม่มี slash command) |

skill ที่บทบาทหนึ่งได้รับคือชื่อ skill ที่เขียนใน backtick ในไฟล์ agent นั้น


---

## 5 · กฎประจำตัว — CLAUDE.global.md + install-global-rules

ปลั๊กอินตามบัญชีไปเอง แต่ `~/.claude/CLAUDE.md` เป็นไฟล์บนเครื่อง ต้องติดตั้งใหม่ทุกครั้งที่ย้ายเครื่อง

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install\install-global-rules.ps1   # Windows
bash scripts/install/install-global-rules.sh                                         # macOS / Linux
```

สคริปต์สำรองไฟล์เดิมไว้เป็น `CLAUDE.md.bak-<วันเวลา>` ก่อนเขียนทับ

### อะไรควรอยู่ไฟล์ไหน

| อยู่ใน `CLAUDE.global.md` | อยู่ใน skill |
|---|---|
| กฎสั้น ๆ ที่ต้องเห็นตลอดเวลา | ตาราง เกณฑ์ ตัวอย่าง รายละเอียด |
| อยู่ใน context ทุกเซสชัน = มีต้นทุน | โหลดเมื่อตรงงานเท่านั้น = ฟรีจนกว่าจะใช้ |

**เกณฑ์:** ถ้ากฎนั้นต้องเตือนตอนที่โมเดลกำลังจะพลาด ให้อยู่ที่นี่ · ถ้าเป็นความรู้ที่ไปเปิดอ่านได้ทัน ให้อยู่ใน skill

ไฟล์นี้ควรยาวไม่เกิน **40 บรรทัด** — ทุกบรรทัดจ่ายต้นทุนทุกเซสชันของทุกโปรเจกต์
