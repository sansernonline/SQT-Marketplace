---
name: analyze-js-electron
description: Use when inspecting an extracted JavaScript or Electron app directory or ASAR — modules, imports, IPC boundaries, source maps.
---

# Analyze JavaScript / Electron

## ขั้นตอน

1. **ยืนยันสิทธิ์และเป้าหมาย** — โฟลเดอร์ที่แตกแล้วหรือ .asar · ถาม 1 ครั้งถ้าไม่ชัดว่าได้รับอนุญาต
2. **Engine** — มี REA → `npx -y rea-agents@latest analyze-javascript-application <path> --json` ได้ modules · imports · Electron boundaries พร้อม evidence · ไม่มี REA → ทำข้อ 3–5 เอง
3. **สำรวจโครง** — รายการไฟล์ · package.json (dependencies · main · build config) · ถ้า Electron: แยก main / preload / renderer
   - ยังเป็น .asar → หาไฟล์ที่ `resources/app.asar` ข้าง .exe (Windows) หรือ `Contents/Resources/app.asar` (macOS) · โฟลเดอร์ `app.asar.unpacked/` ข้าง ๆ คือ native module ที่แพ็กไม่ได้ · ดูรายชื่อก่อน `npx @electron/asar list app.asar | head -50` → ดึงไฟล์เดียว `npx @electron/asar extract-file app.asar package.json` → แตกทั้งหมด `npx @electron/asar extract app.asar out/` (ไม่ต้องเขียนสคริปต์ 3 คำสั่งพอ · ตรวจ 2026-10-23 จาก `npx -y @electron/asar --help`)
   - ใน out/: `main` ใน package.json = main process · preload หาจาก `webPreferences.preload` ตอนสร้าง BrowserWindow · renderer คือ bundle ที่ HTML โหลด · `ipcMain.handle` / `ipcRenderer.invoke` คู่กันคือขอบเขต IPC
4. **ไล่ feature ที่สนใจ** — ค้นคำจากสิ่งที่ผู้ใช้เห็น (ชื่อปุ่ม · ข้อความใน UI) → ไฟล์ → ฟังก์ชัน → ตาม import ไปเรื่อย · มี source map (.map) → ใช้คืนชื่อและโครงเดิม
5. **รายงานตามกฎหลักฐานของ `reverse-engineer`** — ทุกข้อสรุปชี้ไฟล์และบรรทัด · มีหัวข้อข้อจำกัด (minified อ่านยาก · code ที่โหลดตอนรันมองไม่เห็น) · จบด้วย implementation ของตัวเอง + เทสต์
