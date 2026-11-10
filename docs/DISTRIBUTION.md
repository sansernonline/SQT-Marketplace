# ช่องทางเผยแพร่

ตารางเดียวที่บอกว่า plugin ชุดนี้ไปถึงผู้ใช้ทางไหนบ้าง สถานะตอนนี้เป็นอย่างไร ไฟล์จริงมาจากไหน และแก้อะไรแล้วต้องรันคำสั่งไหนซ้ำ · วิธีติดตั้งฝั่งผู้ใช้อยู่ใน [INSTALL.md](INSTALL.md)

## ช่องทาง

| ช่องทาง | สถานะ | ที่มาจริง (ไฟล์ที่สร้างหรือใช้) | ตรวจล่าสุด |
|---|---|---|---|
| Claude Code · marketplace จาก GitHub (`sansernonline/SQT-Marketplace`) | ใช้งานได้ | `.claude-plugin/marketplace.json` + `plugins/<plugin>/.claude-plugin/plugin.json` | 2026-10-25 ติดตั้ง 6 plugin ผ่าน `claude plugin` ในเครื่องนี้ · manifest ตรวจอัตโนมัติ 2026-11-10 |
| Claude Code · marketplace จาก path ในเครื่อง | ใช้งานได้ | โฟลเดอร์ repo เอง · `scripts/install/install-marketplace.ps1` | 2026-10-25 |
| claude.ai (Cowork · แชทเว็บ) อัปโหลด zip | ใช้งานได้ · agent และ hook เป็นสีเทาในแชทธรรมดา | `dist/claude-web/<plugin>.zip` จาก `scripts/build/build-targets.mjs` | ยังไม่ได้ตรวจซ้ำ · ข้อจำกัดขนาดจาก INSTALL.md |
| OpenAI Codex CLI | สร้างแล้ว · ยังไม่ได้ทดสอบกับ Codex จริงในรอบนี้ | `dist/codex/<plugin>/` (`.agents/skills` · `.codex/agents/*.toml` · `AGENTS.md`) | โครงสร้าง manifest ตรวจ 2026-11-10 |
| Gemini CLI | สร้างแล้ว · ยังไม่ได้ทดสอบกับ Gemini CLI จริงในรอบนี้ | `dist/gemini-cli/<plugin>/gemini-extension.json` | โครงสร้าง manifest ตรวจ 2026-11-10 |
| Kimi Code CLI | สร้างแล้ว · ยังไม่ได้ทดสอบกับ Kimi จริงในรอบนี้ | `dist/kimi/<plugin>/kimi.plugin.json` | โครงสร้าง manifest ตรวจ 2026-11-10 |
| ChatGPT Custom GPT · Gemini Gem | สร้างแล้ว · ต้องทำมือทีละบทบาท | `dist/chat-web/<plugin>/<บทบาท>/` | ยังไม่ได้ตรวจซ้ำ |
| ติดตั้งสำเนา skill ในโปรเจกต์ผู้ใช้ (Codex · Gemini · Kimi) พร้อมอัปเดตที่ไม่ทับของที่แก้เอง | ใช้ได้ · มี self-test | `scripts/sync/update-skills.mjs` + `scripts/sync/prior-names.json` | 2026-11-10 self-test ผ่าน |

"ตรวจล่าสุด" บอกว่ามีคนหรือสคริปต์ตรวจอะไรจริงเมื่อไหร่ · ไม่ได้แปลว่าทดสอบกับเครื่องมือปลายทางจริง · เซลล์ที่เขียนว่ายังไม่ได้ตรวจ ให้ตรวจก่อนบอกผู้ใช้ว่าใช้ได้

## แก้อะไร ต้องรันอะไรซ้ำ

| แก้ | รันซ้ำ | เพราะ |
|---|---|---|
| ไฟล์ใดใน `plugins/` | `node scripts/build/build-targets.mjs` แล้ว commit `dist/` (Windows: `scripts\build-dist.cmd`) | `dist/` ทุกช่องทางสร้างจากต้นฉบับ · CI ล้มถ้าไม่ตรง |
| `plugin.json` หรือ `marketplace.json` | `node scripts/check/validate-manifests.mjs` | manifest ของ Claude Code และของเครื่องมืออื่นต้องไปทางเดียวกัน |
| `plugins/superuser` (ของกลาง) | `node scripts/sync/sync-superuser.mjs` แล้วรัน build ต่อ | สำเนาในทุก plugin ต้องตรงต้นฉบับ |
| เพิ่ม ลบ หรือเปลี่ยนชื่อ skill · agent | `node scripts/sync/sync-docs.mjs` · `node scripts/sync/sync-file-map.mjs` แล้วรัน build | ตัวเลขในเอกสารและแผนผังไฟล์ |
| เปลี่ยนชื่อโฟลเดอร์ skill | เพิ่มแถวใน `scripts/sync/prior-names.json` | ให้ `update-skills.mjs` ลบสำเนาชื่อเก่าในโปรเจกต์ผู้ใช้ |
| หัวข้อ skill ที่ไฟล์อื่นดึงด้วย marker `include` | `node scripts/sync/sync-includes.mjs` | เนื้อที่ดึงมาต้องตรงต้นฉบับ |
| ก่อน commit ทุกครั้ง | `node scripts/check/validate-marketplace.mjs` | ตัวตรวจรวม |
| ก่อนปล่อยรุ่น | ขึ้นเลขรุ่นใน `plugin.json` (แม้แก้แค่ข้อความ) | `claude plugin update` เทียบเลขรุ่นอย่างเดียว |
| ช่องทางใหม่ | เพิ่มแถวในตารางด้านบน และเพิ่มการตรวจใน `scripts/check/validate-manifests.mjs` | ไม่ให้ช่องทางที่ไม่มีใครตรวจค้างอยู่ |
