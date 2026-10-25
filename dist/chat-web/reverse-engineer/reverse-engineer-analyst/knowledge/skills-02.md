# skill: analyze-native-binary

Use when inspecting a native binary (.exe, .dll, ELF, Mach-O) — strings, symbols, pseudocode, imported calls.

# Analyze Native Binary

## ขั้นตอน

1. **ยืนยันสิทธิ์** — เฉพาะไบนารีที่ผู้ใช้เป็นเจ้าของหรือได้รับอนุญาต
2. **เครื่องมือ** — ใช้ Ghidra / IDA / Hopper ที่ผู้ใช้ติดตั้งเองจากผู้พัฒนาทางการ (เครื่องมือเสียเงินใช้สัญญาอนุญาตของผู้ใช้) · ตรวจว่ามีตัวไหนด้วย `npm run doctor -- --target native` · ไม่มีก็ทำข้อ 3 ด้วยเครื่องมือมาตรฐานได้
3. **สถิตเบื้องต้น (ทำได้ทุกเครื่อง)** — ชนิดไฟล์และสถาปัตยกรรม · strings ที่อ่านได้ (ชื่อฟังก์ชัน · ข้อความ · URL · registry key) · import/export table · section layout
   - มี Ghidra บนเครื่อง → รันแบบไม่เปิดหน้าจอครั้งเดียวได้ชุดผลลัพธ์ครบ: `analyzeHeadless <โฟลเดอร์โปรเจกต์> <ชื่อโปรเจกต์> -import target.exe -scriptPath <โฟลเดอร์สคริปต์> -postScript <สคริปต์ส่งออกของคุณ> -deleteProject` (วิเคราะห์อัตโนมัติเป็นค่าตั้งต้น · `-readOnly` ไม่บันทึกลงโปรเจกต์ · `-log <ไฟล์>` เก็บ log · ตรวจ 2026-10-23 จาก analyzeHeadlessREADME ของ Ghidra) — สคริปต์ส่งออกต้องเขียนเองผ่าน API ของ Ghidra Ghidra ไม่มีให้สำเร็จรูป (ยังไม่ได้ตรวจ)
   - ชุดผลลัพธ์ที่ควรได้จากการรัน 1 ครั้ง: รายชื่อฟังก์ชันพร้อม address · strings พร้อมที่ที่ถูกอ้างถึง (xref) · import/export · C จาก decompiler เฉพาะฟังก์ชันที่สนใจ · disassembly ของฟังก์ชันเดียวกัน
   - **อ่าน C ที่ decompile เทียบกับ disassembly เสมอ** ก่อนอ้างฟังก์ชันไหนในรายงาน: decompiler เดา type และยุบโค้ดได้ผิด ส่วน disassembly คือสิ่งที่รันจริง · แนวคิดจาก ghidra-headless ใน trailofbits/skills-curated (CC-BY-SA) เขียนใหม่ด้วยคำของเรา
4. **ไล่พฤติกรรม** — จากสตริงที่เกี่ยวกับ feature → ฟังก์ชันที่อ้างถึง → เข้าใจอัลกอริทึม · เกม/ไบนารีเก่าให้มองหาค่าคงที่และสูตรคำนวณ
5. **รายงานตามกฎหลักฐาน** — pseudocode ที่สร้างขึ้นต้องบอกว่ามาจากตรงไหน · ข้อจำกัด: ค่าที่คำนวณตอนรัน · packed/obfuscated binary อ่านได้จำกัด ให้บอกตรง ๆ · implementation ใหม่ต้องมีเทสต์เทียบต้นฉบับ (เช่น ชุด input → output)


---

# skill: analyze-website

Use when inspecting how a website feature works — page structure, scripts, network calls, without its backend source.

# Analyze Website

## ขั้นตอน

1. **ยืนยันสิทธิ์และขอบเขต** — อ่านหน้าเว็บและสคริปต์สาธารณะเท่านั้น · ห้ามพยายามเข้าถึงส่วนที่ต้องล็อกอินของคนอื่น ห้ามโจมตี · เคารพ robots.txt และเงื่อนไขการใช้งาน
2. **ตรวจเครื่องมือ** — `npm run doctor -- --target web` ตรวจ Chrome-family browser และ Playwright Core (ตัวเลือก ผู้ใช้ติดตั้งเอง) · การติดตั้งต้องได้รับอนุมัติก่อน
3. **อ่านโครงหน้าแบบสถิต** — เปิด view-source และ DevTools: โครง DOM ของ feature · ไฟล์ JS ที่โหลด (มองหา bundle และ source map) · แท็บ Network ดู request/response ของ action ที่สนใจ (method · endpoint · payload shape) · Playwright (ถ้าผู้ใช้ติดตั้งไว้) ใช้เฉพาะหน้าที่ได้รับอนุญาต และต้องขออนุญาตก่อนให้ browser กดหรือป้อนข้อมูลอัตโนมัติ
4. **สรุปสัญญาที่เห็น** — endpoint และรูปข้อมูลคือสิ่งที่ฝั่ง client เห็นเท่านั้น · ตรรกะฝั่ง server เดาไม่ได้ ห้ามเขียนเหมือนรู้
5. **รายงานตามกฎหลักฐาน** — ทุกข้อสรุปชี้ request หรือไฟล์จริง · ข้อจำกัด: ไม่เห็น server-side · implementation ของตัวเองทำเฉพาะส่วนที่หลักฐานรองรับ
