# SQT Marketplace — Software Company Plugin Suite

Marketplace สำหรับ Claude Code · **6 plugins** — ทีมพัฒนาซอฟต์แวร์ (รวม reverse engineering) + ชุดใช้ในชีวิตประจำวันและธุรกิจ เลือกติดตั้งตามงาน

🔗 [sansernonline/SQT-Marketplace](https://github.com/sansernonline/SQT-Marketplace)

**รวม 68 agents · 229 skills · 73 commands** — ตั้งแต่บริษัทซอฟต์แวร์ครบวงจร ไปจนถึงเทรดหุ้น งานไทย ซื้อขายออนไลน์ ชีวิตประจำวัน งานครีเอทีฟ และ reverse engineer

---

## ⚙️ ค่าตั้งระดับเครื่อง และสคริปต์ — `scripts/`

ปลั๊กอินผูกกับบัญชี ย้ายเครื่องแล้วตามไปเอง · แต่ `~/.claude/CLAUDE.md` (กฎประจำตัว) เป็นไฟล์บนเครื่อง ย้ายเครื่องต้องติดตั้งใหม่ทุกครั้ง

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install\install-global-rules.ps1 # Windows
bash scripts/install/install-global-rules.sh                                         # macOS / Linux
scripts\build-dist.cmd                                                       # ตรวจ → ซิงก์เอกสาร → สร้าง dist/ ในคำสั่งเดียว
```

ต้นฉบับกฎอยู่ที่ `scripts/install/CLAUDE.global.md` — แก้ที่นั่นที่เดียว แล้วรันสคริปต์ติดตั้งใหม่
สคริปต์ทั้งหมดและวิธีใช้ → [`scripts/README.md`](scripts/README.md)

---

## 📦 Plugins

| Plugin | Agents | Skills | Commands | สำหรับ |
|--------|:-----:|:------:|:--------:|--------|
| **`superuser`** | 3 | 34 | 0 | หัวหน้างานกลาง — จัดขนาด ใบสั่งงาน 5 ข้อ แจกลูกทีม ตรวจซ้ำจนผ่าน วัด token · ใช้เดี่ยวได้ หรือเป็นแกนให้ plugin อื่น ([ADAPT.md](plugins/superuser/ADAPT.md)) |
| **`software-company`** | 38 | 95 | 29 | บริษัทซอฟต์แวร์ครบทุกสาขา |
| **`trading-finance`** | 5 | 19 | 7 | เทรดหุ้น การเงินส่วนตัว ภาษีและลดหย่อน เกษียณ หนี้ ประกัน |
| **`personal-life`** | 9 | 39 | 16 | ชีวิตประจำวันตัวเดียวครบ 5 หมวด — จัดการชีวิต (ประชุม เอกสาร ค่าสมาชิก ความปลอดภัยบัญชี) · บ้านและครอบครัว (บิล รถ ลูก ผู้สูงอายุ สัตว์เลี้ยง) · สุขภาพ (จัดระเบียบ ไม่วินิจฉัย) · อาชีพ (เรซูเม่ สัมภาษณ์ เงินเดือน) · เรียนรู้ (เรียนเทคโนโลยี paper ใบรับรอง side project วิทยานิพนธ์ — รวม `dev-learning` เดิม) |
| **`e-commerce`** | 8 | 31 | 14 | ซื้อขายออนไลน์ทั้งสองฝั่งและงานหลังบ้านบริษัทไทย — ขาย: Shopee · Lazada · TikTok Shop · LINE · ไลฟ์ · สต็อก · ซื้อ: เทียบก่อนซื้อ ประกัน ร้องเรียน สคบ. ขอคืนเงิน · หลังบ้าน: LINE OA · เอกสาร · ภาษี · เงินเดือน · กฎหมายแรงงาน · PDPA · พร้อมเพย์ (รวม `online-seller` · `consumer-rights` · `thai-workplace` เดิม) |
| **`graphic-design`** | 6 | 16 | 6 | งานครีเอทีฟ: แบรนด์, ภาพ/วิดีโอ AI, โซเชียล |

> plugin ชีวิตประจำวันยังเป็นรุ่น v0.x · ตัวเลขภาษี กฎหมาย และอัตราต่าง ๆ ตรวจกับแหล่งทางการแล้วเมื่อ 6 ต.ค. 2569 · ตัวเลขที่ยังไม่ยืนยันมีป้าย (รอยืนยัน) · spec ดูที่ [docs/PLUGINS.md#️-roadmap--plugin-ชีวิตประจำวัน](docs/PLUGINS.md#️-roadmap--plugin-ชีวิตประจำวัน)
> ตั้งแต่ v2.0.0 สาขาเฉพาะทาง (fintech · AI · healthcare · e-commerce · game · IoT · security operations · SaaS · devtools · mobile · web3 · legal · insurance) รวมอยู่ใน software-company ตัวเดียว · ตารางว่าอะไรย้ายไปไหนอยู่ที่ [docs/PLUGINS.md](docs/PLUGINS.md)

---

## ⚡ Install

**มี 2 ทาง เลือกตามสิ่งที่จะทำ** · 2 ทางนี้ต่างกันที่ Claude Code อ่านไฟล์จากที่ไหน

| | ทาง ก · ใช้งาน | ทาง ข · พัฒนาต่อ |
|---|---|---|
| เพิ่มด้วย | `sansernonline/SQT-Marketplace` | path ของโฟลเดอร์นี้ |
| อ่านจาก | สำเนาที่ดาวน์โหลดมา | **โฟลเดอร์นี้โดยตรง** |
| แก้ `SKILL.md` แล้ว | commit → push → `/plugin marketplace update` | `/reload-plugins` เห็นผลทันที |

> ⚠️ อย่าเพิ่มทั้ง 2 ทางพร้อมกัน · ถ้าเพิ่มทั้งคู่ ตัวที่ทำงานคือสำเนาจาก GitHub แก้ไฟล์ในโฟลเดอร์นี้แล้วจะไม่เห็นผล
> พิมพ์ `/plugin` ดูว่าตอนนี้มาจากไหน

### ทาง ก · ใช้งาน

```
/plugin marketplace add sansernonline/SQT-Marketplace
/plugin install software-company@sqt-marketplace
```

ทุก plugin ใช้ของกลางจาก `superuser` (แกนหัวหน้าทีม · skill `human-writing` · `simplify` · เอกสารหลัก `polished-document-style` · `document-naming` · agent `reviewer` · hook) · ติดตั้ง plugin ไหน Claude Code ติดตั้ง `superuser` ให้เองจาก `dependencies` · skill เอกสารออกแบบ สไลด์ รูปอยู่ใน `software-company` · ภาพ AI ใน `graphic-design` · ประชุม ใน `personal-life` · zip สำหรับ claude.ai มีของกลางอยู่ในตัวแล้ว

ติดตั้งหลาย plugin → รัน `node scripts/install/set-skill-budget.mjs` ครั้งเดียว (ขยายงบรายการ skill เป็น 2%) ไม่งั้นคำอธิบาย skill บางตัวถูกตัดทิ้ง · รายละเอียด [scripts/README.md](scripts/README.md)

เคยติดตั้ง plugin สาขาของรุ่นก่อน v2.0.0 → ถอดออก (`/plugin uninstall software-company-<สาขา>`) เพราะรวมอยู่ในตัวหลักแล้ว

### ทาง ข · พัฒนาต่อ

```powershell
.\scripts\install\install-marketplace.ps1
```

สคริปต์อ่านรายชื่อ plugin จาก `marketplace.json` เอง · ตรวจไฟล์ด้วย validator ก่อนติดตั้ง · รันซ้ำได้ไม่เสียหาย
รายละเอียดใน [scripts/README.md](scripts/README.md)

ตอนติดตั้ง ระบบจะถามขอบเขต (scope) → **เลือก user** เพื่อใช้ได้ทุกโปรเจกต์บนเครื่องนี้

**แล้วรีสตาร์ท Claude Code ทั้งสองทาง**

---

## 🔄 อัปเดตหลังแก้ไฟล์

| ติดตั้งแบบ | ทำอะไร |
|---|---|
| ทาง ข | `/reload-plugins` เท่านั้น ไม่ต้อง commit |
| ทาง ก | `git push` ก่อน แล้ว `/plugin marketplace update sqt-marketplace` + `/plugin update software-company@sqt-marketplace` |

### ไม่เห็น skill ที่เพิ่งเพิ่ม

```
/doctor
```

| อาการ | สาเหตุ |
|---|---|
| ไม่ขึ้นเลย | ยังไม่ได้รีสตาร์ท |
| ขึ้นแต่ไม่ทำงาน | `SKILL.md` ไม่มี `name` / `description` |
| ชื่อไม่ตรง | `name` ต้องตรงกับชื่อโฟลเดอร์ |
| แก้ไฟล์แล้วไม่เปลี่ยน | ติดตั้งไว้แบบทาง ก · พิมพ์ `/plugin` เช็กที่มา |
| skill หายทั้งตัวแบบไม่มี error | `frontmatter` พัง · ตรวจด้วย `node scripts\check\validate-marketplace.mjs` |

---

## 🧪 ทดลองใช้

```
ช่วยเขียน user story สำหรับ feature "ลืมรหัสผ่าน" หน่อย
```

```
/feature-kickoff ระบบจองห้องประชุม
```

```
/software-company:superuser เพิ่มหน้าจอค้นหาลูกค้า
```

SuperUser ทำงานอย่างไร → [docs/plugins/software-company/flow.png](docs/plugins/software-company/flow.png) · รูปของทุก plugin (วิธีทำงาน · แผนผัง · ขั้นตอน playbook) → [docs/plugins/](docs/plugins/README.md) · วิธีใช้ → [docs/USAGE.md](docs/USAGE.md)

---

## 📚 เอกสาร

| ไฟล์ | เนื้อหา |
|------|---------|
| [docs/INSTALL.md](docs/INSTALL.md) | ติดตั้งบน Claude Code · อัปโหลดเข้า claude.ai · ใช้กับ Codex CLI / Gemini CLI / Kimi Code CLI / ChatGPT / Gemini Gem |
| [docs/USAGE.md](docs/USAGE.md) | วิธีใช้ · SuperUser · workflow จริง · cheatsheet คำสั่งที่ใช้บ่อย |
| [docs/PLUGINS.md](docs/PLUGINS.md) | สรุป plugin ทั้งหมด · ย้ายจากรุ่นเก่า · roadmap |
| [docs/REFERENCE.md](docs/REFERENCE.md) | รายละเอียดทุก agent / skill / command ของ software-company |
| [docs/SKILL-LEVELS.md](docs/SKILL-LEVELS.md) | 4 ระดับที่เก็บ skill ได้ และเรียกใช้ยังไง |
| [docs/IDEAS.md](docs/IDEAS.md) | ไอเดียปรับปรุงที่สำรวจไว้ (ของเก่า เก็บไว้อ้างอิง) |
| [scripts/README.md](scripts/README.md) | สคริปต์ทั้งหมด · build-dist · ติดตั้งกฎประจำตัว |
| [scripts/evals/README.md](scripts/evals/README.md) | ชุดวัดผลจริง: เปิด skill ถูกตัว (triggers) · ความเร็ว (speed) · คุณภาพโค้ด (coding) · รันเมื่อไร ค่าใช้จ่ายเท่าไร |

---

## 🗂️ โครงสร้าง

```
SQT-Marketplace/
├── .claude-plugin/marketplace.json
├── plugins/
│   └── software-company/
│       ├── .claude-plugin/plugin.json
│       ├── agents/     (42)
│       ├── skills/     (114 skill + 29 คำสั่ง)
│       └── (ไม่มี hooks/ · ใช้ของ plugin superuser ทาง dependencies)
├── dist/       ← สร้างจาก plugins/ ด้วย build-targets.mjs (ห้ามแก้มือ)
├── docs/
├── prompt/     ← ชุด prompt แยกโฟลเดอร์ตาม plugin — ข้อยกเว้นของ repo นี้ต่อกฎโครงรากโปรเจกต์
├── scripts/
└── README.md
```

---

## ⚙️ เพิ่มของใหม่

| เพิ่ม | สร้างที่ |
|---|---|
| agent | `plugins/<plugin>/agents/<name>.md` |
| skill | `plugins/<plugin>/skills/<name>/SKILL.md` |
| คำสั่ง (slash command) | `plugins/<plugin>/skills/<name>/SKILL.md` ใส่ `disable-model-invocation: true` |

`name` ใน frontmatter ต้องตรงกับชื่อโฟลเดอร์ (skill และคำสั่ง) หรือชื่อไฟล์ (agent) · agent ใช้คีย์ `tools:` ส่วน skill ใช้ `allowed-tools:`

แก้แล้วรัน `node scripts\check\validate-marketplace.mjs` ก่อน commit ทุกครั้ง
แล้วเพิ่มเลข `version` ใน `plugin.json` · ไม่เพิ่ม → เครื่องที่ติดตั้งไว้จะไม่ดึงของใหม่
