# แอป JavaScript และ Electron

แนวคิดดัดแปลงจาก `javascript-applications.md` ของ REA (MIT · © 2026 morluto) เขียนใหม่ให้ใช้สคริปต์ในเครื่อง ไม่รันโค้ดของแอป

## 1 · หาโค้ด

| แอปวางโค้ดไว้ที่ไหน | ทำอะไร |
|---|---|
| `resources/app.asar` | `python -I scripts/asar_extract.py list <app.asar>` ดูก่อน แล้ว `extract <app.asar> _to_delete/re/<ชื่อ>/app` |
| `resources/app.asar.unpacked/` | ไฟล์ที่ไม่ได้อยู่ใน archive (มักเป็น `.node` และ binary) คัดลอกโฟลเดอร์นี้ไปวางข้างผลที่แตกเอง |
| `resources/app/` | โค้ดไม่ได้ถูกรวม อ่านได้เลย |
| เว็บแอป | โหลด bundle จากเว็บของผู้ใช้ หรือเอามาจากโฟลเดอร์ build (ดู [web-and-network](web-and-network.md)) |

- `asar_extract.py` ปฏิเสธ path ที่มี `..` path เต็ม หรือ drive letter จึงไม่มีไฟล์หลุดออกนอกโฟลเดอร์ปลายทาง · ข้าม symlink · เตือนถ้าไฟล์ไม่ตรงกับ integrity hash ใน header (แปลว่า archive ถูกแก้หลัง build)
- รันซ้ำได้ ไฟล์เดิมถูกเขียนทับด้วยเนื้อเดิม

## 2 · อ่านตามลำดับนี้

1. `package.json` — ชื่อ รุ่น `main` (จุดเข้าของ main process) และ dependency
2. ไฟล์ `main` — สร้าง `BrowserWindow` ที่ไหน ตั้ง `webPreferences` อะไร (`nodeIntegration` · `contextIsolation` · `sandbox` · `preload`)
3. preload — `contextBridge.exposeInMainWorld` เปิดอะไรให้หน้าเว็บ
4. ช่อง IPC (Inter-Process Communication — ช่องส่งข้อความระหว่าง process): หา `ipcMain.handle` · `ipcMain.on` · `ipcRenderer.invoke` · `ipcRenderer.send` แล้วจับคู่ด้วยชื่อช่องที่เป็นตัวอักษรตรงกันเท่านั้น
5. `.node` (native module) — เป็น binary ใช้ [native-binaries](native-binaries.md) ต่อ

```bash
grep -rnoE "ipc(Main|Renderer)\.(handle|on|invoke|send)\(['\"][^'\"]+" _to_delete/re/<ชื่อ>/app --include=*.js | head -50
```

## 3 · source map ให้ต้นฉบับคืน

```bash
python -I scripts/sourcemap_list.py _to_delete/re/<ชื่อ>/app                    # map ที่เจอ · ชื่อไฟล์ต้นฉบับ
python -I scripts/sourcemap_list.py _to_delete/re/<ชื่อ>/app --extract _to_delete/re/<ชื่อ>/src
```

- map ที่มี `sourcesContent` = มีข้อความต้นฉบับ (TypeScript · JSX) ฝังอยู่ สคริปต์เขียนออกมาให้ โดยตัด `webpack://` `..` และ drive letter ทิ้ง ไฟล์จึงไม่หลุดนอกโฟลเดอร์
- map ที่ชี้ไป URL ภายนอก สคริปต์แค่รายงาน ไม่ดาวน์โหลด · จะโหลดต้องถามผู้ใช้ และต้องเป็นเว็บของผู้ใช้
- ต้นฉบับจาก map ยังเป็นหลักฐาน ไม่ใช่ซอร์สที่ส่งมอบ อาจเก่ากว่าโค้ดที่ build จริง ให้เทียบชื่อฟังก์ชันกับ bundle

## 4 · โค้ดที่ถูกย่อ

- จัดรูปด้วย formatter ที่มีในโปรเจกต์อยู่แล้ว (เช่น Prettier ใน `node_modules` ของโปรเจกต์) · ไม่มีก็อ่านแบบเดิม แล้วค้นด้วย string ที่เห็นในหน้าจอหรือ error
- ชื่อที่ถูกย่อ (`a` `b` `e`) และเลข module ของ webpack ไม่ใช่ตัวตน · ใช้ string · ชื่อ API · route เป็นจุดยึด
- ทุกสิ่งที่พบจาก syntax เป็น `จากแหล่ง` · ห้ามสรุปว่าโค้ดถูกรันถึงจริง หรือด่านถูกบังคับใช้จริง จากการอ่านอย่างเดียว

## 5 · เทียบ 2 รุ่น

- แตกแต่ละรุ่นครั้งเดียว แล้วเทียบรายการไฟล์และ SHA-256 (ดู [evidence-ledger](evidence-ledger.md#4--เทียบ-2-รุ่นหรือ-2-ไฟล์))
- บอกว่า "เพิ่ม" หรือ "หาย" ได้เมื่อดูอีกฝั่งครบแล้วเท่านั้น
- ค่าที่คำนวณตอนรัน ยังเป็นสิ่งที่ยังไม่รู้ จนกว่าจะเห็นตอนรัน (ต้องถามตาม [runtime-observation](runtime-observation.md))
