---
name: rea-check
description: Check that the REA MCP server is connected and which analysis providers are ready. Read-only, changes no config.
disable-model-invocation: true
---

ตรวจความพร้อมของ REA (Reverse Engineer Anything) แบบอ่านอย่างเดียว · ห้ามรัน `rea setup` · `install.sh` · `npm install -g` · `npx rea-agents@latest` และห้ามแก้ `~/.claude.json`

1. **มี tool ไหม** — ดูว่ามี tool ชื่อขึ้นต้น `mcp__plugin_reverse-engineering-mcp_rea__` ไหม
   - มี → เรียก `binary_session` ด้วย `{}` แล้วสรุปจาก `result.tool_availability`: กลุ่มไหนใช้ได้ กลุ่มไหนใช้ไม่ได้เพราะอะไร แล้วข้ามไปข้อ 4
   - ไม่มี → ทำข้อ 2–3
2. **Node** — `node --version` ต้อง 22.19+ · 24.11+ หรือ 26+ (tool SQLite ต้อง 24.15+) · แล้ว `node "${CLAUDE_PLUGIN_ROOT}/scripts/rea-launch.mjs" --print` ดูคำสั่งที่ plugin ใช้เปิด server (คำสั่งนี้ไม่ดาวน์โหลดและไม่รันอะไร)
3. **ตรวจลึก (ถามผู้ใช้ก่อน เพราะ npx ดาวน์โหลดแพ็กเกจลง cache ของ npm)** — สร้างโฟลเดอร์ว่างใหม่ในโฟลเดอร์ชั่วคราว (ไม่ใช่โฟลเดอร์โปรเจกต์ เพื่อไม่ให้ npx อ่าน `.npmrc` หรือ `package.json` ของโปรเจกต์) แล้วรันจากในนั้น: `npx -y --registry=https://registry.npmjs.org/ --ignore-scripts rea-agents@6.5.0 doctor --json` (REA ระบุว่าคำสั่งนี้อ่านอย่างเดียว) · ผลที่บอกว่า Claude Code ยังไม่ได้ลงทะเบียน REA เป็นเรื่องปกติ เพราะ plugin ลงทะเบียน server ให้เอง ไม่ได้เขียนลง `~/.claude.json`
4. **สรุปเป็นตาราง** 3 คอลัมน์: เรื่อง · สถานะ · ต้องทำอะไร (ถ้ามี)
   - server ไม่ขึ้น → ให้ผู้ใช้เปิด `/mcp` ดู error ของ `plugin:reverse-engineering-mcp:rea` แล้วรีสตาร์ต session
   - provider ขาด (Ghidra + JDK (Java Development Kit) 21 · JADX + JDK 17 · IDA + ida-pro-mcp · Chrome) → บอกว่างานแบบไหนต้องใช้ ไม่ติดตั้งให้เอง
   - งาน JavaScript/Electron · .NET metadata · Go · Rust · PE (Portable Executable — ไฟล์ .exe .dll ของ Windows) resource ไม่ต้องมี provider เพิ่ม
   - tool Frida น่าจะใช้ไม่ได้ เพราะ launcher ปิด install script ของ npm (ตั้งใจ) — ไม่ใช่สิ่งที่ต้องแก้
   - tool ของ plugin นี้ชื่อขึ้นต้น `mcp__plugin_reverse-engineering-mcp_rea__` · ถ้าเห็น `mcp__rea__` แปลว่ามี REA ที่ลงทะเบียนเองอยู่ด้วย ให้บอกผู้ใช้ (hook ถามก่อนทั้งสองชื่อ)
