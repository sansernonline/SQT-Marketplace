# Software Company Plugin

Plugin จำลองทีมพัฒนาซอฟต์แวร์ครบทีม สำหรับใช้ใน Claude Code — มาพร้อม 9 roles, 9 specialized skills, และ 7 slash commands สำหรับ workflow ที่ใช้บ่อยใน SDLC

## 📚 เอกสาร

| ไฟล์ | เนื้อหา |
|------|---------|
| **[docs/INSTALL.md](docs/INSTALL.md)** | คู่มือติดตั้ง 3 วิธี + troubleshooting |
| **[docs/USAGE.md](docs/USAGE.md)** | คู่มือใช้งาน + ตัวอย่าง workflow จริง |
| **[docs/REFERENCE.md](docs/REFERENCE.md)** | รายละเอียดทุก agent/skill/command |

---

## 🚀 Quick Start

### ติดตั้ง (วิธีที่เร็วที่สุด)

ใน Claude Code prompt:
```
/plugin marketplace add C:/Users/sanse/OneDrive/WORK/_KK/Projects/Test - Sub Agents/sqt-marketplace
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

### 9 Sub Agents
| Agent | บทบาท |
|-------|-------|
| `project-manager` | วางแผน, timeline, risk, status report |
| `business-analyst` | BRD, user stories, requirement gathering |
| `solution-architect` | system design, tech stack, ADR |
| `system-analyst` | FSD, use cases, API spec |
| `ux-designer` | user flow, wireframe, interaction design |
| `developer` | implement code, unit test, code review |
| `qa-tester` | test plan, test cases, bug report |
| `devops-engineer` | CI/CD, deployment, infrastructure |
| `seo-specialist` | keyword research, on-page/technical SEO, SEO audit |

### 9 Skills
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

### 7 Slash Commands
| Command | ทำอะไร |
|---------|--------|
| `/feature-kickoff <feature>` | เริ่ม feature ใหม่: BA → Architect → SA → PM |
| `/sprint-plan <sprint>` | sprint planning ทั้งหมด |
| `/code-review <file>` | review code แบบครบ checklist |
| `/test-design <feature>` | ออกแบบ test cases ครบทุกแง่ |
| `/bug-report <issue>` | สร้าง bug report แบบ structured |
| `/retrospective <sprint>` | sprint retro: glad/sad/mad + action items |
| `/seo-audit <url>` | SEO audit ครอบคลุม + action plan 3 เดือน |

---

## 🗂️ โครงสร้างไฟล์

```
sqt-marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   └── software-company/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── agents/         (9 agents)
│       ├── skills/         (9 skills)
│       └── commands/       (7 commands)
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
