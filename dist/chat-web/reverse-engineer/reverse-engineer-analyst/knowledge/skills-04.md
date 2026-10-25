# skill: analyze-network

Use when inspecting saved HAR or PCAP traffic, or observing an authorized test app through Wireshark or mitmproxy.

# Analyze Network

## ขั้นตอน

1. **ยืนยันสิทธิ์และขอบเขต** — ระบุเจ้าของทราฟฟิก เป้าหมาย และช่วงเวลา · การอ่าน capture ไม่ได้ให้สิทธิ์ดักทราฟฟิกใหม่ · ห้ามดักหรือถอดรหัสทราฟฟิกของบุคคลอื่น
2. **ตรวจเครื่องมือ** — `npm run doctor -- --target network` · ถ้าไม่มีให้รายงานสิ่งที่ยังตรวจไม่ได้ ไม่ติดตั้งเอง
3. **อ่าน capture ที่มีอยู่ก่อน** — ทำสำเนาและบันทึก SHA-256 · ใช้ Wireshark ดูภาพรวม หรือ TShark สรุป protocol, endpoint, DNS และ TLS metadata · เริ่มจาก display filter ที่จำกัดเฉพาะเป้าหมาย ไม่เปิดผลขนาดใหญ่ทั้งไฟล์
4. **ต้องสังเกตทราฟฟิกใหม่** — ขออนุญาตทุกครั้งก่อนรันแอป เปิด proxy หรือเปลี่ยนการตั้งค่าอุปกรณ์ · ใช้ mitmproxy เฉพาะระบบทดสอบที่ได้รับอนุญาต · บอกผลข้างเคียง เช่น ใบรับรอง และคืนค่าการตั้งค่าเมื่อจบ
5. **ปกป้องข้อมูล** — ถือว่า HAR, PCAP และ proxy capture มี cookie, token และข้อมูลส่วนบุคคล · รายงานเฉพาะชื่อ ตำแหน่ง และรูปข้อมูลที่จำเป็น ห้ามใส่ค่าลับหรือ payload ดิบในรายงาน
6. **รายงานตามหลักฐาน** — ระบุไฟล์, filter, packet/frame หรือ request ที่เห็นจริง · แยกสิ่งที่เห็นจากการอนุมาน · ข้อจำกัด: การไม่พบ request ใน capture ไม่ได้แปลว่าไม่มี และ TLS ที่ไม่ได้ถอดรหัสไม่เปิดเผย payload


---

# skill: analyze-firmware

Use when statically inspecting an authorized firmware image, embedded archive, or extracted filesystem with Binwalk or Unblob.

# Analyze Firmware

## ขั้นตอน

1. **ยืนยันสิทธิ์และขอบเขต** — เฉพาะ firmware ที่ผู้ใช้เป็นเจ้าของหรือได้รับอนุญาต · ห้ามเขียนหรือ flash อุปกรณ์โดยไม่ได้ขออนุญาตแยก
2. **เก็บต้นฉบับ** — ทำงานบนสำเนา บันทึก SHA-256 และแหล่งที่มา · ห้ามรัน executable ที่แตกได้บนเครื่องผู้ใช้
3. **ตรวจเครื่องมือ** — `npm run doctor -- --target firmware` · Binwalk/Unblob มักทำงานใน Linux หรือ WSL; ตัวตรวจบน Windows ไม่มองเข้าไปใน WSL จึงต้องบอกข้อจำกัดนี้
4. **คัดแยกแบบสถิต** — ระบุขนาด, magic bytes, signature, partition และ entropy ก่อนแตก · ใช้ Binwalk หาตำแหน่งและชนิดข้อมูล ใช้ Unblob แตกไปยังโฟลเดอร์ผลลัพธ์แยก · จำกัดพื้นที่และไม่เขียนทับไฟล์เดิม
5. **ตรวจผลที่แตก** — สร้างรายการไฟล์, filesystem, configuration และ native binary · ส่ง binary ที่สนใจต่อ `analyze-native-binary` · signature ที่พบไม่ยืนยันโครงสร้างทั้งหมด และข้อมูลที่เข้ารหัสหรือ obfuscate ให้ติดป้าย `ยังไม่ได้ตรวจ`
6. **รายงานตามหลักฐาน** — ทุกข้อสรุปชี้ไฟล์, offset หรือ path ใน image · ห้ามอ้างพฤติกรรมตอนรันจาก static evidence และห้ามเผยคีย์หรือข้อมูลลับที่พบ
