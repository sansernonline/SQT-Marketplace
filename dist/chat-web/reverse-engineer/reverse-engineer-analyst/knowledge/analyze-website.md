# skill: analyze-website

Use when inspecting how a website feature works — page structure, scripts, network calls, without its backend source.

# Analyze Website

## ขั้นตอน

1. **ยืนยันสิทธิ์และขอบเขต** — อ่านหน้าเว็บและสคริปต์สาธารณะเท่านั้น · ห้ามพยายามเข้าถึงส่วนที่ต้องล็อกอินของคนอื่น ห้ามโจมตี · เคารพ robots.txt และเงื่อนไขการใช้งาน
2. **Engine** — มี REA → ใช้ browser analysis ของ REA (ต้องมี Chrome-family browser) ได้ page structure · scripts · network observations · screenshots
3. **ทำเองเมื่อไม่มี REA** — เปิด view-source และ DevTools: โครง DOM ของ feature · ไฟล์ JS ที่โหลด (มองหา bundle และ source map) · แท็บ Network ดู request/response ของ action ที่สนใจ (method · endpoint · payload shape)
4. **สรุปสัญญาที่เห็น** — endpoint และรูปข้อมูลคือสิ่งที่ฝั่ง client เห็นเท่านั้น · ตรรกะฝั่ง server เดาไม่ได้ ห้ามเขียนเหมือนรู้
5. **รายงานตามกฎหลักฐาน** — ทุกข้อสรุปชี้ request หรือไฟล์จริง · ข้อจำกัด: ไม่เห็น server-side · implementation ของตัวเองทำเฉพาะส่วนที่หลักฐานรองรับ
