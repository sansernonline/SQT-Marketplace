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
| `career` | 0.7.0 | 48 | 5 | 3 | 4.8 MB |
| `consumer-rights` | 0.7.0 | 47 | 4 | 2 | 4.8 MB |
| `dev-learning` | 0.9.0 | 50 | 4 | 2 | 4.8 MB |
| `graphic-design` | 0.9.0 | 53 | 7 | 6 | 4.8 MB |
| `health-wellness` | 0.7.0 | 48 | 4 | 2 | 4.8 MB |
| `home-family` | 0.7.0 | 50 | 5 | 3 | 4.8 MB |
| `online-seller` | 0.7.0 | 51 | 6 | 4 | 4.8 MB |
| `personal-life` | 0.11.0 | 54 | 6 | 6 | 4.8 MB |
| `software-company` | 2.20.0 | 123 | 42 | 29 | 6.2 MB |
| `sqt-toolkit` | 1.0.0 | 15 | 0 | 0 | 4.6 MB |
| `superuser` | 3.0.0 | 28 | 3 | 0 | 0.2 MB |
| `thai-workplace` | 0.9.0 | 60 | 7 | 8 | 4.8 MB |
| `trading-finance` | 0.10.0 | 61 | 7 | 7 | 4.8 MB |

ไฟล์ .zip ภายใน skill (เช่นคลังไอคอน) ไม่อยู่ใน `claude-web/` เพราะหน้าเว็บแตกไฟล์ไม่ได้ · ชุด codex · gemini-cli · kimi มีครบ
