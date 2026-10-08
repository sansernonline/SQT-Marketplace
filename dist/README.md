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
| `career` | 0.2.1 | 9 | 3 | 3 | 0.1 MB |
| `consumer-rights` | 0.2.1 | 8 | 2 | 2 | 0.1 MB |
| `dev-learning` | 0.3.2 | 10 | 2 | 2 | 0.1 MB |
| `graphic-design` | 0.3.2 | 14 | 5 | 6 | 0.1 MB |
| `health-wellness` | 0.2.1 | 9 | 2 | 2 | 0.1 MB |
| `home-family` | 0.2.1 | 11 | 3 | 3 | 0.1 MB |
| `online-seller` | 0.2.2 | 12 | 4 | 4 | 0.1 MB |
| `personal-life` | 0.4.2 | 18 | 4 | 6 | 0.1 MB |
| `software-company` | 2.2.1 | 108 | 39 | 29 | 3.7 MB |
| `superuser` | 1.0.1 | 4 | 1 | 0 | 0.0 MB |
| `thai-workplace` | 0.4.2 | 21 | 5 | 8 | 0.1 MB |
| `trading-finance` | 0.4.2 | 22 | 5 | 7 | 0.1 MB |

ไฟล์ .zip ภายใน skill (เช่นคลังไอคอน) ไม่อยู่ใน `claude-web/` เพราะหน้าเว็บแตกไฟล์ไม่ได้ · ชุด codex และ gemini-cli มีครบ
