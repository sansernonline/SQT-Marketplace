# คู่มือติดตั้ง Software Company Plugin

มี 3 วิธี เลือกตามสถานการณ์

---

## ✅ ก่อนเริ่ม: ตรวจสอบ Claude Code version

Plugin system ต้องการ Claude Code version ใหม่พอ ตรวจด้วย:

```bash
claude --version
```

ถ้าเก่าให้อัปเดต:
```bash
npm install -g @anthropic-ai/claude-code
```

---

## วิธีที่ 1: Local Marketplace (แนะนำสำหรับทดลอง)

เหมาะกับ: ทดลองใช้คนเดียว, พัฒนา plugin ต่อ

### ขั้นตอน

**1. เปิด Claude Code ในโปรเจกต์ใดก็ได้**
```bash
cd "any-project"
claude
```

**2. เพิ่ม marketplace**

ใน Claude Code prompt พิมพ์:
```
/plugin marketplace add C:/Users/sanse/OneDrive/WORK/_KK/Projects/Agent Skill - Sub Agents & Agent Skills/SQT-Marketplace
```

ระบบจะตอบกลับว่าเพิ่ม marketplace สำเร็จ

**3. ติดตั้ง plugin**
```
/plugin install software-company@sqt-marketplace
```

**4. ยืนยันการติดตั้ง**
```
/plugin
```

จะเห็น `software-company` ในรายการ พร้อม status `enabled`

**5. รีสตาร์ท Claude Code** (สำคัญ)

ออกแล้วเปิดใหม่ เพื่อให้ agents, skills, commands โหลด

---

## วิธีที่ 2: Copy ตรงๆ (เร็วสุด)

เหมาะกับ: ทดลองชั่วคราว, ไม่ต้องการ marketplace

### Project level (เฉพาะ project เดียว)

```bash
# ใน project ที่ต้องการใช้
cp -r "C:/Users/sanse/OneDrive/WORK/_KK/Projects/Agent Skill - Sub Agents & Agent Skills/SQT-Marketplace/plugins/software-company/." ".claude/"
```

โครงสร้างที่ได้:
```
your-project/
└── .claude/
    ├── agents/
    ├── skills/
    └── commands/
```

### User level (ใช้ทุก project)

```bash
mkdir -p ~/.claude/agents ~/.claude/skills ~/.claude/commands

# Windows (Git Bash)
cp -r "C:/Users/sanse/OneDrive/WORK/_KK/Projects/Agent Skill - Sub Agents & Agent Skills/SQT-Marketplace/plugins/software-company/agents/." ~/.claude/agents/
cp -r "C:/Users/sanse/OneDrive/WORK/_KK/Projects/Agent Skill - Sub Agents & Agent Skills/SQT-Marketplace/plugins/software-company/skills/." ~/.claude/skills/
cp -r "C:/Users/sanse/OneDrive/WORK/_KK/Projects/Agent Skill - Sub Agents & Agent Skills/SQT-Marketplace/plugins/software-company/commands/." ~/.claude/commands/
```

**ข้อเสีย:** อัปเดตทีหลังต้อง copy ทับเอง

---

## วิธีที่ 3: Git Repository (แชร์ทีม)

เหมาะกับ: แชร์ให้เพื่อนร่วมงาน, version control

### ขั้นตอน

**1. Push ขึ้น Git**

```bash
cd "SQT-Marketplace"
git init
git add .
git commit -m "feat: initial software company plugin"
git remote add origin https://github.com/sansernonline/SQT-Marketplace.git
git push -u origin main
```

**2. เพื่อนร่วมทีมติดตั้งด้วยคำสั่ง**

```
/plugin marketplace add sansernonline/SQT-Marketplace
/plugin install software-company@sqt-marketplace
```

**3. อัปเดต**

เมื่อมี version ใหม่:
```
/plugin marketplace update sqt-marketplace
/plugin update software-company
```

---

## การตรวจสอบหลังติดตั้ง

### 1. ดู agents ที่มี
```
/agents
```

ควรเห็น 8 agents:
- project-manager
- business-analyst
- solution-architect
- system-analyst
- ux-designer
- developer
- qa-tester
- devops-engineer

### 2. ดู slash commands
```
/help
```

ควรเห็น commands พวกนี้:
- /feature-kickoff
- /sprint-plan
- /code-review
- /test-design
- /bug-report
- /retrospective

### 3. ทดลอง skill
พิมพ์:
```
ช่วยเขียน user story สำหรับ feature reset password หน่อย
```

Claude ควรเรียก skill `user-story-writer` มาใช้อัตโนมัติ

---

## การถอนการติดตั้ง

### Plugin (วิธีที่ 1 และ 3)
```
/plugin uninstall software-company
```

### Marketplace
```
/plugin marketplace remove sqt-marketplace
```

### Copy ตรงๆ (วิธีที่ 2)
ลบโฟลเดอร์ที่ copy ไป:
- `<project>/.claude/agents/`, `skills/`, `commands/`
- หรือ `~/.claude/agents/`, `skills/`, `commands/`

---

## Troubleshooting

### Plugin ไม่ขึ้นหลังติดตั้ง
- รีสตาร์ท Claude Code (ออกแล้วเปิดใหม่)
- ตรวจ `/plugin` ว่า status เป็น `enabled`

### Agent ไม่ถูกเรียก
- ตรวจ description ของ agent ว่าตรงกับงานที่ขอ
- ลองเรียกตรงๆ: `ใช้ agent business-analyst ช่วย...`

### Skill ไม่ทำงาน
- ตรวจว่า skill name ถูกต้อง: `/<skill-name>`
- ตรวจไฟล์ `SKILL.md` ว่า frontmatter ถูกต้อง

### "marketplace not found"
- ตรวจ path ของ marketplace ว่าถูกต้อง
- ตรวจไฟล์ `.claude-plugin/marketplace.json` มีอยู่

### Path บน Windows มีช่องว่าง
- ใส่ quotation marks รอบ path:
  ```
  /plugin marketplace add "C:/Users/sanse/OneDrive/WORK/_KK/Projects/Agent Skill - Sub Agents & Agent Skills/SQT-Marketplace"
  ```
