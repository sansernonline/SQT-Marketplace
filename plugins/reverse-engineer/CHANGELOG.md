# CHANGELOG — reverse-engineer

## Unreleased

- เลิกใช้ REA engine และ `npx rea-agents` ตามการตัดสินใจ 2026-10-15 (ไม่ดึงเครื่องมือจาก registry สาธารณะตอนรัน · ไม่ฝังโค้ด REA) · ทุก module วิเคราะห์สถิตด้วยเครื่องมือมาตรฐานที่ผู้ใช้ติดตั้งเอง
- เพิ่ม `tools.json` รวม 12 เครื่องมือ (Ghidra, IDA, Hopper, JADX, Apktool, ADB, Chrome, Playwright Core, Wireshark, mitmproxy, Binwalk, Unblob) พร้อมแหล่งติดตั้งทางการ
- เพิ่ม `scripts/check-tools.mjs` ตรวจ PATH, ตำแหน่งติดตั้งมาตรฐาน และ Node package โดยไม่เปิดเป้าหมายและไม่ติดตั้งโปรแกรม · รองรับ `--target` และ `--json` · `npm run doctor` และ `npm test` (ตรวจโครง `tools.json`)
- เพิ่ม module `analyze-network` (HAR · PCAP · Wireshark · mitmproxy) และ `analyze-firmware` (Binwalk · Unblob) พร้อมกฎสำเนา + SHA-256, ขออนุญาตก่อนสังเกตของใหม่ และปกป้องค่าลับ
- เพิ่มขั้นตอน Android Debug Bridge (ADB) ใน `analyze-apk` พร้อมกฎขออนุญาตแยกก่อนควบคุมอุปกรณ์
- entry skill เพิ่มกฎกลาง: ทำงานบนสำเนา + SHA-256 · ขออนุญาตก่อนรัน/ควบคุม/ดักทราฟฟิก · เป้าหมายไม่น่าไว้ใจรันใน sandbox เท่านั้น · แก้จำนวน module เป็น 7

## 0.1.0 (2026-10-22)

- plugin ใหม่ — จุดเข้าเดียว (skill `reverse-engineer`) ส่งต่อ module ตามประเภท target · evidence-first ทุกข้อสรุปมีหลักฐานและข้อจำกัด
- module: `analyze-js-electron` · `analyze-native-binary` · `analyze-website` · `analyze-dotnet` · `analyze-apk`
- agent `reverse-engineer-analyst` · คำสั่ง `/reverse-engineer:re`
- เฉพาะซอฟต์แวร์ที่ผู้ใช้เป็นเจ้าของหรือได้รับอนุญาตเท่านั้น
