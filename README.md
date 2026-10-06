# SQT Marketplace — Software Company Plugin Suite

Marketplace สำหรับ Claude Code · **11 plugins** — ทีมพัฒนาซอฟต์แวร์ + ชุดใช้ในชีวิตประจำวัน เลือกติดตั้งตามอุตสาหกรรม

🔗 [sansernonline/SQT-Marketplace](https://github.com/sansernonline/SQT-Marketplace)

**รวม 63 agents · 195 skills · 71 commands** — ตั้งแต่บริษัทซอฟต์แวร์ครบวงจรไปจนถึงเทรดหุ้น งานไทย ขายของออนไลน์ บ้าน อาชีพ สุขภาพ และงานครีเอทีฟ

---

## ⚙️ ค่าตั้งระดับเครื่อง และสคริปต์ — `scripts/`

ปลั๊กอินตามบัญชีไปเอง แต่ `~/.claude/CLAUDE.md` เป็นไฟล์บนเครื่อง ต้องติดตั้งใหม่ทุกครั้งที่ย้ายเครื่อง

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-global-rules.ps1 # Windows
bash scripts/install-global-rules.sh                                         # macOS / Linux
scripts\build-dist.cmd                                                       # ตรวจ → ซิงก์เอกสาร → สร้าง dist/ ในคำสั่งเดียว
```

ต้นฉบับกฎอยู่ที่ `scripts/CLAUDE.global.md` — แก้ที่นั่นที่เดียว แล้วรันสคริปต์ติดตั้งใหม่
สคริปต์ทั้งหมดและวิธีใช้ → [`scripts/README.md`](scripts/README.md)

---

## 📦 Plugins

| Plugin | Agents | Skills | Commands | สำหรับ |
|--------|:-----:|:------:|:--------:|--------|
| **`software-company`** | 38 | 101 | 28 | บริษัทซอฟต์แวร์ครบทุกสาขา |
| **`trading-finance`** | 4 | 18 | 7 | เทรดหุ้น การเงินส่วนตัว ภาษีและลดหย่อน เกษียณ หนี้ ประกัน |
| **`personal-life`** | 3 | 14 | 6 | จัดการชีวิตประจำวัน · ค่าสมาชิกรายเดือน · ความปลอดภัยบัญชีออนไลน์ · ข้อความสุภาพ |
| **`thai-workplace`** | 4 | 17 | 8 | งานไทย: LINE OA, เอกสาร, ภาษี, เงินเดือน, กฎหมายแรงงาน, PDPA, พร้อมเพย์ |
| **`online-seller`** | 3 | 8 | 4 | แม่ค้าออนไลน์ Shopee · Lazada · TikTok Shop · LINE |
| **`home-family`** | 2 | 7 | 3 | บ้านและครอบครัว: บิล ซ่อมบำรุง รถ อาหาร ลูก ผู้สูงอายุ สัตว์เลี้ยง |
| **`career`** | 2 | 5 | 3 | เรซูเม่ สัมภาษณ์ ต่อรองเงินเดือน LinkedIn |
| **`health-wellness`** | 1 | 5 | 2 | จัดระเบียบสุขภาพ (ไม่วินิจฉัย ไม่สั่งยา) |
| **`consumer-rights`** | 1 | 4 | 2 | เทียบก่อนซื้อ · ประกันสินค้า · ร้องเรียน สคบ. · ขอคืนเงิน |
| **`graphic-design`** | 4 | 10 | 6 | งานครีเอทีฟ: แบรนด์, ภาพ/วิดีโอ AI, โซเชียล |
| **`dev-learning`** | 1 | 6 | 2 | อัปเดตวงการ dev · เตรียมสอบใบรับรอง · เลือกโปรเจกต์ฝึก |

> plugin ชีวิตประจำวัน 10 ตัวหลัง software-company อยู่ในช่วง v0.x — ตัวเลขภาษี กฎหมาย และอัตราต่าง ๆ ตรวจกับแหล่งทางการเมื่อ 6 ต.ค. 2569 ตัวที่ยังไม่ยืนยันมีป้าย (รอยืนยัน) — ดู spec ที่ [docs/PLUGINS.md#️-roadmap--plugin-ชีวิตประจำวัน](docs/PLUGINS.md#️-roadmap--plugin-ชีวิตประจำวัน)
> ตั้งแต่ v2.0.0 สาขาเฉพาะทาง (fintech · AI · healthcare · e-commerce · game · IoT · security operations · SaaS · devtools · mobile · web3 · legal · insurance) รวมอยู่ในตัวเดียว — ตารางว่าอะไรย้ายไปไหนอยู่ที่ [docs/PLUGINS.md](docs/PLUGINS.md)

---

## ⚡ Install

**เลือกทางให้ตรงกับสิ่งที่จะทำ** — ต่างกันที่ Claude Code อ่านไฟล์จากไหน

| | ทาง ก · ใช้งาน | ทาง ข · พัฒนาต่อ |
|---|---|---|
| เพิ่มด้วย | `sansernonline/SQT-Marketplace` | path ของโฟลเดอร์นี้ |
| อ่านจาก | สำเนาที่ดาวน์โหลดมา | **โฟลเดอร์นี้โดยตรง** |
| แก้ `SKILL.md` แล้ว | commit → push → `/plugin marketplace update` | `/reload-plugins` เห็นผลทันที |

> ⚠️ อย่าเพิ่มทั้งสองแบบพร้อมกัน — จะแก้ไฟล์แล้วไม่เห็นเปลี่ยน เพราะตัวที่ทำงานคือสำเนาจาก GitHub
> พิมพ์ `/plugin` ดูว่าตอนนี้มาจากไหน

### ทาง ก · ใช้งาน

```
/plugin marketplace add sansernonline/SQT-Marketplace
/plugin install software-company@sqt-marketplace
```

เคยติดตั้ง plugin สาขาจากรุ่นก่อน v2.0.0 → ถอดออก (`/plugin uninstall software-company-<สาขา>`) เพราะรวมอยู่ในตัวหลักแล้ว

### ทาง ข · พัฒนาต่อ

```powershell
.\scripts\install-marketplace.ps1
```

อ่านรายชื่อ plugin จาก `marketplace.json` เอง · รัน validator ก่อน · รันซ้ำได้
รายละเอียดใน [scripts/README.md](scripts/README.md)

ตอนติดตั้งมันถามขอบเขต — **เลือก user** จะได้ใช้ได้ทุกโปรเจกต์บนเครื่องนี้

**แล้วรีสตาร์ท Claude Code ทั้งสองทาง**

---

## 🔄 อัปเดตหลังแก้ไฟล์

| ติดตั้งแบบ | ทำอะไร |
|---|---|
| ทาง ข | `/reload-plugins` — จบ ไม่ต้อง commit |
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
| skill หายทั้งตัวแบบไม่มี error | `frontmatter` พัง — `node scripts\validate-marketplace.mjs` |

---

## 🧪 ทดลองใช้

```
ช่วยเขียน user story สำหรับ feature "ลืมรหัสผ่าน" หน่อย
```

```
/feature-kickoff ระบบจองห้องประชุม
```

```
/software-company:agent-team เพิ่มหน้าจอค้นหาลูกค้า
```

agent-team (A-Team) ทำงานอย่างไร → [docs/agent-team-software-company.png](docs/agent-team-software-company.png) · วิธีใช้ → [docs/USAGE.md](docs/USAGE.md)

---

## 📚 เอกสาร

| ไฟล์ | เนื้อหา |
|------|---------|
| [docs/INSTALL.md](docs/INSTALL.md) | ติดตั้งบน Claude Code · อัปโหลดเข้า claude.ai · ใช้กับ Codex CLI / Gemini CLI / ChatGPT / Gemini Gem |
| [docs/USAGE.md](docs/USAGE.md) | วิธีใช้ · A-Team · workflow จริง · cheatsheet คำสั่งที่ใช้บ่อย |
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
│       ├── agents/     (38)
│       ├── skills/     (101)
│       ├── commands/   (28)
│       └── hooks/      ← hook ของ A-Team (log · inbox)
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
| command | `plugins/<plugin>/commands/<name>.md` |

`name` ใน frontmatter ต้องตรงกับชื่อโฟลเดอร์หรือชื่อไฟล์ · agent ใช้คีย์ `tools:` ส่วน skill ใช้ `allowed-tools:`

แก้แล้วรัน `node scripts\validate-marketplace.mjs` ก่อน commit เสมอ
และบวกเลข `version` ใน `plugin.json` ไม่งั้นเครื่องปลายทางไม่ดึงของใหม่
