# CHANGELOG — reverse-engineer

## 0.1.0 (2026-10-22)

- plugin ใหม่ — ลอกสถาปัตยกรรมของ REA (github.com/morluto/rea): จุดเข้าเดียว (skill `reverse-engineer`) ส่งต่อ module ตามประเภท target · evidence-first ทุกข้อสรุปมีหลักฐานและข้อจำกัด · ใช้ REA เป็น engine เมื่อมี (`npx rea-agents@latest`) ไม่มีก็วิเคราะห์สถิตเอง
- module: `analyze-js-electron` · `analyze-native-binary` · `analyze-website` · `analyze-dotnet` · `analyze-apk`
- agent `reverse-engineer-analyst` · คำสั่ง `/reverse-engineer:re`
- เฉพาะซอฟต์แวร์ที่ผู้ใช้เป็นเจ้าของหรือได้รับอนุญาตเท่านั้น
