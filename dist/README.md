# dist — ชุดสำหรับเครื่องมืออื่น

> สร้างอัตโนมัติโดย scripts/build/build-targets.mjs · ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง · สร้างใหม่ → รัน `scripts\build-dist.cmd`

ทุก plugin ได้ชุดของตัวเอง ติดตั้งเฉพาะ plugin ที่ใช้

| ปลายทาง | โฟลเดอร์ | วิธีใช้ |
|---|---|---|
| claude.ai (Cowork / แชทเว็บ) | `claude-web/<plugin>.zip` | อัปโหลดทีละไฟล์ |
| OpenAI Codex CLI | `codex/<plugin>/` | คัดลอกเนื้อในโฟลเดอร์ไปไว้รากโปรเจกต์ |
| Gemini CLI | `gemini-cli/<plugin>/` | `gemini extensions install <โฟลเดอร์>` |
| Kimi Code CLI | `kimi/<plugin>/` | `/plugins install <โฟลเดอร์>` ในหน้าจอ Kimi |
| ChatGPT Custom GPT / Gemini Gem | `chat-web/<plugin>/<บทบาท>/` | ดู `chat-web/README.md` |

| plugin | รุ่น | skill | บทบาท | คำสั่ง | ขนาด zip |
|---|---|---:|---:|---:|---:|
| `e-commerce` | 1.0.0 | 45 | 7 | 6 | 0.4 MB |
| `graphic-design` | 0.10.0 | 48 | 8 | 6 | 0.4 MB |
| `personal-life` | 0.13.0 | 72 | 12 | 16 | 0.5 MB |
| `reverse-engineer` | 0.1.0 | 40 | 4 | 1 | 0.3 MB |
| `software-company` | 2.21.0 | 128 | 42 | 29 | 6.4 MB |
| `superuser` | 3.1.0 | 34 | 3 | 0 | 0.3 MB |
| `thai-workplace` | 0.11.0 | 54 | 7 | 8 | 0.4 MB |
| `trading-finance` | 0.11.0 | 52 | 7 | 7 | 0.4 MB |

ไฟล์ .zip ภายใน skill (เช่นคลังไอคอน) ไม่อยู่ใน `claude-web/` เพราะหน้าเว็บแตกไฟล์ไม่ได้ · ชุด codex · gemini-cli · kimi มีครบ
