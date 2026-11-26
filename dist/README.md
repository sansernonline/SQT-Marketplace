# dist — ชุดสำหรับเครื่องมืออื่น

> สร้างอัตโนมัติโดย scripts/build/build-targets.mjs · ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง · สร้างใหม่ → รัน `scripts\build-dist.cmd`

ทุก plugin ได้ชุดของตัวเอง ติดตั้งเฉพาะ plugin ที่ใช้

| ปลายทาง | โฟลเดอร์ | วิธีใช้ |
|---|---|---|
| claude.ai (Cowork / แชทเว็บ) | `claude-web/<plugin>.zip` | อัปโหลดทีละไฟล์ |
| OpenAI Codex CLI | `codex/<plugin>/` | คัดลอกเนื้อในโฟลเดอร์ไปไว้รากโปรเจกต์ |
| Gemini CLI | `gemini-cli/<plugin>/` | `gemini extensions install <โฟลเดอร์>` |
| Kimi Code CLI | `kimi/<plugin>/` | `/plugins install <โฟลเดอร์>` ในหน้าจอ Kimi |
| Hermes Agent | `hermes/<plugin>/` | ใส่ `<โฟลเดอร์>/skills` ใน `skills.external_dirs` ของ `~/.hermes/config.yaml` แล้ว `/reload-skills` · คัด `HERMES.md` ไปรากโปรเจกต์ถ้าต้องการบริบท |
| ChatGPT Custom GPT / Gemini Gem | `chat-web/<plugin>/<บทบาท>/` | ดู `chat-web/README.md` |

| plugin | รุ่น | skill | บทบาท | คำสั่ง | ขนาด zip |
|---|---|---:|---:|---:|---:|
| `e-commerce` | 1.12.0 | 49 | 12 | 1 | 1.3 MB |
| `graphic-design` | 0.35.0 | 39 | 10 | 0 | 1.4 MB |
| `personal-life` | 0.27.0 | 58 | 13 | 1 | 1.4 MB |
| `software-development` | 3.10.0 | 114 | 42 | 12 | 7.9 MB |
| `superuser` | 4.0.0 | 15 | 4 | 0 | 1.1 MB |
| `trading-finance` | 0.24.0 | 39 | 9 | 1 | 1.3 MB |

ไฟล์ .zip ภายใน skill (เช่นคลังไอคอน) ไม่อยู่ใน `claude-web/` เพราะหน้าเว็บแตกไฟล์ไม่ได้ · ชุด codex · gemini-cli · kimi · hermes มีครบ

Hermes: อย่าวางใน `.hermes/skills` ของโปรเจกต์ ตัวสแกนของ Hermes กัก skill `superuser` ไว้ (อ่านรายการคำสั่งที่ด่าน guard ห้าม เช่น `rm -rf` ว่าเป็นคำสั่งอันตราย และไฟล์เกิน 50 ไฟล์) · `skills.external_dirs` ไม่ผ่านตัวสแกนนี้ (ตรวจกับ Hermes v0.23.1 วันที่ 2026-11-15) · skill กลางอยู่ในทุก plugin ใส่หลาย plugin แล้วชื่อจะซ้ำ ยังไม่ได้ตรวจว่า Hermes เลือกตัวไหน
