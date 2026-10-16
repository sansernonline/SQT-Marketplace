# เว็บแอป และทราฟฟิกที่บันทึกไว้

แนวคิดดัดแปลงจาก `runtime-observation.md` และ `evidence-workflows.md` ของ REA (MIT · © 2026 morluto) ส่วนไฟล์ทราฟฟิก เขียนใหม่ให้ใช้สคริปต์ในเครื่อง

## 1 · เว็บแอปของผู้ใช้

- เป้าหมายต้องเป็นเว็บของผู้ใช้หรือลูกค้าที่มีสัญญา จดโดเมนที่อยู่ในขอบเขตลงบันทึกสิทธิ์ · โดเมนอื่นที่หน้าเว็บเรียก (CDN · analytics · payment) ดูได้แค่ใน capture ไม่ไปยิงเอง
- โค้ดฝั่งเบราว์เซอร์: เอาจากโฟลเดอร์ build ของผู้ใช้ก่อน ถ้าไม่มีให้ผู้ใช้กด "Save as" หรือส่งไฟล์มา · ต่อด้วย `sourcemap_list.py` และ [javascript-electron](javascript-electron.md)
- ห้ามยิง request ซ้ำ ห้ามลอง login ห้ามสแกนหาช่องโหว่ ถ้าไม่ได้ตกลงไว้ในขอบเขต · งานทดสอบความปลอดภัยส่งต่อ `security-engineer`

## 2 · ให้ผู้ใช้บันทึก HAR (HTTP Archive) เอง

ผู้ใช้เป็นคนกด agent ไม่สั่งเบราว์เซอร์เอง:

1. เปิด DevTools (F12) → แท็บ Network → ติ๊ก "Preserve log"
2. ทำขั้นตอนที่ต้องการดู 1 รอบ
3. คลิกขวาในรายการ → "Save all as HAR" (Chrome · Edge) แล้ววางไฟล์ไว้ใน `_to_delete/re/<ชื่อ>/`

**HAR มี cookie token และข้อมูลส่วนตัวเต็ม ๆ** ให้ถือเป็นความลับ เก็บใน `_to_delete/` ไม่ commit ไม่ส่งต่อ และบอกผู้ใช้ให้ลบเมื่อจบงาน · ถ้าใช้ session จริง แนะนำให้ผู้ใช้ logout หลังบันทึก เพื่อให้ token ในไฟล์หมดอายุ

## 3 · สรุป HAR

```bash
python -I scripts/har_summary.py <capture.har>                       # ทั้งไฟล์
python -I scripts/har_summary.py <capture.har> --host api.example.com # เฉพาะ host เดียว
```

ได้: host และจำนวนครั้ง · status code · endpoint จัดกลุ่มตาม method + host + รูปแบบ path (เลข id และ uuid กลายเป็น `{id}`) · ชื่อ query parameter · ชนิดข้อมูลที่ตอบ · วิธียืนยันตัวตน

- ค่าของ header cookie และ query **ถูกตัดทิ้งทั้งหมด** เหลือแค่ชื่อและคำนำหน้าอย่าง `Bearer` `Basic` · ผลจึงแปะในรายงานได้
- การจัดกลุ่ม path เป็น `อนุมาน` ไม่ใช่ schema ของ server · endpoint ที่ไม่ได้กดใน capture ถือว่ายังไม่รู้ ไม่ใช่ไม่มี
- ต้องดู body ของ request หรือ response ให้เปิด HAR อ่านเฉพาะ entry ที่ต้องการ แล้วเขียนแต่โครง (ชื่อ field · ชนิด) ลงรายงาน ไม่ใช่ค่า

## 4 · ไฟล์ pcap (packet capture)

ใช้ Wireshark หรือ tshark ที่ผู้ใช้ติดตั้งจาก wireshark.org · การอ่านไฟล์ที่บันทึกแล้วไม่ต้องถามซ้ำ แต่การดักทราฟฟิกสดต้องถามทุกครั้ง

```bash
tshark -r <file.pcap> -q -z conv,tcp          # ใครคุยกับใคร
tshark -r <file.pcap> -q -z http,tree         # สรุป HTTP
tshark -r <file.pcap> -Y dns -T fields -e dns.qry.name | sort | uniq -c | sort -rn | head -50
```

- TLS ที่ไม่มี key log อ่านได้แค่ชื่อ host (SNI) และขนาด · อย่าอ้างว่าเห็นเนื้อหา
- SAZ ของ Fiddler เป็น ZIP ที่มีไฟล์ request/response แยก แตกด้วย `python -m zipfile -e` แล้วอ่านทีละไฟล์

## 5 · โปรโตคอลที่ไม่รู้จัก

1. เก็บตัวอย่างอย่างน้อย 3 ชุดที่ต่างกันทีละอย่าง (ค่าเดียวเปลี่ยน)
2. เทียบ byte ต่อ byte หา header · ความยาว · ตัวนับ · checksum
3. เขียน parser ที่เช็กขนาดก่อนอ่านทุกครั้ง แล้วรันกับตัวอย่างทั้งหมด · ผลตรงทุกชุดจึงติด `ตรวจจริง`
4. ค่าที่เห็นค่าเดียวในทุกตัวอย่าง จดเป็นสิ่งที่ยังไม่รู้ ไม่ตั้งชื่อให้เอง
