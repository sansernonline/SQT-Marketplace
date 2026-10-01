# ใช้ชุดนี้กับ LLM ตัวอื่น

ต้นฉบับอยู่ที่ `plugins/` ในรูปแบบของ Claude แล้ว `scripts/build-targets.mjs` จะสร้าง `dist/` ให้ปลายทางแต่ละตัว
ถ้าจะแก้ ให้แก้ที่ `plugins/` แล้วรันสคริปต์ใหม่ ห้ามแก้ใน `dist/`

| ปลายทาง | โฟลเดอร์ | ได้อะไร | ไม่ได้อะไร |
|---|---|---|---|
| Claude Code | `plugins/` (ติดตั้งตาม [INSTALL.md](INSTALL.md)) | ครบทุกอย่าง | — |
| claude.ai (Cowork / แชทเว็บ) | `dist/claude-web/software-company.zip` (อัปโหลดตาม [CLAUDE-WEB.md](CLAUDE-WEB.md)) | plugin หลักทั้งตัว | agent ในหน้าแชทธรรมดา · plugin เสริมตามสายงาน |
| OpenAI Codex CLI | `dist/codex/` | skill · subagent · คำสั่งสำเร็จรูป (แปลงเป็น skill) | ส่วน `model:` ของ agent |
| Gemini CLI | `dist/gemini-cli/` | skill · subagent · slash command | ส่วน `tools:` `model:` ของ agent |
| ChatGPT Custom GPT | `dist/chat-web/` | หนึ่งบทบาทต่อหนึ่ง GPT พร้อม skill ที่บทบาทนั้นใช้ | script ใน skill · slash command |
| Gemini Gem | `dist/chat-web/` | เหมือน Custom GPT | เหมือน Custom GPT |

> ข้อมูลรูปแบบไฟล์และขีดจำกัดตรวจจากเอกสารทางการเมื่อ 2026-10-01 · ยังไม่ได้ลองติดตั้งจริงกับทุกเครื่องมือ

---

## OpenAI Codex CLI

คัดลอกเนื้อหาใน `dist/codex/` ไปไว้ที่รากโปรเจกต์ (ใช้เฉพาะโปรเจกต์นั้น) หรือที่ home (ใช้ทุกโปรเจกต์):

| ไฟล์ใน `dist/codex/` | ระดับโปรเจกต์ | ระดับผู้ใช้ |
|---|---|---|
| `.agents/skills/` | `<repo>/.agents/skills/` | `~/.agents/skills/` |
| `.codex/agents/` | `<repo>/.codex/agents/` | `~/.codex/agents/` |
| `AGENTS.md` | `<repo>/AGENTS.md` (ถ้ามีอยู่แล้วให้ต่อท้าย) | `~/.codex/AGENTS.md` |

- เรียก skill หรือคำสั่งด้วย `$ชื่อ` เช่น `$code-review src/app.ts` หรือปล่อยให้ Codex เลือกเอง
- Codex จำกัดขนาด `AGENTS.md` ที่รวมกันทั้งหมดไว้ที่ 32 KiB ไฟล์ของชุดนี้ใช้ราว 18 KiB

## Gemini CLI

`dist/gemini-cli/` เป็น extension ที่ติดตั้งได้ทั้งโฟลเดอร์:

```bash
gemini extensions install ./dist/gemini-cli
```

- คำสั่งเรียกด้วย `/ชื่อ` เช่น `/code-review src/app.ts`
- skill และ subagent ถูกโหลดเองเมื่องานตรงกับคำอธิบาย

> ⚠ Google ประกาศว่า Gemini CLI ถูกแทนด้วย Antigravity CLI ตั้งแต่ 18 มิถุนายน 2026 สำหรับผู้ใช้ระดับฟรีและ Google One
> ยังไม่ได้ตรวจว่า Antigravity CLI อ่าน extension รูปแบบนี้ได้หรือไม่

## ChatGPT Custom GPT และ Gemini Gem

หนึ่งโฟลเดอร์ `dist/chat-web/<plugin>/<role>/` = หนึ่ง GPT หรือ Gem

1. สร้าง GPT หรือ Gem ใหม่ ตั้งชื่อตามบทบาท
2. วาง `instructions.md` ในช่อง Instructions
3. อัปโหลดทุกไฟล์ใน `knowledge/`

ขีดจำกัดที่สคริปต์ใช้: Instructions ไม่เกิน 8,000 ตัวอักษร (Custom GPT) และไฟล์ความรู้ไม่เกิน 10 ไฟล์ (Gem รับ 10 · GPT รับ 20)
บทบาทที่ยาวเกินจะถูกย้ายไป `knowledge/00-role.md` และช่อง Instructions จะเหลือแค่คำสั่งให้ไปอ่านไฟล์นั้น

---

## ชุด prompt (`prompt/`)

ใช้ร่วมกันได้ไม่ต้องแปลง — เป็นข้อความธรรมดาที่เรียก agent และ skill ด้วยชื่อ ซึ่งมีอยู่ใน `dist/` ทุกชุด

| ปลายทาง | ใช้ได้ไหม | หมายเหตุ |
|---|---|---|
| Claude Code · Codex CLI · Gemini CLI | ✅ | วางทั้งไฟล์ที่รากโฟลเดอร์โปรเจกต์ตาม [prompt/README.md](../prompt/README.md) |
| ChatGPT · Gemini บนเว็บ | ❌ เกือบทั้งหมด | prompt ต้องอ่าน/เขียนไฟล์ในโปรเจกต์ รัน test และใช้ git ซึ่งหน้าเว็บทำไม่ได้ |

ส่วนที่มีเฉพาะ Claude:

- `/loop` ใน `docs/AGENT-LOOP.md` (ฉบับ 10 ของ `prompt-new-project.md`) — เครื่องมืออื่นใช้วิธีวางทีละรอบในหน้าต่างใหม่
- `anthropic-skills:docx` / `anthropic-skills:pdf` ในฉบับ 13 — ไม่มีให้ใช้ `branded-document-design` อย่างเดียว ซึ่งต้องรัน Python ได้
