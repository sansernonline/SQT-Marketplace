# ค่าตั้งที่ช่วยประหยัด context

ย้ายมาจาก `SKILL.md` ข้อ 7 · เปิดเมื่อจะแนะนำผู้ใช้ปรับค่าตั้ง

| ทำอะไร | ได้อะไร |
|---|---|
| **ปิด MCP server ที่ไม่ได้ใช้ในงานนั้น** · มี CLI ทำได้ใช้ CLI | ชื่อ tool และคำแนะนำของทุก server ยังโหลดทุกเซสชัน |
| เลือกโมเดลและ effort ตั้งแต่ต้นเซสชัน | เปลี่ยนโมเดลกลางทางทำให้ cache หาย ต้องอ่านบทสนทนาใหม่ทั้งหมด (เปลี่ยน effort บน Opus · Sonnet · Haiku 5.5 และ Fable 5.1 ผ่าน Application Programming Interface (API) key หรือ subscription cache ไม่หาย · ผ่าน Bedrock · Agent Platform · gateway หรือการตั้งค่าพิเศษ ดูเงื่อนไขในลิงก์) · ([Claude Code: prompt caching](https://code.claude.com/docs/en/prompt-caching) · ตรวจ 21 ต.ค. 2569) |
| fast mode — ผู้ใช้เปิดเองด้วย `/fast` ตอนต้นเซสชัน · agent ไม่เปิดเอง | Opus เท่านั้น · สร้างข้อความเร็วขึ้นสูงสุด 2.5 เท่า แต่ token แรกไม่เร็วขึ้น · ราคา 2 เท่า ผู้ใช้ subscription จ่ายจาก usage credits ไม่ใช่โควตา · คุ้มกับขั้นที่เขียนชิ้นยาว ไม่คุ้มกับขั้นสั้นที่รอ tool · เปิดกลางทางจ่ายราคา fast กับบทสนทนาทั้งหมดที่ไม่มี cache 1 ครั้ง · ([Claude Code: fast mode](https://code.claude.com/docs/en/fast-mode) · [API: fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) · ตรวจ 21 ต.ค. 2569) |
| ปิดปลั๊กอินที่ไม่เกี่ยวกับงานนั้น | description ของ skill ทุกตัวอยู่ใน context เสมอ |
| `permissions.deny` ใน `.claude/settings.json` สำหรับโฟลเดอร์ที่ไม่ควรอ่าน | ระบบกันพลาดให้ ไม่ต้องพึ่งวินัย |
| `/clear` เมื่อเปลี่ยนเรื่อง (ไม่เสียอะไร) · `/compact <สิ่งที่ต้องเก็บ>` ที่จุดพักของงาน ไม่รอจนใกล้เต็ม · เดินผิดทาง → `/rewind` กลับจุดก่อนหน้า | คืนที่ว่าง · `/compact` ตอน cache ยังอุ่นถูก แต่หลังพักนานต้องอ่านทั้งบทสนทนาใหม่ · `/rewind` ตัดกลับไปจุดที่ cache มีอยู่แล้ว |
| `CLAUDE.md` ของโปรเจกต์ไม่เกิน 40 บรรทัด · `~/.claude/CLAUDE.md` (ใช้ทุกโปรเจกต์) ไม่เกิน 60 บรรทัด — เป็นเพดานของชุดนี้เอง เข้มกว่าเอกสารทางการที่แนะนำไม่เกิน 200 · ตัวที่แจกใน `scripts/install/CLAUDE.global.md` ยาว 84 (เกินเพดาน รอตัด) | ทุกบรรทัดกิน token ทุกเซสชัน |
