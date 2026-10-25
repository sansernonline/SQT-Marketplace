---
name: analyze-js-electron
description: Use when inspecting an extracted JavaScript or Electron app directory or ASAR — modules, imports, IPC boundaries and source maps.
---

# Analyze JavaScript / Electron

## ขั้นตอน

1. **ยืนยันสิทธิ์และเป้าหมาย** — โฟลเดอร์ที่แตกแล้วหรือ .asar · ถาม 1 ครั้งถ้าไม่ชัดว่าได้รับอนุญาต · ทำงานบนสำเนา บันทึก SHA-256 ตามกฎข้อ 7 ของ `reverse-engineer`
2. **สำรวจโครง** — รายการไฟล์ · package.json (dependencies · main · build config) · ถ้า Electron: แยก main / preload / renderer
   - ยังเป็น .asar → หาไฟล์ที่ `resources/app.asar` ข้าง .exe (Windows) หรือ `Contents/Resources/app.asar` (macOS) · โฟลเดอร์ `app.asar.unpacked/` ข้าง ๆ คือ native module ที่แพ็กไม่ได้ · .asar เป็น archive ที่ไม่บีบอัด: ถ้าผู้ใช้ติดตั้ง `@electron/asar` ไว้แล้วใช้คำสั่ง `asar list` / `asar extract` ได้ · ไม่ดึงผ่าน `npx` ตอนรัน · ไม่มีเครื่องมือก็อ่าน header JSON ที่ต้นไฟล์เพื่อดูรายชื่อไฟล์และ offset แล้วดึงเฉพาะไฟล์ที่ต้องการ
   - ใน out/: `main` ใน package.json = main process · preload หาจาก `webPreferences.preload` ตอนสร้าง BrowserWindow · renderer คือ bundle ที่ HTML โหลด · `ipcMain.handle` / `ipcRenderer.invoke` คู่กันคือขอบเขต IPC
3. **ไล่ feature ที่สนใจ** — ค้นคำจากสิ่งที่ผู้ใช้เห็น (ชื่อปุ่ม · ข้อความใน UI) → ไฟล์ → ฟังก์ชัน → ตาม import ไปเรื่อย · มี source map (.map) → ใช้คืนชื่อและโครงเดิม
4. **รายงานตามกฎหลักฐานของ `reverse-engineer`** — ทุกข้อสรุปชี้ไฟล์และบรรทัด · มีหัวข้อข้อจำกัด: static analysis ไม่เห็นค่าและเส้นทางตอนรัน (IPC ที่วิ่งจริง · code ที่โหลดภายหลัง · minified อ่านยาก) ให้บอกตรง ๆ ไม่เขียนเหมือนเห็นพฤติกรรมตอนรัน · จบด้วย implementation ของตัวเอง (โค้ดใหม่ ไม่คัดลอก) + เทสต์เทียบพฤติกรรมต้นฉบับ
