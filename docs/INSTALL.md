# ติดตั้ง — Claude Code · claude.ai · LLM ตัวอื่น

| ปลายทาง | ไปที่ |
|---|---|
| Claude Code | หัวข้อ "วิธีที่ 1–3" ด้านล่าง |
| claude.ai (Cowork / แชทเว็บ) | [claude.ai — อัปโหลด software-company.zip](#claudeai--อัปโหลด-software-companyzip) |
| Codex CLI · Gemini CLI · ChatGPT · Gemini Gem | [ใช้ชุดนี้กับ LLM ตัวอื่น](#ใช้ชุดนี้กับ-llm-ตัวอื่น) |

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

**Node.js 16 ขึ้นไป ใน PATH** — hook ของ A-Team รันด้วย `node` · ไม่มีก็ใช้งานหลักได้ปกติ แค่ไม่มี log ใน `.a-team/log/` และไม่มีแจ้งข้อความใน inbox (`node --version` ตรวจได้)

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

ออกแล้วเปิดใหม่ เพื่อให้ agents, skills, commands, hooks โหลด

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

**ข้อเสีย:** อัปเดตทีหลังต้อง copy ทับเอง · **ไม่มี hooks** — A-Team ใช้ได้ แต่ไม่มี log และไม่แจ้งข้อความใน inbox (ดู [SKILL-LEVELS.md](SKILL-LEVELS.md))

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
/plugin update software-company@sqt-marketplace
```

---

## การตรวจสอบหลังติดตั้ง

### 1. ดู agents ที่มี
```
/agents
```

ควรเห็น 38 agents ของ software-company เช่น project-manager · business-analyst · solution-architect · system-analyst · developer · qa-tester · devops-engineer

### 2. ดู slash commands
```
/help
```

ควรเห็น 28 commands ของ software-company เช่น:
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

### 4. ตรวจ hooks
```
/hooks
```

ควรเห็น hook ของ software-company (`a-team-hook.mjs`) — รายการ event ดู [REFERENCE.md หัวข้อ Hooks](REFERENCE.md#hooks)

### 5. เปิด A-Team ในโปรเจกต์

พูดว่า "ใช้ a-team" แล้วหัวหน้าทีมตั้งให้เอง หรือทำเอง:

```bash
mkdir -p .a-team/log .a-team/inbox/done
echo ".a-team/" >> .gitignore
```

hook เขียน log เฉพาะโปรเจกต์ที่มี `.a-team/` — โฟลเดอร์อื่นไม่ถูกแตะ

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

---

## claude.ai — อัปโหลด software-company.zip

`dist/claude-web/software-company.zip` คือ plugin `software-company` ที่บีบอัดไว้สำหรับ **อัปโหลดเข้า claude.ai** เพื่อให้ใช้ skill ได้ใน Cowork และแชทบนเว็บ/เดสก์ท็อป — ไม่ใช่เฉพาะ Claude Code

**ในไฟล์:** 101 skills · 38 agents · 28 commands · `plugin.json` v2.0.0 · โฟลเดอร์หลักในไฟล์ zip ชื่อ `software-company/`

---

### 📤 อัปโหลด

1. เปิด **claude.ai บนเว็บ** (เมนูนี้ยังไม่มีในแอปเดสก์ท็อป)
2. **Customize → Plugins → `+`** → Upload custom plugin
3. เลือก `software-company.zip`

**ถ้าเคยอัปโหลดตัวเก่าไว้แล้ว** ต้องลบตัวเก่าออกก่อนแล้วอัปโหลดใหม่ ไม่งั้นจะเป็น skill ชุดเดิม

ข้อจำกัด: ไฟล์ ≤ 50 MB · 1 marketplace เก็บได้ ≤ 100 plugins

---

### ✅ ใช้ได้ที่ไหนบ้าง

| | skills | commands | agents | hooks |
|---|:---:|:---:|:---:|:---:|
| Cowork | ✅ | ✅ | ✅ | ✅ (รอยืนยัน) |
| แชทเว็บ / แท็บ Chat ในเดสก์ท็อป | ✅ | ✅ | ⛔ เทา | ⛔ เทา |

skill ทำงานทุกที่ · agent กับ hook จะเป็นสีเทาในหน้าแชทธรรมดา

---

### 🔄 สร้าง zip ใหม่หลังแก้ skill

แก้ไฟล์ใน `plugins/software-company/` แล้วสำเนาที่อัปโหลดไว้จะ **ไม่อัปเดตตาม** ต้อง build ใหม่แล้วอัปโหลดทับ

```bash
node scripts/validate-marketplace.mjs   # ตรวจก่อนเสมอ
node scripts/build-targets.mjs          # สร้าง dist/ ทั้งหมด รวม zip นี้
```

สคริปต์เขียน zip เอง ไม่ต้องมีคำสั่ง `zip` หรือ Python · path ในไฟล์ใช้ `/` และโฟลเดอร์หลักเป็น `software-company/` ให้อัตโนมัติ ·
วันที่ในไฟล์คงที่ ถ้าเนื้อหาไม่เปลี่ยน zip ก็ไม่เปลี่ยน git จึงไม่เห็นว่ามีการแก้

---

### 🔗 ต่างจาก Claude Code อย่างไร

| | ไฟล์ zip นี้ (ระดับ account) | `/plugin install` (Claude Code) |
|---|---|---|
| ใช้ได้ที่ | Cowork + แชททุกช่องทาง | Claude Code เท่านั้น |
| แหล่งไฟล์ | สำเนาที่อัปโหลด | GitHub หรือ path ในเครื่อง |
| แก้ไฟล์แล้ว | zip ใหม่ + อัปโหลดทับ | `/reload-plugins` หรือ push |

ทั้งสองทางใช้ร่วมกันได้ — แต่ถ้าแก้ skill ต้องอัปเดตทั้งคู่

---

### หมายเหตุ

- `dist/` ถูก commit ขึ้น git ด้วย (zip ราว 3 MB) คนอื่นจึงดาวน์โหลดไปอัปโหลดได้เลยโดยไม่ต้องรันสคริปต์
- ใช้ได้กับ Claude เท่านั้น — LLM ตัวอื่นดู [OTHER-LLMS.md](#ใช้ชุดนี้กับ-llm-ตัวอื่น)

---

### ตัวย่อ

- **zip** — ไฟล์บีบอัดรูปแบบ ZIP
- **MB** — megabyte (เมกะไบต์)
- **KB** — kilobyte (กิโลไบต์)

---

## ใช้ชุดนี้กับ LLM ตัวอื่น

ต้นฉบับอยู่ที่ `plugins/` ในรูปแบบของ Claude แล้ว `scripts/build-targets.mjs` จะสร้าง `dist/` ให้ปลายทางแต่ละตัว
ถ้าจะแก้ ให้แก้ที่ `plugins/` แล้วรันสคริปต์ใหม่ ห้ามแก้ใน `dist/`

| ปลายทาง | โฟลเดอร์ | ได้อะไร | ไม่ได้อะไร |
|---|---|---|---|
| Claude Code | `plugins/` (ติดตั้งตาม [หัวข้อแรกของไฟล์นี้](#วิธีที่-1-local-marketplace-แนะนำสำหรับทดลอง)) | ครบทุกอย่าง | — |
| claude.ai (Cowork / แชทเว็บ) | `dist/claude-web/software-company.zip` (อัปโหลดตาม [CLAUDE-WEB.md](#claudeai--อัปโหลด-software-companyzip)) | plugin หลักทั้งตัว | agent ในหน้าแชทธรรมดา · plugin เสริมตามสายงาน |
| OpenAI Codex CLI | `dist/codex/` | skill · subagent · คำสั่งสำเร็จรูป (แปลงเป็น skill) | ส่วน `model:` ของ agent |
| Gemini CLI | `dist/gemini-cli/` | skill · subagent · slash command | ส่วน `tools:` `model:` ของ agent |
| ChatGPT Custom GPT | `dist/chat-web/` | หนึ่งบทบาทต่อหนึ่ง GPT พร้อม skill ที่บทบาทนั้นใช้ | script ใน skill · slash command |
| Gemini Gem | `dist/chat-web/` | เหมือน Custom GPT | เหมือน Custom GPT |

> ข้อมูลรูปแบบไฟล์และขีดจำกัดตรวจจากเอกสารทางการเมื่อ 2026-10-01 · ยังไม่ได้ลองติดตั้งจริงกับทุกเครื่องมือ

---

### OpenAI Codex CLI

คัดลอกเนื้อหาใน `dist/codex/` ไปไว้ที่รากโปรเจกต์ (ใช้เฉพาะโปรเจกต์นั้น) หรือที่ home (ใช้ทุกโปรเจกต์):

| ไฟล์ใน `dist/codex/` | ระดับโปรเจกต์ | ระดับผู้ใช้ |
|---|---|---|
| `.agents/skills/` | `<repo>/.agents/skills/` | `~/.agents/skills/` |
| `.codex/agents/` | `<repo>/.codex/agents/` | `~/.codex/agents/` |
| `AGENTS.md` | `<repo>/AGENTS.md` (ถ้ามีอยู่แล้วให้ต่อท้าย) | `~/.codex/AGENTS.md` |

- เรียก skill หรือคำสั่งด้วย `$ชื่อ` เช่น `$code-review src/app.ts` หรือปล่อยให้ Codex เลือกเอง
- Codex จำกัดขนาด `AGENTS.md` ที่รวมกันทั้งหมดไว้ที่ 32 KiB ไฟล์ของชุดนี้ใช้ราว 18 KiB
- ไม่มี hook ของเรา → `.a-team/log/` ช่วงนั้นว่าง · Codex อ่าน `AGENTS.md` ของโปรเจกต์แล้วไป `CONTEXT.md` — ก่อนจบให้มันเขียนหัวข้อ "รับงานต่อ" ใน `CONTEXT.md`

### Gemini CLI

`dist/gemini-cli/` เป็น extension ที่ติดตั้งได้ทั้งโฟลเดอร์:

```bash
gemini extensions install ./dist/gemini-cli
```

- คำสั่งเรียกด้วย `/ชื่อ` เช่น `/code-review src/app.ts`
- skill และ subagent ถูกโหลดเองเมื่องานตรงกับคำอธิบาย
- ไม่มี hook ของเรา → `.a-team/log/` ช่วงนั้นว่าง · Gemini อ่าน `GEMINI.md` ของโปรเจกต์แล้วไป `CONTEXT.md` — ก่อนจบให้มันเขียนหัวข้อ "รับงานต่อ" ใน `CONTEXT.md`

> ⚠ Google ประกาศว่า Gemini CLI ถูกแทนด้วย Antigravity CLI ตั้งแต่ 18 มิถุนายน 2026 สำหรับผู้ใช้ระดับฟรีและ Google One
> ยังไม่ได้ตรวจว่า Antigravity CLI อ่าน extension รูปแบบนี้ได้หรือไม่

### ChatGPT Custom GPT และ Gemini Gem

หนึ่งโฟลเดอร์ `dist/chat-web/<plugin>/<role>/` = หนึ่ง GPT หรือ Gem

1. สร้าง GPT หรือ Gem ใหม่ ตั้งชื่อตามบทบาท
2. วาง `instructions.md` ในช่อง Instructions
3. อัปโหลดทุกไฟล์ใน `knowledge/`

ขีดจำกัดที่สคริปต์ใช้: Instructions ไม่เกิน 8,000 ตัวอักษร (Custom GPT) และไฟล์ความรู้ไม่เกิน 10 ไฟล์ (Gem รับ 10 · GPT รับ 20)
บทบาทที่ยาวเกินจะถูกย้ายไป `knowledge/00-role.md` และช่อง Instructions จะเหลือแค่คำสั่งให้ไปอ่านไฟล์นั้น

---

### ชุด prompt (`prompt/`)

ใช้ร่วมกันได้ไม่ต้องแปลง — เป็นข้อความธรรมดาที่เรียก agent และ skill ด้วยชื่อ ซึ่งมีอยู่ใน `dist/` ทุกชุด

| ปลายทาง | ใช้ได้ไหม | หมายเหตุ |
|---|---|---|
| Claude Code · Codex CLI · Gemini CLI | ✅ | วางทั้งไฟล์ที่รากโฟลเดอร์โปรเจกต์ตาม [prompt/README.md](../prompt/README.md) |
| ChatGPT · Gemini บนเว็บ | ❌ เกือบทั้งหมด | prompt ต้องอ่าน/เขียนไฟล์ในโปรเจกต์ รัน test และใช้ git ซึ่งหน้าเว็บทำไม่ได้ |

ส่วนที่มีเฉพาะ Claude:

- `/loop` ใน `docs/AGENT-LOOP.md` (ฉบับ 10 ของ `prompt-new-project.md`) — เครื่องมืออื่นใช้วิธีวางทีละรอบในหน้าต่างใหม่
- `anthropic-skills:docx` / `anthropic-skills:pdf` ในฉบับ 13 — ไม่มีให้ใช้ `branded-document-design` อย่างเดียว ซึ่งต้องรัน Python ได้
