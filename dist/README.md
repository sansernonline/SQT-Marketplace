# dist — ชุดสำหรับเครื่องมืออื่น

> สร้างอัตโนมัติโดย scripts/build/build-targets.mjs · ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง · สร้างใหม่ → รัน `scripts\build-dist.cmd`

ทุก plugin ได้ชุดของตัวเอง ติดตั้งเฉพาะ plugin ที่ใช้

| ปลายทาง | โฟลเดอร์ | วิธีใช้ |
|---|---|---|
| claude.ai (Cowork / แชทเว็บ) | `claude-web/<plugin>.zip` | อัปโหลดทีละไฟล์ |
| OpenAI Codex CLI | `codex/<plugin>/` | คัดลอกเนื้อในโฟลเดอร์ไปไว้รากโปรเจกต์ |
| Gemini CLI | `gemini-cli/<plugin>/` | `gemini extensions install <โฟลเดอร์>` |
| ChatGPT Custom GPT / Gemini Gem | `chat-web/<plugin>/<บทบาท>/` | ดู `chat-web/README.md` |

| plugin | รุ่น | skill | บทบาท | คำสั่ง | ขนาด zip |
|---|---|---:|---:|---:|---:|
| `career` | 0.2.0 | 8 | 3 | 3 | 0.1 MB |
| `consumer-rights` | 0.2.0 | 7 | 2 | 2 | 0.1 MB |
| `dev-learning` | 0.3.0 | 9 | 2 | 2 | 0.1 MB |
| `graphic-design` | 0.3.0 | 13 | 5 | 6 | 0.1 MB |
| `health-wellness` | 0.2.0 | 8 | 2 | 2 | 0.1 MB |
| `home-family` | 0.2.0 | 10 | 3 | 3 | 0.1 MB |
| `online-seller` | 0.2.0 | 11 | 4 | 4 | 0.1 MB |
| `personal-life` | 0.4.0 | 17 | 4 | 6 | 0.1 MB |
| `software-company` | 2.1.0 | 107 | 39 | 28 | 3.7 MB |
| `superuser` | 1.0.0 | 3 | 1 | 0 | 0.0 MB |
| `thai-workplace` | 0.4.0 | 20 | 5 | 8 | 0.1 MB |
| `trading-finance` | 0.4.0 | 21 | 5 | 7 | 0.1 MB |

ไฟล์ .zip ภายใน skill (เช่นคลังไอคอน) ไม่อยู่ใน `claude-web/` เพราะหน้าเว็บแตกไฟล์ไม่ได้ · ชุด codex และ gemini-cli มีครบ
