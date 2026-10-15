# Changelog — reverse-engineering-mcp

## 0.1.1 — 2026-10-15

แก้ตามผลรีวิว · ยังไม่ได้ลองเปิด server จริง

- launcher รัน npx จาก `CLAUDE_PLUGIN_DATA` หรือโฟลเดอร์ชั่วคราว ไม่ใช่โฟลเดอร์โปรเจกต์ · บังคับ registry ทางการ · ปิด install script ของ dependency (tool Frida จึงน่าจะใช้ไม่ได้) · Windows ใช้ `cmd.exe` แบบ path เต็ม · `--print` แสดง cwd และ env
- hook ถามเพิ่มอีก 9 tool ที่อ่านข้อมูลสดจากหน้าเว็บ แอป Electron หรืออุปกรณ์ Android (รวม 34 tool) · จับทั้งชื่อจาก plugin และ REA ที่ลงทะเบียนเองชื่อ `rea` · input ไม่มีชื่อ tool ก็ถาม · self-test ไล่ทุกชื่อและตรวจจำนวนรวม
- เป้าหมายที่ไม่น่าไว้ใจ: ตอบ no ที่หน้าถาม แล้วติดตั้ง `rea-agents@6.5.0` แยกใน `docker-sandbox` (server ของ plugin รันบนเครื่องเสมอ)
- skill: ส่ง path เต็มให้ tool · ทำเฉพาะเป้าหมายและขั้นตอนที่ตกลง · ห้ามเรียกซ้ำหลังผู้ใช้ปฏิเสธ · `rea-check` ให้ผู้ใช้พิมพ์เอง และตรวจลึกจากโฟลเดอร์ว่าง · เขียนตัวย่อเต็มครั้งแรก
- README: หัวข้อความน่าเชื่อถือของ upstream และสิ่งที่ต้องตรวจก่อนเปิดใช้ (`npm view` · เทียบ tarball)
- `validate-marketplace.mjs` ปฏิเสธช่วงรุ่น (`@^` `@~` `@*` `@6` `@6.5`) · launcher ต้องล็อกรุ่น (ไม่นับ comment) · ตรวจ `mcpServers` ใน plugin.json และ marketplace.json ด้วย

## 0.1.0 — 2026-10-15

รุ่นแรก · ยังไม่ได้ลองเปิด server จริง (รออนุมัติจากเจ้าของ)

- `.mcp.json` เปิด REA (Reverse Engineer Anything) MCP server ล็อกรุ่น `rea-agents@6.5.0` ผ่าน `scripts/rea-launch.mjs` · ใช้ไฟล์เดียวทุกระบบ ไม่ต้อง `cmd /c` บน Windows
- hook `ask-before-run.mjs` ให้ Claude Code ถามทุกครั้งก่อนเรียก 25 tool ที่รันเป้าหมาย เกาะ process ที่รันอยู่ หรือแก้อุปกรณ์ Android
- skill `reverse-engineer-anything` ดัดแปลงจาก skill ของ REA รุ่น 6.5.0 (MIT) เป็นภาษาไทย · ตัดส่วนติดตั้งและ `@latest` · เพิ่มกฎสิทธิ์ · ส่ง .NET และการคัดแยกไฟล์ไป `software-company:reverse-engineering`
- คำสั่ง `rea-check` · `rea-investigate` · `rea-compare`
