---
name: analyze-firmware
description: Use when statically inspecting an authorized firmware image, embedded archive, or extracted filesystem with Binwalk or Unblob.
---

# Analyze Firmware

## ขั้นตอน

1. **ยืนยันสิทธิ์และขอบเขต** — เฉพาะ firmware ที่ผู้ใช้เป็นเจ้าของหรือได้รับอนุญาต · ห้ามเขียนหรือ flash อุปกรณ์โดยไม่ได้ขออนุญาตแยก
2. **เก็บต้นฉบับ** — ทำงานบนสำเนา บันทึก SHA-256 และแหล่งที่มา · ห้ามรัน executable ที่แตกได้บนเครื่องผู้ใช้
3. **ตรวจเครื่องมือ** — `npm run doctor -- --target firmware` · Binwalk/Unblob มักทำงานใน Linux หรือ WSL; ตัวตรวจบน Windows ไม่มองเข้าไปใน WSL จึงต้องบอกข้อจำกัดนี้
4. **คัดแยกแบบสถิต** — ระบุขนาด, magic bytes, signature, partition และ entropy ก่อนแตก · ใช้ Binwalk หาตำแหน่งและชนิดข้อมูล ใช้ Unblob แตกไปยังโฟลเดอร์ผลลัพธ์แยก · จำกัดพื้นที่และไม่เขียนทับไฟล์เดิม
5. **ตรวจผลที่แตก** — สร้างรายการไฟล์, filesystem, configuration และ native binary · ส่ง binary ที่สนใจต่อ `analyze-native-binary` · signature ที่พบไม่ยืนยันโครงสร้างทั้งหมด และข้อมูลที่เข้ารหัสหรือ obfuscate ให้ติดป้าย `ยังไม่ได้ตรวจ`
6. **รายงานตามหลักฐาน** — ทุกข้อสรุปชี้ไฟล์, offset หรือ path ใน image · ห้ามอ้างพฤติกรรมตอนรันจาก static evidence และห้ามเผยคีย์หรือข้อมูลลับที่พบ
