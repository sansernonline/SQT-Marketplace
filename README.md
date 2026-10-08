# SQT Marketplace — Software Company Plugin Suite

Marketplace สำหรับ Claude Code · **11 plugins** — ทีมพัฒนาซอฟต์แวร์ + ชุดใช้ในชีวิตประจำวัน เลือกติดตั้งตามอุตสาหกรรม

🔗 [sansernonline/SQT-Marketplace](https://github.com/sansernonline/SQT-Marketplace)

**รวม 63 agents · 195 skills · 71 commands** — ตั้งแต่บริษัทซอฟต์แวร์ครบวงจรไปจนถึงเทรดหุ้น งานไทย ขายของออนไลน์ บ้าน อาชีพ สุขภาพ และงานครีเอทีฟ

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
| **`superuser`** | 1 | 4 | 0 | ต้นฉบับ SuperUser — ใช้เดี่ยวกับงานทั่วไป หรือเป็นแม่แบบให้ plugin อื่น ([ADAPT.md](plugins/superuser/ADAPT.md)) |
| **`software-company`** | 39 | 108 | 29 | บริษัทซอฟต์แวร์ครบทุกสาขา |
| **`trading-finance`** | 5 | 22 | 7 | เทรดหุ้น การเงินส่วนตัว ภาษีและลดหย่อน เกษียณ หนี้ ประกัน |
| **`personal-life`** | 4 | 18 | 6 | จัดการชีวิตประจำวัน · ค่าสมาชิกรายเดือน · ความปลอดภัยบัญชีออนไลน์ · ข้อความสุภาพ |
| **`thai-workplace`** | 5 | 21 | 8 | งานไทย: LINE OA, เอกสาร, ภาษี, เงินเดือน, กฎหมายแรงงาน, PDPA, พร้อมเพย์ |
| **`online-seller`** | 4 | 12 | 4 | แม่ค้าออนไลน์ Shopee · Lazada · TikTok Shop · LINE |
| **`home-family`** | 3 | 11 | 3 | บ้านและครอบครัว: บิล ซ่อมบำรุง รถ อาหาร ลูก ผู้สูงอายุ สัตว์เลี้ยง |
| **`career`** | 3 | 9 | 3 | เรซูเม่ สัมภาษณ์ ต่อรองเงินเดือน LinkedIn |
| **`health-wellness`** | 2 | 9 | 2 | จัดระเบียบสุขภาพ (ไม่วินิจฉัย ไม่สั่งยา) |
| **`consumer-rights`** | 2 | 8 | 2 | เทียบก่อนซื้อ · ประกันสินค้า · ร้องเรียน สคบ. · ขอคืนเงิน |
| **`graphic-design`** | 5 | 14 | 6 | งานครีเอทีฟ: แบรนด์, ภาพ/วิดีโอ AI, โซเชียล |
| **`dev-learning`** | 2 | 10 | 2 | อัปเดตวงการ dev · เตรียมสอบใบรับรอง · เลือกโปรเจกต์ฝึก |

> plugin ชีวิตประจำวัน 10 ตัว (ทุกตัวยกเว้น software-company) ยังเป็นรุ่น v0.x · ตัวเลขภาษี กฎหมาย และอัตราต่าง ๆ ตรวจกับแหล่งทางการแล้วเมื่อ 6 ต.ค. 2569 · ตัวเลขที่ยังไม่ยืนยันมีป้าย (รอยืนยัน) · spec ดูที่ [docs/PLUGINS.md#️-roadmap--plugin-ชีวิตประจำวัน](docs/PLUGINS.md#️-roadmap--plugin-ชีวิตประจำวัน)
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

SuperUser ทำงานอย่างไร → [docs/superuser-software-company.png](docs/superuser-software-company.png) · plugin อื่น → `docs/superuser-<plugin>.png` · วิธีใช้ → [docs/USAGE.md](docs/USAGE.md)

---

## 📚 เอกสาร

| ไฟล์ | เนื้อหา |
|------|---------|
| [docs/INSTALL.md](docs/INSTALL.md) | ติดตั้งบน Claude Code · อัปโหลดเข้า claude.ai · ใช้กับ Codex CLI / Gemini CLI / ChatGPT / Gemini Gem |
| [docs/USAGE.md](docs/USAGE.md) | วิธีใช้ · SuperUser · workflow จริง · cheatsheet คำสั่งที่ใช้บ่อย |
| [docs/PLUGINS.md](docs/PLUGINS.md) | สรุป plugin ทั้งหมด · ย้ายจากรุ่นเก่า · roadmap |
| [docs/REFERENCE.md](docs/REFERENCE.md) | รายละเอียดทุก agent / skill / command ของ software-company |
| [docs/SKILL-LEVELS.md](docs/SKILL-LEVELS.md) | 4 ระดับที่เก็บ skill ได้ และเรียกใช้ยังไง |
| [docs/IDEAS.md](docs/IDEAS.md) | ไอเดียปรับปรุงที่สำรวจไว้ (ของเก่า เก็บไว้อ้างอิง) |
| [scripts/README.md](scripts/README.md) | สคริปต์ทั้งหมด · build-dist · ติดตั้งกฎประจำตัว |

---

## 🗂️ โครงสร้าง

```
SQT-Marketplace/
├── .claude-plugin/marketplace.json
├── plugins/
│   └── software-company/
│       ├── .claude-plugin/plugin.json
│       ├── agents/     (39)
│       ├── skills/     (107 skill + 28 คำสั่ง)
│       └── hooks/      ← hook ของ SuperUser (log · inbox)
├── dist/       ← สร้างจาก plugins/ ด้วย build-targets.mjs (ห้ามแก้มือ)
├── docs/
├── assets/     ← ไอคอนและรูปที่ใช้ร่วม
├── prompt/     ← ชุด prompt — ข้อยกเว้นของ repo นี้ต่อกฎโครงรากโปรเจกต์
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
