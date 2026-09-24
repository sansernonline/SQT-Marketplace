# SQT Marketplace — Software Company Plugin Suite

Marketplace สำหรับ Claude Code · **14 plugins** จำลองทีมพัฒนาซอฟต์แวร์ เลือกติดตั้งตามอุตสาหกรรม

🔗 [sansernonline/SQT-Marketplace](https://github.com/sansernonline/SQT-Marketplace)

**รวม 68 agents · 77 skills · 41 commands** — core 38 skills + add-on 39 skills

---

## 📦 Plugins

| Plugin | Agents | Skills | Commands | สำหรับ |
|--------|:-----:|:------:|:--------:|--------|
| **`software-company`** ⭐ core | 13 | 38 | 15 | บริษัทซอฟต์แวร์ทั่วไป |
| `software-company-fintech` | 4 | 3 | 2 | การเงิน · PCI-DSS · payment |
| `software-company-ai` | 5 | 3 | 2 | AI/ML · LLM · RAG |
| `software-company-healthcare` | 4 | 3 | 2 | health tech · HIPAA · FHIR |
| `software-company-ecommerce` | 4 | 3 | 2 | checkout · inventory |
| `software-company-gaming` | 4 | 3 | 2 | multiplayer · live ops |
| `software-company-iot` | 4 | 3 | 2 | edge computing · fleet |
| `software-company-cybersecurity` | 4 | 3 | 2 | SOC · threat hunting · IR |
| `software-company-saas-b2b` | 4 | 3 | 2 | multi-tenancy · integration |
| `software-company-devtools` | 4 | 3 | 2 | SDK · DevRel · docs |
| `software-company-mobile` | 4 | 3 | 2 | iOS/Android · ASO |
| `software-company-web3` | 4 | 3 | 2 | smart contract · DeFi |
| `software-company-legaltech` | 5 | 3 | 2 | contract · e-signature |
| `software-company-insurtech` | 5 | 3 | 2 | claims · underwriting |

> add-on ทุกตัวต้องติดตั้ง `software-company` ก่อน เพราะใช้ skill ร่วมกัน

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

เพิ่ม add-on ตามต้องการ — ชื่อจากตารางข้างบน ต่อท้ายด้วย `@sqt-marketplace`

```
/plugin install software-company-fintech@sqt-marketplace
```

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

---

## 📚 เอกสาร

| ไฟล์ | เนื้อหา |
|------|---------|
| [docs/REFERENCE.md](docs/REFERENCE.md) | รายละเอียดทุก agent / skill / command |
| [docs/SKILL-LEVELS.md](docs/SKILL-LEVELS.md) | 4 ระดับที่เก็บ skill ได้ และเรียกใช้ยังไง |
| [docs/PLUGINS.md](docs/PLUGINS.md) | สรุป plugin ทั้งหมด + เลือกติดตั้งยังไง |
| [docs/COMMANDS-CHEATSHEET.md](docs/COMMANDS-CHEATSHEET.md) | คำสั่งที่ใช้บ่อย + workflow bundles |
| [docs/USAGE.md](docs/USAGE.md) | ตัวอย่าง workflow จริง |
| [docs/INSTALL.md](docs/INSTALL.md) | คู่มือติดตั้งแบบละเอียด + troubleshooting |
| [docs/UPGRADE-IDEAS.md](docs/UPGRADE-IDEAS.md) | สำรวจของจากภายนอกที่เอามาอัปเกรดได้ |
| [scripts/README.md](scripts/README.md) | สคริปต์ช่วยงาน 3 ตัว |

---

## 🗂️ โครงสร้าง

```
SQT-Marketplace/
├── .claude-plugin/marketplace.json
├── plugins/
│   └── software-company/
│       ├── .claude-plugin/plugin.json
│       ├── agents/     (13)
│       ├── skills/     (35)
│       └── commands/   (15)
├── docs/
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
