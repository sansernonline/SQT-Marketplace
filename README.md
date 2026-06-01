# SQT Marketplace — Software Company Plugin Suite

Marketplace สำหรับ Claude Code มี **3 plugins** สำหรับจำลองทีมพัฒนาซอฟต์แวร์ — เลือกติดตั้งตามอุตสาหกรรม

🔗 **GitHub:** [sansernonline/SQT-Marketplace](https://github.com/sansernonline/SQT-Marketplace)

## 📦 Plugins ในร้าน (14 plugins)

| Plugin | Roles | Skills | Commands | สำหรับ |
|--------|:-----:|:------:|:--------:|--------|
| **`software-company`** ⭐ core | 12 | 14 | 15 | บริษัทซอฟต์แวร์ทั่วไป |
| **`software-company-fintech`** 🏦 | 4 | 3 | 2 | บริษัทการเงิน, PCI-DSS, payment |
| **`software-company-ai`** 🤖 | 5 | 3 | 2 | ทีม AI/ML, LLM, RAG |
| **`software-company-healthcare`** 🏥 | 4 | 3 | 2 | บริษัท health tech, HIPAA, FHIR |
| **`software-company-ecommerce`** 🛒 | 4 | 3 | 2 | E-commerce, checkout, inventory |
| **`software-company-gaming`** 🎮 | 4 | 3 | 2 | Game studios, multiplayer, live ops |
| **`software-company-iot`** 🌐 | 4 | 3 | 2 | IoT, edge computing, fleet management |
| **`software-company-cybersecurity`** 🔒 | 4 | 3 | 2 | SOC, threat hunting, IR, security arch |
| **`software-company-saas-b2b`** 🏢 | 4 | 3 | 2 | SaaS B2B, multi-tenancy, integration |
| **`software-company-devtools`** 🔧 | 4 | 3 | 2 | Developer tools, SDK, DevRel, docs |
| **`software-company-mobile`** 📱 | 4 | 3 | 2 | iOS/Android/cross-platform, ASO |
| **`software-company-web3`** 🌐 | 4 | 3 | 2 | Smart contracts, DeFi, tokenomics |
| **`software-company-legaltech`** ⚖️ | 5 | 3 | 2 | Contract analysis, e-signature, legal automation |
| **`software-company-insurtech`** 🛡️ | 5 | 3 | 2 | Claims, underwriting, actuarial, insurance compliance |

**รวม: 67 agents, 53 skills, 41 commands**

> 💡 **Add-on plugins (fintech/ai/healthcare/ecommerce/gaming) ต้องติดตั้ง `software-company` ก่อน** เพราะใช้ shared skills

## ⚡ Install

ใน Claude Code prompt:

**Core (จำเป็นเสมอ):**
```
/plugin marketplace add sansernonline/SQT-Marketplace
/plugin install software-company@sqt-marketplace
```

**เลือก add-ons ตามอุตสาหกรรม:**
```
/plugin install software-company-fintech@sqt-marketplace
/plugin install software-company-ai@sqt-marketplace
/plugin install software-company-healthcare@sqt-marketplace
/plugin install software-company-ecommerce@sqt-marketplace
/plugin install software-company-gaming@sqt-marketplace
/plugin install software-company-iot@sqt-marketplace
/plugin install software-company-cybersecurity@sqt-marketplace
/plugin install software-company-saas-b2b@sqt-marketplace
/plugin install software-company-devtools@sqt-marketplace
/plugin install software-company-mobile@sqt-marketplace
/plugin install software-company-web3@sqt-marketplace
/plugin install software-company-legaltech@sqt-marketplace
/plugin install software-company-insurtech@sqt-marketplace
```

แล้วรีสตาร์ท Claude Code

## 📚 เอกสาร

| ไฟล์ | เนื้อหา |
|------|---------|
| **[docs/PLUGINS.md](docs/PLUGINS.md)** | สรุป plugins ทั้งหมด + เลือกติดตั้งยังไง |
| **[docs/COMMANDS-CHEATSHEET.md](docs/COMMANDS-CHEATSHEET.md)** ⭐ | คำสั่งที่ใช้บ่อย + เมื่อไหร่ใช้ + workflow bundles |
| **[docs/INSTALL.md](docs/INSTALL.md)** | คู่มือติดตั้ง 3 วิธี + troubleshooting |
| **[docs/USAGE.md](docs/USAGE.md)** | คู่มือใช้งาน + ตัวอย่าง workflow จริง |
| **[docs/REFERENCE.md](docs/REFERENCE.md)** | รายละเอียดทุก agent/skill/command ของ software-company |

---

## 🚀 Quick Start

### ติดตั้ง (วิธีที่เร็วที่สุด)

ใน Claude Code prompt:
```
/plugin marketplace add C:/Users/sanse/OneDrive/WORK/_KK/Projects/Test - Sub Agents/SQT-Marketplace
/plugin install software-company@sqt-marketplace
```

แล้วรีสตาร์ท Claude Code

### ทดลองใช้งาน

```
ช่วยเขียน user story สำหรับ feature "ลืมรหัสผ่าน" หน่อย
```

หรือ:
```
/feature-kickoff ระบบจองห้องประชุม
```

ดูคู่มือเต็มที่ [USAGE.md](docs/USAGE.md)

---

## 📦 มีอะไรบ้าง

### 12 Sub Agents
| Agent | บทบาท |
|-------|-------|
| `product-manager` ⭐ NEW | vision, roadmap, prioritization, user research (กลยุทธ์) |
| `project-manager` | timeline, risk, status report (delivery) |
| `business-analyst` | BRD, user stories, requirement gathering |
| `solution-architect` | system design, tech stack, ADR |
| `system-analyst` | FSD, use cases, API spec |
| `ux-designer` | user flow, wireframe, interaction design |
| `developer` | implement code, unit test, code review |
| `qa-tester` | test plan, test cases, bug report |
| `devops-engineer` | CI/CD, deployment, infrastructure |
| `security-engineer` ⭐ NEW | threat modeling, security review, compliance, OWASP |
| `technical-writer` ⭐ NEW | user guides, API docs, tutorials, release notes |
| `seo-specialist` | keyword research, on-page/technical SEO, SEO audit |

### 17 Skills

**Output Templates (11)**
| Skill | ใช้เมื่อ |
|-------|---------|
| `user-story-writer` | เขียน user story ตาม format มาตรฐาน |
| `adr-writer` | บันทึก architecture decision |
| `code-review-checklist` | review code อย่างเป็นระบบ |
| `test-case-template` | ออกแบบ test case ครอบคลุม |
| `bug-report-template` | รายงาน bug ครบ field, severity/priority |
| `commit-message-format` | conventional commits format |
| `pr-description-template` | PR description ที่ reviewer เข้าใจง่าย |
| `postmortem-template` | blameless postmortem หลังเกิด incident |
| `seo-audit-checklist` | SEO audit ครอบคลุม technical/on-page/content/off-page |
| `polished-document-style` | format เอกสารสวยงาม (Rich markdown + Mermaid) |
| `office-document-handling` ⭐ NEW | อ่าน/สร้าง .docx, .xlsx, .pptx, .pdf ผ่าน anthropic-skills |

**How-To Patterns (4)**
| Skill | ใช้เมื่อ |
|-------|---------|
| `auth-implementation-patterns` ⭐ | implement auth (session/JWT/OAuth/MFA/password) |
| `e2e-testing-patterns` ⭐ | ออกแบบ E2E tests (Playwright/Cypress, POM, flaky fix) |
| `architecture-patterns` ⭐ | เลือก architecture (monolith/microservices/CQRS/Saga) |
| `incident-runbook-template` ⭐ | เขียน on-call runbook ที่ใช้งานจริงตอน incident |

**Cross-Session Continuity (1)**
| Skill | ใช้เมื่อ |
|-------|---------|
| `work-session-context` | บันทึก context สรุปเป็นไฟล์ใน `.claude/context/` หลังทำงานเสร็จ — เปิด session ใหม่จะรู้ทันทีว่าทำอะไรไปแล้ว |

**Universal Quality (1 NEW ⭐)**
| Skill | ใช้เมื่อ |
|-------|---------|
| `simplicity-first` ⭐ NEW | ทำให้ output ทุกแบบ (code/docs/architecture/plans) **simple ที่สุดที่ work** — junior อ่านเข้าใจใน 6 เดือน. Reject premature abstraction + buzzwords. ใช้ทุก agent. |

### 15 Slash Commands

**Strategy & Planning (3)**
| Command | ทำอะไร |
|---------|--------|
| `/product-roadmap <horizon>` ⭐ | roadmap + RICE prioritization + KPIs |
| `/feature-kickoff <feature>` | เริ่ม feature ใหม่: BA → Architect → SA → PM |
| `/sprint-plan <sprint>` | sprint planning ทั้งหมด |

**Design (2 NEW)**
| Command | ทำอะไร |
|---------|--------|
| `/api-design <feature>` ⭐ | ออกแบบ API spec (REST/GraphQL) ครบ |
| `/architecture-review <system>` ⭐ | review architecture vs NFRs + risks |

**Development & Quality (3)**
| Command | ทำอะไร |
|---------|--------|
| `/code-review <file>` | review code แบบครบ checklist |
| `/test-design <feature>` | ออกแบบ test cases ครบทุกแง่ |
| `/bug-report <issue>` | สร้าง bug report แบบ structured |

**Operations (3 NEW)**
| Command | ทำอะไร |
|---------|--------|
| `/incident-response <issue>` ⭐ | live incident workflow + postmortem |
| `/release-notes <version>` ⭐ | release notes for users (not just dev) |
| `/retrospective <sprint>` | sprint retro: glad/sad/mad + action items |

**Security (2 NEW)**
| Command | ทำอะไร |
|---------|--------|
| `/threat-model <feature>` ⭐ | STRIDE threat modeling + mitigations |
| `/security-scan <scope>` ⭐ | security audit (code/deps/infra) |

**Documentation & Onboarding (2 NEW)**
| Command | ทำอะไร |
|---------|--------|
| `/onboard <role>` ⭐ | 30/60/90-day onboarding guide |
| `/seo-audit <url>` | SEO audit ครอบคลุม + action plan 3 เดือน |

---

## 🗂️ โครงสร้างไฟล์

```
SQT-Marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   └── software-company/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── agents/         (12 agents)
│       ├── skills/         (17 skills)
│       └── commands/       (15 commands)
├── docs/
│   ├── INSTALL.md
│   ├── USAGE.md
│   └── REFERENCE.md
└── README.md
```

---

## ⚙️ ปรับแต่ง

- **เพิ่ม role**: สร้างไฟล์ใน `plugins/software-company/agents/<name>.md`
- **เพิ่ม skill**: สร้างโฟลเดอร์ `plugins/software-company/skills/<name>/SKILL.md`
- **เพิ่ม command**: สร้างไฟล์ `plugins/software-company/commands/<name>.md`
- **อัปเดต version**: แก้ `plugins/software-company/.claude-plugin/plugin.json`

ดูตัวอย่างของที่มีอยู่เป็น reference

---

## 📖 อ่านต่อ

- 👉 **[วิธีติดตั้ง](docs/INSTALL.md)** - 3 วิธี เลือกตามสถานการณ์
- 👉 **[วิธีใช้งาน](docs/USAGE.md)** - workflow + ตัวอย่างจริง
- 👉 **[Reference](docs/REFERENCE.md)** - รายละเอียดทุกตัว
