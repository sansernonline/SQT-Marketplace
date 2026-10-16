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
| `career` | 0.5.0 | 9 | 5 | 3 | 0.1 MB |
| `consumer-rights` | 0.5.0 | 8 | 4 | 2 | 0.1 MB |
| `dev-learning` | 0.7.0 | 11 | 4 | 2 | 0.1 MB |
| `graphic-design` | 0.6.0 | 14 | 7 | 6 | 0.1 MB |
| `health-wellness` | 0.5.0 | 9 | 4 | 2 | 0.1 MB |
| `home-family` | 0.5.0 | 11 | 5 | 3 | 0.1 MB |
| `online-seller` | 0.5.0 | 12 | 6 | 4 | 0.1 MB |
| `personal-life` | 0.7.0 | 18 | 6 | 6 | 0.1 MB |
| `software-company` | 2.8.0 | 112 | 41 | 29 | 5.9 MB |
| `superuser` | 1.3.0 | 4 | 3 | 0 | 0.1 MB |
| `thai-workplace` | 0.7.0 | 21 | 7 | 8 | 0.1 MB |
| `trading-finance` | 0.7.0 | 22 | 7 | 7 | 0.1 MB |

ไฟล์ .zip ภายใน skill (เช่นคลังไอคอน) ไม่อยู่ใน `claude-web/` เพราะหน้าเว็บแตกไฟล์ไม่ได้ · ชุด codex · gemini-cli · kimi มีครบ
